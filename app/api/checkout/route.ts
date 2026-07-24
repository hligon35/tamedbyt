import { NextResponse } from "next/server";
import { products } from "@/lib/data";
import { stripe } from "@/lib/stripe";

const TANGIBLE_GOODS_TAX_CODE = "txcd_99999999";

export async function POST(request: Request) {
  try {
    const { items } = await request.json() as { items?: Array<{ id: string; quantity: number }> };
    if (!Array.isArray(items) || !items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

    const lineItems = items.map(({ id, quantity }) => {
      const product = products.find((item) => item.id === id);
      if (!product) throw new Error(`Unknown product: ${id}`);
      return {
        quantity: Math.max(1, Math.min(10, Number(quantity) || 1)),
        price_data: {
          currency: "usd",
          unit_amount: product.unitAmount,
          tax_behavior: "exclusive" as const,
          product_data: {
            name: product.title,
            description: product.benefit,
            tax_code: TANGIBLE_GOODS_TAX_CODE
          }
        }
      };
    });

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      automatic_tax: { enabled: false },
      line_items: lineItems,
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop?checkout=cancelled`,
      metadata: { type: "store_order", tax_bypassed_for_testing: "true" }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to start checkout" }, { status: 500 });
  }
}