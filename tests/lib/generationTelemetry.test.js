/**
 * generationTelemetry.test.js — the generation-id spine (Wave E1).
 *
 * Pins: the id derivation is stable + non-personal, the fingerprint is coarse
 * (bands/enums/booleans only), and recordGenerationMilestone emits ONE
 * GENERATION_MILESTONE carrying { generation_id, milestone, ...fingerprint }.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const trackMock = vi.fn();
vi.mock('../../src/lib/analytics.js', () => ({
  track: (...a) => trackMock(...a),
  EVENTS: { GENERATION_MILESTONE: 'generation_milestone' },
}));

import {
  countBand, deriveGenerationId, generationFingerprint,
  recordGenerationMilestone, GENERATION_MILESTONES,
} from '../../src/lib/generationTelemetry.js';

const sampleSettlement = () => ({
  tier: 'town',
  config: { terrainType: 'coastal' },
  stressors: [{ type: 'banditry' }, { type: 'famine' }, { type: 'banditry' }],
  activeConditions: [{ archetype: 'plague' }],
  // ⚠ THE ROOT `plotHooks` / `supplyChains` ARRAYS THIS FIXTURE CARRIED WERE A
  // SHAPE THE CORPUS NEVER EMITS. Nothing writes either key on a settlement root,
  // so the fingerprint's hook and chain bands were pinned at zero and both
  // coherence booleans at false on every real generation — and this fixture was
  // the only thing hiding it. Four hooks and two chains now sit at the addresses
  // generation actually writes, so the expected bands below are unchanged.
  npcs: [{ name: 'A', plotHooks: [{}, {}] }],
  economicViability: { plotHooks: [{}] },
  history: { historicalEvents: [{ plotHooks: [{}] }] },
  economicState: { prosperity: 'struggling', activeChains: [{}, {}] },
  powerStructure: { factions: [{}], conflicts: [{}, {}] },
  neighbourNetwork: [{}],
});

beforeEach(() => trackMock.mockClear());

describe('countBand', () => {
  it('bands counts coarsely', () => {
    expect(countBand(0)).toBe('none');
    expect(countBand(2)).toBe('low');
    expect(countBand(5)).toBe('some');
    expect(countBand(10)).toBe('many');
    expect(countBand(50)).toBe('lots');
  });
});

describe('deriveGenerationId', () => {
  it('is deterministic for the same seed + stamp (stable across reload)', () => {
    const a = deriveGenerationId('seed-1', '2026-07-09T00:00:00Z');
    const b = deriveGenerationId('seed-1', '2026-07-09T00:00:00Z');
    expect(a).toBe(b);
    expect(a).toMatch(/^g_/);
  });

  it('differs for different seeds/stamps', () => {
    expect(deriveGenerationId('seed-1', 't')).not.toBe(deriveGenerationId('seed-2', 't'));
    expect(deriveGenerationId('seed-1', 't1')).not.toBe(deriveGenerationId('seed-1', 't2'));
  });

  it('mints a fresh id when both inputs are empty', () => {
    const a = deriveGenerationId(null, null);
    const b = deriveGenerationId(undefined, undefined);
    expect(a).toMatch(/^g_/);
    expect(a).not.toBe(b);
  });
});

describe('generationFingerprint', () => {
  it('is coarse: enums, bands, bounded enum-ids, and coherence booleans', () => {
    const fp = generationFingerprint(sampleSettlement());
    expect(fp.tier).toBe('town');
    expect(fp.terrain_class).toBe('coastal');
    expect(fp.prosperity).toBe('struggling');
    expect(fp.stress_types).toEqual(['banditry', 'famine', 'plague']); // sorted, unique
    expect(fp.hook_count_band).toBe('some');   // 4 hooks
    expect(fp.chain_count_band).toBe('low');   // 2 chains
    expect(fp.has_factions).toBe(true);
    expect(fp.has_conflicts).toBe(true);
    expect(fp.has_stressors).toBe(true);
    expect(fp.has_hooks).toBe(true);
    expect(fp.has_neighbours).toBe(true);
    expect(fp.has_supply_chains).toBe(true);
  });

  it('carries no banned (free-text/PII) keys', () => {
    const banned = new Set(['name', 'newName', 'text', 'prose', 'secret', 'description', 'notes', 'email', 'body', 'label']);
    for (const k of Object.keys(generationFingerprint(sampleSettlement()))) {
      expect(banned.has(k)).toBe(false);
    }
  });

  it('degrades gracefully on a sparse settlement', () => {
    const fp = generationFingerprint({});
    expect(fp.stress_types).toEqual([]);
    expect(fp.has_factions).toBe(false);
    expect(fp.hook_count_band).toBe('none');
  });
});

describe('recordGenerationMilestone', () => {
  it('emits ONE GENERATION_MILESTONE with the id + fingerprint', () => {
    recordGenerationMilestone('generate', sampleSettlement(), { generationId: 'g_abc' });
    expect(trackMock).toHaveBeenCalledTimes(1);
    const [event, props] = trackMock.mock.calls[0];
    expect(event).toBe('generation_milestone');
    expect(props.generation_id).toBe('g_abc');
    expect(props.milestone).toBe('generate');
    expect(props.tier).toBe('town');
    expect(props.has_factions).toBe(true);
  });

  it('derives the id from seed + stamp when none is passed', () => {
    recordGenerationMilestone('save', sampleSettlement(), { seed: 's', stampIso: 't' });
    expect(trackMock.mock.calls[0][1].generation_id).toBe(deriveGenerationId('s', 't'));
  });

  it('no-ops for an unknown milestone or a missing settlement', () => {
    recordGenerationMilestone('bogus', sampleSettlement(), { generationId: 'x' });
    recordGenerationMilestone('generate', null, { generationId: 'x' });
    expect(trackMock).not.toHaveBeenCalled();
  });

  it('covers exactly the five documented milestones', () => {
    expect([...GENERATION_MILESTONES]).toEqual(['generate', 'save', 'canonize', 'export', 'narrate']);
  });
});
