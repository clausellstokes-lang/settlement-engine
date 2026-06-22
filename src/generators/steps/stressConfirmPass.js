/**
 * Step 8b: stressConfirmPass
 *
 * Re-weights emergent stressors against the REAL institution roster.
 *
 * resolveStress (step 3) must roll stress before institutions exist (stress
 * types thread into institution generation), so it calls buildStressContext
 * with institutions: [] — every institution-presence modifier in the stress
 * tables was dead at generation: walls never suppressed sieges (×0.6),
 * granaries never suppressed famine (×0.5), healers never suppressed plague
 * (×0.6). This pass runs after the institution roster stabilizes
 * (assemble → subsumption → cascade → isolation) and BEFORE generateEconomy
 * reads config.stressTypes, so every downstream consumer (economy, power,
 * NPCs, narratives, defense) sees the confirmed set.
 *
 * Re-weight: for each EMERGENT stressor (not user-forced), keepProbability =
 * clamp(modified / unmodified, 0.4, 1) where modified re-runs the stress
 * table with the real roster and unmodified replays the empty-roster context
 * resolveStress used. The clamp floor (0.4) damps the correction — even a
 * fully walled + garrisoned town keeps some siege risk; institutions reduce
 * odds, they don't grant immunity. Stressors the roster would make MORE
 * likely (e.g. banks → indebted ×1.4) are never amplified here — this pass
 * only confirms or drops, it NEVER rolls new stressors.
 *
 * User-forced stress (Mode-0 stressTypes / stressType, and the Mode-2
 * selectedStresses pool) is NEVER dropped.
 *
 * Note: factionCorrelationPass can still add 0–2 institutions later (it
 * needs the faction layer, which needs the economy); those late arrivals
 * could only have suppressed stress further. Accepted as part of the damped
 * model rather than re-weighting after the economy already consumed stress.
 */

import { registerStep } from '../pipeline.js';
import { buildStressContext } from '../stressGenerator.js';
import { recordTrace } from '../../domain/trace.js';
import { STRESS_TYPE_MAP } from '../../data/stressTypes.js';

// Per-type suppressor keywords mirroring buildStressContext's institution
// flags — used ONLY to name the suppressing institutions in the trace.
const SUPPRESSOR_KEYWORDS = {
  under_siege:      ['wall', 'citadel', 'palisade', 'garrison', 'militia', 'watch'],
  monster_pressure: ['wall', 'citadel', 'palisade', 'garrison', 'militia', 'watch'],
  occupied:         ['wall', 'citadel', 'palisade', 'garrison', 'militia', 'watch'],
  famine:           ['granar', 'market', 'fair'],
  plague_onset:     ['church', 'temple', 'cathedral', 'monastery', 'healer', 'physician', 'hospital'],
};

function suppressorNames(stressType, institutions) {
  const kws = SUPPRESSOR_KEYWORDS[stressType] || [];
  return institutions
    .filter(i => {
      const n = (i.name || '').toLowerCase();
      return kws.some(kw => n.includes(kw));
    })
    .map(i => i.name)
    .slice(0, 3);
}

registerStep('stressConfirmPass', {
  deps: ['resolveStress', 'isolationPass'],
  reads: ['effectiveConfig', 'institutions', 'stress', 'tier'], // ctx keys this step consumes that another step produces
  provides: ['stress', 'stressTypes'],
  mutates: ['effectiveConfig'], // re-stamps confirmed stress keys on effectiveConfig in place
  phase: 'config',
}, (ctx, rng) => {
  const { tier, effectiveConfig, institutions } = ctx;
  const config = ctx.config || {};

  const entries = Array.isArray(ctx.stress) ? ctx.stress : ctx.stress ? [ctx.stress] : [];
  if (entries.length === 0) return {};

  // User-forced stress is contract with the DM — never dropped. Covers
  // Mode 0/1 (config.stressTypes / config.stressType, captured by
  // resolveStress as intendedStressTypes) and Mode 2 (the explicit
  // selectedStresses pool when selectedStressesRandom === false).
  const forced = new Set([
    ...(effectiveConfig.intendedStressTypes || []),
    ...(config.selectedStressesRandom === false ? (config.selectedStresses || []) : []),
    // Authored APPLY_STRESSOR entries re-applied by resolveStress's
    // stressorEdits overlay — the same contract as user-forced stress:
    // never dropped. (Also load-bearing for CUSTOM authored types, which
    // have no STRESS_TYPE_MAP row for the re-weighting below to index.)
    ...((config.stressorEdits?.added || []).map(e => e?.type).filter(Boolean)),
  ]);

  const kept = [];
  let dropped = 0;
  for (const entry of entries) {
    const type = entry?.type;
    if (!type || forced.has(type)) { kept.push(entry); continue; }

    // Replay the roll context resolveStress used (empty roster) vs the real
    // one. The ratio isolates exactly the institution modifiers that were
    // dead at roll time — threat/route/priority/resource modifiers cancel.
    const unmodified = buildStressContext(type, tier, effectiveConfig, []);
    const modified   = buildStressContext(type, tier, effectiveConfig, institutions);
    if (!(unmodified > 0)) { kept.push(entry); continue; }

    const ratio = modified / unmodified;
    const keepProbability = Math.max(0.4, Math.min(1, ratio));
    // No rng draw when institutions don't suppress this type — keeps the
    // pass a true no-op (zero rolls) for unaffected stressors.
    if (keepProbability >= 1 || rng.chance(keepProbability)) {
      kept.push(entry);
      continue;
    }

    dropped += 1;
    const suppressors = suppressorNames(type, institutions);
    recordTrace(ctx, {
      targetType: 'stressor',
      targetId:   `stressor.${type}`,
      step:       'stressConfirmPass',
      result:     'suppressed_by_institutions',
      causes: [
        {
          source: suppressors.length ? instSource(suppressors[0]) : 'institutionRoster',
          effect: `kept with p=${keepProbability.toFixed(2)}, roll failed`,
          reason: suppressors.length
            ? `${suppressors.join(', ')} reduce${suppressors.length === 1 ? 's' : ''} the odds of "${type}" (×${ratio.toFixed(2)} vs the roster-blind roll). The re-weighted roll dropped it.`
            : `The settlement's institutions reduce the odds of "${type}" (×${ratio.toFixed(2)} vs the roster-blind roll). The re-weighted roll dropped it.`,
        },
      ],
      downstreamEffects: [
        { target: 'stressTypes', effect: 'removed' },
      ],
    });
  }

  if (dropped === 0) return {};

  // Keep the same effectiveConfig threading contract resolveStress set up,
  // so every downstream config.stressTypes reader sees the confirmed set.
  // Catalog types only — a custom authored entry (config.stressorEdits)
  // rides the container, never the stressType/stressTypes channel
  // (resolveStress's overlay applies the same filter).
  const stressTypes = kept.map(e => e?.type).filter(t => t && STRESS_TYPE_MAP[t]);
  effectiveConfig.stressType  = stressTypes[0] || null;
  effectiveConfig.stressTypes = stressTypes;

  // Preserve generateStress's output shape convention: null / object / array.
  const stress = kept.length === 0 ? null : kept.length === 1 ? kept[0] : kept;
  return { stress, stressTypes };
});

function instSource(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}
