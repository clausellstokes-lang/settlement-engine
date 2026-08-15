import { describe, expect, it } from 'vitest';
import {
  applyUserContentTunables,
  inferLegacyUserContentTunableIntent,
  userContentTunableIntentForPatch,
  validateUserContentTunables,
} from '../../src/domain/content/userContentTunables.js';

describe('bounded user content tunables', () => {
  it('admits only registered existing generation inputs', () => {
    expect(validateUserContentTunables({
      priorityEconomy: 70,
      magicExists: false,
    })).toEqual({
      ok: true,
      tunables: { priorityEconomy: 70, magicExists: false },
      rejected: [],
    });

    const hostile = validateUserContentTunables({
      priorityEconomy: 1_000,
      arbitraryPulseFormula: 'population * 99',
    });
    expect(hostile.ok).toBe(false);
    expect(hostile.tunables).toEqual({});
    expect(hostile.rejected.map((entry) => entry.reason)).toEqual([
      'out_of_bounds',
      'unregistered_tunable',
    ]);
  });

  it('treats a pack value as a default beneath an explicit user choice', () => {
    const result = applyUserContentTunables(
      { priorityEconomy: 20, settType: 'town' },
      { priorityEconomy: 80, priorityMagic: 65 },
    );
    expect(result.ok).toBe(true);
    expect(result.config).toEqual({
      priorityEconomy: 20,
      priorityMagic: 65,
      settType: 'town',
    });
    expect(result.applied).toEqual(['priorityMagic']);
  });

  it('distinguishes materialized defaults from field-level player intent', () => {
    const defaultConfig = {
      priorityEconomy: 50,
      priorityMagic: 50,
      settType: 'town',
    };
    const untouched = applyUserContentTunables(
      defaultConfig,
      { priorityEconomy: 80, priorityMagic: 65 },
      {},
    );
    expect(untouched.config).toMatchObject({
      priorityEconomy: 80,
      priorityMagic: 65,
    });

    const intent = userContentTunableIntentForPatch(
      { priorityEconomy: 50 },
      {},
    );
    const chosen = applyUserContentTunables(
      defaultConfig,
      { priorityEconomy: 80, priorityMagic: 65 },
      intent,
    );
    expect(chosen.config).toMatchObject({
      priorityEconomy: 50,
      priorityMagic: 65,
    });
    expect(chosen.applied).toEqual(['priorityMagic']);
  });

  it('rejects a malformed bag as a whole instead of applying its valid subset', () => {
    const mixed = applyUserContentTunables(
      { settType: 'town' },
      { priorityEconomy: 80, internalPulseFormula: 'population * 99' },
      {},
    );
    expect(mixed.ok).toBe(false);
    expect(mixed.config).toEqual({ settType: 'town' });
    expect(mixed.applied).toEqual([]);
    expect(mixed.rejected).toEqual([
      { key: 'internalPulseFormula', reason: 'unregistered_tunable' },
    ]);

    expect(validateUserContentTunables([])).toEqual({
      ok: false,
      tunables: {},
      rejected: [{ key: '$tunables', reason: 'invalid_container' }],
    });
  });

  it('infers only unambiguous legacy intent', () => {
    expect(inferLegacyUserContentTunableIntent({
      priorityEconomy: 70,
      priorityMagic: 50,
      magicExists: false,
    })).toEqual({
      priorityEconomy: true,
      magicExists: true,
    });
  });
});
