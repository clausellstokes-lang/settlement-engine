/**
 * CENSUS-3d (2026-11-05), unit 6 — the hook tables declared (`docs/DESIGN_POOL_CENSUS.md` §3.1:
 * a line declares the atoms it presumes BEYOND its event's or branch's key).
 *
 *   - THE HISTORY HOOKS (`historyData.js :: HISTORICAL_EVENTS_DATA[].plotHooks`): the declaring
 *     rows are `{ text, needs?, excludes? }`. Two consumers (R-C): a CURRENT TENSION prints its
 *     template's whole list (kind A, the table owner's) and is filtered by the record
 *     (`historyGenerator.js :: buildHistoricalEvent`); the TIMELINE's hook roll
 *     (`generateEventNarrative`, Appendix B item 12, the mechanism lane's) reads the row's text,
 *     byte-identical, until that lane routes it through `drawDeclared`. Measured on
 *     soak1k-0..199 before the change (printed anywhere on the record / false by the final record): the crime-wave guard captain 42 / 4 (soak1k-13, -32, -42, -54), the
 *     warehouse held off the market 65 / 28, the succession ruler 38 / 15 and 45 / 22 (a
 *     council seat), the workers' quarter 14 / 9, the flood's dam and wreck 6 / 4 and 7 / 3,
 *     the temple vault and the shrine 6 / 2, 4 / 1, 4 / 2.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { assertDeclarable, declarationOf, declarationAdmits } from '../../src/domain/facts/factVocabulary.js';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';

beforeAll(async () => { await ensureLaws(); });

/** every history hook row, with its event type */
const HISTORY_ROWS = HISTORICAL_EVENTS_DATA.flatMap((e) => (e.plotHooks || []).map((row) => ({ type: e.type, row })));
const textOf = (row) => (typeof row === 'string' ? row : row.text);

describe('the history hooks declare what their event does not guarantee', () => {
  // CENSUS-3e (R-AA): demographic_pressure's three hooks declare their migration direction (15 rows).
  // W2-FIX-DATA (2026-11-13, the REVIEW-W2B cold list): guild_conflict's two guild hooks declare the guild (homed by facts/guild.js), and
  // the crime wave's guard captain declares a watch, not any guard (a household levy has no captain): 15 → 17 rows.
  // W2-FIX-DATA-5 (2026-11-13, ROUND-3-CUT-INCREMENT ww-544): the succession crisis's ailing and poisoned ruler exclude the vacant seat's crisis too (re-keyed by cause; still 17 rows).
  it('the seventeen declaring rows carry their atoms, every atom declarable', () => {
    const declaring = HISTORY_ROWS.filter(({ row }) => typeof row === 'object');
    expect(declaring.map(({ type, row }) => `${type}: ${[...(row.needs || []), ...(row.excludes || []).map((x) => `no ${x}`)].join(', ')}`)).toEqual([
      'succession_crisis: no ruler: council, no crisis: succession_void',
      'succession_crisis: no ruler: council, no crisis: succession_void',
      'economic_disparity: tier: >= town',
      'guild_conflict: guild',
      'guild_conflict: guild',
      'guild_conflict: market',
      'resource_scarcity: market',
      'crime_wave: watch',
      'market_crash: market',
      'great_flood: navigable',
      'great_flood: navigable',
      'heresy_trial: institution: temple',
      'pilgrimage_surge: institution: temple',
      'pilgrimage_surge: institution: temple',
      'demographic_pressure: migration: influx',
      'demographic_pressure: migration: exodus',
      'demographic_pressure: migration: influx',
    ]);
    for (const { row } of declaring) for (const a of [...(row.needs || []), ...(row.excludes || [])]) expect(assertDeclarable(a).dimension, a).toBeTruthy();
  });

  // The seeds where the base stored a refused row (the probe above), and two that did not.
  const SEEDS = [13, 32, 42, 54, 0, 12, 21, 23, 31, 95, 155, 163, 196, 2, 3];
  it('a current tension stores only the hooks the final record admits, as text; the timeline stores text', () => {
    // The expectation is the test's own (not read from the data), so it reds on a base that declares nothing.
    const declared = new Map([
      ['the ailing ruler wants a final errand', { excludes: ['ruler: council'] }],
      ['someone is poisoning the ruler slowly', { excludes: ['ruler: council'] }],
      ['a hidden ledger documenting wage theft', { needs: ['tier: >= town'] }],
      ['someone is sabotaging both guilds', { needs: ['market'] }],
      ['a warehouse full of the scarce goods', { needs: ['market'] }],
      ['a guard captain is on the payroll', { needs: ['guardPresence'] }],
      ['a ledger names who was warned', { needs: ['market'] }],
      ['a structure meant to hold back the water', { needs: ['navigable'] }],
      ['the flood uncovered an old foundation', { needs: ['navigable'] }],
      ['a relic seized during the trial', { needs: ['institution: temple'] }],
      ['the pilgrim trade made one family', { needs: ['institution: temple'] }],
      ['a rival shrine claims the relic', { needs: ['institution: temple'] }],
    ].map(([t, d]) => [t, { text: t, ...d }]));
    const bad = [];
    const failures = collectSeedFailures(SEEDS, (i) => {
      const s = birth(i).settlement;
      const facts = factsOf(s);
      for (const ev of s.history?.historicalEvents || []) for (const h of ev.plotHooks || []) expect(typeof h, `soak1k-${i}`).toBe('string');
      for (const ev of s.history?.currentTensions || []) {
        for (const h of ev.plotHooks || []) {
          expect(typeof h, `soak1k-${i}`).toBe('string');
          for (const [text, row] of declared) {
            if (!h.toLowerCase().includes(text)) continue;
            const v = declarationAdmits(declarationOf(row), facts);
            if (!v.admitted) bad.push(`soak1k-${i}: ${textOf(row).slice(0, 40)} — ${v.refused.join(', ')}`);
          }
        }
      }
    });
    expectNoSeedFailures(failures, 'every stored hook is text');
    expect(bad).toEqual([]);
  }, 120_000);
});

describe('the outlook hooks carry their declarations beside the branches that print them (R-C)', () => {
  it('each key is a string the branch prints, each atom declarable, each twin answers its original', async () => {
    // LANDING-R2 (the chair's ruling under ODQ §934.105): the table moved VERBATIM to its own module,
    // economy/outlookHookSiblings.js, to cure foodBalance.js's cohesion ceiling (921 > 900 raw lines).
    // So the table is read at its new home, and the branches that PRINT the keys are the whole of
    // foodBalance.js, which now carries no table (it was the source before the table's declaration).
    const { OUTLOOK_HOOK_SIBLINGS } = await import('../../src/generators/economy/outlookHookSiblings.js');
    const { readFileSync } = await import('node:fs');
    const printed = readFileSync(new URL('../../src/generators/economy/foodBalance.js', import.meta.url), 'utf8');
    expect(printed.includes('export const OUTLOOK_HOOK_SIBLINGS'), 'the printer carries no table of its own').toBe(false);
    // The old path still answers (scripts/lib/table-pools.mjs enrols the channel at foodBalance.js).
    expect((await import('../../src/generators/economy/foodBalance.js')).OUTLOOK_HOOK_SIBLINGS).toBe(OUTLOOK_HOOK_SIBLINGS);
    // COHERENCE-AGREE (2026-11-11): the timber line's second event, the war line, its three events in peace, the starving set.
    expect(Object.keys(OUTLOOK_HOOK_SIBLINGS).map((k) => k.split(' ').slice(0, 4).join(' '))).toEqual([
      'Something is killing the', 'War has taken the', 'The timber rafts stopped', 'The iron merchants have',
      'The iron carts are', 'A new toll on', 'The settlement is starving.']);
    for (const [key, set] of Object.entries(OUTLOOK_HOOK_SIBLINGS)) {
      expect(printed.includes(key), key.slice(0, 40)).toBe(true);
      expect(set[0].text).toBe(key);
      for (const a of set[0].needs) expect(assertDeclarable(a).dimension, a).toBeTruthy();
      if (set[1]) {
        expect(set[1].twinOf).toBe(key);
        // RE-SPELLED 2026-11-12 (COHERENCE-AGREE-3, REVIEW-AGREE F4), stricter, not looser: a twin answers its
        // original's needs AND keeps its original's refusals (the war line's twin asserts the war too, so it
        // refuses the peace as its original does). For every set whose original refuses nothing — all but the
        // war line and the three peace events — this is the assertion it was.
        expect(set[1].excludes).toEqual([...set[0].needs, ...(set[0].excludes || [])]);
      }
    }
    // the [sea] case: the timber twin says no ships
    const timber = Object.values(OUTLOOK_HOOK_SIBLINGS).find((s) => /timber/.test(s[0].text));
    expect(timber[0].needs).toEqual(['navigable']);
    expect(/ship|boat|dock/i.test(timber[1].text)).toBe(false);
  });
});
