/**
 * EventComposerCorruptionFields — the IMPOSE_CORRUPTION inputs: WHO benefits (the
 * beneficiary picker — this settlement's own underworld, or a foreign court), which
 * criminal organization corrupts the chosen NPC (local path), and how far the rot
 * reaches (the individual alone, or their home institution in-chain). When the local
 * path has no criminal organization the picker explains the prerequisite instead of
 * offering an empty select, so the action can never assemble a no-op. Extracted from
 * EventComposer to keep the parent under the line ratchet.
 *
 * W-DOCTRINE-3b §6 — THE BENEFICIARY (DESIGN_CORRUPTION_WEB.md §6): the leash generalizes.
 *   • "This settlement's underworld" (default) ⇒ the LOCAL path, BYTE-IDENTICAL to before
 *     (buildEvent stamps criminalInstitution + scope, no leash key).
 *   • A foreign court ⇒ a foreign_settlement leash (buildEvent stamps payload.leash); the
 *     channel requirement REPLACES the local-org rule — no local underworld is needed. The
 *     beneficiary identity rides the DM-truth leash ONLY; publicNpc never projects it.
 *
 * Scope 'individual_institution' drives the covert home-institution impairment in
 * mutateEntities.js imposeCorruption: a 'corruption'-typed, covert:true setback.
 */

import { MUTED, sans, FS } from '../../theme.js';
import { Field } from './Field.jsx';
import { selectStyle } from './EventComposerConstants.js';

export function EventComposerCorruptionFields({
  criminalOrgs, criminalOrg, setCriminalOrg, corruptScope, setCorruptScope,
  foreignSettlements = [], corruptBeneficiary = '', setCorruptBeneficiary,
}) {
  const isForeign = typeof corruptBeneficiary === 'string' && corruptBeneficiary.startsWith('foreign:');
  const foreignName = isForeign
    ? (foreignSettlements.find(o => `foreign:${o.id}` === corruptBeneficiary)?.name || 'a foreign court')
    : null;

  return (
    <>
      {/* THE BENEFICIARY — who holds the leash. Only offered when foreign courts are known. */}
      {foreignSettlements.length > 0 && (
        <Field label="Beneficiary" hint="Who benefits: this settlement's own underworld, or a foreign court">
          <select value={corruptBeneficiary || ''} onChange={e => setCorruptBeneficiary?.(e.target.value)} style={selectStyle}>
            <option value="">This settlement&rsquo;s underworld</option>
            {foreignSettlements.map(o => (
              <option key={o.id} value={`foreign:${o.id}`}>{o.name} (foreign patron)</option>
            ))}
          </select>
        </Field>
      )}

      {isForeign ? (
        <Field label="Criminal organization" hint="A foreign leash needs no local organization. The channel is the patron court">
          <div style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, padding: '6px 0' }}>
            The rot is leashed to <strong>{foreignName}</strong> through a covert channel. No local organization is required.
          </div>
        </Field>
      ) : criminalOrgs.length > 0 ? (
        <Field label="Criminal organization" hint="The organization that corrupts the chosen NPC">
          <select value={criminalOrg || criminalOrgs[0]} onChange={e => setCriminalOrg(e.target.value)} style={selectStyle}>
            {criminalOrgs.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
      ) : (
        <Field label="Criminal organization" hint="No criminal organization in this settlement to corrupt through">
          <div style={{ fontSize: FS.xxs, fontFamily: sans, color: MUTED, padding: '6px 0' }}>
            This settlement has no criminal organization. Add one (e.g. a Thieves&rsquo; Guild) before imposing corruption, or choose a foreign patron above.
          </div>
        </Field>
      )}

      {(isForeign || criminalOrgs.length > 0) && (
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
