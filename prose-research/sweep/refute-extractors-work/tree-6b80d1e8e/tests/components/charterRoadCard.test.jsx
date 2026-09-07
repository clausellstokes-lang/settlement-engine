/**
 * @vitest-environment jsdom
 *
 * Directive 3's door. The pins are about what a person at the table can see and
 * do: the picker is a labelled control, the preview speaks in world-words rather
 * than engine numbers, an unreachable pair says so instead of offering a button
 * that would fail, and confirming calls the ONE store verb with the chosen
 * endpoint. The store is mocked; the real derivation runs.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => {
  const useStore = selector => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  return { useStore };
});

const { default: CharterRoadCard } = await import(
  '../../src/components/settlementDetail/CharterRoadCard.jsx'
);

const A = 'save-alpha';
const B = 'save-beta';
const FAR = 'save-far';

const DIGEST = {
  settlementIds: [A, B, FAR],
  distanceMatrix: { [A]: { [B]: 700 }, [B]: { [A]: 700 } },
};

const currentSave = {
  saveData: { id: A },
  settlement: { name: 'Ashford', neighbourNetwork: [], config: {} },
};

const allSaves = [
  { id: A, name: 'Ashford', tier: 'town', settlement: currentSave.settlement },
  { id: B, name: 'Brookmere', tier: 'town', settlement: { name: 'Brookmere', config: {} } },
  { id: FAR, name: 'Farhold', tier: 'village', settlement: { name: 'Farhold', config: {} } },
];

let charter;

beforeEach(() => {
  charter = vi.fn(() => Promise.resolve({ ok: true, status: 'applied' }));
  storeRef.current = {
    charterUserRoute: charter,
    campaigns: [{
      id: 'campaign.vale',
      settlementIds: [A, B, FAR],
      worldState: { tick: 2, spatialCanonVersion: 1, spatialDigest: DIGEST },
    }],
  };
});

afterEach(cleanup);

describe('CharterRoadCard', () => {
  it('offers a labelled endpoint picker naming the other settlements', () => {
    render(<CharterRoadCard currentSave={currentSave} allSaves={allSaves} />);
    const picker = screen.getByLabelText(/where should the road run/i);
    expect(picker.tagName).toBe('SELECT');
    expect(screen.getByRole('option', { name: /Brookmere/ })).toBeTruthy();
    // The settlement never offers a road to itself.
    expect(screen.queryByRole('option', { name: /^Ashford/ })).toBeNull(); // anchored: the Brookmere option is asserted present on the line above, so the picker is populated
  });

  it('previews a reachable road in world-words and never in engine numbers', () => {
    render(<CharterRoadCard currentSave={currentSave} allSaves={allSaves} />);
    fireEvent.change(screen.getByLabelText(/where should the road run/i), {
      target: { value: B },
    });
    const status = screen.getByRole('status');
    expect(status.textContent).toMatch(/steady haul/i);
    // anchored: the prose above is asserted present, so the absence of the digest cost is a real omission
    expect(status.textContent).not.toMatch(/700/);
  });

  it('refuses an unreachable pair in prose rather than offering the button', () => {
    render(<CharterRoadCard currentSave={currentSave} allSaves={allSaves} />);
    fireEvent.change(screen.getByLabelText(/where should the road run/i), {
      target: { value: FAR },
    });
    expect(screen.getByRole('status').textContent).toMatch(/too far/i);
    expect(screen.queryByRole('button', { name: /charter the road/i })).toBeNull();
    expect(charter).not.toHaveBeenCalled(); // anchored: the confirm test below proves this mock fires when a road is legal
  });

  it('confirming calls the one store verb with the chosen endpoint', async () => {
    render(<CharterRoadCard currentSave={currentSave} allSaves={allSaves} />);
    fireEvent.change(screen.getByLabelText(/where should the road run/i), {
      target: { value: B },
    });
    fireEvent.click(screen.getByRole('button', { name: /charter the road to Brookmere/i }));
    await waitFor(() => expect(charter).toHaveBeenCalledWith(B));
    await waitFor(() => {
      expect(screen.getByRole('alert').textContent)
        .toMatch(/road to Brookmere is chartered/i);
    });
  });

  it('reports a refusal from the writer in the same in-world voice', async () => {
    charter.mockResolvedValue({ ok: false, reason: 'route_already_chartered' });
    render(<CharterRoadCard currentSave={currentSave} allSaves={allSaves} />);
    fireEvent.change(screen.getByLabelText(/where should the road run/i), {
      target: { value: B },
    });
    fireEvent.click(screen.getByRole('button', { name: /charter the road to Brookmere/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert').textContent)
        .toMatch(/road already runs between these two/i);
    });
  });

  it('says plainly when the settlement belongs to no realm', () => {
    storeRef.current = { ...storeRef.current, campaigns: [] };
    render(<CharterRoadCard currentSave={currentSave} allSaves={allSaves} />);
    expect(screen.getByText(/Roads run between settlements of one realm/i)).toBeTruthy();
  });
});
