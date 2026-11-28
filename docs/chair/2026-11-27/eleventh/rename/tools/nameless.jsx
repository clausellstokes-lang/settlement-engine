// (C) §5: a town saved NAMELESS. (1) the JSON import of an export whose settlement.name is '' (or '  ', or absent);
// (2) the owner's page of ten nameless towns of C, every tab walked, picks logged: what each name key does.
import { ownerPage } from './rename-harness.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { buildAccountExport } from 'TREE/src/lib/accountData.js';
import { validateAccountImport, prepareSettlementEntry, ensureNormalizeLoaded } from 'TREE/src/lib/accountImport.js';
import { saves } from 'TREE/src/lib/saves.js';
import { appendFileSync } from 'node:fs';
const clone = (v) => JSON.parse(JSON.stringify(v));
export async function run(plan, out) {
  await loadGenerationLawPayloads(); await ensureNormalizeLoaded();
  for (const row of plan) {
    const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
    const res = { seed: row.seed, name: born.name, imports: {} };
    for (const [label, nm] of [['empty', ''], ['blank', '   '], ['absent', undefined]]) {
      try {
        const s = clone(born); if (nm === undefined) delete s.name; else s.name = nm;
        const exp = buildAccountExport({ auth: { user: { id: 'u', email: null } }, savedSettlements: [{ id: 'l1', name: nm ?? '', tier: born.tier, settlement: s, config: null, seed: null, aiData: {}, campaignState: { phase: 'draft', eventLog: [] }, versionHistory: [] }], campaigns: [], customContent: {} });
        const v = validateAccountImport(typeof exp === 'string' ? exp : JSON.stringify(exp));
        if (!v.ok) { res.imports[label] = { refused: v.reason || 'validate' }; continue; }
        const p = prepareSettlementEntry(v.value.settlements[0], {});
        if (!p.ok) { res.imports[label] = { refused: p.reason }; continue; }
        try { globalThis.localStorage.clear(); } catch { /* */ }
        const id = await saves.save(p.entry); const back = (await saves.list()).find((e) => String(e.id) === String(id));
        res.imports[label] = { rowName: back?.name, settlementName: back?.settlement?.name === undefined ? '(absent)' : JSON.stringify(back?.settlement?.name) };
      } catch (e) { res.imports[label] = { error: String(e).slice(0, 200) }; }
    }
    const nameless = { ...clone(born), name: '' };
    const P = await ownerPage(withPublicProse(nameless, composePublicProse(nameless)));
    res.views = P.views; res.picks = P.picks;
    appendFileSync(out, `${JSON.stringify(res)}\n`);
    console.log(row.seed);
  }
}
