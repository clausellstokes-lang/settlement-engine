/**
 * oathHolderDormancyFence.test.js — GR-1's FOUR-FENCE dormancy set for
 * `oathHolderEnabled` (compiled charter docs/DESIGN_FP_ARCHITECTURE.md §1 L2 / §3).
 *
 * The claim this file has to make good is not "nothing happened in a world where nothing
 * was going to happen anyway" — that is the vacuous green every dormancy pin drifts
 * toward. It is the harder one: on the exact world that DOES put two names on a treaty
 * when the flag is lit, the dark run writes nothing at all. Every fence therefore runs
 * on an ADVERSARIAL fixture (a war ending in a dictated peace between two courts that
 * both have readable, seated rosters), and each is paired with the lit run that proves
 * the fixture works.
 *
 *   FENCE 1 — OWN-FOOTPRINT INVARIANT. GR-1's entire surface is one conditional field.
 *     Dark, the treaties ledger must be byte-identical to the LIT ledger with `sworn`
 *     deleted. WHY THAT AND NOT A STORED HASH: a feature declaring zero new keys admits
 *     a strictly better fence than a frozen number — its dark footprint is not merely
 *     stable, it is identical to the lit footprint minus its own field, an invariant no
 *     unrelated engine evolution can move and no re-record can ever be owed for.
 *
 *   FENCE 2 — DIFFERENTIAL, ABSENT vs EXPLICIT FALSE, over the whole projection. No
 *     fixture to rot. Its designed blind spot is that it stays GREEN if the feature runs
 *     in BOTH configurations, which is exactly why it is never shipped alone and why the
 *     lit-mutant control below expects it to PASS while fences 1 and 3 red.
 *
 *   FENCE 3 — CALL-PATH DORMANCY. State pins cannot see a feature that ran and happened
 *     to write nothing; counting invocations can.
 *
 *   FENCE 4 — GATE-POLARITY CENSUS over the real source tree: every production read of
 *     the flag is the strict `=== true` form, so ABSENT and FALSE are identical BY
 *     CONSTRUCTION at decision sites no state pin reaches.
 *
 * ⚠ WHERE THE SPIES SIT, AND WHY IT IS LOAD-BEARING. Two recorded ways of getting this
 * wrong were both avoided deliberately:
 *
 *   (1) `stampSworn` calls `oathHolderOf` INTRA-MODULE, so wrapping `oathHolderOf` in
 *       its own module's namespace would count ZERO on a run that demonstrably stamped —
 *       replacing an export never severs a call that does not cross a module boundary.
 *       So the dormancy counters sit on the edges oathHolder.js really TRAVERSES:
 *       `governingFactionOf` (rulingPower.js) and `durableIdForRoster` (npcLedger.js).
 *   (2) ⚠⚠ A TEST FILE THAT IMPORTS A MODULE IT ALSO `vi.mock`s LOSES INTERCEPTION FOR
 *       THAT MODULE'S OTHER CONSUMERS. This file therefore imports NOTHING from
 *       oathHolder.js, rulingPower.js or npcLedger.js — which is also why the fixture's
 *       rosters are written out by hand below and why the assertions read `treaty.sworn`
 *       directly instead of going through the module's own reader.
 *
 * NOTE WHAT FENCE 3 DOES *NOT* CLAIM. `stampSworn` is reached on every mint in BOTH
 * configurations, because the gate lives INSIDE the writer rather than at its two call
 * sites — deliberately, so the law is spelled once. That is asserted positively below
 * (it is what proves the instrumentation is live and the road is travelled), and the
 * dormancy claim is made one level deeper, where the reads are.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

/** FENCE 3's recorder. Hoisted, because `vi.mock` factories hoist above the imports. */
const calls = vi.hoisted(() => ({ stampWriter: 0, seatReads: 0, durableLookups: 0 }));

vi.mock('../../src/domain/worldPulse/oathHolder.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    stampSworn: (/** @type {any[]} */ ...args) => {
      calls.stampWriter += 1;
      return actual.stampSworn(...args);
    },
  };
});

vi.mock('../../src/domain/rulingPower.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    governingFactionOf: (/** @type {any[]} */ ...args) => {
      calls.seatReads += 1;
      return actual.governingFactionOf(...args);
    },
  };
});

vi.mock('../../src/domain/worldPulse/npcLedger.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    durableIdForRoster: (/** @type {any[]} */ ...args) => {
      calls.durableLookups += 1;
      return actual.durableIdForRoster(...args);
    },
  };
});

const { advanceTreaties } = await import('../../src/domain/worldPulse/peaceTerms.js');

const SRC_ROOT = resolve(process.cwd(), 'src');
const FLAG = 'oathHolderEnabled';
const TICK = 40;
const WAR = Object.freeze({ warLayerEnabled: true, peaceEngineEnabled: true });

// ── THE ADVERSARIAL FIXTURE ───────────────────────────────────────────────────
//
// A war between `crown` and `march` has just ended by a dictated peace, and BOTH courts
// carry a governing faction with seated members the composition can really read. Lit,
// this puts two names on the parchment. Dark, it must mint the same treaty and name
// nobody.

const roster = (id, name, affiliation) => ({ id, name, factionAffiliation: affiliation, role: 'official' });

function item(id, { tier, population }) {
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    settlement: {
      name: id, tier, population,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [{ name: 'Grain' }], primaryImports: [],
        foodSecurity: { storageMonths: 8, dailyNeed: 100, dailyProduction: 100, deficitPct: 0, surplusPct: 0, resilienceScore: 50 },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: `${id} seat`, category: 'military', power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [roster('npc_2', `${id} the elder`, `${id} seat`), roster('npc_1', `${id} the younger`, `${id} seat`)],
      activeConditions: [],
    },
  };
}

const ITEMS = () => [item('crown', { tier: 'city', population: 60000 }), item('march', { tier: 'village', population: 280 })];
const EDGES = () => [{ id: 'edge.crown.march', from: 'crown', to: 'march', relationshipType: 'hostile' }];

/** @param {Record<string, unknown>} rules */
function drive(rules) {
  const items = ITEMS();
  const edges = EDGES();
  const out = advanceTreaties({
    snapshot: { settlements: items, byId: new Map(items.map((i) => [String(i.id), i])), regionalGraph: { edges } },
    worldState: {
      tick: TICK,
      rngSeed: 'seed-gr1-fence',
      simulationRules: rules,
      calendar: { elapsedWeeks: 30 },
      deployments: {},
      warExhaustion: { crown: 0.7, march: 0.8 },
      relationshipStates: {
        'edge.crown.march': {
          relationshipType: 'cold_war', resentment: 0.6, trust: 0.1, lastTransitionTick: TICK,
          recentIncidents: [{ tick: TICK, type: 'strategy_sue_for_peace', outcomeId: `candidate.strategy.sue_for_peace.crown.${TICK}` }],
        },
      },
    },
    settlementUpdates: [],
    graph: { edges },
    pIndex: null,
    tick: TICK,
    now: '2026-01-01T00:00:00.000Z',
  });
  return getSpatialLedger(out.worldState, 'treaties') || {};
}

/** The ledger with every `sworn` field removed — the lit run's own footprint, minus GR-1. */
function withoutStamps(ledger) {
  return JSON.parse(JSON.stringify(ledger, (key, value) => (key === 'sworn' ? undefined : value)));
}

const ABSENT = drive({ ...WAR });
const EXPLICIT_FALSE = drive({ ...WAR, [FLAG]: false });
const darkCounters = { ...calls };
const LIT = drive({ ...WAR, [FLAG]: true });
const litCounters = { seatReads: calls.seatReads - darkCounters.seatReads, durableLookups: calls.durableLookups - darkCounters.durableLookups };

describe('GR-1 dormancy — the fixture is adversarial', () => {
  it('the drive really mints, and really stamps when lit', () => {
    // Every fence below is worthless on a fixture that mints nothing. This is the anchor.
    expect(Object.keys(ABSENT).length).toBe(1);
    expect(Object.keys(LIT).length).toBe(1);
    const lit = Object.values(LIT)[0];
    expect(lit.terms.length).toBeGreaterThan(0);
    expect(lit.sworn).toEqual({
      crown: { npcId: 'npc_1', name: 'crown the younger', swornTick: TICK },
      march: { npcId: 'npc_1', name: 'march the younger', swornTick: TICK },
    });
  });
});

describe('GR-1 FENCE 1 — own-footprint invariant', () => {
  it('the dark ledger IS the lit ledger with the signature line removed', () => {
    // Stronger than a frozen hash and impossible to owe a re-record for: the two runs are
    // compared to each other, so unrelated engine evolution moves both sides together.
    expect(JSON.stringify(ABSENT)).toBe(JSON.stringify(withoutStamps(LIT)));
  });

  it('no treaty grows a `sworn` key while dark — absent, not null and not empty', () => {
    for (const treaty of Object.values(ABSENT)) {
      // anchored: the lit run above is asserted to carry a two-party stamp on this same fixture, so this absence measures the flag rather than a drive that mints nothing.
      expect(treaty, 'a dark treaty grew a signature line').not.toHaveProperty('sworn');
      expect(Object.prototype.hasOwnProperty.call(treaty, 'sworn')).toBe(false);
    }
    // anchored: the LIT serialization of this same drive is asserted to CONTAIN 'sworn' in the lit-mutant control below, so this token absence is measured against a projection proven able to carry it.
    expect(JSON.stringify(ABSENT)).not.toContain('sworn');
  });
});

describe('GR-1 FENCE 2 — absent vs explicit false', () => {
  it('the two dark configurations are byte-identical over the whole projection', () => {
    // Dark-never-permissive: a key nobody wrote and a key written `false` must be one
    // answer, or a preset that declares the flag off would behave unlike a save that
    // never heard of it.
    expect(JSON.stringify(EXPLICIT_FALSE)).toBe(JSON.stringify(ABSENT));
  });
});

describe('GR-1 FENCE 3 — call-path dormancy', () => {
  it('the stamp writer is REACHED on every road in both configurations', () => {
    // Asserted positively rather than assumed: the gate lives inside the writer so the
    // law is spelled once, which means a zero here would mean the instrumentation is
    // dead — not that the feature is dormant.
    expect(calls.stampWriter).toBeGreaterThanOrEqual(3);
  });

  it('while dark it reads NOTHING: no seat is resolved and no durable id is looked up', () => {
    expect(darkCounters.seatReads).toBe(0);
    expect(darkCounters.durableLookups).toBe(0);
    // THE PAIRED NON-VACUITY ANCHOR — the counters really do move when the flag is lit,
    // so the two zeros above are dormancy rather than a spy that never intercepted. This
    // is the assertion that catches the recorded mock-interception trap.
    expect(litCounters.seatReads).toBeGreaterThan(0);
    expect(litCounters.durableLookups).toBeGreaterThan(0);
  });
});

describe('GR-1 FENCE 4 — gate-polarity census', () => {
  /** Strip comments and string literals so the flag NAMED in prose is not read as a gate. */
  function codeResidue(line) {
    const trimmed = line.trim();
    if (trimmed.startsWith('*') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return '';
    return line
      .replace(/\/\*[\s\S]*?\*\//g, ' ')
      .replace(/'(?:[^'\\]|\\.)*'/g, "''")
      .replace(/"(?:[^"\\]|\\.)*"/g, '""')
      .replace(/`(?:[^`\\]|\\.)*`/g, '``')
      .replace(/\/\/.*$/, '');
  }

  function sourceFiles(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) sourceFiles(p, out);
      else if (/\.(js|jsx)$/.test(p)) out.push(p);
    }
    return out;
  }

  it('every production read of the flag is the strict === true form', () => {
    const sites = [];
    for (const file of sourceFiles(SRC_ROOT)) {
      readFileSync(file, 'utf8').split('\n').forEach((line, index) => {
        const code = codeResidue(line);
        if (!code.includes(FLAG)) return;
        sites.push({ file, line: index + 1, code: code.trim() });
      });
    }
    // NON-VACUITY: the flag is genuinely read in src/, so the polarity claim below is
    // about a real population. The manifest entry is a data row, not a gate, and is
    // excluded by the string-literal strip above.
    expect(sites.length).toBeGreaterThan(0);
    const loose = sites.filter((site) => !/\.\s*oathHolderEnabled\s*===\s*true/.test(site.code));
    expect(
      loose.map((site) => `${site.file}:${site.line} ${site.code}`),
      'a non-strict read of the flag: ABSENT and FALSE stop being the same answer at a'
      + ' decision site no state pin can reach.',
    ).toEqual([]);
  });
});

describe('GR-1 the LIT-MUTANT CONTROL — the fences can see', () => {
  it('fences 1 and 3 REJECT the lit run, while fence 2 passes it (its designed blind spot)', () => {
    // Flip the fixture lit and re-run each fence's own predicate. A fence that cannot
    // tell the two worlds apart is decoration, and fence 2 is shipped knowing it cannot —
    // which is exactly why it never ships alone.
    expect(JSON.stringify(LIT)).not.toBe(JSON.stringify(withoutStamps(LIT)));   // fence 1 reds
    expect(JSON.stringify(LIT)).toContain('sworn');                              // fence 1 reds
    expect(litCounters.seatReads).not.toBe(0);                                   // fence 3 reds
    // FENCE 2's blind spot, stated rather than hidden: comparing two LIT configurations
    // agrees perfectly, so on its own it would certify a fully-wired feature as dormant.
    const litFalse = JSON.stringify(drive({ ...WAR, [FLAG]: true }));
    expect(litFalse).toBe(JSON.stringify(LIT));
  });
});
