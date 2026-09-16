/**
 * advanceEpochForkParity.test.js — EP-1's DRAW-COUNT PARITY instrument (chair ruling C2,
 * closed under the E5 conditions; respelled by the compile's J-TC24-4).
 *
 * THE CLAIM IT EXISTS TO MAKE FALSIFIABLE. The advance-epoch seam moves the pulse root's
 * seed VALUE and introduces no branch, so a lit advance must draw the SAME NUMBER of
 * sub-streams in the SAME ORDER as a dark one — from a different stream. That is what
 * lets R-BLD-10's refusal stand unlitigated: the ruling protected the kernel's PRNG CALL
 * ORDER, and this member does not touch it. If the count or the order ever diverges, this
 * file is a STOP-AND-REPORT, never a repair in place: a divergence would mean the seam
 * grew a branch, and the whole dark-identity argument would need re-deriving rather than
 * patching.
 *
 * ⛔⛔ THE SIGNED SPELLING WOULD HAVE BEEN VACUOUS, AND THE CORRECTION IS THE POINT.
 * C-EPF-4 as signed names "identical `rng.random()` / `rng.fork()` call COUNT AND ORDER".
 * MEASURED at this base and re-asserted below from source: `pulseKernel.js` carries
 * TWENTY-TWO `rng.fork(` call sites and ZERO `rng.random(` call sites. An instrument
 * spelled around `random()` observes nothing at all and passes green forever — the exact
 * vacuity class this estate has spent the quarter killing. The instrument counts FORKS.
 *
 * ⛔ AND THE COMPARISON IS OVER THE ORDERED SEQUENCE, NEVER A SET OR A MULTISET. Fork
 * labels in this kernel are NOT unique — `war-layer` is spelled at THREE separate call
 * sites — so a set comparison would silently accept a reordering, and a multiset would
 * accept a swap of two equal-label draws. Both are stream-identity changes. The assertions
 * below are array equality, and the guard-the-guard arm proves the comparator really
 * discriminates order and length rather than passing on anything.
 *
 * ⛔⛔ THE SIGNED CLAIM IS REFUTED AS SPELLED, AND THE NARROWED ONE IS MEASURED AND TRUE.
 * C-EPF-4 says the WHOLE `rng.fork()` sequence is identical in count and order. EXECUTED
 * at this base, it is not, and the reason is structural rather than a defect: MOST FORK
 * LABELS IN THIS KERNEL ARE CONTENT-DERIVED, not stage constants — `roll:candidate.npc.
 * expose.<npcId>.<tick>`, `reform:<settlementId>:<tick>`. A lit advance draws a different
 * future, a different future has a different candidate roster, and a different roster
 * forks under different labels. Measured on this fixture:
 *
 *   SINGLE TICK, same starting world   total 40 vs 40   multiset IDENTICAL   order differs
 *   COMPOSED (4 ticks)                 total 149 vs 139  multiset differs     — the worlds
 *                                                                               have diverged
 *   STRUCTURAL SUBSEQUENCE, both paths 14 vs 14 and 56 vs 56, IDENTICAL IN ORDER
 *
 * So the load-bearing claim — the one R-BLD-10's refusal actually protects, that the
 * kernel's STAGE CALL ORDER is untouched — is TRUE and is asserted below over the
 * structural family. The single-tick TOTAL count is also identical, which is the tightest
 * true form of "the seam adds no draw and removes none". And the two families that
 * legitimately move are DECLARED, with their mechanism named and their figures measured,
 * because a narrowed pin that does not say what it stopped claiming is how a narrowing
 * becomes a quiet retreat.
 *
 * ⚠ THE INSTRUMENT WRAPS THE RETURNED PRNG, NOT THE MODULE EXPORT ALONE, and that is
 * forced rather than stylistic: `fork` is `(label) => createPRNG(`${seed}::${label}`)` and
 * it calls `createPRNG` through the module's OWN internal binding, so mocking the export
 * cannot see a sub-fork. Wrapping the returned object's `fork` — recursively, so a fork of
 * a fork is recorded too — is the only spelling that observes the real sequence. Strict
 * pass-through throughout: the original's result is returned unchanged, so instrumenting
 * cannot perturb a byte of the run being measured.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test, vi } from 'vitest';

/** The recorder. Hoisted, because vi.mock factories hoist above the imports. */
const trace = { labels: /** @type {string[]} */ ([]), roots: /** @type {string[]} */ ([]) };
const resetTrace = () => { trace.labels = []; trace.roots = []; };

/** Recursively wrap a prng so every `fork` call appends its label, in call order. */
function instrument(rng) {
  return {
    ...rng,
    fork: (label) => {
      trace.labels.push(String(label));
      return instrument(rng.fork(label));
    },
  };
}

vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createPRNG: (...args) => {
      trace.roots.push(String(args[0]));
      return instrument(actual.createPRNG(...args));
    },
  };
});

const { simulateCampaignWorldPulse } = await import('../../src/domain/worldPulse/pulseKernel.js');
const { simulateCampaignWorldInterval } = await import('../../src/domain/worldPulse/advanceInterval.js');
const { ensureRegionalGraph } = await import('../../src/domain/region/index.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const KERNEL = readFileSync(join(ROOT, 'src/domain/worldPulse/pulseKernel.js'), 'utf8');
const FLAG = 'advanceEpochEnabled';
const NOW = '2026-01-01T00:00:00.000Z';
const SEED = 'ep-parity';
const EPOCH = 'ep-parity-nonce';

/**
 * THE STRUCTURAL FAMILY — every fork label spelled as a STRING LITERAL in the kernel.
 * These are the stage boundaries, and their ordered sequence IS the call order R-BLD-10's
 * refusal protects. Derived from the kernel's own source below rather than hand-listed, so
 * a renamed or deleted stage cannot silently shrink the family this file measures.
 */
const STRUCTURAL_LABELS = new Set(
  [...KERNEL.matchAll(/rng\.fork\('([^']+)'\)/g)].map((match) => match[1]),
);
const structuralOf = (labels) => labels.filter((label) => STRUCTURAL_LABELS.has(label));

const BASE_GRAPH = ensureRegionalGraph({
  edges: [
    { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'allied' },
    { id: 'edge.a.c', from: 'a', to: 'c', relationshipType: 'trade_partner' },
  ],
});

const settlement = (name) => ({
  name, tier: 'town', population: 1400,
  config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 20, economicBase: 'agrarian' },
  institutions: [],
  economicState: {
    primaryExports: ['Bulk grain and foodstuffs'], primaryImports: [], economicBase: 'agrarian',
    foodSecurity: { storageMonths: 3, deficitPct: 20, surplusPct: 0, foodRatio: 0.8, importDependency: 0.2, resilienceScore: 50 },
  },
  powerStructure: {
    publicLegitimacy: { score: 44, label: 'Contested' },
    factions: [{ faction: 'Landed Gentry', category: 'noble', power: 60 }],
    conflicts: [],
  },
  npcs: [{ id: `steward_${name}`, name: `Steward ${name}`, importance: 'key' }],
  activeConditions: [],
});

const save = (id, name) => ({
  id, name, phase: 'canon', settlement: settlement(name),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

function fixture(rules) {
  return {
    saves: [save('a', 'Ashford'), save('b', 'Briarwatch'), save('c', 'Crownhold')],
    campaign: {
      id: 'ep-parity-campaign', name: 'Epoch Parity', settlementIds: ['a', 'b', 'c'],
      worldState: {
        rngSeed: SEED, tick: 1,
        ...(rules === undefined ? {} : { simulationRules: rules }),
        calendar: { elapsedWeeks: 30 },
        stressors: [
          { id: 'world_stressor.famine.b', type: 'famine', severity: 0.85, affectedSettlementIds: ['b'], age: 3 },
        ],
      },
      regionalGraph: JSON.parse(JSON.stringify(BASE_GRAPH)),
      wizardNews: { currentTick: 1, entries: [] },
    },
  };
}

/** One single-tick pass; returns the ordered fork-label sequence and the composed roots. */
function traceSingleTick(rules, advanceEpoch) {
  resetTrace();
  const { campaign, saves } = fixture(rules);
  simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW, advanceEpoch });
  return { labels: [...trace.labels], roots: [...trace.roots] };
}

/** One composed multi-tick advance; same shape. */
async function traceComposed(rules, advanceEpoch) {
  resetTrace();
  const { campaign, saves } = fixture(rules);
  await simulateCampaignWorldInterval({
    campaign, saves, interval: 'one_month', now: NOW, autoResolve: true, advanceEpoch,
  });
  return { labels: [...trace.labels], roots: [...trace.roots] };
}

describe('EP-1 C2 — the instrument measures the surface the kernel actually uses', () => {
  test('the kernel carries 22 fork sites and ZERO random sites, so a random-spelled spy would be vacuous', () => {
    const forkSites = (KERNEL.match(/rng\.fork\(/g) || []).length;
    const randomSites = (KERNEL.match(/rng\.random\(/g) || []).length;
    // ⛔ IF THESE MOVE, RE-DERIVE — do not adjust the number to make the file pass. The
    // count is the reason this instrument is shaped the way it is, and a new `rng.random(`
    // site in the kernel would mean the parity claim now has a second surface to cover.
    expect(forkSites).toBe(22);
    expect(randomSites).toBe(0);
  });

  test('the recorder is live and non-vacuous — a broken spy would make every parity arm pass', () => {
    const { labels, roots } = traceSingleTick(undefined, null);
    expect(roots.length).toBeGreaterThanOrEqual(1);
    expect(roots[0]).toBe('ep-parity::tick:2::one_month');
    // The floor is deliberately well below the observed population: it exists to catch a
    // collapsed recorder, not to freeze a branch-dependent runtime count.
    expect(labels.length).toBeGreaterThanOrEqual(5);
  });

  test('fork labels are NOT unique in source, which is why the comparison is ordered rather than a set', () => {
    // MEASURED FROM SOURCE, not from one run: `war-layer` is spelled at THREE call sites,
    // so the label alone cannot identify a draw. (At runtime only the sites whose stage
    // fires are reached, so a single run may well show each label once — which is exactly
    // why this arm reads the kernel rather than a trace.)
    const warLayerSites = (KERNEL.match(/rng\.fork\('war-layer'\)/g) || []).length;
    expect(warLayerSites).toBe(3);
  });

  test('THE LABEL FAMILIES, measured: most kernel forks are CONTENT-DERIVED, not stage constants', () => {
    // This is the measurement that refutes C-EPF-4 as signed, and it is asserted rather
    // than described so a later reader cannot restore the wider claim by assuming labels
    // are constants.
    const { labels } = traceSingleTick(undefined, null);
    const structural = labels.filter((label) => STRUCTURAL_LABELS.has(label));
    const derived = labels.filter((label) => !STRUCTURAL_LABELS.has(label));
    expect(structural.length).toBeGreaterThan(0);
    expect(derived.length).toBeGreaterThan(0);
    // Every derived label carries an id or a tick — that is what makes it content-derived.
    expect(derived.filter((label) => !/[:.]/.test(label))).toEqual([]);
  });
});

describe('EP-1 C2 — the STAGE call order is untouched, per advance path', () => {
  test('SINGLE-TICK PATH: the structural fork subsequence is identical in count AND order', () => {
    const dark = traceSingleTick(undefined, null);
    const lit = traceSingleTick({ [FLAG]: true }, EPOCH);
    expect(structuralOf(lit.labels)).toEqual(structuralOf(dark.labels));
    // The non-vacuity floor: a structural family that collapsed to [] would make the
    // equality above a comparison of two empty lists.
    expect(structuralOf(dark.labels).length).toBeGreaterThanOrEqual(10);
  });

  test('SINGLE-TICK PATH: the TOTAL draw count is identical and the label multiset is identical', () => {
    // THE TIGHTEST TRUE FORM of "the seam adds no draw and removes none". From the SAME
    // starting world one tick produces the same roster, so every fork that happens dark
    // happens lit — only the seeded ORDERING of the per-candidate rolls moves.
    const dark = traceSingleTick(undefined, null);
    const lit = traceSingleTick({ [FLAG]: true }, EPOCH);
    expect(lit.labels.length).toBe(dark.labels.length);
    expect([...lit.labels].sort()).toEqual([...dark.labels].sort());
  });

  test('COMPOSED PATH: the structural fork subsequence is identical even after the worlds diverge', async () => {
    // ⭐ THIS IS THE STRONGEST ARM IN THE FILE. Over a composed advance the two worlds
    // really do come apart — the totals differ, asserted in the next test — and the STAGE
    // sequence still matches tick for tick. That is R-BLD-10's protected property,
    // asserted rather than argued.
    const dark = await traceComposed(undefined, null);
    const lit = await traceComposed({ [FLAG]: true }, EPOCH);
    expect(structuralOf(lit.labels)).toEqual(structuralOf(dark.labels));
    expect(structuralOf(dark.labels).length).toBeGreaterThanOrEqual(40);
  });

  test('DECLARED FREE TO DIFFER: the content-derived family moves, and that IS the feature', async () => {
    // A narrowed pin that does not state what it stopped claiming is a quiet retreat. The
    // two legitimate divergences are asserted POSITIVELY here, so the narrowing is a
    // measurement rather than an omission — and so that a future build in which they
    // STOPPED diverging would red, because that would mean the epoch reached nothing.
    const dark = traceSingleTick(undefined, null);
    const lit = traceSingleTick({ [FLAG]: true }, EPOCH);
    // (a) at ONE tick: identical multiset, different ORDER — the seeded roster shuffle.
    expect(lit.labels.join('|') === dark.labels.join('|')).toBe(false);
    // (b) over a COMPOSED advance: the rosters themselves diverge, so the totals do.
    const darkC = await traceComposed(undefined, null);
    const litC = await traceComposed({ [FLAG]: true }, EPOCH);
    expect(litC.labels.length === darkC.labels.length).toBe(false);
  });

  test('THE ANTI-VACUITY HALF: the streams really diverged while the sequence held', () => {
    // Without this the parity arms above are satisfied by a lit run that did nothing at
    // all. The roots must differ — that IS the feature — while the labels do not.
    const dark = traceSingleTick(undefined, null);
    const lit = traceSingleTick({ [FLAG]: true }, EPOCH);
    expect(lit.roots[0]).toBe('ep-parity::tick:2::one_month::epoch:ep-parity-nonce');
    expect(dark.roots[0]).toBe('ep-parity::tick:2::one_month');
    expect(lit.roots[0] === dark.roots[0]).toBe(false);
    // Every ROOT composed in the lit run differs from its dark twin at the same position:
    // the segment reaches the whole composition, not merely the first draw.
    const sameAtPosition = lit.roots.filter((root, i) => root === dark.roots[i]);
    expect(sameAtPosition).toEqual([]);
  });

  test('GUARD THE GUARD: the comparison really discriminates order and length', () => {
    // A parity assertion whose comparator could not fail is the same vacuity in a
    // different coat. Both failure shapes are proved on fixtures.
    const base = ['alpha', 'beta', 'alpha'];
    const reordered = ['alpha', 'alpha', 'beta'];
    const truncated = ['alpha', 'beta'];
    expect(() => expect(reordered).toEqual(base)).toThrow();
    expect(() => expect(truncated).toEqual(base)).toThrow();
    expect(() => expect([...base]).toEqual(base)).not.toThrow();
    // …and a SET comparison would have accepted the reordering, which is the spelling
    // this instrument deliberately refuses.
    expect([...new Set(reordered)].sort()).toEqual([...new Set(base)].sort());
  });
});
