/**
 * components/surveyor/SurveyorTextIntentShell.jsx — the door's EPHEMERAL TEXT-INTENT SHELL
 * (SC-1A). The prompt slip's single 3-row box became a chat-shaped surface: a transient
 * user-turn log above a bottom-anchored composer that grows upward as you type.
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
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { AnchorChip } from './surveyorPanelKit.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import '../../styles/surveyorChat.css';

/** The composer's growth cap in px (≈6 lines). Above it the box scrolls instead. */
const MAX_COMPOSER_PX = 144;

export default function SurveyorTextIntentShell({
  open,
  dialogRef,
  anchorLabel,
  onClose,
  onRoute,
  onOpenAnalyst,
  onOpenInterview,
  onOpenWorkshop,
}) {
  const [draft, setDraft] = useState('');
  const [turns, setTurns] = useState([]);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const nextTurnId = useRef(1);
  const areaRef = useRef(null);
  const isMobile = useIsMobile();

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

  // Desktop: Enter sends, Shift+Enter breaks the line. Mobile: Enter ALWAYS breaks the
  // line (the on-screen Return key is how people type a paragraph) and only Send routes.
  // An Enter that ends an IME composition commits the candidate — it must never submit.
  const onKeyDown = (event) => {
    if (event.key !== 'Enter' || isMobile || event.shiftKey) return;
    if (event.nativeEvent?.isComposing || event.isComposing) return;
    event.preventDefault();
    submit();
  };

  if (!open) return null;

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
            <span className="sf-smallcap" style={{ fontSize: FS.xs, color: MUTED }}>
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

      {/* Promptless doors (capability retention: the retired launchers allowed opening
          the panels without a prompt — these quiet register links keep that path). */}
      <div className="sf-door-chat-register">
        <Button variant="ghost" size="sm" onClick={onOpenAnalyst}>{t('surveyorDoor.openAnalyst')}</Button>
        <Button variant="ghost" size="sm" onClick={onOpenInterview}>{t('surveyorDoor.openInterview')}</Button>
        <Button variant="ghost" size="sm" onClick={onOpenWorkshop}>{t('surveyorDoor.openWorkshop')}</Button>
      </div>

      {/* THE COMPOSER IS THE LAST FLEX CHILD: its bottom edge is pinned and its top
          edge rises, so the caret never moves as the box grows. */}
      <div className="sf-door-chat-composer">
        <textarea
          ref={areaRef}
          className="sf-door-chat-area"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          aria-label={t('surveyorDoor.promptLabel')}
          placeholder={t('surveyorDoor.placeholder')}
          rows={1}
          style={{ background: CARD, border: `1px solid ${BORDER}`, color: INK, fontSize: FS.sm, fontFamily: sans }}
        />
        <div className="sf-door-chat-actions">
          <span style={{ fontSize: FS.xs, color: MUTED }}>{t('surveyorDoor.routeHint')}</span>
          <Button variant="aiSolid" size="sm" disabled={!draft.trim()} onClick={submit}>
            {t('surveyorDoor.route')}
          </Button>
        </div>
      </div>
    </div>
  );
}
