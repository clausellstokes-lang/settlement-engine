/** @vitest-environment node */
/**
 * retentionWarningEmail.test.js — the retention-warning email ramp helper.
 *
 * Pins that notifyRetentionWarning routes through the send-email seam with the
 * retention_warning template + a coarse payload (downgrade-transition audit 2.2).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn(async () => ({ data: { ok: true }, error: null })) }));
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { functions: { invoke } },
  isConfigured: true,
}));

import { notifyRetentionWarning } from '../../src/lib/emailLifecycle.js';

beforeEach(() => invoke.mockClear());

describe('notifyRetentionWarning', () => {
  it('invokes send-email with the retention_warning template + payload', async () => {
    await notifyRetentionWarning({ displayName: 'Stoke', retentionUntil: 'Jan 1, 2027' });
    expect(invoke).toHaveBeenCalledWith('send-email', {
      body: {
        template: 'retention_warning',
        payload: { displayName: 'Stoke', retentionUntil: 'Jan 1, 2027' },
        recipient: null,
      },
    });
  });

  it('defaults displayName + retentionUntil when omitted (never leaves a raw {placeholder})', async () => {
    await notifyRetentionWarning();
    expect(invoke).toHaveBeenCalledWith('send-email', {
      body: {
        template: 'retention_warning',
        payload: { displayName: 'there', retentionUntil: 'soon' },
        recipient: null,
      },
    });
  });
});
