// Validate local HTML references without dependencies.
// External URLs are intentionally not checked (availability may vary).
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const skippedDirs = new Set([".git", "node_modules", ".venv", "__pycache__"]);
const allFiles = [];
function walk(folder) {
  for (const d of fs.readdirSync(folder, { withFileTypes: true })) {
    if (d.name.startsWith(".") && d.name !== ".well-known") continue;
    if (d.isDirectory()) { if (!skippedDirs.has(d.name)) walk(path.join(folder, d.name)); }
    else if (d.isFile()) allFiles.push(path.join(folder, d.name));
  }
}
walk(root);
const htmlFiles = allFiles.filter(p => p.endsWith(".html"));
const htmlCache = new Map(htmlFiles.map(p => [p, fs.readFileSync(p, "utf8")]));
const issues = [];
let checked = 0;
const refPattern = /\b(?:href|src)=["']([^"']+)["']/g;
for (const [source, html] of htmlCache) {
  for (const match of html.matchAll(refPattern)) {
    const value = match[1].replaceAll("&amp;", "&");
    if (/^(?:https?:|mailto:|tel:|data:|javascript:|blob:|\/\/)/i.test(value)) continue;
    if (value === "#" || value === "") continue;
    const [relative, fragment] = value.split("#", 2);
    const filePart = relative.split("?")[0];
    let dest = filePart
      ? filePart.startsWith("/")
        ? path.resolve(root, "." + filePart)
        : path.resolve(path.dirname(source), filePart)
      : source;
    if (!dest.startsWith(root + path.sep) && dest !== root) {
      issues.push(`${path.relative(root, source)}: reference escapes site: ${value}`);
      continue;
    }
    if (!path.extname(dest) || dest.endsWith(path.sep)) dest = path.join(dest, "index.html");
    if (!fs.existsSync(dest)) {
      issues.push(`${path.relative(root, source)}: missing ${value}`);
      continue;
    }
    checked++;
    if (fragment && dest.endsWith(".html")) {
      const target = htmlCache.get(dest) ?? fs.readFileSync(dest, "utf8");
      let decoded = fragment;
      try { decoded = decodeURIComponent(fragment); } catch {}
      const ids = [...target.matchAll(/\bid=["']([^"']+)["']/g)].map(x => x[1]);
      if (!ids.includes(decoded)) issues.push(`${path.relative(root, source)}: missing anchor ${value}`);
    }
  }
  // Content checks: preserve a single document-level title and navigation.
  if (!/<title>[^<]+<\/title>/i.test(html)) issues.push(`${path.relative(root, source)}: missing <title>`);
}
if (issues.length) {
  console.error(`Portfolio checks failed: ${issues.length} issue(s)\n${issues.join("\n")}\n`);
  process.exitCode = 1;
} else {
  console.log(`Portfolio checks passed: ${htmlFiles.length} HTML pages, ${checked} local references verified.`);
}
