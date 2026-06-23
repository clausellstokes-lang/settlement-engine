/**
 * AddNpcTraitFields — the descriptive trait inputs for the ADD_NPC change.
 *
 * The NPC read card (new/npcComponents.jsx NPCInlineCard) displays flaw,
 * temperament, goal, constraint, and secret; the add flow used to collect only
 * name / importance / role / institution, so an authored NPC always rendered
 * those rows empty. These five free-text inputs let the author set exactly what
 * the card shows. Extracted from EventComposer.jsx to keep that file under the
 * max-lines ratchet; all state lives in the parent and arrives as props, so this
 * component is purely presentational.
 *
 * The fields are descriptive, not mechanical — none is required. ADD_NPC's
 * tangible effect (a resilience nudge scaled by importance) is unchanged.
 */

import { Field } from './Field.jsx';
import { inputStyle } from './EventComposerConstants.js';

export function AddNpcTraitFields({
  flaw, setFlaw,
  temperament, setTemperament,
  goals, setGoals,
  constraint, setConstraint,
  secret, setSecret,
}) {
  return (
    <>
      <Field label="Flaw" hint="A failing the table can lean on">
        <input value={flaw} onChange={e => setFlaw(e.target.value)} placeholder="optional" aria-label="Flaw" style={inputStyle} />
      </Field>
      <Field label="Temperament" hint="Their dominant manner">
        <input value={temperament} onChange={e => setTemperament(e.target.value)} placeholder="optional" aria-label="Temperament" style={inputStyle} />
      </Field>
      <Field label="Goals" hint="What they are working toward">
        <input value={goals} onChange={e => setGoals(e.target.value)} placeholder="optional" aria-label="Goals" style={inputStyle} />
      </Field>
      <Field label="Constraint" hint="What holds them back">
        <input value={constraint} onChange={e => setConstraint(e.target.value)} placeholder="optional" aria-label="Constraint" style={inputStyle} />
      </Field>
      <Field label="Secret" hint="Known only to the GM">
        <input value={secret} onChange={e => setSecret(e.target.value)} placeholder="optional" aria-label="Secret" style={inputStyle} />
      </Field>
    </>
  );
}
