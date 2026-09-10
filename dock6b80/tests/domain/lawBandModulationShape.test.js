/**
 * lawBandModulationShape.test.js — WC-0C acceptance C6..C8 for
 * `src/domain/worldPulse/lawBandModulation.js`: the table's SHAPE, and the assertion that it
 * carries none of its content.
 *
 * ⚠ ANCHOR DISCIPLINE (negativeAssertionAnchor.walker): a NEW tests/domain file starts at
 * ceiling ZERO against the frozen roster, so this file writes none of the three negated
 * membership forms that walker scans for. The notice is worded rather than quoting them.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { LAW_WORDS } from '../../src/domain/worldPulse/lawWord.js';
import {
  LAW_BAND_KEYS,
  LAW_BAND_AXIS,
  registerLawBandCurve,
  lawBandCurve,
  registeredLawBandKeys,
} from '../../src/domain/worldPulse/lawBandModulation.js';

const MODULE_SOURCE = fileURLToPath(
  new URL('../../src/domain/worldPulse/lawBandModulation.js', import.meta.url),
);

/** Blank every comment, line count preserved. */
function codeOnly(source) {
  const blank = (match) => match.replace(/[^\n]/g, ' ');
  return source.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/^[ \t]*\/\/.*$/gm, blank);
}

describe('WC-0C · the law-band table is a shape, and it is empty on purpose', () => {
  it('closes the key set and the axis, and throws on anything outside either', () => {
    expect(LAW_BAND_KEYS).toEqual(['cohesion', 'drift', 'learning', 'relay']);
    expect(Object.isFrozen(LAW_BAND_KEYS)).toBe(true);
    expect([...LAW_BAND_KEYS]).toEqual([...LAW_BAND_KEYS].sort());

    // ⛔ NO FOURTH WORD EVER. The axis is BORROWED from the estate's one law ladder rather
    // than re-spelled here — re-spelling would mint a second law-word list, the precise
    // defect `lawWord.js` exists to end. Its equality to LAW_WORDS is what makes the
    // narrowing of §8.1's "zero-import leaf" clause worth its one import.
    expect([...LAW_BAND_AXIS]).toEqual([...LAW_WORDS]);
    expect(LAW_BAND_AXIS).toHaveLength(3);
    expect(Object.isFrozen(LAW_BAND_AXIS)).toBe(true);

    for (const bad of ['cohesion_curve', 'Cohesion', 'tempo', '', null, undefined]) {
      expect(() => lawBandCurve(bad)).toThrow(TypeError);
      expect(() => registerLawBandCurve(bad, {})).toThrow(TypeError);
    }
    // An unknown key is a defect even while the table is empty — which is what keeps the
    // emptiness from quietly swallowing a typo.
    expect(() => lawBandCurve('relay')).not.toThrow();

    // A FOURTH WORD ON THE AXIS THROWS. The curve's word set must BE the axis, so neither a
    // missing word nor an extra one registers.
    const full = Object.fromEntries(LAW_BAND_AXIS.map((word) => [word, null]));
    expect(() => registerLawBandCurve('relay', { ...full, chaotic: null })).toThrow(TypeError);
    expect(() => registerLawBandCurve('relay', { lawful: null })).toThrow(TypeError);
  });

  it('declares zero curve values anywhere in the module, so TUNING none is a measurement', () => {
    // ⭐ THE ARM THAT KEEPS "TUNING: none" HONEST MECHANICALLY, and the one the volume's own
    // self-correction demands: an earlier drafting landed four curves in the wave whose
    // closing line reads TUNING: none. Curves are constants and constants are
    // owner-signature surface under THE PROMISE's versioned-tuning carve-out.
    //
    // ⚠ SCANNED WITH COMMENTS STRIPPED, because the module's header explains the rule at
    // length and a raw scan would convict the explanation instead of a value — the lesson
    // this train's WC-0A member learned by being convicted for exactly that.
    const raw = readFileSync(MODULE_SOURCE, 'utf8');
    const masked = codeOnly(raw);
    // The mask preserves line count, so any address this arm reports stays addressable.
    expect(masked.split('\n')).toHaveLength(raw.split('\n').length);

    const numericLines = masked
      .split('\n')
      .map((line, i) => [i + 1, line])
      .filter(([, line]) => /(?<![A-Za-z0-9_$])\d/.test(line))
      .map(([n, line]) => `${n}: ${line.trim()}`);
    expect(numericLines).toEqual([]);

    // Non-vacuity: the mask is reading live code, not an emptied buffer, and the detector
    // really can see a digit when one is there.
    expect(masked).toContain('export const LAW_BAND_KEYS');
    expect(/(?<![A-Za-z0-9_$])\d/.test('const EDGE = 0.67;')).toBe(true);

    // And the table itself holds nothing yet.
    expect(registeredLawBandKeys()).toEqual([]);
    for (const key of LAW_BAND_KEYS) expect(lawBandCurve(key)).toBe(null);
  });

  it('pins totality in the direction a partly-filled table survives', () => {
    // ⭐ EVERY REGISTERED KEY HAS A CURVE AND EVERY CURVE NAMES A REGISTERED KEY — never that
    // the table is full at this landing. A fullness pin would red on the day it lands and
    // every day until the last consumer arrives.
    const curve = Object.fromEntries(LAW_BAND_AXIS.map((word) => [word, null]));
    expect(registeredLawBandKeys()).toEqual([]);

    registerLawBandCurve('relay', curve);
    expect(registeredLawBandKeys()).toEqual(['relay']);
    for (const key of registeredLawBandKeys()) {
      expect(LAW_BAND_KEYS).toContain(key);
      expect(Object.keys(lawBandCurve(key)).sort()).toEqual([...LAW_BAND_AXIS].sort());
    }
    // The table is NOT full, and that is legal.
    expect(registeredLawBandKeys().length).toBeLessThan(LAW_BAND_KEYS.length);
    expect(lawBandCurve('cohesion')).toBe(null);

    // ⛔ A SECOND REGISTRATION OF THE SAME KEY THROWS. A silent overwrite would let a later
    // wave retune an earlier one's signed constants without the diff saying so.
    expect(() => registerLawBandCurve('relay', curve)).toThrow(TypeError);
    // The registered row is frozen, so a consumer cannot mutate another wave's curve.
    expect(Object.isFrozen(lawBandCurve('relay'))).toBe(true);
  });
});
