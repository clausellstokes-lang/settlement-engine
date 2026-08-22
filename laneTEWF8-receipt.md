# lane TE-WF8 — EXECUTION RECEIPT (packet WF-8A; the chair CASes)

**Seat:** executor. No ref moved, no main-worktree touch, no `git stash`, explicit staging only.
**Worktree:** `<scratchpad>/tewf8-tree` (detached at base), own `node_modules` (APFS clone of
`tewf1e-tree`'s, 468 packages — the fuller lane set, a superset of the main tree's 460).

---

## §0 · BASE

- `claude/composite-r4` tip at lane start: **`27c250f9`** (`feat(MF-T2D): the boundary noder …`).
  Identical to the compile base — WF-1F had NOT landed when this lane opened. Re-read before the
  terminal (see §9).
- Preamble SHA-256 recomputed at MY base:
  `f4cd39fee756c3a192710ab9aa3fc208e18ef1f08ea9e9073bcdc8bfb55d871c`, 780 lines — **MATCHES** the
  packet's cited hash. TRUE_EXIT=0.

## §1 · THE FOUR ZERO-HEADROOM FILES, RE-MEASURED AT MY BASE (before)

eslint's own `Linter`, `max-lines {skipBlankLines, skipComments}` (`laneTEWF8-measure-base.log`):

| file | eff | baseline | verdict |
|---|---:|---:|---|
| `src/domain/worldPulse/warTermination.js` | 818 | 818 | EXACT |
| `src/domain/worldPulse/pulseKernel.js` | 1581 | 1581 | EXACT |
| `src/domain/worldPulse/applyWorldPulse.js` | 941 | 941 | EXACT |
| `src/domain/worldPulse/peaceTerms.js` | 797 | no baseline | 3 under the 800 layer ceiling |

Manifest targets at base: `religiousContest.js` 470 · `heraldRouting.js` 268 ·
`chroniclersLetter.js` 220 · `settlementRumors.js` 509 · `habitForkRegistry.js` 245.
Templates: `informationNews.js` 50 · `informationReceiptPools.js` 13. All reproduce the compile's
figures exactly.

## §2 · TRANSPORT CHAIN — RE-VERIFIED BY READING AT MY BASE

- `advanceShares` (`religionState.js:337`) returns `string[]`; `pruneSuppressed` (`:426`,
  unexported) has `KEEP = 3` and returns `[]` when `supp.length <= KEEP`, else `order.slice(KEEP)`
  after `delete state.deities[k]`. ⇒ four suppressed → ONE deleted; five → TWO. The names MUST be
  captured before the call (the entries are deleted).
- The seam at `religiousContest.js:795` is live and the return is **DISCARDED**. CONFIRMED.
- `outcomes` (`:576`), `unseating` (`:686`), `nameFor` (`:556`), `stablePart` (imported `:46`) all
  in scope at the seam.
- `pulseKernel.js:1237/:1249` forwards `religion.outcomes` → `religiousOutcomes` → `warOutcomes`.
- `applyWorldPulse.js:1071` `newsEntryForOutcome(outcome, tick, 'applied')`;
  `worldPulseFeedCuration.js:93` stamps `impactKind: outcome.candidateType || outcome.type`;
  `:78` majors at `severity >= 0.72`. ⇒ severity 0.5 surfaces `notable`. CONFIRMED.
- `isDriftOnlyOutcome` (`:110`) returns false on `curationClass === 'transition'`. CONFIRMED.
- `ownsOutcomeNews` (`applyWorldPulse.js:352/:503`) is set only by the war "armed" branch — cannot
  fire for a religion outcome. CONFIRMED by reading.
- `collectFaithDeltas` (`pantheon.js:237`) filters on `o.deityReembed?.snapshot`; the obituary
  carries none ⇒ **zero effect on pantheon deltas**. CONFIRMED by reading.
- `KIND_SECTION_CORRESPONDENCE.traditions === 'split'` (`heraldRouting.js:580`) ⇒ a
  `traditions` letter row routing to `faith` is a SPLIT OUTCOME, **not** a divergence. No
  `KIND_SECTION_DIVERGENCES` row owed. CONFIRMED.

## §3 · ⭐⭐ THREE SUBSTRATE FINDINGS THE COMPILE DID NOT CARRY (each executed)

### S-6 ⛔⛔ THE GOVERNED FAITH CORPUS ALREADY EXISTS AND CARRIES THIS EXACT POOL

`docs/content/RECEIPT_POOLS_FAITH.md` (1411 lines, 103 kinds / 736 variants, authored 2026-08-02
under SP-6, verifier-passed 2026-08-03) carries, in `## §D WF-1`:

```
### faith.extinction.last_altar (WF-1) — Chronicle — significance: major
SLOTS: {creed} {settlement} {temple}   AUDIENCE: public
1. The last altar of {creed} in {settlement} went dark; none there now keep the rite.
… five variants
```

Variant 1 is verbatim the "worked line" the packet §2.2 quotes as the register. The packet ordered
`faithReceiptPools.js` as newly-authored prose because the compile never located this annex.

**Executed probe** (`laneTEWF8-annex-probe.mjs`, TRUE_EXIT=0): the annex parses CLEANLY through the
estate's shared reader `tests/helpers/receiptAnnex.js` with `section: '## §D WF-1'`,
`until: '## §E WF-2'` — both anchors exactly once, `from = 'faith'`, five rows, no legacy forward.
Sentinel-derived requiredSlots: `[[creed,settlement],[temple],[creed,settlement],
[creed,settlement],[creed,settlement]]` — i.e. **variant index 1 requires `{temple}`, which the
fold cannot supply**, so the eligible set is FOUR, exactly the derived `major` floor
(CHRONIC_FLOOR 8 − rank 2 × CADENCE_STEP 2). The CR-IN1C-2 precedent governs: the pool is NOT
trimmed to what is reachable, and the walker pins the eligible set in BOTH directions.

Nothing in `src/` or `tests/` reads this annex today (`docs/DESIGN_FP_ARCH_CENSUS.md:121` records
`RECEIPT_POOLS_FAITH.md | nothing`).

⇒ **J-TEWF8-1 (vetoable): the pool is taken from the governed annex VERBATIM, not authored.**
Grounds: FINITE-SEMANTICS ("AI is clerk, never writer"); `informationReceiptPools.js`'s own header
law ("a corpus defect is a chair annex act, never an edit to this file"); T-PROSE 1 (producers land
before prose). Authoring four parallel sentences beside a governed five-variant pool would FORK the
corpus. The packet's intent is unchanged and better served — its quoted register IS annex variant 1.

### S-7 ⛔ THE §85.4a ROW COSTS ONE ROW **PLUS ONE CONSTANT**, AND THE PACKET SAYS "NO EDIT"

Packet §1.3 / §6.3 rule `chooserTotality.walker.test.js` **NO EDIT** ("DEFER untouched — the row
lands classified"). **Refuted by measurement.** At my base
(`laneTEWF8-defer-probe.mjs`, TRUE_EXIT=0): 33 registry rows — `DEFER 30`, `STAY 3`; 21 idiom
rows; 14 domain rows. The walker's arm at `:275-281` asserts
`deferred.length === DEFER_CEILING` where `DEFER_CEILING = 30` — **exact in BOTH directions**.

`faithNews.js#faithReceipt` will be DISCOVERED by `IDIOM_SIGNATURES.KEYED_RACE` (`/\bhash01\s*\(/`,
`:72`) because `src/domain/worldPulse` is a declared SCAN_ROOT. Its honest disposition is HBF-07's /
HBF-33's `DEFER` (STAY would rule, for FAITH alone, the open prose-pick question). So `deferred`
becomes 31 and the ceiling must move 30 → 31 in the same commit.

This is not novel: the landed IN-1c-a terminal `24c61190` records it verbatim — *"THE RULED 'ONE
ROW, SURGICAL' ACTUALLY COSTS ONE ROW PLUS ONE CONSTANT, and the second half is not
discretionary … the ceiling moves 29 -> 30 in the same commit … Leaving it at 29 would leave the
tree red and make the ruling unexecutable."* The chair's §350 ruling of this packet is that event.

⇒ `tests/lint/chooserTotality.walker.test.js` becomes an M-row. See §4 for the net budget effect.

### S-8 ⭐ THE §85.4b LIT-COVERAGE ROW IS **NOT INCURRED** — COVERAGE, NOT DEBT

`tests/property/mechanismLitCoverage.test.js` grants AUTO credit to any flat `worldPulse` module
directly imported by a lit-eligible test (`:103-122`; `NON_LIT_RE = /(dormanc|byteidentity)/i`, and
`tests/lint/**` is lit-eligible). `informationReceiptPools` took a baseline row at IN-1c-a only
because it had **ZERO imports** — the `amended` block says so in those words.

The new walker imports BOTH `faithNews.js` and `faithReceiptPools.js` directly (the pools import is
load-bearing: it pins the registry's pool IDENTICAL to the corpus module's export, so an inlined
array would red). Both are therefore AUTO-covered and the baseline stays at 24 mechanisms / 1 flag.
The packet's own wording already conditions this row — *"unless the battery genuinely lights it"*.
**Proved by execution, not asserted** — see §7.

⇒ `tests/fixtures/mechanism-lit-coverage-baseline.json` (packet M15) is **DROPPED**.

## §4 · THE NET BUDGET EFFECT OF S-7 + S-8 — the ruled override is NOT exceeded

| | packet | this lane |
|---|---:|---:|
| M-rows counted (files) | 16 | 16 |
| + packet doc | 17 | 17 |

M15 (`mechanism-lit-coverage-baseline.json`) is DROPPED (S-8, measured); M18
(`chooserTotality.walker.test.js`) is ADDED (S-7, mandatory). One out, one in. The chair-ruled
override **12 → 17 stands exactly as ruled**; nothing is renegotiated.

</content>
</invoke>

## §5 · ⛔⛔ THE LANE'S CENTRAL FINDING — THE PACKET'S MINT RULE PRODUCES A FALSE RECEIPT

**The packet's §0.1 rule — "mints ONE outcome per deleted creed" — was implemented exactly as
drafted, driven, and printed. It announced the same creed's last altar going dark TWENTY-FIVE
TIMES in a sixteen-tick run, twenty-two of them repeats of three creeds.**

`laneTEWF8-beat-probe.mjs` / `laneTEWF8-churn-probe.mjs`, TRUE_EXIT=0, fixture `n=6 village`:

```
  t1: beats=[dunmar,ember]  t2: beats=[dunmar,ember] repeat-of-earlier=[dunmar,ember]
  t3..t12: the same two, every tick        t13: beats=[cinder]
  TOTAL beats=25 distinct creeds=3 REPEAT beats=22
```

**THE MECHANISM, MEASURED.** `pruneSuppressed` genuinely deletes the entry — it is absent from
the settlement's state at the end of every one of those ticks — and then step 3a re-admits it
next tick from a neighbour that is STILL CARRYING that creed, whereupon it is re-suppressed and
re-deleted. The deletion is real each time; the EXTINCTION is not. The receipt says *"none there
now keep the rite"* and *"gone from the parish entirely"*, and the creed is back inside one tick.
That is a HEADLINE HONESTY (R-28) violation, and the packet's own `curationClass: 'transition'`
makes it louder rather than quieter: it forces `isDriftOnlyOutcome` false, which BYPASSES
`isMetronomeRepeat`, the estate's own repeat suppressor. Every one of the twenty-five reaches the
feed.

The compile could not have seen this: its §9 records affirmatively that "the acceptance fixtures
were NOT run to their pins". The packet's §6.4 orders exactly the run that found it.

### THE CURE — ONE CONJUNCT, AT THE SEAM, ON DATA ALREADY IN SCOPE

```js
// religiousContest.js, inside the per-deleted-ref loop
if (reaching?.has(deadRef)) continue;
```

`reaching` is the settlement's own carrier map (`reach.get(cid)`, already bound at the head of
the settlement loop). A creed a neighbour is still carrying is a creed whose rite has a road
back; its altar is not dark. Spread-off ⇒ `reaching` is undefined ⇒ the guard is inert, which is
correct: with no cross-settlement propagation nothing can return.

### THE CURE IS PROVEN BY AN INDEPENDENT CROSS-CHECK, NOT BY THE COUNT DROPPING

`laneTEWF8-crosscheck.mjs` (TRUE_EXIT=0) computes, from the serialized state alone and with no
reference to the outcome stream, the set of refs that PERMANENTLY vanish from the settlement's
roster, and compares it tick-for-tick and creed-for-creed against the minted beats:

| fixture | beats | persistently vanished | MATCH |
|---|---|---|---|
| n=6 town | `[]` | `[]` | **true** |
| n=8 town | `t2:zenith t14:alder` | `t2:zenith t14:alder` | **true** |
| n=6 village | `t13:cinder` | `t13:cinder` | **true** |
| n=8 village | `t3:zenith t14:alder t14:cinder` | same | **true** |
| n=8 hamlet | `t3:zenith t14:alder t14:cinder` | same | **true** |

Two independently derived measurements agree exactly on all five. The beat now fires once per
creed that genuinely leaves the parish, and never for one that is coming back.

⇒ **RAISED R-5 (the lane's one design divergence, vetoable):** the packet's mint rule is
amended by one conjunct. Grounds: deep-work's "if the literally-requested approach provably
cannot work, prove it and ship the architecture-consistent version of the intent, and record the
divergence prominently". Shipping the drafted rule would put a receipt in the feed that the next
tick falsifies. The chair may veto; the veto restores a 25-beat metronome.

## §6 · THE OWN-FOOTPRINT GOLDEN — BOTH SIDES, ZERO VIOLATIONS

Captured on DEITY-BEARING fixtures BEFORE any wiring (`laneTEWF8-prewiring-golden.json`, taken
on a tree with zero tracked modifications) and re-captured after
(`laneTEWF8-postwiring-golden.json`):

| arm | states | outcomes | verdict |
|---|---|---|---|
| `absent` ×3 fixtures | sha unchanged | sha unchanged | **DARK BYTE-IDENTICAL** |
| `false` ×3 fixtures | sha unchanged | sha unchanged | **DARK BYTE-IDENTICAL** |
| `lit` n6village | sha unchanged | 11 → 12 | the one beat, additive only |
| `lit` n8village | sha unchanged | 12 → 15 | the three beats, additive only |
| `lit` n6town | sha unchanged | 11 → 11 | no beat — the near-miss negative |

**VIOLATIONS = 0.** Note the lit STATES sha is also unchanged: the mint is purely additive to the
outcome array and mutates nothing.

## §7 · THE THREE §321.2a PLANTS — each convicted, each restored `cmp`-EXACT

Green control before: 20 passed. Green control after all three restores: 20 passed.

| plant | conviction (quoted) | exit |
|---|---|---|
| **P1** dead `KIND_SECTION` key | `a KIND_SECTION key has no minter and no written ruling — a struck or renamed mint must be struck here too, and a row that is meant to outlive its producer needs its §-ref: expected [ 'zz_dead_row' ] to deeply equal []` — plus 2 attributed collateral arms | 3 failed \| 17 passed, TRUE_EXIT=1 |
| **P2** dead key **+ a written ruling** | the minter-totality arm is ABSENT from the failure list — the dead check **CLEARS**; only the 2 attributed collateral arms red | 2 failed \| 18 passed, TRUE_EXIT=1 |
| **P3** a ruling on a MINTED key | `a minter ruling names a key that IS minted — delete the ruling, the exception is spent: expected [ 'pantheon_extinction' ] to deeply equal []` — **alone** | 1 failed \| 19 passed, TRUE_EXIT=1 |

P2 is the one that matters: it is the executed proof that the ruling escape actually works, which
is the half §321.2(a) ordered and the half that did not exist.

## §8 · GATES (all in-shell TRUE_EXIT, self-named logs)

Executed at the ORIGINAL base `27c250f9`, then re-executed at the REBASE base `5d18b4a0`:

| gate | result | exit |
|---|---|---|
| focused battery, 23 files | 306 passed | 0 |
| battery re-run at the rebase base, 24 files | **341 passed, 1 FAILED** → the R-6 finding | 1 |
| §31 anchor preflight, bare | CONVICTED first (1 un-anchored negative at ceiling zero), then 9 passed | 0 |
| mutexed `vitest run tests/lint tests/build` | 5 failed, **every one BANKED**, zero new | — |
| `typecheck:ratchet` (`tsconfig.full.json`) | 173 errors, ceiling 173 | 0 |
| `typecheck:domain:strict` (`tsconfig.domain-strict.json`) | CONVICTED first (+1 TS7006), then 1134/1134 | 0 |
| eslint, every changed path | clean | 0 |
| `validate:packets` at DRAFT / READY / LANDED | 138 packets at each; 139 after the rebase | 0 |

⚠ The banked-red count is **ELEVEN** at this base, not the six the dispatch quoted — measured from
`scripts/.test-ratchet-baseline.json` (`measuredAtSha 4deb4f02`). All five sweep failures map to
banked rows by name.

## §9 · ⛔ THE REBASE, AND THE RED IT SURFACED

WF-1F landed mid-lane (`27c250f9` → **`5d18b4a0`**, *"the last altar names the whole creed"*).
Shared paths: `docs/implementation/INDEX.md` and `docs/implementation/PACKET_MANIFEST.json` only —
it did NOT touch `deityNames.js`, so the resolver the fold uses is unchanged.

Rebased `--onto 5d18b4a0`. ONE conflict, `INDEX.md`, resolved by keeping BOTH rows; the manifest
auto-merged and was checked against the MERGE-DESTROYS-CURES law (139 packets, both members
present, all 18 of my change rows and 8 acceptance cases intact).

**The census tuple was RE-CONVICTED at the new base**, all five figures by placeholder, and came
back byte-identical — proven, not carried.

### ⛔⛔ R-6 — A SECOND, UNDISCOVERED TRANSCRIPTION OF THE KIND CENSUSES

Re-running the battery at the rebase base with `tests/domain/pantheon.test.js` added (because
WF-1F touched it) reddened WF-1c's A5: `expected 379 to be 378`. That pin re-derives the SAME six
figures from its OWN hand-copied ten-entry registry list. **No packet named the file** and the
compile's register table listed only `kindPoolFloors.walker.test.js`. It would have been red at
the original base too — I had simply never run that file, because the packet's battery omitted it.
The rebase is what caught my own miss.

Cured as a DECLARED re-record: FAITH joins the local list, four figures move (11 / 113 / 379, with
`unvoiced` 274 and the divergence 8 both UNMOVED — which is precisely what a desk-bearing kind is
supposed to do), and the title takes the rename door so census cardinality stands still. WF-1c's
own claim is untouched and still asserted three lines above.

⇒ the handwritten count becomes **17 files + the packet = 18**, one above the ruled 12 → 17.
RAISED, not absorbed.

## §10 · STAND-DOWN AND THE OPEN VERIFICATION DEBT

The chair's stand-down (ODQ §355, varying-cast contamination) arrived after the A5 red was found
and before it could be verified. **The A5 cure is EDITED, NOT YET VERIFIED.** Its four figures are
the same values `kindPoolFloors.walker.test.js` convicted at this exact base over the identical
live registries, so they are PLAUSIBLE by derivation and not CONFIRMED by execution.

Owed as the FIRST acts after GO, in order:
1. `npx vitest run tests/domain/pantheon.test.js` — the A5 cure's own proof.
2. The mutexed `vitest run tests/lint tests/build` sweep at the rebase base.
3. The full focused battery at the rebase base (24 files).
4. The one terminal bare gate.

Nothing was banked, no ratchet was updated, and `test:ratchet:update` was never run.

## §11 · TIP FOR CAS

**`cdb906f7`**, parent `5d18b4a0`. One commit. No ref moved, no main-worktree touch, no
`git stash`, nineteen-then-twenty paths staged explicitly and verified before each commit.
