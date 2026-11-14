// chip.mjs <tree> <birthsdir>...: the ruling power's crime chip against the hall's rung, by rung and crime structure
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [tree, ...dirs] = process.argv.slice(2);
const { governingModifierWordsOf } = await import(path.join(tree, 'src/domain/display/governingModifierWords.js'));
const { factsOf } = await import(path.join(tree, 'src/domain/facts/factsOf.js'));
const t = {}; const ex = {};
for (const dir of dirs) for (const file of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz')).sort())
  for (const line of zlib.gunzipSync(fs.readFileSync(dir + '/' + file)).toString().split('\n')) {
    if (!line) continue; const { key, s } = JSON.parse(line);
    const w = governingModifierWordsOf(s); if (w !== 'criminal sway') continue;
    const k = `${s.powerStructure?.criminalCaptureState || 'none'} | crime=${factsOf(s).crime}`;
    t[k] = (t[k] || 0) + 1; (ex[k] ||= []).length < 4 && ex[k].push(key);
  }
for (const k of Object.keys(t).sort()) console.log(t[k], k, ex[k].join(' '));
