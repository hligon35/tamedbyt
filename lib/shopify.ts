import { fallbackProducts } from "./data";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

function findLocalProduct(title: string) {
  const normalizedTitle = normalize(title);
  return fallbackProducts.find((product) => {
    const normalizedProduct = normalize(product.title);
    return normalizedTitle === normalizedProduct || normalizedTitle.includes(normalizedProduct) || normalizedProduct.includes(normalizedTitle);
  });
}

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
              productType
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

    return json.data.products.nodes.map((item: any) => {
      const localProduct = findLocalProduct(item.title);
      return {
        title: item.title,
        price: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: item.priceRange.minVariantPrice.currencyCode
        }).format(Number(item.priceRange.minVariantPrice.amount)),
        benefit: localProduct?.benefit || "Natural care for your mane",
        category: localProduct?.category || item.productType || "Tame Ur Mane",
        badge: localProduct?.badge,
        image: localProduct?.image || item.featuredImage?.url,
        url: `https://${domain}/products/${item.handle}`
      };
    });
  } catch {
    return fallbackProducts;
  }
}
