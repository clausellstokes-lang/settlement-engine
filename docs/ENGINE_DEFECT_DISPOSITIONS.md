# Engine defects recorded and deliberately NOT fixed — the dispositions

**LONG TAIL #40.** A settled, code-facing disposition for each engine defect this estate has
measured and chosen not to cure, written **at the build slot** so a lane reading code here
finds the disposition beside the code instead of re-deriving it.

## Why this file is here and not in the owner's queue

`docs/OWNER_DECISION_QUEUE.md` lives on the **ledger branch**, whose `src/` has had no commit
since 2026-08-11 and is 619 src-touching commits behind this slot (ODQ §928.1). A lane working
code works *here*, cannot see that queue, and — as §928.1 records — **regenerates cured
findings** when it reads code there. The queue keeps the owner's decisions; this file keeps the
code-facing half: what was measured, at which line, and what a lane must **not** do about it.

**Rules for this file.** Append-only: a disposition is superseded by a new dated entry below it,
never edited in place. Every claim names its evidence as `file:line` **at this slot** and says
whether it is **CONFIRMED** (executed) or **PLAUSIBLE** (reasoning only).

---

## §1 — The four dark-pool dispositions are BANKED, not open (2026-09-15, lane-LT40-engine)

The "dark pools" defect car settled five items. **Three are already cured, on banked preserve
refs that are DESCENDANTS of this slot's own HEAD.** A lane reading only the records would
re-cure them here, fork a sealed ref, and collide when the rewrite lands. This section exists so
that cannot happen.

**CONFIRMED at this dock** (`git cat-file`, `git merge-base --is-ancestor`, `git branch -a
--contains`, `git for-each-ref --contains`, all run at `f73bdbf16`):

| item | commit | disposition | where it lives |
|---|---|---|---|
| 1 — the two DS-POW-2 share pools | `a921d54b4` | **CURED, BANKED** | 24 `refs/preserve/*` refs, **no branch** |
| 2 — DS-GEN-18 HOME-FED | `4884e5ccb` | **CURED, BANKED** | the same 24 refs, **no branch** |
| 3 — DS-CND-1 `{reason}` | `67bdb21cd` | **REFUSED, with reasons** | the same 24 refs, **no branch** |
| 4 — the RATE instrument's missing rung | `97302382a` | **CURED, BANKED** | the same 24 refs, **no branch** |

- `git merge-base --is-ancestor f73bdbf16 <each>` is **YES** for all four: the slot is **behind**
  these commits, never diverged from them.
- `git branch -a --contains <each>` is **EMPTY** for all four: nothing has landed them.
- The refs that contain them are the banked rewrite corpus —
  `refs/preserve/clarity-{economy,general,power,warfaith}-2026-09-14`, the eight
  `refs/preserve/dock-lane-*-live` refs, the nine `refs/preserve/scribe-w*` refs, and
  `refs/preserve/lane-promise-seedjoin-2026-09-13`. **The banked rewrite's landing is the
  owner's word.**

### ⛔ Every cause is STILL LIVE at this slot — and that is the trap

Reading the code here shows the defect, because the slot does not carry the cure. All four
re-measured at `f73bdbf16`:

- **item 1** — `src/generators/power/governanceNarrative.js:487` still ends `deriveBaselineConflict`
  in an **unconditional** `return 'A dispute over grazing rights and water access…'`, so
  `recentConflict` is non-empty on every town; `src/domain/display/stateProse/powerStateProse.js:377`
  (`stabilityLensPoolKey`) still returns `'recentConflict present'` first, so
  `governingSharePoolKey` is never reached.
- **item 2** — `src/domain/display/stateProse/generalStateProse.js:1362-1368` (`homeFedChain`) still
  does a bare `label.toLowerCase()` against keys built from a bare `.toLowerCase()`, while its own
  docblock at :1319-1322 says the canonical `resourceKeyForLabel` join is applied. It is not.
- **item 3** — the three `{reason}` variants still stand at
  `src/data/dossierStateProse/stressors.generated.js:2539/:2547/:2556`, and no `{reason}` producer
  exists. `67bdb21cd` REFUSED the cure as a **writing act**: the `{defmaterial}` precedent cannot be
  followed, because that precedent quotes a word the record's own description fixes and this record
  fixes none — all 242 conditions carry one source value, one event type, and a `detail` that is a
  machine sentence about the GENERATOR. Scale banked for a pool run: **235/768 towns, 100 % of
  condition-bearing towns, composing to nothing.**
- **item 4** — `scripts/prose-rate-corpus.mjs` still contains **zero** occurrences of
  `crisisBannerRung` while the product calls it at
  `src/components/new/tabs/OverviewTab.jsx:298`. (Measured with a byte scan, not `grep`: **that
  script carries four NUL bytes at this slot**, which make it invisible to `grep -n`. LT29 car 8
  cured the NUL bytes at `49f2dcab8`, sealed `refs/preserve/lt29-instruments-2026-09-15` — also not
  here. Anything that edits that file should collect LT29 first, or it will be editing a file its
  own tools cannot find.)

### The rule this section exists to state

**Do not re-cure items 1, 2 or 4 at the slot.** Re-writing a cure that exists forks a sealed ref
and collides at the rewrite's landing. Item 3 is **dispositioned, not open** — re-opening it needs
a new argument, not a re-reading.

### ⚠ FOR THE OWNER — the one sentence to rule

> Should the three banked dark-pool cures (`a921d54b4`, `4884e5ccb`, `97302382a`) be lifted onto
> the build slot **ahead of** the banked rewrite?

Lifting them makes each **output-moving** by its own declared figures — `recentConflict` 768 → 520
with DOMINANT 0 → 132 and NARROW 0 → 116; HOME-FED 0 → 20 joins; the rate table 271 → 290 pools with
63 committed values already stale — which puts all three under the **§764.3** sentence ("TRANS is
the LAST same-seed-moving wave"), whose amendment sits uninitialled as item 1 of the owner's
2026-09-15 sitting. **Until that is ruled, the default is: leave them banked.** This row is
recorded here because the sitting document lives on the ledger branch, which a slot lane cannot
write; carry it to the sitting.

---

## §2 — Index of what LONG TAIL #40 landed at this slot

| car | what it is | commits |
|---|---|---|
| 1 | the seed-join cure collected from `refs/preserve/lane-promise-seedjoin-2026-09-13`; red row set identical row for row | `c1792e11a`, `71c16dae8` |
| 2 | `settlement.services` PINNED permanently absent | `2d841ad53`, `43335c380` |
| 3 | the razing spoils PINNED inert — one reader, no writer | `5f9cd858a` |
| 4 | this file | — |

Owner-gated and deliberately untouched by all of them: the §764.3 sentence itself; populating or
retiring `settlement.services` (car 2b); the `Fish market` `priorityCategory` relabel
(`src/data/institutionalCatalog.js:517-522`, the one survivor of §708.7's six named trades); lifting
the three banked cures; curing `history.age`; changing any `fires(n)` constant or the `% 97`
modulus; curing the `compound.inst` snapshot; re-recording the generator golden master; W-COIN /
the treasury field; and the settlement-map module (§724/§739 descope — `grep forcePort` over this
whole checkout returns **zero**, so §708.4's ordering defect is not in this tree at all).

---

## §3 — VERDICT: `fires(n)`'s 65-ceiling is a RARITY DIAL, not an off-by-one (2026-09-15, lane-LT40-engine)

**The question.** `src/generators/priorityHelpers.js:464-472` computes
`threshold = |(e·7 + m·13 + r·17 + mg·19 + c·23) % 97|` and `fires = (n) => threshold < n`,
and all thirteen call sites pass `n ≤ 65`. Does that mean 32 of the 97 slider-hashes can never
fire ANY compound-stress flag **by design**, or is it an **off-by-one in shipped flag logic**?

**VERDICT — a rarity dial, deliberately. CONFIRMED by execution, not read off the source.**

1. `threshold` ranges 0…96 and **all 97 residues are reachable** — measured over the 21⁵
   slider lattice (each priority 0, 5, …, 100): **97 of 97**.
2. `fires(n)` is `threshold < n`, so a flag whose conditions hold fires on exactly `n` of the
   97 reachable hashes. **`n` is a probability numerator**, never a comparison against a score.
   The thirteen dials run 45/97 … 65/97.
3. The consequence is arithmetic: because the most permissive dial is 65, **thresholds 65…96
   (32 of 97) can fire no compound flag at all**, and 62…96 (35) can fire no *fixed* dial.
4. **The dial was watched doing exactly that.** Over 69 configs that ALL satisfy
   `secularBrutalism`'s conditions (economy 32…100, military 75, religion 20, garrison, no
   church): fired on **36 of 36** with threshold < 50, and **0 of 33** with threshold ≥ 50.
5. **The strict `<` is load-bearing.** `stateCrime` is written
   `fires(stateCrimeCond && stateCrimeInst ? 62 : 0)` and depends on `fires(0) === false` as
   its guard. Under `<=` it would fire on settlements whose conditions fail. Executed: at a
   config failing `stateCrimeCond`, `stateCrime === false`, threshold 24. **An off-by-one
   "fix" here would be the defect.**

### ⚠ The correction this verdict carries

The finding that prompted the question said *"every compound-stress flag is false at all-50
whatever the institutions say"*. **The fact is right and the cause named for it is wrong.** At
all-50 the threshold is 50 × 79 mod 97 = **70**, inside the dead band — but every one of the
thirteen **condition** gates already fails at all-50 independently (each wants a priority
≥ 60–70 or ≤ 28–42). Driven with a maximal roster, all-50 returns `anyActive: false` and no
flag true. **The conditions silence the default sliders, not the hash ceiling.**

### Held, and owed

- ⛔ Changing any `fires(n)` constant or the `% 97` modulus moves thirteen flags on every
  settlement. **Owner-gated under §764.3.** Car 5 changed no number.
- ⚠ **Owed, named, not built:** no suite in the estate exercises this dial.
  `tests/generators/stressPriority.test.js` is about `STRESS_PRIORITY`, a different subject;
  the two suites that name these flags (`narrativeQualityCorpus`, `governanceNarrative`) read
  them as downstream inputs. A dial nobody tests is how a tuned constant moves unnoticed.

---

## §4 — REPORT: the ruined-court civic snapshot (2026-09-15, lane-LT40-engine)

**Status: reported, deliberately not cured. No cure option is taken here.**

### The chain, measured at this slot

| step | where | what it does |
|---|---|---|
| producer | `src/generators/economy/economicState.js:62` | `ecoInstFlags = getInstFlags(config, institutions)` — the **raw** roster |
| the read under it | `src/generators/priorityHelpers.js:42` | `nativeSemanticNames(institutions)` — never `liveInstitutions()` |
| the stamp | `src/generators/economy/economicState.js:883` | `compound: ecoInstFlags` — written **once**, at generation |
| the consumer | `src/domain/display/stateProse/defenseStateProse.js:578` + `:616` | `const compound = settlement?.economicState?.compound?.inst \|\| {}`, then `civicFlag(compound.hasCourtSystem), civicFlag(compound.hasPrison)` (`civicFlag` itself at `:269`) |
| the pool that keys on it | same file, `:1369` (the DS-DEF-6 collision block) | DS-DEF-2 row 3 `internalRowPoolKey` = `hasCourtSystem` × `hasPrison` |

Nothing on the advance path recomputes `compound`.

*(Every line cite in this section is read AT THIS COMMIT'S TIP — this car's own two docblocks
shift `economicState.js` by 11 lines and `defenseStateProse.js` by 22, so the recon brief's
pre-edit cites `:51`, `:872` and `:240-248` do not resolve here and are corrected above.)*

### CONFIRMED by execution — city seed `civic-probe`

```
civic rows on the roster: Gambling halls · City hall · Multiple courthouses · Large prison
compound.inst.hasCourtSystem = true   hasPrison = true
(mark the four civic rows ruined)
live roster drops to 42 of 46
a RECOMPUTE over the RAW roster  : {"court":true,"prison":true}
a RECOMPUTE over liveInstitutions: {"court":false,"prison":false}
THE STAMP still on the record    : {"court":true,"prison":true}
```

**So a town whose court and prison are rubble still asserts a full legal chain** — a floor-1
self-contradiction reachable with no authoring error.

### The two cures, priced, neither taken

1. **Recompute from `liveInstitutions()` at READ** (in the desk). Narrow blast radius —
   DS-DEF-2's civic rows only — but it leaves the producer lying to every other consumer.
2. **Re-derive `compound` at ADVANCE** (in the producer). Correct at the source, and the
   widest possible blast radius: `compound`'s flags feed prosperity, safety, services, NPC
   generation and the power layer, so every advanced world's economic record moves.

**Both are output-moving on every ruined town, so both are owner-gated under §764.3.**

### The family this belongs to

This is the §708.7 family's house rule broken at the producer: **a roster read goes through
`liveInstitutions()`** (`src/domain/institutions/institutionRoster.js:53`; **25 consumers in
`src/` at this tip**). `getInstFlags` is one of the reads that does not. Fixing the rule
wholesale is a sweep, not a car.

### ⚠ A budget hazard found while writing this section

`src/generators/economy/economicState.js` sits under a **frozen 900-line cohesion ceiling**
(`tests/generators/economicStructure.test.js:39`, `MODULE_LINE_CEILING = 900`, strict `<`). At
the start of this car the file counted **886**, so the 28-line docblock the trace wanted **broke
the ceiling**: `expected [ [ 'economicState.js', 914 ] ] to deeply equal []`. The note was
**compressed to 11 lines**, never the ceiling raised. **In that file a comment is a budget
item** — it now counts 897, i.e. **2 lines of headroom left**.

---

## §5 — PINNED, NOT LIFTED: `history.age` is a generation-time constant (2026-09-15, lane-LT40-engine)

**Status: the freeze is DELIBERATE, RECORDED, and now ASSERTED by a test. The cure stays
owner-gated.**

### Two clocks over one world

| clock | where | behaviour |
|---|---|---|
| the campaign year | `src/domain/worldPulse/worldState.js:718` `calendarFromWeeks` | RE-DERIVED from canonical elapsed weeks on every tick |
| `history.age` | `src/generators/historyGenerator.js:829` `resolveSettlementAge`, written at `:843` | DRAWN ONCE at generation, never rewritten |

`grep -rnE "\.age\s*=[^=]" src` at this tip returns **exactly one line** — `historyGenerator.js:843
founding.age = age;`. There is no second writer anywhere in `src/`.

### CONFIRMED by execution, twelve `one_year` advances of `advanceCampaignWorld`

```
calendar.year : 2,3,4,5,6,7,8,9,10,11,12,13
history.age   : 215,215,215,215,215,215,215,215,215,215,215,215
identical-object-reference ticks: 0 of 12
settlement keys that moved over the run: population, powerStructure, populationHistory, activeConditions
```

The record is genuinely re-emitted on every tick and four of its fields move; `history` is
carried through each rewrite untouched. **The age is not stale data, it is a different fact**:
the year the settlement was founded ago, drawn once.

### Why it is not cured here

The diary ruled it on 2026-09-14: **REPORTED NOT FIXED, because curing it moves rendered
text.** Every prose surface that speaks of a settlement's age would move on every advanced
world, and the roll that ruling 26 (h) turns on is a generation-time constant today. Its named
consumer (`renderYearOf` in `faceSources.js`) does not exist at this slot at all: it rides the
banked rewrite kernel, so a cure here could not even be measured end to end. **Owner-gated
under §764.3.**

### What car 7 built instead

`tests/domain/worldPulseTickClock.test.js` gains ONE arm, in the suite that already owns the
authoritative tick clock: twelve real advances, the campaign year asserted to increment and
`history.age` asserted invariant, with the live population asserted as the anti-vacuity anchor.

**NEGATIVE CONTROL, EXECUTED.** A one-line plant in `populationDynamics.js`'s settlement
rewrite (`history: { ...settlement.history, age: age + 1 }`) reds the arm:
`expected [ 216, 217, 218, …(6) ] to deeply equal [ 215 ]`. Reverted by file copy, byte-verified
with `cmp`. ⚠ TWO EARLIER PLANTS — in `advanceInterval.js`'s `foldUpdatesOntoSaves` and in
`demographicsKernel.js`'s natural-step rewrite — left the arm GREEN: neither is on the path
this fixture exercises. Recorded because it is the useful half: an arm can be green against a
plant in a file that merely looks like the writer, and only a control names the writer that
actually feeds it.

### ⚠ A budget note for the next lane, and ONE CITE THAT MAY NOT BE CORRECTED

The docblock this car adds to `historyGenerator.js` moved every line below it by 17, which
restaled two prose cites to `historyGenerator.js:888`. One was followed; **the other may not
be, and that is the finding worth carrying**.

- `tests/lint/observedShapeSentinel.test.js` — FOLLOWED to `:905`. Ordinary comment, 33 of 33
  green alone.
- `scripts/check-observed-shape-readers.mjs` — **DELIBERATELY LEFT STALE AT `:888`.** That file
  is a HASH-PINNED DETECTOR SOURCE. Changing three digits inside one of its comments reds
  `tests/lint/observedShapeReaders.walker.test.js` with: *"a DETECTOR SOURCE drifted since the
  mint — that needs a governed migration, not a re-freeze: expected [ 'scripts/check-observed-shape-readers.mjs' ] to deeply equal []"*.
  Proved in both directions: RED with the three-digit comment edit, and 44 of 44 GREEN the
  moment the file was restored from HEAD. **Correcting a comment there costs a governed
  migration, which a docblock car may not spend**, so the cite stays at `:888` and this
  paragraph is its correction. A reader who follows it lands 17 lines above the conditional
  spread it names; the shape it describes is unchanged.

⇒ TWO RULES FOR THE NEXT LANE. A line-keyed citation in this estate is a budget item exactly
as §4's comment was; and **before following one, check whether its file is a detector source**,
because there the cheapest correct act is to leave the number wrong and say why.
