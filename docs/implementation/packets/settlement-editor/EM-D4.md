# `settlement-editor / tests-only mode` — EM-D4: THE SURVEYOR BRIDGE (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `4224d03357518aec16a637aa88d6e3c0dcc66fca` — EM-D4: the Surveyor's accepted proposals stage as `addedBy: 'surveyor'` decrees through EM-C1's one writer, and the consent barrier renders as a guard kind's offer
- **Verified base:** `feat/em-d4-surveyor-bridge` at `586949ce3e5a272536ddf2d75ae9e7f21f7f38fb`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-D4-tests-only.md` (judgment 266).

**The charge, in one sentence.** The Surveyor's accepted proposals stage as `addedBy: 'surveyor'` decrees through EM-C1's one writer, and consent renders as a prerequisite guard rather than a sixth guard kind.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `4224d0335` | `814ffa398` | EM-D4: the Surveyor's accepted proposals stage as `addedBy: 'surveyor'` decrees through EM-C1's one writer, and the consent barrier renders as a guard kind's offer |

| action | path |
|---|---|
| MODIFY | `src/components/surveyor/InterpretApplyPanel.jsx` |
| MODIFY | `src/lib/intent/interpretApply.js` |
| TEST | `tests/components/surveyorInterpretApplyPanel.test.jsx` |
| TEST | `tests/lib/interpretApply.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **TS4104** — my first draft introduced was cured by a `readonly unknown[]` annotation, never a cast); ratchet 167/167, domain-strict 1113/1113, any-cast baseline green (no new `src/domain` line). `npx eslint` clean.

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/components/surveyorInterpretApplyPanel.test.jsx tests/lib/interpretApply.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-d4-surveyor-bridge`, built at `814ffa398`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35872816716`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `4224d0335`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

Its declared phone-chrome floor row (shell, +1) was NOT re-recorded on this branch: judgment 271 composes it ONCE at the train tip with EM-D1's and EM-E3's rows (U25, done at `56b085fc5`).
