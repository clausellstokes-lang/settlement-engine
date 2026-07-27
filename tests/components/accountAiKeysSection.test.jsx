/**
 * @vitest-environment jsdom
 *
 * accountAiKeysSection.test.jsx — the BYOK MANAGEMENT SURFACE presentation contract (#29).
 * The transport (../../src/lib/surveyorByok.js) is mocked so no network is touched; this
 * pins the flow: save→verify surfaces key-health + the model picker (never healthy until a
 * real verify), retention class shows per model, caps + pause persist, and the honest
 * boundary is stated in-UI. Wave L-3b adds the COMPETENCY PROBE half: the measured tier
 * reads as a chip plus one plain sentence, "never probed" stays distinct from the lowest
 * tier, an unverified key cannot be probed, and a refusal records nothing.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

// The BYOK surface is Surveyor-gated via the lazy useAccountSurveyorGate hook;
// default it to entitled so the presentation tests render, reset after each.
const entitledRef = vi.hoisted(() => ({ current: true }));
vi.mock('../../src/components/account/useAccountSurveyorGate.js', () => ({
  useAccountSurveyorGate: () => entitledRef.current,
}));

afterEach(() => { cleanup(); vi.clearAllMocks(); entitledRef.current = true; });

const api = vi.hoisted(() => ({
  status: [],
  settings: { model_prefs: {}, daily_token_cap: null, weekly_token_cap: null, daily_usd_cap: null, weekly_usd_cap: null, warn_pct: 80, paused: false },
  verifyResult: null,
  setByokKey: null, verifyByokKey: null, setSurveyorSettings: null, clearByokKey: null,
  probeByokKey: null,
}));

// The tier vocabulary + its two pure readings are NOT mocked away: the sentence a user
// reads is part of this surface's contract, and a stubbed sentence would pin nothing.
// Only the transports are faked.
vi.mock('../../src/lib/surveyorByok.js', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    keyPrefixHint: (p, k) => (k && !String(k).startsWith('sk-ant-') ? 'looks off' : null),
    getByokStatus: vi.fn(async () => api.status),
    setByokKey: (...a) => api.setByokKey(...a),
    clearByokKey: (...a) => api.clearByokKey(...a),
    verifyByokKey: (...a) => api.verifyByokKey(...a),
    probeByokKey: (...a) => api.probeByokKey(...a),
    getSurveyorSettings: vi.fn(async () => api.settings),
    setSurveyorSettings: (...a) => api.setSurveyorSettings(...a),
  };
});

import AccountAiKeysSection from '../../src/components/account/AccountAiKeysSection.jsx';

describe('AccountAiKeysSection — BYOK management surface (#29)', () => {
  it('renders NOTHING for a non-entitled account (Surveyor gate, discriminator)', () => {
    entitledRef.current = false; // e.g. Cartographer premium — no surveyor entitlement
    const { container } = render(<AccountAiKeysSection />);
    expect(container.innerHTML).toBe('');
  });

  it('save→verify surfaces key-health + a per-model picker with retention class', async () => {
    api.status = []; // no key yet
    // saving creates the vault row (has_key), mirroring surveyor_byok_set
    api.setByokKey = vi.fn(async () => {
      api.status = [{ provider: 'anthropic', has_key: true, health: 'unverified', last_verified_at: null, last_checked_at: null, last_error_class: null }];
      return true;
    });
    api.verifyByokKey = vi.fn(async () => ({
      ok: true, health: 'healthy', verifiedAt: new Date().toISOString(),
      models: [{ id: 'claude-opus-4-8', retentionClass: 'bounded' }],
    }));

    render(<AccountAiKeysSection />);

    // paste a key and Save & verify
    const input = await screen.findByPlaceholderText('sk-ant-…');
    fireEvent.change(input, { target: { value: 'sk-ant-test' } });
    fireEvent.click(screen.getByRole('button', { name: /save & verify/i }));

    await waitFor(() => expect(api.setByokKey).toHaveBeenCalledWith('anthropic', 'sk-ant-test'));
    expect(api.verifyByokKey).toHaveBeenCalled();

    // healthy chip + the model picker with the retention class shown
    await waitFor(() => screen.getByText(/Healthy/));
    expect(screen.getByText(/Model per task/)).toBeTruthy();
    // both task selects carry the model option with its retention class shown
    expect(screen.getAllByText(/retention: bounded/).length).toBeGreaterThan(0);
  });

  it('a paste that does not look like an Anthropic key shows a prefix HINT (not a block)', async () => {
    api.status = [];
    render(<AccountAiKeysSection />);
    const input = await screen.findByPlaceholderText('sk-ant-…');
    fireEvent.change(input, { target: { value: 'oops' } });
    expect(screen.getByText(/looks off/)).toBeTruthy();
    // still enabled — the hint never blocks saving
    expect(screen.getByRole('button', { name: /save & verify/i }).disabled).toBe(false);
  });

  it('a persisted invalid key shows the invalid status + last-verified stamp', async () => {
    api.status = [{ provider: 'anthropic', has_key: true, health: 'invalid', last_verified_at: null, last_checked_at: new Date().toISOString(), last_error_class: 'invalid' }];
    render(<AccountAiKeysSection />);
    await waitFor(() => screen.getByText(/Invalid or expired/));
    expect(screen.getByText(/Last verified:/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Verify$/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /^Remove$/i })).toBeTruthy();
  });

  it('saving caps + toggling pause persist through setSurveyorSettings', async () => {
    api.status = [];
    api.setSurveyorSettings = vi.fn(async (patch) => ({ ...api.settings, ...patch }));
    render(<AccountAiKeysSection />);

    // set a daily token cap and save (first of the four "uncapped" fields = daily tokens)
    const dailyTok = (await screen.findAllByPlaceholderText('uncapped'))[0];
    fireEvent.change(dailyTok, { target: { value: '5000' } });
    fireEvent.click(screen.getByRole('button', { name: /save caps/i }));
    await waitFor(() => expect(api.setSurveyorSettings).toHaveBeenCalled());
    expect(api.setSurveyorSettings.mock.calls[0][0]).toMatchObject({ daily_token_cap: 5000 });

    // toggle pause
    fireEvent.click(screen.getByRole('checkbox'));
    await waitFor(() => expect(api.setSurveyorSettings).toHaveBeenCalledTimes(2));
    expect(api.setSurveyorSettings.mock.calls[1][0]).toMatchObject({ paused: true });
  });

  it('states the caps enforcement + no-charge boundary in-UI', async () => {
    api.status = [];
    render(<AccountAiKeysSection />);
    await waitFor(() => screen.getByText(/enforced at the edge/i));
    expect(screen.getByText(/nothing is charged/i)).toBeTruthy();
  });

  // ── THE COMPETENCY PROBE (wave L-3b) ──────────────────────────────────────
  // What this surface owes the reader: the measured tier as a PLAIN SENTENCE, the
  // honest difference between "never probed" and the lowest tier, and no arithmetic.

  const healthyRow = (extra = {}) => ([{
    provider: 'anthropic', has_key: true, health: 'healthy',
    last_verified_at: new Date().toISOString(), last_checked_at: new Date().toISOString(),
    last_error_class: null, probe_tier: null, probe_checked_at: null, probe_model: null,
    ...extra,
  }]);

  it('an unprobed healthy key invites the check and says so without scoring anything', async () => {
    api.status = healthyRow();
    render(<AccountAiKeysSection />);
    await waitFor(() => screen.getByText(/Model capability/));
    const button = screen.getByRole('button', { name: /run capability probe/i });
    expect(button.disabled).toBe(false);
    expect(screen.getByText(/has not run a capability check yet/i)).toBeTruthy();
    // the honest boundary: no credits, but the provider does charge
    expect(screen.getByText(/costs no credits/i)).toBeTruthy();
  });

  it('a probe run persists a tier, which reads as a chip plus one plain sentence', async () => {
    api.status = healthyRow();
    api.probeByokKey = vi.fn(async () => {
      api.status = healthyRow({
        probe_tier: 'journeyman', probe_checked_at: new Date().toISOString(), probe_model: 'claude-haiku-4-5',
      });
      return { ok: true, tier: 'journeyman', passes: 2, model: 'claude-haiku-4-5', tasks: [] };
    });
    render(<AccountAiKeysSection />);
    fireEvent.click(await screen.findByRole('button', { name: /run capability probe/i }));

    await waitFor(() => expect(api.probeByokKey).toHaveBeenCalledWith('anthropic'));
    await waitFor(() => screen.getByText('Journeyman'));
    expect(screen.getByText(/filed two of the three sample requests correctly/i)).toBeTruthy();
    expect(screen.getByText(/using claude-haiku-4-5/)).toBeTruthy();
    // and the button becomes a re-run rather than an invitation
    expect(screen.getByRole('button', { name: /check again/i })).toBeTruthy();
  });

  it('an unverified key cannot be probed, and the surface says which step comes first', async () => {
    api.status = [{ provider: 'anthropic', has_key: true, health: 'unverified', last_verified_at: null, last_checked_at: null, last_error_class: null }];
    render(<AccountAiKeysSection />);
    await waitFor(() => screen.getByText(/Model capability/));
    expect(screen.getByRole('button', { name: /run capability probe/i }).disabled).toBe(true);
    expect(screen.getByText(/Verify this key first/i)).toBeTruthy();
  });

  it('a refused probe states the boundary and records no tier', async () => {
    api.status = healthyRow();
    api.probeByokKey = vi.fn(async () => ({
      ok: false, tier: null, refusalClass: 'out_of_credit',
      message: 'Your provider key is out of credit, so nothing was charged.',
    }));
    render(<AccountAiKeysSection />);
    fireEvent.click(await screen.findByRole('button', { name: /run capability probe/i }));
    await waitFor(() => screen.getByText(/out of credit, so nothing was charged/i));
    expect(screen.queryByText('Journeyman')).toBeNull();
    expect(screen.queryByText('Scout')).toBeNull();
  });
});
