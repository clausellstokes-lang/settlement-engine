const root = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const { buildIndex, scanSurfaceReads, keysToShapesOf } = await import(root + '/scripts/lib/writer-reach-scan.mjs');
const { sourceFiles } = await import(root + '/scripts/check-observed-shape-readers.mjs');
const { buildObservedCorpus } = await import(root + '/scripts/lib/observed-shape-corpus.mjs');
const files = sourceFiles(root);
const index = buildIndex(files);
const observed = await buildObservedCorpus();
const keysToShapes = keysToShapesOf(observed);
const show = (label, targets) => {
  const { reads, stats } = scanSurfaceReads({ index, corpus: observed, files: targets, root, keysToShapes });
  console.log('---', label, 'stats', JSON.stringify(stats));
  for (const id of ['source on stress', 'source on stressors']) {
    const e = reads.get(id);
    console.log(' ', id, 'R=', e ? [...e.R] : null, 'N=', e ? [...e.N] : null);
  }
};
show('provenance+portability (counterfactual adds)', [
  root + '/src/domain/content/settlementContentProvenance.js',
  root + '/src/lib/accountSettlementContentPortability.js',
]);
show('admission (tip, drop)', [root + '/src/lib/importReconciliationAdmission.js']);
