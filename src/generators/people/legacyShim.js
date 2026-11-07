/**
 * people/legacyShim.js — THE SHIM (the people car, PEOPLE-1 CAST, 2026-11-07; the chair's method
 * ruling M-2 in docs/chair/2026-11-07/PEOPLE-RULINGS-2026-11-07.md §2).
 *
 * @shim people-car (removed by PEOPLE-5)
 *
 * The owner removed the factions ("removing factions entirely" · "Ignore this, they can't work
 * anyway for the time being", ODQ §934.105): a card's standing in the powers is its `memberships`
 * (`[{ power, rank, share }]`, written by people/castPowers.js from the backing catalogue).
 * Until PEOPLE-5 re-points every reader of the six old per-NPC faction fields, this ONE function
 * derives the two old fields from the memberships so every reader keeps working:
 *   factionAffiliation   = the card's FIRST power — the power it ranks best in (rank 1 before 2
 *                          before 3 before none; a tie broken by the power's place in the
 *                          roster, the governing seat first), so the seat's face is read in the
 *                          governing power and every member is grouped under some power;
 *   secondaryAffiliation = its SECOND power by the same order (absent where there is none).
 * The others — `linkedFactionIds`, `factionGoal`, `densityRungRole`, `structuralRank` — are
 * written only where a reader would crash without them, each listed here with the reader that
 * needed it: NONE at this lane's tip (every read of them the lane's suites and the soak 1,000
 * reached is guarded; `structuralRank` is still written by npcStructure.js ::
 * enrichNPCsWithStructure, which runs after this shim). `settlement.factions` keeps being
 * projected from `factionAffiliation` by power/factionGrouping.js, unchanged, until PEOPLE-5
 * deletes both.
 *
 * A card with NO membership (a face of the place — a default-share house, a `noPower` house) has
 * no affiliation: the old fields are deleted, never guessed from a role keyword (the keyword
 * cascade of npcGenerator.js :: mergeNPCLists writes them BEFORE this shim and is overwritten).
 * A record with no `memberships` array at all (a pre-car NPC, a DM-authored person) is left as
 * it is. Pure: returns the same object, mutated, no draw.
 *
 * @param {Record<string, any>} card
 * @param {string[]} [powerOrder] the powers' roster order (the tie-break); the memberships' own order without it
 * @returns {Record<string, any>}
 */
export function shimLegacyFactionFields(card, powerOrder = []) {
  if (!card || typeof card !== 'object' || !Array.isArray(card.memberships)) return card;
  const place = (power) => { const i = powerOrder.indexOf(power); return i < 0 ? powerOrder.length : i; };
  const rankOf = (m) => (m && Number.isInteger(m.rank) ? m.rank : Number.MAX_SAFE_INTEGER);
  const ordered = card.memberships
    .map((m, at) => ({ m, at }))
    .filter(({ m }) => m && typeof m.power === 'string' && m.power)
    .sort((x, y) => (rankOf(x.m) - rankOf(y.m)) || (place(x.m.power) - place(y.m.power)) || (x.at - y.at))
    .map(({ m }) => m.power);
  if (ordered[0]) card.factionAffiliation = ordered[0];
  else delete card.factionAffiliation;
  if (ordered[1]) card.secondaryAffiliation = ordered[1];
  else delete card.secondaryAffiliation;
  return card;
}
