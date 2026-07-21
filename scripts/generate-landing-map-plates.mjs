/**
 * scripts/generate-landing-map-plates.mjs — W-DOC: the MAP WAYPOINT's frozen
 * lens plates, derived from the landing fixture's OWN town (the fixture idiom
 * extended to the map layer — the product's own output is the art, brief §5).
 *
 * Why a SEPARATE script (not an extension of generate-landing-fixture.mjs):
 * re-running the fixture generator re-emits the frozen landingFixture.js module
 * — a golden-class artifact whose regeneration rides the goldens-regen policy,
 * never a side effect of adding art. This script instead REPLAYS the committed
 * fixture's recorded inputs (seed + full config, landingFixture.js) through the
 * same deterministic pipeline and renders the map plates from the result.
 *
 * THE DRIFT GATE (the honesty contract): before emitting anything, the replayed
 * town must MATCH the committed fixture (name + population). If the engine has
 * moved since the fixture was emitted, the replay produces a different town and
 * this script FAILS LOUDLY instead of freezing a plate that depicts a town the
 * landing's §02 dossier does not. (Fix: the ONE-REGEN batch re-emits the fixture
 * first, then this script re-runs — same order as the goldens policy.)
 *
 * THE CARTOGRAPHER'S CROP (the craft pass, organic-craft law): a village on the
 * renderer's full 0..1000 sheet floats in empty country — a sparse plate, not a
 * specimen. The generator therefore frames the subject: content bounds from the
 * MODEL (districts + buildings + water), padded, squared, clamped; the
 * renderer's full-sheet furniture is turned OFF (style.furniture: []) and the
 * plate furniture is re-composed FOR the crop — the double neatline + the house
 * compass rose (the renderer's own geometry, scaled) — so roads still run
 * honestly off the sheet while the town fills the frame. Read-only consumption
 * of the pure renderer throughout; all composition lives here.
 *
 * Output: public/landing-maps/<slug>.<styleId>.svg — one plate per lens in
 * PLATE_STYLES (parchment = the house default + watercolor = the flip lens),
 * each carrying a provenance comment (seed · style · engine versions · town)
 * that the landing contract test pins against the fixture module.
 *
 * Usage (vite-node resolves src/ imports exactly like the app build):
 *   npx vite-node scripts/generate-landing-map-plates.mjs           # check + emit
 *   npx vite-node scripts/generate-landing-map-plates.mjs -- --check # verify only
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { generateSettlementPipeline } from '../src/generators/generateSettlementPipeline.js';
import {
  buildTownMapModel, buildTownMapDrawList, drawListToSvg, hasDrawableMap, resolveTownMapStyle,
} from '../src/domain/townMap/index.js';
import { slugify } from '../src/kernel/slugify.js';
import { fixture } from '../src/components/home/landingFixture.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'landing-maps');

// The two lenses of the waypoint's flip. Parchment is the house default lens
// (DEFAULT_STYLE_ID); watercolor is the most visually distinct craft register
// that stays inside the period-craft art law (no age damage, wash over line).
export const PLATE_STYLES = Object.freeze(['parchment', 'watercolor']);

/** Plate width/height (px) — matches the samples' 720 square. */
const PLATE_SIZE = 720;

/** Crop padding (viewBox units) + the smallest crop side (breathing country). */
const CROP_PAD = 70;
const CROP_MIN_SIDE = 460;
const SHEET = 1000; // the renderer's full sheet (VIEW)

/** Replay the committed fixture's forge inputs deterministically. */
export function replayFixtureTown() {
  const cfg = {
    ...fixture.forge.config,
    ...(fixture.forge.randomSliderMode === true ? { _randomizePriorities: true } : {}),
  };
  return generateSettlementPipeline(cfg, null, { seed: fixture.seed, customContent: {} });
}

/** Union bounds of the model's CONTENT (districts + buildings + water). */
export function contentBounds(model) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const eat = (x, y) => {
    if (Number.isFinite(x) && Number.isFinite(y)) {
      minX = Math.min(minX, x); minY = Math.min(minY, y);
      maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  };
  for (const d of model.districts || []) {
    for (const p of d.polygon || []) eat(p[0], p[1]);
  }
  for (const b of model.buildings || []) {
    const p = b.position || {};
    eat(p.x, p.y);
  }
  const water = model.frame && model.frame.water;
  if (water && Array.isArray(water.path)) {
    for (const p of water.path) eat(p[0], p[1]);
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY };
}

/** The cartographer's crop: pad, square, floor, clamp to the sheet. */
export function cropBox(bounds) {
  const w = bounds.maxX - bounds.minX;
  const h = bounds.maxY - bounds.minY;
  const side = Math.min(SHEET, Math.max(CROP_MIN_SIDE, Math.max(w, h) + 2 * CROP_PAD));
  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  let x0 = cx - side / 2;
  let y0 = cy - side / 2;
  x0 = Math.max(0, Math.min(SHEET - side, x0));
  y0 = Math.max(0, Math.min(SHEET - side, y0));
  const r = (n) => Math.round(n * 100) / 100;
  return { x0: r(x0), y0: r(y0), side: r(side) };
}

/**
 * Plate furniture composed FOR the crop: the double neatline + the house
 * compass rose — the renderer's own furniture geometry (townMapDraw.js
 * pushCartouche / pushCompass), scaled by k = side/1000 and translated to the
 * crop box, so the framed plate keeps the exact house signature.
 */
function furnitureOps(style, { x0, y0, side }) {
  const k = side / SHEET;
  const ink = style.palette.ink;
  const gold = style.palette.anchor;
  const ops = [];
  const frame = (a, w, o) => ({
    t: 'poly',
    pts: [
      [x0 + a * k, y0 + a * k], [x0 + side - a * k, y0 + a * k],
      [x0 + side - a * k, y0 + side - a * k], [x0 + a * k, y0 + side - a * k],
    ],
    closed: true, stroke: ink, strokeOpacity: o, strokeWidth: w * k,
  });
  ops.push(frame(18, 3, 0.85));
  ops.push(frame(28, 1, 0.6));
  // The house rose, lower-right (pushCompass geometry at 892,892 r62, scaled).
  const cx = x0 + 892 * k;
  const cy = y0 + 892 * k;
  const r = 62 * k;
  const spike = 9 * k;
  ops.push({ t: 'circle', cx, cy, r, stroke: ink, strokeWidth: 1.5 * k });
  ops.push({ t: 'circle', cx, cy, r: r - 8 * k, stroke: ink, strokeWidth: 0.75 * k });
  ops.push({ t: 'path', d: `M ${cx} ${cy - r} L ${cx + spike} ${cy} L ${cx} ${cy + r} L ${cx - spike} ${cy} Z`, fill: gold, stroke: ink, strokeWidth: 0.75 * k });
  ops.push({ t: 'path', d: `M ${cx - r} ${cy} L ${cx} ${cy + spike} L ${cx + r} ${cy} L ${cx} ${cy - spike} Z`, fill: ink });
  ops.push({ t: 'circle', cx, cy, r: 4 * k, fill: gold, stroke: ink, strokeWidth: 0.75 * k });
  return ops;
}

/** Render one cropped plate (content ops + crop furniture, crop viewBox). */
export function renderPlate(model, styleId, crop) {
  const resolved = resolveTownMapStyle(styleId);
  // Content only — the renderer's full-sheet furniture is re-composed for the
  // crop by furnitureOps (the grid stays for the vtt lens family; neither plate
  // lens uses it).
  const contentStyle = { ...resolved, furniture: [] };
  const ops = buildTownMapDrawList(model, contentStyle);
  ops.push(...furnitureOps(resolved, crop));
  const svg = drawListToSvg(ops, { width: PLATE_SIZE, height: PLATE_SIZE, style: resolved });
  // Crop surgery on our own deterministic artifact: re-point the viewBox and the
  // background rect at the crop box (drawListToSvg hardcodes the full sheet).
  return svg
    .replace(`viewBox="0 0 ${SHEET} ${SHEET}"`, `viewBox="${crop.x0} ${crop.y0} ${crop.side} ${crop.side}"`)
    .replace(
      `<rect x="0" y="0" width="${SHEET}" height="${SHEET}"`,
      `<rect x="${crop.x0}" y="${crop.y0}" width="${crop.side}" height="${crop.side}"`,
    );
}

/** The provenance comment stamped into each plate (pinned by the contract test). */
function provenanceComment(styleId, town) {
  return `<!-- settlementforge landing plate · seed ${fixture.seed} · style ${styleId}`
    + ` · ${town.name} (pop ${town.population})`
    + ` · generator ${fixture.engine.generatorVersion} / simulation ${fixture.engine.simulationVersion} -->`;
}

export function plateFileName(styleId) {
  return `${slugify(fixture.town.name)}.${styleId}.svg`;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const town = replayFixtureTown();

  // ── THE DRIFT GATE ────────────────────────────────────────────────────────
  if (town.name !== fixture.town.name || town.population !== fixture.town.population) {
    console.error(
      `[landing-map-plates] DRIFT: replaying seed ${fixture.seed} produced `
      + `"${town.name}" (pop ${town.population}) but the committed fixture froze `
      + `"${fixture.town.name}" (pop ${fixture.town.population}). The engine has `
      + `moved since the fixture was emitted — re-emit the fixture (ONE-REGEN `
      + `batch) before regenerating plates.`,
    );
    process.exit(1);
  }

  // The v2 semantic layout (brief §4: the waypoint shows the v2 map) — selected
  // the same way the product's redraw opt-in selects it: an explicit
  // layoutLawVersion 2 on the edits arg (townMapModel.js).
  const model = buildTownMapModel(town, { layoutLawVersion: 2 });
  if (!hasDrawableMap(model)) {
    console.error('[landing-map-plates] the fixture town has no drawable map — cannot emit plates.');
    process.exit(1);
  }
  if (Number(model.layoutLawVersion) !== 2) {
    console.error(`[landing-map-plates] expected the v2 layout, got layoutLawVersion ${model.layoutLawVersion} — refusing to emit a v1 plate for the v2 waypoint.`);
    process.exit(1);
  }

  const bounds = contentBounds(model);
  if (!bounds) {
    console.error('[landing-map-plates] no content coordinates in the model — cannot crop.');
    process.exit(1);
  }
  const crop = cropBox(bounds);

  let stale = 0;
  for (const styleId of PLATE_STYLES) {
    const plate = `${provenanceComment(styleId, town)}\n${renderPlate(model, styleId, crop)}`;
    const file = join(OUT_DIR, plateFileName(styleId));
    if (checkOnly) {
      const committed = existsSync(file) ? readFileSync(file, 'utf8') : null;
      if (committed !== plate) {
        console.error(`[landing-map-plates] STALE: ${file} does not match the replayed render.`);
        stale += 1;
      }
      continue;
    }
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(file, plate);
    console.log(`[landing-map-plates] emitted → ${file} (${plate.length} bytes, crop ${crop.side}×${crop.side} @ ${crop.x0},${crop.y0})`);
  }
  if (checkOnly) {
    if (stale > 0) process.exit(1);
    console.log('[landing-map-plates] check OK — plates match the replayed fixture town.');
  }
}

// Auto-run ONLY as the entry script — so the candidate generator
// (generate-cnocby-candidates.mjs) can import the pure helpers above WITHOUT
// triggering an emit/check of the canonical plates.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
