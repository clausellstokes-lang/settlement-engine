# GUARD-2 (CLOSE-7; RULING-R24 R24n): DONE. Two commits on 97c6bfc7a, not pushed.

- Tree: `/home/user/wt/guard2`, branch `lane/close-7-2026-11-24-guard2-wip`.
- **a413c6156 GUARD-2**: items (1), (2) and (3).
- **94ff40f5c**: the lighting census door. titles 31,980 → 31,986 and suiteTitles 8,889 → 8,890. The walker is 34/34 green
  plainly after.
- READ: R24n.md; dmLayer.js (the reason sets and appendMinted); editSlice.js :: applyRosterDecreesAtTick;
  rederiveGuard.test.js; rosterOpsAtTick.test.js C2 (the undo's form); campaignWorldPulseDeferred.js 480-600 (the real
  rewind); genesis.js 205-230.

## (1) THE PIN BAG's SET, BYTE-IDENTICAL (CONFIRMED by run)
- `export const REDERIVE_UNAPPLIED_REASONS = Object.freeze(['step_not_pinnable', 'unknown_key']);` is back. Its doc block
  equals 0a40b581d^ (the tree before GUARD) byte for byte.
- **The append path's own set:** `APPEND_UNAPPLIED_REASONS = Object.freeze(['engine_mismatch', 'unknown_key'])`.
  - It names everything `appendMinted` can hand back: a world-fact root, and a newcomer whose card writes no collection.
  - The typedefs are `RederiveUnappliedReason`, `AppendUnappliedReason`, and the row type `UnappliedReason`, their union.
- **G7, both directions:**
  - The pin bag's set is exactly the two.
  - The append set is exactly its two, and frozen.
  - One `appendMinted` call reaches each member, and nothing outside the set.
- **G5** is re-stated by its cause: the reason is now the append path's.
- `dmLayerGoldenIsolation`'s three pins return to the two they held before GUARD.
- **`npm run validate:packets`:** red at the cut, `EM-R1b.requiredSymbols[7].symbol is missing` and
  `EM-R1c.requiredSymbols[6].symbol is missing`. Green after: `[implementation-packets] valid: 257 packets (0 READY)`, exit 0.

## (2) THE ANSWER's STAMP IS CHECKED (CONFIRMED by run)
- After the lane answers, the derived record is written ONLY IF its `generatorVersion` is this build's `GENERATOR_VERSION`.
- Any other answer takes the append path: `appendMinted` over the live record and this tick's newcomers, with
  `rederived: false`. It never returns NOTHING_MINTED.
- **G8, RED FIRST:** a lane double answers with the real record restamped `0.11.0`. On the cut the tick wrote that record and
  said `rederived: true`. After the change:
  - `rederived: false`, laneCalls 1, unapplied [];
  - the stamp stays `0.10.0`;
  - the newcomer appears once;
  - nothing else moves, and both homes hold one record.

## (3) THE APPEND PATH's MISSING TESTS (CONFIRMED by run; each green on the cut too: untested, not broken)
- **G9, two ticks:** the roster is the saved people, then A, then B, each once. The receipts mint [A] and then [B].
  - **Negative control:** `appendMinted` was handed the whole layer by a plant. G9 went red: "expected [ … (4) ] to deeply
    equal [ … (3) ]", A twice. Restored.
- **G10, a save that is not the open one:** its library row takes the newcomer once, and nothing else on it moves. The open
  view is deep-equal to before. laneCalls 0.
- **G11, a faction and a house newcomer:** each is appended once, at the end of `powerStructure.factions` and of
  `institutions`. Nothing else moves, including the rest of the power structure.
- **G12, THE UNDO of an appended tick.** It is driven in the rewind's two halves, the form `rosterOpsAtTick` C2 uses:
  `retractDecreesOfTick`, then the pre-pulse snapshot restored into both homes.
  - **After it, the record holds:** the saved roster without the newcomer, no minted row, the decree `pending`, and the
    legacy stamp `0.9.0`. A tick right after mints nobody.
  - **The undo takes the person back: no finding.**
  - Not driven: the campaign slice's own undo verb. Its restore (`restorePulseSnapshotOnDraft`) writes the snapshot's save
    whole, so the append leaves nothing outside it (PLAUSIBLE, by read).

## genesis.js:222, ONE LINE
Yes, by intent: B1(ii)'s rule ("no tradition blesses fields the place does not have") reads the record's own facts, so it
holds for a place of any engine. But it re-deals the advance's addition draw wherever `fieldsBoughtIn` holds, stored places
included. Places without that condition draw as before (PLAUSIBLE, by read). B1(ii) did not measure stored places; that is
the chair's to accept.

## GATES (CONFIRMED by run)
- **The two changed test files, and the 31 test files that name dmLayer.js or editSlice.js:** 13 tests red in 7 files.
  The same 12 are red at the cut 97c6bfc7a, and A7 is red at the cut too (525 golden rows, run on the anchors tree). None is
  GUARD-2's. They are:
  - editWorldFactResources ×2, mergeLadderHeldKeys A2, worldFactRederive, generationForkCensus;
  - pipelinePinnedMode ×3 (41 golden rows), editCorpusRatchet ×4, dmLayerGoldenIsolation A7.
- **`tests/store` whole:** 170/170 files green.
- **`tests/lint` whole:** 220 of 227 files pass. The six red files are the same six the hand-in's lint shows (the known
  three, plus newsHeadline, newsVoice, observedShapeReaders and proseFamilyContract). The seventh, the lighting census, was
  GUARD-2's six new titles and is cured by its door in 94ff40f5c.
- **`npm run validate:packets`:** green, as quoted in (1).
