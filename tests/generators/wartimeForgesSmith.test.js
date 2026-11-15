/**
 * THE WARTIME FORGES ARE NAMED ONLY WHERE A SMITH STANDS (TAIL-CONTENT-CLOSE-1, 2026-11-15).
 *
 * The wartime pressure line "Being on the right side of it keeps the forges of {town} running day and night …" declares
 * `needs: ['institution: smith']`, yet printed in presume-town-25 (no smithy, no smith): where no row of the pool was
 * admitted, the pressure sentence's draw kept the refused row. It now takes the row's declared twin (narrativeText.js,
 * `twinOf`), which tells the same war without the forges and is never drawn (narrativeGenerator.js). The anchors are the
 * pool's own rows at the town's own detail, never a literal sentence.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { PRESSURE_SENTENCES } from '../../src/generators/narrativeText.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { corpusConfig } from '../lint/presumedThings.shared.mjs';

// the walker's own corpus (presumedThings.shared.mjs :: corpusConfig, its town seeds), where the false line was measured
// BAR2-PLACES (the chair's ruling (PL6), 2026-11-15; re-keyed by identity): the war's side is now the crisis summary's, so
// presume-town-25 tells the loss and no longer reaches the right-side pool; the three towns below (measured: no smith, the
// right side of the war) keep the arm live.
const SEEDS = [...Array.from({ length: 60 }, (_, i) => `presume-town-${i}`), 'presume-town-655', 'presume-town-743', 'presume-town-975'];

/** the forges row's and its twin's heads (their text up to the commodity), at this town's own name @param {string} name */
const forgesHeads = (name) => {
  const CUT = '\u0000';
  const rows = /** @type {any[]} */ (PRESSURE_SENTENCES.wartime({ name, commodity: CUT, compound: { militaryEffective: 99, economyOutput: 99 } }));
  const twin = rows.find((r) => r && typeof r === 'object' && typeof r.twinOf === 'string');
  return [String(twin.twinOf).split(CUT)[0], String(twin.text).split(CUT)[0]];
};

describe('the wartime pressure line names the forges only where a smith stands', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('no town without a smith hears of its forges; the twin tells the war there', () => {
    const seen = { twin: 0 };
    // seed-loop: collected — every town is judged, and a red names each seed that printed the forges with no smith
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const town = generateSettlementPipeline({ ...corpusConfig('town') }, null, { seed, customContent: {} });
      const sentence = String(town.pressureSentence || '');
      const [forges, twin] = forgesHeads(town.name);
      if (!sentence.includes(forges) && !sentence.includes(twin)) return;
      if (factsOf(town).hasInstitution('smith')) return;
      seen.twin++;
      expectAbsentWithAnchor(sentence, forges, twin, `${seed}: no smith`);
    });
    expectNoSeedFailures(failures, 'the forges line reads the smith');
    // the arm is live: the measured towns (presume-town-655, -743, -975) take the twin
    expect(seen.twin, 'no town without a smith reached the twin').toBeGreaterThan(0);
  }, 120_000);
});
