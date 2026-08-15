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
  test('the tab fine print frames the coherence check as a first-survey verdict', () => {
    const src = read(VIABILITY_TAB);
    expect(src).toMatch(/as judged at the first survey/);
    expect(src).toMatch(/later\s+events and edits do not re-run this check/);
    // Negative: the bare present-tense sentence stays dead.
    expect(src).not.toMatch(/makes logical sense\. Not whether/);
  });

  test('the Structural Crises section (frozen structuralViolations) carries the vintage', () => {
    const src = read(VIABILITY_TAB);
    expect(src).toMatch(/Structural Crises · First Survey/);
    expect(src).not.toMatch(/Structural Crises \(\$\{/);
  });

  test('the Magic Dependency banner (frozen magicDependency) carries the vintage', () => {
    const src = read(VIABILITY_TAB);
    expect(src).toMatch(/Magic Dependency · First Survey/);
    expect(src).not.toMatch(/Magic Dependency Detected/);
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
  test('the VULNERABILITIES list header carries the vintage', () => {
    const pdf = read(DEFENSE_PDF);
    expect(pdf).toMatch(/VULNERABILITIES · FIRST SURVEY/);
    expect(pdf).not.toMatch(/VULNERABILITIES\s*<\/Text>/);
  });
});
