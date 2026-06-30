/**
 * EventComposerSecondaryFields — the per-type secondary inputs that hang off a few
 * specific events: ADD_TRADE_GOOD (import/export direction + entrepôt handling),
 * APPLY_STRESSOR (the read-only DERIVED onset severity), and CHANGE_RULING_POWER
 * (how power changes hands). Grouped out of EventComposer to keep the parent under
 * the line ratchet; each block self-gates on `type`.
 */

import { INK, MUTED, BORDER, sans, FS, R, swatch } from '../../theme.js';
import { RULING_POWER_CAUSES } from '../../../domain/rulingPower.js';
import { inferImportance } from '../../../domain/entities/npcs.js';
import { Field } from './Field.jsx';
import { selectStyle } from './EventComposerConstants.js';

export function EventComposerSecondaryFields({
  type, tradeDirection, setTradeDirection, tradeEntrepot, setTradeEntrepot,
  derivedOnset, powerCause, setPowerCause, settlement, target,
}) {
  // KILL_NPC: importance is pulled from the chosen NPC and shown read-only, so the
  // DM sees the consequence tier before applying.
  const killNpc = type === 'KILL_NPC' && target
    ? (settlement?.npcs || []).find(n => String(n.id || n.name) === String(target))
    : null;
  const killImp = killNpc ? (killNpc.importance || inferImportance(killNpc)) : null;
  return (
    <>
      {/* ADD_TRADE_GOOD — direction, plus entrepôt handling for exports */}
      {type === 'ADD_TRADE_GOOD' && (
        <Field label="Direction" hint={tradeDirection === 'import' ? 'The settlement buys this in' : 'The settlement sells this outward'}>
          <select
            value={tradeDirection}
            onChange={e => { setTradeDirection(e.target.value); if (e.target.value !== 'export') setTradeEntrepot(false); }}
            style={selectStyle}
          >
            <option value="export">Export</option>
            <option value="import">Import</option>
          </select>
        </Field>
      )}
      {type === 'ADD_TRADE_GOOD' && tradeDirection === 'export' && (
        <Field label="Handling" hint={tradeEntrepot ? 'Re-exported through the warehouses, listed as (transit)' : 'Produced locally'}>
          <select
            value={tradeEntrepot ? 'transit' : 'local'}
            onChange={e => setTradeEntrepot(e.target.value === 'transit')}
            style={selectStyle}
          >
            <option value="local">Local production</option>
            <option value="transit">Entrepôt transit</option>
          </select>
        </Field>
      )}

      {/* APPLY_STRESSOR — onset severity is DERIVED from the settlement's preexisting
          pressure, not picked. Read-only so the DM sees the consequence the state produces. */}
      {type === 'APPLY_STRESSOR' && (
        <Field label="Onset severity" hint="Derived from the settlement's current pressure, not picked">
          <div style={{ fontSize: FS.xs, fontFamily: sans, color: INK, fontWeight: 700, padding: '5px 0', textTransform: 'capitalize' }}>
            {derivedOnset.word}
            <span style={{ fontWeight: 400, color: MUTED, marginLeft: 6 }}>
              {derivedOnset.sev >= 0.7
                ? 'This settlement is already strained; the crisis lands hard.'
                : derivedOnset.sev >= 0.55
                  ? 'A serious, active crisis on a settlement under pressure.'
                  : 'A real but survivable onset on a steadier settlement.'}
            </span>
          </div>
        </Field>
      )}

      {/* CHANGE_RULING_POWER — how power changes hands shapes the aftermath */}
      {type === 'CHANGE_RULING_POWER' && (
        <Field label="How" hint={
          powerCause === 'election'   ? 'A fresh mandate. Legitimacy starts warmer' :
          powerCause === 'conquest'   ? 'Imposed from outside. Legitimacy starts cold' :
          powerCause === 'succession' ? 'The line held; the household reorders' :
          powerCause === 'appointment'? 'Installed by a higher authority' :
                                        'Seized by force. Loyalties re-sworn at swordpoint'
        }>
          <select value={powerCause} onChange={e => setPowerCause(e.target.value)} style={selectStyle}>
            {RULING_POWER_CAUSES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </Field>
      )}

      {/* KILL_NPC — importance read-only from the chosen NPC */}
      {killImp && (
        <Field label="Importance (from this NPC)" hint={
          killImp === 'pillar' ? 'Pillar. Death shakes the settlement.' :
          killImp === 'key'    ? 'Key. Meaningful effect on linked entity.' :
          killImp === 'notable'? 'Notable. Small modifier on linked entity.' :
                                 'Minor. No engine effect.'
        }>
          <div style={{
            padding: '4px 8px', border: `1px solid ${BORDER}`, borderRadius: R.sm,
            fontSize: FS.xs, fontFamily: sans, color: INK, minWidth: 180,
            background: swatch['#FAF8F4'], fontWeight: 700,
            textTransform: 'capitalize', display: 'flex', alignItems: 'center',
          }}>
            {killImp}
          </div>
        </Field>
      )}
    </>
  );
}
