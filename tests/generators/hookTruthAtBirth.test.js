/**
 * A HOOK FALSE ON ITS OWN RECORD IS NOT STORED (lane RUNG1-TRUTH unit A, 2026-11-04;
 * docs/SOAK_1000_RUNG1_2026-11-04.md §2 row 11, the dry run's row 11).
 *
 * Rung 1 found 216 of 1,000 records storing a hook the record itself contradicts: "The
 * settlement is starving. Villagers are turning to banditry…" on fed places and in cities,
 * "Someone is paying their soldiers…" with no armed force, a blockade's "21 days of reserves"
 * over 6.5 months in store. The page refused every one (`hook-truth-page` 0); the record kept
 * them. The assembly step now runs the record-level check (`hookTruthRecord.js ::
 * withoutFalseHooks`, the same walk and classifier as `hookTruthFindings`) before it stores
 * the hooks, after every draw: a false hook leaves the list's next candidate, or none.
 *
 * Seeds are the de-aliased corpus's (`scripts/audit/soak-review/corpus.mjs :: birth`).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { hookTruthFindings, storeTrueHooksOnly, withoutFalseHooks } from '../../src/domain/coherence/hookTruthRecord.js';
import { recordInvariants } from '../../src/domain/edit/recordInvariants.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

const STARVING = 'The settlement is starving. Villagers are turning to banditry, and a merchant has offered to supply food at a price the settlement cannot pay in coin.';
const SOLDIERS = "Someone is paying their soldiers more than their salary. The soldiers aren't saying who.";

/** Every stored hook's text, the walk `hookTruthFindings` makes (crisis hooks excluded). */
function storedTexts(s) {
  const out = [];
  const take = (list) => { if (Array.isArray(list)) for (const h of list) out.push(typeof h === 'string' ? h : (h?.hook ?? h?.text ?? '')); };
  (s.npcs || []).forEach((n) => take(n?.plotHooks));
  (s.conflicts || []).forEach((c) => take(c?.plotHooks));
  (s.history?.currentTensions || []).forEach((t) => take(t?.plotHooks));
  (s.history?.historicalEvents || []).forEach((e) => take(e?.plotHooks));
  take(s.economicViability?.plotHooks);
  take(s.economicState?.safetyProfile?.plotHooks);
  return out;
}

describe('the record stores only hooks true of it', () => {
  beforeAll(async () => { await ensureLaws(); });

  it('soak1k-28: the starving hook on a fed place is not stored, and the place keeps hooks', () => {
    const { settlement } = birth(28);
    const texts = storedTexts(settlement);
    expect(texts).not.toContain(STARVING); // anchored: the next line proves the stored hooks are non-empty
    expect(texts.length).toBeGreaterThan(0);
    expect(hookTruthFindings(settlement)).toEqual([]);
  });

  it('soak1k-476: "paying their soldiers" with no armed force is not stored', () => {
    const { settlement } = birth(476);
    expect(storedTexts(settlement).length).toBeGreaterThan(0);
    expect(storedTexts(settlement)).not.toContain(SOLDIERS); // anchored: the line above proves the place keeps stored hooks
    expect(hookTruthFindings(settlement)).toEqual([]);
  });

  it('soak1k-556: a blockade hook whose days contradict the store is not stored', () => {
    const { settlement } = birth(556);
    expect(storedTexts(settlement).some((t) => /blockades the port/.test(t))).toBe(false);
    expect(hookTruthFindings(settlement)).toEqual([]);
  });

  // V-SUMMARY-HOOKS (LANDING-6, record 28): the golden corpus's coastal-port village stored 1 viability hook
  // under a summary saying "2 plot hooks available" (the filter dropped one and left the count; TRUTH 7eb0bf0ba).
  it('village|germanic|coastal|port: the viability summary states the stored hook count', () => {
    const row = goldenCorpus().find((each) => keyOf(each) === 'village|germanic|coastal|port|civilized|golden-master-v3');
    const { _seed: grain, ...cfg } = row;
    const settlement = generateSettlementPipeline(cfg, null, { seed: grain, customContent: {} });
    const stated = Number(/(\d+)\s+plot hooks? available/.exec(settlement.economicViability.summary)?.[1]);
    expect(stated).toBe(settlement.economicViability.plotHooks.length);
    expect(recordInvariants(settlement).map((each) => each.id)).not.toContain('V-SUMMARY-HOOKS'); // anchored: the line above proves the summary states the stored hook count, the very thing V-SUMMARY-HOOKS checks
  });

  it('the receipt\'s battery no longer finds a record hook on soak1k-28', () => {
    const { settlement } = birth(28);
    const battery = settlement.generationCoherenceReceipt.judgments.find((j) => j.id === 'record_coherence_battery');
    expect(battery).toBeTruthy();
    expect((battery?.findings || []).map((f) => f.path)).not.toContain('battery.hook-truth-record'); // anchored: the line above proves the battery judgment is on the receipt
  });
});

describe('withoutFalseHooks — the filter after the draw', () => {
  const fed = (hooks, npcHooks = []) => ({
    name: 'Testholm',
    tier: 'village',
    economicState: { foodSecurity: { label: 'Secure', storageMonths: 12 } },
    defenseProfile: { institutions: { militia: [{ name: 'Militia' }] } },
    institutions: [],
    config: { magicExists: true },
    npcs: [{ name: 'Ada', plotHooks: npcHooks }],
    economicViability: { plotHooks: hooks.map((hook) => ({ hook, severity: 'high' })) },
  });
  const TRUE = 'The miller and the smith have stopped speaking, and the whole place is taking sides.';

  it('keeps the true hooks in their order and drops the false one', () => {
    const record = fed([TRUE, STARVING, 'A second true line about the ferry.']);
    const next = storeTrueHooksOnly(record);
    expect(next.economicViability.plotHooks.map((h) => h.hook)).toEqual([TRUE, 'A second true line about the ferry.']);
    expect(record.economicViability.plotHooks).toHaveLength(3); // never mutated in place
  });

  it('a record whose hooks are all true comes back by reference, with no patch', () => {
    const record = fed([TRUE], [TRUE]);
    expect(withoutFalseHooks(record)).toEqual({ dropped: 0, patch: {} });
    expect(storeTrueHooksOnly(record)).toBe(record);
  });

  // V-SUMMARY-HOOKS (LANDING-6, record 28; the chair's ruling 2): the viability summary's "N plot hooks
  // available" is re-derived from the SURVIVING hooks, never left at the pre-filter count.
  it('the viability summary counts the hooks that survive the filter', () => {
    const record = fed([TRUE, STARVING]);
    record.economicViability = { ...record.economicViability, viable: true, issues: [],
      dependencies: [{ severity: 'dependency', title: 'Grain' }], metrics: { foodBalance: { dailyNeed: 10, deficit: 0 } },
      summary: '✓ VIABLE: Settlement can survive but has 1 operational dependency that require active management. 2 plot hooks available.' };
    const next = storeTrueHooksOnly(record);
    expect(next.economicViability.plotHooks).toHaveLength(1);
    expect(next.economicViability.summary).toBe('✓ VIABLE: Settlement can survive but has 1 operational dependency that require active management. 1 plot hooks available.');
  });

  it('an NPC row is copied only when its own hook leaves it', () => {
    const record = fed([TRUE], [STARVING, TRUE]);
    const next = storeTrueHooksOnly(record);
    expect(next.npcs[0].plotHooks).toEqual([TRUE]);
    expect(next.economicViability).toBe(record.economicViability);
  });
});
