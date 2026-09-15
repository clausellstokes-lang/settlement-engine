/**
 * domain/fieldManifest.js — Wave 8 structural prevention: the two field
 * manifests, as data.
 *
 * Two bug classes kept regrowing faster than audits could weed them:
 *
 *   1. FROZEN-VS-LIVE — a generation-written field a long campaign
 *      contradicts because nothing marks whether the pulse must keep it
 *      live (`scores.disaster` froze for two days of work; the goods
 *      subsumption defect and the disaster freeze both appeared in NEW
 *      code written under the program's own discipline).
 *   2. DEAD WRITES — a field written "for the dossier" that no surface
 *      ever reads (`blockadeBypass`, `economicGates` until 1fd128e, the
 *      six dead reads of Wave 6 #1).
 *
 * This module turns both classes into DATA that a walking test
 * (tests/joins/fieldManifest.test.js) enforces with comment-stripped
 * source scans — the same idiom as neighbourRelDynamics' CONSUMER_FILES
 * and regionalChannelCreatable's UNCREATABLE allowlist.
 *
 * HONEST LIMIT: new, unlisted fields cannot be auto-detected. The
 * manifest's value is that the LISTED contracts can never silently break
 * — a refactor that stops the pulse writing a declared-live field, or
 * deletes the last reader of a registered engine field, fails a unit
 * test instead of surviving until the next multi-agent audit. Every new
 * generation-written, campaign-relevant field family is expected to add
 * a row here in the same change that introduces it (additive — parallel
 * packages append without conflict; `catalogId` joined this way the moment
 * the entity-identity package landed).
 *
 * Regex fields are STRING SOURCES (compiled by the test) so this stays a
 * pure data module. Paths are repo-root-relative with forward slashes.
 */

// ── Manifest 1: frozen-vs-live ─────────────────────────────────────────────
// Every generation-written, campaign-relevant field family, declared as:
//   mode 'live'     — the pulse must keep it true; pulseWriter names the
//                     ONE 'file#function' responsible, and the walking
//                     test verifies that file still writes the field
//                     (writeProbe overrides the default `field:` scan for
//                     shorthand-property writers).
//   mode 'snapshot' — a generation verdict; display may show it, but it
//                     must NEVER be preferred over a declared live
//                     sibling. `guards` pin the preference pattern at the
//                     declared sites (mustMatch keeps a required fallback
//                     chain alive; mustNotMatch bans the bug pattern).
export const FROZEN_VS_LIVE = Object.freeze([
  {
    path: 'defenseProfile.scores.disaster',
    field: 'disaster',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    displayRule: 'The Disasters & Famine row may prefer the persisted score ONLY because the '
      + 'writeback re-grades it through the persisted gate every tick; legacy saves without it '
      + 'must keep falling through to live resilienceScore.',
    guards: [{
      file: 'src/domain/display/defenseDisplay.js',
      mustMatch: 'scores\\.disaster\\s*\\?\\?\\s*r\\.economicState\\?\\.foodSecurity\\?\\.resilienceScore',
      why: 'legacy saves degrade gracefully: no persisted disaster score → live resilience',
    }],
  },
  {
    path: 'defenseProfile.scores.{military,internal,monster,economic,magical}',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdicts with NO live sibling — display-as-generated is honest '
      + 'today. Whichever package gives any of them a pulse writeback must flip its row to '
      + 'live and name the writer.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.storageMonths',
    field: 'storageMonths',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    displayRule: 'Displays read the tick-advanced stock, never a cached generation value.',
    guards: [],
  },
  {
    path: 'economicState.treasury.coin',
    field: 'coin',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/treasury.js#advanceTreasury',
    displayRule: 'UNIT: ABSOLUTE INTEGER STATE-COIN — never per-capita, never re-expressed '
      + 'in storage-months or in a band at rest. Bands (empty|lean|adequate|full|overflowing '
      + 'over coin/capacity) are DISPLAY derivations and arrive in a later car. Every read '
      + 'goes through the exported accessors coinOf() / treasuryCapacity(); no surface may '
      + 'hand-read the raw field, because a numeric field with no declared unit acquires a '
      + 'different unit at every consumer and nothing ever reds. The record is ABSENT until '
      + 'the first tick under a lit treasuryEnabled — a dark campaign carries no key, and a '
      + 'key is a byte. Capacity is DERIVED on every read and never persisted.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.resilienceScore',
    field: 'resilienceScore',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    // Shorthand property write (`resilienceScore,`) — the default `field:`
    // probe would miss it.
    writeProbe: '(?<![.\\w])resilienceScore\\s*,',
    displayRule: 'The storage slice is re-graded from the current granary each tick; the '
      + 'structural remainder is stashed once as stockpile.resilienceRest.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.deficitPct',
    field: 'deficitPct',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    displayRule: 'Displays read the EFFECTIVE deficit (blockade/famine/tithe/drawdown applied); '
      + 'the structural base lives in stockpile.baseDeficitPct.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.surplusPct',
    field: 'surplusPct',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/foodStockpile.js#advanceFoodStockpile',
    displayRule: 'Zeroed while an effective deficit holds; restored from the structural base.',
    guards: [],
  },
  {
    path: 'economicState.foodSecurity.{dailyNeed,dailyProduction}',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Deliberate snapshot — the food model is population-scale-invariant (audit '
      + 'REFUTED the freshness harm: ratios cancel; live re-derivation would be byte-identical). '
      + 'If refugee influxes should strain per-capita food, that is a model-design decision.',
    guards: [],
  },
  {
    // Wave 8 decision (recorded): resolution is LIVE-FIRST from the standing
    // institution roster; the verdict is FALLBACK ONLY for rosters with no
    // name signal either way (legacy/custom-renamed content). A roster whose
    // only sniffable transport lies removed/destroyed is a NEGATIVE signal —
    // the verdict is not consulted, and the next blockade takes the full cut.
    // magicExists gates both paths (the verdict encodes it; the resolver
    // re-checks it).
    path: 'economicState.foodSecurity.magicTradeChannel',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdict for the blockade-bypass channel. Consumers must derive '
      + 'the channel live-first from standing institutions (resolveBlockadeBypassChannel); a '
      + 'circle destroyed mid-campaign must not keep feeding a besieged city.',
    guards: [{
      file: 'src/domain/worldPulse/foodStockpile.js',
      mustMatch: 'resolveBlockadeBypassChannel',
      mustNotMatch: 'magicTradeChannel\\s*\\?\\?',
      why: 'the verdict-first preference (`fs.magicTradeChannel ?? sniff`) was the bug pattern',
    }, {
      file: 'src/domain/worldPulse/stressorGates.js',
      mustMatch: 'resolveBlockadeBypassChannel',
      mustNotMatch: '\\.magicTradeChannel',
      why: 'the deadzone gate read the raw verdict directly — consumers derive the channel live-first',
    }],
  },
  {
    path: 'powerStructure.factions[] (per-faction live state: capture rung, momentum band, rivals…)',
    field: 'updatedByPulse',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/factionCompetition.js#projectFactionStatesOntoSettlement',
    displayRule: 'Wave 7: faction live state projects onto powerStructure.factions with '
      + 'updatedByPulse provenance and identity no-ops; the dossier faction panel reads the '
      + 'projection, never worldState.factionStates directly.',
    guards: [],
  },
  {
    path: 'neighbourNetwork[].relationshipType',
    field: 'neighbourNetwork',
    mode: 'live',
    // RE-POINTED 2026-08-07: the god-module split moved this writer out of
    // applyWorldPulse.js into the relationship-graph leaf. The write itself never
    // stopped — applyWorldPulse.js still imports and calls it at two sites — so the
    // manifest's ADDRESS rotted, not the field. (Measured: the function is defined
    // once, in the file named below, and still writes neighbourNetwork.)
    pulseWriter: 'src/domain/worldPulse/applyWorldPulseRelationshipGraph.js#writeRelationshipLabelToNeighbourNetworks',
    displayRule: 'R3/H11: pulse relationship evolution writes back to both settlements’ '
      + 'neighbourNetwork links so dossier/threats/PDF/AI stop asserting stale labels.',
    guards: [],
  },
  {
    path: 'regionalGraph.edges[].relationshipType',
    field: 'relationshipType',
    mode: 'live',
    pulseWriter: 'src/domain/region/graph.js#deriveRegionalGraphFromSaves',
    displayRule: 'R3/H10: a rebuild refreshes the edge label from the live neighbour links '
      + 'instead of freezing it at first build.',
    guards: [],
  },
  {
    path: 'population',
    field: 'population',
    mode: 'live',
    pulseWriter: 'src/domain/worldPulse/populationDynamics.js#applyPopulationOutcomeToSettlement',
    writeProbe: '(?<![.\\w\'"`])population\\s*:',
    displayRule: 'Moves every tick (growth/loss/migration); no display may cache it.',
    guards: [],
  },
  {
    path: 'tier',
    field: 'tier',
    mode: 'live',
    // The applier moved VERBATIM to the tierOutcomeApply.js leaf (W2b byte-budget
    // extraction); tierResourceDynamics.js re-exports it, but the manifest names
    // the file that DEFINES the writer (the source-scan pin reads definitions).
    pulseWriter: 'src/domain/worldPulse/tierOutcomeApply.js#applyTierOutcomeToSettlement',
    writeProbe: '(?<![.\\w\'"`:])tier\\s*:',
    displayRule: 'Live BY PROPOSAL: tier moves only through the proposal gate, with the '
      + 're-verify-current-state apply guard (C2).',
    guards: [],
  },

  // ── The G5 generation-frozen record family (atlas owner-queue #28) ─────────
  // Owner-ratified 2026-07-27 ("do all of these" over the recorded queue), and
  // landed here in Wave R-5b. These five records are written ONCE, during
  // generation, and no event, edit, or pulse path recomputes them — the atlas
  // gap G5 (docs/SETTLEMENT_CAPABILITY_ATLAS.md Part VII #28) is exactly this
  // family. The DISPLAY side already shipped in Waves R-0/R-2 (first-survey
  // framing on every render site, pinned in
  // tests/components/frozenTenseDefenseCopy.test.js,
  // tests/components/g5FirstSurveyCopy.test.js and
  // tests/components/g5FirstSurveyPdfTwins.test.js). These rows DECLARE that
  // contract as manifest data so the next package that gives any of them a
  // pulse writeback has to flip its row and name its writer.
  //
  // `guards: []` follows the defenseProfile.scores precedent above: a snapshot
  // guard exists to stop a frozen field being PREFERRED over a declared-live
  // sibling, and none of these five has a live sibling to be preferred over
  // (the two near-twins are named per row and are re-derivations, not
  // writebacks). The display copy is one-string vetoable and already pinned in
  // the three copy suites above; re-pinning it here would turn a deliberate
  // reword into a four-file edit. The mechanical half of the contract — that
  // no worldPulse writer has quietly started keeping one of them live — is
  // walked in tests/joins/fieldManifest.test.js.
  {
    path: 'economicViability',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdict with NO live sibling: display-as-generated is honest today, '
      + 'and every render site says so (first-survey framing). deriveViability reconciles the '
      + 'SUMMARY SENTENCE only; the coherence badge, the critical-issue pill and the issue lists '
      + 'all read this frozen record. Whichever package gives it a pulse writeback must flip this '
      + 'row to live and name the writer.',
    guards: [],
  },
  {
    path: 'structuralViolations',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdict with NO live sibling: display-as-generated is honest today, '
      + 'and its render sites carry the survey vintage. The draft-phase checkDraftEdit twin is a '
      + 'LIVE re-derivation, not a writeback, and the two are allowed to disagree after edits by '
      + 'design. Whichever package gives this record a pulse writeback must flip this row to live '
      + 'and name the writer.',
    guards: [],
  },
  {
    path: 'structuralSuggestions',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdict with NO live sibling: display-as-generated is honest today, '
      + 'and its render sites carry the survey vintage. Same producer pass as structuralViolations '
      + 'and it must travel with it; the checkDraftEdit twin re-derives the same suggestions live '
      + 'in draft phase without writing them back. Whichever package gives this record a pulse '
      + 'writeback must flip this row to live and name the writer.',
    guards: [],
  },
  {
    path: 'coherenceNotes',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdict with NO live sibling: display-as-generated is honest today, '
      + 'and its render sites carry the survey vintage. Narrative-age record, stamped once by the '
      + 'canonical-coherence substream and read back by the generation receipt; nothing re-runs '
      + 'the narrative-vs-mechanical agreement check afterwards. Whichever package gives it a '
      + 'pulse writeback must flip this row to live and name the writer.',
    guards: [],
  },
  {
    path: 'defenseProfile.magicDependency',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdict with NO live sibling: display-as-generated is honest today, '
      + 'and its render sites carry the survey vintage. Widest blast radius of the five, because '
      + 'it is not display-only: worldPulse/stressorGates.js gates a live stressor on this frozen '
      + 'flag, so a campaign that loses its magical supply chains keeps the gate. Whichever '
      + 'package gives it a pulse writeback must flip this row to live and name the writer.',
    guards: [],
  },
  {
    // ── pdf.7's STRUCTURAL HALF (A+ Track G, landed by LT37 car 6) ──────────
    // THE THIRD AXIS OF FIELD ROT. The two manifests above govern a field a long
    // campaign contradicts (frozen-vs-live) and a field nobody reads (dead
    // writes). This row governs the third: a field two surfaces both render from
    // DIFFERENT sources, which is how the screen and the PDF drift apart while
    // every parity test stays green.
    //
    // WHY THIS ROW AND NOT A `consumerProbe` KEY. pdf.7's text guesses a key
    // shape this module does not have (`grep -c consumerProbe` was 0 at
    // f73bdbf16, and still is). The manifest's real idiom for "the generator
    // wrote a verdict, and consumers must derive the live answer instead of
    // reading it" is a SNAPSHOT row whose `guards` carry mustMatch/mustNotMatch
    // at the named display sites, exactly as the magicTradeChannel row above
    // does. So the parity contract is registered in that idiom: the VALUE half
    // of the contract stays where it already lives and is walked value-by-value
    // (SHARED_FIELDS in src/domain/display/parityContract.js, exercised by
    // tests/pdf/viewModelParity.test.js and goldenViewModel.test.js); this row
    // adds the SOURCE half pdf.7 actually asked for, which is the probe that
    // reds when a converged tab regresses to reading the raw engine struct.
    //
    // ⚠ src/components/new/dailyLifeLogic.js IS DELIBERATELY NOT GUARDED HERE,
    // and that exclusion is the point rather than a hole. It reads
    // `fb.deficitPercent` at :54 and DailyLifeTab bands food pressure on it, so
    // guarding it would red the gate today. LT37 car 5 MEASURED that read over
    // 360 generated settlements: 337 exact agreements, 21 one-point spreads, 2
    // two-point spreads, and the band word identical in all 360, the spread
    // being double rounding inside foodBalance.js's canonical reconcile. Routing
    // it through deriveFoodBalance is therefore an OUTPUT-MOVING change with a
    // measured-small blast radius, it went up under 764.3, and THE CHAIR REFUSED
    // IT on that measurement (2026-09-15): a cure that moves zero band words buys
    // no reader-visible correctness. So the second read is TOLERATED DELIBERATELY
    // and this exclusion is permanent until a new measurement moves the band. The
    // record of the refusal, with the patch and the rows it would have moved, is
    // docs/implementation/LT37-dailylife-food-deficit-cure.md.
    path: 'economicViability.metrics.foodBalance.deficitPercent (the PARITY axis: screen vs PDF source)',
    field: null,
    mode: 'snapshot',
    pulseWriter: null,
    displayRule: 'Generation verdict for the food deficit percentage, written by '
      + 'generators/economy/foodBalance.js. The CONVERGED dossier surfaces must read the '
      + 'percentage through deriveFoodBalance (residual over daily need), the same derivation '
      + 'src/pdf/lib/viewModel.js uses, so the screen and the exported PDF can never print two '
      + 'different numbers under one label. A tab that goes back to the raw engine field is the '
      + 'drift pdf.2 and pdf.3 exist to kill, and the guards below are where it is caught. Known '
      + 'and deliberate exclusion: src/components/new/dailyLifeLogic.js still reads the engine '
      + 'field; LT37 car 5 measured the spread at 0 to 2 points with no band movement across 360 '
      + 'settlements, and the cure was REFUSED on that measurement because it can move on-screen '
      + 'output and buys no reader-visible correctness. The exclusion is permanent until a new '
      + 'measurement moves the band.',
    guards: [{
      file: 'src/components/new/tabs/EconomicsTab.jsx',
      mustMatch: 'deriveFoodBalance',
      mustNotMatch: '\\.deficitPercent',
      why: 'pdf.3 converged this tab onto the shared derivation; a raw engine read here is the '
        + 'exact regression that put the screen and the PDF on two numbers',
    }, {
      file: 'src/components/new/SummaryTab.jsx',
      mustMatch: 'deriveFoodBalance',
      mustNotMatch: '\\.deficitPercent',
      why: 'the other half of the pdf.3 convergence; the DM summary and the PDF overview print '
        + 'the same food fact and must read it from one place',
    }],
  },
]);

// ── Manifest 2: producer/consumer registry (dead-field CI) ────────────────
// DM-facing, engine-written fields with their intended consumer files. The
// walking test fails when the producer no longer writes a registered field
// (read with no writer) or when NO consumer file still reads it (dead
// write). Seeded with the fields this program fixed; additive by design.
// Probes are regex sources; defaults in the test cover `field:` /
// `.field =` writes and `.field` reads.
export const ENGINE_FIELD_REGISTRY = Object.freeze([
  {
    field: 'economicGates',
    path: 'defenseProfile.economicGates',
    producer: 'src/generators/defenseGenerator.js',
    consumers: [
      'src/domain/display/defenseDisplay.js',   // funding attribution per readiness row
      'src/domain/worldPulse/foodStockpile.js', // disaster gate for the live writeback
    ],
  },
  {
    field: 'disaster',
    path: 'defenseProfile.scores.disaster',
    producer: 'src/generators/defenseGenerator.js',
    consumers: ['src/domain/display/defenseDisplay.js'],
  },
  {
    field: 'magicNote',
    path: 'economicState.activeChains[].magicNote',
    producer: 'src/generators/chainMagicSubstitution.js',
    consumers: [
      'src/domain/supplyChainState.js',
      'src/domain/worldPulse/stressorGates.js',
      'src/components/new/tabs/EconomicsTab.jsx',
      'src/components/new/tabs/ViabilityTab.jsx',
    ],
  },
  {
    field: 'magicRecovery',
    path: 'economicState.activeChains[].magicRecovery',
    producer: 'src/generators/chainMagicSubstitution.js',
    consumers: [
      'src/domain/supplyChainState.js',        // Wave 8: carried into the canonical envelope
      'src/components/new/tabs/EconomicsTab.jsx',
    ],
  },
  {
    field: 'upstreamNote',
    path: 'economicState.activeChains[].upstreamNote',
    producer: 'src/generators/computeActiveChains.js',
    consumers: [
      'src/domain/supplyChainState.js',
      'src/components/new/SupplyChainsPanel.jsx',
      'src/pdf/sections/SupplyChainFlow.jsx',
    ],
  },
  {
    field: 'importChannel',
    path: 'economicViability.metrics.foodBalance.importChannel',
    producer: 'src/generators/economy/foodBalance.js',
    consumers: ['src/domain/display/dossierViewModel.js'],
  },
  {
    field: 'magicFoodOffset',
    path: 'economicViability.metrics.foodBalance.magicFoodOffset',
    producer: 'src/generators/economy/foodBalance.js',
    consumers: [
      'src/domain/display/dossierViewModel.js',
      'src/generators/aiLayer.js',
    ],
  },
  {
    field: 'blockadeBypass',
    path: 'economicState.foodSecurity.stockpile.blockadeBypass',
    producer: 'src/domain/worldPulse/foodStockpile.js',
    producerProbe: '(?<![.\\w])blockadeBypass\\s*,', // shorthand property write
    consumers: ['src/domain/display/dossierViewModel.js'], // Wave 8: deriveBlockadeRelief
  },
  {
    // SEASONS-A: the seasonal stockpile bookkeeping (written ONLY under
    // seasonsEnabled; deriveGranaryOutlook is its display reader).
    field: 'seasonWeek',
    path: 'economicState.foodSecurity.stockpile.seasonWeek',
    producer: 'src/domain/worldPulse/foodStockpile.js',
    consumers: ['src/domain/display/dossierViewModel.js'],
  },
  {
    field: 'seasonalEvent',
    path: 'economicState.foodSecurity.stockpile.seasonalEvent',
    producer: 'src/domain/worldPulse/foodStockpile.js',
    consumers: ['src/domain/display/dossierViewModel.js'],
  },
  {
    // Entity-identity package: generation stamps canonical institution ids
    // alongside labels; joins flip id-first with label-fallback for legacy
    // and DM-authored content. institutionLifecycle.js consumes the field
    // INDIRECTLY through the shared institutionMatchesProcessor helper — the
    // direct field read this registry scans for lives at the join itself.
    field: 'catalogId',
    path: 'institutions[].catalogId',
    producer: 'src/generators/steps/assembleInstitutions.js',
    consumers: ['src/generators/computeActiveChains.js'],
  },
  {
    field: 'conditionId',
    path: 'regionalGraph.impacts[].conditionId',
    producer: 'src/domain/region/propagation.js',
    consumers: [
      'src/domain/region/propagation.js', // apply path materializes under it
      'src/domain/region/graph.js',       // merge preserves the load-bearing id
    ],
  },
  {
    // The canonical chain envelope itself: deriveSupplyChainState's output is
    // the registered surface; these are its load-bearing consumers.
    field: 'deriveAllSupplyChainStates',
    path: 'deriveSupplyChainState / deriveAllSupplyChainStates (canonical chain envelope)',
    producer: 'src/domain/supplyChainState.js',
    producerProbe: 'export function deriveAllSupplyChainStates',
    readProbe: 'deriveAllSupplyChainStates|deriveSupplyChainState',
    consumers: [
      'src/domain/region/deriveRegionalState.js',
      'src/domain/aiGrounding.js',
      'src/domain/explanation.js',
    ],
  },
]);

// ── Tombstones: dead writes REMOVED by this program ────────────────────────
// Fields deleted because nothing read them. The walking test asserts the
// file no longer mentions them — a dead field cannot quietly return without
// arriving through the registry above (i.e., with a reader).
// It also holds the MIRROR class: dead READ arms removed from a consumer — a
// fallback whose key no writer produced — keyed on the read expression itself.
export const REMOVED_DEAD_FIELDS = Object.freeze([
  {
    field: 'hasRegionalSignal',
    file: 'src/domain/region/deriveRegionalState.js',
    removed: 'Wave 8 — write-only boolean on deriveLocalDelta; every consumer thresholds '
      + 'changes[].magnitude itself.',
  },
  {
    field: 'inst?.pressures',
    file: 'src/pdf/lib/viewModelBodySlices.js',
    removed: '§353.3 — dead READ arm in servicesSlice: no institution producer, admission '
      + 'schema row or edit path has ever written a strain-list key on an institution '
      + 'record, so this arm never selected. The bare output property survives.',
  },
  {
    field: 'inst?.stresses',
    file: 'src/pdf/lib/viewModelBodySlices.js',
    removed: '§353.3 — dead READ arm in servicesSlice, the second fallback of the same '
      + 'chain: every committed write of this key sits on AI-context, narrative-context '
      + 'or settlement records, never on an institution.',
  },
  {
    field: 'inst?.blurb',
    file: 'src/pdf/lib/viewModelBodySlices.js',
    removed: '§373 — dead READ arm in servicesSlice\'s description chain: no institution '
      + 'producer, admission-schema row or edit path has ever written this key on an '
      + 'institution record, at any commit since genesis, so the arm never selected.',
  },
  {
    field: 'magicLevel',
    file: 'src/generators/neighbourGenerator.js',
    removed: '§759.3/§763.2 (T7 · UNITS) — a UNIT HOMONYM and a dead write in one. The '
      + 'neighbour profile emitted `magicLevel: (config.priorityMagic ?? 0) / 100`, a NUMBER '
      + 'under a name that is canonically a BAND STRING (none|low|medium|high, '
      + 'magicLedger.js). Zero readers consumed the profile\'s numeric field — measured '
      + 'across src/ and tests/ — so it was a dead write waiting for a consumer to import '
      + 'the wrong unit, on a name whose vocabulary had already been bitten once by exactly '
      + 'that class (capacityModel.js:371, customContent.js:304). If a neighbour magic '
      + 'signal is ever wanted, it arrives through ENGINE_FIELD_REGISTRY with a real '
      + 'consumer AND the canonical band vocabulary, never as a bare 0..1 under this name.',
  },
]);
