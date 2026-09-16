/** @vitest-environment jsdom */
/**
 * staleDeployNotice.test.jsx - the "a new version is live" strip.
 *
 * Pins: silent until the recovery raises it; shows when raised BEFORE mount (the
 * recovery can fire during boot, before React renders); shows when the event
 * arrives after mount; the Reload control reloads and Dismiss hides; the copy
 * comes from the register and carries no em dash.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import StaleDeployNotice from '../../src/components/StaleDeployNotice.jsx';
import { STALE_DEPLOY_EVENT } from '../../src/lib/staleDeploy.js';
import { t } from '../../src/copy/index.js';

describe('StaleDeployNotice', () => {
  afterEach(() => cleanup());

  it('renders nothing until the recovery raises it', () => {
    const { container } = render(<StaleDeployNotice isShown={() => false} />);
    expect(container.innerHTML).toBe('');
    expect(screen.queryByRole('alert')).toBe(null);
  });

  it('shows when raised before it mounted', () => {
    render(<StaleDeployNotice isShown={() => true} />);
    expect(screen.getByRole('alert').textContent).toContain(t('errors.staleDeploy'));
  });

  it('shows when the event arrives after mount', () => {
    let raised = false;
    render(<StaleDeployNotice isShown={() => raised} />);
    expect(screen.queryByRole('alert')).toBe(null);
    act(() => {
      raised = true;
      window.dispatchEvent(new CustomEvent(STALE_DEPLOY_EVENT));
    });
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('Reload reloads; Dismiss hides without reloading', () => {
    const reload = vi.fn();
    render(<StaleDeployNotice isShown={() => true} reload={reload} />);
    fireEvent.click(screen.getByRole('button', { name: t('errors.staleDeployReload') }));
    expect(reload).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: t('errors.staleDeployDismiss') }));
    expect(screen.queryByRole('alert')).toBe(null);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('its copy is registered and carries no em dash', () => {
    for (const key of ['errors.staleDeploy', 'errors.staleDeployReload', 'errors.staleDeployDismiss', 'errors.forgeUpdated']) {
      const text = t(key);
      expect(text, key).toBeTruthy();
      expect(text, key).not.toBe(key);
      expect(text.includes('—'), `${key} has an em dash`).toBe(false);
    }
  });
});
