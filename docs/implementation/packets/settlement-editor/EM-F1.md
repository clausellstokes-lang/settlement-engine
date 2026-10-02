# `settlement-editor / tests-only mode` — EM-F1: PHANTOMS AS HIDDEN SAVES (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `795d2a582242d4d9bc6ade7b474d35e6b6834618` — EM-F1: a phantom counterparty is a hidden save, and the off-stage resolver reads its reality
- **Verified base:** `feat/em-f1-phantoms` at `a5badf679b40b7110b7264a85f50cfd597f977c1`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-F1-tests-only.md` (judgment 261: the phantom record is LAUNCH SHAPE).

**The charge, in one sentence.** An off-stage counterparty is a hidden save on the blob: the minted record, the back-link resolver and the shelf filter that keeps it off the library.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `795d2a582` | `5022eeca3` | EM-F1: a phantom counterparty is a hidden save, and the off-stage resolver reads its reality |

| action | path |
|---|---|
| MODIFY | `src/components/library/LibraryToolbar.jsx` |
| CREATE | `src/domain/edit/phantoms.js` |
| CREATE | `tests/domain/phantoms.test.js` |
| CREATE | `tests/store/phantomSaves.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **A1** — the minted record carries EXACTLY the declared keys, frozen, and not one more
- **A2** — the same seed and index mint the same record forever, and a different seed or index a different one
- **A3** — every declared trait pool is a LIVE pool id and every rolled trait is a member of its own pool
- **A4** — a malformed argument, an unusable tool bag or a producer that throws all answer null, never a partial record
- **A5** — the discriminant is read in one place, over a record and over a save row alike
- **A6** — an unreal counterparty admits the record-only consequence and a saved settlement admits the world
- **A7** — the badge and the policy are ONE fact read twice, in both directions
- **A8** — each off-stage op touches the home procedures and the record only — the world comes back by identity, byte-identical
- **A9** — the chronicle mark rides every off-stage act, naming the counterparty and carrying the outcome only when the op declares one
- **A10** — every off-stage row in the catalogue is one this resolver answers for, and the four the charter names are among them
- **A11** — the runtime import list is EMPTY, no clock is read and no draw is taken
- **A12** — the leafs importer roster under src is EXACT, in both directions — the library shelf and nothing else
- **B1** — the minted record survives save, list, writeAll and list byte-exact, and the envelope gains no column
- **B2** — the neighbour back-link resolves a phantom EXACTLY as it resolves a save, with no change to the linker
- **B3** — the shelf hides the phantom and shows every other save exactly as it does today
- **B4** — every other save shows exactly as it did before, chip for chip

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/domain/phantoms.test.js tests/store/phantomSaves.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-f1-phantoms`, built at `5022eeca3`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35878167406`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `795d2a582`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

Its own observed-shape row (`phantoms.js` reading `kind on settlement`) was DECLARED at the merge and admitted by the schema-23 rung (U37), not cured on the branch.
