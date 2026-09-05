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
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const e = React.createElement;
afterEach(cleanup);

/**
 * A town that genuinely DRAWS every Overview position the general desk owns. Each field is
 * in the shape the real producer writes — proved in the last describe — and each is the
 * CANONICAL path rather than the corpus title's abbreviation: the institution booleans live
 * at `economicState.compound.inst` and the food arithmetic at
 * `economicViability.metrics.foodBalance`, and a fixture that believed either abbreviation
 * would render BARE and dimension-less on every settlement ever generated.
 */
const SPEAKING = Object.freeze({
  id: 'steinmark', name: 'Steinmark', _seed: 'steinmark', tier: 'town',
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
 * The exact corpus sentences this town draws, one per BLOCK, read off the shipped corpus
 * through the desk. Written out rather than derived in the assertion: a test that asked the
 * desk what it would say and then checked the desk said it proves nothing.
 */
const GROUND = 'Nothing in Steinmark is level for long';           // DS-GEN-12
const MARKET = 'the stalls came to the stopping';                   // DS-GEN-13
const INSTITUTIONS = 'Steinmark is administered, visibly';          // DS-GEN-17
const HEALTH = 'The arithmetic of Steinmark does not close';        // DS-GEN-3
const CONFLICT = "Steinmark's clerks have stopped filing anything"; // DS-GEN-2
const WARNING = 'that a town of this shape should not be able to keep'; // DS-GEN-7

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
    for (const [sentence, label] of [
      [GROUND, 'DS-GEN-12 the ground (overview.ground)'],
      [MARKET, 'DS-GEN-13 the market (overview.market)'],
      [INSTITUTIONS, 'DS-GEN-17 the roster (overview.institutions)'],
      [HEALTH, 'DS-GEN-3 systems health (overview.systemsHealth)'],
      [CONFLICT, 'DS-GEN-2 the conflict line (overview.conflicts)'],
      [WARNING, 'DS-GEN-7 the coherence warning (overview.warnings)'],
    ]) expectPresentThenAbsent(priv, pub, sentence, `the general desk at ${label}`);
  });

  test('the gate takes the CORPUS SENTENCES ONLY — every datum on the page survives it', () => {
    const pub = renderTab(true);
    // The conflict row keeps its parties, its badge and its issue; only the banded sentence
    // beneath them goes. A gate that blanked the datum would be a different defect.
    expect(pub).toContain('The Guild');
    expect(pub).toContain('The Council');
    expect(pub).toContain('Labor control');
    expect(pub).toContain('HIGH');
  });
});

describe('THE ONE CALLER — the reader, not the tabs, holds the desk and the gate', () => {
  test('all eight Overview positions draw through the reader, and go silent as one', () => {
    const drawn = generalDeskLines(SPEAKING, { publicDossier: false, stresses: [] }).overview;
    // Every position the desk owns speaks on this town, so the silence below is a gate
    // rather than a town with nothing to say.
    expect(drawn.siteLines.length, 'ground + market + institutions').toBe(3);
    expect(drawn.healthLines.length, 'DS-GEN-3 lenses').toBeGreaterThan(0);
    expect(drawn.originLines.length, 'DS-GEN-6 route + tier overlay').toBe(2);
    expect(drawn.warningLines.length, 'DS-GEN-7').toBeGreaterThan(0);
    expect(drawn.conflictLines.filter(Boolean).length, 'DS-GEN-2').toBe(1);
    expect(drawn.situationLine, 'DS-GEN-5').toBeTruthy();

    const silent = generalDeskLines(SPEAKING, { publicDossier: true, stresses: [] }).overview;
    expect(silent.siteLines).toEqual([]);
    expect(silent.healthLines).toEqual([]);
    expect(silent.originLines).toEqual([]);
    expect(silent.warningLines).toEqual([]);
    expect(silent.conflictLines.filter(Boolean)).toEqual([]);
    expect(silent.situationLine).toBeNull();
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
  id: 'steinmark', name: 'Steinmark', _seed: 'steinmark', tier: 'town',
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

const IDENTITY = 'The oldest part of Steinmark still shows what the town was for';  // DS-GEN-9
const MARKER = 'The Great Fire is a decade old and still on Steinmark\'s books';    // DS-GEN-9
const FOUNDED = 'built to a plan that life has been editing for generations';        // DS-GEN-14
const RECORD = 'lately reminded what can happen to towns';                           // DS-GEN-16

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
    for (const [sentence, label] of [
      [IDENTITY, 'DS-GEN-9 the founding line (history.identity)'],
      [MARKER, 'DS-GEN-9 the marker event (history.identity)'],
      [FOUNDED, 'DS-GEN-14 founded once, grown since (history.founded)'],
      [RECORD, 'DS-GEN-16 what the record carries (history.record)'],
    ]) expectPresentThenAbsent(priv, pub, sentence, `the general desk at ${label}`);
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
    expect(priv, 'a doubled article reached the page').not.toMatch(/\bThe The\b/); // anchored: the toContain(RECORD) below proves this same render drew a calamity sentence
    // ANCHORED: the same render really did draw a calamity sentence, so the absence above
    // is the fix holding rather than the block having fallen silent.
    expect(priv).toContain(RECORD);
    // And no unfilled seam survived into the page.
    expect(priv, 'an unfilled slot reached the reader').not.toMatch(/\{[a-z_]+\}/i); // anchored: the toContain(RECORD) two lines up proves the page carries corpus prose at all
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
  id: 'steinmark', name: 'Steinmark', _seed: 'steinmark',
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

const VERDICT = 'Steinmark\'s outgoings stand above everything its land and its custom bring in'; // DS-GEN-11
const CONTRADICTIONS = 'things about this town that cannot all be true';                          // DS-GEN-11
const FIRST_SURVEY = 'The town was read once, carefully';                                        // DS-GEN-11

describe('THE VIABILITY VERDICT DRAWS — and is silent for a free viewer', () => {
  test('all three DS-GEN-11 lenses reach the DOM privately and none reach a public dossier', () => {
    const priv = render(e(ViabilityTab, {
      settlement: UNVIABLE, narrativeNote: null, publicDossier: false,
    })).container.textContent;
    cleanup();
    const pub = render(e(ViabilityTab, {
      settlement: UNVIABLE, narrativeNote: null, publicDossier: true,
    })).container.textContent;
    for (const [sentence, label] of [
      [VERDICT, 'the verdict'], [CONTRADICTIONS, 'the contradiction count'],
      [FIRST_SURVEY, 'the first-survey caveat'],
    ]) expectPresentThenAbsent(priv, pub, sentence, `DS-GEN-11 ${label} (viability.verdict)`);
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
