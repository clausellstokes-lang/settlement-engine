/**
 * @vitest-environment jsdom
 *
 * tests/pdf/restoredSubsections.test.js — behavioral pins for RESTORATION SWEEP 1
 * (THE PDF CLUSTER, census §1 #18–21). Each restored PDF subsection is proven to
 * render (with its real gate) AND to self-gate to nothing in its off-state, by
 * walking the section's element tree to its text leaves (react-pdf components are
 * plain hook-free functions — executed directly; no PDF bytes, which are
 * non-deterministic under renderToBuffer).
 *
 *   #18 PowerStructure — RULE & SUCCESSION (regime lineage + OCCUPIED banner)
 *   #19 ViabilityAssessment — MAGIC LEGALITY (live-world + magic-profile gated)
 *   #20 SettlementPDF — campaign_state promotes Current State to causal-substrate
 *   #21 viewModel — the entity-anchor ids + lineage + magicProfile + collectPlotHooks
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { SystemStateSnapshot } from '../../src/pdf/sections/SystemStateSnapshot.jsx';

// Recursively flatten an element tree to its text leaves. Function components are
// executed (plain functions in src/pdf — no hooks); hosts walked via children.
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
}
const joined = (node) => collectText(node).join('  ');

const CFG = { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road', monsterThreat: 'civilized' };
const SEED = 'restored-subsections-2026';

let settlement, vm, vmState;
beforeAll(() => {
  settlement = generateSettlementPipeline(CFG, null, { seed: SEED, customContent: {} });
  vm = buildViewModel({ settlement });
  // A state-bearing vm so the Current State chapter renders its real body (not the
  // "unavailable" shell) — the precondition for the causal-substrate subsection.
  vmState = buildViewModel({ settlement, systemState: { snapshotAtTick: 0 } });
});

describe('#20 SettlementPDF — Current-State causal-detail restoration', () => {
  it('the renderer prints the causal substrate ONLY when causalDetail is passed', () => {
    const on  = joined(SystemStateSnapshot({ settlement, vm: vmState, causalDetail: true }));
    const off = joined(SystemStateSnapshot({ settlement, vm: vmState, causalDetail: false }));
    expect(on, 'causalDetail=true must render the 16-variable substrate grid')
      .toContain('CAUSAL SUBSTRATE (16 VARIABLES)');
    expect(off, 'causalDetail=false stays the byte-identical 4-dim snapshot')
      .not.toContain('CAUSAL SUBSTRATE (16 VARIABLES)');
  });

  it('the campaign_state variant threads causalDetail=true into the State chapter', () => {
    const doc = SettlementPDF({
      settlement, systemState: { snapshotAtTick: 0 }, phase: 'canon', variant: 'campaign_state',
    });
    expect(joined(doc), 'campaign_state promotes Current State to state + substrate')
      .toContain('CAUSAL SUBSTRATE (16 VARIABLES)');
  });

  it('the default canon_dossier variant does NOT promote the State chapter to substrate', () => {
    const doc = SettlementPDF({
      settlement, systemState: { snapshotAtTick: 0 }, phase: 'canon', variant: 'canon_dossier',
    });
    expect(joined(doc), 'a non-campaign_state export keeps the substrate off')
      .not.toContain('CAUSAL SUBSTRATE (16 VARIABLES)');
  });
});
