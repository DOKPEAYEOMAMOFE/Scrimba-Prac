const WISHLIST_KEY = "jerseybank:wishlist";
const RECENT_KEY = "jerseybank:recent";
const MAX_RECENT = 12;

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; }
}
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }

export function getWishlist() { return read(WISHLIST_KEY); }
export function isWishlisted(id) { return getWishlist().includes(String(id)); }
export function toggleWishlist(id) {
  const value = String(id);
  const current = getWishlist();
  const next = current.includes(value) ? current.filter((item) => item !== value) : [value, ...current];
  write(WISHLIST_KEY, next);
  window.dispatchEvent(new Event("jerseybank:wishlist"));
  return next.includes(value);
}
export function getRecentIds() { return read(RECENT_KEY); }
export function addRecent(id) {
  const value = String(id);
  const next = [value, ...getRecentIds().filter((item) => item !== value)].slice(0, MAX_RECENT);
  write(RECENT_KEY, next);
}
export function clearRecent() { write(RECENT_KEY, []); window.dispatchEvent(new Event("jerseybank:recent")); }
