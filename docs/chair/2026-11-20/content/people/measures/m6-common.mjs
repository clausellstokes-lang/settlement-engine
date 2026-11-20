// PEOPLE-2 seat M6 (2026-11-20), copied from m4-common.mjs (PEOPLE-1 seat M4); changed: the keyed pick is pickVariantMixed (reimplemented below), and a description is cut into its OPENING and its standing CODAS (CODAS below), each counted by the sentence.
// own sentence shapes, quoted from src/generators/factionDynamics.js and src/generators/power/*.js), and the atom reader the
// projection uses over the facts m4-births.mjs cached (each atom named as src/domain/facts/factVocabulary.js names it).

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** The chair's mask (census.mjs): the place's own names -> '#', digits -> '0'. */
export const maskerOf = (names) => {
  const list = [...names].sort((a, b) => b.length - a.length);
  const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
  return (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');
};
export const pct = (a, b) => (b ? `${Math.round((100 * a) / b)}%` : '-');
export const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

// ── factionRelationships[].narrative: the branch that wrote a row (factionDynamics.js :: computeFactionRelationships and the
// two capture builders; withConflictRelations' twins; rosterText.js :: settleNarrativesToRoster's sibling; rulingPower.js) ──
const TWIN_TAIL = / Even so, the two are now at odds over [^.]+\.$/;
/** @returns {{ branch: string, twin: boolean }} */
export function relationBranch(row) {
  const n = String(row.narrative || '');
  if (row.captureState !== undefined) return { branch: `${/ is a front\.| has bought key people in | leaves .+ alone because | is hunting .+ in earnest but not catching/.test(n) ? 'GC' : 'CM'}.${row.captureState}`, twin: false };
  const twin = TWIN_TAIL.test(n);
  const b = n.replace(TWIN_TAIL, '');
  const R = [
    ['GM.occ', /^.+ carries out what .+ decides\.$/, () => row.type === 'tense' || row.type === 'competitive'],
    ['GM.sub+soldiers', /^.+ carries out what .+ decides\. The soldiers enforce the law; they do not make it\.$/],
    ['GM.sub', /^.+ carries out what .+ decides\.$/],
    ['GM.sym', /^.+ gives the orders and .+ carries them out; each needs the other to stay strong\.$/],
    ['GM.tense', /^.+ is now about as strong as .+\. The hall asks for .+ agreement instead of giving orders, and less and less is decided without it\.$/],
    ['GM.comp+strongest', /^.+ no longer takes orders from .+\. .+ keeps the title; .+ makes the decisions that matter\.$/],
    ['GM.comp', /^.+ no longer takes orders from .+\.$/],
    ['GE.comp', /^Day-to-day trade here is run by .+ more than by .+, and taxes are bargained over, not ordered\.$/],
    ['GE.comp(occupied)', /^Day-to-day trade here is run by .+ more than by [^,]+\.$/],
    ['GE.dep', /^.+ needs the taxes and loans of .+, and .+ (needs|need) .+ to enforce (its|their) contracts and keep the law\. Neither can afford to ruin the other\.$/],
    ['GE.sub', /^.+ (works|work) under the rules .+ sets, and (pays|pay) for a hearing in the hall when it wants something\.$/],
    ['GR.theo', /are the same people in practice; the hall rules because the faith says it may\.$/],
    ['GR.tense', /^People take their marriages, inheritances and hard times to .+, not to .+, and the two do not agree on who decides what\.$/],
    ['GR.dep', /^.+ holds the seat and collects the taxes; .+ (tells|tell) people that .+ rule is right and ordained\. Each props up the other\.$/],
    ['GR.dep(occupied)', /^.+ holds the seat; .+ (tells|tell) people that .+ rule is right and ordained\. Each props up the other\.$/],
    ['GR.dep-twin', /long told people that .+ rule is right and ordained, but the two are now at odds over /],
    ['MC.comp', /^.+ (buys|buy) the materials, (sets|set) the prices and (sells|sell) the goods; .+ only (makes|make) them, and (its|their) masters are becoming hired hands in all but name\.$/],
    ['MC.vote-against', /^.+ and .+ vote together against .+, then fight over who keeps the profit\.$/],
    ['MC.vote', /^.+ and .+ vote together whenever trade is at stake, then fight over who keeps the profit\.$/],
    ['MC.atOdds', /^.+ and .+ are at odds over .+, and fight over who keeps the profit of the trade\.$/],
    ['MC.masters', /^Only the masters of .+ know how to make what .+ (sells|sell), so the merchants pay their price\.$/],
    ['MR.tense', /^.+ and .+ want the same households' money: tithes on one side, debts and contracts on the other\. Church land exemptions and the church's rules on lending are a standing grievance with the merchants\.$/],
    ['MR.comp', /^.+ now (has|have) more money than .+ (has|have) sway\. Merchants pay for churches, (hospitals|charities) and indulgences, and they set the terms\.$/],
    ['MR.dep', /^The money of .+ pays for the charity of .+, and the charity keeps the poor quiet\. Each needs the other, and neither likes it\.$/],
    ['NG.tense', /^.+ (holds|hold) old rights .+ cannot take away; nothing about land, inheritance or levies gets done without (its|their) agreement\.$/],
    ['NG.dep', /^.+ (lives|live) under the rule of .+ but (keeps|keep) enough rights of (its|their) own \((land, courts, levies|land, levies)\) to bargain, not simply obey\.$/],
    ['NG.sub', /^.+ still (has|have) (its|their) titles, but (merchant money and )?the hall's offices have taken most of (its|their) power\.$/],
    ['RP.behind', /is the power behind the /],
    ['RP.lost', /moved for the seat and lost\./],
  ];
  for (const [id, re, gate] of R) if (re.test(b) && (!gate || gate())) return { branch: id, twin };
  return { branch: 'OTHER', twin };
}

// ── the atom reader over the cached facts (the vocabulary's own names; each line of the pools declares its atoms) ──
const PROSPERITY = ['subsistence', 'struggling', 'poor', 'moderate', 'comfortable', 'prosperous', 'wealthy'];
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const band = (order, have, op, want) => {
  const a = order.indexOf(have); const b = order.indexOf(want);
  if (a < 0 || b < 0) return false;
  return op === '≥' ? a >= b : op === '≤' ? a <= b : op === '>' ? a > b : op === '<' ? a < b : a === b;
};
/** One atom over the cached facts (true / false); `ctx` carries the row's or the power's own facts. */
export function atomHolds(atom, F, ctx = {}) {
  const m = /^(\w[\w ]*?):\s*(≥|≤|>|<|=)?\s*(.+)$/.exec(atom);
  if (m) {
    const [, dim, op = '=', val] = m;
    if (dim === 'prosperity') return band(PROSPERITY, F.prosperity, op, val);
    if (dim === 'tier') return band(TIERS, F.tier, op, val);
    if (dim === 'population') return F.populationBand === val;
    if (dim === 'ruler') return F.rulerKind === val;
    if (dim === 'institution') return !!F[val];
    if (dim === 'trade at work') return F.tradeAtWork?.[val] === true;
    if (dim === 'route') return F.route === val;
    if (dim === 'crisis') return val === 'calm' ? F.crisisKinds.length === 0 : F.crisisKinds.includes(val);
    throw new Error(`atom ${atom}`);
  }
  const map = {
    church: F.hasChurch, 'church access': F.faithAccessOnly, priest: !!F.seniorCleric, temple: F.temple, sacredHouse: F.sacredHouse,
    hospital: F.hospital, healer: F.healer, market: F.market, guild: F.guild, exports: F.exports.length > 0, imports: F.imports.length > 0,
    'ruling body': F.rulingBody, 'seat members': F.seatMembers, 'rival power': F.rivalPower, 'seat outranked': F.seatOutranked,
    walls: F.walls, watch: F.watch, militia: F.militia, garrison: F.garrison, mercenary: F.mercenary, soldiers: F.soldiers,
    'paid watch': F.paidWatch, 'court sits': F.courtSits, court: F.court, 'legal house': F.legalHouse, 'appointed post': F.appointedPost,
    docks: F.docks, 'legitimacy crisis': F.legitimacyCrisis, sovereign: F.sovereign,
  };
  if (!(atom in map)) throw new Error(`atom ${atom}`);
  return !!map[atom];
}
/** A line is eligible where every `needs` atom holds and no `excludes` atom does (the vocabulary's conjunction). */
export const admits = (line, F, ctx) => (line.needs || []).every((a) => atomHolds(a, F, ctx)) && !(line.excludes || []).some((a) => atomHolds(a, F, ctx));

// ════ M6 additions ════

// ── the keyed pick (the chair's verdict item 4): `pickVariantMixed` of src/kernel/proseHash.js on origin/lane/kernel-mix-2026-11-20
// at bd42d63c7, REIMPLEMENTED here (src/ is not changed; m6-measure.mjs checks it against that commit's own function on 20,000
// keys when the file is handed to it): pool[mix32(fnv1a32(String(seed))) % pool.length], index 0 for a falsy seed ──
export function fnv1a32(str) {
  let h = 0x811c9dc5;
  const s = String(str);
  for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
export function mix32(h) {
  h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return h >>> 0;
}
export function pickVariantMixed(pool, seed) {
  if (!Array.isArray(pool) || pool.length === 0) return undefined;
  if (pool.length === 1 || !seed) return pool[0];
  return pool[mix32(fnv1a32(String(seed))) % pool.length];
}

// ── the standing codas: every sentence src/generators/power/factionStanding.js :: annotateFactionStanding appends to a
// description (re-settled to the final roster by power/rosterText.js :: settleStandingToRoster, which writes the same
// sentences). Each is matched by its own words; a name or force word it carries is a capture ([^.;:]*? never crosses a
// sentence). `crime: true` marks a coda that states a fact about crime (item 5: no wording of ours may need one). ──
const N = '([^\\s.;:][^.;:]*?)';
export const CODAS = [
  { id: 'narrowGap', re: `The gap between them and ${N} is narrow\\. A single shift in patronage, scandal, or armed muscle could swap their positions\\.`, cond: 'rank 1, not governing, the gap to the first ≤ 6' },
  { id: 'noOneLeads', re: 'No one clearly leads here; one scandal or one lost ally could change who does\\.', cond: 'rank 1, gap ≤ 6, no first power named' },
  { id: 'contested', re: 'Close enough now to contest the seat, and they know it\\.', cond: 'rank 1, the coup reading Contested, this power its first challenger' },
  { id: 'inShadow', re: `They operate in the shadow of ${N}, close enough to matter and too far behind to lead\\.`, cond: 'rank 1, not governing, the gap to the first 7–14' },
  { id: 'strongEnough', re: 'They are strong enough to resist those above them, but too far behind to risk an open fight\\.', cond: 'rank 1, gap 7–14, no first power named' },
  { id: 'behindBy', re: `Behind ${N} by too much to challenge openly, so they get their way through petitions and procedure instead\\.`, cond: 'rank 1, not governing, the gap to the first > 14' },
  { id: 'orderSettled', re: 'The order is settled for now; they are busy holding on to second place and make no move on first\\.', cond: 'rank 1, gap > 14, no first power named' },
  { id: 'levelPowers', re: '(Three|Four|Five|Six|Many) powers stand almost level here, and no one leads; every (council vote|decision) has to be bargained for\\.', cond: 'rank 2, within 5 above and below, the top two within 5, three or more level' },
  { id: 'atTable', re: 'They are always at the table, but cannot set their own terms\\.', cond: 'rank 2, within 5 above and below (not three level) or more than 10 below the power above' },
  { id: 'worthBuying', re: `Close enough to the two above that their support is worth buying; they play ${N} and ${N} against each other when they can\\.`, cond: 'rank 2, 6–10 below the power above' },
  { id: 'fewMatters', re: 'They have a say on only a few matters; on everything else they side with whoever will deal with them that week\\.', cond: 'the last rank, power < 7, 5 or more below the power above' },
  { id: 'craftAheadOfMerchant', re: 'The craft guilds currently carry more weight than they do, and the merchants are working to change that\\.', cond: 'a merchant power, the craft guild above it' },
  { id: 'craftClose', re: 'The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council\\.', cond: 'a merchant power, the craft guild within 8 below and not Minor/Suppressed' },
  { id: 'outpaced', re: 'The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not\\.', cond: 'a merchant power, the craft guild 8 or more below or weak' },
  { id: 'outvoted', re: 'The merchants consistently outvote them on pricing and labour standards, so craft masters now win what they can by adding their own conditions to each deal\\.', cond: 'a craft guild, the merchants more than 8 above (or above a weak guild)' },
  { id: 'runningClose', re: 'Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods\\.', cond: 'a craft guild, the merchants 1–8 above, the guild not weak' },
  { id: 'craftAhead', re: 'Ahead of the merchant guilds in current influence: an unusual position they intend to hold\\.', cond: 'a craft guild at or above the merchants' },
  { id: 'guardFar', crime: true, re: 'The ([a-z ]+?) is far stronger\\. They survive by bribing the lower ranks and making it costly to arrest the wrong people\\.', cond: 'thieves, the guard more than 10 above' },
  { id: 'thievesPull', crime: true, re: 'They have more real pull than the military right now: officers on their payroll, and commanders who know better than to ask questions\\.', cond: 'thieves, more than 10 above the guard' },
  { id: 'thievesEven', crime: true, re: 'They are roughly even with the military: the ([a-z ]+?) can arrest their people, and the guild can make every investigation costly\\.', cond: 'thieves, within 10 of the guard, the seat not bought' },
  { id: 'guildStronger', crime: true, re: 'The guild is stronger than they are\\. They can only make arrests where it is safe to, and everyone knows it\\.', cond: 'the guard, the thieves more than 10 above' },
  { id: 'guardStronger', crime: true, re: 'They are stronger than the guild, enough to keep it down but not to stamp it out\\.', cond: 'the guard, more than 10 above the thieves' },
  { id: 'slowWar', crime: true, re: 'A slow war with the guild: arrests are made, the gangs rebuild, deals are struck and quietly broken\\.', cond: 'the guard, within 10 of the thieves' },
  { id: 'networkReaches', crime: true, re: 'The criminal network reaches further than the merchant guilds right now\\. Some merchants are paying for protection; others have become silent partners\\.', cond: 'merchants, the thieves above them' },
  { id: 'tolerateCut', crime: true, re: "They tolerate the guild's cut because fighting it costs more than paying it, and nobody says so aloud\\.", cond: 'merchants, the thieves (> 10) below them' },
  { id: 'merchantsMoreSay', re: `(?:The merchant guilds now have more say|${N} (?:has|have) more say now): the noble families keep their titles, their land and their precedence, but the money has moved\\.`, cond: 'nobles, the first merchant power more than 12 above' },
  { id: 'closingGap', re: 'The merchants are closing the gap, and the noble families are using every law and every social tie they have to slow them down\\.', cond: 'nobles, the first merchant power 1–12 above' },
  { id: 'noblesAhead', re: 'Still ahead of merchant interests in real influence, for now\\. They know the gap is narrowing and are arranging marriages accordingly\\.', cond: 'nobles, the first merchant power at or below them' },
  { id: 'steward', re: "(?:The steward rules in the lord's name, and the household is where that right comes from, but who signs what has become a tangle\\.|The steward runs things day to day; the household gives the steward the right to\\. When a petitioner finds one of them more willing than the other, the line between them blurs\\.|They hold more direct influence than the steward appointed to govern in their name, which raises questions about why the steward exists at all\\.|The steward governs in name, but gives way to them more often than was ever intended\\.|They and the steward both claim the same authority, so petitioners go to whichever is likelier to say yes\\.|The steward and the household have worked out who does what, but they bargain it again whenever something important is at stake\\.|Which one actually governs depends on the day and the question; each would say it does\\.)", cond: 'the manor or gentry beside a feudal steward' },
  { id: 'arcaneMoreSay', re: `${N} (?:has|have) more say right now, and the clergy cannot accept it\\.`, cond: 'the faith, an arcane power above it' },
  { id: 'arcaneInShadow', re: "The arcane orders are present but operate in the clergy's shadow\\. Questions of what is sanctioned magic and what is heresy remain deliberately unresolved\\.", cond: 'the faith, the arcane power at or below it' },
  { id: 'clergyAhead', re: 'The clergy have more say in public affairs, so the arcane orders work around them and never challenge them openly\\.', cond: 'an arcane power, the faith above it' },
  { id: 'arcaneAheadOfClergy', re: 'Ahead of the religious authorities in current influence, which they hold carefully: too much visible power invites accusations that they prefer to avoid\\.', cond: 'an arcane power at or above the faith' },
  { id: 'networkStronger', crime: true, re: 'The criminal network is stronger than they are\\. The clergy preach against it loudly, and few people listen\\.', cond: 'the faith, the thieves (> 10) above it' },
  { id: 'denounce', crime: true, re: 'They denounce the guild from the pulpit; the guild gives openly to the poor and makes the denunciations look selective\\.', cond: 'the faith, the thieves (> 10) at or below it' },
  { id: 'bodiesMinds', re: 'They and the religious authorities both keep people in line\\. The ([a-z ]+?) deals with bodies and the clergy with minds, and each wishes the other would keep quieter\\.', cond: 'a guard or military power, the faith within 10 of it' },
  { id: 'occupier', re: `It does not bargain for its way: (?:${N} (?:carries|carry) out what it decides|what it decides is carried out), whatever its numbers\\.`, cond: 'an occupation\'s appointed power below the first' },
];
const CODA_RES = CODAS.map((c) => ({ ...c, rx: new RegExp(c.re, 'g') }));
/**
 * A description cut into its opening and its codas: every coda match, in order; the opening is the text before the first
 * (trimmed). `rest` collects any text between or after codas that no coda pattern matched (expected empty: a miss is counted).
 * @returns {{ opening: string, codas: Array<{ id: string, text: string, groups: string[], index: number }>, rest: string }}
 */
export function cutDescription(desc) {
  const s = String(desc || '');
  const hits = [];
  for (const c of CODA_RES) {
    c.rx.lastIndex = 0;
    let m;
    while ((m = c.rx.exec(s))) hits.push({ id: c.id, text: m[0], groups: m.slice(1), index: m.index });
  }
  hits.sort((a, b) => a.index - b.index);
  // keep non-overlapping hits that sit on a sentence start (index 0 or after ". ")
  const kept = []; let end = -1;
  for (const h of hits) {
    if (h.index < end) continue;
    if (h.index > 0 && !/[.!?]\s$/.test(s.slice(0, h.index))) continue;
    kept.push(h); end = h.index + h.text.length;
  }
  if (!kept.length) return { opening: s.trim(), codas: [], rest: '' };
  const opening = s.slice(0, kept[0].index).trim();
  let rest = '';
  for (let i = 0; i < kept.length; i++) {
    const after = s.slice(kept[i].index + kept[i].text.length, kept[i + 1] ? kept[i + 1].index : s.length).trim();
    if (after) rest += (rest ? ' | ' : '') + after;
  }
  return { opening, codas: kept, rest };
}
export const sentencesOf = (s) => String(s).match(/[^.!?]+[.!?]+(\s|$)/g)?.map((x) => x.trim()) || (String(s).trim() ? [String(s).trim()] : []);
