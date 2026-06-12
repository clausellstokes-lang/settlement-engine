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

const PURPLE = '#6a2a9a';
const PURPLE_BG = 'rgba(90,42,138,0.08)';

export default function StaleNarrativeModal({
  open,
  changeLabel,  // short human-readable description of the applied change (e.g. "Kill / remove NPC", "3 changes")
  onClose,      // () => dismiss; the applied change is untouched
}) {
  const activeSaveId     = useStore(s => s.activeSaveId);
  const requestNarrative = useStore(s => s.requestNarrative);
  if (!open) return null;

  const cost = CREDIT_COSTS.narrative;
  const onRegenerate = () => {
    onClose();
    requestNarrative(activeSaveId);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(12,8,4,0.58)', backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 18,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
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
          <button
            onClick={onClose}
            aria-label={t('staleNarrative.ariaClose')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4, display: 'flex' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px', fontFamily: sans, fontSize: FS.sm, color: SECOND, lineHeight: 1.55 }}>
          <p style={{ margin: 0 }}>
            {t('staleNarrative.body')}
          </p>
        </div>

        {/* Options — exactly two. The change stays applied either way. */}
        <div style={{ padding: '0 18px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Regenerate */}
          <button
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

          {/* Continue with raw simulation */}
          <button
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
