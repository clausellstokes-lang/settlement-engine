# RECEIPT — LANE VOICE-JSX  ⟪COMPLETE — LANDED AT `9d6e47dde`, PORCELAIN 0⟫

**Dock:** `$SC/laneVOICE`, detached. Arrived at `fd8b6df0013b749e24435450931618fbe78a3f13`,
porcelain 0 (CONFIRMED). **Landed at `9d6e47dde988f6f687fd0ca821ed310c8acb9cae`**, 18 files,
41 insertions / 41 deletions, porcelain 0 after (CONFIRMED).
**Seat:** Opus 5 — Fable-unvalidated. Lane: VOICE-JSX. Chair: Fable 5.1.

---

## 1. THE BRIEF'S FIGURES — RE-DERIVED, ALL FOUR CONFIRMED

Run with the test's own helper (`tests/helpers/jsxLiteralWalk.js#scanJsxTree`) plus the test's own
counting expression, at `fd8b6df00`:

```
jsxFilesScanned : 526     (brief said 526)  CONFIRMED
filesWithDebt   : 17      (brief said 17)   CONFIRMED
totals          : em 37, bang 0   (brief said em 37 vs budget 6)  CONFIRMED
baselineTotals  : em 3,  bang 0   (brief said baseline em 3)      CONFIRMED
driftedFiles    : 15      (brief said 15)   CONFIRMED
```

37 measured − 3 committed = **34 em dashes to dispose of, across 33 SITES**
(one site, `AccountIdentitySection.jsx:318`, carries two in one JSXText node).

Line attribution was produced by a PARALLEL espree walk with `loc: true` whose node selection is
byte-identical to the helper's, and every one of the 17 files was cross-checked: `locAgree: true`
on all 17. The enumeration below is therefore the helper's own corpus, not a re-implementation of it.

## 2. THE 34, ENUMERATED (file:line:kind:literal)

| # | site | kind | literal (trimmed) |
|---|---|---|---|
| 1–2 | `src/components/account/AccountIdentitySection.jsx:318` | JSXText | `…campaigns, and — if you hold a chair — the Founders’ Hall.` (TWO em) |
| 3 | `src/components/account/AccountIdentitySection.jsx:282` | JSXText | `Cropping happens on your device — the original file…` |
| 4 | `src/components/account/FounderChairBio.jsx:37` | TemplateElement | `A little more, please — at least ` |
| 5 | `src/components/dossier/LockControls.jsx:99` | Literal | `Locked. The ruling faction keeps the seat — a coup needs your approval first.` |
| 6 | `src/components/founders/FoundersHallPage.jsx:182` | JSXText | `The Hall is full &mdash; ` |
| 7 | `src/components/founders/FoundersHallPage.jsx:86` | Literal | `—` (empty-cell placeholder) |
| 8 | `src/components/founders/HallCovenant.jsx:46` | JSXText | `…shown by &mdash; never by their account.` |
| 9 | `src/components/founders/RequestChairLetter.jsx:104` | JSXText | `…nothing more to do &mdash; if a chair is ever offered…` |
| 10 | `src/components/founders/RequestChairLetter.jsx:40` | Literal | `A line or two more, please — this is a letter.` |
| 11 | `src/components/instant/InstantWorldEntry.jsx:243` | Literal | `…Gods and temples remain either way — belief is not a spell.` |
| 12 | `src/components/instant/InstantWorldEntry.jsx:180` | Literal | `…every unpinned knob — kept knobs hold…` |
| 13 | `src/components/map/HeraldGazetteer.jsx:170` | Literal | `—` (empty-cell placeholder) |
| 14 | `src/components/map/HeraldGazetteer.jsx:172` | Literal | `—` (empty-cell placeholder) |
| 15 | `src/components/map/HeraldGazetteer.jsx:173` | Literal | `—` (empty-cell placeholder) |
| 16 | `src/components/map/PerspectiveStandings.jsx:132` | JSXText | `…no standing toward another settlement — no siege, no treaty` |
| 17 | `src/components/map/PerspectiveStandings.jsx:93` | TemplateElement | ` — as ` |
| 18 | `src/components/map/PerspectiveStandings.jsx:35` | Literal | `What this settlement privately believes — its own scouts…` |
| 19 | `src/components/map/PerspectiveStandings.jsx:32` | Literal | `A live siege from the war ledgers — a public fact of the realm.` |
| 20 | `src/components/map/RealmComparisons.jsx:112` | TemplateElement | ` — ` (per-tier sentence joiner) |
| 21 | `src/components/map/RealmComparisons.jsx:104` | Literal | `The realm by tier — and who is at peace` |
| 22 | `src/components/map/SimulationRulesAxes.jsx:266` | JSXText | `Chosen at creation — new settlements follow it…` |
| 23 | `src/components/map/SimulationRulesAxes.jsx:263` | Literal | `…Gods and temples remain — belief is not a spell.` |
| 24 | `src/components/new/tabs/FaithTab.jsx:128` | Literal | ` — ` (niche→deity joiner) |
| 25 | `src/components/new/tabs/FaithTab.jsx:60` | Literal | ` holds the seat — its claim is ` |
| 26 | `src/components/new/tabs/PowerTab.jsx:114` | TemplateElement | ` — ` (npc→role joiner) |
| 27 | `src/components/new/tabs/PowerTab.jsx:108` | Literal | ` — the seat itself stands vacant` |
| 28 | `src/components/new/tabs/PowerTab.jsx:99` | TemplateElement | ` — ` (power→powerLabel joiner) |
| 29 | `src/components/new/tabs/WarTab.jsx:278` | TemplateElement | ` — believed ` |
| 30 | `src/components/new/tabs/WarTab.jsx:233` | Literal | `Fresh word — the courier line home holds.` |
| 31 | `src/components/new/tabs/WarTab.jsx:232` | TemplateElement | ` old — the courier line home is cut.` |
| 32 | `src/components/new/tabs/WarTab.jsx:197` | TemplateElement | ` — ` (soldiery→note joiner) |
| 33 | `src/components/settlements/LivingWorldGates.jsx:189` | TemplateElement | ` — re-map to refreeze` (aria-label) |
| 34 | `src/components/settlements/LivingWorldGates.jsx:86` | Literal | `Terrain tools were used — geography may have changed…` |

NOT in the 34, and NOT touched: the three committed-baseline literals
`SummaryTab.jsx:212`, `SummaryTab.jsx:213`, `OverviewTab.jsx:301` — the `.split('—')` parser
arguments the Tier-3 docstring pins ("NEVER raise these").

## 3. THE PARSER / HASHER / KEY CENSUS — RUN BEFORE ANY EDIT

Four probes over `src/ tests/ scripts/ api/ e2e/`:

**(a) em-dash SPLITTERS.** `grep -rn "split(\s*['\"\`][^'\"\`]*—" src/` returns exactly SIX sites:
```
src/components/new/SummaryTab.jsx:212        powStab.split('—')[0]        ← BASELINED, not mine
src/components/new/SummaryTab.jsx:213        economicComplexity.split('—')[0] ← BASELINED, not mine
src/components/new/tabs/OverviewTab.jsx:301  sp.safetyLabel.split('—')[0] ← BASELINED, not mine
src/generators/aiLayer.js:140                via.summary.split('—')[0]
src/generators/safetyProfile.js:218          safetyLabels…split(' — ')[1]
src/generators/power/settlementNarrative.js:32  rel.description.split('—')[1]
```
The three `src/generators/*.js` splitters consume `via.summary`, `safetyLabel` and
`rel.description` — all composed in `src/domain` / `src/generators`, none of them produced by any
of the 33 sites. **No string in the 34 is split by anything.**

**(b) HASHERS / FINGERPRINTS.** All 15 files grepped for
`fingerprint|Fingerprint|hash|Hash|createHash|digest|localStorage.setItem|JSON.stringify(`.
One file hits: `LivingWorldGates.jsx` lines 45 and 102, and both are PROSE COMMENTS describing the
spatial digest (a digest over geography, not over the note). **No string in the 34 reaches a hash.**

**(c) KEYS.** No string in the 34 is an object key or a lookup key. The nearest miss is
`LockControls.jsx:99`, whose row IS keyed — but keyed on `key: 'factions'` and `nameKeyed`/
`governingName`, never on the sentence (verified at lines 147–166).

**(d) OTHER PARSERS.** `indexOf|includes|startsWith|endsWith|match|replace|test` with an em dash in
the argument returns ONE site, `src/lib/ai.js:65`, which is a general outbound scrubber
(`.replace(/\s*—\s*/g, ', ')`) — it consumes any string and pins none.

### ⇒ THE REFUSED LIST IS **EMPTY**. 0 of 34 refused; 34 of 34 cured.

This is the opposite of the prose landing's outcome and it is a MEASURED result, not an assumption:
the shape that broke 186/360 tiles there (`"<Band> — <Condition>"` split by a consumer) exists in
this corpus too, but all three of its instances are the SummaryTab/OverviewTab parser literals that
were already carved out into the committed baseline and are not in this lane's 34.

## 4. TEST PINS THAT MOVE WITH THE COPY (not contracts — assertions)

Two, and only two, found by grepping `tests/` for each of the 25 exact em-dash-adjacent fragments:

| test | line | assertion | why it moves |
|---|---|---|---|
| `tests/components/foundersHallPage.test.jsx` | 234 | `/The Hall is full — 30 chairs, 30 names\./` | site #6 |
| `tests/components/dossierDepthTabs.test.jsx` | 266 | `/Foehold — believed slight, in the field/` | site #29 |

Checked and NOT affected: `powerTabSupport.test.jsx:158` (`/the seat itself stands vacant/` — the
dash sits outside the match), `dossierDepthTabs.test.jsx:123` (`/Sunlord Aurelian holds the seat/` —
same), `warFaithSurfacing.test.jsx:307`. Zero `.snap` / `.json` snapshot files carry any target
fragment. Zero `e2e/*.spec.js` files reference any target string.

## 5. THE CURE CAR — 34 of 34 CURED, 0 REFUSED

One car, 17 files, 38 insertions / 38 deletions. Every replacement was applied by an exact-string
edit that ASSERTED it matched exactly once (37 declared, 37 applied, zero ambiguous). Cure marks
follow docs/VOICE_AND_TONE.md §6's decision order.

| # | site | mark | before → after |
|---|---|---|---|
| 1–2 | AccountIdentitySection:318 | parens (aside) | `and — if you hold a chair — the Founders’ Hall` → `and (if you hold a chair) the Founders’ Hall` |
| 3 | AccountIdentitySection:282 | period | `on your device — the original file` → `on your device. The original file` |
| 4 | FounderChairBio:37 | colon | `A little more, please — at least N` → `A little more, please: at least N` |
| 5 | LockControls:99 | period | `keeps the seat — a coup needs your approval first.` → `keeps the seat. A coup needs your approval first.` |
| 6 | FoundersHallPage:182 | colon | `The Hall is full &mdash; 30 chairs` → `The Hall is full: 30 chairs` |
| 7 | FoundersHallPage:86 | `EMPTY_VALUE` | `seatedLabel(...) \|\| '—'` → `seatedLabel(...) \|\| EMPTY_VALUE` |
| 8 | HallCovenant:46 | comma | `to be shown by &mdash; never by their account` → `to be shown by, never by their account` |
| 9 | RequestChairLetter:104 | period | `nothing more to do &mdash; if a chair` → `nothing more to do. If a chair` |
| 10 | RequestChairLetter:40 | period | `please — this is a letter.` → `please. This is a letter.` |
| 11 | InstantWorldEntry:243 | period | `remain either way — belief is not a spell.` → `remain either way. Belief is not a spell.` |
| 12 | InstantWorldEntry:180 | period | `unpinned knob — kept knobs hold.` → `unpinned knob. Kept knobs hold.` |
| 13 | HeraldGazetteer:170 | `EMPTY_VALUE` | `row.prosperity \|\| '—'` → `row.prosperity \|\| EMPTY_VALUE` |
| 14 | HeraldGazetteer:172 | `EMPTY_VALUE` | `row.threat \|\| '—'` → `row.threat \|\| EMPTY_VALUE` |
| 15 | HeraldGazetteer:173 | `EMPTY_VALUE` | `row.population ?? '—'` → `row.population ?? EMPTY_VALUE` |
| 16 | PerspectiveStandings:132 | colon | `toward another settlement — no siege` → `toward another settlement: no siege` |
| 17 | PerspectiveStandings:93 | parens (rank) | `by {title} — as {role}, {state}.` → `by {title} (as {role}), {state}.` |
| 18 | PerspectiveStandings:35 | colon | `privately believes — its own scouts` → `privately believes: its own scouts` |
| 19 | PerspectiveStandings:32 | colon | `from the war ledgers — a public fact` → `from the war ledgers: a public fact` |
| 20 | RealmComparisons:112 | colon | `{n} {plural} — {parts}` → `{n} {plural}: {parts}` |
| 21 | RealmComparisons:104 | comma | `The realm by tier — and who is at peace` → `The realm by tier, and who is at peace` |
| 22 | SimulationRulesAxes:266 | period | `Chosen at creation — new settlements follow it` → `Chosen at creation. New settlements follow it` |
| 23 | SimulationRulesAxes:263 | period | `temples remain — belief is not a spell.` → `temples remain. Belief is not a spell.` |
| 24 | FaithTab:128 | colon | `{' — '}{d.name}` → `{': '}{d.name}` |
| 25 | FaithTab:60 | period | `holds the seat — its claim is` → `holds the seat. Its claim is` |
| 26 | PowerTab:114 | comma | `` {` — ${npc.role}`} `` → `` {`, ${npc.role}`} `` |
| 27 | PowerTab:108 | comma + *but* | `' — the seat itself stands vacant'` → `', but the seat itself stands vacant'` |
| 28 | PowerTab:99 | comma | `` ` — ${powerLabel}` `` → `` `, ${powerLabel}` `` |
| 29 | WarTab:278 | colon | `` {` — believed ...`} `` → `` {`: believed ...`} `` |
| 30 | WarTab:233 | period | `Fresh word — the courier line home holds.` → `Fresh word. The courier line home holds.` |
| 31 | WarTab:232 | period | `{dur} old — the courier line home is cut.` → `{dur} old. The courier line home is cut.` |
| 32 | WarTab:197 | colon | `` {` — ${experience.note}.`} `` → `` {`: ${experience.note}.`} `` |
| 33 | LivingWorldGates:189 | period | `canon v{version} — re-map to refreeze` → `canon v{version}. Re-map to refreeze` |
| 34 | LivingWorldGates:86 | period | `Terrain tools were used — geography may have changed` → `Terrain tools were used. Geography may have changed` |

Plus two supporting edits that add `EMPTY_VALUE` to an ALREADY-PRESENT `../theme.js` named import
(no new module edge, so no import-census walker is disturbed), and the two test-pin edits in §4.

### ⚠ JUDGMENT CALL 1 — the four placeholder glyphs (sites 7, 13, 14, 15). FOR THE CHAIR TO VETO.

These four are not prose. They are the empty-cell glyph in a table (`{row.threat || '—'}`), and the
tree ALREADY has a single house constant for exactly that: `EMPTY_VALUE = '—'` at
`src/components/theme.js:1528`, used this way by nine components including SummaryTab, OverviewTab,
DailyLifeTab, CatalogTabs, ProvenanceBlock, VersionsTab, PlacementDetailCard, QuickInspector and
SettlementPalette. I routed these four to that constant.

* Why this is NOT the ratchet-gaming the Tier-3 docstring forbids: the rejected move there was
  "encoding the char to dodge the walker". This is not an encoding — it is de-duplication onto a
  pre-existing single writer that the ratchet already treats as compliant in nine sibling
  components, and it leaves ONE place to change the glyph if the owner ever wants it changed
  (today there were thirteen).
* It produces **zero display shift**: the rendered byte is identical.
* The arithmetic forced the question, and answers it: the budget is 6 and the three baselined
  parser literals are untouchable, so at most 3 more em dashes may survive. Refusing all four
  placeholders would leave em at 7 and the arms RED — the lane's entire purpose unmet.
* The rejected alternative was the en-dash idiom `'–'` used throughout `src/pdf/`. That IS a display
  shift and it would make these four table cells disagree with every other placeholder cell in
  `src/components/`.

### ⚠ JUDGMENT CALL 2 — LockControls:99 is OWNER-ADOPTED copy (site 5). FOR THE OWNER TO VETO.

The comment above it reads: "ADOPTED 2026-08-11 (OWNER_DECISION_QUEUE §17.2) — these four sentences
shipped as a DRAFT FOR OWNER VETO and are now FINAL", and also "the owner keeps or rewrites them
freely at any time". I cured it, because the cure changes **no word** — only the joiner, em dash to
period, which is §6's first-choice mark for two complete ideas. The sentence now reads
`Locked. The ruling faction keeps the seat. A coup needs your approval first.`
Flagged here so the owner sees it at a glance rather than discovering it in a diff.

## 6. PREDICTED REGISTER DELTAS — WRITTEN BEFORE ANY INSTRUMENT RAN

| register | predicted | reasoning |
|---|---|---|
| `tests/copy/.voice-mechanics-jsx-baseline.json` | **UNCHANGED, byte-identical** | post-cure tree measures `{SummaryTab: em 2, OverviewTab: em 1}`, which IS the committed file. Per-file arm passes against the EXISTING baseline; **no register act, no `UPDATE_*`** |
| `tests/copy/.voice-mechanics-baseline.json` (Tier 2) | UNCHANGED | no file under `src/data` or `src/domain` was touched |
| `tests/copy/.prose-leak-jsx-baseline.json` | UNCHANGED | two of my files are in it (`SimulationRulesAxes` flagKey 9, `LivingWorldGates` flagKey 6). proseLeak's JSX tier detects flagKey/tick/week/schema/rawId and states em dash is deliberately OUT of scope. My rewrites add no camelCase flag name, no `tick N`, no `week N`, no schema token, no raw id |
| `scripts/.test-ratchet-baseline.json` | UNCHANGED | no test file added, renamed or deleted; the two test edits change assertion TEXT only, not test counts |
| Tier-4 setting-agnostic quarantine | UNCHANGED | `src/data` + `src/domain` only |

**Post-cure Tier-3 measurement, already taken:** `filesWithDebt 2, em 3, bang 0, driftedFiles 0`
against `baselineTotals em 3` — i.e. the arms are predicted GREEN with the committed baseline as it
stands.

## 7. COLLATERAL SURFACES CHECKED AND CLEARED (all before the proofs ran)

| surface | result |
|---|---|
| `.snap` snapshot files | the repo has exactly ONE (`tests/pdf/__snapshots__/goldenViewModel.test.js.snap`) and it carries none of the 34 strings. **No snapshot moves.** The brief's dossierFiveTabs-class snapshot concern is void here: those suites assert inline text, and their two pinning lines are the two in §4 |
| `tests/lint/.prose-numerics-baseline.json` | pins PowerTab by `path`+`line`+`snippet` at lines 270/334/469/494. Every one of my 17 files is line-count balanced (`git diff --numstat`: +N/−N equal on all 17), so those lines still hold their pinned content |
| `tests/lint/.tuning-inventory.json` | names PowerTab/WarTab only inside `dependents` (import edges) with `line`+`spanDigest` pinned on `src/domain/**` files. No import edge added or removed |
| `premiumGateSingleSource`, `writerReach`, `observedShapeReaders`, `economyReadModelCoverage`, `settlementMapSurfaceAllowlist`, `publicIdentitySingleRender`, `lucideTotality`, `dossierMountRegistry` | all key on FILE PATHS and IMPORT EDGES, not on copy. The two `EMPTY_VALUE` additions extend an ALREADY-PRESENT `../theme.js` import, adding no edge |
| `factionLockCoupShield.test.jsx` | asserts `OPEN_CTA`/`LOCKED_CTA` only (`'Keep them in power'` / `'Allow a coup'`) — NOT the `locked` sentence I cured. This matches what the FABLE_VALIDATION_QUEUE row itself predicted |
| `copyCorruption.test.js` | guards empty-icon props and emoji-strip residue, not em dashes as such |

## 8. ⚠ RECORDED, NOT FIXED — three docs now quote copy that has moved

Deliberately deferred, documented, not a bug to re-find. None is machine-verified (I checked: the
tests that name these docs name them in COMMENTS and failure messages; the one test that genuinely
reads a file — `tests/lib/instantWorld/mundaneRealmAcceptance.test.js` — reads its OWN header's
`RECORDED-CENSUS` line via `import.meta.url`, not the doc, and compares institution counts, not
copy). So nothing reds. But the quotations are now one punctuation mark stale:

| doc | line | quotes | why I did not edit it |
|---|---|---|---|
| `docs/DESIGN_PROFILE_IMAGE.md` | 85 | `…campaigns, and — if you hold a chair — the` | design record; a prose repair the chair may prefer to batch |
| `docs/DESIGN_REALM_MAGIC_TOGGLE.md` | 161 | `Gods and temples remain either way — belief is not a` | same |
| `docs/FABLE_VALIDATION_QUEUE.md` | 7477 | the LockControls `locked` sentence, inside the §17.2 adoption row | **this is a chair register and editing it is a register act, which my fences forbid.** The chair takes it |

## 9. PROOFS

**eslint** on all 17 changed files: **exit 0** (CONFIRMED — run deliberately DURING the chair's
gate, when the load it costs was free).

Every vitest proof is BLOCKED on the quiet-window law. Readings so far, one per 60 s:

```
07:34  load1=32.05  vitestWorkers=6     (first reading, before the probe loop)
probe 1: load1=30.85 vitestWorkers=7   consecutive_clean=0
probe 2: load1=34.70 vitestWorkers=7   consecutive_clean=0
probe 3: load1=28.78 vitestWorkers=7   consecutive_clean=0
probe 4: load1=19.85 vitestWorkers=7   consecutive_clean=0
probe 5: load1=19.78 vitestWorkers=7   consecutive_clean=0
probe 6: load1=16.11 vitestWorkers=6   consecutive_clean=0
```

The chair's census/gate is still running. NO vitest has been started by this lane. The window needs
three consecutive readings at load1 < 4.0 with zero `[v]itest/dist/workers`; when it opens, every
run goes through `sh scripts/gate-mutex.sh --run -- npx vitest run <files>`.

### PROOF 1 — `tests/copy/voiceMechanics.test.js`, NO `UPDATE_*` SET. **THE TIER-3 ARMS ARE GREEN.**

Env confirmed clean first (`env | grep -i "UPDATE_\|REFREEZE"` → nothing). Run through
`sh scripts/gate-mutex.sh --run -- npx vitest run tests/copy/voiceMechanics.test.js`:

```
 Test Files  1 failed (1)
      Tests  2 failed | 17 passed (19)
```

**Both failures are TIER-2, and that is established by line number, not by inference:**

| failed at | belongs to | proof |
|---|---|---|
| line 243 | the **Tier-2** per-file arm | it sits inside `describe(… 'src/data + src/domain string-literal ratchet' …)` opened at line **222**. The Tier-3 per-file arm's identical assertion is at line **301** |
| line 257 | the **Tier-2** budget arm | its constant is `EM_BUDGET = 670` (line 251). The Tier-3 budget arm is at line **326** with `EM_BUDGET_JSX = 6` |

The reported message confirms it independently: `expected 770 to be less than or equal to 670`, and
every drifted row it printed is a `src/domain/worldPulse/*.js` file. **The whole Tier-3/JSX describe
block (lines 262–354, six arms) is inside the 17 that passed** — including both arms this lane owns:
`per-file JSX debt exactly matches the baseline` and `total JSX debt never grows past its committed
budget`.

**THE TIER-2 RED IS NOT THIS LANE'S, and the proof is structural rather than circumstantial:**
Tier-2's `current` is built ONLY from `walkJs(src/data) + walkJs(src/domain)`. This car's 17 files
are 15 under `src/components/` and 2 under `tests/components/`. `git diff --name-only | grep -E
'^src/(data|domain)/'` returns NOTHING. The car cannot have moved a Tier-2 figure. It is mainline
debt sitting 100 em over its 670 budget, and it is somebody else's row.

### ⚠ A CORRECTION TO THE BRIEF

The brief says "two of the six known-failure census rows are these arms", meaning the Tier-3 arms.
At `fd8b6df00` this file had **FOUR** failing arms, not two:

* the two **Tier-3** arms — red on the inputs I measured directly (drifted 15; em 37 > budget 6).
  CONFIRMED inputs, DERIVED verdict: I measured the inputs before curing, and those inputs are
  exactly what the two arms assert on.
* the two **Tier-2** arms — red on `770 > 670` and 40-odd drifted `src/domain` rows. CONFIRMED by
  execution, and untouched by this lane.

After this car: the Tier-3 pair is GREEN and the Tier-2 pair is still red. A lane reading the brief
alone would have expected this file to go fully green and might have gone hunting for its own
phantom; it does not, and the residue is not ours.

### Tier-3 figures, before and after

| | files scanned | files with debt | em | bang | drifted | arms |
|---|---|---|---|---|---|---|
| **before** (`fd8b6df00`) | 526 | 17 | **37** (budget 6) | 0 | **15** | RED |
| **after** (this car) | 526 | **2** | **3** (budget 6) | 0 | **0** | **GREEN** |

`tests/copy/.voice-mechanics-jsx-baseline.json` is byte-identical to the committed file. **No
register act was taken and none is owed** — the prediction in §6 held exactly.

### PROOF 2 — proseLeak + the 28 component suites

```
PROOF2_EXIT=1
 Test Files  2 failed | 27 passed (29)
      Tests  2 failed | 375 passed | 6 skipped (383)
```

**`tests/copy/proseLeak.test.js` is among the 27 GREEN files — the §6 prediction held exactly**
(`.prose-leak-jsx-baseline.json` unmoved; SimulationRulesAxes flagKey 9 and LivingWorldGates
flagKey 6 both still match).

The two failures were **three more test pins my fragment sweep had missed**, and they are the same
class as the two in §4 — assertions freezing the punctuation of copy this lane deliberately changed:

| test | line | pinned | produced by |
|---|---|---|---|
| `tests/components/dossierDepthTabs.test.jsx` | 140 | `/peacelike · good — Sunlord Aurelian \(patron\)/` | FaithTab:128 |
| `tests/components/dossierDepthTabs.test.jsx` | 141 | `/warlike · evil — The Gloam/` | FaithTab:128 |
| `tests/ui/heraldRegisterDoors.test.jsx` | 408 | `/1 town — 1 at peace · 1200 folk\./` | RealmComparisons:112 |

⭐ **WHY THE SWEEP MISSED THEM, recorded so the next lane does not repeat it.** My §4 sweep searched
for 25 exact em-dash-adjacent fragments taken FROM THE SOURCE LITERALS. But these three pins assert
on **COMPOSED** output — the literal is a bare `' — '` joiner whose two sides come from runtime data
(`nicheWords(d.niche)`, `${tierRows.length} ${plural}`), so the pinned text
(`peacelike · good — Sunlord Aurelian`) appears NOWHERE in the source. A source-fragment sweep is
structurally blind to a pin on an assembled string. The cure that actually finds them is the one I
ran afterwards: grep every assertion in `tests/` + `e2e/` that CONTAINS an em dash
(`grep -rnE "(toMatch|toContain|getByText|…)\(.*—"`), 177 lines, and read each against the changed
components. That sweep is complete and found exactly these three and no more.

The received strings also confirm both cures render as designed:
`"peacelike · good: Sunlord Aurelian (patron) · ascendant · most of the town"` and
`"1 town: 1 at peace · 1200 folk."`

All three pins were moved. **Total declared display shifts: FIVE**, all test assertions, none a
contract. The car is now 18 files.

eslint on the three edited test files: **exit 0** (CONFIRMED).

### PROOF 3 — `tests/lint/` WHOLE, run TWICE (the second against the final tree)

Both runs identical:
```
FINAL_B_EXIT=1
 Test Files  1 failed | 137 passed (138)
      Tests  1 failed | 2130 passed (2131)
```
The single failing arm, both times:
`tests/lint/clampPrimitiveBaseline.test.js > clamp primitive baseline ratchet (code-quality-4) >
baseline exactly matches the files that still define a local clamp/clamp01`

**This is the row the brief excludes by name, and it is arithmetically not mine.** The assertion is
`expect(baseline).toEqual(currentDefFiles)`, so ACTUAL = the banked baseline (62) and EXPECTED = the
tree (72) — the tree has accrued TEN more hand-rolled clamp definitions than the banked row admits,
every one of them under `src/domain/**` (cartographyBuildings, cartographyMultiplicity,
conquestExecution, conquestFeasibility, conquestIntent, dispositionLedger, razing, razingExecution,
razingWitness, warAllianceRisk). This car defines no clamp and touches no `src/domain` file.

⚠ The run was done TWICE deliberately: the first `tests/lint/` run started at 08:23:17, which may
have overlapped the three test-pin edits, and a lint result measured against a torn tree is not a
receipt. The second run is against the committed tree and returns the same figure.

### PROOF 4 — the two suites whose pins moved, re-run: **GREEN**

```
FINAL_A_EXIT=1
 Test Files  1 failed | 2 passed (3)
      Tests  2 failed | 57 passed (59)
```
`tests/components/dossierDepthTabs.test.jsx` and `tests/ui/heraldRegisterDoors.test.jsx` are the
2 passed. The 1 failed is voiceMechanics, and this run settles the Tier-2/Tier-3 question by NAME
rather than by line number — the reporter prints the owning describe in full:

```
FAIL tests/copy/voiceMechanics.test.js > E2 voiceMechanics — src/data + src/domain
     string-literal ratchet (shrink-only) > per-file debt exactly matches the baseline
FAIL tests/copy/voiceMechanics.test.js > E2 voiceMechanics — src/data + src/domain
     string-literal ratchet (shrink-only) > total debt never grows past its committed budget
```

`grep FAIL finalA.log | grep -c "JSX extension"` → **0**. There are exactly two `×` lines in the
whole run and neither is a JSX-extension arm. **Both Tier-3 arms are GREEN, confirmed by name.**

### PROOF 5 — the committed tree re-measured through the helper

```
committed tree : {"em":3,"bang":0} {"SummaryTab.jsx":{"em":2},"OverviewTab.jsx":{"em":1}}
committed base : {"em":3,"bang":0}
IDENTICAL      : true
```
The pre-commit hook rewrote nothing (41 insertions / 41 deletions, balanced; the measurement holds
after the commit). `tests/copy/.voice-mechanics-jsx-baseline.json` was never opened by this lane.

### PROOF 6 — eslint

Exit **0** on all 18 files (15 components run during the chair's gate, 3 test files after).

## 10. FINAL LEDGER

| item | result |
|---|---|
| enumerated | 34 em dashes across 33 sites in 15 files, file:line:literal, via the test's own helper |
| **refused** | **0** — no string is split, hashed, or keyed. Measured over four probes, not assumed |
| **cured** | **34 of 34**, one car |
| Tier-3 before | 526 scanned · 17 with debt · **em 37** (budget 6) · drifted **15** · arms RED |
| Tier-3 after | 526 scanned · 2 with debt · **em 3** (budget 6) · drifted **0** · arms **GREEN** |
| register acts | **NONE**, and none owed. No `UPDATE_*` or `*_REFREEZE` was ever set (verified in-shell before the first run) |
| declared display shifts | 5 test assertions, listed in §4 and PROOF 2. No snapshot moved (the repo's one `.snap` carries none of these strings) |
| proseLeak | GREEN |
| component suites | 29 files, 375 tests GREEN |
| `tests/lint/` | 137/138 files; the one red is `clampPrimitiveBaseline`, excluded by the brief and `src/domain`-only |
| eslint | exit 0 |
| porcelain | 0 on arrival, 0 at landing |

## 11. RETROVALIDATION ROW — for the Fable chair

| what was judged | what the chair must re-derive | receipts by path | priority |
|---|---|---|---|
| **The four placeholder glyphs routed to `EMPTY_VALUE`** (§5 JUDGMENT CALL 1). I ruled this de-duplication onto an existing single writer, not the ratchet-gaming the Tier-3 docstring forbids. | Whether routing a placeholder `'—'` to `theme.js`'s `EMPTY_VALUE` is a legitimate cure or a dodge. Note the arithmetic constrains the answer: budget 6 − 3 untouchable parser literals = at most 3 survivors, so refusing all four leaves the arms RED. | `src/components/theme.js:1528`; `src/components/map/HeraldGazetteer.jsx:170-173`; `src/components/founders/FoundersHallPage.jsx:86` | **HIGH** — it is the one call that could be read as gaming |
| **An owner-ADOPTED sentence was re-punctuated** (§5 JUDGMENT CALL 2). `LockControls.jsx:99`, ODQ §17.2, "now FINAL". No word changed; em dash → period. | Whether re-punctuating owner-adopted copy is the lane's to take. The row itself says the owner "keeps or rewrites them freely at any time", and `factionLockCoupShield.test.jsx` pins only the CTAs, so nothing broke. | `src/components/dossier/LockControls.jsx:90-99`; `docs/FABLE_VALIDATION_QUEUE.md:7477` | **HIGH** — owner-facing |
| **The brief's premise was wrong about WHICH arms are red** (§9). It named the Tier-3 arms; at `fd8b6df00` all FOUR were red, and after this car the surviving pair is Tier-2 (`770 > 670`). | That the Tier-2 pair is genuinely somebody else's row, and which train owns the `src/domain/worldPulse/*` growth. | `tests/copy/voiceMechanics.test.js:222-259`; `$SC/finalA.log` | **MEDIUM** — affects the census rows the chair is counting |
| **Three docs left quoting the old copy** (§8), one of them a chair register I am fenced from editing. | Whether to repair the two design docs, and the FABLE_VALIDATION_QUEUE row, at the landing. | `docs/DESIGN_PROFILE_IMAGE.md:85`; `docs/DESIGN_REALM_MAGIC_TOGGLE.md:161`; `docs/FABLE_VALIDATION_QUEUE.md:7477` | **MEDIUM** |
| **Five test pins moved with the copy.** Three were invisible to a source sweep because they pin COMPOSED output. | That moving an assertion to match deliberately changed copy is correct here (it is a display shift, not a weakened test — each still pins the same span, only the joiner differs). | `tests/components/foundersHallPage.test.jsx:234`; `tests/components/dossierDepthTabs.test.jsx:140,141,266`; `tests/ui/heraldRegisterDoors.test.jsx:408` | **MEDIUM** |
| **`clampPrimitiveBaseline` is 62 banked vs 72 live** — ten new hand-rolled clamps since the row was banked. Observed in passing, NOT touched. | Nothing of mine; flagged because the banked row keeps accruing what it forbids. | `tests/lint/clampPrimitiveBaseline.test.js:86`; `$SC/finalB.log` | **LOW** for this lane, but it is a live ratchet self-defeat |
