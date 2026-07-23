"use client";

import { useState } from "react";

const tabs = ["Overview", "Pages", "Services", "Gallery", "Products", "Bookings", "Settings"];

export default function Admin() {
  const [tab, setTab] = useState("Overview");
  return <div className="admin-shell">
    <aside><div className="admin-brand">T <span>Admin</span></div>{tabs.map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</aside>
    <section><div className="admin-top"><div><p className="eyebrow">Owner dashboard</p><h1>{tab}</h1></div><a className="button black" href="/">View website</a></div>
      {tab === "Overview" ? <><div className="stats"><article><span>Appointments</span><strong>—</strong><small>Connect booking provider</small></article><article><span>Store orders</span><strong>—</strong><small>Connect Shopify Admin API</small></article><article><span>Gallery items</span><strong>6</strong><small>Starter placeholders</small></article></div><div className="admin-panel"><h2>Launch checklist</h2><label><input type="checkbox" /> Add Shopify Storefront API token</label><label><input type="checkbox" /> Confirm live booking provider</label><label><input type="checkbox" /> Upload high-resolution logo and portrait</label><label><input type="checkbox" /> Add portfolio images</label><label><input type="checkbox" /> Confirm service prices and policies</label></div></> : <div className="admin-panel"><h2>{tab} manager</h2><p>This interface is scaffolded for Firebase authentication and persistence. The next integration will allow the owner to edit this content securely.</p><button className="button gold">Add new item</button></div>}
    </section>
  </div>;
}
