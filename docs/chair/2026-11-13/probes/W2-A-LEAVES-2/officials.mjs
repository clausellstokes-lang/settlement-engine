import fs from 'node:fs'; import zlib from 'node:zlib';
const [tree, corpus] = process.argv.slice(2);
const { allegianceOf } = await import(`${tree}/src/domain/people/allegiance.js`);
const { deriveCriminalStructure } = await import(`${tree}/src/domain/display/defenseDisplay.js`);
const recs = zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const tally = {};
for (const { seed, s } of recs) {
  const st = s.powerStructure?.criminalCaptureState || 'absent';
  const vias = (s.npcs || []).map((c) => allegianceOf(c)?.via).filter(Boolean);
  const office = vias.filter((v) => v === 'office').length;
  const crimInst = (s.economicState?.safetyProfile?.criminalInstitutions || []).length;
  const struct = deriveCriminalStructure(s)?.key || 'null';
  const k = `${st}`; tally[k] ||= { towns: 0, withOffice: 0, withAnyAgent: 0, organized: 0, organizedWithOffice: 0, withCrimInst: 0 };
  const t = tally[k]; t.towns++; if (office) t.withOffice++; if (vias.length) t.withAnyAgent++; if (struct === 'organized') { t.organized++; if (office) t.organizedWithOffice++; } if (crimInst) t.withCrimInst++;
}
console.log(JSON.stringify(tally, null, 1));
