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
import { PowerStructure } from '../../src/pdf/sections/PowerStructure.jsx';
import { ViabilityAssessment } from '../../src/pdf/sections/ViabilityAssessment.jsx';

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

describe('#21 viewModel — entity-anchor ids + lineage + magicProfile + collectPlotHooks', () => {
  it('every faction / institution / npc carries a stable anchor id', () => {
    expect(vm.power.factions.length, 'city fixture has factions').toBeGreaterThan(0);
    expect(vm.power.factions.every(f => typeof f.id === 'string' && f.id.startsWith('faction.')),
      'each faction card sets its own faction.<snake> anchor id').toBe(true);
    expect(vm.services.detailed.length, 'city fixture has institutions').toBeGreaterThan(0);
    expect(vm.services.detailed.every(i => typeof i.id === 'string' && i.id.length > 0),
      'each institution carries an anchor id').toBe(true);
    expect(vm.npcs.all.length, 'city fixture has npcs').toBeGreaterThan(0);
    expect(vm.npcs.all.every(n => typeof n.id === 'string' && n.id.length > 0),
      'each npc carries an anchor id').toBe(true);
    // factionLink is the canonical faction id (or null) — never garbage.
    expect(vm.npcs.all.every(n => n.factionLink === null || String(n.factionLink).startsWith('faction.')),
      'an npc affiliation resolves to a faction id (or null), no name-matching').toBe(true);
  });

  it('lineage maps previousGovernments and self-gates to [] with no regime history', () => {
    const withHistory = buildViewModel({ settlement: { powerStructure: { previousGovernments: [
      { government: 'The Old Council', cause: 'conquest', tick: 12, by: 'Iron Legion' },
    ] } } });
    expect(withHistory.power.lineage).toEqual([
      { government: 'The Old Council', cause: 'conquest', tick: 12, by: 'Iron Legion' },
    ]);
    // Absent / empty previousGovernments ⇒ [] ⇒ the RULE & SUCCESSION subsection
    // renders nothing (byte-identical for a settlement with no regime history).
    expect(buildViewModel({ settlement: { powerStructure: {} } }).power.lineage).toEqual([]);
  });

  it('magicProfile is live for a magical fixture and self-gates for a dead-magic world', () => {
    expect(vm.viability.magicProfile.exists, 'default fixture has functioning magic').toBe(true);
    expect(vm.viability.magicProfile.lines.length, 'a magical world summarizes its legality facets')
      .toBeGreaterThan(0);
    const dead = buildViewModel({ settlement: { config: { magicExists: false } } });
    expect(dead.viability.magicProfile.exists, 'dead-magic world reports no magic').toBe(false);
    expect(dead.viability.magicProfile.lines, 'and prints no legality lines (byte-identical off-state)')
      .toEqual([]);
  });

  it('neighbour carries an anchor id + a directional label for asymmetric links', () => {
    const nv = buildViewModel({ settlement: { neighbourNetwork: [
      { neighbourName: 'Thornmere', localRelationshipRole: 'overlord', relationshipType: 'overlord' },
      { name: 'Ashford', relationshipType: 'trade_partners' },
    ] } });
    const [a, b] = nv.relationships.neighbours;
    expect(a.id).toBe('neighbour.thornmere');
    expect(a.directionalLabel).toBe('Overlord of Thornmere');
    expect(b.id).toBe('neighbour.ashford');
    expect(b.directionalLabel, 'symmetric / legacy link keeps its plain label (null)').toBeNull();
  });

  it('hooks derive from the shared collectPlotHooks aggregator (banded priority, mapped source)', () => {
    const hv = buildViewModel({ settlement: { npcs: [
      { name: 'Seer', plotHooks: ['A rumor stirs the ward.'], influence: 'high' },
    ] } });
    expect(hv.hooks.all, 'the PDF hooks chapter now reads the same aggregator as the screen').toEqual([
      { source: 'npc', sourceName: 'Seer', hook: 'A rumor stirs the ward.', priority: 'high', category: 'npc' },
    ]);
    // Every emitted hook on the real fixture carries a BAND priority (never the old
    // null) and a mapped section source group.
    const bands = new Set(['high', 'medium', 'low']);
    const sources = new Set(['npc', 'conflict', 'tension', 'crisis', 'crime', 'history', 'relationship', 'other']);
    for (const h of vm.hooks.all) {
      expect(bands.has(h.priority), `hook priority is a band string, got ${h.priority}`).toBe(true);
      expect(sources.has(h.source), `hook source is a mapped group key, got ${h.source}`).toBe(true);
    }
  });
});

describe('#18 PowerStructure — RULE & SUCCESSION subsection (regime lineage / occupation)', () => {
  it('renders the lineage subsection with cause tags when power.lineage is present', () => {
    const lineageVm = {
      ...vm,
      power: { ...vm.power, lineage: [
        { government: 'The Old Council', cause: 'conquest', tick: 12, by: 'Iron Legion' },
      ] },
    };
    const on = joined(PowerStructure({ settlement, vm: lineageVm }));
    expect(on, 'a settlement with regime history prints RULE & SUCCESSION').toContain('RULE & SUCCESSION');
    expect(on, 'the prior government is named').toContain('The Old Council');
    expect(on, 'the conquest cause is humanized into a tag').toContain('Conquest');
  });

  it('renders the OCCUPIED banner off the live-world occupation flag', () => {
    const occVm = {
      ...vm,
      power: { ...vm.power, lineage: [] },
      liveWorld: { occupied: { occupier: 'The Iron Legion', sinceTick: 7 } },
    };
    const on = joined(PowerStructure({ settlement, vm: occVm }));
    expect(on, 'a live occupation lights the OCCUPIED banner').toContain('OCCUPIED');
    expect(on, 'naming the occupier').toContain('The Iron Legion');
  });

  it('self-gates to nothing with no lineage and no occupation (byte-identical off-state)', () => {
    const offVm = { ...vm, power: { ...vm.power, lineage: [] }, liveWorld: null };
    expect(joined(PowerStructure({ settlement, vm: offVm })), 'no regime history ⇒ no subsection')
      .not.toContain('RULE & SUCCESSION');
  });
});

describe('#19 ViabilityAssessment — MAGIC LEGALITY subsection (liveWorld && magicProfile-gated)', () => {
  it('renders the legality facets for a live campaign export with functioning magic', () => {
    const liveVm = {
      ...vm,
      liveWorld: { occupied: null },
      viability: { ...vm.viability, magicProfile: {
        exists: true, legality: 'restricted', availability: 'common', institutionalControl: 'guild',
        lines: ['Availability: common.', 'Legality: restricted.'],
      } },
    };
    const on = joined(ViabilityAssessment({ settlement, vm: liveVm }));
    expect(on, 'a live magical export surfaces MAGIC LEGALITY').toContain('MAGIC LEGALITY');
    expect(on, 'and prints the summarized legality lines').toContain('Legality: restricted.');
  });

  it('self-gates off a non-campaign export even with a magic profile present', () => {
    const noLive = { ...vm, liveWorld: null, viability: { ...vm.viability, magicProfile: {
      exists: true, legality: 'restricted', availability: 'common', institutionalControl: 'guild', lines: ['x'],
    } } };
    expect(joined(ViabilityAssessment({ settlement, vm: noLive })), 'no liveWorld ⇒ no MAGIC LEGALITY block')
      .not.toContain('MAGIC LEGALITY');
  });

  it('self-gates off a dead-magic world even on a live campaign export', () => {
    const deadMagic = { ...vm, liveWorld: { occupied: null }, viability: { ...vm.viability, magicProfile: {
      exists: false, legality: null, availability: null, institutionalControl: null, lines: [],
    } } };
    expect(joined(ViabilityAssessment({ settlement, vm: deadMagic })), 'dead magic ⇒ no MAGIC LEGALITY block')
      .not.toContain('MAGIC LEGALITY');
  });
});
