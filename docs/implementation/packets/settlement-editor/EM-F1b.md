# `settlement-editor / tests-only mode` — EM-F1b: A PHANTOM DOES NOT SPEND A SAVE SLOT (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `c5145435eac26f1dcbb9988120844aeffeeb255e` — EM-F1b: a hidden phantom no longer spends a save slot — the quota count excludes it in the ONE place it is computed
- **Verified base:** `feat/em-f1b-phantom-quota` at `5022eeca3720ef40e84caf2cb6f6f37d2adcf738`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-F1b-tests-only.md` — THE OWNER'S DECISION of 2026-09-23 ~11:1x (U21).

**The charge, in one sentence.** `activeSaveCount` counts a row iff it is active AND not a phantom — the discriminant spelled, not imported — in the ONE place the quota is computed.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `c5145435e` | `f82f3e8fd` | EM-F1b: a hidden phantom no longer spends a save slot — the quota count excludes it in the ONE place it is computed |

| action | path |
|---|---|
| MODIFY | `src/lib/saveAccess.js` |
| CREATE | `tests/store/phantomQuota.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **F1** — three real saves plus two phantoms read as THREE toward a maxSaves-3 tier, and the fourth real save is refused as today
- **F2** — a tier with maxSaves Infinity is untouched — every premium figure is identical with the phantoms present and absent
- **F3** — the quota meter reads THREE OF THREE, and the account cards unclamped "N / 3" is the sentence that would have lied
- **F4** — no tier fact moved — the gates caps and the free save limit are the values they were
- **F5** — the two spellings of the discriminant are ONE word, and the two predicates agree row for row
- **F6** — the quota counters importer roster under src is EXACT, and the three raw-length siblings are a closed census
- **F7** — the F42 BOUNDARY — a metadata-projected row has no blob to read, and nothing under src reads that projection today

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/store/phantomQuota.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-f1b-phantom-quota`, built at `f82f3e8fd`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35883377727`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `c5145435e`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

THE OWNER DECIDED THIS. 2026-09-23 ~11:1x, on the chair's recommendation: *"I support both of these"* (U21). The server half stays the owner's keystrokes: `supabaseCount()` still filters on `access_state` alone, so the configured backend counts a phantom toward the third-save pricing moment (U32, owner-gated with U14).
