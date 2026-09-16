/**
 * correctionTypology.test.js — pins the §9 correction-typology vocabulary (the
 * versioned, self-describing contract) and the pre-Surveyor deferral boundary: only
 * 'unclassified_manual' is capturable now; the six Surveyor classes are declared but
 * deferred. A future Surveyor wave that adds a class must update this pin deliberately.
 */
import { describe, it, expect } from 'vitest';
import {
  CORRECTION_TYPOLOGY_VERSION,
  PRE_SURVEYOR_CLASS,
  SURVEYOR_CLASSES,
  CORRECTION_CLASSES,
  isCorrectionClass,
  isCaptureableNow,
} from '../../src/domain/intent/correctionTypology.js';

describe('§9 correction typology vocabulary', () => {
  it('pins the version + the pre-Surveyor class', () => {
    expect(CORRECTION_TYPOLOGY_VERSION).toBe(1);
    expect(PRE_SURVEYOR_CLASS).toBe('unclassified_manual');
  });

  it('declares exactly the six Surveyor classes (deferred)', () => {
    expect(SURVEYOR_CLASSES).toEqual([
      'misread_requirement',
      'wrong_mechanism',
      'wrong_magnitude',
      'over_inference',
      'under_inference',
      'protected_constraint_graze',
    ]);
  });

  it('the full vocabulary is the pre-Surveyor class + the Surveyor classes, frozen', () => {
    expect(CORRECTION_CLASSES).toEqual(['unclassified_manual', ...SURVEYOR_CLASSES]);
    expect(Object.isFrozen(CORRECTION_CLASSES)).toBe(true);
    expect(Object.isFrozen(SURVEYOR_CLASSES)).toBe(true);
  });

  it('only the pre-Surveyor class is capturable now; every declared class is recognised', () => {
    expect(isCaptureableNow(PRE_SURVEYOR_CLASS)).toBe(true);
    for (const c of SURVEYOR_CLASSES) {
      expect(isCorrectionClass(c)).toBe(true);      // declared/recognised
      expect(isCaptureableNow(c)).toBe(false);       // but deferred (not emitted)
    }
    expect(isCorrectionClass('not_a_class')).toBe(false);
  });
});
