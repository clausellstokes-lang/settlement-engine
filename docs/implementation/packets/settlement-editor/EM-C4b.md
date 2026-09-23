# `settlement-editor / tests-only mode` — EM-C4b: THE STORE'S REGISTRY HALF (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `c64d0808bd7aa5066269dfa38b08cffd57438477` — EM-C4b: the store's registry half joins the plain-edit half on EM-C4a's one leaf, with judgment 264's dialog binder
- **Verified base:** `feat/em-c4b-store-registry` at `586949ce3e5a272536ddf2d75ae9e7f21f7f38fb`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** the COMPILED PACKET `EM-C4b` in the chair kit's `packets-waiting/` (judgment 263).

**The charge, in one sentence.** The six registry actions reach EM-C1's pure verbs through EM-C4a's ONE adapter, with judgment 264's `applyPlainEditIntent` binder; saves already carry `decrees`, so no persisted shape is written.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `c64d0808b` | `60e8af08d` | EM-C4b: the store's registry half joins the plain-edit half on EM-C4a's one leaf, with judgment 264's dialog binder |

| action | path |
|---|---|
| MODIFY | `src/store/editSlice.js` |
| TEST | `tests/lint/editMutationPath.walker.test.js` |
| TEST | `tests/store/editSlice.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **A1** — MAIN (six actions -> six pure verbs, the stored registry IS the returned array, DECREE_ACTIONS set-equal both ways to the module's own six verbs, both sides derived)
- **A2** — DORMANT (a read materializes no key, the shared frozen empty registry, `decree` a member, EMPTY_RULE_SET answers `{guards:[],unevaluated:[]}`)
- **A3** — COUNTERFORCE (a foreign save refuses no_save, settlement byte-identical; a CANON save is the paired positive control and APPLIES)
- **A4** — BOUNDARY (§20.3's reason, the op and the orderIndex kept; a NEW array; the input rows unmutated; a malformed reason written by nobody)
- **A5** — IDEMPOTENCY (the memo on three handles; each change re-evaluates; every kind in GUARD_KINDS, every offer in GUARD_OFFERS; an under-supplied rule NAMED unevaluated)
- **A6** — LIFECYCLE (the rewind takes the RESTORED entry on a shared id, re-appends the later entry, moves no orderIndex)
- **A7** — THE BINDER (judgment 264: the intent reaches the writer through the one adapter with the executor's receipt APPLIED and exactly one plain-edit kind in the live registry; the draft carries the edit at the minted root key; a canon intent surfaces `canon_locked`,

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/lint/editMutationPath.walker.test.js tests/store/editSlice.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-c4b-store-registry`, built at `60e8af08d`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions. The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `c64d0808b`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.
