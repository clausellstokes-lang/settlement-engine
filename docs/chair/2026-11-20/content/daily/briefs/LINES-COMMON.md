# DAILY-1 · THE LINES' COMMON LAW (read by every line-drafting builder of DAILY-1; each rule vetoable by the owner)

THE OWNER'S WORDS (2026-11-20): "So do what you can to comprehensively fix the sameness fault as much as you can".
HIS STANDING RULES: "Don't invent drama capitalize on what's already there if it's there. Sometimes a calm place is
precisely what's needed… We are not creating the campaign."; "culture only shifts the weight of RNG, never determines it
by itself."

THE MEASURE YOU STAND ON: `docs/chair/2026-11-20/content/daily/measures/M1/SUMMARY.md` (read it whole; 109 lines) and
its script `measure.m1.mjs` (reuse its births and its record tests; do not rewrite them). The writer is
`src/domain/dailyLife.js` (read it whole). The slots are DERIVED AT READ, never stored (M1 table 4): no born town
moves, no golden moves.

1. TRUTH FIRST. A wording says only what the record holds. Every wording DECLARES its needs: a list of record tests,
   each read from a fact home under `src/domain/facts/` (`factsOf.js` names them: `defenceOf(r).walls`/`.gate`,
   `factsOf(r).guardPresence`, `hasInstitution(r, kind)`, `marketOf`, `waterOf`, `factsOf(r).foodSources`,
   `factsOf(r).prosperity`, `rulingBodyOf`, `rulerKindOf`, `factsOf(r).populationBand`, `timberAtHand`, …) or, where
   M1 found no home (bakery, bridge, square, warehouse), the nearest record field M1 used, named. A wording whose need
   fails is not eligible for that place. Today's text is NOT kept where it is false (truth outranks canonical-at-zero);
   where it is true it stays in the pool at index 0 of its branch.
2. SEVERAL WORDINGS A BRANCH, picked by `src/kernel/proseHash.js :: pickVariantMixed` over the ELIGIBLE wordings, the
   key `<record.name>::dailyLife.<slot>::<branch>` (M1 table 5: the name is served on every read; never `_seed`,
   never a person's id). No new draw.
3. THE BAR: no sentence printed by more than about 15% of ALL places of a size (places printing it / 150), on M1's 150
   a size; a top to 20% passes as sampling. By design a branch carries at least reach / 0.15 ELIGIBLE wordings at each
   size (reach = the share of that size's places taking the branch): 7 where every place takes it.
4. A HOUSE IN A SENTENCE takes its article and loses any bracketed qualifier: "the inn", never "the inn (multiple)";
   "the steps of the Great cathedral". Find the line's helper that already does this for house names (grep
   `src/domain/display/` for the qualifier strip and the article) and NAME it; write no new one if one exists. No new
   line says "town" or "a town" (a thorp is not one, nor a metropolis); prefer "the place", the size noun the record
   holds, or no noun.
5. A CALM PLACE STAYS CALM. A day's line is a plain remark, not a drama. A slot of trouble or grievance
   (`unspoken_topics`, `commoner_resentments`) says only a trouble or grievance the record already holds; where it
   holds none, the slot text is the EMPTY string (the page hides it), never invented. A wording never names the
   engine's working: no machine label ("civic stability at risk", "the matter referenced as", "has come to a head"
   said of a label), no score, no band word.
6. THE HIDEABLE RULE: no wording may NEED a house of a hideable kind (`src/domain/people/cardVeil.js ::
   isHideableHouse`: criminal or clandestine) or ANY fact about crime (criminal opportunity, corruption, smuggling, a
   crime structure). A house a wording names is chosen from the LIVE roster (`liveInstitutionNames` /
   `hasInstitution`) with hideable houses excluded. Every OTHER house a wording needs is LISTED in your file, slot by
   slot (the security reader tests that list at the join).
7. NEVER a season, a climate, a weather, a count of people or things, an age, a date. No vocabulary atom is written:
   if a line needs a fact no home answers, write the line to need none, or list it as "ATOM-WANTED <key> : <home> :
   <the wording>" for the chair (a fact the record already holds only).
8. THE STYLE: complete, plain sentences a DM can read aloud; the owner's register (calm, concrete, unshowy); British
   spelling as the line uses ("neighbour"); no em-dash pileups; each wording 8 to 30 words. Exemplars of lines the
   chair approved today: `git show origin/lane/depth-2-2026-11-20:docs/chair/2026-11-20/content/depth/lines/CONFLICT-LINES.md`.

WHAT YOU WRITE (under your brief's directory only): `LINES-<n>.md`, one section a slot: its branches (kept or
re-cut: say why), for each branch its wordings numbered, each with `needs: [...]` and the houses it names; and a
PROBE `probe.<n>.mjs` that imports M1's births (or copies them), applies the pools exactly as rules 1 to 3 say (the
eligibility filter, then `pickVariantMixed` on the key), and prints, by size over 150: the top single text share,
the distinct count, the min eligible count per branch, and the FALSE-LINE count by every M1 test (must be 0). Its
output `probe.<n>.out.txt`; its summary block at the top of `LINES-<n>.md` (a table, at most 15 lines). Nothing under
`src/`, `tests/`, `scripts/` changes; no commit, no push, no census, never the whole suite, never `npm run check`.
Every hour you write is read from `date -u` in the same command. Your final message: at most 200 words, outcome
first, the top share by size per slot, the paths, one CONFIRMED-vs-PLAUSIBLE sentence.
