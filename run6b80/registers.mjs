// REGISTERIZE — assign every extracted row to a reader-facing REGISTER, apply the
// register-appropriate admission predicate, and deduplicate on the normalised key.
// Usage: node registers.mjs <DIR-of-extractor-output> <OUT corpus.json>
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const S = process.argv[2];
const OUT = process.argv[3];
export const norm = (t) => t.toLowerCase().replace(/\{[a-z_0-9]+\}/gi, '{}').replace(/[’‘']/g, "'")
  .replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

// ── REGISTERS, in the annexes' own vocabulary where they name one ────────────
// unit: 'sentence' = the register punctuates and composes sentences.
//       'phrase'   = the register's OWN unit is a sub-sentence phrase (a connective, a
//                    subject phrase). Counting it by sentences scores it ZERO (inventory §4b).
export const REGISTERS = [
  { id: 'R1', name: 'dossier-native STATE (7 angle tags)', unit: 'sentence', src: 'X1' },
  { id: 'R2', name: 'dossier-native CAUSAL JOIN', unit: 'sentence', src: 'X1' },
  { id: 'R3', name: 'Herald receipt pools (engine-side, golden-bound)', unit: 'sentence', files: [
    /^src\/domain\/worldPulse\/(warReceiptPools|commercialReceiptPools|sovereigntyReceiptPools|grammarReceiptPools|informationReceiptPools|faithReceiptPools|envoyChanceMeetingReceiptPools|sovereigntyNews|eventProse|warTerminationCauseTables|generosityNews|demographicsHerald)\.js$/,
    /^src\/data\/(roadsProse|traditionProse|traditionCorpus)\.js$/,
  ] },
  { id: 'R4', name: 'Herald causal grammar + join molds (SUB-SENTENCE)', unit: 'phrase', files: [
    /^src\/domain\/display\/(heraldCausalGrammar|heraldJoinMolds)\.js$/,
  ] },
  // Split out of R4: these four hold whole SENTENCES (disclosure lines, lifecycle readings).
  // Scoring them in a phrase-unit column would mix two units in one figure.
  { id: 'R4b', name: 'Herald disclosure + cause-lifecycle sentences', unit: 'sentence', files: [
    /^src\/domain\/display\/(heraldIntegrity|heraldCausalVoice|causeWalk|causeLifecycleVocabulary)\.js$/,
  ] },
  { id: 'R5', name: "Herald crier voice (newsVoice + newsBody)", unit: 'sentence', files: [
    /^src\/domain\/display\/(newsVoice|newsBody)\.js$/,
  ] },
  { id: 'R6', name: 'NPC cause-conjunction ladder (read aloud)', unit: 'sentence', files: [
    /^src\/domain\/display\/causeConjunction/,
  ] },
  { id: 'R7', name: 'institution + service gazetteer', unit: 'sentence', files: [
    /^src\/data\/(institutionServices|institutionDescVariants|institutionalCatalog|institutionLadders|servicesData)\.js$/,
    /^src\/domain\/display\/institutionVocabulary\.js$/,
    /^src\/domain\/institutions\/institutionCatalog\.js$/,
  ] },
  { id: 'R8', name: 'world-data prose (culture, NPC, arrival, history, stress)', unit: 'sentence', files: [
    /^src\/data\/(cultureProfiles|npcData|narrativeData|spatialData|stressTypes|stressTypesMeta|supplyChainData|foundingSeeds|historyData|historyDescVariants|stressorSpinePhrases|geographyData|biomeTexture|powerData|resourceData)\.js$/,
    /^src\/domain\/(hookThemes|activeConditions|resourceSemantics)\.js$/,
    /^src\/generators\/narrative\/settlementOriginProse\.js$/,
  ] },
  { id: 'R9', name: 'chrome copy registry (src/copy)', unit: 'sentence', files: [/^src\/copy\//] },
  { id: 'R10', name: 'compendium docent + glossary + operations', unit: 'sentence', files: [
    /^src\/domain\/compendium\/(catalogData|bandLadders)\.js$/,
    /^src\/domain\/display\/glossary\.js$/,
    /^src\/store\/operationRegistry\.js$/,
  ] },
  { id: 'R11', name: 'event composer / realm verbs (DM authoring)', unit: 'sentence', files: [
    /^src\/domain\/events\//,
    /^src\/domain\/worldPulse\/(changeAuthorityPolicy|decisionTier|partyImpactKinds|partyImpact|realmManifest|affordanceManifest)\.js$/,
  ] },
  { id: 'R12', name: 'treaty / war-status / letter documents', unit: 'sentence', files: [
    /^src\/domain\/display\/(treatyDocument|treatySuccessionDossier|warStatus|threatAssessment|defenseDisplay|demographicReading|marketPrices|regionWakeReplay|chronicleReadModel|chroniclersLetter|chronicleTimeline|chronicleGraph)\.js$/,
    /^src\/domain\/worldPulse\/treatySuccessionVoice\.js$/,
  ] },
  { id: 'R14', name: 'generators runtime prose tables', unit: 'sentence', files: [/^src\/generators\//] },
  { id: 'R17', name: 'legacy rumor SUBJECT-PHRASE family (SUB-SENTENCE)', unit: 'phrase', files: [
    /^src\/domain\/display\/(rumorPhrasePools|rumorFallbackPhrasePools|rumorFallbackPhrasePoolsEvents|settlementRumors|rumorHeraldLink)\.js$/,
  ] },
  { id: 'R15', name: 'long tail elsewhere in src/*.js', unit: 'sentence', files: [/./] }, // catch-all, last
];

// ── ADMISSION ────────────────────────────────────────────────────────────────
// Slots are masked before the noise test so `{timeband_since}` is not read as snake_case.
const mask = (s) => s.replace(/\{[^}]*\}/g, '{}');
export const NOISE = [
  /::/,                              // pool keys / qualified ids
  /\s[·×→|]\s/,                      // annex + title separators, arrows, pipes
  /^[A-Z]{2,}-[A-Z]{2,}-\d/,         // block ids (DS-POP-1)
  /\b[a-z][a-z0-9]*[A-Z]/,           // camelCase engine token
  /[_<>]/,                           // snake_case token / markup
  /https?:\/\//,
  /\.(js|jsx|mjs|json|md|css|svg|png)\b/,
  /\b(function|const|return|typeof|undefined|null|NaN|Infinity)\b/,
  /^[^A-Za-z"“'({]/,                 // opens on something that is not a word, quote or slot
  // CSS and style values reaching the JSX walker (`repeat(auto-fit, minmax(min(100%, 220px), 1fr))`)
  /\b(repeat|minmax|calc|linear-gradient|radial-gradient|translate[XYZ]?|scale|rgba?|hsla?|var|url|clamp)\s*\(/,
  /\d\s*(px|rem|em|vh|vw|fr|ms|deg)\b/,
];
// Export paths that hold DEV-facing notes inside an otherwise reader-facing data table.
// Found by audit, not assumed: heraldJoinMolds.UNSUPPLIED_ARGS is a contract note table
// ("why no frame can be authored for it"), and it carries the only two em dashes in R4.
export const DEV_PATHS = [
  /^UNSUPPLIED_ARGS\b/,
  /^MOLD_NOTES\b/,
];
export const admit = (text, unit) => {
  const m = mask(text);
  const words = m.split(/\s+/).filter(Boolean).length;
  if (unit === 'phrase') { if (m.length < 8 || words < 2) return false; }
  else if (m.length < 20 || words < 4) return false;
  if (!/[a-z]/.test(m)) return false;
  return !NOISE.some((r) => r.test(m));
};
export const isSentenceShaped = (t) => /^[A-Z{“"']/.test(t.trim()) && /[.?!]["’')\]]?$/.test(t.trim());

if (import.meta.url === `file://${process.argv[1]}`) {
  const load = (f) => JSON.parse(readFileSync(path.join(S, f), 'utf8'));
  const all = [];
  for (const r of load('json-leaves.json')) all.push({ ...r, from: 'X1' });
  const walk = load('walk.json');
  const pickReg = (file) => {
    for (const R of REGISTERS) if (R.files && R.files.some((p) => p.test(file))) return R;
    return null;
  };
  for (const r of walk) {
    if (/^src\/data\/(dossierStateProse|dossierCausalProse)/.test(r.file)) continue; // X1 owns these
    const R = pickReg(r.file);
    if (!R) continue;
    if (DEV_PATHS.some((p) => p.test(r.p))) continue;
    all.push({ ...r, register: R.id, pool: r.p.replace(/\[\d+\]$/, ''), from: 'X2' });
  }
  // X5 inline: only rows X2 did NOT reach (by normalised key), and only in the prose homes
  const reached = new Set(walk.map((r) => norm(r.text)));
  for (const r of load('inline.json')) {
    if (reached.has(norm(r.text))) continue;
    all.push({ ...r, register: 'R18', pool: r.file, from: 'X5' });
  }
  for (const r of load('jsx.json')) {
    for (const h of r.hits) {
      all.push({ register: 'R16', file: r.file, p: r.file, pool: r.file, shape: /^src\/pdf\//.test(r.file) ? 'jsx-pdf' : 'jsx-chrome', viaFn: 0, text: h, from: 'X7' });
    }
  }
  for (const r of load('annex.json')) all.push({ ...r, register: r.register === 'ANNEX-WIRED' ? 'A-W' : 'A-U', from: 'X6' });

  const unitOf = (id) => (REGISTERS.find((R) => R.id === id) || {}).unit
    || (id === 'R16' ? 'sentence' : id === 'R18' ? 'sentence' : 'sentence');
  const kept = [];
  const rejected = [];
  const seen = new Map();
  for (const r of all) {
    const unit = unitOf(r.register);
    if (!admit(r.text, unit)) { rejected.push(r); continue; }
    const k = r.register + ' ' + norm(r.text);
    if (seen.has(k)) continue;
    seen.set(k, 1);
    kept.push({ ...r, unit, sentenceShaped: isSentenceShaped(r.text) ? 1 : 0 });
  }
  writeFileSync(OUT, JSON.stringify(kept));
  // stratified reject sample: up to 60 per register, so every column's filter is auditable
  const strat = {};
  const sample = [];
  for (const r of rejected) { strat[r.register] = (strat[r.register] || 0) + 1; if (strat[r.register] <= 60) sample.push(r); }
  writeFileSync(OUT.replace(/\.json$/, '.rejected.json'), JSON.stringify(sample));
  const tally = {};
  for (const r of kept) { (tally[r.register] ||= { n: 0, sent: 0, files: new Set(), pools: new Set() }); tally[r.register].n++; tally[r.register].sent += r.sentenceShaped; tally[r.register].files.add(r.file); tally[r.register].pools.add(r.pool); }
  const rej = {};
  for (const r of rejected) rej[r.register] = (rej[r.register] || 0) + 1;
  console.log('reg'.padEnd(6), 'unit'.padEnd(9), 'admitted'.padStart(9), 'sent-shaped'.padStart(12), 'files'.padStart(6), 'pools'.padStart(6), 'rejected'.padStart(9));
  for (const [id, t] of Object.entries(tally).sort()) {
    console.log(id.padEnd(6), unitOf(id).padEnd(9), String(t.n).padStart(9), String(t.sent).padStart(12), String(t.files.size).padStart(6), String(t.pools.size).padStart(6), String(rej[id] || 0).padStart(9));
  }
  console.log('TOTAL admitted:', kept.length, ' rejected:', rejected.length);
}
