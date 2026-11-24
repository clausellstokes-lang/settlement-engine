# FORTUNE U7b LASTING SENTENCE: the second merit's reason on the page (a draft to the chair FIRST, then the build)

Written 2026-11-22 by FORTUNE-6 on the chair's ruling of 04:51 UTC (decision E32), for FORTUNE-7. It follows U7 (`briefs/U7-LASTING.md`)
MERGED. Read FIRST: `briefs/COMMON.md`; COMMON-RULES 1 to 12 (rule 12: EVERY AUTHORED LINE IS READ BY THE CHAIR BEFORE
IT IS BUILT); `briefs/U5b-BUILD.md` and the U5b merges in `FORTUNE-6-HANDBACK.md` (the form this unit repeats: the
governance paragraph, the one door, the mixed keyed pick, the eighteen equalities, the sameness hand row); and
`src/data/fortuneMeritLines.js` as it stands (A, B and C all open "{event} is {past} at {place}", by the chair's ruling
of 03:38 UTC 2026-11-22).

## WHY A SENTENCE (FORTUNE-6 to the chair, 04:45 UTC; ACCEPTED 04:51)

A place merited ONLY by LASTING would show a lifted band with no reason given. Since U5b,
`powerStateProse.js :: legitimacyReadingPoolKey` counts `merits` as a pull, so the "no strong opinion" line does not
print there either. The page must say why.

FORTUNE-7'S NOTE (2026-11-22 08:1x UTC): STEP 1 IS DONE BY FORTUNE-7 (its unit 0(c)), as
`measures/sentences/LASTING-DRAFT.md`. THE BUILDER STARTS AT STEP 2, on the chair's ruled words, which FORTUNE-7 copies
into this brief VERBATIM before the cut.

THE CHAIR'S WORDS (E57, 2026-11-22 08:21 UTC, VERBATIM; the draft's lines are struck: band-neutral, no "stand", no
possessive of {seat}, no verb that must agree with {seat}):
- A "{place} has lasted {span}, and its people count that in favour of {seat}."
- B "{place} has been here {span}, and people there are loath to see {seat} unsettled."
- C "{place} has endured {span}, and its people give {seat} some of the credit."
THE TIME WORDS: `history.age` under 200 years "for generations", otherwise "for centuries"; the threshold (200) is a
WORDING constant beside the words in the pool's own data file (as `FORTUNE_MERIT_RECENT_YEARS`), never in the law's table.
THE PICK: `pickVariantMixed` keyed on `${place}::${age}` through `drawDeclared` (poolId
`fortuneLastingLines:FORTUNE_LASTING_LINES`, surface 'power', drawKind 'H'), as the draft gives it. No need declared.
THE HAND LIST: ONE row; `HAND_CEILING` is the LINE's figure at the merge plus exactly this row (75 after the first merit
lands, so 76), its comment extended.
E57 AMENDED (the chair, 08:27 UTC, VERBATIM in substance; on FORTUNE-7's 36 pairs):
- (1) WHERE BOTH MERITS CREDIT, the lasting sentence is ONE FIXED LINE: "{place} has also lasted {span}, and that too
  counts for {seat}." It uses the name, not "It", because the sentence before it has the event as its subject. A, B and
  C print ONLY where LASTING credits alone. The pool's table has FOUR rows: three drawn and one fixed by case. The
  sameness row counts all four, and the both-case line is in the file for the chair's eye (Albaminus).
- (2) WHERE THE SENTENCE DIRECTLY BEFORE OPENS ON {place} (the three BARE standing lines: "{place} tolerates {seat}, and
  no more." / "{place} approves of {seat}." / "{place} stands behind {seat}."), the lasting sentence opens on "It" in
  place of {place} ("It has lasted for centuries, and its people count that in favour of the Elder Council."). Do this
  ONLY IF the composer already knows the sentence before at no new draw and in a few lines. FORTUNE-7's reading:
  `governanceAccountOf` holds both the `standing` string and the `causes` it passed to `standingSentence`, and the three
  bare lines are exactly its no-cause, one-sentence lines that open on `${place} `. If it does not fit, leave it and say
  so in one line.

THE FILE FOR THE CHAIR'S EYE after the build: the three places of `measures/sentences/LASTING-RULED.md` (Radhawadi lasting
only; Albaminus both; Kabahchihua the captured hall under Tolerated), nine paragraphs as built, owner's page and shared
page; plus two places with both merits and two with LASTING alone (FORTUNE-7's prompt, unit 2).

## STEP 1: THE DRAFT (to the chair, NOTHING BUILT)

A file of at most 60 lines, `measures/sentences/LASTING-DRAFT.md`, holding:
- THREE wordings (A, B, C), in the form of `FORTUNE_MERIT_LINES`. Each claims an OUTCOME the record shows (the place has
  lasted), never probity (the seventh chair's ruling of 19:33 UTC, (4)).
- No wording says the place is "old" where the record gives no age. Fill the age from `history.age` as a band of
  words, never a figure, unless the chair rules a figure.
- `{seat}` and `{place}` filled exactly as U5b fills them.
- Each wording shown on THREE whole governance paragraphs:
  - a place merited by lasting only;
  - a place merited by both (show where the two sentences sit, and that they read as one paragraph, never the same
    clause twice);
  - a captured hall.
- Each wording's needs, if any. If declaring a need requires a vocabulary or class-table row: say so in the draft. The
  chair grants rows or rewords.
- The pick: the kernel's mixed keyed pick through `drawDeclared.js`, keyed on the record, with no new draw.

Send the draft's path to FORTUNE-7, who sends it to the chair. WAIT for the chair's ruling on the words.

## STEP 2: THE BUILD (on the chair's words, verbatim)

- The pool goes in its OWN data file (NEW, e.g. `src/data/fortuneLastingLines.js`).
- It is declared through the one door, imported only by `governanceAccount.js`.
- It prints directly after the standing sentence (and after the weathered sentence, if both). It prints ONLY where
  `meritsOf` credits `'lasting'`, using the SAME predicate, imported and never restated.
- The pool goes on `tests/lint/samenessHideable.handPools.json`, with `HAND_CEILING` raised by one and its comment
  extended, BY THE CHAIR'S WORD in the ruling on the draft.

PROOFS (red first):
- the paragraph holds the pool's sentence for a lasting-merited record;
- a law-1 record and a law-2 record without the merit are byte-identical to the base (the two-tree confinement,
  525/720);
- each wording by each age band is the same string on the owner's record, on `toPublicSafe` and under the widest veil;
- no sentence is printed twice in one place;
- each wording is reachable;
- FIRST PAINT: the build is the proof (`governanceAccount.js` is pinned lazy). ANY rise: STOP.

Then `PAGES-BUILT-LASTING.md`: the three places' governance paragraphs WHOLE, for the chair's eye.

## GIT AND REPORT

As U5b's brief: one commit for the build and its tests, one for the pages file, and registers by their doors. Do not
push. REPORT in at most 300 words.
