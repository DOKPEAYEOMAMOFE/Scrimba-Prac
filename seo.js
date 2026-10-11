const SITE_NAME = "JerseyBank";
const DEFAULT_DESCRIPTION = "Shop premium football jerseys from clubs, national teams, retro collections and player shirts at JerseyBank.";

function upsertMeta(attribute, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(data) {
  const id = "jerseybank-jsonld";
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function setSEO({ title, description = DEFAULT_DESCRIPTION, image, type = "website", path = "" }) {
  if (typeof document === "undefined") return;
  const cleanTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Premium Football Jerseys`;
  const url = new URL(path || window.location.pathname, window.location.origin).href;

  document.title = cleanTitle;
  upsertMeta("name", "description", description);
  upsertMeta("name", "robots", "index,follow");
  upsertMeta("property", "og:title", cleanTitle);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:type", type);
  upsertMeta("property", "og:url", url);
  if (image) upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
  upsertMeta("name", "twitter:title", cleanTitle);
  upsertMeta("name", "twitter:description", description);
  if (image) upsertMeta("name", "twitter:image", image);
  upsertLink("canonical", url);
}

export function setProductSEO(jersey, image) {
  if (!jersey) return;
  const details = [jersey.team || jersey.club, jersey.player, jersey.season, jersey.league].filter(Boolean);
  const title = details.length ? `${jersey.name} — ${details.join(" · ")}` : jersey.name;
  const description = `Shop ${jersey.name}${details.length ? ` — ${details.join(", ")}` : ""} at JerseyBank. Check available sizes, pricing and delivery options.`;
  setSEO({ title, description, image, type: "product", path: `/jersey/${jersey.id}` });

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: jersey.name,
    description,
    image: image ? [image] : undefined,
    sku: jersey.id,
    brand: { "@type": "Brand", name: SITE_NAME },
    category: "Football jerseys",
    offers: {
      "@type": "Offer",
      url: new URL(`/jersey/${jersey.id}`, window.location.origin).href,
      priceCurrency: "NGN",
      price: Number(jersey.price || 0).toFixed(2),
      availability: jersey.stock && Object.values(jersey.stock).some((value) => Number(value) > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition"
    }
  };
  if (jersey.country) product.countryOfOrigin = jersey.country;
  upsertJsonLd(product);
}
