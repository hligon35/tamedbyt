import Link from "next/link";

export const metadata = { title: "Appointment confirmed" };

export default function BookingSuccess() {
  return <section className="page-hero compact">
    <p className="eyebrow">Deposit received</p>
    <h1>Your appointment is <em>secured.</em></h1>
    <p>Your deposit was processed through Stripe and your selected time has been confirmed. Keep the Stripe receipt for your records.</p>
    <div className="button-row"><Link className="button gold" href="/">Return home</Link><Link className="button ghost" href="/shop">Shop Tame Ur Mane</Link></div>
  </section>;
}
