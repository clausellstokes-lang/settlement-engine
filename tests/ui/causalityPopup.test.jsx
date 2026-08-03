/** @vitest-environment jsdom */
/**
 * causalityPopup.test.jsx — THE CAUSALITY POPUP + THE PORTABLE POPUP CONVENTION
 * (SP-6's SURFACE CONTRACT, PORTABLE POPUP and MANIPULATION DISCLOSURE
 * amendments, 2026-08-03).
 *
 * What is pinned here:
 *   THE CONVENTION   the popup carries NO acknowledge control, therefore
 *                    outside-click closes it — and Escape does too.
 *   ZERO NAVIGATION  the summoning surface is still mounted beneath while the
 *                    popup is open. The truth visits the DM.
 *   PORTABILITY      the SAME component renders identically from two different
 *                    summoning surfaces (the Herald headline and a bare mount).
 *   THE FOUR TIERS   headline · subheader · telling · the cause-walk table.
 *   THE DISCLOSURE   a planted-then-worn link shows the commissioner, the
 *                    purpose and the SEEDED assertion; a player audience sees no
 *                    disclosure block at all.
 *   DORMANCY         dark ⇒ the Herald list item is exactly what it was: the
 *                    recorded headline, the inline toggle, no subheader, no
 *                    popup affordance.
 *
 * @enforced-by this file
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

afterEach(cleanup);

import CausalityPopup from '../../src/components/map/CausalityPopup.jsx';
import HeraldHeadline from '../../src/components/map/HeraldHeadline.jsx';
import { CONNECTIVE_POOLS } from '../../src/domain/display/heraldCausalGrammar.js';
import { UNRECEIPTED_HOP } from '../../src/domain/display/receiptClauseFloor.js';

const LINEAGE = 'disinfo:karsh:elmspur:10';

/** A world whose provenance ledger records one two-link chain off `evt-root`. */
function makeWorld({ lit = true } = {}) {
  return {
    tick: 70,
    simulationRules: lit ? { heraldCausalVoiceEnabled: true } : {},
    spatialLedgers: {
      provenance: {
        'evt-root': { parents: ['evt-a'], type: 'war_declared', tick: 70 },
        'evt-a': { parents: ['evt-b'], type: 'levy_shortfall', tick: 60 },
      },
      disinfo: {
        'plant:karsh:elmspur:karsh': {
          liarId: 'karsh',
          subjectId: 'karsh',
          audienceId: 'elmspur',
          assertedBand: 4,
          trueBand: 2,
          seededTick: 10,
          lineageId: LINEAGE,
          commission: { receipt: { patronId: 'house-vell', intent: 'inflate' } },
        },
      },
    },
    pulseHistory: [
      {
        tick: 70,
        selectedOutcomes: [
          { id: 'evt-root', headline: 'Karsh declares war on Elmspur', type: 'war_declared', settlementIds: ['s1'] },
          { id: 'evt-a', headline: 'the grain levy failed at Karsh', type: 'levy_shortfall', settlementIds: ['s1'] },
          { id: 'evt-b', headline: 'the eastern road was cut', type: 'route_severed', settlementIds: ['s1'] },
        ],
      },
    ],
  };
}

const ITEM = {
  id: 'evt-root',
  section: 'war',
  headline: 'Karsh declares war on Elmspur',
  summary: 'Karsh declared war on Elmspur this turning.',
  severity: 0.9,
  major: true,
  tick: 70,
  reasons: [],
  subject: { npcId: null, factionId: null, factionName: null, settlementId: 's1' },
  affectedIds: ['s1'],
  kind: 'war_declared',
  rootId: 'evt-root',
  provenance: 'canon',
  record: {},
};

const NAMES = new Map([['s1', 'Karsh'], ['house-vell', 'House Vell']]);

describe('THE POPUP CONVENTION — no acknowledge control, so outside-click closes', () => {
  test('renders no acknowledge/continue/dismiss control of any kind', () => {
    render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={makeWorld()} nameById={NAMES} seesSecrets />);
    const buttons = screen.getAllByRole('button').map((b) => (b.getAttribute('aria-label') || b.textContent || '').toLowerCase());
    for (const label of buttons) {
      expect(label).not.toMatch(/got it|continue|acknowledge|don.t show|understood|ok\b/);
    }
    // The one affordance present is a CLOSE, and it says so.
    expect(buttons.some((l) => l.includes('close'))).toBe(true);
    expect(screen.getByTestId('causality-popup-scrim').getAttribute('data-popup-convention')).toBe('outside-click');
  });

  test('outside-click closes; a click inside the body does not', () => {
    const closes = [];
    render(<CausalityPopup open onClose={() => closes.push('x')} item={ITEM} worldState={makeWorld()} nameById={NAMES} seesSecrets />);
    fireEvent.mouseDown(screen.getByTestId('causality-popup'));
    expect(closes).toHaveLength(0);
    fireEvent.mouseDown(screen.getByTestId('causality-popup-scrim'));
    expect(closes).toHaveLength(1);
  });

  test('Escape closes it too', () => {
    const closes = [];
    render(<CausalityPopup open onClose={() => closes.push('x')} item={ITEM} worldState={makeWorld()} nameById={NAMES} seesSecrets />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(closes).toHaveLength(1);
  });
});

describe('THE FOUR TIERS', () => {
  test('headline, subheader, telling and the cause-walk table all render', () => {
    render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={makeWorld()} nameById={NAMES} seesSecrets />);
    expect(screen.getByTestId('causality-headline').textContent).toContain('Karsh declares war on Elmspur');
    expect(screen.getByTestId('causality-subheader').textContent).toBe('Karsh declared war on Elmspur this turning.');
    expect(screen.getByTestId('causality-telling').textContent).toContain('the grain levy failed at Karsh');
    // The telling is freed from headline compression: BOTH links, where the
    // headline register carries at most one.
    expect(screen.getByTestId('causality-telling').textContent).toContain('the eastern road was cut');
    expect(screen.getByTestId('cause-walk')).toBeTruthy();
  });
});

describe('THE MANIPULATION DISCLOSURE', () => {
  test('a DM sees a per-link integrity register', () => {
    render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={makeWorld()} nameById={NAMES} seesSecrets />);
    const rows = screen.getAllByTestId('causality-disclosure-row');
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(['clean', 'worn', 'planted', 'planted_worn', 'unknown']).toContain(row.getAttribute('data-integrity'));
    }
  });

  test('a planted-then-worn link names the sowing and still shows the seeded assertion', () => {
    const world = makeWorld();
    // The chain's near hop is a telling that carries the synthetic lineage AND
    // drifted on the road — the compound state.
    world.pulseHistory[0].selectedOutcomes[1].lineageIds = [LINEAGE];
    world.pulseHistory[0].selectedOutcomes[1].accuracy01 = 0.4;
    render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={world} nameById={NAMES} seesSecrets />);
    const rows = screen.getAllByTestId('causality-disclosure-row');
    const planted = rows.find((r) => r.getAttribute('data-integrity') === 'planted_worn');
    expect(planted).toBeTruthy();
    // THE SOWING is charged: the commissioner and the purpose.
    expect(planted.textContent).toContain('House Vell');
    // THE SEED survives the mutation — the original intent, always.
    expect(screen.getAllByTestId('causality-seeded-assertion').length).toBeGreaterThan(0);
    expect(planted.textContent).toContain('Sown as:');
  });

  test('THE HARDEST NEGATIVE: the wear atop the plant is not re-attributed, and a merely-worn sibling names no one', () => {
    const world = makeWorld();
    world.pulseHistory[0].selectedOutcomes[1].lineageIds = [LINEAGE];
    world.pulseHistory[0].selectedOutcomes[1].accuracy01 = 0.4;
    // The DEEPER hop drifted on the road with no plant behind it at all. The
    // plant is real and in the same world; nothing may reach across and lend
    // this link a culprit.
    world.pulseHistory[0].selectedOutcomes[2].accuracy01 = 0.5;
    render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={world} nameById={NAMES} seesSecrets />);
    const worn = screen.getAllByTestId('causality-disclosure-row')
      .find((r) => r.getAttribute('data-integrity') === 'worn');
    expect(worn).toBeTruthy();
    expect(worn.textContent).not.toContain('House Vell');
    expect(worn.textContent).not.toContain('Sown as:');
    // And the compound row's own line still attributes the GROWTH to no one.
    const planted = screen.getAllByTestId('causality-disclosure-row')
      .find((r) => r.getAttribute('data-integrity') === 'planted_worn');
    expect(planted.textContent).toMatch(/never wrote|nobody's design|finished by accident|wear has no author/);
  });

  test('THE DIVERGENCE PIN: an ORGANIC lineage reads the same on both surfaces (F2)', () => {
    // `rumorNetwork` stamps [eventRef, originTelling, …relays] on every arrival,
    // so a lineage-bearing hop is the ORDINARY case. Before the prefix warrant,
    // the composer called this hop PLANTED in the telling while the integrity
    // register — reading the same hop, against the same ledger — called it clean.
    // One popup may never carry both answers, and the grander one was the lie.
    const world = makeWorld();
    world.pulseHistory[0].selectedOutcomes[1].lineageIds = ['evt-b', 'telling:elmspur:41'];
    render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={world} nameById={NAMES} seesSecrets />);

    const states = screen.getAllByTestId('causality-disclosure-row').map((r) => r.getAttribute('data-integrity'));
    expect(states).toContain('clean');
    expect(states).not.toContain('planted');
    expect(states).not.toContain('planted_worn');

    // …and the TELLING beside it spends no connective from the `planted` pool.
    const telling = screen.getByTestId('causality-telling').textContent;
    for (const line of CONNECTIVE_POOLS.planted) {
      expect(telling, `the telling says "${line.text}" where the register says clean`).not.toContain(line.text);
    }
    // GUARD-THE-GUARD: the same fixture wearing the SYNTHETIC prefix does reach
    // `planted` on the disclosure side, so the pin above measures the spelling.
    cleanup();
    const planted = makeWorld();
    planted.pulseHistory[0].selectedOutcomes[1].lineageIds = [LINEAGE];
    render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={planted} nameById={NAMES} seesSecrets />);
    expect(screen.getAllByTestId('causality-disclosure-row').map((r) => r.getAttribute('data-integrity'))).toContain('planted');
  });

  test('AN UNRECEIPTED HOP IS UNKNOWN, NEVER CLEAN (lane HG, F3)', () => {
    // The ledger names a parent that no pulseHistory record resolves. `clean` is
    // EVIDENCED — a receipt exists and carries no manipulation marker — so a hop
    // with no receipt at all may only read UNKNOWN. The popup decides that by
    // comparing the walk's own exported line; the drift this pin catches is a
    // second copy of that string going stale, which would mark the hop resolved
    // and have the paper vouch for a receipt it never found.
    const world = makeWorld();
    world.spatialLedgers.provenance['evt-b'] = { parents: ['evt-ghost'], type: 'condition', tick: 40 };
    render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={world} nameById={NAMES} seesSecrets />);
    const rows = screen.getAllByTestId('causality-disclosure-row');
    const states = rows.map((r) => r.getAttribute('data-integrity'));
    expect(states).toContain('unknown');
    // The unknown row names no culprit and invents no provenance.
    const unknown = rows.find((r) => r.getAttribute('data-integrity') === 'unknown');
    expect(unknown.textContent).toContain(UNRECEIPTED_HOP);
    expect(unknown.textContent).not.toContain('House Vell');
    expect(unknown.textContent).not.toContain('Sown as:');
    // GUARD-THE-GUARD: the RECEIPTED hops in the same popup do read clean, so the
    // pin is measuring the missing receipt and not a popup that says unknown to
    // everything.
    expect(states).toContain('clean');
  });

  test('a player audience sees NO disclosure block at all — not a stub, not a hole', () => {
    render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={makeWorld()} nameById={NAMES} seesSecrets={false} />);
    expect(screen.queryByTestId('causality-disclosure')).toBeNull();
    expect(screen.queryAllByTestId('causality-disclosure-row')).toHaveLength(0);
  });
});

describe('PORTABILITY + ZERO NAVIGATION', () => {
  test('the same popup renders identically from a Herald headline and from a bare mount', () => {
    const world = makeWorld();
    const bare = render(<CausalityPopup open onClose={() => {}} item={ITEM} worldState={world} nameById={NAMES} seesSecrets />);
    const fromBare = screen.getByTestId('causality-telling').textContent;
    bare.unmount();

    render(<HeraldHeadline item={ITEM} worldState={world} nameById={NAMES} seesSecrets />);
    fireEvent.click(screen.getByTestId('herald-headline-gesture'));
    expect(screen.getByTestId('causality-telling').textContent).toBe(fromBare);
    // ZERO NAVIGATION: the summoning surface is still mounted beneath.
    expect(screen.getByTestId('herald-headline')).toBeTruthy();
  });
});

describe('DORMANCY — the dark surface is the surface that shipped', () => {
  test('dark ⇒ the recorded headline, the inline toggle, no subheader, no popup affordance', () => {
    render(<HeraldHeadline item={ITEM} worldState={makeWorld({ lit: false })} nameById={NAMES} />);
    expect(screen.queryByTestId('herald-headline-gesture')).toBeNull();
    expect(screen.queryByTestId('herald-subheader')).toBeNull();
    expect(screen.getByText('Trace the causes')).toBeTruthy();
  });

  test('lit ⇒ the gesture replaces the inline toggle rather than doubling it', () => {
    render(<HeraldHeadline item={ITEM} worldState={makeWorld()} nameById={NAMES} seesSecrets />);
    expect(screen.getByTestId('herald-headline-gesture')).toBeTruthy();
    expect(screen.getByTestId('herald-subheader')).toBeTruthy();
    expect(screen.queryByText('Trace the causes')).toBeNull();
  });
});
