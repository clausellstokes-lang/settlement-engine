/**
 * tests/domain/rumorPhrasePools.test.js — THE LEGACY RETROFIT'S FIRST WIRING SLICE.
 *
 * SP-6's legacy clause (DESIGN_FP_SPINE.md §2, AMENDED 2026-08-03) extends the
 * frequency-scaled floor to the LIVE ROUTED TOKENS, whose pools are pre-authored in
 * docs/content/RECEIPT_POOLS_LEGACY.md. This file governs the first desk wired:
 * the population/demographics kinds of §3c.
 *
 * FIVE THINGS ARE PINNED, and the order is the order the retrofit disclosure demands.
 *
 *   1. THE CORPUS JOIN. The code pool is not merely *like* the doc pool — it is parsed
 *      out of the doc at test time and compared member for member, in order. The doc is
 *      the source of truth; a hand-edit to either side reds. This is what makes "variant
 *      1 IS the live string" a measured fact rather than an authoring intention.
 *   2. THE BYTE-IDENTITY ANCHOR. Variant 1 is not stored in the pool leaf at all — it
 *      stays in WHAT_PHRASES and is prepended, so index 0 cannot drift from the live
 *      row. Pinned anyway, because the property is the whole disclosure.
 *   3. THE STRICT NO-OP. Every seedless call returns exactly what it returned before
 *      the wiring, for EVERY registered kind — not only the four wired ones.
 *   4. THE REPETITION ENVELOPE. Over a seed family, each wired kind walks its whole
 *      pool and no member dominates. A pool that exists but is never drawn from is a
 *      corpus, not a retrofit.
 *   5. THE LIVE PATH, DRIVEN. The controls above all run through `whatPhrase`. The last
 *      block drives the real read-model — `settlementRumors` over a settled ledger —
 *      and proves that two tellings of one kind actually reach the reader in different
 *      words, and that one telling reads the same way every time it is projected
 *      (THE PROMISE: a seed is a world, forever).
 *
 * THE DISCLOSED SHIFT. Lighting this changes same-seed PROSE on a shipped surface: a
 * rumor whose subject was one fixed phrase may now draw another member of its pool. The
 * layout, the structured record, the ledger and the address chain are all untouched —
 * only the words. No golden captures this text (settlementRumors renders fresh into the
 * lazy dossier/PDF/brief chunks and the ledger goldens hash the STRUCTURED records), and
 * the wiring commit quotes the executed evidence for that claim rather than asserting it.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

import {
  settlementRumors,
  whatPhrase,
  WHAT_PHRASES,
} from '../../src/domain/display/settlementRumors.js';
import {
  POPULATION_DESK_KINDS,
  WHAT_PHRASE_POOLS,
} from '../../src/domain/display/rumorPhrasePools.js';
import { advanceRumorLedgers } from '../../src/domain/spatial/rumorNetwork.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';

const CORPUS = 'docs/content/RECEIPT_POOLS_LEGACY.md';

/**
 * Parse the authored R1 pools out of the corpus. Numbered rows under a
 * `### <kind> — R1 subject phrase` heading, with the `[live, verbatim]` provenance mark
 * stripped. Deliberately NOT shared with the source module: a parser both sides used
 * would let one bug agree with itself.
 * @returns {Record<string, string[]>}
 */
function corpusPools() {
  /** @type {Record<string, string[]>} */
  const pools = {};
  /** @type {string | null} */
  let current = null;
  for (const line of readFileSync(CORPUS, 'utf8').split('\n')) {
    const head = line.match(/^### (\S+) — R1 subject phrase/);
    if (head) { current = head[1]; pools[current] = []; continue; }
    if (!current) continue;
    if (line.startsWith('#')) { current = null; continue; }
    const row = line.match(/^\d+\.\s+(.*)$/);
    if (row) pools[current].push(row[1].replace(/\s*`\[[^\]]*\]`\s*$/, '').trim());
  }
  return pools;
}

/** The pool as the selector sees it: the live row, then the widened variants. */
const livePool = (kind) => [WHAT_PHRASES[kind], ...(WHAT_PHRASE_POOLS[kind] || [])];

describe('the population desk — the corpus join (RECEIPT_POOLS_LEGACY.md §3c)', () => {
  const parsed = corpusPools();

  it('the corpus parser found the §3 pools at all (this join is not vacuous)', () => {
    expect(Object.keys(parsed).length).toBeGreaterThan(50);
    for (const kind of POPULATION_DESK_KINDS) {
      expect(parsed[kind], `${kind} must be authored in ${CORPUS}`).toBeTruthy();
      expect(parsed[kind].length).toBeGreaterThanOrEqual(8);
    }
  });

  it.each(POPULATION_DESK_KINDS)('%s — variant 1 IS the live string, byte for byte', (kind) => {
    expect(
      parsed[kind][0],
      `${kind}: the corpus's variant 1 must reproduce the LIVE WHAT_PHRASES row exactly. `
      + 'If these have drifted, STOP: either the corpus was authored against a stale row '
      + 'or the live row was edited without the corpus. Do not "fix" it by re-recording '
      + 'the variant — the live string is the byte-identity anchor.',
    ).toBe(WHAT_PHRASES[kind]);
  });

  it.each(POPULATION_DESK_KINDS)('%s — the wired pool is the authored pool, in order', (kind) => {
    expect(
      livePool(kind),
      `${kind}: the wired pool must equal the corpus pool member for member and in doc `
      + 'order. ORDER IS LOAD-BEARING: selection is hash(seed) % pool.length, so a '
      + 'reordering silently changes what every existing seed draws. Append only.',
    ).toEqual(parsed[kind]);
  });

  it('the leaf wires nothing the desk roster does not name', () => {
    // An independent denominator: a kind added to the map without being declared is a
    // silent widening of the disclosed shift's blast radius.
    expect(Object.keys(WHAT_PHRASE_POOLS).sort()).toEqual([...POPULATION_DESK_KINDS].sort());
  });
});

describe('the R1 register law (a variant that only reads in one frame is a defect)', () => {
  it.each(POPULATION_DESK_KINDS)('%s — every variant is a bare lowercase noun phrase', (kind) => {
    for (const variant of livePool(kind)) {
      expect(variant, `${kind}: empty variant`).toBeTruthy();
      expect(variant[0], `${kind}: "${variant}" must not start capitalized`).toBe(variant[0].toLowerCase());
      expect(variant, `${kind}: "${variant}" must carry no terminal stop`).not.toMatch(/[.!?]$/);
      expect(variant, `${kind}: "${variant}" must carry no digits (the band-words law)`).not.toMatch(/\d/);
      expect(variant, `${kind}: "${variant}" must carry no engine token`).not.toMatch(/_/);
      expect(variant, `${kind}: "${variant}" must carry no interpolation slot`).not.toMatch(/[{}$]/);
    }
  });

  it('every variant reads in BOTH live frames', () => {
    // The two frames the corpus names: capitalized-first, and after "word of …". A
    // structural check — the phrase must survive capitalization without becoming a
    // sentence, and must sit inside the "word of" frame without a connective.
    for (const kind of POPULATION_DESK_KINDS) {
      for (const variant of livePool(kind)) {
        const capitalized = variant.charAt(0).toUpperCase() + variant.slice(1);
        expect(`${capitalized} in Thornwall`).toMatch(/^[A-Z]/);
        expect(`Merchants bring word of ${variant} in Thornwall`).toContain(variant);
        expect(variant, 'a variant may not open with a connective').not.toMatch(/^(and|but|so|because|which|that) /);
      }
    }
  });
});

describe('THE STRICT NO-OP — a seedless call is byte-identical to before the wiring', () => {
  it('every registered kind returns its exact WHAT_PHRASES row when no seed is given', () => {
    for (const [kind, phrase] of Object.entries(WHAT_PHRASES)) {
      expect(whatPhrase(kind), `${kind} drifted on the seedless path`).toBe(phrase);
    }
  });

  it('the fallback arms are untouched by the wiring', () => {
    expect(whatPhrase('')).toBe('unrest');
    expect(whatPhrase(null)).toBe('unrest');
    expect(whatPhrase('applied')).toBe('unrest');
    expect(whatPhrase('applied', 'seed-does-not-matter-here')).toBe('unrest');
    expect(whatPhrase('flow_totally_unknown_token')).toBe('totally unknown token');
    expect(whatPhrase('flow_totally_unknown_token', 'seeded')).toBe('totally unknown token');
  });

  it('an UNWIRED registered kind ignores the seed entirely', () => {
    // The blast radius of this slice is four kinds. Everything else must be inert to
    // the seed even though the selector now accepts one.
    expect(WHAT_PHRASE_POOLS.conquest).toBeUndefined();
    for (const seed of ['a', 'b', 'c', 'd', 'e']) {
      expect(whatPhrase('conquest', seed)).toBe(WHAT_PHRASES.conquest);
    }
  });
});

describe('THE REPETITION ENVELOPE — the pool is walked, and nothing dominates', () => {
  const SAMPLE = 400;

  it.each(POPULATION_DESK_KINDS)('%s — every member is reachable and no member dominates', (kind) => {
    const pool = livePool(kind);
    /** @type {Map<string, number>} */
    const counts = new Map(pool.map((p) => [p, 0]));
    for (let i = 0; i < SAMPLE; i += 1) {
      // The REAL seed family: an event ref whose varying part is the source event id.
      const drawn = whatPhrase(kind, `wizard_news.5.applied.evtM${i}`);
      expect(counts.has(drawn), `${kind}: drew "${drawn}", which is not in the pool`).toBe(true);
      counts.set(drawn, (counts.get(drawn) ?? 0) + 1);
    }
    const unused = [...counts].filter(([, n]) => n === 0).map(([p]) => p);
    expect(
      unused,
      `${kind}: a pool member that never draws is a corpus, not a retrofit. `
      + 'Suspect the hash key or a pool length the selector does not see.',
    ).toEqual([]);
    const share = [...counts.values()].map((n) => n / SAMPLE);
    // Uniform would be 1/8 = 0.125 over an eight-member pool. The band is deliberately
    // wide: this pins that the fold SPREADS, not that it is a uniform RNG.
    expect(Math.max(...share), `${kind}: one member is dominating the pool`).toBeLessThan(0.25);
    expect(Math.min(...share), `${kind}: one member is nearly unreachable`).toBeGreaterThan(0.04);
  });

  it('THE ANTI-ALIASING PIN — a parity-degenerate seed family still walks the whole pool', () => {
    // THIS PIN FOUND A REAL DEFECT AND IS THE RECEIPT FOR ITS CURE. FNV-1a's bit 0 is
    // the XOR-parity of the input characters, so a seed family whose varying token
    // appears an EVEN number of times holds that bit constant — and `% 8` reads exactly
    // those low bits. Written first without the avalanche finalizer, this family reached
    // residues {1,3,5,7} only: four of every eight variants were unreachable, in a
    // retrofit whose entire purpose is that all eight are heard.
    //
    // The family below is degenerate ON PURPOSE (the index appears twice). It is not the
    // shape real event refs take — the pin above measures those — but it is the shape a
    // future ref format could drift into, and this selector must not be one refactor of
    // an id scheme away from silently halving every pool in the corpus.
    for (const kind of POPULATION_DESK_KINDS) {
      const pool = livePool(kind);
      const drawn = new Set(
        Array.from({ length: SAMPLE }, (_, i) => whatPhrase(kind, `wizard_news.${i}.applied.evt${i}`)),
      );
      expect(
        pool.filter((p) => !drawn.has(p)),
        `${kind}: a parity-degenerate seed family cannot reach the whole pool — the `
        + 'avalanche finalizer in settlementRumors.js has been removed or bypassed.',
      ).toEqual([]);
    }
  });

  it('the canonical line stops being the only voice, without disappearing', () => {
    for (const kind of POPULATION_DESK_KINDS) {
      const draws = Array.from({ length: SAMPLE }, (_, i) => whatPhrase(kind, `evt-${i}`));
      const canonical = draws.filter((d) => d === WHAT_PHRASES[kind]).length;
      expect(canonical, `${kind}: the canonical line vanished from the pool`).toBeGreaterThan(0);
      expect(canonical, `${kind}: the canonical line still monopolises the kind`).toBeLessThan(SAMPLE / 2);
    }
  });

  it('THE PROMISE — the same seed draws the same phrase, always', () => {
    for (const kind of POPULATION_DESK_KINDS) {
      for (const seed of ['alpha', 'beta', 'wizard_news.14.applied.evtM']) {
        const first = whatPhrase(kind, seed);
        for (let i = 0; i < 5; i += 1) expect(whatPhrase(kind, seed)).toBe(first);
      }
    }
  });

  it('two kinds that share a live string no longer share a voice', () => {
    // flow_migration and migration_pressure both render 'people on the move' today. The
    // retrofit's first job is that they stop being indistinguishable at the surface.
    expect(WHAT_PHRASES.flow_migration).toBe(WHAT_PHRASES.migration_pressure);
    const seeds = Array.from({ length: 60 }, (_, i) => `evt-${i}`);
    const differ = seeds.filter((s) => whatPhrase('flow_migration', s) !== whatPhrase('migration_pressure', s));
    expect(differ.length, 'the two kinds still read identically at every seed').toBeGreaterThan(40);
  });
});

// ── THE LIVE PATH, DRIVEN ──────────────────────────────────────────────────

const IDS = ['a', 'b', 'c', 'd'];
const tradeChannel = (id, from, to) => ({ id, type: 'trade_route', from, to, status: 'confirmed' });
const GRAPH = { channels: [
  tradeChannel('ch.a.b', 'a', 'b'),
  tradeChannel('ch.b.c', 'b', 'c'),
  tradeChannel('ch.c.d', 'c', 'd'),
] };

function digestFor(ids = IDS) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

/** A departure telling minted at settlement 'a', one per distinct source event. */
function migrationEvent(n, impactKind = 'migration_flight') {
  return {
    id: `wizard_news.5.applied.evtM${n}`,
    tick: 5,
    significance: 'notable',
    score: 60,
    severity: 0.5,
    scope: 'local',
    kind: 'applied',
    impactKind,
    settlementIds: ['a'],
    sourceEventId: `evtM${n}`,
    headline: 'Departures recorded at the gate',
    summary: 'The town roll is shorter than it was.',
    tags: ['world_pulse'],
    reasons: ['hunger'],
  };
}

/** Drive the pure advance to a settled ledger and hand back a worldState. */
function worldWith(entries, { to = 9, seed = 'pop' } = {}) {
  const digest = digestFor();
  let ledgers = null;
  for (let tick = 5; tick <= to; tick += 1) {
    const result = advanceRumorLedgers({
      worldState: {
        simulationRules: { infoMode: 'unreliable' },
        spatialCanonVersion: 1,
        spatialDigest: digest,
        ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
      },
      feedEntries: entries,
      graph: GRAPH,
      tick,
      rng: createPRNG(`${seed}::tick:${tick}`),
    });
    if (result.changed) ledgers = result.next;
  }
  return { tick: to, spatialLedgers: { rumorLedgers: ledgers } };
}

/** Which pool member (if any) a rendered headline is carrying. */
function subjectOf(headline, kind) {
  return livePool(kind).find((p) => headline.toLowerCase().includes(p.toLowerCase())) ?? null;
}

describe('THE LIVE PATH — the reader actually hears the widened pool', () => {
  const entries = Array.from({ length: 12 }, (_, i) => migrationEvent(i));

  it('the harness produces migration tellings at all (this block cannot pass on an empty feed)', () => {
    const rumors = settlementRumors({ worldState: worldWith(entries), settlementId: 'a' });
    expect(rumors.length).toBeGreaterThan(1);
    const carried = rumors.map((r) => subjectOf(r.headline, 'migration_flight')).filter(Boolean);
    expect(carried.length, 'no telling carried a migration_flight subject phrase').toBeGreaterThan(1);
  });

  it('two DIFFERENT tellings of one kind reach the reader in different words', () => {
    // THE CONTROL THAT MATTERS. Everything above exercises the selector; this exercises
    // the read-model that renders it. Before the wiring every one of these headlines
    // carried the identical phrase 'families taking to the road'.
    const rumors = settlementRumors({ worldState: worldWith(entries), settlementId: 'a' });
    const subjects = new Set(rumors.map((r) => subjectOf(r.headline, 'migration_flight')).filter(Boolean));
    expect(
      subjects.size,
      'every telling still renders one phrase — the seed is not reaching whatPhrase, '
      + 'or the pool is not being consulted on the live path.',
    ).toBeGreaterThan(1);
    for (const s of subjects) expect(livePool('migration_flight')).toContain(s);
  });

  it('the canonical phrase is still among the voices the reader hears', () => {
    // A WIDER FEED ON PURPOSE. Twelve tellings is a sample in which a one-in-eight
    // member can legitimately be absent, and asserting on twelve would be pinning a
    // coincidence rather than a property. Forty makes the canonical's absence a real
    // signal — and the draw is deterministic, so this either holds forever or never.
    const wide = Array.from({ length: 40 }, (_, i) => migrationEvent(i));
    const rumors = settlementRumors({ worldState: worldWith(wide), settlementId: 'a' });
    const subjects = rumors.map((r) => subjectOf(r.headline, 'migration_flight'));
    expect(subjects).toContain(WHAT_PHRASES.migration_flight);
  });

  it('THE PROMISE — the same world projects the same words every time', () => {
    const worldState = worldWith(entries);
    const first = settlementRumors({ worldState, settlementId: 'a' }).map((r) => r.headline);
    for (let i = 0; i < 3; i += 1) {
      expect(settlementRumors({ worldState, settlementId: 'a' }).map((r) => r.headline)).toEqual(first);
    }
    // …and a rebuilt world of the same seed family projects the same words too, so the
    // phrase rides the telling's stable ref rather than anything about this object.
    expect(settlementRumors({ worldState: worldWith(entries), settlementId: 'a' }).map((r) => r.headline))
      .toEqual(first);
  });

  it('an unwired kind on the same live path still renders one fixed phrase', () => {
    // The negative control for the blast radius: conquest is registered but unwired, so
    // the live path must show it exactly as it showed it before.
    const conquests = Array.from({ length: 8 }, (_, i) => migrationEvent(i, 'conquest'));
    const rumors = settlementRumors({ worldState: worldWith(conquests), settlementId: 'a' });
    const subjects = new Set(rumors.map((r) => subjectOf(r.headline, 'conquest')).filter(Boolean));
    expect(rumors.length).toBeGreaterThan(1);
    expect([...subjects]).toEqual([WHAT_PHRASES.conquest]);
  });
});
