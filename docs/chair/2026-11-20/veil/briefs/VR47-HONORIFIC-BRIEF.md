# VR47 — THE HONORIFIC'S SEED (brief by VEIL-23; the chair's ruling of 08:01 UTC, vetoable by the owner)

You are a BUILDER for the share veil's lane. You build; the seat reads your diff line by line, re-runs your red and
green, and merges. You never push and never open a pull request.

## The ruling
`src/data/faceHonorifics.js :: honorificOfTitle(title, gender, seed, place)` picks one of a pool of weighty forms
("Master Apothecary" | "Apothecary") by `pickVariant` over a SEED. Today the callers (`src/domain/people/cardDoor.js`,
`seatKeeper.js`, and any other caller: find them all) build that seed from the CARD'S ID and its INSTITUTION KEY. A shared
page re-keys every person's id on every read (VR10), so the drawn title changes from read to read. Today that turns the
render-twice harness and `galleryVeilSignalCopies` red on R4's branch.
**VR47: THE PICK IS A FUNCTION OF WHAT EVERY READ SERVES: the person's NAME and the TITLE (gender choosing only the
gendered form), on EVERY page, the owner's included. NEVER the card's id, and NEVER the institution key.** The institution
key is barred because a tie the DM hid would otherwise shade the pick: a function of a withheld field is a leak, however
small. ONE helper builds the seed (in `faceHonorifics.js`), and every surface calls it. A stable per-person seed served
for shared pages is REFUSED.

## What may move
DISPLAY ONLY. No stored byte and no generator figure may move. `styledTitleOf` (used by the generator, `ties.js` and
`patronage.js`) takes no seed. PROVE it unchanged, and prove that no generator path calls `honorificOfTitle`. If any
generator or stored path reads the seeded pick, STOP and report it. Rendered registers and pins that record a drawn title
are re-recorded by their own doors, with this cause named in the commit message. Do not loosen any equality.

## Where you work
Worktree `/home/user/wt/vr47`, branch `v23-vr47`, cut from the lane tip (the seat made it; `node_modules` is in place).
You touch no line of `supabase/`, `galleryVeil.js`, `galleryVeilPeople.js`, `galleryRosterChoices.js` or
`galleryWithholdAlways.js`: another builder holds those. Never run the whole suite. Strip GIT_DIR, GIT_WORK_TREE,
GIT_INDEX_FILE, GIT_COMMON_DIR, GIT_OBJECT_DIRECTORY and GIT_PREFIX from every test run's environment. Read a gate's exit
code with `sh scripts/gate-tail.sh <cmd>`. Commit with the hooks, never `--no-verify`. ONE commit. Outputs go under
`docs/chair/2026-11-20/veil/out/v23/vr47/`, one file per figure. Stop cleanly before about 200,000 tokens.

## Red first, then green
1. RED at the tip, both saved: (a) a born town's person cards rendered twice with their ids re-keyed (two different id
   maps) print a DIFFERENT honorific for at least one card; (b) a card whose institution key alone changes moves its
   honorific.
2. The cure: one helper, `honorificSeedOf(card)` or as you name it, built from name and title only. Every caller of
   `honorificOfTitle` uses it.
3. GREEN: (a) and (b) now hold for every card of every born town (count them); the owner's page and the shared page of a
   born town print the same honorific for every card; `tests/data/faceHonorifics.test.js` and every test that pins a
   drawn title are green or re-recorded with the cause; typechecks; eslint on the touched files; the render-twice harness
   (`tests/security/shareRenderTwice.pglite.test.jsx`) green at your tree (R4 is not on it yet: the harness's
   R4-branch reds are re-checked by the seat after both merge).
4. COUNT, for the owner's list: on the born towns, how many cards' printed honorific changes from the old seed to the
   new (the same person, the same office).

## Hand-back
`docs/chair/2026-11-20/veil/out/v23/vr47/VR47-HANDBACK.md`: the callers found, red and green with their files, the count,
every pin re-recorded with its cause, and your commit's hash.
