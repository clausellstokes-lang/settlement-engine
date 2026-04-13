/**
 * Step 3: resolveStress
 *
 * Generates stress events and threads stress types into effectiveConfig.
 *
 * Extracted from generateSettlement.js lines 412–429.
 */

import { registerStep } from '../pipeline.js';
import { generateStress } from '../stressGenerator.js';

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

  return { stress, stressTypes };
});
