# FIX-D9 — the measurement, written BEFORE the first edit

**Lane:** FIX-D9 (Opus PARALLEL BUILD). **Chair:** Fable 5.1, session a9df403c.
**Worktree:** `$SP/lane-fix-d9`, branch `fix-dead-generators-2026-09-20`, cut at `6a3e8089f`.
**Stamp (from `date` in the same call as the last measurement):** `Sun Sep 20 09:05:28 EDT 2026`.
**Goldens before the first edit:**
- `generator-golden-master.json` `7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e`
- `dossier-prose-manifest-golden.json` `921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41`

**Instruments (all plain `node`/`git`, no gate, no build):** `graph.mjs` (TOOL-12's, copied),
`importers.mjs`, `closure.mjs`, `esd.mjs`, `eager.mjs`, `citations.mjs` — all in
`$SP/lane-fix-d9-scratch/`.

---

## 1. TOOL-12's zero: REPRODUCED, and widened

`graph.mjs` at this tip: `src modules 2247; manualChunks=='engine' 111`. Its own arm prints

```
== ENGINE MEMBERS NOT IN generateSettlementPipeline's STATIC CLOSURE (3) ==
  src/generators/density/densityAscension.js      static importers: NONE   dynamic importers: NONE
  src/generators/density/successionGrammar.js     static importers: NONE   dynamic importers: NONE
  src/generators/density/titularSuccession.js     static importers: NONE   dynamic importers: NONE
```

`importers.mjs` widens the question past `src/` — **5,297 files over `src`, `tests`, `e2e`,
`scripts`, `api`, `supabase`**, resolving static `import`/`export … from`, dynamic `import()`,
`require()` and the `vi.mock`/`vi.importActual` family by RESOLVED PATH:

| module | static | dynamic | mock | the one importer |
|---|---|---|---|---|
| `src/generators/density/densityAscension.js` | 1 | 0 | 0 | `tests/generators/densityLaw.test.js` |
| `src/generators/density/successionGrammar.js` | 1 | 0 | 0 | `tests/generators/densityLaw.test.js` |
| `src/generators/density/titularSuccession.js` | 1 | 0 | 0 | `tests/generators/densityLaw.test.js` |
| `src/domain/region/foldTradeCategories.js` | 1 | 0 | 0 | `tests/domain/foldTradeCategories.test.js` |

**All four have exactly one importer, and every one of them is a test file.** Zero in `src/`,
`e2e/`, `scripts/`, `api/`, `supabase/`. In this doc's own Section-2 vocabulary all four are
**tested-but-unconsumed**.

## 2. Emitted anywhere? No — proved by the entry closure, not by name-survival

Name-grep over the chair's dist copy (`dist-ec0a30da2`, **726** emitted `.js` assets):
`foldTradeCategories` 0 files · `planSeatAscension` 0 · `titularSuccession` 0 ·
`successionGrammar` 0. Controls: `tradeCategoryLabelOf` 1 file, `customSupplyChainActivation`
3 files, so the grep is non-vacuous.

⚠ A minified bundle may mangle a name, so the grep alone is weak evidence. `closure.mjs`
settles it structurally: Rollup emits only what an ENTRY reaches. Over all **seven** build
entries (`src/main.jsx` from `index.html:95`, and the six worker entries —
`advanceInterval`, `customContentPreview`, `generation`, `townSceneExport`, `townScene`
under `src/workers/`, plus `src/utils/pdfRender.worker.js`, which is NOT under `src/workers`),
following static AND dynamic edges:

```
entries 7; REACHABLE from some entry 2005; src .js/.jsx modules unreachable: 248 of 2247
  src/generators/density/densityAscension.js   REACHABLE FROM ANY ENTRY: false   manualChunks(): "engine"
  src/generators/density/successionGrammar.js  REACHABLE FROM ANY ENTRY: false   manualChunks(): "engine"
  src/generators/density/titularSuccession.js  REACHABLE FROM ANY ENTRY: false   manualChunks(): "engine"
  src/domain/region/foldTradeCategories.js     REACHABLE FROM ANY ENTRY: false   manualChunks(): null
```

Non-vacuity controls all `true`: `customContentSchema.js`, `generateSettlementPipeline.js`,
`customSupplyChainActivation.js`. (The reachable set of 2005 includes 6 non-`.js/.jsx`
resolutions — five `.css` files and `foundry-module/scripts/markdownEscape.js` — which is why
2247 − 2005 = 242 while the unreachable module roster is **248**. The roster is the honest figure.)

**⛔ 248 of 2,247 `src/` modules are reachable from no build entry at all.** This lane's four
are four of them; the other 244 are noticed and not touched (§6).

## 3. `foldTradeCategories.js` — the excision row is a NO-OP, and the module was SUPERSEDED

`esd.mjs` transcribes `computeEngineSharedDomain()` verbatim from `vite.config.js:31-69`:

```
ENGINE_SHARED_DOMAIN (derived, pre-excision): 68 members
== EXCISION ROWS THAT DELETE NOTHING ==
  NO-OP  /src/domain/region/foldTradeCategories.js
  1 of 18 excision rows are no-ops at this tip
foldTradeCategories in the DERIVED closure: false
```

So TOOL-12's item 8 resolves cleanly: it is **not** "co-located somewhere unexamined". It is in
no chunk because no entry reaches it, and its `ENGINE_SHARED_DOMAIN_EXCISIONS` row
(`vite.config.js:177`) deletes a fragment the derivation no longer contains.

**Why the row exists, from history.** ESD is seeded from `src/generators/**`, so the module was
a genuine ESD member while a GENERATOR imported it:

- `d855b58fc8` (§14, 2026-06-08) created the module **and its importer**, `src/generators/steps/generateEconomy.js:26`.
  That is the membership `vendorPdfLazy.test.js:339` records FP-G7 excising on 2026-07-15.
- `c1ea091f7a` ("Generation remediation") **removed that import** and replaced the call with
  `projectOwnedCustomTradeDirection` (`src/domain/content/customTradeEndpointProjection.js`),
  which is wired today at `generateEconomy.js:167,178` and takes the old input under the
  parameter name **`legacySatisfies`**.

**The §14 feature still ships** — `generateEconomy.js:304-316` still writes
`customCategoryExports`/`customCategoryImports`, read by `customTradeLabelOwnership.js:77-78`,
`settlementContentProvenance.js:235-236` and `pdf/lib/viewModelBodySlices.js:68-69`. What died is
this module, not the behaviour. Its successor is named, in the tree, and tested elsewhere.

⛔ Consequence for its test: `tests/domain/foldTradeCategories.test.js` (7 `it`s) asserts a
**dead copy** of logic that no longer ships. It is green and it proves nothing about the product.

## 4. The three density modules — a LANDED LAW BEHIND AN UNSIGNED DIAL

They are not abandoned code. Each is the un-wired half of Register VII, whose dial is OFF by
the owner's own design:

- `src/domain/density/densityBands.js:60-63` — `REGISTER_VII_SIGNATURE = Object.freeze({ signed: false, live: false })`
- `src/domain/density/densityLaw.js:98-101` — `NEW_SETTLEMENT_DENSITY_LAW_VERSION` derives from that pair, so it is
  `DEFAULT_DENSITY_LAW_VERSION` = **1**, against `REGISTER_VII_DENSITY_LAW_VERSION` = **2**.
- `densityAscension.js:105` guards on `rollsRegisterVii(config)` FIRST and returns
  `declined('dormant_law')`. **Even if wired today it would draw nothing**, by construction.

The law's own architecture names all three as seams: `applyDensityLaw.js:41` cites §810.6 R21's
*"birth · growth · ascension — one law, never three"*; birth is built, ascension is
`densityAscension.js`. `titularSuccession.js` is R22's reading half and `successionGrammar.js`
R23/R24/R25's deciding half, each quoting the owner's words in its header.

**Live obligations each one carries (a deletion would break these, not free them):**

| module | obligation | address |
|---|---|---|
| `successionGrammar.js` | the **named promotion path** for the R25 mutation plant | `scripts/mutation-coverage-manifest.json`, the `tests/generators/densityLaw.test.js` rationale |
| `titularSuccession.js` | an **EXPECTED disposition row** in the `.npcs`-reader census, with "the packet that wires it owes the raw-base disposition" | `tests/domain/roadsParticipation.test.js:440` (EM-B1k2 §13 Q1 option (a)) |
| `titularSuccession.js` | cited **twice by line** as the estate's own evidence that `densityRungRole` is written and unread | `scripts/lib/writer-dark-register.mjs:112`, `:340` — both spell `titularSuccession.js:29` |
| all three | content-addressed rows (`sha256` + `size`) in the observed-shape register | `scripts/.observed-shape-readers-baseline.json`, manifests `executionTree`/`scanTree`/`sourceTree` |
| all three | rows in the tuning inventory | `tests/lint/.tuning-inventory.json` |

**Is a packet chartered to wire them?** Measured: **no.**
- `EDIT-MODE-TRAIN.md:273` named `densityAscension.js` as EM-P1's "named mint site", but
  `:300` and `:303` record RECON-ID's outcome: EM-P1 **WITHDRAWN**, and "the wrong mint site …
  CLOSED with the decision not to mint".
- The wiring is named only in prose — `docs/FABLE_VALIDATION_QUEUE.md:7660` twice says "until
  **the wiring car**" — and `git grep "TE-DENSITY-1" -- docs/implementation/charters` returns
  **nothing**. The car has a name and no charter.

## 5. ⭐ THE DARK TRIO IS CHARGING FIRST PAINT — measured, and the obvious check is circular

`ENGINE_SHARED_DOMAIN` is seeded by walking **every file under `src/generators/`**
(`vite.config.js:60-61`), not the reachable graph. And `computeEagerModuleGraph()` then
**seeds itself from ESD** (`vite.config.js:290`). So "is it in `EAGER_FIRST_PAINT_MODULES`?"
answers itself: a dark generator's domain import is eager BECAUSE it is in ESD.

⚠ This lane checked the circular way first and got `true` for both modules below. `eager.mjs`
re-runs BOTH derivations verbatim with the trio skipped:

```
ESD post-excision   now 51   without the dark trio 49
EAGER_FIRST_PAINT   now 268  without the dark trio 266

== MODULES THAT LEAVE FIRST PAINT IF THE DARK TRIO GOES (2) ==
   9476 B  src/domain/density/factionLifecycle.js
  25924 B  src/domain/spatial/cohesionWeave.js
  TOTAL 35400 B of SOURCE (624 lines)
```

`titularSuccession.js` is the **sole generator importer** of both (`factionLifecycle.js` has 2
importers, the other being `factionDensityKernel.js`, which is not a generator and is itself not
first-paint; `cohesionWeave.js` has 18, of which 17 are non-generator).

- **CONFIRMED:** the config's own two derivations move `51 → 49` and `268 → 266`, and the two
  named modules are the whole delta.
- **PLAUSIBLE, NOT CONFIRMED:** that emitted first-paint BYTES fall. This lane ran no build.
  35,400 B is SOURCE, minified far smaller, and both modules have live consumers so they would
  still be emitted — they would leave `engine-core` (eager) for wherever Rollup co-locates them.
  The honest claim is *"two modules are pinned into the eager first-paint set by three modules
  nothing can reach"*, not a byte figure.

## 6. The mutation-coverage row at `:253` — rationale CONFIRMED, not corrected

The row's sentence is *"PROMOTION PATH, NAMED: plant the R25 scale-down breach in
`src/generators/density/successionGrammar.js` — it needs no other lane's file and so cannot red
a neighbouring train."* Measured: that file has **zero** `src/` importers and exactly one test
importer. The claim is true, and true more strongly than it is written. **Left byte-identical**,
per the brief.

⛔ Noticed: a plant in a module imported by nothing but its own test can only ever be killed by
that one file, which is a weaker plant than the sentence implies. Recorded, not acted on.

## 7. Blast radius of the permitted edit (a header comment line), measured before taking it

- **`scripts/` citations are GATE-WIRED WITH NO BASELINE** (`sourceCitationIntegrity.shared.mjs:18`,
  `CODE_TREES = ['src','tests','scripts']`). `writer-dark-register.mjs` cites
  `titularSuccession.js:29` twice. ⇒ **the header line must go BELOW line 29 in that file.**
  Placement chosen for all three: the LAST line of the module's header docblock, immediately
  above the first `import` (`densityAscension.js:45`, `successionGrammar.js:106`,
  `titularSuccession.js:69`).
- **No max-lines ratchet:** none of the four has a row in `scripts/.size-baseline.json`.
- **No citation baseline row:** `tests/lint/.source-citation-baseline.json` contains none of
  `EM-B1f`, `EM-B1k2`, `densityAscension`, `titularSuccession`.
- **Pre-edit CONTROL** (`citations.mjs`, the shipped detector, walker wiring copied verbatim):
  `codeFiles 5208 · docs.live 484 · stats.seen 919 · codeEof 0 · docsEof 51 · NOVEL docsEof 0 ·
  NOVEL codeEof 0` and **FINDINGS NAMING THIS LANE'S FOUR FILES: 0**. Re-run after the edit must
  match.
- ⚠ **`scripts/.observed-shape-readers-baseline.json` is content-addressed** (`sha256` + `size`)
  over all three density modules. Its drift classifier (`provenanceDriftOf`,
  `check-observed-shape-readers.mjs:2632-2662`) only reports a `sourceTree` byte change for
  files **absent from `scanTree`**; all three ARE scanned, so a comment byte is absorbed by the
  scan rather than classified as drift, and a comment adds no reader and no identity. **To be
  EXECUTED, not assumed**, by `node scripts/check-observed-shape-readers.mjs` before and after.

---

## The disposition this measurement supports

| module | disposition | why |
|---|---|---|
| `src/generators/density/densityAscension.js` | **DARK-BY-DESIGN** | §810.6 R21's third caller; gated by an unsigned, unlit `REGISTER_VII_SIGNATURE`; guards `dormant_law` first |
| `src/generators/density/successionGrammar.js` | **DARK-BY-DESIGN** | §810.8 R23/R24/R25; same gate; holds the named R25 mutation-plant promotion path |
| `src/generators/density/titularSuccession.js` | **DARK-BY-DESIGN** | §810.7 R22; same gate; already census-dispositioned at `roadsParticipation.test.js:440` |
| `src/domain/region/foldTradeCategories.js` | **RETIRE-PROPOSED** | superseded by `projectOwnedCustomTradeDirection` at `c1ea091f7a`; behaviour still ships from the successor; its test asserts a dead copy; its ESD excision row is a no-op |

⛔ **The DARK-BY-DESIGN rows carry an EMPTY packet slot** — the brief's form asks for "the packet
cited" and there is none to cite. That is the owner's decision point, raised with §934.70.
