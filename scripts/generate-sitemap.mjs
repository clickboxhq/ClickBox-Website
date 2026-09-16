// Generates public/sitemap.xml from the same route registry the app and the
// edge middleware use (src/seo/routes.ts, src/seo/blogSeo.ts), so the
// sitemap can never drift from the app's actual public routes.
//
// Runs as an npm "prebuild" step (see package.json) — plain Node can't
// import .ts directly, so this uses esbuild (already a Vite dependency,
// no new dependency added) to bundle the route registry in-memory, then
// imports the result.

import { build } from "esbuild";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

async function loadRouteData() {
  const entry = path.join(ROOT, "src/seo/sitemapEntries.ts");
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
    alias: { "@": path.join(ROOT, "src") },
  });
  const tmp = await mkdtemp(path.join(tmpdir(), "clickbox-sitemap-"));
  const outFile = path.join(tmp, "sitemap-entries.mjs");
  await writeFile(outFile, result.outputFiles[0].text);
  try {
    const mod = await import(pathToFileURL(outFile).href);
    return mod.sitemapEntries();
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
}

function xmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function main() {
  const entries = await loadRouteData();

  const urls = entries
    .map((e) => {
      const loc = `    <loc>${xmlEscape(e.url)}</loc>`;
      const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : "";
      const priority = e.priority != null ? `\n    <priority>${e.priority.toFixed(1)}</priority>` : "";
      return `  <url>\n${loc}${lastmod}${priority}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  const outPath = path.join(ROOT, "public/sitemap.xml");
  await writeFile(outPath, xml, "utf8");
  console.log(`Wrote ${entries.length} URLs to public/sitemap.xml`);
}

main().catch((err) => {
  console.error("generate-sitemap failed:", err);
  process.exit(1);
});
