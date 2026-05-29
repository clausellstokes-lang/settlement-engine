/**
 * AccountFAQ.jsx — P138 / AC-4 inline FAQ in the AccountPage.
 *
 * The critique flagged that account-page surfaces were credit-counters
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
 * Self-gated on flag('accountFaq'). No analytics — this is a passive
 * read surface; we don't track per-question opens.
 */

import { useState } from 'react';
import { FS, swatch } from '../theme.js';
import { Plus, Minus } from 'lucide-react';
import { flag } from '../../lib/flags.js';
import { t } from '../../copy/index.js';

const GOLD = '#8C6F32';
const INK = '#1B1408';
const BODY = '#3A2F18';
const MUTED = '#9C8068';
const BORDER = '#E8D9B0';
const sans = '"Nunito", system-ui, sans-serif';

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

export default function AccountFAQ() {
  const enabled = flag('accountFaq');
  const [open, setOpen] = useState(null);

  if (!enabled) return null;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      {Q_KEYS.map(key => {
        const isOpen = open === key;
        const question = t(`accountFaq.${key}.q`);
        const answer   = t(`accountFaq.${key}.a`);
        if (!question || !answer) return null;
        return (
          <div
            key={key}
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 5,
              overflow: 'hidden',
              background: swatch.white,
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : key)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 12px',
                background: isOpen ? '#FBF5E6' : 'transparent',
                border: 'none', cursor: 'pointer',
                textAlign: 'left',
                fontFamily: sans, fontSize: FS.md, fontWeight: 600,
                color: INK,
              }}
            >
              {isOpen
                ? <Minus size={13} color={GOLD} />
                : <Plus size={13} color={GOLD} />}
              <span style={{ flex: 1 }}>{question}</span>
            </button>
            {isOpen && (
              <div style={{
                padding: '8px 14px 12px',
                fontSize: FS.sm, color: BODY,
                lineHeight: 1.55, fontFamily: sans,
                borderTop: `1px solid ${BORDER}`,
              }}>
                {answer}
              </div>
            )}
          </div>
        );
      })}
      <div style={{
        marginTop: 4, fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
        fontFamily: sans,
      }}>
        Still stuck? Drop a note via Customer Support below.
      </div>
    </div>
  );
}
