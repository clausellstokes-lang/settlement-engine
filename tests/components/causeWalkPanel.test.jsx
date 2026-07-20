/**
 * @vitest-environment jsdom
 *
 * causeWalkPanel.test.jsx — VISION V-4, the panel renders the backward chain and
 * the graceful root line, and (DOM-level) never leaks a covert hop to a non-DM.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';

const storeState = { isElevated: () => true };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

import CauseWalkPanel from '../../src/components/map/CauseWalkPanel.jsx';

afterEach(() => cleanup());

const outcomes = [
  { id: 'A', applyMode: 'proposal', proposalPayload: { kind: 'realm_verb_order' }, targetSaveId: 'sA', headline: 'Your decree', severity: 0.6 },
  { id: 'B', type: 'condition', targetSaveId: 'sB', headline: 'B happened', severity: 0.5 },
  { id: 'C', type: 'condition', targetSaveId: 'sC', headline: 'C happened', severity: 0.4 },
];
const provenance = { B: { parents: ['A'], type: 'condition', tick: 300 }, C: { parents: ['B'], type: 'condition', tick: 300 } };
const worldState = { pulseHistory: [{ tick: 300, selectedOutcomes: outcomes, impactDigest: [] }], spatialLedgers: { provenance } };

describe('CauseWalkPanel', () => {
  it('renders the backward chain of receipts', () => {
    render(<CauseWalkPanel worldState={worldState} rootId="C" seesSecrets />);
    const hops = screen.getAllByTestId('cause-walk-hop');
    expect(hops.length).toBe(2);
    expect(screen.getByText('B happened')).toBeTruthy();
    expect(screen.getByText('Your decree')).toBeTruthy();
  });

  it('shows the graceful line at a root cause', () => {
    render(<CauseWalkPanel worldState={worldState} rootId="A" seesSecrets />);
    expect(screen.getByText(/no deeper memory/i)).toBeTruthy();
  });

  it('does not leak a covert hop to a non-DM viewer', () => {
    const covert = [outcomes[0], { ...outcomes[1], metadata: { covert: true } }, outcomes[2]];
    const ws = { pulseHistory: [{ tick: 300, selectedOutcomes: covert, impactDigest: [] }], spatialLedgers: { provenance } };
    const { container } = render(<CauseWalkPanel worldState={ws} rootId="C" seesSecrets={false} />);
    expect(container.textContent || '').not.toContain('B happened');
    expect(container.querySelector('[data-redacted="true"]')).toBeTruthy();
  });
});
