import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { appointmentServices, serviceCatalog } from "@/lib/data";
import consultationImage from "../../shopPhotos/tame-ur-mane-hair-care-lifestyle.jpg";
import naturalHairImage from "../../shopPhotos/tame-ur-mane-hair-care-lifestyle-alt-01.jpg";
import extensionsImage from "../../shopPhotos/tame-ur-mane-long-bonnet-lifestyle-woman.jpg";
import braidingImage from "../../shopPhotos/tame-ur-mane-long-bonnet-lifestyle-woman-alt-01.jpg";
import silkPressImage from "../../shopPhotos/tame-ur-mane-bonnet-lifestyle-woman.jpg";
import blowoutImage from "../../shopPhotos/tame-ur-mane-bonnet-lifestyle-woman-alt-01.jpg";
import updoImage from "../../shopPhotos/hair-embellishment-scrunchie-purple-alt-01.jpg";
import locImage from "../../shopPhotos/tame-ur-mane-long-bonnet.jpg";
import mensImage from "../../shopPhotos/tame-ur-mane-bonnet-lifestyle-man.jpg";
import addOnsImage from "../../shopPhotos/tame-ur-mane-detangling-brush.jpg";
import "./services.css";

export const metadata = {
  title: "Services",
  description: "Explore Tamed By Tam natural hair care, extensions, braiding, silk press, blowout and specialty services."
};

const categoryImages: Record<string, StaticImageData> = {
  consultation: consultationImage,
  "natural-hair-care": naturalHairImage,
  "hair-extensions": extensionsImage,
  "hair-braiding": braidingImage,
  "silk-press": silkPressImage,
  "bouncy-blowout": blowoutImage,
  "updo-styling": updoImage,
  "individual-loc": locImage,
  "mens-services": mensImage,
  "add-ons": addOnsImage
};

function getNumber(value: string) {
  const match = value.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function getSummary(category: (typeof serviceCatalog)[number]) {
  const prices = category.items.map((item) => getNumber(item.price)).filter((value): value is number => value !== null);
  const minutes = category.items.map((item) => getNumber(item.duration)).filter((value): value is number => value !== null);
  const minimumPrice = prices.length ? Math.min(...prices) : 0;
  const minimumMinutes = minutes.length ? Math.min(...minutes) : 0;
  const maximumMinutes = minutes.length ? Math.max(...minutes) : 0;

  return {
    price: minimumPrice === 0 ? "$0" : `$${minimumPrice}+`,
    duration: minimumMinutes === maximumMinutes ? `${minimumMinutes} min` : `${minimumMinutes}–${maximumMinutes} min`
  };
}

export default function ServicesPage() {
  return <>
    <section className="page-hero services-hero">
      <p className="eyebrow">Services & pricing</p>
      <h1>Care for every texture.<br/><em>Style for every season.</em></h1>
      <p>Browse each category by image, starting price and estimated time range. Expand any category and select the exact option to add it to an appointment.</p>
      <div className="button-row"><Link className="button gold" href="/book">Book an appointment</Link><a className="button ghost" href="#service-menu">View service menu</a></div>
    </section>

    <nav className="service-jump" aria-label="Service categories">
      {serviceCatalog.map((category) => <a key={category.id} href={`#${category.id}`}>{category.title}</a>)}
    </nav>

    <section className="services-page" id="service-menu">
      <div className="service-category-grid">
        {serviceCatalog.map((category) => {
          const summary = getSummary(category);
          const firstBookable = appointmentServices.find((service) => service.categoryId === category.id);

          return <article className="service-category-card" id={category.id} key={category.id}>
            <div className="service-category-image">
              <Image src={categoryImages[category.id]} alt={`${category.title} service`} fill sizes="(max-width: 760px) 100vw, 50vw" />
            </div>

            <div className="service-category-content">
              <p className="eyebrow">{category.items.length} {category.items.length === 1 ? "option" : "options"}</p>
              <h2>{category.title}</h2>
              <p className="service-category-description">{category.description}</p>

              <div className="service-category-stats">
                <span><small>Starting at</small><strong>{summary.price}</strong></span>
                <span><small>Time frame</small><strong>{summary.duration}</strong></span>
              </div>

              <details className="service-options">
                <summary>View and select options <span aria-hidden="true">+</span></summary>
                <div className="service-options-list">
                  {category.items.map((item) => {
                    const bookable = appointmentServices.find((service) => service.categoryId === category.id && service.title === item.name);
                    const content = <>
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.duration}{item.deposit ? ` · ${item.deposit} required` : ""}</p>
                      </div>
                      <div className="service-option-action"><strong>{item.price}</strong><span>{bookable ? "Add to appointment →" : "Contact for pricing"}</span></div>
                    </>;

                    return bookable
                      ? <Link className="service-option-row selectable" href={`/book?service=${encodeURIComponent(bookable.id)}`} key={`${category.id}-${item.name}`}>{content}</Link>
                      : <div className="service-option-row" key={`${category.id}-${item.name}`}>{content}</div>;
                  })}
                </div>
              </details>

              {firstBookable && <Link className="button black full" href={`/book?service=${encodeURIComponent(firstBookable.id)}`}>Start with this category</Link>}
            </div>
          </article>;
        })}
      </div>
    </section>

    <section className="service-note">
      <div><p className="eyebrow">Before booking</p><h2>Choose the exact service, then add products.</h2></div>
      <p>The appointment builder carries the selected service into scheduling and lets the customer add retail products before one combined Stripe checkout.</p>
      <Link className="button gold" href="/book">Continue to booking</Link>
    </section>
  </>;
}