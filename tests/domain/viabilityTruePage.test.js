/**
 * viabilityTruePage.test.js — VIABILITY-TRUE (the tenth chair's G53, G56 (4), G61): EVERY LINE OF THE OUTLOOK'S VIABILITY SLOT
 * AND BOTH FALLBACKS HOLDS TO ITS CLAIM AGAINST WHAT THE SAME PAGE PRINTS.
 * THE ORACLE (the page's own leaves, read here, not the cure's gates): the Food Security row's pounds brought in
 * (`foodRowShown.js`, with the tab's carrier test), the Economics tab's printed arriving list (`tradeListsAsPrinted`) and its
 * "Needed, and not brought in" list (`needed`), a food source's own good on that list (`commoditiesShown.js ::
 * isFoodSourceGood`), and the debt line (the `indebted` stress's own sentence, "owes an outside power more than it can ever
 * repay"). RED FIRST at the line 9d22f040e: the named places each printed a line its own page denied.
 * Also G56 (1): the engine's OLDER safety sentence ("which faction controls a district", written until 2026-11-09) is trimmed
 * as the current one is (`guardLineUnderTheLaw.js :: safetyLineSaidOnce`).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveViability } from '../../src/domain/display/dossierViewModel.js';
import { tradeListsAsPrinted } from '../../src/domain/display/tradeListDisplay.js';
import { foodRowShown } from '../../src/domain/display/foodRowShown.js';
import { carriersOf } from '../../src/domain/display/foodCarrier.js';
import { isFoodSourceGood } from '../../src/domain/display/commoditiesShown.js';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { economyDeskRead } from '../../src/components/new/economyDeskRead.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { safetyLineSaidOnce } from '../../src/domain/display/guardLineUnderTheLaw.js';
import { owesDebtShown, nothingLaidByShown } from '../../src/domain/display/solvencyShown.js';
import { economicSurvivalBandOf } from '../../src/domain/display/defenseScoreBands.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { variantByVid } from '../helpers/drawnProse.js';
import { birth as soakBirth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

/** C's birth (`birthConfig({ settType })`, the close's make-plan.mjs) @param {string} seed */
const c = (seed) => generateSettlementPipeline(birthConfig({ settType: seed.split('-')[1] }), null, { seed, customContent: {} });

/** What the page prints, by its own leaves. @param {any} s */
function page(s) {
  const lists = tradeListsAsPrinted(s);
  const pounds = Number(foodRowShown(s, !!carriersOf(s, s?.economicState))?.fb?.importCoverage) || 0;
  const arriving = lists.imports.map(String);
  return {
    food: pounds > 0 || arriving.some(isFoodSourceGood), any: pounds > 0 || arriving.length > 0, needed: lists.needed.length > 0,
    debt: JSON.stringify(s?.stress || []).includes('more than it can ever repay'),
  };
}
/** The lines and what makes each false on its page. */
const LINES = /** @type {Array<[string, RegExp, (p: ReturnType<typeof page>) => boolean]>} */ ([
  ['L1 feeds itself, pays its own way', /feeds itself and pays its own way\./, (p) => p.food || p.debt],
  ['L2 grows and makes what it needs, owes no one', /grows what it eats and makes what it needs, and owes no one/, (p) => p.food || p.needed || p.debt],
  ['L3 nothing needed comes from outside', /^VIABLE: Nothing .* needs to get through the year has to come from outside\./, (p) => p.food || p.needed],
  ['L4 feeds itself and buys in part', /feeds itself and pays its way, and buys in some of what it cannot make/, (p) => p.food || p.debt || !p.any],
  ['L5 some of what it uses is bought in', /it grows, and what it spends it earns; some of what it uses is bought in/, (p) => p.food || p.debt || !p.any],
  ['twin A buying in', /gets through the year, buying in (some of )?what its own land and trades do not provide/, (p) => !p.any],
  ['twin A universal', /gets through the year, buying in what its own land and trades do not provide/, (p) => p.needed],
  ['twin B goes without', /on its own land and trades, and goes without/, (p) => p.any],
  ['strained: keeps order and pays its way', /keeps order and pays its way, but it has to buy food/, (p) => p.debt],
]);
/** @param {any} s @returns {string[]} the lines false on the page, by name */
function falseLines(s) {
  const t = String(deriveViability(s).summary); const p = page(s);
  /** @type {string[]} */ const out = LINES.filter(([, re, bad]) => re.test(t) && bad(p)).map(([n]) => n);
  // DS-GEN-18 BOUGHT-IN v2, computed from its pool (never a literal anchor): "buys in some of what it cannot make" holds only
  // where something arrives (its unmet-need fault is cured by its words, G61 (2))
  const name = String(s?.name ?? '');
  const bought = variantByVid({ leaf: 'general', blockId: 'DS-GEN-18', poolKey: 'BOUGHT-IN', vid: 2, slots: { settlement: name } });
  if (name && JSON.stringify(generalDeskLines(s)).includes(bought) && !p.any) out.push('general: buys in, nothing arrives');
  return out;
}

beforeAll(async () => { await loadGenerationLawPayloads(); await ensureLaws(); }, 120000);

describe('VIABILITY-TRUE: the named places print no line their own page denies', () => {
  /** each named place, the line it printed at the line 9d22f040e, and why the page denied it */
  const NAMED = /** @type {Array<[string, () => any, string]>} */ ([
    ['C dp-thorp-0 (L4 beside the debt line)', () => c('dp-thorp-0'), 'L4'],
    ['C dp-village-89 (L1 beside food arriving)', () => c('dp-village-89'), 'L1'],
    ['C dp-thorp-81 (twin A beside "Needed, and not brought in")', () => c('dp-thorp-81'), 'twin A'],
    ['C dp-hamlet-105 (the general line beside an unmet need)', () => c('dp-hamlet-105'), 'general'],
    ['soak1k-276 (L2 "owes no one" beside the debt line)', () => soakBirth(276).settlement, 'L2'],
  ]);
  for (const [name, born, line] of NAMED) {
    test(name, () => {
      const s = born();
      expect(String(deriveViability(s).summary)).toMatch(/VIABLE/); // the place is read, its verdict printed
      expect(falseLines(s)).toEqual([]);
      expect(line.length).toBeGreaterThan(1);
    }, 120000);
  }
});

describe('VIABILITY-TRUE: every birth of C\'s thorps and hamlets (300): no line false on its page', () => {
  test('false lines 0', () => {
    /** @type {string[]} */ const bad = [];
    let printed = 0;
    for (const size of ['thorp', 'hamlet']) for (let i = 0; i < 150; i++) {
      const s = c(`dp-${size}-${i}`);
      if (deriveViability(s).summary) printed++;
      for (const l of falseLines(s)) bad.push(`dp-${size}-${i}: ${l}`);
    }
    expect(printed).toBe(300);
    expect(bad).toEqual([]);
  }, 900000);
});

describe('G56 (1): the engine\'s older safety sentence is trimmed as the current one is', () => {
  const record = { powerStructure: { stability: 'No stable governing authority' } };
  test('the older wording (written until 2026-11-09) drops its opening clause', () => {
    const old = 'No stable governing authority. Enforcement is inconsistent; which faction controls a district determines what rules apply.';
    expect(safetyLineSaidOnce(old, record)).toBe('Enforcement is inconsistent; which faction controls a district determines what rules apply.');
  });
  test('control: the current wording is trimmed as before, and an owner\'s own line is not', () => {
    expect(safetyLineSaidOnce('No stable governing authority. Enforcement is inconsistent; which power controls a district determines what rules apply.', record))
      .toBe('Enforcement is inconsistent; which power controls a district determines what rules apply.');
    const own = 'No stable governing authority; the three farms each keep their own peace.';
    expect(safetyLineSaidOnce(own, record)).toBe(own);
  });
});

/*
 * G72 (6) (CURE-119): FOOD THAT ARRIVES UNDER OTHER NAMES. `commoditiesShown.js :: isFoodSourceGood` also answers yes to the
 * whole words `provisions` and `game`. The oracle here is the page's printed arriving list read by NAME ("Preserved
 * provisions"), not the leaf under test. RED FIRST (ef10a71f3a + cures 1, 2, 4, 5): both towns failed: r7x-town-68
 * "Flachsteig feeds itself and pays its own way." (L1), C dp-town-101 "What Breitenfeld eats it grows, and what it spends it
 * earns; some of what it uses is bought in." (L5); and the word list ([false, false, false, true]).
 */
describe('G72 (6): no feeds-itself line beside an arriving "Preserved provisions"', () => {
  /** The second reader's dials (its `r7x` corpus). */
  const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
  /** The lines that say the place feeds itself (the reader's L1, L2, L4, L5). */
  const FEEDS_ITSELF = /feeds itself|eats it grows|grows what it eats/;
  test('r7x-town-68 and C dp-town-101 print a viability line, and not one that says the place feeds itself', () => {
    const towns = [
      generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: 'town' }), null, { seed: 'r7x-town-68', customContent: {} }),
      c('dp-town-101'),
    ];
    for (const s of towns) {
      expect(tradeListsAsPrinted(s).imports.map(String), 'the premise: Preserved provisions arrive').toContain('Preserved provisions');
      const summary = String(deriveViability(s).summary);
      expect(summary, 'the slot prints a viability line').toMatch(/^VIABLE: /);
      expect(FEEDS_ITSELF.test(summary), `${s.name}: ${summary}`).toBe(false);
    }
  }, 120_000);
  test('provisions and game are food by the whole word; provisioning, gaming, salt and hides are not', () => {
    expect(['Preserved provisions', 'Game and hides (furs, leather)', 'Provisions', 'game meat', 'Gaming tables', 'Salt', 'Hides', 'Ship provisioning'].map(isFoodSourceGood))
      .toEqual([true, true, true, true, false, false, false, false]);
  });
});

// RULING-R (the eleventh chair, 2026-11-27), R5 / R10 / R12 (unit B2): a line that says the place HAS SAVINGS (DS-ECO-8
// COMFORTABLE v1 "money laid by", v2 "put things by"; MODERATE v3 "a little in hand") stands down where the record holds a
// present place debt (the indebted stress, the outside_debt tension or the timeline's outside_debt event) or an Economic
// Survival row of Weak or Critical (DS-DEF-2's "nothing laid by" / "would have to borrow"); a line that says it PAYS ITS WAY
// or OWES NO ONE (DS-ECO-1 C3 v2; the Outlook's L1, L2, L4, L5) stands down on the debt alone (beside the Weak grade alone it
// is ruled no fault). The forbidden words are computed from the pools (never a literal anchor). The named places are the
// measure's own (rmeasure/R-REPORT.md, R5): each printed the savings or pays-its-way line beside the other side at 42883b5c4.
describe('RULING-R B2: no savings or pays-its-way line beside a present place debt or nothing laid by', () => {
  /** @param {string} blockId @param {string} poolKey @param {number} vid @param {any} s */
  const words = (blockId, poolKey, vid, s) => variantByVid({ leaf: 'economy', blockId, poolKey, vid, slots: { settlement: String(s.name) } }).split('. ')[0];
  /** @param {any} s @returns {string} every economy desk line the owner's page draws, and the Outlook's verdict */
  const printed = (s) => `${JSON.stringify(economyDeskRead(s))} ${deriveViability(s, { audience: 'dm' }).summary}`; // the owner's page (RULING 122-B-4: the hook leg by name)
  const NAMED = /** @type {Array<[string, string, Array<[string, string, number]>]>} */ ([
    // [seed, the other side the record holds, the lines it printed beside it]
    ['dp-thorp-3', 'Economic Survival Weak', [['DS-ECO-8', 'COMFORTABLE', 1]]],
    ['dp-thorp-42', 'the timeline\'s outside_debt event; Economic Survival Weak', [['DS-ECO-8', 'COMFORTABLE', 2], ['DS-ECO-1', 'COMBINATION C3: the middle rungs', 2]]],
    ['dp-thorp-99', 'the outside_debt tension', [['DS-ECO-1', 'COMBINATION C3: the middle rungs', 2]]],
    ['dp-village-141', 'the outside_debt tension', [['DS-ECO-8', 'COMFORTABLE', 1]]],
    // RULING 122-B-2 (F6, UNIT 2 (c)): the MODERATE row and the CRITICAL band, each held by a town its removal moves (the
    // measure at this tip: without the MODERATE row these print v3, "pays its own way and has a little in hand"; with
    // CRITICAL not counted as nothing laid by, dp-thorp-107 prints COMFORTABLE v2, "put things by")
    ['dp-hamlet-14', 'Economic Survival Weak (the MODERATE row)', [['DS-ECO-8', 'MODERATE', 3]]],
    ['dp-village-45', 'a place debt in force (the MODERATE row)', [['DS-ECO-8', 'MODERATE', 3]]],
    ['dp-thorp-107', 'Economic Survival Critical', [['DS-ECO-8', 'COMFORTABLE', 1], ['DS-ECO-8', 'COMFORTABLE', 2]]],
  ]);
  for (const [seed, side, lines] of NAMED) {
    test(`C ${seed} (${side}): the savings and pays-its-way lines stand down, and the rung still speaks`, () => {
      const s = c(seed);
      const page = printed(s);
      expect(lines.map(([b, k, v]) => [b, v, page.includes(words(b, k, v, s))])).toEqual(lines.map(([b, , v]) => [b, v, false]));
      expect(economyDeskRead(s).prosperityRung).toBeTruthy(); // another line of the rung prints in its place
    }, 120000);
  }
  test('C dp-thorp-107: its Economic Survival row reads Critical, and that is "nothing laid by"', () => {
    const s = c('dp-thorp-107');
    expect([economicSurvivalBandOf(s), owesDebtShown(s), nothingLaidByShown(s)]).toEqual(['CRITICAL', false, true]);
  }, 120000);
  test('C dp-thorp-42 (the outside_debt event alone): the Outlook says no "pays its way"', () => {
    const s = c('dp-thorp-42');
    expect((s.history.historicalEvents || []).map((/** @type {any} */ e) => e.templateType)).toContain('outside_debt');
    expect(String(deriveViability(s, { audience: 'dm' }).summary)).toMatch(/^VIABLE/); // the owner's Outlook (RULING 122-B-4)
    expect(/pays its (own )?way|owes no one|what it spends it earns/.test(String(deriveViability(s, { audience: 'dm' }).summary))).toBe(false);
  }, 120000);
  // RULING 122-B-1 (i), the chair, 2026-11-27: the timeline's outside_debt event is the place owing only where its page says
  // the creditor is collecting NOW, its hook printed on the Plot Hooks tab (`collectPlotHooks`). An old Debt Crisis whose
  // event carries no hook prints only its past in the History timeline: there "pays its way" still prints.
  test('C dp-thorp-4 and dp-town-120 (an old Debt Crisis, no hook printed): "pays its way" still prints', () => {
    const thorp = c('dp-thorp-4');
    const ev = (thorp.history.historicalEvents || []).filter((/** @type {any} */ e) => e.templateType === 'outside_debt');
    expect(ev.map((/** @type {any} */ e) => [e.yearsAgo, (e.plotHooks || []).length])).toEqual([[83, 0]]);
    expect(String(deriveViability(thorp).summary)).toMatch(/feeds itself and pays its own way\./);
    const town = c('dp-town-120');
    expect(printed(town).includes(words('DS-ECO-1', 'COMBINATION C3: the middle rungs', 2, town))).toBe(true);
  }, 120000);
  test('DS-POW-6 "operation role unlicensed revenue" v2 no longer says the town owes (re-worded in place, its vid kept)', () => {
    const pool = /** @type {any} */ (DOSSIER_STATE_PROSE_POWER)['DS-POW-6'].pools['operation role unlicensed revenue'];
    expect(pool.map((/** @type {any} */ v) => v.vid)).toEqual([1, 2, 3]);
    const v2 = String(pool.find((/** @type {any} */ v) => v.vid === 2).text);
    expect([/^The town's debts/.test(v2), /^Debts run up in one house here/.test(v2)]).toEqual([false, true]);
  });
});

// RULING 122-B-2 (the eleventh chair, 2026-11-28; the independent reader's F2): BESIDE A PLACE DEBT IN FORCE
// (`owesDebtShown`) NO LINE CLAIMS MONEY IN HAND, A YEARLY SURPLUS, OR FREEDOM FROM DEBT. A yearly surplus is the same claim
// as "pays its way": on `owes`, DS-ECO-1 C3 refuses v1 AND v2, DS-ECO-8 MODERATE refuses v1 as well as v3. MODERATE v1 beside
// "nothing laid by" alone is ruled no fault (RULING-R R5's soft pair), and a place with neither fact prints what it printed.
// The vid a rung prints is read off the pool's own templates (never a literal anchor). RED FIRST at 003fd3b07: C dp-thorp-0
// printed C3 v1 and MODERATE v1, dp-thorp-29 MODERATE v1, dp-metropolis-138 and dp-town-83 C3 v1, each beside a place debt.
describe('RULING 122-B-2: no yearly-surplus line beside a place debt in force', () => {
  const C3 = 'COMBINATION C3: the middle rungs';
  /** @param {string} blockId @param {string} poolKey @param {any} rung @returns {number|null} the vid the rung prints */
  const vidOf = (blockId, poolKey, rung) => {
    if (!rung?.sentence || rung.provenance?.poolKey !== poolKey) return null;
    const esc = (/** @type {string} */ t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\{\w+\\\}/g, '.*?');
    const hits = (/** @type {any} */ (DOSSIER_STATE_PROSE_ECONOMY)[blockId].pools[poolKey])
      .filter((/** @type {any} */ v) => new RegExp(`^${esc(String(v.text))}$`).test(rung.sentence));
    return hits.length === 1 ? hits[0].vid : -1;
  };
  /** @param {any} s */
  const slots = (s) => {
    const d = economyDeskRead(s);
    return { header: [d.prosperityHeader?.provenance?.poolKey ?? null, vidOf('DS-ECO-1', C3, d.prosperityHeader)],
      rung: [d.prosperityRung?.provenance?.poolKey ?? null, vidOf('DS-ECO-8', 'MODERATE', d.prosperityRung)] };
  };
  // [seed, the slot's pool at the tip, the slot]: each printed a refused vid beside a place debt at 003fd3b07
  const OWES = /** @type {Array<[string, 'header'|'rung']>} */ ([
    ['dp-thorp-0', 'header'], ['dp-thorp-0', 'rung'], ['dp-thorp-29', 'rung'], ['dp-metropolis-138', 'header'], ['dp-town-83', 'header'],
  ]);
  test('C dp-thorp-0, dp-thorp-29, dp-metropolis-138, dp-town-83 (a place debt in force): no C3 v1/v2 header, no MODERATE v1/v3 tile', () => {
    /** @type {Array<[string, string, boolean, boolean]>} */ const got = [];
    for (const [seed, slot] of OWES) {
      const s = c(seed);
      const [pool, vid] = slots(s)[slot];
      const refused = slot === 'header' ? [1, 2] : [1, 3];
      // the premise: the place owes, and the slot keys the pool (or stands empty: a refusal may leave no line, UNIT 1's count)
      got.push([seed, slot, owesDebtShown(s) && [slot === 'header' ? C3 : 'MODERATE', null].includes(pool), refused.includes(Number(vid))]);
    }
    expect(got).toEqual(OWES.map(([seed, slot]) => [seed, slot, true, false]));
  }, 300000);
  test('the edge: C dp-thorp-19 (nothing laid by alone) still prints MODERATE v1', () => {
    const s = c('dp-thorp-19');
    expect([owesDebtShown(s), nothingLaidByShown(s), slots(s).rung]).toEqual([false, true, ['MODERATE', 1]]);
  }, 120000);
  test('a place with neither fact: C dp-village-19 prints C3 v1 and MODERATE v1, as it printed', () => {
    const s = c('dp-village-19');
    expect([owesDebtShown(s), nothingLaidByShown(s), slots(s)]).toEqual([false, false, { header: [C3, 1], rung: ['MODERATE', 1] }]);
  }, 120000);
});

// RULING 122-B-4 (the eleventh chair, 2026-11-28; the survey's independent reader): THE HOOK LEG IS THE OWNER's EYE ONLY.
// `owesDebtShown` reads a past Debt Crisis as owing where its HOOK prints; a plot hook never travels on a player share, so
// what is composed FOR A READER (the shared page's stamp, `composePublicProse`; the player view) answers `owes` from the
// stress and the tension alone, while the owner's own tabs keep all three legs. On a town that owes by the hook alone the
// stamp is byte-equal with the Debt Crisis hook on the record and taken off (the plant); the owner's desk still moves.
// RED FIRST at 3f3e17099: the stamp of both towns moved with the hook.
describe('RULING 122-B-4: the shared page does not learn the hook', () => {
  /** @param {any} s the record with every hook of its outside_debt events taken off (the plant) */
  const unhooked = (s) => {
    const t = structuredClone(s);
    for (const e of t.history?.historicalEvents || []) if (e?.templateType === 'outside_debt') e.plotHooks = [];
    return t;
  };
  /** @param {any} s @returns {string} the stamp's economy desk and Outlook verdict sites */
  const stamped = (s) => {
    const blocks = /** @type {Record<string, unknown>} */ (composePublicProse(s)?.blocks || {});
    return JSON.stringify(Object.entries(blocks).filter(([k]) => k.startsWith('economy:') || k === 'viewModel:viability'));
  };
  // THE HOOK LEG FAILS CLOSED (the chair's last step on 122-B-4): it is asked for BY NAME, the owner's audience ('dm', the
  // desks' own token); a call that states no audience answers from the stress and the tension alone.
  test('C dp-thorp-8: the debt reader with no audience does not read the hook; the owner\'s audience does', () => {
    const s = c('dp-thorp-8');
    expect([owesDebtShown(s), owesDebtShown(s, { audience: 'player' }), owesDebtShown(s, { audience: 'dm' })]).toEqual([false, false, true]);
  }, 120000);
  for (const seed of ['dp-thorp-8', 'dp-town-48']) {
    test(`C ${seed} (owes by the hook alone): the stamp is byte-equal with the hook on and off; the owner's desk is not`, () => {
      const s = c(seed);
      const off = unhooked(s);
      expect([owesDebtShown(s, { audience: 'dm' }), owesDebtShown(off, { audience: 'dm' })], 'the premise: the hook alone makes the place owe').toEqual([true, false]);
      expect(stamped(s)).toBe(stamped(off));
      expect(JSON.stringify(economyDeskRead(s)) === JSON.stringify(economyDeskRead(off)), 'the owner\'s eye keeps the leg').toBe(false);
    }, 120000);
  }
});
