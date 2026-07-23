import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Tamed By Tam | Natural Hair Care & Beauty", template: "%s | Tamed By Tam" },
  description: "Healthy natural hair care, elevated styling and Tame Ur Mane products in Paducah, Kentucky."
};

const links = [["Home", "/"], ["About", "/about"], ["Book", "/book"], ["Gallery", "/gallery"], ["Shop", "/shop"]];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>
    <header className="site-header">
      <Link href="/" className="brand"><span className="brand-mark">T</span><span>Tamed By Tam</span></Link>
      <nav>{links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <Link className="header-cta" href="/book">Book now</Link>
    </header>
    <main>{children}</main>
    <footer>
      <div><p className="eyebrow">Tamed By Tam</p><h2>Tame your mane. Own your beauty.</h2></div>
      <div className="footer-links"><Link href="/book">Book</Link><Link href="/shop">Shop</Link><Link href="/gallery">Gallery</Link><a href="https://www.instagram.com/tamedbytam22/">Instagram</a></div>
      <p className="copyright">© 2026 Tamed By Tam · Paducah, Kentucky</p>
    </footer>
    <nav className="mobile-dock"><Link href="/book">Book</Link><Link href="/shop">Shop</Link><Link href="/gallery">Looks</Link></nav>
  </body></html>;
}
