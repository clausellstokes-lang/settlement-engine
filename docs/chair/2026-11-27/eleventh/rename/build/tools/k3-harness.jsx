// K3 MEASURE: on each birth, the owner's page, and the page after a POWER's rename (applyFactionRenameToSettlement, the product's
// own action) and a HOUSE's rename (applyInstitutionRenameToSettlement, the one writer; no UI). Every kind-classifier call is
// logged (reader, call site, the entity's name, the verdict), so a page's moved lines are put down to the readers whose verdict
// on the renamed entity changed.
import { ownerPage, renames } from './rename-harness.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { appendFileSync } from 'node:fs';
const stamp = (t) => withPublicProse(t, composePublicProse(t));
function diffViews(a, b) { const d = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const A = new Set(a[k] || []); const B = new Set(b[k] || []); const gone = [...A].filter((l) => !B.has(l)); const came = [...B].filter((l) => !A.has(l)); if (gone.length || came.length) d[k] = { gone, came }; } return d; }
async function page(t) { globalThis.__kinds = []; const P = await ownerPage(stamp(t)); const k = [...new Set(globalThis.__kinds)]; globalThis.__kinds = null; return { views: P.views, kinds: k }; }
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let line; const t0 = Date.now();
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const B = await page(born);
      const rn = renames(born); const vars = {};
      for (const k of ['H', 'F']) { const v = rn[k]; if (!v || v.skip) { vars[k] = { skip: v?.skip || 'none' }; continue; }
        const O = await page(v.rec); vars[k] = { old: v.old, neu: v.neu, diff: diffViews(B.views, O.views), kinds: O.kinds }; }
      const f0 = (born.powerStructure?.factions || [])[0]; const h0 = (born.institutions || []).find((i) => i?.name);
      line = { seed: row.seed, size: row.size, name: born.name, views: B.views, kinds: B.kinds, vars,
        stored: { power: f0 ? { category: f0.category ?? null, archetype: f0.archetype ?? null, type: f0.type ?? null } : null, house: h0 ? { category: h0.category ?? null, catalogId: h0.catalogId ?? null, tags: h0.tags ?? null, facets: h0.facets ?? null } : null } };
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 1500) }; }
    line.ms = Date.now() - t0;
    appendFileSync(out, `${JSON.stringify(line)}\n`);
    console.log(row.seed, line.ms);
  }
}
