"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { services } from "@/lib/data";
import "./book.css";

function localDate(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export default function Book() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [date, setDate] = useState(localDate(1));
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const service = useMemo(() => services.find((item) => item.id === serviceId)!, [serviceId]);

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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    <section className="page-hero compact"><p className="eyebrow">Reserve your time</p><h1>Book directly with <em>Tamed By Tam.</em></h1><p>Choose your service, select a live opening and secure the appointment with a deposit.</p></section>
    <section className="native-booking">
      <div className="scheduler-card">
        <div className="scheduler-section">
          <div className="scheduler-heading"><span>01</span><div><p className="eyebrow">Service</p><h2>Choose your appointment</h2></div></div>
          <div className="service-list">{services.map((item) => <button type="button" key={item.id} className={serviceId === item.id ? "service-option active" : "service-option"} onClick={() => setServiceId(item.id)}><span><strong>{item.title}</strong><small>{item.text}</small></span><b>{item.meta}</b></button>)}</div>
        </div>

        <div className="scheduler-section">
          <div className="scheduler-heading"><span>02</span><div><p className="eyebrow">Availability</p><h2>Select a date and time</h2></div></div>
          <label className="date-field">Appointment date<input type="date" min={localDate(1)} max={localDate(120)} value={date} onChange={(event) => setDate(event.target.value)} /></label>
          <div className="slot-panel">
            {loadingSlots ? <p className="slot-message">Loading available times…</p> : slots.length ? <div className="time-slot-grid">{slots.map((slot) => <button type="button" key={slot} className={selectedSlot === slot ? "time-slot active" : "time-slot"} onClick={() => setSelectedSlot(slot)}>{new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" }).format(new Date(slot))}</button>)}</div> : <p className="slot-message">No openings are available on this date.</p>}
          </div>
        </div>

        <form className="scheduler-section booking-form" onSubmit={submit}>
          <div className="scheduler-heading"><span>03</span><div><p className="eyebrow">Your details</p><h2>Secure your appointment</h2></div></div>
          <div className="booking-summary"><span>{service.title}</span><span>{selectedSlot ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Chicago" }).format(new Date(selectedSlot)) : "Select a time"}</span><strong>${(service.deposit / 100).toFixed(2)} deposit</strong></div>
          <div className="form-grid"><label>Full name<input name="name" required autoComplete="name" /></label><label>Email<input name="email" type="email" required autoComplete="email" /></label><label>Phone<input name="phone" type="tel" required autoComplete="tel" /></label><label className="wide">Notes<textarea name="notes" rows={3} placeholder="Hair length, current style or anything Tam should know" /></label></div>
          <label className="policy-check"><input type="checkbox" required /> I agree to the booking, cancellation and deposit policies.</label>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <button className="button gold full" disabled={!selectedSlot || submitting}>{submitting ? "Opening secure checkout…" : `Pay $${(service.deposit / 100).toFixed(2)} deposit`}</button>
        </form>
      </div>
      <aside className="policy-card native-policy"><p className="eyebrow">Booking policies</p><h3>Designed to protect your time and hers.</h3><ul><li>Appointments are held only after the Stripe deposit is paid.</li><li>Deposits are applied to the final service balance.</li><li>Please arrive with hair prepared according to the selected service.</li><li>Late arrivals may require a shortened or rescheduled appointment.</li><li>Contact Tamed By Tam directly for cancellations or changes.</li></ul></aside>
    </section>
  </>;
}
