// ============================================================
// STORE SETTINGS - the only file you edit for basic store info
// ============================================================

export const STORE_NAME = "JerseyBank";

// Number with country code, digits only (no + or spaces)
export const WHATSAPP_NUMBER = "2349124351856";

export const CURRENCY = "₦";

// Product options used by the catalog/admin. These are intentionally
// broad so the catalog can grow without hard-coding homepage sections.
export const SIZES = ["S", "M", "L", "XL", "XXL"];
export const CATEGORIES = ["Football"];
export const LEAGUES = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Champions League",
  "Europa League",
  "Other",
];
export const PRODUCT_TYPES = [
  "Home",
  "Away",
  "Third",
  "Goalkeeper",
  "Training",
  "Player Version",
  "Fan Version",
  "Long Sleeve",
  "Other",
];
export const COLLECTIONS = [
  "New Season",
  "Retro & Classics",
  "World Cup",
  "Nigeria Exclusive",
  "National Teams",
  "Player Jerseys",
  "Training",
  "Special Editions",
  "Other",
];
export const COMPETITIONS = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Champions League",
  "Europa League",
  "World Cup",
  "AFCON",
  "Other",
];

// Builds the WhatsApp link used by "Checkout via WhatsApp"
export function buildWhatsAppLink({ name, color, size, customer = {} }) {
  const lines = [
    `Jersey Order — ${name}`,
    `Size: ${size || "Not specified"}`,
    color ? `Color: ${color}` : null,
    "",
    "Delivery details",
    `Name: ${customer.name || ""}`,
    `Phone: ${customer.phone || ""}`,
    `State: ${customer.state || ""}`,
    `City / Area: ${customer.city || ""}`,
    `Address: ${customer.address || ""}`,
    customer.landmark ? `Landmark: ${customer.landmark}` : null,
  ].filter((line) => line !== null);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

// Link for general enquiries (Contact button, floating button)
export function buildEnquiryLink() {
  const message = `Hi ${STORE_NAME}, I have a question about your jerseys.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getActiveDiscount(jersey, now = Date.now()) {
  const d = jersey?.discount;
  if (!d?.enabled || !Number(d.salePrice) || Number(d.salePrice) >= Number(jersey.price)) return null;
  const start = d.startAt ? new Date(d.startAt).getTime() : null;
  const end = d.endAt ? new Date(d.endAt).getTime() : null;
  if (start && now < start) return null;
  if (end && now >= end) return null;
  return { ...d, salePrice: Number(d.salePrice), originalPrice: Number(jersey.price), endAtMs: end };
}

export function getDiscountPercent(jersey, now = Date.now()) {
  const d = getActiveDiscount(jersey, now);
  if (!d) return 0;
  return Math.round((1 - d.salePrice / d.originalPrice) * 100);
}
