/**
 * tests/domain/autonomy/accelerationOps.test.js — pressure nudges, never state-jumps
 * (SURVEYOR S7). The nudge CONSUMES the registered op vocabulary (injectCampaignStressor
 * — honest-registration pinned against the Track K manifest), its severity ceiling is
 * lockstep with the realm verbs' 'severe' dial, and the builder EMITS shapes only —
 * a deep-frozen input proves it writes nothing.
 */

import { describe, expect, test } from 'vitest';

import {
  NUDGE_OP_TYPE, NUDGE_TYPES, MAX_NUDGE_SEVERITY, MIN_NUDGE_SEVERITY,
  validateNudge, buildNudgeOp, describeNudge,
} from '../../../src/domain/autonomy/accelerationOps.js';
import { STRESSOR_CATALOG } from '../../../src/domain/worldPulse/stressorsCore.js';
import { REALM_SEVERITY_VALUES } from '../../../src/domain/events/realmManifest.js';
import { operationFor } from '../../../src/store/operationRegistry.js';
import { deepFreeze } from './fixture.js';

describe('the consumed vocabulary (duplicate nothing)', () => {
  test('the nudge op type is REGISTERED in the Track K manifest — honest registration', () => {
    const op = operationFor(NUDGE_OP_TYPE);
    expect(op, `"${NUDGE_OP_TYPE}" must be a registered operation`).toBeTruthy();
    expect(op.opType).toBe('injectCampaignStressor');
    expect(op.targetScope).toBe('campaign');
  });

  test('the nudge type vocabulary IS the stressor catalog (no parallel list)', () => {
    expect(NUDGE_TYPES).toEqual(Object.keys(STRESSOR_CATALOG));
    expect(NUDGE_TYPES.length).toBeGreaterThanOrEqual(21);
  });

  test('the severity ceiling is lockstep with the realm verbs\' severe dial', () => {
    expect(MAX_NUDGE_SEVERITY).toBe(REALM_SEVERITY_VALUES.severe);
  });
});

describe('validateNudge (the closed wall)', () => {
  const world = { settlementIds: ['ashford', 'bramwick'] };

  test('a catalogued nudge at a campaign settlement with bounded severity passes', () => {
    const v = validateNudge({ type: 'famine', originSettlementId: 'ashford', severity: 0.5 }, world);
    expect(v).toEqual({ ok: true, errors: [] });
  });

  test('an uncatalogued stressor type is rejected', () => {
    const v = validateNudge({ type: 'dragon_tantrum', originSettlementId: 'ashford', severity: 0.5 }, world);
    expect(v.ok).toBe(false);
    expect(v.errors.join('\n')).toMatch(/unknown stressor type/);
  });

  test('an origin outside the campaign is rejected', () => {
    const v = validateNudge({ type: 'famine', originSettlementId: 'ghost', severity: 0.5 }, world);
    expect(v.ok).toBe(false);
  });

  test('severity outside the bounded window is rejected (both ends)', () => {
    expect(validateNudge({ type: 'famine', originSettlementId: 'ashford', severity: 0.95 }, world).ok).toBe(false);
    expect(validateNudge({ type: 'famine', originSettlementId: 'ashford', severity: 0.01 }, world).ok).toBe(false);
  });
});

describe('buildNudgeOp — emission shapes only, never a write', () => {
  test('emits the registered op shape and re-clamps severity at the ceiling', () => {
    const emission = buildNudgeOp('camp-1', { type: 'famine', originSettlementId: 'ashford', severity: 7 });
    expect(emission).toEqual({
      opType: 'injectCampaignStressor',
      campaignId: 'camp-1',
      stressor: { type: 'famine', originSettlementId: 'ashford', severity: MAX_NUDGE_SEVERITY },
    });
    expect(Object.isFrozen(emission)).toBe(true);
    expect(Object.isFrozen(emission.stressor)).toBe(true);
  });

  test('re-clamps a floor-crawling severity up to the minimum', () => {
    const emission = buildNudgeOp('camp-1', { type: 'famine', originSettlementId: 'ashford', severity: -3 });
    expect(emission.stressor.severity).toBe(MIN_NUDGE_SEVERITY);
  });

  test('a deep-frozen nudge input passes through untouched (zero writes)', () => {
    const nudge = deepFreeze({ type: 'rebellion', originSettlementId: 'bramwick', severity: 0.6, rationale: 'stir the pot' });
    const emission = buildNudgeOp('camp-1', nudge);
    expect(emission.stressor).toEqual({ type: 'rebellion', originSettlementId: 'bramwick', severity: 0.6 });
    expect(nudge.severity).toBe(0.6);
  });

  test('describeNudge renders the catalog label + origin + severity', () => {
    const line = describeNudge({ type: 'famine', originSettlementId: 'ashford', severity: 0.6 });
    expect(line).toBe('Famine pressure at ashford (severity 60%)');
  });
});
