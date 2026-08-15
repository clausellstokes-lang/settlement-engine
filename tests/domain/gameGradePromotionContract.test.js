import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { FLAG_DEFAULTS } from '../../src/lib/flagRegistry.js';
import { REALM_ATTENTION_CLASSES } from '../../src/domain/realm/realmItemAttention.js';

const root = process.cwd();
const contract = JSON.parse(fs.readFileSync(
  path.join(root, 'docs/GAME_GRADE_PROMOTION_CONTRACT.json'),
  'utf8',
));
const program = fs.readFileSync(path.join(root, contract.program), 'utf8');

const PROMOTION_FLAGS = Object.freeze([
  'settlementWorkbench',
  'heraldCommandBrief',
  'realmItemShadowDiagnostics',
]);

describe('Game Grade promotion contract', () => {
  test('covers every migration flag and agrees with the shipped defaults', () => {
    expect(Object.keys(contract.flags).sort()).toEqual([...PROMOTION_FLAGS].sort());
    for (const flagName of PROMOTION_FLAGS) {
      expect(contract.flags[flagName].shippedDefault).toBe(FLAG_DEFAULTS[flagName]);
    }
  });

  test('cannot ship a proof-only surface as the default', () => {
    for (const [flagName, entry] of Object.entries(contract.flags)) {
      if (entry.state !== 'ready') {
        expect(FLAG_DEFAULTS[flagName], `${flagName} is ${entry.state}`).toBe(false);
      }
      if (entry.state === 'ready') {
        expect(entry.blockers).toEqual([]);
      }
    }
  });

  test('keeps internal shadow accounting out of the user-facing promotion path', () => {
    expect(contract.flags.realmItemShadowDiagnostics).toMatchObject({
      state: 'internal_diagnostic',
      shippedDefault: false,
      promotionPolicy: 'never_user_default',
      blockers: [],
    });
  });

  test('pins the same six-class attention vocabulary used by RealmItem ranking', () => {
    expect(contract.attentionVocabulary).toEqual(REALM_ATTENTION_CLASSES);
  });

  test('references documented acceptance scenarios instead of opaque checklist names', () => {
    for (const entry of Object.values(contract.flags)) {
      for (const satisfiedId of entry.satisfiedNow) {
        if (/^(SED|HER)-\d+$/.test(satisfiedId)) {
          expect(program).toContain(`**${satisfiedId} `);
        }
      }
      for (const blocker of entry.blockers) {
        if (/^(SED|HER)-\d+$/.test(blocker.id)) {
          expect(program).toContain(`**${blocker.id} `);
        }
        expect(blocker.reason.trim().length).toBeGreaterThan(20);
      }
    }
  });

  test('classifies every required user-facing scenario exactly once', () => {
    const scenarioFamilies = Object.freeze({
      settlementWorkbench: 'SED',
      heraldCommandBrief: 'HER',
    });

    for (const [flagName, prefix] of Object.entries(scenarioFamilies)) {
      const required = [...program.matchAll(
        new RegExp(`\\*\\*(${prefix}-\\d+) \\[`, 'g'),
      )].map((match) => match[1]);
      const entry = contract.flags[flagName];
      const classified = [
        ...entry.satisfiedNow,
        ...entry.blockers.map((blocker) => blocker.id),
      ].filter((id) => new RegExp(`^${prefix}-\\d+$`).test(id));

      expect(new Set(required).size, `${prefix} requirements are unique`)
        .toBe(required.length);
      expect(
        new Set(classified).size,
        `${flagName} classifications are unique`,
      ).toBe(classified.length);
      expect([...classified].sort()).toEqual([...required].sort());
    }
  });
});
