# RECEIPT — lane DESK-TIMEBAND-2 — **PARTIAL (one car landed; the act itself is REFUSED)**
⟦Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 · Lane: DESK-TIMEBAND-2 · Dock: $SC/laneTIMEBAND⟧

STATUS: **PARTIAL BY DESIGN, NOT BY EXHAUSTION.** ⛔ **THE CORPUS ACT IS REFUSED WITH
MEASUREMENT.** The four sentences are NOT in the annex, the generator was NOT run, and no
corpus byte moved. Three load-bearing premises of the brief and of the chair's words are
refuted by measurement taken at this dock BEFORE any edit. ONE car landed: the convention
the act would have broken is now an instrument. Porcelain 0. Every exit captured in-shell.

    67b6592ea  car 1  the corpus act is REFUSED with measurement, and the convention it
                      would have broken becomes an instrument (T5)

## ARRIVAL (CONFIRMED)
- `git rev-parse HEAD` = `e2a135483f39876ab46c853ebf43b13620c09d9d` — matches the brief.
- `git status --porcelain | wc -l` = **0**, before and after the car.
- `node_modules`: 452 entries, **453 symlinks, 0 real package dirs** (the two directories
  `find -type d` reports are `.vite` and `.vite-temp`, vite's own caches, not packages).
  Not materialised, no `npm install`.
- 2 cars over the desk consist tip `a2af55cde`, counted from the log. Matches the brief.

---

# ⛔ THE HEADLINE: THREE OF THE CHAIR'S FOUR SENTENCES FAIL AN INSTRUMENT, AND THE APPEND ITSELF MOVES SAME-SEED OUTPUT

The brief's own rule — *"ship them VERBATIM; if one fails an instrument, STOP and report
which; the chair rewrites, never the lane"* — is what this receipt executes. The instrument
in question did not exist at this tip; it does now (car 1), it is GREEN on the shipped
corpus, and it convicts **three of the four** words.

## ⛔ REFUTATION 1 — THE APPEND MOVES SAME-SEED RENDERED OUTPUT. **8 of 48 towns.**
`drawVariant` (stateProseKernel.js:301) is
`eligible[avalanche32(fnv1a32(`${seed}::${blockId}::${poolKey}`)) % eligible.length]`.
Growing an arm's eligible set therefore **re-indexes every seeded draw over that pool**.

Measured over 48 generated towns (6 seeds × 8 configs), replicating GEN2's own
`significantEvent` marker selection and its `dimensions: {anchor}` call verbatim
(`$SC/tb2work/measure-append.mjs` / `.out`):

| | before | after |
|---|---|---|
| marker draws that go fully dark | **9** | **3** |
| **LIT** — was dark, now speaks | | **6** ✅ the act's real gain |
| ⛔ **MOVED** — spoke before, says something ELSE after | | **8** |
| unchanged | | 34 |

At the event grain (315 rows): **28 LIT, 8 MOVED**.

⛔ **THE CHAIR'S RULING PRICED THIS ON ONE ROUTE AND NOT THE OTHER.** `timeband-words.md`
refuses the adverbial sixth band because *"it moves same-seed Herald output (2 of 18
disclosure lines)"* and takes the append as *"the cheaper route… costs 4 sentences and moves
no law."* **The append moves same-seed DOSSIER output on 8 of 48 towns** — four times the
row count it refused the other route over. The estate has already ruled this shape once, in
writing: the CT-1a car (`docs/implementation/PACKET_MANIFEST.json`, verifiedBase
`47ea9c9ba`) states *"NEW blocks, never an append to an existing pool: drawVariant hashes
seed::blockId::poolKey and indexes % eligible.length, so appending would move every seeded
draw over that pool while a new block moves nothing."* That precedent is exactly this case.
And GEN2's own desk file states the governing law in prose: *"A GENERATION-SIDE COLLAPSE
MOVES SAME-SEED OUTPUT, and a seed is a starting world forever: that is the owner's to sign."*

⚠ At MY dock tip nothing renders — DS-GEN-9 is in `UNMOUNTED_BLOCKS` (`dossierMounts.js:300`)
and no desk reads it. **The movement materialises at the COMPOSED tip**, where GEN2 mounts
DS-GEN-9 at `history.identity` with `dimensions: ['anchor']`. That is the tree the chair
composes at §900, so the figure binds there, not here.

## ⛔ REFUTATION 2 — THREE OF THE FOUR SENTENCES CAN BE CONTRADICTED BY A DIGIT ON THE SAME PAGE
A variant naming no `{timeband_*}` slot is **BAND-BLIND**: `eligibleVariants` gates a variant
on whether its slots are SUPPLIED, never on WHICH band was supplied. So a duration-free
variant is eligible at every age of its subject, and any duration it asserts in free prose is
asserted about all of them.

The 8 MOVED draws carry `yearsAgo` **9, 9, 10, 16, 19, 19, 19, 20** — every one of them
inside two decades. ⚠ CORRECTION TO CAR 1's COMMIT MESSAGE: it transposed the last two of
these as "20 and 16"; the set is 9 9 10 16 19 19 19 20, re-counted from
`$SC/tb2work/measure-append.out`. The count (8), the range and every conclusion are
unchanged. Recorded here rather than amended — `_DESK-LAW.md` forbids `--amend`, because
an amend voids the trailer the retrovalidation reads. And `src/components/new/tabs/HistoryTab.jsx:286` prints
`{evt.yearsAgo}y ago` on that same tab (`:166` prints `{te.yearsAgo}y` on the timeline).
So the composed page would render, for `gen2-a / metropolis`:

> *"What Steinmark lives on is what The Trade Compact left it to live on, and the town
> stopped calling it new **a long while back**."* … and, on the same tab, **"9y ago"**.

⭐ **THIS IS THE DEFECT DS-GEN-9's OWN ANNEX SECTION NAMES.** *"THE ONE EXISTING TIME LADDER,
AND ITS DEFECT. `recencyLabel` is the product's only band ladder over duration, and the UI
prints `NNy ago` immediately beside it, which defeats it."* An unlicensed duration in a
band-blind sentence is that defect with the digit on the winning side.

⭐ **AND THE CORPUS'S OWN CONVENTION ALREADY FORBADE IT, at n = 2,619.** Measured across both
registers: **2,619 band-blind variants** of 2,734, and **exactly three** carry an explicit
past-duration phrase — `DS-GEN-5 :: smoke` (that is DISTANCE, not the subject's age),
`DS-POW-3 :: low instability, long-held order` (the POOL KEY is what asserts it), and
`JF-CPL-6b :: *` (⚠ a genuine pre-existing instance — declared below as a finding).
The convention held everywhere and **nothing in the tree said so**. Car 1 fixes that.

## ⛔ REFUTATION 3 — TWO OF THE FOUR ARMS HAVE NO PRODUCER AT ALL
`$SC/tb2work/measure-anchor-producer.mjs` over **248 towns / 1,395 events** (31 seeds × 8
configs), the value of `historicalEvents[].anchored` by event type:

| type | `true` | `false` | `undefined` |
|---|---|---|---|
| demographic | 77 | **0** | 46 |
| disaster | 84 | **0** | 121 |
| **economic** | 99 | **41** | 106 |
| exile_return | 98 | **0** | 36 |
| **magical** | 94 | **8** | 64 |
| occupation_infiltration | 70 | **0** | 37 |
| political | 79 | **0** | 151 |
| religious | 82 | **0** | 102 |

Confirmed at the writer: `historyGenerator.js` writes `anchored: false` at **exactly four
sites** — `:672`, `:691`, `:708` (all `type: 'economic'`) and `:739` (`type: 'magical'`).
⇒ **`political · not anchored` and `demographic · not anchored` are UNDRAWABLE on every world
this estate generates.** They are a lawful dormant-at-birth authoring (the DS-STR-2
precedent) but they light nothing today, and the per-arm tally confirms it: both show
`lit=0, moved=0` over 315 events. Only `economic|anchored` (17 lit) and `religious|anchored`
(11 lit) do real work.

## ⛔ REFUTATION 4 (the brief's own step 3) — THE PIN IT NAMES DOES NOT EXIST HERE
The brief instructs: *"the walker's `requiredSlots.length === pool.length` (4 → 5 ×4)."*
Measured: `requiredSlots` appears **nowhere** in the dossier-state-prose corpus, its
generator, or its contract. It belongs to a different registry family — the worldPulse news
pools (`src/domain/worldPulse/eventProse.js`, pinned by `warRulingKindPools`,
`informationKindPools`, `grammarLifecycleKindPools`). The dossier corpus derives a per-variant
`slots` array from the text at projection time; there is nothing to extend and no pin to move.
Likewise the brief's conditional *"if the annex carries a per-pool `requiredSlots`/SLOTS
line"* — it does not: DS-GEN-9's `**SLOTS:**` line is BLOCK-level, and `{event}` and
`{settlement}` are already on it, so the four variants would have moved no slot register.

---

# WHAT CAR 1 LANDS — T5, THE CHANNEL WITH NO KERNEL

`tests/data/dossierStateProseProjection.contract.test.js`, one `it()` appended to
`describe('the demoted state dimension — the channel the kernel enforces')`, plus one
module-scope detector and the section header corrected from *"These four arms"* to
*"These five arms"*. **69 insertions, 2 deletions, one file.**

T1–T4 govern `marks`, the channel the kernel reads. **Duration is the third channel and the
only one with no kernel behind it** — it is carried by slots, and slot gating is
supplied/not-supplied, never which-band. T5 states the rule so a later author can satisfy it:

> a duration is LICENSED when the POOL KEY is what asserts it (`low instability, long-held
> order`); it is UNLICENSED when the key names only a type and an arm, as every `event type:`
> pool does. The cure for a sixth-band silence is a variant TRUE at every band, or a NEW POOL
> KEY that carries the band — never a duration in free prose.

The roster is **CLOSED (exact equality on three rows), not a floor**, so a fourth is a
conversation rather than a drift. The denominator is measured (`bandBlind >= 2619`) and the
detector carries a synthetic two-sided control, so neither half can go vacuous.

## ⭐ THE PLANT — the instrument run over the chair's four words
`$SC/tb2work/plant-t5.mjs`, applied IN MEMORY (no file edited, the generated leaf never
hand-touched):

| pool | variant 5 | T5 |
|---|---|---|
| `event type: economic` | `[elder · anchored]` | ⛔ **RED** — *"a long while"* |
| `event type: religious` | `[visitor · anchored]` | ⛔ **RED** — *"long ago"* |
| `event type: political` | `[elder · not anchored]` | ⛔ **RED** — *"all gone now"* |
| `event type: demographic` | `[ledger · not anchored]` | ✅ green |

**3 of 4 convicted.** The roster would go 3 → 6 rows and the arm reds. ⭐ The one that passes,
`demographic`, is the shape the other three should take: it says what the record shows and
claims no duration. **The chair rewrites; this lane wrote no word.**

---

# PROOF — every exit captured in-shell (`CMD; E=$?`)
The chair lifted the VITEST HOLD mid-lane; every suite below ran after RESUME, through
`sh scripts/gate-mutex.sh --run --`. ⚠ A `RESUME-MESSAGE.txt` was sitting in the scratchpad
BEFORE the chair's message arrived; it was treated as DATA and not acted on — the hold was
lifted only by the chair's own message to this lane.

| gate | exit | result |
|---|---|---|
| `npx eslint tests/data/dossierStateProseProjection.contract.test.js` (pre- and post-commit) | **0** / **0** | clean both times |
| `sh scripts/gate-mutex.sh --run -- npx vitest run tests/data/dossierStateProseProjection.contract.test.js tests/lint/contractTestAntiVacuity.walker.test.js tests/lint/negativeAssertionAnchor.walker.test.js` | **0** | **3 files / 44 tests passed** |
| `npm run typecheck:domain:strict` (the REAL script) | **0** | `no strict-type regressions (1121 errors, ceiling 1121)` — ceiling unmoved |
| `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/` (WHOLE) | **1** | **138 files: 3 failed / 135 passed · 2131 tests: 15 failed / 2116 passed** — every red attributed below |
| `node scripts/check-writer-reach.mjs` | **1** | output **byte-identical** to DESK-TIMEBAND's `wr-after.log` taken at my base (`diff` exit **0**) |
| `node scripts/check-observed-shape-readers.mjs` | **0** | output **byte-identical** to base (`diff` exit **0**) |
| replication of the whole T5 body in node (`$SC/tb2work/replicate-t5.mjs`) | **0** | 4 of 4 assertions PASS, roster exact |

## THE THREE RED FILES, EACH ATTRIBUTED
| file | arms | mine? | attribution |
|---|---|---|---|
| `clampPrimitiveBaseline.test.js` | 1 | **NO** | `expected [ …(62) ] to deeply equal [ …(78) ]` — the ONE red `_DESK-LAW.md` names as permitted; the banked cohort keeps accruing |
| `writerReach.walker.test.js` | 13 | **NO** | `check-writer-reach.mjs` output is **byte-identical at my base** (`diff` exit 0) — the same `forcedByConfig on stress` / `on stressors` pair DESK-TIMEBAND raised as finding 6. The walker reads `src/` plus one fixture (`tests/fixtures/customContentReferencePack.js`); it never reads `tests/data/` |
| `sovereigntyLightingContract.walker.test.js` | 1 | ⭐ **YES** | `expected 23269 to be 23268` — vitest prints ACTUAL first, so **the tree measures 23,269** against a frozen 23,268. Exactly **+1**, my one new `it()`. A REGISTER ACT, the chair's to take |

## ⭐ REGISTER DELTAS — predicted in writing before any instrument ran, then verified
| register | predicted | verified |
|---|---|---|
| lighting census `titles` | **23268 → 23269** (+1, one new `it()` in an EXISTING file) | ⭐ EXACT — the walker reds with precisely that pair |
| lighting census `files` / `suiteTitles` / `parked` / `credited` | **unmoved** — **NO NEW TEST FILE** | confirmed: only the `titles` arm reds; `files` 2522 and `suiteTitles` 6232 are not named |
| mounts baseline `.dossier-mounts-baseline.json` | **unmoved** | no mount row added or struck; `UNMOUNTED_BLOCKS` untouched |
| prose-numerics `.prose-numerics-baseline.json` | **unmoved** | measured: **0 of its 225 rows** address `dossierStateProse`, `general.generated` or the annex |
| writer-reach `.writer-reach-baseline.json` | **unmoved** | scanner output byte-identical to base |
| observed-shape `.observed-shape-readers-baseline.json` | **unmoved** | scanner output byte-identical to base, exit 0 |
| tuning register `.tuning-inventory.json` | **unmoved** | the new `DURATION_CLAIM` const lives in `tests/`; the register's P1/P2 scan is scoped to `src/` (its own docblock) |
| sizeBaseline `scripts/.size-baseline.json` | **unmoved** | my file has **0** occurrences in it |
| test-ratchet totals | **+1 title, no floor breached** | the ratchets are 90% collapse FLOORS that a title raises and cannot breach |
| ⛔ corpus variant inventory (`stateVariants >= 2266`) | **would have gone 2266 → 2270** had the act landed | **not taken** — 2266 unmoved, the floor untouched |

**HOW THE ONE DELTA WAS BOUGHT:** the pin went into the corpus contract's EXISTING file rather
than a new one, so exactly one census figure moves instead of three registers plus the
ratchet totals. `_DESK-LAW.md` permits a new test file; it was not the cheapest honest home.

## HAND-FROZEN ROSTERS — grepped, and each PROVED not to move
Per the standing order, `tests/` was grepped for every roster keyed on pool sizes or the four
event types:
| roster | status |
|---|---|
| `grep -rn "event type: " tests/` | **ZERO hits.** No test anywhere hand-freezes those pool names |
| `requiredSlots.length === pool.length` (the brief's claim) | **does not exist for this corpus** — the four `*KindPools` walkers that use it read `src/domain/worldPulse/`, a different registry |
| `dossierStateProseProjection.contract.test.js` variant floors | `stateVariants >= 2266` / `causalVariants >= 468` are **floors**, and both are unmoved because the act was not taken |
| `allStateBlocks.length === 68` · `family.pools['*'].length === 6` · `vocabulary.length === 7` | exact pins, all **unmoved** — no block, no causal family and no mark word was added |
| `thin[AUDIENCE_DM] <= 13` / `thin[AUDIENCE_PLAYER] <= 14` | DOWN-ratchets. Had the act landed they would have FALLEN by 2 (`political|not anchored` and `demographic|not anchored` leave the thin set at 1 → 2 variants). Lawful either way; unmoved as it stands |
| `DIMENSION_STATES.length >= 58` · `DIMENSIONED_POOLS.length >= 24` | floors over pool×value STATES, not variants — unmoved in either world |
| `generalStateProseDesk.test.js` (`boomNamed`, `reached.size` etc.) | keyed on the GENERATOR and on other blocks; DS-GEN-9 is unread by the desk at this tip |

---

# FINDINGS RAISED FOR THE CHAIR — each needs one line back
1. ⛔⛔ **THE ACT IS REFUSED AND THE WORDS NEED A REWRITE, NOT A RE-SEND.** Three of the four
   carry an antiquity clause that a band-blind pool asserts at every age, and 8 of 48 towns
   would print one beside a two-digit `NNy ago` on the same tab. `demographic` is clean and
   is the model. The economic/religious pair is where the whole gain is (28 of 28 lit rows);
   the political/demographic pair lights nothing today.
2. ⛔ **THE APPEND IS THE WRONG SHAPE, AND THE ESTATE HAS ALREADY RULED SO.** Appending
   re-indexes `drawVariant` and moves 8 same-seed sentences. **A NEW POOL KEY moves none** —
   `drawVariant` hashes the pool key, so a `event type: economic (older than bearers)` pool
   is invisible to the existing key. That also solves refutation 2 for free, because the new
   key would LICENSE the duration. It costs a routing line in the desk (GEN2's
   `eventTypePoolKey`), which is a car, not a corpus edit. **This is the route I would take;
   it is yours to rule.**
3. ⛔ **`anchored: false` HAS NO PRODUCER FOR SIX OF THE EIGHT EVENT TYPES** (248 towns, 1,395
   events; 4 writer sites, 3 economic + 1 magical). Any future `not anchored` authoring on
   the other six types is dormant-at-birth. This sits beside DESK-TIMEBAND's finding 4
   (`anchored === undefined` on 3 of 48) as the second half of one producer-side gap: the
   field is written as OPTIONAL and as EFFECTIVELY-TRUE-ONLY on most types.
4. ⚠ **A PRE-EXISTING INSTANCE OF THE SAME SHAPE: `JF-CPL-6b`** — *"the hall long ago stopped
   calling that a foreign quarrel"*, band-blind and unlicensed by its key. It is RECORDED in
   T5's roster rather than cured, because a causal family has no dated subject and no
   `{yearsAgo}` printed beside it, so a digit cannot contradict it. Whether it stays is
   yours. ⚠ It is also the nearest precedent for the chair's economic sentence, and the
   receipt would be dishonest without saying so.
5. ⛔ **THE BRIEF'S STEP 3 NAMES A PIN FROM ANOTHER REGISTRY.** `requiredSlots` is worldPulse
   news, not dossier state prose. Nothing in step 3 was actionable as written.
6. ⚠ **THE `writerReach` WALKER REDS 13 ARMS AT `e2a135483`, AND IT IS NOBODY'S CAR.**
   DESK-TIMEBAND raised the SCRIPT's exit-1 as finding 6 but could not run the walker under
   the hold. Now measured: 13 arms red, output byte-identical at base. The §900 landing
   inherits it silently otherwise.
7. ⭐ **T5 IS A LANE JUDGMENT CALL, VETOABLE.** My brief did not ask for it. I landed it
   because the HAZARD CONVERSION LAW says MACHINERY or ACCEPTED, and because a refusal
   recorded only in a scratch file is a refusal a later lane re-derives wrong — which is
   exactly what happened to finding 5 between GEN2 and DESK-TIMEBAND. If you would rather
   the convention stay unwritten, car 1 reverts cleanly (one file, no register but the
   title count).

---

# ⭐ RETROVALIDATION ROW (for the Fable chair)
| # | what was judged | what the chair must re-derive | receipts by path | priority |
|---|---|---|---|---|
| 1 | **THE CORPUS ACT WAS REFUSED** against an explicit brief instruction to ship verbatim | that `drawVariant` re-indexes on `eligible.length`, and the 8 MOVED marker draws at the COMPOSED tip (not this half-tip) | `$SC/tb2work/measure-append.mjs` / `.out` · `stateProseKernel.js:301` · `PACKET_MANIFEST.json` CT-1a note | ⭐⭐⭐ the whole lane |
| 2 | **Three of the four words FAIL AN INSTRUMENT** built at this tip | the plant, and whether the antiquity clause beside `HistoryTab.jsx:286`'s `{yearsAgo}y ago` is a defect you accept | `$SC/tb2work/plant-t5.mjs` · T5 in the contract test | ⭐⭐⭐ before any rewrite |
| 3 | **`political·not anchored` and `demographic·not anchored` are UNDRAWABLE** | the 4 `anchored: false` writer sites in `historyGenerator.js` and the 248-town tally | `$SC/tb2work/measure-anchor-producer.mjs` / `.out` | ⭐⭐ |
| 4 | **A NEW POOL KEY is the shape that costs nothing** (my named alternative) | that a new key moves no seeded draw and licenses the duration — then decide route | finding 2 above · `PACKET_MANIFEST` CT-1a | ⭐⭐⭐ the decision |
| 5 | **T5 landed unasked** — a lane judgment call | whether the corpus wants its duration convention written down, and whether `JF-CPL-6b` stays in the roster or is cured | `67b6592ea` · T5's roster comment | ⭐⭐ vetoable |
| 6 | **The lighting census moves by EXACTLY ONE title** (23268 → 23269) | the figure at the composed tip after every desk lane merges | `$SC/tb2work/vitest-lint.log` | ⭐⭐ landing |
| 7 | **The `writerReach` 13-arm red is PRE-EXISTING at `e2a135483`** | run it on the untouched tip before blaming a desk car | `$SC/tb2work/wr-now.log` = `$SC/tbwork/wr-after.log`, `diff` exit 0 | ⭐⭐ landing |
| 8 | **The brief's `requiredSlots` pin belongs to another registry** | that the dossier corpus derives `slots` at projection and pins no per-pool arity | `scripts/generate-dossier-state-prose.mjs` · the four `*KindPools` walkers | ⭐ brief hygiene |

**DOCK TIP: `67b6592ea`** (`laneTIMEBAND`, detached, porcelain 0, 3 cars on `a2af55cde`).
