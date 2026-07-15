/**
 * AccountFAQ.jsx — inline FAQ in the AccountPage.
 *
 * Account-page surfaces were credit-counters
 * and Stripe portal links with no "what do I do if I run out of
 * credits" / "can I cancel my subscription" guidance inline. Users
 * ended up in support emails for things the answer to which was one
 * paragraph away.
 *
 * Six short Q-and-A's, accordion-style. The questions are common-Q's
 * (credit grant, cancel anytime, refund window, founder lifetime,
 * gallery privacy, AI vs simulator framing). All copy lives in
 * `t('accountFaq.qs')` so the copy team can edit without a code change.
 *
 * No analytics — this is a passive read surface; we don't track
 * per-question opens.
 */

// Use shared theme tokens (no private palette that can silently diverge):
// BODY/MUTED/sans are the canonical parchment-theme values; SP spaces the stack.
import { BODY, MUTED, sans, FS, SP } from '../theme.js';
import { t } from '../../copy/index.js';
import Disclosure from '../primitives/Disclosure.jsx';
import Button from '../primitives/Button.jsx';

// Question keys — t() will resolve `${key}.q` and `${key}.a` from the
// copy module. Keeping the keys here so the iteration order is
// deterministic.
const Q_KEYS = [
  'creditGrant',
  'cancelAnytime',
  'refundWindow',
  'founderLifetime',
  'galleryPrivacy',
  'aiOrSim',
];

// `linkAccount` gates the closing self-help line's destination. On the public
// About > FAQ tab the reader is off the Account page, so "your Account page"
// renders as a ghost Button that routes there via onNavigate('account'). On the
// Account page itself (the default), that link would point at the page the
// reader is already on — a decoy — so the phrase stays plain text.
export default function AccountFAQ({ linkAccount = false, onNavigate } = {}) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: SP.sm,
    }}>
      {Q_KEYS.map((key) => {
        const question = t(`accountFaq.${key}.q`);
        const answer   = t(`accountFaq.${key}.a`);
        if (!question || !answer) return null;
        // Route each Q through the canonical Disclosure primitive: it owns its
        // own per-item open state (independent toggles), a real native button
        // with aria-expanded/aria-controls, and the shared caret/header styling.
        return (
          <Disclosure key={key} title={question} compact>
            <div style={{
              fontSize: FS.sm, color: BODY,
              lineHeight: 1.55, fontFamily: sans,
            }}>
              {answer}
            </div>
          </Disclosure>
        );
      })}
      <div style={{
        marginTop: 4, fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
        fontFamily: sans,
      }}>
        {linkAccount
          // Off the Account page (public About > FAQ): make the destination a
          // real control so the first click lands instead of dead-ending in
          // text. Ghost keeps it a low-stakes inline link, not a second CTA.
          ? <>Still stuck? Reach Customer Support from{' '}
              <Button variant="ghost" size="sm" onClick={() => onNavigate?.('account')}>
                your Account page
              </Button>.
            </>
          : 'Still stuck? Reach Customer Support from your Account page.'}
      </div>
    </div>
  );
}
