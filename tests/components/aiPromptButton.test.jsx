/** @vitest-environment jsdom */
/**
 * aiPromptButton.test.jsx — Contract over P137 / HT-4.
 *
 * Pins:
 *   • Hidden for anonymous users (anon tier sees nothing).
 *   • Hidden when no settlement (defensive).
 *   • Clicking copies grounded prompt text to clipboard.
 *   • Fires AI_PROMPT_COPIED analytics on success.
 *   • Surfaces a success state ("Copied to clipboard") after copy.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(() => true),
}));

const trackSpy = vi.fn();
vi.mock('../../src/lib/analytics.js', () => ({
  Funnel: { track: (...a) => trackSpy(...a) },
  EVENTS: { AI_PROMPT_COPIED: 'ai_prompt_copied' },
}));

vi.mock('../../src/domain/aiGrounding.js', () => ({
  buildAiGroundingPayload: vi.fn(() => ({ name: 'Hightower' })),
  assemblePromptSections: vi.fn(() => [
    'Header section about Hightower',
    'Body section about pressure',
  ]),
}));

vi.mock('../../src/store/index.js', () => {
  const data = { auth: { tier: 'wanderer' } };
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore };
});

import AIPromptButton from '../../src/components/dossier/AIPromptButton.jsx';
import { useStore } from '../../src/store/index.js';

describe('AIPromptButton', () => {
  let writeText;

  beforeEach(() => {
    trackSpy.mockClear();
    writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(window, 'navigator', {
      value: { clipboard: { writeText } },
      writable: true, configurable: true,
    });
    useStore.__set({ auth: { tier: 'wanderer' } });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders nothing for anonymous users', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    const { container } = render(<AIPromptButton settlement={{ name: 'X' }} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when no settlement', () => {
    const { container } = render(<AIPromptButton settlement={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('copies the assembled prompt sections to clipboard on click', async () => {
    render(<AIPromptButton settlement={{ name: 'Hightower' }} />);
    const btn = screen.getByRole('button', { name: /Copy as AI prompt/ });
    fireEvent.click(btn);
    await new Promise(r => setTimeout(r, 0));
    expect(writeText).toHaveBeenCalledTimes(1);
    const arg = writeText.mock.calls[0][0];
    expect(arg).toContain('Header section about Hightower');
    expect(arg).toContain('Body section about pressure');
  });

  it('fires AI_PROMPT_COPIED analytics after copy', async () => {
    render(<AIPromptButton settlement={{ name: 'Hightower' }} />);
    fireEvent.click(screen.getByRole('button'));
    await new Promise(r => setTimeout(r, 0));
    expect(trackSpy).toHaveBeenCalledWith('ai_prompt_copied', expect.objectContaining({
      settlement_name: 'Hightower',
    }));
  });

  it('shows success affordance after copy', async () => {
    render(<AIPromptButton settlement={{ name: 'Hightower' }} />);
    fireEvent.click(screen.getByRole('button'));
    await new Promise(r => setTimeout(r, 0));
    expect(screen.getByText('Copied to clipboard')).toBeTruthy();
  });
});
