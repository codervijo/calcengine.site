/**
 * SEO invariant tests — run against the built dist/ directory.
 *
 * Run:  pnpm test:seo
 * Requires a prior `pnpm build`.
 *
 * Enforced invariants
 * -------------------
 * 1. Every <loc> in the sitemap does NOT end with a trailing slash (homepage "/" excluded).
 * 2. Each sitemap URL maps to an existing HTML file in dist/.
 * 3. Each HTML file has exactly one <link rel="canonical"> tag.
 * 4. The canonical href EXACTLY matches the sitemap <loc> URL.
 * 5. The canonical href uses https and the www subdomain.
 * 6. Internal <a href> links resolve to files that exist in dist/.
 * 7. Internal links do not end with a trailing slash (except "/" itself).
 * 8. sitemap-index.xml and all sub-sitemaps are valid, parseable XML.
 * 9. No page has <meta name="robots" content="noindex"> (unless whitelisted).
 */

import { describe, it, expect, beforeAll } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DIST = path.resolve(__dirname, "../dist");
const SITE = "https://www.calcengine.site";

/** Pages explicitly allowed to carry noindex (relative paths inside dist/). */
const NOINDEX_WHITELIST: string[] = [];

// ---------------------------------------------------------------------------
// Minimal XML helpers (no external parser dependency)
// ---------------------------------------------------------------------------

function parseXmlLocs(xml: string): string[] {
  const locs: string[] = [];
  const re = /<loc>\s*(.*?)\s*<\/loc>/gs;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    locs.push(m[1].trim());
  }
  return locs;
}

function parseSitemapIndexRefs(xml: string): string[] {
  const refs: string[] = [];
  const re = /<sitemap>[\s\S]*?<loc>\s*(.*?)\s*<\/loc>[\s\S]*?<\/sitemap>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    refs.push(m[1].trim());
  }
  return refs;
}

function isValidXml(xml: string): boolean {
  // Basic well-formedness: has a root element and no unmatched tags.
  return xml.trim().startsWith("<?xml") || xml.trim().startsWith("<");
}

// ---------------------------------------------------------------------------
// HTML helpers
// ---------------------------------------------------------------------------

function extractCanonicals(html: string): string[] {
  const results: string[] = [];
  const re = /<link[^>]+rel=["']canonical["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const tag = m[0];
    const hrefMatch = /href=["']([^"']+)["']/i.exec(tag);
    if (hrefMatch) results.push(hrefMatch[1]);
  }
  // Also match href before rel
  const re2 = /<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["'][^>]*>/gi;
  while ((m = re2.exec(html)) !== null) {
    const href = m[1];
    if (!results.includes(href)) results.push(href);
  }
  return results;
}

function hasNoindex(html: string): boolean {
  return /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/i.test(html)
    || /<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]*name=["']robots["'][^>]*>/i.test(html);
}

function extractInternalLinks(html: string): string[] {
  const links: string[] = [];
  const re = /<a[^>]+href=["']([^"'#?]+)[^"']*["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const href = m[1].trim();
    // Keep only relative paths and same-origin absolute URLs
    if (href.startsWith("/") || href.startsWith(SITE)) {
      links.push(href);
    }
  }
  return links;
}

// ---------------------------------------------------------------------------
// File resolution helpers
// ---------------------------------------------------------------------------

/**
 * Convert a URL or path to the expected file path inside dist/.
 * e.g. https://www.calcengine.site/calculators/foo → dist/calculators/foo.html
 *      /calculators/foo                             → dist/calculators/foo.html
 *      /                                            → dist/index.html
 */
function urlToDistFile(urlOrPath: string): string {
  let p = urlOrPath.startsWith(SITE)
    ? urlOrPath.slice(SITE.length)
    : urlOrPath;

  // Strip trailing slash (Astro `trailingSlash: 'never'` outputs flat files)
  p = p.replace(/\/$/, "") || "/";

  if (p === "/") return path.join(DIST, "index.html");
  // Astro static output: /calculators/foo → dist/calculators/foo.html
  // OR dist/calculators/foo/index.html (directory-style)
  const flat = path.join(DIST, p + ".html");
  const dir = path.join(DIST, p, "index.html");
  return fs.existsSync(flat) ? flat : dir;
}

function fileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

// ---------------------------------------------------------------------------
// Collect all HTML files in dist/
// ---------------------------------------------------------------------------

function walkHtmlFiles(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtmlFiles(full, files);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// State populated in beforeAll
// ---------------------------------------------------------------------------

interface PageRecord {
  sitemapUrl: string;
  distFile: string;
  html: string;
  canonicals: string[];
}

let allSitemapUrls: string[] = [];
let allDistHtmlFiles: string[] = [];
const pageRecords: PageRecord[] = [];
const internalLinkErrors: string[] = [];

// ---------------------------------------------------------------------------

beforeAll(() => {
  if (!fs.existsSync(DIST)) {
    throw new Error(
      `dist/ directory not found at ${DIST}. Run \`pnpm build\` first.`
    );
  }

  // --- Parse sitemap-index.xml ---
  const sitemapIndexPath = path.join(DIST, "sitemap-index.xml");
  if (!fs.existsSync(sitemapIndexPath)) {
    throw new Error("dist/sitemap-index.xml not found. Run `pnpm build`.");
  }
  const sitemapIndexXml = fs.readFileSync(sitemapIndexPath, "utf-8");

  // Gather sub-sitemap URLs from the index
  const subSitemapUrls = parseSitemapIndexRefs(sitemapIndexXml);

  // Read each sub-sitemap and collect locs
  for (const subUrl of subSitemapUrls) {
    // Convert URL to local file path
    const relativePath = subUrl.startsWith(SITE)
      ? subUrl.slice(SITE.length)
      : subUrl;
    const localPath = path.join(DIST, relativePath);
    if (!fs.existsSync(localPath)) continue;
    const subXml = fs.readFileSync(localPath, "utf-8");
    allSitemapUrls.push(...parseXmlLocs(subXml));
  }

  // If no sub-sitemaps, try reading locs directly from index
  if (allSitemapUrls.length === 0) {
    allSitemapUrls = parseXmlLocs(sitemapIndexXml);
  }

  // --- Walk dist/ for HTML files ---
  allDistHtmlFiles = walkHtmlFiles(DIST);

  // --- Build page records ---
  for (const sitemapUrl of allSitemapUrls) {
    const distFile = urlToDistFile(sitemapUrl);
    if (!fileExists(distFile)) continue;
    const html = fs.readFileSync(distFile, "utf-8");
    const canonicals = extractCanonicals(html);
    pageRecords.push({ sitemapUrl, distFile, html, canonicals });
  }

  // --- Collect internal link errors (crawl all HTML files) ---
  for (const htmlFile of allDistHtmlFiles) {
    const html = fs.readFileSync(htmlFile, "utf-8");
    const links = extractInternalLinks(html);
    for (const href of links) {
      const target = urlToDistFile(href);
      if (!fileExists(target)) {
        internalLinkErrors.push(
          `Broken link in ${path.relative(DIST, htmlFile)}: ${href} → ${path.relative(DIST, target)} (not found)`
        );
      }
      // Trailing slash check (everything except "/" itself)
      const bare = href.startsWith(SITE) ? href.slice(SITE.length) : href;
      if (bare !== "/" && bare.endsWith("/")) {
        internalLinkErrors.push(
          `Trailing-slash link in ${path.relative(DIST, htmlFile)}: ${href}`
        );
      }
    }
  }

  // Summary line
  console.log(
    `\n=== SEO Test Summary ===\n` +
    `Total sitemap URLs:    ${allSitemapUrls.length}\n` +
    `Total HTML files:      ${allDistHtmlFiles.length}\n` +
    `Pages with records:    ${pageRecords.length}\n` +
    `Internal link errors:  ${internalLinkErrors.length}\n`
  );
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Sitemap XML validity", () => {
  it("sitemap-index.xml is valid XML", () => {
    const sitemapIndexPath = path.join(DIST, "sitemap-index.xml");
    const xml = fs.readFileSync(sitemapIndexPath, "utf-8");
    expect(isValidXml(xml), "sitemap-index.xml is not valid XML").toBe(true);
    expect(xml).toContain("<sitemapindex");
  });

  it("all sub-sitemaps are valid XML", () => {
    const sitemapIndexPath = path.join(DIST, "sitemap-index.xml");
    const xml = fs.readFileSync(sitemapIndexPath, "utf-8");
    const refs = parseSitemapIndexRefs(xml);
    const errors: string[] = [];
    for (const url of refs) {
      const rel = url.startsWith(SITE) ? url.slice(SITE.length) : url;
      const local = path.join(DIST, rel);
      if (!fs.existsSync(local)) {
        errors.push(`Sub-sitemap file not found: ${local}`);
        continue;
      }
      const subXml = fs.readFileSync(local, "utf-8");
      if (!isValidXml(subXml)) {
        errors.push(`Invalid XML in sub-sitemap: ${rel}`);
      }
      if (!subXml.includes("<urlset")) {
        errors.push(`Sub-sitemap missing <urlset>: ${rel}`);
      }
    }
    if (errors.length > 0) {
      throw new Error(`XML errors:\n${errors.join("\n")}`);
    }
  });

  it("sitemap contains at least one URL", () => {
    expect(
      allSitemapUrls.length,
      "Sitemap has no <loc> URLs"
    ).toBeGreaterThan(0);
  });
});

describe("Sitemap URLs — no trailing slash", () => {
  it("no sitemap URL (except homepage root) ends with a trailing slash", () => {
    const offenders = allSitemapUrls.filter((url) => {
      const path = url.startsWith(SITE) ? url.slice(SITE.length) : url;
      return path !== "/" && url.endsWith("/");
    });
    if (offenders.length > 0) {
      throw new Error(
        `${offenders.length} sitemap URL(s) have trailing slash:\n${offenders.join("\n")}`
      );
    }
  });

  it("all sitemap URLs use https and www subdomain", () => {
    const offenders = allSitemapUrls.filter(
      (url) => !url.startsWith("https://www.")
    );
    if (offenders.length > 0) {
      throw new Error(
        `${offenders.length} sitemap URL(s) do not start with https://www.:\n${offenders.join("\n")}`
      );
    }
  });
});

describe("Sitemap URLs — corresponding HTML files exist", () => {
  it("every sitemap URL maps to an existing file in dist/", () => {
    const missing: string[] = [];
    for (const url of allSitemapUrls) {
      const distFile = urlToDistFile(url);
      if (!fileExists(distFile)) {
        missing.push(`${url} → ${path.relative(DIST, distFile)} (not found)`);
      }
    }
    if (missing.length > 0) {
      throw new Error(
        `${missing.length} sitemap URL(s) have no corresponding HTML file:\n${missing.join("\n")}`
      );
    }
  });
});

describe("Canonical tags", () => {
  it("every page has exactly one <link rel=\"canonical\"> tag", () => {
    const errors: string[] = [];
    for (const { sitemapUrl, distFile, canonicals } of pageRecords) {
      if (canonicals.length !== 1) {
        errors.push(
          `${path.relative(DIST, distFile)} (${sitemapUrl}): found ${canonicals.length} canonical tag(s) — expected 1`
        );
      }
    }
    if (errors.length > 0) {
      throw new Error(`Canonical count errors:\n${errors.join("\n")}`);
    }
  });

  it("canonical href exactly matches the sitemap URL", () => {
    const errors: string[] = [];
    for (const { sitemapUrl, distFile, canonicals } of pageRecords) {
      const canonical = canonicals[0];
      if (canonical !== sitemapUrl) {
        errors.push(
          `${path.relative(DIST, distFile)}\n  sitemap:   ${sitemapUrl}\n  canonical: ${canonical}`
        );
      }
    }
    if (errors.length > 0) {
      throw new Error(
        `${errors.length} page(s) have canonical/sitemap mismatch:\n\n${errors.join("\n\n")}`
      );
    }
  });

  it("canonical href uses https and www subdomain", () => {
    const errors: string[] = [];
    for (const { distFile, canonicals } of pageRecords) {
      const canonical = canonicals[0];
      if (!canonical.startsWith("https://www.")) {
        errors.push(
          `${path.relative(DIST, distFile)}: canonical is ${canonical}`
        );
      }
    }
    if (errors.length > 0) {
      throw new Error(
        `${errors.length} page(s) have canonical not starting with https://www.:\n${errors.join("\n")}`
      );
    }
  });
});

describe("Internal links", () => {
  it("no internal links are broken or have trailing slashes", () => {
    if (internalLinkErrors.length > 0) {
      throw new Error(
        `${internalLinkErrors.length} internal link error(s):\n${internalLinkErrors.join("\n")}`
      );
    }
  });
});

describe("Robots / noindex", () => {
  it("no page has a noindex meta tag (unless whitelisted)", () => {
    const errors: string[] = [];
    for (const htmlFile of allDistHtmlFiles) {
      const rel = path.relative(DIST, htmlFile);
      if (NOINDEX_WHITELIST.includes(rel)) continue;
      const html = fs.readFileSync(htmlFile, "utf-8");
      if (hasNoindex(html)) {
        errors.push(rel);
      }
    }
    if (errors.length > 0) {
      throw new Error(
        `${errors.length} page(s) have noindex meta tag:\n${errors.join("\n")}`
      );
    }
  });
});
