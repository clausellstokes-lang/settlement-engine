/**
 * harness/laneREG4/densification.mjs — ⭐⭐ THE DENSIFICATION DIFFERENTIAL, A2.2's EXACT SCOPING:
 *
 *   "SUB-THRESHOLD population growth with circuit standing ⇒ intramural infill up AND
 *    intramural-extension-through-wall = 0; sprawl DEFINED as untyped extramural growth; typed
 *    faubourgs lawful, counted separately, with a positive control at a tier crossing."
 *
 * ⭐⭐ BAND-AGNOSTIC BY CONSTRUCTION (chair's mid-flight instruction, this lane's J-REG4-8).
 * The sandbox's `tierForPopulation` steps at values that a seam-cure car will reconcile to the
 * landed `popToTier`'s. **Not one boundary population is written down here.** Every rung is
 * PROBED out of the classifier at runtime by bisection, so the differential re-runs unchanged
 * after the reconciliation and asserts nothing about which population is which tier.
 *
 * THE FOUR MEASURED QUANTITIES, each a predicate over the DRAWN URBAN GROWTH bodies (parcels +
 * back-houses + LOD masses + shanty huts + faubourg buildings + lean-tos — the countryside
 * steadings and the landmark solids are NOT urban growth and are excluded by name):
 *   intramuralInfill  centroid inside some circuit ring
 *   throughWall       vertices strictly inside AND strictly outside one ring — an extension
 *                     THROUGH the wall, which a standing circuit forbids
 *   typedFaubourg     extramural AND carrying a REG-4 typed origin — lawful, counted apart
 *   sprawl            extramural and UNTYPED — the thing that must be zero
 *
 * Usage: node harness/laneREG4/densification.mjs [--leaf=town] [--rungs=4] [--break]
 *        `--break` runs the CONVICTING MUTATION: the differential's own input is broken
 *        (population held constant across the ladder) and the monotone arm must FAIL.
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { CORPUS } = await import(join(ROOT, 'harness/exemplars.mjs'));
const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { buildTownMapModel } = await import(join(ROOT, 'src/domain/townMap/townMapModel.js'));
const { buildFabric } = await import(join(ROOT, 'src/domain/townMap/fabric/buildFabric.js'));
const { tierForPopulation } = await import(join(ROOT, 'src/domain/townMap/fabric/tierGrammar.js'));
const { pointInPolygon, centroid, offsetPolygonOutward } = await import(join(ROOT, 'src/domain/townMap/fabric/fabricGeometry.js'));
const { pointIn } = await import(join(ROOT, 'src/domain/townMap/fabric/epochAxis.js'));

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const leafKey = arg('leaf', 'town');
const RUNGS = Number(arg('rungs', '4'));
const BREAK = process.argv.includes('break') || process.argv.includes('--break');
const spec = CORPUS.find((c) => c.key === leafKey);

/* ── THE CLASSIFIER, PROBED — never a literal ──────────────────────────────── */
/** The largest population still classified as `tier`, found by bisection on the classifier. */
function bandTop(tier, lo, hi) {
  if (tierForPopulation(lo) !== tier) return null;
  let a = lo, b = hi;
  for (let i = 0; i < 40; i++) {
    const m = Math.floor((a + b) / 2);
    if (m === a) break;
    if (tierForPopulation(m) === tier) a = m; else b = m;
  }
  return a;
}
/** The smallest population still classified as `tier`. */
function bandFloor(tier, lo, hi) {
  if (tierForPopulation(hi) !== tier) return null;
  let a = lo, b = hi;
  for (let i = 0; i < 40; i++) {
    const m = Math.floor((a + b) / 2);
    if (m === b) break;
    if (tierForPopulation(m) === tier) b = m; else a = m;
  }
  return b;
}

/* ── THE SUBJECT ───────────────────────────────────────────────────────────── */
/** THE DRAWN URBAN GROWTH SET. Countryside steadings and landmark solids are NOT growth. */
function urbanGrowth(f) {
  /** @type {Array<any>} */ const out = [];
  const merged = (f.lod && f.lod.mergedKeys) || new Set();
  const has = (m, k) => (m instanceof Set ? m.has(k) : !!(m && m[k]));
  for (const p of f.parcels) {
    if (has(merged, p.key)) continue;
    if (p.polygon && p.polygon.length >= 3) out.push({ key: p.key, kind: 'parcel', poly: p.polygon });
    if (p.backHouse && p.backHouse.length >= 3) out.push({ key: `${p.key}#back`, kind: 'backHouse', poly: p.backHouse });
  }
  for (const m of ((f.lod && f.lod.masses) || [])) if (m.polygon && m.polygon.length >= 3) out.push({ key: m.key, kind: 'mass', poly: m.polygon, count: m.count });
  for (const h of ((f.shanty && f.shanty.huts) || [])) if (h.polygon && h.polygon.length >= 3) out.push({ key: h.key, kind: 'hut', poly: h.polygon });
  for (const b of ((f.faubourgs && f.faubourgs.buildings) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'faubourg', poly: b.polygon });
  for (const b of ((f.faubourgs && f.faubourgs.leanTos) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, kind: 'leanTo', poly: b.polygon });
  return out;
}

/**
 * ⛔⛔ THE PREDICATE IS `i10`'s CENSUS B, LIFTED — AND THE FIRST SPELLING WAS THE WRONG
 * INSTRUMENT THREE TIMES OVER. It asked `pointInPolygon(centroid, wall.polygon)`, and:
 *   1. THE TOWN'S RING IS A **HALF RING** (`rings[0].halfRing === true`, with its own
 *      `closedPolygon`) because the river is the fourth wall — so "inside the polygon" is not a
 *      question that polygon can answer, and every riverside body read as outside.
 *   2. IT CONVICTED WALL-ABUTTING HOUSES OF EXTENDING **THROUGH** the wall, because a body
 *      against the inner face straddles the CENTRELINE. §575's tangential regime makes that
 *      lawful; the honest test is the BAND's two faces.
 *   3. IT COUNTED THE LAWFUL **SUBURB** AS SPRAWL. §241.6's own law: a body in no walled epoch's
 *      body is the suburb, "lawfully outside every circuit — counted and reported separately".
 * The cures are all three the sealed suite's own: EPOCH membership, the "own circuit OR ANY
 * LATER ONE" clause with the closed-ring rescue, and the band faces.
 *
 * ⭐ AND THE COUNT IS **LOD-CORRECTED**. A `lod.mass` is many holdings drawn as one body and
 * carries its own `count`; without the correction the infill total FALLS as a town densifies,
 * because merging is what densification looks like to a body counter. MEASURED: 1265 → 1223 →
 * 1300 → 1849 uncorrected, which read as a failure of a law that was working.
 */
function measure(fabric) {
  const node = fabric.wallCircuit;
  const walled = (node.epochs || []).filter((e) => e.walled && e.body);
  const rings = node.rings || [];
  const typedB = (fabric.marketRegister && fabric.marketRegister.origins && fabric.marketRegister.origins.buildings) || {};
  const typedR = (fabric.marketRegister && fabric.marketRegister.origins && fabric.marketRegister.origins.districts) || [];
  const typedGrounds = typedR.filter((d) => d.region && d.ground && d.ground.length >= 3);
  // the band's two faces, per ring
  const faces = rings.map((r) => {
    const band = Number.isFinite(r.band) ? r.band : 0;
    const poly = r.halfRing && r.closedPolygon ? r.closedPolygon : r.polygon;
    if (!poly || poly.length < 3 || !(band > 0)) return null;
    return { inner: offsetPolygonOutward(poly, -band * 0.5), outer: offsetPolygonOutward(poly, band * 0.5) };
  }).filter(Boolean);

  let holdings = 0, through = 0, typedF = 0, sprawl = 0, suburb = 0, notHeld = 0, members = 0;
  const bodies = urbanGrowth(fabric);
  for (const b of bodies) {
    const c = centroid(b.poly);
    const weight = b.kind === 'mass' && Number.isFinite(b.count) ? b.count : 1;
    // THROUGH-WALL: vertices strictly inside the band's INNER face AND strictly outside its OUTER
    for (const f of faces) {
      let anyIn = false, anyOut = false;
      for (const p of b.poly) {
        if (pointInPolygon(p[0], p[1], f.inner)) anyIn = true;
        else if (!pointInPolygon(p[0], p[1], f.outer)) anyOut = true;
        if (anyIn && anyOut) break;
      }
      if (anyIn && anyOut) { through += weight; break; }
    }
    let idx = -1;
    for (const e of walled) if (pointIn(e.body, c[0], c[1])) { idx = e.index; break; }
    if (idx < 0) {
      suburb += weight;
      const lawful = typedB[b.key] || b.kind === 'leanTo'
        || typedGrounds.some((d) => pointInPolygon(c[0], c[1], d.ground));
      if (lawful) typedF += weight; else sprawl += weight;
      continue;
    }
    members += weight;
    const held = rings.some((r) => r.epoch >= idx
      && (pointIn(r.polygon, c[0], c[1]) || (r.halfRing && r.closedPolygon && pointIn(r.closedPolygon, c[0], c[1]))));
    if (held) holdings += weight; else notHeld += weight;
  }
  return { bodies: bodies.length, holdings, through, suburb, typedF, sprawl, notHeld, members, rings: rings.length };
}

function buildAt(population, tier) {
  const cfg = { settType: spec.settType };
  if (spec.terrain) cfg.terrainOverride = spec.terrain;
  const s = generateSettlementPipeline(cfg, null, { seed: spec.seed });
  s.population = population;
  // ⭐ THE TIER COMES FROM THE SAME CLASSIFIER CALL THE FABRIC USES — one truth inside this
  // instrument (the chair's instruction 3). Leaving the pipeline's stored tier in place would
  // trip the §161f DEMOTION path and measure a different settlement entirely.
  s.tier = tier;
  const model = buildTownMapModel(s, null);
  return buildFabric(s, model, { marketRegister: true });
}

/* ── THE LADDER ────────────────────────────────────────────────────────────── */
const seedFabric = (() => {
  const cfg = { settType: spec.settType };
  if (spec.terrain) cfg.terrainOverride = spec.terrain;
  const s = generateSettlementPipeline(cfg, null, { seed: spec.seed });
  return { pop: s.population, tier: tierForPopulation(s.population) };
})();
const TIER = seedFabric.tier;
// ⚠ THE BRACKET MUST START INSIDE THE BAND. The first spelling bisected from 1, where the
// classifier answers 'thorp', so both probes returned null and the ladder collapsed onto
// population 0 — a differential that measured the same settlement four times and reported it as
// a failure. The seed's own population is the one value guaranteed to be inside its own band.
const top = bandTop(TIER, seedFabric.pop, 400000);
const floorPop = bandFloor(TIER, 1, seedFabric.pop);
const nextTier = tierForPopulation(top + 1);
process.stdout.write(`LEAF ${leafKey} · seed population ${seedFabric.pop} · classifier says tier '${TIER}'\n`);
process.stdout.write(`BAND PROBED FROM THE CLASSIFIER (no literal anywhere): [${floorPop} … ${top}], next tier '${nextTier}' at ${top + 1}\n\n`);

const rows = [];
for (let i = 0; i < RUNGS; i++) {
  // rungs strictly inside the band, evenly spaced on the band's own span
  const frac = (i + 1) / (RUNGS + 1);
  const pop = BREAK ? Math.round(floorPop + (top - floorPop) * 0.5)      // ⛔ THE BROKEN INPUT
    : Math.round(floorPop + (top - floorPop) * frac);
  const f = buildAt(pop, TIER);
  const m = measure(f);
  rows.push({ rung: `sub-${i + 1}`, pop, tier: f.meta.tier, rings: m.rings, bodies: m.bodies, intramuralInfill: m.holdings, notHeld: m.notHeld, throughWall: m.through, suburb: m.suburb, typedFaubourg: m.typedF, SPRAWL: m.sprawl });
}
// ⭐ THE POSITIVE CONTROL AT THE TIER CROSSING — the population is the classifier's own first
//   value of the NEXT tier, taken from the probe rather than typed in.
{
  const pop = top + 1;
  const f = buildAt(pop, nextTier);
  const m = measure(f);
  rows.push({ rung: 'CROSSING', pop, tier: f.meta.tier, rings: m.rings, bodies: m.bodies, intramuralInfill: m.holdings, notHeld: m.notHeld, throughWall: m.through, suburb: m.suburb, typedFaubourg: m.typedF, SPRAWL: m.sprawl });
}

const cols = Object.keys(rows[0]);
const w = {}; for (const c of cols) w[c] = Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length));
const line = (v) => cols.map((c, i) => String(v[i] ?? '').padEnd(w[c])).join(' | ');
process.stdout.write(`${line(cols)}\n${cols.map((c) => '-'.repeat(w[c])).join('-+-')}\n`);
for (const r of rows) process.stdout.write(`${line(cols.map((c) => r[c]))}\n`);

const sub = rows.filter((r) => r.rung.startsWith('sub-'));
const cross = rows[rows.length - 1];
let mono = true;
for (let i = 1; i < sub.length; i++) if (sub[i].intramuralInfill <= sub[i - 1].intramuralInfill) mono = false;
const standing = sub.every((r) => r.rings > 0);
const noThrough = sub.every((r) => r.throughWall === 0);
const noSprawl = sub.every((r) => r.SPRAWL === 0);
const crossGrew = cross.typedFaubourg > sub[sub.length - 1].typedFaubourg || cross.suburb > sub[sub.length - 1].suburb;

process.stdout.write('\n── THE DIFFERENTIAL, ARM BY ARM ──\n');
process.stdout.write(`  circuit standing at every sub-threshold rung        : ${standing ? 'YES' : '⛔ NO'}\n`);
process.stdout.write(`  intramural infill RISES with population            : ${mono ? 'YES' : '⛔ NO'}\n`);
process.stdout.write(`  intramural-extension-THROUGH-WALL = 0              : ${noThrough ? 'YES' : '⛔ NO'}\n`);
process.stdout.write(`  SPRAWL (untyped extramural growth) = 0             : ${noSprawl ? 'YES' : '⛔ NO'}\n`);
process.stdout.write(`  POSITIVE CONTROL — crossing the tier makes lawful\n`);
process.stdout.write(`  extramural growth APPEAR                           : ${crossGrew ? 'YES' : '⛔ NO'}`
  + ` (typed faubourg ${sub[sub.length - 1].typedFaubourg} → ${cross.typedFaubourg}, suburb ${sub[sub.length - 1].suburb} → ${cross.suburb})\n`);
process.stdout.write(`\nVERDICT: ${standing && mono && noThrough && noSprawl && crossGrew ? 'DIFFERENTIAL PASSES' : '⛔ DIFFERENTIAL FAILS'}`
  + `${BREAK ? '  ⛔ (--break applied: the input is broken, a FAIL here is the control working)' : ''}\n`);

/* ══════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ ARM 2 · THE SNAPSHOT LADDER — THE ONLY AXIS ON WHICH THE CIRCUIT ACTUALLY STANDS.
 *
 * ⛔ THE FINDING ARM 1 PRODUCED, AND IT IS AN ARCHITECTURAL ONE: **varying the population does
 * not hold the circuit still.** The wall's extent is re-derived from the built umbrella at every
 * population, and MEASURED over a sub-threshold ladder its enclosed area runs
 *     365,177 → 300,203 → 349,182 → 222,457 view units²
 * — non-monotone, and a third smaller at the top of the band than at the bottom. A2.2's premise
 * ("with circuit standing") is therefore UNMET by a population sweep, and a monotone body count
 * measured across four different circuits is not a differential; it is four settlements.
 *
 * ⭐ THE FABRIC'S OWN MODEL OF "the town grows while the wall stands" IS THE **SNAPSHOT**:
 * `settlementAtYear` re-dates the history, and the caller stamps `wallBuiltAtAge` /`presentAge`
 * from the PRESENT-DAY record so the circuit's vintage is a fixed year rather than a fraction of
 * "now". The corpus already carries the ladder as three leaves of ONE site:
 *     year-018   the circuit was raised in year 49 — NO WALL yet
 *     year-100   the wall stands, the market place is still open
 *     town       the present, year 191 — the market's middle rows hardened in year 128
 * Same seed, same terrain, same population; only the accumulated history differs. That is
 * densification under a standing circuit, and it is measured rather than synthesised.
 * ══════════════════════════════════════════════════════════════════════════════ */
{
  const { buildOne } = await import(join(ROOT, 'harness/exemplars.mjs'));
  process.stdout.write('\n\n── ARM 2 · THE SNAPSHOT LADDER (one site, one population, the circuit standing) ──\n');
  const ladder = ['year-018', 'year-100', 'town'];
  const srows = [];
  for (const k of ladder) {
    const sp = CORPUS.find((c) => c.key === k);
    const f = buildOne(sp, { marketRegister: true }).fabric;
    const m = measure(f);
    srows.push({ leaf: k, year: sp.year ?? 'present', pop: f.meta.population, rings: m.rings,
      intramuralInfill: m.holdings, notHeld: m.notHeld, throughWall: m.through,
      suburb: m.suburb, typedFaubourg: m.typedF, SPRAWL: m.sprawl,
      infillFossils: f.marketRegister.fossils.length });
  }
  const sc = Object.keys(srows[0]);
  const sw = {}; for (const c of sc) sw[c] = Math.max(c.length, ...srows.map((r) => String(r[c] ?? '').length));
  const sl = (v) => sc.map((c, i) => String(v[i] ?? '').padEnd(sw[c])).join(' | ');
  process.stdout.write(`${sl(sc)}\n${sc.map((c) => '-'.repeat(sw[c])).join('-+-')}\n`);
  for (const r of srows) process.stdout.write(`${sl(sc.map((c) => r[c]))}\n`);
  const walled = srows.filter((r) => r.rings > 0);
  const rose = walled.length >= 2 && walled[walled.length - 1].intramuralInfill > walled[0].intramuralInfill;
  const noThrough2 = walled.every((r) => r.throughWall === 0);
  const noOutside = walled.every((r) => r.notHeld === 0);
  process.stdout.write('\n  intramural infill RISES while the circuit stands   : '
    + `${rose ? 'YES' : '⛔ NO'} (${walled.map((r) => r.intramuralInfill).join(' → ')})\n`);
  process.stdout.write(`  intramural-extension-THROUGH-WALL = 0             : ${noThrough2 ? 'YES' : '⛔ NO'}\n`);
  process.stdout.write(`  no body outside its own circuit (§241.6)          : ${noOutside ? 'YES' : '⛔ NO'}\n`);
  process.stdout.write(`  market-infill fossils accumulate with the years   : ${srows.map((r) => r.infillFossils).join(' → ')}\n`);
}
