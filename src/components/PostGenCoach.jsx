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
 * ⭐ THE PAGE OF ORIGIN (owner order, ODQ §934.29). This coach USED TO BE THE ORDER'S
 * OWN EXAMPLE. It was mounted in the App shell (src/App.jsx, beside the sync banners)
 * and self-gated on nothing but "a settlement exists", so one generation left a fixed
 * card floating over the Library, the Gallery, the Compendium, the account page and
 * every legal page until it was dismissed — the pop-up following the reader off the
 * page where its moment happened. It now:
 *   • reads the ACTIVE ROUTE and renders only on its registered origin (/create, where
 *     the world was forged). Leave, and it is gone; come back, and it is there again.
 *   • asks the registry's PAGE BUDGET rather than only its own surface, so it never
 *     stacks beside a higher-priority band on the same page (the first-dossier teaching
 *     callouts outrank it at 60 to 50 and it waits for them to be closed).
 *   • sits INSIDE the page's content flow on a phone instead of floating over the
 *     chrome, and keeps the lifted bottom-right card on the desktop.
 * Only the explicit close retires it, through the device-local sf:guidance:* dismissal,
 * which outlives the route change, the reload and the session (src/lib/guidance.js).
 *
 * Visibility: a settlement is on screen, the route is this whisper's page of origin,
 * the page budget picks this whisper, AND the unified guidance dismissal
 * (sf:guidance:wizard_next_steps) is not set. Renders nothing otherwise. The pure step
 * builder is src/components/generate/nextSteps.js (unit-tested in wizardNextSteps.test.js).
 *
 * @enforced-by tests/domain/guidanceRegistry.walker.test.js (this is the
 *   registered host of the wizard_next_steps whisper — imports guidance + names
 *   the whisper id, so the walker's mounted/wired check passes)
 * @enforced-by tests/lint/guidanceOrigin.walker.test.js (the origin law: every
 *   whisper declares a page, and no guidance host is mounted in the app shell)
 * @enforced-by tests/components/postGenCoach.test.jsx (leave → gone, return → back,
 *   close → gone forever)
 */

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import {
  GOLD, INK, BODY, MUTED, BORDER, CARD, CARD_HDR, sans, serif_, FS, SP, aboveFooter, aboveBottomNav } from './theme.js';
import useIsMobile from '../hooks/useIsMobile.js';
import { useRoute } from '../hooks/useRoute.js';
import Button from './primitives/Button.jsx';
import DialogClose from './primitives/DialogClose.jsx';
import { useDialogDismiss } from './primitives/useDialogFocusTrap.js';
import { buildNextSteps } from './generate/nextSteps.js';
import { isGuidanceDismissed, markGuidanceDismissed } from '../lib/guidance.js';
import {
  selectPageWhisper, deriveGuidanceFirst, deriveGuidanceNewborn,
} from '../domain/display/guidanceRegistry.js';

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

  // The ACTIVE PAGE. The coach asks which route it is on rather than assuming the
  // whole product is its page — the §934.29 cure. `useRoute` is the same
  // useSyncExternalStore subscription the shell uses, so a navigation re-renders
  // this component and the answer below changes with it.
  const { view: route } = useRoute();

  // Read the dismissal once on mount so a fresh dismiss this session doesn't
  // re-hide the coach mid-flow.
  const [alreadyDismissed] = useState(() => isGuidanceDismissed(WHISPER_ID));
  const [step, setStep] = useState(0);
  const [dismissedThisSession, setDismissedThisSession] = useState(false);
  // Escape puts the hint away FOR NOW; only the × retires it (§934.29). The two are
  // deliberately different doors onto the same card: a reader pressing Escape is
  // clearing their screen, not answering "never show me this again". This state dies
  // with the mount, and the mount is keyed to the route (src/App.jsx), so returning to
  // /create brings the hint back exactly as leaving the page does.
  const [hiddenThisVisit, setHiddenThisVisit] = useState(false);
  // ⭐ ESCAPE AND THE WAY BACK (owner order, ODQ §934.31). The coach is NOT modal — it
  // sits in the page's own flow on a phone and beside it on the desktop — so it takes
  // the non-modal half of the lifecycle: Escape dismisses and focus goes back, Tab is
  // never trapped. Trapping here would strand a reader inside a hint about the dossier
  // they are trying to read.
  const cardRef = useDialogDismiss(!hiddenThisVisit, () => setHiddenThisVisit(true));
  // Phone: the card leaves the chrome entirely and sits in the page's own scroll
  // flow (§934.29), so it can never cover the bottom bar or the hero. Desktop keeps
  // the lifted bottom-right card.
  const isMobile = useIsMobile();

  if (alreadyDismissed) return null;
  if (dismissedThisSession) return null;
  if (hiddenThisVisit) return null;
  if (!settlement) return null;

  // ⭐ THE PAGE BUDGET decides, not this component. Off its origin route the registry
  // returns something else (or nothing) and the coach renders nothing; on /create it
  // yields to any higher-priority unbidden whisper rather than stacking beside it.
  // Every signal here is derived from store fields this component already reads.
  const savedCount = Array.isArray(savedSettlements) ? savedSettlements.length : 0;
  const pageWhisper = selectPageWhisper(route, {
    isDismissed: isGuidanceDismissed,
    firstAvailable: (key) => deriveGuidanceFirst(key, { hasSettlement: !!settlement, savedCount }),
    isNewborn: deriveGuidanceNewborn(savedCount),
    data: { tier: authTier, savedCount, hasSettlement: !!settlement },
  });
  if (pageWhisper?.id !== WHISPER_ID) return null;

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

  // THE DESKTOP CARD — lifted bottom-right chrome. The COACH layer (900). The feedback
  // panel (FeedbackWidget) sits one step above at 910 so, when both bottom-right panels
  // are shown together, stacking is deterministic (M10). See the Z_LAYERS manifest
  // (scripts/.ui-a11y-contract.json). aboveFooter lifts it over the pinned footer (owner
  // order 2026-09-16) and aboveBottomNav clears the bottom bar from 640 to 1023 px (0px
  // from 1024 up).
  const floating = {
    position: 'fixed',
    bottom: aboveFooter(aboveBottomNav(24)), right: 24, zIndex: 900,
    width: 340, maxWidth: 'calc(100vw - 48px)',
  };
  // THE PHONE CARD — in the page's own scroll container (§934.29). No fixed position, so
  // there is no bottom bar to clear and no hero to cover: it is part of the page, and it
  // leaves with the page. `bottomClearance`/`CHROME.fabLift` went with the fixed phone
  // branch; the bottom-anchored-chrome census still reads ONE lifted site here (the
  // desktop card above), which is what its register claims.
  const inPage = {
    position: 'relative',
    width: '100%', marginTop: SP.xl, marginBottom: SP.md,
  };

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-labelledby="postgen-coach-title"
      tabIndex={-1}
      style={{
        ...(isMobile ? inPage : floating),
        background: CARD,
        border: `1px solid ${BORDER}`,
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
        {/* ⭐ THE SAME DOOR AS EVERY OTHER POP-UP (owner order, ODQ §934.31). This hint's
            explicit dismissal IS a dialog close, so it wears the house control rather
            than a private label: "Dismiss what's next" named a verb no other surface
            used, and a reader cannot learn an exit that is worded once. Closing here is
            still the ONLY thing that retires the hint (§934.29) — Escape and navigation
            put it away for now, the × puts it away for good. */}
        <DialogClose onClose={close} tone="default" />
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
              background: `${GOLD}18`, border: `1px solid ${GOLD}`,
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
