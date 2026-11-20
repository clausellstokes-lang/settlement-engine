/**
 * safetyShown.test.js — PAGE-1's SAFETY unit (F3a; BUILD.md §SAFETY, the chair's ruling of 11:24 widening it to both
 * directions). The Overview's Safety label and Foundations' Law & order are two honest measures that stay as computed
 * (`generators/safetyProfile.js`, `causalState.js :: deriveLawOrder`). Where they stand two or more steps apart, or the
 * record holds what the Safety label could not see (the ruling seat in criminal hands; a live crime wave), the OWNER'S
 * page carries one plain line beside the label (`domain/display/safetyShown.js`). Every other audience reads the born
 * label alone, byte for byte: the leaf FAILS CLOSED (a missing or unknown audience is a reader).
 */
import { describe, expect, test } from 'vitest';
import {
  SAFETY_AUDIENCES, SAFETY_RUNG, safetyAudienceOf, safetyQualifierOf, safetyShownOf, safetyQualifierLed,
} from '../../../src/domain/display/safetyShown.js';
import { SAFETY_BANDS } from '../../../src/domain/display/labelBands.js';
import { CAPTURE_LADDER } from '../../../src/domain/people/hallCapture.js';

describe('the audience fails closed', () => {
  test('only the two named audiences exist', () => {
    expect(SAFETY_AUDIENCES).toEqual(['owner', 'reader']);
  });
  test('the page is the owner\'s only where it is neither a public dossier nor a player view, both said', () => {
    expect(safetyAudienceOf({ publicDossier: false, playerView: false })).toBe('owner');
    expect(safetyAudienceOf({ publicDossier: true, playerView: false })).toBe('reader');
    expect(safetyAudienceOf({ publicDossier: false, playerView: true })).toBe('reader');
    expect(safetyAudienceOf({ publicDossier: true, playerView: true })).toBe('reader');
    expect(safetyAudienceOf({})).toBe('reader');
    expect(safetyAudienceOf(undefined)).toBe('reader');
    expect(safetyAudienceOf({ publicDossier: 0, playerView: '' })).toBe('reader');
  });
  test('a record the owner would see qualified reads as the born label alone for every other audience', () => {
    const rec = { economicState: { safetyProfile: { safetyLabel: 'Moderate' } }, powerStructure: { criminalCaptureState: 'capture' } };
    for (const audience of [undefined, null, '', 'reader', 'gallery', 'public', 'player', 'OWNER', 'owner ']) {
      expect(safetyShownOf(rec, /** @type {never} */ (audience))).toEqual({ label: 'Moderate', band: 'Moderate', qualifier: null });
    }
    expect(safetyShownOf(rec)).toEqual({ label: 'Moderate', band: 'Moderate', qualifier: null });
  });
  test('the reader reads nothing but the label (no capture, no law, no tension)', () => {
    const touched = new Set();
    const spy = (o, path) => new Proxy(o, { get(t, k) { if (typeof k === 'string') touched.add(`${path}.${k}`); return t[k]; } });
    const rec = spy({
      economicState: spy({ safetyProfile: spy({ safetyLabel: 'Tense — Famine' }, 'sp') }, 'eco'),
      powerStructure: spy({ criminalCaptureState: 'capture' }, 'ps'),
      history: spy({ currentTensions: [{ type: 'crime_wave' }] }, 'history'),
    }, 'rec');
    expect(safetyShownOf(rec, 'reader')).toEqual({ label: 'Tense — Famine', band: 'Tense', qualifier: null });
    expect([...touched].sort()).toEqual(['eco.safetyProfile', 'rec.economicState', 'sp.safetyLabel']);
  });
});

describe('the born label, as each surface prints it today', () => {
  test('label is the record\'s own string; band is the Overview tag\'s word (safetyBandOf, else the label)', () => {
    expect(safetyShownOf({ economicState: { safetyProfile: { safetyLabel: 'Dangerous — Criminal Governance' } } })).toEqual({ label: 'Dangerous — Criminal Governance', band: 'Dangerous', qualifier: null });
    expect(safetyShownOf({ economicState: { safetyProfile: { safetyLabel: 'Something new' } } })).toEqual({ label: 'Something new', band: 'Something new', qualifier: null });
    expect(safetyShownOf({})).toEqual({ label: null, band: null, qualifier: null });
    expect(safetyShownOf(null, 'owner')).toEqual({ label: null, band: null, qualifier: null });
  });
  test('the rung map is total over the producer\'s band vocabulary, on the 0..4 scale of the measure', () => {
    expect(Object.keys(SAFETY_RUNG).sort()).toEqual([...SAFETY_BANDS].sort());
    for (const r of Object.values(SAFETY_RUNG)) expect([0, 1, 2, 3, 4]).toContain(r);
  });
});

describe('the owner\'s line (the authored words, verbatim)', () => {
  const q = (label, lawBand, capture = 'none', crimeWave = false) => safetyQualifierOf({ label, lawBand, capture, crimeWave });

  test('the streets above the law, two steps or more', () => {
    expect(q('Moderate', 'collapsed')).toBe('Moderate day to day; the law has broken down.');
    expect(q('Safe', 'critical')).toBe('Safe day to day; the law is weak.');
    expect(q('Very Safe', 'strained')).toBe('Very safe day to day; the law is stretched but standing.');
    expect(q('Tense — Famine', 'collapsed')).toBe('Tense day to day; the law has broken down.');
  });
  test('the streets below the law, two steps or more', () => {
    expect(q('Moderate', 'surplus')).toBe('Moderate day to day; the law is strong.');
    expect(q('Unsafe', 'adequate')).toBe('Unsafe day to day; the law holds.');
    expect(q('Dangerous', 'strained')).toBe('Dangerous day to day; the law is stretched but standing.');
    expect(q('Volatile — Succession Void', 'adequate')).toBe('Volatile day to day; the law holds.');
  });
  test('one step apart or level: nothing', () => {
    expect(q('Moderate', 'strained')).toBeNull();
    expect(q('Moderate', 'adequate')).toBeNull();
    expect(q('Moderate', 'critical')).toBeNull();
    expect(q('Dangerous', 'collapsed')).toBeNull();
    expect(q('Dangerous', 'critical')).toBeNull();
    expect(q('Very Safe', 'surplus')).toBeNull();
  });
  test('the ruling seat in criminal hands, said in its own words, where the label reads Moderate or better', () => {
    expect(q('Moderate', 'strained', 'corrupted')).toBe('Moderate day to day; the ruling seat is partly in criminal hands.');
    expect(q('Tense — Plague Conditions', 'strained', 'capture')).toBe('Tense day to day; the ruling seat is run by the criminals.');
    expect(q('Moderate', 'collapsed', 'capture')).toBe('Moderate day to day; the law has broken down, and the ruling seat is run by the criminals.');
    expect(q('Dangerous', 'collapsed', 'capture')).toBeNull(); // the label already says the streets are bad
    expect(q('Moderate', 'strained', 'equilibrium')).toBeNull();
    expect(q('Moderate', 'strained', 'adversarial')).toBeNull();
  });
  test('a live crime wave, where the label reads Moderate or better', () => {
    expect(q('Moderate', 'strained', 'none', true)).toBe('Moderate day to day; crime is rising faster than those in charge can answer it.');
    expect(q('Moderate', 'collapsed', 'corrupted', true)).toBe('Moderate day to day; the law has broken down, the ruling seat is partly in criminal hands, and crime is rising faster than those in charge can answer it.');
    expect(q('Unsafe', 'strained', 'none', true)).toBeNull();
  });
  test('a label or a law band off the vocabulary says nothing it cannot read', () => {
    expect(q('Something new', 'collapsed')).toBeNull();
    expect(q('Moderate', undefined)).toBeNull();
    expect(q('Moderate', undefined, 'capture')).toBe('Moderate day to day; the ruling seat is run by the criminals.');
    expect(q(null, 'collapsed', 'capture', true)).toBeNull();
  });
  test('the capture rungs it names are the ladder\'s own', () => {
    for (const rung of ['corrupted', 'capture', 'equilibrium', 'adversarial', 'none']) expect(CAPTURE_LADDER).toContain(rung);
  });
  test('the PDF leads the line with the word it explains', () => {
    expect(safetyQualifierLed('Moderate day to day; the law is strong.')).toBe('Safety: Moderate day to day; the law is strong.');
    expect(safetyQualifierLed(null)).toBeNull();
  });
  test('no figure and none of the model\'s working in any line', () => {
    const lines = [];
    for (const label of SAFETY_BANDS) for (const law of ['collapsed', 'critical', 'strained', 'adequate', 'surplus']) for (const cap of ['none', 'corrupted', 'capture']) for (const wave of [false, true]) {
      const l = q(label, law, cap, wave); if (l) lines.push(l);
    }
    expect(lines.length).toBeGreaterThan(0);
    // anchored: `lines` is asserted non-empty just above, and each member is a built line, never a drifted collection
    for (const l of lines) expect(l).not.toMatch(/\d|band|score|ratio|tier|influence|rung|capture|surplus|adequate/i);
  });
});
