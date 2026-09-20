# EM-B3a — PRE-PROOF REPORT to the chair

> ## ▲ DELTA — the chair's rulings B3a-1 … B3a-3, executed (packet version 3)
>
> All three rulings are **cured in the three scratch files**, no gate run, path law kept. I
> re-measured each ruling's premise before editing; **all three hold** (evidence §E29).
> **You were right and I missed it:** version 2's §11 carried
> *"EM-B2 has not landed, so no writer of either key exists"* as a STOP. That is inverted, and a
> build lane dispatched today would have stopped on the packet's own text. Design §12.4 reads
> **"RULING (lane B, before any surface)"** verbatim at `:155`, and the charter puts
> **EM-B3a in EM-T3** (`:28`) against **EM-B2a in EM-T6** (`:31`).
>
> ### Sites changed for B3a-1 (the veil-first sweep) — eleven, all listed
>
> | # | Site | Change |
> |---|---|---|
> | 1 | Header `Depends on` | now **`EM-B3b` (LANDED) alone**; "that is the whole dependency list" |
> | 2 | Header — **new line** `Depended on by` | `EM-B2a` (the layer's writer) and `EM-C1` (the registry's writer), with the ruling, the §12.4 citation and the T3-vs-T6 measurement |
> | 3 | Header `Collision group` | sequence `B2 → B3b → B3a → B4` ⇒ **`B3b (done) → B3a → B2a → C1 → B4`**; the sibling list marks EM-B2 "since split into B2a/B2b" |
> | 4 | §1 K3 | mint owed by **EM-B2a** (the charter's EM-T6 row names it) and EM-C1, "both land AFTER this packet, which is the correct order" |
> | 5 | §2 non-goals "The writer" | EM-B2a's, "and they land AFTER this packet"; adds "its correctness does not depend on the writer existing" |
> | 6 | §2 non-goals, exemptions mint | "earned by B2a and C1, both later" |
> | 7 | §3 budget row | "0 (EM-B2a and EM-C1 mint them, both LATER)" |
> | 8 | §5 "Sole writer" row | retitled **"Future sole writer — NOT a dependency"**; records what will come, and puts B2a's own STOP in B2a's packet |
> | 9 | §6 lifecycle table + edit story | "will be the sole writer", "neither exists yet", "laid down beneath them, ahead of them" |
> | 10 | §10 registers + §11 K3 | EM-B2a/EM-C1, "both later" |
> | 11 | **§11 — the STOP struck** | replaced by a new subsection, *"THE RECORDED INVARIANT THAT REPLACES THE OLD 'EM-B2 HAS NOT LANDED' STOP"*, stating the inverse: this packet lands first; B2a and C1 depend on IT; a writer landing while either travel arm is red is **their** STOP. Plus two consequences: the absence of `src/domain/edit/**` is a **precondition satisfied**, and an import from it is itself a STOP; and landing this packet AFTER a writer remains a STOP |
>
> Independence re-measured, not assumed: all eight cases drive existing symbols only
> (`saves.save/list/writeAll`, `normalizeSettlement`, `toPublicSafe`,
> `serializeWorldSnapshotPublic`, `buildAccountExport`, `forkSeedFor`/`forkConfigFor`,
> `partializeStoreState`) — every one resolving in `requiredSymbols` (27/27) — and
> `src/domain/edit/` does not exist at the tip.
>
> ### Sites changed for B3a-2 (the opaque shapes) — five
>
> §6 gains a **marked paragraph** ruling the interior an OPAQUE BLOB, naming the typedef
> *"illustrative — EM-B2a owns the shape (design §14)"*, and requiring a fixture with **a nested
> object plus an order-observable array** asserted by deep equality. The typedef itself is
> reduced to `Record<string, unknown>` / `Array<unknown>` with a comment forbidding schema
> readings. **Three field-level assertions were found in §9 and cured:** A1's *"one edited
> entity, one minted id, one phantom"* and *"`orderIndex` 0 and 1, one `pending` one `applied`"*;
> A4's `dmLayer: { entities: {}, minted: {}, phantoms: {} }` (now `dmLayer: {}`); A5's *"no id is
> re-minted"*. §6's absence rules dropped the same three-key spelling. §8 step 2 now says to
> plant opaque literals and import nothing from `src/domain/edit/**`.
>
> Confirmed against the tree: design §14 `:201` reads *"`dmLayer` records the DM's overrides:
> `roots` (by `<cardType>:<entityId>:<field>`) and `worldFacts` (by config key)"* — so the ARCH
> §2 spelling version 2 carried was already superseded.
>
> ### B3a-3 and the manifest
>
> `EM-B3c` recorded in §12 as a named chartered follow-up ("chartered, not this packet") and
> cross-referenced from §11's K2, which keeps only the executed check. **The manifest needs no
> structural change:** the union of every key across all 188 packets is
> `_verifiedBaseNote, acceptanceCases, changeManifest, checks, id, landedAt, packetPath,
> requiredSymbols, retiredSymbols, status, supersededBy, verifiedBase` — **zero dependency
> fields** — and `grep` for `dependsOn|dependencies` in `implementation-packets.mjs` and
> `implementation-session.mjs` returns nothing. Ordering is yours, not the validator's. I did
> make **two wording changes** for B3a-2 consistency: `acceptanceCases` A1 now says "as OPAQUE
> planted values … nested key order and array element order intact", and A5 replaces "nothing
> re-minted" with "nothing re-ordered or normalised away, asserted by deep equality … never
> field by field".
>
> ### Step 8 dry read, RE-RUN under the new `Depends on`
>
> ```
> declared substrate paths: 21
> substrate diff at base=tip: EMPTY (passes)
> CREATE tests/store/decreeRegistryPersistence.test.js | exists: false | tracked: no
> CREATE tests/lib/editTravel.test.js                  | exists: false | tracked: no
> MODIFY publicSafe.js / worldSnapshotPublic.js / accountData.js | exists: true
> requiredSymbols resolved: 27   missing: 0
> ```
>
> **Unchanged in every check.** The rulings moved prose, two acceptance wordings and one manifest
> string; no path, symbol, status or base moved. The base-stamp condition from the original
> verdict still stands and is still indivisible from the 202 row.
>
> ### Three things in the veil-first sweep that give me pause
>
> 1. ⚠ **The veil is proved only against fixtures until B2a lands.** Veil-first is right, but its
>    cost is that no *genuinely written* layer exercises these arms at landing. **The first real
>    proof arrives with EM-B2a, and B2a's packet should carry that arm** — a round trip and a
>    travel check over a layer its own `applyEdit` wrote. I did not add it here (it would be
>    testing B2a's writer from inside B3a); I flag it for B2a's compile.
> 2. ⚠ **A2 is the only case that covers production at landing.** With no writer in the tree,
>    every real save has neither key, so A2's dormancy arm is the one that speaks about live
>    data; A1/A4/A5/A7/A8 all describe a future. That is not a defect — it is the argument FOR
>    landing in EM-T3, since the blast radius is three denylist entries plus a helper that is
>    reference-identical on every existing save — but it should be said out loud rather than
>    discovered at the terminal.
> 3. ⚠ **`withoutEditState`'s reference-identity moves from nicety to dormancy proof.** Because
>    100% of real saves take that branch at landing, a shallow-copy-always implementation would
>    change the bytes of **every** existing account export while every test still passed. I
>    strengthened §6's no-draw clause to say exactly this and to name A7(ii)'s reference-identity
>    arm as the dormancy proof.
>
> **JUDGMENT: I bumped the packet to version `3` rather than folding into version 2, because you
> reviewed version 2 and ruled against three things in it, and a version boundary is what makes
> the rulings' effect auditable — say "veto" and I will fold it back into version 2.**
>
> ### Final sizes
>
> | File | Lines | Bytes |
> |---|---:|---:|
> | `EM-B3a.md` | 693 | 76,791 |
> | `EM-B3a.evidence.md` | 1,263 | 70,138 |
> | `EM-B3a.manifest.json` | 226 | 8,916 |
> | `EM-B3a.preproof.report.md` | 409 | 26,026 |
>
> Measured with `wc -lc` after the final edit. The read tree is verified untouched
> (`rev-parse --short HEAD` → `a41a0e109`, `status --porcelain` empty).
>
> Everything below is the original pre-proof report, unaltered.

---


**Lane:** Opus PRE-PROOF (session 7d3418f8) · **Tree read:** `$SP/read-tip-a41a0e109`, detached at
`a41a0e109bdee8fe3a0df082bf35b36d2399301e`, `git status --porcelain` empty · **Stamp:**
`Sat Sep 19 15:08:27 EDT 2026` (read from `date` in the same call as the rev-parse).
**No gate was run and none is claimed.** Nothing outside
`$SP/lane-preproof-EM-B3a-scratch/` was written.

---

## VERDICT: **READY-able**, with ONE condition the chair must execute

**CONFIRMED.** Every verified fact re-resolves at the tip; the J-T1 window is empty; all 26
original required symbols resolve; the packet reaches no budgeted bundle chunk; and the sealed
dispatch's checks all pass on a dry read. Version 2 is in the scratch and the chair can promote
it without editing a fact.

⛔ **THE ONE CONDITION — and it is indivisible.** The verified base **must** be stamped at the
tip `a41a0e109`. Not because J-T1 merely permits it, but because version 2 adds
`supabase/migrations/202_edit_registry_public_denylist.sql` to `requiredSymbols`, and that file
was CREATED inside the old window (`ac46d2daf` is a descendant of `d31af2cee`). Left at the old
base, `implementation-session.mjs:185-196` throws
`verified-base descendant changed declared substrate`. **Adding the 202 row and stamping the
base at the tip are one act; do both or neither.**

### The three file paths

| | |
|---|---|
| Packet | `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-B3a-scratch/EM-B3a.md` |
| Manifest entry | `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-B3a-scratch/EM-B3a.manifest.json` |
| Evidence | `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-preproof-EM-B3a-scratch/EM-B3a.evidence.md` (E0–E19 untouched; **E20–E28 appended**) |

There was **no evidence file beside the packet in the tree** (`ls` on
`docs/implementation/packets/settlement-editor/` shows six `.md` files and no `*.evidence.md`);
the pre-split `EM-B3.evidence.md` was taken from the chair kit's `findings/` as the brief said,
copied to `EM-B3a.evidence.md`, and every in-packet citation re-pointed to the new name.

---

## 1. The J-T1 window — CONFIRMED EMPTY

```
$ git diff --stat d31af2ceebf643818201b2e2ab4a556765d2fc7c a41a0e109 -- \
    <all 5 change-manifest paths and all 20 requiredSymbols paths>
(no output)
```

**Zero of the 25 paths moved.** Blob-identity spot proof on the largest touched file:
`d31af2cee:src/domain/display/publicSafe.js` and `a41a0e109:src/domain/display/publicSafe.js`
are both `bdeafe467a423b30399c28388a70a9af928f6d67`.

Both CREATE targets absent and untracked (`git ls-files` on the two paths → no output).
EM-B2's writer still absent: `src/domain/edit/` does not exist.
`shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` →
`95e9a5f4aee51bb5aaa434883a708c5f2a4c71d2a49aa4ec99f9076a98c2afaa` (left for the chair to stamp).

Your `023eda2ec` pre-check is **independently re-confirmed at `a41a0e109`**: 20/20 substrate
paths unmoved, 26/26 symbols resolving.

---

## 2. Facts changed — old → new, each with its proving command

### 2.1 ⭐ THE ONE REAL MOVE: the net-current SQL scanner (because EM-B3b landed)

Executed through the drift test's **own** extractors (`tests/helpers/sourceContract.js`) over
the same latest-wins walk `snapshotDenylistDrift.test.js:30-45` performs:

```
NET-CURRENT SCANNER FILE: 202_edit_registry_public_denylist.sql
JS_TOKENS.length = 35   SQL_ALTS.length = 34
sqlDenies("decrees") = true   sqlDenies("dmlayer") = true
sqlDenies("appliedDecrees") = true   sqlDenies("decreesApplied") = true
uncovered JS tokens = []
--- simulating this packet's single-token insert ---
after-length = 36   delta = 1   new tokens = ["decrees"]
```

| Fact | Version 1 (at `d31af2cee`) | Measured at `a41a0e109` |
|---|---|---|
| net-current scanner file | `136_world_snapshot_deny_census_lift.sql` | **`202_edit_registry_public_denylist.sql`** |
| SQL alternatives | 33 | **34** |
| `sqlDenies('decrees')` | `false` | **`true`** |

**This is the packet's own precondition arriving, not a refutation.** §11's K2 STOP is measured
NOT to fire; §8 step 3's gate passes before the first edit; the packet's "zero interior reds in
the drift test" claim is now measured rather than predicted. Every future-tense sentence about
B3b — in *Depends on*, *Collision group*, §1 K2, §2 Definition-of-done, §2 non-goals, §3's split
record, §5's mirror-3 and drift-pin rows, §8 step 3, §10 and §12 — is rewritten to the measured
past in version 2.

### 2.2 The lighting-census absolutes went stale (brief step 3 / your R11 rule)

```
$ git diff --stat d31af2cee a41a0e109 -- tests/lint/.lighting-census-baseline.json
 tests/lint/.lighting-census-baseline.json | 14 +++++++-------
```

| | `files` | `parked` | `credited` | `titles` | `suiteTitles` |
|---|---:|---:|---:|---:|---:|
| version 1 assumed | 2645 | 383 | 2262 | 25009 | 6670 |
| **live at `a41a0e109`** | **2646** | **383** | **2263** | **25005** | **6671** |

Two landings moved it inside the window: `ed9d99295` (EM-T1's terminal collapsed thirteen vacuous
census arms into two victory arms, `titles 25009 → 24998`) and EM-P0's terminal (one new test
file). Version 1's prediction `2647/383/2264/25017/6674` is therefore **wrong in four of five
figures**. §10 now states only the DELTA, derived from the packet's own CREATE rows against the
walker's own definitions (`:602-605`):

**`files +2 · parked +0 · credited +2 · titles +8 · suiteTitles +4`**

The red's SHAPE is kept as a marked placeholder ("an exact-equality failure on five figures,
cured only by the whole-census re-derivation"); **the absolute is yours to stamp at promotion
from the live baseline.** §12's receipt line was re-pointed at the delta so the implementer
cannot copy a tuple out of the document.

### 2.3 Six compile-era line/count errors (all wrong at the version-1 base too — none is drift)

Because the J-T1 window is empty, each of these was already wrong at `d31af2cee`.

| # | Version 1 | Measured | Where |
|---|---|---|---|
| 1 | `veilPublicPayload` (`:481`) | **`:487`** | §5 Receipt/audience |
| 2 | "a **39**-member frozen allowlist" | **38** (`PUBLIC_TOPLEVEL_KEYS.length`) | §5 Reader/projection |
| 3 | `galleryImportSettlement.js:71`, `galleryImportMap.js:290` under `src/lib/` | both live under **`src/store/`**; line numbers exact | §2, §5, §12 |
| 4 | `townMapEditsPublicDrop.test.js` "43 lines" | **42** | §5 Test precedent |
| 5 | "the payload literal at `:340`" | **`:341`** (`:340` closes `preflight`) | §7 accountData |
| 6 | "134 CREATE against **287** TEST" | 134 / **288** | §7 CREATE-vs-TEST note |

Also made precise, not wrong: the observed-shape row is
`src/domain/**ai**/personaSlicer.js:172` (there is no `src/domain/display/personaSlicer.js`);
line 172 is exact.

**Everything else in §5 re-found exact by symbol** — `saves.js:157` ·
`SETTLEMENTS_DB_WRITER_COLUMNS` twelve columns · `partializeStoreState:245`, nine keys,
`grep -c saveId` → 0 · `PUBLIC_TOPLEVEL_KEYS` iterated at `:357` · the `full` branch names
exactly **thirteen** keys, `delete clone.narrativeNotes;` at `:268` so the two new deletes land
at `:269`, after the DM-notes run and before the seed carriers at `:278-280` exactly as §6 says ·
`WORLD_SNAPSHOT_HARD_DENY:68` with `'deferredPartyImpacts'` at `:80` closing the always-present
block · `COVERT_KEY_RE:134` · `serializeWorldSnapshotPublic:608` · `snapshotDenylistDrift:78` ·
`normalizeSettlement:162`/spread `:178`/`lifecycleRoundTrip:1917` · `mergePersistedState:52`,
file 107 lines · `forkSeedFor:166`/`forkConfigFor:181`/`generationIntent:32` ·
`scrubImportedTreasury:87` · `preflightAccountExport:206`/`buildAccountExport:405` ·
`buildWorldExport:112` · `EXPLAINED_WRITER_EXEMPTIONS:1140`/`assert…:1290` · goldens 525 rows.

**K3 re-confirmed:** `.inventory."src/domain/display/publicSafe.js"` is exactly
`{"covert on settlement":1}` — one row, none for the thirteen deletes — and
`worldSnapshotPublic.js`, `accountData.js` and `importScrub.js` are ABSENT from the inventory
(they appear only in the three file-census manifests). `importScrub.js` uses the very
destructure-drop spelling §8 prescribes and carries no row: that is the standing proof the
register moves by zero.

### 2.4 The collision claim's absolute moved; its substance did not

E14 said "zero non-terminal packets estate-wide". At the tip there are **three** (EM-B3a DRAFT,
EM-P3 DRAFT, EM-P2 STALE) of 188. The load-bearing claim survives intact and is re-measured:
**EM-B3a is the sole reserver of all five of its change paths**; EM-P3's five paths and EM-P2's
four overlap it by **zero**; EM-B3b (LANDED) and EM-B3 (SUPERSEDED) are terminal and reserve
nothing.

---

## 3. The requiredSymbols delta — **+1, −0**

**ADDED:** `supabase/migrations/202_edit_registry_public_denylist.sql` ::
`create or replace function public._gallery_world_snapshot_is_safe` (`grep -F -c` → 1).

*Why it is owed:* by the standard, a symbol the deliverable must find unchanged is a required
symbol. §8 step 3 and §10's "Expected" both rest on `sqlDenies('decrees') === true`, and at the
tip that is carried by 202, not by 136. Adding the row also puts 202's **path** into the sealed
dispatch's substrate check, so an edit to 202 becomes visible.

**REMOVED:** none. 136 stays — its body is what 202 recreates verbatim, its symbol still
resolves, and the standard forbids a silent removal.

**All 27 rows re-resolve at the tip: `resolved=27 missing=0`.** `acceptanceCases` 8 (cap 8),
`checks` 5 argv arrays, one test directory per array.

---

## 4. ⭐ STEP 5 — THE BUNDLE BUDGETS, PRICED. **This packet owes NOTHING, and here is the measurement**

Measured with the repo's **own** derivations, never a replica.

| Budget | Instrument · bound | Slack today | Lands in it? | How measured |
|---|---|---:|---|---|
| **First-paint closure** | `EAGER_FIRST_PAINT_MODULES` vs `CLOSURE_BUDGET_BYTES` `1_048_000` / gzip `337_000` / brotli `283_000` (`vendorPdfLazy.test.js:565,595,596`) | historically tight | **NO** | imported `vite.config.js` live; the set has **268** modules; all three paths `NOT-EAGER` (sanity: `main.jsx` and `lookups.js` both `true`) |
| **Generation worker** | `WORKER_BUNDLE_CEILING_BYTES = 1401128` (`generationWorkerLazy.test.js:138`), EXACT, monotone-down | **zero** | **NO** | static closure of `src/workers/generation.worker.js` = **219** modules, computed with `vite.config.js`'s own `resolveRel`/`importsOf` (static edges only; dynamic `import()` a lazy boundary); all three OUT |
| **Lazy engine chunk** | `toBeLessThan(679_000)` (`vendorPdfLazy.test.js:787`; 678,131 at `023eda2ec`) | **869 B** | **NO** | the chunk rule is literal — `id.includes('/src/generators/')` (`vite.config.js:863`) + `narrativeData.js`; none of the three matches, and re-running `computeEngineSharedDomain()` verbatim (68 → **51** post-excision) puts none in `engine-core` either. Every static importer of the three is outside `/src/generators/` (enumerated by `git grep`) |
| **Edge-shared bundles** | five `*.meta.json` closures + their freshness tests | n/a | **NO** | derived from the committed metas' own `inputs` (114 / 74 / 115 / 2 / 2); **zero hits** |

⇒ **No ceiling TEST row added, no byte bound stated, no build-lane re-mint owed, and
"Generated artifacts: `NONE`" re-confirmed with no dirty-build obligation.** The whole
production delta is `+10` effective lines across three modules every budgeted closure is
measured not to reach.

**What I added to the packet because of step 5:** a new §7 subsection *"THE BUNDLE BUDGETS,
PRICED — and this packet owes NOTHING"* carrying the table above, a forbidden-alternative line
("no bundle-ceiling constant is touched"), and a re-pointed §12 receipt line.

**Two things I put in the packet as receipts, not budgets — flagging both:**
1. `src/domain/display/publicSafe.js` **IS** inside `src/workers/townSceneExport.worker.js`'s
   125-module static closure — the only worker closure this packet touches — and **no byte
   ceiling names that worker**: `grep -rn "townSceneExport" tests/build/` → no output. I did
   not invent a budget for it; the implementer records the fact.
2. A module with no `manualChunks` assignment is placed by Rollup's co-location, which only a
   real `npm run build` settles. **This lane ran no build and claims none.** The table is the
   static-graph claim — which is exactly what every `tests/build/` guard itself asserts against.

---

## 5. Registration obligations, re-priced at the tip

- **Mutation coverage — ZERO rows owed, now proved on BOTH arms.** Neither `tests/store` nor
  `tests/lib` is in `ENFORCER_DIRS` (the eight are `tests/lint, design, docs, data, copy,
  security, edgeFunctions, generators`), **and** neither basename trips `NAME_PATTERN`.
  Executed: both files report `ENUMERATED: false`. Version 1's justification ("no `tests/lint/`
  file added") was narrower than the rule; the conclusion is unchanged.
  ⚠ **`scripts/mutation-coverage-manifest.json` is currently reserved by EM-P2 (STALE,
  non-terminal).** EM-B3a does not name it, so there is no contention.
- **Lighting census** — priced as the delta in §2.2 above.
- **Observed-shape / writer-reach** — zero rows (§2.3); the mint stays EM-B2's and EM-C1's.
- **Prose-numerics** — not owed; wave 1 renders nothing.

---

## 6. Budget re-measured (nothing moved, so nothing splits)

Effective lines under eslint's own `Linter`, `max-lines {skipBlankLines:true, skipComments:true}`:
`publicSafe.js` **132** · `worldSnapshotPublic.js` **332** · `accountData.js` **365**.
§3's row stands exactly: largest touched file `worldSnapshotPublic.js` at **332/800**, **468**
lines of headroom. The standing hot-file list re-executed — **none is in this manifest**
(`EconomicsTab.jsx` 599, `OutputContainer.jsx` 600, `convergence.js` 764, `peaceTerms.js` 797,
`informationStatecraft.js` 781). Packet total `+10` eff against 400; 5 handwritten files against
12; 3 existing logic files against 3; 8 acceptance cases against 8. **No split.**

---

## 7. The sealed dispatch, read check by check (`scripts/implementation-session.mjs`)

| Check | Source | Verdict at `a41a0e109` |
|---|---|---|
| status READY | `:274` | passes **after** promotion. ⛔ **Today it would refuse twice over** — see §8.1 |
| branch identity | `:352-353` | passes iff the implementer's worktree is ON the verified branch (your one-build-lane-holds-the-branch rule) |
| ancestry | `:176-183` | **passes** (`d31af2cee` is an ancestor; at base = tip, `:184` short-circuits) |
| substrate unchanged | `:185-196` | **passes at base = tip.** Executed both ways: at the old base the 202 row makes it non-empty; at base = tip the full 21-path set prints nothing |
| capsule carries every substrate path | `:198-200` | passes; generated from the same manifest |
| CREATE targets absent + Git-clean | `:205-211` | **passes** — both absent and untracked |
| non-CREATE targets Git-clean | `:212-213` | passes in a clean worktree |

---

## 8. Questions and acts only the chair can answer

1. ⛔ **The dispatch id was wrong, and I fixed it — please confirm.** §4 and §10 spelled
   `npm run implementation:dispatch -- EM-B3` / `check:packet -- EM-B3` /
   `implementation:resume -- EM-B3`. **`EM-B3` is `SUPERSEDED`** in the manifest and its own
   Markdown says "It is not dispatchable"; `:274` refuses any non-READY packet, so the old
   spelling could only ever have thrown. Version 2 says `EM-B3a` everywhere.
2. ⛔ **Stamp the base at the tip, together with the 202 row.** They are one act (§Verdict).
   §13 of version 2 carries the ready-to-paste revalidation sentence with a `__BASE__`
   placeholder, and §13 says to delete itself once stamped.
3. **Stamp the preamble hash** `95e9a5f4aee51bb5aaa434883a708c5f2a4c71d2a49aa4ec99f9076a98c2afaa`.
4. **Stamp the lighting absolute** from the live baseline at promotion; the delta is fixed.
5. **A residual only you can close:** adding 202 to `requiredSymbols` makes an *edit to 202*
   visible to the dispatch, but a **new** migration (203+) re-creating
   `_gallery_world_snapshot_is_safe` without `.*decrees.*` would silently take this packet's
   premise away and is invisible to a path-based substrate check. I wrote it into §11's K2 STOP
   as an executed check rather than an assumption; if you want structural cover instead, that is
   a walker and a separate packet, not this one.
6. **A grouping difference I left alone, flagged:** §10's focused commands run
   `tests/lib/editTravel.test.js` alone and `worldExport + importScrub` together, while the
   manifest's `checks[1]` merges all three into one `tests/lib` run. Both are lawful (one
   directory per array) and I did not silently reconcile them.
7. **Not re-opened, by design:** K1–K4 are your rulings and I treated them as settled; I
   adjudicated nothing. The `importScrub` deferral stays recorded in §2 and §12.

---

## Epistemic labels

**CONFIRMED** (quoted command + output in E20–E28): the empty J-T1 window · 27/27 symbol
resolution · the scanner's move 136 → 202 and the `sqlDenies` flip · the lighting baseline's
move and the packet's own delta derivation · the mutation-coverage non-obligation on both arms ·
all four bundle-closure memberships · the six line/count corrections · effective lines and the
hot-file list · the reservation census · `EM-B3`'s SUPERSEDED status · the substrate-check
behaviour at both bases.

**PLAUSIBLE** (reasoned, with the experiment that would settle it named): that the three
modified modules land in no *emitted* chunk that carries a ceiling. Chunk placement for a module
with no `manualChunks` assignment is Rollup's co-location decision; the settling experiment is a
real `npm run build` plus `VERIFY_DIST=1`, which this read-only lane may not run. Every
`tests/build/` guard asserts against the same static graph I measured, so the static claim is
the same claim those guards make.
