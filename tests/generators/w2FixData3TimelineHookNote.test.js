/**
 * W2-FIX-DATA-3 item 6 (the chair's ruling on the carried red): the ledger's note of a TIMELINE hook names the
 * row by its own index in the template. `historyGenerator.js :: resolveTimelineHook` hands `drawDeclared` a domain
 * that LEADS with the drawn row, and the note's id is the line's index in the domain it was handed
 * (`drawDeclared.js :: lineIdOf`), so every timeline hook was noted as line 0 and the repetition guard read one line
 * where the town printed several. The tension's own hooks (drawKind A) are noted by their template index already;
 * the two now share one id space. Only the note moves: the draw, its argmax key and the printed text do not.
 * Red while every timeline note read 0.
 */
import { beforeAll, describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { withPresumptionLedger } from '../../src/domain/facts/presumptionLedger.js';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { lineText } from '../../src/domain/facts/drawDeclared.js';

const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const PREFIX = 'historyData:HISTORICAL_EVENTS_DATA.plotHooks:';
const norm = (/** @type {string} */ t) => t.toLowerCase().replace(/[^a-z ]/g, '');

describe('W2-FIX-DATA-3: a timeline hook is noted by its own row in the template', () => {
  /** @type {Array<{ seed: string, s: any, notes: any[] }>} */ const births = [];
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    for (let i = 0; i < 12; i++) {
      const seed = `r2r-town-${i}`;
      const { result: s, ledger } = withPresumptionLedger(() => generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: 'town' }), null, { seed, customContent: {} }));
      births.push({ seed, s, notes: ledger.filter((e) => String(e.pool).startsWith(PREFIX) && e.drawKind === 'R' && e.resolvedBy !== 'none') });
    }
  }, 240_000);

  test('two different hook lines of one template note two line ids', () => {
    // For every PRINTED event, each hook row it prints is among its pool's noted ids. (A note of an event the
    // timeline later replaced by its anchor, or dropped as a repeat, stays in the ledger: notes may be more.)
    let pairs = 0;
    for (const { seed, s, notes } of births) {
      for (const e of s.history?.historicalEvents || []) {
        const rows = HISTORICAL_EVENTS_DATA.find((t) => t.type === e.templateType)?.plotHooks;
        if (!rows || !(e.plotHooks || []).length) continue;
        const at = (e.plotHooks || []).map((h) => rows.findIndex((r) => norm(h).endsWith(norm(String(lineText(r)))))).filter((i) => i >= 0);
        const noted = new Set(notes.filter((n) => n.pool === PREFIX + e.templateType).map((n) => n.lineId));
        for (const i of at) expect(noted.has(i), `${seed} ${e.templateType}: row ${i} printed, noted ${[...noted]}`).toBe(true);
        if (new Set(at).size > 1) pairs += 1;
      }
    }
    expect(pairs, 'some event prints two different rows of its template').toBeGreaterThan(0);
  });

  test('every timeline note names a row of its own template', () => {
    for (const { seed, notes } of births) {
      for (const e of notes) {
        const rows = HISTORICAL_EVENTS_DATA.find((t) => t.type === String(e.pool).slice(PREFIX.length))?.plotHooks || [];
        expect(typeof e.lineId === 'number' && e.lineId >= 0 && e.lineId < rows.length, `${seed} ${e.pool} #${e.lineId}`).toBe(true);
      }
    }
    expect(births.reduce((n, b) => n + b.notes.length, 0)).toBeGreaterThan(10);
  });
});
