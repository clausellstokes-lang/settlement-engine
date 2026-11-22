/** @vitest-environment jsdom */
/**
 * staleDeployNotice.test.jsx - the "a new version is live" strip.
 *
 * Pins: silent until the recovery raises it; shows when raised BEFORE mount (the
 * recovery can fire during boot, before React renders); shows when the event
 * arrives after mount; the Reload control reloads and Dismiss hides; the words are
 * literals with no em dash, and the notice never imports the copy register (the
 * register is a lazy chunk, and importing it from this eager component once dragged
 * it into the entry chunk, over every first-paint budget).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import StaleDeployNotice, { STALE_DEPLOY_COPY } from '../../src/components/StaleDeployNotice.jsx';
import { STALE_DEPLOY_EVENT } from '../../src/lib/staleDeploy.js';
import { t } from '../../src/copy/index.js';

const EM_DASH = String.fromCharCode(0x2014);

describe('StaleDeployNotice', () => {
  afterEach(() => cleanup());

  it('renders nothing until the recovery raises it', () => {
    const { container } = render(<StaleDeployNotice isShown={() => false} />);
    expect(container.innerHTML).toBe('');
    expect(screen.queryByRole('alert')).toBe(null);
  });

  it('shows when raised before it mounted', () => {
    render(<StaleDeployNotice isShown={() => true} />);
    expect(screen.getByRole('alert').textContent).toContain(STALE_DEPLOY_COPY.message);
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
    fireEvent.click(screen.getByRole('button', { name: STALE_DEPLOY_COPY.reload }));
    expect(reload).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: STALE_DEPLOY_COPY.dismiss }));
    expect(screen.queryByRole('alert')).toBe(null);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('its words carry no em dash, and the hero message is registered', () => {
    for (const [key, text] of Object.entries(STALE_DEPLOY_COPY)) {
      expect(text, key).toBeTruthy();
      expect(text.includes(EM_DASH), `${key} has an em dash`).toBe(false);
    }
    const hero = t('errors.forgeUpdated');
    expect(hero).not.toBe('errors.forgeUpdated');
    expect(hero.includes(EM_DASH)).toBe(false);
  });

  it('the notice never imports the copy register (it must stay out of the entry chunk)', () => {
    const source = readFileSync(join(process.cwd(), 'src/components/StaleDeployNotice.jsx'), 'utf8');
    expect(/from ['"][./]*copy\//.test(source), 'StaleDeployNotice imports src/copy').toBe(false);
    expect(source.includes('lib/staleDeploy.js'), 'the import scan read the real notice source').toBe(true);
  });
});
