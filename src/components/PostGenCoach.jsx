/**
 * PostGenCoach.jsx — the post-generate what's-next coach (C4 revival).
 *
 * THE COMPONENT SWAP (deep-craft C4, panel D): master's PostGenCoach is the
 * base-of-record host for the post-generate guidance. W-GUIDE-1 had retired it
 * and rehomed its what's-next content into the guidance registry as the single
 * `wizard-postgen` whisper (guidance.wizardNextSteps), rendered by a standalone
 * in-page card (WizardNextSteps). C4 revives PostGenCoach as the HOST of that
 * one whisper — a registry COMPONENT SWAP, not a second guidance surface: the
 * registry still keeps exactly one whisper on `wizard-postgen`, and this coach
 * is the component that renders it. The standalone WizardNextSteps card is
 * deleted (its behaviour survives here; see the census in the C4 report).
 *
 * NOT re-absorbed: the read-the-dossier / watch-it-simulated / save-it teaching
 * stays consolidated on the DOSSIER surface (FirstDossierCallouts + the three
 * postgen_* whispers). This coach carries ONLY the forward "what's next" moves
 * (save → export → refine → place), one idea per stepped panel, so the swap does
 * not duplicate the dossier band's teaching across two surfaces.
 *
 * MATERIALS: rendered in the deep-craft idiom (light parchment plate, rule
 * frame, ramp tones) — the same material tokens the WizardNextSteps card used —
 * NOT master's dark-ink rgba-wash floating card, which the kill-list forbids.
 *
 * Visibility: a settlement is on screen AND the unified guidance dismissal
 * (sf:guidance:wizard_next_steps) is not set. Renders nothing otherwise, so it
 * is safe to mount unconditionally at the App level. The pure step builder is
 * src/components/generate/nextSteps.js (unit-tested in wizardNextSteps.test.js).
 *
 * @enforced-by tests/domain/guidanceRegistry.walker.test.js (this is the
 *   registered host of the wizard_next_steps whisper — imports guidance + names
 *   the whisper id, so the walker's mounted/wired check passes)
 */

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import {
  GOLD, GOLD_BG, INK, BODY, MUTED, BORDER, CARD, CARD_HDR, sans, serif_, FS, SP, R,
} from './theme.js';
import Button from './primitives/Button.jsx';
import IconButton from './primitives/IconButton.jsx';
import { buildNextSteps } from './generate/nextSteps.js';
import { isGuidanceDismissed, markGuidanceDismissed } from '../lib/guidance.js';

// The wizard-postgen whisper this coach hosts (the guidance-registry id + the
// unified dismissal stem). Naming it here is also what the walker's host-wired
// check reads (import of lib/guidance + a reference to the whisper id).
const WHISPER_ID = 'wizard_next_steps';

export default function PostGenCoach() {
  const settlement = useStore(s => s.settlement);
  // The save step's framing reads the same save/auth state the pure builder uses.
  const canSave = useStore(s => s.canSave());
  const authTier = useStore(s => s.auth?.tier);
  const activeSaveId = useStore(s => s.activeSaveId);
  const savedSettlements = useStore(s => s.savedSettlements);

  // Read the dismissal once on mount so a fresh dismiss this session doesn't
  // re-hide the coach mid-flow.
  const [alreadyDismissed] = useState(() => isGuidanceDismissed(WHISPER_ID));
  const [step, setStep] = useState(0);
  const [dismissedThisSession, setDismissedThisSession] = useState(false);

  if (alreadyDismissed) return null;
  if (dismissedThisSession) return null;
  if (!settlement) return null;

  // Each forward "what's next" move (save, export, refine, place) is its own
  // panel — one idea per screen. "Generate another" is the builder's detached
  // footer (it throws the work away rather than building on it), so it is not a
  // coach step, mirroring the standalone card it replaces.
  const signedIn = !!authTier && authTier !== 'anon';
  const saved = activeSaveId != null
    || (Array.isArray(savedSettlements)
        && savedSettlements.some(e => e?.name === settlement.name && e?.tier === settlement.tier));
  const guide = buildNextSteps({ settlement, canSave, signedIn, saved });
  const panels = guide.steps.map((s2, i) => ({ label: s2.label, hint: s2.hint, primary: i === 0 }));
  const total = panels.length;
  const safeStep = Math.min(step, total - 1);
  const cur = panels[safeStep];
  const isLast = safeStep === total - 1;

  function close() {
    markGuidanceDismissed(WHISPER_ID);
    setDismissedThisSession(true);
  }
  function next() {
    if (isLast) { close(); return; }
    setStep(s => s + 1);
  }
  function back() {
    if (step > 0) setStep(s => s - 1);
  }

  return (
    <div
      role="dialog"
      aria-labelledby="postgen-coach-title"
      style={{
        position: 'fixed',
        bottom: 24, right: 24, zIndex: 900,
        width: 340, maxWidth: 'calc(100vw - 48px)',
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: R.lg,
        boxShadow: '0 2px 10px rgba(27,20,8,0.08)',
        fontFamily: sans, color: INK,
        overflow: 'hidden',
      }}
    >
      {/* Header — the rubric row (what's next / this dossier's identity) + close. */}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: SP.sm,
        padding: `${SP.sm + 1}px ${SP.lg}px`,
        background: CARD_HDR,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{
          fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK,
        }}>
          What&rsquo;s next
        </span>
        <span style={{ fontSize: FS.xs, color: MUTED, flex: 1, minWidth: 0 }}>
          {guide.headline}
        </span>
        <IconButton
          Icon={X}
          label="Dismiss what's next"
          onClick={close}
          tone="default"
          size="lg"
        />
      </div>

      {/* Body — one forward move per panel. */}
      <div style={{ padding: `${SP.md}px ${SP.lg}px ${SP.lg}px` }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.sm,
        }}>
          {/* Gold step-number badge — the single tinted accent (matches the
              standalone card's badge). */}
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 20, height: 20, borderRadius: '50%',
              background: GOLD_BG, border: `1px solid ${GOLD}`,
              color: GOLD, fontSize: FS.xs, fontWeight: 700, lineHeight: 1,
            }}
          >
            {safeStep + 1}
          </span>
          <span style={{
            fontSize: FS.xxs, fontWeight: 700, color: MUTED,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Step {safeStep + 1} of {total}
          </span>
        </div>

        <h3 id="postgen-coach-title" style={{
          margin: 0, fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK,
        }}>
          {cur.label}
        </h3>
        {/* The first forward move (Save) reads as the key next step — a gold
            left-rule + weight; the rest are quiet rows. */}
        <p style={{
          margin: `${SP.sm}px 0 0`, fontSize: FS.sm,
          color: cur.primary ? INK : BODY,
          fontWeight: cur.primary ? 600 : 400,
          lineHeight: 1.55,
          ...(cur.primary ? { paddingLeft: SP.md, borderLeft: `2px solid ${GOLD}` } : null),
        }}>
          {cur.hint}
        </p>

        {/* Actions */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: SP.sm, marginTop: SP.lg,
        }}>
          {step > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={back}
              icon={<ChevronLeft size={12} />}
            >
              Back
            </Button>
          )}
          <span style={{ flex: 1 }} />
          {/* Always-present escape hatch from any step. */}
          <Button
            variant="ghost"
            size="sm"
            onClick={close}
            style={{ color: MUTED }}
          >
            {t('onboarding.coach.dismiss')}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={next}
            icon={isLast ? <Check size={12} /> : undefined}
            trailingIcon={isLast ? undefined : <ChevronRight size={12} />}
          >
            {isLast ? 'Done' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
