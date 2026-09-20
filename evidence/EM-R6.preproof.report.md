# EM-R6 — OPUS PRE-PROOF REPORT (session a9df403c, read tip `141a1d775`, 2026-09-20 07:44:04 EDT)

## VERDICT

⭐ **READY-able at `141a1d775`, as version 4.** Not one verified fact of version 3.1 is refuted.
The packet was NOT ready as accepted, for one reason that is the chair's own: **ODQ §934.47
addendum 37 and the charter's amendments of 2026-09-20 02:46 EDT FATED TWO ARMS TO THIS PRE-PROOF,
and the accepted version 3.1 carries neither.** Both are now written in.

Status stays `DRAFT`; `Verified base` and `Last revalidated` stay `__BASE__` with the
revalidation sentence written for the chair; the preamble hash is verified and quoted, left
unstamped by design.

**Files (all under `$SP/lane-preproof-EM-R6-scratch/`):** `EM-R6.md` · `EM-R6.manifest.json` ·
`EM-R6.evidence.md` (§23–§34 appended; §1–§22 untouched) · this report.

## THE J-T1 WINDOW — TWO WINDOWS, BOTH EMPTY

```
$ git rev-parse --short HEAD → 141a1d775 ; git status --short → (empty, start AND end)
$ git merge-base --is-ancestor 32602dc60 HEAD → ancestor ✓ (24 commits in the window)
$ git diff --stat 32602dc60 141a1d775 -- <5 manifest paths + 8 requiredSymbols paths
                                           + 2 test precedents>          → (no output)
$ git diff --stat 32602dc60 141a1d775 -- <22 further files §5/§6/§7 name, incl.
      servicesGenerator.js, vite.config.js, wiring-census.json,
      generator-golden-master.json>                                      → (no output)
```

⇒ every corpus figure, producer measurement and closure figure in §§1–22 stands **byte-for-byte**;
none was re-run, because re-running a byte-identical tree could only reproduce it.

## THE TWO CHAIR-FATED ARMS — the reason this was not READY

Charter, **Amendments of 2026-09-20 02:46 EDT**: *"Its pre-proof adds: a closed-vocabulary pin on
`LABEL_REWRITE` (OrphanKind's shape) and a set-equality arm joining `servicesGenerator.js`'s
sentinel literals to the domain's declared list."* Measured against the accepted packet:
`grep -n 'LABEL_REWRITE'` → **no hits**; `servicesGenerator` → **2 hits, both prose in §6**; no
`requiredSymbols` row. Both genuinely owed. Added as:

- **A1 (vi)** — `LABEL_REWRITE` closed at two, in `OrphanKind`'s exact shape: the frozen rewrite
  map's key set is exactly `{'verbatim','lower'}` (size asserted); every `label` row's `rewrite`
  is a member, DERIVED from the surface list and never re-typed; **no `exact` row carries a
  `rewrite` at all** (34 of 34); and **both members observed FIRING through the cascade**, never
  asserted from the declaration. Anti-vacuity before all four.
- **A4 (v)** — the SET-EQUALITY arm. (iv)'s existing control is a CORPUS control and is blind to
  the only failure that has actually happened: **the declared list and the generator's SOURCE
  disagreeing**, which is exactly how `'(background crime)'` rode from FIX-D1 through §934.61 and
  addendum 34 into version 3's draft. The arm reads `servicesGenerator.js`, extracts every
  parenthetical literal passed as `addCrimeService`'s third argument, and asserts set-equality
  **in both directions, named separately** — with the anchor asserted FOUND and ≥11 literals
  extracted BEFORE any comparison, because a silently-empty source scan is run 17's own defect.

**Cost: ZERO effective production lines and zero bytes.** `LabelRewrite` is a JSDoc typedef over
the frozen map version 3.1 already declares, and `src/domain/**` is
`max-lines ['error', { max: 800, skipBlankLines: true, skipComments: true }]` (executed). Both are
ARMS inside existing `it`s, so **acceptance stays 8 of ≤8** and the lighting delta is unchanged.

## `requiredSymbols` DELTA, AND THE POST-EDIT SIMULATION

**+1 row (8 → 9):** `src/generators/servicesGenerator.js :: addCrimeService = (name, desc, institution) =>`
(`grep -cF` → 1, `:288`) — A4 (v) reads it. **None removed.**

All nine resolve verbatim at the tip: 1 · 1 · 1 · 1 · 4 · 2 · 1 · 1 · 1.

**`retiredSymbols` is EMPTY BY MEASUREMENT.** The only row on a file this packet edits is
`factionRename.js :: 'const NPC_HOMES'`; the MODIFY prepends `export `, and the matcher is
`source.includes(row.symbol)` (`scripts/implementation-packets.mjs:802`) — a verbatim SUBSTRING —
so `const NPC_HOMES` survives inside `export const NPC_HOMES`. `NPC_HOMES` occurs at nine sites,
all inside `factionRename.js`, plus one COMMENT in `src/store/settlementRenameHelpers.js:402`;
**no test anywhere names it**, so R2's `export` retires nothing and discharges no other packet.

## STEP 5 — THE BUNDLE CHUNK MEASUREMENT (independent instrument)

| budget | measured at `141a1d775` | packet's claim |
|---|---|---|
| first paint, **by importing** `EAGER_FIRST_PAINT_MODULES` | **268** modules; control `settlementSlice` ✓; `factionRename` **absent** | ✓ |
| generation worker (zero slack) | **220** static / **228** static+dynamic; `factionRename` **absent**; `clone.js`, `narrativeMutations.js`, `safetyProfile.js`, `computeActiveChains.js`, `priorityHelpers.js` all **IN** | ✓ exactly |
| lazy `engine` | `factionRename` not in the `/src/generators/` set | ✓ |
| edge-shared | no generator in `checks`; no `_shared` path written | ✓ |

⇒ **NO BUDGETED CHUNK; no TEST row and no build step added.** Nothing was owed and nothing was
added for step 5. ⚠ **One fact §3b did not state, now recorded:** `src/domain/clone.js` is in the
**first-paint eager closure as well**. It costs this packet nothing (`deepClone` is imported, never
modified) but it sharpens §3b's binding note — the leaf the consumers will import sits on top of an
eager module, so the door test they owe is the only thing between these 13,258 B and first paint.

## WHAT I ADDED BECAUSE OF THE INSTRUMENT SWEEP

The 2026-09-20 addendum is unconditional: a CREATE under `tests/<dir>` opts into every walker
governing it, and **`tests/lint` whole always**. Version 3.1 named **one** lint walker; there are
**172** at this tip, of which **eleven scan the whole `tests/` tree** and read the two new files.

- **`tests/lint` WHOLE** added to §10 and to the manifest `checks` (11 entries now).
- **Three walker fences** written into the CREATE rows' coding instructions, each with its register
  named as a §11 STOP because all three registers live OUTSIDE this manifest:
  `seedLoopTotality` (`FROZEN_BARE_SEED_LOOPS` is SHRINK-ONLY — *"never add a file"* — so a corpus
  walk written `for (const seed of …) { expect(…) }` has **no lawful cure but a rewrite**);
  `goldenFreeze` (enrols on `/^UPDATE_[A-Z_]+$/` over the AST ⇒ A8 reads no capture env);
  `negativeAssertionAnchor` (un-anchored `not.toContain/toMatch/toHaveProperty` ⇒ a frozen row).
- **`contractTestAntiVacuity` measured OUT OF SCOPE** and recorded as a boundary: its `inScope` is
  `tests/security/**`, `**/*.contract.test.*`, `tests/lint/*.test.js`. A1 (iv)'s deliberately
  hardcoded version-2 lists — Rule 2's exact shape — cannot convict, **and the basenames must not
  be renamed** (which §7 already made contractual for a different reason).
- **`scripts/.observed-shape-readers-baseline.json`** — which names `factionRename.js` four times
  and sat outside version 3.1's fourteen-baseline sweep — measured HARMLESS and now NAMED in §7:
  its `_doc` excludes line numbers by design, and `provenanceDriftOf` compares shas only for
  `detectorTree` and the UNSCANNED half of the subject tree (`factionRename.js` is in `scanTree`).

## FACTS CHANGED (old → new), each with its command

| fact | old | new at `141a1d775` | command |
|---|---|---|---|
| preamble SHA-256 | `b90a95b7…caa5e1` | **`16dfb96f…3195`** | `shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md` |
| registered manifest entries | 190 | **193** (collisions still **0** for all ten paths) | JSON parse of `PACKET_MANIFEST.json` |
| `rulingStructure.js:671` | `src/generators/…` | **`src/generators/power/rulingStructure.js:671`** — `faction: "Thieves' Guild",` | `git ls-files`, `sed -n 671p` |
| `inferInstitutions` | `:392` | **`:393`** | `grep -n inferInstitutions` |
| version 3.1's byte delta | +482 B | ⛔ **+461 B** (rename +425 · removal +36) | the packet's own §0 table |
| `'(background crime)'` | "a crimeType feeding `(covert)`" | the crimeType is **`'Background crime'`** (`servicesGenerator.js:347`); the parenthesised literal exists **nowhere** | `git grep -n 'background crime' -- src tests` → no output |
| sentinel vocabulary | eleven, by `'\([a-z ]+\)'` | **eleven**, re-executed with the WIDENED `'\([^']*\)'` — same set | `grep -oE … | sort -u` |
| catalogue names | 280 | **280** ✓; normalised collisions over all 280: **0** ✓ | import + third-level key walk |
| `SURFACE_ROOTS` | (unstated) | **6** | import of `scripts/lib/writer-reach-scan.mjs` |

Ten cited `path:line` producers re-read verbatim at the tip; the four design/charter authorities
re-read on the ledger branch and all four bind as quoted.

## STEP 8 — DRY READ OF THE SEALED DISPATCH

`scripts/implementation-session.mjs`, check by check: **branch** — the chair sets it; **ancestry**
— `32602dc60` is an ancestor of `141a1d775` ✓; **substrate unchanged** (`git diff --name-only
verifiedBase..head -- <changeManifest ∪ requiredSymbols paths>`, `:185-195`) — my window over that
exact set printed NOTHING, so it passes whether the chair stamps `141a1d775` or `32602dc60`;
**CREATE targets absent and Git-clean** (`:206-213`) — all four absent on disk AND unknown to git,
tree porcelain empty; **non-CREATE targets Git-clean** — yes; **requiredSymbols verbatim**
(`:802`, `source.includes`) — nine of nine.

## BUDGET (unchanged by version 4)

| leaf | effective | minified | cap |
|---|---:|---:|---|
| `institutionRename.js` | **217** | 10,598 B | ≤250 ✓ |
| `institutionRemoval.js` | **74** | 2,660 B | ≤250 ✓ |
| total + the MODIFY line | **292** | **13,258 B** | ≤400 ✓ |

## QUESTIONS FOR THE CHAIR — four, each with a recommendation

1. **P1 — the byte delta on the record is wrong twice, and one is the chair's.** §0's +482 B is
   unsourced; addendum 37's +425 B is the RENAME LEAF alone published as the packet total. The
   packet's own table gives **+461 B**. **Recommend: correct the record to +461 B (+425 / +36).**
   The absolute 13,258 B is unchanged and no budget is near.
2. **P2 — `'(background crime)'` is not measurable as described.** **Recommend: accept §6's
   corrected sentence** (already written in). The ruling — eleven, 3 live / 8 dark — is unaffected
   and is now re-executed with a grep that could have found a twelfth and did not.
3. **P3 — design §22.1 ruling 7 still says "(30 of 56 joins)"**, a FIX-D1-era figure this packet
   supersedes with 36 + 15. **Recommend: re-cut or strike the parenthesis** at the next design
   sitting; it is quoted as authority here and will be quoted by EM-B1c. Not touched by this lane.
4. **P4 — `tests/lint` whole is a 172-file stage on a packet whose own tests are ten `it`s.**
   **Recommend: keep it whole.** If the chair wants it cheaper, the lawful cut is **the eleven
   tree-wide walkers by name** (enumerated in §7), never a guess.

## ⛔ NOTICED AND NOT TOUCHED (§14 of the packet; nothing deferred)

**N1** `contractTestAntiVacuity` records **seven pre-existing fold-scope hits** by name and rule,
exempted by nothing — its header calls triaging them *"its own act"* → **a TOOL slot of its own**.
**N2** `readable` is enforced by nothing today → already slotted to **EM-R7**. **N3**
`settlementRenameHelpers.js:402` is a third written home for the two-homes law → **EM-B1c's
pre-proof**. **N4** `ruinFilterRoster.walker.test.js:159` names `institutions[].factionSource`,
which **neither cascade ledger declares in either direction** → a one-line census at **EM-B1c's
pre-proof**. **N5** the census baseline's `measuredAtSha` is the parent commit — correct, recorded
so a successor does not read it as drift.

## TREE AT THE END

```
$ git rev-parse --short HEAD → 141a1d775 ; git status --short → (empty)
```
No tracked file edited, staged or committed. No vitest, eslint or npm script was run: **no gated
run is owed**, so this lane does not pause at a gate.
