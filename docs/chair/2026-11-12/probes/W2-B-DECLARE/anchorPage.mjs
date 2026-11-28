// TREE=<tree> node ident70.mjs <corpus.gz> <seeds> <out.json> — DS-GEN-9's identity lines per town, through the desk's own read
import fs from 'node:fs'; import zlib from 'node:zlib';
const { generalDeskLines } = await import(process.env.TREE + '/src/components/new/generalDeskRead.js');
const want = new Set(fs.readFileSync(process.argv[3], 'utf8').trim().split('\n'));
const rows = zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n').map((l) => JSON.parse(l)).filter((r) => want.has(r.seed));
const out = {}; let n = 0;
for (const { seed, s } of rows) { const l = generalDeskLines(s, { tier: s.tier }).history?.identityLines || []; out[seed] = l.map(String); n += l.length; }
fs.writeFileSync(process.argv[4], JSON.stringify(out)); console.log('towns', rows.length, 'identity lines', n);
