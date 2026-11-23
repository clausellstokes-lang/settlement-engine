# PROSE-E PHASE 2: the builder's report (PROSE-6; brief `briefs/PROSE-E.md` aa36b32a5 with AMENDMENT 1 at 2d544ea83; lines FINAL at 24d8edf83)
Lane `lane/prose-6-2026-11-23-e-wip`, base b443be64b. Logs are `/home/user/logs/prose-e2-*.log`. Every run went through `gate-mutex.sh --run`.

## 0. WHY NO-MARKET v12 "NEVER DRAWS": IT DOES (N71 ruled the stop)
- The draw is the argmax of `hashKey(seed::block::pool::v<vid>)` over the eligible set (`stateProseKernel.js:536-555`). The general desk passes each page's own seed (`generalStateProse.js:1873, 2159`).
- v12's marks (`no market · no crisis: under_siege`) are those of v3 and v7-v11, so v12 is eligible on every NO-MARKET page outside a siege. On the 900 it draws on 46 pages, every one beside ECO-10 `established` (`prose-e2-v12-probe.log`).
- The site mount cuts it at ", and" (`generalDeskRead.js:184-188`, applied at :372). It prints "{settlement} has no market." (dz-thorp-2, dz-thorp-11).
- Phase 1 counted 0 because the matcher drops cuts under four literal words (`oppositeSentencePairs.mjs:97`), and "has no market" has three.

## COMMITS
c0514e27e the tooth, alone, red first; 678d8d255 the cure (five WORD_CORRECTIONS rows, `CHAIR-2026-11-23-N70`; source; leaves); 887d1f760 the pins and the FLOOR figure in the tooth's header; this report.

## (a) THE TOOTH: RED, THEN GREEN
On b443be64b's leaves only ARM 5 is red: 34 page-pins (`prose-e2-tooth-red.log`).
- NO-MARKET v10: dz-thorp-27, -5, -43, -33, -14, -17, dz-hamlet-2, -4, dz-village-4.
- full legal chain v1: dz-city-124, -19, -7, -2, -5, dz-metropolis-1, -4.
- full legal chain v2: dz-city-54, -63, -32, -40, -50, -0, -4, dz-metropolis-6, -0, -3, -5.
- CHAIN working v1: dz-city-32, -124, -50, -1, -2, dz-town-3.
- CRITICAL v1: dz-village-7.
ARMs 1-4 were green: the watched CRITICAL v2-v3 × GARRISONED v1 row read 0; v12's tail read 0 with its head found. After the cure: 6 of 6 green (`prose-e2-tooth-green.log`).

Tooth changes beyond the brief:
- `oldWordsMatchersOf` skips a cut that the new words also yield. CHAIN v1 keeps "{settlement}'s food trades are working,".
- ARM 3 finds a head printed under the floor by the draw ledger plus the page's `siteClause` cut of the text.
- Controls: dz-thorp-2 (CRITICAL v2), dz-thorp-3 (CRITICAL v3), dz-village-7 (GARRISONED v1).

## EVERY FORM THE PAGES PRINT (900 births at the tip, `prose-e2-forms-tip.log`; readers: `siteClause`, `weaveBlock.js:244`'s opening-name stand-down, the composer's joints `composeStateProse.js:801`)
- NO-MARKET v10, `overview.market`, always cut by `siteClause` at ", so" (55 pages): "There is no market at {settlement} to gather its trade in one place."
  - Beside ECO-10 `established` v1, v3, v4, v5, v6, v9: NOT. It denies the institution, not trade.
  - The whole line never prints. If it did, "a buyer deals with each seller at their own door" would also read NOT.
- full legal chain v1, `defense.threatAssessment`, whole, with no joint on any of its 97 pages (defense has no clause cut): "Offenders brought in at {settlement} are heard and held, and each case is written down, so the accused can expect a hearing, not a beating."
  - Beside DEF-3 Unsafe v1, v2, v3: NOT. It speaks only of those brought in.
  - Its first clause alone, which no reader prints: NOT.
- full legal chain v2, the same mount, whole (88 pages): "A case that reaches the court at {settlement} gets a hearing, and it is settled there rather than by the watch's temper."
  - Beside Unsafe: NOT; its first clause alone also NOT.
- CHAIN working v1, the same mount, whole (56 pages): "{settlement}'s food trades are working, and what they put by would give it something to fall back on if it were cut off."
  - Beside ECO-9 PRESSURED v1 (short each season) and v2: NOT. It claims stores to fall back on, not that the town is never short.
- CRITICAL v1, the same mount, whole, with the subject stood down to the tier noun (23 pages): "The village cannot fund a new response to trouble, and any sustained pressure exhausts what it has almost at once."
  - Beside GARRISONED v1, cut at ";" ("The village keeps people under arms for its defence."): NOT. A standing force is not new money.

## (b) THE 900, `disagree-e-phase1.mjs` ON THE TIP (`prose-e2-phase1-tip.log`, 198.2 s)
- The old words: 0 pages. `OPPOSITE_PAIRS` {} and `PINNED_OLD_WORDS` 0, so the watched row is 0. v12's tail: 0 (the tooth).
- The same 14 variant pairs on the same pages, now in the new words, one page of each re-read:
  - P1 v10 × ECO-10 v5, v6, v4, v3, v1, v9: 13/13/9/7/6/2 pages (dz-thorp-27, -5, -43, -33, -14, -17). NOT: no market institution; buyers still come.
  - P2 Unsafe × full legal chain: v3×v2 4, v2×v2 3, v1×v1, v1×v2, v2×v1, v3×v1 1 each (dz-city-63, -32, -124, -40, -19, -7). NOT: the court's cases only.
  - P3 dz-city-50: NOT (stores to fall back on). P4 dz-village-7: NOT, as above. Any TRUE: none.

## (c) NO CELL LEFT EMPTY: `disagree-phase2.mjs` (c2) on the tip gives WEAK 353 held, 0 empty; GARRISONED 153, 1 (dz-city-101); CHAIN 75, 0. The same as at b443be64b. No mark moved: the leaf diff is five `text` lines.
## (d) DARK PROOF (`prose-e2-dark.log`): both trees give sha256 `f2ecb50cc3d3ea579de0d07a67a4cd31498e03fee01c62a9a06dc740c65c05b9` over 900 births: EQUAL. 0 births differ and 0 strings differ, because the records carry none of the dossier's sentences.
## (e) CONTROL 4, MEASURED (`prose-e2-control4.log`, the test's own helpers)
- The three figures hold: repeatedOpener 166; share × 800 154; share 0.193 (166 / 861).
- BUT the uniform-segment figures move: uniformSegments 577 → 578; 0.670 → 0.671 (578 / 861 = 0.67131); × 774 519 → 520. So both CONTROL 4 tests red.
  - The pool: DS-DEF-2 `Economic Survival: CRITICAL`. v1 was two sentences and is now one, as the chair's words have it, so every variant is one sentence and the pool joins the uniform count.
  - NOT re-pinned: these are not pins on the old words. FOR THE CHAIR.

## (f) THE WHOLE CHECKS
- Rule 8 (`prose-e2-rule8.log`): 101 files named; the 71 test files outside `tests/lint`, with `tests/copy`: 1,613 tests, 1 red, voiceMechanics, on RED-AT-LINE.
- `tests/copy`, `tests/store`, `tests/architecture`, `tests/docs`: 2,035 tests, 2 red, both on RED-AT-LINE (voiceMechanics, deadOperationRatchet).
- `tests/lint` whole: 3,364 tests, 6 red.
  - On RED-AT-LINE: proseCorpusBytes RAW and GZIP; proseComposed A0b.
  - NOT on the line, and caused by this cure: proseMoveGrammar CONTROL 4 and its SECOND HALF, see (e); observedShapeReaders' live-estate drift, see the registers.
- `npm run build` exit 0. `VERIFY_DIST=1 tests/build`: 623 tests, 15 red, all on RED-AT-LINE. Here / the line: first paint raw 1,184,741 / 1,184,741; gzip 376,999 / 376,987; Brotli 316,583 / 316,646; worker 2,709,263 / 2,709,263; engine chunk 932,369 / 932,369.
## (g) GIT: `core.bare` false; local `user.name` unset; 0 commits by Fixture in the last 3 hours. (Green, so not listed above: the shift register, the lighting census, the wiring census.)

## THE REGISTERS THAT RED BECAUSE OF THIS CURE (none re-taken)
- Observed-shape baseline: `observedShapeReaders` "a freshly re-minted baseline has NO drift": input drift [] → [the defense and general leaves].
- The owner's size rows, NAMED and untouched:
  - proseCorpusBytes RAW: defense 302,541 → 302,506; general 312,515 → 312,509.
  - GZIP: defense 40,039 → 40,020; general 39,500 → 39,492.
  - A0b under-claim: 2,328 → 2,327.

## PINS, BEFORE → AFTER
- law9 :104: "people expect a hearing, not a beating" → "(?:people|the accused can) expect a hearing, not a beating". Its meaning, calm-law prose, is kept.
- bar8DesksDef :8, :64, :187: v1 "arrested, heard and held" → "heard and held", the re-wording named; v2's old words named as history. The rows read marks by vid, unchanged.
- corpusCureGuards :72: it has no `gone`. It guards CHAIN working v1's `no crisis: famine` by vid, and it still holds; its `why` names the re-wording.
- law13K :22, :33: unchanged; "heard and held" and "expect a hearing" are still in v1.
  - Noted, not built: v2 now asserts a court too ("reaches the court"); v2 declares `court`.
- generalStateProseDesk :500-512 (T1-13): unchanged and green.
- Other hit: corpusEcoTailGuards :103, v10's `gone` /house to house and on the road/ at r2r-thorp-17: holds (137 of 137, `prose-e2-ecotail.log`).
## REFUSED: nothing.
