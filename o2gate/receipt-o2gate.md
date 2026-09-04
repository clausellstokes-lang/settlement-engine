# RECEIPT — lane O2GATE (car 19 of the §891 train) — **COMPLETE**

**STATUS: COMPLETE. Commit `450f7dbb7a3ccaf3f71da24ff8f0b7b54b65f669` on the dock, parent `15c6368a6`, porcelain 0.**

- Seat: Opus 5 (build/verify), dispatched by the Fable 5.1 chair (session d5b9a39f) at §892.
- Dock: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree`
- Dock precondition VERIFIED at arrival:
  - `git rev-parse HEAD` → `15c6368a65eba68b07989e60743ca64053315a93` (exit 0) — matches the briefed `15c6368a6`.
  - `git status --porcelain | wc -l` → `0`.
  - `git rev-parse --abbrev-ref HEAD` → `HEAD` (detached, as expected for a dock).
- Scratch dir created: `.../d5b9a39f-.../scratchpad/o2gate/`.

## Progress log
- [x] Brief read in full.
- [x] Dock precondition proved.
- [x] Finding re-verified at `15c6368a6`.
- [x] `economyStateProse.js` option surface read (audience/public option?) — shape decision.
- [x] Register movement PREDICTED IN WRITING (before any run).
- [x] Edit made.
- [x] Two-direction proof (positive arm + negative control red quoted).
- [x] Walkers measured.
- [x] eslint / typecheck.
- [x] Commit.
- [x] Porcelain 0 after.
- [x] RETROVALIDATION ROW.

---

## 1. THE FINDING RE-VERIFIED AT `15c6368a6` — CONFIRMED, and it is LIVE

Read at the dock tip (not inferred):
- `src/components/OutputContainer.jsx:446` — `const publicDossier = readOnly && !saveId;`
- `src/components/OutputContainer.jsx:703` — `case 'economics':  return <EconomicsTab settlement={s} narrativeNote={null} saveId={saveId} />;` (no public flag)
- `src/components/PublicDossierView.jsx:115` — `<OutputContainer settlement={settlement} readOnly playerView={!shareDm} publicChronicle={chronicle} />` (no `saveId` ⇒ `publicDossier === true`)
- `src/components/new/tabs/EconomicsTab.jsx:319` — the desk is drawn UNCONDITIONALLY.

**Executed proof that sentences really draw** (`o2gate/probe-desk.mjs`, node against the dock's own src, exit 0):

```
--- prosperity='Comfortable' access=road
  headerSentence: "There is nothing striking about Forge Town's condition in either direction: a working road, a working market, a town neither building nor selling off."
--- Comfortable + foodSecurity label 'Secure'
  foodSecSentence: "The town eats. It is not a subject anyone raises unprompted."
```

### A correction to the brief's map of the car (chair, please note)
The brief located the leak at the food line only. **There are TWO sentence mounts, not one**, and both are downstream of the single draw at `:319`:
- `economics.prosperityHeader` (DS-ECO-1) — `dossierMounts.js:122`, `rung: 'sentence'` — renders in `EconomicsGlance.jsx` via `header?.sentence`.
- `economics.foodSecurity` (DS-ECO-9) — `dossierMounts.js:134`, `rung: 'sentence'` — renders in `EconomicsTab.jsx:483`.

`EconomicsGlance.jsx`'s own docblock says "All three positions in this file are GLANCE rungs, so none of them prints a corpus sentence today" — that comment is **STALE**: the file carries four positions and `prosperityHeader` is a `sentence` row in the shipped registry. Gating at the single DRAW covers both; gating at the food line alone would have left the header speaking on the public dossier. **This is why the gate goes at the draw.**

## 2. THE SHAPE CHOSEN, AND WHY

**Chosen: gate the DRAW at the single call site in `EconomicsTab`, with the public condition threaded from the router. Component-side null shape.**

The brief instructed me to prefer an existing `audience`/public option on the desk if one yields the same silence. **It does not, and I checked rather than assumed.** `economyStateProse`'s JSDoc does advertise `{seed?, audience?}`, but in `stateProseKernel.js`:
- `AUDIENCE_DM = 'dm'`, `AUDIENCE_PLAYER = 'player'` (`:118–120`), and `variantIsAudible` (`:159`) only strips variants marked `dm-only`.
- `eligibleVariants` (`:263`) coerces every non-`dm` string to `AUDIENCE_PLAYER`.

So `audience` is a DM/player **covertness** axis. The player audience still speaks every non-covert variant — which is exactly the two sentences quoted above. Using it as a public gate would be a **false gate**: it would look like a control and silence nothing. Adding a third audience is a **kernel** change and a declared STOP condition. So the component-side null shape is the correct and smallest honest shape.

**Verified by reading that the null shape removes ONLY corpus sentences.** `EconomicsGlance` consults the rungs *solely* through `header?.sentence` and `drawn?.sentence`; the rungs' `label`/`detail` payload is never rendered. Header prose (`eco.situationDesc`), complexity, trade label, Output score, and every tile datum come from `eco`/`fb`/`granary`/`treasury`, not from the desk. `drawnAtMount` returns `null` when `!rung`, so an all-null shape yields no sentence at any of the five mounts and touches nothing else.

## 3. ⛔ THE LINE-NEUTRALITY CONSTRAINT (measured, and it drives the whole edit)

Measured with eslint's OWN Linter, the same engine `tests/lint/sizeBaseline.test.js` uses:

```
580 src/components/new/tabs/EconomicsTab.jsx
600 src/components/OutputContainer.jsx
```

- `src/components/**/*.jsx` layer ceiling is **600** effective (`eslint.config.js:667`). **`OutputContainer.jsx` sits EXACTLY on it — ZERO headroom.** One effective line reds eslint AND `sizeBaseline.test.js`. Neither file is in `scripts/.size-baseline.json`, which is consistent (600 is not > 600) and must stay so.
- `EconomicsTab.jsx`'s in-file comment claiming it "sits EXACTLY on its frozen 600-line ceiling" is **STALE** — it is 580 since the `EconomicsGlance` extraction.
- `tests/lint/.prose-numerics-baseline.json` freezes debt by **exact path AND line AND snippet** (its own note: "a cure three hundred lines away" re-addresses rows). EconomicsTab owns rows at lines 190…643; OutputContainer owns one at line 979. **Any PHYSICAL line inserted above those — comment lines included — re-addresses them and reds `proseNumerics.test.js`.**

⇒ **Both source edits are made strictly PHYSICAL-LINE-NEUTRAL.** The rationale for the gate is written by REWRITING the existing 6-line comment block at `EconomicsTab.jsx:313–318` in place at identical line count, never by inserting lines. This keeps `proseNumerics`, `sizeBaseline` and eslint `max-lines` all untouched. There is no `max-len` rule in `eslint.config.js`, and this file already carries very long lines, so lengthening lines in place is idiomatic here.

## 4. PREDICTED REGISTER MOVEMENT — written BEFORE any walker was run

| Register | Prediction | Reasoning |
|---|---|---|
| `tests/lint/.lighting-census-baseline.json` `titles` | **+3** (22919 → 22922) | The census sums `liveTitlesIn(src)` over every CREDITED file; `tests/ui/economicsTabFlow.test.js` is an ordinary credited evidence-address file and I add 3 `test(...)` titles to it. |
| …`suiteTitles` | **+1** (6152 → 6153) | I add exactly one new `describe`. |
| …`files` / `credited` / `parked` | **NO MOVE** (2515 / 2144 / 371) | I add NO new test file (deliberate — a new file reds three censuses) and park nothing. |
| `tests/lint/.prose-numerics-baseline.json` | **NO MOVE** | Physical-line-neutral in both source files, so no row re-addresses; and I author no new numeric prose. |
| `tests/copy/.voice-mechanics-jsx-baseline.json` | **NO MOVE** (EconomicsTab stays `{"em":3,"bang":0}`) | Shrink-only over JSX **prose strings** via `extractJsxProseStrings`; I add no JSX text and no string literal, and comments are not scanned. |
| `scripts/.size-baseline.json` | **NO MOVE** | Both files stay at/below 600 effective; neither has an entry and neither gains one. |
| `tests/lint/.dossier-mounts-baseline.json` | **NO MOVE** | The dark half does not grow: all five mounts still exist and still resolve to exactly one site under `src/components`. Reachability is a SOURCE scan and I remove no `drawnAtMount` literal. |
| Writer-reach register | **NO MOVE** | I add no read of a written settlement key. The gate reads a React PROP (`publicDossier`), and that identity already exists at `OutputContainer.jsx:446`. Reasoned, NOT run — `--write` is a register door and forbidden to me. |
| Test ratchet (`totalTests` floor) | **moves UP by 3, which is the compliant direction** | A floor; growth never reds it. The chair refreezes at the landing. |

**Owed to the chair at the landing:** the lighting census refreeze (+3 titles / +1 suiteTitle) and the test-ratchet refreeze. Nothing else, if the predictions hold.

---

## 5. THE EDIT (both source files PHYSICAL-LINE-NEUTRAL — `git diff --stat`: 8 insertions, 8 deletions)

`src/components/OutputContainer.jsx:703` — in place, the value already computed at `:446`:
```jsx
case 'economics':  return <EconomicsTab settlement={s} narrativeNote={null} saveId={saveId} publicDossier={publicDossier} />;
```
`src/components/new/tabs/EconomicsTab.jsx:237` — in place:
```jsx
export function EconomicsTab({economicState, settlement, narrativeNote, saveId = null, publicDossier = false}) {
```
`src/components/new/tabs/EconomicsTab.jsx:319` — in place; the 6-line rationale block at `:313–318` was REWRITTEN at identical line count:
```js
const deskProse = publicDossier ? Object.freeze({ prosperityHeader: null, prosperityRung: null, foodTile: null, granaryTile: null, foodSecurityRung: null }) : economyStateProse(s, { foodBalance: fbal, granaryOutlook: granary }, { seed: String(s?._seed ?? s?.id ?? '') });
```
Effective lines re-measured AFTER the edit with eslint's own Linter: **580 / 600 — unchanged.**

## 6. THE TWO-DIRECTION PROOF

**POSITIVE (`npx vitest run tests/ui/economicsTabFlow.test.js`, CAPTURED_EXIT=0): `Tests 7 passed (7)`** — 4 pre-existing + my 3.

**NEGATIVE CONTROL 1 — the gate deleted at the draw (line 319 reverted to the unconditional call). CAPTURED_EXIT=1:**
```
FAIL tests/ui/economicsTabFlow.test.js > THE PUBLIC GATE … > a PUBLIC dossier draws ZERO state-prose sentences, and the SAME town drawn non-public draws BOTH
AssertionError: expected 'Comfortablea market townTraderoadThe …' not to contain 'There is nothing striking about Forge…'
Received: "…The market square keeps its hours.There is nothing striking about Forge Town's condition in either
direction: a working road, a working market, a town neither building nor selling off.EconomyComfortableFood
Deficit 40%600 / 1,000 lbs/dayFood Security▲…Production deficit of 40%. Settlement requires food imports to
sustain population.Forge Town cannot feed itself and does not come close. The shortfall is large, standing,
and covered incompletely."
```
That received string is the FINDING ITSELF, reproduced: **both** corpus sentences rendering on a public dossier.

**NEGATIVE CONTROL 2 — the router thread cut (`publicDossier={publicDossier}` removed from `:703`). CAPTURED_EXIT=1:**
```
FAIL … > the ROUTER threads the public condition — OutputContainer hands publicDossier to the tab
AssertionError: expected '      case \'economics\':  return <Ec…' to contain 'publicDossier={publicDossier}'
Received: "      case 'economics':  return <EconomicsTab settlement={s} narrativeNote={null} saveId={saveId} />;"
```

**BOTH PLANTS RESTORED BYTE-EXACTLY** — verified by sha256, not by `git checkout` (forbidden):
```
EconomicsTab   before 8d9230f2dddf53e90de1858bbbbeb6db41636d2243c6de9dcc26846c43f633c1  after IDENTICAL
OutputContainer before 2056e63ebd238667631a7780385c55394468785dbff8522887773150e5fc6001  after IDENTICAL
```
Re-run after restore: **CAPTURED_EXIT=0, `Tests 7 passed (7)`.**

## 7. EVERY COMMAND'S CAPTURED EXIT

| Command | Exit | Result |
|---|---|---|
| `git rev-parse HEAD` (dock precondition) | 0 | `15c6368a6…` ✔ |
| `npx vitest run tests/ui/economicsTabFlow.test.js` (positive) | **0** | 7 passed |
| same, negative control 1 (gate removed) | **1** | REDS — quoted above |
| same, negative control 2 (thread cut) | **1** | REDS — quoted above |
| same, after both restores | **0** | 7 passed |
| `npx vitest run tests/lint/dossierMountRegistry.walker.test.js` | **0** | 16 passed — GREEN as predicted |
| `npx vitest run tests/lint/writerReach.walker.test.js` | **0** | 56 passed — GREEN as predicted |
| `npx vitest run tests/lint/proseNumerics.test.js` | **0** | 29 passed — NO MOVE, as predicted |
| `npx vitest run tests/lint/sizeBaseline.test.js` | **0** | 3 passed — NO MOVE, as predicted |
| `npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` | **1** | census red, **`expected 22922 to be 22919`** = titles +3, EXACTLY as predicted |
| `npx vitest run tests/copy/voiceMechanics.test.js` | **1** | ⚠ **PRE-EXISTING RED, NOT MINE** — see §8 |
| `npx vitest run tests/components/economicsTabMalformedFlows.test.jsx` | **0** | 3 passed |
| `npx vitest run tests/ui/tabs.smoke.test.js` | **0** | 36 passed |
| `npx vitest run tests/components/economicsPlotHookSeam.test.jsx` | **0** | 1 passed |
| `npx vitest run tests/components/economyFreshnessNote.test.jsx` | **0** | 19 passed |
| `npx vitest run tests/pdf/screenParitySource.test.js` | **0** | 4 passed |
| `npx vitest run tests/lint/economyReadModelCoverage.walker.test.js` | **0** | 15 passed |
| `npx eslint` (the 3 touched files) | **0** | no output = 0 errors, 0 warnings |
| `node scripts/check-full-typecheck.mjs` | **0** | `OK — no type regressions (173 error(s), ceiling 173)`, 14s |

## 8. ⚠ A PRE-EXISTING RED FOUND AT THE DOCK TIP — `tests/copy/voiceMechanics.test.js` (NOT caused by this car)

Four arms fail. **I proved my edit contributes nothing**, rather than asserting it. Using the repo's own `extractJsxProseStrings` on the COMMITTED blob (`git show HEAD:…`, a read, no checkout) against my working copy:
```
EconomicsTab  COMMITTED {"em":0,"bang":0,"n":872}
EconomicsTab  WORKING   {"em":0,"bang":0,"n":872}
OutputCont.   COMMITTED {"em":0,"bang":0,"n":343}
OutputCont.   WORKING   {"em":0,"bang":0,"n":343}
```
Byte-identical. The drift is already in the committed tree at `15c6368a6`:
- **17 JSX rows** drifted, incl. the mirror pair `EconomicsTab.jsx: baseline em:3 → current em:0` and `EconomicsGlance.jsx: baseline em:0 → current em:3` — i.e. **DESK CAR 1's `EconomicsGlance` extraction moved three em-dashes between files and the baseline was never refrozen.**
- Total JSX debt arm: `expected 40 to be less than or equal to 6`.
- Plus ~65 `src/data + src/domain` rows — trees this car does not touch at all (`git diff --name-only | grep -c '^src/domain/\|^src/data/'` → **0**).

**Chair: this is an unbanked, un-refrozen red sitting at the §891 tip and it is owed a disposition before the CAS.** It is reported, not fixed — refreezing `.voice-mechanics-jsx-baseline.json` is a register door and mine is not the hand.

## 9. MEASURED vs PREDICTED

| Register | Predicted | Measured | Verdict |
|---|---|---|---|
| lighting `titles` | +3 → 22922 | **22922** (`expected 22922 to be 22919`) | ✅ EXACT |
| lighting `suiteTitles` | +1 → 6153 | **not asserted** — the arm throws on the FIRST mismatch (`titles`) and short-circuits before the suite layer | ⚠ PLAUSIBLE, not CONFIRMED. Source fact: the diff adds exactly **1** `describe(` and **3** `test(`, removes 0. The chair's refreeze must carry both figures. |
| lighting `files`/`credited`/`parked` | no move | not asserted (same short-circuit); no test FILE added | PLAUSIBLE by construction |
| prose-numerics | no move | **GREEN, exit 0** | ✅ CONFIRMED |
| sizeBaseline | no move | **GREEN, exit 0** | ✅ CONFIRMED |
| dossier-mounts | no move | **GREEN, exit 0** | ✅ CONFIRMED |
| writer-reach | no move | **GREEN, exit 0** | ✅ CONFIRMED (executed, not merely reasoned) |
| voice-mechanics | no move from me | **my contribution = 0, proved** | ✅ CONFIRMED; the file's red is pre-existing |

---

## 10. THE COMMIT

- **sha `450f7dbb7a3ccaf3f71da24ff8f0b7b54b65f669`**, parent `15c6368a65eba68b07989e60743ca64053315a93` ✔ (the briefed dock HEAD)
- 3 files changed, 98 insertions(+), 8 deletions(-) — exactly the three files I staged by name (never `-A`/`-u`/`.`)
- Trailers present: `Seat: Opus 5 — Fable-unvalidated` / `Lane: O2GATE`
- **The pre-commit `eslint --fix` did NOT alter my bytes** — committed blob vs tested worktree sha256 IDENTICAL on all three files, so the green measured before the commit is the green of the committed tip.
- **Re-proved AT the committed tip:** test exit 0 (`Tests 7 passed`), eslint exit 0, effective lines 580 / 600.
- **`git status --porcelain` → 0 lines.** No untracked file was created in the dock; all scratch lives under `o2gate/`.

## 11. RETROVALIDATION ROW (§879 form) — for enrolment at §893

| # | What was judged (by Opus 5, unvalidated) | What Fable re-derives | Receipts | Priority |
|---|---|---|---|---|
| R1 | **The desk's `audience` option is NOT a public gate**, so the card's preferred option was refused and a component-side null shape chosen. | Re-read `stateProseKernel.js:117–120, 159–161, 263` and confirm `AUDIENCE_PLAYER` filters only `dm-only` marks, so it cannot silence a non-covert variant. | `probe-desk.mjs` output: a player-audience draw yields both sentences. | **HIGH** — if wrong, the gate is in the wrong layer. |
| R2 | **The gate belongs at the DRAW, not the render sites** — because there are TWO sentence mounts, not the one the card named. | Re-read `dossierMounts.js:122` and `:134` (both `rung: 'sentence'`) and confirm `EconomicsGlance.jsx`'s "all three positions are GLANCE rungs" docblock is stale. | NC-1's received DOM shows BOTH sentences leaking. | **HIGH** — a food-line-only gate would have shipped a live leak. |
| R3 | **`publicDossier = false` as the tab's prop default** (fail-OPEN direction) rather than `true` (fail-closed). | Judge the trade: `true` would silence the desk on every private surface that renders the tab without the prop (the PDF parity path, `tabs.smoke`, the malformed-flow fixtures) — a far wider behaviour change than the finding. `false` matches the file's own `saveId = null` convention, and the leak is bounded because `PublicDossierView` is the ONLY public mount and it routes through the one `OutputContainer` case that now passes the flag. | Arm 3 (router source scan) converts the fail-open default into a guarded one: cutting the thread REDS (NC-2). | **⭐ HIGHEST — this is the one real vetoable call in the car.** A second public mount added later would leak unless it threads the flag. If the chair wants structural fail-closure, the follow-on is to gate where `publicDossier` is COMPUTED, not where it is consumed. |
| R4 | **Both source edits made strictly physical-line-neutral**, and the rationale written by rewriting the existing 6-line comment block in place. | Confirm `OutputContainer.jsx` is at exactly 600/600 and that `.prose-numerics-baseline.json` is line-addressed, so any inserted line reds two further registers. | `git diff --stat` 8+/8−; prose-numerics and sizeBaseline both exit 0. | **HIGH** — this is why the car costs one register instead of three. |
| R5 | **Inline `Object.freeze({…five nulls})`** rather than a module-level named constant. | Judge legibility vs the line budget: a named constant costs a physical line and would have re-addressed prose-numerics rows. | Effective lines unchanged 580; prose-numerics green. | MEDIUM — cosmetic; a named constant becomes free the moment the tab is decomposed again. |
| R6 | **Extended `tests/ui/economicsTabFlow.test.js`** (not the two other candidates), added **1 describe + 3 test titles**, no new test FILE. | Confirm the file is the natural home (it already renders the tab in jsdom) and that a new file would have redded three censuses. | Census red is titles-only: `expected 22922 to be 22919`. | MEDIUM |
| R7 | **Spent a third census title on a router source-scan arm** beyond the two the card asked for. | Judge whether the +1 title is worth pinning the thread. Without it, the render arms pass while the live gallery dossier still leaks (exactly the shape of the original defect). | NC-2 reds only that arm. | MEDIUM |
| R8 | **Fixture is a DEFICIT town with label `'Deficit'`**, because the Food Security section is `defaultOpen={!!fb.deficit}` and a surplus town hides its own mount behind a collapsed header. | Re-derive that a collapsed section renders no sentence, so a surplus fixture would have proved silence vacuously. | First run failed on exactly that; quoted in the log. | MEDIUM — a vacuity trap avoided. |
| R9 | **Reported rather than fixed** the pre-existing `voiceMechanics` red. | Confirm my contribution is zero and decide the disposition (bank or refreeze). | §8 above: committed vs working extractor counts identical. | **HIGH — chair action owed before the §891 CAS.** |
| R10 | **Commit trailers limited to `Seat:` + `Lane:`**, no `Co-Authored-By`, matching 12/12 recent commits. | Confirm the repo convention. | `git log -12` trailer census: 12 `Seat:`, 0 `Co-Authored-By`. | LOW |

### Two stale claims found in code, reported not changed (no second commit taken)
1. `EconomicsTab.jsx:310–311` still asserts the file "sits EXACTLY on its frozen 600-line ceiling (measured — 605…)". **It is 580.** The claim is stale as present tense; the rationale it justifies (returning the band accent from the derivation) is unaffected. Left alone because curing it is cosmetic and this car's line budget is spent proving the gate.
2. `EconomicsGlance.jsx`'s docblock: "All three positions in this file are GLANCE rungs, so none of them prints a corpus sentence today." The file carries **four** positions and `economics.prosperityHeader` is a **`sentence`** row in the shipped registry — the file's header sentence is the one this car was mainly silencing. Touching that file's structure is a declared STOP, so it is reported.

---

**STATUS: COMPLETE.** Commit `450f7dbb7`, porcelain 0, every predicted register movement measured or explicitly labelled PLAUSIBLE.
