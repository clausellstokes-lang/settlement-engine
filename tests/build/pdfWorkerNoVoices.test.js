/** @vitest-environment node */
/**
 * tests/build/pdfWorkerNoVoices.test.js — THE PDF WORKER CARRIES NO LINES (S-G1; the eleventh chair's ruling G1-5 of
 * 2026-11-28, the survey's S-A-2 rule: a worker carries no table).
 *
 * The voices' plan runs on the CALLER's thread (`utils/generateSettlementPDF.js`), which hands the worker the quotes it
 * prints as plain data: kind and id, the text and the signature, never a liar's line or an `inTruth`. So the render
 * worker's closure (`utils/pdfRender.worker.js`, every edge, a dynamic one included: the worker's graph must hold none)
 * reaches nothing under `src/data/voices/` and never the plan that reads it (`domain/voices/voicePlan.js`). Walked by the
 * repository's one source import walker (`tests/helpers/routeClosure.js`).
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { FOLLOW_ALL, chainTo, importClosure } from '../helpers/routeClosure.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const rel = (/** @type {string} */ f) => f.slice(ROOT.length + 1).replace(/\\/g, '/');

describe('the PDF render worker carries no voices line', () => {
  const entry = join(ROOT, 'src/utils/pdfRender.worker.js');
  const { seen, parent } = importClosure([entry], FOLLOW_ALL);

  it('walks the PDF document (a blind walk would pass)', () => {
    expect(seen.has(join(ROOT, 'src/pdf/SettlementPDF.jsx'))).toBe(true);
    expect(seen.has(join(ROOT, 'src/pdf/primitives/CardVoice.jsx')), 'the print twin is in the worker').toBe(true);
  });

  it('reaches nothing under src/data/voices/, and not the plan that reads it', () => {
    const bad = [...seen].filter((f) => rel(f).startsWith('src/data/voices/') || rel(f) === 'src/domain/voices/voicePlan.js');
    expect(bad.map((f) => chainTo(parent, f, ROOT))).toEqual([]);
  });
});
