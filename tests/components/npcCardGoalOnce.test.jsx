/** @vitest-environment jsdom */
/**
 * npcCardGoalOnce.test.jsx — NO ROW OF THE EXPANDED NPC CARD REPEATS ANOTHER.
 *
 * The goal was stated three times over, because three independent rows read the
 * same `npc.goal.short`: the `Goal:` trait chip (normalizeNpcTraits), an arrow
 * line of its own, and the "Wants" line (npcInteriority's first want). A reader
 * met the same sentence three times before reaching the secret.
 *
 * Wants is the row that survives, and the rule generalised rather than stopping
 * at the goal: npcInteriority's wants are goal, AMBITION and IDEAL, and
 * normalizeNpcTraits mints a chip for each of those three from the same fields,
 * so a label-keyed cure would have left the identical defect one row away. The
 * chip filter is keyed on the VALUE — a chip is dropped exactly when the Wants
 * line already prints its text.
 *
 * Wants renders through ProseParagraph, so an ⟦entity:…⟧ token in a
 * narrative-rewritten goal never reaches the reader as a literal.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { NPCCategoryGroup } from '../../src/components/new/npcComponents.jsx';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

afterEach(cleanup);

/** Occurrences of `needle` in `haystack` — the "exactly once" measure. */
function occurrences(haystack, needle) {
  return String(haystack).split(needle).length - 1;
}

/** Render one NPC in a category group and open its card. Returns the card's text. */
function renderExpanded(npc) {
  const { container } = render(
    <NPCCategoryGroup category="civic" label="Civic" group={[npc]} />,
  );
  // The card body is behind a collapsed toggle; the group's own toggle is first.
  const toggles = screen.getAllByRole('button', { expanded: false });
  fireEvent.click(toggles[toggles.length - 1]);
  return container.textContent || '';
}

/** The text of the one Wants row, label included. */
function wantsLine() {
  return screen.getByText('Wants').parentElement?.textContent || '';
}

describe('NPCInlineCard — the goal is printed once', () => {
  const GOAL = 'corner the grain trade before the thaw';
  const AMBITION = 'a seat on the council';

  it('prints an authored goal exactly once, and keeps the ambition beside it', () => {
    const text = renderExpanded({
      id: 'n1',
      name: 'Hesta Roal',
      role: 'Factor',
      goal: { short: GOAL },
      personality: { ambition: AMBITION },
    });

    expect(occurrences(text, GOAL)).toBe(1);
    // The second want (the ambition) rides the same line, after the goal — and it
    // is stated ONCE too: the `Ambition:` chip that used to repeat it is gone.
    expect(occurrences(text, AMBITION)).toBe(1);
    expect(wantsLine()).toBe(`Wants ${GOAL} · ${AMBITION}`);
  });

  it('prints an ideal once as well — the third want the chip row used to echo', () => {
    const IDEAL = 'the wall holds or nobody does';
    const text = renderExpanded({
      id: 'n1b',
      name: 'Bern Ladd',
      role: 'Warden',
      goal: { short: GOAL },
      personality: { ambition: AMBITION, ideal: IDEAL },
    });

    expect(occurrences(text, IDEAL)).toBe(1);
    expect(wantsLine()).toBe(`Wants ${GOAL} · ${AMBITION} · ${IDEAL}`);
  });

  it('keeps a SECOND ambition the read-model did not choose — only the echo goes', () => {
    // npcInteriority takes the first non-empty of personality.ambition then
    // npc.ambition, so a person carrying two distinct ambitions still has one the
    // Wants line never prints. A value-keyed filter keeps it; a label-keyed one
    // would have deleted it.
    const OTHER = 'buy back the family mill';
    const text = renderExpanded({
      id: 'n1c',
      name: 'Alder Finch',
      role: 'Factor',
      goal: { short: GOAL },
      personality: { ambition: AMBITION },
      ambition: OTHER,
    });

    expect(wantsLine()).toBe(`Wants ${GOAL} · ${AMBITION}`);
    expect(screen.getByText(`Ambition: ${OTHER}`)).toBeTruthy();
    expect(occurrences(text, OTHER)).toBe(1);
  });

  it('carries no "Goal:" chip — the retired third copy', () => {
    const text = renderExpanded({
      id: 'n2',
      name: 'Hesta Roal',
      role: 'Factor',
      goal: { short: GOAL },
      personality: { flaw: 'never forgives a slight' },
    });

    // The flaw chip is the liveness anchor: it travels the SAME publicTraits map
    // the goal chip used to, so an emptied chip row cannot read as a fixed one.
    expectAbsentWithAnchor(text, 'Goal:', 'Flaw:', 'the NPC card trait chips');
    expect(occurrences(text, GOAL)).toBe(1);
  });

  it('keeps every chip the Wants line does NOT carry', () => {
    renderExpanded({
      id: 'n3',
      name: 'Bern Ladd',
      role: 'Warden',
      goal: { short: GOAL },
      personality: { flaw: 'drinks before the watch', bond: 'his sister runs the ferry' },
      fear: 'the river rising',
      loyalty: 'the old charter',
    });

    // None of these four is a want, so none of them is an echo.
    expect(screen.getByText(/Flaw: drinks before the watch/)).toBeTruthy();
    expect(screen.getByText(/Bond: his sister runs the ferry/)).toBeTruthy();
    expect(screen.getByText(/Fear: the river rising/)).toBeTruthy();
    expect(screen.getByText(/Loyalty: the old charter/)).toBeTruthy();
  });

  it('a goal STORED AS A BANK TOKEN prints once, in one spelling', () => {
    // The Wants line humanizes a want that is a bank token (`secure_office` ->
    // `Secure office`); the chip's value comes straight out of normalizeNpcTraits
    // and is still the raw token. A filter keyed on one spelling let this person
    // print `Goal: secure_office` beside `Wants Secure office`.
    const text = renderExpanded({
      id: 'n5',
      name: 'Wren Calder',
      role: 'Clerk',
      goal: 'secure_office',
      personality: { flaw: 'keeps two ledgers' },
    });

    expect(wantsLine()).toBe('Wants Secure office');
    // The flaw chip anchors the absence: it travels the same publicTraits map, so
    // an emptied chip row cannot read as a cured one.
    expectAbsentWithAnchor(text, 'Goal:', 'Flaw:', 'the NPC card trait chips');
    expect(occurrences(text, 'Secure office')).toBe(1);
    expect(occurrences(text, 'secure_office')).toBe(0);
  });

  it('a person carrying only a declared goal FACET still states a want', () => {
    // npcInteriority reads authored goal PROSE only, so without the facet read
    // this person would state nothing at all.
    const text = renderExpanded({
      id: 'n4',
      name: 'Silas Pike',
      role: 'Clerk',
      facets: { goal: 'secure_office' },
    });

    expect(text).toContain('Wants');
    expect(occurrences(text, 'Secure office')).toBe(1);
  });
});
