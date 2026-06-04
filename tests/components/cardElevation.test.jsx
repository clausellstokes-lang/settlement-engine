/** @vitest-environment jsdom */
/**
 * cardElevation.test.jsx - P141 / V-4 contract over the Card primitive's
 * elevation adoption.
 *
 * Pins:
 *   • The shared Card carries the ELEV[1] shadow.
 *
 * The real theme shim supplies ELEV so the test also checks the value
 * actually flows through.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import Card from '../../src/components/primitives/Card.jsx';
import { ELEV } from '../../src/components/theme.js';

const sectionOf = (container) => container.querySelector('section');

describe('Card elevation', () => {
  afterEach(() => cleanup());

  it('applies the ELEV[1] shadow', () => {
    const { container } = render(<Card>body</Card>);
    expect(sectionOf(container).style.boxShadow).toBe(ELEV[1]);
  });
});
