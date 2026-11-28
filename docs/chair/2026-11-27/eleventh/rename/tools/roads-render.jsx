// (B) by render: the owner's page of a town against the owner's page of its copy after the JSON import (R2) and the
// gallery import (R4), each the road's own record (roads-harness.jsx's transforms), every tab walked, picks logged.
import { ownerPage } from './rename-harness.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { toPublicSafe, veilPublicPayload } from 'TREE/src/domain/display/publicSafe.js';
import { buildAccountExport } from 'TREE/src/lib/accountData.js';
import { validateAccountImport, prepareSettlementEntry, ensureNormalizeLoaded } from 'TREE/src/lib/accountImport.js';
import { normalizeSettlement } from 'TREE/src/domain/normalizeSettlement.js';
import { scrubImportedConfig, scrubImportedTreasury, scrubGalleryImportLivingContent, scrubImportedEditState } from 'TREE/src/lib/importScrub.js';
import { appendFileSync } from 'node:fs';
const clone = (v) => JSON.parse(JSON.stringify(v));
function diffViews(a, b) { const d = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const A = new Set(a[k] || []); const B = new Set(b[k] || []); const gone = [...A].filter((l) => !B.has(l)); const came = [...B].filter((l) => !A.has(l)); if (gone.length || came.length) d[k] = { gone, came }; } return d; }
export async function run(plan, out) {
  await loadGenerationLawPayloads(); await ensureNormalizeLoaded();
  for (const row of plan) {
    const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const stamped = withPublicProse(born, composePublicProse(born));
    const entry = { name: born.name, tier: born.tier, settlement: clone(stamped), config: born._config || null, seed: born._seed || null, aiData: {}, campaignState: { phase: 'draft', eventLog: [] }, versionHistory: [], id: 'local-1' };
    const exp = buildAccountExport({ auth: { user: { id: 'u', email: null } }, savedSettlements: [entry], campaigns: [], customContent: {} });
    const v = validateAccountImport(typeof exp === 'string' ? exp : JSON.stringify(exp));
    const r2 = prepareSettlementEntry(v.value.settlements[0], { sourceName: 'export.json' }).entry.settlement;
    const data = toPublicSafe(clone(stamped), { full: false, memberOverrides: null });
    const o = { ...data }; delete o.seed; delete o._seed; delete o._config; if (o.config) { o.config = { ...o.config }; delete o.config._seed; }
    const s = veilPublicPayload({ id: 'r', name: born.name, tier: born.tier, settlement: o }).settlement;
    const r4 = scrubImportedEditState(scrubGalleryImportLivingContent(scrubImportedTreasury(normalizeSettlement({ ...s, neighbourNetwork: [], neighborRelationship: null, interSettlementRelationships: [], _seed: undefined, config: scrubImportedConfig(s.config), importedFrom: { slug: 'x', sourceName: born.name, importedAt: 'now' } }))));
    const B = await ownerPage(stamped);
    // each imported copy is then SAVED by the importer (saves.save), which re-stamps its shared page: stamp it as the save would
    const I2 = await ownerPage(withPublicProse(r2, composePublicProse(r2)));
    const I4 = await ownerPage(withPublicProse(r4, composePublicProse(r4)));
    appendFileSync(out, `${JSON.stringify({ seed: row.seed, name: born.name, base: B.views, basePicks: B.picks, R2: { diff: diffViews(B.views, I2.views), picks: I2.picks }, R4: { diff: diffViews(B.views, I4.views), picks: I4.picks } })}\n`);
    console.log(row.seed);
  }
}
