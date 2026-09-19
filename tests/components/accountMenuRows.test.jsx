/**
 * @vitest-environment jsdom
 *
 * tests/components/accountMenuRows.test.jsx: THE PLATE'S MENU, its rows and its keys.
 *
 * The owner's orders (2026-09-16) made the header the owner's arrow painting, which has one
 * blank brass plate and no room for the old cluster of header controls. So the account lives
 * on the plate (components/AccountMenu.jsx) and credits, Upgrade and Admin moved into its
 * menu, which completes the WAI-ARIA menu-button pattern in the same change:
 *   (a) signed out: the plate is one button named "Sign In", on a parchment slip;
 *   (b) signed in: the plate's name is "Account menu" plus its visible name (WCAG 2.5.3);
 *   (c) the credits row names the balance ("..., N credits remaining") and routes to pricing;
 *   (d) Upgrade shows for the free tier only: locked with the launch pill while purchases are
 *       closed (aria-disabled, so the arrow keys still reach it, and a click or Enter does
 *       nothing), live and routing once they open (the launch lock is preserved);
 *   (e) the Developer Admin Panel row shows only for STAFF accounts and routes to admin.
 *       ODQ §934.28 (the owner): "move the developer tab that existed in the previous
 *       header to part of the dropdown under account for developers and admin". The
 *       retired header carried it as a Shield IconButton titled "Developer Admin
 *       Panel"; the row that replaced it read "Admin panel", which is why the owner
 *       could not find the tab they had asked to be moved. The NAME is pinned here so a
 *       rename cannot silently lose it again — and so is the measured fact that NO row
 *       in this menu renders an icon, so nobody re-adds the Shield believing it shows;
 *   (f) keys: Enter, Space or ArrowDown opens and focuses the first row, ArrowUp the last;
 *       the arrows, Home and End move among every row, the locked one included; Escape and
 *       choosing a row return focus to the plate; Tab closes; aria-controls names the open
 *       menu, which the plate labels; rows are out of the Tab order;
 *   (g) the slip: a signed-in name as written (no capitals, no letter-spacing), its type
 *       stepped down to SLIP_FLOOR before any ellipsis, the full name in a title and the
 *       plate's name; "Sign In" keeps its capitals;
 *   (h) the menu stays on the page: at 320 px it shifts right just far enough to clear the
 *       page's left edge, and at 390 and 1440 it stays right-aligned to the plate.
 */
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

import { layoutArrow, padTarget } from '../../src/components/nav/arrowGeometry.js';
import { AVAILABLE_AT_LAUNCH } from '../../src/components/primitives/AvailableAtLaunchPill.jsx';
import { purchasesOpen } from '../../src/lib/launchGate.js';

const refreshMessages = vi.hoisted(() => vi.fn(async () => []));

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/components/account/OperatorMessagesProvider.jsx', () => ({
  useOperatorMessages: () => ({ unreadCount: 0, refresh: refreshMessages }),
}));

import AccountMenu, { MENU_W, SLIP_FLOOR, menuShift } from '../../src/components/AccountMenu.jsx';

const layout = layoutArrow({ clientWidth: 1440, full: true });

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  refreshMessages.mockClear();
});

/** Render the plate for a signed-in account with every callback spied. */
function renderPlate(props = {}) {
  const calls = {
    onAccount: vi.fn(), onMessages: vi.fn(), onManageSubscription: vi.fn(), onUpgrade: vi.fn(), onAdmin: vi.fn(),
  };
  const view = render(
    <AccountMenu layout={layout} isAnon={false} displayName="Alice" creditBalance={7} unreadCount={0} {...calls} {...props} />,
  );
  return { ...view, calls, plate: screen.getByRole('button', { name: /^Account menu/ }) };
}

const rowNames = () => screen.getAllByRole('menuitem').map((row) => row.getAttribute('aria-label') || row.textContent);

describe('(a) and (b) the plate and its names', () => {
  test('signed out: one button named "Sign In", its text on the parchment slip', () => {
    const onSignIn = vi.fn();
    const { container } = render(<AccountMenu layout={layout} isAnon onSignIn={onSignIn} />);
    const signIn = screen.getByRole('button', { name: 'Sign In' });
    expect(signIn.textContent).toBe('Sign In');
    expect(container.querySelectorAll('button').length).toBe(1);
    fireEvent.click(signIn);
    expect(onSignIn).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });

  test('signed in: the plate\'s name contains its visible name, and it declares a menu', () => {
    const { plate } = renderPlate();
    expect(plate.getAttribute('aria-label')).toBe('Account menu, Alice');
    expect(plate.getAttribute('aria-label')).toContain(plate.textContent);
    expect(plate.getAttribute('aria-haspopup')).toBe('menu');
    expect(plate.getAttribute('aria-expanded')).toBe('false');
    expect(plate.hasAttribute('aria-controls'), 'nothing to control while closed').toBe(false);
  });

  test('a nameless member reads "Account", and the plate is simply "Account menu"', () => {
    renderPlate({ displayName: null });
    expect(screen.getByRole('button', { name: 'Account menu' }).textContent).toBe('Account');
  });

  test('the slip sits between the plate\'s rivets: its box is the layout\'s slip, inside the plate', () => {
    const { plate } = renderPlate();
    const slip = plate.firstElementChild;
    const { plate: p, slip: s } = layout.hits;
    expect([slip.style.left, slip.style.top, slip.style.width, slip.style.height])
      .toEqual([`${s.x - p.x}px`, `${s.y - p.y}px`, `${s.w}px`, `${s.h}px`]);
    expect(s.x).toBeGreaterThan(p.x);
    expect(s.x + s.w).toBeLessThan(p.x + p.w);
  });
});

describe('(c) the credits row', () => {
  test('names the balance and routes to pricing', () => {
    const { plate, calls } = renderPlate({ creditBalance: 12 });
    fireEvent.click(plate);
    const credits = screen.getByRole('menuitem', { name: 'Manage subscription & credits, 12 credits remaining' });
    expect(credits.textContent).toContain('12 credits');
    fireEvent.click(credits);
    expect(calls.onManageSubscription).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('(d) Upgrade: free tier only, and launch-locked', () => {
  test('closed build: locked, wearing the pill, and a click routes nowhere', () => {
    expect(purchasesOpen(), 'the test env keeps purchases closed').toBe(false);
    const { plate, calls } = renderPlate({ showUpgrade: true, upgradeLocked: !purchasesOpen() });
    fireEvent.click(plate);
    const upgrade = screen.getByRole('menuitem', { name: /Upgrade/ });
    expect(upgrade.getAttribute('aria-disabled')).toBe('true');
    expect(upgrade.disabled, 'aria-disabled, not native disabled, so it stays reachable').toBe(false);
    expect(within(upgrade).getByText(AVAILABLE_AT_LAUNCH)).toBeTruthy();
    expect([upgrade.style.opacity, upgrade.style.cursor]).toEqual(['0.62', 'not-allowed']);
    fireEvent.click(upgrade);
    expect(calls.onUpgrade).not.toHaveBeenCalled();
    expect(screen.getByRole('menu'), 'a click on the locked row leaves the menu open').toBeTruthy();
  });

  test('open build: live, no pill, and it routes', () => {
    vi.stubEnv('VITE_PURCHASES_OPEN', 'true');
    const { plate, calls } = renderPlate({ showUpgrade: true, upgradeLocked: !purchasesOpen() });
    fireEvent.click(plate);
    const upgrade = screen.getByRole('menuitem', { name: 'Upgrade' });
    expect(upgrade.disabled).toBe(false);
    expect(upgrade.hasAttribute('aria-disabled')).toBe(false);
    expect(upgrade.textContent).toBe('Upgrade');
    fireEvent.click(upgrade);
    expect(calls.onUpgrade).toHaveBeenCalledTimes(1);
  });

  test('no Upgrade row unless the account is free tier (anchored on the credits row)', () => {
    const { plate } = renderPlate({ showUpgrade: false });
    fireEvent.click(plate);
    const names = rowNames();
    expect(names).toEqual(['Account', 'Messages', 'Manage subscription & credits, 7 credits remaining']);
  });
});

describe('(e) Developer Admin Panel: staff accounts only', () => {
  const ROW = 'Developer Admin Panel';

  test('shows for a staff account, last, under the old tab\'s name, and routes to admin', () => {
    const { plate, calls } = renderPlate({ isElevated: true, displayName: null });
    expect(plate.getAttribute('aria-label')).toBe('Account menu, Developer');
    fireEvent.click(plate);
    expect(rowNames().at(-1)).toBe(ROW);
    fireEvent.click(screen.getByRole('menuitem', { name: ROW }));
    expect(calls.onAdmin).toHaveBeenCalledTimes(1);
  });

  test('NO ROW IN THIS MENU RENDERS AN ICON — the icons-off gate drops all four', () => {
    // ⛔ WHY THIS IS PINNED RATHER THAN FIXED. A §934.28 draft gave the row the
    // retired header tab's Shield so it would "match its siblings". It would
    // have matched them in SOURCE and in nothing a reader sees: primitives/
    // IconsContext.js suppresses lucide everywhere outside the Realm map, and
    // Button drops its `icon` prop when the gate is off — and this menu renders
    // in the header, outside the map's Provider. So the three icons the menu
    // already passes (Settings, CreditCard, MessageSquare) reach the DOM no more
    // than a fourth would have. Measured here so the next author who reaches for
    // a glyph reads the measurement instead of repeating the draft.
    const { plate } = renderPlate({ isElevated: true });
    fireEvent.click(plate);
    const rows = screen.getAllByRole('menuitem');
    expect(rows.length, 'presence control: the staff menu rendered its rows').toBe(4);
    for (const row of rows) {
      expect(
        row.querySelector('svg'),
        `${row.textContent} rendered a glyph — has the icons-off gate moved?`,
      ).toBeNull();
    }
  });

  test('NEGATIVE CONTROL: a member account has no Developer row', () => {
    const { plate } = renderPlate({ isElevated: false });
    fireEvent.click(plate);
    const names = rowNames();
    expect(names.length, 'presence control: the menu rendered its rows').toBe(3);
    // Anchored: 'Account' travels the same render path, so the exclusion cannot
    // pass merely because the menu failed to render at all.
    expectAbsentWithAnchor(names, ROW, 'Account', 'the signed-in member menu');
  });
});

describe('(f) the menu-button keys', () => {
  test('ArrowDown on the plate opens the menu and focuses the first row; aria-controls names it', () => {
    const { plate } = renderPlate({ showUpgrade: true, upgradeLocked: true, isElevated: true });
    plate.focus();
    fireEvent.keyDown(plate, { key: 'ArrowDown' });
    const menu = screen.getByRole('menu');
    expect(plate.getAttribute('aria-expanded')).toBe('true');
    expect(plate.getAttribute('aria-controls')).toBe(menu.id);
    expect(document.getElementById(plate.getAttribute('aria-controls'))).toBe(menu);
    expect(menu.getAttribute('aria-labelledby')).toBe(plate.id);
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Account' }));
    for (const row of screen.getAllByRole('menuitem')) expect(row.getAttribute('tabindex')).toBe('-1');
  });

  test('Enter and Space open too; ArrowUp opens on the last enabled row', () => {
    const { plate } = renderPlate({ isElevated: true });
    fireEvent.keyDown(plate, { key: 'Enter' });
    expect(document.activeElement.textContent).toBe('Account');
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    fireEvent.keyDown(plate, { key: ' ' });
    expect(document.activeElement.textContent).toBe('Account');
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    fireEvent.keyDown(plate, { key: 'ArrowUp' });
    expect(document.activeElement.textContent).toBe('Developer Admin Panel');
  });

  test('arrows wrap, Home and End jump, and the locked Upgrade row is a stop that says it is locked', () => {
    const { plate } = renderPlate({ showUpgrade: true, upgradeLocked: true, isElevated: true });
    fireEvent.keyDown(plate, { key: 'ArrowDown' });
    const focused = () => document.activeElement.getAttribute('aria-label') || document.activeElement.textContent;
    const menu = screen.getByRole('menu');
    fireEvent.keyDown(menu, { key: 'End' });
    expect(focused()).toBe('Developer Admin Panel');
    fireEvent.keyDown(menu, { key: 'ArrowUp' });
    // The locked Upgrade row is discoverable (WAI-ARIA APG): focus lands on it and it reads
    // its pill, and Enter on it does nothing.
    expect(focused()).toBe(`Upgrade${AVAILABLE_AT_LAUNCH}`);
    expect(document.activeElement.getAttribute('aria-disabled')).toBe('true');
    fireEvent.keyDown(menu, { key: 'ArrowUp' });
    expect(focused()).toBe('Manage subscription & credits, 7 credits remaining');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(focused()).toBe('Developer Admin Panel');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    expect(focused(), 'ArrowDown wraps to the first row').toBe('Account');
    fireEvent.keyDown(menu, { key: 'ArrowUp' });
    expect(focused(), 'ArrowUp wraps to the last row').toBe('Developer Admin Panel');
    fireEvent.keyDown(menu, { key: 'Home' });
    expect(focused()).toBe('Account');
  });

  test('Escape closes and returns focus to the plate', () => {
    const { plate } = renderPlate();
    fireEvent.keyDown(plate, { key: 'ArrowDown' });
    expect(document.activeElement.getAttribute('role')).toBe('menuitem');
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(plate);
  });

  test('choosing a row closes the menu, returns focus to the plate, then acts', () => {
    const { plate, calls } = renderPlate();
    fireEvent.keyDown(plate, { key: 'ArrowDown' });
    fireEvent.click(document.activeElement);
    expect(calls.onAccount).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(plate);
  });

  test('Tab closes the menu and hands focus back to the plate for the browser to move on', () => {
    const { plate } = renderPlate();
    fireEvent.keyDown(plate, { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Tab' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(plate);
    expect(plate.getAttribute('aria-expanded')).toBe('false');
  });

  test('a mouse click toggles the menu and refreshes messages once per opening', () => {
    const { plate } = renderPlate();
    fireEvent.click(plate);
    expect(screen.getByRole('menu')).toBeTruthy();
    expect(refreshMessages).toHaveBeenCalledTimes(1);
    fireEvent.click(plate);
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('(g) the slip shows the signed-in name, readable', () => {
  /**
   * jsdom has no layout, so give the name a width that follows its own font size (about 0.55
   * of the size per character, the house sans's measured average) against the slip's width.
   */
  function fakeLayout(slipContent) {
    const text = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth');
    const client = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get() { return this.title ? Math.ceil(this.textContent.length * 0.55 * parseFloat(this.style.fontSize)) : 0; },
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() { return this.title ? Math.min(slipContent, this.scrollWidth) : 0; },
    });
    return () => {
      if (text) Object.defineProperty(HTMLElement.prototype, 'scrollWidth', text); else delete HTMLElement.prototype.scrollWidth;
      if (client) Object.defineProperty(HTMLElement.prototype, 'clientWidth', client); else delete HTMLElement.prototype.clientWidth;
    };
  }
  const nameSpan = (plate) => plate.querySelector('[title]');

  test('a name is shown as written: no capitals, no letter-spacing, with its full text in a title and the plate\'s name', () => {
    const { plate } = renderPlate({ displayName: 'Aldric Thornby' });
    const name = nameSpan(plate);
    expect(name.textContent).toBe('Aldric Thornby');
    expect(name.title).toBe('Aldric Thornby');
    expect([name.style.textTransform, name.style.letterSpacing]).toEqual(['none', 'normal']);
    expect(plate.getAttribute('aria-label')).toBe('Account menu, Aldric Thornby');
    // Signed out keeps its capitals.
    cleanup();
    render(<AccountMenu layout={layout} isAnon onSignIn={() => {}} />);
    const signIn = screen.getByRole('button', { name: 'Sign In' }).firstElementChild;
    expect(signIn.style.textTransform).toBe('uppercase');
  });

  test('a name wider than the slip steps its type down before any ellipsis, and a name that fits keeps the full size', () => {
    const phone = layoutArrow({ clientWidth: 390, full: false });
    const restore = fakeLayout(41);
    try {
      // 8 letters: 8 x 0.55 x 10 = 44 px at the phone's 10 px, over 41; 9.0 px fits (40).
      const eight = renderPlate({ layout: phone, displayName: 'Wanderer' });
      expect(nameSpan(eight.plate).style.fontSize).toBe('9px');
      cleanup();
      // 5 letters fit at full size.
      const five = renderPlate({ layout: phone, displayName: 'Aldra' });
      expect(nameSpan(five.plate).style.fontSize).toBe('10px');
      cleanup();
      // 14 letters stop at the floor and take the ellipsis there.
      const fourteen = renderPlate({ layout: phone, displayName: 'Aldric Thornby' });
      const name = nameSpan(fourteen.plate);
      expect(name.style.fontSize).toBe(`${SLIP_FLOOR}px`);
      expect(name.style.textOverflow).toBe('ellipsis');
      expect(SLIP_FLOOR).toBe(8);
    } finally {
      restore();
    }
  });
});

describe('(h) the menu stays on the page', () => {
  test('at 320 px it shifts right just far enough to keep MENU_W clear of the left edge; at 390 and 1440 it is right-aligned to the plate', () => {
    for (const [cw, full, wantShift] of [[320, false, true], [390, false, false], [1440, true, false]]) {
      const l = layoutArrow({ clientWidth: cw, full });
      const plateBox = full ? l.hits.plate : padTarget(l.hits.plate, 44, l.width);
      const right = plateBox.x + plateBox.w;
      const shift = menuShift(right, l.width);
      expect(shift > 0, `${cw} px shifts`).toBe(wantShift);
      // The menu's left edge (MENU_W wide at most) is at least 8 px inside the page, and its
      // right edge never passes the page's right edge less 8 px.
      expect(right + shift - MENU_W, `${cw} px left edge`).toBeGreaterThanOrEqual(8 - 1e-9);
      expect(right + shift, `${cw} px right edge`).toBeLessThanOrEqual(cw - 8 + 1e-9);
      const view = renderPlate({ layout: l, roomy: !full });
      fireEvent.click(view.plate);
      const menu = screen.getByRole('menu');
      expect(menu.style.right).toBe(`${-shift}px`);
      expect(menu.style.maxWidth).toBe(`${cw - 16}px`);
      cleanup();
    }
  });
});
