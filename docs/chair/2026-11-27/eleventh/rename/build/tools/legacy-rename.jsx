// (i) a LEGACY id-less record (no id, no _seed) through local save -> reload -> the store's rename (renameSettlementImpl) -> reload
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { saves } from 'TREE/src/lib/saves.js';
import { renameSettlementImpl } from 'TREE/src/store/settlementRenameHelpers.js';
import { appendFileSync } from 'node:fs';
const clone = (v) => JSON.parse(JSON.stringify(v));
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const legacy = clone(born); delete legacy.id; delete legacy._seed; if (legacy.config) delete legacy.config._seed; delete legacy._config;
    try { globalThis.localStorage.clear(); } catch { /* */ }
    const sid = await saves.save({ name: born.name, tier: born.tier, settlement: legacy, config: null, seed: null, aiData: {}, campaignState: { phase: 'draft', eventLog: [] }, versionHistory: [] });
    const state = { savedSettlements: await saves.list(), activeSaveId: null, settlement: null, phase: 'draft', eventLog: [], flushSuppressPersist: false };
    const id0 = state.savedSettlements.find((e) => String(e.id) === String(sid))?.settlement?.id;
    renameSettlementImpl(() => state, (fn) => fn(state), sid, 'Quillmarsh');
    await new Promise((r) => setTimeout(r, 200));
    const back = (await saves.list()).find((e) => String(e.id) === String(sid));
    const res = { seed: row.seed, idBeforeRename: id0, idAfterRenameReload: back?.settlement?.id, nameAfter: back?.settlement?.name, kept: id0 === back?.settlement?.id, storedHoldsIdNow: JSON.stringify(globalThis.localStorage).includes(String(id0)) };
    appendFileSync(out, `${JSON.stringify(res)}\n`);
  }
}
