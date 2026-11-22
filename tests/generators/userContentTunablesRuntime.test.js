import { describe, expect, it } from 'vitest';
import {
  generateSettlementPipeline,
} from '../../src/generators/generateSettlementPipeline.js';

const BASE_CONFIG = Object.freeze({
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
  monsterThreat: 'civilized',
  priorityEconomy: 50,
  priorityMilitary: 50,
  priorityMagic: 50,
  priorityReligion: 50,
  priorityCriminal: 50,
  magicExists: true,
});

function generate(seed, options = {}) {
  return generateSettlementPipeline(
    { ...BASE_CONFIG },
    null,
    { seed, customContent: {}, ...options },
  );
}

describe('content-environment tunables at the canonical generator boundary', () => {
  it('changes a deterministic run through registered public inputs', () => {
    const baseline = generate('content-tunable-effect');
    const tuned = generate('content-tunable-effect', {
      contentTunables: {
        priorityEconomy: 90,
        magicExists: false,
      },
      // DEFAULT_CONFIG values are materialized UI defaults, not choices.
      explicitConfigFields: {},
    });

    expect(tuned._config).toMatchObject({
      priorityEconomy: 90,
      magicExists: false,
    });
    expect(tuned.config).toMatchObject({
      priorityEconomy: 90,
      priorityMagic: 0,
      magicExists: false,
    });
    expect(JSON.stringify(tuned)).not.toBe(JSON.stringify(baseline));
  });

  it('keeps an explicit per-generation choice above its environment default', () => {
    const settlement = generate('content-tunable-explicit-wins', {
      contentTunables: {
        priorityEconomy: 90,
        priorityMagic: 80,
      },
      explicitConfigFields: {
        priorityEconomy: true,
      },
    });

    expect(settlement._config.priorityEconomy).toBe(50);
    expect(settlement._config.priorityMagic).toBe(80);
  });

  it('rejects an invalid bag as a whole before generation', () => {
    expect(() => generate('content-tunable-invalid', {
      contentTunables: {
        priorityEconomy: 90,
        internalAutoTuningGain: 0.9,
      },
      explicitConfigFields: {},
    })).toThrow(/internalAutoTuningGain:unregistered_tunable/);
  });

  it('keeps the empty vanilla environment byte-identical', () => {
    const original = generate('content-tunable-vanilla-parity');
    const vanillaEnvironment = generate('content-tunable-vanilla-parity', {
      contentTunables: {},
      explicitConfigFields: {},
    });

    expect(JSON.stringify(vanillaEnvironment)).toBe(JSON.stringify(original));
  });

  it('preserves conservative direct-caller semantics when intent is omitted', () => {
    const settlement = generate('content-tunable-direct-caller', {
      contentTunables: { priorityEconomy: 90 },
    });
    expect(settlement._config.priorityEconomy).toBe(50);
  });
});
