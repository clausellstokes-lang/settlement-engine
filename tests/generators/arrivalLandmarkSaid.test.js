/**
 * ARRIVAL-LINES-2 (the chair's read of 2026-11-20 20:02; its common rules of 20:31 and its word of 20:50): the landmark
 * SAID from the house that stands, through `src/data/arrivalLandmarkWordings.js`. The candidate list
 * `[drawnRowOf(branch, index, drawn), ...landmarkSiblingsOf(branch)]` passes the door's filter WHOLE (house, then
 * `filterDeclared` on the facts), and a keyed `pickVariantMixed` says one. NOT WIRED (the arrival site knows the drawn
 * line only by its text: stopped for the chair's ruling). Every anchor is COMPUTED: checkInstCompat's lines are drawn
 * from it at a chosen index (a held roll), the new ones read from the data file.
 */
import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';

import { DRAWN_DECLARED, LANDMARK_WORDINGS, drawnRowOf, houseStands, landmarkSiblingsOf, sayLandmark } from '../../src/data/arrivalLandmarkWordings.js';
import { checkInstCompat } from '../../src/generators/structuralValidator.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { declarationAdmits, declarationOf } from '../../src/domain/facts/factVocabulary.js';

/** A native roster that reaches each branch of checkInstCompat (first match wins). */
const REACHES = /** @type {Record<string, string[]>} */ ({
  'great cathedral': ['great cathedral'],
  cathedral: ['cathedral (10,000+ only)'],
  'massive wall / citadel': ['massive walls and fortifications', 'citadel'],
  'wall / gatehouse': ['town walls', 'gates (if walled)'],
});
/** checkInstCompat's own line of a branch at an index: its one roll held at the slot's floor (never quoted). */
const drawnAt = (/** @type {string} */ branch, /** @type {number} */ index) => {
  setActiveRng({ random: () => (index + 0.5) / 2 });
  try { return /** @type {string} */ (checkInstCompat(REACHES[branch].map((name) => ({ name })), 'city', 50)?.text); } finally { clearActiveRng(); }
};
const factsWith = ({ walls = true, gate = true, church = true, siege = false } = {}) => ({
  defence: { walls, gate },
  faith: { hasChurch: church },
  crisis: { active: siege, has: (/** @type {string} */ k) => siege && (k === 'under_siege' || k === 'any') },
});
const ALL_HOUSES = ['great cathedral', 'cathedral (10,000+ only)', 'citadel', 'massive walls and fortifications', 'city walls and gates', 'town walls', 'gates (if walled)'];
const KEYS = Array.from({ length: 400 }, (_, i) => `seed-${i}::landmark`);
const candidates = (/** @type {string} */ branch, /** @type {number} */ index) => [drawnRowOf(branch, index, drawnAt(branch, index)), ...landmarkSiblingsOf(branch)];
const saidOver = (/** @type {any[]} */ list, /** @type {string[]} */ names, /** @type {any} */ facts) => new Set(KEYS.map((k) => sayLandmark(list, names, facts, k)));
const admits = (/** @type {any} */ r, /** @type {any} */ facts) => declarationAdmits(declarationOf(r), facts).admitted;
const SLOTS = LANDMARK_WORDINGS.flatMap((b) => [0, 1].map((index) => ({ branch: b.branch, index })));

afterEach(() => clearActiveRng());

describe('a literal has one home: checkInstCompat\'s lines are named by branch and index, never copied or keyed by text', () => {
  const source = readFileSync(new URL('../../src/data/arrivalLandmarkWordings.js', import.meta.url), 'utf8');
  it('each of the four branches: two lines in checkInstCompat, two declarations here, neither text in this file', () => {
    for (const b of LANDMARK_WORDINGS) {
      const texts = [drawnAt(b.branch, 0), drawnAt(b.branch, 1)];
      expect(new Set(texts).size, b.branch).toBe(2);
      expect(DRAWN_DECLARED[b.branch]?.length, b.branch).toBe(2);
      for (const t of texts) expect(source.includes(t), `copied: ${t}`).toBe(false);
      expect(b.said.every((r) => r.id.startsWith(`${b.branch}/+`))).toBe(true);
    }
  });
});

describe('a landmark line is said only where its house stands, the drawn line included', () => {
  for (const { branch, index } of SLOTS) {
    it(`${branch} [${index}]: every admitted row is reached where everything stands; none whose house is absent`, () => {
      const list = candidates(branch, index);
      const facts = factsWith();
      expect([...saidOver(list, ALL_HOUSES, facts)].sort()).toEqual(list.filter((r) => admits(r, facts)).map((r) => r.text).sort());
      for (const r of landmarkSiblingsOf(branch)) {
        const names = ALL_HOUSES.filter((n) => !r.house.some((h) => n.includes(h)));
        expect(saidOver(list, names, facts).has(r.text), `${r.id} without its house`).toBe(false);
      }
    });
  }
  it('a row whose declaration the record refuses is never said, the drawn line included (walls, gate, church taken away)', () => {
    for (const [atom, facts] of /** @type {const} */ ([['walls', factsWith({ walls: false })], ['gate', factsWith({ gate: false })], ['church', factsWith({ church: false })]])) {
      let refusedDrawn = 0;
      for (const { branch, index } of SLOTS) {
        const list = candidates(branch, index);
        if ((list[0].needs || []).includes(atom)) refusedDrawn += 1;
        for (const text of saidOver(list, ALL_HOUSES, facts)) {
          if (text == null) continue;
          expect((list.find((r) => r.text === text)?.needs || []).includes(atom), `${atom}: ${text}`).toBe(false);
        }
      }
      if (atom !== 'church') expect(refusedDrawn, atom).toBeGreaterThan(0);
    }
  });
  it('where nothing is admitted the door answers null (the built detail speaks)', () => {
    expect(saidOver(candidates('wall / gatehouse', 0), ALL_HOUSES, factsWith({ walls: false, gate: false }))).toEqual(new Set([null]));
  });
});

describe('under siege no line that excludes it is said', () => {
  it('the drawn line included ("unremarkable but intact" among them)', () => {
    const siege = factsWith({ siege: true });
    let excluding = 0;
    for (const { branch, index } of SLOTS) {
      const list = candidates(branch, index);
      if ((list[0].excludes || []).includes('crisis: under_siege')) excluding += 1;
      for (const text of saidOver(list, ALL_HOUSES, siege)) {
        expect((list.find((r) => r.text === text)?.excludes || []).includes('crisis: under_siege'), String(text)).toBe(false);
      }
    }
    expect(excluding).toBeGreaterThan(0);
  });
});

describe('the keyed pick is draw-free', () => {
  it('no active stream is read (a draw would throw), and the same key says the same line', () => {
    for (const { branch, index } of SLOTS) {
      const list = candidates(branch, index);
      clearActiveRng();
      expect(KEYS.map((k) => sayLandmark(list, ALL_HOUSES, factsWith(), k))).toEqual(KEYS.map((k) => sayLandmark(list, ALL_HOUSES, factsWith(), k)));
    }
  });
  it('a branch with no wordings here has no siblings', () => {
    expect(landmarkSiblingsOf('mage tower')).toEqual([]);
  });
});

describe('every new row: its house is a native-name fragment the branch reaches, its id in its branch', () => {
  it('houses stand on a roster that reaches the branch', () => {
    for (const b of LANDMARK_WORDINGS) for (const r of b.said) expect(houseStands(r, ALL_HOUSES), r.id).toBe(true);
  });
});
