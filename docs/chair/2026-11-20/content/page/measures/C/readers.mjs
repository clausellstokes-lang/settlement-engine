// PAGE-1 helper C, F4 (added work): EVERY READER OF A CARD'S `influence` (and of `power`, the 1-10 number drawn in the same
// band, npcGenerator.js:76) across src/, by grep, each with what it does (INFERRED from reading the line; the class
// in brackets: BIRTH = read while the town is forged, so it moves stored bytes; STORED = copied into a stored/persisted
// record; FINGERPRINT; DISPLAY; EXPORT = pdf/foundry/world book; PULSE = the world simulation).
// Run from the repository root:
//   node docs/chair/2026-11-20/content/page/measures/C/readers.mjs "$PWD" > docs/chair/2026-11-20/content/page/measures/C/readers.out.txt 2>&1
import { execFileSync } from 'node:child_process';

const [tree = process.cwd()] = process.argv.slice(2);
const grep = (re) => { try { return execFileSync('grep', ['-rnE', re, 'src', '--include=*.js', '--include=*.jsx', '--include=*.ts'], { cwd: tree, encoding: 'utf8' }).split('\n').filter(Boolean); } catch { return []; } };
const NOTE = [
  [/npcGenerator\.js:16[23]/, 'BIRTH writer: the band of the POOL role (generateNPCPowerLevel)'],
  [/castPowers\.js:59[4-9]/, 'BIRTH writer: raiseToBand, the dual hat / noble body / claimant raised to a band'],
  [/factionRoles\.js:264/, 'BIRTH writer: a synthesized structural leader, from importance'],
  [/resolveCrisisCast\.js:94/, 'BIRTH writer: a crisis cast face, low'],
  [/npcStructure\.js:552/, 'BIRTH reader: low -> the stable head row takes its LOW_STANDING_TWIN (structuralPosition prose)'],
  [/relationshipArchetypes\.js:1[23]/, 'BIRTH reader of power: |powerDiff| >= 4 picks mentor_legacy/old_debt AND takes a _rng() (:42-43), so a moved band shifts the draw stream'],
  [/aiLayer\.js:182/, 'BIRTH/AI: keyNPCs (high) handed to the narrative layer'],
  [/structuralFingerprint\.js:128/, 'FINGERPRINT: influence_dist counted'],
  [/npcProfile\.js:58[12]/, 'STORED: copied into the npc profile'],
  [/entities\/npcs\.js/, 'STORED: the entity record carries it'],
  [/mutateEntities\.js/, 'STORED: an event payload writes it (DM edit / event)'],
  [/buildEvent\.js:91/, 'STORED: an event composer sets it from importance'],
  [/successorNpc\.js/, 'PULSE: a successor inherits the ousted card\'s band'],
  [/npcVerdictApply\.js/, 'PULSE: a verdict zeroes it'],
  [/publicSafe\.js|galleryVeil\.js/, 'DISPLAY/PUBLIC: allow-listed onto the public projection'],
  [/npcComponents\.jsx|NPCsTab\.jsx|SummaryTab\.jsx|npcInteriorityRead\.js/, 'DISPLAY: dots, Standing word, filter, sort, counts'],
  [/plotHooks\.js|dossierSearch\.js|tonightAtTheTable\.js|settlementQuickGuide\.js|warResolve\.js|crisisCast\.js/, 'DISPLAY/ORDER: ranks or labels people by it'],
  [/pdf\/|generateCampaignPDF|generateWorldBook|foundry\//, 'EXPORT: printed or filtered in an export'],
  [/AdminTrendsPanel/, 'ADMIN: a column'],
];
const note = (l) => (NOTE.find(([re]) => re.test(l)) || [null, '(not a card field: a faction\'s or event\'s own `influence`, or prose)'])[1];
for (const [title, re] of [['n.influence (any object\'s .influence / influence: key)', String.raw`\.influence\b|\binfluence\s*:`], ['the card\'s power number (npc|n|card|ousted|a|b).power', String.raw`\b(npc|n|card|ousted|candidate)\.power\b|factionA\.power - factionB\.power|\bnpc\.power\b`]]) {
  const rows = grep(re).filter((l) => !/^\S+:\d+:\s*(\*|\/\/)/.test(l));
  console.log(`\n${title}: ${rows.length} lines`);
  for (const l of rows) console.log(`  ${l.replace(/^(\S+?:\d+):\s*/, '$1  ').slice(0, 150)}\n      -> ${note(l)}`);
}
