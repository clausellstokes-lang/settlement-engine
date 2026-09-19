/**
 * @vitest-environment jsdom
 *
 * economicsTabFlow.test.js — M6d FLOW-DERIVED ECONOMICS, the EconomicsTab thread.
 *
 * The tab reads the owning campaign's worldState from the store (the RumorsTab
 * store-selector pattern) and projects the arrivals tally through the marker-gated
 * selector. Proves:
 *   - DORMANT (no campaign / no tally) ⇒ the tab renders WITHOUT the "Live Trade
 *     Flow" section (byte-identical to today);
 *   - FLOW PRESENT (a campaign carrying a tradeFlow ledger) ⇒ the additive live-flow
 *     section renders BESIDE the generation baseline (which still renders).
 */
import React from 'react';
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { drawnMembers } from '../helpers/drawnProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { useStore } from '../../src/store/index.js';

/**
 * ⭐⭐ THE DESK OVERRIDE, AND WHY THE ARMS AT THE END OF THIS FILE NEED ONE.
 *
 * The stand-down `DeskLines` performs is INVISIBLE unless a position draws TWO lines whose
 * second OPENS on the settlement's name, and on this file's fixture only ONE of the five
 * economy positions does. Review 10 measured the consequence: the arm that drives all five
 * "renders its WOVEN paragraph" compared the DOM against `weaveBlock`'s own output, and for
 * four of them `weaveBlock` returns the lone line VERBATIM — so the comparison held with the
 * props and without them. A structural claim, asserted vacuously.
 *
 * ⛔ AND A BETTER FIXTURE CANNOT FIX IT, which is why the desk is overridden rather than the
 * settlement re-shaped. WHICH variant a pool draws is a function of the seed, so an arm built
 * from the corpus would prove nothing today and would start proving something on a seed
 * nobody chose. The rungs are HAND-BUILT instead — the `dossierMountRegistry` idiom
 * (`warFaithDeskFlow.test.js`) — and pushed through the REAL call sites by intercepting the
 * one function every one of these tabs reads its desk from.
 *
 * ⚠ IT IS A PASSTHROUGH UNTIL A TEST ASKS FOR IT. `current` is null for every other arm in
 * this file, so they run against the shipped desk exactly as before; and the public-dossier
 * gate is honoured even while overridden, so the §885.3 arms cannot be softened by it.
 */
const deskOverride = vi.hoisted(() => ({ current: null }));
vi.mock('../../src/components/new/economyDeskRead.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    economyDeskRead: (settlement, options = {}) => (
      deskOverride.current && !options.publicDossier
        ? deskOverride.current
        : actual.economyDeskRead(settlement, options)
    ),
  };
});

const e = React.createElement;

const ECO = {
  prosperity: 'modest', economicComplexity: 'a market town', tradeAccess: 'road',
  primaryImports: ['Wrought iron'], primaryExports: ['Timber'],
  tradeDependencies: [{ resource: 'iron', severity: 'critical' }],
  activeChains: [], incomeSources: [],
};
const SETTLEMENT = { id: 'forge_town', name: 'Forge Town', economicState: ECO };

const initialCampaigns = useStore.getState().campaigns;
afterEach(() => {
  cleanup();
  deskOverride.current = null;
  useStore.setState({ campaigns: initialCampaigns });
});

describe('EconomicsTab M6d thread', () => {
  test('DORMANT: no campaign in the store ⇒ no Live Trade Flow section (baseline only)', () => {
    useStore.setState({ campaigns: [] });
    const { container } = render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT, saveId: 'forge_town' }));
    expect(container.textContent).not.toContain('Live Trade Flow');
    // The generation baseline still renders (prosperity header).
    expect(container.textContent).toContain('modest');
  });

  test('FLOW PRESENT: a campaign carrying a tradeFlow tally ⇒ the additive live-flow section renders', () => {
    useStore.setState({
      campaigns: [{
        id: 'c1', settlementIds: ['forge_town'],
        worldState: { tick: 6, spatialLedgers: { tradeFlow: { forge_town: { in: 2, out: 1, lastTick: 6 } } } },
      }],
    });
    const { container } = render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT, saveId: 'forge_town' }));
    expect(container.textContent).toContain('Live Trade Flow');
    // The generation baseline is UNTOUCHED beside it.
    expect(container.textContent).toContain('modest');
  });

  test('a CHOKED trade-dependent town surfaces the shortage reading', () => {
    useStore.setState({
      campaigns: [{
        id: 'c1', settlementIds: ['forge_town'],
        worldState: { tick: 6, spatialLedgers: { tradeFlow: { forge_town: { in: 0.1, out: 0.05, lastTick: 6 } } } },
      }],
    });
    const { container } = render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT, saveId: 'forge_town' }));
    expect(container.textContent).toContain('Trade choked');
  });

  test('does not throw when saveId is absent (falls back to settlement.id, no store campaign)', () => {
    useStore.setState({ campaigns: [] });
    expect(() => render(e(EconomicsTab, { economicState: ECO, settlement: SETTLEMENT }))).not.toThrow();
  });
});

/**
 * ── THE PUBLIC GATE (O2GATE, §885.3) ────────────────────────────────────────────────
 * §885.2/§885.3 rule that the conservative PAID-SURFACE default is `publicDossier ⇒ no
 * state prose`. The economy desk did not implement it: `OutputContainer` computed
 * `publicDossier` and never handed it to the tab, so the anonymous gallery dossier
 * (`PublicDossierView` mounts `OutputContainer` readOnly with NO saveId) drew the corpus
 * sentences for free.
 *
 * TWO mounts carry a `sentence` rung, not one — `economics.prosperityHeader` (DS-ECO-1,
 * drawn in EconomicsGlance) and `economics.foodSecurity` (DS-ECO-9, drawn here) — so the
 * gate is placed at the single DRAW that feeds both, and both are asserted below.
 *
 * Each arm asserts BOTH DIRECTIONS on the SAME settlement, so it cannot pass vacuously:
 * a settlement that simply had nothing to say would fail the non-public half.
 */
const HERE = dirname(fileURLToPath(import.meta.url));
const ROUTER_SRC = join(HERE, '../../src/components/OutputContainer.jsx');

/**
 * A town whose state genuinely DRAWS both sentence mounts. `Comfortable` is on the
 * prosperity ladder (an OFF-ladder spelling ranks -1 and draws nothing, which is why the
 * M6d fixture above — `prosperity: 'modest'` — never caught the leak), and the food
 * balance carries a real DEFICIT so the Food Security section is `defaultOpen` and its
 * mount is actually in the DOM rather than behind a collapsed header.
 */
const SPEAKING = {
  // Both pins below are LIVENESS ANCHORS on a DRAWN member of a pool, and which member a pool
  // draws is a function of this `_seed` (`stateProseKernel.js` `drawVariant`) — which is why
  // car 8a-1's index-stable draw moved DS-ECO-9's member without moving one byte of the
  // corpus, the desk or the gate this file exists to prove, and why car 8a-12 had to search
  // this seed. Since car 8a-13 both anchors are COMPUTED from this seed through the shipped
  // read path (`tests/helpers/drawnProse.js`), so the seed is no longer load-bearing and the
  // next draw change moves the member and the anchor together. `id` and `saveId` stay
  // `forge_town` — only `_seed` reaches the draw.
  id: 'forge_town', name: 'Forge Town', _seed: 'forge_town-b', tier: 'town',
  economicState: {
    prosperity: 'Comfortable', economicComplexity: 'a market town', tradeAccess: 'road',
    situationDesc: 'The market square keeps its hours.',
    activeChains: [], incomeSources: [], institutionalServices: [],
    foodSecurity: { label: 'Deficit', stockpile: {} },
  },
  economicViability: {
    metrics: {
      foodBalance: {
        dailyProduction: 600, dailyNeed: 1000, deficit: 400, surplus: 0,
        importCoverage: 0, rawDeficit: 400, agricultureModifier: 1,
      },
    },
  },
};

/**
 * The DS-ECO-1 header sentence and the DS-ECO-9 food-security sentence this town draws,
 * computed through the shipped read path at this fixture's seed (car 8a-13).
 *
 * ⚠ THE BAG IS THE ECONOMY DESK'S ONE SHARED BAG, and only two of its seams have a fill on
 * this town: `{settlement}` and `{access}` (`ACCESS_NOUN.road`). `{complexity}` is UNFILLED
 * because `COMPLEXITY_NOUN` is keyed on the producer's eleven display strings and this
 * fixture's `'a market town'` is not one of them — which is the desk's own §0c-3 refusal, and
 * dropping the variants that name it is what makes this pool's draw what it is.
 */
const ECO_SLOTS = Object.freeze({ settlement: 'Forge Town', access: 'road' });
const { HEADER_SENTENCE, FOOD_SENTENCE } = drawnMembers({
  HEADER_SENTENCE: { blockId: 'DS-ECO-1', poolKey: 'COMBINATION C3: the middle rungs' },
  FOOD_SENTENCE: { blockId: 'DS-ECO-9', poolKey: 'DEFICIT' },
}, { leaf: 'economy', seed: SPEAKING._seed, slots: ECO_SLOTS });

describe('THE PUBLIC GATE — the economy desk stays silent on a public dossier', () => {
  test('a PUBLIC dossier draws ZERO state-prose sentences, and the SAME town drawn non-public draws BOTH', () => {
    useStore.setState({ campaigns: [] });
    // Direction 1 — the private dossier SPEAKS. Captured BEFORE cleanup: the container's
    // textContent empties when the tree unmounts, so reading it later would make the
    // liveness anchor below assert against an empty string.
    const priv = render(e(EconomicsTab, { settlement: SPEAKING, saveId: 'forge_town', publicDossier: false }));
    const privText = priv.container.textContent;
    cleanup();
    // Direction 2 — the SAME town on a public dossier says NOTHING from the corpus.
    const pub = render(e(EconomicsTab, { settlement: SPEAKING, saveId: null, publicDossier: true }));
    const pubText = pub.container.textContent;
    // Each sentence is proved PRESENT privately and ABSENT publicly in ONE anchored act. A
    // public render that silently produced nothing now reds on the liveness anchor instead
    // of passing a bare exclusion (tests/helpers/anchoredNegatives.js).
    expectPresentThenAbsent(privText, pubText, HEADER_SENTENCE, 'public dossier gate: the DS-ECO-1 header sentence');
    expectPresentThenAbsent(privText, pubText, FOOD_SENTENCE, 'public dossier gate: the DS-ECO-9 food-security sentence');
  });

  test('the gate removes ONLY the corpus sentences — the header prose and every datum tile survive', () => {
    useStore.setState({ campaigns: [] });
    const { container } = render(e(EconomicsTab, { settlement: SPEAKING, saveId: null, publicDossier: true }));
    // The generator's own header prose is a DATUM, not corpus state prose: it stays.
    expect(container.textContent).toContain('The market square keeps its hours.');
    // The glance tiles and their sub-lines are untouched.
    expect(container.textContent).toContain('Comfortable');
    expect(container.textContent).toContain('a market town');
    expect(container.textContent).toContain('Food');
    expect(container.textContent).toContain('lbs/day');
    // And the tab's OWN arithmetic readout below the balance bar is untouched.
    expect(container.textContent).toContain('Production deficit of');
  });

  /**
   * ODQ §934.15, the chair's second ruling — THE NARRATIVE UNDER THE BAR MUST NOT
   * STATE AN ARITHMETIC THAT DOES NOT CLOSE. Three states, three arms, and each
   * fixture is chosen so the numbers the tab prints can be recomputed from it.
   *
   * ⛔ NO NEW INTERPOLATED FIGURE REACHES THIS PROSE, and no frozen row moved to
   * build it: the prose-numerics law refuses a new numeral in reader prose, and
   * `tests/lint/.prose-numerics-baseline.json` pins EconomicsTab.jsx:542/544/545/546
   * by path + line + category + snippet. The magic clauses are number-free and land
   * past the 237-character truncation on 542 and 544, and the balanced branch wraps
   * the surplus template without touching its bytes, so the live census is 224 rows
   * at base and 224 at tip with 0 added and 0 removed — measured, not assumed.
   */
  const withFood = (foodBalance) => ({
    ...SPEAKING,
    economicViability: { metrics: { foodBalance } },
  });

  test('a gap the town does not close itself is never called a surplus', () => {
    useStore.setState({ campaigns: [] });
    // Production short of need, the whole gap carried by imports: deficit 0 AND
    // surplus 0. The tab used to fall through to the surplus template and print
    // "Agricultural surplus of 0% above daily needs." to a town that does not feed
    // itself — while the tile beside it already computed the word "Balanced".
    const { container } = render(e(EconomicsTab, {
      settlement: withFood({ dailyProduction: 800, dailyNeed: 1000, deficit: 0, surplus: 0, importCoverage: 200, rawDeficit: 200, agricultureModifier: 1 }),
      saveId: null, publicDossier: true,
    }));
    // ⚠ THE FOOD SECTION IS `defaultOpen={!!fb.deficit}` AND Primitives renders
    // `{open && children}`, so on a town that IS fed the narrative is behind a
    // closed fold — the same trap the DS-ECO-9 note at EconomicsTab.jsx:505 records
    // for the sentence above it. That is why this arm opens the fold: the defect
    // was real for every reader who did, and a test that never opened it would
    // have reported the false sentence as absent.
    // anchored: the SAME string is asserted PRESENT three lines below, after the click — a payload that stopped rendering would red there.
    expect(container.textContent).not.toContain('Daily needs are met');
    fireEvent.click([...container.querySelectorAll('button')].find((b) => b.textContent.includes('Food Security')));
    expect(container.textContent).toContain('Daily needs are met, with no surplus');
    // The sentence above is read out of this very render, so the exclusion below
    // measures the wording rather than an empty tree. // anchored: positive toContain on this same textContent
    expect(container.textContent).not.toContain('Agricultural surplus of');
  });

  test('the three-clause deficit sentence closes, because magic no longer covers the gap in silence', () => {
    useStore.setState({ campaigns: [] });
    // 600 produced against 1000 needed is a 400 lb gap; imports carry 200 of it and
    // magic 80, leaving 120 — twelve per cent of need. Read without the magic
    // clause, "covers 60%" and "imports cover 50% of the gap" read out to a 20%
    // residual beside a printed 12%, which is the defect.
    const fb = { dailyProduction: 600, dailyNeed: 1000, deficit: 120, deficitPercent: 12, surplus: 0, importCoverage: 200, magicFoodOffset: 80, rawDeficit: 400, agricultureModifier: 1 };
    const { container } = render(e(EconomicsTab, { settlement: withFood(fb), saveId: null, publicDossier: true }));
    const text = container.textContent;
    expect(text).toContain(`Production covers ${Math.round((fb.dailyProduction / fb.dailyNeed) * 100)}% of food needs`);
    expect(text).toContain(`Trade imports cover an estimated ${Math.round((fb.importCoverage / fb.rawDeficit) * 100)}% of the gap`);
    expect(text).toContain(`Residual shortfall is ${fb.deficitPercent}%`);
    expect(text).toContain('Magical provision closes the remainder of the gap.');
    // The arithmetic the three clauses plus the magic clause now describe.
    expect((fb.dailyNeed - fb.dailyProduction - fb.importCoverage - fb.magicFoodOffset) / fb.dailyNeed * 100)
      .toBe(fb.deficitPercent);
  });

  test('the magic clause is silent when no magic closes the gap, and speaks on the import-less branch', () => {
    useStore.setState({ campaigns: [] });
    // Same gap, carried by trade alone: the clause must not appear.
    const mundane = render(e(EconomicsTab, {
      settlement: withFood({ dailyProduction: 600, dailyNeed: 1000, deficit: 200, deficitPercent: 20, surplus: 0, importCoverage: 200, rawDeficit: 400, agricultureModifier: 1 }),
      saveId: null, publicDossier: true,
    })).container.textContent;
    expect(mundane).toContain('Residual shortfall is 20%');
    // anchored: the deficit sentence is pinned PRESENT on this same `mundane` payload one line above
    expect(mundane).not.toContain('Magical provision');
    cleanup();
    // A severed route takes the OTHER branch — "Production deficit of X%" — where the
    // same silence understated the gap: 40% of need is missing and magic closes half.
    const severed = render(e(EconomicsTab, {
      settlement: withFood({ dailyProduction: 600, dailyNeed: 1000, deficit: 200, deficitPercent: 20, surplus: 0, rawDeficit: 400, magicFoodOffset: 200, agricultureModifier: 1 }),
      saveId: null, publicDossier: true,
    })).container.textContent;
    expect(severed).toContain('Production deficit of 20%');
    expect(severed).toContain('Magical provision closes the remainder of the gap.');
  });

  /**
   * ODQ §934.15 — "make sure that the food deficit math and the band visual are
   * correct". The balance bar is the band visual on this tab, and a bar drawn from
   * a different number than the sentence beside it is the defect class this pins:
   * the filled run IS production ÷ need, the figure the readout states, and the
   * blue import run that sits on top of it IS the imported quantity against the
   * same need — never a share of the gap, which would overrun the track.
   */
  test('the food balance bar is drawn from the same arithmetic the readout states', () => {
    useStore.setState({ campaigns: [] });
    const { container } = render(e(EconomicsTab, { settlement: SPEAKING, saveId: null, publicDossier: true }));
    const fb = SPEAKING.economicViability.metrics.foodBalance;
    // The track is the only 10px-high bar on the tab; its first child is the
    // production run. Addressing it by geometry keeps the pin off class names the
    // tab does not carry.
    const track = [...container.querySelectorAll('div')]
      .find((node) => node.style.height === '10px' && node.style.position === 'relative');
    expect(track, 'the food balance track did not render').toBeTruthy();
    const production = track.firstElementChild;
    expect(production.style.width).toBe(`${Math.round((fb.dailyProduction / fb.dailyNeed) * 100)}%`);
    expect(production.style.width).toBe('60%'); // 600 / 1000 — the ratio, spelled out
    // The readout's own percentage is the residual share of NEED, and it is the
    // one the dossier model publishes rather than a second derivation.
    expect(container.textContent).toContain(`Production deficit of ${Math.round((fb.deficit / fb.dailyNeed) * 100)}%`);
  });

  test('the ROUTER threads the public condition — OutputContainer hands publicDossier to the tab', () => {
    const router = readFileSync(ROUTER_SRC, 'utf8');
    // The condition is still computed where it always was...
    expect(router).toContain('const publicDossier = readOnly && !saveId;');
    // ...and the economics route now actually PASSES it. Without this line the render
    // arms above would pass while the live gallery dossier still leaked.
    const economicsCase = router.split('\n').find((l) => l.includes("case 'economics':"));
    expect(economicsCase).toBeTruthy();
    expect(economicsCase).toContain('publicDossier={publicDossier}');
  });
});

/**
 * ── DESK-ECON2: THE ECONOMY DESK ON ITS THREE OTHER TABS ─────────────────────────────
 *
 * ⚠ THIS FILE IS NOW THE ECONOMY DESK'S UI HOME, NOT THE ECONOMICS TAB'S. The desk's leaf
 * was never an economics-TAB leaf: DS-ECO-11 is the resources page, DS-SUP-3 the services
 * page, and DS-ECO-8's one speaking position is on daily life. The arms live here rather
 * than in three new files on purpose — a new test file moves the lighting census and two
 * ratchet floors, and one desk's rendered proof is one subject.
 *
 * WHAT THESE ARMS ARE FOR, restated because the walker cannot do it: the reachability arm
 * in dossierMountRegistry.walker.test.js only checks that a mount id appears as a string
 * literal at exactly ONE site under src/components. It cannot tell a real draw from a
 * decorative literal. A mount is real only if the rendered DOM carries the corpus sentence,
 * and that is what every arm below asserts — in both directions, on the SAME settlement,
 * so a fixture that simply had nothing to say fails the liveness half.
 */
import { ResourcesTab } from '../../src/components/new/tabs/ResourcesTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import { DailyLifeTab } from '../../src/components/new/tabs/DailyLifeTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { economyDeskRead } from '../../src/components/new/economyDeskRead.js';
import { drawnAtMount } from '../../src/domain/display/stateProse/dossierMounts.js';
import { tierNounFor, weaveBlock } from '../../src/domain/display/stateProse/weaveBlock.js';
import { legibilityRung } from '../../src/domain/display/stateProse/legibilityRung.js';
import { SILENT_ECONOMY_DESK } from '../../src/components/new/economyDeskRead.js';

/**
 * THE FIXTURE CARRIES NO `_seed` AND NO `id`, so every draw is CANONICAL-AT-ZERO (kernel law
 * 4): the desk reads index 0 of each pool's eligible list and the expected sentences below
 * are literal rather than seed-dependent. Its FIELD SHAPES are pinned against a really
 * generated settlement by the SHAPE PIN arm at the end, which is trap 4 of the desk-car law:
 * a fixture that is the only writer of the shape it grades is a desk green on nothing.
 */
const GROUND = {
  name: 'Thornwall',
  tier: 'village',
  config: { terrainType: 'plains' },
  economicState: {
    prosperity: 'Comfortable',
    tradeAccess: 'road',
    primaryExports: ['Timber', 'Wool'],
    activeChains: [],
    incomeSources: [],
    institutionalServices: [],
  },
  resourceAnalysis: {
    terrain: 'Plains',
    strategicValue: 'Medium - agricultural heartland, but exposed to raids',
    economicStrengths: ['Grain production', 'Livestock'],
    exploitation: {
      unexploited: [{
        rawResource: 'timber',
        exportValue: 'very high',
        processingInstitutions: ['Sawmill'],
        intermediateGoods: ['sawn planks'],
        finalProducts: ['furniture'],
      }],
      partiallyExploited: [],
      fullyExploited: [],
    },
  },
  availableServices: {
    food: [{ name: 'Inn', desc: 'A bed and a meal', institution: 'The Broken Wheel' }],
    equipment: [{ name: 'Smithy', desc: 'Ironwork', institution: 'Blacksmith' }],
  },
};

/**
 * The canonical-at-zero sentence each mounted position draws over GROUND, computed through the
 * shipped read path with NO SEED — kernel law 4, which is a real and stable answer and not a
 * fallback (car 8a-13).
 *
 * ⚠ WHY THESE ARE COMPUTED TOO, when no draw rule can move a seedless read. A draw rule
 * cannot, but the REWRITE can: NEVER TRIM lets a pool GROW and Shift 1 rewrites the wordings
 * themselves, and index 0's own text moving is exactly as fatal to a literal pin as a re-index
 * was. The `{resource}` and `{institution}` fills ride the exploitation lens's per-lens
 * override; `{access}` is the shared bag's, and `{good}` and `{complexity}` have no fill on
 * this town (`bareCommonFill` refuses a title-cased export, and the fixture carries no
 * `economicComplexity`) — that refusal is part of what each pool's eligible set is.
 */
const GROUND_SLOTS = Object.freeze({ settlement: 'Thornwall', access: 'road' });
const GROUND_LINES = Object.freeze(drawnMembers({
  terrain: { blockId: 'DS-ECO-11', poolKey: 'TERRAIN: Plains' },
  strengths: { blockId: 'DS-ECO-11', poolKey: 'ECONOMIC STRENGTHS: the roster is populated' },
  worth: { blockId: 'DS-ECO-11', poolKey: "STRATEGIC VALUE: the generator's assessment, framed" },
  workings: {
    blockId: 'DS-ECO-11',
    poolKey: 'EXPLOITATION: unexploited, exportValue: high',
    slots: { ...GROUND_SLOTS, resource: 'timber', institution: 'Sawmill' },
  },
  catalog: { blockId: 'DS-SUP-3', poolKey: 'THE HEALING GAP' },
  posture: { blockId: 'DS-ECO-10', poolKey: 'POSTURE: established' },
  standing: { blockId: 'DS-ECO-8', poolKey: 'COMFORTABLE' },
}, { leaf: 'economy', seed: '', slots: GROUND_SLOTS }));

/**
 * ⭐ THE ANCHOR AS THE PAGE PRINTS IT (the block weave, 2026-09-18). Every `DeskLines` position
 * renders ONE woven paragraph, and from the second sentence on an opening settlement name is
 * stood down to the tier noun. The anchor is therefore put through THE SHIPPED WEAVE at the
 * index the DESK hands the renderer — the claim is unchanged in force and gains one more: the
 * sentence reaches the DOM in the form the reader actually meets. A line that is not in the
 * position's own list comes back UNCHANGED and still fails loudly.
 * @param {string} sentence @param {ReadonlyArray<string|null|undefined>} lines
 * @param {{name?: unknown, tier?: unknown}} settlement
 */
function onPage(sentence, lines, settlement) {
  const kept = (lines || []).filter(Boolean);
  const index = kept.indexOf(sentence);
  if (index < 0) return sentence;
  return weaveBlock(kept, {
    settlementName: settlement.name, tierNoun: tierNounFor(settlement.tier),
  }).sentences[index];
}

/**
 * The four economy-desk positions `DeskLines` renders, each with the desk keys its call site
 * hands over IN ORDER. Named once so the arm below drives exactly what the tabs drive.
 */
const DESK_LINE_MOUNTS = Object.freeze({
  'resources.groundAndWorkings': ['terrainIdentity', 'economicStrengths', 'strategicValue', 'exploitation'],
  // ⭐ ONE KEY SINCE 2026-09-19, AND THE SECOND ONE DID NOT DIE — it MOVED. DS-SUP-3's
  // `impairedService` lens names ONE HOUSE by name, and the owner's order ("some other
  // sections need the same adjustment") put it under that house's own service row, the way
  // `defense.threatAssessment` renders under the bar it is about. It is the SAME position
  // (`services.catalogStanding`, one registry row, one reachability literal) drawn where each
  // of its two lenses belongs, so this table — which is about what ONE `DeskLines` call site
  // hands over — now lists the catalog lens alone.
  'services.catalogStanding': ['catalogStanding'],
  'economics.exportPosture': ['exportPosture'],
  'daily_life.standingOfLiving': ['prosperityRung'],
  'economics.commercialProfile': ['incomeMix', 'criminalLine', 'tradeProfile'],
});

/** The sentences one position draws for a settlement, in the order its call site lists them. */
function positionLines(mount, settlement) {
  const desk = economyDeskRead(settlement, { publicDossier: false, playerView: false });
  return DESK_LINE_MOUNTS[mount]
    .map((key) => drawnAtMount(mount, desk[key])?.sentence)
    .filter(Boolean);
}

describe('DESK-ECON2 — the mounted positions are DRAWS, not citations', () => {
  test('resources.groundAndWorkings: four lenses render, and a public dossier renders none', () => {
    const priv = render(e(ResourcesTab, { settlement: GROUND, publicDossier: false }));
    const privText = priv.container.textContent;
    cleanup();
    const pub = render(e(ResourcesTab, { settlement: GROUND, publicDossier: true }));
    const pubText = pub.container.textContent;
    // COLLECT-THEN-ASSERT (car 8a-13): all four lenses run, so a red names every one that
    // moved rather than the first.
    // The four lenses render as ONE woven paragraph, so each anchor is taken in the form the
    // page prints it: `strengths` is the SECOND sentence and opens on the town's name, so what
    // reaches the DOM is "The village has more than one thing…" (see `onPage`).
    const lines = positionLines('resources.groundAndWorkings', GROUND);
    expectNoSeedFailures(collectSeedFailures(Object.entries({
      terrain: GROUND_LINES.terrain,
      strengths: GROUND_LINES.strengths,
      worth: GROUND_LINES.worth,
      workings: GROUND_LINES.workings,
    }), ([lens, line]) => expectPresentThenAbsent(
      privText, pubText, onPage(line, lines, GROUND), `resources.groundAndWorkings :: ${lens}`,
    )), 'all four resources lenses draw privately and none reaches a public dossier');
    // The DATUM is untouched by the gate — the terrain word, the strengths chips and the
    // generator's own strategic-value line are the page's and are not corpus prose.
    expect(pubText).toContain('Plains');
    expect(pubText).toContain('Grain production');
    expect(pubText).toContain('agricultural heartland');
  });

  test('services.catalogStanding: the gap sentence renders, and a public dossier renders none', () => {
    const priv = render(e(ServicesTab, {
      services: GROUND.availableServices, settlement: GROUND, publicDossier: false,
    }));
    const privText = priv.container.textContent;
    cleanup();
    const pub = render(e(ServicesTab, {
      services: GROUND.availableServices, settlement: GROUND, publicDossier: true,
    }));
    expectPresentThenAbsent(privText, pub.container.textContent, GROUND_LINES.catalog,
      'services.catalogStanding');
    // The village tier expects food, healing and equipment; this town keeps two of the
    // three, so the DATUM the sentence bands is on the page beside it.
    expect(pub.container.textContent).toContain('1 missing');
  });

  test('economics.exportPosture: the posture sentence renders, and a public dossier renders none', () => {
    useStore.setState({ campaigns: [] });
    const priv = render(e(EconomicsTab, { settlement: GROUND, saveId: null, publicDossier: false }));
    const privText = priv.container.textContent;
    cleanup();
    const pub = render(e(EconomicsTab, { settlement: GROUND, saveId: null, publicDossier: true }));
    const pubText = pub.container.textContent;
    expectPresentThenAbsent(privText, pubText, GROUND_LINES.posture, 'economics.exportPosture');
    // The Trade Profile section itself is the surface and survives the gate.
    expect(pubText).toContain('Timber');
    expect(pubText).toContain('Exports');
  });

  test('daily_life.standingOfLiving: DS-ECO-8 speaks HERE, and nowhere else on the page-set', () => {
    useStore.setState({ campaigns: [] });
    const priv = render(e(DailyLifeTab, { settlement: GROUND, publicDossier: false }));
    const privText = priv.container.textContent;
    cleanup();
    const pub = render(e(DailyLifeTab, { settlement: GROUND, publicDossier: true }));
    const pubText = pub.container.textContent;
    expectPresentThenAbsent(privText, pubText, GROUND_LINES.standing, 'daily_life.standingOfLiving');
    // The band word is the page's own anchor fact and is NOT corpus prose.
    expect(pubText).toContain('Comfortable');
    cleanup();
    // ⭐ THE ONE-FACT-ONE-SENTENCE LAW, DRIVEN RATHER THAN ASSERTED FROM THE TABLE: the same
    // rung is mounted at `economics.economyTile` as a GLANCE, so the economics page must NOT
    // carry this sentence even though the desk built the rung for it.
    const econ = render(e(EconomicsTab, { settlement: GROUND, saveId: null, publicDossier: false }));
    // The daily-life render above proved this exact string is drawable from this exact
    // fixture, so its absence here is the GLANCE rung and not an empty page.
    // anchored: the same string was asserted PRESENT on daily_life from this same fixture
    expect(econ.container.textContent).not.toContain(GROUND_LINES.standing);
    expect(econ.container.textContent, 'the economics page did not render at all')
      .toContain('Comfortable');
  });

  /**
   * ⛔ THIS ARM NO LONGER CLAIMS TO PROVE THE NAME THREAD, and the retitling is the fix
   * (review 12). It used to compare each mount's DOM against `weaveBlock`'s output and say
   * that proved `settlementName`/`tier` had reached the call site. It did not: four of these
   * five positions draw a SINGLE line on this fixture, and a one-line weave is the line —
   * so the comparison held identically with the props and without them. An arm that cannot
   * fail for the reason it names is worse than no arm, because it is counted as coverage.
   *
   * What it really measures is a DRAW, and that is worth keeping: every mount the tabs list
   * is reached, its desk speaks, and the page prints what was drawn. So it asserts the FIRST
   * drawn sentence, which the weave never renames whatever else it does — a claim with no
   * dependency on the thread at all. The thread is proven at the end of this file, where a
   * hand-built two-line block makes a dropped prop visible.
   */
  test('every DeskLines mount the tabs list draws, and the page prints what was drawn', () => {
    useStore.setState({ campaigns: [] });
    /** @type {Array<[string, any, object]>} */
    const renders = [
      ['resources.groundAndWorkings', ResourcesTab, { settlement: GROUND, publicDossier: false }],
      ['services.catalogStanding', ServicesTab, { settlement: GROUND, services: GROUND.availableServices, publicDossier: false }],
      ['economics.exportPosture', EconomicsTab, { settlement: GROUND, saveId: null, publicDossier: false }],
      ['daily_life.standingOfLiving', DailyLifeTab, { settlement: GROUND, publicDossier: false }],
      ['economics.commercialProfile', EconomicsTab, { settlement: GROUND, saveId: null, publicDossier: false }],
    ];
    let judged = 0;
    const failures = collectSeedFailures(renders, ([mount, Tab, props]) => {
      const lines = positionLines(mount, GROUND);
      if (lines.length === 0) return; // R-DST-K: a position the corpus is silent about.
      judged += 1;
      const text = render(e(Tab, props)).container.textContent;
      cleanup();
      // The FIRST line keeps its name under every weave, so this is a DRAW claim and cannot
      // be mistaken for a thread claim by a later reader.
      expect(text, `${mount}: the page does not carry the first sentence its desk drew`)
        .toContain(lines[0]);
    });
    expectNoSeedFailures(failures, 'every DeskLines mount draws and reaches the page');
    expect(judged, 'no mount spoke on this fixture, so the arm judged nothing').toBeGreaterThan(0);
  });

  test('…and the stand-down really fires in a tab, not only in the weave\'s own unit test', () => {
    // NON-VACUITY WITH A NAMED SUBJECT. `resources.groundAndWorkings` is the one position this
    // fixture draws more than one lens at, and its SECOND lens opens on the town's name — so
    // this is the arm that would red if a call site dropped `settlementName`/`tier`.
    useStore.setState({ campaigns: [] });
    const lines = positionLines('resources.groundAndWorkings', GROUND);
    expect(lines.length, 'the position stopped drawing more than one lens').toBeGreaterThan(1);
    const stoodDown = onPage(GROUND_LINES.strengths, lines, GROUND);
    expect(stoodDown, 'the strengths lens no longer opens on the name, so this arm is free')
      .not.toBe(GROUND_LINES.strengths);
    // ⛔ THE EXPECTED FORM IS COMPUTED FROM THE DRAWN MEMBER, NEVER TYPED (car 8a-13's rule,
    // and `proseDrawnAnchors.walker.test.js` is what keeps it so). This assertion used to
    // pin the stood-down sentence as a LITERAL — 105 characters of DS-ECO-11's own wording —
    // which is the class that habitat removal exists to end: NEVER TRIM lets the pool grow,
    // an appended variant wins the draw, and the literal reds while the desk, the contract
    // and the paid-surface gate this arm guards are all perfectly well.
    //
    // The claim does not weaken. It gains a premise and states the TRANSFORMATION instead of
    // the result: the drawn member opens on the name, and the stand-down is that same member
    // with its opening name replaced by the tier phrase and nothing else touched. A re-index
    // or a rewording moves the member and the expectation together; a weave that started
    // dropping words, renaming mid-sentence, or reaching for the pronoun still reds.
    expect(GROUND_LINES.strengths.startsWith(GROUND.name),
      'the drawn member stopped opening on the name, so there is no stand-down to expect')
      .toBe(true);
    expect(stoodDown, 'the stand-down is not the drawn member with its opening name replaced')
      .toBe(`The ${GROUND.tier}${GROUND_LINES.strengths.slice(GROUND.name.length)}`);
    const text = render(e(ResourcesTab, { settlement: GROUND, publicDossier: false })).container.textContent;
    expect(text, 'the tab renders the raw sentence, so the props did not reach DeskLines')
      .not.toContain(GROUND_LINES.strengths); // anchored: the toContain below proves this same render carries the position
    expect(text).toContain(stoodDown);
  });

  test('the ROUTER threads the public condition to all three new tabs', () => {
    const router = readFileSync(ROUTER_SRC, 'utf8');
    for (const tab of ['resources', 'services', 'daily_life']) {
      const line = router.split('\n').find((l) => l.includes(`case '${tab}':`));
      expect(line, `the router has no ${tab} case`).toBeTruthy();
      expect(line, `case '${tab}' does not receive publicDossier`).toContain('publicDossier={publicDossier}');
    }
  });

  /**
   * ⛔ TRAP 4 OF THE DESK-CAR LAW: a fixture can be the only writer of the FIELD or the
   * SHAPE it grades. Every field GROUND carries is checked against a really generated
   * settlement — same key, same JS shape — so a desk green on this fixture is a desk that
   * would be green on a real world.
   */
  test('SHAPE PIN: every field the fixture carries has the shape the real generator writes', () => {
    const real = generateSettlementPipeline(
      { settType: 'village', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' },
      null, { seed: 'econ2-shape-pin', customContent: {} },
    );
    const shape = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);
    expect(shape(real.config?.terrainType)).toBe(shape(GROUND.config.terrainType));
    expect(shape(real.tier)).toBe(shape(GROUND.tier));
    expect(shape(real.resourceAnalysis?.terrain)).toBe(shape(GROUND.resourceAnalysis.terrain));
    expect(shape(real.resourceAnalysis?.strategicValue)).toBe(shape(GROUND.resourceAnalysis.strategicValue));
    expect(shape(real.resourceAnalysis?.economicStrengths)).toBe('array');
    expect(shape(real.resourceAnalysis?.exploitation)).toBe('object');
    for (const bucket of ['unexploited', 'partiallyExploited', 'fullyExploited']) {
      expect(shape(real.resourceAnalysis?.exploitation?.[bucket]), bucket).toBe('array');
    }
    // availableServices is an OBJECT of arrays, not an array — the shape the desk's absence
    // reader depends on, and the one a hand fixture most easily gets wrong.
    expect(shape(real.availableServices)).toBe('object');
    for (const list of Object.values(real.availableServices || {})) expect(shape(list)).toBe('array');
    expect(shape(real.economicState?.primaryExports)).toBe('array');
    // And the exploitation ROW shape, taken from a settlement that has one.
    const anyRow = ['unexploited', 'partiallyExploited', 'fullyExploited']
      .flatMap((b) => real.resourceAnalysis?.exploitation?.[b] || [])[0];
    if (anyRow) {
      expect(shape(anyRow.rawResource)).toBe('string');
      expect(shape(anyRow.processingInstitutions)).toBe('array');
      expect(shape(anyRow.finalProducts)).toBe('array');
    }
    // The terrain TOKEN and the terrain NAME are different strings on a real settlement —
    // the label trap, pinned in the UI suite as well as the desk suite.
    expect(real.config.terrainType).toBe('plains');
    expect(real.resourceAnalysis.terrain).toBe('Plains');
  });
});

/**
 * ── ⭐⭐ THE NAME THREAD, PROVEN WHERE IT CAN FAIL (review 10, 2026-09-18) ──────────────
 *
 * The arm above ("every DeskLines mount renders its WOVEN paragraph") is STRUCTURAL and it
 * is vacuous at four of its five sites, because `weaveBlock` returns a lone line verbatim and
 * this fixture draws exactly one line at four of them. These arms cannot be: each drives its
 * real call site with a TWO-LINE hand-built block whose second line opens on the town's name,
 * so dropping `settlementName`/`tier` at that site puts the raw sentence in the DOM and reds
 * the anchored negative.
 *
 * ⛔ THREE OF THE FIVE ECONOMY SITES ARE ABSENT FROM THIS SUITE, AND THAT IS A FINDING RATHER
 * THAN AN OMISSION. `economics.exportPosture` (`rungs={[deskProse.exportPosture]}`),
 * `daily_life.standingOfLiving` (`rungs={[deskProse.prosperityRung]}`) and — since
 * 2026-09-19 — `services.catalogStanding` (`rungs={[deskProse.catalogStanding]}`) pass
 * exactly ONE rung BY CONSTRUCTION, and `weaveBlock` returns a single line verbatim. The two
 * props are therefore provably INERT at those sites today — no rung list, hand-built or
 * drawn, can make them change a character — so no behavioural arm is possible there and the
 * structural one above is the whole of what can be claimed. The day any of the three call
 * sites grows a second lens, it belongs in the table below.
 *
 * ⚠ THE SERVICES SITE JOINED THAT LIST BY A DELIBERATE MOVE, NOT BY LOSING A LENS. DS-SUP-3
 * still draws both of its lenses; the second one now renders under the row of the house it
 * names (the owner's 2026-09-19 order, the DefenseTab idiom), which is a second one-rung
 * `DeskLines` rather than a second sentence in this paragraph. A consequence worth stating
 * plainly: that sentence no longer stands its opening name down against the catalog line,
 * because a one-line weave is the line. The shipped pool opens on `{institution}` rather than
 * on the settlement, so no shipped wording moves; a future wording that opened on the town's
 * name would print it, and re-homing it is the act that would owe an arm here.
 */
describe('DeskLines — the name props reach the real call sites, non-vacuously', () => {
  const NAME = GROUND.name;
  const line = (blockId, text) => legibilityRung('', { blockId, poolKey: 'hand-built', angle: 'plain', text }, []);

  /** The first sentence keeps its name; the SECOND is the one that must stand down. */
  const OPENER = `${NAME} sits where two cart roads meet.`;
  const REPEAT = `${NAME} keeps a market on the green and a smith at the ford.`;
  const STOOD_DOWN = `The ${GROUND.tier} keeps a market on the green and a smith at the ford.`;

  /**
   * Each row is [mount, blockId, the desk keys the call site hands over, the Tab, its props].
   * The keys are read off the call site itself, so a site that re-orders or renames its rungs
   * reds here rather than silently testing a position nobody renders.
   */
  const SITES = [
    ['resources.groundAndWorkings', 'DS-ECO-11', ['terrainIdentity', 'economicStrengths'],
      ResourcesTab, { settlement: GROUND, publicDossier: false }],
    ['economics.commercialProfile', 'DS-ECO-12', ['incomeMix', 'criminalLine'],
      EconomicsTab, { settlement: GROUND, saveId: null, publicDossier: false }],
  ];

  /**
   * ⚠ A PLAIN TEST LOOPING OVER THE ROWS, NEVER `test.each` — the sovereignty lighting
   * walker's own prescription. An `each` call would park this file on the each-family debt,
   * whose ceiling is frozen and may only shrink. `collectSeedFailures` keeps what `each`
   * was for: every site is driven, and a red names all of them rather than the first.
   */
  test('every multi-rung economy call site stands the repeated opening name down, through its own tab', () => {
    const failures = collectSeedFailures(SITES, ([mount, blockId, keys, Tab, props]) => {
    useStore.setState({ campaigns: [] });
    const rungs = [line(blockId, OPENER), line(blockId, REPEAT)];

    // ⛔ THE LIVENESS ANCHOR IS THE PAGE ITSELF, DRIVEN WITH ONE RUNG (review 12). It used to
    // be a bare `DeskLines` render, which proves the RENDERER can print the sentence and says
    // nothing about whether the TAB still mounts the position — so a tab that had stopped
    // mounting it entirely passed the absence half vacuously. Driving the same tab with a
    // single rung puts the raw sentence on the page verbatim (a one-line weave is the line),
    // which is the exact claim the anchor needs: this page, at this mount, can print this.
    deskOverride.current = Object.freeze({ ...SILENT_ECONOMY_DESK, [keys[0]]: rungs[1] });
    const oneRung = render(e(Tab, props)).container.textContent;
    cleanup();
    expect(oneRung, `${mount}: the tab does not mount this position at all`).toContain(REPEAT);

    deskOverride.current = Object.freeze({
      ...SILENT_ECONOMY_DESK, [keys[0]]: rungs[0], [keys[1]]: rungs[1],
    });
    const text = render(e(Tab, props)).container.textContent;
    expectPresentThenAbsent(oneRung, text, REPEAT, `${mount}: the raw name-opening sentence`);
    expect(text, `${mount}: the tier-noun stand-down is not on the page`).toContain(STOOD_DOWN);
    // …and the FIRST line keeps its name, so the paragraph still says who it is about.
    expect(text, `${mount}: the opening sentence lost its name`).toContain(OPENER);
    // …and the whole position reads as the ONE paragraph the weave produces.
    expect(text, `${mount}: the position did not render the woven paragraph`)
      .toContain(weaveBlock([OPENER, REPEAT], {
        settlementName: NAME, tierNoun: tierNounFor(GROUND.tier),
      }).paragraph);
    });
    expect(SITES.length, 'the site table emptied, so the loop judged nothing').toBe(2);
    expectNoSeedFailures(failures, 'every multi-rung DeskLines call site threads the name');
  });

  test('THE THREE SINGLE-RUNG SITES ARE INERT BY CONSTRUCTION, and the source says so', () => {
    // The claim the describe's header makes, executed rather than asserted in prose: each of
    // these call sites passes a one-element rung list, and a one-line weave is the line.
    const econ = readFileSync(join(HERE, '../../src/components/new/tabs/EconomicsTab.jsx'), 'utf8');
    const daily = readFileSync(join(HERE, '../../src/components/new/tabs/DailyLifeTab.jsx'), 'utf8');
    const services = readFileSync(join(HERE, '../../src/components/new/tabs/ServicesTab.jsx'), 'utf8');
    expect(econ).toContain('mount="economics.exportPosture" settlementName={s?.name} tier={s?.tier} rungs={[deskProse.exportPosture]}');
    expect(daily).toContain('mount="daily_life.standingOfLiving" settlementName={r?.name} tier={r?.tier} rungs={[deskProse.prosperityRung]}');
    // ⚠ THE SERVICES SITE SPELLS ITS MOUNT AS A CONST, and the reason is the mount registry's
    // own reachability arm: that id may appear ONCE as a whole string literal under
    // src/components, and this tab now draws the position at two places. So the assertion is
    // over the rung list, which is what inertness is about.
    expect(services).toContain('mount={CATALOG_MOUNT} settlementName={settlement?.name} tier={settlement?.tier} rungs={[deskProse.catalogStanding]}');
    expect(services).toContain('rungs={[deskProse.impairedService]}');
    // …and the weave really does return a lone line verbatim, which is what makes them inert.
    expect(weaveBlock([REPEAT], { settlementName: NAME, tierNoun: tierNounFor(GROUND.tier) }).paragraph)
      .toBe(REPEAT);
    // ANCHOR: the same weave with TWO lines does stand the second down, so the identity above
    // is the one-line rule and not the weave having stopped working.
    expect(weaveBlock([OPENER, REPEAT], { settlementName: NAME, tierNoun: tierNounFor(GROUND.tier) }).paragraph)
      .toContain(STOOD_DOWN);
  });
});
