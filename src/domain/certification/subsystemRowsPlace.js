/**
 * subsystemRowsPlace.js — SUBSYSTEM CERTIFICATION ROWS for the PLACE-AND-SPATIAL
 * cohort: the six rule keys that govern the GROUND a realm sits on — what tier a
 * settlement holds, what the year does to its granary, what a disaster takes from
 * it, what its stone becomes, who walks between towns, and where inside a town a
 * consequence lands.
 *
 * WHY A LANE OF ITS OWN (the subsystemRowsPeople.js precedent). The cohort lanes
 * split by rule-key ORIGIN (defaults, WAVES, war, ONE_REGEN); these six straddle
 * two of them (tierDrift/seasons/disasters ride the default surface and its opt-in
 * singles, urbanFabric/roads/spatialConsequence are ONE_REGEN virtuals) and are
 * read together or not at all: they share ONE finding, below. Folding them into
 * the baseline and regen lanes would put four authors in two files and push both
 * toward the 800-effective-line domain ceiling. settlementLifecycleEnabled, the
 * seventh place key, keeps its authored row in subsystemRowsWaves.js: it is the
 * contract exemplar and moving it would rewrite another author's bytes for no gain.
 *
 * ── THE SHARED FINDING: `place` IS A SEVEN-LANE BUCKET ───────────────────────
 * Executed 2026-07-31 against scripts/audit/behavioral-observation.mjs
 * moverFamilyOf itself: a tier candidate, a calamity strike beat, all three season
 * markers, an urban-fabric beat, a steading beat and one of the two
 * spatial-consequence beats ALL classify into `place`. The family is second in
 * BEHAVIORAL_MOVER_FAMILIES order and its token list carries `tier`, `resource`,
 * `institution`, `settlement`, `calamity`, `disaster`, `season` and `urban`, so it
 * absorbs the whole cohort plus resource drift and institution lifecycle. NO ROW
 * IN THIS FILE DECLARES IT. The completed 30-year 12-settlement release case
 * measured place at 3,255 movers; a row that claimed it would grade ALIVE on that
 * number while its own lane sat dead, which is the exact vacuity the certification
 * contract exists to forbid. This is the `place` twin of the knowledge-family
 * contamination recorded in ./knowledgeLaneEvidence.js.
 *
 * ── WHAT THIS LANE MEASURED ──────────────────────────────────────────────────
 * From the seven completed release cases in artifacts/soak/release.cases (all
 * envelope v4, so none of them carries a stateKeys census), plus ONE v5 probe run
 * on 2026-07-31 (2 years x 4 settlements, full_simulation, seed place-cert-probe,
 * every rule below lit) executed solely to read the census:
 *   tierDrift            24 and 34 tier_ events in the two 30-year cases (9/30 and
 *                        17/30 years), 9 in the century case (7/100 years).
 *   urbanFabric          spatialLedgers.urbanFabric present in 2/2 probe years at
 *                        maxEntries 4, exactly the settlement count.
 *   roads                spatialLedgers.roads present in 2/2 probe years.
 *   seasons, disasters   NO worldState container in the probe census at all, and
 *                        no dispositive candidate vocabulary anywhere. Both are
 *                        structurally invisible to a receipt.
 *   spatialConsequence   worse than invisible: its input sidecar
 *                        (spatialLedgers.spatialSubstrate) is absent from the probe
 *                        census because it is derived OUTSIDE the engine, so the
 *                        layer is a guaranteed no-op in ANY soak, lit or dark.
 *
 * See subsystemRowsWaves.js for the lane split rationale, the add-a-row protocol,
 * and the evidence law. Both are binding here.
 *
 * @enforced-by tests/lint/subsystemCertificationTotality.walker.test.js,
 *   tests/domain/subsystemRowsPlace.test.js
 */

/** @typedef {import('./subsystemCertification.js').SubsystemRow} SubsystemRow */

/**
 * The place-and-spatial lane's authored rows. The three with a receipt-expressible
 * channel come first; the three honest instrument gaps follow, each naming the
 * observation that would close it.
 * @type {ReadonlyArray<SubsystemRow>}
 */
export const PLACE_SUBSYSTEM_ROWS = Object.freeze([
  Object.freeze({
    rule: 'tierDriftEnabled',
    title: 'Tier drift',
    module: 'src/domain/worldPulse/tierResourceDynamics.js',
    aliveness: Object.freeze({
      // The two literals tierCandidate composes at tierResourceDynamics.js:157
      // (candidateType `tier_${drift.direction}`) over the only two directions
      // tierEligibility ever returns (:112 promotion, :127 demotion). Both reach
      // result.selected, so both land in the receipt's eventTypeCounts, and both
      // were measured there.
      eventTypes: Object.freeze(['tier_promotion', 'tier_demotion']),
      // DELIBERATELY EMPTY: the seven-lane `place` bucket (file header).
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY. worldState.settlementTickStates is the obvious ledger
      // and is NOT a faithful gate: evaluateTierResourceDynamics writes
      // settlementTickStates[id] = { ...previous, tierDrift } for EVERY settlement
      // on EVERY tick whatever the flag says (tierDrift is simply null when dark,
      // tierResourceDynamics.js:543), and the resource lane shares the container.
      // The v5 probe census carries it at maxEntries 4 in both years. Declaring it
      // would grade this row ALIVE in a world where no tier ever moved. Same trap
      // as npcStates one module over.
      stateKeys: Object.freeze([]),
      other: 'The gate is a single seam: tierResourceDynamics.js:530 computes a tierEligibility only when rules.tierDriftEnabled is true, and no candidate exists without an eligibility, so both literals are unreachable when the flag is dark. READ THE SILENCE CAREFULLY: a tier can change WITHOUT this chooser. The calamity kernel demotes a struck settlement straight through popToTier (calamityKernel.js:409) and neither it nor any other lane mints a tier_ candidate, so a receipt whose stateVectors show settlements crossing population bands while eventTypeCounts carries zero tier_ events is a real silence of the CHOOSER, not proof that the realm froze. The candidate is also proposal-gated by default (applyMode authorityFor(rules, tier_change, ...) at :169), so under majorChangesRequireProposal a tier_ event in a receipt is a DM proposal that was raised, not necessarily a tier that changed.',
    }),
    // MEASURED, not assumed. A crossing needs a consecutive-advance streak
    // (requiredStreak) and then a probability roll, so the realized share of years
    // carrying one is 0.30 and 0.567 in the two 30-year 12-settlement cases but
    // only 0.070 in the 100-year 4-settlement case. Declaring `yearly` would flag
    // the century case as slowing for doing exactly what the design intends.
    expectedTempo: 'multi_year',
    invariants: Object.freeze([
      Object.freeze({
        name: 'tier_drift_is_gated',
        description: 'No tier_promotion or tier_demotion candidate can exist while tierDriftEnabled is dark. The flag is the whole chooser, not a tuning knob over it.',
        check: 'In any receipt whose subsystems.rules records tierDriftEnabled false, the summed eventTypeCounts over the two declared types is exactly zero. Expressible from v5 subsystems.rules plus the v4 eventTypeCounts.',
      }),
      Object.freeze({
        name: 'tier_change_has_a_decline_or_a_rise_behind_it',
        description: 'A settlement never crosses a tier boundary suddenly. Eligibility is conjunctive (population proximity or failure AND the support vector) and must hold for a minimum consecutive streak, so a tier event always has an observable trajectory behind it.',
        check: 'For every receipt year carrying tier_demotion, an earlier year in the same case shows a settlement stateVectors population falling toward its tier floor, and for tier_promotion, rising toward the next band minimum. Expressible from the v4 per-year stateVectors series plus eventTypeCounts. NOT attributable to a NAMED settlement today, because eventTypeCounts is realm-summed and carries no target id.',
      }),
      Object.freeze({
        name: 'both_directions_stay_reachable',
        description: 'A realm that only ever promotes, or only ever demotes, has a broken eligibility side even though the subsystem looks alive. Both directions must remain reachable across a release span.',
        check: 'Over the completed release corpus, tier_promotion and tier_demotion each carry a nonzero summed count in at least one case. Expressible from the v4 eventTypeCounts alone; measured true (11 promotions and 13 demotions in release-30y-12s-seed1).',
      }),
    ]),
    // Measured in every completed multi-year release case.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'urbanFabricEnabled',
    title: 'Urban fabric',
    module: 'src/domain/worldPulse/urbanFabricKernel.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The layer mints NO candidate: its only public output is
      // a wizard-news beat (urbanFabricKernel.js:878, impactKind urban_fabric), and
      // eventTypeCounts observes result.selected only.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the fabric beat classifies into `place` on the `urban`
      // token (executed 2026-07-31), which is the seven-lane bucket (file header).
      moverFamilies: Object.freeze([]),
      // THE AUTHORITATIVE SIDECAR, and a faithful gate: advanceUrbanFabric returns
      // before touching it when urbanFabricActive is false (:564), and the persist
      // pass DROPS the key when the ledger empties (:794-796), so absence in a total
      // census is real evidence. The compact settlement.urbanFabric mirror is NOT
      // receipt-expressible and is therefore not claimed.
      stateKeys: Object.freeze(['spatialLedgers.urbanFabric']),
      other: 'The gate is a single seam: urbanFabricActive (urbanFabricKernel.js:158) reads simulationRules.urbanFabricEnabled === true, and advanceUrbanFabric returns immediately when it is false. Once lit the layer deposits and decays a record for EVERY live settlement on EVERY tick (no draw, no rng: deposits are reads), so the ledger is a presence oracle rather than an event stream, and its entry count is the settlement count. MEASURED 2026-07-31 on the v5 probe: spatialLedgers.urbanFabric present in 2/2 observed years, maxEntries 4 against 4 settlements, finalEntries 4. The news beat is the NARRATIVE surface and is much rarer than the ledger (a district turn waits on masonry half-lives), so a receipt showing the ledger full and no fabric prose is healthy, not silent.',
    }),
    // The stocks deposit and decay every tick, so the ledger should be present in
    // EVERY observed year of a lit run. per_tick carries the 0.5 year-share floor,
    // which a healthy fabric clears trivially and a broken one fails loudly.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'fabric_covers_every_live_settlement',
        description: 'The ledger holds one record per live settlement, not a sample: the layer walks the ordered settlement ids and deposits for each. A ledger smaller than the realm means settlements are being skipped.',
        check: 'In a lit run, subsystems.stateKeys[spatialLedgers.urbanFabric].maxEntries equals the receipt settlements count, and its years equals subsystems.observedYears. Expressible from the v5 census plus the receipt envelope; measured true on the 2026-07-31 probe (4 of 4, 2 of 2).',
      }),
      Object.freeze({
        name: 'stone_does_not_vanish',
        description: 'Fabric decays on masonry half-lives and resets only on catastrophe. Once a settlement has fabric it keeps a record, so the ledger never empties back to absent while the flag stays lit and settlements survive.',
        check: 'In a lit run whose census carries spatialLedgers.urbanFabric at all, its finalEntries is greater than zero. Expressible from the v5 census alone (foldStateKeyCensus records finalEntries beside maxEntries).',
      }),
    ]),
    // Measured on the v5 probe census. No completed release case is v5, so the
    // release corpus cannot corroborate it yet.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'roadsEnabled',
    title: 'The roads (named-NPC travel, capture, ransom)',
    module: 'src/domain/worldPulse/roadsKernel.js,src/domain/roads/state.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The mover writes state and news, never a candidate.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and this one is not merely shared but WRONG. Executed
      // 2026-07-31 against moverFamilyOf: a roads beat (impactKind roads, id
      // `wizard_news.<tick>.roads.<sid>.<seed>`) matches NO family on its own
      // vocabulary and falls through to `knowledge` on the bare `news` token inside
      // its own id (the contamination recorded in ./knowledgeLaneEvidence.js), while
      // a beat whose sourceEventId seed carries `ransom` lands in `people` instead.
      // The family a roads beat reports is therefore an artifact of its id string.
      moverFamilies: Object.freeze([]),
      // THE AUTHORITATIVE SIDECARS, both faithful gates: the persist pass writes
      // them through the literal-key setSpatialLedger idiom and DROPS each when it
      // empties (roadsKernel.js:1059 roads, :1088 roadsReturnedCaptives). The
      // npc.whereabouts display mirror is not receipt-expressible and is not claimed.
      stateKeys: Object.freeze(['spatialLedgers.roads', 'spatialLedgers.roadsReturnedCaptives']),
      other: 'TWO GATES, NOT ONE. roadsActive (roads/state.js:136) reads only the flag, but the mover additionally needs an ACTIVE SPATIAL CANON to route on, so a dark-canon realm reads dormant with the flag lit. The whole-world soak fixture supplies a real canon (scripts/audit/whole-world-soak-spatial-fixture.mjs seeds spatialCanonVersion and a frozen spatialDigest), so a soak silence here is a silence of the mover and not of the fixture. The ledger is an ACTIVE-MISSION ledger, not a cumulative one: a mission is written on dispatch and cleared on return, and the census samples once per observed year, so a year can read zero while journeys ran and returned inside it. MEASURED 2026-07-31 on the v5 probe: spatialLedgers.roads present in 2/2 observed years, maxEntries 2, finalEntries 1, with roadsReturnedCaptives absent (no captive was taken and released in two years, which at these rates is expected).',
    }),
    // Mission genesis is a per-eligible-NPC-year cadence draw (JOURNEY_CHANCE 0.35
    // off a tick-invariant world seed) under a per-settlement concurrency cap of 2,
    // so a realm of any size should carry live missions in most years, but the
    // year-end sample can legitimately miss a year.
    expectedTempo: 'yearly',
    invariants: Object.freeze([
      Object.freeze({
        name: 'captivity_presupposes_a_journey',
        description: 'A returned captive can only exist downstream of a mission that left home: the capture classes all fire on a traveller in transit or on a stay. The returned-captive ledger can never populate in a run whose mission ledger never did.',
        check: 'If subsystems.stateKeys carries spatialLedgers.roadsReturnedCaptives with maxEntries above zero, it also carries spatialLedgers.roads with maxEntries above zero. Expressible from the v5 census alone, with no other receipt field.',
      }),
      Object.freeze({
        name: 'roads_silence_needs_a_canon',
        description: 'The mover is an AND of the flag and an active spatial canon. A run without a canon proves nothing about the subsystem, so its zero must not be read as a silence.',
        check: 'A SILENT verdict on this row is only meaningful for a receipt whose run carried a spatial canon. Expressible today only by construction (the soak fixture always seeds one); a receipt field recording spatialCanonVersion would make it checkable rather than assumed, and the v5 census already proves the canon indirectly by carrying spatialDigest.',
      }),
    ]),
    // Measured on the v5 probe census. No completed release case is v5.
    soakEvidence: 'measured',
  }),
  Object.freeze({
    rule: 'seasonsEnabled',
    title: 'Seasons (the aspatial food year)',
    module: 'src/domain/worldPulse/seasons.js,src/domain/worldPulse/foodStockpile.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. The food year mints no candidate at all.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: all three season markers classify into the seven-lane
      // `place` bucket on the `season` token (executed 2026-07-31).
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and this is the finding rather than a choice: the
      // subsystem writes NO worldState container. Its swing enters a per-settlement
      // granary field inside advanceFoodStockpile, and the v5 census walks the
      // top-level worldState keys plus one level into spatialLedgers only. The
      // 2026-07-31 probe ran with seasonsEnabled lit and its census carries no
      // seasons key of any kind.
      stateKeys: Object.freeze([]),
      other: 'NOTHING THIS SUBSYSTEM DOES REACHES A RECEIPT. The food year is one signed swing on the food-production read at its consumption point (seasons.js seasonalUnitSwing, threaded only when pulseKernel.js:422 reads seasonsEnabled true), so it moves per-settlement granary arithmetic and never a container the census can see. Its only public surface is the three season markers (seasons.js:224 harvest, :244 hungry_gap, :287 spring_thaw), which are wizard news: eventTypeCounts observes result.selected only, so they never appear there. The v4 harness cannot even resolve the SWITCH, because whole-world-soak.mjs takes a --seasons override on the command line, which is why the certification evaluator deletes seasonsEnabled from its harness-default rule map. TWO OBSERVATIONS WOULD CLOSE THIS. (1) A per-quarter granary series in the behavioral observation: stateVectors carries population, prosperity, topFaction and powerEntropy only, sampled once per year, so the whole point of a food YEAR is invisible. (2) A wizard-news impactKind census in the receipt, which would also unblock disasters and spatial consequence in this same lane.',
    }),
    // The swing is applied at every granary advance of every settlement, so the
    // subsystem itself runs per tick; only its markers are annual. Declared honestly
    // even though no channel can measure it, so that the day an instrument lands the
    // expectation is already on record.
    expectedTempo: 'per_tick',
    invariants: Object.freeze([
      Object.freeze({
        name: 'granary_year_oscillates',
        description: 'A lit food year banks stores through summer and autumn and draws them down through winter and early spring. A granary that only rises, or only falls, means the swing is not reaching the ledger.',
        check: 'NOT expressible from a v4 or v5 receipt. It needs a per-QUARTER granary series (storageMonths at the four season boundaries) in behavioral.yearly; today stateVectors is sampled once per year and carries no food field, so the intra-year shape is unobservable.',
      }),
      Object.freeze({
        name: 'season_markers_are_annual_and_paired',
        description: 'Each observed year mints exactly one harvest marker and one hungry-gap marker, and a spring-thaw marker whenever the seasonal road overlay is active. A year missing one has lost a quarter boundary.',
        check: 'NOT expressible from a v4 or v5 receipt. It needs a per-year wizard-news impactKind census (harvest, hungry_gap, spring_thaw counts); eventTypeCounts observes result.selected only and the markers never join it.',
      }),
      Object.freeze({
        name: 'seasons_are_byte_identical_when_dark',
        description: 'Flag off means no seasonal field, no draw and no read, so a dark run must be byte-identical to the pre-seasons engine. This is the dormancy law the subsystem was built under.',
        check: 'Expressible from a PAIR of receipts rather than one: two runs on the same seed, one with --seasons off, must agree on finalHash and on every yearly composite hash. The soak harness already supports the flag variation; the comparison is not automated.',
      }),
    ]),
    // No receipt of any supported envelope can carry this subsystem's evidence.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'disastersEnabled',
    title: 'Calamities (the natural-disaster mover)',
    module: 'src/domain/worldPulse/calamityKernel.js,src/domain/spatial/calamity.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY, and deliberately NOT population_emigration. The strike
      // has exactly one outcome that reaches the candidate stream, the exodus built
      // at calamityKernel.js:679, and its candidateType is the SAME literal ordinary
      // migration emits (populationDynamics). Declaring it would grade this row
      // ALIVE on every emigration in the realm; the completed 30-year case carries
      // 107 of them and zero recorded calamities.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY: the strike beat (calamityKernel.js:742, impactKind
      // calamity) classifies into the seven-lane `place` bucket (file header).
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY, and this is the finding: the permanent record of a
      // strike is the per-settlement calamityHistory stamp (calamityKernel.js:423),
      // not a worldState container, so the census cannot see it. The 2026-07-31
      // probe ran with disastersEnabled lit and carries no calamity key.
      stateKeys: Object.freeze([]),
      other: 'THE CEILING PRESET HEADLINE FEATURE LEAVES NO RECEIPT TRACE. The gate is a single seam (calamityEnabled at spatial/calamity.js:133, checked at calamityKernel.js:522), and a lit strike does four visible things: it destroys institutions, kills a bounded aggregate fraction, sheds an exodus, and stamps a permanent named calamityHistory record. NONE of them is dispositive in a receipt. The exodus rides the shared population_emigration literal; the deaths and the institution losses appear only as unattributed movement in stateVectors; the stamp is per-settlement state; the news beat is wizard news and lands in the shared place family. WHAT WOULD CLOSE IT: a per-settlement calamityHistory census in the receipt (strike count, year, deaths, exodus, k), which is also the only way to check the frequency and cooldown laws below. NOTE FOR THE READER OF A SILENCE: the mover is genuinely very rare by design, so even a perfect instrument would expect long empty stretches.',
    }),
    // The realm-summed hazard is about one strike per HAZARD_YEARS (15) years,
    // INDEPENDENT of settlement count, with an 8-year per-settlement cooldown. A
    // 30-year case expects roughly two strikes; a decade of silence is normal.
    expectedTempo: 'rare',
    invariants: Object.freeze([
      Object.freeze({
        name: 'calamity_frequency_is_realm_flat',
        description: 'The per-settlement-year hazard is 1/(HAZARD_YEARS x N), so the realm sees about one strike per HAZARD_YEARS years whether it holds four settlements or thirty. A frequency that scales with realm size means the hazard is being drawn per settlement without the normalization.',
        check: 'NOT expressible from a v4 or v5 receipt. It needs the per-settlement calamityHistory census: the realized strike interval in the 100-year case must be comparable to the 30-year cases despite the settlement counts differing by three times.',
      }),
      Object.freeze({
        name: 'a_struck_settlement_is_spared_the_dice',
        description: 'No settlement re-strikes within COOLDOWN_YEARS of its own last stamp. The cooldown is read off the permanent stamp, so a repeat inside the window means the stamp is not being read.',
        check: 'NOT expressible from a v4 or v5 receipt. It needs the calamityHistory census carrying each stamp year per settlement; the receipt records no per-settlement calamity field today.',
      }),
      Object.freeze({
        name: 'a_strike_is_survivable',
        description: 'Deaths are a bounded, tier-scaled fraction clamped under the exodus, so a struck settlement loses people and institutions but is never annihilated by the mover.',
        check: 'Partially expressible today: no settlement stateVectors population may fall to zero in any observed year, which the completed release corpus satisfies. NOT attributable to a calamity without the census, because ordinary war, famine and migration produce the same shape.',
      }),
    ]),
    // No receipt of any supported envelope can carry this subsystem's evidence.
    soakEvidence: 'unobserved',
  }),
  Object.freeze({
    rule: 'spatialConsequenceEnabled',
    title: 'Spatial consequence (the map to engine coupling)',
    module: 'src/domain/worldPulse/spatialConsequenceKernel.js,src/domain/spatial/spatialSubstrateRead.js',
    aliveness: Object.freeze({
      // DELIBERATELY EMPTY. A pure consumer: it mints no candidate.
      eventTypes: Object.freeze([]),
      // DELIBERATELY EMPTY, and the classification SPLITS, so it could not be
      // claimed even if the family were exclusive. Executed 2026-07-31: the
      // calamity_where beat lands in `place` (the `calamity` token inside its own
      // slug) while the covert_diffusion beat lands in `knowledge` (the `news`
      // token inside its id). One subsystem, two families, neither its own.
      moverFamilies: Object.freeze([]),
      // DELIBERATELY EMPTY because there is nothing to declare: advanceSpatialConse-
      // quence returns { changed, newsEntries } and NEVER a worldState. The layer is
      // constitutionally write-free (the projection law), so it can have no container.
      stateKeys: Object.freeze([]),
      other: 'THE INSTRUMENT GAP HERE IS STRUCTURAL, NOT MERELY A MISSING FIELD. The layer reads spatialLedgers.spatialSubstrate (spatialSubstrateRead.js:89) and returns early for any settlement without one, and that substrate is derived OUTSIDE the engine at canonize time in the store path (src/store/campaignWorldPulseDeferred.js via src/lib/spatialSubstrateDerive.js). The whole-world soak builds its own canon fixture, which seeds spatialCanonVersion and a frozen spatialDigest and NO substrate: verified 2026-07-31 against the v5 probe census, which carries twenty-two spatialLedgers sub-keys and spatialSubstrate is not among them. So in a soak this layer is a guaranteed no-op with the flag lit, and its zero says nothing about the subsystem. Its only output is a wizard-news beat in either case (spatialConsequenceKernel.js:318, impactKind spatial_consequence), which eventTypeCounts never observes. TWO THINGS WOULD CLOSE IT, in order: seed the substrate in the soak fixture so the layer can run at all, then add the wizard-news impactKind census so its beats can be counted.',
    }),
    // It narrates only in the tick after a fresh calamity stamp or a fresh covert
    // exposure, so its cadence is entirely borrowed from the events it reacts to.
    expectedTempo: 'reactive',
    invariants: Object.freeze([
      Object.freeze({
        name: 'consequence_needs_a_substrate',
        description: 'The layer is an AND of the flag and a derived per-settlement substrate. A run whose world never carried a substrate cannot produce a beat, so its zero is an instrument gap and must never be reported as a silence of the subsystem.',
        check: 'If subsystems.stateKeys carries no spatialLedgers.spatialSubstrate entry, this row may not be graded SILENT. Expressible from the v5 census alone; measured absent on the 2026-07-31 probe, which is why this row declares soakEvidence unobserved.',
      }),
      Object.freeze({
        name: 'consequence_moves_no_totals',
        description: 'The layer swaps WHERE a consequence lands, never how much of it there is: a calamity toll is narrated by district with the totals untouched, and an exposed corruption diffuses along real adjacency with the magnitudes untouched.',
        check: 'Expressible from a PAIR of receipts rather than one: two runs on the same seed, one with spatialConsequenceEnabled lit and one dark, must agree on every per-year stateVectors entry and on finalHash. The soak already records a dark control, but it darkens every switch at once, so it cannot isolate this one.',
      }),
    ]),
    // The declared evidence is not derivable from any supported receipt, and the
    // subsystem cannot even run in the harness that writes them.
    soakEvidence: 'unobserved',
  }),
]);

/**
 * Place-and-spatial-cohort rule keys that do not yet carry a row. Empty by
 * construction: this lane was opened WITH its six rows, so it has no burn-down of
 * its own. It stays exported so the composed pending list keeps one entry per lane
 * and a future place key has an obvious home.
 * @type {ReadonlyArray<string>}
 */
export const PLACE_PENDING_RULE_KEYS = Object.freeze([]);
