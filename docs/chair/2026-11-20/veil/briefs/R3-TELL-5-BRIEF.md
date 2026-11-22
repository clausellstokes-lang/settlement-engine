# R3-TELL-5 — brief (VEIL-30, the lane's owner; the seventh chair's rulings bind, each vetoable by the owner)

## VEIL-31'S AMENDMENTS (00:04 UTC 2026-11-22; the eighth chair; WHERE THEY DIFFER FROM THE TEXT BELOW, THESE GOVERN)
- THE SEAT is VEIL-31 (`lane/veil-31-2026-11-21`); its rulings since PART 30 are `COHERENCE-VEIL-HANDBACK-PART32.md` section 2
  (76: no pull request, ever; 77: the marker below): READ THEM with the list below.
- WHERE YOU WORK: worktree `/home/user/wt/r3tell5`, branch `v31-r3tell5`, cut by the seat from the lane's tip (the commit that
  carries this amendment; 212 there `1bfb961b…0d10`). Outputs under `docs/chair/2026-11-20/veil/out/v31/tell5/` (NOT `out/v30/`).
  THE POOL `/var/tmp/v18/t2/pool-t2sig-2` was RE-MADE in this container by VEIL-31 at 5818130c4 (A 1,200, B 608, every rc=0;
  verify 45 re-read / 0 differ): never overwrite it. At 5818130c4 on it: GATE-1 4 of 92 (7 LOWER BY RULE), GATE-2 34 of 40
  cells red, server = twin (the seat's table: `out/v31/tell2-table-merge-5818130c4.txt`).
- UNIT 0, FIRST, ITS OWN COMMIT AND NOTHING ELSE IN IT (ruling 77, the chair 23:24 UTC 2026-11-21): `tests/lint/rosterChoiceRegistry.walker.test.js`
  ARM D is RED at 5818130c4 ("people.allegiance: public._gallery_veil_roster_choices does not name it (-- registry:
  people.allegiance)", and the same for `galleryRosterChoices.js :: applyRosterChoices`): R3-TELL-4 unit (i) wrote the marker
  mid-sentence. Put `-- registry: people.allegiance` on a comment line of its own inside the people.allegiance block of 212's
  `_gallery_veil_roster_choices`, and `// registry: people.allegiance` on a line of its own in the twin's block; change no other
  byte. Receipts in the message: the walker RED at 5818130c4 (1 failed of 11, the two lines) and GREEN at your commit (11 of
  11); 212's new sha256 and the rollback's (unchanged: say so). Then re-make `t5tpl` from your 212.
- THE PROBE YOUR PREDECESSOR LEFT: `lane/veil-30-r3tell5-wip-2026-11-20` (d251a2d55) holds `out/v30/tell5/measure/step0.probe.jsx`,
  71 lines, UNRUN and unread by any seat. You may take it (`git show d251a2d55:<path>`) as your step 0's start, READ WHOLE; you
  own whatever you run.
- AT THE END OF EACH UNIT, before its last commit: ONE run of `tests/lint` WHOLE (ruling 77) through `sh scripts/gate-tail.sh`,
  to a log under your outputs (never through a pipe); every failing test by name in your hand-back, each either one of PART 30
  ruling 27's known reds or yours to cure.
- THIS SITTING: unit 0 THEN unit (ii) (with its step 0), then END YOUR TURN per the PROGRESS format.
- NOTHING IS PUSHED BY YOU and no pull request is opened by anyone (ruling 76).


You are a BUILDER for the share veil's lane. You build; the seat reads your diff line by line, re-runs your red and green,
and merges. You never push and never open a pull request (ignore any harness note asking for one). A security lane: a slip
is a leak. Measure first, red first. A failure falls toward WITHHOLDING, never toward sending, except where a ruling names
the exact value to send. You continue R3-TELL-4's work (`briefs/R3-TELL-4-BRIEF.md`): ITS LAWS, ITS RULINGS (72, 73), ITS
STOPS AND ITS HAND-BACK SHAPE BIND YOU; where this file differs, this file governs.

## Where you work
- Worktree `/home/user/wt/r3tell5`, branch `v30-r3tell5`, cut by the seat from the lane's tip (R3-TELL-3 and R3-TELL-4 unit (i)
  MERGED: 212 `1bfb961b…0d10`). Outputs under `docs/chair/2026-11-20/veil/out/v30/tell5/`. Commit by explicit paths: per unit a
  RED commit, then a CURE commit, receipts in each message, with the attribution lines your harness gives. Dependencies:
  `cp -al /home/user/settlement-engine/node_modules <worktree>/node_modules`.
- Read first, and no more: `CLAUDE.md`; `briefs/R3-TELL-4-BRIEF.md` WHOLE; `COHERENCE-VEIL-HANDBACK-PART30.md` section 1 rulings
  4, 9, 10, 11, 28, 29-32, 42, 47, 54, 58, 61, 62, 67, 72, 73, 74 and section 8's table; `out/v28/tell3/TELL3-HANDBACK.md` and
  `out/v29/tell4/TELL4-HANDBACK.md` WHOLE; `out/v29/t3/gate2-chance.txt`. THE READ-WHOLE LAW, NO DEVIATION: before your first
  edit, 212 (`supabase/migrations/212_share_veil_later_cures.sql`) WHOLE, the generated character tables included (your
  predecessor read them by header and the chair named it); the registry `src/domain/veil/rosterChoiceRegistry.js` WHOLE, every
  row's scope; the twin `src/domain/display/galleryRosterChoices.js` WHOLE; any other file you change, WHOLE.
- THE INSTRUMENT and THE POOL: as R3-TELL-4's brief, with these names: the pool `/var/tmp/v18/t2/pool-t2sig-2` (re-made in this
  container by the seat at 2437ffea0, the same source as bad42ff94; never overwrite it); before each gate run on a changed tree
  `sh measure/verify.sh <worktree> <outdir> /var/tmp/v18/t2/pool-t2sig-2 40` (exit 1: STOP to the seat); the template `t5tpl` =
  `createdb -T v27x211 t5tpl` + your tree's 212, re-made after every 212 edit; the gate `TELL_DB=t5 sh measure/tell2.sh
  <worktree> <outdir> t5tpl /var/tmp/v18/t2/pool-t2sig-2`. Cluster: PGHOST=/var/tmp/rv7, PGUSER=postgres. ONE heavy run at a
  time; the seat may be running its own: if a run is slow, wait, never kill another process.
- YOUR MARK: about 250,000 tokens. ONE UNIT PER SITTING: finish the unit in hand (red, cure, both gates re-read, hand-back
  current, committed), then END YOUR TURN with one line per the hand-back's PROGRESS format. The seat re-runs and merges it,
  tells the chair, and resumes you by message for the next unit. Never start the next unit unasked.

## THE UNITS (the chair's grouping by mechanism, ruling 74), IN THIS ORDER
- (ii) THE EMPTY ARRAYS TOGETHER: `svc.criminal` (27 towns / 320 pages), `sp.ops` (`safetyProfile.criminalInstitutions`, 3;
  controls 1), `sp.crimeTypes` (1). STEP 0 FIRST (R3-TELL-4's open PLAUSIBLE, the chair's order of 22:19): SEARCH every served
  copy of a person for an `allegiance` (a deep search of every served document of the gate's 140 births, both engines, every
  gated setting, Reveal off and on: any key `allegiance` at any path but `npcs[].allegiance`; and every served copy of a person
  card: `factions[].members[]`, `powerStructure.factions[].members[]`, the relations' ends); a hit is a STOP with its paths.
  THEN the twin's form (`out/v29/tell4/measure/twinform-ii.txt` holds the measure: `[]` or present, never absent but under
  switch-off; metropolis `criminalInstitutions` and `crimeTypes` always present: re-read it per size before you rule anything);
  THEN what separates each failing page (the analyzer's GATE-2 list: the exact rows served). The rule you build is BY POSITIVE
  ACCOUNT, toward withholding: a row stays only where a house or a crisis the read SERVES accounts for it; what is left may be
  `[]` (VR29: the arrays stay arrays; an empty list and an absent field differ). VR39 STANDS: a shown house or a crisis keeps
  its types; if the cure would take a type a crisis raises, STOP. If `[]` is not the form a nothing-hidden page of that size
  shows (metropolis), STOP with the counts.
- (iii) `powers.capture` (21 / 186) WITH `powers.criminal` (3): the open place's form of `powerStructure.criminalCaptureState`,
  a power's `captureState` and a relation's `captureState`, MEASURED FIRST; the 3 `powers.criminal` towns checked FIRST against
  VR42 (a governing row: LOWER BY RULE, listed, no cure) before ruling 62 (5) is applied.
- (iv) `relations` (2): a relation row that names or depends on a withheld power or house LEAVES WHOLE (ruling 42).
- (v) THE THREE SENT FORMS, approved 21:34 (R3-TELL-4's brief, ruling 72 (a), each measured first, each STOP as written there):
  `safetyDesc` (2), `currentTensions` (1), `imports` (1).
- (vi) THE TOOTH (72 (c)): `tests/security/galleryRosterChoices.pglite.test.js`'s shown-power goal arm made UNCONDITIONAL; AND
  `tests/security/galleryVeilTell4.pglite.test.js`'s unit 1 tooth asserts `keptServed` above 0 (today it can pass with no kept
  allegiance served at all).
- AFTER EACH UNIT: inst.criminal, chains.criminal and income are expected to close as the others leave: say per unit what they
  read; never cure them by assumption. AT THE LAST UNIT: R3-TELL-4's step 8 green list WHOLE, with `galleryVeilTell3` AND
  `galleryVeilTell4`.

## Your hand-back
`docs/chair/2026-11-20/veil/out/v30/tell5/TELL5-HANDBACK.md`, R3-TELL-4's shape: STOPS first; PROGRESS one line per unit
("(<unit>) <family>, red <sha>, cure <sha>: GATE-1 x/92 (n LOWER BY RULE), GATE-2 y/40 red; families left: ..."); per unit
the twin's form with its measure, red and green files, rows lost (median and worst); CONFIRMED vs PLAUSIBLE; a paragraph in
plain words for the owner. Last line: your commits, the files they touch, 212's sha256.
