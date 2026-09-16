/**
 * npcInteriorityRead.test.js — INTERIORITY-LITE (DESIGN_VISION_WAVE V-24c). The pure derived
 * "disposition & wants" projection: player-safe wants/disposition from existing display state,
 * plus a DM-truth block (bonds/grudges/credibility/covert) gated behind includeGroundTruth. Pins:
 * pure/deterministic · zero-write · SECRETS-SEAM-SAFE (a non-DM audience never sees a covert mark,
 * bond, grudge, or credibility) · renders from a real fixture.
 */
import { describe, it, expect } from 'vitest';
import { npcInteriority, npcCredibilityWord } from '../../src/domain/display/npcInteriorityRead.js';

const NPC = () => ({
  id: 'aldis', name: 'Aldis', role: 'Guildmaster', influence: 'high',
  goal: { short: 'restore the old temple' },
  personality: { dominant: 'stern', ambition: 'reclaim his house', ideal: 'order above all' },
  loyalty: 'the crown', fear: 'the mob',
});
const CORRUPT_NPC = () => ({ ...NPC(), corrupt: true, corruptTies: { criminalInstitution: 'The Coin Rats' }, secret: { what: 'skims the temple alms' } });
// The engine sidecar: bonds/grudges (npcLadder) + credibility — DM truth by construction.
const WORLD = () => ({
  spatialLedgers: {
    npcLadder: { npcs: { n1: {
      bonds: { n2: { sev: 0.7, week: 10, kind: 'loyalty' } },
      grudges: { n3: { sev: 0.5, week: 12, kind: 'contest_loss' } },
    } } },
    npcCredibility: { n1: { score: 8, lastUpdateTick: 100 } },
  },
});

describe('npcInteriority — player-safe disposition & wants', () => {
  it('composes wants (goal + ambition + ideal) and disposition (temperament + standing + loyalty + fear)', () => {
    const view = npcInteriority({ npc: NPC() });
    expect(view.present).toBe(true);
    expect(view.wants).toEqual(['restore the old temple', 'reclaim his house', 'order above all']);
    expect(view.disposition).toEqual(['stern', 'commanding', 'the crown', 'the mob']);
    expect(view.groundTruth, 'no DM-truth block in the player view').toBeUndefined();
  });

  it('returns null for a garbage / empty NPC (inert, no crash)', () => {
    expect(npcInteriority({ npc: null })).toBeNull();
    expect(npcInteriority({ npc: {} })).toBeNull();
    expect(npcInteriority({})).toBeNull();
  });

  it('is deterministic — same inputs, deep-equal output', () => {
    expect(npcInteriority({ npc: NPC() })).toEqual(npcInteriority({ npc: NPC() }));
  });
});

describe('npcInteriority — the secrets seam (covert never surfaces to a non-DM)', () => {
  it('player view (includeGroundTruth=false) HIDES the compromise + secret, even when set', () => {
    const view = npcInteriority({ npc: CORRUPT_NPC(), includeGroundTruth: false });
    expect(view.groundTruth).toBeUndefined();
    // and nothing covert leaks into the player-safe arrays
    const flat = JSON.stringify(view);
    expect(flat).not.toContain('skims the temple alms');
    expect(flat).not.toContain('compromised');
  });

  it('DM view (includeGroundTruth=true) SURFACES the compromise + secret', () => {
    const view = npcInteriority({ npc: CORRUPT_NPC(), includeGroundTruth: true });
    expect(view.groundTruth.compromised).toBe('compromised');
    expect(view.groundTruth.secret).toBe('skims the temple alms');
  });

  it('player view HIDES the relational sidecar (bonds/grudges/credibility), DM view surfaces it', () => {
    const player = npcInteriority({ npc: NPC(), worldState: WORLD(), nid: 'n1', tick: 100, includeGroundTruth: false });
    expect(player.groundTruth, 'no relational truth for a non-DM').toBeUndefined();
    expect(JSON.stringify(player)).not.toContain('n2'); // bonded peer id never leaks

    const dm = npcInteriority({ npc: NPC(), worldState: WORLD(), nid: 'n1', tick: 100, includeGroundTruth: true });
    expect(dm.groundTruth.bonds).toEqual([{ nid: 'n2', kind: 'loyalty', sev: 0.7 }]);
    expect(dm.groundTruth.grudges).toEqual([{ nid: 'n3', kind: 'contest_loss', sev: 0.5 }]);
    expect(dm.groundTruth.credibility).toEqual({ score: 8, band: 'trusted' });
  });

  it('DM view with no sidecar yields no relational block (present covert-only)', () => {
    const dm = npcInteriority({ npc: CORRUPT_NPC(), includeGroundTruth: true });
    expect(dm.groundTruth.bonds).toBeUndefined();
    expect(dm.groundTruth.grudges).toBeUndefined();
    expect(dm.groundTruth.credibility).toBeUndefined();
  });
});

describe('npcInteriority — purity (ZERO persisted writes)', () => {
  it('never mutates its inputs (the read-model contract)', () => {
    const npc = CORRUPT_NPC();
    const world = WORLD();
    const npcBefore = JSON.stringify(npc);
    const worldBefore = JSON.stringify(world);
    npcInteriority({ npc, worldState: world, nid: 'n1', tick: 100, includeGroundTruth: true });
    expect(JSON.stringify(npc)).toBe(npcBefore);
    expect(JSON.stringify(world)).toBe(worldBefore);
  });
});

describe('npcCredibilityWord', () => {
  it('bands a signed score', () => {
    expect(npcCredibilityWord(8)).toBe('trusted');
    expect(npcCredibilityWord(-8)).toBe('doubted');
    expect(npcCredibilityWord(0)).toBe('even');
    expect(npcCredibilityWord(2)).toBe('even');
  });
});
