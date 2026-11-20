import fs from 'node:fs'; import zlib from 'node:zlib';
const [T, F, seeds, re] = process.argv.slice(2); const want = new Set(seeds.split(','));
const { liveInstitutionNames } = await import(T + '/src/domain/facts/institutions.js');
for (const l of zlib.gunzipSync(fs.readFileSync(F)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); if (!want.has(seed)) continue;
  const n = liveInstitutionNames(s).filter((x) => new RegExp(re, 'i').test(x)); const p = (s.powerStructure?.factions || []).map((f) => f.name || f.faction).filter((x) => new RegExp(re, 'i').test(String(x)));
  console.log(seed, s.tier, 'roster:', n.join('; ') || '-', '| powers:', p.join('; ') || '-'); }
