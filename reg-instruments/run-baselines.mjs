/**
 * run-baselines.mjs — REG-I0 · THE BASELINE RECORDER.
 *
 * Runs every instrument over the sealed `d1b32e339` tree and writes `out/baselines.json`.
 * A2.1 item 3's exit: BASELINES RECORDED, **with every figure carrying its denominator**.
 *
 * ⭐⭐ RE-RECORDED AT `d1b32e339` (refs/preserve/map-sandbox-reg1-fusion) BY LANE TE-REG-I0b,
 * after ODQ §602.2 ordered the two i6 repairs. **The pre-repair file is kept verbatim at
 * `out/baselines-ee0db96d3.json` and is never overwritten** — a baseline that is edited in place
 * is not a baseline. Read the two side by side to see what the repairs moved and nothing else.
 *
 * ⚠ WHAT "AT THE NEW TIP" MEANS, SINCE THE ANSWER IS NOT OBVIOUS. At `d1b32e339` the fusion
 * feature is DORMANT: REG-1 §6 proved the unarmed render byte-identical to `ee0db96d3` across
 * 29 of 29 artifacts. So the BASELINE is still the dormant render — what moved between the two
 * files is the INSTRUMENT, not the drawing. The ARMED render is recorded BESIDE it as a
 * differential (`i6Corpus.rows[].armed`), never as the baseline, exactly as `SPEC-` is.
 *
 * ⚠ THE RENDERS ARE STAGED INSIDE THIS DIRECTORY (`renders/base`, `renders/armed`) rather than
 * referenced in the REG-1 lane's scratchpad, so the baseline is reproducible from the preserved
 * instrument set alone. `renders/base/city-city-parchment.svg` is byte-identical
 * (`3449ace03d809add`) to REG-0's own `base-city-city-parchment.svg`.
 *
 * ⭐ EVERY ROW IS A `verdict()` — instrument, value, DENOMINATOR (named in words), band, pass.
 * The denominator is prose rather than a number because the useful denominators here are
 * populations, not divisors: "the SD of the 8,924 ground px at 200×200" is what makes 1.57 mean
 * something, and a bare `8924` would not.
 *
 * ⚠ THE PLATES, AND WHAT EACH ONE IS.
 *   BASE-*   the sealed render as `renderFolio` emits it at ee0db96d3. THESE ARE THE BASELINE.
 *   SPEC-*   REG-0's everything-on specimen over the same base. Recorded BESIDE the baseline as
 *            a differential, never as the baseline — it is a judging exhibit, not the tip.
 *
 * Usage: node run-baselines.mjs [--wt=<worktree>] [--out=out/baselines.json]
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readPNG } from './lib/png.mjs';
import { squint } from './i1-squint.mjs';
import { trace as routeTrace } from './i2-route-trace.mjs';
import { chunking } from './i3-chunking.mjs';
import { salience } from './i4-landmark-salience.mjs';
import { roleContrast } from './i5-role-contrast.mjs';
import { masksFor, frontageContinuity, freestanding, resolvedGrid, gridReport, LEGACY_GRID } from './i6-frontage.mjs';
import { categoryHue } from './i7-ftg-colour.mjs';
import { audit as noDrift } from './i8-nodrift-trace.mjs';
import { sealed, straddleCross, bodyCensus, hullContainment } from './i10-censuses.mjs';
import { r2, r4 } from './lib/geom.mjs';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const R0 = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0';
const WT = arg('wt', '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/laneREG1-tree');
const RENDERS = `${HERE}/renders`;
const SEALED_REF = 'd1b32e339';

/** the plates this lane baselines, and the leaf each one is */
const PLATES = [
  { key: 'city', tier: 'city', frontage: 6.25, svg: `${RENDERS}/base/city-city-parchment.svg`, png: `${R0}/png/BEFORE-city.png`, kind: 'BASE' },
  { key: 'village', tier: 'village', frontage: 13.75, svg: `${RENDERS}/base/village-village-parchment.svg`, png: `${R0}/png/BEFORE-village.png`, kind: 'BASE' },
  { key: 'town', tier: 'town', frontage: 4.93, svg: `${RENDERS}/base/town-town-parchment.svg`, png: `${HERE}/png/BASE-town.png`, kind: 'BASE' },
  { key: 'city', tier: 'city', frontage: 6.25, svg: `${RENDERS}/base/city-city-parchment.svg`, geomSvg: `${R0}/out/spec-city.svg`, png: `${R0}/png/AFTER-city.png`, kind: 'SPEC', note: 'REG-0 specimen. PIXEL instruments probe the BASE geometry (same probes, only the picture differs); the GEOMETRY instrument i6 reads the SPECIMEN svg.' },
  { key: 'village', tier: 'village', frontage: 13.75, svg: `${RENDERS}/base/village-village-parchment.svg`, geomSvg: `${R0}/out/spec-village.svg`, png: `${R0}/png/AFTER-village.png`, kind: 'SPEC', note: 'REG-0 specimen; i6 reads the SPECIMEN svg' },
];

/**
 * ⭐ i6 runs PER LEAF IN ITS OWN SUBPROCESS. The repaired grid is the leaf's own party-gap-
 * resolving N (up to 6,200 in this corpus), and 36 masks at that resolution in one heap is how a
 * recorder dies half-written. A subprocess also means the recorded figure comes from exactly the
 * command line a reader can re-run.
 */
const i6Leaf = (svg, frontage, circuit) => {
  const a = ['--max-old-space-size=12000', `${HERE}/i6-frontage.mjs`, `--svg=${svg}`, `--frontage=${frontage}`, '--json=/tmp/.rb-i6.json'];
  if (circuit) a.push(`--circuit=${circuit}`);
  execFileSync('node', a, { stdio: ['ignore', 'ignore', 'inherit'] });
  return JSON.parse(readFileSync('/tmp/.rb-i6.json', 'utf8'));
};

const S = await sealed(WT);
const byKey = new Map(S.CORPUS.map((s) => [s.key, s]));
const fabricCache = new Map();
const fabricFor = (k) => {
  if (!fabricCache.has(k)) fabricCache.set(k, S.buildOne(byKey.get(k)).fabric);
  return fabricCache.get(k);
};
/** the model's own circuit — freestanding()'s PREFERRED intramuros input, null where unwalled */
const circuitFor = (k) => {
  const f = fabricFor(k);
  const w = (f.walls || []).find((x) => x.kind !== 'old-core') || (f.walls || [])[0];
  const p = w ? (w.closedPolygon && w.closedPolygon.length > 2 ? w.closedPolygon : w.polygon) : null;
  return p && p.length > 2 ? p : null;
};

const out = {
  lane: 'TE-REG-I0b (re-record; the set was minted by TE-REG-I0)',
  charter: 'docs/DESIGN_REGISTER_PROGRAM.md A2.1 item 3 (REG-I0), A2.2, §6, A1.3 · ODQ §602.2 (the two i6 repairs)',
  sealedRef: SEALED_REF,
  sealedRefFull: 'refs/preserve/map-sandbox-reg1-fusion — d1b32e339fdcdc8cf4647d71db980bce3d2f51d1',
  priorSealedRef: 'ee0db96d3',
  priorBaselines: 'out/baselines-ee0db96d3.json — the pre-repair file, kept verbatim, never overwritten',
  worktree: WT,
  generated: 'deterministic — no Date, no Math.random anywhere in the instrument set',
  note: 'Every row carries its DENOMINATOR in words. A figure without its denominator is not a measurement.',
  dormancy: 'At d1b32e339 the fusion feature is DORMANT. REG-1 §6: the unarmed render is byte-identical to ee0db96d3 on 29 of 29 artifacts, and renders/base/city-city-parchment.svg is sha256:3449ace03d809add — REG-0\'s own base plate. The BASELINE is therefore still the dormant render; what moved between this file and the prior one is the INSTRUMENT.',
  repairs: [
    {
      id: 'R1', instrument: 'i6 · F3',
      was: 'freestandingFraction = SOLITARY / INTRAMURAL BODIES (bodies alone in their closed-mask component, over drawn building subpaths)',
      now: 'freestandingDensity = MASSES / INTRAMURAL BUILDING-INK AREA, per 1,000 sq view units',
      why: 'F3 rose on the fusion tip (city 0.0652 → 0.0818). The ordered fix — count masses in the numerator — is a NO-OP: a body alone in its component IS a component holding one body, measured 133 = 133 at city and 140 = 140 at the tip. The inversion is in the DENOMINATOR: drawn subpaths are not conserved under generative fusion (city 2,045 → 1,717, −16.0 %), while the ink is (building fill 117,452 → 117,885 sq units, +0.37 %).',
      alsoChanged: 'F3 no longer reads through close(built, FUSE_R) — the radius REG-1 §4 showed bridges slots and packing wedges the charter says must remain — and it measures a new building-only mask, so no F1/F2 figure moves.',
      supersededFigureKeptAt: 'i6Corpus.rows[].{base,armed}.supersededFraction, labelled, for reconciliation only',
    },
    {
      id: 'R2', instrument: 'i6 · the grid',
      was: 'a fixed 1400 grid — cell 0.714 u',
      now: "the leaf's own party-gap-resolving N: partyGap = plotFrontage × 0.035; N = smallest multiple of 200 with cell ≤ partyGap, capped at 6400 (REG-1 §4b, recorded before measuring)",
      why: 'Every party gap in the corpus is smaller than one 1400 cell (city 0.219 u, village 0.481 u), so the base plate arrived already fused BY RASTERISATION and the instrument could not see the defect it exists to measure.',
      alsoChanged: '--reg0compat PINS 1400 so REG-0\'s published figures still reproduce exactly; --grid= still overrides; --circuit=<json> was added so the CLI can supply the model circuit the instrument already documents as PREFERRED.',
    },
  ],
  plates: [],
  i6Corpus: null,
  model: [],
  censuses: null,
  noDriftTrace: null,
};

/* ─────────────── the pixel + render instruments, per plate ─────────────── */
for (const P of PLATES) {
  if (!existsSync(P.svg) || !existsSync(P.png)) { process.stderr.write(`SKIP ${P.kind}-${P.key}: missing input\n`); continue; }
  const img = readPNG(P.png);
  const row = { plate: `${P.kind}-${P.key}`, tier: P.tier, kind: P.kind, note: P.note || null, svg: P.svg, png: P.png, raster: `${img.w}x${img.h}` };

  row.i1_squint = squint(P.svg, img);
  row.i4_landmarkSalience = salience(P.svg, img);
  row.i4_decoyControl = salience(P.svg, img, 'parchment', { decoy: true });
  row.i5_roleContrast = roleContrast(P.svg, img);
  row.i7_categoryHue = categoryHue(P.svg, img);

  // ⭐ i6 · THE REG-0-COMPATIBLE READING ONLY, at the PINNED legacy grid. The as-drawn reading
  //   for every leaf now lives in `i6Corpus` below, at the leaf's own resolved grid (R2); keeping
  //   a second as-drawn reading here would put two different grids under one instrument's name.
  //   The SPEC plates keep theirs, because the specimen svg is not in the corpus sweep.
  const geom = P.geomSvg || P.svg;
  const Mc = masksFor(geom, { frontage: P.frontage, N: LEGACY_GRID, wallbandUnits: r2(P.frontage * 1.15), legacyStamp: true });
  row.i6_frontage = {
    geometrySvg: geom,
    reg0Compat: {
      grid: LEGACY_GRID, gridReport: gridReport(P.frontage, LEGACY_GRID),
      wallbandUnits: r2(P.frontage * 1.15), buildingsClearedByWallband: Mc.clearedSubpaths,
      base: frontageContinuity(Mc.built, Mc),
      note: "REG-0's own REGIME-B strike re-applied at REG-0's own 1400 grid so its published base figures reproduce exactly. ⚠ This grid does NOT resolve the leaf's party gap — see repairs.R2 — and is a reproduction anchor, not a measurement.",
    },
  };
  if (P.kind === 'SPEC') {
    const g = resolvedGrid(P.frontage);
    const Md = masksFor(geom, { frontage: P.frontage, N: g, wallbandUnits: 0 });
    row.i6_frontage.asDrawn = {
      grid: g, gridReport: gridReport(P.frontage, g), fuseRadiusUnits: r2(Md.FUSE_R),
      base: frontageContinuity(Md.built, Md),
      fused: frontageContinuity(Md.fused, Md),
      freestanding: freestanding(Md, { circuitPoly: circuitFor(P.key) }),
      note: 'the REG-0 SPECIMEN svg, read at the resolved grid — a judging exhibit beside the baseline, never the baseline',
    };
  }
  out.plates.push(row);
  process.stdout.write(`  plate ${row.plate.padEnd(13)} squint=${row.i1_squint.pass ? 'PASS' : 'FAIL'} contrast=${row.i5_roleContrast.pass ? 'PASS' : 'FAIL'}`
    + ` hue=${row.i7_categoryHue.pass ? 'PASS' : 'FAIL'} landmark=${row.i4_landmarkSalience.pass ? 'PASS' : 'FAIL'}`
    + ` reg0Ratio=${row.i6_frontage.reg0Compat.base.ratio} runs=${row.i6_frontage.reg0Compat.base.runs}\n`);
}

/* ─────────────── i6 · THE REPAIRED INSTRUMENT OVER EVERY EXEMPLAR LEAF ───────────────
 * Dormant (the baseline) and ARMED (the differential) at each leaf's own resolved grid, with the
 * model's own circuit supplied where the leaf has one and the fallback NAMED where it does not.
 */
{
  const manifest = JSON.parse(readFileSync(`${RENDERS}/base/manifest.json`, 'utf8'));
  const rows = [];
  const pct = (x, y) => (y ? Math.round(((x - y) / y) * 1000) / 10 : null);
  for (const m of manifest) {
    const circ = existsSync(`${RENDERS}/circuits/${m.key}.json`) ? `${RENDERS}/circuits/${m.key}.json` : null;
    const b = i6Leaf(`${RENDERS}/base/${m.file}`, m.plotFrontage, circ);
    const a = i6Leaf(`${RENDERS}/armed/${m.file}`, m.plotFrontage, circ);
    rows.push({
      leaf: m.key, tier: m.tier, frontage: m.plotFrontage,
      grid: b.grid, gridReport: b.gridReport,
      scope: b.F3.scope, circuitFromModel: b.F3.circuitFromModel,
      base: { F1F2: b.F1F2_base, F1F2_maskFused: b.F1F2_fused, F3: b.F3 },
      armed: { F1F2: a.F1F2_base, F1F2_maskFused: a.F1F2_fused, F3: a.F3 },
      delta: {
        freestandingDensityPct: pct(a.F3.freestandingDensity, b.F3.freestandingDensity),
        massesPct: pct(a.F3.masses, b.F3.masses),
        inkAreaPct: pct(a.F3.intramuralInkAreaUnits2, b.F3.intramuralInkAreaUnits2),
        drawnBodiesPct: pct(a.F3.intramuralBodies, b.F3.intramuralBodies),
        meanRunPct: pct(a.F1F2_base.meanRunUnits, b.F1F2_base.meanRunUnits),
        frontingMassesPct: pct(a.F1F2_base.frontingMasses, b.F1F2_base.frontingMasses),
        supersededFractionPct: pct(a.F3.supersededFraction.freestandingFraction, b.F3.supersededFraction.freestandingFraction),
      },
    });
    const d = rows[rows.length - 1].delta;
    process.stdout.write(`  i6    ${m.key.padEnd(13)} N=${String(b.grid).padEnd(5)} density ${b.F3.freestandingDensity} → ${a.F3.freestandingDensity} (${d.freestandingDensityPct}%)`
      + `  masses ${b.F3.masses}→${a.F3.masses}  ink ${b.F3.intramuralInkAreaUnits2}→${a.F3.intramuralInkAreaUnits2}`
      + `  [SUPERSEDED ${b.F3.supersededFraction.freestandingFraction}→${a.F3.supersededFraction.freestandingFraction}, ${d.supersededFractionPct}%]\n`);
  }
  out.i6Corpus = {
    subject: 'every exemplar leaf, DORMANT (baseline) vs ARMED (differential), at the leaf\'s own party-gap-resolving grid',
    gridRule: 'partyGap = plotFrontage × 0.035; N = smallest multiple of 200 with cell ≤ partyGap, capped at 6400 (REG-1 §4b, recorded before measuring). No leaf reaches the cap.',
    f3Formula: 'freestandingDensity = MASSES / INTRAMURAL BUILDING-INK AREA, per 1,000 sq view units. NUMERATOR: connected components of the drawn building+landmark fill, each placed intramuros by its own centroid. DENOMINATOR: the square view units of that ink inside the circuit, printed on every row as `denominator`.',
    readingRule: '`base` IS the baseline; `armed` is the differential. A NEGATIVE freestandingDensityPct is the cure working. `supersededFraction` is the pre-repair figure and INVERTS — it is recorded only so the two baseline files reconcile.',
    rows,
  };
}

/* ─────────────── the model instruments, EVERY exemplar leaf ─────────────── */
for (const key of S.CORPUS.map((s) => s.key)) {
  const f = fabricFor(key);
  const row = {
    leaf: key, name: f.meta.name, tier: f.meta.tier, population: f.meta.population,
    i2_routeTrace: routeTrace(f),
    i3_chunking: chunking(f),
  };
  out.model.push(row);
  process.stdout.write(`  model ${key.padEnd(13)} route=${row.i2_routeTrace.applicable ? (row.i2_routeTrace.pass ? 'PASS' : 'FAIL') : 'n/a'}`
    + ` (${row.i2_routeTrace.reachable || 0}/${(row.i2_routeTrace.gatesTotal || 0) - (row.i2_routeTrace.gatesBricked || 0)} gates, floor ${row.i2_routeTrace.floorUnits})`
    + `  chunking=${row.i3_chunking.pass ? 'PASS' : 'FAIL'} (${row.i3_chunking.legibleWards}/${row.i3_chunking.totalRegions} in ${JSON.stringify(row.i3_chunking.band)})\n`);
}

/* ─────────────── the two ordered censuses ─────────────── */
if (existsSync(`${HERE}/out/i10-corpus.json`)) {
  const corpus = JSON.parse(readFileSync(`${HERE}/out/i10-corpus.json`, 'utf8'));
  out.censuses = {
    scope: 'the whole exemplar corpus at the sealed model',
    straddleCensus: {
      instrument: "the law's own districtStraddlers(partition, node) — band-aware, old-core rings excluded",
      value: corpus.totals.straddlePrimary.numerator,
      denominator: `${corpus.totals.straddlePrimary.denominator} district regions on ${corpus.totals.walledLeaves} walled leaves of ${corpus.totals.leavesMeasured} measured`,
      preCureReference: '14 straddling districts of 46 on the walled leaves (districtPartition.js header)',
      crossCheck: {
        instrument: 'independent, no band, region polygon vs the ring closedPolygon, tol 1%',
        value: corpus.totals.straddleCrossCheck.numerator,
        denominator: `${corpus.totals.straddleCrossCheck.denominator} district regions`,
        note: 'strictly harsher than the law\'s predicate — the gap is regions holding ground inside the wall BAND',
      },
    },
    outsideCircuitBodyCount: {
      instrument: 'the shipped §241.6 predicate — epoch by epochs[k].body, held by any ring at or after that epoch, half-ring rescued by closedPolygon',
      value: corpus.totals.bodyCensus.numerator,
      denominator: `${corpus.totals.bodyCensus.denominator} drawn bodies that are MEMBERS of a walled epoch (of ${corpus.totals.bodyCensus.drawnBodiesAllLeaves} drawn bodies across all leaves; ${corpus.totals.bodyCensus.suburb} in the suburb beyond every circuit)`,
      preCureReference: '1,331 of 19,563 drawn bodies (6.8%) (epochAxis.js header)',
    },
    hullContainment240_1: {
      instrument: "every vertex of a ring's own epochHull inside that ring (closedPolygon rescues a half-ring)",
      value: corpus.totals.hullVerticesOutside,
      denominator: 'all epochHull vertices on all rings of all walled leaves',
    },
    perLeaf: corpus.leaves.map((l) => ({
      leaf: l.key, tier: l.tier, rings: l.rings, districts: l.districts,
      straddlers: l.straddlePrimary.complete ? l.straddlePrimary.straddlers : null,
      straddleStatus: l.straddlePrimary.status,
      crossCheckStraddlers: l.straddleCrossCheck.applicable ? l.straddleCrossCheck.straddling : null,
      bodiesOutside: l.bodyCensus.applicable ? l.bodyCensus.outside : null,
      bodyMembers: l.bodyCensus.applicable ? l.bodyCensus.members : null,
      suburb: l.bodyCensus.suburb,
    })),
  };
}

/* ─────────────── the no-drift trace ─────────────── */
out.noDriftTrace = noDrift(join(WT, 'harness/renderFolio.mjs'));

const dest = arg('out', `${HERE}/out/baselines.json`);
writeFileSync(dest, JSON.stringify(out, null, 2));
process.stdout.write(`\nBASELINES → ${dest}  (${(JSON.stringify(out).length / 1024).toFixed(1)} KB)\n`);
process.stdout.write('BASELINES_DONE\n');
