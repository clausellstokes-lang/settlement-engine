/**
 * StaleNarrativeModal — post-apply notice that the AI narrative is out of date.
 *
 * Fires AFTER an event (or batch) has committed on a narrated save. The
 * change is already applied and stays applied — this modal never gates or
 * reverts anything. Its predecessor (NarrativeDriftModal, removed with the
 * Roster & Tune editor in 86fffff) gated BEFORE the edit and offered
 * Progress / Revert / Cancel; those options are gone on purpose. After the
 * fact there are exactly two honest choices:
 *
 *   • Regenerate narrative        → re-run the narrative pipeline against
 *                                   the new settlement state (spends credits).
 *   • Continue with raw simulation → no AI call; the dossier shows the raw
 *                                   simulation until a later regenerate.
 *
 * Store-read like its caller (EventComposer is prop-less): activeSaveId and
 * requestNarrative come off the store; the caller only controls visibility
 * and the human-readable label of what just changed.
 */

import { Sparkles, X, Zap, ArrowRight } from 'lucide-react';
import { useStore } from '../store/index.js';
import { CREDIT_COSTS } from '../store/creditsSlice.js';
import { t } from '../copy/index.js';
import { INK, MUTED, SECOND, BORDER, CARD, sans, FS, ELEV, swatch } from './theme.js';
import IconButton from './primitives/IconButton.jsx';
import useDialogFocusTrap from './primitives/useDialogFocusTrap.js';

const PURPLE = swatch['#6A2A9A'];
const PURPLE_BG = 'rgba(90,42,138,0.08)';

export default function StaleNarrativeModal({
  open,
  changeLabel,  // short human-readable description of the applied change (e.g. "Kill / remove NPC", "3 changes")
  onClose,      // () => dismiss; the applied change is untouched
}) {
  const activeSaveId     = useStore(s => s.activeSaveId);
  const requestNarrative = useStore(s => s.requestNarrative);
  // Shared modal focus management: focus in on open, trap Tab, Escape dismisses
  // via onClose, focus restored to the trigger on close. Matches the primitives
  // contract behind aria-modal so this destructive-adjacent choice modal behaves
  // like every other dialog. Called before the early return to honour rules-of-hooks.
  const dialogRef = useDialogFocusTrap(open, onClose);
  if (!open) return null;

  const cost = CREDIT_COSTS.narrative;
  const onRegenerate = () => {
    onClose();
    requestNarrative(activeSaveId);
  };

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(12,8,4,0.58)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 18,
      }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('staleNarrative.heading')}
        tabIndex={-1}
        style={{
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
          boxShadow: ELEV[3],
          maxWidth: 480, width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '14px 18px',
          background: `linear-gradient(135deg, ${PURPLE_BG}, rgba(90,42,138,0.02))`,
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Sparkles size={16} color={PURPLE} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: FS.md, fontWeight: 800, color: INK, fontFamily: sans, letterSpacing: '0.02em' }}>
              {t('staleNarrative.heading')}
            </div>
            <div style={{ fontSize: FS.xxs, color: MUTED, marginTop: 2, fontFamily: sans }}>
              {changeLabel}
            </div>
          </div>
          <IconButton
            Icon={X}
            label={t('staleNarrative.ariaClose')}
            onClick={onClose}
            tone="ghost"
            size="md"
          />
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px', fontFamily: sans, fontSize: FS.sm, color: SECOND, lineHeight: 1.55 }}>
          <p style={{ margin: 0 }}>
            {t('staleNarrative.body')}
          </p>
        </div>

        {/* Options — exactly two. The change stays applied either way. */}
        <div style={{ padding: '0 18px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Regenerate — bespoke option card (leading icon + stacked title/body
              rows, left-aligned); the Button primitive's centered single-line
              layout can't express it, so it stays raw. */}
          <button
            type="button"
            onClick={onRegenerate}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 6,
              background: `linear-gradient(135deg, ${PURPLE}, #4a1a7a)`,
              border: `1px solid rgba(160,100,220,0.55)`,
              color: swatch['#F0D8FF'], fontFamily: sans,
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <Zap size={14} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: FS.sm, fontWeight: 800, letterSpacing: '0.02em' }}>{t('staleNarrative.regenerateTitle')}</div>
              <div style={{ fontSize: FS.xxs, marginTop: 2, opacity: 0.82 }}>
                {t('staleNarrative.regenerateBody', { cost })}
              </div>
            </div>
          </button>

          {/* Continue with raw simulation — bespoke option card (same stacked
              title/body layout as Regenerate); kept raw for the same reason. */}
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 6,
              background: CARD,
              border: `1px solid ${BORDER}`,
              color: SECOND, fontFamily: sans,
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <ArrowRight size={14} color={PURPLE} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, letterSpacing: '0.02em' }}>{t('staleNarrative.continueTitle')}</div>
              <div style={{ fontSize: FS.xxs, marginTop: 2, color: MUTED }}>
                {t('staleNarrative.continueBody')}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
