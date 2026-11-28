/**
 * BAR6-AUDIT seat F: LAW 10's tables from runF outputs (the 150, the 720, the fresh 300).
 *   node docs/chair/2026-11-16/bar6/AUDIT/tablesF.mjs <out.md> <name>=<runF-out.json> [<name>=<runF-out.json> ...]
 * Writes the counts by rule and population, the thirty commonest distinct lines of each rule (each population's
 * own list is in its json), and the writer files (WRITERS: traced on 600b7683a, file:line in the hand-back).
 */
import fs from 'node:fs';
const [, , outFile, ...pairs] = process.argv;
if (!outFile || !pairs.length) { console.error('usage: node tablesF.mjs <out.md> <name>=<runF-out.json> ...'); process.exit(2); }
/** Which file wrote the false side; which holds the fact it should have read. Traced at 600b7683a. */
export const WRITERS = {
  '10a': ['src/domain/people/allegiance.js :: dealAllegiances / allegiancePowerFor (the agent\'s power)', 'npcs[].memberships (landMemberships, then rankPowers: castPowers.js)'],
  '10b': ['src/generators/safetyProfile.js :: generateSafetyProfile (the crusader hook, drawn before any person is born)', 'npcs[].gender of the role\'s holder (the roster)'],
  '10c': ['src/data/faceHonorifics.js :: honorificOfTitle (FACE_HONORIFICS_INLAND: "the harbour master" -> Dockmaster | Wharfinger)', 'npcs[].title and the house of the other holder (the roster)'],
  '10d-seat': ['src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.gov_econ_dependence ("has asked for a seat on the council"; ties.js :: createTieProseDraw)', 'npcs[].memberships of the asker (the seat)'],
  '10d-purse': ['src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.gov_econ_dependence ("borrowed … every year since")', 'the economy desk DS-ECO-8 MODERATE (the treasury\'s yearly balance: the prosperity band)'],
  '10e-temper-manner': ['(apart, not law) the same draws as 10e-temper', 'npcs[].personality.dominant'],
  '10g-legacy-ruin': ['(apart, not law) DS-GEN-16 LEGACY-RECOVERED v2 after a crash or a trade collapse', 'history.historicalEvents[].templateType'],
  '10d': ['src/data/npcData.js :: STRESS_ECONOMIC_EFFECTS.gov_econ_dependence (drawn by power/relationshipArchetypes.js, ties.js :: createTieProseDraw)', 'npcs[].memberships (the seat); the treasury line of the page (economy desk)'],
  '10e-temper': ['the secret overlay (src/data/stressInstitutionEffects.js; titleSecretsPresentations.js) drawn after the personality (npcData.js NPC_PERSONALITY_TRAITS)', 'npcs[].personality.dominant'],
  '10e-temper-honest': ['the same draws as 10e-temper', 'npcs[].personality.dominant'],
  '10e-house': ['src/data/people/titleSecretsPresentations.js :: TITLE_SECRETS["the watch sergeant"]', 'src/domain/facts/guardPay.js :: watchIsUnpaidRota (the house card: institutionDescVariants.js)'],
  '10e-pay': ['src/generators/safetyProfile.js (the guard assessment, keyed on militaryEffective and the economy priority)', 'the watch commander\'s constraint (npc structure) and guardPay.js'],
  '10f-kind': ['src/generators/power/rulingStructure.js :: generatePowerStructure (govDescByLabel[govBody] from house names)', 'powerStructure.factions[governing].category'],
  '10f-tier': ['src/generators/power/rulingStructure.js (the merchant desc keyed on power thresholds, never the tier)', 'record.tier'],
  '10f-weight': ['src/generators/power/factionStanding.js :: annotateFactionStanding (keyed on the merchant category\'s power)', 'powerStructure.factions[].power of the power it names'],
  '10f-backs': ['src/domain/dossier/powerSupport.js :: houseBacksOf (catalogue backing shares; data/institutionBacking.js)', 'powerStructure.conflicts (high) and the ruler\'s seat'],
  '10f-backs-wide': ['src/domain/dossier/powerSupport.js :: houseBacksOf', 'powerStructure.conflicts'],
  '10g-span': ['src/generators/historyTemplate.js :: buildCurrentTensionTokens (the tension\'s duration fixed at "three")', 'history.historicalEvents[].description (historyGenerator.js: randInt(1,5))'],
  '10g-legacy': ['src/data/dossierStateProse/general.generated.js DS-GEN-16 LEGACY-RECOVERED v2 (legacyPoolKey: generalStateProse.js)', 'history.historicalEvents[].type / templateType of legacyAnnotations[0]'],
  '10g-legacy-answer': ['the same pool, v1', 'the same'],
  '10h': ['src/domain/dossier/hookLines.js :: hookPartyOf (the raw conflict party name)', 'src/data/people/powerSentenceName.js :: powerSentenceName (PROSE_FORMS)'],
};
const runs = pairs.map((p) => { const [name, f] = p.split('='); return { name, j: JSON.parse(fs.readFileSync(f, 'utf8')) }; });
const rules = [...new Set(runs.flatMap((r) => Object.keys(r.j.byRule)))].sort();
const L = ['# LAW 10 · tables (BAR6-AUDIT-F)', '', `Populations: ${runs.map((r) => `${r.name} (${r.j.towns} towns)`).join(' · ')}. Cells: towns / instances / distinct lines.`, '',
  `| rule | ${runs.map((r) => r.name).join(' | ')} | wrote the false line | holds the fact |`, `|---|${runs.map(() => '---').join('|')}|---|---|`];
for (const k of rules) L.push(`| ${k} | ${runs.map((r) => { const v = r.j.byRule[k]; return v ? `${v.towns} / ${v.instances} / ${v.distinct}` : '0'; }).join(' | ')} | ${(WRITERS[k] || ['?'])[0]} | ${(WRITERS[k] || ['', '?'])[1]} |`);
L.push('');
const main = runs.find((r) => r.name === '720') || runs[0];
for (const k of rules) {
  const v = main.j.byRule[k]; if (!v) continue;
  L.push(`## ${k} · the commonest distinct lines in the ${main.name} (${v.distinct} distinct)`, '');
  for (const t of v.top) L.push(`- ${t.towns} town(s) · ${t.line.replace(/\|/g, '/').slice(0, 220)} · e.g. ${t.seeds.slice(0, 3).join(', ')}`);
  L.push('');
}
fs.writeFileSync(outFile, L.join('\n'));
console.log(`wrote ${outFile}: ${rules.length} rules × ${runs.length} populations`);
