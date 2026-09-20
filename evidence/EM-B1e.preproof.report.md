# EM-B1e — Opus PRE-PROOF report

**Verdict: ⭐ READY-able.** No premise was refuted. Three defects *inside the packet* were found and
fixed, four obligations were priced to zero by execution, and three couplings the draft never knew
about were added.

**Lane:** Opus PRE-PROOF, session 7d3418f8, 2026-09-19 ~17:3x–18:0x EDT.
**Tree read:** `$SP/read-tip-58fcfe614` @ `58fcfe61458b784b0470b854caf916b7c2961edf` (confirmed).
**Wrote only under** `$SP/lane-preproof-EM-B1e-scratch/`. Nothing edited, staged or committed
anywhere; no vitest, no eslint, no npm script, no build.

## The four file paths

| file | note |
|---|---|
| `$SP/lane-preproof-EM-B1e-scratch/EM-B1e.md` | promotable packet, **version 2**, Status DRAFT |
| `$SP/lane-preproof-EM-B1e-scratch/EM-B1e.manifest.json` | JSON-validated; 5 requiredSymbols, 7 cases, 10 check arrays |
| `$SP/lane-preproof-EM-B1e-scratch/EM-B1e.evidence.md` | ⚠ **STARTED by this lane** — §1–§23 |
| `$SP/lane-preproof-EM-B1e-scratch/EM-B1e.preproof.report.md` | this report |

⚠ **The packet had NO evidence file.** None existed in `packets-waiting/` or `evidence/`, so §1–§23
are its first receipts. Nothing was rewritten.

## Preamble hash — verified, left unstamped

```
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6
```
**Matches the chair's stated value exactly.** CONFIRMED.

## The J-T1 window — EMPTY

```
$ git -C … rev-parse HEAD; git -C … diff --stat d31af2cee 58fcfe614 -- \
    src/domain/worldPulse/calamityKernel.js tests/domain/ruinInstitution.test.js \
    src/domain/provenance/rosterProvenance.js src/domain/worldPulse/causeLifecycle.js \
    src/domain/entities/status.js tests/lint/sovereigntyLightingContract.walker.test.js
58fcfe61458b784b0470b854caf916b7c2961edf
(exit 0)   ← NO OUTPUT
```
Per-path blob identity: `calamityKernel` `73c5203…`, `rosterProvenance` `ad44785…`, `causeLifecycle`
`d4405a8…`, `status.js` `190fae9…` — **all IDENTICAL base → tip.** Every §5 line number is exact.
CREATE target absent on disk and unknown to git. `d31af2cee` IS an ancestor. All CONFIRMED.

## The five chair questions

**1 — EM-B1d disjointness, the walker, and where `ruined` went.**
⭐ **Disjoint, CONFIRMED**, and the walker cannot bite. `calamityKernel.js` contains **none** of the
trigger literals (`grep -n "'dead'\|'exiled'\|'retired'"` → exit 1, no output), so it is not among
the walker's eight flagged files; and the walker scans `src/`, while the CREATE lives under `tests/`.
No path is shared with EM-B1d's seven.
**`ruined` did not go to a typedef at all.** EM-B1d §2a: *"`EntityStatus` is NOT widened … EM-B1a's
`set-institution-state` offers the pool of five and, for `ruined`, writes the pulse's own shape
through EM-B1e's shared `ruinInstitution` writer."* ⇒ **EM-B1e owes no `ruined` member**; it already
exists as the pulse's literal in `rosterProvenance.js:81`
`INACTIVE_STATUSES = Object.freeze(['removed','destroyed','remnant','ruined'])`. ⚠ **The charter's
EM-T3 row is stale prose** (still says "`jailed` and `ruined` into the two typedefs") — flagged as
**R5**, not adjudicated.

**2 — FLOATS, so deltas only.** Charter amendment 17:26 EDT quoted in full in evidence §7; it
supersedes the two older EM-T5 rows and version 1's "rides in T3". Every absolute is gone. The
census DELTA is `+1 files / +0 parked / +1 credited / +7 titles / +1 suiteTitles`, corroborated
against EM-B1d's independently-derived `+1/+0/+1/+4/+1` for the same shape with four `it`. Version 1
quoted `2645/383/2262/25009/6670`, which matches neither the frozen tuple
(`2646/383/2263/25005/6671`) nor anything else — **removed**.

**3 — `tests/domain` is NOT an enforcer dir.** Executed with a positive control:
```
in an enforcer dir?                          false
basename matches NAME_PATTERN?               false
control sovereigntyLightingContract.walker → true
live invariant count: 705
```
⇒ **No mutation-coverage row is owed**, so `scripts/mutation-coverage-manifest.json` is **not** in
the manifest and **this packet contends with nobody** — and it can still float. (Separately: the
only live non-terminal reserver of that path is **EM-B1d**; EM-P2 and EM-P1 are in the kit, not
placed — the tree manifest holds only `LANDED|SUPERSEDED|READY`, no STALE row survives.)

**4 — Golden sensitivity.** ⛔ **`advanceWorkerByteIdentity.test.js` does NOT cover this claim** — it
compares `sync` to `structuredClone(sync)`, both sides running the same code, so it stays green if
the ruin shape changes. Named in the packet so nobody counts it. ⭐ **The preset witness EXISTS and
is the right instrument**: `tests/simulation/presetLightingWitness.test.js` +
`tests/fixtures/preset-lighting-witness-golden.json`; its header — *"⚠ THIS IS A BYTE GOLDEN OVER
THE WHOLE PULSE… THIS SURFACE HAS NO CAPTURE ARM AND NO ENV SPELLING"* — **confirms** §6's key-order
premise. §10 now names it plus the four measured calamity importers, replacing version 1's *"the
implementer resolves each path at preflight."*
⭐ **And A1 is now implementable**: both `ruin` and its enclosing `applyStrikeToRoster` (`:222`) are
module-private, so the oracle cannot import the writer — it drives the exported `advanceCalamity`
(`:567`) via `calamity.kernel.integration.test.js`'s `runStrike`/`struckOf`, which reach **both**
ruin arms.

**5 — Bundles.** ⭐ **The packet lands in NO budgeted chunk**, so under step 5 it carries **no budget
TEST row and no `npm run build` step**:

| budget | slack | in it? | how measured |
|---|---|---|---|
| Generation worker `= 1401208` | **ZERO** | ⛔ **no** | graph walk, static (220) and static+dynamic (228) |
| Lazy engine `< 679_000` | ~870 B | ⛔ **no** | the chunk rule is `id.includes('/src/generators/')` (`vite.config.js:862`) |
| First-paint eager closure | — | ⛔ **no** | the repo's **own** `computeEagerModuleGraph`, copied verbatim; 243 modules |
| `advanceInterval.worker` | ⚠ **no ceiling** | ⭐ **yes**, static, 3 hops | walk: `worker → advanceInterval.js → pulseKernel.js → calamityKernel.js` |

**Bytes priced anyway, for TOOL-3:** **+270 B minified** (esbuild on the edited region) = **+185 B**
structural (an exported name cannot be mangled; the two explicit `fate:` literals) + **+85 B** A3's
required-argument guard. *PLAUSIBLE as a chunk figure — it is a minified-source delta, not a build.*
⭐ **Sequencing (R6): land EM-B1e BEFORE TOOL-3.** The ceiling law is monotone-down, so a TOOL-3 mint
taken first turns this packet into a **ceiling re-mint (a chair act)**; taken after, it just measures
the post-B1e figure and nothing is owed.

## Brief steps 11 and 12 (added mid-lane)

**Step 11 — the edge-shared rebuild is NOT OWED, proved twice.** The law is real and I verified its
shape first: `build:edge-shared` → `node scripts/build-edge-shared.mjs`, which writes a fresh
`generatedAt` into **every** meta (`:82-83`); precedent landings `ddcfb1f59`, `ee8ac6c3c`,
`58b466afc` are **7 files each**, and `ddcfb1f59`'s own message says *"three siblings byte-identical,
five metas re-stamped in one build window."* It does not apply here:
*Method A* — `calamityKernel.js` is in **0 of 405** inputs across the five committed metas.
*Method B (independent, since a meta could be stale)* — a static+dynamic walk from each of the five
**entries**, returning a strict **superset** of each meta (76/2/125/2/126 vs 74/2/114/2/115), reaches
it from **none**.
⇒ **No `supabase/functions/_shared/**` path is declared, and no command in `checks` runs a generator**
(both `check-*.mjs` entries are readers, no `--write`) — so the seal writes no undeclared path.
⇒ ⭐ **The seven `_shared` paths are NOT shared with EM-B1d v5; disjointness survives its re-cut.**

**Step 12 — no TEST path is owed.** Swept by literal, not field name: `ruined_by_decree` is **absent
from `src/` and `tests/` entirely**; `ruinInstitution` collides with nothing (its only occurrence
anywhere is EM-B1d's prose); `destroyed_by_disaster` occurs **exactly once repo-wide**
(`calamityKernel.js:252`) with no fixture and no pin; the retired `ruin` is module-private and
importable by nothing; **no exact pin on `INACTIVE_STATUSES`** in either direction; **no
export-surface pin** on the MODIFY target.
⭐ **The consequence question, and it paid off.** `worldPulseFate`'s truthiness reader is
`causeLifecycle.institutionDestroyed` (`:137`), whose `true` means a criminal institution's
arrangement can no longer be sustained — **an NPC's criminal leash severs**. For this writer it is
**inert by construction**: `ruinInstitution` emits `_worldPulseInactive`, `status:'ruined'` and the
fate *together*, so the verdict is decided at `:139` and again at `:141` — **three sufficient
signals; the fate value never decides.** **A6 is rewritten into a sufficiency proof** (delete the key,
re-assert `true`), which is strictly stronger than the draft's "the readers branch on no value" and
is the arm EM-B1d's packet lacked.
⛔ **R9 raised:** a decree is an *authored* act joined to an *irreversible* consequence — if a
decree-ruin is undoable, undo must restore those leashes. **EM-B1a's problem; docket it there** so it
is not discovered at that build.

## `requiredSymbols` delta — 4 → 5, none removed

**ADDED:** `src/domain/worldPulse/calamityKernel.js :: export function forceCalamityStrike` — a scan
of the live 188-entry manifest found **MF-T2R (LANDED) already pins that exact (path, symbol) pair on
the file this packet MODIFIES** (`grep -c` → 1, `:492`). By the standard it is owed here too, so the
landed pin is discharged from this manifest as well.

**Post-edit simulation (step 10): all five PRESENT after the build.** Rows 1–2 sit at `:196`/`:492`,
outside the edited region (`:250-253`, `:282`, `:286`); rows 3–5 are read-only files absent from the
change manifest. **`retiredSymbols`: NONE owed** — the only symbol removed is the module-private
`ruin`, named in no manifest at any status, and no other packet holds a row on either path.

## Budget table

| Limit | Packet | Standard |
|---|---:|---:|
| Behavior families | 1 | 1 |
| New logic leaves | **0** | ≤2 |
| Existing logic files modified | **1** | ≤3 |
| Handwritten files | **2** | ≤12 |
| New/changed effective lines | **≈10, cap ≤20** | ≤400 |
| Delta in a hot file | **0** (not hot) | ≤15 |
| Acceptance cases | **7** | ≤8 |

**Within budget on every row; no split owed.** Nothing this pre-proof did grew the plan — it
*removed* two obligations and added one guard row at zero line cost.

## Sealed dispatch — six checks, dry-read

Ancestry ✅ · substrate diff **empty** ✅ (⭐ passes at the OLD base too, since
`implementation-session.mjs:184` early-returns when base == HEAD and the window is empty anyway) ·
capsule carries all 5 substrate paths ✅ · CREATE absent + git-clean ✅ · non-CREATE git-clean ✅ (a
clean-worktree precondition) · branch identity ⚠ the build lane's act — the dispatch demands the
worktree be **on** the verified branch.

## Facts changed, old → new

| # | draft | tip | proof |
|---|---|---|---|
| 1 | "Rides in T3 beside EM-B1d" | **FLOATS** (add. 21) | ev §7 |
| 2 | census absolute `2645/383/2262/25009/6670` | **removed**; only the delta survives | ev §8 |
| 3 | R3 edge-shared "resolve at preflight", a STOP | ⭐ **CLOSED — not owed**, proved twice | ev §9, §21 |
| 4 | bundle budgets unpriced | ⭐ **no budgeted chunk**; +270 B into an uncapped worker | ev §10 |
| 5 | max-lines "measure or STOP" | ⭐ **453/800 — 347 lines of headroom** | ev §16 |
| 6 | mutation-coverage "not owed" (cited) | **not owed — EXECUTED**, with a control | ev §5 |
| 7 | `ruinFilterRoster` walker | ⭐ **never named; enrolled, kept green by the moved line** | ev §11 |
| 8 | A7 "a source scan" | ⭐ **unimplementable as written**; exact matcher supplied | ev §12 |
| 9 | "the preset witness" (no path) | **named**; premise confirmed from its header | ev §14 |
| 10 | §10's calamity suites unmeasured | **resolved and named** | ev §14 |
| 11 | `requiredSymbols` = 4 | **5** (MF-T2R's landed pin) | ev §4 |
| 12 | A1 oracle: no recipe | **recipe named** (`advanceCalamity` + the integration driver) | ev §13 |
| 13 | `advanceWorkerByteIdentity` assumed protective | ⛔ **relative pin — protects nothing here** | ev §14 |

⛔ **The three that would have cost the build lane a STOP:** #8 (A7 vacuously green with the obvious
helper), #7 (the §11 escape hatch reds a walker the draft never read), #3/#11 (an undeclared
generated-path class, and a landed pin on the modified file).

## The nine questions only the chair can answer

| # | question |
|---|---|
| **R1** | Confirm the reading: `worldPulseFate` has no closed vocabulary, so `ruined_by_decree` is priced at zero. |
| **R2** | An open fate vocabulary is where a ninth spelling lands unnoticed. Docket a closure + totality walker over the eight existing writers, or accept the openness on record. |
| **R3** | ✅ Closed by measurement — note only. |
| **R4** | `institutionStatusModel.js:99` holds a **fourth** institution vocabulary (`['operational','impaired','shell']`). Recorded, uninvestigated. |
| **R5** | ⚠ **The charter's EM-T3 row is stale** — it still assigns `ruined` to a typedef. Correct it so no later reader re-derives the obligation. |
| **R6** | ⭐ **Order vs TOOL-3.** Recommend landing EM-B1e **first**; otherwise price a +270 B monotone-down ceiling re-mint. |
| **R7** | 28 hand-built replicas of the ruin shape live in `tests/`. Docket routing them through the new writer (test-side, different family). |
| **R8** | ⚠ **Order vs EM-B1d v5.** If v5 homes its vocabulary in `src/domain/entities/status.js`, that is this packet's dispatch **substrate** and invalidates its stamped base. Confirm **EM-B1d lands first, EM-B1e is placed after**. |
| **R9** | ⛔ **Docket onto EM-B1a:** a decree-ruin severs criminal leashes irreversibly; undo must restore them. |

## What the chair must do to promote

1. Stamp `__BASE__` (both header rows and `manifest.verifiedBase`) from the live tip, re-running the
   window in the same command — the revalidation sentence is pre-written in the packet header.
2. Stamp the preamble SHA-256 line (verified value quoted above).
3. Flip Status DRAFT → READY and **place** the entry in `docs/implementation/PACKET_MANIFEST.json`
   (EM-B1e is **not yet in the tree manifest** — the scan returned `[]`).
4. Answer R6 and R8 (both are ordering calls), and docket R2, R5, R7, R9.
