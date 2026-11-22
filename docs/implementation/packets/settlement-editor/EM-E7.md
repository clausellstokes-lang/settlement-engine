# `settlement-editor / tests-only mode` — EM-E7: MISSIONS (RECORD)

- **Status:** `LANDED`
- **Packet version:** `record-1` — written after the fact by the HISTORIAN seat (U3), 2026-09-23
- **Landed at:** `ef8910740e6b5c88f7fb1c481543dcc6091366fb` — EM-E7: send-on-mission as a direction over MISSION_KINDS, the catch as a pin on stayDetectionRoll, and no new NpcStatus value
- **Verified base:** `feat/em-e7-missions` at `ad9321796533647899e4f39d70028e5eb636b317`
- **Preamble:** `docs/implementation/preambles/EM-PREAMBLE.md` (SHA-256: TO BE STAMPED BY THE CHAIR)

⛔ **A RECORD, NOT A DISPATCHABLE CONTRACT.** This member was built under TESTS-ONLY MODE — the owner, 2026-09-23 ~09:1x, *"Can we just have it where we only have the testing apparatus? As we did so many months ago?"* → *"Then do it and start building! Thank you"* (`docs/OPERATING_STANDARD.md` rule 39; stasis row S11). Under that word the estate's own ritual — packets, seals, placements, picks, flips, count provers, pre-proofs — is PARKED, never deleted, and the record is the branch's commit receipts, the progress board and this file. It pins no symbol, reserves no path, and may not be dispatched; the authority that governed the build is §1's brief and the design section that brief cites. The unfreeze train restores the ritual (U1, U3).

## §1 — The brief this member was built from

**The brief:** `briefs/launch/BUILD-EM-E7-tests-only.md` (the charter's Wave 3 row; §19 ruling 4).

**The charge, in one sentence.** Send-on-mission as a direction over `MISSION_KINDS`, the catch as a pin on `stayDetectionRoll`, and no new `NpcStatus` value.

## §7 — What moved (the commits, and their files)

| commit (on the train) | on its branch | subject |
|---|---|---|
| `ef8910740` | `20eba5d39` | EM-E7: send-on-mission as a direction over MISSION_KINDS, the catch as a pin on stayDetectionRoll, and no new NpcStatus value |

| action | path |
|---|---|
| MODIFY | `src/domain/worldPulse/espionage/espionageGauntlet.js` |
| MODIFY | `src/domain/worldPulse/espionage/espionageMissions.js` |
| MODIFY | `src/domain/worldPulse/operations/missionDispatcher.js` |
| CREATE | `tests/simulation/sendOnMission.test.js` |

## §9 — The acceptance cases, by title, as the commits record them

- **E7-1** — every mission kind the catalog carries stages as a direction, and nothing else does
- **E7-2** — the tick resolves a direction through the estate own procedure, doors and words unchanged
- **E7-3** — the per-principal cap and the doctrine door bind a directed mission exactly as an endogenous one
- **E7-4** — the cut is STAY-deterministic: the same directions in any order yield the same candidates
- **E7-5** — the direction carries no urgency and no invented confidence, because both are the world own
- **E7-6** — a person card mission reads its four covert facets from the layer own vocabulary
- **E7-7** — the catch is a pin resolved in chooseOrPinFork shape over the fork own two words
- **E7-8** — the fork draw is CONSUMED under the pin: only the verdict moves, and the row names the hand
- **E7-9** — a word this fork does not type leaves the roll byte-identical to a world with no editor
- **E7-10** — the stage honours the pin over a real dwelling errand, and the odds stay the world own
- **E7-11** — the espionage dormancy fence is unmoved: a pin cannot wake a dark layer
- **E7-12** — no NpcStatus value is minted: the errand record carries where the traveller stands
- **E7-13** — pardon is section 15 return from exile, and it is already built
- **E7-14** — the catch vocabulary is an EXPORT of the draw own module, which is the order ruling 1 asks

## §10 — The checks the builder ran

- `npx vitest run --pool=threads --maxWorkers=2 tests/simulation/sendOnMission.test.js`
- `node scripts/implementation-packets.mjs validate`

## §12 — How it reached the train

Branch `feat/em-e7-missions`, built at `20eba5d39`; pushed as TRANSPORT (rule 24a — a lane push opens no pull request and merges nothing) and read on GitHub Actions (run `35882036655`). The chair read the run against the DECLARED reds — the two census cars under the `CENSUS_STASIS` switch (stasis S6), the lighting walker's title count, the observed-shape family's level at the branch's base (U37, closed by the schema-23 rung at `8cc2926d0` + `3b21ba791`) and the declared phone-floor rows (U25, re-recorded once at the tip by `56b085fc5`) — and MERGED it into the train branch `em-train-17-2026-09-23` by pick: `ef8910740`. Nothing was pushed as a landing; the pull request, the merge to `master`, the deploy and every migration remain the OWNER's.

`operations.js` has no send-on-mission catalogue row, and the op catalogue cannot import the dispatcher leaf without redding its zero-importer fence — a design ruling at the unfreeze (U26).
