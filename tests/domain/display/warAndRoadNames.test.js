import { describe, expect, test } from 'vitest';

import {
  WAR_NAME_POOLS,
  WAR_REASON_CLAUSES,
  UNTYPED_WAR_NAME_MOLDS,
  ROUTE_NAME_POOLS,
  warNameKey,
  deriveWarName,
  liveWarNames,
  deriveRouteName,
  chartedRouteNames,
} from '../../../src/domain/display/warAndRoadNames.js';
import { WAR_REASON_TYPES } from '../../../src/domain/worldPulse/warReasonTaxonomy.js';
import { USER_ROUTE_MODES } from '../../../src/domain/roads/userRoutes.js';

// ─────────────────────────────────────────────────────────────────────────────
// WEAVE NAME-1 — the render-time names of a war and of a road. Nothing here is
// ever persisted, so the assertions are about TOTALITY over the closed taxonomy,
// STABILITY of the key, the coalition COLLAPSE, and the two refusals (an unknown
// casus degrades; a foreign mode token is not renamed).
// ─────────────────────────────────────────────────────────────────────────────

const NAMES = /** @type {Record<string, string>} */ ({
  ashford: 'Ashford',
  kelby: 'Kelby',
  morrow: 'Morrow',
  thane: 'Thanebridge',
});
const nameFor = (/** @type {unknown} */ id) => NAMES[String(id)] || String(id);

describe('war names — totality over the closed casus taxonomy', () => {
  test('every shipped casus has a name pool and a reason clause, and nothing else does', () => {
    expect(Object.keys(WAR_NAME_POOLS).sort()).toEqual([...WAR_REASON_TYPES].sort());
    expect(Object.keys(WAR_REASON_CLAUSES).sort()).toEqual([...WAR_REASON_TYPES].sort());
  });

  test('every pool is non-empty and every authored name is unique across the corpus', () => {
    const all = [];
    for (const type of WAR_REASON_TYPES) {
      expect(WAR_NAME_POOLS[type].length, `${type} has an empty pool`).toBeGreaterThan(0);
      all.push(...WAR_NAME_POOLS[type]);
    }
    expect(new Set(all).size, 'two casus types share a war name').toBe(all.length);
  });

  test('no authored name or clause leaks an engine scalar', () => {
    for (const type of WAR_REASON_TYPES) {
      for (const entry of WAR_NAME_POOLS[type]) {
        expect(entry.length, `${type} carries an empty name`).toBeGreaterThan(0);
        // anchored: the non-empty assertion on the line above — an emptied pool entry cannot satisfy this
        expect(entry).not.toMatch(/\d/);
      }
      expect(WAR_REASON_CLAUSES[type].length, `${type} carries an empty clause`).toBeGreaterThan(0);
      // anchored: the non-empty assertion on the line above
      expect(WAR_REASON_CLAUSES[type]).not.toMatch(/\d/);
    }
  });
});

describe('war names — the key, and how it degrades', () => {
  test('the key is the codepoint-ordered pair plus the typed reason, argument order irrelevant', () => {
    const forward = warNameKey({ attackerId: 'kelby', defenderId: 'ashford', reasonType: 'grievance' });
    const reverse = warNameKey({ attackerId: 'ashford', defenderId: 'kelby', reasonType: 'grievance' });
    expect(forward).toBe('war.ashford.kelby.grievance');
    expect(reverse).toBe(forward);
  });

  test('an absent or unrecognised casus degrades the key to the pair alone', () => {
    expect(warNameKey({ attackerId: 'kelby', defenderId: 'ashford' })).toBe('war.ashford.kelby');
    expect(warNameKey({ attackerId: 'kelby', defenderId: 'ashford', reasonType: 'not_a_casus' }))
      .toBe('war.ashford.kelby');
  });

  test('the same war keeps one name whichever side names it; the line keeps the true roles', () => {
    const a = deriveWarName({ attackerId: 'kelby', defenderId: 'ashford', reasonType: 'sacred_claim', nameFor });
    const b = deriveWarName({ attackerId: 'ashford', defenderId: 'kelby', reasonType: 'sacred_claim', nameFor });
    expect(a.name).toBe(b.name);
    expect(WAR_NAME_POOLS.sacred_claim).toContain(a.name);
    expect(a.line).toContain('Kelby against Ashford');
    expect(b.line).toContain('Ashford against Kelby');
  });

  test('the degraded name interpolates the world\'s own names and claims no cause', () => {
    const war = deriveWarName({ attackerId: 'kelby', defenderId: 'ashford', nameFor });
    expect(war.reasonType).toBeNull();
    expect(war.name).toMatch(/Ashford|Kelby/);
    expect(war.line).toBe(`${war.name}: Kelby against Ashford.`);
    expect(UNTYPED_WAR_NAME_MOLDS.map((mold) => mold({ a: 'Ashford', b: 'Kelby' }))).toContain(war.name);
  });

  test('the addressed line carries the typed reason in world words and no scalar', () => {
    const war = deriveWarName({ attackerId: 'kelby', defenderId: 'ashford', reasonType: 'ingratitude_debt', nameFor });
    expect(war.line).toContain(WAR_REASON_CLAUSES.ingratitude_debt);
    // anchored: the clause containment above proves this is the composed sentence, not an empty string
    expect(war.line).not.toMatch(/\d/);
  });

  test('selection is stable and total across all sixteen casus types', () => {
    for (const type of WAR_REASON_TYPES) {
      const once = deriveWarName({ attackerId: 'kelby', defenderId: 'ashford', reasonType: type, nameFor });
      const twice = deriveWarName({ attackerId: 'kelby', defenderId: 'ashford', reasonType: type, nameFor });
      expect(once.name).toBe(twice.name);
      expect(WAR_NAME_POOLS[type]).toContain(once.name);
    }
  });
});

describe('war names — the live read', () => {
  test('a dormant campaign names no war', () => {
    expect(liveWarNames({ worldState: {} })).toEqual([]);
    expect(liveWarNames({})).toEqual([]);
    expect(liveWarNames({ worldState: { deployments: {} } })).toEqual([]);
  });

  test('the highest-scored pin decides the cause; a tie breaks by codepoint', () => {
    const scored = liveWarNames({
      worldState: {
        deployments: {
          kelby: {
            targetId: 'ashford',
            casusReasons: [
              { type: 'opportunism', score: 0.2 },
              { type: 'sacred_claim', score: 0.9 },
            ],
          },
        },
      },
      nameFor,
    });
    expect(scored).toHaveLength(1);
    expect(scored[0].reasonType).toBe('sacred_claim');

    const tied = liveWarNames({
      worldState: {
        deployments: {
          kelby: {
            targetId: 'ashford',
            casusReasons: [
              { type: 'revanchism', score: 0.5 },
              { type: 'grievance', score: 0.5 },
            ],
          },
        },
      },
      nameFor,
    });
    expect(tied[0].reasonType).toBe('grievance');
  });

  test('a coalition collapses onto ONE named war with every participant listed', () => {
    const wars = liveWarNames({
      worldState: {
        deployments: {
          kelby: { targetId: 'ashford', sinceTick: 4, casusReasons: [{ type: 'grievance', score: 0.7 }] },
          morrow: {
            targetId: 'ashford',
            sinceTick: 6,
            casusReasons: [{ type: 'alliance_obligation', score: 0.9 }],
            joinLedger: [{
              originAttackerId: 'kelby',
              enemyId: 'ashford',
              sourceCauseTypes: ['grievance'],
            }],
          },
        },
      },
      nameFor,
    });
    expect(wars).toHaveLength(1);
    expect(wars[0].key).toBe('war.ashford.kelby.grievance');
    expect(wars[0].participants).toEqual(['kelby', 'morrow']);
    expect(WAR_NAME_POOLS.grievance).toContain(wars[0].name);
  });

  test('a joiner whose anchor is malformed falls back to its own bilateral war', () => {
    const wars = liveWarNames({
      worldState: {
        deployments: {
          morrow: {
            targetId: 'ashford',
            casusReasons: [{ type: 'alliance_obligation', score: 0.9 }],
            joinLedger: [{ enemyId: 'ashford' }, { enemyId: 'ashford' }],
          },
        },
      },
      nameFor,
    });
    expect(wars).toHaveLength(1);
    expect(wars[0].key).toBe('war.ashford.morrow.alliance_obligation');
    expect(wars[0].participants).toEqual(['morrow']);
  });

  test('a record with no target is not a war, and a legacy record degrades rather than throwing', () => {
    const wars = liveWarNames({
      worldState: { deployments: { kelby: { sinceTick: 2 }, morrow: { targetId: 'thane' } } },
      nameFor,
    });
    expect(wars).toHaveLength(1);
    expect(wars[0].key).toBe('war.morrow.thane');
    expect(wars[0].reasonType).toBeNull();
  });

  test('distinct wars sort by key and never merge', () => {
    const wars = liveWarNames({
      worldState: {
        deployments: {
          kelby: { targetId: 'ashford', casusReasons: [{ type: 'grievance', score: 1 }] },
          thane: { targetId: 'morrow', casusReasons: [{ type: 'opportunism', score: 1 }] },
        },
      },
      nameFor,
    });
    expect(wars.map((w) => w.key)).toEqual(['war.ashford.kelby.grievance', 'war.morrow.thane.opportunism']);
  });
});

describe('road names — the first named-road surface', () => {
  const landRow = { routeId: 'route.ashford.kelby.land', a: 'kelby', b: 'ashford', mode: 'land', band: 'steady', createdTick: 12 };

  test('the mirrored mode vocabulary is the route vocabulary', () => {
    expect(Object.keys(ROUTE_NAME_POOLS).sort()).toEqual([...USER_ROUTE_MODES].sort());
  });

  test('a road is named for the far end from either standpoint, and stably', () => {
    const fromAshford = deriveRouteName({ row: landRow, fromId: 'ashford', nameFor });
    const fromKelby = deriveRouteName({ row: landRow, fromId: 'kelby', nameFor });
    expect(fromAshford).not.toBeNull();
    expect(fromKelby).not.toBeNull();
    expect(fromAshford.name).toContain('Kelby');
    expect(fromKelby.name).toContain('Ashford');
    expect(deriveRouteName({ row: landRow, fromId: 'ashford', nameFor }).name).toBe(fromAshford.name);
  });

  test('with no standpoint the road takes its stable pair form', () => {
    const paired = deriveRouteName({ row: landRow, nameFor });
    expect(paired.name).toContain('Ashford');
    expect(paired.name).toContain('Kelby');
    expect(ROUTE_NAME_POOLS.land.paired.map((mold) => mold({ a: 'Ashford', b: 'Kelby' })))
      .toContain(paired.name);
  });

  test('the line carries the address, the mode and the typed band as a haul — never a cost', () => {
    const named = deriveRouteName({ row: landRow, fromId: 'ashford', nameFor });
    expect(named.line).toBe(`${named.name}: Ashford to Kelby, overland, a steady haul.`);
    // anchored: the exact-equality assertion above pins the whole sentence, so this cannot go vacuous
    expect(named.line).not.toMatch(/\d/);
  });

  test('a water route is a crossing, not a road', () => {
    const named = deriveRouteName({
      row: { ...landRow, routeId: 'route.ashford.kelby.water', mode: 'water', band: 'long' },
      fromId: 'ashford',
      nameFor,
    });
    expect(named.line).toContain('by water');
    expect(named.line).toContain('a long haul');
    expect(ROUTE_NAME_POOLS.water.addressed.map((mold) => mold({ dest: 'Kelby' }))).toContain(named.name);
  });

  test('an absent band drops the haul clause rather than guessing one', () => {
    const named = deriveRouteName({ row: { ...landRow, band: null }, fromId: 'ashford', nameFor });
    expect(named.line).toBe(`${named.name}: Ashford to Kelby, overland.`);
  });

  test('a foreign mode token is REFUSED, not renamed', () => {
    // `sea` is the MissionRec.legModes / RoadsLayer spelling — a different
    // vocabulary. Naming it a crossing would silently mix the two.
    expect(deriveRouteName({ row: { ...landRow, mode: 'sea' }, fromId: 'ashford', nameFor })).toBeNull();
    expect(deriveRouteName({ row: { ...landRow, mode: undefined }, nameFor })).toBeNull();
    expect(deriveRouteName({ row: { ...landRow, a: null }, nameFor })).toBeNull();
  });

  test('a settlement names the roads it chartered, drops what the vocabulary refuses, and is inert otherwise', () => {
    const settlement = {
      id: 'ashford',
      config: {
        _userRoutes: [
          { routeId: 'route.ashford.thane.land', a: 'ashford', b: 'thane', mode: 'land', band: 'arduous' },
          { routeId: 'route.ashford.kelby.land', a: 'ashford', b: 'kelby', mode: 'land', band: 'close' },
          { routeId: 'route.ashford.morrow.sea', a: 'ashford', b: 'morrow', mode: 'sea', band: 'close' },
        ],
      },
    };
    const named = chartedRouteNames({ settlement, nameFor });
    expect(named.map((r) => r.routeId)).toEqual(['route.ashford.kelby.land', 'route.ashford.thane.land']);
    // Standing at Ashford, each road is named for its FAR end — asserted positively so an
    // empty or renamed list cannot pass.
    expect(named.map((r) => r.name).join(' | ')).toContain('Kelby');
    expect(named.map((r) => r.name).join(' | ')).toContain('Thanebridge');
    expect(chartedRouteNames({ settlement: { id: 'kelby' }, nameFor })).toEqual([]);
    expect(chartedRouteNames({ settlement: { id: 'kelby', config: {} }, nameFor })).toEqual([]);
    expect(chartedRouteNames({ settlement: null, nameFor })).toEqual([]);
    // The ledger is read off the `_config` twin too — the shape mutateUserRoute mirrors into.
    expect(chartedRouteNames({
      settlement: { id: 'ashford', _config: { _userRoutes: [{ routeId: 'route.ashford.kelby.land', a: 'ashford', b: 'kelby', mode: 'land' }] } },
      nameFor,
    }).map((r) => r.routeId)).toEqual(['route.ashford.kelby.land']);
  });
});
