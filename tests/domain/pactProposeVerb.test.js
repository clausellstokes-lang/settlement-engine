/**
 * tests/domain/pactProposeVerb.test.js — GR-2b: THE DM PROPOSES A PACT (LANE FP-B, unit 1;
 * the brief BUILD-FP-B-grammar.md as amended by the chair on 2026-09-23 — A6 withdrawn, slot
 * GR-2b-c). `PROPOSE_PACT` is a REALM_MANIFEST row on the proposal lane (J-EM-11, R-21): its
 * apply arm opens the question through the ledger's ONE writer, its refusals are that writer's
 * own codes, and the two predicates and the host's answer are defined beside the ledger and
 * composed into their registries by the chair. A9 is the address chain (standing ruling SR-8):
 * the verb mints two news kinds, and approval voices both registered pools.
 *
 * The new symbols are read through NAMESPACE imports on purpose, so the red-first plant of the
 * pre-change sources reds each arm by title instead of failing the file at link time.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, vi } from 'vitest';

import * as manifest from '../../src/domain/events/realmManifest.js';
import * as proposals from '../../src/domain/worldPulse/pactProposals.js';
import { applyRealmVerbOrder, buildRealmVerbOutcome } from '../../src/domain/worldPulse/realmVerbExecution.js';
import { applyWorldPulseProposal, mintRealmVerbProposal } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { PACT_DRAFT_LENS, draftPactSheet } from '../../src/domain/worldPulse/pactFormation.js';
import { TERM_CATALOG, termLabel } from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { GRAMMAR_RECEIPTS } from '../../src/domain/worldPulse/grammarReceiptPools.js';
import { isActorInitiatedMajorType } from '../../src/domain/worldPulse/actorMajorApproval.js';
import { resolveDecree, stage } from '../../src/domain/edit/registry.js';
import { PHANTOM_KIND } from '../../src/domain/edit/phantoms.js';

// The ONE creation path, wrapped so a test can count its callers (the real body still runs).
vi.mock('../../src/domain/worldPulse/pactProposals.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return { ...actual, openPactProposal: vi.fn(actual.openPactProposal) };
});

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TICK = 10;
const lit = () => ({ simulationRules: { pactFormationEnabled: true }, tick: TICK });
const dark = () => ({ simulationRules: {}, tick: TICK });
const court = (id) => ({ id, name: id.toUpperCase(), settlement: { id, name: id.toUpperCase() } });
const ctxOf = (...ids) => ({ settlements: ids.map(court), tick: TICK });
const phantomCourt = { id: 'ph', name: 'Nowhere', settlement: { id: 'ph', kind: PHANTOM_KIND, name: 'Nowhere', seed: 's', traits: {} } };
const openRow = (from, to) => ({
  id: `pact.1.${from}.${to}.trade_demand`, from, to, trigger: 'trade_demand',
  sheet: { terms: [{ type: 'resource_share' }] }, openedTick: 1, answerDueTick: 99, state: 'open', transport: 'abstract',
});
const withRows = (world, rows) => proposals.writePactProposals(world, rows);
const row = () => manifest.REALM_MANIFEST.PROPOSE_PACT;
const offered = (world, ctx) => row().predicate(world, ctx);
const ARGS = Object.freeze({ fromId: 'a', toId: 'b', termType: 'resource_share' });
const FALLBACK = /^The (change|order) was refused \(/;

/** Stage the order through the lane's pure mint, then apply it through the arm dispatcher. */
function proposeThrough(state, args = ARGS, ids = ['a', 'b', 'c', 'd']) {
  const snapshot = { settlements: ids.map(court) };
  const built = buildRealmVerbOutcome({ verb: 'PROPOSE_PACT', args, worldState: state, snapshot, tick: TICK });
  if (built.ok !== true) throw new Error(`mint refused: ${built.code}`);
  return applyRealmVerbOrder({ state, snapshot, settlementUpdates: new Map(), outcome: built.outcome, tick: TICK, now: null });
}

describe('GR-2b — PROPOSE_PACT, the DM verb on the realm proposal lane', () => {
  it('A1: the row is in executableRealmVerbs() on lane proposal, and its predicate offers it exactly when the four conjuncts hold', () => {
    expect(manifest.executableRealmVerbs().map((v) => v.verb)).toContain('PROPOSE_PACT');
    expect({ lane: row().lane, candidateType: row().candidateType, authority: row().authority, module: row().module })
      .toEqual({ lane: 'proposal', candidateType: 'pact_proposed', authority: 'pact_proposed', module: 'pactProposals.js' });
    expect(row().dials.map((d) => d.key), 'the asking court, the court asked, the clause; no transport dial').toEqual(['fromId', 'toId', 'termType']);
    expect(offered(lit(), ctxOf('a', 'b')).available, 'all four conjuncts hold').toBe(true);
    // anchored: the same two-court world is offered one line above, so only the dark gate differs.
    expect(offered(dark(), ctxOf('a', 'b')).available).toBe(false);
    // anchored: lit with two courts is offered above; one court is the only change.
    expect(offered(lit(), ctxOf('a')).available).toBe(false);
    // anchored: the lit two-court world is offered above; the standing question is the only change.
    expect(offered(withRows(lit(), [openRow('b', 'a')]), ctxOf('a', 'b')).available).toBe(false);
    const capped = withRows(lit(), [openRow('a', 'x'), openRow('a', 'y'), openRow('b', 'x'), openRow('b', 'z')]);
    // anchored: no row stands between a and b here, so only the two courts' spent caps refuse the pair.
    expect(offered(capped, ctxOf('a', 'b')).available).toBe(false);
    expect(offered(withRows(lit(), [openRow('a', 'x')]), ctxOf('a', 'b')).available, 'one offer abroad leaves headroom').toBe(true);
    expect(offered(dark(), ctxOf('a', 'b')).reasons[0]).toBe('The pact grammar is not active in this campaign.');
    expect(proposals.pactCounterpartiesFor(capped, ['a', 'b'], 'a').length + proposals.pactCounterpartiesFor(lit(), ['a', 'b'], 'a').length).toBe(1);
  });

  it('A2: staging mints ONE pending order and no ledger row; approval opens ONE proposal through openPactProposal, the one creation path', () => {
    const spy = /** @type {import('vitest').Mock} */ (/** @type {unknown} */ (proposals.openPactProposal));
    spy.mockClear();
    const staged = mintRealmVerbProposal({
      campaign: { worldState: lit() }, saves: [{ id: 'a', settlement: { name: 'A' } }, { id: 'b', settlement: { name: 'B' } }],
      verb: 'PROPOSE_PACT', args: { ...ARGS }, now: '2026-09-23T00:00:00.000Z',
    });
    expect(staged.ok).toBe(true);
    const pending = (staged.ok ? staged.result.worldState.proposals : []).filter((p) => p.status === 'pending');
    expect(pending.map((p) => [p.outcome.candidateType, p.outcome.applyMode, p.outcome.proposalPayload.verb]))
      .toEqual([['pact_proposed', 'proposal', 'PROPOSE_PACT']]);
    expect(spy.mock.calls.length, 'staging opens nothing').toBe(0);
    const armed = proposeThrough(lit());
    expect(armed.refusal).toBe(null);
    expect(spy.mock.calls.length, 'approval calls the one creation path exactly once').toBe(1);
    const rows = proposals.pactProposalsOf(armed.worldState);
    expect(rows.map((r) => [r.from, r.to, r.trigger, r.state, r.transport])).toEqual([['a', 'b', 'trade_demand', 'open', 'abstract']]);
    const drafted = draftPactSheet({ trigger: 'trade_demand', fromId: 'a', toId: 'b', reciprocal: false, tick: TICK, score01: 0 }).terms;
    expect(rows[0].sheet.terms, 'the clause is the grammar drafter own, never re-spelled').toEqual(drafted);
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/realmVerbExecution.js'), 'utf8');
    // anchored: the same file is read non-empty (it holds the arm asserted just above), so an absent writer spelling is real.
    expect(source.match(/writePactProposals|PACT_PROPOSAL_LEDGER_KEY|'pactProposals'/g)).toBe(null);
    expect(source).toContain('openPactProposal({');
    // anchored: the policy set is non-empty (it holds treaty_breached), so pact_proposed's absence from it is a real reading.
    expect(isActorInitiatedMajorType('pact_proposed')).toBe(false);
    expect(isActorInitiatedMajorType('treaty_breached')).toBe(true);
  });

  it('A3: every refusal in PACT_PROPOSAL_REFUSALS is the verb own veto code, spoken by realmVetoProse (totality)', () => {
    expect([...row().coversVetoCodes].sort()).toEqual(['pact_gate_dark', ...proposals.PACT_PROPOSAL_REFUSALS].sort());
    expect(Object.keys(proposals.PACT_VETO_PROSE).sort(), 'a sentence per covered code and no dead prose').toEqual([...row().coversVetoCodes].sort());
    const cases = {
      invalid_term_sheet: [lit(), { ...ARGS, termType: 'not_a_clause' }],
      open_proposal_exists: [withRows(lit(), [openRow('b', 'a')]), ARGS],
      no_cap_headroom: [withRows(lit(), [openRow('a', 'c'), openRow('a', 'd')]), ARGS],
    };
    expect(Object.keys(cases).sort()).toEqual([...proposals.PACT_PROPOSAL_REFUSALS].sort());
    for (const [code, [state, args]] of Object.entries(cases)) {
      const armed = proposeThrough(state, args);
      expect(armed.refusal?.code, code).toBe(code);
      expect(armed.worldState, `${code} leaves the world untouched`).toBe(state);
      expect(armed.newsEntries[0].summary).toBe(manifest.realmVetoProse(code));
      // anchored: realmVetoProse(code) is asserted equal to the news summary above, so the fallback shrug is a live alternative.
      expect(manifest.realmVetoProse(code, 'X')).not.toMatch(FALLBACK);
    }
  });

  it('A4: pactProposable holds with its subjects on two courts and no open row, and fails when a row stands or the layer is dark', () => {
    const { pactProposable, pactProposalPending } = proposals.PACT_WORLD_CONDITIONS;
    const campaign = (worldState) => ({ settlementIds: ['a', 'b'], worldState });
    expect([pactProposable.predicate({ id: 'a' }, campaign(lit())), pactProposable.subjects({ id: 'a' }, campaign(lit()))]).toEqual([true, ['b']]);
    const standing = campaign(withRows(lit(), [openRow('a', 'b')]));
    expect([pactProposable.predicate({ id: 'a' }, standing), pactProposable.subjects({ id: 'a' }, standing)]).toEqual([false, []]);
    expect([pactProposable.predicate({ id: 'a' }, campaign(dark())), pactProposable.subjects({ id: 'a' }, campaign(dark()))]).toEqual([false, []]);
    expect([pactProposalPending.predicate({ id: 'b' }, standing), pactProposalPending.subjects({ id: 'b' }, standing)]).toEqual([true, ['a']]);
    expect([pactProposalPending.predicate({ id: 'a' }, standing), pactProposalPending.subjects({ id: 'a' }, standing)]).toEqual([false, []]);
    // anchored: the same lit campaign answers true for member 'a' above, so a court outside the campaign is the only change.
    expect(pactProposable.predicate({ id: 'z' }, campaign(lit()))).toBe(false);
    expect([pactProposable.source, pactProposalPending.source]).toEqual(['live', 'live']);
    for (const cond of [pactProposable, pactProposalPending]) {
      for (const reader of cond.readers) expect(typeof proposals[reader.symbol], reader.symbol).toBe('function');
    }
  });

  it('A5: the host answer resolves through resolveDecree for both answers and refuses a word outside PACT_PROPOSAL_STATES', () => {
    const type = proposals.PACT_ANSWER_OP_TYPE;
    const decl = proposals.PACT_DIRECTION_OP_TYPES[type];
    expect({ target: decl.target, stage: decl.stage, consequence: decl.consequence, world: decl.requires.world, ref: decl.payload.proposalId.kind })
      .toEqual({ target: 'settlement', stage: 'home', consequence: 'home', world: ['pactProposalPending'], ref: 'ref' });
    expect(decl.payload.answer.values, 'the vocabulary is the ledger own, imported, never re-spelled').toBe(proposals.PACT_ANSWER_STATES);
    expect([...proposals.PACT_ANSWER_STATES].every((w) => proposals.PACT_PROPOSAL_STATES.includes(w))).toBe(true);
    const resolve = (answer) => resolveDecree(stage([], {
      type, target: { kind: 'settlement', id: 'b' }, payload: { proposalId: 'pact.1.a.b.trade_demand', answer },
    }, { id: `d-${answer}`, orderedAt: '2026-09-23T00:00:00.000Z' })[0], { opTypes: proposals.PACT_DIRECTION_OP_TYPES, pools: {} });
    expect([resolve('signed'), resolve('refused')]).toEqual([{ ok: true }, { ok: true }]);
    expect(resolve('maybe')).toEqual({ ok: false, missing: 'pool-value', was: 'maybe' });
  });

  it('A7: a phantom never reaches the campaign\'s court list — excluded BY CONSTRUCTION, never by a runtime filter — and every reader of proposal rows takes a phantom row without throwing', () => {
    // THE LIBRARY holds the phantom; THE CAMPAIGN never named it. `ctx.settlements` is built
    // exactly as the realm composer and the store's own mint build it (RealmVerbComposer.jsx;
    // campaignSettlements() in store/campaignSliceShared.js): the library, filtered down to the
    // campaign's own settlementIds. 'ph' is a row on the shelf and nothing more.
    const library = [court('a'), court('b'), phantomCourt];
    const memberIds = new Set(['a', 'b']);
    const ctx = { settlements: library.filter((s) => memberIds.has(s.id)), tick: TICK };
    expect(ctx.settlements.map((s) => s.id),
      'the campaign\'s court list is phantom-free by symbol: a phantom on the shelf that was never'
      + ' added to settlementIds never reaches it — no discriminant read required').toEqual(['a', 'b']);
    expect(manifest.pactCounterpartyOptions(lit(), ctx, 'a').map((o) => o.id)).toEqual(['b']);
    expect(manifest.pactPartyOptions(lit(), ctx).map((o) => o.id)).toEqual(['a', 'b']);
    const world = withRows(lit(), [openRow('a', 'ph')]);
    const rows = proposals.pactProposalsOf(world);
    expect(proposals.openProposalBetween(rows, 'ph', 'a')?.to).toBe('ph');
    expect(proposals.openProposalsFrom(rows, 'a').length).toBe(1);
    expect(proposals.pactCounterpartiesFor(world, ['a', 'b', 'ph'], 'a')).toEqual(['b']);
    const campaign = { settlementIds: ['a', 'b', 'ph'], worldState: world };
    expect(proposals.PACT_WORLD_CONDITIONS.pactProposalPending.subjects({ id: 'ph' }, campaign)).toEqual(['a']);
    expect(proposals.PACT_WORLD_CONDITIONS.pactProposable.subjects({ id: 'a' }, campaign)).toEqual(['b']);
  });

  it('A8: pactFormationEnabled dark ⇒ the verb is not offered and approval refuses with the world byte-identical', () => {
    const state = dark();
    const before = JSON.stringify(state);
    // anchored: A1 shows the same call offered on a lit world, so this refusal is the gate alone.
    expect(offered(state, ctxOf('a', 'b')).available).toBe(false);
    // anchored: A4 shows the same row true on a lit world with the same courts.
    expect(proposals.PACT_WORLD_CONDITIONS.pactProposable.predicate({ id: 'a' }, { settlementIds: ['a', 'b'], worldState: state })).toBe(false);
    // anchored: A7 shows the same builder naming 'b' on a lit world with the same courts.
    expect(manifest.pactCounterpartyOptions(state, ctxOf('a', 'b'), 'a')).toEqual([]);
    const outcome = { proposalPayload: { kind: 'realm_verb_order', verb: 'PROPOSE_PACT', args: { ...ARGS } } };
    const armed = applyRealmVerbOrder({ state, snapshot: { settlements: ['a', 'b'].map(court) }, settlementUpdates: new Map(), outcome, tick: TICK, now: null });
    expect(armed.refusal?.code).toBe('pact_gate_dark');
    expect(armed.worldState).toBe(state);
    expect(JSON.stringify(armed.worldState)).toBe(before);
    expect(Object.keys(PACT_DRAFT_LENS).length > 0 && manifest.PACT_CLAUSE_TYPES.every((t) => Object.hasOwn(TERM_CATALOG, t))).toBe(true);
  });

  it('A9: approval voices BOTH registered pools, addressed to both courts, and the staged order speaks neither', () => {
    const saves = [
      { id: 'a', settlement: { id: 'a', name: 'Ashford', population: 900, tier: 'village' } },
      { id: 'b', settlement: { id: 'b', name: 'Irontown', population: 800, tier: 'village' } },
    ];
    const campaign = { id: 'c1', worldState: { ...lit(), proposals: [] }, regionalGraph: { edges: [] }, wizardNews: { entries: [], currentTick: TICK } };
    const staged = mintRealmVerbProposal({ campaign, saves, verb: 'PROPOSE_PACT', args: { ...ARGS }, now: '2026-09-24T00:00:00.000Z' });
    expect(staged.ok).toBe(true);
    const minted = staged.ok ? staged : { result: { worldState: campaign.worldState, newsEntries: [] }, proposalId: '' };
    // Every line each pool can say for THIS pair and THIS clause, sentence-cased as the reader renders it.
    const interp = { settlement: 'Ashford', counterpart: 'Irontown', term: termLabel(ARGS.termType) };
    const voiced = (kind) => GRAMMAR_RECEIPTS[kind].map((variant) => {
      const raw = typeof variant === 'function' ? String(variant(interp)) : String(variant);
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    });
    const queued = minted.result.newsEntries.filter((n) => n.impactKind === 'pact_proposed');
    expect(queued.map((n) => [n.kind, n.settlementIds]), 'the staged order is addressed to both courts').toEqual([['queued', ['a', 'b']]]);
    // anchored: the queued entry is pinned present above, and nothing is offered until the table approves (R-28).
    expect([...voiced('pact_proposed'), ...voiced('realm_verb_propose_pact')]).not.toContain(queued[0].summary);
    const approve = () => applyWorldPulseProposal({
      campaign: { ...campaign, worldState: minted.result.worldState }, saves, proposalId: minted.proposalId, now: '2026-09-24T01:00:00.000Z',
    });
    const approved = approve();
    const order = approved.newsEntries.filter((n) => n.impactKind === 'realm_verb_propose_pact');
    const offer = approved.newsEntries.filter((n) => n.impactKind === 'pact_proposed');
    expect(order.map((n) => [n.kind, n.settlementIds, n.section]), 'the order beat, on the treaty desk').toEqual([['applied', ['a', 'b'], 'trade']]);
    expect(offer.map((n) => [n.kind, n.settlementIds]), 'the proposal beat, through the substituted outcome').toEqual([['applied', ['a', 'b']]]);
    expect(voiced('realm_verb_propose_pact'), 'the order speaks its own registered pool').toContain(order[0].summary);
    expect(voiced('pact_proposed'), 'the proposal speaks the GR-2 pool').toContain(offer[0].summary);
    expect(order[0].familyId).toBe(`realm_verb_propose_pact.${voiced('realm_verb_propose_pact').indexOf(order[0].summary) + 1}`);
    expect(approved.worldState.proposals.find((p) => p.id === minted.proposalId)?.status).toBe('applied');
    // The picks are keyed on the ledger's own proposal id: the same world says the same words.
    expect(approve().newsEntries.map((n) => n.summary)).toEqual(approved.newsEntries.map((n) => n.summary));
  });
});
