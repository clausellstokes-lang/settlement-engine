/**
 * roadsParticipation.test.js — THE PARTICIPATION CHOKEPOINT (R-4a; DESIGN_THE_ROADS.md §8).
 *
 *  1. THE MASTER GATE — buildWorldSnapshot excludes an OFF-STAGE NPC (a hostage OR a
 *     DM-shelved NPC) from the settlement every pulse kernel reads, while a TRAVELLER stays
 *     in (travel is narrative, captivity is mechanical). One edit shelves a hostage from
 *     agency/growth/recruitment/blocs/ladder/councils/coups.
 *  2. THE LADDER BELT — eligibleMembersOf excludes a hostage (defense-in-depth).
 *  3. THE INVENTORY RATCHET — the set of `.npcs` readers in worldPulse+spatial is PINNED
 *     (the §8 census). A NEW reader trips this test until it is dispositioned (widen the belt
 *     or confirm it is via-snapshot) — the structural-prevention discipline.
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { eligibleMembersOf, ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';

describe('participation chokepoint — the master gate (buildWorldSnapshot, §8)', () => {
  const npcs = [
    { id: 'home', name: 'Homebody', importance: 'notable' },
    { id: 'trav', name: 'Traveller', importance: 'notable', whereabouts: { state: 'traveling', placeId: 'd', missionId: 'm1' } },
    { id: 'visit', name: 'Visitor', importance: 'notable', whereabouts: { state: 'visiting', placeId: 'd', missionId: 'm2' } },
    { id: 'hos', name: 'Hostage', importance: 'notable', whereabouts: { state: 'hostage', placeId: 'e', missionId: 'm3' } },
    { id: 'shelved', name: 'Shelved', importance: 'notable', stasis: { reason: 'imprisoned' } },
  ];
  const save = { id: 's', name: 'S', phase: 'canon', settlement: { name: 'S', npcs }, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
  const campaign = { id: 'c', settlementIds: ['s'], worldState: { tick: 0, simulationRules: {} } };

  it('a HOSTAGE and a DM-shelved NPC are excluded; a TRAVELLER/VISITOR and a home NPC stay in', () => {
    const snap = buildWorldSnapshot({ campaign, saves: [save], worldState: campaign.worldState });
    const present = new Set((snap.byId.get('s').settlement.npcs || []).map((n) => n.id));
    expect(present.has('home'), 'home NPC participates').toBe(true);
    expect(present.has('trav'), 'a traveller still participates (travel is narrative)').toBe(true);
    expect(present.has('visit'), 'a visitor still participates').toBe(true);
    expect(present.has('hos'), 'a HOSTAGE is off-stage (mechanical absence)').toBe(false);
    expect(present.has('shelved'), 'a DM-shelved NPC is off-stage').toBe(false);
  });

  it('the raw save roster is UNTOUCHED — off-stage NPCs persist (no-death; nothing dropped)', () => {
    buildWorldSnapshot({ campaign, saves: [save], worldState: campaign.worldState });
    expect(save.settlement.npcs.map((n) => n.id).sort()).toEqual(['home', 'hos', 'shelved', 'trav', 'visit']);
  });

  it('dormant (no off-stage NPC) ⇒ same settlement reference (zero allocation)', () => {
    const plain = { id: 'p', name: 'P', phase: 'canon', settlement: { name: 'P', npcs: [{ id: 'a', importance: 'notable' }] }, campaignState: { phase: 'canon', eventLog: [], locks: {} } };
    const snap = buildWorldSnapshot({ campaign: { ...campaign, settlementIds: ['p'] }, saves: [plain], worldState: campaign.worldState });
    expect(snap.byId.get('p').settlement, 'no allocation when nobody is off-stage').toBe(plain.settlement);
  });
});

describe('participation chokepoint — the ladder belt (eligibleMembersOf, §8)', () => {
  it('a hostage is excluded from ladder eligibility (defense-in-depth)', () => {
    const faction = { id: 'f1', name: 'Guild', isGoverning: true };
    const fkey = ladderFactionKey(faction);
    const settlement = {
      name: 'S', npcs: [
        { id: 'a', name: 'Alia', importance: 'key', factionAffiliation: 'Guild', structuralRank: 'dominant' },
        { id: 'b', name: 'Bram', importance: 'key', factionAffiliation: 'Guild', structuralRank: 'dominant', whereabouts: { state: 'hostage', placeId: 'e', missionId: 'm' } },
      ],
    };
    const rows = eligibleMembersOf('s', settlement, faction, fkey);
    const ids = new Set(rows.map((r) => r.npcId));
    expect(ids.has(npcId('s', settlement.npcs[0], 0)), 'the free member is eligible').toBe(true);
    expect(ids.has(npcId('s', settlement.npcs[1], 1)), 'the hostage is NOT eligible').toBe(false);
  });
});

describe('participation chokepoint — the .npcs-reader inventory ratchet (§8 census)', () => {
  // Every reader below is DISPOSITIONED (§8 table): worldSnapshot = THE MASTER GATE (widened
  // to isOffStage); npcLadderState = the BELT (widened); roadsKernel = the roads mover (reads
  // the FULL roster to manage hostages); partyImpact = the RAW READER (deliberately ungated —
  // DM sovereignty); everything else is via-snapshot (protected by the gate, no edit). A NEW
  // reader added here must be dispositioned before this pin is updated.
  const EXPECTED = [
    'src/domain/worldPulse/applyWorldPulse.js',
    'src/domain/worldPulse/causeLifecycle.js',
    'src/domain/worldPulse/clergyTraitPlane.js',
    'src/domain/worldPulse/corruptionImpair.js',
    'src/domain/worldPulse/corruptionWeb.js',
    'src/domain/worldPulse/disposition.js',
    'src/domain/worldPulse/factionCapture.js',
    'src/domain/worldPulse/momentum.js',
    'src/domain/worldPulse/npcAgency.js',
    'src/domain/worldPulse/npcGrowthKernel.js',
    'src/domain/worldPulse/npcLadderChallenge.js',
    'src/domain/worldPulse/npcLadderKernel.js',
    'src/domain/worldPulse/npcLadderState.js',
    'src/domain/worldPulse/partyImpact.js',
    'src/domain/worldPulse/pulseKernel.js',
    'src/domain/worldPulse/religionLegitimacy.js',
    'src/domain/worldPulse/roadsKernel.js',
    'src/domain/worldPulse/settlementLifecycleFirstClass.js',
    'src/domain/worldPulse/successorNpc.js',
    'src/domain/worldPulse/worldSnapshot.js',
  ];
  it('the set of participation .npcs readers is exactly the dispositioned census (a new reader trips this)', () => {
    const out = execFileSync('grep', ['-rl', '\\.npcs', 'src/domain/worldPulse', 'src/domain/spatial'], { cwd: process.cwd(), encoding: 'utf-8' });
    const found = out.split('\n').filter((l) => l && !l.includes('.test.')).sort();
    expect(found).toEqual([...EXPECTED].sort());
  });
});
