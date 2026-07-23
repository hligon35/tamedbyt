import Image from "next/image";
import Link from "next/link";
import ownerImage from "./assets/tamara.png";
import ProductGrid from "@/components/ProductGrid";
import { services } from "@/lib/data";
import { getProducts } from "@/lib/shopify";

export default async function Home() {
  const products = await getProducts();
  return <>
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Healthy hair · Elevated care</p>
        <h1>Tame your mane.<br/><em>Own your beauty.</em></h1>
        <p>Personalized natural hair care, refined styling and products created to protect every texture.</p>
        <div className="button-row"><Link className="button gold" href="/book">Book an appointment</Link><Link className="button ghost" href="/shop">Shop Tame Ur Mane</Link></div>
      </div>
      <div className="hero-art"><div className="portrait-placeholder"><Image src={ownerImage} alt="Tam, owner of Tamed By Tam" fill priority sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center top" }} /></div><div className="hero-ring"/><span className="hero-badge">The Tamed<br/>Experience</span></div>
    </section>
    <section className="marquee"><span>Healthy Hair</span><i/><span>Protective Styling</span><i/><span>Natural Beauty</span><i/><span>Premium Care</span></section>
    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">Signature services</p><h2>Care designed around <em>your</em> hair.</h2></div><Link href="/book">Explore booking →</Link></div>
      <div className="service-grid">{services.map((service, index) => <article key={service.title}><span>0{index + 1}</span><h3>{service.title}</h3><p>{service.text}</p><small>{service.meta}</small></article>)}</div>
    </section>
    <section className="experience"><div><p className="eyebrow">Meet Tam</p><h2>Beauty starts with a healthy foundation.</h2><p>Every appointment is intentional—from consultation and education to the finished style. The goal is not only to help you look exceptional, but to understand and protect the hair beneath the look.</p><Link className="button black" href="/about">Discover the story</Link></div><span className="giant-t">T</span></section>
    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">Tame Ur Mane</p><h2>Your routine, <em>elevated.</em></h2></div><Link href="/shop">View all products →</Link></div>
      <ProductGrid products={products.slice(0, 4)} />
    </section>
    <section className="quote"><p>“It’s more than a style. It’s the confidence that comes with being cared for.”</p><Link className="button gold" href="/book">Begin your experience</Link></section>
  </>;
}