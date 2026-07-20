/**
 * worldExport.test.js — Vision V-11 THE FOUNDRY BRIDGE.
 *
 * THE LOAD-BEARING PIN: the PLAYER variant leaks ZERO covert marks / whereabouts
 * / nids / seeds. Built as a deep-scan of the serialized payload (the
 * roadsSecretsProbe idiom — a payload assertion, never a field/CSS check) over a
 * fixture that carries EVERY secret carrier at once. Plus the exporter-determinism
 * pin and non-vacuity (the DM variant DOES carry what the player variant strips).
 */
import { describe, it, expect } from 'vitest';
import {
  buildWorldExport,
  WORLD_EXPORT_FORMAT,
  WORLD_EXPORT_FORMAT_VERSION,
} from '../../src/lib/worldExport.js';
import { WORLD_SNAPSHOT_HARD_DENY } from '../../src/domain/display/worldSnapshotPublic.js';

// A realm carrying every DM-secret carrier the redactors must strip: covert
// corruption naming an NPC, NPC corrupt ties + whereabouts + secret/goal/hooks,
// a latent pantheon + seeds, and a worldState with the HARD-DENY ledgers + a
// gm-visibility war front.
const secretBearingWorld = () => ({
  name: 'Saltmoor Reach',
  seed: 'realm-seed-xyz',
  settlements: [
    {
      id: 'save-uuid-1',
      name: 'Saltmoor',
      settlement: {
        id: 's_ab12cd34ef567890',
        name: 'Saltmoor',
        tier: 'town',
        population: 1200,
        _seed: 'dossier-seed-1',
        _config: { magicExists: true },
        config: { primaryDeitySnapshot: null, latentPantheon: { war_father: { tier: 'major' } }, _seed: 'cfg-seed' },
        dmNotes: 'the baron is secretly the smuggler',
        plotHooks: ['A midnight muster at the ford'],
        npcs: [
          {
            id: 'npc.varn', name: 'Lord Varn', role: 'ruler', category: 'government',
            secret: { what: 'took a bribe from the guild' },
            goal: { short: 'hold the toll bridge' },
            plotHooks: ['owes the guild a favour'],
            whereabouts: { state: 'traveling', placeId: 'dulwich', missionId: 'road.saltmoor.varn.12', purposeKind: 'diplomacy', sinceTick: 12 },
            corrupt: true,
            corruptTies: { leash: { kind: 'foreign_settlement', settlementId: 'dulwich', covert: true } },
          },
        ],
        institutions: [
          {
            name: 'The Watch',
            impairments: [
              { type: 'corruption', covert: true, description: "Aldric's capture quietly compromised the watch" },
            ],
          },
        ],
      },
    },
  ],
  regionalGraph: {
    channels: [
      { id: 'ch1', type: 'trade_dependency', from: 'save-uuid-1', to: 'save-uuid-2', status: 'confirmed', visibility: 'public', goods: [{ id: 'grain', label: 'Grain' }] },
      { id: 'ch2', type: 'war_front', from: 'save-uuid-2', to: 'save-uuid-1', status: 'confirmed', visibility: 'gm' },
    ],
  },
  worldState: {
    schemaVersion: 7,
    tick: 15,
    calendar: { elapsedMonths: 3, month: 4, year: 2, season: 'spring' },
    rngSeed: 'REPLAY-ME-9999',
    npcStates: { 'save-uuid-1:npc.varn': { rung: 3, standing: 0.7, nid: 'nid-secret-1' } },
    proposals: [{ status: 'pending', outcome: { id: 'coup-1', headline: 'A secret coup brews' } }],
    stressors: [{ type: 'famine', prose: 'the granaries fail' }],
    spatialLedgers: {
      armyTransit: { 'a>b': { armyId: 'saltmoor', destId: 'dulwich', position01: 0.7 } },
      roads: { ransoms: { 'r1': { npcKey: 'saltmoor:varn', willConvert: true } } },
    },
    warPosture: { 'save-uuid-1': { secret: { covert: true, target: 'dulwich' } } },
  },
});

const SECRET_TOKENS = [
  'armyTransit', 'position01', 'ransom', 'willConvert', 'missionId', 'purposeKind',
  'whereabouts', 'latentPantheon', 'rngSeed', 'REPLAY-ME-9999', 'npcStates',
  'spatialLedgers', 'warPosture', 'corruptTies', 'Aldric', 'dmNotes',
  'took a bribe', 'dossier-seed-1', 'cfg-seed', 'nid-secret-1',
];

describe('buildWorldExport — envelope', () => {
  it('stamps the format discriminator, version, and variant', () => {
    const dm = buildWorldExport(secretBearingWorld(), { variant: 'dm', generatedAt: '2026-07-20T00:00:00.000Z' });
    expect(dm.format).toBe(WORLD_EXPORT_FORMAT);
    expect(dm.formatVersion).toBe(WORLD_EXPORT_FORMAT_VERSION);
    expect(dm.variant).toBe('dm');
    expect(dm.generatedAt).toBe('2026-07-20T00:00:00.000Z');
    expect(dm.realm.settlementCount).toBe(1);
    expect(dm.settlements).toHaveLength(1);
  });

  it('defaults to the fail-closed player variant when none/garbage is requested', () => {
    expect(buildWorldExport(secretBearingWorld()).variant).toBe('player');
    expect(buildWorldExport(secretBearingWorld(), { variant: 'nonsense' }).variant).toBe('player');
    expect(buildWorldExport(secretBearingWorld(), { variant: 'DM' }).variant).toBe('player');
  });
});

describe('buildWorldExport — THE PLAYER VARIANT LEAKS NOTHING COVERT (load-bearing)', () => {
  const player = buildWorldExport(secretBearingWorld(), { variant: 'player', generatedAt: '2026-07-20T00:00:00.000Z' });
  const serialized = JSON.stringify(player);

  it('a deep scan of the serialized player export finds ZERO secret tokens', () => {
    for (const token of SECRET_TOKENS) {
      expect(serialized.includes(token), `secret token "${token}" leaked into the player export`).toBe(false);
    }
  });

  it('no worldState HARD-DENY ledger key appears anywhere in the player export', () => {
    for (const key of WORLD_SNAPSHOT_HARD_DENY) {
      expect(serialized.includes(`"${key}"`), `HARD-DENY key "${key}" leaked into the player export`).toBe(false);
    }
  });

  it('the player export carries NO realm seed (a seed replays the private world)', () => {
    expect(player.realm.seed).toBeUndefined();
  });

  it('the player NPC keeps only its public allowlist (no secret/goal/hooks/whereabouts)', () => {
    const npc = player.settlements[0].dossier.npcs[0];
    expect(npc.name).toBe('Lord Varn');
    expect(npc.secret).toBeUndefined();
    expect(npc.goal).toBeUndefined();
    expect(npc.plotHooks).toBeUndefined();
    expect(npc.whereabouts).toBeUndefined();
    expect(npc.corrupt).toBeUndefined();
    expect(npc.corruptTies).toBeUndefined();
  });

  it('the covert corruption impairment (which NAMES the NPC) is dropped whole', () => {
    const insts = player.settlements[0].dossier.institutions || [];
    for (const inst of insts) {
      for (const imp of (inst.impairments || [])) {
        expect(imp.covert).not.toBe(true);
      }
    }
  });

  it('ordinary public content still survives (the probe is not vacuous)', () => {
    expect(player.settlements[0].name).toBe('Saltmoor');
    expect(player.settlements[0].dossier.name).toBe('Saltmoor');
    expect(player.realm.name).toBe('Saltmoor Reach');
    expect(player.realm.snapshot.schemaVersion).toBeGreaterThan(0);
    // the public trade channel survives; the gm war front does not
    expect(player.realm.snapshot.warNetwork.channels.some(c => c.id === 'ch1')).toBe(true);
    expect(player.realm.snapshot.warNetwork.sieges).toHaveLength(0);
  });
});

describe('buildWorldExport — the DM variant carries what the player strips (non-vacuous seam)', () => {
  const dm = buildWorldExport(secretBearingWorld(), { variant: 'dm', generatedAt: '2026-07-20T00:00:00.000Z' });

  it('the DM settlement keeps NPC secrets, goals, and plot hooks', () => {
    const npc = dm.settlements[0].dossier.npcs.find(n => n.name === 'Lord Varn');
    expect(npc.secret).toBeTruthy();
    expect(npc.goal).toBeTruthy();
    expect(dm.settlements[0].dossier.plotHooks).toBeTruthy();
  });

  it('the DM variant carries the realm seed as provenance', () => {
    expect(dm.realm.seed).toBe('realm-seed-xyz');
  });

  it('even the DM variant never carries the latent pantheon or generation seeds', () => {
    const s = JSON.stringify(dm);
    expect(s.includes('latentPantheon')).toBe(false);
    expect(s.includes('dossier-seed-1')).toBe(false);
    expect(s.includes('rngSeed')).toBe(false);
    expect(s.includes('spatialLedgers')).toBe(false);
  });
});

describe('buildWorldExport — determinism', () => {
  it('a fixed input + generatedAt yields byte-identical output', () => {
    const args = [secretBearingWorld(), { variant: 'player', generatedAt: '2026-07-20T00:00:00.000Z' }];
    const a = buildWorldExport(...args);
    const b = buildWorldExport(secretBearingWorld(), { variant: 'player', generatedAt: '2026-07-20T00:00:00.000Z' });
    expect(JSON.stringify(a)).toEqual(JSON.stringify(b));
  });

  it('the DM and player variants of the same world differ (the seam is real)', () => {
    const world = secretBearingWorld();
    const dm = JSON.stringify(buildWorldExport(world, { variant: 'dm', generatedAt: 'x' }));
    const player = JSON.stringify(buildWorldExport(world, { variant: 'player', generatedAt: 'x' }));
    expect(dm).not.toEqual(player);
  });
});
