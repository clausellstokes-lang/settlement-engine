// BIRTH-1: every card and tie of a birth, whole (for a field-by-field diff of the cards a unit moves). Read only.
export function measure(town) {
  return { npcs: town?.npcs ?? [], relationships: town?.relationships ?? [], pr: town?.prominentRelationship ?? null, ps: town?.pressureSentence ?? null };
}
