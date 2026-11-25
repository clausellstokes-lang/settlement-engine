# V53-FAILCLOSED: builder's partial notes (VEIL-53, 2026-11-25)

- 07:xx worktree /home/user/pages53 on lane/veil-53-2026-11-24-pages-wip from 1ffb2328b (node_modules, .husky/_ symlinked from join53).
- Reading: Foundations = SubstrateTab.jsx over causalState.js :: deriveCausalState (+ foundationBandShown). criminal_opportunity
  and law_order read safetyProfile.blackMarketCapture (always withheld; rederiveForPage puts it back only when `unveiled`);
  defense_readiness reads readiness.score via defenseLedger, and severity via applyConditions; labor_capacity reads severity.
  rederiveForPage re-derives severity from the served band (VR37) on every page and readiness.score where in the label band.
- PROBE a (15 named births, P0 = toPublicSafe, P1 = the probe's pageOf, nothing hidden; `probe/a.json`): blackMarketCapture absent
  on P1 in 15 of 15 (P0 carries it 15/15); readiness.score absent on P1 in thorp-0, thorp-48, indebted-thorp-0, slave_revolt-thorp-0
  (the "unkeyed" one is readiness too); severity PRESENT on every P1 (rederiveForPage's band default: 0.76 -> 0.85 on hamlet-36,
  0.71 -> 0.6 on insurgency-town-0 and occupied-town-0): the severity bands are NOT read from an absent key.
- PROBE b (ring note, soak1k-10/11/41; `probe/b.json`): the unstamped shared Defense tab prints the TABLE'S ORIGINAL note ("One
  criminal ring decides what crime is allowed here...") on all three; soak1k-11's and -41's owner variants differ. "the ring keeps
  the streets quiet" (vantage 1) is printed on none of them: the brief's quote is not what executes; the red is the original note.
- COMMIT 1 BUILT (uncommitted at 07:13): failClosedReads.js (captureWithheld, readinessScoreWithheld, legacyWithheld);
  foundationBandShown.js :: foundationRowWithheld + SubstrateTab filter (row NOT PRINTED: a label with no band would be an empty
  pill, a new shape); guardLineUnderTheLaw.js :: safetyLineAsPrinted drops the siege order SENTENCE where the capture is withheld;
  dailyLife.js :: deriveRecentChanges says no calm default where legacyWithheld; defenseDeskRead.js :: criminalRingNoteRead
  returns null on a shared page with no shipped note, no seed, key organized.
- RED (old src, new test tests/components/failClosedSharedPage.test.jsx): 5 failed | 3 passed (the 3 owner arms green on both):
  "r2r-city-24 P1: expected 'Contained' to be undefined"; "r2r-town-0 P1: expected 'Strained' to be undefined"; "r2r-thorp-0 P1:
  expected 'Adequate' to be undefined"; "r2r-city-12 P1: expected 'Life goes on as usual, and nobody can…' to be ''";
  "P1: expected 'The town watch is held for the defenc…' not to contain 'The military command has taken charge…'". GREEN 8/8.
- STOP (severity): Labor capacity (r2r-hamlet-36) and Defense readiness's severity pair (insurgency-town-0, occupied-town-0): the
  key is PRESENT on the page (rederiveForPage :: defaultSeverityForBand, VR37); nothing can tell it from a stored severity except
  its value (would change the owner's read where a stored severity equals a band default) or undoing VR37 (a ruled design).
- COMMIT 1 = 004539777 (07:30). Runs: new + changed tests 10/10 green; ring note red quoted ("soak1k-11 shared: no ring note:
  + One criminal ring decides what crime is allowed here..."). Every test file naming a changed src file: 55 files (56 named,
  less the helper law1Band.mjs): 52 passed, 3 failed = publicProseEquality's daily_life soak1k-1/-7/-8 (BASE reds, re-run at
  1ffb2328b: same 3) + chainPrintSites + ruinFilterRoster (both on the known-65 lint list). soak1k-11's calm line ("Life goes on
  as usual") was LOST by the cure: listed in publicProseEquality's VEILED (V4).
- KNOWN LIMIT / not cured (indirect readers of the capture through the law's band, not on the slice): dossierViewModel.js ::
  outlookFactsOf (keepsOrder), guardLineUnderTheLaw.js :: guardLineUnderTheBand (court/no-watch twins), safetyShown.js qualifier.
  DefenseTab prints an empty <p> where the ring note is null (DefenseTab not changed).
- COMMIT 2 BUILT (07:35): tests/lint/failClosedPages.walker.test.js, 7 its, GREEN. Census by property path: 45 sites (3 arm =
  failClosedReads' predicates; 6 guarded, guard text verified in the site's code; 11 re-derived (scores, recentConflict,
  economyOutput); 10 owner-draw (the desks); 1 own-record (printProse); 6 veil; 8 not-a-read) + HAND 6 (foundationRowWithheld,
  SubstrateTab, safetyLineAsPrinted, deriveRecentChanges, criminalRingNoteRead, governanceAccount :: wholeBreakdown -> the
  fortuneLastingSentence arm). RED CONTROLS EXECUTED (then restored): RelationshipsTab's row removed -> "RelationshipsTab (1): a
  reader of an always-withheld key with no fail-closed arm"; a row renamed -> "...GONE: registered, no reader found" + the real
  site unregistered; 'food' added to BREAKDOWN_WITHHELD_TERMS -> "the registry row's terms: expected [defense, prosperity, safety]
  to deeply equal [defense, food, ...]". Manifest row added (rationale). No reader found that commit 1 left uncured (no commit 3
  needed by the census; the 11 re-derived readers carry no arm for the residual absence: listed PLAUSIBLE unreached).
- COMMIT 2 = 04fa8d60e (07:40; one lint fix: no-useless-assignment in armFault). tests/lint whole running.
