/**
 * tests/store/scribeTransport.test.js — THE TRANSPORT (W2 commit 5).
 *
 * The client half of the render is deliberately thin, and the arms below pin the three things a
 * thin half can still get wrong: sending a tab that renders nothing (a paid call for no lines),
 * landing an answer in a shape the artefact cannot read, and holding a provider secret it has no
 * business holding.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  firingTabs, landTabAnswer, postTabRender, registerScribeTransport, retireForRedraw, tabRequestBody,
} from '../../src/store/scribeTransport.js';
import { getScribeRenderer, setScribeRenderer } from '../../src/lib/scribeRenderer.js';
import { proseOf, surveyNotesOf, unitsFor } from '../../src/lib/scribeArtefact.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

afterEach(() => setScribeRenderer(null));

describe('WHICH TABS ARE SENT — a fact about the town, never a list to maintain', () => {
  it('only tabs whose page actually composes a line are sent', () => {
    const pages = {
      defense: [{ kind: 'machine' }, { kind: 'composed' }],
      war: [{ kind: 'machine' }],
      economics: [],
    };
    const render = (unused, tab) => pages[tab] || [];
    expect(firingTabs({}, render, ['defense', 'war', 'economics'])).toEqual(['defense']);
  });

  it('a tab whose render THROWS is skipped rather than charged for', () => {
    const render = (unused, tab) => {
      if (tab === 'war') throw new Error('headless');
      return [{ kind: 'composed' }];
    };
    expect(firingTabs({}, render, ['defense', 'war'])).toEqual(['defense']);
  });
});

describe('LANDING ONE TAB\'S ANSWER', () => {
  const keys = {
    advanceSeq: 0, renderedFor: 'seed-a', renderedAt: '2026-09-14T00:00:00.000Z',
    version: { engine: 'gen-1/sim-1' },
  };
  const answer = {
    blocks: {
      'DS-DEF-2': { 'FAMILY: acute crisis': [{ vid: 3, spine: 'A rendered line.', faces: [], notebook: [] }] },
      'DS-DEF-5': { 'FORCE: militia': [{ vid: 1, spine: 'Another.', faces: [], notebook: [] }] },
    },
  };

  it('lands every block through the artefact writer, readable for its own seed and engine', () => {
    const out = landTabAnswer({ id: 't', name: 'Ashford' }, answer, keys);
    const prose = proseOf(out);
    expect(prose).not.toBe(null);
    expect(unitsFor(prose, {
      blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis',
      renderedFor: 'seed-a', engineVersion: 'gen-1/sim-1',
    })[0].spine).toBe('A rendered line.');
    expect(unitsFor(prose, { blockId: 'DS-DEF-5', poolKey: 'FORCE: militia', renderedFor: 'seed-a' }))
      .toHaveLength(1);
    // NEGATIVE CONTROL — a different seed reads nothing back, so a landing cannot be mis-keyed.
    expect(unitsFor(prose, {
      blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis', renderedFor: 'seed-b',
    })).toBe(null);
  });

  it('an answer with no blocks is the same settlement back', () => {
    const town = { id: 't' };
    expect(landTabAnswer(town, {}, keys)).toBe(town);
    expect(landTabAnswer(town, { blocks: null }, keys)).toBe(town);
  });

  it('two tabs landing in turn both survive, which is what per-block landing means', () => {
    const first = landTabAnswer({ id: 't' }, { blocks: { A: { p: [{ vid: 1, spine: 'one', faces: [], notebook: [] }] } } }, keys);
    const second = landTabAnswer(first, { blocks: { B: { q: [{ vid: 1, spine: 'two', faces: [], notebook: [] }] } } }, keys);
    const prose = proseOf(second);
    expect(Object.keys(prose.current.blocks).sort()).toEqual(['A', 'B']);
  });
});

describe('THE POST', () => {
  it('goes to the scribe function with the bearer, and is ok only on an ok body', async () => {
    const calls = [];
    const fetchImpl = vi.fn((url, init) => {
      calls.push({ url, init });
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ ok: true, blocks: {} }) });
    });
    const out = await postTabRender({ tab: 'defense' }, 'tok-1', fetchImpl);
    expect(out.ok).toBe(true);
    expect(String(calls[0].url)).toMatch(/\/functions\/v1\/scribe-render$/);
    expect(calls[0].init.headers.Authorization).toBe('Bearer tok-1');
    expect(JSON.parse(calls[0].init.body).tab).toBe('defense');
  });

  it('a 200 whose body is not ok is NOT ok, and a throw is data rather than an error', async () => {
    const notOk = await postTabRender({}, 't', () => Promise.resolve({
      ok: true, status: 200, json: () => Promise.resolve({ ok: false, error: 'no credits' }),
    }));
    expect(notOk.ok).toBe(false);
    const threw = await postTabRender({}, 't', () => Promise.reject(new Error('offline')));
    expect(threw).toEqual({ ok: false, status: 0, data: null });
  });
});

describe('⭐⭐ ONE RENDER, ONE CHARGE — the body the server keys the session from (W5b)', () => {
  it('carries the render IDENTITY and the tab count, and no token of any kind', () => {
    const body = tabRequestBody(
      { saveId: 's1', advanceSeq: 4, renderedFor: 'seed-a', engineVersion: 'gen-1/sim-1', guidance: 'g' },
      'defense', { pools: [] }, null, 7,
    );
    // The identity is the tuple the OPEN TRIGGER already keys on, which is why no protocol change
    // was needed: a render is (save, epoch, seed) and the server derives the session from it.
    expect(body).toMatchObject({ saveId: 's1', advanceSeq: 4, renderedFor: 'seed-a' });
    expect(body.tabsExpected).toBe(7);
    // ⛔ NEGATIVE CONTROL: there is NO session id, token or nonce in the body. A client-supplied
    // one would let a forged value buy a render or charge for one twice.
    for (const forbidden of ['sessionId', 'session_id', 'renderToken', 'nonce']) {
      expect(Object.keys(body), `the body must not carry ${forbidden}`).not.toContain(forbidden);
    }
  });

  it('a missing or nonsense tab count is 0, never NaN on the wire', () => {
    const req = { saveId: 's', advanceSeq: 0, renderedFor: 'x', engineVersion: 'e' };
    expect(tabRequestBody(req, 't', {}, null).tabsExpected).toBe(0);
    expect(tabRequestBody(req, 't', {}, null, 'seven').tabsExpected).toBe(0);
  });

  it('⛔ AND THE TRANSPORT COUNTS WHAT THE SERVER SAID IT BILLED, never what it asked for', () => {
    // `renderScribe` needs the store and the card builder, so the loop is pinned at the source:
    // `charged` moves ONLY on the server's own `charged: true`, and it is what the result reports.
    const source = readFileSync(join(ROOT, 'src/store/scribeTransport.js'), 'utf8');
    expect(source).toMatch(/if \(sent\.data\.charged === true\) charged \+= 1;/);
    expect(source).toMatch(/return \{ ok: true, tabs: tabs\.length, landed, charged \};/);
    // The client holds no opinion about the price of a render: it sends a card and reads a receipt.
    expect(source).not.toMatch(/charged\s*=\s*[1-9]/);
  });
});

describe('REGISTRATION', () => {
  it('installs itself as the one renderer, idempotently', () => {
    expect(getScribeRenderer()).toBe(null);
    registerScribeTransport();
    const first = getScribeRenderer();
    expect(typeof first).toBe('function');
    registerScribeTransport();
    expect(getScribeRenderer()).toBe(first);
  });
});

describe('⛔ NO PROVIDER CALL FROM THE CLIENT, AND NO KEY', () => {
  const source = readFileSync(join(ROOT, 'src/store/scribeTransport.js'), 'utf8');

  it('the transport names no provider host, no model and no key', () => {
    // The brief, the model, the refuter and the money all live server-side. A client that named
    // any of them would be a second place to keep them right, and one of them would be a secret.
    for (const forbidden of ['api.anthropic.com', 'x-api-key', 'ANTHROPIC', 'claude-opus', 'openai']) {
      expect(source.includes(forbidden), `the transport must not name ${forbidden}`).toBe(false);
    }
  });

  it('it POSTs a CARD, never a settlement blob', () => {
    // `townCard` collapses the town to what the page already draws: no seed, no config, no covert
    // field the reader does not already see. Sending the blob would widen the boundary for nothing.
    expect(source).toMatch(/townCard\(settlement, \{ tab, audience: 'dm' \}\)/);
    expect(source).toMatch(/card,/);
    expect(source).not.toMatch(/body: JSON\.stringify\(\{[\s\S]{0,200}settlement,/);
  });
});

describe('⭐ THE REDRAW RETIRES BEFORE IT LANDS (design §5c rule 1, ruling 16)', () => {
  const keys = {
    advanceSeq: 4, renderedFor: 'seed-a', renderedAt: '2026-09-14T00:00:00.000Z',
    version: { engine: 'gen-1/sim-1' },
  };
  const scribed = () => landTabAnswer({ id: 't', name: 'Ashford' }, {
    blocks: { 'DS-DEF-2': { 'FAMILY: acute crisis': [{ vid: 3, spine: 'The first survey.', faces: [], notebook: [] }] } },
  }, keys);

  it('the prior render moves WHOLE into the past lane marked redone, and nothing is deleted', () => {
    const before = scribed();
    const after = retireForRedraw(before, { at: '2026-09-15T00:00:00.000Z', nonce: 'redo:1' });
    const prose = proseOf(after);
    expect(prose.current).toBe(null);
    expect(prose.epochs).toHaveLength(1);
    expect(prose.epochs[0]).toMatchObject({
      advanceSeq: 4, state: 'redone', redoneAt: '2026-09-15T00:00:00.000Z', nonce: 'redo:1',
    });
    // The words are still there: a redone epoch is readable, which is the whole of the owner's rule.
    expect(prose.epochs[0].blocks['DS-DEF-2']['FAMILY: acute crisis'][0].spine).toBe('The first survey.');
    // And the settlement it was read off is untouched — every writer here is pure.
    expect(proseOf(before).current.advanceSeq).toBe(4);
  });

  it('the fresh draw lands on the emptied epoch, so one seq holds two renders and one is current', () => {
    const retired = retireForRedraw(scribed(), { at: '2026-09-15T00:00:00.000Z', nonce: 'redo:1' });
    const redrawn = landTabAnswer(retired, {
      blocks: { 'DS-DEF-2': { 'FAMILY: acute crisis': [{ vid: 3, spine: 'The second survey.', faces: [], notebook: [] }] } },
    }, { ...keys, renderedAt: '2026-09-15T00:00:00.000Z' });
    const prose = proseOf(redrawn);
    expect(prose.current.advanceSeq).toBe(4);
    expect(unitsFor(prose, { blockId: 'DS-DEF-2', poolKey: 'FAMILY: acute crisis', renderedFor: 'seed-a' })[0].spine)
      .toBe('The second survey.');
    expect(prose.epochs.map((e) => e.state)).toEqual(['redone']);
  });

  it('a town with nothing rendered is the SAME settlement back: a redraw of nothing is a no-op', () => {
    const plain = { id: 't' };
    expect(retireForRedraw(plain, { at: 'x', nonce: 'y' })).toBe(plain);
    expect(retireForRedraw(null, { at: 'x', nonce: 'y' })).toBe(null);
  });

  it('⛔ THE RETIREMENT RIDES WITH THE LANDING, so a failed redraw leaves the prior survey standing', () => {
    // Retiring and persisting before the model answers would mean a redraw that failed had moved
    // the survey into the past and put nothing in its place. The source pins the order: the retire
    // is held in a local, and `nothing-landed` returns BEFORE the store write.
    const source = readFileSync(join(ROOT, 'src/store/scribeTransport.js'), 'utf8');
    const retireAt = source.indexOf('retireForRedraw(settlement,');
    const guardAt = source.indexOf("return { ok: false, reason: 'nothing-landed'");
    const writeAt = source.indexOf('store.useStore.setState');
    expect(retireAt).toBeGreaterThan(0);
    expect(guardAt).toBeGreaterThan(retireAt);
    expect(writeAt).toBeGreaterThan(guardAt);
  });

  it('⛔ A REDRAW MOVES NO PRICING BYTE: it is a render, billed through the same one SKU', () => {
    const source = readFileSync(join(ROOT, 'src/store/scribeTransport.js'), 'utf8');
    const pricing = readFileSync(join(ROOT, 'src/config/pricing.js'), 'utf8');
    expect(source).not.toMatch(/redraw['"]?\s*:\s*\d/);
    expect(pricing).not.toContain('dossierRedraw');
    expect(pricing).toContain('dossierProse');
  });
});

describe('⭐ THE DAILY-LIFE BLOCK LANDS LIKE ANY OTHER (W4 car 3, design §5c rule 4)', () => {
  it('a DS-DAILY answer reads back per beat, which is what makes daily life the seventh tab call', () => {
    const keys = {
      advanceSeq: 0, renderedFor: 'seed-a', renderedAt: '2026-09-14T00:00:00.000Z',
      version: { engine: 'gen-1/sim-1' },
    };
    const out = landTabAnswer({ id: 't' }, {
      blocks: {
        'DS-DAILY': {
          dawn: [{ vid: 0, spine: 'The gate crew unbars the doors.', faces: [], notebook: [] }],
          night: [{ vid: 0, spine: 'By dark the watch walks the lanes.', faces: [], notebook: [] }],
        },
        'DS-ECO-8': { PROSPEROUS: [{ vid: 2, spine: 'People here put things by.', faces: [], notebook: [] }] },
      },
    }, keys);
    const prose = proseOf(out);
    expect(unitsFor(prose, { blockId: 'DS-DAILY', poolKey: 'dawn', renderedFor: 'seed-a' })[0].spine)
      .toBe('The gate crew unbars the doors.');
    expect(unitsFor(prose, { blockId: 'DS-DAILY', poolKey: 'night', renderedFor: 'seed-a' })[0].spine)
      .toBe('By dark the watch walks the lanes.');
    // A beat nobody wrote reads back null and the tab draws its own offline paragraph.
    expect(unitsFor(prose, { blockId: 'DS-DAILY', poolKey: 'midday', renderedFor: 'seed-a' })).toBe(null);
    // And the tab's one composed pool landed in the same call, because it is ONE tab render.
    expect(unitsFor(prose, { blockId: 'DS-ECO-8', poolKey: 'PROSPEROUS', renderedFor: 'seed-a' }))
      .toHaveLength(1);
  });

  it('⛔ AND THE TAB IS ALREADY IN THE FIRING SET, so no list had to be maintained for it', () => {
    // `firingTabs` asks the page, not a table: daily_life composes DS-ECO-8's one line, so it has
    // always been sent. The beats ride the render that tab was already getting.
    const render = (unused, tab) => (tab === 'daily_life' ? [{ kind: 'composed' }] : []);
    expect(firingTabs({}, render, ['daily_life', 'war'])).toEqual(['daily_life']);
  });
});

describe('⭐ THE VERDICT ROWS LAND WITH THEIR BLOCK (W4 car 4, ruling 6)', () => {
  const keys = {
    advanceSeq: 0, renderedFor: 'seed-a', renderedAt: '2026-09-14T00:00:00.000Z',
    version: { engine: 'gen-1/sim-1' },
  };

  it('each block takes its own share, and a pool that landed NOTHING still files a row', () => {
    const out = landTabAnswer({ id: 't' }, {
      tab: 'defense',
      blocks: {
        'DS-DEF-2': { crisis: [{ vid: 3, spine: 'A line.', faces: [], notebook: [] }] },
        'DS-DEF-5': { militia: [{ vid: 1, spine: 'Another.', faces: [], notebook: [] }] },
      },
      verdicts: [
        { blockId: 'DS-DEF-2', poolKey: 'crisis', vid: 3, verdict: 'PATCHED', arms: ['T1-FIELD'], patched: ['face 0'] },
        { blockId: 'DS-DEF-5', poolKey: 'militia', vid: 1, verdict: 'WITHHELD', arms: ['Q'], patched: [] },
        // ⛔ THE ONE THAT MATTERS: refused whole, so it has no unit in `blocks` at all.
        { blockId: 'DS-DEF-9', poolKey: 'wall', vid: 7, verdict: 'FAIL', arms: ['A6'], patched: [] },
      ],
    }, keys);
    const notes = surveyNotesOf(proseOf(out));
    expect(notes.total).toBe(3);
    expect(notes.counts).toEqual({ failed: 1, patched: 1, withheld: 1 });
    expect(notes.tabs[0].tab).toBe('defense');
    expect(notes.tabs[0].rows.map((r) => r.blockId)).toEqual(['DS-DEF-2', 'DS-DEF-5', 'DS-DEF-9']);
    // The rendered prose is untouched by any of it: a receipt is a report, never a change.
    expect(unitsFor(proseOf(out), { blockId: 'DS-DEF-2', poolKey: 'crisis', renderedFor: 'seed-a' })[0].spine)
      .toBe('A line.');
  });

  it('an answer carrying no verdicts lands exactly as it did before receipts existed', () => {
    const out = landTabAnswer({ id: 't' }, {
      tab: 'defense',
      blocks: { 'DS-DEF-2': { crisis: [{ vid: 3, spine: 'A line.', faces: [], notebook: [] }] } },
    }, keys);
    expect(surveyNotesOf(proseOf(out)).total).toBe(0);
    expect(proseOf(out).current.receipts).toEqual([]);
  });

  it('two tabs each file their own rows under their own name', () => {
    const first = landTabAnswer({ id: 't' }, {
      tab: 'defense',
      blocks: { 'DS-DEF-2': { crisis: [{ vid: 3, spine: 'A.', faces: [], notebook: [] }] } },
      verdicts: [{ blockId: 'DS-DEF-2', poolKey: 'crisis', vid: 3, verdict: 'FAIL', arms: ['D'], patched: [] }],
    }, keys);
    const second = landTabAnswer(first, {
      tab: 'power',
      blocks: { 'DS-POW-1': { seat: [{ vid: 2, spine: 'B.', faces: [], notebook: [] }] } },
      verdicts: [{ blockId: 'DS-POW-1', poolKey: 'seat', vid: 2, verdict: 'WITHHELD', arms: ['Q'], patched: [] }],
    }, keys);
    const notes = surveyNotesOf(proseOf(second));
    expect(notes.tabs.map((t) => t.tab)).toEqual(['defense', 'power']);
  });
});
