/**
 * NarrativeDriftModal — Gate for structural/seismic edits on a narrated save.
 *
 * When the user tries to change something that the AI narrative reasons ABOUT
 * (add/remove institution, stressor, trade good, resource, priorities, tier,
 * etc.), a mechanical search-and-replace can't keep the prose honest. The
 * narrative claims are rooted in the old facts.
 *
 * Per design decision 4 (kill "leave stale"), the user isn't allowed to just
 * silently drift — they must pick an explicit resolution at the moment of
 * the edit:
 *
 *   • Regenerate → apply the edit, then re-run the full narrative pipeline
 *                  from scratch on the new settlement state.
 *   • Progress   → apply the edit, then evolve the existing narrative using
 *                  the previous narrative as a seed plus a diff describing
 *                  what changed. More expensive than regenerate but preserves
 *                  voice, named NPCs, and thematic throughlines. Hidden when
 *                  the change class is seismic (too much has shifted to evolve
 *                  responsibly — the user must regenerate).
 *   • Revert     → apply the edit, then clear the narrative entirely.
 *                  Zero credit cost; the save goes back to showing raw data.
 *   • Cancel     → back out of the edit.
 */

import { Sparkles, RotateCcw, X, Zap, GitBranch } from 'lucide-react';
import { CREDIT_COSTS } from '../store/creditsSlice.js';
import { t } from '../copy/index.js';
import { INK, MUTED, SECOND, BORDER, CARD, sans, FS, ELEV } from './theme.js';
import { flag } from '../lib/flags.js';

const PURPLE = '#6a2a9a';
const PURPLE_BG = 'rgba(90,42,138,0.08)';
const PURPLE_LIGHT = '#8a4ab8';

export default function NarrativeDriftModal({
  open,
  changeLabel,      // short human-readable description of the pending edit
  changeClass,      // 'structural' | 'seismic'
  onRegenerate,     // async () => apply edit, then regen
  onProgress,       // async () => apply edit, then evolve narrative (AI-4). Optional.
  onRevert,         // async () => apply edit, then revert to raw
  onCancel,         // () => back out
  progressionCost,  // credits for a progression run; shown in the button sub-label
}) {
  if (!open) return null;

  const isSeismic = changeClass === 'seismic';
  const cost = CREDIT_COSTS.narrative;
  // Progress is only offered for structural changes (not seismic) and only when
  // the caller wired up a handler. Seismic changes shift too much of the world
  // to evolve responsibly — the user needs to regenerate.
  const showProgress = !!onProgress && !isSeismic;
  const progCost = typeof progressionCost === 'number' ? progressionCost : CREDIT_COSTS.progression;

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
      onClick={onCancel}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10,
          boxShadow: flag('elevationTokens') ? ELEV[3] : '0 8px 40px rgba(0,0,0,0.5)',
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
              {isSeismic ? t('narrativeDrift.headingSeismic') : t('narrativeDrift.headingStructural')}
            </div>
            <div style={{ fontSize: FS.xxs, color: MUTED, marginTop: 2, fontFamily: sans }}>
              {changeLabel}
            </div>
          </div>
          <button
            onClick={onCancel}
            aria-label={t('narrativeDrift.ariaCancel')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4, display: 'flex' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '14px 18px', fontFamily: sans, fontSize: FS.sm, color: SECOND, lineHeight: 1.55 }}>
          <p style={{ margin: 0, marginBottom: 10 }}>
            {t('narrativeDrift.body')}
          </p>
          <p style={{ margin: 0, color: MUTED, fontSize: FS.xs }}>
            {t('narrativeDrift.pickOne')}
          </p>
        </div>

        {/* Options */}
        <div style={{ padding: '0 18px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Regenerate */}
          <button
            onClick={onRegenerate}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 6,
              background: `linear-gradient(135deg, ${PURPLE}, #4a1a7a)`,
              border: `1px solid rgba(160,100,220,0.55)`,
              color: '#f0d8ff', fontFamily: sans,
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <Zap size={14} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: FS.sm, fontWeight: 800, letterSpacing: '0.02em' }}>{t('narrativeDrift.regenerateTitle')}</div>
              <div style={{ fontSize: FS.xxs, marginTop: 2, opacity: 0.82 }}>
                {t('narrativeDrift.regenerateBody', { cost })}
              </div>
            </div>
          </button>

          {/* Progress (AI-4): evolve the existing narrative rather than
              rewriting from scratch. Hidden for seismic changes and when
              the caller didn't wire a handler. */}
          {showProgress && (
            <button
              onClick={onProgress}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 6,
                background: `linear-gradient(135deg, ${PURPLE_LIGHT}, ${PURPLE})`,
                border: `1px solid rgba(180,120,230,0.5)`,
                color: '#f4e4ff', fontFamily: sans,
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <GitBranch size={14} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: FS.sm, fontWeight: 800, letterSpacing: '0.02em' }}>
                  {t('narrativeDrift.progressTitle', { cost: progCost })}
                </div>
                <div style={{ fontSize: FS.xxs, marginTop: 2, opacity: 0.86 }}>
                  {t('narrativeDrift.progressBody')}
                </div>
              </div>
            </button>
          )}

          {/* Revert */}
          <button
            onClick={onRevert}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 6,
              background: CARD,
              border: `1px solid ${BORDER}`,
              color: SECOND, fontFamily: sans,
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <RotateCcw size={14} color={PURPLE}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, letterSpacing: '0.02em' }}>{t('narrativeDrift.revertTitle')}</div>
              <div style={{ fontSize: FS.xxs, marginTop: 2, color: MUTED }}>
                {t('narrativeDrift.revertBody')}
              </div>
            </div>
          </button>

          {/* Cancel */}
          <button
            onClick={onCancel}
            style={{
              padding: '7px 10px', borderRadius: 5,
              background: 'transparent', border: 'none',
              color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 600,
              cursor: 'pointer', alignSelf: 'center',
              textDecoration: 'underline',
            }}
          >
            {t('narrativeDrift.cancelLabel')}
          </button>
        </div>
      </div>
    </div>
  );
}
