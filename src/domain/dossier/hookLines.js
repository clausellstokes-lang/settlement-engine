/**
 * domain/dossier/hookLines.js — THE DRAWN HOOK LINES: one per conflict, one per food gap,
 * chosen rather than fixed.
 *
 * ── THE DEFECT (docs/GENERATION_ROOT_CAUSES_2026-11-02.md, trace 6 "Repetition") ───────
 * Two of the estate's most-read hooks are written once and printed everywhere. Measured on
 * this lane's 120-settlement corpus (twenty per tier, seeds `hooks-lane-2026-11-03-<tier>-<i>`):
 *
 *   97 of 120 settlements read "Evidence has surfaced suggesting a third party is
 *      deliberately escalating the tension between the two factions." — one copy per
 *      conflict, naming nobody and nothing;
 *  169 hook instances across 120 settlements read "A neutral figure is being pressured by
 *      both X and Y to take a side before the next council session." — one template wearing
 *      95 pairs of faction names;
 *   42 settlements read the one fixed food-crisis sentence, and two towns of different
 *      culture, route and terrain shared as many as 15 of their ~30 hook sentences.
 *
 * `src/generators/power/conflicts.js :: buildConflictPlotHooks` writes those two conflict
 * sentences unconditionally, with no draw at all — so a DM who generates two towns reads the
 * same escalation twice, and a DM who generates twenty reads it twenty times.
 *
 * ── WHAT THIS MODULE IS ───────────────────────────────────────────────────────────────
 * Small authored libraries, one per ISSUE FAMILY, and a draw that spends ZERO rng rolls.
 * Every line names the two parties and the issue the record already holds, so the sentence
 * is about this quarrel in this place rather than about quarrels in general.
 *
 * ── THE DRAW IS THE GS-1 IDIOM (`src/generators/power/relationshipArchetypes.js ::
 * createTieProseDraw`, ODQ §934.101), copied deliberately rather than re-invented ───────
 * One draw per collection (one dossier). The first conflict of a family opens at a
 * draw-free fnv offset keyed on its own two parties and issue; each further conflict of
 * that family takes the NEXT line, so no sentence repeats on the page until the family's
 * pool is spent. There is no `_rng()` call anywhere in this file: the collector is a pure
 * projection and must stay one, and the offset makes two settlements differ without any
 * stream to perturb. Same record in ⇒ same sentence out, byte for byte.
 *
 * PURE: no rng, no clock, no store, no React.
 */

import { fnv1a32 } from '../../kernel/proseHash.js';
import { drawDeclared, lineText } from '../facts/drawDeclared.js';

/**
 * The issue families, in the order they are tested. A family is matched on the issue text
 * the record already carries (`src/generators/power/conflicts.js` issueTemplates), because
 * that string is the only thing the record says about what the quarrel is ABOUT — there is
 * no issue id to key on. The order is first-match-wins and the last family is the default,
 * so a new issue template that matches nothing still gets a drawn line rather than silence.
 * @type {ReadonlyArray<{ id: string, match: RegExp }>}
 */
const ISSUE_FAMILIES = Object.freeze([
  Object.freeze({ id: 'licence', match: /licens|permit|charter|registration|documentation/i }),
  Object.freeze({ id: 'jurisdiction', match: /jurisdiction|arrest|authority|accountability|enforcement|legitimacy/i }),
  Object.freeze({ id: 'property', match: /land claim|property|custody|records|housing|stores|grain/i }),
  Object.freeze({ id: 'revenue', match: /tax|revenue|contract|supply|windfall|checkpoint|trade route/i }),
  Object.freeze({ id: 'people', match: /conscription|apprentice|labour|labor|lists|collaboration|negotiat/i }),
  Object.freeze({ id: 'seat', match: /succession|seat|council|allegiance|declare/i }),
  Object.freeze({ id: 'standing', match: /./ }),
]);

/**
 * A line takes the two parties and the issue as the record spells them, and returns one
 * sentence. The issue arrives lower-cased at the call site (the record stores it
 * Title-Case, as a label), so a line may drop it mid-sentence without re-casing it.
 * @typedef {((a: string, b: string, issue: string) => string) | { text: (a: string, b: string, issue: string) => string, needs?: string[], excludes?: string[] }} HookLine a template, or the declared form around one (CENSUS-2c)
 */

/**
 * The libraries. Plain, specific, nothing meta — the house voice: a sentence states what
 * is happening and stops. No line asks a question of the DM, none names a rules term, and
 * none claims a building, a force or a spell, so a drawn line cannot re-introduce the
 * untrue-claim defect the truth gate exists to refuse.
 *
 * ⚠ ONE POOL PER CONST, AND THE OUTER RECORD ONLY REFERENCES THEM. A pool nested directly
 * inside the record's own `Object.freeze` loses its contextual type — TS stops threading
 * the declared `HookLine` through the inner generic call and every parameter reads as an
 * implicit `any`, which is 108 strict errors and a red domain-strict ratchet on a NEW file.
 * Measured, not assumed: `tsc --strict` on the three shapes side by side faults only the
 * nested one.
 */
/** @type {ReadonlyArray<HookLine>} */
const LICENCE_LINES = Object.freeze([
  (a, b, issue) => `${a} has begun issuing its own papers over ${issue}, and ${b} is refusing to honour them.`,
  (a, b, issue) => `A clerk who holds the only complete record of ${issue} has stopped coming to work, and both ${a} and ${b} have sent someone to find them.`,
  (a, b, issue) => `${b} has offered to drop its claim on ${issue} in exchange for something it will not put in writing, and ${a} is tempted.`,
  (a, b, issue) => `Two sets of papers covering ${issue} are in circulation, one sealed by ${a} and one by ${b}, and nobody outside either camp can tell which is binding.`,
  (a, b, issue) => `${a} has quietly stopped enforcing ${issue} against anyone who pays ${b} instead, and the arrangement is about to become public.`,
]);

/** @type {ReadonlyArray<HookLine>} */
const JURISDICTION_LINES = Object.freeze([
  (a, b, issue) => `${a} has taken someone into custody over ${issue}, and ${b} has sent people to take them back.`,
  (a, b, issue) => `A ruling on ${issue} went ${a}'s way, and ${b} has simply carried on as though it did not.`,
  (a, b, issue) => `${b} has started keeping its own account of ${issue}, and it no longer agrees with ${a}'s about what happened.`,
  (a, b, issue) => `Somebody acting for ${a} overstepped badly over ${issue}, and ${b} is holding the proof back for a better moment.`,
  (a, b, issue) => `${a} and ${b} have both claimed the right to settle ${issue}, and the people who must live with the answer are being asked to choose.`,
]);

/** @type {ReadonlyArray<HookLine>} */
const PROPERTY_LINES = Object.freeze([
  { text: (a, b, issue) => `${a} has posted guards on what it says is its own, and ${b} says ${issue} was never ${a}'s to hold.`, needs: ['guardPresence'] }, // CENSUS-2c: the rulings §3's composite
  (a, b, issue) => `An inventory of ${issue} came up short, and ${a} and ${b} each say the other took the difference.`,
  (a, b, issue) => `${b} has produced an old deed bearing on ${issue}; it is good enough for ${a} to take seriously and old enough for ${a} to doubt.`,
  (a, b, issue) => `Someone has been moving what ${issue} covers out of the building at night, and both ${a} and ${b} assume the other arranged it.`,
  (a, b, issue) => `${a} has offered to split ${issue} rather than argue it, and the offer has split ${b} instead.`,
]);

/** @type {ReadonlyArray<HookLine>} */
const REVENUE_LINES = Object.freeze([
  (a, b, issue) => `${a} has stopped paying what ${b} says it owes on ${issue}, and the stoppage is costing a third party money.`,
  (a, b, issue) => `A clerk's ledger covering ${issue} is missing a season, and ${a} benefits from its absence more than ${b} does.`,
  (a, b, issue) => `${b} has undercut ${a} on ${issue} at a price that cannot be honest, and nobody has worked out yet where the difference comes from.`,
  (a, b, issue) => `${a} has begun turning away anyone who deals with ${b} over ${issue}, and the refusals are starting to bite the wrong people.`,
  (a, b, issue) => `Both ${a} and ${b} have promised the same share of ${issue} to the same outsider, who has now arrived to collect.`,
]);

/** @type {ReadonlyArray<HookLine>} */
const PEOPLE_LINES = Object.freeze([
  (a, b, issue) => `${a} has drawn up names under ${issue}, and ${b} has been quietly telling people how to keep off the list.`,
  (a, b, issue) => `A family caught between ${a} and ${b} over ${issue} has asked for someone from outside to speak for them.`,
  (a, b, issue) => `${b} has taken on people ${a} had already claimed under ${issue}, and neither will release them.`,
  (a, b, issue) => `Someone has been paid to swear to a version of ${issue} that suits ${a}, and ${b} knows who paid and not yet who swore.`,
  (a, b, issue) => `${a} and ${b} have each offered protection over ${issue} to the same households, on terms that cannot both be kept.`,
]);

/** @type {ReadonlyArray<HookLine>} */
const SEAT_LINES = Object.freeze([
  (a, b, issue) => `${a} has a candidate for ${issue} and ${b} has a reason the candidate cannot stand, and the reason is true.`,
  (a, b, issue) => `A vote on ${issue} has been postponed three times, each time by whichever of ${a} or ${b} would have lost it.`,
  (a, b, issue) => `${b} has let it be known it will accept ${a}'s answer to ${issue} if one of its own people is kept on, and the condition is the real dispute.`,
  (a, b, issue) => `Two people are already acting as though ${issue} is settled in their favour, one backed by ${a} and one by ${b}.`,
  (a, b, issue) => `Someone with no part in ${a} or ${b} has been promised ${issue} by both of them, and has told neither about the other.`,
]);

/** @type {ReadonlyArray<HookLine>} */
const STANDING_LINES = Object.freeze([
  (a, b, issue) => `${a} has stopped speaking to ${b} about ${issue} and started speaking about it to everybody else.`,
  (a, b, issue) => `A go-between who carried messages on ${issue} between ${a} and ${b} has been caught keeping copies.`,
  (a, b, issue) => `${b} is waiting for ${a} to overreach on ${issue}, and has arranged for it to be witnessed when it happens.`,
  (a, b, issue) => `An old debt between ${a} and ${b} has been called in over ${issue}, years after both sides had stopped mentioning it.`,
  (a, b, issue) => `Someone has been feeding ${a} and ${b} the same warning about each other over ${issue}, and neither has asked who.`,
  (a, b, issue) => `${a} has offered ${b} terms on ${issue} that are better than ${b} expected, which is why ${b} has not accepted them.`,
]);

/** @type {Readonly<Record<string, ReadonlyArray<HookLine>>>} */
const CONFLICT_LINES = Object.freeze({
  licence: LICENCE_LINES,
  jurisdiction: JURISDICTION_LINES,
  property: PROPERTY_LINES,
  revenue: REVENUE_LINES,
  people: PEOPLE_LINES,
  seat: SEAT_LINES,
  standing: STANDING_LINES,
});

/**
 * The food-gap lines: what a place with a real shortfall and food still in store says
 * INSTEAD of "the settlement is starving" (the chair's ruling 1 — "a grain-price hook for a
 * moderate gap"). They speak about price, supply and the people who control it, and none of
 * them claims a famine, so the same truth gate that refused the starving sentence passes
 * these. The settlement's name is never interpolated: the collector's dedupe folds on text,
 * and a named line would survive it on every page.
 * @type {ReadonlyArray<string | { text: string, needs?: string[], excludes?: string[] }>} a line, or the declared form around one (CENSUS-2c)
 */
const FOOD_GAP_LINES = Object.freeze([
  { text: 'Grain is coming in, and the people bringing it have worked out exactly how much that is worth. The price has moved twice this month.', excludes: ['crisis: under_siege'] },
  { text: 'Enough food arrives to keep the place fed, which means whoever controls the carts controls rather more than the carts.', excludes: ['starving', 'famine', 'crisis: famine', 'crisis: under_siege'] },
  'A supplier who has carried the shortfall for years wants the arrangement put on paper now, and the terms have changed.',
  { text: 'The last two consignments were short by the same amount, and the measure is being blamed rather than the measurer.', excludes: ['crisis: under_siege'] },
  { text: 'Somebody has begun buying grain forward at prices nobody local can match, and will not say who it is for.', needs: ['market'] },
  'A merchant has offered to cover the whole gap from one source, which would solve this season and hand them next season.',
]);

/**
 * The issue family one issue string belongs to.
 * @param {unknown} issue
 * @returns {string}
 */
export function conflictIssueFamily(issue) {
  const text = typeof issue === 'string' ? issue : '';
  const family = ISSUE_FAMILIES.find((candidate) => candidate.match.test(text));
  return (family || ISSUE_FAMILIES[ISSUE_FAMILIES.length - 1]).id;
}

/**
 * A drawn hook line as text: a template takes the parties and the issue; a declared line is
 * `{ text, needs?, excludes?, crisis? }` around either form.
 * @param {unknown} line @param {string} a @param {string} b @param {string} issue
 * @returns {string}
 */
function spoken(line, a, b, issue) {
  const v = lineText(line);
  return typeof v === 'function' ? v(a, b, issue) : String(v);
}

/**
 * ONE DRAW PER DOSSIER, WITHOUT REPLACEMENT PER FAMILY.
 *
 * ⭐ CENSUS-1d unit 2 (Appendix B row 90, kind H): the walking modulus is drawn over the FULL
 * family pool as before and the drawn line resolved through `drawDeclared` (a refused line
 * moves to its twin or the hash argmax; `used` advances exactly as before), noted in the
 * presumption ledger as `HOOK_LINE_POOLS.conflict.<family>`.
 *
 * @param {object|null|(() => object|null)} [facts] `factsOf(settlement)` (or a thunk), which
 *   answers a declared line; none = a declared line is refused (fail-closed)
 * @returns {(conflict: { parties?: unknown, issue?: unknown }) => string[]} the lines for
 *   one conflict, in the order they should be read. One line per conflict: the chair's
 *   ruling 3 ("one hook per conflict, chosen").
 */
export function createConflictHookDraw(facts = null) {
  /** @type {Map<string, { base: number, used: number }>} */
  const draws = new Map();
  return (conflict) => {
    const parties = Array.isArray(conflict?.parties) ? conflict.parties : [];
    const a = typeof parties[0] === 'string' && parties[0] !== '' ? parties[0] : 'One faction';
    const b = typeof parties[1] === 'string' && parties[1] !== '' ? parties[1] : 'another';
    const rawIssue = typeof conflict?.issue === 'string' ? conflict.issue : '';
    // THE ISSUE RIDES MID-SENTENCE, so it is spoken the way the sentence needs it. The
    // record stores it as a Title-Case label ("Control of the dock taxation authority");
    // only the first letter is lowered, because the rest can carry a proper noun.
    const issue = rawIssue === ''
      ? 'the quarrel between them'
      : rawIssue.charAt(0).toLowerCase() + rawIssue.slice(1);
    const family = conflictIssueFamily(rawIssue);
    const pool = CONFLICT_LINES[family] || CONFLICT_LINES.standing;
    let draw = draws.get(family);
    if (!draw) {
      draw = { base: fnv1a32(`${a}>${b}::${rawIssue}::${family}`), used: 0 };
      draws.set(family, draw);
    }
    const offset = draw.base + draw.used;
    draw.used += 1;
    const drawn = drawDeclared(pool, {
      draw: (p) => p[offset % p.length], facts, key: `${a}>${b}::${rawIssue}::${family}`,
      poolId: `HOOK_LINE_POOLS.conflict.${family}`, surface: 'plot_hooks', drawKind: 'H',
    });
    return drawn.line == null ? [] : [spoken(drawn.line, a, b, issue)];
  };
}

/**
 * The food-gap line for one settlement: a draw-free fnv offset on the place's own name and
 * band, so two settlements with the same shortfall do not read the same sentence. Drawn over
 * the full pool and resolved through `drawDeclared` (CENSUS-1d unit 2, row 90, kind H).
 * @param {{ name?: unknown, band?: unknown }} place
 * @param {object|null|(() => object|null)} [facts] `factsOf(settlement)` (or a thunk)
 * @returns {string}
 */
export function foodGapHookLine(place, facts = null) {
  const name = typeof place?.name === 'string' ? place.name : '';
  const band = typeof place?.band === 'string' ? place.band : '';
  const seed = `${name}::${band}::food-gap`;
  const drawn = drawDeclared(FOOD_GAP_LINES, {
    draw: (p) => p[fnv1a32(seed) % p.length], facts, key: seed,
    poolId: 'HOOK_LINE_POOLS.foodGap', surface: 'plot_hooks', drawKind: 'H',
  });
  return drawn.line == null ? '' : String(lineText(drawn.line));
}

/** The pools, for the tests that measure their size and read their voice. */
export const HOOK_LINE_POOLS = Object.freeze({
  conflict: CONFLICT_LINES,
  foodGap: FOOD_GAP_LINES,
});
