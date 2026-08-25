const SITE_URL = "https://5noon.vercel.app";
const DEFAULT_TITLE = "شركة خمسة نون العربية | تجارة وتسوق - وادي الدواسر والخرمة";
const DEFAULT_DESCRIPTION =
  "شركة خمسة نون العربية للتجارة والتسوق — فروعنا في وادي الدواسر والخرمة. ملابس، عطور، ألعاب، أدوات منزلية وأكثر بأسعار تنافسية.";

type MetaInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Update document title / description / Open Graph tags per page.
 * Call at the top of a page component (runs on mount).
 */
export function setPageMeta(input: MetaInput = {}) {
  const title = input.title ?? DEFAULT_TITLE;
  const description = input.description ?? DEFAULT_DESCRIPTION;
  const url = SITE_URL + (input.path ?? window.location.pathname);
  const image = input.image ?? SITE_URL + "/logo-final.png";

  document.title = title;

  setMeta("name", "description", description);
  setMeta("name", "robots", input.noindex ? "noindex, nofollow" : "index, follow");

  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", image);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:locale", "ar_SA");
  setMeta("property", "og:site_name", "شركة خمسة نون العربية");

  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setMeta("name", "twitter:image", image);

  setCanonical(url);
}

export { SITE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION };
