// the pipeline's step order with each step's declared reads / provides / mutates: node order.mjs <tree>
const T = process.argv[2] + '/src';
await import(T + '/generators/generateSettlementPipeline.js');
const P = await import(T + '/generators/pipeline.js');
const order = P.getStepOrder(); const meta = P.getStepMeta();
const byName = meta ? Object.fromEntries((Array.isArray(meta) ? meta : Object.values(meta)).map((m) => [m.name, m])) : {};
order.forEach((n, i) => { const m = byName[n] || {}; console.log([i + 1, n, 'R:' + (m.reads || []).join(','), 'P:' + (m.provides || []).join(','), 'M:' + (m.mutates || []).join(',')].join('\t')); });
