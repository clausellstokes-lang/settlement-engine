/** @vitest-environment jsdom */
/**
 * factionLockCoupShield.test.jsx — THE WORLD-SCOPE FACTIONS LOCK, END TO END.
 *
 * The coup shield has been built and tested for a long time: worldPulse/coup.js
 * `lockedGoverningFaction` reads `campaignState.locks.factions` and downgrades a
 * successful coup from auto-applied to a PROPOSAL, and tests/domain/rulingPower.js
 * pins that reader directly. `setLock` has always been generic, and
 * domain/locksPreservation.js already documents the array surviving a full
 * regenerate. The single missing piece was a row in LockControls' WORLD_LOCKS:
 * nothing a person could click ever wrote the key, so the shield could not arm
 * from the UI at all. This file pins the wiring that closes that gap.
 *
 * ⚠⚠ WHY THIS IS NOT A COPY OF THE OTHER TWO WORLD ROWS. `identity` and
 * `geography` are BOOLEANS. `factions` is NAME-KEYED, and its reader begins with
 * `Array.isArray(locked)`. So the obvious implementation — reuse the generic row
 * and call `setLock('factions', true)` — writes a value the shield silently
 * ignores: the control would read "Locked", the save would carry `factions: true`,
 * and the coup would still auto-apply. Every assertion below that insists on an
 * ARRAY is guarding that exact trap, and the last test proves the written value
 * really does arm the real coup path rather than merely looking well-shaped.
 *
 * Uses the REAL store, like npcRowLockToggle: the claim under test is that a CLICK
 * reaches the store's own setLock with a value the domain's own reader accepts.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

// The persist tail fires saves.update when a save is active. No active save here,
// so it is a documented no-op; stubbed anyway so nothing reaches the network.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { useStore } from '../../src/store/index.js';
import LockControls from '../../src/components/dossier/LockControls.jsx';
import { coupVerdictOutcomes } from '../../src/domain/worldPulse/coup.js';

/** The drafted copy, kept in lockstep with WORLD_LOCKS (LockControls.jsx). */
const OPEN_CTA = 'Keep them in power';
const LOCKED_CTA = 'Allow a coup';
/** A live sibling row, used as the anti-vacuity anchor for every absence claim. */
const IDENTITY_CTA = 'Keep the name';

const GOVERNING = 'Town Council';

/** A settlement whose seat is held by GOVERNING. */
const townWithSeat = () => ({
  id: 'town-1',
  name: 'Testford',
  npcs: [],
  powerStructure: {
    governingName: GOVERNING,
    factions: [
      { faction: GOVERNING, category: 'civic', isGoverning: true, power: 70 },
      { faction: 'Merchant Guilds', category: 'economic', power: 40 },
    ],
  },
});

const ctas = (container) => [...container.querySelectorAll('button')].map((b) => b.textContent.trim());
const clickCta = (container, label) => {
  const button = [...container.querySelectorAll('button')].find((b) => b.textContent.trim() === label);
  expect(button, `no control labelled "${label}"`).toBeTruthy();
  fireEvent.click(button);
};

beforeEach(() => {
  useStore.setState({ locks: {}, settlement: townWithSeat(), savedSettlements: [], editMode: false, phase: 'draft' });
});
afterEach(() => {
  cleanup();
  useStore.setState({ locks: {}, settlement: null });
});

describe('the factions row exists and writes a NAME ARRAY', () => {
  test('the row is offered beside the other world locks when a faction holds the seat', () => {
    const { container } = render(<LockControls scope="world" />);
    const labels = ctas(container);
    expect(labels).toContain(OPEN_CTA);
    // The anchor: the pre-existing rows still render, so "the factions row is
    // present" is a statement about THIS row rather than about the block mounting.
    expect(labels).toContain(IDENTITY_CTA);
  });

  test('clicking it writes the GOVERNING FACTION\'S NAME as an array, never a boolean', () => {
    const { container } = render(<LockControls scope="world" />);
    clickCta(container, OPEN_CTA);
    const written = useStore.getState().locks.factions;
    // The shape assertions ARE the guard — `toEqual([GOVERNING])` alone would also
    // pass for a value that merely looked right, so the array-ness is asserted in
    // its own right, exactly as the domain reader tests it.
    expect(Array.isArray(written)).toBe(true);
    expect(written).toEqual([GOVERNING]);
    expect(written).not.toBe(true);
  });

  test('unlocking DELETES the key rather than leaving an empty residue', () => {
    const { container } = render(<LockControls scope="world" />);
    clickCta(container, OPEN_CTA);
    expect(useStore.getState().locks.factions).toEqual([GOVERNING]);
    // The row now offers the inverse verb…
    clickCta(container, LOCKED_CTA);
    // …and setLock's empty-array rule erases the key, so `anyLock` (which counts
    // Object.keys) cannot keep reporting a lock nobody set.
    expect(Object.prototype.hasOwnProperty.call(useStore.getState().locks, 'factions')).toBe(false);
  });

  test('NO SEAT ⇒ NO ROW, while the boolean rows still render', () => {
    // ⚠⚠ A NEGATIVE AGAINST A RENDERED SURFACE HAS A SECOND VACUITY MODE: absence of
    // the factions CTA is equally true when the row is correctly withheld and when
    // LockControls failed to mount, threw, or gated itself off entirely. The identity
    // row is therefore asserted PRESENT in the same render — it is the live sibling
    // that dies of every other drift but survives this one, so the absence below
    // measures the withholding rule and nothing else.
    useStore.setState({ settlement: { id: 't2', name: 'Seatless', powerStructure: { factions: [] } } });
    const { container } = render(<LockControls scope="world" />);
    // Routed through the helper rather than a bare `not.toContain` so the anchor is a
    // PRECONDITION of the denial instead of an adjacent line a later edit could drop.
    expectAbsentWithAnchor(
      ctas(container),
      OPEN_CTA,
      IDENTITY_CTA,
      'the factions row is withheld when no faction holds the seat',
    );
  });
});

describe('the written value ARMS THE REAL COUP PATH', () => {
  test('what the click wrote is what lockedGoverningFaction accepts', () => {
    // THE WHOLE POINT OF THE CHANGE, CLOSED END TO END: the value is not merely
    // well-shaped, it is the value the shipped reader matches. A boolean row would
    // pass every shape check above and fail precisely here.
    const { container } = render(<LockControls scope="world" />);
    clickCta(container, OPEN_CTA);
    const written = useStore.getState().locks.factions;

    // The coup fixture is the one tests/domain/rulingPower.test.js already drives —
    // a seat in a legitimacy crisis that reliably FALLS under this rng. Its
    // governing faction is named 'Town Council', the same seat townWithSeat() gives
    // the store, and THAT COINCIDENCE IS THE COUPLING UNDER TEST: the string the
    // click writes has to be the string the shield matches.
    const settlement = {
      name: 'Oakmere',
      tier: 'town',
      powerStructure: {
        governingName: GOVERNING,
        publicLegitimacy: { score: 22, label: 'Legitimacy Crisis', govMultiplier: 0.6, crimMultiplier: 1.3 },
        factions: [
          { faction: GOVERNING, power: 24, category: 'government', isGoverning: true },
          { faction: 'The Garrison', power: 30, category: 'military' },
          { faction: 'Merchant Guilds', power: 26, category: 'economy' },
        ],
        factionRelationships: [],
      },
    };
    const run = (locks) => coupVerdictOutcomes({
      resolved: [{
        id: 'world_stressor.coup_detat.oakmere',
        type: 'coup_detat',
        label: "Coup d'état",
        status: 'resolved',
        severity: 0.4,
        peakSeverity: 0.7,
        originSettlementId: 'oakmere',
        affectedSettlementIds: ['oakmere'],
        originContext: { variant: 'barracks_coup' },
      }],
      snapshot: {
        byId: new Map([['oakmere', {
          name: settlement.name,
          settlement,
          save: { campaignState: { locks } },
          causal: { scores: { ruling_authority: 20 } },
        }]]),
      },
      // 0.5 > pHold → the seat falls; 0.0 → the heaviest challenger takes it.
      rng: (() => { const v = [0.5, 0.0]; let i = 0; return { random: () => v[Math.min(i++, v.length - 1)] }; })(),
      tick: 9,
    });

    const shielded = run({ factions: written });
    const bare = run({});
    // The anchor: the SAME fixture with no lock produces a verdict at all, so the
    // shielded run's applyMode is a comparison between two live results rather than
    // an assertion about an empty list.
    expect(bare.length).toBeGreaterThan(0);
    expect(bare[0].applyMode).toBe('auto');
    expect(shielded[0].applyMode).toBe('proposal');
  });
});
