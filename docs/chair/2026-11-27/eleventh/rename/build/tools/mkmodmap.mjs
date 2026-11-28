// node mkmodmap.mjs <bundle.mjs> <out.json> : [line, module path] for every esbuild module comment
import { readFileSync, writeFileSync } from 'node:fs';
const L = readFileSync(process.argv[2], 'utf8').split('\n'); const out = [];
L.forEach((l, i) => { const m = /^\/\/ (\S+\.(?:js|jsx|mjs|json))$/.exec(l); if (m) out.push([i + 1, m[1]]); });
writeFileSync(process.argv[3], JSON.stringify(out)); console.log(out.length);
