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
 * They also pin the NPC pin-toggle tooltip honesty (the regen-edit-loss R2
 * rescope): pins ride the AI channel (aiData.pinnedNpcs) only, so the tooltip
 * must never again promise survival across regenerate/reroll — no lock/pin
 * engine covers those paths (state.locks is unimplemented; see the Locks
 * typedef in src/domain/types.js).
 *
 * Copy is one-string vetoable: a deliberate reword should update the POSITIVE
 * pins here in the same change; the NEGATIVE pins are the invariant (the bare
 * present-tense claim and the regen-survival over-promise stay dead).
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
const NPC_COMPONENTS = 'src/components/new/npcComponents.jsx';

describe('frozen-tense display honesty — DefenseTab (FROZEN_VS_LIVE snapshot family)', () => {
  test('the Threat Assessment caption frames the frozen bars as first-survey verdicts', () => {
    const src = read(DEFENSE_TAB);
    expect(src).toMatch(/as judged at the first survey/);
    // The one live bar keeps its currency in the same sentence.
    expect(src).toMatch(/Disasters & Famine is re-judged as the campaign advances/);
  });

  test('the bare present-tense caption cannot return', () => {
    const src = read(DEFENSE_TAB);
    expect(src).not.toMatch(/defense readiness against each threat\. Higher is better/);
  });

  test('the Internal Security banner (frozen scores.internal) carries the survey vintage', () => {
    expect(read(DEFENSE_TAB)).toMatch(/Internal Security · First Survey/);
  });
});

describe('NPC pin-toggle tooltip honesty (regen-edit-loss R2 rescope)', () => {
  test('the pin tooltip promises only the AI channel, never regen/reroll survival', () => {
    const src = read(NPC_COMPONENTS);
    // Positive: the rescoped AI-scoped copy is present.
    expect(src).toMatch(/The AI will not rewrite this NPC/);
    expect(src).toMatch(/Pin this NPC so the AI leaves it unchanged/);
    // Negative: the committed-lineage over-promise stays dead. No pin or lock
    // engine covers the regenerate or reroll paths.
    expect(src).not.toMatch(/rewritten by regenerate/);
    expect(src).not.toMatch(/regenerate\/progress/);
    expect(src).not.toMatch(/surviv\w+\s+(a\s|an\s|the\s)?(NPC\s)?(reroll|regenerat)/i);
  });
});
