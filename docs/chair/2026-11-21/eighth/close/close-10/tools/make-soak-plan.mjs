import { writeFileSync } from 'node:fs';
const { cellFor } = await import(process.argv[2] + '/scripts/audit/soak-review/corpus.mjs');
const rows = Array.from({ length: 1000 }, (_, i) => { const c = cellFor(i); return { seed: c.seed, size: c.matrix.settType, config: c.input }; });
writeFileSync(process.argv[3], JSON.stringify(rows)); console.log(rows.length);
