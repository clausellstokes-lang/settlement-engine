/**
 * tests/store/corpusFactorySlice.test.js — the staging-slice pins (V-5).
 * Every candidate gets provenance; review transitions status; nothing here writes canon.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { createCorpusFactorySlice } from '../../src/store/corpusFactorySlice.js';

/** A minimal immer-free harness: our actions reassign whole arrays, so a plain-object
 *  set/get faithfully exercises them. */
function harness() {
  /** @type {any} */
  let state = {};
  const set = (/** @type {(s:any)=>void} */ fn) => { fn(state); };
  const get = () => state;
  state = createCorpusFactorySlice(set, get);
  return state;
}

beforeEach(() => { try { localStorage.clear(); } catch { /* no-op */ } });

describe('corpusFactorySlice', () => {
  it('stages candidates with full provenance and status:staged', () => {
    const s = harness();
    const n = s.stageCorpusCandidates(
      [{ kind: 'npcVoice', target: 'Harbor-master', text: 'A voice like gravel in a tin cup.' }],
      { model: 'claude-opus-4-8', promptFamily: 'custom-content' },
    );
    expect(n).toBe(1);
    expect(s.corpusCandidates).toHaveLength(1);
    const c = s.corpusCandidates[0];
    expect(c.status).toBe('staged');
    expect(c.kind).toBe('npcVoice');
    expect(c.provenance).toMatchObject({ model: 'claude-opus-4-8', promptFamily: 'custom-content', source: 'ai-draft' });
    expect(typeof c.provenance.date).toBe('string');
  });

  it('drops empty-text items when staging', () => {
    const s = harness();
    const n = s.stageCorpusCandidates([{ kind: 'npcVoice', text: '   ' }, { kind: 'npcVoice', text: 'real' }]);
    expect(n).toBe(1);
  });

  it('review transitions status (approve/reject/revise); unknown status ignored', () => {
    const s = harness();
    s.stageCorpusCandidates([{ kind: 'institutionDesc', text: 'A quiet chapel.' }]);
    const id = s.corpusCandidates[0].id;
    s.reviewCorpusCandidate(id, 'approved');
    expect(s.corpusCandidates[0].status).toBe('approved');
    s.reviewCorpusCandidate(id, 'staged');
    expect(s.corpusCandidates[0].status).toBe('staged');
    s.reviewCorpusCandidate(id, 'nonsense');
    expect(s.corpusCandidates[0].status).toBe('staged'); // ignored
  });

  it('removes a candidate', () => {
    const s = harness();
    s.stageCorpusCandidates([{ kind: 'institutionDesc', text: 'A.' }, { kind: 'institutionDesc', text: 'B.' }]);
    const id = s.corpusCandidates[0].id;
    s.removeCorpusCandidate(id);
    expect(s.corpusCandidates).toHaveLength(1);
    expect(s.corpusCandidates.some((c) => c.id === id)).toBe(false);
  });
});
