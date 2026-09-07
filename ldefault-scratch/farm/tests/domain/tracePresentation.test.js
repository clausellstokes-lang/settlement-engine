import { describe, expect, it } from 'vitest';
import {
  traceEffectLabel,
  traceResultLabel,
  traceTargetLabel,
  traceTokenLabel,
} from '../../src/domain/display/tracePresentation.js';

describe('trace presentation — machine ids stop at the display boundary', () => {
  it('explains known config assignments and combined causes', () => {
    expect(traceTokenLabel('config.tradeRouteAccess=random_trade'))
      .toBe('Your trade access choice: Random');
    expect(traceTokenLabel('tier.city + terrain.river_valley'))
      .toBe('Settlement size: City and Terrain: River valley');
  });

  it('labels subjects, decisions, and effects without dotted or underscored ids', () => {
    expect(traceTargetLabel({
      targetType: 'resource',
      targetId: 'resource.iron_deposits',
    })).toBe('Resource: Iron deposits');
    expect(traceResultLabel('present_but_depleted')).toBe('Present, but depleted');
    expect(traceEffectLabel('tradeConnectivity')).toBe('Trade connectivity');
  });

  it('keeps useful recorded precision while removing token syntax', () => {
    expect(traceEffectLabel('+30% final_likelihood')).toBe('+30% final likelihood');
    expect(traceTokenLabel('unknownFutureSource')).toBe('Unknown future source');
  });

  it('preserves an authored name carried after a structural prefix', () => {
    expect(traceTokenLabel('resource.Moonpetal Grove')).toBe('Resource: Moonpetal Grove');
  });
});
