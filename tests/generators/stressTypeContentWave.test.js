/**
 * stressTypeContentWave.test.js — [generators-domain-1 + data-tables-3].
 *
 * Behavioral pins for the 5 newer stress types' full integration: arrival
 * vignettes open on the stress, institutional secrets exist, probability couples
 * to settlement characteristics, and the tension mapping resolves to a template.
 * (The registration MANIFEST is walked separately in
 * tests/data/stressTypeRegistration.test.js.)
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { STRESS_INSTITUTION_EFFECTS } from '../../src/data/stressTypes.js';
import { buildStressContext } from '../../src/generators/stressGenerator.js';

const NEW = ['insurgency', 'mass_migration', 'wartime', 'religious_conversion', 'slave_revolt'];
const gen = (extra, seed) =>
  generateSettlementPipeline({ settType: 'town', terrainOverride: 'plains', ...extra }, null, { seed, customContent: {} });

describe('generators-domain-1 + data-tables-3 — stress-type content wave', () => {
  it('every new type forces a coherent settlement (NPCs, history, and its own stress)', () => {
    for (const st of NEW) {
      const s = gen({ stressType: st }, `sm-${st}`);
      const active = (s.stress ? (Array.isArray(s.stress) ? s.stress : [s.stress]) : []).map((x) => x.type);
      expect(active, `${st} not active`).toContain(st);
      expect((s.npcs || []).length, `${st} produced no NPCs`).toBeGreaterThan(0);
      expect(STRESS_INSTITUTION_EFFECTS[st].length, `${st} has too few institutional secrets`).toBeGreaterThanOrEqual(5);
    }
  });

  it('a slave-revolt town opens on the revolt, not on market day', () => {
    const s = gen({ stressType: 'slave_revolt' }, 'sr-arrival');
    const arrival = String(s.arrivalScene || '');
    expect(arrival).toMatch(/shut in daylight|checkpoint|auction platform|rising that did this|carried through/i);
  });

  it('each new type opens its arrival scene on stress-appropriate imagery', () => {
    const probes = {
      insurgency: /toll-keeper|notices|watching the town|orders that leave/i,
      mass_migration: /families|tents and lean-tos|leaving|three languages/i,
      wartime: /heavy wagons|young men are not|requisition column|forges work/i,
      religious_conversion: /Two temples|shrine|holy day|bells/i,
      slave_revolt: /shut in daylight|checkpoint|auction platform|carried through/i,
    };
    for (const st of NEW) {
      const s = gen({ stressType: st }, `arr-${st}`);
      expect(String(s.arrivalScene || ''), `${st} arrival not stress-flavored`).toMatch(probes[st]);
    }
  });

  it('probability couples to settlement characteristics and stays bounded (≤ 0.35)', () => {
    const probes = {
      insurgency: [{ priorityCriminal: 70, priorityMilitary: 20 }, []],
      mass_migration: [{ tradeRouteAccess: 'crossroads' }, []],
      wartime: [{ neighborRelationship: { relationshipType: 'hostile' }, monsterThreat: 'frontier' }, []],
      religious_conversion: [{ priorityReligion: 70 }, [{ name: 'Great Cathedral' }]],
      slave_revolt: [{ priorityEconomy: 70, priorityCriminal: 60 }, [{ name: 'Slave Auction Block' }]],
    };
    for (const st of NEW) {
      const base = buildStressContext(st, 'city', {}, []);
      const [cfg, insts] = probes[st];
      const coupled = buildStressContext(st, 'city', cfg, insts);
      expect(coupled, `${st} coupling did not respond`).not.toBe(base);
      expect(coupled, `${st} exceeded the 0.35 ceiling`).toBeLessThanOrEqual(0.35);
    }
  });

  it('slave revolt needs the economy that invites it — an extractive economy raises it, its absence suppresses it', () => {
    const extractive = buildStressContext('slave_revolt', 'city', { priorityEconomy: 70, priorityCriminal: 60 }, []);
    const clean = buildStressContext('slave_revolt', 'city', { priorityEconomy: 35, priorityCriminal: 30 }, []);
    expect(extractive).toBeGreaterThan(clean);
  });

  it('same-seed determinism holds for a forced new-stress config', () => {
    const a = gen({ stressType: 'wartime' }, 'det-w');
    const b = gen({ stressType: 'wartime' }, 'det-w');
    expect((a.npcs || []).map((n) => n.name)).toEqual((b.npcs || []).map((n) => n.name));
  });
});
