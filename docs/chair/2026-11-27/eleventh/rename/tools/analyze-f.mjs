// node analyze-f.mjs <D-X.jsonl> <F-X.jsonl> <label> <out.json> : after the town's rename, the lines that still print the
// OLD name, each traced to the stored string leaf of the record it reads (by text), counted by home and by surface.
import { createReadStream, readFileSync, writeFileSync } from 'node:fs';
import readline from 'node:readline';
const [DF, FF, LABEL, OUT] = process.argv.slice(2);
const leavesBySeed = new Map(readFileSync(FF, 'utf8').split('\n').filter(Boolean).map((l) => { const j = JSON.parse(l); return [j.seed, j]; }));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const norm = (s) => String(s).replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
const homeOf = (p) => p.replace(/\[\d+\]/g, '[]');
const R = { label: LABEL, births: 0, pagesOld: 0, linesOld: 0, ownerPagesOld: 0, byHome: {}, bySurface: {}, unmatched: 0, unmatchedEx: [], pagesByHome: {} };
const surfaceOf = (v) => (/^PDF\//.test(v) ? 'PDF' : /^Foundry\//.test(v) ? 'Foundry' : /^Tonight\//.test(v) ? 'Tonight' : /^Session\//.test(v) ? 'Session' : 'owner page (tabs)');
const rl = readline.createInterface({ input: createReadStream(DF), crlfDelay: Infinity });
for await (const l of rl) {
  if (!l) continue;
  const j = JSON.parse(l); if (j.error || !j.vars?.T?.diff) continue;
  R.births++;
  const old = j.name; const re = new RegExp(`(^|[^\\p{L}])${esc(old)}($|[^\\p{L}])`, 'u');
  const T = j.vars.T; const leaves = (leavesBySeed.get(j.seed)?.leaves || []).map(([p, t]) => [p, norm(t)]);
  let pageOld = false; let tabsOld = false; const homesHere = new Set();
  for (const [view, lines] of Object.entries(j.views)) {
    const gone = new Set(T.diff[view]?.gone || []);
    const still = lines.filter((x) => re.test(x) && !gone.has(x)).concat((T.diff[view]?.came || []).filter((x) => re.test(x)));
    for (const x of still) {
      pageOld = true; R.linesOld++; const surf = surfaceOf(view); R.bySurface[surf] = (R.bySurface[surf] || 0) + 1; if (surf === 'owner page (tabs)') tabsOld = true;
      const nx = norm(x);
      // the leaf: one whose text holds the printed line, or a stretch of 40 characters around the old name in the line
      const at = nx.search(new RegExp(esc(old))); const win = nx.slice(Math.max(0, at - 30), at + old.length + 30);
      let hit = leaves.find(([, t]) => t.includes(nx) || (nx.length > 25 && nx.includes(t) && t.length > 25));
      if (!hit) hit = leaves.find(([, t]) => t.includes(win));
      if (!hit) { const wi = nx.slice(Math.max(0, at - 15), at + old.length + 15); hit = leaves.find(([, t]) => t.includes(wi)); }
      if (!hit) { R.unmatched++; if (R.unmatchedEx.length < 25) R.unmatchedEx.push({ seed: j.seed, view, line: x.slice(0, 300) }); continue; }
      const h = homeOf(hit[0]);
      const H = (R.byHome[h] ||= { lines: 0, pages: 0, surfaces: {}, ex: null });
      H.lines++; H.surfaces[surf] = (H.surfaces[surf] || 0) + 1;
      if (!homesHere.has(h)) { homesHere.add(h); H.pages++; }
      if (!H.ex) H.ex = { seed: j.seed, old, neu: T.neu, view, line: x.slice(0, 300) };
    }
  }
  if (pageOld) R.pagesOld++;
  if (tabsOld) R.ownerPagesOld++;
}
writeFileSync(OUT, JSON.stringify(R, null, 1));
console.log(`${LABEL}: births ${R.births}, pages still printing the old name ${R.pagesOld} (owner tabs ${R.ownerPagesOld}), lines ${R.linesOld}, unmatched ${R.unmatched}`, JSON.stringify(R.bySurface));
for (const [h, H] of Object.entries(R.byHome).sort((a, b) => b[1].pages - a[1].pages)) console.log(`  ${h}: pages ${H.pages}, lines ${H.lines} ${JSON.stringify(H.surfaces)}`);
