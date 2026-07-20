/**
 * @vitest-environment node
 *
 * supplyChainFlowCollation.test.js — [determinism-pdf-locale-collation] behavioral PIN.
 *
 * The town+ supply-chain export groups categories and orders them by severity, then
 * breaks same-severity ties by needLabel. That tie-break MUST be codepoint order
 * (compareCodepoint), never String.localeCompare — the paid PDF export is same-seed
 * constitutional, and localeCompare collates through the host ICU/CLDR tables, so two
 * locale-sensitive labels can order differently across machines/locales.
 *
 * This walks the DETERMINISTIC element tree SupplyChainFlow builds (no react-pdf render
 * needed) and asserts the group order for a locale-sensitive pair is the codepoint order
 * — a case where localeCompare(en) would give the OPPOSITE order, so a regression to
 * localeCompare fails this pin.
 */
import { describe, test, expect } from 'vitest';
import { SupplyChainFlow } from '../../src/pdf/sections/SupplyChainFlow.jsx';

/** Collect, in render order, the needLabel of every CategoryGroup element in the tree. */
function groupOrder(node, out = []) {
  if (Array.isArray(node)) { node.forEach((n) => groupOrder(n, out)); return out; }
  if (!node || typeof node !== 'object') return out;
  const p = node.props || {};
  if (typeof p.needLabel === 'string' && Array.isArray(p.chains)) out.push(p.needLabel);
  if (p.children != null) groupOrder(p.children, out);
  return out;
}

describe('SupplyChainFlow category ordering — determinism (locale-independent tie-break)', () => {
  test('same-severity groups tie-break by codepoint order, not localeCompare', () => {
    // Two same-severity (all-ok) category groups with locale-sensitive labels. Codepoint
    // order puts uppercase 'Z' (0x5A) before lowercase 'a' (0x61) → ['Zürich', 'apple'];
    // String.localeCompare('en') would sort case-insensitively → ['apple', 'Zürich'].
    const chains = [
      { chainId: 'c1', needKey: 'apple', needLabel: 'apple', status: 'ok', nodes: [] },
      { chainId: 'c2', needKey: 'zurich', needLabel: 'Zürich', status: 'ok', nodes: [] },
    ];
    const el = SupplyChainFlow({ chains, tier: 'town' });
    expect(groupOrder(el)).toEqual(['Zürich', 'apple']);
  });

  test('severity still dominates the ordering (impaired group first regardless of label)', () => {
    const chains = [
      { chainId: 'c1', needKey: 'apple', needLabel: 'apple', status: 'ok', nodes: [] },
      { chainId: 'c2', needKey: 'zzz', needLabel: 'zzz', status: 'broken', nodes: [] },
    ];
    const el = SupplyChainFlow({ chains, tier: 'town' });
    // 'zzz' is impaired/broken (severity 100) so it precedes the healthy 'apple' group,
    // even though codepoint order would otherwise put 'apple' (0x61) before 'zzz'.
    expect(groupOrder(el)).toEqual(['zzz', 'apple']);
  });
});
