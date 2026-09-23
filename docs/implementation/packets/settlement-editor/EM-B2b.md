# `settlement-editor / tests-only mode` — EM-B2b: WORLD FACTS BY CONSEQUENCE (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `24bf8ccc8fbce6a06651c708efdc57155eab256c` — EM-B2b: a world fact is ROUTED by its declaration's provenance into config′ and re-derived, and the delta names the DM's fields
- **Verified base:** `feat/em-b2b-world-facts` at `25f54664983d4c00f61c1d7b6e8f7c5c15e214ee`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** the COMPILED PACKET `EM-B2b` version 5 in the chair kit's `packets-waiting/` (judgments 241 and 244).

**The charge, in one sentence.** A world-fact edit is ROUTED by its declaration's `provenance` into `config′` at the declared `inputKey` and re-derived; the regeneration delta names the DM's own fields.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `24bf8ccc8` | `0e27ed73b` | EM-B2b: a world fact is ROUTED by its declaration's provenance into config′ and re-derived, and the delta names the DM's fields |

| action | path |
|---|---|
| MODIFY | `src/domain/edit/dmLayer.js` |
| MODIFY | `src/domain/edit/fieldDeclarations.js` |
| MODIFY | `src/domain/edit/types.js` |
| MODIFY | `src/domain/regenerationDelta.js` |
| TEST | `tests/domain/editDeclarations.test.js` |
| TEST | `tests/domain/regenerationDelta.test.js` |
| CREATE | `tests/domain/worldFactRederive.test.js` |
| TEST | `tests/lint/editDeclarations.walker.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **A1** — the DIFFERENCE between two re-derivations — the DM's terrain stands at the fact's own DECLARED leaf (`record.config.terrainType`, read from GENERATION_TIER1's recordPath, not typed) on 63/63 census rows, and where the coast is NEW the two re-derivations differ
- **A2** — dormant and absent — no world-fact root re-derives exactly as today, and a layer whose inert `worldFacts` bag is NON-EMPTY is byte-identical to the same layer with it empty
- **A3** — no silent fallback — the undeclared key and the out-of-set value THROW; a consult with no option-set member REFUSES every world fact and the run is the one with no world fact at all; a wired-but-broken vocabulary throws
- **A4** — the stated blast radius is COMPLETE — the culture reader set under src/generators, exact in both directions
- **A5** — idempotency and purity — three identical config′ re-derives byte-identical WITH the DM's fact at its leaf in all three; record, config and layer unmutated
- **A6** — the delta partitions by provenance (tests/domain/regenerationDelta.test.js)
- **A7** — the goldens cannot see any of it — both fixtures byte-identical by SHA-256 (7177cd6e…8f1e, 88983938…4084) and a no-layer re-derivation is still the committed golden
- **A8** — the vocabulary is joined to its producer, both directions (tests/lint/editDeclarations.walker.test.js)

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/domain/editDeclarations.test.js tests/domain/regenerationDelta.test.js tests/domain/worldFactRederive.test.js tests/lint/editDeclarations.walker.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-b2b-world-facts`, built at `0e27ed73b`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions. The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `24bf8ccc8`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

EM-B2b2 is this member's second unit: the resources world fact reaches its DECLARED leaf (U38, carried 1/63 to 63/63).
