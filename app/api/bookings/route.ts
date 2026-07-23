import { NextResponse } from "next/server";
import { services } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const service = services.find((item) => item.id === body.serviceId);
    if (!service || !body.startsAt || !body.name || !body.email || !body.phone) return NextResponse.json({ error: "Complete every required field" }, { status: 400 });

    const startsAt = new Date(body.startsAt);
    const endsAt = new Date(startsAt.getTime() + service.duration * 60000);
    if (!Number.isFinite(startsAt.getTime()) || startsAt.getTime() < Date.now()) return NextResponse.json({ error: "Choose a valid future time" }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data: conflicts, error: conflictError } = await supabase.from("appointments").select("id").lt("starts_at", endsAt.toISOString()).gt("ends_at", startsAt.toISOString()).in("status", ["pending", "confirmed"]);
    if (conflictError) throw conflictError;
    if (conflicts?.length) return NextResponse.json({ error: "That time was just reserved. Choose another slot." }, { status: 409 });

    const { data: appointment, error } = await supabase.from("appointments").insert({
      service_id: service.id,
      service_name: service.title,
      customer_name: String(body.name).trim(),
      customer_email: String(body.email).trim().toLowerCase(),
      customer_phone: String(body.phone).trim(),
      notes: String(body.notes || "").trim(),
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      deposit_amount: service.deposit,
      status: "pending"
    }).select("id").single();
    if (error) throw error;

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: String(body.email).trim().toLowerCase(),
      line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: service.deposit, product_data: { name: `${service.title} appointment deposit`, description: startsAt.toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "full", timeStyle: "short" }) } } }],
      success_url: `${origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?checkout=cancelled`,
      metadata: { type: "appointment", appointment_id: appointment.id }
    });

    await supabase.from("appointments").update({ stripe_session_id: session.id }).eq("id", appointment.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to reserve appointment" }, { status: 500 });
  }
}
