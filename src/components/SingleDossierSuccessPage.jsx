/**
 * SingleDossierSuccessPage.jsx — Post-checkout landing for the $2.99 one-shot.
 *
 * The single-dossier flow:
 *   1. Anonymous visitor generates a settlement on the homepage hero.
 *   2. Clicks "Buy this dossier" — we persist the settlement (server-side in
 *      dossier_purchases + a local stash, see lib/pendingDossier) and redirect
 *      to Stripe.
 *   3. Stripe collects payment, then redirects back with
 *      ?checkout=success&product=single_dossier&session_id=…&dt=<token>.
 *   4. App.jsx routes that here, forwarding session_id + dt.
 *
 * Responsibilities (findings F21/F23):
 *   - Verify the paid Stripe session server-side BEFORE releasing the PDF.
 *   - PREFER the server-returned settlement (survives a lost/overwritten local
 *     stash or a different device); fall back to the local stash only when the
 *     server row is missing.
 *   - Distinguish a TRANSIENT verify failure (rate limit / Stripe blip →
 *     offer Retry, keep the stash) from a TERMINAL mismatch (→ support card).
 *   - Generate the PDF client-side and auto-download it once verified.
 *   - Encourage account creation to keep + edit the dossier.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { Check, Download, AlertCircle, LogIn, ArrowRight, RefreshCw } from 'lucide-react';
import {
  readPendingDossier,
  readPendingDossierByToken,
  clearPendingDossier,
} from '../lib/pendingDossier.js';
import { verifySingleDossierPurchase } from '../lib/stripe.js';
import { SINGLE_DOSSIER } from '../config/pricing.js';
import { FREE_SAVE_LIMIT } from '../config/tierFacts.js';
import { supportMailto } from '../copy/support.js';
import { Funnel, EVENTS, track } from '../lib/analytics.js';
import { GOLD, INK, BORDER, CARD, sans, serif_, SP, FS, swatch, GREEN, RED } from './theme.js';
import Button from './primitives/Button.jsx';
import CaptchaGate from './perimeter/CaptchaGate.jsx';

const MUTED = swatch['#6B5340'];
const BODY  = swatch['#4A3B22'];

/** Resolve the returning purchase: URL (session_id + dt) first, then the stash. */
function resolveReturn() {
  let urlSession = null;
  let urlToken = null;
  if (typeof window !== 'undefined') {
    const p = new URLSearchParams(window.location.search);
    urlSession = p.get('session_id');
    urlToken = p.get('dt');
  }
  if (urlSession && urlToken) {
    return { sessionId: urlSession, token: urlToken, stash: readPendingDossierByToken(urlToken) };
  }
  // Fallback for the same-device single-purchase flow: the most-recent PAID stash.
  const pending = readPendingDossier();
  return {
    sessionId: urlSession || pending?.sessionId || null,
    token: urlToken || pending?.checkoutToken || null,
    stash: (urlToken ? readPendingDossierByToken(urlToken) : pending) || pending || null,
  };
}

export default function SingleDossierSuccessPage({ onSignUp, onGenerateAnother }) {
  // Resolved once on mount — the URL params are stable for this landing.
  const [ret] = useState(resolveReturn);
  const { sessionId, token } = ret;

  // The dossier we render: server-returned settlement is preferred; the local
  // stash is the initial fallback until verification returns.
  const [settlement, setSettlement] = useState(() => ret.stash?.settlement || null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  // status: 'checking' | 'verified' | 'retryable' | 'failed'
  const canAttempt = Boolean(sessionId && token);
  const [verification, setVerification] = useState(() => (
    canAttempt
      ? { status: 'checking', error: null }
      : { status: 'failed', error: 'The paid checkout session could not be matched to this dossier.' }
  ));

  const autoDownloadedRef = useRef(false);
  const analyticsFiredRef = useRef(false);
  // Wave-D human verification (INERT until activated): a managed-Turnstile token
  // held in a ref so it rides the verify call WITHOUT re-running the mount-time
  // verification. This is a POST-PAYMENT step — verify-single-dossier verifies the
  // token ONLY IF present and NEVER blocks a paid buyer on a missing/blocked one.
  const captchaTokenRef = useRef(null);

  // The async verification. Kept free of any SYNCHRONOUS setState so it is safe
  // to invoke directly from the mount effect (results land only in .then/.catch).
  const doVerify = useCallback(() => {
    if (!canAttempt) return () => {};
    let cancelled = false;
    verifySingleDossierPurchase(sessionId, token, captchaTokenRef.current || undefined)
      .then(data => {
        if (cancelled) return;
        // Prefer the server-persisted settlement; fall back to the local stash.
        const resolved = data?.settlement || readPendingDossierByToken(token)?.settlement || settlement || null;
        if (!resolved) {
          setVerification({
            status: 'failed',
            error: 'Your payment was confirmed, but this device no longer has the dossier and the server copy could not be found.',
          });
          return;
        }
        setSettlement(resolved);
        setVerification({ status: 'verified', error: null });
      })
      .catch(error => {
        if (cancelled) return;
        // Transient (rate limit / Stripe blip / network) → offer Retry and KEEP
        // the stash. Only a terminal mismatch shows the support card.
        setVerification({
          status: error?.transient ? 'retryable' : 'failed',
          error: error?.message || 'Purchase verification failed.',
        });
      });
    return () => { cancelled = true; };
  }, [canAttempt, sessionId, token, settlement]);

  // Retry (button) resets to the checking state, then re-runs verification.
  const retryVerify = useCallback(() => {
    setVerification({ status: 'checking', error: null });
    doVerify();
  }, [doVerify]);

  useEffect(() => {
    const cancel = doVerify();
    return cancel;
    // Run once on mount; Retry re-invokes doVerify imperatively.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDownload = useCallback(async () => {
    if (!settlement || verification.status !== 'verified') return;
    setDownloading(true); setDownloadError(null);
    try {
      // Lazy import keeps the @react-pdf/renderer chunk out of the initial
      // bundle for users who land here but never trigger a download.
      const { generateSettlementPDF } = await import('../utils/generateSettlementPDF.js');
      await generateSettlementPDF(settlement, { isAnonymous: false });
    } catch (e) {
      console.error('[SingleDossierSuccess] PDF generation failed:', e);
      setDownloadError(e.message || 'Could not generate the PDF.');
    } finally {
      setDownloading(false);
    }
  }, [settlement, verification.status]);

  // Record the purchase only after Stripe has verified the session.
  useEffect(() => {
    if (analyticsFiredRef.current) return;
    if (!settlement) return;
    if (verification.status !== 'verified') return;
    analyticsFiredRef.current = true;
    track(EVENTS.SINGLE_DOSSIER_PURCHASED, { tier: settlement.tier });
    Funnel.paidAction({ kind: 'single_dossier' });
  }, [settlement, verification.status]);

  // Auto-trigger the download once verified — the user paid for the PDF.
  useEffect(() => {
    if (autoDownloadedRef.current) return;
    if (!settlement) return;
    if (verification.status !== 'verified') return;
    autoDownloadedRef.current = true;
    handleDownload();
  }, [settlement, verification.status, handleDownload]);

  function handleKeep() {
    // The user has their PDF. Clear THIS dossier's stash (not every stash) so a
    // concurrent purchase in another tab isn't wiped. We do not touch the
    // in-memory store — keeping/editing routes through the normal save flow.
    if (token) clearPendingDossier(token);
    onSignUp?.();
  }

  function handleGenerateAnother() {
    if (token) clearPendingDossier(token);
    onGenerateAnother?.();
  }

  // ── Terminal failure (mismatch / unrecoverable) → support card ────────────
  if (verification.status === 'failed') {
    return (
      <div style={{
        maxWidth: 560, margin: `${SP.xxl}px auto`,
        padding: `${SP.xxl}px ${SP.xl}px`,
        background: CARD, border: `1px solid ${BORDER}`,
        fontFamily: sans, color: INK, textAlign: 'center',
      }}>
        <AlertCircle size={32} color={GOLD} style={{ margin: '0 auto' }} />
        <h1 style={{
          margin: `${SP.md}px 0 0`, fontFamily: serif_, fontSize: FS.xxl, color: INK,
        }}>
          We couldn’t verify this dossier
        </h1>
        <p style={{
          margin: `${SP.sm}px auto 0`, maxWidth: 420,
          fontSize: FS.md, color: BODY, lineHeight: 1.55,
        }}>
          {verification.error || 'This device no longer has the original settlement checkout details.'}
          {' '}Check your Stripe receipt for the session ID and send it to support
          so the purchase can be recovered safely.
        </p>
        <a
          href={supportMailto('Single dossier recovery')}
          style={{
            display: 'inline-block', marginTop: SP.lg,
            padding: `${SP.sm + 2}px ${SP.lg}px`,
            // Ink-on-gold (the house AA badge pairing), square-cut instrument.
            background: GOLD, color: INK,
            border: 'none',
            fontFamily: sans, fontSize: FS.md, fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Email support
        </a>
      </div>
    );
  }

  // ── Transient failure → Retry (stash preserved) ───────────────────────────
  if (verification.status === 'retryable') {
    return (
      <div style={{
        maxWidth: 560, margin: `${SP.xxl}px auto`,
        padding: `${SP.xxl}px ${SP.xl}px`,
        background: CARD, border: `1px solid ${BORDER}`,
        fontFamily: sans, color: INK, textAlign: 'center',
      }}>
        <AlertCircle size={32} color={GOLD} style={{ margin: '0 auto' }} />
        <h1 style={{ margin: `${SP.md}px 0 0`, fontFamily: serif_, fontSize: FS.xxl, color: INK }}>
          Still confirming your purchase
        </h1>
        <p style={{
          margin: `${SP.sm}px auto ${SP.lg}px`, maxWidth: 420,
          fontSize: FS.md, color: BODY, lineHeight: 1.55,
        }}>
          {verification.error || 'We hit a temporary snag confirming the payment.'}
          {' '}Your dossier is safe — this usually clears in a few seconds.
        </p>
        <Button variant="primary" size="lg" icon={<RefreshCw size={16} />} onClick={retryVerify}>
          Try again
        </Button>
        <p style={{ margin: `${SP.md}px auto 0`, maxWidth: 420, fontSize: FS.xs, color: MUTED }}>
          Still stuck? <a href={supportMailto('Single dossier recovery')} style={{ color: GOLD, fontWeight: 600 }}>Email support</a>.
        </p>
      </div>
    );
  }

  const settlementName = settlement?.name || 'your settlement';

  if (verification.status === 'checking') {
    return (
      <div style={{
        maxWidth: 560, margin: `${SP.xxl}px auto`, padding: `${SP.xxl}px ${SP.xl}px`,
        background: CARD, border: `1px solid ${BORDER}`,
        fontFamily: sans, color: INK, textAlign: 'center',
      }}>
        <h1 style={{ margin: 0, fontFamily: serif_, fontSize: FS.xxl }}>Confirming your purchase</h1>
        <p style={{ margin: `${SP.sm}px 0 0`, color: BODY }}>Checking the paid Stripe session before preparing the PDF.</p>
        {/* Wave-D human verification (INERT until activated). Managed/invisible;
            mints a best-effort token for the verify call. This is post-payment, so
            the server never blocks delivery on a missing token — renders nothing
            while the perimeterCaptcha flag is off. */}
        <CaptchaGate action="verify" onToken={(tok) => { captchaTokenRef.current = tok; }} />
      </div>
    );
  }

  return (
    <div style={{
      // The receipt artifact — a plate on the warm parchment ground; the frame
      // is a hairline rule, not a rounded shadow-card (depth is ink, not lift).
      maxWidth: 640, margin: `${SP.xxl}px auto`,
      padding: `${SP.xxl}px ${SP.xl}px`,
      background: `linear-gradient(180deg, #FBF5E6 0%, #F4EAD0 100%)`,
      border: `1px solid ${BORDER}`,
      fontFamily: sans, color: INK, textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56,
        background: GREEN, color: swatch.white,
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
        is yours. The download should begin automatically.
      </p>

      {/* Download actions */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: SP.sm,
        marginTop: SP.xl,
      }}>
        <Button
          variant="primary"
          size="lg"
          icon={<Download size={16} />}
          busy={downloading}
          onClick={handleDownload}
          disabled={downloading || verification.status !== 'verified'}
        >
          {downloading ? 'Preparing PDF…' : autoDownloadedRef.current ? 'Download again' : 'Download PDF'}
        </Button>

        {downloadError && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: RED, fontSize: FS.sm,
          }}>
            <AlertCircle size={14} /> {downloadError}
          </div>
        )}

        {/* The ruled record block — the receipt artifact: item · price · date,
            framed by rules (no box). The price stays config-fed. */}
        <div style={{
          margin: `${SP.md}px auto 0`, maxWidth: 340,
          borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`,
          padding: `${SP.sm}px 0`, textAlign: 'left',
          display: 'grid', gap: 4, fontFamily: sans,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SP.sm }}>
            <span style={{ fontSize: FS.sm, color: BODY }}>Single dossier</span>
            <span style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>{SINGLE_DOSSIER.priceLabel}</span>
          </div>
          <div style={{ fontSize: FS.xs, color: MUTED }}>
            {new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date())}
          </div>
        </div>
        <p style={{
          margin: `${SP.sm}px auto 0`, maxWidth: 420,
          fontSize: FS.xs, color: MUTED, lineHeight: 1.55,
        }}>
          Receipt sent to the email you entered at checkout.
        </p>
      </div>

      {/* Sign-up upsell */}
      <div style={{
        marginTop: SP.xxl, padding: `${SP.lg}px ${SP.xl}px`,
        background: CARD, border: `1px solid ${BORDER}`,
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
          A free Wanderer account saves {FREE_SAVE_LIMIT} dossiers and remembers
          your settings across devices. No card required.
        </p>
        <div style={{
          marginTop: SP.md, display: 'flex', gap: SP.sm, justifyContent: 'center', flexWrap: 'wrap',
        }}>
          <Button
            variant="gold"
            size="md"
            icon={<LogIn size={14} />}
            onClick={handleKeep}
          >
            Create a free account
          </Button>
          <Button
            variant="secondary"
            size="md"
            trailingIcon={<ArrowRight size={14} />}
            onClick={handleGenerateAnother}
          >
            Generate another
          </Button>
        </div>
      </div>

      {/* The colophon — the maker's mark at the receipt's foot, under a rule. */}
      <div style={{
        marginTop: SP.xl, paddingTop: SP.md, borderTop: `1px solid ${BORDER}`,
        fontFamily: serif_, fontSize: FS.xs, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: MUTED,
      }}>
        SettlementForge
      </div>
    </div>
  );
}
