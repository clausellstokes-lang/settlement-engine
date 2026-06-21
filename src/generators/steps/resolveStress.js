/**
 * Step 3: resolveStress
 *
 * Generates stress events and threads stress types into effectiveConfig.
 *
 * Stress-resolution step for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { generateStress } from '../stressGenerator.js';
import { recordTrace } from '../../domain/trace.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';

registerStep('resolveStress', {
  deps: ['resolveConfig', 'resolveResources'],
  reads: ['effectiveConfig'], // ctx keys this step consumes that another step produces
  provides: ['stress', 'stressTypes'],
  mutates: ['effectiveConfig'], // stamps derived stress keys onto effectiveConfig
  phase: 'config',
}, (ctx) => {
  const { tier, effectiveConfig, population } = ctx;
  const config = ctx.config || {};

  let stress = generateStress({ name: '', tier, institutions: [] }, effectiveConfig);
  let stressTypes = stress
    ? (Array.isArray(stress) ? stress.map(s => s.type) : [stress.type]).filter(Boolean)
    : [];

  // Thread into effectiveConfig for downstream
  effectiveConfig.stressType = stressTypes[0] || effectiveConfig.stressType || null;
  effectiveConfig.stressTypes = stressTypes.length ? stressTypes
    : effectiveConfig.stressType ? [effectiveConfig.stressType]
    : effectiveConfig.stressTypes || [];
  effectiveConfig.intendedStressTypes = [
    ...(config.stressTypes || []),
    ...(config.stressType ? [config.stressType] : []),
  ].filter(Boolean);
  effectiveConfig._population = population;

  // Emit one trace per active stressor so downstream consumers
  // (PipelineRail, AI grounding, the "what's pressuring this town?"
  // viewer) can answer why famine/plague/siege is in play. The intended
  // vs effective distinction matters: a stressor the user requested but
  // the simulator declined to apply (e.g. an incompatibility) becomes
  // an explicit "declined" trace so the discrepancy is visible.
  const intendedSet = new Set(effectiveConfig.intendedStressTypes || []);
  for (const stressType of stressTypes) {
    const wasIntended = intendedSet.has(stressType);
    recordTrace(ctx, {
      targetType: 'stressor',
      targetId:   `stressor.${stressType}`,
      step:       'resolveStress',
      result:     wasIntended ? 'applied' : 'emergent',
      causes: [
        wasIntended
          ? { source: 'userConfig', effect: 'applied',
              reason: `Stressor "${stressType}" was selected by user config.` }
          : { source: 'stressGenerator', effect: 'derived',
              reason: `Engine derived "${stressType}" from tier=${tier}/threat/economy heuristics.` },
      ],
      downstreamEffects: [
        { target: 'foodSecurity',     effect: 'context' },
        { target: 'publicOrder',      effect: 'context' },
        { target: 'factionDynamics',  effect: 'context',
          reason: 'Stressors feed into faction wants/fears and threat modeling.' },
      ],
    });
  }
  // Surface declined-intent stressors too — these are the cases where
  // the user asked for X but the engine returned Y (or nothing). Without
  // a trace here, the discrepancy is invisible.
  for (const intended of intendedSet) {
    if (!stressTypes.includes(intended)) {
      recordTrace(ctx, {
        targetType: 'stressor',
        targetId:   `stressor.${intended}`,
        step:       'resolveStress',
        result:     'declined',
        causes: [
          { source: 'stressGenerator', effect: 'rejected',
            reason: `User-requested "${intended}" was incompatible with this tier or other stressors.` },
        ],
      });
    }
  }

  // ── Editor event overlay (config.stressorEdits) ──────────────────────────
  // Re-apply the authored stressor deltas on top of whatever the mode above
  // rolled — the same post-roll overlay discipline as resolveResources'
  // resourceEdits. APPLY_STRESSOR entries re-join the container (upsert by
  // type: authored beats generation, the rule the condition layer already
  // applies), and RESOLVE_STRESSOR's `resolved` suppression list keeps a
  // resolved CONFIG-FORCED crisis from re-rolling straight back and
  // re-minting a fresh GENERATION condition once the eased
  // config.eventConditions record expires. Runs after the rolls and the
  // declined-intent traces (those describe the roll honestly), consuming NO
  // rng — a config without edits generates byte-identically.
  const stressorEdits = config.stressorEdits || {};
  const editsAdded = Array.isArray(stressorEdits.added) ? stressorEdits.added : [];
  const editsResolved = Array.isArray(stressorEdits.resolved) ? stressorEdits.resolved : [];
  if (editsAdded.length || editsResolved.length) {
    const lower = (v) => String(v || '').toLowerCase();
    const resolvedSet = new Set(editsResolved.map(lower).filter(Boolean));
    // The matchesEntry tolerance (mutate.js): type match, display-name
    // fallback for untyped legacy entries.
    const isResolved = (st) =>
      resolvedSet.has(lower(st?.type)) || (!st?.type && resolvedSet.has(lower(st?.name)));
    let entries = Array.isArray(stress) ? [...stress] : stress ? [stress] : [];
    for (const st of entries) {
      if (!isResolved(st)) continue;
      recordTrace(ctx, {
        targetType: 'stressor',
        targetId:   `stressor.${st.type || lower(st.name)}`,
        step:       'resolveStress',
        result:     'resolved_by_event',
        causes: [{ source: 'event', effect: 'suppressed',
                   reason: `A RESOLVE_STRESSOR event ended "${st.label || st.name || st.type}" — the re-rolled stressor stays resolved.` }],
      });
    }
    entries = entries.filter(st => !isResolved(st));
    for (const authored of editsAdded) {
      const type = authored?.type;
      if (!type || resolvedSet.has(lower(type))) continue;
      const idx = entries.findIndex(st => lower(st?.type) === lower(type)
        || (!st?.type && lower(st?.name) === lower(authored.name || authored.label)));
      // Upsert: a type the mode also rolled refreshes to the authored
      // severity/label/source (the live applyStressor upsert), keeping the
      // rolled entry's icon/colour/summary.
      entries = idx === -1
        ? [...entries, authored]
        : entries.map((st, i) => (i === idx ? { ...st, ...authored } : st));
      recordTrace(ctx, {
        targetType: 'stressor',
        targetId:   `stressor.${type}`,
        step:       'resolveStress',
        result:     'applied',
        causes: [{ source: 'event', effect: 'authored by editor event',
                   reason: `"${authored.label || authored.name || type}" was authored with an APPLY_STRESSOR event and re-applied from config.stressorEdits.` }],
      });
    }
    // Preserve generateStress's output shape convention (null / bare object /
    // array — assembleSettlement dual-writes the result verbatim).
    stress = entries.length === 0 ? null : entries.length === 1 ? entries[0] : entries;
    // Re-thread the edited set. Only CATALOG types enter the stressType /
    // stressTypes channel — every consumer compares against STRESS_TYPE_MAP
    // keys (and stressConfirmPass's re-weighting indexes the map directly,
    // which would throw on a custom type), so a custom authored stressor
    // ('dragon_tax') rides the container only, exactly as it does on the
    // live settlement.
    stressTypes = entries.map(e => e?.type).filter(t => t && STRESS_TYPE_MAP[t]);
    effectiveConfig.stressType = stressTypes[0] || null;
    effectiveConfig.stressTypes = stressTypes;
  }

  return { stress, stressTypes };
});
