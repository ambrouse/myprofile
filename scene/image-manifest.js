const STORY_DIR = "./story/";
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

const isStoryImage = (name) => {
  const lower = String(name || "").toLowerCase();
  return ALLOWED_EXT.some((ext) => lower.endsWith(ext));
};

const normalizePath = (href) => {
  if (!href) return null;
  const cleaned = href.split("?")[0].split("#")[0];
  if (!isStoryImage(cleaned)) return null;
  if (cleaned.startsWith("./story/")) return cleaned;
  if (cleaned.startsWith("story/")) return `./${cleaned}`;
  if (cleaned.startsWith("/story/")) return `.${cleaned}`;
  return `./story/${cleaned.replace(/^\.?\//, "")}`;
};

const dedupe = (arr) => [...new Set(arr)];

const loadFromManifestFile = async () => {
  const res = await fetch(`${STORY_DIR}manifest.json`, { cache: "no-store" });
  if (!res.ok) return [];

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return dedupe(data.map(normalizePath).filter(Boolean));
};

const loadFromDirectoryIndex = async () => {
  const res = await fetch(STORY_DIR, { cache: "no-store" });
  if (!res.ok) return [];

  const html = await res.text();
  const dom = new DOMParser().parseFromString(html, "text/html");
  const links = [...dom.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"));
  return dedupe(links.map(normalizePath).filter(Boolean));
};

export const loadImageManifest = async () => {
  try {
    const fromManifest = await loadFromManifestFile();
    if (fromManifest.length) return fromManifest;
  } catch {
    // Continue with directory listing fallback.
  }

  try {
    const fromDirectory = await loadFromDirectoryIndex();
    if (fromDirectory.length) return fromDirectory;
  } catch {
    // Final fallback is an empty list.
  }

  return [];
};

