import ProductGrid from "@/components/ProductGrid";
import { getProducts } from "@/lib/shopify";

export const metadata = { title: "Shop" };

export default async function Shop() {
  const products = await getProducts();
  return <>
    <section className="page-hero compact"><p className="eyebrow">Tame Ur Mane collection</p><h1>Natural care for <em>every texture.</em></h1><p>Purposeful products created to cleanse, nourish, protect and simplify your routine.</p></section>
    <section className="section"><ProductGrid products={products} /></section>
    <section className="shop-promise"><article><strong>Natural-first care</strong><p>Ingredients selected to nourish and protect.</p></article><article><strong>Made for real routines</strong><p>Products designed to work between appointments.</p></article><article><strong>Secure Shopify checkout</strong><p>Inventory, payments and fulfillment remain protected by Shopify.</p></article></section>
  </>;
}
