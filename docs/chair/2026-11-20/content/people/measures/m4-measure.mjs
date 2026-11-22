// PEOPLE-1 seat M4 (2026-11-20): `powerStructure.factionRelationships[].narrative` and `powerStructure.factions[].desc`,
// today and projected, on the births m4-births.mjs cached (n per size, the chair's instrument's seeds and mask).
//
// TODAY: every relation row is classified to the branch that wrote it (m4-common.mjs :: relationBranch, the writer's own
// sentence shapes); every power's description to the pooled opening it starts with. "Share" (MEASURE-COMMON): the places of
// a size printing the masked sentence at the field, over the places of that size holding the field at all.
//
// THE PROJECTION: the proposal's pools (m4-pools.mjs) are applied HERE, not in src/. The proposal places the pick in ONE
// draw-free pass on the FINAL record (after generateSettlementPipeline's last power writes: keepOneDominant,
// settleClergyToFinalRoster, settleArcaneToPractitioners, withConflictRelations), so the projection reads exactly what that
// pass would read: the final rows and descriptions, and the facts through factsOf on the final record. A row is varied only
// where its narrative is a pooled branch's untouched line (a conflict twin is never varied); a description only where it
// OPENS with a pooled line (its standing coda is kept). The eligible list is [today's line, ...the variants whose needs hold
// and whose excludes do not], in pool order, and `pickVariant` (src/kernel/proseHash.js, the real function) picks one, keyed
// '<record _seed>::powerStructure.factionRelationships.narrative::<the pair, sorted, joined by ||>' or
// '<record _seed>::powerStructure.factions.desc::<the power's name>'.
//
// WHERE THE FIELDS PRINT (read in src/; SAME-1's render of 300 places, the chair's note of 16:30 UTC, shows both printed):
//   powerStructure.factions[].desc — the Power tab (src/components/new/tabs/power/PowerStrata.jsx, `f.desc` on each power's
//     card) and the PDF (src/pdf/lib/viewModel.js `description: f?.desc` -> src/pdf/sections/PowerStructure.jsx); the
//     writer-reach baseline also marks campaign-pdf, dossier-pdf, foundry and world-book (scripts/.writer-reach-baseline.json,
//     "desc on factions"); searchable (src/domain/dossier/dossierSearch.js).
//   powerStructure.factionRelationships[].narrative — the Power tab (PowerStrata.jsx prints `e.narrative` under each tie, the
//     rows read through src/domain/dossier/powerStrata.js), from village up (a thorp holds almost no relation row).
//
// Usage: node m4-measure.mjs <checkout> <cache.json>   (prints count lines only)
import { readFileSync } from 'node:fs';
import { maskerOf, pct, SIZES, relationBranch, admits } from './m4-common.mjs';
import { RELATION_POOLS, DESC_POOLS, CODA_POOLS } from './m4-pools.mjs';
const sentencesOf = (s) => String(s).match(/[^.!?]+[.!?]+(\s|$)/g)?.map((x) => x.trim()) || [String(s)];

const [, , L, cachePath] = process.argv;
if (!L || !cachePath) throw new Error('usage: node m4-measure.mjs <checkout> <cache.json>');
const { pickVariant } = await import(`${L}/src/kernel/proseHash.js`);
const { powerNameWithArticle, powerNameAfterArticle, powerPossessive } = await import(`${L}/src/domain/display/powerSentenceName.js`);
const { pluralPowerName } = await import(`${L}/src/domain/display/pluralPowerName.js`);
const cache = JSON.parse(readFileSync(cachePath, 'utf8'));

// ── the writer's own name forms (factionDynamics.js :: say, sayOf, verb, opening) ──
const say = (name) => powerNameWithArticle(name);
const sayOf = (name) => `the ${powerPossessive(powerNameAfterArticle(name))}`;
const plural = (name) => !!pluralPowerName(say(name));
const opening = (t) => t.replace(/(^|[.!?]\s+)the /g, '$1The ');
const ROLES = { GM: ['G', 'Mil'], GE: ['G', 'M'], GR: ['G', 'R'], MC: ['M', 'C'], MR: ['M', 'R'], NG: ['N', 'G'] };
function render(text, roles) {
  const out = text.replace(/\{(\w+)('s)?(?:\|([^|}]*)\|([^}]*))?\}/g, (_m, role, poss, one, many) => {
    const name = roles[role];
    if (name == null) throw new Error(`role ${role} unbound in: ${text}`);
    if (role === 'L') return name; // the landholders, as the line already says them
    if (one !== undefined) return plural(name) ? many : one;
    return poss ? sayOf(name) : say(name);
  });
  return opening(out);
}

/** The pool a row draws from: its branch, NG.sub split by the writer's own merchant clause. */
function relationPoolKey(row, branch) {
  if (branch === 'NG.sub') return /merchant money and /.test(row.narrative) ? 'NG.sub+merchant' : 'NG.sub';
  return branch;
}
function rolesOf(row, branch) {
  const kind = branch.split('.')[0];
  const [a, b] = ROLES[kind] || [];
  const roles = { [a]: row.pair[0], [b]: row.pair[1] };
  if (branch === 'MC.vote-against') roles.L = / vote together against (.+), then fight over who keeps the profit\.$/.exec(row.narrative)[1];
  return roles;
}

// ── the guards every variant passes (run here; a miss prints) ──
const SEASON = /\b(winter|summer|spring|autumn|harvest|season)/i;
const MACHINERY = /\b(power share|faction|ratio|legitimacy score|percent|%)/i;
let guardMiss = 0;
for (const [k, pool] of [...Object.entries(RELATION_POOLS), ...Object.entries(DESC_POOLS), ...CODA_POOLS.map((c) => [c.id, c.variants])]) for (const v of pool) {
  const words = v.text.replace(/\{[^}]*\}/g, 'X').split(/\s+/).length;
  if (SEASON.test(v.text) || MACHINERY.test(v.text) || words > 45) { guardMiss++; console.log(`GUARD MISS ${k}: ${v.text}`); }
}
console.log(`guards: ${Object.values(RELATION_POOLS).flat().length} relation variants, ${Object.values(DESC_POOLS).flat().length} description variants; season / machinery / >45 words misses: ${guardMiss}`);

const isLeaf = (s) => typeof s === 'string' && s.length >= 25 && s.includes(' ');
const topOf = (byPlace) => { // Map(sentence -> Set(place)) -> [sentence, count]
  let best = null; let n = 0; for (const [s, st] of byPlace) if (st.size > n) { n = st.size; best = s; } return [best, n];
};
const addTo = (m, s, i) => { let st = m.get(s); if (!st) { st = new Set(); m.set(s, st); } st.add(i); };

const SUMMARY = { narrative: {}, desc: {} };
for (const size of SIZES) {
  const places = cache.sizes[size];
  // ════ factionRelationships[].narrative ════
  const nToday = new Map(); const nProj = new Map(); const nProjPlain = new Map(); let nHolders = 0;
  const branchPlaces = new Map(); const branchEntries = new Map(); const pooledRows = { varied: 0, kept0: 0, twins: 0 };
  for (const p of places) {
    const mask = maskerOf(p.names);
    let holds = false;
    for (const row of p.relations) {
      if (!isLeaf(row.narrative)) continue;
      holds = true;
      const { branch, twin } = relationBranch(row);
      const bk = twin ? `${branch} (+conflict twin)` : branch;
      addTo(branchPlaces, bk, p.i); branchEntries.set(bk, (branchEntries.get(bk) || 0) + 1);
      addTo(nToday, mask(row.narrative), p.i);
      const poolKey = relationPoolKey(row, branch);
      const pool = twin ? null : RELATION_POOLS[poolKey];
      if (twin && RELATION_POOLS[poolKey]) pooledRows.twins++;
      let projected = row.narrative; let plain = row.narrative;
      if (pool) {
        const roles = rolesOf(row, branch);
        const key = `${p.recordSeed}::powerStructure.factionRelationships.narrative::${[...row.pair].sort().join('||')}`;
        const eligible = [row.narrative, ...pool.filter((v) => admits(v, p.facts)).map((v) => render(v.text, roles))];
        projected = pickVariant(eligible, key);
        const eligiblePlain = [row.narrative, ...pool.filter((v) => !(v.needs || []).length && admits(v, p.facts)).map((v) => render(v.text, roles))];
        plain = pickVariant(eligiblePlain, key);
        if (projected === row.narrative) pooledRows.kept0++; else pooledRows.varied++;
      }
      addTo(nProj, mask(projected), p.i); addTo(nProjPlain, mask(plain), p.i);
    }
    if (holds) nHolders++;
  }
  const [t0, c0] = topOf(nToday); const [t1, c1] = topOf(nProj); const [t2, c2] = topOf(nProjPlain);
  console.log(`\n=== ${size} · narrative: places holding the field ${nHolders}`);
  for (const [b, st] of [...branchPlaces].sort((x, y) => y[1].size - x[1].size)) console.log(`branch ${size} narrative ${b}: places ${st.size} · entries ${branchEntries.get(b)} (${pct(st.size, nHolders)})`);
  console.log(`pooled rows ${size}: varied ${pooledRows.varied} · kept index 0 ${pooledRows.kept0} · conflict twins left as they are ${pooledRows.twins}`);
  console.log(`TODAY ${size} narrative top ${c0}/${nHolders} ${pct(c0, nHolders)} | ${t0}`);
  console.log(`PROJECTED ${size} narrative top ${c1}/${nHolders} ${pct(c1, nHolders)} | ${t1}`);
  console.log(`PROJECTED-NO-ATOM ${size} narrative top ${c2}/${nHolders} ${pct(c2, nHolders)} (only the variants that declare no atom)`);
  const over = [...nProj].filter(([, st]) => st.size / nHolders > 0.15).map(([s, st]) => `${st.size} | ${s}`);
  for (const o of over) console.log(`  over the bar after the projection ${size}: ${o}`);
  SUMMARY.narrative[size] = { holders: nHolders, today: c0, proj: c1, plain: c2 };

  // ════ factions[].desc ════
  const dToday = new Map(); const dProj = new Map(); const dProjC = new Map(); const openProj = new Map(); const tails = new Map(); let dHolders = 0;
  const sToday = new Map(); const sProj = new Map(); const sProjC = new Map(); // sentence level (a caution, not the instrument's unit)
  const openPlaces = new Map(); const openEntries = new Map();
  const OPENINGS = Object.keys(DESC_POOLS);
  for (const p of places) {
    const mask = maskerOf(p.names);
    let holds = false;
    for (const f of p.factions) {
      if (!isLeaf(f.desc)) continue;
      holds = true;
      const desc = f.desc;
      addTo(dToday, mask(desc), p.i);
      const open = OPENINGS.find((o) => desc === o || desc.startsWith(`${o} `));
      let projected = desc;
      if (open) {
        addTo(openPlaces, open, p.i); openEntries.set(open, (openEntries.get(open) || 0) + 1);
        const key = `${p.recordSeed}::powerStructure.factions.desc::${f.faction}`;
        const eligible = [open, ...DESC_POOLS[open].filter((v) => admits(v, p.facts)).map((v) => v.text)];
        const chosen = pickVariant(eligible, key);
        projected = chosen + desc.slice(open.length);
        addTo(openProj, chosen, p.i);
        const tail = desc.slice(open.length).trim();
        if (tail) addTo(tails, mask(tail), p.i);
      }
      // the second, separable step: the standing codas, each where it stands, by its own key
      let projectedC = projected;
      for (const c of CODA_POOLS) {
        const re = new RegExp(c.re);
        const m = re.exec(projectedC);
        if (!m) continue;
        const key = `${p.recordSeed}::powerStructure.factions.desc::${f.faction}::${c.id}`;
        const fill = (t) => opening(t.replace(/\$(\d)/g, (_x, d) => m[+d]));
        const eligible = [m[0], ...c.variants.filter((v) => admits(v, p.facts)).map((v) => fill(v.text))];
        projectedC = projectedC.slice(0, m.index) + pickVariant(eligible, key) + projectedC.slice(m.index + m[0].length);
      }
      addTo(dProj, mask(projected), p.i); addTo(dProjC, mask(projectedC), p.i);
      for (const [src, into] of [[desc, sToday], [projected, sProj], [projectedC, sProjC]]) for (const s of sentencesOf(src)) addTo(into, mask(s), p.i);
    }
    if (holds) dHolders++;
  }
  const [d0, e0] = topOf(dToday); const [d1, e1] = topOf(dProj); const [o1, oc] = topOf(openProj); const [tl, tc] = topOf(tails);
  const [dc, ec] = topOf(dProjC); const [s0, sc0] = topOf(sToday); const [s1, sc1] = topOf(sProj); const [s2, sc2] = topOf(sProjC);
  console.log(`\n=== ${size} · desc: places holding the field ${dHolders}`);
  for (const [o, st] of [...openPlaces].sort((x, y) => y[1].size - x[1].size)) console.log(`opening ${size} desc: places ${st.size} · entries ${openEntries.get(o)} (${pct(st.size, dHolders)}) | ${o.slice(0, 90)}`);
  console.log(`TODAY ${size} desc top ${e0}/${dHolders} ${pct(e0, dHolders)} | ${d0}`);
  console.log(`PROJECTED ${size} desc top ${e1}/${dHolders} ${pct(e1, dHolders)} | ${d1}`);
  console.log(`PROJECTED ${size} desc commonest OPENING wording ${oc}/${dHolders} ${pct(oc, dHolders)} | ${o1}`);
  console.log(`CAUTION ${size} desc commonest standing coda after a pooled opening (unchanged by the proposal) ${tc}/${dHolders} ${pct(tc, dHolders)} | ${tl}`);
  const overD = [...dProj].filter(([, st]) => st.size / dHolders > 0.15).map(([s, st]) => `${st.size} | ${s.slice(0, 160)}`);
  for (const o of overD) console.log(`  over the bar after the projection ${size}: ${o}`);
  console.log(`PROJECTED+CODAS ${size} desc top ${ec}/${dHolders} ${pct(ec, dHolders)} | ${dc}`);
  console.log(`SENTENCE ${size} desc commonest sentence: today ${sc0}/${dHolders} ${pct(sc0, dHolders)} | ${s0}`);
  console.log(`SENTENCE ${size} desc commonest sentence: openings pooled ${sc1}/${dHolders} ${pct(sc1, dHolders)} | ${s1}`);
  console.log(`SENTENCE ${size} desc commonest sentence: openings and codas pooled ${sc2}/${dHolders} ${pct(sc2, dHolders)} | ${s2}`);
  for (const [s, st] of [...sProjC].filter(([, st]) => st.size / dHolders > 0.15).sort((a, b) => b[1].size - a[1].size)) console.log(`  sentence over the bar with codas pooled ${size}: ${st.size} | ${s.slice(0, 160)}`);
  SUMMARY.desc[size] = { holders: dHolders, today: e0, proj: e1, opening: oc, projC: ec, s0: sc0, s1: sc1, s2: sc2 };
}

console.log('\nSUMMARY (places printing the commonest sentence / places holding the field)');
for (const f of ['narrative', 'desc']) for (const size of SIZES) {
  const s = SUMMARY[f][size];
  console.log(`SUMMARY ${f} ${size}: today ${s.today}/${s.holders} ${pct(s.today, s.holders)} · projected ${s.proj}/${s.holders} ${pct(s.proj, s.holders)}${f === 'narrative' ? ` · no-atom variants only ${s.plain}/${s.holders} ${pct(s.plain, s.holders)}` : ` · commonest opening ${s.opening}/${s.holders} ${pct(s.opening, s.holders)} · with codas pooled ${s.projC}/${s.holders} ${pct(s.projC, s.holders)} · SENTENCE-level today ${pct(s.s0, s.holders)} / openings ${pct(s.s1, s.holders)} / openings+codas ${pct(s.s2, s.holders)}`}`);
}
console.log('\nAPPROXIMATIONS: (1) the facts are read through factsOf on the FINAL record (m4-births.mjs), which is what the proposed final pass reads; a pick placed at the writer instead (the power step) would read the power step\'s partial record and differ where a late step changes a fact. (2) The atoms are read by m4-common.mjs :: atomHolds over cached facts, a stand-in for factVocabulary.js\'s readers (the same homes). (3) The branch is read off the row\'s sentence shape, not re-run through the writer; an unrecognised row is OTHER and is never varied. (4) 100 places a size: a swing of about 3 places is noise; a figure at 14-15% sits at the bar, not under it by a margin.');
