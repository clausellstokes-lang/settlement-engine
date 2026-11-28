/**
 * storedHookShown.test.js — SURVEY S-A, print site 2 (the chair's ruling S-A-1): a hook drawn at birth and stored is
 * re-answered on the FINAL record where the collector prints it (the Plot Hooks tab, the PDF, the Tonight sheet, the
 * session sheet); no birth moves. Named towns of `docs/chair/2026-11-27/eleventh/survey/final/MEASURE.md` (B):
 *   C:dp-hamlet-26  "Someone is sabotaging both guilds…" (needs `guild`), drawn while the Merchant Guilds power stood;
 *                   the close renamed it, and the Overview prints "a market, no guild";
 *   V:dp-town-107   a loyalty hook that needs `population: ≥ middling`, drawn before the population settled below it.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import TOWNS from '../../fixtures/surveyFinalTowns.json';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../../src/domain/density/densityCreateBoundary.js';
import { withPublicProse } from '../../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../../src/components/new/publicProseCompose.js';
import { collectPlotHooks } from '../../../src/domain/dossier/plotHooks.js';
import { buildViewModel } from '../../../src/pdf/lib/viewModel.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { plotHookText } from '../../../src/lib/proseSeams.js';

/** @param {string} plan @param {string} seed */
const bornTown = (plan, seed) => {
  const row = TOWNS.find((t) => t.plan === plan && t.seed === seed);
  const town = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
  return withPublicProse(town, composePublicProse(town));
};
const GUILD_HOOK = 'Someone is sabotaging both guilds to destabilize the market for a third party';
const LOYALTY_HOOK = /^Three guards have gone missing in the same district on night patrol/;
const texts = (hooks) => hooks.map((h) => h.text);

describe('S-A site 2: a stored hook re-answered on the final record', () => {
  /** @type {any} */ let hamlet; /** @type {any} */ let town; /** @type {string} */ let before = '';
  beforeAll(async () => {
    await loadGenerationLawPayloads();
    hamlet = bornTown('C', 'dp-hamlet-26');
    town = bornTown('V', 'dp-town-107');
    before = JSON.stringify([hamlet, town]);
  }, 120000);

  it('NOT VACUOUS: each named town stores the hook the final record refuses', () => {
    expect(factsOf(hamlet).guild).toBe(false);
    expect(hamlet.history.historicalEvents.flatMap((e) => (e.plotHooks || []).map(plotHookText))).toContain(GUILD_HOOK);
    expect(town.npcs.flatMap((n) => (n.plotHooks || []).map(plotHookText)).some((t) => LOYALTY_HOOK.test(t))).toBe(true);
  });

  it('THE OWNER\'s Plot Hooks: the guild hook is gone (every hook of its pool needs a guild), the loyalty hook takes the next admitted line', () => {
    expect(texts(collectPlotHooks(hamlet))).not.toContain(GUILD_HOOK);
    const shown = texts(collectPlotHooks(town));
    expect(shown.some((t) => LOYALTY_HOOK.test(t))).toBe(false);
    const stored = town.npcs.flatMap((n) => (n.plotHooks || []).map(plotHookText));
    expect(shown.filter((t) => !stored.includes(t)).length).toBeGreaterThan(0); // the next admitted line stands in its place
  });

  it('THE PDF reads the same collector: the refused hooks print in its hooks chapter neither', () => {
    expect(JSON.stringify(buildViewModel({ settlement: hamlet }).hooks)).not.toContain(GUILD_HOOK);
    expect(JSON.stringify(buildViewModel({ settlement: town }).hooks)).not.toMatch(LOYALTY_HOOK);
  });

  it('THE SHARED PAGE (the collector\'s reader option) prints every stored hook as stored', () => {
    expect(texts(collectPlotHooks(hamlet, { reader: true }))).toContain(GUILD_HOOK);
  });

  it('every other hook prints as before: only the refused ones move', () => {
    const owner = texts(collectPlotHooks(hamlet));
    const asStored = texts(collectPlotHooks(hamlet, { reader: true }));
    expect(asStored.filter((t) => t !== GUILD_HOOK)).toEqual(owner);
  });

  it('NO BIRTH MOVES: the records are untouched by the print', () => {
    expect(JSON.stringify([hamlet, town])).toBe(before);
  });
});
