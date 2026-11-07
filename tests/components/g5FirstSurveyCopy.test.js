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

  test('the Structural Crises section left the DM page; the staff panel header is bare (READER-R1 ruling 1)', () => {
    const src = read(VIABILITY_TAB);
    expect(src).toMatch(/Generator checks \(staff\) \(\$\{staffRows\.length\}\)/);
    expect(src).not.toMatch(/title=\{`Structural Crises/); // anchored: the toMatch on the staff header above reads this same source
    expect(src).not.toMatch(/Generator checks · First Survey/); // anchored: same source as the toMatch above
  });

  test('the frozen magicDependency record left Outlook and carries its stamp on the Magic tab', () => {
    // RULINGS-T2 T2-15: the block moved to the Magic tab, whose only stamp it carries.
    expect(read(VIABILITY_TAB)).not.toMatch(/Magic Dependency/); // anchored: the Magic tab source below carries the moved block
    const magic = read('src/components/new/tabs/MagicTab.jsx');
    expect(magic).toMatch(/Reliance on magic, as judged at the first survey/);
    expect(magic.match(/first survey/gi) || []).toHaveLength(1);
  });
});

describe('G5 first-survey framing — OverviewTab', () => {
  test('the Systems Health header\'s ? pill is the page\'s one "First survey" label, with the live Food Security carve-out (T1-5; X-42)', () => {
    // X-38/X-42 (the owner, 2026-11-02): the caption left the section body for the header's ? pill,
    // whose second sentence is the shared vintage constant the document's chapter prints too.
    const src = read(OVERVIEW_TAB);
    expect(src).toMatch(/help=\{SECTION_HELP\.systemsHealth\}/);
    expect(src).not.toMatch(/>As judged at the first survey/); // anchored: the help prop is asserted on this same source one line above
    const copy = read('src/copy/sectionHelp.js');
    expect(copy).toMatch(/As judged at the first survey · Food Security is re-judged as the campaign advances\./);
    expect(src).not.toMatch(/See Viability tab/); // anchored: the same source carries the help prop matched above
  });

  test('the vintage is said ONCE per page: the three warning headers carry no suffix (X-8, chair 2026-10-30)', () => {
    // Owner-queue #28 requires the frozen-record disclosure at the frozen sites; the chair
    // read one label per page as satisfying it (RULINGS-CROSS X-8, vetoable). The Systems
    // Health label is that one; the Structural Issues, Coherence Notes and Suggestions
    // headers are bare.
    // READER-R1 ruling 1 (2026-11-05): Structural Issues and Suggestions left the DM page for the
    // Viability tab's staff panel; Coherence Notes is the one warning header left, and bare.
    const src = read(OVERVIEW_TAB);
    expect(src).toMatch(/>Coherence Notes</);
    expect(src).not.toMatch(/>Structural Issues</); // anchored: the toMatch on Coherence Notes above reads this same source
    expect(src).not.toMatch(/>Suggestions</); // anchored: same source as the toMatch above
    // The one label is the pill's (copy/sectionHelp.js); the tab's own source prints the words nowhere.
    expect((src.match(/>[^<]*first survey/gi) || []).length, 'the page prints "first survey" in no label of its own').toBe(0);
    expect((read('src/copy/sectionHelp.js').match(/first survey/gi) || []).length, 'the pill copy says it once').toBe(1);
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
