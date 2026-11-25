// BIRTH-1: the golden master's 525 rows as a births plan (key = keyOf(config)); `--raw` births them as the dark golden does
// (no birthConfig), else as the lit twin (birthConfig). node make-golden-plan.mjs <tree> <out.json> [--raw]
import { writeFileSync } from 'node:fs';
const [tree, out] = process.argv.slice(2); const raw = process.argv.includes('--raw');
const { goldenCorpus, keyOf } = await import(`${tree}/tests/helpers/goldenMasterCorpus.js`);
const rows = goldenCorpus().map((c) => { const { _seed, ...config } = c; return { seed: _seed, key: keyOf(c), size: c.settType, config, raw }; });
writeFileSync(out, JSON.stringify(rows)); console.log(rows.length);
