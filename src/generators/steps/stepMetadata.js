/**
 * stepMetadata.js — what each pipeline step DID (worker side) and what the rail
 * CALLS it (main-thread side), in two tables that cross no thread.
 *
 * The Pipeline Rail ("How this was simulated") shows each procedural step the engine
 * ran, with a one-line description of what that step decided. Both halves of that
 * sentence are authored here; only ONE of them is computed in the worker.
 *
 * ⛔ THE SPLIT IS A BYTE LAW, NOT A TIDY-UP. The worker imports `metaForStep` at
 * `src/workers/generationRequest.js:37` and reads exactly one field off it:
 *
 *     const meta = metaForStep(name);
 *     summary = meta.summary ? meta.summary(ctx) : null;
 *     emit?.({ … step: { id: name, index, summary } });
 *
 * The packet on the wire is `{ id, index, summary }` — no label, no description. The
 * rail maps the ID to its words on the MAIN THREAD, which is what its own header has
 * always said. While the words sat inside `STEP_METADATA` they rode into the
 * generation worker's bundle anyway (22 labels + 22 descriptions, 2.9 kB minified) to
 * be read by nobody, because the worker's `metaForStep` referenced the whole entry.
 * Held apart, the presentation table has no reference the worker can reach and
 * tree-shaking takes it out of that bundle while the UI chunk keeps it.
 *
 * ⚠ SO ADDING A STEP MEANS TWO ROWS, and both are pinned by
 * tests/generators/stepMetadataSync.test.js against the live registry — a summary row
 * here and a words row below. A missing words row falls back to the raw machine name
 * in the rail (`presentationForStep`), which is the behaviour this file always had.
 *
 * Naming:
 *   - `summary(ctx)` — STEP_METADATA, worker side. Optional. Receives the post-step
 *                      context and returns a short factual string (e.g. "5
 *                      institutions assembled"), so the user sees what *actually*
 *                      happened on this run rather than what could happen.
 *   - `label`        — STEP_PRESENTATION, main thread. Short noun phrase.
 *   - `description`  — STEP_PRESENTATION, main thread. One sentence, on hover/expand.
 */

export const STEP_METADATA = Object.freeze({
  resolveConfig: {
    // resolveConfig provides ctx.tier (the resolved tier); ctx.config is the raw
    // input whose .tier is the unresolved sentinel in random/custom mode.
    summary: (ctx) => ctx.tier ? `Target size: ${ctx.tier}` : null,
  },
  buildGenerationContext: {
    summary: (ctx) => ctx.generationContext?.worldLaw?.magicFunctions()
      ? 'Magic functions in this world'
      : 'Magic does not function in this world',
  },
  resolveResources: {
    summary: (ctx) => {
      const rs = ctx.nearbyResources?.length || 0;
      return rs ? `${rs} local resource${rs === 1 ? '' : 's'} chosen` : null;
    },
  },
  resolveStress: {
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
    // resolveNeighbour provides ctx.neighbourProfile / ctx.rawNeighbour, not importedNeighbour.
    summary: (ctx) => {
      const name = ctx.neighbourProfile?.name || ctx.rawNeighbour?.name;
      return name ? `Linked to ${name}` : 'No neighbour';
    },
  },
  assembleInstitutions: {
    // "on the first pass" is load-bearing (§767.3(d)): this receipt is minted
    // BEFORE the cascade/repair/reconcile passes grow the roster, so a bare
    // "N placed" read as a terminal count and disagreed with the dossier's
    // total on the same page. The terminal count is stated where it is true —
    // the reconcile step below.
    summary: (ctx) => {
      const n = ctx.institutions?.length || 0;
      return n ? `${n} institution${n === 1 ? '' : 's'} placed on the first pass` : null;
    },
  },
  subsumptionPass: {
    summary: (ctx) => {
      const removed = ctx._subsumed?.length || 0;
      return removed ? `${removed} duplicate${removed === 1 ? '' : 's'} subsumed` : 'Nothing collapsed';
    },
  },
  cascadePass: {
    summary: () => null,
  },
  isolationPass: {
    summary: () => null,
  },
  stressConfirmPass: {
    summary: (ctx) => {
      const n = Array.isArray(ctx.stressTypes) ? ctx.stressTypes.length : 0;
      return n ? `${n} stressor${n === 1 ? '' : 's'} confirmed` : 'No stressors survived confirmation';
    },
  },
  generateEconomy: {
    // generateEconomy provides ctx.economicState; the prosperity label is .prosperity.
    summary: (ctx) => {
      const band = ctx.economicState?.prosperity;
      return band ? `Prosperity: ${band}` : null;
    },
  },
  generatePower: {
    // generatePower provides ctx.powerStructure.
    summary: (ctx) => {
      const n = ctx.powerStructure?.factions?.length || 0;
      return n ? `${n} faction${n === 1 ? '' : 's'} formed` : null;
    },
  },
  neighbourFactions: {
    summary: () => null,
  },
  factionCorrelationPass: {
    // This pass derives faction-boost institutions; tensions/history don't exist
    // yet (they come from generateNarratives). Report whether it changed the roster.
    summary: (ctx) => ctx._rosterChangedAfterEconomy
      ? 'Faction pressure reshaped the roster'
      : null,
  },
  coherenceRepairPass: {
    summary: (ctx) => {
      const count = ctx.generationRepairs?.length || 0;
      return count
        ? `${count} deterministic repair${count === 1 ? '' : 's'} applied`
        : 'No structural repairs needed';
    },
  },
  economyReconcilePass: {
    // This step sees the TERMINAL roster, so it is the one receipt allowed to
    // state the count the dossier will show (§767.3(d) — every surface agrees).
    summary: (ctx) => {
      const n = ctx.institutions?.length || 0;
      const count = n ? `: ${n} institution${n === 1 ? '' : 's'} stand` : '';
      return ctx._rosterChangedAfterEconomy
        ? `Economy re-derived for the final roster${count}`
        : `Roster confirmed${count || ': economy stands'}`;
    },
  },
  powerEconomyReconcilePass: {
    summary: (ctx) => ctx.powerStructure?.economyInputFingerprint
      ? 'Power reconciled and freshness-stamped'
      : null,
  },
  structuralValidationPass: {
    summary: (ctx) => {
      const v = ctx.structural?.violations?.length || 0;
      return v ? `${v} structural finding${v === 1 ? '' : 's'}` : 'No structural findings';
    },
  },
  generatePopulation: {
    summary: (ctx) => {
      const n = ctx.npcs?.length || 0;
      return n ? `${n} NPC${n === 1 ? '' : 's'} named` : null;
    },
  },
  corruptionPass: {
    summary: (ctx) => {
      const n = (ctx.npcs || []).filter(npc => npc?.corrupt === true).length;
      return n ? `${n} corrupted figure${n === 1 ? '' : 's'}` : 'No corruption climate';
    },
  },
  generateNarratives: {
    summary: () => null,
  },
  assembleSettlement: {
    summary: () => null,
  },
});


/**
 * THE RAIL'S WORDS, keyed by the same step ids as STEP_METADATA above.
 *
 * ⛔ NOTHING IN `src/workers/`, `src/generators/` OR `src/lib/` MAY READ THIS. It is
 * the one reason the strings leave the generation worker's bundle; a single engine-side
 * reader would put all 2.9 kB back, silently, and only the bundle-ceiling test in
 * tests/build/generationWorkerLazy.test.js would notice. The sole consumer is
 * src/components/PipelineRail.jsx, on the main thread.
 *
 * @type {Readonly<Record<string, { label: string, description: string }>>}
 */
export const STEP_PRESENTATION = Object.freeze({
  resolveConfig: { label: 'Resolve configuration', description: 'Apply user choices (size, terrain, culture, trade access) and fill in defaults.' },
  buildGenerationContext: { label: 'Establish world law', description: 'Freeze the resolved world rules every institution, service, person, and history producer must obey.' },
  resolveResources: { label: 'Pick local resources', description: 'Decide which natural resources the land yields, based on terrain and trade.' },
  resolveStress: { label: 'Determine stressors', description: 'Roll the active stressors (plague, drought, raid pressure, etc.) that shape this run.' },
  resolveNeighbour: { label: 'Link neighbour', description: 'If a neighbouring settlement was provided, weave its facts into this one.' },
  assembleInstitutions: { label: 'Assemble institutions', description: 'Choose which institutions exist (inn, mill, temple, market, etc.) for this size + culture.' },
  subsumptionPass: { label: 'Subsume duplicates', description: 'Collapse institutions that overlap (a market subsumes a stall, a guild subsumes its workshops).' },
  cascadePass: { label: 'Cascade institutional effects', description: 'Propagate one institution’s outputs (a mill makes flour; a baker can now exist).' },
  isolationPass: { label: 'Resolve isolation', description: 'Detach institutions that lost their dependencies (a smith with no fuel becomes a husk).' },
  stressConfirmPass: { label: 'Confirm stressors', description: 'Re-weight emergent stressors against the real roster. Walls suppress sieges, granaries suppress famine.' },
  generateEconomy: { label: 'Build economy + supply chains', description: 'Compute prices, supply chains, prosperity band, and visible economic frictions.' },
  generatePower: { label: 'Form factions', description: 'Define the political factions, their stake, and what they’d each like to happen next.' },
  neighbourFactions: { label: 'Link neighbour factions', description: 'Stitch in the neighbouring settlement’s factions where they have local interests.' },
  factionCorrelationPass: { label: 'Correlate tensions', description: 'Compute who is allied, who is at odds, and which tensions are about to boil.' },
  coherenceRepairPass: { label: 'Repair generated structure', description: 'Correct generator-owned access, dependency, and survival contradictions before downstream systems read the roster.' },
  economyReconcilePass: { label: 'Reconcile economy with final roster', description: 'Re-derive chains, services, and spatial placement so faction-pulled institutions join the economy.' },
  powerEconomyReconcilePass: { label: 'Finalize power against the economy', description: 'Replay the original political intent against the final economic facts without reopening institution pulls.' },
  structuralValidationPass: { label: 'Validate structure', description: 'Check the FINAL roster for tier, dependency, and access contradictions: the coherence receipt.' },
  generatePopulation: { label: 'Generate NPCs', description: 'Cast the named NPCs: rulers, faction heads, plot-hook owners, and the merchant your players will ask about.' },
  corruptionPass: { label: 'Seed corruption', description: 'Where a criminal institution exists, roll which flawed NPCs were already corrupted at generation.' },
  generateNarratives: { label: 'Compose narratives', description: 'Write the prose layer: history, defense, daily-life, and per-faction asides.' },
  assembleSettlement: { label: 'Assemble dossier', description: 'Bundle every layer into the final settlement object the dossier renders from.' },
});

/**
 * Resolve a step's WORKER-side metadata. Always returns an object, so the emitter
 * never crashes on a name that has no row.
 *
 * ⛔ `Object.hasOwn`, NEVER A BARE LOOKUP. `name` reaches here from a step id, and on
 * the rail's side that id comes off a PERSISTED receipt: a save carrying
 * `id: 'constructor'` (or `toString`, `valueOf`, `hasOwnProperty`) reads
 * Object.prototype's member through a bare index, and every one of them is TRUTHY, so
 * the fallback below would be skipped and a FUNCTION returned in place of a row.
 *
 * @param {string} name
 * @returns {{ summary: (ctx: any) => (string|null) }}
 */
export function metaForStep(name) {
  return Object.hasOwn(STEP_METADATA, name) ? STEP_METADATA[name] : { summary: () => null };
}

/**
 * Resolve a step's RAIL words. Always returns an object (so the rail never crashes on
 * an unknown name); the `label` falls back to the raw machine name when there is no
 * row, so the surface still reads. Main thread only — see STEP_PRESENTATION above.
 *
 * @param {string} name
 * @returns {{ label: string, description: string }}
 */
export function presentationForStep(name) {
  return Object.hasOwn(STEP_PRESENTATION, name)
    ? STEP_PRESENTATION[name]
    : { label: name, description: '' };
}
