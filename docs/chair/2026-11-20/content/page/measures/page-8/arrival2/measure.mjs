// PAGE-8 ARRIVAL-LINES-2: THE MEASURE (measure only; reads src and the lines file, writes one cache JSON in `forge` mode).
//
// RUN (from the tree's root; every forge through the gate mutex, the machine is shared):
//   sh scripts/gate-mutex.sh --run -- node <this> forge "$PWD" 150 <cache.json>     # forge once, cache (about 2 min)
//   node <this> measure "$PWD" <cache.json> [<lines.md>]                             # read the cache; light
//   node <this> compare <before-cache.json> <after-cache.json>                       # what moved between two forges
// With <lines.md> (ARRIVAL-LINES-2-TO-CHAIR.md) it also PROJECTS the share after the drafted lines are wired.
//
// THE PLACES: the chair's recipe (PAGE-1's measure A): SIZES x i in 0..N-1, seed `hxd-${size}-${i}`, DEFAULT_CONFIG untouched.
// THE SURFACE: the record field `arrivalScene` (assembleSettlement.js :: `settlement.arrivalScene = inAssemblySubstream(rng,
// 'arrival-scene', () => generateArrivalScene(settlement))`; narrativeGenerator.js :: generateArrivalScene = composeArrivalScene),
// printed whole by OverviewTab.jsx (`data-testid="overview-place-arrival"`, `{r.arrivalScene}`), SummaryTab.jsx and the PDF.
// THE BAR (the chair's): over every triple of distinct places of one size (exact, C(150,3)), the chance that at least two of the
// three print one sentence word for word. STRICT = verbatim; MASKED = with each place's own name masked (the honest reading:
// "The market at A is audible..." and "The market at B is audible..." are one sentence to a reader). Both printed.
import { readFileSync, writeFileSync } from 'node:fs';

const [, , MODE, L, ...rest] = process.argv;
const out = (...a) => console.log(...a);
const pct = (x) => `${(100 * x).toFixed(1)}%`;

// ═════════════════════════════════════════ FORGE ═════════════════════════════════════════
if (MODE === 'forge') {
  const [nArg = '150', OUT] = rest; const N = Number(nArg);
  const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
  const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
  const { nativeSemanticNames } = await import(`${L}/src/domain/content/customContentSemanticAuthority.js`);
  const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
  const { atomHolds, declarationOf } = await import(`${L}/src/domain/facts/factVocabulary.js`);
  const { ARRIVAL_SENSES, ARRIVAL_PEOPLE, ARRIVAL_TENSIONS, ARRIVAL_MEMORIES } = await import(`${L}/src/data/arrivalProse.js`);
  const { ARRIVAL_SCENES, STRESS_DESCS } = await import(`${L}/src/data/narrativeData.js`);
  const { CULTURE_PROFILES } = await import(`${L}/src/data/cultureProfiles.js`);
  await loadGenerationLawPayloads();
  // every atom an arrival pool declares, plus those a drafted line may declare: answered once per place by the ONE reader
  const atoms = new Set(['walls', 'palisade', 'gate', 'watch', 'garrison', 'navigable', 'coast', 'docks', 'market', 'crisis: any',
    'crisis: calm', 'crisis: under_siege', 'crisis: hunger', 'crisis: succession', 'crisis: occupied', 'crisis: plague_onset',
    'crisis: threat', 'tier: ≥ village', 'tier: ≥ town', 'tier: ≥ city', 'tier: ≤ hamlet', 'route: isolated', 'population: ≥ middling']);
  const addDecl = (line) => { const d = declarationOf(line); for (const a of [...d.needs, ...d.excludes]) atoms.add(a); for (const c of d.crisis) atoms.add(`crisis: ${c}`); };
  for (const pool of [...Object.values(ARRIVAL_SCENES), ...Object.values(STRESS_DESCS), ...Object.values(ARRIVAL_PEOPLE),
    ...Object.values(ARRIVAL_TENSIONS), ...Object.values(ARRIVAL_MEMORIES), ...ARRIVAL_SENSES.flatMap((s) => [s.lines || [], s.dominant || []]),
    ...Object.values(CULTURE_PROFILES).map((p) => p.architecturalDetails || [])]) for (const l of pool) addDecl(l);
  const places = []; const t0 = Date.now();
  for (const size of SIZES) for (let i = 0; i < N; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const f = factsOf(t); const held = {};
    for (const a of atoms) { let v; try { v = atomHolds(a, f); } catch { v = undefined; } held[a] = v === undefined ? null : v; }
    const stress = (t.stress ? (Array.isArray(t.stress) ? t.stress : [t.stress]) : []).map((s) => s?.type).filter(Boolean);
    places.push({ seed, size, tier: t.tier, name: t.name, arrivalScene: t.arrivalScene ?? null, culture: t.config?.culture ?? null,
      route: t.config?.tradeRouteAccess ?? null, terrain: t.config?.terrainType ?? null,
      names: nativeSemanticNames(t.institutions || []).map((n) => String(n).toLowerCase()), stress, held });
    if (places.length % 150 === 0) console.error(`forged ${places.length} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  writeFileSync(OUT, JSON.stringify({ tree: L, n: N, sizes: SIZES, atoms: [...atoms], places }));
  out(`FORGED ${places.length} places (${SIZES.join(', ')} x ${N}) in ${((Date.now() - t0) / 1000).toFixed(0)}s -> ${OUT}`);
  process.exit(0);
}
// ═════════════════════════════════════════ COMPARE (two caches: the paragraph moved, by size and by beat) ═════════════════════════
if (MODE === 'compare') {
  const [A, B] = [L, ...rest].map((f) => JSON.parse(readFileSync(f, 'utf8')).places);
  const bySeed = new Map(B.map((p) => [p.seed, p]));
  const moved = {}; const other = [];
  for (const a of A) { const b = bySeed.get(a.seed); if (!b) { other.push(`${a.seed} missing`); continue; }
    if (a.arrivalScene !== b.arrivalScene) moved[a.size] = (moved[a.size] || 0) + 1;
    for (const k of ['size', 'tier', 'name', 'culture', 'route', 'terrain']) if (a[k] !== b[k]) other.push(`${a.seed} ${k}`);
    if (JSON.stringify(a.names) !== JSON.stringify(b.names)) other.push(`${a.seed} names`); if (JSON.stringify(a.stress) !== JSON.stringify(b.stress)) other.push(`${a.seed} stress`);
    for (const k of Object.keys(a.held)) if (k in b.held && a.held[k] !== b.held[k]) other.push(`${a.seed} held[${k}]`); } // atoms both forges answered
  out(`COMPARE: arrivalScene moved in ${Object.values(moved).reduce((x, y) => x + y, 0)} of ${A.length} places (${Object.entries(moved).map(([k, v]) => `${k} ${v}`).join(', ')}); other cached fields moved: ${other.length}${other.length ? ' ' + other.slice(0, 10).join(', ') : ''}`);
  process.exit(0);
}
// ═════════════════════════════════════════ DUMP / DUMPDIFF (the 300 whole, two trees) ═════════════════════════════════════════
//   node <this> dump <tree> 50 <out.json>   (through the gate mutex)   ·   node <this> dumpdiff <before.json> <after.json>
if (MODE === 'dump') {
  const [nArg = '50', OUT] = rest;
  const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
  const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
  const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
  const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
  await loadGenerationLawPayloads();
  const all = {};
  for (const size of SIZES) for (let i = 0; i < Number(nArg); i++) { const seed = `hxd-${size}-${i}`; all[seed] = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }); }
  writeFileSync(OUT, JSON.stringify(all)); out(`DUMPED ${Object.keys(all).length} -> ${OUT}`); process.exit(0);
}
if (MODE === 'dumpdiff') {
  const [A, B] = [L, rest[0]].map((f) => JSON.parse(readFileSync(f, 'utf8')));
  const paths = new Map(); let identical = 0;
  const walk = (x, y, path) => {
    if (x === y) return;
    if (typeof x !== typeof y || x === null || y === null || typeof x !== 'object') { const k = path.replace(/\[\d+\]/g, '[]'); paths.set(k, (paths.get(k) || 0) + 1); return; }
    for (const key of new Set([...Object.keys(x), ...Object.keys(y)])) walk(x[key], y[key], Array.isArray(x) ? `${path}[${key}]` : `${path}.${key}`);
  };
  for (const seed of Object.keys(A)) { const before = paths.size, cnt = [...paths.values()].reduce((s, v) => s + v, 0); walk(A[seed], B[seed], ''); if ([...paths.values()].reduce((s, v) => s + v, 0) === cnt && paths.size === before) identical++; }
  out(`DUMPDIFF: ${Object.keys(A).length} records; identical ${identical}; differing field paths: ${[...paths].map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}`);
  process.exit(0);
}
if (MODE !== 'measure') { console.error('mode: forge | measure | compare | dump | dumpdiff'); process.exit(2); }

// ═════════════════════════════════════════ MEASURE ═════════════════════════════════════════
const [CACHE, LINES] = rest;
const cache = JSON.parse(readFileSync(CACHE, 'utf8'));
const { places, sizes: SIZES } = cache;
const { ARRIVAL_SENSES, ARRIVAL_PEOPLE, ARRIVAL_TENSIONS, ARRIVAL_MEMORIES } = await import(`${L}/src/data/arrivalProse.js`);
const { ARRIVAL_SCENES, STRESS_DESCS } = await import(`${L}/src/data/narrativeData.js`);
const { CULTURE_PROFILES, CULTURE_LINE_SIBLINGS } = await import(`${L}/src/data/cultureProfiles.js`);
const { textOf } = await import(`${L}/src/domain/facts/textOf.js`);
const { declarationOf } = await import(`${L}/src/domain/facts/factVocabulary.js`);
const { speakTierNoun } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const { tierNounFor } = await import(`${L}/src/domain/display/stateProse/weaveBlock.js`);
const { sentenceCase } = await import(`${L}/src/generators/narrativeProse.js`);
const { fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
// mix32 is not in this tree yet: copied verbatim from `src/kernel/proseHash.js` at bd42d63c7 (lane/kernel-mix-2026-11-20),
// so the projection picks exactly as pickVariantMixed will: pool[mix32(fnv1a32(String(seed))) % pool.length]
const mix32 = (h) => { h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
const pickMixed = (n, key) => mix32(fnv1a32(key)) % n; // pickVariantMixed's index

// ── THE LANDMARK BEAT AS FOUND: structuralValidator.js :: checkInstCompat, branch by branch (first match wins; `has` is a
// substring test over the NATIVE names, lowercased). Mirrored here and every line asserted present in the source.
const svPath = `${L}/src/generators/structuralValidator.js`; const sv = readFileSync(svPath, 'utf8');
const inc = (names, ...k) => k.some((x) => names.some((n) => n.includes(x)));
export const BRANCHES = [
  { id: 'great cathedral', test: (n) => inc(n, 'great cathedral'), lines: [
    { text: "The great cathedral's spire is the tallest thing for miles.", house: ['great cathedral'] },
    { text: 'A cathedral dominates the skyline. Larger than anything else in the settlement, which may say something about what matters here.', house: ['great cathedral'] }] },
  { id: 'cathedral', test: (n, tier) => inc(n, 'cathedral') && tier !== 'thorp' && tier !== 'hamlet', lines: [
    { text: 'A stone cathedral anchors the high ground.', house: ['cathedral'] },
    { text: 'The cathedral bell tower is the first thing visible from this direction.', house: ['cathedral'] }] },
  { id: 'massive wall / citadel', test: (n) => inc(n, 'massive wall', 'citadel'), lines: [
    { text: 'The walls are serious. High stone, maintained, with watchtowers spaced to cover every angle.', house: ['massive wall'], needs: ['walls'] },
    { text: 'The citadel on the high ground makes clear that this settlement has been defended before and expects to be again.', house: ['citadel'] }] },
  { id: 'wall / gatehouse', test: (n) => inc(n, 'wall', 'gatehouse') && !inc(n, 'massive'), lines: [
    { text: 'A wall circuit, unremarkable but intact.', house: ['wall'], needs: ['walls'], excludes: ['crisis: under_siege'] },
    { text: 'The gatehouse arch frames the main road.', house: ['gate'], needs: ['gate'] }] },
  { id: 'mage tower', test: (n) => inc(n, 'wizard', 'mage') && inc(n, 'tower'), lines: [
    { text: "A tower rises above the roofline in a way that isn't architectural. It was added later, and whoever added it wasn't interested in fitting in.", house: ['tower'] },
    { text: 'The mage tower catches the light differently from the other buildings.', house: ['tower'] }] },
  { id: 'major port', test: (n) => inc(n, 'major port'), lines: [
    { text: 'The harbour cranes are visible from the road: tall, necessary, industrial.', house: ['major port'], needs: ['navigable'] },
    { text: 'Half the settlement seems to be about the water.', house: ['major port'], needs: ['navigable'] }] },
  { id: 'palace / royal seat', test: (n) => inc(n, 'palace', 'royal seat'), lines: [
    { text: 'The palace complex sits on the highest point of the settlement and does not look apologetic about it.', house: ['palace', 'royal seat'] },
    { text: 'Flags on the palace towers. Someone is in residence.', house: ['palace', 'royal seat'], excludes: ['crisis: succession'] }] },
  { id: 'university', test: (n) => inc(n, 'university', 'academy of magic'), lines: [
    { text: 'The university buildings take up more of the skyline than you expected.', house: ['university', 'academy of magic'] },
    { text: 'A complex of old stone buildings (the university) anchors the northern quarter.', house: ['university', 'academy of magic'] }] },
];
for (const b of BRANCHES) for (const l of b.lines) {
  const probe = l.text.replace(/'/g, "\\'"); if (!sv.includes(l.text) && !sv.includes(probe)) throw new Error(`landmark line not in checkInstCompat: ${l.text}`);
}
const landmarkBranchOf = (names, tier) => BRANCHES.find((b) => b.test(names, tier)) || null;

// ── THE POOLS (every pool a beat draws from), each line as a (name, tier) => string
const pools = [];
const asFn = (line) => { const x = textOf(line); return typeof x === 'function' ? x : () => String(x); };
const add = (id, beat, lines, hook = false) => pools.push({ id, beat, lines: lines.map((l) => ({ fn: asFn(l), hook, raw: l })) });
for (const [k, v] of Object.entries(ARRIVAL_SCENES)) add(`ARRIVAL_SCENES.${k}`, 'scene', v, true);
for (const [k, v] of Object.entries(STRESS_DESCS)) add(`STRESS_DESCS.${k}`, 'vignette', v, true);
// THE BUILT TREE (ARRIVAL-LINES-2-BUILD): where `src/data/arrivalLandmarkWordings.js` exists, a landmark pool is its branch's
// drawn rows and its new wordings, so a printed new wording is attributed (index >= 2 is a new wording).
let LANDMARK_WORDINGS = null; try { ({ LANDMARK_WORDINGS } = await import(`${L}/src/data/arrivalLandmarkWordings.js`)); } catch { /* the base tree */ }
for (const b of BRANCHES) { const w = LANDMARK_WORDINGS?.find((x) => x.branch === b.id); add(`LANDMARK ${b.id}`, 'landmark', w ? [...w.drawn, ...w.said].map((r) => r.text) : b.lines.map((l) => l.text)); }
for (const [k, p] of Object.entries(CULTURE_PROFILES)) pools.push({ id: `BUILT ${k}`, beat: 'built detail', lines: (p.architecturalDetails || []).map((d) => ({ fn: () => `${sentenceCase(String(textOf(d)).trim())}.` })) });
pools.push({ id: 'BUILT twins', beat: 'built detail', lines: Object.values(CULTURE_LINE_SIBLINGS).flatMap((rows) => rows.filter((r) => r.twinOf).map((r) => ({ fn: () => `${sentenceCase(String(r.text).trim())}.` }))) });
for (const s of ARRIVAL_SENSES) for (const f of ['lines', 'dominant']) if (s[f]?.length) add(`ARRIVAL_SENSES.${s.key}.${f}`, 'senses', s[f]);
for (const [k, v] of Object.entries(ARRIVAL_PEOPLE)) add(`ARRIVAL_PEOPLE.${k}`, 'people', v);
for (const [k, v] of Object.entries(ARRIVAL_TENSIONS)) add(`ARRIVAL_TENSIONS.${k}`, 'tension', v);
for (const [k, v] of Object.entries(ARRIVAL_MEMORIES)) add(`ARRIVAL_MEMORIES.${k}`, 'memory', v);
const BEATS = ['scene', 'vignette', 'landmark', 'built detail', 'senses', 'people', 'tension', 'memory'];

// ── ATTRIBUTION: each paragraph cut into the pool lines it printed (longest non-overlapping matches)
const splitSentences = (p) => String(p || '').split(/(?<=[.?!])\s+(?=[A-Z"'‘“])/).map((s) => s.trim()).filter(Boolean);
const attribute = (pl) => {
  const para = String(pl.arrivalScene || ''); const noun = tierNounFor(pl.tier); const hits = [];
  for (const p of pools) p.lines.forEach((ln, idx) => {
    let text; try { text = ln.fn(pl.name, pl.tier); } catch { return; }
    if (typeof text !== 'string' || text.length < 12) return;
    for (const f of ln.hook ? [speakTierNoun(text, noun), text] : [text]) { const at = para.indexOf(f); if (at >= 0) { hits.push({ pool: p, idx, text: f, at }); break; } }
  });
  hits.sort((a, b) => b.text.length - a.text.length);
  const kept = []; for (const h of hits) if (!kept.some((k) => h.at < k.at + k.text.length && k.at < h.at + h.text.length)) kept.push(h);
  kept.sort((a, b) => a.at - b.at);
  let residue = para; for (const k of kept) residue = residue.replace(k.text, '');
  return { beats: kept, residue: residue.trim() };
};
for (const pl of places) Object.assign(pl, attribute(pl));
const mask = (pl, s) => s.split(pl.name).join('§');
// a place's keys: every sentence it prints, tagged by the beat/pool that printed it
const keysOf = (pl, how, filter = () => true) => pl.beats.filter(filter).flatMap((b) => splitSentences(b.text).map((s) => (how === 'masked' ? mask(pl, s) : s)));

// ── EXACT TRIPLE ODDS: over every triple of distinct items, P(at least two of the three share a key)
const tripleOdds = (items, kf) => {
  const n = items.length; const ks = items.map((x) => new Set(kf(x)));
  const share = Array.from({ length: n }, () => new Uint8Array(n)); let pairs = 0, pairHit = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let s = 0; for (const k of ks[i]) if (ks[j].has(k)) { s = 1; break; } share[i][j] = share[j][i] = s; pairs++; pairHit += s; }
  let hit = 0, tot = 0;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const sij = share[i][j], ri = share[i], rj = share[j]; for (let k = j + 1; k < n; k++) { tot++; if (sij || ri[k] || rj[k]) hit++; } }
  return { triple: hit / tot, pair: pairHit / pairs };
};
const bySize = (size) => places.filter((p) => p.size === size);

// ═════ 1. THE SURFACE, PROVEN
const unattributed = places.filter((p) => p.residue.length > 0);
out(`PLACES: ${places.length} (${SIZES.join(', ')} x ${cache.n}), forged from ${cache.tree}`);
out(`1. THE SURFACE: record field arrivalScene present on ${places.filter((p) => p.arrivalScene).length}/${places.length}; sentences per paragraph mean ${(places.reduce((s, p) => s + splitSentences(p.arrivalScene).length, 0) / places.length).toFixed(2)}`);
out(`   attribution: ${places.reduce((s, p) => s + p.beats.length, 0)} beats matched to a pool line; ${unattributed.length} places keep unattributed residue${unattributed.length ? ': ' + unattributed.slice(0, 4).map((p) => `[${p.seed}] "${p.residue.slice(0, 100)}"`).join(' ; ') : ''}`);
out(`   beats present per size: ` + SIZES.map((s) => `${s} ` + BEATS.map((b) => `${b} ${bySize(s).filter((p) => p.beats.some((x) => x.pool.beat === b)).length}`).join('/')).join(' | '));

// ═════ 2. THE BAR, BEFORE: per size, overall and by beat
const report = (label, getKeys) => {
  out(`\n2${label}. THREE PLACES OF ONE SIZE, AT LEAST TWO SHARE A SENTENCE (exact over C(${cache.n},3)); bar 10%`);
  out(`   size       | ${['STRICT', 'MASKED'].map((h) => h.padEnd(7)).join(' | ')} | MASKED by beat (each beat's sentences alone): ${BEATS.join(' / ')}`);
  const rows = {};
  for (const size of SIZES) {
    const g = bySize(size);
    const strict = tripleOdds(g, (p) => getKeys(p, 'strict')); const masked = tripleOdds(g, (p) => getKeys(p, 'masked'));
    const beatOdds = BEATS.map((b) => tripleOdds(g, (p) => getKeys(p, 'masked', (x) => x.pool.beat === b)).triple);
    rows[size] = { strict: strict.triple, masked: masked.triple, beatOdds };
    out(`   ${size.padEnd(10)} | ${pct(strict.triple).padEnd(7)} | ${pct(masked.triple).padEnd(7)} | ${beatOdds.map(pct).join(' / ')}`);
  }
  return rows;
};
const before = report('', keysOf);

// ═════ 3. BY POOL: each pool's own triple odds per size (masked), its drawers, lines held, commonest line's share
out(`\n3. BY POOL (masked): pool | beat | lines | per size: drawers/${cache.n}, pool-alone triple odds, top line's share of its drawers`);
const poolRows = [];
for (const p of pools) {
  const cells = SIZES.map((size) => {
    const g = bySize(size); const draws = g.flatMap((pl) => pl.beats.filter((b) => b.pool === p).map((b) => b.idx));
    if (!draws.length) return null;
    const tally = new Map(); for (const d of draws) tally.set(d, (tally.get(d) || 0) + 1);
    const odds = tripleOdds(g, (pl) => keysOf(pl, 'masked', (x) => x.pool === p)).triple;
    return { size, d: draws.length, odds, top: Math.max(...tally.values()) / draws.length };
  });
  if (cells.every((c) => !c)) continue;
  poolRows.push({ p, cells, worst: Math.max(...cells.filter(Boolean).map((c) => c.odds)) });
}
poolRows.sort((a, b) => b.worst - a.worst);
for (const r of poolRows) if (r.worst >= 0.005) out(`   ${r.p.id.padEnd(40)} | ${r.p.beat.padEnd(12)} | ${String(r.p.lines.length).padStart(2)} | ` + r.cells.map((c, i) => c ? `${SIZES[i].slice(0, 4)} ${String(c.d).padStart(3)} ${pct(c.odds).padStart(5)} ${(100 * c.top).toFixed(0)}%` : `${SIZES[i].slice(0, 4)}   -`).join(' · '));
out(`   (${poolRows.filter((r) => r.worst < 0.005).length} pools under 0.5% in every size not printed)`);

// ═════ 4. THE SENTENCES THAT CARRY IT: per size, the commonest sentences (masked) and the places printing each
out('\n4. THE SENTENCES THAT CARRY IT (masked; per size, the ten commonest: places printing it of the size, its pool)');
for (const size of SIZES) {
  const g = bySize(size); const m = new Map();
  for (const pl of g) for (const b of pl.beats) for (const s of new Set(splitSentences(b.text).map((x) => mask(pl, x)))) { const e = m.get(s) || { c: 0, pool: b.pool.id }; e.c++; m.set(s, e); }
  out(`   ${size}:`);
  [...m].sort((a, b) => b[1].c - a[1].c).slice(0, 10).forEach(([s, e]) => out(`     ${String(e.c).padStart(3)}  ${e.pool.padEnd(34)} ${s.slice(0, 110)}`));
}

// ═════ 5. THE LANDMARK BEAT AS FOUND
out('\n5. THE LANDMARK BEAT (checkInstCompat): branch the native names select (first match), places, printed (else yielded: under a stress vignette, or the line names a market/catch the place lacks)');
for (const size of SIZES) {
  const g = bySize(size); const cells = BRANCHES.map((b) => {
    const sel = g.filter((pl) => landmarkBranchOf(pl.names, pl.tier) === b);
    const printed = sel.filter((pl) => pl.beats.some((x) => x.pool.id === `LANDMARK ${b.id}`));
    return sel.length ? `${b.id} ${printed.length}/${sel.length}` : null;
  }).filter(Boolean);
  out(`   ${size.padEnd(10)} ${cells.join(' · ') || '-'}`);
}
// a landmark line whose house is NOT among the native names (the found mechanism's own gap; reported, not cured here)
const houseless = [];
for (const pl of places) for (const b of pl.beats.filter((x) => x.pool.beat === 'landmark')) {
  const br = BRANCHES.find((x) => `LANDMARK ${x.id}` === b.pool.id); const line = br.lines[b.idx]; if (!line) continue; // a new wording: the build's own test holds its house
  const houseOk = line.house.some((h) => pl.names.some((n) => n.includes(h)));
  const needsOk = (line.needs || []).every((a) => pl.held[a] === true) && (line.excludes || []).every((a) => pl.held[a] === false);
  if (!houseOk || !needsOk) houseless.push(`${pl.seed} [${b.pool.id} #${b.idx}${houseOk ? '' : ' house absent'}${needsOk ? '' : ' declaration refused'}]`);
}
{ const t = new Map(); for (const h of houseless) { const k = h.replace(/^\S+ /, ''); t.set(k, (t.get(k) || 0) + 1); } out('   by line: ' + [...t].map(([k, c]) => `${c} ${k}`).join(', ')); }
out(`   landmark lines printed where their own house or declaration does not hold: ${houseless.length}${houseless.length ? ': ' + houseless.slice(0, 6).join(', ') : ''}`);
// native names that carry each branch's house, as seen
const houseNames = new Map();
for (const pl of places) { const br = landmarkBranchOf(pl.names, pl.tier); if (!br) continue; for (const l of br.lines) for (const h of l.house) for (const n of pl.names) if (n.includes(h)) houseNames.set(`${br.id} :: ${h}`, new Set([...(houseNames.get(`${br.id} :: ${h}`) || []), n])); }
for (const [k, v] of houseNames) out(`   ${k} <- ${[...v].join(' | ')}`);

// ═════ 8. UNDER SIEGE: places printing a landmark row that excludes `crisis: under_siege` while the record holds it
{
  const rowsOf = (id) => { const w = LANDMARK_WORDINGS?.find((x) => `LANDMARK ${x.branch}` === id); if (w) return [...w.drawn, ...w.said]; const br = BRANCHES.find((x) => `LANDMARK ${x.id}` === id); return br ? br.lines : []; };
  const hits = [];
  for (const pl of places) for (const b of pl.beats.filter((x) => x.pool.beat === 'landmark')) {
    const r = rowsOf(b.pool.id).find((x) => x.text === b.text);
    if (r && (r.excludes || []).includes('crisis: under_siege') && pl.held['crisis: under_siege'] === true) hits.push(`${pl.seed} "${r.text}"`);
  }
  out(`\n8. UNDER SIEGE: ${hits.length} of ${places.length} places print a landmark line that excludes the siege, under siege${hits.length ? ': ' + hits.join(', ') : ''}; places under siege at all: ${places.filter((p) => p.held['crisis: under_siege'] === true).length}`);
}
let priceFrom = null;
// ═════ 7. THE PRICE: how many lines each pool would need. A pool of n lines drawn by D places of N, its lines printed c_1..c_n
// times, gives a pair of places the same line with p = Σ c(c-1) / N(N-1). Appending k lines (or, for a LANDMARK branch, k keyed
// wordings said where its house stands) spreads the draw: each old count scales by n/(n+k) and each new line takes D/(n+k).
// The pair odds of a size are 1 - Π(1 - p_pool); the triple odds follow by the size's own measured ratio (exact triple over
// 1-(1-pair)^3, from section 2), so the model starts on the measured figure. (a) PER POOL: the k that brings the pool's own
// triple odds under the bar. (b) THE WHOLE BAR: lines added one at a time where they cut the worst size most, until every size
// is under it. Single-sentence model: a multi-sentence line counts once; two lines that share a sentence are not modelled.
{
  const BAR = 0.10;
  const stats = {}; // size -> [{ id, n, counts }]
  for (const size of SIZES) {
    const g = bySize(size); const N = g.length; stats[size] = [];
    for (const p of pools) {
      const counts = new Map(); for (const pl of g) for (const b of pl.beats) if (b.pool === p) counts.set(b.idx, (counts.get(b.idx) || 0) + 1);
      if (counts.size) stats[size].push({ id: p.id, beat: p.beat, n: p.beat === 'landmark' ? 2 : p.lines.length, counts: [...counts.values()], N }); // a landmark branch: checkInstCompat's two lines (its wordings are what the price adds)
    }
  }
  const pairOf = (r, k) => { const D = r.counts.reduce((a, b) => a + b, 0); const sc = r.n / (r.n + k); let s = 0; for (const c of r.counts) { const x = c * sc; s += x * (x - 1); } if (k) { const y = D / (r.n + k); s += k * y * Math.max(0, y - 1); } return Math.max(0, s) / (r.N * (r.N - 1)); };
  const tri = (pair) => 1 - (1 - pair) ** 3;
  const ratio = {}; for (const size of SIZES) { const pr = 1 - stats[size].reduce((a, r) => a * (1 - pairOf(r, 0)), 1); ratio[size] = before[size].masked / tri(pr); }
  out(`\n7. THE PRICE (model; masked; bar ${pct(BAR)}). model before per size: ` + SIZES.map((s) => { const pr = 1 - stats[s].reduce((a, r) => a * (1 - pairOf(r, 0)), 1); return `${s} ${pct(tri(pr) * ratio[s])}`; }).join(', '));
  out('   (a) pools over the bar ALONE (worst size) and the lines each needs to come under it:');
  const ids = [...new Set(SIZES.flatMap((s) => stats[s].map((r) => r.id)))];
  for (const id of ids) {
    const rows = SIZES.map((s) => stats[s].find((r) => r.id === id)).filter(Boolean);
    const worst = (k) => Math.max(...rows.map((r) => tri(pairOf(r, k))));
    if (worst(0) < BAR) continue;
    let k = 0; while (worst(k) >= BAR && k < 400) k++;
    let k7 = 0; while (worst(k7) >= 0.07 && k7 < 400) k7++;
    out(`     ${id.padEnd(36)} worst ${pct(worst(0))} -> under 10% at +${k}, under 7% at +${k7}`);
  }
  priceFrom = (label, preset = new Map()) => {
    const added = new Map(ids.map((id) => [id, preset.get(id) || 0]));
    const sizeOdds = (s) => tri(1 - stats[s].reduce((a, r) => a * (1 - pairOf(r, added.get(r.id))), 1)) * ratio[s];
    out(`   ${label}: model per size with ${[...preset.values()].reduce((a, b) => a + b, 0)} lines preset: ` + SIZES.map((s) => `${s} ${pct(sizeOdds(s))}`).join(', '));
    let total = 0;
    while (SIZES.some((s) => sizeOdds(s) >= BAR) && total < 3000) {
      const worstSize = SIZES.reduce((a, s) => (sizeOdds(s) > sizeOdds(a) ? s : a), SIZES[0]);
      let best = null, bestGain = -1;
      for (const r of stats[worstSize]) { if (preset.has(r.id)) continue; const was = sizeOdds(worstSize); added.set(r.id, added.get(r.id) + 1); const gain = was - sizeOdds(worstSize); added.set(r.id, added.get(r.id) - 1); if (gain > bestGain) { bestGain = gain; best = r.id; } }
      added.set(best, added.get(best) + 1); total++;
    }
    out(`       every size under 10% needs about ${total} more lines: ` + [...added].filter(([id, k]) => k > (preset.get(id) || 0)).sort((a, b) => b[1] - a[1]).map(([id, k]) => `${id} +${k - (preset.get(id) || 0)}`).join(', '));
    out('       per size at that price: ' + SIZES.map((s) => `${s} ${pct(sizeOdds(s))}`).join(', '));
  };
  priceFrom('(b) THE WHOLE BAR, from the base');
}

if (!LINES) process.exit(0);

// ═════════════════════════════════════════ 6. PROJECTION (the drafted lines, wired) ═════════════════════════════════════════
// Parsed from the lines file: under `## <POOL ID> (...)` each `**NEW [j]: text**  _(declaration)_`. `{name}` is the name.
// MECHANISMS PROJECTED: (a) a pickRandom pool appended to: the place's one draw r lands at floor(r*(n+k)); r is unknown, so it is
// placed uniformly inside the old line's slot [i/n,(i+1)/n) by a hash of the seed (a projection, stated as one); a landing line
// refused by its declaration takes the twin rule / the redraw-once among admitted lines (by hash). (b) a LANDMARK house: the
// drawn line (pickRandom unchanged) is said in one of [drawn, ...the new wordings of the house that stands, admitted] by
// pickVariantMixed keyed `${seed}::landmark` (the real key is the arrival substream's seed; any per-place key projects alike).
const md = readFileSync(LINES, 'utf8');
const drafted = new Map(); let cur = null;
for (const raw of md.split('\n')) {
  const h = /^## (\S+(?: [^(]+?)?)\s*\(/.exec(raw); if (h) { cur = h[1].trim(); continue; }
  const m = /\*\*NEW \[\d+\]: (.+?)\*\*(?:\s+_\((.*?)\)_)?(?:\s+\[[^\]]*\])?\s*$/.exec(raw.trim().replace(/^\d+\.\s+/, '')); // a [CURED ...] note may follow; a ~~STRUCK~~ line is not read
  if (!m || !cur) continue;
  const decl = { needs: [], excludes: [], crisis: [], twinOf: null, house: null };
  for (const part of (m[2] || '').split(/;\s*(?=[a-zA-Z]+:)/)) {
    const kv = /^(needs|excludes|crisis|twinOf|house):\s*(.+)$/.exec(part.trim()); if (!kv) continue;
    decl[kv[1]] = JSON.parse(kv[2]);
  }
  if (!drafted.has(cur)) drafted.set(cur, []);
  drafted.get(cur).push({ text: m[1], ...decl });
}
const heldOK = (pl, d, scoped) => {
  if (!d) return true;
  for (const a of d.needs || []) if (pl.held[a] !== true) return false;
  for (const a of d.excludes || []) if (pl.held[a] !== false) return false;
  const cr = (d.crisis || []).length ? d.crisis : scoped ? ['calm'] : [];
  if (cr.length && !cr.includes('any')) { const active = pl.held['crisis: any'] === true; if (!active) return cr.includes('calm'); return cr.some((c) => c !== 'calm' && pl.held[`crisis: ${c}`] === true); }
  return true;
};
const u01 = (key) => mix32(fnv1a32(key)) / 2 ** 32;
let nDrafted = 0; for (const v of drafted.values()) nDrafted += v.length;
out(`\n6. PROJECTION with ${nDrafted} drafted lines in ${drafted.size} pools: ${[...drafted].map(([k, v]) => `${k} +${v.length}`).join(', ')}`);
const project = (salt) => places.map((pl) => {
  const beats = pl.beats.map((b) => {
    const add = drafted.get(b.pool.id);
    if (b.pool.beat === 'landmark') {
      const br = BRANCHES.find((x) => `LANDMARK ${x.id}` === b.pool.id); const line = br.lines[b.idx];
      const extra = (drafted.get(`LANDMARK ${br.id}`) || []).filter((d) => (d.house || []).some((h) => pl.names.some((n) => n.includes(h))) && heldOK(pl, d, false));
      // the drawn line's own house answers first: a wording of another house of the branch is said only where that house stands
      // the chair's wiring (20:02): the drawn line passes the door's filter too; nothing admitted -> the built detail speaks
      // (projected as no landmark sentence: the built detail it would print is not in the cache)
      const family = [...(line && heldOK(pl, line, false) ? [b.text] : []), ...extra.map((d) => d.text.split('{name}').join(pl.name))];
      if (!family.length) return null;
      return { pool: b.pool, text: family[pickMixed(family.length, `${pl.seed}${salt}::landmark`)] };
    }
    if (!add) return b;
    const scoped = b.pool.id === 'ARRIVAL_SCENES.market' || b.pool.id === 'ARRIVAL_SCENES.ordinary';
    const base = b.pool.lines.map((ln) => ({ raw: ln.raw, text: null }));
    const n = base.length; const all = [...base.map((x) => ({ decl: x.raw && typeof x.raw === 'object' ? declarationOf(x.raw) : null, twinOf: x.raw?.twinOf ?? null, base: true })), ...add.map((d) => ({ decl: d, twinOf: d.twinOf, text: d.text }))];
    const r = (b.idx + u01(`${pl.seed}::${b.pool.id}`)) / n; const j = Math.floor(r * all.length);
    if (j < n) return b.idx === j ? b : { pool: b.pool, text: (() => { const ln = b.pool.lines[j]; if (!heldOK(pl, all[j].decl, scoped) || all[j].twinOf) return b.text; return b.pool.hook ? speakTierNoun(ln.fn(pl.name, pl.tier), tierNounFor(pl.tier)) : ln.fn(pl.name, pl.tier); })() };
    const d = all[j];
    let chosen = d;
    if (d.twinOf || !heldOK(pl, d, scoped)) {
      const twins = add.filter((x) => x.twinOf && x.twinOf === d.text && heldOK(pl, x, scoped));
      if (d.twinOf) return b; // a twin never enters the draw (drawDeclared's domain): the slot keeps the old line in this projection
      chosen = twins.pop() || null;
      if (!chosen) return b; // refused, no twin: projected as the old line (the redraw-once lands among admitted lines)
    }
    let text = chosen.text.split('{name}').join(pl.name);
    if (b.pool.lines[0]?.hook) text = speakTierNoun(text, tierNounFor(pl.tier));
    return { pool: b.pool, text };
  }).filter(Boolean);
  return { ...pl, beats };
});
const projected = project('');
const pBySize = (size) => projected.filter((p) => p.size === size);
out(`   size       | STRICT before -> after | MASKED before -> after | MASKED by beat after: ${BEATS.join(' / ')}`);
for (const size of SIZES) {
  const g = pBySize(size);
  const s = tripleOdds(g, (p) => keysOf(p, 'strict')).triple; const m = tripleOdds(g, (p) => keysOf(p, 'masked')).triple;
  const beatOdds = BEATS.map((b) => tripleOdds(g, (p) => keysOf(p, 'masked', (x) => x.pool.beat === b)).triple);
  out(`   ${size.padEnd(10)} | ${pct(before[size].strict).padStart(6)} -> ${pct(s).padStart(6)}       | ${pct(before[size].masked).padStart(6)} -> ${pct(m).padStart(6)}       | ${beatOdds.map(pct).join(' / ')}`);
}
// the drafted pools alone, after; and the landmark beat's spread over 20 other keys (the real key is the arrival substream's seed)
out('   drafted pools alone after (masked, worst size): ' + [...drafted.keys()].map((id) => { const w = Math.max(...SIZES.map((s) => tripleOdds(pBySize(s), (p) => keysOf(p, 'masked', (x) => x.pool.id === id)).triple)); return `${id} ${pct(w)}`; }).join(', '));
const salts = Array.from({ length: 20 }, (_, i) => `#${i}`); const spread = Object.fromEntries(SIZES.map((s) => [s, []])); const whole = Object.fromEntries(SIZES.map((s) => [s, []]));
for (const salt of salts) { const pr = project(salt); for (const s of SIZES) { const g = pr.filter((p) => p.size === s); spread[s].push(tripleOdds(g, (p) => keysOf(p, 'masked', (x) => x.pool.beat === 'landmark')).triple); whole[s].push(tripleOdds(g, (p) => keysOf(p, 'masked')).triple); } }
const mmm = (a) => `${pct(a.reduce((x, y) => x + y, 0) / a.length)} [${pct(Math.min(...a))}-${pct(Math.max(...a))}]`;
out('   over 20 other keys, mean [min-max]: landmark beat ' + SIZES.filter((s) => spread[s].some((x) => x > 0)).map((s) => `${s} ${mmm(spread[s])}`).join(', '));
out('                                       whole paragraph ' + SIZES.map((s) => `${s} ${mmm(whole[s])}`).join(', '));
// what the whole bar would still need with the drafted lines in (the drafted pools held at their drafted counts)
priceFrom('7(c) THE WHOLE BAR, after the drafted lines', new Map([...drafted].map(([k, v]) => [k, v.length])));
