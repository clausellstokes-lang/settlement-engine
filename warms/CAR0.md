# W-ARMS CAR 0 — THE FIVE PROBES, AND B3 THE RE-MEASURE
Lane WARMS-CAR0 · Seat Opus 5 — Fable-unvalidated · 2026-09-05 · **read-only, zero product bytes, zero repo writes.**

**Base of measurement:** `$SC/laneANCH2` detached at **`272dbd2da416343a6eac14bc50ac09abb69d53b8`**
(clamp consist + ANCHORS over `90702c3e9`). Porcelain **0** on arrival and **0** at every checkpoint (CONFIRMED).
**Design volume read from** `refs/preserve/train-warms-2026-09-05:docs/DESIGN_W_ARMS.md` = `11b255d01`, 55,812 B,
558 lines (CONFIRMED, `git cat-file -s`).

Labels: **CONFIRMED** = a command was executed at `272dbd2da` and its output is quoted. **PLAUSIBLE** = reasoning
only, with the settling act named. **OWED** = needs a build or vitest, which this lane is fenced from.

---

## 0 · THE PROBE COUNT — read from the design, not from the brief

The brief said five. **The design names FIVE.** CONFIRMED, `DESIGN_W_ARMS.md` §7, the Car 0 row, verbatim
enumeration `(1)`…`(5)`: the OSR probe · `EAGER_FIRST_PAINT_MODULES` at tip · the exporter call sites' `campaign`
payload · an `esbuild --bundle --minify` byte figure · whether `wizardNewsAuthoring` pins a line in
`pools.js`/`DossierHeaderRow.jsx`/`Cover.jsx`. Brief and design agree.

---

## 1 · ⛔ B1 IS OPEN — measured, and it refutes the handoff's claim

The design volume is on **exactly one ref** and on **no branch**.

```
master                                   ABSENT
review-fixes-2026-07-08  (ledger tip)    ABSENT
29e7bf1e5                (ledger tip)    ABSENT
272dbd2da                (my dock)       ABSENT
refs/preserve/train-warms-2026-09-05     PRESENT
```
(CONFIRMED, `git cat-file -e "${ref}:docs/DESIGN_W_ARMS.md"` per row.)

`git log --all --oneline -- '*DESIGN_W_ARMS*'` returns exactly two commits, both on preserve refs:
`11b255d01 W-ARMS Car 0a: the design volume enters git, having existed in no ref on either branch` (1 file, 558
insertions) and `034894739 §893 kit II: …`. `git for-each-ref --contains 11b255d01` returns **only**
`refs/preserve/train-warms-2026-09-05`.

⇒ **B1 is OPEN.** The rescue happened (SCOPE-MEASURE D-10 is right that the urgency is discharged — the bytes are
safe in two refs), but the *charter obligation* — the volume living in `docs/` on the ledger line — is unmet.

**Which consist should carry it: a DOCS-ONLY car on the LEDGER branch (`review-fixes-2026-07-08`), alone.**
Ground: it is the only W-ARMS item that survives the C1 veto as a record, and it moves no register — so it must not
be coupled to a src-moving consist whose gate could bounce it.

**The `tests/docs/` scanner family it meets, named (CONFIRMED at `272dbd2da`):**
| scanner | binds? | evidence |
|---|---|---|
| `tests/docs/enforcement-claims.test.js` | **NO** — zero `CLAIM_RE` hits in the volume (WARMSSCOPE measured rc=1 over all 8 alternates; I did not re-run the regex, **PLAUSIBLE, inherited**) | its census row `claims ceiling = 6` is at **6/6, zero headroom** — a single claim phrase would breach it |
| `tests/docs/docCounts.test.js` | **NO** | scans `supabase/migrations` + `supabase/functions`, not `docs/` |
| lighting census | **NO** | subject is `tests/`, not `docs/` |
| both typecheck baselines | **NO** | roots are `src/**` |
| both voice arms | **NO** | `voiceMechanics` walks `src/data`+`src/domain` (Tier-2) and `src/**/*.jsx` (JSX); `docs/` is in neither |

⚠ The one live hazard for B1 is the **enforcement-claims arm at 6/6 with zero headroom**. The "zero CLAIM_RE hits"
result is inherited from WARMSSCOPE at `f537ce47e` and the volume's bytes have not changed since (md5 recorded
`58e1e8dc6f9aebe55b3eeed7758524b2`; blob is byte-stable across both refs). **Re-run the regex at the landing base
anyway** — it is one grep and the arm has no slack.

---

## 2 · THE FIVE PROBES

### PROBE 1 — the OSR probe · **CONFIRMED, and it inverts a design premise**

**Question it answers:** would `armsKinship.js`'s kinship reads mint an unbankable observed-shape-reader finding?

**Command + result (read-only gate, no `--write`):**
```
$ node scripts/check-observed-shape-readers.mjs        # in laneANCH2
EXIT=0
observed-shape readers: 1993 finding(s), exactly matching the frozen inventory.
CR-OSR-FREEZE-6 shape-family filter (theta=0.8, >=8 keys): cleared 124 read(s) across 31 identit(ies) …
CR-OSR-SCHEMA-6 M11 DOM-global receiver filter (document, globalThis, window): cleared 11 read(s) across 3 identit(ies) …
CR-OSR-SCHEMA-6 M12 language-surface filter (toLocaleString): cleared 0 read(s) across 0 identit(ies) …
M8/M9 explained-writer bank (H26 / CR-OSR-FREEZE-6-R2): 9 declared identit(ies) … 64 read(s) …
CR-OSR-FREEZE-7 UNREVIEWED-UI cohort (src/components/): 50 file(s) / 129 identit(ies) / 193 read(s) …
```
Porcelain 0 after; HEAD unchanged. **Baseline: `total 1993 · identities 1409 · schema 16 · minRows 40 ·
frozen 2026-09-04 · frozenAtSha c08df7d59 · inventory 388 files`** (CONFIRMED — every figure holds against
WARMSSCOPE's reading except `schema`, see §3).

**The banked-identity table, re-measured at `272dbd2da`** (CONFIRMED, direct read of `inventory`):

| identity probed | banked rows | where |
|---|---|---|
| `parentRef on settlement` | **4 files** | `settlementParentRef.js`(2) · `lineageClaim.js`(1) · `campaignPulseHelpers.js`(1) · `campaignWorldPulseDeferred.js`(1) |
| `parentRef on config` / `on save` | 1 + 1 | both `lineageClaim.js` — **6 `parentRef` rows total**, not 4 |
| `obligeeId` · `obligorId` · `terms` · `complianceState` · `treaties` · `liveEdgeId` · `foundedTick` | **0** | — |
| `topExport on economicState` | 2 | `historyBeats.js` · `simulationSpine.js` |
| `terrain on settlement` | 5 rows | incl. **`src/pdf/sections/Cover.jsx`(1)** and `src/pdf/lib/viewModel.js`(2) |

⛔ **THE DESIGN'S INFERENCE IS BACKWARDS AS STATED.** §6 reasons: *"`obligeeId/obligorId/terms/complianceState/
treaties…` are NOT banked (0 rows, CONFIRMED) ⇒ PLAUSIBLY clean."* **Zero rows is the HARSHEST state, not a safe
one.** The scanner's own law, `check-observed-shape-readers.mjs:44`: *"A NEW identity in an already-listed file has
ceiling 0 and REDS even when…"*, and a file absent from the inventory gets ceiling 0 for **any** new identity.
A banked identity carries headroom equal to its count; an unbanked one carries none.

**The design's CURE is nevertheless right, for a reason it does not state.** The identity is
`<key> on <receiver-variable-name>` — leaf-spelled, not typed. The proof is in the inventory itself: the *same key*
yields three identities by receiver (`parentRef on config`, `parentRef on save`, `parentRef on settlement`;
`terrain on config` vs `terrain on settlement`; `name on chains`/`on raw`/`on inst`/`on economicState`). So routing
through `parentRefOf(item)` and `treatyOrientationOf(treaty)` works **because the read stays inside the file that
already banks it, and the adapter receives a resolved scalar with an observed writer** — not because the identity
is unlisted. State it that way in Car 2's brief or the next lane will re-derive it wrong.

**⛔ THE CAR-2 CONSTRAINT NOBODY HAS WRITTEN DOWN** (CONFIRMED, per-file inventory read):

| file Car 2 touches | in inventory? | consequence |
|---|---|---|
| **`src/components/OutputContainer.jsx`** | **YES — 5 identities** (`worldState on campaignState`:2, `worldPulse on campaignState`:1, `canonizedAt on campaignState`:1, `startedAt on campaignState`:1, `primaryDeitySnapshot on config`:2) | **an already-listed file ⇒ ANY new identity has ceiling 0 and REDS.** Car 2 threads `owningWorldState` + `allSavedSettlements` from exactly here |
| `src/components/dossier/DossierHeaderRow.jsx` | absent | ceiling 0 for any new identity |
| `src/components/organic/Ornament.jsx` | absent | ceiling 0 |
| `src/pdf/sections/Cover.jsx` | **YES — 4 identities** incl. `terrain on settlement` | ceiling 0 for a new one (Car 3) |
| `src/pdf/lib/liveWorld.js` | **YES — 3 identities** | ceiling 0 for a new one (Car 3 option (a)) |
| `lineageClaim.js` | YES — 8 identities incl. `parentRef on settlement`:1 | the cure's home; routing through it adds nothing |
| `hegemony.js` · `treatyOrientation.js` · `spatialLedgerAccess.js` | absent | ceiling 0 |

⇒ **Car 2 must thread the two props through `OutputContainer.jsx`'s EXISTING selectors** (`getCampaignForSettlement(saveId)?.worldState` already produces `worldState on campaignState`; `allSavedSettlements` is a store selector, not a shape read). A convenience read such as `campaign.settlements` or `owning.worldState?.spatialLedgers` written in that file mints a new ceiling-0 identity and reds with **no lawful bank** (growth is unbankable by `--write`, §879.12).

**⚠ A brief-level correction: `src/components/` is NOT shielded.** `EXACT_SCAN_EXCLUDED_SCOPE = ['src/components/']`
(`:264`) removes those files from **EXACT resolution only**. The gate prints it itself: *"These are ENFORCED, not
excluded: CR-OSR-SCOPE-1 removes them from EXACT resolution only."* The heuristic leg is unfiltered and under
`BASELINE_SCAN_MODE = 'legacy-leaf'` **is the gate authority**. 50 `src/components/` files sit in the inventory
(CONFIRMED — matches the gate's own "50 file(s)").

**Not run:** the design's literal probe 1 ("write the adapter's reads on a scratch copy in a detached worktree").
Creating a worktree is a git write, which this lane is fenced from. **OWED**, exact command for the Car 2 lane:
`node scripts/check-observed-shape-readers.mjs` on a dock carrying the real `armsKinship.js`, exit 0 with
`total` **unchanged at 1993**. The per-file table above is the stronger pre-answer — it says *where* a red would come
from before a line is written.

---

### PROBE 2 — `EAGER_FIRST_PAINT_MODULES` · **CONFIRMED, no build needed — and the design cites the wrong graph**

```
$ node --input-type=module -e 'const m=await import("./vite.config.js"); …'
type: [object Set]
SIZE = 265
ornament/arms/display hits: 1 ["…/src/domain/display/exportPosture.js"]
```
Import took ~1 s in plain node. The design's claim that the pin needs no build is **CONFIRMED**.

**Membership of every file the W-ARMS seam touches** (CONFIRMED):
```
not eager  src/components/OutputContainer.jsx          not eager  src/domain/worldPulse/lineageClaim.js
not eager  src/components/dossier/DossierHeaderRow.jsx not eager  src/domain/worldPulse/hegemony.js
not eager  src/components/organic/Ornament.jsx         not eager  src/domain/worldPulse/treatyOrientation.js
not eager  src/design/organic/ornament/{compose,pools,emblemPaths,fnv,palette}.js
not eager  src/domain/spatial/spatialLedgerAccess.js   not eager  src/domain/display/parityContract.js
EAGER      src/domain/deterministicSort.js             EAGER      src/domain/display/exportPosture.js
```
All `src/domain/display` in eager: **`exportPosture.js`** (one). All `src/design` in eager: **`tokens.js`** (one).
All `src/components/dossier` in eager: **none**.

⛔ **TWO OF THE DESIGN'S THREE STATED GROUNDS ARE FALSE; THE CONCLUSION SURVIVES ON A DIFFERENT ONE.**
- The design (§3.1 Ground 1) cites `vite.config.js:31 computeEngineSharedDomain()` as "the eager set". It is not.
  `EAGER_FIRST_PAINT_MODULES = EAGER_MODULES = computeEagerModuleGraph()` (`:300`, `:309`) — a **different, broader
  walk** seeded from `src/main.jsx` across the whole app. `computeEngineSharedDomain()` (`:31`, `:70`) computes
  `ENGINE_SHARED_DOMAIN`, the `engine-core` chunk rule. **The design tests the wrong graph.**
- *"generators import ZERO `domain/display` files ⇒ display is safe"* — the design's own grep still returns rc=1 at
  `272dbd2da` (**CONFIRMED, zero edges**), but the inference does not follow: `src/domain/display/exportPosture.js`
  is eager anyway, by a path that has nothing to do with generators.
- *"`src/design/**` is outside the walk entirely"* — **FALSE.** `src/design/tokens.js` is eager.

**The sound ground, measured:** every file that would import `arms.js` or `armsKinship.js` is itself **not eager**.
⇒ **W-ARMS adds 0 B to first paint — CONFIRMED, on a measured ground rather than the stated one.**
`deterministicSort.js` being eager is harmless in the direction that matters (a lazy module importing an eager one
adds no eager bytes) — say so in Car 2's brief so nobody stops on it.

**The pin the design prescribes remains correct and executable with no build:** assert neither file appears in
`EAGER_FIRST_PAINT_MODULES` (set size 265 today). ⚠ Write it as an **absence assertion plus a size assertion** —
a bare absence check passes vacuously if the export is ever renamed.

---

### PROBE 3 — the exporter call sites · **CONFIRMED, and this is the lane's sharpest finding**

**Question it answers:** what does the PDF path actually carry, so the liege's quarter can be derived?

**Four PDF export entry points exist. Two thread no campaign at all.** (CONFIRMED, `git grep` + read of each site.)

| # | entry point | what it passes | arms consequence |
|---|---|---|---|
| 1 | `src/components/SettlementDetail.jsx:426` | `campaign` from `resolveExportSeam(liveStore, saveId)` ⇒ `{settlementId, worldState, regionalGraph, settlements: memberSaves, nameById}` | **full** — quarters correctly |
| 2 | `src/components/generate/ExportDraftButton.jsx:64` | `campaign: null`, with a stated reason: *"Unsaved draft: no owning campaign, so no live worldState / faith chapter."* | `no_world` ⇒ borne coat. **Lawful and correct** |
| 3 | **`src/components/settlements/SettlementCard.jsx:115`** | `generateSettlementPDF(s.settlement, { phase: canonPhaseOf(s) })` — **no `campaign` key at all** | `no_world` ⇒ borne coat **even when the settlement IS a campaign member with a standing liege** |
| 4 | **`src/components/SingleDossierSuccessPage.jsx:183`** | `generateSettlementPDF(settlement, { isAnonymous: false })` — **no `campaign` key at all** | same — and this is the **post-purchase download page** |

**`nameById` is NOT the gap the design thinks it is.** `src/components/settlementDetail/resolveExportSeam.js:37-42`
already builds a complete `Record<string,string>` `nameById` from `memberSaves`, deliberately, with an F41 docblock:
*"the campaign payload must be PLAIN CLONEABLE DATA — a nameById map, never a nameFor function."*
`liveWorld.js:130-135` prefers it natively. ⇒ **The design's Car 3 obligation ("thread `nameById`") is ALREADY
DISCHARGED on the one path that threads a campaign at all.**

⛔ **THE REAL EXPOSURE IS A PDF↔PDF DRIFT, NOT THE WEB↔PDF DRIFT §8.3 CHARTERED.** The same settlement, same seed,
same day, exports with **different arms depending on which button the user pressed**: the dossier's own export
button quarters; the Library card's "export frozen" and the post-purchase download do not. Every export is premium
(**CONFIRMED**, `authSlice.js:48-50`: `anon.export:false`, `free.export:false`, `premium.export:true`), so **all
four are paid surfaces**. The design's §8.3 defence — *"an unresolvable name is a typed `unknown_liege` ⇒ the borne
coat"* — is a graceful degradation for a *missing name*; it does not cover a **missing campaign on a settlement that
has one**, which is silent, invisible, and produces a wrong-but-plausible artifact.

**What Car 3's brief must therefore carry** (this replaces the design's name-threading obligation):
either (a) route entry points 3 and 4 through `resolveExportSeam` — a real behaviour change on two paid surfaces,
owner-visible, **not a lane call**; or (b) rule that the arms render **un-quartered on every surface** until (a)
lands, which keeps the four consistent at the cost of the charter's headline capability. **Chair-gated. Do not let a
build lane pick.**

---

### PROBE 4 — the esbuild byte figure · **CONFIRMED, and the design's one named unmeasured cost is 17× its estimate**

`esbuild 0.28.2` from the dock's own `node_modules/.bin` (a **symlink**, not materialised — the symlink hazard is
untouched). All output to stdout; **nothing written anywhere**; porcelain 0 after.

**The design's estimate (§6):** *"arms adds hatch generator (~1.5 KB), vocab tables (~0.7 KB), two serializers
(~1.5 KB), quartering/differencing (~1 KB) ≈ **4–5 KB raw / ~2 KB gz**"*, and *"the adapter's import of
`lineageClaim.js` … is the one cost to MEASURE … PLAUSIBLY marginal."*

**The substrate that already ships** (`--bundle --minify --format=esm`, CONFIRMED):
```
compose.js       raw   6142   bundled+min  6642 B     ← the whole ornament substrate from the header's entry
pools.js         raw   6174   bundled+min  3656 B
emblemPaths.js   raw   3968   bundled+min  1835 B
palette.js       raw   1718   bundled+min   938 B
fnv.js           raw   1534   bundled+min   307 B
```

**The adapter's five imports, tree-shaken one export at a time** (CONFIRMED):
```
parentRefOf only                  80334 B      ⛔
SUBORDINATING_TERM_TYPES           1267 B
treatyOrientationOf only           1132 B
getSpatialLedger only               209 B
compareCodepoint only               104 B
                                  -------
the other four combined            2712 B
```
**`parentRefOf` alone drags 80,334 B minified — 97 % of the adapter's entire import cost.**
Cause, CONFIRMED: `lineageClaim.js:25` `import { lineageReceipt } from './eventProse.js';` and
`eventProse.js` is **64,222 B raw / 83,271 B bundled** — a prose pool the arms have no use for.
(`lineageClaim.js` is **605 lines** — the design's figure holds exactly.)

**Does it cost real bytes?** Static import-closure walk at `272dbd2da` (CONFIRMED):
```
HAS eventProse   HAS lineageClaim   modules= 273  src/pdf/lib/liveWorld.js
HAS eventProse   HAS lineageClaim   modules= 357  src/pdf/SettlementPDF.jsx
HAS eventProse   HAS lineageClaim   modules= 359  src/utils/pdfRender.worker.js
HAS eventProse   HAS lineageClaim   modules=1218  src/components/OutputContainer.jsx
no  eventProse   no  lineageClaim   modules=  25  src/components/dossier/DossierHeaderRow.jsx   ⚠
no  eventProse   no  lineageClaim   modules=  15  src/pdf/sections/Cover.jsx                    ⚠
```
⇒ **The 80 KB is already resident on every path that would call the adapter — but NOT in the closures of the two
files the design picks as call sites.** `Cover.jsx` (15 modules) is the design's own **chair-recommended option (b)**
for the PDF seam; `DossierHeaderRow.jsx` (25 modules) is the web seam. Both are imported by parents that already
carry `eventProse.js`, so Rollup should dedupe within the chunk and the marginal delta should be ≈ 0 — **but that is
a chunk-co-location guarantee, not the import-direction guarantee the design claims, and only a build settles it.**

**OWED (build):** `npm run build`, then the dossier-chunk and `pdfRender.worker` byte deltas, and eager-chunk hash
identity. **Cheap de-risk for Car 2, no build needed:** put the `parentRefOf` call in `armsKinship.js` only, keep
`arms.js` free of it (the design already requires this), and **never** import `armsKinship.js` from a module whose
closure lacks `eventProse.js` unless the build proves the dedupe.

⛔ **REFUSED — the figure the design actually asks for.** *"`npx esbuild --bundle --minify` of a 40-line stub of
`arms.js`"* cannot be honestly measured: `arms.js` does not exist, and a stub I invent measures my stub, not Car 1's
file. The numbers above are the real, existing-file measurements that bear on the same decision. **OWED to Car 1**,
which is the first lane that can run it against real bytes.

---

### PROBE 5 — `wizardNewsAuthoring` line pins · **CONFIRMED CLEAR**

```
$ grep -rn "pools\.js\|DossierHeaderRow\|Cover\.jsx" tests/lint/wizardNewsAuthoring.walker.test.js
(rc=1 — NOT PINNED)
```
Its pinned paths are `src/domain/worldPulse/{peaceTerms,informationStatecraft,supplyWebWarfare,momentum}.js`
(`:122-125`) and `src/store/{mapSlice,campaignWorldPulseDeferred}.js` (`:129,:151`), against
`tests/lint/.wizard-news-authoring-baseline.json`. **None of W-ARMS's three edited files is pinned.**
⇒ Car 1's append-only `pools.js` edit and Car 2/3's `.jsx` edits are clear of this walker. **No line-count-neutrality
constraint applies.**

---

## 3 · B3 — THE RE-MEASURE AT `272dbd2da`

| # | figure the design / plan quotes | recorded | **measured at `272dbd2da`** | status |
|---|---|---|---|---|
| 1 | `docs/samples/organic-craft/ornament/` samples | 16 | **16** | **HOLDS** |
| 2 | `goldenViewModel.test.js.snap` lines | 17 | **17** | **HOLDS** |
| 3 | `public/map/charges/` files | 104 | **104** | **HOLDS** |
| 4 | `public/map/charges/` bytes | 279,799 | **279,799** | **HOLDS** |
| 5 | `src/design/organic/ornament/` file list | 5 (compose, emblemPaths, fnv, palette, pools) | **5, identical** | **HOLDS** |
| 6 | zero heraldry code at the tip | zero | **zero** (`grep -iE "ornament/arms\|armsKinship\|HouseArmsBlock\|CADENCY"` → rc=1) | **HOLDS** |
| 7 | `src/domain/display/` file count | 103 | **103** | **HOLDS** |
| 8 | D1 lighting `files` | 2521 @ `90702c3e9` | **2521** | HOLDS |
| 9 | D1 `parked` | 371 | **371** | HOLDS |
| 10 | D1 `credited` | 2150 | **2150** | HOLDS |
| 11 | **D1 `titles`** | **23178** @ `90702c3e9` | **23184** | ⛔ **DECAYED (+6)** |
| 12 | **D1 `suiteTitles`** | **6213** @ `90702c3e9` | **6214** | ⛔ **DECAYED (+1)** |
| 13 | OSR `total` / `identities` / inventory | 1993 / 1409 / 388 | **1993 / 1409 / 388** | HOLDS |
| 14 | OSR `schema` | 16 | **16** | HOLDS ⚠ see note |
| 15 | OSR `minRows` | 40 | **40** | HOLDS |
| 16 | seven voice ceilings | 34 / 0 / 15 / 382 / 69 / 9 / 770 | **34 / 0 / 15 / 382 / 69 / 9 / 770** | **CEILINGS HOLD** |
| 17 | JSX arm `total` ceiling (not in the seven) | — | **37** | new datum |
| 18 | enforcement-claims ceiling | 6 | **6** | HOLDS |
| 19 | known-failure census `entries` | 6 | **6** (of `CEILING = 17`, `testRatchet.test.js:182`) | HOLDS |
| 20 | **domain-strict typecheck `total`** | **1121** / 75 files | **1120** / 75 files | ⛔ **DECAYED (−1)** |
| 21 | full typecheck | 173 / 38 / resolved 1400 | **173 / 38 / 1400** | HOLDS |
| 22 | **`SHARED_FIELDS` rows** | design §4.2 says **20** | **11** (`PARITY_EXEMPT` = 8) | ⛔ **DECAYED / WRONG** |
| 23 | **`viewModel.js` lines** | 917 | **924** | ⛔ DECAYED |
| 24 | `viewModel.js` heraldry mentions | 0 | **0** | HOLDS (the §4.2 construction proof survives) |
| 25 | `goldenViewModel.test.js` lines | 94 | **94** | HOLDS |
| 26 | `lineageClaim.js` lines | 605 | **605** | HOLDS |
| 27 | `DossierHeaderRow.jsx:55` emblem, `size: 38`, `mode:'field'` | :55 | **:55, exact** | HOLDS |
| 28 | `Cover.jsx:319` `HouseCountersealSeal seed={settlement.name} size={14}` | :319 | **:319, exact** | HOLDS |
| 29 | **`SettlementCard.jsx:144`** medallion `size: 16` | :144 | **:160** (content exact) | ⛔ DECAYED (line only) |
| 30 | `parityContract.js:85` `topExport.label` | :85 | **:85, exact** — but at **`src/domain/display/`**, not `src/pdf/lib/` | HOLDS (path clarified) |
| 31 | `customContentCompile.test.js:116` `'heraldry'` unsupported | :116 | **:116, exact** | HOLDS |
| 32 | **`shippedAssetLicence.test.js:311`** "only CC0 charges may ship" | :311 | **:324** | ⛔ DECAYED (line only) |
| 33 | `THIRD-PARTY-NOTICES.md:286` names the 104 positively | :286 | **:286, exact** | HOLDS |
| 34 | `vite.config.js:309` exports `EAGER_FIRST_PAINT_MODULES` | :309 | **:309, exact** | HOLDS |
| 35 | `EAGER_FIRST_PAINT_MODULES` size | never measured | **265** (a `Set`) | **NEW** |
| 36 | first-paint closure vs RAW ceiling 1,047,000 | design: 1,047,205 (**205 B OVER**); §883/handoff: 268–288 B **UNDER** | ⛔ **NOT MEASURABLE — needs a build** | **OWED** |
| 37 | engine chunk 675,339 B / 675,764 B | — | ⛔ needs a build | **OWED** |
| 38 | §713.2 bit claim 525/525, fence 21/21 | — | ⛔ needs the comparator + a generation corpus | **OWED** |
| 39 | clamp primitive census ceiling | 62 (memory) | **72** | ⛔ DECAYED (context only; the clamp consist landed) |
| 40 | `tests/lint/*.test.js` scanner count | "seven-member family" | **138 files in `tests/lint/`** | context |

**On row 16, "measured == ceiling":** the **ceilings** are CONFIRMED from the census entries. The claim that the
tree currently *sits at* each ceiling is **PLAUSIBLE only** — confirming it needs a `voiceMechanics` run, which this
lane is fenced from. Unchanged from SCOPE-MEASURE's caveat, deliberately not upgraded.

**On row 14, the OSR schema:** 16 at `272dbd2da`. ⚠ **Rung 17 is CLAIMED by the OSR-SCHEMA17 lane.** Wherever the
design or a successor assumes "the next rung is ours", it is not — W-ARMS must land **schema-neutral** (no
migration, `--write` not run, `total` unchanged at 1993). This is already Car 2's STOP; it now has a named
competitor.

**On rows 11/12 — the decay that will recur:** `titles`/`suiteTitles` moved between `90702c3e9` and `272dbd2da`,
one consist apart. This is UB-4 (`FABLE_RETROVALIDATION_QUEUE.md:2280`) firing exactly as recorded: *"Every
remaining landing of this arc moves `src/` … so this will recur at every one of them."* **D1's five figures must be
re-derived at the landing base, never quoted from any plan** — including this one. The live probe and the frozen
baseline agree **exactly** at my base (`files 2521 · parked 371 · credited 2150 · titles 23184 · suiteTitles 6214`
from both `tests/lint/.lighting-census-baseline.json` and `node lighting-probe.mjs`), so the register is in sync
here and the delta a new test file causes is cleanly derivable: **`files` 2521 → 2522**, `parked` unchanged.

---

## 4 · ⛔ A CORRECTION TO MY OWN BRIEF

The brief warns: *"a NEW test file reds THREE censuses: test-ratchet totalFiles, lighting census, known-failure
file list."* **Two of the three are REFUTED at `272dbd2da`** (CONFIRMED):

- `scripts/check-test-ratchet.mjs:97` `SCOPE_FLOOR_RATIO = 0.9`; `:1138` compares
  `totalFiles < Math.floor(baseline.totalFiles * 0.9)` and reds only on **COLLAPSE**. Its own comment calls it
  the "FILE FLOOR". `:1118` is the same shape for `totalTests`. A new test file **RAISES** both and cannot breach
  them. Baseline today: `totalTests 31489 · totalFiles 2468 · skippedCeiling 1`.
- The known-failure list holds **6 entries against `CEILING = 17`** — eleven slots free, and a *passing* new file
  adds no entry at all.

⇒ **Exactly ONE census binds a passing new test file: the lighting census** (`files` +1, plus `credited`/`titles`/
`suiteTitles` motion), joined by the `negativeAssertionAnchor` walker (`SCAN_ROOTS = ['tests']`, `:64`) — which is
the **two-sided trap**: it reds both when a file gains an un-anchored negative *and* when one too many is cured.
This is the same correction memory already carries (*"THE CENSUS IS FULL AT 10/10" IS FALSE*) and SCOPE-MEASURE
records as D-2; the brief re-introduced the stale framing.

---

## 5 · WHAT IS OWED TO A BUILD — exact commands

| # | owed figure | exact command | why it could not run here |
|---|---|---|---|
| O-1 | first-paint closure vs RAW 1,047,000 | `npm run build`, then the closure reporter | build fenced; **and the design's 1,047,205 / "205 B OVER" is doubly stale** (D-11) |
| O-2 | eager chunk hash identity (`kernel`, `engine-core`, `index`, `data`, `vendor-*`) | `npm run build` ×2, diff chunk hashes | build fenced |
| O-3 | dossier-chunk + `pdfRender.worker` byte delta from the adapter | `npm run build` with/without the leaf | build fenced — **this is the probe-4 residual, the one figure that decides whether 80 KB is free** |
| O-4 | §713.2 bit claim 525/525 + espionage fence 21/21 | the standing dormancy comparator at the landing tip | needs the generation corpus; chair-owned at the landing |
| O-5 | "measured == ceiling" on the seven voice arms | `npx vitest run tests/copy/voiceMechanics.test.js` | vitest fenced |
| O-6 | OSR exit 0 with a real `armsKinship.js` | `node scripts/check-observed-shape-readers.mjs` on a dock carrying the file | the file does not exist |
| O-7 | `arms.js` minified bytes | `node_modules/.bin/esbuild --bundle --minify src/design/organic/ornament/arms.js` | the file does not exist — **Car 1 owes this** |
| O-8 | `tests/lint/` whole-directory run | `npx vitest run tests/lint` | vitest fenced; owed by any src-adding car |
