/**
 * domain/prose/dailyLifeBeats.js — THE FIVE BEATS OF AN ORDINARY DAY, DETERMINISTIC AND OFFLINE
 * (design §5c rule 4; the owner, 2026-09-14 ~06:5x: "it is automatically default that the daily
 * life tab be populated rather than on command … let's just get it all out there").
 *
 * ── ⭐⭐ ONE GENERATOR, THREE READERS ────────────────────────────────────────────────
 * The Daily Life tab has always carried a deterministic offline prose path — the one a local-dev
 * or no-key session renders instead of spending credits. W4 makes that same text do two more jobs,
 * and the three must be the SAME BYTES or the Scribe would be refuted against a line the reader
 * never sees:
 *   1. THE OFFLINE PROSE, exactly as the tab has always rendered it (see `dailyLifeNarrative`);
 *   2. THE CORPUS LINE handed to the writer as the CLAIM it must keep and the line that ships if
 *      its own is refused — the same standing every hand-written pool line has (design §9);
 *   3. THE FALLBACK the tab draws when a beat is refused or was never rendered.
 * A second copy of the generator for any one of those is how the claim and the fallback would come
 * to be two different sentences.
 *
 * ── ⛔ FIVE BEATS OUT OF FOUR PARAGRAPHS, AND THE JOIN IS BYTE-IDENTICAL ─────────────
 * The tab's offline prose is FOUR paragraphs and the design names FIVE beats (dawn, the market,
 * midday, the tavern, night). The fourth paragraph has always been two beats in one sentence pair
 * — the day's talk, then the evening — so it is split at exactly that seam, and
 * `dailyLifeNarrative` rejoins the last two with the single space that was between them. The tab's
 * local-mode output is therefore byte-identical to what it rendered before this file existed,
 * which is the property the test asserts rather than assumes.
 *
 * ── ⛔ WHY THE LIST IS AN ARRAY OF STRINGS AND NOT A RECORD ─────────────────────────
 * The wiring census's `producerCitations` reads every object-literal key under `src/domain/**` as
 * a WRITE of world state — the hazard `townCard.js`'s header records at length, and the reason
 * that file builds every record through a computed-key helper. A record keyed `dawn`/`market`/
 * `midday`/`tavern`/`night` would put five new "producers" into the census for nothing. An array
 * aligned with `DAILY_LIFE_BEATS` carries the same information and declares no key at all.
 *
 * PURE and HEADLESS: no clock, no RNG, no store, no file system, no DOM. It reads the settlement
 * through `extractSettlementContext`, which is the tab's own pure reader — `scribePage.js` already
 * reaches into `components/new/` for the desk readers for the same reason: the read model lives
 * where it was written and a second copy of it is a second opinion about the town.
 *
 * @enforced-by tests/domain/dailyLifeBeats.test.js
 */
import { extractSettlementContext } from '../../components/new/dailyLifeLogic.js';

/**
 * ⭐ THE FIVE BEATS, IN THE ORDER A DAY HAPPENS IN. This is the pool-key list for block
 * `DS-DAILY` on the card and the read order the tab renders in; both spell it from here.
 * @type {ReadonlyArray<string>}
 */
export const DAILY_LIFE_BEATS = Object.freeze(['dawn', 'market', 'midday', 'tavern', 'night']);

/** The block id the beats ride under on the card and in the artefact. */
export const DAILY_LIFE_BLOCK = 'DS-DAILY';

/** The label each beat prints under, for the tab and for the writer's brief. */
export const DAILY_LIFE_LABELS = Object.freeze([
  'Dawn', 'The market', 'Midday', 'The tavern', 'Night',
]);

/** Sentence-case a snake or kebab value the config carries. */
function humanize(value) {
  if (!value) return '';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/** "a, b and c", or the fallback when the list is empty. */
function listText(items, fallback) {
  const clean = (items || []).filter(Boolean);
  if (!clean.length) return fallback;
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(', ')} and ${clean.at(-1)}`;
}

/**
 * ⭐⭐ THE FIVE BEATS FOR ONE TOWN, ALIGNED WITH `DAILY_LIFE_BEATS`.
 *
 * ⛔ EVERY SENTENCE HERE WAS ALREADY IN THE PRODUCT. This function is the tab's own
 * `buildLocalDailyLifeNarrative` moved whole, split at the seam the fourth paragraph already had,
 * and not re-worded by one character. Re-writing it while moving it would have meant the offline
 * prose changed on a wave whose whole point is that the dark page is byte-identical.
 *
 * @param {object} settlement @returns {string[]} five paragraphs, in beat order
 */
export function dailyLifeBeats(settlement) {
  const ctx = extractSettlementContext(settlement && typeof settlement === 'object' ? settlement : {});
  const terrain = humanize(ctx.terrain) || 'mixed terrain';
  const trade = humanize(ctx.tradeRoute) || 'road access';
  const culture = humanize(ctx.culture) || 'local custom';
  const food = ctx.foodDeficit > 20
    ? 'bread is dear and the poorest households plan every meal carefully'
    : ctx.foodDeficit > 0
      ? 'food is adequate for most families, though prices are watched closely'
      : ctx.foodSurplus > 10
        ? 'granaries and kitchen gardens give the town a little breathing room'
        : 'the food supply is ordinary, practical, and never taken for granted';

  const order = ctx.safetyScore >= 70
    ? 'people move after dusk with confidence'
    : ctx.safetyScore >= 45
      ? 'doors are barred early and strangers are studied before they are welcomed'
      : 'ordinary errands carry a careful awareness of who controls the street';

  const institutions = Object.values(ctx.keyInsts || {}).flat().slice(0, 5);
  const anchors = listText(institutions, 'the market, shrine, workshop, and watch post');
  const stress = ctx.stressTypes.length
    ? `The talk of the day keeps returning to ${listText(ctx.stressTypes.map(humanize), 'the current strain')}.`
    : 'The place is not peaceful so much as practiced: people know its routines and work around its frictions.';

  return [
    `Morning starts around ${anchors}. ${terrain} and ${trade} shape the pace: carts, tools, and gossip move where the ground and roads allow, while ${culture} gives even routine bargains a recognizable local rhythm.`,
    `${food}. Work is divided by habit more than proclamation. Farmers, haulers, priests, guards, and tradespeople all know which shortages can be endured and which ones will turn into arguments before sundown.`,
    `Power is felt through ${ctx.govFaction || 'whoever can make orders stick this week'}. ${ctx.stability < 45 ? "Promises are weighed carefully because yesterday's bargain may not survive tomorrow." : 'Most residents know where authority lives and how to petition it without making themselves memorable.'} ${order}.`,
    stress,
    'By evening, daily life narrows to lamplight, shared meals, debts remembered, and news carried from door to door. The settlement feels less like a map marker than a set of bargains people keep renewing because leaving would cost more than staying.',
  ];
}

/**
 * ⭐ THE OFFLINE PROSE AS THE TAB HAS ALWAYS RENDERED IT: four paragraphs, the last two beats
 * rejoined by the single space that was between them before the split. Byte-identical to the
 * function this replaced, which is asserted rather than assumed.
 * @param {object} settlement @returns {string}
 */
export function dailyLifeNarrative(settlement) {
  const beats = dailyLifeBeats(settlement);
  return [beats[0], beats[1], beats[2], `${beats[3]} ${beats[4]}`].join('\n\n');
}
