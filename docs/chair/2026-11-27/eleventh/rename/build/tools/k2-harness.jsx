// K2 PROOF: on each birth, the owner's page (every tab + non-DOM surfaces), the page after the town's rename by the
// product's own writer (domain/townRename.js :: renameTownInRecord, as renameSettlementImpl now writes it), and after a
// rename back; the record-level checks (every other stored name unchanged; a rename back byte for byte).
import { ownerPage } from './rename-harness.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { renameTownInRecord } from 'TREE/src/domain/townRename.js';
import { appendFileSync } from 'node:fs';
const NEW = 'Quillmarsh';
const stamp = (t) => withPublicProse(t, composePublicProse(t));
const clone = (v) => JSON.parse(JSON.stringify(v));
function diffViews(a, b) { const d = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const A = new Set(a[k] || []); const B = new Set(b[k] || []); const gone = [...A].filter((l) => !B.has(l)); const came = [...B].filter((l) => !A.has(l)); if (gone.length || came.length) d[k] = { gone, came }; } return d; }
const namesOf = (s) => JSON.stringify([(s.npcs || []).map((n) => n?.name), (s.institutions || []).map((i) => i?.name), (s.powerStructure?.factions || []).map((f) => [f?.faction, f?.name]), (s.spatialLayout?.quarters || []).map((q) => q?.name)]);
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let line; const t0 = Date.now();
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const B = await ownerPage(stamp(born));
      const renamed = renameTownInRecord(clone(born), born.name, NEW);
      const T = await ownerPage(stamp(renamed));
      const back = renameTownInRecord(clone(renamed), NEW, born.name);
      const R = await ownerPage(stamp(back));
      line = { seed: row.seed, size: row.size, name: born.name, views: B.views,
        vars: { T: { old: born.name, neu: NEW, diff: diffViews(B.views, T.views), picks: T.picks } },
        backDiff: diffViews(B.views, R.views), recordBack: JSON.stringify(back) === JSON.stringify(born), otherNamesSame: namesOf(renamed) === namesOf(born) };
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 1500) }; }
    line.ms = Date.now() - t0;
    appendFileSync(out, `${JSON.stringify(line)}\n`);
    console.log(row.seed, line.ms);
  }
}
