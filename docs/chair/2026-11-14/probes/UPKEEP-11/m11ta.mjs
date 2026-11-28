// UPKEEP-11 step 1: threatAssessment's militia tail (" and a citizen militia to hold it.") over a gz corpus: where buildThreatAssessment prints it, against the walker's militia absence.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T = process.env.TREE;
const { buildThreatAssessment } = await import(T + '/src/domain/display/threatAssessment.js');
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js');
const { liveInstitutionNames } = await import(T + '/src/domain/facts/institutions.js');
const { REGISTERED_WORDS } = await import(T + '/src/domain/facts/registeredWords.js');
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
let n = 0, prints = 0, absent = 0, plagued = 0, err = 0; const ex = [];
for await (const line of rl) {
  if (!line.trim()) continue; n++;
  const { seed, s } = JSON.parse(line);
  if (s.config?.monsterThreat === 'plagued') plagued++;
  let out; try { out = JSON.stringify(buildThreatAssessment(s)); } catch (e) { err++; continue; }
  if (!out.includes('a citizen militia to hold it.')) continue;
  prints++; if (ex.length < 5) ex.push(seed + ' ' + s.tier);
  if (REGISTERED_WORDS.militia.absent(factsOf(s), liveInstitutionNames(s))) absent++;
}
console.log({ n, plagued, prints, absent, err, ex });
