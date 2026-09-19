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
import { PDF_VARIANTS } from '../../src/pdf/variants.js';
import { buildPdfLiveWorld } from '../../src/pdf/lib/liveWorld.js';
import { StateProse } from '../../src/pdf/primitives/StateProse.jsx';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { FaithWar } from '../../src/pdf/sections/FaithWar.jsx';
import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { warFaithStateProse } from '../../src/domain/display/stateProse/warFaithStateProse.js';
import { FALL_SENTENCE, faithPanelModel } from '../../src/components/settlement/faithPanelModel.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';

// ── THE SCREEN SIDE, assembled from the screen's own parts ───────────────────────────
import { drawnAtMount } from '../../src/domain/display/stateProse/dossierMounts.js';
import { tierNounFor, weaveBlock } from '../../src/domain/display/stateProse/weaveBlock.js';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { economyDeskRead } from '../../src/components/new/economyDeskRead.js';
import { relationshipsDeskLists } from '../../src/components/new/relationshipsDeskRead.js';
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

/**
 * Every text leaf of a react-pdf element tree, with each chapter EXECUTED.
 *
 * ⭐ THE TREE, NEVER THE BYTES — the estate's own recorded law for this question
 * (`tests/pdf/pdfFieldManifest.walker.test.js`: "renders the REAL SettlementPDF viewmodel
 * tree, walks it (NO PDF bytes — react-pdf renderToBuffer is non-deterministic at the byte
 * level; we execute the plain hook-free section functions and read the element tree)").
 * Every chapter is a plain function of its props, so executing one is rendering it.
 *
 * ⛔ IT DOES NOT SWALLOW. An earlier copy of this walker caught and ignored a throwing
 * chapter, which is how a chapter that crashed would have looked exactly like a chapter that
 * printed nothing. A chapter that throws fails the arm that walked it.
 * @param {unknown} node @param {string[]} [out]
 */
function textLeaves(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { node.forEach((n) => textLeaves(n, out)); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return textLeaves(node.type(node.props), out);
    return textLeaves(node.props?.children, out);
  }
  return out;
}

/** How many text leaves of a WHOLE rendered document carry this paragraph. */
function copiesInDocument(props, paragraph) {
  const leaves = textLeaves(SettlementPDF(props));
  expect(leaves.length, 'the document rendered no text at all, so counting proves nothing')
    .toBeGreaterThan(50);
  return leaves.filter((t) => t.includes(paragraph)).length;
}

/** The patron fixture's deity. Named once: both faith arms ask about this exact string. */
const DEITY_NAME = 'The Iron Lord';

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
    // ⭐ THE REAL ASSEMBLER, NOT A STUB (ODQ §934.9). This used to hand the desk
    // `s.neighbourNetwork` and an EMPTY engagement list, which is the shape the tab never
    // uses — so even once the print side lit, the comparison would have been print-versus-
    // a-third-thing. `RelationshipsTab.jsx` and `printProse.js` both call this exact
    // function, so the screen side here is the screen's own derivation.
    ...relationshipsDeskLists(s),
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

  // DS-REL-1. The screen renders each inner pair beside its own neighbour card and each
  // engagement line beside its own conflict row; print has no cards, so the position is one
  // paragraph in the desk's own order — flattened here exactly as `RelationshipsTab.jsx`
  // reads it and exactly as the builder writes it.
  set('relationships.network', screenWeave(s, [
    ...general.relationships.networkLines.flat(),
    ...general.relationships.engagementLines,
  ]));

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
let patron;
let linked;

/**
 * ⭐⭐ THE SAVED WORLD — the ONLY shape `relationships.network` can draw on, and the reason
 * this fixture is hand-built rather than generated (ODQ §934.9).
 *
 * `neighbourNetwork`, `interSettlementRelationships` and `crossSettlementConflicts` are all
 * written at SAVE time — by `src/lib/saves.js`, the neighbour back-link, the link / undo /
 * import paths — and NEVER by the generation pipeline. Every other fixture in this file is a
 * generated town, so all three lists are empty on them and DS-REL-1 is silent: an arm using
 * `full` would pass whether the position printed or not, which is exactly the vacuity the
 * position's old blanket exclusion hid. This record carries all three POPULATED, so the arm
 * below can only pass on prose that actually drew.
 *
 * The rows are the shape `tests/ui/generalDeskTabFlow.test.js` already drives the screen
 * side of DS-REL-1 with, plus a `crossSettlementConflicts` row that fixture does not carry —
 * the inbound-legacy list, which nothing in the estate writes any more and every reader
 * still merges.
 */
const LINK_ROWS = Object.freeze({
  neighbourNetwork: Object.freeze([Object.freeze({
    id: 'n1', name: 'Thornmere', neighbourName: 'Thornmere', neighbourTier: 'town',
    relationshipType: 'patron', localRelationshipRole: 'client',
    description: 'A standing arrangement.',
    npcConnections: Object.freeze([Object.freeze({ primaryNPCName: 'Mugain', neighbourNPCName: 'Felix' })]),
  })]),
  interSettlementRelationships: Object.freeze([Object.freeze({
    type: 'faction_engagement', factionName: 'The Guild', partnerFactionName: 'The Wardens',
    partnerSettlement: 'Thornmere', relType: 'rival', description: 'Two houses, one quarrel.',
  })]),
  // TWO ROWS, and the pair is the point. DS-REL-1's engagement lens speaks for
  // `faction_engagement` ONLY (`generalStateProse.js:1531` returns no pool for anything
  // else), so the first row draws and the second is a realistic legacy row that draws
  // nothing — which is what lets the arm below tell "the list is merged" from "the list is
  // merged and everything in it is shouted".
  crossSettlementConflicts: Object.freeze([
    Object.freeze({
      type: 'faction_engagement', factionName: 'The Ledger', partnerFactionName: 'The Hollow',
      partnerSettlement: 'Thornmere', relType: 'rival',
      description: 'An older quarrel nobody has closed.',
    }),
    Object.freeze({
      type: 'conflict', factionName: 'The Ledger', partnerSettlement: 'Ashfen', relType: 'rival',
      conflictNature: 'market boundary dispute',
      description: 'A border nobody ever surveyed.',
    }),
  ]),
});

beforeAll(() => {
  // The same fixture the full-document render lane uses, so a divergence here and a crash
  // there have one settlement between them.
  full = normalizeSettlement(generateSettlementPipeline(
    { settType: 'town', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'road' },
    null, { seed: 'pdf-render-town-2026', customContent: {} },
  ));
  // The threadbare pre-canonical save: most desks fall silent, a few still speak.
  sparse = normalizeSettlement({ name: 'Sparse Thorp', tier: 'thorp', population: 40 });
  // ⭐ A PATRON TOWN — the only shape the two deity-naming faith positions can draw on, and
  // therefore the only fixture that can tell the premium seam from a silence. The deity-free
  // `full` fixture draws `faith.teaser` and nothing else, so an arm using it would have
  // proved nothing about `faithUnlocked` at all (review 5).
  patron = normalizeSettlement({
    ...full,
    name: 'Patronhold',
    config: {
      ...(full.config || {}),
      primaryDeitySnapshot: {
        name: DEITY_NAME, rankAxis: 'major', alignmentAxis: 'neutral',
        temperamentAxis: 'warlike', domain: 'war',
      },
    },
  });

  // A town built to LIGHT the deferred cells — a captured seat (DS-DEF-4 `capture capture`,
  // DS-POW-6 "capture reached a LEADER") over a recognised criminal structure, so the
  // exclusion arm is proved against prose that would otherwise print.
  // The same town after it has been SAVED and LINKED to a neighbour — see LINK_ROWS.
  linked = normalizeSettlement({ ...full, name: 'Steinmark', ...LINK_ROWS });

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
      // ONE EXCLUSION, with a reason rather than a shrug: `overview.notableConnection`
      // reaches the builder as STRINGS through the general desk reader, so no provenance
      // survives for `deferredCell` to read. It has its own arm below. ⭐ THE FAITH
      // POSITIONS ARE NOT EXCLUDED: review 4 found them built on every export and reachable
      // on none, and an arm that skipped them is exactly how that went unnoticed.
      // ⭐⭐ AND `relationships.network` IS NO LONGER EXCLUDED EITHER (ODQ §934.9). It was,
      // because it was "built from lists no caller can lawfully supply yet" — the builder
      // now calls the same assembler the tab does, so the position is compared like every
      // other one. This fixture is a GENERATED town, so it proves the position does not
      // DRIFT; the saved-world arm below is what proves it PRINTS.
      .filter(([mount]) => mount !== 'overview.notableConnection')
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
      .filter(([mount]) => mount !== 'overview.notableConnection')
      .filter(([mount, p]) => screen[mount] !== p)
      .map(([mount, p]) => `${mount}\n  PRINT : ${p}\n  SCREEN: ${screen[mount] ?? '(nothing)'}`);
    expect(drift).toEqual([]);
    // A threadbare record still speaks somewhere and is not silent everywhere: both halves
    // matter, because an all-silent fixture would make the arm above vacuous here.
    expect(Object.keys(printed).length).toBeGreaterThan(0);
    expect(Object.keys(printed).length).toBeLessThan(20);
  });

  test('PARITY: `relationships.network` PRINTS on a saved, linked world and equals the screen', () => {
    // ⛔ NON-VACUITY FIRST, AND IT IS THE WHOLE ARM. A GENERATED world carries none of the
    // three save-time lists, so this position is silent on every other fixture in this file
    // and an arm built on one of them would pass whether the mount printed or not — which is
    // precisely what the position's old blanket exclusion was hiding. Prove the fixture still
    // carries all three AFTER normalization before asking what it printed.
    expect(linked.neighbourNetwork, 'the saved fixture lost its neighbour network')
      .toHaveLength(1);
    expect(linked.interSettlementRelationships, 'the saved fixture lost its faction engagement')
      .toHaveLength(1);
    expect(linked.crossSettlementConflicts, 'the saved fixture lost its legacy rows')
      .toHaveLength(2);

    const paragraph = flat(buildPrintProse(linked, {}))['relationships.network'];
    expect(paragraph, 'the paid PDF printed NOTHING at relationships.network on a linked world')
      .toBeTruthy();
    expect(paragraph.length, 'the position printed an empty paragraph').toBeGreaterThan(40);

    // THE PARITY ITSELF: character for character what the dossier weaves for this position,
    // from the screen's own desk reader and the same assembler the tab calls.
    expect(paragraph).toBe(screenProse(linked)['relationships.network']);

    // THE CONTROL THAT MAKES THE ASSERTION ABOUT THE LISTS RATHER THAN THE BUILDER: the same
    // builder, the same town, no link rows — and the position is absent rather than empty
    // (R-DST-K). A regression that lit the mount unconditionally would red here.
    expect(flat(buildPrintProse(full, {}))['relationships.network'],
      'a generated town with no links still printed a neighbour standing').toBeUndefined();
  });

  test('all three save-time lists reach the printed paragraph, each proved by its own removal', () => {
    const at = (s) => flat(buildPrintProse(s, {}))['relationships.network'] || '';
    const whole = at(linked);
    expect(whole, 'the whole-fixture paragraph is the control and it did not draw').toBeTruthy();

    // ⭐ ONE REMOVAL AT A TIME, because a fixture that only proved the UNION would pass with
    // two of the three lists dead. `crossSettlementConflicts` is the one that matters most
    // here: nothing in the estate writes it any more, every reader still merges it, and a
    // cure that quietly dropped it would be invisible to a union arm.
    for (const key of ['neighbourNetwork', 'interSettlementRelationships', 'crossSettlementConflicts']) {
      const without = at(normalizeSettlement({ ...linked, [key]: [] }));
      expect(without, `dropping ${key} did not move the printed paragraph, so it contributes nothing`)
        .not.toBe(whole);
    }

    // ⛔ AND THE MERGE DOES NOT PROMOTE WHAT THE CORPUS DOES NOT SPEAK FOR. The legacy list's
    // second row is `type: 'conflict'`, whose partner is a settlement named NOWHERE else in
    // the fixture — DS-REL-1 has no pool for it, so its counterpart must not reach the page,
    // while the faction engagement beside it must. Anchored on the counterpart both typed
    // engagements share, so an empty paragraph cannot satisfy the absence.
    expectAbsentWithAnchor(whole, 'Ashfen', 'Thornmere',
      'DS-REL-1 speaks for faction engagements: a conflict-typed row draws no sentence');
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

  test('the live chapter renders against a PARTIAL slice instead of throwing', () => {
    // ⚠ THE SMALLEST LIVE WORLD THERE IS: `hasLive` and nothing else. Every other field this
    // chapter reads is absent, which is what a slice looks like the day a producer grows a
    // field before a consumer does, or the day a world is played far enough to be live and no
    // further. Three separate hand-built stubs for the arm above each died here — on
    // `posture.label`, then `besiegingTargets`, then `tradeWars` — so the chapter is held to
    // the guard its own siblings already had.
    const bare = { hasLive: true };
    const prose = buildPrintProse(patron, { faithUnlocked: true });
    let rendered;
    expect(() => {
      rendered = FaithWar({
        settlement: patron, narrativeMode: false, stateProse: prose,
        vm: { ...VM_FOR(patron), liveWorld: bare },
      });
    }, 'a partial live slice threw instead of rendering what it carries').not.toThrow();
    expect(rendered, 'a partial slice rendered nothing at all').toBeTruthy();

    // AND IT STILL CARRIES ITS CONTENT: the guard must not have turned the chapter into an
    // empty shell. The faith paragraph it was fed is in the tree.
    const texts = [];
    const walk = (node) => {
      if (node == null || typeof node === 'boolean') return;
      if (typeof node === 'string' || typeof node === 'number') { texts.push(String(node)); return; }
      if (Array.isArray(node)) { node.forEach(walk); return; }
      if (typeof node === 'object') {
        if (typeof node.type === 'function') { try { walk(node.type(node.props)); } catch { /* sub-tree */ } return; }
        walk(node.props?.children);
      }
    };
    walk(rendered);
    expect(texts.join('\u0000')).toContain(prose.faith['faith.patronSeat']);

    // NO BEHAVIOUR CHANGE ON A FULL SLICE: the producer's own output renders as it did.
    const full_ = buildPdfLiveWorld({ settlement: patron, campaign: null });
    expect(() => FaithWar({
      settlement: patron, narrativeMode: false, stateProse: prose,
      vm: { ...VM_FOR(patron), liveWorld: full_ },
    })).not.toThrow();
  });

  test('THE FAITH GATE, pinned through a RENDERED DOCUMENT rather than a stub of it', () => {
    // ⭐ REVIEW 8 #4. The gate is one expression — `SettlementPDF.jsx:190`'s
    // `stateProse={inc('identityDailyLife') ? null : stateProse}` — and the arms that used to
    // cover it called `FaithWar(...)` directly with a hand-chosen prop, which is a stub of the
    // gate rather than the gate. These render the WHOLE document for the two variants the
    // gate discriminates and count the paragraph in the result.
    //
    // THE TWO VARIANTS ARE THE WHOLE TRUTH TABLE, asserted rather than assumed so a re-cut
    // reds here instead of leaving a dead arm: `canon_dossier` carries BOTH chapters (the
    // live one `if-canon`, chapter 07 true) and is the only place the prose could print
    // twice; `campaign_state` drops chapter 07 and keeps the live one, and is the only place
    // it could print nowhere.
    expect(PDF_VARIANTS.canon_dossier.chapters.faithWar).toBe('if-canon');
    expect(PDF_VARIANTS.canon_dossier.chapters.identityDailyLife).toBe(true);
    expect(PDF_VARIANTS.campaign_state.chapters.faithWar).toBe('if-canon');
    expect(PDF_VARIANTS.campaign_state.chapters.identityDailyLife).toBe(false);

    const prose = buildPrintProse(patron, { faithUnlocked: true });
    const paragraph = prose.faith['faith.patronSeat'];
    expect(paragraph, 'the patron town composed no seat paragraph to look for').toBeTruthy();
    // The live slice the premium chapter self-gates on, from the product's own producer.
    expect(buildPdfLiveWorld({ settlement: patron, campaign: null }),
      'the patron town produces no live slice, so the faith chapter could never render')
      .not.toBeNull();

    const base = {
      settlement: patron, phase: 'canon', faithUnlocked: true, stateProse: prose, eventLog: [],
    };
    // EXACTLY ONE COPY, BOTH WAYS. One number pins both halves of the gate: zero would mean
    // the variant has no page for the prose, two would mean both homes printed it.
    expect(copiesInDocument({ ...base, variant: 'campaign_state' }, paragraph),
      'campaign_state: chapter 07 is out, so the live chapter must carry the faith prose')
      .toBe(1);
    expect(copiesInDocument({ ...base, variant: 'canon_dossier' }, paragraph),
      'canon_dossier: chapter 07 carries it, so the live chapter must be fed null')
      .toBe(1);
  });

  test('THE PREMIUM FAITH SEAM: unlocked, the deity positions print and match the screen', () => {
    // NON-VACUITY FIRST: this fixture really does carry a patron, and the reading the desk is
    // handed really does contain the deity's NAME — so the negative arm below is a refusal
    // rather than a fixture that had nothing to leak.
    const model = faithPanelModel(patron);
    expect(model.hasEmbed, 'the patron fixture carries no embedded faith').toBe(true);
    expect(JSON.stringify(model), "the reading does not carry the deity's name")
      .toContain(DEITY_NAME);

    const unlocked = flat(buildPrintProse(patron, { faithUnlocked: true }));
    expect(unlocked['faith.patronSeat'], 'the unlocked seam printed no patron seat').toBeTruthy();

    const screen = screenProse(patron, true);
    const drift = Object.entries(unlocked)
      .filter(([mount]) => mount.startsWith('faith.'))
      .filter(([mount, p]) => screen[mount] !== p)
      .map(([mount, p]) => `${mount}\n  PRINT : ${p}\n  SCREEN: ${screen[mount] ?? '(nothing)'}`);
    expect(drift, 'the unlocked faith prose disagrees between page and screen').toEqual([]);
  });

  test('THE PREMIUM FAITH SEAM: locked, the document carries no faith position at all', () => {
    // ⭐ REVIEW 8 #7 — THIS ARM'S WORDING IS NARROWED TO THE SEAM IT ACTUALLY PROVES, and the
    // reason is a measurement that makes the wider claim untestable.
    //
    // ⛔ MEASURED, AND RECORDED SO NOBODY RE-ADDS THE WIDER ARM BELIEVING IT PROVES THIS: no
    // faith paragraph this corpus can draw for the patron fixture NAMES the deity — not on a
    // locked export and not on an unlocked one. DS-FTH-1 draws "The faith here has only just
    // taken root…" and its siblings band the seat without ever filling a `{deity}` slot. So an
    // arm asserting "no paragraph contains 'The Iron Lord'" passes on a tree where the seam is
    // WIDE OPEN — it is green for the wrong reason, which is exactly the class
    // tests/lint/negativeAssertionAnchor.walker.test.js exists to remove, one level below the
    // matcher it scans for. It is gone rather than annotated.
    //
    // WHAT THE SEAM REALLY CONTROLS is the POSITION SET, and that is asked as an equality with
    // both sides named — so a leak reds with the position that leaked, and a builder that went
    // inert reds on the unlocked side rather than passing quietly on the locked one.
    const positionsOf = (flag) => Object.keys(buildPrintProse(patron, { faithUnlocked: flag }).faith || {}).sort();

    expect(positionsOf(false), 'a LOCKED export carries a faith position').toEqual([]);
    // The live half of the same question: the seam opens, and it opens onto exactly the
    // deity-bearing position. This is what stops the assertion above passing because the
    // builder stopped building.
    expect(positionsOf(true), 'the UNLOCKED seam no longer opens onto the patron seat')
      .toEqual(['faith.patronSeat']);

    // AND THE POSITIONS ARE REAL PROSE, not empty strings that would satisfy a key count.
    const seat = buildPrintProse(patron, { faithUnlocked: true }).faith['faith.patronSeat'];
    expect(typeof seat).toBe('string');
    expect(seat.length, 'the patron seat printed an empty paragraph').toBeGreaterThan(40);
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
    // THE ANCHOR IS THE SIBLING THAT TRAVELS THE SAME PATH (review 8 #7's class). DS-DEF-4's
    // structure half is ruled PARITY and its capture half PRINT-DEFERRED, and both are drawn
    // by one desk call into one position — so a structure line that is PRESENT is exactly the
    // proof that the position is live and the missing capture line is a refusal rather than a
    // position that fell silent. Asserted unconditionally rather than behind an `if`: the
    // fixture carries two criminal institutions precisely so this half draws.
    expect(structureLine, 'the captured fixture drew no structure line to anchor on').toBeTruthy();
    expectAbsentWithAnchor(
      printed['defense.criminalStructure'], captureLine, structureLine,
      'DS-DEF-4 at capture: structure prints, the capture rung does not',
    );
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
