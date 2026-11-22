// PEOPLE-1 seat M4 (2026-11-20): what both M4 measures share: the chair's mask, the branch classifiers (read off the writers'
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
