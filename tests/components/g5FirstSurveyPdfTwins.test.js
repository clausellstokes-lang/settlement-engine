/**
 * g5FirstSurveyPdfTwins.test.js — Wave R-2 Lane C: the PDF-twin half of the
 * G5 first-survey framing (carried from Wave R-1's recorded deferral: "PDF
 * twins ViabilityAssessment.jsx / Overview.jsx render G5 records unframed").
 *
 * The web halves are pinned in tests/components/g5FirstSurveyCopy.test.js;
 * this file holds their PDF chapters to the same vintage:
 *
 *   • ViabilityAssessment: the STRUCTURAL VIOLATIONS and MAGIC DEPENDENCY
 *     headers carry "· FIRST SURVEY" (both render generation-frozen G5
 *     records). The verdict summary is deliberately NOT framed — it is
 *     user-editable prose (EditableProse `viability.summary`), not a frozen
 *     record.
 *   • Overview: the Systems Health caption is the byte-for-byte twin of
 *     OverviewTab's caption (frozen bars/statuses + the declared-live Food
 *     Security carve-out, FROZEN_VS_LIVE grammar), and the WARNINGS & NOTES
 *     header carries the vintage (its merged sources — warnings,
 *     coherenceNotes, structuralSuggestions — are all generation-frozen).
 *
 * Copy is one-string vetoable: a deliberate reword updates the POSITIVE pins
 * in the same change; the NEGATIVE pins are the invariant (bare present-tense
 * headers stay dead). Idiom: comment-stripped source scans
 * (tests/components/frozenTenseDefenseCopy.test.js).
 */
import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}
const read = (file) => stripComments(fs.readFileSync(path.join(ROOT, file), 'utf8'));

const VIABILITY_PDF = 'src/pdf/sections/ViabilityAssessment.jsx';
const OVERVIEW_PDF = 'src/pdf/sections/Overview.jsx';
const OVERVIEW_TAB = 'src/components/new/tabs/OverviewTab.jsx';

// The Systems Health caption — ONE sentence, kept byte-identical between the
// web tab and its PDF twin (screen↔PDF parity by construction, not by comment).
const SYSTEMS_HEALTH_CAPTION = 'Score bars and the Viability and Defense statuses are as judged at the first survey; Food Security is re-judged as the campaign advances.';

describe('G5 first-survey framing — PDF ViabilityAssessment twin', () => {
  test('the STRUCTURAL VIOLATIONS header carries the vintage', () => {
    const src = read(VIABILITY_PDF);
    expect(src).toMatch(/STRUCTURAL VIOLATIONS · FIRST SURVEY/);
    // Negative: the bare header stays dead.
    expect(src).not.toMatch(/STRUCTURAL VIOLATIONS\s*<\/Text>/);
  });

  test('the MAGIC DEPENDENCY header carries the vintage', () => {
    const src = read(VIABILITY_PDF);
    expect(src).toMatch(/MAGIC DEPENDENCY · FIRST SURVEY/);
    expect(src).not.toMatch(/MAGIC DEPENDENCY\s*<\/Text>/);
  });
});

describe('G5 first-survey framing — PDF Overview twin', () => {
  test('the Systems Health caption is the byte-for-byte twin of OverviewTab', () => {
    expect(read(OVERVIEW_PDF)).toContain(SYSTEMS_HEALTH_CAPTION);
    expect(read(OVERVIEW_TAB)).toContain(SYSTEMS_HEALTH_CAPTION);
  });

  test('the WARNINGS & NOTES header carries the vintage', () => {
    const src = read(OVERVIEW_PDF);
    expect(src).toMatch(/WARNINGS & NOTES · FIRST SURVEY/);
    expect(src).not.toMatch(/WARNINGS & NOTES\s*<\/Text>/);
  });
});
