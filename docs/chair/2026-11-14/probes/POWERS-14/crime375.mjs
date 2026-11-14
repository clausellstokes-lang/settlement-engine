import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.argv[2], dir = process.argv[3];
const { deriveCriminalStructure } = await import(T + '/src/domain/display/defenseDisplay.js');
const by = new Map();
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.ndjson.gz'))) for (const l of zlib.gunzipSync(fs.readFileSync(dir + '/' + f)).toString().split('\n')) { if (!l) continue; const { key, s } = JSON.parse(l);
  if (String(s.powerStructure?.criminalCaptureState) !== 'none') continue;
  const c = deriveCriminalStructure(s); const k = (c?.key ?? 'none') + ' | ' + (c?.label ?? c?.name ?? '');
  if (!by.has(k)) by.set(k, []); by.get(k).push(key); }
for (const [k, v] of [...by].sort((a, b) => b[1].length - a[1].length)) console.log(String(v.length).padStart(4), k, v.slice(0, 4).join(' '));
