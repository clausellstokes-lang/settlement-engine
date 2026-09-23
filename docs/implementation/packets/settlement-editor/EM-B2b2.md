# `settlement-editor / tests-only mode` — EM-B2b2: THE DM'S WORLD-FACT WORD SURVIVES THE RESOLVER (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `dde845c15294aeab61d13f5d4336cdcc1770aaf5` — EM-B2b2: the DM's nearby-resources word survives resolveResources
- **Verified base:** `feat/em-b2b2-resources-pin` at `795d2a582242d4d9bc6ade7b474d35e6b6834618`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-B2b2-tests-only.md` (U38 and U39, from EM-R7 v2's A2 measurement).

**The charge, in one sentence.** `resolveResources` honours an authored roster on `config′` instead of overwriting its own input key, carrying the declared leaf 1/63 → 63/63; a provenance flag on `config′` was REFUSED as a persisted-shape change.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `dde845c15` | `a7ecd644e` | EM-B2b2: the DM's nearby-resources word survives resolveResources |

| action | path |
|---|---|
| MODIFY | `src/generators/steps/resolveResources.js` |
| CREATE | `tests/domain/editWorldFactResources.test.js` |
| TEST | `tests/domain/worldFactRederive.test.js` |
| REGISTER | `tests/lint/.prose-numerics-baseline.json` |

## §9 — The acceptance cases, by title, as the commits record them

- **A1** — the DM's roster stands at its own declared leaf - byte-equal on rows 0/21/42 and carried on 63 of 63 census rows (1 at the base)
- **A2** — the no-edit path is unmoved - byte-identical to the PRE-CHANGE step's own output, captured by copy, never re-recorded
- **A3** — the regeneration delta names the resources row and its dmValue is the value standing at the leaf, 3 of 3
- **A4** — a roster outside RESOURCE_DATA is still refused by EM-B2b's own throw
- **A6** — the mark is NOT the echo - a replay from the resolved `record.config` is byte-identical to the pre-change replay on all three rows
- **A5** — U39 STOPS on its own row - no GENERATION_TIER1 pair resolves to `record.config.monsterThreat`, so the narrowing has no shape at this base
- **A9** — (worldFactRederive.test.js) the route is TOTAL over all five facts, each at its own declared outputKey: terrain 3 / culture 3 / monsterThreat 3 / stressors 3 / resources 3

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/domain/editWorldFactResources.test.js tests/domain/worldFactRederive.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-b2b2-resources-pin`, built at `a7ecd644e`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35892227226`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `dde845c15`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

ITS RISE WAS DECLARED AND BOUGHT BACK. CI measured generation.worker at 1,391,472 B against the zero-slack ceiling 1,391,327 B (+145 B); a rise is never a lane's edit, so it was recorded as bytes OWED (U2) and cleared by the worker buy-back row 10, which lowered the ceiling to the cured measurement 1,391,256 B. U39 STOPPED BY MEASUREMENT: `monsterThreat`'s tier-1 has no sub-path shape, and arm A5 pins the measurement so it reds when one appears.
