READS WHOLE: `close-7/briefs/CURES-COMMON.md` first (it names what else you read), then this file. WINDOW: 1,000,000 tokens.

# CHAIN ONE: A1 (the healer), then A2 (rich and hungry), then B1(ii) (the furrows) (CLOSE-7; RULING-R24's R24-A1, A2, B1(ii))

## PHASE 1 — THE LISTS, READ ONLY (no file under src/ or tests/ changed; no commit). Then SEND TO THE CHAIR (stop).
Report `close-7/reports/CHAIN-1-LISTS.md`, three parts:
(a) A1, THE SERVICES THAT TEND THE SICK, as the flag would stand: one line a service NAME (as the catalogue row spells it), the
    catalogue file and row it sits on (`src/data/institutionServices.js` or wherever the row lives: say), its `desc`, and the
    houses that offer it. Start from READ-24's thirty (`read24/analyze.mjs :: SICK_CARE`); apply the chair's strikes already given
    ("Birth assistance" alone does not make a healer: mark it EXCLUDED with that reason; Burial, rites, alms, bathing, counsel
    never). Say where the flag would live (a field on the service's own catalogue row; never a list in a script) and how the one
    fact "sick care at hand" would be declared (its atom name, what record fields it reads: a sick house by name OR a resident
    service, i.e. its institution on the live roster, never an "Access to" row, carrying the flag).
(b) A1, EVERY LINE THAT SAYS NO HEALER STANDS HERE: H2, H3, H7, H8, H9 of `OUTSIDER_IMPRESSIONS['services.healing']` with their
    words, AND every other pool line your grep of `src/data` finds saying it (no healer, no physician, nobody to send for, nursed
    by family because none ...): file, key, words. Then: where the healing lens is strained AND sick care is at hand, which lines
    of the pool would remain eligible and TRUE. If none, write THREE CANDIDATE lines in the page's own voice (care is here, and
    stretched), each with the facts it needs; the chair rules the words.
(c) A2, THE TWO LISTS: every line of `src/data/dailyLife/foodCulture.js` and of `commonerResentments.js`'s food family, each
    classed SAYS SHORTAGE (people go short: small portions, thin stew, less to go round, hunger) or SAYS SOURCE (where food comes
    from: bought in, grown, fished), with its key and words and the fact it reads now. Say what the SHORTAGE lines would read
    instead (`economicState.foodSecurity`: which field, which values mean "short"), and how many lines of each class.
Final message: the three parts' counts, and any premise of the ruling found false.

## PHASE 2 — A1'S BUILD (on the chair's word, which CLOSE-7 brings you), in `/home/user/wt/a1`
The flag on the catalogue rows the chair kept; the one fact declared; every no-healer line excludes it; the pool holds a true
line where care is here and stretched (the chair's words if it ruled new ones). NOT IN THIS UNIT: the capacity's `healerCount`.
PROOF (R24-A1): red first on C dp-village-103, dp-town-144, dp-city-3 and V dp-village-83, dp-metropolis-114 by name; the page
battery's pattern "a no-healer line beside resident sick care", bar zero, on C and V; before/after counts and what else moved.
Then SEND TO THE CHAIR (stop): your final message is CLOSE-7's one line.

## PHASE 3 — A2'S BUILD (on CLOSE-7's word), in `/home/user/wt/a2`
Each SHORTAGE line reads the food ledger (`economicState.foodSecurity`), declared as its need; each SOURCE line keeps its reading.
PROOF (R24-A2): red first on V dp-city-83, dp-metropolis-57 and the twin of dm24-hamlet-1 (born as `read24/dm24-twins.jsonl`
says); the pattern "a shortage line on a place whose food ledger reads Secure", bar zero, C and V; HOW MANY PAGES' FOOD LINES
CHANGE on C and on V; the Daily Life slot's commonest-sentence share before and after (the sameness door's own slot reading,
`read24/dslots.mjs`). Then stop.

## PHASE 4 — B1(ii)'S BUILD (on CLOSE-7's word), in `/home/user/wt/b1ii`
Where the record says the grain is bought in (the same fact the grain line A12 reads: `'grain imported'`) and the place has no
farmland (say which fact you read for that, and that it is the record's), the `field` element weighs nothing in
`src/domain/traditions/genesis.js :: deriveFoundingTraditions`. Read first whether that step runs BEFORE the imports are written
(the order in `generateSettlementPipeline`): if it does, STOP and report the order, do not reorder. PROOF: red first on C dp-city-0
and V dp-metropolis-77; the pattern, bar zero, C and V; SAY WHETHER A BORN RECORD MOVES (the hashes) and which. Then stop.
