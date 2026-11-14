// UPKEEP-8, step 3: the safety profile's lines (safetyDesc, guardEffectivenessDesc, crimeTypes[].desc, economicDragDesc)
// against the record: the cut's seven (#375 #459 #713 #1201 #1080 #1173 #1377), the increment's #ww-516, and the census's
// two writers (a court named where the roster holds no courthouse; a size word in a small place).
// usage: TREE=<tree> node safecls.mjs <births.full.ndjson> [list.json]
import fs from 'node:fs'; import readline from 'node:readline';
const T = process.env.TREE;
const { defenseFactsOf } = await import(T + '/src/domain/defense/defenseFacts.js');
const { standingDefenseForces } = await import(T + '/src/domain/institutions/defenseInstitutionBuckets.js');
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js');
const SMALL = ['thorp', 'hamlet', 'village'], TINY = ['thorp', 'hamlet'];
const COURT_NAMED = /\b(?:the|a|its) court\b|\bcourt only\b|\bcourts\b|only a court|working court|functioning court/i;
const COURT_DENIED = /without (?:a |consistent |a working )?courts?\b|with no court|no reliable court|lack of reliable courts/i;
const cnt = {}; const list = []; let births = 0;
const add = (k, seed, line) => { cnt[k] = (cnt[k] || 0) + 1; list.push({ k, seed, line: line.slice(0, 160) }); };
for await (const l of readline.createInterface({ input: fs.createReadStream(process.argv[2]) })) {
  const { seed, s } = JSON.parse(l); births++;
  const sp = s.economicState?.safetyProfile || {}; const d = defenseFactsOf(s); const f = standingDefenseForces(s);
  const stresses = s.config?.stressTypes || []; const tier = s.tier;
  const secure = s.economicState?.foodSecurity?.foodRecord?.band; const famine = stresses.includes('famine') || stresses.includes('under_siege') || secure === 'famine';
  const crim = (s.institutions || []).map((i) => String(i.name || '').toLowerCase());
  const syndicate = factsOf({ institutions: s.institutions }).crime === 'organized'; // the crime home: a thieves' guild or a syndicate
  const watchStatus = (s.economicState?.tradeDependencies || []).filter((t) => /watch/i.test(t.institution || '') && t.severity === 'critical').length ? 'impaired' : '';
  const lines = [['safety', sp.safetyDesc], ['guard', sp.guardEffectivenessDesc], ['drag', sp.economicDragDesc], ...(sp.crimeTypes || []).map((c) => ['crime:' + c.type, c.desc])];
  for (const [where, text] of lines) {
    const t = String(text || ''); if (!t) continue;
    if (COURT_NAMED.test(t) && !COURT_DENIED.test(t) && !d.hasCourthouse) add('court named, no courthouse', seed, `${where}: ${t}`);
    if (/limited prison|prison system is limited/.test(t) && !d.hasPrison) add('#375 limited prison, none', seed, t);
    if (/exists on paper/.test(t) && (s.defenseProfile?.scores?.military ?? 0) >= 65) add('#713/#1201 on paper beside a Strong military', seed, t);
    if (/largely a formality/.test(t) && (f.garrison.present || f.watch.present)) add('#1080 a formality beside a standing watch or garrison', seed, t);
    if (/^Hunger-driven theft/.test(t) && !famine) add('#1173 hunger theft, no hunger', seed, `${where}: ${t}`);
    if (/does little harm/.test(t) && syndicate) add('#1377 little harm beside a ruling syndicate', seed, t);
    if (/maintains standard patrol|walks the usual rounds|patrols on a regular round|on the rounds most hours/.test(t) && /impaired/.test(watchStatus)) add('#459 standard patrol, the watch impaired', seed, t);
    if (/military command has taken charge/.test(t) && !f.garrison.present && TINY.includes(tier)) add('#ww-275 a military command in a hamlet', seed, t);
    if (/Territorial gangs control specific districts/.test(t) && (SMALL.includes(tier) || crim.reduce((n, x) => n + (/multiple criminal factions/.test(x) ? 2 : /street gang/.test(x) ? 1 : 0), 0) < 2)) add('#ww-516 territorial gangs, districts', seed, `${tier}: ${t}`);
    if (SMALL.includes(tier) && /\bdistricts?\b/i.test(t) && !/surrounding district/i.test(t)) add('size: districts in a small place', seed, `${tier} ${where}: ${t}`);
    if (TINY.includes(tier) && /\bstreets\b/i.test(t)) add('size: streets in a thorp or hamlet', seed, `${tier} ${where}: ${t}`);
  }
}
console.log('births', births); for (const [k, v] of Object.entries(cnt).sort()) console.log(String(v).padStart(5), k);
if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(list));
