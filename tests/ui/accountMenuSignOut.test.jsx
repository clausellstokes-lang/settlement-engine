/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountMenuSignOut.test.jsx — Phase A1 sign-out affordance.
 *
 * AccountMenu gained a "Sign out" item (it previously had none — sign-out
 * only lived in the AuthModal account card). This locks:
 *   - a signed-in user sees a "Sign out" menu item after opening the menu,
 *   - clicking it invokes the onSignOut callback (which, in App, calls the
 *     authSignOut store action + routes home),
 *   - an anonymous visitor (plain "Sign In" button) has no menu and no
 *     sign-out item.
 *
 * The menu only renders its items once opened, so we click the chip first.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import AccountMenu from '../../src/components/AccountMenu.jsx';

afterEach(cleanup);

describe('AccountMenu — sign out', () => {
  it('signed-in: shows a Sign out item that calls onSignOut', () => {
    const onSignOut = vi.fn();
    render(
      <AccountMenu
        isAnon={false}
        displayName="Tester"
        isElevated={false}
        onSignIn={vi.fn()}
        onAccount={vi.fn()}
        onManageSubscription={vi.fn()}
        onSignOut={onSignOut}
      />
    );

    // Open the dropdown (its items are conditionally rendered).
    fireEvent.click(screen.getByRole('button', { name: /tester/i }));

    const signOut = screen.getByRole('menuitem', { name: /sign out/i });
    expect(signOut).toBeTruthy();

    fireEvent.click(signOut);
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });

  it('omits the Sign out item when no onSignOut handler is provided', () => {
    render(
      <AccountMenu
        isAnon={false}
        displayName="Tester"
        isElevated={false}
        onSignIn={vi.fn()}
        onAccount={vi.fn()}
        onManageSubscription={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /tester/i }));
    expect(screen.queryByRole('menuitem', { name: /sign out/i })).toBeNull();
  });

  it('anonymous: renders a Sign In button and no sign-out menu', () => {
    render(
      <AccountMenu
        isAnon
        displayName={null}
        isElevated={false}
        onSignIn={vi.fn()}
        onSignOut={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
    expect(screen.queryByRole('menuitem', { name: /sign out/i })).toBeNull();
  });
});
