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
REMAINS: the full gate verdict (see GATE below) and, if a clean re-gate is wanted, nothing else.
No CAS, no push, no pin deletion was performed.

EXACT NEXT COMMAND (from a fresh shell, in a worktree at the tip, after `npm ci`):

    cd <worktree> && npm run check:tail ; echo TRUE_EXIT=$?

GREEN means all three: `TRUE_EXIT=0` AND `[gate-tail] exit: 0` AND free disk >= 300 MB.

### THREE FINDINGS THAT ARE LOAD-BEARING FOR LATER CARS

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

## GATE
See the GATE VERDICT block appended below.

## PIN
See the PIN block appended below.

---

## GATE VERDICT — ⚠⚠ ADVISORY ONLY. THIS IS NOT A GREEN AND MUST NOT BE READ AS ONE.

**THE RUN IS CONTAMINATED AND THE CAR HAS NO CLEAN GATE.** I launched `npm run check:tail`
at commit `335b25049` and then wrote the MF-CH7 packet mint into the SAME working tree while
that run was in flight. ⛔ **`npm run check` reads the WORKING TREE, not a commit.** So the
early validators read a PRE-MINT tree and the later phases read the POST-MINT one: the run
describes **a tree that never existed**. It is neither a pass nor a fail.

**AND IT HAD NOT LANDED WHEN THE LANE STOOD DOWN.** No `[gate-tail] exit:` line was ever
written. Everything below is partial evidence about a mixed tree, quoted verbatim, and is
recorded so a successor knows exactly what was and was not observed.

Verbatim, from `${TMPDIR}/gate-tail.9242.log` (that path is machine-local and dies with the
box — the lines are copied here because of it):

    [gate-tail] start:  8:36  up 19 days, 22:07, 1 user, load averages: 2.72 3.21 4.72 · cores: 8
    [typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).
    > settlementforge@1.0.0 test:ratchet
    > sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs
    gate-mutex: acquired atomic lock as PID 29027 after 0 poll(s).

Phases ENTERED, in order (the chain is `&&`-joined, so entering a phase means the previous one
exited 0 — against the mixed tree, and only against that):

    check · validate:hazard-registry · validate:premortem · validate:packets · validate:data ·
    validate:custom-content-manifest · validate:migration-head · validate:edge · validate:map ·
    validate:tuning-bands · validate:foundry-module · validate:mcp-server · typecheck:ratchet ·
    typecheck:domain:strict · lint · test:ratchet

NEVER REACHED, NEVER OBSERVED: the tail of `test:ratchet`, `build`, `verify:dist`, and the
`[gate-tail] exit:` verdict line itself. **An exit code with no collected-test count is not a
verdict, and here there is neither.**

### WHAT *IS* CLEANLY PROVED, at the final tree, by its own instrument
- `node scripts/implementation-packets.mjs validate` -> `[implementation-packets] valid: 180
  packets (0 READY)`. Run AFTER the mint, against the final tree. The three-place flip was
  checked through the SHIPPED parser: manifest LANDED / packet header LANDED / INDEX cell
  LANDED, 0 duplicates, `verifiedBase` `c3289244d…` in BOTH places.
- `tests/domain/npcProfile.test.js` -> 46 passed of 46; 6 deliberate mutations each red the
  intended arms; restore 46/46.
- `arcaneClassifierCensus` + `negativeAssertionAnchor` + `institutionsForCategory` +
  `institutionsForPower` + `wave1CohesionFixes` + `institutionClassify.parity` -> 6 files,
  58 passed of 58.
- `sovereigntyLightingContract` -> 33 passed of 33 at the re-recorded tuple, with a single-file
  attribution control and two md5-guarded negative controls.
These were each run BARE against a quiescent tree and are not contaminated. What is missing is
the WHOLE-gate statement, and only that.

### ⛔ THE LAW THIS RUN EARNED (generalises past this car)
**THE GATE READS THE WORKING TREE, NOT A COMMIT.** Any edit made while a gate is in flight
splits the run across two trees — early validators see the old one, later phases the new — and
the result is a verdict about a tree that never existed. Launch a gate only when the tree is
FINAL, or re-run after the last edit. It rhymes with the re-staging law and fails the same way:
pre-commit's `eslint --fix` rewrites bytes AFTER you measured them; this rewrites the tree WHILE
you measure it. Both yield a green describing bytes you did not ship.

## PIN

    refs/preserve/wip-ch7 -> 37360143707657d07f5c2e631a881392a45756dc

**PINNED `wip-`, NOT `holding-`, DELIBERATELY AND BY CHAIR RULING: a contaminated green is not
a green.** A `holding-` pin would let a successor reasonably conclude this car is landable, and
it is not yet — one clean `npm run check:tail` at this tip is the only thing standing between
`wip-ch7` and `holding-ch7`. `refs/preserve/holding-ch7` was verified ABSENT and was never
created. No CAS, no push, no pin deleted. Worktree CLEAN at the tip at stand-down.

### THE ONE COMMAND THAT PROMOTES THIS PIN
From a fresh shell, in a worktree checked out at `37360143707657d07f5c2e631a881392a45756dc`,
after its OWN `npm ci` (never a symlinked `node_modules`), with NOTHING editing the tree:

    npm run check:tail ; echo TRUE_EXIT=$?

GREEN means all three: `TRUE_EXIT=0` AND `[gate-tail] exit: 0` AND free disk >= 300 MB at end.
On green, the pin may be moved to `refs/preserve/holding-ch7`.

## STAND-DOWN NOTE — the in-flight gate was NOT killed, deliberately
`scripts/gate-mutex.sh` had **acquired the atomic lock as PID 29027**. Killing that run to tidy
up risks leaving a STALE LOCK DIR at `/tmp/settlementforge-vitest-gate.lock`, which would block
every sibling lane's gate. It is a read-only measurement, so it was left to drain and release
the lock on its own exit. ⚠ If a successor finds the gate mutex held by a dead PID 29027, that
is this run and the lock is safe to clear.
Watcher loops were stopped. Nothing else of this lane is running.
