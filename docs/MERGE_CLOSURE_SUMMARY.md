# Merge Program — Closure Summary

The reconciliation/merge program brought the `settlement-generator` reference
tree's work into `settlement-engine` in staged waves, each landing behind the
full green gate with golden byte-identity preserved. This is the definitive
record of what landed, what wave 5b (the final wave) fused, and the debt that
remains.

## Waves landed (merge commits, oldest → newest)

| Wave | Merge commit | Theme |
|---|---|---|
| 1 | `1713c37c` | Production migration chain 001–125 comes home |
| 1b | `ebbd29be` | Edge layer rebased onto the hardened platform |
| 2a-prep | `babfcdb2` | Religion substrate lands dormant |
| 2a | `6bc0265b` | The living world (world-pulse) moves in, dormant + certified |
| 2b | `65027626` | Domain surgery: events split, causal semantics, sanitizer twin |
| 2b-r | `6ca27bef` | Religion pipeline becomes reachable |
| 2c | `635a9f3d` | Deferral debt cleared outside the regen lane |
| 3a | `88220fb0` | Golden harness learns to tell the truth |
| 3b | `7243e31e` | Nineteen engine repairs + the one reviewed regen |
| 4a | `4056cfff` | The store learns to hold a deity |
| 4b | `ffc9d9ac` | One copy registry; shell primitives housebroken |
| 4c | `951f8758` | The front door: shell, landing, trust pages |
| 4d | `ddc33cbf` | Recovery gates, account organs, email consent |
| 4e | `afdeee0b` | The pricing program; dossiers remember their buyers |
| 4f / 4f-2 / 4f-3 | `15da94a0` / `9b092d55` / `e709cc42` | Deity identities; the Realm hub takes the stage |
| 4g | `d037fee3` | The artifact becomes the advertisement (share/SEO loop) |
| 4h | `db8f7305` | The sweeps: one number format, one clone seam, one verb per act |
| 5a | `38a801f9` | Time learns to leap; headers learn to watch |
| **5b** | *(this wave — unstaged)* | **Gate fusion + debt paydown (below)** |

## Wave 5b — what it did

Wave 5b fused the remaining gate mechanics and paid the program's promised debts.
No golden regen exists in this wave — every change is either JSDoc-only, test/CI/
doc/config, or otherwise runtime-inert; **golden output is byte-identical**
throughout (verified against `generatorGoldenMaster` + `goldenViewModel`).

### Adopted from the reference tree

- **e2e webkit install fix** (live defect): CI's `mobile-safari` project is the
  iPhone 13 = **webkit** engine, but CI installed chromium only. Now installs
  `chromium webkit`. (`.github/workflows/ci.yml`)
- **e2e anti-vacuity ratchet**: `scripts/check-e2e-not-vacuous.mjs` +
  `tests/build/e2eNotVacuous.test.js` + CI wiring (static discovery guard +
  runtime "did it actually execute tests" guard, both fail-closed). Closes the
  green-on-nothing hole where an all-skipped project exits 0.
- **`ciCheckParity`**: `tests/build/ciCheckParity.test.js` — pins bidirectional
  parity between the package.json `check` chain and the ci.yml `check` job.
- **Fail-closed Vercel deploy gate**: `scripts/vercel-ignore-build.mjs`
  (`ignoreCommand` in `vercel.json`) + the post-CI `redeploy` Deploy-Hook job,
  **composed with** (not replacing) this tree's CI-native `deploy` job —
  defense-in-depth on the SAME green set. Pinned by a focused
  `tests/build/ciGateHardening.test.js` (decide/skip/proceed logic, fail-closed
  on missing token / network / 4xx / crash / migration drift, + REQUIRED_CHECKS
  ⇔ ci.yml job-name drift guards both directions).

### Kept (this tree's bounds were already tighter)

- **domain-strict ceiling `0`** (ref left `4649` slack) — kept `0`.
- **cycle allowlist = 2** (the two live cycles in this tree) — ref's empty set
  can't be copied without first breaking those cycles.
- **coverage-floors**, **determinism-hostile-locale**, **mutation-sweep** jobs —
  this tree's uniques; retained and folded into the composed gate's
  `REQUIRED_CHECKS` / opt-out markers.
- All shrink-only baselines (raw-button, forked-color `0`, raw-color-literal
  `1546`) verified tight with **no stale entries** (exact-set governance).

### New debts paid

- **Any-cast burn-down** (the wave-5 promise): shared, index-signature-backed
  sim-shape typedefs (`src/domain/worldPulse/pulseShapes.js`) applied to the
  worst offenders. `warDeployment` 89→64, `occupation` 40→28, `tradeWar` 39→19.
  Domain any-cast total **2290 → 2252**; baseline refrozen; CEILING lowered
  2291 → **2252** (monotone-down). Strict-0 preserved, golden byte-identical.
- **Religion soak lane**: `scripts/audit/religion-{balance,soak,coup-soak}.mjs`
  wired into a schedule/manual CI job (off the per-push hot path). Also **fixed a
  live defect** — those scripts imported a moved module (`generators/prng.js` →
  `kernel/prng.js`) and could not run at all.
- **Backup/restore drill**: `scripts/backup-restore-drill.mjs` (safe-by-default
  preflight; refuses to restore over prod) + `docs/RUNBOOK_BACKUP_RESTORE.md`.
- **Phase-6 pull-forwards**: `METRICS_REGISTRY.md` gains **stage + min-n floor +
  method** per metric (pin extended to enforce). Analytics envelopes gain a
  **provenance corpus stamp** `{synthetic|dogfood|production}` at
  `analyticsQueue.buildEnvelope` (synthetic = test/e2e; dogfood via an elevated
  seam; production default) + a provenance pin.
- **ARCHITECTURE.md** worldPulse section refreshed (war/siege/trade-war/religion/
  coup/NPC subsystems named; determinism + the two domain ratchets noted).
- **DEFERRED sweep**: verified **zero** dead DEFERRED markers or orphaned
  test-skips remain — every `DEFERRED` is a live domain comment; every real skip
  is a justified e2e project/env guard.

### Deferred (with reason)

- **First-paint reduction — the two closure-shrinking refactors** are
  deferred as high-risk: (a) splitting `EVENT_REGISTRY` narrate/description prose
  out of the eager validation path, and (b) namespace-level lazy segmentation of
  the copy registry (`en.js` deep-surface namespaces). Both are large refactors
  of the domain event registry / copy loader that risk golden byte-identity and
  warrant a dedicated verifiable pass; the exact seams are mapped in
  `tests/build/vendorPdfLazy.test.js`. Wave 5b DID resolve the **measurement-
  determinism question** (item 2c): two back-to-back builds of a fixed tree
  produce a **byte-identical** closure (1,407,359) — the historical "instability"
  was cross-commit first-paint growth at a sub-3 kB margin, not build
  nondeterminism. The budget therefore **holds at 1,410,000** (tightening it
  without first shrinking the closure would only re-create the pass-then-fail
  bumps); the ratchet-down to ≤1,377,000 is contingent on (a)/(b).
- **Ingest-side corpus persistence**: the client now stamps `corpus`, but
  persisting it server-side needs a `migrations` column (out of wave fence).
- **Enforcing CSP** (`vercel.json` is still `Content-Security-Policy-Report-Only`)
  — a production-behavior change left as an owner decision, out of gate-fusion
  scope.

## Definitive post-merge debt list

1. **First-paint closure reduction** — registry-prose split + copy-namespace
   segmentation, then ratchet `CLOSURE_BUDGET_BYTES` → ≤1,377,000.
2. **Domain any-cast** — 2252 holes remain (ceiling 2252). Next offenders:
   `factionCompetition` (93), `npcAgency` (88), `institutionLifecycle` (81),
   `stressorGates` (78), `relationshipRuleHelpers` (77). The `pulseShapes.js`
   substrate makes these cheap; note `snapshot.worldState`-style non-optional
   access needs care (those two files were reverted in 5b for that reason).
3. **Enforcing CSP** — flip Report-Only → enforcing after validating the policy.
4. **Analytics corpus persistence** — add the ingest column + runtime schema
   check (PHASE6 §5) once a migration slot opens.
5. **Owner human-list items** (NOT code): run the backup/restore drill; confirm
   the support-email destination (`support-email-destination-unconfirmed`); set
   the deploy secrets (`VERCEL_TOKEN` / `GITHUB_CI_STATUS_TOKEN` /
   `VERCEL_DEPLOY_HOOK_URL`) and turn off Vercel push auto-deploy to make CI the
   sole path to production.
6. **`applied-head` currency** — repo head 127 is ahead of prod-applied 117; the
   10 pending migrations must be `db push`'d and the ledger bumped before/at the
   next deploy (the deploy gate now fails closed on this drift).
