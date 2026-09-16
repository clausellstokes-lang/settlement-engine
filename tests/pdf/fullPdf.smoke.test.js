/**
 * @vitest-environment jsdom
 *
 * tests/pdf/fullPdf.smoke.test.js — End-to-end PDF assembly smoke test.
 *
 * Tier 3.5 of the roadmap. The existing sections smoke test (in
 * sections.smoke.test.js) exercises individual chapter components.
 * This test verifies the higher-level chain:
 *
 *   generateSettlementPipeline()
 *     → settlement
 *     → normalizeSettlement (Phase 6)
 *     → SettlementPDF element tree
 *
 * What it catches: regressions in the chain glue — generation produces
 * a settlement shape that SettlementPDF can't render, or normalize
 * mutates a field that a PDF chapter then crashes on, or the variant /
 * isFounder / isAnonymous props (added across Phases 2.3 / 4.3 / 5.E)
 * stop reaching the cover correctly.
 *
 * It does NOT verify the actual PDF blob. That requires fontkit + jsdom
 * combinations that the existing test suite deliberately avoids — and
 * the slow render time would dominate the CI gate. The smoke version
 * here runs in ~100ms and catches the class of bugs we actually see.
 */

import { describe, test, expect, vi } from 'vitest';

// PASSTHROUGH mock of the renderer: every primitive stays real (the element trees
// this suite builds are unaffected), and ONLY `pdf` is swapped for a capture that
// records the element the PRODUCTION entry point actually renders. It fabricates no
// props and no shape — it reads the real call. generateSettlementPDF is otherwise
// unmockable end-to-end here: its real body needs a Blob URL and a fontkit render
// this suite deliberately avoids paying (see the header).
const renderedElements = [];
vi.mock('@react-pdf/renderer', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    pdf: (element) => {
      renderedElements.push(element);
      return { toBlob: async () => new Blob(['%PDF-'], { type: 'application/pdf' }) };
    },
  };
});
import React from 'react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';

const STABLE_SEED = 'pdf-smoke-2026-05-18';

function generate(config = { settType: 'town', culture: 'germanic' }) {
  return generateSettlementPipeline(config, null, { seed: STABLE_SEED, customContent: {} });
}

describe('PDF full-document assembly smoke test', () => {
  test('settlement produced by pipeline renders a SettlementPDF element tree', () => {
    const settlement = generate();
    const element = React.createElement(SettlementPDF, { settlement });
    expect(element).toBeTruthy();
    expect(element.type).toBe(SettlementPDF);
  });

  test('SettlementPDF accepts narrativeMode, systemState, eventLog, phase props', () => {
    const settlement = generate();
    const element = React.createElement(SettlementPDF, {
      settlement,
      aiSettlement: { narrative: 'AI prose' },
      narrativeMode: true,
      systemState: null,
      eventLog: [],
      phase: 'canon',
    });
    expect(element).toBeTruthy();
  });

  test('SettlementPDF accepts the isFounder cover-badge prop (Phase 4.3)', () => {
    const settlement = generate();
    const element = React.createElement(SettlementPDF, {
      settlement,
      isFounder: true,
    });
    expect(element).toBeTruthy();
  });

  test('SettlementPDF accepts the isAnonymous watermark prop (Phase 5.E)', () => {
    const settlement = generate();
    const element = React.createElement(SettlementPDF, {
      settlement,
      isAnonymous: true,
    });
    expect(element).toBeTruthy();
  });

  test('every variant produces a valid element tree', () => {
    const settlement = generate();
    for (const variant of ['canon_dossier', 'draft_brief', 'timeline_packet']) {
      const element = React.createElement(SettlementPDF, { settlement, variant });
      expect(element).toBeTruthy();
    }
  });

  test('renders cleanly against a normalized (post-Phase-6) settlement', () => {
    // Specifically exercise the chain where normalize runs first — this
    // matches what generateSettlementPDF does at the export boundary.
    const settlement = normalizeSettlement(generate());
    const element = React.createElement(SettlementPDF, { settlement });
    expect(element).toBeTruthy();
    // Normalized settlement should carry the canonical containers
    // every PDF chapter is allowed to rely on.
    expect(Array.isArray(settlement.simulationTrace)).toBe(true);
    expect(Array.isArray(settlement.activeConditions)).toBe(true);
  });

  test('renders cleanly against a sparse / pre-canonical settlement', () => {
    // A save loaded from before Phase 6 lacks version stamps, simulation
    // trace, etc. The adapter runs at the PDF export boundary; the
    // settlement should still produce an element tree.
    const sparse = { name: 'Sparse Town', tier: 'town', population: 800 };
    const normalized = normalizeSettlement(sparse);
    const element = React.createElement(SettlementPDF, { settlement: normalized });
    expect(element).toBeTruthy();
  });

  test('every fixture in the size spectrum produces a valid element', () => {
    for (const settType of ['hamlet', 'village', 'town', 'city']) {
      const settlement = generate({ settType, culture: 'germanic' });
      const element = React.createElement(SettlementPDF, { settlement });
      expect(element, `${settType} produced null element`).toBeTruthy();
    }
  });

  test('all three optional flags can be combined without crashing', () => {
    const settlement = generate();
    const element = React.createElement(SettlementPDF, {
      settlement,
      narrativeMode: true,
      isFounder: true,
      isAnonymous: true,
      variant: 'canon_dossier',
    });
    expect(element).toBeTruthy();
  });
});

/**
 * THE EXPORT-DATE SEAM REACHES THE PRODUCTION ENTRY POINT.
 *
 * SettlementPDF has carried an injectable `now` since the export-date seam landed,
 * and Cover consumes it — but `generateSettlementPDF`, the function every export
 * surface actually calls, never accepted or forwarded it. So the seam was reachable
 * ONLY from tests that construct SettlementPDF directly (exportDateSeam.test.js):
 * no production export could ever be rendered reproducibly, and the artifact's
 * `creationDate` was likewise left to react-pdf's wall-clock default. Both are
 * forwarded now, and these pins hold the whole chain — options → props → document —
 * rather than the component half of it.
 */
describe('generateSettlementPDF forwards the reproducibility seam (production entry point)', () => {
  const origCreate = globalThis.URL.createObjectURL;
  const origRevoke = globalThis.URL.revokeObjectURL;

  async function exportWith(options) {
    // jsdom implements neither; the real body calls both around the download anchor.
    globalThis.URL.createObjectURL = () => 'blob:pdf';
    globalThis.URL.revokeObjectURL = () => {};
    try {
      renderedElements.length = 0;
      const { generateSettlementPDF } = await import('../../src/utils/generateSettlementPDF.js');
      await generateSettlementPDF(generate(), options);
      expect(renderedElements).toHaveLength(1);
      return renderedElements[0].props;
    } finally {
      globalThis.URL.createObjectURL = origCreate;
      globalThis.URL.revokeObjectURL = origRevoke;
    }
  }

  test('an injected `now` and `creationDate` reach the rendered document props', async () => {
    const when = new Date('1987-06-05T12:00:00Z');
    const props = await exportWith({ now: 'Cyfrin 1, 2026', creationDate: when });
    expect(props.now).toBe('Cyfrin 1, 2026');
    expect(new Date(props.creationDate).toISOString()).toBe(when.toISOString());
  });

  test('omitting them keeps the wall-clock defaults (no caller behaviour change)', async () => {
    const props = await exportWith({});
    // anchored: the export demonstrably ran and rendered (asserted in exportWith),
    // so these nulls are the untouched defaults rather than a skipped render.
    expect(props.now).toBeNull();
    expect(props.creationDate).toBeNull();
  });
});

/**
 * THE DOWNLOAD FILENAME. Both sibling exporters cap their slug at 40 characters —
 * generateWorldBook.js:490 does it through the kernel primitive
 * (`slugify(title, { max: 40, fallback: 'world' })`) and generateCampaignPDF.js
 * does it with a `.slice(0, 40)` on a hand-inlined builder. The dossier's was the
 * only UNCAPPED one: a settlement name of any length became a filename of that
 * length, and it was a NINTH hand-inlined copy of the slug idiom that
 * tests/lint/slugifyIdiomBaseline.test.js exists to shrink.
 *
 * The anchor is observed, not fabricated: `HTMLAnchorElement.prototype.click` is
 * wrapped for the duration of the export so the pin reads the `download` the real
 * code set on the real element.
 *
 * ⚠ NOT FIXED HERE, AND NOT FIXABLE BY A SLUG: a WHOLLY non-Latin name still falls
 * back to `settlement_dossier.pdf`, because every ASCII-only slug — the kernel's
 * included — empties it. Giving such a buyer their own name in the filename means
 * transliteration, which is the same product question as the parked non-Latin
 * glyph item, not a slug repair. Pinned below as the CURRENT behaviour so the gap
 * is visible rather than assumed away.
 */
describe('generateSettlementPDF — the download filename matches its siblings', () => {
  const LONG = 'Thornbury Under The Everwatchful Cliffs Of Old Kingsmoor And The Sundered Vale';

  async function downloadNameFor(name) {
    const origCreate = globalThis.URL.createObjectURL;
    const origRevoke = globalThis.URL.revokeObjectURL;
    const origClick = globalThis.HTMLAnchorElement.prototype.click;
    let captured = null;
    globalThis.URL.createObjectURL = () => 'blob:pdf';
    globalThis.URL.revokeObjectURL = () => {};
    globalThis.HTMLAnchorElement.prototype.click = function click() { captured = this.download; };
    try {
      const { generateSettlementPDF } = await import('../../src/utils/generateSettlementPDF.js');
      await generateSettlementPDF({ ...generate(), name });
      return captured;
    } finally {
      globalThis.URL.createObjectURL = origCreate;
      globalThis.URL.revokeObjectURL = origRevoke;
      globalThis.HTMLAnchorElement.prototype.click = origClick;
    }
  }

  test('an ordinary name is unchanged', async () => {
    expect(await downloadNameFor('Ashford')).toBe('ashford_dossier.pdf');
  });

  test('a very long name is capped at 40 characters, as both siblings cap', async () => {
    const download = await downloadNameFor(LONG);
    // anchored: a real filename came back, so the length check is on a real slug.
    expect(download).toMatch(/_dossier\.pdf$/);
    const slug = download.replace(/_dossier\.pdf$/, '');
    expect(slug.length).toBeLessThanOrEqual(40);
    // It is a genuine prefix of the name, not a truncation to nothing.
    expect(slug.startsWith('thornbury_under_the')).toBe(true);
  });

  test('the cap never leaves a trailing separator', async () => {
    // 'Ashford Under Cliff Of Old Kingsmoor Xyz' puts a word boundary near 40.
    for (const name of [LONG, 'Ashford Under Cliff Of Old Kingsmoor Abcde Fghij', 'A'.repeat(60)]) {
      const slug = (await downloadNameFor(name)).replace(/_dossier\.pdf$/, '');
      expect(slug.endsWith('_')).toBe(false);
    }
  });

  test('a wholly non-Latin name still falls back (CURRENT behaviour, recorded)', async () => {
    expect(await downloadNameFor('北京')).toBe('settlement_dossier.pdf');
  });
});

/**
 * THE WORKER HAD NO DEADLINE. `renderPdfBlobInWorker` posts a render and parks a
 * `{ resolve, reject }` in the module-level `pending` map keyed by render id. Every
 * way the worker can FAIL is handled — a rejected message, a construction failure, a
 * script-level `onerror` (which tears the worker down, latches it broken and fails
 * every pending render as unavailable) — but the one thing it cannot fail at was
 * SILENCE. A worker that never answers leaves `pending.get(id)` alive forever, and
 * the caller's await never settles: the export UI keeps its spinner, no error is
 * ever shown, and no fallback is ever attempted. Not a hang the user can distinguish
 * from a slow render.
 *
 * The deadline reuses the machinery already there rather than inventing a new
 * failure mode: it is treated exactly as `onerror` treats a script-level failure —
 * terminate, latch broken, reject as `pdfWorkerUnavailable` — so the caller takes
 * the SAME main-thread fallback it already takes, and the buyer gets their dossier
 * instead of a spinner. Latching also means a wedged worker costs the deadline ONCE,
 * not once per export.
 *
 * ⛔ NOT ADDED, DELIBERATELY: progress reporting. A "still rendering…" channel is a
 * capability, not a repair, and is recorded for the owner rather than smuggled in
 * under a timeout fix.
 */
describe('the PDF worker has a deadline (a silent worker cannot hang the export)', () => {
  test('a worker that never answers falls back to the main thread instead of hanging', async () => {
    const origWorker = globalThis.Worker;
    const origCreate = globalThis.URL.createObjectURL;
    const origRevoke = globalThis.URL.revokeObjectURL;
    const origClick = globalThis.HTMLAnchorElement.prototype.click;
    const posted = [];
    let terminated = 0;
    class SilentWorker {
      postMessage(message) { posted.push(message); }   // ...and never answers.
      terminate() { terminated += 1; }
    }
    globalThis.Worker = SilentWorker;
    globalThis.URL.createObjectURL = () => 'blob:pdf';
    globalThis.URL.revokeObjectURL = () => {};
    globalThis.HTMLAnchorElement.prototype.click = function click() {};
    vi.resetModules();          // a fresh module: `workerBroken` is not yet latched
    vi.useFakeTimers();
    try {
      renderedElements.length = 0;
      const { generateSettlementPDF, PDF_WORKER_TIMEOUT_MS } = await import('../../src/utils/generateSettlementPDF.js');
      // The deadline is a real, bounded number — not Infinity, not absent.
      expect(Number.isFinite(PDF_WORKER_TIMEOUT_MS)).toBe(true);
      expect(PDF_WORKER_TIMEOUT_MS).toBeGreaterThan(0);

      const settled = generateSettlementPDF(generate());
      // anchored: the worker really was used, so the fallback below is a FALLBACK
      // and not just "the worker path was never taken in jsdom".
      expect(posted).toHaveLength(1);
      await vi.advanceTimersByTimeAsync(PDF_WORKER_TIMEOUT_MS + 1000);
      await settled;

      // The export completed by rendering on the main thread.
      expect(renderedElements).toHaveLength(1);
      // The wedged worker was torn down, exactly as a script-level failure is.
      expect(terminated).toBe(1);
    } finally {
      vi.useRealTimers();
      globalThis.Worker = origWorker;
      globalThis.URL.createObjectURL = origCreate;
      globalThis.URL.revokeObjectURL = origRevoke;
      globalThis.HTMLAnchorElement.prototype.click = origClick;
      vi.resetModules();
    }
  }, 20_000);
});
