/** @vitest-environment jsdom */
/**
 * relationshipChronicleSection.test.jsx — LONG TAIL #39 car 4, the War-door
 * surface for "what this relationship survived".
 *
 * THE ARM THAT MATTERS is the fail-closed pair: the covert line is ABSENT for a
 * viewer without ground truth and PRESENT for one with it, asserted on the same
 * fixture so neither half can pass by the surface simply failing to render. The
 * rest pins the legibility contract — both parties named, every entry dated in
 * the reader's own calendar, no engine token anywhere on the page — and the
 * empty-state discipline: a realm with no recorded history renders NOTHING.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

let storeState = {};
vi.mock('../../src/store/index.js', () => ({ useStore: (selector) => selector(storeState) }));

import RelationshipChronicleSection from '../../src/components/map/RelationshipChronicleSection.jsx';

const NAMES = new Map([['ash', 'Ashford'], ['calder', 'Calder'], ['dunmar', 'Dunmar']]);

/** Ashford↔Calder: a sworn pact, a raid, and a piece of quiet business. */
const campaign = () => ({
  id: 'c1',
  settlementIds: ['ash', 'calder', 'dunmar'],
  regionalGraph: { edges: [{ from: 'ash', to: 'calder' }, { from: 'ash', to: 'dunmar' }] },
  worldState: {
    tick: 60,
    relationshipStates: {
      'rel.ash.calder': {
        relationshipType: 'allied',
        relationshipMemory: { posture: 'strained_alliance', postureLabel: 'strained alliance posture' },
        turningPoints: [{ tick: 20, type: 'label_proposal_applied', fromType: 'neutral', toType: 'allied' }],
        recentIncidents: [
          { tick: 31, type: 'raid' },
          { tick: 44, type: 'sabotage' },
        ],
      },
    },
  },
});

const dm = () => { storeState = { auth: { tier: 'premium' }, isElevated: () => false }; };
const player = () => { storeState = { auth: { tier: 'free' }, isElevated: () => false }; };

afterEach(() => { cleanup(); vi.clearAllMocks(); });
beforeEach(() => { storeState = {}; });

describe('RelationshipChronicleSection — the empty-state discipline', () => {
  test('a realm with no recorded relationship history renders NOTHING at all', () => {
    dm();
    const { container } = render(
      <RelationshipChronicleSection campaign={{ id: 'c0', settlementIds: ['ash'], worldState: { pulseHistory: [] } }} nameById={NAMES} />,
    );
    expect(screen.queryByTestId('relationship-chronicle')).toBeNull();
    expect(container.innerHTML).toBe('');
  });

  test('no campaign at all is equally silent', () => {
    dm();
    const { container } = render(<RelationshipChronicleSection campaign={null} nameById={NAMES} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('RelationshipChronicleSection — the page a GM reads', () => {
  test('names both parties, says where the standing sits today, and dates every entry', () => {
    dm();
    render(<RelationshipChronicleSection campaign={campaign()} nameById={NAMES} />);
    const block = screen.getByTestId('relationship-chronicle');
    expect(block.textContent).toContain('What Ashford has survived');
    // THE NEWS ADDRESS LAW: both settlements named, both navigable.
    expect(screen.getByRole('button', { name: 'Go to Ashford' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Go to Calder' })).toBeTruthy();
    // The present standing, in the engine's own authored words — not a token.
    expect(block.textContent).toMatch(/strained alliance posture today, after 3 recorded turns/);
    // Every entry carries the reader's calendar, never a bare tick.
    expect(block.textContent).toContain('week 8 of summer, year 1');
    expect(block.textContent).toContain('A raid crossed the border');
    expect(block.textContent).toContain('The standing between them changed');
    expect(block.textContent).toContain('(neutral → allied)');
  });

  test('not one engine token reaches the reader', () => {
    dm();
    const { container } = render(<RelationshipChronicleSection campaign={campaign()} nameById={NAMES} />);
    const page = container.textContent;
    expect(page).toContain('A raid crossed the border');
    // anchored: the toContain one line above proves this page is a live, populated render, so the two absences below are measured against real prose rather than an empty string.
    expect(page).not.toMatch(/label_proposal_applied|strained_alliance|rel\.ash\.calder|turning-point/);
    // anchored: same live page as the toContain two lines above; a blank render would have failed there first.
    expect(page).not.toMatch(/tick \d|_/);
  });

  test('switching the observer re-anchors the page onto that settlement', () => {
    dm();
    render(<RelationshipChronicleSection campaign={campaign()} nameById={NAMES} />);
    fireEvent.change(screen.getByLabelText('Pick the settlement whose history to read'), { target: { value: 'dunmar' } });
    const block = screen.getByTestId('relationship-chronicle');
    expect(block.textContent).toContain('What Dunmar has survived');
    // Dunmar's own edge has no record, and the surface says so honestly rather
    // than showing Ashford's history under Dunmar's name.
    expect(block.textContent).toMatch(/Dunmar has come through nothing the record kept/);
    expect(screen.queryAllByTestId('relationship-chronicle-row')).toHaveLength(0);
  });
});

describe('RelationshipChronicleSection — ⛔ the fail-closed secrets seam', () => {
  test('a viewer WITHOUT ground truth never meets the covert line', () => {
    player();
    const { container } = render(<RelationshipChronicleSection campaign={campaign()} nameById={NAMES} />);
    expect(container.textContent).toContain('A raid crossed the border');
    // anchored: the public clause one line above proves the section rendered for this viewer, so the covert clause's absence is a WITHHOLDING and not a missing page.
    expect(container.textContent).not.toContain('Something was wrecked in the dark');
    expect(screen.queryAllByTestId('relationship-chronicle-line')).toHaveLength(2);
    expect(container.textContent).toContain('Quiet business is not shown here.');
  });

  test('…and a DM on the SAME fixture does — the gate is a gate, not a blank page', () => {
    dm();
    const { container } = render(<RelationshipChronicleSection campaign={campaign()} nameById={NAMES} />);
    expect(container.textContent).toContain('Something was wrecked in the dark');
    const lines = screen.getAllByTestId('relationship-chronicle-line');
    expect(lines).toHaveLength(3);
    expect(lines.filter((el) => el.dataset.disclosure === 'covert')).toHaveLength(1);
    expect(container.textContent).toMatch(/gold entries are quiet business/);
  });

  test('an elevated (non-premium) session is DM too — the same convention as its neighbours', () => {
    storeState = { auth: { tier: 'free' }, isElevated: () => true };
    const { container } = render(<RelationshipChronicleSection campaign={campaign()} nameById={NAMES} />);
    expect(container.textContent).toContain('Something was wrecked in the dark');
  });

  test('⛔ a relationship whose WHOLE record is covert does not render for a player at all', () => {
    // The sharpest form: the section must not leak the EXISTENCE of the business
    // by rendering an empty row for it.
    const covertOnly = {
      id: 'c2', settlementIds: ['ash', 'calder'],
      regionalGraph: { edges: [{ from: 'ash', to: 'calder' }] },
      worldState: { tick: 20, relationshipStates: { 'rel.ash.calder': { relationshipType: 'rival', recentIncidents: [{ tick: 4, type: 'espionage' }] } } },
    };
    player();
    const { container } = render(<RelationshipChronicleSection campaign={covertOnly} nameById={NAMES} />);
    expect(container.innerHTML).toBe('');
    cleanup();
    dm();
    const asDm = render(<RelationshipChronicleSection campaign={covertOnly} nameById={NAMES} />);
    // anchored: the DM render below proves the fixture really carries a line, so the player's empty page above is a withholding and not an empty fixture.
    expect(asDm.container.textContent).toContain('Spies were set on the other side');
  });
});
