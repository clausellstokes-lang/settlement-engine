# SKEPTIC — §912 / lane L-MAT — LENS: THE PROMISE AND THE WIRING (car 2 `fe8eb3f56`, chair ruling R-E)

Seat: Opus 5 — Fable-unvalidated (the verifier). Read-only on every tree.
Dock: `.../26b2203a…/scratchpad/laneLMAT`
HEAD before = HEAD after = `7d96e2b72245fa465182d59dade31621f31ecf2c` · porcelain before = 0, after = 0.
`HOLD-VITEST` absent before the one vitest run and at the end (12:01:43 EDT, `date`).
Every figure below came from a command whose output I saw. Probes live beside this file
(`probe-stop-vacuity.mjs`, `probe-load-hydration.mjs`, `probe-gallery-import.mjs`) and were run
with `node` from the dock; they write nothing.

---

## SUMMARY OF VERDICTS

| # | claim tested | verdict |
|---|---|---|
| 1 | R-E implemented as ruled: the mint is spread inside `birthConfig`, main-thread, beside the density mint | CONFIRMED |
| 2 | the dial stays at 1 and the mint returns `{}`; wiring is not lighting | CONFIRMED |
| 3 | the dial is read from the config and NEVER from the module-level constant, at every read site | CONFIRMED |
| 4 | no golden, no register, no tuning value, no baseline, no applied-head byte moved across all six cars | CONFIRMED |
| 5 | `tests/domain/livingContentLawWiring.test.js` is 10 arms, all green | CONFIRMED |
| 6 | **"⛔ THE STOP … driven through the real store's `regenSection`" is the executable proof that a regen cannot stamp a law** | **REFUTED** |
| 7 | **"the store config … is never hydrated from a saved settlement" (the load-bearing half of the lane's `updateConfig` correction)** | **REFUTED** |
| 8 | **every lifecycle path a world's config takes was traced** — the PUBLIC-SHARE → GALLERY-IMPORT path is untraced and produces a LIT world with no roster | **REFUTED** |
| 9 | "READ (LIT dial)… asserted again UNDER the lit mock" | PARTLY |
| 10 | L4: the widened `MINT_SYMBOLS` gives the three per-caller arms teeth for the new mint | PARTLY (no plant was run for the symbol that was added) |
| 11 | the ⭐ non-WIRED arm still guards the two generation laws after car 2 | PARTLY (correct as recorded, but both rows are now WIRED — its live denominator is the OFF_THE_BOUNDARY laws only) |
| 12 | the same-seed control is not a comparison of one object to itself | CONFIRMED |

---

## 1. R-E — CONFIRMED

`src/domain/density/densityCreateBoundary.js:75` static-imports the mint; `:181-187`:

```
export function birthConfig(config) {
  return ({ ...(config || {}), ...newSettlementDensityLaw(), ...newSettlementLivingContentLaw() });
}
```

One mint, main-thread, beside the density one — exactly as ruled. The refused alternative (a
per-caller LAZY mint) is recorded in the docblock with its reason. `grep` over `src/` finds the
mint named in three places only: the boundary's import, the spread, and the law's own declaration.
Both BIRTH callers reach `birthConfig` (`settlementGenerateAction.js:124`,
`composeInstantWorld.js:121`); no other caller exists.

## 2. THE DIAL — CONFIRMED

`livingContentLaw.js:94` `NEW_SETTLEMENT_… = DEFAULT_LIVING_CONTENT_LAW_VERSION`. The wiring test's
first arm asserts both the WIRED row and the dormant dial and `newSettlementLivingContentLaw()`
`toEqual({})`. Executed: 10 passed, exit 0.

## 3. NO READ SITE CONSULTS THE DIAL — CONFIRMED

`grep -rn NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION src/` → 6 hits: the declaration (`:94`), its two
uses **inside the mint** (`:160`, `:165`), one comment (`:25`), one comment in the version leaf
(`:98`), and the register's `dial:` string label (`densityCreateBoundary.js:317`). Nothing else.
`resolveLivingContentLawVersion` (`livingContentLawVersion.js:106-108`) reads
`config?.[LIVING_CONTENT_LAW_CONFIG_KEY]` and nothing else; the leaf imports nothing at all.
`grep -rn '_livingContentLawVersion' src | grep -v livingContentLaw` → **zero** hits: no module
outside the two law files names the key.

## 4. NOTHING FROZEN MOVED — CONFIRMED

`git diff --name-status 3b1c0eaa5..7d96e2b72` = **12 files**, all under `src/` (7) and `tests/` (5):
`livingContentLaw.js`, `livingContentRoster.js`, `densityCreateBoundary.js`,
`accountSettlementContentPortability.js`, `accountImportBody.js`, `settlementGenerateAction.js`,
`settlementSliceHelpers.js`; `livingContentLawWiring.test.js` (A),
`accountSettlementContentPortability.test.js`, `densityCreateBoundary.walker.test.js`,
`livingContentRosterPublicDrop.test.js` (A), `accountImportSlice.test.js`.
No `scripts/`, no `supabase/`, no `vite.config.js`, no golden, no `ARCHITECTURE.md`. Checked
directly: `scripts/.size-baseline.json` carries **no row** for any of the seven touched `src/`
files, so the tolerance-0 ratchet is genuinely untouched (the receipt's claim holds).

## 5 / 12. THE FILE RUNS, AND THE SAME-SEED CONTROL IS REAL — CONFIRMED

`npx vitest run tests/domain/livingContentLawWiring.test.js` → **EXIT=0, 10 passed (10)**, 2.67 s.
The same-seed control (`:159-172`) runs the real pipeline twice on one seed — once on
`birthConfig({...CONFIG})`, once on `{...CONFIG}` — and deep-equals the two settlements. It is not
one object compared to itself, and a config byte written by the mint would show up in
`settlement.config` and `settlement._config`. Non-vacuous.

---

## 6. ⛔ REFUTED — THE STOP ARM CANNOT FAIL ON THE DEFECT IT NAMES

The arm (`:221-253`) says: *"If `regenSection` read the store's form config the regenerated world
would silently acquire v2; it reads `settlement.config` first, so it cannot."* Its three
post-conditions are `after.config[KEY]` undefined, `resolveLivingContentLawVersion(after.config)`
= 1, and `after.customContentRoster` undefined.

**Executed** (`probe-stop-vacuity.mjs`, run under `node` at the dock tip). The probe reproduces
exactly what `regenSection` does — `regenNPCsPipeline(settlement, cfg, {locks})` then
`Object.assign(settlement, parts)` (`settlementSliceHelpers.js:545`) — once with the world's own
config and once with the **lit wizard config, i.e. the defect**:

```
--- cfg = settlement.config (product)
   returned part keys: _regenSeed,conflicts,factions,npcs,relationships
   after.config[_livingContentLawVersion] = undefined
   after.customContentRoster = undefined
--- cfg = LIT wizard config (the defect)
   returned part keys: _regenSeed,conflicts,factions,npcs,relationships
   after.config[_livingContentLawVersion] = undefined
   after.customContentRoster = undefined
```

Identical. The reason is structural and the lane measured half of it itself in car 5:
`regenNPCsPipeline` returns settlement-ROOT parts and never `config`; and
`customContentRoster` has exactly ONE writer in the estate,
`generateSettlementPipeline.js:185`, which is inside `generateSettlementPipeline` (`:77`) and not
reachable from `regenNPCsPipeline` (`:474`). So a `regenSection` that read
`config || settlement.config` would still leave both asserted keys untouched, and the arm would
still be green.

**Correction.** The arm is a smoke test, not the STOP. What actually guards the defect is a
source-text arm in the walker — `densityCreateBoundary.walker.test.js` asserts
`/settlement\.config \|\| config/` is present in `settlementSlice.js` and
`/\bconfig \|\| settlement\.config/` is absent. That arm can fail; the runtime one cannot. The
receipt's "the STOP fired deliberately … and proved not to fire in the product" credits the wrong
instrument. A cure is one line: assert the counterfactual (that a lit `cfg` handed to
`regenNPCsPipeline` still yields no marker is what makes the arm inert — so the arm needs a
*positive* control that the regen changed the world, plus the marker check kept).
Severity MEDIUM: the product behaviour is right and a real guard exists; the claim about this
arm's power is not.

## 7. ⛔ REFUTED — THE STORE CONFIG **IS** HYDRATED FROM A SAVED SETTLEMENT

This is the load-bearing half of the lane's own recorded correction. Having measured that
`updateConfig` does NOT drop `_livingContentLawVersion` (true — `isAllowedConfigKey`,
`configSlice.js:99-103`, admits `key.startsWith('_')`), the lane rests its "the promise does not
rest on it" on the next sentence, shipped in NEW bytes at
`tests/domain/livingContentLawWiring.test.js:300-303` and repeated in the receipt:
*"the store config is the WIZARD FORM, it is never hydrated from a saved settlement."*
The same sentence is pre-existing product prose at `densityCreateBoundary.js:44-48` ("Nothing
anywhere hydrates it from a saved settlement") and `settlementGenerateAction.js:117-120`.

**It is false.** `src/components/SettlementsPanel.jsx:96-103` — the Library's Load, also reached
from `SettlementDetail.jsx:605` — does:

```
const rawConfig = data.settlement?._config || data.config;
if (rawConfig) updateConfig(migrateConfig(rawConfig));
```

`migrateConfig` is `migrateSettlementConfig` (`settlementConfigMigration.js:47-53`), a spread that
adds two defaults and strips nothing. And `settlement._config` is the **raw config the pipeline was
handed** (`generators/steps/assembleSettlement.js:170`), i.e. the birth config including the mint.

**Executed** (`probe-load-hydration.mjs`, seam armed):

```
lit settlement.config[KEY]      = 2
lit settlement._config[KEY]     = 2
after migrateConfig, KEY        = 2
isAllowedConfigKey(KEY)         = true
=> the wizard form would carry  = true
```

The `hydrateFromSave` half of the claim is true (that action assigns settlement / ids / phase /
eventLog / locks, `settlementSlice.js:1545+`); the UI's Load flow calls `updateConfig` *alongside*
it, which is what the claim overlooks.

**What it costs.** Today: inert — a v2 world is unreachable through the UI while the dial is dark.
The day the dial is dark and a v2 world exists in a library (an account import preserves both the
marker and the roster, per car 5's own probe), Load → Generate births a NEW world as v2 while the
dial says 1, because `birthConfig` spreads `{}` when dormant and therefore does not overwrite the
hydrated marker. That contradicts the ground on which car 5 left the WRITER_DARK_REGISTER row
alone ("dial at 1, no shipped world writes the key"). Once the dial is lit the leak is harmless
(the mint wins, it is spread last).

**And it is strictly wider than the lane's own deferral #4.** That deferral names only
`FoundingWorlds.jsx` and argues `SAMPLE_SETTLEMENTS` is a static in-repo fixture set "so no user
world reaches it". The Library's Load reaches **every user save**.
Severity HIGH — a false premise carried in shipped product prose, re-asserted in new test bytes,
and used as the reason not to change an admission surface.

## 8. ⛔ REFUTED — AN UNTRACED LIFECYCLE PATH: PUBLIC SHARE → GALLERY IMPORT

The receipt traces create / read / regen / undo-clone / persist / account-import / public-drop /
DM-full. It never names `src/store/galleryImportSettlement.js` (or its sibling
`galleryImportMap.js:291`), which imports a **public-safe** settlement into another user's library
and passes its config through `scrubImportedConfig` — a five-key denylist
(`importScrub.js:38-46`: `_seed`, `primaryDeityRef`, `primaryDeitySnapshot`, `cultDeitySnapshots`,
`faithProfile`). `_livingContentLawVersion` is not in it.

So R-A (drop the roster from the public projection) and R-D (let the marker ride) compose into a
world that says it is lit and carries no scope record. **Executed** (`probe-gallery-import.mjs`):

```
lit: roster present     = true
lit: marker             = 2
public: roster present  = false
public: marker          = 2
imported config marker  = 2
imported world reads LIT = true
=> LIT world in the importer library with NO roster: true
```

Nothing downstream repairs it: car 5 measured that no regen re-mints the roster, and the account
remap only rewrites a roster that is present. So the imported world keeps a v2 marker with a
permanently absent exactness record — the "world that lies" the O-11 work exists to prevent,
arriving through the one import boundary the lane did not look at. It is inert while the dial is
dark, exactly like deferrals 1, 2 and 4, and it belongs on that list with them. It also bears on a
future car 6: R-C's receipt key is "present iff the world is LIT", so such a world would carry a
`rosterHash` over a roster that is not there.
Severity HIGH (a chair ruling pair, R-A × R-D, produces an unintended state on a real path).

## 9. PARTLY — "READ (LIT dial)" cannot see the dial it says is lit

`boundaryWithLitLaw()` mocks `src/domain/content/livingContentLaw.js`. The arm then re-imports
`livingContentLawVersion.js` and asserts the answer is unchanged. But that leaf **imports nothing**
— its own header says so, and it is a dependency-free leaf precisely to break a cycle
(`livingContentLawVersion.js:6-21`; `livingContentLaw.js:74` imports *from* it, not the reverse).
The mock therefore cannot reach the code under test, and the arm is byte-for-byte the dark READ
arm above it. It is not worthless: it would red if a future edit gave `resolveLivingContentLawVersion`
a fallback that imports the dial. But "asserted again UNDER the lit mock" describes a control that
is not, today, controlling anything. Severity LOW.

## 10. PARTLY — L4's widening was never plant-proved for the symbol it added

Car 2 added `newSettlementLivingContentLaw` to `MINT_SYMBOLS` and `livingContentLaw.js` to
`MINT_HOMES`. The negative control the receipt reports (car 3) planted
`newSettlementMapEdits` — an OFF_THE_BOUNDARY law, not the symbol car 2 added — and it exercised
the *scan-set* widening, not the *symbol-set* widening. The symbol widening is mechanically sound
(the arms iterate `MINT_SYMBOLS`), but it is reasoning, not a measurement, and the estate's own
standard for a widening in this file is a plant. UNTESTED-by-plant; I did not run one because
planting requires writing into the dock, which my fences forbid.

## 11. PARTLY — the ⭐ arm's generation-law denominator is now empty

After car 2 both `GENERATION_LAWS` rows are `WIRED`, so
`Object.values(GENERATION_LAWS).filter(row => row.wiring !== 'WIRED')` is `[]` and the ⭐ arm's
only live rows are `LAWS_OFF_THE_BOUNDARY`. The arm keeps its non-vacuity guard
(`expect(offTheBoundary.length).toBeGreaterThan(0)`), which is why it still passes honestly, and
the lane recorded this exact consequence as L4's reason. Recorded here because the receipt's
"the three per-caller arms cover both laws" is now the *only* cover for the living-content mint,
and item 10 says that cover has not been plant-proved.

---

## WHAT I COULD NOT TEST

- The build figures (1,377 emitted files, the 101 → 130 B lazy chunk, the first-paint closure
  1,042,086 / 1,048,000). Builds are outside my fences. UNTESTED.
- A plant in the dock for item 10. Writes to the dock are outside my fences. UNTESTED.

## THE TWO ROWS I WOULD ADD TO THE DEFERRED LIST BEFORE LANDING

6. **The Library's Load hydrates the wizard config from a saved settlement**
   (`SettlementsPanel.jsx:103`), and the marker survives `migrateConfig` + `updateConfig`. Three
   places in shipped prose say the opposite. Inert while the dial is dark; on the lighting day it
   decides whether a loaded world's law propagates to the next birth.
7. **The public-share → gallery-import path yields a LIT world with no roster**
   (`galleryImportSettlement.js:73` + `importScrub.js:38`). R-A and R-D compose into it; nothing
   downstream repairs it.
