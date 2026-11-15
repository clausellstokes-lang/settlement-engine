// ORDER-MEASURE-1 · which top-level record fields a candidate moves on the golden corpus: node goldenfields.mjs <base tree> <cand tree> [n=40]
const [A, B, N = '40'] = process.argv.slice(2);
const load = async (T) => ({ c: (await import(T + '/tests/helpers/goldenMasterCorpus.js')).goldenCorpus(), g: (await import(T + '/src/generators/generateSettlementPipeline.js')).generateSettlementPipeline });
const a = await load(A), b = await load(B); const cnt = {};
for (const config of a.c.slice(0, Number(N))) { const { _seed, ...cfg } = config;
  const x = a.g(cfg, null, { seed: _seed, customContent: {} }), y = b.g(cfg, null, { seed: _seed, customContent: {} });
  for (const k of new Set([...Object.keys(x), ...Object.keys(y)])) if (JSON.stringify(x[k]) !== JSON.stringify(y[k])) cnt[k] = (cnt[k] || 0) + 1; }
console.log(JSON.stringify(cnt));
