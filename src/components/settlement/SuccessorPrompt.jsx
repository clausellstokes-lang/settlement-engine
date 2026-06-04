/**
 * SuccessorPrompt - Modal shown after a pillar-tier NPC death.
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
import { triggerPricingMoment } from '../../lib/pricingMoments.js';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, FS, SP, R, swatch } from '../theme.js';
import IconButton from '../primitives/IconButton.jsx';

export default function SuccessorPrompt() {
  const pending  = useStore(s => s.pendingSuccession);
  const settlement = useStore(s => s.settlement);
  const previewEvent = useStore(s => s.previewEvent);
  const dismiss      = useStore(s => s.dismissPendingSuccession);

  if (!pending || !settlement) return null;

  // Look up the suggested NPCs by id so we can render their names
  // and current roles. The list filters out any IDs that no longer
  // resolve (race condition where the suggested NPC was also removed).
  const suggested = (pending.suggestedSuccessorIds || [])
    .map(id => (settlement.npcs || []).find(n => (n.id || n.name) === id))
    .filter(Boolean);

  // Primary institution to fill - most pillar NPCs link to exactly
  // one; if there are multiple, we take the first and the user can
  // re-target via the EventComposer before applying.
  const institutionId = pending.linkedInstitutionIds?.[0] || '';
  const institutionName = institutionId
    ? (settlement.institutions || []).find(i => (i.id || i.name) === institutionId)?.name || institutionId
    : 'the role';

  function pickSuccessor(npc) {
    previewEvent({
      // Date.now() and Math.random() generate a unique event id. They
      // only fire when the user clicks a successor (outside render);
      // the rule sees the function defined during render and is being
      // over-conservative.
      // eslint-disable-next-line react-hooks/purity
      id: `ev_succ_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: 'ASSIGN_NPC_TO_ROLE',
      targetId: npc.id || npc.name,
      payload: {
        institutionId,
        role: pending.outgoingRole || 'replacement',
        quality: 'competent',          // sensible default - user can adjust
      },
      cause: 'world_event',
      description: `${npc.name} succeeds ${pending.outgoingNpcName}.`,
    });
    dismiss();
    // Scroll to EventComposer so the DM lands on the preview panel
    setTimeout(() => {
      const target = document.querySelector('[data-anchor="event-composer"]');
      if (target?.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  function pickNew() {
    previewEvent({
      id: `ev_new_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: 'ADD_NPC',
      targetId: pending.outgoingRole ? `New ${pending.outgoingRole}` : 'New Appointee',
      payload: {
        importance: 'key',
        role: pending.outgoingRole || '',
        linkedInstitutionIds: institutionId ? [institutionId] : [],
      },
      cause: 'world_event',
      description: `A new figure rises to fill the vacuum left by ${pending.outgoingNpcName}.`,
    });
    dismiss();
    // Pricing moment for the campaign-state moment: rebuilding after
    // a pillar death is the kind of high-engagement action that
    // earns the upgrade pitch.
    const live = useStore.getState();
    triggerPricingMoment('first_canon_export', () => {
      live.setPurchaseModalOpen?.(true);
    }, { tier: live.auth?.tier });
    setTimeout(() => {
      const target = document.querySelector('[data-anchor="event-composer"]');
      if (target?.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="succession-title"
      style={overlayStyle}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
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
              or dismiss this prompt to leave the role vacant - the impairment
              will persist until filled.
            </div>
          )}

          <button type="button" onClick={pickNew} style={newBtnStyle}>
            <UserPlus size={13} aria-hidden="true" /> Appoint someone new
          </button>
        </div>

        <footer style={footerStyle}>
          <button type="button" onClick={dismiss} style={dismissBtnStyle}>
            Leave the role vacant
          </button>
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
const newBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 12px', width: '100%', justifyContent: 'center',
  background: GOLD, color: '#fff',
  border: 'none', borderRadius: R.sm,
  fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
  cursor: 'pointer',
};
const footerStyle = {
  padding: '8px 12px',
  borderTop: `1px solid ${BORDER}`,
  display: 'flex', justifyContent: 'center',
};
const dismissBtnStyle = {
  background: 'none', border: 'none',
  fontSize: FS.xxs, color: MUTED, fontFamily: sans,
  cursor: 'pointer',
  textDecoration: 'underline',
};
