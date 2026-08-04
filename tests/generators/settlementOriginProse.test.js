/**
 * settlementOriginProse.test.js — THE ORIGIN-RUNG WIDENING PIN SET (lane RR, part A).
 *
 * PT2-5 measured the origin rung at NINE distinct bodies over its whole config
 * space, with the DEFAULT `road` arm — a third of all generations — carrying one
 * sentence, so two settlements sharing a route and a terrain printed the identical
 * "Why it is here" line forever. Lane RR widened the corpus at the mold. Four
 * things have to stay true, and each one is a separate failure mode:
 *
 *   1. NO SEEDLESS CALLER MOVED (canonical-at-zero). Every pool's index 0 is the
 *      exact pre-widening sentence and a falsy seed selects it, so the unit
 *      callers that pass a bare `{}` config are byte-identical. Pinned by the
 *      literal pre-RR strings, not by `pool[0]` — reading the value out of the
 *      module under test would prove list == list.
 *
 *   2. EVERY ARM IS REACHABLE from a real founding state. An arm nothing can
 *      resolve to is authored prose that never ships.
 *
 *   3. EVERY VARIANT OF EVERY POOL IS REACHABLE over a real seed family. This is
 *      the shape that catches the FNV-1a low-bit parity aliasing recorded in
 *      memory (`fnv1a32(key) % 2^k` reads the input's XOR-parity and can kill half
 *      a pool). A share/uniformity assertion passes happily on a half-dead pool;
 *      only per-member reachability reds. It carries its own NEGATIVE CONTROL: the
 *      same seed family run against a deliberately power-of-two pool with a
 *      degenerate key, proving the assertion can fail.
 *
 *   4. THE SELECTION IS DRAW-FREE. If it cost even one roll, every downstream draw
 *      in the settlement would shift and the golden re-record's "prose-selection-
 *      only" claim would be false. Pinned with a counting rng.
 *
 * The last block boots the REAL pipeline: a pin that only ever saw the pool module
 * would prove the arithmetic while saying nothing about what generation emits.
 */
import { afterEach, describe, expect, test } from 'vitest';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { fnv1a32 } from '../../src/kernel/proseHash.js';
import {
  ORIGIN_POOLS,
  ORIGIN_ARMS,
  CHANNELS_TOKEN,
  originArmKey,
  originVariantKey,
  selectOriginBody,
} from '../../src/generators/narrative/settlementOriginProse.js';
import { generateSettlementReason } from '../../src/generators/narrativeGenerator.js';
import { createGenerationWorldLaw } from '../../src/generators/generationContext.js';
import { gen } from '../simulation/simHelpers.js';

afterEach(() => clearActiveRng());

/** The pre-RR sentence of every arm, transcribed from narrativeGenerator.js at
 *  0ab5e03e. Independent of the module under test on purpose (law 1). */
const PRE_RR_BODY = {
  road: 'Established along a road route — trade flows in, goods flow out, people pass through.',
  crossroads: 'Positioned at a major crossroads — trade flows through here by geography, not by choice.',
  river: 'Built along the river — water access shapes every economic decision.',
  'port.generic': 'A port settlement whose wharves and navigable water define its trade.',
  'port.riverside': 'A river port built around navigable inland water; barges, wharves, and seasonal river traffic shape its economy.',
  'port.coastal': 'A coastal seaport whose existence is inseparable from the sea.',
  'isolated.sustained': 'Isolated from major trade routes. Self-sufficiency is not an aspiration here; it is a constraint.',
  'isolated.deficit': `Isolated from major trade routes. The settlement cannot fully feed itself; what the land does not give arrives expensively — through ${CHANNELS_TOKEN} — or not at all.`,
};

/** A founding state that resolves to each arm. */
const STATE_FOR_ARM = {
  road: { route: 'road' },
  crossroads: { route: 'crossroads' },
  river: { route: 'river' },
  'port.generic': { route: 'port', terrainType: 'plains' },
  'port.riverside': { route: 'port', terrainType: 'riverside' },
  'port.coastal': { route: 'port', terrainType: 'coastal' },
  'isolated.sustained': { route: 'isolated', hasFoodDeficit: false },
  'isolated.deficit': { route: 'isolated', hasFoodDeficit: true },
};

describe('RR law 1 — canonical-at-zero: no seedless caller moved', () => {
  test('pin:index-0 — every pool opens on the exact pre-RR sentence', () => {
    expect(Object.keys(PRE_RR_BODY).sort()).toEqual([...ORIGIN_ARMS].sort());
    for (const arm of ORIGIN_ARMS) {
      expect(ORIGIN_POOLS[arm][0], `${arm} index 0`).toBe(PRE_RR_BODY[arm]);
    }
  });

  test('pin:seedless — a state with no seed selects index 0 on every arm', () => {
    for (const arm of ORIGIN_ARMS) {
      const expected = PRE_RR_BODY[arm].split(CHANNELS_TOKEN).join('CH');
      expect(
        selectOriginBody({ ...STATE_FOR_ARM[arm], supportChannels: 'CH' }),
        `${arm} with no seed`,
      ).toBe(expected);
      // …and an empty / whitespace seed is falsy for this purpose too.
      expect(selectOriginBody({ ...STATE_FOR_ARM[arm], supportChannels: 'CH', seed: '   ' })).toBe(expected);
    }
  });

  test('pin:key-null — originVariantKey returns null exactly when there is no usable seed', () => {
    expect(originVariantKey({ seed: null, arm: 'road' })).toBeNull();
    expect(originVariantKey({ seed: '', arm: 'road' })).toBeNull();
    expect(originVariantKey({ seed: '  ', arm: 'road' })).toBeNull();
    // Guard-the-guard: a real seed must produce a non-empty key, or the assertions
    // above would be measuring a selector that is null for everything.
    expect(originVariantKey({ seed: 'abc', arm: 'road' })).toMatch(/^abc::settlement-origin::road::/);
  });
});

describe('RR law 2 — every arm is reachable from a real founding state', () => {
  test('pin:arm-reachability — originArmKey resolves to each of the eight arms', () => {
    const reached = new Set(ORIGIN_ARMS.map((arm) => originArmKey(STATE_FOR_ARM[arm])));
    expect([...reached].sort()).toEqual([...ORIGIN_ARMS].sort());
  });

  test('pin:arm-mapping — each state resolves to ITS OWN arm, not merely to some arm', () => {
    for (const arm of ORIGIN_ARMS) {
      expect(originArmKey(STATE_FOR_ARM[arm]), `state for ${arm}`).toBe(arm);
    }
  });

  test('pin:road-default — unknown and absent routes fall to the road arm (the pre-RR else branch)', () => {
    for (const route of ['road', 'mountain_pass', 'none', undefined, 'not_a_route']) {
      expect(originArmKey({ route })).toBe('road');
    }
  });
});

/** A REAL seed family: the shape a realm mints, one varying token used ONCE. */
const SEED_FAMILY = Array.from({ length: 400 }, (_, i) => `rr-origin-seed-${i}`);

describe('RR law 3 — every variant of every pool is reachable', () => {
  test('pin:no-power-of-two-pool — pool length may never be a power of two', () => {
    // pickVariant selects with fnv1a32(key) % pool.length. FNV-1a's bit 0 is the
    // input's XOR-parity, so a power-of-two modulus reads the weak low bits and a
    // seed family that holds the parity constant loses half the pool. Structural
    // ban, so a future author cannot reintroduce the habitat.
    for (const arm of ORIGIN_ARMS) {
      const n = ORIGIN_POOLS[arm].length;
      expect(n, `${arm} pool length`).toBeGreaterThan(1);
      expect((n & (n - 1)) !== 0, `${arm} pool length ${n} is a power of two`).toBe(true);
    }
  });

  test('pin:corpus-size-totality — EIGHT arms, FIVE variants each, exactly', () => {
    // THE SHAPE THE RECORD ASSERTED IN PROSE AND NOTHING ASSERTED IN CODE.
    // The lane RR shift record narrated the corpus size (and got it wrong: it
    // said 45 for 8 x 5). A narrated count decays; this is its structural heir.
    //
    // WHY THE SIBLING PIN ABOVE CANNOT DO THIS JOB: `pin:no-power-of-two-pool`
    // asks only `n > 1 && n is not a power of two`. THREE satisfies both. A
    // pool quietly shrinking 5 -> 3 — an author trimming variants they thought
    // weak, a bad merge dropping two lines — passes it, passes
    // `pin:variant-reachability` (all three remaining members are reachable),
    // and passes `pin:channels-token`. Only the ROAD arm has an independent
    // witness, in `pin:corpus-diversity`'s exact `toBe(5)`; the other seven
    // arms had no size guard at all.
    //
    // EXACT EQUALITY BOTH WAYS, deliberately: this is a corpus contract, not a
    // floor. Adding a ninth arm or a sixth variant is a widening of authored
    // content that moves the golden, so it must arrive with a re-record and a
    // shift-record row — and reading this red is how an author learns that.
    expect(ORIGIN_ARMS.length, 'the arm count left 8').toBe(8);
    expect(Object.keys(ORIGIN_POOLS).length, 'ORIGIN_ARMS and ORIGIN_POOLS disagree').toBe(8);
    const sizes = Object.fromEntries(ORIGIN_ARMS.map((arm) => [arm, ORIGIN_POOLS[arm].length]));
    const offSize = Object.entries(sizes).filter(([, n]) => n !== 5);
    expect(
      offSize,
      `every arm must hold exactly five variants; these do not: ${JSON.stringify(offSize)}`,
    ).toEqual([]);
    // …and the total is the product, stated so the ledger's arithmetic is
    // checkable at a glance rather than trusted.
    const bodies = Object.values(ORIGIN_POOLS).flat();
    expect(bodies.length, '8 arms x 5 variants = 40 authored bodies').toBe(40);
    // NON-INFLATION: 40 SLOTS is not 40 BODIES if two arms share a sentence.
    // The recorded corpus size is a claim about distinct authored prose.
    expect(new Set(bodies).size, 'two arms ship the same authored body').toBe(40);
  });

  test('pin:variant-reachability — the seed family reaches EVERY member of EVERY pool', () => {
    for (const arm of ORIGIN_ARMS) {
      const seen = new Set();
      for (const seed of SEED_FAMILY) {
        seen.add(selectOriginBody({ ...STATE_FOR_ARM[arm], supportChannels: 'CH', seed }));
      }
      const expected = ORIGIN_POOLS[arm].map((b) => b.split(CHANNELS_TOKEN).join('CH'));
      const missing = expected.filter((b) => !seen.has(b));
      expect(missing, `${arm}: ${missing.length} of ${expected.length} variants unreachable`).toEqual([]);
    }
  });

  test('pin:variant-reachability NEGATIVE CONTROL — the assertion above can fail', () => {
    // The degenerate family from the recorded aliasing incident: the varying token
    // appears TWICE, so its parity cancels, and `% 8` then reaches only the odd
    // residues. If this control ever went green, the reachability pin above would
    // be proving nothing.
    const POOL8 = ['v0', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7'];
    const seen = new Set();
    for (let i = 0; i < 400; i += 1) seen.add(POOL8[fnv1a32(`evt${i}::applied::evt${i}`) % 8]);
    expect(seen.size, 'the degenerate family must NOT reach all eight').toBeLessThan(8);
  });

  test('pin:founding-state-is-live — terrain, deficit and resources each change the key', () => {
    const base = { seed: 'rr-key', arm: 'road' };
    const k = (o) => originVariantKey({ ...base, ...o });
    expect(k({ terrainType: 'plains' })).not.toBe(k({ terrainType: 'mountain' }));
    expect(k({ hasFoodDeficit: false })).not.toBe(k({ hasFoodDeficit: true }));
    expect(k({ specialResources: ['iron'] })).not.toBe(k({ specialResources: ['silver'] }));
    // …and the resource list is order-insensitive, so a reordered config cannot
    // silently reroll a settlement's origin.
    expect(k({ specialResources: ['iron', 'silver'] })).toBe(k({ specialResources: ['silver', 'iron'] }));
  });

  test('pin:channels-token — only the isolated-deficit pool splices support channels', () => {
    for (const arm of ORIGIN_ARMS) {
      const carries = ORIGIN_POOLS[arm].filter((b) => b.includes(CHANNELS_TOKEN)).length;
      expect(carries, `${arm} variants carrying the token`).toBe(arm === 'isolated.deficit' ? ORIGIN_POOLS[arm].length : 0);
    }
    // No selected body may ever ship the raw token to a reader.
    for (const arm of ORIGIN_ARMS) {
      for (const seed of SEED_FAMILY.slice(0, 40)) {
        const body = selectOriginBody({ ...STATE_FOR_ARM[arm], supportChannels: 'sanctioned caravans', seed });
        expect(body).not.toContain(CHANNELS_TOKEN);
      }
    }
  });

  test('pin:channels-close — a variant that continues past the splice closes the list VISIBLY', () => {
    // THE DEFECT THIS EXISTS FOR, shipped and measured: `{channels}` splices a
    // LIST ("magical transport, sanctioned caravans, seasonal access, or
    // patronage"), and a variant that continued with a bare comma had its own
    // continuation swallowed by that list —
    //   "…or patronage, at a price the settlement feels."
    // reads as a FIFTH channel called "at a price". The list's end was
    // invisible. Repaired 2026-08-03 (lane MD) with an em-dash, under the RR
    // window's disclosed one-body amendment.
    //
    // PHRASE vs CLAUSE is the real rule, and it is why this pin is an
    // allowlist rather than a comma ban. A bare comma is FINE when what follows
    // is an independent clause — index 4's "…or patronage, and the arrangement
    // is renegotiated every season." cannot be misread as a list item, because
    // "and the arrangement is renegotiated" is a finite clause, not a noun
    // phrase. It is NOT fine when what follows is a phrase, which is exactly
    // the shape that shipped. So: an em-dash, a terminator, or a coordinating
    // conjunction that opens a clause.
    const CLOSES_THE_LIST = /^\s*(?:—|[.;:]|,\s*(?:and|but|so|yet)\s)/;
    const offenders = [];
    for (const arm of ORIGIN_ARMS) {
      for (const body of ORIGIN_POOLS[arm]) {
        const after = body.split(CHANNELS_TOKEN).slice(1).join(CHANNELS_TOKEN);
        if (!after.trim()) continue; // the token ends the sentence: nothing to close
        if (!CLOSES_THE_LIST.test(after)) offenders.push(`${arm}: …${CHANNELS_TOKEN}${after}`);
      }
    }
    expect(
      offenders,
      'a splice continuation that a reader will absorb into the channel list:\n'
      + `${offenders.join('\n')}\nClose it with an em-dash or a terminator.`,
    ).toEqual([]);

    // NEGATIVE CONTROL — the exact sentence that shipped must FAIL this rule,
    // or the pin is decoration. Without it, a regex that accepted everything
    // would satisfy the loop above perfectly.
    const SHIPPED = ', at a price the settlement feels.';
    expect(CLOSES_THE_LIST.test(SHIPPED), 'the pin no longer refuses the defect it was written for').toBe(false);
    // …and SPECIFICITY: the legitimate clause coordination still passes, so the
    // repair is "make the list's end visible", not "ban commas".
    expect(CLOSES_THE_LIST.test(', and the arrangement is renegotiated every season.')).toBe(true);
    expect(CLOSES_THE_LIST.test(' — at a price the settlement feels.')).toBe(true);
    // LIVENESS: the loop must actually have examined continuations.
    const examined = ORIGIN_POOLS['isolated.deficit']
      .filter((b) => b.split(CHANNELS_TOKEN).slice(1).join('').trim()).length;
    expect(examined, 'no variant continues past the token — the loop asserted nothing').toBeGreaterThanOrEqual(5);
  });
});

describe('RR law 5 — every authored variant obeys the generation world law', () => {
  // THE DEFECT THIS EXISTS FOR, recorded because it actually happened in this
  // lane: two first-draft `port.riverside` variants said "sea traffic" and
  // "instead of a tide". An inland river port has NO maritime capability, so the
  // coherence auditor raised "Maritime claim without coastal or ocean-going
  // capability." and the whole dossier fell to needs_review —
  // tests/generators/generationWorldLaw.test.js went red on a settlement that had
  // nothing wrong with it except one sentence. Authored prose is CONTENT, and
  // content in this estate is bound by the same world law as everything else.
  //
  // The pin runs the REAL predicate (`createGenerationWorldLaw(...).allows-
  // MaritimeClaim`) with each arm's own config, so it cannot drift from what
  // generation enforces, and it walks every variant of every pool.

  /** The config each arm is generated under, so the world law is the arm's own. */
  const CONFIG_FOR_ARM = {
    road: { tradeRouteAccess: 'road', terrainType: 'plains' },
    crossroads: { tradeRouteAccess: 'crossroads', terrainType: 'plains' },
    river: { tradeRouteAccess: 'river', terrainType: 'riverside' },
    'port.generic': { tradeRouteAccess: 'port', terrainType: 'plains' },
    'port.riverside': { tradeRouteAccess: 'port', terrainType: 'riverside' },
    'port.coastal': { tradeRouteAccess: 'port', terrainType: 'coastal' },
    'isolated.sustained': { tradeRouteAccess: 'isolated', terrainType: 'forest' },
    'isolated.deficit': { tradeRouteAccess: 'isolated', terrainType: 'forest' },
  };

  test('pin:world-law-maritime — no variant claims a capability its arm lacks', () => {
    const offenders = [];
    for (const arm of ORIGIN_ARMS) {
      const cfg = CONFIG_FOR_ARM[arm];
      const law = createGenerationWorldLaw(cfg, {
        tradeRoute: cfg.tradeRouteAccess,
        terrainType: cfg.terrainType,
      });
      for (const raw of ORIGIN_POOLS[arm]) {
        const body = raw.split(CHANNELS_TOKEN).join('sanctioned caravans, seasonal access');
        if (!law.allowsMaritimeClaim(body)) offenders.push(`${arm}: ${body}`);
      }
    }
    expect(offenders, `variants making an unsupported maritime claim:\n${offenders.join('\n')}`).toEqual([]);
  });

  test('pin:world-law-maritime NEGATIVE CONTROL — the predicate really does bite', () => {
    // If the river-port law accepted everything, the pin above would be vacuous.
    const cfg = CONFIG_FOR_ARM['port.riverside'];
    const law = createGenerationWorldLaw(cfg, { tradeRoute: cfg.tradeRouteAccess, terrainType: cfg.terrainType });
    // The exact sentence this lane shipped in its first draft and had to withdraw.
    expect(law.allowsMaritimeClaim(
      'An inland river port — barge traffic rather than sea traffic, and a season that closes when the channel does.',
    )).toBe(false);
    // …and the coastal arm's law, which genuinely HAS the capability, accepts the
    // pre-existing seaport sentence. Same predicate, opposite verdict: the pin is
    // measuring capability, not banning a word.
    const coastal = CONFIG_FOR_ARM['port.coastal'];
    const coastalLaw = createGenerationWorldLaw(coastal, { tradeRoute: coastal.tradeRouteAccess, terrainType: coastal.terrainType });
    expect(coastalLaw.allowsMaritimeClaim(ORIGIN_POOLS['port.coastal'][0])).toBe(true);
  });

  test('pin:river-port-token — every river-port variant reads as an inland river port', () => {
    // The dossier audit in tests/generators/generationWorldLaw.test.js asserts
    // `settlementReason` matches /river port|barges/i for a riverside port. Two
    // first-draft variants ("an inland port…", "…a loaded barge…") satisfied no
    // spelling of that and would have reddened it on whichever seed selected them.
    for (const body of ORIGIN_POOLS['port.riverside']) {
      expect(body, `river-port variant lacks a river-port token: ${body}`).toMatch(/river port|barges/i);
    }
  });
});

describe('RR law 4 — the selection is draw-free', () => {
  test('pin:roll-budget — generateSettlementReason spends ZERO rolls, seeded or not', () => {
    const counting = () => {
      const prng = createPRNG('rr-budget');
      const state = { rolls: 0 };
      setActiveRng({ random: () => { state.rolls += 1; return prng.random(); } });
      return state;
    };
    for (const cfg of [{}, { _seed: 'rr-budget-seed', terrainType: 'mountain', specialResources: ['iron'] }]) {
      const state = counting();
      generateSettlementReason('town', 'road', null, cfg, { dailyNeed: 100, rawDeficit: 40 });
      expect(state.rolls, `rolls for config ${JSON.stringify(cfg)}`).toBe(0);
      clearActiveRng();
    }
  });
});

describe('RR — the REAL pipeline, not only the pool module', () => {
  const CORPUS = Array.from({ length: 60 }, (_, i) => `rr-corpus-${i}`);
  const originOf = (s) => (Array.isArray(s.settlementReason) ? s.settlementReason[0] : s.settlementReason);
  const DEFAULT_CFG = {
    settType: 'town', culture: 'germanic', terrainOverride: 'plains',
    tradeRouteAccess: 'road', monsterThreat: 'civilized',
  };

  test('pin:corpus-diversity — 60 seeds on the DEFAULT config no longer print ONE body', () => {
    const bodies = new Set(CORPUS.map((seed) => originOf(gen(DEFAULT_CFG, seed))));
    // PT2-5 measured exactly 1 here. Anything above 1 is the cure; the road pool
    // holds five, and the whole pool must be reachable through the pipeline.
    expect(bodies.size, `distinct origin bodies over ${CORPUS.length} default-config seeds`).toBe(5);
    for (const b of bodies) expect(ORIGIN_POOLS.road).toContain(b);
  });

  test('pin:per-settlement-identity — two settlements on the same route+terrain differ', () => {
    const a = originOf(gen(DEFAULT_CFG, 'rr-twin-a'));
    const b = originOf(gen(DEFAULT_CFG, 'rr-twin-b'));
    // Both are road-arm bodies (same route, same terrain) …
    expect(ORIGIN_POOLS.road).toContain(a);
    expect(ORIGIN_POOLS.road).toContain(b);
    // … and the rung nevertheless carries identity, which is what PT2-5 said it
    // could not. (These two seeds are pinned because they DO differ; the corpus
    // pin above proves the effect is not a lucky pair.)
    expect(a).not.toBe(b);
  });

  test('pin:seed-stability — the same seed yields the same origin every time', () => {
    const once = originOf(gen(DEFAULT_CFG, 'rr-stable'));
    const twice = originOf(gen(DEFAULT_CFG, 'rr-stable'));
    expect(twice).toBe(once);
  });

  test('pin:coherent-through-the-auditor — no arm raises a settlementReason finding', () => {
    // The unit pin above proves the world-law PREDICATE accepts every variant.
    // This proves the same thing through the machine that actually runs it: the
    // full pipeline's generationCoherenceReceipt, over every arm. The two are not
    // redundant — the port×riverside arm that failed in this lane has NO ROW in
    // the 525-key golden corpus (its riverside rows take the `river` route and its
    // port rows take coastal terrain), so the golden could not have caught it and
    // did not. Deliberately recorded rather than fixed here: widening the golden
    // corpus is a golden ADDITION, which is owner-signed (precedent aa33eba5).
    const ARM_CONFIGS = [
      ['road', { tradeRouteAccess: 'road', terrainOverride: 'plains' }],
      ['crossroads', { tradeRouteAccess: 'crossroads', terrainOverride: 'plains' }],
      ['river', { tradeRouteAccess: 'river', terrainOverride: 'riverside' }],
      ['port.generic', { tradeRouteAccess: 'port', terrainOverride: 'plains' }],
      ['port.riverside', { tradeRouteAccess: 'port', terrainOverride: 'riverside' }],
      ['port.coastal', { tradeRouteAccess: 'port', terrainOverride: 'coastal' }],
      ['isolated', { tradeRouteAccess: 'isolated', terrainOverride: 'forest' }],
      ['isolated-nomagic', { tradeRouteAccess: 'isolated', terrainOverride: 'mountain', magicExists: false }],
    ];
    const findings = [];
    const bodies = new Set();
    let generated = 0;
    for (const [arm, cfg] of ARM_CONFIGS) {
      for (const tier of ['village', 'city']) {
        for (let i = 0; i < 6; i += 1) {
          const s = gen({ settType: tier, culture: 'germanic', monsterThreat: 'civilized', ...cfg }, `rr-coh-${arm}-${tier}-${i}`);
          generated += 1;
          bodies.add(originOf(s));
          for (const check of s.generationCoherenceReceipt?.checks || []) {
            for (const f of check.findings || []) {
              if (String(f.path || '').startsWith('settlementReason')) {
                findings.push(`${arm}/${tier}/${i} [${check.id}] ${f.detail} :: ${f.evidence}`);
              }
            }
          }
        }
      }
    }
    expect(findings, `settlementReason coherence findings:\n${findings.join('\n')}`).toEqual([]);
    // LIVENESS: a sweep that generated nothing, or that reached one body, would
    // satisfy the exclusion above while proving nothing at all.
    expect(generated).toBe(ARM_CONFIGS.length * 2 * 6);
    expect(bodies.size, 'distinct origin bodies reached by the sweep').toBeGreaterThanOrEqual(30);
  }, 120_000);
});
