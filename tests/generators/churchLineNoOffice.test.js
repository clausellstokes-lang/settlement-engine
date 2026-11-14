/**
 * tests/generators/churchLineNoOffice.test.js — R2-CODE-A item 5 (the cold list REVIEW-W2A-3, HIGH
 * #36): "The church wants approval rights over who may trade and when. The village reeve disagrees."
 * printed in a thorp with no church of its own ("Access to parish church") and no reeve. It is the
 * twin of the baseline conflict's church line (`data/powerSiblings.js :: BASELINE_CONFLICT_SIBLINGS`),
 * read at a site whose facts are the roster's names alone; the chair's ruling P3: a twin names no
 * office or house those facts cannot verify. The same for the militia line's twin (its reeve).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { BASELINE_CONFLICT_SIBLINGS } from '../../src/data/powerSiblings.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

/** The offices and houses the baseline-conflict site cannot verify from the roster's names. */
const UNVERIFIED = /\b(?:church|reeve|village)\b/i;

describe('the baseline conflicts\' twins name no office the site cannot verify', () => {
  it('every twin of the table is free of church, reeve and village', () => {
    const twins = Object.values(BASELINE_CONFLICT_SIBLINGS).flat().filter((l) => typeof l.twinOf === 'string').map((l) => l.text);
    expect(twins.filter((t) => UNVERIFIED.test(t))).toEqual([]);
  });
});

describe('the cold list\'s thorp, born as the app births it', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  it('rw3-thorp-calm-2 (#36): no church and no reeve in its conflict; the devout households in their place', () => {
    const s = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'thorp', selectedStressesRandom: false, selectedStresses: [], _randomizePriorities: true }), null, { seed: 'rw3-thorp-calm-2', customContent: {} }));
    const all = JSON.stringify(s);
    expect(all).not.toMatch(/The church wants approval rights/);
    expect(all).toMatch(/The most devout households want a say over who may trade and when, and not everyone here agrees\./);
  });
});
