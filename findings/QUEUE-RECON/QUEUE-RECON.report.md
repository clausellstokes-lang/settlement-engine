# QUEUE-RECON — composition forecast for the nineteen paused lanes

Stamp: `Sun Sep 20 15:24:24 EDT 2026` (`date`, at dispatch). Integration tip
`e45c4738bd99459105eeda7ae1617f67ae53a86c` (`fixes-2026-09-18-consist`), CONFIRMED by
`git rev-parse`. All nineteen worktrees exist and were measured by command. This lane
edited, staged, committed and deleted nothing; every git verb was a read
(`--no-optional-locks` throughout) plus `merge-tree --write-tree`, which writes only loose
objects. Evidence files cited below live in
`$SP/lane-queue-recon-scratch/` (`00-identity.txt`, `01-changesets.txt`, `02-drift.txt`,
`03-mergetree.txt`, `04-stale-literal-sweep.txt`, `05-stale-in-work.txt`,
`07-governing-bypath.txt`, `08-batches.txt`, `09-creates.txt`,
`10-overlap-classified.txt`, `11-citations.txt`).

---

## OUTCOME FIRST

**Four lanes are NOT safe to resume as they stand, and one of those should be re-cut rather
than merged.** `lane-tool-a` (TOOL-2b) is the re-cut: it is 97 commits behind, `git
merge-tree` CONFIRMS a content conflict in `tests/scripts/implementationPackets.test.js`,
it shares two files with `lane-tool-22`, and — the decisive fact — **its entire blocking
premise has dissolved under it**: the `EM-B1d` divergence it was waiting on the chair to
rule was cured on the integration branch (EM-B1d is `LANDED` at `95e494bdb`, its §7 table
corrected in `c740ded8b` exactly as the lane recommended), and the packet estate at the tip
now holds **195 packets, 193 LANDED / 2 SUPERSEDED / ZERO non-terminal**, so the lane's
red-first subject no longer exists and its new arm would go green vacuously.
`lane-tool-7a` (TOOL-7a) carries a real same-region conflict in its central artefact
`tests/helpers/codeOnlySource.js`, where FIX-T2 (`64021acd9`) appended a third source strip
at the same insertion point, plus a semantic one: the tip's own comment in that file points
readers at the file TOOL-7a is moving `codeSkeleton` OUT of. `lane-tool-22` (TOOL-22)
conflicts with TOOL-19 (`e4abd8ffa`) on the identical anchor line 111 of
`docs/implementation/PACKET_STANDARD.md` — trivial to resolve, but it will stop a naive
resume. `lane-tool-24` (TOOL-24) is textually clean but **semantically stale**: its four
shrink-only prose-byte totals were measured at `c127cdfb2` and the integration has since
changed 11 files inside the four roots it walks (including a deletion,
`src/domain/region/foldTradeCategories.js`, and a creation,
`src/domain/edit/recordRegister.js`), so the committed
`scripts/.prose-root-totals.json` will red at the tip unless re-measured first.

Beyond those four, the dominant finding is a **single systematic staleness, not per-lane
damage**: sixteen of the nineteen lane notes pin the prose-manifest golden as
`921c51cf6799…db41`, which moved on the integration branch to
`88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084` (CONFIRMED by hashing
the blob at the tip). Several notes make that pin a **STOP** ("a move is a STOP, not a
re-record" — FIX-P2; "Must be identical to the BEFORE measurement" — FIX-T1; "Must still
read" — FIX-G, TOOL-3, TOOL-24). Every one of those lanes will falsely abort on a lawful
CURE-K/CURE-J re-record unless the chair hands it the new sha in the resume message. The
generator golden `7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` is
UNMOVED at the tip, so those halves of the pins are still good. Only `lane-fix-p10` and
`lane-fix-c2d` already carry the live sha.

Two further pieces of good news, both measured: **no lane's actual WORK contains a stale
register literal** (`05-stale-in-work.txt` is empty but for TOOL-15's `1401208` and
`uncoveredBaseline: 186`, both of which match the tip), and **no lane has a stale
`file:line` citation** — across all nineteen, 25 cited paths were added and *zero* of them
moved on the integration branch (`11-citations.txt`). The RUN-23 literal-pin class is not
present in this queue. The RUN-23 *walker* class is, in four places, named per lane below.

---

## PER-LANE TABLE

Columns: branch · HEAD (own commits above base) · base and how far behind the tip ·
dirty rows (staged/unstaged/untracked) · overlap verdict · verdict.

### 1. `lane-fix-k1` — FIX-K1 · RESUME WITH WARNINGS
CONFIRMED: branch `fix-hasown-2026-09-20`, HEAD `5a3380e8d` = base, **0 own commits**,
72 behind. `git status --short`: **0 staged / 20 unstaged / 0 untracked** — nothing is
staged at all. Change set 20 files: 12 `src/` (traditions, worldPulse, spatial, lib,
components/admin) + 8 `tests/` (domain, lib). Note `FIX-K1.lane-resume.md`, 2026-09-20
04:55.
**Base drift: 0 of 20 files touched by the integration branch.** Cleanest drift profile in
the queue.
Governing tests outside its own dirs (`tests/domain`, `tests/lib`): `tests/lint` (ten
walkers incl. `entropyRootCensus`, `ruinFilterRoster`, `couplingInclusion`,
`strategyMoveVocabulary`, `tuningRegister`, `commercialReasonTaxonomy`,
`settlementMapSurfaceAllowlist`, `lawBandTable`, `seatVocabularyUnification`,
`negativeAssertionAnchor`), `tests/property` (4 dormancy fences), `tests/components`,
`tests/pdf`, `tests/store`, `tests/ui`, `tests/domain/events`. Its note runs `tests/lint`
WHOLE and names every one of the others by file — coverage is complete.
Registers: lighting only (frozen in the note at `2652·383·2269·25043·6679`, now
`2665·359·2306·25529·6815`). No mutation-manifest row.
Warnings to paste: *Nothing in this lane is staged — twenty modified files live only in
the working tree. Stage by explicit path before anything else, and never run a checkout,
stash, reset or clean in this worktree. Your note's frozen lighting tuple
`2652·383·2269·25043·6679` and the prose-manifest golden `921c51cf…` are both stale; the
live register is `2665·359·2306·25529·6815` and the golden is `88983938…`. Re-read both
before predicting a delta.*

### 2. `lane-tool-7a` — TOOL-7a · RESUME WITH WARNINGS (re-cut ONE file)
CONFIRMED: branch `tooling-7a-2026-09-20`, HEAD `5a3380e8d` = base, **0 own commits**,
72 behind. **24 staged / 0 unstaged / 0 untracked.** Change set 24 files, all `tests/` plus
`scripts/check-observed-shape-readers.mjs`. Note 05:04.
**Base drift: 1 of 24 — `tests/helpers/codeOnlySource.js`, and it is a SAME REGION
conflict.** Both sides append a new exported strip immediately after `codeOnly()`'s closing
brace at base line 74 and both prepend a large header block: the lane adds `codeSkeleton`
(moved out of `tests/lint/contractTestAntiVacuity.walker.test.js`); the integration's
`64021acd9` "FIX-T2: the witnessed-wait ratchet counts rendered debt, not the sentences
about it" adds `commentsOnly`. The two are *complementary*, not rival — resolution is a
union of both headers and both functions.
**SEMANTIC on top of it:** at the tip, `tests/helpers/codeOnlySource.js:115` reads
"`/` can only open a literal where an expression may begin) is `codeSkeleton`'s, in" —
and `tests/lint/contractTestAntiVacuity.walker.test.js:127` still holds
`export function codeSkeleton(src)`. TOOL-7a moves that definition into
`codeOnlySource.js`, so FIX-T2's freshly written cross-reference becomes false the moment
this lane lands.
Governing outside its dirs: only `tests/scripts/baseStateCapsule.test.js` (for
`scripts/check-observed-shape-readers.mjs`). Its note runs `tests/lint` WHOLE and names ten
other directories' files; `tests/scripts` is NOT in the batch.
Registers: lighting (note predicts `titles +13 · suiteTitles +2`, frozen at the stale
`2652·383·2269·25043·6679`, measuredAtSha `902580c71`); observed-shape (it edits the
reader-check script). No mutation row owed (all three touched walkers already hold
`self-proving-meta`).
Warnings to paste: *Re-cut `tests/helpers/codeOnlySource.js` at the tip rather than merging
it: FIX-T2 (`64021acd9`) added a `commentsOnly` strip at the same insertion point and wrote
a header that now has to describe three strips, not two. While you are there, correct the
sentence at `codeOnlySource.js:115`, which tells the reader `codeSkeleton` lives in
`tests/lint/contractTestAntiVacuity.walker.test.js` — your commit A moves it out. Add
`tests/scripts/baseStateCapsule.test.js` to your batch: it names
`scripts/check-observed-shape-readers.mjs` and is in no directory you run. Your frozen
tuple and the prose-manifest golden `921c51cf…` are both stale.*

### 3. `lane-tool-9` — TOOL-9 · RESUME WITH WARNINGS
CONFIRMED: branch `tooling-9-2026-09-20`, HEAD `5a3380e8d` = base, **0 own commits**,
72 behind. **1 staged / 0 / 0** — `tests/lint/sovereigntyLightingContract.walker.test.js`,
252 insertions / 1 deletion. Note 05:21.
**Base drift: 0 of 1.** `merge-tree` not applicable (no commits).
Governing outside its dirs: **none** — the change is confined to `tests/lint`, and its note
runs `tests/lint` WHOLE. Best-scoped lane in the queue.
**The one live hazard is a stale STOP.** The note makes this a hard stop: "⛔ THE REGISTER
IS UNTOUCHED: `tests/lint/.lighting-census-baseline.json` is still
`3fb7a7e8c406046ee6fb960f45e07ae362b3ead221d68c0e34ff4cb077a6013b`". CONFIRMED that at the
tip that file hashes to `487fc3638632a1ffa69f84233c8e156a475de968ac1e81919ff498ed6edba421`
— the eighth refreeze (`e45c4738b`) rewrote it. Its predicted tuple
`2652 · 383 · 2269 · 25046 · 6679` is derived from the same stale base.
Registers: lighting (reads it; explicitly writes nothing).
Warnings to paste: *Your note's register-sha guard is stale by design of the eighth
refreeze. The live `tests/lint/.lighting-census-baseline.json` hashes to `487fc36386…`, not
`3fb7a7e8c4…` — re-take that BEFORE/AFTER pin at the tip and treat a match against `487…`
as the pass. Your predicted `titles 25046` was `25043 + 3`; the live base is `25529`, so
predict `25532`. The prose-manifest golden is now `88983938…`.*

### 4. `lane-tool-8a` — TOOL-8a · RESUME WITH WARNINGS
CONFIRMED: branch `tooling-8a-2026-09-20`, HEAD `5a3380e8d` = base, **0 own commits**,
72 behind. **3 staged / 0 / 0** — two CREATEs
(`tests/lint/darkGuardCensus.walker.test.js`, `tests/lint/darkGuardRegistry.js`, 1,733 rows)
plus one manifest row. Note 06:47.
**Base drift: 1 of 3 — `scripts/mutation-coverage-manifest.json`, DISJOINT HUNKS**
(lane at base line 64; integration at 95/250/254/391/674/917/2807/2958 from FIX-D9, EM-R0a,
FIX-P5, FIX-P4, FIX-C2, EM-P2, EM-B1k2). The row it adds is a new key
(`tests/lint/darkGuardCensus.walker.test.js`, `kind:"rationale"`) — no label collision with
any other lane, all eight manifest-touching lanes add distinct keys (`10-overlap`,
manifest-row dump).
Governing outside its dirs: the manifest is *named* by 14 test files but **only
`tests/lint/mutationCoverageManifest.test.js:57` actually reads it**
(`JSON.parse(readFileSync(join(ROOT, 'scripts/mutation-coverage-manifest.json')))`); the
other 13 mentions are comments. That reader is inside `tests/lint`, which this lane runs
WHOLE. Coverage complete.
Registers: lighting (`+1 file, +3 suites, +11 titles` predicted; frozen stale);
mutation-coverage (`uncoveredBaseline` stays 186 — CONFIRMED 186 at the tip).
Warnings to paste: *Your `uncoveredBaseline` 186 and the generator golden `7177cd6e…8f1e`
are both still live at the tip — those pins pass. The prose-manifest golden `921c51cf…` and
the frozen tuple `2652·383·2269·25043·6679` are stale; use `88983938…` and
`2665·359·2306·25529·6815`.*

### 5. `lane-fix-p2` — FIX-P2 · RESUME WITH WARNINGS
CONFIRMED: branch `fix-mapdress-namespace-2026-09-20`, HEAD `5a3380e8d` = base, **0 own
commits**, 72 behind. **10 staged / 0 / 0**, one CREATE
(`tests/lint/ledgerKeyNamespace.walker.test.js`). Note 06:53.
**Base drift: 1 of 10 — the manifest, DISJOINT** (lane at base line 159).
Governing outside its dirs (`tests/domain`, `tests/lint`, `tests/security`):
`tests/lib/townSceneExport.test.js` (for `src/lib/townScene/townSceneExport.js`) and the
three `tests/edgeFunctions/*.freshness.test.js` + `tests/config/modelRegistryAgreement`
comment mentions (not readers). Its note runs `tests/lint` WHOLE plus explicit
`tests/domain`/`tests/security`/`tests/property` files — **`tests/lib/townSceneExport.test.js`
is NOT in the batch.**
Registers: lighting; mutation-coverage (one new rationale row).
**It is NOT an exclusive-build lane** — CONFIRMED, its note contains no `npm run build`,
`vite build` or `verify:dist` line. Only TOOL-3 actually builds.
Warnings to paste: *Add `tests/lib/townSceneExport.test.js` to your batch — it imports
`src/lib/townScene/townSceneExport.js`, which you edit, and `tests/lib` is in none of your
runs. Your note's golden STOP line ("must equal `7177cd6e…2ab9` and `921c51cf…db41` (a move
is a STOP, not a re-record)") is wrong twice: the generator golden's real tail is `…8f1e`,
not `…2ab9`, and the prose-manifest golden lawfully moved to `88983938…` under CURE-K. Do
not stop on either.*

### 6. `lane-fix-d7` — FIX-D7 · RESUME WITH WARNINGS
CONFIRMED: branch `fix-generator-hygiene-2026-09-20`, HEAD `5a3380e8d` = base, **0 own
commits**, 72 behind. **6 staged / 0 / 0**. Change set: 3 `src/generators/` + 3 `tests/`.
Note 06:58.
**Base drift: 0 of 6.**
Governing outside its dirs (`tests/generators`, `tests/lint`): `tests/build/engineChunkLazy`,
`tests/data/stressTypeRegistration`, `tests/domain/{arcaneIdentity, corruptionTraitGate,
generalStateProseDesk}`, `tests/joins/labelJoins` — all for `src/generators/npcGenerator.js`
and `institutionProbability.js`, and **none of those five directories is in its batch**
(it runs `tests/generators` WHOLE and `tests/lint` WHOLE only). This is the RUN-23 class.
Registers: lighting only.
Warnings to paste: *`npcGenerator.js` is read by name from four directories you do not run —
`tests/build/engineChunkLazy.test.js`, `tests/data/stressTypeRegistration.test.js`,
`tests/joins/labelJoins.test.js`, and three files in `tests/domain`
(`arcaneIdentity`, `corruptionTraitGate`, `generalStateProseDesk`). Add them by explicit
path. Your frozen tuple and the prose-manifest golden are stale.*

### 7. `lane-fix-t1` — FIX-T1 · RESUME WITH WARNINGS
CONFIRMED: branch `fix-ruin-replicas-2026-09-20`, HEAD `fad5af302` = base, **0 own
commits**, 66 behind. **10 staged / 0 / 0.** ⚠ Its one CREATE,
`tests/lint/ruinShapeReplica.walker.test.js` (22,335 B), is deliberately **parked outside
the tree** at `$SP/lane-fix-t1-scratch/staged/tests/lint/`, so the measured change set
under-counts it by design — CONFIRMED present on disk. Note 07:12.
**Base drift: 1 of 10 — the manifest, DISJOINT** (lane at base line 1024).
Change set includes `tests/domain/ruinInstitution.test.js`, one of the three files the brief
named; CONFIRMED it is among the 72 tests outside `tests/lint` that recursively walk `src/`.
Governing outside its dirs (`tests/domain`, `tests/generators`): the whole of `tests/lint`,
which its BATCH 5 runs WHOLE and calls mandatory. Coverage complete.
Registers: lighting (`+1 file · +1 credited · +7 titles · +1 suite` predicted);
mutation-coverage (one rationale row).
Warnings to paste: *Your CREATE is parked in scratch, not in the tree — BATCH 1's "base"
lighting run is therefore still honest, but the register itself has been refrozen twice
since you paused: read the live tuple `2665·359·2306·25529·6815`, not the note's
`2652·383·2269·25043·6679`, and ignore the dispatch's predicted `2653/383/2270/25048/6680`.
Your golden guard "Must be identical … `921c51cf…db41`" is stale — the live prose-manifest
golden is `88983938…`; only `7177cd6e…8f1e` and `preset-lighting-witness-golden.json` still
hold.*

### 8. `lane-fix-d8` — FIX-D8 · RESUME WITH WARNINGS
CONFIRMED: branch `fix-data-purity-2026-09-20`, HEAD `141a1d775` = base, **0 own commits**,
64 behind. **7 staged / 0 / 0**, one CREATE (`src/data/economyFreshnessSentences.js`).
Note 08:05.
**Base drift: 0 of 7.**
**Widest governance in the queue, because it edits `eslint.config.js`:** 21 test files name
it, of which nine are OUTSIDE its dirs (`tests/domain`, `tests/lint`) —
`tests/pdf/pdfFieldManifest.walker.test.js` (WALKER), `tests/docs/enforcedByExists.test.js`,
`tests/docs/enforcement-claims.test.js`, `tests/kernel/prngSeedEntropy.test.js`,
`tests/generators/economicStructure.test.js`, `tests/copy/tierWord.census.test.js`,
`tests/components/phoneFloorCensus.shared.mjs`,
`tests/data/dossierStateProseProjection.contract.test.js`,
`tests/store/tableEventCommit.test.js`. Its batch runs `tests/lint` WHOLE plus
`tests/data/dossierStateProseProjection`, `tests/components/economyFreshnessNote` and
`tests/copy/voiceMechanics` — so **`tests/docs`, `tests/kernel`, `tests/generators`,
`tests/pdf` and `tests/store` are uncovered.**
Registers: lighting (`2653·383·2270·25052→25055·6680` in its note — stale).
Warnings to paste: *You edit `eslint.config.js`, which five directories you do not run read
by name. Add `tests/docs/enforcedByExists.test.js`,
`tests/docs/enforcement-claims.test.js`, `tests/kernel/prngSeedEntropy.test.js`,
`tests/generators/economicStructure.test.js`, `tests/pdf/pdfFieldManifest.walker.test.js`
and `tests/store/tableEventCommit.test.js` by explicit path. Your note's eslint list names
`src/data/dossierStateProse/economy.generated.js`, which is not in your change set —
confirm whether that edit was withdrawn. Golden and lighting pins are stale.*

### 9. `lane-fix-g` — FIX-G · RESUME WITH WARNINGS
CONFIRMED: branch `fix-food-card-2026-09-19`, HEAD `ad7ddf2c9` = base, **0 own commits**,
**97 behind** — the second-deepest. **7 staged, one of them `MM`**
(`src/generators/economy/viability.js` is staged AND further modified in the worktree; the
index and the tree disagree). Note 2026-09-19 18:52.
**Base drift: 1 of 7 — `src/components/new/tabs/OverviewTab.jsx`, DISJOINT HUNKS**
(lane at 410–413, 454, 463; integration's `ee2406191` "FIX-C2: 58 stale citation addresses
re-addressed" at 546).
Governing outside its dirs (`tests/components`, `tests/generators`): fourteen files across
`tests/domain` (incl. `customContentConsumerEvidence.walker.test.js`, a WALKER),
`tests/domain/npc`, `tests/joins`, `tests/lib`, `tests/lint` (incl.
`chartProportionCensus` and `economyReadModelCoverage` walkers,
`institutionLabelSeam.census`, `resourceLabelSeam.census`), `tests/pdf`, `tests/ui`.
Its batch names eight `tests/lint` files, `tests/ui/generalDeskTabFlow`,
`tests/pdf/labelLadderParity` and two property goldens — **it runs NO directory whole**, and
`tests/domain/customContentConsumerEvidence.walker.test.js`,
`tests/lint/institutionLabelSeam.census.test.js`,
`tests/lint/resourceLabelSeam.census.test.js`, `tests/pdf/goldenViewModel.test.js`,
`tests/pdf/missingValuePlaceholders.test.js`, `tests/lib/entityRefProducerConsumer.contract.test.js`
and `tests/ui/mountFirstPaint.test.jsx` are all uncovered.
Registers: lighting (`+4 titles, 0 files`); worker byte budget (measured −47 B, no re-mint
owed — the ceiling 1,401,208 is CONFIRMED unchanged at the tip).
Warnings to paste: *Reconcile `src/generators/economy/viability.js` first — it is staged and
then modified again, so your index and worktree disagree. You run no directory whole, and
`OverviewTab.jsx` / `Overview.jsx` are read by name from seven files outside your batch:
`tests/domain/customContentConsumerEvidence.walker.test.js`,
`tests/lint/institutionLabelSeam.census.test.js`,
`tests/lint/resourceLabelSeam.census.test.js`, `tests/pdf/goldenViewModel.test.js`,
`tests/pdf/missingValuePlaceholders.test.js`,
`tests/lib/entityRefProducerConsumer.contract.test.js`, `tests/ui/mountFirstPaint.test.jsx`
— consider running `tests/lint` whole instead of the eight named files. Your step 11
requires the prose-manifest golden to still read `921c51cf…`; it lawfully moved to
`88983938…` under CURE-K, so that is not a STOP. Your step 6's single-row golden-master red
is unaffected — `7177cd6e…8f1e` is unmoved.*

### 10. `lane-tool-a` — TOOL-2b · **RE-CUT**
CONFIRMED: branch `tooling-a-2026-09-19`, HEAD `6fefb69e6`, **2 own commits**
(`6fefb69e6` TOOL-2, `52be5a1f2` TOOL-1) above base `ad7ddf2c9`, **97 behind**.
**6 staged / 0 / 0** for TOOL-2b. Note 2026-09-19 19:38, 527 lines.
**Base drift: 6 of 11 files — the worst in the queue.** `git merge-tree --write-tree
--name-only e45c4738b 6fefb69e6` prints (`03-mergetree.txt`):
`CONFLICT (content): Merge conflict in tests/scripts/implementationPackets.test.js`.
The conflict is the shared import block: the lane adds `parsePacketChangeTables` and
`readChangeTableRow`; the integration's `bb849c6e7` (TOOL-19) adds
`SEAL_ENVELOPE_SCHEMA_VERSION`, `readDispatchSeal`, `sha256` and a whole new import of
`scripts/implementation-session.mjs`. `docs/implementation/PACKET_STANDARD.md` is SAME
REGION too (lane 632 vs integration 631, `e4abd8ffa`).
`scripts/implementation-packets.mjs`, `vite.config.js`, `tests/scripts/implementationSession.test.js`
and the manifest are all DISJOINT.
**Why re-cut rather than resolve.** The lane's own header says "⛔ THE CHAIR'S RULING IS
NEEDED BEFORE THE BATCH CAN GO GREEN … It reds on exactly ONE packet in the estate:
`EM-B1d`, the only non-terminal packet". CONFIRMED at the tip: `EM-B1d` is
`**LANDED** at 95e494bdb`, flipped by `1feb5c9ba`, and `c740ded8b` ("the chair's owed
corrections on the branch") removed every `REGENERATE` action row and deleted the deferred
`tests/lint/.lighting-census-baseline.json` row — the packet now says at line 475
"⛔ `tests/lint/.lighting-census-baseline.json` IS NOT A ROW, AND THAT IS DELIBERATE."
That is disposition (i), already executed. And the estate has moved from the lane's measured
`188 packets (1 READY)` to **195 packets: 193 LANDED, 2 SUPERSEDED, 0 non-terminal**
(CONFIRMED by parsing `docs/implementation/PACKET_MANIFEST.json` at the tip). Since the arm
only judges non-terminal packets, at the tip it has no subject: it goes green vacuously and
its red-first is no longer reproducible.
Governing outside its dirs: `vite.config.js` alone is named by nine `tests/build` files,
three `tests/generators`, three `tests/security`, `tests/joins/goods`, `tests/data`,
two `tests/domain` — its batch runs `tests/scripts/` and `--dir tests/build` but not those.
Registers: lighting (`titles +4` for TOOL-1+TOOL-2 combined); mutation-coverage (one
rationale row); no size-baseline row owed (CONFIRMED by the note's own measurement).
Re-cut rationale to paste: *Re-apply TOOL-1/TOOL-2/TOOL-2b onto `e45c4738b` rather than
merging `6fefb69e6`. Your blocker is gone — EM-B1d LANDED at `95e494bdb` and the chair
executed your recommended disposition (i) in `c740ded8b`; no `REGENERATE` row survives.
But the estate now holds 195 packets with ZERO non-terminal ones, so re-establish your
red-first against a fixture rather than the live manifest before you claim the arm catches
anything, and say plainly in the commit body that the live-manifest assertion is green
because there is nothing non-terminal left to judge. Resolve `implementationPackets.test.js`
by re-authoring at the tip: TOOL-19 rewrote its imports and added an
`implementation-session.mjs` dependency.*

### 11. `lane-fix-f` — FIX-F2b · RESUME WITH WARNINGS
CONFIRMED: branch `fix-followups-2026-09-19`, HEAD `5c6c6df22`, **1 own commit** above base
`76be138a1`, **100 behind — the deepest in the queue**. **10 staged / 0 / 0.** Change set
24 files. Note 2026-09-19 19:59.
**Base drift: 7 of 24, all DISJOINT HUNKS**, and `merge-tree --write-tree` for `5c6c6df22`
prints **no conflict** (`03-mergetree.txt`).
**But there is a SEMANTIC exposure the textual check misses.** The lane moves 23 rows of
`tests/lint/.prose-numerics-baseline.json`; the integration moved 3 rows of the same file —
`8955b67a8` "CURE-B: the prose-numerics baseline re-addressed for train EM-T3's landings —
2 rows, addresses only" and `63f3288ab` FIX-P3/F4. Meanwhile the integration also edited
five of the tab components whose rows those addresses point into
(`EconomicsTab` `ee2406191`, `HistoryTab`/`RelationshipsTab`/`ResourcesTab` `7dea316c7`,
`OverviewTab` `ee2406191`). The lane's 23 rows were addressed at `76be138a1`; they must be
re-derived at the tip before the baseline is committed.
Governing outside its dirs (six directories already run, including `tests/lint` WHOLE):
only `tests/domain/npc/characterReadModel.test.js` and
`tests/property/dispositionChannelsDormancyGolden.test.js`. Narrow.
Registers: lighting; prose-numerics baseline (**sole owner in this queue**).
Warnings to paste: *You are 100 commits behind — the deepest lane in the queue — but
`git merge-tree` forecasts a clean merge and every one of your seven overlapping files is
disjoint. The real risk is semantic: your 23 prose-numerics rows were addressed at
`76be138a1`, and since then CURE-B (`8955b67a8`) re-addressed two rows and five of your tab
components were edited by `ee2406191` and `7dea316c7`. Re-derive every address at the tip
before committing `tests/lint/.prose-numerics-baseline.json`. Add
`tests/domain/npc/characterReadModel.test.js` and
`tests/property/dispositionChannelsDormancyGolden.test.js` to your batch.*

### 12. `lane-tool-3` — TOOL-3 · RESUME WITH WARNINGS (exclusive-build)
CONFIRMED: branch `tooling-3-2026-09-19`, HEAD `e5bdfd031` = base, **0 own commits**,
93 behind. **1 staged / 0 / 0** — a CREATE, `tests/build/workerBundleCeilings.test.js`,
deliberately RED by construction (its two measured constants are placeholder `0`).
Note 2026-09-19 19:59.
**Base drift: 0 of 1.** No governing test outside `tests/build`.
**The only true exclusive-build lane: CONFIRMED five `npm run build` / `vite build` /
`verify:dist` lines in its note — two full builds under the exclusive mutex plus one
attribution build, plus a bare `verify:dist`.** It is self-correcting about base drift, since
it mints its ceilings from the build it runs rather than from a recorded figure. Its
`STRICT DIST OK — 60 discovered/reported file(s)` expectation still holds: the chair measured
59 files at the tip in addendum 114, and this lane adds the 60th.
Registers: lighting (`+1 file · +1 credited · +5 titles · +1 suite`); it mints
`PULSE_WORKER_MEASURED_BYTES` and `SCENE_EXPORT_WORKER_MEASURED_BYTES`.
Warnings to paste: *Mint both ceilings from the builds you run at the tip — 93 commits of
worker-reachable code have landed since `e5bdfd031`, so any figure carried from your
evidence file is void. `STRICT DIST OK — 60` is still the right expectation (the chair
measured 59 at `e45c4738b`). The prose-manifest golden is now `88983938…`, not `921c51cf…`;
`7177cd6e…8f1e` is unmoved. Your three builds hold the exclusive mutex — schedule them in a
window where no other lane is queued.*

### 13. `lane-fix-p4b` — FIX-P4b · RESUME WITH WARNINGS
CONFIRMED: branch `fix-p4b-2026-09-20`, HEAD `578272a99` = base, **0 own commits**,
28 behind. **0 staged / 10 unstaged / 0** — nothing is staged. Note 12:59.
**Base drift: 1 of 10 — the manifest, DISJOINT** (lane at base line 940; it widens an
EXISTING rationale row in place rather than adding a key).
Governing outside its dirs (`tests/lint` only): a very wide set —
`tests/security/{cspForkIsolation, mapForkXssChain, mapForkSinkInventory.json}`,
`tests/lib/sfBridgeOrigin`, `tests/map/sfBridge.harness`, nine `tests/components`,
five `tests/ui`, four `tests/store`, `tests/build/generationWorkerLazy`,
`tests/config/tierFacts.contract`, `tests/generators/configSeamContract`. Its batch runs
`tests/lint` WHOLE and names files in security, lib, map, components, ui and store — good
coverage, but `tests/build/generationWorkerLazy.test.js`,
`tests/config/tierFacts.contract.test.js` and `tests/generators/configSeamContract.test.js`
are not in it.
Registers: lighting (frozen in the note at the SEVENTH refreeze `2664·359·2305·25501·6812`
— the eighth has since landed); mutation-coverage (in-place widening, no new key).
Warnings to paste: *Nothing in this lane is staged — ten modified files exist only in the
working tree. Your frozen register is the seventh refreeze (`2664·359·2305·25501·6812`); the
eighth landed at `e45c4738b` and reads `2665·359·2306·25529·6815`. Add
`tests/build/generationWorkerLazy.test.js` (it names
`src/store/settlementGenerateAction.js`), `tests/config/tierFacts.contract.test.js` and
`tests/generators/configSeamContract.test.js` to your batch. The prose-manifest golden is
`88983938…`.*

### 14. `lane-tool-15` — TOOL-15 · RESUME WITH WARNINGS
CONFIRMED: branch `tool-15-figure-in-symbol-2026-09-20`, HEAD `1c33181d6`, **1 own commit**
above base `c127cdfb2`, 53 behind. **2 staged / 0 / 0.** One CREATE,
`tests/lint/packetSymbolFigureCensus.walker.test.js`. Note 11:45.
**Base drift: 2 of 3, both DISJOINT**; `merge-tree --write-tree` prints **no conflict**.
`docs/implementation/PACKET_MANIFEST.json`: lane at base 32163–32164, integration at
32775/32777/33027 (`d8bf52f82`, `680eacb8d`, `7a6f85d20`). Manifest at 300 vs 260/264/401/932.
**Stale pin:** its checklist requires
`node scripts/implementation-packets.mjs validate` to print `valid: 194 packets (1 READY)`.
CONFIRMED at the tip: `docs/implementation/PACKET_MANIFEST.json` holds **195 packets —
193 LANDED, 2 SUPERSEDED, 0 READY.** Both halves of the pin moved. Its `uncoveredBaseline: 186`
and `1401208` pins are live (CONFIRMED at the tip).
Governing outside its dirs (`tests/lint`): `tests/scripts/{implementationGate,
implementationPackets, implementationSession}.test.js` all read `PACKET_MANIFEST.json` and
are not in its batch (which runs `tests/lint` WHOLE only).
Registers: lighting; mutation-coverage (one rationale row, moves `uncoveredBaseline` by zero
— its note says so explicitly and the note is right).
Warnings to paste: *Your `valid: 194 packets (1 READY)` pin is stale twice over — the tip
holds 195 packets and ZERO non-terminal ones (193 LANDED, 2 SUPERSEDED). Re-derive the line
before and after, and note that your arm 5's terminal-retiree admission now re-derives over
a manifest that gained EM-R0a. Add `tests/scripts` to your batch: all three of its packet
tests read `PACKET_MANIFEST.json`, which you edit. `uncoveredBaseline: 186` and
`WORKER_BUNDLE_CEILING_BYTES = 1401208` are both still live — those pins pass.*

### 15. `lane-tool-22` — TOOL-22 · RESUME WITH WARNINGS
CONFIRMED: branch `tool-22-reseal-2026-09-20`, HEAD `c127cdfb2` = base, **0 own commits**,
53 behind. **3 staged / 0 / 0** (208 insertions / 12 deletions). Note 11:48.
**Base drift: 2 of 3, and `docs/implementation/PACKET_STANDARD.md` is a SAME REGION
conflict at the identical base line 111.** Quoted from both sides
(`10-overlap-classified.txt` and the diff): the lane inserts "When the branch has moved
under a paused session — dispatch refusing because the capsule exists …
`--reseal <ID>` archives the prior capsule by rename …", and the integration's `e4abd8ffa`
(TOOL-19) inserts "A non-terminal packet's `retiredSymbols` symbol must still be present,
except where that packet's own seal in this worktree licenses the absence …" — both
immediately after "…requires the affected command to run again." and before "Dispatch and
resume do not create/delete worktrees…". Complementary paragraphs; resolution is to keep
both and choose an order. `tests/scripts/implementationSession.test.js` is DISJOINT
(lane 3/6/34/480 vs integration 187).
**Stale pin:** `valid: 194 packets (1 READY)` — as for TOOL-15, the tip is 195 / 0 READY.
Governing outside its dirs (`tests/scripts`): `tests/lint/sovereigntyLightingContract.walker.test.js`
names `scripts/implementation-session.mjs`, and the lane already runs that file alone.
Registers: lighting (frozen at `2656·383·2273·25074·6684`, predicted `titles +2`).
Warnings to paste: *One conflict, and it is trivial: TOOL-19 (`e4abd8ffa`) inserted its
`retiredSymbols`-seal paragraph at exactly your anchor, `PACKET_STANDARD.md` line 111. Keep
both paragraphs. Your `valid: 194 packets (1 READY)` pin is stale — the tip holds 195
packets and ZERO non-terminal ones. Your frozen tuple `2656·383·2273·25074·6684` is two
refreezes old; the live one is `2665·359·2306·25529·6815`. You also share
`PACKET_STANDARD.md` and `tests/scripts/implementationSession.test.js` with lane TOOL-A —
compose before it.*

### 16. `lane-tool-24` — TOOL-24 · **RESUME WITH WARNINGS (must re-measure before committing)**
CONFIRMED: branch `tool-24-prose-totals-2026-09-20`, HEAD `c127cdfb2` = base, **0 own
commits**, 53 behind. **3 staged / 0 / 0**, two CREATEs
(`scripts/.prose-root-totals.json`, `tests/lint/proseRootTotals.test.js`). Note 11:51.
**Base drift: 1 of 3 — the manifest, DISJOINT** (lane at base 2748).
**The real hazard is semantic and it is certain, not speculative.** The instrument is four
shrink-only, EXACT-equality totals of authored prose bytes under `src/generators/**`,
`src/domain/**`, `src/domain/certification/**` and `src/data/**`. The committed totals were
measured at `c127cdfb2`. CONFIRMED: the integration branch has changed **11 files inside
those roots** since — `src/generators/density/{densityAscension, successionGrammar,
titularSuccession}.js`; `src/domain/{certification/subsystemRowsWar, customContentSchema,
display/humanizeEngineTokens, edit/recordRegister, region/foldTradeCategories,
roads/state, worldPulse/supplyCompleteness}.js`; `src/data/sampleSettlements.js` — including
one file RETIRED by FIX-D9 (`foldTradeCategories.js`) and one CREATED by EM-R0a
(`recordRegister.js`). An exact total measured 53 commits ago cannot survive that.
Its `src/generators/safetyProfile.js` plant/restore pin
`94d07713e1349a075b8d34f5c0b103f47c886dde20ccd7f95ffcc4ab4d0af4db` is **still valid** —
CONFIRMED identical at `c127cdfb2` and at the tip.
Governing outside its dirs (`tests/lint`): only the manifest's comment mentions. It runs
`tests/lint` WHOLE. Coverage complete.
Registers: lighting; prose-root totals (**sole owner**); mutation-coverage (one rationale
row).
Warnings to paste: *Re-measure all four prose-root totals at the tip before you commit
`scripts/.prose-root-totals.json` — eleven files inside your four walked roots changed on
the integration branch since `c127cdfb2`, including a retirement
(`src/domain/region/foldTradeCategories.js`) and a creation
(`src/domain/edit/recordRegister.js`). Your totals are exact-equality shrink-only, so a
figure carried from your base is a guaranteed red. Your `safetyProfile.js` sha
`94d07713…` is unmoved, so both plants still restore cleanly. The prose-manifest golden is
now `88983938…`.*

### 17. `lane-fix-p9` — FIX-P9 · RESUME AS IS (hand it the ruling)
CONFIRMED: branch `fix-tier-word-2-2026-09-20`, HEAD `de16bdf6a`, **2 own commits** above
base `578272a99`, 28 behind. **`git status --short` is EMPTY** — a clean worktree.
Two further commits are prepared in scratch (`PricingSample.COMMIT3.jsx`,
`PricingTierCards.COMMIT3.jsx`, `fixtures.COMMIT4.js`, `tierWord.census.COMMIT4.js`,
`build-commit4.mjs`). Note 15:03; `FIX-P9.STOP.md` 15:01.
**Base drift: 1 of 6 — the manifest, DISJOINT** (lane at 404, an in-place rationale rewrite);
`merge-tree --write-tree e45c4738b de16bdf6a` prints **no conflict**.
Governing outside its dirs (`tests/components`, `tests/copy`):
`tests/docs/compendiumDataFreshness.test.js`, `tests/store/operationRegistry.walker.test.js`
(WALKER), `tests/domain/compendiumSearchDrift.test.js`, `tests/joins/crisisTripleSync.test.js`,
`tests/build/{prerenderRoutes, sitemap}.test.js`, `tests/lib/seoCompendium.test.js`,
thirteen `tests/ui/compendium*` files. Its batch runs `tests/lint`, `tests/components`,
`tests/design` and `tests/copy` WHOLE — **`tests/ui`, `tests/docs`, `tests/store`,
`tests/build`, `tests/joins`, `tests/lib` are uncovered**, and thirteen `tests/ui`
compendium tests read the generated artifact it regenerates.
**It is not drift-blocked; it is ruling-blocked, and the ruling exists.** `FIX-P9.STOP.md`
raises that commits 3 and 4 both move the `docs/samples/organic-craft/*.html` byte golden
through the `UPDATE_ORGANIC_SAMPLES` door, which its dispatch forbids categorically, while
`tests/fixtures/.golden-freeze-register.json` lists that spelling on `excludedEnvSpellings`
with the written reason that it "moves when the sample builder moves". Ledger addendum 114
(`1ae630c1f`) records: "FIX-P9's STOP ruled — the organic-samples regeneration door is
lawful under six conditions because the freeze register excludes that spelling by name."
Registers: lighting (`titles +1 · suiteTitles +0`, no file created); mutation-coverage
(in-place rewrite of the tier-word row, plus the gallery register row deleted).
Warnings to paste: *Your STOP is answered — addendum 114 rules the organic-samples door
lawful under six named conditions because the freeze register excludes
`UPDATE_ORGANIC_SAMPLES` by name; read the conditions before you use it, and commit the
refreshed HTML in the same commit as its source change. Add `tests/ui` to your batch: you
regenerate `src/domain/compendium/generated/compendiumData.generated.js`, which thirteen
`tests/ui/compendium*` files read, plus `tests/docs/compendiumDataFreshness.test.js` and
`tests/store/operationRegistry.walker.test.js`. The prose-manifest golden pin `921c51cf…` in
your note is stale — it is `88983938…`. This is the most expensive lane in the queue; budget
a long window.*

### 18. `lane-fix-p10` — FIX-P10 · RESUME AS IS
CONFIRMED: branch `fix-phone-floor-2-2026-09-20`, HEAD `5dd5e8e68` = base, **0 own
commits**, **14 behind — the shallowest**. **5 staged / 6 unstaged**, one of them `MM`
(`tests/components/phoneChromeFloor.census.test.js`). Note 15:23 — the freshest in the queue.
**Base drift: 0 of 10.**
**It is the only paused lane whose golden pins are already live:** its note requires
`7177cd6e…` and `88983938…`, both CONFIRMED current at the tip.
Governing outside its dirs (`tests/components`, `tests/ui`): `src/App.jsx` is named by 338
test files, which is a property of `App.jsx` rather than of this lane; its batch runs
`tests/ui` WHOLE (twice) and `tests/lint` WHOLE, and both phone-floor censuses it edits are
in its own change set.
Registers: lighting (`NOT REFROZEN`, no test file created).
Warnings to paste: *Reconcile `tests/components/phoneChromeFloor.census.test.js` first — it
is staged and then modified again. You are only 14 commits behind and nothing you touch has
moved on the integration branch; your golden pins `7177cd6e…` and `88983938…` are both
current. Note that `src/App.jsx` is named by 338 test files, so keep your edit to it as
narrow as the note describes.*

### 19. `lane-fix-c2d` — FIX-C2d · RESUME AS IS
CONFIRMED: branch `fix-c2d-doc-citations-2026-09-20`, HEAD `52bf58490`, **4 own commits**
above base `da5310f30`, **1 behind** — and the one commit between is `e45c4738b`, the eighth
refreeze, which touched only `tests/lint/.lighting-census-baseline.json`.
**`git status --short` is EMPTY.** Note and receipt both 15:21.
**Base drift: 0 of 43 files.** `merge-tree --write-tree e45c4738b 52bf58490` prints **no
conflict**.
**Citations verified:** it adds `file:line` addresses into 23 paths (from
`docs/DESIGN_HOOK_NONREDUNDANCY.md:112` through `tests/domain/sovereigntyBundleWr10.test.js:321`)
and CONFIRMED **zero** of those 23 paths moved on the integration branch since its base
(`11-citations.txt`). Its receipt carries the live `88983938…` and `7177cd6e…8f1e`.
Governing outside its dirs (`tests/lint`): none — 41 of its 43 files are `docs/`, and the
other two are `tests/lint/sourceCitationIntegrity.{shared.mjs, walker.test.js}` themselves.
Its batch runs `tests/lint` and `tests/docs` WHOLE.
Registers: lighting (its note already quotes the live `2665 / 25529 / 6815`).
Warnings to paste: *Nothing. This lane is one commit behind the tip, clean, conflict-free by
`merge-tree`, its 23 added citations all address files the integration branch has not
touched, and its golden and lighting pins are already the live ones. Compose it first.*

---

## COLLISIONS BETWEEN PAUSED LANES

Five files are claimed by more than one paused lane (CONFIRMED by intersecting the nineteen
change sets):

| File | Lanes | Compose first, and why |
|---|---|---|
| `scripts/mutation-coverage-manifest.json` | **8** — TOOL-8a, FIX-P2, FIX-T1, TOOL-A, FIX-P4b, TOOL-15, TOOL-24, FIX-P9 | **No ordering constraint.** Six add a distinct new key; FIX-P4b and FIX-P9 rewrite existing rows in place. All eight hunks are at different base offsets and no two claim the same `check_caught*` label. `uncoveredBaseline` stays 186 for every one of them, so the shrink-only arm is untouched. Compose in any order; just re-read the file between lanes, since each lands on a different line range. |
| `docs/implementation/PACKET_STANDARD.md` | TOOL-22, TOOL-A | **TOOL-22 first.** TOOL-22's insert is at base line 111 (already conflicting with TOOL-19); TOOL-A's are at 577 and 632. Landing the earlier, smaller edit first leaves TOOL-A a single hunk to rebase, and TOOL-A is being re-cut anyway. |
| `tests/scripts/implementationSession.test.js` | TOOL-22, TOOL-A | **TOOL-22 first** — it rewrites the file's head (lines 3/6/34) and adds one arm at 480; TOOL-A adds two rows at 58/65. TOOL-A's re-cut then absorbs both. |
| `src/components/new/tabs/OverviewTab.jsx` | FIX-F, FIX-G | **FIX-G first.** FIX-G's hunks are at base 410–463 (the Systems Health caption and bar name); FIX-F's are at 181–204 (the settlement-noun bag). Disjoint, but FIX-G also edits `src/pdf/sections/Overview.jsx` as a byte-for-byte twin, so landing it first keeps the twin invariant checkable in one step. |
| `tests/components/statBandsOverDigits.test.jsx` | FIX-F, FIX-G | **FIX-G first** — the file is FIX-G2's DOM proof for the caption it rewords; FIX-F only adds a noun assertion to it. |

**Shrink-only registers with a single owner each** (so no ordering constraint between
lanes): prose-numerics baseline → FIX-F alone; prose-root totals → TOOL-24 alone;
observed-shape reader baseline → TOOL-7a alone; `PACKET_MANIFEST.json` → TOOL-15 alone.

**The one register every lane moves is the lighting census**, and none of them may refreeze
it. Thirteen of the nineteen predict a delta against a frozen tuple that has since moved
twice. The chair should tell each resuming agent to *read the live register at the tip and
record its delta against that*, and keep the refreeze as the train's single terminal act.

---

## RECOMMENDED GATE ORDER

Cheapest-and-safest first, collisions resolved in the order above, the one build lane
isolated at the end.

1. **FIX-C2d** — 1 behind, clean, merge-tree clean, citations verified, live pins. It also
   lands the `sourceCitationIntegrity` walker changes, which is the instrument the chair's
   D9 proof had an unattributed red on; clearing it first de-risks every later lane's
   `tests/lint` whole run. ~10–16 min.
2. **FIX-P10** — 14 behind, zero drift, live golden pins, freshest note. Only the one `MM`
   file to reconcile. ~20–35 min (two `tests/ui` whole runs, cost unknown).
3. **TOOL-22** — cheapest real lane (~7–11 min: `tests/scripts` nine files ≈ 1 min plus four
   focused runs); one trivial doc conflict. Landing it early clears TOOL-A's two shared
   files before TOOL-A is re-cut.
4. **TOOL-15** — clean merge, one `tests/lint` whole. ~9–13 min. Pair it with TOOL-22: both
   are packet-tooling lanes and both need the `valid: N packets` line re-derived once.
5. **TOOL-9** — best-scoped lane in the queue (one file, one directory), ~12–16 min. Land it
   before the other `tests/lint` creators so its census *print mode* is available to them for
   reading the live tuple without refreezing.
6. **TOOL-8a · FIX-P2 · TOOL-24 · FIX-T1** — the four `tests/lint` CREATE lanes, each one
   `tests/lint` whole (4–8 min) plus focused runs; ~10–20 min each. TOOL-24 must re-measure
   its four prose totals at the tip first. FIX-T1 must copy its parked CREATE into the tree
   between its base and after lighting runs.
7. **FIX-D7 · FIX-D8 · FIX-K1** — src-heavy, zero drift, each needing extra directories
   added to its batch. ~13–25 min each. FIX-D8 is the widest blast radius (it edits
   `eslint.config.js`), so give it the most generous window.
8. **FIX-G, then FIX-F** — in that order, for the two shared files. FIX-G ~10–14 min but
   under-scoped (it runs no directory whole); FIX-F ~13–20 min and must re-derive its
   prose-numerics addresses first.
9. **FIX-P4b** — ~17–25 min; ten unstaged files to stage by explicit path first.
10. **TOOL-7a** — ~16–24 min, after re-cutting `tests/helpers/codeOnlySource.js` at the tip.
    Land it *after* FIX-T2's `commentsOnly` is settled in everyone's mind, since its commit
    must also correct that file's cross-reference.
11. **FIX-P9** — the most expensive by far (~45–75 min: three `tests/lint` whole, three
    `tests/design` whole, two `tests/components` whole, one `tests/copy` whole) and it now
    additionally owes `tests/ui`. Safe to run, so its position is purely about cost.
12. **TOOL-A (re-cut)** — ~20–30 min of gate plus the re-authoring. Last of the test lanes,
    because its premise changed and its arm needs a fresh fixture-based red-first.
13. **TOOL-3** — LAST, in a dedicated window. It takes the **exclusive** mutex three times
    (two `npm run build`, one attribution `vite build`) plus a bare `verify:dist`; ~35–55
    min during which no other lane can hold a gate. CONFIRMED it is the only lane in the
    queue that builds — despite the dispatch note, **FIX-P2 runs no build at all**.

### Flags against the Edit-Mode packet EM-R0d v4

- **TOOL-A and TOOL-15 both change the rules a non-terminal packet is judged by** — TOOL-A's
  arm compares a packet's §7 change-manifest table with its JSON `changeManifest` and reds
  only on non-terminal packets; TOOL-15's walker governs `requiredSymbols` / `retiredSymbols`
  spellings with a terminal-retiree admission. CONFIRMED that at `e45c4738b` the estate holds
  **zero** non-terminal packets, so both are currently subject-less. Land them **before**
  EM-R0d v4 is placed READY, or **after** it lands — placing EM-R0d v4 between them and the
  gate would subject a packet the chair has already pre-proofed to two rules it was never
  written against.
- **TOOL-22 changes `implementation:dispatch` itself** (it adds `--reseal`, which archives a
  drifted capsule by rename and dispatches afresh). That is the command that will dispatch
  EM-R0d v4. Either land TOOL-22 well before the EM-R0d v4 dispatch, or after it — not
  between the placement and the dispatch.
- **EM-R0d is not on the consist branch.** CONFIRMED: at `e45c4738b`,
  `docs/implementation/packets/settlement-editor/` holds `EM-R0a.md` and no `EM-R0d.md`, and
  `PACKET_MANIFEST.json` lists `EM-R0a` only among the `EM-R0*` family. Whatever "EM-R0d v4
  PLACED (READY-ABLE at `578272a99`)" refers to, `578272a99` carries no EM-R0d packet file
  either. The chair should confirm where that placement lives before scheduling its build.

### Gate-cost summary

| Lane | Whole-directory runs planned | Estimate |
|---|---|---|
| TOOL-22 | `tests/scripts` (9 files, ≈1 min) | 7–11 min |
| TOOL-15 | `tests/lint` ×1 | 9–13 min |
| FIX-G | none (10 focused invocations) | 10–14 min |
| FIX-C2d | `tests/lint` ×1, `tests/docs` ×1 | 10–16 min |
| TOOL-8a | `tests/lint` ×1 | 10–15 min |
| TOOL-9 | `tests/lint` ×1 | 12–16 min |
| FIX-P2 | `tests/lint` ×1 | 12–16 min |
| TOOL-24 | `tests/lint` ×1 (+ re-measure) | 13–18 min |
| FIX-D8 | `tests/lint` ×1 | 13–18 min |
| FIX-T1 | `tests/lint` ×1 (+ lighting ×2) | 14–20 min |
| FIX-K1 | `tests/lint` ×1 | 15–20 min |
| FIX-D7 | `tests/generators` ×1, `tests/lint` ×1 | 12–20 min (`tests/generators` unknown) |
| FIX-F | `tests/lint` ×1 | 13–20 min |
| TOOL-7a | `tests/lint` ×1 | 16–24 min |
| FIX-P4b | `tests/lint` ×1 | 17–25 min |
| FIX-P10 | `tests/lint` ×1, `tests/ui` ×2 | 20–35 min (`tests/ui` unknown) |
| TOOL-A | `tests/scripts` ×1, `--dir tests/build` ×1, unfiltered `vitest list` | 20–30 min (the unfiltered collection is unknown) |
| TOOL-3 | none, but 2 builds + 1 attribution build + `verify:dist` | 35–55 min, **exclusive** |
| FIX-P9 | `tests/lint` ×3, `tests/design` ×3, `tests/components` ×2, `tests/copy` ×1 | 45–75 min |

Figures use the chair's measured wall-clocks (`tests/lint` whole 4–8 min; `tests/lib` 0.5;
`tests/scripts` 1; `tests/build` 0.5) plus ~1 min per focused invocation including mutex
acquisition. `tests/components`, `tests/ui`, `tests/design`, `tests/generators`,
`tests/domain` and an unfiltered `vitest list` are **unknown** — no measured figure was
supplied for them, and the estimates above carry that uncertainty.

---

## LABELLING

CONFIRMED (executed command, quoted output, or a count computed from one): every sha,
branch, HEAD, base, behind-count and dirty-row count in the per-lane table; all nineteen
change sets and the 0/1/2/6/7-file drift counts; the three SAME-REGION classifications and
their quoted regions; the `merge-tree` conflict in `tests/scripts/implementationPackets.test.js`
and the clean forecasts for FIX-F, TOOL-15, FIX-P9, FIX-C2d; the live register values at
`e45c4738b` (generator golden `7177cd6e…8f1e` unmoved; prose-manifest golden `88983938…`;
lighting `2665·359·2306·25529·6815`; lighting-register file sha `487fc36386…`;
`WORKER_BUNDLE_CEILING_BYTES = 1401208` at `tests/build/generationWorkerLazy.test.js:159`;
`uncoveredBaseline: 186`; observed-shape `"total": 1964` at
`scripts/.observed-shape-readers-baseline.json:49739`; EM preamble
`c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`); the stale-literal sweep
over all nineteen notes and all nineteen diffs; the citation check (25 paths, 0 moved);
EM-B1d's LANDED status and the removal of every `REGENERATE` row; the packet census
(195 / 193 LANDED / 2 SUPERSEDED / 0 non-terminal); the 11 integration-side file changes in
TOOL-24's four walked roots; `safetyProfile.js` sha unmoved; `mutationCoverageManifest.test.js:57`
as the manifest's only real reader; that only TOOL-3 and TOOL-A mention a build.

PLAUSIBLE (reasoning only): the gate-cost estimates, and in particular every "unknown"
directory; the judgement that TOOL-7a's and TOOL-22's conflicts are cheap to resolve by
union rather than re-cut; the claim that TOOL-7a's correction of `codeOnlySource.js:115`
would not itself trip `sourceCitationIntegrity` (that walker checks `file:line` addresses and
the sentence carries a bare filename); the ordering rationale inside the recommended queue.

---

## H. PROPOSED BATCHES

Added after dispatch, on the owner's directive that queued lanes be COMBINED INTO ONE GATE
where sound, and the chair's adoption of it as BATCH GATES (compose several lanes onto a
throwaway branch cut at the green tip, refreeze the census once, prove the whole batch with
ONE `npm run check`). Everything above this line is unchanged.

**Twenty lanes have a worktree.** The nineteen forecast above, plus `lane-fix-w1`, measured
now. CONFIRMED for FIX-W1: branch `fix-w1-doubled-article-2026-09-20`, HEAD
`e45c4738b` — **base = tip, ZERO behind, zero drift**, `2 staged / 0 / 0`
(`M src/domain/worldPulse/factionDensityKernel.js`, `A
tests/domain/wizardNewsDoubledArticle.contract.test.js`). Its red-first is already executed
ungated and quoted (`arms.precure.log`: `# result: 4 RED`, first offender
`Ashford: the The Chandlers is no more`; `arms.cured.log`: `# result: ALL GREEN`), and
— decisive for criterion (3) — `golden-proof.log` reads
`rows re-hashed: 525 / rows missing from the fixture: 0 / rows whose hash MOVED: 0` and
`worlds swept: 525 / doubled-article hits: 0`. **FIX-W1 does NOT use the golden door and
moves no fixture row**, despite being a `src/domain/worldPulse/` write.

**FIX-G4, TOOL-20, FIX-D10 are placeholders only** — CONFIRMED no worktree exists for any of
them (nor for TOOL-16, TOOL-17, FIX-B3 or FIX-D6). They cannot be batched until dispatched;
FIX-D10 is chartered after RUN 23 and FIX-G4 after §934.76, so both are downstream of this
queue by construction.

**No lane's change set contains a binary file** (CONFIRMED: `git diff --numstat` shows zero
`- -` rows across all twenty), so `git apply --3way` is safe everywhere except the four
generated/measured artifacts named per member below.

### H.1 Excluded from batching

| Lane | Rule | Disposition |
|---|---|---|
| TOOL-A | (5) SAME REGION — `merge-tree` CONFLICT in `tests/scripts/implementationPackets.test.js`; `PACKET_STANDARD.md` 632 vs 631 | **RE-CUT, SOLO.** Premise dissolved (EM-B1d LANDED; 0 non-terminal packets at the tip). |
| TOOL-7a | (5) SAME REGION — `tests/helpers/codeOnlySource.js` base line 74, both sides append a strip; plus SEMANTIC (the tip's `:115` points at the file this lane empties) | **SOLO**, re-cutting that one file. |
| TOOL-22 | (5) SAME REGION — `PACKET_STANDARD.md` base line 111, TOOL-19's paragraph at the identical anchor | **SOLO.** Trivial resolution, but it is a conflict and the rule is the rule. |
| FIX-F | (5) SEMANTIC — its 23 prose-numerics addresses were derived at `76be138a1`; CURE-B re-addressed two rows and five of its tab components moved since | **SOLO.** Its baseline is a whole-tree measurement that must be re-derived at the tip. |
| TOOL-24 | (5) SEMANTIC — its four exact prose-byte totals were measured at `c127cdfb2`; 11 files inside its four walked roots changed since, incl. one retirement and one creation | **SOLO.** *Vetoable alternative:* it could instead ride as the TERMINAL member of Batch 1, measured after every other member is applied — cheaper by one full check, but it serialises the compose and the coordinator's rule (5) says SOLO. Chair's call. |
| FIX-G | (3) golden door — it deliberately leaves `tests/property/generatorGoldenMaster.test.js` RED on one row (`town\|germanic\|mountain\|mountain_pass\|civilized\|golden-master-v3`) and forbids itself the re-record, which "rides EM-P1's signed golden door … and is the chair's act" | **SOLO.** A batch's single `npm run check` cannot be green with a deliberately-red golden in it. Land it only in a window where the chair re-records in the same act. |
| FIX-P9 | (3) fixture regeneration door — the ONLY lane in the queue using one (`UPDATE_ORGANIC_SAMPLES`, ruled lawful by addendum 114 under six conditions), and it additionally regenerates `src/domain/compendium/generated/compendiumData.generated.js` | **SOLO.** Two moved-artifact causes in one lane is already the limit; a second such lane in the same batch would make the moved rows unattributable. |

That is seven SOLO lanes and thirteen batchable ones.

### H.2 The minimum partition, and why I am recommending a split above it

CONFIRMED by intersecting all twenty change sets: **among the thirteen batchable lanes the
ONLY shared file is `scripts/mutation-coverage-manifest.json`** (TOOL-8a, FIX-P2, FIX-T1,
FIX-P4b, TOOL-15), and I have read all five diffs — they insert or rewrite at base lines
64, 159, 1024, 940 and 300 respectively, five distinct keys, no shared `check_caught*`
label, and `uncoveredBaseline` stays 186 for every one of them (186 CONFIRMED at the tip).
Every other pair is file-disjoint. No batchable lane uses a golden or fixture door. No two
move the same shrink-only register in a way needing an ordering I cannot state.

**So criteria (1)–(6) permit a single batch of all thirteen, and that is the literal
minimum.** I am reporting it as such, and then recommending three batches instead, for one
reason I can state plainly: **attribution.** The chair's own refreeze commits attribute the
census delta per commit, and RUN 23 went red on two causes that took a walker census to
separate. A thirteen-member batch whose one check goes red hands the chair a red test name
and thirteen candidate causes; three batches of four to five hand it three or four. The
split below costs two extra `npm run check` runs and buys a tractable attribution key. It is
a judgement, not a criteria-forced partition — veto it and compose all thirteen at once.

### H.3 BATCH 1 — "the worker graph and its ceilings" (5 members)

**Members, in application order:** FIX-W1 → FIX-K1 → FIX-P2 → FIX-D7 → **TOOL-3 (last)**.

**Why these five together, and why TOOL-3 must be last.** This is the one batch criterion (4)
actually forces. TOOL-3 mints two measured byte ceilings from a real build, and its
measurements are **NOT independent of the other members' changes** — CONFIRMED by reading
the worker entries at the tip:
`src/workers/advanceInterval.worker.js:23` imports `simulateCampaignWorldInterval` from
`../domain/worldPulse/advanceInterval.js`, and `src/domain/worldPulse/pulseKernel.js:74`
imports `./generosityKernel.js` while `:103` imports `./factionDensityKernel.js` — so
**FIX-K1's five `src/domain/worldPulse/*` edits and FIX-W1's `factionDensityKernel.js` edit
are inside `PULSE_WORKER_MEASURED_BYTES`' own module graph.**
`src/workers/townSceneExport.worker.js:10-15` imports `compileTownSceneGeometry`,
`encodeTownSceneGlb`, `encodeTownScenePortraitPng` from `../domain/townScene/index.js` — so
**FIX-P2's three `src/domain/townScene/*` edits are inside
`SCENE_EXPORT_WORKER_MEASURED_BYTES`' graph.** Minting either ceiling before those land
would pin a number the same batch immediately invalidates. One build at the composed batch
tip serves all of it; TOOL-3's note already mints from the build it runs, so it is
self-correcting once it is applied last. FIX-D7 rides here because it is file-disjoint from
all four, has zero base drift, and `src/generators/npcGenerator.js` is a generator-side
change whose bundle effect the same build measures.

**Union of files by area.** `src/` 21: `domain/worldPulse/` ×6 (FIX-W1 1, FIX-K1 5),
`domain/traditions/` ×2, `domain/spatial/` ×1, `domain/townMap/` ×1, `domain/townScene/` ×3,
`lib/` ×4, `lib/townScene/` ×1, `components/admin/` ×1, `generators/` ×3. `tests/` 20:
`tests/domain` ×8, `tests/lib` ×3, `tests/generators` ×2, `tests/security` ×1,
`tests/lint` ×2 (one CREATE), `tests/build` ×1 (one CREATE). `scripts/` 1: the mutation
manifest. No docs, no config.

**Registers moved.** *Lighting* — all five; chair refreezes once at the batch tip
(predicted deltas: FIX-W1 +1 file/+1 credited and its titles, FIX-K1 0 files, FIX-P2 +1 file
via `ledgerKeyNamespace.walker.test.js`, FIX-D7 0 files, TOOL-3 +1 file/+1 credited/+5
titles/+1 suite — take each lane's own measured figure, not these).
*Observed-shape readers baseline* — not edited by any member, but four members write `src/`,
so the chair absorbs it once at the batch tip with `--write` through the migration-bundle
door (the register is content-addressed and history-bound; a plain `--write` goes dark).
*Mutation-coverage* — three members: FIX-P2 adds
`tests/lint/ledgerKeyNamespace.walker.test.js`, FIX-T1 is not in this batch, TOOL-8a is not
in this batch; so **only FIX-P2** here, plus nothing from FIX-W1/FIX-K1/FIX-D7/TOOL-3.
`uncoveredBaseline` unmoved at 186. *Wiring census* — FIX-D7 alone:
`tests/lint/proseWiringCensus.walker.test.js` reads `src/generators/npcGenerator.js`.
*Anchors / prose-numerics* — no member edits the baseline, but FIX-K1's
`src/components/admin/AdminTrendsCharts.jsx` carries a `tests/lint/.prose-numerics-baseline.json`
row, and FIX-K1's worldPulse files are named in `.coupling-inclusion-baseline.json`,
`.tuning-register.json`, `.tuning-inventory.json` and `.domain-any-baseline.json`; all four
are absorb-once-at-the-tip, none is a pairwise ordering. *Size baseline* — untouched; TOOL-8a
(the only lane that considered a row) is not here. *Worker byte ceilings* — TOOL-3 alone,
minted last.

**Owed focused red-firsts, in sequence (criterion 6).** Four of the five still owe a gated
plant, and the composer must run them while applying, tests-first → red → cure → green:
- **FIX-K1** — its BATCH 1 red-first, planted and restored via its saved patch.
- **FIX-P2** — its BATCH 1 pre-cure plant, by `cp`, never the checkout family; a red-first
  that comes back green is a STOP.
- **TOOL-3** — step 4, both plants in one run (each measured constant set to
  `<measured> − 4096 − 1`), expecting `2 failed | 3 passed (5)`, then restore.
- **FIX-D7** — declares no red-first in its note. Flag to the composer: confirm before
  applying whether one is owed or whether the cure is measurement-only.
- **FIX-W1** — already executed and quoted (`4 RED` → `ALL GREEN`); nothing owed.

**Apply method per member.**
- FIX-W1, FIX-K1, FIX-P2, FIX-D7, TOOL-3: **zero own commits** — export
  `git -C <worktree> diff <base>` to a patch and `git apply --3way`. All safe: no binary, no
  generated artifact. ⚠ FIX-K1 and FIX-P4b (Batch 2) are **entirely unstaged**; the diff
  against base still captures everything, but confirm `git status --short` first so nothing
  is missed.
- ⚠ **TOOL-3's staged file is RED by construction** (its two constants are placeholder `0`)
  — apply it, then run the build, then set the constants, then run. Do not let the batch's
  one check see the placeholder state.
- ⚠ **FIX-P2's patch touches `scripts/mutation-coverage-manifest.json` at base line 159**;
  apply it after the other four so the 3-way lands against the final file.

**Attribution key if the one run goes red.**
`tests/build/workerBundleCeilings.test.js` → TOOL-3 (and only TOOL-3).
`tests/lint/ledgerKeyNamespace.walker.test.js`, `tests/domain/mapDressResolver.test.js`,
`tests/security/townScenePlayerSafe.test.js`, `tests/lib/townSceneExport.test.js`,
`tests/domain/townCartography*` → FIX-P2.
`tests/domain/wizardNewsDoubledArticle.contract.test.js`, `tests/generators/densityLaw.test.js`,
`tests/domain/roadsParticipation.test.js`,
`tests/domain/irreversibleRawRoster.contract.test.js` → FIX-W1.
`tests/generators/{tradeCommodity, neighbourRelDynamics}.test.js`,
`tests/lint/serviceCategoryRegistration.walker.test.js`,
`tests/lint/proseWiringCensus.walker.test.js`, `tests/data/stressTypeRegistration.test.js`,
`tests/joins/labelJoins.test.js`, `tests/build/engineChunkLazy.test.js`,
`tests/domain/{arcaneIdentity, corruptionTraitGate, generalStateProseDesk}.test.js` → FIX-D7.
Everything under `tests/domain/{tradition*, espionage*, generosityKernel*, routeNetwork*,
commercialReasons, commodityFlow}`, `tests/lib/{pulseFingerprint, flags,
constructionUsage}.test.js`, `tests/ui/{admintrends.smoke, founderTileRestore}`,
`tests/pdf/traditionsSection`, `tests/store/{npcVerbs, campaignWorldPulseLazyOwnerFence}`,
`tests/property/{traditionsDormancyGolden, espionage*Fence}` → FIX-K1.
⚠ `tests/lint/entropyRootCensus.walker.test.js` and `tests/lint/ruinFilterRoster.walker.test.js`
are read by BOTH FIX-K1 and FIX-P2 — a red there is ambiguous and needs the walker's own
named site to separate.

### H.4 BATCH 2 — "the lint instruments" (5 members)

**Members, in application order:** TOOL-9 → TOOL-8a → FIX-T1 → TOOL-15 → FIX-P4b.

**Why together.** All five are instrument lanes whose proof surface is `tests/lint` (plus
`tests/scripts` for TOOL-15), so one `npm run check` at the batch tip runs that directory
once instead of five times — this batch is where the owner's directive saves the most
wall-clock (5 × `tests/lint` whole at 4–8 min each collapses to one). Pairwise file-disjoint
except the mutation manifest, whose four insertions here sit at base lines 64 (TOOL-8a),
1024 (FIX-T1), 300 (TOOL-15) and 940 (FIX-P4b) — read, and far apart. TOOL-9 is applied
FIRST because it is the lighting walker itself: landing its print mode first gives the other
four a way to read the live census without touching the register.

**Union of files by area.** `tests/lint` 8 (5 CREATEs: `darkGuardCensus.walker.test.js`,
`darkGuardRegistry.js`, `ruinShapeReplica.walker.test.js`,
`packetSymbolFigureCensus.walker.test.js`, plus modifications to
`sovereigntyLightingContract.walker.test.js` and `embeddedMapConsoleGate.walker.test.js`).
`tests/domain` 8, `tests/generators` 1. `scripts/` 2 (the mutation manifest,
`docs/implementation/PACKET_MANIFEST.json`). `src/` 3 (`components/GenerateWizard.jsx`,
`components/generate/PipelineReveal.jsx`, `store/settlementGenerateAction.js`).
`public/map/` 4. `docs/` 2.

**Registers moved.** *Lighting* — all five; one refreeze at the batch tip, and it owes a
five-way per-member attribution in its body (TOOL-9 +3 titles only; TOOL-8a +1 file/+3
suites/+11 titles predicted; FIX-T1 +1 file/+1 credited/+7 titles/+1 suite; TOOL-15 +1 file;
FIX-P4b 0 files). *Mutation-coverage* — **four of the five**: TOOL-8a adds
`darkGuardCensus.walker.test.js`, FIX-T1 adds `ruinShapeReplica.walker.test.js`, TOOL-15
adds `packetSymbolFigureCensus.walker.test.js`, FIX-P4b rewrites the
`embeddedMapConsoleGate` row in place. All four are `kind:"rationale"`; none moves
`uncoveredBaseline` off 186; no two claim a sweep label. *`PACKET_MANIFEST.json`* — TOOL-15
alone (its hunk at base 32163–32164; the integration's at 32775+). *Observed-shape* — FIX-P4b
writes `src/`, so absorb once at the batch tip. *Anchors* — every member's CREATE opts into
`tests/lint/negativeAssertionAnchor.walker.test.js`, which the one check runs. *Prose-numerics,
size baseline, wiring census, prose-root totals* — **none moved by this batch.**

**Owed focused red-firsts, in sequence.**
- **TOOL-9** — BATCH 2, three mutants in its own new code (blind digest / dropped figure /
  shared delta), each planted by exact string edit and restored to sha
  `1584761de144290ead2b12d1e9d9af97c0a46482bd7136c68c9fab073c99601d`. ⚠ Its register-sha
  guard `3fb7a7e8c4…` is stale; the live file is `487fc36386…`.
- **FIX-T1** — BATCH 4 under the real runner: withdraw its own
  `tests/domain/ruinFilter.probe.test.js` edit, confirm the grep hits line 27, run the
  walker, expect `1 failed | 6 passed`, restore from scratch. ⚠ Its CREATE
  `tests/lint/ruinShapeReplica.walker.test.js` is **parked outside the tree** at
  `$SP/lane-fix-t1-scratch/staged/tests/lint/` — the composer must `cp` it in, not patch it,
  and must take the BASE lighting reading before doing so.
- **FIX-P4b** — BATCH B, commit 2's red-first counterforce.
- **TOOL-8a** and **TOOL-15** — already executed ungated and quoted (four mutants in a
  plain-node harness; seven mutants under a substituted harness with the walker re-hashed
  identical). Nothing owed at the gate.

**Apply method per member.**
- TOOL-9, TOOL-8a, FIX-T1, FIX-P4b: **zero own commits** → `git diff <base>` +
  `git apply --3way`. FIX-P4b is entirely unstaged; FIX-T1 needs the extra `cp`.
- TOOL-15: **one commit `1c33181d6`** → `git cherry-pick`. `merge-tree --write-tree` against
  the tip prints no conflict (`03-mergetree.txt`), so the cherry-pick is forecast clean.
  ⚠ `docs/implementation/PACKET_MANIFEST.json` is a 33k-line generated manifest — the
  cherry-pick is safe because the hunks are 600+ lines apart, but never hand-patch it.

**Attribution key if the one run goes red.**
`tests/lint/sovereigntyLightingContract.walker.test.js` → TOOL-9 (it is the only member that
edits the walker; a census figure red is the batch's expected refreeze signal, not a member
failure).
`tests/lint/darkGuardCensus.walker.test.js` → TOOL-8a.
`tests/lint/ruinShapeReplica.walker.test.js` + `tests/domain/{brokerageFidelity,
defenseStateProseDesk, institutionStatus*, magicForms, magicSubstitution, ruinFilter.probe,
ruinInstitution}.test.js` + `tests/generators/customSupplyChainActivation.test.js` → FIX-T1.
`tests/lint/packetSymbolFigureCensus.walker.test.js`, `tests/lint/sourceCitationIntegrity.*`,
`tests/scripts/{implementationGate, implementationPackets, implementationSession}.test.js`
→ TOOL-15.
`tests/lint/embeddedMapConsoleGate.walker.test.js`,
`tests/security/{cspForkIsolation, mapForkXssChain}.test.js`, `tests/lib/sfBridgeOrigin`,
`tests/map/sfBridge.harness`, `tests/components/{createWorkflowRail, generateWizardFocus,
dossierRegenerateRefusal, refusalSaysItOnce, navFlowArrows, pinnedFooter}`,
`tests/ui/{generateWizard.smoke, wizard.smoke, wizardBackOrigin}`,
`tests/store/{anonRandomForgeIsNeverDiscarded, generateStrayConfigSeed, toggleSlice.scope,
updateConfigPatchValidation}`, `tests/build/generationWorkerLazy` → FIX-P4b.
`tests/lint/mutationCoverageManifest.test.js` → ambiguous across TOOL-8a / FIX-T1 / TOOL-15 /
FIX-P4b; the failure message names the offending key, which separates them.

### H.5 BATCH 3 — "the clean surfaces" (3 members)

**Members, in application order:** FIX-C2d → FIX-P10 → FIX-D8.

**Why together.** The three cleanest-drift lanes left. FIX-C2d is 1 commit behind with zero
overlap and `merge-tree` clean; FIX-P10 is 14 behind with zero overlap and already carries
the live golden pins; FIX-D8 is 64 behind with zero overlap. Pairwise **completely
file-disjoint** — they share not one path. FIX-C2d is applied first because it lands the
`sourceCitationIntegrity` walker changes, and every later member's `tests/lint` whole then
runs the cured walker rather than the one the chair's D9 proof saw an unattributed red on.

**Union of files by area.** `docs/` 41 (all FIX-C2d). `tests/lint` 2 (FIX-C2d's walker pair)
+ 1 (FIX-D8's `economyReadModelCoverage.walker.test.js`). `tests/components` 3 + `tests/ui`
1 (FIX-P10). `tests/domain` 1 (FIX-D8). `src/` 6: `App.jsx`, `components/HomeHero.jsx`,
`components/generate/{ClerkNote, WizardOutputToolbar}.jsx`, `components/nav/{ArrowHeader.jsx,
arrowGeometry.js}` (FIX-P10) + `data/{economyFreshnessSentences.js CREATE, roadsProse.js}`,
`domain/display/economyFreshness.js` (FIX-D8). `scripts/` 1
(`generate-dossier-state-prose.mjs`). Config 1: **`eslint.config.js`** (FIX-D8).

**Registers moved.** *Lighting* — all three (FIX-C2d already quotes the live
`2665 / 25529 / 6815`; FIX-P10 creates no test file; FIX-D8 predicts
`2653·383·2270·25055·6680` against a stale base). One refreeze at the batch tip.
*Observed-shape* — FIX-P10 and FIX-D8 write `src/`; absorb once. *Mutation-coverage,
prose-numerics, prose-root totals, size baseline, `PACKET_MANIFEST`, wiring census* — **none
moved by this batch.** That makes it the cleanest batch to run first if the chair wants a
low-risk proof that the batch-gate method works before committing to Batches 1 and 2.
⚠ *`eslint.config.js`* is not a register but behaves like one: it is read by 21 test files
across nine directories, so a red anywhere unexpected in this batch should be suspected of
FIX-D8 first.

**Owed focused red-firsts, in sequence.**
- **FIX-D8** — its BATCH 1 red-first, and its note is explicit that it **must run BEFORE the
  regeneration**. ⚠ Confirm before applying whether
  `scripts/generate-dossier-state-prose.mjs` regenerates a TRACKED artifact in this lane:
  its eslint list names `src/data/dossierStateProse/economy.generated.js` but that path is
  **not in its change set**, so either the regeneration was withdrawn or an artifact is
  missing. If it does regenerate a tracked artifact, FIX-D8 becomes a second
  regeneration-door lane and criterion (3) moves it out of any batch containing FIX-P9 —
  which it already is.
- **FIX-P10** — commit 1's red-first (plant `ClerkNote:52` back to a bare `FS.sm`) and
  commit 2's three plants (`/create` bare 96, `/settlements` files 209, `/signin` files 14).
- **FIX-C2d** — both counterforces already executed and quoted; nothing owed.

**Apply method per member.**
- FIX-C2d: **four commits** `611b74ea9 → 2ab24115b → f6dd4446e → 52bf58490`, in that order →
  `git cherry-pick`. `merge-tree --write-tree` prints no conflict. It is 1 behind and the one
  intervening commit touched only `tests/lint/.lighting-census-baseline.json`, so this is the
  safest apply in the whole queue.
- FIX-P10: **zero own commits** → `git diff <base>` + `git apply --3way`. ⚠ It has an `MM`
  row (`tests/components/phoneChromeFloor.census.test.js` is staged AND modified again), so
  a worktree-vs-base diff captures the LATER state; reconcile with the lane before exporting,
  or the batch silently takes the unreviewed version.
- FIX-D8: **zero own commits** → same method. Its CREATE `src/data/economyFreshnessSentences.js`
  patches cleanly (no binary, no generated content).

**Attribution key if the one run goes red.**
`tests/lint/sourceCitationIntegrity.walker.test.js`, `tests/docs/**` → FIX-C2d (it is the
only member touching `docs/`, 41 files of it).
`tests/components/{dossierPhoneFloorAllViews, phoneChromeFloor.census,
publicChromeFloor.census}`, `tests/ui/wizardOutputToolbar`, `tests/components/{arrowHeader,
navFlowArrows, pinnedFooter, appShellResilience}`, `tests/design/**` → FIX-P10.
`tests/domain/dataPurity.test.js`, `tests/lint/economyReadModelCoverage.walker.test.js`,
`tests/domain/economyFreshness.test.js`, `tests/components/economyFreshnessNote.test.jsx`,
`tests/store/tableEventCommit.test.js`, `tests/data/dossierStateProseProjection.contract.test.js`,
`tests/helpers/dossierCorpus.js`, `tests/copy/roadsProse`-reading files → FIX-D8.
⚠ `tests/docs/{enforcedByExists, enforcement-claims}.test.js`, `tests/kernel/prngSeedEntropy`,
`tests/generators/economicStructure`, `tests/pdf/pdfFieldManifest.walker`,
`tests/lint/{goldenFreeze.walker, sizeBaseline, determinismBanCoverage, localeCompareGuard,
localeFormatGuard, pdfEntropyGuard, proseCorpusBytes, transcendentalMathBaseline,
deepCloneHotPath, worldGenerationClockSeam.walker}` all read `eslint.config.js` → **FIX-D8**,
even though several of them sit in directories FIX-C2d also touches. That is this batch's
one ambiguity and it resolves the same way every time: `eslint.config.js` means FIX-D8.

### H.6 What the split costs and what it buys

Three batches = three `npm run check` runs plus three refreezes, against thirteen separate
lane windows of 10–35 min each under the old scheme. Batch 1 is the one criterion (4)
compels (one build serving TOOL-3's two ceilings after the four lanes that move their module
graphs). Batch 2 is where the directory-whole saving is largest (five `tests/lint` whole runs
collapse to one). Batch 3 is the lowest-risk and the natural pilot. Seven lanes stay SOLO:
three for real conflicts (TOOL-A, TOOL-7a, TOOL-22), two for whole-tree measurements that
must be taken at a final tip (FIX-F, TOOL-24), two for golden and fixture doors (FIX-G,
FIX-P9). TOOL-24 is the one I would revisit first if the chair wants six batches instead of
seven solos — as Batch 1's terminal member it costs nothing extra and its measurement lands
exactly where it should.

**Labelling for this section.** CONFIRMED: FIX-W1's identity, drift, staged rows, red-first
logs and the `rows whose hash MOVED: 0` golden proof; the absence of worktrees for FIX-G4,
TOOL-20, FIX-D10, TOOL-16, TOOL-17, FIX-B3, FIX-D6; zero binary files across all twenty
change sets; the four generated/measured artifacts and which lane owns each; the single
shared file among the thirteen batchable lanes and the five manifest hunk offsets; the
worker-graph imports (`advanceInterval.worker.js:23`, `pulseKernel.js:74` and `:103`,
`townSceneExport.worker.js:10-15`); which lanes still owe a gated red-first and which have
executed one. PLAUSIBLE: the three-way split itself and its ordering rationale (the criteria
permit one batch of thirteen — the split is my judgement, and it is vetoable); the claim that
FIX-D7 owes no red-first (its note simply does not mention one, which is not the same as it
not being owed); every attribution key entry that rests on a test naming a file rather than
on an executed run.
