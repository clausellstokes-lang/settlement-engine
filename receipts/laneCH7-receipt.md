# TE-CH-7 receipt — MF-CH7, the criminal institution vocabulary

SLOT `claude/composite-r4` = `c3289244d58b7259205d80594856e8e0cc520817` (60 cars, packets 179,
census 2525/366/2159/21026/5848, ratchet 11 of 29,044).
WORKTREE `<scratch>/laneCH7-tree`, built with its OWN `npm ci` (589 pkgs). `.husky/_` PRESENT,
so pre-commit RAN and `eslint --fix` re-stages — every proof below was re-earned at the
COMMITTED TIP, never at the pre-commit working tree.

## COMMITS (tip = 37360143707657d07f5c2e631a881392a45756dc)
- `335b25049` — the fix + the 7-title pin + the lighting-census re-record
- `37360143707657d07f5c2e631a881392a45756dc` — MF-CH7 minted at LANDED, alone

## WHAT THE CAR DID
`criminal: /tavern|den|gang|black\s+market/i` was spelled TWICE in `src/domain/npcProfile.js`,
byte-identically — `CATEGORY_INSTITUTION_HINTS` (decides an NPC's `institutionLink`) and
`POWER_DOMAIN_HINTS` (the UI power tab). Both rows are now
`/\btaverns?\b|\bdens?\b|\bgangs?\b|\bblack\s+markets?\b/i`.

## THE FIGURES (all CONFIRMED by execution at this base)
- 276 unique catalog institution names.
- criminal row: **10 bare / 6 word-anchored**, 4 removed, 0 gained.
- THE FOUR FALSE POSITIVES, re-derived: `Resident smith (part-time)` (hamlet/Crafts),
  `Priest (resident)` (village/Religious), `Warden's Lodge` (town/Magic),
  `Dragon resident` (city/Exotic) — the identical four CH-1 anchored elsewhere.
- RENDER, executed both ways on one settlement in catalog order (Religious precedes Criminal,
  and `inferInstitutionLink` takes the FIRST match):
    before  institutionLink = institution.priest_resident
    after   institutionLink = institution.gambling_den
- per-alternate, bare -> anchored: tavern 2->2, den 5->1, gang 1->1, black market 2->2.
- 6 deliberate mutations red the pins; restore 46/46. M6 (first copy only) reds the
  `deriveNpcProfile` arms, M2/M5 (second copy only) reds the `institutionsFor*` arms.
- CENSUS DELTA **+0 files / +0 parked / +0 credited / +7 TITLES / +1 SUITE TITLE**
  (2,525/366/2,159/21,026/5,848 -> 2,525/366/2,159/21,033/5,849). Attribution is a SINGLE-FILE
  control: the slot's `tests/domain/npcProfile.test.js` (19,977 B, blob 846df16b2) restored over
  the car's copy with the tuple at the SLOT reading ran **33 passed of 33, exit 0**.
- PACKET SURFACE re-derived by execution: `[implementation-packets] valid: 180 packets (0 READY)`
  (179 -> 180). Three-place flip verified with the shipped parser: manifest LANDED / header
  LANDED / INDEX cell LANDED, 0 duplicates. `verifiedBase` stamped in BOTH places at the slot.

## ⭐⭐ RESUME POINT — a successor on a cold machine acts on this

TIP: `37360143707657d07f5c2e631a881392a45756dc`  (pinned — see PIN line at the bottom)
COMMITTED: the source fix, the pin block, the census re-record, and the MF-CH7 mint. The
worktree was CLEAN at the tip when the lane stood down.
REMAINS: ⛔ **TWO ACTS, and the car is NOT landable until both are done** — (1) regenerate the
three stale edge-shared sidecars (`npm run build:edge-shared`) and commit them as a set, then
(2) one clean full gate on a quiescent tree. The gate came back **RED at exit 1** on six
edge-bundle freshness/reproducibility arms caused by THIS CAR: `src/domain/npcProfile.js` is a
transitive input to the aiCharter / aiGrounding / aiOutputSchema bundles. Full detail, verbatim
lines and the exact commands are in the GATE VERDICT and the SUCCESSOR blocks below.
No CAS, no push, no pin deletion was performed. The sidecars were left unregenerated on purpose.

EXACT NEXT COMMAND (fresh shell, worktree at the tip, its OWN `npm ci`, nothing editing the tree):

    npm run build:edge-shared && git status --porcelain supabase/functions/_shared/

then commit the three moved bundle+meta pairs AS A SET, and only then:

    npm run check:tail ; echo TRUE_EXIT=$?

GREEN means all three: `TRUE_EXIT=0` AND `[gate-tail] exit: 0` AND free disk >= 300 MB.

### FOUR FINDINGS THAT ARE LOAD-BEARING FOR LATER CARS

1. ⚠⚠ **"ANCHOR EVERYTHING" IS THE WRONG GENERAL RULE HERE, and this is the finding that stops
   the next lane from over-anchoring.** I censused EVERY alternate in both hint tables against
   all 276 catalog names. Four match mid-word, and **three of them are TRUE POSITIVES that a
   word anchor would DELETE**:
     `church`  -> `Parish churches (2-5)`, `(10-30)`, `(50-100+)`  — `\bchurchs?\b` misses the
                  `-es` plural, so anchoring silently drops three real religious institutions
     `broker`  -> `Pawnbroker`  — a compound word with no internal boundary; a pawnbroker IS an
                  economic institution
     `bank`    -> `Banking houses`, `Banking district`  — `\bbanks?\b` misses `Banking`
   `den` was the ONLY alternate in either table whose mid-word population was entirely false.
   Anchor by MEASUREMENT, per alternate, printed both ways — never as a blanket sweep. A guard
   of the shape "no hint regex may match mid-word" would convict three correct rows.

2. ⚠⚠ **THE SEVENTH ARCANE SPELLING IS NOT FREE — it is its own car.** `npcProfile.js:334` and
   `:375` carry `/mage|wizard|college|alchemist|library|laboratory|tower|sanctum/i`, recorded
   UNCONVERTED in `arcaneClassifierCensus`'s `KNOWN_UNCONVERTED`. Measured against the canonical
   detector over all 276 names: the regex matches **9**, `isArcaneInstitution` matches **19**,
   **18 rows move** — 4 lost (`Alchemist shop`, `Alchemist quarter`, `Bardic college`,
   `Great library`) and 14 gained, **including `Healer (divine, 1st level)`, which is CH-6's
   parked question under DEITY DOCTRINE.** NOT converted here. Its own catalog mid-word
   population is ZERO; the class is reachable only through free text (`Pilgrimage destination`,
   `Pilgrimage services`, `Homager hall` all read arcane via `mage`; `Towering Oak Inn` via
   `tower`) — the MG-4 PILGRIMAGE finding one layer over. ⛔ A naive anchor is a TRAP there in a
   way it is not for `den`: **`\bmages?\b` LOSES `archmage`**, which is exactly why
   `arcaneInstitutionIdentity.js` restores that token explicitly.

3. ⚠⚠ **THE IDENTICAL BARE `den` ALSO SITS AT `src/domain/customContent.js:114`, UNCLAIMED.**
   The row is `{ pattern: /(den|hideout|blackmarket|safehouse|fence)/i, category: 'criminal' }`.
   Executed against that classifier's real first-match order: `The Gardens of Sela`,
   `Maidens Rest`, `Warden of the Wood`, `Wooden Bridge Post` and `Resident physician` ALL
   classify **criminal** today. Named here with its file and line so it is not re-found as new.
   It is a DIFFERENT population — unbounded user-typed names, not 276 catalog rows — so it needs
   its own measurement and its own car; do not sweep it in on this car's evidence.
   (The third sibling, `src/domain/districtProfile.js:113`, is the SAME defect and is
   **TE-CH-4's** — untouched by this lane. `src/domain/spatial/cohesionWeave.js:289` is the
   already-cured one: it spells `\bdens?\b` today, and it is the cure that did not travel.)

4. ⛔⛔ **THE EDGE-BUNDLE BILL IS A CLOSURE, NOT A FILE LIST — and it is what RED-ed this car's
   gate.** The brief warned that editing `src/data/institutionalCatalog.js` bills three edge
   bundles and five sidecars that commit as a set. I checked I was not touching that file and
   budgeted nothing. **Wrong reading.** The bill is keyed to the TRANSITIVE IMPORT CLOSURE of
   `src/domain/aiCharter.js`, `src/domain/aiGrounding.js` and `src/domain/aiOutputSchema.js`, and
   `src/domain/npcProfile.js` is inside all three (111 / 67 / 112 inputs). Any edit to any member
   makes those bundles STALE. Check membership BY EXECUTION before editing anything under
   `src/domain/` or `src/lib/`:
     `node -e "console.log(require('./supabase/functions/_shared/aiCharterBundle.meta.json').inputs.includes('src/domain/YOURFILE.js'))"`
   ⚠ It is INVISIBLE to a targeted suite run — none of the six failing arms lives in `tests/domain`
   or `tests/lint` — so only the FULL GATE shows it. See the GATE VERDICT block for the verbatim
   red and the two-act cure.

### ⛔ THE LINE COUNT WAS HELD AT 675 -> 675 ON PURPOSE — deliberate, not luck
`arcaneClassifierCensus.walker.test.js` keys `KNOWN_UNCONVERTED` by **`path:line`**, and holds
`src/domain/npcProfile.js:334` and `:375` — the arcane rows sitting DIRECTLY BENEATH each
criminal row this car edits. MF-CH5 re-pointed those exact two keys `333 -> 334` / `374 -> 375`
two days ago for ONE added import line. So this car is two one-line replacements and nothing
else: **675 lines before, 675 after.** Both census keys stay valid, no re-point is owed, the
arcane census is green untouched — and, the reason it was worth the constraint, **this lane
never had to edit the walker file that ALSO holds TE-CH-4's `districtProfile.js:112` key**,
which would have been a live cross-lane collision in a stacked landing. The rationale that would
normally sit in a comment block above the table sits in the PIN's header instead, because a
comment block above the table would have moved line 334.

### JUDGMENT CALLS (recorded for veto)
- **J1** Anchored ALL FOUR criminal alternates, not only `den`. tavern/gang/black market measured
  behaviour-IDENTICAL over the catalog (0 dropped, 0 gained), so it is free today, and it makes
  the whole row a word test rather than leaving three substring tests in the row that just
  failed. It DOES narrow behaviour for arbitrary non-catalog names (a legacy `Tavernside Hall`
  no longer reads criminal); judged correct and in-spirit.
- **J2** Did NOT anchor the arcane row. The chair scoped it to measurement; `\bmages?\b` loses
  `archmage`; and a partial anchor on a row already booked for conversion would hand the
  successor car a moved baseline (PARTIAL is the status that hides).
- **J3/J5** PINNED the two copies rather than MERGING them into one shared constant. A shared
  constant cannot stop someone un-anchoring it, so a pin was required either way; and the file's
  own header says `POWER_DOMAIN_HINTS` is a deliberately SEPARATE vocabulary that "evolves
  without a golden-master regen" while the other "must not shift", so merging one row would
  couple a golden-adjacent table to a UI-only one. The pin asserts both byte-equality AND the
  anchor, and the split control proves each copy is independently bound.
- **J4** Put the 7 pins in the EXISTING `tests/domain/npcProfile.test.js` rather than a new file
  — a NEW test file reds THREE ratchets (two censuses + mutationCoverageManifest TOTALITY).
  Used EXACT-SET assertions, no negative matcher, so `negativeAssertionAnchor`'s frozen count of
  3 for that file is untouched and no arm can pass by the collection having emptied.
- **J6** Minted at **LANDED**, not DRAFT. LANDED is TERMINAL so the packet reserves NO change
  path and cannot collide with a sibling car in the stack; a DRAFT mint would reserve
  `src/domain/npcProfile.js` against every later car. Precedent is the slot's own immediately
  preceding commit ("MF-CH5 registered at LANDED"). Verified no packet reserves this car's three
  paths: everything naming them is LANDED/terminal, and MF-CH3 (the one non-terminal packet in
  this train) names none of them.
- **J7** Did NOT write to the shared auto-memory index. Four lanes are live and MEMORY.md has a
  concurrent-writer hazard; the chair aggregates. Everything durable is in this receipt and in
  the final report.

### DECLARED SHIFT
No same-seed shift is claimed. `deriveNpcProfile` is consumed only by `src/domain/explanation.js`
and `institutionsForCategory`/`institutionsForPower` are UI-only (the file's own header says so),
so no generator golden is in the path. The full gate is the proof — see GATE.

### INSTRUMENT NOTES EARNED THIS LANE
- `grep` is ugrep and zsh eats unquoted globs: `grep -rn X --include=*.js` died with
  "no matches found: --include=*.js". Every scan here was re-done in plain node.
- Shell-escaping a `\b`-bearing regex through `node -e` failed twice; every mutation and edit was
  driven from a SCRIPT FILE, never an inline `-e`.
- `${SHA}:path` was braced everywhere and verified with `git rev-parse --verify -q` before use.

## GATE VERDICT — ⛔⛔ **RED. `TRUE_EXIT=1`, `[gate-tail] exit: 1`. THE CAR IS NOT LANDABLE.**

⚠⚠ **DATED CORRECTION.** An earlier draft of this receipt said the gate had not landed at
stand-down and labelled the run merely ADVISORY-because-contaminated. **It landed afterwards and
it is RED, and the red is REAL and it is THIS CAR'S.** The contamination caveat below still
stands and is still worth reading, but it is no longer the headline: a contaminated run cannot
manufacture this failure, because the failing arm hashes the COMMITTED tree.

### THE RED, VERBATIM

    [test-ratchet] TEST REGRESSIONS (fix them; do not widen the census):
      6 failing test(s) NOT in the frozen census:
        tests/edgeFunctions/aiCharterBundle.freshness.test.js :: aiCharter bundle is fresh the current source tree matches the recorded hash (regenerate via npm run build:edge-shared)
          ASSERTION - ran 46ms against a 20000ms budget (vite.config.js testTimeout) - a real verdict - read the message
          msg: AssertionError: Bundle is stale. One of these inputs changed since the last bundle:
        tests/edgeFunctions/aiGroundingBundle.freshness.test.js :: Tier 6.8 - aiGrounding bundle is fresh the current source tree matches the recorded hash (regenerate via npm run build:edge-shared)
          msg: AssertionError: Bundle is stale. One of these inputs changed since the last bundle:
        tests/edgeFunctions/aiOutputSchemaBundle.freshness.test.js :: aiOutputSchema bundle is fresh the current source tree matches the recorded hash (regenerate via npm run build:edge-shared)
          msg: AssertionError: Bundle is stale. One of these inputs changed since the last bundle:
        tests/edgeFunctions/edgeSharedBundleReproducibility.test.js :: edge-shared bundles reproduce AT THE COMMITTED TREE (the dirty-build class) aiCharterBundle.meta.json the recorded sourceHash equals the builder hash over INDEX content
          msg: AssertionError: aiCharterBundle.meta.json was built from content that is neither committed nor staged.
        tests/edgeFunctions/edgeSharedBundleReproducibility.test.js :: ... aiGroundingBundle.meta.json ... msg: AssertionError: aiGroundingBundle.meta.json was built from content that is neither committed nor staged.
        tests/edgeFunctions/edgeSharedBundleReproducibility.test.js :: ... aiOutputSchemaBundle.meta.json ... msg: AssertionError: aiOutputSchemaBundle.meta.json was built from content that is neither committed nor staged.

      machine at this run: load 45.91/39.63/24.71 over 8 core(s)
      full runner report: /var/folders/0l/_sz6gzvd11x6sthjy1jdj0_80000gp/T/test-ratchet-06YGJT/results.json
      stable copy of it:  /var/folders/0l/_sz6gzvd11x6sthjy1jdj0_80000gp/T/test-ratchet-last-red.json

    Frozen census is 11 failing test(s), measured at 4deb4f026644cba500b0efc1e051fdea2ff96041.
    [gate-tail] start:  8:36  up 19 days, 22:07, 1 user, load averages: 2.72 3.21 4.72 - cores: 8
    [gate-tail] end:  8:51  up 19 days, 22:22, 1 user, load averages: 45.91 39.63 24.71
    [gate-tail] exit: 1 (the gate's own status, not a pipe's)
    TRUE_EXIT=1

Phases that PASSED before it (the chain is `&&`-joined): the eleven validators,
`typecheck:ratchet` (`[typecheck-ratchet] OK - no type regressions (173 error(s), ceiling 173).`),
`typecheck:domain:strict`, `lint`. `build` and `verify:dist` were never reached.

### THE CAUSE, DIAGNOSED AND OWNED - I DID NOT FIX IT, PER CHAIR RULING

**`src/domain/npcProfile.js` IS A TRANSITIVE INPUT TO THREE EDGE-SHARED BUNDLES.** Measured:

    aiCharterBundle.meta.json       inputs=111   includes src/domain/npcProfile.js : YES
    aiGroundingBundle.meta.json     inputs= 67   includes src/domain/npcProfile.js : YES
    aiOutputSchemaBundle.meta.json  inputs=112   includes src/domain/npcProfile.js : YES
    analyticsEventsBundle.meta.json inputs=  2   : no
    intentAtlasBundle.meta.json     inputs=  2   : no

`scripts/build-edge-shared.mjs` computes each bundle's `sourceHash` as a sha256 over the CONTENT
of every transitive input of its entry point (`src/domain/aiCharter.js`,
`src/domain/aiGrounding.js`, `src/domain/aiOutputSchema.js`). My two-line edit to
`npcProfile.js` changed that content, so all three bundles are STALE and their committed
`sourceHash` no longer reproduces. The sidecars were left UNREGENERATED on purpose
(`git status --porcelain supabase/functions/_shared/` is EMPTY) - the chair ruled "if RED, do
not fix; pin and record".

### ⚠⚠ THE BILL I MIS-BUDGETED, AND THE LAW A SUCCESSOR SHOULD TAKE FROM IT
The brief warned that editing `src/data/institutionalCatalog.js` bills three edge bundles and
five sidecars that commit as a set. **I read that as a bill keyed to that ONE file, confirmed I
was not touching it, and budgeted nothing. That was the error.** The bill is not keyed to a named
file at all - **it is keyed to the TRANSITIVE IMPORT CLOSURE of the three AI entry points**, and
`src/domain/npcProfile.js` sits inside it. `institutionalCatalog.js` is merely one famous member
of that closure.

> ⛔ **THE EDGE-BUNDLE BILL IS A CLOSURE, NOT A FILE LIST.** Before editing ANY file under
> `src/domain/` or `src/lib/`, check membership BY EXECUTION:
> `node -e "console.log(require('./supabase/functions/_shared/aiCharterBundle.meta.json').inputs.includes('src/domain/YOURFILE.js'))"`
> - repeat for `aiGroundingBundle` and `aiOutputSchemaBundle`. If ANY answers `true`, the car owes
> `npm run build:edge-shared`, and the regenerated bundle+meta pairs commit AS A SET with the
> source edit.

⚠ **THIS BILL IS INVISIBLE TO A TARGETED SUITE RUN.** None of the six failing tests lives in a
tree a domain car naturally runs (`tests/domain`, `tests/lint`), so the ONLY instrument that
shows it is the FULL GATE. That is the argument for gating before believing a car is done - and
for gating a FINAL tree.

### ⚠ THE CONTAMINATION CAVEAT STILL STANDS (it is just not the headline)
I launched this run at `335b25049` and then wrote the MF-CH7 mint into the SAME working tree
while it was in flight. **`npm run check` reads the WORKING TREE, not a commit**, so early
validators read a pre-mint tree and later phases read the post-mint one - a verdict about a tree
that never existed. It cannot have manufactured this red (the reproducibility arm hashes the
COMMITTED tree, and `npcProfile.js` was committed at `335b25049` before the run began), but no
phase of this run should be quoted as a clean pass either. **A successor still owes ONE clean
full gate** - after the bundle regen, not instead of it.

### WHAT *IS* CLEANLY PROVED, at a quiescent tree, by its own instrument
- `node scripts/implementation-packets.mjs validate` -> `[implementation-packets] valid: 180
  packets (0 READY)`, run AFTER the mint at the final tree; three-place flip checked through the
  SHIPPED parser (manifest / header / INDEX cell all LANDED, 0 duplicates, `verifiedBase`
  `c3289244d...` in BOTH places).
- `tests/domain/npcProfile.test.js` -> 46 passed of 46; six deliberate mutations each red the
  intended arms; restore 46/46.
- `arcaneClassifierCensus` + `negativeAssertionAnchor` + `institutionsForCategory` +
  `institutionsForPower` + `wave1CohesionFixes` + `institutionClassify.parity` -> 58 passed of 58.
- `sovereigntyLightingContract` -> 33 passed of 33 at the re-recorded tuple, with a single-file
  attribution control and two md5-guarded negative controls.
- `typecheck:ratchet` OK at ceiling 173; `typecheck:domain:strict` and `lint` passed.

**THE DOMAIN CURE ITSELF IS UNCHALLENGED BY THIS RED.** Nothing in the six failures disputes the
anchoring, the pins, the census or the mint. All six say one thing: three generated sidecars were
not regenerated after a source file inside their closure changed.

### ⛔ THE LAW THIS RUN EARNED (generalises past this car)
**THE GATE READS THE WORKING TREE, NOT A COMMIT.** Any edit made while a gate is in flight splits
the run across two trees - early validators see the old one, later phases the new - and the
result is a verdict about a tree that never existed. Launch a gate only when the tree is FINAL,
or re-run after the last edit. It rhymes with the re-staging law and fails the same way:
pre-commit's `eslint --fix` rewrites bytes AFTER you measured them; this rewrites the tree WHILE
you measure it. Both yield a green describing bytes you did not ship.

## PIN

    refs/preserve/wip-ch7 -> 37360143707657d07f5c2e631a881392a45756dc

**`wip-`, NOT `holding-`, AND THE GATE HAS SINCE VINDICATED THAT CHOICE TWICE OVER.** It was
ruled `wip-` because a contaminated green is not a green; the run then came back **RED**, so a
`holding-` pin would have been actively false. `refs/preserve/holding-ch7` was verified ABSENT
and was never created. No CAS, no push, no pin deleted. Worktree CLEAN at the tip.

## ⛔ WHAT THE SUCCESSOR MUST DO — the car is TWO acts from landable, in this order

**ACT 1 — REGENERATE THE THREE STALE EDGE SIDECARS AND COMMIT THEM AS A SET.**
This is the whole red. Do it in a worktree at `37360143707657d07f5c2e631a881392a45756dc`:

    npm run build:edge-shared
    git status --porcelain supabase/functions/_shared/

⚠ Expect BOTH the `.js` bundle and the `.meta.json` sidecar to move for `aiCharter`,
`aiGrounding` and `aiOutputSchema` — **they commit AS A SET with each other**; a partial commit
re-reds the reproducibility arm with a different message. `analyticsEvents` and `intentAtlas`
(2 inputs each) do NOT carry `npcProfile.js` and must NOT move — if they do, something else
changed and that is a stop, not a rebuild.
⚠ The reproducibility arm is named "AT THE COMMITTED TREE (the dirty-build class)": it hashes
COMMITTED content, so the regen must be COMMITTED before it can pass. Rebuilding and re-running
without committing reproduces the same red.

**ACT 2 — ONE CLEAN FULL GATE, ON A TREE NOTHING IS EDITING.**

    npm run check:tail ; echo TRUE_EXIT=$?

GREEN means all three: `TRUE_EXIT=0` AND `[gate-tail] exit: 0` AND free disk >= 300 MB at end.
⛔ Do not touch the tree while it runs — that is the law this lane earned the hard way.
On a genuine green the pin may move `wip-ch7` -> `holding-ch7`.

⚠ **DO NOT WIDEN THE CENSUS.** The frozen roster is 11 failing tests at `4deb4f026`. These six
are NOT in it and must not be added to it; they are a stale-artifact bill with a build command,
not a banked failure.
⚠ **NOTHING IN THE DOMAIN CAR NEEDS REVISITING** to clear this red. The anchoring, the seven
pins, the census re-record and the MF-CH7 mint are all separately proved at quiescent trees and
are untouched by these six failures. Resist the urge to re-open them.

## STAND-DOWN NOTE — the in-flight gate was NOT killed, deliberately
`scripts/gate-mutex.sh` had **acquired the atomic lock as PID 29027**. Killing that run to tidy
up risks leaving a STALE LOCK DIR at `/tmp/settlementforge-vitest-gate.lock`, which would block
every sibling lane's gate. It is a read-only measurement, so it was left to drain and release
the lock on its own exit. **It did: the run completed at 08:51 and released the lock cleanly.**
Watcher loops were stopped. Nothing else of this lane is running.
