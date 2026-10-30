/**
 * components/surveyor/SurveyorTextIntentShell.jsx — the door's EPHEMERAL TEXT-INTENT SHELL
 * (SC-1A). The prompt slip's single 3-row box became a chat-shaped surface: a transient
 * user-turn log above a bottom-anchored composer that grows upward as you type.
 *
 * ⭐ X-22 (the owner, 2026-10-30: "when first clicked it is a single text box, nothing
 * fancy"). Before the first send the shell is ONE composer at the door and nothing else:
 * no heading, no chips, no send button, no register links. Its placeholder ROTATES
 * through the door's suggested first questions (src/domain/ai/suggestedQuestions.js, the
 * zero-cost read-model prompts), so the suggestions survive as words in the box rather
 * than as buttons around it. Enter sends; Shift+Enter breaks the line.
 *
 * IT IS NOT A SECOND DOOR. Everything that decides anything stays in SurveyorDoor:
 * entitlement, the modal focus trap, the router call, the destination state, and the
 * remount nonce. This module imports no router, no provider transport, no store slice,
 * no destination panel, and no operation registry — a guard in
 * tests/components/surveyorProposalCard.test.jsx pins that, so a future edit cannot
 * quietly grow a second entry point here.
 *
 * EPHEMERAL MEANS EPHEMERAL. `draft` and `turns` are component memory for the CURRENTLY
 * MOUNTED door and nothing else: never lifted to the store, never persisted, never
 * replayed, never sent as history. The door keeps the shell MOUNTED while it is closed
 * (open={promptOpen}), so a close/reopen round trip keeps what you were writing; a page
 * reload or an unmount takes both with it. Turn ids come from a component-local counter
 * — no clock, uuid, or random draw — so the log carries no fingerprint of when you asked.
 *
 * The log records ONLY what the DM typed. It never fabricates an assistant turn, a
 * receipt, an audience, a proposal, or a claim that a route succeeded: a turn is appended
 * exactly when the door's own router returns a destination.
 *
 * Styling: chrome lives in src/styles/surveyorChat.css as classes (the deep-craft
 * kill-list ratchet freezes inline radius/shadow/wash counts under src/components), and
 * rides the lazy FloatingAffordances chunk with the rest of the door — zero eager bytes.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { t } from '../../copy/index.js';
import { CARD, INK, MUTED, BORDER, SLATE, SLATE_DEEP, sans, serif_, FS } from '../theme.js';
import IconButton from '../primitives/IconButton.jsx';
import { AnchorChip } from './surveyorPanelKit.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import '../../styles/surveyorChat.css';
import { chromeFontSize } from '../../design/proseScale.js';

/** The composer's growth cap in px (≈6 lines). Above it the box scrolls instead. */
const MAX_COMPOSER_PX = 144;
/** How long each suggested question holds the empty composer's placeholder. */
const PLACEHOLDER_HOLD_MS = 4000;

export default function SurveyorTextIntentShell({
  open,
  dialogRef,
  anchorLabel,
  onClose,
  onRoute,
  suggestions = [],
}) {
  const mobile = useIsMobile();
  const [draft, setDraft] = useState('');
  const [turns, setTurns] = useState([]);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const [hint, setHint] = useState(0);
  const nextTurnId = useRef(1);
  const areaRef = useRef(null);
  const isMobile = useIsMobile();
  const hints = Array.isArray(suggestions) ? suggestions.filter(Boolean) : [];
  const hintCount = hints.length;

  // THE UPWARD GROWTH. Height is measured, not guessed: collapse to zero so
  // scrollHeight reports the content's true height, then take the smaller of that
  // and the cap. Scrolling is enabled ONLY at the cap, so a short draft never shows
  // a scrollbar. Written imperatively (never through the React style prop) so a
  // re-render cannot fight the measured value.
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    el.style.height = '0px';
    const next = Math.min(el.scrollHeight, MAX_COMPOSER_PX);
    el.style.height = `${next}px`;
    el.style.overflowY = next < MAX_COMPOSER_PX ? 'hidden' : 'auto';
  }, [draft, open]);

  // THE MOBILE KEYBOARD INSET. A software keyboard shrinks the visual viewport
  // without moving the layout viewport, so a bottom-anchored sheet would sit under
  // it. Both listeners are removed on close/unmount (a visualViewport listener that
  // outlives its surface fires for the rest of the session). Absent API ⇒ zero: the
  // sheet degrades to its unlifted position rather than throwing.
  useEffect(() => {
    if (!open || !isMobile) return undefined;
    const vv = typeof window === 'undefined' ? null : window.visualViewport;
    if (!vv) return undefined;
    const measure = () => setKeyboardInset(
      Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop)),
    );
    measure();
    vv.addEventListener('resize', measure);
    vv.addEventListener('scroll', measure);
    return () => {
      vv.removeEventListener('resize', measure);
      vv.removeEventListener('scroll', measure);
      setKeyboardInset(0);
    };
  }, [open, isMobile]);

  // THE ROTATING PLACEHOLDER. Only while the box is open and empty, and only when
  // there is more than one suggestion to rotate through; a typed draft stops it.
  const rotating = open && !draft && hintCount > 1;
  useEffect(() => {
    if (!rotating) return undefined;
    const id = setInterval(() => setHint((n) => n + 1), PLACEHOLDER_HOLD_MS);
    return () => clearInterval(id);
  }, [rotating]);

  // ABSENCE: a blank or whitespace-only draft is not a prompt. Nothing is routed,
  // nothing is logged, and no empty turn is ever stored.
  const submit = () => {
    const q = draft.trim();
    if (!q) return;
    const routed = onRoute?.(q);
    if (!routed) return;
    const id = nextTurnId.current;
    nextTurnId.current += 1;
    setTurns((prev) => [...prev, { id, text: q }]);
    setDraft('');
  };

  // Enter sends and Shift+Enter breaks the line, at every width: X-22 leaves no send
  // button in the box, so the on-screen Return key is the send key (enterKeyHint says
  // so). An Enter that ends an IME composition commits the candidate; it never submits.
  const onKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    if (event.nativeEvent?.isComposing || event.isComposing) return;
    event.preventDefault();
    submit();
  };

  if (!open) return null;

  const placeholder = hintCount > 0 ? hints[hint % hintCount] : t('surveyorDoor.placeholder');
  const composer = (
    <textarea
      ref={areaRef}
      className="sf-door-chat-area"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onKeyDown={onKeyDown}
      aria-label={t('surveyorDoor.promptLabel')}
      placeholder={placeholder}
      enterKeyHint="send"
      rows={1}
      style={{ background: CARD, border: `1px solid ${BORDER}`, color: INK, fontSize: FS.sm, fontFamily: sans }}
    />
  );

  // FIRST OPEN: the one composer, floating at the door, and nothing else.
  if (turns.length === 0) {
    return (
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={t('surveyorDoor.heading')}
        className={`sf-door-panel sf-door-composer${isMobile ? ' sf-door-panel--sheet' : ''}`}
        style={{ background: CARD, border: `1px solid ${SLATE}`, fontFamily: sans, '--sf-door-kbd-inset': `${keyboardInset}px` }}
      >
        {composer}
      </div>
    );
  }

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      aria-label={t('surveyorDoor.heading')}
      className={`sf-door-panel sf-door-panel--chat${isMobile ? ' sf-door-panel--sheet' : ''}`}
      style={{
        background: CARD,
        border: `1px solid ${SLATE}`,
        fontFamily: sans,
        '--sf-door-kbd-inset': `${keyboardInset}px`,
      }}
    >
      <div className="sf-door-chat-head">
        <span className="sf-smallcap" style={{ fontSize: FS.sm, fontWeight: 700, color: SLATE_DEEP }}>
          {t('surveyorDoor.heading')}
        </span>
        <IconButton glyph="×" label={t('surveyorDoor.close')} size="sm" onClick={onClose} />
      </div>

      {/* CONTEXT-FIRST made visible: the Surveyor reads what the page shows. */}
      <AnchorChip label={anchorLabel} />

      {/* The transient register of what YOU asked — chronological, newest last, and
          only ever the DM's own words (the analyst's reply belongs to its own panel). */}
      <div className="sf-door-chat-log" role="log" aria-label={t('surveyorDoor.youAsked')}>
        {turns.map((turn) => (
          <div key={turn.id} className="sf-door-chat-turn">
            <span className="sf-smallcap" style={{ fontSize: chromeFontSize(FS.xs, mobile), color: MUTED }}>
              {t('surveyorDoor.youAsked')}
            </span>
            <p
              data-testid="surveyor-turn"
              style={{ margin: 0, fontSize: FS.sm, color: INK, fontFamily: serif_, fontStyle: 'italic', lineHeight: 1.45 }}
            >
              {turn.text}
            </p>
          </div>
        ))}
      </div>

      {/* THE COMPOSER IS THE LAST FLEX CHILD: its bottom edge is pinned and its top
          edge rises, so the caret never moves as the box grows. */}
      <div className="sf-door-chat-composer">{composer}</div>
    </div>
  );
}
