import Link from "next/link";

export const metadata = { title: "About" };

export default function About() {
  return <>
    <section className="page-hero"><p className="eyebrow">The woman behind the chair</p><h1>Care, craft and confidence—<em>in every detail.</em></h1></section>
    <section className="story">
      <div className="portrait-placeholder large"><span>T</span><small>Owner portrait</small></div>
      <div><p className="eyebrow">Meet Tam</p><h2>Healthy hair is never an afterthought.</h2><p>Tamed By Tam was created to give clients more than a finished style. It is a space for personalized care, honest education and an elevated salon experience built around the health of your hair.</p><p>From natural-hair maintenance and silk presses to protective styling, extensions and loc care, every service begins with listening. Your texture, routine, goals and lifestyle shape the experience.</p><blockquote>“Tame Ur Mane and watch everything else flow.”</blockquote><Link className="button gold" href="/book">Book with Tam</Link></div>
    </section>
    <section className="values"><article><span>01</span><h3>Intentional care</h3><p>Recommendations tailored to your hair—not trends alone.</p></article><article><span>02</span><h3>Elevated comfort</h3><p>A peaceful, polished environment where you can settle in and be cared for.</p></article><article><span>03</span><h3>Lasting confidence</h3><p>Education and aftercare help your results continue beyond the appointment.</p></article></section>
  </>;
}
