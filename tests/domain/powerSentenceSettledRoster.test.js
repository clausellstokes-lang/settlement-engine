/**
 * tests/domain/powerSentenceSettledRoster.test.js — BIRTH-1, unit D3 (the tenth chair's PRERELEASE-LIST D3; intake 2): THE POWER
 * STEP's SENTENCE IS NEVER THE BRANCH OF A ROSTER THE PLACE NO LONGER HAS.
 *
 * The power step writes `powerStructure.recentConflict` (governanceNarrative.js :: buildGovernanceLabels) over the roster it
 * holds; the coherence repair adds houses after it (a militia and a palisade for a threatened hamlet, a street gang); the
 * assembly's late replay re-ran the writer and kept only the stability. The cure: the late replay hands the SETTLED roster and
 * the sentence is re-written over it (economyReconciliation.js; power/governanceLabelRoster.js). The writer draws nothing.
 *
 * THE ORACLE IS THE WRITER's OWN OUTPUT over the settled record, taken another way than the cure takes it: the power step's
 * intent (its seed, config, neighbour, stress entries) captured at the step, and `generatePowerStructure` re-run whole over the
 * FINAL roster and the final economy, as the late replay's inputs stand.
 *
 *   (a) RED FIRST, BY NAME (measured at 0ec96f13d on the close's two corpora, `gen/birth-1/` on the chair's tenth): V's four
 *       stale births (C holds none): three famine hamlets stored "The last harvest failed badly…" though the repair gave them a
 *       Citizen militia (the writer over the settled roster says "Food is short…"), and a town stored the warehouse-robbing line
 *       though a Street gang stands. After: each stores the writer's sentence over its settled roster.
 *   (b) INERT ELSEWHERE: handed its own roster, the power step writes what it wrote without it (the stability, the powers, the
 *       sentence), on births of every size.
 * The check over EVERY birth of C and V (1,800) is the census `gen/birth-1/tools/measure-d3.mjs` (0 and 0 after; the hand-in).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { generatePowerStructure } from '../../src/generators/power/rulingStructure.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { clearActiveRng, setActiveRng } from '../../src/kernel/rngContext.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';

/** A V birth (the visitor's config), with the power step's intent captured. @param {string} seed */
function birthV(seed) {
  /** @type {any} */ let intent = null;
  const settType = seed.split('-')[1];
  const town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType, _randomizePriorities: true }), null, {
    seed, customContent: {},
    onStep: (/** @type {string} */ name, /** @type {any} */ ctx) => { if (name === 'generatePower') intent = JSON.parse(JSON.stringify(ctx.powerIntent)); },
  });
  return { town, intent };
}

/** The writer over a roster, as the late replay's inputs stand. @param {any} town @param {any} intent @param {any[]} institutions @param {Record<string, unknown>} [extra] */
function writeOver(town, intent, institutions, extra = {}) {
  const prev = setActiveRng(createPRNG(intent.rngSeed));
  try {
    const dp = town.defenseProfile || {};
    return generatePowerStructure(intent.tier, town.economicState, intent.neighbourRelationship, intent.config, institutions, {
      ...(dp.readiness?.label ? { defenseLabel: dp.readiness.label } : {}),
      ...(dp.economicGates?.military != null ? { militaryGate: dp.economicGates.military } : {}),
      forces: factsOf(town).defence,
      ...(Array.isArray(intent.stressEntries) ? { stressEntries: intent.stressEntries } : {}),
      ...extra,
    });
  } finally { clearActiveRng(prev); }
}
const names = (/** @type {any} */ town) => (town.institutions || []).map((/** @type {any} */ i) => i?.name);

const FAMINE_HAMLETS = ['dp-hamlet-2', 'dp-hamlet-100', 'dp-hamlet-117'];
const FAILED = 'The last harvest failed badly.';
const SHORT = 'Food is short, and every quarrel in the settlement has grown sharper for it.';

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('D3 (a): the stored sentence is the writer\'s over the settled roster', () => {
  for (const seed of [...FAMINE_HAMLETS, 'dp-town-15']) {
    it(`V ${seed}`, () => {
      const { town, intent } = birthV(seed);
      expect(intent, 'the power step ran').not.toBeNull();
      const overSettled = writeOver(town, intent, town.institutions).recentConflict;
      expect(typeof overSettled).toBe('string');
      expect(town.powerStructure.recentConflict).toBe(overSettled);
    }, 60000);
  }
  for (const seed of FAMINE_HAMLETS) {
    it(`V ${seed}: a famine hamlet the repair gave a militia says food is short, not that the harvest failed`, () => {
      const { town } = birthV(seed);
      expect(names(town)).toContain('Citizen militia');
      expect(town.powerStructure.recentConflict.startsWith(SHORT)).toBe(true);
      expect(town.powerStructure.recentConflict.startsWith(FAILED)).toBe(false);
    }, 60000);
  }
});

describe('D3 (b): handed its own roster, the power step writes what it wrote without it', () => {
  for (const seed of ['dp-thorp-3', 'dp-hamlet-2', 'dp-village-4', 'dp-town-15', 'dp-city-6', 'dp-metropolis-2']) {
    it(`V ${seed}`, () => {
      const { town, intent } = birthV(seed);
      const plain = writeOver(town, intent, intent.institutions);
      const handed = writeOver(town, intent, intent.institutions, { sentenceInstitutions: intent.institutions });
      expect(handed).toEqual(plain);
    }, 60000);
  }
});
