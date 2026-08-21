/**
 * strategicPosture.js — SP-C: THE POSTURE READ (docs/DESIGN_FP_ARCH_SP.md §SP-C).
 *
 * What a court is DISPOSED to do, as a bounded colour on an action bar and a sentence
 * that names its own evidence. It decides nothing, selects nobody, and writes nothing.
 *
 * ⚠⚠ THE NAMES ARE THE CHAIR'S, NOT THE VOLUME'S — RULING CR-C4-1 (vetoable).
 * The SP volume and the constitution both spell these reads `postureOf` /
 * `riskToleranceOf`. `riskToleranceOf` IS ALREADY TAKEN: `src/domain/roads/state.js`
 * exports `riskToleranceOf(npc)`, an NPC-grain roads-courage read consumed by
 * `roadsKernel.js` — a different grain, a different domain, and a different contract.
 * Two exports of one name in one domain tree is the silent-collision class this estate
 * has been bitten by (a grep-led sweep conflates the contracts; an import fixes the
 * wrong one). GRAMMAR's §7 Q2 measured the collision and ruled the court reads
 * `courtPostureOf` / `courtRiskAppetiteOf`; SP §11 Q2 recommended the opposite. The
 * chair ruled for the GRAMMAR spelling, the SP volume's SP-C block is aligned to it in
 * the commit that lands this file, and `tests/lint/postureNameCollision.walker.test.js`
 * keeps `riskToleranceOf` resolving to exactly ONE definition under src/domain from here
 * on. THE GRAIN IS THE TELL: roads asks whether a NAMED TRAVELLER will take a dangerous
 * road; this asks whether a COURT will take a dangerous course.
 *
 * THE MODULE CANNOT NAME A VICTIM, and that is structural rather than promised (E3's
 * threshold-shaped-reads law, the P4 no-hidden-governor pattern). Its whole import list
 * is the disposition ledger plus the kernel's `clamp` primitive — one STATE read and one
 * arithmetic function — so there is no relationship graph here, no neighbour list, no
 * candidate set, and no way to reach one. (The kernel import is the sanctioned move
 * rather than a sixty-first hand-rolled clamp: `clampPrimitiveBaseline` forbids a new
 * local copy, and every input this module clamps is proven finite before it arrives, so
 * the kernel's non-finite policy changes nothing it computes.) A posture COLOURS an
 * ordinary decision that some other module was already going to make on its own
 * constraints; it never selects the target of that decision. The import list is pinned
 * as a reviewed exact set with an executed violation mutant, so a "small lookup" added
 * later reds instead of widening the module in silence.
 *
 * THE TWO DEGRADED ARMS ARE ABSENT, NOT ZERO, and the difference is the whole design:
 *   - THE RULER'S BOOKS are unbuilt (`grep seatBooksEnabled src` → zero hits, measured
 *     again at this commit). INTERIOR's INT-1 generalises `warSeatBooks.js`'s war-scoped
 *     read into the one the posture will take. Until then the term does not vote. It is
 *     not imported and not inferred — the caller supplies it or it is absent.
 *   - THE DISPOSITION CHANNELS need `dispositionChannelsEnabled` lit. Dark, the court
 *     still has its REMEMBERED STANDING: the legacy signed score every campaign carries.
 *   A missing term is dropped from the weighted mean rather than voted at neutral, so a
 *   court with one term speaks with that term's whole voice instead of being dragged
 *   three-quarters of the way to silence. Lighting either upstream flag is therefore a
 *   disclosed same-seed shift for every posture consumer (INT-1's and WR-2's lists).
 *
 * WHY IT READS THE LEDGER LEAF AND NOT `dispositionProfile.js` (recorded, vetoable —
 * the SP volume names that file as READ-not-edited and this leaf does neither).
 * `thresholdFactorOf` returns a bounded factor for ONE channel under its own cap, plus a
 * sentence in its own voice. Composing four of those would multiply two caps — so the
 * posture could no longer promise the single bound this file's whole "colours, never
 * drowns" claim rests on — and would blend two receipt vocabularies into one sentence.
 * The posture reads the raw channel stocks and applies ONE cap. dispositionProfile
 * remains the right read for a SINGLE-channel consumer, and neither module imports the
 * other.
 *
 * `standing` AND `channels` ARE NEVER BOTH PRESENT. Under lit channels the ledger
 * DERIVES the legacy score from martial stock (dispositionLedger's own writer:
 * `score = (martial.stock01 - neutral) * 2 * SCORE_MAX`), so counting both would be
 * J-WR-11's double-count reborn — one memory voting twice. `channels` is the extended
 * form of the same memory and supersedes it.
 *
 * ONE BY-NAME GATE READ. `strategicPostureActive` is `strategicPostureEnabled`'s ONLY
 * strict read in the tree, and it is the door that feeds the ledger's appetite writer.
 * The flag is VIRTUAL under the CQ5 law (FP §3, CR-WR10-C): absent from
 * DEFAULT_SIMULATION_RULES and from every preset spread, so a campaign that never lights
 * it pays ZERO persisted bytes; read `=== true`, so ABSENT and FALSE are identical at
 * every decision site; manifested in `ENGINE_GATED_VIRTUAL_RULE_KEYS` with its AUTHORED
 * certification row in the SAME COMMIT as this, its first real gate read.
 *
 * LIGHTING ORDER, and it is invalid SAFELY: the appetite the flag governs is written
 * inside the WR-2 channel writer's lit arm, so lighting this flag over dark channels
 * writes nothing at all rather than half-running. The posture read still answers, from
 * the remembered standing alone, and the receipt says so.
 *
 * PURE: no rng, no wall clock, no store, no state, no write.
 */
import { clamp } from '../../kernel/math.js';
import {
  DISPOSITION_CHANNELS,
  DISPOSITION_CHANNEL_TUNING,
  DISPOSITION_TUNING,
  dispositionBandOf,
  readDispositionAppetite,
  readDispositionChannel,
  readDispositionMultiplier,
} from './dispositionLedger.js';

/**
 * THE CLOSED ACTOR SET (SP §8 seam contract 9). Houses and temples bind when TRADE's
 * and FAITH's actor records exist; widening this set is an explicit SP-4a amendment at
 * the constitution, never a volume-local mint. An unknown class REDS rather than being
 * guessed at — a posture read that quietly treats a temple as a settlement would be
 * wrong in a way no gate could see.
 * @type {readonly string[]}
 */
export const POSTURE_ACTOR_KINDS = Object.freeze(['settlement']);

/**
 * The four terms a posture can be weighed from, in composition order. A posture receipt
 * names exactly which of them it had.
 * @type {readonly string[]}
 */
export const POSTURE_TERMS = Object.freeze(['standing', 'channels', 'appetite', 'books']);

/** Composition weights + the cap. SP §7's owner-signature surface for this wave. */
const POSTURE_TERM_WEIGHTS = Object.freeze({
  standing: 0.2,
  channels: 0.35,
  appetite: 0.3,
  books: 0.15,
});
/**
 * A POSTURE COLOURS, NEVER DROWNS. The composed factor is bounded to 1 ± this, so a
 * saturated court moves its own bar by a fifth and no combination of terms can make an
 * ordinary decision a foregone one.
 */
const POSTURE_THRESHOLD_CAP = 0.18;

/** How a receipt says each term, so no consumer re-words the evidence. */
const POSTURE_TERM_WORDS = Object.freeze({
  standing: 'its remembered standing',
  channels: 'its disposition channels',
  appetite: 'its learned appetite',
  books: 'its ruler\'s books',
});

const NEUTRAL = DISPOSITION_CHANNEL_TUNING.NEUTRAL_STOCK01;

/** @param {number} value */
const round6 = (value) => Math.round(value * 1_000_000) / 1_000_000;
/** A 0..1 stock as a signed −1..+1 pull away from neutral. @param {number} stock01 */
const centered = (stock01) => clamp((stock01 - NEUTRAL) * 2, -1, 1);
/** @param {unknown} value */
const isRecord = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * THE ONE BY-NAME STRICT READ of `strategicPostureEnabled`. Everything SP-C writes or
 * reads passes through here; there is no second spelling anywhere in the tree.
 * @param {unknown} rules a simulationRules record
 * @returns {boolean}
 */
export function strategicPostureActive(rules) {
  if (!isRecord(rules)) return false;
  return /** @type {{strategicPostureEnabled?: unknown}} */ (rules).strategicPostureEnabled === true;
}

/**
 * THE TRIPWIRE. An actor outside the closed set throws rather than being read as a
 * settlement — SP §8 seam contract 9, and the reason `courtPostureOf` takes a typed
 * reference instead of a bare id.
 * @param {unknown} actorRef
 * @returns {{kind: string, id: string}}
 */
function assertActor(actorRef) {
  const ref = isRecord(actorRef) ? /** @type {Record<string, unknown>} */ (actorRef) : null;
  const kind = ref && typeof ref.kind === 'string' ? ref.kind : '';
  const id = ref && ref.id != null ? String(ref.id) : '';
  if (!POSTURE_ACTOR_KINDS.includes(kind) || !id) {
    throw new Error(
      `strategicPosture: unsupported actor reference ${JSON.stringify(actorRef)}. The closed`
      + ` actor set is {${POSTURE_ACTOR_KINDS.join(', ')}} and widening it is an SP-4a`
      + ' amendment at the constitution, never a caller\'s guess',
    );
  }
  return { kind, id };
}

/**
 * The channels term. Outward nerve (martial, mercantile, diplomatic) less the pull of
 * the walls (insular) — the same inverse relation the ledger's own writer applies when
 * it teaches those channels, read here rather than re-authored.
 * @param {unknown} entry a dispositionStats row
 * @returns {number}
 */
function channelsSigned(entry) {
  const outward = DISPOSITION_CHANNELS
    .filter((channel) => channel !== 'insular')
    .map((channel) => centered(readDispositionChannel(entry, channel).stock01));
  const mean = outward.reduce((a, b) => a + b, 0) / outward.length;
  return clamp(mean - centered(readDispositionChannel(entry, 'insular').stock01), -1, 1);
}

/**
 * The remembered-standing term: the legacy signed score, read through the ledger's own
 * saturating multiplier rather than re-derived from wins and losses here.
 * @param {string} id @param {unknown} entry @returns {number}
 */
function standingSigned(id, entry) {
  const multiplier = readDispositionMultiplier({ [id]: entry }, id);
  return clamp((multiplier - 1) / DISPOSITION_TUNING.MULTIPLIER_SPAN, -1, 1);
}

/** @param {readonly string[]} words @returns {string} */
function listed(words) {
  if (words.length <= 1) return words[0] || '';
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}

/**
 * @typedef {{signed: number, band: string}} PostureTerm
 */

/**
 * THE POSTURE. A bounded threshold colour, the band WORD behind it, the term set it was
 * weighed from, and the term set that said nothing.
 *
 * SIGNATURE NOTE (implementer correction, recorded rather than silent): the SP volume
 * spells this `postureOf(settlementId)`. The module is store-blind by contract — it
 * imports one pure leaf and can reach no world state — so the court's ledger row arrives
 * as DATA, exactly as `dispositionProfile.thresholdFactorOf(dispositionEntry, channel)`
 * takes its own. The actor arrives as a typed reference rather than a bare id so the
 * closed-set tripwire covers both reads.
 *
 * @param {unknown} actorRef  `{ kind: 'settlement', id }` — the closed actor set
 * @param {unknown} [dispositionEntry] worldState.dispositionStats[id], or null
 * @param {{rules?: unknown, books?: {stock01?: unknown}|null}} [options]
 * @returns {Readonly<{id: string, kind: string, factor: number, band: string,
 *   direction: 'lower'|'raise'|'neutral', terms: string[], absent: string[],
 *   bands: Record<string, string>, receipt: string}>}
 */
export function courtPostureOf(actorRef, dispositionEntry = null, options = {}) {
  const actor = assertActor(actorRef);
  const rules = options && options.rules;
  const entry = isRecord(dispositionEntry) ? dispositionEntry : null;
  const channelsLit = isRecord(rules)
    && /** @type {{dispositionChannelsEnabled?: unknown}} */ (rules).dispositionChannelsEnabled === true;

  /** @type {Record<string, PostureTerm>} */
  const present = {};
  if (entry && channelsLit) {
    const signed = channelsSigned(entry);
    present.channels = { signed, band: dispositionBandOf(NEUTRAL + signed / 2) };
  } else if (entry) {
    const signed = standingSigned(actor.id, entry);
    present.standing = { signed, band: dispositionBandOf(NEUTRAL + signed / 2) };
  }
  const appetite = readDispositionAppetite(entry);
  if (strategicPostureActive(rules) && appetite.present) {
    present.appetite = { signed: centered(appetite.stock01), band: appetite.band };
  }
  // The books term is supplied or it is ABSENT. A non-finite or mis-shaped supply is
  // REFUSED rather than coerced: a books term read as zero would be a claim the caller
  // never made, and "the treasury is empty" is a very different sentence from "nobody
  // asked the treasurer".
  const books = (options && options.books) || null;
  const booksStock = books && typeof books.stock01 === 'number' ? books.stock01 : NaN;
  if (Number.isFinite(booksStock)) {
    const stock = clamp(booksStock, 0, 1);
    present.books = { signed: centered(stock), band: dispositionBandOf(stock) };
  }

  const terms = POSTURE_TERMS.filter((term) => present[term]);
  const absent = POSTURE_TERMS.filter((term) => !present[term]);
  const weighed = terms.reduce(
    (acc, term) => {
      const weight = /** @type {Record<string, number>} */ (POSTURE_TERM_WEIGHTS)[term];
      return { weight: acc.weight + weight, sum: acc.sum + weight * present[term].signed };
    },
    { weight: 0, sum: 0 },
  );
  // AN ABSENT TERM DOES NOT VOTE. Dividing by the weight actually present is what makes
  // a degraded arm degraded rather than dampened.
  const composite = weighed.weight > 0 ? clamp(weighed.sum / weighed.weight, -1, 1) : 0;
  const band = dispositionBandOf(NEUTRAL + composite / 2);
  /** @type {Record<string, string>} */
  const bands = {};
  for (const term of terms) bands[term] = present[term].band;

  const heard = terms.map((term) => /** @type {Record<string, string>} */ (POSTURE_TERM_WORDS)[term]);
  const unheard = absent.map((term) => /** @type {Record<string, string>} */ (POSTURE_TERM_WORDS)[term]);
  const receipt = terms.length === 0
    ? `This court's posture reads ${band}: nothing was heard from ${listed(unheard)}.`
    : `This court's posture reads ${band}, weighed from ${listed(heard)}.`
      + (unheard.length ? ` Nothing was heard from ${listed(unheard)}.` : '');

  return Object.freeze({
    id: actor.id,
    kind: actor.kind,
    factor: round6(1 - composite * POSTURE_THRESHOLD_CAP),
    band,
    direction: composite > 0 ? 'lower' : composite < 0 ? 'raise' : 'neutral',
    terms,
    absent,
    bands: Object.freeze(bands),
    receipt,
  });
}

/**
 * THE APPETITE READ for the closed actor set. Absent is said, never guessed: a court
 * that has learned nothing reads `present: false` and neutral, and the receipt says the
 * outcomes never came rather than implying the court is timid.
 *
 * ⚠ NOT `riskToleranceOf` — see the header. That name belongs to the roads NPC read.
 *
 * @param {unknown} actorRef `{ kind: 'settlement', id }`
 * @param {unknown} [dispositionEntry]
 * @param {{rules?: unknown}} [options]
 * @returns {Readonly<{kind: string, id: string, present: boolean, stock01: number,
 *   band: string, receipt: string}>}
 */
export function courtRiskAppetiteOf(actorRef, dispositionEntry = null, options = {}) {
  const actor = assertActor(actorRef);
  const read = readDispositionAppetite(isRecord(dispositionEntry) ? dispositionEntry : null);
  const present = strategicPostureActive(options && options.rules) && read.present;
  return Object.freeze({
    kind: actor.kind,
    id: actor.id,
    present,
    stock01: present ? read.stock01 : NEUTRAL,
    band: present ? read.band : dispositionBandOf(NEUTRAL),
    receipt: present
      ? `This court's appetite for risk reads ${read.band}, learned from resolved outcomes.`
      : 'This court has learned no appetite for risk from any resolved outcome.',
  });
}

/** SP §7's owner-signature surface for the composition half of this wave. */
export const POSTURE_TUNING = Object.freeze({
  TERM_WEIGHTS: POSTURE_TERM_WEIGHTS,
  THRESHOLD_CAP: POSTURE_THRESHOLD_CAP,
  TERM_WORDS: POSTURE_TERM_WORDS,
});
