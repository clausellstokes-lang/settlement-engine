/**
 * warFrontReadsGate.test.js — the ONE provenance-gated war-front read surface.
 *
 * channelIdFor keys a war_front on (type, from, to) only, so a hostile RELATIONSHIP
 * label and a real war-layer SIEGE collide on the same channel id. Treating any
 * confirmed war_front as a siege is the phantom-siege class of bug. The gate lives in
 * warFrontReads.js and is now the SINGLE definition warDeployment + its sibling readers
 * (deploymentReturn / settlementStrategy / occupation) share. These tests pin the gate's
 * behaviour and assert the readers actually route through it (so it can't silently drift
 * back into per-file ungated copies).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  isLiveWarFront, isRelationshipMintedFront, warFrontsInto, warFrontsFrom,
} from '../../src/domain/worldPulse/warFrontReads.js';

const rel = (from, to) => ({ type: 'war_front', status: 'confirmed', from, to, evidence: [{ source: 'relationship_label' }] });
const war = (from, to) => ({ type: 'war_front', status: 'confirmed', from, to, evidence: [{ source: 'war_layer_deploy' }] });
// A war-layer siege whose channel ALSO accreted a relationship_label row — war-layer
// ownership is the sticky tag, so it still reads as a live siege.
const aliased = (from, to) => ({ type: 'war_front', status: 'confirmed', from, to, evidence: [{ source: 'relationship_label' }, { source: 'war_layer_deploy' }] });

describe('warFrontReads — the shared siege gate', () => {
  it('isLiveWarFront: war-layer yes, pure hostile-relationship no, aliased war-layer yes', () => {
    expect(isLiveWarFront(war('A', 'B'))).toBe(true);
    expect(isLiveWarFront(rel('A', 'B'))).toBe(false);
    expect(isLiveWarFront(aliased('A', 'B'))).toBe(true);
    expect(isRelationshipMintedFront(rel('A', 'B'))).toBe(true);
    expect(isRelationshipMintedFront(aliased('A', 'B'))).toBe(false);
    // non-confirmed / non-war_front are never live sieges
    expect(isLiveWarFront({ type: 'war_front', status: 'proposed', evidence: [{ source: 'war_layer_deploy' }] })).toBe(false);
    expect(isLiveWarFront({ type: 'trade', status: 'confirmed' })).toBe(false);
    expect(isLiveWarFront(null)).toBe(false);
  });

  it('warFrontsInto/From count only live war-layer fronts, codepoint-sorted, relationship fronts excluded', () => {
    const graph = { channels: [war('X', 'T'), rel('Y', 'T'), war('Z', 'T'), war('T', 'Q')] };
    expect(warFrontsInto(graph, 'T')).toEqual(['X', 'Z']); // Y is relationship-only → not a besieger
    expect(warFrontsFrom(graph, 'T')).toEqual(['Q']);
    // a purely-hostile target has NO besiegers (the phantom-siege case)
    expect(warFrontsInto({ channels: [rel('Y', 'T')] }, 'T')).toEqual([]);
    expect(warFrontsFrom({ channels: [rel('T', 'Y')] }, 'T')).toEqual([]);
  });

  // Drift sentinel: every war-layer reader must route siege detection through the shared
  // gate. If a reader reverts to a local ungated `channel.type === 'war_front'` loop it
  // drops this import and this fails — the phantom-siege gate can't silently regress.
  it('warDeployment + the three sibling readers all import the shared gate', () => {
    for (const f of ['warDeployment.js', 'deploymentReturn.js', 'settlementStrategy.js', 'occupation.js']) {
      const src = readFileSync(new URL(`../../src/domain/worldPulse/${f}`, import.meta.url), 'utf8');
      expect(src, `${f} must import from ./warFrontReads.js`).toMatch(/from '\.\/warFrontReads\.js'/);
    }
  });
});
