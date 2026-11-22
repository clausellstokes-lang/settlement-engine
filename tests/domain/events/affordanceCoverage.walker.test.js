/**
 * tests/domain/events/affordanceCoverage.walker.test.js — THE COVERAGE WALKER
 * (Composer V2 §2/§8: the standing criterion's enforcement arm).
 *
 * Every registry event type has an affordance-manifest entry: either a FULL
 * authorable entry (predicate + dials + targetsFrom + scope + authority) or an
 * explicit `foldedInto` pointing at its carrying verb — the 9 folded types
 * become LEGIBLE ("PLAGUE arrives via Apply stressor (plague)") instead of
 * silently absent. A new event type cannot ship uncovered: this walker is the
 * per-wave criterion made fail-closed.
 *
 * (Scope note: W-COMPOSER-1 covers the event-type branch layer of the
 * two-level tree. The trunk layer — the REALM verbs — LANDED with W-COMPOSER-2
 * in realmManifest.js, walked by realmCoverage.walker.test.js; this walker
 * stays the settlement-branch authority.)
 */

import { describe, it, expect } from 'vitest';
import { EVENT_TYPES, EVENT_REGISTRY } from '../../../src/domain/events/registry.js';
import {
  AFFORDANCE_MANIFEST, NON_AUTHORABLE_EVENTS, VERB_FAMILIES,
  TARGET_ENTITY_BY_EVENT, ENTITY_KINDS, authorableVerbs,
} from '../../../src/domain/events/affordanceManifest.js';

const KIND_SET = new Set(ENTITY_KINDS);

describe('affordance coverage walker (registry → manifest, fail-closed)', () => {
  it('every registry event type has a manifest entry', () => {
    const missing = EVENT_TYPES.filter(t => !AFFORDANCE_MANIFEST[t]);
    expect(
      missing,
      `event types with no affordance entry: ${missing.join(', ')} — a new type ships with its verb, predicate, dials, and preview (Composer V2 LAW 2)`,
    ).toEqual([]);
  });

  it('every manifest entry names a real registry type (no orphans)', () => {
    const orphans = Object.keys(AFFORDANCE_MANIFEST).filter(t => !EVENT_REGISTRY[t]);
    expect(orphans).toEqual([]);
  });

  it('exactly the NON_AUTHORABLE set is folded, and each fold is LEGIBLE', () => {
    const folded = Object.values(AFFORDANCE_MANIFEST).filter(e => e.foldedInto);
    expect(new Set(folded.map(e => e.type))).toEqual(new Set([...NON_AUTHORABLE_EVENTS]));
    for (const e of folded) {
      const via = e.foldedInto.via;
      const carrier = AFFORDANCE_MANIFEST[via];
      expect(carrier, `${e.type} folds into unknown verb ${via}`).toBeTruthy();
      expect(carrier.foldedInto, `${e.type} folds into ${via}, which is itself folded`).toBeFalsy();
      // Legibility: the card names its carrying verb in prose.
      expect(typeof e.foldedInto.note).toBe('string');
      expect(e.foldedInto.note.length).toBeGreaterThan(20);
    }
  });

  it('every AUTHORABLE entry carries the full §2 surface', () => {
    for (const v of authorableVerbs()) {
      expect(typeof v.predicate, `${v.type} predicate`).toBe('function');
      expect(Array.isArray(v.dials), `${v.type} dials`).toBe(true);
      expect(v.scope).toBe('settlement');
      expect(typeof v.authority).toBe('string');
      expect(VERB_FAMILIES).toContain(v.family);
      // targetsFrom agrees with the (re-exported) TARGET_ENTITY_BY_EVENT map
      // unless the entry deliberately overrides (CHANGE_RULING_POWER's seat
      // gate targets factions).
      if (TARGET_ENTITY_BY_EVENT[v.type] !== undefined && v.type !== 'CHANGE_RULING_POWER') {
        expect(v.targetsFrom, `${v.type} targetsFrom`).toBe(TARGET_ENTITY_BY_EVENT[v.type]);
      }
      // The predicate SHAPE is feasibilityGate's: verdict + WHY + unlocks.
      const p = v.predicate({}, {});
      expect(typeof p.available).toBe('boolean');
      expect(Array.isArray(p.reasons)).toBe(true);
      expect(Array.isArray(p.unlocks)).toBe(true);
      if (!p.available) expect(p.reasons.length).toBeGreaterThan(0);
    }
  });

  it('EXECUTION RESTRAINT (§9): at most 4 dials per verb, word-bands carry engine numbers', () => {
    for (const v of authorableVerbs()) {
      expect(v.dials.length, `${v.type} has ${v.dials.length} dials`).toBeLessThanOrEqual(4);
      for (const d of v.dials) {
        expect(['enum', 'band', 'range', 'target', 'toggle']).toContain(d.kind);
        expect(d.clampAtCommit, `${v.type}.${d.key} clampAtCommit`).toBe(true);
        if (d.kind === 'band') {
          // Words at the table, numbers in the engine — and the numbers live
          // inside the handler clamp range [0,1].
          expect(Object.keys(d.bandWords).length).toBeGreaterThanOrEqual(2);
          for (const n of Object.values(d.bandWords)) {
            expect(n).toBeGreaterThanOrEqual(d.min ?? 0);
            expect(n).toBeLessThanOrEqual(d.max ?? 1);
          }
        }
        if (d.kind === 'enum') expect(d.options.length).toBeGreaterThanOrEqual(2);
        if (d.kind === 'target') expect(KIND_SET.has(d.targetsFrom)).toBe(true);
      }
    }
  });

  it('the 32/9 split holds (32 authorable, 9 folded, 41 total)', () => {
    // 38/29/9 → 40/31/9 (FP-G3): the generosity counterpart verbs FORCE_RELIEF +
    // OFFER_CREDIT ship authorable (the Counterpart Criterion paid).
    // 40/31/9 → 41/32/9 (W-D, directive 3): CREATE_ROUTE ships authorable. Its
    // target roster is cross-save, so it carries no targetsFrom; the shared
    // validator in domain/roads/userRoutes.js is its real gate.
    expect(EVENT_TYPES).toHaveLength(41);
    expect(authorableVerbs()).toHaveLength(32);
    expect(Object.values(AFFORDANCE_MANIFEST).filter(e => e.foldedInto)).toHaveLength(9);
  });
});
