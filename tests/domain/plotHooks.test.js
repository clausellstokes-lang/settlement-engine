/**
 * plotHooks.test.js — dossier plot-hook collection pins.
 *
 * Tension-sourced hooks used to stamp `role: tension.description.slice(0, 80)`
 * with no ellipsis, shipping mid-word fragments ('…resist investi') into the
 * dossier. The role now carries the full description.
 */
import { describe, expect, test } from 'vitest';

import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';

describe('collectPlotHooks tension roles', () => {
  const description =
    'Merchant guilds resist investigation into the missing harbor ledgers while dock crews trade accusations.';

  function tensionHooks() {
    return collectPlotHooks({
      history: {
        currentTensions: [{
          type: 'guild_conflict',
          description,
          plotHooks: ['Someone is paying to keep the ledgers lost'],
        }],
      },
    }).filter(h => h.category === 'tension');
  }

  test('role carries the full tension description, not an 80-char fragment', () => {
    expect(description.length).toBeGreaterThan(80);
    const [hook] = tensionHooks();
    expect(hook).toBeTruthy();
    expect(hook.role).toBe(description);
  });

  test('role is never a mid-word fragment of the description', () => {
    const [hook] = tensionHooks();
    // A proper role is either the whole description or ends at a word
    // boundary — it must not stop partway through a word.
    expect(description.startsWith(hook.role)).toBe(true);
    const next = description[hook.role.length];
    expect(next === undefined || /\s/.test(next)).toBe(true);
  });
});
