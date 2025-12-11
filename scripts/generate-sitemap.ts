// scripts/generate-sitemap.ts
import { writeFileSync, mkdirSync, existsSync } from "fs";

const BASE_URL = "https://praptifoundation.in";
const API_URL =
  "https://prapti-foundation-be-874257626954.europe-west1.run.app/api"; // Update this

const staticPages = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/contact", priority: 0.7, changefreq: "monthly" },
  { path: "/blog", priority: 0.9, changefreq: "daily" },
  { path: "/gallery", priority: 0.7, changefreq: "weekly" },
  { path: "/rescue", priority: 0.9, changefreq: "daily" },
  { path: "/awards", priority: 0.6, changefreq: "monthly" },
  { path: "/volunteer", priority: 0.8, changefreq: "monthly" },
];

async function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static pages
  for (const page of staticPages) {
    xml += `
  <url>
    <loc>${BASE_URL}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  // Dynamic: Blogs
  try {
    const blogsRes = await fetch(`${API_URL}/blogs`);
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
  } catch (e) {
    console.warn("Failed to fetch blogs");
  }

  // Dynamic: Rescues
  try {
    const rescuesRes = await fetch(`${API_URL}/rescues`);
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
  } catch (e) {
    console.warn("Failed to fetch rescues");
  }

  xml += "\n</urlset>";

  if (!existsSync("public")) {
    mkdirSync("public");
  }

  writeFileSync("public/sitemap.xml", xml);
  console.log("✅ Sitemap generated at public/sitemap.xml");
}

generateSitemap();
