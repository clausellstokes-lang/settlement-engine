// PEOPLE-2 seat M5 (2026-11-20): `history.founding.foundedBy` (and `.overcoming`) AS PRINTED.
// Reads:
//   <base-views>   m5-render.mjs's per-place files rendered in the BASE tree (this worktree's revision)
//   <trad-views>   the same rendered in the TRADITIONS tree (lane/trad-4-2026-11-20, the tree that holds TRAD-1's
//                  `domain/traditions/traditionDescription.js :: describeTradition`, the card's description)
//   <cache.json>   M3's births cache (m3-births.mjs, unchanged), for the birth-time atoms the projection's needs read
//   <trad-tree>    for CAUSE_FRAMES (the founding frames the rite fills)
// and prints count lines; writes the fill read (every distinct projected rite sentence with a NEW founder wording in it)
// to <fills.out.txt>.
// THE PROJECTION is M3's selection as written (m3-pools.mjs; m3-origins.mjs's eligibility, fill and speakTierNoun, copied
// here verbatim): pickVariant([resolvedRow, ...eligible], '<seed>::history.founding.foundedBy'). The rite's founding
// sentence fills `{foundedBy}` verbatim and its frame is keyed on the rite's id, not on the founder's words
// (traditionDescription.js :: describeTradition, S3), so the projected sentence is the printed one with the stored
// founder replaced by the projected one: exact, not approximate.
// Usage: node m5-measure.mjs <base-checkout> <trad-tree> <cache.json> <base-views> <trad-views> <fills.out.txt>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const [, , L, T, cachePath, baseDir, tradDir, fillsPath] = process.argv;
if (!fillsPath) throw new Error('usage: node m5-measure.mjs <base-checkout> <trad-tree> <cache.json> <base-views> <trad-views> <fills.out.txt>');
const P = await import(new URL('./m3-pools.mjs', import.meta.url));
const { pickVariant } = await import(`${L}/src/kernel/proseHash.js`);
const { speakTierNoun } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const { tierNounFor } = await import(`${L}/src/domain/display/stateProse/weaveBlock.js`);
const V = await import(`${L}/src/domain/facts/factVocabulary.js`);
const { CAUSE_FRAMES } = await import(`${T}/src/data/traditionDescriptionTable.js`);
const C = JSON.parse(readFileSync(cachePath, 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const BANDS = { prosperity: V.PROSPERITY_WORDS, tier: V.TIER_WORDS, population: V.POPULATION_WORDS };

// ── M3's eligibility and fill (m3-origins.mjs, verbatim) ─────────────────────────────────────────────────────────
const EXPORT_KEYS = Object.keys(P.EXPORT_WORD);
const siegeOf = (p) => (p.inputs.stressTypes || []).includes('under_siege');
const foodImportOf = (p) => Number(p.inputs.foodBalance?.importCoverage) > 0;
const valueOf = (on, dim) => { for (const a of on) if (a.startsWith(`${dim}: `)) return a.slice(dim.length + 2); return null; };
function holds(atom, p, on) {
  if (atom === 'FOOD_IMPORT') return foodImportOf(p);
  if (atom === 'crisis: under_siege') return siegeOf(p);
  if (atom === 'exported') return EXPORT_KEYS.some((k) => on.has(`exported: ${k}`));
  if (atom === 'terrain' || atom === 'route') return valueOf(on, atom) != null;
  const m = /^(prosperity|tier|population): ([≥≤]) (.+)$/.exec(atom);
  if (m) { const order = BANDS[m[1]]; const v = valueOf(on, m[1]); if (v == null) return false; const a = order.indexOf(v), b = order.indexOf(m[3]); return m[2] === '≥' ? a >= b : a <= b; }
  return on.has(atom);
}
const eligible = (w, p, on) => (w.needs || []).every((a) => holds(a, p, on)) && !(w.excludes || []).some((a) => holds(a, p, on));
function fill(text, p, on) {
  let t = text;
  if (t.includes('{ground}')) t = t.split('{ground}').join(P.GROUND[valueOf(on, 'terrain')] || 'here');
  if (t.includes('{export}')) t = t.split('{export}').join(P.EXPORT_WORD[EXPORT_KEYS.find((k) => on.has(`exported: ${k}`))] || '?');
  if (t.includes('{routeWay}')) t = t.split('{routeWay}').join(P.ROUTE_WAY[valueOf(on, 'route')] || 'from outside');
  return t;
}
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const maskWith = (names) => { const list = [...names].sort((a, b) => b.length - a.length); const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null; return (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0'); };

// ── read the rendered places ──────────────────────────────────────────────────────────────────────────────────────
const readViews = (dir) => { const m = new Map(); for (const f of readdirSync(dir)) if (f.endsWith('.json')) { const j = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')); m.set(j.seed, j); } return m; };
const BASE = readViews(baseDir), TRAD = readViews(tradDir);
const lines = []; const out = (s) => lines.push(s);
const tally = () => new Map();
const bump = (m, k, by = 1) => m.set(k, (m.get(k) || 0) + by);
const topOf = (m) => { let best = null, n = 0; for (const [s, c] of m) if (c > n) { n = c; best = s; } return { s: best, n }; };
const pct = (n, d) => `${n}/${d} ${d ? Math.round((100 * n) / d) : 0}%`;
const sentenceWith = (text, needle) => (text.split(/(?<=\.)\s+/).find((s) => s.includes(needle)) || null);
const has = (line, needle) => !!needle && line.toLowerCase().includes(needle.toLowerCase());

out(`base views ${BASE.size} · traditions-tree views ${TRAD.size} · cache base ${C.base ?? '(unset)'} n ${C.n}`);
// the births agree: the stored founding is the same in both trees and in M3's cache
let agreeBy = 0, agreeOv = 0, agreeCache = 0, nAll = 0;
for (const size of SIZES) for (const p of C.sizes[size]) {
  nAll++; const b = BASE.get(p.seed), t = TRAD.get(p.seed);
  if (b && t && b.founding.foundedBy === t.founding.foundedBy) agreeBy++;
  if (b && t && b.founding.overcoming === t.founding.overcoming) agreeOv++;
  if (b && b.founding.foundedBy === p.founding.foundedBy && b.founding.overcoming === p.founding.overcoming) agreeCache++;
}
out(`VALIDATION: foundedBy equal base=traditions tree ${agreeBy}/${nAll}; overcoming equal ${agreeOv}/${nAll}; base render = M3 cache (both fields) ${agreeCache}/${nAll}`);

// ── 1. PRINTED, by containment, by surface ───────────────────────────────────────────────────────────────────────
const SURF = ['History tab', 'Traditions card', 'other web views', 'PDF', 'Foundry journal'];
const surfaceHits = (j, field) => {
  const needle = j.founding[field];
  const web = field === 'foundedBy' ? j.web : j.webOv;
  const names = Object.keys(web || {});
  const r = {
    'History tab': names.some((n) => /\/History$/.test(n)),
    'Traditions card': names.some((n) => /Tradition/i.test(n)),
    'other web views': names.filter((n) => !/\/History$/.test(n) && !/Tradition/i.test(n)),
    PDF: !!(j.pdf && (field === 'foundedBy' ? j.pdf.by : j.pdf.ov)?.length),
    'Foundry journal': !!(j.foundry && j.foundry[field === 'foundedBy' ? 'by' : 'ov']),
  };
  r.needle = needle;
  return r;
};
const R = {};
const otherViews = { foundedBy: { base: tally(), trad: tally() }, overcoming: { base: tally(), trad: tally() } };
for (const size of SIZES) {
  const r = R[size] = {
    places: 0, printed: { base: {}, trad: {} }, printedOv: { base: {}, trad: {} },
    rites: 0, ritesBy: 0, ritesByRendered: 0, readerRitesBy: 0, coreShown: 0, coreAgeZero: 0, placesRite: 0,
    today: { by: tally(), ov: tally(), rite: tally() }, proj: { by: tally(), ov: tally(), rite: tally() },
    ritePlaces: 0, fills: tally(),
  };
  for (const tree of ['base', 'trad']) for (const s of SURF) { r.printed[tree][s] = 0; r.printedOv[tree][s] = 0; }
  for (const p of C.sizes[size]) {
    const b = BASE.get(p.seed), t = TRAD.get(p.seed);
    if (!b || !t) continue;
    r.places++;
    for (const [tree, j] of [['base', b], ['trad', t]]) {
      for (const [field, key] of [['foundedBy', 'printed'], ['overcoming', 'printedOv']]) {
        const h = surfaceHits(j, field);
        for (const s of SURF) {
          if (s === 'other web views') { if (h[s].length) r[key][tree][s]++; for (const n of h[s]) bump(otherViews[field][tree], n); } else if (h[s]) r[key][tree][s]++;
        }
      }
    }
    // the rites (the traditions tree's writer, composed for the owner and for a reader)
    const by = t.founding.foundedBy;
    const mask = maskWith(t.names);
    const tradLines = Object.values(t.trad || {}).flat();
    let riteSentence = null;
    for (const rite of t.rites || []) {
      r.rites++;
      const core = /\.0$/.test(rite.id) && rite.foundedYear === 1;
      if (core) r.coreShown++;
      if (rite.owner && rite.owner.includes(by)) {
        r.ritesBy++;
        if (tradLines.some((l) => l.includes(rite.owner))) r.ritesByRendered++;
        riteSentence = sentenceWith(rite.owner, by);
      }
      if (rite.reader && rite.reader.includes(by)) r.readerRitesBy++;
    }
    if (riteSentence) r.placesRite++;
    // ── 2/3. today and projected: the stored field, and the rite's sentence ──
    const birthOn = new Set(p.birthOn || p.on);
    const seed = p.recordSeed;
    bump(r.today.by, mask(by));
    const vars = P.FOUNDER_VARIANTS[by] || [];
    const list = [by, ...vars.filter((w) => eligible({ needs: w.needs, excludes: w.excludes || [] }, p, birthOn)).map((w) => fill(w.text, p, birthOn))];
    const picked = speakTierNoun(pickVariant(list, seed ? `${seed}::history.founding.foundedBy` : null), tierNounFor(p.tier));
    bump(r.proj.by, mask(picked));
    if (riteSentence) {
      r.ritePlaces++;
      bump(r.today.rite, mask(riteSentence));
      const projSentence = riteSentence.split(by).join(picked);
      bump(r.proj.rite, mask(projSentence));
      if (picked !== by) bump(r.fills, mask(projSentence));
    }
    // overcoming (M3's selection, verbatim)
    const ov = t.founding.overcoming;
    bump(r.today.ov, mask(ov));
    const table = Object.keys(P.OVERCOMING_TABLES).find((k) => P.OVERCOMING_TABLES[k].includes(ov));
    const kind = P.CHALLENGE_KIND[t.founding.initialChallenge] || '?';
    const ovVars = (P.OVERCOMING_VARIANTS[table] || {})[kind] || [];
    const ovList = [ov, ...ovVars.filter((w) => eligible({ needs: w.needs, excludes: w.excludes || [] }, p, birthOn)).map((w) => w.text)];
    bump(r.proj.ov, mask(speakTierNoun(pickVariant(ovList, seed ? `${seed}::history.founding.overcoming` : null), tierNounFor(p.tier))));
  }
}

out('\n1. PRINTED, BY CONTAINMENT (places of the size whose rendered surface contains the stored text)');
for (const [field, key] of [['foundedBy', 'printed'], ['overcoming', 'printedOv']]) for (const tree of ['base', 'trad']) {
  out(`${field} · ${tree === 'base' ? 'BASE tree' : 'TRADITIONS tree (lane/trad-4)'}: ${SURF.map((s) => `${s} [${SIZES.map((z) => R[z][key][tree][s]).join('/')}] = ${SIZES.reduce((a, z) => a + R[z][key][tree][s], 0)}`).join(' · ')}`);
  const ov = [...otherViews[field][tree]].sort((a, b) => b[1] - a[1]).map(([n, c]) => `${n} ${c}`).join(', ');
  out(`  other web views holding it: ${ov || 'none'}`);
}
out('(order of each bracket: thorp/hamlet/village/town/city/metropolis, of 100 places each)');
out('RITES (TRADITIONS tree: shownTraditionsOf, each composed by describeTradition for the owner and for a reader):');
for (const z of SIZES) { const r = R[z]; out(`  ${z}: rites shown ${r.rites} · founding core shown ${r.coreShown} · owner rites quoting foundedBy ${r.ritesBy} (rendered on the card ${r.ritesByRendered}) on ${r.placesRite} places · reader rites quoting it ${r.readerRitesBy}`); }
const tot = (k) => SIZES.reduce((a, z) => a + R[z][k], 0);
out(`  ALL: rites shown ${tot('rites')} · owner rites quoting foundedBy ${tot('ritesBy')} (${pct(tot('ritesBy'), tot('rites'))}; rendered ${tot('ritesByRendered')}) on ${tot('placesRite')} of ${tot('places')} places · reader rites quoting it ${tot('readerRitesBy')}`);

out('\n2./3. TOP SHARE BY SIZE, TODAY -> PROJECTED (M3\'s 108 wordings, its selection as written)');
for (const z of SIZES) {
  const r = R[z];
  const a = topOf(r.today.by), b = topOf(r.proj.by), c = topOf(r.today.rite), d = topOf(r.proj.rite), e = topOf(r.today.ov), f = topOf(r.proj.ov);
  out(`=== ${z}`);
  out(`TOP foundedBy today ${pct(a.n, r.places)} distinct ${r.today.by.size} :: ${a.s}`);
  out(`TOP foundedBy projected ${pct(b.n, r.places)} distinct ${r.proj.by.size} :: ${b.s}`);
  out(`TOP rite sentence today ${pct(c.n, r.ritePlaces)} distinct ${r.today.rite.size} :: ${c.s}`);
  out(`TOP rite sentence projected ${pct(d.n, r.ritePlaces)} distinct ${r.proj.rite.size} :: ${d.s}`);
  out(`TOP overcoming today ${pct(e.n, r.places)} distinct ${r.today.ov.size} :: ${e.s}`);
  out(`TOP overcoming projected ${pct(f.n, r.places)} distinct ${r.proj.ov.size} :: ${f.s}`);
}
out('\nSUMMARY (top share by size, today -> projected)');
for (const [k, label, den] of [['by', 'foundedBy', 'places'], ['rite', 'rite sentence', 'ritePlaces'], ['ov', 'overcoming', 'places']]) out(`${label}: ${SIZES.map((z) => `${z} ${pct(topOf(R[z].today[k]).n, R[z][den])} -> ${pct(topOf(R[z].proj[k]).n, R[z][den])}`).join(' · ')}`);

// ── 4. the fill read ──────────────────────────────────────────────────────────────────────────────────────────────
const fills = tally();
for (const z of SIZES) for (const [s, c] of R[z].fills) bump(fills, `${z}\t${s}`, c);
const fillLines = [...fills].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([s, c]) => `${c}\t${s}`);
const frameRead = [];
for (const [row, ws] of Object.entries(P.FOUNDER_VARIANTS)) for (const w of ws) for (const fr of CAUSE_FRAMES.founding) {
  const t = (fr.text || fr).split('{foundedBy}').join(w.text.split('{ground}').join('in the hills')).split('{town}').join('#').split('{Town}').join('#').split('{age}').join('0');
  frameRead.push(`${row.slice(0, 40)}\t${t}`);
}
writeFileSync(fillsPath, [
  '# M5 fill read (2026-11-20). A: every distinct rite sentence the projection prints with a NEW founder wording in it,',
  '# over the 600 places (count<TAB>size<TAB>sentence; the place\'s names masked to #, digits to 0).',
  `# A: ${fillLines.length} distinct sentences, ${[...fills.values()].reduce((a, c) => a + c, 0)} places`,
  ...fillLines,
  '#',
  '# B (a reading aid, not a count): every one of M3\'s 108 wordings in each of the three founding frames',
  '# (traditionDescription.js CAUSE_FRAMES.founding; {ground} read as "in the hills"). row<TAB>sentence',
  `# B: ${frameRead.length} lines`,
  ...frameRead,
].join('\n') + '\n');
out(`\n4. FILL READ: ${fillLines.length} distinct projected rite sentences with a new founder wording (${[...fills.values()].reduce((a, c) => a + c, 0)} places), written whole to the fills file; ${frameRead.length} frame-read lines after them`);
console.log(lines.join('\n'));
