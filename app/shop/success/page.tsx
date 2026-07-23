import Link from "next/link";

export const metadata = { title: "Order confirmed" };

export default function OrderSuccess() {
  return <section className="page-hero compact">
    <p className="eyebrow">Payment received</p>
    <h1>Your order is <em>confirmed.</em></h1>
    <p>Thank you for shopping Tame Ur Mane. A Stripe receipt has been sent to the email entered during checkout.</p>
    <div className="button-row"><Link className="button gold" href="/shop">Continue shopping</Link><Link className="button ghost" href="/book">Book an appointment</Link></div>
  </section>;
}
