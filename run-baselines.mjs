/**
 * run-baselines.mjs — REG-I0 · THE BASELINE RECORDER.
 *
 * Runs every instrument over the sealed `ee0db96d3` renders and writes `out/baselines.json`.
 * A2.1 item 3's exit: BASELINES RECORDED, **with every figure carrying its denominator**.
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
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readPNG } from './lib/png.mjs';
import { squint } from './i1-squint.mjs';
import { trace as routeTrace } from './i2-route-trace.mjs';
import { chunking } from './i3-chunking.mjs';
import { salience } from './i4-landmark-salience.mjs';
import { roleContrast } from './i5-role-contrast.mjs';
import { masksFor, frontageContinuity, freestanding } from './i6-frontage.mjs';
import { categoryHue } from './i7-ftg-colour.mjs';
import { audit as noDrift } from './i8-nodrift-trace.mjs';
import { sealed, straddleCross, bodyCensus, hullContainment } from './i10-censuses.mjs';
import { r2, r4 } from './lib/geom.mjs';

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const HERE = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg-instruments';
const R0 = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/31585ce2-d79e-43c8-9ed7-1c32d073e393/scratchpad/reg0';
const WT = arg('wt', `${R0}/w3f-tree`);

/** the plates this lane baselines, and the leaf each one is */
const PLATES = [
  { key: 'city', tier: 'city', frontage: 6.25, svg: `${R0}/out/base-city-city-parchment.svg`, png: `${R0}/png/BEFORE-city.png`, kind: 'BASE' },
  { key: 'village', tier: 'village', frontage: 13.75, svg: `${R0}/out/base-village-village-parchment.svg`, png: `${R0}/png/BEFORE-village.png`, kind: 'BASE' },
  { key: 'town', tier: 'town', frontage: 4.93, svg: `${HERE}/renders/base-town-town-parchment.svg`, png: `${HERE}/png/BASE-town.png`, kind: 'BASE' },
  { key: 'city', tier: 'city', frontage: 6.25, svg: `${R0}/out/base-city-city-parchment.svg`, geomSvg: `${R0}/out/spec-city.svg`, png: `${R0}/png/AFTER-city.png`, kind: 'SPEC', note: 'REG-0 specimen. PIXEL instruments probe the BASE geometry (same probes, only the picture differs); the GEOMETRY instrument i6 reads the SPECIMEN svg.' },
  { key: 'village', tier: 'village', frontage: 13.75, svg: `${R0}/out/base-village-village-parchment.svg`, geomSvg: `${R0}/out/spec-village.svg`, png: `${R0}/png/AFTER-village.png`, kind: 'SPEC', note: 'REG-0 specimen; i6 reads the SPECIMEN svg' },
];

const S = await sealed(WT);
const byKey = new Map(S.CORPUS.map((s) => [s.key, s]));
const fabricCache = new Map();
const fabricFor = (k) => {
  if (!fabricCache.has(k)) fabricCache.set(k, S.buildOne(byKey.get(k)).fabric);
  return fabricCache.get(k);
};

const out = {
  lane: 'TE-REG-I0',
  charter: 'docs/DESIGN_REGISTER_PROGRAM.md A2.1 item 3 (REG-I0), A2.2, §6, A1.3',
  sealedRef: 'ee0db96d3',
  worktree: WT,
  generated: 'deterministic — no Date, no Math.random anywhere in the instrument set',
  note: 'Every row carries its DENOMINATOR in words. A figure without its denominator is not a measurement.',
  plates: [],
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

  // i6 — the render as DRAWN, plus the REG-0-compatible reading beside it
  const circuitPoly = (() => {
    const f = fabricFor(P.key);
    const w = (f.walls || []).find((x) => x.kind !== 'old-core') || (f.walls || [])[0];
    return w ? (w.closedPolygon && w.closedPolygon.length > 2 ? w.closedPolygon : w.polygon) : null;
  })();
  const geom = P.geomSvg || P.svg;
  const Md = masksFor(geom, { frontage: P.frontage, wallbandUnits: 0 });
  const Mc = masksFor(geom, { frontage: P.frontage, wallbandUnits: r2(P.frontage * 1.15), legacyStamp: true });
  row.i6_frontage = {
    geometrySvg: geom,
    asDrawn: {
      fuseRadiusUnits: r2(Md.FUSE_R),
      base: frontageContinuity(Md.built, Md),
      fused: frontageContinuity(Md.fused, Md),
      freestanding: freestanding(Md, { circuitPoly }),
    },
    reg0Compat: {
      wallbandUnits: r2(P.frontage * 1.15), buildingsClearedByWallband: Mc.clearedSubpaths,
      base: frontageContinuity(Mc.built, Mc),
      note: "REG-0's own REGIME-B strike re-applied so its published base figures reproduce exactly",
    },
  };
  out.plates.push(row);
  process.stdout.write(`  plate ${row.plate.padEnd(13)} squint=${row.i1_squint.pass ? 'PASS' : 'FAIL'} contrast=${row.i5_roleContrast.pass ? 'PASS' : 'FAIL'}`
    + ` hue=${row.i7_categoryHue.pass ? 'PASS' : 'FAIL'} landmark=${row.i4_landmarkSalience.pass ? 'PASS' : 'FAIL'}`
    + ` frontageRatio=${row.i6_frontage.asDrawn.base.ratio} runs=${row.i6_frontage.asDrawn.base.runs}→${row.i6_frontage.asDrawn.fused.runs}\n`);
}

/* ─────────────── the model instruments, per leaf ─────────────── */
for (const key of ['city', 'village', 'town']) {
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
