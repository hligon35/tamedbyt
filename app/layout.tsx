import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import logo from "./assets/tamedxt.png";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tamed By Tam | Natural Hair Care & Beauty", template: "%s | Tamed By Tam" },
  description: "Healthy natural hair care, elevated styling and Tame Ur Mane products in Paducah, Kentucky."
};

const links = [["Home", "/"], ["About", "/about"], ["Book", "/book"], ["Services", "/services"], ["Reviews", "/reviews"], ["Shop", "/shop"]];

const businessHours = [
  ["Monday", "11 AM – 1 PM"],
  ["Tuesday", "10 AM – 2 PM"],
  ["Wednesday", "9 AM – 4 PM"],
  ["Thursday", "9 AM – 3 PM"],
  ["Friday", "9:30 AM – 5 PM"],
  ["Saturday", "Closed"],
  ["Sunday", "Closed"]
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" data-scroll-behavior="smooth"><body>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Tamed By Tam home">
        <Image src={logo} alt="Tamed By Tam" width={150} height={58} priority style={{ width: "auto", height: "54px", objectFit: "contain" }} />
      </Link>
      <nav>{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <Link className="header-cta" href="/book">Book now</Link>
    </header>
    <main>{children}</main>
    <footer>
      <div><p className="eyebrow">Tamed By Tam</p><h2>Tame your mane. Own your beauty.</h2></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(140px, auto))", gap: "32px 48px", alignItems: "start" }}>
        <div className="footer-links"><Link href="/book">Book</Link><Link href="/services">Services</Link><Link href="/reviews">Reviews</Link><Link href="/shop">Shop</Link><a href="https://www.instagram.com/tamedbytam22/">Instagram</a></div>
        <section aria-labelledby="business-hours-heading" style={{ minWidth: "240px" }}>
          <p className="eyebrow" id="business-hours-heading" style={{ marginBottom: "16px" }}>Business hours</p>
          <dl style={{ display: "grid", gap: "10px", margin: 0 }}>
            {businessHours.map(([day, hours]) => <div key={day} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "24px", fontSize: "13px" }}><dt>{day}</dt><dd style={{ margin: 0, fontWeight: 600 }}>{hours}</dd></div>)}
          </dl>
          <p style={{ margin: "16px 0 0", maxWidth: "280px", fontSize: "12px", lineHeight: 1.6, color: "#625d66" }}>Hours are by appointment and may vary on holidays.</p>
        </section>
      </div>
      <p className="copyright">© 2026 Tamed By Tam · Paducah, Kentucky</p>
    </footer>
    <nav className="mobile-dock"><Link href="/book">Book</Link><Link href="/services">Services</Link><Link href="/reviews">Reviews</Link><Link href="/shop">Shop</Link></nav>
  </body></html>;
}