/**
 * WelcomeCreditCard.jsx — P104 / X-4 "every paying user has felt what
 * they're paying for."
 *
 * The single strongest pitch for Narrate is a Narrate credit the user
 * has already spent. We grant 1 on signup (migration 015) and surface
 * this card on the user's first saved dossier, with a single CTA to
 * spend it.
 *
 * Visibility rules:
 *   - Renders only for signed-in users (anonymous = no ledger entry).
 *   - Renders only on the first saved settlement (i.e. savedCount === 1).
 *   - Renders only while the user still has an unspent welcome credit
 *     (kind='welcome' ledger entry with no matching spend).
 *   - Dismisses permanently via localStorage flag.
 *
 * Once the user clicks "Narrate this town" the existing requestNarrative
 * flow handles the credit spend through the spend_credits RPC. The
 * card auto-dismisses on first narrate.
 *
 * Flag: `welcomeCredit` (default on after migration 015 deploys).
 */

import { useEffect, useState } from 'react';
import { useStore } from '../../store/index.js';
import { flag } from '../../lib/flags.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import {
  INK, BORDER, sans, serif_, FS, SP, R,
} from '../theme.js';

const VIOLET = '#7B4FCF';
const VIOLET_BG = '#EBE2FA';

const DISMISS_KEY = 'sf.welcomeCredit.dismissed';

function readDismissed() {
  try {
    return typeof localStorage !== 'undefined' &&
      localStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

function markDismissed() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DISMISS_KEY, '1');
    }
  } catch {
    /* storage unavailable */
  }
}

export default function WelcomeCreditCard() {
  const enabled = flag('welcomeCredit');
  const tier = useStore(s => s.auth.tier);
  const userId = useStore(s => s.auth.user?.id);
  const savedCount = useStore(s => s.savedSettlements?.length || 0);
  const creditBalance = useStore(s => s.creditBalance);
  const requestNarrative = useStore(s => s.requestNarrative);
  const settlement = useStore(s => s.settlement);

  const [dismissed, setDismissed] = useState(() => readDismissed());
  const [welcomeUnspent, setWelcomeUnspent] = useState(false);

  // Check the ledger for an unspent welcome credit. We do this once per
  // mount + on user id change. The fetch is small (one row) and only
  // fires for signed-in users on their first saved dossier — the
  // narrowest possible audience.
  useEffect(() => {
    if (!enabled) return;
    if (tier === 'anon' || !userId) return;
    if (savedCount !== 1) return;
    if (dismissed) return;

    let cancelled = false;
    (async () => {
      try {
        const { supabase, isConfigured } = await import('../../lib/supabase.js');
        if (!isConfigured) {
          // Local dev — assume the credit is present so we can preview
          // the card without a backend.
          setWelcomeUnspent(true);
          return;
        }
        const { data, error } = await supabase
          .from('credit_ledger')
          .select('id, reason, delta')
          .eq('user_id', userId)
          .eq('reason', 'welcome')
          .limit(1);
        if (error) return;
        if (!cancelled && Array.isArray(data) && data.length > 0 && creditBalance > 0) {
          setWelcomeUnspent(true);
          Funnel.track(EVENTS.WELCOME_CREDIT_GRANTED, { userId });
        }
      } catch { /* network failure — just don't show the card */ }
    })();

    return () => { cancelled = true; };
  }, [enabled, tier, userId, savedCount, dismissed, creditBalance]);

  if (!enabled) return null;
  if (dismissed) return null;
  if (!welcomeUnspent) return null;
  if (!settlement) return null;

  const onNarrate = async () => {
    try {
      await requestNarrative?.();
      Funnel.track(EVENTS.WELCOME_CREDIT_SPENT, { userId });
    } catch (e) {
      console.warn('[WelcomeCreditCard] requestNarrative failed:', e);
    }
    markDismissed();
    setDismissed(true);
  };

  const onLater = () => {
    markDismissed();
    setDismissed(true);
  };

  return (
    <div style={{
      maxWidth: 480, margin: `${SP.md}px auto`,
      background: '#fff', border: `1px solid ${BORDER}`,
      borderRadius: R.lg, overflow: 'hidden',
      boxShadow: '0 6px 20px rgba(27,20,8,0.08)',
      fontFamily: sans,
    }}>
      <div style={{
        padding: SP.md,
        background: `linear-gradient(135deg, ${VIOLET_BG}88, ${VIOLET_BG}44)`,
        borderBottom: `1px solid ${VIOLET}30`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.md }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: VIOLET_BG, color: VIOLET,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: FS.xl,
          }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: VIOLET,
            }}>
              Welcome credit · on us
            </div>
            <div style={{
              fontFamily: serif_, fontSize: FS.lg, fontWeight: 600,
              color: INK, marginTop: 2,
            }}>
              Try the Narrative Layer once.
            </div>
          </div>
        </div>
        <p style={{
          margin: `${SP.sm}px 0 0`, fontSize: FS.sm, color: '#4A3B22',
          lineHeight: 1.55, fontFamily: serif_, fontStyle: 'italic',
        }}>
          It’ll turn this town’s data into prose your players can hear —
          the difference between a sheet and a session.
        </p>
      </div>
      <div style={{
        padding: SP.md, display: 'flex',
        alignItems: 'center', gap: SP.sm,
      }}>
        <div style={{ flex: 1, fontSize: FS.xs, color: '#9C8068' }}>
          <div>Cost: <s>3 credits</s></div>
          <div style={{ fontWeight: 700, color: VIOLET }}>This one: free</div>
        </div>
        <button
          onClick={onNarrate}
          style={{
            padding: `${SP.sm}px ${SP.md}px`,
            background: VIOLET,
            color: '#fff', border: 'none',
            borderRadius: R.sm,
            fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(123,79,207,0.35)',
          }}
        >
          ✦ Narrate this town
        </button>
        <button
          onClick={onLater}
          style={{
            padding: `${SP.sm}px ${SP.sm}px`,
            background: 'transparent',
            color: '#9C8068', border: 'none',
            fontSize: FS.xs, fontFamily: sans,
            cursor: 'pointer',
          }}
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
