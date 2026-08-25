/**
 * BuyThisDossier.jsx — the PDF-export purchase CTA (single-dossier ladder,
 * migration 108). Wave 4f closes the 4e handoff: the anon buy click now opens the
 * LADDER POPUP (free account / Cartographer / one-time download) instead of
 * jumping straight to Stripe, records a retro-claim voucher so a later same-device
 * sign-up can silently attach the durable right, and threads a saveId so a
 * signed-in durable purchase binds to the right save.
 *
 * ACCESS MODEL. The decision routes through one inline table (resolveExportAccess)
 * built on the store's own gates — `canExport()` / `isElevated()` — rather than a
 * pricing import, so it honors OUR tier gates exactly:
 *   · export-capable tier (elevated, or a tier whose gate allows export) → render
 *     NOTHING (they already export freely).                     reason 'tier'
 *   · anonymous visitor → the ladder popup.                     reason 'anon'
 *   · signed-in, no export gate, SAVED but no durable right yet → the $2.99
 *     durable purchase, keyed to this save.                      reason 'unpurchased'
 *   · signed-in, no export gate, UNSAVED draft → "save it first".reason 'unsaved'
 * In OUR current tier gates the free tier CAN export, so 'unpurchased'/'unsaved'
 * are dormant-but-wired: they light up the instant the free-export gate is ever
 * flipped, with no further change here.
 *
 * Failure modes (anon one-time path): a secure-token or stash-write failure stops
 * the checkout BEFORE redirect so a buyer can never pay for a dossier we cannot
 * recover. The retro-claim stash is best-effort — a failure there never blocks a
 * paid download; it only forgoes the later auto-upgrade.
 */

import { useEffect, useState } from 'react';
import { Download, Save } from 'lucide-react';
import { useStore } from '../store/index.js';
import { startCheckout } from '../lib/stripe.js';
import { createDossierCheckoutToken, stashPendingDossier } from '../lib/pendingDossier.js';
import { stashDossierClaim } from '../lib/dossierClaimStash.js';
import { SINGLE_DOSSIER } from '../config/pricing.js';
import { isConfigured } from '../lib/supabase.js';
import { viewToPath } from '../lib/routes.js';
import { t } from '../copy/index.js';
import { sans, FS, RED, BODY } from './theme.js';
import Button from './primitives/Button.jsx';
import DossierLadderModal from './dossier/DossierLadderModal.jsx';

/**
 * Pure export-access decision — exported for direct unit testing without a React
 * tree. Built on OUR store gates: `canExportFreely` folds elevated + any
 * export-capable tier together (the store's `canExport()` result).
 *
 * @param {{ tier: string|undefined, canExportFreely: boolean, saveId: string|null|undefined, entitled: boolean }} input
 * @returns {{ allowed: boolean, reason: 'tier'|'entitled'|'anon'|'unpurchased'|'unsaved' }}
 */
export function resolveExportAccess({ tier, canExportFreely, saveId, entitled }) {
  if (canExportFreely) return { allowed: true, reason: 'tier' };
  if (tier === 'anon') return { allowed: false, reason: 'anon' };
  if (!saveId) return { allowed: false, reason: 'unsaved' };
  if (entitled) return { allowed: true, reason: 'entitled' };
  return { allowed: false, reason: 'unpurchased' };
}

/**
 * @param {object} props
 * @param {object} props.settlement                    — the in-memory or saved settlement.
 * @param {string|null} [props.saveId]                 — the SAVED settlement id, or null for a draft.
 * @param {() => void} [props.onSignIn]                — open the auth flow (ladder "create account").
 * @param {() => void} [props.onSaveFirst]            — save the unsaved draft (the "save first" rung); falls back to the canonical save chokepoint when omitted.
 * @param {(view: string) => void} [props.onNavigate] — app navigation (ladder "Cartographer").
 * @param {string} [props.size]                        — Button size token.
 */
export default function BuyThisDossier({ settlement, saveId = null, onSignIn, onSaveFirst, onNavigate, size = 'sm' }) {
  const tier = useStore(s => s.auth?.tier);
  const canExportFreely = useStore(s => (typeof s.isElevated === 'function' && s.isElevated())
    || (typeof s.canExport === 'function' && s.canExport()));
  // When THIS component owns the fallback save (no caller-supplied saveId or
  // onSaveFirst), the returned id is held locally so the rung advances from
  // 'unsaved' → 'unpurchased' on the very next render even before the parent
  // re-threads activeSaveId (finding components-shell-commerce-2).
  const [localSaveId, setLocalSaveId] = useState(null);
  const effectiveSaveId = saveId ?? localSaveId;
  // `undefined` = never fetched. Guard the map so a partial store reads undefined.
  const cached = useStore(s => (effectiveSaveId ? s.dossierEntitlements?.[effectiveSaveId] : undefined));
  const canSave = useStore(s => (typeof s.canSave === 'function' ? s.canSave() : false));
  const refreshDossierEntitlement = useStore(s => s.refreshDossierEntitlement);
  const setActiveSaveId = useStore(s => s.setActiveSaveId);

  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState(null);
  const [ladderOpen, setLadderOpen] = useState(false);

  const access = resolveExportAccess({ tier, canExportFreely, saveId: effectiveSaveId, entitled: cached === true });

  // Only the signed-in unpurchased path needs a durable-right lookup; fetch once
  // when the save id is known and nothing is cached yet.
  useEffect(() => {
    if (access.reason === 'unpurchased' && cached === undefined && effectiveSaveId
        && typeof refreshDossierEntitlement === 'function') {
      refreshDossierEntitlement(effectiveSaveId);
    }
  }, [access.reason, cached, effectiveSaveId, refreshDossierEntitlement]);

  if (!settlement) return null;
  if (access.allowed) return null;    // export-capable tier or a durable right already held.

  // Ladder nav — prefer the injected callbacks; fall back to a real route change so
  // the upsell rungs are never dead buttons when a caller omits nav.
  const goPricing = () => (typeof onNavigate === 'function' ? onNavigate('pricing') : window.location.assign(viewToPath('pricing')));
  const goSignIn  = () => (typeof onSignIn === 'function' ? onSignIn() : window.location.assign(viewToPath('signin')));

  // ── The anonymous one-time checkout ─────────────────────────────────────────
  // Stashes the settlement so it survives the Stripe round-trip, AND records a
  // versioned claim voucher so a later same-device sign-up + save of THIS
  // settlement can silently attach the durable right (the retro auto-upgrade).
  async function runOneTimeCheckout() {
    setBusy(true); setError(null);
    try {
      const checkoutToken = createDossierCheckoutToken();
      if (!stashPendingDossier(settlement, checkoutToken)) {
        throw new Error('This browser cannot safely retain the dossier through checkout. Enable local storage and try again.');
      }
      // Best-effort retro-claim voucher — a failure must not block a paid download.
      try { stashDossierClaim({ settlement, checkoutToken }); } catch { /* non-fatal */ }
      await startCheckout('single_dossier', { checkoutToken, settlement });
      // startCheckout redirects on success; we only reach here on failure.
    } catch (e) {
      setError(e.message || t('dossierExport.buySaved.error'));
      setBusy(false);
      setLadderOpen(false);
    }
  }

  // ── The "save it first" action (signed-in, unsaved draft) ───────────────────
  // The honest CTA is "save this settlement" — so it MUST trigger the save flow,
  // never the sign-in route (which, for an already-signed-in user, bounces to
  // /create and the save never happens: finding components-commerce-5). Prefer a
  // caller-supplied save handler; otherwise persist through the same chokepoint
  // SaveToLibraryButton uses (savesService.save + the F34 save moments), so the
  // rung saves even when a caller doesn't wire onSaveFirst.
  async function runSaveFirst() {
    if (typeof onSaveFirst === 'function') { onSaveFirst(); return; }
    if (busy) return; // re-entrancy guard: a second click must not re-insert a row
    setBusy(true); setError(null);
    try {
      const { saves: savesService } = await import('../lib/saves.js');
      const config = settlement._config || null;
      const newSaveId = await savesService.save({
        name: settlement.name || 'Untitled Settlement',
        tier: settlement.tier || 'unknown',
        settlement,
        config,
      });
      // Stamp the active save id AND hold it locally so the rung advances to
      // 'unpurchased' immediately — the save-first button is gone on re-render, so
      // there is no button left to double-insert with.
      if (typeof setActiveSaveId === 'function') setActiveSaveId(newSaveId);
      setLocalSaveId(newSaveId);
      import('../store/saveMoments.js')
        .then(({ recordSaveMomentForActiveSave }) =>
          recordSaveMomentForActiveSave({ saveId: newSaveId, settlement, store: useStore }))
        .catch(() => { /* never block the save */ });
    } catch (e) {
      setError(e.message || t('dossierExport.saveFirst.error'));
    } finally {
      setBusy(false);
    }
  }

  // ── The signed-in durable purchase, keyed to this saved dossier ─────────────
  async function runSavedCheckout() {
    setBusy(true); setError(null);
    try {
      await startCheckout('single_dossier', { checkoutToken: createDossierCheckoutToken(), saveId });
      // Redirects on success.
    } catch (e) {
      setError(e.message || t('dossierExport.buySaved.error'));
      setBusy(false);
    }
  }

  // ── State: ANON → the ladder popup ──────────────────────────────────────────
  if (access.reason === 'anon') {
    return (
      <div style={wrapStyle}>
        <Button
          type="button"
          variant="primary"
          size={size}
          icon={<Download size={12} />}
          disabled={!isConfigured}
          onClick={() => { setError(null); setLadderOpen(true); }}
          style={{ minHeight: 44 }}
          title={isConfigured
            ? `Buy this dossier as a PDF for ${SINGLE_DOSSIER.priceLabel}. No account required.`
            : 'Payments are not configured in this environment.'}
        >
          {`Buy this dossier for ${SINGLE_DOSSIER.priceLabel}`}
        </Button>
        <span style={captionStyle}>One-time, no account needed.</span>
        {error && <span style={errStyle}>{error}</span>}
        {ladderOpen && (
          <DossierLadderModal
            busy={busy}
            onClose={() => { if (!busy) setLadderOpen(false); }}
            onCreateAccount={() => { setLadderOpen(false); goSignIn(); }}
            onCartographer={() => { setLadderOpen(false); goPricing(); }}
            onOneTime={runOneTimeCheckout}
          />
        )}
      </div>
    );
  }

  // ── State: signed-in, no export gate, UNSAVED draft → save-first CTA ─────────
  if (access.reason === 'unsaved') {
    return (
      <div style={wrapStyle}>
        <Button
          type="button"
          variant="secondary"
          size={size}
          icon={<Save size={12} />}
          busy={busy}
          onClick={runSaveFirst}
          style={{ minHeight: 44 }}
          title={canSave
            ? t('dossierExport.saveFirst.subline', { price: SINGLE_DOSSIER.priceLabel })
            : t('dossierExport.saveFirst.atCap')}
        >
          {t('dossierExport.saveFirst.cta')}
        </Button>
        <span style={captionStyle}>
          {canSave
            ? t('dossierExport.saveFirst.subline', { price: SINGLE_DOSSIER.priceLabel })
            : t('dossierExport.saveFirst.atCap')}
        </span>
        {error && <span style={errStyle}>{error}</span>}
      </div>
    );
  }

  // ── State: signed-in, no export gate, SAVED, not entitled → durable $2.99 ────
  // (access.reason === 'unpurchased')
  return (
    <div style={wrapStyle}>
      <Button
        type="button"
        variant="secondary"
        size={size}
        icon={<Download size={12} />}
        busy={busy}
        disabled={!isConfigured}
        onClick={runSavedCheckout}
        style={{ minHeight: 44 }}
        title={t('dossierExport.buySaved.subline')}
      >
        {busy
          ? t('dossierExport.buySaved.busy')
          : t('dossierExport.buySaved.cta', { price: SINGLE_DOSSIER.priceLabel })}
      </Button>
      <span style={captionStyle}>{t('dossierExport.buySaved.subline')}</span>
      {error && <span style={errStyle}>{error}</span>}
    </div>
  );
}

// inline-GRID with a single min-content column pins this control to the button's
// intrinsic width; the caption wraps within that width rather than shoving the
// neighbouring Save / Edit / Share buttons off-centre.
const wrapStyle = {
  display: 'inline-grid', gridTemplateColumns: 'min-content', justifyItems: 'center',
  gap: 6, fontFamily: sans,
};
const errStyle = { fontSize: FS.xs, color: RED, textAlign: 'center' };
// BODY (ink-600) is the WCAG-passing helper-text color; MUTED fails 4.5:1 and
// must not carry the price/rationale a purchaser needs.
const captionStyle = { fontSize: FS.xs, color: BODY, textAlign: 'center', lineHeight: 1.4 };
