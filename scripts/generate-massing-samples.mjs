/**
 * scripts/generate-massing-samples.mjs — TRANCHE M, lane M-0 TASTE ARTIFACTS.
 *
 * Emits the two procedural-massing sample plates from the landing fixture's OWN town (the
 * fixture idiom, extended to the massing substrate) so the manager can validate the massing
 * VISUALLY and the owner gets a taste checkpoint BEFORE M-0b / the views dispatch (the
 * picturesque gate: green gates never certify beauty). Two plates from ONE substrate:
 *
 *   1. cnocby.parchment.massing.svg      — the OBLIQUE panorama with the massing SEAM active
 *      (buildTownMapPanoramaSvg under a `massingSet` style): buildings render as volumes
 *      (walls + kind-keyed roofs + cast shadows) in place of glyph facades, over the full
 *      illustrated-dressed ground. Proves the shipped seam (townPanorama.js) produces beauty.
 *   2. cnocby.parchment.massing-plan.svg — the FLAT-PLAN-WITH-MASSING (the planner's-sketch
 *      seed for M-4): the SAME substrate at the near-top-down FLAT_PLAN_PROJ, assembled here
 *      over district patches + streets, proving the substrate is projection-agnostic (one
 *      model, many projections — the townPanorama law).
 *
 * THE DRIFT GATE (the honesty contract, mirrored from the sibling emitters): the replayed
 * town must match the committed fixture (name + population) or this FAILS LOUDLY rather than
 * freezing a plate depicting a town the landing dossier does not.
 *
 * DETERMINISM: same seed + same config + same engine ⇒ byte-identical plates. Nothing here
 * reads a clock, forks rng, or touches Math.random — the massing substrate is a pure function
 * of (building, style, projection). Run twice + cmp.
 *
 * Usage (plain node — the src import chain is node-ESM runnable as-is):
 *   node scripts/generate-massing-samples.mjs           # emit the 2 samples
 *   node scripts/generate-massing-samples.mjs --check    # verify only (exit 1 if stale)
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildTownMapModel, hasDrawableMap, buildTownMapPanoramaSvg,
  styleDistrictColor, drawListToSvg, buildingElevation, makeCavalierProject, FLAT_PLAN_PROJ,
  OBLIQUE_PROJ, buildingMassingOps, compareMassingDepth,
} from '../src/domain/townMap/index.js';
import { glyphKindFor } from '../src/domain/townMap/glyphAssign.js';
import { slugify } from '../src/kernel/slugify.js';
import { fixture } from '../src/components/home/landingFixture.js';
import { dressedStyle, replayFixtureTown } from './generate-landing-map-plates.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'landing-maps');
const SLUG = slugify(fixture.town.name);
const PLATE_SIZE = 720;
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

/**
 * The MASSING style: the illustrated-dressed base palette (glyph + ground-dress fields) plus
 * the `massingSet` capability field that fires the panorama seam. Carries `__resolved` so the
 * renderer's resolver passes it through unchanged (the merged fields survive re-resolution).
 * @param {string} styleId
 */
function massingStyle(styleId) {
  return Object.freeze({ ...dressedStyle(styleId), massingSet: 'medieval', __resolved: true });
}

/** The oblique panorama massing plate (the shipped seam). */
function renderObliqueMassing(model) {
  return buildTownMapPanoramaSvg(model, { style: massingStyle('parchment'), width: PLATE_SIZE, height: PLATE_SIZE });
}

/**
 * The flat-plan-with-massing plate: the massing substrate at the near-top-down FLAT_PLAN_PROJ,
 * composed over district patches + roads + streets. Buildings painter-sorted far-to-near.
 */
function renderFlatPlanMassing(model) {
  const style = massingStyle('parchment');
  const project = makeCavalierProject(FLAT_PLAN_PROJ);
  const tierIndex = Math.max(0, TIERS.indexOf((model.meta && model.meta.tier) || 'town'));
  /** @type {(x:number,y:number,e:number)=>[number,number]} */
  const P = (x, y, e) => { const q = project(x, y, e); return [q.x, q.y]; };
  const ops = [];
  const categoryById = new Map((model.districts || []).map((d) => [d.id, d.category]));

  // district ground patches (flat, elev 0)
  for (const d of model.districts || []) {
    const color = styleDistrictColor(d.category, style);
    const pts = (d.polygon || []).map((p) => P(p[0], p[1], 0));
    ops.push({ t: 'poly', pts, closed: true, fill: color, fillOpacity: style.opacity.districtFill, stroke: color, strokeOpacity: style.opacity.districtStroke, strokeWidth: style.stroke.district });
  }
  // approach roads + skeleton streets (flat)
  for (const r of (model.frame && Array.isArray(model.frame.roads) ? model.frame.roads : [])) {
    const a = P(r.from[0], r.from[1], 0), b = P(r.to[0], r.to[1], 0);
    ops.push({ t: 'line', x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: style.palette.road, strokeOpacity: style.opacity.roadStroke, strokeWidth: style.stroke.roadBase + (r.weight || 0) });
  }
  for (const st of (model.skeleton && Array.isArray(model.skeleton.streets) ? model.skeleton.streets : [])) {
    const a = P(st.from.x, st.from.y, 0), b = P(st.to.x, st.to.y, 0);
    ops.push({ t: 'line', x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: style.palette.street, strokeOpacity: style.opacity.streetStroke, strokeWidth: style.stroke.street });
  }
  // building massing volumes (far-to-near)
  for (const bld of (model.buildings || []).slice().sort(compareMassingDepth)) {
    const category = categoryById.get(bld.districtId);
    const color = styleDistrictColor(category, style);
    const height = buildingElevation(bld.kind, tierIndex, category);
    const footprint = bld.kind === 'fill' ? 6 : 9;
    const { kind: roofKind } = glyphKindFor(bld, category);
    for (const op of buildingMassingOps({ x: bld.position.x, y: bld.position.y, footprint, height, roofKind, color, style, project, anchorKey: bld.anchorKey })) ops.push(op);
  }
  return drawListToSvg(ops, { width: PLATE_SIZE, height: PLATE_SIZE, style });
}

// THE INSTITUTION GALLERY — the named-landmark silhouettes laid out in a grid so the manager +
// owner can run the recognition test ("can I identify the cathedral, the mill, the keep at a
// glance?"). 4 columns × 4 rows; each cell is one glyph kind tinted by a representative district
// category. The draw vocabulary has no text op, so the row/column order is the label (legend in
// the M-0 report + the plate provenance). The mono-district fixture village cannot show this range.
const GALLERY = Object.freeze([
  { kind: 'spire', cat: 'religious' }, { kind: 'small-spire', cat: 'religious' }, { kind: 'towered-keep', cat: 'military' }, { kind: 'mage-tower', cat: 'arcane' },
  { kind: 'wheelhouse', cat: 'craft' }, { kind: 'forge', cat: 'craft' }, { kind: 'stall-rows', cat: 'merchant' }, { kind: 'gambrel-store', cat: 'merchant' },
  { kind: 'quay-shed', cat: 'foreign' }, { kind: 'signpost-house', cat: 'merchant' }, { kind: 'manor-hall', cat: 'noble' }, { kind: 'moot-hall', cat: 'civic' },
  { kind: 'caravan-house', cat: 'foreign' }, { kind: 'workshop', cat: 'industrial' }, { kind: 'house-a', cat: 'residential' }, { kind: 'massing', cat: 'residential' },
]);
const GALLERY_COLS = 4;
const GALLERY_HEIGHT = 58;

/**
 * The INSTITUTION SILHOUETTE GALLERY: a synthetic grid of the named-landmark composite forms
 * rendered through the substrate at the oblique projection, so the manager + owner can judge the
 * RECOGNITION of each institution (the owner's silhouette law) in one plate. Pure: fixed
 * positions, no rng, no model.
 */
function renderInstitutionGallery() {
  const style = massingStyle('parchment');
  const project = makeCavalierProject(OBLIQUE_PROJ);
  const rows = Math.ceil(GALLERY.length / GALLERY_COLS);
  const marginX = 150, marginY = 150, stepX = (1000 - 2 * marginX) / (GALLERY_COLS - 1), stepY = (1000 - 2 * marginY) / (rows - 1);
  const cells = GALLERY.map((g, i) => ({
    position: { x: Math.round(marginX + (i % GALLERY_COLS) * stepX), y: Math.round(marginY + Math.floor(i / GALLERY_COLS) * stepY) },
    roofKind: g.kind,
    color: styleDistrictColor(g.cat, style),
    anchorKey: `gallery:${g.kind}`,
  }));
  const ops = [];
  for (const c of cells.slice().sort(compareMassingDepth)) {
    for (const op of buildingMassingOps({ x: c.position.x, y: c.position.y, footprint: 20, height: GALLERY_HEIGHT, roofKind: c.roofKind, color: c.color, style, project, anchorKey: c.anchorKey })) ops.push(op);
  }
  return drawListToSvg(ops, { width: PLATE_SIZE, height: PLATE_SIZE, style });
}

function provenance(kind, town) {
  return `<!-- settlementforge massing sample (TRANCHE M, M-0 procedural massing substrate) · seed ${fixture.seed}`
    + ` · style parchment · ${kind}`
    + ` · ${town.name} (pop ${town.population})`
    + ` · generator ${fixture.engine.generatorVersion} / simulation ${fixture.engine.simulationVersion} -->`;
}

const SAMPLES = [
  { file: `${SLUG}.parchment.massing.svg`, kind: 'oblique panorama massing (seam active)', render: renderObliqueMassing },
  { file: `${SLUG}.parchment.massing-plan.svg`, kind: 'flat-plan-with-massing (FLAT_PLAN_PROJ)', render: renderFlatPlanMassing },
];

function main() {
  const checkOnly = process.argv.includes('--check');
  const town = replayFixtureTown();

  // ── THE DRIFT GATE ──────────────────────────────────────────────────────────
  if (town.name !== fixture.town.name || town.population !== fixture.town.population) {
    console.error(
      `[massing-samples] DRIFT: replaying seed ${fixture.seed} produced "${town.name}" `
      + `(pop ${town.population}) but the committed fixture froze "${fixture.town.name}" `
      + `(pop ${fixture.town.population}). The engine has moved since the fixture was emitted `
      + `— re-emit the fixture (ONE-REGEN batch) before regenerating samples.`,
    );
    process.exit(1);
  }

  const model = buildTownMapModel(town, { layoutLawVersion: 2 });
  if (!hasDrawableMap(model)) {
    console.error('[massing-samples] the fixture town has no drawable map — cannot emit samples.');
    process.exit(1);
  }

  // The two fixture-town plates (drift-gated) plus the synthetic vocabulary showcase (no
  // drift gate — it depicts no real town, only the substrate's roof-form × colour range).
  const emissions = [
    ...SAMPLES.map((s) => ({ file: s.file, body: `${provenance(s.kind, town)}\n${s.render(model)}` })),
    {
      file: `massing-gallery.svg`,
      body: `<!-- settlementforge massing sample (TRANCHE M, M-0) · SYNTHETIC institution silhouette gallery`
        + ` · row-major kinds [${GALLERY.map((g) => g.kind).join(', ')}]`
        + ` · oblique projection · parchment palette · not a real settlement -->\n${renderInstitutionGallery()}`,
    },
  ];

  let stale = 0;
  for (const em of emissions) {
    const path = join(OUT_DIR, em.file);
    if (checkOnly) {
      const committed = existsSync(path) ? readFileSync(path, 'utf8') : null;
      if (committed !== em.body) {
        console.error(`[massing-samples] STALE: ${path} does not match the replayed render.`);
        stale += 1;
      }
      continue;
    }
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(path, em.body);
    console.log(`[massing-samples] emitted → ${path} (${em.body.length} bytes)`);
  }

  if (checkOnly) {
    if (stale > 0) process.exit(1);
    console.log('[massing-samples] check OK — samples match the replayed fixture town.');
  }
}

main();
