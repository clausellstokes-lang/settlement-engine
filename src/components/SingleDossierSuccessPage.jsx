/**
 * SingleDossierSuccessPage.jsx — Post-checkout landing for the $2.99 one-shot.
 *
 * The single-dossier flow:
 *   1. Anonymous visitor generates a settlement on the homepage hero.
 *   2. Clicks "Buy this dossier" — we stash the settlement (see
 *      lib/pendingDossier) and redirect to Stripe.
 *   3. Stripe collects payment, then redirects back with
 *      ?checkout=success&product=single_dossier.
 *   4. App.jsx routes that combination to this page.
 *
 * Responsibilities here:
 *   - Pull the dossier back out of the stash.
 *   - Render a thank-you with the settlement's name so the user can
 *     see *what* they bought (not just a generic receipt).
 *   - Generate the PDF client-side and trigger a download.
 *   - Encourage account creation so they can keep + edit the dossier
 *     (the purchase grants the PDF, not an account).
 *   - Handle the failure case where the stash is empty (e.g., they
 *     opened the success URL in a different browser): explain what
 *     happened, point at support.
 */

import { useEffect, useRef, useState } from 'react';
import { Check, Download, AlertCircle, LogIn, ArrowRight } from 'lucide-react';
import { readPendingDossier, clearPendingDossier } from '../lib/pendingDossier.js';
import { SINGLE_DOSSIER } from '../config/pricing.js';
import { Funnel, EVENTS, track } from '../lib/analytics.js';
import {
  GOLD, INK, _INK_DEEP, BORDER, CARD, _PARCH, sans, serif_, SP, R, FS,
} from './theme.js';

const MUTED = '#6b5340';
const BODY  = '#4A3B22';

export default function SingleDossierSuccessPage({ onSignUp, onGenerateAnother }) {
  const [pending, setPending] = useState(() => readPendingDossier());
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  // Ref-based guard avoids the setState-in-effect warning. The auto-
  // download fires exactly once per mount even under React 19 strict-
  // mode double-invocation.
  const autoDownloadedRef = useRef(false);

  // Tier 8.8 / 8.9 — record the purchase event. Fires once when we
  // have a confirmed pending dossier (i.e. the user really came here
  // from a successful checkout, not by typing the URL). PAID_AFTER_ANON
  // attributes back to the anonymous funnel when applicable.
  const analyticsFiredRef = useRef(false);
  useEffect(() => {
    if (analyticsFiredRef.current) return;
    if (!pending?.settlement) return;
    analyticsFiredRef.current = true;
    track(EVENTS.SINGLE_DOSSIER_PURCHASED, { tier: pending.settlement.tier });
    Funnel.paidAction({ kind: 'single_dossier' });
  }, [pending]);

  // Auto-trigger the download once on mount when we have a stash —
  // the user paid for the PDF, they shouldn't have to hunt for the
  // button. The "Download again" affordance below lets them retrigger.
  useEffect(() => {
    if (autoDownloadedRef.current) return;
    if (!pending?.settlement) return;
    autoDownloadedRef.current = true;
    handleDownload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  async function handleDownload() {
    if (!pending?.settlement) return;
    setDownloading(true); setDownloadError(null);
    try {
      // Lazy import keeps the @react-pdf/renderer chunk out of the
      // initial bundle for users who land on this page from a search
      // engine but never actually trigger a download.
      const { generateSettlementPDF } = await import('../utils/generateSettlementPDF.js');
      // The single-dossier flow is the canonical anonymous path — these
      // buyers do not have accounts. The watermark stays out of paid
      // tier exports (Wanderer/Cartographer/Founder) which use
      // SettlementDetail's export handler. Founder accounts also pass
      // their own isFounder flag, which is mutually exclusive with this
      // anonymous path.
      await generateSettlementPDF(pending.settlement, { isAnonymous: true });
    } catch (e) {
      console.error('[SingleDossierSuccess] PDF generation failed:', e);
      setDownloadError(e.message || 'Could not generate the PDF.');
    } finally {
      setDownloading(false);
    }
  }

  function handleKeep() {
    // The user has their PDF. Clear the stash so the next anonymous
    // generation starts clean. We do NOT clear the in-memory store —
    // if they want to keep editing they'll need to sign up, which
    // routes them through normal save flow.
    clearPendingDossier();
    setPending(null);
    onSignUp?.();
  }

  // ── Stash-missing failure mode ────────────────────────────────────────
  // Someone landed on the success URL without a stash. Most likely:
  // they completed Stripe in one tab and opened the success link in
  // another. We can't show them the dossier (we never had it on this
  // device), so explain and offer recovery.
  if (!pending?.settlement) {
    return (
      <div style={{
        maxWidth: 560, margin: `${SP.xxl}px auto`,
        padding: `${SP.xxl}px ${SP.xl}px`,
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.xl,
        fontFamily: sans, color: INK, textAlign: 'center',
      }}>
        <AlertCircle size={32} color={GOLD} style={{ margin: '0 auto' }} />
        <h1 style={{
          margin: `${SP.md}px 0 0`, fontFamily: serif_, fontSize: FS.xxl, color: INK,
        }}>
          Receipt confirmed
        </h1>
        <p style={{
          margin: `${SP.sm}px auto 0`, maxWidth: 420,
          fontSize: FS.md, color: BODY, lineHeight: 1.55,
        }}>
          Your purchase went through, but this device doesn’t have the original
          settlement cached anymore. Check your email — Stripe will have sent a
          receipt with the session ID. Forward that to support and we’ll resend
          your dossier.
        </p>
        <a
          href="mailto:clausellstokes@aol.com?subject=Single%20dossier%20recovery"
          style={{
            display: 'inline-block', marginTop: SP.lg,
            padding: `${SP.sm + 2}px ${SP.lg}px`,
            background: GOLD, color: '#fff',
            border: 'none', borderRadius: R.button,
            fontFamily: sans, fontSize: FS.md, fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Email support
        </a>
      </div>
    );
  }

  const settlementName = pending.settlement.name || 'your settlement';

  return (
    <div style={{
      maxWidth: 640, margin: `${SP.xxl}px auto`,
      padding: `${SP.xxl}px ${SP.xl}px`,
      background: `linear-gradient(180deg, #FBF5E6 0%, #F4EAD0 100%)`,
      border: `1px solid ${BORDER}`,
      borderRadius: R.xl + 2,
      fontFamily: sans, color: INK, textAlign: 'center',
      boxShadow: '0 8px 28px rgba(27,20,8,0.12)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: '#4A7A3A', color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto',
      }}>
        <Check size={28} />
      </div>

      <h1 style={{
        margin: `${SP.lg}px 0 0`, fontFamily: serif_,
        fontSize: FS['28'], fontWeight: 600, color: INK,
      }}>
        Your dossier is ready
      </h1>
      <p style={{
        margin: `${SP.sm}px auto 0`, maxWidth: 460,
        fontFamily: serif_, fontStyle: 'italic',
        fontSize: FS.lg, color: BODY, lineHeight: 1.55,
      }}>
        Thanks for backing the work. <strong style={{ fontStyle: 'normal' }}>{settlementName}</strong>{' '}
        is yours — the download should begin automatically.
      </p>

      {/* Download actions */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.sm,
        marginTop: SP.xl,
      }}>
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: `${SP.md}px ${SP.xl}px`,
            background: `linear-gradient(135deg, ${GOLD} 0%, #b8860b 100%)`,
            color: '#fff', border: 'none',
            borderRadius: R.button,
            fontFamily: sans, fontSize: FS.md, fontWeight: 700,
            cursor: downloading ? 'wait' : 'pointer',
            opacity: downloading ? 0.7 : 1,
            boxShadow: '0 4px 14px rgba(201,162,76,0.35)',
          }}
        >
          <Download size={16} /> {downloading ? 'Preparing PDF…' : autoDownloadedRef.current ? 'Download again' : 'Download PDF'}
        </button>

        {downloadError && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: '#A23434', fontSize: FS.sm,
          }}>
            <AlertCircle size={14} /> {downloadError}
          </div>
        )}

        <p style={{
          margin: `${SP.sm}px auto 0`, maxWidth: 420,
          fontSize: FS.xs, color: MUTED, lineHeight: 1.55,
        }}>
          Receipt sent to the email you entered at checkout. Your purchase total
          was {SINGLE_DOSSIER.priceLabel}.
        </p>
      </div>

      {/* Sign-up upsell */}
      <div style={{
        marginTop: SP.xxl, padding: `${SP.lg}px ${SP.xl}px`,
        background: 'rgba(255,251,245,0.7)', border: `1px solid ${BORDER}`,
        borderRadius: R.xl,
      }}>
        <h2 style={{
          margin: 0, fontFamily: serif_, fontSize: FS.xl, color: INK,
        }}>
          Want to keep building?
        </h2>
        <p style={{
          margin: `${SP.sm}px auto 0`, maxWidth: 440,
          fontSize: FS.sm, color: BODY, lineHeight: 1.5,
        }}>
          A free Wanderer account saves three dossiers, unlocks full-screen edit,
          and remembers your settings across devices. No card required.
        </p>
        <div style={{
          marginTop: SP.md, display: 'flex', gap: SP.sm, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <button
            type="button"
            onClick={handleKeep}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: `${SP.sm + 2}px ${SP.lg}px`,
              background: 'transparent', color: GOLD,
              border: `1.5px solid ${GOLD}`,
              borderRadius: R.button,
              fontFamily: sans, fontSize: FS.sm, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <LogIn size={14} /> Create a free account
          </button>
          <button
            type="button"
            onClick={() => { clearPendingDossier(); onGenerateAnother?.(); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: `${SP.sm + 2}px ${SP.lg}px`,
              background: 'transparent', color: BODY,
              border: `1px solid ${BORDER}`,
              borderRadius: R.button,
              fontFamily: sans, fontSize: FS.sm, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Generate another <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
