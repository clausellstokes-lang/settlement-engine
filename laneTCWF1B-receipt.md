# laneTCWF1B — WF-1b COMPILE RECEIPT

**Lane:** TC-WF1B, read-only OPUS COMPILE lane under ODQ §291.5, dispatched by ODQ **§308.4**.
**Committed nothing, edited nothing in the repo, staged nothing, ran no gate, no `npm run check*`,
no `gate-mutex.sh`, no git write of any kind.** Every read was against the COMMIT TREE at
`9d851fae` via `git show "<sha>:<path>"` / `git grep <pattern> 9d851fae`, never the working tree,
which matches no branch.

---

## OUTCOME, FIRST

**Two DRAFT packets are compiled and priced. The chartered one-member WF-1b is REFUSED by
arithmetic on two hard caps at once; the recommended shape is a two-member split whose boundary
sits ONE DELIVERABLE away from §308.3's default, and the reason is measured rather than
stylistic — the default boundary lands `suppressedAtTick` in a member where nothing reads it,
which is verbatim the orphan persisted key `WF-1A` §0 refused to mint.**

| deliverable | path |
|---|---|
| `WF-1b-i` — the mechanism (tick threading, single-writer helper, `suppressedAtTick`, the flag-forked prune key) | `draft-WF-1B-I.md` |
| `WF-1b-ii` — the voice (the extinction obituary beat and its registration) | `draft-WF-1B-II.md` |

Three findings dominate, all CONFIRMED by execution:

1. ⭐ **THE TICK THREADING IS CHEAPER THAN THE FAMILY'S OWN ESTIMATE, AND ZERO OF THE FIFTEEN TEST
   CALL SITES NEED EDITING.** `attemptEntry` already carries a defaulted `opts` bag; a defaulted
   third parameter on `resolvePatronContest` is additive. The fifteen-call-site census is real and
   is confirmed exactly — it is a *battery* obligation, not a *diff* obligation.
2. ⛔⛔ **THE OBITUARY BEAT IS NOT "ONE HERALD DESK KIND, FIVE REGISTRATION HOMES". THE FAITH FAMILY
   HAS NO KIND REGISTRY AT ALL.** The estate carries ten kind registries and thirteen per-family
   kind-pool walkers; none is FAITH. Two of the five registration homes are files that do not
   exist, and minting them makes FAITH the estate's SECOND one-row family — a state a landed
   walker exists specifically to force into review.
3. ⛔ **A FIXTURE HAZARD THE ANNEX DOES NOT CARRY, CAUGHT BY RUNNING THE FIXTURE.** `nicheOf` is a
   COMPUTED niche. An incumbent with a hand-authored `niche` string routes the same-niche push-out
   to `open_slot`, suppresses nothing, and the pin passes green having asserted nothing. Executed
   both arms.

---

## §1 · BASE, AND WHAT WAS RE-EXECUTED

| item | measurement | command | status |
|---|---|---|---|
| base | `9d851faeb7cac73217d508f621d1d9ee29f2c145` — *"docs(WF): the family preamble and stamped substrate annex land…"* | `git log -1 --format='%H %s' 9d851fae` | **CONFIRMED** |
| preamble SHA-256 | **`cd067ba1ce41232a99dee9a7247f4c82d47fbe2b4fd9bb8599784d4a33136211`** — matches the brief and ODQ §308.1 exactly | `git show 9d851fae:docs/implementation/preambles/WF-PREAMBLE.md \| shasum -a 256` | **CONFIRMED** |
| annex window | `f8d978df..9d851fae` returns exactly **3 paths**, all `docs/**` (the volume, the preamble, the annex) ⇒ **DOCS-ONLY**, so annex rows are citable under their own consumption law | `git diff --name-only f8d978df 9d851fae` | **CONFIRMED** |
| ⭐ the copy divergence | **CLOSED at this base.** The BUILD copy of the volume is now **846 lines** — the ledger blob's length — not the pre-cure 774. ODQ §308.2 re-folded it. R-WF-1's STOP cannot fire on a compile at `9d851fae` | `git show 9d851fae:docs/DESIGN_FP_ARCH_WF.md \| wc -l` | **CONFIRMED** |
| §78 stamp / member cap | preamble §P10: **STAMPED**, engine trains cap at **EIGHT** | read | **CONFIRMED** |

⛔ **No absolute was inherited.** Every substrate row either packet depends on was re-executed at
`9d851fae`, and the two that had drifted are flagged in §6.

---

## §2 · THE THREE SUPPRESSION SITES AND THE THREADING COST — RE-EXECUTED

`git grep -n "suppressed" 9d851fae -- src/domain/worldPulse/religionState.js`

| # | address | function | branch | **CONFIRMED** |
|---|---|---|---|---|
| 1 | `:262` | `attemptEntry` | `same_niche_pushout` | ✓ |
| 2 | `:277` | `attemptEntry` | `cross_niche_eviction` | ✓ |
| 3 | `:485` | `resolvePatronContest` | the `patronSiegeTicks >= PATRON_FLIP_TICKS` loop | ✓ |

Signatures verbatim: `:242 export function attemptEntry(state, deity, newcomerStrength, opts = {})`
· `:444 export function resolvePatronContest(state, rng)`. Neither takes a tick; the record carries
none. **CONFIRMED.**

`git grep -n "attemptEntry\|resolvePatronContest\|advanceShares" 9d851fae -- src scripts tests`,
counting **invocations**, not mentions:

| symbol | `src` | `scripts/` | tests | total |
|---|---:|---:|---:|---:|
| `attemptEntry` | 1 (`religiousContest.js:763`) | 0 | **8** (`religionState.test.js` `:56,:64,:72,:80,:89,:96`; `religionTier2.test.js` `:85,:89`) | 9 |
| `resolvePatronContest` | 1 (`religiousContest.js:811`) | **2 call sites, 1 file** (`religion-balance.mjs:36,:51`) | **7** (`patronContest.test.js` `:30,:38,:49,:94`; `religionTier2.test.js` `:26,:36,:46`) | 10 |
| `advanceShares` | 1 (`religiousContest.js:783`) | 1 (`religion-balance.mjs:49`) | 3 (`religionState.test.js` `:116,:129,:130`) | 5 |

**8 + 7 = 15 test call sites — the inherited figure CONFIRMED exactly.** The `scripts/audit/` caller
with two call sites, which a `src`-only census misses, CONFIRMED.

⭐ **THE COST CORRECTION (new; neither `WF-1A` §13 nor preamble R-WF-6 states it).** `WF-1A` prices
this as *"a signature change to TWO exported functions with live callers"*. Measured: `attemptEntry`
**already takes a defaulted options bag**, so `tick` joining it is not a signature change at all,
and `resolvePatronContest` can take a **defaulted trailing parameter**, which is additive. ⇒ **zero
of the fifteen test call sites and zero of the two script call sites must be edited.** The census is
a battery obligation; the diff reaches two files. This is the single largest cost reduction in the
compile and it is why `WF-1b-i` fits the DEFAULT budget with five handwritten files of headroom.

`advanceShares`'s return can be widened because **all five call sites are bare expression
statements** — no caller reads it today. **CONFIRMED** by reading each site.

---

## §3 · THE PRUNE FORK, PRICED BOTH WAYS (preamble R-WF-6 item 3 requires this)

`pruneSuppressed` at `:353` is **UNEXPORTED**, its `KEEP = 3` is a **function-local const**, and its
ONE caller is `:312`, the last statement of `advanceShares`. **CONFIRMED.**

| | thread through `advanceShares` (**RECOMMENDED**) | lift the prune out |
|---|---|---|
| measurable signature | `advanceShares(state, strengthByRef, opts = {})` | `export function pruneSuppressed(state, opts)` + delete the `:312` call |
| call sites that MUST change | **1** | **1** |
| call sites whose **BEHAVIOUR** changes | **0** | ⛔ **4** — `religion-balance.mjs:49` and `religionState.test.js:116/:129/:130` silently stop pruning |
| dark behaviour | identical everywhere | ⛔ changed for four non-fold callers, **outside any flag** |
| new export surface | 0 | 1 (a `requiredSymbols` obligation on every later train) |

⛔ **Lifting the prune out is an UNGATED DARK-BEHAVIOUR CHANGE to a shared exported function.**
Refused on that measurement. **CONFIRMED** — the four affected call sites were read individually.

---

## §4 · THE FIXTURE PROBE — RUN BEFORE ANY PIN WAS WRITTEN (standing chair law)

Executed against the `9d851fae` blob tree (`git archive 9d851fae src | tar -x -C <scratchpad>`),
**not** the working tree — which was measured and DOES diverge: `relationshipState.js` (320 diff
lines), `constants.js` (16), `piety.js` (39), `patronFall.js` (159). `religionState.js` itself is
byte-identical to the blob, which is exactly the kind of partial match that would have made a
working-tree run look safe. Scripts: `laneTCWF1B-probe.mjs`, `laneTCWF1B-probe2.mjs`,
`TRUE_EXIT=0` captured in-shell for both.

```
== TUNING == SHARE_STEP_MAX 6 · PATRON_HOLD 0.35 · PATRON_FLIP_MARGIN 6 · PATRON_FLIP_TICKS 3
             PUSH_MARGIN 1.1 · EVICTION_MARGIN 1.5 · LEGIT_ORGANIC_CONTEST 0.3

nicheOf(bare snapshot) = "neutral:neutral"

SITE :262 (niche via nicheOf)   -> {"entered":true,"path":"same_niche_pushout","evicted":"d.A"}  A.suppressed=true  A.share=0  A.standing=cult
SITE :262 (hand-authored niche) -> {"entered":true,"path":"open_slot","evicted":null}            A.suppressed=false
SITE :262 NEGATIVE (claim 50)   -> {"entered":false,"path":"niche_held"}                          A.suppressed=false
SITE :262 FORCED                -> {"entered":true,"path":"same_niche_pushout","evicted":"d.A"}  A.suppressed=true
SITE :277                       -> {"entered":true,"path":"cross_niche_eviction","evicted":"d.W"} W.suppressed=true
SITE :485 tick 1 owned=true siegeTicks=1 patron=d.A A.suppressed=false
SITE :485 tick 2 owned=true siegeTicks=2 patron=d.A A.suppressed=false
SITE :485 tick 3 owned=true siegeTicks=0 patron=d.B A.suppressed=true
SITE :485 tick 4 owned=false

PRUNE suppressed=3 deleted=[]
PRUNE suppressed=4 deleted=[d.S3]
PRUNE suppressed=5 deleted=[d.S3,d.S4]

ORGANIC (0.1/0.9 split) tick 1 A=55 B=45 · tick 2 A=50 B=50 · tick 3 A=45 B=55 challenge=1
                        tick 4 A=40 B=60 challenge=2 · tick 5 A=35 B=65 patron=d.B
```

**Four results are load-bearing and all are CONFIRMED:**

1. ⛔⛔ **NEW HAZARD — `nicheOf` IS COMPUTED, AND THE OBVIOUS `:262` FIXTURE CANNOT EXECUTE ITS OWN
   DEFECT.** `nicheOf(d)` is `` `${deityTemper(d) || 'neutral'}:${d?.alignmentAxis || 'neutral'}` ``
   (`cultImpositionApply.js:35-37`). An incumbent carrying a hand-authored `niche: 'harvest'` never
   matches the newcomer's computed niche: `attemptEntry` falls through to `open_slot`, evicts
   nothing, suppresses nothing — **and a `:262` pin written from the design text alone passes green
   having asserted nothing.** This is a new instance of the estate's canonical vacuity class, it is
   in neither the annex nor `WF-1A`, and it is now A1's executed both-arms proof. **Worth a memory
   entry.**
2. ⭐ **THE SIEGE RETURNS `owned=true` FOR TWO TICKS BEFORE IT SUPPRESSES ANYTHING.** Ticks 1 and 2
   own the seat with `A.suppressed=false`; only tick 3 (`PATRON_FLIP_TICKS`) suppresses. A `:485`
   pin that asserts "the contest owned the seat ⇒ the rival is stamped" is **false for two thirds of
   the fixture's ticks**. A3 asserts both arms.
3. ⭐ **RAISED-4 IS EXACT, AND THE BEAT IS PER DELETED CREED.** The bar is literally
   `supp.length > KEEP`: three deletes nothing, four deletes one, five deletes two. The volume's
   *"asserts the beat fires ONCE"* pin therefore requires a fixture seeded at **exactly four**, and
   the five-case is the arm that catches a mint hoisted out of the deletion loop.
4. **The family's fixture-scale hazard, re-measured:** an organic seat flip on a 0.1/0.9 strength
   split takes **five** ticks, not the ~4 `WF-1A` estimates.

---

## §5 · THE OBITUARY BEAT'S REAL REGISTRATION COST — THE MEASUREMENT THAT DECIDES THE SPLIT

⛔⛔ **THE FAITH FAMILY HAS NO KIND REGISTRY.** `tests/lint/kindPoolFloors.walker.test.js`'s
`REGISTRIES` array holds **TEN** families — WAR_DISPOSITION, WAR_LINEAGE, WAR_COST, WAR_RULING,
WAR_COALITION, ENVOY, COMMERCIAL, GRAMMAR, SOVEREIGNTY, INFORMATION. `git ls-tree` over `tests/lint`
finds **thirteen** per-family kind-pool-class walkers, each with a
`scripts/mutation-coverage-manifest.json` row (554 entries total). **None is FAITH.** **CONFIRMED.**

Of GR-PREAMBLE §P2's five registration homes for a Herald DESK kind, **two are files that do not
exist** (the pool and the kind registry). The other three exist.

**Executed literals that move**, each an exact equality:

| literal | at `9d851fae` | on a FAITH desk kind |
|---|---:|---|
| `REGISTRIES` length | **10** | 11 |
| the small-family exact list | **`['INFORMATION']`** | ⛔ **two members** |
| `REGISTERED_KIND_COUNT` | **112** | 113 |
| `ROUTED_TOKENS` | **378** | 379 |
| registered − routedAndRegistered | **8** | holds at 8 only if BOTH rows land |
| `LEGACY_UNVOICED_TOKENS` | **274**, asserted **shrink-only** | reds if the kind routes with no registry row |

⛔ **BOTH CHEAP DOORS ARE CLOSED.** `heraldRouting.js:357-358` routes `faith_*` with no
`EXACT_SECTION` row — but the walker's own comment says *"A kind routed WITHOUT a registry row (or a
desk-bearing kind registered without routing) still breaks it"*, and the shrink-only
`LEGACY_UNVOICED_TOKENS` closes the `pantheon_twilight`-style legacy road. **A desk-bearing FAITH
kind owes both rows.**

⭐ **AND THE SECOND SMALL FAMILY IS A DESIGNED REVIEW GATE.** The walker asserts
`REGISTRIES.filter(([, rows]) => rows.length < 5).map(([name]) => name)).toEqual(['INFORMATION'])`
under a comment stating that naming the sole exception *"makes a SECOND small family a visible,
reviewed act rather than a number that quietly slipped."* A one-row FAITH registry **is** that second
small family.

⭐ **THE LINES ARE CHEAP; THE FILES ARE NOT.** eslint `Linter`, `max-lines {skipBlankLines:true,
skipComments:true}`, over the IN-1c-a precedent at this base: `informationNews.js` **50 eff**,
`informationReceiptPools.js` **13 eff** (against a 250-per-leaf cap); `sovereigntyNews.js` **313**,
`sovereigntyReceiptPools.js` **125**. **The beat breaks a file-count cap, not a line cap** — which is
why no amount of tight authoring fixes it.

⭐ **ONE COST THE COMPILE EXPECTED AND DID NOT FIND:** `LAYER_PATTERNS.FAITH`'s first regex is
`/^src\/domain\/worldPulse\/(?:faith|sacred|religion|pantheon|conversion|piety|deity|temple)/`, so
**`faithNews.js` and `faithReceiptPools.js` are claimed already** — no `LAYER_PATTERNS` row, no
`ARGUED_UNLAYERED` entry, both coupling ceilings still. The exact opposite of `patronFall.js`, which
was named for the EVENT and surprised WF-1a at the terminal gate. ⛔ **The filenames are therefore
load-bearing and a rename to `obituaryNews.js` would mint two unlayered modules against a
zero-headroom baseline.** Recorded in both packets.

---

## §6 · MEASUREMENTS TABLE — every figure with its command

*All effective lines: `laneTCWF1B-measure-eff.mjs`, importing the repo's own
`node_modules/eslint/lib/api.js` `Linter` and feeding it `git show 9d851fae:<path>` under
`max-lines { max: 1, skipBlankLines: true, skipComments: true }`, reading the count out of the rule's
own message. **14 files, `TRUE_EXIT=0` captured in-shell.** Never `wc -l`.*

| subject | measured at `9d851fae` | vs annex/`WF-1A` | status |
|---|---:|---|---|
| `religionState.js` | **356** / 800 | 356 — STANDS | CONFIRMED |
| `religiousContest.js` | **468** / 800 | 468 — STANDS | CONFIRMED |
| `patronFall.js` | **28** | 28 — STANDS | CONFIRMED |
| `heraldRouting.js` | **268** / 800 | 268 — STANDS | CONFIRMED |
| `settlementRumors.js` | **508** / 800 | 508 — STANDS | CONFIRMED |
| `chroniclersLetter.js` | **220** / 800 | not in the annex | CONFIRMED (new) |
| `informationNews.js` / `informationReceiptPools.js` | **50** / **13** | not in the annex | CONFIRMED (new) |
| `sovereigntyNews.js` / `sovereigntyReceiptPools.js` | **313** / **125** | not in the annex | CONFIRMED (new) |
| `peaceTerms.js` | **797** / 800 | 797 — STANDS, ZERO-HEADROOM-CLASS | CONFIRMED |
| `warTermination.js` | **818** vs frozen **818** | STANDS, ZERO headroom | CONFIRMED |
| `simulationRules.js` | **310** / 800 | 310 — STANDS | CONFIRMED |
| `subsystemRowsVirtual.js` | **723** / 800 | 723 — STANDS | CONFIRMED |
| lighting census tuple (`sovereigntyLightingContract.walker.test.js:4848`) | **`files 2484 · parked 364 · credited 2120 · titles 20598 · suiteTitles 5767`** | annex WF-S070 — STANDS | CONFIRMED |
| `UNLAYERED_BASELINE_CEILING` / `ARGUED_ROSTER_CEILING` | **179** (`:646`) / **20** (`:612`) | STANDS | CONFIRMED |
| `ENGINE_GATED_VIRTUAL_RULE_KEYS` | **24** members; `faithUnseatingEnabled` is the **10th** (0-based index 9) | annex WF-S060 — STANDS | CONFIRMED |
| flag-domain census (`coveringArrayCoverage.test.js`) | `governed` **25** `:165` · `ungoverned` **32** `:166` · `virtual` **24** `:167` · `union` **81** `:169` · `union − governed` **56** `:174` · `nonBoolean` **13** | STANDS | CONFIRMED |
| `PACKET_MANIFEST.json` | **129 rows — 128 LANDED, 1 SUPERSEDED, ZERO non-terminal** | `WF-1A` measured 115; grown | CONFIRMED |
| `.prose-numerics-baseline.json` | **6** rows key `religiousContest.js`, at lines **894** and **926**, three categories each; **0** rows key `religionState.js` | matches `WF-1A` M12's re-address | CONFIRMED |
| edge-shared closures | `aiCharter` 110 inputs · `aiOutputSchema` 111 · `aiGrounding` 66 · `analyticsEvents` 2 · `intentAtlas` 2. **Neither `religionState.js` nor `religiousContest.js` nor any beat-touched display module is in ANY closure**; only `simulationRules.js` is, and neither packet touches it | derived from the metas' own `inputs`, never re-typed | CONFIRMED |
| `CONDITIONAL_LEDGER_KEYS` | `religionStates` is member **2**; the array's comment says the order IS the serialized key order, APPEND-ONLY | STANDS | CONFIRMED |
| `WORLD_SNAPSHOT_HARD_DENY` | contains `religionStates`; the public allowlist is `['pantheon']` only | not in the annex | CONFIRMED (new) |
| the `{to:2}` religionStates migration | `worldState.js:259-287`, spreads `...rest` ⇒ a new sub-key survives | STANDS | CONFIRMED |
| `suppressedAtTick` in `src` | **ZERO hits** | STANDS | CONFIRMED |
| DS-FTH-3 signature | binds `deities{share, standing, legitimacy, niche, tenure, suppressed, covert}` — ⚠ **`suppressedAtTick` is NOT among them**, while the unbuilt `covert` is | annex WF-S045 quoted it; the ABSENCE is not called out there | CONFIRMED (new reading) |
| `faithUnseatingEnabled` wiring | manifest row `simulationRules.js:250`; certification row `subsystemRowsVirtual.js:1248`; **exactly ONE by-name gate read**, `religiousContest.js:823`. **No preset declares it** (`git grep` over `src/config`, `src/data`, `scripts` → zero) | STANDS | CONFIRMED |
| pool floor derivation | `CHRONIC_FLOOR = 8`, `CADENCE_STEP = 2`, classes `(routine, notable, major)` ⇒ **major floors at FOUR** | matches SP-6 | CONFIRMED |
| `scripts/.test-ratchet-baseline.json` | `entries` **11** banked failures against `testRatchet.test.js`'s `CEILING = 17`; `totalTests` **28274**, `totalFiles` **2387** (FLOORS) | — | CONFIRMED |

⚠ **A MEASUREMENT CAVEAT WORTH RECORDING.** A naive regex over
`ENGINE_GATED_VIRTUAL_RULE_KEYS` returns **25**, because a quoted token inside an in-array comment
is captured. The correct figure is **24**, matching `coveringArrayCoverage.test.js`'s `virtual`
literal, and it is reached only by stripping line comments first. This is the estate's recorded
"comment lines fire ratchets" class showing up on the *measuring* side.

---

## §7 · THE SPLIT, PRICED — THE ANSWER TO §308.3

| limit (PACKET_STANDARD default) | **Shape 1** ONE member | **Shape 2** §308.3 default i / ii | **Shape 3** RECOMMENDED i / ii |
|---|---:|---:|---:|
| behavior families 1 | 2 ⛔ | 1 / 1 ✓ | 1 / 1 ✓ |
| new logic-bearing leaves ≤2 | 2 AT CAP | 0 / 2 AT CAP | 0 / 2 AT CAP |
| existing logic files modified ≤3 | 2 ✓ | 2 / 2 ✓ | 2 / 2 ✓ |
| registration-only files ≤3 | 3 AT CAP | 0 / 3 AT CAP | 0 / 3 AT CAP |
| **handwritten files ≤12** | **16 ⛔ +4** | **6 ✓ / 15 ⛔ +3** | **7 ✓ / 14 ⛔ +2** |
| effective production lines ≤400 | ~110 ✓ | ~30 / ~85 ✓ | ~45 / ~70 ✓ |
| **acceptance cases ≤8** | **≥11 ⛔** | 6 ✓ / 7 ✓ | **8 ✓ / 7 ✓** |
| **overrides needed** | **TWO** | **ONE** (ii: 12→15) | **ONE** (ii: 12→14) |
| ⛔ orphan persisted key | none | ⛔ **YES** | **none** |
| i's census delta | +1/+0/+1/+N/+1 | `+0/+0/+0/+6/+0` | **`+0/+0/+0/+8/+0`** |

**Shape 1 REFUSED by arithmetic** on two hard caps simultaneously — the same refusal-in-part shape
chartered WF-1 already took (preamble R-WF-8). PACKET_STANDARD binds: *"the agent stops and proposes
the smallest split. The agent may not quietly renegotiate the budget."*

**Shape 3 RECOMMENDED.** It differs from §308.3's default by exactly one deliverable — the
flag-forked prune key moves from ii into i — and the grounds are measured:

- ⭐ **it removes an orphan persisted key.** `WF-1A` §0 deferred `suppressedAtTick` out of WF-1a
  precisely because *"landing the field in WF-1a would mint an orphan persisted key and a prune-order
  behaviour change nothing observes."* The prune key IS the field's only consumer. The default
  boundary separates them again;
- it gives i's mandatory lit-mutant control a **behaviour** to see, not just a field;
- it **shrinks ii's required override** from `12 → 15` to `12 → 14`;
- it costs i one handwritten file (6 → 7) and two acceptance cases (6 → 8), both inside the default
  budget with headroom;
- **the promotion topology is unchanged**: i and ii share `religionState.js` and
  `religiousContest.js` under either boundary, so serial promotion applies identically (§P7.14).

**Both members ride under the landed `wf-1` flag structure and light nothing.** Neither mints a flag,
so the FIVE-obligation flag bill is NOT INCURRED in either: `ENGINE_GATED_VIRTUAL_RULE_KEYS` does not
move, the three SEQUENCED `coveringArrayCoverage` literals hold at 24 / 81 / 56, and
`contributionLedgerShape`'s literal holds at 24. WF-1b-i adds a **second by-name read** of
`faithUnseatingEnabled` (the landed one at `religiousContest.js:823` is the first) and no registry
row anywhere.

---

## §8 · CENSUS PLAN (authorizing decision named per ODQ §299.4 — this compile's authorization is §308.4)

**WF-1b-i** — ⭐ **mints NO test file.** The battery extends `tests/domain/patronFall.test.js`, which
is already credited and carries ONE literal `describe`; new `it` calls go inside it. Predicted delta
from `2484/364/2120/20598/5767`: **`files +0 · parked +0 · credited +0 · titles +8 · suiteTitles
+0`**. Because `files` does not move, the SEQUENCED census cannot stop at its first figure and hide
the rest. The tuple is re-derived WHOLE in the same commit and decomposed per file. **No interior
red.**

**WF-1b-ii** — mints `tests/lint/faithKindPools.walker.test.js`. Predicted **`+1/+0/+1/+T/+1`**.
⛔ **This is a PLANNED interior red and must be named in the train plan BEFORE it exists** (§P7.15).
`suiteTitles` is proved SEPARATELY by grepping the whole diff over `tests/` for added `describe(`
lines against an exact predicted count, because a sequenced census that reds at `files` never
executes the later figures.

**Extend, never mint** is honored throughout: every WF-1b-i title lands in an existing file, and the
one new file in ii exists because the estate's other ten registry families each have one and
`kindPoolFloors` alone does not carry the family's own both-directions arm.

⛔ **Neither packet censuses an honest red.** A failing walker is a DISABLED GUARD, never census debt;
where a cure is gated, the identity is left red-with-attribution and ESCALATED (§P5).

---

## §9 · RAISED — for the chair (each judgment-dense; none decided by this lane)

**RAISED-A · THE SPLIT BOUNDARY (the recommendation, with the veto stated).** Adopt Shape 3 over
§308.3's default: move the flag-forked prune key from ii into i so `suppressedAtTick` lands with its
only consumer. Numbers in §7. **Veto restores the default boundary**, at the cost of one member
holding an orphan persisted key; the packets are written so the move is a transfer of one manifest
row (M1's prune arm) and two acceptance cases (A5, A7) between them.

**RAISED-B · ⭐⭐ THE SCOPE QUESTION THE MEASUREMENT FORCES — RE-FILE THE BEAT TO WF-8?** This lane
does **not** decide it: §308.3 pre-authorized a *split*, not a re-file across waves. The numbers:

| | beat in WF-1b-ii | beat re-filed to WF-8 |
|---|---|---|
| FAITH kind registry | minted with **1** row | minted with **~20** rows |
| `kindPoolFloors` small-family exception list | ⛔ **1 → 2** | **unchanged** |
| `tests/lint/faithKindPools.walker.test.js` + its mutation-coverage row | paid here, re-touched by WF-8 | paid **once** |
| the five registration homes | paid here | paid once (the desk, once bought, is not re-owed) |
| WF-1b's shape | **two members, one needing an override** | ⭐ **ONE member, zero overrides in the whole ladder** |

WF-8 is already *"a multi-member train by arithmetic, not by preference"* (preamble R-WF-8), and it is
the member that has twenty rows to put in the registry. **`draft-WF-1B-II.md` is compiled in full
either way**, so a ruling in either direction needs no second compile.

**RAISED-C · WF-1b-ii's BUDGET OVERRIDE — a chair act, required BEFORE dispatch.** Requested:
**handwritten files total, 12 → 14. One row, and no others.** Registration-only stays at the default
3 and new leaves at the default 2, because §8 of that packet measures exactly three and exactly two.
⛔ GR-PREAMBLE §P2: *"AN OVERRIDE NEVER TRANSFERS"* — CR-GR4B-2's `3 → 5` / `12 → 14` was GR-4b-α's
alone and nothing is inherited from it. The two files beyond the default carry no independent
decision: the family walker every other registry family already has, and its mandatory
mutation-coverage row.

**RAISED-D · DS-FTH-3 AND VOLUME Q4 (OPEN at the chair).** DS-FTH-3 binds seven `deities` sub-keys —
`{share, standing, legitimacy, niche, tenure, suppressed, covert}` — and **`suppressedAtTick` is not
among them**, while the *unbuilt* `covert` is. This lane read that as "the corpus pre-authored what
the dossier will RENDER", concluded WF-1b renders nothing and therefore **amends no corpus row and
does not run `npm run gen:dossier-prose`**, and recorded it as J-TCWF1B-4. ⛔ Preamble §P2.7's STOP
fires on a **divergent spelling**, and there is none — but the chair may prefer the corpus to
pre-author the field, which is a `gen:dossier-prose` act in the same commit (Lane P's standing law).

**RAISED-E · `KEEP` STAYS A FUNCTION-LOCAL CONST.** RAISED-4 requires the bar to derive from the
existing constant; firing the beat where `KEEP` is already in scope derives from it exactly, at zero
cost. The alternative — promoting it to `RELIGION_TUNING.SUPPRESSED_KEEP` — relocates a live constant
into a frozen tuning table, which is owner-signature surface under THE PROMISE (§42/§43) and buys
nothing this wave needs. Recorded as J-TCWF1B-2, vetoable.

**RAISED-F · THE WRITE-SITE CENSUS PIN'S HOME.** Placed in `tests/domain/patronFall.test.js` rather
than a new `tests/lint/**` walker, on the landed `tests/domain/impactKindWalkers.test.js` precedent (a
source scan over `src/domain` run from `tests/domain/`). This keeps WF-1b-i's census delta at
`+0/+0/+0/+8/+0` and avoids a §P3b mutation-coverage row that could not honestly be earned by option
1 — ⛔ **`scripts/mutation-sweep.sh` is unavailable to any build lane**, because its own revert is the
`git checkout --` family this program's shared-tree protocol forbids. Recorded as J-TCWF1B-3.

**RAISED-G · A NEW STANDING HAZARD, WORTH A MEMORY ENTRY.** `nicheOf` is a COMPUTED niche
(`${deityTemper(d)}:${d?.alignmentAxis}`, `cultImpositionApply.js:35-37`). A fixture that hand-authors
an incumbent's `niche` string silently routes `attemptEntry` to `open_slot`: nothing is evicted,
nothing is suppressed, and the pin passes green having asserted nothing. Executed both arms (§4).
This is a new member of the fixture-cannot-execute-its-own-defect family, is in neither the annex nor
`WF-1A`, and belongs beside the `PATRON_FLIP_TICKS`/`SHARE_STEP_MAX` row in the family's law.

**RAISED-H · A SECOND MEASURED CORRECTION TO THE FAMILY'S OWN LAW.** `WF-1A` §13 and preamble R-WF-6
both price the threading as *"a signature change to TWO exported functions"* with fifteen test call
sites. The call-site census is exactly right; the **churn** estimate is not, because `attemptEntry`
already carries a defaulted options bag and `resolvePatronContest` can take a defaulted trailing
parameter. **Zero call sites need editing.** This is why WF-1b-i fits the default budget, and it is
worth folding into the preamble's R-WF-6 text at the next WF docs act rather than left for the next
WF compile to re-derive.

---

## §10 · WHAT THIS LANE DID NOT DO, STATED AFFIRMATIVELY

- **Ran no test, no gate, no `npm run check*`, no `gate-mutex.sh`.** Every acceptance case, mutant and
  census figure is therefore a **compile-time prediction with an executed substrate**, never a test
  outcome. The one thing executed against live code is the §4 fixture probe, which ran the ENGINE
  and not the SUITE.
- **Made no git write of any kind** — no commit, no stage, no stash, no branch, no `git checkout`.
  Nothing was written outside the session scratchpad.
- **Did not open `laneTCWF-receipt.md` or the WF-F round receipts.** Every §78 premise cited was
  re-measured independently at `9d851fae`.
- **Did not resolve `N3` or `N10` in `draft-WF-1B-II.md`** — whether the pruned-refs shape needs
  widening, and whether the beat is minted with the literal `impactKind:` idiom that
  `impactKindWalkers`'s `MINT_RE` scans for. Both are implementation-tip resolutions, named in the
  manifest with their conditions rather than guessed.
- **Did not price WF-1c or WF-1d.** Their reservations on `religiousContest.js` are noted in the
  collision analysis and nothing more.
- **PLAUSIBLE, not CONFIRMED, and named as such:** the effective-line deltas in both manifests
  (`≤30`, `≤15`, `≤80`, `≤40`) are budgets, not measurements — they can only be confirmed by the
  implementer's own `Linter` run after the edit. Likewise the predicted `titles` deltas depend on the
  implementer's final title count.
- **CONFIRMED but time-sensitive:** every census literal in §6 moves on any landing anywhere. Both
  packets instruct re-reading rather than inheriting, and §12 of each carries the premise-map row
  that kills the claim.

---

## §11 · EXECUTION LOG

1. **Binding reading, in order** — the WF preamble (758 lines) with its SHA-256 verified; the
   substrate annex (424 lines) whole; the volume `DESIGN_FP_ARCH_WF.md` at `9d851fae` (846 lines,
   the §78-cured copy) §2/§3/§4-WF-1; `DESIGN_FP_FAITH.md`'s corrected extinction beat;
   `WF-1A.md` (473 lines) whole; `PACKET_STANDARD.md` §"Train landings", §"Differential member
   caps", §"Registration obligations", §"Default hard scope budget", §"Hot files", §"Edge-case
   budget"; `PACKET_TEMPLATE.md`; ODQ **§308** (ledger working tree, lines 12908-12969);
   GR-PREAMBLE §P2 for the registration-cost table and the override-never-transfers rule.
2. **The effective-line measurement** — `laneTCWF1B-measure-eff.mjs`, the repo's own eslint
   `Linter` over `git show 9d851fae:<path>`, **14 files, `TRUE_EXIT=0` captured in-shell.**
3. **The fixture probe** — `laneTCWF1B-probe.mjs` and `laneTCWF1B-probe2.mjs` against a
   `git archive 9d851fae src`-extracted blob tree, both `TRUE_EXIT=0` in-shell. ⚠ The working tree
   was measured first and DOES diverge on three of `religionState.js`'s transitive dependencies —
   running the probe there would have been a silent lie.
4. **~35 `git grep` / `git show` reads** against `9d851fae`. ⚠ **THE ZSH TRAP THE PREVIOUS WF LANE
   RECORDED IS REAL AND THIS LANE OBEYED IT:** every ref was quoted whole — `git show "<sha>:<path>"`
   — because an unquoted `$SHA:src/...` triggers a history modifier on the `:s` and an empty result
   from a mangled ref reads exactly like a true zero.
5. **Three JSON reads via `python3`** — `PACKET_MANIFEST.json` (status census),
   `.prose-numerics-baseline.json` (row attribution), the five edge-shared `*.meta.json` `inputs`
   arrays (closure derivation) — plus a comment-stripping parse of
   `ENGINE_GATED_VIRTUAL_RULE_KEYS`, which is what caught the 25-vs-24 measuring artifact in §6.

**Helper artifacts** (all `laneTCWF1B-*`): `-measure-eff.mjs` · `-probe.mjs` · `-probe2.mjs` ·
`-tree/` (the extracted blob tree) · `-src-*.md` (the six binding documents) ·
`-religionState.js` / `-religiousContest.js` / `-patronFall.js` / `-heraldRouting.js` (blob dumps).
