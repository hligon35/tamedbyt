"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGrid({ products }: { products: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function buyNow(id: string) {
    setLoading(id);
    setError("");
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: [{ id, quantity: 1 }] }) });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Checkout could not be started");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout could not be started");
      setLoading(null);
    }
  }

  return <>
    {error && <p className="checkout-error" role="alert">{error}</p>}
    <div className="product-grid">
      {products.map((product) => <article className="product-card" key={product.id}>
        <div className="product-image">
          {product.badge && <span className="product-badge">{product.badge}</span>}
          <Image src={product.image} alt={product.title} fill sizes="(max-width: 700px) 78vw, 25vw" />
        </div>
        <div className="product-meta">
          <p>{product.category} · {product.benefit}</p>
          <h3>{product.title}</h3>
          <strong>{product.price}</strong>
          <button className="product-buy" disabled={loading === product.id} onClick={() => buyNow(product.id)}>{loading === product.id ? "Opening checkout…" : "Buy now"}</button>
        </div>
      </article>)}
    </div>
  </>;
}
