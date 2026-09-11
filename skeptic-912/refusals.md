# SKEPTIC §912 — LENS: THE REFUSALS AND THE TYPE FIX
Seat: Opus 5 — Fable-unvalidated (verifier). Dock read-only.
HEAD before/after: `7d96e2b72245fa465182d59dade31621f31ecf2c` / same. Porcelain before/after: 0 / 0.
Every figure below comes from a command executed in this session. Probes live beside this file
(`probe1.mjs` … `probe4.mjs`) and read the dock; they wrote nothing into it.

## (a) CAR 6 — THE REFUSAL

### CONFIRMED — the digest input really is content-bearing
`probe1.mjs`, over the dock's own fixture and admitter: flipping `stressors.name` to the
instrument's adversarial value and re-admitting gives
`definitionId` same, `revisionId` same, `revisionNumber` same, **`contentHash` DIFFERENT**
(`75ddb8f6…` → `79a1f5bb…`). `identifyCustomContentPack` sets `contentHash =
contentRevisionHash(bucket, definition)`, which fingerprints `authoredDataOf(data)` — presentation
included. So R-C's "identity-only (…/contentHash) triples" digest DOES move on a presentation
edit, and the lane's account of WHY the tripwire fires is right.
The tripwire itself is real and is not the pin R-C chartered: it is the separate arm
`every blind case materializes and discovers under the lit law` in
`tests/domain/livingContentMaterialization.test.js`, whose escape filter is
`reached.filter(path => !path.startsWith('$.customContentRoster.'))`. R-C chartered re-cutting
`the provenance receipt is untouched by the roster`, a different `it(...)`.

### CONFIRMED (mechanism) / UNTESTED (figure) — the narrower digest clears it
Same probe: neither `definitionId` nor `revisionId` moves under the flip, so a digest over those
two cannot escape. The lane's "2 failures instead of 3" is UNTESTED here — car 6 is reverted and
rebuilding it is outside my fences.

### ⛔ REFUTED — the narrower digest's blindness is a FIXTURE artifact, not a product property
The lane refuses the narrow digest because it "goes blind to a content change that mints no new
revision", and cites the fixture as demonstrating that happening. The fixture hand-writes
`revisionId = revision:<bucket>:<localUid>:1`, ignoring content. The PRODUCT's own local revision
minter does not: `makeContentRevision` builds
`revision:${definitionId}:${number}:${contentHash.slice(0, 16)}` — content-addressed — and DB
revisions are new rows per revision. So in the product a content change that mints a revision
moves the revisionId, and the narrow digest sees it. The demonstrated blindness belongs to the
test fixture's fake identity, and the refusal rests on it.

### ⛔ REFUTED — neither candidate is tamper-evident over the persisted roster
`rosterRow` copies identity via `projectCustomDefinitionIdentity`, which READS
`source.customDefinitionContentHash ?? nested.contentHash ?? source.contentHash`. The row's hash is
a copied string, never recomputed from the row's own authored fields. So an edit to a persisted
roster row's prose moves no digest under EITHER candidate. "A tamper-evident digest that cannot see
a content change is a hash that does not do its job" is true of the wide digest too, against the
threat a receipt exists for.

### THE THIRD OPTIONS THE LANE DID NOT WEIGH
1. **`{ lawVersion }` alone, no rosterHash.** Presentation-invariant, clears the tripwire, keeps
   R-C's byte claim (omitted when dormant), and defers the hash-contract question entirely instead
   of deciding it wrongly in either direction.
2. **Re-cut the F2c escape filter, not the digest.** The file's own comment calls the escape check
   "a strictly stronger claim" than the governing law, and the governing law is stated as the six
   `LIVING_CONTENT_ADOPTION_SURFACES` — the receipt is not one of them. Allowing
   `$.customContentProvenance.livingContent.*` + `receiptHash` while keeping the adoption sweep is
   a coherent third design. It is a bigger act than the lane could take alone, but it belongs in
   the options table.
3. The lens's "hash revisionContentHashes only where a revision is minted" is not separable in
   this fixture (every row is revisionNumber 1) and collapses onto option (1) or the narrow digest.

### PARTLY — the routing
The refusal is correctly refused UPWARD. But the brief's own R-A declares this lane "chair-class
end to end (persisted shape, pre-launch)", and the `OWNER-GATED` words in the tripwire message
attach to presentation→mechanical PROMOTION, not to the choice of digest input. The digest choice
is chair-decidable under the standing delegation; the receipt's "chair/owner work" is right, an
"owner-gated" reading of it is not.

### CONFIRMED — the revert left zero residue
`git diff 34115c7b7..7d96e2b72 --stat` = 2 files, 9 insertions, 9 deletions, all of them the car-5b
annotations. Porcelain 0. Executed at the tip: livingContentMaterialization **11 passed**,
livingContentRosterPublicDrop **6 passed**, livingContentLawWiring **10 passed**, writerReach.walker
**56 passed** — all exit 0.
Inherited finding 4 CONFIRMED by reading: `buildSettlementContentProvenance` returns `null` when
there is no environment, no bindingHash and no materialized definition, so a lit world with only a
roster gets no receipt to carry the marker.

## (b) CAR 5b — THE TYPE FIX
CONFIRMED, source-fixed, no ceiling moved. The diff is three JSDoc annotations and one
`ok` → `ok === true` narrowing; `Record<string, unknown>` casts only. `scripts/.full-typecheck-baseline.json`
is NOT in the consist's stat (`git diff 3b1c0eaa5..7d96e2b72 --stat` lists 12 files, none of them the
baseline; its last touching commit is `e4a213607`, before the lane).
**What 173/173 means**: `typecheck:ratchet` = `node scripts/check-full-typecheck.mjs` — a PER-FILE,
shrink-only ceiling over `tsc --noEmit -p tsconfig.full.json`, with a file ABSENT from the baseline
allowed ZERO. The committed baseline holds 38 files summing to 173. Both files car 5 touched are
absent from it, so their 10 + 1 errors were regressions by the ratchet's own rule, exactly as the
commit says. ⚠ A green ratchet is NOT "nothing introduced" — the script's own header says errors
that fit inside another file's slack redden nothing. The green itself is UNTESTED here: I did not
run tsc (two full-tree passes, outside my fences).

## (c) CAR 4 / CAR 2 — WHAT THE REFUSALS LEFT OPEN
CONFIRMED: `toPublicSafe(s, {full:true})` deep-clones and deletes a named list; it never runs the
root allowlist, so the roster and the receipt survive a DM share. The ledger's O-11 line is wrong
for full mode and the lane's correction stands. The lighting tripwire in the DM-full arm is a real
assertion that reds when the dial constant moves.

⛔ **BUT THE INERTNESS ANCHOR IS THE WRONG ONE.** The arm's message says "While the dial sits at the
dormant default no generated world carries a roster at all". The roster gate reads the CONFIG, not
the dial — `livingContentRosterFor` calls `materializesLivingContent(config)`; that same test file
mints lit worlds without touching the dial. Executed (`probe3.mjs`): a hand-built import entry whose
settlement carries `customContentRoster` survives `prepareSettlementEntry` with its SOURCE ids
intact, and its `config._livingContentLawVersion: 2` survives `scrubImportedConfig`. A world can
carry a roster today with the dial at 1.
The operative production barrier is different and stronger: nothing in `src/` calls
`loadLivingContentRoster()`, so a config-lit generation THROWS. Executed (`probe4.mjs`):
`generateSettlementPipeline` with `_livingContentLawVersion: 2` →
`[livingContentSeam] v2 world, roster payload not loaded`. The DM-full gap is therefore inert, for a
reason the file does not state.

⛔ **THE RECONCILIATION DEFERRAL'S GROUND IS SELF-REFUTED IN ITS OWN COMMIT.** Car 5 says both
"`prepareSettlementEntry` preserves `customContentRoster` verbatim (probe: a roster survives that
call with its SOURCE ids unchanged)" AND "with the dial dormant no shipped world carries a roster at
all" as the reason the reconciliation gap cannot be reached. The reconciliation path's input is an
import FILE, which is exactly where a roster can come from without any dial. The deferral may still
be right on the provenance-twin argument; its inertness argument is false.

⛔ **CAR 2's RECORDED CORRECTION SHIPS A FALSE SENTENCE.**
`tests/domain/livingContentLawWiring.test.js` records, as the reason the underscore admission is
left unchanged: "the store config is the WIZARD FORM, it is never hydrated from a saved settlement."
`src/components/SettlementsPanel.jsx` `onLoad` does exactly that — it reads
`data.settlement?._config || data.config` and calls `updateConfig(migrateConfig(rawConfig))` ("Apply
Saved Configuration & Regenerate"). Executed (`probe2.mjs`): the marker survives
`migrateSettlementConfig`, `isAllowedConfigKey` admits it, `materializesLivingContent` returns true.
It is a comment, so nothing reds; the conclusion (an EXISTING world is safe) survives, because only
the next BIRTH is affected — and that birth throws, per probe4. The stated ground is still false and
a future reader inherits it.

⛔ **THE REMAP DOES NOT PROJECT THE ROWS.** `livingContentRoster.js`'s own header states that a
roster copying "whatever the author's object happened to hold would be an uncontrolled widening of
the persisted settlement shape", and the builder projects every row through
`CUSTOM_CONTENT_MANIFEST`. `remapAccountSettlementLivingContentRoster` — the new gate at the one
boundary where FOREIGN rows arrive — does `{ ...row, customDefinitionId }` and carries every
un-admitted key through. Executed (`probe3.mjs`): a `SMUGGLED_KEY` inside a roster row survives
`prepareSettlementEntry`, and the spread carries it into the destination account's persisted world.
Not a regression (the key was carried verbatim before car 5), but the lane built the gate and left
it open.

⛔ **THE DARK-REGISTER ROW IS NOW INCOMPLETE, AND ITS WALKER CANNOT SEE IT.** The row's `writer` is
`src/generators/generateSettlementPipeline.js` alone, and the walker probes only `read(row.writer)`.
Car 5 added a second assignment site (`accountImportBody.js` writes
`preparedResult.entry.settlement.customContentRoster`). The lane recorded "the roster row stays as
it is — CONFIRMED"; the walker's 56 green cannot convict a second writer it never reads.

## WHAT HELD
- Two stale header facts really are corrected at the tip: the closure narrative is 239 → 238, and
  the `loadEngine()` claim is corrected in place — `loadEngine` lives in `settlementSlice.js` and is
  awaited by the regen path, not by the generation lane.
- The dropped ESD instruction was measured inert: `ENGINE_SHARED_DOMAIN_EXCISIONS` is applied as
  `.delete(frag)` over a set seeded from `src/generators`, and `livingContentLaw.js` is not in it.
- No `file.js:NN` citation appears in any line the consist adds — the live line-cite hazard avoided.
