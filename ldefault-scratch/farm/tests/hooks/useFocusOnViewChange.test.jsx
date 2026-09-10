// @vitest-environment jsdom
import React, { useRef } from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, test, expect } from 'vitest';

import { useFocusOnViewChange } from '../../src/hooks/useFocusOnViewChange.js';

/**
 * Behavioral proof of the view-change focus contract (the R7 item the audit found
 * claimed-but-unimplemented). App uses THIS hook, so this tests the real code path:
 * focus lands on the <main> region when the view changes, but not on initial mount
 * and not on a same-view re-render.
 */
afterEach(cleanup);

function Harness({ view }) {
  const ref = useRef(null);
  useFocusOnViewChange(view, ref);
  return <main ref={ref} tabIndex={-1} data-testid="main">content</main>;
}

describe('useFocusOnViewChange', () => {
  test('does NOT steal focus on initial mount', () => {
    const { getByTestId } = render(<Harness view="home" />);
    expect(document.activeElement).not.toBe(getByTestId('main'));
  });

  test('moves focus to the ref when the view key CHANGES', () => {
    const { getByTestId, rerender } = render(<Harness view="home" />);
    rerender(<Harness view="settlements" />);
    expect(document.activeElement).toBe(getByTestId('main'));
  });

  test('does not re-focus when the view key is unchanged', () => {
    const { getByTestId, rerender } = render(<Harness view="home" />);
    getByTestId('main').blur();
    rerender(<Harness view="home" />);
    expect(document.activeElement).not.toBe(getByTestId('main'));
  });
});
