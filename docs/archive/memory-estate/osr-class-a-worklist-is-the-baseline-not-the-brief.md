---
name: osr-class-a-worklist-is-the-baseline-not-the-brief
description: "⭐⭐ THE CLASS-(a) WORKLIST LIVES IN THE BASELINE, NOT IN ANY BRIEF OR MEMORY — a Lane C dispatch said '21 remain' and the schema-5 inventory at HEAD said SEVEN; 14 had already been repaired by three earlier commits. Repaired 5 more at aed0fc0e (17 rows / 26 reads, PURE SHRINK, re-frozen 2003→1977 at 904b7bb0); FOUR identities / 5 addresses remain and every one is a deliberate stop. ⚠⚠ ABSENCE FROM THE INVENTORY CAN ONLY MEAN REPAIR — CLASS_A_PROTECTED_IDENTITIES makes a class-(a) erasure a scan REFUSAL, so a filter can never be the reason a row vanished. ⚠⚠ A READER-SIDE REPAIR'S OWN FAILURE MODE IS TRADING ONE DEAD READ FOR ANOTHER: copying deriveAllSupplyChainStates' precedence chain imported its `|| settlement.economy` fallback and the ratchet caught it as violations:1."
metadata:
  type: project
  date: 2026-08-11
  branch: claude/composite-r4
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-11T19:15:01.140Z
---

## The rule

**`scripts/.observed-shape-readers-baseline.json` at HEAD is the ONLY authority on
what class-(a) debt is outstanding.** `CLASS_A_PROTECTED_IDENTITIES`
(`scripts/check-observed-shape-readers.mjs:345-367`) is the 21-identity roster the
chair's triage produced from 23 addresses — it is a GUARD AGAINST THE FILTERS, not a
statement of open work, and its own docblock says so ("they stay listed… the guard is
against the FILTER, not a claim about what is currently outstanding"). Join the roster
against `inventory` to get the live worklist.

**⚠⚠ Absence from the inventory can ONLY mean the read is gone.** Both schema-5
post-filters refuse outright if they would clear a class-(a) row
(`assertShapeFamilyDebtPreserved:404-415`, the explained-writer guard at `:649`), so
"a filter ate it" is not an available explanation. A vanished row is a repaired row.

## What that cost, concretely

A Lane C dispatch (2026-08-11) carried "23 confirmed, 2 repaired, **21 remain**" from
[[osr-171-growth-rows-triaged]]. The baseline at HEAD said **7**. The other 14 were
repaired by three commits the brief did not know about: `c74048e4` (the
prominentRelationship six + `authored on institutions`), `e429a4e8` ("nine dead reads
are gone for good"), `5afe9b2e` (the three herald markers, `decreed`, `evidenceId`,
`title on currentTensions`). Re-deriving cost one Python join over the inventory;
believing the brief would have cost a day chasing already-dead reads.

## The five repaired at `aed0fc0e` + `904b7bb0`

`hooks` / `plotHooks` / `supplyChains on settlement`, `dots` / `notability on npcs`.
17 identity-rows / 26 reads, **violations 0** — a pure shrink. Three were live
user-visible holes, not hygiene: the World Book's **HOOKS (DM) chapter was empty for
every settlement ever exported**, the campaign PDF's **HOOK line never printed once**
(proven by painting a PDF and reading the content stream at base and after), and
`generationFingerprint` reported `has_hooks:false` / `has_supply_chains:false` on
**every generation milestone ever fired**.

⭐ **The repair vehicle already existed**: `collectPlotHooks`
(`src/domain/dossier/plotHooks.js`) is the repo's own "canonical hook collector",
shared by the tabs, the react-pdf view model, Session Mode and tonight-at-the-table.
The jsPDF export lane simply never adopted it. **`plotHooks.js` has ZERO rows in the
inventory**, so routing a reader through it is a pure shrink by construction — it
reads only written addresses.

## ⚠⚠ Four hazards this lane paid for

1. **A reader-side repair's own failure mode is trading one dead read for another.**
   Routing the telemetry chain count through `deriveAllSupplyChainStates`' precedence
   chain imported its `|| settlement.economy` fallback — and `economy on settlement`
   is ITSELF a writerless row banked for four other files. The ratchet reported
   `violations: 1`. **Never copy a precedence chain wholesale; check each address.**
2. **THE FIXTURES ARE THE REASON THE DEAD READ SURVIVED.** Six fixtures across five
   suites authored a settlement-root `plotHooks` the corpus never emits, greening the
   dead read with it. Fixing the readers reddened all five *immediately* — which is
   the strongest available confirmation the reads were dead. **Re-point the fixture at
   a live address at an unchanged expected count; do not relax the assertion.**
3. **A private-index landing leaves the SHARED index stale, and the OSR `--write`
   refuses on it.** `git status` showed `MM` on all 12 src files while
   `git diff HEAD --name-only` was EMPTY. Cure: `git add --` with the explicit
   already-committed paths (worktree already equals HEAD, so this only refreshes the
   entries; verify `git diff --cached --name-only HEAD` lists nothing foreign first).
4. **`--scan-only`, `--report` and `--write` all refuse while a sibling lane writes**
   ("inputs or HEAD changed while the scan was running"). To see WHICH rows moved
   without a clean tree, join the walker's `violations`/`stale` counts against the
   inventory in Python instead — 17 stale reconciled exactly to the (file, identity)
   pairs predicted by hand. Flags are `--name=value`, never `--name value`.

## What remains — all four are deliberate stops, none is open work

| identity | addresses | why it stands |
|---|---|---|
| `factions on locks` | `locksPreservation.js`, `coup.js` | the coup shield. `setLock`'s call sites pass only identity/geography/npcs/history, so it is unreachable FROM THE UI but arms for any imported save. Reader-side deletes a working capability; writer-side is **owner-gated new capability**, which `locksPreservation.js:68-78` already says in its own words. |
| `coalitionEvidence on outcome` | `warCoalitionEvidence.js` | REFUTED twice. A live top-level key on many sibling result shapes (peaceTerms, peaceReasons, warCoalitionSettlement), so the `??` fallback is a tolerant family read. The schema-5 envelope's own non-vacuity note leans on this row being live. |
| `hooks on settlement` | `aiOverlayVerifier.js` | KEPT AS A FENCE, documented in place. `compareEntityArrays` reports `invented_entity` for a key in refined and absent from original, so undefined-vs-populated is exactly what it catches — and the edge refiner already emits a top-level `hooks` array its applier nests under `dmCompass`. |
| `supplyChains on settlement` | `aiOverlayVerifier.js` | same fence, same argument. |

## Two rulings worth not re-litigating

- **`npc.dots` / `npc.notability` deletion is behaviour-preserving BY CONSTRUCTION**,
  not by luck: the `importance` arms short-circuit above them in both
  `disposition.importanceWeight` and `npcAgency.notability` (deliberate mirrors — fix
  both or they drift), so the rungs could only change an answer for an NPC carrying
  dots and no importance, a shape nothing produces. **Both npc-ladder property
  goldens stayed green.** `npcVerdictApply.RELINQUISHED_FIELDS` keeps its `dots`/
  `notability` rows: a `hasOwnProperty`-guarded strip cannot mint a field and is not
  a reader-without-writer row.
- **simulationSpine's fear-rung `plotHooks` arm was DELETED, not re-pointed.** The
  paragraph above it states the rung's contract as the typed stressor vocabulary plus
  the defense roster and names the clause-in-a-noun-slot defect that shipped "People
  fear a return of the settlement is under active siege." Re-pointing at authored hook
  prose re-opens it under a new address. Lighting a hook-derived fear rung is a
  same-seed prose shift and is the chair's.

Related: [[osr-171-growth-rows-triaged]] · [[observed-shape-readers-walker-landed]] ·
[[osr-schema5-mint-built]] · [[two-lane-commit-shared-index-race]].
