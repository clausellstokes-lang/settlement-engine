/**
 * @vitest-environment jsdom
 *
 * warCausalBrief.mount.test.jsx — ambition-fit-1: the dramatic-irony read-model
 * now has a surface. The component renders the war reasons pressing a pair apart,
 * the peace reasons pulling them together, and the "N of M peace reasons now
 * present; this war is dying" irony line — and self-gates to nothing when the
 * pair carries no present reason (byte-identical dormant UI).
 */

import { describe, test, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import WarCausalBrief from '../../src/components/map/WarCausalBrief.jsx';
import { reasonPairKey } from '../../src/domain/worldPulse/warReasons.js';

afterEach(cleanup);

function worldWith({ war = {}, peace = {} } = {}) {
  const wk = reasonPairKey('a', 'b');
  const mkReasons = (obj) => ({ reasons: Object.fromEntries(Object.entries(obj).map(([t, receipt]) => [t, { score: 0.5, receipt, sinceTick: 5 }])) });
  return {
    tick: 10,
    spatialLedgers: {
      warReasons: Object.keys(war).length ? { [wk]: mkReasons(war) } : {},
      peaceReasons: Object.keys(peace).length ? { [wk]: mkReasons(peace) } : {},
    },
  };
}

describe('WarCausalBrief — mount', () => {
  test('renders present war + peace reasons with their receipts', () => {
    const world = worldWith({
      war: { grievance: 'Old blood between them', encirclement: 'Ringed by rivals' },
      peace: { exhaustion: 'Both realms are spent' },
    });
    const { getByTestId } = render(<WarCausalBrief worldState={world} partyId="a" foeId="b" />);
    const lane = getByTestId('war-causal-brief');
    expect(lane.textContent).toContain('Old blood between them');
    expect(lane.textContent).toContain('Both realms are spent');
    expect(lane.textContent.toLowerCase()).toContain('peace reasons now present');
  });

  test('the irony line reads "this war is dying" once enough peace reasons land (IRONY_DYING_AT = 3)', () => {
    const world = worldWith({
      war: { grievance: 'g' },
      peace: { exhaustion: 'e', mediation: 'm', realignment: 'r' },
    });
    const { getByTestId } = render(<WarCausalBrief worldState={world} partyId="a" foeId="b" />);
    expect(getByTestId('war-causal-brief').textContent).toContain('this war is dying');
  });

  test('compact mode renders ONLY the irony line, and only when a peace reason is present', () => {
    const dying = worldWith({ war: { grievance: 'g' }, peace: { exhaustion: 'e' } });
    const { getByTestId } = render(<WarCausalBrief worldState={dying} partyId="a" foeId="b" compact />);
    expect(getByTestId('war-causal-brief-line').textContent).toContain('peace reasons now present');
  });

  test('self-gates to nothing when the pair carries no present reason (dormant)', () => {
    const { container } = render(<WarCausalBrief worldState={worldWith()} partyId="a" foeId="b" />);
    expect(container.firstChild).toBe(null);
  });

  test('inert on absent worldState / ids', () => {
    expect(render(<WarCausalBrief worldState={null} partyId="a" foeId="b" />).container.firstChild).toBe(null);
    cleanup();
    const world = worldWith({ war: { grievance: 'g' } });
    expect(render(<WarCausalBrief worldState={world} partyId={null} foeId="b" />).container.firstChild).toBe(null);
  });
});
