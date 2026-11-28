// K1b PROOF over 1,800 births: K1 tree (no cure) against the K1b tree, per birth, the founding set (f), the shown set and
// the shared rows, as born (0.10.0), re-stamped 0.9.0, stampless, and the JSON-imported copy (`_seed` dropped)
import { readFileSync } from 'node:fs';
const W = '/home/user/scratch/work';
const load = (f) => new Map(readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).map((j) => [j.seed, j]));
const same = (a, b) => a.f === b.f && a.shown === b.shown && a.shared === b.shared;
for (const C of ['C', 'V']) {
  const A = load(`${W}/TS-K1-${C}.jsonl`); const B = load(`${W}/TS-K1b-${C}.jsonl`);
  const R = { births: 0, missing: 0, notGv10: 0, mirrorAtBirth: 0, oldDiffers: 0, bareDiffers: 0, bornFoundingMoved: 0, bornShownMoved: 0, bornSharedMoved: 0,
    copyIsOwnerK1: 0, copyIsOwnerK1b: 0, sharedErr: 0, ex: [] };
  for (const [seed, a] of A) { const b = B.get(seed); if (!b) { R.missing++; continue; } R.births++;
    if (b.gv !== '0.10.0') R.notGv10++; if (b.mirror != null) R.mirrorAtBirth++;
    if (!same(a.old, b.old)) { R.oldDiffers++; if (R.ex.length < 5) R.ex.push(`${seed} old`); }
    if (!same(a.bare, b.bare)) { R.bareDiffers++; if (R.ex.length < 5) R.ex.push(`${seed} bare`); }
    if (a.born.f !== b.born.f) R.bornFoundingMoved++; if (a.born.shown !== b.born.shown) R.bornShownMoved++; if (a.born.shared !== b.born.shared) R.bornSharedMoved++;
    if (same(a.copy, a.born)) R.copyIsOwnerK1++; if (same(b.copy, b.born)) R.copyIsOwnerK1b++; else if (R.ex.length < 5) R.ex.push(`${seed} copy!=owner on K1b`);
    if (String(b.born.shared).startsWith('ERR')) R.sharedErr++; }
  console.log(C, JSON.stringify({ ...R, ex: undefined }), R.ex.join(' | '));
}
