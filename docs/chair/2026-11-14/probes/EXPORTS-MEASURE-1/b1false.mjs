// node b1false.mjs <corpus> <tree>: the towns whose readiness rows print a FALSE line of the two classes read (EXPORTS-MEASURE-1 B1):
// the clergy line where no house with clergy stands (live roster, not ACCESS, not a shrine alone), the defenders named where no force stands
import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus, T] = process.argv.slice(2);
const f = (await import(T + '/src/domain/display/defenseDisplay.js')).deriveDefenseReadiness;
const { forceStands } = await import(T + '/src/domain/display/threatAssessment.js');
const { liveInstitutionNames, ACCESS_ONLY } = await import(T + '/src/domain/facts/institutions.js');
const RE = /\btemple|\bchurch|\bcathedral|\bchapel|\babbey|\bmonaster|\bfriary|\bpriory/i;
const cl = new Set(), de = new Set(), any = new Set(), lost = new Set();
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if (!l) continue; const { seed, s } = JSON.parse(l); const rows = f(s);
  const clergy = liveInstitutionNames(s).some((n) => !ACCESS_ONLY.test(n) && RE.test(n));
  if (rows.some((r) => r.assess.includes('Clergy provide')) && !clergy) { cl.add(seed); any.add(seed); }
  if (rows.some((r) => /defenders|defend the place/.test(r.assess)) && !forceStands(s)) { de.add(seed); any.add(seed); }
  if (clergy && !rows.some((r) => r.assess.includes('Clergy provide') || /hospital can|treats the sick one/.test(r.assess))) lost.add(seed); }
console.log(`false clergy ${cl.size} · false defenders ${de.size} · towns with either ${any.size} · clergy house standing but no care line ${lost.size}`);
