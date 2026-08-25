/**
 * corruptionWebPins.test.js — W-DOCTRINE-3 (THE CORRUPTION WEB) pin set.
 * DESIGN_CORRUPTION_WEB.md §7. Built in the design's own order; the pins for a
 * given phase land with that phase. Phase A (resolver + attribution) pins:
 *
 *   • THE RESOLVER (§1): resolveLeash normalizes every legacy/explicit corruptTies
 *     shape into ONE typed leash — absent ⇒ derived-as-local (dormancy), the
 *     already-shipping foreignPatron ⇒ a foreign_settlement leash, an explicit
 *     leash object ⇒ itself, a cutout ⇒ local attribution with a patron annotation.
 *   • THE INNOCENT-GUILD PIN (§4): a FOREIGN conspirator's exposure attributes NO
 *     local criminal organization (criminalInstitution === null), so the impairment
 *     pass never blames the local guild. The LOCAL path stays byte-identical (a
 *     local corruption still names + impairs its tied org).
 */
import { describe, it, expect } from 'vitest';
import { resolveLeash, isForeignLeashKind } from '../../src/domain/corruptionLeash.js';
import { ensureNpcStates, advanceNpcCorruption, npcId, mirrorCorruptionOntoSettlement } from '../../src/domain/worldPulse/npcAgency.js';
import { applyCorruptionImpairments } from '../../src/domain/worldPulse/corruptionImpair.js';
import { advanceFactionCapture } from '../../src/domain/worldPulse/factionCapture.js';
import { computeGuildStrengthBy } from '../../src/domain/worldPulse/thievesGuild.js';
import {
  corruptionWebActive, advanceCorruptionWeb, foreignGripOf, directionBias,
  assetSightFidelityOf, rawChannelQuality, obligationDebt01, foreignAssetsByPatron,
  applyForeignExposureBlowback, foreignExposuresFrom, exposedCorruptionForPair, foreignEndpointLive,
  recruitmentWeight, officialPay01,
  CORRUPTION_WEB_TUNING,
} from '../../src/domain/worldPulse/corruptionWeb.js';
import { advanceWarReasons, reasonPairKey, scoreCorruptionExposed } from '../../src/domain/worldPulse/warReasons.js';
import { advanceCauseLifecycle } from '../../src/domain/worldPulse/causeLifecycle.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { credibilityScoreOf } from '../../src/domain/worldPulse/informationStatecraft.js';
import { createPRNG } from '../../src/kernel/prng.js';

describe('W-DOCTRINE-3 §1 — resolveLeash chokepoint (normalize on read; no migration)', () => {
  it('absent corruptTies ⇒ derived-as-local, no local org named, not foreign (dormancy)', () => {
    const l = resolveLeash({ name: 'X' });
    expect(l.kind).toBe('local_org');
    expect(l.foreign).toBe(false);
    expect(l.criminalInstitution).toBe(null);
    expect(l.covert).toBe(true);
  });

  it('legacy corruptTies.criminalInstitution ⇒ local_org with that org (byte-identical read)', () => {
    const l = resolveLeash({ corruptTies: { criminalInstitution: 'The Shrouded Hand', thievesGuild: 'The Shrouded Hand' } });
    expect(l.kind).toBe('local_org');
    expect(l.foreign).toBe(false);
    expect(l.criminalInstitution).toBe('The Shrouded Hand');
  });

  it('betrayal-seed corruptTies.foreignPatron ⇒ foreign_settlement, NEVER a local org (§4)', () => {
    const l = resolveLeash({ corruptTies: { criminalInstitution: null, thievesGuild: null, foreignPatron: 'crown', conspiracy: 'foreign_sponsored' } });
    expect(l.kind).toBe('foreign_settlement');
    expect(l.foreign).toBe(true);
    expect(l.settlementId).toBe('crown');
    expect(l.criminalInstitution).toBe(null); // the innocent-guild fix at the source
    expect(l.conspiracy).toBe('foreign_sponsored');
  });

  it('an explicit cutout leash keeps the LOCAL org as its attribution (patron is an annotation)', () => {
    const l = resolveLeash({ corruptTies: { criminalInstitution: 'Dockside Fence', leash: { kind: 'cutout', viaLocalOrg: 'Dockside Fence', settlementId: 'crown', covert: true } } });
    expect(l.kind).toBe('cutout');
    expect(l.foreign).toBe(false);                       // local machinery runs untouched
    expect(l.criminalInstitution).toBe('Dockside Fence'); // named + impaired locally
    expect(l.settlementId).toBe('crown');                 // the patron rides as a second-hop annotation
  });

  it('an explicit foreign_faction leash is foreign with no local org', () => {
    const l = resolveLeash({ corruptTies: { leash: { kind: 'foreign_faction', settlementId: 'crown', factionName: 'High Command', covert: true } } });
    expect(l.kind).toBe('foreign_faction');
    expect(l.foreign).toBe(true);
    expect(l.factionName).toBe('High Command');
    expect(l.criminalInstitution).toBe(null);
    expect(isForeignLeashKind('foreign_faction')).toBe(true);
    expect(isForeignLeashKind('local_org')).toBe(false);
    expect(isForeignLeashKind('cutout')).toBe(false);
  });
});

// A secure, prosperous city (exposure runs hot) with a LOCAL criminal org present
// and ONE compromised NPC. The NPC's leash is swapped between local and foreign.
const cityWith = (npc) => ({
  settlements: [{
    id: 's1', activeConditions: [],
    settlement: {
      tier: 'city',
      institutions: [{ name: 'Thieves Guild' }, { name: 'City Watch' }],
      economicState: {
        prosperity: 'Wealthy',
        safetyProfile: { safetyRatio: 3, blackMarketCapture: 5, compound: { criminalEffective: 15 } },
      },
      npcs: [npc],
    },
  }],
});

function drive(snap, seed) {
  let ws = ensureNpcStates({ npcStates: {} }, snap, createPRNG(`${seed}:init`).fork('init'));
  for (const id of Object.keys(ws.npcStates)) {
    ws.npcStates[id] = { ...ws.npcStates[id], corruption: true, corruptionProfile: { corrupted: true, vector: ws.npcStates[id].corruptionProfile?.vector || 'greed' }, dotRank: 3 };
  }
  const base = createPRNG(`${seed}:expose`).fork('corruption');
  const exposures = [];
  for (let t = 0; t < 60; t++) {
    const r = advanceNpcCorruption(ws, snap, base, { tick: t });
    ws = r.worldState;
    for (const e of r.exposures) exposures.push(e);
  }
  return exposures;
}

const guildImpaired = (settlement, exposures, now = '2026-01-01T00:00:00.000Z') => {
  const next = applyCorruptionImpairments(settlement, exposures, { now });
  const guild = (next.institutions || []).find((i) => i.name === 'Thieves Guild');
  return (guild?.impairments || []).length > 0;
};

describe('W-DOCTRINE-3 §4 — the innocent-guild pin (foreign exposure blames no local org)', () => {
  it('a FOREIGN conspirator exposed attributes NO local criminal org, and the local guild stays clean', () => {
    const snap = cityWith({
      name: 'Turned Envoy', personality: { flaw: 'deceitful' }, factionAffiliation: 'Envoys', institutionId: 'inst_envoys', importance: 'notable',
      corrupt: true, corruptionVector: 'forbidden_patron',
      corruptTies: { criminalInstitution: null, thievesGuild: null, foreignPatron: 'crown', conspiracy: 'foreign_sponsored' },
    });
    const exposures = drive(snap, 'foreign');
    expect(exposures.length).toBeGreaterThan(0);                              // anti-vacuity: exposure did fire
    expect(exposures.every((e) => e.criminalInstitution === null)).toBe(true); // NEVER names a local org
    expect(guildImpaired(snap.settlements[0].settlement, exposures)).toBe(false); // the innocent guild is untouched
  });

  it('a LOCAL corruption exposed still names + impairs its tied org (byte-identical local path)', () => {
    const snap = cityWith({
      name: 'Bent Sergeant', personality: { flaw: 'greedy' }, factionAffiliation: 'Watch', institutionId: 'inst_watch', importance: 'notable',
      corrupt: true, corruptionVector: 'greed',
      corruptTies: { criminalInstitution: 'Thieves Guild', thievesGuild: 'Thieves Guild' },
    });
    const exposures = drive(snap, 'local');
    expect(exposures.length).toBeGreaterThan(0);
    expect(exposures.every((e) => e.criminalInstitution === 'Thieves Guild')).toBe(true); // the tied org is named
    expect(guildImpaired(snap.settlements[0].settlement, exposures)).toBe(true);            // and impaired, as today
  });
});

// ── W-DOCTRINE-3b — THE FOREIGN LANES (§2 creation + §3 effects) ────────────────
// The lit substrate: beliefsActive (spatialCanonVersion + infoMode != omniscient) AND the
// virtual corruptionWebEnabled. Absent either ⇒ dormant ⇒ every read/mover a byte-neutral no-op.
const WEB_RULES = { infoMode: 'full', corruptionWebEnabled: true };

/** A single-settlement world with one corrupt seat-holder whose leash is under test, plus a
 *  faction that seat can capture. `webOn` toggles the virtual flag (dormant vs lit). */
function forkWorld({ corruptTies, webOn }) {
  const npc = { id: 'reeve', name: 'Reeve Var', importance: 'key', corrupt: true, corruptionVector: 'greed', corruptTies };
  const key = npcId('s1', npc, 0);
  const settlement = {
    tier: 'city',
    institutions: [{ name: 'The Shrouded Hand', category: 'criminal' }],
    economicState: { prosperity: 'Struggling', safetyProfile: { safetyRatio: 0.5, compound: { criminalEffective: 60 } } },
    powerStructure: { factions: [{ name: 'City Watch', faction: 'City Watch', power: 60 }] },
    npcs: [npc],
  };
  const snapshot = {
    settlements: [{ id: 's1', settlement }],
    byId: new Map([['s1', { id: 's1', settlement }]]),
    regionalGraph: { edges: [], channels: [] },
  };
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: webOn ? { ...WEB_RULES } : { infoMode: 'full' },
    npcStates: { [key]: { corruption: true, dotRank: 3 } },
    factionStates: { f1: { settlementId: 's1', name: 'City Watch', archetype: 'military', captureState: 'none', internalSeats: { leader: { npcId: key, dotRank: 3 } } } },
  };
  return { worldState, snapshot, key };
}

/** Drive the local capture climb N ticks and return the final guild strength for s1 (0 when
 *  no faction captured). The climb feeds thievesGuildStrength EXACTLY as today. */
function driveGuild({ worldState, snapshot }, seed, ticks = 60) {
  let ws = worldState;
  const base = createPRNG(seed);
  for (let t = 0; t < ticks; t++) {
    const gsb = computeGuildStrengthBy(ws, snapshot);
    ws = advanceFactionCapture(ws, snapshot, base.fork(`fc:${t}`), { tick: t, guildStrengthBy: gsb, religionActive: false }).worldState;
  }
  return { ws, guild: computeGuildStrengthBy(ws, snapshot).get('s1') || 0 };
}

describe('W-DOCTRINE-3b §3 — THE CAPTURE FORK (foreign grip ≠ thievesGuildStrength)', () => {
  const LOCAL = { criminalInstitution: 'The Shrouded Hand' };
  const FOREIGN = { leash: { kind: 'foreign_settlement', settlementId: 'crown', covert: true } };

  it('a LOCAL-leashed corrupt seat climbs capture and FEEDS the local guild (byte-identical path)', () => {
    const { guild } = driveGuild(forkWorld({ corruptTies: LOCAL, webOn: true }), 'fork-local');
    expect(guild).toBeGreaterThan(0);
  });

  it('THE FORK PIN: a FOREIGN-leashed seat feeds NO local guild strength (it grips its patron)', () => {
    const w = forkWorld({ corruptTies: FOREIGN, webOn: true });
    const { guild } = driveGuild(w, 'fork-foreign');
    expect(guild).toBe(0);                                            // the fork: no local capture
    expect(foreignGripOf(w.worldState, w.snapshot, 'crown')).toBeGreaterThan(0); // it grips the patron instead
  });

  it('DORMANT byte-identity: the SAME foreign seat with the web dark climbs exactly like a local one', () => {
    const { guild } = driveGuild(forkWorld({ corruptTies: FOREIGN, webOn: false }), 'fork-foreign');
    expect(guild).toBeGreaterThan(0); // gate off ⇒ the fork is inert ⇒ the accidental semantics persist
  });

  it('CUTOUT leaves the local path green: a cutout is NOT foreign — it feeds the guild, not the grip', () => {
    const CUTOUT = { criminalInstitution: 'The Shrouded Hand', leash: { kind: 'cutout', viaLocalOrg: 'The Shrouded Hand', settlementId: 'crown', covert: true } };
    const w = forkWorld({ corruptTies: CUTOUT, webOn: true });
    const { guild } = driveGuild(w, 'fork-cutout');
    expect(guild).toBeGreaterThan(0);                             // the local machinery runs untouched
    expect(foreignGripOf(w.worldState, w.snapshot, 'crown')).toBe(0); // the patron gets no grip from a cutout
  });
});

describe('W-DOCTRINE-3b §3 — the effect reads are byte-neutral when dormant', () => {
  it('grip / direction / paid-eyes all read 0 when the web is dark', () => {
    const { worldState, snapshot } = forkWorld({ corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'crown', covert: true } }, webOn: false });
    expect(corruptionWebActive(worldState)).toBe(false);
    expect(foreignGripOf(worldState, snapshot, 'crown')).toBe(0);
    expect(directionBias(worldState, snapshot, 's1', 'crown')).toBe(0);
    expect(assetSightFidelityOf(worldState, snapshot, 'crown', 's1')).toBe(0);
  });

  it('PAID EYES: a live asset grants the patron sight on the target (lit), 0 dormant', () => {
    const lit = forkWorld({ corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'crown', covert: true } }, webOn: true });
    expect(assetSightFidelityOf(lit.worldState, lit.snapshot, 'crown', 's1')).toBeGreaterThan(0);
    expect(directionBias(lit.worldState, lit.snapshot, 's1', 'crown')).toBeGreaterThan(0);
  });
});

// ── §2 CREATION — channel, scarcity, E0, the mint ────────────────────────────────

/** A two-court world: patron `p` (prosperous) channelled to target `t` (a clean corruptible
 *  clerk). `channel` selects the edge/obligation that opens (and weights) recruitment. */
function creationWorld({ obligation = 0, hostileEdge = true, criminalEdge = false, patronProsperity = 'Wealthy', preAssets = [] } = {}) {
  const clerk = { id: 'clerk', name: 'Clerk Ana', importance: 'notable', personality: { flaw: 'greedy' } };
  const tSettlement = { tier: 'town', institutions: [], economicState: { prosperity: 'Stable' }, npcs: [clerk] };
  const pSettlement = { tier: 'city', institutions: [], economicState: { prosperity: patronProsperity }, npcs: [] };
  const settlements = [
    { id: 'p', settlement: pSettlement },
    { id: 't', settlement: tSettlement },
  ];
  // Pre-seed the patron's existing foreign assets (for the scarcity cap) in throwaway targets.
  for (const targetId of preAssets) {
    const asset = { id: `a_${targetId}`, name: `Asset ${targetId}`, importance: 'notable', corrupt: true, corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'p', covert: true } } };
    settlements.push({ id: targetId, settlement: { tier: 'town', institutions: [], economicState: { prosperity: 'Stable' }, npcs: [asset] } });
  }
  const edges = [];
  if (hostileEdge) edges.push({ from: 'p', to: 't', relationshipType: 'hostile' });
  if (criminalEdge) edges.push({ from: 'p', to: 't', relationshipType: 'criminal_network' });
  const byId = new Map(settlements.map((s) => [String(s.id), s]));
  const npcStates = { 't:clerk': { corruption: false } };
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: { ...WEB_RULES },
    npcStates,
    ...(obligation > 0 ? { spatialLedgers: { obligations: { 't:p:grain_relief': { from: 't', to: 'p', kind: 'grain_relief', magnitude: obligation } } } } : {}),
  };
  const snapshot = { settlements, byId, regionalGraph: { edges, channels: [] } };
  return { worldState, snapshot };
}

describe('W-DOCTRINE-3b §2 — channel + obligation + scarcity', () => {
  it('NO channel ⇒ NO recruit (the hard §2 gate): channel quality is 0 without an edge', () => {
    const { snapshot } = creationWorld({ hostileEdge: false });
    expect(rawChannelQuality(snapshot, new Set(), 'p', 't')).toBe(0);
  });

  it('a hostile edge opens a channel; a criminal edge is stronger; the E1 obligation reads through', () => {
    const hostile = creationWorld({ hostileEdge: true });
    expect(rawChannelQuality(hostile.snapshot, new Set(), 'p', 't')).toBeCloseTo(CORRUPTION_WEB_TUNING.CHANNEL_HOSTILE, 5);
    const criminal = creationWorld({ hostileEdge: false, criminalEdge: true });
    expect(rawChannelQuality(criminal.snapshot, new Set(), 'p', 't')).toBeCloseTo(CORRUPTION_WEB_TUNING.CHANNEL_CRIMINAL, 5);
    const indebted = creationWorld({ obligation: 0.8 });
    expect(obligationDebt01(indebted.worldState, 't', 'p')).toBeCloseTo(0.8, 5);
  });

  it('§2 anti-vacuity: a channelled patron MINTS a covert foreign asset into the target', () => {
    // Criminal channel + full obligation ⇒ a high recruitment weight ⇒ the E0 gate fires within
    // the drive window. Deterministic (fixed seed); covert (no news).
    const { worldState, snapshot } = creationWorld({ criminalEdge: true, obligation: 1 });
    let ws = worldState;
    const base = createPRNG('mint-seed');
    let minted = null;
    for (let t = 0; t < 80 && !minted; t++) {
      const r = advanceCorruptionWeb({ snapshot, worldState: ws, rng: base.fork(`cw:${t}`), tick: t });
      ws = r.worldState;
      const st = ws.npcStates['t:clerk'];
      if (st && st.corruptionLeash) minted = st;
    }
    expect(minted, 'a foreign asset was minted within the drive window').toBeTruthy();
    expect(minted.corruption).toBe(true);
    expect(minted.corruptionLeash.kind).toBe('foreign_settlement');
    expect(minted.corruptionLeash.settlementId).toBe('p');
    expect(minted.corruptionLeash.covert).toBe(true);
    // The mint rode npcStates; the mirror carries the leash onto settlement.npcs (dual-write).
    const mirrored = mirrorCorruptionOntoSettlement(snapshot.byId.get('t').settlement, ws.npcStates, 't');
    expect(resolveLeash(mirrored.npcs[0]).foreign).toBe(true);
    expect(resolveLeash(mirrored.npcs[0]).settlementId).toBe('p');
  });

  it('§2 scarcity: a patron AT the per-patron realm cap DEFERS (visible), it does not mint', () => {
    // The patron already holds MAX_ASSETS_PER_PATRON foreign assets; a fresh channelled target.
    const preAssets = Array.from({ length: CORRUPTION_WEB_TUNING.MAX_ASSETS_PER_PATRON }, (_, i) => `held${i}`);
    const { worldState, snapshot } = creationWorld({ criminalEdge: true, obligation: 1, preAssets });
    const before = JSON.stringify(worldState.npcStates);
    const r = advanceCorruptionWeb({ snapshot, worldState, rng: createPRNG('cap').fork('cap:0'), tick: 0 });
    expect(r.changed).toBe(false); // no mint
    expect(JSON.stringify(r.worldState.npcStates)).toBe(before);
    expect(r.deferrals.some((d) => d.patronId === 'p' && d.targetId === 't' && d.reason === 'per_patron_cap')).toBe(true);
  });

  it('§2 scarcity: the cap counts the patron\'s live foreign assets through the resolver chokepoint', () => {
    const preAssets = ['h0', 'h1', 'h2'];
    const { snapshot } = creationWorld({ preAssets });
    const byPatron = foreignAssetsByPatron(snapshot);
    expect((byPatron.get('p') || []).length).toBe(3);
  });
});

// ── §4 THE FOREIGN CONSEQUENCE LANE (exposure → the blowback triple) ──────────────
// The lit rules for §4 need the credibility charge's substrate too (infoStatecraft).
const BLOWBACK_RULES = { infoMode: 'full', corruptionWebEnabled: true, infoStatecraftEnabled: true };

/** A two-court world (corrupted `c` ↔ patron `p`), a hostile edge between them, lit for §4.
 *  The exposure receipts are synthesized (the mover proves annotation separately below). */
function blowbackWorld({ webOn = true } = {}) {
  const cS = { tier: 'city', institutions: [{ name: 'Thieves Guild', category: 'criminal' }], economicState: { prosperity: 'Stable' }, powerStructure: { publicLegitimacy: { score: 55 } }, npcs: [] };
  const pS = { tier: 'city', institutions: [], economicState: { prosperity: 'Wealthy' }, powerStructure: { publicLegitimacy: { score: 60 } }, npcs: [] };
  const settlements = [{ id: 'c', settlement: cS }, { id: 'p', settlement: pS }];
  const byId = new Map(settlements.map((s) => [String(s.id), s]));
  const edges = [{ id: 'e_cp', from: 'c', to: 'p', relationshipType: 'hostile' }];
  const worldState = {
    spatialCanonVersion: 1,
    simulationRules: webOn ? { ...BLOWBACK_RULES } : { infoMode: 'full' },
    npcStates: {},
    relationshipStates: {},
  };
  const snapshot = { settlements, byId, regionalGraph: { edges, channels: [] } };
  return { worldState, snapshot };
}

/** A synthetic FOREIGN exposure receipt (as advanceNpcCorruption would annotate one). */
const foreignExposure = (over = {}) => ({
  npcId: 'c:reeve', settlementId: 'c', name: 'Reeve Var', kind: 'ousted',
  criminalInstitution: null, homeInstitution: 'City Watch',
  foreign: true, patronId: 'p', patronKind: 'foreign_settlement', patronFactionName: null, importance: 'key',
  ...over,
});

describe('W-DOCTRINE-3b §4 — the blowback triple (foreign exposure fires; local org untouched)', () => {
  it('THE TRIPLE: a foreign exposure mints the war-reason fuel + a grievance + a credibility charge + BOTH-court hits', () => {
    const { worldState, snapshot } = blowbackWorld({ webOn: true });
    const out = applyForeignExposureBlowback({
      worldState, snapshot, exposures: [foreignExposure()], graph: snapshot.regionalGraph, tick: 10, now: '2026-01-01T00:00:00.000Z',
    });
    expect(out.changed).toBe(true);
    // (1) the exposedCorruption ledger — the directed (corrupted→patron) magnitude.
    const ledger = getSpatialLedger(out.worldState, 'exposedCorruption');
    expect(ledger[reasonPairKey('c', 'p')].magnitude01).toBeGreaterThan(0);
    // (2) the people-held grievance: resentment + a foreign_corruption_exposed incident on the edge.
    const rel = out.worldState.relationshipStates.e_cp;
    expect(rel.resentment).toBeGreaterThan(0);
    expect((rel.recentIncidents || []).some((i) => i.type === 'foreign_corruption_exposed')).toBe(true);
    // (3) the credibility charge against the PATRON (deception-class ⇒ a negative stock).
    expect(credibilityScoreOf(out.worldState, 'p', 10)).toBeLessThan(0);
    // (4) BOTH-court legitimacy hits, returned for the kernel to stamp.
    expect(out.courtHits.map((h) => `${h.settlementId}:${h.role}`).sort()).toEqual(['c:corrupted', 'p:patron']);
    // NO local-org impairment: the blowback never touches institutions (the innocent-guild law holds).
    const guild = snapshot.byId.get('c').settlement.institutions.find((i) => i.name === 'Thieves Guild');
    expect((guild.impairments || []).length).toBe(0);
  });

  it('NEGATIVE CONTROL (dormancy): the web dark ⇒ the blowback is a byte-neutral no-op', () => {
    const { worldState, snapshot } = blowbackWorld({ webOn: false });
    const out = applyForeignExposureBlowback({
      worldState, snapshot, exposures: [foreignExposure()], graph: snapshot.regionalGraph, tick: 10, now: '2026-01-01T00:00:00.000Z',
    });
    expect(out.changed).toBe(false);
    expect(out.courtHits).toHaveLength(0);
    expect(getSpatialLedger(out.worldState, 'exposedCorruption')).toBeFalsy();
    expect(out.worldState).toBe(worldState); // no allocation on the dark path
  });

  it('NEGATIVE CONTROL: no FOREIGN exposure ⇒ no blowback (a local/absent exposure never fires the lane)', () => {
    const { worldState, snapshot } = blowbackWorld({ webOn: true });
    const localExp = { npcId: 'c:sarge', settlementId: 'c', name: 'Bent Sergeant', kind: 'demoted', criminalInstitution: 'Thieves Guild', homeInstitution: 'City Watch' };
    const out = applyForeignExposureBlowback({ worldState, snapshot, exposures: [localExp], graph: snapshot.regionalGraph, tick: 10, now: 'N' });
    expect(out.changed).toBe(false);
    expect(out.courtHits).toHaveLength(0);
  });

  it('foreignExposuresFrom drops non-foreign receipts and scales magnitude by importance + ousting', () => {
    const only = foreignExposuresFrom([
      foreignExposure({ importance: 'pillar', kind: 'ousted' }),
      { npcId: 'x', settlementId: 'c', name: 'Local', kind: 'demoted', criminalInstitution: 'Guild' }, // not foreign ⇒ dropped
    ]);
    expect(only).toHaveLength(1);
    const pillar = foreignExposuresFrom([foreignExposure({ importance: 'pillar', kind: 'ousted' })])[0].magnitude01;
    const notable = foreignExposuresFrom([foreignExposure({ importance: 'notable', kind: 'demoted' })])[0].magnitude01;
    expect(pillar).toBeGreaterThan(notable); // a pillar's public ousting is a bigger scandal
  });
});

describe('W-DOCTRINE-3b §4 — the exposedCorruption ledger read (decay + pair-key parity)', () => {
  it('exposedCorruptionForPair reads reasonPairKey-keyed entries and decays a scandal over years', () => {
    const ws = { spatialLedgers: { exposedCorruption: { [reasonPairKey('c', 'p')]: { magnitude01: 0.6, tick: 100 } } } };
    // Same tick: the full magnitude. PAIR-KEY PARITY: written with reasonPairKey, read back here.
    expect(exposedCorruptionForPair(ws, 'c', 'p', 100)).toBeCloseTo(0.6, 5);
    // Directionality: the reverse pair (patron→corrupted) holds nothing.
    expect(exposedCorruptionForPair(ws, 'p', 'c', 100)).toBe(0);
    // Decay: many ticks later the scandal has faded below the war-reason MIN_SCORE (0.05).
    const faded = exposedCorruptionForPair(ws, 'c', 'p', 100 + 60);
    expect(faded).toBeLessThan(0.6);
    expect(faded).toBeLessThan(0.05);
    // Absent ledger ⇒ 0 (byte-identical dormant).
    expect(exposedCorruptionForPair({}, 'c', 'p', 100)).toBe(0);
  });

  it('INTEGRATION: the war-reason catalog materializes corruption_exposed for the directed pair', () => {
    // A peace-engine-lit world with a fresh exposedCorruption entry (c holds it against p) + a
    // hostile c↔p edge. advanceWarReasons must surface a corruption_exposed reason on c>p.
    const cItem = { id: 'c', settlement: { name: 'c', institutions: [], powerStructure: {} }, causal: { scores: {} } };
    const pItem = { id: 'p', settlement: { name: 'p', institutions: [], powerStructure: {} }, causal: { scores: {} } };
    const edges = [{ id: 'e_cp', from: 'c', to: 'p', relationshipType: 'hostile' }];
    const worldState = {
      spatialCanonVersion: 1,
      simulationRules: { infoMode: 'full', warLayerEnabled: true, peaceEngineEnabled: true },
      relationshipStates: {},
      spatialLedgers: { exposedCorruption: { [reasonPairKey('c', 'p')]: { magnitude01: 0.7, tick: 5 } } },
    };
    const snapshot = { byId: new Map([['c', cItem], ['p', pItem]]), regionalGraph: { edges } };
    const out = advanceWarReasons({ snapshot, worldState, graph: { edges }, tick: 5 });
    const entry = getSpatialLedger(out.worldState, 'warReasons')[reasonPairKey('c', 'p')];
    expect(entry.reasons.corruption_exposed).toBeTruthy();
    expect(entry.reasons.corruption_exposed.score).toBeGreaterThan(0);
    // scoreCorruptionExposed is a pure clamp on the fed magnitude (the scorer contract).
    expect(scoreCorruptionExposed({ exposedCorruption01: 0.7 }).score).toBeCloseTo(0.7, 5);
  });
});

describe('W-DOCTRINE-3b §4 — DOUBLE-SURFACING (the cutout names the local org; the patron rides DM-truth only)', () => {
  it('a cutout is NOT a foreign exposure ⇒ no blowback against the patron on first exposure', () => {
    const { worldState, snapshot } = blowbackWorld({ webOn: true });
    // A cutout exposure runs the LOCAL path: criminalInstitution names the local org, foreign is falsy.
    const cutoutExp = { npcId: 'c:fence', settlementId: 'c', name: 'The Fence', kind: 'ousted', criminalInstitution: 'Thieves Guild', homeInstitution: 'Thieves Guild' };
    const out = applyForeignExposureBlowback({ worldState, snapshot, exposures: [cutoutExp], graph: snapshot.regionalGraph, tick: 10, now: 'N' });
    expect(out.changed).toBe(false);          // the patron takes NO blowback from a cutout's first surfacing
    expect(out.courtHits).toHaveLength(0);
  });

  it('the mover ANNOTATES a foreign exposure (patron endpoint + importance) but a cutout stays local', () => {
    // Foreign: the exposure receipt carries foreign:true + the patron endpoint.
    const foreignSnap = cityWith({
      name: 'Turned Envoy', personality: { flaw: 'deceitful' }, factionAffiliation: 'Envoys', importance: 'notable',
      corrupt: true, corruptionVector: 'forbidden_patron',
      corruptTies: { foreignPatron: 'crown', conspiracy: 'foreign_sponsored' },
    });
    const fExp = drive(foreignSnap, 'annot-foreign');
    expect(fExp.length).toBeGreaterThan(0);
    expect(fExp.every((e) => e.foreign === true && e.patronId === 'crown')).toBe(true);
    expect(fExp.every((e) => e.criminalInstitution === null)).toBe(true); // DM-truth carries the patron; no local org named
    // Cutout: the exposure names the local org and is NOT annotated foreign (the patron is second-hop only).
    const cutoutSnap = cityWith({
      name: 'Dock Boss', personality: { flaw: 'greedy' }, factionAffiliation: 'Dockers', importance: 'notable',
      corrupt: true, corruptionVector: 'greed',
      corruptTies: { criminalInstitution: 'Thieves Guild', leash: { kind: 'cutout', viaLocalOrg: 'Thieves Guild', settlementId: 'crown', covert: true } },
    });
    const cExp = drive(cutoutSnap, 'annot-cutout');
    expect(cExp.length).toBeGreaterThan(0);
    expect(cExp.every((e) => !e.foreign)).toBe(true);                              // never annotated foreign
    expect(cExp.every((e) => e.criminalInstitution === 'Thieves Guild')).toBe(true); // the local org is named (first surfacing)
    // The DM truth still carries the real patron (resolveLeash on the cutout NPC).
    expect(resolveLeash(cutoutSnap.settlements[0].settlement.npcs[0]).settlementId).toBe('crown');
  });
});

describe('W-DOCTRINE-3b §4 — leash re-pointing on patron death/retreat (causeLifecycle Terminal 2b)', () => {
  const foreignBearer = () => ({ id: 'cap', name: 'cap', corrupt: true, personality: { dominant: 'principled', flaw: 'honest' }, corruptTies: { foreignPatron: 'p', conspiracy: 'foreign_sponsored' } });
  const priorFor = (npc) => ({ a: { [npcId('a', npc, 0)]: { causeClass: 'captured', family: 'corruption', stage: 'attributed', role: 'criminal', situation: 'compromised-covert', originTick: 2, resolveHold: 0, priorCauses: [] } } });
  const litWs = (npc, on) => ({ npcStates: { [npcId('a', npc, 0)]: { roleArchetype: 'criminal' } }, spatialCanonVersion: on ? 1 : undefined, simulationRules: on ? { infoMode: 'full', corruptionWebEnabled: true } : { infoMode: 'full' } });
  const item = (npc) => ({ id: 'a', settlement: { name: 'a', npcs: [npc], institutions: [], powerStructure: {}, activeConditions: [] }, causal: { scores: {} }, activeConditions: [] });
  const patronItem = { id: 'p', settlement: { name: 'p', status: 'thriving', npcs: [], institutions: [] }, causal: { scores: {} } };

  it('RE-POINT: a foreign asset whose PATRON is gone from the realm loses its paymaster (web lit)', () => {
    const npc = foreignBearer();
    // The patron 'p' is ABSENT from the snapshot ⇒ foreignEndpointLive === false ⇒ re-adjudicate.
    const out = advanceCauseLifecycle({ snapshot: { settlements: [item(npc)] }, worldState: litWs(npc, true), priorLedger: priorFor(npc), rng: createPRNG('rp').fork('x'), tick: 12 });
    const evt = out.events.find((e) => e.stage === 're-adjudicated');
    expect(evt).toBeTruthy();
    expect(evt.reasons.join(' ')).toMatch(/Foreign patron/i);
  });

  it('NEGATIVE CONTROL: the patron ALIVE and present ⇒ no re-pointing (the asset holds)', () => {
    const npc = foreignBearer();
    const out = advanceCauseLifecycle({ snapshot: { settlements: [item(npc), patronItem] }, worldState: litWs(npc, true), priorLedger: priorFor(npc), rng: createPRNG('rp').fork('x'), tick: 12 });
    expect(out.events.find((e) => e.stage === 're-adjudicated')).toBeFalsy();
  });

  it('NEGATIVE CONTROL (dormancy): the web DARK ⇒ a foreign traitor never re-points (byte-identical)', () => {
    const npc = foreignBearer();
    // Patron gone, but the gate is off ⇒ Terminal 2b is inert (sustainingInstitution already nulls foreign).
    const out = advanceCauseLifecycle({ snapshot: { settlements: [item(npc)] }, worldState: litWs(npc, false), priorLedger: priorFor(npc), rng: createPRNG('rp').fork('x'), tick: 12 });
    expect(out.events.find((e) => e.stage === 're-adjudicated')).toBeFalsy();
  });

  it('foreignEndpointLive: present+standing ⇒ live; absent/destroyed/occupied ⇒ dead; non-foreign/faction-only ⇒ live', () => {
    const snap = { byId: new Map([['p', { id: 'p', settlement: { status: 'thriving' } }]]) };
    expect(foreignEndpointLive({ foreign: true, settlementId: 'p' }, snap)).toBe(true);
    expect(foreignEndpointLive({ foreign: true, settlementId: 'gone' }, snap)).toBe(false);
    expect(foreignEndpointLive({ foreign: true, settlementId: 'p' }, { byId: new Map([['p', { id: 'p', settlement: { status: 'destroyed' } }]]) })).toBe(false);
    expect(foreignEndpointLive({ foreign: true, settlementId: 'p' }, { byId: new Map([['p', { id: 'p', settlement: { occupiedBy: 'x' } }]]) })).toBe(false);
    expect(foreignEndpointLive({ foreign: false, settlementId: 'p' }, snap)).toBe(true);   // not our concern
    expect(foreignEndpointLive({ foreign: true, settlementId: null }, snap)).toBe(true);    // faction-only: never spuriously re-point
  });
});

// ── §5 COUNTERPLAY (all costed; each with a negative control) ─────────────────────
/** Inject a spatial ledger onto a creationWorld worldState (postures live beside the obligations). */
function withLedger(world, name, ledger) {
  const prevSL = world.worldState.spatialLedgers || {};
  return { ...world, worldState: { ...world.worldState, spatialLedgers: { ...prevSL, [name]: ledger } } };
}

describe('W-DOCTRINE-3b §5 — OFFICIAL-PAY posture (raising pay hardens onset resistance)', () => {
  it('PAY degrades foreign recruitment; NO pay leaves it un-degraded (the negative control)', () => {
    const base = creationWorld({ criminalEdge: true, obligation: 0 });
    const noPay = recruitmentWeight(base.snapshot, base.worldState, new Set(), 'p', 't').weight;
    const paid = withLedger(base, 'payPostures', { t: { level01: 1 } });
    const paidW = recruitmentWeight(paid.snapshot, paid.worldState, new Set(), 'p', 't').weight;
    expect(paidW).toBeLessThan(noPay);              // a well-paid court resists the forbidden patron
    expect(paidW).toBeGreaterThan(0);               // resistance, not immunity (bounded to PAY_RESIST_MAX)
    expect(officialPay01(paid.worldState, paid.snapshot, 't')).toBeGreaterThan(0);
    expect(officialPay01(base.worldState, base.snapshot, 't')).toBe(0); // absent ledger ⇒ 0 (byte-neutral)
  });

  it('AFFORDABILITY: a poorer court cannot fully fund the pay posture (the effective level scales down)', () => {
    // Rich target (Wealthy, above the afford floor) funds the full posture; a Subsistence target
    // (below PAY_AFFORD_FLOOR) can only half-fund it — the effective pay level scales down.
    const richW = creationWorld({ criminalEdge: true });
    richW.snapshot.byId.get('t').settlement.economicState.prosperity = 'Wealthy';
    const rich = withLedger(richW, 'payPostures', { t: { level01: 1 } });
    const poorW = creationWorld({ criminalEdge: true });
    poorW.snapshot.byId.get('t').settlement.economicState.prosperity = 'Struggling';
    const poor = withLedger(poorW, 'payPostures', { t: { level01: 1 } });
    expect(officialPay01(rich.worldState, rich.snapshot, 't')).toBeCloseTo(1, 5);
    expect(officialPay01(poor.worldState, poor.snapshot, 't')).toBeLessThan(officialPay01(rich.worldState, rich.snapshot, 't'));
    expect(officialPay01(poor.worldState, poor.snapshot, 't')).toBeGreaterThan(0);
  });
});

describe('W-DOCTRINE-3b §5 — HIDE posture (secrecy degrades the patron\'s channel quality)', () => {
  it('HIDE degrades foreign recruitment; NO secrecy leaves it un-degraded (the negative control)', () => {
    const base = creationWorld({ criminalEdge: true });
    const open = recruitmentWeight(base.snapshot, base.worldState, new Set(), 'p', 't');
    const hidden = withLedger(base, 'secrecyPostures', { t: { level01: 1 } });
    const hiddenW = recruitmentWeight(hidden.snapshot, hidden.worldState, new Set(), 'p', 't');
    expect(hiddenW.secrecy01).toBeCloseTo(1, 5);
    expect(hiddenW.weight).toBeLessThan(open.weight);   // a secretive court is harder to penetrate
    expect(open.secrecy01).toBe(0);                      // absent ⇒ no degrade (byte-neutral)
  });
});
