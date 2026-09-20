# FIX-P10 — LANE RESUME NOTE (CLEAN PAUSE for the account transfer, 2026-09-20)

Lane: Opus FIX-P10 (parallel). Chair: Fable 5.1, session a9df403c.
Worktree `$SP/lane-fix-p10` · branch `fix-phone-floor-2-2026-09-20` · base `5dd5e8e68`.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
Every command runs with `cd "$SP/lane-fix-p10" && …` (shell state does not persist).

## ⛔ STATE IN ONE LINE: NO COMMIT EXISTS. `HEAD` is still `5dd5e8e68`.

All four commits' edits are COMPLETE in the worktree and every red-first proof has
been executed and quoted. What has NOT run is `tests/lint` WHOLE, `tests/ui` WHOLE
and `tests/copy/voiceMechanics.test.js`.

**WHY NOTHING WAS COMMITTED, deliberately.** Lane law addendum 104 requires
`tests/lint` WHOLE before every commit that touches `src/` or `tests/`, and the
clean-pause order forbids starting a new run. A commit made now would be
un-lint-proven, and **amending is forbidden** — so the only way to repair it would
be a second commit apologising for the first. The work is not at risk: it is on
disk in this lane's own worktree, which nothing else may touch, with every file
hashed below. Uncommitted work can be corrected freely; an unproven commit cannot.
If the chair prefers a commit anyway, the pathspecs and messages are ready below.

## ⛔⛔ A FINDING THAT IS NOT MINE AND OUTRANKS MY WORK — A RAW NUL AT THE BASE

```
src/domain/worldPulse/supplyCompleteness.js   offset 6520   byte 0x00
```

Measured with a plain node byte read (`git grep -P '[\x00-\x08\x0b\x0c\x0e-\x1f]'`
reported it as a binary match). `git status` shows the file UNMODIFIED, so it is
the base tree's, not this lane's; `git log -1` for that path names
**`243ddc130b feat: Make-Changes consolidation, sim perf fix, gallery per-member
visibility, layer/palette + SEO pass`**.

`tests/lint/controlBytes.test.js` walks `src` and `tests` whole-C0, so **`tests/lint`
WHOLE is RED at `5dd5e8e68` for a reason that belongs to no lane running today** —
and it is a live NUL in a shipped `src/domain` file, which is the recurrence class
the estate already has a law about. Whoever runs `tests/lint` next must expect TWO
permitted reds, not one: the lighting walker and this. It wants a slot.

## THE COUNT LINES PRINTED SO FAR (every one quoted, none inferred)

```
eslint, BARE, all ten touched files                          exit 0, no output

COMMIT 4 measuring run (dossierPhoneFloorAllViews, -t)       Test Files 1 failed (1)
                                                             Tests 1 failed | 2 skipped (3)
  [/pricing floors] anonymous: prose 26 chrome 4 sub14 1 sub12 0
  [/pricing floors] premium:   prose 26 chrome 4 sub14 1 sub12 0
  (the only red was the placeholder PRICING_BASELINE — that red IS the measurement)

COMMIT 4 after filling the baseline + the posture guard     Test Files 1 passed (1)
                                                             Tests 1 passed | 2 skipped (3)
  wall clock 13 s for the whole file invocation; the arm itself 1.24 s of test time.
  WELL UNDER the brief's 20 s bar. PricingPage mounts in the dossier harness with NO
  change to the mocks the 18-view walk depends on.

COMMIT 1 RED-FIRST (plant: ClerkNote:52 back to a bare FS.sm)
  tests/components/publicChromeFloor.census.test.js          Test Files 1 failed (1)
                                                             Tests 2 failed | 10 passed (12)
  FAIL … THE PROSE FLOOR: every prose-shaped size on a rostered surface passes through proseFontSize
  FAIL … the prose-floor roster baselines are exact in both directions
        "src/components/generate/ClerkNote.jsx": { "floored": 1 } -> { "floored": 0 }
  RESTORED byte-identical (sha ccd28530…, `git diff --stat` empty).

COMMIT 2 RED-FIRST (plants: /create bare 96, /settlements files 209, /signin files 14
  — one step in the FORBIDDEN direction on each re-recorded number)
  tests/components/phoneChromeFloor.census.test.js           Test Files 1 failed (1)
                                                             Tests 1 failed | 8 passed (9)
  FAIL … each surface matches its registry row, and an owned surface may only shrink
    /create  bare 96 -> 97  (owned by lane 28 … — this number may only fall)
    /settlements  files COLLAPSED 209 -> 208 — the page stopped reaching its own subtree
    /signin  files COLLAPSED 14 -> 13 — the page stopped reaching its own subtree
  RESTORED byte-identical (sha 464cc861…).

COMMIT 3 RED-FIRST, mutant 1 (the cure's own line deleted)
  tests/ui/wizardOutputToolbar.test.jsx                      Test Files 1 failed (1)
                                                             Tests 1 failed | 13 passed (14)
  FAIL … the clearance is DERIVED in the source, from the two exports and no literal
  RESTORED byte-identical (sha eca025de…).

COMMIT 3 RED-FIRST, mutant 2 (a SECOND `const TOUCH_TARGET = 44;` put back in ArrowHeader)
  tests/ui/wizardOutputToolbar.test.jsx                      Test Files 1 failed (1)
                                                             Tests 1 failed | 13 passed (14)
  AssertionError: ArrowHeader still declares a second touch floor:
      expected [ 'const TOUCH_TARGET =' ] to deeply equal []
  RESTORED byte-identical (sha 70ee222d…).

GREEN, the final tree:
  tests/components WHOLE                                     Test Files 297 passed (297)
                                                             Tests 2106 passed (2106)
```

⛔ STILL OWED, in this order: `tests/ui` WHOLE · `tests/lint` WHOLE · the lighting
walker ALONE · `tests/copy/voiceMechanics.test.js`. Then the four commits.

## THE EXACT NEXT COMMAND

```
cd "$SP/lane-fix-p10" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 \
  GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- \
  npx vitest run --pool=threads --maxWorkers=2 tests/ui
```

then the same shape for `tests/lint`, then
`tests/lint/sovereigntyLightingContract.walker.test.js` ALONE, then
`tests/copy/voiceMechanics.test.js`. eslint has already run BARE and is clean.

## FILES, STAGED vs UNSTAGED, WITH HASHES

`git status --short` at the pause:

```
M  src/App.jsx                                        STAGED   d5d912f0c4bdde98404e4d900fb3cc1edf34ed8249b7044e345c2e0a976cc139
M  src/components/HomeHero.jsx                        STAGED   7248eb75cc99fa8037b08f21aaddf473a60e725be26387be3b86d4a6a8c64da0
M  src/components/generate/ClerkNote.jsx              STAGED   ccd28530cd3f5cb2944d3884af356e7b2aff74e859fb7c3ecb12d6eed5523374
M  tests/components/publicChromeFloor.census.test.js  STAGED   807d0ef40b9e8fcb75178560b46a531f0bdd1e097d9294344a2c592187c4b7eb
MM tests/components/phoneChromeFloor.census.test.js   BOTH     bd7058b3ec91d25340f2e439ff55f8345b4103cb7080e4a9d0afad6671112a85
 M src/components/generate/WizardOutputToolbar.jsx    unstaged eca025de994474120d3221ddcea326c7e55baca4a632423ca47417e1326453ec
 M src/components/nav/ArrowHeader.jsx                 unstaged 70ee222d5a380eedf33dba5cec4233d5800e080fafa70ba1a7b5ee0ecf3e64af
 M src/components/nav/arrowGeometry.js                unstaged bc9f78864406238f1d77511bfff03d6cdd23c551dcef377d2bf265710fd88faf
 M tests/components/dossierPhoneFloorAllViews.test.jsx unstaged dd4fd51501fdc6c76d1f7fcd84c4456c5512174898bfabccd4abeb343781c5ce
 M tests/ui/wizardOutputToolbar.test.jsx              unstaged 54c63af7e7c34a3f9ebfe088e2d47d8b641f225f0efd227226f53ffee0a77eff
```

⚠ `phoneChromeFloor.census.test.js` is `MM` ON PURPOSE. The INDEX holds COMMIT 2's
version (`/create files: 165`); the WORKTREE holds COMMIT 3's (`/create files: 166`,
because commit 3's import edge adds `arrowGeometry.js` to /create's closure). Commit
2 must be made from the index (`git commit -- <path>` takes the worktree, so
**stage-then-commit each in turn**: commit 2 first with the file reset to 165, then
re-apply 166 for commit 3). Simplest safe order is spelled out below.

Goldens, unchanged since before the first edit:
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  generator-golden-master.json
88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084  dossier-prose-manifest-golden.json
```

## THE FOUR COMMITS — PATHSPECS AND SUBJECTS (in order, once the gates are green)

Trailer for every one (the 2026-09-20 TRAILER RULING — an Opus lane signs as Opus):
`Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`. Keep any second line the
harness adds. NEVER amend. After each: `git show --stat HEAD` names only its paths.

1. `FIX-P10: five toasts, decks and notes stop reading at 12 px on a phone`
   `git commit -- src/App.jsx src/components/HomeHero.jsx src/components/generate/ClerkNote.jsx tests/components/publicChromeFloor.census.test.js`
   Body: the five lines classified PROSE with reasons; PROSE_FLOOR_ROSTER
   `App.jsx 0 -> 2`, `HomeHero.jsx 2 -> 4` (it already carried two floored `FS.xs`
   sites), `ClerkNote.jsx 0 -> 1`, the three pricing rows untouched; the proof that
   NEITHER the chrome ROSTER nor ROUTE_BASELINE can move (FS.sm=12 and FS.md=13 are
   not in `SUB_FLOOR_KEYS`, so `censusOfSource` claims none of the five in either
   direction — the full route table re-measured identical before and after).

2. `FIX-P10: three stale route rows re-measured, and the third was never named`
   `git commit -- tests/components/phoneChromeFloor.census.test.js`  (with /create at **165**)
   Body: `/create bare 98 -> 97` (owned; may only fall, `owner:` STAYS because 97 is
   not 0), `/settlements files 206 -> 208`, `/signin files 11 -> 13` — the third
   found by re-measuring EVERY row, and it is REVIEW-P F10's own other half (that
   landing moved `floored 4 -> 5` when it mounted RefusalNotice -> ClerkNote and
   never re-measured `files`). All three were GREEN in the permitted direction,
   which is exactly why none of them ever said so; the red-first therefore plants
   one step in the FORBIDDEN direction on each. Nothing raises a floor.

3. `FIX-P10: the wizard toolbar clears the painted controls' reach, not just the band`
   `git commit -- src/components/nav/arrowGeometry.js src/components/nav/ArrowHeader.jsx src/components/generate/WizardOutputToolbar.jsx tests/ui/wizardOutputToolbar.test.jsx tests/components/phoneChromeFloor.census.test.js`  (with /create at **166**)
   Body MUST carry, verbatim, the declared behaviour change in §"THE CHAIR'S RULING
   AND THE ONE DIVERGENCE" below, plus the seam pin's figures at 1024 and 1280.

4. `FIX-P10: /pricing's floors are measured on the page a reader is handed`
   `git commit -- tests/components/dossierPhoneFloorAllViews.test.jsx`
   Body: the refutation-by-construction of the "figures must equal 17/3/0"
   acceptance (those count SOURCE sites and `ruled` counts COMMENTS; a DOM walk sees
   neither), the shared verdict it asserts instead, `PRICING_BASELINE`
   (`prose 26 / chrome 4 / sub14 1 / sub12 0` in both postures) and the 1.24 s
   wall-clock.

## THE CHAIR'S RULINGS I AM UNDER, AND THE ONE DIVERGENCE

- **Commit 2**: cure all three rows, measure-first. DONE as ruled.
- **Commit 4**: assert the shared verdict plus the exact per-surface pin, as an arm
  in the existing file; do not destabilise the 18-view walk. DONE as ruled — and
  the harness needed NO mock change, so the walk is untouched. A posture-distinctness
  guard was added so the second posture cannot silently be the first page twice.
- **Commit 3**: the cure is ACCEPTED as planned — `TOUCH_TARGET = 44` exported from
  the pure leaf `arrowGeometry.js`, `ArrowHeader.jsx` importing it in place of its
  private copy, the toolbar's clearance derived from the two exports with no second
  literal. All of that is DONE and both halves are red-first proved.

⚠ **THE ONE DIVERGENCE, for the chair to veto in one line.** The ruling named
`top: max(HEADER_H, TOUCH_TARGET px)` AND required that the toolbar's "painted box
begins at HEADER_H" so no seam shows. Those two cannot both hold: moving `top` to
the reach puts the box's top AT the reach, which is what opens the seam, and every
way of painting into that seam from an inline style (a spread-less shadow, an
absolutely positioned filler) paints AT REST as well — where this bar is in normal
flow and a dark band above it lies over the page's own content. So the ruling's own
pin requirement is what decided it:

```js
position: 'sticky', top: HEADER_H, zIndex: 40,
paddingTop: `max(${SP.md}px, calc(${TOUCH_TARGET}px - ${HEADER_H}))`,
```

The BOX still begins at `HEADER_H` (the two paintings stay butted, so **no seam can
exist by construction** rather than being patched), while the CONTENT takes the
clearance. This is the chair's own named mechanism — "padding of 44 − HEADER_H in
the toolbar's own background".

**THE DECLARED BEHAVIOUR CHANGE, as measured (it is SMALLER than the ruling
assumed).** The desktop pin does NOT move and desktop padding does NOT change:
`max(SP.md, 44 − band)` resolves to `SP.md` at 1024 (band 32.65, so 11.35 < 12) and
at 1280 (band 40.81, so 3.19 < 12). **Desktop is untouched.** What changes is the
phone, where the bar reclaims exactly what the invisible button was taking:

```
cw    band (HEADER_H)   controls' reach   paddingTop   first control top   was occluded by
320   19.17             44                24.83        44                  12.83 px
375   22.47             44                21.53        44                   9.53 px
391   23.43             44                20.57        44                   8.57 px
430   25.76             44                18.24        44                   6.24 px
```

The coarse-pointer desktop band (640 to 1023, where `roomy` is true but the
toolbar's `isMobile` prop is false) is covered too: at 1024 content begins at 44.65
and at 1280 at 52.81, both clear of a padded 44. The two
`bar.style.top === HEADER_H` assertions therefore DID NOT move — they now carry the
seam claim explicitly, which is why the new arm asserts them at desktop alongside
an opacity check on every parsed colour stop of the bar's ground.

⛔ If the chair still wants `top` moved, the reversal is two lines in
`WizardOutputToolbar.jsx` and the seam then needs an owner-grade answer for the
at-rest band; say so and it is a ten-minute change.

## ⛔ NOTICED AND NOT TOUCHED

1. **The base-tree NUL** — `src/domain/worldPulse/supplyCompleteness.js` offset 6520,
   from `243ddc130b`. Reds `tests/lint/controlBytes.test.js` for everyone. Slot: a
   lane that may edit that file, or a ruling that the byte is intended.
2. **The geometry arms restate their formula.** `tests/ui/wizardOutputToolbar.test.jsx`
   computes `contentTop` as `band + max(SP.md, TOUCH_TARGET − band)` in the TEST;
   jsdom computes no layout, so nothing can read it back off a rendered box. What
   binds the claim to the shipped file is the source-guard arm (the same structure
   the file's existing `scroll-padding` guards use), and that arm is what the
   red-first mutant killed. A browser pass at the four widths would close it for real.
   Slot: REVIEW-P2's account walk, at 375.
3. **`GenerateWizard`'s scroll-padding under-reserves by the new clearance.** It sets
   `calc(HEADER_H + CHROME.toolbarHeight [+22])`, and the bar is now up to 24.83 px
   taller on a phone while `CHROME.toolbarHeight` stays 64. An anchored or focus
   scroll can land that much under the bar. Not touched: it is a second surface and a
   token change. Slot: one edit deriving the pad from the same two exports.
4. **The two /pricing postures give identical tallies** (`prose 26 / chrome 4`),
   though the pages differ in text — the guard proves the store swap reaches the
   tree. The tier difference lives in short button labels, which the walk's 45-char
   bound does not measure. Worth knowing before anyone reads the equality as a bug.
5. **FIX-P5's noticed items 1, 2 and 3** (the taste-approved sample's dagger, the
   byte-pinned Compendium tier label, the gallery's `textTransform: capitalize` over
   raw facet tokens) are untouched and still want their rulings.
