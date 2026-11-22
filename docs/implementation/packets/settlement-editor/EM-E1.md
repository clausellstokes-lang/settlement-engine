# `settlement-editor / tests-only mode` — EM-E1: THE TICK HOOK (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `76e54857e2eab97278142444b718d64d8d727a98` — EM-E1 (cure): the raw NUL in advanceInterval.js removed; the observed-shape reads STOP on a measured ordering contradiction
- **Verified base:** `feat/em-e1-tick-hook` at `586949ce3e5a272536ddf2d75ae9e7f21f7f38fb`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-E1-tests-only.md` (the charter's Wave 3 row; EM-C1's registry in the tree).

**The charge, in one sentence.** `applyDecreesAtTick` at the head of the pulse, taking no draw and moving no golden, its receipt carried across the ring collapse; the undo path retracts a tick's decrees inside the snapshot-restore chokepoint.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `2148a796e` | `302b225da` | EM-E1: the tick hook applies the DM's decrees at the head of the pulse, taking no draw and moving no golden |
| `b880d3c56` | `e4a596e6e` | EM-E1 (undo): retractDecreesOfTick wired into the pulse's snapshot restore |
| `76e54857e` | `0d68ff027` | EM-E1 (cure): the raw NUL in advanceInterval.js removed; the observed-shape reads STOP on a measured ordering contradiction |

| action | path |
|---|---|
| MODIFY | `src/domain/worldPulse/advanceInterval.js` |
| CREATE | `src/domain/worldPulse/decreeHook.js` |
| MODIFY | `src/domain/worldPulse/pulseKernel.js` |
| MODIFY | `src/store/campaignWorldPulseDeferred.js` |
| TEST | `tests/lint/couplingInclusion.walker.test.js` |
| TEST | `tests/lint/newsAuthoringCensus.shared.mjs` |
| TEST | `tests/lint/wizardNewsAuthoring.walker.test.js` |
| CREATE | `tests/simulation/decreeTick.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **E1-1** — a due decree applies at the head of the pulse as a cause, in orderIndex order, and its entry is markApplied with this tick's tickRef
- **E1-2** — zero decrees leave the pulse record byte-identical — the key roster and its order are the witness's own bytes
- **E1-3** — the hook consumes NO PRNG — the tick's whole simulation is byte-identical with and without a decree
- **E1-4** — the rewind restores the registry with every later-staged entry re-appended, and retractDecreesOfTick returns that tick's entries to pending
- **E1-5** — a `when` in the future is untouched by an earlier tick, and the registry comes back by reference
- **E1-6** — the interval orchestrator advances `when`-due entries per interval — each applies exactly once, and its receipt survives the ring collapse
- **E1-7** — retraction is the EXACT inverse of application — the round trip returns the serialized registry unchanged
- **E1-8** — the leaf takes no draw, reads no clock, and imports only the registry and the pulse helpers
- **E1-4b** — a later-staged entry the snapshot never held comes back PENDING, so no rewind leaves an applied ghost — the stale-stamp half, at the leaf, naming the two production paths that reach it (the proposal ring restored over a later advance, and R-5b's parked pre-INT

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/lint/couplingInclusion.walker.test.js tests/lint/wizardNewsAuthoring.walker.test.js tests/simulation/decreeTick.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-e1-tick-hook`, built at `302b225da`, `e4a596e6e`, `0d68ff027`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (runs `35876513319`, `35883800275`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `2148a796e`, `b880d3c56`, `76e54857e`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

Two slots stand open on it: `PULSE_UNDO_CAP` is not exported (U8), and the tick's roster write reaches the ACTIVE view and the active save only (U48, U49 — EM-E8's notices).
