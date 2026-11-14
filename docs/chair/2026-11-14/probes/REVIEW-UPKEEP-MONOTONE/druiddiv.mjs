// druiddiv.mjs: the famine with a druid alone, then each divine house added (printed scores), on made records.
// TREE=<tree> node druiddiv.mjs <record_dir> <seedlist>
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE;
const { generateDefenseProfile } = await import(T + '/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T + '/src/domain/facts/keep.js');
const SC = ['military', 'monster', 'internal', 'economic', 'magical'];
const read = (s) => { const p = generateDefenseProfile(s, keepOfRecord(s.economicState)); return { ...Object.fromEntries(SC.map((k) => [k, p.scores[k]])), readiness: p.readiness.score }; };
const DIV = ['Parish church', 'Monastery or friary', 'Multiple monasteries', 'Cathedral', 'Great cathedral', 'Temple', 'Healer (divine, 1st level)'];
let tried = 0; const falls = [];
const [dir, list] = process.argv.slice(2);
for (const seed of fs.readFileSync(list, 'utf8').trim().split('\n')) {
  const b = JSON.parse(zlib.gunzipSync(fs.readFileSync(`${dir}/${seed}.json.gz`)));
  for (const stress of [['famine'], ['famine', 'under_siege'], ['famine', 'plague_onset']]) for (const [mag, rel] of [[100, 100], [40, 60], [60, 70], [30, 55]]) {
    const base = { ...b, stress: stress.map((type) => ({ type })), config: { ...b.config, stressTypes: stress, priorityMagic: mag, priorityReligion: rel },
      institutions: [...(b.institutions || []).filter((h) => !/church|monaster|cathedral|temple|friary|healer|shrine/i.test(h.name)), { name: 'Druid Circle', category: 'Religious', tags: [] }] };
    const s0 = read(base);
    for (const d of DIV) { tried++; const s1 = read({ ...base, institutions: [...base.institutions, { name: d, category: 'Religious', tags: [] }] });
      for (const k of Object.keys(s0)) if (s1[k] < s0[k]) falls.push({ seed, stress, mag, rel, d, k, before: s0[k], after: s1[k] }); }
  }
}
console.log(JSON.stringify({ tried, falls: falls.length, sample: falls.slice(0, 10) }));
