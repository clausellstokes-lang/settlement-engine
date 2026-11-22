// PEOPLE-2 builder B2 (2026-11-20): THE SHARES ON THE BUILT TREE, before (the base) and after (the tip), started from
// m4-measure.mjs and M6's sentence unit (m6-common.mjs :: cutDescription, sentencesOf). The births go through the REAL
// pipeline of each tree (no projection): 150 places a size, seeds hxd-<size>-0..149, born as the chair's instrument births
// them (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType }), null, { seed, customContent: {} }) after
// loadGenerationLawPayloads()), the place's own names masked to '#', digits to '0'.
//
// UNIT (the verdict's item 3, M6's): the SENTENCE as printed, over ALL 150 places of the size. A description is cut into its
// OPENING (the text before its first standing coda) and its CODAS (M6's 37 patterns of today's codas, and on a tree that
// voices them, every coda wording of src/data/powerLineVariants.js), each split into sentences and counted apart; a relation
// narrative is counted whole.
// It prints, by size: the top sentence and its share for openings, codas and relations; the codas (by branch) that print in
// more than half of the size's places, with their top sentence; and the governing seat's own atTable and worthBuying codas
// (the chair's F2 of 18:14 UTC), counted over the 900 places.
// F3 (PEOPLE-3 B2, the resumed brief's step 2): on a tree whose pipeline hands the pick a tie (`power/factionStanding.js ::
// standingLevelOf`), every card that prints the arcaneInShadow or noblesAhead coda (as written or voiced) is read twice: the
// tie the pass is handed (`standingLevelOf` on the record's own roster) and the tie the standing branch computes, its own
// selection re-run on the final roster as `power/rosterText.js :: settleStandingToRoster` re-runs it (`standingRosterOf`,
// the strongest first; the rival the first arcane power, the first `Merchant` power, there; level where its power equals the
// card's). A card whose final roster would not print the coda at all (its rival above it) is counted apart.
//
// Usage: node b2-shares.mjs <checkout> [n per size = 150]   (prints count lines only)
import { CODAS, maskerOf, pct, SIZES, sentencesOf } from './m6-common.mjs';

const [, , L, nArg = '150'] = process.argv;
if (!L) throw new Error('usage: node b2-shares.mjs <checkout> [n]');
const N = +nArg;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
await loadGenerationLawPayloads();
/** the tree's own coda wordings, where it has them */
let voiced = [];
try {
  const V = await import(`${L}/src/data/powerLineVariants.js`);
  const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  voiced = V.CODA_POOLS.flatMap((c) => c.rows.map((r) => ({ id: c.id, rx: new RegExp(esc(r.text).replace(/\\\$\d/g, '[^.;:]+?'), 'gi') })));
} catch { /* the base: no voiced codas */ }
/** F3: the tie the pass is handed, where the tree hands one; the standing roster, as rosterText.js reads it */
let standingLevelOf = null;
try {
  ({ standingLevelOf } = await import(`${L}/src/generators/power/factionStanding.js`));
} catch { /* none */ }
const { standingRosterOf } = await import(`${L}/src/generators/power/rosterText.js`);
const RIVAL_OF = { arcaneInShadow: (n) => n.toLowerCase().includes('arcane'), noblesAhead: (n) => n.includes('Merchant') };
const F3 = { cards: 0, branchLevel: 0, passLevel: 0, differ: 0, stale: 0, unsorted: 0, differs: [] };
const TODAY = CODAS.map((c) => ({ id: c.id, rx: new RegExp(c.re, 'g') }));
const PATTERNS = [...TODAY, ...voiced];
/** a description cut into its opening and its codas (M6's cut, with the tree's own coda wordings) */
function cut(desc) {
  const s = String(desc || '');
  const hits = [];
  for (const p of PATTERNS) { p.rx.lastIndex = 0; let m; while ((m = p.rx.exec(s))) hits.push({ id: p.id, text: m[0], index: m.index }); }
  hits.sort((a, b) => a.index - b.index || b.text.length - a.text.length);
  const kept = []; let end = -1;
  for (const h of hits) { if (h.index < end) continue; if (h.index > 0 && !/\s$/.test(s.slice(0, h.index))) continue; kept.push(h); end = h.index + h.text.length; }
  return { opening: (kept.length ? s.slice(0, kept[0].index) : s).trim(), codas: kept };
}
const AT_TABLE = /They are always at the table, but cannot set their own terms\./;
const WORTH_BUYING = /Close enough to the two above that their support is worth buying;/;

const add = (m, k, i) => { let st = m.get(k); if (!st) { st = new Set(); m.set(k, st); } st.add(i); };
const top = (m) => { let best = ''; let k = 0; for (const [s, st] of m) if (st.size > k) { k = st.size; best = s; } return [k, best]; };
let seatAtTable = 0; let seatWorthBuying = 0; let seatRank2 = 0;
console.log(`tree ${L.split('/').pop()} · ${N} places a size · voiced coda wordings ${voiced.length}`);
for (const size of SIZES) {
  const open = new Map(); const coda = new Map(); const rel = new Map(); const codaPlaces = new Map(); const codaTop = new Map();
  for (let i = 0; i < N; i++) {
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} });
    const names = new Set();
    const nm = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    nm(t.name);
    for (const p of t.npcs || []) { nm(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) nm(w); }
    for (const f of t.powerStructure?.factions || []) { nm(f.name); nm(f.faction); }
    const mask = maskerOf(names);
    const factions = t.powerStructure?.factions || [];
    if (factions.some((f, k) => k > 0 && Number(factions[k - 1].power) < Number(f.power))) F3.unsorted++;
    factions.forEach((f, rank) => {
      const { opening, codas } = cut(f.desc);
      for (const c of codas) {
        if (!RIVAL_OF[c.id] || typeof standingLevelOf !== 'function') continue;
        const roster = standingRosterOf(factions);
        const card = roster.find((x) => x.faction === f.faction);
        const rival = roster.find((x) => RIVAL_OF[c.id](x.faction));
        const branch = !!card && !!rival && rival.faction !== card.faction && rival.power === card.power;
        const pass = standingLevelOf(factions, f, c.id) === true;
        F3.cards++;
        if (branch) F3.branchLevel++;
        if (pass) F3.passLevel++;
        if (!card || !rival || rival.power > card.power) F3.stale++;
        if (branch !== pass) F3.differ++;
        if (branch !== pass && F3.differs.length < 5) F3.differs.push(`hxd-${size}-${i} ${f.faction} ${c.id} branch ${branch} pass ${pass}`);
      }
      for (const s of sentencesOf(opening)) add(open, mask(s), i);
      for (const c of codas) {
        add(codaPlaces, c.id, i);
        for (const s of sentencesOf(c.text)) { add(coda, mask(s), i); let m = codaTop.get(c.id); if (!m) { m = new Map(); codaTop.set(c.id, m); } add(m, mask(s), i); }
      }
      if (f.isGoverning && rank === 2) {
        seatRank2++;
        if (AT_TABLE.test(String(f.desc || ''))) seatAtTable++;
        if (WORTH_BUYING.test(String(f.desc || ''))) seatWorthBuying++;
      }
    });
    for (const r of t.powerStructure?.factionRelationships || []) if (typeof r.narrative === 'string' && r.narrative.length >= 25) add(rel, mask(r.narrative), i);
  }
  for (const [part, m] of [['openings', open], ['codas', coda], ['relations', rel]]) {
    const [k, s] = top(m);
    console.log(`TOP ${size} ${part}: ${k}/${N} ${pct(k, N)} | ${s}`);
  }
  for (const [id, st] of [...codaPlaces].sort((a, b) => b[1].size - a[1].size)) {
    if (st.size / N <= 0.5) continue;
    const [k, s] = top(codaTop.get(id));
    console.log(`OVER-HALF ${size} coda ${id}: places ${st.size}/${N} ${pct(st.size, N)} · its top sentence ${k}/${N} ${pct(k, N)} | ${s}`);
  }
}
if (typeof standingLevelOf === 'function') {
  console.log(`F3 cards printing arcaneInShadow or noblesAhead: ${F3.cards} · level by the branch's own selection ${F3.branchLevel} · level as handed (standingLevelOf) ${F3.passLevel} · differ ${F3.differ} · the coda not the final roster's ${F3.stale} · places whose roster is not strongest-first ${F3.unsorted}`);
  for (const d of F3.differs) console.log(`F3 DIFFERS ${d}`);
}
console.log(`SEAT the governing seat at rank 2: ${seatRank2} cards over ${SIZES.length * N} places · atTable ${seatAtTable} · worthBuying ${seatWorthBuying}`);
