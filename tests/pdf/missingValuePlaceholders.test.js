/**
 * @vitest-environment jsdom
 *
 * Pins for the missing-value placeholder sweep.
 *
 * History: StatStrip once rendered the literal string ', ' when a stat value
 * was missing, and a dozen-plus call sites ALSO passed `x || ', '` themselves —
 * so a missing READINESS/SAFETY printed a bare comma-space in the dossier.
 * The fix is two-sided and these tests pin both sides:
 *   1. Value-rendering primitives (StatStrip, StatTile, ScoreCard,
 *      ScoreWithBreakdown) fall back to an em-dash — and still render a
 *      genuine zero rather than swallowing it as falsy.
 *   2. Sections no longer inject ', ' — a sparse settlement renders no
 *      comma-space text node anywhere in the swept chapters.
 *
 * Approach: PDF components are plain hook-free functions returning element
 * trees (react-pdf hosts are string types: 'TEXT', 'VIEW', 'PAGE'). We
 * execute function components recursively and collect the text leaves —
 * no PDF bytes, same trade-off as sections.smoke.test.js.
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { StatStrip } from '../../src/pdf/primitives/Dense.jsx';
import { StatTile } from '../../src/pdf/primitives/StatTile.jsx';
import { ScoreCard, ScoreWithBreakdown } from '../../src/pdf/primitives/Visuals.jsx';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { SummaryPage } from '../../src/pdf/sections/SummaryPage.jsx';
import { Overview } from '../../src/pdf/sections/Overview.jsx';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { PowerStructure } from '../../src/pdf/sections/PowerStructure.jsx';
import { ResourcesProduction } from '../../src/pdf/sections/ResourcesProduction.jsx';
import { ViabilityAssessment } from '../../src/pdf/sections/ViabilityAssessment.jsx';
import { AIAppendix } from '../../src/pdf/sections/AIAppendix.jsx';

// Recursively flatten an element tree to its text leaves. Function-type
// components are executed (they are plain functions in src/pdf — no hooks);
// host elements ('TEXT', 'VIEW', fragments) are walked via props.children.
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') {
    out.push(String(node));
    return out;
  }
  if (Array.isArray(node)) {
    for (const n of node) collectText(n, out);
    return out;
  }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
}

describe('primitive missing-value fallbacks (em-dash, zero-preserving)', () => {
  test('StatStrip renders em-dash for undefined/empty values and keeps zero', () => {
    const texts = collectText(StatStrip({
      stats: [
        { label: 'READINESS', value: undefined },
        { label: 'SAFETY', value: '' },
        { label: 'SCORE', value: 0 },
      ],
    }));
    expect(texts.filter(t => t === '—')).toHaveLength(2);
    expect(texts).toContain('0');
    expect(texts).not.toContain(', ');
  });

  test('StatTile renders em-dash for a missing value and keeps zero', () => {
    expect(collectText(StatTile({ label: 'POP', value: undefined }))).toContain('—');
    expect(collectText(StatTile({ label: 'POP', value: 0 }))).toContain('0');
    expect(collectText(StatTile({ label: 'POP', value: undefined }))).not.toContain(', ');
  });

  test('ScoreCard renders em-dash for a null score and keeps zero', () => {
    expect(collectText(ScoreCard({ label: 'THREAT', score: null }))).toContain('—');
    expect(collectText(ScoreCard({ label: 'THREAT', score: 0 }))).toContain('0');
    expect(collectText(ScoreCard({ label: 'THREAT', score: null }))).not.toContain(', ');
  });

  test('ScoreWithBreakdown renders em-dash for a missing score and keeps zero', () => {
    expect(collectText(ScoreWithBreakdown({ label: 'LEGITIMACY' }))).toContain('—');
    expect(collectText(ScoreWithBreakdown({ label: 'LEGITIMACY', score: 0 }))).toContain('0');
    expect(collectText(ScoreWithBreakdown({ label: 'LEGITIMACY' }))).not.toContain(', ');
  });
});

describe("section sweep — no literal ', ' text node on sparse data", () => {
  // Deliberately threadbare, same shape sections.smoke.test.js uses —
  // every derived stat (prosperity, readiness, governance, …) is missing,
  // which is exactly the state that used to print comma-spaces.
  const SPARSE = { name: 'Sparse', tier: 'thorp', population: 30 };
  let sparseVm;

  beforeAll(() => {
    sparseVm = buildViewModel({ settlement: SPARSE });
  });

  const SECTIONS = [
    ['Cover', Cover],
    ['SummaryPage', SummaryPage],
    ['Overview', Overview],
    ['DefenseSecurity', DefenseSecurity],
    ['PowerStructure', PowerStructure],
    ['ResourcesProduction', ResourcesProduction],
    ['ViabilityAssessment', ViabilityAssessment],
  ];

  test.each(SECTIONS)("%s renders no ', ' placeholder", (_name, Chapter) => {
    const texts = collectText(Chapter({ settlement: SPARSE, vm: sparseVm }));
    expect(texts).not.toContain(', ');
  });

  test('missing stat-strip values surface as em-dash (DefenseSecurity, SummaryPage)', () => {
    expect(collectText(DefenseSecurity({ settlement: SPARSE, vm: sparseVm }))).toContain('—');
    expect(collectText(SummaryPage({ settlement: SPARSE, vm: sparseVm }))).toContain('—');
  });

  test('ViabilityAssessment formatVal: null and shapeless-object metrics render em-dash', () => {
    const vm = {
      ...sparseVm,
      viability: { ...sparseVm.viability, metrics: { waterAccess: null, oddity: {} } },
    };
    const texts = collectText(ViabilityAssessment({ settlement: SPARSE, vm }));
    expect(texts.filter(t => t === '—').length).toBeGreaterThanOrEqual(2);
    expect(texts).not.toContain(', ');
  });

  test('AIAppendix connection endpoints fall back to em-dash, not comma-space', () => {
    const vm = {
      aiAppendix: {
        connectionsMap: [
          { from: 'Mira Veld', to: {}, relationship: 'owes' },
          { from: null, to: 'Harbor Guild' },
        ],
      },
    };
    const texts = collectText(AIAppendix({ settlement: SPARSE, narrativeMode: true, vm }));
    expect(texts.filter(t => t === '—')).toHaveLength(2);
    expect(texts).toContain('Mira Veld');
    expect(texts).toContain('Harbor Guild');
    expect(texts).not.toContain(', ');
  });
});
