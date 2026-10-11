// ============================================================
// CLOUDINARY - where jersey photos are stored
// Paste your two values below (Cloudinary dashboard > see steps).
// ============================================================

export const CLOUDINARY_CLOUD_NAME = "kxsb1vbm";
export const CLOUDINARY_UPLOAD_PRESET = "JerseyBank";

// Uploads one image file and returns its public URL.
// Used by the admin dashboard when you add a jersey photo.
export async function uploadImage(file) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  // Abort if Cloudinary hasn't responded in 30s, so the UI never hangs
  // forever with no feedback (e.g. wrong preset, network issue).
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  let res;
  try {
    res = await fetch(url, { method: "POST", body, signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Upload timed out after 30s. Check your internet connection and try a smaller photo.");
    }
    // Usually a network/CORS-level failure (offline, blocked domain, etc.)
    console.error("Cloudinary upload network error:", err);
    throw new Error("Couldn't reach Cloudinary. Check your internet connection.");
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    // Surface Cloudinary's real error message instead of hiding it.
    let detail = "";
    try {
      const errBody = await res.json();
      detail = errBody?.error?.message || "";
    } catch {
      // response wasn't JSON, ignore
    }
    console.error("Cloudinary upload failed:", res.status, detail);
    if (detail) {
      throw new Error(`Photo upload failed: ${detail}`);
    }
    throw new Error(`Photo upload failed (status ${res.status}). Check your Cloudinary upload preset "${CLOUDINARY_UPLOAD_PRESET}" exists and is set to "Unsigned".`);
  }
  const data = await res.json();
  return data.secure_url;
}

// Inserts Cloudinary transformation params into a stored image URL so it's
// served resized and compressed instead of the full original file.
// width: max pixel width to load (smaller for thumbnails, bigger for detail view)
export function optimizedUrl(url, width = 500) {
  if (!url || !url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
