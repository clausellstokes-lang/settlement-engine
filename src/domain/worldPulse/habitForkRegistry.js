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
  fork({
    forkId: 'HBF-05', module: 'src/domain/worldPulse/espionage/espionageGauntlet',
    symbol: 'stayDetectionRoll', discovery: 'idiom', disposition: 'DEFER',
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
  // ── ROWS THAT ARE BOTH SIGNATURE-DISCOVERED AND OWNER-NAMED ───────────────────
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
  // ── THE FOURTH IDIOM: THE EXPLICIT GUARD-CHAIN REGISTER ───────────────────────
  fork({
    forkId: 'HBF-31', module: 'src/domain/worldPulse/espionage/espionageMath',
    symbol: 'deliberationRead', discovery: 'guard-chain', disposition: 'STAY',
    reason: 'THE GUARD-CHAIN REGISTER\'S ONE MEMBER. MEASURED: a chain of early returns with ZERO weighted arms, so it is not a fork at all — a site that answers zero on all four idioms is not a chooser, whatever a seam sentence says about it. ⚠ IT IS RECORDED RATHER THAN OMITTED because it was carried as a learning site in one table while two others already ruled it deterministic: one symbol, three rows, two answers, through two review rounds. A registry that permits that permits anything',
  }),
]);
