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

describe('collectPlotHooks — THE TRADITIONS register (T-5)', () => {
  const rec = (over) => ({
    id: 't.x', name: 'The Harvest Feast', coreMotif: { element: 'harvest', act: 'feast' },
    window: { startWeekOfYear: 30, weeks: 1 }, scaleBand: 3,
    lastOutcome: null, suppressedBy: null, adoptedFrom: null, mutationLog: [], ...over,
  });

  test('a failed festival raises a tradition-category hook naming the town', () => {
    const hooks = collectPlotHooks({ name: 'Ashford', traditions: [rec({ lastOutcome: 'failure' })] });
    const t = hooks.filter(h => h.category === 'tradition');
    expect(t.length).toBe(1);
    expect(t[0].source).toBe('Traditions');
    expect(t[0].role).toBe('The Harvest Feast');
    expect(t[0].text).toContain('The Harvest Feast');
    expect(t[0].priority).toBe(8);
  });

  test('a suppressed rite outranks a bare outcome (one hook per record)', () => {
    const hooks = collectPlotHooks({
      name: 'Ashford',
      traditions: [rec({ suppressedBy: { overlordId: 'b' }, lastOutcome: 'failure' })],
    });
    const t = hooks.filter(h => h.category === 'tradition');
    expect(t.length).toBe(1);
    // the suppressed-rite theme (not the failure theme) — precedence resolved to 'suppressed'
    expect(t[0].text.toLowerCase()).toMatch(/overlord|banned|forced under|behind closed doors|secret|resistance/);
    expect(t[0].priority).toBe(8);
  });

  test('a settlement with no traditions mirror adds no tradition hooks (byte-identical)', () => {
    expect(collectPlotHooks({ name: 'Ashford' }).filter(h => h.category === 'tradition')).toEqual([]);
    expect(collectPlotHooks({ name: 'Ashford', traditions: [rec({ lastOutcome: 'good' })] })
      .filter(h => h.category === 'tradition')).toEqual([]); // a quiet rite raises none
  });
});
