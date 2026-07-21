/**
 * scripts/generate-cnocby-candidates.mjs — W4 SHOWCASE ASSETS (walk lane).
 *
 * Regenerates the Cnocby settlement-layer plates through the CURRENT pipeline as
 * DECISION CANDIDATES for the manager's fold pick. Each house lens (parchment +
 * watercolor) is rendered BOTH with town-layout-v2 ON (layoutLawVersion 2 — the
 * semantic urban-planning engine the canonical waypoint already uses) and OFF
 * (layoutLawVersion 1 — the dormant-default v1 layout). v2 is OPT-IN with an owner
 * taste-veto pending, so all four are delivered and W4 never picks: the manager
 * keeps the loser as the veto option.
 *
 * SINGLE SOURCE OF TRUTH: this script imports the canonical emitter's OWN pure
 * geometry (replayFixtureTown / contentBounds / cropBox / renderPlate from
 * generate-landing-map-plates.mjs, which self-guards its main()), so a v2-ON
 * candidate's SVG body is byte-identical to what the canonical script emits to
 * cnocby.<lens>.svg — the cartographer's crop is never duplicated here. This file
 * adds ONLY the layout-version fan-out + the candidate naming; it NEVER writes the
 * canonical filenames (the manager promotes the winner at fold).
 *
 * THE DRIFT GATE (the same honesty contract the canonical emitter carries): the
 * replayed town must match the committed fixture (name + population) or this FAILS
 * LOUDLY rather than freezing a plate depicting a town the landing dossier does not.
 *
 * DETERMINISM: same seed + same config + same engine ⇒ byte-identical plates.
 * Nothing here reads a clock, forks rng, or touches Math.random. Run twice + cmp.
 *
 * Usage (plain node — vitest 4 dropped the standalone vite-node bin; the src import
 * chain is node-ESM runnable as-is):
 *   node scripts/generate-cnocby-candidates.mjs           # emit the 4 candidates
 *   node scripts/generate-cnocby-candidates.mjs --check   # verify only (exit 1 if stale)
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTownMapModel, hasDrawableMap, buildTownMapPanoramaSvg } from '../src/domain/townMap/index.js';
import { slugify } from '../src/kernel/slugify.js';
import { fixture } from '../src/components/home/landingFixture.js';
import {
  PLATE_STYLES, replayFixtureTown, contentBounds, cropBox, renderPlate, dressedStyle,
} from './generate-landing-map-plates.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'landing-maps');

// The two layout laws to fan out over. v2 ON = the semantic urban-planning engine
// (opt-in, owner taste-veto pending); v2 OFF = the dormant-default v1 layout, which
// buildTownMapModel renders byte-identically to no edits.
const LAYOUTS = Object.freeze([
  Object.freeze({ id: 'v2on', layoutLawVersion: 2, label: 'town-layout-v2 ON (semantic urban engine)' }),
  Object.freeze({ id: 'v2off', layoutLawVersion: 1, label: 'town-layout-v2 OFF (v1 dormant-default layout)' }),
]);

const SLUG = slugify(fixture.town.name);

function candidateFileName(styleId, layoutId) {
  return `${SLUG}.${styleId}.${layoutId}.svg`;
}

/** Candidate provenance comment — records the layout version + crop so each file is
 * self-documenting for the fold pick (a superset of the canonical plate stamp). */
function provenanceComment(styleId, layout, town, crop) {
  return `<!-- settlementforge landing plate CANDIDATE (W7 illustrated re-emit) · seed ${fixture.seed}`
    + ` · style ${styleId} · illustrated-dress (glyph facades + ground dress)`
    + ` · layout ${layout.id} (layoutLawVersion ${layout.layoutLawVersion})`
    + ` · ${town.name} (pop ${town.population}) · crop ${crop.side}×${crop.side} @ ${crop.x0},${crop.y0}`
    + ` · generator ${fixture.engine.generatorVersion} / simulation ${fixture.engine.simulationVersion} -->`;
}

/** The panorama candidate's filename + provenance (the owner's 2.5D taste look). */
function panoramaFileName() {
  return `${SLUG}.parchment.panorama.svg`;
}
function panoramaProvenance(town) {
  return `<!-- settlementforge landing plate CANDIDATE (W7 townPanorama · owner 2.5D taste look) · seed ${fixture.seed}`
    + ` · style parchment · illustrated-dress (glyph facades + ground dress) · projection panorama (oblique 2.5D)`
    + ` · ${town.name} (pop ${town.population})`
    + ` · generator ${fixture.engine.generatorVersion} / simulation ${fixture.engine.simulationVersion} -->`;
}
/** Render the parchment-dressed oblique panorama plate for the fixture town (v2 layout). */
function renderPanorama(town) {
  const model = buildTownMapModel(town, { layoutLawVersion: 2 });
  if (!hasDrawableMap(model)) {
    console.error('[cnocby-candidates] panorama: the fixture town has no drawable map — cannot emit.');
    process.exit(1);
  }
  const svg = buildTownMapPanoramaSvg(model, { style: dressedStyle('parchment'), width: 720, height: 720 });
  return `${panoramaProvenance(town)}\n${svg}`;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  const town = replayFixtureTown();

  // ── THE DRIFT GATE ─────────────────────────────────────────────────────────
  if (town.name !== fixture.town.name || town.population !== fixture.town.population) {
    console.error(
      `[cnocby-candidates] DRIFT: replaying seed ${fixture.seed} produced `
      + `"${town.name}" (pop ${town.population}) but the committed fixture froze `
      + `"${fixture.town.name}" (pop ${fixture.town.population}). The engine has moved `
      + `since the fixture was emitted — re-emit the fixture (ONE-REGEN batch) before `
      + `regenerating candidates.`,
    );
    process.exit(1);
  }

  let stale = 0;
  for (const layout of LAYOUTS) {
    const model = buildTownMapModel(town, { layoutLawVersion: layout.layoutLawVersion });
    if (!hasDrawableMap(model)) {
      console.error(`[cnocby-candidates] ${layout.id}: the fixture town has no drawable map — cannot emit.`);
      process.exit(1);
    }
    if (Number(model.layoutLawVersion) !== layout.layoutLawVersion) {
      console.error(`[cnocby-candidates] ${layout.id}: expected layoutLawVersion ${layout.layoutLawVersion}, got ${model.layoutLawVersion}.`);
      process.exit(1);
    }
    const bounds = contentBounds(model);
    if (!bounds) {
      console.error(`[cnocby-candidates] ${layout.id}: no content coordinates in the model — cannot crop.`);
      process.exit(1);
    }
    const crop = cropBox(bounds);

    for (const styleId of PLATE_STYLES) {
      const plate = `${provenanceComment(styleId, layout, town, crop)}\n${renderPlate(model, styleId, crop)}`;
      const file = join(OUT_DIR, candidateFileName(styleId, layout.id));
      if (checkOnly) {
        const committed = existsSync(file) ? readFileSync(file, 'utf8') : null;
        if (committed !== plate) {
          console.error(`[cnocby-candidates] STALE: ${file} does not match the replayed render.`);
          stale += 1;
        }
        continue;
      }
      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(file, plate);
      console.log(`[cnocby-candidates] emitted → ${file} (${plate.length} bytes, ${layout.label}, crop ${crop.side}×${crop.side} @ ${crop.x0},${crop.y0})`);
    }
  }

  // ── THE PANORAMA VARIANT (owner's 2.5D taste look) ─────────────────────────
  {
    const plate = renderPanorama(town);
    const file = join(OUT_DIR, panoramaFileName());
    if (checkOnly) {
      const committed = existsSync(file) ? readFileSync(file, 'utf8') : null;
      if (committed !== plate) {
        console.error(`[cnocby-candidates] STALE: ${file} does not match the replayed render.`);
        stale += 1;
      }
    } else {
      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(file, plate);
      console.log(`[cnocby-candidates] emitted → ${file} (${plate.length} bytes, townPanorama oblique 2.5D, parchment illustrated-dress)`);
    }
  }

  if (checkOnly) {
    if (stale > 0) process.exit(1);
    console.log('[cnocby-candidates] check OK — candidates match the replayed fixture town.');
  }
}

main();
