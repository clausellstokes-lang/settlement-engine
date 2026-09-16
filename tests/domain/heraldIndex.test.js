/**
 * heraldIndex.test.js — THE HERALD INDEX (SP-6's index amendment, 2026-08-03).
 *
 * What is pinned here:
 *   THE INDEX LAW    facets match REFS ONLY. A name that appears in the prose
 *                    and nowhere in the refs does NOT satisfy its facet — the
 *                    finite-semantics law, and the reason this pin exists.
 *   FREE TEXT        matches rendered prose and resolved settlement names, and
 *                    never reaches into arbitrary deep record fields.
 *   THE AUDIENCE LAW covert entries never reach a projection that could not read
 *                    them. FAIL CLOSED — the default, and an unreadable
 *                    provenance is covert, not canon. The hardest pin here.
 *   ORGANIZATION     grouped by desk and time band, deterministically ordered.
 *   THE READER SHELL every declared-pending facet has a WIRED reader that lights
 *                    the moment a typed ref appears on the record — proved by
 *                    feeding it one.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  HERALD_FACETS,
  HERALD_FACET_BY_ID,
  entryRefs,
  facetAvailability,
  readableBy,
  searchHerald,
} from '../../src/domain/display/heraldIndex.js';

const entry = (over = {}) => ({
  id: 'e1',
  section: 'war',
  headline: 'Karsh declares war on Elmspur',
  summary: 'Karsh declared war on Elmspur this turning.',
  severity: 0.9,
  major: true,
  tick: 60,
  reasons: [],
  subject: { npcId: 'npc-1', factionId: 'fac-1', factionName: 'The Iron Seat', settlementId: 's1' },
  affectedIds: ['s1', 's2'],
  kind: 'war_declared',
  rootId: 'e1',
  provenance: 'canon',
  record: {},
  ...over,
});

const NAMES = new Map([['s1', 'Karsh'], ['s2', 'Elmspur']]);
const CORPUS = [
  entry(),
  entry({ id: 'e2', section: 'trade', headline: 'The salt road closed', summary: 'The salt road closed.', severity: 0.3, tick: 58, kind: 'route_severed', subject: { npcId: null, factionId: null, factionName: null, settlementId: 's2' }, affectedIds: ['s2'] }),
  entry({ id: 'e3', section: 'faith', headline: 'A covert rite was kept', summary: '', severity: 0.5, tick: 59, kind: 'rite_kept', provenance: 'covert', subject: { npcId: null, factionId: null, factionName: null, settlementId: 's1' }, affectedIds: ['s1'] }),
];

const search = (args) => searchHerald({ entries: CORPUS, nameById: NAMES, nowTick: 60, ...args });

describe('THE INDEX LAW — facets match refs, never prose', () => {
  test('a settlement facet matches by ref', () => {
    expect(search({ facets: { settlement: ['s2'] } }).results.map((e) => e.id)).toEqual(['e1', 'e2']);
  });

  test('a NAME that appears in the prose but in no ref does NOT satisfy its facet', () => {
    // "Elmspur" is all over e1's headline. The facet still asks for the id, and
    // the name is not one — no name-regex entity inference, ever.
    expect(search({ facets: { settlement: ['Elmspur'] } }).results).toHaveLength(0);
    // And the same string DOES find it through free text, which is the half of
    // the law that is allowed to read prose.
    expect(search({ query: 'Elmspur' }).results.map((e) => e.id)).toEqual(['e1', 'e2']);
  });

  test('facets narrow together; values within a facet widen', () => {
    expect(search({ facets: { settlement: ['s1', 's2'] } }).results).toHaveLength(2);
    expect(search({ facets: { settlement: ['s2'], desk: ['war'] } }).results.map((e) => e.id)).toEqual(['e1']);
    expect(search({ facets: { settlement: ['s2'], desk: ['faith'] } }).results).toHaveLength(0);
  });

  test('an unknown facet id is ignored rather than silently emptying the result', () => {
    expect(search({ facets: { hairColour: ['red'] } }).results).toHaveLength(2);
  });

  test('the person and faction facets read the typed subject slots', () => {
    expect(search({ facets: { npc: ['npc-1'] } }).results.map((e) => e.id)).toEqual(['e1']);
    expect(search({ facets: { faction: ['fac-1'] } }).results.map((e) => e.id)).toEqual(['e1']);
  });

  test('the time band is a BAND, never a tick', () => {
    // 590 elapsed weeks lands past `years_on` (≤520) and inside `a_decade`.
    const refs = HERALD_FACET_BY_ID.timeBand.refsOf(entry({ tick: 10 }), { nowTick: 600 });
    expect(refs).toEqual(['a_decade']);
    expect(HERALD_FACET_BY_ID.timeBand.refsOf(entry({ tick: 55 }), { nowTick: 60 })).toEqual(['this_season']);
    for (const ref of refs) expect(ref).not.toMatch(/[0-9]/);
  });
});

describe('THE AUDIENCE LAW — search is a view, never a leak', () => {
  test('FAIL CLOSED by default: a covert entry does not reach the results', () => {
    const out = search({});
    expect(out.results.map((e) => e.id)).not.toContain('e3');
    expect(out.redactedCount).toBe(1);
  });

  test('a proven DM session reaches it', () => {
    expect(search({ includeCovert: true }).results.map((e) => e.id)).toContain('e3');
  });

  test('a covert MARKER the normalizer never lifted is still covert', () => {
    const sneaky = entry({ id: 'e4', provenance: 'canon', record: { covert: true } });
    expect(readableBy(sneaky, false)).toBe(false);
    expect(readableBy(sneaky, true)).toBe(true);
    const nested = entry({ id: 'e5', provenance: 'canon', record: { outcome: { visibility: 'covert' } } });
    expect(readableBy(nested, false)).toBe(false);
  });

  test('a covert entry cannot be reached by free text or by facet either', () => {
    expect(search({ query: 'covert rite' }).results).toHaveLength(0);
    expect(search({ facets: { desk: ['faith'] } }).results).toHaveLength(0);
    expect(search({ facets: { desk: ['faith'] }, includeCovert: true }).results.map((e) => e.id)).toEqual(['e3']);
  });
});

describe('ORGANIZATION — by desk and time band, deterministically', () => {
  test('groups carry a desk and a band, and the same corpus reads the same way', () => {
    const a = search({});
    const b = search({});
    expect(a.groups.map((g) => `${g.desk}/${g.timeBand}`)).toEqual(b.groups.map((g) => `${g.desk}/${g.timeBand}`));
    for (const group of a.groups) {
      expect(group.desk).toBeTruthy();
      expect(group.timeBand).toBeTruthy();
    }
  });

  test('results are severity-first, then recency, then id', () => {
    expect(search({}).results.map((e) => e.id)).toEqual(['e1', 'e2']);
  });
});

describe('THE READER SHELL — pending facets are wired, not promised', () => {
  test('every facet declares live or pending, and nothing else', () => {
    for (const facet of HERALD_FACETS) {
      expect(['live', 'pending']).toContain(facet.status);
      expect(typeof facet.refsOf).toBe('function');
    }
  });

  test('availability reports declared status AND measured population', () => {
    const rows = facetAvailability(CORPUS, { nowTick: 60 });
    const byId = Object.fromEntries(rows.map((r) => [r.id, r]));
    expect(byId.settlement.declared).toBe('live');
    expect(byId.settlement.populated).toBe(true);
    // The pending half is honest about being dark rather than quietly matching
    // nothing, which is indistinguishable from being broken.
    expect(byId.good.declared).toBe('pending');
    expect(byId.good.populated).toBe(false);
  });

  test('a pending facet LIGHTS the moment the mint records its typed ref', () => {
    const pending = HERALD_FACETS.filter((f) => f.status === 'pending').map((f) => f.id);
    expect(pending.sort()).toEqual(['arc', 'good', 'institution', 'route', 'service']);
    const withRefs = entry({
      id: 'e9',
      record: { goodId: 'g-salt', routeId: 'r-east', institutionId: 'i-hall', serviceId: 'sv-ferry', treatyId: 't-1' },
    });
    const out = searchHerald({ entries: [withRefs], facets: { good: ['g-salt'] }, nowTick: 60 });
    expect(out.results.map((e) => e.id)).toEqual(['e9']);
    for (const id of pending) {
      expect(HERALD_FACET_BY_ID[id].refsOf(withRefs).length, id).toBeGreaterThan(0);
    }
  });

  test('the merchant-house spelling is read beside the faction subject slot', () => {
    const house = entry({ id: 'e8', record: { houseId: 'h-vell' } });
    expect(HERALD_FACET_BY_ID.faction.refsOf(house)).toContain('h-vell');
  });
});

describe('THE ROUND TRIP', () => {
  test('entryRefs returns exactly the facets an entry carries', () => {
    const refs = entryRefs(entry(), { nowTick: 60 });
    expect(Object.keys(refs).sort()).toEqual(['desk', 'faction', 'kind', 'npc', 'settlement', 'timeBand']);
    expect(refs.settlement).toEqual(['s1', 's2']);
    // Every ref an entry advertises must find that entry back through search —
    // the two halves are one index, so they cannot drift.
    for (const [facetId, values] of Object.entries(refs)) {
      const found = searchHerald({ entries: [entry()], facets: { [facetId]: values }, nowTick: 60 });
      expect(found.results, facetId).toHaveLength(1);
    }
  });
});
