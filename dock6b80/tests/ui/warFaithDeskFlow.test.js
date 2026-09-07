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

  test('the ROUTER threads publicDossier to both host tabs', () => {
    const router = readFileSync(join(HERE, '../../src/components/OutputContainer.jsx'), 'utf8');
    for (const tab of ['war', 'faith']) {
      const line = router.split('\n').find((l) => l.includes(`case '${tab}':`));
      expect(line, `the router has no case for '${tab}'`).toBeTruthy();
      expect(line).toContain('publicDossier={publicDossier}');
    }
  });
});
