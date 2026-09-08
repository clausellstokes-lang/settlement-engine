# RECEIPT — lane DOCKET-2 — **COMPLETE for this dispatch · 1 LANDED · 1 MEASURED · 1 STOPPED**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: DOCKET-2 · dock `$SC/laneDOCKET2`, detached, base `5e28d5c83`⟧

Items taken this dispatch: **3, 4, 8**. Items 1, 2, 5, 6, 7 belong to lane DOCKET (`$SC/receipt-docket.md`).

## ARRIVAL — verified in-shell
```
HEAD      5e28d5c8376b2c7333ffc8b911b378f04629da8f   (matches the brief)
porcelain 0
node_modules  453 symlinks, ZERO real package dirs (never materialised)
```

## ⛔ VITEST HOLD IN FORCE. Every owed vitest proof is listed as **OWED-UNTIL-RESUME**
with its exact command. Everything below was executed with `node`, `grep` or `git` and its
exit captured in-shell.

| item | state | sha |
|---|---|---|
| 3 — five display consumers split a band label on an em dash | ✅ **LANDED** (the brief's framing is CORRECTED; one half is the chair's) | `a6f01d757` |
| 4 — `economyInputFingerprint` hashes two display labels (MEASURE ONLY) | ✅ **MEASUREMENT COMPLETE** | — (no code act, as briefed) |
| 8 — the bare-common CASING class | ⛔ **STOPPED WITH MEASUREMENT** — the ruled mechanical draft is refuted, and the precedent is not in my ancestry | — |

---

# ⛔⛔ THREE PREMISE CORRECTIONS, MEASURED, BEFORE ANY CODE ACT

### C1 — `dailyLifeLogic.js:74` does NOT split on an em dash. It splits on a COLON, and it is a NO-OP on 360/360 worlds.
The brief lists it as the fifth em-dash consumer. Measured at `5e28d5c83`:
```js
const safetyLabelFromProfile = (sp.safetyLabel || '').split(':')[0].trim() || null;
```
`grep -n '—' src/components/new/dailyLifeLogic.js` returns only comment lines; the file's ONLY
`split` is that colon. Driven over 360 settlements, **no safety label contains a colon**, so the
expression returns the whole label every time — a parser that has never fired. It is a latent
TRUNCATOR, not a live band-splitter, and the class it belongs to is different from the other four.

### C2 — the census is NOT five. Two more em-dash consumers exist in `src/`, and the brief names neither.
| site | expression | in the brief? |
|---|---|---|
| `src/generators/aiLayer.js:140` | `via.summary?.split('—')[0]?.trim()` (prosperity) | ⛔ no |
| `src/components/settlement/DeityAssignmentPanel.jsx:86` | `label.split(/\s+—\s+/)[0]` (deity axis label) | ⛔ no |
| `src/generators/power/settlementNarrative.js:32` | `rel.description.split('—')[1]` (NPC relationship) | ⛔ no |
`DeityAssignmentPanel`'s is the interesting one: its own docblock says *"Longer labels carry an
explanatory clause after an em dash; the register needs only the canonical leading name"* — the
same class, independently reinvented, over a DIFFERENT vocabulary (`DEITY_ALIGNMENT`/`DEITY_TIER`).

### C3 ⛔⛔ — **THE DEFECT IS NOT LATENT. IT IS LIVE, TODAY, ON 174 OF 360 WORLDS.**
The brief frames item 3 as fragility: *"a wording change anywhere upstream silently breaks them
(measured: 186/360)"*. That is PROSE-REBASE's differential figure — base vs a cure that never
landed. The em dash is **not a field separator in this vocabulary at all**. Exhausting
`deriveEconomicComplexity` over (tier × incomeSources 0..14 × exports 0..14 × hasMarket):

```
economicComplexity vocabulary: 11 distinct
   —dash  "Highly diversified — multiple major revenue streams"
   —dash  "Diversified — broad institutional economic base"
   —dash  "Concentrated — fewer revenue streams than scale suggests"
   —dash  "Limited — narrow economic base for this scale"
   —dash  "Subsistence — survival economy"
    BARE  "Diversified market economy"
    BARE  "Specialized production and trade"
    BARE  "Mixed subsistence and market"
    BARE  "Agricultural surplus with trade links"
    BARE  "Subsistence with minor surplus"
    BARE  "Subsistence with surplus"
⛔ 6 of 11 carry NO em dash: split('—')[0] returns the WHOLE STRING on these.
```
Driven over the same 360-settlement corpus, **`SummaryTab.jsx:213` renders the full phrase — not a
band — on 174/360 worlds (48%)**. The Economy `SitTile` sub-line, a compact tile whose whole purpose
is the band word, prints `"Subsistence with surplus"` (54x), `"Diversified market economy"` (58x),
`"Mixed subsistence and market"` (50x), `"Subsistence with minor surplus"` (9x), `"Specialized
production and trade"` (2x), `"Agricultural surplus with trade links"` (1x).

⇒ **This changes the cure.** A typed `{band, condition}` at the producer must DECIDE a band word for
six values that have never had one. That is authoring reader-facing words — the same class as item 8,
and the same class as §0c-3, where the precedent is that **the Fable chair authors the words**
(`8c23f1555` "the eleven in-sentence forms of {complexity}, authored by the Fable chair"). It is not
a mechanical refactor and it is not a lane's.

Receipts: `$SC/docket2work/consumer-render.mjs` / `.out` (exit 0), `$SC/docket2work/fp-census.mjs` / `.out` (exit 0).

---

# ITEM 4 — ✅ MEASUREMENT COMPLETE. No code act, exactly as briefed.

## The write set, the read set, and the register row — complete
| site | role |
|---|---|
| `economyReconciliation.js:171` (`projectPowerGenerationIntent`) | **WRITE** |
| `economyReconciliation.js:283` (`reconcilePowerStructure`) | **WRITE** |
| `economyReconciliation.js:359` (`assertPowerEconomyFreshness`) | **READ** — the throw |
| `src/generators/steps/stepMetadata.js:164` | **READ** — presence only, picks a rail summary string |
| `tests/generators/powerEconomyFreshness.test.js:155,198` | test |
| `scripts/.writer-reach-baseline.json:1753` | register row `"economyInputFingerprint on powerStructure"`, reach `""` |
| `docs/GENERATION_CONTRACTS.md:50,160` | contract doc |

`assertPowerEconomyFreshness` has **exactly three call sites**, and all three are inside the
generation pipeline: `steps/powerEconomyReconcilePass.js:41`, `steps/assembleSettlement.js:204`
and `:223`. `assembleSettlement.js` is imported only by `steps/index.js` (step registration).

## ⭐ THE LIFECYCLE VERDICT — the persisted stamp is WRITE-ONLY across the save boundary
| path | does it re-assert a PERSISTED fingerprint? | evidence |
|---|---|---|
| create (`generateSettlement`) | no — writes label and stamp in the same run | `settlementSlice.js:379-411` builds `fullConfig` from the wizard's form state and mints a fresh seed |
| read / hydrate (`hydrateFromSave`) | **no** — assigns settlement/saveId/seed/phase/eventLog/locks; runs no generator | `densityCreateBoundary.js:44-46`, measured by that car |
| persist (`saves.js`) | no — `JSON.stringify` of the whole blob; `_normalize` is a shape adapter, not a freshness check | `saves.js:125,265` |
| **regenerate** (`regenSection`) | **no — and this is the load-bearing one.** It has exactly TWO branches, `npcs` and `history`, calling `regenNPCsPipeline` / `regenHistoryPipeline`. Neither touches `economicState` or `powerStructure`; neither reaches `assembleSettlement` | `settlementSlice.js:680-775` read in full |
| undo | no — no undo token on `regenSection` (`operationRegistry.js:111` `undoToken:null, undoState:'none'`) | |
| clone | no — `cloneJson`, structural | |
| import | no — `importReconciliation*` is a save-admission family, not a generator | |

⇒ **CONFIRMED: nothing in the tree ever re-asserts a loaded world's fingerprint against a fresh
recompute.** The cross-version throw PROSE-REBASE flagged is **currently unreachable**. It becomes
reachable the instant anyone adds a load-time freshness check — and the field is persisted, so the
hazard is real but *latent*, not live.

## ⭐⭐ THE BLAST RADIUS IS 4.6× THE FIGURE IN THE FINDING
PROSE-REBASE measured **22/360** fingerprints moving, because the cure it was measuring touched only
two producers (`safetyProfile.js:119` = 8 worlds, `foodGenerator.js:342` = 14 worlds). That is the
figure for THAT cure, not the field's exposure. Measured over the same 360 worlds, the exposure of
the fingerprint to **any** re-wording of an em-dashed safety or food label is:

```
ARM A  persisted fingerprint === fresh recompute : ALL 360   (present on 360/360)
ARM B  prosperity  :  5 distinct,  0 em-dashed  →   0/360 worlds
ARM B  safetyLabel : 22 distinct, 19 em-dashed  → 102/360 worlds
ARM B  foodLabel   :  5 distinct,  1 em-dashed  →  14/360 worlds
ARM C  fingerprints that MOVE under a ' — ' -> ': ' cure: 102/360
```
**102 of 360 (28%)**, not 22. Two of the four hashed inputs are display strings, and 19 of the 22
safety labels the generator can emit carry a gloss that a prose pass would touch.

## ARM D — the throw, demonstrated on a real world (not argued)
```
SAVED-WORLD CROSS-VERSION PATH, on SUBw4-fence1-thorp-road-000
  stored fingerprint : power-economy-v1:08b75332
  label before       : "Dangerous — Plague Unrest — Plague Conditions"
  label after a cure : "Dangerous: Plague Unrest: Plague Conditions"
  assert THREW       : YES
  Power/economy freshness invariant failed: the final power structure consumed
  power-economy-v1:08b75332, expected power-economy-v1:540daf4c.
```

## WHAT A VERSION BUMP COSTS — measured, offered as "test this, don't trust it"
`ECONOMY_FINGERPRINT_VERSION` is a module constant (`economyReconciliation.js:37`) embedded in the
stamp itself (`power-economy-v1:<digest>`), so the version is **self-describing on every persisted
world** — a tolerant recompute can branch on the stored prefix without a schema migration.
`SCHEMA_VERSION` in `settlement.schema.js:47` is **1** and is a separate, coarser dial; nothing
couples the two today. Costs, in order:
1. Every persisted stamp keeps its old prefix. A reader must accept `v1` and `v2`. **No `SCHEMA_VERSION` bump is required** for that.
2. `tests/generators/powerEconomyFreshness.test.js` pins the stamp by recompute, not by literal, so it does not carry a golden of the digest.
3. `scripts/mutation-coverage-manifest.json:794` names this module's contract as self-proving; a shape change re-opens that rationale.
4. The `writer-reach` register row for `economyInputFingerprint` currently records reach `""`. Any new reader moves it.

## ⛔ THE CHAIR'S CALL — I built nothing, as the brief requires
The brief's own ordering is right and the measurement now sharpens it: the fingerprint should stop
hashing display strings **at all**, rather than being versioned around each successive re-wording.
Both hashed labels are *derived from typed facts the generator already has* — `safetyProfile` knows
its strain band and its condition list before it joins them; `foodSecurity` knows `stressFamine`
before it composes `'Deficit — Active Famine'`. Hashing the TYPED inputs instead of the rendered
strings makes the fingerprint immune to every future prose pass, and it is the same act as item 3.
⚠ **That is a mechanism, not a measurement** — it needs its own proof, it is a persisted-shape act,
and it is owner-gated. **Reported, not built.**

---

# ITEM 8 — ⛔ **STOPPED WITH MEASUREMENT.** The ruled cure ("draft them mechanically") is refuted, and the precedent it names is not in my ancestry.

## ⛔ BLOCKER A — `COMPLEXITY_NOUN` DOES NOT EXIST AT MY BASE
The brief rules the nouns be *"asserted both directions like `COMPLEXITY_NOUN`"*. Measured:
```
$ grep -rn "COMPLEXITY_NOUN" src tests scripts        ->  (no output)
$ git merge-base --is-ancestor 333b1a83c 5e28d5c83    ->  exit 1   (DESK-ECON2's car)
$ git merge-base --is-ancestor 940d161ca 5e28d5c83    ->  exit 1   (its base)
$ git log --oneline -S'COMPLEXITY_NOUN' --all         ->  333b1a83c, 8c23f1555, 18200c832, e3bfb3eb8, f7d2430ab
```
`SLOT_FILL_TABLES` at my base is `Object.freeze({ access: ACCESS_NOUN })` — one table. The annex row
for `{complexity}` still ends *"until §0c-3 is ruled"*. **DESK-ECON2's car is on an unmerged line.**
Item 8's cure edits the same two surfaces that car edits (`economyStateProse.js`'s `SLOT_FILL_TABLES`
and the `RECEIPT_POOLS_DOSSIER_STATE.md` §0c rows), so building it here hands the chair a guaranteed
replay conflict. ⭐ The brief's analogy is also to a table that, at my base, is named `ACCESS_NOUN`.

## THE CASING CENSUS — over the CLOSED table, not a sample
The brief's figures (0/318, 0/123, 0/314) are OCCURRENCE counts over a 24-settlement sample. The
number that sizes the cure is the DISTINCT closed vocabulary, exhausted from `SUPPLY_CHAIN_NEEDS`:

| slot | producer | occurrences | **distinct** | conformant to `bareCommonFill` | sole refusal reason |
|---|---|---|---|---|---|
| `{chain}` | `chain.label` | 74 | **74** | **0/74** | CAPITALISED |
| `{resource}` | `chain.resource` | 49 | **30** | **0/30** | CAPITALISED |
| `{good}` | `chain.outputs[]` | 242 | **197** | **0/197** | CAPITALISED |
| | | | **301 total** | **0/301** | |

⭐ Not one string is refused for a determiner, an em dash, a digit, an engine token or a sentence
break. **Capitalisation is the whole defect** — which is what makes the mechanical draft tempting.

## ⛔⛔ AND THE MECHANICAL DRAFT IS A TRAP — `bareCommonFill` SCREENS THE FIRST CHARACTER ONLY
`bareCommonFill`'s last line is `return /^[a-z]/.test(value) ? value : undefined;`. So a first-letter
lowercase makes **301/301 pass the shape check** — and leaves **83 of them visibly wrong**:

```
{chain}     51 of 74 use '&' as a CONJUNCTION; 71 of 74 keep an interior capital
            "Grain & Bread"        -> "grain & Bread"
            "Fishing & Seafood"    -> "fishing & Seafood"
            "Alpine Wool and Dairy"-> "alpine Wool and Dairy"
{resource}  12 of 30 keep an interior capital
            "Alpine Pastures"      -> "alpine Pastures"
            "Camel Herds"          -> "camel Herds"
{good}       0 of 197 keep a capital, 0 use '&'   ✅
            "Aged cheese"          -> "aged cheese"
```
The desk would render *"the fishing & Seafood keeps more hands busy"* and the shape contract would
be GREEN over it — the exact failure `dossier-slot-shapes.mjs`'s own docblock exists to prevent
(*"off its the road"*). ⇒ **the brief's "draft them from the labels mechanically" is refuted for
`{chain}` and for 12 of 30 `{resource}`s.**

## THE MEASURED SPLIT — one slot IS mechanically curable, two are not
| slot | verdict |
|---|---|
| **`{good}` (197)** | ✅ **mechanically curable.** 0 interior capitals, 0 ampersands; the lowercase yields real noun phrases. A lane can build this with a both-ways assertion. |
| **`{resource}` (30)** | ⚠ **18 mechanical, 12 need a word.** `"Mountain Pass"`→`"mountain pass"` is fine; a full lowercase needs a proper-noun screen to stay safe. |
| **`{chain}` (74)** | ⛔ **not curable by transform.** These are CATEGORY HEADINGS (`"Law & Governance"`, `"Letters of Credit & Finance"`), not common-noun phrases. This is §0c-3 exactly, and §0c-3's precedent is that **the Fable chair authors the words** (`8c23f1555` — *"the eleven in-sentence forms of {complexity}, authored by the Fable chair"*), which DESK-ECON2's own retrovalidation row 2 restates: *"Reader-facing words ⇒ the chair's, not a lane's."* |

## `POSTURE: import_dependent` — ⛔ PRODUCER-LESS, re-derived independently at my base
`deriveExportPosture`'s `if`-chain (`exportPosture.js:58-62`) has FIVE arms; `import_dependent` is a
key of `EXPORT_STATUS_LABEL` (`:25`) that no arm assigns. Exhausted over 168 combinations
(count × access × isEntrepot × primaryExports-vs-legacy-exports):
```
statuses REACHED = [["entrepot",70],["established",48],["limited",12],["none",28],["vulnerable",10]]
declared in EXPORT_STATUS_LABEL but NEVER produced: ["import_dependent"]
non-vacuity control — distinct arms reached: 5   OK (the probe discriminates)
```
⚠ **A FALSE REPORT I CAUGHT BEFORE MAKING IT.** My first probe passed a flat object where
`deriveExportPosture` reads `settlement.economicState.primaryExports`, so all 168 calls fell to the
`count === 0` arm and returned `"none"`. A "finding" printed from that run would have been the
FALLBACK BRANCH talking. The probe now carries a non-vacuity control that fails loudly if fewer than
two arms are reached.

Receipts: `$SC/docket2work/casing-census.mjs`/`.out`, `casing-trap.mjs`/`.out`,
`posture-exhaust.mjs`/`.out` (all exit 0).

---

# ITEM 3 — ✅ **LANDED `a6f01d757`** — the band is read from a vocabulary, not from a delimiter offset

## THE CURE
`src/domain/display/labelBands.js` (**NEW**, dependency-free — it is reachable from the eager
first-paint graph through SummaryTab/OverviewTab, exactly like `exportPosture.js`) declares each
producer's band vocabulary and recovers the band by matching it, so a gloss and its punctuation are
irrelevant. No silent default: `bandOf` returns `null` and each caller states its fallback in the
open — the shape `safetySeverity.js` already uses for the COLOUR of these very labels.

| consumer | before | after |
|---|---|---|
| `SummaryTab.jsx:212` | `powStab.split(';')[0].split('(')[0].split('—')[0].trim()` | `stabilityBandOf(powStab) ?? powStab.trim()` |
| `SummaryTab.jsx:213` | `eco.economicComplexity?.split('—')[0].trim()` | `complexityBandOf(...) ?? eco.economicComplexity` |
| `OverviewTab.jsx:301` | `sp.safetyLabel?.split('—')[0].trim()` | `safetyBandOf(sp.safetyLabel) ?? sp.safetyLabel` |

`SAFETY_BANDS` (14) and `STABILITY_BANDS` (16) are token lists — those labels are COMPOSED at
runtime. `COMPLEXITY_BAND_BY_LABEL` is an EXACT 11-key map, because that producer returns whole
authored strings. **Four arms in the EXISTING `tests/lint/vocabularyTotality.walker.test.js`** (no
new test file) bind each vocabulary to its producer both ways.

## PROOF — every exit captured in-shell
| proof | result |
|---|---|
| **EQUIVALENCE** over the COMPLETE producer vocabularies | ✅ **62/62 byte-identical** old vs new — complexity **11/11** (exhausted over tier × 0..14 × 0..14 × bool), stability **22/22**, safety **29/29**. Zero visible change. |
| **TREE PLANT** through the real producer | one gloss re-worded (`'Fractured — …'` → `'Fractured: …'`), 360 settlements re-driven: **OLD cascade MOVED on 12/360 · NEW moved on 0/360** |
| plant restore | **INVERSE EDIT**, `cmp` exit **0** against a backup taken BEFORE the plant; md5 `0709887d6bd99faac539765fbdb0643d` both sides; porcelain for that file empty |
| STRING-LEVEL PLANT over every label (both conventions re-worded) | stability OLD 20/22 → NEW **0/22** · safety OLD 24/29 → NEW **0/29**; non-vacuity control: the OLD expression broke on 49 labels (a plant the old code survives proves nothing) |
| the four walker arms, replayed in plain node | **all 23 assertions pass**, exit 0 (`$SC/docket2work/arm-replay.mjs`) |
| `npx eslint` on all four files | exit **0**, output **0 bytes** |
| `node --check` / `npx esbuild` JSX parse | exit **0** on all four |
| commit integrity | the four committed blobs md5-equal the working tree — **no pre-commit `--fix` re-stage** |

## ⛔ A DECLARED LIMIT OF MY OWN CURE, reported rather than buried
`COMPLEXITY_BAND_BY_LABEL` is keyed on the exact label, so a re-worded complexity gloss still misses
the lookup — **OLD 5/11, NEW 5/11, no improvement on that slot.** What the cure buys there is that
the breakage becomes **LOUD** (the totality arm's both-ways assertion fails) instead of silently
changing a tile. Immunity needs the six missing band words, which is authoring reader-facing prose.

## ⛔ NOT TAKEN, deliberately — and it is a FINDING
`safetyProfile.js:218` — the producer re-parsing its own composite label — is left alone. Typing that
local array (it is a local `const`, so it costs **zero persisted bytes** and is exactly the chair's
"typed shape at the producer" where it is free) would ALSO fix a latent bug I found while reading it:
`'Dangerous — Plague Unrest'` is itself one of the producer's `strainLabel` values (`:119`), so the
emitted label carries TWO em dashes and `l.split(' — ')[1]` on a non-first occurrence yields
`'Plague Unrest'` instead of `'Plague Conditions'`. **That branch never fires in the corpus** — none
of the 22 distinct labels carries `' + '`, so `safetyLabels.length > 1` is unreached on 360/360.
A behaviour change on an unreachable path is its own car and its own ruling.

## ⏱ OWED-UNTIL-RESUME — the exact commands, to run the moment the chair sends RESUME
```
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/vocabularyTotality.walker.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/safetySeverity.test.js
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/          # WHOLE DIR — a src-adding train owes it
sh scripts/gate-mutex.sh --run -- npx vitest run tests/ui/            # the two edited components' mounted arms
node scripts/check-test-ratchet.mjs                                    # read-only, no --update
```
⚠ Predicted: `tests/lint/` will red on `sovereigntyLightingContract` (my ONE new src file) and on the
PRE-EXISTING banked `clampPrimitiveBaseline` row lane DOCKET measured at its own tip.

---

# ⭐ RETROVALIDATION ROW (Opus 5 lane → Fable 5.1 chair)

## WHAT WAS JUDGED — each is a call, not a fact; veto any of them
| # | judgment | where it lives |
|---|---|---|
| J1 | **Item 3's cure is a VOCABULARY MATCH, not the typed `{band, condition}` object the ruling names first.** The ruling's second branch ("or the estate's existing band vocabulary — read `bands.js` first") is the one I took, after measuring that `src/domain/state/bands.js` holds a DIFFERENT ladder (the 0-100 SystemState Critical/Vulnerable/Strained/Stable scale) and is not the home for these labels. A typed object at the producer would also be a **persisted-shape addition** — `economicState`/`powerStructure` are `JSON.stringify`d whole into every save — which is the very class item 4 was carved out as chair-gated for. The brief did not notice that item 3's ruled cure shares it. | item 3 |
| J2 | **`SummaryTab:213` was NOT given band words for the six band-less complexity labels.** The map declares `null` and the tile falls back to the full label — byte-identical to today. Authoring those six is the §0c-3 class. | item 3 |
| J3 | **`safetyProfile.js:218` left alone**, because typing it fixes a latent bug on an unreached branch — a behaviour change needing its own ruling. | item 3 |
| J4 | **The arms went into the EXISTING `vocabularyTotality.walker.test.js`, not a new test file** — it is already the totality authority and already binds `safetySeverityOf` to `safetyProfile.js`. Cost: no new test-file census row; only titles move. | item 3 |
| J5 | **Item 4: nothing built**, per the brief. The measurement recommends hashing the TYPED inputs rather than versioning around each re-wording — offered as *"test this, don't trust it"*. | item 4 |
| J6 | **Item 8: STOPPED, not built.** Two independent grounds: the precedent it names is not in my ancestry, and the ruled mechanical draft is refuted for 83 of 301 strings. | item 8 |

## WHAT THE FABLE CHAIR MUST RE-DERIVE
1. ⛔⛔ **J1 first — does item 3's ruled cure cross the persisted-shape gate?** If `{band, condition, label}` is meant to land ON the settlement, that is the same owner-gated class as item 4 and the brief treats the two items differently. One command settles the premise I acted on: `grep -n "export function bandFor" src/domain/state/bands.js` — it is the 0-100 SystemState ladder, not a label vocabulary.
2. ⛔⛔ **The 174/360 live defect.** `SummaryTab:213` renders a full phrase, not a band, on 48% of driven settlements TODAY. Six of `deriveEconomicComplexity`'s eleven labels have no band word. **The six words are a chair act** and they are the same act as item 8 and as §0c-3.
3. ⛔⛔ **Item 8 is BLOCKED on an ancestry fact, not on effort.** `git merge-base --is-ancestor 333b1a83c 5e28d5c83` exits **1**. DESK-ECON2's `COMPLEXITY_NOUN` / `SLOT_FILL_TABLES` / annex §0c-3 edits are on an unmerged line, and item 8's cure rewrites the same two surfaces. Land or replay DESK-ECON2 first, or the two cars conflict by construction.
4. ⛔ **`bareCommonFill` screens the FIRST CHARACTER ONLY.** A mechanically-lowercased `{chain}` label passes the shape contract and still renders *"the fishing & Seafood keeps more hands busy"*. 83 of 301 strings are in that state. If any lane is told to "draft them mechanically", this is the trap.
5. ⚠ **Item 4's exposure is 102/360, not 22/360.** The 22 in PROSE-REBASE's finding is the figure for THAT cure's two producers, not the field's exposure. 19 of the 22 safety labels the generator emits carry an em-dashed gloss.
6. ⚠ **The fingerprint is WRITE-ONLY across the save boundary today.** All three `assertPowerEconomyFreshness` call sites are in-pipeline; `regenSection` has only `npcs` and `history` branches. The throw is latent, not live — and the first load-time freshness check makes it live.
7. ⚠ **J3's latent producer bug**: `safetyProfile.js:218` appends the wrong condition when a composite's non-first member is the two-dash plague label. Unreached on 360/360.
8. ⛔ **THE TWO REGISTER ACTS ARE YOURS**, predicted in writing before any instrument ran (§ "REGISTER PREDICTIONS" in this receipt): lighting census `files +1 · credited +1 · titles +4 · suiteTitles +1`; test ratchet `totalTests +4 · totalFiles UNCHANGED`. ⚠ The baselines I add to are lane DOCKET's figures at ITS tip, not re-measured at mine.

## RECEIPTS BY PATH
| what | path |
|---|---|
| this receipt | `$SC/receipt-docket-2.md` |
| item 4 fingerprint census (ARMs A–D, the throw) | `$SC/docket2work/fp-census.mjs` / `.out` |
| item 3 consumer-render census (the 174/360) | `$SC/docket2work/consumer-render.mjs` / `.out` |
| item 3 equivalence + string-level plant | `$SC/docket2work/band-equiv.mjs` / `.out` |
| item 3 walker arms replayed in node | `$SC/docket2work/arm-replay.mjs` / `.out` |
| item 3 TREE PLANT (before/after drives) | `$SC/docket2work/stability-drive.mjs`, `before.json`, `after.json` |
| item 3 plant backup (cmp reference) | `$SC/docket2work/BACKUP-governanceNarrative.js` |
| item 8 casing census | `$SC/docket2work/casing-census.mjs` / `.out` |
| item 8 mechanical-draft trap | `$SC/docket2work/casing-trap.mjs` / `.out` |
| item 8 export-posture exhaustion | `$SC/docket2work/posture-exhaust.mjs` / `.out` |
| eslint (exit 0, empty) | `$SC/docket2work/eslint-item3.log` |
| commit message | `$SC/docket2work/msg-item3.txt` |
| pre-edit backups | `$SC/docket2work/BACKUP-SummaryTab.jsx`, `BACKUP-OverviewTab.jsx`, `BACKUP-vocabularyTotality.walker.test.js` |

## PRIORITY
**HIGH** — items 2 and 3 above (the six complexity band words and the DESK-ECON2 ancestry block are
what unblock both item 3's remainder and item 8), J1, and the two register acts.
**MEDIUM** — 4 (the `bareCommonFill` trap, before any lane is told to draft mechanically), 5, 6.
**LOW** — 7, J4.

---

## DOCK FINAL STATE (verified in-shell)
```
HEAD      a6f01d757   (base 5e28d5c83, ONE car)
porcelain 0
node_modules  453 symlinks · 0 real package dirs — never materialised
eslint    exit 0 over all four touched files
diff      4 files changed, 260 insertions(+), 3 deletions(-)
```
⚠ **THE CAR EXISTS ONLY AS THIS DOCK'S HEAD.** The preamble forbids a lane writing refs, so
`a6f01d757` is one `git worktree prune` from gone. Sealing it is the chair's act and it is cheap.

⏱ **VITEST: NOTHING RUN, NOTHING CLAIMED.** The hold was in force for the whole dispatch
(`LANE-QUEUE.md:23`, `RESUME-NOTE.md:6` — RESUME had not been sent to DOCKET-2 `a408a26893a999535`
when this receipt was written). Every proof above is `node`/`eslint`/`esbuild`/`git` with its exit
captured in-shell. The five owed commands are listed under item 3.
