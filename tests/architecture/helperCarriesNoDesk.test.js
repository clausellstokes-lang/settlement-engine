/**
 * tests/architecture/helperCarriesNoDesk.test.js — A HELPER MUST NOT CARRY A DESK (RULING 122-B-2, F7, UNIT 3; the eleventh
 * chair, 2026-11-28).
 *
 * THE CLASS. `display/tensionDescriptionShown.js` (R6) imported `criticalImportRow` from the economy desk
 * (`stateProse/economyStateProse.js`), and with it the desk's corpus (`data/dossierStateProse/economy.generated.js`) rode
 * into the PDF render worker and Foundry's export (the independent reader's esbuild proxy: +124,696 B and +124,210 B
 * minified, thirteen modules anew). The reader now comes from a leaf (`display/criticalImportRow.js`) that imports no desk
 * and no corpus; the desk imports it back and keeps exporting the name.
 *
 * THIS GUARD walks the helper's STATIC imports with the one source walker (`tests/helpers/routeClosure.js ::
 * importClosure`, FOLLOW_STATIC) and reds, naming the chain, if it ever reaches a state-prose corpus
 * (`src/data/dossierStateProse/`), a desk (`src/domain/display/stateProse/*StateProse.js`), the traditions' description
 * table (`src/data/traditionDescriptionTable.js`) or the gallery veil (`src/domain/display/galleryVeil.js`).
 *
 * NOT GUARDED HERE: `traditions/traditionFloor.js`. Its `withoutFunction` names the fields it strips by reading the veil's
 * own declaration (`galleryVeil.js :: CARD_KINDS.institution.fields.function`), so it cannot move to a leaf without a copy
 * of a veil declaration, which waits on the chair's word (RULING 122-B-2 UNIT 3 (b): stopped).
 */
import { describe, expect, it } from 'vitest';
import { join, relative, resolve } from 'node:path';
import { FOLLOW_STATIC, chainTo, importClosure } from '../helpers/routeClosure.js';

const ROOT = resolve(__dirname, '../..');

/** @param {string} rel @returns {boolean} a module a helper must not carry */
const isDesk = (rel) => rel.startsWith('src/data/dossierStateProse/')
  || /^src\/domain\/display\/stateProse\/[^/]*StateProse\.js$/.test(rel)
  || rel === 'src/data/traditionDescriptionTable.js'
  || rel === 'src/domain/display/galleryVeil.js';

describe('a helper carries no desk (RULING 122-B-2, F7)', () => {
  for (const helper of ['src/domain/display/tensionDescriptionShown.js']) {
    it(`${helper} reaches no corpus, desk, description table or veil through its static imports`, () => {
      const entry = join(ROOT, helper);
      const { seen, parent } = importClosure([entry], FOLLOW_STATIC);
      const reached = [...seen].map((f) => relative(ROOT, f).replace(/\\/g, '/'));
      expect(reached.length, 'the walk reads the helper\'s imports (not vacuous)').toBeGreaterThan(1);
      expect([...seen].filter((f) => isDesk(relative(ROOT, f).replace(/\\/g, '/'))).map((f) => chainTo(parent, f, ROOT))).toEqual([]);
    });
  }
});
