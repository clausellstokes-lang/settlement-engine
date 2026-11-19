/**
 * conflictRulingIssue.test.js — COHERENCE-POWERS-8 (round three #337, HIGH, rr2s-town-calm-rand-1 Summary/Overview): the
 * quarrel's issue printed "A ruling one power refuses to obey" — a word missing. It reads "A ruling that one power
 * refuses to obey". The row keeps its old text as its stable `id`, so the draw's ledger and the quarrel's hook hash
 * (power/conflicts.js :: buildConflictPlotHooks, keyed by the id) move nothing: the same hook is drawn.
 * Measured at 91a3a9623: 23 quarrels on the census's 720 and the reader's twenty print the broken issue; 0 after.
 * Every expected word is a literal.
 */
import { describe, expect, it } from 'vitest';
import { BASE_ISSUES } from '../../src/generators/power/conflictIssues.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

describe('COHERENCE-POWERS-8 #337 · the ruling issue reads whole', () => {
  it('the row reads "A ruling that one power refuses to obey" and keeps its first text as its id', () => {
    const row = BASE_ISSUES.find((r) => r.id === 'A ruling one power refuses to obey');
    expect(row?.issue).toBe('A ruling that one power refuses to obey');
    expect(BASE_ISSUES.some((r) => r.issue === 'A ruling one power refuses to obey')).toBe(false);
  });
  it('rr2s-town-calm-rand-1 (the app\'s shape): the quarrel names the whole issue, with the hook it drew before', async () => {
    await loadGenerationLawPayloads();
    const cfg = birthConfig({ ...DEFAULT_CONFIG, settType: 'town', selectedStressesRandom: false, selectedStresses: [], _randomizePriorities: true });
    const s = /** @type {any} */ (generateSettlementPipeline(cfg, null, { seed: 'rr2s-town-calm-rand-1', customContent: {} }));
    const q = (s.powerStructure?.conflicts || s.conflicts || []).find((c) => /refuses to obey/.test(c.issue));
    expect(q?.issue).toBe('A ruling that one power refuses to obey');
    expect(q?.desc).toBe('Military Council and Merchant Guilds are in moderate conflict over a ruling that one power refuses to obey. The stakes are authority.');
    expect(q?.plotHooks).toEqual(['The ruling was given in writing, and the copy that was posted is not the one that was signed.']);
  }, 60000);
});
