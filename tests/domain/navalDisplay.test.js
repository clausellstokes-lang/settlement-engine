/**
 * navalDisplay.test.js — experience-product-fit-5: the standing-blockade surface.
 * W-NAVY's navalStrength had zero display consumers; a blockade was invisible as
 * standing state. liveBlockades reads the navalTransit ledger (the blockade
 * record's strength = the blockading navy's navalStrengthOf, folded into the
 * strangulation band). DORMANT ⇒ [] (byte-identical off-state).
 */
import { describe, it, expect } from 'vitest';
import { liveBlockades, hasLiveBlockades, blockadeStrangulationBand } from '../../src/domain/display/navalDisplay.js';

/** A worldState with N blockade records against `port`. */
function worldWithBlockade({ port = 'harborton', owners = ['ironreach'] } = {}) {
  const ledger = {};
  owners.forEach((ownerId, i) => {
    ledger[`nt_${ownerId}_${i}`] = {
      role: 'blockade', mode: 'sea', ownerId, targetId: port, cargoId: null, strength: 40,
    };
  });
  return { spatialLedgers: { navalTransit: ledger } };
}

describe('liveBlockades — the standing blockade read', () => {
  it('DORMANT: no navalTransit ledger ⇒ [] (byte-identical off-state)', () => {
    expect(liveBlockades({})).toEqual([]);
    expect(liveBlockades(null)).toEqual([]);
    expect(liveBlockades({ spatialLedgers: {} })).toEqual([]);
    expect(hasLiveBlockades({})).toBe(false);
  });

  it('surfaces a blockaded port with its blockader and a banded strangulation', () => {
    const ws = worldWithBlockade({ port: 'harborton', owners: ['ironreach'] });
    const out = liveBlockades(ws);
    expect(out).toHaveLength(1);
    expect(out[0].portId).toBe('harborton');
    expect(out[0].blockaders).toEqual(['ironreach']);
    expect(typeof out[0].phrase).toBe('string');
    expect(hasLiveBlockades(ws)).toBe(true);
  });

  it('a coalition blockade lists every blockader, codepoint-sorted', () => {
    const out = liveBlockades(worldWithBlockade({ port: 'harborton', owners: ['zenith', 'aldmoor'] }));
    expect(out[0].blockaders).toEqual(['aldmoor', 'zenith']);
  });

  it('ports are codepoint-ordered', () => {
    const ws = {
      spatialLedgers: { navalTransit: {
        a: { role: 'blockade', targetId: 'zzz', ownerId: 'x' },
        b: { role: 'blockade', targetId: 'aaa', ownerId: 'y' },
      } },
    };
    expect(liveBlockades(ws).map(b => b.portId)).toEqual(['aaa', 'zzz']);
  });

  it('non-blockade naval records (convoys) are ignored', () => {
    const ws = { spatialLedgers: { navalTransit: { c: { role: 'convoy', targetId: 'harborton', ownerId: 'x' } } } };
    expect(liveBlockades(ws)).toEqual([]);
  });

  it('strangulation bands are ordered', () => {
    expect(blockadeStrangulationBand(0)).toBe(0);
    expect(blockadeStrangulationBand(0.5)).toBe(1);
    expect(blockadeStrangulationBand(0.9)).toBe(2);
  });
});
