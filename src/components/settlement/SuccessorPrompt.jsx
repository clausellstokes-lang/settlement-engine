/**
 * SuccessorPrompt — Modal shown after a pillar-tier NPC death.
 *
 * Closes the gap the architect critique kept flagging: when a leader
 * dies, the institutional vacuum needs filling, and the DM shouldn't
 * have to invent a replacement from scratch. The engine ranks viable
 * candidates via `inferSuccessors`; this UI surfaces them as a one-
 * click ASSIGN_NPC_TO_ROLE pre-fill.
 *
 * Three exit paths:
 *   1. Pick a suggested successor → opens the EventComposer pre-
 *      configured with that NPC + the institution + a sensible quality
 *      default. User can adjust before applying.
 *   2. Pick "Someone new" → opens EventComposer with ADD_NPC pre-
 *      configured for the same role + institution, then the DM
 *      typically follows with a separate ASSIGN_NPC_TO_ROLE.
 *   3. Dismiss → vacuum persists. The institution stays impaired
 *      until a later event fills the role.
 *
 * The prompt is informational, not blocking. It surfaces on top of
 * the dossier but doesn't prevent the user from doing other work.
 */

import { Crown, UserPlus, X, ArrowRight } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, FS, SP, R, swatch } from '../theme.js';
import IconButton from '../primitives/IconButton.jsx';
import Button from '../primitives/Button.jsx';
import { useDialogFocusTrap } from '../primitives/useDialogFocusTrap.js';

export default function SuccessorPrompt() {
  const pending  = useStore(s => s.pendingSuccession);
  const settlement = useStore(s => s.settlement);
  const stageComposerIntent = useStore(s => s.stageComposerIntent);
  const dismiss      = useStore(s => s.dismissPendingSuccession);

  // Back aria-modal="true" with focus-in / Tab-trap / Escape / focus-restore, using the
  // SHARED trap the sibling modals use (a11y audit R7 — a bare aria-modal that doesn't
  // trap focus strands keyboard + screen-reader users). Called unconditionally BEFORE the
  // early return (Rules of Hooks); "open" is false when the prompt isn't shown, so the
  // trap stays inert until the modal actually renders.
  const dialogRef = useDialogFocusTrap(Boolean(pending && settlement), dismiss);

  if (!pending || !settlement) return null;

  // Look up the suggested NPCs by id so we can render their names
  // and current roles. The list filters out any IDs that no longer
  // resolve (race condition where the suggested NPC was also removed).
  const suggested = (pending.suggestedSuccessorIds || [])
    .map(id => (settlement.npcs || []).find(n => (n.id || n.name) === id))
    .filter(Boolean);

  // Primary institution to fill — most pillar NPCs link to exactly
  // one; if there are multiple, we take the first and the user can
  // re-target via the EventComposer before applying.
  const institutionId = pending.linkedInstitutionIds?.[0] || '';
  const institutionName = institutionId
    ? (settlement.institutions || []).find(i => (i.id || i.name) === institutionId)?.name || institutionId
    : 'the role';

  function pickSuccessor(npc) {
    // Composer V2 §4/§5: stage a composer INTENT — the form is the one source
    // of truth, so the composer populates, auto-previews, and Apply commits the
    // (possibly adjusted) form event. The old pre-staged pendingPreview died
    // with the apply-prefers-pendingPreview bypass.
    stageComposerIntent({
      type: 'ASSIGN_NPC_TO_ROLE',
      target: npc.id || npc.name,
      fields: {
        institutionId,
        role: pending.outgoingRole || 'replacement',
        quality: 'competent',          // sensible default — user can adjust
        causeOverride: 'world_event',  // the vacuum-filling is the world's doing
        description: `${npc.name} succeeds ${pending.outgoingNpcName}.`,
      },
    });
    dismiss();
    // Scroll to EventComposer so the DM lands on the preview panel
    setTimeout(() => {
      const target = document.querySelector('[data-anchor="event-composer"]');
      if (target?.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function pickNew() {
    stageComposerIntent({
      type: 'ADD_NPC',
      target: pending.outgoingRole ? `New ${pending.outgoingRole}` : 'New Appointee',
      fields: {
        importance: 'key',
        role: pending.outgoingRole || '',
        institutionId,               // buildEvent maps this to linkedInstitutionIds
        causeOverride: 'world_event',
        description: `A new figure rises to fill the vacuum left by ${pending.outgoingNpcName}.`,
      },
    });
    dismiss();
    // No pricing moment here (W-R2-TRUST, components-dossier-library-5): the
    // composer the DM is about to land on IS the value moment, and pricingMoments'
    // own doctrine is "don't ask before they understand the value". This handler
    // previously fired the 'first_canon_export' moment — the WRONG copy (export,
    // not succession) AND it consumed the 24h cooldown for the REAL first-canon-
    // export moment (SettlementDetail). No succession-themed moment exists;
    // registering one would add eager copy to interrupt the very flow the doctrine
    // says to leave uninterrupted, so the honest fix is to fire nothing.
    setTimeout(() => {
      const target = document.querySelector('[data-anchor="event-composer"]');
      if (target?.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  return (
    // Backdrop-dismiss on the dialog wrapper is a redundant convenience;
    // keyboard users dismiss via the labelled IconButton or footer button.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="succession-title"
      style={overlayStyle}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
      onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget) dismiss(); }}
    >
      <div style={sheetStyle}>
        <header style={headerStyle}>
          <h2 id="succession-title" style={titleStyle}>
            <Crown size={16} aria-hidden="true" color={GOLD} /> A leader is gone.
          </h2>
          <IconButton Icon={X} label="Dismiss" tone="ghost" size="sm" onClick={dismiss} />
        </header>

        <div style={{ padding: SP.md }}>
          <p style={{
            margin: '0 0 12px',
            fontSize: FS.sm, fontFamily: sans, color: INK, lineHeight: 1.5,
          }}>
            <strong>{pending.outgoingNpcName}</strong>
            {pending.outgoingRole && (
              <> - {pending.outgoingRole}</>
            )}{' '}
            is gone. <strong>{institutionName}</strong> has lost its leader.
            Who steps into the role?
          </p>

          {suggested.length > 0 && (
            <>
              <div style={kickerStyle}>Suggested successors</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                {suggested.map(npc => (
                  <button
                    key={npc.id || npc.name}
                    type="button"
                    onClick={() => pickSuccessor(npc)}
                    style={successorBtnStyle}
                  >
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK, fontFamily: sans }}>
                        {npc.name}
                      </div>
                      <div style={{ fontSize: FS.xs, color: SECOND, fontFamily: sans, marginTop: 2 }}>
                        {npc.role || 'Notable figure'}
                        {npc.importance ? ` · ${npc.importance}` : ''}
                      </div>
                    </div>
                    <ArrowRight size={14} aria-hidden="true" color={GOLD} />
                  </button>
                ))}
              </div>
            </>
          )}

          {suggested.length === 0 && (
            <div style={{
              padding: SP.sm,
              background: swatch['#FFF7EC'],
              border: `1px solid #e0b070`,
              borderRadius: R.sm,
              fontSize: FS.xs, fontFamily: sans, color: swatch['#7A4F0F'],
              marginBottom: 12, lineHeight: 1.5,
            }}>
              No obvious successor among the existing NPCs. Appoint someone new,
              or dismiss this prompt to leave the role vacant. The impairment
              will persist until filled.
            </div>
          )}

          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={pickNew}
            icon={<UserPlus size={13} aria-hidden="true" />}
          >
            Appoint someone new
          </Button>
        </div>

        <footer style={footerStyle}>
          <Button
            variant="ghost"
            size="sm"
            onClick={dismiss}
            style={{ textDecoration: 'underline', color: MUTED, fontSize: FS.xxs }}
          >
            Leave the role vacant
          </Button>
        </footer>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(28,20,9,0.5)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000,
};
const sheetStyle = {
  width: 'min(440px, calc(100vw - 32px))',
  maxHeight: 'calc(100vh - 32px)', overflow: 'auto',
  background: CARD,
  border: `1px solid ${BORDER}`, borderRadius: R.md,
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
};
const headerStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '10px 12px',
  borderBottom: `1px solid ${BORDER}`,
};
const titleStyle = {
  margin: 0, display: 'flex', alignItems: 'center', gap: 6,
  fontSize: FS.md, fontWeight: 700, color: INK, fontFamily: sans,
};
const kickerStyle = {
  fontSize: FS.xxs, fontWeight: 800,
  color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
  fontFamily: sans, marginBottom: 6,
};
const successorBtnStyle = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '8px 10px',
  background: '#fffbf5',
  border: `1px solid ${BORDER}`, borderRadius: R.sm,
  cursor: 'pointer', textAlign: 'left',
  fontFamily: sans,
};
const footerStyle = {
  padding: '8px 12px',
  borderTop: `1px solid ${BORDER}`,
  display: 'flex', justifyContent: 'center',
};
