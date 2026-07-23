import shampoo from "../shopPhotos/tame-ur-mane-shampoo.jpg";
import conditioner from "../shopPhotos/tame-ur-mane-conditioner.jpg";
import refreshSpray from "../shopPhotos/tame-ur-mane-refresh-spray.jpg";
import longBonnet from "../shopPhotos/tame-ur-mane-long-bonnet.jpg";
import blackScrunchie from "../shopPhotos/hair-embellishment-scrunchie-black.jpg";
import purpleScrunchie from "../shopPhotos/hair-embellishment-scrunchie-purple.jpg";
import detanglingBrush from "../shopPhotos/tame-ur-mane-detangling-brush.jpg";
import bonnetLifestyle from "../shopPhotos/tame-ur-mane-long-bonnet-lifestyle-woman.jpg";

export const services = [
  { id: "natural-hair-care", title: "Natural Hair Care", text: "Hydration, scalp care and healthy-hair maintenance tailored to your texture.", meta: "60 min", duration: 60, deposit: 2500 },
  { id: "silk-press", title: "Silk Press & Blowout", text: "Smooth movement, brilliant shine and heat-conscious styling.", meta: "90 min", duration: 90, deposit: 3000 },
  { id: "protective-style", title: "Protective Styling", text: "Polished, low-maintenance styles designed for comfort and retention.", meta: "120 min", duration: 120, deposit: 4000 },
  { id: "extensions", title: "Extensions Consultation", text: "A focused consultation to plan your customized install.", meta: "30 min", duration: 30, deposit: 2000 },
  { id: "loc-care", title: "Loc Care", text: "Maintenance, styling and intentional care for healthy, defined locs.", meta: "90 min", duration: 90, deposit: 3000 },
  { id: "mens-services", title: "Men's Services", text: "Focused grooming and natural-hair services created for men.", meta: "45 min", duration: 45, deposit: 2500 }
];

export const products = [
  { id: "shampoo", title: "Tame Ur Mane Shampoo", price: "$12.50", unitAmount: 1250, benefit: "Cleanse + moisturize", category: "Hair care", badge: "Bestseller", image: shampoo },
  { id: "conditioner", title: "Tame Ur Mane Conditioner", price: "$12.50", unitAmount: 1250, benefit: "Soften + restore", category: "Hair care", image: conditioner },
  { id: "refresh-spray", title: "Tame Ur Mane Refresh Spray", price: "$10.00", unitAmount: 1000, benefit: "Revive + hydrate", category: "Hair care", image: refreshSpray },
  { id: "long-bonnet", title: "Tame Ur Mane Long Bonnet", price: "$15.00", unitAmount: 1500, benefit: "Protect longer styles", category: "Satin essentials", badge: "Family favorite", image: longBonnet },
  { id: "black-scrunchie", title: "Black Satin Scrunchie", price: "$4.00", unitAmount: 400, benefit: "Gentle, secure hold", category: "Accessories", image: blackScrunchie },
  { id: "purple-scrunchie", title: "Purple Satin Scrunchie", price: "$4.00", unitAmount: 400, benefit: "Gentle, secure hold", category: "Accessories", image: purpleScrunchie },
  { id: "detangling-brush", title: "Untangle Ur Mane Brush", price: "$6.99", unitAmount: 699, benefit: "Easy detangling", category: "Tools", image: detanglingBrush }
];

export const fallbackProducts = products;
export const shopLifestyleImage = bonnetLifestyle;
