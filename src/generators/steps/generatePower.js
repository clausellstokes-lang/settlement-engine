/**
 * Step 10: generatePower
 *
 * Generates power structure (government, factions, legitimacy).
 *
 * Power-structure step for the settlement generation pipeline.
 *
 * Tier 4.1: emits structured faction traces after the legacy power
 * generator finishes. The generator itself is not refactored — the
 * traces are layered on top via deriveFactionProfile, which is the
 * same Strangler Fig pattern the rest of the simulator's causality
 * work follows.
 */

import { chooseOrPin, registerStep } from '../pipeline.js';
import { recordTrace } from '../../domain/trace.js';
import { deriveFactionProfile } from '../../domain/factionProfile.js';
import { isAdversarialRelationship } from '../../domain/relationships/canonicalRelationship.js';
import {
  createPowerGenerationIntent,
  projectPowerGenerationIntent,
} from '../power/economyReconciliation.js';

/**
 * THE UNPINNED SENTINEL. `chooseOrPin` returns the thunk's value only when the key is ABSENT
 * from the bag, so returning this symbol is how the step asks the SHARED primitive whether a
 * chooser is held without re-spelling its own-property rule. It is module-private, so no pin
 * value can ever equal it.
 */
const UNPINNED = Symbol(); // The description was removed to buy the generation worker's bytes back at train EM-T13's terminal (judgment 187); the sentinel's IDENTITY is what the code compares, never its description, which nothing in src or tests reads.

registerStep('generatePower', {
  deps: ['generateEconomy', 'resolveNeighbour'],
  reads: ['economicState', 'effectiveConfig', 'institutions', 'tier'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  // DECLARED: this step wants the PROVISIONAL economy. It establishes political intent, and
  // economyReconcilePass re-derives the economy AFTER that intent lands — ordering it later
  // would cycle (the dataFlowContract SCOPE NOTE's own argument).
  readsVersion: { economicState: 'provisional' },
  // powerIntent is transient pipeline state. It retains the original power
  // inputs + named RNG stream so the final economy can re-project scores
  // without regenerating political identities or reopening institution pulls.
  provides: ['powerIntent', 'powerStructure'],
  phase: 'power',
}, (ctx, rng) => {
  const {
    tier, economicState, effectiveConfig, institutions,
  } = ctx;
  // THE PIN CONSULT (EM-B2a3). Both of this step's choosers are gated through the runner's
  // shared primitive at the call that produces them, so a held key costs no draw and no call.
  const pins = ctx.__pins || null;

  // Note: neighbour faction influence is consumed by the separate
  // neighbourFactions step (ctx.neighbourFacBias); generatePowerStructure
  // itself reads no neighbour bias, so none is threaded into its config.
  //
  // The 3rd arg (neighbourRelationship) drives the hostile-neighbour stability band
  // and the "Ongoing tensions with {neighbour}" recentConflict line. resolveNeighbour writes
  // effectiveConfig.neighborRelationship = { neighborName, relationshipType } when a
  // neighbour is bound. Pass it ONLY for adversarial relationships — the recentConflict
  // branch fires for ANY truthy value, so an allied/trade_partner neighbour must be
  // passed as null to avoid a false "ongoing tensions" claim.
  const neighbourRel = effectiveConfig.neighborRelationship;
  // pipeline-3: gate on the REAL relationship vocabulary. The old Set keyed on
  // spellings the UI never emits ('hostile_rival'/'Hostile rival'/'tense'), so
  // .has('hostile')/.has('rival') were always false and the two most adversarial
  // relationships never militarized governance. isAdversarialRelationship is the
  // shared predicate (canonicalRelationship) the priorityHelpers reader also uses.
  const neighbourRelationshipArg = neighbourRel && isAdversarialRelationship(neighbourRel.relationshipType)
    ? neighbourRel
    : null;
  // A held value leaves this step BY REFERENCE (design §22 ruling 6, re-homed by EM-R1): the
  // bytes are already the runner's, because `runPipeline` deep-clones the pin bag on entry,
  // once, per channel, so nothing here can reach an object the caller owns. Local clone retired.
  const heldIntent = chooseOrPin(pins, 'powerIntent', () => UNPINNED);
  const powerIntent = heldIntent === UNPINNED
    ? createPowerGenerationIntent({
      stepRng: rng,
      tier,
      neighbourRelationship: neighbourRelationshipArg,
      config: effectiveConfig,
      institutions,
    })
    : heldIntent;
  const heldStructure = chooseOrPin(pins, 'powerStructure', () => UNPINNED);
  const powerStructure = heldStructure === UNPINNED
    ? projectPowerGenerationIntent(powerIntent, economicState)
    : heldStructure;

  // ── Trace recording (Tier 4.1) ───────────────────────────────────────
  // Emit one trace per faction the generator produced. Causes describe
  // what gave the faction its power; downstream describes what
  // subsystems the faction's archetype influences. The
  // deriveFactionProfile call enriches the legacy shape with archetype
  // + resource bands so the trace carries the meaningful classification.

  const factionsList = powerStructure?.factions || [];

  for (const f of factionsList) {
    const profile = deriveFactionProfile(f, { powerStructure });
    if (!profile) continue;

    // The generator marks the governing entry directly; name-matching
    // against powerStructure.governingName would readmit substring false
    // positives (e.g. Merchant Guilds under a Merchant oligarchy).
    const isGoverning = f.isGoverning === true;

    const causes = [];
    causes.push({
      source: `tier.${tier}`,
      effect: `power ${profile.power}`,
      reason: `Tier baseline plus tier-scaled archetype multiplier for ${profile.archetype}.`,
    });
    if (isGoverning) {
      causes.push({
        source: 'governingFaction',
        effect: 'inherits public legitimacy',
        reason: `As the governing faction, ${profile.name} inherits the settlement's public-legitimacy score (${profile.legitimacy}).`,
      });
    }
    if (Array.isArray(institutions) && institutions.length) {
      // Mention the institutional ground-truth that the power generator
      // keys off. We don't try to attribute specific institutions to
      // specific factions here — that's a Tier 4.2 concern.
      causes.push({
        source: 'institutionMix',
        effect: 'archetype context',
        reason: `Power derives in part from the institution mix (${institutions.length} institutions across ${new Set(institutions.map(i => i.category).filter(Boolean)).size} categories).`,
      });
    }

    // Downstream effects derived from the archetype. Mirrors the
    // institution-tag downstream logic in assembleInstitutions.
    const downstreamEffects = [];
    switch (profile.archetype) {
      case 'military':
      case 'occupation':
        downstreamEffects.push({ target: 'publicOrder',      effect: 'reinforced' });
        downstreamEffects.push({ target: 'defenseCapacity',  effect: 'reinforced' });
        break;
      case 'religious':
        downstreamEffects.push({ target: 'welfareCapacity',  effect: 'reinforced' });
        downstreamEffects.push({ target: 'publicLegitimacy', effect: 'influenced' });
        break;
      case 'merchant':
        downstreamEffects.push({ target: 'tradeConnectivity', effect: 'reinforced' });
        downstreamEffects.push({ target: 'economy',           effect: 'influenced' });
        break;
      case 'craft':
        downstreamEffects.push({ target: 'craftCapacity', effect: 'reinforced' });
        break;
      case 'criminal':
        downstreamEffects.push({ target: 'publicOrder', effect: 'eroded'     });
        downstreamEffects.push({ target: 'blackMarket', effect: 'reinforced' });
        break;
      case 'arcane':
        downstreamEffects.push({ target: 'magicCapacity', effect: 'reinforced' });
        break;
      case 'government':
        downstreamEffects.push({ target: 'publicLegitimacy', effect: isGoverning ? 'anchored' : 'influenced' });
        break;
      default:
        // 'other' — no canonical downstream
        break;
    }

    recordTrace(ctx, {
      targetType: 'faction',
      targetId:   profile.id,
      step:       'generatePower',
      result:     isGoverning ? 'governing' : 'formed',
      causes,
      downstreamEffects,
    });
  }

  return { powerIntent, powerStructure };
});
