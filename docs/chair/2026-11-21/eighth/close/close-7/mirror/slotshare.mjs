// THE MIRROR (CLOSE-7): the fare's and Dawn Work's commonest-sentence share by size, before and after, from food-of's
// per-birth texts. share = places printing the slot's commonest sentence / places of the size (150); a slot's text is one
// sentence. node slotshare.mjs <before.jsonl> <after.jsonl>
import { readFileSync } from 'node:fs';
const [B, A] = process.argv.slice(2);
const load = (f) => readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const SZ = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const top = (rows, k) => { const m = new Map(); for (const r of rows) if (r[k]) m.set(r[k], (m.get(r[k]) || 0) + 1);
  const [s, n] = [...m.entries()].sort((a, b) => b[1] - a[1])[0] || ['', 0]; return { n, of: rows.length, s }; };
const b = load(B), a = load(A);
console.log(['size', 'slot', 'before', 'after', 'commonest before', 'commonest after'].join('\t'));
for (const size of SZ) for (const k of ['food_culture', 'dawn_work']) {
  const x = top(b.filter((r) => r.size === size), k), y = top(a.filter((r) => r.size === size), k);
  console.log([size, k, `${x.n}/${x.of} ${(x.n / x.of).toFixed(3)}`, `${y.n}/${y.of} ${(y.n / y.of).toFixed(3)}`, x.s.slice(0, 60), y.s.slice(0, 60)].join('\t'));
}
