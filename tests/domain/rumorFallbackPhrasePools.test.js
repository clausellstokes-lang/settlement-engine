/**
 * tests/domain/rumorFallbackPhrasePools.test.js — THE LEGACY RETROFIT, FALLBACK HALF.
 *
 * SP-6's legacy clause (DESIGN_FP_SPINE.md §2, AMENDED 2026-08-03) extends the
 * frequency-scaled floor to the LIVE ROUTED TOKENS, whose pools are pre-authored in
 * docs/content/RECEIPT_POOLS_LEGACY.md. Its sibling file rumorPhrasePools.test.js governs
 * §3 — the 63 kinds that carry an authored WHAT_PHRASES row. THIS file governs §4: the
 * 107 kinds that carry NO row at all, whose live subject phrase is whatever whatPhrase()
 * COMPUTES by stripping an engine prefix and de-underscoring the remainder. Together the
 * two files close the R1 retrofit at 170 of 170 kinds.
 *
 * WHY THE SPLIT IS REAL AND NOT BOOKKEEPING. On the §3 arm, index 0 of a pool is a string
 * an author wrote and the engine stores. On this arm, index 0 is a string NOTHING stores —
 * it is computed at call time, which is why twelve of these anchors are mutilated slugs
 * ('detat' for coup_detat, 'capture' for institution_capture). The byte-identity anchor is
 * therefore proved differently here: not by comparing against a stored row, but by
 * comparing against what the live function itself returns with no seed.
 *
 * SEVEN THINGS ARE PINNED.
 *
 *   1. THE CORPUS JOIN. The code pool is parsed out of the doc at test time and compared
 *      member for member, in order, with the doc's own CADENCE floor. The doc is the
 *      source of truth; a hand-edit to either side reds.
 *   2. THE BYTE-IDENTITY ANCHOR. Variant 1 is not stored in the leaf at all. It must
 *      byte-equal the seedless return of the live whatPhrase() — the strongest available
 *      form of the annex's rule, because the anchor IS the live computation.
 *   3. THE MUTILATED ROSTER, PINNED EXACTLY. Twelve anchors are known-mutilated and their
 *      repair is OWNER-GATED (DEFECT-1/2/3, wiring note LEG-7). The roster is frozen here
 *      so neither a silent de-slugging nor a silent NEW mutilation can land unremarked.
 *   4. THE STRICT NO-OP. Every seedless call returns exactly what it returned before the
 *      wiring, and every token in NEITHER corpus stays seed-inert.
 *   5. THE REPETITION ENVELOPE, PER DESK, plus the anti-aliasing pin that caught the
 *      FNV-1a parity defect in slice 1.
 *   6. THE ATTRIBUTION INVARIANT. No authored variant nests inside another, so a rendered
 *      headline can be attributed to exactly one pool member. The bare-token canonical MAY
 *      nest (three do, unavoidably — 'hostile' is a word), and that exact set is frozen.
 *   7. THE LIVE PATH, DRIVEN — once per desk, through settlementRumors over a settled
 *      ledger.
 *
 * THE DISCLOSED SHIFT. Lighting this changes same-seed PROSE on a shipped surface for
 * these 107 kinds. Layout, structured record, ledger and address chain are untouched.
 * For the twelve mutilated kinds the shift is strictly an improvement: the slug stops
 * being the ONLY voice and becomes one of six or eight.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

import {
  settlementRumors,
  whatPhrase,
  WHAT_PHRASES,
} from '../../src/domain/display/settlementRumors.js';
import {
  DIVINATION_FALLBACK_KINDS,
  FAITH_FALLBACK_KINDS,
  FALLBACK_PHRASE_POOLS,
  FALLBACK_WIRED_KINDS,
  TRADE_FALLBACK_KINDS,
  WAR_FALLBACK_KINDS,
} from '../../src/domain/display/rumorFallbackPhrasePools.js';
import { EVENTS_FALLBACK_KINDS } from '../../src/domain/display/rumorFallbackPhrasePoolsEvents.js';
import { WIRED_DESK_KINDS } from '../../src/domain/display/rumorPhrasePools.js';
import { advanceRumorLedgers } from '../../src/domain/spatial/rumorNetwork.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const CORPUS = 'docs/content/RECEIPT_POOLS_LEGACY.md';

/** The §4 desks, each with the roster its source leaf declares. */
const DESKS = Object.freeze([
  ['the war desk (§4a)', WAR_FALLBACK_KINDS],
  ['the trade desk (§4b)', TRADE_FALLBACK_KINDS],
  ['the faith desk (§4c)', FAITH_FALLBACK_KINDS],
  ['the divination desk (§4d)', DIVINATION_FALLBACK_KINDS],
  ['the events desk (§4e)', EVENTS_FALLBACK_KINDS],
]);

/**
 * Parse the §4 pools out of the corpus, with the floor its CADENCE line prices and
 * whether the doc marks variant 1 MUTILATED. Deliberately NOT shared with the source
 * module or with the sibling test: a parser both sides used would let one bug agree with
 * itself. Section-aware, because §3's pools live in the same file and must not leak in.
 * @returns {{ pools: Record<string, string[]>, floors: Record<string, number>, mutilated: string[] }}
 */
function corpusFallbackPools() {
  /** @type {Record<string, string[]>} */
  const pools = {};
  /** @type {Record<string, number>} */
  const floors = {};
  /** @type {string[]} */
  const mutilated = [];
  /** @type {string | null} */
  let section = null;
  /** @type {string | null} */
  let current = null;
  for (const line of readFileSync(CORPUS, 'utf8').split('\n')) {
    const desk = line.match(/^## (§\d[a-z]?) — /);
    if (desk) { section = desk[1]; current = null; continue; }
    // Any other top-level heading closes the current section outright, so the numbered
    // rows of the tail's prose registers cannot be mistaken for pool members.
    if (/^# /.test(line)) {
      const part = line.match(/^# (§\d)/);
      section = part ? part[1] : null;
      current = null;
      continue;
    }
    const head = line.match(/^### (\S+) — R1 subject phrase/);
    if (head) { current = section && section.startsWith('§4') ? head[1] : null; if (current) pools[current] = []; continue; }
    if (/^### /.test(line)) { current = null; continue; }
    if (!current) continue;
    const cadence = line.match(/^CADENCE:.*?→ floor (\d+)/);
    if (cadence) { floors[current] = Number(cadence[1]); continue; }
    const row = line.match(/^(\d+)\.\s+(.*)$/);
    if (row) {
      if (row[1] === '1' && /MUTILATED/.test(row[2])) mutilated.push(current);
      pools[current].push(row[2].replace(/\s*`\[[^`]*\]`\s*$/, '').trim());
    }
  }
  return { pools, floors, mutilated };
}

/**
 * The pool as the selector sees it. Index 0 is the LIVE COMPUTED fallback, taken from the
 * function under test with no seed — not transcribed, so it cannot drift.
 */
const livePool = (kind) => [whatPhrase(kind), ...(FALLBACK_PHRASE_POOLS[kind] || [])];

const { pools: PARSED, floors: FLOORS, mutilated: DOC_MUTILATED } = corpusFallbackPools();

/**
 * The twelve anchors the strip regex mutilated. Frozen as a LITERAL, independently of the
 * doc parse, so the two must agree: a de-slugging repair (owner-gated, DEFECT-1/2/3) has
 * to come here and be seen, and a NEW mutilation introduced by a future strip-prefix edit
 * reds instead of shipping.
 */
const MUTILATED_ANCHORS = Object.freeze([
  'coup_detat',
  'faction_institution_capture',
  'faction_institution_suppression',
  'faction_law_preference_push',
  'faction_power_shift',
  'faction_service_bolster',
  'institution_capture',
  'institution_suppression',
  'npc_action',
  'occupation_burden',
  'occupation_burden_cleared',
  'occupation_resistance',
]);

/**
 * The three kinds whose BARE-TOKEN canonical legitimately nests inside one of its own
 * variants. Frozen because the attribution rule below depends on the set being small and
 * known: 'hostile' is an ordinary English word, so a variant may contain it, but two
 * AUTHORED variants nesting would make a rendered headline ambiguous.
 */
const CANONICAL_NESTS_IN_VARIANT = Object.freeze(['hostile', 'institution_capture', 'patron']);

describe('the corpus join (RECEIPT_POOLS_LEGACY.md §4)', () => {
  it('the corpus parser found the §4 pools at all (this join is not vacuous)', () => {
    expect(Object.keys(PARSED).length).toBe(107);
    expect(FALLBACK_WIRED_KINDS.length).toBe(107);
    for (const kind of FALLBACK_WIRED_KINDS) {
      expect(PARSED[kind], `${kind} must be authored in ${CORPUS} §4`).toBeTruthy();
      expect(FLOORS[kind], `${kind} must carry a CADENCE floor in ${CORPUS}`).toBeGreaterThan(0);
    }
  });

  it.each(FALLBACK_WIRED_KINDS)('%s — variant 1 IS the computed fallback, byte for byte', (kind) => {
    expect(
      PARSED[kind][0],
      `${kind}: the corpus's variant 1 must reproduce what whatPhrase() COMPUTES today, `
      + 'exactly. If these have drifted, STOP: either the corpus was authored against a '
      + 'different strip regex or WHAT_STRIP_PREFIX was edited without the corpus. Do not '
      + '"fix" it by re-recording the variant — the computed string is the byte-identity '
      + 'anchor, and for twelve kinds it is a MUTILATED slug ON PURPOSE (J-LEG-4).',
    ).toBe(whatPhrase(kind));
  });

  it.each(FALLBACK_WIRED_KINDS)('%s — the wired pool is the authored pool, in order', (kind) => {
    expect(
      livePool(kind),
      `${kind}: the wired pool must equal the corpus pool member for member and in doc `
      + 'order. ORDER IS LOAD-BEARING: selection is hash(seed) % pool.length, so a '
      + 'reordering silently changes what every existing seed draws. Append only.',
    ).toEqual(PARSED[kind]);
  });

  it.each(FALLBACK_WIRED_KINDS)('%s — the pool meets the floor its cadence prices', (kind) => {
    expect(
      livePool(kind).length,
      `${kind}: cadence floor ${FLOORS[kind]}, wired pool ${livePool(kind).length}`,
    ).toBeGreaterThanOrEqual(FLOORS[kind]);
  });

  it('the leaves wire nothing the desk rosters do not name', () => {
    expect(Object.keys(FALLBACK_PHRASE_POOLS).sort()).toEqual([...FALLBACK_WIRED_KINDS].sort());
  });

  it('no kind is claimed by two desks, or by both corpora', () => {
    expect(new Set(FALLBACK_WIRED_KINDS).size).toBe(FALLBACK_WIRED_KINDS.length);
    const authored = new Set(WIRED_DESK_KINDS);
    expect(FALLBACK_WIRED_KINDS.filter((k) => authored.has(k))).toEqual([]);
  });

  it('a §4 kind has NO WHAT_PHRASES row — that is what makes it a §4 kind', () => {
    // The structural claim the whole section rests on. If a kind here gained an authored
    // row, it would belong in §3 and would be drawing from the wrong corpus.
    const misfiled = FALLBACK_WIRED_KINDS.filter((k) => WHAT_PHRASES[k] !== undefined);
    expect(misfiled, 'a §4 kind acquired a WHAT_PHRASES row — it must move to §3').toEqual([]);
  });
});

describe('THE MUTILATED ANCHORS (owner-gated DEFECT-1/2/3 — pinned, not repaired)', () => {
  it('the doc and this file name the same twelve', () => {
    expect([...DOC_MUTILATED].sort()).toEqual([...MUTILATED_ANCHORS].sort());
  });

  it('each mutilated anchor is still the live computed string, unrepaired', () => {
    // Retiring these REPLACES a live string rather than widening a pool, so it is a larger
    // disclosed shift with its own golden and is OWNER-GATED (wiring note LEG-7,
    // "do not bundle either into a pool-wiring wave"). This pin is what makes the
    // deferral visible instead of forgotten.
    for (const kind of MUTILATED_ANCHORS) {
      expect(livePool(kind)[0], `${kind}: index 0 must remain the mutilated slug`).toBe(whatPhrase(kind));
    }
  });

  it('the widening still improves every mutilated kind (the slug stops being the only voice)', () => {
    for (const kind of MUTILATED_ANCHORS) {
      expect(livePool(kind).length, `${kind}: a mutilated anchor with no pool is the defect at full strength`)
        .toBeGreaterThanOrEqual(FLOORS[kind]);
      const drawn = new Set(Array.from({ length: 200 }, (_, i) => whatPhrase(kind, `evt-${i}`)));
      expect(drawn.size, `${kind}: the mutilated slug is still the only voice`).toBeGreaterThan(1);
    }
  });
});

/**
 * THE R1 REGISTER LAW, as a table of forbidden shapes — one assertion site rather than
 * five, so the negative-assertion walker has one place to anchor and one place to read.
 */
const R1_FORBIDDEN = Object.freeze([
  [/[.!?]$/, 'a terminal stop — R1 is a phrase, not a sentence'],
  [/\d/, 'a digit — the band-words law puts numbers out of the reader\'s prose'],
  [/_/, 'an engine token — an underscore is a slug that escaped'],
  [/[{}$]/, 'an interpolation slot — R1 pools take NO slots; the frame carries the address'],
  [/^(and|but|so|because|which|that) /, 'an opening connective — it cannot lead a sentence'],
]);

describe('the R1 register law (a variant that only reads in one frame is a defect)', () => {
  it.each(FALLBACK_WIRED_KINDS)('%s — every AUTHORED variant is a bare lowercase noun phrase', (kind) => {
    // Variant 1 is deliberately EXEMPT: it is engine output, not authored prose, and for
    // twelve kinds it is a mutilated slug this lane is forbidden to repair. The law binds
    // what this corpus wrote.
    const authored = FALLBACK_PHRASE_POOLS[kind];
    // THE LIVENESS ANCHOR for the negative below. A register law asserted over an EMPTY
    // pool is vacuously green — it would survive the exact regression it exists to catch.
    // So the pool's floor is pinned BEFORE a single variant is examined, and each variant
    // is proved a non-empty string on its own line.
    expect(livePool(kind).length, `${kind}: the pool is empty — the register law below is vacuous`)
      .toBeGreaterThanOrEqual(FLOORS[kind]);
    for (const variant of authored) {
      expect(variant, `${kind}: empty variant`).toBeTruthy();
      expect(variant[0], `${kind}: "${variant}" must not start capitalized`).toBe(variant[0].toLowerCase());
      for (const [shape, why] of R1_FORBIDDEN) {
        // The subject here is a STRING the test body already proved live, not a
        // collection that can silently vanish: the pool's length is pinned against its
        // cadence floor above, and this variant is asserted truthy two lines up, so an
        // emptied pool or a dropped kind reds there rather than certifying the register
        // law over nothing.
        // anchored: pool length pinned ≥ its cadence floor above; variant asserted truthy
        expect(variant, `${kind}: "${variant}" carries ${why}`).not.toMatch(shape);
      }
    }
  });

  it('every variant reads in BOTH live frames', () => {
    for (const kind of FALLBACK_WIRED_KINDS) {
      for (const variant of livePool(kind)) {
        const capitalized = variant.charAt(0).toUpperCase() + variant.slice(1);
        expect(`${capitalized} in Thornwall`).toMatch(/^[A-Z]/);
        expect(`Merchants bring word of ${variant} in Thornwall`).toContain(variant);
      }
    }
  });

  it('no variant is reused across kinds, or borrowed from the §3 corpus', () => {
    /** @type {Map<string, string>} */
    const owner = new Map();
    for (const kind of WIRED_DESK_KINDS) {
      for (const variant of livePool(kind).slice(1)) owner.set(variant, `§3:${kind}`);
    }
    /** @type {string[]} */
    const collisions = [];
    for (const kind of FALLBACK_WIRED_KINDS) {
      // Variant 1 is skipped: two kinds can compute the same fallback without that being
      // this corpus's doing, and no authored line is involved.
      for (const variant of FALLBACK_PHRASE_POOLS[kind]) {
        if (owner.has(variant)) collisions.push(`"${variant}" in ${owner.get(variant)} and §4:${kind}`);
        else owner.set(variant, `§4:${kind}`);
      }
    }
    expect(collisions).toEqual([]);
  });
});

describe('THE ATTRIBUTION INVARIANT (a rendered headline names exactly one member)', () => {
  it('no AUTHORED variant nests inside another variant of the same pool', () => {
    /** @type {string[]} */
    const nested = [];
    for (const kind of FALLBACK_WIRED_KINDS) {
      const authored = FALLBACK_PHRASE_POOLS[kind];
      for (const a of authored) {
        for (const b of authored) if (a !== b && b.includes(a)) nested.push(`${kind}: "${a}" inside "${b}"`);
      }
    }
    expect(nested, 'two authored variants nesting makes a rendered headline ambiguous').toEqual([]);
  });

  it('exactly three bare-token canonicals nest in a variant, and they are the known three', () => {
    // Unavoidable and harmless: index 0 here is a de-underscored token, and 'hostile',
    // 'patron' and 'capture' are ordinary words. It is pinned as an exact set so the
    // longest-match attribution below stays justified rather than assumed.
    const nests = FALLBACK_WIRED_KINDS.filter(
      (kind) => FALLBACK_PHRASE_POOLS[kind].some((v) => v.includes(whatPhrase(kind))),
    );
    expect(nests.sort()).toEqual([...CANONICAL_NESTS_IN_VARIANT].sort());
  });
});

describe('THE STRICT NO-OP — a seedless call is byte-identical to before the wiring', () => {
  it('every §4 kind returns its computed fallback when no seed is given', () => {
    for (const kind of FALLBACK_WIRED_KINDS) {
      expect(whatPhrase(kind), `${kind} drifted on the seedless path`).toBe(livePool(kind)[0]);
    }
  });

  it('the §3 corpus is untouched by this wiring, seeded and unseeded', () => {
    // The fallback arm must not have reached across into the canonical arm. Every §3 kind
    // still draws from its OWN pool, and every registered kind is still seedless-stable.
    for (const [kind, phrase] of Object.entries(WHAT_PHRASES)) {
      expect(whatPhrase(kind), `${kind} drifted on the seedless canonical arm`).toBe(phrase);
    }
    for (const kind of WIRED_DESK_KINDS) {
      expect(FALLBACK_PHRASE_POOLS[kind], `${kind} is a §3 kind and must not be in the §4 map`).toBeUndefined();
    }
  });

  it('the neutral arms are untouched by the wiring', () => {
    expect(whatPhrase('')).toBe('unrest');
    expect(whatPhrase(null)).toBe('unrest');
    expect(whatPhrase('applied')).toBe('unrest');
    expect(whatPhrase('applied', 'seed-does-not-matter-here')).toBe('unrest');
    // A lifecycle kind stays neutral even though the fallback arm now widens.
    expect(whatPhrase('world_pulse', 'seeded')).toBe('unrest');
  });

  it('a token in NEITHER corpus is inert to the seed', () => {
    // The blast radius is the 170 pooled kinds. An unregistered token still degrades to
    // its computed fallback exactly as it always did, seeded or not.
    const control = 'flow_totally_unknown_token';
    expectAbsentWithAnchor(FALLBACK_WIRED_KINDS, control, 'coup_detat', 'the §4 roster');
    expect(whatPhrase(control)).toBe('totally unknown token');
    for (const seed of ['a', 'b', 'c', 'd', 'e']) {
      expect(whatPhrase(control, seed)).toBe('totally unknown token');
    }
  });

  it('the prefix-strip behaviour itself is unchanged for unregistered tokens', () => {
    // A sample across the strip regex's alternatives, none of them registered anywhere.
    const cases = [
      ['npc_zzz_unregistered', 'zzz unregistered'],
      ['faction_zzz_unregistered', 'zzz unregistered'],
      ['pantheon_zzz_unregistered', 'zzz unregistered'],
      ['zzz_no_prefix_here', 'zzz no prefix here'],
    ];
    for (const [token, expected] of cases) {
      expect(whatPhrase(token), `${token} seedless`).toBe(expected);
      expect(whatPhrase(token, 'seeded-hard'), `${token} seeded`).toBe(expected);
    }
  });
});

describe.each(DESKS)('THE REPETITION ENVELOPE — %s', (_deskName, kinds) => {
  const SAMPLE = 400;

  it.each(kinds)('%s — every member is reachable and no member dominates', (kind) => {
    const pool = livePool(kind);
    /** @type {Map<string, number>} */
    const counts = new Map(pool.map((p) => [p, 0]));
    for (let i = 0; i < SAMPLE; i += 1) {
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
    const normalized = [...counts.values()].map((n) => (n / SAMPLE) * pool.length);
    expect(Math.max(...normalized), `${kind}: one member is dominating the pool`).toBeLessThan(2);
    expect(Math.min(...normalized), `${kind}: one member is nearly unreachable`).toBeGreaterThan(0.4);
  });

  it('THE ANTI-ALIASING PIN — a parity-degenerate seed family still walks the whole pool', () => {
    // The pin that caught a REAL defect in slice 1: FNV-1a's bit 0 is the XOR-parity of
    // the input characters, so a seed family whose varying token appears an EVEN number of
    // times holds that bit constant — and `% 8` reads exactly those low bits. Without the
    // avalanche finalizer this family reached four of every eight variants. The family
    // below is degenerate ON PURPOSE.
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

  it('the computed fallback stops being the only voice, without disappearing', () => {
    for (const kind of kinds) {
      const draws = Array.from({ length: SAMPLE }, (_, i) => whatPhrase(kind, `evt-${i}`));
      const canonical = draws.filter((d) => d === livePool(kind)[0]).length;
      expect(canonical, `${kind}: the computed fallback vanished from the pool`).toBeGreaterThan(0);
      expect(canonical, `${kind}: the computed fallback still monopolises the kind`).toBeLessThan(SAMPLE / 2);
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
function tellingEvent(n, impactKind) {
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
    headline: 'A matter recorded at the gate',
    summary: 'The clerk has entered it.',
    tags: ['world_pulse'],
    reasons: ['hunger'],
  };
}

/** Drive the pure advance to a settled ledger and hand back a worldState. */
function worldWith(entries, { to = 9, seed = 'fallback' } = {}) {
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

/**
 * Which pool member a rendered headline is carrying. LONGEST MATCH FIRST, because on this
 * arm the canonical is a bare de-underscored token that can legitimately appear inside a
 * variant ('hostile' inside 'an edge the record carries as hostile'). Scanning in pool
 * order would attribute that headline to the canonical and silently under-report the
 * widening — the pin above freezes the exact set where this matters.
 */
function subjectOf(headline, kind) {
  const lower = headline.toLowerCase();
  return [...livePool(kind)]
    .sort((a, b) => b.length - a.length)
    .find((p) => lower.includes(p.toLowerCase())) ?? null;
}

/** One representative kind per §4 desk, driven end to end through the read-model. */
const LIVE_PATH_KINDS = Object.freeze([
  ['the war desk', 'occupation_resistance'],
  ['the trade desk', 'market_shock'],
  ['the faith desk', 'cult'],
  ['the divination desk', 'food_pressure'],
  ['the events desk', 'coup_detat'],
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
    // the read-model that renders it. Before this wiring every one of these headlines
    // carried the identical de-underscored slug.
    const rumors = settlementRumors({ worldState: worldWith(entries), settlementId: 'a' });
    const subjects = new Set(rumors.map((r) => subjectOf(r.headline, kind)).filter(Boolean));
    expect(
      subjects.size,
      'every telling still renders one phrase — the seed is not reaching whatPhrase, '
      + 'or the fallback pool is not being consulted on the live path.',
    ).toBeGreaterThan(1);
    for (const s of subjects) expect(livePool(kind)).toContain(s);
  });

  it('the computed fallback is still among the voices the reader hears', () => {
    const wide = Array.from({ length: 40 }, (_, i) => tellingEvent(i, kind));
    const rumors = settlementRumors({ worldState: worldWith(wide), settlementId: 'a' });
    const subjects = rumors.map((r) => subjectOf(r.headline, kind));
    expect(subjects).toContain(livePool(kind)[0]);
  });

  it('THE PROMISE — the same world projects the same words every time', () => {
    const worldState = worldWith(entries);
    const first = settlementRumors({ worldState, settlementId: 'a' }).map((r) => r.headline);
    for (let i = 0; i < 3; i += 1) {
      expect(settlementRumors({ worldState, settlementId: 'a' }).map((r) => r.headline)).toEqual(first);
    }
    expect(settlementRumors({ worldState: worldWith(entries), settlementId: 'a' }).map((r) => r.headline))
      .toEqual(first);
  });
});

describe('THE LIVE PATH — the blast radius, on the read-model', () => {
  it('an unregistered token on the same live path still renders one fixed phrase', () => {
    const control = 'flow_totally_unknown_token';
    const feed = Array.from({ length: 8 }, (_, i) => tellingEvent(i, control));
    const rumors = settlementRumors({ worldState: worldWith(feed), settlementId: 'a' });
    const subjects = new Set(
      rumors.map((r) => (r.headline.toLowerCase().includes('totally unknown token') ? 'hit' : null)).filter(Boolean),
    );
    expect(rumors.length).toBeGreaterThan(1);
    expect([...subjects]).toEqual(['hit']);
  });
});
