/**
 * pactTriggers.js — GR-2. THE FOUR PEACETIME OCCASIONS, AS PURE ARITHMETIC.
 *
 * A war ends and the winner dictates. That road the engine has always had. This leaf is
 * the other one: what makes two courts at peace decide, on their own evidence, that there
 * is something to write down. Four occasions, closed and named — a demand for what one
 * court believes it lacks, a communion of rite, a pressure of people, and a threat both
 * courts believe in — plus `renewal`, which is a member of the vocabulary and GR-5's
 * producer (the `non_intervention` tombstone idiom: a word with no producer is never
 * drafted, so it is byte-identical until its own wave lands).
 *
 * ── WHY THIS LEAF IS LADDER-AGNOSTIC, AND WHY THAT BEATS MIRRORING ──────────────
 * Every occasion below is a comparison between two BANDED WORDS a court believes about
 * itself and about its neighbour — a scarcity rung, a devotion rung, a pull rung. The
 * ladders those rungs live on are `beliefAxisSubjects.js`'s, and this file must not
 * import them: it is a member of the K3 negotiation set (tests/domain/envoyK3BeliefSeam
 * .test.js), whose whole promise is that a negotiation reaches nothing that could hand it
 * a settlement's real strength, stock or pressure.
 *
 * The estate's recorded cure for a cross-layer ladder is MIRROR-NOT-IMPORT: declare it
 * locally and pin the two spellings equal with a walker. This leaf takes the strictly
 * better road available to it — it declares NO ladder at all. Every scorer receives the
 * ladder as an argument and does rung arithmetic on it, so there is no second copy to
 * drift, no equality walker to keep honest, and the supplying module stays the single
 * author of what the words are. The caller (`pactProposals.js`) imports the real ladders
 * and hands them down. A ladder this leaf cannot name is a ladder it cannot get wrong.
 *
 * ── THE COUNTERFORCE IS SCORED FROM THE FORCE'S OWN EVIDENCE ────────────────────
 * `dependencyFearOf` is not a second opinion bolted onto a first. It re-reads the demand's
 * OWN magnitude through the pair's existing `dependency`/`leverage` relationship axes and
 * the proposer's insularity, so a pact that would bind a court too tightly is refused by
 * exactly the numbers that invited it. Both sides of that band are live and are pinned
 * live: at zero reliance and zero insularity the fear is zero and never wins; at high
 * reliance it exceeds the demand and always does. A counterforce that could not win would
 * be the dead-band class wearing a design's clothes.
 *
 * ── BANDS ARE UNSOAKED ──────────────────────────────────────────────────────────
 * ⚠ Every number in `PACT_TRIGGER_TUNING` is authored raw. §7 THE TUNING SURFACE owns
 * them and the owner signs them at the soak redo under THE PROMISE; they are deliberately
 * NOT in proposedSoakBands.js, whose gate requires a status this wave has no authority to
 * grant.
 *
 * PURE: no rng, no wall clock, no store, no state, no write, and one kernel import. The
 * clamp comes from `src/kernel/math.js` because `tests/lint/clampPrimitiveBaseline.test.js`
 * forbids a sixty-third local copy, and every value this file clamps is proven finite
 * before it arrives, so the kernel's non-finite policy changes nothing it computes.
 *
 * @enforced-by tests/domain/pactTriggers.test.js,
 *   tests/domain/envoyK3BeliefSeam.test.js,
 *   tests/property/pactFormationDormancyFence.test.js
 */
import { clamp01 } from '../../kernel/math.js';

/**
 * THE CLOSED TRIGGER VOCABULARY (codepoint-frozen). Five, and `renewal` is deliberately
 * among them with no producer in this wave: GR-5 mints it, and a proposal row carrying a
 * word outside this set is refused at import rather than stored.
 * @type {readonly string[]}
 */
export const PACT_TRIGGERS = Object.freeze([
  'faith_communion', 'migration_pressure', 'renewal', 'shared_threat', 'trade_demand',
]);

/** The four this wave actually produces. `renewal` is GR-5's, and the difference between
 *  these two lists IS the tombstone — a reachability pin quantifies over THIS one and a
 *  vocabulary pin over the other, so neither can absorb the other's failure.
 *  @type {readonly string[]} */
export const PACT_TRIGGERS_PRODUCED = Object.freeze([
  'faith_communion', 'migration_pressure', 'shared_threat', 'trade_demand',
]);

/** ⚠ UNSOAKED — §7 owns these; the owner signs them at the soak redo. */
export const PACT_TRIGGER_TUNING = Object.freeze({
  /** How many rungs of believed scarcity must separate the pair before a demand exists.
   *  Two, on a four-rung ladder: a court that merely buys a little more of something than
   *  its neighbour has not discovered a reason to write anything down. */
  DEMAND_RUNG_GAP: 2,
  /** The rung of believed devotion BOTH courts must stand at or above for a communion to
   *  be legible, and how far apart they may stand while still recognising each other. */
  COMMUNION_RUNG_FLOOR: 2,
  COMMUNION_RUNG_SPREAD: 1,
  /** How many rungs of believed pull must separate the pair before people are visibly
   *  moving from one to the other. */
  PULL_RUNG_GAP: 2,
  /** The ONE band word this file names, and it names it as a FLOOR to sit above rather
   *  than as a ladder to re-author: the intensity rungs belong to `warAllianceRisk.js`,
   *  which is the module that grades them, and a private copy here would be the second
   *  web the alliance-web census exists to forbid. */
  SHARED_THREAT_FLOOR_BAND: 'quiet',
  /** Below this a crossing has not happened. A score is a reason; this is the bar. */
  CROSSING_FLOOR01: 0.5,
  /** How much of the reliance term is owed to what the pair already depends on, versus
   *  what it cannot leverage back. Both halves are live at both ends. */
  RELIANCE_DEPENDENCY_WEIGHT: 0.6,
  /** THE COUNTERFORCE'S REACH. Above 1 so the fear CAN exceed the demand that raised it —
   *  at exactly 1 the counterforce could never win any fixture and the whole axis would be
   *  decorative (the recorded dead-band class). */
  FEAR_GAIN: 1.6,
  /** How much an insular court's own walls add on top of the priced reliance. */
  FEAR_INSULARITY_WEIGHT: 0.3,
});

const T = PACT_TRIGGER_TUNING;

/** @param {unknown} value @returns {string} */
function word(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

/** @param {unknown} value @returns {Record<string, unknown>} */
function recordOf(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value) : {};
}

/**
 * The rung a believed word stands on, or −1 when the ladder does not carry it.
 * ABSENT IS −1 AND NEVER 0: rung 0 is a real rung on every ladder this leaf is handed —
 * the bottom of each is a WORD a court can genuinely believe — and reading an unresolved
 * belief as that rung would manufacture a certainty the court never held.
 *
 * ⚠ THE RUNGS ARE NOT NAMED HERE, AND THAT IS ENFORCED. `tests/lint/spAxisVocabulary
 * .walker.test.js` asserts the scarcity and pull ladders appear as quoted literals in
 * exactly ONE file under src/ — their vocabulary home — so a ladder's words cannot be read
 * by mistake anywhere else. An earlier draft of this docstring quoted three of them as
 * examples and reddened that walker; the illustration was not worth a hole in the law.
 * @param {readonly string[]} ladder @param {unknown} value @returns {number}
 */
export function rungOf(ladder, value) {
  const w = word(value);
  return w && Array.isArray(ladder) ? ladder.indexOf(w) : -1;
}

/**
 * The signed rung distance from `fromWord` to `toWord`, or null when EITHER end is
 * unresolved. Null is the honest answer and the callers all treat it as "no occasion",
 * never as zero.
 * @param {readonly string[]} ladder @param {unknown} fromWord @param {unknown} toWord
 * @returns {number|null}
 */
export function rungGap(ladder, fromWord, toWord) {
  const from = rungOf(ladder, fromWord);
  const to = rungOf(ladder, toWord);
  return from < 0 || to < 0 ? null : to - from;
}

/** A crossing's shape. @typedef {Readonly<{trigger: string, score01: number,
 *   crossed: boolean, receipt: string, subject: string}>} PactTriggerCrossing */

/**
 * @param {string} trigger @param {number} score01 @param {string} receipt
 * @param {string} [subject] @returns {PactTriggerCrossing}
 */
function crossing(trigger, score01, receipt, subject = '') {
  const score = clamp01(score01);
  return Object.freeze({
    trigger, score01: score, crossed: score >= T.CROSSING_FLOOR01, receipt, subject,
  });
}

/** The null crossing — an occasion that did not arise, with the reason it did not. */
const NO_CROSSING = (trigger, receipt) => crossing(trigger, 0, receipt);

/**
 * THE DEMAND (`trade_demand`). A believes it lacks what it believes B has dear.
 *
 * BOTH ENDS ARE BELIEFS and the wrong-market tragedy is LEGAL: a pact can be signed for
 * grain the counterparty never had, and the world discovers the mismatch as the next
 * grievance rather than as a validation error here. K3's absurdity law, reaching peacetime.
 *
 * The category chosen is the one with the WIDEST believed gap, codepoint-first on a tie,
 * so the demand is total over the categories a court holds beliefs about rather than
 * dependent on object key order.
 *
 * @param {{ladder: readonly string[], proposerBands?: unknown, counterpartyBands?: unknown}} input
 * @returns {PactTriggerCrossing}
 */
export function scoreTradeDemand({ ladder, proposerBands, counterpartyBands }) {
  const mine = recordOf(proposerBands);
  const theirs = recordOf(counterpartyBands);
  const span = Array.isArray(ladder) && ladder.length > 1 ? ladder.length - 1 : 0;
  if (!span) return NO_CROSSING('trade_demand', 'No scarcity ladder was supplied to price a demand against.');
  let best = { category: '', gap: 0 };
  for (const category of Object.keys(mine).sort()) {
    const gap = rungGap(ladder, mine[category], theirs[category]);
    if (gap == null || gap < T.DEMAND_RUNG_GAP) continue;
    if (gap > best.gap) best = { category, gap };
  }
  if (!best.category) {
    return NO_CROSSING('trade_demand',
      'This court believes its neighbour holds nothing it believes itself short of.');
  }
  return crossing('trade_demand', best.gap / span,
    `This court believes itself ${word(mine[best.category])} in ${best.category.replace(/_/g, ' ')}`
    + ` where it believes its neighbour ${word(theirs[best.category])}.`,
    best.category);
}

/**
 * THE COMMUNION (`faith_communion`). Two courts believed devout, and believed devout to
 * about the same degree — a shared rite is a recognition, not a conversion, so a devout
 * court and a lukewarm one have no communion however strongly the first believes.
 *
 * @param {{ladder: readonly string[], proposerWord?: unknown, counterpartyWord?: unknown}} input
 * @returns {PactTriggerCrossing}
 */
export function scoreFaithCommunion({ ladder, proposerWord, counterpartyWord }) {
  const mine = rungOf(ladder, proposerWord);
  const theirs = rungOf(ladder, counterpartyWord);
  const top = Array.isArray(ladder) && ladder.length > 1 ? ladder.length - 1 : 0;
  if (!top || mine < 0 || theirs < 0) {
    return NO_CROSSING('faith_communion',
      'One of these courts holds no belief about the other\'s observance.');
  }
  if (Math.abs(mine - theirs) > T.COMMUNION_RUNG_SPREAD) {
    return NO_CROSSING('faith_communion',
      'These courts are believed to keep the rites too differently to keep them together.');
  }
  const floor = Math.min(mine, theirs);
  if (floor < T.COMMUNION_RUNG_FLOOR) {
    return NO_CROSSING('faith_communion',
      'Neither court is believed observant enough for a shared rite to mean anything.');
  }
  return crossing('faith_communion', (floor - T.COMMUNION_RUNG_FLOOR + 1) / (top - T.COMMUNION_RUNG_FLOOR + 1),
    `Both courts are believed to keep the rites — ${word(proposerWord)} here, ${word(counterpartyWord)} there.`,
    word(proposerWord));
}

/**
 * THE PRESSURE (`migration_pressure`). One court is believed to draw people the other is
 * believed to lose. DIRECTED: the gap is signed, and only a pull TOWARD the counterparty
 * is a pressure this court would treat about.
 *
 * @param {{ladder: readonly string[], proposerWord?: unknown, counterpartyWord?: unknown}} input
 * @returns {PactTriggerCrossing}
 */
export function scoreMigrationPressure({ ladder, proposerWord, counterpartyWord }) {
  const gap = rungGap(ladder, proposerWord, counterpartyWord);
  const span = Array.isArray(ladder) && ladder.length > 1 ? ladder.length - 1 : 0;
  if (!span || gap == null) {
    return NO_CROSSING('migration_pressure',
      'One of these courts holds no belief about where people are going.');
  }
  if (gap < T.PULL_RUNG_GAP) {
    return NO_CROSSING('migration_pressure',
      'Neither court is believed to be drawing the other\'s people away.');
  }
  return crossing('migration_pressure', gap / span,
    `This court is believed ${word(proposerWord)} where its neighbour is believed`
    + ` ${word(counterpartyWord)}, and people move on that difference.`,
    word(counterpartyWord));
}

/**
 * THE THREAT (`shared_threat`). The WR-6 alliance-web risk read, pointed at a court both
 * of these courts have reason to fear.
 *
 * IT CONSUMES THE READ'S OWN BAND AND NEVER RE-GRADES IT. The intensity rungs are
 * `warAllianceRisk.js`'s, so this scorer names exactly ONE of them — the floor it must sit
 * above — and takes `risk01` from the same read for the magnitude. A private ladder here
 * would be the second web `tests/lint/allianceWebRiskConsumers.walker.test.js` forbids.
 *
 * @param {{band?: unknown, risk01?: unknown, threatId?: unknown}} input
 * @returns {PactTriggerCrossing}
 */
export function scoreSharedThreat({ band, risk01, threatId }) {
  const graded = word(band);
  if (!graded || graded === T.SHARED_THREAT_FLOOR_BAND) {
    return NO_CROSSING('shared_threat',
      'No court either of these believes in is armed enough to be worth fearing together.');
  }
  return crossing('shared_threat', Number(risk01),
    `Both courts reckon the web around ${word(threatId) || 'that court'} ${graded}.`,
    word(threatId));
}

/**
 * THE DEPENDENCY FEAR — the counterforce, priced from the force's own evidence.
 *
 * `reliance01` is what the pair ALREADY is to each other: what this court depends on,
 * and what it cannot press back. The demand's own magnitude is then read through it and
 * lifted by the court's insularity. `refuses` is the whole verdict — the fear beat the
 * demand — and the receipt names the fear rather than reporting a bare no.
 *
 * @param {{demand01?: unknown, dependency01?: unknown, leverage01?: unknown,
 *   insularity01?: unknown}} input
 * @returns {Readonly<{fear01: number, reliance01: number, refuses: boolean, receipt: string}>}
 */
export function dependencyFearOf({ demand01, dependency01, leverage01, insularity01 }) {
  const demand = clamp01(demand01);
  const dependency = clamp01(dependency01);
  const leverage = clamp01(leverage01);
  const insularity = clamp01(insularity01);
  const reliance = clamp01(
    T.RELIANCE_DEPENDENCY_WEIGHT * dependency
    + (1 - T.RELIANCE_DEPENDENCY_WEIGHT) * (1 - leverage),
  );
  const fear = clamp01(demand * T.FEAR_GAIN * reliance + insularity * T.FEAR_INSULARITY_WEIGHT);
  const refuses = fear > demand;
  return Object.freeze({
    fear01: fear,
    reliance01: reliance,
    refuses,
    receipt: refuses
      ? 'This court wants the bargain and fears what the bargain would make of it: it already'
        + ' leans on this neighbour further than it can lean back.'
      : 'This court can carry what the bargain would cost it in reliance.',
  });
}
