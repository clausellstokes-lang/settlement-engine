/**
 * habitForkRegistry.js — HB-1. THE CLASSIFICATION OF EVERY WEIGHTED DECISION FORK THE
 * ESTATE CAN SEE, and the named-domain checklist the owner asked for BY NAME.
 *
 * ⛔ THE CHOOSER-TOTALITY STOP LAW. Every weighted decision fork in `src/domain` is
 * classified here as LEARN, STAY, DEFER or DEAD_CODE. A fork that lands unclassified REDS
 * the tree, and a wave that finds an unclassified fork STOPS.
 *
 * ── TWO INSTRUMENTS, BECAUSE ONE OF THEM IS BLIND AND SAYS SO ───────────────────
 *
 * The `discovery: 'idiom'` rows are found by SIGNATURE — a source scan the walker runs on
 * every commit — and their set is asserted EXACTLY equal to the scan's, both directions.
 * The `discovery: 'checklist'` rows are a HAND-MAINTAINED list with its own totality
 * assertion, and that is the point rather than an embarrassment: an argmin over a cost
 * computed in a helper the scan cannot follow, a Bernoulli gate, and any fork expressed as
 * an if/else ladder over thresholds are NOT discoverable by signature. Three separate
 * measured failures — a domain filed under worldgen, a domain deferred instead of
 * dispositioned, and a faith fork living in a directory neither earlier round scanned —
 * are three proofs the second instrument was needed. A declared blind spot with an
 * instrument beside it is not a silent hole.
 *
 * ── EVERY ROW IS DEFER OR A PRESERVED PERMANENT RULING, AND NOT ONE SAYS LEARN ──
 *
 * This wave mints the registry, not the learning. Rows the volume disposes toward learning
 * land DEFER with a written `closeOwed`, so the registry is born seeing the whole surface
 * and later waves only shrink the defer list. Rows the volume rules STAY-DETERMINISTIC
 * PERMANENTLY are recorded as STAY, because filing a permanent ruling as a deferral would
 * be a false record rather than caution: a world's founding road graph is part of what a
 * seed IS, and an observance score assembles the number one draw is tested against rather
 * than choosing between candidates.
 *
 * ⚠ `arity` IS DECLARED ONLY WHERE IT WAS MEASURED. A row that has not been read at its
 * load point carries `null` rather than a guess, and the walker asserts uniqueness over the
 * rows that DO declare one — because a symbol carrying two different arities is a RED, and
 * the disposition-uniqueness assertion is structurally blind to it. That blindness is not
 * hypothetical: one chooser carried a flat DYADIC in one table and a per-action reading in
 * two others, and all three agreed on the disposition, so the older assertion passed green
 * on a document that told an implementer to bind a counterpart to ten moves that have none.
 *
 * ⚠ `circumstanceClasses` IS EMPTY ON EVERY ROW TODAY and is asserted a subset of the
 * closed vocabulary, which is the shape that becomes load-bearing the moment a row
 * promotes. A DEFER row keys nothing, so a populated list here would be a claim about a
 * join that does not exist.
 *
 * PURE. No world state, no store, no PRNG. Its one import is the habit vocabulary leaf.
 *
 * @enforced-by tests/lint/chooserTotality.walker.test.js
 * @enforced-by tests/domain/habitForkRegistry.test.js
 */
import { CIRCUMSTANCE_CLASSES } from './habit/habitVocabulary.js';

/** The closed disposition vocabulary. DEAD_CODE is the fourth: measured-uncalled, chair-owed report, never deleted by this program. */
export const FORK_DISPOSITIONS = Object.freeze(['LEARN', 'STAY', 'DEFER', 'DEAD_CODE']);

/** The closed arity vocabulary. `per-action` is a third shape, not a caveat on the second. */
export const FORK_ARITIES = Object.freeze(['monadic', 'dyadic', 'per-action']);

/** The closed vocabulary a row's `circumstanceClasses` draws from once it promotes. */
export const FORK_CLASS_VOCABULARY = CIRCUMSTANCE_CLASSES;

/**
 * THE EIGHT DOMAIN LABELS, AS A CLOSED EXPLICIT ENUMERATION. ⛔ Asserted as a SET EQUALITY
 * in both directions — a distinct-string count is the vacuous form and is refused, because
 * it passes green on a table that dropped one label and misspelled another twice.
 * @type {readonly string[]}
 */
export const NAMED_DOMAIN_LABELS = Object.freeze([
  'TRADE',
  'FAITH',
  'STRATEGY',
  'ROUTE CREATION',
  'ROUTE CHOICE',
  'INTER-SETTLEMENT DYNAMICS',
  'GOALS',
  'GOAL ORIENTATION',
]);

/**
 * THE OWNER'S SEVEN SPOKEN DOMAINS, MAPPED ONTO THOSE EIGHT LABELS, recorded in the
 * charter itself. ⚠ The last pair is exactly why the LABEL count is EIGHT while the
 * OWNER'S count is SEVEN; writing the mapping down is what stops a later round from
 * "correcting" one number into the other.
 * @type {Readonly<Record<string, readonly string[]>>}
 */
export const OWNER_DOMAIN_MAPPING = Object.freeze({
  trade: Object.freeze(['TRADE']),
  faith: Object.freeze(['FAITH']),
  strategy: Object.freeze(['STRATEGY']),
  'route creation': Object.freeze(['ROUTE CREATION']),
  'route choice': Object.freeze(['ROUTE CHOICE']),
  'dynamics between settlements': Object.freeze(['INTER-SETTLEMENT DYNAMICS']),
  'goals, and goal orientation': Object.freeze(['GOALS', 'GOAL ORIENTATION']),
});

/**
 * @param {{ forkId: string, module: string, symbol: string|null, discovery: string,
 *   disposition: string, arity?: string|null, actionVocabulary?: string|null,
 *   closeSource?: string|null, closeOwed?: string|null, domain?: string|null,
 *   reason: string }} row
 */
function fork(row) {
  return Object.freeze({
    arity: null,
    actionVocabulary: null,
    closeSource: null,
    closeOwed: null,
    domain: null,
    ...row,
    circumstanceClasses: Object.freeze([]),
  });
}

/**
 * THE REGISTRY. Rows carrying `discovery: 'idiom'` are the signature-discovered partition
 * and their set is pinned EXACTLY against the live scan; rows carrying
 * `discovery: 'checklist'` are the owner's named-domain totality; two rows carry BOTH
 * because one symbol is discoverable AND owner-named, which is why the row is one row.
 * @type {readonly Readonly<Record<string, unknown>>[]}
 */
export const HABIT_FORK_REGISTRY = Object.freeze([
  // ── THE SIGNATURE-DISCOVERED PARTITION ────────────────────────────────────────
  fork({
    forkId: 'HBF-01', module: 'src/domain/worldPulse/demographicsMigration',
    symbol: 'advanceDemographicMigration', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race inside the migration advance; the acting settlement and the action it is choosing between have not been read at the load point',
    closeOwed: 'identify what a migration draw is graded against — arrival versus attrition on the chosen destination — before this row can carry a close',
  }),
  fork({
    forkId: 'HBF-02', module: 'src/domain/worldPulse/demographicsPlans',
    symbol: 'advanceDemographicPlans', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race inside the plan advance; whether the draw selects an ACTION or resolves a rate has not been read',
    closeOwed: 'identify the graded outcome of a demographic plan, and whether the fork is a choice at all',
  }),
  fork({
    forkId: 'HBF-03', module: 'src/domain/worldPulse/demographicsResponses',
    symbol: 'selectResponse', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race over the response vocabulary — the clearest candidate in this partition, because the vocabulary is already a frozen closed export',
    closeOwed: 'grade a chosen response against the overflow band it was meant to relieve, over the horizon the band takes to move',
  }),
  fork({
    forkId: 'HBF-04', module: 'src/domain/worldPulse/espionage/espionageDoctrineStage',
    symbol: 'dispatchCadenceFor', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race choosing a dispatch cadence; the espionage ladder owns its own close vocabulary and the join has not been read',
    closeOwed: 'grade a cadence against the errand outcomes it produced, using the ladder\'s own close rather than a second scale',
  }),
  // ⭐ EM-E0b — THE ROW FOLLOWS THE EXPORT, WHICH IS RULING 1'S ORDER AND THE ONLY LAWFUL ONE.
  // EM-E7 landed `STAY_DETECTION_OUTCOMES` on the DRAW'S OWN MODULE — a frozen word-to-verdict
  // map in `SIEGE_VERDICT_BANDS`' shape, spelled beside `STAY_DETECTION_FORK_ID` — and pinned
  // this row's null so the hand-off could not be lost between two members. This one moves the
  // row and nothing else.
  // ⛔ THE DISPOSITION STAYS DEFER, AND THE DISTINCTION IS THE POINT. A vocabulary answers what
  // this roll's outcome is TYPED as; it does not answer whether an ACTOR chooses it, which is
  // the reading `closeOwed` below still owes. Settling the second on the strength of the first
  // is exactly the "seal with invented words" FINITE-SEMANTICS refuses.
  fork({
    forkId: 'HBF-05', module: 'src/domain/worldPulse/espionage/espionageGauntlet',
    symbol: 'stayDetectionRoll', discovery: 'idiom', disposition: 'DEFER',
    actionVocabulary: 'STAY_DETECTION_OUTCOMES',
    reason: 'a keyed detection roll; whether an ACTOR chooses anything here, or the world resolves a hazard against them, has not been read at the site',
    closeOwed: 'establish whether this is a chooser at all — if the roll has no actor-selected candidate set, this row becomes STAY with that finding as its reason',
  }),
  fork({
    forkId: 'HBF-06', module: 'src/domain/worldPulse/espionage/espionageRider',
    symbol: 'covertRiderFor', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race attaching a covert rider to an errand; the candidate set and its owner have not been read at the load point',
    closeOwed: 'grade a rider against whether its cargo arrived unnoticed, which is the errand ladder\'s own close',
  }),
  fork({
    forkId: 'HBF-07', module: 'src/domain/worldPulse/grammarNews',
    symbol: 'grammarReceipt', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race over receipt prose pools; a prose pick is very likely NOT a decision fork, but that is a reading rather than a measurement and this wave does not make it',
    closeOwed: 'establish whether a receipt pool pick is a decision at all — if it selects prose rather than an act, this row becomes STAY, and no habit load may ever tilt what the world SAYS about an act it did not choose',
  }),
  fork({
    forkId: 'HBF-08', module: 'src/domain/worldPulse/npcLadderChallenge',
    symbol: 'challengeDraw', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed draw inside the ladder challenge; the ladder is the estate\'s one existing open-to-graded-close loop, so this row is a strong later candidate',
    closeOwed: 'grade a challenge draw against the contest it opened, reusing the ladder\'s own resolution rather than minting a second grade map',
  }),
  fork({
    forkId: 'HBF-09', module: 'src/domain/worldPulse/npcLadderContest',
    symbol: 'advanceAwareness', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race inside the awareness advance; whether it selects an act or drifts a scalar has not been read',
    closeOwed: 'establish whether awareness advance chooses anything, and if not record STAY with the finding',
  }),
  fork({
    forkId: 'HBF-10', module: 'src/domain/worldPulse/npcLadderContest',
    symbol: 'convertSupporters', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race converting supporters; the acting party and its candidate set have not been read at the load point',
    closeOwed: 'grade a conversion attempt against whether the support held to the contest\'s resolution',
  }),
  fork({
    forkId: 'HBF-11', module: 'src/domain/worldPulse/npcLadderContest',
    symbol: 'tieBreak', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race breaking a contest tie; a tiebreak is very likely a determinism device rather than a preference, but the site has not been read',
    closeOwed: 'establish whether the tiebreak expresses a preference — if it exists only to make an exact tie deterministic, this row becomes STAY and a habit load there would be a thumb on a coin, not a learned habit',
  }),
  fork({
    forkId: 'HBF-12', module: 'src/domain/worldPulse/populationDynamics',
    symbol: 'deltaForSettlement', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race inside a per-settlement delta; a rate rather than a choice is the likely reading, and it is not measured here',
    closeOwed: 'establish whether the delta selects among candidate acts; a pure rate takes STAY with that finding',
  }),
  fork({
    forkId: 'HBF-13', module: 'src/domain/worldPulse/pressureModel',
    symbol: 'pressureIndex', discovery: 'idiom', disposition: 'DEFER',
    reason: 'an inline extremum over a computed score array, taken to expose a LEADING pressure; a derivation for a receipt rather than a chosen act is the likely reading',
    closeOwed: 'establish whether the leading-pressure pick drives any act; a pure derivation takes STAY, and tilting a receipt would misreport the world rather than change it',
  }),
  fork({
    forkId: 'HBF-14', module: 'src/domain/worldPulse/relationshipRulesAdversarial',
    symbol: 'hostileRules', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race inside the adversarial rule set; the acting party and the candidate acts have not been read at the load point',
    closeOwed: 'grade a hostile act against the relationship movement it produced, which the relationship ledger already records',
  }),
  fork({
    forkId: 'HBF-15', module: 'src/domain/worldPulse/sovereigntyMarketStage',
    symbol: 'raceOrder', discovery: 'idiom', disposition: 'DEFER',
    reason: 'the sovereignty market\'s weighted keyed race over buyer-asset candidates, which the module documents in-source as its own race idiom',
    closeOwed: 'grade a seller\'s ordering against whether the conveyance it opened actually cleared',
  }),
  fork({
    forkId: 'HBF-16', module: 'src/domain/worldPulse/supplyWebWarfare',
    symbol: 'chooseInstrument', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a softmax-and-sample over supply-war instruments — a genuine actor-addressable chooser with a frozen candidate set',
    closeOwed: 'grade a chosen instrument against the supply effect it achieved on the target web, which no close records today',
  }),
  fork({
    forkId: 'HBF-32', module: 'src/domain/region/contestOverThirdParty',
    symbol: 'contestOverThirdParty', discovery: 'idiom', disposition: 'DEFER',
    reason: '⭐⭐ FOUND BY THE ROOT-SET SELF-ASSERTION ON ITS FIRST RUN, and the widening is itself the finding. A softmax over logits with a keyed tiebreak — two idiom signatures in one symbol, so it is unambiguously a weighted chooser. Its directory sat OUTSIDE the three scan roots the volume declared, exactly the failure the root-set arm exists to catch: a totality walker whose roots miss a whole domain directory does not report a gap, it reports SUCCESS. ⚠ It is the same fork the TRADE-partnerships row names as its second half, so the checklist had seen it while the idiom scan could not',
    closeOwed: 'grade a contest entry against the contest FLIP, which is the same close the trade-partnership row owes; the two rows close together or not at all',
  }),
  fork({
    forkId: 'HBF-33', module: 'src/domain/worldPulse/informationNews',
    symbol: 'informationReceipt', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race over receipt prose pools in the INFORMATION registry, and it is HBF-07\'s TWIN rather than merely its lookalike. IN-1c-a mints the estate\'s fifth phrased-kind registry family, and this leaf\'s own source comment records the pick as THE KEYED PICK, copied from grammarNews.js, cured for the same recorded reason; it matches the identical KEYED_RACE signature (hash01) that discovered HBF-07. ⭐ It therefore takes HBF-07\'s disposition rather than a fresh reading: a prose pick is very likely NOT a decision fork, but that is a reading rather than a measurement, and this wave does not make it either. ⚠ Filing STAY here on the strength of the pool being annex-verbatim would rule, for INFORMATION alone, the exact question HBF-07 left open for GRAMMAR',
    closeOwed: 'establish whether a receipt pool pick is a decision at all; if it selects prose rather than an act, this row becomes STAY, and no habit load may ever tilt what the world SAYS about an act it did not choose. ⚠ This is HBF-07\'s question over grammarReceipt, word for word, so the two rows close TOGETHER or not at all: one answer about prose picks cannot be true for GRAMMAR and false for INFORMATION',
  }),
  fork({
    forkId: 'HBF-34', module: 'src/domain/worldPulse/faithNews',
    symbol: 'faithLine', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race over receipt prose pools in the FAITH registry — the THIRD member of the HBF-07 / HBF-33 prose-pick family and not a fresh reading of the same question. WF-8a mints the estate\'s sixth phrased-kind registry family, and this leaf\'s own source comment records the pick as the cured hash01 spelling copied VERBATIM from informationNews.js, which copied it from grammarNews.js; it matches the identical KEYED_RACE signature that discovered both. ⚠ Filing STAY on the strength of the pool being annex-verbatim would rule, for FAITH alone, the exact question HBF-07 left open for GRAMMAR and HBF-33 left open for INFORMATION — and the registry\'s own header rules that a permanent ruling must be SETTLED rather than pending. ⭐ The family reading is now THREE rows wide, which is itself an argument for closing it: the same pick, in the same spelling, is the whole of the divergence CR-IN1C-DRIFT tracks',
    closeOwed: 'establish whether a receipt pool pick is a decision at all; if it selects prose rather than an act, this row becomes STAY, and no habit load may ever tilt what the world SAYS about an act it did not choose. ⚠ This is HBF-07\'s question over grammarReceipt and HBF-33\'s over informationReceipt, word for word, so ALL THREE rows close together or not at all: one answer about prose picks cannot be true for GRAMMAR and INFORMATION and false for FAITH',
  }),
  fork({
    forkId: 'HBF-35', module: 'src/domain/worldPulse/operations/missionDispatcher',
    symbol: 'dispatchMissionCandidates', discovery: 'idiom', disposition: 'STAY',
    reason: 'a keyed race inside the deliberation road\'s per-tick CAP CUT, and it is READ rather than deferred because the site is legible at its load point — which is what the defer rows above all say they lack. ⛔ STAY-DETERMINISTIC, PERMANENTLY, on a MEASURED absence of any preference dimension: the roll is `hash01(principalId, tick, demandId)` over survivors ALREADY canonically ordered by `compareCodepoint` on a rename-stable id, it is UNWEIGHTED (nothing about a demand enters it but its identity), and it exists solely so the CUT is unbiased by alphabet — the module\'s own header rules it "a TIEBREAK over an already-canonical order" that "means nothing outside this module", and deliberately routes every measured quantity (the confidence GAP, the court\'s doctrine cadence) AWAY from the roll into `severity`/`probability` so no downstream collector can mistake a hash for a judgement. ⭐ THE CANDIDATE SET IS REAL AND THE ACTION VOCABULARY IS ONE MEMBER: whether to act at all was already answered per demand by the espionage math leaf\'s `deliberationRead` (HBF-31, itself measured STAY with zero weighted arms), and every survivor then receives the IDENTICAL act — `applyMode: \'proposal\'`, always. So the only dimension a habit load could tilt is WHICH SUBJECT a court watches, which is a preference over identities rather than over acts, and a court that learned whom to spy on is precisely the autonomous per-tick dispatcher ES-7 was refused for — the refusal this module cites as load-bearing in its own first paragraph. ⚠ SAID OUT LOUD so the ruling can be vetoed on what it actually claims: there IS a gradeable outcome here (did a dispatched mission return its confirmation), so this is not "nothing to grade" — it is that the thing the grade would tilt is forbidden ground, which is HBF-22\'s victim-pick reading one layer up',
  }),
  // ── ROWS THAT ARE BOTH SIGNATURE-DISCOVERED AND OWNER-NAMED ───────────────────
  // ⭐ NOTE (FP GR-6, 2026-09-24): the deploy this anchor draws deposits the march ORDER the one
  // war opener consumes at its CONQUEST_MARGIN soft gate (warDeployment.js step 4). Under
  // `mediationGeneralizedEnabled`, a cross-pressured broker standing between the pair SCALES that
  // soft gate (mediationPressure.js :: mediationPressureFor, a bounded multiplier) — a pressure on
  // the draw's consequence, never a new draw and never a pin: the row's disposition, arity and
  // vocabulary are unmoved, and no fork is minted.
  fork({
    forkId: 'HBF-17', module: 'src/domain/worldPulse/settlementStrategy',
    symbol: 'evaluateSettlementStrategyRules', discovery: 'idiom', disposition: 'DEFER',
    domain: 'STRATEGY', arity: 'per-action', actionVocabulary: 'STRATEGY_MOVES',
    reason: 'THE ANCHOR — a softmax over the eleven emitted moves, then a seeded sample. ⭐ ARITY IS PER-ACTION, MEASURED: both emission paths are keyed on the deploy token, and the optional counterpart is emitted on that move ALONE, so ten of eleven moves are monadic at the load point. A flat dyadic reading is the instruction an implementer follows to bind a counterpart on a move that has none',
    closeOwed: 'the carried war episode key closes this site unconditionally on one move and conditionally on a second; the other nine carry no close, so the row defers until the coverage table lands',
  }),
  fork({
    forkId: 'HBF-18', module: 'src/domain/worldPulse/supplyWebWarfare',
    symbol: 'declareTradeEmbargo', discovery: 'idiom', disposition: 'DEFER',
    domain: 'TRADE',
    reason: '⭐ THE VERIFY-AT-BUILD IS DISCHARGED HERE. The named-domain row asked whether the embargo declaration is a guard chain (STAY) or a weighted posture fork (a learning candidate) and did not measure it. MEASURED at this wave: the declaration carries an inline extremum over a COMPUTED COST array, so it is a weighted fork rather than a guard chain, and the STAY reading is refused on evidence',
    closeOwed: 'an embargo is a posture with a counterpart, so it is dyadic if it joins at all; the close would be the embargo\'s own lift-or-hold outcome, which does not exist today',
  }),
  // ── THE OWNER'S NAMED-DOMAIN CHECKLIST — the declared blind spot's instrument ──
  fork({
    forkId: 'HBF-19', module: 'src/domain/worldPulse/tradeWar',
    symbol: 'evaluateTradeWar', discovery: 'checklist', disposition: 'DEFER',
    domain: 'TRADE',
    reason: 'TRADE — partnerships. A softmax over LOGITS through the third-party contest, together with the commercial partnership family. ⚠ The logit idiom is why the per-idiom application law exists: a multiplicand on a logit scales log-odds, not probability',
    closeOwed: 'the contested-trade class closes on the contest FLIP, and the close is not wired',
  }),
  fork({
    forkId: 'HBF-20', module: 'src/domain/spatial/dispatchEV',
    symbol: 'dispatchDecision', discovery: 'checklist', disposition: 'DEFER',
    domain: 'TRADE',
    reason: 'TRADE — caravan routing. A go/no-go expected-value threshold, paired with the route argmin recorded separately. ⚠⚠ THE TRUTH/BELIEF ASYMMETRY, recorded before any wave touches it: the caravan decides WHETHER on BELIEF and WHICH WAY on TRUTH, so any claim that habit is always belief-routed is false at this site',
    closeOwed: 'grade a dispatch against arrival versus loss on the road it took',
  }),
  fork({
    forkId: 'HBF-21', module: 'src/domain/worldPulse/traditionsKernel',
    symbol: 'successScore', discovery: 'checklist', disposition: 'STAY',
    domain: 'FAITH',
    reason: 'FAITH — the observance. ⛔ NOT A SELECTION, and the ruling is permanent rather than deferred: it assembles the score ONE draw is tested against, with no candidate set and no action vocabulary. A load here would make an observance more likely to SUCCEED because past observances succeeded — reinforcement of OUTCOMES, not of a chosen action, which is a different mechanism from the one this program was asked for',
  }),
  fork({
    forkId: 'HBF-22', module: 'src/domain/traditions/relations',
    symbol: 'applyImposition', discovery: 'checklist', disposition: 'DEFER',
    domain: 'FAITH',
    reason: 'FAITH — the imposition, and THE TRUE FORK the earlier rounds missed. A Bernoulli chance gate on a bounded scalar plus a victim index pick. ⭐ A bounded multiplicand can carry the probability WITHOUT adding a draw, because the gate takes one roll and compares. ⛔ The VICTIM pick is an IDENTITY choice and is forbidden ground. ⚠⚠ THIS ROW IS WHY THE WALKER\'S SCAN ROOTS WIDENED: its directory was outside them, so the estate\'s faith fork was invisible to the totality instrument',
    closeOwed: 'grade the imposed rite\'s survival to liberation against its restoration, keyed to the overlord\'s decision to impose',
  }),
  fork({
    forkId: 'HBF-23', module: 'src/domain/worldPulse/piety',
    symbol: null, discovery: 'checklist', disposition: 'DEFER',
    domain: 'FAITH',
    reason: 'FAITH — patrons and clergy. ⚠ THE ROW CARRIES NO SYMBOL AND THAT IS THE MEASUREMENT: the charter names the patron-adoption and clergy forks as a family and identifies no fork by symbol, and this wave did not find one it could name honestly. The module recorded is where the family\'s state lives, not a measured chooser',
    closeOwed: 'name the patron-adoption fork by symbol, then grade a patron\'s adoption by the devotion band\'s own movement over the adoption horizon',
  }),
  fork({
    forkId: 'HBF-24', module: 'src/domain/worldPulse/routeNetworkCharter',
    symbol: 'evaluateCorridorCharter', discovery: 'checklist', disposition: 'DEFER',
    domain: 'ROUTE CREATION',
    reason: 'ROUTE CREATION — the charter half, and it is THE DECLARED BLIND SPOT: an if/else threshold ladder over a real score, invisible to the idiom sweep by construction. ⭐ THE EXPLICIT CALL: keep the ladder, load the SCORE before the bar comparison — that adds no draw, mints no vocabulary and preserves determinism. ⛔ What stays refused is a different thing: converting the ladder into a WEIGHTED DRAW. ⚠ A scored bar is a preference expressed as a threshold, and the legality-guard protection does not reach it',
    closeOwed: 'grade corridor survival against retirement, keyed to the chartering verdict',
  }),
  fork({
    forkId: 'HBF-25', module: 'src/domain/worldPulse/routeNetworkGenesis',
    symbol: 'deriveGenesisRouteEdges', discovery: 'checklist', disposition: 'STAY',
    domain: 'ROUTE CREATION',
    reason: 'ROUTE CREATION — the genesis half. ⛔ STAY-DETERMINISTIC, PERMANENTLY, and recorded as STAY rather than deferred because the ruling is settled rather than pending: a world\'s founding road graph is part of what a SEED IS. A habit tilt there would make the map itself depend on lived history, which is a different and much larger promise than the one this program makes',
  }),
  fork({
    forkId: 'HBF-26', module: 'src/domain/spatial/embattlement',
    symbol: 'chooseRoute', discovery: 'checklist', disposition: 'DEFER',
    domain: 'ROUTE CHOICE',
    reason: 'ROUTE CHOICE — a strict argmin over an effective cost, tie-broken by path, with four live callers. ⚠ Exactly the fork the checklist predicted would be invisible: the cost is computed in a helper the signature scan cannot follow, so it is discovered HERE and not by idiom. ⭐ THE EXPLICIT CALL: keep the argmin, apply the load as a DIVISOR on the cost — converting it to a weighted draw would add a draw to four callers',
    closeOwed: 'grade arrival against loss on the chosen path',
  }),
  fork({
    forkId: 'HBF-27', module: 'src/domain/worldPulse/applyWorldPulseRelationshipGraph',
    symbol: 'relationshipOutcomeDisposition', discovery: 'checklist', disposition: 'DEFER',
    domain: 'INTER-SETTLEMENT DYNAMICS',
    reason: 'INTER-SETTLEMENT DYNAMICS — measured as drift and label rules rather than choosers. A CHOOSER MUST BE IDENTIFIED BEFORE IT CAN LEARN: these map an outcome to a label, and nothing chooses',
    closeOwed: 'identify the fork that SETS a relationship posture deliberately — if there is none, this row becomes STAY with that finding as its reason',
  }),
  fork({
    forkId: 'HBF-28', module: 'src/domain/worldPulse/npcLadderGoals',
    symbol: 'mintGoal', discovery: 'checklist', disposition: 'DEFER',
    domain: 'GOALS', arity: 'monadic',
    reason: 'GOALS — selection. ⭐ The estate\'s ONLY existing open-to-graded-close loop keyed to an individual actor AND an action: copy it, do not rival it. ⚠ THIS SYMBOL CARRIES TWO ROWS, one per owner-named domain, and both must agree on disposition and arity or the uniqueness arms red',
    closeOwed: 'grade a minted goal against the progress it reached from its own stored mint baseline',
  }),
  fork({
    forkId: 'HBF-29', module: 'src/domain/worldPulse/npcLadderGoals',
    symbol: 'evaluateGoal', discovery: 'checklist', disposition: 'DEFER',
    domain: 'GOALS',
    reason: 'GOALS — persistence versus abandonment. Evaluation rather than selection: it returns a progress reading and an honest null when the premise lapsed, and the abandonment DECISION lives in the ladder kernel rather than this leaf',
    closeOwed: 'grade an abandonment against the progress the goal had made when it was dropped',
  }),
  fork({
    forkId: 'HBF-30', module: 'src/domain/worldPulse/npcLadderGoals',
    symbol: 'mintGoal', discovery: 'checklist', disposition: 'DEFER',
    domain: 'GOAL ORIENTATION', arity: 'monadic',
    reason: 'GOAL ORIENTATION — which ambition KINDS pay off, the personality-forming loop the owner named. It is the goal-kind AXIS of the same symbol as the selection row, graded through the ladder\'s existing progress read, which already weights credit by office and domain. ⚠ The continuous grade must be BANDED by frozen edges before it enters the curve — a float grade would be a second scale',
    closeOwed: 'grade a goal KIND against the progress goals of that kind reached, banded rather than carried as a float',
  }),
  // ── ENC-1: THE CHANCE-MEETING LEAF'S SIX ARMS ─────────────────────────────────
  // Six symbols rather than one draw helper, because this registry holds one disposition
  // per symbol: routing six questions through a shared helper would file four deferrals as
  // whatever the helper was dispositioned as. ⛔ THE LEAF IS DARK AT THIS COMMIT — nothing
  // under src/ imports it (the stage is ENC-3, and every writer it would feed sits behind
  // an unruled owner row), so each arrival is a SOURCE FACT and not yet a behaviour.
  fork({
    forkId: 'HBF-36', module: 'src/domain/worldPulse/envoyChanceMeeting',
    symbol: 'drawMeet', discovery: 'idiom', disposition: 'STAY',
    reason: 'the coincidence gate: whether two people already standing in the same place on the same tick notice each other at all. ⛔ STAY-DETERMINISTIC on a MEASURED absence of a candidate set: there is no second act to choose, and neither party selects. The rung it is compared against carries weighted terms (the courts posture, the travellers covert craft) but those are CIRCUMSTANCES OF THE WORLD rather than preferences of an actor, and the only thing a habit load could teach here is to bump into strangers more often, which is a rate and not a choice. The ENCOUNTERS design rules it the same way at its Car 1 line, and this row records the reading rather than inheriting it',
  }),
  fork({
    forkId: 'HBF-37', module: 'src/domain/worldPulse/envoyChanceMeeting',
    symbol: 'drawPick', discovery: 'idiom', disposition: 'STAY',
    reason: 'which of the eligible residents the traveller happens upon. ⛔ STAY-DETERMINISTIC, and it is HBF-35 verbatim one family over: the draw is UNWEIGHTED (nothing about a resident enters it: only the list length and the meeting key) over a list ALREADY canonically ordered by codepoint on a rename-stable id, and it exists solely so the pick is unbiased by alphabet. ⭐ The one dimension a habit load could tilt is WHICH PERSON a traveller meets, a preference over identities rather than over acts, which HBF-35 and HBF-22 both rule forbidden ground. ⚠ SAID OUT LOUD: the seed IS threaded into this key on purpose, so the pick is not stable across campaigns that share an errand episode; that is a determinism requirement, not a preference',
  }),
  fork({
    forkId: 'HBF-38', module: 'src/domain/worldPulse/envoyChanceMeeting',
    symbol: 'drawApproach', discovery: 'idiom', disposition: 'DEFER',
    reason: 'whether an approacher makes an offer at all. Unlike the two rows above this is genuinely actor-addressable and genuinely weighted, since the rung reads how far the target stands from his own court and whether the approacher is covert, so the STAY reading is refused on evidence rather than deferred for want of a reading',
    closeOwed: 'grade an approach against what it produced: a lean the web converted, a refusal, or a refusal that was spoken of. All three are already typed outcomes of the same receipt, so the close exists the moment the stage that emits it lands',
  }),
  fork({
    forkId: 'HBF-39', module: 'src/domain/worldPulse/envoyChanceMeeting',
    symbol: 'drawMark', discovery: 'idiom', disposition: 'DEFER',
    reason: 'which mark a meeting leaves, drawn against a cumulative ladder over a four-member vocabulary (bond, respect, rivalry, nothing) weighted by how alike the two people read and by the posture between their courts. This is the clearest weighted chooser in the leaf and the one with a real action vocabulary',
    closeOwed: 'grade a minted mark against whether it survived its own decay without being renewed, which the ladder record already carries; the mark and its half-life are one another\u2019s close',
  }),
  fork({
    forkId: 'HBF-40', module: 'src/domain/worldPulse/envoyChanceMeeting',
    symbol: 'drawCompromise', discovery: 'idiom', disposition: 'DEFER',
    reason: 'the targets own will against an offer, drawn against a chance composed from three weighted terms in the owners own order. Whether a mans will resolving is a CHOOSER or a CONTEST is exactly the question HBF-08 leaves open for the ladder challenge, and one answer cannot be true there and false here',
    closeOwed: 'grade a yielded will against whether the leash the web minted from it ever produced anything, and a refused one against whether the refusal was found out; ⚠ this row closes with HBF-08 or not at all, because both ask whether a will resolving is a choice',
  }),
  fork({
    forkId: 'HBF-41', module: 'src/domain/worldPulse/envoyChanceMeeting',
    symbol: 'drawExposure', discovery: 'idiom', disposition: 'DEFER',
    reason: 'whether a refused approach is spoken of, drawn against a rung the host courts own wariness weights. The actor here is the watching court rather than either party to the meeting, which is a third shape neither of the two STAY rows above covers and which this lane has not read at its load point',
    closeOwed: 'grade an exposure against the grievance it actually moved on the two courts edge, which the relationship plane already records; establish first whether a court WATCHING is an act it chooses or a property it has',
  }),
  fork({
    forkId: 'HBF-42', module: 'src/domain/worldPulse/envoyChanceMeetingNews',
    symbol: 'chanceMeetingLine', discovery: 'idiom', disposition: 'DEFER',
    reason: 'a keyed race over receipt prose pools in the CHANCE_MEETING registry, and it is the FOURTH member of the HBF-07 / HBF-33 / HBF-34 prose-pick family and not a fresh reading of the same question. ENC-4 mints the estate\'s seventh phrased-kind registry family, and this leaf\'s own source comment records the pick as the cured hash01 spelling copied VERBATIM from faithNews.js, which copied it from informationNews.js, which copied it from grammarNews.js; it matches the identical KEYED_RACE signature that discovered all three. ⚠ Filing STAY on the strength of the pool being annex-verbatim would rule, for CHANCE_MEETING alone, the exact question HBF-07 left open for GRAMMAR, HBF-33 for INFORMATION and HBF-34 for FAITH, and the registry\'s own header rules that a permanent ruling must be SETTLED rather than pending. ⭐ The family reading is now FOUR rows wide across four waves, which is a stronger argument than ever for closing it: one question, one spelling, four registries, and CR-IN1C-DRIFT tracks exactly this divergence',
    closeOwed: 'establish whether a receipt pool pick is a decision at all; if it selects prose rather than an act, this row becomes STAY, and no habit load may ever tilt what the world SAYS about an act it did not choose. ⚠ This is HBF-07\'s question over grammarReceipt, HBF-33\'s over informationReceipt and HBF-34\'s over faithLine, word for word, so ALL FOUR rows close together or not at all: one answer about prose picks cannot be true for GRAMMAR, INFORMATION and FAITH and false for CHANCE_MEETING',
  }),
  // ── THE FOURTH IDIOM: THE EXPLICIT GUARD-CHAIN REGISTER ───────────────────────
  fork({
    forkId: 'HBF-31', module: 'src/domain/worldPulse/espionage/espionageMath',
    symbol: 'deliberationRead', discovery: 'guard-chain', disposition: 'STAY',
    reason: 'THE GUARD-CHAIN REGISTER\'S ONE MEMBER. MEASURED: a chain of early returns with ZERO weighted arms, so it is not a fork at all — a site that answers zero on all four idioms is not a chooser, whatever a seam sentence says about it. ⚠ IT IS RECORDED RATHER THAN OMITTED because it was carried as a learning site in one table while two others already ruled it deterministic: one symbol, three rows, two answers, through two review rounds. A registry that permits that permits anything',
  }),
  // ── EM-E0: THE SIMULATION'S REGISTRATION — THE SURVEY'S FORTY-FOUR ────────────
  //
  // Design §19 ruling 1, over Table 4 "R" of
  // docs/implementation/surveys/SIM-SEALS-SURVEY-2026-09-19.md: every UNREGISTERED draw
  // symbol that survey ruled REGISTRATION OWED. They carry `discovery: 'checklist'`
  // because that is what they ARE — a HAND-MAINTAINED census taken over a WIDER idiom set
  // (the survey also censused `.random()`, which no signature here reads) and WIDER roots
  // (`src/domain/roads`, outside SCAN_ROOTS) — so not one of them is reachable by the four
  // signatures the walker runs, and filing them as `idiom` would convict the partition arm
  // in its phantom direction on all forty-four at once.
  //
  // ⭐ THEY CARRY NO `domain`, AND THAT ONE FACT IS THE PARTITION KEY. A checklist row WITH
  // an owner-named domain is the owner's named-domain instrument (fourteen rows, its own
  // totality assertion); a checklist row WITHOUT one is this registration. The walker
  // derives both populations from that fact rather than restating either roster, and the
  // registration's roster is asserted SET-EQUAL, both directions, against Table 4 parsed
  // out of the survey markdown itself — so a row invented here reds exactly as loudly as a
  // row the survey found and this file forgot.
  //
  // ⚠ `actionVocabulary` IS DECLARED ON FOUR ROWS AND NOT ONE MORE, AND THE THINNESS IS THE
  // MEASUREMENT. §16's "each with a typed outcome vocabulary" was wrong of the tree at one
  // of forty-two; it is wrong of these forty-four too. A vocabulary is declared only where a
  // constant EXPORTED BY THE DRAW'S OWN MODULE types that draw's own outcome or its typed
  // reading, and the walker resolves every one BY IMPORT rather than by name. Where the
  // outcome is a bare boolean, a scalar, an inline literal union, or a vocabulary living one
  // module over, the row names what it is instead and carries null: FINITE-SEMANTICS forbids
  // a seal with invented words, and ruling 1 rules such a fork MEASUREMENT OWED, never
  // pinnable. Two rows the design's own first seal cut names (the season, the event lottery)
  // land measurement-owed for exactly that reason, and say so.
  //
  // ⛔ NO BEHAVIOUR CHANGE, STRUCTURALLY. Nothing under `src` imports this file; the habit
  // family's reverse-import closure in tests/domain/habitCurve.test.js is that claim's
  // standing instrument, so these rows are a record and cannot move a byte of world output.
  fork({
    forkId: 'HBF-43', module: 'src/domain/roads/embassyHazard',
    symbol: 'evaluateEmbassyHazard', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-01 - the embassy interception race: an informed third-party hunter or a plain home enemy takes the embassy in transit BEFORE the target\'s own column can convert the encounter into a road parley. The outcome at the roll is a bare boolean; the venue words belong to the sibling disposition roll (HBF-44), and this module exports no constant at all',
    closeOwed: 'grade an interception against whether the suit was ever heard at the hall it was carried to; the disposition roll IS that close, so this row and HBF-44 close together or not at all',
  }),
  fork({
    forkId: 'HBF-44', module: 'src/domain/roads/embassyHazard',
    symbol: 'embassyDisposition', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-02 - the venue disposition roll: the captor rolls RECEIVED (the suit is heard), HOSTAGE (the standard ransom) or TURNED HOME, shifted by the insult and humility amplifier and never worse than hostage. ⚠ The three outcomes are INLINE LITERALS: this module exports no vocabulary, so none can be declared here without minting one, which is not this wave\'s to do',
    closeOwed: 'grade a disposition against what the suit produced at the hall it reached; a seal may not name words the tree does not type, so the venue vocabulary must become an export before this row can carry one',
  }),
  fork({
    forkId: 'HBF-45', module: 'src/domain/roads/seaRoads',
    symbol: 'resolveSeaHazard', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-03 - the sea-hazard branch, FOUR draws in one symbol: the blockade capture gate, the storm incidence, the storm delay length, and the piracy gate, at most one resolution per tick under the no-double-jeopardy law. ⚠ The storm pair in particular looks like a RATE rather than a choice, and this wave does not make that reading',
    closeOwed: 'establish, per modality, whether a hazard gate chooses anything or the world resolves a hazard against a traveller who selects nothing; a rate takes STAY with that finding, and only the rest can be graded against the cargo that arrived',
  }),
  fork({
    forkId: 'HBF-46', module: 'src/domain/roads/thirdPartyRansom',
    symbol: 'resolveThirdPartyRansom', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-04 - the third-party checkpoint, called once per ransom at half-term: a refusal roll over the highest-EV payer, then an outcome fork between a COMPROMISED payer and a debt. ⚠ The outcome words and the payer motives are inline literals; the module exports only its tuning',
    closeOwed: 'grade a compromised payer against whether the leverage it minted ever produced anything for the party that holds it - HBF-40\'s question over a yielded will, word for word, so the two close together',
  }),
  fork({
    forkId: 'HBF-47', module: 'src/domain/spatial/armyTransit',
    symbol: 'resolveFieldBattle', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-05 - the field battle roll against the favourite\'s probability, over a stable composite key; the outcome is which army holds the field, plus bounded attrition scaled by how decisive the engagement was. ⚠ MEASURED AT THIS WAVE: the survey\'s Table-1 landing quotes ARMY_ENVOY_INTENT_KINDS in its outcome column and that is a DIFFERENT fork\'s vocabulary (the intent an envoy carries on a transiting column). The battle roll types nothing of its own',
    closeOwed: 'grade a committed engagement against the ground it held and the strength it kept; establish first whether an army CHOOSES to give battle at this site or is already committed by the time the roll fires',
  }),
  fork({
    forkId: 'HBF-48', module: 'src/domain/spatial/calamity',
    symbol: 'draw', discovery: 'checklist', disposition: 'STAY',
    reason: 'SURVEY U-06 - ⛔ NOT A FORK, MEASURED: `draw` is this module\'s local rng READER, five lines that clamp one uniform and return 1 when no rng is threaded. It has no actor, no candidate set and no outcome; every preference it ever expresses belongs to the caller that compares it. It is the same class as the four idiom DEFINITIONS in region/contestMath.js that the survey excluded BY NAME, and it reached Table 4 only because the `.random()` idiom carries no declares-its-own-helper rule the way the three named helpers do. ⚠ RECORDED RATHER THAN OMITTED, on HBF-31\'s precedent: a totality roster does not get to drop a row it measured, and the next census must meet the FINDING rather than the site',
  }),
  fork({
    forkId: 'HBF-49', module: 'src/domain/spatial/commodityFlow',
    symbol: 'advanceCommodityFlow', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-07 - one draw inside the flow advance (produce, arrive, consume, dispatch, starve), which the survey reads as whether the cargo arrives. Whether it selects an ACTION or splits a carried quantity has not been read at the load point',
    closeOwed: 'identify what the flow draw is graded against - arrival versus loss on the leg it took - and establish whether any actor selects here at all; a pure split takes STAY with that finding',
  }),
  fork({
    forkId: 'HBF-50', module: 'src/domain/spatial/embattlement',
    symbol: 'banditryLoss', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-08 - a seeded, sporadic, BOUNDED banditry loss on a trade channel through embattled ground: a fire gate, then a bounded loss fraction. ⚠ The outcome of the second draw is a NUMBER and not a member of any vocabulary. It is the draw a DM actually wants on a caravan, and it is a different symbol from the registered `chooseRoute` in the same file (HBF-26)',
    closeOwed: 'grade a taken caravan against whether the shipment ever arrived, which the commodity ledger already records; the loss fraction may be a rate rather than a choice, and that reading is owed first',
  }),
  fork({
    forkId: 'HBF-51', module: 'src/domain/spatial/generosityEV',
    symbol: 'loadedDraw', discovery: 'checklist', disposition: 'STAY',
    reason: 'SURVEY U-09 - ⛔ NOT A FORK, MEASURED: the module documents this as a PRIMITIVE, and its own header rules that the weights come FIRST from state and that the fork only picks within what the world has already made probable. It carries no subject, no candidate set of its own and no outcome vocabulary; every preference it expresses was built by its caller. It is the exported twin of the weighted-sample helper one directory over that the walker excludes by its declares-its-own-idiom rule. ⚠ RECORDED RATHER THAN OMITTED on HBF-31\'s precedent, and its CALLERS remain registrable in their own right',
  }),
  fork({
    forkId: 'HBF-52', module: 'src/domain/spatial/generosityEV',
    symbol: 'shouldInitiateAsk', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-10 - the significance gate: does a relief ASK fire at all this tick, a situation-loaded bernoulli whose rarity baseline is ramped by pressure squared. ⭐ Genuinely actor-addressable and genuinely weighted, so the STAY reading is refused on evidence rather than deferred for want of one. ⚠ It is EXACTLY the bernoulli gate this registry\'s header names as undiscoverable by any signature, which is why it arrives on the hand-maintained half',
    closeOwed: 'grade an ask against what it produced - the module\'s own lending verdicts already type the three answers - and against what asking cost the asker in standing when it was refused',
  }),
  fork({
    forkId: 'HBF-53', module: 'src/domain/spatial/intelActs',
    symbol: 'intelEligible', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-11 - the TICK-INVARIANT yearly eligibility draw, forked on the canonical pair and the YEAR rather than the tick, so a collapsed catch-up can never shift which pairs trade. The outcome is a bare boolean',
    closeOwed: 'establish whether an eligibility draw chooses anything or merely sets a cadence; a cadence takes STAY, and only if it is a choice can a pair be graded against what the trade between them produced',
  }),
  fork({
    forkId: 'HBF-54', module: 'src/domain/spatial/migration',
    symbol: 'splitTravellers', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-12 - the SCATTER weights in the split across scored destinations: a per-destination noise term blended with the score-weighted share, under a scatter floor that stops the top destination taking everything. ⚠ MEASURED: the survey\'s Table-1 landing quotes COLUMN_CLASSES, which types the COLUMN and not the destination - a different axis from the one this draw moves',
    closeOwed: 'grade a column\'s destination against whether it was taken in and survived there; establish first whether the scatter term is a preference at all, or the deliberate score-blind brake its own header calls it',
  }),
  fork({
    forkId: 'HBF-55', module: 'src/domain/spatial/navalLayer',
    symbol: 'blockadeRunRoll', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-13 - a lone runner\'s chance to slip a blockade, driven DOWN by the blockading fleet\'s strength so a strong fleet is near-zero and no fleet is the base chance. The outcome is a bare boolean pair with no typed words behind it',
    closeOwed: 'grade a run against the cargo that actually arrived, which the commodity and naval transit ledgers already carry between them',
  }),
  fork({
    forkId: 'HBF-56', module: 'src/domain/spatial/pestilence',
    symbol: 'armyContraction', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-14 - the seeded army CONTRACTION roll at a plagued settlement; a contracting army also becomes a VECTOR, and the caller seeds the next stop from it. Whether an actor chooses anything here has not been read at the site',
    closeOwed: 'establish whether an army selects at this site or the world resolves a hazard against it; if it is a hazard this row becomes STAY with that finding, and only otherwise can it be graded against the front the host reached',
  }),
  fork({
    forkId: 'HBF-57', module: 'src/domain/spatial/pestilence',
    symbol: 'advancePestilence', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-15 - the epidemic ledger advance, TWO draws: the propagation gate along carrier edges and the clearance gate at a node. The same question HBF-56 asks one layer down, and one answer cannot be true for the army and false for the front',
    closeOwed: 'establish whether propagation is chosen by anyone at all; a spread rate takes STAY, and if a court\'s own guard choices gate it, grade those against the front they actually held. It closes with HBF-56 or not at all',
  }),
  fork({
    forkId: 'HBF-58', module: 'src/domain/spatial/rumorNetwork',
    symbol: 'degradeTelling', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-16 - the organic per-hop weathering roll in Unreliable mode: a distribution with tails over completeness and accuracy, forked per event, carrier, edge and hop rather than per settlement so cross-confirmation independence survives. ⛔ It sits in the OBSERVATION-NOISE family that design §19 ruling 4 rules never a DM act: a pin decides what an observer happened to perceive while the provenance still reads observed',
    closeOwed: 'establish whether a weathering hop is a chosen act at all before any close is written. ⚠ If it is not, this row becomes STAY; and if it is, it is the noise on an observation, which ruling 4 already rules dishonest to pin',
  }),
  fork({
    forkId: 'HBF-59', module: 'src/domain/worldPulse/calamityKernel',
    symbol: 'resolveStrikeOnSettlement', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-17 - the strike-COUNT draw: one uniform scaled by the tier\'s strike cap, on the single path the organic annual draw and the BUILT force-calamity verb both run. ⚠ The outcome is an integer count, not a member of any vocabulary, and the calamity reason words the survey quotes live in eventProse.js one module over',
    closeOwed: 'grade a strike count against the bounded loss it actually caused, which the same return already carries; establish first whether a count is a choice or a severity',
  }),
  fork({
    forkId: 'HBF-60', module: 'src/domain/worldPulse/candidateEvents',
    symbol: 'candidateRoll', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-18 - THE EVENT LOTTERY\'S per-candidate keyed roll, forked on the candidate\'s own stable key so a pin is already addressable. ⭐ The COMPARISON lives in `rollCandidates` one declaration below, so the roll alone types nothing; the vocabulary the survey quotes is every candidate\'s own type, which is the forty-one-type affordance catalogue in another module. ⚠ Design §19 ruling 3 lists this fork in the first seal cut; under ruling 1 it is MEASUREMENT OWED, because one key covers the whole catalogue and no single vocabulary of this module describes it',
    closeOwed: 'grade a landed candidate against what the world then did with it, and put to the chair whether the graded unit is the candidate or its whole family - one key covering the entire catalogue is a different learning problem from one fork',
  }),
  fork({
    forkId: 'HBF-61', module: 'src/domain/worldPulse/causeLifecycle',
    symbol: 'pickPath', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-19 - the weighted seeded pick among the three lifecycle paths, which this module\'s own comment types as reform, recause or historicize. ⚠ Those three are INLINE LITERALS in a doc line; the module exports only its tuning, and the fourteen typed cause classes the survey quotes live in causeVocabulary.js one module over',
    closeOwed: 'grade a chosen path against whether the decline it explained actually lifted, which the lifecycle ledger already follows to its end',
  }),
  fork({
    forkId: 'HBF-62', module: 'src/domain/worldPulse/causeLifecycle',
    symbol: 'pickCoherentCause', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-20 - the seeded TIE-BREAK among equally role-coherent causes. ⚠ Very likely a determinism device rather than a preference, which is HBF-11\'s question over the ladder tiebreak word for word, and the site has not been read for whether the tie is ever non-trivial',
    closeOwed: 'establish whether the tiebreak expresses a preference; if it exists only to make an exact tie deterministic this row becomes STAY, and a load there would be a thumb on a coin. It closes with HBF-11 or not at all',
  }),
  fork({
    forkId: 'HBF-63', module: 'src/domain/worldPulse/convergence',
    symbol: 'advanceIntervention', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-21 - the loaded-dice INITIATION gate: whether a neighbour\'s best motive converts into a committed intervention this tick, or a visible deferral. ⚠ MEASURED AT THIS WAVE: none of this module\'s three exported vocabularies belongs to this draw. The motive is chosen by a deterministic argmax over scores, the engagement move by a deterministic highest-EV pick, and the intervention state is an aftermath stamp a later pass writes',
    closeOwed: 'grade a committed intervention against whether the contest it entered went the way it was entered for, which the coup verdict already resolves and already reads back',
  }),
  fork({
    forkId: 'HBF-64', module: 'src/domain/worldPulse/corruptionImpair',
    symbol: 'advanceInstitutionReform', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-22 - the reform roll for every corruption-impaired institution in a settlement, forked per institution name so the order of the roster cannot change which halls clean themselves. The outcome is reformed or not',
    closeOwed: 'grade a reform against whether the impairment stayed lifted, which the institution record already carries as a dated status',
  }),
  fork({
    forkId: 'HBF-65', module: 'src/domain/worldPulse/corruptionWeb',
    symbol: 'advanceCorruptionWeb', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-23 - the tempo rarity gate on the recruitment weight: whether a patron court mints ONE new covert asset this tick, behind a stack of channel, scarcity and affordability guards that each produce a visible deferral instead of a silence',
    closeOwed: 'grade a minted asset against what it ever produced for its patron before the leash ended; HBF-66 is the other end of the same record, so the two close together',
  }),
  fork({
    forkId: 'HBF-66', module: 'src/domain/worldPulse/corruptionWeb',
    symbol: 'advanceWilledLeashEnds', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-24 - the two typed ENDS of a willed leash, a pass that exists because the organic exposure lane is the only thing that ever ends one and a willed man is taken out of that lane by construction',
    closeOwed: 'grade an ended leash against which typed end it took and whether the court that willed it got anything for the hold; it closes with HBF-65 or not at all, because a mint and its end are one record',
  }),
  fork({
    forkId: 'HBF-67', module: 'src/domain/worldPulse/deityStanceLane',
    symbol: 'evaluateDeityStanceLane', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-25 - the per-pair stance roll over the realm\'s deity-bearing related pairs, forked per pair and per tick. ⛔ DEITY DOCTRINE, ADDENDUM 15: THE FOLLOWERS ACT AND THE GOD DOES NOT, so anything this row becomes is worded about the two creeds\' PEOPLE and their settlement standing, never about a deity choosing anything',
    closeOwed: 'grade a hardened stance against what the two creeds\' people then did to one another, read off the relationship plane; a close worded about a deity is refused by doctrine before it is ever measured',
  }),
  fork({
    forkId: 'HBF-68', module: 'src/domain/worldPulse/demographicsKernel',
    symbol: 'advanceDemographics', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-26 - the kernel\'s own draw inside the per-settlement demographic step. Whether it selects an ACTION or resolves a rate has not been read, which is the question HBF-02 already leaves open for the plan advance',
    closeOwed: 'identify the graded outcome of a demographic step and whether it is a choice at all; it closes with HBF-02 or not at all, because one answer about this lane cannot be true for the plan and false for the kernel',
  }),
  fork({
    forkId: 'HBF-69', module: 'src/domain/worldPulse/deploymentReturn',
    symbol: 'deploymentReturnOutcomes', discovery: 'checklist', disposition: 'DEFER',
    actionVocabulary: 'RETURN_ODDS_WORDS',
    reason: 'SURVEY U-27 - the TWO homecoming rolls: whether a returning host throws off the occupation at its own gate, and whether it relieves the home siege, each against a strength-scaled success probability. ⭐ THE VOCABULARY IS DECLARED AND IT IS THE SIEGE ROW\'S SHAPE EXACTLY: this module types its own reading of that success probability and prints the word into BOTH receipts, which is what makes the words this fork\'s own rather than a neighbour\'s',
    closeOwed: 'grade a homecoming against whether the occupation or the siege stayed lifted; ⛔ a pin here must carry the odds word with it, or the receipt explains a draw that never happened (design §19 ruling 4)',
  }),
  fork({
    forkId: 'HBF-70', module: 'src/domain/worldPulse/factionCapture',
    symbol: 'advanceFactionCapture', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-28 - the guild\'s capture ladder, TWO draws: an advance roll and a recover roll against chances scored from corrupt rank, security and prosperity. It feeds the guild strength read directly, and the built expose and impose affordances are corrections rather than this organic fork',
    closeOwed: 'grade a capture against whether the hall stayed taken to the next exposure, which the capture-transition history already records with its dates',
  }),
  fork({
    forkId: 'HBF-71', module: 'src/domain/worldPulse/informationStatecraft',
    symbol: 'pickMouthpiece', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-32 - the seeded, importance-weighted draw over a settlement\'s notable roster for who says a bluff OUT LOUD, returning null when no eligible soul exists and the court then speaks anonymously. ⭐ The candidate set is PEOPLE, so the only dimension a load could tilt is WHICH PERSON a court puts forward, and HBF-22, HBF-35 and HBF-37 all rule an identity preference forbidden ground',
    closeOwed: 'establish FIRST whether an identity pick may ever carry a load at all here; only then grade a mouthpiece against whether the bluff held and what speaking cost them in credibility',
  }),
  fork({
    forkId: 'HBF-72', module: 'src/domain/worldPulse/informationStatecraft',
    symbol: 'processLies', discovery: 'checklist', disposition: 'DEFER',
    actionVocabulary: 'LIE_OUTCOMES',
    reason: 'SURVEY U-33 - the lie lifecycle\'s own gate across seed, propagate, corroborate, contradict, expose and blowback. ⚠ HOT FILE: the survey measures this module past fifteen hundred raw lines and design §19 already calls for a headroom measurement before the information ops touch it. ⭐ THE VOCABULARY IS DECLARED AT IN-2, AS THE PASS WIDENED TO AXIS-TYPED LIES: told, believed and caught are the three answers the ONE exposure law (infoLure.lieExposure) gives for every record, minted in infoLure.js beside that law and re-exported by informationStatecraft.js, the fork\'s own module, so the words resolve where the pass draws them',
    closeOwed: 'grade a planted lie against whether it was believed and whether it was caught, both of which are already typed outcomes of this same pass and need no second scale',
  }),
  fork({
    forkId: 'HBF-73', module: 'src/domain/worldPulse/informationStatecraft',
    symbol: 'processSecrecy', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-34 - the ENTER rarity gate on the hide postures: a concealment pressure built from paranoia and weakness before believed-hostile strength drives an enter and exit hysteresis with dwell, because paranoia is sticky',
    closeOwed: 'grade a secrecy posture against whether it kept the watcher out for as long as it was paid for; it closes with HBF-74 or not at all, because seeing and hiding are one counterplay',
  }),
  fork({
    forkId: 'HBF-74', module: 'src/domain/worldPulse/informationStatecraft',
    symbol: 'processSight', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-35 - TWO draws in the sight postures: the ENGAGE rarity gate on paid eyes, and the EXPOSURE roll against a hiding target at odds that rise with that target\'s secrecy. The survey calls this the fog of war and the cleanest lever the owner did not name',
    closeOwed: 'grade an engaged posture against what it actually saw, and an exposure against the blowback it drew on its watcher; it closes with HBF-73 or not at all',
  }),
  fork({
    forkId: 'HBF-75', module: 'src/domain/worldPulse/navalKernel',
    symbol: 'advanceNaval', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-36 - the naval layer\'s own gate inside the tick advance, which the survey reads as whether a blockade holds or lifts. The LIFT already has its written news and no DM reach at all, while the declare verb is built',
    closeOwed: 'grade a held blockade against whether the sea leg it closed stayed closed, which the naval transit ledger already carries hop by hop',
  }),
  fork({
    forkId: 'HBF-76', module: 'src/domain/worldPulse/npcAgency',
    symbol: 'advanceNpcCorruption', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-39 - THREE draws that are ONE lifecycle rather than three questions: onset for a clean eligible soul with a corruptible flaw, organic exposure of a corrupt one, and replacement at the bottom of the rank. ⚠ MEASURED: this module\'s exported action-family table is a per-family tuning and patch record, NOT these draws\' outcome vocabulary',
    closeOwed: 'grade an exposure against what it cost the exposed and what the guild gained, which the standing demotion and the cooled heat already record on the same pass',
  }),
  fork({
    forkId: 'HBF-77', module: 'src/domain/worldPulse/resourceDynamicsKernel',
    symbol: 'evaluateResourceDynamics', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-40 - the organic mover\'s own draw over the deplete and recover lane, riding the tier candidate lane and dormant to the same reference when its rule is absent. The built deplete and recover affordances are CORRECTIONS; this organic fork has no pin',
    closeOwed: 'grade a depletion against whether the seam ever came back, and a recovery against whether it held; both are one record read at two ends, so they close together',
  }),
  fork({
    forkId: 'HBF-78', module: 'src/domain/worldPulse/roadsKernel',
    symbol: 'weightedPick', discovery: 'checklist', disposition: 'STAY',
    reason: 'SURVEY U-41 - ⛔ NOT A FORK, MEASURED: a module-local, UNEXPORTED, generic weighted sample WITHOUT replacement over an input its own doc line declares already codepoint-stable. It walks a cumulative total and splices; it has no subject, no candidate set of its own and no outcome. Its callers choose, it counts. Same class as HBF-48 and HBF-51, and as the idiom definitions the walker excludes by rule. ⚠ RECORDED RATHER THAN OMITTED on HBF-31\'s precedent: the roster keeps the FINDING, never merely the site',
  }),
  fork({
    forkId: 'HBF-79', module: 'src/domain/worldPulse/roadsKernel',
    symbol: 'advanceLitRoads', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-42 - THE DENSEST UNREGISTERED CLUSTER IN THE ESTATE, NINE draws behind one symbol: the road hazard classes that decide hostage against robbed, delayed or trapped; the detention gate at a destination; the captive CONVERSION draw that returns a released traveller as somebody\'s creature; and the stay-length draws. ⚠ The six outcome words are INLINE LITERALS on the branch lines and this module exports no constant at all, so no vocabulary can be declared without minting one',
    closeOwed: 'grade a hazard outcome against what the traveller reached and what it cost, and the conversion draw against whether the corruption edge it minted ever produced anything. ⛔ Nine draws behind one symbol is not one question: whether this row SPLITS is the chair\'s before any of it can close',
  }),
  fork({
    forkId: 'HBF-80', module: 'src/domain/worldPulse/seasons',
    symbol: 'seasonalSeverityFor', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-43 - ONE uniform off a TICK-INVARIANT fork of the WORLD seed, so every week of the same year reads the same verdict and replay is exact. The survey calls it the cheapest high-value pin in the tree, and it shades the harvest, the festival score and the harvest-pressure peace reason alike. ⚠ The module\'s own comment types the return as drought, hard winter, bountiful or null, and those four are INLINE LITERALS: this module exports only its tuning. Design §19 ruling 3 lists this fork in the first seal cut; under ruling 1 it is MEASUREMENT OWED until the four words are a typed export, because a seal may not name words the tree does not type',
    closeOwed: 'grade a season against the harvest, the festival outcome and the peace pressure it shaded, all three of which already read it; the four words must become an export before this row can declare one',
  }),
  fork({
    forkId: 'HBF-81', module: 'src/domain/worldPulse/settlementLifecycleKernel',
    symbol: 'advanceSettlementLifecycle', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-45 - TWO draws: the satellite lane\'s own draw and the site draw handed down to a founding. ⛔ OWNER-GATED, and the gate is not this registry\'s to lift: this lane can END a settlement, and design §19 ruling 5 offers it only behind the built abandon and resettle verbs, never as a bare pin',
    closeOwed: 'grade a founding against whether the steading survived its own first decade, which the lifecycle record already dates. ⛔ The terminal-death arm takes NO close until the owner rules, because it destroys data',
  }),
  fork({
    forkId: 'HBF-82', module: 'src/domain/worldPulse/settlementPolitics',
    symbol: 'advanceSettlementPolitics', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-47 - TWO draws: the defection windows that fracture a bloc under strain, and the ONE new formation per tick under the cap, the latter a weighted draw over pair affinities that the settlement\'s own people gate',
    closeOwed: 'grade a formed bloc against whether it held to its own next succession, which the bloc record already dates, and a fracture against what the strain that caused it then did',
  }),
  fork({
    forkId: 'HBF-83', module: 'src/domain/worldPulse/stressors',
    symbol: 'wanderStep', discovery: 'checklist', disposition: 'DEFER',
    reason: 'SURVEY U-48 - TWO draws: the wander gate, and then the weighted neighbour pick that decides where a roaming trouble goes next. The survey calls the wandering what makes a region feel alive. ⚠ The pick is over PLACES rather than acts, which is the identity-preference shape HBF-35 and HBF-37 rule forbidden ground for PEOPLE; whether a place is the same case has not been read',
    closeOwed: 'establish whether choosing a destination for a trouble is a preference the world may learn at all, then grade a wander against what the trouble actually did where it landed',
  }),
  fork({
    forkId: 'HBF-84', module: 'src/domain/worldPulse/stressors',
    symbol: 'ageRoamingStressors', discovery: 'checklist', disposition: 'DEFER',
    actionVocabulary: 'STRESSOR_LIFECYCLE_STAGES',
    reason: 'SURVEY U-49 - the RESOLUTION roll, forked on the stressor\'s OWN id rather than a shared stream consumed in list order, so reordering the persisted list cannot change which crises resolve. ⭐ THE VOCABULARY IS DECLARED: the roll writes the lifecycle stage, and this module re-exports the estate\'s seven-stage vocabulary for exactly that field, so the words are the fork\'s own and resolve by import from this very module',
    closeOwed: 'grade a resolution against whether the trouble stayed resolved or GRADUATED into a lasting condition, which the aftermath pass already records without a second scale',
  }),
  fork({
    forkId: 'HBF-85', module: 'src/domain/worldPulse/traditionsKernel',
    symbol: 'advanceLitTraditions', discovery: 'checklist', disposition: 'DEFER',
    actionVocabulary: 'TRADITION_OUTCOME',
    reason: 'SURVEY U-50 - THE FESTIVAL DRAW: one uniform off the year stream, handed with the observance score to the outcome map. ⭐ THE VOCABULARY IS DECLARED and this is the registry\'s cleanest row - six typed outcomes the tab already renders, a dated and named recurring occasion a party can attend. ⚠ HBF-21 rules the SCORE stay-deterministic PERMANENTLY; this is the DRAW, a different symbol and a different question, and collapsing the two would file one ruling over both',
    closeOwed: 'grade a festival outcome against the prosperity and the standing it moved, which this same pass already applies; the score\'s own permanence is untouched by closing the draw',
  }),
  fork({
    forkId: 'HBF-86', module: 'src/domain/worldPulse/warSiegeVerdict',
    symbol: 'resolveSiegeVerdict', discovery: 'checklist', disposition: 'DEFER',
    actionVocabulary: 'SIEGE_VERDICT_BANDS',
    reason: 'SURVEY U-51 - THE SIEGE VERDICT\'S ONE ROLL, reached only after a DETERMINISTIC feasibility gate rules the matchup plausible; everything else resolves with NO roll, which is why a thorpe can never storm a fortified city on a lucky number. ⭐ THE VOCABULARY IS DECLARED, AND SINCE U18 IT IS THE ROLL\'S BANDS RATHER THAN ITS READING (the chair\'s judgment 265 (e)): SIEGE_VERDICT_BANDS types the four bands this roll writes and the direction each one implies, which is exactly what design §19 ruling 4 requires a pin to carry. ⚠ SIEGE_FALL_ODDS_WORDS, which this row named until U18, is the world\'s honest READING of the fall probability and is printed into the receipt; a directive naming one of those four words is REFUSED at the fold, so the row was declaring a vocabulary no pin could ever use',
    closeOwed: 'grade a verdict against what the taken or held town then cost the hand that holds it. ⛔ Design §19 rulings 3 and 4 both require a pin here to carry the BAND with the verdict, or the receipt would explain a draw that never happened',
  }),
  // ── U10: THE BARE HALF — the forks no signature sees and no draw census exposes ──
  //
  // ⛔ THE THIRD DISCOVERY KIND, AND IT IS A DECLARATION RATHER THAN A DISCOVERY. The
  // `idiom` half is found by SIGNATURE and pinned exactly against the live scan; the
  // `checklist` half is a hand-maintained census taken over a WIDER idiom set and WIDER
  // roots; this half is neither, and saying so is the point. Judgment 282 rules that the
  // coup's draws STAY BARE — a decision, not drift — and judgment 265 (c) sends the
  // processes design §19 ruling 3 named that draw NOTHING or resolve on a keyed HASH to
  // the same place. A row here is a NAME with a measured sentence beside it, never a
  // classification of weights the module does not spell, and it is explicitly NOT
  // registration-owed: a bare row advertises no vocabulary, so no seal can be offered
  // over it while it stays bare.
  //
  // ⭐ THREE FAMILIES, THREE OPENING SENTENCES, AND EACH ONE IS A PREDICATE THE WALKER
  // RE-DERIVES FROM THE TREE at `tests/lint/chooserTotality.walker.test.js` (the U10
  // bare-draw arms) rather than reads back as prose:
  //     'A BARE DRAW.'        the symbol takes an unweighted uniform no signature reads
  //     'HASHED, NOT DRAWN.'  the fork resolves on a keyed hash and consumes ZERO rng
  //     'NO WEIGHT, NO FORK.' the symbol carries no draw and no roll of any kind
  // The walker measures the SITE, derives which of the three the tree says, and reds if a
  // row says a different one — so a declared-bare fork that gains weights, or a
  // declared-dry process that gains a draw, cannot sit here quietly being false. U62's
  // lesson taken before it could bite twice: a prose row nobody re-derives is a row that
  // rots. The bare-draw roster is also held SET-EQUAL, both directions, against the
  // survey's Table 4 "B" column, so a row invented here reds as loudly as a draw the
  // survey found and this file forgot.
  //
  // ⚠ WHAT THIS HALF DOES NOT CLAIM. It is total over BARE DRAWS across the whole
  // `src/domain` (the walker scans for them and demands every one be placed). It is NOT a
  // census of HASHED forks: the two hashed rows below are the two judgment 265 (c) NAMES,
  // and a sweep for every keyed-hash fork in the tree is a chair-sized program (judgment
  // 282's own words). `npcCirculation.js`'s pressure-gated rehost hash is the measured
  // NOTICE that such a sweep would find more.
  fork({
    forkId: 'HBF-87', module: 'src/domain/rulingPowerCoup',
    symbol: 'resolveCoupVerdict', discovery: 'bare', disposition: 'DEFER',
    reason: 'A BARE DRAW. SURVEY U-52, and the owner named it first (Table 1 rows 3 and 4): TWO unweighted uniforms, the HOLD roll against a clamped pHold at :210 and the WINNER taken in proportion to challenger weight at :222, the sample spelled INLINE rather than through the estate\'s weighted-sample helper, which is exactly why no idiom signature reads it. ⛔ JUDGMENT 282: THE DRAWS STAY BARE, and that is a DECISION rather than drift. Teaching the signatures to read a bare uniform would expose a census nobody has commissioned, and filing the fork as registration-owed would advertise a pinnable vocabulary this module does not type. So it is declared BY NAME, and the walker holds the name against Table 4 in both directions. ⚠ THE FILE SITS AT THE TOP LEVEL of src/domain, a PLACE the walker\'s root mechanism could not express at all until this act widened it; the instrument gap was the finding, not the fork',
    closeOwed: 'grade a held or a fallen seat against what the court that kept or took it then did with it, which the faction records already date. ⛔ Before any of that, design §19 ruling 3 requires a hold pin to carry its own roll: pinning the verdict alone would leave pHold and the written reason prose explaining a draw that never happened',
  }),
  fork({
    forkId: 'HBF-88', module: 'src/domain/worldPulse/npcVerdictTable',
    symbol: 'resolveVerdict', discovery: 'bare', disposition: 'DEFER',
    reason: 'HASHED, NOT DRAWN. Judgment 265 (c) names the court\'s verdict as one of the two processes in design §19 ruling 3 that resolve on a keyed hash. MEASURED at the site: an eligible arm enters a genuinely WEIGHTED choice against the base verdict, the weights are the consequences tuning\'s own, and the roll is an FNV-1a reading of a labelled composite key through this module\'s local roll helper, so the choice consumes ZERO rng by construction. ⭐ The fork is therefore REAL while the stream is untouched, which is why neither a draw census nor any of the four signatures can see it. ⚠ NO VOCABULARY IS DECLARED and the reason is measured rather than modest: this module\'s four-word verdict vocabulary shares its exported NAME with a second module one directory over, so a declaration here would name a word two volumes spell differently, which the vocabulary arm refuses by design',
    closeOwed: 'grade a verdict against what the sentenced official then did and what the town paid for it, which the exposure record and the displacement lane already carry between them. Establish FIRST whether the eligible arm expresses a preference at all or exists to make an exact contest deterministic, because that is HBF-11\'s question one family over and one answer cannot be true there and false here',
  }),
  fork({
    forkId: 'HBF-89', module: 'src/domain/worldPulse/warTermination',
    symbol: 'readWarTerminations', discovery: 'bare', disposition: 'STAY',
    reason: 'NO WEIGHT, NO FORK. MEASURED: judgment 265 (c) found that four of the processes design §19 ruling 3 names as seals draw NOTHING, and this is the first of them. The whole module carries no draw, no roll and no weighted arm of any kind: the automatic win is READ off the thirteen close roads, a total function from the war record to which road, if any, has been walked. ⛔ RECORDED RATHER THAN OMITTED, on HBF-31\'s precedent: a seal was proposed over it, so the roster keeps the FINDING and the next census meets that rather than the site. A pin here would not tilt a draw, it would overwrite a reading',
  }),
  fork({
    forkId: 'HBF-90', module: 'src/domain/worldPulse/envoyErrand',
    symbol: 'advanceEnvoyErrands', discovery: 'bare', disposition: 'STAY',
    reason: 'NO WEIGHT, NO FORK. MEASURED, the second of judgment 265 (c)\'s four: the envoy\'s road advances by position, elapsed ticks and the errand state vocabulary, and the module carries no draw, no roll and no weighted arm anywhere in it. What befalls an envoy is written by the LAYERS the column travels through, each of which owns its own registered or declared fork, and this pass only reads their results into the errand record. ⛔ RECORDED RATHER THAN OMITTED on HBF-31\'s precedent, because a seal was proposed over it; the finding is what the next census must meet',
  }),
  fork({
    forkId: 'HBF-91', module: 'src/domain/worldPulse/npcCirculation',
    symbol: 'admissionFor', discovery: 'bare', disposition: 'STAY',
    reason: 'NO WEIGHT, NO FORK. MEASURED at the SYMBOL rather than the module, and the distinction is load-bearing: the exile\'s landing walks the settlement\'s factions in codepoint order and takes the first reading that admits, with belief rather than truth deciding, and the slice holds no draw and no roll. ⚠ The MODULE does hold keyed hashes, in the rehost gate and the sibling branch pick, which is why the walker measures the symbol\'s own slice and why those two are the NOTICE recorded above rather than a claim made here. ⛔ RECORDED on HBF-31\'s precedent: a seal was proposed over this symbol, so the roster keeps the finding',
  }),
  fork({
    forkId: 'HBF-92', module: 'src/domain/worldPulse/narrativeTempo',
    symbol: 'foldNarrativeTempo', discovery: 'bare', disposition: 'STAY',
    reason: 'NO WEIGHT, NO FORK. MEASURED, the last of judgment 265 (c)\'s four: the tempo folds what the tick already selected and deferred into a ledger and reads a tier off frozen edges, with no draw, no roll and no weighted arm in the module. ⭐ Design §19 ruling 3 offers it as a DIRECTION rather than a pin, and the measurement agrees with that shape exactly: there is no draw to pin, only a banded reading to overwrite, and a direction that sets the band is an honest act where a pin would be a fiction. ⛔ RECORDED rather than omitted on HBF-31\'s precedent',
  }),
  // ── WF-0: THE FAITH REGISTRATION DEBT — nine traditions/* symbols ─────────────
  //
  // FP-ARCHITECTURE-FOLD-2026-09-23.md J-EM-5 ("THE DETERMINISTIC FAMILIES ARE
  // DIRECTED, NEVER PINNED"): EM-FP-SEAM-MEASUREMENT.md §4's draw scan found 50
  // sites in 28 symbols under the FP families' modules, 19 already registered, NINE
  // unregistered — ALL in src/domain/traditions/*, invisible to the idiom scan
  // above because they draw through the PRNG's own methods (.randInt/.chance/
  // .pick/.weightedPick/.randFloat/.shuffle), which none of the three signatures
  // this walker runs (KEYED_RACE/SOFTMAX_SAMPLE/SCORE_EXTREMUM) matches. `checklist`
  // (not `idiom`) for exactly that reason — MEASURED against the live scan, not
  // assumed: none of the nine appears in DISCOVERED. `domain: 'FAITH'` joins the
  // owner's named-domain checklist beside HBF-21/22/23, the precedent for a FAITH
  // fork found by a LATER measurement pass than the original named-domain round.
  //
  // FOUR are politics.js's PULSE-TIME forks (advancePolitics, the T-3 mover's
  // per-tick reassignment/mutation checkpoints): DEFER, with a written closeOwed,
  // per this wave's own law — it registers, it does not dispose. NONE carries an
  // actionVocabulary: MEASURED at this wave, politics.js exports no closed set
  // that types any of the four draws' own outcome (an identity pick, a Bernoulli
  // gate, a cadence boolean, and a re-dress pick whose words live in a SIBLING
  // module, data/traditionCorpus.js — FINITE-SEMANTICS refuses a vocabulary
  // declared off the draw's own module outside HBF-17's one standing exception).
  //
  // FIVE are FOUNDING DERIVATIONS (genesis.js's deriveFoundingTraditions and its
  // three helpers, plus customFounding.js's adaptCustomTradition): STAY, reason "a
  // founding derivation — root-shaped (the survey's U-29/U-30 class)" verbatim, per
  // this wave's brief, genesis.js's own header rules them "the design's MINT-TIME
  // RULING made concrete... deterministic from the settlement seed alone", the same
  // class as HBF-25's road graph ("part of what a SEED IS"). NO behaviour change:
  // nothing under src imports this file (habitForkRegistry.js), so these nine rows
  // are a record and cannot move a byte of world output — the same structural
  // guarantee EM-E0's forty-four carry.
  fork({
    forkId: 'HBF-93', module: 'src/domain/traditions/politics',
    symbol: 'claimRoll', discovery: 'checklist', disposition: 'DEFER',
    domain: 'FAITH',
    reason: 'FAITH: the ascendant-regime claim roll (§6 reassignment, T3-b). A keyed Bernoulli gate at CLAIM_CHANCE (the constant the module owns, cited by symbol because the prose-numerics ratchet refuses the figure here) on whether a seat change lets the new order claim a faction/institution-owned tradition. Genuinely actor-addressable (the ascendant regime) and genuinely weighted, so it is read rather than assumed dry, HBF-52\'s shape, one family over. CLAIM_CHANCE is a bare tuning constant, not a vocabulary: the outcome is claimed-or-not, never a member of a closed word set',
    closeOwed: 'grade a claim against whether the observance stayed with the new seat to its own next checkpoint, which the mutationLog record already dates; no actionVocabulary exists at this module, vocabulary to mint at WF-2/WF-5 if a pin is ever offered here',
  }),
  fork({
    forkId: 'HBF-94', module: 'src/domain/traditions/politics',
    symbol: 'driftDue', discovery: 'checklist', disposition: 'DEFER',
    domain: 'FAITH',
    reason: 'FAITH: generational drift\'s own cadence (§7 mutation, T3-b). A keyed randInt picks a per-record PHASE (0..DRIFT_PERIOD-1) once, deterministically, off the record\'s own id; the boolean "is drift due this year" is then pure arithmetic over that phase. The TICK-INVARIANT-phase-off-a-keyed-fork shape is HBF-80\'s (seasons), which this wave does not re-read past: whether a scheduling phase is a CHOICE or a RATE has not been ruled here either. The outcome is a bare boolean, no vocabulary of any kind',
    closeOwed: 'establish whether the phase draw chooses anything or merely sets a re-dress cadence, exactly HBF-80\'s open question; a cadence takes STAY. No actionVocabulary exists at this module, vocabulary to mint at WF-2/WF-5 if the reading ever needs one',
  }),
  fork({
    forkId: 'HBF-95', module: 'src/domain/traditions/politics',
    symbol: 'pickOwner', discovery: 'checklist', disposition: 'STAY',
    domain: 'FAITH',
    reason: 'FAITH: the owner tie-break among equally-fit candidates (§6 assignment). RULING FP-14 (the chair, vetoable by the owner): STAY on the HBF-37/HBF-91 precedent, this wave\'s own measurement is the whole ground. `pool` is built by filtering to the archetype-matching, kind-preferred candidates ALREADY sorted by `cmp(key)` (codepoint), then `rng.randInt(0, pool.length - 1)` picks flatly among them, UNWEIGHTED, over an already-canonical order, exactly HBF-37\'s shape (drawPick) and HBF-91\'s (admissionFor): a pick that exists to be unbiased by alphabet rather than to prefer one power over another, an identity preference HBF-22/HBF-35/HBF-37/HBF-71 all rule forbidden ground. A graded-ownership reading would need a tradition-owner DIRECTION no wave has chartered. ⚠ RE-FILE IF WF-2/WF-5 MINTS A TRADITION-OWNER DIRECTION: this ruling reads the tree as it stands, and a future direction that lets a DM prefer an owner would reopen the question this row now closes',
  }),
  fork({
    forkId: 'HBF-96', module: 'src/domain/traditions/politics',
    symbol: 'reexpressed', discovery: 'checklist', disposition: 'DEFER',
    domain: 'FAITH',
    reason: 'FAITH: the re-dress at a mutation checkpoint (§7, T3-b). TWO draws: `rng.shuffle(...)` orders the act\'s trappings pool (data/traditionCorpus.js\'s TRADITION_TRAPPINGS) and takes the first two, then `rng.fork(\'epithet\').pick(...)` picks one epithet (TRADITION_EPITHETS), cosmetic re-flavouring of a record\'s `expression`, never its immutable coreMotif. Structurally the HBF-07/HBF-33/HBF-34/HBF-42 prose-pick family\'s open question ("is a pick from a fixed pool a decision at all") one directory over, but NOT that family itself: those four share one hash01 KEYED_RACE signature copied verbatim wave to wave, and this draws through shuffle/pick instead, so it is read on its own rather than inheriting their disposition',
    closeOwed: 'establish whether re-dressing a tradition\'s expression is a preference at all, if it is pure cosmetic re-flavouring with no consequential outcome, this row becomes STAY with that finding. Both pools (TRADITION_TRAPPINGS, TRADITION_EPITHETS) are exported by data/traditionCorpus.js, a SIBLING module, not politics.js itself, FINITE-SEMANTICS refuses a vocabulary declared off the draw\'s own module (HBF-17 is the one standing exception, cross-volume by the collision contract), so no actionVocabulary is declared here; the words exist, they are simply not this row\'s to name',
  }),
  fork({
    forkId: 'HBF-97', module: 'src/domain/traditions/genesis',
    symbol: 'deriveFoundingTraditions', discovery: 'checklist', disposition: 'STAY',
    domain: 'FAITH',
    reason: 'FAITH: a founding derivation, root-shaped (the survey\'s U-29/U-30 class). THE settlement\'s founding tradition SET (count, then per-record element/act/scale/year via weightedPick/randInt/randFloat), reconstructed byte-identically whether called view-time or tick-time from the settlement seed alone, genesis.js\'s own header: "the design\'s MINT-TIME RULING made concrete... deterministic from the settlement seed alone". The same class as HBF-25\'s founding road graph ("part of what a SEED IS"), not a habit a court forms: there is no repeated occasion here to reinforce, only a settlement\'s one origin, computed once',
  }),
  fork({
    forkId: 'HBF-98', module: 'src/domain/traditions/genesis',
    symbol: 'buildWindow', discovery: 'checklist', disposition: 'STAY',
    domain: 'FAITH',
    reason: 'FAITH: a founding derivation, root-shaped (the survey\'s U-29/U-30 class). The observance window (randInt offset within the element\'s season, then a chance(0.5) one/two-week length for a grand act) is assembled ONCE per record, inside deriveFoundingTraditions\'s own founding pass, HBF-97\'s helper, not a separate occasion a court could learn to favour',
  }),
  fork({
    forkId: 'HBF-99', module: 'src/domain/traditions/genesis',
    symbol: 'composeName', discovery: 'checklist', disposition: 'STAY',
    domain: 'FAITH',
    reason: 'FAITH: a founding derivation, root-shaped (the survey\'s U-29/U-30 class). The tradition\'s display NAME (three seeded pick(...) draws over template/adjective/culture-flavour pools, bounded-retry on collision) is composed ONCE at founding, HBF-97\'s helper. A name is part of a tradition\'s identity, immutable once minted (politics.js\'s own §7 law: "Core motif is IMMUTABLE forever; only the EXPRESSION, scale, and ownership move"), never a repeated choice',
  }),
  fork({
    forkId: 'HBF-100', module: 'src/domain/traditions/genesis',
    symbol: 'pickTrappings', discovery: 'checklist', disposition: 'STAY',
    domain: 'FAITH',
    reason: 'FAITH: a founding derivation, root-shaped (the survey\'s U-29/U-30 class). The FOUNDING trappings pick (a seeded shuffle over the act\'s pool, first k taken), HBF-97\'s helper, called once per record at genesis. Distinct from politics.js\'s `reexpressed` (HBF-96), which re-picks trappings LATER at a pulse-time mutation checkpoint; this is the origin pick alone',
  }),
  fork({
    forkId: 'HBF-101', module: 'src/domain/traditions/customFounding',
    symbol: 'adaptCustomTradition', discovery: 'checklist', disposition: 'STAY',
    domain: 'FAITH',
    reason: 'FAITH: a founding derivation, root-shaped (the survey\'s U-29/U-30 class). A DM-authored custom tradition\'s `startWeekOfYear` is seeded off the tradition\'s OWN id (randInt(0,51)+1), the module\'s own header: "A seeded, stable startWeekOfYear stands in for the absent authored date, the same way genesis seeds its windows" (HBF-98\'s twin, for the one field an authoring form cannot supply). View-only (the dossier\'s Traditions tab consumption, not the tick-time mover), and it never touches the golden-pinned deriveFoundingTraditions leaf it appends after',
  }),
  // ⭐ FP IN-2 (J-EM-5; the id HBF-93 the lane minted was taken by WF-0's claimRoll at the landing — renumbered HBF-102 by the chair at the pick, the union): the first hashed row named by the Edit Mode fold rather than by judgment
  // 265 (c). It joins this half on the same terms — a NAME with a measured sentence the walker
  // re-derives from the site — and it still makes this half no census of hashed forks.
  fork({
    forkId: 'HBF-102', module: 'src/domain/worldPulse/npcCirculationBelief',
    symbol: 'rumourReinforcesAt', discovery: 'bare', disposition: 'STAY',
    reason: 'HASHED, NOT DRAWN. Judgment J-EM-5 sends this keyed chooser to IN-2 and IN-2 registers it. MEASURED at the site: an FNV-1a reading of a labelled composite key (observer, roamer, elapsed ticks) under a tuning share, so it consumes ZERO rng by construction. Its two outcomes are the story GREW in the telling or DIED on the road, returned as a boolean and never exported as words. ⛔ NEVER PINNABLE, and that is the class rather than a delay: it is an OBSERVATION\'S NOISE (L10 (a), the survey\'s D-2 class; R-4 rules rumour weathering the same way), and a pin would make the world lie with provenance reading observed. So no vocabulary is declared, and STAY is the ruling rather than a deferral',
  }),
  // ⭐ FP IN-3 (the fold's EDITOR line (a): the sweep's catch is a DRAW, and it registers WITH its
  // outcome vocabulary, minted beside the producer). Sorted by id at the tail (SR-7). HBF-103 is a
  // NAMED-DOMAIN CHECKLIST row (the owner's "dynamics between settlements": a court hunting the
  // agents a neighbour keeps in it): the signature scan does not see a keyed catch fork, a bare
  // DRAW row belongs to the survey's Table 4 roster (not this wave's to write), and a domain-less
  // checklist row is the survey registration. HBF-104 IS signature-visible, so it sits on the idiom half.
  fork({
    forkId: 'HBF-103', module: 'src/domain/worldPulse/counterIntelSweep',
    symbol: 'resolveSweep', discovery: 'checklist', disposition: 'DEFER',
    actionVocabulary: 'SWEEP_OUTCOMES',
    domain: 'INTER-SETTLEMENT DYNAMICS',
    reason: 'A KEYED DRAW, one fork per swept town and tick (the stream-theft rule, sweep:<home>:<tick>), one reading per covert watcher standing on the town, against the catch odds of SWEEP_TUNING. Its answers are the three words SWEEP_OUTCOMES names, minted in the producer\'s own module: a clean miss, a false accusation, or the watchers caught. The accusation arm is a threshold over the court\'s own suspicion and draws nothing',
    closeOwed: 'the pin seam: the sweep consumer (IN-3-c, at the direction transport) consults a pending pin over SWEEP_OUTCOMES before the catch draw, the HBF-86 idiom, so a DM may decide what a sweep finds and the world plays the consequence',
  }),
  fork({
    forkId: 'HBF-104', module: 'src/domain/worldPulse/patronExposure',
    symbol: 'exposedPatronInstitutions', discovery: 'idiom', disposition: 'DEFER',
    reason: 'HASHED, NOT DRAWN, and discovered by the scan because it is a keyed choice: one reading per (host, house) off the cured hash01 root, compared against PATRON_EXPOSURE_TUNING odds that rise with the host court\'s suspicion rank, so the answer is stable while the band holds and monotone in it. It consumes ZERO rng. Its answer is binary (the covert patronage stands exposed or it does not) and is never exported as words',
    closeOwed: 'whether the exposure is DM-addressable as a pin (the house unmasked, a binary outcome with no vocabulary yet) or only through a direction over the counter-game; until that is ruled the reading stays the world\'s',
  }),
]);
