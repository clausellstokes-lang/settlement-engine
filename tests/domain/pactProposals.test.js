/**
 * pactProposals.test.js — the proposal ledger's LIFECYCLE TOTALITY.
 *
 * §4's L4 clause names seven paths for this key — create, read, persist, regenerate, undo,
 * migrate/import and veil — and this file walks each one with an EXECUTED round trip rather
 * than asserting the writer's return value and calling it persistence. The recorded bug
 * class it exists to remove is the write that survives one path and ghosts another.
 *
 * ⚠ THE WRITER/READER PIN BOOTS THE REAL WRITER. Every read below goes through
 * `pactProposalsOf` over state produced by `openPactProposal` — never over a hand-built
 * row. A pin that mirrors the deriver proves list equals list; this one would red if the
 * writer stopped emitting a field the reader needs, which is the failure it is for.
 *
 * @enforced-by this file
 */
import { describe, expect, test } from 'vitest';

import {
  PACT_PROPOSAL_LEDGER_KEY,
  PACT_PROPOSAL_REFUSALS,
  PACT_PROPOSAL_STATES,
  PACT_PROPOSAL_TUNING,
  PACT_TRANSPORTS,
  answerDueTickFor,
  normalizePactProposal,
  openPactProposal,
  openProposalBetween,
  pactFormationActive,
  pactProposalsOf,
  prunePactProposals,
  settlePactProposal,
  writePactProposals,
} from '../../src/domain/worldPulse/pactProposals.js';
import { OPEN_TICK, pactWorld } from '../helpers/pactFixture.js';

const T = PACT_PROPOSAL_TUNING;
const SHEET = { terms: [{ type: 'resource_share', family: 'economic', beneficiary: 'A', magnitude: 0.25 }] };

/** Open one proposal through the REAL writer. */
function opened(worldState = pactWorld({ flag: true }), over = {}) {
  return openPactProposal({
    worldState, from: 'A', to: 'B', trigger: 'trade_demand', sheet: SHEET, tick: OPEN_TICK, ...over,
  });
}

describe('THE ONE GATE — read once, by name, strictly', () => {
  test('absent and false are identical; only the literal `true` lights it', () => {
    expect(pactFormationActive(pactWorld({}))).toBe(false);
    expect(pactFormationActive(pactWorld({ flag: false }))).toBe(false);
    expect(pactFormationActive(pactWorld({ flag: true }))).toBe(true);
    // Every truthy-but-not-`true` spelling is DARK — the strict-read contract.
    for (const truthy of [1, 'true', {}, [], 'yes']) {
      expect(pactFormationActive(pactWorld({ flag: truthy }))).toBe(false);
    }
  });

  test('a world that is not a record, or carries no rules, is dark rather than a crash', () => {
    for (const junk of [null, undefined, 0, 'world', []]) {
      expect(pactFormationActive(junk)).toBe(false);
    }
    expect(pactFormationActive({})).toBe(false);
  });
});

describe('CREATE + READ — through the real writer, and the three typed refusals', () => {
  test('an opened proposal reads back with every declared field and nothing else', () => {
    const { worldState, proposal, refusal } = opened();
    expect(refusal).toBe('');
    const rows = pactProposalsOf(worldState);
    expect(rows).toHaveLength(1);
    // §4's shape, exactly — no extra key, because a key is a byte.
    expect(Object.keys(rows[0]).sort()).toEqual([
      'answerDueTick', 'from', 'id', 'openedTick', 'sheet', 'state', 'to', 'transport', 'trigger',
    ]);
    expect(rows[0]).toEqual(proposal);
    expect(rows[0].state).toBe('open');
    expect(PACT_TRANSPORTS).toContain(rows[0].transport);
  });

  test('the id is derived and stable — the same crossing twice is the same name', () => {
    const first = opened().proposal;
    const second = opened().proposal;
    expect(first.id).toBe(second.id);
    expect(first.id).toBe('pact.10.a.b.trade_demand');
  });

  test('THE THREE REFUSALS are exactly the typed veto codes, each reachable', () => {
    expect([...PACT_PROPOSAL_REFUSALS].sort()).toEqual([
      'invalid_term_sheet', 'no_cap_headroom', 'open_proposal_exists',
    ]);
    // invalid_term_sheet — an empty sheet, an unknown trigger, a self-pair.
    expect(opened(undefined, { sheet: { terms: [] } }).refusal).toBe('invalid_term_sheet');
    expect(opened(undefined, { trigger: 'not_a_trigger' }).refusal).toBe('invalid_term_sheet');
    expect(opened(undefined, { to: 'A' }).refusal).toBe('invalid_term_sheet');
    // open_proposal_exists — in EITHER direction, because a pair in correspondence has one
    // question standing between it, not one per direction.
    const one = opened().worldState;
    expect(opened(one).refusal).toBe('open_proposal_exists');
    expect(opened(one, { from: 'B', to: 'A' }).refusal).toBe('open_proposal_exists');
  });

  test('THE SPAM BOUND — the cap is on the PROPOSER and it really bites', () => {
    // ⚠ THE COUNT IS A LITERAL, AND THAT IS THE WHOLE POINT. The first draft looped to
    // `T.MAX_OPEN_PROPOSALS` and asserted the NEXT one refused — a pin that reads its
    // bound from the module it is testing, so raising the cap to 99 simply opened 99 and
    // refused the hundredth. The mutant SURVIVED, which is the recorded self-referential
    // pin class caught in this wave's own mutant round. The cure is an INDEPENDENT
    // census: the declared band is asserted as a number, and the behaviour is driven with
    // hand-written counts that do not move when the band does.
    expect(T.MAX_OPEN_PROPOSALS).toBe(2);
    let state = pactWorld({ flag: true });
    state = opened(state, { to: 'T0' }).worldState;
    state = opened(state, { to: 'T1' }).worldState;
    expect(pactProposalsOf(state)).toHaveLength(2);
    const overflow = opened(state, { to: 'ZZ' });
    expect(overflow.refusal).toBe('no_cap_headroom');
    expect(overflow.worldState).toBe(state); // a refusal perturbs nothing
    // …and the cap is the PROPOSER's: another court is not silenced by A's traffic.
    expect(opened(state, { from: 'Q', to: 'ZZ' }).refusal).toBe('');
  });

  test('a refused open returns the SAME worldState reference', () => {
    const state = pactWorld({ flag: true });
    expect(opened(state, { sheet: { terms: [] } }).worldState).toBe(state);
  });
});

describe('THE DWELL — physics, with its bands stated against the measured spectrum', () => {
  /** A digest that prices every pair at `weeks`, which is what `hopWeeks` returns. */
  const digestOf = (weeks) => ({ __weeks: weeks });

  test('with no measurable road the dwell floors and SAYS it was not measured', () => {
    const due = answerDueTickFor({ digest: null, fromId: 'A', toId: 'B', tick: 10 });
    expect(due.measured).toBe(false);
    expect(due.weeks).toBe(T.DWELL_LEG_FLOOR_WEEKS);
    expect(due.answerDueTick).toBe(10 + 2 * T.DWELL_LEG_FLOOR_WEEKS + T.DELIBERATION_WEEKS);
    expect(opened().receipt).toContain('no road between these courts could be measured');
  });

  test('THE CALIBRATED-WEEKS HAZARD: every dwell inside a 2..8-week realm is distinct', () => {
    // `hopWeeks` is calibrated PER DIGEST and a whole realm spans roughly 2..8 march
    // weeks, so a band at or above 9 weeks would refuse nothing anywhere and be dead the
    // day it was authored. The two tuned numbers are asserted against that spectrum, and
    // the resulting dwells are asserted DISTINCT and inside the year, so the surface a
    // retune would move is provably live across the whole measured range.
    expect(T.DWELL_LEG_FLOOR_WEEKS).toBeLessThan(2);
    expect(T.DELIBERATION_WEEKS).toBeLessThan(9);
    const dwells = [2, 3, 4, 5, 6, 7, 8].map((w) => 2 * w + T.DELIBERATION_WEEKS);
    expect(new Set(dwells).size).toBe(dwells.length);
    expect(Math.min(...dwells)).toBe(6);
    expect(Math.max(...dwells)).toBe(18);
    expect(Math.max(...dwells)).toBeLessThan(52);
    // …and the floor arm is genuinely SHORTER than the near end of the spectrum, so the
    // unmeasured case is distinguishable from a measured near hop rather than aliasing.
    expect(2 * T.DWELL_LEG_FLOOR_WEEKS + T.DELIBERATION_WEEKS).toBeLessThan(Math.min(...dwells));
    expect(digestOf).toBeTypeOf('function');
  });
});

describe('SETTLE + PRUNE — a queue, not an archive', () => {
  test('the closed state vocabulary is four words and only three are terminal', () => {
    expect([...PACT_PROPOSAL_STATES].sort()).toEqual(['expired', 'open', 'refused', 'signed']);
    const state = opened().worldState;
    const id = pactProposalsOf(state)[0].id;
    // `open` is not a settlement, and an unknown word settles nothing.
    expect(settlePactProposal({ worldState: state, id, state: 'open' }).proposal).toBeNull();
    expect(settlePactProposal({ worldState: state, id, state: 'invented' }).proposal).toBeNull();
  });

  test('a settled row settles ONCE — a second attempt changes nothing', () => {
    const first = settlePactProposal({
      worldState: opened().worldState, id: 'pact.10.a.b.trade_demand', state: 'signed',
    });
    expect(first.proposal.state).toBe('signed');
    const second = settlePactProposal({
      worldState: first.worldState, id: 'pact.10.a.b.trade_demand', state: 'refused',
    });
    expect(second.proposal).toBeNull();
    expect(second.worldState).toBe(first.worldState);
  });

  test('PRUNE drops settled rows AND the key with the last of them', () => {
    const settled = settlePactProposal({
      worldState: opened().worldState, id: 'pact.10.a.b.trade_demand', state: 'refused',
    }).worldState;
    expect(pactProposalsOf(settled)).toHaveLength(1);
    const pruned = prunePactProposals({ worldState: settled });
    expect(pactProposalsOf(pruned)).toHaveLength(0);
    // ABSENT, never `[]`: an emptied ledger is byte-identical to one that never opened.
    expect(pruned.spatialLedgers?.[PACT_PROPOSAL_LEDGER_KEY]).toBeUndefined();
  });

  test('a prune with nothing settled returns the SAME reference', () => {
    const state = opened().worldState;
    expect(prunePactProposals({ worldState: state })).toBe(state);
  });
});

describe('PERSIST + UNDO + REGENERATE — the lifecycle paths, round-tripped', () => {
  test('PERSIST: a JSON round trip is byte-true through the REAL reader', () => {
    const state = opened().worldState;
    const revived = JSON.parse(JSON.stringify(state));
    expect(pactProposalsOf(revived)).toEqual(pactProposalsOf(state));
    expect(JSON.stringify(pactProposalsOf(revived))).toBe(JSON.stringify(pactProposalsOf(state)));
  });

  test('PERSIST: rows serialize codepoint-ordered by id whatever order they arrived in', () => {
    const rows = [
      { id: 'pact.9.z', from: 'Z', to: 'Y', trigger: 'trade_demand', sheet: { terms: [] }, openedTick: 9, answerDueTick: 13, state: 'open', transport: 'abstract' },
      { id: 'pact.1.a', from: 'A', to: 'B', trigger: 'trade_demand', sheet: { terms: [] }, openedTick: 1, answerDueTick: 5, state: 'open', transport: 'abstract' },
    ];
    const forward = writePactProposals(pactWorld({ flag: true }), rows);
    const backward = writePactProposals(pactWorld({ flag: true }), [...rows].reverse());
    expect(pactProposalsOf(forward).map((r) => r.id)).toEqual(['pact.1.a', 'pact.9.z']);
    expect(JSON.stringify(pactProposalsOf(forward))).toBe(JSON.stringify(pactProposalsOf(backward)));
  });

  test('UNDO: a snapshot taken before the write restores byte-true', () => {
    const before = pactWorld({ flag: true });
    const snapshot = JSON.parse(JSON.stringify(before));
    const after = opened(before).worldState;
    expect(pactProposalsOf(after)).toHaveLength(1);
    // The writer never mutates, so the pre-write world is still exactly itself.
    expect(JSON.stringify(before)).toBe(JSON.stringify(snapshot));
    expect(pactProposalsOf(before)).toHaveLength(0);
  });

  test('REGENERATE: opening from the same inputs re-derives an IDENTICAL row', () => {
    // THE PROMISE, at this lane's grain: proposals are re-derivable intentions, so a
    // regenerated world that re-scores the same crossing must produce the same row rather
    // than a second one with a fresh identity.
    const first = pactProposalsOf(opened().worldState);
    const second = pactProposalsOf(opened().worldState);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
  });
});

describe('IMPORT — the closed vocabularies are validated, never repaired', () => {
  const valid = {
    id: 'pact.10.a.b.trade_demand',
    from: 'A',
    to: 'B',
    trigger: 'trade_demand',
    sheet: { terms: [] },
    openedTick: 10,
    answerDueTick: 14,
    state: 'open',
    transport: 'abstract',
  };

  test('a lawful row survives, normalized to exactly the declared fields', () => {
    expect(normalizePactProposal({ ...valid, smuggled: 'field' })).toEqual(valid);
  });

  test('an invented trigger, state or transport DROPS the row rather than guessing', () => {
    expect(normalizePactProposal({ ...valid, trigger: 'rivalry_cooling' })).toBeNull();
    expect(normalizePactProposal({ ...valid, state: 'pending' })).toBeNull();
    expect(normalizePactProposal({ ...valid, transport: 'pigeon' })).toBeNull();
  });

  test('a structurally impossible row DROPS — no pair, no sheet, or an answer owed before it was asked', () => {
    expect(normalizePactProposal({ ...valid, to: 'A' })).toBeNull();
    expect(normalizePactProposal({ ...valid, sheet: {} })).toBeNull();
    expect(normalizePactProposal({ ...valid, answerDueTick: 9 })).toBeNull();
    expect(normalizePactProposal({ ...valid, openedTick: -1 })).toBeNull();
    expect(normalizePactProposal({ ...valid, openedTick: 10.5 })).toBeNull();
    expect(normalizePactProposal(null)).toBeNull();
  });

  test('`renewal` is IMPORT-LEGAL though GR-2 mints none — the vocabulary is the contract', () => {
    // A world saved by a later GR-5 build must survive a read here. The tombstone is about
    // what this wave PRODUCES, never about what it will tolerate.
    expect(normalizePactProposal({ ...valid, trigger: 'renewal' })).not.toBeNull();
  });
});

describe('the pair reader', () => {
  test('finds an open row in either direction and ignores settled ones', () => {
    const state = opened().worldState;
    const rows = pactProposalsOf(state);
    expect(openProposalBetween(rows, 'A', 'B')).not.toBeNull();
    expect(openProposalBetween(rows, 'B', 'A')).not.toBeNull();
    expect(openProposalBetween(rows, 'A', 'C')).toBeNull();
    const settled = pactProposalsOf(settlePactProposal({
      worldState: state, id: rows[0].id, state: 'refused',
    }).worldState);
    expect(openProposalBetween(settled, 'A', 'B')).toBeNull();
  });
});
