import { readFileSync, writeFileSync } from 'node:fs';
const T = '/home/user/settlement-engine';
const pn = await import(`${T}/src/data/people/powerSentenceName.js`);
const dm = await import(`${T}/src/data/people/dmPowerLines.js`);
const hb = await import(`${T}/src/domain/display/heraldCausalGrammar.js`);
const L = readFileSync('slots60.jsonl', 'utf8').trim().split('\n').map(JSON.parse);
const the = (n, s = false) => pn.powerNameWithArticle(n, s);
const agree = (n, a, b) => pn.powerVerb(n, a, b);
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const ageWord = (y) => { const wk = y * 52; const b = hb.TIME_BANDS.find((x) => wk <= x.maxWeeks); return b.id === 'older_than_bearers' && wk < hb.LIVING_FLOOR.floorWeeks ? hb.LIVING_FLOOR.predicate : b.predicate; };
const seatVals = L.filter((o) => o.rulerProse && o.npc?.name).map((o) => { const r = o.npc.role; return { place: o.name, ruler: o.rulerProse, Ruler: cap(o.rulerProse), who: r ? `${o.npc.name}, ${r},` : o.npc.name, whoEnd: r ? `${o.npc.name}, ${r}` : o.npc.name, seed: o.seed }; });
const noneVals = L.filter((o) => o.hall?.rung === 'none').map((o) => ({ ruler: o.ruler, seed: o.seed, crime: o.crime }));
const openVals = L.flatMap((o) => o.lends.map((l) => ({ name: l.name, rank: l.rank, ruler: o.ruler, power: l.power, share: l.share, seed: o.seed })));
const legVals = L.filter((o) => o.legacy?.key === 'LEGACY-UNRESOLVED' && o.legacy.calamity).map((o) => ({ calamity: o.legacy.calamity, settlement: o.name, age: ageWord(o.legacy.yearsAgo), seed: o.seed }));
const chVals = L.filter((o) => o.charter).map((o) => ({ settlement: o.name, seed: o.seed }));
const tried = (vals, f, idx) => idx.filter((i) => vals[i]).map((i) => `${vals[i].seed}: ${f(vals[i])}`).join(' ‖ ');
const K = [];
const MK = 'the kind\'s second wording; THE RULE (the chair, 05:09 UTC): ONE WORDING A TOWN, ranked on the town\'s key, never per row; the test lines naming today\'s marks: A-marks-tests.txt';
const add = (key, home, reader, drawn, existing, lines, vals, idx) => K.push({ key, home, reader, drawn, existing, lines, vals, idx });
add('governanceAccountOf() :: the seat sentence', 'src/domain/display/governanceAccount.js:336-341',
  'Power tab paragraph and PDF; owner and shared page (no DM matter)',
  "view: arrangementOf(seed,'seat',3); under an occupation OCCUPIED_SEAT[i] (twins 0-2, same index) replaces it",
  '{place} is governed by {ruler}. {who} holds its seat. ‖ {who} holds the seat of {ruler}. {Ruler} governs {place}. ‖ {Ruler} governs {place}. Its seat is held by {whoEnd}.',
  [
    ['Orders in {place} go out in the name of {ruler}. {who} sits at its head.', (s) => `Orders in ${s.place} go out in the name of ${s.ruler}. ${s.who} sits at its head.`, 'how its rule shows: orders in its name', 'orders go out in the power\'s name (true of any governing power; still true where a capture leaves the hall "its title and its meetings")', 'none', 'seat held by a named person (pick(\'seat\', n))', 'Orders in {place} go out in the name of {ruler}, but only with the occupiers\' leave. {who} sits at its head. [crisis: occupied]'],
    ['Asked who governs {place}, people name {ruler}. Its seat is held by {whoEnd}.', (s) => `Asked who governs ${s.place}, people name ${s.ruler}. Its seat is held by ${s.whoEnd}.`, 'what people answer', 'people name it as governing (a judgment; holds in every standing band: even "Few still accept its right to rule" names who rules)', 'none', 'seat held by a named person', 'Asked who governs {place}, people name the occupiers first, then {ruler}. Its seat is held by {whoEnd}. [crisis: occupied]'],
    ['{Ruler} governs {place}. When it is blamed or thanked, the name people use is {whoEnd}.', (s) => `${s.Ruler} governs ${s.place}. When it is blamed or thanked, the name people use is ${s.whoEnd}.`, 'who takes the praise and the blame', 'the seat-holder is the power\'s public face (a judgment)', 'none', 'seat held by a named person', '{Ruler} answers to the occupiers of {place}. When it is blamed or thanked, the name people use is {whoEnd}. [crisis: occupied]'],
    ['{Ruler} governs {place}. Its seat has one holder at a time, and today that is {whoEnd}.', (s) => `${s.Ruler} governs ${s.place}. Its seat has one holder at a time, and today that is ${s.whoEnd}.`, 'the seat outlasts its holder', 'none', 'none', 'seat held by a named person', '{Ruler} answers to the occupiers of {place}. Its seat has one holder at a time, and today that is {whoEnd}. [crisis: occupied]'],
  ], seatVals, [0, 13, 30, 47]);
add('CAPTURE_LINES.none', 'src/data/people/dmPowerLines.js:256-265 (chosen in src/domain/people/patronage.js:205-228 hallOf)',
  'DM ONLY: Power tab DM panel and the PDF DM chapter ("The hall")',
  'view, NO DRAW: variant 0, except an organized syndicate (factsOf.crime) takes 1 (head, second and third all stand) or 2; hallReceipt (hallCapture.js:135) always 0. A new line needs a draw rule, and must hold beside an organized syndicate (POWERS-14)',
  'Nobody at the head of {ruler} answers to a criminal house, and no criminal power here is strong enough to push {it}. ‖ None of the head, the second and the third of {ruler} takes orders from the criminals. ‖ No criminal house gives {ruler} its orders. One that wants something from {it} has to ask, pay or wait like anyone else.',
  [
    ['{Ruler} {takes|take} no money and no orders from a criminal house.', (f) => `${the(f.ruler, true)} ${agree(f.ruler, 'takes', 'take')} no money and no orders from a criminal house.`, 'money', 'no bribe reaches the head (read from the rung: no allegiance among the ruling three, the ruler not criminal)', 'none', 'rung none, EVERY sub-branch: an alternate of variant 0, and true where the organized-syndicate rule picks 1 or 2 (it denies nothing of crime in the town)', ''],
    ['A complaint against a criminal, brought to {ruler}, is heard like any other.', (f) => `A complaint against a criminal, brought to ${the(f.ruler)}, is heard like any other.`, 'what happens to a complaint (the mirror of the corrupted rung\'s "A case ... goes nowhere")', 'the hall hears complaints, fairly (a judgment); says nothing of the hall deciding for itself (POWERS-15)', 'none', 'rung none, EVERY sub-branch: an alternate of variant 0, and true where the organized-syndicate rule picks 1 or 2 (it denies nothing of crime in the town)', ''],
    ['None of those who lead {ruler} has a hidden tie to a criminal house.', (f) => `None of those who lead ${the(f.ruler)} has a hidden tie to a criminal house.`, 'secrets: what the DM layer can see and the town cannot', 'none', 'none', 'rung none, EVERY sub-branch: an alternate of variant 0, and true where the organized-syndicate rule picks 1 or 2 (it denies nothing of crime in the town)', ''],
    ['Whatever trouble crime brings here, it does not start in the hall.', () => 'Whatever trouble crime brings here, it does not start in the hall.', 'where trouble starts (true beside an organized syndicate: it denies nothing of crime in the town)', 'none', 'none ("the hall" is the seat\'s own word on the same tab: governanceAccount.js CONSEQUENCE)', 'rung none, EVERY sub-branch: an alternate of variant 0, and true where the organized-syndicate rule picks 1 or 2 (it denies nothing of crime in the town)', ''],
  ], noneVals, [0, 30, 41, 50]);
add('PATRONAGE_LINES.open', 'src/data/people/dmPowerLines.js:234-243 (chosen in src/domain/people/patronage.js:254, 262, 303)',
  'DM ONLY: Power tab DM panel (the ruling three\'s "lends" rows, the boosts block) and the PDF DM chapter',
  'view, NO DRAW: the boosts block takes variant 0; a face\'s lends row takes 2 at rank 2, else 1 (askerLine, four forms by rank). A new line needs a draw rule',
  '{name}, {place}, also holds {share} in {power}, and that lends {power} weight {it} would not have on {its} own. ‖ askerLine(f) [by rank: heads / brings its requests through / is third in / steward] ‖ {name} serves {ruler} and {power} at once. While {name} holds both places, {power} {counts} for more here than {its} own members would make {it}.',
  [
    ['{name}, {place}, also holds {share} in {power}, so {ruler} {hears|hear} what {power} {wants|want} early.', (f) => `${f.name}, ${dm.patronPlace(f.rank, f.ruler)}, also holds ${dm.shareWords(f.share)} in ${the(f.power)}, so ${the(f.ruler)} ${agree(f.ruler, 'hears', 'hear')} what ${the(f.power)} ${agree(f.power, 'wants', 'want')} early.`, 'what the ruler gains: early word', 'the ruler learns the other power\'s wishes through the shared face (by the nature of a shared member)', 'none', 'the lends row at rank 1, 3 or steward (askerLine\'s branch: the face as a channel)', ''],
    ['When {ruler} and {power} want different things, {name}, {place}, has {share} in {power} to think of.', (f) => `When ${the(f.ruler)} and ${the(f.power)} want different things, ${f.name}, ${dm.patronPlace(f.rank, f.ruler)}, has ${dm.shareWords(f.share)} in ${the(f.power)} to think of.`, 'the divided loyalty', 'none', 'none', 'the lends row at rank 2 (variant 2\'s branch: one face serving both)', ''],
    ['While {name}, {place}, holds {share} in {power}, {power}{possessive} requests to {ruler} are seldom refused.', (f) => `While ${f.name}, ${dm.patronPlace(f.rank, f.ruler)}, holds ${dm.shareWords(f.share)} in ${the(f.power)}, ${the(f.power)}${pn.powerPossessive(f.power).slice(pn.powerSentenceName(f.power).length)} requests to ${the(f.ruler)} are seldom refused.`, 'what the weight shows as: requests granted', 'the power\'s requests are granted more often (a judgment, the weight variant 0 states)', 'none', 'the boosts block (variant 0\'s branch: the weight lent)', ''],
    ['{name}, {place}, holds {share} in {power}, so what {power} {gains|gain} is partly {name}\'s own gain.', (f) => `${f.name}, ${dm.patronPlace(f.rank, f.ruler)}, holds ${dm.shareWords(f.share)} in ${the(f.power)}, so what ${the(f.power)} ${agree(f.power, 'gains', 'gain')} is partly ${f.name}'s own gain.`, 'the face\'s own stake', 'none', 'none', 'the lends row, every rank (both of its branches)', ''],
  ], openVals, [0, 9, 18, 27]);
add('MARK_LINES', 'src/domain/display/crisisStoppedRow.js:108-117',
  'Services and Institutions tabs (owner and share), the PDF and the Foundry journal: the mark printed before each marked row',
  'view, NO DRAW: ONE line per crisis kind (the kind decides; a page prints its kind\'s mark on every row it touches: 1,593 prints on 113 pages). These are not co-eligible alternatives; a new line is a second wording OF A KIND',
  'Stopped by the siege. [under_siege] ‖ Curtailed by the outbreak. [plague_onset] ‖ Scarce in the famine. [famine] ‖ Curtailed by the siege. [under_siege:curtailed] ‖ Curtailed by the war. [wartime]',
  [
    ['At a standstill while the siege lasts. [under_siege; needs crisis: under_siege]', () => 'At a standstill while the siege lasts.', 'the work stands still, for as long as it lasts', 'none', 'none', MK, ''],
    ['Few come while the outbreak lasts. [plague_onset; needs crisis: plague_onset]', () => 'Few come while the outbreak lasts.', 'the people who stay away (the outbreak stops travellers and gatherings)', 'none', 'none', MK, ''],
    ['Less of it each week of the famine. [famine; needs crisis: famine]', () => 'Less of it each week of the famine.', 'it dwindles over time', 'the failed food grows scarcer week by week (a judgment)', 'none', MK, ''],
    ['Working on what the war left. [wartime; needs crisis: wartime]', () => 'Working on what the war left.', 'what remains to work with (the leaf\'s own reading: "the forge works what scrap it holds, the stables what the army left")', 'none', 'none', MK, ''],
  ], [], []);
add('DS-GEN-16.pools.LEGACY-UNRESOLVED', 'src/data/dossierStateProse/general.generated.js (DS-GEN-16); keyed in src/domain/display/stateProse/generalStateProse.js:692-704, composed at :2015-2019, :2231-2238',
  'History tab (the general desk\'s legacy position), owner and share; the PDF state prose',
  'view: composeStateProse over the pool (the annex\'s own draw). Keyed by the top legacy annotation\'s "left trouble that has never been put right" (political, economic, disaster, religious or magical event)',
  'The {calamity} left a legacy of trouble in {settlement} that has never been fully put right, and that legacy is {timeband_age}. ‖ Nobody in {settlement} has finished putting right the legacy the {calamity} left, and that legacy is {timeband_age}.',
  [
    ['In {settlement}, the {calamity} is still spoken of as unfinished business. It is {timeband_age}.', (v) => `In ${v.settlement}, the ${v.calamity} is still spoken of as unfinished business. It is ${v.age}.`, 'how people speak of it', 'people speak of it (a judgment)', 'none'],
    ['Some of what troubles {settlement} today began with the {calamity}, which is {timeband_age}.', (v) => `Some of what troubles ${v.settlement} today began with the ${v.calamity}, which is ${v.age}.`, 'the present: a trouble of today has its root here', 'none (every unresolved annotation names a present trouble: distrust of the rulers, the quarrel over who rules, money troubles, food shortages, exposure to hardship, the clergy\'s or the mages\' quarrel with the rulers)', 'none'],
    ['The {calamity} is {timeband_age}, and what it left unmended in {settlement} could still get worse.', (v) => `The ${v.calamity} is ${v.age}, and what it left unmended in ${v.settlement} could still get worse.`, 'what might go wrong', 'it could worsen (a judgment)', 'none'],
    ['The trouble the {calamity} left is {timeband_age}, and {settlement} has learned to live with it.', (v) => `The trouble the ${v.calamity} left is ${v.age}, and ${v.settlement} has learned to live with it.`, 'how the place copes', 'the town has adapted to it (a judgment)', 'none'],
  ], legVals, [0, 3, 7, 12]);
add('DS-DEF-5.pools.charter hall PRESENT (specialist monster response)', 'src/data/dossierStateProse/defense.generated.js (DS-DEF-5); keyed in src/domain/display/stateProse/defenseStateProse.js:1549-1553',
  'Defense tab, owner and share; the PDF state prose',
  'view: composeStateProse over the pool. Keyed by forces.charter.present (an adventurers\' charter hall, guild hall or hireling hall: priorityHelpers.js:76)',
  '{settlement} keeps a charter for specialist work. The things ordinary arms are wrong for go to people retained to handle exactly them. ‖ There is somewhere at {settlement} to take the problems that are not soldiers\' problems, and the town uses it more than it likes to say. ‖ {settlement} keeps a chartered hall for trouble that ordinary arms cannot handle, and the hall is busy.',
  [
    ['Those who sign on at {settlement}\'s charter hall carry arms, but they are hired hands, not a standing force.', (v) => `Those who sign on at ${v.settlement}'s charter hall carry arms, but they are hired hands, not a standing force.`, 'who they are', 'none', 'none'],
    ['The charter hall at {settlement} is paid by the job, not by the year.', (v) => `The charter hall at ${v.settlement} is paid by the job, not by the year.`, 'how it is paid', 'none (a hireling hall\'s nature)', 'none'],
    ['{settlement}\'s charter hall goes out after creatures from the wild. Keeping the peace at home is not its work.', (v) => `${v.settlement}'s charter hall goes out after creatures from the wild. Keeping the peace at home is not its work.`, 'what it is not for (the engine says the same: safetyProfile.js:565 "not equipped for civil enforcement")', 'none', 'none'],
    ['Not everyone who sets out from {settlement}\'s charter hall comes back.', (v) => `Not everyone who sets out from ${v.settlement}'s charter hall comes back.`, 'what goes wrong', 'some die at the work (a judgment of its nature)', 'none'],
  ], chVals, [0, 9, 18, 26]);
const H = ['key', 'home', 'who reads it', 'how it is drawn', 'existing lines (‖)', 'new line (template)', 'what it notices', 'claims', 'needs', 'slots used', 'values tried (birth: as rendered)', 'branch (the rule-branch the line is an alternate in)', 'OCCUPIED_SEAT twin (the seat only)'];
const rows = [H.join('\t')];
for (const k of K) for (const [tpl, f, notices, claims, needs, branch = '', twin = ''] of k.lines) {
  const slots = [...new Set([...tpl.replace(/\[.*?\]/g, '').matchAll(/\{([^}]+)\}/g)].filter((m) => !m[1].includes('|')).map((m) => m[1].split(',')[0].trim()))].join(', ') || 'none';
  const vals = k.vals.length ? tried(k.vals, f, k.idx) : 'no siege, famine or war town among the 60 births (one outbreak town, dp-village-5); fixed text';
  rows.push([k.key, k.home, k.reader, k.drawn, k.existing, tpl, notices, claims, needs, slots, vals, branch || '(the annex\'s own draw over the pool)', twin].map((c) => String(c).replace(/[\t\n]/g, ' ')).join('\t'));
}
writeFileSync(process.argv[2], `${rows.join('\n')}\n`);
console.log(rows.length - 1, 'rows');
