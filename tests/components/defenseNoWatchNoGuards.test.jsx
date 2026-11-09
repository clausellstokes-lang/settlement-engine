/** @vitest-environment jsdom */
/**
 * SW-B6 · ECO-DEF-BLOCKS (2026-11-09; STYLE-RULINGS-2 B1(a) and B6; the SURFACES audit's C·D1/C·D5):
 * ONE READER OF THE WATCH FACT. The Defense tab's guard assessment says "There is no watch" where the
 * roster holds no force (`safetyProfile.js :: generateSafetyProfile`, the `guardEffectivenessDesc`
 * no-force branches); on the same tab DS-DEF-8 said "the guards cannot keep track", DS-DEF-3 said
 * "Fighting between the rebels and the town's guards" and the stress safety lines said "the regular
 * patrols have stopped". Every writer of a guard or a patrol now reads the same fact — `guardPresence`
 * (watch ∨ garrison ∨ militia ∨ hired company, `factsOf`) — and prints its twin where none stands.
 *
 * RED-FIRST, measured on these 120 planted places at the parent (0c93f0ca0): 77 guard/patrol sentences
 * on the 109 no-force tabs; after the cure, none. A planted place with no force prints no guard and no
 * patrol anywhere on its Defense tab, every disclosure opened.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { NO_WATCH_SMALL } from '../../src/generators/safetyProfile.js';

const STRESSES = [
  'mass_migration', 'famine', 'under_siege', 'occupied', 'politically_fractured', 'indebted',
  'recently_betrayed', 'infiltrated', 'plague_onset', 'succession_void', 'monster_pressure',
  'insurgency', 'religious_conversion', 'slave_revolt', 'wartime',
];
/** A guard or a patrol as a NOUN (the verb "people guard their food" is not a claim of a force; "guards" followed by an object word — its, their, his, her, our, your, the, a, an, each, every, nobody, no one, it, them, him, what, whoever — is that verb). */
// The chair's STOP #2 ruling keeps the arm at FULL reach: guard, patrol, watch or rota. "There is no watch"
// is the reader's own statement of the absence, so a watch is counted only as a force that acts ("the watch …").
// THE VERB EXEMPTION MADE EXACT (STYLE-2-MERGE at SW-B6's point; the chair's ruling on STOP 2, 16:5x): by grammar, not by a named line.
const FORCE_NOUN = /\bguards\b(?!\s+(?:its|their|his|her|our|your|the|a|an|each|every|nobody|no one|it|them|him|what|whoever)\b)|\b(?:patrols?|watchm[ae]n|rotas?)\b|\b(?:a|the|every|hungry|standing) guard\b|\b(?:the|its|their) watch\b/i;

/** Open every closed disclosure, so a line inside a fold is read too. */
function expandAll(container) {
  for (let pass = 0; pass < 4; pass += 1) {
    const shut = [...container.querySelectorAll('[aria-expanded="false"]')];
    if (shut.length === 0) return;
    for (const b of shut) fireEvent.click(b);
  }
}

const TABS = [];
beforeAll(() => {
  for (const tier of ['thorp', 'hamlet']) {
    for (const stress of STRESSES) {
      for (let i = 0; i < 4; i += 1) {
        const seed = `sw6-guards-${tier}-${stress}-${i}`;
        const s = generateSettlementPipeline({ settType: tier, stressTypes: [stress] }, null, { seed, customContent: {} });
        if (factsOf(s).guardPresence !== false) continue;
        const { container } = render(<DefenseTab settlement={s} />);
        expandAll(container);
        for (const dialog of [...container.querySelectorAll('[role="dialog"]')]) dialog.remove();
        TABS.push({ seed, text: container.textContent || '' });
        cleanup();
      }
    }
  }
}, 600000);
afterEach(cleanup);

describe('one reader of the watch fact on the Defense tab', () => {
  test('the planted places carry no force, and the guard assessment says so', () => {
    expect(TABS.length, 'too few no-force places to read').toBeGreaterThan(80);
    // 103 of the 109 measured: the other six keep a charter hall or a warding, which the guard
    // assessment describes in its own words (`inst.hasMilitaryInst`) and which is no watch either.
    // RE-KEYED BY IDENTITY at SW-B6's point (STYLE-2-MERGE; the chair's ruling on STOP 2, 16:5x): SW-B5's vantage variants
    // (NO_WATCH_SMALL) say the absence in four ways, one not opening "There is no watch"; a tab says it when its text holds
    // a member of the pool WHOLE (each member renders as one text node, so no member is split across nodes).
    const saying = TABS.filter(({ text }) => /There is no watch/.test(text) || NO_WATCH_SMALL.some((member) => text.includes(member))).length;
    expect(saying, 'the guard assessment no longer reads the absence').toBeGreaterThan(TABS.length * 0.9);
  });

  test('a place with no force prints no guard and no patrol anywhere on the tab', () => {
    const offenders = [];
    for (const { seed, text } of TABS) {
      for (const m of text.matchAll(/[^.]*\.?/g)) {
        if (FORCE_NOUN.test(m[0])) offenders.push(`${seed}: ${m[0].trim().slice(0, 160)}`);
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
