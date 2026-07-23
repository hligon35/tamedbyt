import Link from "next/link";

const looks = ["Silk Press", "Protective Style", "Natural Care", "Loc Styling", "Extensions", "Men's Grooming"];
export const metadata = { title: "Gallery" };

export default function Gallery() {
  return <>
    <section className="page-hero"><p className="eyebrow">The work</p><h1>Healthy hair looks <em>good on you.</em></h1></section>
    <section className="gallery-grid">{looks.map((look, index) => <article className="look" key={look}><div><span>0{index + 1}</span><h2>{look}</h2><Link href="/book">Book this look →</Link></div></article>)}</section>
    <section className="quote"><p>Portfolio imagery can be managed from the owner dashboard once the gallery is connected.</p><Link className="button gold" href="/book">Book your transformation</Link></section>
  </>;
}
