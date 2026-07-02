import { describe, it, expect } from 'vitest';
import { STATUS, getStatus } from '../../src/components/new/SupplyChainsPanel.jsx';

describe('SupplyChainsPanel getStatus', () => {
  // Regression: the engine genuinely emits these healthy statuses
  // (computeActiveChains.js -> 'entrepot', chainMagicSubstitution.js ->
  // 'magically_sustained'). They must NOT fall through to the amber
  // "Vulnerable" chip.
  it('maps entrepot to its own healthy Entrepôt chip (not Vulnerable)', () => {
    const st = getStatus('entrepot');
    expect(st).toBe(STATUS.entrepot);
    expect(st.label).toBe('Entrepôt');
    expect(st).not.toBe(STATUS.vulnerable);
  });

  it('maps magically_sustained to its own chip (not Vulnerable)', () => {
    const st = getStatus('magically_sustained');
    expect(st).toBe(STATUS.magically_sustained);
    expect(st.label).toBe('Magically Sustained');
    expect(st).not.toBe(STATUS.vulnerable);
  });

  it('still falls back to vulnerable for genuinely unknown statuses', () => {
    expect(getStatus('some_unknown_status')).toBe(STATUS.vulnerable);
    expect(getStatus(undefined)).toBe(STATUS.vulnerable);
  });

  it('keeps the known status mappings intact', () => {
    expect(getStatus('running')).toBe(STATUS.running);
    expect(getStatus('impaired')).toBe(STATUS.impaired);
    expect(getStatus('broken')).toBe(STATUS.broken);
  });
});
