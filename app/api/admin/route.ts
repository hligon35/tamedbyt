import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";
import { products } from "@/lib/data";

function authorized(request: Request) {
  const configured = process.env.ADMIN_DASHBOARD_KEY;
  return Boolean(configured && request.headers.get("x-admin-key") === configured);
}

function denied() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!authorized(request)) return denied();

  try {
    const supabase = getSupabaseAdmin();
    const [{ data: appointments, error: appointmentsError }, { data: inventory, error: inventoryError }, { data: coupons, error: couponsError }] = await Promise.all([
      supabase.from("appointments").select("*").order("starts_at", { ascending: true }).limit(250),
      supabase.from("product_inventory").select("*").order("product_name", { ascending: true }),
      supabase.from("coupon_codes").select("*").order("created_at", { ascending: false })
    ]);

    if (appointmentsError) throw appointmentsError;
    if (inventoryError) throw inventoryError;
    if (couponsError) throw couponsError;

    const inventoryMap = new Map((inventory || []).map((item) => [item.product_id, item]));
    const normalizedInventory = products.map((product) => inventoryMap.get(product.id) || {
      product_id: product.id,
      product_name: product.title,
      quantity: 0,
      low_stock_threshold: 3,
      active: true
    });

    return NextResponse.json({ appointments: appointments || [], inventory: normalizedInventory, coupons: coupons || [] });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load admin data" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!authorized(request)) return denied();

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();

    if (body.type === "appointment") {
      const allowed = ["status", "notes", "starts_at", "ends_at", "customer_name", "customer_email", "customer_phone"];
      const updates = Object.fromEntries(Object.entries(body.updates || {}).filter(([key]) => allowed.includes(key)));
      const { error } = await supabase.from("appointments").update(updates).eq("id", body.id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (body.type === "inventory") {
      const product = products.find((item) => item.id === body.productId);
      if (!product) return NextResponse.json({ error: "Unknown product" }, { status: 400 });
      const payload = {
        product_id: product.id,
        product_name: product.title,
        quantity: Math.max(0, Math.floor(Number(body.quantity) || 0)),
        low_stock_threshold: Math.max(0, Math.floor(Number(body.lowStockThreshold) || 0)),
        active: body.active !== false,
        updated_at: new Date().toISOString()
      };
      const { error } = await supabase.from("product_inventory").upsert(payload, { onConflict: "product_id" });
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (body.type === "coupon") {
      const { error } = await supabase.from("coupon_codes").update({ active: Boolean(body.active), updated_at: new Date().toISOString() }).eq("id", body.id);
      if (error) throw error;
      if (body.stripePromotionCodeId) await stripe.promotionCodes.update(body.stripePromotionCodeId, { active: Boolean(body.active) });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unsupported update" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save changes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!authorized(request)) return denied();

  try {
    const body = await request.json();
    if (body.type !== "coupon") return NextResponse.json({ error: "Unsupported create request" }, { status: 400 });

    const code = String(body.code || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    const percentOff = Math.max(1, Math.min(100, Number(body.percentOff) || 0));
    if (!code || !percentOff) return NextResponse.json({ error: "Code and discount percentage are required" }, { status: 400 });

    const coupon = await stripe.coupons.create({ percent_off: percentOff, duration: "once", name: code });
    const promotion = await stripe.promotionCodes.create({ coupon: coupon.id, code });
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("coupon_codes").insert({
      code,
      percent_off: percentOff,
      active: true,
      stripe_coupon_id: coupon.id,
      stripe_promotion_code_id: promotion.id
    });
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create coupon" }, { status: 500 });
  }
}