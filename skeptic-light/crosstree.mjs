const root = process.argv[2];
const crypto = await import('node:crypto');
const { generateSettlementPipeline } = await import(`${root}/src/generators/generateSettlementPipeline.js`);
const { goldenCorpus } = await import(`${root}/tests/helpers/goldenMasterCorpus.js`);
const { rateGrid } = await import(`${root}/scripts/prose-rate-corpus.mjs`);
const g = goldenCorpus(); const rt = rateGrid();
const rows = [];
for (let i = 0; i < 60; i++) { const { _seed, ...c } = g[i * 8]; rows.push(['G' + (i * 8), c, _seed]); }
for (let i = 0; i < 60; i++) { const t = rt[i * 12]; rows.push(['R' + (i * 12), t.config, t.seed]); }
const h = crypto.createHash('sha256');
for (const [label, cfg, seed] of rows) {
  const s = generateSettlementPipeline({ ...cfg }, null, { seed, customContent: {} });
  h.update(label + '|' + JSON.stringify(s) + '\n');
}
console.log(root.split('/').pop(), 'rows=' + rows.length, 'DARK-CORPUS SHA256 =', h.digest('hex'));
