// The sitemap, built from the fixed pages plus one entry per open role, so opening or closing a role updates it.
import { SITE } from '../lib/site.js';
import { jobs, posted } from '../lib/jobs.js';

const updated = '2026-11-19'; // change when the fixed pages change
const pages = ['/', '/services/', '/about/', '/careers/', '/privacy/', '/terms/'].map((path) => [path, updated]);
const roles = jobs.map((job) => [`/careers/${job.slug}/`, posted]);

export function GET() {
  const urls = [...pages, ...roles].map(([path, date]) => `  <url><loc>${SITE}${path}</loc><lastmod>${date}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
