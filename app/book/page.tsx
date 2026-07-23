"use client";

import { useState } from "react";
import { services } from "@/lib/data";

const dates = ["Mon, Aug 3", "Tue, Aug 4", "Thu, Aug 6", "Fri, Aug 7", "Mon, Aug 10", "Wed, Aug 12"];

export default function Book() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://tamedxtam.glossgenius.com/";

  return <>
    <section className="page-hero compact"><p className="eyebrow">Reserve your time</p><h1>Your next look starts <em>here.</em></h1><p>Explore services, choose an open date and continue into secure confirmation.</p></section>
    <section className="booking-wrap">
      <div className="booking-shell">
        <div className="progress"><span style={{ width: `${step * 33.33}%` }} /></div>
        {step === 1 && <><p className="eyebrow">Step 1 of 3</p><h2>What are we creating?</h2><div className="choice-grid">{services.map((item) => <button className={service === item.title ? "choice active" : "choice"} onClick={() => setService(item.title)} key={item.title}><strong>{item.title}</strong><small>{item.meta}</small></button>)}</div><button disabled={!service} className="button gold full" onClick={() => setStep(2)}>Continue</button></>}
        {step === 2 && <><p className="eyebrow">Step 2 of 3</p><h2>Select an open date</h2><div className="choice-grid">{dates.map((item) => <button className={date === item ? "choice active" : "choice"} onClick={() => setDate(item)} key={item}><strong>{item}</strong><small>10:00 AM · 1:30 PM</small></button>)}</div><div className="button-row"><button className="button ghost" onClick={() => setStep(1)}>Back</button><button disabled={!date} className="button gold" onClick={() => setStep(3)}>Continue</button></div></>}
        {step === 3 && <><p className="eyebrow">Step 3 of 3</p><h2>Confirm your appointment</h2><div className="summary"><p><span>Service</span><strong>{service}</strong></p><p><span>Date</span><strong>{date}</strong></p><p><span>Deposit</span><strong>Calculated at checkout</strong></p></div><label>Full name<input placeholder="Your name" /></label><label>Email<input type="email" placeholder="you@example.com" /></label><label>Phone<input type="tel" placeholder="(000) 000-0000" /></label><label className="check"><input type="checkbox" /> I agree to the booking and cancellation policies.</label><a className="button gold full" href={bookingUrl}>Continue to secure booking</a><button className="text-button" onClick={() => setStep(2)}>Choose another date</button></>}
      </div>
      <aside className="policy-card"><p className="eyebrow">Before you book</p><h3>A smooth appointment starts here.</h3><ul><li>Review preparation requirements for your selected service.</li><li>Some extension services require a consultation.</li><li>A deposit may be required to secure your appointment.</li><li>Cancellations are subject to the published policy.</li></ul><a href={bookingUrl}>View current booking site →</a></aside>
    </section>
  </>;
}
