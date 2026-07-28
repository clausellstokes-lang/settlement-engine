/**
 * DestroySettlementControl — the Library's type-the-name confirm for
 * `destroySavedSettlement`.
 *
 * Destruction and deletion are different acts and this row is the one that was
 * missing. Delete removes the save from the library. Destroy keeps the dossier and
 * records, in the settlement's own canon, that the place was destroyed: the status
 * flips, a DESTROY_SETTLEMENT entry lands in the event log with the cause the GM
 * gives, and the row stays readable afterwards.
 *
 * The consent gate is NOT invented here. Wave R-1 put it at the action boundary
 * (settlementSliceHelpers `destroySettlementConfirmRefusal`), because the registry
 * was that lane's only surface: the action refuses unless `confirmName` is the
 * settlement's exact name. This component is that gate's front end. It pre-checks
 * the typed name so the button is not a trap, and it still renders whatever the
 * action refuses with, so the store stays the authority and a client-side check
 * can never be the only thing standing between a GM and a one-way canon act.
 *
 * Lazy-mounted from SettlementCard: a Library page that never opens this row pays
 * nothing for it.
 *
 * DELIBERATELY DEFERRED, documented so nobody re-finds it as a bug:
 *   • The row does not yet SAY "destroyed" after the act. The list repaints from
 *     the store (useOwnerScopedSaves subscribes to savedSettlements, which the
 *     action writes), and the affordance correctly disappears, but the Phase and
 *     Health columns read the same as before. Giving destruction its own row
 *     encoding is a legibility change to the ledger's column grammar, not part of
 *     wiring the operation, so it belongs to whoever next owns the Library row.
 *   • The affordance is offered on CANON rows only (a vetoable judgment). On a
 *     draft, the action's own `phase: currentCampaignState.phase || 'canon'`
 *     would open a campaign timeline behind the GM as a side effect of destroying
 *     the town. Veto = drop the `isCanon` condition in SettlementCard.
 */

import { useState } from 'react';
import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';
import { BODY, FS, SP, sans, swatch } from '../theme.js';

/**
 * The name the action will demand. Mirrors the helper's own resolution order so
 * the prompt can never ask for a token the gate would reject: the settlement's
 * name, else the save row's name, else the save id.
 * @param {{ id?: unknown, name?: string, settlement?: { name?: string } }} save
 */
export function expectedConfirmName(save) {
  return String(save?.settlement?.name || save?.name || '').trim() || String(save?.id ?? '');
}

/**
 * @param {{ save: any, onCancel: () => void, onDestroyed?: () => void }} props
 */
export default function DestroySettlementControl({ save, onCancel, onDestroyed }) {
  const destroySavedSettlement = useStore(s => s.destroySavedSettlement);
  const [typed, setTyped] = useState('');
  const [cause, setCause] = useState('');
  const [refusal, setRefusal] = useState(null);

  const expected = expectedConfirmName(save);
  const matches = typed.trim() === expected;

  const confirm = () => {
    setRefusal(null);
    const result = destroySavedSettlement?.(save.id, cause.trim() || 'destroyed', { confirmName: typed });
    if (!result || result.ok === false) {
      setRefusal(result?.userMessage
        || 'The destruction was not recorded, so nothing about this settlement changed.');
      return;
    }
    onDestroyed?.();
    onCancel();
  };

  return (
    <div style={{
      marginTop: 6, padding: '10px 12px', fontFamily: sans,
      background: swatch['#FAF8F4'], border: `1px solid ${swatch.danger}`,
      borderLeft: `3px solid ${swatch.danger}`,
    }}>
      <div style={{ fontSize: FS.sm, color: swatch.danger, fontWeight: 600, marginBottom: 5 }}>
        Record the destruction of {expected}?
      </div>
      <div style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.5, marginBottom: 8 }}>
        This writes the settlement&rsquo;s destruction into its canon and cannot be undone.
        The dossier stays in your library, marked destroyed, so the campaign can still read
        what was there. Type its exact name to confirm.
      </div>
      <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap', marginBottom: 8 }}>
        <input
          value={typed}
          onChange={e => setTyped(e.target.value)}
          aria-label={`Type ${expected} to confirm its destruction`}
          placeholder={expected}
          style={{ flex: '1 1 180px', minWidth: 140, padding: '6px 10px', fontFamily: sans, fontSize: FS.sm, border: `1px solid ${swatch.danger}`, boxSizing: 'border-box' }}
        />
        <input
          value={cause}
          onChange={e => setCause(e.target.value)}
          aria-label="What destroyed it"
          placeholder="what destroyed it"
          style={{ flex: '1 1 180px', minWidth: 140, padding: '6px 10px', fontFamily: sans, fontSize: FS.sm, border: `1px solid ${swatch.danger}`, boxSizing: 'border-box' }}
        />
      </div>
      {refusal && (
        <div role="alert" style={{ fontSize: FS.xs, color: swatch.danger, lineHeight: 1.5, marginBottom: 8 }}>
          {refusal}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="danger" size="sm" disabled={!matches} onClick={confirm}>
          Record the destruction
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
