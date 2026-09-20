# FIX-P3 — RECEIPT (the six silent-refusal paths, REVIEW-P F3/F4/F10/F11/F12/F13)

Lane: Opus FIX-P3. Chair: Fable 5.1, session a9df403c. Date 2026-09-20.
Worktree `$SP/lane-fix-p3` · branch `fix-refusals-2026-09-20` · base `63e40fe57`.
`git status --short` EMPTY after the last commit; no untracked survivor; no `git add -A`,
no stash, no reset, no amend, no push, no `UPDATE_*` door, no refreeze.

## THE FIVE COMMITS

| sha | car |
|---|---|
| `bccaef6e9` | **F3** — the dossier's Regenerate says why it stopped |
| `5933b8328` | **F4** — the landing's "Narrate" raises its reason instead of moving the reader (+ noticed 3, measured and NOT built) |
| `e25376ef9` | **F10** — the sign-in surface names the page that is waiting |
| `df4fb56b5` | **F11** — the front door says when it had no such page |
| `6bf1d0623` | **F12 + F13** — a refusal is said ONCE, on the surface that earned it, about the right reader |

31 files, 1,588 insertions, 45 deletions. Every commit by explicit pathspec;
`git show --stat HEAD` named exactly its own paths each time.

⚠ FOUR FILES ARE SHARED BY MORE THAN ONE CAR and a pathspec commit takes a file whole:
`src/lib/refusalReasons.js` and `src/copy/en.js` land in F4's commit carrying F10's,
F11's, F12's and F13's rows; `src/components/GenerateWizard.jsx` lands in F3's carrying
F12's attribution. Splitting hunks needs interactive staging, which the brief forbids.
Each later body names what of its own landed early.

## RECEIPTS — every claim CONFIRMED, with its count line

All vitest through `gate-mutex.sh`, SHARED tier, `--pool=threads --maxWorkers=2`, the two
exports spelled inline, one directory per invocation.

| batch | result |
|---|---|
| `tests/components` (WHOLE — the create-a-test-file law) | **Test Files 297 passed (297) · Tests 2086 passed (2086)** |
| `tests/lint` (WHOLE — the change lives under it) | **Test Files 1 failed \| 171 passed (172) · Tests 1 failed \| 2778 passed (2779)** — the ONE red is the lighting census, lawful at this base |
| `tests/copy` | Test Files 12 passed (12) · Tests 151 passed (151) |
| `tests/ui` (13 affected suites) | Test Files 13 passed (13) · Tests 73 passed (73) |
| `tests/config/tierFacts.contract.test.js` | Tests 24 passed (24) |
| `tests/data/sampleSettlements.test.js` | Tests 15 passed (15) |
| `tests/store` (2 lane suites) | Tests 14 passed (14) |
| `npx eslint` (31 touched files) | exit 0 — **zero errors and zero warnings** |

### RED-FIRST — every cure reverted, the red quoted, the tree restored

| proof | red |
|---|---|
| F3 · the dossier mount deleted | Tests 4 failed \| 1 passed (5) |
| F4 · §03 reverted to `onNavigate('generate')` | Tests 2 failed \| 3 passed (5) |
| F10 · the sign-in notice deleted | Tests 1 failed \| 3 passed (4) |
| F11 · the AppViews mount deleted | Tests 1 failed \| 6 passed (7) |
| F11 · the notice made EAGER | Tests 1 failed \| 6 passed (7) |
| F11 · the LATCH branch removed | Tests 1 failed \| 7 passed (8) |
| F11 · the CLEAR branch removed | Tests 1 failed \| 7 passed (8) |
| F12 · the hero renders any record again | Tests 1 failed \| 10 passed (11) |
| F13 · the lane stops measuring the tier | Tests 1 failed \| 10 passed (11) |
| walker arm 6 · FoundingWorlds stops naming itself | Tests 1 failed \| 12 passed (13) |

## ⛔ THREE PROOFS CAME BACK GREEN BEFORE THEY CAME BACK RED

Each was a real gap the red-first exposed, cured and re-proved — none was improvised
around.

1. **The F12 harness could not measure its own property.** It mocked `useStore` with a
   `subscribe` returning a no-op, so only the component whose own `setState` ran
   re-rendered — always the surface that was clicked. MEASURED: the F12 arms went GREEN
   with the cure REMOVED. Rebuilt on a REAL zustand store (the cure
   `refusalDoesNotTravel.test.jsx` records for the same trap).
2. **F4's pin never read the landing.** It mounts the control directly, so reverting
   §03 to the bare navigation changed nothing it could see. A WIRING arm over
   `LandingBelowFold`'s source was added.
3. **F11's latch branch had no arm.** Every other arm mounts fresh at a bad address,
   which the hook's INITIAL state covers alone; the branch is reachable only when a
   SECOND unknown address arrives with no view change between. That arm now exists.

…and a fourth, found while repairing 2: **`codeOnly` blanks string CONTENTS by design**,
so a matcher clause quoting a module specifier can never match. It turned F11's whole
wiring matcher permanently false — every guard-the-guard below it passed VACUOUSLY while
the live arm convicted a cured tree. The declaration claim now reads comment-stripped
source; the USE claims still read code. The same trap had made one clause of F4's
matcher dead weight; that clause is gone with the reason written down.

## GOLDENS — byte-identical before the first edit and at the tip

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```
No generator, no record, no fixture in the change manifest. `lastRefusal` is session-only
(`store/persistProjection.js` names its persisted keys one by one and it is not among
them), so the new `at` field reaches no save and no shape register.

## LIGHTING CENSUS — measured at the base, never refrozen

The register in this tree holds the older `2650·383·2267·25028·6677` row, so the walker's
red here is the base's own distance PLUS this lane's delta. Both ends executed:

* **BASE `63e40fe57`: `2651·383·2268·25034·6678`** — resolved in a DISPOSABLE detached
  worktree (`$SP/lane-fix-p3-base`, now removed) by patching its own throwaway register
  figure by figure until the walker ran **Tests 34 passed (34)**. Nothing was committed
  from it and the real register was never touched.
* **THIS TREE: `2656·383·2273·25070·6688`** — the same method over the base tree with
  this lane's `tests/` changes copied in. Cross-checked against my tree's own red, which
  reads `expected 2656 to be 2650`.
* **THIS LANE'S DELTA: `+5 files · +0 parked · +5 credited · +36 titles · +10 suite titles`**
  (five new test files under `tests/components/`).

The refreeze is the train's terminal act and the chair's.

## REGISTERS THIS CHANGE MOVES WHEN COMPOSED (as DELTAS)

* **lighting census** — `+5 · +0 · +5 · +36 · +10` (above).
* **`tests/components/phoneChromeFloor.census.test.js`** — `/signin` row `floored 4 → 5`,
  re-measured and re-recorded in F10's car. CAUSE: the new sign-in notice's ClerkNote
  rubric is a chrome line that takes the phone floor. A NEW floored line, not a cured
  bare one; `bare` stays 0.
* **`tests/lint/.prose-numerics-baseline.json`** — ONE row RE-ADDRESSED, not added or
  removed: `src/components/home/LandingArtifacts.jsx` `{town.pressure}` line `238 → 242`,
  path/category/snippet byte-identical, moved by the import and comment added above it.
  The file's own header records this as the practice. No `UPDATE_*` door used.
* **mutation-coverage manifest** — NO ROW OWED. The five new test files live under
  `tests/components/`, which is not an `ENFORCER_DIR`, and none of their basenames match
  `NAME_PATTERN`. The walker I widened (`tests/lint/refusalNoticeCoverage.walker.test.js`)
  already carries its row; no new `tests/lint` file was created.
* **`tests/lint/loadingNarrationRatchet.test.js`** — UNMOVED, deliberately. The first cut
  reddened it at 39; the notice now leans on the shell's Suspense, as `RealmPhoneNotice`
  beside it does. ⚠ The ratchet's regex matches the literal `fallback={null}` ANYWHERE,
  including inside a comment — my own explanatory sentence tripped it once.

## BUDGET — every touched file measured against its ceiling

Executed with eslint's own `Linter` under `max-lines` `{skipBlankLines, skipComments}`,
never `wc -l`. No touched file carries a `scripts/.size-baseline.json` row.

| file | before → after | ceiling | headroom |
|---|---|---:|---:|
| `src/AppViews.jsx` | 113 → 123 | 600 | 477 |
| `src/components/GenerateWizard.jsx` | 412 → 416 | 600 | 184 |
| `src/components/HomeHero.jsx` | 397 → 398 | 600 | 202 |
| `src/components/auth/SignInPage.jsx` | 54 → 67 | 600 | 533 |
| `src/components/generate/FoundingWorlds.jsx` | 83 → 84 | 600 | 516 |
| `src/components/generate/LayeredConfigurationPanel.jsx` | 185 → 185 | 600 | 415 |
| `src/components/home/LandingArtifacts.jsx` | 329 → 352 | 600 | 248 |
| `src/components/home/LandingBelowFold.jsx` | 411 → 413 | 600 | 187 |
| `src/components/primitives/RefusalNotice.jsx` | 22 → 22 | 600 | 578 |
| `src/components/NotFoundNotice.jsx` | new → 14 | 600 | 586 |
| `src/hooks/useMissedPath.js` | new → 11 | 800 | 789 |
| `src/lib/refusalReasons.js` | 19 → 32 | 800 | 768 |
| `src/lib/routes.js` | 172 → 175 | 800 | 625 |
| `src/store/settlementGenerateAction.js` | 255 → 259 | 800 | 541 |

⛔ **`src/App.jsx` IS UNTOUCHED BY THIS LANE.** It stands at **575 of 600** with no
size-baseline row, so F11's cure was shaped to land in `AppViews.jsx` instead.
⛔ **`src/components/SettlementsPanel.jsx` at 577 of 600** is untouched for the same
reason and is admitted by name in the walker's `ATTRIBUTION_EXEMPT`.
**Neither file appears in `docs/implementation/PACKET_STANDARD.md`'s standing hot list,
and that list's own rule is that "a file at its ceiling with no entry here is a trap".
Adding a row is a coordinator act — reported, not done.**

## DECLARED BEHAVIOUR CHANGES (stated, not left to ride)

1. **The tier and resolved-tier refusal sentences change wording for an ANONYMOUS reader
   only:** "past what this account forges" → "past what an account-less visit forges". A
   signed-in reader's sentence is byte-identical. This is the cure, not a side effect.
2. **`refusalOf` returns a third field `at` (null unless keyed).** Swept: three existing
   pins asserted a record or an options bag exactly and all three moved with it
   (`foundingWorlds`, `foundingWorldsForkRefusal`, `silentRefusalSurfaces`,
   `realmPhoneNotice`). ⚠ I had reported in the resume note that only the two
   FoundingWorlds pins did; that was WRONG, and the whole-directory run corrected it.
3. **`generateSettlement`'s options bag gains `at`** on five surfaces. An UNKEYED record
   is still rendered by every surface, exactly as before, so nothing outside those five
   moves and `refusalDoesNotTravel`'s mechanism arm is untouched.
4. **`tests/ui/anonPreGenLocked.test.jsx` no longer TYPES the ceiling sentence** — it
   derives the phrase from `tierFacts` and pins that the gate MEASURED the tier. It was
   asserting the exact defect F13 cures.

## JUDGMENT CALLS (each vetoable)

1. **The click travels on the generation call's options bag** (`at`, beside `intent`)
   rather than through a new store action or a shared hook — the channel the lane
   already reads, and no operation-registry row is owed.
2. **An unkeyed record renders everywhere rather than nowhere** — backwards
   compatibility over a stricter rule that would have silenced every un-migrated caller.
   The walker's arm 6a is where a stricter denominator would go.
3. **`resolvedTier` cured alongside `tier`** though the review cited only `tier` —
   identical false clause, reachable anonymously by a 'random' roll over the ceiling.
4. **F12 cured across FIVE surfaces, not the two the walk met** — the config stage and
   the /home trio carry the same shape; `SettlementsPanel` and `ForgeExactDemo` are alone
   on their routes and stay unkeyed, admitted by name.
5. **The dossier notice sits BELOW the sticky toolbar, not inside it** — ClerkNote has no
   background and would render ink-on-ink in the dark arrow band.
6. **The not-found line is mounted in `AppViews.jsx`, lazily, with no Suspense of its
   own** — three measured budgets (App.jsx's headroom, the eager first-paint closure, the
   silent-boundary ratchet) each pointed the same way.
7. **`accountHolderPhrase` is a two-branch helper, not a tier table** — the only
   distinction the sentences draw is "has an account" versus "does not".
8. **The prose-numerics row was re-addressed by hand** rather than regenerated — one
   integer, same path/category/snippet, and no `UPDATE_*` door exists that the brief
   would allow.

## ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. **NOTICED 3's PREMISE IS REFUTED.** The landing's "Save to Library" is NOT a button:
   `src/components/home/LandingArtifacts.jsx:262-265` renders `tl('brief.save')` as a
   bare decorative `<span>` under the module's own §3.8 convention (owner addition
   W-L2/5). No handler, so it cannot refuse and cannot navigate; no accessible name BY
   DESIGN. **NOT BUILT.** The live question is a different one and is the OWNER's, since
   §3.8 is an owner amendment: a chip painted to look like a button invites a click that
   does nothing — the silent-no-op class wearing §3.8's coat. Its sibling
   `tl('realm.clockCta')` at `:414-417` is the same shape.
2. **TWO FILES SIT AT THEIR CEILINGS WITH NO HOT-FILE ROW** (executed above):
   `src/App.jsx` 575/600 and `src/components/SettlementsPanel.jsx` 577/600. Slot: a
   coordinator adds both rows to `docs/implementation/PACKET_STANDARD.md`'s standing
   list with these measurements, before a lane walks into one.
3. **THE SILENT-BOUNDARY RATCHET COUNTS ITS OWN LITERAL IN PROSE.**
   `tests/lint/loadingNarrationRatchet.test.js:55` uses `/fallback=\{null\}/g` over raw
   source, so a comment that NAMES the pattern reds the gate — it cost me one cycle.
   Slot: read the file through `tests/helpers/codeOnlySource.js` as the estate's other
   source walkers do, and re-measure the pin once under the stricter read.
4. **`tests/store` IS STILL INVISIBLE TO THE MUTATION REGISTER** (TOOL-6's find,
   independently confirmed here): `tests/store` is not an `ENFORCER_DIR` and its
   basenames rarely match `NAME_PATTERN`, so my store-adjacent pins would owe no row
   either. Already chartered as TOOL-6b; noting the second sighting.
5. **THE OTHER SIX REFUSAL MOUNTS ARE UNWALKED BY A BROWSER.** F12's cure is proved in
   jsdom and by the walker; only /create's pair was ever measured live. Slot: REVIEW-P2
   re-walks /home desktop (hero + §02 + commons strip) and the signed-in config stage,
   counting `role="alert"` nodes after one click.
6. **`refusalCopy`'s `{page}` and `{path}` have no safe default.** Every other var either
   has one (`sizes`, `holder`) or is supplied by the single gate that raises it. These
   two are supplied by their single raiser, which returns null rather than a partial
   record — but a future second raiser that forgets would paint `{page}` at a reader.
   Slot: either give the register a per-reason required-vars declaration the walker
   enforces, or have `refusalCopy` refuse (return null) when a reason's body still
   carries a placeholder after interpolation.
7. **F11's line is not reachable by keyboard focus order review.** The notice renders
   above the view with a Close control; nobody has checked whether focus lands on it or
   whether a screen reader announces it before the view's own heading. Slot: one
   a11y pass over the not-found line and the sign-in line together, both being new
   `role="alert"` nodes above a page's main content.
