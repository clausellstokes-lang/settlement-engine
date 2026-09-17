/**
 * @vitest-environment jsdom
 *
 * generalDeskTabFlow.test.js — THE GENERAL DESK'S DRAWS, PROVEN IN THE RENDERED DOM.
 *
 * ⛔ WHY THIS FILE EXISTS AND WHY A WALKER CANNOT REPLACE IT (THE CITATION LAW). The mount
 * registry's reachability arm can only check that a mount id appears as a string literal at
 * exactly ONE site under `src/components`. It cannot tell a real draw from a decorative
 * literal: planting bare literals PASSES THAT GATE AND LIES. A mount is real only if the
 * rendered DOM carries the corpus sentence. Before this file, the general desk's eight
 * Overview positions had NO such proof — `economicsTabFlow.test.js` was the only test of its
 * shape in the estate, and it covers the economy desk.
 *
 * ⛔ AND THE PAID SURFACE (§885.3). `publicDossier` is `readOnly && !saveId` — a free,
 * anonymous gallery viewer — and corpus prose is a PAID surface. NO walker arm proves a
 * position is silent there; it is gated by hand and must be proved by hand. Every arm below
 * asserts BOTH DIRECTIONS ON THE SAME SETTLEMENT through `expectPresentThenAbsent`, so it
 * cannot pass vacuously: a town that simply had nothing to say fails the liveness half.
 *
 * ⛔ THE FIXTURE'S SHAPE IS MEASURED, NOT ASSUMED (the desk law's trap 4: a fixture can be
 * the only writer of the field OR THE SHAPE it grades). The last describe drives every field
 * this desk reads against a REALLY GENERATED settlement and asserts the shapes agree, so a
 * desk that is green here and dark on every real world reds instead.
 */
import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';
import PlotHooksTab from '../../src/components/new/tabs/PlotHooksTab.jsx';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import SteadingsSection from '../../src/components/new/tabs/SteadingsSection.jsx';
import { RelationshipsTab } from '../../src/components/new/tabs/RelationshipsTab.jsx';
import { useStore } from '../../src/store/index.js';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { drawnMember, drawnMembers, poolMemberTexts } from '../helpers/drawnProse.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { calamityFill } from '../../src/domain/display/stateProse/generalStateProse.js';

const e = React.createElement;
afterEach(cleanup);

/**
 * ⭐ EVERY ANCHOR IN THIS FILE IS A FUNCTION OF THE SEED (REWRITE car 8a-13), and the rule for
 * the next seat that finds one of them red.
 *
 * Every sentence pinned here is a LIVENESS ANCHOR on a DRAWN member of a pool — the `before`
 * half of `expectPresentThenAbsent`, which exists so the "and it is gone publicly" half cannot
 * pass over an empty page. WHICH member a pool draws is a function of the fixture's `_seed`
 * and of the draw rule (`stateProseKernel.js` `drawVariant`, keyed
 * `seed::blockId::poolKey::v<vid>`), so a change to EITHER moves the drawn member without
 * moving one byte of the corpus, the desk or the paid-surface gate these arms exist to prove.
 * When the anchors were LITERAL SENTENCES, every one of them went red at that moment while
 * the thing they guard was perfectly well — twice, measured: car 8a-1 re-seeded three desk
 * pins by hand and car 8a-12 re-seeded SIXTEEN here (nine printed, seven hidden behind a `for`
 * loop that throws on the first).
 *
 * So the literals are gone. Each anchor below is now computed at test time through the SHIPPED
 * READ PATH — `composeStateProse` over the block, the pool, the audience and the slot bag the
 * desk itself uses (`tests/helpers/drawnProse.js`) — and a re-index, a rewrite of a wording or
 * an appended wording that wins the draw moves the member and the anchor TOGETHER. What the
 * arm asserts is unchanged in force: this block, at this pool, over this state, reaches the
 * rendered DOM privately and is silent on a free dossier.
 *
 * ⚠ THIS IS NOT "ASK THE DESK AND CHECK IT ANSWERED". The test still names the block, the
 * pool and the fills — the whole semantic claim — and computes from the CORPUS, while the
 * render comes from the DESK; the two meet only at the assertion. A desk that stopped drawing
 * the pool, lost a fill, or drew a different pool still reds on the liveness half.
 *
 * ⚠ THE SUFFIXED `_seed`s ARE HISTORY, NOT MACHINERY. They were searched at car 8a-12 to make
 * the old LITERALS hold (SPEAKING's cost 111,965 candidates, because eight independent pools
 * had to be satisfied at once). They are kept because other arms in this file — the patron-end
 * exclusion, the `Felix` slice, the DS-REL-2 pair count — are calibrated on the members these
 * seeds draw; they no longer carry the anchors, and no future car needs to search another one.
 */

/**
 * A town that genuinely DRAWS every Overview position the general desk owns. Each field is
 * in the shape the real producer writes — proved in the last describe — and each is the
 * CANONICAL path rather than the corpus title's abbreviation: the institution booleans live
 * at `economicState.compound.inst` and the food arithmetic at
 * `economicViability.metrics.foodBalance`, and a fixture that believed either abbreviation
 * would render BARE and dimension-less on every settlement ever generated.
 */
const SPEAKING = Object.freeze({
  // The seed reaches the draw and nothing else (`generalDeskRead.js`:
  // `String(r?._seed ?? r?.id)`); `id` stays `steinmark` because the ledger lookups and the
  // rendered NAME are keyed on it. EIGHT pools are pinned off this one seed — the seven of the
  // Overview loop and DS-POP-3 through `COUNTED` — and since car 8a-13 every one of their
  // anchors is computed from this same seed rather than transcribed, so the seed may be
  // changed freely without searching for one that satisfies all eight at once.
  id: 'steinmark', name: 'Steinmark', _seed: 'steinmark-16jm', tier: 'town',
  prominentRelationship: {
    npc1: 'Mugain', npc2: 'Felix', type: 'Outstanding Debt',
    phrasing: 'Mugain and Felix are connected by something neither discusses openly.',
  },
  relationships: [{ flagDriven: false }, { flagDriven: false }],
  config: { terrainType: 'mountain', tradeRouteAccess: 'road' },
  institutions: [{ name: 'The Stone Market', category: 'economy' }],
  economicState: {
    prosperity: 'Comfortable',
    foodSecurity: { label: 'Deficit' },
    isEntrepot: false,
    safetyProfile: { safetyLabel: 'Tense — Crime Wave' },
    compound: { inst: { hasCourtSystem: true, hasPrison: true } },
  },
  defenseProfile: {
    scores: { military: 55, monster: 30, internal: 70, economic: 45, magical: 15 },
    readiness: { label: 'Defensible' },
  },
  economicViability: {
    viable: false,
    metrics: {
      foodBalance: { dailyNeed: 1000, deficit: 400, rawDeficit: 400 },
      criticalIssueCount: 2,
    },
  },
  conflicts: [{
    intensity: 'high', parties: ['The Guild', 'The Council'],
    issue: 'Labor control', stakes: 'Market licensing',
  }],
  structuralViolations: ['a violation'],
  structuralSuggestions: ['a suggestion'],
  powerStructure: { factions: [{ faction: 'The Council', isGoverning: true }] },
  history: {},
});

/**
 * The corpus sentence this town draws at each Overview position, computed through the shipped
 * read path at this fixture's seed. The BLOCK, the POOL and the FILLS are the claim; which
 * wording of that pool wins the draw is the corpus's business and follows it.
 *
 * ⚠ THE SLOT BAGS ARE THE DESK'S OWN, not a superset, and the difference is load-bearing: a
 * bag with one extra fill makes a variant the desk considers UNANCHORED eligible here, which
 * moves the draw and reds the arm. (Measured while this car was written — adding
 * `timeband_age` to DS-GEN-14's bag drew a different member than the desk's.) `issue` and
 * `stakes` arrive through `phraseFill`, which lower-cases them; `govFaction` rides DS-GEN-7's
 * bag and is named by no variant of the pool below.
 */
const SPEAKING_SLOTS = Object.freeze({ settlement: 'Steinmark' });
const {
  GROUND, MARKET, INSTITUTIONS, HEALTH, CONFLICT, WARNING, CONNECTION,
} = drawnMembers({
  GROUND: { blockId: 'DS-GEN-12', poolKey: 'HIGH-GROUND' },
  MARKET: { blockId: 'DS-GEN-13', poolKey: 'MARKET-OPEN' },
  INSTITUTIONS: { blockId: 'DS-GEN-17', poolKey: 'ADMINISTERED' },
  HEALTH: { blockId: 'DS-GEN-3', poolKey: 'economicViability.viable: false' },
  CONFLICT: {
    blockId: 'DS-GEN-2',
    poolKey: 'intensity: high',
    slots: {
      ...SPEAKING_SLOTS,
      faction: 'The Guild', faction2: 'The Council',
      issue: 'labor control', stakes: 'market licensing',
    },
  },
  WARNING: {
    blockId: 'DS-GEN-7',
    poolKey: 'structuralViolations[]',
    slots: { ...SPEAKING_SLOTS, govFaction: 'The Council' },
  },
  CONNECTION: { blockId: 'DS-REL-2', poolKey: 'prominentRelationship present' },
}, { leaf: 'general', seed: SPEAKING._seed, slots: SPEAKING_SLOTS });

/** @param {boolean} publicDossier */
const renderTab = (publicDossier) => render(e(OverviewTab, {
  settlement: SPEAKING, narrativeNote: null, onNavigateTab: () => {},
  publicDossier, playerView: false, worldState: null,
})).container.textContent;

describe('THE GENERAL DESK DRAWS ON THE OVERVIEW TAB — and is silent for a free viewer', () => {
  test('six blocks reach the rendered DOM privately and NONE of them reach a public dossier', () => {
    // Direction 1 captured BEFORE cleanup: `container.textContent` empties at unmount, so
    // reading it afterwards would assert the liveness anchor against an empty string.
    const priv = renderTab(false);
    cleanup();
    const pub = renderTab(true);
    // ⛔ COLLECT-THEN-ASSERT (car 8a-13). A bare `for` over pins throws on the FIRST one, so
    // the §919 whole-suite proof printed nine failing sentences over SIXTEEN moved pins and
    // the seven behind them were invisible. Every position now runs and the roster travels
    // with the true count (tests/helpers/seedFailures.js).
    expectNoSeedFailures(collectSeedFailures([
      [GROUND, 'DS-GEN-12 the ground (overview.ground)'],
      [MARKET, 'DS-GEN-13 the market (overview.market)'],
      [INSTITUTIONS, 'DS-GEN-17 the roster (overview.institutions)'],
      // DS-GEN-3 (overview.systemsHealth) is NOT in this list since owner order 2026-09-17:
      // that position glances, and the arm below pins its silence in the DOM.
      [CONFLICT, 'DS-GEN-2 the conflict line (overview.conflicts)'],
      [WARNING, 'DS-GEN-7 the coherence warning (overview.warnings)'],
      [CONNECTION, 'DS-REL-2 the notable connection (overview.notableConnection)'],
    ], ([sentence, label]) => expectPresentThenAbsent(
      priv, pub, sentence, `the general desk at ${label}`,
    )), 'every Overview position draws privately and is silent on a public dossier');
  });

  test('SYSTEMS HEALTH keeps its bars and prints NO sentence list under them (owner order 2026-09-17)', () => {
    // The owner: "Regarding the 10 different sentences, either simply pick just one or remove
    // that entire section." The chair ruled REMOVE. The section is found by its own header, so
    // the absence below is judged inside the section that used to print the stack.
    const BAR_LABELS = ['Military Might', 'Monster Defense', 'Internal Security', 'Economic Resilience', 'Magical Capability', 'Food Security'];
    const towns = [
      SPEAKING,
      ...[['town', 'germanic'], ['city', 'norse'], ['village', 'celtic']].map(([settType, culture], i) => (
        generateSettlementPipeline({ settType, culture }, null, { seed: `health-stack-${i}`, customContent: {} }))),
    ];
    for (const town of towns) {
      const { container } = render(e(OverviewTab, {
        settlement: town, narrativeNote: null, onNavigateTab: () => {},
        publicDossier: false, playerView: false, worldState: null,
      }));
      const header = [...container.querySelectorAll('button')].find((b) => (b.textContent || '').includes('Systems Health'));
      expect(header, `${town.name}: the Systems Health section is gone`).toBeTruthy();
      const host = header.closest('div');
      const text = host.textContent || '';
      // THE BARS AND THEIR LABELS STILL RENDER — the datum was never the stack.
      for (const label of BAR_LABELS.slice(0, 5)) expect(text, `${town.name}: the ${label} bar is gone`).toContain(label);
      if (town.economicState?.foodSecurity?.label) expect(text).toContain('Food Security');
      // …AND NO SENTENCE LIST. Every DS-GEN-3 line was a <p> in this section; nothing else in
      // it is (the caption is a div, the badge is spans), so a returning stack reds here.
      expect(host.querySelectorAll('p').length, `${town.name}: a sentence list is back under the Systems Health bars`).toBe(0);
      cleanup();
    }
    // The drawn DS-GEN-3 member SPEAKING used to print here is absent from the whole page,
    // anchored on the bar label that sits in the same section.
    const priv = renderTab(false);
    expectAbsentWithAnchor(priv, HEALTH, 'Internal Security', 'DS-GEN-3 still prints under the Systems Health bars');
  });

  test('⛔ THE OVERVIEW NEVER PRINTS "NO CRISIS" BESIDE ITS OWN CRISIS BANNER (owner order 2026-09-17)', () => {
    // The Kamalavalli contradiction: a Politically Fractured card with its ACTIVE CRISIS badge,
    // then "There is no crisis on the books…". Driven over generated crisis towns in the DOM,
    // with the no-crisis pool's every member filled for the town, so no wording escapes.
    const crisisConfigs = [
      { settType: 'village', culture: 'celtic', stressTypes: ['politically_fractured'] },
      { settType: 'town', culture: 'germanic', stressTypes: ['famine'] },
      { settType: 'city', culture: 'norse', stressTypes: ['famine', 'wartime'] },
    ];
    let judged = 0;
    for (const [i, config] of crisisConfigs.entries()) {
      const town = generateSettlementPipeline(config, null, { seed: `one-crisis-truth-${i}`, customContent: {} });
      const noCrisis = poolMemberTexts({
        leaf: 'stressors', blockId: 'DS-STR-1', poolKey: "Overview's own section framing", slots: { settlement: town.name },
      });
      for (const playerView of [false, true]) {
        const text = render(e(OverviewTab, {
          settlement: town, narrativeNote: null, onNavigateTab: () => {},
          publicDossier: false, playerView, worldState: null,
        })).container.textContent;
        cleanup();
        if (!text.includes('ACTIVE CRISIS')) continue;
        judged += 1;
        for (const sentence of noCrisis) {
          expectAbsentWithAnchor(text, sentence, 'ACTIVE CRISIS', `${town.name} prints a no-crisis line beside its own crisis banner`);
        }
      }
    }
    expect(judged, 'no generated town rendered a crisis banner, so this arm judged nothing').toBeGreaterThan(0);
    // STRUCTURAL: the Overview's crisis block does not draw the no-banner rung at all, because
    // that block exists only when there IS a banner (R-DST-K keeps the calm town silent too).
    const source = readFileSync(join(HERE, '../../src/components/new/tabs/OverviewTab.jsx'), 'utf8');
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    expectAbsentWithAnchor(code, 'stressorProse.crisisFraming', 'stressorProse.crisisArity',
      'OverviewTab draws the no-crisis rung inside its crisis block again');
  });

  test('the gate takes the CORPUS SENTENCES ONLY — every datum on the page survives it', () => {
    const pub = renderTab(true);
    // The conflict row keeps its parties, its badge and its issue; only the banded sentence
    // beneath them goes. A gate that blanked the datum would be a different defect.
    expect(pub).toContain('The Guild');
    expect(pub).toContain('The Council');
    expect(pub).toContain('Labor control');
    expect(pub).toContain('HIGH');
    // The Notable Connection DATUM survives too — only the banded sentence above it goes.
    expect(pub).toContain('Mugain and Felix are connected by something neither discusses openly.');
  });
});

describe('THE ONE CALLER — the reader, not the tabs, holds the desk and the gate', () => {
  test('the Overview positions draw through the reader, and go silent as one', () => {
    const drawn = generalDeskLines(SPEAKING, { publicDossier: false, stresses: [] }).overview;
    // Every SPEAKING position the desk owns speaks on this town, so the silence below is a
    // gate rather than a town with nothing to say.
    expect(drawn.siteLines.length, 'ground + market + institutions').toBe(3);
    // DS-GEN-3 GLANCES since owner order 2026-09-17: the reader draws no sentence there even
    // privately, and the six positions around it prove the reader is live.
    expect(drawn.healthLines, 'overview.systemsHealth glances, so no DS-GEN-3 line is drawn').toEqual([]);
    expect(drawn.originLines.length, 'DS-GEN-6 route + tier overlay').toBe(2);
    expect(drawn.warningLines.length, 'DS-GEN-7').toBeGreaterThan(0);
    expect(drawn.conflictLines.filter(Boolean).length, 'DS-GEN-2').toBe(1);
    expect(drawn.situationLine, 'DS-GEN-5').toBeTruthy();
    expect(drawn.connectionLines.length, 'DS-REL-2 both lenses').toBe(2);
    // ⛔ AND IT DRAWS ONLY WHERE THE DATUM IS. A town with no prominent relationship is a
    // town whose ties are level, and the position renders nothing rather than a default.
    const level = { ...SPEAKING, prominentRelationship: null, relationships: undefined };
    expect(generalDeskLines(level, { stresses: [] }).overview.connectionLines).toEqual([]);
    expect(generalDeskLines(level, { stresses: [] }).overview.siteLines.length,
      'the rest of the desk went dark with it').toBe(3);

    const silent = generalDeskLines(SPEAKING, { publicDossier: true, stresses: [] }).overview;
    expect(silent.siteLines).toEqual([]);
    expect(silent.healthLines).toEqual([]);
    expect(silent.originLines).toEqual([]);
    expect(silent.warningLines).toEqual([]);
    expect(silent.conflictLines.filter(Boolean)).toEqual([]);
    expect(silent.situationLine).toBeNull();
    expect(silent.connectionLines).toEqual([]);
  });

  test('DS-GEN-6 fails CLOSED on a town with no food arithmetic (kernel law 5)', () => {
    // The demoted `deficit` dimension has no answer without `metrics.foodBalance`, and an
    // unanswered dimension is UNREADABLE rather than "readable with everything". Silence
    // here is the honest state of an unmeasured town, not a town that feeds itself.
    const unmeasured = { ...SPEAKING, economicViability: { viable: false, metrics: {} } };
    expect(generalDeskLines(unmeasured, { stresses: [] }).overview.originLines).toEqual([]);
    // ...and the rest of the desk is UNAFFECTED, so the line above is the dimension closing
    // and not the whole desk falling over.
    expect(generalDeskLines(unmeasured, { stresses: [] }).overview.siteLines.length).toBe(3);
  });
});

const HERE = dirname(fileURLToPath(import.meta.url));

describe('THE FIXTURE IS SHAPED LIKE A REAL TOWN (the desk law\'s trap 4)', () => {
  test('every field this desk reads carries the shape the real generator writes', () => {
    const real = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrainOverride: 'mountain', tradeRouteAccess: 'road' },
      null,
      { seed: 'sf-test-2026-04', customContent: {} },
    );
    /** @param {unknown} v */
    const shape = (v) => (Array.isArray(v) ? 'array' : v === null ? 'null' : typeof v);
    /** @type {ReadonlyArray<[string, unknown, unknown]>} */
    const pairs = [
      ['config.terrainType', SPEAKING.config.terrainType, real.config?.terrainType],
      ['economicState.prosperity', SPEAKING.economicState.prosperity, real.economicState?.prosperity],
      ['economicState.foodSecurity.label', SPEAKING.economicState.foodSecurity.label, real.economicState?.foodSecurity?.label],
      ['safetyProfile.safetyLabel', SPEAKING.economicState.safetyProfile.safetyLabel, real.economicState?.safetyProfile?.safetyLabel],
      ['economicState.compound.inst', SPEAKING.economicState.compound.inst, real.economicState?.compound?.inst],
      ['defenseProfile.scores', SPEAKING.defenseProfile.scores, real.defenseProfile?.scores],
      ['defenseProfile.readiness.label', SPEAKING.defenseProfile.readiness.label, real.defenseProfile?.readiness?.label],
      ['economicViability.metrics.foodBalance', SPEAKING.economicViability.metrics.foodBalance, real.economicViability?.metrics?.foodBalance],
      ['conflicts', SPEAKING.conflicts, real.conflicts],
      ['institutions', SPEAKING.institutions, real.institutions],
    ];
    for (const [path, mine, theirs] of pairs) {
      expect(shape(theirs), `${path}: the real generator no longer writes this field`).not.toBe('undefined');
      expect(shape(mine), `${path}: the fixture's shape has drifted from the producer's`).toBe(shape(theirs));
    }
    // NON-VACUITY: the comparison really did run against a generated town.
    expect(pairs.length).toBe(10);
    expect(real.name, 'the generator produced no settlement').toBeTruthy();
  });

  test('the ROUTER threads the public condition to every tab this lane draws on', () => {
    const router = readFileSync(join(HERE, '../../src/components/OutputContainer.jsx'), 'utf8');
    expect(router).toContain('const publicDossier = readOnly && !saveId;');
    const overviewCase = router.split('\n').find((l) => l.includes("case 'overview':"));
    expect(overviewCase).toBeTruthy();
    expect(overviewCase).toContain('publicDossier={publicDossier}');
  });
});

/**
 * A record that draws all three HISTORY positions. The event rows carry the shape the real
 * producer writes — a STRING `severity`, a boolean `anchored`, an ARRAY `lastingEffects` —
 * which is not the shape `history.currentTensions[]` uses for the same-named field, and that
 * difference is exactly why DS-GEN-1 stays dark while DS-GEN-9 speaks.
 */
const CHRONICLED = Object.freeze({
  // Four history pins ride this seed — DS-GEN-9's identity and marker, DS-GEN-14 and
  // DS-GEN-16 — and each is computed from it since car 8a-13 rather than transcribed.
  id: 'steinmark', name: 'Steinmark', _seed: 'steinmark-w', tier: 'town',
  history: {
    age: 285,
    historicalCharacter: 'A town that has outlasted its own explanations.',
    founding: {
      reason: 'grew at a strategic mountain pass',
      foundedBy: 'a miller who built a mill',
      initialChallenge: 'poor early harvests',
    },
    historicalEvents: [
      {
        type: 'disaster', name: 'The Great Fire', yearsAgo: 12, anchored: true,
        severity: 'major', lastingEffects: ['The stone ordinance'], description: 'It burned.',
      },
      {
        type: 'political', name: 'The Succession Crisis', yearsAgo: 240, anchored: false,
        severity: 'major', lastingEffects: ['Rival claimants'], description: 'It split.',
      },
    ],
    eventsTimeline: [],
    currentTensions: [],
  },
});

/**
 * The history chapter's four anchors, computed at CHRONICLED's seed.
 *
 * ⚠ THE MARKER'S BAG IS THE DESK'S `markerSlots` AND ITS DIMENSION IS ANSWERED. DS-GEN-9's
 * `event type: *` pools partition themselves by the demoted `anchor` dimension (kernel law 5),
 * so a read that does not answer it is UNREADABLE rather than "readable with everything" — the
 * fixture's marker event carries `anchored: true`. The two timebands are the ladder's own
 * words for this record: `heraldCausalGrammar`'s `a_decade` band at the event's twelve years
 * (predicate `a decade old`, since `a decade on`) and `older_than_bearers` at the town's 285
 * (predicate only — its adverbial column is null, which is why `timeband_since` is absent from
 * the identity bag).
 */
const CHRONICLED_SLOTS = Object.freeze({ settlement: 'Steinmark' });
const MARKER_SLOTS = Object.freeze({
  ...CHRONICLED_SLOTS,
  event: 'The Great Fire', timeband_age: 'a decade old', timeband_since: 'a decade on',
});
/** The `{calamity}` seam's fill, taken from the desk's own reader rather than transcribed. */
const CALAMITY = calamityFill('The Great Fire');
const RECORD_SLOTS = Object.freeze({
  ...CHRONICLED_SLOTS, calamity: CALAMITY, timeband_age: 'a decade old',
});
const {
  IDENTITY, MARKER, FOUNDED, RECORD,
} = drawnMembers({
  IDENTITY: {
    blockId: 'DS-GEN-9',
    poolKey: 'founding',
    slots: { ...CHRONICLED_SLOTS, timeband_age: 'older than its bearers' },
  },
  MARKER: {
    blockId: 'DS-GEN-9',
    poolKey: 'event type: disaster',
    slots: MARKER_SLOTS,
    dimensions: { anchor: 'anchored' },
  },
  FOUNDED: { blockId: 'DS-GEN-14', poolKey: 'FOUNDED-OLD' },
  RECORD: { blockId: 'DS-GEN-16', poolKey: 'ANCHORED-RECENT', slots: RECORD_SLOTS },
}, { leaf: 'general', seed: CHRONICLED._seed, slots: CHRONICLED_SLOTS });

/** @param {boolean} publicDossier */
const renderHistory = (publicDossier) => render(e(HistoryTab, {
  settlement: CHRONICLED, narrativeNote: null, recentEvents: [], onReroll: null,
  publicDossier, playerView: false,
})).container.textContent;

describe('THE HISTORY CHAPTER DRAWS ON THE HISTORY TAB — and is silent for a free viewer', () => {
  test('all three history positions reach the DOM privately and none reach a public dossier', () => {
    const priv = renderHistory(false);
    cleanup();
    const pub = renderHistory(true);
    expectNoSeedFailures(collectSeedFailures([
      [IDENTITY, 'DS-GEN-9 the founding line (history.identity)'],
      [MARKER, 'DS-GEN-9 the marker event (history.identity)'],
      [FOUNDED, 'DS-GEN-14 founded once, grown since (history.founded)'],
      [RECORD, 'DS-GEN-16 what the record carries (history.record)'],
    ], ([sentence, label]) => expectPresentThenAbsent(
      priv, pub, sentence, `the general desk at ${label}`,
    )), 'every history position draws privately and is silent on a public dossier');
  });

  test('the gate takes the corpus sentences ONLY — the record itself survives it', () => {
    const pub = renderHistory(true);
    // The datum the tab has always rendered is untouched: the age, the generator's own
    // character line, and the event rows all still carry their own words.
    expect(pub).toContain('285 years old');
    expect(pub).toContain('A town that has outlasted its own explanations.');
    expect(pub).toContain('Steinmark');
  });

  test('⛔ NO DOUBLED ARTICLE reaches the reader — the {calamity} defect, driven in the DOM', () => {
    // Filling {calamity} with the event name verbatim printed "The The Economic Divide".
    // This is that defect as a rendered-output assertion rather than a note.
    const priv = renderHistory(false);
    expect(priv, 'a doubled article reached the page').not.toMatch(/\bThe The\b/); // anchored: the toContain(RECORD) below proves this same render drew a corpus sentence from the calamity pool
    // ANCHORED: the same render really did draw the record line, so the absence above is the
    // fix holding rather than the block having fallen silent.
    expect(priv).toContain(RECORD);
    // And no unfilled seam survived into the page.
    expect(priv, 'an unfilled slot reached the reader').not.toMatch(/\{[a-z_]+\}/i); // anchored: the toContain(RECORD) two lines up proves the page carries corpus prose at all
    // ⛔ AND THE DEFECT'S REAL SUBJECT IS NOT LEFT TO SEED LUCK (car 8a-13). Only TWO of
    // ANCHORED-RECENT's three wordings name `{calamity}` at all, so which of them the render
    // above happens to draw decides whether the DOM arm touches the seam. Every wording of the
    // pool is therefore filled from the desk's own reader and checked directly — a member
    // appended tomorrow is covered the day it lands.
    const filled = poolMemberTexts({
      leaf: 'general', blockId: 'DS-GEN-16', poolKey: 'ANCHORED-RECENT', slots: RECORD_SLOTS,
    });
    expect(CALAMITY, 'the calamity fill went undefined — the seam would drop, not double')
      .toBe('great fire');
    expectNoSeedFailures(collectSeedFailures(filled, (text) => {
      expect(text, 'a doubled article in a filled seam').not.toMatch(/\b(the|a|an)\s+(the|a|an)\b/i); // anchored: `filled` comes from poolMemberTexts, which throws rather than returning an empty roster, and the toBe on CALAMITY above proves the seam really carried a fill
      expect(text, 'an unfilled seam').not.toMatch(/\{[a-z_]+\}/i); // anchored: same roster, same CALAMITY fill proof two lines up
    }), `every wording of DS-GEN-16 :: ANCHORED-RECENT fills cleanly (${filled.length} of 3)`);
  });

  test('the ROUTER threads publicDossier to the history tab', () => {
    const router = readFileSync(join(HERE, '../../src/components/OutputContainer.jsx'), 'utf8');
    const historyCase = router.split('\n').find((l) => l.includes("case 'history':"));
    expect(historyCase).toBeTruthy();
    expect(historyCase).toContain('publicDossier={publicDossier}');
  });
});

/**
 * DS-GEN-11 on the viability page and DS-HK-1 on the plot-hooks page. Both fixtures carry the
 * CANONICAL paths: the contradiction count at `economicViability.metrics.criticalIssueCount`,
 * which is where the producer writes it and NOT where the corpus title abbreviates it to.
 */
const UNVIABLE = Object.freeze({
  // DS-GEN-11's three lenses ride this seed, and each anchor is computed from it (car 8a-13).
  id: 'steinmark', name: 'Steinmark', _seed: 'steinmark-c',
  economicViability: {
    viable: false,
    summary: '✗ NOT VIABLE: the sums do not close',
    issues: [], warnings: [],
    metrics: {
      criticalIssueCount: 2, tradeAccess: 'road',
      foodBalance: { dailyNeed: 1000, deficit: 400, rawDeficit: 400 },
    },
  },
});

/** DS-GEN-11's three lenses, each read through the same one-slot bag `rung()` hands them. */
const { VERDICT, CONTRADICTIONS, FIRST_SURVEY } = drawnMembers({
  VERDICT: { poolKey: 'viable: false: the arithmetic does not close' },
  CONTRADICTIONS: { poolKey: 'criticalIssueCount: critical contradictions on the record' },
  FIRST_SURVEY: { poolKey: 'THE FIRST-SURVEY QUALIFICATION' },
}, {
  leaf: 'general', blockId: 'DS-GEN-11', seed: UNVIABLE._seed, slots: { settlement: 'Steinmark' },
});

describe('THE VIABILITY VERDICT DRAWS — and is silent for a free viewer', () => {
  test('all three DS-GEN-11 lenses reach the DOM privately and none reach a public dossier', () => {
    const priv = render(e(ViabilityTab, {
      settlement: UNVIABLE, narrativeNote: null, publicDossier: false,
    })).container.textContent;
    cleanup();
    const pub = render(e(ViabilityTab, {
      settlement: UNVIABLE, narrativeNote: null, publicDossier: true,
    })).container.textContent;
    expectNoSeedFailures(collectSeedFailures([
      [VERDICT, 'the verdict'], [CONTRADICTIONS, 'the contradiction count'],
      [FIRST_SURVEY, 'the first-survey caveat'],
    ], ([sentence, label]) => expectPresentThenAbsent(
      priv, pub, sentence, `DS-GEN-11 ${label} (viability.verdict)`,
    )), 'all three DS-GEN-11 lenses draw privately and none reaches a public dossier');
    // The DATUM survives the gate: the headline and the pill keep their own words.
    expect(pub).toContain('NOT COHERENT');
    expect(pub).toContain('2 critical');
  });

  test('the ROUTER threads publicDossier to the viability tab', () => {
    const router = readFileSync(join(HERE, '../../src/components/OutputContainer.jsx'), 'utf8');
    const line = router.split('\n').find((l) => l.includes("case 'viability':"));
    expect(line).toBeTruthy();
    expect(line).toContain('publicDossier={publicDossier}');
  });
});

describe('THE HOOK FRAMING DRAWS — and is silent for a free viewer', () => {
  /**
   * A town whose hooks really do span categories. The framing is derived from the hooks the
   * page itself collects, so this fixture carries the rows `collectPlotHooks` reads.
   */
  const HOOKED = Object.freeze({
    id: 'steinmark', name: 'Steinmark', _seed: 'steinmark',
    npcs: [{ name: 'Mugain', role: 'Reeve', plotHooks: ['A ledger has gone missing from the hall.'] }],
    history: {
      currentTensions: [{
        type: 'crime_wave', description: 'The wharf has its own law.',
        plotHooks: ['Somebody is paying the watch to look the other way.'],
      }],
    },
  });

  test('the framing reaches the DOM privately, is absent publicly, and the hooks keep their own words', () => {
    const priv = render(e(PlotHooksTab, { settlement: HOOKED, publicDossier: false }))
      .container.textContent;
    cleanup();
    const pub = render(e(PlotHooksTab, { settlement: HOOKED, publicDossier: true }))
      .container.textContent;
    // NON-VACUITY: the page really collected hooks, or both halves below are free.
    expect(priv).toContain('Plot hooks');
    expect(priv.length, 'the hooks page rendered nothing').toBeGreaterThan(200);
    // ⛔ THE BLOCK IS THE FRAMING, NEVER THE HOOK PROSE. The hooks themselves are a DATUM and
    // survive the gate; only the corpus framing above them goes.
    expect(pub).toContain('A ledger has gone missing from the hall.');
    // The framing itself: present privately, gone publicly. Derived rather than hardcoded
    // because which categories a fixture reaches is the collector's business, not this
    // test's — but the DIFFERENCE between the two renders is asserted exactly.
    expect(priv.length, 'the public render was not shorter — the gate drew nothing')
      .toBeGreaterThan(pub.length);
    expect(pub, 'an unfilled seam reached a free viewer').not.toMatch(/\{[a-z_]+\}/i); // anchored: the toContain hook-prose assertion above proves the public render is non-empty
  });

  test('the ROUTER threads publicDossier to the plot-hooks tab', () => {
    const router = readFileSync(join(HERE, '../../src/components/OutputContainer.jsx'), 'utf8');
    const line = router.split('\n').find((l) => l.includes("case 'plot_hooks':"));
    expect(line).toBeTruthy();
    expect(line).toContain('publicDossier={publicDossier}');
  });
});

/**
 * DS-GEN-18 on the ECONOMICS page — the fifth tab this desk reaches, and the first that
 * already had a desk of its own. The economy desk keeps its own gate at its own call; this
 * block comes through the GENERAL desk's one caller and carries that reader's gate, which
 * is what ARM 2's one-caller rule buys.
 *
 * ⛔ THE FIXTURE'S STALLED CHAIN IS SHAPED LIKE `computeActiveChains`'s OWN OUTPUT: an
 * `upstreamMissing[]` of CHAIN IDS (never resource names — that is the whole reason
 * `{resource}` is not offered on this key) and a `processingInstitutions[]` that is the
 * MATCHED subset, which is what the generator writes there.
 */
const FORGE = Object.freeze({
  id: 'forge_town', name: 'Forge Town', _seed: 'forge_town',
  economicState: Object.freeze({
    prosperity: 'Modest', isEntrepot: false, primaryImports: [], incomeSources: [],
    activeChains: [{
      chainId: 'smelting', label: 'Smelting', resource: 'Iron ore deposits',
      resourceActive: true, upstreamMissing: ['fuel'],
      processingInstitutions: ['Smelter'], outputs: ['Ingots'],
    }],
  }),
  resourceAnalysis: { exploitation: { fullyExploited: [], partiallyExploited: [], unexploited: [] } },
  history: {},
});

/**
 * DS-GEN-18's STALLED line. ⛔ `{resource}` IS NOT IN THE BAG, and its absence is the desk's
 * own refusal rather than an omission: `upstreamMissing[]` holds CHAIN IDS, so the one variant
 * naming the slot is dropped by anchored liveness and the pool speaks through the other.
 */
const CRAFT = drawnMember({
  leaf: 'general', blockId: 'DS-GEN-18', poolKey: 'STALLED', seed: FORGE._seed,
  slots: { settlement: 'Forge Town', institution: 'Smelter' },
});

describe('DS-GEN-18 DRAWS ON THE ECONOMICS TAB — and is silent for a free viewer', () => {
  // The tab reads the owning campaign's worldState for its live-flow section. The store is
  // module-global, so what this describe sets it to is RESTORED rather than left behind for
  // whichever file vitest runs next in the same worker.
  const campaignsBefore = useStore.getState().campaigns;
  afterEach(() => { useStore.setState({ campaigns: campaignsBefore }); });

  test('the craft-reason line reaches the DOM privately and never reaches a public dossier', () => {
    useStore.setState({ campaigns: [] });
    const priv = render(e(EconomicsTab, {
      economicState: FORGE.economicState, settlement: FORGE, narrativeNote: null,
      saveId: 'forge_town', publicDossier: false, playerView: false,
    })).container.textContent;
    cleanup();
    const pub = render(e(EconomicsTab, {
      economicState: FORGE.economicState, settlement: FORGE, narrativeNote: null,
      saveId: 'forge_town', publicDossier: true, playerView: false,
    })).container.textContent;
    expectPresentThenAbsent(priv, pub, CRAFT, 'DS-GEN-18 the craft reason (economics.craftReason)');
    // ⛔ THE ENGINE TOKEN NEVER REACHES THE READER. `upstreamMissing[]` holds chain ids and
    // the block names none of them; this is that refusal as a rendered-output assertion.
    expect(priv, 'a raw chain id reached the page').not.toContain('fuel —'); // anchored: expectPresentThenAbsent above proves this render carries the corpus sentence
    expect(priv, 'an unfilled seam reached the reader').not.toMatch(/\{[a-z_]+\}/i); // anchored: expectPresentThenAbsent above proves this render carries the corpus sentence
    // ⛔ AND IT IS ABOVE THE FOLD. `Section` renders `{open && children}`, so a line placed
    // inside `Supply Chains` — which is `defaultOpen={false}` — reaches no reader on first
    // paint while every walker stays green. This asserts the sentence renders WITHOUT the
    // section being opened, which is the only way that defect stays fixed.
    expect(priv, 'the corpus line is behind a fold').toContain(CRAFT);
    expect(priv, 'the folded section rendered its own rows — the anchor is wrong')
      .not.toContain('Ingots'); // anchored: the toContain(CRAFT) on the line above proves this same render drew the corpus line
    // The DATUM survives the gate: the supply-chain section keeps its own heading.
    expect(pub).toContain('Supply Chains');
  });

  test('a town with nothing to explain draws NOTHING — the stated silence, in the DOM', () => {
    useStore.setState({ campaigns: [] });
    // No chain row, no exploitation ledger, no entrepôt flag, no imports ⇒ no antecedent
    // holds ⇒ R-DST-K. The tab still renders; only the sentence is absent.
    const bare = {
      ...FORGE,
      economicState: { ...FORGE.economicState, activeChains: [] },
      resourceAnalysis: { exploitation: { fullyExploited: [], partiallyExploited: [], unexploited: [] } },
    };
    const out = render(e(EconomicsTab, {
      economicState: bare.economicState, settlement: bare, narrativeNote: null,
      saveId: 'forge_town', publicDossier: false, playerView: false,
    })).container.textContent;
    expect(out, 'a default sentence was drawn over an empty record').not.toContain(CRAFT); // anchored: the toContain('Modest') below proves the tab really rendered
    // NON-VACUITY: the tab really rendered.
    expect(out).toContain('Modest');
  });

  test('the ROUTER threads publicDossier to the economics tab', () => {
    const router = readFileSync(join(HERE, '../../src/components/OutputContainer.jsx'), 'utf8');
    const line = router.split('\n').find((l) => l.includes("case 'economics':"));
    expect(line).toBeTruthy();
    expect(line).toContain('publicDossier={publicDossier}');
  });
});

/**
 * DS-GEN-8 at `overview.steadings`, drawn inside `SteadingsSection` — the ONE component that
 * resolves the campaign's `spatialLedgers.satellites` ledger, which is why the steading rows
 * are handed to the reader rather than reached for.
 *
 * ⭐ A LAWFUL DARK MOUNT. Every field below is 0 of 48 on a freshly generated town; each has a
 * real writer off the generation path (`settlementLifecycleFirstClass.js` for the grade, the
 * lifecycle kernel for the steadings, `historyGenerator.js` under `ancientRuinsEnabled` for
 * the ruin). The fixture is shaped like `satellitesLedger.js`'s own `SatelliteRecord`.
 */
const FALLEN = Object.freeze({
  // DS-GEN-8's three surfaces — the remnant grade, the ancient ruin and the forced steading —
  // ride this seed, and each anchor is computed from it (car 8a-13). `id` stays `ashfall`
  // because `SteadingsSection` resolves the campaign's satellites ledger by it.
  id: 'ashfall', name: 'Ashfall', _seed: 'ashfall-27',
  lifecycleStatus: 'relic_ruin',
  history: { ancientRuin: { name: 'Ecserys', yearsAgo: 12 } },
});
const LEDGER = Object.freeze([{
  id: 'c-ashfall', settlementIds: ['ashfall'],
  worldState: {
    spatialLedgers: {
      satellites: {
        ashfall: {
          steadings: {
            'steading.a.1': {
              id: 'steading.a.1', name: 'Brackenfold', parentId: 'ashfall', tier: 'thorp',
              population: 40, foundedTick: 12, provenance: 'forced', orbit: 0,
              inflow: 0, backing01: 0.4, history: [],
            },
          },
        },
      },
    },
  },
}]);

/**
 * DS-GEN-8's three surfaces. Each takes its OWN bag, exactly as the desk builds them: the
 * remnant banner rides the base bag, the ruin banner adds the older place's name and the two
 * timebands its twelve years put on the ladder, and each steading card adds its own name.
 */
const { REMNANT, RUIN, STEADING } = drawnMembers({
  REMNANT: { poolKey: 'lifecycleStatus: relic_ruin' },
  RUIN: {
    poolKey: 'history.ancientRuin present',
    slots: {
      settlement: 'Ashfall', ruin: 'Ecserys',
      timeband_since: 'a decade on', timeband_age: 'a decade old',
    },
  },
  STEADING: {
    poolKey: "steading row: provenance: 'forced'",
    slots: { settlement: 'Ashfall', steading: 'Brackenfold' },
  },
}, {
  leaf: 'general', blockId: 'DS-GEN-8', seed: FALLEN._seed, slots: { settlement: 'Ashfall' },
});

describe('DS-GEN-8 DRAWS IN THE STEADINGS SECTION — and is silent for a free viewer', () => {
  const campaignsBefore = useStore.getState().campaigns;
  afterEach(() => { useStore.setState({ campaigns: campaignsBefore }); });

  /** @param {boolean} publicDossier */
  const renderSteadings = (publicDossier) => {
    useStore.setState({ campaigns: LEDGER });
    return render(e(SteadingsSection, { settlement: FALLEN, publicDossier, playerView: false }))
      .container.textContent;
  };

  test('all three surfaces reach the DOM privately and none reaches a public dossier', () => {
    const priv = renderSteadings(false);
    cleanup();
    const pub = renderSteadings(true);
    expectNoSeedFailures(collectSeedFailures([
      [REMNANT, 'the remnant grade'],
      [RUIN, 'the ancient ruin'],
      [STEADING, 'the forced steading'],
    ], ([sentence, label]) => expectPresentThenAbsent(
      priv, pub, sentence, `DS-GEN-8 ${label} (overview.steadings)`,
    )), 'all three DS-GEN-8 surfaces draw privately and none reaches a public dossier');
    // ⛔ THE PRESERVE-VERBATIM CLAUSES SURVIVE. The annex marks two phrases as the
    // never-resolve-a-fate law and the DM's invitation rendered as prose; no variant may
    // drop either, and the section's own authored banner carries them too.
    expect(priv).toContain('fates unresolved');
    expect(priv).toContain('interior is yours');
    // The DATUM survives the gate: the banner, the ruin line and the steading card all keep
    // their own words; only the corpus sentences go.
    expect(pub).toContain('Relic ruin');
    expect(pub).toContain('Ancient ruin nearby');
    expect(pub).toContain('Brackenfold');
    expect(pub).toContain('founded by decree');
  });

  test('a LIVING town with no ledger draws nothing at all — dormancy, not a default', () => {
    useStore.setState({ campaigns: [] });
    const living = { id: 'ashfall', name: 'Ashfall', _seed: 'ashfall', history: {} };
    const { container } = render(e(SteadingsSection, { settlement: living, publicDossier: false }));
    // The section itself renders NOTHING for a world without lifecycle state, which is the
    // component's own contract — so the block cannot draw a default over a living town.
    expect(container.textContent).toBe('');
  });

  test('the OVERVIEW tab hands the section the paid-surface flag', () => {
    const tab = readFileSync(join(HERE, '../../src/components/new/tabs/OverviewTab.jsx'), 'utf8');
    const line = tab.split('\n').find((l) => l.includes('<SteadingsSection'));
    expect(line).toBeTruthy();
    expect(line, 'the section was left to assume the flag').toContain('publicDossier={publicDossier}');
  });
});

/**
 * DS-REL-1 on the RELATIONSHIPS page and DS-POP-3 on the OVERVIEW identity strip.
 *
 * ⛔ THE REL-1 FIXTURE CARRIES BOTH ENDS OF THE ASYMMETRIC TIE. `relationshipType: 'patron'`
 * with `localRelationshipRole: 'client'` is the shape `canonicalRelationship.js` stamps when
 * THIS town is the client, and the two pools say opposite things about which hall decides —
 * so a render that drew the patron line here would be fluent and false.
 */
const LINKED = Object.freeze({
  // DS-REL-1's three pins ride this seed, and so does the arm that the OTHER end's sentence
  // never appears — that one is an exclusion whose anchor is the client-end draw, so it holds
  // only while the client end still draws. All four follow the draw since car 8a-13.
  id: 'steinmark', name: 'Steinmark', _seed: 'steinmark-v', history: {},
  neighbourNetwork: [{
    id: 'n1', name: 'Thornmere', neighbourName: 'Thornmere', neighbourTier: 'town',
    relationshipType: 'patron', localRelationshipRole: 'client',
    description: 'A standing arrangement.',
    npcConnections: [{ primaryNPCName: 'Mugain', neighbourNPCName: 'Felix' }],
  }],
  interSettlementRelationships: [{
    type: 'faction_engagement', factionName: 'The Guild', partnerFactionName: 'The Wardens',
    partnerSettlement: 'Thornmere', relType: 'rival', description: 'Two houses, one quarrel.',
  }],
});

/**
 * DS-REL-1's three drawn lines, plus the WHOLE patron pool as the thing that must not appear.
 *
 * ⭐ THE EXCLUSION IS OVER EVERY MEMBER, NOT ONE OF THEM (car 8a-13). The old pin named a
 * single patron sentence, so a draw that moved — or a wording appended under NEVER TRIM —
 * would have left the arm asserting the absence of a sentence the page was never going to
 * print anyway. `poolMemberTexts` fills all three and the arm refuses all three.
 */
const LINK_SLOTS = Object.freeze({
  settlement: 'Steinmark', counterpart: 'Thornmere', npc: 'Mugain',
});
const { TIE, CONTACTS } = drawnMembers({
  TIE: { poolKey: 'client' },
  CONTACTS: { poolKey: 'cross-settlement NPC contacts' },
}, { leaf: 'general', blockId: 'DS-REL-1', seed: LINKED._seed, slots: LINK_SLOTS });
const ENGAGEMENT = drawnMember({
  leaf: 'general', blockId: 'DS-REL-1', poolKey: 'cross-settlement engagements',
  seed: LINKED._seed,
  slots: { settlement: 'Steinmark', counterpart: 'Thornmere', faction: 'The Guild' },
});
/** Every wording of the OTHER end's standing — none of which may reach this town's page. */
const PATRON_LINES = poolMemberTexts({
  leaf: 'general', blockId: 'DS-REL-1', poolKey: 'patron', slots: LINK_SLOTS,
});

describe('DS-REL-1 DRAWS ON THE RELATIONSHIPS TAB — and is silent for a free viewer', () => {
  const campaignsBefore = useStore.getState().campaigns;
  afterEach(() => { useStore.setState({ campaigns: campaignsBefore }); });

  /** @param {boolean} publicDossier */
  const renderRels = (publicDossier) => {
    useStore.setState({ campaigns: [] });
    return render(e(RelationshipsTab, {
      settlement: LINKED, narrativeNote: null, saveId: 'steinmark',
      viewerIsPremium: false, playerView: false, publicDossier,
    })).container.textContent;
  };

  test('both tie lenses and the engagement reach the DOM privately and none reaches a public dossier', () => {
    const priv = renderRels(false);
    cleanup();
    const pub = renderRels(true);
    expectNoSeedFailures(collectSeedFailures([
      [TIE, 'the standing (this town is the CLIENT)'],
      [CONTACTS, 'the named people'],
      [ENGAGEMENT, 'the cross-settlement engagement'],
    ], ([sentence, label]) => expectPresentThenAbsent(
      priv, pub, sentence, `DS-REL-1 ${label} (relationships.network)`,
    )), 'both tie lenses and the engagement draw privately and none reaches a public dossier');
    // ⛔⛔ THE ARM, DRIVEN IN THE DOM: NO wording of the other end's standing may appear.
    expectNoSeedFailures(collectSeedFailures(PATRON_LINES, (line) => {
      expect(priv, 'the wrong town\'s standing reached the reader').not.toContain(line); // anchored: expectPresentThenAbsent above proves this render drew the CLIENT end of the same tie
    }), `no wording of DS-REL-1 :: patron reaches the client end's page (${PATRON_LINES.length} of 3)`);
    // ⛔ AND THE FAR END'S PERSON IS NEVER NAMED INSIDE THIS TOWN'S WALLS by the corpus line.
    expect(priv.slice(priv.indexOf(CONTACTS), priv.indexOf(CONTACTS) + CONTACTS.length + 90))
      .not.toContain('Felix'); // anchored: the slice is taken around CONTACTS, which expectPresentThenAbsent above proves is present
    // The DATUM survives the gate: the card, the badge and the engagement row keep their own
    // words; only the corpus sentences go.
    expect(pub).toContain('Thornmere');
    expect(pub).toContain('The Guild');
    expect(pub).toContain('Two houses, one quarrel.');
  });

  test('the ROUTER threads publicDossier to BOTH tabs this component serves', () => {
    const router = readFileSync(join(HERE, '../../src/components/OutputContainer.jsx'), 'utf8');
    for (const tab of ['relationships', 'neighbours']) {
      const line = router.split('\n').find((l) => l.includes(`case '${tab}':`));
      expect(line, `no router case for '${tab}'`).toBeTruthy();
      expect(line, `'${tab}' does not receive the flag`).toContain('publicDossier={publicDossier}');
    }
  });
});

/** A town whose ring really carries four readings — the only state DS-POP-3 may speak over. */
const COUNTED = Object.freeze({
  ...SPEAKING,
  populationHistory: [820, 900, 960, 1010],
});
/** DS-POP-3's RISING-OPEN reading, and every wording of the LEVEL default it must not print. */
const DIRECTION = drawnMember({
  leaf: 'general', blockId: 'DS-POP-3', poolKey: 'RISING-OPEN',
  seed: COUNTED._seed, slots: { settlement: 'Steinmark' },
});
const LEVEL_LINES = poolMemberTexts({
  leaf: 'general', blockId: 'DS-POP-3', poolKey: 'LEVEL', slots: { settlement: 'Steinmark' },
});

describe('DS-POP-3 DRAWS ON THE OVERVIEW TAB — and is silent for a free viewer and an unread ring', () => {
  /** @param {object} settlement @param {boolean} publicDossier */
  const renderPop = (settlement, publicDossier) => render(e(OverviewTab, {
    settlement, narrativeNote: null, onNavigateTab: () => {},
    publicDossier, playerView: false, worldState: null,
  })).container.textContent;

  test('the direction reaches the DOM privately and never reaches a public dossier', () => {
    const priv = renderPop(COUNTED, false);
    cleanup();
    const pub = renderPop(COUNTED, true);
    expectPresentThenAbsent(priv, pub, DIRECTION, 'DS-POP-3 (overview.populationDirection)');
    // The DATUM survives: the head count and the access word above it keep their own words.
    expect(pub).toContain('pop.');
    expect(pub).toContain('road');
  });

  test('⛔ AN UNREAD RING DRAWS NOTHING — the default this block would otherwise have been', () => {
    // SPEAKING carries no `populationHistory`, which is every freshly generated town. Keyed
    // on the band's sign alone, LEVEL would fire here and print "the roll holds where it is".
    const out = renderPop(SPEAKING, false);
    expect(out, 'an unread ring drew a direction').not.toContain(DIRECTION); // anchored: the toContain(GROUND) below proves the rest of the desk drew on this very render
    // ⛔ EVERY LEVEL WORDING, not one of them (car 8a-13): the block's whole default pool is
    // refused, so an appended wording is covered the day it lands.
    expectNoSeedFailures(collectSeedFailures(LEVEL_LINES, (line) => {
      expect(out, 'the LEVEL default reached the page').not.toContain(line); // anchored: same render, same GROUND anchor below
    }), `no wording of DS-POP-3 :: LEVEL reaches an unread ring (${LEVEL_LINES.length} of 2)`);
    // NON-VACUITY: the rest of the desk drew on this very render.
    expect(out).toContain(GROUND);
  });
});
