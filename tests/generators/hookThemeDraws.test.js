/**
 * hookThemeDraws.test.js — THE HK-3 PIN SET (docs/DESIGN_HOOK_NONREDUNDANCY.md
 * §3 HK-3, §6).
 *
 * HK-3 changes WHICH authored template a given roll selects. Two things therefore
 * have to be proved, and they pull in opposite directions:
 *
 *   1. THE ROLL BUDGET DID NOT MOVE (HK-LAW-6). If the theme filter cost or saved
 *      even one roll, every downstream draw in the settlement would shift and the
 *      "prose-selection-only" claim in the golden re-record would be false. The
 *      budget is pinned per ARM (a stricter tier must not cost a roll) and over a
 *      whole draw SEQUENCE, with a guard-the-guard proving the two sequences
 *      genuinely diverge — otherwise "equal roll count" would just be the equality
 *      of two identical runs.
 *   2. THE FILTER ACTUALLY BITES. Every preference pin below carries its own
 *      NEGATIVE CONTROL: the same pool, the same fixed roll, run through the
 *      family-only registry, so a pin can never pass against an inert code path.
 *
 * REAL POOLS, NOT ONLY LITERALS. The unit pins use three-letter literals because
 * they need a controlled theme layout; the source-cure pin runs the REAL
 * NPC_FACTION_LOYALTY pools through the REAL themeOfText classifier, and the
 * corpus pin boots the REAL pipeline. A pin that only ever saw literals would
 * prove the arithmetic while saying nothing about the shapes generation emits —
 * the writer/reader payload-spelling class this estate has been bitten by.
 *
 * MEASURED AT BUILD — the same 60-settlement corpus (5 tiers × 12 seeds,
 * `hk-probe-<tier>-<i>`) run in BOTH trees: the pre-HK-3 base 1a820e8c in a
 * detached worktree, and here.
 *
 *   persisted NPC hook arrays (the surface HK-3 governs)
 *     total hooks            855 -> 855    unchanged — HK-3 drops NOTHING
 *     exact duplicates        28 ->  28    unchanged — the pool-EXHAUSTION residual
 *     typed hooks            855 -> 855    unchanged — every loyalty hook is authored
 *     above-K beat repeats   187 ->  85    -54.5%, THE SOURCE CURE
 *
 *   the display aggregator's wider view (collectPlotHooks, which also carries
 *   relationship tensions and five other sources HK-3 does not draw)
 *     collected hooks       2535 -> 2535   unchanged
 *     above-K beat repeats   848 ->  771   -9.08%, diluted by the untouched sources
 *
 * The count columns being IDENTICAL is the point — HK-3 buys variety at zero cost
 * in hooks, because a stricter candidate tier is SKIPPED rather than allowed to
 * empty the candidate set. The remaining projection-side overflow is HK-2's to
 * take, and HK-2 is still dark pending the owner's K signature.
 */
import { afterEach, describe, expect, test } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { drawUnique } from '../../src/generators/hookVariety.js';
import { themeOfText, UNTYPED } from '../../src/domain/hookThemes.js';
import { NPC_FACTION_LOYALTY } from '../../src/data/npcData.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { gen } from '../simulation/simHelpers.js';

afterEach(() => clearActiveRng());

/** Seed the context with a counting wrapper so a roll BUDGET can be measured. */
function countingRng(seed) {
  const prng = createPRNG(seed);
  const state = { rolls: 0 };
  setActiveRng({ random: () => { state.rolls += 1; return prng.random(); } });
  return state;
}

/** A fixed-value RNG: with 0 every draw takes candidate[0], so any difference
 *  between two runs is the CANDIDATE SET's doing and nothing else. */
function fixedRng(value) {
  setActiveRng({ random: () => value });
}

/** Every NPC hook in a settlement, in generation order. */
const npcHooks = (s) => (s.npcs || []).flatMap((n) => n.plotHooks || []);

const CORPUS_TIERS = ['hamlet', 'village', 'town', 'city', 'metropolis'];
const genAt = (tier, i) => gen(
  { settType: tier, tradeRouteAccess: 'random_trade', terrainOverride: 'auto', monsterThreat: 'random_threat', culture: 'random_culture' },
  `hk-probe-${tier}-${i}`,
);

describe('HK-3 draws — HK-LAW-6, the roll budget is invariant', () => {
  test('pin:roll-budget — every arm of drawUnique spends exactly ONE roll', () => {
    const pool = ['a', 'b', 'c'];
    const themeOf = (x) => ({ a: 'grief', b: 'grief', c: 'betrayal' }[x] || UNTYPED);
    /** @type {Array<[string, () => unknown]>} */
    const arms = [
      ['no registry at all', () => drawUnique(pool, undefined)],
      ['family registry only', () => drawUnique(pool, new Set())],
      ['tier 1 — unused family AND unused theme', () => drawUnique(pool, new Set(), undefined, new Set(), themeOf)],
      ['tier 2 — unused family, every theme spoken', () => drawUnique(pool, new Set(), undefined, new Set(['grief', 'betrayal']), themeOf)],
      ['tier 3 — pool exhausted', () => drawUnique(pool, new Set(pool), undefined, new Set(), themeOf)],
    ];
    for (const [label, draw] of arms) {
      const state = countingRng('hk3-arm');
      const drawn = draw();
      expect(drawn, `${label} must still return a template`).toBeDefined();
      expect(state.rolls, `${label} must spend exactly one roll (HK-LAW-6)`).toBe(1);
    }
  });

  test('pin:roll-budget — an identical draw SEQUENCE costs the identical roll count, themed or not', () => {
    const pool = NPC_FACTION_LOYALTY.government;
    // Deliberately past the pool's length so the sequence crosses BOTH the
    // theme-exhausted tier and the family-exhausted tier.
    const DRAWS = pool.length + 4;
    const run = (themed) => {
      const state = countingRng('hk3-roll-budget');
      const used = new Set();
      const themes = new Set();
      const drawn = [];
      for (let i = 0; i < DRAWS; i += 1) {
        drawn.push(themed ? drawUnique(pool, used, undefined, themes, themeOfText) : drawUnique(pool, used));
      }
      return { rolls: state.rolls, drawn };
    };
    const bare = run(false);
    const themed = run(true);
    expect(bare.rolls, 'the family-only registry spends one roll per draw').toBe(DRAWS);
    expect(themed.rolls, 'the theme registry must not add or save a single roll').toBe(bare.rolls);
    // GUARD-THE-GUARD: the equal budget above is only meaningful if the two runs
    // actually chose differently. Identical runs would satisfy it vacuously.
    // anchored: both arrays are pinned to the exact length DRAWS on the line below,
    // so neither can be empty or undefined when this inequality is read.
    expect(themed.drawn).toHaveLength(bare.drawn.length);
    expect(themed.drawn).not.toEqual(bare.drawn);
  });
});

describe('HK-3 draws — the candidate preference, each with its negative control', () => {
  test('pin:theme-preference — the second draw takes an UNTOLD beat over a told one', () => {
    const pool = ['A', 'B', 'C'];
    const themeOf = (x) => ({ A: 'grief', B: 'grief', C: 'betrayal' }[x] || UNTYPED);
    const twice = (themed) => {
      fixedRng(0);
      const used = new Set();
      const themes = new Set();
      return [0, 1].map(() => (themed
        ? drawUnique(pool, used, undefined, themes, themeOf)
        : drawUnique(pool, used)));
    };
    // NEGATIVE CONTROL FIRST: the family registry alone happily retells the beat,
    // because B is simply the next unused STRING.
    expect(twice(false), 'family-only draws retell grief with a different string').toEqual(['A', 'B']);
    // …and the theme registry reaches past it for the untold beat.
    expect(twice(true), 'the theme registry prefers the untold beat').toEqual(['A', 'C']);
  });

  test('pin:untyped-untouched — free prose is never excluded and never claims a beat', () => {
    // FREE sits LAST on purpose: were it first, the mutant control below would
    // pick it for positional reasons and the pin would prove nothing.
    const pool = ['A', 'C', 'D', 'FREE'];
    const asUntyped = (x) => (x === 'FREE' ? UNTYPED : 'grief');
    const asTyped = () => 'grief';
    const twice = (themeOf) => {
      fixedRng(0);
      const used = new Set();
      const themes = new Set();
      const drawn = [0, 1].map(() => drawUnique(pool, used, undefined, themes, themeOf));
      return { drawn, themes };
    };

    const free = twice(asUntyped);
    expect(free.drawn, 'an untyped candidate is never blocked by a spoken beat').toEqual(['A', 'FREE']);
    // HK-LAW-3: drawing free prose must not teach the registry anything.
    expectAbsentWithAnchor(
      [...free.themes],
      UNTYPED,
      'grief',
      'the untyped sentinel is never registered as a beat',
    );
    expect(free.themes.size, 'only the authored draw claimed a beat').toBe(1);

    // MUTANT CONTROL: tag the identical string and the identical roll lands
    // elsewhere — proof that the pin above measures the untyped exemption rather
    // than an inert code path.
    expect(twice(asTyped).drawn, 'typing the same prose changes the answer').toEqual(['A', 'C']);
  });

  test('an exhausted pool takes the unavoidable repeat and claims no new beat', () => {
    const pool = ['A', 'B'];
    const used = new Set(pool);
    const themes = new Set();
    fixedRng(0.6);
    expect(drawUnique(pool, used, undefined, themes, () => 'grief')).toBe('B');
    expect(themes.size, 'an unavoidable repeat must not claim a beat it did not earn').toBe(0);
    expect(used.size, 'nor may it re-register a family').toBe(2);
  });

  test('a half-wired call site degrades to the family registry, never to a crash', () => {
    const pool = ['A', 'B'];
    fixedRng(0);
    expect(drawUnique(pool, new Set(), undefined, new Set(), undefined)).toBe('A');
    expect(drawUnique(pool, new Set(), undefined, undefined, () => 'grief')).toBe('A');
    // A non-Set "registry" is refused rather than trusted — `.has` on a plain
    // object would have answered undefined and silently disabled the filter.
    expect(drawUnique(pool, new Set(), undefined, /** @type {never} */ ({}), () => 'grief')).toBe('A');
  });
});

describe('HK-3 draws — the source cure over the REAL authored pools', () => {
  test('pin:source-cure — the theme registry tells at least as many beats everywhere, and strictly more overall', () => {
    let bareBeats = 0;
    let themedBeats = 0;
    const failures = collectSeedFailures(Object.keys(NPC_FACTION_LOYALTY), (category) => {
      const pool = NPC_FACTION_LOYALTY[category];
      const draws = Math.min(pool.length, 8);
      const beatsUnder = (themed) => {
        const prng = createPRNG(`hk3-source-${category}`);
        setActiveRng({ random: () => prng.random() });
        const used = new Set();
        const themes = new Set();
        const drawn = [];
        for (let i = 0; i < draws; i += 1) {
          drawn.push(themed ? drawUnique(pool, used, undefined, themes, themeOfText) : drawUnique(pool, used));
        }
        return new Set(drawn.map(themeOfText)).size;
      };
      const bare = beatsUnder(false);
      const themed = beatsUnder(true);
      bareBeats += bare;
      themedBeats += themed;
      expect(
        themed,
        `${category}: ${draws} draws told ${themed} distinct beats under HK-3 but ${bare} under the family registry alone — the theme arm must never tell FEWER`,
      ).toBeGreaterThanOrEqual(bare);
    });
    expectNoSeedFailures(failures, 'no authored loyalty pool loses beat variety under HK-3');
    // NON-VACUITY: if the pools already told a distinct beat every time, the
    // inequality above would hold against an inert filter.
    expect(
      themedBeats,
      `the corpus told ${themedBeats} distinct beats under HK-3 vs ${bareBeats} without it — the filter must actually bite somewhere`,
    ).toBeGreaterThan(bareBeats);
  });
});

describe('HK-3 draws — the corpus, through the real pipeline', () => {
  const corpus = CORPUS_TIERS.flatMap((tier) => Array.from({ length: 12 }, (_, i) => genAt(tier, i)));

  test('pin:no-hook-is-lost — the count the DM sees is byte-for-byte what it was', () => {
    // Measured in BOTH trees at base 1a820e8c and here: a stricter candidate tier
    // is SKIPPED when it would empty the set, so HK-3 can only change which
    // template is drawn, never how many.
    const total = corpus.reduce((n, s) => n + npcHooks(s).length, 0);
    const duplicates = corpus.reduce((n, s) => {
      const hooks = npcHooks(s);
      return n + hooks.length - new Set(hooks).size;
    }, 0);
    expect(total, 'the corpus NPC-hook total moved — HK-3 must never drop a hook').toBe(855);
    expect(duplicates, 'the exact-duplicate residual is bounded pool EXHAUSTION and must not move').toBe(28);

    // A PRE-EXISTING CONDITION, pinned here so HK-3 cannot be blamed for it and so
    // it cannot quietly grow: 50 of the corpus's 611 generated NPCs carry NO
    // plotHooks field at all. generateSingleNPC always builds one, so something
    // downstream of generateNPCs is re-shaping these records — measured IDENTICALLY
    // (50/611) in the pre-HK-3 base 1a820e8c, so it is not this wave's doing and not
    // this wave's to fix. Reported to the chair rather than papered over; the number
    // is frozen here so the day it moves, a lane sees it.
    const npcTotal = corpus.reduce((n, s) => n + (s.npcs || []).length, 0);
    const hookless = corpus.reduce((n, s) => n + (s.npcs || []).filter((x) => !(x.plotHooks || []).length).length, 0);
    expect(npcTotal, 'the NPC denominator must be a real corpus').toBe(611);
    expect(hookless, 'hookless NPCs grew — a hook-bearing record is being dropped downstream').toBe(50);
  });

  test('pin:same-seed-survivors — the same seed draws the same hooks, forever', () => {
    const failures = collectSeedFailures(CORPUS_TIERS, (tier) => {
      const once = npcHooks(genAt(tier, 0));
      const twice = npcHooks(genAt(tier, 0));
      expect(once.length, `${tier}: a settlement with no hooks proves nothing`).toBeGreaterThan(0);
      expect(JSON.stringify(twice), `${tier}: same seed, different hooks`).toBe(JSON.stringify(once));
    });
    expectNoSeedFailures(failures, 'every tier replays its hooks byte-identically from its seed');
  });

  test('pin:independent-census — above-K beat repeats fell, counted from the RAW draws', () => {
    // The denominator is the settlement's OWN typed hooks, censused from the
    // persisted NPC arrays — never from a deduped or retained projection (the
    // self-referential-pin class). K mirrors HK-2's band table: 2 at city and
    // above, 1 below.
    let typed = 0;
    let overflow = 0;
    for (const s of corpus) {
      const k = ['city', 'metropolis'].includes(s.tier) ? 2 : 1;
      const counts = new Map();
      for (const text of npcHooks(s)) {
        const theme = themeOfText(text);
        if (theme === UNTYPED) continue;
        counts.set(theme, (counts.get(theme) || 0) + 1);
      }
      typed += [...counts.values()].reduce((a, b) => a + b, 0);
      overflow += [...counts.values()].reduce((n, c) => n + Math.max(0, c - k), 0);
    }
    const share = (overflow / typed) * 100;
    const diag = `above-K beat repeats ${overflow}/${typed} = ${share.toFixed(2)}% `
      + '(HK-3 measured 9.94% = 85/855; the pre-HK-3 base 1a820e8c measured 21.87% = 187/855; envelope ≤ 12%)';
    expect(typed, 'the census denominator must be a real corpus').toBeGreaterThan(500);
    expect(share, diag).toBeLessThanOrEqual(12);
    // NON-VACUITY: the pools are smaller than the settlements that draw from
    // them, so some overflow ALWAYS survives. An envelope met by a corpus with
    // nothing to measure would be worthless.
    expect(overflow, 'no overflow at all — this envelope would be vacuous').toBeGreaterThan(0);
  });
});
