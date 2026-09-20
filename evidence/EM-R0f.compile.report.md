# EM-R0f — COMPILE REPORT (Opus COMPILE lane, session a9df403c, 2026-09-20)

## Outcome

**DRAFT, READY-able in one pass, with six questions for the chair** — none of which blocks compiling, one of which qualifies a clause of the charter (Q1). No premise is refuted; the packet is not BLOCKED.

The move is small, closed and provably invisible: **44 effective production lines across 4 handwritten files**, against caps of 400 and 12 and against the launch brief's small-member threshold of 120 / 5. The golden-neutrality proof is **executed, not argued**.

## Files (all COPIES in this lane's scratch; the chair validates, pre-proofs and places)

```
/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-em-compile-EM-R0f-scratch/
  EM-R0f.md                        the packet, twelve sections + §0 and §13
  EM-R0f.manifest.json             5 changeManifest rows, 14 requiredSymbols, 4 retiredSymbols, 5 acceptanceCases, 8 checks
  EM-R0f.evidence.md               every command with its output
  EM-R0f.compile.report.md         this file
  golden-neutrality-probe.mjs      the 525-row acceptance probe (plain node, 8 s)
  closure-probe.mjs                worker / eager / main-graph closures
  build-sim.mjs                    reconstructs the post-move pair from the tip's own bytes (10 text guards)
  budget-probe.mjs                 effective lines + verbatim/absence checks (eslint Linter)
  economyFingerprint.candidate.mjs the verbatim candidate used by the first probe run
  sim/before|after/...             the simulated trees the budget and tuning probes measured
```

## The tip

`$SP/read-tip-141a1d775`, detached at **`141a1d775`**; `git status --short` **empty at start and at close**. Preamble SHA-256 **`16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195`** — re-measured, matches the launch brief.

## The measurements that shape the contract

**The consumer census — denominator 5 of 5** (`git grep -n 'fingerprintPowerEconomyInput' HEAD -- src tests scripts`; whole-repo without a pathspec is also 5): the declaration at `economyReconciliation.js:100`, its two in-file callers at `:171` and `:358`, and two rows in `tests/generators/powerEconomyFreshness.test.js` (`:18` import, `:156` call). ⇒ **one external importer**, re-pointed in the same commit ⇒ **no re-export stub is owed**.

**The cluster is closed.** `economyProjectionInput` and `ECONOMY_FINGERPRINT_VERSION` are read *only* inside the moved function (repo-wide 2 and 3 occurrences, all accounted). `fnv1a32` is used only at `:109`, so its import moves with it. The body imports **nothing** from `src/generators` or `src/domain` — the launch brief's split-ruling condition does not fire.

**The new home is lawful, measured twice.** `eslint.config.js:859-877`'s `src/data/**` `no-restricted-imports` bans only `generators`/`store`/`lib`/`kernel/prng*`/`kernel/rngContext*`; `kernel/proseHash.js` matches none, and `src/data/historyData.js` and `src/data/npcData.js` already import it. Its paired enforcer `tests/domain/dataPurity.test.js` has exactly three arms and **none forbids an exported function in `src/data`** — where **16 of 57** files already export one.

**Golden neutrality — the packet's own acceptance case, EXECUTED.**
```
corpus rows = 525            disagreements = 0
distinct fingerprints = 35   distinct fingerprint INPUTS = 35
SHA-256 (PRE, current home)         = 318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18
SHA-256 (POST, the real moved leaf) = 318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18
SHA-256 (STAMP, as the pipeline writes it) = 318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18
```
Run twice — once against a verbatim candidate, once against the actual generated leaf resolving the tree's own kernel. **`318fb81a…618e18` is the figure the build lane reproduces.**

**Verbatim fidelity.** `build-sim.mjs` rebuilds the post-move pair from the tip's bytes and refuses unless ten text guards match. All three moved chunks are byte-identical in the new leaf; all three are absent from the remainder; the remainder no longer exports the function, imports it instead, and no longer imports `fnv1a32`. Linter posture (in-process API): **0 messages** on both files.

## Budget

| Measure | Cap | Measured |
|---|---:|---:|
| Handwritten files | 12 | **4** |
| New/changed effective production lines | 400 | **44** |
| New leaf `src/data/economyFingerprint.js` | 250 | **22** |
| `economyReconciliation.js` | — | 280 → **259** (−21) |
| New logic leaves | 2 | **1** |
| Existing logic files modified | 3 | **1** |
| Acceptance cases | 8 | **5** |

## The byte budgets

| Budget | Membership | Headroom | Verdict |
|---|---|---|---|
| Generation worker | **IN** (closure 220 src modules static / 228 with dynamic) | `WORKER_BUNDLE_CEILING_BYTES = 1401208`, **zero slack** | **CARRIED** — TEST row, bound ≤184 B, re-mint only on a measured rise |
| Lazy engine | **IN** (reachable from `main.jsx` at 1,958 modules; absent from the 243 static and the 268 eager) | `< 679_000`; last recorded 677,935 + 184 = 678,119, + the kept ~700 B margin = **678,819** | **FITS**, ~181 B spare — near-full; an overshoot is a STOP |
| Eager first paint | ⛔ **OUT** — `EAGER_FIRST_PAINT_MODULES` (268, imported from vite's own export) does not hold `economyReconciliation.js` | — | **0 B of first-paint cost** |
| Edge-shared metas | ⛔ **OUT** — 0 input hits across all five (114/74/115/2/2) | — | no `build:edge-shared`; §P2 row 12's seven-path hazard does not arise |

**esbuild 0.28.1 per-module:** 4,603 → 4,246 + 449 = 4,695, **+92 B**. Pure module-boundary overhead; rollup's scope hoisting normally renders less. Bound to the build lane: **≤184 B** (×2, EM-P3's precedent form).

## Registers — every one measured, none owed

Lighting **delta 0/0/0/0/0** (no test file created or renamed, no `describe`/`it` added or removed; the baseline stores five integers and no title text). Tuning register **UNCHANGED, executed both ways** by its own counters (`{economyReconciliation.js: 2}`, sites `POWER_INTENT_VERSION` + `POWER_PROJECTION_VERSION`, before and after; the moved version const is a *string* and `16`/`8` are *integers*; `TREES_P2P3` excludes `src/data` and the new leaf scores 0 even when forced in). Observed-shape **not owed** — the three tree manifests are frozen at `31ab5d18b`, and EM-P3's landing is the executed precedent (it modified a generator, created a `src/data` leaf, named the baseline nowhere, and that leaf is absent from all three trees). Writer-reach, prose-numerics, wiring-census `stamp.files`, `path:line` citations, mutation-coverage: **all zero hits**. Entropy-root census **survives** — its MANDATORY live control NC-1 *is* this file, but it asserts by `toContain` on two strings outside the moved region (`grep -c` → 1 each on the simulated remainder).

**Cross-packet:** `EP-0` (LANDED) holds the only `requiredSymbols` row on this path, naming NC-1's text — **discharged by construction**. The only collision hit across 193 entries is `EM-P3` on `generationWorkerLazy.test.js`, and LANDED does not reserve (`TERMINAL_PACKET_STATUSES` at `implementation-packets.mjs:43`, `:676`). **Collision group EMPTY.**

**Manifest integrity, executed:** 14 `requiredSymbols` + 4 `retiredSymbols`, **zero rows in both sets**, every one of the 19 strings present **exactly once** at `141a1d775`; §7's table and the JSON `changeManifest` are set-equal at 5 `(action, path)` rows; every action is in `PACKET_ACTIONS`.

## The six questions (full text and recommendations in the packet's §13)

1. ⭐ **The frozen set does not shrink — it is unchanged.** Zero rows retire; EM-R0f is PREVENTIVE, not burndown. *Recommend: accept, and re-cut the charter's clause.*
2. **Does the header correction tighten the cardinality arm** from `<= 6` to `<= 5`? *Recommend: yes — a shrink of a shrink-only ratchet, with the measurement as its receipt.*
3. **Do the dist-gated byte arms belong in `checks`?** *Recommend: no — a skipped arm on a zero-slack ceiling is the false green §P2 row 11 names; the build + `VERIFY_DIST=1` is the proof.*
4. **Is `ECONOMY_FINGERPRINT_VERSION` exported?** *Recommend: no — nothing reads it; R0c exports it when it needs it.*
5. **Does EM-R0c's row need the new address now?** *Recommend: one line in R0c's §5.*
6. **Does ODQ §934.19 addendum 2's standing conditional ruling cover EM-R0f's ≤184 B re-mint,** as it covered EM-P3's +80 B?

## ⛔ Noticed and NOT touched — each specific enough to slot

1. **`tests/build/domainGeneratorsBoundary.test.js` is not enumerated by the mutation register.** `scripts/mutation-coverage-manifest.json` has no `invariants` entry for it, yet it is a correctness-asserting architecture ratchet with three arms. Either `tests/lint/mutationCoverage.shared.mjs`'s enumeration rule deliberately excludes `tests/build/**`, or this is a gap in the register's population. **Slot:** a one-line measurement of `enumerateInvariants`' directory scope against `tests/build/**`, and a `rationale` row or an enumeration widening, whichever the measurement supports.
2. **`scripts/mutation-coverage-manifest.json:829` carries stale prose.** Its rationale for `tests/generators/powerEconomyFreshness.test.js` still reads *"the mutation target src/generators/power/economyReconciliation.js is a new module not yet committed, and check_caught reverts with 'git checkout -- <file>', which cannot restore an uncommitted file"*. The module has been committed for months, so the stated sweep-safety reason no longer holds and the `rationale` may now be upgradeable to a real `mutation` row. **Slot:** a rationale re-measurement, ideally in the same hand that answers item 1.
3. **The cardinality arm's one unit of slack** (`toBeLessThanOrEqual(6)` against a live 5) is a standing invitation for exactly one new `src/domain → src/generators` edge to pass that arm. The per-file arm still reds it, so it is defence-in-depth slack rather than a hole — but it is slack in a guard whose own header says the set can only shrink. Folded into **Q2**; if the chair rules "prose only", this stays open and wants its own slot.
4. **`tests/build/domainGeneratorsBoundary.test.js:9`'s "~22.7k LOC" is stale by roughly eight-fold** — `src/domain/worldPulse` measures **183,678 lines across 443 files** at `141a1d775`. Covered by this packet's §6.4 item 1, but worth noting that the same figure may be quoted in other headers: **slot** a `git grep -n '22.7k\|22,700'` sweep across `src/`, `tests/` and `docs/`.
5. **The lazy-engine budget has ~181 B of effective headroom after this packet's bound** (679,000 − 677,935 − 184 − the kept ~700 B cross-environment margin). That is the tightest of the four budgets and the next member that lands any generator byte will hit it. **Slot:** a headroom hunt in the engine chunk before EM-R0c (294 effective lines in two leaves) is dispatched, or an explicit chair decision to spend the margin.
6. **`src/data/` holds a `src/data → src/domain` edge:** `src/data/dossierStateProse/economy.generated.js:6` imports `ECONOMY_FRESHNESS_SENTENCES` from `../../domain/display/economyFreshness.js`. `tests/domain/dataPurity.test.js`'s `FORBIDDEN` regex covers `generators|store|lib` only, so a data-layer import of the domain is unguarded. It is a *generated* file and may be deliberate, but the purity rule's own prose says the data layer holds "only fields". **Slot:** a one-command census (`git grep -n "domain/" -- src/data`) and a ruling on whether `domain` joins the banned group or the generated file earns a declared exemption.
7. **The observed-shape scanner resolves only 9,766 of 128,176 reads** (`scanStats`: 118,410 unresolved). That is a 7.6 % resolution rate on the register that is supposed to make reader-without-a-writer identities visible. It did not affect this packet (which adds no tracked shape read), but a register that cannot classify 92 % of what it sees is worth a measured note. **Slot:** a report-only arm printing the unresolved population by shape prefix, so the chair can see whether the gap is one missing shape or a thousand.
8. **`vite.config.js`'s `EAGER_FIRST_PAINT_MODULES` is exported for tests, and the compile lanes now import it** (this lane did, and EM-B1k2's did). It is annotated `@consumed-by tests/build/vendorPdfLazy.test.js` only. **Slot:** widen that annotation to name the budget pricing lanes, so a future hand does not "clean up" an export it believes has one consumer.

Every claim in this report and in `EM-R0f.evidence.md` is **CONFIRMED** (a quoted command and its output) except two, both labelled in place: the lazy engine's current size (677,935 B is EM-P3's recorded measurement, **PLAUSIBLE** at `141a1d775` until a real build re-measures it) and the +92 B rendered delta (an esbuild per-module **estimate**, which the build lane replaces with rollup's real figure).
