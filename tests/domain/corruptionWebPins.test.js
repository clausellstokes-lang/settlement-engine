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
import { ensureNpcStates, advanceNpcCorruption } from '../../src/domain/worldPulse/npcAgency.js';
import { applyCorruptionImpairments } from '../../src/domain/worldPulse/corruptionImpair.js';
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
