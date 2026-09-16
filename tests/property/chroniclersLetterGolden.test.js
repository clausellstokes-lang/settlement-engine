/**
 * chroniclersLetterGolden.test.js — VISION V-2, the same-seed LETTER golden.
 *
 * The letter is a pure function of (wizardNews, lastReadTick, rules, flagsSeen), so
 * a fixed fixture hashes to a stable digest. A composer change (grouping, ordering,
 * voice frame, R-16 delta) trips this — the correct signal — and is re-minted WITH a
 * stated cause:
 *   UPDATE_LETTER_GOLDEN=1 npx vitest run tests/property/chroniclersLetterGolden.test.js
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { composeChroniclersLetter, letterToPlainText } from '../../src/domain/display/chroniclersLetter.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'chroniclers-letter-golden.json');
const UPDATE = process.env.UPDATE_LETTER_GOLDEN === '1';

const FIXTURE = {
  wizardNews: {
    currentTick: 14,
    entries: [
      { id: 'w1', tick: 8, significance: 'major', impactKind: 'conflict_pressure', headline: 'The border burns', summary: 'Levies march.' },
      { id: 'w2', tick: 12, significance: 'notable', impactKind: 'protection_gap', headline: 'The watch thins' },
      { id: 'a1', tick: 6, significance: 'notable', impactKind: 'authority_instability', headline: 'The council fractures' },
      { id: 't1', tick: 9, significance: 'notable', impactKind: 'import_shortage', headline: 'Grain runs short' },
      { id: 'p1', tick: 11, significance: 'major', impactKind: 'boom', headline: 'The wharves overflow' },
      { id: 'm1', tick: 7, significance: 'major', impactKind: 'generosity_relief', headline: 'Aid reaches the starving' },
      { id: 'f1', tick: 5, significance: 'notable', impactKind: 'religious_pressure', headline: 'A new rite spreads' },
    ],
  },
  lastReadTick: 4,
  simulationRules: { warLayerEnabled: true, faithSpreadEnabled: true },
  flagsSeen: ['warLayerEnabled'],
};

const hashOf = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');

describe('GOLDEN — V-2 chronicler’s letter → bytes', () => {
  it('the fixture hashes to the committed manifest', () => {
    const letter = composeChroniclersLetter(FIXTURE);
    const text = letterToPlainText(letter);
    const record = { hash: hashOf({ letter, text }), sections: letter.sections.length, total: letter.counts.total, deepened: letter.deepened ? letter.deepened.flags.length : 0 };
    if (UPDATE) {
      mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, JSON.stringify(record, null, 2) + '\n');
    }
    expect(
      existsSync(MANIFEST),
      'chroniclers-letter-golden.json missing — for an APPROVED composer change run: UPDATE_LETTER_GOLDEN=1 npx vitest run tests/property/chroniclersLetterGolden.test.js',
    ).toBe(true);
    const pinned = JSON.parse(readFileSync(MANIFEST, 'utf-8'));
    expect(record.hash).toBe(pinned.hash);
    expect(record.sections).toBe(pinned.sections);
    expect(record.total).toBe(pinned.total);
    expect(record.deepened).toBe(pinned.deepened);
  });

  it('is reproducible — a second compose hashes identically', () => {
    const a = composeChroniclersLetter(FIXTURE);
    const b = composeChroniclersLetter(FIXTURE);
    expect(hashOf({ letter: a, text: letterToPlainText(a) })).toBe(hashOf({ letter: b, text: letterToPlainText(b) }));
  });
});
