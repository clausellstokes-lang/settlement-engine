/**
 * tests/domain/politicsEventsReligionG1c.test.js — G1c "POLITICS, EVENTS, RELIGION"
 *
 * Pins for the golden-shifting wave G1c (branch claude/review-fix-golden-track,
 * built on G1a/G1b). Each block locks the intended same-seed behavior change of one
 * fix. The existing GOLDEN manifests stayed byte-identical (conditional
 * materialization / dormancy) — the two behavior-assertion pins these fixes shifted
 * (clergyLegitimacyDrag, tierResourceDynamics) were updated in place and are recorded
 * in docs/GOLDEN_SHIFT_LEDGER.md. Fixes wired via documentation/deferral (core-4,
 * core-6, religion-3) are recorded in that ledger, not pinned here.
 */

import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { mapEventToPartyImpact } from '../../src/domain/events/partyEventLinkage.js';
import { eventConsumes } from '../../src/domain/events/batch.js';
import { twinDirectiveForEvent, crisisWithdraw, withStressorResolved } from '../../src/domain/crisisLifecycle.js';
import { discoverDependencyCandidates } from '../../src/domain/region/discoverDependencyCandidates.js';
import { advanceBeliefMaps, GOVERNING_SEAT_KEY, BELIEF_SEED_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { planInstitutionFate } from '../../src/domain/spatial/calamity.js';
import { expireStaleActorMajors } from '../../src/domain/worldPulse/actorMajorApproval.js';
import { buildPartyImpactOutcomes } from '../../src/domain/worldPulse/partyImpact.js';
import { evaluateNpcRules } from '../../src/domain/worldPulse/npcAgency.js';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const readSrc = (rel) => fs.readFileSync(path.join(ROOT, 'src', rel), 'utf8');

// ── GROUP A — the DM's verbs reach the live world ────────────────────────────

describe('[domain-events-region-4] party-caused KILL_LEADER produces the world ripple', () => {
  it('maps to remove_npc (matching KILL_NPC), not null', () => {
    const action = mapEventToPartyImpact(
      { type: 'KILL_LEADER', targetId: 'Lord Mayor Aldric', partyCaused: true, description: 'The party slew the tyrant.' },
      'save-1',
    );
    expect(action).toBeTruthy();
    expect(action.kind).toBe('remove_npc');
    expect(action.npcId).toBe('Lord Mayor Aldric');
    expect(action.settlementId).toBe('save-1');
  });
  it('a NON-party-caused KILL_LEADER still ripples nothing (attribution-only gate holds)', () => {
    expect(mapEventToPartyImpact({ type: 'KILL_LEADER', targetId: 'X', partyCaused: false }, 'save-1')).toBeNull();
  });
});

describe('[domain-events-region-5] IMPOSE_CORRUPTION gets a hard NPC ref', () => {
  it('eventConsumes returns an npc ref (a phantom NPC now blocks instead of no-oping)', () => {
    const refs = eventConsumes({ type: 'IMPOSE_CORRUPTION', targetId: 'Guildmaster Vek' });
    expect(refs).toContainEqual({ kind: 'npc', ref: 'Guildmaster Vek' });
  });
  it('no targetId ⇒ no ref (nothing to hard-require)', () => {
    expect(eventConsumes({ type: 'IMPOSE_CORRUPTION' })).toEqual([]);
  });
});

describe('[domain-events-region-9] PLAGUE strains the CANONICAL healing vocabulary', () => {
  it('mutateWorld imports the shared classifier and drops the private 4-class regex', () => {
    const src = readSrc('domain/events/mutateWorld.js');
    expect(src).toMatch(/import\s*\{\s*HEALING_INSTITUTION_PATTERN\s*\}\s*from\s*'\.\.\/healingLedger\.js'/);
    expect(src).toMatch(/HEALING_INSTITUTION_PATTERN\.test\(/);
    expect(src).not.toContain('/hospital|temple|infirm|healer/i');
  });
});

describe('[domain-events-region-6] hostile pairs do not surface a trade dependency', () => {
  const save = (id, name, s = {}) => ({
    id, name, tier: 'town',
    settlement: {
      id: `settlement.${id}`, name, tier: 'town', population: 5000,
      config: { tradeRouteAccess: 'road', ...(s.config || {}) },
      institutions: [], activeConditions: [],
      economicState: { primaryExports: s.exports || [], primaryImports: s.imports || [], activeChains: [], ...(s.economicState || {}) },
      neighbourNetwork: s.neighbourNetwork || [],
    },
  });
  const withGoods = (rel) => {
    const a = save('a', 'Ironmere', { exports: ['Grain'], imports: [], neighbourNetwork: [{ id: 'b', neighbourName: 'Grimhold', relationshipType: rel }] });
    const b = save('b', 'Grimhold', { exports: [], imports: ['Grain'], neighbourNetwork: [{ id: 'a', neighbourName: 'Ironmere', relationshipType: rel }] });
    return discoverDependencyCandidates(a, b);
  };
  it('a FRIENDLY pair with matching goods surfaces a trade_dependency', () => {
    const goodsChans = withGoods('trade_partner').filter(c => c.type === 'trade_dependency' || c.type === 'export_market');
    expect(goodsChans.length).toBeGreaterThan(0);
  });
  it('a HOSTILE pair with the SAME goods surfaces NO trade_dependency/export_market', () => {
    const goodsChans = withGoods('hostile').filter(c => c.type === 'trade_dependency' || c.type === 'export_market');
    expect(goodsChans).toEqual([]);
  });
});

describe('[domain-events-region-2] REMOVED_THREAT records a resolved-suppression', () => {
  it('withStressorResolved dual-writes config + _config, striking added + adding resolved', () => {
    const s = { config: { stressorEdits: { added: [{ type: 'siege' }], resolved: [] } }, _config: {} };
    const next = withStressorResolved(s, ['siege', 'Bandit siege']);
    expect(next.config.stressorEdits.resolved.map(r => r.toLowerCase())).toContain('siege');
    expect(next.config.stressorEdits.added).toEqual([]); // the authored 'siege' entry is struck
    expect(next._config.stressorEdits.resolved).toEqual(next.config.stressorEdits.resolved); // dual-written
  });
  it('is an identity no-op when the type is already resolved and unadded', () => {
    const s = { config: { stressorEdits: { added: [], resolved: ['siege'] } } };
    expect(withStressorResolved(s, ['siege'])).toBe(s);
  });
});

describe('[domain-events-region-3] the PLAGUE event mints its disease_outbreak twin', () => {
  it('twinDirectiveForEvent(PLAGUE) injects a disease_outbreak (M11a-visible), not null', () => {
    const dir = twinDirectiveForEvent({ type: 'PLAGUE', targetId: 'Red Death', payload: { severity: 0.7 } });
    expect(dir).toEqual({ action: 'inject', stressor: { type: 'disease_outbreak', label: 'Red Death', severity: 0.7 } });
  });
  it('undo is symmetric — crisisWithdraw(PLAGUE) withdraws the disease_outbreak twin', () => {
    const w = crisisWithdraw({ event: { type: 'PLAGUE', targetId: 'Red Death' }, undo: { campaignTwin: { type: 'disease_outbreak' } } });
    expect(w).toEqual({ action: 'withdraw', type: 'disease_outbreak', twin: { type: 'disease_outbreak' } });
  });
});

// ── GROUP B — worldPulse core social fixes ───────────────────────────────────

describe('[worldpulse-core-2] party remove_npc drops the NPC from the roster', () => {
  const snapshotWith = (npcs) => ({ byId: new Map([['s1', { id: 's1', settlement: { id: 'settlement.s1', name: 'Ashford', npcs } }]]) });
  it('the removed NPC is spliced from the settlement roster (dossier stops listing a corpse)', () => {
    const snapshot = snapshotWith([{ id: 'npc.bob', name: 'Bob' }, { id: 'npc.alice', name: 'Alice' }]);
    const worldState = { npcStates: { 's1:bob': { settlementId: 's1', name: 'Bob' } } };
    const built = buildPartyImpactOutcomes({ kind: 'remove_npc', settlementId: 's1', npcId: 'Bob', magnitude: 1 }, { worldState, snapshot, tick: 3 });
    expect(built.ok).toBe(true);
    const override = built.settlementOverrides.get('s1');
    expect(override).toBeTruthy();
    expect(override.npcs.map(n => n.name)).toEqual(['Alice']);
  });
  it('evaluateNpcRules skips a state flagged removed (no headline for a corpse)', () => {
    const snapshot = {
      byId: new Map([['s1', { id: 's1', settlement: { name: 'Ashford' } }]]),
      settlements: [{ id: 's1', settlement: { name: 'Ashford' } }],
      worldState: {
        tick: 5,
        npcStates: {
          gone: { npcId: 'gone', settlementId: 's1', name: 'Ghost', removed: true, ambition: 0.9, goalProgress: { long: 1 }, roleArchetype: 'civic' },
        },
      },
    };
    const out = evaluateNpcRules(snapshot, null, { tick: 6 });
    expect(out.every(c => JSON.stringify(c).indexOf('"gone"') === -1)).toBe(true);
  });
});

describe('[worldpulse-core-3] actor-major expiry counts DM-visible time', () => {
  const wsWith = (ticks) => ({ proposals: ticks.map((t, i) => ({ id: `p${i}`, status: 'pending', tick: t, outcome: { candidateType: 'strategy_deploy' } })) });
  it('a proposal minted DURING the advance is NOT expired within it', () => {
    // Advance ran ticks 5→12; a war declaration proposed at tick 5 must survive to the panel.
    const ws = wsWith([5]);
    const after = expireStaleActorMajors(ws, 12, 'now', /* intervalStartTick */ 5);
    expect(after.proposals[0].status).toBe('pending');
  });
  it('a proposal that PREDATES the advance still ages out', () => {
    const ws = wsWith([0]); // minted before the advance began at tick 5
    const after = expireStaleActorMajors(ws, 12, 'now', 5);
    expect(after.proposals[0].status).toBe('expired');
  });
  it('WITHOUT the DM-time guard (single-tick default) the during-advance proposal would expire — proving the guard bites', () => {
    const ws = wsWith([5]);
    const after = expireStaleActorMajors(ws, 12, 'now'); // default intervalStartTick = 12
    expect(after.proposals[0].status).toBe('expired');
  });
});

// ── GROUP C — religion/trade (structural guards for private consumers) ───────

describe('[worldpulse-religion-trade-1] temper reads the derivation, not the retired stored axis', () => {
  it('SOURCE GUARD: no worldPulse engine file keys TEMPER_POS on a stored temperamentAxis', () => {
    const dir = path.join(ROOT, 'src', 'domain', 'worldPulse');
    const offenders = [];
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith('.js')) continue;
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      // Flag a TEMPER_POS lookup indexed by any expression containing temperamentAxis.
      if (/TEMPER_POS\s*\[[^\]]*temperamentAxis/.test(src)) offenders.push(f);
    }
    expect(offenders).toEqual([]);
  });
  it('both TEMPER_POS lenses recognize the derived spelling "peacelike" (→ 0, not the 0.5 miss)', () => {
    for (const rel of ['worldPulse/religionLegitimacy.js', 'worldPulse/religiousContest.js']) {
      expect(readSrc(`domain/${rel}`)).toMatch(/peacelike:\s*0/);
    }
  });
});

describe('[worldpulse-religion-trade-5] disposition keys on the AGGRESSOR', () => {
  it('candidateBase keys the disposition factor on actorSaveId (falling back to the attributed save)', () => {
    expect(readSrc('domain/worldPulse/relationshipRuleHelpers.js')).toMatch(/actorSaveId\s*\|\|\s*targetSaveId/);
  });
  it('the five victim-attributed adversarial candidates pass an explicit actorSaveId', () => {
    const src = readSrc('domain/worldPulse/relationshipRulesAdversarial.js');
    for (const actor of ['aggressorId', 'imposerId', 'supplierId', 'extractorId', 'exploiterId']) {
      expect(src).toMatch(new RegExp(`actorSaveId:\\s*${actor}`));
    }
  });
});

describe('[worldpulse-religion-trade-3] the dead stance half is formalized as a deferral', () => {
  it('deityStance documents aggression/treatyDurability as a deferred build-ahead (not silently wired/excised)', () => {
    const src = readSrc('domain/worldPulse/deityStance.js');
    expect(src).toMatch(/worldpulse-religion-trade-3/);
    expect(src).toMatch(/return \{ aggression, cooperation, betrayalHazard, treatyDurability \}/); // fields retained
  });
});

// ── GROUP D — spatial ────────────────────────────────────────────────────────

describe('[spatial-engine-5] belief full-prune does not reset fog to perfect truth', () => {
  const settlements = [
    { id: 'a', name: 'A', settlement: { name: 'a', tier: 'city', population: 40000, config: {} } },
    { id: 'b', name: 'B', settlement: { name: 'b', tier: 'village', population: 300, config: {} } },
  ];
  const snapshotOf = () => ({ settlements, byId: new Map(settlements.map(s => [s.id, s])), regionalGraph: { edges: [{ id: 'e.ab', from: 'a', to: 'b', relationshipType: 'hostile' }] } });
  const rules = { infoMode: 'perfect_delayed' };

  it('a NEVER-seeded (null) ledger cold-starts to ground truth (confidence 1.0)', () => {
    const { next } = advanceBeliefMaps({ snapshot: snapshotOf(), pressureIdx: null, worldState: { spatialCanonVersion: 1, simulationRules: rules }, tick: 7 });
    expect(next?.a?.[GOVERNING_SEAT_KEY]?.b?.confidence01).toBe(1);
  });
  it('a DECAYED-EMPTY ledger (only the seed sentinel, same canon version) does NOT re-seed', () => {
    const ws = { spatialCanonVersion: 1, simulationRules: rules, spatialLedgers: { beliefMaps: { [BELIEF_SEED_KEY]: 1 } } };
    const { next } = advanceBeliefMaps({ snapshot: snapshotOf(), pressureIdx: null, worldState: ws, tick: 40 });
    expect(next?.a).toBeUndefined();       // no ground-truth re-seed
    expect(next?.b).toBeUndefined();
  });
  it('a GENUINE re-canonize (version bump) re-seeds to ground truth', () => {
    const ws = { spatialCanonVersion: 2, simulationRules: rules, spatialLedgers: { beliefMaps: { [BELIEF_SEED_KEY]: 1 } } };
    const { next } = advanceBeliefMaps({ snapshot: snapshotOf(), pressureIdx: null, worldState: ws, tick: 41 });
    expect(next?.a?.[GOVERNING_SEAT_KEY]?.b?.confidence01).toBe(1);
  });
});

describe('[spatial-engine-6] calamity demote does not mint a duplicate institution', () => {
  it('a same-name lesser already on the roster (any status) blocks the rename-and-mint (fall through, no demote)', () => {
    const demotesTo = (name) => (name === "Mages' guild" ? "Wizard's tower" : null);
    // A ruined 'Wizard's tower' already exists — demoting the guild to it would mint a duplicate id/name.
    const alreadyStanding = (n) => ["Wizard's tower"].some(nm => nm.toLowerCase() === n.toLowerCase());
    const plan = planInstitutionFate({ name: "Mages' guild", demotesTo, alreadyStanding, categoryMembers: () => [] });
    expect(plan.fate).not.toBe('demote'); // falls through to destroy (no free clone)
  });
  it('with NO same-name collision the greater still demotes normally', () => {
    const demotesTo = (name) => (name === "Mages' guild" ? "Wizard's tower" : null);
    const plan = planInstitutionFate({ name: "Mages' guild", demotesTo, alreadyStanding: () => false, categoryMembers: () => [] });
    expect(plan).toEqual({ name: "Mages' guild", fate: 'demote', demotedTo: "Wizard's tower", collapsedAway: [] });
  });
  it('the demote branch drops the GREATER identity prose (description/tags reset)', () => {
    const src = readSrc('domain/worldPulse/calamityKernel.js');
    expect(src).toMatch(/description:\s*''/);
    expect(src).toMatch(/tags:\s*\[\]/);
  });
});
