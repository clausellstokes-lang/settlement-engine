# MF-T2K — support-relative solids and component slots

**Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
`0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — **recomputed by this lane at
its own base before any edit** (§4 row 2). Its §P1 refutations (R-MF-4 and R-MF-5 govern; R-MF-2 has
no surface because this leaf performs no arithmetic on quanta at all), §P2 hazard dispositions, §P3
anchor preflight, §P3b, §P4 registration template, §P5 census law, §P6 mutant hygiene, §P7 STOP set
and §P8 capsule law bind and are not restated.

- **Status:** READY
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `f7ba314505703b96097b8aba568cc80e3ec30023`
  ⚠⚠ **READ THE NEXT SIX LINES BEFORE TRUSTING THAT ROW.** The SHA is MF-T2J's **HOLDING
  (unlanded)** commit, itself stacked on MF-T2H's `05e7f9d56eec119102f540e316bd8e1061f81a92` and on
  MF-T2Bf's `7d6bde7caa61af99df85640b210328745caaad2f`, so this member is **FOUR DEEP**. The branch
  token names the branch of record this member is verified FOR and will land on; the row is
  **re-stamped at the landing slot** once MF-T2H and MF-T2J land and this member is rebased. ⭐ The
  base was **RE-DERIVED at lane start rather than inherited**, because the cascade had moved:
  MF-T2Bf landed on `claude/composite-r4` as `3519dcc1` and its holding pin is gone. Executed
  `git merge-base --is-ancestor`: neither `05e7f9d5` nor `f7ba3145` is an ancestor of `3519dcc1` or
  of the ledger branch, and the D3a stack still branches at `9bfae712` — so it is unrebased and
  unlanded, and `f7ba3145` IS the then-current stack tip. Every value was read with `git rev-parse`
  at this lane's start; none was extended from a quoted prefix (§381's fabricated-SHA law).
  ⚠ The status and verified-base values above each stand ALONE on their line because
  `parsePacketHeader` (`scripts/implementation-packets.mjs`) anchors both rows at end-of-line.
- **Chair ruling:** ODQ §419 (compile TC-T2K, dispatched at ODQ §417.1). Collision group
  `d3a-port`; positionally stacked on MF-T2J.
- **Sealed source ref:** `refs/preserve/map-sandbox-w3f-sealed` @
  `ee0db96d381a5a30efad63a7e2d355e0cc3db669`.
- **Deliverables:** `src/domain/townMap/fabric/supportSurface.js` (CREATE, 182 effective) ·
  `tests/domain/townMapSupportSurface.test.js` (CREATE) · two walker edits whose manifest rows are
  DEFERRED (§1.4) · this packet, its manifest row and its INDEX row.

> **`censusAuthorization`:** this packet moves the test census by
> **`+1 file / +0 parked / +1 credited / +6 titles / +1 suiteTitle`**.
> **Base tuple re-derived at `f7ba3145`: `2501 / 364 / 2137 / 20731 / 5789`. After tuple:
> `2502 / 364 / 2138 / 20737 / 5790`.** The DELTA is what crosses a rebase; the tuple is re-derived
> from the hash after the last edit at the landing slot (the carry law). Authorizing decisions:
> **ODQ §276**, **ODQ §304.4**, **ODQ §310.4**, **ODQ §417.1**, under §299.4's binding-forward rule.
> The family's stamp is **GRANTED** at ODQ §312.2b.

---

## §1 · SCOPE

### §1.1 What this member is

One dormant production leaf carrying the two remaining §287.16 vocabulary items this family's
charter routes here: explicit-input support-relative solids, and component slots. It TYPES the
support surface MF-T2E left as a bare `supportSurfaceId` string, DERIVES the owner-qualified key
MF-T2F's `DIFFERENT_SUPPORT_SURFACE` refusal consumes, makes SPEC §10.5's support-acyclicity law
executable as a pure function over a caller-supplied roster, and mints the total
PRESENT/NONE/UNKNOWN component-slot axis of SPEC §6.4.1.

The governing law is MF-T2E's era-slice posture, inherited whole: **an unvalidatable required field
is worse than an absent one.** SPEC §10.5's full `SupportSurfaceRef` resolves through registries
that do not exist in this era and equality-pins a `localDatumCache` height while `heightQ()` still
throws (§P2.7). This member therefore mints the D3a-core slice and names every absent piece in §1.2
with its owning successor. The field names are the SPEC's, so the registry era ADDS fields and
renames nothing — and this member does not open `massPart.js`.

**Three central behaviours.**

1. **THE KEY IS DERIVED, NEVER ACCEPTED.** SPEC §10.5: *"`SupportSurfaceRefBase.surfaceId` is a
   deterministic owner-qualified key, not a free alias"*. Every landed caller today hand-writes the
   id, which is that free alias. `supportSurfaceRef` derives
   `support:<kind-token>[:<segment>…]` and REFUSES a caller-supplied `surfaceId`. ⛔ **Injectivity
   is bought with a SEGMENT GRAMMAR, not a separator byte, and the reason is measured:** the derived
   key must pass the landed id wall `/^[a-z0-9][a-z0-9:._-]{0,95}$/`, which admits no C0 byte, and
   `tests/lint/controlBytes.test.js` forbids the raw byte in source — so MF-T2Bf's U+001F idiom is
   unavailable. `:` is RESERVED as the separator instead and every segment is validated against
   `/^[a-z0-9][a-z0-9._-]{0,31}$/`, the id grammar minus `:`. With `:`-free segments and a fixed
   field order per kind the join is invertible by construction. An over-long derivation is refused
   BY THE WALL, typed — never truncated, because truncation would re-open the aliasing.
2. **THE DAG.** `assertSupportAcyclicity(parts)` walks massing-owned refs and returns frozen
   `{orderedPartIds}`, supports strictly before dependents, in an INPUT-INDEPENDENT order (depth,
   then codepoint). Three typed refusals, each naming its subject: a duplicate `partId`; a
   massing-owned ref whose `ownerPartId` does not resolve in the roster (`EXTERNAL_MASSING_PHASE` is
   OUT this era, so an unresolved owner is an error and never silently a root); and a cycle, naming
   the cycle's member ids — self-support being the length-1 case of the same walk.
3. **THE TOTAL SLOT AXIS.** `componentSlot` routes `PRESENT`/`NONE`/`UNKNOWN` and refuses any other
   status rather than defaulting. The no-inference law is structural in BOTH directions:
   `NONE`/`UNKNOWN` carrying a `materialId` is refused, and `PRESENT` carrying a `reason` is refused
   symmetrically. ⭐ **The UNKNOWN reasons are not a third vocabulary:** SPEC
   `UnknownMaterialFact.reason` is byte-identical and same-ordered to the landed
   `MASSING_UNKNOWN_REASONS`, so the leaf IMPORTS it from `./massPart.js` rather than re-declaring
   it, and drift becomes structurally impossible rather than merely discouraged.

### §1.2 What it refuses, named affirmatively

- **No connection vocabulary, no portal, no cross-support licensing.** ODQ §419 ruling 1 settles
  this: the refusal stays a refusal. MF-T2F's detail string says a cross-support comparison needs
  *"a registered connection"*; a connection resolves host, support and lifecycle through the
  receipt/operation seam, none of which this era can validate, and a fake one would license exactly
  what F's refusal exists to refuse.
- **No production file moves.** Not `massPart.js`, not `solidLegality.js` (its SHA-256 is pinned
  unmoved in §4 row 4), not `foundation.js`, not `coordinateAbi.js`, not the barrel —
  `fabric/index.js` holds ZERO rows for `massPart`/`solidLegality`/`spatialReceipt`/`stageManifest`
  (executed) and this member continues the zero-row precedent: no reader, no row.
- **No registry of any kind** — ground-surface, datum, massing-phase, material. No
  `localDatumCache`, no `supportSchemaVersion`, no `artifactKind`/`schemaVersion`/`lawVersion`
  stamp: these are validated in-memory vocabulary under MF-T2E's ratified resolution (ODQ §348), and
  the first persisting member mints the stamp once against the then-complete shape.
- **No `EXTERNAL_MASSING_PHASE`, no `MAINTAINED_FREE_SPACE` construction.** ODQ §419 ruling 4: the
  KIND vocabulary ships the SPEC's full seven — a closed list is ported whole and a trimmed one
  would be a second vocabulary wearing the same name — and the `MAINTAINED_FREE_SPACE` arm REFUSES
  with a typed message naming the blocked operation substrate (§299.3c, MF-T2S). That arm flips to
  construction in the member that lands the operation seam, deliberately, in its own packet.
- **No schema-conformance law for slots.** `materialSlotSchemaRef` and *"no required slot may be
  omitted"* need a schema substrate that does not exist; a fake schema would be the defect. The
  roster free-stands on an `ownerPartId` join, and the member that composes rosters INTO `MassPartQ`
  owns the embedding equality at that seam.
- **No vegetation** — `trunk.support`, `canopyAnchor` and species classes are MF-T2L's, and this
  member reserves none of L's names.
- **No second spelling of anything landed** — no overlap/legality/area predicate, no validator, no
  freeze helper; the membership helper stays internal, as in `massPart.js`.
- **No quanta arithmetic at all**, so R-MF-2 has no surface here. No `heightQ()` motion, no y-flip,
  no arrangement-quantum rung, no tuning constant, no dependency bump, no new `tests/lint/**` file
  (§P3b prices at ZERO — the walker edit is to an EXISTING enumerated file that already owns its
  `invariants` row).
- **No live seed byte moves and no declared shift exists** — nothing downstream of a dormant,
  unimported leaf can shift.

### §1.3 The stage-manifest interaction, and the import law it forces

**A new fabric leaf reds MF-T2J's walker by construction.** Its L2 accounting arm is exact in both
directions over the whole directory: every landed `.js` is either assigned by the ported record or on
the frozen `CODEX_SLICE_MODULES` roster, and `supportSurface.js` is neither. The walker names its own
cure — *"…or add it to `CODEX_SLICE_MODULES` here and say why in the packet — silence is what SPEC
10.14 orders refused"* — and this member takes it: ONE roster row in alphabetical position, with
this section as the "why". ODQ §419 ruling 2 settles the naming mismatch: the row goes in per the
walker's own failure message, and the rename rides MF-T2L's landing act. This lane renames nothing.

**Every neighbouring pin holds, executed rather than reasoned:** the assigned-set literal is
untouched at `['coordinateAbi.js','fabricRng.js','solidLegality.js','spatialReceipt.js',
'stageManifest.js']`; `assigned + unassigned === onDisk` reads **5 + 23 = 28**; the record lead
stays **49** of 54; and `FOUNDATION_READERS` is unmoved with `coordinateAbi.js` still at 7 readers.

⛔ **`FOUNDATION_READERS` FORCES THIS MEMBER'S IMPORT DESIGN.** MF-T2J froze the real readers of each
landed foundation module — *"a new reader is a deliberate act."* This member deliberately is not one:
**the leaf imports exactly `./foundation.js` and `./massPart.js`**, neither tracked, and does NOT
import `coordinateAbi.js` (no quanta to stamp) or `solidLegality.js` (the ACCEPTANCE FILE is that
predicate's consumer, and tests sit outside the roster's directory denominator). A design importing
either would owe a second arm inside another member's reserved file for zero behaviour. No new
module enters any import graph.

⛔ **THE ATOMICITY LAW THIS CREATES: the leaf and the roster row land in ONE commit.** Any commit
carrying the leaf without the row is a tree whose lint battery is red.

### §1.4 ⛔⛔ THE TWO DEFERRED MANIFEST ROWS — the §417 standing cure

Both walker edits are MADE and PROVED at this member's tip; **neither path appears in this packet's
`changeManifest`**, because MF-T2H (`sovereigntyLightingContract.walker.test.js`) and MF-T2J
(`townMapStageManifest.walker.test.js`) are both READY at this base and DRAFT reserves exactly as
READY does. The executed probe is quoted in §4 row 18. The rows the landing act inserts, verbatim,
once MF-T2H and MF-T2J are terminal:

**Row A — the census re-record** (path held by MF-T2H; MF-T2J's own deferred row lands first):

```json
{
  "_note": "THE CENSUS RE-RECORD, all five figures re-derived together with the cause stated: ONE NEW TEST FILE and nothing else. 2501/364/2137/20731/5789 -> 2502/364/2138/20737/5790 (tuples re-derived at the landing base per the carry law; the DELTA +1/0/+1/+6/+1 is what crosses a rebase). The walk was SEQUENCED and each figure read from its own arm's failure message; attribution BY ISOLATION, hiding the one file convicting the base tuple exactly at 2501. parked holds at 364 because every title is a string literal in one describe. censusAuthorization: ODQ 276, ODQ 304.4, ODQ 310.4, ODQ 417.1.",
  "action": "TEST",
  "path": "tests/lint/sovereigntyLightingContract.walker.test.js"
}
```

**Row B — the stage-manifest accounting row** (path held by MF-T2J, whose CREATE it is):

```json
{
  "_note": "ONE ROSTER ROW: 'supportSurface.js' appended to CODEX_SLICE_MODULES in alphabetical position - exactly the act the walker's own failure message orders for a landed module the record does not assign ('add it to CODEX_SLICE_MODULES here and say why in the packet'). The why, from packet section 1.3: the leaf is a D3a design-implementation mint, not a sandbox module; nodeOfModule() rightly resolves it to no node and the record's 49-module lead is untouched. FOUNDATION_READERS is unmoved because the leaf imports exactly foundation.js and massPart.js, neither of which the roster tracks. The naming mismatch is ruled at ODQ 419: the row goes in per the failure message and the rename rides MF-T2L.",
  "action": "TEST",
  "path": "tests/lint/townMapStageManifest.walker.test.js"
}
```

### §1.5 The registration template at full strength (§P4, ODQ §35.3)

| the four | the census register | the stage-manifest accounting register |
|---|---|---|
| **THE ROW** | the five-figure tuple, re-recorded whole with its cause (§1.4 Row A) | `'supportSurface.js'` in `CODEX_SLICE_MODULES` (§1.4 Row B) |
| **THE HEAD RE-EXPORT** | **NONE, AND THAT IS THE ANSWER** — `fabric/index.js` is not opened; the four dormant leaves all carry zero barrel rows (executed) and this member continues the precedent | **NONE** — a test-side roster has no composing head; the walker consumes the row directly |
| **THE EXACT-LIST / EXACT-COUNT PIN** | the census arm's five equalities plus `parked + credited === files`, exact both directions | the accounting `toEqual` both ways, the assigned-set literal, the 5 + 23 = 28 arithmetic and the 49-lead pin |
| **THE REGISTRY TEST PATH** | `tests/lint/sovereigntyLightingContract.walker.test.js` | `tests/lint/townMapStageManifest.walker.test.js` |

The other §P4 registers: anchor walker (ceiling zero, discharged §4 row 16), single-declaration
walker (floors strengthen; the seven arriving export names collide with nothing), entry-closure
fence (§6), coupling census / size ratchet / hot-file law (all zero in-directory, R-MF-5).

## §2 · CONTRACT — `src/domain/townMap/fabric/supportSurface.js`

```js
export const SUPPORT_SURFACE_KINDS      // SPEC §10.5 union, verbatim SPEC order (7). Frozen.
export const COMPONENT_SLOT_ROLES       // SPEC §6.4.1 MaterialComponentRole, verbatim order (9).
export const MATERIAL_ABSENCE_REASONS   // SPEC §6.4.1 MaterialAbsenceReason, verbatim order (4).
// ⭐ NO unknown-reason list is declared: MASSING_UNKNOWN_REASONS is IMPORTED from ./massPart.js.

export function supportSurfaceRef(input)
//   {kind:'WORLD_DATUM', datumId} | {kind:'TERRAIN_FACE', patchId}
//   {kind:'FLOOR_PLANE'|'ROOF_FACE'|'WALL_TOP'|'LAND_CAP', ownerBodyId, ownerPartId, patchId}
//   {kind:'MAINTAINED_FREE_SPACE', …} -> TypeError naming the blocked operation substrate
// -> frozen {kind, surfaceId, …branch fields}; surfaceId DERIVED, caller-supplied refused;
//    unknown kind refused; missing/extra branch fields refused naming the field.

export function assertSupportAcyclicity(parts)  // -> frozen {orderedPartIds}
export function componentSlot(input)            // -> frozen PRESENT | NONE | UNKNOWN disposition
export function componentSlotRoster(input)      // -> frozen {ownerPartId, slots}
```

**PURITY:** pure over arguments; string, array and Map handling only. No clock, no randomness, no
locale ordering (every comparison is an explicit codepoint compare), no iteration-order dependence;
fields written in fixed table-driven order; no spread of caller input reaches a published record.
**182 effective lines** measured with eslint's own `Linter` under
`max-lines {skipBlankLines, skipComments}`, against the ratified ≤200-per-leaf and ≤210-packet caps.

## §3 · BLAST RADIUS AND DORMANCY EVIDENCE (§P2.1)

Executed tree-wide `grep -rn 'supportSurface'` excluding `node_modules`, `.git` and `dist`. The
NEW sites are exactly four: the leaf (declaration), the acceptance file, and the two walker edits.
Every other hit is `supportSurfaceId`, the pre-existing MF-T2E/MF-T2F field, in
`massPart.js` · `solidLegality.js` · their four test files · the two landed packets.
**ZERO landed production consumers, ZERO barrel rows, ZERO persistence seams.** The leaf's edges are
OUTBOUND only, so it is a sink in the module graph; nothing can reach it, and there is no declared
shift because there is nothing downstream to shift. The seven arriving export names returned **0
hits each** over `src tests` at the base, so no existing code speaks any name this member mints.

## §4 · PREFLIGHT — every row re-executed by this lane at ITS base `f7ba3145`

| # | row | result |
|---|---|---|
| 1 | the five refs re-resolved fresh | branch `review-fixes-2026-07-08` @ `d36fdd49` · `holding-t2h` `2064a67e` · `holding-t2h-r2` `05e7f9d5` · `holding-t2j` `f7ba3145` (BASE) · sealed `ee0db96d`. `holding-t2bf` is gone (landed as `3519dcc1`); its content is in this stack as `7d6bde7c`. Stack unrebased and unlanded — executed ancestry matrix |
| 2 | preamble SHA-256 | `0706aad6…1db4ed` — **matches** |
| 3 | packet-manifest reservations | MF-T2H **READY**, MF-T2J **READY**, every other MF-T2* LANDED; the three CREATE paths carry **zero** reservations at any status |
| 4 | consulted-source hashes | spec blob `aa613cb8d9ea8b895236304e9e72b08940ba1698` = ledger-HEAD object (executed `rev-parse`) · sealed `solidLegality.js` `b2f59501…b645` · landed `massPart.js` `d52c19fa…e76f` · landed `solidLegality.js` `950680dc…391f` — **all four match**, each with a single-commit history (`bfa5709e`, `6b7748e6`) |
| 5 | the sealed-fabric negative | four greps over 54 sealed fabric modules: **0 / 0 / 0 / 0** files. ⚠ The compile published `1 / 0 / 0 / 0`; re-executed here the first grep is **0**, because the sealed `solidLegality.js` spells `supportSurfaceId`, not `SupportSurfaceRef`. The instrument was proved live by a control grep for `supportSurfaceId`, which returns that file. The conclusion is unchanged and strictly stronger: **nothing to port; this is a design-implementation member** |
| 6 | name-collision scan, 7 arriving exports over `src tests` | **0 hits each** |
| 7 | effective-line instrument validation | `massPart.js` **118** · `solidLegality.js` **150** · `stageManifest.js` **219** — all three reproduce their packets' published figures exactly, so the instrument is validated on three independent knowns before it prices this leaf |
| 8 | the id-wall grammar capture | `/^[a-z0-9][a-z0-9:._-]{0,95}$/` read from source AND exercised: `'support:wallTop:w9'` REFUSED · `'support:wall-top:w9'` ADMITTED · `'support:terrain-face:p1'` ADMITTED · `'support:wall-top:b1:w9:cap'` ADMITTED · `'Support:wall-top:w9'` REFUSED · a 117-char derivation REFUSED |
| 9 | census base tuple | `2501/364/2137/20731/5789` — proved by running the census arm at base **GREEN 33/33, TRUE_EXIT 0**, so the declared tuple IS the measured tuple |
| 10 | stage-manifest walker with leaf + roster row | **3 passed, TRUE_EXIT 0**. Quantified: onDisk 28, assigned 5, unassigned 23; `nodeOfModule('supportSurface.js')` is `null`; record lead **49** of 54 |
| 11 | `FOUNDATION_READERS` unmoved | proved by row 10's green with the leaf present; `coordinateAbi.js` still reads 7 |
| 12 | barrel zero-row precedent | `fabric/index.js`: **0** mentions of the four dormant leaves; this member adds none |
| 13 | both typecheck configurations | `typecheck:domain:strict` **1134 / ceiling 1134, exit 0**; `typecheck:ratchet` **173 / ceiling 173, exit 0** — ZERO new errors in either. ⚠ The leaf first read **+7 strict / +1 ratchet** and was cured by TYPEDEF and restructure (§7 J-TET2K-2), never by widening; **0 `any` tokens in a type position** |
| 14 | `entropyRootCensus` regexes over the leaf | READ_RE **0**, WRITE_KEY_RE **0**; zero hash/`Math.random`/`Date`/`Intl` sites |
| 15 | `package.json` / `package-lock.json` | **byte-unmoved** (`git diff --stat` empty) |
| 16 | anchor preflight (§P3) | `npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js` → **9 passed, TRUE_EXIT 0**. Ceiling zero honoured by construction: the scanned matchers appear **zero** times in the new file |
| 17 | CLAIM_RE over this packet | **0 hits** (executed with the exact regex from `tests/docs/enforcement-claims.test.js`) |
| 18 | the duplicate-path probe | executed and quoted in full at §8 |

## §5 · ACCEPTANCE — six cases, ONE file, one literal `describe`

`tests/domain/townMapSupportSurface.test.js` — one `describe`, six straight-line `test` calls,
string-literal titles, the one loop INSIDE a named test (SP-D idiom); no `.each`, no `runIf`, no
nesting. **Executed: 6 passed (6), TRUE_EXIT 0.**

| id | case |
|---|---|
| **A1** | GUARD-THE-GUARD, first: the three vocabularies nonempty, frozen and deep-equal to the SPEC-verbatim literals (7 / 9 / 4); the IMPORTED `MASSING_UNKNOWN_REASONS` pinned to its 4 literals here too, so a drift in `massPart.js` reds this battery; the kind→token table shown TOTAL — every kind either derives a key or refuses as the named blocked kind — before any key is trusted. Then each constructible kind constructs, frozen, replaying JSON-identical. |
| **A2** | THE KEY: `support:terrain-face:p1`, `support:wall-top:b1:w9:cap`, `support:world-datum:d0`, `support:roof-face:b1:r1:rf` pinned exactly; distinct refs give distinct keys; the derived key is ADMITTED by the landed wall executed through `massPart.solidPartQ` (also the upward-compatibility proof); caller-supplied `surfaceId` refused; and the engineered near-collision pair `(a, b:c, d)` / `(a:b, c, d)` — two DISTINCT refs that would join to the one key `support:wall-top:a:b:c:d` — is UNCONSTRUCTIBLE, each half refused naming the reservation, with the lawful `(a, b, d)` control constructing beside them. |
| **A3** | REFUSALS, positive control first: unknown kind · `MAINTAINED_FREE_SPACE` naming the blocked operation substrate · missing `patchId` · missing `ownerPartId` · uppercase segment · over-long derivation refused by the wall · non-record input · an extra field (`localDatumCache`) refused by name. |
| **A4** | THE DAG, identity arm FIRST: an all-rooted roster returns every part, and the same roster in another array order answers identically (input-independence); a three-deep chain terrain → wall → part-on-its-roof orders `['a1','m2','t3']`. Then duplicate `partId`, unresolved `ownerPartId`, self-support and a two-part cycle each refused by name, and the two production messages proved DIFFERENT so neither arm can cover for the other. |
| **A5** | COMPONENT SLOTS: PRESENT/NONE/UNKNOWN each construct frozen; a fourth status refused; `NONE` and `UNKNOWN` carrying `materialId` refused; `PRESENT` carrying `reason` refused; each status validated against the RIGHT closed list (an absence reason on the UNKNOWN arm refuses and vice versa); an unknown role refused; roster nonempty enforced, duplicate `slotId` refused naming it, slots built through the one route. |
| **A6** | THE CONSUMER SEAM F → K, over solids keyed by THIS member: one derived terrain key with overlapping intervals → `VOLUME` / `OVERLAPPING`, `sharedVolumeQ` exactly `{numQ: 500000000000n, denQ: 1n}`, `sharedHeightQ` `5000n`; the stacked half-open pair `[0,5000)` / `[5000,9000)` → `sharedVolumeQ` `{numQ: 0n, denQ: 1n}`, `DISJOINT_OR_ABUTTING`; two different derived keys → `REFUSED` / `DIFFERENT_SUPPORT_SURFACE`, `verdict: null`, detail verbatim. The test imports the landed predicate; the leaf does not. |

## §6 · THE INTERIOR RED, THE CENSUS WALK, AND THE ENTRY-CLOSURE FENCE

⚠ **THE INTERIOR RED WAS NAMED BEFORE IT EXISTED** (§P7.12): one new test file forces the
five-equality census arm red by construction. The SEQUENCED walk, each figure read from its own
arm's failure message and never computed:

| step | reading |
|---|---|
| 1 | `files`: *"expected 2502 to be 2501"* |
| 2 | `parked` PASSED at 364 without redding; `credited`: *"expected 2138 to be 2137"* |
| 3 | `titles`: *"expected 20737 to be 20731"* |
| 4 | `suiteTitles`: *"expected 5790 to be 5789"* |
| 5 | GREEN at the after tuple, **33 passed (33), TRUE_EXIT 0** |

⛔ **ATTRIBUTION BY ISOLATION, EXECUTED:** with the walker pinned at the after tuple, hiding
`townMapSupportSurface.test.js` alone convicted `files` at **2501** — the base tuple exactly, which
is the proof that nothing else in the tree moved this census under the lane. `parked` holding at 364
was earned by the one-describe/literal-titles form. The cause paragraph lands in a counted file, so
the walker was re-run AFTER the comment landed: still **33 passed, TRUE_EXIT 0**.

**The entry-closure fence** (§P2.2 as amended by ODQ §324.5) discharges POST-BUILD only, with the
forensic zoom over the built chunks. Both are reported in the completion receipt.

## §7 · MUTANTS — seven, plus the guard-the-guard arm, clean-tree control FIRST

⛔ The clean-tree control ran first and read **exit 0 with 6 passed (6)** — an all-red sweep with no
clean-green control is a broken runner. Every mutant was planted by exact single-anchor substitution
(the harness refuses to fire on 0 or 2 matches), convicted, and restored **digest-exact** against
the pristine SHA-256 `9d0e162b4bb592de6e95b80be6dea356279aeea8aea2e021ee8e62815ede2ea7`; `git diff`
over the fabric directory reads empty afterwards.

| # | branch deleted or weakened | conviction |
|---|---|---|
| M1 | the kind token dropped from the key derivation | **A2 and A3** — *"expected 'support:p1' to be 'support:terrain-face:p1'"* and *"expected 'support:b1:w9:cap' to be 'support:wall-top:b1:w9:cap'"*. ⚠ The compile predicted single-arm; it convicts on TWO, because A3's positive control is itself a key-spelling pin. Stronger than predicted, and stated rather than smoothed |
| M2 | the `:`-in-segment refusal weakened (the segment grammar admits the separator) | A2, single-arm — the near-collision pair becomes constructible |
| M3 | the cycle branch deleted (an order returned for a cyclic roster) | A4, single-arm, at the SELF-SUPPORT call site (test line 201) |
| M4 | the unresolved-owner refusal deleted | A4, single-arm, at the UNRESOLVED call site (test line 196) |
| M5 | the duplicate-`slotId` branch deleted | A5, single-arm |
| M6 | the `NONE`/`UNKNOWN`-carrying-`materialId` structural refusal deleted | A5, single-arm |
| M7 | the caller-supplied-`surfaceId` refusal deleted (the free-alias door reopened) | A2, single-arm |
| GG | guard-the-guard: the kind vocabulary emptied | A1 first, then A2/A3/A4/A6 — the nonempty pins red BEFORE any membership test could pass on nothing |

⭐ **§P6 SUBSUMPTION, PROVED BY EXECUTION RATHER THAN BY ARGUMENT.** M3 and M4 both live in
`assertSupportAcyclicity`, so the question is whether either guard covers for the other. Executed:
M3 convicts at test line **201** while line 196 still passes, and M4 convicts at test line **196**
while lines 201 and 207 still pass. Neither covers for the other. **Zero equivalent mutants were
found.**

⭐ **A PIN WAS SHARPENED MID-LANE AND THE REASON IS RECORDED.** M3's first conviction arrived as
`.toMatch() expects to receive a string, but got object` — a matcher type error, not a statement
about behaviour, because the message helper answered `null` when a call did not throw. The helper
now throws *"expected this roster to be REFUSED, but assertSupportAcyclicity returned"*. Same
coverage, honest diagnosis: a deleted refusal that reds as a matcher complaint is a deleted refusal
somebody will misdiagnose.

## §8 · THE DUPLICATE-PATH PROBE, EXECUTED AND QUOTED

Both deferred paths were added to this packet's `changeManifest` and `validate:packets` run, to prove
the reservation is live at the base rather than assumed. The refusal, verbatim:

```
[implementation-packets] duplicate change path across packets: tests/lint/sovereigntyLightingContract.walker.test.js (MF-T2K, MF-T2H)
[implementation-packets] duplicate change path across packets: tests/lint/townMapStageManifest.walker.test.js (MF-T2K, MF-T2J)
```

The rows were then removed and their texts carried to §1.4 for the landing act. Ruled per §P7.11 /
CR-HB2B-SPLITP and the §417 standing law: the code edit is made and proved at this tip; only the
manifest ROW is deferred.

## §9 · JUDGMENTS

| id | the call | why |
|---|---|---|
| J-TET2K-1 | base fixed at `f7ba3145` after re-deriving the stack rather than inheriting the compile's pin | the cascade had moved: MF-T2Bf landed on `claude/composite-r4` as `3519dcc1` and its holding pin is gone. Executed ancestry shows neither `05e7f9d5` nor `f7ba3145` is an ancestor of `3519dcc1` or of the ledger branch, and the D3a stack still branches at `9bfae712` — so it is unrebased, unlanded, and `f7ba3145` IS the then-current tip. No STOP condition fired |
| J-TET2K-2 | the +7 strict / +1 ratchet errors cured by TYPEDEF and restructure | the allowance is ZERO and the any-cast allowance is a second ledger. The grammar table gained an explicit `SupportKindGrammar` typedef and a `Record<string, …>` annotation; the derived record is built from a typed branch object; and the depth walk now carries its depth in an accumulator instead of re-reading the map, which removed the last two casts outright. Zero `any` in a type position |
| J-TET2K-3 | `orderedPartIds` ordered by (depth, codepoint) — INPUT-INDEPENDENT | the packet asks for "input-independent order" and this is the spelling that makes the phrase testable: the same roster in any array order answers identically, pinned in A4. Preserving input order would have made the phrase false |
| J-TET2K-4 | the blocked seventh kind carried as a table ROW with `segments: null` | ODQ §419 ruling 4 keeps all seven kinds. Carrying the block as data rather than as a special case is what lets A1 walk the vocabulary and prove the table TOTAL — a table missing a row would leave one kind admitted by membership and unspellable, which is the exact defect a totality arm exists to catch |
| J-TET2K-5 | a missing owner read as a root inside the depth walk (`?? null`), with the unresolved case refused by ONE guard upstream | §P6 forbids a redundant second guard: two guards each able to hold the invariant make the mutant vacuous. The upstream pass owns the refusal; the walk's `?? null` is a type-satisfying read that keeps M4's conviction single-armed and terminating |
| J-TET2K-6 | the §4 row 5 deviation reported rather than smoothed | the compile published `1` hit and the re-execution reads `0`. The instrument was proved live by a control grep before the zero was believed, and the conclusion strengthens rather than changes. A row re-derived at base that silently matches a stale figure is the shape this program's re-derivation law exists to prevent |
| J-TET2K-7 | the A4 message helper sharpened mid-lane (§7) | a mutant that reds as a matcher type error has been convicted but not diagnosed; the change costs nothing and buys an honest failure message |

## §10 · RAISED

**CHAIR:**

1. **RAISED-1 — `CODEX_SLICE_MODULES` now holds a non-codex module.** Taken per ODQ §419 ruling 2
   and the walker's own failure message; the constant's NAME lies by one word once a D3a mint sits
   in it. The rename rides MF-T2L's landing act, as ruled. Recorded here so the mislabel stays
   visible until it does.
2. **RAISED-2 — the compile's §4 row 5 figure was `1` and re-executes to `0`** (§4 row 5,
   J-TET2K-6). No action needed; recorded because a preflight row that drifted between compile and
   execution is exactly what the re-derivation law is for.

**OWNER:** none. This member mints no tuning constant, no rung, no persisted schema, no paid or
user-visible surface, and moves no seed byte.

## §11 · SCOPE BUDGET — measured against the ODQ §419 ratified caps

| Limit | This packet | Ratified / standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families | `0` | ≤1 |
| Named state writers / feature flags / user-facing surfaces | `0` | ≤1 each |
| Direct production consumers | `0` | ≤2 |
| New logic-bearing production leaves | `1` | ≤2 |
| Existing logic-bearing production files modified | `0` | ≤3 |
| Registration-only edits | `2` (both deferred-manifest, §1.4) | ≤3 |
| Handwritten files total | `6` | ≤12 |
| New/changed effective production lines | **`182`** | **≤210** (ratified) |
| Effective lines per new leaf | **`182`** | **≤200** (ratified) |
| Delta in a shared/hot file | `0` | ≤15 |
| Acceptance cases | `6` | ≤8 |

No override requested; no split needed. Both ratified caps hold with room.

## §12 · COMPLETION RECEIPT — executed by lane TE-T2K at base `f7ba3145`

**TIP FOR CAS: `088945bf`** at the time this section was written; the stamping commit that carries
this section supersedes it, and the receipt row below is the authority. Three build commits on a
detached ref, **no ref moved**, tree clean.

| # | commit | subject |
|---|---|---|
| 1 | `59ea7e3b` | `feat(MF-T2K)` — the leaf, the acceptance file and BOTH walker edits, atomically |
| 2 | `dad5a351` | `docs(MF-T2K)` — the packet at DRAFT, with its manifest and INDEX rows |
| 3 | `088945bf` | `docs(MF-T2K)` — DRAFT → READY with the §4 preflight executed at this base |

**Deliverable digests, read from the COMMITTED tip with `git show HEAD:`:**

| file | SHA-256 |
|---|---|
| `src/domain/townMap/fabric/supportSurface.js` | `9d0e162b4bb592de6e95b80be6dea356279aeea8aea2e021ee8e62815ede2ea7` |
| `tests/domain/townMapSupportSurface.test.js` | `7c3f69680cb352411358126a230cde030744b2dc2f3a34f97799047664ee6a31` |
| `tests/lint/townMapStageManifest.walker.test.js` | `c2cabb6ee48cd74708bef689c051b94b7e50bd23e44f1bcb4d218808b2477961` |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | `784464018b7edbd391eb6c80cb84f4f4701765bfc8ff536a57b07ce79aa9513c` |

**The two pinned-unmoved substrate files re-hashed at HEAD**, so "zero production files move" is a
measurement rather than a claim: `massPart.js` `d52c19fa…e76f` and `solidLegality.js`
`950680dc…391f` — **byte-identical to their base values.**

**Results.**

- **Acceptance A1–A6: 6 passed (6), TRUE_EXIT 0.**
- **Census** `2501/364/2137/20731/5789` → `2502/364/2138/20737/5790`, walked SEQUENCED with each
  figure read from its own arm's failure message, GREEN **33/33** at the after tuple. Isolation:
  hiding the one new test file alone convicted `files` at **2501**, the base tuple exactly. Re-run
  AFTER the cause paragraph landed: still 33/33, TRUE_EXIT 0.
- **Stage-manifest walker with leaf + roster row: 3 passed, TRUE_EXIT 0.** onDisk 28 = assigned 5 +
  unassigned 23; record lead **49**; `FOUNDATION_READERS` unmoved with `coordinateAbi.js` at 7.
- **Anchor walker 9 passed · single-declaration walker 5 passed · combined focused battery 56
  passed (56), TRUE_EXIT 0.** Scoped `eslint` over all four touched files: **exit 0**.
- **`typecheck:domain:strict` 1134 / ceiling 1134, exit 0. `typecheck:ratchet` 173 / ceiling 173,
  exit 0.** ZERO new errors in either; **0 `any` in a type position**.
- **Mutants 7/7 convicted plus the guard-the-guard arm**, clean-tree control **exit 0 with 6 passed
  (6)** first, every restore **digest-exact**, `git diff` over the fabric directory empty. §P6
  subsumption proved by execution (§7). **Zero equivalent mutants.**
- **`validate:packets` green at BOTH transitions:** DRAFT `147 packets (2 READY)`, READY
  `147 packets (3 READY)`, both TRUE_EXIT 0. The duplicate-path refusal executed and quoted at §8.
- **Entry-closure fence POST-BUILD** (`npm run build` exit 0, 314 prerendered route documents), then
  `VERIFY_DIST=1` → **3 passed (3), TRUE_EXIT 0** — EXECUTED, not a pre-build skip.
- **Forensic zoom over 710 dist chunks.** Six probes verified unique to the leaf across `src/`
  (`assertSupportAcyclicity` · `COMPONENT_SLOT_ROLES` · `SUPPORT_SURFACE_KINDS` ·
  `componentSlotRoster` · `UNCOVERED_BY_DESIGN` · the segment-reservation message): **0 chunks
  each.** ⚠ Two candidate probes were **WITHDRAWN** rather than reported, and the reason is the
  withdrawn-probe lesson itself: `support:terrain-face:` and `support:world-datum:` appear in **zero**
  `src/` files, because the key is BUILT from the token table and never spelled as a literal — an
  absence measured with a probe that is not in the source proves nothing. Three positive controls
  owned by landed fabric modules (`plan-q1-0-1000-v1`, `CANONICAL_SPATIAL_OPERATION`,
  `ORTHOGONAL_CROSS_PLAN`) read **1 chunk each**, so the denominator provably contains the fabric
  surface.
- **§408 pre-gate sweep** `npx vitest run tests/lint tests/build tests/ops`: TRUE_EXIT 1,
  `3 failed | 188 passed (191)` files, `5 failed | 2164 passed | 63 skipped (2232)` tests. All five
  joined to the frozen eleven by an executed title-prefix match against
  `scripts/.test-ratchet-baseline.json` (`4deb4f02`), each `class: "debt"`: **STRAYS 0.** The
  figures are identical to MF-T2J's sweep at the same base, which is the second reading that this
  member added no red to these three directories.
- **S0, TWO-PART, at this base** (§389.1/§397): the bare gate script `check-observed-shape-readers`
  read **exit 1** WITH the printed envelope verdict *"observed-shape detector or unscanned execution
  input changed since the schema-9 instrument was governed; an ordinary gate/write cannot migrate
  the instrument"* — a real envelope reading, not the `ERR_MODULE_NOT_FOUND` module error that wears
  the same exit code. This member writes no governed file and does not move that state.
- **`package.json` / `package-lock.json` byte-unmoved.** No dependency arrives.

**THE FULL GATE IS DEFERRED TO THE LANDING SLOT**, on the CT-2 / MF-T2J precedent: this lane's base
is provably not an ancestor of the branch, so a gate receipt taken now would certify a tree that is
not the one that lands. The detached terminal fires at the GO.
