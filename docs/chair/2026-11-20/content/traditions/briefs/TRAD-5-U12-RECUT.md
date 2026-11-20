# TRAD-5 · UNIT 12 — THE MEASURES ON THE FINAL LEAF; THE OWNER'S FOUR FILES RE-CUT ONCE; THE HOUSES THE POOLS NEED

Written 2026-11-20 19:18 UTC by TRAD-5 on the chair's order (18:44 and 18:57 UTC; vetoable by the owner). Docs and the lane's own tools
only: NO file under `src/` or `tests/`, no register. Base: `lane/trad-5-2026-11-20` at the commit your worktree starts
on (units 10 and 11 merged: the rotation, the keeper's "too", the founder phrase last, the leaf's `pickVariantMixed`).
The leaf: `src/domain/traditions/traditionDescription.js :: describeTradition`; its table
`src/data/traditionDescriptionTable.js`. The owner's words that bind the files: "Don't invent drama capitalize on what's
already there if it's there. Sometimes a calm place is precisely what's needed… We are not creating the campaign."

T=docs/chair/2026-11-20/content/traditions. Pools and rows live OUTSIDE the tree (a scratch dir of yours): never commit them.

## STEP 1 — RE-TAKE UNIT 6's MEASURES (every command of `$T/out-trad4/RUN.txt`, in its order, unchanged)
The calm pool and the five crisis pools (`trad-pool.mjs`); `measure2.mjs` owner and reader; `measure.mjs` rows for the
calm pool and each crisis pool. Write the measures to `$T/out-trad5/measure-owner.txt` and `measure-reader.txt` and the
commands you ran, verbatim with their exit codes, to `$T/out-trad5/RUN.txt`. If a tool reads the leaf's pick by
`pickVariant` anywhere (its own re-derivation of a draw), it must read `pickVariantMixed` as the leaf now does: say so and
fix the TOOL only (`$T/tools/*.mjs`); a ledger disagreement > 0 is a STOP.

## STEP 2 — THE OWNER'S FOUR FILES, RE-CUT ONCE, FROM THE SAME TOWNS
Make, beside the hand-backs, by the SAME rule and the same salts (never by hand):
- `TRAD-5-SAMPLES-30.txt` (as `TRAD-4-SAMPLES-30.txt`: `samples.mjs <calm rows> <out> 5`);
- `TRAD-5-SAMPLES-CRISIS-12.txt` (as `TRAD-4-SAMPLES-CRISIS-12.txt`: `samples.mjs --crisis …`);
- `TRAD-5-MEASURES.txt` (as `TRAD-4-MEASURES.txt`, the same headings, the figures re-taken);
- `TRAD-5-FOR-THE-OWNER-SHARED-PAGE.txt` (as `TRAD-4-FOR-THE-OWNER-SHARED-PAGE.txt`; its count, 0 of 432 born towns whose
  shared set is smaller than the owner's, RE-TAKEN if a tool under `$T/tools/` computes it, else marked "not re-run").
VERIFY "the same towns": list the (seed, rite id) pairs of the TRAD-4 cut and of yours; they must be equal (if the rule's
order depends only on seed and id, they are). If they differ, STOP and report.
EACH of the four files OPENS with ONE plain paragraph for the owner (no code names, no symbols, at most 120 words): what
moved since the first cut, by cause: (1) no town prints the same sentence in two of its rites (a second rite takes the next
wording; a keeper's fourth and fifth rite read "…too"; where the payer's wordings run out a rite leaves the payer out);
(2) no first sentence says "kept" twice; (3) the founding sentence ends on who founded the place ("It goes back 120 years,
to the founding of X by …"); (4) the wordings are now spread more evenly (the commonest feast opening fell from 55% to
about a quarter of feast rites). Give the counts behind each from your measures, and say plainly that nothing new was
invented: every sentence still states only what the town's record holds.

## STEP 3 — THE HOUSES THE POOLS NEED (for the security reader at the join)
In `$T/out-trad5/HOUSES.txt`: every house a wording of the table needs or names — `KEEPER_HOUSES` (by element),
`RELIGIOUS_HOUSES`, `MARKET_PLACES`, every `needs` atom that reads a house (`institution: …`, `market`) — one row each:
the house's catalogue name, its catalogue id (`src/data/institutionalCatalog.js :: catalogIdForName`), the elements or
slots that need it, and `isHideableHouse` (`src/domain/people/cardVeil.js`, CALLED, never copied) TRUE or FALSE. Any row
TRUE is a STOP (the lane's floor must exclude the hideable class): report it, do not change source. Also one line: does any
wording read a FACT ABOUT CRIME (a criminal income, a crime house, a criminal power)? By grep over the leaf and the table,
quoted.

## Report (at most 200 words)
The headline figures before (TRAD-4's cut) → after: shares (keeper, cause, payer, short) owner and reader; distinct
descriptions; top repeat; the most dominated slot; "A common feast" share; towns printing a sentence twice (0 expected);
the same-towns check; HOUSES.txt's row count and hideable count. Commit by explicit paths, one commit, message with the
receipts and the session trailers. Never push.
