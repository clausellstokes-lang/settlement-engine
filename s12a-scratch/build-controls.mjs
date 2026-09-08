// Builds the positive-control pair files. Every BEFORE is pulled VERBATIM from the loaded corpus
// (or from the illustration fixture) — never retyped — and every synthetic AFTER that only cuts text
// is produced by a string replace on that BEFORE, so no transcription can drift.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = process.argv[2], OUT = process.argv[3], OUT2 = process.argv[4];
const corpus = [];
const gdir = path.join(D, 'src/data/dossierStateProse');
for (const f of readdirSync(gdir).filter(f => f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir, f)).href); const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) for (const [pool, vs] of Object.entries(b.pools || {})) for (const v of vs)
    corpus.push({ text: v.text, block, pool, angle: v.angle || '' });
}
{ const mod = await import(pathToFileURL(path.join(D, 'src/data/dossierCausalProse.generated.js')).href); const table = Object.values(mod)[0];
  const walk = (o, key) => { if (Array.isArray(o)) { for (const v of o) if (v && typeof v.text === 'string') corpus.push({ text: v.text, block: 'CAUSAL', pool: key, angle: v.angle || '' }); }
    else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, k); };
  walk(table, 'CAUSAL'); }
const pick = (block, pool, angle) => { const hits = corpus.filter(c => c.block === block && c.pool === pool && c.angle === angle);
  if (hits.length !== 1) throw new Error(`locator ${block}/${pool}/${angle} matched ${hits.length}`); return hits[0].text; };
const pickBy = frag => { const hits = corpus.filter(c => c.text.includes(frag)); if (hits.length !== 1) throw new Error(`fragment "${frag}" matched ${hits.length}`); return hits[0].text; };
const cut = (t, frag) => { if (!t.includes(frag)) throw new Error(`cut fragment absent: ${frag}`); return t.replace(frag, ''); };

const ill = JSON.parse(readFileSync(path.join(path.dirname(OUT), 'pairs-illustration-2026-09-05.json'), 'utf8'));
const before = id => ill.find(p => p.id === id).before;

// ── ctl-1..ctl-5: the refuter's five PROPOSED CURES (refute-illustration-2026-09-05.md, last column) ──
const cures = [
  { id: 'ctl-1', of: 'ill-1', after: '{settlement} is getting by on not being tested. The margin narrows, and nothing in hand is closing it.',
    contrastWaived: 'refuter, ill-1: "widening" names neither readiness STRONG/ADEQUATE/CRITICAL nor terrain/strategic value — no sibling key or band names the rejected alternative (A8).' },
  { id: 'ctl-2', of: 'ill-2', after: '{settlement} sits open. No ground here helps the town, and everything it has must be built rather than found.' },
  { id: 'ctl-3', of: 'ill-3', after: 'The town believes it could hold against the usual trouble. It claims no more, and that is a fair reading of what it has.' },
  { id: 'ctl-4', of: 'ill-4', after: '{settlement} has a line and professionals to hold it, and that is real deterrence against raiding and a conventional assault. The posture is not rated for a long siege without stores behind it.' },
  { id: 'ctl-5', of: 'ill-5', after: 'The town has no hill and no narrows, does not pretend otherwise, and what {settlement} holds it holds by standing on it.' },
];
const out = cures.map(c => { const o = { id: c.id, note: `the refuter's proposed cure for ${c.of}`, before: before(c.of), after: c.after };
  if (c.contrastWaived) o.contrastWaived = c.contrastWaived; return o; });

// ── ctl-6: a contrast CUT in a pool with NO sibling bands (a causal pool; siblings are [] by construction) — must PASS
const b6 = pickBy('the older one keeps its feasts on a narrower');
out.push({ id: 'ctl-6', note: 'synthetic: a contrast cut in a pool WITHOUT sibling bands (causal) — must PASS', before: b6, after: cut(b6, ' rather than with any preaching') });
// ── ctl-7: an AFTER that ADDS a shared two-word opener inside its pool — must FAIL on A11
const b7 = pick('DS-DEF-1', 'terrain EXPOSED', 'ledger');
out.push({ id: 'ctl-7', note: 'synthetic: the AFTER opens "The town", colliding with the [street] variant of the same pool — must FAIL', before: b7,
  after: 'The town gets nothing defensively from the site {settlement} sits on. Every advantage it holds is one it has paid for.' });
// ── ctl-8: a contrast cut whose rejected alternative names a word of a SIBLING BAND's own text — must be WITHHELD, with the R4-BAND-TEXT line
const b8 = pick('DS-DEF-1', 'strategic value LOW', 'counterforce');
out.push({ id: 'ctl-8', note: 'synthetic: the cut alternative ("anything on its walls") names a word of a sibling band\'s TEXT — must be WITHHELD and name it', before: b8, after: cut(b8, ' rather than anything on its walls') });

writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n');
// the same file with ctl-1's waiver REMOVED, so the raw behaviour of the R4-BAND arm is visible too
const nw = JSON.parse(JSON.stringify(out)); delete nw.find(p => p.id === 'ctl-1').contrastWaived;
writeFileSync(OUT2, JSON.stringify(nw, null, 1) + '\n');
console.log(`wrote ${OUT} (${out.length} pairs) and ${OUT2} (ctl-1 waiver removed)`);
