# EP / EP-1 — the kernel seam and the flag (stage 2 of the `ep-1` split promotion)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `bbf58fa1b0144fec5a32fe1bf501660e1f87e0e9`
  (the EP-0 terminal — stage 1 of this same train, ODQ §142.3)
- **Train:** `ep-1`, family **EP**, member **1** of 5. ⛔ The five members are NOT
  path-disjoint (TTS S1: eleven duplicate-change-path convictions), so the train promotes in
  **FOUR STAGES**. **This packet is stage 2 and promotes ALONE**, which is lawful only
  because EP-0 is LANDED and has released the `_shared` artefacts they share.
- **Preamble:** none. A family preamble is a chair act (PACKET_STANDARD, "Family packet
  preambles") and EP still has none; this packet carries its own law, as EP-0's did.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§142.3** (the four-stage split promotion) ·
  **§142.4** (EP's unpriced bundle regeneration) · **§148.2** (the flag-mint bill is FOUR
  obligations, not three) · **§104.4** (edge-shared bundle closures — the GENERAL law, and
  it bites wider here than at EP-0) · **§49/§50** (the flag-mint registration obligations) ·
  **§75** (the mutant-control idiom) · **§183.3** (no lane inherits `BASE_STATE` figures —
  every figure below is re-executed at this tip).
- **Design authority:** `docs/DESIGN_FP_ARCH_EP.md` §1.1, §1.2, §1.4, §1.5, §2.1–§2.5,
  §3a, §3b.1, §8.1 row 2.
- **Compile of record:** `laneTC24-EP-PLAN.md` §3.2, annex rows `EP.M3`, `EP.M4`, `EP.M9`,
  `EP.M10`, `EP.M12`, `EP.U1`, `EP.U2`, `EP.U4`.
- **THE FLAG:** `advanceEpochEnabled` — VIRTUAL, strict `=== true`, dark-never-permissive.
  **This is the train's ONE flag mint** (PACKET_STANDARD's flag-wave train boundary).

---

## §1 · WHAT THIS WAVE DOES

A world advanced twice from the same tick draws the same future twice, because the pulse
root is a pure function of `(rngSeed, tick, interval)`. The owner directive commissions a
per-advance nonce that makes the future genuinely new — **a living future over an immutable
past** — and this member is the seam that carries it: one segment appended to the root seed,
minted once per USER ADVANCE at the store layer and threaded to the kernel as an argument.

**⛔ THE KERNEL IS BANKED PERMANENTLY AT 1580 EFFECTIVE LINES** under chair ruling R-BLD-10,
and `sizeBaseline` is tolerance-zero **in both directions**. FP §1 L1 says the file "receives
ZERO edits ever." This program is the one chair-signed exception the directive itself
commissions, and it is bought at **+0 lines**: the six edits are token-level edits on six
EXISTING lines, and the two new statements are `;`-joined onto the line that creates their
second receiver.

## §2 · THE CURE — the SIX enumerated kernel edits, and nothing beyond them

The seam contract is the LIST, never a slogan. An edit to `pulseKernel.js` that is not on
this list is a build STOP.

| # | Existing line (by SYMBOL) | The token-level edit |
|---|---|---|
| 1 | the `../../kernel/prng.js` import | `{ createPRNG }` → `{ createPRNG, epochSuffix }` |
| 2 | the `../clock.js` import | gains `assertEpochPinnedInTest` |
| 3 | `simulateCampaignWorldPulse`'s destructured signature | gains `advanceEpoch = null` |
| 4 | `const simulationRules = normalizeSimulationRules(startingWorldState.simulationRules);` | `;`-joined: the `epochTerm` derivation and the pin-epoch guard |
| 5 | the ONE `createPRNG` composition | the template gains `${epochSuffix(epochTerm)}` |
| 6 | `createdAt: now,` inside the `pulseRecord` literal | gains `...(epochTerm ? { epoch: epochTerm } : {}),` on the SAME line |

Beyond the kernel: `assertEpochPinnedInTest` in `src/domain/clock.js` beside its twin; the
epoch threaded through `advanceInterval.js`'s per-tick `tickArgs`; the store mint in
`campaignAdvanceSession.js#runAdvanceCampaignWorld` with the census-visible gate spelling;
the manifest join in alphabetical position (it sorts FIRST); and the certification row.

**⭐ `advanceCampaignWorld.js` NEEDS NO EDIT, AND THAT IS MEASURED RATHER THAN ASSUMED.** The
compile reserved it as the single-tick barrel. Measured at this base, `runWithPinnedContent`
destructures `{ customContent = null, ...pulseArgs }` and spreads the rest wholesale, and its
`PinnedPulseArgs` typedef derives from `Parameters<typeof simulateCampaignWorldPulse>[0]`, so
the argument and its type both ride free. The path is dropped from the manifest.

## §3 · THE INVARIANT CHAIN, AND WHAT EACH LINK COSTS

**(L1) DARK ⇒ `epochTerm` IS `null`**, by TWO independent gates, both required. The store
mint is gated so no value comes into existence dark. The KERNEL re-reads the flag beside the
value so a value that outlived a flag flip on the PERSISTED pause cursor cannot be used —
`worldState.pausedAdvance` is a `CONDITIONAL_LEDGER_KEYS` member, so that path is live, not
theoretical. Gating only the mint earns dark identity for the value-null cell alone.

**(L2) `epochTerm === null` ⇒ every flag-driven materialization vanishes.** At EP-1 there is
exactly ONE: **M1**, the conditional `epoch` key on the pulse record. M2 (the paused cursor)
is EP-2's and M3 (the ledger stamp) is EP-3's; neither exists in this tree.

**(L3) the materializations vanishing ⇒ THE SERIALIZED KEY SET IS UNCHANGED.** The link a
stream-only fence cannot see.

**(L4) `epochSuffix(null) === ''` and `` `${x}${''}` === x `` ⇒ the stream identity string is
character-for-character today's**, per advance path (§2.4) — never across paths, because
`advanceMultiTick` already forks the interval term and always has.

**(L5) L3 ∧ L4 ⇒ byte-identical**, reached by construction at every link.

## §4 · ACCEPTANCE

⚠ The validator caps a packet at EIGHT acceptance cases, so the twelve distinct claims this
member proves are stated as eight rows. No claim is dropped — A3, A4, A6 and A7 each carry a
pair, and every one of the twelve is separately asserted in the checks below.

| id | case |
|---|---|
| A1 | all EIGHT dark cells (four rule configurations × both value states) compose the LITERAL legacy seed |
| A2 | the value-present column changes no serialized key on the pulse record, in any dark configuration (link L3) |
| A3 | absent and explicit-false produce the identical whole projection; and every dark `epochSuffix` invocation is handed `null` and returns the empty string |
| A4 | every production read of the flag is the strict `=== true` form at exactly two sites; and the key is absent from `DEFAULT_SIMULATION_RULES` and from every preset while being manifested |
| A5 | the purity arm INVERTS: exactly one entropy call site, in `src/store`, reached through `generateSeed` and never in `src/domain` |
| A6 | a flag-dark composed advance carrying a real epoch composes the legacy per-tick seeds and writes no `epoch` key; and a LIT advance with no threaded epoch THROWS rather than silently composing dark |
| A7 | the kernel's STRUCTURAL fork sequence is identical in count and order in both flag states on both paths; and at one tick the TOTAL draw count and the label multiset are identical too |
| A8 | the epoch is a plain string, survives `structuredClone`, and the same `(seed, epoch)` replays the world while a different epoch does not |

## §5 · CHECKS

```
npx vitest run tests/property/advanceEpochDormancyFence.test.js \
  tests/domain/advanceEpochForkParity.test.js \
  tests/domain/advanceWorkerByteIdentity.test.js \
  tests/domain/subsystemRowsVirtual.test.js \
  tests/domain/contributionLedgerShape.test.js \
  tests/domain/subsystemCertificationCorpus.test.js \
  tests/lint/engineGatedRuleKeys.walker.test.js \
  tests/lint/entropyRootCensus.walker.test.js \
  tests/lint/sizeBaseline.test.js \
  tests/property/mechanismLitCoverage.test.js \
  tests/lint/seedLoopTotality.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/pulseKernelLineAddress.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/edgeFunctions/
```

## §6 · PRICED OBLIGATIONS

| obligation | verdict |
|---|---|
| **§49/§50/§148 — the flag mint, FOUR obligations** | **INCURRED, all four paid.** (a) the manifest join + the certification row + the ordered bijection's three module-scope literal edits; (b) the edge-shared regeneration; (c) the LITERAL `advanceEpochEnabled: true` drive — granted from `advanceWorkerByteIdentity.test.js`, verified by running the walker rather than by inspection; (d) `contributionLedgerShape.test.js`'s two exact literals, **22 → 23**, re-verified at this tip before bumping |
| **§104.4 — edge-shared closures** | ⛔ **INCURRED, and WIDER THAN THE COMPILE PRICED — see §8** |
| **size baseline — `pulseKernel.js`** | **INCURRED at a PERMANENTLY BANKED file, and DISCHARGED AT +0.** Measured with eslint's own `Linter` under `max-lines {skipBlankLines, skipComments}` at HEAD and at the working tree: **1580 → 1580, DELTA 0** |
| **test census** | **INCURRED.** Two new files, one amended; the tuple is re-derived and the delta decomposed per file, closing exactly |
| **§102.3 — a new `tests/lint/` file** | **NOT INCURRED.** The scope is `tests/lint`; this member creates files under `tests/property` and `tests/domain` and only AMENDS an existing `tests/lint` file, which already carries its row |
| **§85.4 — seeded-chooser registry** | **NOT INCURRED.** The seam composes a seed and chooses nothing |
| **declared shift** | **NOT INCURRED.** Byte-identical dark by construction, proven by the fence set; the lit behaviour is the feature and is flag-gated |
| **coupling registry** | **NOT INCURRED.** No new module; the two new imports are `clock.js` and `prng.js`, edges the kernel already carried |

## §7 · MUTANTS AND HAZARDS

- **MUTANT (a) — DELETE THE KERNEL'S FLAG READ** (`epochTerm = advanceEpoch`). EXECUTED on
  the live kernel: **5 failed | 19 passed**, convicting fences 1, 3 and 5. Restored
  `cmp`-exact.
- **MUTANT (b) — RE-KEY M1 ONTO THE RAW VALUE** (`...(advanceEpoch ? … )`). EXECUTED:
  **2 failed | 22 passed**, and the two are EXACTLY the L3 serialization arms while **every
  stream arm stayed green**. ⭐ That asymmetry is the whole reason L3 is asserted separately:
  this defect leaves the seed string perfectly dark and still writes a brand-new key into a
  flag-dark world's persisted state. Restored `cmp`-exact.
- **MUTANT (c) — A LIT-ONLY EXTRA FORK** (the seam grows a branch). EXECUTED against the
  parity instrument: **4 failed | 6 passed**, convicting the source census and BOTH
  structural-parity arms. Restored `cmp`-exact.
- ⚠⚠ **C-EPF-4 IS REFUTED AS SIGNED, AND THE NARROWED CLAIM IS MEASURED — see §8.**
- ⚠ **IMPORTING A `.test.js` FILE RE-REGISTERS ITS SUITES.** The fence file imports
  `codeOnly` from `engineGatedRuleKeys.walker.test.js` because the volume forbids a second
  blanker regex, so that walker's seven tests run twice. The runtime count and the static
  census therefore disagree by exactly seven, which is recorded at the census row so nobody
  runs it down as a parked-file anomaly.
- ⚠ **THE EDGE-SHARED BUILD IS A STAGED-TREE ACT** (EP-0's §4.4): stage the sources, then
  build, then commit. Restoring the churn metas to shrink the diff REDS the single-build-
  window clause.

## §8 · FINDINGS THIS MEMBER CORRECTS

**⛔⛔ THE §104.4 BILL IS EIGHT PATHS ACROSS THREE BUNDLES, NOT FOUR ACROSS TWO.** The
compile priced EP-1's closure half from `simulationRules.js` alone — `aiCharterBundle` and
`aiOutputSchemaBundle`, four artefacts. Resolved at this tip against the committed metas'
own `inputs` arrays, EP-1 also mints `assertEpochPinnedInTest` into **`src/domain/clock.js`,
which is inside THREE closures** — those two **plus `aiGroundingBundle`**. So SIX artefacts
carry real change and the other two metas carry the mandatory single-build-window stamp.
⭐ This is §104.4's general law earning its keep a second time in one train: the trigger is
closure membership, never the identity of one file, and the file that widened the bill is one
no charter ever named.

**⛔⛔ C-EPF-4's "IDENTICAL `rng.fork()` COUNT AND ORDER" IS FALSE AS SPELLED, AND THE TRUE
CLAIM IS NARROWER AND STILL LOAD-BEARING.** The compile already corrected the SURFACE (22
forks, zero randoms — reproduced exactly here). What neither the volume nor the compile
noticed is that **most kernel fork labels are CONTENT-DERIVED, not stage constants**:
`roll:candidate.npc.expose.<npcId>.<tick>`, `reform:<settlementId>:<tick>`. A lit advance
draws a different future; a different future has a different candidate roster; a different
roster forks under different labels. MEASURED on this member's fixture:

| comparison | dark | lit | verdict |
|---|---|---|---|
| single tick, TOTAL forks | 40 | 40 | **identical**, and the label multiset too |
| single tick, ORDER | — | — | differs — the seeded roster shuffle |
| composed advance, TOTAL forks | 149 | 139 | differs — the worlds have diverged |
| **STRUCTURAL subsequence, single tick** | 14 | 14 | **IDENTICAL, in order** |
| **STRUCTURAL subsequence, composed** | 56 | 56 | **IDENTICAL, in order** |

So the property R-BLD-10's refusal actually protects — **the kernel's STAGE CALL ORDER** — is
untouched, on both paths, even after the worlds come apart. That is what the instrument
asserts. The two families that legitimately move are asserted POSITIVELY as
DECLARED-FREE-TO-DIFFER, so the narrowing is a measurement rather than a quiet retreat, and a
future build in which they STOPPED diverging would red — because that would mean the epoch
reached nothing. **This is reported under the E5 STOP-AND-REPORT rule rather than repaired in
place: the kernel is correct and the specification was wrong about what a fork label is.**

## §9 · WHAT STAGE THREE INHERITS

- **The promotion continues: stage 3 is EP-2 and EP-3A**, mutually path-disjoint, promotable
  the moment this packet is LANDED — `campaignAdvanceSession.js` and `pulseKernel.js` are
  released by that status.
- ⛔ **EP-2 OWES THE STORE HALF OF FENCE 5.** This member's fence 5 asserts the reachable
  half (the kernel's flag re-read against a real value, on the composed path). The end-to-end
  pause → round-trip → flag-flip → resume path needs materialization M2 and the
  `runResolveIntervalMajors` three-term re-thread, both of which are EP-2's. **Writing it
  here would have shipped a green over a path that cannot render.**
- ⛔ **THE FLAG-MINT BILL IS SPENT FOR THIS TRAIN.** EP-2, EP-3A and EP-3B are no-flag slices
  of `advanceEpochEnabled`; none of them re-pays §49/§50/§148, and any of them that finds
  itself editing the manifest has mis-scoped.
- **The bijection is now 23 ↔ 23.** `contributionLedgerShape.test.js`'s two literals moved
  with it. That figure has now moved three times; re-verify, never inherit.
- **The kernel's +0 budget is spent but its ledger is not.** EP-3 slice A carries the ONE
  declared new import line (J-EP-11); slice B is +0. The enforcer runs BEFORE the commit.
