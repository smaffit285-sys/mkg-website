import type { APIRoute } from "astro";
import { getWorkExamples } from "../../lib/proofFeed";
export const prerender = false;
export const GET: APIRoute = async () => {
  try {
    const cases = await getWorkExamples();
    const urls = ["https://www.miamiknifeguy.com/work/", ...cases.map(item => `https://www.miamiknifeguy.com/work/${item.slug}/`)];
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${url}</loc></url>`).join("")}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=60" } });
  } catch { return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Retry-After": "60", "Cache-Control": "no-store" } }); }
};
