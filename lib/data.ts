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

export const serviceCatalog = [
  {
    id: "consultation",
    title: "Virtual Consultation",
    description: "Explore hairstyle options, trends and personalized recommendations through a virtual consultation. A consultation link is sent the day before the appointment.",
    items: [{ name: "Consultation Virtually", duration: "15 min", price: "$0" }]
  },
  {
    id: "natural-hair-care",
    title: "Natural Hair Care",
    description: "Healthy-hair maintenance, hydration, scalp care and styling tailored to your texture.",
    items: [
      { name: "Hair Trim Only (Clean Hair)", duration: "10 min", price: "$25" },
      { name: "Deep Conditioning Treatment", duration: "65 min", price: "$80" },
      { name: "Hydration (Steam) Treatment", duration: "65 min", price: "$80" },
      { name: "Wash N Go", duration: "80 min", price: "$85" },
      { name: "Scalp Exfoliation + Style", duration: "120 min", price: "$125" },
      { name: "Braid Take Down + Wash + DC + Dry + Trim", duration: "120 min", price: "$110" },
      { name: "2 Strand Twist", duration: "150 min", price: "$125+" }
    ]
  },
  {
    id: "hair-extensions",
    title: "Hair Extensions",
    description: "Customized extension services designed for a secure, polished and natural-looking finish.",
    items: [
      { name: "Weave Style (Glue)", duration: "130 min", price: "$100" },
      { name: "Natural Sewn", duration: "180 min", price: "$125" },
      { name: "Closure", duration: "205 min", price: "$160+" },
      { name: "Wig Install", duration: "175 min", price: "$100+" },
      { name: "Crochet Style", duration: "120 min", price: "$85" }
    ]
  },
  {
    id: "hair-braiding",
    title: "Hair Braiding",
    description: "Professional braided styles, from classic scalp braids to knotless and specialty looks. Hair is provided for select styles as noted during booking.",
    items: [
      { name: "Kids Braids (5th–8th Grade)", duration: "90 min", price: "$75+", deposit: "$10 deposit" },
      { name: "Youth Knotless Braids (to Age 20)", duration: "160 min", price: "$180+", deposit: "$20 deposit" },
      { name: "Scalp Braids", duration: "150 min", price: "$85", deposit: "$20 deposit" },
      { name: "Boho Knotless", duration: "230 min", price: "$275+", deposit: "$40 deposit" },
      { name: "Gypsy Braids", duration: "375 min", price: "$350+", deposit: "$40 deposit" },
      { name: "Adult Knotless", duration: "210 min", price: "$250+", deposit: "$20 deposit" },
      { name: "2 Braids", duration: "80 min", price: "$50", deposit: "$10 deposit" },
      { name: "Fulani Braids (Half Scalp/Knotless)", duration: "210 min", price: "$200" },
      { name: "Scalp Braids Ear to Ear", duration: "45 min", price: "$40" },
      { name: "Miracle Knots", duration: "195 min", price: "$220" }
    ]
  },
  {
    id: "silk-press",
    title: "Silk Press Styling",
    description: "A sleek, smooth finish with movement and shine. Includes end trimming and styling.",
    items: [{ name: "Silk Press Styling", duration: "90 min", price: "$85" }]
  },
  {
    id: "bouncy-blowout",
    title: "Bouncy Blowout Styling",
    description: "A voluminous blowout using a round brush or paddle brush for body, movement and texture.",
    items: [{ name: "Bouncy Blowout Styling (Round Brush)", duration: "75 min", price: "$85" }]
  },
  {
    id: "updo-styling",
    title: "Updo Styling",
    description: "Elevated updo styling for special occasions, events or a polished everyday look.",
    items: [{ name: "Sleek Ponytail", duration: "140 min", price: "$100" }]
  },
  {
    id: "individual-loc",
    title: "Individual Loc",
    description: "Personalized care for individual locs with nourishment, maintenance and styling support.",
    items: [
      { name: "Half Head", duration: "90 min", price: "$80", deposit: "$20 deposit" },
      { name: "Full Head", duration: "210 min", price: "$200", deposit: "$20 deposit" },
      { name: "Boho Individual Locs (Hair Included)", duration: "240 min", price: "$280", deposit: "$50 deposit" }
    ]
  },
  {
    id: "mens-services",
    title: "Men's Services",
    description: "Specialized men's grooming and braid services designed to enhance your individual style.",
    items: [
      { name: "Designs", duration: "95 min", price: "$75", deposit: "$15 deposit" },
      { name: "Straight Backs (2–10 Braids)", duration: "95 min", price: "$50" }
    ]
  },
  {
    id: "add-ons",
    title: "Add-ons",
    description: "Optional enhancements covering extension hair, cleansing, treatments, styling and color.",
    items: [
      { name: "Boho Human Hair", duration: "10 min", price: "Price varies" },
      { name: "Takedown / Shampoo / Deep Condition / Blow Dry", duration: "90 min", price: "$100" },
      { name: "Touch Up Style", duration: "30 min", price: "$40" },
      { name: "Quick Weave Bundles", duration: "10 min", price: "$100" },
      { name: "Crochet Hair", duration: "10 min", price: "$50" },
      { name: "Hydration Treatment", duration: "25 min", price: "$40" },
      { name: "Color (Lumi 10)", duration: "25 min", price: "$25" },
      { name: "Press or Twist Out", duration: "10 min", price: "$60" },
      { name: "Sew-In Bundles", duration: "10 min", price: "$250" },
      { name: "Color", duration: "50 min", price: "$80" }
    ]
  }
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