# EM-R0d — OPUS PRE-PROOF RE-RUN, VERSION 4 (read tip `578272a99`, 2026-09-20 12:47–13:1x EDT)

## VERDICT: ⭐ **READY-ABLE at `578272a99`** — version 3's one condition is DISCHARGED

FIX-C2 has composed. Every claim was re-measured at the composed, refrozen tip; the TEST row over
`dossierLabelCase.test.jsx` is re-cut over FIX-P5's file; **nothing blocks.** Three things the chair should read
before placing: a **new gate-wired citation walker** that did not exist at version 3 and whose margin now binds
the defence edit (STOP-9), a **one-line budget breach** in version 3 that is corrected, and **two withdrawn
absolutes**. There are no open questions — version 3's Q1 was ruled by addendum 72 and is closed in the text.

**The four files (COPIES; the chair validates and places — nothing was written to the kit, the tree or any lane):**

- `$SP/lane-preproof-EM-R0d-v4-scratch/EM-R0d.md` — version 4, Status `DRAFT` (the value alone on its line)
- `$SP/lane-preproof-EM-R0d-v4-scratch/EM-R0d.manifest.json` — 12 change rows · 11 `requiredSymbols` ·
  `retiredSymbols: []` · 8 acceptance cases, each `{id, case}` · **8 check commands**, with
  `tests/lint/sourceCitationIntegrity.walker.test.js` joining check #4 beside the wiring-census walker
  (no `checks` command is a generator, so brief step 14(a)'s ordering rule still has nothing to order).
  Validated with the shipped `parsePacketHeader`: the v4 header parses `status: "DRAFT"`, the value alone on
  its line.
- `$SP/lane-preproof-EM-R0d-v4-scratch/EM-R0d-v4.evidence.md` — G-1…G-14; D-, E- and F- sections untouched
- `$SP/lane-preproof-EM-R0d-v4-scratch/EM-R0d-v4.report.md` — this file

**The preamble hash to stamp:** the tip the chair PLACES at. At the read tip `578272a99` it is
`ce516004a5d8e680f4160b03ce660c66d78261988b78a82239664c596600af4b`; at `2dc08a595` — one commit later, the
fourth amendment — it is `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`. Both measured (G-1).

---

## 1. The window — exactly the three movers, and a false-empty that nearly hid them

`141a1d775..578272a99` is **36 commits**. Over all fourteen change-manifest and `requiredSymbols` paths,
measured ONE PATH PER INVOCATION:

| path | delta | commit | verdict |
|---|---|---|---|
| `tests/components/dossierLabelCase.test.jsx` | +93 / −2 | `7dea316c7` FIX-P5 | the TEST row is RE-CUT over it (§2) |
| `src/domain/prose/holderTable.js` | +1 / −1 | `ee2406191` FIX-C2 | **COMMENT-ONLY** — a `columnCensus` JSDoc citation `institutionTable.js:582 → :596`. Admitted |
| `tests/build/domainGeneratorsBoundary.test.js` | +3 / −1 | `cbb4fc4f2` FIX-C2b | **COMMENT-ONLY** — the header's `~22.7k LOC` re-measured. Admitted |
| the other **eleven** | *(none)* | — | unchanged, byte for byte |

⛔⛔ **A HAZARD WORTH THE BRIEF'S FOOT (G-2b).** My first run of this step built the fourteen paths into a shell
variable and passed it unquoted. It printed **nothing and exited 0** — "not one byte of any declared path moved",
which is false. **zsh 5.9 does not word-split unquoted parameter expansions** (`set -- $P` → `argc=1`), so a path
LIST in a variable is ONE pathspec, matches no file, and `git diff` reports an empty window. This is the twin of
the chair's GREP LAW. **A J-T1 window is measured one path per invocation, or with literal arguments — never
from a variable.**

## 2. The TEST row, RE-CUT over the composed file

FIX-P5 added one `test` (`'no dossier component types a shouted word into its content'`) inside the existing
`describe` at `:287`, and widened the imports (`readdirSync`/`statSync`, `join`, `espree`'s `parse`). Three
consequences, all measured:

1. **The file is now CREDITED `titles 14 · suiteTitles 6`** (was 13 · 6). Version 3's §7 row said 13 and is
   superseded. The lighting DELTA is unchanged in shape — the cure still adds no title (G-4).
2. **The guard arm at `:234` now reads THREE sources**, not two: `READINESS_LABELS` vs `GENERATOR_SRC`
   (`:239-241`), `FOOD_SECURITY_LABELS` vs `FOOD_SRC` (`:242-244`), `CRIMINAL_STRUCTURE_LABELS` vs `CRIMINAL_SRC`
   (`:245-247`). The cure replaces the first two with array equality against the leaf's tables and **leaves the
   criminal arm alone**.
3. ⛔ **THE CURE MUST ALSO DELETE TWO CONSTS.** `GENERATOR_SRC` (`:223`) and `FOOD_SRC` (`:224`) have no other
   use; leaving them reds `no-unused-vars` at §10's bare `npx eslint`. Version 3 did not say so. `readFileSync`
   and `resolve` stay live — the criminal arm and FIX-P5's new arm at `:352` both use them, so P5 has in fact
   made the cure *safer* than it was.

The re-cut, against the composed file:

```diff
+import { FOOD_SECURITY_BANDS, READINESS_BANDS } from '../../src/data/bandLadders.js';

-const GENERATOR_SRC = resolve(process.cwd(), 'src/generators/defenseGenerator.js');
-const FOOD_SRC = resolve(process.cwd(), 'src/generators/foodGenerator.js');
 const CRIMINAL_SRC = resolve(process.cwd(), 'src/domain/display/defenseDisplay.js');

   test('the band vocabulary this arm walks is real, and still spelled this way at its source', () => {
-    const src = readFileSync(GENERATOR_SRC, 'utf8');
-    const missing = READINESS_LABELS.filter((l) => !src.includes(`'${l}'`));
-    expect(missing, 'a readiness label this file names is no longer in the generator').toEqual([]);
-    const foodSrc = readFileSync(FOOD_SRC, 'utf8');
-    expect(FOOD_SECURITY_LABELS.filter((l) => !foodSrc.includes(`'${l}'`)),
-      'a food-security label this file names is no longer in the generator').toEqual([]);
+    expect(READINESS_LABELS, 'a readiness label this file names is no longer in the leaf')
+      .toEqual(READINESS_BANDS.map((b) => b.label));
+    expect(FOOD_SECURITY_LABELS, 'a food-security label this file names is no longer in the leaf')
+      .toEqual(Object.values(FOOD_SECURITY_BANDS).map((b) => b.label));
     const crimSrc = readFileSync(CRIMINAL_SRC, 'utf8');            // ⛔ UNTOUCHED
```

**Do R0d's cases red FIX-P5's census? NO — structurally (G-4b).** P5's arm walks `JSXText` nodes under
`src/components/new` only, skipping `.test.` files. R0d touches no dossier component, so the law's habitat is one
this packet never enters. Measured anyway with P5's own `SHOUT` detector: **none of the twelve band labels is
convicted**; both controls behave (`'STILL RELEVANT TODAY'` true, the three-letter `'REQ = …'` false). The leaf's
SCREAMING_SNAKE table names and this packet's ALL-CAPS case texts *are* shout-shaped, but they are identifiers
and test titles in `src/data/` and `tests/domain/`, outside the walk. **The law does not change R0d's cases.**

## 3. ⛔⛔ The one genuinely new thing: a gate-wired citation walker

FIX-C2/C2b landed `tests/lint/sourceCitationIntegrity` (+938 lines). `CODE_TREES = ['src','tests','scripts']` are
gated **with no baseline and none coming**. Version 3 could not have seen it. Measured (G-5):

- **ARM 1 is past-EOF ONLY, not exact-line** — so R0d's `−18` shift does not, by itself, red it. ARM 3 (moved
  symbol) and ARM 4 (bare `:NNN`) are report-only.
- 16 live-code and 16 live-doc citations address this packet's four files. At the tip: ARM 1 **0** findings,
  the docs baseline **0** rows, novel **0**, cleared **0**.
- Under this packet's measured shrinks, **0** citations in either corpus go past EOF.
- ⛔ **THE MARGIN, NAMED:** `defenseGenerator.js:639` is cited twice (`defenseStateProse.js:1560`,
  `defenseStateProseDesk.test.js:1611`) against a **653-line** file — **14 lines of headroom**. The defence edit
  is `−5`. → §3 gains a budget row, §11 gains **STOP-9**, and the walker joins `checks`.

## 4. What else changed, and what held

**Corrected or withdrawn:**

| fact | version 3 | version 4 | why |
|---|---|---|---|
| `dossierLabelCase.test.jsx` titles | 13 · 6 | **14 · 6** | FIX-P5 added one `test` (G-4) |
| `EAGER_FIRST_PAINT_MODULES` | 268, sha `f21c167b…` | **269, sha `a9f1f4e8…`** | the composition added one (G-10) |
| worker byte estimate | +1,801 … +2,205 | **+1,801 … +2,268**, room **1,046 B** | a third transcription (G-9) |
| `foodGenerator.js` delta bound | `≤ 20` net | **`≤ 25`** | the edit measures **−21** and breached it by one line (G-9) |
| manifest population | 193 (190 L · 2 S · **1 READY**) | **194 (192 L · 2 S · 0 READY)** | **EM-P2 has LANDED** (G-11) |
| mutation-coverage manifest | "held by EM-P2 (READY)" | **FREE** — 31 namers, all LANDED | same (G-11) |
| lazy-engine margin | "~700 B of margin today" | **stale** — FIX-B2 bought 35,079 B | (G-13) |
| Q1 (the citation row vs the cap) | open | **CLOSED** by addendum 72 | the chair ruled |

**Discharged by execution:** version 3's noticed item 9. The four `generator-write` rows are at
`historyEventStrands.js:42`, `factionLeaderSecret.js:56`, `npcGenerator.js:170`, `defenseGenerator.js:552`; the
path arm strips the line, and the withdrawn `.not.toContain('…defenseGenerator.js:608')` needs the file to GROW
56 lines. **Neither arm can red on this edit** (G-7).

**Held, each re-executed (G-6, G-8, G-12, G-14):** STOP-7 re-swept at the composed tip finds **no seventh
anchor** (nine new candidates cleared, and `tests/joins/labelJoins.test.js` — the one that looked dangerous —
discharged: institution-NAME signatures, growth-only assertion, `src/data` unscanned). All **eleven**
`requiredSymbols` resolve `1x`; `BASELINE_EDGES` is now `:62` and `HOLDER_SOURCES` `:164`. CREATE targets absent,
homonym present. Tuning `48 · 46 · 63`. Prose-numerics 218 rows, none mine. Wiring-census `stamp.files` 7, none
mine; `--check` **green** (708 pools / 2266 variants / 165 relation rows / 7 stamped files, exit 0); and
`producerIndex()` walks `src/generators` + `src/domain` only, so **`src/data` is not walked** and preamble row
13's census row does not fire. Edge-shared: none of the five metas' `inputs` names a path of this packet's, so
none of the SEVEN generated paths is owed. Size-baseline: none mine. Mutation coverage: no row owed. The
voice-mechanics cure is sound for a reason now read off the shipped counter — `countFile` suppresses the em dash
for an allowlisted `(rel, text)` pair, and comments are not in the AST, so the leaf contributes exactly one
em-dash literal and the re-key zeroes it.

**The goldens (G-13):** CURE-J's test change IS in the tip (`c127cdfb2`), but the fixture still carries the OLD
provenance (`recordedOverSha a62dcbb9…`), exactly as the chair said. A6's claim is measured against the tip's
fixture as it stands — `dossier-prose-manifest-golden.json` sha256 `921c51cf…`, `generator-golden-master.json`
sha256 `7177cd6e…`. When CURE-J's re-record composes, the golden moves for CURE-J's reason, not R0d's.

## 5. The placement statement for the chair

> **EM-R0d, version 4, READY at `<tip>`.** The J-T1 window `141a1d775..<tip>` over every change-manifest and
> `requiredSymbols` path is exactly three files — `tests/components/dossierLabelCase.test.jsx` (FIX-P5's
> badge-capitals law, over which this packet's TEST row is re-cut) and two COMMENT-ONLY citation movers,
> `src/domain/prose/holderTable.js` and `tests/build/domainGeneratorsBoundary.test.js`. All eleven
> `requiredSymbols` resolve `1x` verbatim and survive the packet's own edits; `retiredSymbols` is `[]`; both
> CREATE targets are absent and the `src/domain/compendium/bandLadders.js` homonym is present and untouched.
> Twelve change rows, no `_pending` row left open — version 3's Q1 is closed by addendum 72 and its three drafted
> cures are all re-measured live. Preamble SHA-256 `<the hash at the placement tip>`.

**Index rows** (no status word but READY):

- `EM-R0d — the band ladders get one home, so a band check can read the producer's own table.`
- `Four frozen named tables plus four total functions in src/data/bandLadders.js; the three producers re-pointed; byte-identical output.`

## 6. ⛔ Noticed and not touched — each specific enough to slot

1. **The zsh false-empty pathspec (G-2b)** — a J-T1 window built from an unquoted variable prints empty and exits
   0. Every pre-proof in this family runs that command. → **a line in `LANE-EM-PREPROOF.md`'s foot, beside the
   GREP LAW.**
2. **`src/domain/display/stateProse/generalStateProse.js:40` cites `foodGenerator.js:342`** — the exact line this
   packet deletes. Ungated (ARM 1 is past-EOF only), but it becomes a lie. → **the citation sweep; named in §12.**
3. **`defenseStateProse.js:1560` and `defenseStateProseDesk.test.js:1611` cite `defenseGenerator.js:639`**, which
   slides to `:634` — and they are the pair that sets STOP-9's 14-line margin. → **same sweep; named in §12.**
4. **`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5295` cites `foodGenerator.js:339-357`** — the chain this
   packet deletes — and `defenseGenerator.js:525-531`. Docs ARM 2 is a past-EOF ratchet, so it does not gate at
   these lengths. → **the citation sweep (version 3's Q5, still open).**
5. **`tests/lint/proseEntryContradiction.walker.test.js:29` and `:393` both cite `factionDynamics.js:466`**,
   which shifts `−18` to `:448`. The field feeds failure MESSAGES only. → **the citation sweep.**
6. **`stamp.producerIndexFiles` in `docs/content/wiring-census.json` moved 1171 → 1172** and is a NUMBER, not a
   list — version 3's noticed item 6 is still uncorrected in the compile brief's step 15. → **that wording fix.**
7. **`tests/build/generationWorkerLazy.test.js` is PARKED** (`SUITE_NOT_RUNNING:describe.runIf()` + 5
   `TEST_UNREGISTERED:it`), re-confirmed at this tip: any packet that ever prices a title there prices a phantom.
   → **the pre-proof brief's step 14(b).**
8. **`ENGINE_SHARED_DOMAIN` is not exported from `vite.config.js`**, so the amended §P2 row 11's "import the set"
   instruction can be honoured for `EAGER_FIRST_PAINT_MODULES` but NOT for ESD — the only route is a replica,
   which is what the row exists to forbid. → **either export it, or the row should say so.**
9. **`tests/joins/labelJoins.test.js`'s frozen counts are hand-audited per file and shrink-only in one direction
   only** (`total > allowed`), so a conversion that removes a label-join site leaves a stale high-water number
   nobody reds on. Harmless here; it is a ratchet that cannot detect its own slack. → **a lane of its own, or a
   line in the file.**

## 7. Gate posture

**No gated step was run and none is owed by this pre-proof.** Every probe above is plain `node` or `git`: the
lighting classifier was extracted verbatim from the walker's own lines 771-1670, the citation and
`generator-write` measurements ran the SHIPPED engines, and the worker bytes ran esbuild's `transform` directly.
No vitest, no eslint, no npm script, no build. `git status --short` at the read tip was EMPTY at start and at
end. The packet's own gated commands are unchanged in §10 and belong to the build lane.
