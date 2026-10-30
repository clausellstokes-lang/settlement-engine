/**
 * frozenTenseDefenseCopy.test.js — Wave R-0 Lane B: frozen-tense display
 * honesty pins.
 *
 * src/domain/fieldManifest.js FROZEN_VS_LIVE declares defenseProfile.scores.
 * {military,internal,monster,economic,magical} mode 'snapshot' (generation
 * verdicts with no pulse writeback) while the sibling scores.disaster is mode
 * 'live' (re-graded every tick by foodStockpile). DefenseTab's copy used to
 * present all five bars in the bare present tense as if live. These pins hold
 * the honest framing: the frozen bars read as first-survey verdicts, the live
 * Disasters & Famine bar keeps its currency in the same sentence, and the
 * Internal Security banner (its headline is minted from frozen
 * scores.internal) carries the survey vintage.
 *
 * The same framing is pinned on BOTH surfaces of the screen↔PDF parity
 * discipline (tests/pdf/screenParitySource.test.js): the PDF twin's Threat
 * Assessment caption (src/pdf/sections/DefenseSecurity.jsx) carried the exact
 * bare present-tense caption the negative pin below bans on-screen, over the
 * same threatReadiness bars.
 *
 * The Vulnerabilities section renders structuralViolations — one of the five
 * generation-frozen G5 records (SETTLEMENT_CAPABILITY_ATLAS, owner-queue
 * #28) — so its title and empty state carry the survey vintage too. [RULED —
 * owner 2026-07-27, landed Wave R-5b] the G5 five ARE now declared mode
 * 'snapshot' rows in FROZEN_VS_LIVE, walked by tests/joins/fieldManifest.test.js.
 *
 * OWNERSHIP NOTE (Wave R-0 verifier finding #1): the NPC pin-toggle tooltip
 * strings in src/components/new/npcComponents.jsx are deliberately NOT pinned
 * here. The regen-edit-loss R2 rescope lane owns that fix and its pinning; an
 * earlier revision of this file pinned those strings cross-lane and the block
 * was removed.
 *
 * Copy is one-string vetoable: a deliberate reword should update the POSITIVE
 * pins here in the same change; the NEGATIVE pins are the invariant (the bare
 * present-tense claims stay dead).
 *
 * Idiom: comment-stripped source scans (tests/joins/fieldManifest.test.js).
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

const DEFENSE_TAB = 'src/components/new/tabs/DefenseTab.jsx';
const DEFENSE_PDF = 'src/pdf/sections/DefenseSecurity.jsx';

describe('frozen-tense display honesty — DefenseTab (FROZEN_VS_LIVE snapshot family)', () => {
  test('the Threat Assessment caption frames the frozen bars as first-survey verdicts', () => {
    const src = read(DEFENSE_TAB);
    expect(src).toMatch(/as judged at the first survey/);
    // The one live bar keeps its currency in the same sentence.
    expect(src).toMatch(/Disasters & Famine is re-judged as the campaign advances/);
  });

  test('the PDF twin caption carries the same first-survey framing (screen↔PDF parity)', () => {
    const pdf = read(DEFENSE_PDF);
    expect(pdf).toMatch(/as judged at the first survey/);
    expect(pdf).toMatch(/Disasters & Famine is re-judged as the campaign advances/);
  });

  test('the bare present-tense caption cannot return on either surface', () => {
    for (const file of [DEFENSE_TAB, DEFENSE_PDF]) {
      expect(read(file)).not.toMatch(/defense readiness against each threat\. Higher is better/);
    }
  });

  // ⭐ ONE LABEL PER PAGE (RULINGS-CROSS X-8, the chair's reading of owner-queue #28,
  // vetoable; RULINGS-T2 T2-22). The Threat Assessment caption is the Defense page's one
  // vintage label and covers every frozen reading on the page (scores.internal, the G5
  // structuralViolations behind Vulnerabilities); no other site repeats it.
  test('the first-survey vintage is said ONCE on the Defense page, in the Threat caption', () => {
    const src = read(DEFENSE_TAB);
    expect(src.match(/first survey/gi) || [], 'the vintage is said once in this file').toHaveLength(1);
    expect(src).toMatch(/as judged at the first survey/);
    expect(src).not.toMatch(/Internal security · first survey/); // anchored: the toMatch on the caption above reads this same source
  });

  test('the Vulnerabilities section carries no suffix and no empty-state line', () => {
    const src = read(DEFENSE_TAB);
    expect(src).toMatch(/Vulnerabilities \(\$\{defViolations\.length\}\)/);
    expect(src).not.toMatch(/Vulnerabilities · First Survey/); // anchored: the toMatch on the bare title above reads this same source
    expect(src).not.toMatch(/No critical defense vulnerabilities/); // anchored: same source as the toMatch above
  });
});
