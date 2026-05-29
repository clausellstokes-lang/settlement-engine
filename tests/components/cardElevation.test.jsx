/** @vitest-environment jsdom */
/**
 * cardElevation.test.jsx — P141 / V-4 contract over the Card primitive's
 * elevation adoption.
 *
 * Pins:
 *   • With elevationTokens on, the shared Card carries the ELEV[1] shadow.
 *   • With it off, the Card stays flat (pure additive — no shadow).
 *
 * The flag is mocked; the real theme shim supplies ELEV so the test also
 * checks the value actually flows through.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';

const flagMock = vi.fn(() => true);
vi.mock('../../src/lib/flags.js', () => ({ flag: (...a) => flagMock(...a) }));

import Card from '../../src/components/primitives/Card.jsx';
import { ELEV } from '../../src/components/theme.js';

const sectionOf = (container) => container.querySelector('section');

describe('Card elevation', () => {
  beforeEach(() => flagMock.mockReturnValue(true));
  afterEach(() => cleanup());

  it('applies ELEV[1] when elevationTokens is on', () => {
    const { container } = render(<Card>body</Card>);
    expect(sectionOf(container).style.boxShadow).toBe(ELEV[1]);
  });

  it('stays flat when elevationTokens is off', () => {
    flagMock.mockReturnValue(false);
    const { container } = render(<Card>body</Card>);
    expect(sectionOf(container).style.boxShadow).toBe('');
  });
});
