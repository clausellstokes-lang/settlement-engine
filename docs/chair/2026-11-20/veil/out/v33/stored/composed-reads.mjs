// V33-C1 (STORED-UNIVERSE): WHAT EACH publicProse SITE READS, BY THE COMPOSER'S OWN SOURCE. node composed-reads.mjs [<tree>]
// Each site of src/components/new/publicProseCompose.js :: PUBLIC_PROSE_SITES names its reader module(s) (SITE below, read off
// the composer's lines); each module's static import closure (relative `import`/`export ... from`/`import()` specifiers, src
// only) is grepped for each document field's key. A field a site's closure names is COMPOSABLE (NEAR: the reader module or one it imports directly) from it (PLAUSIBLE: the key is
// read somewhere in the closure; which branch draws it is not traced). Every site's source record is
// src/domain/display/publicSafe.js :: publicVeiledRecordOf (the owner's public strip), whose own closure is listed apart.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const T = process.argv[2] || '/home/user/wt/lp';
const N = `${T}/src/components/new`;
const SITE = {
  'economy:*': ['economyDeskRead.js', 'deskHostArgs.js', 'tabHelpers.js'],
  'general:*': ['generalDeskRead.js'],
  'overview:identity': ['overviewIdentity.js'],
  'stressors:overview': ['stressorsDeskRead.js', 'deskHostArgs.js'],
  'defense:*': ['defenseDeskRead.js', 'deskHostArgs.js'],
  'power:desk / power:governance / power:ladder': ['powerDeskRead.js'],
  'warFaith:faith': ['tabs/WarFaithDesk.jsx'],
  magic: ['magicDeskRead.js'],
  'viability / viewModel:viability': ['viabilityDeskRead.js'],
  '(the source record: publicVeiledRecordOf)': ['../../domain/display/publicSafe.js'],
};
const FIELDS = {
  'power.recentConflict': /\brecentConflict\b/, 'pressureSentence': /\bpressureSentence\b/, 'safety.crimeTypes': /\bcrimeTypes\b/,
  'safety.criminalInstitutions': /\bcriminalInstitutions\b/, 'power.label (powerLabel)': /\bpowerLabel\b/,
  'power.desc (factions[].desc)': /\b(f|faction|row|gov|governing|ruler|p)\??\.desc\b/, 'power names (factions[].faction)': /\.faction\b/,
  'house names (institutions[].name)': /\binstitutions\b/, 'safety.plotHooks': /\bplotHooks\b/, 'economy.situationDesc': /\bsituationDesc\b/,
  'history.siegeNarrative': /\bsiegeNarrative\b/, 'safety.economicDragDesc': /\beconomicDragDesc\b/, 'npcs.stressNote': /\bstressNote\b/,
  'history.legacy': /\blegacyAnnotations\b/, 'people.secret': /\.secret\b/, 'power.relation.dmNote': /\bdmNote\b/,
  'power.captureState': /\bcaptureState\b/, 'safety.blackMarketCapture': /\bblackMarketCapture\b/, 'safety.safetyRatio': /\bsafetyRatio\b/,
  'food.storageNote': /\bstorageNote\b/, 'income (incomeSources)': /\bincomeSources\b/, 'power.contestsNiche': /\bcontestsNiche\b/,
  'power.factions.legitimacyCrisis': /\blegitimacyCrisis\b/, 'compound.economyOutput': /\beconomyOutput\b/,
  'compound.criminalEffective': /\bcriminalEffective\b/, 'defence.readiness.score': /\breadiness\b/, 'defence.economicGates': /\beconomicGates\b/,
  'safety.safetyDesc': /\bsafetyDesc\b/, 'safety.guardEffectivenessDesc': /\bguardEffectivenessDesc\b/,
  'history.tension (currentTensions)': /\bcurrentTensions\b/, 'people.prominentRelationship': /\bprominentRelationship\b/,
  'people.ties (relationships)': /\brelationships\b/, 'people.allegiance': /\ballegiance\b/, 'trace.criminalAllegiance': /\bsimulationTrace\b/,
  'npcs.memberships.veiled': /\bmemberships\b/, 'people.card secondaryAffiliation': /\bsecondaryAffiliation\b/, 'power.rawPower': /\brawPower\b/,
  'power.fingerprint': /\beconomyInputFingerprint\b/, 'legitimacy.crimMultiplier': /\bcrimMultiplier\b/, 'cast.* (stress cast)': /\bcast\b\s*\??\.\s*(roles|stakes|levers|absent)/,
  'spatial.quarters': /\bquarters\b/, 'history.timeline.year': /\beventsTimeline\b/, 'conditions.severity': /\bseverity\b/,
};
const RE = /(?:import|export)\s[^'"]*?from\s*['"](\.[^'"]+)['"]|import\(\s*['"](\.[^'"]+)['"]\s*\)|import\s*['"](\.[^'"]+)['"]/g;
const resolveSpec = (from, spec) => { const b = resolve(dirname(from), spec); for (const c of [b, `${b}.js`, `${b}.jsx`, `${b}/index.js`]) if (existsSync(c) && !c.endsWith('/')) { try { readFileSync(c); return c; } catch { /* a dir */ } } return null; };
/** BFS: every module of the closure with its import DEPTH from the site's reader (0 = the reader module itself). */
const closure = (entries) => { const depth = new Map(); let q = entries.map((f) => [f, 0]); while (q.length) { const nq = []; for (const [f, d] of q) { if (depth.has(f)) continue; depth.set(f, d); const s = readFileSync(f, 'utf8'); for (const m of s.matchAll(RE)) { const r = resolveSpec(f, m[1] || m[2] || m[3]); if (r && r.startsWith(`${T}/src/`) && !depth.has(r)) nq.push([r, d + 1]); } } q = nq; } return depth; };
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
const out = {};
for (const [site, mods] of Object.entries(SITE)) {
  const dep = closure(mods.map((m) => resolve(N, m)));
  const src = [...dep].map(([f, d]) => [`${f.replace(`${T}/`, '')}@${d}`, strip(readFileSync(f, 'utf8')), d]).sort((a, b) => a[2] - b[2]);
  out[site] = { modules: dep.size, reads: {} };
  for (const [field, re] of Object.entries(FIELDS)) { const hits = src.filter(([, s]) => re.test(s)); if (hits.length) out[site].reads[field] = { min: hits[0][2], hits: hits.map(([f]) => f) }; }
}
console.log('COMPOSED, BY SOURCE: per site, its reader closure (modules) and every field key the closure names (code, comments stripped), with up to 3 modules');
for (const [site, o] of Object.entries(out)) {
  console.log(`\n${site}: ${o.modules} modules`);
  for (const [field, h] of Object.entries(o.reads)) console.log(`  ${field}: nearest depth ${h.min}; ${h.hits.length} module(s), nearest ${h.hits.slice(0, 3).join(', ')}`);
}
console.log('\nBY FIELD: the sites whose closure names it, NEAR (the reader or a module it imports directly: depth 0-1) and FAR (depth 2+, the whole closure)');
for (const field of Object.keys(FIELDS)) { const e = Object.entries(out).filter(([, o]) => o.reads[field]);
  console.log(`  ${field}: NEAR ${e.filter(([, o]) => o.reads[field].min <= 1).map(([s, o]) => `${s} (${o.reads[field].hits[0]})`).join(' | ') || '(none)'}; FAR ${e.filter(([, o]) => o.reads[field].min > 1).map(([s, o]) => `${s}@${o.reads[field].min}`).join(' | ') || '(none)'}`); }
