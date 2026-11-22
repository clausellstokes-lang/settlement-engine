/**
 * treasuryNews.js — THE COIN BEATS (W-COIN-2, design §6.5 under the news-address law).
 *
 * The Chronicle's two coin sentences. Split out of the writer as a pure display leaf (the
 * `generosityNews.js` idiom — the kernel owns the DECISION, this owns the NARRATION), so
 * the treasury leaf stays a mechanism and this one stays prose.
 *
 * ── WHAT MAY BE SAID, AND WHAT MAY NOT ───────────────────────────────────────
 * THE REGISTER IS THE OWNER'S, VERBATIM (§754.3): realm news is 100% contextual
 * narrative — "X attacked Y", "A captured B", "D did Z because of W" — and NEVER a
 * numerical delta. Band words and world words only. ⛔ NOT ONE SCALAR crosses into a
 * headline, a summary or a reason from this file: no coin amount, no fill fraction, no
 * band index, no upkeep cost. §776 makes the same cut from the other side — the LEDGER
 * keeps exact coin because it is a record, and every SURFACE speaks in bands.
 *
 * Honest concrete counts in world words survive (§763.2 ruled the boundary), which is why
 * "two courts" is legal here and "38 coin" never is. The counts this file writes are
 * counts of TOWNS, spelled as words through `quantityWords`-style prose rather than
 * printed as figures.
 *
 * THE FOUR MANDATORY PARTS of the address law ride every entry: the full subject address
 * chain (the seat, then its town), the typed action (the `impactKind`), the affected
 * settlements BY NAME, and the reason drawn from the recorded cause.
 *
 * ── WHY THERE ARE TWO BEATS AND NOT FOUR ─────────────────────────────────────
 * Design §6.5 names openings among the notable flows. Under Q10's answer the flag is lit
 * by the PRESET TABLE, so every settlement in a lit world opens its ledger on the same
 * tick — an opening beat would be one entry per town in a single tick, for a bookkeeping
 * event nobody in the world experiences. It is deliberately not written (J-T2-B, vetoable;
 * one row restores it). Routine tax ticks are likewise silent, by the design's own
 * notable-only rule: a crown collecting its rents is not news.
 *
 * PURE + DETERMINISTIC: no rng, no wall clock (tick and `now` are passed in), no mutation.
 */

import { stablePart } from './stablePart.js';

/**
 * How a crown is addressed. The seat's own authored NAME, then its town — the address
 * chain the news law requires, and the honest form of it.
 *
 * ⛔ IT READS `powerStructure.governingName` AS A NAME AND NEVER AS A TYPE. That field is
 * free text with four writers and no normalizer, and the recorded disease is consumers
 * that branch on it by regex and silently score zero on ordinary labels. Nothing here
 * branches: the string is printed, which is the one thing a name is actually for. What a
 * seat IS remains `resolveRulingPower`'s answer and is never asked here.
 * @param {{ name?: unknown, powerStructure?: unknown }} state
 * @returns {string}
 */
function courtOf(state) {
  // `powerStructure` arrives as `unknown` from the collector rather than through a cast:
  // the any-cast ratchet is right to refuse a hole here, and the guard costs one line.
  const power = state?.powerStructure;
  const seat = power && typeof power === 'object'
    ? String(/** @type {Record<string, unknown>} */ (power).governingName || '').trim()
    : '';
  const town = String(state?.name || '').trim() || 'the settlement';
  return seat ? `${seat} of ${town}` : `The court of ${town}`;
}

/** The direction a vault moved between bands, in the closed order the vocabulary declares. */
const BAND_ORDER = Object.freeze(['empty', 'lean', 'adequate', 'full', 'overflowing']);

/**
 * Band → the phrase a chronicler would actually use for a vault at that level.
 *
 * ⚠ TWO TENSES, AND THE SECOND EXISTS BECAUSE A DRIVEN WORLD CAUGHT ITS ABSENCE. The
 * crossing sentence sets the vault's state NOW against where it stood LATELY, so a single
 * present-tense map produced "the vault runs lean where it lately STANDS empty" on a real
 * 24-tick run. Unit fixtures could not see it — they assert that a band renders, not that
 * the sentence parses — so the pair is kept in step by a totality arm over the closed
 * vocabulary rather than by care.
 */
/** @type {Readonly<Record<string, string>>} */
const BAND_PHRASE = Object.freeze({
  empty: 'stands empty',
  lean: 'runs lean',
  adequate: 'holds enough',
  full: 'stands full',
  overflowing: 'overflows',
});

/** The same five, as the chronicler would say them of a season already past. */
/** @type {Readonly<Record<string, string>>} */
const BAND_PHRASE_PAST = Object.freeze({
  empty: 'stood empty',
  lean: 'ran lean',
  adequate: 'held enough',
  full: 'stood full',
  overflowing: 'overflowed',
});

/**
 * THE TWO COIN BEATS for one tick.
 *
 * @param {{ tick: number, now: string|null,
 *           states: Array<{ id: string, name: string, powerStructure?: unknown,
 *             band: string, previousBand: string, bandCrossed: boolean,
 *             shortfall: boolean, suspension: string|null }> }} args
 * @returns {Array<Record<string, unknown>>} wizard-news entries (possibly empty)
 */
export function treasuryNewsEntries({ tick, now, states = [] }) {
  const entries = [];

  // ── BEAT 1 · THE CROWN THAT COULD NOT PAY ITS ARMY ────────────────────────
  // The sharpest thing the coin layer can say, and the one the war reads will later
  // price. One entry per court, because a crown failing its own army is that court's
  // story and not the realm's weather.
  for (const s of states) {
    if (!s.shortfall) continue;
    const court = courtOf(s);
    const summary = `${court} cannot meet the wages of the army it has in the field, and the vault ${BAND_PHRASE[s.band] || 'stands empty'}.`;
    entries.push({
      id: `wizard_news.${tick}.treasury_shortfall.${stablePart(s.id)}`,
      tick,
      createdAt: now,
      scope: 'regional',
      kind: 'applied',
      impactKind: 'treasury_shortfall',
      significance: 'major',
      severity: 0.65,
      headline: `${court} cannot pay its army`,
      summary,
      settlementIds: [String(s.id)],
      impactIds: [],
      channelIds: [],
      tags: ['world_pulse', 'treasury', 'shortfall'],
      // THE REASON FROM THE RECORDED CAUSE — the suspension when one grips, since a
      // besieged or occupied court is short for a reason the world can see.
      reasons: [
        s.suspension === 'siege'
          ? `${s.name} is under siege, and a town whose markets are shut collects nothing to pay with.`
          : s.suspension === 'occupation'
            ? `${s.name}'s revenue is carried off by the occupying authority before its own court sees any of it.`
            : `${s.name} fields more than its revenues can carry.`,
      ],
    });
  }

  // ── BEAT 2 · THE VAULT CROSSES A BAND ─────────────────────────────────────
  // Notable-only by construction: a crossing is rare, and a crown whose vault merely
  // rose or fell within its band says nothing at all.
  const crossings = states.filter((s) => s.bandCrossed && !s.shortfall);
  for (const s of crossings) {
    const fell = BAND_ORDER.indexOf(s.band) < BAND_ORDER.indexOf(s.previousBand);
    // ⛔ HOISTED, AND IT MUST STAY HOISTED. significanceVocabulary.test.js scans
    // `significance:\s*([^,\n]+)` and then lifts EVERY lowercase string literal out of the
    // matched value — so an inline `s.band === 'empty' ? 'major' : 'notable'` offers the
    // scanner `'empty'`, which is a BAND WORD and not an SP-6a tier, and the walker convicts
    // it estate-wide. The comparison belongs to the band vocabulary; only the tiers belong in
    // the property value. Inlining this predicate back reds that walker.
    const emptied = s.band === 'empty';
    const court = courtOf(s);
    // ⚠ NAMED `standsNow`, NOT `now`. A local `now` here SHADOWS the `now` parameter —
    // the pinned tick timestamp every entry's `createdAt` carries — and the shadow is
    // silent: `createdAt` simply becomes the band phrase, and no arm that checks bands or
    // prose can see it. The kernel threads `now` precisely so the feed stamps deterministic
    // tick time instead of leaking the wall clock, so this shadow would have broken the
    // thing the threading exists for. `createdAt` is pinned by execution below.
    const standsNow = BAND_PHRASE[s.band] || 'runs lean';
    const lately = BAND_PHRASE_PAST[s.previousBand] || 'stood otherwise';
    const summary = fell
      ? `${court} spends faster than it takes in; the vault ${standsNow} where it lately ${lately}.`
      : `${court} has been putting coin by, and the vault ${standsNow} where it lately ${lately}.`;
    entries.push({
      id: `wizard_news.${tick}.treasury_band.${stablePart(s.id)}`,
      tick,
      createdAt: now,
      scope: 'regional',
      kind: 'applied',
      impactKind: 'treasury_band',
      // A vault falling to nothing is the only crossing that rises above routine; the
      // rest are texture, and the feed governor should treat them as such.
      significance: emptied ? 'major' : 'notable',
      severity: emptied ? 0.55 : 0.3,
      headline: fell ? `${court} draws down its treasury` : `${court} rebuilds its treasury`,
      summary,
      settlementIds: [String(s.id)],
      impactIds: [],
      channelIds: [],
      tags: ['world_pulse', 'treasury', fell ? 'drawdown' : 'recovery'],
      reasons: [
        s.suspension === 'siege'
          ? `${s.name} lies under siege, and its markets are shut.`
          : s.suspension === 'occupation'
            ? `${s.name} is held by another power, and its revenues flow outward.`
            : fell
              ? `${s.name} is paying out more than its rents and tolls bring in.`
              : `${s.name} is taking in more than its court spends.`,
      ],
    });
  }

  return entries;
}
