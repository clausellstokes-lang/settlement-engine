/**
 * generatorGoldenMasterLit.test.js — the LIT twin of the golden master (CLOSE-1, brief GOLDEN-LIT, 2026-11-22).
 *
 * WHAT IT PINS, AND WHY A TWIN. `generatorGoldenMaster.test.js` births its 525 configurations through
 * `generateSettlementPipeline(cfg, …)` WITHOUT `birthConfig`: a config carrying no law marker is born under each
 * law's default, so that corpus is a LAW-1 corpus and no birth-law dial moves a row of it. That is right for what it
 * guards (a refactor must keep the old worlds byte-equal), and it is blind to the one thing a dial flip changes:
 * what a NEW world is born as. This file births the SAME 525 configurations and seeds — imported from
 * `tests/helpers/goldenMasterCorpus.js`, never copied, keyed by the same `keyOf` — each through `birthConfig(cfg)`
 * after `loadGenerationLawPayloads()`, exactly as every product birth reaches the pipeline. Its manifest
 * `tests/fixtures/generator-golden-master-lit.json` maps the same keys to sha256(JSON.stringify(settlement)).
 *
 * ⛔ IT IS PREPARED, NEVER RECORDED, BY ITS AUTHOR. The manifest is written ONLY through
 * `tests/helpers/goldenRecordDoor.js :: recordGolden` (surface 'generator-golden-master-lit'), which refuses without
 * a signed shift record naming this surface. Until the owner's recorded manifest lands, this suite is RED BY NAME
 * ("manifest exists …"): the dark master's own form for a golden with no manifest, so its absence is never a pass.
 * The byte test fails at once without a manifest rather than spending 525 births to report 525 drifts.
 *
 * THE CAPTURE, AFTER THE OWNER'S SIGNED SHIFT RECORD EXISTS (it names this surface; the door also needs this
 * surface's row in tests/fixtures/.golden-freeze-register.json, which is the signing act's, not a lane's):
 *   GOLDEN_SHIFT_SIGNED=docs/shift-records/<the record>.json UPDATE_GOLDEN=1 \
 *     npx vitest run tests/property/generatorGoldenMasterLit.test.js
 * The run fails BY DESIGN on a successful write (the door's law); the plain re-run, and the freeze walker, are the
 * receipt.
 *
 * ── SHIFT RECORD ────────────────────────────────────────────────────────────
 * A hash manifest cannot show WHY it moved, so every record of it is written down here, as the dark master does.
 * (none yet: no manifest has been recorded)
 */

import { beforeAll, describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { recordGolden } from '../helpers/goldenRecordDoor.js';
import { resolve, dirname } from 'node:path';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

// ONE SPELLING OF THE CORPUS: the dark master's 525 rows, their order and their key, read from the shared helper.
const corpus = goldenCorpus;

/** A row born as a NEW world is born: the laws `birthConfig` mints today, the seed the row carries. */
function hashFor(config) {
  const { _seed, ...cfg } = config;
  const s = generateSettlementPipeline(birthConfig(cfg), null, { seed: _seed, customContent: {} });
  return createHash('sha256').update(JSON.stringify(s)).digest('hex');
}

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'generator-golden-master-lit.json');

describe('generator golden master, lit (the 525 configurations born through birthConfig)', () => {
  const rows = corpus();

  // The living-content roster sits behind a lazy seam; a v2 birth without it throws. Every birth below awaits it.
  beforeAll(async () => {
    await loadGenerationLawPayloads();
  });

  if (process.env.UPDATE_GOLDEN) {
    // The capture's own budget, as the dark master's: 525 full-pipeline births overrun the root 20 s testTimeout.
    it('captures the lit golden manifest', () => {
      const out = {};
      for (const c of rows) out[keyOf(c)] = hashFor(c);
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      recordGolden({ surface: 'generator-golden-master-lit', path: MANIFEST, produce: () => JSON.stringify(out, Object.keys(out).sort(), 2) + '\n' });
      expect(Object.keys(out).length).toBe(rows.length);
    }, 180_000); // measured (2026-11-22, GOLDEN-LIT, scratch capture of the same 525 births): 47.9 s and 49.8 s here; the byte test's 180 s budget, as the dark master's capture and byte test share one figure
    return;
  }

  it('manifest exists (the owner\'s signed capture through the door records it)', () => {
    expect(existsSync(MANIFEST), 'no lit manifest: it is recorded only through the signed door, by the owner\'s shift record').toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

  it('covers the full corpus (no keys added/removed without a manifest update)', () => {
    expect(rows.map(keyOf).sort()).toEqual(Object.keys(manifest).sort());
  });

  it('every config, born through birthConfig, produces byte-identical output to the lit golden master', () => {
    expect(existsSync(MANIFEST), 'no lit manifest to compare against: red by name, never a silent pass').toBe(true);
    const drift = [];
    for (const c of rows) {
      const k = keyOf(c);
      const got = hashFor(c);
      if (manifest[k] !== got) drift.push(k);
    }
    expect(drift).toEqual([]);
  }, 180_000); // its own budget, carrying the measured figure (2026-11-22, GOLDEN-LIT, against a scratch manifest): 52.6 s here, the dark master's 61.7 s shard figure its peer; the dark master's 180 s budget
});
