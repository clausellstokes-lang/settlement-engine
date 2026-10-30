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
 *     chrome; on the desktop it is the owner's small corner card (THE CORNER CARD below).
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
 * ⭐ THE CORNER CARD (the owner, 2026-10-30, in chat, verbatim: "fix the 'What's next /
 * [settlement] is ready.' that is supposed to be a relatively small floating and movable
 * pop-up … at the corner of the window"). The owner re-decided the September dock. From
 * 1024 px up the card is position: fixed, 280 px wide, bottom-right, lifted over the pinned
 * footer's band (and the 640-1023 bottom bar) through aboveFooter(aboveBottomNav(...)), on
 * the `coach` layer (900) one step under the feedback panel (910) that opens in the same
 * corner, so the panel the reader summoned is always on top. It carries the headline, the
 * current step (title and one line), back / next and the house close: one idea per panel. A
 * click on the header, or Escape, folds it to a one-line pill ("{name} is ready · What's
 * next") that unfolds on click; the fold is per visit. The header is a drag handle (pointer
 * events, mouse and touch), the card is clamped 8 px inside the viewport and re-clamped on
 * resize, and where it was dropped is remembered per device under
 * sf:guidance:wizard_next_steps:pos, beside the dismissal. Below 1024 px the card stays in
 * the page's own flow, capped to PAGE_MAX and centred under the dossier (REVIEW-P F6: the
 * old floating card sat at rect top 2,857, off-screen on a phone).
 *   History, one line: REVIEW-P F5/F6 (ODQ §934.63) had docked the card in the page flow at
 * every width because a fixed 340 px box covered 244 px of the 1440 reading column and 340 px
 * at 1024; the owner's 2026-10-30 word answers that with a smaller, foldable, movable card.
 *   It is a `region`, not a `dialog`. A non-modal, untrapped card is the shape of
 * FirstDossierCallouts, its own higher-priority sibling on this surface, while role="dialog"
 * is this estate's MODAL marker (CommandPalette and WorldMap both discriminate on
 * [role="dialog"][aria-modal="true"]).

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
 *   close → gone forever; absent while the reveal runs, present once it clears; the
 *   corner card fixed and lifted at 1440 and 1024, its fold, drag, clamp and memory;
 *   the phone card in the page flow)
 * @enforced-by tests/lint/bottomAnchoredChrome.walker.test.js (this file holds exactly
 *   one LIFTED bottom-anchored site, the corner card's default anchor)
 */

import { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useStore } from '../store/index.js';
import { t } from '../copy/index.js';
import {
  GOLD, INK, BODY, MUTED, BORDER, CARD, CARD_HDR, sans, serif_, FS, SP, PAGE_MAX,
  aboveFooter, aboveBottomNav } from './theme.js';
import useIsMobile from '../hooks/useIsMobile.js';
import { useRoute } from '../hooks/useRoute.js';
import Button from './primitives/Button.jsx';
import DialogClose from './primitives/DialogClose.jsx';
import { useDialogDismiss } from './primitives/useDialogFocusTrap.js';
import { buildNextSteps } from './generate/nextSteps.js';
import { isGuidanceDismissed, markGuidanceDismissed, guidanceDismissalKey } from '../lib/guidance.js';
import {
  selectPageWhisper, deriveGuidanceFirst, deriveGuidanceNewborn,
} from '../domain/display/guidanceRegistry.js';
import { chromeFontSize } from '../design/proseScale.js';

// The wizard-postgen whisper this coach hosts (the guidance-registry id + the
// unified dismissal stem). Naming it here is also what the walker's host-wired
// check reads (import of lib/guidance + a reference to the whisper id).
const WHISPER_ID = 'wizard_next_steps';

// THE CORNER CARD (the owner, 2026-10-30). From this width up the coach is a small fixed
// card in the bottom-right corner; below it the card keeps the September in-flow dock.
const DESKTOP_MIN = 1024;
const CARD_W = 280;
const CORNER = SP.lg;

// ── THE CARD MOVES (the owner, 2026-10-30: "floating and movable") ──────────────────
// Where the reader put the card is remembered per device, beside the dismissal and in
// its idiom (src/lib/guidance.js): one sf:guidance:* key, every access try/caught so a
// blocked localStorage never throws into render. The value is the card's top-left in
// viewport px; a missing or malformed value means "the default corner".
const POS_KEY = `${guidanceDismissalKey(WHISPER_ID)}:pos`;
const EDGE = 8;

function readCornerPos() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(POS_KEY) : null;
    if (!raw) return null;
    const v = JSON.parse(raw);
    return Number.isFinite(v?.left) && Number.isFinite(v?.top) ? { left: v.left, top: v.top } : null;
  } catch {
    return null;
  }
}

function writeCornerPos(p) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(POS_KEY, JSON.stringify(p));
  } catch {
    /* storage unavailable: the card stays where it is for this visit */
  }
}

/** Keep a w x h box EDGE px inside the viewport on every side. */
function clampToViewport(p, w, h) {
  const maxLeft = Math.max(EDGE, window.innerWidth - w - EDGE);
  const maxTop = Math.max(EDGE, window.innerHeight - h - EDGE);
  return {
    left: Math.round(Math.min(Math.max(EDGE, p.left), maxLeft)),
    top: Math.round(Math.min(Math.max(EDGE, p.top), maxTop)),
  };
}

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
  // THE FOLD (the owner, 2026-10-30). On the desktop corner card, Escape and a click on
  // the header fold the card to a one-line pill instead of hiding it; the pill unfolds
  // on click. Per visit, like the step: it dies with the route-keyed mount.
  const [collapsed, setCollapsed] = useState(false);
  // Below 1024 px the card stays in the page flow (REVIEW-P F6: a floating card sat
  // off-screen on a phone); from 1024 px up it is the corner card.
  const phone = useIsMobile(DESKTOP_MIN);

  // ── The gates, evaluated before the dismiss hook so Escape is armed only while the
  // card is actually on screen (an Escape pressed during the forge must not fold or
  // hide a card the reader has not yet seen).
  // ⛔ NOT WHILE THE FORGE IS STILL SPEAKING (REVIEW-P F5). The settlement exists long
  // before the reveal has said what it exists as; announcing "it is ready" over the
  // establishing painting both lies and spends the reveal. That gate is the whole cure.
  // ⭐ THE PAGE BUDGET decides, not this component. Off its origin route the registry
  // returns something else (or nothing) and the coach renders nothing; on /create it
  // yields to any higher-priority unbidden whisper rather than stacking beside it.
  // Every signal here is derived from store fields this component already reads.
  const savedCount = Array.isArray(savedSettlements) ? savedSettlements.length : 0;
  const pageWhisper = settlement && !pipelineRevealActive
    ? selectPageWhisper(route, {
      isDismissed: isGuidanceDismissed,
      firstAvailable: (key) => deriveGuidanceFirst(key, { hasSettlement: !!settlement, savedCount }),
      isNewborn: deriveGuidanceNewborn(savedCount),
      data: { tier: authTier, savedCount, hasSettlement: !!settlement },
    })
    : null;
  const shown = !alreadyDismissed && !dismissedThisSession && !hiddenThisVisit
    && pageWhisper?.id === WHISPER_ID;
  const corner = shown && !phone;

  // ⭐ ESCAPE AND THE WAY BACK (owner order, ODQ §934.31). The coach is NOT modal, so it
  // takes the non-modal half of the lifecycle: Escape answers and focus goes back, Tab is
  // never trapped. Trapping here would strand a reader inside a hint about the dossier
  // they are trying to read. On the corner card Escape folds it; on the phone card it
  // puts the card away for this visit.
  const cardRef = useDialogDismiss(
    shown && !(corner && collapsed),
    () => (corner ? setCollapsed(true) : setHiddenThisVisit(true)),
  );

  // Where the reader dragged the card (null: the default corner). Read once per mount.
  const [pos, setPos] = useState(readCornerPos);
  // True for the one click that ends a drag, so dropping the card is not also a fold.
  const swallowClickRef = useRef(false);
  // The live drag's teardown, so an unmount mid-drag leaves no window listener behind.
  const endDragRef = useRef(null);
  useEffect(() => () => endDragRef.current?.(), []);

  // A window resize, or the fold changing the card's size, re-clamps the remembered spot
  // into the viewport. Display only: the stored preference is rewritten by a drag.
  useEffect(() => {
    if (!corner) return undefined;
    const reclamp = () => {
      const node = cardRef.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      setPos((p) => {
        if (!p) return p;
        const c = clampToViewport(p, r.width, r.height);
        return c.left === p.left && c.top === p.top ? p : c;
      });
    };
    reclamp();
    window.addEventListener('resize', reclamp);
    return () => window.removeEventListener('resize', reclamp);
  }, [corner, collapsed, cardRef]);

  if (!shown) return null;

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

  if (corner) {
    // THE CORNER CARD (the owner, 2026-10-30): small, fixed bottom-right, lifted over
    // the pinned footer's band (and the 640-1023 bar, 0px from 1024 up) through the
    // shared composition. It sits on the `coach` layer (900), one step under the feedback
    // panel (910) that opens in the same corner, so the panel the reader summoned is
    // always on top and its close control is never covered.
    // Once dragged, the card is placed by its top-left; until then it keeps the lifted
    // corner anchor. Two literals on purpose: the bottom-anchored-chrome walker reads the
    // second as this file's one LIFTED site.
    const anchor = pos
      ? { position: 'fixed', left: pos.left, top: pos.top }
      : {
        position: 'fixed',
        right: CORNER,
        bottom: aboveFooter(aboveBottomNav(CORNER)),
      };
    // Drag by the header, with pointer events (mouse and touch alike). A press that
    // travels under 4 px is a click (the fold); past that it is a move, clamped to the
    // viewport on every step and remembered where it is dropped.
    const startDrag = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target?.closest?.('[data-coach-nodrag]')) return;
      const node = cardRef.current;
      if (!node) return;
      const r = node.getBoundingClientRect();
      const d = { x: e.clientX, y: e.clientY, left: r.left, top: r.top, moved: false, last: null };
      const move = (ev) => {
        const dx = ev.clientX - d.x;
        const dy = ev.clientY - d.y;
        if (!d.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
        d.moved = true;
        d.last = clampToViewport({ left: d.left + dx, top: d.top + dy }, r.width, r.height);
        setPos(d.last);
      };
      const end = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        endDragRef.current = null;
      };
      const up = () => {
        end();
        if (!d.moved || !d.last) return;
        writeCornerPos(d.last);
        swallowClickRef.current = true;
        setTimeout(() => { swallowClickRef.current = false; }, 0);
      };
      endDragRef.current?.();
      endDragRef.current = end;
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    };
    const toggleFold = () => {
      if (swallowClickRef.current) { swallowClickRef.current = false; return; }
      setCollapsed(c => !c);
    };
    const pillText = `${guide.headline.replace(/\.$/, '')} \u00b7 What\u2019s next`;
    return (
      <div
        ref={cardRef}
        role="region"
        aria-label="What is next for this dossier"
        tabIndex={-1}
        style={{
          ...anchor,
          zIndex: 900,
          width: collapsed ? 'auto' : CARD_W,
          maxWidth: CARD_W,
          boxSizing: 'border-box',
          background: CARD,
          border: `1px solid ${BORDER}`,
          fontFamily: sans, color: INK,
          overflow: 'hidden',
        }}
      >
        {/* Header: the drag handle. The headline is the fold toggle; the house close
            retires the hint and is never a drag start. The pointer listener sits on the
            box, not on a control, so every press inside it can move the card while the
            keyboard reaches the same two controls by Tab. */}
        <div
          onPointerDown={startDrag}
          style={{
            display: 'flex', alignItems: 'center', gap: SP.xs,
            padding: `${SP.xs}px ${SP.xs}px ${SP.xs}px ${SP.sm}px`,
            background: CARD_HDR,
            borderBottom: collapsed ? 'none' : `1px solid ${BORDER}`,
            cursor: 'grab', touchAction: 'none', userSelect: 'none',
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={!collapsed}
            onClick={toggleFold}
            style={{
              flex: 1, minWidth: 0, justifyContent: 'flex-start',
              border: 'none', background: 'transparent', padding: `${SP.xs}px`,
              fontFamily: serif_, fontSize: FS.md, fontWeight: 600, color: INK,
              overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'inherit',
            }}
          >
            {collapsed ? pillText : guide.headline}
          </Button>
          {!collapsed && (
            <span data-coach-nodrag="" style={{ display: 'inline-flex' }}>
              <DialogClose onClose={close} tone="default" />
            </span>
          )}
        </div>

        {!collapsed && (
          <div style={{ padding: `${SP.sm}px ${SP.md}px ${SP.md}px` }}>
            <div style={{
              fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 700, color: MUTED,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              What&rsquo;s next &middot; {safeStep + 1} of {total}
            </div>
            <h3 style={{
              margin: `${SP.xs}px 0 0`, fontFamily: serif_, fontSize: FS.md, fontWeight: 600, color: INK,
            }}>
              {cur.label}
            </h3>
            <p style={{ margin: `${SP.xs}px 0 0`, fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
              {cur.hint}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginTop: SP.md }}>
              {step > 0 && (
                <Button variant="secondary" size="sm" onClick={back} icon={<ChevronLeft size={12} />}>
                  Back
                </Button>
              )}
              <span style={{ flex: 1 }} />
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
        )}
      </div>
    );
  }

  // THE PHONE DOCK (below 1024 px): one card in the page's own scroll container (§934.29;
  // REVIEW-P F6). It is capped to PAGE_MAX and centred, the SAME frame GenerateWizard gives
  // the dossier body (`maxWidth: PAGE_MAX, margin: '0 auto'`), so it lands below the
  // reading column on its measure. On a phone the cap is inert (the container is narrower
  // than it). No fixed position and no layer here; the corner card above owns those.
  const dock = {
    position: 'relative',
    width: '100%', maxWidth: PAGE_MAX, marginLeft: 'auto', marginRight: 'auto',
    marginTop: SP.xl, marginBottom: SP.md,
  };

  return (
    <div
      ref={cardRef}
      // A `region`, not a `dialog` (REVIEW-P F6). See THE CORNER CARD in the header: the estate
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
