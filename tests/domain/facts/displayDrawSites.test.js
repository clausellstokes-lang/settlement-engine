/**
 * tests/domain/facts/displayDrawSites.test.js — CENSUS-1d unit 2: the DISPLAY draw sites of
 * `docs/DESIGN_POOL_CENSUS.md` Appendix B (rows 89–111) draw through `drawDeclared`.
 *
 * Each arm opens a presumption ledger around one site and holds that the site's draw is noted
 * under its pool's name with its draw kind. Before the wiring these sites made no ledger entry
 * (the render ledger counted 0 PDF and 0 Tonight draws, CENSUS-1c unit 4), so each arm is
 * red-first at the commit before its site's. The site's TEXT is held byte-identical by the
 * lane's hasher (525 golden records, soak1k-0..59 records and every rendered surface), recorded
 * in each commit.
 *
 * @enforced-by npx vitest run tests/domain/facts/displayDrawSites.test.js
 */
import { describe, expect, it } from 'vitest';
import { withPresumptionLedger } from '../../../src/domain/facts/presumptionLedger.js';
import { traditionHook, traditionBeatProse } from '../../../src/domain/traditions/prose.js';
import { createConflictHookDraw, foodGapHookLine } from '../../../src/domain/dossier/hookLines.js';
import { composeFoodwaysLine } from '../../../src/domain/foodways.js';
import { settlementRumors, whatPhrase } from '../../../src/domain/display/settlementRumors.js';
import { conjunctionContent } from '../../../src/domain/display/causeConjunctionContent.js';
import { causeLifecyclePhrase } from '../../../src/domain/display/causeLifecycleVocabulary.js';
import { deriveWarName, deriveRouteName } from '../../../src/domain/display/warAndRoadNames.js';
import { deriveMarketQuote, strongestDeviation } from '../../../src/domain/display/marketPrices.js';
import { crisisHooksOf } from '../../../src/domain/crisis/crisisHooks.js';

/** @param {() => unknown} fn */
const ledgerOf = (fn) => withPresumptionLedger(fn).ledger;

describe('Appendix B row 89 — the tradition prose pools (kind H)', () => {
  it('a hook and a beat note their draws, the text unchanged', () => {
    const rec = { id: 'tr-1', name: 'the Lantern Walk', lastOutcome: 'failure' };
    const out = withPresumptionLedger(() => traditionHook(rec, { town: 'Ashford' }));
    expect(out.result?.text).toBe(traditionHook(rec, { town: 'Ashford' })?.text);
    expect(out.ledger.map((e) => [e.pool, e.drawKind, e.surface])).toEqual([['TRAD_HOOKS.failure', 'H', 'plot_hooks']]);
    const beat = ledgerOf(() => traditionBeatProse({ outcome: 'cancelled', name: 'x', town: 'y', ownerBit: '', seed: 's' }));
    expect(beat.map((e) => e.pool)).toEqual(['TRAD_OUTCOME_PHRASE.cancelled', 'TRAD_CANCELLED_SUMMARY']);
  });
});

describe('Appendix B row 90 — the conflict-hook and food-gap pools (kind H)', () => {
  it('each draw is noted under its family; without replacement, as before', () => {
    const conflict = { parties: ['The Mill Guild', 'the Abbey'], issue: 'Control of the river tolls' };
    const plain = createConflictHookDraw();
    const expected = [plain(conflict)[0], plain(conflict)[0]];
    const draw = createConflictHookDraw();
    const out = withPresumptionLedger(() => [draw(conflict)[0], draw(conflict)[0]]);
    expect(out.result).toEqual(expected);
    expect(out.result[0]).not.toBe(out.result[1]);
    expect(out.ledger.map((e) => e.pool)).toEqual(['HOOK_LINE_POOLS.conflict.standing', 'HOOK_LINE_POOLS.conflict.standing']);
    const gap = withPresumptionLedger(() => foodGapHookLine({ name: 'Ashford', band: 'deficit' }));
    expect(gap.result).toBe(foodGapHookLine({ name: 'Ashford', band: 'deficit' }));
    expect(gap.ledger.map((e) => [e.pool, e.drawKind])).toEqual([['HOOK_LINE_POOLS.foodGap', 'H']]);
  });
});

describe('Appendix B row 111 — the foodways frames and source phrases (kind H)', () => {
  it('the frame and each slot are noted; the probe walk keeps the slots distinct, as before', () => {
    const input = { sources: ['grain', 'livestock', 'fish'], cultureLines: [], identity: 'Ashford|town' };
    const out = withPresumptionLedger(() => composeFoodwaysLine(input));
    expect(out.result).toBe(composeFoodwaysLine(input));
    expect(out.ledger.map((e) => e.pool)).toEqual([
      'FOODWAYS.FRAMES.more', 'FOODWAYS.SOURCE_PHRASES.grain', 'FOODWAYS.SOURCE_PHRASES.livestock', 'FOODWAYS.SOURCE_PHRASES.fish',
    ]);
  });
});

describe('Appendix B rows 97–100 — the rumour subject pools and headline frames (kind H)', () => {
  it('a seeded subject and a headline frame note their draws; seedless reads the canonical, undrawn', () => {
    const phrase = withPresumptionLedger(() => whatPhrase('flow_migration', 'evt-1'));
    expect(phrase.result).toBe(whatPhrase('flow_migration', 'evt-1'));
    expect(phrase.ledger.map((e) => [e.pool, e.drawKind, e.surface])).toEqual([['WHAT_PHRASE_POOLS.flow_migration', 'H', 'rumors']]);
    expect(ledgerOf(() => whatPhrase('flow_migration'))).toEqual([]);
    const world = { tick: 9, spatialLedgers: { rumorLedgers: { a: {
      'r-1': { eventRef: 'evt-1', arrivalTick: 4, hopCount: 0, completeness01: 1, content: { what: 'flow_migration', whereId: 'b' } },
    } } } };
    const told = withPresumptionLedger(() => settlementRumors({ worldState: world, settlementId: 'a' }));
    expect(told.result.map((r) => r.headline)).toEqual(settlementRumors({ worldState: world, settlementId: 'a' }).map((r) => r.headline));
    expect(told.ledger.map((e) => e.pool)).toEqual(['WHAT_PHRASE_POOLS.flow_migration', 'HEADLINE_FRAMES.firsthand']);
  });
});

describe('Appendix B rows 101–102 — the cause-conjunction ladder and its lifecycle floor (kind H)', () => {
  it('a ladder rung and the floor note their draws, the lines unchanged', () => {
    const key = { role: 'military', situation: 'compromised-covert', causeClass: 'debt', lifecycleStage: 'attributed' };
    const out = withPresumptionLedger(() => conjunctionContent(key, 'npc-7'));
    expect(out.result).toEqual(conjunctionContent(key, 'npc-7'));
    expect(out.ledger.length).toBe(1);
    expect(out.ledger[0].pool.startsWith(out.result.tier === 'floor' ? 'CAUSE_LIFECYCLE.' : `CAUSE_CONJUNCTION.${out.result.tier}.`)).toBe(true);
    const floor = withPresumptionLedger(() => causeLifecyclePhrase({ stage: 'reformed', causeClass: 'debt', role: 'civic' }));
    expect(floor.result).toBe(causeLifecyclePhrase({ stage: 'reformed', causeClass: 'debt', role: 'civic' }));
    expect(floor.ledger.map((e) => [e.pool, e.drawKind, e.surface])).toEqual([['CAUSE_LIFECYCLE.reformed', 'H', 'npcs']]);
  });
});

describe('Appendix B row 103 — the war and road name pools (kind H)', () => {
  it('a typed war, an untyped war and a road note their draws, the names unchanged', () => {
    const typed = withPresumptionLedger(() => deriveWarName({ attackerId: 'a', defenderId: 'b', reasonType: 'succession' }));
    expect(typed.result).toEqual(deriveWarName({ attackerId: 'a', defenderId: 'b', reasonType: 'succession' }));
    const untyped = withPresumptionLedger(() => deriveWarName({ attackerId: 'a', defenderId: 'b' }));
    expect(untyped.ledger.map((e) => [e.pool, e.surface])).toEqual([['UNTYPED_WAR_NAME_MOLDS', 'war']]);
    expect(typed.ledger.length).toBe(1);
    expect(typed.ledger[0].pool).toBe(typed.result.reasonType ? `WAR_NAME_POOLS.${typed.result.reasonType}` : 'UNTYPED_WAR_NAME_MOLDS');
    const row = { routeId: 'route.a.b.land', a: 'a', b: 'b', mode: 'land' };
    const road = withPresumptionLedger(() => deriveRouteName({ row, fromId: 'a' }));
    expect(road.result).toEqual(deriveRouteName({ row, fromId: 'a' }));
    expect(road.ledger.map((e) => e.pool)).toEqual(['ROUTE_NAME_POOLS.land.addressed']);
  });
});

describe('Appendix B row 110 — the market movement phrases and crier frames (kinds T and H)', () => {
  it('a quote resolves its movement; the crier line notes its frame, both unchanged', () => {
    const good = { id: 'grain', label: 'Grain' };
    const quote = withPresumptionLedger(() => deriveMarketQuote({ good, settlementId: 's', band: 'shortage', driftBand: 'shortage' }));
    expect(quote.result).toEqual(deriveMarketQuote({ good, settlementId: 's', band: 'shortage', driftBand: 'shortage' }));
    expect(quote.ledger.map((e) => [e.pool, e.drawKind])).toEqual([[`MOVEMENTS.${quote.result.movement}`, 'T']]);
    const cried = withPresumptionLedger(() => strongestDeviation([quote.result], 'shortage'));
    expect(cried.result).toEqual(strongestDeviation([quote.result], 'shortage'));
    expect(cried.ledger.map((e) => e.pool)).toEqual(['CRIER_FRAMES.dear']);
  });
});

describe('Appendix B row 94 — the crisis line-role clauses (kind T)', () => {
  it('the cast hook resolves its role clause through the one rule, the text unchanged', () => {
    const town = { tier: 'town', npcs: [{ id: 'n1', name: 'Mara Vell', role: 'Miller', factionAffiliation: 'Millers Guild' }] };
    const entry = { type: 'famine', cast: { nature: 'natural', rank: 1, absent: [], stakes: [], levers: [], links: [],
      ifNothingIsDone: { residualEffects: [] }, playersSeeFirst: [],
      roles: [{ role: 'brunt', kind: 'npc', id: 'n1', name: 'Mara Vell', reason: 'the hunger falls first on its people', temporary: false }] } };
    const out = withPresumptionLedger(() => crisisHooksOf(town, entry));
    expect(out.result).toEqual(crisisHooksOf(town, entry));
    expect(out.result[0].text).toContain('the brunt falls on Mara Vell');
    expect(out.ledger.map((e) => [e.pool, e.drawKind, e.surface])).toEqual([['LINE_ROLE_CLAUSE.brunt', 'T', 'crisis']]);
  });
});
