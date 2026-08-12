/**
 * treatySuccessionVoice.test.js — GR-4b-α's acceptance battery (A1–A7).
 *
 * THE CLOSED DENOMINATOR: seven cases, no eighth. A8 (the privacy boundary) is OMITTED
 * rather than replaced — the kind is `audience: 'public'` in the annex as authored, and a
 * disavowal is a public court act by the design's own belief posture.
 *
 * ⚠ A7 IS THE AMENDED ONE. Its open-road clause was STRUCK at CR-GR4B-8: `repudiated` has no
 * reachable mount in this packet's paths, and the act it would narrate already speaks a
 * fully-addressed `treaty_breached` beat, so a second desk kind would double-voice it. What
 * survives is the idempotence and same-seed half, which is this voice's own claim anyway.
 *
 * ⚠ STRAIGHT-LINE REGISTRATION ONLY. A `test(`/`it(` inside a loop is TEST_UNREGISTERED to
 * the estate's lighting census and PARKS THE WHOLE FILE, losing every other title in it;
 * `.each()` parks the same way. Every case below is registered at the top level of its
 * describe, and every loop lives INSIDE an `it`.
 *
 * ⚠ THE POOL NAMES THE FALLEN HOLDER IN EXACTLY ONE OF ITS FIVE FAMILIES, so "the summary
 * names the hand that swore" is asserted as REACHABILITY over the keyed pick rather than as
 * a property of every draw. Asserting it of one seeded draw would be pinning a hash, and
 * asserting it of all five would be false against the authored corpus.
 */
import { describe, expect, it } from 'vitest';

import { advanceTreaties, treatyPairKey, TERM_CATALOG } from '../../src/domain/worldPulse/peaceTerms.js';
import { answerSuccessionQuestions } from '../../src/domain/worldPulse/treatyBreach.js';
import { successionDisavowalBeat } from '../../src/domain/worldPulse/treatySuccessionVoice.js';
import { successionQuestionsForTick } from '../../src/domain/worldPulse/treatySuccession.js';
import { lineageOf } from '../../src/domain/worldPulse/pactAmendment.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const WAR = { warLayerEnabled: true, peaceEngineEnabled: true };
const LIT = { oathHolderEnabled: true };
const TICK = 20;
const KEY = treatyPairKey('crown', 'march');
const FALLEN = 'npc_old';
const FALLEN_NAME = 'Old March';
const KIND = 'disavowed_by_succession';
/** The persisted house sentence the writer appends — the RECORDED reason (address law 4). */
const DISAVOWAL_RECEIPT = 'The oath was sworn by a hand now gone, and the seat that followed would not own it; every promise under it ceased at once.';

function term(type, patch = {}) {
  const spec = TERM_CATALOG[type];
  const t = {
    type, family: spec.family, magnitude: 0.4, mintedTick: 0, expiresTick: 60,
    weightSpent: spec.weight, complianceState: 'honored', trueState: 'honored', burden01: 0,
    receipt: `${type} term`, ...patch,
  };
  if (spec.stream) { t.deliveredToVictor = t.deliveredToVictor ?? 0; t.extractedFromLoser = t.extractedFromLoser ?? 0; }
  if (spec.executor === 'seam') t.seam = true;
  return t;
}

/**
 * ⚠ THE TREATY CARRIES `victorName`/`loserName` BECAUSE THE REAL MINT DOES
 * (`peaceTerms.js` writes both from the settlement item's own name). Without them the
 * orientation reader falls back to the ids, and this voice then fails CLOSED rather than
 * printing a slug where a town belongs — which is correct behaviour and would make every
 * assertion below vacuous, so the fixture models the real record instead of the minimum.
 */
function world({ burden01 = 0.9, rules = {}, cause = 'coup', sworn = true, rows = null } = {}) {
  const treaty = {
    parties: ['crown', 'march'], victorId: 'crown', loserId: 'march',
    victorName: 'Crown', loserName: 'March', mintedTick: 0,
    believedMarginAtSignature: 0.35, budgetGranted: 3, budgetSpent: 1,
    complianceState: 'honored', receipts: ['pin'],
    terms: [term('tribute', { burden01 })],
    ...(sworn ? { sworn: { march: { npcId: FALLEN, name: FALLEN_NAME, swornTick: 2 } } } : {}),
  };
  return {
    tick: TICK,
    simulationRules: { ...WAR, ...rules },
    calendar: { elapsedWeeks: 30 },
    deployments: {},
    relationshipStates: {},
    spatialLedgers: {
      treaties: { [KEY]: treaty },
      npcLadder: {
        march: {
          factions: {},
          npcs: {},
          seatTransitions: rows || [{
            id: 'st.march.1', fromRulerId: FALLEN, toRulerId: 'npc_new', cause, tick: TICK,
          }],
        },
      },
    },
  };
}

const ITEMS = [
  { id: 'crown', name: 'Crown', settlement: { name: 'crown', tier: 'city', population: 60000, npcs: [], activeConditions: [] } },
  { id: 'march', name: 'March', settlement: { name: 'march', tier: 'village', population: 280, npcs: [], activeConditions: [] } },
];

function advance(worldState, tick = TICK) {
  return advanceTreaties({
    snapshot: { settlements: ITEMS, byId: new Map(ITEMS.map((i) => [i.id, i])), regionalGraph: { edges: [] } },
    worldState,
    settlementUpdates: [],
    graph: { edges: [] },
    pIndex: null,
    tick,
    now: '2026-01-01T00:00:00.000Z',
  });
}

const ledgerJson = (result) => JSON.stringify(getSpatialLedger(result.worldState, 'treaties') || null);
const recordOf = (result) => (getSpatialLedger(result.worldState, 'treaties') || {})[KEY];
const beatsOf = (result) => result.newsEntries.filter((entry) => entry.kind === KIND);

// ── A1) THE SIGNATURE CHANGE IS A NO-OP ON STATE ────────────────────────────────

describe('A1 — the widened return is a no-op on state', () => {
  it('below the band the caller gets its OWN reference back, and an empty feed', () => {
    const below = world({ rules: LIT, burden01: 0.2 });
    const answered = answerSuccessionQuestions(below, TICK);
    // RE-ADDRESSED, not weakened: still `toBe` against the caller's own object.
    expect(answered.worldState).toBe(below);
    expect(answered.newsEntries).toEqual([]);
  });

  it('with no seat change at all the same two claims hold', () => {
    const quiet = world({ rules: LIT, rows: [] });
    const answered = answerSuccessionQuestions(quiet, TICK);
    expect(answered.worldState).toBe(quiet);
    expect(answered.newsEntries).toEqual([]);
    // NON-VACUITY: the fixture really does open no question, rather than the drive having
    // silently stopped answering.
    expect(successionQuestionsForTick(quiet, TICK)).toEqual([]);
  });

  it('GR-4a C3 still holds unchanged: a lit HONOR ledger equals the dark ledger', () => {
    const lit = advance(world({ rules: LIT, burden01: 0.2 }));
    const dark = advance(world({ burden01: 0.2 }));
    expect(ledgerJson(lit)).toBe(ledgerJson(dark));
  });
});

// ── A2) THE MAIN REACHABLE BEHAVIOR ─────────────────────────────────────────────

describe('A2 — the disavowal speaks, once, where it acted', () => {
  it('one beat, its own kind and impactKind, the ending token, both courts by id AND name', () => {
    const out = advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 }));
    expect(out.changed).toBe(true);
    const beats = beatsOf(out);
    expect(beats).toHaveLength(1);
    const [beat] = beats;
    expect(beat.impactKind).toBe(KIND);
    expect(beat.ending).toBe(KIND);
    expect(beat.significance).toBe('major');
    expect(beat.severity).toBe(0.76);
    expect(beat.score).toBe(78);
    expect(beat.tick).toBe(TICK);
    // The DISAVOWING court leads, because it is the subject of the sentence.
    expect(beat.settlementIds).toEqual(['march', 'crown']);
    expect(beat.settlementNames).toEqual(['March', 'Crown']);
    expect(beat.parties).toEqual(['crown', 'march']);
    expect(beat.headline).toBe("March's new seat casts off the oath sworn to Crown");
    expect(String(beat.summary).length).toBeGreaterThan(20);
    expect(beat.reasons).toEqual([DISAVOWAL_RECEIPT]);
  });

  it('the ledger act the beat narrates is the one GR-4a actually wrote', () => {
    const out = advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 }));
    const record = recordOf(out);
    expect(record.breachType).toBe('succession_repudiation');
    expect(record.defaultedBy).toBe('march');
    expect(lineageOf(record).at(-1)).toMatchObject({ ending: KIND, tick: TICK });
    // The beat's recorded reason is the LAST receipt on the instrument, read back rather
    // than restated — so a corpus edit on either side cannot fork them silently.
    expect(record.receipts.at(-1)).toBe(DISAVOWAL_RECEIPT);
    expect(beatsOf(out)[0].reasons).toEqual([record.receipts.at(-1)]);
  });
});

// ── A3) THE SILENCE-HONORS NEGATIVE, EXTENDED TO THE FEED ───────────────────────

describe('A3 — HONOR is silent in the feed as well as in the ledger', () => {
  it('below the band the ledger is byte-identical to dark AND no beat is minted', () => {
    // NON-VACUITY FIRST: the question really opened and was answered HONOR.
    const questions = successionQuestionsForTick(world({ rules: LIT, burden01: 0.2 }), TICK);
    expect(questions).toHaveLength(1);
    expect(questions[0].answer).toBe('honor');

    const lit = advance(world({ rules: LIT, burden01: 0.2 }));
    const dark = advance(world({ burden01: 0.2 }));
    expect(ledgerJson(lit)).toBe(ledgerJson(dark));
    expect(beatsOf(lit)).toEqual([]);
    expect(lit.newsEntries).toEqual([]);
  });

  it('THE LIT-MUTANT CONTROL — the same drive past the band DOES speak', () => {
    // Without this the silence above could be measuring a mount that never fires at all.
    const spoken = advance(world({ rules: LIT, burden01: 0.9 }));
    expect(beatsOf(spoken)).toHaveLength(1);
  });
});

// ── A4) THE NEWS ADDRESS LAW, PART BY PART ──────────────────────────────────────

describe('A4 — the address law, asserted by hand because part 4 has no census', () => {
  it('parts 1-3: the chain, the typed action from a frozen vocabulary, both settlements', () => {
    const out = advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 }));
    const [beat] = beatsOf(out);
    const record = recordOf(out);
    expect(beat.settlementNames).toEqual(['March', 'Crown']);
    expect(beat.settlementNames.every((name) => typeof name === 'string' && name.length > 0)).toBe(true);
    // A name that is merely the id echoed back is not a name.
    expect(beat.settlementNames).not.toEqual(beat.settlementIds); // anchored: both arrays are pinned to their exact literal values above, so this cannot pass by either being empty or absent
    expect(beat.kind).toBe(KIND);
    expect(beat.impactKind).toBe(KIND);
    expect(beat.parties).toEqual(record.parties);
    expect(beat.id).toBe(`wizard_news.${TICK}.${KIND}.march.crown`);
  });

  it('part 4: the reason is NON-EMPTY and is the RECORDED sentence, not an invented one', () => {
    const out = advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 }));
    const [beat] = beatsOf(out);
    // The leg with no walker: a producer shipping `reasons: []` passes every gate, and then
    // collides with its siblings under the feed's repeat suppression, which reads this set.
    expect(Array.isArray(beat.reasons)).toBe(true);
    expect(beat.reasons.length).toBeGreaterThan(0);
    expect(beat.reasons[0]).toBe(DISAVOWAL_RECEIPT);
    expect(recordOf(out).receipts).toContain(beat.reasons[0]);
  });

  it('part 1 at its deepest level: the FALLEN holder is nameable, and the family is reachable', () => {
    const source = world({ rules: LIT, cause: 'coup', burden01: 0.9 });
    const [question] = successionQuestionsForTick(source, TICK);
    const broken = recordOf(advance(source));
    // The keyed pick draws one of five authored families and only ONE names the holder, so
    // the honest claim is that the name was SUPPLIED and its family is drawable. The loop is
    // inside the it(), which is what keeps this file out of the parked set.
    const summaries = new Set();
    for (let t = TICK; t < TICK + 60; t += 1) {
      for (const beat of successionDisavowalBeat({ treaty: broken, question, tick: t })) {
        summaries.add(String(beat.summary));
      }
    }
    expect(summaries.size).toBeGreaterThan(1);
    expect([...summaries].some((line) => line.includes(FALLEN_NAME))).toBe(true);
    // …and the name is the one on the parchment's own stamp, not the successor's.
    expect(broken.sworn.march.name).toBe(FALLEN_NAME);
    expect([...summaries].some((line) => line.includes('npc_new'))).toBe(false); // anchored: the assertion above proves this set is populated and carries the real fallen name, so this exclusion is read against live sentences
  });

  it('a treaty whose courts cannot be NAMED mints nothing rather than printing a slug', () => {
    const source = world({ rules: LIT, cause: 'coup', burden01: 0.9 });
    const [question] = successionQuestionsForTick(source, TICK);
    const broken = recordOf(advance(source));
    const nameless = { ...broken, victorName: 'crown', loserName: 'march' };
    expect(successionDisavowalBeat({ treaty: nameless, question, tick: TICK })).toEqual([]);
    // NON-VACUITY: the same record WITH names does speak.
    expect(successionDisavowalBeat({ treaty: broken, question, tick: TICK })).toHaveLength(1);
  });
});

// ── A5) THE REFUSED-WRITE NEGATIVE ──────────────────────────────────────────────

describe('A5 — the voice narrates the ACT, never the intent', () => {
  it('two disavow questions on ONE treaty in ONE tick leave one breach and one beat', () => {
    const source = world({
      rules: LIT, burden01: 0.9,
      rows: [
        { id: 'st.march.1', fromRulerId: FALLEN, toRulerId: 'npc_new', cause: 'coup', tick: TICK },
        { id: 'st.march.2', fromRulerId: FALLEN, toRulerId: 'npc_newer', cause: 'coup', tick: TICK },
      ],
    });
    // NON-VACUITY: both questions really are asked, and both really answer disavow — so the
    // single beat below measures the WRITER's refusal rather than a trigger that fired once.
    const questions = successionQuestionsForTick(source, TICK);
    expect(questions).toHaveLength(2);
    expect(questions.map((q) => q.answer)).toEqual(['disavow', 'disavow']);

    const out = advance(source);
    expect(beatsOf(out)).toHaveLength(1);
    expect(lineageOf(recordOf(out)).filter((row) => row.ending === KIND)).toHaveLength(1);
  });
});

// ── A6) DARK / DISABLED ─────────────────────────────────────────────────────────

describe('A6 — absent and explicit-false are one answer, in both registers', () => {
  it('dark, over a fixture the lit control DOES break, nothing moves and nothing is said', () => {
    const dark = advance(world({ burden01: 0.9 }));
    expect(dark.newsEntries).toEqual([]);
    expectAbsentWithAnchor(
      ledgerJson(dark), 'succession_repudiation', KEY,
      'dark, the instrument stands untouched over a fixture the lit control does break',
    );
  });

  it('ABSENT and EXPLICIT FALSE are byte-identical in the ledger and both silent', () => {
    const absent = advance(world({ burden01: 0.9 }));
    const explicitFalse = advance(world({ rules: { oathHolderEnabled: false }, burden01: 0.9 }));
    expect(ledgerJson(explicitFalse)).toBe(ledgerJson(absent));
    expect(explicitFalse.newsEntries).toEqual([]);
  });

  it('THE LIT-MUTANT CONTROL — the same drive lit DOES diverge, so both zeros mean dormancy', () => {
    const absent = advance(world({ burden01: 0.9 }));
    const lit = advance(world({ rules: LIT, burden01: 0.9 }));
    expect(ledgerJson(lit)).not.toBe(ledgerJson(absent)); // anchored: the dark ledger is pinned to contain the live instrument by the anchored absence above, so this inequality is read against two real ledgers
    expect(beatsOf(lit)).toHaveLength(1);
  });
});

// ── A7) DUPLICATE / IDEMPOTENT + DETERMINISM ────────────────────────────────────
//
// ⚠ AMENDED AT CR-GR4B-8: the open-road clause is STRUCK. `repudiated` has no reachable
// mount in this packet's paths, and the DM repudiation it would narrate already mints a
// fully-addressed `treaty_breached` beat, so a second desk kind would double-voice one act.

describe('A7 — answered once, and the sentence is stable at a seed', () => {
  it('re-running the same tick over a broken shell mints no second beat', () => {
    const out = advance(world({ rules: LIT, burden01: 0.9 }));
    expect(beatsOf(out)).toHaveLength(1);
    const again = advance(out.worldState);
    expect(beatsOf(again)).toEqual([]);
    expect(again.changed).toBe(false);
    expect(again.worldState).toBe(out.worldState);
  });

  it('the same world at the same seed says byte-identical words twice', () => {
    const first = beatsOf(advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 })))[0];
    const second = beatsOf(advance(world({ rules: LIT, cause: 'coup', burden01: 0.9 })))[0];
    expect(first.familyId).toBe(second.familyId);
    expect(first.summary).toBe(second.summary);
    expect(first.id).toBe(second.id);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  it('the composer is PURE: it mutates neither the record nor the question it is handed', () => {
    const source = world({ rules: LIT, cause: 'coup', burden01: 0.9 });
    const [question] = successionQuestionsForTick(source, TICK);
    const broken = recordOf(advance(source));
    const recordBefore = JSON.stringify(broken);
    const questionBefore = JSON.stringify(question);
    successionDisavowalBeat({ treaty: broken, question, tick: TICK });
    expect(JSON.stringify(broken)).toBe(recordBefore);
    expect(JSON.stringify(question)).toBe(questionBefore);
  });
});
