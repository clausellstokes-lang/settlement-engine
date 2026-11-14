/**
 * Step 15: assembleSettlement
 *
 * Assembles the final settlement object from all accumulated context,
 * runs narrative overlays, defense profile, legitimacy patching,
 * and coherence generation.
 *
 * Final assembly step for the settlement generation pipeline.
 */

import { chooseOrPin, registerStep } from '../pipeline.js';
import { generateSettlementName } from '../npcGenerator.js';
import { generateConflicts } from '../powerGenerator.js'; import { resolveFactionLabelsAtClose } from '../power/factionLabelClose.js'; // CENSUS-1i R-AW (MERGE-CAR: CENSUS-4 R12's fitFactionRoster and the grouping's generateFactions retired)
// F8: re-render stress summaries with the real settlement name. resolveStress
// (step 3) rolled them 16 steps ago with an empty name and stashed the
// rng-derived choice in each entry's `summaryRoll`; we re-render here now that
// the name exists.
import { renderStressSummary } from '../stressNarrative.js'; import { factsOf } from '../../domain/facts/factsOf.js'; import { resolveSibling } from '../../domain/facts/drawDeclared.js'; import { STRESS_TYPE_SIBLINGS } from '../../data/stressTypes.js'; // CENSUS-2c: one line, so no cited line moves (W2-FIX-DATA-7: the catalogue cells' declared sets join it)
import { generatePressureSentence, generateArrivalScene, generateCoherence } from '../narrativeGenerator.js';
import { generateDefenseProfile } from '../defenseGenerator.js';
import { settleCrimeLinesToSignal } from '../safetyProfile.js';
// Faction-to-NPC coupling: synthesizes structural NPCs (high priestess,
// watch captain, etc.) for any faction archetype that lacks them. Runs
// at assembly so existing pipeline NPCs are deduplicated against.
import { ensureFactionStructuralNpcs } from '../factionRoles.js';
import { drawTies } from '../people/ties.js';
import { seatFacesFoldedByDualHat } from '../people/representatives.js';
import { settleNarrativesToRoster, settleStandingToRoster, settleTensionsToRoster, standingForceOf, standingRosterOf } from '../power/rosterText.js';
// ODQ §810's tier-gated density law: sizes the political roster to the tier's
// faction band. Dormant (returns its input by reference, no draw) for any world
// whose own config carries no density-law marker.
import { conserveSeatPower, resizePoliticalRoster } from '../density/applyDensityLaw.js';
// Canonical-shape adapter (Tier 1.3). Stamps version fields, mints a
// stable id, defaults canonical containers. Pure — does not restructure
// legacy fields. Every freshly-generated settlement passes through here
// so downstream consumers (save/load, PDF, AI overlay, trace layer)
// can rely on the canonical contract.
import { normalizeSettlement } from '../../domain/normalizeSettlement.js';
// Promote live-crisis stressors (plague/famine/siege/…) into canonical
// activeConditions so the causal substrate + AI overlay react to a settlement
// generated mid-crisis — closing the "generated plague town has activeConditions:[]"
// gap. Pure + deterministic + idempotent.
import { promoteStressorsToConditions, reapplyEventConditions } from '../../domain/conditionPromotion.js';
import {
  clearActiveRng,
  setActiveRng,
} from '../../kernel/rngContext.js';
import { culturalNotesFor } from '../../domain/cultureProfiles.js'; import { foodwaysLineOf } from '../../domain/foodways.js'; // URBAN-FIX C-1: one line, so no cited line moves
import {
  buildGenerationCoherenceReceipt,
} from '../generationCoherence.js';
import { storeTrueHooksOnly } from '../../domain/coherence/hookTruthRecord.js'; import { fishTradeTwinned } from '../../data/fishTradeTwinLines.js'; // F11: one line, so no cited line moves
import { truePersonHooks } from '../people/personHooks.js';
import { takeAllegianceReceipts } from '../../domain/people/allegiance.js';
import { recordTrace } from '../../domain/trace.js';
import { resolveGenerationWorldLaw } from '../generationContext.js';
import {
  assertPowerEconomyFreshness,
  reconcilePowerStructure,
  refreshPowerGenerationTraces,
} from '../power/economyReconciliation.js';

/**
 * Run one assembly concern on its own deterministic child stream.
 *
 * Assembly contains both presentation writers and canonical coherence
 * enrichment. Some presentation branches legitimately draw a different number
 * of prose variants when a custom display label changes. Without a stream
 * boundary, those cosmetic draws move the later NPC-secret and relationship
 * draws. A named child stream makes that dependency impossible while retaining
 * the fail-closed global RNG contract used by the existing generators.
 *
 * @template T
 * @param {{fork:(label:string)=>any}} stepRng
 * @param {string} label
 * @param {(rng:any) => T} operation
 * @returns {T}
 */
function inAssemblySubstream(stepRng, label, operation) {
  const substreamRng = stepRng.fork(label);
  const previousRng = setActiveRng(substreamRng);
  try {
    return operation(substreamRng);
  } finally {
    clearActiveRng(previousRng);
  }
}

// The sentinel the appender's gate consults `chooseOrPin` with (EM-B2a3's landed idiom).
// `chooseOrPin` hands back the HELD ARRAY while `ensureFactionStructuralNpcs` returns a
// SETTLEMENT, so the gate cannot read the pinned value itself; a `null` or `undefined`
// sentinel could collide with a bag value, and a unique Symbol cannot.
const UNPINNED = Symbol('assembleSettlement:unpinned');

registerStep('assembleSettlement', {
  // structuralValidationPass provides ctx.structural — the coherence receipt
  // for the FINAL roster (Wave 4b moved it out of assembleInstitutions).
  deps: ['generateNarratives', 'generatePopulation', 'structuralValidationPass'], // ALLEGIANCE-CAR1 (J-2): corruptionPass retired; its roll is the seam's (domain/people/allegiance.js)
  reads: ['availableServices', 'culture', 'culturalIdentity', 'economicState', 'economicViability', 'effectiveConfig', 'generationContext', 'generationRepairs', 'history', 'institutions', 'isolationSupport', 'neighbourProfile', 'npcs', 'population', 'powerIntent', 'powerStructure', 'rawNeighbour', 'relationships', 'resourceAnalysis', 'settlementReason', 'spatialLayout', 'stress', 'structural', 'tier'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  // The terminal step bundles the FINAL value of every re-derived key. Declared rather than
  // assumed: 'it runs last' is a fact about today's order, and the contract now checks it.
  readsVersion: { economicState: 'reconciled', stress: 'reconciled', isolationSupport: 'reconciled' },
  provides: ['settlement'],
  // normalizes the power roster in place; F8 also re-renders each stress entry's
  // summary in place with the real name (resolveStress rolled them name-blind) and
  // deletes the transient summaryRoll token — a declared in-place write of `stress`
  // (A+ P1.7 contract).
  mutates: ['powerStructure', 'stress', 'relationships'], // relationships: PEOPLE-1 CAST — the coherence seam appends the `other` mints' ties (people/castPowers.js)
  phase: 'assembly',
}, (ctx, rng) => {
  // The runner hands the pins through the context under its reserved key; absent pins mean
  // today's behaviour exactly, and the partial-pin refusal already fired in the runner. The
  // same spelling `generatePopulation.js` and `assembleInstitutions.js` already carry.
  const pins = ctx.__pins || null;
  const {
    tier, population, institutions, effectiveConfig,
    neighbourProfile, rawNeighbour,
    economicState, spatialLayout, availableServices, powerStructure,
    settlementReason, npcs, relationships,
    resourceAnalysis, economicViability, history, stress, structural,
    isolationSupport,
    culture, culturalIdentity,
  } = ctx;
  const config = ctx.config || {};

  // F8: mint the settlement name up front so the stress summaries — rolled with
  // an empty name back in resolveStress (step 3) — can be re-rendered with the
  // real name below. generateSettlementName draws rng (prefix + suffix indices);
  // keeping the mint here, immediately before the settlement literal, preserves
  // its exact draw position — nothing between the ctx destructure and the literal
  // consumes rng, so the customName short-circuit and draw order are unchanged.
  const settlementName = (effectiveConfig.customName?.trim()) || generateSettlementName(culture);

  const settlement = {
    name: settlementName,
    tier,
    population,
    institutions: fishTradeTwinned(institutions, economicState), // F11: a fish trade with no fish of its own or bought in is the cart's (data/fishTradeTwinLines.js), draw-free
    structuralViolations: structural?.violations || [],
    structuralSuggestions: structural?.suggestions || [],
    neighborRelationship: neighbourProfile || (rawNeighbour ? {
      name: rawNeighbour.name,
      tier: rawNeighbour.tier,
      relationshipType: config._neighbourRelType || 'neutral',
      npcs:    rawNeighbour.npcs    || [],
      // The partner's POWERS (PEOPLE-5A, M-2), never its NPC grouping.
      powerStructure: { factions: rawNeighbour.powerStructure?.factions || [] },
    } : null),
    economicState,
    spatialLayout,
    availableServices,
    // Seam fix: conflicts are generated top-level but several readers — aiLayer,
    // dailyLifeLogic, and the generate-narrative edge function the owner deploys
    // separately — expect powerStructure.conflicts. Dual-written below, where the
    // conflicts are derived (GS-2), so both addresses are live.
    powerStructure: powerStructure ? { ...powerStructure } : powerStructure,
    settlementReason,
    npcs,
    relationships,
    // GS-2: derived from the FINAL roster below, after the coherence tail and the structural
    // seats have settled every NPC's power affiliation. Empty until then, which is what every
    // reader in between (the coherence tail's member re-link) already tolerates.
    factions: [],
    conflicts: [],
    resourceAnalysis,
    economicViability,
    history,
    isolationSupport,
    // Materialized rather than inferred in the UI: every consumer now reads
    // the same local expression of the culture choice. culturalNotes keeps the
    // established PDF/AI compatibility field while the structured record gives
    // future engineers the seven explicit dimensions behind it.
    culturalIdentity: culturalIdentity && foodwaysLineOf({ economicState }) ? Object.freeze({ ...culturalIdentity, foodways: foodwaysLineOf({ economicState }) }) : culturalIdentity, // URBAN-FIX C-1 ONE HOME: where the food record exists the stored foodways line IS the record's composed line (domain/foodways.js), the one the page prints; draw-free
    culturalNotes: culturalNotesFor(culturalIdentity),
    // Tier 1.2 — dual-write the stress array under both the legacy
    // `stress` name AND the canonical `stressors` name. Consumers that
    // bypass normalizeSettlement (e.g. UI components that read directly
    // from a freshly-generated settlement) now see the canonical shape
    // without going through the adapter.
    stress,
    stressors: stress,
    // RESOLVED effectiveConfig snapshot — carries derived keys (stressTypes,
    // _magicTradeOnly, tier, …) that display/validator/sim readers depend on.
    // It is NEVER a valid generation input: applyChange regenerates from
    // _config below, and its legacy fallback strips the derived keys
    // (store/settlementSlice.js DERIVED_CONFIG_KEYS) so emergent stress
    // can't echo back in as user-forced stress.
    config: { ...effectiveConfig },
    // The RAW pre-resolution config, sentinels intact ('random',
    // 'random_culture', …). `config` above holds the RESOLVED choices for
    // this generation; treating it as a generation input is what pinned
    // random settings to their first roll. Save/load and applyChange flows
    // read _config first so 'random' stays random across regenerations.
    _config: { ...config },
  };

  // §22 ruling 1 + §22.1 correction 1: the settlement's NAME is a HELD fact. The mint above
  // RUNS at its exact draw position and its result is DISCARDED when the name is held - the two
  // draws it spends are on the assembly step's SHARED ambient stream. Since the Voice Program
  // wave 2 the pressure sentence and the arrival scene no longer read that stream, but the
  // mint still runs so the shared stream stays where any later reader expects it.
  settlement.name = chooseOrPin(pins, 'name', () => settlementName);

  // F8: re-render each stress entry's summary with the real settlement name.
  // resolveStress baked a PROVISIONAL empty-name summary (leading-space prose
  // like " is under active siege…") and stashed the sole rng-derived choice
  // (wartime's profit coin) in `summaryRoll`. Now that the name exists we
  // re-render from that token and delete the transient field so it never
  // persists or enters the golden hash. Handles both dual-written containers
  // (stress + stressors — same object refs) and both shapes (bare object vs
  // array). Entries WITHOUT an own summaryRoll (custom-authored stressors that
  // carry their own summary) are left untouched.
  const rerenderStressSummary = (container) => {
    if (!container) return;
    const entries = Array.isArray(container) ? container : [container];
    for (const e of entries) {
      if (e && typeof e === 'object'
          && Object.prototype.hasOwnProperty.call(e, 'summaryRoll')) {
        e.summary = renderStressSummary(e.type, settlement.name, e.summaryRoll, e.direction, factsOf(settlement)); // WIRING-W0: the entry's own direction; CENSUS-2c: declared sentences resolve (stressNarrative.js :: STRESS_SUMMARY_SIBLINGS) — MERGE-R2: both
        // W2-FIX-DATA-7 (CENSUS-2 kind a; brief 5's ruling: this function only): the catalogue's own hook and note, stored
        // on the entry, resolve through their declared sets (stressTypes.js :: STRESS_TYPE_SIBLINGS), draw-free. A hook
        // with no admitted twin is kept and noted (the template the cast fills); a note with none is left off (nothing
        // false is printed in its place). The hook stays the template: a twin carries no holder's name.
        const cellOpts = { facts: factsOf(settlement), poolId: 'stressTypes:STRESS_TYPE_SIBLINGS', surface: 'crisis', drawKind: /** @type {'T'} */ ('T') };
        if (typeof e.crisisHook === 'string') e.crisisHook = resolveSibling(e.crisisHook, STRESS_TYPE_SIBLINGS, cellOpts);
        if (typeof e.viabilityNote === 'string') { const note = resolveSibling(e.viabilityNote, STRESS_TYPE_SIBLINGS, { ...cellOpts, dropRefused: true }); if (note == null) delete e.viabilityNote; else e.viabilityNote = note; }
        delete e.summaryRoll;
      }
    }
  };
  rerenderStressSummary(settlement.stress);
  rerenderStressSummary(settlement.stressors);

  // Narrative overlays. The pressure sentence and the arrival scene each draw on their own
  // named child stream (THE VOICE PROGRAM wave 2, 2026-10-02): their pools and beats can
  // grow or reorder without any fact moving, because no later draw reads the position
  // they leave behind. The defense profile takes no draw.
  // THE PEOPLE CAR (PEOPLE-4 TIES, R-P7): `pressureSentence` is written BELOW, after the ties are
  // drawn (its relationship branch reads them; it runs on its own named child, so the move shifts
  // no other draw).
  settlement.arrivalScene     = inAssemblySubstream(rng, 'arrival-scene', () => generateArrivalScene(settlement));
  settlement.defenseProfile   = generateDefenseProfile(settlement);

  // The final-economy pass already proved that power consumed the final
  // prosperity/safety/food tuple. Assert that proof before applying the one
  // remaining late input: defenseProfile's real readiness label.
  assertPowerEconomyFreshness(
    settlement.powerStructure,
    settlement.economicState,
    tier,
    { pins },
  );
  if (settlement.defenseProfile?.readiness?.label) {
    const { beforeFactions } = reconcilePowerStructure(
      settlement.powerStructure,
      settlement.economicState,
      ctx.powerIntent,
      { defenseLabel: settlement.defenseProfile.readiness.label, pins },
    );
    refreshPowerGenerationTraces(
      ctx,
      beforeFactions,
      settlement.powerStructure,
      ctx.powerIntent,
    );
  }
  assertPowerEconomyFreshness(
    settlement.powerStructure,
    settlement.economicState,
    tier,
    { pins },
  );

  // ── ODQ §810 SEAM 1b: size the political roster to the tier's faction band.
  //
  // ⛔ IT HAS TO BE HERE, AFTER RECONCILIATION. `reconcilePowerStructure` REPLAYS
  // the whole power generation and asserts the faction identity roster is
  // unchanged (`assertStableGeneratedRoster`), then rebuilds the roster from the
  // replay — so a resize at the population step both throws and is undone.
  // Measured the hard way: the first wiring of this law trimmed at the
  // population step and that guard convicted it.
  //
  // Runs BEFORE generateCoherence below, which is where the dispersal reads the
  // roster. Version-gated: a world whose own config carries no density-law
  // marker gets its powerStructure back by reference, with no draw taken.
  // COHERENCE-POWERS-3 (F2): the roster the power step's standing sentences were written on, before the resize
  const standingRoster = standingRosterOf(settlement.powerStructure?.factions || []);
  const resized = resizePoliticalRoster({
    tier,
    // X-46 car 4: the population tilt (read only under Register VII; no draw).
    population,
    config: settlement.config,
    stress: settlement.stress,
    powerStructure: settlement.powerStructure,
    economicState: settlement.economicState,
    // The roster the population step actually produced is the TRUE mass here,
    // so the seat ceiling (R17: a house the mass cannot crew must not exist) is
    // computed against a fact rather than against a second mass roll. COHERENCE-POWERS-3 (F1): the leader's office
    // and the leader's house count as two, as they did before the dual hat folded the office's face into the house's.
    massOverride: (settlement.npcs || []).length + seatFacesFoldedByDualHat(settlement),
    // COHERENCE-POWERS 2B: the fold reads the final houses (applyDensityLaw.js :: foldKin)
    institutions: settlement.institutions,
    rng,
  });
  const rosterResized = resized.powerStructure !== settlement.powerStructure; // COHERENCE-POWERS-3 (F2), read below
  if (rosterResized) {
    settlement.powerStructure = resized.powerStructure;
  }

  // ── THE CRIME LINES READ THE FINAL CRIME SIGNAL (lane RUNG1B-F4 unit 4, 2026-11-04). The safety
  // profile was written at the economy step, before the power roster existed; this is the first
  // point where the FINAL roster (after the trim above) and the estate both exist, so its
  // survival-crime and debt-evasion lines take their text from the crime signal here
  // (`safetyProfile.js :: settleCrimeLinesToSignal`). No step is re-ordered; no draw; the
  // economicState is copied only when a line changes (the power fingerprint reads the safety
  // LABEL, which this never touches).
  const settledEconomy = settleCrimeLinesToSignal(
    settlement.economicState,
    { seats: settlement.powerStructure?.factions, estate: settlement.institutions },
  );
  if (settledEconomy !== settlement.economicState) settlement.economicState = settledEconomy;

  // Coherence mutates canonical NPC/faction mechanics. Give it a dedicated
  // stream so variable draw counts in pressure/arrival/defense presentation
  // cannot silently rewrite those mechanics.
  const coherenceUpdates = inAssemblySubstream(
    rng,
    'canonical-coherence',
    // FIX-PUBLIC-VEIL (the second seat): the record's seed salts a veiled mint's opaque id at the cast seam
    coherenceRng => generateCoherence(settlement, coherenceRng, pins, ctx._seed),
  );
  Object.assign(settlement, coherenceUpdates);
  // ALLEGIANCE-CAR1 (2026-11-08): the hidden allegiances' receipts, left by the coherence seam, recorded on the
  // run's deterministic clock under the step label `people-allegiance` (domain/edit/tracePartition.js).
  for (const receipt of takeAllegianceReceipts(settlement)) recordTrace(ctx, /** @type {any} */ (receipt));
  // Rung 1 N1: faction power totals 100 on every path, the held-roster one included (whose
  // coherence tail skips the dispersal that conserves it). By reference for v1 and for a
  // roster already at 100; no draw. A HELD powerStructure is the DM's and is not rewritten.
  if (chooseOrPin(pins, 'powerStructure', () => UNPINNED) === UNPINNED) {
    const conserved = conserveSeatPower({
      config: settlement.config, powerStructure: settlement.powerStructure,
    });
    if (conserved !== settlement.powerStructure) settlement.powerStructure = conserved;
    // COHERENCE-POWERS-3 (F2): every text that names a power reads the final roster (power/rosterText.js). Only where
    // the density law moved the roster; the power's last write is the conservation just above.
    if (rosterResized) {
      settlement.powerStructure = settleStandingToRoster(settlement.powerStructure, standingRoster, standingForceOf(settlement.institutions));
      settlement.powerStructure = settleNarrativesToRoster(settlement.powerStructure, standingRoster);
      settlement.history = settleTensionsToRoster(settlement.history, settlement.powerStructure, standingRoster);
    }
  }

  // Faction-to-NPC coupling. Walks every faction; for each archetype
  // (temple, watch, merchant, thieves, noble, arcane) ensures the
  // implied structural NPCs exist with the right importance tier and
  // institution/faction linkage. Idempotent — won't duplicate NPCs
  // the population step already generated for the same role + faction.
  //
  // ── GATED AS A PRODUCER (EM-R2). It APPENDS to `npcs`, so under a held roster it is a
  // producer writing into a record the edit calls final: a DM op that removes a seat-holder
  // is exactly the uncovered case, and an ungated appender would mint the seat back. The
  // gate is the same key and the same primitive the coherence seam uses, so the two cannot
  // disagree about what "held" means. It takes NO draw at any tier, so skipping it consumes
  // nothing and moves no stream.
  if (chooseOrPin(pins, 'npcs', () => UNPINNED) === UNPINNED) {
    const castIds = new Set((settlement.npcs || []).map((npc) => npc?.id));
    const withStructural = ensureFactionStructuralNpcs(
      settlement,
      ctx.generationContext,
    );
    Object.assign(settlement, withStructural);
    // THE PEOPLE CAR (PEOPLE-4 TIES, R-P7): a card the PRE-LAW appender adds (a v1 world only;
    // under the density law it appends nothing) arrives after the coherence seam drew the ties,
    // so it draws its ONE outgoing tie here, over the whole roster, on its own keyed fork
    // (`people-ties-late::people-ties::<card id>`), and so does a card the seam left untied
    // because it was alone there. The cards tied at the seam cannot name a late card.
    const ids = (settlement.npcs || []).map((npc) => npc?.id);
    if (ids.some((id) => !castIds.has(id)) && chooseOrPin(pins, 'relationships', () => UNPINNED) === UNPINNED) {
      const tied = new Set((settlement.relationships || []).map((tie) => tie?.from));
      const late = new Set(ids.filter((id) => !tied.has(id)));
      settlement.relationships = [
        ...(settlement.relationships || []),
        ...inAssemblySubstream(rng, 'people-ties-late', (lateRng) => drawTies(
          settlement.npcs, { config: settlement.config || effectiveConfig, institutions: settlement.institutions || [], tier: settlement.tier, government: settlement.powerStructure?.government ?? null }, lateRng, { sources: late },
        )),
      ];
    }
  }

  // The pressure line, on its own 'pressure-sentence' child, now that the ties exist (PEOPLE-4 TIES).
  settlement.pressureSentence = inAssemblySubstream(rng, 'pressure-sentence', () => generatePressureSentence(settlement));

  // ── GS-2 ONE FACTION SET (chair ruling on G-SEAMS S2, ODQ §934.101). The power factions are
  // the factions. `factions` groups the FINAL roster by each NPC's power affiliation and mints
  // no name; the conflicts are the power-faction pairs a rival or enemy tie crosses. Both read
  // the roster only now, because affiliation is decided by the coherence tail and the seats
  // above. The conflict draws (the count and the issue picks) take their own named child
  // stream, so they move nothing generated after them, and a town with no crossing tie has no
  // conflict row. Under a held roster both re-derive from the held NPCs: a pure projection and
  // a seed-stable stream.
  // PEOPLE-LAND (M-2, the shim out): the NPC grouping `settlement.factions` is no longer built; a
  // card's powers are its memberships and the powers are `powerStructure.factions`. MERGE-CAR: CENSUS-4
  // R12's roster fitter, which ran here before the grouping, is retired (the chair's SC-1 ruling).
  settlement.conflicts = inAssemblySubstream(
    rng,
    'faction-conflicts',
    () => generateConflicts(settlement.powerStructure?.factions || [], settlement.relationships || [], effectiveConfig, settlement.institutions || [], settlement.npcs || []),
  );
  if (settlement.powerStructure) {
    settlement.powerStructure = { ...settlement.powerStructure, conflicts: settlement.conflicts };
  }

  // ── A HOOK FALSE ON ITS OWN RECORD IS NOT STORED (lane RUNG1-TRUTH unit A, 2026-11-04;
  // docs/SOAK_1000_RUNG1_2026-11-04.md §2 row 11). Every hook writer has drawn by now and the
  // facts a hook can lie about are final (the food band, the defence roster above, the tier,
  // the world law), so the record-level check runs here, before the receipt reads the record,
  // and a contradicted hook is dropped: the list keeps its next candidate, or none. It draws
  // nothing and copies only the containers it changes, so a record whose hooks are all true is
  // byte-identical to before.
  // (`storeTrueHooksOnly` carries a filtered conflict list onto `powerStructure.conflicts`
  // too, so the dual-written addresses stay one list.) A HELD ROSTER IS NOT RE-WRITTEN: under a
  // held `npcs` pin the NPCs' hooks are the held record's, gated on the same key and primitive
  // as the structural appender above (the conflicts are re-derived on every run, never held).
  const npcsHeld = chooseOrPin(pins, 'npcs', () => UNPINNED) !== UNPINNED;
  Object.assign(settlement, storeTrueHooksOnly(settlement, { npcsHeld }));
  // ONE TRUE HOOK PER CARD (PEOPLE-3 HOOKS): a card whose one hook the check above refused takes
  // the next true line of its own pool, draw-free (people/personHooks.js); a held roster is not
  // re-written, under the same gate.
  if (!npcsHeld) {
    const npcs = truePersonHooks(settlement, resolveGenerationWorldLaw(ctx.generationContext, ctx.effectiveConfig || {}).portKind);
    if (npcs !== settlement.npcs) settlement.npcs = npcs;
  }
  if (chooseOrPin(pins, 'powerStructure', () => UNPINNED) === UNPINNED) resolveFactionLabelsAtClose(settlement); // CENSUS-1i R-AW: a label whose fact settles late resolves here, against the final roster, after every roster writer (MERGE-CAR: after the people car's true-hook pass; the rename cascades through `memberships[].power` and a minted card's `institution.key`) (no roll); a HELD powerStructure is the DM's and is not renamed (EM-R3, LANDING-R2)

  // Propagate the in-pipeline causal trace onto the settlement so
  // downstream consumers (PipelineRail, AI overlay, PDF) can read it.
  // The trace is built up across the run by `recordTrace(ctx, ...)`
  // calls inside individual steps; we copy it through here so the
  // settlement carries the receipt of its own generation. ⛔ BEFORE THE RECEIPT
  // (lane REVIEW-INTAKE-2 unit 6): the receipt's provenance reads the trace off the
  // settlement, so a copy made after it reported "No step trace was persisted" on
  // every world that carried one (tests/generators/receiptReadsPersistedTrace.test.js).
  if (Array.isArray(ctx.simulationTrace) && ctx.simulationTrace.length) {
    settlement.simulationTrace = ctx.simulationTrace;
  }

  // A durable, seed-stable receipt over the FINAL player-facing dossier.
  // Repairs happen in their owning passes; this boundary proves that the
  // resulting world law, prose, structure, food verdict, identity roster, and
  // isolation support agree. Explicit by-design premises stay visible without
  // turning a deliberately strange settlement into a failed generation.
  settlement.generationCoherenceReceipt = buildGenerationCoherenceReceipt(
    settlement,
    {
      seed: ctx._seed,
      generationContext: ctx.generationContext,
      generationRepairs: ctx.generationRepairs,
    },
  );

  // Deterministic id: normalizeSettlement uses `_seed` to mint a stable
  // settlement id (idFromSeed). Without _seed on the object at the
  // normalize step, every regeneration of the same config gets a
  // different id — which the review flagged as a determinism gap.
  // Attach _seed BEFORE normalize so the id derives from it.
  if (ctx._seed && !settlement._seed) {
    settlement._seed = ctx._seed;
  }

  // Wire the canonical-shape adapter at the assembly boundary. This is
  // the *only* point at which a newly-generated settlement enters the
  // wider app; normalizing here means every consumer downstream
  // (Zustand store, save layer, PDF, AI overlay) sees a settlement with
  // version stamps and a stable id. The legacy shape is preserved —
  // normalize only adds, never restructures.
  // Normalize first (version stamps, stable id, canonical containers incl. a
  // defaulted activeConditions: []), THEN promote stressors into conditions so
  // the crisis is durable substrate state, not just a stressor label, THEN
  // re-promote the event-authored conditions recorded in
  // config.eventConditions — the authored record (mutate.js dual-writes it to
  // config + _config) that keeps a what-if regeneration from erasing what the
  // DM's events did. Order matters: re-promotion dedupes against the
  // GENERATION-stamped twins the stressor promotion just minted.
  return { settlement: reapplyEventConditions(promoteStressorsToConditions(normalizeSettlement(settlement))) };
});
