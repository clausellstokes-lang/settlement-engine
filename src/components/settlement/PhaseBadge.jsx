/**
 * PhaseBadge — Draft / Canon indicator + canonize toggle.
 *
 * Sits in the SettlementDetail header. Communicates the current
 * lifecycle phase ("draft = tinkering OK" / "canon = changes get
 * timeline entries") and exposes one button to advance the phase.
 *
 * Going from canon → draft is exposed as "Reset to Draft" with a
 * confirm — that path discards the event log, so it's easy to do
 * accidentally if we don't gate it.
 */

import { useState } from 'react';
import { Edit3, BookMarked, RotateCcw, Lock } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { triggerPricingMoment } from '../../lib/pricingMoments.js';
import { GOLD, GOLD_BG, INK, sans, FS, R } from '../theme.js';
import { ConfirmDialog } from '../primitives/Dialog.jsx';
import Button from '../primitives/Button.jsx';
import { useIconsOn } from '../primitives/IconsContext.js';

const COLORS = {
  draft: { bg: '#f3ead8', fg: '#6a4a1c', border: '#c8a96a', icon: Edit3,      label: 'Draft' },
  canon: { bg: '#1a3a2a', fg: '#e0d6b8', border: '#2d5a44', icon: BookMarked, label: 'Canon' },
};

/**
 * @param {Object} props
 * @param {() => void} [props.onCanonizeRequest]  When provided (the SettlementDetail
 *   host always does), the "Canonize" button delegates to the parent's shared
 *   canonize-confirm gate, so the header badge and the NextActionRail rung route
 *   through ONE ConfirmDialog + ONE first_canonize pricing moment (BLOCKER #3).
 *   When absent, the badge falls back to its own self-contained confirm so it
 *   stays usable in isolation.
 */
export default function PhaseBadge({ onCanonizeRequest } = {}) {
  const phase     = useStore(s => s.phase);
  const canonize  = useStore(s => s.canonize);
  const uncanonize = useStore(s => s.uncanonize);
  const eventCount = useStore(s => s.eventLog?.length ?? 0);
  // Campaign-clock (Phase C3): a settlement bound to a canonized campaign world
  // can't be individually reset — its lifecycle is the world-map clock's now.
  const activeSaveId = useStore(s => s.activeSaveId);
  const clockBound = useStore(s =>
    typeof s.isSettlementClockBound === 'function' && s.isSettlementClockBound(activeSaveId));
  const [confirmAction, setConfirmAction] = useState(null);

  const iconsOn = useIconsOn();
  const c = COLORS[phase] || COLORS.draft;
  const Icon = c.icon;

  const onCanonize = () => {
    // Prefer the host's shared canonize gate so the badge and the NextActionRail
    // canonize rung commit through one confirm + one pricing moment. Fall back to
    // the local confirm only when used standalone (no host handler supplied).
    if (onCanonizeRequest) { onCanonizeRequest(); return; }
    setConfirmAction('canonize');
  };

  // Local fallback commit — only reachable when no onCanonizeRequest is passed.
  const confirmCanonize = () => {
    setConfirmAction(null);
    canonize();
    // Pricing moment: this is the strongest commit signal in the
    // product. The user just promoted a draft into campaign canon,
    // which means they're invested. Cooldowned per-user so it doesn't
    // re-fire on every canonization.
    const live = useStore.getState();
    triggerPricingMoment('first_canonize', () => {
      live.setPurchaseModalOpen?.(true);
    }, { tier: live.auth?.tier });
  };

  const onReset = () => {
    setConfirmAction('reset');
  };

  const confirmReset = () => {
    setConfirmAction(null);
    uncanonize();
  };

  return (
    <>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span
          title={phase === 'canon'
            ? 'In canon: changes are logged as in-world events.'
            : 'In draft: changes are authorial, no timeline yet.'}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px',
            background: c.bg, color: c.fg,
            border: `1px solid ${c.border}`, borderRadius: R.sm,
            fontSize: FS.xs, fontWeight: 800, fontFamily: sans, letterSpacing: '0.04em',
          }}
        >
          {iconsOn && <Icon size={11} />}{c.label.toUpperCase()}
          {phase === 'canon' && eventCount > 0 && (
            <span style={{ opacity: 0.7, marginLeft: 4 }}>· {eventCount}</span>
          )}
        </span>
        {phase === 'draft' && (
          <Button
            variant="gold"
            size="sm"
            icon={<BookMarked size={11} />}
            onClick={onCanonize}
            title="Mark as canon. Start tracking in-world events on a timeline"
          >
            Canonize
          </Button>
        )}
        {phase === 'canon' && !clockBound && (
          <Button
            variant="danger"
            size="sm"
            icon={<RotateCcw size={11} />}
            onClick={onReset}
            title="Reset to draft and clear the event timeline"
          >
            Reset
          </Button>
        )}
        {phase === 'canon' && clockBound && (
          <span
            title="On the world-map clock. Reset is at the map level (undo a World Pulse). The settlement can't be individually reset to draft."
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px',
              background: GOLD_BG, color: INK,
              border: `1px solid ${GOLD}`, borderRadius: R.sm,
              fontSize: FS.xs, fontWeight: 700, fontFamily: sans,
            }}
          >
            {iconsOn && <Lock size={10} />} Clock-bound
          </span>
        )}
      </div>
      <ConfirmDialog
        open={confirmAction === 'canonize'}
        tone="warning"
        title="Mark settlement as canon?"
        body="Future changes will be logged as in-world events with timeline entries."
        confirmLabel="Canonize"
        onConfirm={confirmCanonize}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmDialog
        open={confirmAction === 'reset'}
        tone="danger"
        title="Reset to draft?"
        body={`This will discard ${eventCount} timeline entr${eventCount === 1 ? 'y' : 'ies'} and cannot be undone.`}
        confirmLabel="Reset"
        onConfirm={confirmReset}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}
