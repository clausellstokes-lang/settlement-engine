# `settlement-editor / tests-only mode` — EM-E3: THE ADVANCE REPORT (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `c6340722cc8236a4debb2dbf9b8b3ae5f83bf949` — EM-E3 (cure): the registry page stays dark and the enforced-by citation resolves
- **Verified base:** `feat/em-e3-advance-report` at `38552f4e4edb55fa6b2bd36ee059e4a01cf228ca`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-E3-tests-only.md` (the charter's Wave 4 row).

**The charge, in one sentence.** The advance report names the orders a tick carried out and the delta card names the DM's own fields; a tick that applied no decree renders exactly what it rendered before.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `0b0c5082c` | `1fc5ec325` | EM-E3: the advance report names the orders a tick carried out, and the delta card names the DM's own fields |
| `c6340722c` | `91fc471e4` | EM-E3 (cure): the registry page stays dark and the enforced-by citation resolves |

| action | path |
|---|---|
| MODIFY | `src/components/map/AdvanceReport.jsx` |
| MODIFY | `src/components/primitives/RegenerationDeltaCard.jsx` |
| CREATE | `tests/components/advanceReportDecrees.test.jsx` |

## §9 — The acceptance cases, by title, as the commits record them

- **E3-1** — a tick that applied no decree renders the report it rendered before — no section, no wrapper, no node
- **E3-2** — N decrees render N cause rows in orderIndex order, each with its chronicle link [RED-FIRST]
- **E3-3** — a mount with no chronicle routing reports the cause and offers no dead link [RED-FIRST]
- **E3-4** — an off-stage cause wears its marker and a cause with no save names nobody [RED-FIRST]
- **E3-5** — each provenance group in dmFields renders with its own count, name and transition [RED-FIRST]
- **E3-6** — an empty partition renders neither section, and an absent one is the same silence
- **E3-7** — a DM field is not a change the world made, so it does not open the card by itself

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/components/advanceReportDecrees.test.jsx`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-e3-advance-report`, built at `1fc5ec325`, `91fc471e4`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (runs `35888172909`, `35893813178`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `0b0c5082c`, `c6340722c`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

Its two declared phone rows (/realm and /map, 484 to 485) were composed with EM-D1's and EM-D4's into ONE re-record at the train tip (U25, `56b085fc5`; judgment 271). `HeraldBody.jsx:156` passes no chronicle href, so its decree-cause links stay dark until EM-D3c wires them (U43).
