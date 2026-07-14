/**
 * namingDecontamination.test.js — [content-immersion-4].
 *
 * NAMING_DATA carried modern / cross-culture / wrong-category entries that reached
 * generated NPCs and settlements: Japanese SURNAMES as east_asian given names,
 * 'Kayla' (modern Western) and 'burg' (Germanic suffix) in east_asian, and
 * Greek/Roman astronomy words (Venus/Gemini/Pleiades) + 'Zero', a moon-goddess in
 * the male pool ('Ixchel'), and Spanish-colonial surnames in mesoamerican. This
 * pins the contaminants OUT and pool sizes preserved (1-for-1 replacement keeps
 * rng draw-counts stable). Guard against re-introduction.
 */

import { describe, test, expect } from 'vitest';
import { NAMING_DATA } from '../../src/data/namingData.js';

const has = (arr, v) => (arr || []).includes(v);

describe('[content-immersion-4] NAMING_DATA is decontaminated', () => {
  const ea = NAMING_DATA.east_asian;
  const meso = NAMING_DATA.mesoamerican;

  test('east_asian: no Japanese surnames as given names, no modern/Germanic contaminants', () => {
    for (const surname of ['Araki', 'Hayashi', 'Inoue', 'Kato', 'Mori', 'Nakamura', 'Sato', 'Tanaka']) {
      expect(has(ea.maleNames, surname), `${surname} (a surname) must not be an east_asian given name`).toBe(false);
    }
    expect(has(ea.femaleNames, 'Kayla')).toBe(false);
    expect(has(ea.settlementSuffixes, 'burg')).toBe(false);
  });

  test('mesoamerican: no Greek/Roman astronomy, no cross-gender deity, no colonial surnames', () => {
    for (const w of ['Venus', 'Gemini', 'Pleiades', 'Zero']) {
      expect(has(meso.femaleNames, w), `${w} must not be a mesoamerican female name`).toBe(false);
    }
    expect(has(meso.maleNames, 'Ixchel')).toBe(false); // Ixchel is the Maya moon GODDESS
    for (const s of ['Quijada', 'Valladolid', 'Yucatan']) {
      expect(has(meso.surnames, s), `${s} (Spanish-colonial) must not be a mesoamerican surname`).toBe(false);
    }
  });

  test('replacements are present at researched register', () => {
    expect(has(ea.maleNames, 'Akira')).toBe(true);
    expect(has(ea.femaleNames, 'Seoyeon')).toBe(true);
    expect(has(meso.femaleNames, 'Citlali')).toBe(true);
    expect(has(meso.maleNames, 'Tepeu')).toBe(true);
  });

  test('pool sizes are preserved (1-for-1 replacement — rng draw stability)', () => {
    // Sizes must match the post-fix lengths — a future add/remove that shifts draw
    // counts (and same-seed goldens) trips this.
    expect(ea.maleNames.length).toBe(110);
    expect(ea.femaleNames.length).toBe(84);
    expect(ea.settlementSuffixes.length).toBe(30);
    expect(meso.maleNames.length).toBe(81);
    expect(meso.femaleNames.length).toBe(73);
    expect(meso.surnames.length).toBe(67);
    // the replacements themselves introduced no NEW duplicates (each appears once)
    const once = (arr, v) => arr.filter((x) => x === v).length;
    for (const [arr, v] of [
      [ea.maleNames, 'Souta'], [ea.maleNames, 'Naoki'], [ea.maleNames, 'Isamu'],
      [ea.femaleNames, 'Seoyeon'], [meso.femaleNames, 'Citlali'], [meso.maleNames, 'Tepeu'],
      [meso.surnames, 'Quej'], [meso.surnames, 'Vukub'], [meso.surnames, 'Yaxche'],
    ]) {
      expect(once(arr, v), `${v} should appear exactly once`).toBe(1);
    }
  });
});
