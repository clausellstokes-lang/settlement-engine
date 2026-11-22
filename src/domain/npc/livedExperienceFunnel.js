/**
 * domain/npc/livedExperienceFunnel.js — THE EXPERIENCE FUNNEL (W-LIVES car L3;
 * DESIGN_W_LIVES.md §3 + §5, as amended by §15's panel fold, which OUTRANKS them).
 *
 * ONE WRITER. Every lesson a life teaches enters here, through the closed
 * vocabulary in `livedExperienceCatalog.js`, and leaves through car L2's
 * `writeAxisDrift` — the only function in the estate that may move a soul. This
 * module owns the FOLD (which lessons apply, in what order) and the RECEIPTS
 * (what a moved soul is worth saying out loud). It owns no state of its own.
 *
 * ── CLOSEST-PLANE-WINS, AND WHY IT IS A DEDUPE NOT A FILTER ─────────────────
 *
 * §3: "one event teaches one NPC on its closest plane only — the structural cure
 * for double-counting (one mission failure never teaches personally AND via the
 * faction)." The precedence is over the pair (NPC, EVENT), not over kinds and not
 * over NPCs: the same event legitimately teaches the agent personally AND their
 * faction-mates by affiliation, because those are different people. What may never
 * happen is one person learning the same event twice at two distances.
 *
 * So the fold groups by (subject, eventId) and keeps the closest plane, breaking a
 * same-plane tie on the kind's codepoint order so the survivor is deterministic
 * rather than arrival-ordered. The KIND owns its plane (the catalog's table); an
 * entry may DECLARE one, and a declaration that disagrees is REFUSED rather than
 * honoured — a source that thinks a kind sits on a different plane is
 * mis-registered, and silently trusting it would let an adapter smuggle a witness
 * lesson onto the personal plane where it teaches four times as hard.
 *
 * ── THE F9 SOURCE LAW, AS AMENDED AT §853, MADE MACHINERY ───────────────────
 *
 * L2 measured that the materialization floor blocks its own accumulation: nothing
 * sub-floor is stored, so a per-tick sub-epsilon pull restarts from zero every
 * tick and can never cross — fifty ticks of a faint pull mark nobody. The chair's
 * amendment puts the cure at the SOURCE: "ambient/milieu sources emit at INTERVAL
 * cadence with time-integrated magnitude; no source may emit per-tick sub-floor
 * pulls; no sub-floor accumulator state exists."
 *
 * That law is enforced here in three structural ways rather than remembered:
 *
 *   1. THE BAND WORDS BOTTOM OUT AT THE FLOOR. `faint` IS
 *      `MATERIALIZATION_EPSILON` — derived, not chosen — so the smallest thing a
 *      source may say is exactly the smallest thing that can be recorded.
 *   2. A FAMILY STEPS DOWN A LADDER, IT DOES NOT MULTIPLY. Per-family teaching
 *      strength is an index shift on `faint`/`firm`/`heavy`, clamped at `faint`.
 *      A multiplicative learn rate below 1 would have re-created the sub-floor
 *      pull the amendment exists to forbid, and would have done it invisibly.
 *   3. AMBIENT KINDS MUST DECLARE A SPAN, and their magnitude is integrated over
 *      it (`spanTicks / AMBIENT_CADENCE_TICKS`). An ambient entry with no span is
 *      REFUSED; a span too short to reach the floor is REFUSED as
 *      `sub_floor_pull`. A truly faint exposure honestly never marks — which is
 *      the amendment's own words — and it says so in a receipt instead of
 *      vanishing.
 *
 * The third guard is deliberately NOT limited to ambient kinds: every resolved
 * magnitude is checked. Guards 1 and 2 make a sub-floor pull unreachable under
 * today's DERIVED tuning, but the tuning is an owner row, and the day a signed
 * table lands is exactly the day a silent violation would otherwise ship.
 *
 * NO SUB-FLOOR ACCUMULATOR IS MINTED HERE. The amendment forbids it, and this
 * module holds no state at all, which is the strongest possible way to comply.
 *
 * ── RECEIPTS ONLY ON CROSSINGS, REVERSALS AND DISPLACEMENTS ─────────────────
 *
 * §800.4 (3), the wallpaper guard: with every axis able to drift, a feed that
 * reported raw movement would be wallpaper within one season. So three kinds mint
 * and nothing else:
 *
 *   BAND CROSSING — the banded position changed, through SP-5b's ONE grammar
 *                   (`bandCrossingReceipt`), which refuses any non-integer number
 *                   in any field. A float cannot reach prose through this funnel
 *                   because a float cannot enter the grammar.
 *   REVERSAL      — the crossing also crossed the MIDPOINT: the paradigm shift, a
 *                   virtue curdling into ITS OWN vice. Minted BESIDE its crossing,
 *                   the dispositionLedger convention, because "he grew colder" and
 *                   "his compassion has curdled" are different sentences.
 *   DISPLACEMENT  — a BACKGROUND axis entered the top 3 and passed a foreground
 *                   one (§5's own words). Visible personality changing COMPOSITION
 *                   is a first-class event; a shuffle inside an unchanged top 3 is
 *                   not, because the crossing that caused it already said so.
 *
 * A tick's receipts compare the chart at the tick's START to the chart at its END.
 * That is coalescing by construction: a crossing that decay opened and a lesson
 * closed in the same tick is not news, and cannot be narrated as if it were.
 *
 * ── EVIDENCE BINDING (the disposition-ledger way) ───────────────────────────
 *
 * Every receipt carries the SOURCE KINDS and SOURCE EVENT IDS that moved that axis
 * this tick, collected at the writer where they are known. `dispositionLedger`'s
 * transitions do exactly this, for exactly this reason: a later composer must
 * never have to GUESS which event caused a crossing, because a composer that
 * guesses is a composer that will eventually guess wrong in prose the user reads
 * as fact.
 *
 * ── ORDER ───────────────────────────────────────────────────────────────────
 *
 * DECAY FIRST, THEN LESSONS — the ledger's worked order (`appetiteAfterDecay`
 * before the outcome pass). A lesson must land on a soul that has already walked
 * its distance home, or the anti-ratchet brake is one tick late forever.
 *
 * READ-LAST / WRITE-NEXT is L2's, and it survives here untouched: offsets written
 * on this tick carry this tick's stamp and are invisible to `axisOffsetAt` until
 * the next one, so the fold's own order cannot leak into what any reader sees.
 * The fold reads RAW offsets (`axisOffsetOf`) for its own arithmetic and receipts,
 * which is that accessor's stated purpose — the accumulator that decides the next
 * write must see what is actually stored.
 *
 * ── DARK BY CONSTRUCTION ────────────────────────────────────────────────────
 *
 * ONE DOOR FOR THE WHOLE FAMILY. This module gates on L2's
 * `characterDriftActive` and mints NO second flag: a family with two switches has
 * a state where half of it is lit, and nobody ever tests that state. TE-VIRT-1
 * still owes the one flag its home.
 *
 * NO PRODUCTION CALLER. Nothing in src/ imports this module — proved by a walker,
 * not promised. The source adapters that will call it are car L4.
 *
 * PURE. No store, no clock, no PRNG, no React, no I/O, no mutation. Every fold is
 * codepoint-ordered, and every entry point returns the SAME worldState reference
 * when it changes nothing.
 *
 * @see docs/DESIGN_W_LIVES.md §3, §5, §12, §15 (F6, F9 as amended at §853)
 * @see docs/OWNER_DECISION_QUEUE.md §800, §800.4, §806, §853
 * @enforced-by tests/domain/npc/livedExperienceFunnel.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { bandCrossingReceipt, decayTowardNeutral, HALF_LIFE_BANDS } from '../worldPulse/bandedStock.js';
import { INTERVAL_WEEKS } from '../worldPulse/intervalWeeks.js';
import { durableIdForRoster } from '../worldPulse/npcLedger.js';
import {
  AXIS_LEVELS,
  MATERIALIZATION_EPSILON,
  applyAxisDrift,
  authoredCharacterOf,
  characterDriftActive,
  driftEntryOf,
  positionValue,
  valuePosition,
  writeAxisDrift,
} from './characterDrift.js';
import {
  LESSON_FAMILIES,
  PULL_BANDS,
  PULL_POLES,
  PARADIGM_AXIS_IDS,
  experienceKindOf,
  experienceRowOf,
  familyOfKind,
  planeOfKind,
  planeRank,
  pullsOfKind,
} from './livedExperienceCatalog.js';

/**
 * THE 7-RUNG NOMINAL LADDER (pack Register II), ASCENDING from the vice extreme to
 * the virtue extreme, DERIVED from L2's band words rather than transcribed. Every
 * rung is a lower-case token, which is what lets a character crossing ride SP-5b's
 * receipt grammar unchanged: `bandCrossingReceipt` validates tokens and integers
 * and refuses everything else.
 * @type {readonly string[]}
 */
export const SPECTRUM_BAND_LADDER = Object.freeze([
  ...[...AXIS_LEVELS].reverse().map((level) => `vice_${level}`),
  'neutral',
  ...AXIS_LEVELS.map((level) => `virtue_${level}`),
]);

/** The midpoint rung. Crossing IT is the paradigm shift, not merely a band change. */
export const NEUTRAL_BAND = 'neutral';

/** What the crossing receipt calls this stock. A token, never a sentence. */
export const CHARACTER_STOCK_KIND = 'character_axis';

/** The cause token a crossing carries when only the homeward walk moved it. */
export const HOMEWARD_DECAY_CAUSE = 'homeward_decay';

/** The F6 death receipt's type token. */
export const CHARACTER_LEGACY_KIND = 'character_legacy';

/**
 * How many positions the read model shows (§5). Three, and the number is named
 * once so the displacement rule and the legacy record cannot disagree about it.
 */
export const TOP_POSITIONS = 3;

/**
 * The cadence an ambient source emits on, DERIVED from the estate's one time truth
 * (`INTERVAL_WEEKS.one_season`) rather than authored. §853: ambient sources emit
 * at INTERVAL cadence with time-integrated magnitude. One season of dwelling
 * arrives as one `faint` quantum; two seasons arrive as one quantum twice as
 * heavy; a fortnight arrives as nothing and is TOLD so.
 *
 * ⚠ TICKS ARE READ AS WEEKS HERE, and that is LAW rather than convenience:
 * `worldPulse/worldState.js` states "the temporal constitution fixes tick = 1 week
 * and year = 52 weeks", and `espionageCareer.js` warns in as many words that no
 * `TICKS_PER_WEEK` constant exists anywhere in `src/domain` — a reader who invents
 * one divides by a constant that is not there. `dispositionLedger.appetiteAfterDecay`
 * is the worked precedent: it passes a tick difference straight into
 * `decayTowardNeutral`'s `ageWeeks`. Named out loud rather than silently relied on,
 * because a numeric field whose unit is undeclared acquires a different unit at
 * every consumer, and nothing ever reds.
 */
export const AMBIENT_CADENCE_TICKS = INTERVAL_WEEKS.one_season;

/**
 * THE TUNING — every number the funnel uses, in one place, DERIVED and UNSIGNED.
 *
 * Nothing here is authored taste. `faint` IS the materialization floor (guard 1
 * above); `firm` and `heavy` are its doublings, so `heavy` lands on exactly one
 * full band, which is the natural unit a paradigm chart is written in. The family
 * steps are a mechanical TERCILE over the pack's own heaviest-first ladder, not a
 * table of invented rates: the heaviest third of the ladder teaches at the kind's
 * stated word, the middle band one rung softer, the lightest two rungs softer
 * (4/3/3 over the ten families), and every step clamps at `faint`.
 *
 * The mechanical rule is pinned, so this draft cannot drift away from its own
 * stated derivation (car L1's J3 idiom). Real per-family rates are the owner's
 * row; when they land they must still satisfy the floor law, which the fold
 * checks at runtime rather than trusting.
 * @type {Readonly<{ status: string, signedBy: string|null, magnitudes: Readonly<Record<string, number>>,
 *   familyStep: Readonly<Record<string, number>>, decayBand: string, ownerRows: readonly string[] }>}
 */
export const FUNNEL_TUNING = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (every figure DERIVED from the floor or from the pack ladder)',
  signedBy: null,
  magnitudes: Object.freeze({
    faint: MATERIALIZATION_EPSILON,
    firm: 2 * MATERIALIZATION_EPSILON,
    heavy: 4 * MATERIALIZATION_EPSILON,
  }),
  familyStep: Object.freeze(Object.fromEntries(
    LESSON_FAMILIES.map((family, index) => [
      family,
      // TERCILE over the pack's heaviest-first order: 0, -1, -2.
      // `+ 0` normalizes -0 to 0, the same reason L2's `roundSymmetric` does it:
      // a negative zero serializes as `-0` and would put a phantom difference in
      // any byte comparison of a tuning table that is otherwise identical.
      -Math.floor((index * 3) / LESSON_FAMILIES.length) + 0,
    ]),
  )),
  // A mark on a soul is a standing, a bond, a grudge — the ladder rung SP-5b
  // already names for exactly those. CHOSEN from the shared ladder, never authored.
  decayBand: 'a_few_years',
  ownerRows: Object.freeze([
    'the three pull magnitudes (derived: faint = the floor, heavy = one full band)',
    'the per-family learn ladder: carried as a mechanical tercile over the pack order until real rates are signed',
    'the homeward decay half-life band (a_few_years, chosen from bandedStock\'s shared ladder)',
    'the ambient cadence (one season, derived from INTERVAL_WEEKS)',
  ]),
});

/**
 * THE CLOSED REFUSAL VOCABULARY. A refused write is a RECEIPTED refusal, never a
 * silent drop: "nothing happened" and "nothing COULD happen here" are different
 * facts, and an adapter author debugging a soul that never moves needs the second.
 * @type {readonly string[]}
 */
export const FUNNEL_REFUSALS = Object.freeze([
  'ambient_without_span',   // an ambient kind emitted with no dwell span (§853)
  'below_floor',            // L2: the pull did not carry the offset across the floor
  'dormant',                // L2: the drift door is shut
  'no_durable_identity',    // L2: the ledger is dark, so no id can exist
  'no_evidence',            // an entry with no event id — evidence binding refuses it
  'no_pull_vector',         // the kind's vector is the adapter's and the adapter sent none
  'plane_mismatch',         // the entry declared a plane the kind does not teach on
  'pulls_not_overridable',  // a supplied vector for a kind whose vector is the table's
  'silent_kind',            // outside the closed vocabulary, or the silent kind itself
  'source_unverified',      // no receipt for this kind exists in the tree yet
  'sub_floor_pull',         // §853: no source may emit a pull that cannot cross the floor
  'unknown_axis',           // a pull naming an axis the catalog does not carry
]);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {number} a non-negative integer tick */
function tickOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/** @param {unknown} v @returns {string} */
function str(v) {
  return v == null ? '' : String(v);
}

const AXIS_ID_SET = new Set(PARADIGM_AXIS_IDS);

/**
 * A signed band position as its rung WORD. Total: anything unreadable bands at the
 * midpoint, because a chart that cannot be understood makes no claim.
 * @param {number} value @returns {string} a SPECTRUM_BAND_LADDER member
 */
export function bandWordOf(value) {
  const position = valuePosition(value);
  return position.pole ? `${position.pole}_${position.level}` : NEUTRAL_BAND;
}

/**
 * The EFFECTIVE chart as continuous signed values per axis: authored core plus
 * stored offset, over the union of the axes either half speaks. Codepoint-ordered.
 *
 * Continuous, not banded, deliberately: the top-3 order reads |effective position|
 * BEFORE banding (§5's pinned total order), so two axes in the same band still
 * have an order, and it is the true one.
 *
 * @param {{ character?: unknown } | null | undefined} npc
 * @param {Record<string, {offset:number, updatedTick:number}> | null | undefined} drift
 * @returns {Record<string, number>}
 */
export function effectiveChartOf(npc, drift) {
  const authored = asObject(asObject(authoredCharacterOf(npc)).axes);
  const entry = asObject(drift);
  /** @type {Record<string, number>} */
  const chart = {};
  for (const axisId of [...new Set([...Object.keys(authored), ...Object.keys(entry)])].sort(compareCodepoint)) {
    const cell = /** @type {{offset?: unknown}} */ (asObject(entry[axisId]));
    const offset = Number.isFinite(Number(cell.offset)) ? Number(cell.offset) : 0;
    chart[axisId] = positionValue(/** @type {{pole?: 'virtue'|'vice', level?: string}} */ (authored[axisId])) + offset;
  }
  return chart;
}

/**
 * §5's PINNED TOTAL ORDER over a chart: |effective position| descending, then band
 * rank descending, then codepoint axis id ascending. Neutral axes are excluded —
 * "the top 3 strongest positions" cannot include a position nobody holds, and an
 * all-neutral soul honestly has an empty read model.
 *
 * The second key is not decoration even though band rank derives from the first:
 * it is the order the SPEC pins, and pinning it here means a later change to
 * banding cannot silently re-order the read model.
 *
 * @param {Record<string, number>} chart @returns {readonly string[]} axis ids, strongest first
 */
export function chartOrderOf(chart) {
  return Object.freeze(Object.keys(asObject(chart))
    .filter((axisId) => bandWordOf(chart[axisId]) !== NEUTRAL_BAND)
    .sort((a, b) => {
      const byMagnitude = Math.abs(chart[b]) - Math.abs(chart[a]);
      if (byMagnitude !== 0) return byMagnitude;
      const byBand = bandRankOf(chart[b]) - bandRankOf(chart[a]);
      if (byBand !== 0) return byBand;
      return compareCodepoint(a, b);
    }));
}

/**
 * How many rungs from neutral a value bands to (0..SPECTRUM_HALF_SPAN).
 * @param {number} value @returns {number}
 */
function bandRankOf(value) {
  const level = valuePosition(value).level;
  return level ? AXIS_LEVELS.indexOf(level) + 1 : 0;
}

/**
 * The read model's window: the strongest TOP_POSITIONS axes, in the pinned order.
 * @param {Record<string, number>} chart @returns {readonly string[]}
 */
export function topPositionsOf(chart) {
  return Object.freeze(chartOrderOf(chart).slice(0, TOP_POSITIONS));
}

/**
 * THE DISPLACEMENT RULE (§5): "bitterness has overtaken his patience". A receipt is
 * minted when a visible axis genuinely PASSED another visible one — A was strictly
 * weaker than B before and is strictly stronger than B after. One receipt per
 * passer, naming the strongest thing it passed, and both ends must be in the read
 * model, because overtaking somebody nobody could see is not news.
 *
 * ⚠ THE COMPARISON IS MAGNITUDES, NOT RANKS, AND THAT IS THE WHOLE DESIGN. Two
 * rank-based rules were written before this one and both were WRONG, each caught by
 * a pin rather than by reading:
 *
 *   RANK-WISE ("who sits at rank 1 now versus before") mints a receipt for every
 *   axis that shifted up when a neighbour COLLAPSED — including the false claim
 *   that an untouched CHEER had "overtaken" a TRUST it was still a full band
 *   behind. A receipt that is false is worse than wallpaper: wallpaper does not lie.
 *
 *   ENTRANTS-ONLY (mint only when a background axis enters the top 3) is never
 *   false, but it silently loses the most newsworthy displacement there is — the
 *   LEAD changing hands between two axes that were both already visible, which is
 *   §5's own example sentence.
 *
 * Magnitudes fix both at once, and they also make TIES silent, which is right: you
 * have not overtaken somebody you are level with. So an axis that merely appears
 * alongside the field mints nothing here — its crossing out of `neutral` is the
 * event, and it is already receipted.
 *
 * @param {Record<string, number>} before @param {Record<string, number>} after
 * @returns {ReadonlyArray<{axisId: string, overtook: string, rank: number}>}
 */
export function displacementsBetween(before, after) {
  const beforeTop = chartOrderOf(before).slice(0, TOP_POSITIONS);
  const afterTop = chartOrderOf(after).slice(0, TOP_POSITIONS);
  /** @param {Record<string, number>} chart @param {string} axisId @returns {number} */
  const strength = (chart, axisId) => Math.abs(Number(asObject(chart)[axisId]) || 0);
  /** @type {Array<{axisId: string, overtook: string, rank: number}>} */
  const out = [];
  for (let rank = 0; rank < afterTop.length; rank += 1) {
    const axisId = afterTop[rank];
    // `beforeTop` is in before-order, so the FIRST match is the strongest thing
    // this axis passed — the one the sentence is about.
    const passed = beforeTop.find((other) => other !== axisId
      && strength(before, other) > strength(before, axisId)
      && strength(after, axisId) > strength(after, other));
    if (!passed) continue;
    out.push(Object.freeze({ axisId, overtook: passed, rank }));
  }
  return Object.freeze(out);
}

/**
 * @typedef {Object} LessonEntry
 * @property {string} kind             a LIVED_EXPERIENCE_KINDS member
 * @property {string} [plane]          optional cross-check; must equal the kind's plane
 * @property {string} settlementId
 * @property {string} settlementSeed
 * @property {{id?: unknown, name?: unknown, role?: unknown, character?: unknown}} npc
 * @property {string} eventId          the evidence this lesson binds to
 * @property {number} [spanTicks]      required for ambient kinds (§853)
 * @property {ReadonlyArray<{axisId: string, pole: string, band: string}>} [pulls]
 *   ONLY for an ambient kind whose table vector is empty (dwell_milieu, whose
 *   vector is a read of the host settlement). Supplied anywhere else is REFUSED.
 */

/**
 * @typedef {Object} LessonCandidate  one surviving entry, normalized
 * @property {LessonEntry} row
 * @property {string} kind
 * @property {string} plane
 * @property {string} subject
 * @property {string} eventId
 * @property {string} family
 * @property {ReadonlyArray<{axisId: string, pole: string, band: string}>} pulls
 * @property {number} span
 */

/**
 * @typedef {Object} AxisEvidence  what moved one axis of one soul this tick
 * @property {Set<string>} kinds
 * @property {Set<string>} events
 * @property {string} family  the HEAVIEST family that touched it
 */

/**
 * @typedef {Object} BoundEvidence  the same, frozen, as a receipt carries it
 * @property {string} cause
 * @property {readonly string[]} kinds
 * @property {readonly string[]} events
 */

/**
 * @typedef {Object} FoldSubject
 * @property {string} key
 * @property {string} settlementId
 * @property {object} npc
 */

/**
 * @typedef {Object} FunnelRefusal
 * @property {string} reason   a FUNNEL_REFUSALS member
 * @property {string} kind
 * @property {string} eventId
 * @property {string} subject  settlementId + NUL + rosterId — WITHIN-TICK ONLY
 * @property {string} [axisId]
 */

/**
 * @typedef {Object} DriftReceipt
 * @property {'band_crossing'|'reversal'|'displacement'} kind
 * @property {string} wnpcId
 * @property {string} axisId
 * @property {Readonly<{stockKind:string, from:string, to:string, direction:string, cause:string, tick:number}>} [crossing]
 * @property {string} [overtook]
 * @property {number} [rank]
 * @property {readonly string[]} sourceKinds
 * @property {readonly string[]} sourceEventIds
 * @property {number} tick
 */

/**
 * THE HOMEWARD WALK. Every stored offset relaxes toward ZERO — the authored core —
 * on the shared half-life ladder, through SP-5b's ONE decay shape, which carries
 * the ANTI-RATCHET guarantee as a property of the arithmetic: a decayed offset is
 * never further from the core than it was and never on the far side of it.
 *
 * DECAY NEVER GRADUATES ANYBODY. The durable id is resolved by a PURE read; a soul
 * with no ledger identity has no drift to decay, so there is nothing to mint an
 * identity for. Minting one here would graduate the entire roster on the first
 * tick, through a one-way door, for nothing.
 *
 * Writes go through L2's `applyAxisDrift`, so the floor governs decay exactly as
 * it governs a lesson: an offset that decays back under the epsilon DELETES its
 * cell, and a soul that has walked all the way home serializes as one that never
 * left.
 *
 * ⚠ SCOPE, STATED SO NOBODY LOOKS FOR MORE: this walks the SUBJECTS IT IS GIVEN,
 * never the whole map. `foldLivedExperience` therefore decays only the souls this
 * tick has a lesson for — the ones whose arithmetic actually needs it. Decaying a
 * soul the caller cannot describe would mint offset changes with no chart to read
 * them against and no receipt anybody could compose. A pulse-wide homeward pass is
 * this function called with the whole roster, and that call site is car L4's.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {ReadonlyArray<{settlementId: string, npc: object}>} args.subjects
 * @param {number} args.tick
 * @returns {{worldState: Record<string, unknown>, moved: number}}
 */
export function decayCharacterDrift({ worldState, subjects, tick }) {
  if (!characterDriftActive(worldState)) return { worldState, moved: 0 };
  const now = tickOf(tick);
  let host = worldState;
  let moved = 0;
  for (const subject of orderedSubjects(subjects)) {
    const wnpcId = durableIdForRoster(host, subject.settlementId, rosterIdentityOf(subject.npc));
    if (!wnpcId) continue;
    const entry = driftEntryOf(host, wnpcId);
    for (const axisId of Object.keys(entry).sort(compareCodepoint)) {
      const prior = entry[axisId].offset;
      // Age in TICKS, read as weeks — dispositionLedger's own conversion, named at
      // AMBIENT_CADENCE_TICKS above rather than left as an assumption.
      const age = Math.max(0, now - entry[axisId].updatedTick);
      const decayed = decayTowardNeutral(prior, 0, age, FUNNEL_TUNING.decayBand);
      if (decayed === prior) continue;
      const out = applyAxisDrift({ worldState: host, wnpcId, axisId, delta: decayed - prior, tick: now });
      if (out.worldState !== host) moved += 1;
      host = out.worldState;
    }
  }
  return { worldState: host, moved };
}

/**
 * THE FUNNEL. One tick's lesson entries in; a moved world, its receipts and its
 * refusals out.
 *
 * DORMANT ⇒ the SAME worldState reference, no receipts, and one `dormant` refusal
 * per entry so a caller can tell "the door is shut" from "nothing was taught".
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {ReadonlyArray<LessonEntry>} args.entries
 * @param {number} args.tick
 * @returns {{worldState: Record<string, unknown>, receipts: readonly DriftReceipt[],
 *   refusals: readonly FunnelRefusal[], applied: number, decayed: number}}
 */
export function foldLivedExperience({ worldState, entries, tick }) {
  const rows = Array.isArray(entries) ? entries : [];
  const now = tickOf(tick);
  /** @type {FunnelRefusal[]} */
  const refusals = [];
  if (!characterDriftActive(worldState)) {
    for (const row of rows) refusals.push(refusal('dormant', row));
    return frozenResult(worldState, [], refusals, 0, 0);
  }

  // 1. NORMALIZE AND REFUSE. Everything that cannot teach is turned away HERE,
  //    with a reason, before any precedence contest — so a refused entry can
  //    never win a plane contest against an entry that would have taught.
  /** @type {LessonCandidate[]} */
  const candidates = [];
  for (const row of rows) {
    const raw = asObject(row);
    const declared = str(raw.kind);
    const kind = experienceKindOf(declared);
    const eventId = str(raw.eventId);
    // The silent kind teaches nothing — and an unrecognised token becomes it, so
    // this one branch closes the open-schema leak the vocabulary exists to close.
    if (kind !== declared || familyOfKind(kind) === null) { refusals.push(refusal('silent_kind', raw)); continue; }
    const spec = experienceRowOf(kind);
    if (spec.sourceUnverified) { refusals.push(refusal('source_unverified', raw)); continue; }
    if (!eventId) { refusals.push(refusal('no_evidence', raw)); continue; }
    if (raw.plane != null && str(raw.plane) !== planeOfKind(kind)) {
      refusals.push(refusal('plane_mismatch', raw)); continue;
    }
    const supplied = Array.isArray(raw.pulls) ? raw.pulls : null;
    const tabled = pullsOfKind(kind);
    // A vector may be SUPPLIED only where the table honestly holds none and the
    // kind is ambient — dwell_milieu, whose poles are the host settlement's, not
    // a constant. Anywhere else the table is the authority.
    // ⛔ ENC-2 (§12 row 10) THE THIRD ADMISSION ARM. A `vectorSupplied` row is the second
    // honest case: the table holds no vector because there is no constant one to hold —
    // what a chance meeting teaches depends on WHO was met, and only the adapter knows
    // that. The AMBIENT road cannot carry it: an ambient kind must declare a `spanTicks`
    // and divides its quantum by a season (below), and a one-week meeting can never cross
    // that floor, so routing it there would build a lesson that is arithmetically
    // incapable of teaching anything. A `vectorSupplied` row is non-ambient and span 1.
    // Behaviour-neutral at this commit: NO row in EXPERIENCE_TABLE carries the field, so
    // every existing kind still refuses `pulls_not_overridable` exactly as before.
    if (supplied && !(spec.ambient && tabled.length === 0) && spec.vectorSupplied !== true) {
      refusals.push(refusal('pulls_not_overridable', raw)); continue;
    }
    let span = 1;
    if (spec.ambient) {
      const declaredSpan = Number(raw.spanTicks);
      if (!Number.isFinite(declaredSpan) || declaredSpan <= 0) {
        refusals.push(refusal('ambient_without_span', raw)); continue;
      }
      span = Math.floor(declaredSpan) / AMBIENT_CADENCE_TICKS;
    }
    const pulls = supplied || tabled;
    // A kind that resolves to no vector teaches nothing, and doing that SILENTLY is
    // how an adapter ships broken: dwell_milieu's vector is the adapter's to compute
    // (§800.4 makes it a read of the host), so an adapter that forgets it must hear
    // about it rather than watch nobody drift.
    if (pulls.length === 0) { refusals.push(refusal('no_pull_vector', raw)); continue; }
    candidates.push({
      row: /** @type {LessonEntry} */ (raw),
      kind,
      plane: planeOfKind(kind),
      subject: subjectKeyOf(raw),
      eventId,
      family: /** @type {string} */ (familyOfKind(kind)),
      pulls,
      span,
    });
  }

  // 2. CLOSEST-PLANE-WINS, over (SUBJECT, EVENT). One person learns one event once,
  //    at the closest distance it reached them. Two people learning the same event
  //    at two distances is not double-counting — it is the design.
  /** @type {Map<string, LessonCandidate>} */
  const closest = new Map();
  for (const candidate of candidates) {
    const key = `${candidate.subject}\u0000${candidate.eventId}`;
    const held = closest.get(key);
    if (!held) { closest.set(key, candidate); continue; }
    const rank = planeRank(candidate.plane) - planeRank(held.plane);
    // A same-plane tie breaks on the kind's codepoint, so the survivor is a
    // property of the input SET and not of its arrival order.
    if (rank < 0 || (rank === 0 && compareCodepoint(candidate.kind, held.kind) < 0)) {
      closest.set(key, candidate);
    }
  }
  const surviving = [...closest.values()].sort((a, b) =>
    compareCodepoint(a.subject, b.subject)
    || compareCodepoint(a.eventId, b.eventId)
    || compareCodepoint(a.kind, b.kind));

  // 3. THE SUBJECTS, and their charts BEFORE anything moves. The before-chart is
  //    taken pre-DECAY on purpose: a soul that walks home across a band this tick
  //    has genuinely changed, and that crossing is news.
  const subjects = uniqueSubjects(surviving);
  const before = new Map(subjects.map((subject) =>
    [subject.key, effectiveChartOf(subject.npc, driftFor(worldState, subject))]));

  // 4. DECAY FIRST — the ledger's worked order.
  const walked = decayCharacterDrift({ worldState, subjects, tick: now });
  let host = walked.worldState;

  // 5. THEN THE LESSONS, through L2's writer and no other path.
  /** @type {Map<string, AxisEvidence>} */
  const evidence = new Map();
  let applied = 0;
  for (const candidate of surviving) {
    const step = FUNNEL_TUNING.familyStep[candidate.family] || 0;
    for (const raw of candidate.pulls) {
      const pull = asObject(raw);
      const axisId = str(pull.axisId);
      if (!AXIS_ID_SET.has(axisId)) { refusals.push(refusal('unknown_axis', candidate.row, axisId)); continue; }
      if (!PULL_POLES.includes(str(pull.pole)) || !PULL_BANDS.includes(str(pull.band))) {
        refusals.push(refusal('unknown_axis', candidate.row, axisId)); continue;
      }
      const magnitude = steppedMagnitude(str(pull.band), step) * candidate.span;
      // §853's LAW, CHECKED RATHER THAN TRUSTED: a source may not emit a pull
      // that cannot cross the floor, because nothing sub-floor accumulates and
      // such a pull would mark nobody, forever, in silence.
      if (magnitude < MATERIALIZATION_EPSILON) {
        refusals.push(refusal('sub_floor_pull', candidate.row, axisId)); continue;
      }
      const delta = str(pull.pole) === 'vice' ? -magnitude : magnitude;
      const out = writeAxisDrift({
        worldState: host,
        settlementSeed: str(candidate.row.settlementSeed),
        settlementId: str(candidate.row.settlementId),
        rosterIdentity: rosterIdentityOf(candidate.row.npc),
        axisId,
        delta,
        tick: now,
      });
      host = out.worldState;
      if (out.refusal) refusals.push(refusal(out.refusal, candidate.row, axisId));
      if (!out.wnpcId) continue;
      if (out.materialized) applied += 1;
      noteEvidence(evidence, out.wnpcId, axisId, candidate);
    }
  }

  // 6. RECEIPTS: the tick's START chart against its END chart. Coalesced by
  //    construction — a crossing opened by decay and closed by a lesson in the
  //    same tick never existed as far as any reader is concerned.
  /** @type {DriftReceipt[]} */
  const receipts = [];
  for (const subject of subjects) {
    const wnpcId = durableIdForRoster(host, subject.settlementId, rosterIdentityOf(subject.npc));
    if (!wnpcId) continue;
    const after = effectiveChartOf(subject.npc, driftEntryOf(host, wnpcId));
    const start = before.get(subject.key) || {};
    for (const axisId of [...new Set([...Object.keys(start), ...Object.keys(after)])].sort(compareCodepoint)) {
      const from = bandWordOf(start[axisId] || 0);
      const to = bandWordOf(after[axisId] || 0);
      if (from === to) continue;
      const bound = evidenceRow(evidence, wnpcId, axisId);
      const crossing = bandCrossingReceipt({
        stockKind: CHARACTER_STOCK_KIND,
        ladder: SPECTRUM_BAND_LADDER,
        from,
        to,
        cause: bound.cause,
        tick: now,
      });
      receipts.push(receipt('band_crossing', { wnpcId, axisId, crossing, bound, tick: now }));
      // THE PARADIGM SHIFT: the move also crossed the midpoint. Minted BESIDE the
      // crossing, never instead of it — a virtue curdling into its own vice is a
      // different sentence from a virtue merely deepening.
      if ((start[axisId] || 0) * (after[axisId] || 0) < 0) {
        receipts.push(receipt('reversal', { wnpcId, axisId, crossing, bound, tick: now }));
      }
    }
    for (const moved of displacementsBetween(start, after)) {
      const bound = evidenceRow(evidence, wnpcId, moved.axisId);
      receipts.push(Object.freeze({
        kind: 'displacement',
        wnpcId,
        axisId: moved.axisId,
        overtook: moved.overtook,
        rank: moved.rank,
        sourceKinds: bound.kinds,
        sourceEventIds: bound.events,
        tick: now,
      }));
    }
  }

  return frozenResult(host, receipts, refusals, applied, walked.moved);
}

/**
 * F6 — THE DEATH RECEIPT. ONE typed chronicle record, minted when a soul dies, so
 * the derived known-character read (§12 R2) has a TERMINAL value to resolve to
 * instead of a live chart that will never move again.
 *
 * THE SHAPE ONLY. The caller that mints it at a death is the verb car's — this
 * file must not grow a death path, because the KILL verb already owns one and a
 * second would be the fork the single-writer discipline exists to prevent.
 *
 * ⚠ IT MINTS NO STORE. GAP D forbids a per-NPC memory: this is an EVENT, a record
 * that goes to the chronicle and is done. It does NOT close, prune, or otherwise
 * touch the drift map — whether a dead soul's chart closes or ghosts is an open
 * owner row (carried in L2's DRIFT_PROVENANCE), and answering it here would answer
 * it in code.
 *
 * FAIL-CLOSED, the `bandCrossingReceipt` discipline: a non-token cause or a
 * non-integer tick THROWS rather than producing a record a composer would trust.
 *
 * @param {Object} args
 * @param {string} args.wnpcId
 * @param {{character?: unknown}} args.npc            the roster record, for its authored core
 * @param {Record<string, {offset:number, updatedTick:number}>} [args.drift]  the soul's entry
 * @param {string} args.cause                          a lower-case token
 * @param {number} args.tick
 * @returns {Readonly<{kind: string, wnpcId: string, cause: string, tick: number,
 *   lived: boolean, remembered: ReadonlyArray<Readonly<{axisId: string, band: string}>>}>}
 */
export function characterLegacyRecord({ wnpcId, npc, drift, cause, tick }) {
  const id = str(wnpcId);
  if (!id) throw new Error('livedExperienceFunnel.characterLegacyRecord: a legacy record needs a durable identity');
  if (typeof cause !== 'string' || !/^[a-z][a-z_]*$/.test(cause)) {
    throw new Error(`livedExperienceFunnel.characterLegacyRecord: cause must be a lower-case word token (got ${JSON.stringify(cause)})`);
  }
  if (typeof tick !== 'number' || !Number.isInteger(tick) || tick < 0) {
    throw new Error('livedExperienceFunnel.characterLegacyRecord: tick must be a non-negative integer');
  }
  const entry = asObject(drift);
  const chart = effectiveChartOf(npc, /** @type {Record<string, {offset:number, updatedTick:number}>} */ (entry));
  return Object.freeze({
    kind: CHARACTER_LEGACY_KIND,
    wnpcId: id,
    cause,
    tick,
    // Whether the world marked this person at all — the difference between "he
    // died as he was born" and "the war had made him someone else".
    lived: Object.keys(entry).length > 0,
    remembered: Object.freeze(topPositionsOf(chart).map((axisId) =>
      Object.freeze({ axisId, band: bandWordOf(chart[axisId]) }))),
  });
}

// ── internals ────────────────────────────────────────────────────────────────

/**
 * A band word stepped DOWN the ladder, clamped at `faint`. The clamp is the whole
 * point: it is what makes a lighter family unable to emit a sub-floor pull.
 * @param {string} band @param {number} step @returns {number}
 */
function steppedMagnitude(band, step) {
  const index = Math.max(0, PULL_BANDS.indexOf(band) + step);
  return FUNNEL_TUNING.magnitudes[PULL_BANDS[Math.min(PULL_BANDS.length - 1, index)]];
}

/** @param {unknown} npc @returns {{rosterId: string, name: string, role: string}} */
function rosterIdentityOf(npc) {
  const record = asObject(npc);
  return { rosterId: str(record.id), name: str(record.name), role: str(record.role) };
}

/**
 * The WITHIN-TICK subject key. Positional, and that is safe ONLY because it never
 * leaves this fold: the persisted key is the durable `wnpc_` identity, exactly as
 * car L2 ruled. Said out loud because a positional key that escapes into storage is
 * the rebind class the whole L2 recon was about.
 *
 * The separator is NUL, `dispositionLedger`'s own choice for the same job: it is
 * the one character an id cannot contain, so `("a", "b:c")` and `("a:b", "c")`
 * cannot collide into one key and silently merge two people.
 * @param {Record<string, unknown>} row @returns {string}
 */
function subjectKeyOf(row) {
  return `${str(row.settlementId)}\u0000${str(asObject(row.npc).id)}`;
}

/** @param {ReadonlyArray<{settlementId: string, npc: object}>} subjects */
function orderedSubjects(subjects) {
  return (Array.isArray(subjects) ? subjects : [])
    .map((subject) => ({ settlementId: str(asObject(subject).settlementId), npc: asObject(subject).npc }))
    .sort((a, b) => compareCodepoint(
      `${a.settlementId}\u0000${str(asObject(a.npc).id)}`,
      `${b.settlementId}\u0000${str(asObject(b.npc).id)}`,
    ));
}

/**
 * The distinct subjects of a candidate set, codepoint-ordered.
 * @param {ReadonlyArray<LessonCandidate>} candidates @returns {FoldSubject[]}
 */
function uniqueSubjects(candidates) {
  /** @type {Map<string, {key: string, settlementId: string, npc: object}>} */
  const seen = new Map();
  for (const candidate of candidates) {
    if (seen.has(candidate.subject)) continue;
    seen.set(candidate.subject, {
      key: candidate.subject,
      settlementId: str(candidate.row.settlementId),
      npc: asObject(candidate.row.npc),
    });
  }
  return [...seen.values()].sort((a, b) => compareCodepoint(a.key, b.key));
}

/**
 * The drift entry a subject holds today, or an empty one when they have no identity.
 * @param {Record<string, unknown>} worldState
 * @param {{settlementId: string, npc: object}} subject
 * @returns {Record<string, {offset: number, updatedTick: number}>}
 */
function driftFor(worldState, subject) {
  const wnpcId = durableIdForRoster(worldState, subject.settlementId, rosterIdentityOf(subject.npc));
  return wnpcId ? driftEntryOf(worldState, wnpcId) : {};
}

/**
 * Record which kinds and which events moved one axis of one soul.
 * @param {Map<string, AxisEvidence>} evidence
 * @param {string} wnpcId @param {string} axisId @param {LessonCandidate} candidate
 * @returns {void}
 */
function noteEvidence(evidence, wnpcId, axisId, candidate) {
  const key = `${wnpcId}\u0000${axisId}`;
  const held = evidence.get(key) || { kinds: new Set(), events: new Set(), family: candidate.family };
  held.kinds.add(candidate.kind);
  held.events.add(candidate.eventId);
  // THE HEAVIEST TEACHER GETS THE CREDIT: the cause of a crossing is the strongest
  // family that touched the axis, which is deterministic and is also the honest
  // answer when a war and a rumour move the same axis on the same tick.
  if (LESSON_FAMILIES.indexOf(candidate.family) < LESSON_FAMILIES.indexOf(held.family)) {
    held.family = candidate.family;
  }
  evidence.set(key, held);
}

/**
 * The evidence bound to one axis of one soul, as frozen sorted tokens plus the
 * cause the crossing receipt carries. An axis no lesson touched was moved by the
 * homeward walk, and says so rather than carrying an empty cause.
 * @param {Map<string, AxisEvidence>} evidence
 * @param {string} wnpcId @param {string} axisId
 * @returns {BoundEvidence}
 */
function evidenceRow(evidence, wnpcId, axisId) {
  const held = evidence.get(`${wnpcId}\u0000${axisId}`);
  if (!held) {
    return {
      cause: HOMEWARD_DECAY_CAUSE,
      kinds: Object.freeze([HOMEWARD_DECAY_CAUSE]),
      events: Object.freeze([]),
    };
  }
  return {
    cause: held.family,
    kinds: Object.freeze([...held.kinds].sort(compareCodepoint)),
    events: Object.freeze([...held.events].sort(compareCodepoint)),
  };
}

/**
 * @param {'band_crossing'|'reversal'} kind
 * @param {{wnpcId: string, axisId: string, bound: BoundEvidence, tick: number,
 *   crossing: Readonly<{stockKind: string, from: string, to: string,
 *     direction: string, cause: string, tick: number}>}} args
 * @returns {DriftReceipt}
 */
function receipt(kind, { wnpcId, axisId, crossing, bound, tick }) {
  return Object.freeze({
    kind,
    wnpcId,
    axisId,
    crossing,
    sourceKinds: bound.kinds,
    sourceEventIds: bound.events,
    tick,
  });
}

/**
 * @param {string} reason a FUNNEL_REFUSALS member
 * @param {unknown} row @param {string} [axisId]
 * @returns {FunnelRefusal}
 */
function refusal(reason, row, axisId) {
  const raw = asObject(row);
  const out = {
    reason,
    kind: str(raw.kind),
    eventId: str(raw.eventId),
    subject: subjectKeyOf(raw),
  };
  return Object.freeze(axisId ? { ...out, axisId } : out);
}

/**
 * @param {Record<string, unknown>} worldState
 * @param {DriftReceipt[]} receipts @param {FunnelRefusal[]} refusals
 * @param {number} applied @param {number} decayed
 */
function frozenResult(worldState, receipts, refusals, applied, decayed) {
  return Object.freeze({
    worldState,
    receipts: Object.freeze(receipts),
    refusals: Object.freeze(refusals),
    applied,
    decayed,
  });
}

// Referenced so the shared ladder this module CHOOSES from cannot be renamed out
// from under `FUNNEL_TUNING.decayBand` without a red here. `halfLifeWeeksOf` would
// throw at runtime; a soul quietly forgetting at the wrong rate is worse than that.
if (!HALF_LIFE_BANDS.includes(FUNNEL_TUNING.decayBand)) {
  throw new Error(`livedExperienceFunnel: decayBand "${FUNNEL_TUNING.decayBand}" is not a bandedStock half-life band`);
}
