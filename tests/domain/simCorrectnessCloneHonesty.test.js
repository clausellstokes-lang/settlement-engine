/**
 * tests/domain/simCorrectnessCloneHonesty.test.js
 *
 * Lane: sim correctness + clone honesty. Closes three review findings:
 *
 *   1. Threat dedup precision — the (type,target) collapse was at the SHARED
 *      enumeration entry (deriveAllThreatProfiles), over-collapsing legitimately
 *      distinct same-type threats for EVERY consumer (two hostile neighbours
 *      surfaced as one). The collapse now lives ONLY in capacityModel's demand
 *      summation (dedupeThreatsByPressure): enumeration is honest (both
 *      neighbours survive), capacity demand counts the underlying pressure once.
 *
 *   2. war_front id de-aliasing — channelIdFor keys only (type,from,to,goods),
 *      so a war-layer-minted (then retired/dormant) war_front shares its id with
 *      the hostile-relationship bundle. syncRelationshipChannelBundle's
 *      dedormancy branch must NOT re-confirm a war-layer-owned dormant front on
 *      a later hostile relabel (that would re-seed a phantom siege past the
 *      mobilization gate). Provenance is sticky across relabels (defense layer).
 *
 *   3. clone.js honesty + safety — the JSON fallback is lossy (Date/Map/Set are
 *      corrupted), is taken ONLY on DataCloneError, and any other failure
 *      rethrows rather than being masked by a lossy round-trip.
 */

import { describe, it, expect } from 'vitest';

import {
  deriveAllThreatProfiles,
  dedupeThreatsByPressure,
} from '../../src/domain/threatProfile.js';
import { deriveCapacityProfile } from '../../src/domain/capacityModel.js';
import {
  mintDirectedChannel,
  addRegionalChannels,
  setRegionalChannelStatus,
  syncRelationshipChannelBundle,
  ensureRegionalGraph,
} from '../../src/domain/region/graph.js';
import { deepClone } from '../../src/domain/clone.js';

const NOW = '2026-06-20T00:00:00.000Z';

// ── Fix 1: two distinct hostile neighbours both survive enumeration ─────────

describe('Fix 1 — threat enumeration keeps distinct same-type neighbours, demand counts once', () => {
  const twoHostileNeighbours = {
    population: 2000,
    neighbours: [
      { name: 'Blackmoor', relationshipType: 'hostile' },
      { name: 'Ravenhold', relationshipType: 'hostile' },
    ],
  };

  it('surfaces BOTH hostile neighbours as distinct rival_neighbor threats', () => {
    const threats = deriveAllThreatProfiles(twoHostileNeighbours);
    const rivals = threats.filter(t => t.type === 'rival_neighbor');
    // Both neighbours survive enumeration — the prior shared-entry dedup
    // collapsed these into one, blinding explanation / contradictions / map /
    // AI-grounding to the second hostile power.
    expect(rivals).toHaveLength(2);
    // They are genuinely distinct entities (different ids + labels), not clones.
    expect(new Set(rivals.map(t => t.id)).size).toBe(2);
    expect(rivals.some(t => /Blackmoor/.test(t.label))).toBe(true);
    expect(rivals.some(t => /Ravenhold/.test(t.label))).toBe(true);
  });

  it('charges defense demand for the rival pressure ONCE (not once per neighbour)', () => {
    const oneRival = deriveCapacityProfile('defense', {
      population: 2000,
      neighbours: [{ name: 'Blackmoor', relationshipType: 'hostile' }],
    });
    const twoRivals = deriveCapacityProfile('defense', twoHostileNeighbours);
    // Same (type,target) pressure → a single demand charge despite two
    // neighbours, so the band tracks the worst pressure, not phantom load.
    expect(twoRivals.demand).toBe(oneRival.demand);
    const rivalRows = twoRivals.demandContributors.filter(c => c.effect === 'rival_neighbor');
    expect(rivalRows).toHaveLength(1);
  });

  it('dedupeThreatsByPressure keeps the max-severity instance per (type,target)', () => {
    const mixed = {
      neighbours: [
        { name: 'Blackmoor', relationshipType: 'hostile' },  // sev 0.7
        { name: 'Highvale', relationshipType: 'cold_war' },  // sev 0.4 (also rival_neighbor)
      ],
    };
    const enumerated = deriveAllThreatProfiles(mixed);
    expect(enumerated.filter(t => t.type === 'rival_neighbor')).toHaveLength(2);
    const collapsed = dedupeThreatsByPressure(enumerated).filter(t => t.type === 'rival_neighbor');
    expect(collapsed).toHaveLength(1);
    expect(collapsed[0].severity).toBeCloseTo(0.7);
  });

  it('dedupeThreatsByPressure is deterministic (stable order/result)', () => {
    const threats = deriveAllThreatProfiles(twoHostileNeighbours);
    const a = dedupeThreatsByPressure(threats).map(t => `${t.type}|${t.target}|${t.severity}`);
    const b = dedupeThreatsByPressure(threats).map(t => `${t.type}|${t.target}|${t.severity}`);
    expect(a).toEqual(b);
  });
});

// ── Fix 2: war_front de-aliasing — relationship relabel cannot revive a ─────
//          retired war-layer front.

describe('Fix 2 — a retired war-layer war_front is not revived by a hostile relabel', () => {
  const FROM = 'attacker-1';
  const TO = 'target-1';
  const edge = { id: `edge.${FROM}.${TO}`, from: FROM, to: TO };

  function graphWithRetiredWarFront() {
    // Mint a war-layer front the way warDeployment.js does (source
    // 'war_layer_deploy'), seed it into the graph, then RETIRE it to 'dormant'
    // via the real resolution path (setRegionalChannelStatus).
    const front = mintDirectedChannel({
      type: 'war_front',
      from: FROM,
      to: TO,
      strength: 0.7,
      confidence: 0.8,
      explanation: 'Attacker marches on Target.',
      relationshipKey: `war_front.${FROM}.${TO}`,
      source: 'war_layer_deploy',
      now: NOW,
    });
    let graph = addRegionalChannels({}, [front], { now: NOW });
    graph = setRegionalChannelStatus(graph, front.id, 'dormant', { now: NOW });
    return { graph, frontId: front.id };
  }

  function warFront(graph, id) {
    return ensureRegionalGraph(graph).channels.find(c => c.id === id);
  }

  it('shares an id with the hostile bundle war_front (the aliasing precondition)', () => {
    const { frontId } = graphWithRetiredWarFront();
    // Sanity: confirm the collision actually exists, so the guard below is
    // protecting against a real alias, not a stale concern.
    const bundleGraph = syncRelationshipChannelBundle(
      ensureRegionalGraph({}, { now: NOW }), edge, 'hostile', { now: NOW },
    );
    const bundleFront = ensureRegionalGraph(bundleGraph).channels.find(
      c => c.type === 'war_front' && String(c.from) === FROM && String(c.to) === TO,
    );
    expect(bundleFront).toBeTruthy();
    expect(bundleFront.id).toBe(frontId);
  });

  it('leaves the retired front DORMANT after a hostile relationship relabel', () => {
    const { graph, frontId } = graphWithRetiredWarFront();
    expect(warFront(graph, frontId).status).toBe('dormant');

    const relabelled = syncRelationshipChannelBundle(graph, edge, 'hostile', { now: NOW });
    // No phantom re-confirm: the war layer owns this front's lifecycle.
    expect(warFront(relabelled, frontId).status).toBe('dormant');
  });

  it('keeps the front dormant across REPEATED relabels (provenance is sticky)', () => {
    const { graph, frontId } = graphWithRetiredWarFront();
    // Relabel hostile twice; the bundle's relationship_label evidence must not
    // erase the war_layer tag, or the second relabel would revive the front.
    let g = syncRelationshipChannelBundle(graph, edge, 'hostile', { now: NOW });
    g = syncRelationshipChannelBundle(g, edge, 'hostile', { now: NOW });
    const f = warFront(g, frontId);
    expect(f.status).toBe('dormant');
    expect((f.evidence || []).some(e => typeof e.source === 'string' && e.source.startsWith('war_layer'))).toBe(true);
  });

  it('still re-confirms a genuinely relationship-owned dormant channel', () => {
    // Control: a dormant channel WITHOUT war-layer provenance (a normal
    // relationship-minted war_front parked dormant) must still re-confirm on a
    // re-warmed hostile relationship — the guard is scoped to war-layer mints.
    const peace = syncRelationshipChannelBundle(
      ensureRegionalGraph({}, { now: NOW }), edge, 'hostile', { now: NOW },
    );
    // Park the relationship front dormant the way a label change to a neutral
    // relationship would (resource_competition keeps war_front, so go via ally
    // which drops war_front → dormant).
    const cooled = syncRelationshipChannelBundle(peace, edge, 'allied', { now: NOW });
    const dormantFront = ensureRegionalGraph(cooled).channels.find(
      c => c.type === 'war_front' && String(c.from) === FROM && String(c.to) === TO,
    );
    expect(dormantFront.status).toBe('dormant');
    expect((dormantFront.evidence || []).some(e => e.source && e.source.startsWith('war_layer'))).toBe(false);

    const rewarmed = syncRelationshipChannelBundle(cooled, edge, 'hostile', { now: NOW });
    const reconfirmed = ensureRegionalGraph(rewarmed).channels.find(c => c.id === dormantFront.id);
    expect(reconfirmed.status).toBe('confirmed');
  });
});

// ── Fix 3: clone.js honesty + safety ───────────────────────────────────────

describe('Fix 3 — deepClone fallback is lossy, scoped to DataCloneError, and rethrows otherwise', () => {
  it('losslessly clones structured types on the structuredClone path', () => {
    const src = {
      when: new Date('2026-06-20T00:00:00Z'),
      tags: new Set(['a', 'b']),
      lookup: new Map([['k', 1]]),
    };
    const out = deepClone(src);
    expect(out.when instanceof Date).toBe(true);
    expect(out.tags instanceof Set).toBe(true);
    expect(out.lookup instanceof Map).toBe(true);
    expect(out).not.toBe(src);
  });

  it('falls back to the JSON path ONLY for a non-cloneable (DataCloneError) value', () => {
    let out;
    expect(() => { out = deepClone({ keep: 1, fn: () => 1 }); }).not.toThrow();
    expect(out).toEqual({ keep: 1 });
    expect('fn' in out).toBe(false);
  });

  it('DOCUMENTS the fallback lossiness: a Date is corrupted to a string when the JSON path is forced', () => {
    // When the fallback IS taken (here forced by a co-resident function), the
    // JSON round-trip is NOT faithful: the Date is flattened to its ISO string
    // and the function is dropped. This is the corruption the honest comment
    // now warns about — callers that hit the fallback feed JSON-shaped state.
    const out = deepClone({ when: new Date('2026-06-20T00:00:00Z'), fn: () => 1 });
    expect(typeof out.when).toBe('string');
    expect(out.when).toBe('2026-06-20T00:00:00.000Z');
    expect('fn' in out).toBe(false);
  });

  it('rethrows a non-DataCloneError failure instead of masking it behind a lossy clone', () => {
    // A getter that throws a TypeError must surface — structuredClone propagates
    // it, and the narrowed catch rethrows rather than dropping to JSON (which
    // would itself throw, or worse, silently mangle the value).
    const boom = {
      get explode() { throw new TypeError('boom'); },
    };
    expect(() => deepClone(boom)).toThrow(TypeError);
    expect(() => deepClone(boom)).toThrow('boom');
  });
});
