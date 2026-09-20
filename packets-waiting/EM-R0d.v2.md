# EM / EM-R0d — THE BAND LADDERS GET ONE HOME, SO A BAND CHECK CAN READ THE PRODUCER'S OWN TABLE (the re-entry family; built BEFORE EM-R0b)

**Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR — re-verified at version 2's tip `e5bdfd031` as `b90a95b7af484137ecf70bd15cde5054edf66b5db0d9f6e90c974d97b7caa5e1`, E-0)

- **Status:** `DRAFT`
  ⚠ The status value stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line.
- **Packet version:** 2
  **What version 2 changed and why.** The chair ruled on version 1's four open questions (charter,
  "Amendments of 2026-09-19 19:29 EDT — EM-R0d's compile ruled", ODQ §934.47 addendum 29) and the lane
  re-compiled under them at the newer tip `e5bdfd031`. Five things changed. (1) ⭐ **The `src/domain/`
  re-export is GONE** — ruling 2; the packet now creates ONE file, and the placement is re-measured with
  EM-R0b v2's own reader in the overlay: the eager first-paint set and `ENGINE_SHARED_DOMAIN` are
  byte-identical either way (E-1), so the second address was never load-bearing. (2) ⭐ **The food FLAG
  ladder joins the leaf as a SECOND named table** with `foodSecurityFlagsOf`, each table carrying a header
  sentence saying the two are two ladders ON PURPOSE today; the packet reconciles nothing. (3) The worker
  price is re-measured at **+1,801 B** (was +1,657 B; the flag table costs 182 B and the producers shed 38
  B more) — still inside the chair's already-named bound of 3,314 B, which this version keeps rather than
  raising. (4) **Version 1's STOP-1 (tuples vs a named table) and STOP-2 (the rounding trap) are CLOSED**
  by rulings 1 and the EM-R0b v2 instruction; the rounding fact becomes a header sentence and a handoff
  line instead of an open question. (5) The three registers the brief's newest steps name are now
  **executed rather than predicted**: the lighting walker's own `parkReasonsFor`/`classify` over the three
  cured files and over this packet's new test file (E-4), and the wiring census's `stamp.files` (E-5).
- **Verified base:** `__BASE__`
  ⭐ **The chair's revalidation sentence, written here with the measured facts so the stamp is one act:**
  *"Compiled at `ad7ddf2c9` and re-compiled to version 2 at `e5bdfd031` by the same Opus lane (evidence
  D-1…D-16, E-0…E-9). NOT ONE BYTE of `src/generators` or `src/data` moved between those tips
  (`git diff --stat` EMPTY — E-0), so every version 1 measurement holds. The EM-PREAMBLE hash is
  unchanged. The ONE CREATE target is ABSENT and no packet among the manifest's 190 entries reserves any
  change path of this packet except `tests/build/generationWorkerLazy.test.js`, which EM-P3 reserved and
  RELEASED at its landing; the single non-LANDED entry, EM-B3c (READY), touches none of them and nothing
  in the worker's closure (E-7). All nine `requiredSymbols` rows resolve VERBATIM at this tip and every
  one survives this packet's own edits; `retiredSymbols` is EMPTY. ⛔ THE BASE MUST BE STAMPED TO THE
  THEN-TIP: the ceiling TEST row puts `generationWorkerLazy.test.js` in the dispatch substrate, and only
  another packet's own ceiling re-mint could move it — none is queued (E-7). THE BUDGETS: the eager
  first-paint set is BYTE-IDENTICAL, `EAGER_FIRST_PAINT_MODULES` 283 → 283 and `ENGINE_SHARED_DOMAIN`
  68 → 68, and it stays byte-identical with EM-R0b v2's `src/domain/edit/` reader in the graph (E-1);
  the generation worker's static closure goes 220 → 221 and its bundle grows an estimated +1,801 B against
  a ZERO-SLACK ceiling of 1,401,208, inside the chair's named bound of 3,314 B (E-2); the lazy `engine`
  chunk is predicted to SHRINK ~716 B. The lighting census moves by a MEASURED delta (E-4); the
  mutation-coverage manifest does NOT move; the wiring census stamps none of the three producers (E-5);
  the tuning register SHRINKS."*
- **Last revalidated:** `__BASE__` — stamped by the chair at promotion to the then-tip.
- **Depends on:** **NONE.** EM-B3b, EM-P0, EM-P3 and EM-B1d are LANDED; EM-P2 is STALE; EM-B3c (READY)
  shares no path. ⚠ **EM-R0b version 2 depends on THIS packet** and is its first domain reader, importing
  `../../data/bandLadders.js` from `src/domain/edit/recordInvariants.js`. **EM-R0e** (the two play-time
  legitimacy copies) and **FIX-C1** (the Compendium's threshold prose) are both chartered AFTER it.
- **Collision group:** **NONE at the tip** across 190 manifest entries and every waiting packet in the
  chair's kit (E-7). The one path with a history is `tests/build/generationWorkerLazy.test.js`: EM-P3
  reserved it and LANDED, releasing it.
- **Commit authority:** edits only; the chair commits
- **Baseline posture:** **measured, at `ad7ddf2c9`, revalidated at `e5bdfd031`.** Measured by execution:
  each ladder's producer, cut points and comparison operators at every boundary ±1; every other live
  spelling across `src/`; whether each label is computed once or per surface; the emitted-chunk placement
  of every path by `vite.config.js`'s own derivations over a virtual overlay, including EM-R0b v2's
  reader; the byte price of five candidate shapes by esbuild minification of real before/after files; the
  tuning register's P2/P3 counts by the repo's own scanner; the domain→generators ratchet's live edge set;
  ⭐ the lighting walker's own `parkReasonsFor`/`classify` over every test file this packet touches AND
  over its new one; the mutation-coverage set's two halves; the prose-numerics baseline's rows; the
  wiring census's three stamp lists; the observed-shape inventory's per-file identities; the five
  edge-shared bundle closures; the packet validator's `acceptanceCases` shape. Every figure carries its
  command in `EM-R0d.evidence.md`.

---

## 1. Reconciled authority

1. **`docs/DESIGN_EDIT_MODE_AND_DECREES.md` §22.3 item 6** (ODQ §934.47 addendum 25) — *"Band checks read
   THE PRODUCER'S OWN TABLE, so three ladders get a domain-layer home first. … RULED: a new
   golden-neutral member, EM-R0d, exports the three ladders from one domain-layer home the generators
   import (the EM-P3 shape, priced against the zero-slack generation worker by PLACEMENT), built BEFORE
   EM-R0b."* ⭐ **Now in the tree** — the fifth docs fold landed it.
2. ⭐ **`docs/implementation/charters/EDIT-MODE-TRAIN.md`, "Amendments of 2026-09-19 19:29 EDT — EM-R0d's
   compile ruled" (ODQ §934.47 addendum 29)** — the four rulings this version applies:
   *"(1) the NAMED frozen table, not positional tuples — about 600 B is not a reason to choose the form
   nobody can read, and the rise is re-minted with per-module attribution inside the bound and recorded as
   a named, vetoable figure (the ODQ §934.19 family); (2) NO `src/domain/` re-export — ninety-six domain
   files already import `src/data` directly, and `recordInvariants` does the same; (3) the four
   SOURCE-TEXT anchors that retire … are declared TEST rows cured to read the leaf, as the lane drafted;
   (4) its second version is a RESUME of the same lane."* And the instruction this packet must NOT
   pre-empt: *"FOR EM-R0b VERSION 2: the food-security band check takes the record's ROUNDED inputs, so it
   accepts a label that ANY unrounded value within half a unit of the published one would yield."*
3. **`docs/implementation/packets/settlement-editor/EM-P3.md`** (LANDED) §2 and §5.2 — the placement
   precedent and the estate's law, *"THE CURE IS THE PLACEMENT, NEVER THE CEILING"*; and its ruling Q3
   (a read-only ceiling file is never a manifest row).
4. **`EM-B1e.md`** (LANDED) — the golden-neutral refactor whose central claim was byte-identity proved
   through an exported entry point. A6 copies that posture. Its park cause is brief step 14(b)'s lesson.
5. `docs/implementation/PACKET_STANDARD.md`, `EM-PREAMBLE.md` §P1–§P9.
6. Live code and executed evidence at `ad7ddf2c9` and `e5bdfd031` — `EM-R0d.evidence.md`.

Resolved contradictions and measured surprises:

- ⭐⭐ **"ONE DOMAIN-LAYER HOME" TAKEN LITERALLY CHARGES THE FIRST-PAINT BUDGETS, AND TWO INDEPENDENT
  INSTRUMENTS SAY SO.** A leaf under `src/domain/` that the three generators import moves
  `ENGINE_SHARED_DOMAIN` 68 → 69 and `EAGER_FIRST_PAINT_MODULES` 283 → 284, and a generator importing a
  `src/domain` band address takes the eager set to 285 (D-4) — EM-P3's P-20g defect reproduced. That same
  file would also be a NEW `src/domain` file carrying the ten fractional legitimacy multipliers against a
  P3 arm that reads *"SHRINK-ONLY with new files at zero"* (D-7). → **The VALUES live in
  `src/data/bandLadders.js`.** ⭐ **And version 2 removes the second address entirely** (ruling 2): with
  EM-R0b v2's `src/domain/edit/recordInvariants.js` importing the `src/data` leaf directly, the eager set
  and ESD are byte-identical to the base — 283 and 68 (E-1). The re-export bought nothing.
- ⛔⛔ **THE FOOD LADDER IS NOT A ONE-INPUT LADDER, AND ITS OPERATOR DIFFERS.** Measured by executing the
  producer's own source slice (D-3): THREE inputs — `stressFamine`, `deficitPct`, `surplusPct` — and
  STRICT `>` where the other two ladders use `>=`. `Deficit — Active Famine` has no numeric cut and
  `Surplus` is reachable only at `deficitPct <= 5`. → **`foodSecurityBandOf` takes all three, in the
  producer's own evaluation order.** All three are on the record (`hasFamine`, `deficitPct`,
  `surplusPct` — D-3b).
- ⛔⛔ **THE FOOD FLAGS ARE A SECOND LADDER ON DIFFERENT CUTS, AND THEY DISAGREE ON A REAL INTERVAL.**
  Measured: the label says `Import-Dependent` above 15 while the flag says `isPressured` up to 20, so
  every record with `deficitPct ∈ (15, 20]` carries `Import-Dependent` beside `isPressured` — exactly the
  12-row observation EM-R0b recorded without an explanation. → **Version 2 exports the flag ladder as a
  SECOND named table (`FOOD_FLAG_CUTS`, `foodSecurityFlagsOf`) in the same leaf, each table carrying a
  header sentence saying the two are two ladders on purpose today, with the owner's open question named
  (ODQ §934.57's family).** ⛔ This packet reconciles NOTHING: folding them would move the golden.
- ⛔ **THE RECORD'S `deficitPct`/`surplusPct` ARE ROUNDED; THE LABEL WAS CUT FROM THE UNROUNDED VALUES**
  (D-3b). **RULED ELSEWHERE, NOT HERE:** the charter's amendment gives EM-R0b v2 the rule (the band check
  takes the rounded inputs and accepts any label a value within half a unit would yield). → **This leaf
  exports what the generator USES — the unrounded comparison — and its header says so in one sentence.**
- ⛔⛔ **FOUR SOURCE-TEXT ANCHORS RETIRE AND `requiredSymbols` CANNOT SEE ANY OF THEM** (D-8).
  `tests/domain/generalStateProseDesk.test.js` requires the literal `'readiness >= 76 ?'` and
  `"label = 'Deficit — Active Famine'"`; two Compendium drift guards read the producers' source for the
  label strings. → Three declared TEST rows with exact cures (ruling 3); each cure is STRONGER than what
  it replaces, and all three files are **measured CREDITED** by the walker's own logic (E-4).
- ⭐ **`prosperityMod` IS NOT A BAND LADDER AND MUST NOT MOVE** (E-3). Its outer chain cuts the same three
  inputs (40 / 20 / 8 on `deficitPct`, 40 on `surplusPct`, famine first), but each rung's OUTCOME is
  chosen by four further conditions (`_terrainStructural`, `_magicFoodMitigated`, `activeChainsCount >= 3`
  and three granary flags), and what it returns is a prosperity modifier, not a band. Same inputs,
  different quantity. → **Named in §12, not moved.**
- ⭐ **THE RATCHET'S OWN INSTRUCTION EXECUTED.** EM-R0b's measured refusal — importing `legitimacyBandFor`
  from `src/domain/edit/` is a new `src/domain → src/generators` edge — is discharged because the leaf
  moves DOWN a layer to `src/data/`, which the ratchet does not police and which 96 `src/domain` files
  already import directly (D-11). `BASELINE_EDGES` stays at 4 files / 5 edges; this packet adds none and
  removes none.

The implementer does not read other documents to reinterpret this packet.

## 2. Outcome

**Observable result:** the public-legitimacy, defence-readiness and food-security ladders have ONE home —
`src/data/bandLadders.js` — as frozen NAMED tables (`*_CUTS` plus an ordered `*_BANDS`/`*_LABELS` table)
with one tiny total function apiece, plus the food FLAG ladder as its own named table and function. The
three generators call those functions instead of spelling their own chains. `src/domain/edit/**`
(EM-R0b v2) imports the same `src/data` address directly, as 96 domain files already do. **No number,
label, colour, multiplier or comparison operator changes**, so every generated world is byte-identical.

⭐ **THE ADDRESS IS A PRICED DECISION, AND VERSION 2 REMOVES A FILE RATHER THAN ADDING ONE.** The values
must be reachable from `src/generators`, so they sit in `src/data/`. ⛔ No `src/domain` band address
exists: measured, a generator importing one takes the eager first-paint set 283 → 285, and a domain
reader of the `src/data` leaf costs both budgeted graphs exactly nothing (E-1).

**Definition of done:** no cut point of the four ladders is spelled twice inside the generation path, the
goldens do not move, and the domain layer can read each producer's own table by import with no new
layering edge.

In scope:

1. **One primary behaviour:** four ladders as frozen named tables plus four total functions, in one home.
2. **One required integration:** the three producers re-pointed at that home — the legitimacy band, the
   readiness band, the food label chain and the food flag block.
3. **One prevention guard:** the acceptance test's exhaustive and boundary equivalence sweeps (A2/A3/A4)
   plus the three re-pointed drift pins, which red if a ladder is ever re-spelled or drifts.

Explicit non-goals:

- ⛔ **any change to a VALUE, LABEL, COLOUR, MULTIPLIER or OPERATOR.** This packet is a MOVE. A golden that
  moves is a STOP.
- ⛔ **reconciling the food LABEL ladder with the food FLAG ladder**, or either with `prosperityMod`'s
  40/20/8. Three chains, three meanings; the owner's decision point (ODQ §934.57's family).
- ⛔ **the two play-time legitimacy copies** (`rulingPower.js#rebandLegitimacy`,
  `timeProgression.js#reBand`). Priced at −484 B and chartered as **EM-R0e**, after this packet.
- ⛔ **the Compendium's prose thresholds and its missing overall-readiness rungs** — chartered as
  **FIX-C1**, a parallel lane after this lands. Only the two drift GUARDS are re-pointed here.
- ⛔ **`recordInvariants`, the merge, the class register, the corpus ratchet** — EM-R0b / R0a / R0c / R7.
- Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. Hard scope budget

| Limit | Packet budget |
|---|---:|
| Behavior families | `1` |
| New persisted record families · Named state writers · Feature flags · User-facing surfaces | `0` |
| Direct consumers | `3` at landing (the three producers); EM-R0b v2 is the first domain reader |
| New logic-bearing production leaves | `1` — `src/data/bandLadders.js` (four total functions) |
| Existing logic-bearing production files modified | `3` — ⚠ **EXACTLY AT THE CAP.** A fourth is a STOP AND SPLIT, which is why §2 refuses the two play-time copies |
| Additional registration-only files | `0` |
| Ceiling-bearing test files | `1` — `generationWorkerLazy.test.js`, **constant + comment only**. `vendorPdfLazy.test.js` is READ, never edited, and is not a manifest row (EM-P3 ruling Q3) |
| Handwritten files total | `9` (was 10 in version 1; ruling 2 removed one) — the cap is 12 |
| New/changed effective production lines | `≤ 140` |
| Effective lines per new leaf | `≤ 90` (`src/data/bandLadders.js`) — the cap is 250 |
| Delta in a shared/hot file | `n/a` — **NO hot file is named**, and none of the three producers carries a `scripts/.size-baseline.json` entry (D-12) |
| Acceptance cases | `8` — the standard's cap is 8, and each is a `{id, case}` OBJECT (E-6) |
| ⭐ Generation-worker byte delta | **`+1,801 B` by per-file minification of the real before/after files (E-2); bound `3,314 B` — the figure the chair NAMED BEFORE IT WAS SPENT, kept rather than re-raised, with 1,513 B of room** |
| ⭐ First-paint delta | **`0` — `EAGER_FIRST_PAINT_MODULES` 283 → 283, `ENGINE_SHARED_DOMAIN` 68 → 68, and unchanged again with EM-R0b v2's reader in the graph (E-1)** |
| ⭐ Lazy-engine delta | **predicted `−716 B`, a SHRINK** — the ladder text leaves `src/generators/**` (chunk `engine`) for `src/data/**`, which `vite.config.js:885` routes elsewhere. READ and quoted, never edited |
| ⭐ data-lazy delta | `+~2,517 B` against `DATA_LAZY_RAW_CEILING_BYTES = 3_098_110` over EM-P3's measured ~939,520 |

Overrides approved before dispatch: `NONE`.

⚠ **THE WORKER RISE IS NAMED BEFORE IT IS SPENT** (the chair, ruling 1). +1,801 B estimated is structural,
not wasteful: turning seven inline chains into four exported frozen tables costs `min:` keys, freeze
wrappers and four function bodies the chains did not have, and the producers shed only 716 B in exchange.
⭐ The estimate is known to overstate — EM-P3 priced +206 B by this method and its real build measured
+80 B (0.39×). The build lane re-mints inside the bound with per-module attribution; the chair records the
measured figure as a named, vetoable rise in the ODQ §934.19 family.

⚠ **IDENTITY POSTURE: byte-identical output.** Every cut, operator, label, colour, multiplier, evaluation
order and returned key order is preserved exactly. `generatorGoldenMaster.test.js` and
`dossierProseManifest.test.js` do not appear in §7 and must not move. The proof is **A6**; A2/A3/A4 make
it constructive.

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-R0d
```

Expected: `src/data/bandLadders.js` ABSENT; the three MODIFY targets and the four TEST targets clean;
every `requiredSymbols` row resolving verbatim. Any mismatch makes this packet STALE.

**Read dry, check by check against `scripts/implementation-session.mjs`:**

| check | verdict once the chair stamps the base to the then-tip |
|---|---|
| status is READY | the chair's promotion supplies it |
| manifest validates | PASSES — 9 change rows, every action in `PACKET_ACTIONS`; 8 acceptance cases as `{id, case}` objects (E-6); no duplicate change path across 190 packets (E-7) |
| branch matches the capsule | the build lane holds the integration branch in ITS worktree; the chair stays detached |
| base is an ancestor of HEAD | PASSES — the base IS the then-tip |
| substrate unchanged since base | **SHORT-CIRCUITS** (`head === verifiedBase`). ⛔ From an older base it FAILS: the substrate check excludes CREATE rows, so the ceiling TEST row puts `generationWorkerLazy.test.js` in the substrate. ⭐ **Only another packet's own ceiling re-mint could move it, and none is queued** (E-7: the one non-LANDED entry, EM-B3c, touches none of this packet's paths and nothing in the worker's closure) |
| capsule names every substrate path | PASSES |
| CREATE target absent and Git-clean | PASSES — ABSENT at the tip |
| non-CREATE targets Git-clean | PASSES on a clean lane worktree |

⚠ **`tests/build/domainGeneratorsBoundary.test.js` and `tests/build/vendorPdfLazy.test.js` ARE NOWHERE IN
§7.** The first is a `checks` command and a `requiredSymbols` row; the second is read and quoted only. A
row for a file the build is expected not to edit makes the landing's path receipt ambiguous (EM-P3 Q3).

## 5. Verified tree contract

### 5.1 ⭐ THE FOUR LADDERS, MEASURED BY EXECUTION AT EVERY BOUNDARY ±1

| ladder | producer (path#symbol) | exported? | cut points | operator | inputs | evidence |
|---|---|---|---|---|---|---|
| public legitimacy | `src/generators/factionDynamics.js#legitimacyBandFor` | ⭐ YES | `75 · 60 · 45 · 30` | `>=` CLOSED below | ONE — `score`, integer 0..100 | D-3 |
| defence readiness | `src/generators/defenseGenerator.js` — `computeDefenseReadiness`, module-local `const` | ⛔ NO | `76 · 55 · 38 · 24 · 12` | `>=` CLOSED below | ONE — `readiness`, integer 0..100 | D-3 |
| food security, the LABEL | `src/generators/foodGenerator.js` — an inline chain in `generateFoodSecurity` | ⛔ NO | `40 · 15 · 5` on `deficitPct`, `40` on `surplusPct` | **`>` OPEN below**, famine first | **THREE** | D-3 |
| food security, the FLAGS | `src/generators/foodGenerator.js`, the `Stress flags` block | ⛔ NO | `20 · 5` on `deficitPct`, `40` on `surplusPct` | `>` / `<=` | THREE | D-3 |

Labels, in ladder order, exactly as the producers emit them:
`Endorsed · Approved · Tolerated · Contested · Legitimacy Crisis` ·
`Fortress · Well-Defended · Defensible · Lightly Defended · Vulnerable · Undefended` ·
`Deficit — Active Famine · Deficit · Import-Dependent · Pressured · Surplus · Secure`.

**The measured disagreement, pinned rather than cured:** `deficitPct ∈ (15, 20]` labels
`Import-Dependent` beside `isPressured`. **Where each label is computed:** readiness ONCE at generation;
legitimacy THREE times (generation + two play-time copies → EM-R0e); food ONCE and never re-graded.

⛔ **`prosperityMod` IS NOT A FIFTH LADDER** (E-3): the same three inputs, cuts 40/20/8 and 40, but four
further conditions choose each rung's outcome and the outcome is a prosperity modifier, not a band. It
stays exactly where it is.

### 5.2 The rest of the verified contract

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Ladder 1 | `src/generators/factionDynamics.js` | `export function legitimacyBandFor` | the band chain, both multiplier ternaries and all six flags, all spelling the four cuts | Body re-pointed. ⛔ The export and its signature are PRESERVED |
| The cross-ladder join | `src/generators/factionDynamics.js` | `export const DEFENSE_CONTRIB` | keyed by the SIX readiness labels; its comment *"readiness 24-37"* is CONFIRMED correct | ⛔ READ ONLY |
| Ladder 2 | `src/generators/defenseGenerator.js` | `const computeDefenseReadiness = (scores, threat, tier, magicExists = true) =>` | `return { score: readiness, ...band }` puts `label, color, background, border` INTO the record, so those names and their ORDER are golden-bearing | Body re-pointed. ⛔ The declaration line is PRESERVED |
| Ladders 3 and 4 | `src/generators/foodGenerator.js` | `export function generateFoodSecurity` | the label chain and the `Stress flags` block; the record publishes `deficitPct`/`surplusPct` ROUNDED and `hasFamine` raw (D-3b) | Both re-pointed. ⛔ The export is PRESERVED; ⛔ the flag spread sits exactly where the four inline keys sat (E-2) |
| ⛔ Source-text pin 1 | `tests/domain/generalStateProseDesk.test.js` | `function readinessLabels()` | `mustExtract(body, 'readiness >= 76 ?', …)` + a 900-char window matched for `/label: '([^']+)'/g`, asserting 6. File measured **CREDITED**, 70 titles (E-4) | **THE ANCHOR IS DELETED.** Cure in §7 |
| ⛔ Source-text pin 2 | `tests/domain/generalStateProseDesk.test.js` | `function foodLabels()` | `mustExtract(body, "label = 'Deficit — Active Famine'", …)` + `/^\s*label = '([^']+)';$/gm`, asserting 6 unique | **THE ANCHOR IS DELETED.** Cure in §7 |
| ⛔ Drift guard 1 | `tests/ui/compendiumFoodSecurity.test.jsx` | `test('every rung name is a real foodGenerator label (drift guard)')` | `readFileSync(foodGenerator.js)` then `src.includes(name)` for six rungs. Measured **CREDITED**, 3 titles (E-4) | **REDS.** Cure in §7 |
| ⛔ Drift guard 2 | `tests/ui/compendiumPower.test.jsx` | `test('the Public Legitimacy ladder rung names are the real factionDynamics labels')` | `readFileSync(factionDynamics.js)` then ``src.includes(`'${name}'`)`` for five. Measured **CREDITED**, 3 titles (E-4) | **REDS.** Cure in §7 |
| The helper both pins use | `tests/helpers/sourceContract.js` | `export function mustExtract` | GV-1 (LANDED) holds a `requiredSymbols` row on it | ⛔ NOT EDITED — only two call sites move |
| Layering ratchet | `tests/build/domainGeneratorsBoundary.test.js` | `const BASELINE_EDGES` | 4 files / 5 edges; a per-file arm reds on any NEW importer, a second arm reds on a STALE entry | ⛔ READ ONLY. A8 asserts it |
| Worker ceiling | `tests/build/generationWorkerLazy.test.js` | `export const WORKER_BUNDLE_CEILING_BYTES` | `= 1401208` — EM-P3's exact mint; ZERO slack. Its dist arms are `describe.runIf(DIST_EXISTS)`, so **without `VERIFY_DIST=1` the ceiling arm SILENTLY SKIPS** | §7's TEST row; §8 step 9 |
| Lazy engine / data-lazy / first paint | `tests/build/vendorPdfLazy.test.js` | the engine, data-lazy and closure arms | ⛔ **READ, NEVER EDITED.** `engine < 679_000`, last measured 677,935 B; `DATA_LAZY_RAW_CEILING_BYTES = 3_098_110` over ~939,520 | §8 step 9.7 READS and QUOTES both |
| Chunk routing | `vite.config.js` | `manualChunks` | `'/src/generators/' → 'engine'` (`:862`); `'/src/data/'` falls to `data`/`data-lazy` (`:885`) — why the engine shrinks | ⛔ READ ONLY |
| Shape precedent | `src/domain/display/defenseScoreBands.js` | `export const SCORE_BAND_CUTS` | the estate's own cut-point table, whose header explains why an OBJECT not scalars (the tuning register's P2) and why not `*_TUNING` (P1's trigger) | Copy exactly; the `*_CUTS` naming is its |
| Test precedent | `tests/domain/powerStateProseDesk.test.js` | `it('every label legitimacyBandFor can emit is a DS-POW-1 pool key, and covers the ladder')` | already walks `0..100` through the REAL producer | Copy this proof shape for A2 |
| Golden posture | `tests/property/generatorGoldenMaster.test.js` · `tests/property/dossierProseManifest.test.js` | — | Neither appears in §7 | UNCHANGED; motion is a STOP |

Forbidden alternatives:

- ⛔⛔ **NO `src/domain` BAND ADDRESS MAY EXIST** (ruling 2). Not a re-export, not a barrel, not a type-only
  shim. Measured: a domain reader of the `src/data` leaf costs both budgeted graphs zero (E-1), and a
  GENERATOR importing a `src/domain` address takes the eager first-paint set 283 → 285 (D-4).
- ⛔⛔ **THE VALUES MAY NOT LIVE UNDER `src/domain/`** — the eager set goes 283 → 284, AND a new
  `src/domain` file carrying the ten fractional multipliers reds the tuning register's P3 arm (D-7).
- ⛔ **POSITIONAL TUPLE ENTRIES ARE REFUSED** (ruling 1). They measured ~600 B cheaper and the chair ruled
  that is not a reason to choose the form nobody can read. The named frozen table stands.
- ⛔ **NO CUT, LABEL, COLOUR, MULTIPLIER OR OPERATOR MAY CHANGE**, and no number may be spelled twice:
  `*_BANDS` entries reference `*_CUTS`, and `FOOD_FLAG_CUTS.pressured`/`.surplus` reference
  `FOOD_SECURITY_CUTS` rather than re-spelling `5` and `40`.
- ⛔ **THE TWO FOOD LADDERS ARE NOT RECONCILED.** `FOOD_FLAG_CUTS.deficit` stays `20`, the label's stays
  `15`, and both tables carry the header sentence naming the owner's open question.
- ⛔ **`prosperityMod` DOES NOT MOVE** and none of its cuts joins the leaf (E-3).
- ⛔ **NO CEILING RAISED TO MAKE ROOM.** `EM-PREAMBLE.md` §P7. The worker constant is re-minted ONLY under
  §8 step 9, inside §3's bound, after attribution. `vendorPdfLazy.test.js` is never edited.
- ⛔ **NO SECOND WALKER** — the four existing pins are re-pointed, never replaced by a new instrument.
- ⛔ **THE ACCEPTANCE TEST MAY NOT LIVE IN `tests/generators/`** (an `ENFORCER_DIR`), may not gain a
  `NAME_PATTERN` token in its basename, and ⛔ **may never bind `it`, `test` or `describe` a second time**
  — not as a variable, not as a parameter (brief step 14(b); EM-B1e parked whole on exactly that).
- ⛔ **NO EDIT TO** `src/domain/rulingPower.js`, `src/domain/timeProgression.js`,
  `src/domain/compendium/bandLadders.js`, `compendiumData.generated.js`, either golden, or any register by
  hand.
- no new top-level `worldState` key; no persisted shape; no flag; no PRNG; no clock; no store; no files
  outside the manifest.

## 6. Exact contracts

```js
// src/data/bandLadders.js — THE SETTLEMENT BAND LADDERS, ONE HOME.
// Frozen NAMED tables plus one total function each. No import. Pure: no branch on anything
// but its own arguments, no PRNG, no clock, no locale, no store, no I/O.
// ⛔ THIS IS THE ONLY ADDRESS. There is no src/domain re-export: 96 domain files already import
//    src/data directly, and one generator edge into a src/domain band address would put this
//    leaf into the EAGER first-paint closure (measured 283 -> 285).
// ⚠ THE NUMBERS ARE THE ONES THE GENERATOR COMPARES, UNROUNDED. The record publishes
//    deficitPct and surplusPct rounded; the label was cut from the raw values. A checker that
//    re-runs these functions over the published numbers must tolerate that (EM-R0b v2's rule).
// ⚠ 'Vulnerable' and 'Contested' also name bands of OTHER ladders over OTHER quantities
//    (src/domain/state/bands.js, src/domain/qualitativeBands.js). Homonyms, not duplicates.

/** Public legitimacy, 0..100. CLOSED below: score >= cut. */
export const LEGITIMACY_CUTS = Object.freeze({ endorsed: 75, approved: 60, tolerated: 45, contested: 30 });

/** HIGHEST FIRST. The last entry is the floor and matches every remaining score. */
export const LEGITIMACY_BANDS = Object.freeze([
  { min: LEGITIMACY_CUTS.endorsed,  label: 'Endorsed',          color: '#1a5a28', bg: '#f0faf4', govMultiplier: 1.30, crimMultiplier: 0.75 },
  { min: LEGITIMACY_CUTS.approved,  label: 'Approved',          color: '#4a7a2a', bg: '#f4faf0', govMultiplier: 1.15, crimMultiplier: 0.90 },
  { min: LEGITIMACY_CUTS.tolerated, label: 'Tolerated',         color: '#a0762a', bg: '#faf8ec', govMultiplier: 1.00, crimMultiplier: 1.00 },
  { min: LEGITIMACY_CUTS.contested, label: 'Contested',         color: '#8a4010', bg: '#fdf6ec', govMultiplier: 0.80, crimMultiplier: 1.15 },
  { min: -Infinity,                 label: 'Legitimacy Crisis', color: '#8b1a1a', bg: '#fdf4f4', govMultiplier: 0.60, crimMultiplier: 1.30 },
]);
/** @param {number} score @returns {typeof LEGITIMACY_BANDS[number]} Total; never null. */
export function legitimacyBandOf(score) {
  for (const band of LEGITIMACY_BANDS) if (score >= band.min) return band;
  return LEGITIMACY_BANDS[LEGITIMACY_BANDS.length - 1];
}

/** Overall defence readiness, 0..100. CLOSED below: readiness >= cut. */
export const READINESS_CUTS = Object.freeze({ fortress: 76, wellDefended: 55, defensible: 38, lightlyDefended: 24, vulnerable: 12 });
export const READINESS_BANDS = Object.freeze([
  { min: READINESS_CUTS.fortress,        label: 'Fortress',         color: '#1a4a2a', background: '#f0faf2', border: '#a8d8b0' },
  { min: READINESS_CUTS.wellDefended,    label: 'Well-Defended',    color: '#1a3a6a', background: '#f0f4fa', border: '#a8c0d8' },
  { min: READINESS_CUTS.defensible,      label: 'Defensible',       color: '#5a6a1a', background: '#f4f8ec', border: '#b8d0a8' },
  { min: READINESS_CUTS.lightlyDefended, label: 'Lightly Defended', color: '#7a5010', background: '#faf6ec', border: '#e0c880' },
  { min: READINESS_CUTS.vulnerable,      label: 'Vulnerable',       color: '#8a3010', background: '#fdf8ec', border: '#e8c080' },
  { min: -Infinity,                      label: 'Undefended',       color: '#8b1a1a', background: '#fdf4f4', border: '#e8c0c0' },
]);
/** @param {number} readiness @returns {typeof READINESS_BANDS[number]} */
export function readinessBandOf(readiness) {
  for (const band of READINESS_BANDS) if (readiness >= band.min) return band;
  return READINESS_BANDS[READINESS_BANDS.length - 1];
}

/** FOOD SECURITY — THE LABEL LADDER. OPEN below (> cut), famine first, surplus last.
 *  ⚠ TWO LADDERS ON PURPOSE TODAY: the FLAG table below cuts the same number differently
 *  (deficit at 20, not 15), so deficitPct in (15, 20] labels Import-Dependent beside
 *  isPressured. The owner has been asked whether to unify them (ODQ §934.57's family).
 *  ⛔ NOTHING HERE RECONCILES THEM — folding them would move the golden. */
export const FOOD_SECURITY_CUTS = Object.freeze({ deficit: 40, importDependent: 15, pressured: 5, surplus: 40 });
export const FOOD_SECURITY_BANDS = Object.freeze({
  famine:          { label: 'Deficit — Active Famine', color: '#8b1a1a', bg: '#fdf4f4' },
  deficit:         { label: 'Deficit',                 color: '#8b1a1a', bg: '#fdf4f4' },
  importDependent: { label: 'Import-Dependent',        color: '#8a3010', bg: '#fdf0e8' },
  pressured:       { label: 'Pressured',               color: '#7a5010', bg: '#faf8e8' },
  surplus:         { label: 'Surplus',                 color: '#1a5a28', bg: '#f0faf4' },
  secure:          { label: 'Secure',                  color: '#2a6a38', bg: '#f4fbf6' },
});
/** @param {boolean} stressFamine @param {number} deficitPct @param {number} surplusPct */
export function foodSecurityBandOf(stressFamine, deficitPct, surplusPct) {
  if (stressFamine) return FOOD_SECURITY_BANDS.famine;
  if (deficitPct > FOOD_SECURITY_CUTS.deficit) return FOOD_SECURITY_BANDS.deficit;
  if (deficitPct > FOOD_SECURITY_CUTS.importDependent) return FOOD_SECURITY_BANDS.importDependent;
  if (deficitPct > FOOD_SECURITY_CUTS.pressured) return FOOD_SECURITY_BANDS.pressured;
  if (surplusPct > FOOD_SECURITY_CUTS.surplus) return FOOD_SECURITY_BANDS.surplus;
  return FOOD_SECURITY_BANDS.secure;
}

/** FOOD SECURITY — THE FLAG LADDER, the SECOND ladder over the same three numbers.
 *  Its `pressured` and `surplus` cuts ARE the label ladder's (referenced, never re-spelled);
 *  its `deficit` cut is its own 20. See the note above: two ladders on purpose today. */
export const FOOD_FLAG_CUTS = Object.freeze({
  deficit: 20, pressured: FOOD_SECURITY_CUTS.pressured, surplus: FOOD_SECURITY_CUTS.surplus,
});
/** Key order is the record's own and is golden-bearing. @returns {{isDeficit:boolean, isPressured:boolean, isSecure:boolean, isSurplus:boolean}} */
export function foodSecurityFlagsOf(stressFamine, deficitPct, surplusPct) {
  return {
    isDeficit:   deficitPct > FOOD_FLAG_CUTS.deficit || stressFamine,
    isPressured: deficitPct > FOOD_FLAG_CUTS.pressured && deficitPct <= FOOD_FLAG_CUTS.deficit,
    isSecure:    deficitPct <= FOOD_FLAG_CUTS.pressured && surplusPct <= FOOD_FLAG_CUTS.surplus,
    isSurplus:   surplusPct > FOOD_FLAG_CUTS.surplus,
  };
}
```

```js
// src/generators/factionDynamics.js — the export, its signature and its returned key ORDER
// are preserved exactly; only the derivation moves.
import { LEGITIMACY_CUTS, legitimacyBandOf } from '../data/bandLadders.js';

export function legitimacyBandFor(score) {
  const { label, color, bg, govMultiplier, crimMultiplier } = legitimacyBandOf(score);
  return {
    label, color, bg, govMultiplier, crimMultiplier,
    isEndorsed:          score >= LEGITIMACY_CUTS.endorsed,
    isApproved:          score >= LEGITIMACY_CUTS.approved,
    isTolerated:         score >= LEGITIMACY_CUTS.tolerated && score < LEGITIMACY_CUTS.approved,
    isContested:         score >= LEGITIMACY_CUTS.contested && score < LEGITIMACY_CUTS.tolerated,
    isLegitimacyCrisis:  score <  LEGITIMACY_CUTS.contested,
    governanceFractured: score <  LEGITIMACY_CUTS.contested,
  };
}
```

```js
// src/generators/defenseGenerator.js — inside computeDefenseReadiness, the band ternary only.
// ⛔ The returned key order (score, label, color, background, border) is GOLDEN-BEARING.
import { readinessBandOf } from '../data/bandLadders.js';
  const band = readinessBandOf(readiness);
  return { score: readiness, label: band.label, color: band.color, background: band.background, border: band.border };
```

```js
// src/generators/foodGenerator.js — the label chain AND the flag block.
// ⛔ The spread sits exactly where the four inline keys sat, before hasFamine/hasSiege, and
//    foodSecurityFlagsOf returns them in the record's own order.
import { foodSecurityBandOf, foodSecurityFlagsOf } from '../data/bandLadders.js';
  const { label, color, bg } = foodSecurityBandOf(stressFamine, deficitPct, surplusPct);
…
    // Stress flags
    ...foodSecurityFlagsOf(stressFamine, deficitPct, surplusPct),
    hasFamine:        stressFamine,
    hasSiege:         stressSiege,
```

### Absence rules

- **Every band function is TOTAL and never returns null, undefined, or throws.** A non-number, `NaN`, a
  negative number and `Infinity` all resolve: the guard is `>=`, false for `NaN`, so the floor entry is
  returned — exactly what the producers' `else` branch did.
- `legitimacyBandOf`/`readinessBandOf` take ONE number; `foodSecurityBandOf`/`foodSecurityFlagsOf` take
  the producer's THREE, in its own order. ⛔ A second signature or an options bag is STOP-1.
- Returned band objects are shared members of a frozen container. ⛔ **No caller mutates one**; every
  caller destructures or spreads.

### Ordering, determinism, lifecycle

- **Order is load-bearing four times over.** `*_BANDS` arrays are HIGHEST-FIRST because the scan returns
  the first match, as the `if/else` chains did. The food chain's order (famine, deficit, import-dependent,
  pressured, surplus, secure) is preserved verbatim. `foodSecurityFlagsOf`'s four keys are returned in the
  record's own order. And `defenseGenerator`'s returned key order `score, label, color, background,
  border` is what the record carries and the golden hashes.
- Hash/fork key `NONE`; no PRNG; no rounding introduced or removed; no clock, locale or environment read.
- **Lifecycle:** module load, frozen. Read-only. Never persisted, never projected, never in a save. Every
  lifecycle column is `n/a` — this packet introduces no state.
- Flag: `NONE`. Golden posture: **UNCHANGED**. Alignment: `DECLARED EMPTY.`
  Edit story: `ENGINE-ONLY: this packet relocates a derivation; the DM sees nothing change.`

### Receipts and privacy

No receipt shape changes, no DM-only field, no veil obligation: every value already appears on the record
exactly as it does today.

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/data/bandLadders.js` | `LEGITIMACY_CUTS`, `LEGITIMACY_BANDS`, `legitimacyBandOf`, `READINESS_CUTS`, `READINESS_BANDS`, `readinessBandOf`, `FOOD_SECURITY_CUTS`, `FOOD_SECURITY_BANDS`, `foodSecurityBandOf`, `FOOD_FLAG_CUTS`, `foodSecurityFlagsOf` | `≤ 90` | §6 verbatim. **Import nothing.** One `Object.freeze` per container, **not per entry** (measured: per-entry freezing costs 165 B of a zero-slack ceiling). Every `min` references its `*_CUTS` field and `FOOD_FLAG_CUTS.pressured`/`.surplus` reference `FOOD_SECURITY_CUTS`; ⛔ no number is spelled twice. The header carries the four sentences of §6: the one-address rule, the UNROUNDED comparison, the two-ladders-on-purpose note with ODQ §934.57 named, and the `Vulnerable`/`Contested` homonyms. |
| `MODIFY` | `src/generators/factionDynamics.js` | `legitimacyBandFor` | `≤ 20` net | §6. Export, signature, returned keys and their ORDER preserved exactly. ⛔ Touch nothing else — `DEFENSE_CONTRIB`, `legitimacyDefScale`, `safetyContrib`, `foodContrib`, `computePublicLegitimacy` are untouched. |
| `MODIFY` | `src/generators/defenseGenerator.js` | the `band` expression inside `computeDefenseReadiness` | `≤ 10` net | §6. ⛔ The declaration line is PRESERVED verbatim; ⛔ the returned key ORDER is golden-bearing. |
| `MODIFY` | `src/generators/foodGenerator.js` | the label chain; the `Stress flags` block | `≤ 20` net | §6. The four inline flags become ONE spread of `foodSecurityFlagsOf(...)` in the same position. ⛔ `prosperityMod`'s chain (cuts 40/20/8) is NOT touched and none of its numbers joins the leaf (E-3). |
| `TEST` | `tests/domain/bandLadders.test.js` | cases A1–A8 | `n/a` | The acceptance home. **EIGHT straight-line literal `it`s under ONE literal `describe`** — measured CREDITED with `titles 8 · suiteTitles 1` by the walker's own `classify` before a line is written (E-4). ⛔ **Never bind `it`, `test` or `describe` a second time — not a variable, not a parameter.** No `.each`, no loop-generated registration, no nesting, no conditional. Every negative assertion carries `// anchored:` on the line above. ⛔ Not `tests/generators/`; no `NAME_PATTERN` token in the basename. |
| ⛔ `TEST` | `tests/domain/generalStateProseDesk.test.js` | `readinessLabels()`, `foodLabels()` | `≤ 12` net | **THE CURE FOR TWO DELETED SOURCE-TEXT ANCHORS.** `readinessLabels()` returns `READINESS_BANDS.map((b) => b.label)`; `foodLabels()` returns `Object.values(FOOD_SECURITY_BANDS).map((b) => b.label)`, both imported from `src/data/bandLadders.js`. ⛔ The two `it` titles, the six-label and sorted-six expectations, and the `length !== 6` guards are KEPT. ⛔ **No `it` is added or removed** — the file is CREDITED (E-4), so a title here would count. `mustExtract` keeps its other call sites. |
| ⛔ `TEST` | `tests/ui/compendiumFoodSecurity.test.jsx` | `test('every rung name is a real foodGenerator label (drift guard)')` | `≤ 8` net | **THE CURE.** Replace the `readFileSync` of `foodGenerator.js` with an import of `FOOD_SECURITY_BANDS`. ⚠ The Compendium's top rung is `Active Famine` and the producer's is `Deficit — Active Famine`, so the arm compares by `label.includes(name)` — the relation `src.includes(name)` had by accident, stated on purpose. ⛔ Title unchanged; no `test` added. |
| ⛔ `TEST` | `tests/ui/compendiumPower.test.jsx` | `test('the Public Legitimacy ladder rung names are the real factionDynamics labels')` | `≤ 8` net | **THE CURE.** Replace the `readFileSync` of `factionDynamics.js` with an import of `LEGITIMACY_BANDS`; assert the five rung names EQUAL `LEGITIMACY_BANDS.map((b) => b.label)` as arrays, in order — a strict upgrade on `src.includes`. ⛔ Title unchanged; no `test` added. |
| ⭐ `TEST` | `tests/build/generationWorkerLazy.test.js` | `WORKER_BUNDLE_CEILING_BYTES` | **`≤ 3,314 B` of growth** | **THE CHARTER'S CEILING ROW.** Zero slack; this packet's four worker-closure modules add a measured **+1,801 B** (E-2), inside the bound the chair NAMED BEFORE IT WAS SPENT. ⛔ Constant + dated attribution comment ONLY; no arm added, removed or retitled. **Growth past `1,401,208 + 3,314 = 1,404,522 B`, or any FIFTH module in the attribution, is a STOP.** ⚠ Run with `VERIFY_DIST=1` or the ceiling arm silently skips. |

Generated artifacts: `NONE`. **No path this packet touches is in any edge-shared bundle closure** (D-12),
so none of the SEVEN generated paths is owed. ⭐ **No declared `checks` command is a GENERATOR** — every
one is `npx vitest run` on files this manifest already names, so brief step 14(a)'s ordering rule has
nothing to order; the goldens nonetheless run LAST so a moved golden is the final word.

No other file may be edited.

**Predicted register moves, priced here rather than discovered at the terminal:**

| Register | Moves? | Predicted delta | Door |
|---|---|---|---|
| Lighting census | **YES — MEASURED, not predicted** | `files +1 · credited +1 · parked +0 · titles +8 · suiteTitles +1`, taken by running the walker's own `classify` over this packet's test-file skeleton (E-4). The three cured files add **no** title and are each measured CREDITED, so `titles +0` from them is a measurement too. ⛔ **No absolute tuple is restated**; the chair stamps the live baseline at promotion | A named interior red; re-derived whole at the terminal, by the chair |
| ⭐ Tuning register | **YES — A SHRINK** | `factionDynamics.js` P3 `48 → 38` (the ten fractional multipliers leave; 48 measured by the repo's own scanner). `defenseGenerator.js` 46 and `foodGenerator.js` 63 unchanged — their cuts are integers, which the detector does not match. `src/data` is outside `TREES_P2P3`; the leaf is not a P1 `*_TUNING` table | none — a shrink needs no door |
| Mutation-coverage | **NO** | `tests/domain` and `tests/ui` are not `ENFORCER_DIRS`; `bandLadders.test.js` matches no `NAME_PATTERN` token. ⚠ Two traps recorded: `tests/generators/` IS an enforcer dir, and `…contract/walker/golden/pin.test.js` all match |
| Prose-numerics | **NO** | none of the three modified files carries a row among the register's 218 `{path,line,…}` entries, so the line-addressed hazard cannot bite |
| ⭐ Wiring census | **NO — MEASURED** | `docs/content/wiring-census.json`'s `stamp.files` holds SEVEN entries, all `src/domain/display/stateProse/**`; none of the three producers is stamped, and neither `candidateLeaves` nor `producerIndexFiles` names one (E-5). **Not a change-manifest row and no re-take is owed** — EM-P3's `stale-bytes` red cannot repeat here |
| Observed-shape readers | **PRICED, RED-FIRST** | no property read of a settlement object is added — the leaf takes scalars. Live rows: `defenseGenerator.js` 4 identities, `factionDynamics.js` 2, **`foodGenerator.js` none, so its ceiling is 0**. Evidence, not proof | §8 steps 1 and 10: scan before and after, **STOP for the chair** on any new identity. ⛔ The lane never mints |
| Writer-reach | **NO** | the single writer of each field is unchanged; a reader can only shrink the dark set, and a shrink is the chair's `--write` |
| ⭐ Bundle ceilings | **YES — the WORKER only** | `+1,801 B` predicted, `≤ 3,314 B` bounded | §8 step 9: a real `npm run build` through the exclusive mutex + per-module attribution, in the form `91d5f155b` used |
| First paint · size-baseline · decision-fork · mechanism-coverage · edge-shared | **NO** | zero, each measured |

## 8. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch. **Re-run D-11's live-edge scan and D-8's four
   source-text anchor greps.** A moved ratchet set, or a FIFTH anchor, is a STOP and a re-compile.
1. **Capture the baselines, RED FIRST.** `node scripts/check-observed-shape-readers.mjs --report` at the
   base; the live lighting tuple from a throwaway `git archive` probe outside the worktree; the four test
   files GREEN with their printed counts.
2. Add the failing arms for A1–A8 against a module that does not exist yet.
3. Create `src/data/bandLadders.js` — §6 verbatim, header included. ⛔ Transcribe every value from the
   producers' own source and diff each against the producer before deleting anything.
4. Re-point `factionDynamics.js`, then `defenseGenerator.js`, then `foodGenerator.js` (the label chain
   AND the flag block) at `../data/bandLadders.js`.
5. ⭐ **Run A6 NOW, before the test cures** — both goldens green on the production change alone. A golden
   that moves here is a STOP and the reason is in a producer edit, not in a test.
6. Cure the three existing test files in this order: `generalStateProseDesk.test.js`,
   `compendiumFoodSecurity.test.jsx`, `compendiumPower.test.jsx`. ⛔ No `it`/`test` added or removed.
7. No registration is owed beyond §7's table. ⛔ The wiring census is NOT touched (E-5).
8. Run focused verification (§10).
9. ⭐ **THE CEILING STEP.**
   1. `npm run build` through the exclusive mutex on this tip, and a CONTROL build at the verified base
      in its own detached worktree with `npm ci` from the committed lockfile — both the same way (the
      kit's wrapper reads main-graph chunks a constant 742 B low).
   2. Per-module attribution (`tools/attrib.config.mjs`) over BOTH builds, sweeping every emitted chunk.
   3. ⛔ **Only this packet's own four modules may have moved** — `src/data/bandLadders.js` (new) and the
      three producers (all down). A FIFTH module anywhere is a **STOP for the chair**.
   4. Growth against §7's bound (`≤ 3,314 B`; predicted +1,801 B, and the method overstated EM-P3 2.6×).
      Over the bound is a **STOP**.
   5. Re-mint `WORKER_BUNDLE_CEILING_BYTES` to the EXACT measured bundle with a dated attribution comment
      in the form `91d5f155b` used: W-before, W-after, the delta, the moved modules with their rendered
      lengths at both ends, the module count at both ends, and what the bytes ARE. ⭐ The rise rides the
      standing conditional ruling and the chair's ruling 1; the chair records the figure in the ODQ
      §934.19 family as a named, vetoable rise. **The receipt states the named buy-backs in order:**
      EM-R0e's two play-time copies (−484 B) and a leaf-side buy-back inside `bandLadders.js`.
   6. **Prove the arm is not vacuous:** constant minus 1 reds with the printed figure; restore; re-run.
   7. ⛔ **READ, DO NOT EDIT, `tests/build/vendorPdfLazy.test.js`.** Read and QUOTE the emitted
      `engine-<hash>.js` size against `< 679_000` with the ~700 B margin intact. **Predicted: a ~716 B
      SHRINK from 677,935.** ⛔ **If the engine GREW, the chunk routing is not what §5.2 measured — STOP
      for the chair, no edit.** Quote the data-lazy and first-paint arms too; both predicted green.
   8. `VERIFY_DIST=1` on both build test files after the restore, and `npx eslint` on the one edited
      ceiling file.
10. ⭐ **THE REGISTER STEP.** Re-run the observed-shape scan. Any new finding identity is a **STOP for the
    chair** with the identities quoted — do not mint, do not rename a variable to dodge the heuristic.
11. Write the completion receipt, quoting A2/A3/A4's sweep counts, both goldens, the four test files'
    before/after counts, the worker figures and the engine size read.

Bounded algorithm (every band function):

```text
1. Walk the ladder's entries in declared order (HIGHEST cut first).
2. The first entry whose `min` the input is >= is the band. Return it.
3. If none matched — NaN, a non-number, a value below every cut — return the LAST entry, the
   floor, which is exactly what the producers' `else` branch returned.
   The two food functions are their producer's own if-chains, unchanged in order and operator,
   because three inputs and a strict `>` are not a one-column ladder.
```

## 9. Acceptance matrix

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | THE SHAPE | the five exported tables | every `*_BANDS` entry's `min` is `===` the `*_CUTS` field it names or `-Infinity`; `FOOD_FLAG_CUTS.pressured/.surplus` are `===` `FOOD_SECURITY_CUTS`'; every container is frozen; the label lists equal §5.1's, in order; **each cut point appears exactly ONCE in the file's text** | `tests/domain/bandLadders.test.js` |
| A2 | ⭐ EXHAUSTIVE EQUIVALENCE, LEGITIMACY AND READINESS | every integer `0..100` | `legitimacyBandOf(s).label` equals `legitimacyBandFor(s).label` and every flag matches the pre-move predicate spelled in the test; `readinessBandOf(n).label` equals the label `computeDefenseReadiness({all five = n}, 'heartland', 'city', true)` returns. **Both producers' scores are integers in `0..100`, so 101 values is a COMPLETE proof** | same |
| A3 | ⭐ BOUNDARY EQUIVALENCE, THE FOOD LABEL LADDER | each of the four label cuts at `cut - 0.0001`, `cut`, `cut + 0.0001`, × famine on/off, × a surplus above and below 40 | `foodSecurityBandOf(...)` returns the label the pre-move chain returned — 40 cases — and the STRICT `>` is asserted at every cut (a `>=` would flip `deficitPct === 40`) | same |
| A4 | ⭐⭐ THE TWO FOOD LADDERS ARE DIFFERENT ON PURPOSE | the same boundary grid through `foodSecurityFlagsOf` | every flag equals the pre-move inline predicate; **and the measured disagreement is PINNED — `deficitPct ∈ (15, 20]` yields label `Import-Dependent` with `isPressured` true and `isDeficit` false** — so a later "cure" that folds the two reds HERE first, with ODQ §934.57 named in the message | same |
| A5 | TOTALITY AND ABSENCE | `NaN`, `undefined`, `null`, `-1`, `Infinity`, `'75'` | every band function returns the FLOOR band (and the flag function a total object) and never `null`, `undefined` or a throw | same |
| A6 | ⭐ IDENTITY / GOLDEN | the 525-row corpus | `generatorGoldenMaster` and `dossierProseManifest` **do not move**. Run BEFORE the test cures (§8 step 5) so a move is attributable to a producer edit alone | `tests/property/generatorGoldenMaster.test.js` (run, not edited) |
| A7 | ⭐ THE PRODUCERS SPELL NO CUT OF THEIR OWN | the three producers' source text | none of the three files contains any of the twelve cut literals in a comparison any more, and `prosperityMod`'s `40/20/8` chain is asserted STILL PRESENT and untouched. **Copy `generalStateProseDesk.test.js`'s `src()` idiom** — this is the anchor that replaces the two this packet deletes | same |
| A8 | THE ONE ADDRESS, AND THE LAYERING BOUNDARY | the live import graph and edge scan | `src/domain/bandLadders.js` **does not exist**; every importer of the ladder imports `src/data/bandLadders.js`; no file under `src/generators/` imports any `src/domain` band address (with the measured 283 → 285 consequence in the failure message); and the live `src/domain → src/generators` edge set equals `BASELINE_EDGES` (4 files / 5 edges) | same, plus `tests/build/domainGeneratorsBoundary.test.js` (run, not edited) |

Rows for lifecycle, privacy, persistence and dormancy are **omitted, not replaced**: nothing is persisted,
projected, flagged or made absent.

## 10. Verification commands

```sh
npx eslint src/data/bandLadders.js src/generators/factionDynamics.js \
  src/generators/defenseGenerator.js src/generators/foodGenerator.js \
  tests/domain/bandLadders.test.js tests/domain/generalStateProseDesk.test.js \
  tests/ui/compendiumFoodSecurity.test.jsx tests/ui/compendiumPower.test.jsx
npm run typecheck:ratchet
npm run typecheck:domain:strict

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/bandLadders.test.js \
  tests/domain/generalStateProseDesk.test.js tests/domain/powerStateProseDesk.test.js \
  tests/domain/defenseStateProseDesk.test.js --maxWorkers=2
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/ui/compendiumFoodSecurity.test.jsx \
  tests/ui/compendiumPower.test.jsx --maxWorkers=2
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/generators/isolatedTrade.test.js \
  tests/generators/foodVariance.test.js --maxWorkers=2
# A8 — the layering proof. Run, never edited.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/build/domainGeneratorsBoundary.test.js --maxWorkers=2
# A6 — the identity proof, LAST. It must be GREEN, not re-recorded. ⛔ UPDATE_GOLDEN is never set.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/property/generatorGoldenMaster.test.js \
  tests/property/dossierProseManifest.test.js --maxWorkers=2

# ⭐ THE REGISTER STEP (§8 steps 1 and 10) — report mode NEVER writes the baseline.
node scripts/check-observed-shape-readers.mjs --report

# ⭐ THE CEILING STEP (§8 step 9). The build takes the EXCLUSIVE mutex itself.
npm run build                 # this tip, and a CONTROL build at the verified base
node tools/attrib.config.mjs  # per-module rendered-length attribution, both builds
VERIFY_DIST=1 GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run tests/build/generationWorkerLazy.test.js \
  tests/build/vendorPdfLazy.test.js --maxWorkers=2
npx eslint tests/build/generationWorkerLazy.test.js   # the ONLY edited ceiling file

node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-R0d
npm run check:tail
```

⚠ **`sh scripts/gate-mutex.sh --run` GIVES UP AFTER 40 POLLS AND EXITS 0** — a gate line with no printed
test count DID NOT RUN. ⛔ **`VERIFY_DIST=1` is load-bearing**: without it the ceiling arm is
`describe.runIf(DIST_EXISTS)` and silently skips. ⭐ **No declared `checks` command is a generator**, so
nothing re-stamps a declared path mid-chain.

Expected: every command exits `0`. No named red except the lighting census's delta (§7) and the ONE
deliberate, restored red of §8 step 9.6. Report actual counts; do not copy historical counts.

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and `EM-PREAMBLE.md` §P8, stop if:

- the dispatch seal is missing, invalid, or belongs to another worktree state; resume reports authority,
  HEAD, foreign-work or receipt-integrity drift;
- ⭐⭐ **STOP-1 — THE WORKER RISE.** The real build's growth exceeds §7's `3,314 B` bound, or the
  attribution shows a fifth module moving. ✅ *Version 1's shape question is CLOSED by ruling 1: the named
  frozen table, not positional tuples.*
- ⭐ **STOP-2 — A SECOND SIGNATURE.** Any pressure to give a band function an options bag, a tolerance, a
  rounding step, a second record, or a `deficitPct`-only food overload. ✅ *Version 1's rounding question
  is CLOSED: the charter gives EM-R0b v2 the rule (the band check takes the record's rounded inputs and
  accepts any label a value within half a unit would yield). This leaf exports the UNROUNDED comparison
  the generator uses and says so in its header.* ⛔ **Do not round inside this leaf to help a consumer.**
- ⛔ **STOP-3 — RECONCILIATION.** Any change that folds the food FLAG cuts into the LABEL cuts, or either
  into `prosperityMod`'s 40/20/8. Three chains, three meanings; the owner's decision point (ODQ §934.57).
  A4 is the pin that makes a quiet fold red.
- **STOP-4** — a FOURTH existing logic-bearing production file needs modifying (§3 is at the cap of 3).
  The two play-time legitimacy copies are **EM-R0e's**, not a quiet fourth row.
- **STOP-5** — either golden moves, or `domainGeneratorsBoundary.test.js` reds, or the lazy `engine` chunk
  GREW instead of shrinking;
- **STOP-6** — the observed-shape scan gives any file a new finding identity (§8 step 10);
- **STOP-7** — a FIFTH source-text anchor on any of the three producers is found at §8 step 0 that §7 does
  not already carry a cure for;
- ⭐ **STOP-8 — A PARKED TEST FILE.** If `tests/domain/bandLadders.test.js` classifies as PARKED (run the
  walker's own `parkReasonsFor`), the promised `credited +1 · titles +8` lands as `parked +1 · titles +0`
  and §7's register row is wrong. The measured cause is almost always a second binding of `it`, `test` or
  `describe`. Fix the file, never the register row.

Do not edit the packet, broaden the manifest, repair unrelated gate failures, or continue into the next
wave.

## 12. Completion receipt

⭐ **THE COMPLETION COMMIT NAMES EXACTLY THESE NINE PATHS AND NO OTHER** (`git show --stat HEAD` read back
before the receipt is written; a commit without an explicit pathspec sweeps stale deletions in):

```
src/data/bandLadders.js                          (CREATE)
src/generators/factionDynamics.js                (MODIFY)
src/generators/defenseGenerator.js               (MODIFY)
src/generators/foodGenerator.js                  (MODIFY)
tests/domain/bandLadders.test.js                 (TEST)
tests/domain/generalStateProseDesk.test.js       (TEST — the two cured extractors)
tests/ui/compendiumFoodSecurity.test.jsx         (TEST — the cured drift guard)
tests/ui/compendiumPower.test.jsx                (TEST — the cured drift guard)
tests/build/generationWorkerLazy.test.js         (TEST — the ceiling constant + its comment)
```

⛔ `tests/build/vendorPdfLazy.test.js`, `tests/build/domainGeneratorsBoundary.test.js` and
`docs/content/wiring-census.json` are **READ and quoted, never staged.** Any of them in the stat is a STOP.

- Base SHA:
- ⭐ **The worker rise, quoted:** W-before `______` B · W-after `______` B · delta `______` B (bound
  3,314 B; predicted +1,801 B, a method that overstated EM-P3 2.6×) · modules moved:
  `src/data/bandLadders.js` `new → _____`, `factionDynamics.js` `_____ → _____`,
  `defenseGenerator.js` `_____ → _____`, `foodGenerator.js` `_____ → _____` · module count at both ends
  `_____` · `engine-<hash>.js` read at `______` B against `< 679_000` (predicted a ~716 B SHRINK from
  677,935) · data-lazy `______` · the eager first-paint set (predicted byte-identical at 283).
  **Named buy-backs if the rise is challenged:** EM-R0e's two play-time copies (−484 B) and a leaf-side
  buy-back inside `bandLadders.js`.
- Dispatch bundle and seal identity:
- Final commit or working-tree state:
- Exact changed files and effective-line deltas:
- Acceptance cases:
- Focused commands, exits, and counts (⚠ each with its own printed test count):
- A2/A3/A4's sweep counts (101 legitimacy · 101 readiness · 40 label boundary · 40 flag boundary):
- The four test files' printed counts, before and after the cures:
- ⭐ `tests/domain/bandLadders.test.js`'s `parkReasonsFor` verdict (predicted `[]` → CREDITED,
  `titles 8 · suiteTitles 1`):
- Observed-shape reader scan, before and after:
- Lighting census tuple, measured in a throwaway probe:
- Tuning register P3 for `src/generators/factionDynamics.js`, before and after (predicted 48 → 38):
- Sealed per-step receipt and exact-state resume status:
- Both typecheck configurations:
- Wave-end gate stages actually executed:
- Base-versus-wave failure identity diff:
- Dormancy/golden result (⛔ `UPDATE_GOLDEN` is never set):
- Generated artifacts: `NONE`
- Deviations: `NONE | STOP`
- Out-of-scope observations, with the CHAIR'S FATE for each (nothing is deferred):
  1. **The legitimacy ladder's two play-time copies** (`rulingPower.js#rebandLegitimacy`,
     `timeProgression.js#reBand`) → **EM-R0e**, chartered after this packet, ~484 B back, measured
     against the pulse goldens.
  2. **The Compendium spells all three ladders' cuts in prose derived from nothing, and documents no rungs
     for the overall readiness ladder** → **FIX-C1**, a parallel lane after this lands: the Compendium's
     threshold prose is generated from the leaf.
  3. **`rulingStructure.js:733-744` assigns five readiness labels from institutions with no score** →
     handed to **EM-R0b v2** as a measurement: which producer's label lands on
     `defenseProfile.readiness.label`.
  4. **The food FLAG ladder cuts at 20 where the LABEL cuts at 15, and a third chain cuts at 40/20/8** →
     **THE OWNER'S DECISION POINT**, asked with the food card's other two questions (ODQ §934.57). A4 is
     the pin that keeps a quiet fold honest until then.
  5. **`Vulnerable` and `Contested` are each two ladders' words** → **CLOSED**: homonyms, named in the
     leaf's header.
  6. **`prosperityMod` is a chooser, not a ladder** (E-3) — same three inputs, four further conditions, a
     prosperity modifier rather than a band. **Measured and left exactly where it is**; A7 asserts it is
     still present and untouched.
  7. **`deficitPct`/`surplusPct` are published rounded while the label was cut from the raw values** →
     **RULED FOR EM-R0b v2** by the charter; this leaf exports the unrounded comparison and says so.
- Judgment calls (compile lane, version 2, each vetoable):
  1. **Kept the chair's named bound of 3,314 B** rather than re-raising it to the brief's
     estimate-×2 (3,602 B) after the flag table took the estimate to +1,801 B. The bound the chair named
     before the price was spent still covers it with 1,513 B of room.
  2. **Put the FLAG ladder in the same leaf as a second named table** rather than a second file: it is
     the same three inputs and the same producer, the header states the divergence, and a second file
     would have cost another module in a zero-slack worker.
  3. **`FOOD_FLAG_CUTS.pressured` and `.surplus` REFERENCE `FOOD_SECURITY_CUTS`** rather than re-spelling
     `5` and `40` — the two ladders genuinely share those two cuts; only `deficit` differs.
  4. **Refused to move `prosperityMod`** on the measurement at E-3, and asserted it untouched in A7 so a
     later lane cannot quietly harvest its numbers into a band leaf.
  5. **Made A4 a PIN on the measured disagreement**, so the owner's eventual ruling has to pass through a
     red that names ODQ §934.57 rather than through a silent edit.
