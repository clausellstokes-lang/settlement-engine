/** @vitest-environment jsdom */
/**
 * GR-4b-iii-b acceptance battery: exactly one straight-line suite and B1-B8.
 * Loops are assertions inside registered cases; no test registration is data-driven.
 *
 * ⚠ THE EIGHT LINES ARE PINNED LITERALLY AND THAT IS THE POINT (CR-GR4B-12). The corpus
 * was corrected at A-22 because the old pool asserted envoys, prepared letters and a
 * successor's name that neither the pending row nor the parchment carries. A pin that
 * only counted lines could not have seen that; equality against the authored eight can.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { render, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const key of Object.keys(data)) delete data[key];
    // Free tier deliberately: the DM true-state chip is fail-closed on it, so the markup
    // comparisons below read the dossier line rather than a ground-truth surface.
    Object.assign(data, {
      auth: { tier: 'free' }, isElevated: () => false,
      campaigns: [], savedSettlements: [],
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import TreatyPanel from '../../src/components/map/TreatyPanel.jsx';
import WarFaithTab from '../../src/components/new/tabs/WarFaithTab.jsx';
import { renderAllTreaties } from '../../src/domain/display/treatyDocument.js';
import {
  successionQuestionOpenLines,
} from '../../src/domain/display/treatySuccessionDossier.js';
import { GRAMMAR_KIND_REGISTRY } from '../../src/domain/worldPulse/grammarNews.js';
import {
  advanceTreaties, TERM_CATALOG, treatyPairKey,
} from '../../src/domain/worldPulse/peaceTerms.js';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import {
  resolveSuccessionQuestions,
} from '../../src/domain/worldPulse/treatySuccessionDecision.js';
import { buildPdfLiveWorld } from '../../src/pdf/lib/liveWorld.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICK = 120;
const KEY = treatyPairKey('crown', 'march');
const KIND = 'succession_question_open';
const TESTID = 'treaty-succession-question-line';
const RULES = Object.freeze({
  warLayerEnabled: true,
  peaceEngineEnabled: true,
  oathHolderEnabled: true,
  routineMajorApproval: true,
  treatyLifecycleVoiceEnabled: true,
});
const copy = (value) => JSON.parse(JSON.stringify(value));

/** The acting court's eight authored lines, derived through tests/helpers/receiptAnnex.js
 *  at this base and pinned here byte-verbatim. `{npc}` is the FALLEN holder throughout. */
const MARCH_LINES = Object.freeze([
  'The new seat has not yet said whether the old oath holds.',
  'The oath Old March swore for March remains before the new seat, with no answer entered.',
  "From Crown, the treaty still reads as standing while March's answer remains pending.",
  'The parchment still joins March to Crown; the pending question has not broken it.',
  'One docket entry holds the whole choice: honor the old oath or disavow it.',
  'Until March answers, the treaty with Crown remains live under the terms already written.',
  "Since Old March left the seat, March's treaty question has remained open and the treaty itself in force.",
  'If the seat gives no answer, the oath stands.',
]);
/** The counterpart court's own eight, for the two-questions-one-treaty case. CR-GR4B-15:
 *  the binding is the ACTING court's, never viewer-relative, so these are a different set. */
const CROWN_LINES = Object.freeze([
  'The new seat has not yet said whether the old oath holds.',
  'The oath Old Crown swore for Crown remains before the new seat, with no answer entered.',
  "From March, the treaty still reads as standing while Crown's answer remains pending.",
  'The parchment still joins Crown to March; the pending question has not broken it.',
  'One docket entry holds the whole choice: honor the old oath or disavow it.',
  'Until Crown answers, the treaty with March remains live under the terms already written.',
  "Since Old Crown left the seat, Crown's treaty question has remained open and the treaty itself in force.",
  'If the seat gives no answer, the oath stands.',
]);

function term(burden01 = 0.9) {
  const spec = TERM_CATALOG.tribute;
  return {
    type: 'tribute', family: spec.family, magnitude: 0.4, mintedTick: 0,
    expiresTick: 400, weightSpent: spec.weight, complianceState: 'honored',
    trueState: 'honored', burden01, receipt: 'tribute term',
    deliveredToVictor: 0, extractedFromLoser: 0,
  };
}

function treaty({ burden01 = 0.9, loserName = 'March', sworn, terms } = {}) {
  return {
    parties: ['crown', 'march'], victorId: 'crown', loserId: 'march',
    victorName: 'Crown', loserName, mintedTick: 0,
    treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
    believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored', receipts: ['pin'],
    terms: terms === undefined ? [term(burden01)] : terms,
    sworn: sworn === undefined
      ? { march: { npcId: 'npc_old', name: 'Old March', swornTick: 2 } }
      : sworn,
  };
}

function ladder(settlements = ['march']) {
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const sid of settlements) {
    out[sid] = { factions: {}, npcs: {}, seatTransitions: [{
      id: `seat.${sid}`, fromRulerId: sid === 'march' ? 'npc_old' : 'npc_crown_old',
      toRulerId: `${sid}_new`, cause: 'coup', tick: TICK,
    }] };
  }
  return out;
}

function world({ key = KEY, rules = RULES, treaties, seats = ['march'],
  record, proposals } = {}) {
  return {
    rngSeed: 'gr4b-iiib', tick: TICK, canonizedAt: NOW,
    simulationRules: { ...rules },
    calendar: { elapsedWeeks: TICK }, deployments: {}, relationshipStates: {},
    ...(proposals ? { proposals } : {}),
    spatialLedgers: {
      treaties: treaties || { [key]: record || treaty() },
      npcLadder: ladder(seats),
    },
  };
}

/** Drive the landed GR-4d writer, which is the only thing that mints a pending row.
 *  Deliberately NOT named for a seed: it opens questions, and a `for` header naming a
 *  seed is what the seed-loop totality walker reads as a lower-bound loop. */
const withQuestions = (source, tick = TICK) => (
  resolveSuccessionQuestions(source, tick, NOW).worldState);

const pendingOf = (state) => (state.proposals || []).filter(
  (row) => row.outcome?.proposalPayload?.kind === 'succession_question',
);

const docsOf = (state) => renderAllTreaties(state);

function campaignOf(worldState) {
  return {
    id: 'camp-gr4b-iiib', settlementIds: ['crown', 'march'], worldState,
    regionalGraph: { edges: [], channels: [] },
    wizardNews: { currentTick: TICK, entries: [] },
  };
}

/** Render one mount once: its exact markup, its dossier lines in render order, and every
 *  block's text in DOCUMENT order (which is how the beneath-the-age-line claim is read —
 *  WarFaithTab's longevity line carries no testid and this slice may not give it one). */
function snapshot(element) {
  const { container } = render(element);
  const html = container.innerHTML;
  const texts = [...container.querySelectorAll('div')].map((el) => el.textContent);
  const lines = [...container.querySelectorAll(`[data-testid="${TESTID}"]`)]
    .map((el) => el.textContent);
  cleanup();
  return { html, texts, lines };
}

const panelOf = (worldState) => snapshot(createElement(TreatyPanel, {
  campaign: campaignOf(worldState), nameById: { crown: 'Crown', march: 'March' },
}));

function tabOf(worldState, sid = 'march') {
  useStore.__set({
    campaigns: [campaignOf(worldState)],
    savedSettlements: [
      { id: 'crown', settlement: { name: 'Crown' } },
      { id: 'march', settlement: { name: 'March' } },
    ],
  });
  return snapshot(createElement(WarFaithTab, {
    settlement: { id: sid, name: sid === 'march' ? 'March' : 'Crown' }, saveId: sid,
  }));
}

describe('GR-4b-iii-b — the open-question dossier line', () => {
  beforeEach(() => useStore.__reset());
  afterEach(() => cleanup());

  it('a validated pending question renders exactly one fully addressed dossier line', () => {
    const seeded = withQuestions(world());
    expect(pendingOf(seeded)).toHaveLength(1);
    const before = JSON.stringify(seeded);
    const [doc] = docsOf(seeded);
    expect(doc.successionLines).toHaveLength(1);
    expect(MARCH_LINES).toContain(doc.successionLines[0]);
    // The composer agrees with the read-model, and the read is a READ: the proposal,
    // treaty, ledger and oath stamp are byte-identical either side of it.
    expect(successionQuestionOpenLines(seeded, KEY, doc.terms)).toEqual(doc.successionLines);
    expect(JSON.stringify(seeded)).toBe(before);
    const treatyAfter = seeded.spatialLedgers.treaties[KEY];
    expect(treatyAfter.sworn).toEqual({
      march: { npcId: 'npc_old', name: 'Old March', swornTick: 2 },
    });
    expect(treatyAfter.breachType).toBeUndefined();
    // anchored: exactly one line is pinned above, so the mount checks below read a real
    // sentence rather than passing against an empty render.
    expect(panelOf(seeded).lines).toEqual(doc.successionLines);
    expect(tabOf(seeded).lines).toEqual(doc.successionLines);
  });

  it('all eight annex-verbatim families and slot vectors are reachable', () => {
    const row = GRAMMAR_KIND_REGISTRY.find((candidate) => candidate.kind === KIND);
    expect(row.requiredSlots).toEqual([
      [], ['npc', 'settlement'], ['counterpart', 'settlement'],
      ['settlement', 'counterpart'], [], ['settlement', 'counterpart'],
      ['npc', 'settlement'], [],
    ]);
    expect(row).toMatchObject({ significance: 'n/a', audience: 'public', section: null });
    expect(row.pool).toHaveLength(8);
    // Real outcome identities, one per instrument, driven through the landed writer.
    const reached = new Set();
    for (let index = 0; index < 600 && reached.size < 8; index += 1) {
      const key = `instrument.${index}`;
      const seeded = withQuestions(world({ key }));
      const lines = successionQuestionOpenLines(seeded, key, [term()]);
      expect(lines).toHaveLength(1);
      reached.add(lines[0]);
    }
    expect([...reached].sort()).toEqual([...MARCH_LINES].sort());
    // `{npc}` is the fallen holder on the acting court's stamp — never the successor.
    expect([...reached].some((line) => line.includes('Old March'))).toBe(true);
    // EVERY EXCLUSION AS ONE POSITIVE ASSERTION. A bare `not.toContain` reads true just as
    // happily when the subject drifted away as when the member was correctly kept out, so
    // the tells are mapped and compared whole: the failure names WHICH tell fired, and the
    // `authored` row is the liveness anchor riding in the same assertion.
    // HZ-BANKEDVOICE: the estate em-dash / exclamation walker's four arms are BANKED known
    // failures, so its per-test identity would absorb a new tell in a `src/domain` string.
    // Those two rows are therefore proved HERE, directly, rather than left to that walker.
    for (const line of reached) {
      expect({
        successorName: line.includes('march_new'),
        rosterId: line.includes('npc_old'),
        residualToken: /\d|\{|\}|\bundefined\b|\bNaN\b/.test(line),
        emDash: line.includes('—'),
        exclamation: line.includes('!'),
        authored: MARCH_LINES.includes(line),
      }).toEqual({
        successorName: false, rosterId: false, residualToken: false,
        emDash: false, exclamation: false, authored: true,
      });
    }
  });

  it('a dark mechanism leaves both mounts and the read-model byte-identical', () => {
    const base = world();
    const baseDocs = JSON.stringify(docsOf(base));
    const basePanel = panelOf(base).html;
    const baseTab = tabOf(base).html;
    // The key is ALWAYS PRESENT and `[]` when nothing qualifies (HZ-DORMANCYFENCE).
    const [baseDoc] = docsOf(base);
    expect('successionLines' in baseDoc).toBe(true);
    expect(baseDoc.successionLines).toEqual([]);
    expect(baseDoc.ageLine).toBeTruthy();

    // The oath holder dark: the writer no-ops entirely, so the world and every surface
    // over it are byte-identical to the same world built at base.
    const darkOath = withQuestions(world({ rules: { ...RULES, oathHolderEnabled: false } }));
    const absentOathSource = world();
    delete absentOathSource.simulationRules.oathHolderEnabled;
    const absentOath = withQuestions(absentOathSource);
    for (const state of [darkOath, absentOath]) {
      expect(pendingOf(state)).toEqual([]);
      expect(JSON.stringify(docsOf(state))).toBe(baseDocs);
      expect(panelOf(state).html).toBe(basePanel);
      expect(tabOf(state).html).toBe(baseTab);
      expect(panelOf(state).lines).toEqual([]);
      expect(tabOf(state).lines).toEqual([]);
    }

    // Routine-major approval absent and declared false: GR-4d answers directly instead of
    // retaining a proposal, so no pending row exists and this pool stays silent. The
    // ledger legitimately moves on that road, which is why the equality above is stated
    // against the oath-dark pair and this arm asserts the pool's own silence.
    const absentRoutineSource = world();
    delete absentRoutineSource.simulationRules.routineMajorApproval;
    const falseRoutine = withQuestions(world({ rules: { ...RULES, routineMajorApproval: false } }));
    for (const state of [withQuestions(absentRoutineSource), falseRoutine]) {
      expect(pendingOf(state)).toEqual([]);
      for (const doc of docsOf(state)) {
        expect('successionLines' in doc).toBe(true);
        expect(doc.successionLines).toEqual([]);
      }
      expect(panelOf(state).lines).toEqual([]);
      expect(tabOf(state).lines).toEqual([]);
    }
  });

  it('terminal, unvalidated and foreign rows render no line', () => {
    const seeded = withQuestions(world());
    const [pending] = pendingOf(seeded);
    const terms = docsOf(seeded)[0].terms;
    // anchored: the untouched pending row really renders one line, so every mutation
    // below is measured against a fixture that is not silent for some other reason.
    expect(successionQuestionOpenLines(seeded, KEY, terms)).toHaveLength(1);

    const withRows = (rows) => ({ ...copy(seeded), proposals: rows });
    const mutate = (fn) => {
      const row = copy(pending);
      fn(row);
      return withRows([row]);
    };
    const cases = [
      mutate((row) => { row.status = 'applied'; }),
      mutate((row) => { row.status = 'dismissed'; }),
      mutate((row) => { row.status = 'expired'; }),
      mutate((row) => { row.status = 'refused'; }),
      mutate((row) => { delete row.outcome.proposalPayload.terminals; }),
      mutate((row) => { delete row.outcome.proposalPayload.question.npcId; }),
      mutate((row) => { row.outcome.proposalPayload.questionKey = 'wrong'; }),
      mutate((row) => { row.outcome.id = 'not-the-derived-identity'; }),
      mutate((row) => { row.outcome.proposalPayload.kind = 'strategy_deploy'; }),
      mutate((row) => { row.outcome = null; }),
      mutate((row) => { row.outcome = 'a string outcome'; }),
      withRows([copy(pending), copy(pending)].map((row, index) => (
        index === 1 ? { ...row, status: 'applied' } : row
      ))),
      withRows([]),
      withRows(['not a record', null, 42]),
    ];
    for (const [index, state] of cases.entries()) {
      expect(() => successionQuestionOpenLines(state, KEY, terms), `case ${index}`).not.toThrow();
      const lines = successionQuestionOpenLines(state, KEY, terms);
      // The duplicate-id case keeps ONE valid pending row and one terminal copy, so it
      // renders exactly one line; every other case renders none.
      expect(lines, `case ${index}`).toEqual(index === 11 ? [lines[0]] : []);
      if (index === 11) expect(MARCH_LINES).toContain(lines[0]);
    }
  });

  it('an unresolvable address renders nothing, never a partial line', () => {
    // The address is damaged AFTER the writer has retained a real pending row, which is
    // what makes these the COMPOSER's guards rather than the writer's eligibility test.
    const seeded = withQuestions(world());
    const terms = docsOf(seeded)[0].terms;
    expect(pendingOf(seeded)).toHaveLength(1);
    // anchored: the undamaged world renders exactly one line, so every damaged address
    // below is measured against a fixture that is not silent for some other reason.
    expect(successionQuestionOpenLines(seeded, KEY, terms)).toHaveLength(1);

    const damaged = (fn) => {
      const state = copy(seeded);
      fn(state.spatialLedgers.treaties);
      return state;
    };
    const cases = [
      // A missing ledger entry for the asked pair, and a non-record one.
      damaged((treaties) => { delete treaties[KEY]; }),
      damaged((treaties) => { treaties[KEY] = 'a parchment'; }),
      // An unresolved orientation: the instrument names no second party.
      damaged((treaties) => { treaties[KEY].victorId = ''; }),
      // An id echoed back as a name is NOT a resolved name.
      damaged((treaties) => { treaties[KEY].loserName = 'march'; }),
      // No stamp at all; a half-written stamp; a stamp naming a different holder; and a
      // stamp carried only by the OTHER court, so the acting court never signed.
      damaged((treaties) => { delete treaties[KEY].sworn; }),
      damaged((treaties) => { delete treaties[KEY].sworn.march.name; }),
      damaged((treaties) => { treaties[KEY].sworn.march.npcId = 'someone_else'; }),
      damaged((treaties) => {
        treaties[KEY].sworn = { crown: { npcId: 'npc_old', name: 'Old March', swornTick: 2 } };
      }),
    ];
    for (const [index, state] of cases.entries()) {
      const before = JSON.stringify(state);
      expect(successionQuestionOpenLines(state, KEY, terms), `case ${index}`).toEqual([]);
      // The pending row survives the read untouched — presentation never vetoes mechanics.
      expect(pendingOf(state), `case ${index} pending row`).toHaveLength(1);
      expect(JSON.stringify(state), `case ${index} mutated`).toBe(before);
    }
    // A treaty carrying ZERO written terms does not entail its own pool (CR-GR4B-14),
    // and that is the `terms` argument's own arm rather than the ledger's.
    for (const empty of [[], null, undefined, 'terms', {}]) {
      expect(successionQuestionOpenLines(seeded, KEY, empty), String(empty)).toEqual([]);
    }
    // A document whose ledger record carries no written term renders no line at the mount,
    // and the read-model key is still present and still `[]`.
    const termless = damaged((treaties) => { treaties[KEY].terms = []; });
    for (const doc of docsOf(termless)) expect(doc.successionLines).toEqual([]);
    expect(panelOf(termless).lines).toEqual([]);
  });

  it('two questions on one treaty render two lines in canonical order', () => {
    const sworn = {
      crown: { npcId: 'npc_crown_old', name: 'Old Crown', swornTick: 2 },
      march: { npcId: 'npc_old', name: 'Old March', swornTick: 2 },
    };
    // THE ORDER PIN NEEDS COURT-DISTINCTIVE TEXT. Three of the eight families carry no slot
    // and read identically for either court, so an order claim resting on one of those is
    // satisfied just as well by the REVERSED pair — a vacuity a passing pin cannot show.
    // The instrument's measured weight is part of the question's identity and therefore of
    // the receipt seed, so vary it until BOTH questions draw a slotted family.
    const CROWN_ONLY = CROWN_LINES.filter((line) => !MARCH_LINES.includes(line));
    const MARCH_ONLY = MARCH_LINES.filter((line) => !CROWN_LINES.includes(line));
    const distinctive = [...CROWN_ONLY, ...MARCH_ONLY];
    let found = null;
    for (let index = 0; index < 300 && !found; index += 1) {
      const record = treaty({ burden01: 0.99 - (index * 0.001), sworn });
      const state = withQuestions(world({ record, seats: ['crown', 'march'] }));
      if (pendingOf(state).length !== 2) continue;
      const [doc] = docsOf(state);
      if (doc.successionLines.length === 2
        && doc.successionLines.every((line) => distinctive.includes(line))) {
        found = { state, record, lines: doc.successionLines };
      }
    }
    expect(found, 'no instrument drew two court-distinctive families').toBeTruthy();
    expect(pendingOf(found.state)).toHaveLength(2);
    // Two DISTINCT lines, each bound to its OWN acting court — no per-treaty uniqueness,
    // no court-pair dedupe, and no viewer-relative re-binding (CR-GR4B-15). THE ORDER IS
    // THE CLAIM: the persisted proposal order is the render order.
    expect(found.lines[0]).not.toBe(found.lines[1]);
    expect(CROWN_ONLY).toContain(found.lines[0]);
    expect(MARCH_ONLY).toContain(found.lines[1]);
    const acting = pendingOf(found.state).map(
      (row) => row.outcome.proposalPayload.question.settlementId,
    );
    expect(acting).toEqual(['crown', 'march']);
    // Reversing the input enumeration produces identical bytes in identical order: the
    // landed writer codepoint-sorts before insertion, so the composer needs no sort and
    // deliberately has none.
    const reverse = withQuestions(world({ record: found.record, seats: ['march', 'crown'] }));
    expect(JSON.stringify(pendingOf(reverse))).toBe(JSON.stringify(pendingOf(found.state)));
    expect(docsOf(reverse)[0].successionLines).toEqual(found.lines);
    expect(panelOf(found.state).lines).toEqual(found.lines);
    expect(tabOf(found.state).lines).toEqual(found.lines);
    // ── THE PER-TREATY ADDRESS, proved at the composer's OWN interface ──────────────
    // The ledger is one-treaty-per-pair (the document read-model derives its `pairKey` from
    // the parties), so through `renderAllTreaties` the court-name guard would silence a
    // foreign instrument before the address guard was ever consulted. The composer takes
    // `pairKey` as an argument, and its contract is that a question speaks ONLY on the
    // parchment it names — so a second ledger entry holding an EQUALLY RESOLVABLE
    // instrument (same courts, same stamps, same live terms) must still render nothing.
    const terms = docsOf(found.state)[0].terms;
    const twoKeyed = copy(found.state);
    twoKeyed.spatialLedgers.treaties['crown>march.other'] = copy(found.record);
    expect(successionQuestionOpenLines(twoKeyed, 'crown>march.other', terms)).toEqual([]);
    // anchored: the SAME world answers both lines at the key the questions actually name,
    // so the emptiness above is the address guard firing and not an unreachable fixture.
    expect(successionQuestionOpenLines(twoKeyed, KEY, terms)).toEqual(found.lines);
  });

  it('the same world is byte-stable, draws nothing, and writes nothing', () => {
    const random = vi.spyOn(Math, 'random').mockImplementation(() => {
      throw new Error('the dossier line must not draw');
    });
    const clock = vi.spyOn(Date, 'now').mockImplementation(() => {
      throw new Error('the dossier line must not read the clock');
    });
    const seeded = withQuestions(world());
    const terms = docsOf(seeded)[0].terms;
    const before = JSON.stringify(seeded);
    const first = successionQuestionOpenLines(seeded, KEY, terms);
    const second = successionQuestionOpenLines(seeded, KEY, terms);
    const roundTripped = successionQuestionOpenLines(copy(seeded), KEY, copy(terms));
    expect(first).toHaveLength(1);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(JSON.stringify(roundTripped)).toBe(JSON.stringify(first));
    expect(JSON.stringify(seeded)).toBe(before);
    expect(JSON.stringify(docsOf(seeded))).toBe(JSON.stringify(docsOf(copy(seeded))));
    // Total on every degenerate world, and still an ARRAY — never null, never a throw.
    for (const bad of [null, undefined, {}, 'world', 42, [], { proposals: null }]) {
      expect(successionQuestionOpenLines(bad, KEY, terms), String(bad)).toEqual([]);
    }
    expect(successionQuestionOpenLines(seeded, null, terms)).toEqual([]);
    expect(random).not.toHaveBeenCalled();
    expect(clock).not.toHaveBeenCalled();
    random.mockRestore();
    clock.mockRestore();
  });

  it('a real late-stage succession reaches both mounts and no other surface', () => {
    // The REAL road: advanceTreaties runs the late treaty stage, which is what inserts
    // the pending proposal. Nothing here hand-builds one.
    const source = world();
    const result = advanceTreaties({
      snapshot: { settlements: [], byId: new Map(), regionalGraph: { edges: [] } },
      worldState: source, settlementUpdates: [], graph: { edges: [] },
      pIndex: null, tick: TICK, now: NOW,
    });
    const state = result.worldState;
    expect(pendingOf(state)).toHaveLength(1);
    const [doc] = docsOf(state);
    expect(doc.successionLines).toHaveLength(1);
    const line = doc.successionLines[0];
    expect(MARCH_LINES).toContain(line);

    // Both mounts render it, and each renders it BENEATH its longevity line. Read in
    // DOCUMENT order rather than by testid, because WarFaithTab's age line carries none.
    expect(doc.ageLine).toBeTruthy();
    for (const mount of [panelOf(state), tabOf(state)]) {
      expect(mount.lines).toEqual([line]);
      const age = mount.texts.indexOf(doc.ageLine);
      const dossier = mount.texts.indexOf(line);
      // anchored: both blocks are pinned present before their order is compared, so a
      // missing surface cannot satisfy the comparison with two −1s.
      expect(age).toBeGreaterThanOrEqual(0);
      expect(dossier).toBeGreaterThanOrEqual(0);
      expect(dossier).toBeGreaterThan(age);
    }

    // …and NO other surface. The war-room PDF projects an explicit field list, so the
    // new read-model key is inert there and no PDF edit is authorized (HZ-PDFPROJECTION).
    const pdf = buildPdfLiveWorld({
      settlement: { id: 'march', name: 'March', config: {} },
      campaign: { ...campaignOf(state), nameById: { crown: 'Crown', march: 'March' } },
    });
    const pdfJson = JSON.stringify(pdf);
    expect(pdf.treaties).toHaveLength(1);
    // ONE POSITIVE ASSERTION CARRYING ITS OWN LIVENESS ANCHOR: the longevity line IS
    // projected, which proves this chapter is live and populated, while the dossier key
    // and its sentence are both absent. Stated as bare exclusions these would have passed
    // just as well against a null export or a projection that had stopped running.
    expect({
      keyInJson: pdfJson.includes('successionLines'),
      lineInJson: pdfJson.includes(line),
      keyOnTreaty: Object.keys(pdf.treaties[0]).includes('successionLines'),
      ageLineProjected: typeof pdf.treaties[0].ageLine === 'string'
        && pdf.treaties[0].ageLine.length > 0,
    }).toEqual({
      keyInJson: false, lineInJson: false, keyOnTreaty: false, ageLineProjected: true,
    });
  });
});
