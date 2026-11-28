import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [tree, ...dirs] = process.argv.slice(2);
const { governingModifierWordsOf } = await import(path.join(tree, 'src/domain/display/governingModifierWords.js'));
const t = {};
for (const dir of dirs) for (const file of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz')).sort())
  for (const line of zlib.gunzipSync(fs.readFileSync(dir + '/' + file)).toString().split('\n')) {
    if (!line) continue; const { key, s } = JSON.parse(line);
    const g = (s.powerStructure.factions || []).find((f) => f.isGoverning); if (!g?.modifier) continue;
    const w = governingModifierWordsOf(s); if (!w) continue;
    const st = [].concat(s.stress||[]).map((x)=>x.type);
    const k = `${String(st)}|${s.tier}`;
    (t[k] ||= []).push(`${key}:${g.faction}:${g.modifier}->${w}`);
  }
for (const k of Object.keys(t).sort()) console.log(k, t[k].length, t[k].slice(0,2).join(' ; '));
