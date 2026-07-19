/**
 * EventComposerSecondaryFields — the per-type secondary inputs that hang off a few
 * specific events: ADD_TRADE_GOOD (import/export direction + entrepôt handling),
 * APPLY_STRESSOR (the word-banded severity), CHANGE_RULING_POWER (how power
 * changes hands), and KILL_NPC (the read-only importance derived from the chosen
 * NPC). Grouped out of EventComposer to keep the parent under the line ratchet;
 * each block self-gates on `type`.
 *
 * OUR-floor adaptation: THEIRS renders a read-only DERIVED onset for APPLY_STRESSOR
 * (deriveStressorSeverity) and omits payload.severity so the domain derives it.
 * OUR domain has no such deriver — crisisOnset defaults 0.6 when severity is
 * omitted — so we keep the DM-picked, word-banded Severity select and buildEvent
 * emits payload.severity from it (STRESSOR_SEVERITY_VALUES). A UI-only wave must
 * not change authored-stressor onset math; porting derived onset is a domain wave.
 */

import { INK, BORDER, sans, FS, swatch } from '../../theme.js';
import { RULING_POWER_CAUSES } from '../../../domain/rulingPower.js';
import { inferImportance } from '../../../domain/entities/npcs.js';
import { Field } from './Field.jsx';
import { selectStyle } from './EventComposerConstants.js';

export function EventComposerSecondaryFields({
  type, tradeDirection, setTradeDirection, tradeEntrepot, setTradeEntrepot,
  stressorSeverity, setStressorSeverity, powerCause, setPowerCause, settlement, target,
  reliefMagnitude, setReliefMagnitude,
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
        <Field label="Handling" hint={tradeEntrepot ? 'Re-exported through the warehouses — listed as "(transit)"' : 'Produced locally'}>
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

      {/* APPLY_STRESSOR — word-banded severity (no 0-100 math at the table) */}
      {type === 'APPLY_STRESSOR' && (
        <Field label="Severity" hint={
          stressorSeverity === 'severe' ? 'A defining crisis — expect cascades' :
          stressorSeverity === 'minor'  ? 'A pressure, not yet a catastrophe'   :
                                          'A serious, active crisis'
        }>
          <select value={stressorSeverity} onChange={e => setStressorSeverity(e.target.value)} style={selectStyle}>
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </Field>
      )}

      {/* FORCE_RELIEF / OFFER_CREDIT — word-banded magnitude: the share of the
          ABOVE-FLOOR surplus the decree sends (FP-G3; the reserve floor is law) */}
      {(type === 'FORCE_RELIEF' || type === 'OFFER_CREDIT') && (
        <Field label="Magnitude" hint={
          reliefMagnitude === 'generous' ? 'Near everything above the reserve floor' :
          reliefMagnitude === 'token'    ? 'A token — enough to be remembered'       :
                                           'A measured share of the surplus'
        }>
          <select value={reliefMagnitude} onChange={e => setReliefMagnitude(e.target.value)} style={selectStyle}>
            <option value="token">Token</option>
            <option value="measured">Measured</option>
            <option value="generous">Generous</option>
          </select>
        </Field>
      )}

      {/* CHANGE_RULING_POWER — how power changes hands shapes the aftermath */}
      {type === 'CHANGE_RULING_POWER' && (
        <Field label="How" hint={
          powerCause === 'election'   ? 'A fresh mandate — legitimacy starts warmer' :
          powerCause === 'conquest'   ? 'Imposed from outside — legitimacy starts cold' :
          powerCause === 'succession' ? 'The line held; the household reorders' :
          powerCause === 'appointment'? 'Installed by a higher authority' :
                                        'Seized by force — loyalties re-sworn at swordpoint'
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
            padding: '4px 8px', border: `1px solid ${BORDER}`,
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
