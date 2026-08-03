/** @vitest-environment jsdom */
/**
 * foundersHallPage.test.jsx — THE FOUNDERS' HALL, as it renders.
 *
 * The law is pinned in tests/lib/foundersHall.test.js; this file pins that the
 * COMPOSITION obeys it — the display law reaching the DOM, the presence law on
 * both arms of one ledger fixture, the role rings on three arms, the drawer's
 * keyboard path, and the consent rule that a chair without a released name is
 * rendered as an honor rather than a gap.
 *
 * The chair projection is stubbed at the lib boundary (the page imports it
 * dynamically), so these are real renders of real components against a real
 * ledger shape — not a mock of the page's own logic.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const storeRef = { current: { auth: { user: null }, isFounder: () => false } };
vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeRef.current),
}));

// The Hall's two backend seams, stubbed. `fetchFounderChairs` is the ledger read
// every pin below drives; the letterbox seam never touches a network here.
const chairsRef = { current: [] };
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { rpc: async () => ({ data: null, error: new Error('undeployed') }), from: () => ({}) },
  isConfigured: false,
}));

import FoundersHallPage from '../../src/components/founders/FoundersHallPage.jsx';
import ChairPlate from '../../src/components/founders/ChairPlate.jsx';
import ChairDrawer from '../../src/components/founders/ChairDrawer.jsx';
import * as hall from '../../src/lib/foundersHall.js';
import { HALL_CHAIR_COUNT } from '../../src/lib/foundersHall.js';

const chair = (n, displayName, extra = {}) => ({ chair: n, ...(displayName ? { displayName } : {}), ...extra });

/** Render the Hall against a given held-chair ledger and let its effect settle. */
async function renderHall(chairs) {
  chairsRef.current = chairs;
  vi.spyOn(hall, 'fetchFounderChairs').mockResolvedValue(chairs);
  const utils = render(<FoundersHallPage onNavigate={() => {}} />);
  await act(async () => { await Promise.resolve(); });
  await waitFor(() => {
    if (chairs.length) expect(screen.getAllByRole('listitem').length).toBe(chairs.length);
  });
  return utils;
}

beforeEach(() => {
  storeRef.current = { auth: { user: null }, isFounder: () => false };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('the pre-launch Hall (fail-closed, and still complete)', () => {
  test('with no backend it renders the covenant and an honest counter, not an error', async () => {
    await renderHall([]);
    expect(screen.getByRole('heading', { name: /The Founders’ Hall/ })).toBeTruthy();
    expect(screen.getByText(`${HALL_CHAIR_COUNT} chairs stand ready`)).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'The covenant' })).toBeTruthy();
  });

  test('ZERO UNFILLED CHAIRS reach the DOM — no vacant pedestals, ever', async () => {
    await renderHall([]);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.queryByText('Open')).toBeNull();
    // No PLATE exists — a plate is a button, so the absence is checked on the
    // control, not on the string "Seat", which the covenant legitimately quotes
    // as an example sentence ("the line that reads 'Seat IX'").
    expect(screen.queryAllByRole('button', { name: /Open this founder’s plate|Open this founder's plate/ })).toHaveLength(0);
  });

  test('THE ABOLISHED SENTENCES ARE GONE from the rendered page', async () => {
    const { container } = await renderHall([]);
    const text = container.textContent;
    // The literal sentences of the superseded design. Note what is NOT on this
    // list: the bare word "transfer". The covenant says chairs cannot be
    // "traded, inherited, or transferred" — DENYING a mechanic is the opposite
    // of offering it, and a pin that cannot tell those apart would forbid the
    // Hall from stating its own promise.
    for (const dead of [
      'Claim a Founder seat', 'One payment', 'seats remaining',
      'can change hands', 'transfer process', 'transferable', 'Lineage:',
    ]) {
      expect(text.includes(dead), `the Hall still renders "${dead}"`).toBe(false);
    }
    // Non-vacuity: the page HAS text, and it says the things it should.
    expect(text.length).toBeGreaterThan(200);
    expect(text).toContain('by invitation');
    expect(text).toContain('given, never sold');
    expect(text).toContain('transferred'); // the DENIAL is present — the pin above is not blind to the word
  });
});

describe('THE DISPLAY LAW, in the DOM', () => {
  const ledger = [
    chair(12, 'delphine'),
    chair(3),
    chair(21, 'Bram'),
    chair(9, 'Élodie'),
    chair(2, 'Aurel'),
  ];

  test('a hall of five is a hall of five — five plates, not thirty', async () => {
    await renderHall(ledger);
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getByText('5 of 30 chairs held')).toBeTruthy();
  });

  test('plates render alphabetically among the named, numeral-only last', async () => {
    await renderHall(ledger);
    const names = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(names[0]).toContain('Aurel');
    expect(names[1]).toContain('Bram');
    expect(names[2]).toContain('delphine');
    expect(names[3]).toContain('Élodie');
    // The numeral-only chair comes last and is presented as held, never as empty.
    expect(names[4]).toContain('Seat III');
    expect(names[4]).toContain('This chair is held');
  });

  test('the table rung of the ladder carries the same roll', async () => {
    await renderHall(ledger);
    const rows = screen.getAllByRole('row');
    // header + five chairs
    expect(rows).toHaveLength(6);
    expect(screen.getByRole('columnheader', { name: 'Chair' })).toBeTruthy();
  });
});

describe('CONSENT (§6) — a numeral-only chair is an honor, not a gap', () => {
  test('no name renders without its opt-in, and the plate still reads as held', async () => {
    await renderHall([chair(17, null, { seatedAt: '2026-05-01' })]);
    const plate = screen.getByRole('button', { name: /Seat XVII/ });
    expect(plate.textContent).toContain('Seat XVII');
    expect(plate.textContent).toContain('This chair is held');
    expect(plate.textContent).toContain('Seated MMXXVI');
    expect(screen.getByText('1 of 30 chairs held')).toBeTruthy();
  });
});

describe('ROLE RINGS (§7 — three arms, one fixture)', () => {
  const open = () => {};
  // The ring is a BAND OF INK on the plate's li, not a box-shadow (the deep-craft
  // kill-list forbids elevation), so the arms are read off the li's background.
  const ringBandOf = (name) => screen.getByRole('button', { name }).closest('li').getAttribute('style') || '';
  const DEVELOPER_HUE = 'rgb(91, 143, 214)';  // founderRingDeveloper #5B8FD6
  const ADMIN_HUE = 'rgb(200, 111, 176)';     // founderRingAdmin     #C86FB0

  test('a developer founder wears the developer ring and it is also NAMED', () => {
    render(<ul><ChairPlate chair={chair(4, 'Ada', { ringRole: 'developer' })} index={0} onOpen={open} /></ul>);
    const plate = screen.getByRole('button', { name: /Ada/ });
    expect(plate.textContent).toContain('Developer');
    expect(ringBandOf(/Ada/)).toContain(DEVELOPER_HUE);
    // The hue never carries the fact alone (WCAG 1.4.1) — it is in the accessible name too.
    expect(plate.getAttribute('aria-label')).toContain('Developer');
  });

  test('an admin founder wears the admin ring — a DIFFERENT hue, not the same one', () => {
    render(<ul><ChairPlate chair={chair(5, 'Bo', { ringRole: 'admin' })} index={0} onOpen={open} /></ul>);
    const plate = screen.getByRole('button', { name: /Bo/ });
    expect(plate.textContent).toContain('Admin');
    expect(ringBandOf(/Bo/)).toContain(ADMIN_HUE);
    expect(ringBandOf(/Bo/)).not.toContain(DEVELOPER_HUE); // anchored: the developer arm above proves this hue renders when the role is developer
    expect(plate.getAttribute('aria-label')).toContain('Admin');
  });

  test('a non-staff founder renders NO ring and no role word', () => {
    render(<ul><ChairPlate chair={chair(6, 'Cyd')} index={0} onOpen={open} /></ul>);
    const plate = screen.getByRole('button', { name: /Cyd/ });
    expect(plate.textContent).toContain('Cyd');
    expect(plate.textContent).not.toContain('Developer'); // anchored: the developer arm above proves the word renders when the role exists
    expect(plate.textContent).not.toContain('Admin');     // anchored: the admin arm above proves the same for admin
    const band = ringBandOf(/Cyd/);
    expect(band).not.toContain(DEVELOPER_HUE); // anchored: both hues are proven to render on the two arms above
    expect(band).not.toContain(ADMIN_HUE);     // anchored: same
    expect(band).not.toContain('background');  // anchored: the ringed arms above prove `background` appears when a ring exists
  });

  test('no plate carries an ELEVATION — the ring is ink, not shadow', () => {
    render(<ul><ChairPlate chair={chair(4, 'Ada', { ringRole: 'developer' })} index={0} onOpen={open} /></ul>);
    const li = screen.getByRole('button', { name: /Ada/ }).closest('li');
    // The Button primitive always emits a `box-shadow` declaration (its ghost
    // variant sets it to `none`), so the rule is not "no such property" but "no
    // shadow is ever DRAWN". Anything other than `none` is elevation.
    const shadows = li.outerHTML.match(/box-shadow: *([^;"]+)/g) || [];
    expect(shadows.length, 'non-vacuity: the plate does declare a box-shadow to check').toBeGreaterThan(0);
    for (const s of shadows) expect(s.trim()).toBe('box-shadow: none');
  });
});

describe('THE BIO DRAWER (§2) — keyboard-reachable by construction', () => {
  test('the plate is a real button, and activating it opens the drawer', async () => {
    await renderHall([chair(9, 'Élodie', { bio: 'Keeps small towns and long winters.' })]);
    const plate = screen.getByRole('button', { name: /Élodie/ });
    expect(plate.tagName).toBe('BUTTON');
    fireEvent.click(plate);
    const drawer = await screen.findByRole('dialog');
    expect(drawer.textContent).toContain('Keeps small towns and long winters.');
  });

  test('Escape closes the drawer and focus returns to the plate that opened it', async () => {
    await renderHall([chair(9, 'Élodie', { bio: 'A long enough line for a plate.' })]);
    const plate = screen.getByRole('button', { name: /Élodie/ });
    plate.focus();
    fireEvent.click(plate);
    await screen.findByRole('dialog');
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(plate);
  });

  test('a chair with no released bio says so — it never invents one from an account', () => {
    render(<ChairDrawer chair={chair(17, null, { seatedAt: '2026-01-01' })} onClose={() => {}} />);
    const drawer = screen.getByRole('dialog');
    expect(drawer.textContent).toContain('has not written a line');
    expect(drawer.textContent).toContain('Seat XVII');
  });
});

describe('THE PRESENCE LAW (§5b) — both arms, one ledger fixture', () => {
  const fill = (n) => Array.from({ length: n }, (_, i) => chair(i + 1, `Founder ${i + 1}`));

  test('held < thirty ⇒ the Request control is PRESENT', async () => {
    await renderHall(fill(29));
    expect(screen.getByRole('heading', { name: 'Request a chair' })).toBeTruthy();
    expect(screen.getByText(/Every letter is read/)).toBeTruthy();
    expect(screen.queryByText(/The Hall is full/)).toBeNull();
  });

  test('held == thirty ⇒ the Request control is ABSENT (not disabled) and the full-hall line stands in its place', async () => {
    await renderHall(fill(30));
    expect(screen.getByText(/The Hall is full — 30 chairs, 30 names\./)).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Request a chair' })).toBeNull();
    // ABSENT, not disabled: there is no control to be found in any state.
    const controls = screen.queryAllByRole('button', { name: /Request a chair|Sign in to write/ });
    expect(controls).toHaveLength(0);
    expect(screen.getByText('30 of 30 chairs held')).toBeTruthy();
  });
});

describe('THE LETTERBOX (§5b) — a letter, never a purchase', () => {
  test('an anonymous visitor is asked to sign in first, and returns to the Hall', async () => {
    await renderHall([]);
    const link = screen.getByRole('link', { name: /Sign in to write a letter/ });
    expect(link.getAttribute('href')).toBe('/signin?next=%2Ffounders');
  });

  test('a signed-in visitor gets the two prompts, framed around what a founder IS', async () => {
    storeRef.current = { auth: { user: { id: 'u1', email: 'a@b.c' } }, isFounder: () => false };
    await renderHall([]);
    fireEvent.click(screen.getByRole('button', { name: 'Request a chair' }));
    expect(screen.getByLabelText('Why do you wish to be a founder?')).toBeTruthy();
    expect(screen.getByLabelText('What would holding a chair mean to you?')).toBeTruthy();
    // THE FORM IS THE FILTER: it must not smell like an influencer application,
    // even though chairs will often go to prominent DMs.
    const text = document.body.textContent.toLowerCase();
    for (const smell of ['follower', 'audience', 'reach', 'subscribers', 'apply now']) {
      expect(text.includes(smell), `the letter asks for "${smell}"`).toBe(false);
    }
    // Non-vacuity: the letter's own words ARE in the text this pin searched.
    expect(text).toContain('why do you wish to be a founder');
  });

  test('a band-failed answer is refused politely, and nothing is sent', async () => {
    const sent = [];
    storeRef.current = { auth: { user: { id: 'u1', email: 'a@b.c' } }, isFounder: () => false };
    vi.spyOn(hall, 'fetchFounderChairs').mockResolvedValue([]);
    const { default: RequestChairLetter } = await import('../../src/components/founders/RequestChairLetter.jsx');
    render(
      <RequestChairLetter
        auth={storeRef.current.auth}
        onSubmit={async (l) => { sent.push(l); return { ok: true, error: null }; }}
        onLoadStanding={async () => ({ canWrite: true, state: 'none', since: null, daysLeft: null })}
      />,
    );
    await act(async () => { await Promise.resolve(); });
    fireEvent.click(screen.getByRole('button', { name: 'Request a chair' }));
    fireEvent.click(screen.getByRole('button', { name: 'Send the letter' }));
    await waitFor(() => expect(screen.getAllByRole('alert').length).toBeGreaterThan(0));
    expect(sent).toHaveLength(0);
  });

  test('an account with a letter already in hand is told so, and cannot write a second', async () => {
    storeRef.current = { auth: { user: { id: 'u1', email: 'a@b.c' } }, isFounder: () => false };
    const { default: RequestChairLetter } = await import('../../src/components/founders/RequestChairLetter.jsx');
    render(
      <RequestChairLetter
        auth={storeRef.current.auth}
        onSubmit={async () => ({ ok: true, error: null })}
        onLoadStanding={async () => ({ canWrite: false, state: 'open', since: null, daysLeft: null })}
      />,
    );
    await waitFor(() => expect(screen.getByText('Your letter is already in hand.')).toBeTruthy());
    expect(screen.queryByRole('button', { name: 'Request a chair' })).toBeNull();
  });

  test('EXPECTATION HONESTY: no queue position, no status tracker, no timeline', async () => {
    await renderHall([]);
    const text = document.body.textContent.toLowerCase();
    for (const promise of ['position in', 'we will respond within', 'status:', 'estimated', 'business days']) {
      expect(text.includes(promise), `the letterbox promised "${promise}"`).toBe(false);
    }
    expect(text).toContain('may not be answered with a chair');
    expect(text).toContain('every letter is read');
  });
});
