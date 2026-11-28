// K1b PROOF: the first 150 births of C and V, page against page, K1 tree (E2-k1) against the K1b tree (E2-k1b): the record
// (sha1 of the born record: NO BIRTH MAY MOVE) and every moved line, by view (nothing outside the traditions may move)
import { createReadStream } from 'node:fs';
import readline from 'node:readline';
const load = async (f) => { const m = new Map(); const rl = readline.createInterface({ input: createReadStream(f), crlfDelay: Infinity }); for await (const l of rl) { if (!l) continue; const j = JSON.parse(l); m.set(j.seed, j); } return m; };
for (const C of ['C', 'V']) {
  const B = await load(`/home/user/scratch/work/E2-k1b-${C}.jsonl`); const A = await load(`/home/user/scratch/work/E2-k1-${C}.jsonl`);
  const R = { births: 0, errors: 0, recordsMoved: 0, stampsMoved: 0, pagesMoved: 0, linesMoved: 0, byView: {}, pagesByView: {}, ex: {} };
  for (const [seed, b] of B) { const a = A.get(seed); if (!a || a.error || b.error) { R.errors++; continue; } R.births++;
    if (a.birth !== b.birth) R.recordsMoved++; if (a.stampHash !== b.stampHash) R.stampsMoved++;
    let moved = 0;
    for (const v of new Set([...Object.keys(a.views), ...Object.keys(b.views)])) { const X = new Set(a.views[v] || []); const Y = new Set(b.views[v] || []);
      const gone = [...X].filter((l) => !Y.has(l)); const came = [...Y].filter((l) => !X.has(l)); const n = gone.length + came.length;
      if (n) { R.byView[v] = (R.byView[v] || 0) + n; R.pagesByView[v] = (R.pagesByView[v] || 0) + 1; moved += n; (R.ex[v] ||= []).length < 2 && R.ex[v].push(`${seed}: -${(gone[0] || '').slice(0, 110)} | +${(came[0] || '').slice(0, 110)}`); } }
    if (moved) R.pagesMoved++; R.linesMoved += moved; }
  console.log(`== ${C}`, JSON.stringify({ births: R.births, errors: R.errors, recordsMoved: R.recordsMoved, stampsMoved: R.stampsMoved, pagesMoved: R.pagesMoved, linesMoved: R.linesMoved }));
  console.log('  lines by view', JSON.stringify(R.byView)); console.log('  pages by view', JSON.stringify(R.pagesByView));
  for (const [v, e] of Object.entries(R.ex)) console.log(`  ${v}: ${e.join(' || ')}`);
}
