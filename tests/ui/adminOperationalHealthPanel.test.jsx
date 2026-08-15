/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const invoke = vi.hoisted(() => vi.fn());

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { functions: { invoke } },
}));

import AdminOperationalHealthPanel from '../../src/components/admin/AdminOperationalHealthPanel.jsx';

function healthResponse(attention = []) {
  return {
    data: {
      health: {
        schemaVersion: 1,
        severity: attention.length ? 'critical' : 'healthy',
        healthy: attention.length === 0,
        accountDeletion: { open: 0, due: 0 },
        paymentRefund: {
          open: attention.length,
          requiresAction: attention.length,
        },
        stripeWebhook: { processing: 0, staleLeases: 0 },
      },
      attention,
      refreshedAt: '2026-07-24T12:00:00.000Z',
    },
    error: null,
  };
}

describe('AdminOperationalHealthPanel', () => {
  beforeEach(() => {
    invoke.mockReset();
  });

  afterEach(() => cleanup());

  it('renders factual queue health and keeps acknowledgement separate from resolution', async () => {
    const item = {
      source: 'payment_refund',
      obligation_key: 'pi_attention',
      status: 'requires_action',
      attempts: 3,
      age_seconds: 7200,
      reason: 'requires_action',
      acknowledged_at: null,
      acknowledgement_note: null,
    };
    invoke.mockImplementation((_slug, { body }) => {
      if (body.action === 'get_operational_health') {
        return Promise.resolve(healthResponse([item]));
      }
      if (body.action === 'acknowledge_operational_obligation') {
        return Promise.resolve({
          data: { success: true, acknowledged: true },
          error: null,
        });
      }
      throw new Error(`unexpected action ${body.action}`);
    });

    render(<AdminOperationalHealthPanel />);

    expect(await screen.findByText('critical')).toBeTruthy();
    expect(screen.getAllByText('Payment refund').length).toBeGreaterThan(0);
    expect(screen.getAllByText('requires action').length).toBeGreaterThan(0);
    expect(screen.getByText('2h')).toBeTruthy();

    fireEvent.change(
      screen.getByLabelText('Operator note for Payment refund'),
      { target: { value: 'Stripe support case opened' } },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Acknowledge' }));

    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('admin-actions', {
        body: {
          action: 'acknowledge_operational_obligation',
          obligationSource: 'payment_refund',
          obligationKey: 'pi_attention',
          note: 'Stripe support case opened',
          clear: false,
        },
      });
    });
    // The panel reloads authoritative health; it never removes the row
    // optimistically or labels the acknowledgement "resolved."
    expect(screen.queryByText('Resolved')).toBeNull();
  });

  it('shows an honest empty state only after a healthy response', async () => {
    invoke.mockResolvedValue(healthResponse([]));
    render(<AdminOperationalHealthPanel />);

    expect(await screen.findByText('healthy')).toBeTruthy();
    expect(screen.getByText(
      'No obligation currently needs operator attention.',
    )).toBeTruthy();
  });

  it('surfaces a failed operator read without inventing a healthy state', async () => {
    invoke.mockResolvedValue({
      data: null,
      error: new Error('network down'),
    });
    render(<AdminOperationalHealthPanel />);

    expect((await screen.findByRole('alert')).textContent).toContain('network down');
    expect(screen.queryByText('healthy')).toBeNull();
  });
});
