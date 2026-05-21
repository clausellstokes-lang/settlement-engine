/**
 * Step 3: resolveStress
 *
 * Generates stress events and threads stress types into effectiveConfig.
 *
 * Extracted from generateSettlement.js lines 412–429.
 */

import { registerStep } from '../pipeline.js';
import { generateStress } from '../stressGenerator.js';
import { recordTrace } from '../../domain/trace.js';

registerStep('resolveStress', {
  deps: ['resolveConfig', 'resolveResources'],
  provides: ['stress', 'stressTypes'],
  phase: 'config',
}, (ctx) => {
  const { tier, effectiveConfig, population } = ctx;
  const config = ctx.config || {};

  const stress = generateStress({ name: '', tier, institutions: [] }, effectiveConfig);
  const stressTypes = stress
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

  // Tier 2.1 — emit one trace per active stressor so downstream consumers
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

  return { stress, stressTypes };
});
