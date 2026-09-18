/** @vitest-environment jsdom */
/**
 * npcCardGoalOnce.test.jsx — the expanded NPC card states a person's goal ONCE.
 *
 * It used to state it three times over, because three independent rows read the
 * same `npc.goal.short`: the `Goal:` trait chip (normalizeNpcTraits), an arrow
 * line of its own, and the "Wants" line (npcInteriority's first want). A reader
 * met the same sentence three times before reaching the secret.
 *
 * Wants is the row that survives — it is the one that also carries the ambition —
 * and it renders through ProseParagraph so an ⟦entity:…⟧ token in a
 * narrative-rewritten goal never reaches the reader as a literal.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { NPCCategoryGroup } from '../../src/components/new/npcComponents.jsx';

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
    // The second want (the ambition) still rides the same line, after the goal.
    // NOTE: the ambition ALSO keeps its own `Ambition:` trait chip. That chip is
    // the same duplication one row deeper and is deliberately left standing —
    // the 2026-09-18 order named the goal rows, not the ambition's.
    expect(wantsLine()).toBe(`Wants ${GOAL} · ${AMBITION}`);
  });

  it('carries no "Goal:" chip — the retired third copy', () => {
    const text = renderExpanded({
      id: 'n2',
      name: 'Hesta Roal',
      role: 'Factor',
      goal: { short: GOAL },
    });

    expect(text).not.toContain('Goal:');
    expect(occurrences(text, GOAL)).toBe(1);
  });

  it('other trait chips survive the goal chip\'s removal', () => {
    renderExpanded({
      id: 'n3',
      name: 'Bern Ladd',
      role: 'Warden',
      goal: { short: GOAL },
      personality: { flaw: 'drinks before the watch', ideal: 'the wall holds or nobody does' },
    });

    expect(screen.getByText(/Flaw: drinks before the watch/)).toBeTruthy();
    expect(screen.getByText(/Ideal: the wall holds or nobody does/)).toBeTruthy();
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
