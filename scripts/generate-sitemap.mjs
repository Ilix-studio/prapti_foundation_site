// scripts/generate-sitemap.mjs
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://praptifoundation.in";
const API_URL =
  "https://prapti-foundation-be-874257626954.europe-west1.run.app/api";

const staticPages = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/contact", priority: 0.7, changefreq: "monthly" },
  { path: "/blog", priority: 0.9, changefreq: "daily" },
  { path: "/gallery", priority: 0.7, changefreq: "weekly" },
  { path: "/rescue", priority: 0.9, changefreq: "daily" },
  { path: "/awards", priority: 0.6, changefreq: "monthly" },
  { path: "/volunteer", priority: 0.8, changefreq: "monthly" },
  { path: "/support", priority: 0.8, changefreq: "monthly" },
  { path: "/testimonial", priority: 0.6, changefreq: "weekly" },
];

async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  // Blogs
  try {
    const blogsRes = await fetchWithTimeout(`${API_URL}/blogs`);
    const blogs = await blogsRes.json();
    const blogList = Array.isArray(blogs) ? blogs : blogs.data || [];

    for (const blog of blogList) {
      xml += `
  <url>
    <loc>${BASE_URL}/blog/${blog._id}</loc>
    <lastmod>${blog.updatedAt?.split("T")[0] || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
    console.log(`✅ Added ${blogList.length} blogs`);
  } catch (e) {
    console.warn("⚠️ Failed to fetch blogs:", e.message || e);
  }

  // Rescues
  try {
    const rescuesRes = await fetchWithTimeout(`${API_URL}/rescues`);
    const rescues = await rescuesRes.json();
    const rescueList = rescues.data?.rescues || rescues.data || [];

    for (const rescue of rescueList) {
      xml += `
  <url>
    <loc>${BASE_URL}/rescue/${rescue._id}</loc>
    <lastmod>${rescue.updatedAt?.split("T")[0] || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
    console.log(`✅ Added ${rescueList.length} rescues`);
  } catch (e) {
    console.warn("⚠️ Failed to fetch rescues:", e.message || e);
  }

  xml += "\n</urlset>";

  const publicDir = resolve(__dirname, "../public");
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = resolve(publicDir, "sitemap.xml");
  writeFileSync(sitemapPath, xml);
  console.log(`✅ Sitemap generated at ${sitemapPath}`);
}

generateSitemap().catch((e) => {
  console.error("❌ Sitemap generation failed:", e.message || e);
  process.exit(1);
});
