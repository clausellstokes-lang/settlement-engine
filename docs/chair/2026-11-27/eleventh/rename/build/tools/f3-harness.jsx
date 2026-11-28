// K2 PROOF (ii) and (iii): every birth renamed by the product's writer: the stored string leaves still holding the OLD name
// (whole word, any path), the generation receipt unchanged; and (first N rows) the SHARED page of the renamed town re-saved
// (its stamp composed after the rename) against the shared page whose stamp was composed BEFORE the rename (a share saved before).
import { sharePage } from './rename-harness.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { renameTownInRecord } from 'TREE/src/domain/townRename.js';
import { appendFileSync } from 'node:fs';
const NEW = 'Quillmarsh';
const clone = (v) => JSON.parse(JSON.stringify(v));
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  const N = Number(process.env.SHARE_FIRST || 0);
  let i = 0;
  for (const row of plan) {
    let line;
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const re = new RegExp(`(?<![\\p{L}\\p{N}\\p{M}_])${esc(born.name)}(?![\\p{L}\\p{N}\\p{M}_])`, 'u');
      const renamed = renameTownInRecord(clone(born), born.name, NEW);
      const left = []; const walk = (v, p) => { if (typeof v === 'string') { if (p !== 'name' && re.test(v)) left.push(p); } else if (Array.isArray(v)) v.forEach((x, k) => walk(x, `${p}[${k}]`)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, p ? `${p}.${k}` : k); };
      walk(renamed, '');
      line = { seed: row.seed, name: born.name, left, receiptSame: JSON.stringify(renamed.generationCoherenceReceipt ?? null) === JSON.stringify(born.generationCoherenceReceipt ?? null) };
      if (i < N) {
        const fresh = withPublicProse(renamed, composePublicProse(renamed));
        const stale = withPublicProse(renamed, composePublicProse(born));
        const S1 = await sharePage(fresh); const S0 = await sharePage(stale);
        const hits = (views) => Object.entries(views).flatMap(([v, ls]) => ls.filter((x) => re.test(String(x).replace(/&#39;/g, "'"))).map((x) => `${v}: ${x.slice(0, 160)}`));
        line.freshShare = hits(S1.views); line.freshStampHolds = re.test(JSON.stringify(fresh.publicProse));
        line.staleShare = hits(S0.views); line.staleStampHolds = re.test(JSON.stringify(stale.publicProse));
      }
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 800) }; }
    i++;
    appendFileSync(out, `${JSON.stringify(line)}\n`);
  }
}
