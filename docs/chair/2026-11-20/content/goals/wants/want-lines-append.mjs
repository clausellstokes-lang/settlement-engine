// GOALS-3 builder 9 (scratch, docs only): the new lines of WANT-LINES-n.md files as an append map for wants-born.mjs /
// wants-goals-final.mjs ({ "<FAMILY>/<kind>/<vantage>": [lines] }), so a birth carries the WRITTEN lines, not placeholders.
// Usage: node want-lines-append.mjs <out.json> <WANT-LINES-n.md>...
import fs from 'node:fs';
const [, , OUT, ...FILES] = process.argv;
const NEW = {};
for (const f of FILES) { let cell = null, on = false;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    const h = /^### \d+ · (\w+)\/(\w+)\/(short|long) /.exec(line); if (h) { cell = h.slice(1, 4).join('/'); on = false; continue; }
    if (/^New:\s*$/.test(line)) { on = true; continue; }
    const m = /^\d+\. (.+)$/.exec(line); if (cell && on && m) (NEW[cell] ||= []).push(m[1].trim()); } }
fs.writeFileSync(OUT, JSON.stringify(NEW, null, 1));
console.log(`${Object.values(NEW).flat().length} lines in ${Object.keys(NEW).length} cells → ${OUT}`);
