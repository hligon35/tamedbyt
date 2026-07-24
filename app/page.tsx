import Image from "next/image";
import Link from "next/link";
import heroLogo from "./assets/tamedxt.png";
import ProductGrid from "@/components/ProductGrid";
import { services } from "@/lib/data";
import { customerReviews } from "@/lib/reviews";
import { getProducts } from "@/lib/shopify";
import "./home.css";

export default async function Home() {
  const products = await getProducts();
  const featuredReviews = customerReviews.slice(0, 3);

  return <>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Healthy hair · Elevated care</p>
        <h1>Tame your mane.<br/><em>Own your beauty.</em></h1>
        <p>Personalized natural hair care, refined styling and products created to protect every texture.</p>
        <div className="button-row"><Link className="button gold" href="/book">Book an appointment</Link><Link className="button ghost" href="/shop">Shop Tame Ur Mane</Link></div>
      </div>
      <div className="hero-art">
        <div style={{ position: "absolute", inset: "12%", zIndex: 1, borderRadius: "50%", background: "#fff", boxShadow: "0 24px 70px rgba(17, 16, 20, 0.16)" }}>
          <Image src={heroLogo} alt="Tamed By Tam" fill priority sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "contain", padding: "12%" }} />
        </div>
        <div className="hero-ring"/>
        <span className="hero-badge">The Tamed<br/>Experience</span>
      </div>
    </section>

    <section className="marquee"><span>Healthy Hair</span><i/><span>Protective Styling</span><i/><span>Natural Beauty</span><i/><span>Premium Care</span></section>

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">Signature services</p><h2>Care designed around <em>your</em> hair.</h2></div><Link href="/book">Explore booking →</Link></div>
      <div className="service-grid">{services.map((service, index) => <article key={service.title}><span>0{index + 1}</span><h3>{service.title}</h3><p>{service.text}</p><small>{service.meta}</small></article>)}</div>
    </section>

    <section className="experience"><div><p className="eyebrow">Meet Tam</p><h2>Beauty starts with a healthy foundation.</h2><p>Every appointment is intentional—from consultation and education to the finished style. The goal is not only to help you look exceptional, but to understand and protect the hair beneath the look.</p><Link className="button black" href="/about">Discover the story</Link></div><span className="giant-t">T</span></section>

    <section className="home-reviews">
      <div className="section-heading"><div><p className="eyebrow">Five-star experiences</p><h2>Trusted by clients who keep coming back.</h2></div><Link href="/reviews">Read all reviews →</Link></div>
      <div className="home-review-score"><strong>5.0</strong><span aria-label="Five stars">★★★★★</span><small>GlossGenius client reviews</small></div>
      <div className="home-review-grid">
        {featuredReviews.map((review, index) => <article key={`${review.name}-${index}`}>
          <div aria-label="Five stars">★★★★★</div>
          <blockquote>“{review.text}”</blockquote>
          <strong>{review.name}</strong>
        </article>)}
      </div>
      <Link className="button black home-review-button" href="/reviews">View client experiences</Link>
    </section>

    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">Tame Ur Mane</p><h2>Your routine, <em>elevated.</em></h2></div><Link href="/shop">View all products →</Link></div>
      <ProductGrid products={products.slice(0, 4)} />
    </section>

    <section className="quote"><p>“It’s more than a style. It’s the confidence that comes with being cared for.”</p><Link className="button gold" href="/book">Begin your experience</Link></section>
  </>;
}