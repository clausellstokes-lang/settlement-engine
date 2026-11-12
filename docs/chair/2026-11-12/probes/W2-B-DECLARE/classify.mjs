// Classify the page measure's findings: FINDING (a line false on its town; to cure) or a word read in another sense.
// node classify.mjs <page.json> <corpus.ndjson.gz> <out.json>
import fs from 'node:fs'; import zlib from 'node:zlib';
const [, , PAGE, CORPUS, OUT] = process.argv;
const { findings } = JSON.parse(fs.readFileSync(PAGE, 'utf8'));
const towns = new Map(zlib.gunzipSync(fs.readFileSync(CORPUS)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const factions = (seed) => (towns.get(seed)?.powerStructure?.factions || []).length;

// [id, word regex, quote regex, class, reason-or-owner, pattern]
// class F = a FINDING (printed false on its town); otherwise a reason a word is read in another sense.
const RULES = [
  // ── FINDINGS ─────────────────────────────────────────────────────────────────────────────────
  ['V20', /^siege$/, /under siege the outlying fields are lost|siege the outlying fields are lost/, 'F', 'src/domain/display/defenseDisplay.js :: foodEnduranceLine (W2-A-LEAVES, 2+20)', '20'],
  ['V16a', /^powersCount$/, /ruling three of/, 'F', 'src/components/new/tabs/WhoRunsThisTownPanel.jsx (W2-B-DECLARE, 16a)', '16a'],
  ['V4', /^powersCount$/, /powers stand almost level/, 'F', 'src/generators/power/factionStanding.js (W2-B-DECLARE, 4)', '4'],
  ['VPOW', /^powersCount$/, /at least three powers|powers in .* are each waiting|all three powers will still speak|powers have stopped coming|playing both powers/, 'F', 'generator pools naming a count of powers (narrative / crisis / NPC secrets)', 'NEW-V1'],
  ['VPOW2', /^powersCount$/, /Two or three powers/, (f) => (factions(f.seed) < 2 ? 'F' : 'hedge'), 'src/domain/crisis (two or three powers): false only with one power', 'NEW-V1'],
  ['VHOUSE', /^housesCount$/, /temples face each other/, 'F', 'generator pool: two temples facing', 'NEW-V2'],
  ['V14food', /^quarters$/, /urban food supply/, 'F', 'src/data/cultureProfiles.js foodways via foodGenerator.js (W2-B-DECLARE, 14; foodGenerator.js held by the upkeep lane)', '14'],
  ['V14hist', /^(quarters|mill|temple)$/, /lower districts|whole districts|entire districts|riverside quarter|merchants' quarter|temple district|residential district|mill and lumber district|sawmill district|harbour and coastal districts|affected district|altering a di|whole quarters/, (f) => (f.word === 'quarters' ? 'F' : 'past'), 'history disaster place words (historyTemplate.js / historyEventStrands.js; W2-B-DECLARE, 14 second form)', '14b'],
  ['V14code', /^quarters$/, /merchant quarter|merchant district|kin districts|organized neighborhoods|controls a district|controls a distinct district|in a district that hasn|same district on night patrol|lower districts, still going on|city gardens|urban groves|hold whole districts/, 'F', 'size words written for a large place, printed in a small one', '14c'],
  ['V14def', /^quarters$/, /districts are closed off|contested districts|revolt-held districts|rebels hold some districts|holds a district of|one district goes unpunished|districts of .* are closed off|some districts are closed/, 'F', 'crisis and defence lines naming districts in a small place (safetyProfile.js crisis effects; the corpus DS-DEF pools)', '14c'],
  ['VMILL', /^mill$/, /a mill standing idle|the ground gives it/, 'F', 'a line presuming a mill the town lacks (isolation line; corpus DS resources)', 'NEW-V3'],
  ['VMKT', /^market$/, /Fewer people come to market|market still opens|debating market levies/, 'F', 'a line presuming a market the town lacks (crisis effect; narrative; council business)', 'NEW-V4'],
  ['VCHURCH', /^temple$/, /church wants approval rights|church is demanding veto|church court|church-guided/, 'F', 'a church power or court with no sacred house on the roster (powerSiblings.js; faction labels)', '8'],
  ['VMERC', /^mercenary$/, /escort & mercenary hire|Mercenary hire/, 'F', 'the escort chain named for mercenaries where no hired company stands (computeActiveChains.js; the chain card: W2-C-LEAVES, 11)', '11'],
  ['VCHAIN', /^mill$/, /River Mill Industry/, 'F', 'a chain card naming a mill industry running where only access to an external mill stands (the chain card: W2-C-LEAVES, 11; computeActiveChains.js)', '11'],
  ['VGRAN', /^granary$/, /holds the keys, the seals, and the granary/, 'F', 'a succession line presuming a granary the town lacks', 'NEW-V5'],
  ['VSEAT', /^succession$/, /vote on the empty seat/, 'F', 'a hook presuming an empty seat with no succession crisis in force', 'NEW-V6'],
  ['VWAR', /^war$/, /current condition: wartime pressure/, 'F', 'a war_pressure condition named "Wartime pressure" where the war fact reads peace (conditionWords.js; the crisis leaf does not fold conditions: W2-A-LEAVES)', 'NEW-V7'],
  ['VOCC', /^occupation$/, /no occupying power on the roster/, 'F', 'an occupied town whose roster names no occupier (crisisCast.js; the occupier leaf)', 'NEW-V8'],
  ['VLAW', /^law$/, /effectively no law enforcement|no law at .* but what the gang bosses/, 'F', 'a denial of law where a watch, garrison or judging house stands', 'NEW-V9'],
  // ── OTHER SENSES ─────────────────────────────────────────────────────────────────────────────
  ['eventhook', /./, /./, (f) => (/historyData\.js|historyGenerator\.js|historyDescVariants\.js|narrativeText\.js/.test(f.file) ? 'past' : null), 'a past event, its hook or its character line (the history pools)'],
  ['heading', /./, /^(?:Siege|Disasters) & Famine|^The (?:\w+ )?(?:Procession|Fair|Feast) of the Market$|^The (?:Lesser |Long |Great )?Market (?:Feast|Fair|Procession|Day)s?$|^Popular Uprising$|^Succession Crisis$|^\w+Disaster(?:catastrophic|major|minor)|Disaster(?:catastrophic|major|minor)$|years?(?:major|minor|catastrophic)+$|crash(?:minor|major)+|^→|^\S+ of the \S+$|^[A-Z][a-z]+(?: [A-Z][a-z]+)?$/, 'heading', 'a category, an event name or a heading, not a claim about the town now'],
  ['elsewhere', /^(mill|temple|market|walls)$/, /external mill|to parish church|next village|outside the settlement|manor\/village mill|manor or village mill|manor mill|two settlements away|half the region|out to market|lord's mill|milling monopoly/, 'elsewhere', 'another place: an access row or the house the town walks to'],
  ['narrower', /^temple$/, /has no church of its own|church’s name are yours to set/, 'narrower', 'the word in a narrower sense: a wayside shrine is not a church (the faith reading\'s own words)'],
  ['need', /^mill$/, /^Needs: |^\w+: .*mill|^(?:[A-Z][a-z]+ ?)+(?:River|Iron|Coal|Hot|Fertile|Grazing|Marshlands)/, 'heading', 'a requirement or a resource chip, not a claim the house stands'],
  ['service', /^(famine|siege|garrison|mercenary|refugees|bank|docks|market|quarters)$/, /against famine|famine prevention|hold off famine|prevents famine|final hold under siege|garrison duty|garrison contracts|garrison work|retired soldiers|old soldiers|sellswords do their drinking|refugee sanctuary|criminals and refugees|banking and minting|minting depend|by road or harbour|workers, mercenaries|black-market|Black market|lack market|Black Market|game to market|game at market|goes to market|selling the game in the market|congregations covering/, 'service', 'a house\'s own service or purpose, or the general trade'],
  ['figure', /^(war|bank|walls|plague|market|mercenary|powersCount)$/, /war between .* is fought|counting-house|sealed inside the walls|walls built with them|war, plague or politics|raise a levy or hire mercenaries|hire mercenaries/, 'figure', 'a figure of speech, a hedge or a building\'s own walls'],
  ['past', /./, /./, (f) => (/History|Plot Hooks|Overview|Relationships|Foundations|Crisis|NPCs/.test(f.view) && /\b(?:old|ago|years|left|after|before|that time|lived through|remember|still|legacy|came through|aside|defining|wake of|shaped|date|founded|began|grew|established|was|were|had|by:|trial:|records|letter|story|survives|accounts)\b|^"|"$|^[A-Z][^ ]* by:|used to/.test(f.quote) ? 'past' : null), 'a past event, its hook, or a founding'],
];

const out = [];
const unclassed = [];
for (const f of findings) {
  let hit = null;
  for (const [id, w, re, cls, why, pattern] of RULES) {
    if (!w.test(f.word) || !re.test(f.quote)) continue;
    const c = typeof cls === 'function' ? cls(f) : cls;
    if (!c) continue;
    hit = { rule: id, class: c, why, pattern: c === 'F' ? pattern : undefined };
    break;
  }
  if (!hit) unclassed.push(f);
  out.push({ ...f, ...(hit || { rule: '?', class: '?' }) });
}
fs.writeFileSync(OUT, JSON.stringify(out));
const T = (fs2) => new Set(fs2.map((f) => f.seed)).size;
const by = (fs2, k) => { const m = {}; for (const f of fs2) { m[f[k]] ||= [0, new Set()]; m[f[k]][0]++; m[f[k]][1].add(f.seed); } return Object.fromEntries(Object.entries(m).map(([a, [n, s]]) => [a, `${n} lines / ${s.size} towns`])); };
console.log('classified', out.length, 'unclassed', unclassed.length);
console.log('by class', by(out, 'class'));
const F = out.filter((f) => f.class === 'F');
console.log('FINDINGS', F.length, 'towns', T(F));
console.log('by pattern', by(F, 'pattern'));
console.log('by source', by(F, 'source'));
console.log('by layer', by(F, 'layer'));
for (const u of [...new Map(unclassed.map((f) => [f.word + f.quote.slice(0, 60), f])).values()].slice(0, 60)) console.log('UNCLASSED', u.word, u.view, '|', u.quote.slice(0, 140));
