import { describe, expect, test } from 'vitest';

import { deriveCausalState, deriveSystemVariable } from '../../src/domain/causalState.js';
import { supportedConditionArchetypes } from '../../src/domain/activeConditions.js';
import { mintDirectedChannel, REGIONAL_CHANNEL_TYPES } from '../../src/domain/region/graph.js';
import { WAR_HOME_CONDITIONS } from '../../src/domain/worldPulse/archetypeCatalog.js';

// F5 pin: the war-layer archetypes are real catalog entries that move the causal
// state (war_drain is the missing SOURCE of the economic-homeostasis loop), and the
// ONE directed-mint helper produces valid, deterministic channels. Both are inert
// infrastructure until A1/R2 call them — so this phase adds capability, not behavior.

const NOW = '2026-01-01T00:00:00.000Z';

describe('F5 — war-layer condition archetypes', () => {
  test('war_drain / army_deployed / occupation_lifted / relief_burden are in the catalog', () => {
    const catalog = new Set(supportedConditionArchetypes());
    for (const a of ['war_drain', 'army_deployed', 'occupation_lifted', 'relief_burden']) {
      expect(catalog.has(a), `${a} missing`).toBe(true);
    }
    // Z2a extended the aggressor-home group with the non-reverting war_exhaustion scar.
    expect(WAR_HOME_CONDITIONS).toEqual(['war_drain', 'army_deployed', 'war_exhaustion']);
    expect(catalog.has('war_exhaustion')).toBe(true);
  });

  test('war_drain DRAINS economic_capacity (the homeostasis SOURCE deriveEconomicCapacity was missing)', () => {
    const base = { economicState: { prosperity: 'moderate' }, activeConditions: [] };
    const drained = { economicState: { prosperity: 'moderate' }, activeConditions: [{ archetype: 'war_drain', severity: 0.5 }] };

    const baseScore = deriveCausalState(base).scores.economic_capacity;
    const drainedScore = deriveCausalState(drained).scores.economic_capacity;

    expect(drainedScore).toBeLessThan(baseScore);
    // severity 0.5 × 18 ≈ a 9-point drain (the magnitude the SINK consumes).
    expect(baseScore - drainedScore).toBeGreaterThanOrEqual(8);

    // A hotter drain bites harder (monotone in severity) — proves it's live, not a flag.
    const hot = { economicState: { prosperity: 'moderate' }, activeConditions: [{ archetype: 'war_drain', severity: 0.9 }] };
    expect(deriveCausalState(hot).scores.economic_capacity).toBeLessThan(drainedScore);
  });

  test('war_drain lists ONLY economic_capacity (no double-count with trade/economy pressure)', () => {
    const v = deriveSystemVariable('economic_capacity', {
      economicState: { prosperity: 'moderate' }, activeConditions: [{ archetype: 'war_drain', severity: 0.6 }],
    });
    // The contributor trail names the war_drain condition as a drain on the economy.
    const fromDrain = (v.contributors || []).some(c => /drain/i.test(`${c.label || ''} ${c.detail || ''} ${c.reason || ''} ${c.kind || ''}`) || (c.delta || 0) < 0);
    expect(fromDrain).toBe(true);
  });
});

describe('F5 — mintDirectedChannel (the ONE directed-mint home)', () => {
  test('mints a valid, deterministic war_front channel; id is independent of the timestamp', () => {
    const a = mintDirectedChannel({ type: 'war_front', from: 'ashford', to: 'briar', explanation: 'siege', now: NOW });
    expect(a).toMatchObject({ type: 'war_front', from: 'ashford', to: 'briar', direction: 'directed', status: 'confirmed' });
    expect(typeof a.id).toBe('string');

    const b = mintDirectedChannel({ type: 'war_front', from: 'ashford', to: 'briar', now: '2099-12-31T00:00:00.000Z' });
    expect(b.id).toBe(a.id); // id derives from type+from+to, not the clock
  });

  test('mints a religious_authority channel and honors an explicit visibility', () => {
    const ch = mintDirectedChannel({ type: 'religious_authority', from: 'temple', to: 'crownhold', visibility: 'gm', now: NOW });
    expect(ch.type).toBe('religious_authority');
    expect(REGIONAL_CHANNEL_TYPES.includes(ch.type)).toBe(true);
    expect(ch.visibility).toBe('gm');
  });

  test('returns null for an invalid channel type or a missing endpoint (never a malformed channel)', () => {
    expect(mintDirectedChannel({ type: 'not_a_real_channel', from: 'a', to: 'b', now: NOW })).toBeNull();
    expect(mintDirectedChannel({ type: 'war_front', from: 'a', now: NOW })).toBeNull();
    expect(mintDirectedChannel({ type: 'war_front', to: 'b', now: NOW })).toBeNull();
  });
});
