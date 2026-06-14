/**
 * stepMetadata.js — Human-readable labels + summaries for pipeline steps.
 *
 * The Pipeline Rail ("How this was simulated") shows each procedural
 * step the engine ran, with a one-line description of what that step
 * decided. This file is the single source for those labels.
 *
 * Keep entries here in sync with the registrations in steps/index.js.
 * A step listed here that isn't registered will silently never appear;
 * a step registered but missing from here will fall back to its raw
 * machine name. Both are loud in DEV through the test below.
 *
 * Naming:
 *   - `label`        — short noun phrase shown in the rail.
 *   - `description`  — one sentence shown on hover/expand.
 *   - `summary(ctx)` — optional. Receives the post-step context, returns
 *                      a short factual string (e.g. "5 institutions
 *                      assembled"). The rail renders it under the label
 *                      so the user sees what *actually* happened on
 *                      this run, not just what could happen.
 */

export const STEP_METADATA = Object.freeze({
  resolveConfig: {
    label: 'Resolve configuration',
    description: 'Apply user choices (size, terrain, culture, trade access) and fill in defaults.',
    // resolveConfig provides ctx.tier (the resolved tier); ctx.config is the raw
    // input whose .tier is the unresolved sentinel in random/custom mode.
    summary: (ctx) => ctx.tier ? `Target size: ${ctx.tier}` : null,
  },
  resolveResources: {
    label: 'Pick local resources',
    description: 'Decide which natural resources the land yields, based on terrain and trade.',
    summary: (ctx) => {
      const rs = ctx.nearbyResources?.length || 0;
      return rs ? `${rs} local resource${rs === 1 ? '' : 's'} chosen` : null;
    },
  },
  resolveStress: {
    label: 'Determine stressors',
    description: 'Roll the active stressors (plague, drought, raid pressure, etc.) that shape this run.',
    summary: (ctx) => {
      // resolveStress provides ctx.stressTypes (catalog types) + ctx.stress (the
      // container, which also carries custom authored stressors).
      const ss = Array.isArray(ctx.stressTypes) ? ctx.stressTypes.length
               : Array.isArray(ctx.stress) ? ctx.stress.length
               : (ctx.stress ? 1 : 0);
      return ss ? `${ss} active stressor${ss === 1 ? '' : 's'}` : 'No active stressors';
    },
  },
  resolveNeighbour: {
    label: 'Link neighbour',
    description: 'If a neighbouring settlement was provided, weave its facts into this one.',
    // resolveNeighbour provides ctx.neighbourProfile / ctx.rawNeighbour, not importedNeighbour.
    summary: (ctx) => {
      const name = ctx.neighbourProfile?.name || ctx.rawNeighbour?.name;
      return name ? `Linked to ${name}` : 'No neighbour';
    },
  },
  assembleInstitutions: {
    label: 'Assemble institutions',
    description: 'Choose which institutions exist (inn, mill, temple, market, etc.) for this size + culture.',
    summary: (ctx) => {
      const n = ctx.institutions?.length || 0;
      return n ? `${n} institution${n === 1 ? '' : 's'} placed` : null;
    },
  },
  subsumptionPass: {
    label: 'Subsume duplicates',
    description: 'Collapse institutions that overlap (a market subsumes a stall, a guild subsumes its workshops).',
    summary: (ctx) => {
      const removed = ctx._subsumed?.length || 0;
      return removed ? `${removed} duplicate${removed === 1 ? '' : 's'} subsumed` : 'Nothing collapsed';
    },
  },
  cascadePass: {
    label: 'Cascade institutional effects',
    description: 'Propagate one institution’s outputs (a mill makes flour; a baker can now exist).',
    summary: () => null,
  },
  isolationPass: {
    label: 'Resolve isolation',
    description: 'Detach institutions that lost their dependencies (a smith with no fuel becomes a husk).',
    summary: () => null,
  },
  stressConfirmPass: {
    label: 'Confirm stressors',
    description: 'Re-weight emergent stressors against the real roster — walls suppress sieges, granaries suppress famine.',
    summary: (ctx) => {
      const n = Array.isArray(ctx.stressTypes) ? ctx.stressTypes.length : 0;
      return n ? `${n} stressor${n === 1 ? '' : 's'} confirmed` : 'No stressors survived confirmation';
    },
  },
  generateEconomy: {
    label: 'Build economy + supply chains',
    description: 'Compute prices, supply chains, prosperity band, and visible economic frictions.',
    // generateEconomy provides ctx.economicState; the prosperity label is .prosperity.
    summary: (ctx) => {
      const band = ctx.economicState?.prosperity;
      return band ? `Prosperity: ${band}` : null;
    },
  },
  generatePower: {
    label: 'Form factions',
    description: 'Define the political factions, their stake, and what they’d each like to happen next.',
    // generatePower provides ctx.powerStructure.
    summary: (ctx) => {
      const n = ctx.powerStructure?.factions?.length || 0;
      return n ? `${n} faction${n === 1 ? '' : 's'} formed` : null;
    },
  },
  neighbourFactions: {
    label: 'Link neighbour factions',
    description: 'Stitch in the neighbouring settlement’s factions where they have local interests.',
    summary: () => null,
  },
  factionCorrelationPass: {
    label: 'Correlate tensions',
    description: 'Compute who is allied, who is at odds, and which tensions are about to boil.',
    // This pass derives faction-boost institutions; tensions/history don't exist
    // yet (they come from generateNarratives). Report whether it changed the roster.
    summary: (ctx) => ctx._rosterChangedAfterEconomy
      ? 'Faction pressure reshaped the roster'
      : null,
  },
  economyReconcilePass: {
    label: 'Reconcile economy with final roster',
    description: 'Re-derive chains, services, and spatial placement so faction-pulled institutions join the economy.',
    summary: (ctx) => ctx._rosterChangedAfterEconomy ? 'Economy re-derived for the final roster' : 'Roster unchanged — economy confirmed',
  },
  structuralValidationPass: {
    label: 'Validate structure',
    description: 'Check the FINAL roster for tier, dependency, and access contradictions — the coherence receipt.',
    summary: (ctx) => {
      const v = ctx.structural?.violations?.length || 0;
      return v ? `${v} structural finding${v === 1 ? '' : 's'}` : 'No structural findings';
    },
  },
  generatePopulation: {
    label: 'Generate NPCs',
    description: 'Cast the named NPCs: rulers, faction heads, plot-hook owners, and the merchant your players will ask about.',
    summary: (ctx) => {
      const n = ctx.npcs?.length || 0;
      return n ? `${n} NPC${n === 1 ? '' : 's'} named` : null;
    },
  },
  corruptionPass: {
    label: 'Seed corruption',
    description: 'Where a criminal institution exists, roll which flawed NPCs were already corrupted at generation.',
    summary: (ctx) => {
      const n = (ctx.npcs || []).filter(npc => npc?.corrupt === true).length;
      return n ? `${n} corrupted figure${n === 1 ? '' : 's'}` : 'No corruption climate';
    },
  },
  generateNarratives: {
    label: 'Compose narratives',
    description: 'Write the prose layer — history, defense, daily-life, and per-faction asides.',
    summary: () => null,
  },
  assembleSettlement: {
    label: 'Assemble dossier',
    description: 'Bundle every layer into the final settlement object the dossier renders from.',
    summary: () => null,
  },
});

/**
 * Resolve metadata for a step name. Always returns an object (so the
 * rail never crashes on an unknown name); the `label` falls back to the
 * raw name when missing so the surface still reads.
 */
export function metaForStep(name) {
  return STEP_METADATA[name] || { label: name, description: '', summary: () => null };
}
