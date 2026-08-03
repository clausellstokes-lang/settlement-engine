/**
 * hookRetention.test.js — THE HK-2 PIN SET (docs/DESIGN_HOOK_NONREDUNDANCY.md §6).
 *
 * The layer under test DELETES things a DM would otherwise read, so every pin
 * here is written against the failure mode of deleting the WRONG thing, not
 * against the happy path of deleting something. In order: the two always-survive
 * laws, the untyped exemption and its mutant control, determinism, ordering,
 * the worst-settlement envelope with its guard-the-guard, and the projection-only
 * proof that nothing was written at all.
 *
 * FIXTURE DISCIPLINE: the envelope pins boot the REAL generator through the REAL
 * collector (tests/simulation/simHelpers.js `gen` → `collectPlotHooks`), never a
 * hand-built array. A hand-built fixture would prove the helper's arithmetic
 * while saying nothing about the shapes the pipeline actually emits — the
 * writer/reader payload-spelling drift class this estate has been bitten by.
 * The unit pins below DO use literals, deliberately: they exercise precedence
 * rules that need a controlled interest ordering, and each names the anchor that
 * proves the collection is live.
 */
import { describe, expect, test } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { gen } from '../simulation/simHelpers.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { deriveAllStructuredHooks } from '../../src/domain/hookEscalation.js';
import {
  retainHooks,
  retentionKey,
  retentionK,
  interestOf,
  editedHookTextKeys,
  DEFAULT_RETENTION_TUNING,
} from '../../src/domain/dossier/hookRetention.js';
import { themeOfText, themeOfRelArchetype, UNTYPED } from '../../src/generators/hookThemes.js';

/** A hook shaped like the aggregator's own output. */
const hook = (text, extra = {}) => ({ text, category: 'npc', priority: 5, accent: false, ...extra });

/** A two-theme classifier: whatever the test declares, else untyped. */
const themeMap = (pairs) => (h) => pairs[h.text] || UNTYPED;

const texts = (hooks) => hooks.map((h) => h.text);

// The real collector's own view of a settlement's themes, mirroring the wiring
// inside collectPlotHooks (relationship archetype first, then exact text) so the
// census below measures what the seam measures.
function themeCensus(settlement, hooks) {
  const relThemes = new Map();
  for (const rel of settlement.relationships || []) {
    if (!rel.tension) continue;
    const t = themeOfRelArchetype(rel.archetypeKey);
    if (t !== UNTYPED) relThemes.set(retentionKey(rel.tension), t);
  }
  const counts = new Map();
  for (const h of hooks) {
    const theme = relThemes.get(retentionKey(h.text)) || themeOfText(h.text);
    if (theme === UNTYPED) continue;
    counts.set(theme, (counts.get(theme) || 0) + 1);
  }
  return counts;
}

/** Hooks beyond K for their theme — the quantity retention exists to drive to 0. */
const overflowAbove = (counts, k) => [...counts.values()].reduce((n, c) => n + Math.max(0, c - k), 0);

describe('HK-2 retention — the two always-survive laws', () => {
  test("pin:the-DM's-pen — an edited hook outranks a higher-interest machine hook on its theme", () => {
    const dmHook = hook("The reeve's debt is my players' problem now.", { priority: 1 });
    const machineHook = hook('A machine telling of the same beat.', { priority: 9, accent: true });
    const unrelated = hook('A different beat entirely.', { priority: 9 });
    const input = [machineHook, unrelated, dmHook];

    // The machine hook is STRICTLY more interesting by the composite — so if it
    // survives, it survived on rank, and the law did not hold.
    expect(interestOf(machineHook)).toBeGreaterThan(interestOf(dmHook));

    const kept = retainHooks(input, {
      themeOf: themeMap({
        [dmHook.text]: 'hidden_debt',
        [machineHook.text]: 'hidden_debt',
        [unrelated.text]: 'betrayal',
      }),
      editedTextKeys: new Set([retentionKey(dmHook.text)]),
      scaleBand: 'village', // K = 1
    });

    expectAbsentWithAnchor(texts(kept), machineHook.text, dmHook.text, "the DM's pen blocks its theme");
    expect(texts(kept)).toContain(unrelated.text);
  });

  test("pin:the-DM's-pen — several edited hooks on one theme ALL survive, beyond K", () => {
    const a = hook("My first note on this debt.", { priority: 1 });
    const b = hook("My second note on this debt.", { priority: 1 });
    const machine = hook('The machine telling.', { priority: 9, accent: true });
    const kept = retainHooks([machine, a, b], {
      themeOf: () => 'hidden_debt',
      editedTextKeys: new Set([retentionKey(a.text), retentionKey(b.text)]),
      scaleBand: 'village', // K = 1, and TWO protected hooks sit on the theme
    });
    expect(texts(kept)).toEqual([a.text, b.text]);
  });

  test('pin:the-clock-holds — a clock-anchored hook survives theme eviction', () => {
    const anchored = hook('The bread clock is already running.', { priority: 2 });
    const richer = hook('A richer telling of the same beat.', { priority: 9, accent: true, links: [1, 2] });
    expect(interestOf(richer)).toBeGreaterThan(interestOf(anchored));

    const kept = retainHooks([richer, anchored], {
      themeOf: () => 'scarcity_pressure',
      clockAnchoredKeys: new Set([retentionKey(anchored.text)]),
      scaleBand: 'village',
    });
    expectAbsentWithAnchor(texts(kept), richer.text, anchored.text, 'story in motion is protected');
  });

  test('editedHookTextKeys reads the DM lane through walkUserEdits, not a hand-rolled shape', () => {
    const settlement = {
      plotHooks: [
        { description: 'A hook the DM rewrote.', _userEdits: { description: { value: 'A hook the DM rewrote.' } } },
        { description: 'A hook nobody touched.' },
      ],
    };
    const keys = editedHookTextKeys(settlement);
    expectAbsentWithAnchor(
      [...keys],
      retentionKey('A hook nobody touched.'),
      retentionKey('A hook the DM rewrote.'),
      'only edited hook prose is keyed',
    );
  });
});

describe('HK-2 retention — HK-LAW-3, free prose is never theme-judged', () => {
  test('pin:untyped-untouched — untyped hooks never drop, however many collide', () => {
    const free = ['One free line.', 'Another free line.', 'A third free line.'].map((t) => hook(t, { priority: 9 }));
    const kept = retainHooks(free, { themeOf: () => UNTYPED, scaleBand: 'village' });
    expect(texts(kept)).toEqual(texts(free));
  });

  test('pin:untyped-untouched MUTANT CONTROL — tag the same prose and the drop DOES happen', () => {
    // The guard above is only meaningful if the machinery would otherwise have
    // dropped these. Artificially typing the identical input proves the pin
    // measures the untyped exemption rather than an inert code path.
    const free = ['One free line.', 'Another free line.', 'A third free line.'].map((t) => hook(t, { priority: 9 }));
    const mutated = retainHooks(free, { themeOf: () => 'grief', scaleBand: 'village' });
    expect(mutated).toHaveLength(1);
    expect(texts(mutated)).not.toEqual(texts(free)); // anchored: the line above pins the exact surviving count, so this cannot go vacuous
  });

  test('untyped hooks do not consume a typed theme’s budget', () => {
    const typed = hook('A typed telling.', { priority: 5 });
    const free = hook('A free line.', { priority: 9 });
    const kept = retainHooks([free, typed], {
      themeOf: themeMap({ [typed.text]: 'grief' }),
      scaleBand: 'village',
    });
    expect(texts(kept)).toEqual([free.text, typed.text]);
  });
});

describe('HK-2 retention — determinism, ordering, and the tuning surface', () => {
  test('pin:same-seed-survivors — identical input yields a byte-identical retained list', () => {
    const settlement = gen({ settType: 'city', tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' }, 'hk2-determinism');
    const once = collectPlotHooks(settlement, { retention: true });
    const twice = collectPlotHooks(settlement, { retention: true });
    expect(JSON.stringify(twice)).toBe(JSON.stringify(once));
    // …and a freshly generated settlement on the SAME seed retains the same set,
    // so the layer is stable across generation, not merely across two calls on
    // one object.
    const regenerated = gen({ settType: 'city', tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' }, 'hk2-determinism');
    expect(JSON.stringify(collectPlotHooks(regenerated, { retention: true }))).toBe(JSON.stringify(once));
  });

  test('the tie-break is codepoint on normalised text, so equal-interest survivors never swap', () => {
    const a = hook('Alpha telling.', { priority: 5 });
    const b = hook('Beta telling.', { priority: 5 });
    expect(interestOf(a)).toBe(interestOf(b));
    const forward = retainHooks([a, b], { themeOf: () => 'grief', scaleBand: 'village' });
    const reversed = retainHooks([b, a], { themeOf: () => 'grief', scaleBand: 'village' });
    expect(texts(forward)).toEqual(['Alpha telling.']);
    expect(texts(reversed)).toEqual(['Alpha telling.']);
  });

  test('output is a SUBSEQUENCE — the aggregator’s priority ordering is never reordered', () => {
    const settlement = gen({ settType: 'town', tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' }, 'hk2-order');
    const before = collectPlotHooks(settlement);
    const after = collectPlotHooks(settlement, { retention: true });
    const beforeTexts = texts(before);
    let cursor = -1;
    for (const t of texts(after)) {
      const at = beforeTexts.indexOf(t, cursor + 1);
      expect(at, `retained hook reordered or invented: ${t}`).toBeGreaterThan(cursor);
      cursor = at;
    }
    expect(after.length).toBeLessThanOrEqual(before.length);
  });

  test('K comes from the band table, and an UNKNOWN band takes the most permissive K', () => {
    expect(retentionK('village')).toBe(1);
    expect(retentionK('city')).toBe(2);
    expect(retentionK('metropolis')).toBe(2);
    // A band nobody has classified must drop the FEWEST hooks, not the most.
    const permissive = Math.max(...Object.values(DEFAULT_RETENTION_TUNING.kByBand));
    expect(retentionK('a_band_that_does_not_exist')).toBe(permissive);
    expect(retentionK(undefined)).toBe(permissive);
  });

  test('a missing classifier is a no-op, never an emptied list', () => {
    const input = [hook('One.'), hook('Two.')];
    expect(retainHooks(input, {})).toEqual(input);
    expect(retainHooks(input)).toEqual(input);
    expect(retainHooks([])).toEqual([]);
  });
});

describe('HK-2 retention — the worst-settlement envelope', () => {
  // The measured defect lives in the biggest settlements: many NPCs of the same
  // category drawing from one ~11-string pool. A city corpus is therefore the
  // honest place to measure, not a hamlet.
  const SEEDS = Array.from({ length: 12 }, (_, i) => `hk2-envelope-${i}`);
  const cities = SEEDS.map((seed) => gen({ settType: 'city', tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' }, seed));

  test('pin:worst-settlement — no theme survives above K anywhere in the corpus', () => {
    for (const settlement of cities) {
      const kept = collectPlotHooks(settlement, { retention: true });
      const counts = themeCensus(settlement, kept);
      const k = retentionK(settlement.tier);
      const over = [...counts.entries()].filter(([, c]) => c > k);
      expect(over, `${settlement.name}: theme(s) above K=${k} survived retention`).toEqual([]);
    }
  });

  test('pin:worst-settlement GUARD-THE-GUARD — the same census reds with retention off', () => {
    // If the corpus had no theme repeats to begin with, the pin above would pass
    // against an inert layer. This proves the defect is present in the input:
    // with retention OFF, the same census finds real overflow.
    let overflowWithoutRetention = 0;
    for (const settlement of cities) {
      const raw = collectPlotHooks(settlement);
      overflowWithoutRetention += overflowAbove(themeCensus(settlement, raw), retentionK(settlement.tier));
    }
    expect(
      overflowWithoutRetention,
      'the un-retained corpus shows no theme overflow — the envelope above would be vacuous',
    ).toBeGreaterThan(0);
  });

  test('pin:independent-census — the denominator comes from the RAW hooks, never the retained output', () => {
    // The self-referential-pin class: a repeat rate computed over the deduped
    // list proves list == list. Both terms here are measured on the UN-retained
    // collection, and the retained collection only supplies the numerator's
    // "after" reading.
    let rawTotal = 0;
    let rawOverflow = 0;
    let retainedTotal = 0;
    for (const settlement of cities) {
      const raw = collectPlotHooks(settlement);
      rawTotal += raw.length;
      rawOverflow += overflowAbove(themeCensus(settlement, raw), retentionK(settlement.tier));
      retainedTotal += collectPlotHooks(settlement, { retention: true }).length;
    }
    expect(rawTotal, 'the independent denominator must be a real census').toBeGreaterThan(100);
    expect(rawOverflow / rawTotal, 'theme overflow share before retention').toBeGreaterThan(0);
    // The layer removes exactly the overflow it measured — no more, no less.
    expect(rawTotal - retainedTotal).toBe(rawOverflow);
  });
});

describe('HK-2 retention — HK-LAW-5, the projection writes nothing', () => {
  test('pin:projection-only — the settlement is byte-identical after both collectors run retained', () => {
    const settlement = gen({ settType: 'city', tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' }, 'hk2-projection');
    const before = JSON.stringify(settlement);

    const kept = collectPlotHooks(settlement, { retention: true });
    const structured = deriveAllStructuredHooks(settlement, { retention: true });

    expect(JSON.stringify(settlement), 'retention mutated persisted state').toBe(before);
    // Non-vacuity: the round-trip above is only meaningful if the collectors
    // actually did work and actually dropped something.
    expect(kept.length).toBeGreaterThan(0);
    expect(structured.length).toBeGreaterThan(0);
    expect(collectPlotHooks(settlement).length).toBeGreaterThan(kept.length);
  });

  test('the persisted hook arrays themselves are untouched by a retained read', () => {
    const settlement = gen({ settType: 'city', tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' }, 'hk2-arrays');
    const npcHooksBefore = JSON.stringify((settlement.npcs || []).map((n) => n.plotHooks));
    collectPlotHooks(settlement, { retention: true });
    deriveAllStructuredHooks(settlement, { retention: true });
    expect(JSON.stringify((settlement.npcs || []).map((n) => n.plotHooks))).toBe(npcHooksBefore);
  });
});

describe('HK-2 retention — the seam is DARK by default (J-HK-5 convergence)', () => {
  test('collectPlotHooks is byte-identical to its pre-HK-2 answer when retention is not asked for', () => {
    for (const tier of ['hamlet', 'village', 'town', 'city', 'metropolis']) {
      const settlement = gen({ settType: tier, tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' }, `hk2-dark-${tier}`);
      const bare = collectPlotHooks(settlement);
      expect(JSON.stringify(collectPlotHooks(settlement, {}))).toBe(JSON.stringify(bare));
      expect(JSON.stringify(collectPlotHooks(settlement, { retention: false }))).toBe(JSON.stringify(bare));
      // …and lighting it changes something, so "dark" is a real state and not a
      // description of a layer that does nothing either way.
      expect(collectPlotHooks(settlement, { retention: true }).length).toBeLessThan(bare.length);
    }
  });

  test('deriveAllStructuredHooks — same helper, same dark default', () => {
    const settlement = gen({ settType: 'city', tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' }, 'hk2-structured');
    const bare = deriveAllStructuredHooks(settlement);
    expect(JSON.stringify(deriveAllStructuredHooks(settlement, {}))).toBe(JSON.stringify(bare));

    // "Lighting it changes something" is a claim about the LAYER, not about one
    // lucky seed — and wave HK-3 proved the difference by breaking this pin. HK-3
    // cures theme repeats at the DRAW, and it cured seed 'hk2-structured' so
    // completely that this city now has no above-K overflow left for retention to
    // take: the old single-seed assertion read 29 < 29 and failed a layer that is
    // working exactly as designed. Measured over the family below at HK-3: 4 of 6
    // cities still drop, none gains. So the pin now asserts the layer's two real
    // properties — retention NEVER adds a hook anywhere, and it still bites
    // SOMEWHERE — which no single seed's luck can make vacuous or false.
    const family = Array.from({ length: 6 }, (_, i) => gen({ settType: 'city', tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' }, `hk2-structured-${i}`));
    const pairs = family.map((s) => [deriveAllStructuredHooks(s).length, deriveAllStructuredHooks(s, { retention: true }).length]);
    expect(pairs.every(([, lit]) => lit > 0), 'retention emptied a structured list').toBe(true);
    expect(pairs.every(([dark, lit]) => lit <= dark), 'retention ADDED a hook — it may only drop').toBe(true);
    expect(
      pairs.filter(([dark, lit]) => lit < dark).length,
      `retention dropped nothing anywhere in the family (${JSON.stringify(pairs)}) — the layer is inert, not merely dark`,
    ).toBeGreaterThan(0);
  });
});
