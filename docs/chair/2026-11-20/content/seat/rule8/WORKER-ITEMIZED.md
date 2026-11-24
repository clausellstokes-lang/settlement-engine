# THE GENERATION WORKER'S +15,961, ITEMIZED EXACTLY BY SOURCE FILE (SEAT-10; the chair's order of 07:20Z)

Written 2026-11-22T07:24:18Z (`date -u`). CONFIRMED by run.

## THE METHOD

- **Two sourcemapped builds**, each in a scratch clone and run through the mutex: `node node_modules/vite/bin/vite.js build --sourcemap`.
  - The line: `f5295e425`, 07:20:41Z to 07:21:48Z.
  - The lane: `46339e5c7`, 07:21:48Z to 07:22:55Z.
- **The workers:** `generation.worker-*.js` is 2,671,060 at the line and 2,687,021 at the lane. Each is 55 B over its plain build (2,671,005 and 2,686,966): the `sourceMappingURL` comment. So the delta is the same **+15,961**.
- **The attribution:** `smattr.mjs` (beside this file) decodes each map with `@jridgewell/sourcemap-codec`. It gives every mapped segment's UTF-8 bytes to its source file, and the newlines and unmapped bytes to their own rows. Both bundles are attributed to the byte (sum = file size). The per-source differences sum to +15,961 exactly. The full table is `worker-by-source.tsv`.

## THE ITEMS (line → lane, bytes in the worker)

| source | line | lane | delta | why it is in the worker |
|---|---|---|---|---|
| `src/data/cultureOfficeTitles.js` | 0 | 9,369 | **+9,369** | NOT a file the lane changed. TITLES-3's table (on the line) is pulled in by the lane's `seat/holderOfSeat.js :: isSovereignSeat` reads (`officeFamilyOfForm`, `officeTitleOf`, `officeWordInfo`; `holderOfSeat.js:81`) |
| `src/domain/seat/holderOfSeat.js` | 0 | 3,562 | +3,562 | the lane's U3 (the holder) |
| `src/domain/seat/seatTable.js` | 0 | 3,302 | +3,302 | the lane's U2 (the table and the kind) |
| `src/domain/rulingPower.js` | 3,022 | 1,619 | −1,403 | the lane's moves out of it (U2/U3) |
| `src/domain/seat/seatCircumstances.js` | 0 | 478 | +478 | U4 (the contest's dial and table) |
| `src/generators/npc/powerBand.js` | 0 | 426 | +426 | UK-CURE's leaf |
| `src/domain/seat/seatLaw.js` | 0 | 358 | +358 | U1 (the law) and UK-LEGACY's `withRecordSeatLaw` |
| `src/generators/npcGenerator.js` | 20,053 | 19,747 | −306 | UK-CURE's move to the leaf |
| `src/domain/rulingPowerCoup.js` | 1,187 | 1,245 | +58 | U4 |
| 9 other sources | — | — | +117 in all | name mangling and import plumbing (each ±33 or under; the table holds each) |
| **total** | | | **+15,961** | |

## FOR THE OWNER'S SIZE SIGN-OFF

- **Covered by no ruled exception:** the worker's +15,961.
- **Of it, +9,369 (59%) is ONE line table the lane reaches:** `cultureOfficeTitles.js`, through a three-name read in `holderOfSeat.js :: isSovereignSeat`.
- **The rest, +6,592, is the seat train's own modules, net of what they moved out.**
- **A decomposition for after the deploy** (recorded, not built; the chair's): the sovereign-seat read's three words could come from a small leaf, so that the worker does not carry the whole office-title table. That is the owner's and the chair's call.
- **Not first paint:** `cultureOfficeTitles.js` is in none of the first-paint chunks of either build. The lane's first-paint rise (+3,818 raw) remains the ruled exception: in the first-paint chunks, `seatTable.js` is 4,074 and `seatLaw.js` 510.
