/**
 * domain/display/stateProse/warFaithStateProse.js — THE WAR & FAITH DESK (desk car DESK-4).
 *
 * The last corpus leaf to get a desk, and the first one whose blocks live on TWO host tabs.
 * Six of its nine blocks route here; three are declared dark with the measurement that
 * darkens them, at the bottom of this docblock.
 *
 *   DS-WAR-1  war › the standing — status, the war scar, the ramp, the occupation
 *   DS-WAR-2  war › the treaties — one term's family × compliance, plus the document read
 *   DS-WAR-3  war › the whole-page-set dormant note (no war beat, no treaty, no named faith)
 *   DS-FTH-1  faith › the live faith panel — rank, cults, devotion, the arc, standings, mandate
 *   DS-FTH-2  faith › the teaser a settlement with NO PATRON renders
 *   DS-FTH-3  faith › creed standing — standing, legitimacy, the niche contest, the patron fall
 *
 * ── WHY THIS DESK IS ONE MODULE AND NOT TWO ──────────────────────────────────────────
 * `warFaith` is ONE corpus leaf, so it is one `desk` value in every mount row, and the
 * mount walker's ARM 2 admits exactly one component file that calls `<desk>StateProse(`.
 * A war desk and a faith desk would be two modules over one leaf and two gates to forget;
 * this is one module, called once, behind one public-dossier gate (WarFaithDesk.jsx).
 *
 * ── THE PAGE-SET BOUNDARY, WHICH IS THIS CAR'S NEW GROUND ────────────────────────────
 * C3 says a block's SENTENCE rung renders at exactly ONE position per settlement PAGE-SET,
 * and until now every desk lived on one tab, so the law cost nothing. Here the leaf spans
 * the war tab and the faith tab, which are two tabs of one page-set. Every block below
 * still speaks exactly once, and the split is recorded per block in dossierMounts.js.
 *
 * THE ONE GLANCE ROW, and why it is the only honest one. `faith.nicheRow` glances over
 * DS-FTH-3 because `NicheOccupancyBlock` ALREADY PRINTS the standing word that block's
 * STANDING pools are keyed on — one row per creed, `{standingWord}` in the reader's own
 * language. That is what a glance position IS: the page already shows the band, so the
 * record appears here and must not speak here. No CROSS-TAB glance is honest on this leaf:
 * a glance draws a band word the surface already carries, and neither tab carries the
 * other's band. Silence on the second tab is R-DST-K, and it is the true answer.
 *
 * ── WHAT THIS DESK NEVER DERIVES ─────────────────────────────────────────────────────
 * Every reading arrives as an argument, exactly as the economy desk's food balance does:
 * `settlementWarStatus`, `settlementWarExhaustion` + `warExhaustionBand`,
 * `settlementMobilization`, `settlementOccupation`, `occupierHoldings`,
 * `renderTreatiesForSettlement`, `faithPanelModel` and `legitimacyBand` all keep their
 * owners. A second derivation of a shipped band ladder is the fork that drifts, and this
 * file would be where it started.
 *
 * ⚠ TWO READINGS ARE RAW LEDGER TOKENS ON PURPOSE, and that is the label-trap rule rather
 * than an exception to it. `warPosture[id].state` and `occupations[id].state` are the
 * PRODUCER'S OWN TOKENS; the canonical display readers convert both to PHRASES
 * (`posturePhrase`, `occupationStatePhrase`) and a phrase cannot be keyed on without
 * reading the corpus's word for the producer's datum. The desk takes the token.
 *
 * ⛔ AND ONE OF THEM IS LOAD-BEARING. `ticksToDeploy` returns 0 for BOTH ends of the ramp:
 * for `mobilized` (nothing left to climb) and for `deployed` / `war_exhaustion` /
 * `demobilizing` (not on the ramp at all — `RAMP_ORDER.indexOf(state) < 0`). Keying
 * "fully ready" on `ticksToDeploy === 0` would print *the muster is complete* over a town
 * that is STANDING DOWN. That is a fail-soft default wearing a reading's clothes, and it
 * is why the ramp is keyed on the state token and the tick estimate only splits the middle.
 *
 * ── THE DEITY DOCTRINE, HELD (owner, constitutional) ─────────────────────────────────
 * Faith here is CULTURE — standing, institutions, observance, legitimacy. No pool key this
 * file produces reads a deity AXIS as a theological claim; `rankAxis` is the pantheon's own
 * seat-size token and `standing` / `legitimacy` are the religion state's political ones.
 * The desk writes NO prose: every sentence is the corpus's, and a state with no pool
 * renders nothing rather than a sentence assembled here.
 *
 * ⭐ A SETTLEMENT WITH NO PATRON IS THE COMMON CASE, NOT THE EDGE. `faithPanelModel`
 * answers `{ hasEmbed: false }` and DS-FTH-2's PRIVATE DOSSIER pool is what speaks: four
 * variants that name no creed and no god, because the block was authored for exactly this
 * town. It is honest and it is NOT empty, which is the whole reason the block exists.
 *
 * ── DECLARED DARK, WITH THE MEASUREMENT (findings, not omissions) ─────────────────────
 * A mounted-but-unreachable POOL is a finding to declare; a BLOCK with no reachable pool
 * cannot be mounted at all, because the position would be a citation that cites nothing.
 *
 *   DS-WAR-4 (5 pools) — its keys are `Belligerent / Assertive / Even-handed / Cautious /
 *     Pacific`, which is the vocabulary of `aggressionPosture` in src/pdf/lib/liveWorld.js —
 *     a module-PRIVATE function (no `export`). The one EXPORTED band reader,
 *     `aggressionChip` in src/components/settlements/livingWorldSignals.js, spells two of
 *     the five differently (`Aggressive`, `Pacifist`) and returns `null` for the third
 *     (`Even-handed` is its dead-band). So the block's keys have NO exported canonical
 *     producer, and re-deriving the ladder here would be a third spelling of it.
 *     THE ONE ACT THAT LIGHTS IT: hoist ONE posture ladder (the `warExhaustionBand` shape —
 *     a key function beside a word function) and have the PDF and the chip both read it.
 *     That is a producer change and a shipped-label change, not a desk's.
 *
 *   DS-WAR-5 (31 pools) — three independent blocks:
 *     • its 5 occupation-state pools restate DS-WAR-1's occupation lens from the same
 *       `occupations[id].state` datum (`pays` is DERIVED from `state` through STATE_PAYS),
 *       so drawing both is the page saying one fact twice an inch apart;
 *     • its 4 resistance pools exist only as PHRASES in `RESISTANCE_BANDS` with no token,
 *       so keying them is the label trap and re-deriving the band off raw `resistance` is
 *       a second spelling of a shipped ladder;
 *     • its 7 aftermath-archetype, 2 blockade and 2 treaty-burden pools need
 *       `activeConditions` and `spatialLedgers` reads the war tab does not perform.
 *     THE ONE ACT: a token-returning sibling for the resistance ladder, and an aftermath
 *     reader on the war tab. Both are producer work.
 *
 *   DS-FTH-4 (4 pools) — its premise is `religionStates × templeWealth × inst.hasChurch`.
 *     ⛔ `templeWealth` HAS NO WRITER ANYWHERE IN THE ENGINE. It is a DESIGN-DOC future
 *     (WF-7, docs/DESIGN_FP_FAITH.md), and the estate has already measured this: the
 *     DESIGN_FP_ARCH_WF.md V27 row records `grep templeWealth in src/domain: 0` as
 *     VERIFIED. `tenure` (the ROOTED pool) lives on `religionStates[cid].deities[ref]` and
 *     is NOT among the seven fields `projectReligionStateOntoSettlement` puts on
 *     `config.faithProfile.deities[]`. The fourth pool, CONTESTED, keys on
 *     `faithProfile.contested` — which DS-FTH-1's "patron pressed by a near rival" already
 *     speaks on the same tab. So the block has no pool that is BOTH reachable and unspoken.
 *     THE ONE ACT: the WF-7 banded temple stock, plus `tenure` in the projection.
 *
 * PURE, HEADLESS LEAF: no state, no clock, no RNG; the corpus and the two sibling leaves
 * are its only imports.
 *
 * @enforced-by tests/domain/warFaithStateProseDesk.test.js
 */
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../../data/dossierStateProse/warFaith.generated.js';
import { readStateProse } from './stateProseKernel.js';
import { legibilityRung } from './legibilityRung.js';
import { documentSideOf } from '../../worldPulse/treatyOrientation.js';

/**
 * The desk's corpus, typed at the import boundary — the generated leaves stay pure data
 * with no import of any kind, so the shape assertion lives here.
 * @type {import('./stateProseKernel.js').StateProseCorpus}
 */
const CORPUS = /** @type {import('./stateProseKernel.js').StateProseCorpus} */ (
  /** @type {unknown} */ (DOSSIER_STATE_PROSE_WAR_FAITH)
);

/**
 * THE SHAPES THIS DESK BELIEVES ITS SLOTS HAVE, mirroring §0c's Shape column. The annex is
 * the authority and the projection contract test asserts this map equals it slot for slot.
 *
 * FIVE SLOTS, AND THE OMISSIONS ARE THE FINDING. This leaf's variants name fourteen slots
 * between them; the five below are the ones a producer can fill honestly. `{institution}`
 * has no temple-NAME producer (`inst.hasChurch` is a boolean); `{band}` is RESERVED by the
 * annex; `{season}`, `{good}`, `{route}`, `{reason}` and the three `{timeband_*}` forms
 * have no reading on either host tab. Anchored liveness therefore drops the variants that
 * name them — MEASURED in the desk test: every routed pool keeps at least one speaking
 * variant on the player audience, so no pool goes dark for want of a fill.
 * @type {Readonly<Record<string, string>>}
 */
export const SLOT_FILL_SHAPES = Object.freeze({
  settlement: 'proper',
  counterpart: 'proper',
  creed: 'proper',
  rival_creed: 'proper',
  term: 'proper',
});

/**
 * This desk owns NO literal fill table: every fill is a name the producer already carries,
 * never a word this file chose. Declared empty rather than omitted, because the projection
 * contract's table guard classifies every exported string map in this directory and an
 * absent declaration is what let `ACCESS_PROSE` arrive unnoticed once.
 * @type {Readonly<Record<string, Readonly<Record<string, string>>>>}
 */
export const SLOT_FILL_TABLES = Object.freeze({});

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * A `proper` fill, or `undefined`. A name is a name and an odd one still reads, so the only
 * refusals are the three that make a SEAM ungrammatical or break §0d: a leading determiner
 * the seam already supplies, a digit, and a raw snake_case engine token.
 * @param {unknown} value
 * @returns {string|undefined}
 */
function properFill(value) {
  const v = text(value);
  if (!v) return undefined;
  if (/^(?:the|a|an|its|his|her|their|our|this|that|these|those)\b/i.test(v)) return undefined;
  if (/[0-9]/.test(v)) return undefined;
  if (/[a-z]+_[a-z]+/.test(v)) return undefined;
  return v;
}

// ── DS-WAR-1 · THE STANDING ──────────────────────────────────────────────────────────

/**
 * The status lens.
 *
 * ⛔ THE CORPUS HAS NO `Under siege` POOL, and that is a declared hole rather than a route
 * to the nearest neighbour. WarTab's own ladder names four states — Under siege / On
 * campaign / Occupied / At war — and this block authored three. A besieged town therefore
 * draws NOTHING at this lens: routing it into `On campaign` would say the army is abroad
 * about a town with an enemy at its walls, which is the opposite fact. R-DST-K.
 *
 * ORDER IS THE LADDER'S, not the corpus's: a siege outranks a campaign outranks an
 * occupation, because a town can be all three at once and the sharpest one is the true
 * headline. `At war` is the residue — a war scar, a ramp or a holding with no front
 * anywhere — which is exactly what the pool's own parenthetical says it is.
 * @param {{besiegedBy?: unknown, besiegingTargets?: unknown}|null|undefined} status
 * @param {object|null|undefined} occupation the settlementOccupation reading
 * @param {boolean} otherwiseAtWar a scar, a ramp or a holding with no front
 * @returns {string|null}
 */
export function warStatusPoolKey(status, occupation, otherwiseAtWar) {
  const besieged = Array.isArray(status?.besiegedBy) && status.besiegedBy.length > 0;
  if (besieged) return null;
  if (Array.isArray(status?.besiegingTargets) && status.besiegingTargets.length > 0) {
    return 'statusLabel: On campaign';
  }
  if (occupation) return 'statusLabel: Occupied';
  return otherwiseAtWar
    ? 'statusLabel: At war (no front at the walls, no army abroad)'
    : null;
}

/**
 * The war-scar lens, keyed on the CANONICAL band word `warExhaustionBand` already returns.
 * Its four words — rested / near peace / war-weary / exhausted — are the four pool keys
 * verbatim, so this is a transcription and not a second ladder.
 *
 * `rested` IS DRAWN, and that is the DORMANT-IS-A-TRUE-STATEMENT test rather than a
 * fallback. A zero in `worldState.warExhaustion` is a real reading of a real ledger — the
 * town carries no scar — and a town that is besieged today and unscarred is a coherent
 * thing to say. What is NOT drawn is a town outside any campaign: the war surface does not
 * render there at all, so R-DST-K removes the sentence with the surface.
 * @param {unknown} band the word warExhaustionBand returned
 * @returns {string|null}
 */
export function warExhaustionPoolKey(band) {
  const word = text(band);
  return word && CORPUS['DS-WAR-1'].pools[`warExhaustion: ${word}`]
    ? `warExhaustion: ${word}`
    : null;
}

/** The ramp rungs, in the producer's own order (mobilizationStatus' RAMP_ORDER). */
const RAMP_CLIMBING = Object.freeze(['alert', 'war_preparation']);

/**
 * The mobilization lens, keyed on the POSTURE TOKEN and never on `ticksToDeploy` alone.
 * See the docblock: the tick estimate is 0 at BOTH ends of the ramp, so it cannot tell
 * `mobilized` from `demobilizing` and would print the muster complete over a town standing
 * down. The token can, and it is the producer's own datum.
 *
 * `deployed` reads as fully ready because the army IS raised — the corpus pool says the
 * muster is done, and a marching army satisfies that more completely than a mobilized one.
 * `war_exhaustion`, `demobilizing` and `peace` have NO pool in this block and draw nothing.
 *
 * JUDGMENT (vetoable): the climb splits at TWO ticks remaining. The corpus names the rungs
 * "still distant" and "close to ready" and leaves the cut to the implementer; two is chosen
 * because `RAMP_ORDER` has three rungs above peace, so a town more than two rungs out has
 * not started in earnest. Say "veto" to move it.
 * @param {unknown} postureState the raw `warPosture[id].state` token
 * @param {unknown} ticksToDeploy the producer's own remaining-rung estimate
 * @param {boolean} [covert] the record's own covert flag
 * @returns {string|null}
 */
export function mobilizationPoolKey(postureState, ticksToDeploy, covert = false) {
  const state = text(postureState);
  if (!state || state === 'peace') return null;
  if (covert) return 'mobilization: COVERT';
  if (state === 'mobilized' || state === 'deployed') return 'mobilization: fully ready';
  if (!RAMP_CLIMBING.includes(state)) return null;
  const ticks = Number(ticksToDeploy);
  if (!Number.isFinite(ticks)) return null;
  return ticks > 2
    ? 'mobilization: climbing the ramp, still distant'
    : 'mobilization: climbing, close to ready';
}

/**
 * The occupation lens — does the holding pay for itself. Keyed on the reading's own `pays`
 * boolean, which `settlementOccupation` derives from the state token through STATE_PAYS.
 * NO RECORD IS NOT AN UNPROFITABLE RECORD: a town nobody occupies has not been measured as
 * a net drain, so this is null rather than the `pays false` pool.
 * @param {{pays?: unknown}|null|undefined} occupation
 * @returns {string|null}
 */
export function occupationPaysPoolKey(occupation) {
  if (!occupation) return null;
  return occupation.pays
    ? 'occupation.pays true'
    : 'occupation.pays false (the occupation is a net drain on the holder)';
}

/**
 * The occupier's WIDER POSITION, read on the OCCUPIED town's page.
 *
 * ⛔⛔ THE SLOT ROLES ARE INVERTED FROM THE READER THAT SHARES THE POOL'S NAME, and this is
 * the sharpest finding of this car. Every variant in both `occupierHoldings.*` pools is
 * written from the OCCUPIED town's chair — "{counterpart} holds more than it can garrison
 * properly, and {settlement} is one of the places where the thinness shows". So
 * `{settlement}` is the town BEING HELD and `{counterpart}` is the power holding it.
 *
 * But `occupierHoldings()` in occupationStatus.js is the reading for the OCCUPIER'S OWN
 * dossier — its own docblock says so ("a who-benefits surface for the occupier's own
 * dossier"), and WarTab calls it with THIS settlement's id as the holder. Feeding that
 * reading into this pool prints "the garrison at Thornwall is stronger for the occupier's
 * other successes" about the town that OWNS the garrison. It is a fluent, confident,
 * FALSE sentence, and nothing in the tree would have caught it: both roles are `proper`,
 * both fills are real names, and the rendered line reads perfectly.
 *
 * THE CURE IS THE CALL, NOT THE POOL. The correct draw is on the OCCUPIED town's page with
 * the reading taken for ITS OCCUPIER — `occupierHoldings({ settlementId: occupierId })` —
 * which is exactly what these sentences describe: how the power holding this town is
 * faring everywhere else. That is what `war.occupierPosition` carries, and the occupier id
 * comes off the ledger record because `settlementOccupation` returns the occupier's NAME
 * and not its id.
 *
 * ⚠ AND THE MIRROR CASE STAYS DARK, DECLARED: a town that OCCUPIES others has no pool in
 * this block. The corpus wrote the occupied town's chair and not the holder's, so WarTab's
 * own "Occupier." row keeps its DATUM and draws no sentence. That is R-DST-K, not a gap to
 * fill by pointing these pools at the reading whose name matches.
 *
 * `stretchedThin` outranks `strengthened` because one reading can carry both and
 * overextension is the sharper fact — the order WarTab's own row already renders them in.
 * @param {{stretchedThin?: unknown, strengthened?: unknown}|null|undefined} occupierPosition
 *   the holdings reading taken for THIS TOWN'S OCCUPIER, never for this town.
 * @returns {string|null}
 */
export function occupierHoldingsPoolKey(occupierPosition) {
  if (!occupierPosition) return null;
  if (occupierPosition.stretchedThin) return 'occupierHoldings.stretchedThin';
  return occupierPosition.strengthened ? 'occupierHoldings.strengthened' : null;
}

// ── DS-WAR-2 · THE TREATIES ──────────────────────────────────────────────────────────

/** The seven obligation families the corpus authored a voice for. */
const CORPUS_TERM_FAMILIES = Object.freeze([
  'economic', 'relational', 'security', 'territorial', 'political', 'informational',
  'sovereignty',
]);
/** The compliance vocabulary, which is `normalizeState`'s own closed three. */
const COMPLIANCE_STATES = Object.freeze(['honored', 'strained', 'defaulted']);
/**
  * Sharpest first: a broken clause is the headline, an honoured one is the residue.
  * Typed as an open record because it is indexed by a producer string, and an unknown word
  * falls to the `honored` residue rather than to `undefined`.
  * @type {Readonly<Record<string, number>>}
  */
const COMPLIANCE_RANK = Object.freeze({ defaulted: 0, strained: 1, honored: 2 });

/**
 * One clause of a treaty document, as `renderTreatiesForSettlement` decorates it.
 * @typedef {object} TreatyTermView
 * @property {unknown} [family]
 * @property {unknown} [complianceState]
 * @property {unknown} [yearsRemaining]
 * @property {unknown} [fraying]
 * @property {unknown} [label]
 */

/**
 * One term's pool key, `<family> · <state>`.
 *
 * TOTAL IN BOTH DIRECTIONS, AND THE FLOOR IS THE PRODUCER'S OWN. The engine's family
 * vocabulary is THIRTEEN (`TREATY_COMPLIANCE_VOICE` adds sovereignty_transfer, faith,
 * population, commercial, amnesty and jubilee to the seven below); the corpus authored
 * seven and a `generic floor`. That is not a gap — `treatyStrainLine` already falls to
 * `TREATY_COMPLIANCE_FLOOR` for an unnamed family, so the corpus's floor pool is the same
 * concept spelled in prose, and routing the other six there is the producer's own
 * behaviour rather than this desk's invention.
 *
 * An unrecognised compliance word reads as `honored`, because `normalizeState` does — a
 * second normalisation here would be the fork.
 * @param {unknown} family
 * @param {unknown} complianceState
 * @returns {string|null}
 */
export function treatyTermPoolKey(family, complianceState) {
  const raw = text(complianceState);
  const state = COMPLIANCE_STATES.includes(raw) ? raw : 'honored';
  const name = text(family);
  const bucket = CORPUS_TERM_FAMILIES.includes(name) ? name : 'generic floor';
  return `${bucket} · ${state}`;
}

/**
 * The term one document SPEAKS about: the most strained, then the earliest to lapse, then
 * the producer's own order. A document carries many clauses and the position draws one
 * sentence, so the choice is made here once rather than by array luck at the call site.
 * @param {ReadonlyArray<TreatyTermView>|null|undefined} termLines
 * @returns {TreatyTermView|null}
 */
export function leadingTerm(termLines) {
  if (!Array.isArray(termLines) || termLines.length === 0) return null;
  /** @param {TreatyTermView} row @returns {number} */
  const rank = (row) => COMPLIANCE_RANK[text(row?.complianceState)] ?? COMPLIANCE_RANK.honored;
  /** @param {TreatyTermView} row @returns {number} */
  const years = (row) => {
    const n = Number(row?.yearsRemaining);
    return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
  };
  return [...termLines].sort((a, b) => rank(a) - rank(b) || years(a) - years(b))[0] || null;
}

/**
 * The fraying lens: a clause coming apart while it still has time to run. Both halves are
 * required — a lapsing clause that frays is simply a clause ending, and the pool's own
 * words are about a promise breaking EARLY.
 * @param {{fraying?: unknown, yearsRemaining?: unknown}|null|undefined} term
 * @returns {string|null}
 */
export function treatyFrayingPoolKey(term) {
  return term?.fraying && Number(term.yearsRemaining) > 0
    ? 'fraying set on a term with time still to run'
    : null;
}

/**
 * The DOCUMENT lens — which side of the instrument this town stands on, or that the whole
 * thing lapses within the year.
 *
 * THE SIDE IS ASKED OF `treatyOrientation.js`, NOT SPELLED HERE (CR-WR10-G). `doc` is a
 * `peaceTermsDocument.treatyDocument` read-model, never a ledger row: its `victorId` /
 * `loserId` are ALREADY `treatyOrientationOf(treaty).receiverId` / `.giverId`, resolved at
 * the producer. Reading those two field names in a display leaf is indistinguishable from
 * resolving a treaty's parties by hand, and CR-WR10-G's consumer census convicted this file
 * for exactly that — its `\.treaties\b` probe reads `war.treaties`, an array of DOCUMENTS,
 * as a ledger read. `documentSideOf` is the same lookup at the address that owns the
 * vocabulary, and it is byte-identical on every input including a slot-missing one.
 *
 * ⛔ AND IT IS NOT `treatyOrientationOf(doc)`: a document carries no `sellerId`/`buyerId`,
 * so that reader would fall through to its war arm and answer `wartime` for a purchase.
 *
 * ⛔ THE TWO POOL KEYS STILL SAY VICTOR AND LOSER, AND ON A SALE THAT IS WRONG. The
 * producer fills the receiver slot with the BUYER and the giver slot with the SELLER, so a
 * town that BOUGHT a holding is told it is the victor side and one that sold it is told it
 * is the loser side. The corpus has no seller/buyer pool for DS-WAR-2, so the cure is a
 * corpus authoring act and not a display edit; gating these keys on `orientationKind`
 * instead would silence a sale's document entirely, which is a reader losing a sentence
 * rather than gaining a true one. DECLARED, and handed to the chair.
 *
 * THE EXPIRY OUTRANKS THE ROLE: a treaty ending this year is news, and the side a town
 * took is standing background. The remaining life is the MINIMUM over the clauses, because
 * a document lives as long as its longest-running term and lapses when its last one does —
 * read off the term view rather than re-derived from the ledger.
 * @param {{victorId?: unknown, loserId?: unknown, termLines?: ReadonlyArray<{yearsRemaining?: unknown}>}|null|undefined} doc
 * @param {unknown} settlementId
 * @returns {string|null}
 */
export function treatyDocumentPoolKey(doc, settlementId) {
  if (!doc) return null;
  const lives = (doc.termLines || [])
    .map((row) => Number(row?.yearsRemaining))
    .filter((n) => Number.isFinite(n));
  if (lives.length > 0 && Math.max(...lives) <= 1) {
    return 'document-level: the treaty runs out within the year';
  }
  const side = documentSideOf(doc, settlementId);
  if (side === 'receiver') return 'document-level: the town is the VICTOR side';
  if (side === 'giver') return 'document-level: the town is the LOSER side';
  return null;
}

// ── DS-WAR-3 · THE WHOLE-PAGE-SET DORMANT NOTE ───────────────────────────────────────

/**
 * The dormant note's one pool, and the only block on this leaf whose condition spans BOTH
 * host tabs: *no war beat AND no treaty AND faith hidden*.
 *
 * IT SPEAKS ON THE WAR TAB because the war tab is the only one that can EVALUATE it. The
 * war half needs the campaign's `worldState`, which FaithTab holds none of by §805's own
 * constitution; the faith half is the ABSENCE of `config.primaryDeitySnapshot`, which both
 * tabs can read off the settlement. A tab that can answer half a condition cannot honestly
 * host the sentence, so the faith tab keeps its own honest-absence line and this block does
 * not glance there — a row whose rung is null in every world would be a position the
 * registry names and the tree can never fill, which is the citation shape the walker's
 * reachability arm exists to refuse.
 * @param {boolean} warBeat any siege, campaign, scar, ramp, occupation or holding
 * @param {boolean} anyTreaty
 * @param {boolean} faithHidden the settlement carries no patron snapshot
 * @returns {string|null}
 */
export function dormantNotePoolKey(warBeat, anyTreaty, faithHidden) {
  return !warBeat && !anyTreaty && faithHidden ? '*' : null;
}

// ── DS-FTH-1 · THE LIVE FAITH PANEL ──────────────────────────────────────────────────

/** The pantheon's own seat-size tokens, which are the pool keys verbatim. */
const RANK_AXES = Object.freeze(['major', 'minor', 'cult']);

/**
 * The patron lens, keyed on `rankAxis` — the deity snapshot's own token, not the word a
 * surface prints for it. An unrecognised rank draws nothing rather than falling to `minor`
 * (which is what `deityCommitEmbed` defaults a MISSING one to, and a default is not a
 * reading).
 * @param {unknown} rankAxis
 * @returns {string|null}
 */
export function patronRankPoolKey(rankAxis) {
  const rank = text(rankAxis);
  return RANK_AXES.includes(rank) ? `PATRON: rankAxis: ${rank}` : null;
}

/**
 * The devotion lens. `pietyBandLabel`'s five words ARE the five pool keys, so this is a
 * transcription of the canonical band and not a second one.
 * @param {unknown} pietyBand
 * @returns {string|null}
 */
export function devotionPoolKey(pietyBand) {
  const band = text(pietyBand);
  return band && CORPUS['DS-FTH-1'].pools[`DEVOTION: ${band}`] ? `DEVOTION: ${band}` : null;
}

/**
 * The arc lens — where devotion is HEADING, from `pietyTrend`'s own three words.
 * @param {unknown} trend
 * @returns {string|null}
 */
export function pietyArcPoolKey(trend) {
  const word = text(trend);
  return word && CORPUS['DS-FTH-1'].pools[`ARC: trend: ${word}`] ? `ARC: trend: ${word}` : null;
}

/**
 * The standings lens — how the pantheon's shares sit.
 *
 * `contested` IS THE PRODUCER'S OWN FLAG (`patronShare - topRival < PATRON_FLIP_MARGIN`),
 * never a comparison re-done here. "A plural field" is the case with no patron at all
 * among the ranks, which is a real projected state and not a missing one.
 * @param {{ranks?: ReadonlyArray<{isPatron?: unknown}>, contested?: unknown}|null|undefined} model
 * @returns {string|null}
 */
export function standingsPoolKey(model) {
  const ranks = Array.isArray(model?.ranks) ? model.ranks : [];
  if (ranks.length === 0) return null;
  if (!ranks.some((row) => row?.isPatron)) return 'STANDINGS: a plural field, no majority';
  return model?.contested
    ? 'STANDINGS: the patron pressed by a near rival'
    : 'STANDINGS: the patron dominant';
}

/**
 * The secularization lens. The engine does not project the sink's OWN direction, so the
 * piety arc is the legible proxy the panel already uses — comfort drains, crisis reclaims.
 * A `steady` arc has no pool, and that is the corpus declining to guess.
 * @param {{unaffiliated?: unknown, piety?: {trend?: unknown}|null}|null|undefined} model
 * @returns {string|null}
 */
export function sinkPoolKey(model) {
  const share = Number(model?.unaffiliated);
  if (!Number.isFinite(share) || share <= 0) return null;
  const trend = text(model?.piety?.trend);
  if (trend === 'falling') return 'SINK: unaffiliated present, arc falling';
  return trend === 'rising' ? 'SINK: unaffiliated present, arc rising' : null;
}

/**
 * The three outcomes `divineMandateStatus` can return, mapped to the three pools DS-FTH-1
 * authored for them. PRIVATE, so the projection contract's fill-table guard does not see a
 * candidate fill table — no value of it ever reaches a `{slot}`.
 *
 * ⚠ IT KEYS ON THE PHRASE, WHICH IS THE ONE PLACE THIS DESK DOES, AND THE REASON IS THAT
 * THE PRODUCER OFFERS NOTHING ELSE. `divineMandateStatus` returns `{ propping, phrase }`,
 * and `propping` is TRUE for two of the three outcomes — so the boolean cannot separate a
 * dominant church from a serviceable one. The phrase is a closed three-value vocabulary
 * fixed in religionState.js, and the desk test drives the REAL reader over settlements
 * that produce all three and asserts this map total in both directions, so a re-worded
 * phrase reds there instead of going silently dark. That is the label trap made testable
 * rather than accepted.
 * @type {Readonly<Record<string, string>>}
 */
const MANDATE_POOL_BY_PHRASE = Object.freeze({
  'A contested faith weakens the ruler’s divine mandate.':
    'MANDATE: contested, or patron security below the floor',
  'A dominant church shores up the ruler’s divine mandate.':
    'MANDATE: a dominant church',
  'The faith lends the ruler a measure of divine mandate.':
    'MANDATE: a measure of divine mandate',
});

/**
 * The mandate lens — whether the seat is propped by a divine claim or pressed off it.
 *
 * ⛔ READ FROM `divineMandateStatus`, NEVER FROM A SECOND THRESHOLD. This lens was first
 * written as a hand cut on `patronSecurity` at 0.5 and 0.75 — and the shipped reader cuts
 * the SAME number at 0.4 and 0.6. Two surfaces of one settlement would have disagreed
 * about whether its church props the throne, with nothing anywhere to notice: both
 * sentences read fine, and only a town between the two cuts would have shown it. That is
 * the fork-that-drifts the economy desk names, caught by a size ratchet counting bare
 * decimals rather than by anything that understood the fact.
 *
 * The reader is also GOVERNMENT-SCOPED — it returns null for a merchant council or a
 * republic, which have no divine mandate to prop — so a desk deriving the band itself
 * would additionally have printed a mandate sentence over a town whose government has
 * none. `faithPanelModel` already carries the reading as `model.mandate`.
 * @param {{mandate?: {phrase?: unknown}|null}|null|undefined} model
 * @returns {string|null}
 */
export function mandatePoolKey(model) {
  return MANDATE_POOL_BY_PHRASE[text(model?.mandate?.phrase)] || null;
}

// ── DS-FTH-2 · THE PATRON-LESS TOWN ──────────────────────────────────────────────────

/**
 * The teaser — what a settlement with NO PATRON says about its own observance.
 *
 * ⛔ THE PUBLIC POOL IS UNREACHABLE, AND IT IS A FINDING RATHER THAN A HOLE. This block
 * authored TWO pools on a viewer axis: `PRIVATE DOSSIER` and `PUBLIC / SHARED DOSSIER`.
 * §885.3 rules dossier corpus prose a PAID surface and O2GATE nulls every rung on a public
 * dossier, so the desk is never CALLED for the viewer the second pool was written for. The
 * corpus and the gate disagree about one reader, and the corpus is not wrong: the block's
 * own title says it *names no deity*, which is precisely why a free viewer could be shown
 * it safely. THE ONE ACT THAT LIGHTS IT is an owner ruling carving DS-FTH-2 out of the
 * paid-surface line — a paid-surface behaviour change, which is owner-gated and is
 * therefore raised here rather than taken.
 *
 * A town WITH a patron has no teaser: the live panel speaks instead, and printing both
 * would be the page saying the town both keeps and does not keep a faith.
 * @param {boolean} hasPatron
 * @returns {string|null}
 */
export function faithTeaserPoolKey(hasPatron) {
  return hasPatron ? null : 'PRIVATE DOSSIER';
}

// ── DS-FTH-3 · CREED STANDING ────────────────────────────────────────────────────────

/**
 * The standing lens, on `religionState`'s own closed ladder (cult → established →
 * ascendant), read off the projected rank rather than recomputed from the share.
 * @param {unknown} standing
 * @returns {string|null}
 */
export function creedStandingPoolKey(standing) {
  const word = text(standing);
  return word && CORPUS['DS-FTH-3'].pools[`STANDING: ${word}`] ? `STANDING: ${word}` : null;
}

/**
 * The legitimacy lens. `legitimacyBand`'s four labels ARE the four pool keys, and the band
 * is the panel's own — the same object `PatronSeatBlock` prints as the seat's claim.
 * @param {unknown} bandLabel the label off legitimacyBand
 * @returns {string|null}
 */
export function creedLegitimacyPoolKey(bandLabel) {
  const word = text(bandLabel);
  return word && CORPUS['DS-FTH-3'].pools[`LEGITIMACY: ${word}`] ? `LEGITIMACY: ${word}` : null;
}

/**
 * The patron-fall lens, keyed on `patronFall.cause` — `PATRON_FALL_CAUSES`' frozen four
 * tokens, which are the four pool keys. The record only materialises behind the
 * `faithUnseatingEnabled` fence, so a dark world derives nothing and this reads null.
 * @param {unknown} cause
 * @returns {string|null}
 */
export function patronFallPoolKey(cause) {
  const word = text(cause);
  return word && CORPUS['DS-FTH-3'].pools[`FALL: ${word}`] ? `FALL: ${word}` : null;
}

/**
 * The niche lens — is anyone standing in the patron's doorway.
 *
 * COMPUTED FROM THE PROJECTED NICHES ALONE, which is a comparison of values the producer
 * already wrote and not a re-derivation of `nicheOf`. The two CAPACITY pools of this block
 * ("slots saturated at tier capacity" / "slots open") are NOT routed: they need
 * `capacityForTier` against the religion state's own tier, and neither the capacity nor the
 * tier it is measured against is projected onto the settlement. Declared, not filled.
 * @param {ReadonlyArray<{niche?: unknown, isPatron?: unknown}>|null|undefined} ranks
 * @returns {string|null}
 */
export function nicheContestPoolKey(ranks) {
  if (!Array.isArray(ranks) || ranks.length === 0) return null;
  const patron = ranks.find((row) => row?.isPatron);
  const named = ranks.filter((row) => text(row?.niche) !== '');
  if (named.length === 0) return null;
  if (patron && text(patron.niche)
    && named.some((row) => row !== patron && text(row.niche) === text(patron.niche))) {
    return "NICHE: the patron's niche carries a contestant";
  }
  const niches = named.map((row) => text(row.niche));
  return new Set(niches).size === niches.length ? 'NICHE: every niche uncontested' : null;
}

// ── THE DESK ─────────────────────────────────────────────────────────────────────────

/**
 * @typedef {object} WarReadings
 * @property {{besiegedBy?: unknown, besiegingTargets?: unknown}|null} [status]
 * @property {unknown} [exhaustionBand] the word warExhaustionBand returned
 * @property {{ticksToDeploy?: unknown, covert?: unknown}|null} [mobilization]
 * @property {unknown} [postureState] the raw warPosture[id].state token
 * @property {{pays?: unknown, occupierName?: unknown}|null} [occupation]
 * @property {{stretchedThin?: unknown, strengthened?: unknown}|null} [occupierPosition] the
 *   holdings reading taken for THIS TOWN'S OCCUPIER — never for this town. See
 *   `occupierHoldingsPoolKey`: the pool's slot roles are the occupied town's, and feeding
 *   it this town's own holdings prints a fluent false sentence.
 * @property {ReadonlyArray<object>} [treaties]
 * @property {boolean} [warBeat] the tab's own "anything martial is happening" reading
 * @property {string} [counterpart] the ONE opposing town, ALREADY RESOLVED TO A NAME by the
 *   tab's own `nameFor`. The desk never turns an id into a name: the roster that maps them
 *   is the store's, the resolver is the tab's, and a second one here is the fork that
 *   drifts. Empty when the reading names none — or names SEVERAL, because a coalition has
 *   no counterpart and the corpus's `{counterpart}` seams are singular.
 */
/**
 * The slice of `faithPanelModel`'s answer this desk reads. DECLARED rather than typed
 * `any`: a desk that types its input `any` has given up the one check that would catch a
 * renamed producer field, and every field below is a real read.
 * @typedef {object} FaithRankView
 * @property {string} [name]
 * @property {string} [standing]
 * @property {string} [niche]
 * @property {boolean} [isPatron]
 * @property {{label?: string}} [band] the panel's own legitimacyBand object
 */
/**
 * @typedef {object} FaithPanelView
 * @property {boolean} [hasEmbed]
 * @property {boolean} [live]
 * @property {{rankAxis?: string}} [patron]
 * @property {ReadonlyArray<unknown>} [cults]
 * @property {ReadonlyArray<FaithRankView>} [ranks]
 * @property {{band?: string, trend?: string}|null} [piety]
 * @property {number|null} [unaffiliated]
 * @property {boolean} [contested]
 * @property {{phrase?: unknown}|null} [mandate]
 */
/**
 * @typedef {object} TreatyDocumentView
 * @property {unknown} [victorId]
 * @property {unknown} [loserId]
 * @property {unknown} [complianceState]
 * @property {ReadonlyArray<{family?: unknown, complianceState?: unknown,
 *   yearsRemaining?: unknown, fraying?: unknown, label?: unknown}>} [termLines]
 */
/**
 * @typedef {object} WarFaithReadings
 * @property {WarReadings|null} [war] absent on the faith tab, which holds no worldState
 * @property {FaithPanelView|null} [faith] the faithPanelModel reading; absent on the war tab
 * @property {boolean} [hasPatron] does the settlement carry a patron at all
 * @property {unknown} [patronFallCause] `faithProfile.patronFall.cause`, when the world
 *   materialised one (it only exists behind the `faithUnseatingEnabled` fence)
 * @property {unknown} [settlementId]
 */
/**
 * ⚠ WHY `hasPatron` AND `patronFallCause` ARRIVE AS READINGS RATHER THAN BEING READ HERE.
 * Two reasons that point the same way.
 *
 * THE ARCHITECTURAL ONE: a desk maps live STATE onto pool keys and reads no settlement
 * record of its own. Every other input to this file is a canonical reading handed over by
 * its owner; digging into `settlement.config` for two of them would make this the one desk
 * that also does its own record access.
 *
 * THE MEASURED ONE: the reader-with-no-writer walker convicted exactly those two reads —
 * `config.primaryDeitySnapshot` (2) and `config.faithProfile` (1) — as "keys no writer
 * produces". ⛔ THAT VERDICT IS FALSE ABOUT THE CODE AND TRUE ABOUT THE CORPUS: both keys
 * have real writers (`projectReligionStateOntoSettlement` writes `faithProfile`; the deity
 * embed writes the snapshot, and `faithPanelModel` and OutputContainer's own `hasFaithTab`
 * both read it today). What the walker actually measures is that NO SETTLEMENT IN ITS
 * OBSERVATION CORPUS CARRIES THEM — because that corpus is DEITY-FREE, which is the same
 * fact that blocks walking the faith mounts at all. Deleting the reads on its word would
 * have been the "observation ratchet reports its corpus's reach" trap, taken at face value.
 * Moving them to the components — which CR-OSR-SCOPE-1 excludes from exact resolution
 * precisely because they are the downstream projection layer — is the cure that is right on
 * both counts rather than the one that silences the instrument.
 */

/**
 * THE DESK. One legibility rung per LENS, or null where the surface does not render.
 *
 * The rungs are grouped by the POSITION that draws them, exactly as the economy desk's
 * commercial lenses are: one position may draw several lenses of one block (the DS-POW-1
 * shape), and the C3 law is one sentence RUNG per block per page-set.
 *
 * EVERY GLANCE IS EMPTY EXCEPT THE NICHE ROW'S, and the asymmetry is the legibility law
 * rather than an inconsistency. The war and faith positions are PARAGRAPHS under headings
 * the page already prints, so a rung whose corpus went silent has nothing at any depth and
 * `null` is how this subsystem spells that. The niche row is a real band surface — the row
 * prints the standing word today — so its rung carries that word and the registry decides
 * whether it may also speak.
 *
 * @param {{name?: unknown}|null|undefined} settlement the town, read ONLY for its name
 * @param {WarFaithReadings} [readings] the canonical readings, as their owners return them
 * @param {{seed?: string, audience?: string}} [options]
 * @returns {Readonly<Record<string, object|null>>}
 */
export function warFaithStateProse(settlement, readings = {}, options = {}) {
  const war = readings.war || null;
  const faith = readings.faith || null;
  const name = properFill(settlement?.name);
  const hasPatron = readings.hasPatron === true;

  const patronRank = Array.isArray(faith?.ranks) ? faith.ranks.find((d) => d?.isPatron) : null;
  const rivalRank = Array.isArray(faith?.ranks)
    ? faith.ranks.find((d) => d && !d.isPatron)
    : null;

  const slots = {
    settlement: name,
    // The opposing town, when the reading names exactly one. A coalition has no single
    // counterpart, and naming the first of several would be the page picking a winner by
    // array order — so the slot goes unfilled and anchored liveness drops the variants
    // that need it, which is the honest degradation rather than a wrong name.
    counterpart: properFill(counterpartName(war)),
    creed: properFill(patronRank?.name),
    rival_creed: properFill(rivalRank?.name),
    term: properFill(leadingTerm(leadingDocument(war)?.termLines)?.label),
    // `{institution}`, `{band}`, `{season}`, `{good}`, `{route}`, `{reason}` and the three
    // `{timeband_*}` forms are DELIBERATELY UNFILLED — see SLOT_FILL_SHAPES.
  };

  /** @param {string} blockId @param {string|null} poolKey */
  const line = (blockId, poolKey) => (poolKey
    ? readStateProse(CORPUS, blockId, poolKey, { ...options, slots })
    : null);
  /**
   * A paragraph lens: a rung, or NOTHING at all (the DS-ECO-12 shape).
   * @param {{blockId: string, poolKey: string, angle: string, text: string}|null} l
   */
  const paragraph = (l) => (l ? legibilityRung('', l, []) : null);

  const doc = leadingDocument(war);
  const term = leadingTerm(doc?.termLines);
  // The seat's claim, as the PANEL already banded it. `faithPanelModel` builds
  // `band: legitimacyBand(legitimacy)` on every rank, so the desk reads the band it was
  // handed rather than calling the ladder a second time — the same discipline that keeps
  // `warExhaustionBand` and `pietyBandLabel` with their owners.
  const patronBand = patronRank?.band?.label;

  // ⛔ R-DST-K ON THE WHOLE STANDING SURFACE. Every DS-WAR-1 lens describes the martial
  // record, and the war block that carries it does not render on a town with no martial
  // beat — so on a quiet town the sentences must go with the surface. Without this gate the
  // `warExhaustion: rested` pool draws on EVERY peaceful settlement in a campaign, which is
  // true ("nothing has been spent") and is still the absence of a surface being given a
  // voice; worse, it would print BESIDE the dormant note, which says the same quiet twice.
  // MEASURED: the smoke fixture drew both lines at once before this gate existed.
  const martial = !!war?.warBeat;
  /** @param {string|null} poolKey */
  const standing = (poolKey) => paragraph(martial ? line('DS-WAR-1', poolKey) : null);

  return Object.freeze({
    // ── war.standing (DS-WAR-1) — five lenses over the martial record ──
    warStatus: standing(warStatusPoolKey(war?.status, war?.occupation, martial)),
    warExhaustion: standing(warExhaustionPoolKey(war?.exhaustionBand)),
    warMobilization: standing(mobilizationPoolKey(
      war?.postureState, war?.mobilization?.ticksToDeploy, !!war?.mobilization?.covert)),
    warOccupation: standing(occupationPaysPoolKey(war?.occupation)),
    warHoldings: standing(occupierHoldingsPoolKey(war?.occupierPosition)),

    // ── war.treaties (DS-WAR-2) — the clause, its fraying, and the document ──
    treatyTerm: paragraph(term
      ? line('DS-WAR-2', treatyTermPoolKey(term.family, term.complianceState))
      : null),
    treatyFraying: paragraph(line('DS-WAR-2', treatyFrayingPoolKey(term))),
    treatyDocument: paragraph(line('DS-WAR-2',
      treatyDocumentPoolKey(doc, readings.settlementId))),

    // ── war.dormantNote (DS-WAR-3) — the whole page-set at rest ──
    dormantNote: paragraph(line('DS-WAR-3', war
      ? dormantNotePoolKey(!!war.warBeat, (war.treaties || []).length > 0, !hasPatron)
      : null)),

    // ── faith.patronSeat (DS-FTH-1) — the live panel, seven lenses ──
    patronRank: paragraph(line('DS-FTH-1', patronRankPoolKey(faith?.patron?.rankAxis))),
    patronCults: paragraph(line('DS-FTH-1',
      Array.isArray(faith?.cults) && faith.cults.length > 0
        ? 'CULTS: cults[] present beneath the patron'
        : null)),
    devotion: paragraph(line('DS-FTH-1', devotionPoolKey(faith?.piety?.band))),
    pietyArc: paragraph(line('DS-FTH-1', pietyArcPoolKey(faith?.piety?.trend))),
    standings: paragraph(line('DS-FTH-1', standingsPoolKey(faith))),
    sink: paragraph(line('DS-FTH-1', sinkPoolKey(faith))),
    mandate: paragraph(line('DS-FTH-1', mandatePoolKey(faith))),
    // The panel's own dark state: an embed with no projected profile behind it. NOT the
    // patron-less town — that is DS-FTH-2's, and conflating them would print "the ledger
    // has not been opened" over a town that simply keeps no god.
    faithDark: paragraph(line('DS-FTH-1',
      faith?.hasEmbed && !faith?.live ? 'live: false' : null)),

    // ── faith.teaser (DS-FTH-2) — the patron-less town's own voice ──
    faithTeaser: paragraph(faith ? line('DS-FTH-2', faithTeaserPoolKey(hasPatron)) : null),

    // ── faith.creedStanding (DS-FTH-3) — four lenses on the seat's politics ──
    creedStanding: paragraph(line('DS-FTH-3', creedStandingPoolKey(patronRank?.standing))),
    creedLegitimacy: paragraph(line('DS-FTH-3', creedLegitimacyPoolKey(patronBand))),
    creedNiche: paragraph(line('DS-FTH-3', nicheContestPoolKey(faith?.ranks))),
    creedFall: paragraph(line('DS-FTH-3', patronFallPoolKey(readings.patronFallCause))),

    // ── faith.nicheRow (DS-FTH-3, GLANCE) — the band the row already prints ──
    // The ONLY rung on this desk that carries a glance, because it is the only position
    // that is a band surface rather than a paragraph. The registry says `glance` here, so
    // `drawnAtMount` strips the sentence and the provenance and the row keeps its word.
    nicheRow: patronRank?.standing
      ? legibilityRung(text(patronRank.standing),
        line('DS-FTH-3', creedStandingPoolKey(patronRank.standing)), [])
      : null,
  });
}

/**
 * The one document a page speaks about: the most strained, then the earliest to lapse.
 * Same ordering discipline as `leadingTerm` and for the same reason — a town may hold
 * several instruments and the position draws one sentence.
 * @param {WarReadings|null} war
 * @returns {TreatyDocumentView|null}
 */
function leadingDocument(war) {
  const docs = /** @type {ReadonlyArray<TreatyDocumentView>} */ (
    Array.isArray(war?.treaties) ? war.treaties : []);
  if (docs.length === 0) return null;
  /** @param {TreatyDocumentView} row @returns {number} */
  const rank = (row) => COMPLIANCE_RANK[text(row?.complianceState)] ?? COMPLIANCE_RANK.honored;
  return [...docs].sort((a, b) => rank(a) - rank(b))[0] || null;
}

/**
 * The single opposing town, as a NAME.
 *
 * ⚠ THE IDS ARE NOT NAMES, and this is where that would have gone wrong silently. The war
 * reading's `besiegedBy` / `besiegingTargets` hold SAVE IDS (`forge_town`), and the
 * occupier reading holds a resolved NAME (`settlementOccupation` runs `nameFor` itself).
 * Filling `{counterpart}` from an id would print a snake_case engine token into a sentence
 * — which `properFill` refuses, so the failure would have been a silently dropped variant
 * rather than a visible defect. The tab resolves the id with its own roster and hands the
 * name over as `war.counterpart`; the occupier name is taken from the reading that already
 * carries one.
 * @param {WarReadings|null} war
 * @returns {string}
 */
function counterpartName(war) {
  const occupier = text(war?.occupation?.occupierName);
  return occupier || text(war?.counterpart);
}
