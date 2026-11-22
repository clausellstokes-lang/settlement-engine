/**
 * tests/generators/arrivalHarbourDocks.test.js — R2-CODE-A item 4 (the cold list REVIEW-W2A-3, HIGH
 * #1): "The harbour at Chalahau announces itself beyond the last rise: masts above the roofs, gulls
 * wheeling over the quays…" opened a thorp's arrival beside its own origin line "ask for the docks
 * and you are told there are none". The port scene's four harbour rows (`data/narrativeData.js ::
 * ARRIVAL_SCENES.port`) declare the docks; two rows that say only the shore stand beside them, so a
 * port with no harbour still opens on a line true of it. The draw is the scene's own door (the
 * redraw-once, `narrative/arrivalScene.js :: drawAdmitted`, on the 'arrival-scene' substream).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { ARRIVAL_SCENES } from '../../src/data/narrativeData.js';
import { declarationOf } from '../../src/domain/facts/factVocabulary.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

const HARBOUR = /harbour|quays|masts|dock crews|chandlers|working port/i;

describe('the port scene: a harbour row declares the docks; a shore row says only the shore', () => {
  it('every port row that names a harbour, quays or masts needs the docks; the rest need only the coast', () => {
    for (const row of ARRIVAL_SCENES.port) {
      const text = /** @type {any} */ (row).text('X');
      const d = declarationOf(row);
      if (HARBOUR.test(text)) expect(d.needs, text).toContain('docks');
      else expect(d.needs, text).toEqual(['coast']);
    }
    // 2 -> 4 (L2, 2026-11-20; re-keyed by identity): L2 APPENDED two shore rows that declare `coast` and name no harbour ("The last
    // stretch of road … runs beside the sea", "Gulls ride the wind above …"); the law above (a harbour word needs the docks, the rest
    // need only the coast) is unchanged and holds of every row, the appended moorings row naming the harbour it declares
    expect(ARRIVAL_SCENES.port.filter((r) => !HARBOUR.test(/** @type {any} */ (r).text('X')))).toHaveLength(4);
  });
});

describe('the cold list\'s thorp, born as the app births it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rw3-thorp-calm-1 (#1): a shore with no docks opens on the shore, never a harbour', () => {
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'thorp', selectedStressesRandom: false, selectedStresses: [], _randomizePriorities: true }), null, { seed: 'rw3-thorp-calm-1', customContent: {} }));
    expect(factsOf(s).hasInstitution('docks')).toBe(false);
    const opener = String(s.arrivalScene || '').split(/(?<=[.!?])\s+/)[0];
    // RE-KEYED BY IDENTITY 2026-11-20 (L2, the chair's word of 15:35): the anchor was two shore rows' words (/comes down to the
    // sea|face to the open water/); L2 APPENDED two shore rows and the draw moved to one of them ("Gulls ride the wind above …").
    // The anchor is now COMPUTED from the pool's own export: the opener is one of the port rows that declare only the coast
    const SHORE = ARRIVAL_SCENES.port.filter((r) => !HARBOUR.test(/** @type {any} */ (r).text('X'))).map((r) => /** @type {any} */ (r).text(s.name));
    expect(SHORE.length).toBeGreaterThan(0);
    expect(SHORE).toContain(opener);
    // anchored: the toContain above proves this same opener is the shore row's live sentence
    expect(opener).not.toMatch(HARBOUR);
  });
});
