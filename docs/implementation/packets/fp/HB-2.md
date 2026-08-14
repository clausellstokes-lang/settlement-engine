# HB / HB-2 — THE HABIT LEDGER, THE GATE LADDER'S FIRST DOOR, AND THE FLAG

- **Status:** READY
- **Train:** `hb-2b`, member **M2 of two**, executing after M1 (HB-0B). Private ref
  `refs/trains/hb-2b`.
- **Authority:** **OQ §41** items 1–6 (which bind this member verbatim) and **OQ §42.3** (three
  findings that correct the prior compile). **Supersedes `laneTC9-HB-2-packet.md`**, whose Bands
  declaration rested on the premise §42.1 ratified as refuted.
- **Volume:** `docs/DESIGN_FP_ARCH_HB.md` §4 "HB-2 — THE LEDGER + THE FLAG", with §1.1, §1.4,
  §1.5, §2.1–§2.4 binding.
- **Family preamble:** `docs/implementation/preambles/HB-PREAMBLE.md`, cited **BY SHA-256**:
  `84fc1a6b8177aaaa26983f8ccb86003adb56f70dc6789213030ede947ddeb388`
  ⚠ **RE-COMPUTED AT P1** — a blank or stale sha is a promotion STOP. The git **blob** id is
  `28db0b4ed6ea3740a0d94da744b7deb963873574`, a different digest.
- **Verified base:** `claude/composite-r4` at `c777a158da79830d46862b8df24f427dd9050824`
  ⚠ **THIS MEMBER'S BASE IS `I1` — M1's implementation commit — NOT the train's opening base
  `e5ecc83d`.** M1 moved `habitCurve.js` and `habitCurve.test.js`, so this member's §5
  measurement table is re-taken against its own parent rather than inherited.
- **Capsule:** `BASE_STATE.json` stamped `5bcca49a`; `e5ecc83d` is its docs-only child, so its
  figures are citable as executed. ⛔ Every row this manifest touches is RE-EXECUTED.
- **Bands:** ⛔ **NONE BY DESIGN — AND THE PREMISE IS NOW TRUE BY CONSTRUCTION RATHER THAN
  INHERITED.** This wave authors a ledger, a gate ladder and a manifest row. It **SPENDS** three
  structural bounds it does not author — `HABIT_ROWS_PER_ACTOR_CAP`, `PLEDGE_MAX_AGE_WEEKS` and
  `PLEDGE_BOOK_CAP` — minted in `HABIT_TUNING` by **M1 (HB-0B)**, where their executed derivations
  and their chair signature live. ⚠⚠ **THE PRIOR COMPILE'S VERSION OF THIS LINE WAS FALSE:** it
  said the bounds were *"declared in `HABIT_TUNING` at HB-0"*, and TE9 measured that they were
  nowhere in the tree (`R31`, ratified at §42.1). **M1 is the commit that makes the sentence
  true.** A `**Bands:**` row on this wave would red the HB bands-reconciliation walker's
  guard-the-guard, which is exactly what that guard is for.
- **Req 13:** declared-empty. **Req 14:** engine-only, with the no-DM-verb rationale.

---

## 1. Scope and boundary

**THIS WAVE FIXES:** the habit sub-ledger has no home, no writer, no gate and no registration.
It mints all four, **dark**, so that HB-3's credit fold has a place to write and HB-4's chooser
read has a place to read.

**IT DOES NOT TOUCH:** any chooser, any close, any foreign record, `pulseKernel.js` or
`applyWorldPulse.js` (**L1 — both banked, zero headroom**), `settlementStrategy.js` (812/812,
tolerance-zero, HB-5's file), `settlementPolitics.js`, `momentum.js`, or any `.jsx`.

⛔ **NO CALLER IS WIRED.** `writeHabits` exists and nothing in `src/` calls it. That is not an
omission; it is the wave's identity claim, and §12's dark-closure case proves it.

### 1.1 · The boundary sentence

> This wave mints every artefact needed to STORE a habit and gates all of them behind one flag;
> it mints nothing that COMPUTES one, DECIDES with one, or CLASSIFIES a circumstance — and it
> AUTHORS no tuning value, spending three that M1 minted one commit earlier.

---

## 2. ⛔⛔ THE BEHAVIOUR/IDENTITY CONTRACT

**The claim: with `habitConditioningEnabled` absent or false, a campaign's serialized bytes and
its entire rng stream are IDENTICAL to a pre-HB-2 build, on every seed, at every tick, on every
one of the FIFTEEN lifecycle paths** (§2.4 — fifteen, not fourteen: `preview / forecast` is this
volume's own addition, and a dark-state claim that stops one path short of its own table is a
claim with a hole in it).

**Carried by mechanisms 1 and 5 of §2.4, and both are pinned:**

1. **NO KEY.** `habitsActive` false ⇒ `writeHabits` returns the **input `worldState` REFERENCE
   unchanged** (the `conquestMarchOrder` idiom: "the INPUT REFERENCE, not a copy, not an equal
   object"), so `setSpatialLedger` — which is what CREATES the namespace — is unreachable. **The
   gate returns FIRST, before any allocation.**
5. **NO STRING.** No receipt, news beat, dossier row or prose token is composed on any path this
   wave adds, so no golden moves.

⚠ Mechanisms 2 (NO FACTOR), 3 (NO DRAW) and 4 (NO SPREAD) belong to HB-4/HB-5/HB-6 and are **NOT
claimed here.** A wave that claims a fence it does not build has proven nothing.

### 2.1 · ⛔ THE PIN THAT MUST NOT BE WRITTEN THE OBVIOUS WAY

The drop-when-empty identity pin asserts the emptied ledger leaves the world byte-identical to a
dormant one — **asserted on the SUB-LEDGER's reference and value, ⚠⚠ NEVER on the `worldState`
reference.** A lit tick always allocates a world spread, so a pin asserting world-reference
identity on a no-op **REDS a correct build** — the EP volume's F2 defect class, named here so it
is not re-discovered.

⭐ The mechanism it rides is measured: `spatialLedgerAccess.js:106` `dropSpatialLedger` — *"When it
was the LAST sub-ledger, drop the whole `spatialLedgers` namespace so an emptied world stays
byte-identical to a dormant one. A no-op (returns the same reference) when the key is already
absent."*

---

## 3. ⚠⚠ THE CHARTER CORRECTIONS AND REFUTATIONS THIS PACKET CARRIES

Nothing below may be built on the left column. **R26–R30 are ratified at §41 item 6; R31 at §42.1;
R32–R34 are new at this compile.**

**R26 — "the clock is read tolerantly by `weeksFromCalendar`" (§1.1). REFUTED AS AVAILABLE.**
`worldState.js:601` — `function weeksFromCalendar(calendar = {})` — **module-private, no `export`**,
and `worldState.js` is one of the four closed `ARGUED_HOSTS`. **WHAT SURVIVES IS THE LAW:** every
stamp is `worldState.calendar.elapsedWeeks`, and **a write that cannot resolve it writes NOTHING**
rather than stamping a 0 that would read as "written at the dawn of the world".
`ensureWorldStateShape` normalizes the field on every world that crosses it (`:520`), so the
unresolvable case is precisely the un-normalized world the law is written for.

**R27 — the observed-shape exposure the charter never prices.** HB-2 is the **first habit module
to read `worldState`**; `osrFindings` sat still at 1998 across HB-0 and HB-1 because their leaves
read none. §P7 stop 4 makes any movement a **STOP**. ⭐ **§41 item 3 SIGNS the cure:** the
`assizeKernel.js:242` idiom `num(asObject(asObject(worldState).calendar).elapsedWeeks, now2)`.
⭐⭐ **AND TE9 MEASURED WHY IT COSTS NOTHING, so the mechanism is known rather than trusted:** the
detector grounds a finding by its RECEIVER (`RECEIVER_ROOT = /^([A-Za-z_$][\w$]*)\??\./`, and
`scanReaders` refuses to emit unless the receiver resolves to exactly one shape), and a
**CallExpression receiver resolves to nothing** — `elapsedWeeks` occurs **zero** times in
`scripts/.observed-shape-readers-baseline.json`. **1998 holds for any adopter.** ⚠ A plain
`worldState.calendar.elapsedWeeks` or `worldState?.calendar?…` **is** an identifier chain and moves
the count.

**R28 — the charter's `ledger leaf ≤ 280` EXCEEDS the standard's hard budget of 250.**
**§41 item 4 SIGNS the binding to 250**, with the split contingency declared at §5.1.

**R29 — the `spatialLedgers` hard-deny lives at a different address than a reader would guess.**
`WORLD_SNAPSHOT_HARD_DENY` is exported from **`src/domain/display/worldSnapshotPublic.js`** (`:68`),
not `src/domain/worldPulse/`. `'spatialLedgers'` is present (`:92`);
`WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST` is `Object.freeze(['pantheon'])` (`:66`);
`tests/security/worldSnapshotDenyCensus.test.js:45` censuses the **PARENT** key. **§1.5's
public-payload claim CONFIRMS at HEAD**, and this wave lands the anchored negative that LOCKS it.

**R30 — "`VIRTUAL_PENDING` · `WAVE_PENDING` · `BASELINE_PENDING` · `PLACE_PENDING` are ALL
`Object.freeze([])`" (§2.3). REFUTED — THREE OF FOUR.** Executed: VIRTUAL `[]`, WAVE `[]`, PLACE
`[]`, **BASELINE `["majorChangesRequireProposal"]`**. **The RULING survives** — this wave's row is
AUTHORED, its home is the ENGINE-GATED VIRTUAL cohort, and that cohort's array **is** empty. Only
the "all four" framing dies. ⚠ No HB packet, module header or ledger row may repeat it.

> ### ⛔⛔ R32 — A LANDED PIN NO PRIOR COMPILE NAMED, AND IT IS STOP-CLASS FOR THIS WAVE
>
> **MEASURED at `tests/domain/habitCurve.test.js:227-232`:**
>
> ```js
> const family = SRC_FILES.filter(({ rel }) => rel.startsWith(`${HABIT_DIR}/`));
> expect(family.length).toBe(2);
> const roundings = family.flatMap(({ rel, src }) => [
>   ...src.matchAll(/\b(?:Math\.round|Math\.trunc|Math\.floor|Math\.ceil|toFixed)\s*\(/g),
> ].map(() => rel));
> expect(roundings).toEqual([CURVE_HOME]);
> ```
>
> `HABIT_DIR` is `src/domain/worldPulse/habit`, which holds exactly two files today (executed
> `readdirSync`). **This wave mints `habitLedger.js` and `habitGate.js` INTO that directory**, so
> `family.length` becomes **4** and a GREEN landed HB-0 test **REDS**. The prior compile's row 9
> declared only *"`HABIT_DARK_CLOSURE` 3 → 4"* at *"≤ 4 lines"* and would have discovered this by
> reddening.
>
> ⛔ **AND THE SECOND CONSEQUENCE IS A HARD CONSTRAINT ON `habitLedger.js` ITSELF.** The rounding
> scan runs over the WHOLE family and asserts `toEqual([CURVE_HOME])` — an array of **exactly
> one**. Once both new leaves join the family, **neither may contain any `Math.round` /
> `Math.trunc` / `Math.floor` / `Math.ceil` / `toFixed` spelling.** The total-on-garbage normalizer
> and the **nearest-neutral eviction** are precisely where an implementer reaches for them.
> **Every rounding routes through the imported `roundToUnits`, and the eviction compares integers
> that function already produced.** Row 9's budget rises to **≤ 8 effective lines** accordingly.

**R33 / R34 — the volume's persist-cost unit and its actor denominator**, both refuted at M1's
compile (`laneTC10-HB-0B-packet.md` §4.0): 25 measured bytes per row against the volume's ~14, and
a certified scale ceiling of 30 settlements against the volume's 180. **They do not change what
this wave builds** — this wave spends the bounds rather than deriving them — and are recorded here
only so no HB reader repeats the ~14.

### 3.1 · ⛔⛔ THE LANDED TEST THAT CONSTRAINS EVERY FUTURE HABIT MODULE (§41 item 5 — a STANDING HB LAW)

`tests/domain/habitVocabulary.test.js:113` asserts, over **RAW source** across all of `src/`
(no `codeOnly()` strip), that `habitVocabulary.js` is the **ONLY** file spelling any of the twelve
circumstance-class tokens as a quoted literal.

⛔ **NO HB-2 FILE MAY SPELL ANY CLASS TOKEN AS A QUOTED LITERAL — INCLUDING INSIDE A COMMENT OR
JSDoc.** The ledger's normalizer validates a class by calling `isCircumstanceClass(token)`,
imported; it never compares against a spelled name, and its failure messages interpolate
`CIRCUMSTANCE_CLASSES.join(', ')` rather than naming a class.

⭐ **AND THE CONSTRAINT IS NARROWER THAN "no class token" — MEASURED, which matters directly for
§4's reachability table.** `habitVocabulary.test.js:49-52` builds
``new RegExp("['\"`]" + word + "['\"`]")`` over `src/` only. **A class token in QUOTES is
forbidden; the same token UNQUOTED in prose is lawful, and test files are outside the scan root
entirely.** The eleven-row table §4 orders into `habitLedger.js`'s header is therefore writable —
**every class name in it appears unquoted.**

---

## 4. THE Q2 PARTIAL DISCHARGE THIS WAVE CARRIES (`CR-HB2-Q2R`, SIGNED at §41 item 2)

**WHAT THIS WAVE TAKES:** the **REACHABILITY** half — the eleven pressed classes' gating
conjunctions and the three that cannot fire on any corpus this estate generates — recorded in
`habitLedger.js`'s module header as HB-0's inherited debt, which is the address CR-HB-Q2 and the
landed `habitVocabulary.js:28-33` header both name.

**WHAT IT REFUSES:** the **OCCUPANCY** half, which needs the classifier `CR-HB2-O1` refuses to
site; §41 item 2 re-aims it to HB-4.

**⭐ THE TRIGGER IS RE-PRICED, AND §41 SIGNED THE RE-PRICING.** Three of the eleven pressed classes
measured **UNREACHABLE on `full_simulation`** — `terms_offered` (both roads dark:
`warPeaceDecision.js:82` gates on `warTerminationEnabled`, measured `false`; `pactProposals.js:134`
on `pactFormationEnabled`, measured `undefined`), `coalition_called`
(`envoyDiplomacyEnabled` = `false`), `rival_ascendant` (`beliefAxesEnabled` = `undefined`). So
`~70%` binds the **RESTRICTED DENOMINATOR**: the share of `unpressed` among decisions at which at
least one pressed class was REACHABLE under the corpus's own declared flag configuration. **Any
occupancy figure that does not declare its flag configuration is inadmissible.**

⚠ **THE HEADER RECORDS A REACHABILITY TABLE, NOT AN OCCUPANCY NUMBER, AND SAYS SO IN ITS FIRST
SENTENCE**, so no later reader mistakes it for the measurement Q2 asked for.

### 4.1 · ⛔ THE MEDIAN/p95 HEADER PIN IS RE-AIMED TO HB-3 (§42.3, third finding)

`docs/DESIGN_FP_ARCH_HB.md:3073` lists among HB-2's mandatory pins *"the measured bound recorded in
the header (median and p95 live rows per actor on a generated corpus)"*. **The prior compile
carried no such acceptance case, and it is STRUCTURALLY UNDISCHARGEABLE HERE for exactly the reason
the occupancy half was re-aimed:** this wave wires **no caller**, so `writeHabits` never runs on any
corpus and *"live rows per actor"* measures **zero on every world by construction**. A median and
p95 over a corpus that cannot contain a row is not a measurement.

**DISPOSITION: re-aimed to HB-3's credit fold** — the first wave that actually writes rows — on the
same reasoning §41 item 2 already ratified. ⭐ **The same argument applies to the pledge-book
occupancy M1's `PLEDGE_BOOK_CAP` would ideally rest on**, which is why that value is derived
structurally and marked for re-visit at HB-3.

---

## 5. The exact manifest, with budgets

**TWELVE handwritten paths — exactly the standard's cap.** Every budget is EFFECTIVE lines under
eslint `max-lines` `{ skipBlankLines: true, skipComments: true }`, measured at the publishing
commit with the enforcer, **never `wc -l`**.

| # | Action | Path | Budget | Purpose |
|---|---|---|---|---|
| 1 | **CREATE** | `src/domain/worldPulse/habit/habitLedger.js` | **≤ 250** (R28/§41.4) | the sub-ledger, `HABIT_LEDGER_KEY`, the ONE writer `writeHabits`, the total-on-garbage normalizer, drop-when-neutral ×4, deterministic nearest-neutral eviction, the pledge book (FIRST-WINS + age sweep) |
| 2 | **CREATE** | `src/domain/worldPulse/habit/habitGate.js` | **≤ 90** | the four-door ladder file; **this wave lands DOOR ONE only** (`habitsActive`) |
| 3 | **MODIFY** | `src/lib/spatialUsage.js` | **≤ 15 effective** | the `habits` TRACKED row + its `MOVER_PRESENCE` entry + its `mover_counts` key |
| 4 | **MODIFY** | `src/domain/worldPulse/simulationRules.js` | **≤ 15 effective** | `habitConditioningEnabled` joins `ENGINE_GATED_VIRTUAL_RULE_KEYS`, codepoint-sorted |
| 5 | **MODIFY** | `src/domain/certification/subsystemRowsVirtual.js` | **≤ 15 effective** | the AUTHORED certification row |
| 6 | **CREATE** | `tests/domain/habitLedger.test.js` | — | the ledger battery |
| 7 | **CREATE** | `tests/property/habitNeutralIdentity.test.js` | — | the §2.4 cold-start fence + the four-fence dormancy set + the lit mutant |
| 8 | **CREATE** | `tests/lint/habitLedgerSingleWriter.walker.test.js` | — | the three-direction single-writer census |
| 9 | **TEST** | `tests/domain/habitCurve.test.js` | **≤ 8 lines** ⚠ **RAISED — see R32** | `HABIT_DARK_CLOSURE` **3 → 4** **AND `family.length` `2` → `4`**, with a note naming why |
| 10 | **REGISTER** | `tests/lint/couplingInclusion.walker.test.js` | — | two `ARGUED_UNLAYERED` rows; `ARGUED_ROSTER_CEILING` **17 → 19** |
| 11 | **REGISTER** | `tests/lint/sovereigntyLightingContract.walker.test.js` | — | the census tuple, **re-derived WHOLE, carrying BOTH members' movement** |
| 12 | **REGISTER** | `scripts/mutation-coverage-manifest.json` | — | ⭐ **EXACTLY ONE entry — see §5.5** |

**BUDGET COMPLIANCE against `PACKET_STANDARD.md` "Default hard scope budget":**

| Limit | Cap | This packet |
|---|---:|---|
| new logic-bearing production leaves | 2 | **2** ✓ (⛔ a classifier would be a third — `CR-HB2-O1`) |
| existing logic-bearing production files modified | 3 | **0** ✓ |
| additional registration-only production files touched | 3 | **3** ✓ (rows 3, 4, 5 — at the cap) |
| feature flags | 1 | **1** ✓ |
| new persisted record families | 1 | **1** ✓ (`spatialLedgers.habits`) |
| named writer per ONE state that changes | 1 | **1** ✓ (`writeHabits`) |
| user-facing surfaces | 1 | **0** ✓ |
| direct production consumers | 2 | **0** ✓ — dark |
| handwritten files total | 12 | **12** ✓ (at the cap) |
| new/changed effective production lines | 400 | **≤ 385** ✓ |
| each new production leaf | 250 | **≤ 250** ✓ |
| shared / hot-file delta | 15 effective | **≤ 15 each** ✓ |
| named acceptance cases | 8 | **8** ✓ |

⛔ **NO HOT FILE IS TOUCHED**, and no member of this train does: `OutputContainer.jsx` **0** (the
known JSX parse artifact), `convergence.js` **798/800**, `peaceTerms.js` **797/800**,
`informationStatecraft.js` **780/800** — none is on this manifest. The files this manifest does
touch measure `spatialUsage.js` **179/800**, `simulationRules.js` **304/800**,
`subsystemRowsVirtual.js` **548/800**. ⚠ **RE-MEASURED AT I1'S TREE, not at `e5ecc83d`** — M1 moved
`habitCurve.js` and this member's table is taken against its own base.

### 5.1 · ⛔ THE SPLIT CONTINGENCY, DECLARED IN ADVANCE (§P7 stop 3)

If `habitLedger.js` cannot express its charter inside 250 effective lines, **the executor STOPS and
does not renegotiate the baseline mid-flight.** The declared split: **the pledge book**
(`open: { <pledgeId>: [a, c, k, w] }`, FIRST-WINS, the age sweep and `PLEDGE_BOOK_CAP` eviction)
moves to `src/domain/worldPulse/habit/habitPledges.js`. **PRICE, stated so it is not discovered at
the STOP:** a THIRD new leaf, breaching the two-leaf cap and returning to the coordinator; a third
`ARGUED_UNLAYERED` row (roster **20**, not 19); a census re-derivation; ⛔ **and `family.length`
becomes 5, not 4** (`R32`).

### 5.2 · ⭐ THE REGISTRATION TEMPLATE AT FULL STRENGTH — §P4 / OQ §35.3

**A packet that names fewer than four parts is defective on its face.** Both leaves land inside
`CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//` — **which recurses into
subdirectories, so `habit/` is inside it** — so both owe a row.

| Part | Address |
|---|---|
| **THE ROW** | `ARGUED_UNLAYERED['src/domain/worldPulse/habit/habitLedger.js']` and `[…/habitGate.js']`, each `{ kind: 'substrate', reason: <over 20 chars>, reads: Object.freeze([]) }`, in `tests/lint/couplingInclusion.walker.test.js` |
| **THE HEAD RE-EXPORT** | ⛔ **NONE, AND THE ABSENCE IS THE ARGUMENT.** A substrate leaf re-exported through a layered head acquires that head's port and reds `expect(LAYER_OF.has(module)).toBe(false)` |
| **THE EXACT-LIST PIN** | `ARGUED_ROSTER_CEILING`, **17 → 19** in the SAME commit as the two rows — `toBe()`, both directions |
| **THE REGISTRY TEST PATH** | `tests/lint/couplingInclusion.walker.test.js` |

**THE `reads` FIELD IS OUTBOUND-ONLY, MEASURED, NEVER ASSERTED — and both rows measure `[]`.**
The walker recomputes from `layeredImportsOf` and reds on drift in **both** directions.

- `habitGate.js` imports **nothing**; it reads `worldState?.simulationRules` directly. ⇒ `reads: []`.
- `habitLedger.js` imports `habitVocabulary.js`, `habitCurve.js`, `habitGate.js` (all
  argued-unlayered) and `src/domain/spatial/spatialLedgerAccess.js` — **itself an `ARGUED_UNLAYERED`
  row (line 350), therefore absent from `LAYER_OF`.** An unlayered read is not a cross-layer reach.
  ⇒ `reads: []`.
- ⛔ **Neither row may be pattern-matched against `habitVocabulary.js`'s row**, which carries a
  NON-empty `reads` and a `readsReason`. **The executor RE-MEASURES rather than copying this
  sentence.**

> ### ⛔⛔ §5.2's CORRECTION (OQ §42.3, second finding) — THE RECEIVER HELPERS MUST BE **LOCAL**
>
> R27's cure adopts the `assizeKernel.js:242` receiver shape. **`num` and `asObject` MUST BE
> RE-IMPLEMENTED LOCALLY IN `habitLedger.js`, NEVER IMPORTED.** `assizeKernel.js` imports them from
> **`./npcLadderState.js`**, and `npcLadder` **matches the INTERIOR `LAYER_PATTERNS` family**
> (`couplingInclusion.walker.test.js:191`). `layeredImportsOf` is **direct-imports-only** (`:612`),
> so importing those two helpers would give `habitLedger.js` a real INTERIOR read and **red its
> declared `reads: Object.freeze([])` row BY NAME, in the walker's drift arm, in both directions.**
> ⚠ **The `reads: []` measurement above is correct ONLY if the receiver helpers are local to the
> habit family.** This is the trap §5.2 warns about in the other direction, and it would have
> bitten at I1.

⚠ **THE BASELINE DOOR IS CLOSED BY DOCTRINE.** *"a new .js under `src/domain/worldPulse` takes a
`LAYER_PATTERNS` home or an `ARGUED_UNLAYERED` entry with a written reason in the same commit,
NEVER a baseline row."* **No HB filename matches any of the seven families**, checked against all
seven. `UNLAYERED_BASELINE_CEILING` stays **179**.

### 5.3 · THE CQ5 TRIO — ONE COMMIT, THREE PARTS, AND THE ROW IS AUTHORED

| Part | Address | Detail |
|---|---|---|
| **THE MANIFEST KEY** | `simulationRules.js` `ENGINE_GATED_VIRTUAL_RULE_KEYS` | `habitConditioningEnabled`, codepoint-sorted **between `espionageEnabled` and `infoStatecraftEnabled`** (measured; the live list is 18 and the sort comparison executes true). An authored comment names the wave, the ruling, the first gate read BY SYMBOL, and the conjunction |
| **THE CERT ROW** | `subsystemRowsVirtual.js` — the ENGINE-GATED VIRTUAL cohort | ⛔ **AUTHORED, NEVER PENDING.** This wave's home cohort, `VIRTUAL_PENDING_RULE_KEYS`, measures **`[]`** (`:1000`) — see R30 for what the volume got wrong around it. Direction 3 of the engine-gated walker exists because "manifested here, pending elsewhere" shipped a red on 2026-08-04 |
| **THE FIRST BY-NAME GATE READ** | `habitGate.js` `habitsActive` | `rules.habitConditioningEnabled === true`, the strict by-name idiom, **exactly once, in this one file**. ⛔ A frozen-list `.every()` would be a computed member access attributing to NO key — fully wired, genuinely gated, and **invisible** to `tests/lint/engineGatedRuleKeys.walker.test.js` |

⭐ **THE CERT ROW'S SHAPE IS THE OPPOSITE OF SP-B's, and the reason is measured.**
`habitConditioningEnabled`'s row carries a **real `stateKeys: ['spatialLedgers.habits']`** —
verified reachable: `censusWorldStateKeys` (`scripts/audit/behavioral-observation.mjs`) **walks ONE
level into `spatialLedgers`**, corroborated at `subsystemRowsGrowth.js:284`. Aliveness uses
**maxEntries rather than finalEntries** — the `vengeanceLicenses` precedent — because a ledger that
filled and drained still proves the doctrine ran.

### 5.4 · THE `spatialUsage` TRACKED ROW — RULED TRACKED (J-HB-9)

`tests/lib/spatialLedgerCoverage.walker.test.js` (⚠ `tests/lib/`, **NOT** `tests/lint/` — the EP
volume shipped the wrong address at four sites) asserts `expect(classified).toEqual(written)`,
exact set equality both directions. Its scan resolves **UPPER_SNAKE constants matching
`/(?:_LEDGER|_KEY|_LEDGER_KEY)$/` to their string value** (`CONST_DEF_RE`, `:52`), so
`export const HABIT_LEDGER_KEY = 'habits'` is seen. **MEASURED: `'habits'` is unclaimed —
`grep -rn "'habits'" src/domain src/lib` returns zero.**

**TRACKED, not EXEMPT, and the exemption's conjunction fails in both halves.** NO TRACKED FLAG:
`habitConditioningEnabled` is virtual and lit in no preset. NO TRACKED MOVER: nothing else in the
list can see the habit lane fire. This is the `routeNetwork` / `demographicPlans` / `pactProposals`
reading exactly — *"a reading of zero while the layer is dark is the truth, not a blind spot."*
⛔ **The store-layer escape is NAMED AND REFUSED:** `spatialUsage.js` states in-source that the
walker governs only keys written via `setSpatialLedger` **inside `src/domain`**, so a habit stamp
written from the store layer would evade it entirely.

### 5.5 · ⭐ THE MUTATION-MANIFEST ROW — **EXACTLY ONE**, AND THE COUNT IS MEASURED

The prior compile said *"the wave's mutant rows, appended by hand"* without a count. **MEASURED:**
`manifest.invariants` is keyed by invariant test FILE, and `enumerateInvariants` picks a file only
under `ENFORCER_DIRS = [tests/lint, tests/design, tests/docs, tests/data, tests/copy,
tests/security, tests/edgeFunctions]` **or** on a basename matching
`/(census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin)/i`.
Applied to this wave's three new test files, executed:

```
not enumerated  tests/domain/habitLedger.test.js
not enumerated  tests/property/habitNeutralIdentity.test.js
ENUMERATED      tests/lint/habitLedgerSingleWriter.walker.test.js     ← the ONE row owed
```

⛔ **ADDING A ROW FOR EITHER NON-ENUMERATED FILE REDS the "no stale entries" case**, which asserts
every manifest key is an enumerated, existing file. ⚠ The one row takes **`kind: 'rationale'`** —
a `kind: 'mutation'` label must join `scripts/mutation-sweep.sh` one-to-one in **both** directions
and this wave declares no sweep script — and may **never** take `kind: 'uncovered'`, which is
shrink-only against `uncoveredBaseline: 198`. ⛔ **Append by hand; NEVER re-serialize the file** —
a re-serialization is a whole-file diff nobody can review.

---

## 6. Acceptance cases — EIGHT, the standard's cap and the validator's

| # | Case | Convicts |
|---|---|---|
| **A1** | **THE COLD-START FENCE, ONE ASSERTION PROVING THREE LAWS.** Three worlds — (i) flag absent, ledger absent; (ii) flag LIT, ledger absent; (iii) flag LIT, ledger present with every stock exactly `NEUTRAL_I` before the drop pass. Assert the serialized bytes of (i) and (ii) are IDENTICAL after a full advance, and that (iii) serializes to (ii) because drop-when-neutral removed every row | DARK is byte-identical · COLD-START is habit-free by construction · NEUTRAL IS ABSENT |
| **A2** | **THE FOUR-FENCE DORMANCY SET + THE LIT-MUTANT CONTROL**: own-footprint golden · absent-vs-false differential · call-path spy · gate-polarity census. ⚠ **The gate-polarity arm drops each conjunct ONE AT A TIME** — a conjunction whose arms cannot be dropped one at a time is a conjunction nobody has proven | without the lit mutant "the fence proves only that the fixture is quiet" (SP-B) |
| **A3** | **THE SINGLE-WRITER THREE-DIRECTION CENSUS WITH AN EXECUTED SECOND-WRITER PLANT**, in the `envoyErrandLedgerSingleWriter.walker.test.js` shape: (1) the WRITER EXACT SET both ways; (2) **FUNCTION SCOPE** — every write form sits inside `writeHabits`'s own body, because a second function in the ledger leaf would satisfy a file-level scan while breaking the law; (3) **THE READERS READ** — the mention census is strictly WIDER than the writer set, so the narrow WRITE regex is provably not a broken pattern matching nothing | a second writer · a vacuous scan |
| **A4** | **THE JSON ROUND-TRIP THROUGH REAL SERIALIZATION.** ⚠ An in-memory probe cannot tell a shared reference from a copy — the JSON-alias trap. Every value is a JSON scalar: never a Map, Set, Symbol, BigInt or Date in a stock, a pledge, or a key | the persist-local / persist-cloud / worker-transport paths at once |
| **A5** | **THE DROP-WHEN-EMPTY IDENTITY PIN**, asserted on the **SUB-LEDGER's** reference and value — ⚠⚠ **NEVER on the `worldState` reference** (§2.1, the EP F2 class) | a ledger of zeros becoming representable |
| **A6** | **THE ANCHORED PUBLIC-PAYLOAD NEGATIVE** locking the inherited `spatialLedgers` hard-deny (R29). ⚠⚠ Load-bearing, not a formality: the truth ledger leaking to a public payload would hand every viewer perfect counter-intelligence for free | a future allowlist edit |
| **A7** | **THE INTERVAL-COLLAPSE SURVIVAL FIXTURE WITH ITS DECLARED NON-INVARIANT.** `collapseIntervalHistory` (`advanceInterval.js:146`) composes by SPREAD and `setSpatialLedger` preserves every sibling sub-key and its insertion order. ⚠ **ledger rows ≠ pulse-history length is ALLOWED and is asserted as allowed** — a 52-tick advance can credit many closes behind ONE surviving record, and a future "tidy-up" that teaches collapse to prune the ledger is a STOP-and-report | a collapse that drops the sub-key · a later prune |
| **A8** | **THE PAUSED-CURSOR FENCE + THE CLOCK LAW + THE IMPORT RECEIPT.** (a) No habit credit may be computed mid-advance and consumed after the pause without being folded into `worldState` BEFORE the pause. (b) A write that cannot resolve `calendar.elapsedWeeks` **writes NOTHING** — asserted as an absent row, never a `0` stamp (R26). (c) `src/lib/importReconciliationAdmission.js:391` carries `['worldState', 'world_state_not_imported', 'World simulation state']` — **an imported campaign's actors have learned nothing** | a silent mid-interval divergence · a dawn-of-the-world stamp · a doctrine sheet reading an empty ledger as a sheet of neutrals |

⚠ **A8(c) CARRIES A TRAP THAT MUST BE CLOSED IN PROSE, NOT ONLY IN CODE:** §3e's sheet returns
**ABSENCE**, and the dossier renders absence as *"this court has not yet shown its hand"*, never as
a sheet of neutrals. HB-2 does not build the sheet; it records the obligation for HB-8 and asserts
the ledger returns absence rather than a zero-filled shape.

⛔ **THE EIGHT ARE AT THE STANDARD'S CAP, WHICH IS WHY §4.1's MEDIAN/p95 PIN COULD NOT SIMPLY BE
ADDED** — and it is re-aimed on its merits rather than for want of a slot.

---

## 7. Wave-specific mutants — each convicting, each restored digest-exact

⛔ **NEVER RE-SERIALIZE `scripts/mutation-coverage-manifest.json`** — append the one row by hand.
⭐ **A COUNT MUTANT ON A LITERAL GOES VACUOUS — mutate the DERIVATION, never the recorded number.**

| # | Mutant | Must RED |
|---|---|---|
| **M-1** | Flip `habitsActive`'s `=== true` to a truthy check | the gate-polarity census (an `absent` world must not read as lit) |
| **M-2** | Return a **copy** of `worldState` from the dark arm of `writeHabits` instead of the input REFERENCE | A1's byte-identity + A2's own-footprint golden |
| **M-3** | Move the gate read from before the allocation to after it | A1 (the namespace is created on a dark world) |
| **M-4** | Delete one of the four drop-when-neutral levels | A5 |
| **M-5** | Replace deterministic nearest-neutral eviction with insertion order | the eviction determinism case (replay breaks) |
| **M-6** | Stamp `0` when the clock is unresolvable instead of writing nothing | A8(b) |
| **M-7** | Heal a garbage `v` **partially** instead of to ABSENT | the total-on-garbage case |
| **M-8** | Plant a SECOND `setSpatialLedger` write outside `writeHabits`'s body but inside the same file | **A3 direction (2) ONLY** — a file-level scan is structurally blind to it |
| **M-9** | Narrow A3's WRITE regex so it matches nothing | **A3 direction (3)** — without it an emptied scan passes as an absence |
| **M-10** | Add `'habits'` to `WORLD_SNAPSHOT_PUBLIC_LEDGER_ALLOWLIST` (**FOREIGN FILE** — restore digest-exact and re-verify porcelain) | A6 |
| **M-11** | Remove the `habits` row from `TRACKED_LEDGER_KEYS` | `spatialLedgerCoverage.walker` exact-set equality |
| **M-12** | Drop `habitLedger.js` from `HABIT_DARK_CLOSURE` | the closure's declared-vs-computed arm (a) |
| **M-13** ⭐ **NEW (R32)** | Spell `Math.round(` inside `habitLedger.js`'s normalizer instead of calling the imported `roundToUnits` | `habitCurve.test.js:232`'s rounding-door pin — **proves the family-wide single-door fence survived the family doubling in size** |

⭐ **GUARD-THE-GUARD IS NOT OPTIONAL IN THIS FAMILY.** M-8 and M-9 are the pair that matters: they
convict **different directions of the same walker**, and a build that lands one has proven half a
census. ⚠ **A redundant guard subsumes the first** — each mutant must convict the *specific* guard
under test, and the executor records which case redded for each.

**Restore discipline:** sha256 the target → save a pristine copy → apply an EXACT substitution →
assert the bytes CHANGED → run the convicting files bare → restore → `cmp` **and** sha256 again.
⚠ M-10 is a foreign-file plant: afterwards, `git status --porcelain -- <path>` must return **0
lines** and no pristine sidecar may survive the sweep.

---

## 8. The checks — bare, in-shell, unpiped, each `; echo TRUE_EXIT=$?`

```
# §31 ANCHOR PREFLIGHT — MANDATORY, BEFORE ANY GREEN IS DECLARED (ceiling ZERO on all three
# new test files)
npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js ; echo TRUE_EXIT=$?

# b1 — the ledger battery
npx vitest run tests/domain/habitLedger.test.js ; echo TRUE_EXIT=$?
# b2 — the cold-start fence + four-fence dormancy set
npx vitest run tests/property/habitNeutralIdentity.test.js ; echo TRUE_EXIT=$?
# b3 — the single-writer census
npx vitest run tests/lint/habitLedgerSingleWriter.walker.test.js ; echo TRUE_EXIT=$?
# b4 — HB-0/HB-0B/HB-1's batteries. ⚠ habitCurve.test.js carries M1's four titles AND this
#      member's TWO edits (the closure list and family.length) — R32
npx vitest run tests/domain/habitCurve.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/domain/habitVocabulary.test.js ; echo TRUE_EXIT=$?
# b5 — the registration walkers
npx vitest run tests/lib/spatialLedgerCoverage.walker.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/couplingInclusion.walker.test.js ; echo TRUE_EXIT=$?
# b6 — the CQ5 walker + the cert partition
npx vitest run tests/lint/engineGatedRuleKeys.walker.test.js ; echo TRUE_EXIT=$?
# b7 — the public-payload deny census (A6's foreign control)
npx vitest run tests/security/worldSnapshotDenyCensus.test.js ; echo TRUE_EXIT=$?
# b8 — the census, RE-DERIVED WHOLE AT THIS COMMIT (both members' movement)
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js ; echo TRUE_EXIT=$?
# b9 — the mutation manifest (ONE new entry) + the band-family walker (R20's instrument)
npx vitest run tests/lint/mutationCoverageManifest.test.js ; echo TRUE_EXIT=$?
npx vitest run tests/lint/spBandFamilies.walker.test.js ; echo TRUE_EXIT=$?

# THE STOP INSTRUMENTS (§P7) — each a STOP on movement, not a re-freeze
node scripts/check-observed-shape-readers.mjs ; echo TRUE_EXIT=$?     # MUST stay 1998 (R27)
node scripts/check-tuning-bands.mjs           ; echo TRUE_EXIT=$?     # 9 ratified bands, unmoved
node scripts/implementation-packets.mjs validate ; echo TRUE_EXIT=$?

# THE TWO TYPECHECKERS, EACH NAMED WITH ITS CONFIG AND ITS WINDOW (per-file tsc is a vacuum)
npm run typecheck:ratchet       ; echo TRUE_EXIT=$?   # 173/173,   tsconfig.full.json
npm run typecheck:domain:strict ; echo TRUE_EXIT=$?   # 1134/1134, tsconfig.domain-strict.json

# TERMINAL — bare, fresh shell, NEVER wrapped in gate-mutex.sh --run (exit 3 is the mutex
# giving up, NOT a red); held inside the executing lane's own turn
npm run check:tail ; echo TRUE_EXIT=$?
npm run smoke:boot ; echo TRUE_EXIT=$?
```

⛔ **Never read a gate through a pipe.** `npm run check | tail` reports the PIPE's status and has
greenwashed red gates twice.

---

## 9. Declared census movement (J-TE3-1 — BY FIGURE)

### 9.0 · ⛔⛔ THE VALIDATOR SEQUENCE, RESTAMPED UNDER `CR-HB2B-SPLITP` (OQ §44)

**`R35`, measured by Lane TE10 and ratified at OQ §44.** The prior compile declared
`44 / 2 READY` at the promotion and at both interior commits. **That state is unreachable:**
`implementation-packets.mjs:498` reserves every `changeManifest` path at every **non-terminal**
status, and both members lawfully name `tests/domain/habitCurve.test.js`. Standing them READY
together yields `duplicate change path across packets: tests/domain/habitCurve.test.js
(HB-0B, HB-2)` — an error that clears **only** on a status flip, so no implementation commit can
discharge it. ⚠ **`DRAFT` reserves too**, so demoting this member is not an escape.

**THE SIGNED SEQUENCE (§44):** `42/0` → **P1a** `43/1` → I1 → **P1b** `44/1` → I2 → **T** `44/0`.
This member promotes at **P1b**, in the same docs-only commit that flips M1 `LANDED` and thereby
releases the shared path.

⭐ **A VALUE VETO STILL COSTS THIS MEMBER NOTHING** (§10 risk 8), and the split changes that not
at all: the three bounds are read by name from `HABIT_TUNING`, never as literals.

### 9.1 · The figures

| Figure | Base at `e5ecc83d` | After I1 (M1) | **At I2 (this member)** | At T |
|---|---|---|---|---|
| `lightingCensus` | `2425/366/2059/20081/5650` | *(titles RED — M1's declared figure)* | **`2428/366/2062/20107/5653`** | same |
| `runtimeTests` | 28104 | 28108 | — | **28130** (a FLOOR) |
| `validatePackets` | `42 / 0 READY` | `43 / 1 READY` | **`44 / 1 READY`** | **`44 / 0 READY`** | 
| `flagManifestRows` | 18 | 18 | **19** | 19 |
| `ARGUED_ROSTER_CEILING` | 17 | 17 | **19** | 19 |
| `UNLAYERED_BASELINE_CEILING` | 179 | 179 | **179** | 179 |
| `HABIT_DARK_CLOSURE` | 3 | 3 | **4** | 4 |
| habit-family file count (`R32`) | **2** | **2** | **4** | 4 |
| `osrFindings` | 1998 | 1998 | **1998** | 1998 |
| soak bands | 9 | 9 | **9** | 9 |
| both ratchets · `frozenKnownFailures` · `titleCensus` · `killList` · `hotFiles` · `.size-baseline.json` | — | — | **all unmoved** | |

`366 + 2062 = 2428` ✓. **Titles: `20081 + 4 (M1) + 22 (M2) = 20107`** ✓ — ⚠ **this member's
re-derivation carries M1's four titles as well as its own twenty-two.** +3 test files, all
credited; **`parked` stays 366 by design** — every title in both members is a literal in a
straight-line registration, ⛔ no `test.each()` and no `describe.runIf()` anywhere in this train.

⛔ **THE CENSUS IS RE-DERIVED WHOLE AT I2, NEVER PATCHED.** It is SEQUENCED and stops at its first
red figure, so a partial patch measures nothing below the patch point — and at I1 the `titles` arm
redded, which means `suiteTitles` never executed there. **I2 is the only commit in this train where
all five figures are green simultaneously.**

---

## 10. Risks and open items

| # | Risk | Disposition |
|---|---|---|
| **1** | **The OSR finding count moves off 1998** (R27) | **STOP.** Adopt the `assizeKernel.js:242` receiver shape verbatim, **with `num`/`asObject` LOCAL** (§5.2's correction); re-run before green. A detector change is a SCHEMA MINT with its own docket |
| **2** | `habitLedger.js` will not fit 250 effective | **STOP** and return to the coordinator with §5.1's declared split and its full price |
| **3** | A concurrent flag wave collides on the four shared CQ5 files | CHECK-GIT-FIRST immediately before I2; the `update-index --cacheinfo` + `git archive` of the INDEX method; **diff-hunk filtering FAILS** |
| **4** | An HB-2 file spells a circumstance-class token **in quotes** | §3.1 — reds a **GREEN** landed HB-0 test. ⭐ Unquoted prose is lawful, which is what makes §4's header table writable |
| **5** | ⛔ **`R32`: an implementer edits only the closure line at row 9** | `family.length` reds, and then the rounding scan reds on the ledger's normalizer. **Both are named here so neither is discovered by reddening.** M-13 proves the second |
| **6** | **`CR-HB2-O1` is unruled** | HB-2 is unaffected (the ledger takes the class as an argument) — **but HB-4 cannot be dispatched until it is ruled** (§41 item 1) |
| **7** | Writing any `docs/**.md` mints a per-claim naked-claim key | Run the exact `CLAIM_RE` from `tests/docs/enforcement-claims.test.js` over every authored document **before staging**. ⚠ *"reds the gate"* is safe; the `CLAIM_RE` alternative pairing the failure verb with *"the gate"* is NOT, and neither is the zero-count absence phrase. ⛔ **THIS ROW SPELLS NEITHER, DELIBERATELY** — a packet warning about the phrase in the phrase's own words mints the very key it warns about, which is how the prior compile of BOTH members carried one. ⚠ That absence phrase also substring-matches its non-zero neighbours |
| **8** | **M1's values are vetoed after this packet promotes** | The three bounds are SPENT here, not derived here. A veto changes M1's numbers and **nothing in this manifest** — the ledger reads `HABIT_TUNING.HABIT_ROWS_PER_ACTOR_CAP` by name, never a literal. ⭐ Recorded so the chair knows a value veto costs no re-compile of this member |

**OPEN CHAIR ITEMS — four; §41 already signed the prior compile's five:**

1. **`CR-HB2-O1`** — `circumstanceClassOf` has no lawful home (7 layered reads across 6 of 7
   ports). **REFUSED at HB-2; BLOCKING for HB-4** (§41 item 1). Two roads, both priced: an eighth
   `LAYER_PATTERNS` family, or per-site classification at the cost of §1.2(a)'s totality.
   *Not a promotion precondition for HB-2.*
2. ⭐ **`CR-HB2-R32`** — record the family-file-count pin and the family-wide single-rounding-door
   constraint it implies. *Promotion precondition (record, not decide).*
3. **`CR-HB2-MEDIAN`** — ratify the median/p95 header pin's re-aim to HB-3 (§4.1), on the same
   reasoning §41 item 2 used for the occupancy mix. *Promotion precondition.*
4. **`CR-HB2-VOL2` (docketed, not taken)** — `errandSpineEnabled` **IS** present in
   `ENGINE_GATED_VIRTUAL_RULE_KEYS` (measured, 18 keys, joined by SP-D), refuting §2.2's second
   half; it remains absent from `DEFAULT_SIMULATION_RULES`. **The consequence §2.2 draws is
   HB-8's**, so this packet records the refutation and takes no position on whether
   `doctrineTapEnabled` is now reachable. *Docketed for the HB-8 compile.*

---

## 11. Mandatory implementation order

1. **P1** — promoted jointly with M1's packet; `PACKET_MANIFEST.json` entry hand-written in the
   file's own compact style (⚠ a `JSON.stringify` round-trip is not byte-identical at any indent);
   `INDEX.md` dispatch row with the declared movement BY FIGURE. **Docs-only.**
2. ⚠ **RE-TAKE §5's MEASUREMENT TABLE AGAINST I1's TREE**, not against `e5ecc83d` — M1 moved
   `habitCurve.js` and this member's base is its child.
3. **I2**, in this order inside the one commit: the two leaves → the three registration edits →
   the three new test files → **row 9's TWO edits (the closure entry AND `family.length`)** → the
   two `ARGUED_UNLAYERED` rows and the ceiling raise → **the ONE** mutation-manifest row →
   **the census tuple re-derived WHOLE, last.**
4. **The §31 anchor preflight runs BEFORE green is declared**, not after.
5. **The thirteen mutants**, each restored digest-exact and `cmp`-verified.
6. **The terminal gate**, bare, held inside the lane's own turn.
7. **T** — flip BOTH members LANDED, INDEX rows, capsule regenerated with
   `--runtime-tests=<measured>`. **Docs-only, ONE commit.**

⚠ **`git diff --name-status` at I2 must return EXACTLY the twelve manifest rows, and
`--diff-filter=A` exactly the five CREATE paths.** No thirteenth path. This reconciliation runs
**before** the flip, because `validate:packets` existence-checks `requiredSymbols` for every packet
regardless of status, and a draft path spelling that the landing changed reds the validator at T.
