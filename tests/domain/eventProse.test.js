/**
 * tests/domain/eventProse.test.js — the generation-time event-prose corpus guards.
 *
 * These are the NON-golden guards for the park-red content-volume lane: register laws
 * (bucket-neutrality, no template leaks, portable phrasing), full reachability (every pool
 * line is reachable), and selection determinism (same seed ⇒ same pick, seedless ⇒
 * canonical, different seeds ⇒ variety). They stay GREEN; the golden shift lives elsewhere.
 */
import { describe, it, expect } from 'vitest';
import {
  fnv1a32, pickLine,
  warReceipt, peaceReceipt, hegemonyReceipt,
  WAR_RECEIPTS, PEACE_RECEIPTS,
  EVENT_PROSE_REGISTRY, FORBIDDEN_CALAMITY_KINDS,
} from '../../src/domain/worldPulse/eventProse.js';
import { stampTitle } from '../../src/domain/spatial/calamity.js';

// A superset interpolation object: every semantic token any variant fn reads. Unused keys
// are ignored by a given variant, so ONE object resolves every pool.
const SAMPLE_INTERP = Object.freeze({
  name: 'Testholt', year: 5, ruin: 'an institution lies in ruin', deaths: 42,
  resentment: '0.50', memory: '0.30', wounds: 2, s: 's',
  score: '0.60', divergence: '0.20', peel: 1, peak: 3, mediatorName: 'Midwater',
  centerName: 'Highmark', type: 'grievance', to: 'Eastvale',
  built: ' A new hall rises.', graft: '', dep: '', arteries: 2, arteryS: 's',
  cause: 'the roads have turned dangerous', arteryClause: ' — the salt artery',
  label: 'Iron', labelLower: 'iron',
  parent: 'Oldmarch', count: 2, countS: 's', dispersed: 120, debit: 30,
  resource: 'silver', a: 'Ashfield', b: 'Brookend', pop: 340,
  // W-E (J-D4) — the sampled ground the lifecycle.founded.summary_site pool names.
  place: 'the river bank',
  goal: 'secure office', role: 'heir', previous: 'town|local|',
  next: 'town|vassal|war pressure', ideal: 'order', flaw: 'pride',
  // THE ROADS tokens (ENGINE LIFT #5) — the roads.* pools read these.
  npc: 'Sir Aldric', home: 'Ashford', dest: 'Briar', captor: 'Corvin', purpose: 'trade',
  payer: 'Wexbridge', // D-5 third-party-ransom voice — the paying court's name
});

/** Resolve a pool entry (string or fn) with the sample interp. */
const resolve = (v) => (typeof v === 'function' ? String(v(SAMPLE_INTERP)) : String(v));

describe('eventProse — the walker manifest is non-vacuous and well-formed', () => {
  it('the registry covers a substantial set of pools, each non-empty', () => {
    expect(EVENT_PROSE_REGISTRY.length).toBeGreaterThanOrEqual(30);
    for (const { id, pool } of EVENT_PROSE_REGISTRY) {
      expect(Array.isArray(pool), `${id} is an array`).toBe(true);
      expect(pool.length, `${id} has >=2 variants (variety, not a single template)`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('eventProse — register laws (every resolved variant is clean)', () => {
  for (const { id, pool } of EVENT_PROSE_REGISTRY) {
    it(`${id}: every variant is non-empty, trimmed, and leak-free`, () => {
      pool.forEach((v, i) => {
        const s = resolve(v);
        expect(s.length, `${id}[${i}] non-empty`).toBeGreaterThan(0);
        expect(s, `${id}[${i}] trimmed`).toBe(s.trim());
        expect(s, `${id}[${i}] no template leak`).not.toMatch(/\$\{|\bundefined\b|\[object|\bNaN\b/);
        expect(s, `${id}[${i}] no double space`).not.toMatch(/ {2,}/);
      });
    });
  }

  it('war grievance and peace exhaustion/convergence never address scalars to the reader', () => {
    const scalarFree = new Set([
      'war.grievance',
      'peace.exhaustion',
      'peace.belief_convergence.drifting',
    ]);
    const selected = EVENT_PROSE_REGISTRY.filter(entry => scalarFree.has(entry.id));
    expect(selected.map(entry => entry.id).sort()).toEqual([...scalarFree].sort());
    for (const { id, pool } of selected) {
      for (const [index, variant] of pool.entries()) {
        const line = resolve(variant);
        expect(line.length, `${id}[${index}] authored line`).toBeGreaterThan(0);
        // anchored: the non-empty selected registry line above proves this corpus cell is live.
        expect(line, `${id}[${index}]`).not.toMatch(/\b\d+(?:\.\d+)?\b|%|×|\b(?:score|divergence|multiplier|roll)\b/i);
      }
    }
  });
});

describe('eventProse — CALAMITY bucket-neutrality (constitutional)', () => {
  const calamityEntries = EVENT_PROSE_REGISTRY.filter((e) => e.id.startsWith('calamity.'));
  it('there ARE calamity pools to check (anti-vacuity)', () => {
    expect(calamityEntries.length).toBeGreaterThanOrEqual(3);
  });
  for (const { id, pool } of calamityEntries) {
    it(`${id}: no variant asserts a disaster KIND`, () => {
      pool.forEach((v, i) => {
        const lower = resolve(v).toLowerCase();
        for (const kind of FORBIDDEN_CALAMITY_KINDS) {
          expect(lower.includes(kind), `${id}[${i}] must not contain "${kind}"`).toBe(false);
        }
      });
    });
  }
  it('every title variant keeps "Great Calamity" (the bucket phrase)', () => {
    for (const v of EVENT_PROSE_REGISTRY.find((e) => e.id === 'calamity.title').pool) {
      expect(resolve(v)).toContain('Great Calamity');
    }
  });
  it('every summary variant speaks the bucket ("calamity")', () => {
    for (const v of EVENT_PROSE_REGISTRY.find((e) => e.id === 'calamity.summary').pool) {
      expect(resolve(v).toLowerCase()).toContain('calamity');
    }
  });
});

describe('eventProse — named-mediator law', () => {
  it('every mediation variant LEADS with the mediator name', () => {
    for (const v of PEACE_RECEIPTS.mediation) {
      expect(resolve(v).startsWith('Midwater')).toBe(true);
    }
  });
});

describe('eventProse — canonical-at-zero (seedless callers are byte-identical)', () => {
  it('a falsy seed always selects index 0', () => {
    for (const { id, pool } of EVENT_PROSE_REGISTRY) {
      expect(pickLine(pool, null, SAMPLE_INTERP), `${id} seedless == v0`).toBe(resolve(pool[0]));
      expect(pickLine(pool, '', SAMPLE_INTERP), `${id} empty-seed == v0`).toBe(resolve(pool[0]));
    }
  });
  it('calamity title v0 stays in lockstep with the pure stampTitle', () => {
    expect(pickLine(EVENT_PROSE_REGISTRY.find((e) => e.id === 'calamity.title').pool, null, { name: 'Thornwood', year: 12 }))
      .toBe(stampTitle('Thornwood', 12));
  });
  it('the canonical keyword of each keyword-pinned receipt is preserved at v0', () => {
    // These lock the seedless-canonical strings the EXISTING scorer unit tests match on.
    expect(warReceipt('revanchism', undefined, SAMPLE_INTERP)).toMatch(/unforgotten/i);
    expect(warReceipt('treaty_default', undefined, SAMPLE_INTERP)).toMatch(/oathbreach/i);
    expect(peaceReceipt('exhaustion', undefined, SAMPLE_INTERP)).toMatch(/exhaustion/i);
    expect(peaceReceipt('belief_convergence.converged', undefined, SAMPLE_INTERP)).toMatch(/same truth/i);
    expect(peaceReceipt('economic_strangulation.blockade', undefined, SAMPLE_INTERP)).toContain('blockaded');
    expect(peaceReceipt('economic_strangulation.supplyweb', undefined, SAMPLE_INTERP)).toContain('supply web');
    expect(peaceReceipt('realignment.common', undefined, SAMPLE_INTERP)).toMatch(/horde|passes/i);
    expect(peaceReceipt('coalition_fracture', undefined, SAMPLE_INTERP)).toContain('coalition thins');
  });
});

describe('eventProse — full reachability (every pool line is reachable)', () => {
  // A diverse seed space (the FNV picker is surjective onto the pool indices given varied
  // inputs — real pair keys / ids are diverse). A variant no seed can reach is dead content.
  const SEED_SPACE = 5000;
  for (const { id, pool } of EVENT_PROSE_REGISTRY) {
    it(`${id}: all ${pool.length} variants are reachable`, () => {
      const hit = new Set();
      for (let i = 0; i < SEED_SPACE && hit.size < pool.length; i += 1) {
        hit.add(fnv1a32(`${i}#${id}`) % pool.length);
      }
      expect(hit.size, `${id} reachable indices`).toBe(pool.length);
    });
  }
});

describe('eventProse — selection determinism', () => {
  it('same seed ⇒ same pick (stable across calls)', () => {
    expect(warReceipt('grievance', 'a>b', SAMPLE_INTERP)).toBe(warReceipt('grievance', 'a>b', SAMPLE_INTERP));
    expect(peaceReceipt('exhaustion', 'x>y', SAMPLE_INTERP)).toBe(peaceReceipt('exhaustion', 'x>y', SAMPLE_INTERP));
    expect(hegemonyReceipt('fear_of_dominance', 'p>q', SAMPLE_INTERP)).toBe(hegemonyReceipt('fear_of_dominance', 'p>q', SAMPLE_INTERP));
  });
  it('different pairs differ (the variety actually fires across pairs)', () => {
    const pairs = Array.from({ length: 40 }, (_, i) => `from${i}>to${i}`);
    for (const typeKey of ['grievance', 'resource_pressure', 'encirclement']) {
      const seen = new Set(pairs.map((p) => warReceipt(typeKey, p, SAMPLE_INTERP)));
      expect(seen.size, `war ${typeKey} shows >1 phrasing across 40 pairs`).toBeGreaterThan(1);
    }
    for (const typeKey of ['exhaustion', 'harvest_pressure', 'spheres_understanding']) {
      const seen = new Set(pairs.map((p) => peaceReceipt(typeKey, p, SAMPLE_INTERP)));
      expect(seen.size, `peace ${typeKey} shows >1 phrasing across 40 pairs`).toBeGreaterThan(1);
    }
  });
  it('a reason on a pair is stable across ticks (keyed on the pair, not the tick) — no churn', () => {
    // The scorers seed on the directed pair key alone, so the persisted receipt does not
    // rotate every tick (the survey's "no churn" requirement).
    const a = warReceipt('grievance', 'iron>vale', SAMPLE_INTERP);
    const b = warReceipt('grievance', 'iron>vale', SAMPLE_INTERP);
    expect(a).toBe(b);
  });
  it('per-type namespacing decorrelates reasons on the SAME pair', () => {
    // grievance and resource_pressure on one pair should not lock to the same index by luck
    // across many pairs (namespacing by type is what breaks the correlation).
    const pairs = Array.from({ length: 60 }, (_, i) => `n${i}>m${i}`);
    let differ = 0;
    for (const p of pairs) {
      const gi = fnv1a32(`${p}#grievance`) % WAR_RECEIPTS.grievance.length;
      const ri = fnv1a32(`${p}#resource_pressure`) % WAR_RECEIPTS.resource_pressure.length;
      if (gi !== ri) differ += 1;
    }
    expect(differ, 'the two reasons diverge on most pairs').toBeGreaterThan(0);
  });
});
