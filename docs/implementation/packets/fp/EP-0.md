# EP / EP-0 — the pure segment and the entropy-root census (stage 1 of the `ep-1` split promotion)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `a8f42d94af17cc585a63a0b3ecaea792e0da1d48`
  (the `uf-1` terminal — the five-volume unfork, ODQ §183.1)
- **Train:** `ep-1`, family **EP**, member **0** of 5. ⛔ The five members are NOT path-disjoint
  (TTS S1: eleven duplicate-change-path convictions), so the train promotes in **FOUR STAGES**
  (ODQ §142.3). **This packet is stage 1 and promotes ALONE.**
- **Preamble:** none. A family preamble is a chair act (PACKET_STANDARD, "Family packet
  preambles") and EP has none; this packet carries its own law. Recorded as owed for stage 2,
  where four members will share it.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§142.3** (the four-stage split promotion) ·
  **§142.4** (EP-0's unpriced bundle regeneration; the volume-fold gap) · **§102.3** (a new
  `tests/lint/` file owes its mutation-coverage row) · **§104.4** (edge-shared bundle closures) ·
  **§75** (the mutant-control idiom) · **§121.2** (the family annex fold) · **§183.3** (no lane
  inherits `BASE_STATE` figures until the OSR re-governance clears — every figure below is
  re-executed).
- **Design authority:** `docs/DESIGN_FP_ARCH_EP.md` §0.3 R1/R2/R7/R9, §2.3, §3b.2, §3b.2a, §4.
- **Compile of record:** `laneTC24-EP-PLAN.md` §3.1, annex rows `EP.M2`, `EP.M5`, `EP.M6`,
  `EP.M7`, `EP.M13`, `EP.M19`, `EP.U1`.

---

## §1 · THE DEFECT THIS WAVE INSTITUTIONALISES

An advance-epoch program that freshens the pulse root ships a "fresh future" that is
bit-for-bit the OLD future for everything the pulse `rng` does not reach. MEASURED:
`simulateCampaignWorldPulse` composes exactly ONE `createPRNG` root and forks every sub-stream
off it — but **twenty-five further root compositions across fifteen modules build their draw key
from `worldState.rngSeed` DIRECTLY** and never see that root. Sixteen use `createPRNG`, eight use
`hash01`, one uses `fnv1a32`.

Two censuses have already been wrong about this in two different ways, and both failures are the
reason this wave exists rather than a footnote to it:

1. **A `createPRNG` census was blind to an entire entropy family** (§0.3 R7) — the `hash01` half
   decides which NPC wins a succession contest, what a city does for the rest of a campaign, and
   which buyer takes a sovereignty asset.
2. **A census that closed its COMPOSITION half left its READ-SITE half open** (§0.3 R9) — three
   runtime reads feeding rows in its own disposition table appeared nowhere in it, and the
   composition count reproduced exactly while they were missing. **The two denominators are
   different numbers**, and only the second is what an epoch program must EDIT.

## §2 · THE CURE

Four parts, none of them behavioural:

1. **`epochSuffix`, minted in `src/kernel/prng.js`** beside `fork`'s delimiter docblock (J-EP-2),
   docblock verbatim at §2.3. `advanceEpoch ? \`::epoch:${String(advanceEpoch)}\` : ''`.
2. **The delimiter-alias reservation**, extending `tests/kernel/prngForkLabelDelimiter.test.js`.
3. **The rendered-string pin**, `tests/kernel/advanceEpochStreamIdentity.test.js`.
4. **The ENTROPY-ROOT census walker**, `tests/lint/entropyRootCensus.walker.test.js` — the
   structural-prevention instrument, with TWO shrink-only baselines rather than one.

⛔ **THE BASELINES ARE DERIVED AT THIS BASE, NEVER INHERITED.** The volume publishes 68 / 37 /
TEN / 31 / "8"; the compile of record publishes 80 / 38 / 16. Every figure in the walker's closure
record is re-executed here, and where the two disagree the executed one wins with its command
recorded beside it.

## §3 · THE CONTROL ARMS (§75, MANDATORY)

A census whose detector matches nothing exits zero. Every control runs the **real** detector over
a fixture — the detectors are pure functions of `(path, text)` precisely so a control cannot be a
re-implementation.

1. **NINE POSITIVE CONTROLS**, one per measured read spelling, including the `?? ''` spelling and
   the **RAW UNCOERCED ARGUMENT-POSITION read** (`rngSeed: startingWorldState.rngSeed`) — the
   spelling that hid the in-pulse row-1 read from two adversarial passes.
2. **FOUR DISCRIMINATION NEGATIVES** proving the detector is receiver-anchored rather than a
   `.rngSeed` matcher: `a.rngSeed`, `intent.rngSeed`, `myRngSeed`, and a comment line.
3. **NC-1, THE MANDATORY LIVE NEGATIVE CONTROL** — `economyReconciliation.js`'s
   `rngSeed: stepRng.fork(POWER_STREAM).seed`, the exact syntactic shape of positive control 9, on
   a module with THREE production importers, whose paired `createPRNG(intent.rngSeed)` also
   exercises the consumer arm.
4. **NC-2, RETAINED AND LABELLED WEAK** — `personaSlicer.js` has ZERO importers in `src`, so its
   control passes by ABSENCE rather than by discrimination. Deleting a green assertion is a
   silently weakened pin, so it stays, labelled in-file with its reason.
5. **THREE IN-FILE PLANTS**: a twenty-sixth composition; the same plant in the **`hash01` idiom
   specifically** (a walker that only catches `createPRNG` is the exact failure the first charter
   shipped); and a twenty-third read site in the uncoerced argument-position spelling.
6. **THREE ESTATE PLANTS**, executed against the live tree and restored `cmp`-exact.

## §4 · SCOPE AND BOUNDARY

This wave mints the segment and the instrument, and nothing calls either. **EP-0 is DARK BY
CONSTRUCTION** (the WR-10 dark-instrument precedent): no flag, no caller, no engine behaviour, no
persisted key. It does not thread `advanceEpoch` anywhere, does not touch `pulseKernel.js`, does
not mint the flag, and re-roots not one of the twenty-five compositions — those are EP-1 and EP-3.

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | `epochSuffix` returns `''` for every falsy spelling including `0`, and `::epoch:<e>` otherwise |
| A2 | the empty-string identity holds over a table of real seeds, at the string AND at the drawn stream |
| A3 | the rendered dark and lit pulse-root strings equal their hard-coded literals, on both interval spellings |
| A4 | the composition shape is anchored against the live kernel: exactly one root, opening with the frozen dark body |
| A5 | the read-site census is exactly twenty-two, counted PER MODULE, every row dispositioned |
| A6 | the composition census is exactly twenty-five roots across fifteen modules, plus the seam and four derivations |
| A7 | the write-key roster is exactly three, one writer and two labelled out-of-denominator impostors |
| A8 | the reserved root-segment head `epoch` is spelled by no fork label in `src` |

## §6 · CHECKS

```
npx vitest run tests/lint/entropyRootCensus.walker.test.js \
  tests/kernel/advanceEpochStreamIdentity.test.js \
  tests/kernel/prngForkLabelDelimiter.test.js \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/edgeFunctions/
```

## §7 · PRICED OBLIGATIONS

| obligation | verdict |
|---|---|
| **§102.3** — a new `tests/lint/` file owes its mutation-coverage row | **INCURRED.** One `invariants` row, added SURGICALLY beside its siblings; that manifest is never re-serialised whole |
| **§104.4** — edge-shared bundle closures | **INCURRED, and priced at SEVEN artefacts.** `src/kernel/prng.js` is inside the `aiCharter` (110 inputs) and `aiOutputSchema` (111) closures, verified against the committed metas' own `inputs`. FOUR artefacts carry real change; the other THREE metas carry the mandatory single-build-window stamp — see the hazard below |
| **test census** | **INCURRED.** Two new test files move `files`, `credited`, `titles` and `suiteTitles`; the tuple is re-derived and the delta decomposed per file |
| **negativeAssertionAnchor** | **INCURRED, ceiling ZERO.** Both new files carry zero un-anchored negatives |
| **flag mint (§49/§50/§148)** | **NOT INCURRED.** EP-0 mints no flag. The four-obligation bill lands on EP-1 |
| **§85.4 registry** | **NOT INCURRED.** `epochSuffix` composes a seed and chooses nothing — no seeded chooser, no pool |
| **size baseline** | **NOT INCURRED.** `prng.js` is unbaselined and far under its layer ceiling |
| **declared shift** | **NOT INCURRED.** Nothing calls the segment; the estate is byte-identical |

## §8 · MUTANTS AND HAZARDS

- **The truthiness mutant, EXECUTED on the live subject.** Rewriting `epochSuffix`'s guard to
  `advanceEpoch != null` renders `::epoch:0` for a world whose epoch counter is zero — a different
  stream for the same world. Planted in `src/kernel/prng.js`, asserted RED, restored `cmp`-exact.
- **Three estate plants, EXECUTED and restored `cmp`-exact**: a twenty-sixth composition in
  `roadsKernel.js`; a twenty-third read site in `demographicsKernel.js`'s uncoerced
  argument-position spelling; a second `rngSeed:` write key in `worldState.js`.
- ⚠⚠ **THE `::` ALIASING TRAP IS REAL AND IT IS NOT HYPOTHETICAL.** `fork` derives by plain
  concatenation, so a root segment rendering `::epoch:<e>` is CHARACTER-IDENTICAL to what forking
  that seed with the label `epoch:<e>` derives. MEASURED: zero fork labels in `src` open with that
  head. The head is RESERVED and the reservation is asserted from source.
- ⚠⚠ **A DOC-COMMENT CALL FORM IS A SCANNED SITE.** The reservation's own first draft spelled the
  hazard in `prng.js` using a literal `.fork(` call form, and the delimiter walker counted it — the
  new pin RED on its own subject before a line of it was true. The rule is now spelled without a
  call form. Recorded because the walker's header warns of exactly this and it still landed once.
- ⚠⚠ **THE THREE CHURN METAS ARE MANDATORY, NOT OPTIONAL.**
  `edgeSharedBundleReproducibility.test.js` asserts (CR-EB-2 (b)) that every bundle shares ONE
  build window — a `generatedAt` spread over ten minutes REDS. Restoring the three non-closure
  metas to keep the diff minimal therefore breaks the gate. The same file also asserts each bundle
  was built from **committed or staged** content, so the sources must be `git add`ed BEFORE
  `npm run build:edge-shared` runs.
- ⚠ **Same-seed: NEUTRAL, and it is proven rather than argued.** `epochSuffix(null) === ''` and
  `x + '' === x`, executed over a table of real seeds at both the string and the drawn stream.

## §9 · WHAT STAGE TWO INHERITS

- The four-stage promotion continues: **stage 2 is EP-1 alone**, which may promote only once this
  packet is LANDED (it shares the four `_shared` artefacts with EP-0).
- **The flag-mint bill is FOUR obligations, not three** (ODQ §148.2) — the fourth is
  `tests/domain/contributionLedgerShape.test.js`'s two exact literal counts over the flag manifest.
  Verify the literal at stage 2's own tip before bumping.
- The walker's two baselines are now the estate's record of the entropy denominator. EP-3's
  re-roots must keep both green; a twenty-sixth composition or a twenty-third read site is a
  STOP-and-report, never a bump.
