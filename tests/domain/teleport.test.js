/**
 * teleport.test.js — Phase 5.5 mover wave M9c: TELEPORT BLOCS (§4e/§4f, rounds 7/11).
 *
 * The pure-engine + read-layer behaviour suite. Teleport eligibility (a teleport-capable
 * institution — magic-gated, geography-independent); the CLIQUE OF THE WILLING edge set;
 * distance COLLAPSE (a circle-holder is routing-adjacent to its bloc); ZERO-HOP HI-FI
 * intel (full fidelity even under 'unreliable' mode — no telephone decay); BOUNDED trade
 * (the capacity ceiling); NODE-STARVATION / the siege-proof edge (an isolated circle-
 * holder still reaches its bloc — the isolation counterforce — but its own land trade is
 * cut); and the DORMANT byte-identity (a teleportEdges-null digest reads no bloc).
 */
import { describe, expect, it } from 'vitest';

import {
  buildSpatialDigest,
  buildTeleportEdges,
  deriveTeleportEligibility,
  buildTeleportEdgeSet,
  hasTeleportInstitution,
  teleportInstitutionNames,
  TELEPORT_EDGE_COST,
  TELEPORT_EDGE_CAPACITY,
} from '../../src/domain/spatial/index.js';
import {
  activeTeleportEdges, isTeleportNode, teleportAdjacency, teleportNeighbourMap,
  pathCost, hopWeeks, distanceWeight, candidateRoutes,
} from '../../src/domain/spatial/distanceRead.js';
import { advanceRumorLedgers, RUMOR_CARRIER_TELEPORT, RUMOR_CARRIER_TRADE } from '../../src/domain/spatial/rumorNetwork.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { makeGridPack, placeSettlements, placeTeleportSettlements } from '../fixtures/spatialPackFixtures.js';

const CIRCLE = [{ name: 'Teleportation circle' }];

// A grid with 3 circle-holders (t000..t002) + 4 plain settlements (t003..t006).
function blocDigest(opts = {}) {
  const pack = makeGridPack({ cols: 20, rows: 14 });
  const placements = placeTeleportSettlements(pack, { nCircle: 3, nPlain: 4 });
  return { pack, placements, digest: buildSpatialDigest({ pack, placements, teleport: true, ...opts }) };
}

// A hand-built ISLAND pack: mainland (cols 0..2) + island (cols 4..5), an ocean channel
// (col 3) between — NO land route connects them. A circle on EACH side (main/isle) so
// teleport can INVERT the isolation (round 7). Returns { pack, placements }.
function makeTeleportIslandPack() {
  const cols = 6, rows = 3, n = cols * rows;
  const h = new Array(n), biome = new Array(n).fill(4), r = new Array(n).fill(0), p = new Array(n), c = new Array(n);
  const idx = (col, row) => row * cols + col;
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    const i = idx(col, row); p[i] = [col * 50, row * 50]; h[i] = col === 3 ? 10 : 40; // col 3 = ocean
  }
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    const i = idx(col, row); const nb = [];
    if (col > 0) nb.push(idx(col - 1, row)); if (col < cols - 1) nb.push(idx(col + 1, row));
    if (row > 0) nb.push(idx(col, row - 1)); if (row < rows - 1) nb.push(idx(col, row + 1));
    c[i] = nb;
  }
  const placements = [
    { id: 'main', cellId: idx(1, 1), institutions: CIRCLE }, // mainland circle-holder
    { id: 'isle', cellId: idx(4, 1), institutions: CIRCLE }, // island circle-holder (land-isolated)
  ];
  return { pack: { cells: { h, biome, r, p, c } }, placements };
}

describe('M9c — TELEPORT ELIGIBILITY = a teleport-capable institution (magic-gated, pure)', () => {
  it('the teleport-access catalog enumeration is non-empty and includes the teleportation circle', () => {
    const names = teleportInstitutionNames();
    expect(names.length).toBeGreaterThanOrEqual(1);
    expect(names).toContain('Teleportation circle');
  });

  it('a settlement WITH a circle is teleport-capable; without one it is not', () => {
    expect(hasTeleportInstitution([{ name: 'Teleportation circle' }])).toBe(true);
    expect(hasTeleportInstitution(['Teleportation circle'])).toBe(true);
    expect(hasTeleportInstitution([{ name: 'Docks/port facilities' }])).toBe(false);
    expect(hasTeleportInstitution([])).toBe(false);
    expect(hasTeleportInstitution(null)).toBe(false);
  });

  it('capability is GEOGRAPHY-INDEPENDENT — a landlocked mountain seat with a circle IS a bloc node', () => {
    const { digest } = blocDigest();
    // Only the circle-holders (t000..t002) are bloc nodes, wherever they sit.
    expect(isTeleportNode(digest, 't000')).toBe(true);
    expect(isTeleportNode(digest, 't001')).toBe(true);
    expect(isTeleportNode(digest, 't002')).toBe(true);
    expect(isTeleportNode(digest, 't003')).toBe(false); // a plain settlement, no circle
  });
});

describe('M9c — the CLIQUE OF THE WILLING edge set', () => {
  it('N circle-holders ⇒ exactly N(N-1)/2 edges (the full clique), codepoint-ordered', () => {
    const seeds = [{ id: 'a', cellId: 0 }, { id: 'b', cellId: 1 }, { id: 'c', cellId: 2 }, { id: 'd', cellId: 3 }];
    const roster = { a: CIRCLE, b: CIRCLE, c: CIRCLE, d: [] }; // d has no circle
    const set = buildTeleportEdges(seeds, roster);
    expect(set).toBeTruthy();
    expect(set.nodes).toEqual(['a', 'b', 'c']); // d excluded
    expect(set.edges.length).toBe(3); // clique of 3
    expect(set.edges.map(e => e.between)).toEqual([['a', 'b'], ['a', 'c'], ['b', 'c']]);
    expect(set.edges.every(e => e.cost === TELEPORT_EDGE_COST && e.capacity === TELEPORT_EDGE_CAPACITY)).toBe(true);
  });

  it('fewer than two circle-holders ⇒ the slot is NULL (the dormancy floor)', () => {
    const oneHolder = buildTeleportEdges([{ id: 'a', cellId: 0 }, { id: 'b', cellId: 1 }], { a: CIRCLE, b: [] });
    expect(oneHolder).toBeNull();
    const noHolder = buildTeleportEdges([{ id: 'a', cellId: 0 }], { a: CIRCLE });
    expect(noHolder).toBeNull();
    // The eligibility derivation is codepoint-sorted regardless.
    const elig = deriveTeleportEligibility([{ id: 'b', cellId: 1 }, { id: 'a', cellId: 0 }], { a: CIRCLE, b: CIRCLE });
    expect(elig.map(e => e.id)).toEqual(['a', 'b']);
    expect(buildTeleportEdgeSet(elig).nodes).toEqual(['a', 'b']);
  });
});

describe('M9c — the digest slot lights version-gated; dormant byte-identity', () => {
  it('teleport:true LIGHTS the slot (≥2 holders); the OTHER reserved slots stay null', () => {
    const { digest } = blocDigest();
    const t = activeTeleportEdges(digest);
    expect(t).toBeTruthy();
    expect(t.version).toBe(1);
    expect(t.nodes.length).toBe(3);
    expect(digest.reserved.airField).toBeNull();
    expect(digest.reserved.seaLanes).toBeNull();
    expect(digest.reserved.seasonalOverlay).toBeNull();
  });

  it('the SAME map WITHOUT the opt-in ⇒ teleportEdges null ⇒ dormant + byte-identical reserved block', () => {
    const pack = makeGridPack({ cols: 20, rows: 14 });
    const placements = placeTeleportSettlements(pack, { nCircle: 3, nPlain: 4 });
    const dormant = buildSpatialDigest({ pack, placements });
    const plain = buildSpatialDigest({ pack, placements: placeSettlements(pack, 7) });
    expect(dormant.reserved.teleportEdges).toBeNull();
    expect(activeTeleportEdges(dormant)).toBeNull();
    // A dormant teleport digest's reserved block is byte-identical to a plain one's.
    expect(JSON.stringify(dormant.reserved.teleportEdges)).toBe(JSON.stringify(plain.reserved.teleportEdges));
    // The teleport carrier + adjacency are inert.
    expect([...teleportNeighbourMap(dormant).keys()].length).toBe(0);
    expect(teleportAdjacency(dormant).size).toBe(0);
  });
});

describe('M9c — distance COLLAPSE (the circle-holder is routing-adjacent to its bloc)', () => {
  it('a teleport edge is the cheapest route between two circle-holders (collapsed distance)', () => {
    const { pack, placements, digest } = blocDigest();
    // The land cost between two dispersed holders is large; the teleport route is 1.
    const dormant = buildSpatialDigest({ pack, placements }); // same map, no teleport
    expect(pathCost(dormant, 't000', 't002')).toBeGreaterThan(TELEPORT_EDGE_COST);
    const routes = candidateRoutes(digest, 't000', 't002', 3);
    expect(routes[0].cost).toBe(TELEPORT_EDGE_COST); // the teleport edge wins
    expect(routes[0].path).toEqual(['t000', 't002']);
    expect(pathCost(digest, 't000', 't002')).toBe(TELEPORT_EDGE_COST);
  });

  it('hopWeeks is near-instant (1 week) + distanceWeight is full (hi-fi zero-hop) across the bloc', () => {
    const { digest } = blocDigest();
    expect(hopWeeks(digest, 't000', 't002')).toBe(1);
    // A collapsed distance ⇒ the channel is unattenuated (full strength — hi-fi intel).
    expect(distanceWeight(digest, 't000', 't002')).toBe(1.0);
  });

  it('a NON-teleport pair keeps land routing (the hot-loop guard — byte-identical to dormant)', () => {
    const { pack, placements } = blocDigest();
    const lit = buildSpatialDigest({ pack, placements, teleport: true });
    const dormant = buildSpatialDigest({ pack, placements });
    // t003 and t005 are plain settlements — neither is a bloc node, so their route is
    // land-only in BOTH digests (teleport is not folded for a non-modal pair).
    expect(pathCost(lit, 't003', 't005')).toBe(pathCost(dormant, 't003', 't005'));
  });
});

describe('M9c — BOUNDED trade (the capacity ceiling — premium, not a firehose)', () => {
  it('every teleport edge carries a LOW bounded capacity (vs a sea lane\'s high capacity)', () => {
    const { digest } = blocDigest();
    const t = activeTeleportEdges(digest);
    expect(t.edges.every(e => e.capacity === TELEPORT_EDGE_CAPACITY)).toBe(true);
    // The bounded ceiling is far below a sea lane's high capacity (10) — teleport moves
    // people/messages/premium goods, never bulk grain.
    expect(TELEPORT_EDGE_CAPACITY).toBeLessThan(10);
  });
});

describe('M9c — NODE-STARVATION / the SIEGE-PROOF edge (round 11, the isolation counterforce)', () => {
  it('a LAND-isolated circle-holder still reaches its bloc via teleport (de-isolation)', () => {
    const { pack, placements } = makeTeleportIslandPack();
    const landOnly = buildSpatialDigest({ pack, placements });
    const withTeleport = buildSpatialDigest({ pack, placements, teleport: true });
    // Land-only: the island is fully cut off (no land route across the ocean channel).
    expect(pathCost(landOnly, 'main', 'isle')).toBeNull();
    // Teleport lit: the circle bloc de-isolates it — a finite, collapsed route exists.
    expect(pathCost(withTeleport, 'main', 'isle')).toBe(TELEPORT_EDGE_COST);
    expect(activeTeleportEdges(withTeleport).nodes).toEqual(['isle', 'main']);
  });

  it('the teleport edge is SIEGE-PROOF — it survives a land route being cut', () => {
    const { digest } = blocDigest();
    // candidateRoutes returns the teleport edge as the primary; a besieger cannot cut
    // it (it is not a land gate). The bloc partner route survives — node-starvation is
    // the ONLY attack vector (the node's own LAND trade is cut, so it contributes less).
    const routes = candidateRoutes(digest, 't000', 't002', 3);
    expect(routes.some(r => r.path.length === 2 && r.cost === TELEPORT_EDGE_COST)).toBe(true);
    // A second bloc route (via the third holder) also exists — an ill-composed bloc that
    // leans on ONE member is fragile; a well-composed one is resilient (round 11).
    expect(routes.length).toBeGreaterThanOrEqual(2);
  });
});

describe('M9c — the ZERO-HOP HI-FI intel carrier (round 9/11)', () => {
  it('a rumor reaches a bloc partner with NO trade edge between them, via the teleport carrier', () => {
    const { digest } = blocDigest();
    // t000 → t001 is a teleport-carrier neighbour (bloc adjacency).
    expect(teleportNeighbourMap(digest).get('t000')).toContainEqual({ neighbourId: 't001', edgeId: 'tele.t000.t001' });
    const worldState = { spatialCanonVersion: 1, spatialDigest: digest, simulationRules: { infoMode: 'perfect_delayed' } };
    const feedEntries = [{
      id: 'ev1', tick: 0, significance: 'major', score: 90, severity: 0.7,
      scope: 'regional', impactKind: 'raid', settlementIds: ['t000'], sourceEventId: 'ev1',
    }];
    const out = advanceRumorLedgers({ worldState, feedEntries, graph: { channels: [] }, tick: 0 });
    expect(out.changed).toBe(true);
    const partnerLedger = out.next.t001;
    expect(partnerLedger).toBeTruthy();
    const record = Object.values(partnerLedger)[0];
    expect(record.carrier).toBe(RUMOR_CARRIER_TELEPORT);
    expect(record.framing).toContain('teleport');
    expect(record.arrivalTick).toBe(hopWeeks(digest, 't000', 't001')); // near-instant lane
  });

  it('the teleport carrier NEVER degrades a telling, even under UNRELIABLE mode (hi-fi, no decay)', () => {
    const { digest } = blocDigest();
    // Unreliable mode: the ambient telephone weathers a telling hop-by-hop — but a
    // teleport hop preserves FULL fidelity (round 11: the most accurate channel).
    const worldState = { spatialCanonVersion: 1, spatialDigest: digest, simulationRules: { infoMode: 'unreliable' } };
    const feedEntries = [{
      id: 'ev1', tick: 0, significance: 'major', score: 90, severity: 0.7,
      scope: 'regional', impactKind: 'raid', settlementIds: ['t000'], sourceEventId: 'ev1',
    }];
    const rng = createPRNG('teleport-hifi-test::tick:1');
    const out = advanceRumorLedgers({ worldState, feedEntries, graph: { channels: [] }, tick: 0, rng });
    const record = Object.values(out.next.t001)[0];
    expect(record.carrier).toBe(RUMOR_CARRIER_TELEPORT);
    // NO decay: the bloc partner's telling is byte-perfect (completeness + accuracy 1.0).
    expect(record.completeness01).toBe(1);
    expect(record.accuracy01).toBe(1);
    // The magnitude band is UNSHIFTED (severity 0.7 ⇒ band 2) — no garble mutated it.
    expect(record.content.magnitude).toBe(2);
    expect(record.hopCount).toBe(1); // one hi-fi hop from the witness
  });

  it('the teleport lane is dormant on a pre-M9c (teleportEdges-null) digest ⇒ no teleport relays', () => {
    const pack = makeGridPack({ cols: 18, rows: 14 });
    const digest = buildSpatialDigest({ pack, placements: placeSettlements(pack, 5) }); // no teleport
    expect([...teleportNeighbourMap(digest).keys()].length).toBe(0);
    const worldState = { spatialCanonVersion: 1, spatialDigest: digest, simulationRules: { infoMode: 'perfect_delayed' } };
    const feedEntries = [{
      id: 'ev1', tick: 0, significance: 'major', score: 90, severity: 0.7,
      scope: 'regional', impactKind: 'raid', settlementIds: ['s000'], sourceEventId: 'ev1',
    }];
    const out = advanceRumorLedgers({ worldState, feedEntries, graph: { channels: [] }, tick: 0 });
    // Only the witness holds the seed; no teleport relay fired (no carrier map).
    for (const sid of Object.keys(out.next || {})) {
      for (const rec of Object.values(out.next[sid])) {
        expect(rec.carrier).not.toBe(RUMOR_CARRIER_TELEPORT);
      }
    }
  });
});

/**
 * MG-3a — LEAK L1 CLOSED (docs/DESIGN_REALM_MAGIC_TOGGLE.md §3 L1).
 *
 * THE LEAK: `deriveTeleportEligibility(seeds, institutionsById)` took NO config, so a
 * legacy roster carrying a 'Teleportation circle' formed teleport edges in a world where
 * magic does not function — contradicting this module's own header ("MAGIC-gated (absent
 * in a magic-opt-out world)"). The realm magic toggle (MG-2) makes the leak visible at
 * realm scale: EVERY member of a mundane realm carries magicExists:false, so one authored
 * circle pair would light a whole bloc in a world with no magic in it.
 *
 * THE CLOSURE: capability = a teleport-capable institution ∧ the settlement's own
 * magicExists (the per-settlement truth MG-LAW-1 names as the ONE authority). The gate is
 * `=== false` (defensive, the magicLedger idiom): an ABSENT magic map means "not asserted"
 * and stays magical, so every pre-MG digest, canon and golden is byte-identical.
 *
 * NOT gated on the BAND: a magicExists:true settlement whose priorityMagic is 0 (band
 * 'none') KEEPS its circle — an authored magical premise survives by design (MG-LAW-4);
 * the structural validator warns about it (MG-3e), and erasure is never the answer.
 */
describe('MG-3a — L1: teleport capability is MAGIC-gated (the config gate)', () => {
  const seeds3 = [{ id: 'a', cellId: 0 }, { id: 'b', cellId: 1 }, { id: 'c', cellId: 2 }];
  const roster3 = { a: CIRCLE, b: CIRCLE, c: CIRCLE };

  it('a magic-OFF pair holding circles forms NO bloc (the leak, closed)', () => {
    const mundane = buildTeleportEdges(
      [{ id: 'a', cellId: 0 }, { id: 'b', cellId: 1 }],
      { a: CIRCLE, b: CIRCLE },
      { a: false, b: false },
    );
    expect(mundane).toBeNull();
    // The eligibility rows still EXIST (the census is total) — they are simply not capable.
    const elig = deriveTeleportEligibility(
      [{ id: 'a', cellId: 0 }, { id: 'b', cellId: 1 }],
      { a: CIRCLE, b: CIRCLE },
      { a: false, b: false },
    );
    expect(elig.map((e) => e.id)).toEqual(['a', 'b']);
    expect(elig.every((e) => e.teleport === false)).toBe(true);
  });

  it('a mundane member drops OUT of a mixed bloc; the magical members keep theirs', () => {
    const set = buildTeleportEdges(seeds3, roster3, { b: false });
    expect(set).toBeTruthy();
    expect(set.nodes).toEqual(['a', 'c']); // b is mundane despite its circle
    expect(set.edges.map((e) => e.between)).toEqual([['a', 'c']]);
  });

  it('ONE magical circle-holder left after the gate ⇒ the dormancy floor ⇒ NULL', () => {
    expect(buildTeleportEdges(seeds3, roster3, { b: false, c: false })).toBeNull();
  });

  it('an ABSENT magic map leaves every pre-MG derivation byte-identical (defensive default)', () => {
    const gatedAbsent = buildTeleportEdges(seeds3, roster3);
    const gatedEmpty = buildTeleportEdges(seeds3, roster3, {});
    const gatedNull = buildTeleportEdges(seeds3, roster3, null);
    expect(JSON.stringify(gatedEmpty)).toBe(JSON.stringify(gatedAbsent));
    expect(JSON.stringify(gatedNull)).toBe(JSON.stringify(gatedAbsent));
    expect(gatedAbsent.nodes).toEqual(['a', 'b', 'c']);
  });

  it('MG-LAW-4 — an AUTHORED premise survives: magicExists:true at band none keeps its circle', () => {
    // priorityMagic 0 ⇒ band 'none', but magic FUNCTIONS in this world (the DM placed a
    // strange glowing city). The bloc forms; MG-3e's validator warning carries the story.
    const set = buildTeleportEdges(seeds3, roster3, { a: true, b: true, c: true });
    expect(set.nodes).toEqual(['a', 'b', 'c']);
  });

  it('the DIGEST honours the placement rows own magicExists (the realm-scope closure)', () => {
    const { pack, placements } = makeTeleportIslandPack();
    const magical = buildSpatialDigest({ pack, placements, teleport: true });
    expect(magical.reserved.teleportEdges).toBeTruthy();
    const mundanePlacements = placements.map((p) => ({ ...p, magicExists: false }));
    const mundane = buildSpatialDigest({ pack, placements: mundanePlacements, teleport: true });
    expect(mundane.reserved.teleportEdges).toBeNull();
    // …and the mundane realm's members are back to plain land routing: the ocean channel
    // cuts the island off exactly as it does with the teleport slot unlit.
    expect(pathCost(mundane, 'main', 'isle')).toBeNull();
  });
});
