# SKEPTIC §913 — LENS: THE CONSIST PROOF AND THE BUILD (L-MAT-FIX cars 7–9)
Seat: Opus 5 — Fable-unvalidated (verifier). Dock `$SC/laneLMAT`, tip `19642a9fce0817213040af0a0815ac5ced09fbbb`.
Porcelain BEFORE 0 · AFTER 0. HOLD-VITEST absent at every check. Every figure below came from a command I ran.
Read-only throughout: no edit, no commit, no checkout, no build, no install; two focused vitest files and one
typecheck gate, each with the vitest count at 0 immediately before.

## (a) THE THREE COMMITS
- `git log --format="%H %s%n%b" 7d96e2b72..HEAD`: three commits, `f46ba7846` · `2fd5a380e` · `19642a9fc`.
  Each body ends `Seat: Opus 5 — Fable-unvalidated` + `Lane: L-MAT-FIX` (+ a Co-Authored-By line). **CONFIRMED.**
- Staged paths per car (`git show --stat`): car 7 = 13 files (7 src + 6 test), car 8 = 4, car 9 = 5; every file the
  receipt's car tables name is in that car's stat, and each commit message's own file count ("thirteen"/"four"/
  "five") matches. Distinct union = **18**, exactly the receipt's "eslint, all 18 touched files". **CONFIRMED.**
- `git diff --name-only 7d96e2b72..HEAD` → 18 paths, all under `src/` and `tests/`. Grep for
  `package(-lock).json|pnpm-lock|yarn.lock|deno.lock|baseline|golden|migrations|applied-head|ARCHITECTURE` = **0 hits**.
  Five frozen baselines are md5-identical at base, tip and worktree:
  `.full-typecheck-baseline.json 0342f68b…`, `.writer-reach-baseline.json 8c9ea0c4…`,
  `.observed-shape-readers-baseline.json c4b5aec8…`, `.size-baseline.json 917027c8…`, `.test-ratchet-baseline.json 7695cf1d…`.
  **CONFIRMED — no forbidden byte moved.**
- Brief-path note (not a receipt claim): the brief's DEF-4 cited `src/store/accountImport.js`; that file does not
  exist in the tree. The cure landed in `src/store/accountImportBody.js`, whose diff shows the versionHistory
  remap loop. The brief's line was a stale hypothesis, as the brief itself warns.

## (b) THE TYPECHECK RATCHET
- Baseline byte-identity: base = tip = worktree, md5 `0342f68be60393b43e678c1c185b3fef`; the file records
  `"total": 173`. **CONFIRMED.**
- Executed the gate (not vitest, not a build): `node scripts/check-full-typecheck.mjs` →
  `EXIT=0`, `[typecheck-ratchet] OK — no type regressions (173 error(s), ceiling 173).`
  Baseline md5 unchanged after the run. **CONFIRMED at the tip, live.**

## (c) THE FOCUSED FILES
- The receipt's proof table lists **18** test files (not 19); every one resolves at the tip via `git ls-tree`.
  **CONFIRMED (with the count corrected to 18).**
- Re-ran two, one at a time, from the dock:
  - `tests/lint/negativeAssertionAnchor.walker.test.js` → EXIT 0, **9 passed** (receipt: 9). The walker file is
    byte-unchanged base→tip (0 diff lines) and enforces per-file counts by **exact equality**, so green here is
    the "budgets EXACT" claim itself. **CONFIRMED.**
  - `tests/lint/observedShapeReaders.walker.test.js` → EXIT 0, **44 passed** (receipt: 44), 39.3 s. **CONFIRMED.**

## (d) THE BUILD SHIFT
A `dist/` from 19:22 exists in the dock. I did not build. I re-walked the first-paint closure with the exact BFS
`tests/build/vendorPdfLazy.test.js` uses (entry from `dist/index.html`, static `from"./x.js"` + bare-import edges):

| figure | receipt TIP | my measurement |
|---|---|---|
| closure files | 8 | **8** |
| RAW | 1,042,122 | **1,042,122** |
| gzip (level 9) | 330,822 | **330,822** |
| Brotli (q11) | 277,755 | **277,755** |
| entry chunk | 570,296 | **570,296** (`index-B4_qfDfz.js`) |
| `engine-core` | 126,461 | **126,461** |
| emitted files | 1,377 | **1,377** |

Budgets read off the test: RAW 1_048_000 · gzip 337_000 · Brotli 283_000 → margin **5,878 B** raw, as claimed.
The three keys `customContentRoster`, `customContentProvenance`, `_livingContentLawVersion` occur **0 times in
all eight first-paint chunks** (counted occurrences, not lines). Carriers are lazy: `engine-*`, both workers,
`importScrub-*`, `publicSafe-*`, `accountImportBody-*`, `StructuredCampaignReconciliation-*` — matching the
receipt (with the nuance that `importScrub-*` carries the two record keys, not the marker literal, which it
imports as `{L as s}` from the lazy engine chunk). **CONFIRMED.**
The new import edge is real: `src/lib/importScrub.js` imports `LIVING_CONTENT_LAW_CONFIG_KEY` from
`../domain/content/livingContentLawVersion.js` at the tip and no such import exists at base; the leaf's importer
set grows 6 → 7. **CONFIRMED.**
BASE column (1,042,086 / 330,813 / 277,727): I may not build, so not reproduced here — but those three numbers
are exactly the receipt's own earlier Build-E record at `7d96e2b72`, and 1,042,086 + 36 = 1,042,122,
330,813 + 9 = 330,822, 277,727 + 28 = 277,755 all close. **PARTLY (arithmetic and tip half confirmed).**
⚠ **THE ATTRIBUTION IS NOT SHOWN BY THE EMITTED TIP.** The receipt says engine-core's +9 is "cross-chunk plumbing
for the `livingContentLawVersion.js` leaf, which car 7 gave a second importer". At the tip that leaf's constant is
`Wh="_livingContentLawVersion"` **inside the lazy `engine-*.js` chunk**, exported there as `L`, and imported by
`importScrub-*.js` from `engine-*.js`. `engine-core` contains neither the literal nor `customContentRoster`, and
`importScrub-*.js` imports nothing from `engine-core`. What I could confirm is the *location*: character 125,402
of `engine-core` falls inside its `export{…}` alias list (which begins at 124,583). So the +36 is real and the
location is right; the causal story about which symbol moved is **UNTESTED** — proving it needs the base build and
a char-diff of `engine-core`, plus checking whether the base `engine-core` carried that leaf at all.
FRAMING: honest. The shift is stated in bold, priced (+36 of 5,914 margin), and repeated in DEFERRED row 8 —
it does not ride silently.
Determinism ("the two tip builds produced identical chunk hashes") — **UNTESTED**, a build is out of my fences.

## (e) node_modules 455
`ls -A node_modules | wc -l` = **455**; `ls` (non-hidden) = **452**; the three hidden entries are `.bin` (a symlink
into the main tree), `.vite` (11:07) and `.vite-temp`. The BASE dock `laneB6` reads **455 / 452 with the identical
entry list** (`diff` of the two listings is empty). So the "+1 over the brief's 453–454 window" is not a package:
arrival #1's 454 → arrival #2's 455 is a hidden vite cache directory appearing, and no package entered the dock.
The receipt's number is right; its framing ("recorded, not acted on") leaves a reader thinking a dependency may
have moved. **PARTLY.**

## (f) THE FROZEN INSTRUMENTS
- Negative-assertion budgets: walker unchanged base→tip, enforcement is exact equality per file, run green
  (9 passed). Budget rows for the touched files still read `accountImport.test.js: 6`, `importScrub.test.js: 1`,
  `importReconciliation.test.js: 1`, `accountImportSlice.test.js: 9`. **CONFIRMED.**
- OSR: `scripts/.observed-shape-readers-baseline.json` reads `total = 1972`, `identities = 1397`, `frozen 2026-09-06`,
  and is byte-identical base→tip→worktree. The walker's SHRINK-ONLY / no-vanished-row / internal-consistency arms
  are green at the tip (44 passed). I did not invoke `check-observed-shape-readers.mjs` directly (it has a
  `--write` path and I stay out of the dock's files), so "the script prints 1972" is confirmed indirectly.
  **CONFIRMED (frozen inventory 1972; live equality via the walker's shrink-only arms).**
- U1 plant restoration: `src/workers/customContentPreview.worker.js` md5 = `ad11078ef07775df072388722646f0f9` at
  base, at HEAD and in the worktree — the receipt's "clean" digest, no plant residue. **CONFIRMED.**

## FENCE DISCLOSURE
My two vitest runs caused vitest to touch `node_modules/.vite-temp` inside the dock (mtime 19:35). It is an
ignored cache path; `git status --porcelain` is 0 before and after and HEAD is unchanged.
