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
  firingTabs, landTabAnswer, postTabRender, registerScribeTransport,
} from '../../src/store/scribeTransport.js';
import { getScribeRenderer, setScribeRenderer } from '../../src/lib/scribeRenderer.js';
import { proseOf, unitsFor } from '../../src/lib/scribeArtefact.js';

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
