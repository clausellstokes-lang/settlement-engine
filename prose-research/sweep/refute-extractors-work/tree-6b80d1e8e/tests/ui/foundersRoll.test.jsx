/**
 * @vitest-environment jsdom
 *
 * foundersRoll.test.jsx — the founders-credits client surfaces (170):
 *   • FoundersRoll (About page) is DORMANT-SAFE — renders nothing when the RPC is
 *     undeployed or no founder has opted in, and renders the names otherwise.
 *   • FounderCreditToggle shows ONLY to founders, reflects the current flag, and
 *     hides itself (no red spew) when the column/RPC is undeployed.
 */
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

const rpc = vi.fn();
const getUser = vi.fn();
const maybeSingle = vi.fn();

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: {
    rpc: (...a) => rpc(...a),
    auth: { getUser: () => getUser() },
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: () => maybeSingle() }) }) }),
  },
}));

let isFounderVal = true;
vi.mock('../../src/store/index.js', () => ({
  useStore: (sel) => sel({ isFounder: () => isFounderVal }),
}));

afterEach(cleanup);

async function importRoll() { return (await import('../../src/components/howto/FoundersRoll.jsx')).default; }
async function importToggle() { return (await import('../../src/components/account/FounderCreditToggle.jsx')).default; }

describe('FoundersRoll — dormant-safe public credits', () => {
  beforeEach(() => { rpc.mockReset(); });

  test('renders NOTHING when the RPC is undeployed (error)', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'function public.founders_roll() does not exist' } });
    const Roll = await importRoll();
    const { container } = render(<Roll />);
    await waitFor(() => expect(rpc).toHaveBeenCalledWith('founders_roll'));
    expect(container.textContent).toBe('');
  });

  test('renders NOTHING when there are zero consenting founders', async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    const Roll = await importRoll();
    const { container } = render(<Roll />);
    await waitFor(() => expect(rpc).toHaveBeenCalled());
    expect(container.textContent).toBe('');
  });

  test('renders the founders when names are returned', async () => {
    rpc.mockResolvedValue({ data: [{ name: 'Aria the Cartographer' }, { name: 'Bram Ironquill' }], error: null });
    const Roll = await importRoll();
    render(<Roll />);
    await screen.findByText('Aria the Cartographer');
    expect(screen.getByText('Bram Ironquill')).toBeTruthy();
    expect(screen.getByRole('heading', { name: /the founders/i })).toBeTruthy();
  });
});

describe('FounderCreditToggle — founder-only, dormant-safe', () => {
  beforeEach(() => {
    rpc.mockReset(); getUser.mockReset(); maybeSingle.mockReset();
    isFounderVal = true;
    getUser.mockResolvedValue({ data: { user: { id: 'u1' } } });
  });

  test('renders NOTHING for a non-founder', async () => {
    isFounderVal = false;
    const Toggle = await importToggle();
    const { container } = render(<Toggle />);
    // no fetch, no toggle
    expect(container.textContent).toBe('');
    expect(screen.queryByRole('checkbox')).toBeNull();
  });

  test('a founder sees the toggle reflecting the current flag; toggling calls the RPC', async () => {
    maybeSingle.mockResolvedValue({ data: { founder_credit_listed: false }, error: null });
    rpc.mockResolvedValue({ error: null });
    const Toggle = await importToggle();
    render(<Toggle />);
    const box = await screen.findByRole('checkbox');
    expect(box.checked).toBe(false);
    fireEvent.click(box);
    await waitFor(() => expect(rpc).toHaveBeenCalledWith('set_founder_credit_listed', { p_listed: true }));
    await waitFor(() => expect(screen.getByRole('checkbox').checked).toBe(true));
  });

  test('hides itself when the column is undeployed (feature-detect on error)', async () => {
    maybeSingle.mockResolvedValue({ data: null, error: { message: 'column "founder_credit_listed" does not exist' } });
    const Toggle = await importToggle();
    const { container } = render(<Toggle />);
    await waitFor(() => expect(maybeSingle).toHaveBeenCalled());
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(container.textContent).toBe('');
  });
});
