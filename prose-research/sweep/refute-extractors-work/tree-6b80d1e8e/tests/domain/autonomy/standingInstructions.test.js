/**
 * tests/domain/autonomy/standingInstructions.test.js — STANDING CAMPAIGN INSTRUCTIONS
 * (SURVEYOR S7): normalize/version/bound helpers, and THE DORMANCY PIN — a campaign
 * carrying the surveyorInstructions key advances BYTE-IDENTICALLY to one without it
 * (the key never enters engine state; no kernel reads it).
 */

import { describe, expect, test } from 'vitest';

import {
  STANDING_INSTRUCTIONS_KEY, MAX_INSTRUCTIONS_CHARS,
  normalizeStandingInstructions, nextStandingInstructions, instructionsForCompile,
} from '../../../src/domain/autonomy/standingInstructions.js';
import { simulateCampaignWorldPulse } from '../../../src/domain/worldPulse/index.js';
import { autonomyFixture, NOW } from './fixture.js';

describe('normalize + version', () => {
  test('absent / malformed / empty ⇒ null (never an empty husk)', () => {
    expect(normalizeStandingInstructions(undefined)).toBeNull();
    expect(normalizeStandingInstructions(null)).toBeNull();
    expect(normalizeStandingInstructions('a bare string')).toBeNull();
    expect(normalizeStandingInstructions({ text: '   ' })).toBeNull();
  });

  test('a real record normalizes with a floor-1 version and bounded text', () => {
    const rec = normalizeStandingInstructions({ text: `  keep the peace  `, version: 0, updatedAt: NOW });
    expect(rec).toEqual({ text: 'keep the peace', version: 1, updatedAt: NOW });
    const long = normalizeStandingInstructions({ text: 'x'.repeat(MAX_INSTRUCTIONS_CHARS + 500), version: 3 });
    expect(long.text.length).toBe(MAX_INSTRUCTIONS_CHARS);
    expect(long.version).toBe(3);
  });

  test('nextStandingInstructions bumps the version; empty text returns null (remove the key)', () => {
    const v1 = nextStandingInstructions(null, 'favor diplomacy', NOW);
    expect(v1).toEqual({ text: 'favor diplomacy', version: 1, updatedAt: NOW });
    const v2 = nextStandingInstructions(v1, 'favor diplomacy; never resolve named fates', NOW);
    expect(v2.version).toBe(2);
    expect(nextStandingInstructions(v2, '   ', NOW)).toBeNull();
  });

  test('instructionsForCompile reads the campaign key, empty-string when absent', () => {
    expect(instructionsForCompile(null)).toBe('');
    expect(instructionsForCompile({})).toBe('');
    expect(instructionsForCompile({ [STANDING_INSTRUCTIONS_KEY]: { text: 'go slow', version: 1, updatedAt: NOW } })).toBe('go slow');
  });
});

describe('THE DORMANCY PIN — the key never enters the engine', () => {
  test('a campaign WITH standing instructions advances byte-identically to one without', () => {
    const bare = autonomyFixture();
    const dressed = autonomyFixture();
    dressed.campaign = {
      ...dressed.campaign,
      [STANDING_INSTRUCTIONS_KEY]: { text: 'favor diplomacy over war', version: 4, updatedAt: NOW },
    };

    const runWeeks = ({ campaign, saves }, weeks) => {
      let c = campaign; let s = saves; let wn = campaign.wizardNews;
      const states = [];
      for (let t = 0; t < weeks; t += 1) {
        const r = simulateCampaignWorldPulse({ campaign: { ...c, wizardNews: wn }, saves: s, interval: 'one_week', now: NOW });
        const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
        s = s.map((x) => (updates.has(x.id) ? { ...x, settlement: updates.get(x.id) } : x));
        c = { ...c, worldState: r.worldState, regionalGraph: r.regionalGraph };
        wn = r.wizardNews;
        states.push({ worldState: r.worldState, updates: r.settlementUpdates });
      }
      return JSON.stringify(states);
    };

    expect(runWeeks(dressed, 3)).toBe(runWeeks(bare, 3));
  });
});
