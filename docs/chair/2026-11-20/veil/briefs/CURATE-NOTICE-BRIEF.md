# CURATE-NOTICE — brief (VEIL-25, the lane's owner; the seventh chair's word of 11:24 UTC; vetoable by the owner)

You are a BUILDER for the share veil's lane. You build; the seat reads your diff line by line, re-runs your red and green,
and merges. You never push and never open a pull request. DISPLAY ONLY: this unit sets nothing, stores nothing, and
changes no served byte.

## Where you work
- Worktree `/home/user/wt/curate`, branch `v25-curate`, cut from the lane tip ae77ff26f. `node_modules` in place (hard
  links). ONE commit.
- Read first, and no more: `CLAUDE.md`; this file; `src/components/gallery/CurateMode.jsx` WHOLE;
  `src/domain/display/criminalVeilSwitch.js` WHOLE; `tests/components/curateModeCriminalSwitch.test.jsx` WHOLE; and, only to
  learn the rule the notice describes, the R3 power rule's statement in
  `/home/user/settlement-engine/docs/chair/2026-11-20/veil/COHERENCE-VEIL-HANDBACK-PART26.md` section 1, rulings 11 and 38 (c).
- FILES YOU MAY TOUCH: `src/components/gallery/CurateMode.jsx`, `src/domain/display/criminalVeilSwitch.js` (its
  `CRIMINAL_SWITCH_WORDS` and, if needed, ONE new pure exported predicate beside `criminalSwitchStateOf`), and
  `tests/components/curateModeCriminalSwitch.test.jsx`. Nothing else: not 211, not 212, not the twin's rule files
  (`galleryVeil.js`, `galleryRosterChoices.js`, `gallerySecondHomes.js`, `galleryVeilPeople.js`, `galleryWithholdAlways.js`),
  not `tests/domain/display/criminalVeilSwitch.test.js` (another builder holds it now). If the unit needs any other file,
  STOP and say so.
- Outputs under `docs/chair/2026-11-20/veil/out/v25/curate/`, one file per figure, committed with the unit.
- Never the whole suite; every test run under `env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u
  GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE`; a gate's exit by `sh scripts/gate-tail.sh <command>`, never through a
  pipe; commit with the hooks, never `--no-verify`. YOUR MARK: about 100,000 tokens.

## THE UNIT
THE FAULT (the chair, 11:12): R3's power rule withholds a criminal power's row from every non-owner read wherever a
criminal (hideable) house of the town is hidden whole, whichever house raised the power (power.entry's reach; it fails
toward withholding). So the owner can set "Hide everything criminal" to SHOWN (or "partly") and still find the criminal
powers' row missing from the shared page, because one criminal house stays hidden. A switch that silently does nothing is
a fault of the owner's screen.

THE NOTICE: where the Curate screen shows the switch shown or partly shown WHILE a criminal house is hidden in the draft (the
exact condition under which R3 withholds the criminal power's row: measure it from the draft and the model the screen already
holds, and write in the hand-back how you know it matches the rule), the switch's group shows ONE plain sentence for a DM:
what is not shown and why, and what to do if they want it shown (show the house; or leave it hidden and accept that the
criminal powers stay out of the shared page).
- THE SENTENCE'S WORDS ARE THE CHAIR'S TO APPROVE: write your proposal into `CRIMINAL_SWITCH_WORDS` (one new key), and put
  it, verbatim, in the FIRST LINES of your hand-back. Plain English, short, no jargon ("veil", "projection", "power.entry",
  "grouping" are not a DM's words).
- It SETS NOTHING: no draft change, no delta, no click handler. It reveals nothing a visitor can see: it renders on the
  owner's Curate screen only. Name, in the hand-back, every surface that renders it (search for every import of the new
  key and of `CriminalSwitch`), and show it is the Curate screen alone.
- RED FIRST: a render test (in `tests/components/curateModeCriminalSwitch.test.jsx`) that the sentence shows when the switch
  reads shown or partly with a criminal house hidden, and does NOT show (i) with every criminal house shown, (ii) with the
  switch reading hidden, (iii) on a town with no criminal parts. Red before the change (the sentence absent), green after;
  both runs saved.

## GREEN, AT YOUR COMMIT
`tests/components/curateModeCriminalSwitch.test.jsx` whole; `tests/domain/display/criminalVeilSwitch.test.js` run and its
result reported unchanged from the base (it has a known red, VR34 (b); do not touch it); eslint on the touched files; the
typechecks (domain:strict and the ratchet). 211 and 212 untouched (`git diff ae77ff26f -- supabase` empty).

## Your hand-back
`docs/chair/2026-11-20/veil/out/v25/curate/CURATE-NOTICE-HANDBACK.md`: first lines the sentence verbatim and the condition
in one line; then the surfaces that render it; the red and the green with their files; CONFIRMED vs PLAUSIBLE. Last line:
your commit's hash and its files.
