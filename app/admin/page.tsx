"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import "./admin.css";

type Appointment = {
  id: string;
  service_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  starts_at: string;
  ends_at: string;
  status: string;
  notes: string;
  checkout_total_amount: number;
  products: Array<{ title: string; quantity: number }>;
};

type InventoryItem = {
  product_id: string;
  product_name: string;
  quantity: number;
  low_stock_threshold: number;
  active: boolean;
};

type Coupon = {
  id: string;
  code: string;
  percent_off: number;
  active: boolean;
  stripe_promotion_code_id?: string;
};

const tabs = ["Overview", "Appointments", "Coupons", "Inventory"] as const;
type Tab = (typeof tabs)[number];

function money(amount = 0) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
}

export default function Admin() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [adminKey, setAdminKey] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const upcoming = useMemo(() => appointments.filter((item) => new Date(item.starts_at) >= new Date() && !["cancelled", "expired"].includes(item.status)), [appointments]);
  const lowStock = useMemo(() => inventory.filter((item) => item.active && item.quantity <= item.low_stock_threshold), [inventory]);
  const activeCoupons = coupons.filter((item) => item.active);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("tamed-admin-key");
    if (stored) {
      setAdminKey(stored);
      loadData(stored);
    }
  }, []);

  async function loadData(key = adminKey) {
    if (!key) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin", { headers: { "x-admin-key": key } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load dashboard");
      setAppointments(data.appointments || []);
      setInventory(data.inventory || []);
      setCoupons(data.coupons || []);
      setAuthenticated(true);
      window.sessionStorage.setItem("tamed-admin-key", key);
    } catch (err) {
      setAuthenticated(false);
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function patch(payload: Record<string, unknown>, saveKey: string) {
    setSaving(saveKey);
    setError("");
    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save changes");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save changes");
    } finally {
      setSaving("");
    }
  }

  async function createCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving("new-coupon");
    setError("");
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ type: "coupon", code: form.get("code"), percentOff: form.get("percentOff") })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to create coupon");
      event.currentTarget.reset();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create coupon");
    } finally {
      setSaving("");
    }
  }

  if (!authenticated) {
    return <main className="admin-login">
      <form onSubmit={(event) => { event.preventDefault(); loadData(); }}>
        <p className="eyebrow">Owner access</p>
        <h1>Admin dashboard</h1>
        <p>Enter the private dashboard key configured on the server.</p>
        <label>Admin key<input type="password" value={adminKey} onChange={(event) => setAdminKey(event.target.value)} required /></label>
        {error && <p className="admin-error">{error}</p>}
        <button className="button gold full" disabled={loading}>{loading ? "Signing in…" : "Open dashboard"}</button>
      </form>
    </main>;
  }

  return <main className="admin-shell modern-admin">
    <aside>
      <div className="admin-brand">T <span>Admin</span></div>
      <nav>{tabs.map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</nav>
      <button className="admin-signout" onClick={() => { sessionStorage.removeItem("tamed-admin-key"); setAuthenticated(false); }}>Sign out</button>
    </aside>

    <section>
      <div className="admin-top"><div><p className="eyebrow">Owner dashboard</p><h1>{tab}</h1></div><div className="admin-actions"><button onClick={() => loadData()} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button><a className="button black" href="/">View website</a></div></div>
      <div className="admin-mobile-tabs">{tabs.map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
      {error && <p className="admin-error">{error}</p>}

      {tab === "Overview" && <>
        <div className="stats">
          <article><span>Upcoming appointments</span><strong>{upcoming.length}</strong><small>{appointments.length} total records</small></article>
          <article><span>Active coupons</span><strong>{activeCoupons.length}</strong><small>Available in Stripe Checkout</small></article>
          <article><span>Low-stock products</span><strong>{lowStock.length}</strong><small>At or below threshold</small></article>
        </div>
        <div className="admin-panel"><h2>Next appointments</h2>{upcoming.slice(0, 5).map((appointment) => <div className="admin-list-row" key={appointment.id}><div><strong>{appointment.customer_name}</strong><span>{appointment.service_name}</span></div><time>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(appointment.starts_at))}</time></div>)}</div>
      </>}

      {tab === "Appointments" && <div className="admin-card-grid">
        {appointments.map((appointment) => <article className="admin-record" key={appointment.id}>
          <div className="record-heading"><div><span className={`status-pill ${appointment.status}`}>{appointment.status}</span><h2>{appointment.customer_name}</h2><p>{appointment.service_name}</p></div><strong>{money(appointment.checkout_total_amount)}</strong></div>
          <dl><div><dt>When</dt><dd>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(appointment.starts_at))}</dd></div><div><dt>Contact</dt><dd>{appointment.customer_email}<br />{appointment.customer_phone}</dd></div><div><dt>Products</dt><dd>{appointment.products?.length ? appointment.products.map((item) => `${item.title} × ${item.quantity}`).join(", ") : "None"}</dd></div></dl>
          <label>Status<select value={appointment.status} onChange={(event) => setAppointments((current) => current.map((item) => item.id === appointment.id ? { ...item, status: event.target.value } : item))}><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="cancelled">Cancelled</option><option value="expired">Expired</option></select></label>
          <label>Notes<textarea value={appointment.notes || ""} onChange={(event) => setAppointments((current) => current.map((item) => item.id === appointment.id ? { ...item, notes: event.target.value } : item))} rows={3} /></label>
          <button className="button black full" disabled={saving === appointment.id} onClick={() => patch({ type: "appointment", id: appointment.id, updates: { status: appointment.status, notes: appointment.notes } }, appointment.id)}>{saving === appointment.id ? "Saving…" : "Save appointment"}</button>
        </article>)}
      </div>}

      {tab === "Coupons" && <>
        <form className="admin-panel coupon-form" onSubmit={createCoupon}><div><h2>Create coupon code</h2><p>Creates a one-time percentage coupon and promotion code in Stripe.</p></div><label>Code<input name="code" placeholder="WELCOME10" required /></label><label>Percent off<input name="percentOff" type="number" min="1" max="100" placeholder="10" required /></label><button className="button gold" disabled={saving === "new-coupon"}>{saving === "new-coupon" ? "Creating…" : "Create coupon"}</button></form>
        <div className="admin-card-grid compact-grid">{coupons.map((coupon) => <article className="admin-record coupon-card" key={coupon.id}><div><span className={`status-pill ${coupon.active ? "confirmed" : "cancelled"}`}>{coupon.active ? "Active" : "Inactive"}</span><h2>{coupon.code}</h2><p>{coupon.percent_off}% off</p></div><button onClick={() => patch({ type: "coupon", id: coupon.id, active: !coupon.active, stripePromotionCodeId: coupon.stripe_promotion_code_id }, coupon.id)} disabled={saving === coupon.id}>{saving === coupon.id ? "Saving…" : coupon.active ? "Deactivate" : "Activate"}</button></article>)}</div>
      </>}

      {tab === "Inventory" && <div className="admin-card-grid compact-grid">{inventory.map((item) => <article className="admin-record" key={item.product_id}><div className="record-heading"><div><span className={`status-pill ${item.active ? "confirmed" : "cancelled"}`}>{item.active ? "Active" : "Hidden"}</span><h2>{item.product_name}</h2></div><strong className={item.quantity <= item.low_stock_threshold ? "low-stock" : ""}>{item.quantity}</strong></div><div className="inventory-fields"><label>Quantity<input type="number" min="0" value={item.quantity} onChange={(event) => setInventory((current) => current.map((product) => product.product_id === item.product_id ? { ...product, quantity: Number(event.target.value) } : product))} /></label><label>Low-stock alert<input type="number" min="0" value={item.low_stock_threshold} onChange={(event) => setInventory((current) => current.map((product) => product.product_id === item.product_id ? { ...product, low_stock_threshold: Number(event.target.value) } : product))} /></label></div><label className="toggle-label"><input type="checkbox" checked={item.active} onChange={(event) => setInventory((current) => current.map((product) => product.product_id === item.product_id ? { ...product, active: event.target.checked } : product))} /> Available for sale</label><button className="button black full" disabled={saving === item.product_id} onClick={() => patch({ type: "inventory", productId: item.product_id, quantity: item.quantity, lowStockThreshold: item.low_stock_threshold, active: item.active }, item.product_id)}>{saving === item.product_id ? "Saving…" : "Save inventory"}</button></article>)}</div>}
    </section>
  </main>;
}