/** @vitest-environment jsdom */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('../../src/domain/display/causeWalk.js', () => ({
  buildCauseWalk: () => ({
    root: { headline: 'The granaries failed' },
    chain: [{
      id: 'cause-1',
      depth: 1,
      headline: 'The southern road was cut',
      tick: 52,
      settlementIds: [],
      redacted: false,
    }],
    graceLine: 'The ledger holds no deeper memory of this.',
  }),
}));

vi.mock('../../src/domain/display/discourseKernel.js', () => ({
  discourseProseActive: () => false,
  realizeCauseWalk: () => null,
}));

import CauseWalkPanel from '../../src/components/map/CauseWalkPanel.jsx';

afterEach(cleanup);

describe('CauseWalkPanel — calendar translation', () => {
  test('renders each recorded hop in calendar language rather than engine ticks', () => {
    render(<CauseWalkPanel worldState={{}} rootId="root-1" />);

    expect(screen.getByText(/the spring of year 2/i)).toBeTruthy();
    expect(screen.getByTestId('cause-walk').textContent).not.toMatch(/\btick\s+52\b/i);
  });
});
