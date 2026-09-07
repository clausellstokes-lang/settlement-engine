import fs from "node:fs";
import crypto from "node:crypto";
const dir = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep";
const k = JSON.parse(fs.readFileSync(`${dir}/kept-martin.json`, "utf8"));
const ent = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ", hellip: "…", mdash: "—", ndash: "–", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };
const decode = (s) => s.replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d)).replace(/&([a-z]+);/gi, (m, n) => ent[n.toLowerCase()] ?? m);
const strip = (html) => decode(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " "));
const norm = (s) => (s || "").toLowerCase().replace(/[‘’´`]/g, "'").replace(/[“”„]/g, '"').replace(/[–—]/g, "-").replace(/…/g, "...").replace(/ /g, " ").replace(/\s+/g, " ").trim();
const cache = new Map();
function pageText(url) {
  if (cache.has(url)) return cache.get(url);
  const h = crypto.createHash("md5").update(url).digest("hex").slice(0, 12);
  const base = `${dir}/critic-martin-live/${h}`;
  let code = "?"; try { code = fs.readFileSync(`${base}.code`, "utf8").trim(); } catch {}
  let text = "";
  if (fs.existsSync(`${base}.pdftxt`)) text = fs.readFileSync(`${base}.pdftxt`, "utf8");
  else if (fs.existsSync(`${base}.html`)) { const raw = fs.readFileSync(`${base}.html`, "latin1"); text = raw.startsWith("%PDF") ? "" : strip(fs.readFileSync(`${base}.html`, "utf8")); }
  const r = { code, text: norm(text), len: text.length };
  cache.set(url, r); return r;
}
// loose matcher: split trueWording on ellipses / [..] / quotes; require each fragment >= 3 words to be present; strip leading/trailing quote marks and bracketed edits
function fragments(tw) {
  let t = norm(tw).replace(/^"+|"+$/g, "").replace(/\[[^\]]*\]/g, " ").replace(/\(\s*\)/g, " ");
  return t.split(/\.\.\.|\s\.\s|;\s|\s-\s\(|\)\s/).map((f) => f.replace(/^[\s"'(),.-]+|[\s"'(),.-]+$/g, "")).filter((f) => f.split(" ").length >= 3);
}
const rows = []; const summary = { hit: 0, miss: 0, partial: 0, unreachable: 0 };
for (const c of k) {
  const p = pageText(c.url);
  const tw = c.verdict.trueWording || "";
  const frs = fragments(tw);
  let status;
  if (p.code !== "200" || p.len < 200) { status = "UNREACHABLE"; summary.unreachable++; }
  else if (frs.length === 0) { status = "NOFRAG"; }
  else {
    const hits = frs.map((f) => p.text.includes(f));
    if (hits.every(Boolean)) { status = "HIT"; summary.hit++; }
    else if (hits.some(Boolean)) { status = "PARTIAL"; summary.partial++; }
    else {
      // second try: quote field
      const q = norm(c.quote).replace(/^"+|"+$/g, "");
      status = q && q.split(" ").length >= 3 && p.text.includes(q) ? "QUOTE-ONLY" : "MISS";
      if (status === "MISS") summary.miss++;
    }
  }
  rows.push({ index: c.index, status, code: p.code, verdict: c.verdict.verdict, source: c.source.slice(0, 55), url: c.url, tw: tw.slice(0, 140), frs });
}
fs.writeFileSync(`${dir}/critic-martin-live/match-results.json`, JSON.stringify(rows, null, 1));
console.log("summary", JSON.stringify(summary), "total", rows.length);
for (const r of rows) if (r.status !== "HIT") console.log(`${r.status.padEnd(11)} #${String(r.index).padEnd(4)} ${r.verdict.padEnd(18)} http=${r.code} | ${r.source} | ${r.tw}`);
