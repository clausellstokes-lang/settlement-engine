import { describe, expect, test } from 'vitest';

import {
  posturePhrase,
  ticksToDeploy,
  mobilizationStandings,
  settlementMobilization,
  feasibilityOutlook,
  hasLiveMobilization,
} from '../../../src/domain/display/mobilizationStatus.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B1 — the heuristic-surfacing SEAM (the warStatus-style read-model). DM
// language, NO internal jargon (no posture enum names, no capacity numbers, no
// ratio). Inert when absent (a no-war campaign renders nothing).
// ─────────────────────────────────────────────────────────────────────────────

describe('mobilizationStatus — posture surfacing (heuristic, no jargon)', () => {
  test('phrases are DM-facing, not enum names', () => {
    expect(posturePhrase('war_preparation')).toMatch(/war footing/i);
    expect(posturePhrase('mobilized')).toMatch(/war economy/i);
    // No raw enum leaks into the phrase.
    expect(posturePhrase('war_preparation')).not.toContain('war_preparation');
  });

  test('ticksToDeploy estimates remaining ramp (0 once war-ready)', () => {
    expect(ticksToDeploy({ state: 'peace', progress: 0 })).toBeGreaterThan(0);
    expect(ticksToDeploy({ state: 'war_preparation', progress: 0.5 })).toBeGreaterThan(0);
    expect(ticksToDeploy({ state: 'mobilized', progress: 1 })).toBe(0);
    expect(ticksToDeploy({ state: 'deployed', progress: 1 })).toBe(0);
    // Closer to the top ⇒ fewer ticks.
    expect(ticksToDeploy({ state: 'war_preparation', progress: 0.9 }))
      .toBeLessThanOrEqual(ticksToDeploy({ state: 'peace', progress: 0 }));
  });

  test('standings surface mobilizers (covert hidden from player view)', () => {
    const worldState = {
      warPosture: {
        a: { state: 'mobilized', progress: 1, sinceTick: 0, covert: false },
        b: { state: 'war_preparation', progress: 0.4, sinceTick: 0, covert: true },
        c: { state: 'peace', progress: 0, sinceTick: 0 },
      },
    };
    expect(mobilizationStandings({ worldState }).map(s => s.id)).toEqual(['a']); // covert b + peace c omitted
    expect(mobilizationStandings({ worldState, includeCovert: true }).map(s => s.id).sort()).toEqual(['a', 'b']);
    expect(settlementMobilization({ settlementId: 'a', worldState })).toMatchObject({ ticksToDeploy: 0 });
    expect(settlementMobilization({ settlementId: 'c', worldState })).toBeNull(); // at peace
  });

  test('inert when absent — a no-war campaign renders nothing', () => {
    expect(mobilizationStandings({ worldState: {} })).toEqual([]);
    expect(hasLiveMobilization({ worldState: {} })).toBe(false);
    expect(settlementMobilization({ settlementId: 'x', worldState: {} })).toBeNull();
  });
});

describe('mobilizationStatus — feasibility outlook (heuristic)', () => {
  test('a hopeless matchup phrases as implausible, not contestable', () => {
    const out = feasibilityOutlook({ attackerCurrent: 8, defenderCurrent: 80 });
    expect(out.contestable).toBe(false);
    expect(out.phrase).toMatch(/hopeless|too strong/i);
    // No ratio / capacity number leaks into the DM phrase.
    expect(out.phrase).not.toMatch(/\d/);
  });

  test('a solo-but-coalition-reachable matchup phrases as "needs a coalition"', () => {
    const out = feasibilityOutlook({ attackerCurrent: 45, defenderCurrent: 65, coalitionSize: 1 });
    expect(out.phrase).toMatch(/coalition/i);
    expect(out.contestable).toBe(false);
  });

  test('a peer matchup phrases as a real contest', () => {
    const out = feasibilityOutlook({ attackerCurrent: 60, defenderCurrent: 55 });
    expect(out.contestable).toBe(true);
    expect(out.phrase).toMatch(/contest|uncertain/i);
  });
});
