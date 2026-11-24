// Site-wide constants for CraftyNest.
// Single source of truth for the domain, site name and social handles.
// Change SITE_URL here if the domain ever changes — every page, the
// sitemap and all structured data read from this file.

export const SITE_URL = "https://diy.bilalmania.com";
export const SITE_NAME = "CraftyNest";
export const SITE_TAGLINE = "DIY Crafts & Home Decor Ideas";
export const PINTEREST_URL = "https://www.pinterest.com/ezraashere223/";
export const PINTEREST_USERNAME = "@ezraashere223";

/** Truncate a string to `max` characters without cutting mid-word. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
