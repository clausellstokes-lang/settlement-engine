# ANCHORS (CLOSE-7): DONE. Two cures, three reports, the three figures. Paused for GUARD-2 (R24n), then resumed.

- Tree: `/home/user/wt/anchors`, branch `lane/close-7-2026-11-24-anchors-wip`, cut at 97c6bfc7a. Not pushed. Test files only.
- Commits, one per file:
  - **8c4614871:** bar6ScenesGoods B7.
  - **bd99fa7b6:** bar8DesksEco 11c.
- The probes are in the scratchpad's `ANCH/` folder:
  - `probe.census.jsx` and `probe2.census.jsx`.
  - The archives `pre` (0ec96f13d), `t-fca95c197p` and `t-fca95c197`.
  - The records in `out-pre/`, `out-tip/` and `out-find/`.

## (a) THE FIVE
1. **dossierPhoneFloorAllViews, MOBILE_BASELINE: NOT CURED. A baseline that MOVED.**
   - **Cause (CONFIRMED by run):** A2's R24h commit fca95c197 ("no food grievance where the page prints the place fed").
     The test is green at fca95c197^ (2/2) and red at fca95c197 (2/2) on archives. This agrees with BIRTH-1's reading (the
     resentment slot emptied).
   - **First twelve lines of the failure:**
     ```
     FAIL  tests/components/dossierPhoneFloorAllViews.test.jsx > THE PHONE FLOORS — every dossier view > every line in every tab clears its floor (prose 14px, chrome 12px) at phone width
     AssertionError:
     MOBILE_BASELINE mismatch. Each row counts the lines this view gave a reader at 375px, split by the class each was judged as, with the two sub-floor counts that must stay zero.
     A number that FELL means a surface stopped rendering or a fold stopped opening — which "zero violations" cannot see. A number that ROSE means new lines; say so.
     Deliberate? Re-measure, re-record MOBILE_BASELINE in the same car, and name the cause in the commit message.
     : expected { 'Summary/Overview': { …(4) }, …(19) } to deeply equal { 'Summary/Overview': { …(4) }, …(19) }
     - Expected
     + Received
         "World/Daily Life": {
           "chrome": 0,
     -     "prose": 9,
     +     "prose": 8,
     ```
2. **dossierPhoneFloorAllViews, DESKTOP_BASELINE: NOT CURED.** The same walk and the same cause, CONFIRMED by the same pair
   of runs.
   - **First twelve lines:**
     ```
     FAIL  tests/components/dossierPhoneFloorAllViews.test.jsx > THE PHONE FLOORS — every dossier view > desktop is untouched — the SAME walk, pinned to DESKTOP_BASELINE
     AssertionError:
     DESKTOP_BASELINE mismatch. Each number counts lines rendered ABOVE the breakpoint, so a diff means an FS token, a fold or a surface moved on desktop — which proseFontSize/chromeFontSize (identity when mobile===false) must never do.
     Deliberate? Re-measure, re-record DESKTOP_BASELINE in the same car, and name the moved token in the commit message.
     : expected { 'Summary/Overview': { …(2) }, …(19) } to deeply equal { 'Summary/Overview': { …(2) }, …(19) }
     - Expected
     + Received
         "World/Daily Life": {
     -     "measured": 9,
     -     "sub14": 9,
     +     "measured": 8,
     +     "sub14": 8,
     ```
3. **traditionsSameWindowChain soak1k-5255: NOT CURED.**
   - **Cause (CONFIRMED by run):** B1(ii)'s `genesis.js` (the field weight in the addition draw). The birth is byte-identical
     before and after the BATCH merge (`out-pre/` and `out-tip/` soak5255.json are identical). The traditions derived from it
     differ in one place: the seventh, "The Bright Forge Feast" [forge], becomes "The Bright Market Feast" [market].
     - The place buys its grain and holds no farmland, so `fieldsBoughtIn` holds and the addition draw re-deals.
   - **Why it is not cured:** the window no longer holds three traditions. The test has no finder, and its three assertions
     name this seed's own traditions, so no re-pick keeps them word for word.
   - **First twelve lines:**
     ```
     FAIL  tests/components/traditionsSameWindowChain.test.jsx > X-50: three traditions in one window print three different calendar lines > soak1k-5255: the window prints once, and each later card names the nearest earlier one
     AssertionError: expected +0 to be 1 // Object.is equality
     - Expected
     + Received
     - 1
     + 0
      ❯ tests/components/traditionsSameWindowChain.test.jsx:43:91
          41|     expect(countOf(text, 'Kept in Deepwinter, the thirteenth week.')).…
          42|     expect(countOf(text, 'Kept in the same week as The Common Offering…
          43|     expect(countOf(text, 'Kept in the same week as The Contest of the …
            |                                                                                           ^
          44|   });
     ```
4. **bar6ScenesGoods B7: CURED (8c4614871).** A stale anchor.
   - **Cause (CONFIRMED by run):** r2s-religious_conversion-metropolis-0 reaches its kilns only as `lines` after the merge.
     Its houses are unchanged (Potter, Brickmaker, Glassmakers); its trade words moved. Metropolis-1 to -3 do the same.
   - **Re-picked** from the file's own SEEDS (the census's 720): the first r2s metropolis whose kilns' dominant pool is
     reached, **r2s-famine-metropolis-0** (kilns.dominant 3).
   - This is a JUDGEMENT: the same arm and size, another crisis.
   - The assertion is word for word. The file is 11/11.
5. **bar8DesksEco 11c: CURED (bd99fa7b6).** A stale anchor.
   - **Cause (CONFIRMED by run):** bar0-town-calm-rand-46 is a C1 carrier ("Corrupt Council" → "Council of Aldermen", R24m's
     accepted re-deal). Its lens good moved from clay, not brought in, to grain, brought in.
   - Of the seventh read's thirty (ten shapes × rand-45/46/47), only city-wartime-47, already the row above, holds a good
     that is not brought in.
   - **Re-picked** in the same shape's own series past the thirty: **bar0-town-calm-rand-136**, the first N with clay not
     brought in. EQUAL_SEEDS follows it ("the three above").
   - This is a JUDGEMENT: the thirty hold none.
   - Every assertion is word for word. The file is 10/10.

## (b) THE THREE FIGURES (NOT TOUCHED)
Each is an exact pin in its test file and reds in both directions. None has a door: each is re-keyed by identity at a round's
close on the owner's word. Each moved at the B1(i) merge: red at 9d8c944a3, green at the cut 0ec96f13d (CONFIRMED by runs on
archives, in BATCH).
- **editCorpusRatchet A4** (line 448), declared-only rows: {E7: 32, E8: 10} → {E7: 29, E8: 9}. It FELL.
- **editCorpusRatchet A5** (line 493), non-commuting seat pairs: E1|E6, E2|E6, E6|E1 and E6|E2 each went 6 → 7. It ROSE.
- **mergeLadderHeldKeys A2** (line 312), config-channel escalations: E7 (terrain to desert) went 22 → 23, which ROSE. E8
  (culture to norse) went 5 → 4, which FELL.

## GREEN
- Each cured file is green by itself: B7's file 11/11, 11c's file 10/10.
- **`tests/lint` whole at bd99fa7b6:** 6 of 227 files red, 5 tests. They are the known three (proseComposed A0b,
  proseCorpusBytes RAW and GZIP) and the four frozen (newsHeadline, newsVoice, observedShapeReaders, proseFamilyContract).
  These are the same reds the hand-in's lint shows. No test title moved, so the lighting census needs no door.

## ANCHORS-2 (the chair's ruling R24o)
Commits are on the same branch, one per file, test files only:
- **98a6aef9f:** (1), the phone-floor baselines.
- **11266dd3b:** (3), mergeLadderHeldKeys A2.
- **The commit after 11266dd3b:** (3), editCorpusRatchet A4 and A5.

### (1) dossierPhoneFloorAllViews: RE-RECORDED (CONFIRMED by run)
- MOBILE_BASELINE "World/Daily Life": prose 9 → 8.
- DESKTOP_BASELINE "World/Daily Life": measured and sub14 9 → 8.
- No other view moved; the failure's diff held that one row only. The file is 2/2 after.
- The cause, R24h fca95c197, is written beside each figure and in the commit message.

### (2) traditionsSameWindowChain: STOPPED, NOT BUILT (CONFIRMED by run; `ANCH/probe3.census.jsx`, `ANCH/finder.jsonl`)
- Under today's rules, the first soak seed with three traditions in one window is **soak1k-5441**: "Deepwinter, the seventh
  and eighth weeks", The Old Procession, The Hearth Contest, The Great Stars Offering.
- No soak seed in 0 to 5999 holds three in a ONE-week window.
- Three conflicts with R24o (2) as written:
  - **The form literal:** 5441's window is two weeks, so its lines read "Kept in the same weeks as". The literal R24o keeps,
    "Kept in the same week as", does not occur in them.
  - **A duplicate:** 5441 is already the file's second test.
  - **The cost:** a finder that scans from 0 runs about 115 ms a birth, so about 10.5 minutes to reach 5441. That is too slow
    for a unit test.
- For the chair: (a) let the finder find 5441 and derive the week word from the window; or (b) bound the scan; or (c) retire
  the soak1k-5255 arm, since 5441 now carries the property.

### (3) THE THREE FIGURES: RE-KEYED BY IDENTITY (CONFIRMED by run)
The rows were measured by each file's own census, instrumented in copies on git-archive trees at the cut 0ec96f13d and at
9d8c944a3 (B1(i)'s merge with its doors).
- **editCorpusRatchet A4, declared-only {32, 10} → {29, 9}.** None joined. These LEFT:
  - E7: metropolis|germanic|plains, |hills and |mountain (each |road|civilized|golden-master-v3);
  - E8: metropolis|germanic|desert|road|civilized|golden-master-v3.
- **mergeLadderHeldKeys A2, E7 22 → 23 and E8 5 → 4.**
  - JOINED E7: town|germanic|plains|crossroads|civilized|golden-master-v3.
  - LEFT E8: metropolis|germanic|desert|road|civilized|golden-master-v3.
- **A4 also asserts that census**, and I re-stated those lines by the same cause:
  - config rows {22, 5} → {23, 4};
  - steps {88, 20} → {92, 16}.
  - I measured both at the tip. R24o did not name them; that is mine to flag.
- **editCorpusRatchet A5, the four seat pairs 6 → 7.**
  - JOINED: city|germanic|desert|road|civilized|golden-master-v3.
  - **Diffed leaf by leaf in both orders at the tip: TRACE-ONLY.** The one differing leaf is
    `simulationTrace[112].causes[0].effect` ("59 npcs" | "60 npcs"), as at PEOPLE-1. Every world field is identical.
- **The invariants, by run at the tip:**
  - A4 and A5 are green: the layer channel is silent, there is no held motion, nothing real moved, went or arrived, the live
    residue is 27 V-DEFENSE-INST, every escalation is EXHAUSTED, and determinism and undo hold.
  - mergeLadderHeldKeys is 8/8.
  - editCorpusRatchet A3 (328 vs 327) and A7 (honesty figures) stay red as at the cut. R24o does not name them.
