// K2-3 PROOF on every birth: (A) the DM's edits of both homes made through applyUserEdit, the town renamed by its writer,
// then each edit reverted; (B) an AI copy (the record itself as aiSettlement, its arrival as daily life) renamed by the
// slice's own town rule (applyTownRenameToAiData over townNameRewrite of the renamed record).
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { renameTownInRecord, townNameRewrite } from 'TREE/src/domain/townRename.js';
import { applyUserEdit, revertUserEdit } from 'TREE/src/domain/userEdits.js';
import { applyTownRenameToAiData } from 'TREE/src/lib/narrativeMutations.js';
import { appendFileSync } from 'node:fs';
const NEW = 'Quillmarsh'; const HOMES = ['arrivalScene', 'pressureSentence'];
const clone = (v) => JSON.parse(JSON.stringify(v));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const names = (s) => [...(s.npcs || []).map((n) => n?.name), ...(s.institutions || []).map((i) => i?.name), ...(s.powerStructure?.factions || []).flatMap((f) => [f?.faction, f?.name])].filter((x) => typeof x === 'string' && x);
const count = (hay, needle) => hay.split(needle).length - 1;
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    let line;
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const old = born.name; const re = new RegExp(`(?<![\\p{L}\\p{N}\\p{M}_])${esc(old)}(?![\\p{L}\\p{N}\\p{M}_])`, 'u');
      const plain = renameTownInRecord(clone(born), old, NEW);
      const ed = clone(born); const typed = {};
      for (const h of HOMES) { if (typeof ed[h] !== 'string') continue; typed[h] = `${old}, as the DM wrote it (${h}).`; applyUserEdit(ed, h, typed[h], { editedAt: '2026-01-01T00:00:00.000Z' }); }
      const r = renameTownInRecord(ed, old, NEW);
      const A = { homes: 0, fieldMoved: 0, valueMoved: 0, originalWrong: 0, revertWrong: 0, revertOld: 0, engineHeldName: 0 };
      for (const h of Object.keys(typed)) { A.homes++;
        if (r[h] !== typed[h]) A.fieldMoved++; if (r._userEdits[h].value !== typed[h]) A.valueMoved++;
        if (r._userEdits[h].originalValue !== plain[h]) A.originalWrong++; if (re.test(born[h])) A.engineHeldName++;
        const back = clone(r); revertUserEdit(back, h); if (back[h] !== plain[h]) A.revertWrong++; if (re.test(back[h])) A.revertOld++; }
      const ai = { aiSettlement: clone(born), aiDailyLife: { arrival: born.arrivalScene || '' } };
      const nai = applyTownRenameToAiData(ai, old, NEW, townNameRewrite(plain, old, NEW));
      const B = { nameFieldsMoved: 0, otherNameCountMoved: 0, homesDiffer: 0, oldLeftInHomes: 0 };
      const a0 = names(ai.aiSettlement); const a1 = names(nai.aiSettlement);
      B.nameFieldsMoved = a0.filter((n, i) => n !== a1[i]).length;
      const j0 = JSON.stringify(ai.aiSettlement); const j1 = JSON.stringify(nai.aiSettlement);
      for (const n of new Set(names(born))) if (count(j0, n) !== count(j1, n)) B.otherNameCountMoved++;
      for (const h of HOMES) if (typeof plain[h] === 'string' && nai.aiSettlement[h] !== plain[h]) B.homesDiffer++;
      for (const h of HOMES) if (typeof nai.aiSettlement[h] === 'string' && re.test(nai.aiSettlement[h]) && !names(born).some((n) => n.includes(old))) B.oldLeftInHomes++;
      line = { seed: row.seed, size: row.size, A, B };
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 800) }; }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
  }
}
