/** @vitest-environment jsdom */
/**
 * STYLE-2 SW-12 (ledger D·87, 2026-11-09): the comparisons' footnote states what the
 * code does (an empty picture is left out) instead of an aphorism.
 */
import { afterEach, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import RealmComparisons from '../../src/components/map/RealmComparisons.jsx';

afterEach(cleanup);

describe('RealmComparisons — the footnote in the reader\'s words', () => {
  test('says an empty picture is left out, and the empty exhaustion picture is', () => {
    const rows = [{ id: 'a', tier: 'village', war: 'at peace', prosperity: 'Comfortable' }];
    const { container } = render(<RealmComparisons rows={rows} worldState={{}} />);
    expect(container.textContent).toContain('Each picture answers one question from the register\'s rows. A picture with nothing to show is left out.');
    expect(container.textContent).not.toContain('How worn the realm is'); // anchored: the same live container carries the footnote asserted above
  });
});
