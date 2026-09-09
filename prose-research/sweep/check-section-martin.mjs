import fs from "node:fs";
const dir = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep";
const md = fs.readFileSync(`${dir}/section-martin.md`, "utf8");
const k = JSON.parse(fs.readFileSync(`${dir}/kept-martin.json`, "utf8"));
const kept = new Map(k.map((c) => [c.index, c]));
console.log("em dashes:", (md.match(/—/g) || []).length);
const cited = new Set([...md.matchAll(/\[(\d{1,3})\]/g)].map((m) => +m[1]));
const uncited = [...kept.keys()].filter((i) => !cited.has(i));
const bad = [...cited].filter((i) => !kept.has(i));
console.log("kept", kept.size, "cited distinct", cited.size, "uncited kept:", JSON.stringify(uncited), "cited-but-not-kept:", JSON.stringify(bad));
const norm = (s) => s.toLowerCase().replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, "-").replace(/\s+/g, " ").trim();
const tw = k.map((c) => norm(c.verdict.trueWording || ""));
// Remove escaped inner quotes (\") so they do not split spans; keep them as a marker char.
const MARK = "§";
const text = md.replace(/\\"/g, MARK);
const re = /"([^"\n]{3,}?)"/g;
let m, n = 0; const fails = [], longs = [];
while ((m = re.exec(text))) {
  n++;
  const raw = m[1];
  const q = norm(raw.replace(new RegExp(MARK, "g"), '"'));
  const words = q.replace(/"/g, "").split(/\s+/).filter(Boolean).length;
  if (words > 11) longs.push([words, raw]);
  const hit = tw.some((t) => t.includes(q));
  if (!hit) fails.push(raw);
}
console.log("quotes found", n, "over 11 words:", longs.length, "not substring of any trueWording:", fails.length);
for (const l of longs) console.log("LONG", l[0], "|", l[1]);
for (const f of fails) console.log("MISS |", f);
