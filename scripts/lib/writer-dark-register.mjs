/**
 * writer-dark-register.mjs — THE HAND-AUTHORED DARK REGISTER AND ITS CONVICTION
 * DOORS (HORIZON §1.10, §7.1).
 *
 * ── WHAT A ROW IS ────────────────────────────────────────────────────────────
 * A DARK identity — a key the engine writes on every world that no customer
 * surface reads — is either a ROW here or a member of the shrink-only banked
 * cohort in `scripts/.writer-reach-baseline.json`. A row is a CLAIM, in one of
 * three closed reasons, and every claim is CONVICTED by an executed bit on every
 * scan. A row that cannot be verified is a lie, not an exemption.
 *
 *   dark-by-construction — the key is written but a DOOR keeps it dark: an
 *       engine-gated virtual `simulation-flag`, or a `generation-dial` whose
 *       shipped version differs from the lit one. Dormancy is a BIT claim.
 *   engine-internal      — the key IS read, by plumbing behind the closure STOP
 *       (a regen path, a store selector). Not a customer fact at all.
 *   pending-surface      — the key SHOULD be shown and is not yet. An owed CAR
 *       and a capability question for the owner, never a silencer.
 *
 * ── ⛔ WHY `pending-surface` IS THE DANGEROUS ONE, AND HOW IT IS FENCED ──────
 * Without a fence, `{ reason: 'pending-surface', surface: <any class this key
 * does not reach>, car: '§0' }` would silence ANY new DARK identity by a
 * code-only edit — banking a row disarms the ratchet. So:
 *   1. `surface` must be a COUNTING class. A pending surface is one a customer
 *      will SEE, never a report-only class.
 *   2. `surface` must be one the identity does NOT currently reach.
 *   3. `car` must cite a section AND resolve to an IN-TREE artifact that NAMES
 *      the fact (⟦A21 E5⟧). A `§` alone is not existence-checkable from the build
 *      worktree, because the decision queue lives on the ledger branch.
 *   4. The pending-surface POPULATION is a shrink-only ceiling banked at genesis.
 *      A row may leave; none may join except through `--rebank --charter=§NNN`.
 *
 * ── ⚠ THE CITATION LAW, BOTH FACES ──────────────────────────────────────────
 * Clause E strips comments AND strings before looking for the consumer's read: a
 * USE claim reads CODE, because a call cannot execute from inside a quoted
 * literal. Clause D-flag keeps strings, because there the flag TOKEN is the
 * evidence. The distinction is not stylistic — the draft register named
 * `src/store/configSlice.js:81` as a consumer of `cultureProfileKey`, and that
 * "read" is the key's NAME inside a space-separated string of allowlisted config
 * fields. Clause E convicts it, correctly, and the row below does not claim it.
 *
 * @see docs/DESIGN_HORIZON.md §1.10, §7.1   (the charter; on the ledger line)
 * @see scripts/lib/writer-reach-scan.mjs    (the scanner and the vocabulary)
 */
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

import { COUNTING_CLASSES, SURFACE_CLASSES, canonicalJson } from './writer-reach-scan.mjs';
import { parseLeafBaselineIdentity } from './observed-shape-baseline.mjs';
import { writeShapesIn, assertVirtualDormantWriterEvidence } from '../check-observed-shape-readers.mjs';
import { codeOnly } from '../../tests/helpers/codeOnlySource.js';

/** The three closed reasons. Finite semantics: a fourth reason is a charter act. */
export const DARK_REASONS = Object.freeze(['dark-by-construction', 'engine-internal', 'pending-surface']);

/** The EXACT field set each reason carries — the M13 idiom, `Object.keys().sort().join(',')`. */
export const CANONICAL_FIELDS = Object.freeze({
  'dark-by-construction': 'car,charter,door,identity,key,lighting,reason,shape,writer',
  'engine-internal': 'charter,consumer,identity,key,reason,shape,why,writer',
  'pending-surface': 'car,carArtifact,charter,identity,key,reason,shape,surface,why,writer',
});

/** A `simulation-flag` door's flag spelling — the estate's own convention. */
export const SIMULATION_FLAG_PATTERN = /^[a-z][A-Za-z0-9]*Enabled$/;

/**
 * THE REGISTER. Rows 1, 2, 3 and 6 of the volume's six drafted rows. Rows 1 and 2
 * were the generation-dial pair, admitted by Car 4 once the chair ruled clause W
 * reason-aware (ledger §882.15) — before that ruling no instrument in the estate
 * could hold them, because their writes are an assignment and a computed key.
 *
 * ⭐⭐ ROW 1 IS RETIRED, BY ITS OWN PREMISE, ON THE DAY THE DIAL WAS LIT
 * (2026-09-08, lane LIGHT car 1b). `customContentRoster on settlement` was
 * dark-by-construction because `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION`
 * shipped at 1 against a roster law of 2. Its own `lighting` prose said what to
 * do when that stopped being true — "When the owner rolls the dial the key
 * becomes an ordinary written fact and this row must die with its premise" — and
 * clause D-dial says the same in the failure it throws: "Retire the row rather
 * than outliving its own premise." The row is struck rather than reworded,
 * because a dormancy claim whose ground has gone is not a claim to soften. The
 * identity is now judged NORMALLY, and what that judgement finds is a key no
 * world in the corpus writes: the roster materializes only where the run's
 * reviewed environment holds a living-content definition, and the walker's
 * corpus is generated under `customContent: {}`.
 *
 * ⭐⭐ ROW 2 IS RETIRED TOO, BY ITS OWN PREMISE (2026-11-05, LANDING-5 under the cloud chair's ruling 2 on
 * LANDING-4's report, ODQ §934.105). `densityRungRole on npcs` was dark-by-construction while
 * `NEW_SETTLEMENT_DENSITY_LAW_VERSION` shipped at 1 against Register VII's 2. X-46 car 4's density law
 * (1c527831a, the densityRoll cause) lit the dial everywhere: the shipped dial EQUALS the lit version (2), the
 * key is written on every world, and clause D-dial convicted the row in the walker's beforeAll ("Retire the row
 * rather than outliving its own premise"). The dark path the row and its walker arms walked no longer exists,
 * so the row is struck rather than kept alive on a constructed dial (dead stays dead), and the identity is now
 * judged normally.
 *
 * ⭐ THE SIXTH ROW IS RETIRED BY CLAUSE S (2026-11-05, LANDING-5 under the cloud chair's ruling 3, ODQ §934.105),
 * with the cause as measured: the executed corpus's 327 proposals carry no `supersessionReason` at all, the writer
 * (proposalAdmission.js, last changed by CURE-PEACE-2 400e8e5a6 / d5eda0aa0) is unchanged, and the identity left
 * the judged population. COVERAGE WAS LOST, NOT REACH: no corpus seed now drives a supersession, so the walker
 * cannot judge the key; the reconcile that reads it is unchanged. "A corpus seed whose proposal is superseded" is
 * owed coverage (LANDING-5's report lists it), so the loss is not silent. Its history, as it was:
 * The sixth row (2026-09-24, CURE-PEACE-1) is `supersessionReason on proposals`, engine-internal: the
 * lane's docket retirement (FP-17) is the first supersession writer the executed corpus runs, so the
 * reason code every supersession writer stamps became judgeable, and its one reader is the feed
 * reconcile. Its sibling stamp `supersededAtTick` had no reader at all and is no longer written by that
 * writer; the three older writers still write it (applyWorldPulse.js twice, candidateEvents.js), out of
 * the corpus's reach.
 *
 * Rows 7 to 10 (2026-10-02, the Voice Program wave 1, ODQ §934.88) are `appliedHeadline` on candidates, selected,
 * autoApplied and outcome, engine-internal: every Herald producer now writes the deed DONE beside the deed UNDER
 * WAY (heraldDeeds.js), and the feed curation's appliedHeadlineFor is the one reader that prints it.
 *
 * The WIRING rows (2026-11-07, lane W6, the cloud chair's ruling R-W2 on the WIRING-0 inventory, ODQ §934.105)
 * are the GENERATION-origin identities the inventory ruled INTERNAL that have a reader: each engine-internal, each
 * with the consumer that reads the key named by file and line in its charter, added by section (ECO, DEF, POW,
 * META; HIS and FTH convict none). Each charter says CONFIRMED where the consumer reads the stored record's key (or
 * the identical object before it is stored) and PLAUSIBLE where it reads the key on the object the stored copy is
 * spread from, or on a recomputed twin of the same producer. The INTERNAL identities with no reader, or whose
 * writer or reader this register's clauses cannot see, stay in the shrink-only bank, reviewed, with their reasons in
 * docs/WIRING_W6_2026-11-07.md.
 *
 * Rows 3 and 6 were Car 1's:
 * Car 0 adjudicated all six at C' (⟦G0-13⟧) and found rows 1–2 are Car 3's
 * (their keys are not written under the dark corpus at all), row 4's key never
 * reaches the population under `customContent: {}`, and row 5's three families
 * are refuted or unobservable (`worldState` is THIN at 25 rows, so no
 * `worldState` identity is judgeable).
 */
export const WRITER_DARK_REGISTER = Object.freeze([
  Object.freeze({
    identity: 'cultureProfileKey on config',
    key: 'cultureProfileKey',
    shape: 'config',
    writer: 'src/generators/steps/resolveConfig.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/generateSettlementPipeline.js',
      symbol: 'the regeneration path, which re-reads the resolved cultural identity key',
    }),
    why: 'The resolved culture profile KEY is plumbing, not a fact about the settlement. It is written by '
      + 'resolveConfig so the regeneration path can re-resolve the same cultural identity deterministically, and it '
      + 'is read only inside src/generators — behind the closure STOP by construction, so no customer surface can '
      + 'reach it and none should. What a player is shown is the culture NAME on the config, which is LIT at grade R '
      + 'on the campaign PDF, the dossier, the world book and the web display. The key beside it is the seed of that '
      + 'name, and showing a profile key to a player would be showing them the engine.',
    charter: '§7 WRWALKER, the drafted register row 3, adjudicated DARK by Car 0 at C-prime',
  }),
  Object.freeze({
    identity: 'archetypeKey on relationships',
    key: 'archetypeKey',
    shape: 'relationships',
    writer: 'src/generators/npcGenerator.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/generateSettlementPipeline.js',
      symbol: 'the rename path, which re-renders a tie\'s description and tension from its archetype key',
    }),
    why: 'The relationship archetype KEY is the seed of the tie\'s description and tension prose: the generator '
      + 'writes it so the rename path can re-render both sentences for new names, and that read sits inside '
      + 'src/generators, behind the closure STOP. Its one surface read was the Plot Hooks collector, which used it to '
      + 'theme relationship-tension cards; the chair\'s ruling X-2 (2026-10-30, under the owner\'s delegation) moved '
      + 'a tie\'s tension back to the Relationships tab beside its tie and dropped that card category, so what a '
      + 'player is shown is the tension and type name the key produced, never the key.',
    charter: 'ODQ §934.101 (the chair, 2026-10-30, ruling X-2 in docs/UX_CONSOLIDATION_2026-10-30.md), consumer CONFIRMED at generateSettlementPipeline.js:245',
  }),
  Object.freeze({
    identity: 'proseVariant on relationships',
    key: 'proseVariant',
    shape: 'relationships',
    writer: 'src/generators/npcGenerator.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/generateSettlementPipeline.js',
      symbol: 'refreshRelationshipProjections, which re-renders a tie\'s description and tension at its stored variant',
    }),
    why: 'A stored draw index for deterministic re-render; no customer surface reads it by design. GS-1 draws each '
      + 'tie\'s description and tension WITHOUT REPLACEMENT across the whole town, so the line a tie carries depends '
      + 'on the rest of the town and can no longer be re-derived from its own name pair. The generator stores the '
      + 'index it drew, and the rename path re-renders both sentences at that index for the new names; that read sits '
      + 'inside src/generators, behind the closure STOP. What a player is shown is the description and tension the '
      + 'index selected, never the index.',
    charter: 'ODQ §934.101 (the chair, 2026-10-31, ruling GS-1 on G-SEAMS S1 and the G3 item-1 ruling), consumer CONFIRMED at generateSettlementPipeline.js:247',
  }),
  // W2 DEF (2026-11-07, construction C3–C5, the third seat): the three §12 WRW-2 pending-surface rows —
  // `isolationSupport on settlement`, `magicDependent on isolationSupport`, `requiredCapacity on isolationSupport` —
  // LEFT this register. WIRING-RULINGS R-W1 (ODQ §934.105) ruled the finding SAID, and the new block DS-DEF-12
  // (`defenseStateProse.js :: defenseIsolationSupportProse`, mounted at `viability.isolationSupport`, drawn by
  // ViabilityTab and the print chapter) reads all three, so each identity is LIT at web-display (clause P) and the
  // pending-surface debt is paid. Retired with that cause; the HOLD line's debt clears with them.
  Object.freeze({
    identity: 'appliedHeadline on candidates',
    key: 'appliedHeadline',
    shape: 'candidates',
    writer: 'src/domain/worldPulse/candidateEvents.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/worldPulse/worldPulseFeedCuration.js',
      symbol: 'appliedHeadlineFor, which gives an applied outcome its done-form headline in the Herald entry',
    }),
    why: 'The applied twin of a Herald headline is plumbing until the feed speaks it. Since the Voice Program wave 1'
      + ' (the owner, 2026-10-02: "Updates like these need to reflect actions not to potential") every producer writes'
      + ' the deed DONE beside the deed UNDER WAY ("Famine grips Berghavn" beside "Hunger is closing on Berghavn"), on'
      + ' the pulse candidates as on every outcome they become. Its one reader is the feed curation, which prints it as the news'
      + ' entry headline once the outcome applies; what a player sees is that headline, LIT on the Herald.',
    charter: '§934.88 the Voice Program wave 1 (heraldDeeds.js), measured DARK by the walker at the program tip f33d28798',
  }),
  Object.freeze({
    identity: 'appliedHeadline on selected',
    key: 'appliedHeadline',
    shape: 'selected',
    writer: 'src/domain/worldPulse/candidateEvents.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/worldPulse/worldPulseFeedCuration.js',
      symbol: 'appliedHeadlineFor, which gives an applied outcome its done-form headline in the Herald entry',
    }),
    why: 'The applied twin of a Herald headline is plumbing until the feed speaks it. Since the Voice Program wave 1'
      + ' (the owner, 2026-10-02: "Updates like these need to reflect actions not to potential") every producer writes'
      + ' the deed DONE beside the deed UNDER WAY ("Famine grips Berghavn" beside "Hunger is closing on Berghavn"), on'
      + ' the selected outcomes as on every outcome they become. Its one reader is the feed curation, which prints it as the news'
      + ' entry headline once the outcome applies; what a player sees is that headline, LIT on the Herald.',
    charter: '§934.88 the Voice Program wave 1 (heraldDeeds.js), measured DARK by the walker at the program tip f33d28798',
  }),
  Object.freeze({
    identity: 'appliedHeadline on autoApplied',
    key: 'appliedHeadline',
    shape: 'autoApplied',
    writer: 'src/domain/worldPulse/candidateEvents.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/worldPulse/worldPulseFeedCuration.js',
      symbol: 'appliedHeadlineFor, which gives an applied outcome its done-form headline in the Herald entry',
    }),
    why: 'The applied twin of a Herald headline is plumbing until the feed speaks it. Since the Voice Program wave 1'
      + ' (the owner, 2026-10-02: "Updates like these need to reflect actions not to potential") every producer writes'
      + ' the deed DONE beside the deed UNDER WAY ("Famine grips Berghavn" beside "Hunger is closing on Berghavn"), on'
      + ' the auto-applied outcomes as on every outcome they become. Its one reader is the feed curation, which prints it as the news'
      + ' entry headline once the outcome applies; what a player sees is that headline, LIT on the Herald.',
    charter: '§934.88 the Voice Program wave 1 (heraldDeeds.js), measured DARK by the walker at the program tip f33d28798',
  }),
  Object.freeze({
    identity: 'appliedHeadline on outcome',
    key: 'appliedHeadline',
    shape: 'outcome',
    writer: 'src/domain/worldPulse/candidateEvents.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/worldPulse/worldPulseFeedCuration.js',
      symbol: 'appliedHeadlineFor, which gives an applied outcome its done-form headline in the Herald entry',
    }),
    why: 'The applied twin of a Herald headline is plumbing until the feed speaks it. Since the Voice Program wave 1'
      + ' (the owner, 2026-10-02: "Updates like these need to reflect actions not to potential") every producer writes'
      + ' the deed DONE beside the deed UNDER WAY ("Famine grips Berghavn" beside "Hunger is closing on Berghavn"), on'
      + ' the stored outcome of a proposal as on every outcome they become. Its one reader is the feed curation, which prints it as the news'
      + ' entry headline once the outcome applies; what a player sees is that headline, LIT on the Herald.',
    charter: '§934.88 the Voice Program wave 1 (heraldDeeds.js), measured DARK by the walker at the program tip f33d28798',
  }),
  Object.freeze({
    identity: 'gapPct on foodRecord',
    key: 'gapPct',
    shape: 'foodRecord',
    writer: 'src/generators/economy/foodBalance.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/economy/prosperity.js',
      symbol: 'the prosperity food cap, which reads foodSecurity.foodRecord.gapPct before falling back to '
        + 'deficitPct',
    }),
    why: 'The remaining food gap as a rounded per cent: the same number as the deficit per cent the food '
      + 'ledger already prints. The prosperity step reads it (prosperity.js:83) to cap or penalise the '
      + 'prosperity rung, inside src/generators behind the closure STOP; what a player sees is the deficit '
      + 'and the prosperity rung it moved.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer CONFIRMED at src/generators/economy/prosperity.js:83',
  }),
  // MERGE-R2 (2026-11-07, the integration merge of the rung-2 landing): `growsMoreThanEats on foodRecord` LEFT this
  // register. W6 (section ECO) convicted it engine-internal because its consumer, src/domain/foodSurplus.js, sat
  // outside every surface closure; the rung-2 landing's chunk cure (computeActiveChains reads the food gate from
  // domain/foodSurplus.js, LANDING-R2 phase 2 step 4) brought that file inside the dossier-pdf closure, so at the
  // merged tip the identity is LIT and the row would be wrong about its own reason (clause E). Retired with that cause.
  Object.freeze({
    identity: 'isSurplus on foodSecurity',
    key: 'isSurplus',
    shape: 'foodSecurity',
    writer: 'src/data/bandLadders.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/conditionPromotion.js',
      symbol: 'the condition-promotion weight, which lowers the crisis promotion chance for a town in food surplus',
    }),
    why: 'A boolean restatement of the food band, which the food ledger already prints as its band. The '
      + 'condition promotion reads it (conditionPromotion.js:120) as one weight on whether a condition '
      + 'escalates; it is a numeric input to a roll, not a fact a player reads, and the band beside it is the '
      + 'customer fact.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer CONFIRMED at src/domain/conditionPromotion.js:120',
  }),
  Object.freeze({
    identity: 'effectiveAgriculture on foodSecurity',
    key: 'effectiveAgriculture',
    shape: 'foodSecurity',
    writer: 'src/generators/foodGenerator.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/economy/foodBalance.js',
      symbol: 'the food record builder, which takes the land\'s effective farming multiplier as its agriculture '
        + 'modifier',
    }),
    why: 'The multiplier the land\'s farming capacity actually produced food at: a raw input to the daily '
      + 'production the food ledger prints. The food record builder reads it (foodBalance.js:609) inside '
      + 'src/generators behind the closure STOP; what a player sees is the production and the band it yields, '
      + 'never the multiplier.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer CONFIRMED at src/generators/economy/foodBalance.js:609',
  }),
  Object.freeze({
    identity: 'cascadeAdded on institutions',
    key: 'cascadeAdded',
    shape: 'institutions',
    writer: 'src/generators/cascadeGenerator.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/generationOwnership.js',
      symbol: 'hasCascadeProvenance, the provenance law regeneration and the borrowed-seat clear read',
    }),
    why: 'The record\'s own account of how it arrived: true when a cascade second-chance roll added the '
      + 'institution. The provenance law reads it (generationOwnership.js:119) so regeneration knows the row '
      + 'is generated and the tier outcome can clear a borrowed seat; plumbing, not a fact about the town, '
      + 'which is shown its roster.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer CONFIRMED at src/domain/generationOwnership.js:119',
  }),
  Object.freeze({
    identity: 'forcedByToggle on institutions',
    key: 'forcedByToggle',
    shape: 'institutions',
    writer: 'src/generators/steps/assembleInstitutions.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/generationOwnership.js',
      symbol: 'the ownership law, which keeps an institution the DM\'s toggle demanded out of the regenerable set',
    }),
    why: 'Provenance of the DM\'s own choice: the toggle demanded this institution. The ownership law reads it '
      + '(generationOwnership.js:78, :93, :233) so a regeneration never drops what the DM forced; the DM '
      + 'already knows they forced it, and the player is shown the institution, not how it was chosen.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer CONFIRMED at src/domain/generationOwnership.js:78',
  }),
  Object.freeze({
    identity: 'exclusiveGroupCoexists on institutions',
    key: 'exclusiveGroupCoexists',
    shape: 'institutions',
    writer: 'src/data/institutionalCatalog.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/structuralValidator.js',
      symbol: 'the exclusive-group check, which exempts a row whose group may coexist (several monastic houses in a '
        + 'city)',
    }),
    why: 'A catalog rule copied onto the row: this institution may share its exclusive group with siblings. '
      + 'The structural validator reads it on the settlement\'s roster (structuralValidator.js:833) so a city '
      + 'may keep several monasteries without a violation; what a player sees is the roster, never the rule.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer CONFIRMED at src/generators/structuralValidator.js:833',
  }),
  Object.freeze({
    identity: 'forbiddenResources on institutions',
    key: 'forbiddenResources',
    shape: 'institutions',
    writer: 'src/data/institutionalCatalog.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/steps/assembleInstitutions.js',
      symbol: 'rowRoll, the assembler\'s eligibility roll, which reads the catalog rule before the row is admitted',
    }),
    why: 'A catalog eligibility rule, not a fact about the town: the institution catalog carries '
      + '`forbiddenResources` on its row, and the row is spread onto the settlement\'s institutions record '
      + 'whole. Its reader is the roster assembler\'s eligibility roll (rowRoll), which reads the rule on the '
      + 'catalog row before that row is admitted and copied, inside src/generators behind the closure STOP. '
      + 'What a player is shown is the roster the rule produced, never the rule; the stored copy itself is '
      + 'not re-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer PLAUSIBLE at src/generators/steps/assembleInstitutions.js:296',
  }),
  Object.freeze({
    identity: 'forbiddenTradeRoutes on institutions',
    key: 'forbiddenTradeRoutes',
    shape: 'institutions',
    writer: 'src/data/institutionalCatalog.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/steps/assembleInstitutions.js',
      symbol: 'rowRoll, the assembler\'s eligibility roll, which reads the catalog rule before the row is admitted',
    }),
    why: 'A catalog eligibility rule, not a fact about the town: the institution catalog carries '
      + '`forbiddenTradeRoutes` on its row, and the row is spread onto the settlement\'s institutions record '
      + 'whole. Its reader is the roster assembler\'s eligibility roll (rowRoll), which reads the rule on the '
      + 'catalog row before that row is admitted and copied, inside src/generators behind the closure STOP. '
      + 'What a player is shown is the roster the rule produced, never the rule; the stored copy itself is '
      + 'not re-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer PLAUSIBLE at src/generators/steps/assembleInstitutions.js:291',
  }),
  Object.freeze({
    identity: 'terrainAccess on institutions',
    key: 'terrainAccess',
    shape: 'institutions',
    writer: 'src/data/institutionalCatalog.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/steps/assembleInstitutions.js',
      symbol: 'rowRoll, the assembler\'s eligibility roll, which reads the catalog rule before the row is admitted',
    }),
    why: 'A catalog eligibility rule, not a fact about the town: the institution catalog carries '
      + '`terrainAccess` on its row, and the row is spread onto the settlement\'s institutions record whole. '
      + 'Its reader is the roster assembler\'s eligibility roll (rowRoll), which reads the rule on the catalog '
      + 'row before that row is admitted and copied, inside src/generators behind the closure STOP. What a '
      + 'player is shown is the roster the rule produced, never the rule; the stored copy itself is not '
      + 're-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer PLAUSIBLE at src/generators/steps/assembleInstitutions.js:288',
  }),
  Object.freeze({
    identity: 'terrainRequired on institutions',
    key: 'terrainRequired',
    shape: 'institutions',
    writer: 'src/data/institutionalCatalog.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/steps/assembleInstitutions.js',
      symbol: 'rowRoll, the assembler\'s eligibility roll, which reads the catalog rule before the row is admitted',
    }),
    why: 'A catalog eligibility rule, not a fact about the town: the institution catalog carries '
      + '`terrainRequired` on its row, and the row is spread onto the settlement\'s institutions record whole. '
      + 'Its reader is the roster assembler\'s eligibility roll (rowRoll), which reads the rule on the catalog '
      + 'row before that row is admitted and copied, inside src/generators behind the closure STOP. What a '
      + 'player is shown is the roster the rule produced, never the rule; the stored copy itself is not '
      + 're-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer PLAUSIBLE at src/generators/steps/assembleInstitutions.js:292',
  }),
  Object.freeze({
    identity: 'tradeRouteRequired on institutions',
    key: 'tradeRouteRequired',
    shape: 'institutions',
    writer: 'src/data/institutionalCatalog.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/steps/assembleInstitutions.js',
      symbol: 'rowRoll, the assembler\'s eligibility roll, which reads the catalog rule before the row is admitted',
    }),
    why: 'A catalog eligibility rule, not a fact about the town: the institution catalog carries '
      + '`tradeRouteRequired` on its row, and the row is spread onto the settlement\'s institutions record '
      + 'whole. Its reader is the roster assembler\'s eligibility roll (rowRoll), which reads the rule on the '
      + 'catalog row before that row is admitted and copied, inside src/generators behind the closure STOP. '
      + 'What a player is shown is the roster the rule produced, never the rule; the stored copy itself is '
      + 'not re-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer PLAUSIBLE at src/generators/steps/assembleInstitutions.js:286',
  }),
  Object.freeze({
    identity: 'dependencyCount on metrics',
    key: 'dependencyCount',
    shape: 'metrics',
    writer: 'src/generators/economy/viability.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/edit/recordInvariants.js',
      symbol: 'the V-DEPCOUNT invariant, which checks the stored count against the dependency list it counts',
    }),
    why: 'A count of a list printed in its own right (the viability dependencies). The record invariants read '
      + 'it (recordInvariants.js:337, V-DEPCOUNT) to prove the stored count still agrees with the list after '
      + 'an edit; a consistency check, not a customer fact, since the list itself is what a player reads.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer CONFIRMED at src/domain/edit/recordInvariants.js:337',
  }),
  Object.freeze({
    identity: 'warningCount on metrics',
    key: 'warningCount',
    shape: 'metrics',
    writer: 'src/generators/economy/viability.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/edit/recordInvariants.js',
      symbol: 'the V-WARNCOUNT invariant, which checks the stored count against the warning list it counts',
    }),
    why: 'A count of a list printed in its own right (the structural warnings). The record invariants read it '
      + '(recordInvariants.js:338, V-WARNCOUNT) to prove the stored count still agrees with the list after an '
      + 'edit; a consistency check, not a customer fact, since the warnings themselves are what a player '
      + 'reads.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section ECO), consumer CONFIRMED at src/domain/edit/recordInvariants.js:338',
  }),
  // MERGE-R2 (2026-11-07): `randomDepletionEligible on resourceConditions` LEFT this register by clause S (BANK THE WIN):
  // at the merged tip the identity is LIT-NAME — the rung-2 landing's closures reach a reader that names the key
  // (its writer-reach row reads dossier-pdf=N foundry=N on that side, web-transitive=N alone on the integration side
  // that registered it, W6 ECO ba1737b88). Struck with that cause (PLAUSIBLE: the surface that names it is the tool's).
  // W2 DEF (2026-11-07, the third seat): `magicDependent on _isolationSupport` and `requiredCapacity on
  // _isolationSupport` LEFT this register by clause S. W6 (section DEF) convicted them engine-internal (the
  // structural validator reads the effective-config twin); once DS-DEF-12 read the settlement's own
  // `isolationSupport.{magicDependent, requiredCapacity}` on the Viability tab, the same key names are read inside
  // the web-display closure and both twins grade LIT-NAME, not DARK. Retired with that cause; the validator's read
  // is unchanged.
  Object.freeze({
    identity: 'cascadeAdded on charter',
    key: 'cascadeAdded',
    shape: 'charter',
    writer: 'src/generators/cascadeGenerator.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/generationOwnership.js',
      symbol: 'hasCascadeProvenance, the provenance law that reads the stamp on an institution record',
    }),
    why: 'The cascade provenance stamp, carried on the defence profile\'s charter bucket because that bucket '
      + 'holds the institution rows themselves (defenseInstitutionBuckets.js filters the roster by '
      + 'reference). Its reader is the provenance law hasCascadeProvenance, which reads the stamp on an '
      + 'institution record so regeneration and the borrowed-seat clear know the row arrived by a cascade '
      + 'roll. Plumbing, not a fact about the town; the bucket\'s own saved copy is not re-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section DEF), consumer PLAUSIBLE at src/domain/generationOwnership.js:119',
  }),
  Object.freeze({
    identity: 'cascadeAdded on garrison',
    key: 'cascadeAdded',
    shape: 'garrison',
    writer: 'src/generators/cascadeGenerator.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/generationOwnership.js',
      symbol: 'hasCascadeProvenance, the provenance law that reads the stamp on an institution record',
    }),
    why: 'The cascade provenance stamp, carried on the defence profile\'s garrison bucket because that bucket '
      + 'holds the institution rows themselves (defenseInstitutionBuckets.js filters the roster by '
      + 'reference). Its reader is the provenance law hasCascadeProvenance, which reads the stamp on an '
      + 'institution record so regeneration and the borrowed-seat clear know the row arrived by a cascade '
      + 'roll. Plumbing, not a fact about the town; the bucket\'s own saved copy is not re-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section DEF), consumer PLAUSIBLE at src/domain/generationOwnership.js:119',
  }),
  Object.freeze({
    identity: 'cascadeAdded on magicDef',
    key: 'cascadeAdded',
    shape: 'magicDef',
    writer: 'src/generators/cascadeGenerator.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/generationOwnership.js',
      symbol: 'hasCascadeProvenance, the provenance law that reads the stamp on an institution record',
    }),
    why: 'The cascade provenance stamp, carried on the defence profile\'s magicDef bucket because that bucket '
      + 'holds the institution rows themselves (defenseInstitutionBuckets.js filters the roster by '
      + 'reference). Its reader is the provenance law hasCascadeProvenance, which reads the stamp on an '
      + 'institution record so regeneration and the borrowed-seat clear know the row arrived by a cascade '
      + 'roll. Plumbing, not a fact about the town; the bucket\'s own saved copy is not re-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section DEF), consumer PLAUSIBLE at src/domain/generationOwnership.js:119',
  }),
  Object.freeze({
    identity: 'cascadeAdded on walls',
    key: 'cascadeAdded',
    shape: 'walls',
    writer: 'src/generators/cascadeGenerator.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/generationOwnership.js',
      symbol: 'hasCascadeProvenance, the provenance law that reads the stamp on an institution record',
    }),
    why: 'The cascade provenance stamp, carried on the defence profile\'s walls bucket because that bucket '
      + 'holds the institution rows themselves (defenseInstitutionBuckets.js filters the roster by '
      + 'reference). Its reader is the provenance law hasCascadeProvenance, which reads the stamp on an '
      + 'institution record so regeneration and the borrowed-seat clear know the row arrived by a cascade '
      + 'roll. Plumbing, not a fact about the town; the bucket\'s own saved copy is not re-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section DEF), consumer PLAUSIBLE at src/domain/generationOwnership.js:119',
  }),
  Object.freeze({
    identity: 'cellA on gates',
    key: 'cellA',
    shape: 'gates',
    writer: 'src/domain/spatial/spatialDigest.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/worldPulse/demographicsLand.js',
      symbol: 'the land-demographics reader, which takes the parent territory\'s own crossing cell from the gate',
    }),
    why: 'A map grid cell id: one side of the cheapest border crossing between two territories, built once at '
      + 'the campaign\'s canonize. The land-demographics reader takes the parent\'s own crossing cell from the '
      + 'gate (demographicsLand.js:223); grid ids are engine coordinates, and a player is shown the routes '
      + 'and neighbours they produce, never a cell number.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section DEF), consumer CONFIRMED at src/domain/worldPulse/demographicsLand.js:223',
  }),
  Object.freeze({
    identity: 'cellB on gates',
    key: 'cellB',
    shape: 'gates',
    writer: 'src/domain/spatial/spatialDigest.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/worldPulse/demographicsLand.js',
      symbol: 'the land-demographics reader, which takes the parent territory\'s own crossing cell from the gate',
    }),
    why: 'A map grid cell id: one side of the cheapest border crossing between two territories, built once at '
      + 'the campaign\'s canonize. The land-demographics reader takes the parent\'s own crossing cell from the '
      + 'gate (demographicsLand.js:223); grid ids are engine coordinates, and a player is shown the routes '
      + 'and neighbours they produce, never a cell number.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section DEF), consumer CONFIRMED at src/domain/worldPulse/demographicsLand.js:223',
  }),
  Object.freeze({
    identity: 'forbiddenTradeRoutes on magicDef',
    key: 'forbiddenTradeRoutes',
    shape: 'magicDef',
    writer: 'src/data/institutionalCatalog.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/steps/assembleInstitutions.js',
      symbol: 'rowRoll, the assembler\'s eligibility roll, which reads the catalog rule before the row is admitted',
    }),
    why: 'A catalog eligibility rule, not a fact about the town: the institution catalog carries '
      + '`forbiddenTradeRoutes` on its row, and the row is spread onto the settlement\'s magical-defence '
      + 'record whole. Its reader is the roster assembler\'s eligibility roll (rowRoll), which reads the rule '
      + 'on the catalog row before that row is admitted and copied, inside src/generators behind the closure '
      + 'STOP. What a player is shown is the roster the rule produced, never the rule; the stored copy itself '
      + 'is not re-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section DEF), consumer PLAUSIBLE at src/generators/steps/assembleInstitutions.js:291',
  }),
  Object.freeze({
    identity: 'locks on campaignState',
    key: 'locks',
    shape: 'campaignState',
    writer: 'src/lib/saves.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/hooks/useReaderAudience.js',
      symbol: 'the reader-audience hook, which asks whether any save carries a regeneration lock',
    }),
    why: 'The user\'s own "keep this" locks for regeneration: editor and regen plumbing, minted empty at save '
      + 'birth. The reader-audience hook reads campaignState.locks across saves (useReaderAudience.js:173) '
      + 'and the regen path preserves what they name; a lock is the user\'s instruction to the engine, not a '
      + 'fact about the town.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section POW), consumer CONFIRMED at src/hooks/useReaderAudience.js:173',
  }),
  Object.freeze({
    identity: 'generatedAs on npcs',
    key: 'generatedAs',
    shape: 'npcs',
    writer: 'src/generators/factionRoles.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/worldPulse/magicFormsPractitioner.js',
      symbol: 'isMagicPractitioner, which reads the provenance marker before classifying a person by role',
    }),
    why: 'A provenance marker naming the generator path that minted the person (faction_structural, instant, '
      + 'practitioner), written "for migration and debugging". The practitioner law reads it '
      + '(magicFormsPractitioner.js:127) to recognise a person its own lane minted; the player is shown the '
      + 'person, their role and their office, never the path that made them.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section POW), consumer CONFIRMED at src/domain/worldPulse/magicFormsPractitioner.js:127',
  }),
  Object.freeze({
    identity: 'generatedAs on members',
    key: 'generatedAs',
    shape: 'members',
    writer: 'src/generators/factionRoles.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/domain/worldPulse/magicFormsPractitioner.js',
      symbol: 'isMagicPractitioner, which reads the provenance marker before classifying a person by role',
    }),
    why: 'A provenance marker naming the generator path that minted the person (faction_structural, instant, '
      + 'practitioner), written "for migration and debugging". The practitioner law reads it '
      + '(magicFormsPractitioner.js:127) to recognise a person its own lane minted; the player is shown the '
      + 'person, their role and their office, never the path that made them. The faction member list carries '
      + 'the roster\'s records; whether its own saved copy is re-read is not measured.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section POW), consumer PLAUSIBLE at src/domain/worldPulse/magicFormsPractitioner.js:127',
  }),
  Object.freeze({
    identity: '_routeIntent on config',
    key: '_routeIntent',
    shape: 'config',
    writer: 'src/generators/steps/resolveConfig.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/structuralValidator.js',
      symbol: 'the isolation check, which treats an explicitly chosen isolated route as the DM\'s intent',
    }),
    why: 'Provenance of the user\'s choice: whether the trade route was rolled at random or chosen. The '
      + 'structural validator reads it (structuralValidator.js:699) so an isolation the DM chose is not '
      + 'repaired away; the route itself is LIT, and the user already knows whether they chose it.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section META), consumer CONFIRMED at src/generators/structuralValidator.js:699',
  }),
  Object.freeze({
    identity: 'nearbyResourceDefinitions on config',
    key: 'nearbyResourceDefinitions',
    shape: 'config',
    writer: 'src/generators/steps/resolveResources.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/foodGenerator.js',
      symbol: 'the food generator, which reads the custom resource definitions to count the food a custom resource '
        + 'yields',
    }),
    why: 'Content identity sidecars (refId and localUid) for custom nearby resources, so a custom resource '
      + 'keeps its identity through regeneration and import. The food generator reads them on the config '
      + '(foodGenerator.js:85); the resource NAMES are LIT through nearbyResources, and an identity sidecar '
      + 'is not a fact a player reads.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section META), consumer CONFIRMED at src/generators/foodGenerator.js:85',
  }),
  Object.freeze({
    identity: 'nearbyResourceDefinitionsDepleted on config',
    key: 'nearbyResourceDefinitionsDepleted',
    shape: 'config',
    writer: 'src/generators/steps/resolveResources.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/foodGenerator.js',
      symbol: 'the food generator, which reads the custom resource definitions to count the food a custom resource '
        + 'yields',
    }),
    why: 'Content identity sidecars (refId and localUid) for custom nearby resources, so a custom resource '
      + 'keeps its identity through regeneration and import. The food generator reads them on the config '
      + '(foodGenerator.js:90); the resource NAMES are LIT through nearbyResources, and an identity sidecar '
      + 'is not a fact a player reads.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section META), consumer CONFIRMED at src/generators/foodGenerator.js:90',
  }),
  Object.freeze({
    identity: 'slavery on contentBoundaries',
    key: 'slavery',
    shape: 'contentBoundaries',
    writer: 'src/domain/generationContentProfile.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/economy/economicState.js',
      symbol: 'the slave-trade export gate, which may draw that trade only where both boundaries allow it',
    }),
    why: 'A generation content gate the user set in the configuration panel: whether this theme may appear in '
      + 'generated content. The economy reads the resolved profile\'s boundary (economicState.js:600-601) '
      + 'before it may draw a slave trade; the stored config copy is spread from that same profile '
      + '(resolveConfig.js:208) and is not itself re-read. A permission is not a fact about the world.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section META), consumer PLAUSIBLE at src/generators/economy/economicState.js:600',
  }),
  Object.freeze({
    identity: 'human_trafficking on contentBoundaries',
    key: 'human_trafficking',
    shape: 'contentBoundaries',
    writer: 'src/domain/generationContentProfile.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/economy/economicState.js',
      symbol: 'the slave-trade export gate, which may draw that trade only where both boundaries allow it',
    }),
    why: 'A generation content gate the user set in the configuration panel: whether this theme may appear in '
      + 'generated content. The economy reads the resolved profile\'s boundary (economicState.js:600-601) '
      + 'before it may draw a slave trade; the stored config copy is spread from that same profile '
      + '(resolveConfig.js:208) and is not itself re-read. A permission is not a fact about the world.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section META), consumer PLAUSIBLE at src/generators/economy/economicState.js:601',
  }),
  Object.freeze({
    identity: 'anyActive on flags',
    key: 'anyActive',
    shape: 'flags',
    writer: 'src/generators/priorityHelpers.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/npcGenerator.js',
      symbol: 'the relationship-tension draw, which reads the compound-situation summary flag before weighting ties',
    }),
    why: 'A derived gate: the OR of the compound-situation flags beside it. getStressFlags writes it, and the '
      + 'NPC relationship draw reads it on its own call of the same producer (npcGenerator.js:1608, :1653); '
      + 'the stored copy on the safety profile is not itself re-read. The flags it summarises are the facts '
      + '(W2, W34 say them); their OR is not.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section META), consumer PLAUSIBLE at src/generators/npcGenerator.js:1653',
  }),
  Object.freeze({
    identity: 'religion on raw',
    key: 'religion',
    shape: 'raw',
    writer: 'src/generators/priorityHelpers.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/priorityHelpers.js',
      symbol: 'getInstFlags, which reads the religion slider into religionInfluence on the object it stores as raw',
    }),
    why: 'The raw religion priority slider, a copy of config.priorityReligion, which is LIT. getInstFlags '
      + 'reads it (priorityHelpers.js:356, :422) to compute religionInfluence on the very object it then '
      + 'stores as raw (:446); what drives the town is the computed influence, and the slider is the DM\'s own '
      + 'input.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section META), consumer CONFIRMED at src/generators/priorityHelpers.js:422',
  }),
  Object.freeze({
    identity: 'religion on priorities',
    key: 'religion',
    shape: 'priorities',
    writer: 'src/generators/priorityHelpers.js',
    reason: 'engine-internal',
    consumer: Object.freeze({
      file: 'src/generators/economy/viability.js',
      symbol: 'the viability expectation check, which reads the religion priority to expect a religious centre',
    }),
    why: 'The religion priority slider again, copied onto economicState.priorities by getPriorities; the LIT '
      + 'fact is config.priorityReligion. The viability check reads the slider on its own getPriorities call '
      + '(viability.js:208, :333) to expect a religious centre; the stored copy is not itself re-read.',
    charter: 'ODQ §934.105 (the cloud chair\'s WIRING ruling R-W2, 2026-11-07, WIRING-RULINGS-2026-11-07.md; lane '
      + 'W6, section META), consumer PLAUSIBLE at src/generators/economy/viability.js:333',
  }),
]);

const SECTION = /§\d+/;
const WRITER_PATH = /^src\/[^\s]*\.(js|jsx)$/;
const IDENTITY = /^\S+ on \S+$/;

/**
 * THE STRUCTURAL LAW — runs at module load. A malformed row must be impossible to
 * ship, not merely reported: an unverifiable row that survives to the gate has
 * already done its damage by looking like a decision.
 */
export function assertWriterDarkRegister(entries = WRITER_DARK_REGISTER) {
  if (!Array.isArray(entries)) throw new Error('writer dark register must be an array');
  const seen = new Set();
  for (const row of entries) {
    const label = JSON.stringify(row?.identity ?? row);
    if (!row || typeof row !== 'object') throw new Error(`writer dark register row is not an object: ${label}`);
    if (!DARK_REASONS.includes(row.reason)) {
      throw new Error(`writer dark register row ${label} carries an unknown reason ${JSON.stringify(row.reason)};`
        + ` the closed set is ${DARK_REASONS.join(', ')}.`);
    }
    const fields = Object.keys(row).sort().join(',');
    if (fields !== CANONICAL_FIELDS[row.reason]) {
      throw new Error(`writer dark register row ${label} (${row.reason}) has noncanonical fields: got`
        + ` [${fields}], expected [${CANONICAL_FIELDS[row.reason]}]. A foreign field is a claim nothing checks.`);
    }
    if (!IDENTITY.test(row.identity)) {
      throw new Error(`writer dark register row ${label} is not a "<key> on <shape>" identity`);
    }
    parseLeafBaselineIdentity(row.identity);
    if (row.identity !== `${row.key} on ${row.shape}`) {
      throw new Error(`writer dark register row ${label} does not name its own key and shape:`
        + ` expected ${JSON.stringify(`${row.key} on ${row.shape}`)}`);
    }
    if (seen.has(row.identity)) throw new Error(`writer dark register row ${label} is DUPLICATED`);
    seen.add(row.identity);
    if (!WRITER_PATH.test(row.writer)) {
      throw new Error(`writer dark register row ${label} names a writer that is not a repo-relative src/ module:`
        + ` ${JSON.stringify(row.writer)}`);
    }
    if (!SECTION.test(row.charter)) {
      throw new Error(`writer dark register row ${label} carries no chartering section in "charter"`);
    }
    const prose = row.reason === 'dark-by-construction' ? row.lighting : row.why;
    if (typeof prose !== 'string' || prose.length < 80) {
      throw new Error(`writer dark register row ${label} must explain itself in at least 80 characters;`
        + ` got ${prose?.length ?? 0}. A row nobody can read is a row nobody can veto.`);
    }
    if (row.reason === 'dark-by-construction') {
      assertDoor(row);
      if (!SECTION.test(row.car)) throw new Error(`writer dark register row ${label} carries no § in "car"`);
    }
    if (row.reason === 'engine-internal') {
      if (!row.consumer || typeof row.consumer.file !== 'string' || typeof row.consumer.symbol !== 'string') {
        throw new Error(`writer dark register row ${label} must name a consumer { file, symbol }`);
      }
    }
    if (row.reason === 'pending-surface') {
      if (!COUNTING_CLASSES.includes(row.surface)) {
        throw new Error(`writer dark register row ${label} names surface ${JSON.stringify(row.surface)}, which is not`
          + ` a COUNTING class. A pending surface is one a customer will SEE; the counting classes are`
          + ` ${COUNTING_CLASSES.join(', ')}.`);
      }
      if (!SECTION.test(row.car)) throw new Error(`writer dark register row ${label} carries no § in "car"`);
      if (typeof row.carArtifact !== 'string' || !row.carArtifact) {
        throw new Error(`writer dark register row ${label} must name an in-tree carArtifact; a § alone is not`
          + ' existence-checkable from the build worktree.');
      }
    }
  }
  return entries;
}

function assertDoor(row) {
  const label = JSON.stringify(row.identity);
  const door = row.door;
  if (!door || !['simulation-flag', 'generation-dial'].includes(door.kind)) {
    throw new Error(`writer dark register row ${label} carries an unknown door kind ${JSON.stringify(door?.kind)}`);
  }
  if (door.kind === 'simulation-flag') {
    if (!SIMULATION_FLAG_PATTERN.test(door.flag ?? '')) {
      throw new Error(`writer dark register row ${label} names a simulation flag that is not spelled`
        + ` <name>Enabled: ${JSON.stringify(door.flag)}`);
    }
    return;
  }
  for (const field of ['configKey', 'dialModule', 'dialExport', 'litModule', 'litExport']) {
    if (typeof door[field] !== 'string' || !door[field]) {
      throw new Error(`writer dark register row ${label} generation-dial door is missing ${field}`);
    }
  }
  if (!door.configKey.startsWith('_')) {
    throw new Error(`writer dark register row ${label} generation-dial configKey must start with "_":`
      + ` ${JSON.stringify(door.configKey)}`);
  }
  for (const field of ['dialModule', 'litModule']) {
    if (!door[field].startsWith('src/domain/')) {
      throw new Error(`writer dark register row ${label} generation-dial ${field} must live under src/domain/:`
        + ` ${JSON.stringify(door[field])}`);
    }
  }
}

/**
 * THE CONVICTION ARM — every scan, throwing `UNVERIFIABLE (clause n)`.
 *
 * W       the writer still writes the key, in one of the four measured spellings.
 * D-flag  REUSED VERBATIM from OSR's `assertVirtualDormantWriterEvidence` — one
 *         conviction machinery for one claim shape, rather than a second copy
 *         that can drift from the first.
 * D-dial  the shipped dial differs from the lit one, EXECUTED, and (once Car 3's
 *         arm exists) the identity is in `dialGated`. A dormancy claim is a bit.
 * E       the consumer exists, READS the key in CODE, and is in NO counting
 *         closure — else that identity would be LIT and the row is wrong.
 * P       the car cites a section AND resolves to an in-tree artifact that names
 *         the fact; the surface is a counting class the identity does not reach;
 *         the population is within its banked ceiling.
 * S       the identity is still DARK. A row that outlives its darkness is a WIN
 *         to be banked, not a row to be kept.
 */
export async function assertWriterDarkRegisterEvidence(entries = WRITER_DARK_REGISTER, {
  root,
  verdicts = null,
  closures = null,
  dialGated = null,
  pendingCeiling = null,
  readSource = (path) => readFileSync(join(root, path), 'utf8'),
  fileExists = (path) => existsSync(join(root, path)),
  importModule = (path) => import(join(root, path)),
  virtualEvidence = assertVirtualDormantWriterEvidence,
} = {}) {
  const evidence = [];
  let pending = 0;
  for (const row of entries) {
    const label = JSON.stringify(row.identity);
    const fail = (clause, message) => {
      throw new Error(`writer-reach dark register row ${label} is UNVERIFIABLE (clause ${clause}): ${message}`);
    };

    // ── W — REASON-AWARE (chair, ledger §882.15) ──
    const isDialRow = row.reason === 'dark-by-construction' && row.door.kind === 'generation-dial';
    let writerSource;
    try { writerSource = readSource(row.writer); } catch {
      fail('W', `its writer cannot be read: ${row.writer}`);
    }
    let spellings = writeShapesIn(writerSource, row.key);
    let writeProof;

    if (isDialRow) {
      // ⭐ THE WIDENING, AND IT IS NARROW BY CONSTRUCTION. A generation-dial row's
      // key is written on a world nobody ships, so the TEXT probe is the wrong
      // instrument twice over: `customContentRoster` is written by ASSIGNMENT
      // (`finalCtx.settlement.customContentRoster = …`) and `densityRungRole`
      // through a COMPUTED PROPERTY KEY behind a constant (`[RUNG_ROLE_FIELD]: …`),
      // and neither is one of OSR's four measured spellings. Clause W therefore
      // convicted both as "the writer stopped writing", which is FALSE — the estate
      // says so itself at src/generators/density/titularSuccession.js:29:
      // "`densityRungRole` (`RUNG_ROLE_FIELD`) has been WRITTEN since D1 and READ
      // BY NOTHING."
      //
      // So for THIS REASON ONLY the write proof is MEMBERSHIP IN `dialGated` — the
      // write OBSERVED BY EXECUTION (present in a lit corpus, absent from a shipped
      // one) rather than inferred from source text. It is strictly stronger than the
      // probe it replaces, and it is scoped: every other reason keeps the text probe,
      // so a row that merely writes by assignment gains nothing from this clause.
      //
      // ⛔ AND IT NEVER PASSES ON MISSING EVIDENCE. Without a measured `dialGated`
      // the row is UNVERIFIABLE, not excused — an absent measurement is the one
      // input a conviction clause must never read as innocence.
      if (!dialGated) {
        fail('W', 'it is a generation-dial row and no measured dialGated set was supplied, so its write cannot'
          + ' be observed. A dormancy claim is a BIT claim; build the lit corpus or strike the row. An absent'
          + ' measurement is not an acquittal.');
      }
      if (!dialGated.has(row.identity)) {
        fail('W', `it is not in the measured dialGated set, so a lit world does not write it either and there is`
          + ' no dormancy to claim. A dormancy claim is a BIT claim: present lit, absent dark.');
      }
      writeProof = 'dialGated membership (executed: present lit, absent dark)';
      spellings = spellings.length ? spellings : ['(none — written by assignment or a computed key)'];
    } else {
      if (!spellings.length) {
        fail('W', `${row.writer} no longer writes ${JSON.stringify(row.key)} in any measured write spelling.`
          + ' A row whose writer stopped writing is a row about nothing; strike it.');
      }
      writeProof = `source text (${spellings.join(', ')})`;
    }

    if (row.reason === 'dark-by-construction' && row.door.kind === 'simulation-flag') {
      await virtualEvidence([{
        identity: row.identity, writer: row.writer, key: row.key, flag: row.door.flag,
        lighting: row.lighting, charter: row.charter,
      }], { root, readSource });
    }

    if (row.reason === 'dark-by-construction' && row.door.kind === 'generation-dial') {
      const dial = (await importModule(row.door.dialModule))[row.door.dialExport];
      const lit = (await importModule(row.door.litModule))[row.door.litExport];
      if (dial === lit) {
        fail('D-dial', `the shipped dial ${row.door.dialExport} already EQUALS the lit ${row.door.litExport}`
          + ` (${JSON.stringify(dial)}), so the key is written on every world and this read must be judged`
          + ' normally. Retire the row rather than outliving its own premise.');
      }
      // The membership half of this clause MOVED TO W (ledger §882.15): "is it
      // written" is W's question, and W now answers it with the same executed bit.
      // What remains here is the door itself — is the shipped dial still behind the
      // lit one — which is the question only this clause can ask.
    }

    if (row.reason === 'engine-internal') {
      if (!fileExists(row.consumer.file)) fail('E', `its consumer does not exist: ${row.consumer.file}`);
      const code = codeOnly(readSource(row.consumer.file));
      if (!new RegExp(`(?<![\\w$])${escapeForRegExp(row.key)}(?![\\w$])`).test(code)) {
        fail('E', `${row.consumer.file} does not READ ${JSON.stringify(row.key)} in code. A name that appears only`
          + ' in a comment or a string literal is prose, not a use — the citation law.');
      }
      if (closures) {
        for (const cls of COUNTING_CLASSES) {
          if ((closures[cls] || new Set()).has(row.consumer.file)) {
            fail('E', `${row.consumer.file} is inside the ${cls} closure, so this identity would be LIT and the`
              + ' row is wrong about its own reason.');
          }
        }
      }
    }

    if (row.reason === 'pending-surface') {
      pending += 1;
      if (!fileExists(row.carArtifact)) {
        fail('P', `its car names ${row.carArtifact}, which does not exist in this tree. A § is not`
          + ' existence-checkable from the build worktree; the artifact is what makes the citation resolvable.');
      }
      const artifact = readSource(row.carArtifact);
      if (!artifact.includes(row.key) && !artifact.includes(row.shape)) {
        fail('P', `${row.carArtifact} names neither ${JSON.stringify(row.key)} nor ${JSON.stringify(row.shape)},`
          + ' so it does not record the fact this row defers. A citation that does not mention its subject is a'
          + ' citation to nothing.');
      }
      const reached = verdicts?.get(row.identity)?.reach ?? {};
      if (reached[row.surface]) {
        fail('P', `the identity already reaches ${row.surface} at grade ${reached[row.surface]}, so that surface is`
          + ' not pending. Name a surface it does not reach, or bank the win.');
      }
    }

    if (verdicts) {
      const live = verdicts.get(row.identity);
      if (isDialRow) {
        // ── S, INVERTED FOR THIS REASON (chair, ledger §882.15) ──
        // A generation-dial identity is EXPECTED to be absent from the judged
        // population: that absence IS the dormancy this row claims. Convicting it
        // would convict every correct dial row. What convicts instead is PRESENCE,
        // in two flavours that need different instructions.
        if (live && live.verdict === 'LIT') {
          fail('S', `the identity is now ${live.verdict}. BANK THE WIN — strike the row; a lit-dial identity that`
            + ' gained a surface reader must be banked, never silently lit.');
        }
        if (live) {
          fail('S', `the dial has ROLLED: a shipped world now writes ${row.identity} (judged ${live.verdict}), so`
            + ' the dormancy premise is dead. Retire the generation-dial row and let the identity be judged'
            + ' normally, as an ordinary written key.');
        }
      } else {
        if (!live) {
          fail('S', 'the identity is not in the judged population at all. A row about a key no shape carries above'
            + ' MIN_ROWS is a row about nothing.');
        }
        if (live.verdict !== 'DARK') {
          fail('S', `the identity is now ${live.verdict}, not DARK. BANK THE WIN — strike the row; a registered row`
            + ' that outlives its darkness is an exemption nobody is watching.');
        }
      }
    }
    evidence.push({ identity: row.identity, reason: row.reason, writer: row.writer, spellings, writeProof });
  }

  if (pendingCeiling !== null && pending > pendingCeiling) {
    throw new Error(`writer-reach pending-surface population GREW: ${pending} rows against a banked ceiling of`
      + ` ${pendingCeiling}. The cohort is shrink-only — a row may leave, none may join — because a pending-surface`
      + ' row silences a DARK identity by a code-only edit. The one growth door is --rebank --charter=§NNN.');
  }
  return evidence;
}

function escapeForRegExp(text) { return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

/** READERREVIEW's seed — every pending-surface row, sorted by surface then identity. */
export function pendingSurfaceBacklog(entries = WRITER_DARK_REGISTER) {
  return entries
    .filter((row) => row.reason === 'pending-surface')
    .map((row) => ({
      identity: row.identity, key: row.key, shape: row.shape,
      surface: row.surface, car: row.car, carArtifact: row.carArtifact, why: row.why,
    }))
    .sort((a, b) => (a.surface === b.surface
      ? (a.identity < b.identity ? -1 : 1)
      : (a.surface < b.surface ? -1 : 1)));
}

/** The register's content address. It MOVES whenever a row is struck or added. */
export function registerDigestOf(entries = WRITER_DARK_REGISTER) {
  return createHash('sha256').update(canonicalJson(entries.map((row) => ({ ...row })))).digest('hex');
}

export { COUNTING_CLASSES, SURFACE_CLASSES };
