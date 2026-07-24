import Link from "next/link";
import { serviceCatalog } from "@/lib/data";
import "./services.css";

export const metadata = {
  title: "Services",
  description: "Explore Tamed By Tam natural hair care, extensions, braiding, silk press, blowout and specialty services."
};

export default function ServicesPage() {
  return <>
    <section className="page-hero services-hero">
      <p className="eyebrow">Services & pricing</p>
      <h1>Care for every texture.<br/><em>Style for every season.</em></h1>
      <p>Browse current services, estimated durations, starting prices and required deposits. Final pricing may vary based on length, density, condition and selected options.</p>
      <div className="button-row"><Link className="button gold" href="/book">Book an appointment</Link><a className="button ghost" href="#service-menu">View service menu</a></div>
    </section>

    <nav className="service-jump" aria-label="Service categories">
      {serviceCatalog.map((category) => <a key={category.id} href={`#${category.id}`}>{category.title}</a>)}
    </nav>

    <section className="services-page" id="service-menu">
      {serviceCatalog.map((category, categoryIndex) => <section className="service-category" id={category.id} key={category.id}>
        <div className="service-category-heading">
          <span>{String(categoryIndex + 1).padStart(2, "0")}</span>
          <div><p className="eyebrow">Service category</p><h2>{category.title}</h2><p>{category.description}</p></div>
        </div>

        {category.items.length ? <div className="service-menu-grid">
          {category.items.map((item) => <article className="service-menu-card" key={`${category.id}-${item.name}`}>
            <div>
              <h3>{item.name}</h3>
              <p>{item.duration}</p>
              {item.deposit && <span className="deposit-label">{item.deposit} required</span>}
            </div>
            <strong>{item.price}</strong>
          </article>)}
        </div> : <div className="service-placeholder">
          <div><p className="eyebrow">Details coming next</p><h3>Option-level pricing will be added from the remaining screenshots.</h3></div>
          <Link className="button ghost" href="/book">View booking availability</Link>
        </div>}
      </section>)}
    </section>

    <section className="service-note">
      <div><p className="eyebrow">Before booking</p><h2>Choose the closest service, then confirm the details.</h2></div>
      <p>Services marked with a plus sign are starting prices. Hair length, density, added hair, specialty finishes and corrective work may affect the final total. Required deposits are applied during secure checkout.</p>
      <Link className="button gold" href="/book">Continue to booking</Link>
    </section>
  </>;
}