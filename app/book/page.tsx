"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { appointmentServices, products } from "@/lib/data";
import "./book.css";

function localDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function money(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount / 100);
}

export default function Book() {
  const [serviceId, setServiceId] = useState(appointmentServices[0].id);
  const [date, setDate] = useState(localDate(1));
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const service = useMemo(
    () => appointmentServices.find((item) => item.id === serviceId) || appointmentServices[0],
    [serviceId]
  );

  const groupedServices = useMemo(() => {
    return appointmentServices.reduce<Record<string, typeof appointmentServices>>((groups, item) => {
      (groups[item.categoryTitle] ||= []).push(item);
      return groups;
    }, {});
  }, []);

  const selectedProducts = useMemo(
    () => products
      .map((product) => ({ ...product, quantity: productQuantities[product.id] || 0 }))
      .filter((product) => product.quantity > 0),
    [productQuantities]
  );

  const productTotal = selectedProducts.reduce((sum, product) => sum + product.unitAmount * product.quantity, 0);
  const dueToday = service.deposit + productTotal;

  useEffect(() => {
    const requestedService = new URLSearchParams(window.location.search).get("service");
    if (requestedService && appointmentServices.some((item) => item.id === requestedService)) {
      setServiceId(requestedService);
    }
  }, []);

  useEffect(() => {
    setSelectedSlot("");
    setLoadingSlots(true);
    setError("");
    fetch(`/api/availability?service=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unable to load availability");
        setSlots(data.slots || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoadingSlots(false));
  }, [serviceId, date]);

  function changeProduct(productId: string, amount: number) {
    setProductQuantities((current) => ({
      ...current,
      [productId]: Math.max(0, Math.min(10, (current[productId] || 0) + amount))
    }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSlot) {
      setError("Select an available appointment time before continuing to checkout.");
      document.querySelector(".slot-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          startsAt: selectedSlot,
          products: selectedProducts.map((product) => ({ id: product.id, quantity: product.quantity })),
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          notes: form.get("notes")
        })
      });
      const data = await response.json();
      if (!response.ok || !data.url) throw new Error(data.error || "Unable to reserve appointment");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reserve appointment");
      setSubmitting(false);
    }
  }

  return <>
    <section className="page-hero compact">
      <p className="eyebrow">Reserve your time</p>
      <h1>Build your <em>Tamed appointment.</em></h1>
      <p>Select the exact service, reserve an available time, and add products for pickup during the appointment.</p>
    </section>

    <section className="native-booking">
      <div className="scheduler-card">
        <div className="scheduler-section">
          <div className="scheduler-heading"><span>01</span><div><p className="eyebrow">Service</p><h2>Choose the exact service</h2></div></div>
          <label className="service-select-label">
            Service option
            <select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
              {Object.entries(groupedServices).map(([category, items]) => <optgroup label={category} key={category}>
                {items.map((item) => <option value={item.id} key={item.id}>{item.title} · {item.displayPrice} · {item.displayDuration}</option>)}
              </optgroup>)}
            </select>
          </label>
          <div className="selected-service-card">
            <div><p>{service.categoryTitle}</p><h3>{service.title}</h3><span>{service.displayDuration} · Starting price {service.displayPrice}</span></div>
            <strong>{service.deposit < service.priceAmount ? `${money(service.deposit)} deposit` : `${money(service.deposit)} due today`}</strong>
          </div>
        </div>

        <div className="scheduler-section">
          <div className="scheduler-heading"><span>02</span><div><p className="eyebrow">Availability</p><h2>Select a date and time</h2></div></div>
          <label className="date-field">Appointment date<input type="date" min={localDate(1)} max={localDate(120)} value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <div className="slot-panel">
            {loadingSlots ? <p className="slot-message">Loading available times…</p> : slots.length ? <div className="time-slot-grid">{slots.map((slot) => <button type="button" key={slot} className={selectedSlot === slot ? "time-slot active" : "time-slot"} onClick={() => { setSelectedSlot(slot); setError(""); }}>{new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" }).format(new Date(slot))}</button>)}</div> : <p className="slot-message">No openings are available on this date.</p>}
          </div>
        </div>

        <div className="scheduler-section">
          <div className="scheduler-heading"><span>03</span><div><p className="eyebrow">Products</p><h2>Add products for appointment pickup</h2></div></div>
          <div className="appointment-products">
            {products.map((product) => {
              const quantity = productQuantities[product.id] || 0;
              return <article className={quantity ? "appointment-product selected" : "appointment-product"} key={product.id}>
                <div className="appointment-product-image"><Image src={product.image} alt={product.title} fill sizes="88px" /></div>
                <div className="appointment-product-info"><h3>{product.title}</h3><p>{product.benefit}</p><strong>{product.price}</strong></div>
                <div className="quantity-control">
                  <button type="button" onClick={() => changeProduct(product.id, -1)} aria-label={`Remove one ${product.title}`}>−</button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => changeProduct(product.id, 1)} aria-label={`Add one ${product.title}`}>+</button>
                </div>
              </article>;
            })}
          </div>
        </div>

        <form className="scheduler-section booking-form" onSubmit={submit}>
          <div className="scheduler-heading"><span>04</span><div><p className="eyebrow">Your details</p><h2>Review and secure</h2></div></div>
          <div className="booking-summary detailed">
            <div><small>Service</small><span>{service.title}</span></div>
            <div><small>Appointment</small><span>{selectedSlot ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(selectedSlot)) : "Select a time"}</span></div>
            <div><small>Products</small><span>{selectedProducts.length ? selectedProducts.map((product) => `${product.title} × ${product.quantity}`).join(", ") : "None selected"}</span></div>
            <div><small>Due today before tax</small><strong>{money(dueToday)}</strong></div>
          </div>
          <div className="form-grid"><label>Full name<input name="name" required autoComplete="name" /></label><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Phone<input name="phone" type="tel" required autoComplete="tel" /></label><label className="wide">Notes<textarea name="notes" rows={3} placeholder="Hair length, current style or anything Tam should know" /></label></div>
          <label className="policy-check"><input type="checkbox" required /> I agree to the booking, cancellation and payment policies.</label>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <button className="button gold full" disabled={submitting}>{submitting ? "Opening secure checkout…" : selectedSlot ? (dueToday > 0 ? `Continue to checkout · ${money(dueToday)} + tax` : "Confirm free consultation") : "Select a time to continue"}</button>
        </form>
      </div>

      <aside className="policy-card native-policy">
        <p className="eyebrow">Combined checkout</p>
        <h3>One appointment. One itemized transaction.</h3>
        <ul><li>The exact service appears on the Stripe transaction.</li><li>Every selected product appears as a separate receipt line item.</li><li>Products are reserved for pickup at the appointment.</li><li>Required deposits are applied according to the selected service.</li><li>Starting-price services may have a remaining balance after consultation.</li></ul>
      </aside>
    </section>
  </>;
}