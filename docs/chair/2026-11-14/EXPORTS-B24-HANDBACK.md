# EXPORTS-B24 HAND-BACK (kept current after every item)

The builder seat of the exports' culture block (B2) and the journal's provenance keys (B4), 2026-11-14. Branch
`lane/exports-b24-2026-11-14`, cut from the surfaces lane's tip **c66333f0c** as read back from origin (the measure was
taken at 3c30fdeb4). Every figure says EXECUTED (a script ran it on the 720) or READ (read on sight by this seat).

## The rulings this seat worked to (the chair's brief; the chair's messages are not on the branch)

- THE LAW (the chair's; vetoable by the owner): ONE READER FOR ONE FACT ON EVERY SURFACE; A SURFACE WITH NO ROOM PRINTS
  LESS, NEVER SOMETHING ELSE; no surface prints a raw catalogue, a stored key or a line that never passed a reader.
- B4 (CANDIDATE B, AS MEASURED): the provenance bracket is left out of the journal's Armed forces bullets: one line of
  `src/foundry/journalPages.js :: defensePage`; 480 towns to 0; "Thieves' Guild (Powerful)" (a strength word) is not
  this block.
- B2 (NOT the measure's A+B): (i) THE SCOPE LINE prints through the tab's reader (`settlementQuickGuide.js ::
  cultureScopeLine`) on every surface; (ii) THE SIX RAW ROWS (Built form, Civic pattern, Exchange, Sacred life, Defense,
  Social texture) AND THE GENERATED CULTURAL NOTES PRINT ONLY IN A TOWN OR LARGER (a thorp, a hamlet and a village
  print the scope line, Foodways and Architecture, no more); (iii) IN A TOWN OR LARGER EACH ROW IS HELD TO ITS OWN
  DECLARATIONS AT PRINT (the measure's C'); (iv) WHAT THE USER WROTE ALWAYS PRINTS: notes that are not the generated
  default print whole at every size.

## B4 — DONE, 2779a3d6d (pushed)

- CURE: `journalPages.js :: defensePage`, one line: `name: desc`, no `(source)`.
- GUARD: `tests/foundry/journalForcesNoProvenance.test.js` (r2r-thorp-1, an occupation, the smallest; r2s-under_siege-
  town-0; r2s-famine-city-0; r2r-metropolis-0, the largest): red 4 of 4 at c66333f0c, green at 2779a3d6d; every bullet
  pinned whole.
- COUNT (EXECUTED, FAST: the census's 720 births at c66333f0c through each tree's `buildJournalPages`, the measure's
  `b4.mjs` pattern): **480 → 0** towns (the measure: 480 → 0). Per key at the base: generated 370, required 360,
  coherence_repair 157, cascade 123, faction_boost 13, forced 6 (the measure's dumps at 3c30fdeb4: 366, 360, 157, 103,
  13, 6; the town total agrees; the per-key rise of generated and cascade is the lane's move 3c30fdeb4 → c66333f0c or
  the FAST's whole-page read, NOT traced).
- READ: the commit body (four towns, every bullet as printed). No new word: a bracket left out.

## B2 — DONE, 70047b617

- MEASURED FIRST, at the base (EXECUTED, the census's one command, full run at c66333f0c, `b2tier.mjs`): the culture
  writer's towns **408** (PDF 408, journal 256); the tier gate takes the rows from **336** small towns and leaves
  **72** in towns and larger (the measure's bound: 408 → 72). Agrees with the measure; no stop.
- CURE: `src/pdf/lib/cultureOnPage.js` (NEW, pure; the surfaces lane's `chainStateOnPage.js` form, so the PDF and the
  journal share one reader: the brief names no file for it; JUDGMENT, vetoable: a new file holds no other lane's
  lines). `IdentityDailyLife.jsx` reads it for the six rows and the notes and calls `cultureScopeLine` for the scope;
  `journalPages.js :: identityPage` prints its notes (one call line and its import). (iii) is the measure's C' check;
  a blend (`mixed`) is held half by half (each half to its own profile's row); a text no profile row matches prints as
  before (nothing declared, nothing refused). "Generated" = the text equals `culturalNotesFor(culturalIdentity)`;
  anything else in the notes is the user's and prints whole at every size.
- GUARD: `tests/pdf/cultureBlockTwoSurfaces.test.jsx`: red 3 of 6 at c66333f0c; the journal arm and the scope arm each
  red alone (2 and 2, EXECUTED); green at 70047b617.
- COUNTS (EXECUTED): census at the candidate (= 70047b617's tree; lean render: the PDF and the journal re-rendered, the
  tabs from the base's dumps): towns **408 → 49** (small **336 → 5**: the Architecture row's "whitewashed courts and
  stone steps…", courtyards, the measure's NOT false; town and larger **72 → 44**; PDF 408 → 49; journal 256 → 23).
  FAST (the 720 records through the reader): small places 2,160 raw rows and 360 generated notes → 0; towns and
  larger 2,160 rows → 1,971 (189 refused by their own declarations, in 163 towns: Defense rows most, the widest
  "Mounted patrols, mobile musters…" 24 towns, "Professional retainers and district levies…" 22), notes 360 → 350.
  FIELD DIFF (base corpus against the candidate's): 0 towns, 0 families.
- TRUE LINES LOST (READ, the measure's six small towns at the base): **14 of 36** raw rows read true (r2r-thorp-0 0,
  r2r-thorp-14 1, r2r-hamlet-0 1, r2r-village-6 5, r2r-village-23 1, r2s-famine-village-0 6), and 2 generated notes
  (r2r-village-6, r2s-famine-village-0). With the two true scope lines this is the measure's 16 true of 42. Over the
  720: every small town loses its six rows (2,160 lines; about 4 in 10 true, as read). In towns and larger the
  declarations refuse 189 row-lines: not read one by one (NAMED: the next reader's).

## Every new or changed line on a surface (the owner's veto list)

- PDF, CULTURAL IDENTITY, every size: the scope line is now the Overview's identity line (its five frames, the seed's
  pick), e.g. r2r-thorp-0 "Mesoamerican-inspired, and it shows: built on tribute and the ritual calendar."; r2r-hamlet-0
  (SIEGE) "Germanic-inspired, built in timber and stone, and run by its estates."; r2s-famine-village-0 (FAMINE)
  "Celtic-inspired, and it shows: built around kin."; r2s-occupied-thorp-0 (OCCUPATION) "Germanic-inspired; people here
  live in a place built in timber and stone, and run by its estates."; r2r-metropolis-0 "East-Asian-inspired. Ask about
  the place and you are told it is built in wards and courtyards, ordered by bureau and lineage."; r2s-succession_void-
  metropolis-1 (50,582) "Greek-inspired. Ask about the place … built around the agora, on desert ground, and run by
  civic association." The culture's tag still prints beside the heading, so the label reads twice (as the measure's
  part A built it): NAMED for the owner.
- Taken off: the six rows and the generated notes in every thorp, hamlet and village (PDF; the journal's "Cultural
  notes"); 189 declared rows refused in towns and larger (r2r-town-6's "A lordly court…" under an Arcane Council;
  r2s-under_siege-town-0's "Maritime trade, seasonal voyaging…").
- Journal, Armed forces (B4): the bracket gone; no other word.

## False lines left in towns and larger (READ; for the data lane's seat: `src/data/cultureProfiles.js`, not changed)

The census's 27 distinct culture lines left there (16 sentences; the rest the notes' copies on both surfaces), each read
in its towns. FALSE:
1. `:494` greek builtForm "A fortified high precinct overlooks the market, theater, and workshops; where geography
   permits, it also overlooks a working harbor." (needs `market`, `tier: ≥ town`): false in 5 towns with no theater
   (r2r-town-2 914, r2r-town-24 423, r2r-town-39 1,115, r2s-politically_fractured-town-3, r2s-plague_onset-town-1; four
   with no citadel either), on the row and in the generated notes (PDF and journal); true in the cities and
   metropolises that hold theaters and a citadel (r2r-metropolis-24: theaters, no citadel: MED). LACKS: a theater and a
   fortified height (or `tier: ≥ city`).
2. `:415` south_asian exchangePattern "Bazaars, merchant houses, craft corporations, credit, pilgrimage, and caravan or
   maritime routes support exchange." (needs `market`): r2r-town-18 (1,095, a port), no merchant house or bazaar on its
   roster. LACKS: a merchant house (or `tier: ≥ city`).
3. Not a census hit, read in the twelve: `:239` norse civicPattern "Household leaders and law speakers bargain in
   assembly beneath a chieftain or royal representative." (undeclared): r2s-under_siege-town-0 under a Town Council.
   LACKS: `ruler: chieftain` or a monarch (a council twin).
Read TRUE: the hedged lines ("naval assets where relevant", "where geography permits"), the disjunctions ("ships or
land", "shoreline, roadstead, or defensible ridge"), "courts" as courtyards, the tradition statements (Defense rows).

## Registers named stale (re-derived once, at the close; nothing banked by hand)

- `scripts/lib/writer-dark-register.mjs`, row "situationDesc on economicState": clause S, now LIT: the PDF's closure
  reaches `settlementQuickGuide.js` (ruling (i)'s reader), which reads `economicState.situationDesc` in
  `composeMaterialTruth`; `cultureScopeLine` itself reads none (a static reach). EXECUTED: with the PDF's import struck,
  the walker returns to exactly its base reds (the journal's new closure adds nothing). At this tip
  `tests/lint/writerReach.walker.test.js` throws in its beforeAll (its 52 tests skip); at the base 6 of its tests are
  red. The door (strike the row, the walker's "BANK THE WIN") is the close's.
- The census's dumps and worklist (the PDF and the journal moved): re-taken at the close.

## Found, not cured (file, holder)

- `tests/components/houseLabelEverySurface.test.jsx` (rr2s-town-under_siege-rand-1: "page Systems/Defense: allowed 1,
  found 0", the PDF's two), `tests/domain/r3c10FoodLinesTrue.test.js` (the herding line, two tests),
  `tests/lint/siteCoherenceRatchet.test.js` (C1), `tests/property/generatorGoldenMaster.test.js`: red at the base
  c66333f0c and at this tip alike: not this seat's.
- `IdentityDailyLife.jsx`'s FOOD BALANCE callout ("What is grown here and brought in falls short…"): 31 towns of kind b
  at the base, traced to the chapter's own file: not this block.
- The journal's "Thieves' Guild (Powerful)" (a criminal operation's strength word): the measure's L2 45; not B4.
- The PDF's Defense force rows name forces through `institutionDisplayName`, the journal's through
  `institutionHouseLabel`: two readers for one name (NAMED, not read further).

## What is left, line by line

1. The data lane: the three rows above (declare them, or a twin), and the 189 refused rows read one by one (some may
   be true lines whose declarations are too strict).
2. The close: the writer-dark register row; the census re-taken.
3. The owner's veto: the scope line's label twice beside the tag; the small places' 14-of-36 true rows lost.

## The instruments (how to re-make them)

- CENSUS: CENSUS-3's probes (`git archive origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3`),
  `HOLDERS=…/holders.tipA.json sh census3.sh <tree> <out> 4` (base, full); the candidate with
  `CENSUS_RENDER=render.lean.jsx BASE_DUMPS=<base out>/dumps` (the measure's `render.lean.jsx` copied beside
  census3.sh). Then the measure's `b2tier.mjs <out>`, `blk.mjs <out> B2 <seeds>`, `fielddiff.mjs <a> <b>`.
- FAST: a vitest file outside the tree (`root: <tree>`, `include: [<file>]`) reading `<base out>/corpus.ndjson.gz`
  through the tree's `buildJournalPages` (B4: the `b4.mjs` pattern) or `cultureOnPage` (B2).
