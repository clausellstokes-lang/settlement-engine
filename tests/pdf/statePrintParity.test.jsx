// @vitest-environment node
/**
 * statePrintParity.test.jsx — THE SCREEN↔PRINT PARITY OF THE MOUNTED STATE PROSE.
 *
 * ── WHAT IT GUARDS (owner order "impliment every fix", 2026-09-18) ────────────────────
 * `dossierMounts.js` routes fifty-one SENTENCE-rung positions. The screen drew all of them
 * and the paid PDF drew NONE, which is the estate's oldest law broken in the most expensive
 * place: screen and PDF derive from ONE model. `domain/display/stateProse/printProse.js` is
 * the cure. This lane is what makes it a cure rather than a second surface with its own
 * voice, and it asserts four things:
 *
 *   PARITY      every printed paragraph is CHARACTER FOR CHARACTER the paragraph the screen
 *               weaves for the same position — built here from the screen's OWN desk readers
 *               and `weaveBlock`, never from the builder's output.
 *   EXCLUSION   the print-deferred positions and cells never reach the page, over a fixture
 *               built to LIGHT them (so the arm is not passing on absence).
 *   SILENCE     no corpus ⇒ no Callout. R-DST-K on the page, with a negative control that
 *               proves the renderer can see prose when there is prose.
 *   PURITY      the builder is a function of its inputs: same settlement, same strings.
 *
 * ── WHY IT IS A PARITY LANE AND NOT A GOLDEN ─────────────────────────────────────────
 * A golden would pin the corpus's current wording and red on every authored variant. These
 * arms pin the RELATION — print equals screen — so a re-authored sentence moves both sides
 * together and only a divergence reds. That is the only pin worth having over a corpus whose
 * whole purpose is to keep being written.
 */
import { describe, test, expect, beforeAll } from 'vitest';
import React from 'react';

import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { StateProse } from '../../src/pdf/primitives/StateProse.jsx';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { FaithWar } from '../../src/pdf/sections/FaithWar.jsx';
import { warFaithStateProse } from '../../src/domain/display/stateProse/warFaithStateProse.js';
import { FALL_SENTENCE, faithPanelModel } from '../../src/components/settlement/faithPanelModel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';

// ── THE SCREEN SIDE, assembled from the screen's own parts ───────────────────────────
import { drawnAtMount } from '../../src/domain/display/stateProse/dossierMounts.js';
import { tierNounFor, weaveBlock } from '../../src/domain/display/stateProse/weaveBlock.js';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { economyDeskRead } from '../../src/components/new/economyDeskRead.js';
import {
  defenseCriminalProse, defenseForcesProse, defenseMagicDependencyProse,
  defenseMilitaryStatusProse, defensePostureProse, defenseStateProse,
  defenseSupportingProse, defenseThreatProse, defenseWallRationaleProse,
} from '../../src/domain/display/stateProse/defenseStateProse.js';
import { powerStateProse } from '../../src/domain/display/stateProse/powerStateProse.js';
import { stressorsStateProse } from '../../src/domain/display/stateProse/stressorsStateProse.js';
import { deriveCriminalStructure } from '../../src/domain/display/defenseDisplay.js';
import { deriveAllActiveConditions } from '../../src/domain/activeConditions.js';
import { deriveFoodBalance, deriveGranaryOutlook } from '../../src/domain/display/dossierViewModel.js';
import { populationTrendBand } from '../../src/domain/display/trendLens.js';
import { coupContenders, coupRiskLabel } from '../../src/domain/rulingPowerCoup.js';
import { structuralLensOf } from '../../src/domain/spatial/cohesionWeave.js';
import { collectPlotHooks } from '../../src/domain/dossier/plotHooks.js';
import { deriveEscalationClocks } from '../../src/domain/hookEscalation.js';

/** The positions the ruling withholds from print WHOLE. Written out, not imported: an arm
 *  that imported the builder's own list would agree with it by construction. */
const DEFERRED_MOUNTS = [
  'power.factionLadder', 'power.blocs', 'overview.situation', 'overview.steadings',
  'war.standing', 'war.treaties', 'war.dormantNote',
];

/**
 * THE CELLS THE RULING WITHHOLDS FROM PRINT, transcribed from
 * `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` rather than imported from the builder.
 *
 * ⭐ TWO SPELLINGS OF ONE RULING IS THE POINT. An arm that imported `printProse.js`'s own
 * table would agree with it whatever it said; this one is written from the document the
 * chair ruled on, so the two can disagree — and if they do, the parity arms below red with
 * the offending position named. `angles` absent ⇒ the whole pool; present ⇒ those
 * standpoints only, which is how the doc marks a cell rather than a pool.
 */
const DEFERRED_CELLS = [
  { blockId: 'DS-POW-6', poolKey: 'capture reached an AGENT of a faction' },
  { blockId: 'DS-POW-6', poolKey: 'capture reached a LEADER' },
  { blockId: 'DS-DEF-4', poolKey: 'capture corrupted' },
  { blockId: 'DS-DEF-4', poolKey: 'capture capture' },
  { blockId: 'DS-DEF-6', poolKey: 'Naval Defense: Under blockade', angles: ['unfolding', 'counterforce'] },
  { blockId: 'DS-REL-2', poolKey: 'flagDriven count > 0' },
  { blockId: 'DS-REL-2', poolKey: 'flagDriven count zero' },
];

/** Whether one drawn rung is a cell this document withholds from print. */
function deferredCell(drawn) {
  const p = drawn?.provenance;
  if (!p) return false;
  return DEFERRED_CELLS.some((r) => r.blockId === p.blockId && r.poolKey === p.poolKey
    && (!r.angles || r.angles.includes(String(p.angle || ''))));
}

/**
 * The screen's own read of one position, under the print ruling: route every lens through
 * the registry exactly as the tab does, drop the cells the document withholds, then weave.
 * A position carrying no deferred cell — which is nearly all of them — is the screen's
 * paragraph untouched, so the filter costs the arm nothing where it does not apply.
 */
function screenParagraph(settlement, mount, rungs) {
  const lines = rungs
    .map((rung) => drawnAtMount(mount, rung))
    .filter((drawn) => drawn && !deferredCell(drawn))
    .map((drawn) => drawn.sentence)
    .filter(Boolean);
  return weaveBlock(lines, {
    settlementName: settlement.name, tierNoun: tierNounFor(settlement.tier),
  }).paragraph;
}

/** Weave already-drawn strings (what the desk READERS hand a tab). */
function screenWeave(settlement, lines) {
  return weaveBlock(lines, {
    settlementName: settlement.name, tierNoun: tierNounFor(settlement.tier),
  }).paragraph;
}

const VM_FOR = (s) => buildViewModel({ settlement: s, phase: 'canon', eventLog: [] });
const OPTS = (s) => ({ seed: String(s?._seed ?? s?.id ?? ''), audience: 'dm' });
const PAID = { publicDossier: false, playerView: false };

/**
 * The screen's paragraph for every position the builder is expected to carry, keyed the way
 * the builder keys them. Assembled from the readers and desks the TABS use, so a divergence
 * between this and `buildPrintProse` is a real divergence and not a tautology.
 */
function screenProse(s, faithUnlocked = false) {
  const o = OPTS(s);
  const stresses = (Array.isArray(s.stress) ? s.stress : s.stress ? [s.stress] : []).filter(Boolean);
  const general = generalDeskLines(s, {
    ...PAID,
    stresses,
    populationTrend: populationTrendBand(s.populationHistory),
    hookCategories: collectPlotHooks(s).map((h) => h && h.category),
    clockIds: deriveEscalationClocks(s).map((c) => c && c.id),
    neighbours: Array.isArray(s.neighbourNetwork) ? s.neighbourNetwork : [],
    crossEngagements: [],
  });
  const eco = economyDeskRead(s, {
    ...PAID,
    foodBalance: deriveFoodBalance(s),
    granaryOutlook: deriveGranaryOutlook(s),
    flowDrift: null,
    impairedInstitution: null,
  });
  const st = stressorsStateProse(s, {
    banners: stresses, conditions: deriveAllActiveConditions(s), worldStressor: null,
  }, o);
  const contenders = coupContenders(s);
  const pw = powerStateProse(s, {
    ...(contenders ? { contenders, riskLabel: coupRiskLabel(contenders) } : {}),
    structuralLens: structuralLensOf(s),
  }, o);
  const posture = defensePostureProse(s, o);
  const order = defenseStateProse(s, o);
  const threat = defenseThreatProse(s, o);
  const forces = defenseForcesProse(s, o);
  const status = defenseMilitaryStatusProse(s, o);
  const wall = defenseWallRationaleProse(s, o);
  const supporting = defenseSupportingProse(s, o);
  const criminal = defenseCriminalProse(s, deriveCriminalStructure(s)?.key || null, o);

  /** @type {Record<string, string>} */
  const out = {};
  const set = (mount, p) => { if (p) out[mount] = p; };

  set('overview.ground', screenWeave(s, general.overview.siteLines));
  set('overview.crisisBanners', screenParagraph(s, 'overview.crisisBanners', [st.crisisArity]));
  set('overview.stressorLifecycle', screenParagraph(s, 'overview.stressorLifecycle',
    [st.worldStressorLifecycle, st.worldStressorOrigin]));
  set('overview.activeConditions', screenParagraph(s, 'overview.activeConditions', [
    st.conditionSeverity, st.conditionDirection, st.conditionArchetype,
    st.conditionProvenance, st.conditionDuration,
  ]));
  set('overview.origin', screenWeave(s, general.overview.originLines));
  set('overview.conflicts', screenWeave(s, general.overview.conflictLines));
  set('overview.warnings', screenWeave(s, general.overview.warningLines));
  set('overview.populationDirection', screenWeave(s, [general.overview.populationLine]));

  set('power.legitimacyBanner', screenParagraph(s, 'power.legitimacyBanner',
    [pw.legitimacyBanner, pw.legitimacyLens]));
  set('power.stabilityHeader', screenParagraph(s, 'power.stabilityHeader',
    [pw.stabilityHeader, pw.stabilityLens]));
  // DS-POW-6, the position the ruling gates at the CELL: the ladder cells DS-POW-1 leaves
  // empty print, the two seat-rank pools do not.
  set('power.criminalUnderside', screenParagraph(s, 'power.criminalUnderside',
    [pw.legitimacyReading, pw.captureReading, pw.operationReading]));
  set('power.rulingStructure', screenParagraph(s, 'power.rulingStructure',
    [pw.rulingStructure, pw.governingTitle]));
  set('power.succession', screenParagraph(s, 'power.succession',
    [pw.successionRisk, pw.successionHold]));

  set('defense.postureHeader', screenWeave(s, ['posture', 'terrain', 'prize'].map(
    (k) => (drawnAtMount('defense.postureHeader', posture[k]?.rung)?.sentence ? posture[k].beside : null))));
  set('defense.publicOrder', screenWeave(s, [
    drawnAtMount('defense.publicOrder', order.publicOrder?.rung)?.sentence ? order.publicOrder.beside : null,
    drawnAtMount('defense.publicOrder', order.firstSurvey?.rung)?.sentence ? order.firstSurvey.beside : null,
  ]));
  set('defense.threatAssessment', screenParagraph(s, 'defense.threatAssessment',
    ['beasts', 'invasion', 'internal', 'economic', 'disaster'].map((k) => threat[k])));
  set('defense.militaryStatus', screenParagraph(s, 'defense.militaryStatus',
    ['override', 'viability'].map((k) => status[k])));
  set('defense.armedForces', screenParagraph(s, 'defense.armedForces',
    ['fortification', 'force', 'contracted', 'charter', 'arcane'].map((k) => forces[k])));
  set('defense.wallRationale', screenParagraph(s, 'defense.wallRationale', [wall.rationale]));
  set('defense.criminalStructure', screenParagraph(s, 'defense.criminalStructure',
    ['structure', 'capture'].map((k) => criminal[k])));
  set('defense.supportingCapabilities', screenParagraph(s, 'defense.supportingCapabilities',
    ['logistics', 'naval'].map((k) => supporting[k])));

  set('viability.verdict', screenWeave(s, general.viability.verdictLines));
  set('viability.magicDependency', screenParagraph(s, 'viability.magicDependency',
    [defenseMagicDependencyProse(s, o).arcaneReliance]));

  set('economics.prosperityHeader', screenParagraph(s, 'economics.prosperityHeader', [eco.prosperityHeader]));
  set('economics.foodSecurity', screenParagraph(s, 'economics.foodSecurity', [eco.foodSecurityRung]));
  set('economics.commercialProfile', screenParagraph(s, 'economics.commercialProfile',
    [eco.incomeMix, eco.criminalLine, eco.tradeProfile]));
  set('economics.shadowEconomy', screenParagraph(s, 'economics.shadowEconomy', [eco.shadowEconomy]));
  set('economics.tradeFlow', screenParagraph(s, 'economics.tradeFlow', [eco.tradeFlow]));
  set('economics.exportPosture', screenParagraph(s, 'economics.exportPosture', [eco.exportPosture]));
  set('economics.craftReason', screenWeave(s, [general.economics.craftReasonLine]));

  set('resources.groundAndWorkings', screenParagraph(s, 'resources.groundAndWorkings',
    ['terrainIdentity', 'economicStrengths', 'strategicValue', 'exploitation'].map((k) => eco[k])));
  set('services.catalogStanding', screenParagraph(s, 'services.catalogStanding',
    [eco.catalogStanding, eco.impairedService]));
  set('daily_life.standingOfLiving', screenParagraph(s, 'daily_life.standingOfLiving', [eco.prosperityRung]));

  set('history.identity', screenWeave(s, general.history.identityLines));
  set('history.founded', screenWeave(s, [general.history.foundedLine, general.history.recordLine]));
  set('plot_hooks.framing', screenWeave(s, general.hooks.framingLines.slice(0, 3)));

  // THE FAITH POSITIONS, through the same reading FaithTab hands the desk. `faith.teaser` is
  // the patron-less town's own voice and names no god, so it is NOT behind the premium seam;
  // the two that can name a patron or a creed are.
  const fm = faithPanelModel(s);
  const fa = warFaithStateProse(s, {
    faith: fm,
    hasPatron: !!fm.hasEmbed,
    patronFallCause: fm.patronFallSentence
      ? Object.keys(FALL_SENTENCE).find((c) => FALL_SENTENCE[c] === fm.patronFallSentence)
      : undefined,
  }, o);
  set('faith.teaser', screenParagraph(s, 'faith.teaser', [fa.faithTeaser]));
  if (faithUnlocked) {
    set('faith.patronSeat', screenParagraph(s, 'faith.patronSeat', [
      fa.patronRank, fa.patronCults, fa.devotion, fa.pietyArc,
      fa.standings, fa.sink, fa.mandate, fa.faithDark,
    ]));
    set('faith.creedStanding', screenParagraph(s, 'faith.creedStanding', [
      fa.creedStanding, fa.creedLegitimacy, fa.creedNiche, fa.creedFall,
    ]));
  }
  return out;
}

/** Flatten `{tab: {mount: paragraph}}` to `{mount: paragraph}`. */
function flat(prose) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const rows of Object.values(prose)) Object.assign(out, rows);
  return out;
}

let full;
let sparse;
let captured;

beforeAll(() => {
  // The same fixture the full-document render lane uses, so a divergence here and a crash
  // there have one settlement between them.
  full = normalizeSettlement(generateSettlementPipeline(
    { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' },
    null, { seed: 'pdf-render-town-2026', customContent: {} },
  ));
  // The threadbare pre-canonical save: most desks fall silent, a few still speak.
  sparse = normalizeSettlement({ name: 'Sparse Thorp', tier: 'thorp', population: 40 });
  // A town built to LIGHT the deferred cells — a captured seat (DS-DEF-4 `capture capture`,
  // DS-POW-6 "capture reached a LEADER") over a recognised criminal structure, so the
  // exclusion arm is proved against prose that would otherwise print.
  captured = normalizeSettlement({
    ...full,
    name: 'Captured Vale',
    powerStructure: { ...(full.powerStructure || {}), criminalCaptureState: 'capture' },
    institutions: [
      ...(full.institutions || []),
      { name: 'Thieves Guild', category: 'criminal' },
      { name: 'Smuggling Ring', category: 'criminal' },
    ],
  });
});

describe('the print desk reads the screen\'s own desks', () => {
  test('PARITY: every printed paragraph equals the screen\'s woven paragraph, on a full town', () => {
    const printed = flat(buildPrintProse(full, {}));
    const screen = screenProse(full);
    const drift = Object.entries(printed)
      // TWO EXCLUSIONS, each with a reason rather than a shrug. `relationships.network` is
      // built from lists no caller can lawfully supply yet (see printProse.js's seam note),
      // and `overview.notableConnection` reaches the builder as STRINGS through the general
      // desk reader, so no provenance survives for `deferredCell` to read. Both have their
      // own arms below. ⭐ THE FAITH POSITIONS ARE NO LONGER EXCLUDED: review 4 found them
      // built on every export and reachable on none, and an arm that skipped them is exactly
      // how that went unnoticed.
      .filter(([mount]) => mount !== 'relationships.network'
        && mount !== 'overview.notableConnection')
      .filter(([mount, p]) => screen[mount] !== p)
      .map(([mount, p]) => `${mount}\n  PRINT : ${p}\n  SCREEN: ${screen[mount] ?? '(nothing)'}`);
    expect(drift, `the PDF and the dossier disagree about ${drift.length} position(s)`).toEqual([]);
    // NON-VACUITY: the comparison ran over real prose, not an empty map.
    expect(Object.keys(printed).length).toBeGreaterThan(20);
  });

  test('PARITY: the same holds on a sparse settlement, where most desks are silent', () => {
    const printed = flat(buildPrintProse(sparse, {}));
    const screen = screenProse(sparse);
    const drift = Object.entries(printed)
      .filter(([mount]) => mount !== 'relationships.network'
        && mount !== 'overview.notableConnection')
      .filter(([mount, p]) => screen[mount] !== p)
      .map(([mount, p]) => `${mount}\n  PRINT : ${p}\n  SCREEN: ${screen[mount] ?? '(nothing)'}`);
    expect(drift).toEqual([]);
    // A threadbare record still speaks somewhere and is not silent everywhere: both halves
    // matter, because an all-silent fixture would make the arm above vacuous here.
    expect(Object.keys(printed).length).toBeGreaterThan(0);
    expect(Object.keys(printed).length).toBeLessThan(20);
  });

  test('REACHABILITY: the faith prose renders from a chapter a reader actually gets', () => {
    // ⛔ THE ARM REVIEW 4 FOUND MISSING. The builder composes a faith position for a deity-free
    // town (the common case — the whole review corpus is deity-free), and it used to draw from
    // FaithWar.jsx, which returns null unless `vm.liveWorld` is live AND the export is premium.
    // So the prose was built on every export and reachable on none. These arms hold BOTH ends:
    // the position is built, and the chapter that renders it is one that renders.
    const prose = buildPrintProse(full, {});
    expect(prose.faith?.['faith.teaser'], 'the deity-free town composed no faith position')
      .toBeTruthy();

    // The premium seam: the two deity-naming positions stay behind `faithUnlocked`.
    expect(prose.faith['faith.patronSeat']).toBeUndefined();
    expect(prose.faith['faith.creedStanding']).toBeUndefined();

    // FaithWar draws NOTHING now — proved by its own off-state, which is the state every
    // export without a live campaign is in.
    expect(FaithWar({ settlement: full, narrativeMode: false, vm: { liveWorld: null } }),
      'the live chapter is exactly where the faith prose could not be reached').toBeNull();

    // And chapter 07, which every full variant carries, does render it.
    const chapter = IdentityDailyLife({
      settlement: full, narrativeMode: false, vm: VM_FOR(full), stateProse: prose,
    });
    const texts = [];
    const walk = (node) => {
      if (node == null || typeof node === 'boolean') return;
      if (typeof node === 'string' || typeof node === 'number') { texts.push(String(node)); return; }
      if (Array.isArray(node)) { node.forEach(walk); return; }
      if (typeof node === 'object') {
        if (typeof node.type === 'function') { try { walk(node.type(node.props)); } catch { /* chapter sub-tree */ } return; }
        walk(node.props?.children);
      }
    };
    walk(chapter);
    const joined = texts.join('\u0000');
    expect(joined, 'the faith paragraph did not reach the rendered chapter')
      .toContain(prose.faith['faith.teaser']);
    expect(joined, 'the daily-life paragraph regressed out of the chapter')
      .toContain(prose.daily_life['daily_life.standingOfLiving']);
  });

  test('PURITY: the builder is a function of its inputs', () => {
    expect(buildPrintProse(full, {})).toEqual(buildPrintProse(full, {}));
    expect(buildPrintProse(null, {})).toEqual({});
  });

  test('every printed key is a SENTENCE-rung position that the registry still mounts', () => {
    const printed = flat(buildPrintProse(full, {}));
    const strangers = Object.keys(printed).filter((m) => !drawnAtMount(m, { sentence: 'x' })?.sentence);
    expect(strangers, 'a printed position the registry does not route at the sentence rung').toEqual([]);
  });
});

describe('THE PRINT RULING — the deferred positions and cells never reach the page', () => {
  test('no print-deferred POSITION appears, on any of the three fixtures', () => {
    for (const [label, s] of [['full', full], ['sparse', sparse], ['captured', captured]]) {
      const printed = flat(buildPrintProse(s, {}));
      for (const mount of DEFERRED_MOUNTS) {
        expect(printed[mount], `${mount} printed on the ${label} fixture`).toBeUndefined();
      }
      expect(buildPrintProse(s, {}).war, `a war chapter was built for ${label}`).toBeUndefined();
    }
  });

  test('NON-VACUITY: the deferred CELLS are lit on the captured fixture and still do not print', () => {
    const o = OPTS(captured);
    // The desks draw them — proved here, so the absence below is a refusal and not a silence.
    const criminal = defenseCriminalProse(captured, deriveCriminalStructure(captured)?.key || null, o);
    expect(criminal.capture?.provenance?.poolKey, 'the DS-DEF-4 capture cell did not light')
      .toBe('capture capture');
    expect(criminal.capture?.sentence, 'the DS-DEF-4 capture cell drew no sentence').toBeTruthy();

    const printed = flat(buildPrintProse(captured, {}));
    const structureLine = drawnAtMount('defense.criminalStructure', criminal.structure)?.sentence;
    const captureLine = criminal.capture.sentence;
    if (structureLine) {
      expect(printed['defense.criminalStructure'], 'the structure half is PARITY and must print')
        .toContain(structureLine);
    }
    expect(
      printed['defense.criminalStructure'] || '',
      'the capture-at-capture cell is PRINT-DEFERRED and reached the page',
    ).not.toContain(captureLine);
  });

  test('the DS-REL-2 emergent banner never prints, and the prominent tie may', () => {
    for (const s of [full, sparse, captured]) {
      const line = flat(buildPrintProse(s, {}))['overview.notableConnection'];
      if (line === undefined) continue;
      // The prominent tie is the only lens allowed here, and it exists only where the record
      // carries a `phrasing`; the banner's two pools are keyed off `relationships`.
      expect(s.prominentRelationship?.phrasing, 'a connection line printed with no prominent tie')
        .toBeTruthy();
    }
  });
});

describe('SILENCE — no corpus, no Callout', () => {
  const render = (props) => StateProse(props);

  test('an absent prop, an absent tab and an empty tab all render NOTHING', () => {
    expect(render({ stateProse: null, tab: 'overview' })).toBeNull();
    expect(render({ stateProse: undefined, tab: 'overview' })).toBeNull();
    expect(render({ stateProse: {}, tab: 'overview' })).toBeNull();
    expect(render({ stateProse: { overview: {} }, tab: 'overview' })).toBeNull();
    expect(render({ stateProse: { overview: { 'overview.ground': '' } }, tab: 'overview' })).toBeNull();
    // A settlement with no corpus at all yields no tabs, so every chapter renders nothing.
    for (const tab of ['overview', 'power', 'defense', 'economics', 'history', 'faith', 'war']) {
      expect(render({ stateProse: buildPrintProse(null, {}), tab })).toBeNull();
    }
  });

  test('NON-VACUITY: one paragraph renders exactly one Callout, kicker and all', () => {
    const el = render({
      stateProse: { overview: { 'overview.ground': 'The village keeps to itself.' } },
      tab: 'overview',
    });
    expect(React.isValidElement(el)).toBe(true);
    const callouts = React.Children.toArray(el.props.children);
    expect(callouts).toHaveLength(1);
    expect(callouts[0].props.tone).toBe('gold');
    // THE KICKER IS SENTENCE CASE ON THE PAGE because it is sentence case on screen (the
    // typography lane, 2026-09-18). It is rendered as the Callout's first child rather than
    // through the `kicker` slot, whose `type.label` would upper-case it.
    const [kickerNode, proseNode] = React.Children.toArray(callouts[0].props.children);
    expect(kickerNode.props.children).toBe('The ground and the company it keeps');
    expect(kickerNode.props.style.textTransform, 'the page would shout a heading the screen speaks')
      .toBe('none');
    expect(proseNode.props.children).toBe('The village keeps to itself.');
    expect(proseNode.props.style.fontStyle, 'every screen call site sets italic').toBe('italic');
  });

  test('a chapter renders one Callout per position, in the builder\'s page order', () => {
    const prose = buildPrintProse(full, {});
    for (const [tab, rows] of Object.entries(prose)) {
      const el = render({ stateProse: prose, tab });
      const callouts = React.Children.toArray(el.props.children);
      expect(callouts.map((c) => c.key.replace(/^\.\$/, ''))).toEqual(Object.keys(rows));
    }
  });
});
