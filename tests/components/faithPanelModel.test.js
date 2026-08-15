/**
 * faithPanelModel — the pure read-model behind the dossier faith surface (W-F6).
 * Pins the branches the component depends on: the no-embed short-circuit, the
 * static (day-one) vs live shapes, the piety arc (rising/falling/steady), the
 * legitimacy bands, the amplifier receipt, and the secularization/revival sink
 * sentence direction. It never reads config.latentPantheon.
 */
import { describe, it, expect } from 'vitest';
import { faithPanelModel, legitimacyBand, pietyTrend } from '../../src/components/settlement/faithPanelModel.js';

describe('faithPanelModel', () => {
  it('returns { hasEmbed:false } for a deity-free (or latent-only) settlement', () => {
    expect(faithPanelModel({ config: {} })).toEqual({ hasEmbed: false });
    // A latent record alone is NOT an embed — the model never reads it.
    expect(faithPanelModel({ config: { latentPantheon: { patron: { name: 'Secret' } } } })).toEqual({ hasEmbed: false });
  });

  it('builds a static (day-one) model from embeds alone, with the effects disclosure', () => {
    const m = faithPanelModel({ config: { primaryDeitySnapshot: { name: 'Sun', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun', alignmentAxis: 'good' } } });
    expect(m.hasEmbed).toBe(true);
    expect(m.live).toBe(false);
    expect(m.patron.name).toBe('Sun');
    expect(m.patron.lawAxis).toBe('lawful');
    expect(m.ranks).toEqual([]);
    expect(Array.isArray(m.effects)).toBe(true);
    expect(m.effects.length).toBeGreaterThan(0);
  });

  it('drops a neutral lawAxis (legacy / true-neutral says nothing)', () => {
    const m = faithPanelModel({ config: { primaryDeitySnapshot: { name: 'X', rankAxis: 'cult', lawAxis: 'neutral' } } });
    expect(m.patron.lawAxis).toBeNull();
  });

  it('builds a live model with ranks, piety arc, unaffiliated, and cause sentences', () => {
    const m = faithPanelModel({
      config: {
        primaryDeitySnapshot: { name: 'Sun', rankAxis: 'major' },
        faithProfile: {
          deities: [
            { deityRef: 'a', name: 'Sun', share: 60, standing: 'ascendant', legitimacy: 0.8, isPatron: true },
            { deityRef: 'b', name: 'Ash', share: 26, standing: 'established', legitimacy: 0.3, isPatron: false },
          ],
          contested: false, patronSecurity: 0.7, unaffiliated: 14,
          piety: {
            local01: 0.3, structuralTarget: 0.5, localMult: 1.2, realmMult: 1.0, composite: 1.2,
            causes: [
              { source: 'religious_authority', value: 0.5 },
              { source: 'institutions', value: 0.6 },
              { source: 'devotion', value: 0.4 },
              { source: 'conduct_drift', value: 0.2 },
            ],
          },
        },
      },
    });
    expect(m.live).toBe(true);
    expect(m.ranks).toHaveLength(2);
    expect(m.ranks[0].band.label).toBe('secure');       // 0.8
    expect(m.ranks[1].band.label).toBe('tenuous');      // 0.2
    expect(m.piety.trend).toBe('rising');               // 0.3 → 0.5
    expect(m.piety.bars).toHaveLength(3);               // authority / institutions / devotion
    expect(m.piety.amplifier.dir).toBe('up');
    expect(m.piety.sentences).toContain('The town no longer lives like its god — devotion is ebbing.');
    // Rising piety + an unaffiliated bucket ⇒ REVIVAL.
    expect(m.sinkSentence).toMatch(/Crisis calls the faithful home/);
  });

  it('reads secularization when piety is falling with an unaffiliated bucket', () => {
    const m = faithPanelModel({
      config: {
        primaryDeitySnapshot: { name: 'Sun' },
        faithProfile: {
          deities: [{ deityRef: 'a', name: 'Sun', share: 70, standing: 'ascendant', legitimacy: 0.6, isPatron: true }],
          unaffiliated: 22,
          piety: { local01: 0.6, structuralTarget: 0.4, composite: 0.9, causes: [] },
        },
      },
    });
    expect(m.piety.trend).toBe('falling');
    expect(m.piety.amplifier.dir).toBe('down');
    expect(m.sinkSentence).toMatch(/Comfort drains the pews/);
  });

  it('legitimacyBand + pietyTrend edge helpers', () => {
    expect(legitimacyBand(0.9).label).toBe('secure');
    expect(legitimacyBand(0.6).label).toBe('established');
    expect(legitimacyBand(0.3).label).toBe('tenuous');
    expect(legitimacyBand(0.1).label).toBe('contested');
    expect(pietyTrend(0.5, 0.5)).toBe('steady');
    expect(pietyTrend(0.5, 0.6)).toBe('rising');
    expect(pietyTrend(0.5, 0.4)).toBe('falling');
  });
});
