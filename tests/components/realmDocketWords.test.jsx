/** @vitest-environment jsdom */
/**
 * STYLE-2 SW-12 (ledger D·85, 2026-11-09): the docket's footnote says when an entry can
 * still be cancelled in the realm's words — "the next advance", never "the tick".
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector({ cancelQueuedEvent: () => {}, savedSettlements: [], canUseCustomContent: () => false }),
}));
vi.mock('../../src/components/map/RealmForecast.jsx', () => ({ default: () => null }));

import RealmDocket from '../../src/components/map/RealmDocket.jsx';

afterEach(cleanup);

describe('RealmDocket — the footnote in the reader\'s words', () => {
  test('an entry can be cancelled until the next advance carries it out', () => {
    const { container } = render(<RealmDocket campaign={{ id: 'c1', settlementIds: [], worldState: { canonizedAt: '2026-01-01T00:00:00.000Z', tick: 3 } }} />);
    expect(container.textContent).toMatch(/can be cancelled until the next advance\s+carries it out\. Realm orders wait separately, as proposals above\./);
    // anchored: the same live container matched the new footnote on the line above
    expect(container.textContent).not.toMatch(/the tick consumes it|queue separately as pending proposals/);
  });
});
