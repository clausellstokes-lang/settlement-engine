# EM-R6 — COMPILE REPORT, version 3.1

**Verdict: DRAFT, READY-able.** All nine of version 3's questions are ruled and carried; the four
small additions are in; every figure is **re-executed at the same tip `32602dc60`**. `rev-parse`
and `status --short` checked at both ends of the fold (EMPTY, 02:28:39 and 02:5x). No vitest,
eslint, npm script or build; plain `node`, one process at a time, two bounded sweeps (63-row stride
3.6 s, 525-row corpus 25.9 s — the box was running a full check).

⭐ **The three declarative changes are behaviour-preserving, and the 525-row re-run is the proof:
not one figure of version 3 moved.** One version-3 *claim* is refuted (§below).

## Files

| file | |
|---|---|
| `…/EM-R6.md` | the packet, **version 3.1** (v3 at `EM-R6.v3.md`, v2 at `EM-R6.v2.md`, v1 at `EM-R6.v1.md`) |
| `…/EM-R6.manifest.json` | 5 changeManifest · 8 requiredSymbols · 8 acceptanceCases as `{id,case}` · 10 `checks` (v3 at `EM-R6.manifest.v3.json`) |
| `…/EM-R6.evidence.md` | §1–§14 (version 3, **preserved whole**) + **§15–§21, the fold's own measurements** (v3 at `EM-R6.evidence.v3.md`) |
| `…/EM-R6.compile.report.md` | this file (v3 at `EM-R6.compile.report.v3.md`) |
| `…/candidate-v31/`, `…/tools/proto5.mjs` | the priced v3.1 source and the harness that imports it |

## Budget table

| | rename leaf | removal leaf | total | cap |
|---|---:|---:|---:|---|
| effective lines | **217** (v3 215, v2 219) | **74** (v3 73, v2 65) | **292** incl. the MODIFY line | 250 / leaf, 400 / packet |
| minified (esbuild 0.28.1) | **10,598 B** | **2,660 B** | **13,258 B** (v3 12,797) | no budgeted chunk |
| counter control | 6/6 EXACT against `scripts/.size-baseline.json` | | | |

**v3.1 costs +3 effective lines and +482 B:** Q1's declared rewrite map and lookup (+2), Q5's
ledger-resolved readable path (+1), and the `readable`/`rewrite` fields across 26 rows (+482 B).
⭐ **FIX-D5's own price, re-measured on this leaf: +5 effective lines, +245 B** — the same leaf with
the declared list removed measures **212 eff / 10,353 B**. Exactly the figures the chair named.
Nothing is over; STOP AND SPLIT is not triggered. The only conditional that would break it remains
§3a under an owner "NO" (a third leaf, ≈45 effective).

## Register moves — DELTAS, never an absolute

Unchanged from version 3 in every verdict, with **one re-sweep the fold forced**:

- **Lighting: `+2 files / +0 parked / +2 credited / +10 titles / +2 suiteTitles`.** No absolute tuple.
- **Mutation-coverage NOT OWED · wiring census NOT OWED · edge-shared NOT OWED (0 of 307) · no budgeted chunk.**
- ⚠ **CITATIONS BY LINE — RE-SWEPT, because the argument changed.** Version 3 leaned on "R2 inserts
  no line". **Version 3.1's MODIFY inserts a comment block**, so the sweep has to stand alone. It
  does: **0** files address `src/domain/factionRename.js` by line, it is in **0 of 14**
  line-addressed baselines, and it is **not** in `wiring-census.json`'s `stamp.files`.
- **Observed-shape and writer-reach: PLAUSIBLE, the build lane's** — read, not run.

## Collision group

**`NONE`** — 190 registered entries, none naming any of the nine paths. ⚠ Registered entries only.
⚠ `safetyProfile.js` and `computeActiveChains.js` are `requiredSymbols` rows here **and** FIX-D2's
and FIX-D3's edit targets; if either is chartered into this train the chair sequences them.

## §7 table ⟷ JSON changeManifest, RE-PROVED SET-EQUAL

```
$ sed -n '30,36p' scripts/implementation-packets.mjs
export const PACKET_ACTIONS = Object.freeze([ 'CREATE', 'DOC', 'MODIFY', 'REGISTER', 'TEST', ]);

JSON : ["CREATE src/domain/institutionRemoval.js","CREATE src/domain/institutionRename.js",
        "CREATE tests/domain/institutionRemoval.test.js","CREATE tests/domain/institutionRename.test.js",
        "MODIFY src/domain/factionRename.js"]
TABLE: (identical, parsed out of the packet's §7)
SET-EQUAL: true     actions ⊂ PACKET_ACTIONS: true
acceptanceCases: 8, all {id,case}, ids A1…A8     requiredSymbols: 8
checks: 10 | generator among checks: FALSE
```

## `requiredSymbols` — unchanged at 8, each re-proved by `grep -cF`

`clone.js::export function deepClone` **1** · `factionRename.js::const NPC_HOMES` **1** ·
`factionRename.js::export const FACTION_RENAME_SURFACES` **1** ·
`anchors.js::export function anchorForInstitution` **1** ·
`factionRoles.js::linkedInstitutionIds` **4** · `safetyProfile.js::CRIMINAL_INST_LABELS` **2** ·
`computeActiveChains.js::export function deriveInstitutionalServices` **1** ·
`priorityHelpers.js::export const getInstFlags` **1**.
Post-edit simulation unchanged: the validator's check is `source.includes(row.symbol)`
(`:802`), so `const NPC_HOMES` survives inside `export const NPC_HOMES`; **no `retiredSymbols`
row is owed** and no other packet's rows need discharging.

## The nine rulings, as carried

| # | carried |
|---|---|
| **Q1** | Row 26 cascades under `label`. ⭐ **Taken further:** `rewrite: 'verbatim' \| 'lower'` is a DECLARED FIELD on each label row and the cascade reads it off the row — executed at the tip. The forms are not interchangeable and the reason is measured: row 26's path is all-lowercase on **1,764 of 1,764** values. **+2 eff.** |
| **Q2** | Confirmed, both rows `readable: false`. ⚠ **With a correction: they are NOT an alias** — `sameObjectLive` **0 of 525**. |
| **Q3** | Confirmed — `structuralSuggestions[].suggested[]`, catalogue, not readable. |
| **Q4** | **FIX-D5 rides.** Denominator excludes by the declared eleven. ⭐ **Control: 0 parentheticals over 525 rows fall outside the list**, so the swap is behaviour-identical today and falsifiable tomorrow. A4 (iv) pins **3 live / 8 dark**. **+5 eff / +245 B, inside the budget.** |
| **Q5** | Confirmed. All 15 rows carry `readable`; exactly one is `true`. ⭐ **Taken further:** the removal RESOLVES that path from the ledger, so flipping the flag throws at import. A5 (iii) asserts both. Rule written into `factionRename.js`'s ledger header — which widened the MODIFY and forced the §19 re-sweep. **+1 eff.** |
| **Q6** | Confirmed as compiled. |
| **Q7** | Confirmed — four floors, **raise-only**, written with that word: ≥40 shapes · ≥1 catalogue path · ≥4 normalised paths · ≥1 red-control finding. |
| **Q8 (R4)** | Unchanged — §3a stays cuttable; the owner's. |
| **Q9** | EM-B1c **not** gated on FIX-D3; A2 keeps asserting the **175** residue by count. |
| **item 4** | A1's failure message gains the `catalogId`-threshold sentence (12.6 % / 40.3 % today). |
| **item 6** | `legal[].name` re-measured — **5,001 / 0 / 105 / 105** — and asserted in **A6 (vi)**. |
| **item 8** | **231 of 280** emitted; both collision scans empty — in §5's reconciliation. |
| **item 12** | ⭐ **The failure-message sentence, and the measurement chose it:** an `alias` field would have asserted a falsehood. `readable` earns a field because it has a consumer; `alias` would have had none. |

## ⛔ TWO CORRECTIONS THIS FOLD MEASURED — one to version 3, one to the ruling itself

**(2) THE SENTINEL VOCABULARY IS ELEVEN, NOT TWELVE.** Q4's ruling says *"the twelve-spelling …
3 live, 9 dark"*. `grep -oE "'\([a-z ]+\)'" src/generators/servicesGenerator.js | sort -u` returns
**eleven** literals; `'(background crime)'` is a `crimeType` feeding the `(covert)` fallback and is
never stored at `availableServices.*[].institution`. Version 3's draft list carried it in error and
version 3.1 declares the eleven the generator writes. **The split is 3 live / 8 dark**, the control
still passes (0 parentheticals outside the list), the dangle baseline is still 0, and FIX-D5's
price becomes **+5 effective lines / +245 B** instead of +266 B. ⭐ **A figure correction, not a
contradiction: the ruling's substance is carried whole.** Evidence §22.

## ⛔ ONE VERSION-3 CLAIM REFUTED BY THIS FOLD

Version 3's `NON_CASCADED` row said the two `compound.inst.names[]` paths are *"the SAME object
under a second path (both stamped from one `getInstFlags` call)"*. **Measured:
`rowsWithBoth 525 · sameObjectLive 0 · sameObjectReloaded 0`** — `economicState.js:62` and
`safetyProfile.js:26` each call `getInstFlags` independently. Two equal-valued stamps, two rows.
The ruling (NON_CASCADED, declared twice) is unaffected; the reason is now the measured one, and
it is what decided item 12 against the `alias` field.

## Re-run totals at `32602dc60` — nothing moved

Rename **4,034 handles, 0 stale on 36 rows, 0 new dangles**, residue **550 + 175**. Removal 0 new
dangles, five kinds, orphans **125 + 28** (20 on a kept chain). Baseline reference dangles **0**.
Partition **525/525** three ways. Labels **1,164** (273/273 verbatim) and **1,764** (260/260
lowercased). Faction pin **156/156**. Mirror one-home **257/525**, two-home **0/525**. Immutable
**525/525 ×3**, 0 keys gained. Pin: `UNDECLARED_AGAINST_V3 []`, `UNDECLARED_AGAINST_V2` 5.

## ⛔ NOTICED AND NOT TOUCHED — new in this fold (version 3's twelve still stand)

1. ⛔ **THE ESTATE'S NEW RULE IS TYPED ON ONE SIDE AND PROSE ON THE OTHER.** Q5's rule now lives in
   `factionRename.js`'s ledger header, but **the faction ledger's own rows do not gain `readable`**
   (this MODIFY touches the header only, deliberately). So `NON_CASCADED_SURFACES` means a row with
   a `readable` field in `institutionRename.js` and a row without one in `factionRename.js`, under
   one written rule. **SLOT: a one-field addition to `factionRename.js`'s five ledger rows in
   whichever faction-lane packet next opens that file — it is +0 effective lines and closes the
   asymmetry; it is NOT this packet's because a field on rows it does not own is scope creep.**
2. ⛔ **`readable` HAS EXACTLY ONE CONSUMER AND NO WALKER ENFORCES IT.** Nothing checks that a
   module which READS a `NON_CASCADED` path declared it — A5 (iii) checks only this module's own
   note. A second reader elsewhere in `src/` would satisfy the written rule and no test.
   **SLOT: a source-scan arm in `tests/lint/` (the estate's single-writer scans are the shape), in
   whichever packet adds the second reader — or TOOL-6's lane, which is already measuring
   `ENFORCER_DIRS` population.**
3. **THE `LABEL_REWRITE` MAP IS A TWO-ENTRY VOCABULARY THAT NOTHING PINS AS CLOSED.** `OrphanKind`
   is declared closed at two and §11 makes a third a STOP; the rewrite forms are not. A third form
   (say `title`) could be added silently the day a producer Title-Cases a third path.
   **SLOT: one STOP line beside the `OrphanKind` clause — the packet's §11 already carries "a THIRD
   rewrite form appears necessary", so the gap is the TEST, not the prose: A1 could assert the
   vocabulary's size the way it asserts the floors.**
4. **THE SENTINEL LIST IS DECLARED IN THE DOMAIN AND WRITTEN IN THE GENERATOR, AND NOTHING JOINS
   THEM.** The eleven spellings are literals in `servicesGenerator.js:103-350` and are re-declared
   in `institutionRename.js`. A4 (iv) catches a NEW spelling appearing in data, but not a spelling
   *removed* from the generator while the domain list keeps it — it would simply join the 8 dark
   and nothing would notice. **This is exactly how version 3's twelfth entry survived a whole
   version.** **SLOT: a `tests/lint/` scan that reads the generator's parenthetical literals and
   the domain list and requires SET-EQUALITY — cheap, and it is the guard that would have caught
   the error this fold caught by hand. FIX-D5's own lane is the natural owner.**
5. **FIX-D1's §3 AND ITS NOTICED ITEM 6 DISAGREE WITH EACH OTHER ABOUT THE COUNT**, which is where
   the "twelve" entered the chain: §3 enumerates eleven literals correctly, while noticed item 6
   says "nine of the twelve … are DARK" and then lists eight. The ruling inherited the loose
   sentence. Nothing measured is wrong in FIX-D1 — only the arithmetic in one summary line.
   **SLOT: a one-line correction to FIX-D1's noticed item 6 wherever that report is folded, so the
   next reader of it does not re-derive twelve.**
6. **THE PRICE THE CHAIR NAMED FOR FIX-D5 WAS THE TWELVE-ENTRY FIGURE** (+266 B). The corrected
   list costs **+245 B**; the +5 effective lines are unchanged. No budget decision turns on the
   21 bytes, but the ruling's figure and the packet's figure now differ and the packet should be
   the one quoted. **SLOT: the chair's acceptance line for version 3.1.**
