/**
 * stepMetadata.js - Human-readable labels + summaries for pipeline steps.
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
 *   - `label`        - short noun phrase shown in the rail.
 *   - `description`  - one sentence shown on hover/expand.
 *   - `summary(ctx)` - optional. Receives the post-step context, returns
 *                      a short factual string (e.g. "5 institutions
 *                      assembled"). The rail renders it under the label
 *                      so the user sees what *actually* happened on
 *                      this run, not just what could happen.
 */

export const STEP_METADATA = Object.freeze({
  resolveConfig: {
    label: 'Resolve configuration',
    description: 'Apply user choices (size, terrain, culture, trade access) and fill in defaults.',
    summary: (ctx) => ctx.config?.tier ? `Target size: ${ctx.config.tier}` : null,
  },
  resolveResources: {
    label: 'Pick local resources',
    description: 'Decide which natural resources the land yields, based on terrain and trade.',
    summary: (ctx) => {
      const rs = ctx.resources?.local?.length;
      return rs ? `${rs} local resource${rs === 1 ? '' : 's'} chosen` : null;
    },
  },
  resolveStress: {
    label: 'Determine stressors',
    description: 'Roll the active stressors (plague, drought, raid pressure, etc.) that shape this run.',
    summary: (ctx) => {
      const ss = ctx.stressors?.active?.length || 0;
      return ss ? `${ss} active stressor${ss === 1 ? '' : 's'}` : 'No active stressors';
    },
  },
  resolveNeighbour: {
    label: 'Link neighbour',
    description: 'If a neighbouring settlement was provided, weave its facts into this one.',
    summary: (ctx) => ctx.importedNeighbour ? `Linked to ${ctx.importedNeighbour.name}` : 'No neighbour',
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
  generateEconomy: {
    label: 'Build economy + supply chains',
    description: 'Compute prices, supply chains, prosperity band, and visible economic frictions.',
    summary: (ctx) => {
      const band = ctx.economy?.prosperityBand;
      return band ? `Prosperity: ${band}` : null;
    },
  },
  generatePower: {
    label: 'Form factions',
    description: 'Define the political factions, their stake, and what they’d each like to happen next.',
    summary: (ctx) => {
      const n = ctx.power?.factions?.length || ctx.factions?.length || 0;
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
    summary: (ctx) => {
      const t = ctx.tensions?.length || ctx.history?.currentTensions?.length || 0;
      return t ? `${t} live tension${t === 1 ? '' : 's'}` : null;
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
  generateNarratives: {
    label: 'Compose narratives',
    description: 'Write the prose layer - history, defense, daily-life, and per-faction asides.',
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
