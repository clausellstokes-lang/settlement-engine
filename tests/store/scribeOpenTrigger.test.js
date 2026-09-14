/**
 * tests/store/scribeOpenTrigger.test.js — THE OPEN IS THE TRIGGER (W2 commit 3).
 *
 * The owner, 2026-09-14 ~06:3x: "generation happens only once a settlement's dossier is opened and
 * frozen until next advance time." Every arm below is one word of that sentence made falsifiable,
 * because each refusal is a place money would otherwise be spent:
 *
 *   ONLY ONCE      — a second open in the same epoch is refused, and so is a second effect firing
 *                    in the same tick (the ledger is written BEFORE the await, not after).
 *   ONCE OPENED    — a save alone, an advance alone and a tick alone send nothing; the decision
 *                    needs a settlement on screen with a durable home.
 *   FROZEN         — a current artefact refuses with `frozen`, however many times it is asked.
 *   UNTIL ADVANCE  — moving the epoch counter, and only that, makes it stale again.
 *
 * The refusals are asserted BY REASON rather than by a bare false, so a trigger that started
 * refusing for a new and wrong reason cannot pass these arms.
 */

import { afterEach, describe, expect, test, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  SCRIBE_ENGINE_VERSION,
  attemptKeyOf,
  resetScribeAttempts,
  runScribeOpenTrigger,
  scribeOpenDecision,
  scribeSeedOf,
} from '../../src/store/scribeOpenTrigger.js';
import { setScribeRenderer, getScribeRenderer, hasScribeRenderer } from '../../src/lib/scribeRenderer.js';
import { landBlock, surveyStateOf } from '../../src/lib/scribeArtefact.js';
import { CARD_ENGINE_VERSION } from '../../src/domain/prose/townCard.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SEED = 'seed-ashford';

const unit = text => ({ vid: 3, spine: text, faces: [text], notebook: [], verdicts: ['PASS'], report: {} });

const renderedAt = (seq, engine = SCRIBE_ENGINE_VERSION) => landBlock(null, {
  advanceSeq: seq,
  blockId: 'DS-DEF-2',
  pools: { 'FAMILY: acute crisis': [unit('The watch keeps a short roll.')] },
  renderedFor: SEED,
  renderedAt: '2026-09-14T00:00:00.000Z',
  version: { scribe: 'sc1', engine, refuter: 'rf1', model: 'claude-opus-5' },
});

function stateWith({ prose = undefined, seq = 0, saveId = 'ashford' } = {}) {
  const settlement = { id: 'ashford', name: 'Ashford', _seed: SEED };
  return {
    settlement: prose === undefined ? settlement : { ...settlement, prose },
    activeSaveId: saveId,
    advanceSeqByCampaign: { 'camp-1': seq },
  };
}

afterEach(() => {
  resetScribeAttempts();
  setScribeRenderer(null);
});

describe('the engine fingerprint is ONE fact with two spellings', () => {
  test('the trigger and the town card agree on which generation a render belongs to', () => {
    // Re-spelled rather than imported (importing the card here would drag the six generated prose
    // leaves into the trigger's chunk), so the agreement is pinned instead of assumed.
    expect(SCRIBE_ENGINE_VERSION).toBe(CARD_ENGINE_VERSION);
    expect(SCRIBE_ENGINE_VERSION).toMatch(/^gen-.+\/sim-.+$/);
  });

  test('the seed is spelled the way the tabs spell it', () => {
    expect(scribeSeedOf({ _seed: 'a', id: 'b' })).toBe('a');
    expect(scribeSeedOf({ id: 'b' })).toBe('b');
    expect(scribeSeedOf(null)).toBe('');
  });
});

describe('THE DECISION — every refusal names itself', () => {
  test('an unscribed town with a durable home is owed a render', () => {
    const d = scribeOpenDecision(stateWith(), { campaignId: 'camp-1', hasRenderer: true });
    expect(d).toMatchObject({ render: true, reason: 'absent', advanceSeq: 0, renderedFor: SEED });
    expect(d.survey).toBe('none');
  });

  test('the flag being dark refuses before anything else is even read', () => {
    expect(scribeOpenDecision(stateWith(), { flagOn: false }).reason).toBe('flag-off');
  });

  test('no settlement on screen, no render', () => {
    expect(scribeOpenDecision({ activeSaveId: 'x' }, { hasRenderer: true }).reason).toBe('no-settlement');
  });

  test('NO DURABLE HOME, NO CHARGE — the chair addition, vetoable', () => {
    const d = scribeOpenDecision(stateWith({ saveId: null }), { hasRenderer: true });
    expect(d).toMatchObject({ render: false, reason: 'no-durable-home' });
  });

  test('a town with no seed cannot be keyed to a render', () => {
    const d = scribeOpenDecision(
      { settlement: { name: 'Nameless' }, activeSaveId: 'x' }, { hasRenderer: true },
    );
    expect(d.reason).toBe('no-seed');
  });

  test('no transport registered, no queue slot spent', () => {
    expect(scribeOpenDecision(stateWith(), { hasRenderer: false }).reason).toBe('no-transport');
  });

  test('⭐ FROZEN UNTIL THE NEXT ADVANCE — a current artefact is never re-rendered', () => {
    const state = stateWith({ prose: renderedAt(0), seq: 0 });
    for (let open = 0; open < 10; open += 1) {
      const d = scribeOpenDecision(state, { campaignId: 'camp-1', hasRenderer: true });
      expect(d).toMatchObject({ render: false, reason: 'frozen', survey: 'current' });
    }
  });

  test('⭐ AN ADVANCE, AND ONLY AN ADVANCE, MAKES IT STALE AGAIN', () => {
    const prose = renderedAt(0);
    // Same artefact, same town, same everything but the epoch counter.
    expect(scribeOpenDecision(stateWith({ prose, seq: 0 }), { campaignId: 'camp-1', hasRenderer: true }).reason)
      .toBe('frozen');
    const after = scribeOpenDecision(stateWith({ prose, seq: 1 }), { campaignId: 'camp-1', hasRenderer: true });
    expect(after).toMatchObject({ render: true, reason: 'stale', survey: 'prior' });
  });

  test('a render from a superseded engine is stale, and shows as the prior survey', () => {
    const prose = renderedAt(0, 'gen-0/sim-0');
    const d = scribeOpenDecision(stateWith({ prose, seq: 0 }), { campaignId: 'camp-1', hasRenderer: true });
    expect(d).toMatchObject({ render: true, reason: 'stale', survey: 'prior' });
  });
});

describe('THE SURVEY THE PAGE SHOWS', () => {
  test('none, prior and current are three different answers', () => {
    const prose = renderedAt(0);
    const q = { renderedFor: SEED, engineVersion: SCRIBE_ENGINE_VERSION };
    expect(surveyStateOf(prose, { ...q, advanceSeq: 0 })).toBe('current');
    expect(surveyStateOf(prose, { ...q, advanceSeq: 1 })).toBe('prior');
    expect(surveyStateOf(null, { ...q, advanceSeq: 0 })).toBe('none');
  });

  test("ANOTHER TOWN'S PROSE IS NOT THIS TOWN'S OLDER PROSE", () => {
    // A different seed reads as `none`, never as `prior`: there is no honest caption for it, and
    // captioning it would put one town's text on another town's page with a soft label.
    const prose = renderedAt(0);
    expect(surveyStateOf(prose, { advanceSeq: 0, renderedFor: 'someone-else' })).toBe('none');
  });
});

describe('THE TRIGGER — one render per town per epoch, whatever React does', () => {
  test('it sends the request the transport needs, and only when one is owed', async () => {
    const sent = [];
    setScribeRenderer(async (request) => { sent.push(request); return { ok: true }; });
    expect(hasScribeRenderer()).toBe(true);

    const out = await runScribeOpenTrigger({
      state: stateWith(), saveId: 'ashford', campaignId: 'camp-1', flagOn: true, guidance: 'dwell on the docks',
    });
    expect(out).toMatchObject({ render: true, sent: true, reason: 'absent' });
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      saveId: 'ashford', advanceSeq: 0, renderedFor: SEED,
      engineVersion: SCRIBE_ENGINE_VERSION, guidance: 'dwell on the docks',
    });
    expect(sent[0].settlement.name).toBe('Ashford');
  });

  test('⭐ TWO EFFECTS IN ONE TICK SEND ONE RENDER (the ledger is written before the await)', async () => {
    let calls = 0;
    setScribeRenderer(async () => {
      calls += 1;
      await new Promise((resolve) => { setTimeout(resolve, 0); });
      return { ok: true };
    });
    const args = { state: stateWith(), saveId: 'ashford', campaignId: 'camp-1', flagOn: true };
    const [a, b] = await Promise.all([runScribeOpenTrigger(args), runScribeOpenTrigger(args)]);
    expect(calls).toBe(1);
    expect([a.sent, b.sent].filter(Boolean)).toHaveLength(1);
    expect([a.reason, b.reason]).toContain('already-asked');
  });

  test('a remount storm in one epoch sends one render', async () => {
    let calls = 0;
    setScribeRenderer(async () => { calls += 1; return { ok: true }; });
    const args = { state: stateWith(), saveId: 'ashford', campaignId: 'camp-1', flagOn: true };
    for (let mount = 0; mount < 12; mount += 1) await runScribeOpenTrigger(args);
    expect(calls).toBe(1);
  });

  test('⭐ A FAILED RENDER RELEASES THE SLOT, because reopening is the only retry the reader has', async () => {
    let calls = 0;
    setScribeRenderer(async () => { calls += 1; return { ok: false, reason: 'insufficient credits' }; });
    const args = { state: stateWith(), saveId: 'ashford', campaignId: 'camp-1', flagOn: true };
    const first = await runScribeOpenTrigger(args);
    expect(first.result).toMatchObject({ ok: false });
    const second = await runScribeOpenTrigger(args);
    expect(second.sent).toBe(true);
    expect(calls).toBe(2);
  });

  test('a transport that THROWS never reaches the page, and still releases the slot', async () => {
    setScribeRenderer(async () => { throw new Error('network down'); });
    const args = { state: stateWith(), saveId: 'ashford', campaignId: 'camp-1', flagOn: true };
    const out = await runScribeOpenTrigger(args);
    // The hand corpus is always there, so a failure is data, never a thrown error on the dossier.
    expect(out.result).toMatchObject({ ok: false, reason: 'network down' });
    setScribeRenderer(async () => ({ ok: true }));
    expect((await runScribeOpenTrigger(args)).sent).toBe(true);
  });

  test('NEGATIVE CONTROL — with no transport registered nothing is sent and nothing is recorded', async () => {
    setScribeRenderer(null);
    expect(getScribeRenderer()).toBe(null);
    const args = { state: stateWith(), saveId: 'ashford', campaignId: 'camp-1', flagOn: true };
    expect(await runScribeOpenTrigger(args)).toMatchObject({ sent: false, reason: 'no-transport' });
    // The slot was NOT spent: register a transport and the very next open sends.
    let calls = 0;
    setScribeRenderer(async () => { calls += 1; return { ok: true }; });
    await runScribeOpenTrigger(args);
    expect(calls).toBe(1);
  });

  test('the ledger key carries the SEED, so a regenerate under a stable saveId is a new town', async () => {
    expect(attemptKeyOf('ashford', 2, SEED)).toBe(`ashford::2::${SEED}`);
    let calls = 0;
    setScribeRenderer(async () => { calls += 1; return { ok: true }; });
    await runScribeOpenTrigger({ state: stateWith(), saveId: 'ashford', campaignId: 'camp-1', flagOn: true });
    const regenerated = stateWith();
    regenerated.settlement = { ...regenerated.settlement, _seed: 'seed-rerolled' };
    await runScribeOpenTrigger({ state: regenerated, saveId: 'ashford', campaignId: 'camp-1', flagOn: true });
    expect(calls).toBe(2);
  });
});

describe('THE MOUNT — the dossier is where the open is observed, and it costs a dark build nothing', () => {
  const hook = readFileSync(join(ROOT, 'src/hooks/useScribeOpenTrigger.js'), 'utf8');
  const container = readFileSync(join(ROOT, 'src/components/OutputContainer.jsx'), 'utf8');

  test('OutputContainer actually calls the hook, and gates it off every non-owner surface', () => {
    expect(container).toMatch(/useScribeOpenTrigger\(\{\s*enabled: !readOnly && !playerView && !publicDossier, saveId\s*\}\)/);
  });

  test('⛔ THE HOOK IS IN THE DOSSIER CHUNK, SO ITS STATIC IMPORTS ARE AN EXACT SET', () => {
    // The first-paint closure budget is an exact ratchet. Everything the Scribe needs is behind a
    // dynamic import inside the effect; a static import added here is how that budget breaks, so
    // the set is pinned rather than reviewed.
    const statics = [...hook.matchAll(/^import\s.*?from\s+'([^']+)'/gm)].map(m => m[1]).sort();
    expect(statics).toEqual(['../lib/flags.js', '../store/index.js', 'react']);
    expect(hook).toMatch(/await import\('\.\.\/store\/scribeOpenTrigger\.js'\)/);
  });

  test('the hook does nothing at all with the flag dark', () => {
    expect(hook).toMatch(/if \(!flag\('scribe'\)\) return undefined;/);
  });

  test('editing the instructions box does NOT re-fire the trigger (rule 3: a badge, not a render)', () => {
    const deps = hook.match(/\}, \[(enabled[^\]]*)\]\);/);
    expect(deps, 'the effect dependency array must be readable here').toBeTruthy();
    expect(deps[1]).not.toContain('guidance');
    expect(deps[1]).toContain('advanceSeq');
  });
});
