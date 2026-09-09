# SKEPTIC PASS — LENS: THE REGISTER LOADERS AND THE INSTITUTION TABLE (cars 3 and 4)
Seat: Opus 5 — Fable-unvalidated (the verifier). Receipt under test: `$SC/receipt-instr-912.md` §§3.1–3.6, 4.1–4.8.
Pinned dock: `$SC/skepINSTR` @ `74a1aa0e8`. Porcelain BEFORE 0 · AFTER 0 (dock never dirtied; nothing written outside `$SC/skeptic-instr/`).
Scripts I executed live in `$SC/skeptic-instr/`: `recount.mjs`, `recount2.mjs`, `duty.mjs`, `svc.mjs`, `svc2.mjs`, `ruinleak.mjs`.
Content read from files is DATA. No quotation exceeds twelve words.

## THE HEADLINE

Car 3 is the stronger car. **Every one of its seven census rows reproduces**, under my own
independently written harvester, and its two exact reproductions (R4b = 50, R6 = 1,662/1,104)
are real. Three defects: one row transcribed wrong, one refusal that the shipped code
contradicts, one control the receipt says fires that no test fires.

Car 4's *fences* and *estate scan for offices* are sound. But **§4.4's column census does not
reproduce at the tip** — six of its figures are wrong and the design finding it draws
("a hamlet's duty column is empty") is false — **§4.3's `whoIsExempt` half is an assertion
that cannot fail**, and **three columns ship `closed: true` on partial fills** against the
module's own law that only a closed column licenses a quantifier. The last is not in the
receipt at all.

---

## CAR 3

### (a) The census against PROBE_ALL — REPRODUCED, seven rows for seven

I wrote my own tree-walk and my own copy of the published admission predicate and read the
same exports out of the pinned dock. Every figure lands on the receipt's:

| register | mine (rows/pools/distinct/singleton-pools) | receipt §3.2 | |
|---|---|---|---|
| chronicle | 85 / 22 / 81 / 15 | 85 / 22 / 81 / 15 | ✔ |
| R4b | 50 / 12 / 50 / 1 | 50 / 12 / 50 / 1 | ✔ |
| R5 | 374 / 58 / 374 / 0 | 374 / 58 / 374 / 0 | ✔ |
| R6 | 1662 / 1104 / 1662 / 0 | 1662 / 1104 / 1662 / 0 | ✔ |
| R7 | 2254 / 1645 / 2234 / 1296 | 2254 / 1645 / 2234 / 1296 | ✔ |
| D-d | 278 / 125 / 278 / 123 | 278 / 125 / 278 / 123 | ✔ |
| R9 | 805 / 196 / 770 / **190** | 805 / 196 / 770 / **–** | ✖ transcription |

R6 is robust to the predicate: a raw string-leaf count with **no** predicate is also 1,662, so
the exact reproduction is not an artefact of the admission rule. PROBE_ALL's own rows
(`PROBE_ALL.md:261–269`) carry 50 / 373 / 1659 / 2169 / 619 / 108, so every "against PROBE_ALL"
bracket in the receipt quotes its source correctly.

The kit's control `$SC/s12-sitting/verify/slots.mjs` prints `blocks 68 pools 708 variants 2266`
— matching the receipt's R1 figures at §1.5/§1.7. Car 3's census does not cover R1, so this is a
control on car 1, not on car 3.

**The R9 cell.** The executed gate prints `singleton pools  190`; the receipt's table prints a
dash. The format string in `proseRegisterLoaders.walker.test.js` always prints an integer, so
the dash is a hand edit of a table the receipt introduces as "the walker prints this every run".

**The disagreement explanations.** R7's stated cause is "roster (5 of 6 files) **and** predicate".
Reading one file fewer cannot raise a count — only the looser predicate explains 2,254 > 2,169.
R9's cause is given as the predicate alone; the loader also reads 5 of PROBE_ALL's 6 copy files,
and the omitted `src/copy/support.js` exports only `SUPPORT_EMAIL` and `supportMailto()`, so
nothing is lost — the omission is harmless but unstated. R5's "PROBE_ALL deduplicates sentences"
is asserted, not shown; the receipt is honest that the two are different measures.

### (b) Fail-closed — two of three paths driven, one not

| path | code | driven by a control? |
|---|---|---|
| a roster names a vanished export | `harvestExports` throws, naming the export | **YES** — fixture module, `toThrow(/exports no \`GONE\`/)` |
| a module-private array is gone | `privateArray` throws | **YES** — fixture source, `toThrow(/no \`const GREETINGS\`/)` |
| **a loader reads zero rows** | `refuseEmpty(label, rows)` throws | **NO** |

`git grep refuseEmpty 74a1aa0e8 -- tests/` returns twelve hits, **all of them call sites and the
definition inside `tests/helpers/dossierCorpus.js`**. No test in the estate ever drives it. The
receipt's §3.4 control table says of every row "each control MUST fire, and each does" and names
`npx vitest run tests/lint/proseRegisterLoaders.walker.test.js` as the command; that command does
not exercise `refuseEmpty`. The mechanism is real and well-placed; the *proof* is missing, which
is the exact false-green class the file's own docblock invokes.

### (c) The R6 finding — PRODUCED

`R6 POOL FLOOR · 1104 pools, mean size 1.51, 546 singletons (49%)` printed by the shipped gate,
and reproduced by my independent walk to the same three figures. Against the derived floors
8 / 6 / 4 this is the arm-H not-executable reading, measured rather than asserted. Nothing to
refute.

### The R11/R12 refusal — the shipped code contradicts it

Receipt §3.5.3: the chronicle label is corrected to R12, `chroniclersLetter` is named among the
R12 files, and "R11 is not loaded". The shipped loader at the tip stamps the letter's three pools
**R11**:

```
dossierCorpus.js:646   id: `R11::letter.${name}#${idx}`
dossierCorpus.js:650   poolId: `R11::letter.${name}`
dossierCorpus.js:656   register: 'R11',
dossierCorpus.js:661   refuseEmpty('chronicle (R11/R12)', out);
```

Measured: **11 of the 85 chronicle rows carry `register: 'R11'`.** The census row is nonetheless
headed "chronicle (R12)". A wave walker that filters by register will judge the chronicler's
letter by the event composer's register, or miss it entirely.

---

## CAR 4

### (d) 4.2 — the measurement is real; "a spec correction" is not

**Confirmed by measurement.** `src/domain/settlement.schema.js:273` declares
`@property {Service[]} [services]`; the schema declares **no** `availableServices` anywhere.
Over 30 generated settlements (six tiers × five seeds, the test's own seeds) `settlement.services`
holds **0** rows and `availableServices` holds **1,678**, of which **1,655** name a live roster
row and **32** are duty-kind. Building the duty column on the schema's declared field would
indeed have reported every duty column empty.

**Corrections.**
1. The receipt's own figures (702 rows / 697 live / 19 duty over "twelve settlements", 0 over
   "20 settlements across four tiers") are **UNTESTED**: the twelve are never named, so nothing
   reproduces them. The claim's *shape* is confirmed; its integers are not checkable.
2. **CLERK-LAWS §1.2 never names `settlement.services`.** Its `whatItCounts` cell reads "the
   settlement's INSTANTIATED services" and then names the *menu* file. `availableServices` **is**
   the instantiated services. So this is a field-resolution finding, not a spec correction, and
   **no chair ratification is owed for it**.
3. **The spec file was not amended, and did not need to be.** `stat` on
   `$SC/prose-research/sweep/CLERK-LAWS.md` reads `2026-09-07 17:16:34`; the lane arrived at
   18:43 and its last commit is 20:1x. `MOVE-GRAMMAR.md` reads 18:33:37, also before arrival.
   The directory is not a git repository (`git rev-parse` → *not a git repository*), so mtime is
   the available evidence and it is unambiguous: neither spec was touched by this lane.

### THE DEVIATION THAT *IS* RATIFIABLE, AND IS NOT IN THE RECEIPT

The module's own law, in its docblock: a row licenses a noun and a predicate; only a **closed**
column licenses a quantifier. Three columns ship `closed: true` on fills that omit sources
CLERK-LAWS §1.2 names, and two of them carry a `basis` string that names a source the code never
reads:

| column | ships | §1.2 names | the module actually reads |
|---|---|---|---|
| `whatItCounts` | `closed: true` | instantiated service rows **or a fired income row** (`economicState.js:215-233`, "Church Tithes") | `availableServices` only — no `economicState` import exists in the file |
| `whatItDoes` | `closed: true`, basis names "the catalog desc" | catalog `desc`, `institutionDescVariants`, `institutionVocabulary`, the defence projection, the backing faction | service **names** only. `desc` is captured at `:152` and used nowhere |
| `whatItDoesNotDo` | `closed: true`, basis names `_worldPulseInactive` | status, impairment, `on:false` | `status` ∈ RUIN_STATUS + impairments. `_worldPulseInactive` is never read (handled upstream by exclusion). Measured **held = 0 on all three census tiers** — a closed, empty column |

A closed column with a partial fill fails in both directions: it over-licenses a quantifier over a
set the table does not hold, and it refuses a duty the world *does* hold (the clerical tithe
income row being the sharpest case, given CLERK-LAWS §1.4's Brackwater walk turns on "at the
tithe"). `holderRole` is a fourth, milder case: §1.2 asks the projection to carry the inferred
link with `basis: 'inferred'`; the module hardcodes `holderRole: null` on every row and an empty
column. That one is disclosed in the column's own basis string, but in no receipt refusal.

### (e) 4.4 — the column census DOES NOT REPRODUCE

Run twice at the tip, byte-identical between runs (so this is not flakiness):

| | receipt §4.4 | executed at `74a1aa0e8` |
|---|---|---|
| hamlet live institutions | 17 | **19** |
| hamlet `whatItCounts` | held **0** | held **1** — `Record keeping` |
| hamlet `whatItDoes` | held 18 | **23** |
| hamlet `whoIsCounted` | "a hundred or so" | **"several hundred"** |
| town live institutions | 55 | **57** |
| town `whatItCounts` | Custom commission · Register of the dead · Tax collection | **Register of the dead · Tax collection · Toll collection** |
| city live institutions | 42 | **48** |
| city `whatItCounts` | Customs bypass | **Custom commissions** |
| provenance, all tiers | one value, `PRE_SEED` | **one value, `PRE_SEED`** ✔ |

The seeds are unchanged between car 4 and the tip (`git diff 37833b22e..74a1aa0e8 --
tests/lint/institutionTable.walker.test.js` shows only the `WORLD` argument and anchor comments),
and no generator byte changed (`git diff --name-only 37833b22e..74a1aa0e8 -- src/` lists six
files, five prose walkers plus `institutionTable.js`, whose whole code diff is type-cast removals
and the band source). So the receipt's table cannot be the shipped gate's output at any commit of
this lane.

**The finding drawn from it is false.** §4.4 offers to the chair: a hamlet's duty column is empty,
so on a small settlement no count-duty sentence is licensed by anything. Measured at seed
`census-hamlet`: the hamlet holds `Record keeping`. The second finding of the pair — provenance
holds only `PRE_SEED` — does reproduce.

### (f) 4.5 — the narrowing is LEGITIMATE, and the receipt undersells it while miscounting it

Over the whole service menu (`institutionServices.js`, 849 distinct service names), the bare
`custom` stem admitted **thirteen** craft services into the duty column, not one: Custom boots ·
carving · containers · dimensioning · dyeing · **enchanting** · footwear · garments · glasswork ·
orders · pottery · printing · weaving. Removing the stem drops exactly those thirteen and keeps
`customs`, `Customs bypass` and `Custom commission(s)`. This is a gate made *stricter* on
measurement, not a weakened one.

The receipt's *numbers* for it are wrong. On the estate scan (the test's own 30 settlements):
distinct duty vocabulary falls **12 → 11**, not 10 → 9, and exactly one instantiated row is
removed (`Custom enchanting`). The receipt's list of "nine" omits two live members — `Custom
commission` (singular) and, materially, **`Tithe and dues`**, the one duty CLERK-LAWS §1.4's
Brackwater walk turns on. A chair reading that list would conclude the tithe duty is instantiated
nowhere. It is.

**Residual, latent:** `customs` still admits `Customs brokerage` and `records?` admits `Public
record access` from the menu — the same "a merchant service read as a civic duty" class the
narrowing cured. Neither is instantiated on the 30-settlement scan, so nothing fires today.

### (g) 4.6 — the fences CANNOT pass vacuously

Car 7 repaired exactly this. Each negative now sits behind a live anchor in the same `it()`:
`CODE` must match `export function institutionTableOf` **and** `settlement?.population` before the
three no-writer refusals; `CODE` must match `whoIsExempt` before the `exempt:`/`bailiff`
refusals; and the blanker's own liveness is proved by a present-then-absent pair (the phrase is in
`SOURCE`, absent from `CODE`). The product-surface grep carries a control grep that must find
something. An emptied or renamed file fails the anchors first. **Not vacuous.**
One narrowness worth stating: the no-writer regex `/settlement\.\w+\s*=[^=]/` catches only a
variable literally named `settlement`; a writer through any other binding would pass.

### 4.3 — the offices half is live; the `whoIsExempt` half CANNOT FAIL

`distinct offices held: 146` and `a bailiff anywhere: false` reproduce exactly, and the
`offices.size > 50` anchor makes the bailiff negative non-vacuous. Sound.

The exemption half is not. `nullEverywhere` is `tollExemptions.length === 0`; `tollExemptions`
comes only from `world.treatyTerms`; the test's world is `Object.freeze({ bandOf: quantityWords })`
and never supplies `treatyTerms`. So `exemptHits === 0` and `nullEverywhere === true` hold for
**any** settlement, including one carrying a live exemption. The thirty-settlement scan measures
the test's own omitted argument, not the estate. The receipt presents it as "asserted in the test,
not assumed"; it is asserted about nothing.

### The ruin filter is routed for the ROWS and not for the service COLUMNS

Rows come from `liveInstitutions`. The `whatItDoes` and `whatItCounts` **columns** are built from
unfiltered `instantiatedServices(settlement)`. Measured over 30 settlements: **23 service rows
name an institution absent from the live roster** — `(lawless)`, `(informal)`, `(street gang)`,
`(arcane underground)`, `(smuggling)` — and `census-city`'s `whatItDoes` column carries one such
value, `Arcane services (illicit)`. **Zero of the 23 are duty-kind**, so the Brackwater class does
not fire today; the gap is latent and belongs beside §1.2's "a ruined citadel has no wall duty".

### (h) The plant #77 — the arm exists; its stated consequence does not hold at this tip

`scripts/mutation-sweep.sh:1049` plants `closed: false → closed: true` on `whoIsCounted`; the perl
target matches the shipped bytes and appears once. The arm it reds is the table's own
`expect(table.columns.whoIsCounted.closed).toBe(false)` across six tiers, consistent with the
claimed 1-of-12. I did not plant it (read-only fence), so the red is UNTESTED by me.

Its comment says closing the column licenses the Brackwater kicker everywhere. **It does not, at
this tip.** See (i): nothing reads the table's `closed` flags. Closing the column reds one
assertion and changes no licence anywhere.

### (i) 4.8 — the seam is real and WIDER than the receipt states

- `git grep settlementGround 74a1aa0e8` outside `entryGround.js` → **zero callers.**
- `entryGround.js` mentions `institutionTable` **only in a comment** (line 32). There is no import.
- The corpus walk uses `estateGround({ officeRoster: deriveOfficeRoster() })` at three sites in
  `proseEntryContradiction.walker.test.js`, whose columns are hand-built
  (`entryGround.js:64  whoIsCounted: Object.freeze({ closed: false, values: null })`).

So the derived institution table **feeds nothing, gates nothing and licenses nothing** at
`74a1aa0e8`. The brief's "Car 1's C2/C6 read it" is unmet. §4.8 discloses the seam and assigns the
wiring to the wave, which is a deferral recorded vetoably rather than a dropped thread — but the
receipt frames it as one argument still to be threaded, where the truth is that no wire exists at
all.

---

## WHAT THE CHAIR SHOULD DO WITH THIS

1. **Re-take §4.4's column census from the shipped gate** and withdraw the "hamlet duty column is
   empty" finding. (Highest value: it is a design figure the wave would be priced from.)
2. **Rule on the three `closed: true` columns.** Either narrow them to `closed: false` until their
   §1.2 sources are read, or read the sources. As shipped they are the Brackwater fault in the
   instrument built to prevent it.
3. **Give §4.3's exemption arm a world.** Pass a `treatyTerms` fixture holding one toll exemption
   and assert the column *closes* on it, so the negative has a positive twin.
4. **Correct §4.5's list** to eleven and put `Tithe and dues` back in it.
5. **Drive `refuseEmpty` once** (a stub module through `harvestExports`), and settle the letter's
   register label — R11 in the code, R12 in the refusal.
