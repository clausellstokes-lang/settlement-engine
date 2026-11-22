// PEOPLE-2 seat M6 (2026-11-20): THE FIRST TRANCHE AS THE CHAIR RULED IT (17:21 UTC), as data.
// It reads M4's pools (m4-pools.mjs, unchanged) and applies the verdict's items 1 and 2, each amendment listed below by
// pool, wording number (the proposals' tables number a pool's wordings from 1; index 0 is today's line, never listed) and
// the exact text it replaces, so the edit is checked (a miss throws). Nothing here is in src/.
//
// Item 1 (strike every feeling and scheme the branch does not compute): the arcane advisory pool 1 to 8 lose "quietly
// resented"; MR.dep 1 to 11 end "Each needs the other."; MR.tense 4 loses "and {M} resent it"; the bodiesMinds coda 1 to 3
// end at the fact (who keeps order, and how); worthBuying 1 and 2, closingGap 1 and 2 take the chair's own words; the
// arcaneInShadow coda 2 and 3 lose "on purpose" and "by choice". The village priest's index 0 takes `priest` as a NEED
// (PRIEST_INDEX0_NEEDS; every other index 0 stays eligible everywhere).
// Item 2 (the chair's rewordings): the elders' pool 4; the clergy-at-the-margins pool 1 and 7; the minor landed families 2.
import { RELATION_POOLS as R4, DESC_POOLS as D4, CODA_POOLS as C4 } from './m4-pools.mjs';

const clone = (x) => JSON.parse(JSON.stringify(x));
export const RELATION_POOLS = clone(R4);
export const DESC_POOLS = clone(D4);
export const CODA_POOLS = clone(C4);

const ARCANE = 'Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.';
const ELDERS = 'The oldest heads of the community decide things together; people follow them out of respect and custom, not law.';
const CLERGY = 'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.';
const LANDED = 'Minor landed families with limited political reach; present in civic life but rarely decisive.';
export const PRIEST_LINE = 'The village priest is the most educated person for miles; moral authority and practical influence are inseparable at this scale.';
/** The verdict's one exception to "index 0 stays eligible everywhere": the priest's line where the `priest` atom holds. */
export const INDEX0_NEEDS = { [PRIEST_LINE]: ['priest'] };

/** [kind, pool key, wording number (1-based), the exact text today, the ruled text, the verdict item] */
export const AMENDMENTS = [
  ['desc', ARCANE, 1, 'Those who work magic here are hired and consulted, never given office; their say comes through their fees, and it is quietly resented.', 'Those who work magic here are hired and consulted, never given office; their say comes through their fees.', 1],
  ['desc', ARCANE, 2, 'No office here belongs to a mage; the practitioners are consulted when needed and paid for it, and their influence is quietly resented.', 'No office here belongs to a mage; the practitioners are consulted when needed and paid for it.', 1],
  ['desc', ARCANE, 3, 'Magical practitioners sell their services here and are asked their opinion, but hold no office; what influence they have is advisory, transactional, and quietly resented.', 'Magical practitioners sell their services here and are asked their opinion, but hold no office; what influence they have is advisory and transactional.', 1],
  ['desc', ARCANE, 4, 'People go to the practitioners for what only magic can do and pay their price, but give them no say beyond it; the price is quietly resented.', 'People go to the practitioners for what only magic can do and pay their price, but give them no say beyond it.', 1],
  ['desc', ARCANE, 5, 'Magic is bought here like any skilled work, and the practitioners\' influence goes no further than their customers allow; it is quietly resented.', 'Magic is bought here like any skilled work, and the practitioners\' influence goes no further than their customers allow.', 1],
  ['desc', ARCANE, 6, 'The council consults the mages when it needs them but gives them no seat; their influence is advisory and paid for, and quietly resented.', 'The council consults the mages when it needs them but gives them no seat; their influence is advisory and paid for.', 1],
  ['desc', ARCANE, 7, 'In a place this large there is steady work for magical practitioners, but no office; their influence is advisory, paid for, and quietly resented.', 'In a place this large there is steady work for magical practitioners, but no office; their influence is advisory and paid for.', 1],
  ['desc', ARCANE, 8, 'There is money enough here to keep magical practitioners in work, though not in office; their influence is advisory, transactional, and quietly resented.', 'There is money enough here to keep magical practitioners in work, though not in office; their influence is advisory and transactional.', 1],
  ['relation', 'MR.tense', 4, 'Money that goes to {R} as tithe does not come back to the market, and {M} resent it; the church\'s rules on lending are a standing grievance with the merchants.', 'Money that goes to {R} as tithe does not come back to the market; the church\'s rules on lending are a standing grievance with the merchants.', 1],
  ['coda', 'bodiesMinds', 1, 'They and the clergy both keep order, one in the streets and one in people\'s heads, and each would like the other to say less.', 'They and the clergy both keep order, one in the streets and one in people\'s heads.', 1],
  ['coda', 'bodiesMinds', 2, 'The $1 keeps order with its hands and the clergy with their sermons; each finds the other too loud.', 'The $1 keeps order with its hands and the clergy with their sermons.', 1],
  ['coda', 'bodiesMinds', 3, 'Between them, the $1 and the religious authorities keep people in line, the one by force and the other by conscience, and neither enjoys sharing the work.', 'Between them, the $1 and the religious authorities keep people in line, the one by force and the other by conscience.', 1],
  ['coda', 'worthBuying', 1, 'Third in weight, they sell their support dearly, and play $1 and $2 against each other whenever they can.', 'Third in weight, close enough to $1 and $2 that their support is worth having.', 1],
  ['coda', 'worthBuying', 2, 'Their support is worth buying, and both $1 and $2 know it; they play one against the other when they can.', 'Their support is worth buying, and both $1 and $2 know it.', 1],
  ['coda', 'closingGap', 1, 'Merchant money is catching up with them, and the noble families use every law and every connection they have to hold it back.', 'Merchant money is catching up with the noble families, and the gap between them narrows.', 1],
  ['coda', 'closingGap', 2, 'The noble families feel the merchants closing on them, and use law and connection alike to slow them.', 'The merchants are closing on the noble families, who still stand ahead.', 1],
  ['coda', 'arcaneInShadow', 2, 'The clergy stand above the arcane orders here; what counts as permitted magic and what as heresy is left, on purpose, unsaid.', 'The clergy stand above the arcane orders here; what counts as permitted magic and what as heresy is left unsaid.', 1],
  ['coda', 'arcaneInShadow', 3, 'The church outweighs the arcane orders here, and leaves the line between sanctioned magic and heresy undrawn, by choice.', 'The church outweighs the arcane orders here, and leaves the line between sanctioned magic and heresy undrawn.', 1],
  ['desc', ELDERS, 4, 'The oldest heads of the community decide things together, down to who does which work; people follow them by custom and out of respect, not by law.', 'The oldest heads of the community decide things together, large and small; people follow them by custom and out of respect, not by law.', 2],
  ['desc', CLERGY, 1, 'The priests are respected in their own sphere, but in the business of governing they count for little.', 'The clergy are respected in their own sphere, but in the business of governing they count for little.', 2],
  ['desc', CLERGY, 7, 'The courts, not the clergy, settle the place\'s disputes; the clergy\'s authority is moral, and their political leverage limited.', 'The court, not the clergy, settles the place\'s disputes; the clergy\'s authority is moral, and their political leverage limited.', 2],
  ['desc', LANDED, 2, 'Old landed families with modest holdings; they take part in civic affairs, but are seldom the ones who settle them.', 'Old landed families of limited reach; they take part in civic affairs, but are seldom the ones who settle them.', 2],
];
// MR.dep 1 to 11: ", and neither likes it." struck (each ends "Each needs the other.")
for (let k = 1; k <= 11; k++) {
  const was = R4['MR.dep'][k - 1].text;
  if (!was.endsWith('Each needs the other, and neither likes it.')) throw new Error(`MR.dep ${k}: ${was}`);
  AMENDMENTS.push(['relation', 'MR.dep', k, was, was.replace(/Each needs the other, and neither likes it\.$/, 'Each needs the other.'), 1]);
}

for (const [kind, key, k, was, now] of AMENDMENTS) {
  const pool = kind === 'desc' ? DESC_POOLS[key] : kind === 'relation' ? RELATION_POOLS[key] : CODA_POOLS.find((c) => c.id === key)?.variants;
  if (!pool || !pool[k - 1]) throw new Error(`no wording ${kind} ${key} ${k}`);
  if (pool[k - 1].text !== was) throw new Error(`amendment ${kind} ${key} ${k} does not match today's text: ${pool[k - 1].text}`);
  pool[k - 1].text = now;
  pool[k - 1].amended = true;
}
