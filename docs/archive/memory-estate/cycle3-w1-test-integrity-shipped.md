---
name: "Cycle-3 Wave 1 (test-integrity) shipped"
metadata:
  node_type: memory
  created: 2026-07-21
  type: project
  scope: "Cycle-3 fix program, Wave 1 — the 'tests that lie' class (H8/M6/M7/M8) + the anti-vacuity walker"
  branch: claude/cycle3-w1-test-integrity
  commit: 99b3b57c
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T02:20:08.367Z
---

# Cycle-3 Wave 1 (test-integrity) shipped — NOT folded

Branch `claude/cycle3-w1-test-integrity` off composite-r4 **d2471e36** (worktree vision-j). Three
gated commits, awaiting Fable's fold. Zero src/ bytes — all changes are tests/ + one INERT Deno
edge-fn export + a JSON manifest. Client dist closure UNCHANGED (under the 1,040,000 budget;
lineage record ~1,039,975).

Commits (order = brief order): chokepoint FIRST, four fixes, walker LAST.
- **ccef8f68** — `tests/helpers/sourceContract.js` (+self-test): fail-closed extractors.
- **a7e8d7cf** — the four instance fixes (H8/M6/M7/M8).
- **99b3b57c** — `tests/lint/contractTestAntiVacuity.walker.test.js` + manifest registration.

## The chokepoint (why every fix routes through it)
`tests/helpers/sourceContract.js`: `mustExtract / functionBody / sqlFunctionBody` THROW (never
return '') when a target is absent; `jsRegexTokens / sqlRegexAlternation` throw on a zero-size set
and refuse to silently drop a token they can't normalize. `sqlRegexAlternation` returns MEMBERSHIP
regexes (comments stripped, `\m`/`\y` removed) so a denylist token is checked as "the SQL would
deny this key", not as a substring of the scanner blob. Self-test: 14 assertions.

## The four fixes (before → after vacuity shape) — all adversarially verified
- **H8 refundPolicy** (`supabase/functions/generate-narrative/refundPolicy.ts` + `.test.ts`): the
  "total over the FailureStage union" test hardcoded `['thesis','dailyLifeField','refinement']`, so
  a new stage went unverdicted and passed. FIX: `refundPolicy.ts` exports `FAILURE_STAGES` (single
  runtime source; `FailureStage = typeof FAILURE_STAGES[number]`, behavior-identical); the test
  reconciles its verdict table against `FAILURE_STAGES` both ways. ⚠️ EDGE-FN SOURCE TOUCHED but
  INERT (one new const export) — no deploy. Adversarial: injecting a 4th stage reds the reconcile.
- **M6 mapBridge.contract** (`tests/lib/`): the two "every canonical command…" tests did
  `if (!msg) continue` before their only assertion → all-empty run counted green. FIX: catalog now
  DERIVED from `src/lib/mapBridge.js` via `matchAll(/…call('settlementEngine:…')/)`, `>=20` floor +
  per-command "did it post" + count assertion, skip-guards dropped. ⚠️ the hardcoded literal had
  DRIFTED — it was missing **getSpatialPack** and **exportThumb** (real surface = 20). Now pinned.
- **M7 gallery_privacy.contract** (`tests/security/`): local `functionBody/sqlFunctionBody` returned
  '' on absence → `.not.toMatch` privacy guards ran against emptiness. FIX: imported from
  sourceContract (throw) + explicit `toBeTruthy()` on the detail body. Adversarial: a renamed target
  errors instead of passing.
- **M8 snapshotDenylistDrift** (`tests/security/`): `tokensOf` stripped metachars + `.filter(Boolean)`
  and the guard used substring (`SCANNER_SQL.toContain`) — `hook` passed only because `plothook`
  contained it. FIX: MEMBERSHIP pin (each of 35 client tokens must be matched as a whole key by some
  SQL alternative) + non-vacuous floor. Adversarial probe: a removed `.*hook.*` alternative is CAUGHT
  by membership, MISSED by substring.

## ⭐ M8 — NO new finding (owner deploy-SQL queue is clean here)
All 35 client denylist tokens (COVERT_KEY_RE ∪ PRIVATE_KEY_RE) ARE covered by the net-current SQL
scanner `_gallery_world_snapshot_is_safe` (mig **136** is net-current; 089→127→128→130→136 chain).
The old test passed for the WRONG (substring) reason; the new membership pin passes for the RIGHT
reason. So there is NO missing SQL token, NO migration owed.

## The prevention walker (`tests/lint/contractTestAntiVacuity.walker.test.js`)
Scans tests/security/**, tests/**/*.contract.test.*, tests/lint/*.test.js (self-excluded). Three
fail-closed rules, all allowlists EMPTY at birth (calibrated over all 146 scoped files):
- **Rule 1a** — bare `if (!x) continue/return` immediately before `expect(`.
- **Rule 1b** — extractor result in a negative matcher (`.not.*`) with no toBeTruthy/length guard.
- **Rule 2** — exhaustive "every…" claim (minus self-referential markers) backed by a LOCAL PURE
  LITERAL in a file that derives NOTHING from source. ⚠️ KEY CALIBRATION: pure test-granular
  "iterates a literal" gives **17 false positives** (curated sentinel/expected lists in PGlite/
  readFileSync files); the empty-at-birth gate is the ADDED file-level "no derivation signal"
  condition — those 17 all live in files that derive elsewhere.
Detection runs on a comment/string/regex-BLANKED code skeleton (avoids the copyCorruption
string-literal FP). Adversarially verified two ways: in-file self-tests (plant each shape + its
fixed negative control) AND a live scan of three planted probe files (walker reddened on all three,
then probes deleted). Two new self-proving meta-tests registered in
`scripts/mutation-coverage-manifest.json` under the existing `self-proving-meta` rationale
(uncoveredBaseline unchanged at 199).

## Hazards / notes for the fold
- ⚠️ **Cross-lane ratchet**: adding ANY new `*.test.js` under an ENFORCER_DIR (tests/lint etc.) or
  with invariant nomenclature (basename contains contract/walker/coverage/…) trips the E-A totality
  ratchet (`mutationCoverageManifest.test.js`) — register it in the manifest (mutation / rationale;
  never uncovered). This wave registered 2.
- ⚠️ **Pre-existing flake** (NOT mine): `tests/security/aiRequestIdempotency.pglite.test.js:81`
  (`ttl=0` stale-sweep, `duplicate:false`) fails ~1-in-2 under load, passes in isolation. Shares no
  file/import with this wave. Timing-dependent; owner/other-lane concern.
- ⚠️ **Env**: full `deno task check:edge` fails in the worktree on `Could not find a matching package
  for 'npm:@types/node'` — ENVIRONMENTAL (reproduces on untouched stripe-webhook/index.ts). The
  targeted `deno check --frozen refundPolicy.ts index.ts` is exit 0; `deno task test:edge` = 449/0.
- Gate receipts: tests/lint+copy green; tests/security 1210/1211 (the 1 = the flake above); tsc 0;
  eslint 0; domain-strict 0; NUL 0; build + VERIFY_DIST 220/220 (closure under budget, unchanged).
