/**
 * @vitest-environment jsdom
 *
 * tests/ui/institutionLink.test.jsx — Wave E / batch E2 lint-pin groundwork.
 *
 * Pins the institution-identity primitives:
 *   - InstitutionLink renders a real institution NAME as an accessible trigger
 *     (a Button-primitive text link — native <button>, keyboard-focusable);
 *   - clicking it opens the InstitutionCard popover (role="dialog") carrying the
 *     DERIVED profile content (contributions from real settlement data);
 *   - the HONESTY GATE: a name with no backing institution renders as plain text,
 *     never a dead link.
 *
 * The repo-wide "every institution reference uses the primitive" ratchet is
 * Phase 5 — this test locks the primitive's contract so that ratchet can land on
 * a stable base.
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import InstitutionLink from '../../src/components/primitives/InstitutionLink.jsx';
import InstitutionCard from '../../src/components/primitives/InstitutionCard.jsx';

afterEach(cleanup);

// A minimal settlement whose "Mill" institution derives real contributions
// (processes grain, gates milled flour, backed by the economy faction, offers
// catalog services) — no generator run needed, so the pins stay deterministic.
const mill = { name: 'Mill', priorityCategory: 'economy', tags: ['food'], catalogId: 'mill' };
const settlement = {
  institutions: [mill],
  powerStructure: { factions: [{ faction: 'Merchant Guilds', category: 'economy', power: 10 }] },
};

describe('InstitutionLink — trigger', () => {
  test('renders a real institution name as a button trigger', () => {
    render(<InstitutionLink name="Mill" settlement={settlement} />);
    const trigger = screen.getByRole('button', { name: 'Mill' });
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });

  test('honesty gate: an unresolved name renders as plain text, not a link', () => {
    render(<InstitutionLink name="Ghost Council" settlement={settlement} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('Ghost Council')).toBeTruthy();
  });

  test('accepts an institution object directly', () => {
    render(<InstitutionLink institution={mill} settlement={settlement} />);
    expect(screen.getByRole('button', { name: 'Mill' })).toBeTruthy();
  });
});

describe('InstitutionLink — opens the card with derived content', () => {
  test('clicking the trigger opens the profile dialog with derived contributions', () => {
    render(<InstitutionLink name="Mill" settlement={settlement} />);
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Mill' }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.getAttribute('aria-label')).toMatch(/Mill/);
    // Derived-from-real-data content is present in the card.
    expect(screen.getByText('Milled flour')).toBeTruthy();
    expect(screen.getByText('Merchant Guilds')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
  });
});

describe('InstitutionCard — direct render', () => {
  test('renders the derived profile and the authored one-liner', () => {
    render(<InstitutionCard open institution={mill} settlement={settlement} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeTruthy();
    // The Processes / Gates contributions render their derived detail.
    expect(screen.getByText('Milled flour')).toBeTruthy();
    // Phase 5: the authored identity one-liner renders above the contributions.
    expect(screen.getByText(/grinds the district's grain/i)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Mill' })).toBeTruthy();
  });

  test('honesty gate: an institution with no authored identity renders no one-liner', () => {
    const custom = { name: 'The Broken Wheel Meetinghouse', priorityCategory: 'economy' };
    render(<InstitutionCard open institution={custom} settlement={settlement} onClose={() => {}} />);
    expect(screen.getByRole('heading', { name: 'The Broken Wheel Meetinghouse' })).toBeTruthy();
    // No fabricated copy: the card omits the one-liner row entirely.
    expect(screen.queryByText(/grinds the district/i)).toBeNull();
  });

  test('closed card renders nothing', () => {
    const { container } = render(<InstitutionCard open={false} institution={mill} settlement={settlement} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});
