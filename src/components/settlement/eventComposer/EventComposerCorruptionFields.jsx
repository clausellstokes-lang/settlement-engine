/**
 * EventComposerCorruptionFields — the IMPOSE_CORRUPTION inputs: which criminal
 * organization corrupts the chosen NPC, and how far the rot reaches (the individual
 * alone, or their home institution in-chain). When the settlement has no criminal
 * organization the picker explains the prerequisite instead of offering an empty
 * select, so the action can never assemble a no-op. Extracted from EventComposer to
 * keep the parent under the line ratchet.
 */

import { MUTED, sans, FS } from '../../theme.js';
import { Field } from './Field.jsx';
import { selectStyle } from './EventComposerConstants.js';

export function EventComposerCorruptionFields({ criminalOrgs, criminalOrg, setCriminalOrg, corruptScope, setCorruptScope }) {
  return (
    <>
      {criminalOrgs.length > 0 ? (
        <Field label="Criminal organization" hint="The organization that corrupts the chosen NPC">
          <select value={criminalOrg || criminalOrgs[0]} onChange={e => setCriminalOrg(e.target.value)} style={selectStyle}>
            {criminalOrgs.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
      ) : (
        <Field label="Criminal organization" hint="No criminal organization in this settlement to corrupt through">
          <div style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, padding: '6px 0' }}>
            This settlement has no criminal organization. Add one (e.g. Organized Crime) before imposing corruption.
          </div>
        </Field>
      )}

      {criminalOrgs.length > 0 && (
        <Field
          label="Scope"
          hint={corruptScope === 'individual_institution'
            ? 'Their home institution is quietly compromised in-chain as well'
            : 'Only this individual is turned'}
        >
          <select value={corruptScope} onChange={e => setCorruptScope(e.target.value)} style={selectStyle}>
            <option value="individual">This individual</option>
            <option value="individual_institution">Individual and their institution</option>
          </select>
        </Field>
      )}
    </>
  );
}
