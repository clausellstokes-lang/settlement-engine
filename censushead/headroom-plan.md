# HEADROOM PLAN — the known-failure census, 10/10, measured at `c2f80ffc9`

Companion to `receipt-censushead.md`. Every figure here is CONFIRMED by execution or by a
quoted source line unless marked PLAUSIBLE. **Nothing in this file has been executed as a
change; this is a plan, not a diff.**

## SLOT LEDGER

| # | File :: arm | Group | Verdict | Slots freed | Effort |
|---|---|---|---|---|---|
| 1-4 | `voiceMechanics.test.js` ×4 | prose | **OUT OF SCOPE** — another lane | — | — |
| 5 | `enforcement-claims.test.js` :: `every completeness claim carries an @enforced-by tag with ≥1 target` | docs | REAL DEBT + detector defect | **1** | LOW-MED |
| 6 | `clampPrimitiveBaseline.test.js` :: `baseline exactly matches …` | lint | REAL DEBT, re-freeze road closed | **1** | HIGH |
| 7 | `warCostKindPools.walker.test.js` :: `'trajectory_misread' …` | war | UNWIRED RULED CONTENT | **1** | MED |
| 8 | `warCostKindPools.walker.test.js` :: `'war_trajectory_losing' …` | war | UNWIRED RULED CONTENT | **1** | MED |
| 9 | `warCostKindPools.walker.test.js` :: `'war_trajectory_winning' …` | war | UNWIRED RULED CONTENT | **1** | MED |
| 10 | `warRulingKindPools.walker.test.js` :: `'succession_demand_inherited' …` | war | UNWIRED RULED CONTENT | **1** | MED |

**Total headroom reachable from this lane's scope: 6 of 10.**
The war group alone is **4**, in one act.

---

## A. THE WAR ACT — 4 slots, ONE commit

### A.1 What changes, by file

**`src/domain/worldPulse/warReceiptPools.js`** (hand edit; no generator exists)
- `war_trajectory_winning:` @ line 226 — append annex row 6 **byte-verbatim**
- `war_trajectory_losing:` @ line 233 — append annex row 6
- `trajectory_misread:` @ line 282 — append annex rows 6-10 (five sentences)
- `succession_demand_inherited:` @ line 363 — append annex row 6
- ⚠ Interpolating rows become arrow functions `(x) => \`…${x.settlement}…\`` matching the
  leaf's existing style; non-interpolating rows stay plain strings.
- ⚠ **BYTE-VERBATIM against the annex is the whole contract.** The failing assertion is
  `expect(rendered).toEqual(annex.lines)` — a re-worded sentence still reds.
- (RIDER, not a census slot) `war_culture_suppressed:` @ line 176 — append annex rows 6-10.

**`src/domain/worldPulse/eventProse.js`** — extend `requiredSlots` on four registry rows:
- `warCostKindRow('war_trajectory_winning', …)` @ ~500 — 5 → 6 entries
- `warCostKindRow('war_trajectory_losing', …)` @ ~502 — 5 → 6
- `warCostKindRow('trajectory_misread', …)` @ ~517 — 5 → 10
- `warRulingKindRow('succession_demand_inherited', …)` @ ~629 — 5 → 6
  (current value `[['faction','npc'], [], [], [], []]`)
- (RIDER) `dispositionKindRow('war_culture_suppressed', …)` @ 314 — 5 → 10
- ⚠ `tests/lint/phrasedKindPools.walker.test.js`'s `registrationIssues()` asserts
  `row.requiredSlots.length === row.pool.length` for the WR-2 cohort; the two war walkers
  assert the same by transcription. A length mismatch reds three files at once.

**`tests/lint/warCostKindPools.walker.test.js`**
- `EXPECTED_SLOTS` @ 36 — extend the three kinds' arrays to 6/6/10
- `expect(row.pool).toHaveLength(5)` @ 122 → `toHaveLength(row.requiredSlots.length)`
  (or a per-kind `EXPECTED_DEPTH` table — a table is the stronger pin)
- `expect(new Set(rendered).size).toBe(5)` @ 200 → `.toBe(row.pool.length)`
- `expect(new Set(receipts.map(r => r.familyId)).size).toBe(5)` @ 217 → `.toBe(row.pool.length)`
- `const unsupported = {…}` @ 265 — extend three regexes (see §C)
- Sampling: 300 draws @ 213 over 10 families is ample; 500 @ 229/278 likewise. PLAUSIBLE
  (coupon-collector expectation for 10 families is ~29 draws), and the arms themselves will
  prove it in the cure run.

**`tests/lint/warRulingKindPools.walker.test.js`**
- `expect(row.pool).toHaveLength(5)` @ 72 and `expect(row.requiredSlots).toHaveLength(5)` @ 73
  → per-kind depth (the fourteen-kind census arm covers all rows, so this needs a table, not
  a blanket relaxation — relaxing it to `>= 5` would release thirteen green kinds from their pin)
- `expect(new Set(rendered).size).toBe(5)` @ 100 → `.toBe(row.pool.length)`
- `expect(new Set(receipts.map(r => r.familyId)).size).toBe(5)` @ 115 → `.toBe(row.pool.length)`

**`tests/lint/kindPoolFloors.walker.test.js`** — ⛔ **GREEN TODAY; REDS IF NOT MOVED IN THE
SAME COMMIT**
- strike lines 118 `'succession_demand_inherited'`, 119 `'trajectory_misread'`,
  121 `'war_trajectory_losing'`, 122 `'war_trajectory_winning'`
  (and, with the rider, 120 `'war_culture_suppressed'`)
- `expect(LEGACY_UNDER_FLOOR).toHaveLength(28)` @ 256 → **24** (or **23** with the rider)
- Why coupled, quoted from the file: `expect(violations.map((v) => v.kind)).toEqual([...LEGACY_UNDER_FLOOR])`
  is exact equality, and the per-row depth arm says
  *"a backlogged pool changed depth. DEEPER than five is a win — remove its backlog entry."*
- This is a **test-file hand edit, NOT a register door.** The backlog's own count arm is `<=`,
  so lowering it needs no re-freeze.

**`tests/domain/warCostsNews.test.js`**
- line 145: `expect(entry.familyId).toMatch(new RegExp(\`^${entry.kind}\\.[1-5]$\`))`
  → `[1-9]|10` shape, or derive from the registry. A `.6`…`.10` familyId fails `[1-5]`.
- CONFIRMED as the only such pin: `warRulingsNews.test.js:80` uses the open-ended
  `^${entry.kind}\.` and is safe; `dispositionChannelsDormancyGolden.test.js` pins kind lists
  only, no familyId or prose.

**`docs/GOLDEN_SHIFT_LEDGER.md`** — the disclosed shift (see §B).

### A.2 Predicted figures — WRITE THESE DOWN BEFORE THE CURE RUNS

| Instrument | Now | After the act |
|---|---|---|
| `warCostKindPools.walker.test.js` | 3 failed / 31 passed | **0 failed / 34 passed** |
| `warRulingKindPools.walker.test.js` | 1 failed / 44 passed | **0 failed / 45 passed** |
| `kindPoolFloors.walker.test.js` | green, `LEGACY_UNDER_FLOOR` = 28 | green, **24** (23 w/ rider) |
| `phrasedKindPools.walker.test.js` | green | green (rider changes its `toHaveLength(5)` @ 76) |
| census `entries` | 10 | **6** — after the chair's `--update`, LAST |
| `WAR_RECEIPTS` src-vs-annex mismatches | 5 | **1** (0 with the rider) |
| pool depths | 5/5/5/5 | **6 / 6 / 10 / 6** |

### A.3 The order — mandatory, proved from `scripts/check-test-ratchet.mjs`

1. Author the eight (thirteen with the rider) families into the pools, byte-verbatim.
2. **Same commit**: `requiredSlots`, the two war walkers' fives, the `unsupported` regexes,
   `kindPoolFloors`' backlog + its literal `28`, and `warCostsNews.test.js`'s `[1-5]`.
3. **Same commit**: the disclosed-shift entry.
4. Prove: the two walkers green, `kindPoolFloors` green, `phrasedKindPools` green,
   `warCostsNews` green — then the gate.
5. **LAST, at the landing, by the chair**: `npm run test:ratchet:update` removes the four rows.

⛔ **Never step 5 before step 1.** `check-test-ratchet.mjs:1292` makes a still-failing test
whose row was removed a **REGRESSION** and reds the gate. In the correct order the gate stays
green throughout and merely prints `RATCHET DOWN … run npm run test:ratchet:update to bank the
win` (`:1435`, then `return 0`).

⛔ **All-or-nothing per row.** A partial deepening leaves the row failing with a message the
frozen magnitude pattern `expected \[ …\(5\) \] to deeply equal \[ …\((\d+)\) \]` no longer
matches → `unmeasured` → *"An unmeasured magnitude is an UNKNOWN one, not a small one"* →
`return fail(…)`.

---

## B. THE DISCLOSED SHIFT — mandatory, and legitimate

`src/domain/worldPulse/eventProse.js:77`:

```js
const templateIndex = seed ? fnv1a32(seed) % pool.length : 0;
```

`pool.length` is the modulus, so 5 → 6 (or 5 → 10) **re-maps every seed** for these kinds.
Same-seed receipts change sentence. Under THE PROMISE this is a one-time, ruled widening of a
prose pool — not a change to any world state, event, or outcome — and `1e8bf8a87` already
carries the idiom in its own body: *"wiring = pure widening; the disclosed-shift header
carries the ruling."*

**It must be written into `docs/GOLDEN_SHIFT_LEDGER.md` in the same commit, naming the four
(five) kinds, the old and new moduli, and `1e8bf8a87` + CR-FP-7 as the authority. Never let it
ride silently.**

---

## C. `requiredSlots` — THE LANE'S PROPOSAL, NOT A FINDING

⚠ `requiredSlots` names the **evidence a sentence claims**, not the `{slots}` it interpolates.
`trajectory_misread` family 1 carries `['fieldReport']` while interpolating nothing at all.
Getting this wrong does not merely red a test — it lets a receipt assert a fact the world
never proved. **This table is a proposal for the authoring lane and needs authorial review.**

| Kind | New row | Text | Proposed `requiredSlots` | Why |
|---|---|---|---|---|
| `war_trajectory_winning` | 6 | "The lenders of {settlement} have begun advancing against the victory…" | `['settlement', <lenderAdvance>]` | asserts a **lender fact**; a new evidence slot is needed or the receipt fabricates credit behaviour |
| `war_trajectory_losing` | 6 | "The plate is going inland by cart, and the town has counted every cart." | `[<plateFlight>]` | asserts **plate moving inland and a count**; interpolates nothing, so with `[]` it is reachable under production truth and fabricates |
| `trajectory_misread` | 6 | "The clerk at {settlement} entered the report exactly as it came…" | `['fieldReport', 'settlement']` | claims the report's provenance |
| `trajectory_misread` | 7 | "Every offer {settlement}'s hall prices this season is priced against a country that is no longer there." | `['settlement', 'offerHistory']` | claims **offer pricing**; `offerHistory` already exists in the shared INTERP table |
| `trajectory_misread` | 8 | "One arrival from the field closes the gap at {settlement}…" | `['fieldReport', 'settlement']` | claims a field arrival would close it |
| `trajectory_misread` | 9 | "The captains who could correct the hall are the ones the hall has not heard from." | `['courierDelay']` | claims a **silence** — an absence assertion still needs its evidence |
| `trajectory_misread` | 10 | "Carters through {counterpart} have carried the truer picture for a season…" | `['counterpart', 'settlement', <carterAccount>]` | claims **carter testimony** |
| `succession_demand_inherited` | 6 | "Should {npc} read the war some other way, the hall that opened for him is still a door." | `['npc']` | interpolates and names the successor; the kind keeps four slotless families for fallback |

**Invariants any choice must satisfy** (each is an executed arm today):
- `trajectory_misread` must keep **at least one** `[]` family — `warCostReceipt(kind, null, {})`
  must return a receipt whose `requiredSlots[templateIndex]` is `[]`. Index 2 already is.
- Every non-empty-slot family must be **reachable with complete truth** and must **fall back**
  when its slots are deleted (`'$kind skips every family whose named truth is unavailable'`).
- The `unsupported` production-truth regexes @ `warCostKindPools:265` must be extended so each
  new family is **provably unreachable** under the producer-sized truth set — otherwise that
  arm passes vacuously on the new rows. Suggested additions:
  - `war_trajectory_winning`: `|lenders|advancing against the victory`
  - `war_trajectory_losing`: `|plate|inland by cart`
  - `trajectory_misread`: `|clerk|carters|truer picture|captains`
- Every new line must pass `not.toMatch(/\d|%|×/)` and `not.toContain(row.kind)`, and be
  distinct within its pool. **CONFIRMED by inspection: all eight pass.**

---

## D. `enforcement-claims` — 1 slot

**Cure, in two halves.**
1. **The detector defect (3 of 6).** `tests/docs/enforcement-claims.test.js:40` — narrow
   `0 problems` to `(?<![\d.])0 problems` in `CLAIM_RE`. This removes three lines that report
   *30 problems / 3 errors* and were only ever matched by substring.
   ⚠ Add both controls to the existing `resolver discriminates (negative + positive controls)`
   describe block: `"— 0 problems"` still matches; `"30 problems"` no longer does. A narrowing
   without a two-direction proof is a weakened instrument wearing a cure's clothes.
2. **The real claims (3 of 6).** `GOLDEN_SHIFT_LEDGER.md:2128` and `IN-0C.md:484` each already
   name their enforcer in prose — give them the `@enforced-by` tag form.
   `FABLE_VALIDATION_QUEUE.md:179` is an append-only historical chair-ruling row; tag it or
   scope the corpus walk off history. **Owner-adjacent: it edits a ledger.**

**Coupled, same commit:** lower/remove the matching rows in `FROZEN_NAKED` @ 510-515
(`':: 0 problems': 3` → removed; the others as burned down). The shrink arm reds otherwise:
*"Banked naked-claim debt was BURNED DOWN … Lower or remove these rows in FROZEN_NAKED to lock
the win."*

**Predicted:** naked 6 → 0, `Tests 21 passed (21)`, `FROZEN_NAKED` = `{}` or its surviving
rows. **Then, LAST, the census row.**

⚠ `enforcement-claims.test.js` reads `fs.readdirSync`, not `git ls-files` — a lane's untracked
dock-root `.md` is inside the scanner. Do not leave a graded claim phrase in scratch output
under the repo root.

---

## E. `clampPrimitiveBaseline` — 1 slot, schedule LAST

**Cure:** route 16 files to `src/kernel/math.js`. **Not** a re-freeze:
`BASELINE_CEILING = 62` and `baseline.length === 62`, so raising to 78 breaches a green arm.

Per site, D-W3's chair pre-ruling governs: prove byte-neutrality via
`tests/kernel/clampPrimitive.parity.test.js`, or register a deliberate divergence with an
in-file rationale (the CR-WR10-A pattern). The three known semantic classes are
NaN-passthrough, `Number()||0` coercion, and `+Infinity→1` where the kernel yields 0.

**The sixteen, CONFIRMED by scan replication:**
`display/forceComposition` · `npc/characterConsumers` · `npc/knownCharacter` ·
`townCartography/cartographyBuildings` · `townCartography/cartographyMultiplicity` ·
`worldPulse/conquestDoctrineStage` · `conquestExecution` · `conquestFeasibility` ·
`conquestIntent` · `dispositionLedger` · `dispositionProfile` · `razing` · `razingExecution` ·
`razingWitness` · `warAllianceRisk` · `warCoalitionDecision`

**Order:** migrate → remove each file from `scripts/.clamp-primitive-baseline.json` → lower
`BASELINE_CEILING` → **then** the census row.
**Partial credit is possible but worthless:** the arm is `toEqual` (exact set), so it stays red
until **all sixteen** are gone. The slot frees only at the end.

⚠ `dispositionLedger.js` also carries the D-W4 owner-flag row (`Math.pow(0.5, x)` determinism
under THE PROMISE). A lane touching it should read D-W4 first and not fold the two.

---

## F. RIDER — `war_culture_suppressed`, and a walker that cannot see

Not a census slot; **CONFIRMED dark**. `src=5, annex=10`, and no instrument compares the two:
the only `WAR_ANNEX_URL` readers are `receiptAnnex.js` and the five kind-pool walkers, and
`war_culture_suppressed` belongs to `WAR_DISPOSITION_KIND_REGISTRY`, walked by
`tests/lint/phrasedKindPools.walker.test.js`, **which reads no annex** and asserts only
`expect(row.pool).toHaveLength(5)` @ 76.

**Two acts, both cheap, both in the war commit:**
1. Wire the five families (pool @ `warReceiptPools.js:176`, `requiredSlots` @
   `eventProse.js:314`), strike `kindPoolFloors:120`, take the literal to 23, and relax
   `phrasedKindPools:76/80` to `row.pool.length`.
2. Give `phrasedKindPools` the annex comparison its four siblings have, via the shared
   `receiptAnnexPool` reader. Otherwise the whole WR-2 cohort stays blind to a defect every
   neighbouring cohort detects — precisely the shape the lighting wave exists to close.

---

## G. WHAT THIS BUYS, AND WHAT IT DOES NOT

- **4 slots** from the war act (one commit + one chair `--update` at the landing).
- **+1** from `enforcement-claims`, half of it a one-line detector narrowing.
- **+1** from `clampPrimitiveBaseline`, at 16 behaviour-touching migrations.
- **⇒ 6 of 10 reachable from this lane's scope; 4 of them in a single act.**
- The remaining 4 are the `voiceMechanics` arms, out of scope here.

**It does NOT buy headroom for a new test file until the rows are actually removed.** The
program law that a new test file reds three censuses bites on the *removal*, not the *cure* —
so the chair's `--update` at the landing is the moment headroom exists, and not one commit
before it.
