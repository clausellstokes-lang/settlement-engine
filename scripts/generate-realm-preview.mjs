/**
 * scripts/generate-realm-preview.mjs — THE REALM PREVIEW PLATES (W7, the walk order:
 * "the home crossroad image becomes a generated realm map with settlements").
 *
 * Freezes deterministic REALM-scale map plates for the landing hero, the regional twin of
 * the town-map waypoint plates (generate-landing-map-plates.mjs). Where those depict ONE
 * settlement, these depict a whole seeded realm — a coastline, its settlements scaled by
 * tier, and the road web that ties them together — rendered by the pure, headless
 * src/domain/realmMap/realmPlateRenderer.js (worldPlan → primitive draw ops → drawListToSvg,
 * the SAME vocabulary + serializer the town map uses; never a parallel emitter).
 *
 * WHY CANDIDATES (not one canonical): town-layout-v2's fold idiom — several seeds × the two
 * house lenses are emitted so the manager/owner PICK the landing hero from real output; W7
 * never promotes a winner (the walk order is owner-gated). Each plate is a decision
 * candidate, self-documented by its provenance stamp (seed · lens · map kind · size).
 *
 * DETERMINISM: same (seed, lens) ⇒ byte-identical SVG (the renderer is pure — no Date, no
 * Math.random, no trig; seeded off the plan via createPRNG). Run twice + cmp is byte-clean.
 *
 * Usage (plain node — the src import chain is node-ESM runnable as-is):
 *   node scripts/generate-realm-preview.mjs           # emit the candidates
 *   node scripts/generate-realm-preview.mjs --check   # verify only (exit 1 if stale)
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderRealmPlate } from '../src/domain/realmMap/realmPlateRenderer.js';
import { slugify } from '../src/kernel/slugify.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'landing-maps');

// The candidate seeds — chosen for a spread of resolved map kinds (highIsland / volcano /
// lowIsland → more/fewer mountains, rougher/smoother coast). The realm size is the
// deterministic default (medium: a city + 8 tier-mixed members), so every candidate carries
// a full realm the manager can judge. Add/remove a seed freely — nothing here is canonical.
const SEEDS = Object.freeze(['fallowmere', 'cindermere', 'holloway']);

// The two house lenses (mirrors generate-landing-map-plates.mjs PLATE_STYLES). The realm
// renderer reads each resolved style's palette/opacity/stroke exactly like the town draw.
const STYLES = Object.freeze(['parchment', 'watercolor']);

function realmFileName(seed, styleId) {
  return `realm-preview.${slugify(seed)}.${styleId}.svg`;
}

/** The provenance comment stamped into each realm plate (self-documenting for the fold pick). */
function provenanceComment(seed, styleId, plan, scene) {
  return `<!-- settlementforge realm preview CANDIDATE (W7 realm renderer) · seed ${seed}`
    + ` · style ${styleId} · realm ${plan.realmSize} · map kind ${plan.mapKind}`
    + ` · ${scene.sites.length} settlements · ${scene.roads.length} roads`
    + ` · src/domain/realmMap/realmPlateRenderer.js (deterministic, headless) -->`;
}

function main() {
  const checkOnly = process.argv.includes('--check');
  let stale = 0;

  for (const seed of SEEDS) {
    for (const styleId of STYLES) {
      const { svg, plan, scene } = renderRealmPlate({ seed, styleId });
      const plate = `${provenanceComment(seed, styleId, plan, scene)}\n${svg}`;
      const file = join(OUT_DIR, realmFileName(seed, styleId));
      if (checkOnly) {
        const committed = existsSync(file) ? readFileSync(file, 'utf8') : null;
        if (committed !== plate) {
          console.error(`[realm-preview] STALE: ${file} does not match the deterministic render.`);
          stale += 1;
        }
        continue;
      }
      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(file, plate);
      console.log(`[realm-preview] emitted → ${file} (${plate.length} bytes, ${plan.mapKind}, ${scene.sites.length} settlements)`);
    }
  }

  if (checkOnly) {
    if (stale > 0) process.exit(1);
    console.log('[realm-preview] check OK — realm plates match the deterministic render.');
  }
}

main();
