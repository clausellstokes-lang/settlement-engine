import fs from 'node:fs';
const TREE = process.env.TREE;
const R = JSON.parse(fs.readFileSync('probe/reach.json', 'utf8'));
const L = JSON.parse(fs.readFileSync('layermap/results/layers.json', 'utf8')).rows;
const W = await import(`${TREE}/src/domain/facts/registeredWords.js`);
const V = await import(`${TREE}/src/domain/facts/factVocabulary.js`);
const { UNMOUNTED_BLOCKS } = await import(`${TREE}/src/domain/display/stateProse/dossierMounts.js`);
const blocks = {};
for (const d of ['economy', 'defense', 'general', 'power', 'stressors', 'warFaith']) {
  const m = await import(`${TREE}/src/data/dossierStateProse/${d}.generated.js`);
  for (const c of Object.values(m)) Object.assign(blocks, c);
}
const out = { world: [], unknown: [], dark: [], mountedUnhit: [] }; const hits = [];
for (const k of R.unreached) {
  const [b, pk] = [k.slice(0, k.indexOf('::')), k.slice(k.indexOf('::') + 2)];
  const layer = L[k]?.layer;
  const cls = layer === 'W' ? 'world' : UNMOUNTED_BLOCKS.includes(b) ? 'dark' : layer === '?' ? 'unknown' : 'mountedUnhit';
  out[cls].push(k);
  if (cls === 'world' || cls === 'dark') continue;
  const pool = blocks[b].pools[pk]; const meta = blocks[b].poolMeta?.[pk] || {};
  for (const v of pool) {
    const declared = [...(v.marks || []), ...(v.marks || []).map((m) => V.MARK_DIMENSION_ATOM[m.replace(/^no\s+/, '')]).filter(Boolean), ...(meta.declares || [])].map((w) => w.toLowerCase().replace(/^no\s+/, ''));
    for (const s of W.sentencesOf(v.text)) for (const id of [...W.thingsNamedIn(s), ...W.newWordsNamedIn(s)]) {
      const atoms = W.REGISTERED_WORDS[id].atoms.map((a) => a.toLowerCase());
      if (declared.some((d) => atoms.some((a) => (a.endsWith(':') ? d.startsWith(a) : d === a)))) continue;
      hits.push({ pool: k, cls, layer, vid: v.vid, word: id, text: v.text.slice(0, 160) });
    }
  }
}
fs.writeFileSync('probe/unreached-measure.json', JSON.stringify({ out, hits }, null, 1));
console.log(Object.fromEntries(Object.entries(out).map(([a, b]) => [a, b.length])));
console.log('undeclared registered words in the measurable unreached pools:', hits.length, 'in', new Set(hits.map((h) => h.pool)).size, 'pools');
for (const h of hits) console.log(h.cls, h.layer, h.pool, 'v' + h.vid, h.word, '|', h.text.slice(0, 110));
