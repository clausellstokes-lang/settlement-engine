/**
 * components/surveyor/SurveyorTextIntentShell.jsx — THE SURVEYOR CHAT'S PRESENTATION: one
 * composer that grows into a floating chat log (SC-1A, re-cut by X-22).
 *
 * ⭐ X-22 (the owner, 2026-10-30: "when first clicked it is a single text box, nothing
 * fancy; it expands into a floating chat log; no buttons inside; a simple chat interface
 * floating as a pop-up"). Three shapes, one component:
 *   • FIRST OPEN — ONE composer at the door and nothing else: no heading, no chips, no
 *     send button, no register links. Its placeholder ROTATES through the door's suggested
 *     first questions (src/domain/ai/suggestedQuestions.js, zero-cost read-model prompts),
 *     so the suggestions survive as words in the box rather than as buttons around it.
 *     Enter sends; Shift+Enter breaks the line. Escape puts it away (the draft stays).
 *   • THE LOG — the first send grows the composer into a floating card wearing the
 *     post-generate coach's chrome (src/hooks/useFloatingCard.js, one copy of the move
 *     and the memory): about 320 px, lifted over the pinned footer and the bottom bar,
 *     MOVABLE BY ITS HEADER, its spot remembered per device. A tap on the header or
 *     Escape folds it to a pill; the pill unfolds it. The one control inside is the house
 *     close, which retires the conversation for the visit. The composer element is the
 *     same node in both shapes, so the caret and focus survive the growth.
 *   • THE PILL — the folded log: one line naming the Surveyor, which unfolds on click.
 *
 * IT IS NOT A SECOND DOOR. Everything that decides anything stays in SurveyorDoor:
 * entitlement, the dismiss lifecycle, the router call, the turn dispatch, the
 * conversation's memory and the fold. This module imports no router, no provider transport, no store slice, no
 * destination panel, and no operation registry — a guard in
 * tests/components/surveyorProposalCard.test.jsx pins its import set exactly, so a future
 * edit cannot quietly grow a second entry point here. It renders the messages it is
 * handed and reports what was typed.
 *
 * NON-MODAL. A floating chat the DM keeps open while reading the dossier must not trap
 * Tab, so the door supplies the non-modal half of the lifecycle (useDialogDismiss:
 * Escape answers, focus goes home) through `dialogRef`, and the shell is a dialog WITHOUT
 * aria-modal (the estate's modal marker is the pair). Opening the door is a deliberate
 * summons, so the composer takes focus on open, one tick after the door's hook has
 * recorded the tab as the place to hand focus back.
 *
 * EPHEMERAL MEANS EPHEMERAL. `draft` is component memory and the log is the door's: never
 * lifted to the store, never persisted, never replayed.
 *
 * Styling: shape and elevation live in src/styles/surveyorChat.css as classes (the deep-
 * craft kill-list ratchet freezes inline radius/shadow/wash counts under src/components);
 * the card's anchor stays an inline literal here so the bottom-anchored-chrome walker
 * reads its lift. Rides the lazy FloatingAffordances chunk: zero eager bytes.
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { t } from '../../copy/index.js';
import { CARD, CARD_HDR, INK, MUTED, BORDER, SLATE, SLATE_DEEP, sans, serif_, FS, SP, aboveFooter, aboveBottomNav } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { AnchorChip } from './surveyorPanelKit.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import { useFloatingCard } from '../../hooks/useFloatingCard.js';
import '../../styles/surveyorChat.css';
import { chromeFontSize } from '../../design/proseScale.js';

/** The composer's growth cap in px (≈6 lines). Above it the box scrolls instead. */
const MAX_COMPOSER_PX = 144;
/** How long each suggested question holds the empty composer's placeholder. */
const PLACEHOLDER_HOLD_MS = 4000;
/** The log card's width (X-22: "~320 px"). */
const CHAT_W = 320;
/** Where the dragged log is remembered on this device. */
export const CHAT_POS_KEY = 'sf:surveyor:chat:pos';

export default function SurveyorTextIntentShell({
  open,
  dialogRef,
  anchorLabel,
  messages = [],
  busy = false,
  folded = false,
  onFold,
    onClose,
  onSend,
  suggestions = [],
}) {
  const mobile = useIsMobile();
  const [draft, setDraft] = useState('');
  const [hint, setHint] = useState(0);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const areaRef = useRef(null);
  const logRef = useRef(null);
  const hints = Array.isArray(suggestions) ? suggestions.filter(Boolean) : [];
  const hintCount = hints.length;
  const grown = messages.length > 0;
  const floating = open && grown;

  // The door's dismiss ref is the card's node (a local ref stands in when the shell is
  // rendered alone, as its own tests do).
  const ownRef = useRef(null);
  const cardRef = dialogRef || ownRef;
  const { pos, startDrag } = useFloatingCard({
    storageKey: CHAT_POS_KEY, active: floating, cardRef, remeasure: folded, noDragSelector: '[data-chat-nodrag]',
  });

  // Opening the door is a summons: the composer takes focus, one tick later, so the
  // door's dismiss hook (a parent effect, which runs after this one) has already recorded
  // the door tab as the place Escape hands focus back to.
  useEffect(() => {
    if (!open || folded) return undefined;
    const id = setTimeout(() => areaRef.current?.focus?.(), 0);
    return () => clearTimeout(id);
  }, [open, folded]);

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
  }, [draft, open, folded]);

  // THE MOBILE KEYBOARD INSET. A software keyboard shrinks the visual viewport
  // without moving the layout viewport, so a bottom-anchored sheet would sit under
  // it. Both listeners are removed on close/unmount (a visualViewport listener that
  // outlives its surface fires for the rest of the session). Absent API ⇒ zero: the
  // sheet degrades to its unlifted position rather than throwing.
  useEffect(() => {
    if (!open || !mobile) return undefined;
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
  }, [open, mobile]);

  // The newest message stays in view.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, busy]);

  // THE ROTATING PLACEHOLDER. Only while the box is open and empty, and only when
  // there is more than one suggestion to rotate through; a typed draft stops it.
  const rotating = open && !folded && !draft && hintCount > 1;
  useEffect(() => {
    if (!rotating) return undefined;
    const id = setInterval(() => setHint((n) => n + 1), PLACEHOLDER_HOLD_MS);
    return () => clearInterval(id);
  }, [rotating]);

  // ABSENCE: a blank or whitespace-only draft is not a prompt. Nothing is sent, and the
  // draft clears only when the door says the turn left the composer.
  const submit = () => {
    const q = draft.trim();
    if (!q) return;
    if (onSend?.(q)) setDraft('');
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

  // Once dragged, the card is placed by its top-left; until then it keeps the lifted
  // anchor at the door's margin. Two literals on purpose: the bottom-anchored-chrome
  // walker reads the second as this file's one LIFTED site.
  const anchor = pos
    ? { position: 'fixed', left: pos.left, top: pos.top }
    : { position: 'fixed', left: SP.lg, bottom: aboveFooter(aboveBottomNav(SP.lg)) };

  if (folded) {
    return (
      <div ref={cardRef} className="sf-door-chat-card sf-door-chat-card--pill" style={{ ...anchor, zIndex: 60, fontFamily: sans }}>
        <Button variant="ai" size="sm" aria-expanded={false} onClick={() => onFold?.(false)}>
          {t('surveyorDoor.heading')}
        </Button>
      </div>
    );
  }

  const xs = chromeFontSize(FS.xs, mobile);
  const sheet = mobile ? ' sf-door-panel--sheet' : '';
  const shape = !grown
    ? `sf-door-panel sf-door-composer${sheet}`
    : 'sf-door-chat-card';
  return (
    <div
      ref={cardRef}
      role="dialog"
      tabIndex={-1}
      aria-label={t('surveyorDoor.heading')}
      className={shape}
      style={{
        ...(grown ? { ...anchor, zIndex: 60, width: CHAT_W } : null),
        background: CARD,
        border: `1px solid ${SLATE}`,
        fontFamily: sans,
        ...(mobile ? { '--sf-door-kbd-inset': `${keyboardInset}px` } : null),
      }}
    >
      {grown && (
        // The header is the drag handle; a tap on it folds the card. It is not a
        // button (X-22: the close is the one control); Escape folds for the keyboard.
        <div
          className="sf-door-chat-head"
          onPointerDown={(e) => startDrag(e, { onTap: () => onFold?.(true) })}
          style={{ background: CARD_HDR, cursor: 'grab', touchAction: 'none', userSelect: 'none' }}
        >
          <span className="sf-smallcap" style={{ fontSize: FS.sm, fontWeight: 700, color: SLATE_DEEP }}>
            {t('surveyorDoor.heading')}
          </span>
          <span data-chat-nodrag="" style={{ display: 'inline-flex' }}>
            <IconButton glyph="×" label={t('surveyorDoor.close')} size="sm" onClick={onClose} />
          </span>
        </div>
      )}

      {/* CONTEXT-FIRST made visible: the Surveyor reads what the page shows. */}
      {grown && <AnchorChip label={anchorLabel} />}

      {grown && (
        <div ref={logRef} className="sf-door-chat-log" role="log" aria-label={t('surveyorDoor.heading')} aria-busy={busy || undefined}>
          {messages.map((m) => (m.from === 'you' ? (
            <div key={m.id} className="sf-door-chat-turn">
              <span className="sf-smallcap" style={{ fontSize: xs, color: MUTED }}>{t('surveyorDoor.youAsked')}</span>
              <p data-testid="surveyor-turn" style={{ margin: 0, fontSize: FS.sm, color: INK, fontFamily: serif_, fontStyle: 'italic', lineHeight: 1.45 }}>
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} data-testid="surveyor-message" className="sf-door-chat-turn">
              {m.node ?? <p style={{ margin: 0, fontSize: FS.sm, color: INK, lineHeight: 1.45 }}>{m.text}</p>}
            </div>
          )))}
          {busy && <p data-testid="surveyor-busy" style={{ margin: 0, fontSize: xs, color: MUTED }}>Thinking…</p>}
        </div>
      )}

      {/* THE COMPOSER IS THE LAST CHILD in every shape, so React keeps the same node as
          the box grows into the log: the caret and focus survive the growth. */}
      <div className="sf-door-chat-composer">
        <textarea
          ref={areaRef}
          className="sf-door-chat-area"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label={t('surveyorDoor.promptLabel')}
          placeholder={hintCount > 0 ? hints[hint % hintCount] : t('surveyorDoor.placeholder')}
          enterKeyHint="send"
          rows={1}
          style={{ background: CARD, border: `1px solid ${BORDER}`, color: INK, fontSize: FS.sm, fontFamily: sans }}
        />
      </div>
    </div>
  );
}
