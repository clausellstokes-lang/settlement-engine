# TRAD-4 · UNIT 7 — THE HOLE REVIEW-VEIL-13 FOUND IN "TRAD-SHARE 1f3cdc135" (THE DEAD'S EVENT BY A BARE NAME; A POWER'S ARCHETYPE FROM ITS DESCRIPTION)

Written 2026-11-20 14:0x UTC by TRAD-4 on the chair's rulings of 13:50 and 13:59 UTC (each vetoable by the owner).
Read `TRAD-2-COMMON.md` first; it binds you (read "TRAD-2" there as "TRAD-4"). Base: `lane/trad-4-2026-11-20` at the
commit your worktree starts on. UNIT 5 is being built beside you on the same leaf (other hunks: the table's frames, the
gloss pools, the printed export): touch nothing of the table and nothing outside the functions named below.

## Files you may change
`src/domain/traditions/traditionDescription.js` (ONLY `heldNamesOf`, `holdsAName`, `readerView`, the dead-cause choice
that calls them, and the census comment at the head), `tests/security/traditionDescriptionSharedPage.test.js` (the
traditions' own born test), `tests/domain/traditionDescription.test.js`, and in `scripts/mutation-coverage-manifest.json`
ONLY the `rationale` string of the row for `tests/security/traditionDescriptionSharedPage.test.js` (it must describe
units 2, 4, 4b and yours). Anything else: STOP and report.

## The finding (executed by the security reader; read, do not re-derive)
`git fetch origin lane/review-veil-13-2026-11-20 && git show FETCH_HEAD:docs/chair/2026-11-20/veil/REVIEW-VEIL-13.md`,
section 3 only; its plant `docs/chair/2026-11-20/veil/probes/REVIEW-VEIL-13/traddead.probe.jsx` on that branch (read it
for the plant's shape; do not run it: it needs the security lane's tree). (1) For a reader the leaf skips an event whose
name holds a FULL held name; migration 212's sweep also withholds an event by a hidden house's BARE form (its name less
its bracketed qualifier): a hideable house renamed "<name> (word of mouth)" and a graded great fire "The <name> Fire":
212 withholds the event, the served text still says "…in memory of the great fire, 2 years ago" (16/16). (2) A power
with no mapped category takes its archetype from its `description` (`domain/factionArchetypes.js :: factionArchetype`),
a field a DM can hide: a DM-made power moved the reader's keeper in 25 of 140 towns (born powers 0).

## THE CURE (1), THE CHAIR'S RULE VERBATIM IN SUBSTANCE (13:59 UTC)
For a READER the dead's cause is chosen only among events whose name shares NO WORD with ANY name the record holds
(houses, powers, people; hidden or shown: `heldNamesOf` on the WHOLE record, as now), where:
- both sides are case-folded and cut into runs of letters (`\p{L}` runs; digits and marks are separators);
- a held name's bracketed qualifier counts as part of the name (its words are in too);
- EVERY held word of any length counts except a CLOSED stop list, exported and pinned: `the, a, an, of, and, in, on, at,
  by, for, to`;
- an event word that BEGINS WITH a held word counts as that word (a plural or a possessive is caught: "Fences'" for
  "Fence").
The owner's page is unchanged. This is NOT a copy of the security lane's fold (`gallerySecondHomes.js` is on no base of
this lane and you may not bring it in): it is strictly WIDER than any by-name withholding by construction.

## THE CURE (2)
In the READER's view (`readerView`) a power takes NO archetype from a field a DM can hide: read the gallery veil's own
declaration of the faction kind's fields (`galleryVeil.js :: CARD_KINDS.faction.fields`, IMPORTED, never copied; you edit
nothing in galleryVeil.js) and remove from every power every field any of its eyes can remove, as `withoutFunction`
does for houses; if that would remove the power's name (`faction`/`name`) or its `category`, STOP and report what the
declaration holds instead of guessing. A power with no mapped category then falls to the generic keeper. The owner's
page is unchanged.

## Red first (each arm run red at your base, its failing title and assertion quoted in your report)
- (1) THE READER'S PLANT in the security file: born towns of several tiers; a hideable house renamed
  "<its name> (word of mouth)"; a rite of the dead with a graded (major/catastrophic) eligible event renamed
  "The <its name> Fire": the reader's text and the drawn rows (`sharedTraditionRowsOf`) hold no dead's cause from that
  event. PLANTS beside it: a plural ("The <name>s' Fire"), a possessive ("<name>'s Burning"), a THREE-LETTER house name
  (e.g. "Inn"); each reds at base where the base lets it through (say which ones the base already caught).
  CONTROL: "The Granary Fire" where no held name holds "granary" is STILL recalled (non-vacuity, the rule is not "never").
  The OWNER's page still names the event by its own name in every plant.
- (2) THE POWER PLANT: a DM-made power with no mapped category whose `description` alone would make it the wanted
  archetype (religious or merchantry): the reader's keeper is byte-identical with that description present and removed;
  CONTROL: the owner's keeper does change (the plant reaches the leaf).
- A unit test pinning the stop list and the word rule (case, qualifier, prefix-catch) in `tests/domain/`.

## Measures for your report
- On the 432 pool (`node docs/chair/2026-11-20/content/traditions/tools/trad-pool.mjs <dir>`, then
  `tools/measure2.mjs … reader` at base and at your commit): THE BORN COUNT of reader dead-cause clauses lost (the chair
  expects 0 or near it: give the figure and, for each lost one, the event's name and the held word that caught it) and
  reader keepers moved by (2); OWNER descriptions moved: must be 0.
- The confinement is TRAD-4's at the merge.

## Report also, for the join (TRAD-4's hand-back)
One paragraph naming the PARITY ARM owed on the joined tree (when the chair joins the security lane): every event the
security lane's own sweep withholds is one this leaf skips. Do not write it; describe its inputs.

## ADDENDUM 1 — THE WORD RULE RE-STATED (the chair, 15:10 UTC, on TRAD-4's recommendation; supersedes "cut into runs of letters")
The rule as first written lost 34 reader dead-causes on the 432 (31 by the held word "s" a possessive leaves). One normal form:
(a) A WORD is a maximal run of letters and apostrophes (U+0027, U+2019 and U+02BC all read as the apostrophe), case-folded:
    an apostrophe never splits a word.
(b) A HELD word: apostrophes at its ends dropped, then a trailing possessive ('s) dropped, then every apostrophe left inside
    deleted ("Cobbler's" → cobbler; "Smiths'" → smiths; "O'Brien's" → obrien).
(c) An EVENT word: every apostrophe deleted, nothing dropped ("Cobbler's" → cobblers; "O'Brien's" → obriens).
(d) The stop list and the prefix rule stand on these forms: an event word BEGINNING WITH a held word counts.
(e) THE WHOLE-NAME TEST (full and bare form) STAYS BESIDE THE WORD RULE as a floor, so a held name made only of stop words
    is still caught.
PLANTS, RED FIRST (against your current commit where it lets them through, else against the base; say which): a possessive
held name against the bare event ("Cobbler's guild" / "The Cobbler Riots"); the reverse ("Cobbler" / "The Cobbler's Fall");
a plural possessive ("Smiths' Hall" / "Smith's Fire"); a curly apostrophe; an inner apostrophe. A CONTROL THAT MUST KEEP ITS
CAUSE (red at your current commit): a held possessive against an event that only begins with s ("People's Council" /
"The Siege"). "great" on "The Great Fire" is right by the rule (lost, toward withholding).
Re-run the measure: reader dead-causes lost on the 432 (the 3 by "great" expected), each with its event and held word.
