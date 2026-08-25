/**
 * AccountSupportSection.jsx — Customer Support section for the Account page.
 *
 * FAQ-FIRST (self-resolve), then the ticket workflow.
 *   1. The FAQ accordion is shown FIRST so users can self-resolve before
 *      opening a ticket.
 *   2. AccountTickets renders "My tickets" + "Create ticket" + the per-ticket
 *      thread (user-visible events only) + a reply box — all through the
 *      account-actions edge function (own-data, RLS/RPC-scoped).
 *
 * A direct email fallback (OUR ratified SUPPORT_EMAIL) remains. This replaces
 * the previous fire-and-forget contact form, which wrote a single
 * `support_messages` row with no thread / status / reply.
 */
import { GOLD_TXT, MUTED, SECOND, sans, SP, FS } from '../theme.js';
import { SUPPORT_EMAIL, supportMailto } from '../../copy/support.js';
import Section from './AccountSection.jsx';
import AccountFAQ from './AccountFAQ.jsx';
import AccountTickets from './AccountTickets.jsx';

export default function AccountSupportSection({ auth: _auth } = {}) {
  return (
    <Section title="Customer Support">
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.lg }}>
        {/* FAQ FIRST — self-resolve before opening a ticket. */}
        <div>
          <div style={{ fontSize: FS.xs, fontWeight: 700, color: MUTED, fontFamily: sans, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.sm }}>
            Frequently asked questions
          </div>
          <div style={{ fontSize: FS.sm, color: SECOND, lineHeight: 1.5, marginBottom: SP.md }}>
            Most questions are answered below. If none of these solve it, open a ticket
            and we will follow up here and by email. You can also email us directly at{' '}
            <a href={supportMailto()} style={{ color: GOLD_TXT, fontWeight: 600 }}>
              {SUPPORT_EMAIL}
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
