# `settlement-editor / tests-only mode` — EM-D2: THE FONT-COVERAGE CHECK (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `2586a6e75f34284b87ba225fb80725530ef048f6` — EM-D2: the two new test files drop the invariant word from their basenames
- **Verified base:** `feat/em-d2-font-coverage` at `51384b364ddd7adea37f0d4d8e7d5452dd7c874a`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-D2-tests-only.md` (the charter's Wave 4 EM-D2 row, the remainder).

**The charge, in one sentence.** A cmap reader over the eight faces the dossier ships, injected and importing nothing, so a free field can report the characters the printed dossier cannot draw.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `490175ee0` | `aecb284fa` | EM-D2: the font-coverage check reports the characters the printed dossier cannot draw |
| `2586a6e75` | `3f924796d` | EM-D2: the two new test files drop the invariant word from their basenames |

| action | path |
|---|---|
| MODIFY | `src/components/edit/FreeField.jsx` |
| CREATE | `src/pdf/lib/fontCoverage.js` |
| CREATE | `tests/components/freeFieldGlyphs.test.jsx` |
| CREATE | `tests/pdf/fontCmap.test.js` |

Superseded inside this member (created and then renamed or removed by its own later commit, so the manifest carries only what stands in the tree): `tests/components/freeFieldCoverage.test.jsx`, `tests/pdf/fontCoverage.test.js`.


## §9 — The acceptance cases, by title, as the commits record them

- **C1** — the eight declared faces ARE the eight TTFs public/fonts ships, and every one reads
- **C2** — the reader agrees with fontkit on every face, and differs by exactly the structural U+FFFF
- **C3** — a family set is the INTERSECTION over its faces, and the two families genuinely differ
- **C4** — a format-12 subtable is read, over a SYNTHETIC face assembled byte by byte
- **C5** — coverageOf reports every uncovered OCCURRENCE with its UTF-16 index, in the text order
- **C6** — a fully covered text reports nothing, so the report measures the text and not the call
- **C7** — coverageOf FAILS OPEN: with no coverage loaded it reports nothing rather than everything
- **C8** — loadFamilyCoverage reads ON DEMAND through the INJECTED reader, once per face
- **C9** — fetchFace asks for the SERVED path and refuses a response that is not ok
- **C10** — a face that cannot be read THROWS, so a failed read never reads as a broken alphabet
- **C11** — the reason this reader was WRITTEN stays true: the estate declares no font parser of its own

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/components/freeFieldGlyphs.test.jsx tests/pdf/fontCmap.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-d2-font-coverage`, built at `aecb284fa`, `3f924796d`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35876591684`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `490175ee0`, `2586a6e75`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

A THIRD pick rode this merge that is not this member's code: the chair's docs commit `19a27222d` (train) annotating EM-D0e's requiredSymbols[5] `retiredBy` — this member's coverage prop widened FreeField's landed signature line (judgment 269, rule 39's first addendum). Its two new test files were RENAMED off the mutation manifest's enrolment pattern by its own second commit; the old paths are recorded above and stand nowhere in the tree. U7/U7b stay open: `edit.field.uncovered` is in `en.js`, and A7's DECLARED_KEYS row belongs to the commit that makes FreeField READ it.
