// READ-24 (supplementary corpus): the same 900 seeds dp-<size>-<i> born as FINDINGS.md's visitor was
// ({ ...DEFAULT_CONFIG, settType, _randomizePriorities: true }: the config of each size's row of the chair's plan-lit.json).
// node make-visitor-plan.mjs <plan-lit.json> <out.json>   (plan-lit.json: git show origin/lane/chair-2026-11-08:docs/chair/2026-11-24/tenth/read/plan-lit.json)
import { readFileSync, writeFileSync } from 'node:fs';
const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const by = {}; for (const r of JSON.parse(readFileSync(process.argv[2], 'utf8'))) by[r.size] ||= r.config;
const rows = sizes.flatMap((size) => Array.from({ length: 150 }, (_, i) => ({ seed: `dp-${size}-${i}`, size, config: by[size] })));
writeFileSync(process.argv[3], JSON.stringify(rows)); console.log(rows.length);
