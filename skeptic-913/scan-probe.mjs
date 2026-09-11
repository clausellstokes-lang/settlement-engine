const root = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const { buildIndex, edgeMapOf, scanSurfaceReads, keysToShapesOf } = await import(root + '/scripts/lib/writer-reach-scan.mjs');
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
const list = [...(reads.keys ? reads.keys() : Object.keys(reads))];
const arr = Array.isArray(reads) ? reads : (reads instanceof Map ? [...reads.entries()] : Object.entries(reads));
const s = JSON.stringify(arr);
console.log('reads container:', reads instanceof Map ? 'Map' : Array.isArray(reads) ? 'Array' : typeof reads, 'size', arr.length);
const hits = arr.filter((e) => JSON.stringify(e).includes('"source"') || JSON.stringify(e).includes('source on'));
console.log('source-ish entries:', hits.slice(0,10).map((e)=>JSON.stringify(e).slice(0,200)));
console.log('all identities sample:', arr.slice(0,5).map((e)=>JSON.stringify(e).slice(0,160)));
