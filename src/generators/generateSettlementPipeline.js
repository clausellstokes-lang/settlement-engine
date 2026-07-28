/**
 * generateSettlementPipeline.js — Pipeline-based settlement generation.
 *
 * Drop-in replacement for generateSettlement() that uses the pipeline runner.
 * Same signature, same output, but internally runs through registered steps
 * with seeded PRNG for deterministic generation.
 *
 * This is the sole settlement generation entry point.
 * Once validated, the old file can be deleted and this becomes the sole entry point.
 */

import { createPRNG, generateSeed } from '../kernel/prng.js';
import { setActiveRng, clearActiveRng } from '../kernel/rngContext.js';
import { runPipeline } from './pipeline.js';
import { generateNPCs, generateRelationships } from './npcGenerator.js';
import { generateFactions, generateConflicts } from './powerGenerator.js';
import { generateHistory } from './historyGenerator.js';
import { enrichNpcCoherence, relinkFactionMembers } from './narrativeGenerator.js';
import { enrichHistoryCoherence } from './narrative/historyCoherence.js';
import { withCustomContent } from '../lib/dependencyEngine.js';
import { countPreservedNpcs, mergePreservedNpcs } from '../domain/regenerationPreservation.js';
// The LOCKS leaf (importless but for clone.js), already in this chunk through
// regenerationPreservation — the full-generate carry reads the same id set the
// section reroll does, so the two paths can never disagree about what is locked.
import { lockedNpcIdSet } from '../domain/locksPreservation.js';
import { carryCampaignEvents, restoreAuthoredHistory } from '../domain/historyPreservation.js';
// Already in this chunk via npcGenerator; the reroll tail re-derives relationship
// prose from the same archetype table the generator used.
import { STRESS_ECONOMIC_EFFECTS } from '../data/npcData.js';
import {
  resolveConfigWithUserContentTunables,
} from '../domain/content/userContentTunables.js';
import {
  buildSettlementContentProvenance,
} from '../domain/content/settlementContentProvenance.js';
import { createGenerationContext } from './generationContext.js';

// Side-effect: registers all pipeline steps
import './steps/index.js';

/**
 * Generate a complete settlement using the pipeline.
 *
 * @param {Object}  config          — Generation configuration (same as old generateSettlement)
 * @param {Object}  [importedNeighbour] - Previously generated settlement to link as neighbour
 * @param {Object}  [options]
 * @param {string}  [options.seed]  - Seed for deterministic generation. Auto-generated if omitted.
 * @param {Function} [options.onStep] - Callback after each step: (name, ctx, patch) => void
 * @param {Function} [options.onComplete] - Callback after the full pipeline finishes,
 *   receives the final accumulated context. The store captures this as `lastCtx`
 *   (used for diagnostics / the pipeline rail). Existing callers that ignore this
 *   option get back exactly the settlement they always did.
 * @param {Object}  [options.customContent] - Custom-content snapshot to expose to the
 *   generator's dependencyEngine. If omitted, falls back to whatever the global
 *   source returns (the live store, when running in the app). Pass an explicit
 *   blob (or `{}`) to make this generation fully deterministic and headless —
 *   independent of any app state.
 * @param {Object} [options.contentTunables] - Registered defaults resolved from
 *   the active ContentEnvironmentRevision. Invalid or unknown values reject the
 *   run before the PRNG is touched.
 * @param {Object} [options.explicitConfigFields] - JSON-safe field-intent map.
 *   The store passes this separately because DEFAULT_CONFIG's materialized values
 *   are not evidence of a user choice. When omitted, registered keys present in
 *   `config` retain the conservative direct-caller meaning of explicit inputs.
 * @param {Object} [options.contentProvenance] - Exact reviewed environment and
 *   optional campaign-binding identity retained beside materialized definitions.
 * @returns {Object} Complete settlement data object (same shape as old generateSettlement)
 */
export function generateSettlementPipeline(config = {}, importedNeighbour = null, options = {}) {
  // Fail CLOSED on the options-in-the-neighbour-slot misuse: a caller that
  // writes generateSettlementPipeline(config, { seed, customContent }) has put
  // its options bag in the importedNeighbour parameter. The seed is then
  // silently discarded and generation falls through to generateSeed() —
  // non-reproducible output from a call site that believes it is seeded (the
  // exact failure mode rngContext.js fails closed against). A real imported
  // neighbour is a generated settlement: it carries `_seed`, never `seed` or
  // `customContent`.
  if (importedNeighbour && typeof importedNeighbour === 'object'
      && (
        'seed' in importedNeighbour
        || 'customContent' in importedNeighbour
        || 'contentTunables' in importedNeighbour
        || 'explicitConfigFields' in importedNeighbour
      )) {
    throw new Error(
      '[generateSettlementPipeline] the second argument is importedNeighbour, '
      + 'but it carries a recognized generation option. '
      + 'Pass options third: generateSettlementPipeline(config, null, { seed, ... }) '
      + '— otherwise the seed is silently ignored and the run is not reproducible.',
    );
  }
  const effectiveConfig = resolveConfigWithUserContentTunables(config, options);
  const seed = options.seed || config._seed || generateSeed();
  const rng = createPRNG(seed);

  const initialContext = {
    config: effectiveConfig,
    importedNeighbour,
    _seed: seed,
    // Deterministic trace timestamps: every recordTrace() call reads
    // and increments this monotonic counter instead of calling
    // Date.now(). Snapshots of `simulationTrace[].ts` stay stable
    // across runs of the same seed.
    _traceClock: 0,
  };

  const run = () => runPipeline(initialContext, rng, { onStep: options.onStep });

  const finalCtx = options.customContent !== undefined
    ? withCustomContent(options.customContent, run)
    : run();

  // Attach seed to settlement for replay
  if (finalCtx.settlement) {
    finalCtx.settlement._seed = seed;
    const contentProvenance = buildSettlementContentProvenance(
      finalCtx.settlement,
      options.customContent || {},
      options.contentProvenance || {},
    );
    if (contentProvenance) {
      finalCtx.settlement.customContentProvenance = contentProvenance;
    }
  }

  if (typeof options.onComplete === 'function') {
    try { options.onComplete(finalCtx); } catch (e) { console.warn('[pipeline] onComplete threw:', e); }
  }

  return finalCtx.settlement;
}

/**
 * Refresh everything a relationship denormalizes about its two NPCs.
 *
 * An edge stores npc1Name/npc1Role beside npc1Id so readers can render it
 * without loading the roster, AND it stores `description`/`tension` — prose the
 * archetype closures build by interpolating both names. All of it is a snapshot
 * taken at generation time that nothing re-derives, so once a preserved
 * character inherits the id of the character it displaced, the edge describes
 * somebody who is no longer in the cast.
 *
 * Repairing the four structured fields alone is actively worse than repairing
 * none: generationReceiptJudgments checks EXACTLY those four, so a half repair
 * turns the certifier green over prose the reader can see is wrong. The prose is
 * re-derived from the same archetype the generator used — `pairProse` picks its
 * variant with an FNV hash of the directed name pair, not an RNG draw, so this
 * consumes no randomness and cannot perturb a seeded run.
 *
 * Ids are never touched, so every edge still resolves.
 *
 * @param {Array<Record<string, unknown>>} relationships
 * @param {Array<{id?: string, name?: string, role?: string}>} npcs
 * @returns {Array<Record<string, unknown>>}
 */
function refreshRelationshipProjections(relationships, npcs) {
  if (!Array.isArray(relationships)) return relationships;
  const byId = new Map(npcs.map(npc => [npc?.id, npc]));
  return relationships.map(rel => {
    const first  = byId.get(/** @type {string} */ (rel?.npc1Id));
    const second = byId.get(/** @type {string} */ (rel?.npc2Id));
    if (!first && !second) return rel;
    /** @type {Record<string, unknown>} */
    const next = {
      ...rel,
      npc1Name: first?.name  ?? rel.npc1Name,
      npc1Role: first?.role  ?? rel.npc1Role,
      npc2Name: second?.name ?? rel.npc2Name,
      npc2Role: second?.role ?? rel.npc2Role,
    };
    // Directed order matters: the generator built these as desc(npc1, npc2).
    // A legacy edge carrying no archetypeKey keeps the prose it shipped with.
    const archetype = STRESS_ECONOMIC_EFFECTS[/** @type {string} */ (rel?.archetypeKey)];
    if (archetype && first && second) {
      next.description = archetype.desc(first, second);
      next.tension = archetype.tension(first, second);
    }
    return next;
  });
}

/**
 * Rewrite a displaced character's name out of the roster's own prose.
 *
 * generateCrimeLevel bakes another roster member's NAME into secret.what and
 * secret.stakes, so a survivor whose secret was written about the character a
 * keeper displaced goes on naming someone who left the cast. A path census over
 * the post-regen settlement found these two the only NPC fields carrying an
 * interpolated roster name.
 *
 * The keeper now OCCUPIES that slot and inherited its id and its edges, so
 * inheriting the slot's name references is the consistent reading. Keepers
 * themselves are skipped — their prose may be user-authored, and the merge has
 * no business editing canon. A departed name that still belongs to someone in
 * the cast is skipped too, so a namesake substitution rewrites nothing.
 *
 * @param {Array<Record<string, any>>} npcs
 * @param {Array<{from: string, to: string}>} displacements
 * @param {Set<string>} keeperIds
 * @returns {Array<Record<string, any>>}
 */
function refreshRosterProse(npcs, displacements, keeperIds) {
  const live = new Set(npcs.map(npc => String(npc?.name || '')).filter(Boolean));
  const swaps = displacements.filter(swap => swap.from && swap.to && !live.has(swap.from));
  if (swaps.length === 0) return npcs;

  return npcs.map(npc => {
    const secret = npc?.secret;
    if (!npc || keeperIds.has(npc.id) || !secret || typeof secret !== 'object') return npc;
    let what = secret.what;
    let stakes = secret.stakes;
    let touched = false;
    for (const { from, to } of swaps) {
      if (typeof what === 'string' && what.includes(from)) { what = what.split(from).join(to); touched = true; }
      if (typeof stakes === 'string' && stakes.includes(from)) { stakes = stakes.split(from).join(to); touched = true; }
    }
    return touched ? { ...npc, secret: { ...secret, what, stakes } } : npc;
  });
}

/**
 * The SETTLEMENT-LEVEL prose that interpolates a roster member's name.
 *
 * A name census over the serialized full-pipeline output (5 seeds, 2026-07-27)
 * found interpolated roster names in exactly these places: the NPC objects
 * themselves and their `secret` prose (repaired by refreshRosterProse), the
 * relationship edges (re-derived by refreshRelationshipProjections), the social
 * factions' member objects (re-linked by relinkFactionMembers), and then these
 * two settlement-level carriers, which nothing else touches:
 *
 *   • `pressureSentence` — one string naming two roster members.
 *   • `prominentRelationship` — an object whose STRING fields (npc1, npc2,
 *     phrasing, full, tension) all name the pair. It is null on many seeds, which
 *     is why every string field is swept rather than a frozen key list: a field
 *     genRelNarrative adds later must not become a place a departed name hides.
 *     generationReceiptJudgments checks prominentRelationship.npc1/npc2 against
 *     the live roster, so leaving this unrepaired would fail the certifier.
 *
 * powerStructure, conflicts, history, arrivalScene and coherenceNotes had ZERO
 * hits across every seed — they are faction-name-keyed or nameless — and are
 * deliberately untouched.
 */
const NAME_CARRYING_PROSE = Object.freeze({
  scalar: Object.freeze(['pressureSentence']),
  objectOfStrings: Object.freeze(['prominentRelationship']),
});

/**
 * Rewrite a departed character's name to the keeper who took their slot.
 * @param {unknown} text
 * @param {Array<{from: string, to: string}>} swaps
 * @returns {{ value: unknown, touched: boolean }}
 */
function swapNames(text, swaps) {
  if (typeof text !== 'string') return { value: text, touched: false };
  let out = text;
  let touched = false;
  for (const { from, to } of swaps) {
    if (out.includes(from)) { out = out.split(from).join(to); touched = true; }
  }
  return { value: out, touched };
}

/**
 * THE FULL-GENERATE ROSTER CARRY — locks engine Phase B.
 *
 * A full generate mints an entirely new town, and until this existed the id
 * arrays in `state.locks` were simply dropped: the user could say "keep this
 * person" and a new roll would take them anyway. This is the tail that makes the
 * promise true, and it is the SAME tail regenNPCsPipeline already runs over a
 * section reroll — substitution, prose repair, projection refresh, faction
 * relink — lifted to run over finished pipeline output.
 *
 * ── WHY THIS CANNOT PERTURB A SEEDED ROLL (THE PROMISE) ─────────────────────
 *
 * Every draw is finished before this function is entered. mergePreservedNpcs is
 * pure post-hoc substitution; refreshRelationshipProjections re-derives prose
 * from the edge's own archetypeKey through an FNV hash of the name pair, not an
 * RNG draw; refreshRosterProse, relinkFactionMembers and the prose swap are
 * string and reference rewrites. Nothing here touches the active RNG.
 *
 * The DORMANCY GATE below returns the fresh settlement by the SAME REFERENCE
 * whenever the lock map names no NPC id — absent, `{}`, booleans-only, garbage,
 * or an array of ids nobody in the previous roster carries. That is the path
 * every existing world takes, and it is what makes "a seed is a world, forever"
 * hold for them byte-for-byte.
 *
 * ── ACCEPTED INCOHERENCES (documented, not bugs to re-find) ─────────────────
 *
 * The keeper's `factionAffiliation` and its derived standing (structuralRank,
 * structuralPosition, activeConstraint, settlementCondition) are frozen from the
 * world it was preserved from — the same deferral regenerationPreservation.js
 * records as its deferral 1, and for the same reason: re-enriching would rewrite
 * the authored `goal.short` the merge exists to protect.
 *
 * OVERFLOW — more locked ids than the fresh cast has slots — appends the surplus
 * keepers with a minted id, no relationships and no faction, and reports them.
 * Deliberately NOT cured with a `_minNpcCount` roll floor the way the section
 * reroll cures it: the floor would have to ride `fullConfig`, and fullConfig IS
 * PERSISTED as `settlement.config`. Either the key persists — leaking a
 * permanent roster floor into later unlocked section rerolls — or it is stripped,
 * which breaks seed+config replay under THE PROMISE because the roll depended on
 * an input the stored config no longer records. Post-hoc overflow is the honest
 * answer, and it needs more locked characters than the new town has people.
 *
 * @param {Record<string, any>|null|undefined} previousSettlement  the town being replaced
 * @param {Record<string, any>|null|undefined} freshSettlement     the town just generated
 * @param {Record<string, unknown>|null|undefined} locks           the settlement's lock map
 * @returns {{ settlement: any, _preservation?: { preserved: Array<{id: string, name: string, fromId: string}>, overflow: Array<{id: string, name: string}> } }}
 *   The report is OUT OF BAND on purpose: it is a trace, and if it ever entered
 *   the settlement blob it would persist, export and diff forever.
 */
export function carryLockedRosterThroughGenerate(previousSettlement, freshSettlement, locks) {
  const previousNpcs = previousSettlement?.npcs;
  if (
    !freshSettlement
    || !Array.isArray(previousNpcs) || previousNpcs.length === 0
    || lockedNpcIdSet(locks).size === 0
  ) {
    return { settlement: freshSettlement };
  }

  const { npcs: merged, preserved, displacements, overflow } = mergePreservedNpcs(
    previousNpcs,
    freshSettlement.npcs,
    { locks, lockedIdsOnly: true },
  );
  // Every locked id named somebody the previous roster does not hold. Nothing to
  // carry, so the fresh town goes back untouched — same reference, no report.
  if (preserved.length === 0) return { settlement: freshSettlement };

  const keeperIds = new Set(preserved.map(entry => entry.id));
  // Prose repair BEFORE the relink, so the factions bind to repaired objects
  // rather than ghosted ones — the ordering regenNPCsPipeline uses.
  const roster = displacements.length
    ? refreshRosterProse(merged, displacements, keeperIds)
    : merged;

  /** @type {Record<string, any>} */
  const next = {
    ...freshSettlement,
    npcs: roster,
    relationships: refreshRelationshipProjections(freshSettlement.relationships, roster),
    factions: relinkFactionMembers(freshSettlement.factions, roster),
  };

  // A departed name that still belongs to somebody in the final cast is not
  // departed at all — the same live-name filter refreshRosterProse applies, so a
  // namesake substitution rewrites nothing.
  const live = new Set(roster.map(npc => String(npc?.name || '')).filter(Boolean));
  const swaps = displacements.filter(swap => swap.from && swap.to && !live.has(swap.from));
  if (swaps.length > 0) {
    for (const key of NAME_CARRYING_PROSE.scalar) {
      const { value, touched } = swapNames(next[key], swaps);
      if (touched) next[key] = value;
    }
    for (const key of NAME_CARRYING_PROSE.objectOfStrings) {
      const source = next[key];
      if (!source || typeof source !== 'object') continue;
      /** @type {Record<string, any>} */
      const rewritten = { ...source };
      let touchedAny = false;
      for (const field of Object.keys(rewritten)) {
        const { value, touched } = swapNames(rewritten[field], swaps);
        if (touched) { rewritten[field] = value; touchedAny = true; }
      }
      if (touchedAny) next[key] = rewritten;
    }
  }

  return { settlement: next, _preservation: { preserved, overflow } };
}

/**
 * Re-generate NPCs for an existing settlement.
 * Uses the pipeline's generatePopulation step in isolation.
 *
 * Runs under a seeded PRNG: the underlying generators draw from the active RNG
 * and SILENTLY fall back to Math.random() when none is set — so a bare regen was
 * non-deterministic and unreproducible. `options.seed` lets a caller reproduce a
 * prior reroll; omitting it mints a fresh seed (a real reroll). The seed used is
 * returned on `_regenSeed` so the caller can persist it for replay.
 *
 * Characters the user has authored or locked survive the reroll (see the
 * preservation tail below). A settlement holding none is unaffected: it gets
 * the roster this seed has always produced.
 *
 * @param {Object} settlement
 * @param {Object} config
 * @param {{ seed?: string, mode?: string, locks?: Record<string, unknown>|null }} [options]
 *   `mode` selects the preservation policy (nudge / rebalance / reforge); it
 *   defaults to 'rebalance', which keeps user canon and locked entities.
 *   `locks` is the settlement's lock map (domain/locksPreservation.js); the ids it
 *   names survive on top of whatever the mode already carries. Absent or empty ⇒
 *   the dormant path, byte-identical to a call that never passed it.
 */
export function regenNPCsPipeline(settlement, config, options = {}) {
  const seed = options.seed || generateSeed();
  // Save/restore: a regen called from inside an outer seeded run must restore
  // the outer RNG, not clear it to null (setActiveRng returns the prior RNG).
  const prevRng = setActiveRng(createPRNG(seed));
  try {
    const generationContext = createGenerationContext({
      config,
      tier: settlement.tier,
      tradeRoute:
        config.tradeRouteAccess
        || settlement.config?.tradeRouteAccess,
      terrainType:
        config.terrainType
        || settlement.config?.terrainType,
      cultureProfileId:
        config.cultureProfileKey
        || config.culture,
    });
    // Roster size is a seeded draw and can come back SMALLER than the pinned
    // cast, which would leave the surplus keepers appended with no relationships
    // and no faction — surviving in name only. Floor the roll at the number the
    // merge will carry, computed with the merge's own predicate so the two can
    // never disagree. The draw still happens first, so a settlement holding no
    // canon floors at 0 and rolls exactly what it always rolled.
    // The dormant path must hand over the SAME config object, not a spread copy
    // carrying a zero floor — anything downstream that fingerprints config keys
    // would see a shape change where nothing changed.
    const preservedCount = countPreservedNpcs(settlement.npcs, { mode: options.mode, locks: options.locks });
    const rollConfig = preservedCount > 0 ? { ...config, _minNpcCount: preservedCount } : config;
    const npcs = generateNPCs({
      tier: settlement.tier,
      institutions: settlement.institutions || [],
      powerStructure: settlement.powerStructure,
      economicState: settlement.economicState,
    }, config.culture || 'germanic', rollConfig, generationContext);
    const relationships = generateRelationships(npcs, config, settlement.institutions || []);
    const factions = generateFactions(npcs, relationships);

    // Re-link to existing power factions
    const existingPF = settlement.powerStructure?.factions || [];
    const pfByCategory = existingPF.reduce((acc, pf) => {
      const cat = pf.category || 'other';
      if (!acc[cat] || pf.power > acc[cat].power) acc[cat] = pf;
      return acc;
    }, {});
    factions.forEach(fg => {
      const cat = fg.dominantCategory || 'other';
      const matched = pfByCategory[cat];
      if (matched) {
        fg.powerFactionName = matched.faction;
        fg.powerFactionPower = matched.power;
        fg.powerFactionCat = matched.category;
      }
    });

    const conflicts = generateConflicts(factions, relationships, config, settlement.institutions || []);

    // domain-3: run the SAME NPC coherence-enrichment tail assembly runs, so a
    // rerolled roster carries factionAffiliation, the secrets overlay, and
    // structuralPosition — not the poorer raw generateNPCs shape. The enrichment
    // reads the live settlement state (legitimacy/capture/food/prosperity) plus the
    // freshly generated npcs; give it a settlement-shaped view with the new roster.
    const enrichedNpcs = enrichNpcCoherence({ ...settlement, npcs, config });

    // The user's canon rides OVER the finished roll rather than through it. Every
    // draw above has already happened, so preservation cannot perturb a seeded
    // run, and a settlement carrying no authored or locked NPC gets back exactly
    // the roster it got before this tail existed.
    //
    // Merging AFTER enrichment is the load-bearing detail: enrichNpcCoherence
    // rewrites goal.short for its top-ranked NPCs, and goal.short is itself a
    // user-editable field — enriching a preserved character would undo the very
    // edit being preserved.
    const { npcs: merged, preserved, displacements, overflow } = mergePreservedNpcs(
      /** @type {{npcs?: Array<Record<string, unknown>>}} */ (settlement).npcs,
      enrichedNpcs,
      { mode: options.mode, locks: options.locks },
    );

    // Write the displaced characters out of the prose BEFORE relinking, so the
    // factions bind to the repaired objects rather than the ghosted ones.
    const roster = displacements.length
      ? refreshRosterProse(merged, displacements, new Set(preserved.map(p => p.id)))
      : merged;

    // Re-link the fresh faction rosters to the FINAL npcs (not the raw generateNPCs
    // shape their members were built from) — the same one-source repair generateCoherence
    // applies on the full-assembly path. [experience-faction-member-staleness]
    // A preserved character inherits its slot's id, so this also swaps the displaced
    // stranger out of every faction that had recruited them.
    return {
      npcs: roster,
      relationships: preserved.length
        ? refreshRelationshipProjections(relationships, roster)
        : relationships,
      factions: relinkFactionMembers(factions, roster),
      conflicts,
      _regenSeed: seed,
      // The preservation REPORT, out of band of the settlement parts. A keeper
      // inherits its slot's id, so a caller holding id-keyed state (the lock map)
      // must be told fromId -> id or its lock silently follows the stranger who
      // took the old slot. Omitted entirely when nothing was preserved, so the
      // dormant path returns the exact key set it always returned; the store
      // destructures it OFF before folding the parts into the settlement blob.
      ...(preserved.length ? { _preservation: { preserved, overflow } } : {}),
    };
  } finally {
    clearActiveRng(prevRng);
  }
}

/**
 * Re-generate history for an existing settlement. Seeded like regenNPCsPipeline.
 *
 * Three tails ride over the finished roll, in this order, each dormant when it
 * has nothing to do:
 *
 *  1. The campaign-era events worldPulse committed to `historicalEvents` are
 *    carried across. They are the table's record of what happened, not
 *    generation output, and a reroll used to delete them (domain/
 *    historyPreservation.js explains why no mode gates this).
 *  2. The coherence tail assembly runs. generateHistory mints NEITHER
 *    `siegeNarrative` NOR `legacyAnnotations` and ships a crude
 *    `historicalCharacter` stub that assembly overwrites, so a reroll used to
 *    trade a paragraph of prose for "stable and prosperous" and drop the other
 *    two fields entirely — the same defect regenNPCsPipeline had before
 *    enrichNpcCoherence. It runs over the FINAL events, campaign entries
 *    included, so the character sentence describes the array stored beside it.
 *  3. The settlement's authored `history.*` prose is restored last, because the
 *    tail above mints `historicalCharacter` and that field is itself editable.
 *
 * NOT fixed here (deliberate, documented): the minted seed still is not
 * recorded — the NPC twin returns `_regenSeed` at the settlement root, and a
 * `history._regenSeed` would mean something different, so [generators-pipeline-5]
 * stays open rather than being half-answered. Authored ENTRIES inside
 * `historicalEvents[]` / `currentTensions[]` also still reroll away; they have
 * no identity to be carried by (historyPreservation.js, deferral A).
 *
 * @param {Object} settlement
 * @param {Object} config
 * @param {{ seed?: string }} [options]
 */
export function regenHistoryPipeline(settlement, config, options = {}) {
  const seed = options.seed || generateSeed();
  // Save/restore: same re-entrancy contract as regenNPCsPipeline.
  const prevRng = setActiveRng(createPRNG(seed));
  try {
    const generationContext = createGenerationContext({
      config,
      tier: settlement.tier,
      tradeRoute:
        config.tradeRouteAccess
        || settlement.config?.tradeRouteAccess,
      terrainType:
        config.terrainType
        || settlement.config?.terrainType,
      cultureProfileId:
        config.cultureProfileKey
        || config.culture,
    });
    const fresh = generateHistory(
      settlement.tier, { ...config, _seed: settlement._seed ?? seed }, settlement.institutions || [],
      settlement.economicViability, settlement.economicState, settlement.powerStructure,
      generationContext,
    );
    // Same-reference dormancy: a settlement whose world never advanced keeps the
    // exact array generateHistory returned, so its reroll is unchanged.
    const historicalEvents = carryCampaignEvents(settlement.history, fresh.historicalEvents);
    const carried = historicalEvents === fresh.historicalEvents
      ? fresh
      : { ...fresh, historicalEvents };
    const { historicalCharacter, siegeNarrative, legacyAnnotations } =
      enrichHistoryCoherence(carried, settlement);
    // Key order mirrors the assembly path's finished history exactly, and
    // legacyAnnotations is gated on non-empty the way the generateNarratives
    // step gates it, so a rerolled history is shape-identical to a generated one.
    return restoreAuthoredHistory(settlement, {
      ...carried,
      historicalCharacter,
      ...(legacyAnnotations.length > 0 ? { legacyAnnotations } : {}),
      siegeNarrative,
    });
  } finally {
    clearActiveRng(prevRng);
  }
}
