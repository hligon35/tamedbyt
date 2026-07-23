import Image from "next/image";

export default function ProductGrid({ products }: { products: any[] }) {
  return <div className="product-grid">
    {products.map((product) => <article className="product-card" key={product.title}>
      <a href={product.url}>
        <div className="product-image">
          {product.image ? <Image src={product.image} alt={product.title} fill sizes="(max-width: 700px) 78vw, 25vw" /> : <span>T</span>}
        </div>
        <div className="product-meta">
          <p>{product.benefit}</p>
          <h3>{product.title}</h3>
          <strong>{product.price}</strong>
          <span>Shop product →</span>
        </div>
      </a>
    </article>)}
  </div>;
}
