import { NextResponse } from "next/server";
import { appointmentServices, products } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

const HAIRDRESSING_TAX_CODE = "txcd_20040001";
const TANGIBLE_GOODS_TAX_CODE = "txcd_99999999";

type RequestedProduct = { id?: string; quantity?: number };
type DatabaseError = { code?: string; message?: string; details?: string; hint?: string };

function isSchemaError(error: unknown) {
  const value = error as DatabaseError | null;
  const message = [value?.message, value?.details, value?.hint].filter(Boolean).join(" ");
  return value?.code === "PGRST204" || value?.code === "PGRST205" || value?.code === "42703" || /schema cache|column .* does not exist|appointments.*not found/i.test(message);
}

export async function POST(request: Request) {
  let appointmentId = "";

  try {
    const body = await request.json();
    const service = appointmentServices.find((item) => item.id === body.serviceId);

    if (!service || !body.startsAt || !body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "Complete every required field" }, { status: 400 });
    }

    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(startsAt.getTime() + service.duration * 60000);
    if (!Number.isFinite(startsAt.getTime()) || startsAt.getTime() < Date.now()) {
      return NextResponse.json({ error: "Choose a valid future time" }, { status: 400 });
    }

    const requestedProducts = Array.isArray(body.products) ? (body.products as RequestedProduct[]) : [];
    const selectedProducts = requestedProducts.flatMap((requested) => {
      const product = products.find((item) => item.id === requested.id);
      const quantity = Math.max(0, Math.min(10, Math.floor(Number(requested.quantity) || 0)));
      return product && quantity > 0
        ? [{ id: product.id, title: product.title, unitAmount: product.unitAmount, quantity }]
        : [];
    });

    const productTotal = selectedProducts.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
    const subtotalDueToday = service.deposit + productTotal;
    const supabase = getSupabaseAdmin();

    const { data: conflicts, error: conflictError } = await supabase
      .from("appointments")
      .select("id")
      .lt("starts_at", endsAt.toISOString())
      .gt("ends_at", startsAt.toISOString())
      .in("status", ["pending", "confirmed"]);

    if (conflictError) {
      if (isSchemaError(conflictError)) {
        return NextResponse.json(
          { error: "The booking database is not ready. Run the latest supabase/schema.sql in the Supabase SQL Editor, then restart the app." },
          { status: 503 }
        );
      }
      throw conflictError;
    }

    if (conflicts?.length) {
      return NextResponse.json({ error: "That time was just reserved. Choose another slot." }, { status: 409 });
    }

    const customerEmail = String(body.email).trim().toLowerCase();
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        service_id: service.id,
        service_name: service.title,
        service_category: service.categoryTitle,
        service_price_amount: service.priceAmount,
        customer_name: String(body.name).trim(),
        customer_email: customerEmail,
        customer_phone: String(body.phone).trim(),
        notes: String(body.notes || "").trim(),
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        deposit_amount: service.deposit,
        products: selectedProducts,
        product_total_amount: productTotal,
        checkout_subtotal_amount: subtotalDueToday,
        checkout_total_amount: subtotalDueToday,
        tax_amount: 0,
        status: subtotalDueToday === 0 ? "confirmed" : "pending",
        confirmed_at: subtotalDueToday === 0 ? new Date().toISOString() : null
      })
      .select("id")
      .single();

    if (error) {
      if (isSchemaError(error)) {
        return NextResponse.json(
          { error: "The appointments table is missing required columns. Run the latest supabase/schema.sql in the Supabase SQL Editor, then restart the app." },
          { status: 503 }
        );
      }
      throw error;
    }

    appointmentId = appointment.id;
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    if (subtotalDueToday === 0) {
      return NextResponse.json({ url: `${origin}/book/success?appointment_id=${appointment.id}` });
    }

    const appointmentDescription = [
      `${service.categoryTitle} · ${service.displayDuration}`,
      `Appointment: ${startsAt.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "full", timeStyle: "short" })}`,
      service.deposit < service.priceAmount
        ? `Starting service price ${service.displayPrice}; $${(service.deposit / 100).toFixed(2)} due today`
        : "Service payment due today"
    ].join(" · ");

    const lineItems = [
      ...(service.deposit > 0
        ? [{
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: service.deposit,
              tax_behavior: "exclusive" as const,
              product_data: {
                name: service.title,
                description: appointmentDescription,
                tax_code: HAIRDRESSING_TAX_CODE
              }
            }
          }]
        : []),
      ...selectedProducts.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: item.unitAmount,
          tax_behavior: "exclusive" as const,
          product_data: {
            name: item.title,
            description: "Added to appointment for salon pickup",
            tax_code: TANGIBLE_GOODS_TAX_CODE
          }
        }
      }))
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      automatic_tax: { enabled: false },
      customer_email: customerEmail,
      billing_address_collection: "auto",
      line_items: lineItems,
      success_url: `${origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?checkout=cancelled&service=${encodeURIComponent(service.id)}`,
      metadata: {
        type: "appointment",
        appointment_id: appointment.id,
        service_id: service.id,
        service_name: service.title,
        tax_bypassed_for_testing: "true",
        products: selectedProducts.map((item) => `${item.title} x${item.quantity}`).join(", ").slice(0, 500)
      },
      payment_intent_data: {
        receipt_email: customerEmail,
        description: `${service.title} appointment with ${selectedProducts.length} product selection(s)`,
        metadata: {
          appointment_id: appointment.id,
          service_name: service.title,
          product_total: String(productTotal),
          tax_bypassed_for_testing: "true"
        }
      }
    });

    await supabase.from("appointments").update({ stripe_session_id: session.id }).eq("id", appointment.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Booking checkout failed:", error);

    if (appointmentId) {
      try {
        const supabase = getSupabaseAdmin();
        await supabase.from("appointments").update({ status: "expired" }).eq("id", appointmentId).eq("status", "pending");
      } catch (cleanupError) {
        console.error("Unable to release failed appointment:", cleanupError);
      }
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reserve appointment" },
      { status: 500 }
    );
  }
}