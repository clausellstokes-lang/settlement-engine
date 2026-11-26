// make-desert-port-plan.mjs <V.json> <out.json>: B1(i)c-2's forced desert ports: V's city and metropolis config with
// terrainOverride 'desert' and tradeRouteAccess 'port', seeds dpp-<size>-0..59 (120 births). V.json: make-visitor-plan.mjs's output.
import { readFileSync, writeFileSync } from 'node:fs';
const p = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const rows = [];
for (const size of ['city', 'metropolis']) for (let i = 0; i < 60; i++) rows.push({ seed: `dpp-${size}-${i}`, size, config: { ...p.find((r) => r.size === size).config, terrainOverride: 'desert', tradeRouteAccess: 'port' } });
writeFileSync(process.argv[3], JSON.stringify(rows)); console.log(rows.length);
