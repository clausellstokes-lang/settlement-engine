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
  ['V1a', /^onlyJust$/, /./, 'F', 'DS-ECO-9 food verdict keyed on the label alone (economyStateProse.js :: foodSecurityPoolKey; the corpus lines: W2-WRITE)', '1a'],
  ['V1b', /^smallMargin$/, /./, 'F', 'DS-ECO-9 food verdict keyed on the label alone (the corpus lines: W2-WRITE)', '1b'],
  ['V4b', /^almostLevel$/, /./, 'F', 'src/generators/power/factionStanding.js (W2-B-DECLARE, 4, later stage)', '4'],
  ['V8inc', /^religiousHouses$/, /religious houses (?:at|take in)|What the religious houses take/, 'F', 'DS-ECO-12 INCOME WEIGHT: the religious houses, marked colour (the corpus lines: W2-WRITE; the access wording declares `church access`)', '8'],
  ['VN2', /^practitioner$/, /people who work magic at|practitioners charge for/, 'F', 'DS-ECO-12 INCOME WEIGHT: the practice of magic, marked colour (the corpus lines: W2-WRITE; the practitioner atom waits)', 'NEW-2'],
  ['V3', /^practitioner$/, /every practitioner here would be|few practitioners|leans on its practitioners|depends on practitioners continuing|discussed \(carefully\) by the practitioners|practitioners hold real influence|practitioners are consulted|misuse alchemical/, 'F', 'magic reliance and the magic desks with no practitioner on the rolls (MagicTab view model, the magic faction lines: W2-A-LEAVES 3; the practitioner atom waits)', '3'],
  ['V20', /^siege$/, /under siege the outlying fields are lost|siege the outlying fields are lost/, 'F', 'src/domain/display/defenseDisplay.js :: foodEnduranceLine (W2-A-LEAVES, 2+20)', '20'],
  ['V16a', /^(?:powersCount|rulingFaces)$/, /ruling three of/, 'F', 'src/components/new/tabs/WhoRunsThisTownPanel.jsx (W2-B-DECLARE, 16a)', '16a'],
  ['V4', /^powersCount$/, /powers stand almost level/, 'F', 'src/generators/power/factionStanding.js (W2-B-DECLARE, 4)', '4'],
  ['VPOW', /^powersCount$/, /at least three powers|powers in .* are each waiting|all three powers will still speak|powers have stopped coming|playing both powers/, 'F', 'generator pools naming a count of powers (narrative / crisis / NPC secrets)', 'NEW-V1'],
  ['VPOW2', /^powersCount$/, /Two or three powers/, (f) => (factions(f.seed) < 2 ? 'F' : 'hedge'), 'src/domain/crisis (two or three powers): false only with one power', 'NEW-V1'],
  // F6 (the third seat): NEW-V2 is not a false line (a range row's own count: "Parish churches (2-5)"); WITHDRAWN as a finding
  ['VHOUSE', /^housesCount$/, /temples face each other/, 'withdrawn', 'generator pool: two temples facing', 'NEW-V2'],
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
  // F6: a true line over a DISAGREEMENT BETWEEN HOMES (filed as such, not as a line to cure)
  ['VWAR', /^war$/, /current condition: wartime pressure/, 'two-homes', 'a war_pressure condition named "Wartime pressure" where the war fact reads peace (conditionWords.js; the crisis leaf does not fold conditions: W2-A-LEAVES)', 'NEW-V7'],
  ['VOCC', /^occupation$/, /no occupying power on the roster/, 'two-homes', 'an occupied town whose roster names no occupier (crisisCast.js; the occupier leaf)', 'NEW-V8'],
  // F6: "no law enforcement" where a headman stands is TRUE (a headman is not law enforcement: `THINGS.lawEnforcement`); WITHDRAWN
  ['VLAW', /^(?:law|lawEnforcement)$/, /effectively no law enforcement|no law at .* but what the gang bosses/, 'withdrawn', 'a denial of law where a watch, garrison or judging house stands', 'NEW-V9'],
  // ── OTHER SENSES ─────────────────────────────────────────────────────────────────────────────
  // F9 (the third seat; REVIEW-W2B: "classes every hit attributed to four files as past without reading tense"): a hit is
  // PAST by its SENTENCE — a past-tense verb or a marker of time gone — whatever file wrote it; a present-tense hook falls through
  ['eventhook', /./, /./, (f) => (/\b(?:was|were|had|ago|once|came|fell|took|ended|survived|broke|burned|swept|struck|drove|left|lingered|remembers?|remembered|rebuilt|founded|former(?:ly)?|legacy|during|after the)\b/i.test(f.quote) ? 'past' : null), 'a past event, its hook or its character line, read by the sentence\'s own tense'],
  ['heading', /./, /^House of worship$|hedge practitioner or alchemical workshop|^(?:Siege|Disasters) & Famine|^The (?:\w+ )?(?:Procession|Fair|Feast) of the Market$|^The (?:Lesser |Long |Great )?Market (?:Feast|Fair|Procession|Day)s?$|^Popular Uprising$|^Succession Crisis$|^\w+Disaster(?:catastrophic|major|minor)|Disaster(?:catastrophic|major|minor)$|years?(?:major|minor|catastrophic)+$|crash(?:minor|major)+|^→|^\S+ of the \S+$|^[A-Z][a-z]+(?: [A-Z][a-z]+)?$/, 'heading', 'a category, an event name or a heading, not a claim about the town now'],
  ['elsewhere', /^(mill|temple|market|walls|religiousHouses)$/, /house of worship|external mill|to parish church|next village|outside the settlement|manor\/village mill|manor or village mill|manor mill|two settlements away|half the region|out to market|lord's mill|milling monopoly/, 'elsewhere', 'another place: an access row or the house the town walks to'],
  ['narrower', /^temple$/, /has no church of its own|church’s name are yours to set/, 'narrower', 'the word in a narrower sense: a wayside shrine is not a church (the faith reading\'s own words)'],
  ['need', /^mill$/, /^Needs: |^\w+: .*mill|^(?:[A-Z][a-z]+ ?)+(?:River|Iron|Coal|Hot|Fertile|Grazing|Marshlands)/, 'heading', 'a requirement or a resource chip, not a claim the house stands'],
  ['service', /^(famine|siege|garrison|mercenary|refugees|bank|docks|market|quarters|practitioner)$/, /against famine|famine prevention|hold off famine|prevents famine|final hold under siege|garrison duty|garrison contracts|garrison work|retired soldiers|old soldiers|sellswords do their drinking|refugee sanctuary|criminals and refugees|banking and minting|minting depend|by road or harbour|workers, mercenaries|black-market|Black market|lack market|Black Market|game to market|game at market|goes to market|selling the game in the market|congregations covering|practitioners who know what the client|practitioners outside guild oversight/, 'service', 'a house\'s own service or purpose, or the general trade'],
  ['figure', /^(war|bank|walls|plague|market|mercenary|powersCount)$/, /war between .* is fought|counting-house|sealed inside the walls|walls built with them|war, plague or politics|raise a levy or hire mercenaries|hire mercenaries/, 'figure', 'a figure of speech, a hedge or a building\'s own walls'],
  // F5 of REVIEW-W2B's second read: the `past` rule read words of the present ("still", "before", "years", "old") as the past;
  // it now reads TENSE as `eventhook` does: a past-tense verb or a marker of time gone. The fifth seat dropped the
  // quotation-mark marker (`^"|"$`): on the 720 it alone took 14 present-tense lines in 7 towns, among them the review's own
  // "The Religious Conflict is why the local clergy …", and no past one
  ['past', /./, /./, (f) => (/History|Plot Hooks|Overview|Relationships|Foundations|Crisis|NPCs/.test(f.view) && /\b(?:ago|was|were|had|once|came|fell|took|ended|survived|broke|burned|swept|struck|drove|lingered|remembered|rebuilt|founded|began|grew|established|shaped|former(?:ly)?|lived through|came through|wake of|used to|that time|in those days|by:|trial:)\b|^[A-Z][^ ]* by:/i.test(f.quote) ? 'past' : null), 'a past event, its hook, or a founding'],
];

// the tree's own source files, so an owner named by its file alone ("economyStateProse.js") resolves to its path (F11)
const ROOT = process.env.TREE || process.cwd();
const SRC_FILES = [];
const walk = (rel) => { try { for (const e of fs.readdirSync(`${ROOT}/${rel}`).sort()) { const q = `${rel}/${e}`; if (fs.statSync(`${ROOT}/${q}`).isDirectory()) walk(q); else if (/\.(?:js|jsx|mjs)$/.test(e)) SRC_FILES.push(q); } } catch { /* no tree */ } };
walk('src');
const CORPUS_FILES = SRC_FILES.filter((x) => /^src\/data\/dossier(?:State|Causal)Prose/.test(x));
const CORPUS_TEXT = new Map(CORPUS_FILES.map((x) => [x, fs.readFileSync(`${ROOT}/${x}`, 'utf8')]));
const WORDS = await (async () => { try { return (await import(`${ROOT}/src/domain/facts/registeredWords.js`)).REGISTERED_WORDS; } catch { return {}; } })();
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
  const row = { ...f, ...(hit || { rule: '?', class: '?' }) };
  // F11 (the third seat; REVIEW-W2B: "the by-source table understates code and the corpus"): a finding the fragment match
  // left unattributed is attributed through its pattern rule's NAMED OWNER (the `src/…` path the rule's reason names)
  if (row.source === 'unattributed' && hit && typeof hit.why === 'string') {
    const named = /[\w/.-]+\.(?:jsx|mjs|js)\b/.exec(hit.why)?.[0];
    const owner = named && (named.startsWith('src/') ? named : SRC_FILES.find((x) => x.endsWith(`/${named}`)));
    if (owner) Object.assign(row, { file: owner, attributedBy: 'owner',
      source: /dossierStateProse\/|dossierCausalProse\.generated/.test(owner) ? 'corpus pool' : /^src\/(data|generators)\//.test(owner) ? 'generator code' : 'written in code' });
  }
  // F6 of REVIEW-W2B's second read: a row still unattributed, whose rule's reason or whose WORD's own leaf names a corpus
  // block (`DS-ECO-9`), is attributed to the generated leaf that holds that block. A leaf that names only a truth home
  // (`foodBalance.js`, `the record :: tier`) names no writer, so it attributes nothing.
  if (row.source === 'unattributed') {
    const block = /\bDS-[A-Z]+-\d+\b/.exec(`${hit?.why || ''} ${WORDS[f.word]?.leaf || ''}`)?.[0];
    const leafFile = block && CORPUS_FILES.find((x) => new RegExp(`\\b${block}\\b`).test(CORPUS_TEXT.get(x)));
    if (leafFile) Object.assign(row, { file: leafFile, attributedBy: 'block', source: 'corpus pool' });
  }
  out.push(row);
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
