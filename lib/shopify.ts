import { fallbackProducts } from "./data";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

export async function getProducts() {
  if (!domain || !token) return fallbackProducts;

  try {
    const response = await fetch(`https://${domain}/api/2025-04/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token
      },
      body: JSON.stringify({
        query: `query Products {
          products(first: 20) {
            nodes {
              title
              handle
              featuredImage { url altText }
              priceRange { minVariantPrice { amount currencyCode } }
            }
          }
        }`
      }),
      next: { revalidate: 300 }
    });

    if (!response.ok) throw new Error("Shopify request failed");
    const json = await response.json();

    return json.data.products.nodes.map((item: any) => ({
      title: item.title,
      price: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: item.priceRange.minVariantPrice.currencyCode
      }).format(Number(item.priceRange.minVariantPrice.amount)),
      benefit: "Natural care for your mane",
      image: item.featuredImage?.url,
      url: `https://${domain}/products/${item.handle}`
    }));
  } catch {
    return fallbackProducts;
  }
}
