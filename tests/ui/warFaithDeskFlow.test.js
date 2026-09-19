/**
 * @vitest-environment jsdom
 *
 * warFaithDeskFlow.test.js — THE WAR & FAITH DESK'S GATE, PROVEN IN THE RENDERED DOM.
 *
 * ⛔ WHY THIS FILE EXISTS. `WarFaithDesk.jsx` gates its one desk call on `publicDossier`
 * and defaults it CLOSED, and until this file NOTHING proved the closed direction. DESK-4
 * cited `tests/ui/warTabFlow.test.js` and `tests/ui/faithTabFlow.test.js` as its enforcers;
 * lane DESK-900-REDS measured that NEITHER HAS EVER EXISTED and withdrew the claim rather
 * than repointing it, leaving the silent-dark half of this desk's gate provably UNPROVED.
 * This is that proof, and it is the file the withdrawn claim should have named.
 *
 * ⛔ AND A WALKER CANNOT REPLACE IT (THE CITATION LAW). The mount registry's reachability
 * arm only checks that a mount id appears as a string literal at exactly ONE site under
 * `src/components`; planting bare literals passes it and lies. Its ARM 3 is a structural
 * claim about where a flag ARRIVES, not a dataflow proof — its own header says so — so a
 * desk whose flag arrives and is then ignored would pass every arm. A mount is real, and a
 * gate is real, only if the rendered DOM says so.
 *
 * ⛔ THE PAID SURFACE (§885.3). `publicDossier` is `readOnly && !saveId` — a free,
 * anonymous gallery viewer — and dossier corpus prose is a PAID surface. Every arm below
 * asserts BOTH DIRECTIONS ON THE SAME SETTLEMENT through `expectPresentThenAbsent`, so it
 * cannot pass vacuously: a fixture that simply had nothing to say fails the liveness half.
 *
 * ⛔ THE FIXTURE'S SHAPE IS THE PRODUCER'S (the desk law's trap 4). Every field below is
 * read back from the shapes `WarTab.jsx` and `FaithTab.jsx` actually hand this desk — the
 * war half from the tab's own `readings.war` literal, the faith half from `faithPanelModel`'s
 * `ranks[].band.label` / `piety` / `cults` slice as the desk's own `FaithPanelView` typedef
 * declares it — and the last describe pins those two call sites so a tab that stops handing
 * the flag over reds here rather than leaking silently.
 */
import React from 'react';
import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  FaithCreedLines, FaithSeatLines, WarStandingLines, WarTreatyLines, warFaithDeskRungs,
} from '../../src/components/new/tabs/WarFaithDesk.jsx';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { DeskLines } from '../../src/components/new/tabs/WarFaithDesk.jsx';
import { legibilityRung } from '../../src/domain/display/stateProse/legibilityRung.js';
import { tierNounFor, weaveBlock } from '../../src/domain/display/stateProse/weaveBlock.js';

const e = React.createElement;
const HERE = dirname(fileURLToPath(import.meta.url));
afterEach(cleanup);

const SETTLEMENT = Object.freeze({ id: 'steinmark', name: 'Steinmark', _seed: 'steinmark' });

/** The war half, in the shape `WarTab.jsx` composes at its one desk call site. */
const WAR_READINGS = Object.freeze({
  settlementId: 'steinmark',
  hasPatron: false,
  war: {
    status: 'at_war',
    exhaustionBand: 'strained',
    postureState: 'mobilizing',
    mobilization: { ticksToDeploy: 2, covert: false },
    occupation: null,
    occupierPosition: null,
    counterpart: { name: 'Dunmarrow' },
    treaties: [{
      victorId: 'steinmark',
      loserId: 'dunmarrow',
      complianceState: 'honored',
      termLines: [{
        family: 'tribute', complianceState: 'honored', yearsRemaining: 9,
        fraying: false, label: 'Tribute',
      }],
    }],
    warBeat: true,
  },
});

/** The faith half, in the slice `faithPanelModel` hands over (the desk's FaithPanelView). */
const FAITH_READINGS = Object.freeze({
  settlementId: 'steinmark',
  hasPatron: true,
  faith: {
    hasEmbed: true,
    live: true,
    patron: { rankAxis: 'major' },
    cults: [{}, {}],
    ranks: [
      { name: 'The Stone Mother', standing: 'ascendant', niche: 'harvest', isPatron: true, band: { label: 'Secure' } },
      { name: 'The Deep Kiln', standing: 'waning', niche: 'craft', isPatron: false, band: { label: 'Contested' } },
    ],
    piety: { band: 'devout', trend: 'rising' },
    unaffiliated: 12,
    contested: false,
    mandate: { phrase: 'the kiln keeps the covenant' },
  },
});

/**
 * The desk at one flag setting. `warFaithDeskRungs` is the ONE gated call site, so driving
 * it here is driving exactly what both tabs drive.
 * @param {object} readings @param {boolean} publicDossier
 */
const deskAt = (readings, publicDossier) => warFaithDeskRungs({
  settlement: SETTLEMENT, readings, publicDossier, playerView: false,
});

/** @param {any} Component @param {object} readings @param {boolean} publicDossier */
const html = (Component, readings, publicDossier) => render(
  e(Component, { desk: deskAt(readings, publicDossier) }),
).container.innerHTML;

describe('the war & faith desk goes dark on a free anonymous dossier', () => {
  test('the WAR positions reach the DOM privately and none of them reaches a public dossier', () => {
    const desk = deskAt(WAR_READINGS, false);
    // LIVENESS FIRST, at the source: the fixture really does make this desk speak, so the
    // absences below are the gate closing rather than a desk that never opened.
    expect(desk.warStatus?.sentence, 'the war fixture drew no standing sentence').toBeTruthy();
    expect(desk.treatyDocument?.sentence, 'the war fixture drew no document sentence').toBeTruthy();

    for (const [Component, rung, label] of /** @type {const} */ ([
      [WarStandingLines, desk.warStatus, 'war.standing (DS-WAR-1 the martial record)'],
      [WarTreatyLines, desk.treatyDocument, 'war.treaties (DS-WAR-2 the document lens)'],
      [WarTreatyLines, desk.treatyTerm, 'war.treaties (DS-WAR-2 the clause lens)'],
    ])) {
      expectPresentThenAbsent(
        html(Component, WAR_READINGS, false),
        html(Component, WAR_READINGS, true),
        rung.sentence,
        `the war & faith desk at ${label}`,
      );
    }
  });

  test('the FAITH positions reach the DOM privately and none of them reaches a public dossier', () => {
    const desk = deskAt(FAITH_READINGS, false);
    expect(desk.devotion?.sentence, 'the faith fixture drew no devotion sentence').toBeTruthy();
    expect(desk.creedStanding?.sentence, 'the faith fixture drew no creed sentence').toBeTruthy();

    for (const [Component, rung, label] of /** @type {const} */ ([
      [FaithSeatLines, desk.devotion, 'faith.patronSeat (DS-FTH-1 the devotion lens)'],
      [FaithSeatLines, desk.standings, 'faith.patronSeat (DS-FTH-1 the standings lens)'],
      [FaithCreedLines, desk.creedStanding, 'faith.creedStanding (DS-FTH-3)'],
    ])) {
      expectPresentThenAbsent(
        html(Component, FAITH_READINGS, false),
        html(Component, FAITH_READINGS, true),
        rung.sentence,
        `the war & faith desk at ${label}`,
      );
    }
  });

  test('⛔ SILENT-DARK: with the gate closed the desk renders NO NODE AT ALL, not an empty frame', () => {
    // R-DST-K: an unmounted or ungated position renders nothing, never a hollow container.
    // Checked on the CONTAINER rather than on the text, because a `<div data-testid>` with
    // no children is still a byte the corpus paid for.
    for (const readings of [WAR_READINGS, FAITH_READINGS]) {
      for (const Component of [WarStandingLines, WarTreatyLines, FaithSeatLines, FaithCreedLines]) {
        expect(html(Component, readings, true), 'a gated position rendered a frame').toBe('');
      }
    }
    // NON-VACUITY: the same four components DO render on the open side for at least one of
    // the two fixtures, so the emptiness above is the gate and not the components.
    const drawn = [WarStandingLines, WarTreatyLines, FaithSeatLines, FaithCreedLines]
      .filter((C) => html(C, WAR_READINGS, false) !== '' || html(C, FAITH_READINGS, false) !== '');
    expect(drawn.length, 'no component drew on either fixture — the arm above proves nothing').toBe(4);
  });

  test('the desk returns its declared SILENT shape rather than an empty object when gated', () => {
    // The gate hands back a frozen all-null record with EVERY key the desk can return, so a
    // component reading `desk.<anything>` gets null instead of `undefined` from a bare `{}`.
    const gated = deskAt(WAR_READINGS, true);
    const open = deskAt(WAR_READINGS, false);
    expect(Object.keys(gated).sort()).toEqual(Object.keys(open).sort());
    expect(Object.values(gated).every((v) => v === null), 'a gated key carried a value').toBe(true);
    expect(Object.values(open).some((v) => v !== null), 'the open side carried nothing').toBe(true);
  });
});

describe('both host tabs hand the desk the paid-surface flag', () => {
  const read = (rel) => readFileSync(join(HERE, '../../src/components/new/tabs/', rel), 'utf8');

  for (const tab of ['WarTab.jsx', 'FaithTab.jsx']) {
    test(`${tab} RECEIVES publicDossier and hands it to the desk`, () => {
      const source = read(tab);
      expect(source, `${tab} does not receive the flag`).toMatch(/publicDossier\s*=\s*false\s*[,}]/);
      const call = source.slice(source.indexOf('warFaithDeskRungs({'));
      expect(call, `${tab} calls the desk without the flag`).toBeTruthy();
      expect(call.slice(0, 400)).toContain('publicDossier');
    });
  }

  /**
   * ⭐ THE TWO NAME PROPS REACH THIS DESK'S POSITIONS (the weave's last car, 2026-09-18).
   *
   * `DeskLines` weaves unconditionally, but it can only stand a REPEATED opening settlement
   * name down when the wrapper hands it `settlementName` and `tier` — and for one landing no
   * wrapper did, because both host tabs belonged to other lanes. A dropped prop is INVISIBLE
   * to every other arm here: the paragraph still renders and every sentence is still in it.
   *
   * ⛔ THE RUNGS ARE HAND-BUILT ON PURPOSE, and it is the lawful idiom rather than a shortcut
   * (`dossierMountRegistry.walker.test.js:640` hands the registry's reader the same shape).
   * WHICH variant a pool draws is a function of the seed, and on this file's fixture no
   * position happens to draw a second lens that OPENS on the name — so an arm built from the
   * corpus would prove nothing today and would start proving something on a seed nobody chose.
   * Two rungs whose sentences are the test's own make the claim exact and seed-free: this
   * renderer, at this mount, stands the second opening down. `war.standing` is a SENTENCE row
   * in the registry, so `drawnAtMount` passes both rungs through.
   */
  test('DeskLines stands a repeated opening name down when the wrapper hands it the settlement', () => {
    const line = (text) => legibilityRung('', { blockId: 'DS-WAR-1', poolKey: 'test', angle: 'plain', text }, []);
    const rungs = [
      line('Steinmark is at war in the way a town can be at war without seeing any.'),
      line('Steinmark carries a light mark from its fighting and is very nearly clear of it.'),
    ];
    const town = { ...SETTLEMENT, tier: 'town' };
    const withName = render(e(DeskLines, {
      mount: 'war.standing', rungs, settlementName: town.name, tier: town.tier,
    })).container.textContent;
    cleanup();
    // ONE paragraph, and the SECOND opening stood down — the whole claim, in the DOM.
    expect(withName).toBe(weaveBlock(rungs.map((r) => r.sentence), {
      settlementName: town.name, tierNoun: tierNounFor(town.tier),
    }).paragraph);
    expect(withName).toContain('The town carries a light mark');
    // …and the FIRST sentence keeps its name, so the paragraph still says who it is about.
    expect(withName).toContain('Steinmark is at war');
    // WITHOUT the props the same rungs still WEAVE and simply do not stand down — which is
    // exactly the invisible failure this arm exists to catch, pinned from both sides.
    const without = render(e(DeskLines, { mount: 'war.standing', rungs })).container.textContent;
    expect(without).toContain('Steinmark carries a light mark');
  });

  test('…and every wrapper hands its settlement through, at every mount', () => {
    // STRUCTURAL, per position: each wrapper is rendered with a real desk AND a settlement, and
    // its paragraph is compared against the weave of its own drawn lines. This fires whether or
    // not a stand-down is available on the fixture, which the arm above cannot.
    const town = { ...SETTLEMENT, tier: 'town' };
    const war = deskAt(WAR_READINGS, false);
    const faith = deskAt(FAITH_READINGS, false);
    /** @type {Array<[string, any, object, string[]]>} */
    const positions = [
      ['war.standing', WarStandingLines, war, ['warStatus', 'warExhaustion', 'warMobilization', 'warOccupation', 'warHoldings']],
      ['war.treaties', WarTreatyLines, war, ['treatyTerm', 'treatyFraying', 'treatyDocument']],
      ['faith.patronSeat', FaithSeatLines, faith, ['patronRank', 'patronCults', 'devotion', 'pietyArc', 'standings', 'sink', 'mandate', 'faithDark']],
      ['faith.creedStanding', FaithCreedLines, faith, ['creedStanding', 'creedLegitimacy', 'creedNiche', 'creedFall']],
    ];
    let judged = 0;
    for (const [mount, Component, desk, keys] of positions) {
      const lines = keys.map((k) => desk[k]?.sentence).filter(Boolean);
      if (lines.length === 0) continue; // R-DST-K
      judged += 1;
      const woven = weaveBlock(lines, {
        settlementName: town.name, tierNoun: tierNounFor(town.tier),
      }).paragraph;
      const text = render(e(Component, { desk, settlement: town })).container.textContent;
      cleanup();
      expect(text, `${mount}: the wrapper does not render the paragraph the weave produces`).toBe(woven);
    }
    expect(judged, 'no position spoke on these fixtures, so the arm judged nothing').toBe(4);
  });

  test('the ROUTER threads publicDossier to both host tabs', () => {
    const router = readFileSync(join(HERE, '../../src/components/OutputContainer.jsx'), 'utf8');
    for (const tab of ['war', 'faith']) {
      const line = router.split('\n').find((l) => l.includes(`case '${tab}':`));
      expect(line, `the router has no case for '${tab}'`).toBeTruthy();
      expect(line).toContain('publicDossier={publicDossier}');
    }
  });
});

/**
 * ── ⭐⭐ THE NAME THREAD, PROVEN AT EVERY WRAPPER (review 10, 2026-09-18) ────────────────
 *
 * The two arms above are each half a proof. The first drives `DeskLines` DIRECTLY, so it says
 * nothing about whether the five WRAPPERS hand the settlement over; the second drives the
 * wrappers but compares the DOM against `weaveBlock`'s own output — and on this fixture two of
 * the four positions draw a single line, for which `weaveBlock` returns the line verbatim with
 * the props or without them. Review 10 measured the result as vacuous at nine of ten sites
 * across the two renderers.
 *
 * These arms put a HAND-BUILT two-line block through each wrapper, so the claim is the one
 * that matters — the wrapper's `settlement` prop reaches the renderer — and a dropped prop
 * puts the raw name-opening sentence in the DOM.
 */
describe('the wrappers thread the settlement, non-vacuously at every speaking position', () => {
  const TOWN = Object.freeze({ ...SETTLEMENT, tier: 'town' });
  const line = (blockId, text) => legibilityRung('', { blockId, poolKey: 'hand-built', angle: 'plain', text }, []);

  const OPENER = `${TOWN.name} keeps its gate shut after dark.`;
  const REPEAT = `${TOWN.name} pays for that watch out of the market dues.`;
  const STOOD_DOWN = `The ${TOWN.tier} pays for that watch out of the market dues.`;

  /** [mount, blockId, the two desk keys the wrapper reads first, the wrapper]. */
  const WRAPPERS = [
    ['war.standing', 'DS-WAR-1', ['warStatus', 'warExhaustion'], WarStandingLines],
    ['war.treaties', 'DS-WAR-2', ['treatyTerm', 'treatyFraying'], WarTreatyLines],
    ['faith.patronSeat', 'DS-FTH-1', ['patronRank', 'patronCults'], FaithSeatLines],
    ['faith.creedStanding', 'DS-FTH-3', ['creedStanding', 'creedLegitimacy'], FaithCreedLines],
  ];

  /**
   * ⚠ A PLAIN TEST LOOPING OVER THE ROWS, NEVER `test.each` — the sovereignty lighting
   * walker's own prescription, and the idiom every other arm in this file already uses. An
   * `each` call would park this file on the each-family debt, whose ceiling is frozen and
   * may only shrink. Every `expect` below names its mount, so a red still says which.
   */
  test('every speaking wrapper hands the settlement through, and the second opening stands down', () => {
    let judged = 0;
    for (const [mount, blockId, keys, Wrapper] of WRAPPERS) {
    judged += 1;
    const rungs = [line(blockId, OPENER), line(blockId, REPEAT)];
    const desk = { [keys[0]]: rungs[0], [keys[1]]: rungs[1] };

    // THE LIVENESS ANCHOR IS THE SAME RENDERER WITHOUT THE PROPS — what every one of these
    // wrappers produced before the thread landed. It proves the raw sentence is reachable at
    // this mount, so its absence below is the stand-down rather than a position gone dark.
    const unthreaded = render(e(DeskLines, { mount, rungs })).container.textContent;
    cleanup();
    expect(unthreaded, `${mount}: the bare renderer drew nothing, so the anchor is dead`)
      .toContain(OPENER);

    const text = render(e(Wrapper, { desk, settlement: TOWN })).container.textContent;
    cleanup();
    expectPresentThenAbsent(unthreaded, text, REPEAT, `${mount}: the raw name-opening sentence`);
    expect(text, `${mount}: the tier-noun stand-down is not on the page`).toContain(STOOD_DOWN);
    expect(text, `${mount}: the opening sentence lost its name`).toContain(OPENER);
    expect(text, `${mount}: the position did not render the woven paragraph`)
      .toBe(weaveBlock([OPENER, REPEAT], {
        settlementName: TOWN.name, tierNoun: tierNounFor(TOWN.tier),
      }).paragraph);
    }
    expect(judged, 'the wrapper table emptied, so the loop judged nothing').toBe(4);
  });

  test('faith.teaser is INERT by construction, and that is measured rather than assumed', () => {
    // `FaithTeaserLines` passes `rungs={[desk.faithTeaser]}` — ONE rung — and `weaveBlock`
    // returns a lone line verbatim, so no rung list can make `settlementName`/`tier` change a
    // character there. No behavioural arm is possible at this position; the structural claim
    // (the prop is passed) is the whole of what can be held, and this is it.
    const source = readFileSync(join(HERE, '../../src/components/new/tabs/WarFaithDesk.jsx'), 'utf8');
    const teaser = source.slice(source.indexOf('export function FaithTeaserLines'));
    expect(teaser.slice(0, 400)).toContain('rungs={[desk.faithTeaser]}');
    expect(teaser.slice(0, 400)).toContain('settlementName={settlement?.name}');
    expect(weaveBlock([REPEAT], { settlementName: TOWN.name, tierNoun: tierNounFor(TOWN.tier) }).paragraph)
      .toBe(REPEAT);
    // ANCHOR: two lines DO stand down, so the identity above is the one-line rule rather than
    // the weave having stopped working.
    expect(weaveBlock([OPENER, REPEAT], { settlementName: TOWN.name, tierNoun: tierNounFor(TOWN.tier) }).paragraph)
      .toContain(STOOD_DOWN);
  });
});
