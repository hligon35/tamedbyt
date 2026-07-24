import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  const signature = (await headers()).get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "Webhook is not configured" }, { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(await request.text(), signature, secret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.metadata?.type === "appointment" && session.metadata.appointment_id) {
        const supabase = getSupabaseAdmin();
        await supabase
          .from("appointments")
          .update({
            status: "confirmed",
            stripe_payment_intent_id: String(session.payment_intent || ""),
            checkout_subtotal_amount: session.amount_subtotal || 0,
            tax_amount: session.total_details?.amount_tax || 0,
            checkout_total_amount: session.amount_total || 0,
            confirmed_at: new Date().toISOString()
          })
          .eq("id", session.metadata.appointment_id);
      }
    }

    if (event.type === "checkout.session.expired") {
      const session = event.data.object;
      if (session.metadata?.type === "appointment" && session.metadata.appointment_id) {
        const supabase = getSupabaseAdmin();
        await supabase
          .from("appointments")
          .update({ status: "expired" })
          .eq("id", session.metadata.appointment_id)
          .eq("status", "pending");
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook" }, { status: 400 });
  }
}