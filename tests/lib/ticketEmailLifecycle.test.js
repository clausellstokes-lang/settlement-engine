/**
 * tests/lib/ticketEmailLifecycle.test.js — Phase A5 email-lifecycle contract.
 *
 * The ticket lifecycle emails are sent SERVER-SIDE from the edge functions
 * (account-actions create_ticket → sendEmail; admin-actions set_ticket_status /
 * post_ticket_reply → notifyTargetEmail). Those are Deno functions (run under
 * the deno-tests job, not vitest), so — following the same convention as
 * emailTemplates.test.js's edge-parity test — we assert the notify WIRING is
 * present for each lifecycle event by reading the edge sources as plain text.
 *
 * This proves the lifecycle events fire the notify path (the path is invoked on
 * create / assigned / waiting_on_user / resolution / closed / reopened / reply),
 * and that the notify path SOFT-FAILS (never throws) so a Resend outage can't
 * break a ticket action.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const accountSrc = readFileSync(
  resolve(process.cwd(), 'supabase/functions/account-actions/index.ts'), 'utf-8',
);
const adminSrc = readFileSync(
  resolve(process.cwd(), 'supabase/functions/admin-actions/index.ts'), 'utf-8',
);

describe('A5 — ticket email lifecycle wiring (account-actions)', () => {
  it('create_ticket fires a confirmation email (sendEmail) to the caller', () => {
    // The create_ticket arm exists and calls the soft-fail sendEmail helper.
    expect(accountSrc).toMatch(/case "create_ticket"/);
    expect(accountSrc).toMatch(/const notified = await sendEmail\(/);
  });

  it('the sendEmail helper SOFT-FAILS when Resend is unconfigured (no throw)', () => {
    expect(accountSrc).toMatch(/async function sendEmail/);
    // Unconfigured → returns false, not an exception.
    expect(accountSrc).toMatch(/if \(!apiKey \|\| !fromEmail[\s\S]*?\) return false/);
    // Wrapped in try/catch returning false.
    expect(accountSrc).toMatch(/catch \(e\) \{[\s\S]*?return false;/);
  });
});

describe('A5 — ticket email lifecycle wiring (admin-actions)', () => {
  it('set_ticket_status notifies the owner on the lifecycle transitions', () => {
    expect(adminSrc).toMatch(/case "set_ticket_status"/);
    // The notify-states map covers assignment / waiting / resolution / closed /
    // reopened — the events the spec requires a notification for.
    for (const state of ['assigned', 'waiting_on_user', 'resolved', 'closed', 'reopened']) {
      expect(adminSrc).toMatch(new RegExp(`${state}:`));
    }
    expect(adminSrc).toMatch(/notified = await notifyTargetEmail\(/);
  });

  it('post_ticket_reply notifies the owner on a user-visible reply', () => {
    expect(adminSrc).toMatch(/case "post_ticket_reply"/);
    // On a user-visible reply (not an internal note) the owner is notified.
    expect(adminSrc).toMatch(/if \(vis === "user"\)/);
    expect(adminSrc).toMatch(/notifyTargetEmail\(/);
  });

  it('notifyTargetEmail resolves the target email server-side and soft-fails', () => {
    // Reused A4 helper: service-role-resolved address, soft-fail on unconfigured.
    expect(adminSrc).toMatch(/const notifyTargetEmail = async/);
    expect(adminSrc).toMatch(/if \(!apiKey \|\| !fromEmail\) return false/);
  });
});
