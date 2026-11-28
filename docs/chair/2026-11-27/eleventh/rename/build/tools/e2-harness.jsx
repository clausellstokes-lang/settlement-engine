// RENAME-BUILD's E/D harness: one tree's owner pages over a plan (every tab walked + the non-DOM surfaces, picks
// logged), the born record's hash (RECORDS MOVE 0), and, with opts.renames on the first N rows, the town (T) and
// person (P) renames by the product's own writers (rename-harness.jsx :: renames) and the shared page of base and T.
import { ownerPage, sharePage, renames } from './rename-harness.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const stamp = (t) => withPublicProse(t, composePublicProse(t));
function diffViews(a, b) { const d = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) { const A = new Set(a[k] || []); const B = new Set(b[k] || []); const gone = [...A].filter((l) => !B.has(l)); const came = [...B].filter((l) => !A.has(l)); if (gone.length || came.length) d[k] = { gone, came }; } return d; }
export async function run(plan, out) {
  await loadGenerationLawPayloads();
  const N = Number(process.env.RENAMES_FIRST || 0);
  for (const row of plan) {
    let line; const t0 = Date.now();
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const birth = createHash('sha1').update(JSON.stringify(born)).digest('hex');
      const t = stamp(born);
      const stampHash = createHash('sha1').update(JSON.stringify(t.publicProse ?? null)).digest('hex');
      const P = await ownerPage(t);
      line = { seed: row.seed, size: row.size, id: born.id, name: born.name, birth, stampHash, views: P.views, picks: P.picks };
      if (row.idx < N) {
        const rn = renames(born); const vars = {};
        for (const k of ['T', 'P']) {
          const v = rn[k]; if (!v || v.skip) { vars[k] = { skip: v?.skip || 'none' }; continue; }
          const O = await ownerPage(stamp(v.rec));
          vars[k] = { old: v.old, neu: v.neu, how: v.how, diff: diffViews(P.views, O.views), picks: O.picks };
          if (k === 'T') { const S0 = await sharePage(t); const S1 = await sharePage(stamp(v.rec)); vars.T.ownerVsShare = diffViews(O.views, S1.views); vars.T.baseOwnerVsShare = diffViews(P.views, S0.views); vars.T.shareDiff = diffViews(S0.views, S1.views); vars.T.sharePicks = S1.picks; }
        }
        line.vars = vars;
      }
    } catch (e) { line = { seed: row.seed, error: String(e?.stack || e).slice(0, 1500) }; }
    line.ms = Date.now() - t0;
    appendFileSync(out, `${JSON.stringify(line)}\n`);
    console.log(row.seed, line.ms);
  }
}
