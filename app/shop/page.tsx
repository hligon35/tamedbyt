import Image from "next/image";
import ProductGrid from "@/components/ProductGrid";
import { shopLifestyleImage } from "@/lib/data";
import { getProducts } from "@/lib/shopify";
import "./shop.css";

export const metadata = { title: "Shop" };

export default async function Shop() {
  const products = await getProducts();

  return <>
    <section className="store-hero">
      <div className="store-hero-copy">
        <p className="eyebrow">Tame Ur Mane collection</p>
        <h1>Healthy-hair essentials made for <em>real routines.</em></h1>
        <p>Cleanse, condition, refresh and protect your mane with products and satin essentials created for every texture.</p>
        <div className="button-row">
          <a className="button gold" href="#shop-all">Shop the collection</a>
          <a className="button ghost" href="https://tamedbeautyhaven.com/collections/all" target="_blank" rel="noreferrer">Visit Shopify store</a>
        </div>
        <div className="store-proof"><span>Texture-conscious care</span><span>Secure Shopify checkout</span><span>Local beauty brand</span></div>
      </div>
      <div className="store-hero-image">
        <Image src={shopLifestyleImage} alt="Tame Ur Mane satin bonnet lifestyle" fill priority sizes="(max-width: 900px) 100vw, 48vw" />
        <div className="store-hero-card"><small>Protect your style</small><strong>Sleep beautifully.</strong></div>
      </div>
    </section>

    <nav className="shop-categories" aria-label="Shop categories">
      <a href="#shop-all">Shop all</a><span>Hair care</span><span>Satin essentials</span><span>Accessories</span><span>Tools</span>
    </nav>

    <section className="section store-section" id="shop-all">
      <div className="section-heading">
        <div><p className="eyebrow">The collection</p><h2>Everything your mane <em>needs.</em></h2></div>
        <p className="store-intro">Select a product to complete your purchase through Tamed Beauty Haven’s secure Shopify checkout.</p>
      </div>
      <ProductGrid products={products} />
    </section>

    <section className="routine-banner">
      <p className="eyebrow">Build your routine</p>
      <h2>Cleanse. Restore. Refresh. Protect.</h2>
      <div className="routine-steps"><span><b>01</b> Shampoo</span><span><b>02</b> Condition</span><span><b>03</b> Refresh</span><span><b>04</b> Protect</span></div>
    </section>

    <section className="shop-promise">
      <article><strong>Made for every texture</strong><p>Products and tools selected for curls, coils, locs, protective styles and straightened hair.</p></article>
      <article><strong>Care beyond the chair</strong><p>Maintain softness, moisture and style between salon appointments.</p></article>
      <article><strong>Secure Shopify checkout</strong><p>Product availability, payment and fulfillment remain managed by the existing Shopify store.</p></article>
    </section>
  </>;
}
