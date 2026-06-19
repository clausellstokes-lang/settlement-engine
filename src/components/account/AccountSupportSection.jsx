/**
 * AccountSupportSection.jsx — Customer Support section for the Account page.
 *
 * Phase A5: FAQ-FIRST (self-resolve), then the ticket workflow.
 *   1. The FAQ accordion is shown FIRST so users can self-resolve before
 *      opening a ticket.
 *   2. AccountTickets renders "My tickets" + "Create ticket" + the per-ticket
 *      thread (user-visible events only) + a reply box — all through the
 *      account-actions edge function (own-data, RLS/RPC-scoped).
 *
 * The legacy presentational contact-form props (supportSubject/…) are still
 * accepted for back-compat with AccountPage but are no longer the primary path;
 * ticket creation goes through AccountTickets. A direct email fallback remains.
 */
import { Headphones } from 'lucide-react';
import { GOLD, SECOND, sans, SP, FS } from '../theme.js';
import Section from './AccountSection.jsx';
import AccountFAQ from './AccountFAQ.jsx';
import AccountTickets from './AccountTickets.jsx';

export default function AccountSupportSection({ auth: _auth } = {}) {
  return (
    <Section title="Customer Support" icon={Headphones}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
        {/* FAQ FIRST — self-resolve before opening a ticket. */}
        <div>
          <div style={{ fontSize: FS.md, fontWeight: 700, color: SECOND, fontFamily: sans, marginBottom: SP.sm }}>
            Frequently asked questions
          </div>
          <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5, marginBottom: SP.md }}>
            Most questions are answered below. If none of these solve it, open a ticket
            and we&apos;ll follow up here and by email. You can also email us directly at{' '}
            <a href="mailto:clausellstokes@aol.com" style={{ color: GOLD, fontWeight: 600 }}>
              clausellstokes@aol.com
            </a>.
          </div>
          <AccountFAQ />
        </div>

        {/* Tickets — list / create / thread. */}
        <AccountTickets />
      </div>
    </Section>
  );
}
