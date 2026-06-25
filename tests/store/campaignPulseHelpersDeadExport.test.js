/**
 * tests/store/campaignPulseHelpersDeadExport.test.js — dead-export guard.
 *
 * foldSettlementUpdatesOntoSaves was exported but never imported (its only
 * "used by" reference was a stale doc comment in advanceInterval.js). It was
 * removed; this guard keeps it from creeping back, and confirms the helpers that
 * ARE wired stay exported.
 */

import { describe, it, expect } from 'vitest';
import * as helpers from '../../src/store/campaignPulseHelpers.js';

describe('campaignPulseHelpers exports', () => {
  it('does not re-export the removed dead helper', () => {
    expect(helpers.foldSettlementUpdatesOntoSaves).toBeUndefined();
  });

  it('still exports the live pulse helpers', () => {
    expect(typeof helpers.applyWorldPulseResultToState).toBe('function');
    expect(typeof helpers.capturePulseSnapshot).toBe('function');
    expect(typeof helpers.restorePulseSnapshot).toBe('function');
    expect(typeof helpers.drainCampaignQueueIntoState).toBe('function');
  });
});
