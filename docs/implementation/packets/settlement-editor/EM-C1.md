# `settlement-editor / tests-only mode` — EM-C1: THE DECREE REGISTRY (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `e891a1ed4d104244d2f31e6a7bf29be8c690ce30` — EM-C1: the decree registry lands DARK as the estate's one pure writer of `decrees`
- **Verified base:** `feat/em-c1-registry` at `51384b364ddd7adea37f0d4d8e7d5452dd7c874a`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** the COMPILED PACKET `EM-C1` in the chair kit's `packets-waiting/` (rule 39: a compiled packet is a BRIEF), version 1 to the charter's default — no per-tick cap (judgment 258, vetoable).

**The charge, in one sentence.** ARCH §1's six verbs over a frozen registry, design §20.3's pure `resolveDecree`, the reading order and four frozen vocabularies — the estate's one pure writer of `decrees`, landing DARK.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `e891a1ed4` | `586949ce3` | EM-C1: the decree registry lands DARK as the estate's one pure writer of `decrees` |

| action | path |
|---|---|
| CREATE | `src/domain/edit/registry.js` |
| CREATE | `tests/domain/decreeRegistry.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **A1** — EM-C1: the four vocabularies are frozen and closed, the reading order is design 11s, and every verb returns a NEW frozen registry that leaves its input untouched
- **A2** — EM-C1: stage appends one pending entry at the next index, writes only the six required keys plus what the caller supplied, and refuses five malformed calls without throwing
- **A3** — EM-C1: reorder permutes the PENDING entries over the index values they already occupy, so an applied entry never loses its place, and an unknown id, a non-finite target and an applied entry are each a no-op
- **A4** — EM-C1: withdraw and reopen touch PENDING entries only, the withdrawn row is kept with its original words and its index, and withdrawnReason is written ONLY for design 20.3s exact shape
- **A5** — EM-C1: markApplied moves a pending entry to applied with the callers stamps, writes chronicleRef only when it is supplied, keeps the index, and never re-applies
- **A6** — EM-C1: revertTick re-appends every entry staged after the tick onto the restored snapshot, loses nothing, reorders nothing, and lets the RESTORED entry win an id that is in both
- **A7** — EM-C1: resolveDecree answers ok for all 22 live op types, names op-type on a retired type and pool-value on a moved word, is stable, never throws, and reaches exactly two of the five declared missing kinds at this tip
- **A8** — EM-C1: every op type NAMES the catalogues its payload points into, the two spec kinds that carry a vocabulary are exactly the two the leaf spells, and the leaf imports one module and is imported by none

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/domain/decreeRegistry.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-c1-registry`, built at `586949ce3`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions. The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `e891a1ed4`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.
