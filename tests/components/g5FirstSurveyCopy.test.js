/**
 * g5FirstSurveyCopy.test.js — Wave R-1 Lane D: first-survey framing pins for
 * the G5 frozen-record remainder (SETTLEMENT_CAPABILITY_ATLAS owner-queue #28).
 *
 * The G5 five (economicViability, structuralViolations, structuralSuggestions,
 * coherenceNotes, magicDependency) are generation-frozen — no event, edit, or
 * pulse path recomputes them — yet their render sites spoke in the bare
 * present tense. Wave R-0 fixed DefenseTab + the PDF Threat Assessment
 * caption; these pins hold the REMAINDER sites:
 *
 *   • ViabilityTab (Outlook): the tab fine print, the Structural Crises
 *     section, and the Magic Dependency banner carry the survey vintage.
 *   • OverviewTab: the Systems Health caption (frozen score bars + Viability
 *     + Defense statuses, with the declared-live Food Security carve-out —
 *     FROZEN_VS_LIVE grammar), Structural Issues, Coherence Notes (its sole
 *     web render site), and Suggestions headers.
 *   • PDF DefenseSecurity: the VULNERABILITIES list header (the last
 *     unframed frozen-record header in that chapter after R-0's caption).
 *
 * [RULED — owner 2026-07-27, landed Wave R-5b] The G5 five DO get
 * FROZEN_VS_LIVE manifest rows: all five are now declared mode 'snapshot' in
 * src/domain/fieldManifest.js with displayRules in the scores-precedent voice,
 * walked by tests/joins/fieldManifest.test.js (which also pins that no
 * worldPulse writer has quietly started keeping one of them live). The rows
 * DECLARE what these pins already enforce; the pins below stay the display
 * half of that contract. PDF twins of the Viability/Overview sections
 * (ViabilityAssessment.jsx, Overview.jsx) are OUT of this lane and recorded
 * as a Wave R-1 deferral, not pinned here.
 *
 * Copy is one-string vetoable: a deliberate reword updates the POSITIVE pins
 * in the same change; the NEGATIVE pins are the invariant (bare present-tense
 * claims stay dead). Idiom: comment-stripped source scans
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

const VIABILITY_TAB = 'src/components/new/tabs/ViabilityTab.jsx';
const OVERVIEW_TAB = 'src/components/new/tabs/OverviewTab.jsx';
const DEFENSE_PDF = 'src/pdf/sections/DefenseSecurity.jsx';

describe('G5 first-survey framing — ViabilityTab (Outlook)', () => {
  // ⭐ ONE LABEL PER PAGE (RULINGS-CROSS X-8, the chair's reading of owner-queue #28,
  // vetoable; RULINGS-T2 T2-11). The page-level vintage label covers every frozen record on
  // the page (economicViability, structuralViolations, magicDependency), so the section
  // headers no longer carry their own "· First Survey" suffix.
  test('the page carries ONE vintage label, and the coaching caption is gone', () => {
    const src = read(VIABILITY_TAB);
    expect(src).toMatch(/Judged at the first survey; not re-run since\./);
    expect(src.match(/first survey/gi) || [], 'the vintage is said once in this file').toHaveLength(1);
    // Negative: the coaching sentences stay dead.
    expect(src).not.toMatch(/This tab checks whether/); // anchored: the toMatch on the vintage label above reads this same source
    expect(src).not.toMatch(/economically optimised/); // anchored: same source as the toMatch above
  });

  test('the Structural Crises section is covered by the page label, not a suffix', () => {
    const src = read(VIABILITY_TAB);
    expect(src).toMatch(/Structural Crises \(\$\{structViolations\.length\}\)/);
    expect(src).not.toMatch(/Structural Crises · First Survey/); // anchored: the toMatch on the bare header above reads this same source
  });

  test('the Magic Dependency block (frozen magicDependency) is covered by the page label', () => {
    const src = read(VIABILITY_TAB);
    expect(src).toMatch(/Magic Dependency\s*</);
    expect(src).not.toMatch(/Magic Dependency · First Survey/); // anchored: the toMatch on the bare title above reads this same source
    expect(src).not.toMatch(/Magic Dependency Detected/); // anchored: same source as the toMatch above
  });
});

describe('G5 first-survey framing — OverviewTab', () => {
  test('the Systems Health caption frames the frozen bars/statuses with the live Food Security carve-out', () => {
    const src = read(OVERVIEW_TAB);
    expect(src).toMatch(/as judged at the first survey/);
    expect(src).toMatch(/Food Security is re-judged as the campaign advances/);
  });

  test('the Structural Issues / Coherence Notes / Suggestions headers carry the vintage', () => {
    const src = read(OVERVIEW_TAB);
    expect(src).toMatch(/Structural Issues · First Survey/);
    expect(src).toMatch(/Coherence Notes · First Survey/);
    expect(src).toMatch(/Suggestions · First Survey/);
    // Negative: the bare headers stay dead (word-boundary via the JSX close).
    expect(src).not.toMatch(/>Structural Issues</);
    expect(src).not.toMatch(/>Suggestions</);
  });
});

describe('G5 first-survey framing — PDF DefenseSecurity', () => {
  // ⭐ ONE LABEL PER CHAPTER (X-8; RULINGS-T2 T2-22 print parity): the threat caption carries
  // the vintage, and the VULNERABILITIES header no longer repeats it.
  test('the chapter says the vintage once, in the threat caption; VULNERABILITIES carries no suffix', () => {
    const pdf = read(DEFENSE_PDF);
    expect(pdf.match(/first survey/gi) || []).toHaveLength(1);
    expect(pdf).toMatch(/VULNERABILITIES\s*<\/Text>/);
    expect(pdf).not.toMatch(/VULNERABILITIES · FIRST SURVEY/); // anchored: the bare header is matched in this same source above
  });
});
