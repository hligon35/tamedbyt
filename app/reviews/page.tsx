import Link from "next/link";
import { customerReviews } from "@/lib/reviews";
import "./reviews.css";

export const metadata = {
  title: "Reviews",
  description: "Read verified five-star client experiences from Tamed By Tam in Paducah, Kentucky."
};

export default function ReviewsPage() {
  return <>
    <section className="page-hero reviews-hero">
      <p className="eyebrow">Client experiences</p>
      <h1>Real clients.<br/><em>Real confidence.</em></h1>
      <p>Five-star feedback from clients who trusted Tamed By Tam with their hair, their children, and their special moments.</p>
      <div className="review-score"><strong>5.0</strong><span aria-label="Five stars">★★★★★</span><small>GlossGenius client reviews</small></div>
    </section>

    <section className="reviews-page">
      <div className="reviews-heading">
        <div><p className="eyebrow">What clients are saying</p><h2>Care that earns trust.</h2></div>
        <p>These reviews were transcribed from the public Tamed By Tam GlossGenius portfolio. Longer entries that were cut off in the source recording are displayed as excerpts.</p>
      </div>

      <div className="reviews-grid">
        {customerReviews.map((review, index) => <article className="review-card" key={`${review.name}-${index}`}>
          <div className="review-stars" aria-label="Five stars">★★★★★</div>
          <blockquote>“{review.text}”</blockquote>
          <footer>
            <strong>{review.name}</strong>
            <span>{review.excerpt ? "Review excerpt" : "Verified client review"}</span>
          </footer>
        </article>)}
      </div>
    </section>

    <section className="reviews-cta">
      <div><p className="eyebrow">Your turn</p><h2>Experience the care clients remember.</h2></div>
      <Link className="button gold" href="/book">Book an appointment</Link>
    </section>
  </>;
}