import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [tree, dir] = process.argv.slice(2);
const { governingModifierWordsOf } = await import(path.join(tree, 'src/domain/display/governingModifierWords.js'));
const r=[];
for (const file of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz')).sort())
  for (const line of zlib.gunzipSync(fs.readFileSync(dir + '/' + file)).toString().split('\n')) {
    if (!line) continue; const { key, s } = JSON.parse(line);
    const w = governingModifierWordsOf(s); if (!w) continue; r.push([s.population, key, w, [].concat(s.stress||[]).map(x=>x.type).join(',')]);
  }
r.sort((a,b)=>a[0]-b[0]); console.log(r.length, JSON.stringify(r.slice(0,3)), JSON.stringify(r.slice(-3)));
