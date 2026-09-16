/**
 * envoyTaskCatalog.js — W-OPS car O4: THE ENVOY TASK CATALOG and the R3b NEGOTIATION
 * METHOD MENU (docs/DESIGN_W_OPS.md §4, on the §0 task qualification law).
 *
 * Two halves, one law between them. The catalog says WHICH errands a court may charter;
 * the menu says HOW an envoy may work once it is there. Both are DARK: no production
 * module imports this leaf, no flag is minted, and nothing here writes a key.
 *
 * ── THE QUALIFICATION LAW, AND WHY IT TAKES TWO CONJUNCTS ────────────────────
 *
 * §0: "a mission or task kind registers only if its resolution writes an ALREADY-RECEIPTED
 * outcome family". Measured against this tree, that test alone is NOT sufficient, and the
 * estate has already been bitten by the gap it leaves. `ENVOY_COVERT_LEG_REFS` cut two
 * members — `pullBand` at ES-1 and `exports` at EP-r — for ONE shared property: no writer
 * could ever fill them. A row that names a real receipt family it cannot REACH is that
 * same dead band wearing a qualified row's clothes.
 *
 * So a row is admitted only on BOTH:
 *   (R) RECEIPT — its resolution writes an already-receipted outcome family, with a NAMED
 *       PRODUCER in this tree. This is §0 read literally.
 *   (E) ROAD    — the errand spine can actually carry it: a `built: true` ERRAND_CONSUMERS
 *       row of the right purposeClass, and a traced import chain to that producer.
 *
 * ⭐ THE TWO CONJUNCTS ARE NOT THIS CAR'S INVENTION, and the corroboration is worth the
 * line: sibling car O3 encoded its own qualification in exactly two fields
 * (`sourceVerdict` + `writerLanded`) after reasoning from the opposite end — the mission
 * side rather than the errand side. Two cars converging on a two-field test from different
 * directions is what makes it a property of the estate rather than a taste.
 *
 * ── THE CENSUS THIS LEAF IS THE RESULT OF (denominators, measured) ───────────
 *
 * Denominator 1: `eventProse.ENVOY_KINDS` — SIXTEEN envoy receipt kinds. ⚠ They carry the
 * JOURNEY and the TERMS, never the TASK KIND: there is no `envoy_treaty_negotiated` beside
 * `envoy_terms_agreed`, so every envoy task resolves through the SAME terms receipts and
 * the envoy family ALONE can qualify nothing. The downstream outcome family is what (R)
 * actually tests.
 * Denominator 2: `dispositionLedger.DISPOSITION_SOURCE_KINDS` — THIRTEEN, frozen.
 *
 * Eight candidate rows in §4 produced NINE dispositions (row 5's slash hides two different
 * answers): four admitted, five parked. The parks are three distinct classes and each names
 * its own unblocking act — see `TASK_PARK_CLASSES`.
 *
 * ── ⛔⛔ THE SIGHT LAW, AND IT IS THE REASON THIS FILE READS NO COURT ─────────
 *
 * §4 wants counterparty fit to read "the OTHER COURT's known character". Measured, the
 * court-grain read of nerve is `strategicPosture.courtRiskAppetiteOf` over the disposition
 * ledger — and it takes the COUNTERPART'S OWN entry, which is ground truth about them, not
 * the envoy's court's belief. Wiring it straight in is the two-sights violation one grain
 * up, and it would be INVISIBLE, because that module is pure and demonstrably learns only
 * from resolved outcomes. RECEIPTED IS NOT THE SAME AS KNOWN-BY-THIS-OBSERVER.
 *
 * The estate's one observer-scoped court model is `beliefMap`, and its believed attribute
 * set carries NO nerve: readiness, strengthBand, allianceLabel, faithLabel, confidence01,
 * lastUpdateTick (+ D-1's two axis fields). Minting a believed-appetite slot is a NEW
 * PERSISTED KEY FAMILY in `worldState.beliefMaps` — precisely what EP-r refused for
 * `exports`. So this leaf does the only honest thing left: THE READ IS HANDED IN, exactly
 * as `knownCharacterOf` takes its `disclosures` rather than fetching them, because
 * "somewhere to look is the store the design forbids" (GAP D, at court grain).
 *
 * ⭐ AND THE GUARD IS STRUCTURAL RATHER THAN PROMISED. A `knownCharacterOf` RESULT carries
 * `confidence` and `disclosedAxes`; a true chart — whether from `effectiveCharacter` or
 * from `characterAsSeenBy({ viewer: 'deity' })`, which returns the bare chart — carries
 * NEITHER. Requiring the provenance fields therefore refuses a true chart BY SHAPE, and one
 * guard covers both true-sight doors. Deity true-sight stays footholds-only (L5) and has no
 * door into a negotiation menu at all.
 *
 * ── ABSENT IS ABSENT, NEVER A NEUTRAL VOTE ──────────────────────────────────
 *
 * A court nobody has read is not a `settled` court. `strategicPosture` already rules this
 * ("a missing term is dropped from the weighted mean rather than voted at neutral") and R6
 * rules it with `absent[]`. This leaf follows both: an unread term is NAMED in `absent`,
 * never folded to the middle band. The presence guard is `typeof value !== 'number'` —
 * STRICTER than R6's `Number.isFinite(Number(x))`, which admits `null` and `''` as a
 * supplied zero (sibling car O2's finding O2-D, met here from the same side).
 *
 * PURE: no rng, no wall clock, no store, no state, no write, no mutation of inputs.
 *
 * @see docs/DESIGN_W_OPS.md §0 (the task qualification law), §4, §8b F8
 * @enforced-by tests/domain/envoyTaskCatalog.test.js
 */

import { ENVOY_PURPOSE_CLASSES, compareCodepoint } from './envoyErrandVocabulary.js';

// ── 0. Small pure helpers (no second clamp, no second sort) ───────────────────

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/**
 * The presence guard, and it is deliberately stricter than the risk register's.
 * `Number(null)` and `Number('')` are both 0 and both finite, so a caller passing `null`
 * for a term it does not hold would be recorded as having supplied ZERO. This rejects
 * `null`, `''`, `true` and `undefined` alike.
 * @param {unknown} value a term the caller may or may not hold
 * @returns {boolean}
 */
function suppliedNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' && value.length > 0 ? value : '';
}

// ── 1. THE PARK CLASSES ───────────────────────────────────────────────────────

/**
 * WHY A CANDIDATE ROW IS NOT IN THE CATALOG. Three classes, because "parked" collapses
 * three different situations that want three different acts, and a single word would send
 * a later reader hunting for the wrong unblocker.
 *
 * `no_family` — no receipt family exists at all. Unblocked by a DESIGN act that mints one,
 *   which is owner-visible by nature (a new outcome family is a new schema surface).
 * `road_unbuilt` — the family is REAL and named; the errand consumer that reaches it is
 *   registered `built: false` with a NAMED WAVE. ⚠ MATERIALLY UNLIKE the `exports` cut:
 *   that member was permanently unfillable, this one has a dated road. Unblocked by that
 *   wave landing, and by nothing else.
 * `unreceipted_distinction` — the outcome family exists, but nothing in it can tell this
 *   row apart from an already-admitted one. Admitting it mints a kind whose entire
 *   distinguishing content is unreceipted, which is the §0 law failing in the one direction
 *   an existence census cannot see.
 * @type {readonly string[]}
 */
export const TASK_PARK_CLASSES = Object.freeze([
  'no_family',
  'road_unbuilt',
  'unreceipted_distinction',
]);

// ── 2. THE ADMITTED CATALOG ───────────────────────────────────────────────────

/**
 * THE ENVOY TASK CATALOG — receipt-family-verified rows ONLY. Codepoint-ordered, in the
 * field shape sibling car O3 used for its mission kinds, so the two catalogs UNION at the
 * landing rather than colliding. The name is deliberately NOT O3's: a second set under one
 * name would be the volume's own §7 risk 3 (a second system by accident).
 *
 * ⚠ NO ROW HERE TOUCHES `ENVOY_PURPOSES`. That array is `['sue','self_parlay']` and
 * `PURPOSE_CLASS_BY_PURPOSE` is TOTAL over it BY PIN; adding a purpose is a persisted-DTO
 * change that would move every existing save's candidate set on its next tick — THE PROMISE
 * forbids it, and it is the same line sibling car O2 declined to cross with `seek_compromise`.
 * A task kind is what a court CHARTERS; a purpose is what the errand ROW persists. They are
 * different grains and this catalog stays on the charter side of the seam.
 *
 * @type {ReadonlyArray<Readonly<{kind:string, operationClass:string, ridesPurposeClass:string,
 *   receiptFamily:string, receiptWriter:string, receiptModule:string, sourceVerdict:string,
 *   roadLanded:boolean, roadNote:string, sourceNote:string, signedBy:string|null}>>}
 */
export const ENVOY_TASK_CATALOG = Object.freeze([
  Object.freeze({
    kind: 'arrange_reimbursement',
    operationClass: 'ERRAND',
    ridesPurposeClass: 'diplomatic',
    receiptFamily: 'coalition_settlement',
    receiptWriter: 'planCoalitionSettlement',
    receiptModule: 'src/domain/worldPulse/warCoalitionSettlement.js',
    sourceVerdict: 'verified',
    roadLanded: true,
    roadNote: 'peaceTermsCoalition.js imports planCoalitionSettlement, and peace terms are '
      + 'what a sue errand produces',
    sourceNote:
      'FIVE of the thirteen frozen disposition source kinds are this family: '
      + 'coalition_reimbursement_paid / _unpaid and coalition_settlement_profit / _honored / '
      + '_shortfall, so a settled reimbursement teaches the ledger through a vocabulary that '
      + 'already exists and needs no new word',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'mediate',
    operationClass: 'ERRAND',
    ridesPurposeClass: 'diplomatic',
    receiptFamily: 'mediation_landed',
    receiptWriter: 'treatyDispositionDeltas',
    receiptModule: 'src/domain/worldPulse/treatyDisposition.js',
    sourceVerdict: 'verified',
    roadLanded: true,
    roadNote: 'treatyDispositionDeltas is called from peaceTerms.js, the sue errand outcome path',
    sourceNote:
      'the ONE outcome that already credits a THIRD party. The adapter reads mediatorId and '
      + 'writes the win to the mediator, not to either side of the quarrel. That is exactly '
      + 'what a mediating envoy is for, and it is the reason this row needs no new receipt',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'negotiate_ransom',
    operationClass: 'ERRAND',
    ridesPurposeClass: 'diplomatic',
    receiptFamily: 'ransom_claim',
    receiptWriter: 'mintRansomClaim',
    receiptModule: 'src/domain/worldPulse/ransomClaim.js',
    sourceVerdict: 'verified',
    roadLanded: true,
    roadNote: 'the STRONGEST road of the four: envoyRansomStage.js imports envoyErrandsOf and '
      + 'foreignGuestHoldsOf directly, so the errand, the custody record and the claim already '
      + 'meet in one production leaf',
    sourceNote:
      'WR-7d mints a real claim against a real custody hold, and the hold closes through its own '
      + 'closed reason vocabulary. The whole resolution is receipted end to end',
    signedBy: null,
  }),
  Object.freeze({
    kind: 'negotiate_treaty',
    operationClass: 'ERRAND',
    ridesPurposeClass: 'diplomatic',
    receiptFamily: 'peace_terms_appraisal',
    // ⚠ THE WRITER IS `appraiseLoserPortfolio`, NOT the module's own name. This row first
    // named the MODULE and the census arm caught it: `peaceTermsAppraisal` appears nowhere
    // in peaceTermsAppraisal.js as code. A row that names a plausible symbol nobody exports
    // is the dead band again, one field along — and only an arm that resolves the symbol
    // against the real source can see it.
    receiptWriter: 'appraiseLoserPortfolio',
    receiptModule: 'src/domain/worldPulse/peaceTermsAppraisal.js',
    sourceVerdict: 'verified',
    roadLanded: true,
    roadNote: 'the sue purpose IS this errand; envoy_terms_agreed and terms_never_reached are '
      + 'both already in the sixteen',
    sourceNote:
      'the founding case, and the only row whose receipts are envoy-family receipts rather than '
      + 'downstream ones, which is why it is the row that proves the sixteen cannot qualify a '
      + 'kind alone: terms_agreed says terms were agreed, never which task was chartered. '
      + '⭐ AND ITS PRODUCER CORROBORATES THIS FILE\'S SIGHT LAW FROM THE INSIDE: the appraisal '
      + 'module\'s own header rules every read BELIEF-sourced, never truth, and it imports '
      + 'readBeliefStrength from beliefMap, so pricing a treaty is ALREADY observer-scoped '
      + 'here, and the menu reading beliefs is this stack\'s discipline rather than a new one',
    signedBy: null,
  }),
]);

// ── 3. THE PARKED ROWS ────────────────────────────────────────────────────────

/**
 * THE ROWS THE CENSUS REFUSED, BY NAME, WITH THE ACT THAT WOULD ADMIT EACH. A park is a
 * measurement, not an opinion: every `evidence` string below is a command that was run at
 * this tree and its result.
 *
 * ⛔ `state_visit` IS PARKED, AND THE PACKET NAMED IT FOR EXACTLY THIS TEST. §4 marks it
 * "needs receipt verification at dispatch". Verified at dispatch and it FAILS: legitimacy
 * exists as a QUANTITY in many modules and as a RECEIPT FAMILY in none.
 *
 * @type {ReadonlyArray<Readonly<{kind:string, parkClass:string, claimedFamily:string,
 *   evidence:string, unblockingAct:string, namedWave:string|null}>>}
 */
export const PARKED_ENVOY_TASKS = Object.freeze([
  Object.freeze({
    kind: 'deliver_ultimatum',
    parkClass: 'no_family',
    claimedFamily: 'casus / war records',
    evidence: 'grep -rniE "ultimatum" over src/ and tests/ returns ZERO hits. The casus records '
      + 'that DO exist are casus_lineage_claim_parent / _child (lineage-driven) and '
      + 'casus_alliance_obligation (coalition-driven); none is written by a delivered demand',
    unblockingAct: 'mint a casus kind whose producer is the delivery of a demand: a new receipt '
      + 'family, therefore owner-visible',
    namedWave: null,
  }),
  Object.freeze({
    kind: 'hostage_exchange',
    parkClass: 'unreceipted_distinction',
    claimedFamily: 'custody records',
    evidence: 'the custody ledger is REAL (foreignGuestHold.js, with open / close / restore '
      + 'writers), but FOREIGN_GUEST_HOLD_CLOSE_REASONS is exactly release / escape / death / '
      + 'pardon, and no field links two holds. An exchange therefore records as two unilateral '
      + 'releases and is indistinguishable from two negotiate_ransom outcomes in every record',
    unblockingAct: 'a close reason, or a linking field, that makes a swap distinguishable from '
      + 'two releases: a persisted vocabulary change, therefore owner-visible',
    namedWave: null,
  }),
  Object.freeze({
    kind: 'state_visit',
    parkClass: 'no_family',
    claimedFamily: 'legitimacy / standing displays',
    evidence: 'grep -rniE "stateVisit|state_visit|standingDisplay|legitimacyDisplay" over src/ '
      + 'and tests/ returns ZERO hits, and there is no legitimacyRecord / legitimacyEvent / '
      + 'legitimacyLedger writer. Legitimacy is a quantity here, never an outcome family',
    unblockingAct: 'mint a standing-display receipt family, or rule the row out of the catalog '
      + 'permanently: the owner-taste call §9 row 1 already reserves',
    namedWave: null,
  }),
  Object.freeze({
    kind: 'trade_embassy',
    parkClass: 'road_unbuilt',
    claimedFamily: 'trade_contest',
    evidence: 'the family is REAL and is one of the frozen thirteen (dispositionDeltas.js types '
      + 'tradeWar outcomes as trade_contest), so (R) PASSES and only (E) fails. The commercial '
      + 'purposeClass consumer is ERRAND_CONSUMERS row "factors" at built:false, and grep for '
      + 'tradeWar across the envoy stack and errandMint.js returns ZERO',
    unblockingAct: 'TR-8 landing factorErrand.js and flipping that registry row to built:true. '
      + 'No design decision is owed; this row is waiting on a dated wave, not on a ruling',
    namedWave: 'TR-8',
  }),
  Object.freeze({
    kind: 'tribute',
    parkClass: 'no_family',
    claimedFamily: 'coalition settlement records',
    evidence: 'the row §4 spells "arrange_reimbursement/tribute" is TWO rows with TWO different '
      + 'answers. Reimbursement is admitted above; tribute has no record writer at all. Grep '
      + 'for tribute over src/domain/ returns only prose strings in factionRelationshipUpdate.js',
    unblockingAct: 'mint a recurring-obligation record, or fold tribute into the peace-terms '
      + 'clause machinery that already prices obligations',
    namedWave: null,
  }),
]);

/**
 * THE QUALIFICATION TEST, EXECUTABLE. TOTAL over both lists by pin: a row in neither list
 * is `unknown`, never quietly admitted. The two conjuncts are returned SEPARATELY rather
 * than as one boolean, because "which half failed" is the whole content of a park —
 * `trade_embassy` passes (R) and fails (E), and a single boolean would erase that.
 * @param {string} kind a task kind word
 * @returns {Readonly<{kind:string, admitted:boolean, receiptOk:boolean, roadOk:boolean,
 *   parkClass:string|null, known:boolean}>}
 */
export function taskQualification(kind) {
  const word = text(kind);
  const admitted = ENVOY_TASK_CATALOG.find((row) => row.kind === word) || null;
  if (admitted) {
    return Object.freeze({
      kind: word,
      admitted: true,
      receiptOk: admitted.sourceVerdict === 'verified',
      roadOk: admitted.roadLanded === true,
      parkClass: null,
      known: true,
    });
  }
  const parked = PARKED_ENVOY_TASKS.find((row) => row.kind === word) || null;
  if (parked) {
    return Object.freeze({
      kind: word,
      admitted: false,
      // Only `road_unbuilt` names a family that actually exists; the other two classes
      // fail (R) outright. This is the one place the park class is arithmetic.
      receiptOk: parked.parkClass === 'road_unbuilt',
      roadOk: false,
      parkClass: parked.parkClass,
      known: true,
    });
  }
  return Object.freeze({
    kind: word, admitted: false, receiptOk: false, roadOk: false, parkClass: null, known: false,
  });
}

/** Every admitted kind, codepoint-ordered. @type {readonly string[]} */
export const ADMITTED_TASK_KINDS = Object.freeze(
  ENVOY_TASK_CATALOG.map((row) => row.kind).sort(compareCodepoint),
);

/**
 * THE PURPOSE CLASSES THIS CATALOG ACTUALLY SPANS — DERIVED through the errand spine's own
 * closed vocabulary, never restated. A row naming a class the spine does not carry DROPS OUT
 * here rather than travelling, so the count is a live check that every row sits on a real
 * class (the count-ledger discipline: a restated derivable goes stale and greens a guard).
 * @type {readonly string[]}
 */
export const CATALOG_PURPOSE_CLASSES = Object.freeze(
  [...new Set(ENVOY_TASK_CATALOG.map((row) => row.ridesPurposeClass))]
    .filter((rides) => ENVOY_PURPOSE_CLASSES.includes(rides))
    .sort(compareCodepoint),
);

/** Every parked kind, codepoint-ordered. @type {readonly string[]} */
export const PARKED_TASK_KINDS = Object.freeze(
  PARKED_ENVOY_TASKS.map((row) => row.kind).sort(compareCodepoint),
);

// ── 4. THE R3b NEGOTIATION METHOD MENU ────────────────────────────────────────

/**
 * THE METHOD MENU (§1's R3b: actor fit x counterparty fit x context). FOUR methods, and
 * the set is closed for the same reason every enumeration in this family is: an open menu
 * is an open schema the day a method reaches a receipt.
 *
 * ⚠ THIS IS A FIRST MINT, NOT A FORK, and it was checked rather than assumed. The nearest
 * existing vocabularies are `TREATY_ORIENTATION_KINDS` (unknown / wartime / sale — what
 * KIND of treaty is on the table) and `ENVOY_PARLAY_REFUSAL_REASONS` (why a sheet was
 * refused). Neither says HOW an envoy works a room, and no `negotiationStyle` / method
 * vocabulary exists anywhere in src/ — pinned by a source scan in the battery.
 *
 * `fitsNerve` is the volume's own sentence made arithmetic: "threaten the cowardly court,
 * never the brave one". `press_hard` fits a `restrained` court and MISFIRES on a `dominant`
 * one; `wait_them_out` is its mirror. The band words are BORROWED from
 * `dispositionLedger.APPETITE_BAND_LADDER` rather than minted — a second five-word ladder
 * over the same quantity is the fourteen-drift class this estate names by that name.
 * @type {ReadonlyArray<Readonly<{kind:string, reads:readonly string[],
 *   fitsNerve:readonly string[], misfiresOn:readonly string[], note:string}>>}
 */
export const NEGOTIATION_METHODS = Object.freeze([
  Object.freeze({
    kind: 'appeal_to_honour',
    reads: Object.freeze(['counterpartNerve', 'envoyChart']),
    fitsNerve: Object.freeze(['marked', 'dominant']),
    misfiresOn: Object.freeze(['restrained']),
    note: 'a court that thinks well of its own nerve will spend to keep the reputation; a '
      + 'frightened one hears the appeal as a demand it cannot afford',
  }),
  Object.freeze({
    kind: 'appeal_to_interest',
    reads: Object.freeze(['counterpartNerve', 'envoyChart']),
    fitsNerve: Object.freeze(['measured', 'settled', 'marked']),
    misfiresOn: Object.freeze([]),
    note: 'the honest middle. It misfires on nobody, which is exactly why it is not free: it '
      + 'reads the smallest amount about the other court and buys the smallest edge',
  }),
  Object.freeze({
    kind: 'press_hard',
    reads: Object.freeze(['counterpartNerve', 'envoyChart']),
    fitsNerve: Object.freeze(['restrained', 'measured']),
    misfiresOn: Object.freeze(['dominant']),
    note: 'the volume\'s own line: threaten the cowardly court, never the brave one. Pressed '
      + 'against a dominant court it hardens the very nerve it was meant to break',
  }),
  Object.freeze({
    kind: 'wait_them_out',
    reads: Object.freeze(['counterpartNerve']),
    fitsNerve: Object.freeze(['restrained']),
    misfiresOn: Object.freeze(['dominant', 'marked']),
    note: 'patience prices the other court\'s appetite for the wait, and reads NOTHING about '
      + 'the envoy: the one method whose fit does not consult the person sent',
  }),
]);

/** Every method kind, codepoint-ordered. @type {readonly string[]} */
export const NEGOTIATION_METHOD_KINDS = Object.freeze(
  NEGOTIATION_METHODS.map((row) => row.kind).sort(compareCodepoint),
);

/**
 * THE TERMS A FIT CAN BE WEIGHED FROM. Named so a verdict can report which it HAD, in the
 * `absent[]` idiom the risk register established.
 * @type {readonly string[]}
 */
export const FIT_TERMS = Object.freeze(['counterpartNerve', 'envoyChart']);

/**
 * ⛔⛔ THE SIGHT LAW, DECLARED IN THE CODE AND NOT ONLY IN A RECEIPT. A later reader who
 * wires this menu to `courtRiskAppetiteOf` on the counterpart's own ledger entry will have
 * written something that runs, passes every purity check, and is wrong in the one way no
 * census sees.
 */
export const COUNTERPART_SIGHT_LAW = Object.freeze({
  rule: 'the menu reads what the ENVOY\'S COURT KNOWS, never the true chart and never the '
    + 'counterpart\'s own ledger',
  whyNotTheLedger: 'strategicPosture.courtRiskAppetiteOf takes the COUNTERPART\'S entry. That '
    + 'is ground truth about them. It is learned only from resolved outcomes, which makes it '
    + 'RECEIPTED, and receipted is not the same as known-by-this-observer',
  observerScopedModel: 'src/domain/worldPulse/beliefMap.js',
  believedAttributesToday: Object.freeze([
    'readiness', 'strengthBand', 'allianceLabel', 'faithLabel', 'confidence01', 'lastUpdateTick',
  ]),
  nerveIsNotBelieved: 'no believed slot for a court\'s nerve exists; minting one is a new '
    + 'persisted key family in worldState.beliefMaps, which is what EP-r refused for `exports`',
  deityTrueSightScope: 'targetedFootholds',
  structuralGuard: 'a knownCharacterOf RESULT carries confidence and disclosedAxes; a true '
    + 'chart from effectiveCharacter or from characterAsSeenBy({viewer:\'deity\'}) carries '
    + 'neither, so requiring them refuses a true chart BY SHAPE',
});

/**
 * THE SHAPE GATE. Accepts a `knownCharacterOf` RESULT and refuses anything else, including
 * both true-chart shapes — one guard, both doors.
 * @param {unknown} reading what the caller believes is a known-character reading
 * @returns {Readonly<{ok:boolean, reason:string, confidence:number}>}
 */
export function knownReadingOrRefusal(reading) {
  const row = asObject(reading);
  if (!suppliedNumber(row.confidence)) {
    return Object.freeze({
      ok: false,
      reason: 'not_a_known_reading',
      confidence: 0,
    });
  }
  if (!Array.isArray(row.disclosedAxes)) {
    return Object.freeze({ ok: false, reason: 'not_a_known_reading', confidence: 0 });
  }
  if (!asObject(row.character).axes) {
    return Object.freeze({ ok: false, reason: 'no_chart', confidence: 0 });
  }
  return Object.freeze({
    ok: true,
    reason: '',
    confidence: /** @type {number} */ (row.confidence),
  });
}

/**
 * THE COUNTERPART FIT READ. Both terms are HANDED IN — the leaf fetches nothing, imports no
 * producer, and cannot reach a ledger. That is GAP D at court grain, and it is also why
 * this file mints no cross-layer coupling pair.
 *
 * ABSENT IS NAMED, NEVER VOTED. A court whose nerve the observer has not read is reported
 * `fit: 'unread'` with the term listed in `absent` — NOT as a middle band the observer never
 * earned, and NOT as a fit of any kind. There is no fallback standing: "I have not read
 * them" is a distinct answer from "they read neutral", and collapsing the two is precisely
 * the silent-zero the risk register's `absent[]` exists to prevent.
 *
 * @param {Object} args
 * @param {string} [args.methodKind] one of NEGOTIATION_METHOD_KINDS
 * @param {{band?: unknown, present?: unknown, heldReceiptIds?: unknown}|null} [args.counterpartNerve]
 *   the OBSERVER's read of the other court's nerve, with the receipts it was read from
 * @param {unknown} [args.envoyChart] a knownCharacterOf RESULT for the envoy being sent
 * @returns {Readonly<{methodKind:string, known:boolean, fit:string, absent:readonly string[],
 *   refusal:string, readAtConfidence:number, evidenceCount:number}>}
 */
export function counterpartFitRead({ methodKind, counterpartNerve, envoyChart } = {}) {
  const word = text(methodKind);
  const method = NEGOTIATION_METHODS.find((row) => row.kind === word) || null;
  if (!method) {
    return Object.freeze({
      methodKind: word,
      known: false,
      fit: 'unknown_method',
      absent: Object.freeze([...FIT_TERMS]),
      refusal: 'unknown_method',
      readAtConfidence: 0,
      evidenceCount: 0,
    });
  }

  /** @type {string[]} */
  const absent = [];

  // THE COURT TERM. `present === true` is strict for the same reason every gate in this
  // estate is: absent and false must be identical at the decision site.
  const nerve = asObject(counterpartNerve);
  const nerveBand = text(nerve.band);
  const heldIds = Array.isArray(nerve.heldReceiptIds) ? nerve.heldReceiptIds : [];
  // ⭐ A BAND WITH NO RECEIPT BEHIND IT IS NOT A READ. This is the clause that stops a
  // caller from passing a band it got from the counterpart's own ledger and calling it
  // knowledge: an observer's read must name the records it was read from.
  const nerveKnown = nerve.present === true && nerveBand !== '' && heldIds.length > 0;
  if (!nerveKnown) absent.push('counterpartNerve');

  // THE ENVOY TERM, through the shape gate.
  const envoyGate = knownReadingOrRefusal(envoyChart);
  const needsEnvoy = method.reads.includes('envoyChart');
  if (needsEnvoy && !envoyGate.ok) absent.push('envoyChart');

  // ⭐⭐ A SUPPLIED TRUE CHART IS REFUSED BY EVERY METHOD, INCLUDING THE ONES THAT DO NOT
  // READ IT. The wiring mistake lives at the CALLER, not at the method — and
  // `negotiationMenuFor` hands one chart to all four. Were this refusal method-dependent,
  // a menu built on a true chart would return three refusals beside one row that looked
  // perfectly valid, and a consumer reading that row would proceed on true sight with the
  // menu's own evidence saying it was fine. The failure must be total or it is worse than
  // none.
  if (!envoyGate.ok && asObject(envoyChart).axes) {
    return Object.freeze({
      methodKind: word,
      known: false,
      fit: 'refused',
      absent: Object.freeze(absent.sort(compareCodepoint)),
      refusal: 'true_chart_refused',
      readAtConfidence: 0,
      evidenceCount: heldIds.length,
    });
  }

  const fit = !nerveKnown
    ? 'unread'
    : method.misfiresOn.includes(nerveBand)
      ? 'misfires'
      : method.fitsNerve.includes(nerveBand)
        ? 'fits'
        : 'neutral';

  return Object.freeze({
    methodKind: word,
    known: nerveKnown,
    fit,
    absent: Object.freeze(absent.sort(compareCodepoint)),
    refusal: '',
    readAtConfidence: envoyGate.ok ? envoyGate.confidence : 0,
    evidenceCount: heldIds.length,
  });
}

/**
 * THE MENU AN ENVOY IS OFFERED at one counterpart court: every method with its fit, in
 * codepoint order. Order is a property of the method set, never of the caller's argument
 * order, so two callers with the same knowledge get the same menu.
 * @param {Object} args
 * @param {{band?: unknown, present?: unknown, heldReceiptIds?: unknown}|null} [args.counterpartNerve]
 *   the observer's read of the other court's nerve
 * @param {unknown} [args.envoyChart] a knownCharacterOf RESULT for the envoy being sent
 * @returns {ReadonlyArray<ReturnType<typeof counterpartFitRead>>}
 */
export function negotiationMenuFor({ counterpartNerve, envoyChart } = {}) {
  return Object.freeze(
    NEGOTIATION_METHOD_KINDS.map((methodKind) => counterpartFitRead({
      methodKind, counterpartNerve, envoyChart,
    })),
  );
}

// ── 5. PROVENANCE ─────────────────────────────────────────────────────────────

/**
 * Provenance, in the module, the L1 catalog's idiom.
 * @type {Readonly<{status:string, signedBy:string|null, ownerRows:readonly string[],
 *   door:string, consumers:string, census:Readonly<Record<string, number>>}>}
 */
export const ENVOY_TASK_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (the volume\'s §9 row 1 is exactly this catalog, '
    + 'state_visit\'s fate included)',
  signedBy: null,
  ownerRows: Object.freeze([
    'the four admitted rows are receipt-verified, not taste, but WHICH of them a court may '
      + 'charter, and at what cadence, is the pen\'s',
    '⛔ state_visit: PARKED for want of any receipt family. The fork the owner actually holds '
      + 'is mint-a-standing-family versus cut-the-row, and §9 row 1 already reserves it',
    'tribute: the same fork one row along, and it was hidden inside a slash in §4\'s prose',
    'hostage_exchange: whether a swap deserves a close reason of its own, or is honestly two '
      + 'releases and should not be a task kind at all',
    'the four method words and their nerve fits. The fits are derived from the volume\'s own '
      + 'sentence about threatening cowardly courts; a signed table is the pen\'s',
  ]),
  door: 'envoyTaskCatalogEnabled: MINTED 2026-09-05 by the lighting wave car LGT-P5-WOPS, and '
    + 'the READ IS NOT HERE. The key is a manifest member with an authored certification row, '
    + 'and its one by-name strict gate lives in the errand family door home beside the spine\'s '
    + 'own, AND-composed with the spine: a menu of business is only as live as the road that '
    + 'carries people to it. This leaf stays gate-free, and the arm below still pins it',
  consumers: 'NONE. No src/ module imports this leaf; the darkness is pinned by a real planted '
    + 'importer in the battery, not by a grep that could pass by finding nothing',
  census: Object.freeze({
    candidateRows: 8,
    dispositions: 9,
    admitted: 4,
    parked: 5,
    envoyReceiptKinds: 16,
    dispositionSourceKinds: 13,
  }),
});
