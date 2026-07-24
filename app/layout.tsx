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
      <div className="footer-links"><Link href="/book">Book</Link><Link href="/services">Services</Link><Link href="/reviews">Reviews</Link><Link href="/shop">Shop</Link><a href="https://www.instagram.com/tamedbytam22/">Instagram</a></div>
      <p className="copyright">© 2026 Tamed By Tam · Paducah, Kentucky</p>
    </footer>
    <nav className="mobile-dock"><Link href="/book">Book</Link><Link href="/services">Services</Link><Link href="/reviews">Reviews</Link><Link href="/shop">Shop</Link></nav>
  </body></html>;
}