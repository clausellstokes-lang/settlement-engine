const root = process.argv[2];
const crypto = await import('node:crypto');
const { generateSettlementPipeline } = await import(`${root}/src/generators/generateSettlementPipeline.js`);
const { goldenCorpus } = await import(`${root}/tests/helpers/goldenMasterCorpus.js`);
const { rateGrid } = await import(`${root}/scripts/prose-rate-corpus.mjs`);
const g = goldenCorpus(); const rt = rateGrid();
const hg = crypto.createHash('sha256'); const hr = crypto.createHash('sha256');
for (const row of g) { const { _seed, ...c } = row;
  hg.update(JSON.stringify(generateSettlementPipeline({ ...c }, null, { seed: _seed, customContent: {} })) + '\n'); }
for (const t of rt) {
  hr.update(JSON.stringify(generateSettlementPipeline({ ...t.config }, null, { seed: t.seed, customContent: {} })) + '\n'); }
console.log(root.split('/').pop(), '| golden', g.length, 'sha256', hg.digest('hex'), '| rate', rt.length, 'sha256', hr.digest('hex'));
