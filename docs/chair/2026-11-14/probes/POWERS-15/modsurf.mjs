import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [tree, ...dirs] = process.argv.slice(2);
const { governingModifierWordsOf } = await import(path.join(tree, 'src/domain/display/governingModifierWords.js'));
const t = {}; const ex = {};
for (const dir of dirs) for (const file of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz')).sort())
  for (const line of zlib.gunzipSync(fs.readFileSync(dir + '/' + file)).toString().split('\n')) {
    if (!line) continue; const { key, s } = JSON.parse(line);
    const g = (s.powerStructure.factions || []).find((f) => f.isGoverning); if (!g?.modifier) continue;
    const w = governingModifierWordsOf(s); const k = `${g.modifier} -> ${w || '(silent)'}`;
    t[k] = (t[k] || 0) + 1; (ex[k] ||= []).length < 3 && key.startsWith('r2r-') && ex[k].push(`${key}`);
  }
for (const k of Object.keys(t).sort()) console.log(t[k], k, ex[k].join(' '));
