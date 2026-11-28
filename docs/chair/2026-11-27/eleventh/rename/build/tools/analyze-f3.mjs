// K2 PROOF (ii) and (iii): after the town's rename, the stored leaves still holding the old name (by path), the receipt; and the
// shared page of a renamed town re-saved (stamp composed after) against a share whose stamp was composed BEFORE the rename
import { readFileSync } from 'node:fs';
const fold = (p) => p.replace(/\[\d+\]/g, '[]');
for (const C of ['C', 'V']) {
  const L = readFileSync(`/home/user/scratch/work/F3-${C}.jsonl`, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const R = { births: 0, errors: 0, townsLeft: 0, leftByPath: {}, receiptChanged: 0, shared: 0, freshPages: 0, freshLines: 0, freshStamp: 0, stalePages: 0, staleLines: 0, staleStamp: 0, staleByView: {}, ex: [] };
  for (const j of L) { if (j.error) { R.errors++; continue; } R.births++;
    if (j.left.length) R.townsLeft++; for (const p of j.left) R.leftByPath[fold(p)] = (R.leftByPath[fold(p)] || 0) + 1;
    if (!j.receiptSame) R.receiptChanged++;
    if (j.freshShare) { R.shared++; if (j.freshShare.length) { R.freshPages++; R.freshLines += j.freshShare.length; if (R.ex.length < 4) R.ex.push(`${j.seed} FRESH ${j.freshShare[0]}`); } if (j.freshStampHolds) R.freshStamp++;
      if (j.staleShare.length) { R.stalePages++; R.staleLines += j.staleShare.length; for (const x of j.staleShare) { const v = x.split(':')[0]; R.staleByView[v] = (R.staleByView[v] || 0) + 1; } } if (j.staleStampHolds) R.staleStamp++; } }
  console.log(`== ${C}`, JSON.stringify({ ...R, ex: undefined })); if (R.ex.length) console.log('  ', R.ex.join('\n   '));
}
