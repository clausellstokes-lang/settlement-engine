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
 *     chrome. (It kept a lifted bottom-right card on the desktop until REVIEW-P F5
 *     measured what that box costs the reader; see THE DOCK below.)
 * Only the explicit close retires it, through the device-local sf:guidance:* dismissal,
 * which outlives the route change, the reload and the session (src/lib/guidance.js).
 *
 * ⭐ THE COACH WAITS FOR THE FORGE (REVIEW-P F5, ODQ §934.63). The mount used to ask only
 * "is a settlement on screen". The settlement lands in the store at ~785 ms, while the forge's
 * sixteen-step named rail still has some seven seconds of DELIBERATE PACING to play (the
 * owner's positioning law: generation is milliseconds, the 3-10 s forge is the pacing, and
 * speed is never conceded). So the card announced "<town> is ready. STEP 1 OF 4" over the
 * establishing painting while the rail was on step 2 of 16 — a claim that was false when it
 * was made, and a reveal spent before it landed. The coach now reads the forge's OWN
 * completion signal, the store's `pipelineRevealActive`, which PipelineReveal clears through
 * dismissPipelineReveal() when its playback reaches the readable end. No timer and no duration
 * constant is read here: the coach becomes visible on exactly the field the DOSSIER appears
 * on (GenerateWizard.jsx `dossierVisible`), so the hint can never outrun the thing it hints at.
 *
 * ⭐ THE DOCK (REVIEW-P F5/F6, ODQ §934.63). The card sits in the page's own flow at EVERY
 * width, capped to the dossier's own column (PAGE_MAX) and centred on it, so it lands BELOW
 * the reading column and cannot cover it. The old fixed desktop box (position: fixed, z 900,
 * 340 wide at right: 24) overlapped live dossier prose by 244 px at 1440x900 and by its whole
 * 340 px width at 1024: the reading column is [120,1320] and [24,1000] at those rungs, the card
 * was [1076,1416] and [660,1000]. There was no placement to move it to — a viewport-anchored
 * card clears a CENTRED column only when the column is under 712 px at 1440 and under 616 px at
 * 1024, and it is 1200 and 976 — and insetting the column instead would have cost the reader
 * 20%, then 35%, of the dossier's width for a dismissible hint.
 *   It is a `region`, not a `dialog`. An in-flow, non-modal, untrapped card is the shape of
 * FirstDossierCallouts, its own higher-priority sibling on this surface, while role="dialog"
 * is this estate's MODAL marker (CommandPalette and WorldMap both discriminate on
 * [role="dialog"][aria-modal="true"]). On the phone the old role sat on a card at rect
 * top 2,857 and off-screen, which is REVIEW-P F6.
 *
 * Visibility: a settlement is on screen, THE FORGE'S REVEAL HAS FINISHED, the route is this
 * whisper's page of origin, the page budget picks this whisper, AND the unified guidance
 * dismissal (sf:guidance:wizard_next_steps) is not set. Renders nothing otherwise. The pure
 * step builder is src/components/generate/nextSteps.js (unit-tested in wizardNextSteps.test.js).
 *
 * @enforced-by tests/domain/guidanceRegistry.walker.test.js (this is the
 *   registered host of the wizard_next_steps whisper — imports guidance + names
 *   the whisper id, so the walker's mounted/wired check passes)
 * @enforced-by tests/lint/guidanceOrigin.walker.test.js (the origin law: every
 *   whisper declares a page, and no guidance host is mounted in the app shell)
 * @enforced-by tests/components/postGenCoach.test.jsx (leave → gone, return → back,
 *   close → gone forever; and the two REVIEW-P laws: absent while the reveal runs,
 *   present once it clears, and in the page flow at both desktop rungs)
 * @enforced-by tests/lint/bottomAnchoredChrome.walker.test.js (this file names NO
 *   bottom-anchored fixed site any more; re-adding one reds there)
 */

import { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import {
  GOLD, INK, BODY, MUTED, BORDER, CARD, CARD_HDR, sans, serif_, FS, SP, PAGE_MAX } from './theme.js';
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
import { chromeFontSize } from '../design/proseScale.js';

// The wizard-postgen whisper this coach hosts (the guidance-registry id + the
// unified dismissal stem). Naming it here is also what the walker's host-wired
// check reads (import of lib/guidance + a reference to the whisper id).
const WHISPER_ID = 'wizard_next_steps';

export default function PostGenCoach() {
  const mobile = useIsMobile();
  const settlement = useStore(s => s.settlement);
  // The save step's framing reads the same save/auth state the pure builder uses.
  const canSave = useStore(s => s.canSave());
  const authTier = useStore(s => s.auth?.tier);
  const activeSaveId = useStore(s => s.activeSaveId);
  const savedSettlements = useStore(s => s.savedSettlements);
  // ⭐ THE FORGE'S OWN COMPLETION SIGNAL (see THE COACH WAITS FOR THE FORGE above). The
  // generate action arms this the moment the engine returns; PipelineReveal is its only
  // consumer and clears it through dismissPipelineReveal() when playback reaches the
  // readable end, so `false` means "the reveal has finished" and never "no reveal ran"
  // mid-forge. GenerateWizard reads the same field to decide the dossier is visible.
  const pipelineRevealActive = useStore(s => s.pipelineRevealActive);

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
  // sits in the page's own flow at every width (THE DOCK, above) — so it takes
  // the non-modal half of the lifecycle: Escape dismisses and focus goes back, Tab is
  // never trapped. Trapping here would strand a reader inside a hint about the dossier
  // they are trying to read.
  const cardRef = useDialogDismiss(!hiddenThisVisit, () => setHiddenThisVisit(true));

  if (alreadyDismissed) return null;
  if (dismissedThisSession) return null;
  if (hiddenThisVisit) return null;
  if (!settlement) return null;
  // ⛔ AND NOT WHILE THE FORGE IS STILL SPEAKING (REVIEW-P F5). The settlement exists
  // long before the reveal has said what it exists as; announcing "it is ready" over the
  // establishing painting both lies and spends the reveal. This gate is the whole cure.
  if (pipelineRevealActive) return null;

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

  // THE DOCK — one card, in the page's own scroll container, at every width (§934.29 for
  // the phone; REVIEW-P F5 for the desktop, see THE DOCK in this file's header). It is
  // capped to PAGE_MAX and centred, which is the SAME frame GenerateWizard gives the
  // dossier body (`maxWidth: PAGE_MAX, margin: '0 auto'`), so the card lands directly below
  // the reading column and shares its measure instead of covering it. On a phone the cap is
  // inert (the container is narrower than it), so the phone rendering is byte-for-byte the
  // box it already had. No fixed position anywhere here: no bottom bar to clear, no footer
  // to lift over, and no layer to claim — which is why the bottom-anchored-chrome census and
  // the Z_LAYERS M10 pairing both lose their row for this file.
  const dock = {
    position: 'relative',
    width: '100%', maxWidth: PAGE_MAX, marginLeft: 'auto', marginRight: 'auto',
    marginTop: SP.xl, marginBottom: SP.md,
  };

  return (
    <div
      ref={cardRef}
      // A `region`, not a `dialog` (REVIEW-P F6). See THE DOCK in the header: the estate
      // spends role="dialog" on modals and trapped popovers, and its in-flow guidance shape
      // is FirstDossierCallouts' labelled region. The name is the card's own stable rubric,
      // not the step heading, which changes under the reader as they page through.
      role="region"
      aria-label="What is next for this dossier"
      tabIndex={-1}
      style={{
        ...dock,
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
        <span style={{ fontSize: chromeFontSize(FS.xs, mobile), color: MUTED, flex: 1, minWidth: 0 }}>
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
              color: GOLD, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700, lineHeight: 1,
            }}
          >
            {safeStep + 1}
          </span>
          <span style={{
            fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 700, color: MUTED,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Step {safeStep + 1} of {total}
          </span>
        </div>

        {/* No id here any more: it existed only as the old dialog's aria-labelledby
            target, and the region above names itself with a rubric that does not change
            under the reader. A dangling id that used to be an aria target is exactly the
            rot the next reader would trust. */}
        <h3 style={{
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
