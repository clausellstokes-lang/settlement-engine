# PLACE-1 BUILD brief 2 — `economicState.activeChains[].entrepotNote` (the chain cards' entrepôt note)

Written by PLACE-1, `date -u` at writing: 2026-11-20T17:19Z. Read `BRIEF-BUILD-COMMON.md` FIRST and WHOLE (the how, the rules, the green, 5c the hideable condition), then `entrepotNote-MEASURE.md` WHOLE (your design), then every writer and reader file it names WHOLE (`src/data/supplyChainData.js` for the canonical notes, `src/generators/computeActiveChains.js`, `src/domain/facts/chainCarrier.js`).

## The chair's ruling, VERBATIM (17:18 UTC), on the lines at 0899d93e6 — it amends §D and binds every line you write
> ALL ROWS OF SECTION D ARE READ (ten chains). APPROVED TO BUILD with what follows.
> THE ATOM IS GRANTED: "ATOM carrier: own|transit : src/domain/facts/chainCarrier.js :: chainCarrierOf : chain-scoped". It is a fact the record holds.
> YOUR SIX CALLS: (1) approved: an own row names the carrier's own resource label from the record, never a fixed noun; (2) approved, AND WIDENED: wherever a chain can be the place's own, EVERY row that says the good comes from elsewhere ("comes in", "arrives", "from far away", "from distant lands", "bought in", "other places' goods", "meets here from several directions") declares `carrier: transit`: a port that takes its own salt must never be told its salt comes in by sea; (3) approved: row 0 is drawn only where its own route claim holds (truth outranks canonical-at-zero; a saved town keeps its stored note); (4) and (5) approved, with (5) as LIST, not red; (6) a named survivor: put it in your hand-back.
> EIGHT REWORDINGS:
> - salt-own-keep: "{resource} nearby supply the salt, for preserving food here and for selling on." (no "most of it".)
> - furs-port: "Furs are gathered here and shipped on by sea." (the record does not hold which way they travel.)
> - furs-own: "Many of the furs sold here are taken on the place's own {resource}."
> - furs-transit: "None of these furs are taken here; they come from hunting grounds elsewhere and are traded on."
> - lux-own: "The precious metal of {resource} nearby is the root of the luxury trade here." (no jeweller is presumed.)
> - silk-steady: "Fine cloth from far away is a steady trade here, silk among it." (no "most of it".)
> - wine-tavern: "Some of the wine coming through is drunk here over the tavern's counter; the rest is sold on." (one tavern or several.)
> - magic-own: "The enchanted goods sold here begin at {resource} nearby, and go on to buyers elsewhere." (no maker is presumed.)
> THREE CONDITIONS: (a) `lux-kinds` and `lux-market` name goods ("fine metalwork, jewellery"): they stand only if the chain's own record names those goods; otherwise they say "costly goods" alone. (b) THE SMUGGLING CHAIN: its rows are about crime; they are exempt from the hideable rule BY DECLARATION only because they print on that chain's own card and nowhere else: say in the hand-back, with the line of code, that a read which withholds the smuggling chain withholds its note with it, and list it for the security reader. (c) Print EVERY distinct {resource} fill inside its sentence over the 600 places; I read that list before the merge.
> THE KEYED PICK: `src/kernel/proseHash.js :: pickVariantMixed` (on PLACE-1's lane since 550d7d8b3).

## What this means for you
- The ATOM: append `carrier` (own|transit, chain-scoped, `needsContext: 'chain'` like `npc` and `pair`) at the END of its list in `src/domain/facts/factVocabulary.js`, nothing else in that file touched; its reader calls `chainCarrierOf(chain, record)`.
- (3) row 0: give the canonical note, WHEN DRAWN WITH A SEED, the route needs its own text claims (read each chain's canonical note in `supplyChainData.js`); seedless keeps it unconditionally.
- (b): the smuggling rows declare their chain's own scope; your final message cites the code (file :: symbol) where a read that withholds the smuggling chain withholds its note.
- (c): your final message points to a committed file `docs/chair/2026-11-20/content/place/tools/entrepotNote/resource-fills.txt`: every distinct {resource} fill inside its whole sentence over the 600 places, with counts.
- The pick: `pickVariantMixed`, key `` `${seed}::entrepotNote::${chain.chainId}` `` (the measure's §F, with the mixed pick).
- The note is written where §F says (one composer over the chains, after their final writer); a SAVED town keeps its stored note.
- The named survivor (`resourceDynamicsKernel.js` resets a stored note on a resource edit) is NOT yours: do not touch that file.
- The pinned row the measure names (`tests/generators/bar3PlacesRows.test.js` row C14378, its furs line) moves: re-record it in the same commit, by file and title, before and after.
- Red first: new `tests/generators/entrepotNoteSpread.test.js` (BRIEF-BUILD-COMMON §1's (a)–(d) on this field, the held note), committed alone first.

## Green, then hand back
`BRIEF-BUILD-COMMON.md`'s green, plus every test that names `supplyChainData`, `computeActiveChains`, `chainCarrier`, `factVocabulary` or `bar3PlacesRows`. List every house a row needs, pool by pool (tavern, bank, market…). The confinement run and the censuses are PLACE-1's at the merge.
