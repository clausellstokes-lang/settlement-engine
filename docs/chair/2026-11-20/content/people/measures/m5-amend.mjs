// PEOPLE-2 seat M5 (2026-11-20): THE AMENDED FOUNDER WORDINGS (the fill read's cures) and their checks.
// AMEND maps an M3 wording (m3-pools.mjs :: FOUNDER_VARIANTS, its text exactly) to the wording M5 proposes in its place;
// the needs are M3's, unchanged, so every place keeps its eligible list's length and the hash picks the same index.
// This script: (1) checks each M3 text is in the pool; (2) runs M3's guards (m3-origins.mjs: lowercase noun phrase,
// speakTierNoun leaves it, the row's sovereign words kept, no maritime claim without coast, <= 30 words, no struck tic)
// on the amended wordings; (3) re-projects foundedBy and the rite sentence with the amended pool over the same places
// and prints the top shares; (4) prints each amended wording in the three founding frames, for the read.
// Usage: node m5-amend.mjs <base-checkout> <trad-tree> <cache.json> <trad-views>
import { readFileSync, readdirSync } from 'node:fs';

export const AMEND = Object.freeze({
  // A. a motion verb before {ground}, a place phrase ("came in the hills", "fled on the shore", "moved its business on the riverbank")
  'a discharged soldier who came {ground} with nowhere better to be, and stayed': 'a discharged soldier with nowhere better to be who settled {ground} and stayed',
  'a group of settlers who came {ground} looking for land of their own': 'a group of settlers who looked for land of their own and found it {ground}',
  'escaped serfs who fled {ground}, beyond the reach of their former masters': 'escaped serfs who hid {ground} beyond the reach of their former masters',
  'a merchant coalition that outgrew the place it started in and moved its business {ground}': 'a merchant coalition that outgrew the place it started in and set up again {ground}',
  // B. a clause ending on a bare word the frame's ", <age> years ago" completes ("drew others after, 120 years ago")
  'a retired tradesperson who settled {ground}, whose skills drew others after': 'a retired tradesperson who settled {ground} and whose skills drew others to follow',
  'a retired tradesperson who set up by the road, whose skills drew others to settle near': 'a retired tradesperson who set up by the road and whose skills drew others to settle nearby',
  'a retired tradesperson who set up where the roads cross, whose skills drew others to settle near': 'a retired tradesperson who set up where the roads cross and whose skills drew others to settle nearby',
  'a healer who stopped at the crossroads to treat a traveller and stayed, since every road brought more': 'a healer who stopped at the crossroads to treat a traveller and stayed where every road brought more',
  // C. a comma that splits the founder in two after "by" ("founded by royal decree, and a century of …, 300 years ago")
  'royal decree, and a century of forced investment in its walls and markets': 'royal decree and a century of forced investment in walls and markets',
  'royal decree to build a city {ground}, and a century of forced investment': 'royal decree to build a city {ground} and a century of forced investment',
  'royal decree to hold the river, and a century of forced investment': 'royal decree to hold the river and a century of forced investment',
  'royal decree to hold the crossing of the roads, and a century of forced investment': 'royal decree to hold the crossing of the roads and a century of forced investment',
  'imperial decree, and skilled people moved by force to settle {ground}': 'imperial decree and the forced settling of skilled people {ground}',
  'imperial decree to hold the river, and the forced relocation of skilled populations': 'imperial decree to hold the river and the forced relocation of skilled populations',
  'imperial decree to hold the road, and the forced relocation of skilled populations': 'imperial decree to hold the road and the forced relocation of skilled populations',
  'the slow accretion of three smaller settlements around a shared market, eventually merged under a single administration': 'the slow accretion of three smaller settlements around a shared market that eventually merged under a single administration',
  // D. a span the frame's point in time fights ("whose members drifted into secular life over two generations, 120 years ago")
  'a small religious community that settled {ground}, whose members drifted into secular life over two generations': 'a small religious community that settled {ground} and whose members drifted into secular life over the next two generations',
  'a small religious community that built the first temple here, whose members drifted into secular life over two generations': 'a small religious community that built the first temple here and whose members drifted into secular life over the next two generations',
  // E. stacked commas that hang the age on the last verb
  'a discharged soldier who took the road home, stopped here, and never went on': 'a discharged soldier who stopped here on the road home and never went on',
  'a pair of siblings who stopped where the roads cross, unable to agree which road to take': 'a pair of siblings who stopped where the roads cross because they could not agree which road to take',
});

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const [, , L, T, cachePath, tradDir] = process.argv;
  const P = await import(new URL('./m3-pools.mjs', import.meta.url));
  const { pickVariant } = await import(`${L}/src/kernel/proseHash.js`);
  const { speakTierNoun } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
  const { tierNounFor } = await import(`${L}/src/domain/display/stateProse/weaveBlock.js`);
  const { textAssertsMaritimeCapability } = await import(`${L}/src/generators/generationContext.js`);
  const { CAUSE_FRAMES } = await import(`${T}/src/data/traditionDescriptionTable.js`);
  const C = JSON.parse(readFileSync(cachePath, 'utf8'));
  const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const lines = []; const out = (x) => lines.push(x);
  // (1) every key is an M3 wording; build the amended pool
  const known = new Map(); for (const [row, ws] of Object.entries(P.FOUNDER_VARIANTS)) for (const w of ws) known.set(w.text, row);
  const missing = Object.keys(AMEND).filter((k) => !known.has(k));
  const POOL = Object.fromEntries(Object.entries(P.FOUNDER_VARIANTS).map(([row, ws]) => [row, ws.map((w) => ({ ...w, text: AMEND[w.text] ?? w.text }))]));
  out(`AMEND: ${Object.keys(AMEND).length} wordings replaced; M3 texts not found ${missing.length}${missing.length ? ` :: ${missing.join(' | ')}` : ''}`);
  // (2) M3's guards on the amended wordings
  const TICS = /\b(arithmetic|the record|two different things|a separate question|nothing has broken yet|which is the kind of|rather than|a stranger)\b/i;
  const SOV = /\b(lord(s|'s)?|liege|overlord|crown|king|king's|queen|monarch|throne|noble oversight|baron|duke|earl|vassals?|fealty|tribute to|emperor|royal|imperial)\b/gi;
  const miss = [];
  for (const [m3, m5] of Object.entries(AMEND)) {
    const row = known.get(m3); const w = (P.FOUNDER_VARIANTS[row] || []).find((x) => x.text === m3) || { needs: [] };
    if (/^[^a-z]/.test(m5)) miss.push(`not a lowercase noun phrase: ${m5}`);
    if (m5.split(/\s+/).length > 30) miss.push(`over 30 words: ${m5}`);
    if (TICS.test(m5)) miss.push(`a struck tic: ${m5}`);
    if (textAssertsMaritimeCapability(m5) && !(w.needs || []).includes('coast')) miss.push(`maritime without coast: ${m5}`);
    for (const tier of SIZES) { const t = m5.split('{ground}').join('in the hills'); if (speakTierNoun(t, tierNounFor(tier)) !== t) miss.push(`speakTierNoun rewrites it at ${tier}: ${m5}`); }
    const own = new Set(((row || '').match(SOV) || []).map((x) => x.toLowerCase()));
    for (const x of own) if (!(m5.toLowerCase().match(SOV) || []).includes(x)) miss.push(`drops its row's sovereign word "${x}": ${m5}`);
    if (/,/.test(m5)) miss.push(`still holds a comma: ${m5}`);
  }
  out(`GUARDS on the amended wordings: misses ${miss.length}`); for (const m of miss) out(`  MISS ${m}`);
  // (3) the projection with the amended pool (M3's eligibility and fill, as m5-measure.mjs copies them)
  const valueOf = (on, dim) => { for (const a of on) if (a.startsWith(`${dim}: `)) return a.slice(dim.length + 2); return null; };
  const holds = (atom, on) => ((atom === 'terrain' || atom === 'route') ? valueOf(on, atom) != null : on.has(atom));
  const eligible = (w, on) => (w.needs || []).every((a) => holds(a, on)) && !(w.excludes || []).some((a) => holds(a, on));
  const fill = (text, on) => (text.includes('{ground}') ? text.split('{ground}').join(P.GROUND[valueOf(on, 'terrain')] || 'here') : text);
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const maskWith = (names) => { const list = [...names].sort((a, b) => b.length - a.length); const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null; return (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0'); };
  const TRAD = new Map(); for (const f of readdirSync(tradDir)) if (f.endsWith('.json')) { const j = JSON.parse(readFileSync(`${tradDir}/${f}`, 'utf8')); TRAD.set(j.seed, j); }
  const top = (m) => { let n = 0, s = null; for (const [k, c] of m) if (c > n) { n = c; s = k; } return { n, s }; };
  const pct = (n, d) => `${n}/${d} ${d ? Math.round((100 * n) / d) : 0}%`;
  const rows = [];
  let sameIndex = 0, nAll = 0;
  for (const z of SIZES) {
    const by = new Map(), rite = new Map(); let ritePlaces = 0;
    for (const p of C.sizes[z]) {
      const t = TRAD.get(p.seed); if (!t) continue;
      const on = new Set(p.birthOn || p.on); const stored = t.founding.foundedBy; const mask = maskWith(t.names);
      const elig = (POOL[stored] || []).filter((w) => eligible(w, on));
      const eligM3 = (P.FOUNDER_VARIANTS[stored] || []).filter((w) => eligible(w, on));
      const key = p.recordSeed ? `${p.recordSeed}::history.founding.foundedBy` : null;
      const list = [stored, ...elig.map((w) => fill(w.text, on))];
      const listM3 = [stored, ...eligM3.map((w) => fill(w.text, on))];
      nAll++; if (list.indexOf(pickVariant(list, key)) === listM3.indexOf(pickVariant(listM3, key))) sameIndex++;
      const picked = speakTierNoun(pickVariant(list, key), tierNounFor(p.tier));
      by.set(mask(picked), (by.get(mask(picked)) || 0) + 1);
      const r = (t.rites || []).find((x) => x.owner && x.owner.includes(stored));
      if (r) { ritePlaces++; const s = r.owner.split(/(?<=\.)\s+/).find((x) => x.includes(stored)).split(stored).join(picked); rite.set(mask(s), (rite.get(mask(s)) || 0) + 1); }
    }
    const a = top(by), b = top(rite);
    rows.push(`${z}: foundedBy projected ${pct(a.n, C.sizes[z].length)} :: ${a.s} || rite sentence projected ${pct(b.n, ritePlaces)} :: ${b.s}`);
  }
  out(`PROJECTION with the amended pool: the picked index equals M3's on ${sameIndex}/${nAll} places`);
  for (const r of rows) out(`  ${r}`);
  // (4) the read
  out('THE AMENDED WORDINGS IN THE THREE FOUNDING FRAMES ({ground} read as "in the hills"; the town #, the age 0):');
  for (const m5 of Object.values(AMEND)) for (const fr of CAUSE_FRAMES.founding) out(`  ${(fr.text || fr).split('{foundedBy}').join(m5.split('{ground}').join('in the hills')).split('{town}').join('#').split('{Town}').join('#').split('{age}').join('0')}`);
  console.log(lines.join('\n'));
}
