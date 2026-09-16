/**
 * sovereigntyIntent.js — WR-10 amendment S: WHY A COURT SELLS, AND WHAT THE WORLD
 * MAKES OF THE COURT THAT BOUGHT.
 *
 * Amendment S's character-and-judgment clause has four limbs; three were deferred with
 * the transfer writer and one (the wartime firesale) already landed in the appraisal.
 * This leaf is the other three plus requirement 13's engaged consumer, and every one of
 * them is a READ. Nothing here mints a treaty, moves a ledger row, or refuses a mint:
 * there is no state, no writer, and no rng.
 *
 * ── §1b-B GOVERNS EVERY ANSWER: SUPPRESS THE SCORE, NEVER REFUSE THE MINT ──────
 * A sale contradicted by a live reading SCORES ZERO AND SAYS WHY. The receipt names
 * the contradicting state in words, and that receipt is the story the Herald tells
 * (`kinship_opposes_the_sale`, `sale_books_diverged`, `sovereignty_sale_judged`). A
 * scorer whose number cannot be traced back to the state that made it is a number
 * nobody can argue with, which is what law B exists to forbid — so every read below
 * carries a `receipt` and a banded `evidence` record.
 *
 * SCORE ZERO MEANS SUPPRESSED, BY CONSTRUCTION AND NOT BY LUCK. An unsuppressed intent
 * is floored at `UNSUPPRESSED_FLOOR01`, so `score01 === 0` identifies suppression
 * exactly. Without the floor the invariant would hold only for as long as nobody
 * retuned the two disposition bands — the shape of guard this estate has watched go
 * quietly dead before (a band above a maximum expressible ratio; a march ceiling above
 * every reachable pair). The floor is not decoration: a realm-run court with saturated
 * commerce caution AND saturated insularity computes a raw appetite of zero and lands
 * ON the floor, which the tuning pin proves on both sides.
 *
 * ── E3 IS EXPRESSED AS A SIGNATURE, NOT AS A PROMISE ────────────────────────────
 * "Disposition is a threshold, never a selector." `saleAppetiteOf` therefore takes a
 * SELLER AND NOTHING ELSE — no buyer, no asset, no candidate list — so the disposition
 * colour structurally cannot pick a target, in the way `sovereigntyAppraisal`'s empty
 * import list structurally cannot reach true state. The buyer enters only where the
 * RELATIONSHIP does (the kinship mirror and the seat's books), and E3's own text says
 * the relationship IS the bar.
 *
 * ── WHY THIS IS NOT A K3 NEGOTIATION PATH ───────────────────────────────────────
 * K3 fences a court from OTHERS' truth. Every leg here is either a SELF-READ, which
 * the belief layer has always taken as ground (the §IV.4 carve-out `conquestDoctrineStage`
 * already cites for a court's own granary), or an explicitly belief-side read:
 *   • the four-channel disposition memory is the seller's own outcome history;
 *   • the kinship mirror is the world's own recorded founding edge, written by the
 *     peace-reason layer, not a claim about a counterpart's hidden strength;
 *   • the seat books are the seller court's own ledger;
 *   • the buyer's razer-hood is BELIEVED — read off the public feed at news speed
 *     through `makeBelievedRazings`, never off the razing records themselves, so a
 *     court that was lied to judges on the lie (the J-WR-7 discipline).
 * Nothing here prices an asset or drafts a term; the appraisal and the bundle stacker
 * remain the pinned negotiation modules. This leaf's own import list is pinned in
 * `sovereigntyIntentWr10.test.js` so a "small lookup" cannot widen it in silence.
 *
 * ⚠ EVERY NUMBER IN `SOVEREIGNTY_INTENT_TUNING` IS AN UNSOAKED BAND — §7 THE TUNING
 * SURFACE owns them and the owner signs them at the soak redo under THE PROMISE. They
 * are authored raw here, deliberately NOT in proposedSoakBands.js, which requires a
 * status this wave has no authority to grant.
 *
 * PURE READ: no mutation, no rng, no wall-clock, no persisted key.
 */
import { clamp01 } from '../../kernel/math.js';
import { DISPOSITION_CHANNEL_TUNING, readDispositionChannel } from './dispositionLedger.js';
import { thresholdFactorOf } from './dispositionProfile.js';
import { peaceReasonsFor } from './peaceReasons.js';
import { REASON_MIRRORS } from './warReasonTaxonomy.js';
import { readWarSeatBooks } from './warSeatBooks.js';
import { settlementAlignment } from './settlementAlignment.js';
import { natureWordFor } from './conquestDoctrineStage.js';
import { makeBelievedRazings } from './believedRazings.js';

/**
 * The closed verdict vocabulary for the observer-axis judgment. `unknown` is a REAL
 * member and it has exactly ONE road: the resolution gate below (no buyer named, a
 * court judging its own purchase, or an observer the world cannot resolve). A court
 * that exists always has a readable nature, so silence never becomes a verdict by
 * accident — it is minted deliberately or not at all.
 */
export const SOVEREIGNTY_SALE_VERDICTS = Object.freeze([
  'unknown', 'unremarkable', 'troubling', 'damnable',
]);

/** WHOSE BOOKS the sale would serve. Borrowed VERBATIM from `readWarSeatBooks`'s own
 *  `interestKind` — J-WR-10 forbids a second spelling of an existing concept. */
export const SOVEREIGNTY_BOOKS_INTERESTS = Object.freeze(['realm', 'seat', 'patron']);

/**
 * THE VERDICT TABLE, as data rather than as a branch chain. The keys are exactly the
 * words `natureWordFor` can return for a resolvable court, and the totality pin
 * asserts that both ways — so a new moral word upstream reds here instead of falling
 * silently into a middling verdict. Selling to a believed razer is damnable to a
 * benevolent court, troubling to a balanced one, and unremarkable to a malicious one:
 * the SAME buyer, two verdicts, from two observers.
 */
const VERDICT_BY_OBSERVER_NATURE = Object.freeze({
  benevolent: 'damnable',
  balanced: 'troubling',
  malicious: 'unremarkable',
});

export const SOVEREIGNTY_INTENT_TUNING = Object.freeze({
  /** The appetite of a court whose outcome memory says nothing. */
  NEUTRAL_APPETITE01: 0.5,
  /** How far a saturated commerce memory reaches for the sale. */
  MERCANTILE_REACH: 0.3,
  /** How far a saturated inward turn resists it. Insularity is applied to an OUTWARD
   *  act, so the bounded channel read is consumed in the reciprocal direction — the
   *  `dispositionProfile` header's own instruction, not a local invention. */
  INSULAR_RESIST: 0.3,
  /** How far a seat whose private books carry the decision reaches for the sale:
   *  "selling the family silver to save the seat." */
  PRIVATE_BOOKS_REACH: 0.15,
  /** The private-book weight at which the seat's books DIVERGE from the realm's.
   *  ⚠ REACHABILITY IS THE CONSTRAINT, NOT THE VALUE: `readWarSeatBooks` yields 0 for
   *  a realm-run court and [0.2 … 0.9] for a seated one, so both sides of this band
   *  are live and the pin proves it on real reads. */
  PRIVATE_BOOKS_DIVERGENCE_FLOOR01: 0.45,
  /** The floor an UNSUPPRESSED intent may never fall below, so that zero means
   *  suppressed and nothing else. See the header. */
  UNSUPPRESSED_FLOOR01: 0.05,
});

/** The one suppression road this leaf can take. Named as data so the Herald kind and
 *  the pin share a spelling with the scorer. */
export const SOVEREIGNTY_SUPPRESSION_KINDS = Object.freeze([REASON_MIRRORS.lineage_claim]);

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {number} value @returns {number} */
function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/** The snapshot item for an id, tolerating either shape the pulse threads.
 *  @param {unknown} snapshot @param {string} id @returns {unknown} */
function itemFor(snapshot, id) {
  if (!id) return null;
  const shaped = recordOf(snapshot);
  if (shaped.byId instanceof Map) return shaped.byId.get(id) || null;
  const rows = Array.isArray(shaped.settlements) ? shaped.settlements : [];
  return rows.find((raw) => String(recordOf(raw).id ?? '') === id) || null;
}

/**
 * The signed pull of one closed channel, in −1 … +1. `thresholdFactorOf` returns a
 * BAR modifier centred on 1 and capped at `THRESHOLD_FACTOR_CAP`; dividing the offset
 * by that cap recovers the saturation the ledger actually holds without this module
 * knowing a single ledger internal. Neutral, absent, or dark reads EXACTLY 0.
 * @param {unknown} entry @param {string} channel @returns {number}
 */
function channelLift(entry, channel) {
  const factor = Number(thresholdFactorOf(entry, channel).factor);
  if (!Number.isFinite(factor)) return 0;
  return (1 - factor) / DISPOSITION_CHANNEL_TUNING.THRESHOLD_FACTOR_CAP;
}

/**
 * @typedef {Object} SovereigntySaleAppetite
 * @property {string} sellerId
 * @property {boolean} channelsLit  WR-2's four-channel memory is lit for this world
 * @property {number} appetite01    0 … 1, the disposition colour alone
 * @property {string} mercantileBand a DISPOSITION_CHANNEL_TUNING.BANDS word
 * @property {string} insularBand    a DISPOSITION_CHANNEL_TUNING.BANDS word
 * @property {string} receipt
 */

/**
 * THE DISPOSITION COLOUR, BUYER-BLIND BY SIGNATURE (E3). Commerce confidence reaches
 * for a sale; an inward turn resists it. Dark WR-2 ⇒ the neutral appetite exactly,
 * with a receipt saying so rather than a silent midpoint.
 *
 * @param {{ worldState?: unknown, sellerId?: unknown }} input
 * @returns {SovereigntySaleAppetite}
 */
export function saleAppetiteOf(input) {
  const row = recordOf(input);
  const worldState = recordOf(row.worldState);
  const sellerId = text(row.sellerId);
  const channelsLit = recordOf(worldState.simulationRules).dispositionChannelsEnabled === true;
  const entry = channelsLit ? recordOf(worldState.dispositionStats)[sellerId] : null;
  const mercantileBand = readDispositionChannel(entry, 'mercantile').band;
  const insularBand = readDispositionChannel(entry, 'insular').band;
  const appetite01 = round4(clamp01(
    SOVEREIGNTY_INTENT_TUNING.NEUTRAL_APPETITE01
    + SOVEREIGNTY_INTENT_TUNING.MERCANTILE_REACH * channelLift(entry, 'mercantile')
    - SOVEREIGNTY_INTENT_TUNING.INSULAR_RESIST * channelLift(entry, 'insular'),
  ));
  const receipt = !sellerId
    ? 'No court is named as the seller, so no appetite is recorded.'
    : channelsLit
      ? `${sellerId}'s commerce memory reads ${mercantileBand} and its inward turn reads ${insularBand}.`
      : `${sellerId} keeps no four-channel outcome memory, so neither commerce nor its walls colour this sale.`;
  return { sellerId, channelsLit, appetite01, mercantileBand, insularBand, receipt };
}

/**
 * THE LIVE KINSHIP MIRROR ON THE PAIR, or null. Read from the SELLER'S OWN peace
 * reasons about the buyer: it is the seller's court that declines, so it is the
 * seller's picture that must contain the bond. The type is named through
 * `REASON_MIRRORS.lineage_claim` rather than as a string literal, which binds the
 * mirror to WR-3's cause and cannot drift from it.
 * @param {unknown} worldState @param {string} sellerId @param {string} buyerId
 * @returns {{ receipt: string, sinceTick: number|null }|null}
 */
function liveKinshipBond(worldState, sellerId, buyerId) {
  if (!sellerId || !buyerId || sellerId === buyerId) return null;
  const entry = peaceReasonsFor(
    /** @type {Parameters<typeof peaceReasonsFor>[0]} */ (worldState), sellerId, buyerId,
  );
  const bond = recordOf(recordOf(recordOf(entry).reasons)[REASON_MIRRORS.lineage_claim]);
  const score = Number(bond.score);
  if (!Number.isFinite(score) || score <= 0) return null;
  const since = Number(bond.sinceTick);
  return {
    receipt: text(bond.receipt) || 'a surviving founding edge binds the two courts.',
    sinceTick: Number.isFinite(since) ? Math.trunc(since) : null,
  };
}

/**
 * @typedef {Object} SovereigntySaleIntent
 * @property {string} sellerId
 * @property {string} buyerId
 * @property {string} assetId
 * @property {number} score01        0 EXACTLY when suppressed; floored otherwise
 * @property {boolean} suppressed
 * @property {string|null} suppressionKind a SOVEREIGNTY_SUPPRESSION_KINDS member
 * @property {string} interestKind   a SOVEREIGNTY_BOOKS_INTERESTS member
 * @property {boolean} booksDiverge
 * @property {string} securityBand
 * @property {string} receipt
 * @property {Record<string, string>} evidence banded words only (law B)
 */

/**
 * WOULD THIS COURT SELL THIS HOLDING TO THIS BUYER? The disposition colour, lifted by
 * a seat whose private books carry the decision, and SUPPRESSED TO ZERO by a live
 * kinship bond with the buyer — with the bond's own receipt carried forward so the
 * `kinship_opposes_the_sale` beat can quote the world rather than re-derive it.
 *
 * @param {{ worldState?: unknown, snapshot?: unknown, sellerId?: unknown,
 *   buyerId?: unknown, assetId?: unknown }} input
 * @returns {SovereigntySaleIntent}
 */
export function readSovereigntySaleIntent(input) {
  const row = recordOf(input);
  const worldState = recordOf(row.worldState);
  const sellerId = text(row.sellerId);
  const buyerId = text(row.buyerId);
  const assetId = text(row.assetId);
  const appetite = saleAppetiteOf({ worldState, sellerId });

  const books = readWarSeatBooks({
    worldState, snapshot: row.snapshot ?? null, actorId: sellerId, opponentId: buyerId,
  });
  const privateWeight01 = Math.max(
    Number(books.seatWeight01) || 0, Number(books.patronWeight01) || 0,
  );
  const interestKind = SOVEREIGNTY_BOOKS_INTERESTS.includes(String(books.interestKind))
    ? String(books.interestKind)
    : 'realm';
  const booksDiverge = privateWeight01
    >= SOVEREIGNTY_INTENT_TUNING.PRIVATE_BOOKS_DIVERGENCE_FLOOR01;
  const booksName = booksDiverge && interestKind === 'patron'
    ? "a foreign patron's books"
    : booksDiverge ? "the ruling seat's own books" : "the realm's books";
  const securityBand = text(books.securityBand) || 'unseated';

  const bond = liveKinshipBond(worldState, sellerId, buyerId);
  const score01 = bond ? 0 : round4(Math.max(
    SOVEREIGNTY_INTENT_TUNING.UNSUPPRESSED_FLOOR01,
    clamp01(appetite.appetite01
      + SOVEREIGNTY_INTENT_TUNING.PRIVATE_BOOKS_REACH * privateWeight01),
  ));
  const receipt = bond
    ? `${sellerId} will not sell ${assetId} to ${buyerId}: ${bond.receipt}`
    : `${sellerId} weighs selling ${assetId} to ${buyerId}. ${appetite.receipt}`
      + ` The sale would serve ${booksName}, and the seat stands ${securityBand}.`;
  return {
    sellerId,
    buyerId,
    assetId,
    score01,
    suppressed: !!bond,
    suppressionKind: bond ? REASON_MIRRORS.lineage_claim : null,
    interestKind,
    booksDiverge,
    securityBand,
    receipt,
    evidence: Object.freeze({
      mercantile: appetite.mercantileBand,
      insular: appetite.insularBand,
      dispositionMemory: appetite.channelsLit ? 'lit' : 'dark',
      books: interestKind,
      booksDivergence: booksDiverge ? 'divergent' : 'aligned',
      seatSecurity: securityBand,
      kinship: bond ? 'bound' : 'unbound',
    }),
  };
}

/** The believed-razing reader, injected by a per-pass caller or built here.
 *  @typedef {{ believedFor: (observerId: string, accusedId: string) =>
 *    ReadonlyArray<{ razerId: string, victimName: string, tick: number }> }} BelievedRazingReader */

/** @param {Record<string, unknown>} row @param {unknown} worldState @param {unknown} snapshot
 *  @returns {BelievedRazingReader} */
function razingReaderOf(row, worldState, snapshot) {
  const injected = recordOf(row.believedRazings);
  if (typeof injected.believedFor === 'function') {
    return /** @type {BelievedRazingReader} */ (/** @type {unknown} */ (injected));
  }
  return makeBelievedRazings({
    worldState, snapshot, wizardNews: row.wizardNews ?? null, tick: row.tick ?? 0,
  });
}

/** The most recent believed burning, ties broken by codepoint so the receipt is
 *  deterministic rather than feed-ordered.
 *  @param {ReadonlyArray<{ victimName: string, tick: number }>} rows
 *  @returns {{ victimName: string, tick: number }|null} */
function latestRazing(rows) {
  /** @type {{ victimName: string, tick: number }|null} */
  let best = null;
  for (const raw of rows) {
    const at = Number(recordOf(raw).tick);
    if (!Number.isFinite(at)) continue;
    const victimName = text(recordOf(raw).victimName);
    const beats = !best || at > best.tick || (at === best.tick && victimName < best.victimName);
    if (beats) best = { victimName, tick: Math.trunc(at) };
  }
  return best;
}

/**
 * @typedef {Object} SovereigntySaleJudgment
 * @property {string} observerId
 * @property {string} buyerId
 * @property {string} observerNature a natureWordFor word, or 'unknown' at the gate
 * @property {string} verdict        a SOVEREIGNTY_SALE_VERDICTS member
 * @property {number} believedRazingCount
 * @property {string} victimName     the latest town the observer believes was burned
 * @property {string} receipt
 */

/**
 * THE OBSERVER-AXIS JUDGMENT (requirement 13, engaged on the MALICE axis, read-side
 * only). The world does not have an opinion about a sale; COURTS do, and they judge on
 * their own axis against what they BELIEVE the buyer to be. Same buyer, two observers,
 * two verdicts — which is the whole point of engaging alignment here rather than
 * scoring the buyer once and calling it morality.
 *
 * ⚠ The spine cites `alignmentOf(id)` for this read and those addresses have ROTTED;
 * the live export is `settlementAlignment(item, worldState)`, navigated by symbol.
 *
 * @param {{ worldState?: unknown, snapshot?: unknown, observerId?: unknown,
 *   buyerId?: unknown, wizardNews?: unknown, tick?: unknown,
 *   believedRazings?: unknown }} input
 * @returns {SovereigntySaleJudgment}
 */
export function judgeSovereigntySale(input) {
  const row = recordOf(input);
  const worldState = recordOf(row.worldState);
  const snapshot = row.snapshot ?? null;
  const observerId = text(row.observerId);
  const buyerId = text(row.buyerId);
  const item = itemFor(snapshot, observerId);
  if (!buyerId || observerId === buyerId || !item) {
    const blocked = !buyerId
      ? 'no buyer is named'
      : observerId === buyerId
        ? 'a court does not judge its own purchase'
        : 'the world cannot resolve the observing court';
    return {
      observerId,
      buyerId,
      observerNature: 'unknown',
      verdict: 'unknown',
      believedRazingCount: 0,
      victimName: '',
      receipt: `No verdict is recorded on this sale: ${blocked}.`,
    };
  }

  const observerNature = natureWordFor(Number(settlementAlignment(
    /** @type {Parameters<typeof settlementAlignment>[0]} */ (item),
    /** @type {Parameters<typeof settlementAlignment>[1]} */ (worldState),
  ).malice01));
  const believed = razingReaderOf(row, worldState, snapshot).believedFor(observerId, buyerId);
  const latest = latestRazing(believed);
  const verdict = believed.length === 0
    ? 'unremarkable'
    : /** @type {Record<string, string>} */ (VERDICT_BY_OBSERVER_NATURE)[observerNature]
      || 'unknown';
  const victimName = latest ? latest.victimName : '';
  const receipt = believed.length === 0
    ? `${observerId} believes ${buyerId} has burned no town, so the purchase reads ${verdict}.`
    : `${observerId} reads its own nature as ${observerNature} and believes ${buyerId}`
      + ` burned ${victimName}, so the purchase reads ${verdict}.`;
  return {
    observerId,
    buyerId,
    observerNature,
    verdict,
    believedRazingCount: believed.length,
    victimName,
    receipt,
  };
}

/** Exported for the totality pin: the verdict table's keys are exactly the moral words
 *  a resolvable court can read, so a new word upstream reds rather than files quietly
 *  under the middling verdict. */
export const SOVEREIGNTY_JUDGED_NATURES = Object.freeze(
  Object.keys(VERDICT_BY_OBSERVER_NATURE).sort(),
);
