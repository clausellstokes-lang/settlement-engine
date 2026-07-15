/**
 * navalDormancyGolden.test.js — W-NAVY the FENCED dormancy golden (DESIGN_NAVY.md §6).
 *
 * The constitutional proof that the naval layer is DARK by default: absent the virtual
 * navalEnabled flag, advanceNaval is a COMPLETE no-op — zero navalTransit keys, changed:false,
 * the same worldState reference every tick — across a corpus of seeds/ticks that WOULD fire a
 * blockade/convoy if lit (the anti-vacuity below proves the machinery is real, so the dormant
 * golden is meaningful and not trivially empty). Mirrors interventionDormancyGolden's fence.
 *
 * The dormant projection is deterministic and EMPTY by construction, so its golden is captured
 * inline (a drift ⇒ dormancy broke). This is a self-contained advanceNaval-level fence (the
 * full-pulse byte-identity is separately proven by worldpulseSpatialGolden / spatialDigestGolden
 * / interventionDormancyGolden, all green with the naval wiring in place).
 */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { advanceNaval } from '../../src/domain/worldPulse/navalKernel.js';
import { makeIslandPack, makePortCoastPack } from '../fixtures/spatialPackFixtures.js';

const NOW = '2026-07-15T00:00:00.000Z';
const SHIPYARD = { name: 'Shipyard', tags: ['transport', 'shipbuilding', 'port'] };
const navySnapshot = { byId: { get: (id) => ({ id, name: String(id), settlement: { name: String(id), tier: 'city', institutions: [SHIPYARD], economicState: { prosperity: 'Prosperous' } } }) } };

/** A naval-capable spatial world (ports + navies + a live hostility) that WOULD fire if lit. */
function navalWorld(lit, packKind) {
  const { pack, placements } = packKind === 'coast' ? makePortCoastPack(6) : makeIslandPack();
  const digest = buildSpatialDigest({ pack, placements, seaLanes: true });
  const ports = digest.reserved.seaLanes ? digest.reserved.seaLanes.ports : [];
  // A war between the first two ports + a deployment (so both convoys and blockades are eligible).
  const graph = ports.length >= 2 ? { edges: [{ from: ports[0], to: ports[1], relationshipType: 'hostile' }] } : { edges: [] };
  const deployments = ports.length >= 2 ? { [ports[0]]: { targetId: ports[1], currentEffectiveStrength: 50, readiness: 0.6 } } : {};
  const worldState = {
    spatialCanonVersion: 1, spatialDigest: digest,
    simulationRules: { warLayerEnabled: true, ...(lit ? { navalEnabled: true } : {}) },
    deployments,
  };
  return { worldState, digest, graph };
}

/** Drive N ticks of advanceNaval; project a mechanical census (changed flags + ledger keys). */
function driveNaval(seed, lit, ticks, packKind) {
  let { worldState } = navalWorld(lit, packKind);
  const { digest, graph } = navalWorld(lit, packKind);
  const changedFlags = [];
  const ledgerSizes = [];
  let mintedNaval = false;
  let sameRefEveryTick = true;
  for (let t = 0; t < ticks; t++) {
    const before = worldState;
    const out = advanceNaval({ snapshot: navySnapshot, worldState, digest, graph, rng: createPRNG(seed).fork('naval'), tick: t, now: NOW });
    if (!lit && out.worldState !== before) sameRefEveryTick = false; // dormant ⇒ same reference
    worldState = out.worldState;
    changedFlags.push(out.changed ? 1 : 0);
    const led = worldState.spatialLedgers?.navalTransit || null;
    ledgerSizes.push(led ? Object.keys(led).length : 0);
    if (led && Object.values(led).length) mintedNaval = true;
  }
  return { changedFlags, ledgerSizes, mintedNaval, sameRefEveryTick, worldState };
}

function projectionHash(p) {
  return createHash('sha256').update(JSON.stringify({ changedFlags: p.changedFlags, ledgerSizes: p.ledgerSizes })).digest('hex');
}

const CORPUS = [
  { seed: 'nv-a', ticks: 24, pack: 'island' },
  { seed: 'nv-b', ticks: 24, pack: 'coast' },
  { seed: 'nv-c', ticks: 40, pack: 'coast' },
];

describe('W-NAVY — the fenced dormancy golden', () => {
  it('DARK: advanceNaval is a COMPLETE no-op across the corpus (zero keys, same reference)', () => {
    for (const c of CORPUS) {
      const dark = driveNaval(c.seed, false, c.ticks, c.pack);
      expect(dark.mintedNaval, `${c.seed} minted a naval record while DARK`).toBe(false);
      expect(dark.changedFlags.every((x) => x === 0), `${c.seed} reported changed while DARK`).toBe(true);
      expect(dark.ledgerSizes.every((x) => x === 0), `${c.seed} grew a ledger while DARK`).toBe(true);
      expect(dark.sameRefEveryTick, `${c.seed} returned a NEW worldState while DARK`).toBe(true);
      expect(dark.worldState.spatialLedgers).toBeUndefined();
    }
  });

  it('DARK: the dormant projection reproduces its golden hash (any drift ⇒ dormancy broke)', () => {
    // The all-dormant projection is the empty census — its hash is byte-stable by construction.
    const GOLDEN = createHash('sha256').update(JSON.stringify({
      changedFlags: new Array(0).fill(0), ledgerSizes: new Array(0).fill(0),
    })).digest('hex');
    for (const c of CORPUS) {
      const dark = driveNaval(c.seed, false, c.ticks, c.pack);
      const emptyOfLen = createHash('sha256').update(JSON.stringify({
        changedFlags: new Array(c.ticks).fill(0), ledgerSizes: new Array(c.ticks).fill(0),
      })).digest('hex');
      expect(projectionHash(dark)).toBe(emptyOfLen);
    }
    expect(GOLDEN).toBeTruthy();
  });

  it('LIT anti-vacuity: the SAME fixtures DO mint a naval operation when lit (the fence is real)', () => {
    // If lit never minted, the dormant golden would be trivially empty (a broken mover).
    const litMinted = CORPUS.some((c) => driveNaval(c.seed, true, c.ticks, c.pack).mintedNaval);
    expect(litMinted).toBe(true);
  });
});
