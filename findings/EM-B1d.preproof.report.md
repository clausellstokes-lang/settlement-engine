# EM-B1d — Opus PRE-PROOF report to the chair

**Lane:** Opus PRE-PROOF, session 7d3418f8, 2026-09-19 ~15:1x–15:3x EDT (`date` read in-shell:
`Sat Sep 19 15:10:51 EDT 2026`). Read-only in `$SP/read-tip-a41a0e109` (detached at
`a41a0e109bdee8fe3a0df082bf35b36d2399301e`, `git status --short` empty) and in the ledger via
`git show` only. **Wrote only** under `$SP/lane-preproof-EM-B1d-scratch/`. No vitest, no eslint, no
npm script, no build, no edit anywhere else.

## VERDICT: **READY-able**, after **three chair acts** — one of which is a ruling, two are stamps

Every verified-fact row in the packet still holds at the tip, re-found BY SYMBOL, with unchanged
line numbers. Nothing is BLOCKED. Four figures were stale and are corrected; **two obligations the
compile lane priced wrongly are added on executed measurements**; the packet Markdown was still the
pre-ruling eight-file document and is reconciled. What remains is the chair's:

1. ⛔ **Stamp the verified base to the TIP.** `__BASE__` → `a41a0e109bdee8fe3a0df082bf35b36d2399301e`
   in **both** `EM-B1d.md`'s `Verified base` / `Last revalidated` rows **and** the manifest's
   `verifiedBase` (the validator compares them, `implementation-packets.mjs:889`). Leaving it at
   `d31af2cee` makes the sealed dispatch **throw** — see §3.
2. ⛔ **Free the mutation-coverage path** (§2) — or decide it stays reserved and the packet waits.
3. ⚠ **Rule R6 in one line** — T2's matcher definition (§6). The lane measured the problem and
   costed both clean options; it adjudicates neither.

Also stamp: the preamble SHA-256 (measured below) and, at promotion, the lighting census absolute.

**The three file paths:**
```
$SP/lane-preproof-EM-B1d-scratch/EM-B1d.md               (packet, version 2, status DRAFT)
$SP/lane-preproof-EM-B1d-scratch/EM-B1d.manifest.json    (manifest entry, verifiedBase __BASE__)
$SP/lane-preproof-EM-B1d-scratch/EM-B1d.evidence.md      (compile §0-§9 untouched; pre-proof §10-§20 appended)
```

---

## 1. THE J-T1 WINDOW — CONFIRMED

Over the packet's **full** substrate at version 2 (every non-`CREATE` change-manifest path plus
every `requiredSymbols` path — exactly what `assertAncestorAndSubstrate` diffs — 14 paths, plus the
CREATE target):

```
$ git -C $SP/read-tip-a41a0e109 diff --stat d31af2ceebf643818201b2e2ab4a556765d2fc7c a41a0e109 -- \
    scripts/mutation-coverage-manifest.json src/domain/density/factionLifecycle.js \
    src/domain/entities/npcs.js src/domain/entities/status.js src/domain/entities/successors.js \
    src/domain/worldPulse/envoyCasting.js src/domain/worldPulse/magicFormsPractitioner.js \
    src/domain/worldPulse/npcVerdictTable.js \
    supabase/functions/_shared/aiCharterBundle.js  supabase/functions/_shared/aiCharterBundle.meta.json \
    supabase/functions/_shared/aiOutputSchemaBundle.js supabase/functions/_shared/aiOutputSchemaBundle.meta.json \
    tests/lint/chooserTotality.walker.test.js tests/lint/mutationCoverage.shared.mjs \
    tests/lint/statusUnionTotality.walker.test.js
 scripts/mutation-coverage-manifest.json | 4 ++++
 1 file changed, 4 insertions(+)
```
⚠ Methodology note: the first attempt passed the path list through an unquoted shell variable and
printed **nothing** — zsh does not word-split unquoted parameters, so the pathspec collapsed and the
result was a false empty. It was re-run explicitly (above) before being believed.

```
$ git merge-base --is-ancestor d31af2cee a41a0e109 ; echo $?      -> 0   (ancestor)
$ git rev-list --count d31af2cee..a41a0e109                       -> 40
$ git log --oneline d31af2cee..a41a0e109 -- scripts/mutation-coverage-manifest.json
429ceed54 EM-P0 (v2) — the pipeline seam: …
$ ls tests/lint/statusUnionTotality.walker.test.js    -> No such file or directory
$ git ls-files --error-unmatch  (same path)           -> did not match any file(s) known to git
```
⇒ **The chair's pre-check at `023eda2ec` reproduces exactly at `a41a0e109`.** Of the substrate only
`scripts/mutation-coverage-manifest.json` moved, +4 insertions / 0 deletions, and the mover is
EM-P0's landed row. The five production files are blob-identical base → tip, so every line number
in §5 is both the base's and the tip's. The CREATE target is absent and untracked. **CONFIRMED.**

---

## 2. ⛔ THE PLACEMENT COLLISION — CONFIRMED, reported not solved

```
$ sed -n '43p;676p' scripts/implementation-packets.mjs
const TERMINAL_PACKET_STATUSES = new Set(['LANDED', 'SUPERSEDED']);
    const reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(String(status));
$ sed -n '694,701p'
      if (reservesChangePaths) {
        const priorOwner = changePathOwners.get(row.path);
        if (priorOwner && priorOwner !== changeOwnerKey) {
          addError(errors,
            `duplicate change path across packets: ${row.path} (${priorOwner.replace(/^\d+:/, '')}, ${idLabel})`);
        } else changePathOwners.set(row.path, changeOwnerKey);
      }
$ PACKET_STATUSES = ['BLOCKED','DRAFT','LANDED','READY','STALE','SUPERSEDED']
```
`STALE` is **not terminal**, so it reserves exactly as READY does. The live register (188 packets):

```
  idx=186  EM-P0  LANDED  reserves=false  REGISTER scripts/mutation-coverage-manifest.json
  idx=187  EM-P2  STALE   reserves=TRUE   REGISTER scripts/mutation-coverage-manifest.json
  (24 further holders, all LANDED, all reserves=false)
Every EM-* packet PLACED: EM-B3a DRAFT · EM-B3b LANDED · EM-B3 SUPERSEDED · EM-P3 DRAFT · EM-P0 LANDED · EM-P2 STALE
```

⇒ ⛔ **`EM-A1` is NOT placed in the tree at all.** The packet asserted in three places that EM-A1
held this path at DRAFT; **the holder is `EM-P2` at `STALE`.** Corrected in version 2.

**Exactly what the validator would say if EM-B1d were placed today** (appended after EM-P2, so
EM-P2 is prior owner by array index):
```
duplicate change path across packets: scripts/mutation-coverage-manifest.json (EM-P2, EM-B1d)
```
Inserting EM-B1d before EM-P2 prints the same line with the names transposed. **The chair decides**
— withdrawing the stale EM-P2 to the kit is the recorded precedent; flipping it to `SUPERSEDED`
would also free the path. Neither the packet nor the implementer works around it.

⚠ Separately: `validate` does **not** cross-check the packet Markdown's §7 table against the JSON
`changeManifest` (`:875-899` checks only heading-id, status, `verifiedBase`, READY's branch, and
index agreement). That is why finding §5 below could have shipped silently.

---

## 3. THE SEALED DISPATCH, READ CHECK BY CHECK — and why the base MUST move

| # | check (line) | verdict at `a41a0e109` |
|---|---|---|
| 1 | `dispatch branch mismatch` (`:353`) | the chair's act — the worktree must sit on the verified branch |
| 2 | `verified base is not an ancestor of HEAD` (`:182`) | **PASSES** (exit 0, above) |
| 3 | `verified-base descendant changed declared substrate` (`:195`) | ⛔ **THROWS if the base stays at `d31af2cee`** |
| 4 | `capsule omitted declared substrate` (`:199`) | passes — the capsule is built from the same list |
| 5 | `CREATE target must be absent and Git-clean` (`:210`) | **PASSES** — absent and untracked |
| 6 | `non-CREATE target must be Git-clean` (`:213`) | **PASSES** — `git status --short` empty |

```
$ sed -n '184,196p' scripts/implementation-session.mjs
  if (head === packet.verifiedBase) return;
  const substrate = [...new Set([
    ...packet.changeManifest.filter((row) => row.action !== 'CREATE').map((row) => row.path),
    ...packet.requiredSymbols.map((row) => row.path), …])].sort();
  … throw new Error(`verified-base descendant changed declared substrate: ${changed.join(', ')}`);
```
`REGISTER !== 'CREATE'` ⇒ `scripts/mutation-coverage-manifest.json` **is** substrate, and it moved.
Dispatching with the base at `d31af2cee` throws:
> `verified-base descendant changed declared substrate: scripts/mutation-coverage-manifest.json`

**Setting the base to `a41a0e109` makes `head === verifiedBase` and the arm returns early at
`:184`.** All six checks then pass as measured. **CONFIRMED.**

---

## 4. ⭐ STEP 5 — THE BUNDLE BUDGETS, PRICED

**How measured:** (a) `vite.config.js`'s default export imported and its
`build.rollupOptions.output.manualChunks(id)` called per file — the repo's own routing, not a
replica; (b) the config's exported `EAGER_FIRST_PAINT_MODULES` queried for membership; (c) static
closures walked with a helper whose `resolveRel`/`importsOf` bodies are **copied verbatim** from
`computeEagerModuleGraph` (`vite.config.js:258-275`), so dynamic `import()` stays a lazy boundary.

| emitted chunk | ceiling | slack | which of the five | owed |
|---|---:|---:|---|---|
| **generation worker** | `WORKER_BUNDLE_CEILING_BYTES = 1401128`, `<=`, re-minted exact | ⛔ **0 B** | ⭐ **NONE** — 219-module closure from `src/workers/generation.worker.js`; all five OUT | ⭐ **NOTHING** |
| **lazy `engine`** | `< 679_000` (last measured 678,131) | ~869 B | **NONE** — rule is `id.includes('/src/generators/')` (`:862`); none is under it | **NOTHING** |
| **eager `engine-core` / first-paint closure** | raw `<= 1_048_000`; gzip 337,000; brotli 283,000 (last ratification reading 1,047,205) | ~795 B | **THREE** — `factionLifecycle.js` → `engine-core` explicitly; `npcs.js` (`main.jsx→store→settlementSlice→mutateEntities`) and `successors.js` (`→settlementSliceHelpers`) eager | **verification at T3's terminal** |
| **`advanceInterval.worker`** (pulse/simulation) | ⭐ **NO BYTE CEILING EXISTS** — `grep -rn advanceInterval tests/build/` returns nothing; `tests/domain/advanceWorkerByteIdentity.test.js` is a structured-clone **determinism** pin | — | THREE — `npcs.js`, `factionLifecycle.js`, `envoyCasting.js` | **NOTHING** (pin added to `checks` anyway) |
| **`townScene.worker`** | none | — | none (18-module closure) | — |
| **edge-shared committed bundles** | source-hash agreement | exact | **`npcs.js`** | ⛔ **OWED — §5** |

**The decisive result: the zero-slack budget is not engaged.** None of the five is in the generation
worker's closure, and none is under `src/generators/`, so the two tightest ceilings take **no**
obligation from this packet.

**The first-paint delta, priced.** `npcs.js`'s edit is a JSDoc typedef — a comment — and
`vite.config.js` sets no `minify` key, so Vite's default esbuild minify strips it: **0 emitted
bytes**. `factionLifecycle.js` gains `, 'jailed'` (+10 raw, **+9 minified**). `successors.js`
replaces three literal comparisons with one membership read (neutral or negative). **Estimated
growth ≤ 9 B; the stated bound is that estimate ×2 = ≤ 18 B**, against ~795 B of margin.
**PLAUSIBLE — this lane ran no build.**

⭐ **The one import edge the packet adds is closure-neutral, CONFIRMED by construction:**
`successors.js → factionLifecycle.js` joins two modules **both already in**
`EAGER_FIRST_PAINT_MODULES` (measured `true`/`true`), a transitive-closure fixpoint ⇒ zero new
first-paint modules.

**No build lane is scheduled, on authority.** `EM-PREAMBLE.md` §P7: *"The final full gate is a bare
run with a true exit plus a separate boot smoke; **under a train both move to the terminal**."* The
first-paint arms are `it.skipIf(!requireDistRead)` and run only under `VERIFY_DIST=1`. **T3's
terminal verifies them**; ≤18 B against ~795 B cannot red them, and a re-mint would be unjustified.
A STOP was added instead: growth beyond the 18 B bound attributable to this member's modules goes
to the chair, never to a lane's ceiling edit.

---

## 5. ⛔⛔ WHAT WAS ADDED BECAUSE OF THE MEASUREMENT — the edge-shared dirty build

**The compile lane's evidence §5 said: *"Edge-shared closure NOT owed — none of the eight modified
files is an entry module named in `scripts/build-edge-shared.mjs`."* Entry-hood is the wrong test.**

```
$ sed -n '79,80p' scripts/build-edge-shared.mjs
  const inputContents = inputPaths.map(p => `${p}:${readFileSync(join(ROOT, p), 'utf8')}`).join('\n');
  const sourceHash = createHash('sha256').update(inputContents).digest('hex').slice(0, 16);
$ sed -n '91,97p' tests/edgeFunctions/aiCharterBundle.freshness.test.js
  it('the current source tree matches the recorded hash (regenerate via npm run build:edge-shared)', …
    const live = meta.inputs.map(p => `${p}:${readFileSync(join(ROOT, p), 'utf8')}`).join('\n');
    … expect(liveHash, `Bundle is stale. … Run: npm run build:edge-shared`).toBe(meta.sourceHash);
```
**Raw source text, comments included.** The tool's own metafiles list
`src/domain/entities/npcs.js` as an input of **two** committed bundles (114 and 115 inputs).
Executed with EM-B1d's row 1 applied **in memory only**:

```
aiCharterBundle       recorded=237061fd5e0b3d71  live=237061fd5e0b3d71  FRESH_NOW=true
                      npcs.js an input: true   after row 1 = f56a7d2120c34290  GOES_STALE=true
aiOutputSchemaBundle  recorded=bac86bfd077b5b43  live=bac86bfd077b5b43  FRESH_NOW=true
                      npcs.js an input: true   after row 1 = b44dd839381fd0c7  GOES_STALE=true
aiGrounding / analyticsEvents / intentAtlas   npcs.js an input: false   GOES_STALE=false
```

⇒ ⛔ **The JSDoc-only edit alone reds two PLAIN (not dist-gated) suites.** **CONFIRMED by
execution.** Added to the packet: `npm run build:edge-shared` as §8 step 3, four `MODIFY` rows for
the regenerated artifacts (GENERATED, so the handwritten budget stays 7 of 12), the two freshness
suites plus `edgeSharedBundleReproducibility.test.js` in `checks`, a receipt line for the two
hashes, and a STOP if any artifact beyond those four moves. All four artifacts are **unmoved in the
J-T1 window** (§1), so adding them to the substrate costs nothing.

---

## 6. FACTS CHANGED — old → new, each with its proving command

| # | fact | version 1 (at `d31af2cee`) | version 2 (at `a41a0e109`) | proof |
|---|---|---|---|---|
| F1 | mutation-coverage `invariants` rows | **704 → 705** | ⛔ **705 → 706** | `node -e 'Object.keys(require("./scripts/mutation-coverage-manifest.json").invariants).length'` → `705`; same over `git show d31af2cee:…` → `704` |
| F2 | the lighting census tuple | `2645/383/2262/25009/6670`, quoted as an **absolute** | ⛔ **`2646/383/2263/25005/6671`**, and the packet now quotes **only the DELTA** (R11 rule) | `cat tests/lint/.lighting-census-baseline.json` (`measuredBy: EM-P0`, `measuredAtSha baf8ccc1d`); moved by `ed9d99295` (titles 25009→24998) then `429ceed54` |
| F3 | where the tuple lives | inline in the walker | a register file `tests/lint/.lighting-census-baseline.json` | `grep -n CENSUS_BASELINE_REL …walker.test.js` → `:546`; the walker itself is blob-identical base→tip |
| F4 | the predicted interior red | `expected 2646 to be 2645` | ⛔ `expected 2647 to be 2646` | derived from F2 + the packet's own `+1 files` CREATE row |
| F5 | the mutation-coverage path's holder | "EM-A1 holds it at DRAFT" | ⛔ **EM-P2 at STALE; EM-A1 is not placed at all** | §2 above |
| F6 | the override's disposition | "the override **LAPSES**", raised as R5 | ⭐ **RULED — it NARROWS**: five files at ≤3 eff each plus one walker | ODQ §934.47 addendum 7, ledger row `32782`, quoted verbatim in evidence §18 |
| F7 | the preamble hash | "TO BE STAMPED" | `95e9a5f4aee51bb5aaa434883a708c5f2a4c71d2a49aa4ec99f9076a98c2afaa` (the preamble MOVED — 7 commits in the window) | `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` |
| F8 | generated artifacts | `NONE` | ⛔ **FOUR**, named | §5 above |
| F9 | the census deferral's authority | asserted as "§417 shape" | ⭐ now **preamble law** (`d86aabae6`): *"re-derived whole once, at the train's terminal — BY THE CHAIR, NEVER INSIDE THE PACKET … a packet's §7 never lists the baseline as a generated artifact"* | `EM-PREAMBLE.md` §P2.1 |
| F10 | the REGISTER row's insertion point | "surgically beside its siblings" | ⛔ **named exactly**: between the close of `"tests/lint/dossierMountRegistry.walker.test.js"` (`:70-73`) and `"tests/lint/stepPresentationEngineFence.walker.test.js"` (`:74`) — a pure **+4/−0** diff, EM-P0's own shape | the object is **not sorted** (default sort `false`, localeCompare `false`) and no test enforces order, so the instruction anchors on the two key NAMES |
| F11 | `affordanceManifest.js`'s owed pre-edit `max-lines` | still scheduled in §8 step 1 | **removed** — the file left with the `EntityStatus` half; no roster file is hot | `grep -c "| \`<path>\`" PACKET_STANDARD.md` → 0 for all five; no `.size-baseline.json` entries |

**Unchanged and re-proved:** every §5 row by symbol (`npcs.js:30`, `factionLifecycle.js:75/:77`,
`successors.js:50/:63`, `envoyCasting.js:95/:98`, `magicFormsPractitioner.js:79/:147/:172`,
`SCAN_ROOTS:64`, `ENFORCER_DIRS:36`); `ROSTER_ABSENT_STATUSES`'s only consumer is still its own
file; R3's "no `switch` over the union" (only `propagate.js:422` over `npc?.importance`); every
`checks[]` path and npm script exists.

---

## 7. THE `requiredSymbols` DELTA — **+2, −0**

The standard: *a symbol the deliverable CALLS and must find unchanged is a required symbol.* Both
additions are **PRESERVE** rows, not change rows — the packet edits neither file.

| path | symbol | why owed | proof at `a41a0e109` |
|---|---|---|---|
| `src/domain/entities/status.js` | `EntityStatus` | A1 asserts it still parses to **exactly five** — addendum 7's *"B1d's first arm pins EntityStatus unchanged at five"*. The walker reads this typedef from source; a silent widening must red A1 | `grep -cF 'EntityStatus'` → **4**; typedef at `:23` = `'active'\|'impaired'\|'removed'\|'destroyed'\|'vacant'` |
| `src/domain/worldPulse/npcVerdictTable.js` | `export const HOLDING_VERDICT` | T2's exemption roster names this file BY NAME (addendum 6). An exemption declared over a file that no longer holds the verdict is a stale guard | `grep -cF 'export const HOLDING_VERDICT'` → **1** (at `:104`) |

The original seven all resolve verbatim (`grep -c` ≥ 1: 3, 1, 1, 1, 1, 1, 1). **None removed.**
Both new paths are **unmoved in the J-T1 window** (§1).

---

## 8. THE BUDGET TABLE (re-measured at the tip)

| Limit | Packet | Standard |
|---|---:|---:|
| Behaviour families | 1 | 1 |
| Existing logic-bearing production files modified | **5** | ⭐ **≤5 — the NARROWED override (add. 7)** |
| Max delta per modified file | **3 eff** | ⭐ **≤3 — the NARROWED override** |
| New logic leaves / persisted families / flags / surfaces | 0 | ≤2 / ≤1 each |
| Registration-only files | 1 | ≤3 |
| Handwritten files total | **7** | ≤12 |
| Generated artifacts (regenerated) | **4** | n/a |
| New/changed effective production lines | ≤15 | ≤400 |
| Effective lines per new leaf | n/a (no production leaf) | ≤250 |
| Delta in a shared/hot file | 0 — none is hot | ≤15 |
| Acceptance cases | **7** | ≤8 |

Measured sizes (`wc -l` / comment-and-blank-stripped): 336/138, 193/61, 154/52, 222/92, 258/70 —
none near any ceiling. **The narrowed override is satisfied exactly; nothing was raised or
invented.** No split is proposed.

---

## 9. QUESTIONS ONLY THE CHAIR CAN ANSWER

| # | question |
|---|---|
| **R6** ⛔ **new, and the one that blocks the CREATE row** | **Define T2's matcher in one line.** Measured at the tip, both retired spellings are live members of **two further unions**: `'imprisoned'` in `STASIS_REASONS` (`npcOps.js:116`; mirrored `pendingEditIntents.js:80`, `settlementPendingEditWriters.js:29`; labelled `NpcLifecycleControls.jsx:49`) and `'killed'` in `ENVOY_LOSS_CAUSES` (`envoyErrandVocabulary.js:118`; read `envoyErrand.js:498/507/599`, `npcDmVerbs.js:537`). Design §15 `:313` rules captivity *"a per-layer fact … distinct from `jailed`"* — deliberate layers, not drift. The packet says T2 scans *"status-position string literals"*, a phrase the standard forbids leaving to discretion; and the verdict union's own literals are **not** in status position either, yet they are exempted — which shows the intended matcher was **token membership**, and a token matcher convicts every site above. **(a)** define it as *"a literal compared against, or assigned to, an NPC `.status`"* — then none of these match and the verdict exemption becomes unnecessary; or **(b)** keep token membership and declare these two unions' sites by name alongside the verdict union's. The lane adjudicates neither; both are written into §5/§9/A3 so either ruling completes the packet. |
| **R7** ⛔ **new, and it binds beyond this packet** | `EM-PREAMBLE.md` §P2 lists nine registration costs and **edge-shared bundle freshness is not one of them**. Proved here by execution: a JSDoc-only edit to `src/domain/entities/npcs.js` stales `aiCharterBundle` (114 inputs) and `aiOutputSchemaBundle` (115 inputs). **Every EM member that edits any module inside those two closures owes the same regeneration and none of them knows.** Recommend a §P2 addendum and a sweep of the placed and waiting EM packets against the two `inputs` lists. |
| **R2** ⚠ open | Writer-reach disposition, wanted **in advance**: `successors.js` sits inside the surface closure and is not behind `SURFACE_CLOSURE_STOP`. A shrink is `--write`; growth is a mint and a chair act. Confirm so the implementer is not deciding at a red. |
| **R4** ⚠ open | Ratify the one reading row 4 changes: an NPC stored as `'imprisoned'` or `'killed'` becomes AVAILABLE. Measured inert (no writer assigns either to `.status`). |
| **R8** ⓘ no action forced | Doc drift: `DESIGN_EDIT_MODE_AND_DECREES.md:217` still reads *"added to the typedef by EM-B1a"*; addendum 5 moved it here and put this packet first. `:313` already spells EM-B1d. |
| **R1, R5** | ✅ **RULED** (addenda 6 and 7) and recorded as settled rather than re-raised. |

---

## 10. THE ONE THING THAT WOULD HAVE SHIPPED SILENTLY

The packet Markdown handed to this lane was **version 1's pre-ruling eight-file document**: its
header, §2a and §3 had been rewritten to the five-file `NpcStatus` half, but §2, §5, §6, §7, §9,
§10, §11 and §12 still carried `status.js`, `affordanceManifest.js`, `targetRosters.js`,
`STATUS_RUINED`, `effectiveStatus` and an eighth acceptance case — **none of which the accompanying
`EM-B1d.manifest.json` had.** Because `validate` never compares the §7 table to the JSON
`changeManifest`, that disagreement would have passed every gate, and the implementer — for whom §7
*is* the authority — would have edited three files the manifest never reserved, on a packet whose
override caps the roster at five. Version 2 reconciles the whole document to addenda 6 and 7, adds
nothing the rulings did not order, and records the reconciliation in a new §0.

---

## 11. WHAT THIS LANE DID NOT DO

Ran no vitest, no eslint, no npm script, no build, no writing script. Wrote nothing outside
`$SP/lane-preproof-EM-B1d-scratch/`. Touched neither the consist, nor `$SP/lane-em-b3b`, nor any
other lane dir, nor the ledger's working files (the ledger was read only through `git show`).
Promoted no status (still **DRAFT**), stamped no verified base (still `__BASE__`), stamped no
preamble hash (measured and quoted, left for the chair). Raised no budget. Named no symbol it did
not prove present. Adjudicated nothing: R2, R4, R6, R7 are the chair's.


---
---

# DELTA REPORT — the chair's rulings applied (version 3, 2026-09-19 ~15:4x EDT)

Same lane, same path law, no gates run. Packet is **version 3**, still **DRAFT**, base still
`__BASE__`.

## Sites changed, per ruling

| ruling | where it landed |
|---|---|
| **R6** option (b) | **§6** — a new subsection carrying the matcher in ONE sentence with no discretionary word (named status vocabularies through any `Object.freeze(`/`new Set(` nesting, plus `.status` comparison chains), the register's three arms, and the measured ~60-row cost. **§9 A3** — rewritten: register asserted SET-EQUAL both directions, two guard-the-guard arms, all three ruled exemptions spelled with their reasons. **§7** — a second `CREATE` row for the register. **§11** — two new STOPs (register growth; chair prefers inline). **§13 R6** — ruled, with the pricing caveat. |
| **R2** writer-reach | **§8 step 7** — run it, RECORD the verdict, never write a baseline; no movement expected; SHRINK is the chair's at landing through the instrument's own door. **§11** — GROWTH is a STOP. **§13 R2** — ruled. |
| **R4** ratified inert | **§6** — the ratification plus the two `git grep` commands and their full site lists, so the next reader does not re-find them. **§13 R4** — ratified. |
| **R7** landed | **header** — the stamp hash is now `1cf54427…`, with `95e9a5f4…` kept as the read-tip fact. **§7 ledger** — the row renamed **P2.10** and a new **P2.11** added, both citing the preamble by row number. **§13 R7** — accepted/landed. |
| **placement** | **Collision group** and **§7.1** — the chair's withdrawal of STALE EM-P2 v2 at placement recorded; the three "EM-A1 holds it at DRAFT" claims were already corrected in v2 and are re-confirmed at the current tip. |
| **first-paint** | **§8 step 8** — the build lane READS the closure figure from a real `npm run build` and quotes it; no edit, no re-mint. **§11** — STOP here for the chair rather than discovering it at the terminal. |
| **R8** | **§13 R8** — noted as the chair's; the packet now cites **design §19 ruling 7** by section+item, because the line number moved under measurement (`:313` → `:315`). |

## The walker's final budget

| | |
|---|---:|
| `tests/lint/statusUnionTotality.walker.test.js` | logic only, **≤250 eff** — one `describe`, four `it` |
| `tests/lint/.status-union-exemptions.json` | **~60 rows**, data only, no logic, no census effect |
| Handwritten files total | **8** of ≤12 |
| Generated artifacts | **4** (unchanged) |
| Acceptance cases | **7** of ≤8 (unchanged) |

The register was extracted because it is **~60 rows, not a handful** — see "what gives me pause".
Dot-prefixed `.json` ⇒ `enumerateInvariants` filters `/\.test\.(js|jsx)$/`, so it owes **no**
mutation-coverage row and moves **no** census figure; the predicted census delta is unchanged at
`+1 files / +0 parked / +1 credited / +4 titles / +1 suiteTitles`.

## Final change manifest — 12 rows

```
MODIFY      src/domain/entities/npcs.js
MODIFY      src/domain/density/factionLifecycle.js
MODIFY      src/domain/entities/successors.js
MODIFY      src/domain/worldPulse/envoyCasting.js
MODIFY      src/domain/worldPulse/magicFormsPractitioner.js
CREATE      tests/lint/statusUnionTotality.walker.test.js          (absent+untracked at a41a0e109 AND 816fc95e9)
CREATE      tests/lint/.status-union-exemptions.json               (absent+untracked at both)
REGISTER    scripts/mutation-coverage-manifest.json                (705 -> 706)
MODIFY      supabase/functions/_shared/aiCharterBundle.js          ] the four GENERATED artifacts,
MODIFY      supabase/functions/_shared/aiCharterBundle.meta.json   ] regenerated by
MODIFY      supabase/functions/_shared/aiOutputSchemaBundle.js     ] `npm run build:edge-shared`,
MODIFY      supabase/functions/_shared/aiOutputSchemaBundle.meta.json ] never by hand
```
No duplicate paths. JSON parses; `parsePacketHeader` returns heading=EM-B1d, status=DRAFT.

## Final requiredSymbols — 9 rows (unchanged from v2)

`npcs.js::NpcStatus` · `factionLifecycle.js::export const ROSTER_ABSENT_STATUSES` ·
`envoyCasting.js::export function rosterPersonAvailable` · `magicFormsPractitioner.js::const LOST_NPC_STATUS` ·
`successors.js::export function inferSuccessors` · `mutationCoverage.shared.mjs::export const ENFORCER_DIRS` ·
`chooserTotality.walker.test.js::const SCAN_ROOTS` · `status.js::EntityStatus` ·
`npcVerdictTable.js::export const HOLDING_VERDICT`

## Verified for you

- `4da740b52` is real and landed **after** my read tip; its preamble hashes
  **`1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6`** — matches your statement to
  the byte, and is **unchanged at the current tip `816fc95e9`**. §P2 rows 10 and 11 read as you said.
- **`design §19 ruling 7` resolves** (`## 19. The survey of the simulation's forks…`, item 7).

## ⚠ What gives me pause

1. ⛔ **R6's premise — "a false positive costs one declared row" — is refuted by measurement for two
   tokens, and that is the one thing the ruling did not price.** Token membership at its widest
   flags **110 files (102 exemption rows)**, including `DialogClose.jsx`. Read as the ruling's own
   key shape requires (file **+ union name**, so: named vocabularies), it flags **27 vocabularies**
   plus **56 `.status` comparison sites across 37 files** — roughly **sixty** rows, of which ~17 say
   only *"this is `ACTIVE_STAGES`, not `NpcStatus`"*. **Root cause, measured: `'active'` (77 files)
   and `'removed'` (33 files) are members of `NpcStatus` AND of the institution/stressor
   vocabularies** — the same homonym class as `vacant` in `SummaryTab.jsx` and the `ruined`/`remnant`
   split addendum 6 used to rule the `EntityStatus` half out. I applied the ruling as written and
   moved the rows to a sibling register rather than narrowing the matcher myself; **if sixty declared
   exemptions is not what you intended, that is the line to re-rule.**
2. ⚠ **The consist moved twice while I worked** (`a41a0e109` → `4da740b52` → `816fc95e9`). The
   substrate is **still unmoved** across the whole span — so the base may be stamped at either — but
   the base must be read and the one-line window re-run **in the same command as the dispatch**.
3. ⓘ **A measurement of mine was briefly wrong and is corrected on the record:** the first
   comparison-site probe used `\s`, which POSIX ERE does not support, and returned a false **1**
   file; redone with `[[:space:]]` it is **56 sites across 37 files** — which is most of what makes
   R6's register large. Both the error and the correction are in evidence §21.3.
4. ⓘ **Design line numbers moved under me** (`:313` → `:315`) between two reads in one session. The
   packet now cites by section+item. Worth a standing note for the other pre-proofs.


---
---

# DELTA REPORT 2 — R6′ measured and applied (version 4, 2026-09-19 ~16:0x EDT)

## The numbers you asked for, before anything was rewritten

**Per-member homonym table** (non-test `src/`, **code only** — comments stripped):

| member | src files | foreign declared vocabularies | verdict |
|---|---:|---|---|
| `'active'` | **74** | **11** — `ACTIVE_STAGES` ×4, `ACTIVE_STRESSOR_STAGES` ×2, `ACTIVE_UI_STAGES`, `ACTIVE_FLOW_STAGES`, `ACTIVE_SYNERGY_STAGES`, `STRESSOR_LIFECYCLE_STAGES`, `THREAT_STAGES` | ⛔ HOMONYM |
| `'removed'` | **30** | **8** — `INACTIVE_STATUS`, `RUIN_STATUS`, `INACTIVE_STATUSES`, `NONSTANDING_STATUS`, `DEAD_ENDPOINT_STATUS`, `TRANSPORT_DOWN_STATUSES`, `RUINED_STATUS`, `DEAD_EDGE_STATUSES` | ⛔ HOMONYM |
| `'missing'` | **5** | **3** — `STASIS_REASONS` ×3 | ⛔ HOMONYM |
| `'jailed'` | **3** | **3** — `VERDICTS`, `VERDICT_CAUSES`, `AUTHORITY_VERDICTS` | ⛔ HOMONYM |
| `'dead'` | **8** | **0** | ⭐ TRIGGER |
| `'exiled'` | **4** | **0** | ⭐ TRIGGER |
| `'retired'` | **1** | **0** | ⭐ TRIGGER |

- **TRIGGER SET = `{dead, exiled, retired}`** — three tokens. Not empty, not single.
- **Files flagged: 8.** Of those, **the five known consumers: 5**. **NEW: 3.**
- ⭐ **EXEMPTION ROWS: 0** — all eight flagged files are genuine `NpcStatus` consumers; not one is a
  foreign vocabulary. Far under your ~15 bar, so I applied it rather than returning the table alone.
- **R6′(4) cannot-catch: NO qualifying site at the tip.** The single probe hit
  (`crisisLifecycle.js`, `n.status === 'active'`) is a **stressor** — `const n = normalizeStressor(st)` —
  not an NPC, and is a single positive test, total by construction. Nothing joins the roster by hand.

Your expectation was `exiled`, `jailed`, `retired`, perhaps `dead`/`missing`. The measurement agrees
on `exiled`/`retired`, **adds `dead`** (8 files, zero foreign vocabularies), and **removes `jailed`** —
`jailed` is a member of all three verdict vocabularies, so it is a homonym. That does not weaken the
guard: the trigger decides *which files are consumers*, while the totality assertion still demands
every non-`active` member of the live typedef — `jailed` included — in each roster row.

## Register: INLINE. Why

Zero rows. An empty register does not earn a sibling data file, so the `CREATE` row for
`tests/lint/.status-union-exemptions.json` added under the withdrawn option (b) is **removed** and
the register is declared inline as empty-by-default. The whole contract — trigger, roster, register,
cannot-catch — now reads in one leaf at **~110 effective of ≤250**.

## Re-priced

| | v3 (option b) | **v4 (R6′)** |
|---|---:|---:|
| changeManifest rows | 12 | **11** |
| Handwritten files | 8 | **7** |
| New TEST leaves | walker + register | **walker only** |
| Walker leaf | logic only (~60 rows elsewhere) | **~110 eff of ≤250** |
| Exemption rows | ~60 | **0** |
| Consumer roster | 5 | **8** |
| requiredSymbols / acceptance cases / checks | 9 / 7 / 11 | **9 / 7 / 11** (unchanged) |

⭐ **The lighting delta is UNCHANGED** — `+1 files / +0 parked / +1 credited / +4 titles /
+1 suiteTitles`. The withdrawn register was a dot-prefixed `.json`, which `enumerateInvariants`
(`/\.test\.(js|jsx)$/`) never counted, so removing it moves no census figure. Predicted interior red
stays `expected 2647 to be 2646`.

## A3 rewritten

Trigger set **derived** from the live typedef and asserted to be exactly `{dead, exiled, retired}`
(reds if it comes out empty or single); flagged set **set-equal both directions** to roster ∪
register; each roster row total **or** carrying its one-line reasoned omission — so adding `jailed`
to the typedef reds every roster file that omits it; three guard-the-guard arms (matcher fires on a
plant; an exempted file still contains its vocabulary; a roster file still contains a trigger
token); and the cannot-catch **asserted, not assumed**.

## ⛔ R9 — NEW, AND THE REASON THIS RULING PAID FOR ITSELF

**R6′'s trigger found three `NpcStatus` consumers the compile roster missed**, and one is a seat file:

```
warSeatBooks.js:102    if (String(npc.status||'').toLowerCase() === 'dead' || isOffStage(npc)) return null;
                       comment: "…their character must never continue making decisions."
npcLadderState.js:206  if (excludeDead && String(n.status||'').toLowerCase() === 'dead') return;   (+ isOffStage at :201)
npcLadderKernel.js:660 || String(member.status||'').toLowerCase() === 'dead' || isOffStage(member)) continue;
```

All three pair `=== 'dead'` with `isOffStage(...)` — a coherent house idiom (*"dead, or off stage"*),
not an enumeration of absent statuses — so all three take **roster rows with reasoned omissions and
NO EDIT**. Editing any would be a sixth production file against the narrowed override of five, which
is a §11 STOP.

⚠ **But `warSeatBooks.js` is a SEAT read, and design §15 rules *"a jailed or exiled holder cannot
keep a seat."*** A jailed holder would still be returned by it. **It is inert today** — no writer
produces `jailed` until EM-B1a — so nothing is broken now and this packet cannot be the fix.
**Rule whether that arm belongs to EM-B1a's ops layer, to EM-B1e, or to a repair of its own.** Note
the walker will red that file the moment the roster demands totality without the omission: that is
the guard doing its job on the first day it exists.

## Accepted

Pauses #2 (re-run the window in the same command as the stamp) and #4 (cite design by section+item)
noted as standing practice. Everything else in version 3 stands unchanged.


---
---

# DELTA REPORT 3 — R9 ruled: EM-B1f chartered (version 4 final, 2026-09-19 ~16:1x EDT)

## Applied

1. **The three roster rows** (`warSeatBooks.js`, `npcLadderState.js`, `npcLadderKernel.js`) now
   carry the ruled omission naming **both the idiom and the owner**: *"pairs `=== 'dead'` with
   `isOffStage`, the ONE participation chokepoint (`src/domain/roads/state.js` §8 `:146-161`, built
   on `isInStasis`); status-based absence joins that chokepoint in **EM-B1f**, not here."*
   `warSeatBooks.js` additionally keeps its "⚠ a **seat** read" marker.
2. **New §12.1 · Recorded follow-ups** carries **EM-B1f** — the status-based arm at the chokepoint,
   with the measurement it owes stated (does any generated or pulse-written NPC carry
   `exiled`/`retired`/`missing` today; would the arm move a pulse golden or the fence?) — marked
   **"chartered by the chair, 2026-09-19"**, ordered **after EM-B1d** and ⛔ **blocking EM-B1a's
   promotion**, with your reason recorded: a producible `jailed` without the chokepoint arm is a
   jailed mayor who still governs (design §15).
3. **§13 R9** marked ✅ RULED, naming why it is none of EM-B1d / EM-B1a / EM-B1e.

## ⭐ Your citation verified before I wrote it in

`src/domain/roads/state.js:146` is literally `── §8 THE ONE PARTICIPATION CHOKEPOINT ──`;
`isOffStage` = `isInStasis(npc) || whereabouts.state === 'hostage'`, importing `isInStasis` from
`npcOps.js` at `:34`. **And the chokepoint's own law argues your case:** *"TRAVELERS … are NEVER
off-stage — travel is narrative, **captivity is mechanical** (§1 law 5)."* A jailed NPC is
captivity. ⓘ One measurement that sharpens EM-B1f's brief: **`isOffStage` never reads `.status`
at all** — only `isInStasis` and `whereabouts` — so the arm is genuinely new work at that predicate,
and one arm there reaches all three consumers, which is exactly your reading.

## ⭐ Manifest needs NO change — confirmed field by field

| field | verdict |
|---|---|
| `changeManifest` (11) | **no row owed** — none of the three files is edited |
| `requiredSymbols` (9) | **no row owed** — nothing in them must be preserved; the walker reaches them through its roster, by path |
| `acceptanceCases` (7 of ≤8) | **unchanged** — A3 already binds the roster generically (set-equal both directions; each row total **or** carrying its reasoned omission). The three rows are data inside the walker, not new cases |
| `checks` (11) | **unchanged** — a documentation-only change owes no suite |
| budget / census | **unchanged** — 5 modified, 7 handwritten, ~110 eff of ≤250; lighting delta still `+1/+0/+1/+4/+1` |

Also measured: `warSeatBooks.js`, `npcLadderState.js`, `npcLadderKernel.js` and `roads/state.js` are
**unmoved across the entire window** (`d31af2cee` → `816fc95e9`), and none is substrate — so the
J-T1 window and the dispatch's substrate arm are untouched.

## FINAL STATE — EM-B1d version 4, DRAFT, READY-able

Three files in `lane-preproof-EM-B1d-scratch/`: `EM-B1d.md`, `EM-B1d.manifest.json`,
`EM-B1d.evidence.md` (+ this report). Header parses: status `DRAFT`, heading names `EM-B1d`.
Manifest JSON parses; 11 change rows, no duplicates; 9 `requiredSymbols`; 7 acceptance cases; 11
checks.

**What remains is yours alone:** substitute `__BASE__` in **both** files with the sha read in the
same command as the dispatch; stamp the preamble hash
`1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6`; stamp the lighting absolute at
promotion; withdraw the STALE EM-P2 at placement; flip DRAFT → READY.
