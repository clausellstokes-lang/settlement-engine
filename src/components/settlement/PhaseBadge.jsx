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
import { Edit3, BookMarked, RotateCcw } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { triggerPricingMoment } from '../../lib/pricingMoments.js';
import { GOLD, GOLD_BG, INK, sans, FS, R } from '../theme.js';
import { ConfirmDialog } from '../primitives/Dialog.jsx';

const COLORS = {
  draft: { bg: '#f3ead8', fg: '#6a4a1c', border: '#c8a96a', icon: Edit3,      label: 'Draft' },
  canon: { bg: '#1a3a2a', fg: '#e0d6b8', border: '#2d5a44', icon: BookMarked, label: 'Canon' },
};

export default function PhaseBadge() {
  const phase     = useStore(s => s.phase);
  const canonize  = useStore(s => s.canonize);
  const uncanonize = useStore(s => s.uncanonize);
  const eventCount = useStore(s => s.eventLog?.length ?? 0);
  const [confirmAction, setConfirmAction] = useState(null);

  const c = COLORS[phase] || COLORS.draft;
  const Icon = c.icon;

  const onCanonize = () => {
    setConfirmAction('canonize');
  };

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
          <Icon size={11} /> {c.label.toUpperCase()}
          {phase === 'canon' && eventCount > 0 && (
            <span style={{ opacity: 0.7, marginLeft: 4 }}>· {eventCount}</span>
          )}
        </span>
        {phase === 'draft' && (
          <button
            onClick={onCanonize}
            title="Mark as canon - start tracking in-world events on a timeline"
            style={btnStyle(false)}
          >
            <BookMarked size={11} /> Canonize
          </button>
        )}
        {phase === 'canon' && (
          <button
            onClick={onReset}
            title="Reset to draft and clear the event timeline"
            style={btnStyle(true)}
          >
            <RotateCcw size={11} /> Reset
          </button>
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

function btnStyle(danger) {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 8px',
    background: danger ? '#fff' : GOLD_BG,
    color:      danger ? '#8b1a1a' : INK,
    border: `1px solid ${danger ? '#c89a9a' : GOLD}`,
    borderRadius: R.sm,
    fontSize: FS.xxs, fontWeight: 700, fontFamily: sans,
    cursor: 'pointer',
  };
}
