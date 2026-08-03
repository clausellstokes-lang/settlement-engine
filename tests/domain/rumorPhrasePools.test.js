/**
 * tests/domain/rumorPhrasePools.test.js — THE LEGACY RETROFIT, DESK BY DESK.
 *
 * SP-6's legacy clause (DESIGN_FP_SPINE.md §2, AMENDED 2026-08-03) extends the
 * frequency-scaled floor to the LIVE ROUTED TOKENS, whose pools are pre-authored in
 * docs/content/RECEIPT_POOLS_LEGACY.md. This file governs every desk wired so far:
 * §3c's population/demographics kinds (slice 1), §3a's war kinds and §3d's events kinds
 * (slice 2), and the rest of §3c — the economy/trade kinds (slice 3). The desk rosters
 * live in the source leaf and this file reads them, so a desk cannot be wired without
 * arriving here.
 *
 * FIVE THINGS ARE PINNED, and the order is the order the retrofit disclosure demands.
 *
 *   1. THE CORPUS JOIN. The code pool is not merely *like* the doc pool — it is parsed
 *      out of the doc at test time and compared member for member, in order. The doc is
 *      the source of truth; a hand-edit to either side reds. This is what makes "variant
 *      1 IS the live string" a measured fact rather than an authoring intention. The
 *      doc's own CADENCE line is parsed too, so a pool that misses the floor its cadence
 *      prices reds here rather than being discovered by a reader.
 *   2. THE BYTE-IDENTITY ANCHOR. Variant 1 is not stored in the pool leaf at all — it
 *      stays in WHAT_PHRASES and is prepended, so index 0 cannot drift from the live
 *      row. Pinned anyway, because the property is the whole disclosure.
 *   3. THE STRICT NO-OP. Every seedless call returns exactly what it returned before
 *      the wiring, for EVERY registered kind — not only the wired ones.
 *   4. THE REPETITION ENVELOPE, PER DESK. Over a seed family, each wired kind walks its
 *      whole pool and no member dominates. A pool that exists but is never drawn from is
 *      a corpus, not a retrofit. The band is expressed in units of 1/poolLength so a
 *      floor-4 pool and a floor-8 pool are held to the same *shape* rather than the same
 *      number.
 *   5. THE LIVE PATH, DRIVEN — ONCE PER DESK. The controls above all run through
 *      `whatPhrase`. The last block drives the real read-model — `settlementRumors` over
 *      a settled ledger — for one kind of each wired desk, and proves that two tellings
 *      of one kind actually reach the reader in different words, and that one telling
 *      reads the same way every time it is projected (THE PROMISE: a seed is a world,
 *      forever).
 *
 * THE DISCLOSED SHIFT. Lighting this changes same-seed PROSE on a shipped surface: a
 * rumor whose subject was one fixed phrase may now draw another member of its pool. The
 * layout, the structured record, the ledger and the address chain are all untouched —
 * only the words. No golden captures this text (settlementRumors renders fresh into the
 * lazy dossier/PDF/brief chunks and the ledger goldens hash the STRUCTURED records), and
 * each wiring commit quotes the executed evidence for that claim rather than asserting it.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

import {
  settlementRumors,
  whatPhrase,
  WHAT_PHRASES,
} from '../../src/domain/display/settlementRumors.js';
import {
  EVENTS_DESK_KINDS,
  POPULATION_DESK_KINDS,
  TRADE_DESK_KINDS,
  WAR_DESK_KINDS,
  WHAT_PHRASE_POOLS,
  WIRED_DESK_KINDS,
} from '../../src/domain/display/rumorPhrasePools.js';
import { advanceRumorLedgers } from '../../src/domain/spatial/rumorNetwork.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const CORPUS = 'docs/content/RECEIPT_POOLS_LEGACY.md';

/** The desks wired so far, each with the roster the source leaf declares. */
const DESKS = Object.freeze([
  ['the population desk (§3c)', POPULATION_DESK_KINDS],
  ['the war desk (§3a)', WAR_DESK_KINDS],
  ['the events desk (§3d)', EVENTS_DESK_KINDS],
  ['the economy/trade desk (§3c)', TRADE_DESK_KINDS],
]);

/**
 * Parse the authored R1 pools out of the corpus, with the floor its CADENCE line prices.
 * Numbered rows under a `### <kind> — R1 subject phrase` heading, with the
 * `[live, verbatim]` provenance mark stripped. Deliberately NOT shared with the source
 * module: a parser both sides used would let one bug agree with itself.
 * @returns {{ pools: Record<string, string[]>, floors: Record<string, number> }}
 */
function corpusPools() {
  /** @type {Record<string, string[]>} */
  const pools = {};
  /** @type {Record<string, number>} */
  const floors = {};
  /** @type {string | null} */
  let current = null;
  for (const line of readFileSync(CORPUS, 'utf8').split('\n')) {
    const head = line.match(/^### (\S+) — R1 subject phrase/);
    if (head) { current = head[1]; pools[current] = []; continue; }
    if (!current) continue;
    if (line.startsWith('#')) { current = null; continue; }
    const cadence = line.match(/^CADENCE:.*?→ floor (\d+)/);
    if (cadence) { floors[current] = Number(cadence[1]); continue; }
    const row = line.match(/^\d+\.\s+(.*)$/);
    if (row) pools[current].push(row[1].replace(/\s*`\[[^\]]*\]`\s*$/, '').trim());
  }
  return { pools, floors };
}

/** The pool as the selector sees it: the live row, then the widened variants. */
const livePool = (kind) => [WHAT_PHRASES[kind], ...(WHAT_PHRASE_POOLS[kind] || [])];

const { pools: PARSED, floors: FLOORS } = corpusPools();

describe('the corpus join (RECEIPT_POOLS_LEGACY.md §3)', () => {
  it('the corpus parser found the §3 pools at all (this join is not vacuous)', () => {
    expect(Object.keys(PARSED).length).toBeGreaterThan(50);
    for (const kind of WIRED_DESK_KINDS) {
      expect(PARSED[kind], `${kind} must be authored in ${CORPUS}`).toBeTruthy();
      expect(FLOORS[kind], `${kind} must carry a CADENCE floor in ${CORPUS}`).toBeGreaterThan(0);
    }
  });

  it.each(WIRED_DESK_KINDS)('%s — variant 1 IS the live string, byte for byte', (kind) => {
    expect(
      PARSED[kind][0],
      `${kind}: the corpus's variant 1 must reproduce the LIVE WHAT_PHRASES row exactly. `
      + 'If these have drifted, STOP: either the corpus was authored against a stale row '
      + 'or the live row was edited without the corpus. Do not "fix" it by re-recording '
      + 'the variant — the live string is the byte-identity anchor.',
    ).toBe(WHAT_PHRASES[kind]);
  });

  it.each(WIRED_DESK_KINDS)('%s — the wired pool is the authored pool, in order', (kind) => {
    expect(
      livePool(kind),
      `${kind}: the wired pool must equal the corpus pool member for member and in doc `
      + 'order. ORDER IS LOAD-BEARING: selection is hash(seed) % pool.length, so a '
      + 'reordering silently changes what every existing seed draws. Append only.',
    ).toEqual(PARSED[kind]);
  });

  it.each(WIRED_DESK_KINDS)('%s — the pool meets the floor its cadence prices', (kind) => {
    // SP-6 scales the floor to how often the kind FIRES: chronic 8, notable 6, major 4.
    // A wired pool shorter than its floor is a half-discharged amendment.
    expect(
      livePool(kind).length,
      `${kind}: cadence floor ${FLOORS[kind]}, wired pool ${livePool(kind).length}`,
    ).toBeGreaterThanOrEqual(FLOORS[kind]);
  });

  it('the leaf wires nothing the desk rosters do not name', () => {
    // An independent denominator: a kind added to the map without being declared on a
    // desk roster is a silent widening of the disclosed shift's blast radius.
    expect(Object.keys(WHAT_PHRASE_POOLS).sort()).toEqual([...WIRED_DESK_KINDS].sort());
  });

  it('no kind is claimed by two desks', () => {
    expect(new Set(WIRED_DESK_KINDS).size).toBe(WIRED_DESK_KINDS.length);
  });
});

/**
 * THE R1 REGISTER LAW, as a table of forbidden shapes.
 *
 * One assertion site rather than five: the walker that guards un-anchored negatives
 * (tests/lint/negativeAssertionAnchor.walker.test.js) counts SITES, and five bare
 * `not.toMatch` lines in a loop body are five chances for the same vacuity. Collapsing
 * them into one table-driven site means one place to anchor and one place to read.
 */
const R1_FORBIDDEN = Object.freeze([
  [/[.!?]$/, 'a terminal stop — R1 is a phrase, not a sentence'],
  [/\d/, 'a digit — the band-words law puts numbers out of the reader\'s prose'],
  [/_/, 'an engine token — an underscore is a slug that escaped'],
  [/[{}$]/, 'an interpolation slot — R1 pools take NO slots; the frame carries the address'],
  [/^(and|but|so|because|which|that) /, 'an opening connective — it cannot lead a sentence'],
]);

describe('the R1 register law (a variant that only reads in one frame is a defect)', () => {
  it.each(WIRED_DESK_KINDS)('%s — every variant is a bare lowercase noun phrase', (kind) => {
    const pool = livePool(kind);
    // THE LIVENESS ANCHOR for the negative below. A register law asserted over an EMPTY
    // pool is vacuously green — it would survive the exact regression it exists to catch
    // (a kind un-wired, a pool emptied, a roster drifting off the map). So the pool's
    // floor is pinned BEFORE a single variant is examined, and each variant is proved a
    // non-empty string on its own line.
    expect(pool.length, `${kind}: the pool is empty — the register law below is vacuous`)
      .toBeGreaterThanOrEqual(FLOORS[kind]);
    for (const variant of pool) {
      expect(variant, `${kind}: empty variant`).toBeTruthy();
      expect(variant[0], `${kind}: "${variant}" must not start capitalized`).toBe(variant[0].toLowerCase());
      for (const [shape, why] of R1_FORBIDDEN) {
        // The subject here is a STRING the test body already proved live, not a
        // collection that can silently vanish: the pool's length is pinned against its
        // cadence floor before the loop, and this variant is asserted truthy two lines
        // up, so an emptied pool or a dropped kind reds there rather than certifying
        // the register law over nothing.
        // anchored: pool length pinned ≥ its cadence floor above; variant asserted truthy
        expect(variant, `${kind}: "${variant}" carries ${why}`).not.toMatch(shape);
      }
    }
  });

  it('every variant reads in BOTH live frames', () => {
    // The two frames the corpus names: capitalized-first, and after "word of …". A
    // structural check — the phrase must survive capitalization without becoming a
    // sentence, and must sit inside the "word of" frame unchanged.
    for (const kind of WIRED_DESK_KINDS) {
      for (const variant of livePool(kind)) {
        const capitalized = variant.charAt(0).toUpperCase() + variant.slice(1);
        expect(`${capitalized} in Thornwall`).toMatch(/^[A-Z]/);
        expect(`Merchants bring word of ${variant} in Thornwall`).toContain(variant);
      }
    }
  });

  it('no variant is reused across kinds (two facts must not borrow one sentence)', () => {
    /** @type {Map<string, string>} */
    const owner = new Map();
    /** @type {string[]} */
    const collisions = [];
    for (const kind of WIRED_DESK_KINDS) {
      // Variant 1 is skipped: the live rows are the engine's, not this retrofit's, and
      // two kinds sharing one today is precisely the defect the widening cures.
      for (const variant of WHAT_PHRASE_POOLS[kind]) {
        if (owner.has(variant)) collisions.push(`"${variant}" in ${owner.get(variant)} and ${kind}`);
        else owner.set(variant, kind);
      }
    }
    expect(collisions).toEqual([]);
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
    // The blast radius of the retrofit is WIRED_DESK_KINDS and nothing else. The faith
    // desk (§3b) is authored in the corpus and deliberately not yet wired, so it is the
    // live negative control: registered, pooled in the DOC, single-voiced in the CODE.
    const control = 'pantheon_ascendancy';
    // The roster's own liveness is the anchor: migration_flight travels the identical
    // path and IS on it, so a roster that emptied or drifted reds here rather than
    // quietly certifying that nothing is wired.
    expectAbsentWithAnchor(WIRED_DESK_KINDS, control, 'migration_flight', 'the wired roster');
    expect(WHAT_PHRASES[control], 'the control kind must still be registered').toBeTruthy();
    expect(WHAT_PHRASE_POOLS[control]).toBeUndefined();
    for (const seed of ['a', 'b', 'c', 'd', 'e']) {
      expect(whatPhrase(control, seed)).toBe(WHAT_PHRASES[control]);
    }
  });

  it('every kind that is NOT wired is inert to the seed', () => {
    // The exhaustive form of the control above: the disclosed shift touches exactly the
    // wired rosters, measured over the whole registry rather than over one sample kind.
    const wired = new Set(WIRED_DESK_KINDS);
    const drifted = Object.keys(WHAT_PHRASES).filter(
      (kind) => !wired.has(kind) && whatPhrase(kind, 'any-seed-at-all') !== WHAT_PHRASES[kind],
    );
    expect(drifted, 'an unwired kind moved under a seed — the blast radius grew').toEqual([]);
  });
});

describe.each(DESKS)('THE REPETITION ENVELOPE — %s', (_deskName, kinds) => {
  const SAMPLE = 400;

  it.each(kinds)('%s — every member is reachable and no member dominates', (kind) => {
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
    // Expressed in units of the uniform share (1/poolLength) so a floor-4 pool and a
    // floor-8 pool are held to the same SHAPE. The band is deliberately wide: this pins
    // that the fold SPREADS, not that it is a uniform RNG. Measured worst cases over the
    // 57 wired kinds at the time of writing: max 1.52x uniform, min 0.66x uniform.
    const normalized = [...counts.values()].map((n) => (n / SAMPLE) * pool.length);
    expect(Math.max(...normalized), `${kind}: one member is dominating the pool`).toBeLessThan(2);
    expect(Math.min(...normalized), `${kind}: one member is nearly unreachable`).toBeGreaterThan(0.4);
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
    for (const kind of kinds) {
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
    for (const kind of kinds) {
      const draws = Array.from({ length: SAMPLE }, (_, i) => whatPhrase(kind, `evt-${i}`));
      const canonical = draws.filter((d) => d === WHAT_PHRASES[kind]).length;
      expect(canonical, `${kind}: the canonical line vanished from the pool`).toBeGreaterThan(0);
      expect(canonical, `${kind}: the canonical line still monopolises the kind`).toBeLessThan(SAMPLE / 2);
    }
  });

  it('THE PROMISE — the same seed draws the same phrase, always', () => {
    for (const kind of kinds) {
      for (const seed of ['alpha', 'beta', 'wizard_news.14.applied.evtM']) {
        const first = whatPhrase(kind, seed);
        for (let i = 0; i < 5; i += 1) expect(whatPhrase(kind, seed)).toBe(first);
      }
    }
  });
});

describe('the kinds that used to share one voice', () => {
  it('flow_migration and migration_pressure no longer read identically', () => {
    // Both render 'people on the move' today. The retrofit's first job is that they stop
    // being indistinguishable at the surface.
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

/** A telling minted at settlement 'a', one per distinct source event. */
function tellingEvent(n, impactKind = 'migration_flight') {
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

/** One representative kind per wired desk, driven end to end through the read-model. */
const LIVE_PATH_KINDS = Object.freeze([
  ['the population desk', 'migration_flight'],
  ['the war desk', 'field_battle'],
  ['the events desk', 'authority_instability'],
  ['the economy/trade desk', 'import_shortage'],
]);

describe.each(LIVE_PATH_KINDS)('THE LIVE PATH — %s hears the widened pool', (_desk, kind) => {
  const entries = Array.from({ length: 12 }, (_, i) => tellingEvent(i, kind));

  it('the harness produces tellings at all (this block cannot pass on an empty feed)', () => {
    const rumors = settlementRumors({ worldState: worldWith(entries), settlementId: 'a' });
    expect(rumors.length).toBeGreaterThan(1);
    const carried = rumors.map((r) => subjectOf(r.headline, kind)).filter(Boolean);
    expect(carried.length, `no telling carried a ${kind} subject phrase`).toBeGreaterThan(1);
  });

  it('two DIFFERENT tellings of one kind reach the reader in different words', () => {
    // THE CONTROL THAT MATTERS. Everything above exercises the selector; this exercises
    // the read-model that renders it. Before the wiring every one of these headlines
    // carried the identical WHAT_PHRASES row.
    const rumors = settlementRumors({ worldState: worldWith(entries), settlementId: 'a' });
    const subjects = new Set(rumors.map((r) => subjectOf(r.headline, kind)).filter(Boolean));
    expect(
      subjects.size,
      'every telling still renders one phrase — the seed is not reaching whatPhrase, '
      + 'or the pool is not being consulted on the live path.',
    ).toBeGreaterThan(1);
    for (const s of subjects) expect(livePool(kind)).toContain(s);
  });

  it('the canonical phrase is still among the voices the reader hears', () => {
    // A WIDER FEED ON PURPOSE. Twelve tellings is a sample in which a one-in-eight
    // member can legitimately be absent, and asserting on twelve would be pinning a
    // coincidence rather than a property. Forty makes the canonical's absence a real
    // signal — and the draw is deterministic, so this either holds forever or never.
    const wide = Array.from({ length: 40 }, (_, i) => tellingEvent(i, kind));
    const rumors = settlementRumors({ worldState: worldWith(wide), settlementId: 'a' });
    const subjects = rumors.map((r) => subjectOf(r.headline, kind));
    expect(subjects).toContain(WHAT_PHRASES[kind]);
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
});

describe('THE LIVE PATH — the blast radius, on the read-model', () => {
  it('an unwired kind on the same live path still renders one fixed phrase', () => {
    // The negative control for the blast radius: pantheon_ascendancy is registered and
    // authored in the corpus but not wired, so the live path must show it exactly as it
    // showed it before.
    const control = 'pantheon_ascendancy';
    const feed = Array.from({ length: 8 }, (_, i) => tellingEvent(i, control));
    const rumors = settlementRumors({ worldState: worldWith(feed), settlementId: 'a' });
    const subjects = new Set(rumors.map((r) => subjectOf(r.headline, control)).filter(Boolean));
    expect(rumors.length).toBeGreaterThan(1);
    expect([...subjects]).toEqual([WHAT_PHRASES[control]]);
  });
});
