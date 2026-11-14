import fs from 'node:fs';
const TREE = process.env.TREE;
const C = JSON.parse(fs.readFileSync(process.env.CLASSIFIED || 'probe/classified-base.json', 'utf8'));
const U = JSON.parse(fs.readFileSync('probe/unreached-measure.json', 'utf8'));
const W = await import(`${TREE}/src/domain/facts/registeredWords.js`);
const variants = [];
for (const d of ['economy', 'defense', 'general', 'power', 'stressors', 'warFaith']) {
  const m = await import(`${TREE}/src/data/dossierStateProse/${d}.generated.js`);
  for (const c of Object.values(m)) for (const [b, blk] of Object.entries(c)) for (const [k, pool] of Object.entries(blk.pools)) for (const v of pool) {
    const frags = v.text.split(/\{[a-zA-Z_]+\}/).map((x) => x.trim()).filter((x) => x.length >= 8);
    variants.push({ pool: `${b}::${k}`, vid: v.vid, text: v.text, marks: v.marks || [], frags });
  }
}
const rows = new Map();
// every finding whose sentence is a corpus variant's (a sentence of its static text, 20 characters or more), whatever the attribution said
for (const f of C.filter((x) => x.class === 'F')) {
  const v = variants.find((x) => x.frags.some((fr) => W.sentencesOf(fr).some((sen) => sen.length >= 20 && f.quote.includes(sen))));
  if (!v) continue;
  const key = `${v.pool}#v${v.vid}#${f.word}`;
  const r = rows.get(key) || { kind: 'printed false on the 720', pool: v?.pool, vid: v?.vid, word: f.word, pattern: f.pattern, disqualifier: W.REGISTERED_WORDS[f.word].atoms, towns: new Set(), example: f.quote, text: v?.text, marks: v?.marks };
  r.towns.add(f.seed); rows.set(key, r);
}
const out = [...rows.values()].map((r) => ({ ...r, towns: r.towns.size }));
for (const h of U.hits) out.push({ kind: 'unreached by the 720; names a registered word its declaration does not answer (read: key-implied unless shown otherwise)', pool: h.pool, vid: h.vid, word: h.word, disqualifier: W.REGISTERED_WORDS[h.word].atoms, layer: h.layer, text: h.text });
const doc = {
  _doc: [
    'W2-B-DECLARE item 2 — THE CORPUS\'S SHARE of the page measure by vocabulary, handed to W2-WRITE (which alone edits docs/content/RECEIPT_POOLS_DOSSIER_STATE.md and runs its generator).',
    'Each row: a corpus variant (block::pool, vid) that names a registered word (src/domain/facts/registeredWords.js) and carries no declaration that answers it. `disqualifier` lists the atoms any one of which, declared on the variant (its tag slot) or on the pool (its brace group), answers the word; a word ending in ":" is any band of that dimension.',
    'kind "printed false on the 720": the census\'s 720 owner-view dossiers printed it in a town the word is false for (towns = how many). kind "unreached": a pool no rendered page of the 720 asked for; the measure is static.',
    'Measured at the lane base 1930cec6e (+ the walker change e0f2bd58e, tests only). Scripts: docs/chair/2026-11-12/probes/W2-B-DECLARE/.',
  ],
  rows: out,
};
fs.writeFileSync(process.argv[2], JSON.stringify(doc, null, 1));
console.log(out.length, 'rows;', out.filter((r) => r.kind.startsWith('printed')).map((r) => `${r.pool} v${r.vid} ${r.word} ${r.towns}`).join(' · '));
