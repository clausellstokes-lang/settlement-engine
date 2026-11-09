/**
 * @vitest-environment node
 *
 * THE RECORD'S SELF-CHECK PRINTS ONLY ON THE DM'S RECEIPT (W7 HOOKS, the chair's ruling of 2026-11-08): the
 * `record_coherence_battery` judgment (src/generators/recordBatteryFindings.js :: recordBatteryJudgment) is an
 * internal check. It stays on the record and on the DM's "why" layer (VersionsTab :: GenerationReceipt), and the
 * PDF's Identity & Daily Life chapter, a narrative chapter of the dossier, prints neither its label nor its summary.
 * Measured before the cure: the soak's 1,000 printed it in the PDF text of every needs-review settlement
 * (soak1k-3, soak1k-4 among the sample) and on no other surface but the receipt.
 */
import React from 'react';
import { describe, test, expect, beforeAll } from 'vitest';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { recordBatteryJudgment } from '../../src/generators/recordBatteryFindings.js';

/** Text leaves of a @react-pdf element tree, calling each function component (quartersNotPrinted.test.jsx's walk). */
function pdfLeaves(node, out, depth = 0) {
  if (node == null || typeof node === 'boolean' || depth > 400) return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) pdfLeaves(n, out, depth + 1); return out; }
  if (typeof node === 'object') {
    const t = node.type;
    if (typeof t === 'function') {
      const rendered = t.prototype?.isReactComponent ? new t(node.props).render() : t(node.props);
      return pdfLeaves(rendered, out, depth + 1);
    }
    if (t && typeof t === 'object' && typeof t.type === 'function') return pdfLeaves(t.type(node.props), out, depth + 1);
    if (t === 'TEXT' || t === 'LINK') { const seg = []; pdfLeaves(node.props?.children, seg, depth + 1); out.push(`${seg.join('')}\n`); return out; }
    if (typeof node.props?.render === 'function') return out;
    return pdfLeaves(node.props?.children, out, depth + 1);
  }
  return out;
}

const SEEDS = [3, 4];
const ROWS = [];
beforeAll(async () => {
  await ensureLaws();
  for (const i of SEEDS) {
    const s = normalizeSettlement(birth(i).settlement);
    const vm = buildViewModel({ settlement: s, phase: 'canon' });
    const text = pdfLeaves(React.createElement(IdentityDailyLife, { settlement: s, narrativeMode: false, vm, stateProse: null }), []).join('');
    ROWS.push({ i, s, text });
  }
}, 120_000);

describe('the record battery prints on the DM receipt only', () => {
  // RE-KEYED BY CAUSE (STYLE-RULINGS-2 B4, 2026-11-09): the whole coherence box left the chapter
  // ("GENERATION COHERENCE · 17/17 checks passed" is the engine's self-check, machinery on the reader's
  // page), so the battery judgment's absence is now asserted beside the box's absence, on a chapter the
  // test proves rendered by its own heading.
  test('the PDF chapter prints no coherence box and no record battery judgment', () => {
    const { label, summary } = recordBatteryJudgment({});
    for (const { i, s, text } of ROWS) {
      const judgment = (s.generationCoherenceReceipt?.judgments || []).find((j) => j?.id === 'record_coherence_battery');
      // the record still carries the judgment, needing review on these seeds (so the cut is live, not vacuous)
      expect(judgment?.status, `soak1k-${i}`).toBe('needs_review');
      expect(text, `soak1k-${i}`).toContain('Identity & Daily Life');
      // anchored: the chapter text is asserted to carry its heading one line above
      expect(text, `soak1k-${i}`).not.toContain('GENERATION COHERENCE');
      expect(text, `soak1k-${i}`).not.toContain('checks passed'); // anchored: same chapter text
      expect(text, `soak1k-${i}`).not.toContain(label); // anchored: same chapter text
      expect(text, `soak1k-${i}`).not.toContain(summary); // anchored: same chapter text
    }
  });
});
