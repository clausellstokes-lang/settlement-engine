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
  CORRUPTION_WEB_TUNING,
} from '../../src/domain/worldPulse/corruptionWeb.js';
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
