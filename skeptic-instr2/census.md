# SKEPTIC LENS — THE WIRING CENSUS (INSTR-912 car 8), at the pinned tip 454d478a1

Seat: Opus 5 — Fable-unvalidated (verifier). Dock: `$SC/skepINSTR2` (HEAD 454d478a1).
Porcelain BEFORE 0 · AFTER 0. One mutation plant (#79) applied and restored `cmp`-identical
(md5 `ac78a0ef4d78271cd0a4b18ce683f1a7` before and after). Every figure below came from a
command whose output I saw. Writes: this directory only.

---

## THE HEADLINE

The census's **structural** figures all reproduce to the unit. Its **semantic** figure does
not: `RESOLVED` does not mean "the selecting predicate was recovered", which is what the
receipt, the walker's own assertion message and §8.11's wave table all say it means.

| what the receipt says | what I measured |
|---|---|
| RESOLVED 310 · UNRESOLVED 398 | reproduced exactly |
| "pools whose selecting predicate was RECOVERED — 310" | **143 of the 310 carry `predicate: []`** — no predicate at all. Only **167** rows carry any predicate row, and **14 of those 167 are code fragments** the guard reader bled across statement boundaries. Clean, usable predicates: **≈153 of 708** |
| MISSING 58 (the tier §912.1 condition one is discharged by) | **24 of the 58 are read by a pool-key function** and the row still says "0 pools keyed on this fact". MISSING falls to **≤ 34** once the join is fixed |
| the two UNRESOLVED reasons, "exhaustive" | **8 of 256** mounted-UNRESOLVED rows carry an affirmatively FALSE reason |
| "predicates over a field no composer holds: 158" | **74 of the 158 are the table rung's own synthetic label** — unheld by construction. Usable figure **84** |
| plant #79 "5 red of 21" | **5 red of 21 — the count is right, the roster is wrong**: c1c red, C-sibling did not |

---

## (a) PREDICATE RECOVERY

### The mechanism, read from source

`censusRow` matches a pool against `keyForms(fn)` (rung 1/2) then `moduleKeyTables` (rung 3).
Rung 1's predicate is `predicateRows(form.guard, …)` and `form.guard` comes from `guardAt`:

    before.match(/\bif\s*\(([\s\S]*?)\)\s*(?:\{\s*)?(?:return\s*)?$/)

`String.match` with a non-global regex takes the **leftmost** `if (`. In a key function with
more than one `if`, `[\s\S]*?` therefore spans from the FIRST `if (` to the last `)` before the
literal — swallowing every intervening statement. `predicateRows` then either fails to parse
the blob (→ `predicate: []`) or parses a garbage atom.

Measured over the 310 RESOLVED rows:

    RESOLVED 310
    RESOLVED with EMPTY predicate: 143      (all on the LITERAL rung)
    predicate-row-count distribution: {0: 143, 1: 165, 2: 2}
    RESOLVED whose predicate VALUE is a code fragment: 14

Worked example — `economyStateProse.js:557` `shadowEconomyPoolKey`:

    if (!Number.isFinite(capture)) return null;
    if (capture >= 30) return 'TIER: a large share off the books (≥30)';
    if (capture >= 15) return 'TIER: significant off-book activity (≥15)';
    if (capture >= 3)  return 'TIER: minor shadow activity (≥3)';

Census row for `DS-ECO-6 :: TIER: minor shadow activity (≥3)`: **RESOLVED, `predicate: []`**.
The true predicate (`safetyProfile.blackMarketCapture >= 3`) is trivially recoverable and is
not recovered. Fourteen rows show the other half of the same fault, e.g.
`DS-POW-3 :: crowded top rung, low instability` →
`{field: "reading.rungs.length", op: "===", value: "0) return null; if (rungs.length < SHALLOW_RUNGS_BELOW) return 'shallow ladder…"}`.

**Why the gate does not catch it.** Control (c1b) proves recovery on
`COMPOSER_TWO_BRANCHES`, whose key function has ONE `if` before the matched literal. The
estate's key functions have many. The fixture cannot exercise the failing shape.

### Ten RESOLVED rows re-derived by hand

| # | rung | row | census predicate | correct? |
|---|---|---|---|---|
| 1 | literal | DS-DEF-2 :: Internal Security: full legal chain | `court truthy` + `prison truthy` | ✅ |
| 2 | literal | DS-ECO-6 :: TIER: minor shadow activity (≥3) | `[]` | ❌ empty; `capture >= 3` was recoverable |
| 3 | literal | DS-REL-1 :: cross-settlement engagements | `[]` | ❌ empty |
| 4 | literal | DS-POW-3 :: crowded top rung, low instability | code fragment | ❌ garbage |
| 5 | literal | DS-ECO-9 :: BLOCKADED | `[]` | ❌ empty (`stockpile.blockaded` was the guard) |
| 6 | template | DS-ECO-2 :: GRANARY: well stocked | `granary.band === 'well stocked'` | ✅ |
| 7 | template | DS-GEN-3 :: economicViability.viable: false | `readings.viable === 'false'` | ✅ (string 'false', not boolean) |
| 8 | template | DS-STR-2 :: ORIGIN: palace_coup | `worldStressor.originContext.variant === 'palace_coup'` | ✅ |
| 9 | table | DS-DEF-1 :: terrain FAVOURABLE to the defender | `text(terrain) (via TERRAIN_DEFENCE_OF …) === 'Mountain'` | ✅ (field is a synthetic label; see below) |
| 10 | table | DS-POW-4 :: riskLabel: Contested | `label (via RISK_POOL_OF …) === 'Contested'` | ✅ |

The template and table rungs are sound. The **literal rung is the broken one**, and it is
167 of the 310.

### Ten mounted WIRING-UNRESOLVED rows, tested for a recoverable predicate

Sampled evenly over the 256 mounted-UNRESOLVED rows:
`DS-DEF-1 :: readiness STRONG` · `DS-DEF-2 :: Disasters & Famine: NO reserves…` ·
`DS-DEF-6 :: Medical Readiness: None` · `DS-ECO-10 :: SCARCITY: adequate` ·
`DS-GEN-9 :: event type: occupation_infiltration` · `DS-POW-2 :: critical matched` ·
`DS-POW-7 :: glue patronage…` · `DS-STR-2 :: SYNERGY: coup_detat × succession_void` ·
`DS-WAR-2 :: security · strained` · `DS-FTH-1 :: DEVOTION: secular`.

Nine are honest (the key is assembled, corpus-derived, or lives in a non-key function).
**`DS-POW-2 :: critical matched` is a FALSE UNRESOLVED**: `powerStateProse.js:304`'s
`STABILITY_LADDER` is a module-level `Object.freeze([['critical', 'critical matched'], …])`
key table. `moduleKeyTables` reads only the object-literal shape `{ 'v': 'key' }`, so the
pair-array shape is invisible and the row's reason ("no module-level key table names it") is
false. Scanned exhaustively: **4 rows** in that class (all DS-POW-2).

A second false class, from a tokenizer desync: `keyForms` scans single-quoted literals with
`/'((?:[^'\\]|\\.)*)'/g` over a body that `codeOnly` has NOT stripped of strings. An
apostrophe inside a DOUBLE-quoted literal opens a phantom string and eats every later
single-quoted key in that function. `warFaithStateProse.js:668` returns
`"NICHE: the patron's niche carries a contestant"`, and both of `nicheContestPoolKey`'s keys
then read UNRESOLVED. Scanned exhaustively: **4 rows** whose key IS returned by a `*PoolKey`
function (DS-FTH-3 ×2, DS-ECO-11, DS-GEN-8).

**Total false UNRESOLVED found: 8 of 256** (3.1 %). A shortfall, not a lie — but each carries
a reason string that is affirmatively untrue.

---

## (b) THE LABEL RULE — no predicate from a pool-key STRING

**Held, for the FIELD, on every rung.** Rung 1 takes the field from the guard; rung 2 from
`resolveHole` over the function's own params/aliases; rung 3 from the table's indexing
expression. Nothing reads the annex descriptions — the module reads no file at all; every
input arrives as a string from the test helper.

**One correction.** The template rung's `value` IS read off the pool-key string
(`bindTemplate` regex-binds `posture ${status}` against `posture peace` → `'peace'`) — 69
pools. That is what the module's own docblock declares as recovery, and it is defensible
because the template was written by the composer. But "the value comes from the key string"
should be said plainly rather than left inside the phrase "read OFF the key".

---

## (c) THE TIERS

Reproduced from the walker's own print and independently from my own dump of `census.rows`:

    TIERS · MISSING 58 · THIN 483 · COVERED 225
    THIN limbs: one-variant 0 · one-grammar 298 · settlement-only 440 · union 483 · COVERED 225
    blocks EVERY pool settlement-only: 19 · blocks with AT LEAST ONE: 57 · of 68

Against the brief's ADDENDUM — MISSING = a held fact or a co-occurring pair with NO pool;
THIN = one variant, one grammar, or a slot set of {settlement} alone — **the definitions
match the code exactly**.

**"one-grammar 298" is COMPUTED, not assumed.** `censusRow` builds `grammars` as
`new Set(variants.map(v => orderIdOf(classifyMoves(v.text))))` — `classifyMoves`/`orderIdOf`
are the MOVE-GRAMMAR walker's own classifier (`src/domain/prose/moveGrammar.js`), imported at
`wiringCensus.js:57`. It is the grammar walker's reading, not a re-derivation.

**MISSING 58 is materially overstated — HIGH.** `tierRows`' MISSING limb is
`spokenTo = new Set(rows.flatMap(r => r.predicate.map(p => p.field)))`, then
`if (spokenTo.has(fact)) continue`. Two independent faults:

1. Because 143 RESOLVED rows carry `predicate: []`, facts those pools actually key on are
   invisible to `spokenTo`. **24 of the 58 MISSING facts appear in some census row's
   `fieldsRead`** — i.e. a pool-key function does read them. Named examples, each with its
   producing function:
   - `readings.criticalIssueCount` → `criticalIssuePoolKey` keys TWO pools on it
     (`DS-GEN-11 :: criticalIssueCount zero`, `:: critical contradictions on the record`).
   - `readings.terrainType` → `situationPoolKey` keys `DS-GEN-5/6 :: port`, `:: river`.
   - `readings.tier` → `originTierPoolKey` keys `DS-GEN-6 :: tier overlay: other tiers`.
2. The membership test is on the RAW field string, with no `rootOf` normalisation — unlike
   `censusSummary`'s unread-field arm, which DOES use `rootOf`. So a held fact spoken to only
   via a deeper path is falsely MISSING: `readings.exportPosture` is MISSING while
   `DS-ECO-10`'s predicates name `readings.exportPosture.status`. **3 rows** in this class
   (`readings.exportPosture`, `readings.flowDrift`, `settlement.defenseProfile`).

Union of the two: **24 of 58**. Corrected MISSING is **≤ 34**, a 41 % overstatement. This is
the figure §L item 70 hands the wave and item 72(ii) discharges §912.1 condition one with.

---

## (d) THE EXECUTION FIGURES

`firings.mjs` reproduces from its own artefact `instr-912/firings.json`:

    towns 200 · firings 13486 · distinct (block,pool) 181 · distinct blocks 39
    fired keys not present in the census: 0
    of the 181 fired keys, RESOLVED in the census: 122
    ... and carrying a NON-EMPTY predicate: 63

**The absence-pool hazard IS present, and car 9 is right about it.** `DS-POW-7` fires exactly
one key over all 200 towns — `layer DORMANT (no ledger materialized)` — because the probe's
power call passes `contenders`/`riskLabel`/`structuralLens` and no `politics`, and
`politicsPresencePoolKey(null, …)` (`powerStateProse.js:789-791`) returns that literal on an
empty `blocs`. Twenty keys fire on every one of the 200 towns; five are ABSENT/none/DORMANT
pools.

**"181 of 708 pools fire" SURVIVES as a measurement of that probe**, and the receipt is
careful to say it is not a ceiling (§8.4 refusals 2 and 3, and §L item 70 repeats the
caveat). Two limits stand:
- The probe was NOT re-run after car 9 found the two defects. Car 9's corrected sequence
  reports lines/V1/run and **no corrected pool-firing count**; 181 remains a pre-correction
  figure. It reads the same 39 of 68 blocks as car 9's corrected run, so the block half is
  stable, but the key half is untested after the fix.
- Only **63 of the 181** fired keys carry a non-empty predicate, so `coOccurringPairs` — whose
  facts-of-a-town are the predicate fields of the fired keys — sees facts from a third of what
  fired. The co-occurrence measure inherits the literal-rung defect in (a).

*(I did not re-run `firings.mjs` itself: its `D` constant points into `$SC/laneINSTR`, which
this lens is fenced out of. Every figure above is from its committed artefact and from the
pinned dock's own source.)*

---

## (e) CO-OCCURRENCE

Reproduced all three floors against `firings.json` and the census rows:

    no floor: pairs 0 | notExecutable ["no `minTowns` floor supplied — …"]
    floor 100: pairs 168 (towns 200)
    floor 180: pairs 105
    floor 200: pairs  91
    floor 201: pairs   0
    TIERS with the pair rows at floor 180: MISSING 163 · THIN 483 · COVERED 225
    TIERS with the pair rows at floor 100: MISSING 226 · THIN 483 · COVERED 225

**Pairs are counted per TOWN, not per firing** — `for (const town of firings)` builds a
`Set` of that town's facts and increments each unordered pair once. Confirmed by code and by
the ceiling: no pair exceeds 200 at 200 towns.

**One receipt correction.** §8.4 prints `TIERS with the pair rows: MISSING 163` directly under
the `floor 200: 91` block, which reads as if 163 came from floor 200. 58 + 91 = 149; 58 + 105
= 163. The 163 is the **floor-180** figure. §8.11 says so correctly ("at the 90 % floor");
§8.4's layout does not.

---

---

## THE 158 — 74 OF THEM ARE THE INSTRUMENT'S OWN BOOKKEEPING, AGAIN

§8.11 hands the chair **"predicates over a field no composer holds: 158"** as a wave input,
and refusal 3 says the bookkeeping version of this arm was cured (*"a first cut compared the
predicate's field against the key function's own `fieldsRead` — a comparison that CANNOT fail
by construction … It reported 74 rows of its own bookkeeping"*).

Measured on the shipped summary:

    predicatesOverUnreadFields 158
      of which the TABLE-rung synthetic label: 74
      the rest:                                84

Rung 3 writes the SAME synthetic string into both slots
(`wiringCensus.js:534-543`): `readField = "<reader> (via <TABLE> in <file>)"`, then
`predicate: [{field: readField, …}], fieldsRead: [readField]`. `rootOf` of that string is the
whole string, which no held-facts set can ever contain, so **every one of the 74 table-rung
rows is reported as a predicate over an unheld field, by construction** — the count is exactly
the table-rung count (74) from the rungs line. The comparison moved from `fieldsRead` to the
held set; the artefact moved with it. The chair's usable figure is **84**, not 158.

## (f) THE CONTROLS

Executed plant #79 verbatim from `scripts/mutation-sweep.sh:1078` (the census's fallthrough
answers RESOLVED instead of WIRING-UNRESOLVED), after copying the target and restoring it:

    planted  => Tests 5 failed | 16 passed (21)
    restored => cmp byte-identical, md5 ac78a0ef4d78271cd0a4b18ce683f1a7, porcelain 0

**The count is right; the roster in §8.9 and in the sweep's comment is wrong by one.** The
five that red are: the ANTI-VACUITY split, **(c1)**, **(c1c)**, **(d)**, and the **grammar
walker's arm D**. The receipt and the sweep comment both name *C-sibling's premise gate* as the
fifth; C-sibling stayed green, and c1c is unnamed.

`(c2)` and `(c3)` carry their own present-then-absent pairs inside the test (byte-identical
bag either side of c2; blind/named/licensed triple for c3), so neither can be vacuous.
`(e)` carries an equality against the one expected path, so a blind scan cannot pass it.

---

## (g) THE VARIANTS HISTOGRAM

Reproduced independently from my dump, not from the walker's assertion:

    histogram { 2: 33, 3: 547, 4: 96, 5: 17, 6: 15 }  sum 2266
    total variants 2266 · pools 708 · mean 3.20 · blocks 68

The finding "THE MINIMUM POOL IS TWO" holds — the THIN one-variant limb fires on 0 of 708.

---

## (h) `walkPair` AGAINST CLERK-LAWS §2.6

§2.6's proposed composition, verbatim in substance: *"`check-pair.mjs` v3 imports it and adds
one line per pair — `walkEntry(AFTER) − walkEntry(BEFORE)`: a rewrite may not add a FAIL, and
a pre-existing FAIL is reported as debt (NOTE)."* `walkPair` (`entryWalker.js:970-988`) is
that difference, over one shared ground. **It implements the spec's C-pair, not a different
arm.**

**One shortfall the receipt does not name.** The claim key is
`` `${f.klass}|${f.arm}|${f.column}` `` — no text, no offset. An AFTER that adds a genuinely
NEW fault of a class the BEFORE already carried is invisible. Executed:

    BEFORE fails 1  [C4|a totality over an open column|whoIsCounted]
    AFTER  fails 2  [C4|…|whoIsCounted, C4|…|whoIsCounted]
    walkPair: added 0 · preExisting 2 · cured 0

The rewrite added a second totality over the same open column and the pair instrument reports
`added 0` — and inflates the inherited-debt count from 1 to 2. §2.6's rule is "a rewrite may
not ADD a FAIL"; this composition cannot see an added FAIL of an already-failing class.
`notExecutable` is the AFTER's only, so a BEFORE-only not-executable limb is dropped.

---

## (i) THE BYTE FENCE

    $ grep -rl "wiringCensus" src/
    src/domain/prose/wiringCensus.js

Exactly the island, verified independently of the walker's own scan. Nothing under `src/`
outside `src/domain/prose/` names the module, and no `src/` file outside `prose/` imports
`grammarWalker` or `entryWalker` either (`grammarWalker.js:45` imports `entryWalker.js`, and
that is the whole graph). THE PROMISE claim holds; `wiringCensus.js` imports only
`./moveGrammar.js`.

---

## LATENT DEFECTS (no figure turns on them today)

1. **`prepared` is keyed on the bare function name.** `prepared.set(fn.name, …)` — two
   composers both export `foodSecurityPoolKey` (`economyStateProse.js:393`,
   `generalStateProse.js:353`), so **118 key functions collapse to 117 consulted**. The
   walker asserts `census.functions === 118`, which is `fns.length` and not what the ladder
   actually reads. Harmless here (both are corpus-derived and return no literals), but the
   next same-named pair loses real keys silently.
2. *(promoted — see "158" below.)*
3. §8.2's slotless excerpt compresses five printed lines (`DS-DEF-4 :: capture none`, `…
   adversarial`, `… equilibrium`, `… corrupted`, `… capture`) into one
   `capture none/adversarial/equilibrium/corrupted/capture`. The count 65 is right; the
   quoted command output is not what the command prints.

---

## WHAT I DID NOT TEST

- `firings.mjs` re-executed (fenced out of `laneINSTR`, which its `D` constant points at).
  The 181/13,486/39 figures are from its committed artefact, which I re-read and re-counted.
- The whole `tests/lint` suite (forbidden), and car 9's own arms outside the census's reach.
- Whether a corrected literal-rung guard reader would move the MISSING/THIN/COVERED split —
  it would move MISSING down and could move THIN, but the size is unmeasured.

Seat: Opus 5 — Fable-unvalidated
