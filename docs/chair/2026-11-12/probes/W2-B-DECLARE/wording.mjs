import fs from 'node:fs'; import zlib from 'node:zlib';
const TREE = process.env.TREE;
const { TERRAIN_DATA } = await import(`${TREE}/src/data/geographyData.js`);
const C = zlib.gunzipSync(fs.readFileSync('out-base/corpus.ndjson.gz')).toString().trim().split('\n').map((l) => JSON.parse(l));
let wordsChurch = 0, flagChurch = 0, disagreeChurch = 0, terrainRows = 0, terrainDisagree = 0;
const RE = /terrain cannot produce this locally$/;
for (const { s } of C) {
  const w = String(s.economicState?.situationDesc || '').toLowerCase().includes('church controls');
  const f = s.economicState?.safetyProfile?.flags?.theocraticEconomy === true;
  if (w) wordsChurch++; if (f) flagChurch++; if (w !== f) disagreeChurch++;
  const imp = s.resourceAnalysis?.imports; const must = TERRAIN_DATA[s.config?.terrainType]?.mustImport || [];
  for (const item of imp?.critical || []) {
    const byWords = RE.test(String(imp.reasons?.[item] || ''));
    const byFact = must.includes(item);
    terrainRows++; if (byWords !== byFact) terrainDisagree++;
  }
}
console.log({ births: C.length, wordsChurch, flagChurch, disagreeChurch, terrainRows, terrainDisagree });
