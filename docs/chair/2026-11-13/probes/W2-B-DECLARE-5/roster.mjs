import fs from 'node:fs'; import zlib from 'node:zlib';
const { liveInstitutionNames } = await import(process.env.TREE + '/src/domain/facts/institutions.js');
const want = new Set(process.argv.slice(2));
for (const l of zlib.gunzipSync(fs.readFileSync(`${process.env.OUT}/corpus.ndjson.gz`)).toString().trim().split('\n')) {
  const r = JSON.parse(l); if (!want.has(r.seed)) continue;
  console.log(r.seed, '|', r.s.tier, r.s.population, '|', liveInstitutionNames(r.s).join(' · '));
}
