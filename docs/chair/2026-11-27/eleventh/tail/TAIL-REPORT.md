# TAIL-CENSUS report (tree 1f946c43f1, /home/user/wt/line; read only, no test run)

## Counts
The class table has 19 TOWN PAGE rows. They come to 18 sites, because stateProseKernel's two rows are one fallback. G76 (D)'s 7 callers add 6 more: traditionDescription :: drawTurn is in both lists. That makes 24 sites (rows 1 to 24 of TAIL-SITES.tsv).
- COVERED by point 120: 1 (dossierViewModel :: pickTrue, one of the viability picks).
- OUT: 8 (rows 1, 2, 5, 6, 7, 8, 11, 16). Each prints only after an advance, on the map or war tab, or from a campaign ledger.
- LEAVE: 3 (row 9 drawConnective: dormant, G79 (5); row 10 the vid-less fallback: no town-page pool reaches it; row 14 fedLineOf: not a hash pick).
- CONVERT: 12 (rows 3, 12, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24).
- Found outside the census's `% length` pattern: arrangementOf and drawFace. Both are LEAVE.

## Units of work, in build order
1. FORTUNE (rows 22 and 23). The ids already exist (A/B/C, A/B/C/both). This is a swap to pickRendezvous, about 6 lines. It proves the pattern.
2. HOOKS (rows 12 and 13, hookLines.js). The 41 inline lines become id rows, about 70 lines. The conflict pick's "next line for the family's next conflict" rule needs a rendezvous rank: take the highest-hash id not yet used.
3. TRADITION DESCRIPTION (rows 17 and 18). About 144 data rows get ids, about 160 lines. drawTurn's walk in pool order becomes a walk down the rendezvous rank. The 10 twins also take ids.
4. TONIGHT CAST WANTS (row 15), about 25 lines. The pick becomes a rendezvous over the admitted lines. CAST_WANTS_HELD_SEAT changes from a position to an id.
5. PAGE FRAMES (rows 3, 19 and 24: ring vantage, PDF headlines, quick guide), about 50 lines. Each list is moved out to module level as `{id, say}` rows. The ring's `[1]` test is keyed by id.
6. TENSION CAUSE (rows 20 and 21), about 160 lines. It prints nowhere today, so converting it moves 0 towns. Build it before the release or together with its wiring.

## What the id guard must learn
It needs new scopes: fortune.merit, fortune.lasting, hooks.conflict, hooks.foodGap, traditionDescription, tonight.castWants, defense.organizedRing, pdf.headlines.<chapter>, quickGuide.scopeLine and tensionCauses.<kind>. Each id must be unique within its scope. tensionCauses ids repeat across kinds (rival_power, outranked), so that scope must be per kind.

Every pool here can be read at run time once it is exported as rows. That removes the need to read source text. The hook closures and the headline closures stay functions, but under ids in exported objects. The guard walks the imported module, not the file text. This is VIABILITY-ROWS-AS-DATA's cure, applied from the start.

FRAMES and SOURCE_PHRASES (fedLineOf) should be held append-only. Stored foodways lines are parsed against them.

## Cost measure still owed
A scratch build of the 12 conversions, then the eight test directories run against the base. NOT run here: the chair runs it when the test gate is free. My guess at the stale tests is from the greps: about 15 to 25 files, mostly traditionDescription, headlines, the cultureScopeLine terrain tests and plot-hook flows.

## Not decided
- Whether tensionCause is wired before the release.
- The conflict-hook "used" rule: whether line order on a page may change.
- Shared-page traditions are stored at save, so they will disagree with the owner's page until the next save (the A18 kind).
- Several keys hold the town's or a person's NAME: foodGap, the headlines, tensionCause, fortune. That belongs to RENAME-REDEALS, not here.
- The economics headline's key has no town in it at all.
