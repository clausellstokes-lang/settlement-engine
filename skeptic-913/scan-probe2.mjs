const root = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const { buildIndex, scanSurfaceReads, keysToShapesOf } = await import(root + '/scripts/lib/writer-reach-scan.mjs');
const { sourceFiles } = await import(root + '/scripts/check-observed-shape-readers.mjs');
const { buildObservedCorpus } = await import(root + '/scripts/lib/observed-shape-corpus.mjs');
const files = sourceFiles(root);
const index = buildIndex(files);
const observed = await buildObservedCorpus();
const keysToShapes = keysToShapesOf(observed);
const targets = [
  root + '/src/domain/content/settlementContentProvenance.js',
  root + '/src/lib/accountSettlementContentPortability.js',
];
const { reads } = scanSurfaceReads({ index, corpus: observed, files: targets, root, keysToShapes });
for (const id of ["source on stress","source on stressors","customContentRoster on settlement"]) {
  console.log(id, '=>', JSON.stringify(reads.get(id)));
}
let nonEmpty = 0;
for (const [id, v] of reads) { const s = JSON.stringify(v); if (s !== '{"R":{},"N":{}}') { nonEmpty++; if (nonEmpty < 12) console.log('NONEMPTY', id, s.slice(0,300)); } }
console.log('nonEmpty total', nonEmpty, 'of', reads.size);
