# laneTENOTICES — receipt

**Outcome:** the THIRD-PARTY-NOTICES surface chartered at ODQ §295.5c / §317.1 is
built, proved and dark in a detached worktree. Three files land, all additions,
plus one census re-record in an existing walker. No production line changes.

**Worktree:** `scratchpad/tenotices-tree`, detached at base `2cdb87fa`
(`claude/composite-r4` at dispatch, and still the tip at the time of the terminal
run — re-checked, no cherry-pick needed).
**Base-proof worktree:** `scratchpad/tenotices-baseproof`, detached at the same
sha, used to earn the "pre-existing" label on the sweep reds.

---

## 1. What landed

| Path | Status | What it is |
|---|---|---|
| `THIRD-PARTY-NOTICES.md` | NEW (repo root) | the authoritative inventory: the vendored map fork and its 20 libraries plus the TinyMCE subtree, the fonts, and the 107-package production dependency tree — component, version, licence, copyright holder, and the notice text or a pointer to the file we serve |
| `public/third-party-notices.html` | NEW | the served page at `/third-party-notices.html`, same content, dependency-free static HTML in the `public/status.html` idiom, `noindex`, **no nav or footer link lit** |
| `tests/build/thirdPartyNoticesPage.test.js` | NEW | 21 pins holding the two copies in agreement and the load-bearing entries named |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | EDIT (census only) | the estate file/title census re-recorded for the one new test file |

**Location precedent checked.** No `LICENSE`, `NOTICE`, `THIRD_PARTY*`,
`ATTRIB*`, `CREDITS*` or `COPYING` file exists anywhere in the tree at
`2cdb87fa` (`git ls-tree -r` over the whole ref), so the root is not displacing
an established home. `public/status.html` is the precedent for a hand-maintained
static legal/ops page served outside the bundle, and the new page follows it
structurally and visually.

**Serving path confirmed from config, not guessed.** `vercel.json`'s SPA rewrite
is `/((?!.*\.).*)` → `/index.html`: a path *containing a dot* is not rewritten,
so `/third-party-notices.html` is served as the static file, exactly as
`/status.html` is. The app CSP block (`/((?!map/).*)`) allows `style-src 'self'
'unsafe-inline'`, which is what the page's single inline `<style>` needs; the
page carries no script at all. `scripts/generate-sitemap.mjs` derives the sitemap
from `src/lib/routes.js`, not from a `public/` glob, so the new file cannot leak
into `sitemap.xml`.

---

## 2. The two dual-licence elections (the §295 cure)

Recorded explicitly, in both copies, in their own section (§1.3 / section 1.3):

| Component | Offered under | Election |
|---|---|---|
| JSZip 3.6.0 (`jszip.min.js`) | the MIT licence **or** GPL-3.0 | **MIT** |
| jQuery UI Touch Punch 0.2.3 (`jquery.ui.touch-punch.min.js`) | the MIT licence **or** GPL-2.0 | **MIT** |

Both offers were re-read from the file headers in **our own copy** at the base
sha, not inherited from the IPV-1 memo. The election table is pinned in both
files by the test, and flipping either election to the copyleft option reds it
(negative control M6 below).

## 3. TinyMCE — reported, not resolved

§1.4 of the document and section 1.4 of the page state the facts and say so
explicitly: *"This section states what is served. It settles nothing."* The
section records GPL-2.0-or-later, Ephox Corporation DBA Tiny Technologies as the
holder, the licence file we serve reproduced in full, the local-copy loader, the
`license_key: "gpl"` init, and that we ship minified bytes with no corresponding
source and no written offer. It routes the disposition to §254.5.5 / §295 and
answers nothing. That sentence is pinned in both copies; deleting it reds the
test (M5).

## 4. Urquhart provenance (§253.2)

Recorded as a third-party-within-third-party note in §1.1 / section 1.1: the
routine survives in the fork's built bundle as `calculateUrquhartEdges`,
minification has stripped the upstream provenance comment, a permissive
top-level grant does not reach code the project itself copied in, and we have
adopted none of it. Pinned in both copies.

---

## 5. Verification

### 5.1 Every licence re-verified at base, none inherited

Read out of the artefact in the tree at `2cdb87fa`, not from the memo:

- **The 20 vendored `public/map/libs/` files** — first-1500-byte headers read
  file by file, plus a whole-file licence-word scan for the nine that carry no
  header (all nine confirmed to carry no licence word anywhere in the file, not
  merely in the header; the one apparent hit on `jquery-ui.min.js` was the
  substring "mit" inside "submit", and it is genuinely header-less).
- **Versions** taken from the artefacts themselves where the vendor manifest
  says "unknown" — `jquery-ui` 1.12.1 from its own `version:"1.12.1"` string,
  `touch-punch` 0.2.3 from its header. Rows the artefact does not declare are
  written "not declared" rather than guessed.
- **The fonts** — Lora and Nunito copyright strings extracted from each TTF's
  own `name` table (IDs 0 and 14). Nunito names `https://scripts.sil.org/OFL` in
  the font; Lora carries the "Reserved Font Name" wording with no licence URL
  field.
- **The 107 production packages** — derived from `package-lock.json` (every
  entry not `dev: true`), with licence identifier and copyright line read from
  each installed package's own files. No network.
- **TinyMCE** — 123 files on disk; `git log -- public/map/libs/tinymce` shows
  **exactly one commit ever** (`f386f48d`, 2026-04-24), and the on-disk
  `tinymce.min.js` sha256 matches the manifest pin.
- **The loader facts** — `notes-editor.js:74/89` local `libs/tinymce` URL and
  `license_key: "gpl"` read at base; `main.js` unconditional `return;` above the
  openwidget import read at base; `openwidget.min.js` is 829 bytes and its
  `organizationId` appears nowhere else in the repository.

⭐ **One inherited claim was caught and cut.** The first draft said the TinyMCE
subtree is "byte-identical to the upstream distribution" — a memo figure derived
from a scratch clone that §293.4 has since ordered deleted, so it is not
re-verifiable in this lane. It was replaced with the claim the tree does support:
one commit ever, never modified by us, SHA-256-pinned and gate-compared.

### 5.2 CLAIM_RE pre-scan

The exact regex from `tests/docs/enforcement-claims.test.js` was run against
every prose file written or edited, before and after the final edits:

```
CLAIM_RE hits in THIRD-PARTY-NOTICES.md : 0
CLAIM_RE hits in tests/build/thirdPartyNoticesPage.test.js : 0
CLAIM_RE hits in tests/lint/sovereigntyLightingContract.walker.test.js : 0
```

### 5.3 Negative controls — 12 mutations, every one red

The pin is not vacuous. Each mutation was applied, the focused test run, and the
file restored:

| # | Mutation | Result |
|---|---|---|
| M0 | baseline | **EXIT=0**, 21 passed |
| M1 | drop the JSZip election row from the page | EXIT=1, 2 failed |
| M2 | drop the `zustand` **row** from the page's inventory table | EXIT=1, 2 failed |
| M2b | drop the `zustand` row from the Markdown | EXIT=1, 3 failed |
| M2c | drift `three`'s version on the page only | EXIT=1, 1 failed |
| M2d | state a wrong inventory size in the caption | EXIT=1, 1 failed |
| M3 | add an external `<script src>` to the page | EXIT=1, 1 failed |
| M4 | light a link to the page in `src/lib/routes.js` | EXIT=1, 1 failed |
| M5 | delete the "It settles nothing" sentence | EXIT=1, 1 failed |
| M6 | flip the JSZip election from MIT to GPL-3.0 | EXIT=1, 1 failed |
| M7 | replace the TinyMCE copyright holder | EXIT=1, 1 failed |
| M8 | add an outbound href to the page | EXIT=1, 1 failed |
| M9 | restore | **EXIT=0**, 21 passed |

⚠ **M2 SURVIVED THE FIRST VERSION OF THE PIN, and that is why the pin changed
shape.** The original check asked whether the whole page *contained* each package
name — and the page's own prose lists the direct dependencies, so deleting
`zustand`'s table row left the page still "containing" `zustand` and the drift
would have shipped. Both extractors are now scoped to the section 3.2 inventory
table and compare **ordered `name@version` lists**, so a dropped row, an added
row, a re-ordered row or a one-sided version bump all red. The vacuity was found
by running the mutation, not by reading the code.

### 5.4 The census re-record

A new test file moves `tests/lint/sovereigntyLightingContract.walker.test.js`'s
estate census, which is an exact `.toBe`:

```
AssertionError: the estate's file count moved — re-measure, do not re-word:
expected 2486 to be 2485
```

Re-recorded per the file's own precedent (ten prior waves do the same), with the
cause stated and the authorizing decision named, as §299.4's binding-forward rule
requires: **ODQ §317.1**, which dispatches this lane and names "a pin so the
surface cannot rot" as a deliverable.

```
2,485/364/2,121/20,611/5,768  →  2,486/364/2,122/20,632/5,773
+1 file, +1 credited, +21 titles, +5 suite titles, parked unchanged at 364
```

⭐ **The first draft of the test file PARKED itself and was rewritten rather than
re-recorded.** Its five critical-entry rows were generated from a table with a
template title — the exact loop-registration shape that SP-D and the GR-2 repair
round both recorded as parking a whole file out of the credited count. They are
now spelled out one `it()` per entry with the loop moved inside each named test,
so the file is credited and all 21 titles are visible. Deltas above are the
credited shape.

Walker run in isolation after the re-record:

```
tests/lint/sovereigntyLightingContract.walker.test.js
Test Files  1 passed (1)
     Tests  33 passed (33)
SOVEREIGNTY TRUE_EXIT=0
```

⚠ **A second census was hunted and does not exist.** `grep` for the outgoing
figures (2485 / 2121 / 20611 / 5768) across `tests/`, `scripts/` and `docs/`
returns only this walker and the LANDED `MF-T2A` packet body (a record, not a
gate). The test-ratchet baseline's `totalTests` is a **floor** (`SCOPE_FLOOR_RATIO
= 0.9`), not a ceiling, so added tests cannot red it. The new file carries **zero**
bare `not.toContain|not.toMatch|not.toHaveProperty`, so the per-file-exact anchor
walker takes no new row, and `tests/build/**` is outside
`contractTestAntiVacuity`'s scope.

### 5.5 Sweep reds — earned as pre-existing, and one that was mine

`npx vitest run tests/lint tests/docs` in the lane tree: 13 failed / 1809 passed.
The same command in `tenotices-baseproof` at the same base sha: **15 failed /
1807 passed** — a *superset* on eleven of them and a different set on two, which
is what heavy concurrent-lane contention looks like (the failing durations
include 120,640 ms, 43,978 ms and 39,695 ms). Run in isolation, the walkers pass.

Of the two that appeared in the lane run but not the base run:

- `tests/lint/exportTokenCoverage.test.js` — 120,640 ms, a timeout under
  contention; passes in the terminal gate run.
- `tests/lint/sovereigntyLightingContract.walker.test.js` "THE CENSUS IS AN
  ASSERTION" — **8 ms, and genuinely mine.** Diagnosed, cured by the re-record in
  §5.4, and re-proved green in isolation. This is the red the timing noise could
  easily have hidden; it was caught because the fast failure was read rather than
  the exit status.

### 5.6 The full gate, bare, per step

Every step run bare in its own shell with the exit status captured **in-shell**,
to self-named logs under `scratchpad/laneTENOTICES-gate-*.log`.

**Steps 1-14 — all `TRUE_EXIT=0`:**

```
validate:hazard-registry TRUE_EXIT=0      validate:tuning-bands     TRUE_EXIT=0
validate:premortem       TRUE_EXIT=0      validate:foundry-module   TRUE_EXIT=0
validate:packets         TRUE_EXIT=0      validate:mcp-server       TRUE_EXIT=0
validate:data            TRUE_EXIT=0      typecheck:ratchet         TRUE_EXIT=0
validate:custom-content-manifest TRUE_EXIT=0   typecheck:domain:strict TRUE_EXIT=0
validate:migration-head  TRUE_EXIT=0      lint                      TRUE_EXIT=0
validate:edge            TRUE_EXIT=0        └ ✖ 29 problems (0 errors, 29 warnings) — pre-existing warnings, exit 0
validate:map             TRUE_EXIT=0
```

**Steps 15-17 + smoke:boot — all `TRUE_EXIT=0`:**

```
test:ratchet TRUE_EXIT=0
  [test-ratchet] OK — no test regressions (11 known failure(s) of 28651 tests, ceiling 11).
build        TRUE_EXIT=0
verify:dist  TRUE_EXIT=0
  [test-ratchet] STRICT DIST OK — 52 discovered/reported file(s), 430 test(s),
                 zero failed/non-run/uncollected/missing/extra/duplicate rows.
smoke:boot   TRUE_EXIT=0
  boot-smoke: 524 chunks · entry index-DAqnpcz7.js
  boot-smoke: stage 2: 524/524 chunks initialised
  boot-smoke: stage 3: shell mounted, 31706 B of markup under #root
  boot-smoke: PASS — the built bundle boots.
```

⭐ **THE PAGE PROVABLY SHIPS.** After `build`, `dist/third-party-notices.html`
exists at **41,404 bytes** — byte-for-byte the source file — alongside
`dist/status.html`. Vite copies `public/` wholesale, and this is the executed
proof rather than the inference. `verify:dist`'s 52 discovered build-test files
include the new pin, and its 430 tests include the pin's 21.

### 5.7 The terminal binds to the FINAL snapshot, and that took a second run

⚠ **The first `test:ratchet` (14:27-14:46) is bound to a STALE snapshot.** Two
prose edits and one test-header edit landed during its run, so its green cannot
be claimed for the tree the chair will CAS. `build`, `verify:dist` and
`smoke:boot` all ran after the last edit and are already final-snapshot green.

Before re-running, the denominator of in-scope readers was ENUMERATED rather than
assumed — every non-`tests/build/**` suite that walks the repo root's `*.md` or
the `tests` tree, ten in all — and each was proved against the final tree:

```
tests/lint/sovereigntyLightingContract.walker.test.js   33 passed   (green)
tests/docs/enforcement-claims.test.js                    1 failed   (BANKED, list byte-identical
                                                                     to base; ZERO hits name my files)
tests/lint/contractTestAntiVacuity.walker.test.js  ┐
tests/lint/engineGatedRuleKeys.walker.test.js      │
tests/domain/believedRazingCasusWr8.test.js        │
tests/domain/roadsEmbassy.test.js                  ├─ 8 files, 124 tests, ALL PASSED
tests/domain/sovereigntyIntentWr10.test.js         │   READERS2 TRUE_EXIT=0
tests/property/espionageDormancyFence.test.js      │
tests/property/mechanismLitCoverage.test.js        │
tests/property/roadsCharter.test.js                ┘
```

**The terminal `test:ratchet`, bound to the final tree — and it took three
attempts, two of which are instructive:**

```
attempt A  test:ratchet TRUE_EXIT=3
           gate-mutex: GAVE UP after 40 poll(s) — atomic lock remains held.
           gate-mutex: HELD by atomic lock PID 17083
           → NOT A RED. Exit 3 is the mutex giving up; the suite never ran.

attempt B  test:ratchet TRUE_EXIT=1
           [test-ratchet] TEST REGRESSIONS (fix them; do not widen the census):
             1 failing test(s) NOT in the frozen census:
               tests/components/simulationRulesDialog.test.jsx ::
               SimulationRulesDialog previews and saves a selected preset without mutating first
           → CONTENTION FLAKE, proved three ways rather than assumed (below).

attempt C  test:ratchet TRUE_EXIT=0
           [test-ratchet] OK — no test regressions (11 known failure(s) of 28651 tests, ceiling 11).
```

⚠⚠ **ATTEMPT B WAS A RED OUTSIDE MY FILES, SO IT WAS RUN DOWN, NOT WAVED OFF.**
Three independent probes, each executed:

1. **In isolation in the lane tree** — `tests/components/simulationRulesDialog.test.jsx`
   passes 6/6, `TRUE_EXIT=0`.
2. **In isolation at the untouched base** (`tenotices-baseproof` at `2cdb87fa`) —
   passes 6/6, `TRUE_EXIT=0`. The test is sound on both sides of my change.
3. **No coupling exists.** `grep -rl "third-party-notices\|THIRD-PARTY-NOTICES"
   src tests/components` returns NOTHING: there is no import, reference or path
   by which three added files and one census constant could reach a React
   component test.

The same suite had also passed in the 14:27 run on a nearly identical tree. Four
lanes plus a soak were competing for CPU at the time; the run's other failures
carried durations of 120,640 ms, 43,978 ms and 39,695 ms. **CONFIRMED: flake
under contention, not a regression.** Attempt C is the receipt that stands.

---

## 6. Judgment calls (each vetoable)

1. **JUDGMENT: the document lives at the repository root as
   `THIRD-PARTY-NOTICES.md`, not under `docs/`.** Chosen over `docs/` because no
   notices/licence file exists anywhere in the tree to set a precedent, root is
   where a recipient and a licence scanner look, and §317.1 names the file by
   that spelling. Say "veto" and it moves to `docs/`.
2. **JUDGMENT: `dompurify` and `rgbcolor` are RECORDED AS UNELECTED rather than
   elected.** Both are dual-licensed and neither was on the §295 docket (see §7).
   Electing on them is a licence-posture act that §254.5.5 reserves, and the
   chair's charter named exactly two elections as already decided. They are listed
   in their own section (§3.3) so the question is visible rather than silently
   resolved. Say "veto" and I will record MIT for `rgbcolor` and Apache-2.0 for
   `dompurify`.
3. **JUDGMENT: the page carries exactly one href — the support mailto — and
   renders copyright URLs as plain text.** Chosen over linking them because a
   compliance page that becomes a set of outbound jumps is harder to pin and
   easier to rot; the single-href rule is testable and is pinned (M8).
4. **JUDGMENT: the inventory pin compares ordered `name@version` lists across the
   two copies rather than only the four charter-critical entries.** The charter
   asked for the four; this covers all 107 rows at no extra cost and is what
   caught the M2 vacuity. The four are pinned by name as well.
5. **JUDGMENT: hand-authored HTML rather than a generated page.** `status.html`
   is the estate's idiom for a hand-maintained static legal/ops page; a generator
   would add a regeneration script, a freshness test and a generated-artifact
   contract for a page that changes a few times a year. The drift risk a
   generator would remove is instead removed by the agreement pin.

---

## 7. RAISED

### 7.1 A packet was NOT required — checked, not assumed

`PACKET_STANDARD.md`'s Purpose scopes a packet to "the only document that may
tell a coding agent to implement a **not-yet-built subsystem slice**". This lane
is chair-dispatched directly by ODQ §317.1, not through the dispatch surface.
Two checks confirm no packet obligation and no path reservation:

- `PACKET_MANIFEST.json` holds **131 packets, of which 130 are LANDED and 1
  SUPERSEDED — zero non-terminal**. Since a change path is reserved at every
  non-terminal status, nothing reserves `THIRD-PARTY-NOTICES.md`, `public/**` or
  `tests/build/**`.
- Recent history shows non-packet lane commits touching exactly these trees
  (`d8d7eeba` TE34 in `tests/build/`, `ce089e2b` GV-3, `d6c5af8e` in `public/`).

`npm run validate:packets` is untouched and green. **No packet was compiled.** If
the chair reads the estate differently, this is the item to correct.

### 7.2 TWO DUAL-LICENCE ELECTIONS THE §295 DOCKET DOES NOT HAVE

§295.5c names two unrecorded elections (jszip, touch-punch). The npm production
tree carries **two more**, both new to the docket:

- **`dompurify` 3.4.12 — MPL-2.0 *or* Apache-2.0.** A **direct** dependency, and
  the one used for sanitisation, so it certainly ships. The package distributes
  both `LICENSE` (Apache-2.0) and `LICENSE-MPL`. No election is recorded anywhere.
- **`rgbcolor` 1.0.1 — the MIT licence *or* the alternative in the package's own
  `FEEL-FREE.md`.** Reaches the tree as an optional transitive of `jspdf` via
  `canvg`.

Recording an election on each costs nothing and closes them, exactly as §295.5c's
reasoning about jszip and touch-punch did. Left unelected here on the reasoning in
judgment call 2.

### 7.3 TWO FONT FAMILIES SHIP WITH NO LICENCE FILE

Not on any docket found. `public/fonts/` serves eight Lora and Nunito faces (TTF
and WOFF2, 16 tracked files) that are SIL Open Font Licence families — the OFL
requires the copyright notice, licence and disclaimer to travel with the font, and
**no licence file sits beside them**. The copyright strings are inside the font
binaries (verified from the `name` tables), and Nunito's faces name the OFL URL;
Lora's carry the "Reserved Font Name" wording with no licence URL field. The
notices surface records this as the interim measure. **Shipping
`public/fonts/OFL.txt` is a small, self-contained follow-up** and is the obvious
next cure.

### 7.4 `png-js` DECLARES NO LICENCE IN ITS MANIFEST

`png-js@2.0.0` has no `license` field in `package.json` but ships a `LICENSE`
file carrying the MIT text and "Copyright (c) 2017 Devon Govett". Treated as MIT
on the strength of the distributed file, and the discrepancy is stated in the
document rather than smoothed over. A licence scanner run against manifests alone
would report this package as unlicensed.

### 7.5 A LOCKFILE ODDITY, NOTED IN PASSING

`npm ls --omit=dev` in a clean `npm ci` tree at `2cdb87fa` reports
`invalid: react@19.2.5` plus two extraneous `@img`/`@emnapi` entries. It does not
affect this lane (the inventory is derived from the lockfile, not from `npm ls`),
and it is pre-existing at the base sha, but a peer-range conflict on React is
worth someone's eye.

### 7.6 THE LINK IS NOT LIT — DELIBERATELY

Nothing in `src/` references the page, and the test pins that absence (M4 reds
when a reference is added). Lighting a footer or About link is the owner-visible
act the charter separated out. When the owner wants it lit, the change is one
link plus deleting the "ships dark" describe block in the pin.

---

## 8. Not done / not checked, stated affirmatively

- **The page was not rendered in a browser.** The preview pane will not open a
  file outside the project folder. Structure was verified instead: valid doctype,
  title and `noindex` meta; 8 tables with balanced `<table>`/`<tbody>`; 152 rows;
  zero `<script>`, `<link>`, `<img>` or remote `url()`; exactly one href.
- **Byte-identity of the TinyMCE subtree against upstream was not re-verified**
  (the comparison clone is deleted per §293.4 and this lane has no network). The
  document claims only what the tree proves — see §5.1.
- **The document does not enumerate the Deno edge functions' remote imports.**
  They run server-side and convey nothing to a browser; the boundary is stated
  explicitly in the document's scope section rather than left implicit.
- **The document does not resolve any §295 question**, by design.
- **Nothing was staged, committed, or pushed.** The worktree is left in place at
  `scratchpad/tenotices-tree` with the three new files untracked and the one
  census edit unstaged, for the chair's CAS. `scratchpad/tenotices-baseproof` is
  also left in place; it is a throwaway and can be removed with
  `git worktree remove`.

---

## 9. THE TIP, LOUD

```
LANE WORKTREE:  scratchpad/tenotices-tree
HEAD (detached): 2cdb87fac566b3d6803a0dce9d59df13f07c1c9e
claude/composite-r4 AT COLLECTION: 2cdb87fac566b3d6803a0dce9d59df13f07c1c9e
```

⭐ **THE BRANCH TIP NEVER MOVED during this lane** — re-checked at dispatch, before
the terminal, and after it. **No cherry-pick was needed; the work applies directly
to `2cdb87fa`.** Both sibling executors (TE-T2B, TE-WF1C) were still in flight at
collection, so the CAS order the chair set (T2B → WF1C → NOTICES) is intact and
this lane is still third.

**NOTHING IS STAGED OR COMMITTED.** The chair CASes from the worktree as it
stands:

```
 M tests/lint/sovereigntyLightingContract.walker.test.js   (census re-record, +20/-1)
?? THIRD-PARTY-NOTICES.md
?? public/third-party-notices.html
?? tests/build/thirdPartyNoticesPage.test.js
```

⚠ If a sibling lands before the CAS and its commit ALSO moves the
sovereignty census, the two re-records collide on one integer. Mine is
`2,486/364/2,122/20,632/5,773` from a base of `2,485/364/2,121/20,611/5,768`;
the delta to carry forward is **+1 file, +1 credited, +21 titles, +5 suite
titles, parked unchanged**. Re-measure rather than re-word, per the walker's own
instruction.

---
---

# ROUND TWO — THE CAS-SLOT REBASE, THE §323.2 RIDER, AND THE COMMIT

**Outcome:** the surface is **committed** at the chair's tip. The lane moved from
`2cdb87fa` to `b25907f9` (11 commits: WF-1C's six, MF-T2B's five), absorbed the
§323.2 font rider, re-derived the census by execution, and committed five files
as **`159ec24e`**.

## R1. The sync, and why nothing was lost

`git checkout` discards uncommitted work, and my census edit was going to collide
with two re-record blocks that had landed in the same constant. So the order was:
back up all four deliverables to `scratchpad/laneTENOTICES-r2-backup/`, discard
my census edit, checkout, confirm the three untracked files survived byte-intact.

```
2cdb87fa is an ancestor of b25907f9  → YES (clean forward move, no rebase for me)
after checkout: HEAD b25907f9; ?? THIRD-PARTY-NOTICES.md, public/third-party-notices.html,
                tests/build/thirdPartyNoticesPage.test.js   (all present, sizes unchanged)
```

## R2. ⛔⛔ THE §325.2 TRAP WAS LIVE, AND IT WOULD HAVE FIRED

The chair warned that identical-looking figures can carry two meanings. That is
not hypothetical here — **my old tuple's `titles` was 20,632, which is larger
than the new landed BEFORE of 20,625**, and 20,632 is exactly `20,625 + 7`. It
therefore reads as a perfectly plausible "+7 for my member" while in fact
encoding WF-1C's seven titles and none of mine. Carrying it would have silently
lost this member's entire title delta and looked right doing it.

| | files | parked | credited | titles | suiteTitles |
|---|---|---|---|---|---|
| my pre-rebase tuple (VOID) | 2486 | 364 | 2122 | **20632** | 5773 |
| landed BEFORE at `b25907f9` | 2487 | 364 | 2123 | **20625** | 5770 |
| **derived AFTER (executed)** | **2488** | **364** | **2124** | **20649** | **5776** |

**Every figure came from the walker's own sequenced convictions, quoted:**

```
expected 2488 to be 2487    → files
expected 2124 to be 2123    → credited   (it passed THROUGH parked: 364 is proven, not assumed)
expected 20649 to be 20625  → titles
expected 5776 to be 5770    → suiteTitles
then: Test Files 1 passed | Tests 33 passed (33)   TRUE_EXIT=0
```

Deltas `+1 file, +1 credited, +24 titles, +6 suite titles` reconcile against the
file's own shape: `grep -c '^describe('` = 6, `it()` count = 24.

⭐ **THE WALKER CAUGHT MY OWN STALE PROSE.** My block was drafted saying "FIVE
literal describes" and predicting +5 suite titles. The §323.2 rider had added a
sixth describe after that sentence was written. The conviction `expected 5776 to
be 5770` corrected both the figure and the prose — which is the entire argument
for deriving rather than describing. All three prior blocks (MF-T2A, WF-1C,
MF-T2B) are retained above mine in landing order, per the chair's instruction.

## R3. ⚠⚠ THE §323.2 RIDER SHIPPED INCOMPLETE, BY DELIBERATE REFUSAL — READ THIS

`public/fonts/OFL.txt` now ships. It carries, byte-exact, what I could verify:
both families' copyright and Reserved Font Name lines, **generated by script
directly from the TTF `name` tables** so no transcription error is possible;
the licence identity; and the canonical URL that Nunito's own metadata declares.

**It does NOT carry the body of the SIL Open Font License, and its first line
says so:** `*** FULL LICENCE TEXT NOT YET INCLUDED - THIS FILE IS INCOMPLETE ***`

**Why I did not write the body.** The licence text does not exist anywhere I can
reach, and I proved that rather than assumed it:

```
grep for OFL body text across the whole tree + node_modules + binaries
  → the ONLY hits are my own two notices files and one prose comment in src/lib/imFellFace.js
find -iname "*OFL*"                      → no licence file (the hits are substring false positives)
name ID 13 (License Description) on ALL 8 faces → len=0, EMPTY on every one
```

No copy in the repo, none in installed packages, none in the fonts, and this lane
has no network. **Reproducing a ~4.5 KB legal instrument from memory is the one
thing I will not do here.** An inexact licence is not a lesser fix — it misstates
the terms under which we receive and pass on the fonts, and the OFL asks that its
text travel *intact*. A wrong licence text would be a compliance defect wearing a
compliance fix's commit message. The original brief's discipline says it plainly:
no licence text is invented; copy verbatim or point.

So the rider is a **real but partial** improvement — the fonts no longer travel
with nothing — and the remaining gap is stated on the file's own first line, in
both notices copies, and here.

⛔ **THIS IS THE ONE ITEM THAT NEEDS A HUMAN.** The cure is thirty seconds of
someone's time with network access: paste the verbatim OFL 1.1 body into
`public/fonts/OFL.txt`, delete the marker line, and update the font rows in both
notices copies. **The pin already enforces that they move together** (R4).

⚠ Naming consideration, raised: the file is at the chair's specified path
`public/fonts/OFL.txt`. A licence scanner may treat any file so named as a
complete licence. If the chair prefers the incompleteness to be legible from the
filename until the body lands, `OFL-NOTICE.txt` would say so without being read;
I kept the specified name and put the declaration on line 1 instead.

## R4. The pin grew to cover the rider — and the coupling holds both ways

Three tests added (24 total). The third is the interesting one: it reads whether
`OFL.txt` still carries the pending marker and requires **both** notices copies
to agree with that state. It is green on both sides of the cure and reds if the
three artefacts drift apart in either direction.

**Five more negative controls, all convicted:**

| # | Mutation | Result |
|---|---|---|
| N0 | baseline | **EXIT=0**, 24 passed |
| N1 | body lands in OFL.txt but the copies still say "pending" | EXIT=1 |
| N2 | corrupt the Lora copyright line | EXIT=1 |
| N3 | Markdown claims complete while the file says pending | EXIT=1 |
| N4 | delete the notice file | EXIT=1, 3 failed |
| N5 | restore | **EXIT=0**, 24 passed |

Running total across both rounds: **17 mutations, 17 convictions.**

## R5. The commit

```
159ec24ec1ae1e54b3cdf321423e54a5a550fb9e   (detached; no ref moved)
 5 files changed, 1413 insertions(+), 1 deletion(-)
   THIRD-PARTY-NOTICES.md                            (new)
   public/third-party-notices.html                   (new)
   public/fonts/OFL.txt                              (new)
   tests/build/thirdPartyNoticesPage.test.js         (new)
   tests/lint/sovereigntyLightingContract.walker.test.js  (census block only, +36/-1)
```

Explicit paths only; the staged hunk on the one tracked file was audited and is
entirely mine. **The `.husky/pre-commit` hook ran `eslint --fix` and re-updated
the index** — so per shared-tree-git I compared committed bytes against my
authored bytes for all five files: **IDENTICAL on every one**, so the pre-commit
green still binds. Working tree clean afterwards.

⚠ **Foreign state observed and left alone:** `git stash list` carries
`stash@{0}: On analytics-intelligence-layer: generation-tuning fixes`. It is not
mine and not the hook's (the hook's own backup was created and dropped cleanly).
Untouched.

## R6. The round-two terminal, at the commit

Every step bare, fresh shell, in-shell `TRUE_EXIT`, self-named
`laneTENOTICES-r2-*.log`. Run at `159ec24e`, not at the pre-commit tree.

**Steps 1-14 — all `TRUE_EXIT=0`:**

```
validate:hazard-registry  0    validate:tuning-bands     0
validate:premortem        0    validate:foundry-module   0
validate:packets          0    validate:mcp-server       0
validate:data             0    typecheck:ratchet         0
validate:custom-content-manifest 0   typecheck:domain:strict 0
validate:migration-head   0    lint                      0
validate:edge             0
validate:map              0
```

**Steps 15-17 + smoke:boot — all `TRUE_EXIT=0`, every one on ATTEMPT 1:**

```
test:ratchet attempt1 TRUE_EXIT=0
  [test-ratchet] OK — no test regressions (11 known failure(s) of 28665 tests, ceiling 11).
build        TRUE_EXIT=0
verify:dist  attempt1 TRUE_EXIT=0
  [test-ratchet] STRICT DIST OK — 52 discovered/reported file(s), 433 test(s),
                 zero failed/non-run/uncollected/missing/extra/duplicate rows.
smoke:boot   TRUE_EXIT=0
  boot-smoke: 524 chunks · entry index-BWlsrVlw.js
  boot-smoke: stage 2: 524/524 chunks initialised
  boot-smoke: stage 3: shell mounted, 31706 B of markup under #root
  boot-smoke: PASS — the built bundle boots.
```

⭐ **NO CONTENTION RED THIS ROUND, and no classification was needed.** The mutex
was free (`acquired atomic lock ... after 0 poll(s)`) and both mutex-gated steps
passed first try — the WF-1D executor had not reached its terminal. The
four-leg method was therefore not exercised; it stands ready if the chair sees a
red on re-run. `verify:dist` counts 433 build tests, up from 430, which is the
three OFL pins.

⭐ **BOTH NEW SERVED FILES SHIP, VERIFIED AFTER THE BUILD:**

```
dist/third-party-notices.html   42,790 B   IDENTICAL to public/third-party-notices.html
dist/fonts/OFL.txt               2,990 B   IDENTICAL to public/fonts/OFL.txt
```

The rider lands at `/fonts/OFL.txt`, directly beside the eight font files it
covers, which is where a recipient of the fonts will look for it.

**Nothing banked; no ratchet update.** `scripts/.test-ratchet-baseline.json` is
untouched — the change surface was five files and that was not one of them.

---

## R7. THE TIP, LOUD — FOR THE CHAIR'S CAS

```
COMMIT:  159ec24ec1ae1e54b3cdf321423e54a5a550fb9e
PARENT:  b25907f94c5581969fe169fed553b23b1293516b   (= claude/composite-r4 at collection)
WORKTREE: scratchpad/tenotices-tree   (detached, clean, no ref moved)
```

Five files, 1413 insertions, 1 deletion. Full terminal green at the commit.

## R8. RAISED — carried forward, plus one new

Unchanged and still open from round one: **the packet ruling stands** (zero
non-terminal packets, no path reservation, `validate:packets` green);
**`dompurify` and `rgbcolor` are dual-licensed and UNELECTED** (§254.5.5 posture,
not a lane call); **`png-js` declares no licence in its manifest** while shipping
MIT text.

⛔ **NEW AND BLOCKING FOR THE DEPLOY: `public/fonts/OFL.txt` needs its licence
body pasted in by someone with network access.** Everything else in this lane is
finished; this is the one item a machine in this seat could not honestly complete.
See R3 for why reconstructing it was refused. The pin holds the three artefacts
in agreement so the cure cannot land half-done.

⚠ **Also new, minor:** the OFL notice ships at the chair's specified filename. If
the chair would rather the incompleteness be legible without opening the file,
`OFL-NOTICE.txt` is the alternative; I did not rename on my own authority.

---

# §B — OFL COMPLETION (lane TE-OFL, 2026-08-21)

The §323.2 rider shipped at 159ec24e **incomplete by declaration**. This section
records closing it. One commit, three files, no test file touched.

## B1. THE SOURCE, AND ITS VERIFICATION BEFORE USE

The chair supplied the body at `scratchpad/ofl-1.1-elected-body.txt` with a
required SHA-256. It was verified BEFORE a single byte was used, and again after
it was in place:

```
required   3c17a8394f32ef59bcf50896331249c22a4a4b9c53a5c6d5b9b88464b1c77239
source     3c17a8394f32ef59bcf50896331249c22a4a4b9c53a5c6d5b9b88464b1c77239   MATCH
```

Provenance (read, per the brief): chair-fetched 2026-08-21 from the Google Fonts
repository's own `ofl/lora/OFL.txt` and `ofl/nunito/OFL.txt` — the licence files
Google Fonts distributes with these two exact families. The two are byte-identical
below their FAQ-pointer line; they differ only in that pointer's scheme, and the
https variant (Lora's) is elected.

**NOTHING WAS TRANSCRIBED.** The file was assembled by concatenation
(`cat header body > OFL.txt`), never by retyping, so no transcription error is
possible. The proof is that the committed file's own tail still hashes to the
source:

```
$ git show HEAD:public/fonts/OFL.txt | tail -c 4303 | shasum -a 256
3c17a8394f32ef59bcf50896331249c22a4a4b9c53a5c6d5b9b88464b1c77239   MATCH
```

Body completeness, independently checked: all five section headers (PREAMBLE,
DEFINITIONS, PERMISSION & CONDITIONS, TERMINATION, DISCLAIMER) and all five
numbered conditions are present, ending on the full disclaimer paragraph.

## B2. THE DIFF

```
THIRD-PARTY-NOTICES.md          |  25 +++----
public/fonts/OFL.txt            | 153 ++++++++++++++++++++++++++++---------
public/third-party-notices.html |   6 +-
3 files changed, 131 insertions(+), 53 deletions(-)
```

- **`public/fonts/OFL.txt`** (2,990 → 6,668 B). The generated copyright/RFN block
  is kept EXACTLY — both lines are still the byte-exact TTF `name` ID 0 strings.
  Removed: the `*** FULL LICENCE TEXT NOT YET INCLUDED ***` marker, the
  "Read this first" incompleteness paragraph, and the whole "HOW TO COMPLETE THIS
  FILE" section. Added: a "WHERE THE TEXT BELOW COMES FROM" section carrying the
  provenance, and the verbatim body. The tail matches upstream structure —
  copyright lines, blank line, then `This Font Software is licensed under the SIL
  Open Font License, Version 1.1.`
- **`THIRD-PARTY-NOTICES.md`** — the §2 file-table row (state: complete), the §2
  flag paragraph (rewritten; the ⚠ is dropped since nothing is outstanding), and
  the §4 licence summary line.
- **`public/third-party-notices.html`** — the same three places, same wording, in
  the page idiom.

**No test file is touched.** The two-directional pin was authored to stay green on
both sides of this cure, and it did: it required the three artefacts to move
together and they did. No pin was weakened, and the census is unchanged — no title
added, no test file modified, `scripts/.test-ratchet-baseline.json` untouched.

## B3. THE PIN IS LIVE ON THE CURED SIDE — NEGATIVE CONTROL

A pin that passes after a cure is worthless unless it would still fail. Executed:

| Mutation | Expected | Observed | TRUE_EXIT |
|---|---|---|---|
| none (the commit as it stands) | green | 24/24 passed | 0 |
| `FULL LICENCE TEXT NOT YET INCLUDED` re-inserted into OFL.txt | red | 1 failed / 23 passed, on the agreement assertion by name | 1 |
| restore | green | checksum-verified identical to pre-mutation | 0 |

The mutant's message is the pin's own: *"the Markdown disagrees with
public/fonts/OFL.txt about whether the licence body has landed."* The agreement
pin is CONFIRMED live in the cured direction, not vacuous.

## B4. PROSE SCANNED BEFORE IT WAS WRITTEN

`THIRD-PARTY-NOTICES.md` is root-level, so it is IN the naked-claim corpus
(`tests/docs/enforcement-claims.test.js` scans every root `*.md` plus `docs/**`).
The claim vocabulary was read out of `CLAIM_RE` and paraphrased around, never
transcribed. Re-scanned after the final edit: **0 hits in the touched Markdown.**

The page contract also re-verified after editing: exactly one `href` (the support
mailto), and zero script/link/img/remote-`url()` loaders.

## B5. THE GATE — GREEN AT THE COMMIT

Run BARE (`npm run check:tail`) from a fresh shell at `fb80e32f`, never wrapped in
`gate-mutex.sh`, with the status captured in-shell. Self-named log:
`scratchpad/laneTEOFL-gate.log`; the wrapper's full log:
`$TMPDIR/gate-tail.83648.log`.

| Step | Observed | TRUE_EXIT |
|---|---|---|
| `validate:*` ×11 (hazard-registry, premortem, packets, data, custom-content-manifest, migration-head, edge, map, tuning-bands, foundry-module, mcp-server) | all passed | 0 |
| `typecheck:ratchet` | passed | 0 |
| `typecheck:domain:strict` | passed | 0 |
| `lint` | 29 problems, **0 errors**, 29 warnings (all pre-existing) | 0 |
| `test:ratchet` | `OK — no test regressions (11 known failure(s) of 28671 tests, ceiling 11)` | 0 |
| `build` + `postbuild` | built in 18.73s; 314 static route documents prerendered | 0 |
| `verify:dist` | `STRICT DIST OK — 52 file(s), 433 test(s), zero failed/non-run/uncollected/missing/extra/duplicate` | 0 |
| **whole chain** | **`[gate-tail] exit: 0`** | **0** |

```
TRUE_EXIT=0
```

`npm run check` is an `&&` chain, so a red at any step would have blinded every
later one. It reached `verify:dist`, the last link, which is the proof the whole
chain executed rather than short-circuiting.

## B6. THE SIX REDS ARE BASE REDS — PROVED, NOT ASSUMED

The pre-gate sweep (`vitest run tests/lint tests/build tests/docs`, run first per
the full-gate-ratchet law) came back **6 failed / 2,186 passed / 63 skipped**. Per
the brief, a red is mine until a pristine-base run says otherwise, so a pristine
run was executed at **190895a4** in this lane's own `tenotices-baseproof`
worktree:

| Test | Pre-sweep at my tree | Pristine base 190895a4 | Verdict |
|---|---|---|---|
| `tests/docs/enforcement-claims.test.js` | FAIL | FAIL | base red |
| `tests/lint/clampPrimitiveBaseline.test.js` | FAIL | FAIL | base red |
| `tests/lint/warCostKindPools.walker.test.js` (×3) | FAIL | FAIL | base red |
| `tests/lint/warRulingKindPools.walker.test.js` | FAIL | FAIL | base red |

Base run: 6 failed / 96 passed, `TRUE_EXIT=1` — the SAME six titles.

**WHY THE GATE IS GREEN WHILE A RAW VITEST RUN IS RED — stated plainly, because
this is exactly the shape that lies.** These six are among the estate's **11
banked known failures**, so `test:ratchet` reports `no test regressions` and the
gate passes. A bare `vitest run` over those directories does not consult the
bank and shows them red. Both readings are true; neither is a regression, and
neither is cured by this lane.

The bank is also the strongest evidence this change added nothing: the ratchet
sits **exactly AT its ceiling (11 known failures, ceiling 11)**, so a single new
failure anywhere in the 28,671 would have pushed it to 12 and redded the gate.
It did not move. `scripts/.test-ratchet-baseline.json` is byte-unchanged by this
commit (`git diff 190895a4 HEAD -- scripts/.test-ratchet-baseline.json` is
empty).

The `enforcement-claims` red deserved a second look, because I edited a file in
its corpus. Its naked-claim list was diffed base-vs-mine and is **byte-identical**
(6 rows, all in `docs/FABLE_VALIDATION_QUEUE.md`, `docs/GOLDEN_SHIFT_LEDGER.md`,
and `docs/implementation/packets/foreign-policy/IN-0C.md`). My Markdown
contributed nothing to it. **Nothing banked; `test:ratchet:update` never run.**

## B7. THE TIP, LOUD — FOR THE CHAIR'S CAS

```
COMMIT:   fb80e32f03564e6edcbad4bf37de27694c2fe986
PARENT:   190895a4f354eb29d3c769edaca442ebbe7df98c   (= claude/composite-r4 at collection)
WORKTREE: scratchpad/tenotices-tree   (detached, clean, NO REF MOVED)
```

One note for the record: an earlier commit object `febda218` was amended away
before any gate ran against it. Its message carried a wrong byte figure for the
old file (it stated the new header's size, 2,365, where the old file was 2,990).
The tree was byte-identical — `git diff febda218 fb80e32f` is empty — and the
gate reported above ran at `fb80e32f`. `febda218` is unreferenced; no ref ever
pointed at it.

## B8. RAISED

- **The §295 OFL item is now closed.** The blocking item this lane's §A receipt
  raised in R8 — "`public/fonts/OFL.txt` needs its licence body pasted in by
  someone with network access" — is discharged.
- **Unchanged and still open**, carried forward from §A: `dompurify` and
  `rgbcolor` are dual-licensed and remain UNELECTED (§254.5.5 posture, not a lane
  call); `png-js` declares no licence in its manifest while shipping MIT text.
- **The elected variant is a recorded choice, not a forced one.** Upstream ships
  the FAQ pointer as `https://scripts.sil.org/OFL` with Lora and `http://` with
  Nunito. The https form is in the file. The two bodies are otherwise identical,
  so nothing turns on it, but it is a choice and it is written down here and in
  the file itself rather than left silent.
- **`tenotices-baseproof` was left detached at 190895a4** (it was at 2cdb87fa).
  It is this lane's own proof worktree and clean; moving it back is a no-op if the
  chair prefers.
