/**
 * people/legacyShim.js — THE SHIM (the people car, PEOPLE-1 CAST, 2026-11-07; the chair's method
 * ruling M-2 in docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §2).
 *
 * @shim people-car (removed by PEOPLE-5)
 *
 * The owner removed the factions ("removing factions entirely" · "Ignore this, they can't work
 * anyway for the time being", ODQ §934.105): a card's standing in the powers is its `memberships`
 * (`[{ power, rank, share }]`, written by people/representatives.js from the backing catalogue).
 * Until PEOPLE-5 re-points every reader of the six old per-NPC faction fields, this ONE function
 * derives the two old fields from the memberships so every reader keeps working:
 *   factionAffiliation   = the rank-1 power's name
 *   secondaryAffiliation = the rank-2 power's name (absent where there is none)
 * and writes, ONLY where a reader would crash without it, the others — each listed here with the
 * reader that needed it (none at this lane's tip: `linkedFactionIds`, `factionGoal`,
 * `densityRungRole` and `structuralRank` are read through guarded accesses everywhere the
 * lane's suites and the soak 1,000 reached; `structuralRank` is still written by
 * npcStructure.js :: enrichNPCsWithStructure, which runs after this shim).
 * `settlement.factions` keeps being projected from `factionAffiliation` by
 * power/factionGrouping.js, unchanged, until PEOPLE-5 deletes both.
 *
 * A card with NO membership (a face of the place — a default-share house, a `noPower` house) has
 * no affiliation: the old fields are deleted, never guessed from a role keyword (the keyword
 * cascade of npcGenerator.js :: mergeNPCLists writes them BEFORE this shim and is overwritten).
 * A record with no `memberships` array at all (a pre-car NPC, a DM-authored person) is left as
 * it is. Pure: returns the same object, mutated, no draw.
 *
 * @param {Record<string, any>} card
 * @returns {Record<string, any>}
 */
export function shimLegacyFactionFields(card) {
  if (!card || typeof card !== 'object' || !Array.isArray(card.memberships)) return card;
  const first = card.memberships.find((m) => m && m.rank === 1);
  const second = card.memberships.find((m) => m && m.rank === 2);
  if (first?.power) card.factionAffiliation = String(first.power);
  else delete card.factionAffiliation;
  if (second?.power) card.secondaryAffiliation = String(second.power);
  else delete card.secondaryAffiliation;
  return card;
}
