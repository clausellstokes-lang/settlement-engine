# Town cartography / MF-T2J — the executable S0–S23 stage manifest, ported as a published record, with the stage-graph SCC preserved rather than repaired

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `115396365f4e1c251af2b2e7a71c2c6c7c0b328a`
  ⚠⚠ **AS AUTHORED — the row above now names the LANDING SLOT (see the Landing note below); the
  BUILD base was `05e7f9d5`.** That SHA is MF-T2H's **HOLDING (unlanded)** commit, which is itself stacked on MF-T2Bf's `7d6bde7caa61af99df85640b210328745caaad2f`,
  so this member is **THREE DEEP**. Neither is yet an ancestor of `claude/composite-r4`, which stood
  at `19b799ce718d52e36a3b14a85fa9cfd5051ccf26` while this member was built. The branch token names
  the branch of record this member is verified FOR and will land on; the row is **re-stamped at the
  landing slot**, after MF-T2H lands and this member is rebased onto it. All three values were read
  with `git rev-parse` at this lane's start and none was ever extended from a quoted prefix (§381's
  fabricated-SHA law). Every figure below was executed at THIS base.
  ⚠ The status and verified-base values above each stand ALONE on their line because
  `parsePacketHeader` (`scripts/implementation-packets.mjs`) anchors both rows at end-of-line.
- **Landing note (TE-MAPSTACK-LANDING, 2026-08-23, ODQ §461.2 — THE MAP STACK):** authored at BUILD
  base `05e7f9d5` as holding tip `f7ba3145` (pinned `refs/preserve/holding-t2j`); landed as ONE stacked landing
  with its three siblings (MF-T2J → MF-T2K → MF-T2L, then MF-T2M rebased onto the chain tip) at
  slot `11539636` (WEB-7, the 31st landing). Rebased implementation commits `6e34c32f → 73351cf4 → 8a0ceca9 → 09a57da7`
  (authored `ac095693 → f39fe861 → 11761f70 → f7ba3145`). Entered at **LANDED** directly — the §410 form, as WEB-5/6/7 did:
  MF-T2H's READY reservation on the census walker stands until HK-2 lands, so the §417 deferred
  row(s) — the §1.4 row — could only enter the manifest at a terminal status, and did, at this act. Census:
  slot `2500 / 365 / 2135 / 20756 / 5792`; this member's position `2502 / 365 / 2137 / 20762 / 5794`; the stack's ONE live
  tuple `2505 / 365 / 2140 / 20781 / 5797` convicted at the stack tip (33/33) with the negative control
  (*"the estate's file count moved — re-measure, do not re-word: expected 2505 to be 2500"*). Digests re-hashed at the landed tree: `tests/lint/townMapStageManifest.walker.test.js` authored `cae279abb87c…` → landed `a481bda5f6f69019a59ba3d380b0e3e6b7109143cdddd72ec91e9d400efa2d11`; `tests/lint/sovereigntyLightingContract.walker.test.js` authored `94726e38d924…` → landed `dc2b5fa3744a31cea98b02f76ade3fa4fd1efe0fd3e5d7ffed27226cd433a710`; `scripts/mutation-coverage-manifest.json` authored `2e50630c4fc8…` → landed `071279c73be615db73ffe363e1762ff9bb32135d04057cee720d0138e3e49b75`.
- **Depends on:** `MF-T2H` — STACKED. The dependency is real rather than tidy: this member's live
  arms derive over `fabric/fabricRng.js` and `fabric/spatialReceipt.js`, both of which MF-T2H
  creates, and its sweep plant's host is `fabricRng.js`. Verified present at this base before
  anything was written: `fabricRng.js` hashes to `4094ecb8ba24b07af812ebc8d8acbdb78ec9afe6584206fce2b2f5da28d6e95a`,
  the exact value MF-T2H's own deliverable table publishes.
- **Binds forward:** every remaining D3a port member. Each lands modules the record already assigns,
  so each grows the derived half of §287.8 automatically and none may land a fabric module that
  claims no stage (§1.3).
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file at
  this base by this lane, identical to the value MF-T2B, MF-T2G, MF-T2Bf and MF-T2H carry, so no
  re-stamp occurred in the window. Its §P1 refutations, §P2 hazard dispositions, §P3 anchor
  preflight, §P3b mutation-coverage obligation, §P5 census law, §P6 mutant hygiene, §P7 STOP set and
  §P8 capsule law bind this packet and are not restated.
- **Collision group:** `d3a-port`. ⛔⛔ **ONE SHARED PATH IS RESERVED BY MF-T2H AT THIS BASE AND THE
  REFUSAL WAS EXECUTED RATHER THAN REASONED ABOUT** — see J-TET2J-1 and §1.4. Every other path this
  member touches carries **zero** reservations of any status.
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the
  branch. **This lane moved no ref.**

> **`censusAuthorization`:** this packet moves the test census by
> **`+2 files / +0 parked / +2 credited / +6 titles / +2 suiteTitles`**. **Base tuple, convicted at
> this base: `2499 / 364 / 2135 / 20725 / 5787`. After tuple, convicted at this base with the member
> applied: `2501 / 364 / 2137 / 20731 / 5789`.** Its authorizing decisions are **ODQ §276** (the
> build sheet architecting the §275 adoptions) and **ODQ §304.4** (the D3a port charter, twin-life
> bounded), under §299.4's binding-forward rule. The family's stamp is **GRANTED** at ODQ §312.2b.
> ⚠ **THE PREDICTED MOTION AND THE MEASURED MOTION ARE THE SAME FIVE NUMBERS**, and the sequenced
> walk that produced them is in §6 — one figure at a time, each read from its own arm's failure
> message rather than computed, with attribution by ISOLATION.
> ⭐ **NO SECOND CENSUS MOVES.** `entropyRootCensus.walker.test.js` counts hash-helper DEFINITIONS
> under `/function (fnv1a32|hash01|hashUnit|hash32|fnv1a)/`; the new leaf declares **0** of them
> (executed, §4 row 14), so MF-T2H's re-record to 34 stands untouched and is re-proved green here.
> ⭐⭐ **STACKED LANDING (ODQ §461.2) — convicted at the stack tip, never carried.** Slot tuple
> (`claude/composite-r4` = `11539636`, WEB-7): `2500 / 365 / 2135 / 20756 / 5792`; this member's position in the chain
> re-derives to `2502 / 365 / 2137 / 20762 / 5794`; the stack's ONE live tuple `2505 / 365 / 2140 / 20781 / 5797` was convicted at the
> stack tip (33/33) with the negative control — the slot's own tuple put back reds at `files`:
> *"the estate's file count moved — re-measure, do not re-word: expected 2505 to be 2500"* (the summed delta +5). The DELTA `+2/+0/+2/+6/+2` crossed the rebase; the
> authored tuples above are the BUILD-base history.

> ⛔ **PORT SOURCE PROVENANCE (preamble §P1 R-MF-4).** The sandbox is not a git repository. This
> lane read both sealed sources from the preserve ref `refs/preserve/map-sandbox-w3f-sealed`
> (`ee0db96d381a5a30efad63a7e2d355e0cc3db669`) and **re-hashed them before any edit**.
>
> | source module @ `refs/preserve/map-sandbox-w3f-sealed` | SHA-256 | role |
> |---|---|---|
> | `src/domain/townMap/fabric/stageManifest.js` | `0a0b3a26255986cc565f460d97fa1381e7527db8e07344335d2aba908427df4f` | ported here (375 lines, 214 effective) |
> | `tests/lint/stageManifest.walker.test.js` | `fc33635089f3722d8ffe92a7e09bf8ffe6ad50d70c7caad257ad25803176cd2a` | the 12-arm source-derived walker; re-aimed here (§2.2), 303 lines |
>
> **Deliverables, hashed after this member (all three are CREATE — none existed at the base):**
>
> | file | SHA-256 after this member, read at the COMMITTED tip with `git show HEAD:` |
> |---|---|
> | `src/domain/townMap/fabric/stageManifest.js` | `ad639c8e525f0db469660767fb5904825bf8d33a7b259f33de1f5d2c1c2286b2` |
> | `tests/lint/townMapStageManifest.walker.test.js` | `a481bda5f6f69019a59ba3d380b0e3e6b7109143cdddd72ec91e9d400efa2d11` |
> | `tests/domain/townMapStageManifest.test.js` | `413832ff90e87941998b09f4de80bcf3363bf4bb918d510c284461f5fd5e2114` |
>
> ⭐ **RE-HASHED AT THE MAP STACK LANDING (slot `11539636`)** — `tests/lint/townMapStageManifest.walker.test.js`: authored `cae279abb87cdc19593ba49f8916200f5912e45e7b6a47b2e51366090555e316` → landed `a481bda5f6f69019a59ba3d380b0e3e6b7109143cdddd72ec91e9d400efa2d11` (the value now in the table above); cause: MF-T2K/MF-T2L/MF-T2M appended their roster rows and MF-T2L executed the §419.2 rename.
>
> **The three MODIFY hosts, at the same tip:**
>
> | file | SHA-256 after this member |
> |---|---|
> | `tests/lint/sovereigntyLightingContract.walker.test.js` | `dc2b5fa3744a31cea98b02f76ade3fa4fd1efe0fd3e5d7ffed27226cd433a710` |
> | `scripts/mutation-sweep.sh` | `f0c680c7b1e7676e42b4cbedf2ef3d24bea65d3f6df36fdda872821e075e252b` |
> | `scripts/mutation-coverage-manifest.json` | `071279c73be615db73ffe363e1762ff9bb32135d04057cee720d0138e3e49b75` |
>
> ⭐ **RE-HASHED AT THE MAP STACK LANDING (slot `11539636`)** — `scripts/mutation-coverage-manifest.json`: authored `2e50630c4fc8bb0145bc888554aec712cc15da35a027c0b43f40bae08527586c` → landed `071279c73be615db73ffe363e1762ff9bb32135d04057cee720d0138e3e49b75` (the value now in the table above); cause: WEB-1 (547e4d58) added one rationale row at a disjoint hunk; this member's row == authored.
> ⭐ **RE-HASHED AT THE MAP STACK LANDING (slot `11539636`)** — `tests/lint/sovereigntyLightingContract.walker.test.js`: authored `94726e38d924e6fe7cd5a4b8c0bc5256638dd7c02b7561d5315cce09a0d69fe4` → landed `dc2b5fa3744a31cea98b02f76ade3fa4fd1efe0fd3e5d7ffed27226cd433a710` (the value now in the table above); cause: six landed siblings (H8B, WEB-1/4/5/6/7) and MF-T2K/MF-T2L/MF-T2M re-recorded below this member's block.
>
> ⭐ **THE DIGESTS ARE READ FROM THE COMMIT, NOT FROM THE WORKING TREE.** The pre-commit hook runs
> `eslint --fix` on staged JS and can re-stage after a green; `stageManifest.js` and the walker
> compare byte-identical to their pre-battery digests, so the hook changed nothing.
>
> ⚠ **THE TUPLE AND EVERY HASH ARE RE-STAMPED AT THE LANDING SLOT, NOT CARRIED.** This member is
> stacked THREE DEEP on unlanded holding commits and will be rebased. Per the carry law the DELTA
> (`+2/+0/+2/+6/+2`) is what crosses a rebase. The first rebase step is the carry-proof-by-absence
> blob-SHA compare on both sealed sources.

---

## §1 · WHAT THIS MEMBER IS, AND WHAT IT REFUSES

### §1.1 The one leaf, and what it means in a tree that is not the tree it measures

One dormant production leaf is ported into `src/domain/townMap/fabric/`, and nothing is wired to it:

**`stageManifest.js`** (219 effective) — §287.8's *"executable S0–S23 manifest [that] owns stage
inputs/outputs/imports/random namespaces/ABI/law/censuses/invalidation"*, with SPEC §10.14's reason:
architecture stops being prose at this seam.

⛔⛔ **THE PORT'S CENTRAL FACT, STATED FIRST BECAUSE EVERY FIGURE BELOW DEPENDS ON IT.** In the
sealed sandbox the manifest declared **one** datum — which stage a module serves — and its walker
re-derived every other field from the 54-module sandbox fabric on every run. **This tree is not that
tree.** `src/domain/townMap/fabric/` here holds the codex slice plus the D3a port so far: **27
modules after this member, of which 5 are named by the record and 49 record modules do not exist
here at all** (executed, §4 row 5). A verbatim port of the sealed walker would therefore red on
arrival, and — worse — three of its arms would pass for the wrong reason.

So the member ports the table as **PUBLISHED DATA, a frozen record of a measurement taken
elsewhere**, and splits the checking into the two directions that are honest here:

1. **THE RECORD AGAINST ITSELF** (`tests/domain/townMapStageManifest.test.js`). Every projection the
   manifest publishes — the topological order, the backward edges, the foundation closure, the
   namespace-collision roster and the strongly-connected component — is re-derived by an
   independently written implementation in the test and must agree. The Tarjan run is **written in
   the test rather than imported from the module**, so the component the manifest PUBLISHES is
   compared against a component the test COMPUTES; asking the module to confirm its own field would
   be the self-referential vacuity §P2.10 forbids.
2. **THE RECORD AGAINST THE LANDED SUB-TRANCHE** (`tests/lint/townMapStageManifest.walker.test.js`).
   Every fabric module that is BOTH landed AND assigned has its imports, its minted key spellings
   and its `fabricRng(` fork sites re-parsed from source with `acorn` and refused if they exceed
   what the record allows. **That set grows with every later port member**, so §287.8's executable
   half arrives incrementally rather than being promised.

### §1.2 ⛔⛔ THE HEADLINE RESULT TRAVELS WITH THE MEMBER, AND IT IS PRESERVED RATHER THAN REPAIRED

**The module import graph is acyclic and the STAGE graph is not.** Collapse each module onto the
public S0–S23 id it serves and exactly one strongly-connected component appears, spanning
**`S2 · S3 · S4 · S6 · S13`**, closed by exactly two named module imports (`S13>S6` and `S6>S2`).
It is not a contradiction: a collapse can only add cycles, never remove them, and this is what *"the
public numbering is a narrative order, not a derivation order"* looks like measured instead of
asserted.

**THE PORT PRESERVES THE COMPONENT AS PUBLISHED DATA. Removing it is W4's generative-epoch work and
is explicitly NOT this member's.** The pin is built so a later "cleanup" reds: the roster's
**membership** is a literal, its **completeness** is proved by cutting exactly the two inversions and
getting a DAG, and `topologicalNodeIds(NODE_EDGES)` must return `null` — the honest answer for a
graph that has no order.

⭐⭐ **AND THE MEMBER MEASURED SOMETHING THE SEALED RECORD DOES NOT PUBLISH: THE FEEDBACK SET IS
MINIMAL.** Cutting **either** inversion alone leaves a smaller but still cyclic collapse, and the two
residues are different components — `S6>S2` removed leaves `['S13','S6']`; `S13>S6` removed leaves
`['S2','S3','S4','S6']`; both removed leaves `[]`. So neither written reason is decorative, the
roster cannot be trimmed to one edge and still explain the cycle, and a lane that deletes one
inversion "because the other covers it" reds against a named residue rather than against a length.

### §1.3 What it refuses, named affirmatively

- **No consumer is wired**, no barrel row is added and `src/domain/townMap/fabric/index.js` is not
  opened (J-TET2J-2). §P4 requires the HEAD RE-EXPORT to be named or its absence reasoned: **there
  is none, on purpose.** A re-export has no reader in this member and would place a dormant leaf in
  the barrel's closure for no gain — exactly the shape §P2.2 warns about. `solidLegality.js` and
  MF-T2H's two leaves set the precedent: zero barrel rows.
- **The record is NOT re-derived for this tree, and no sandbox figure is edited to fit it**
  (J-TET2J-3). Re-assigning the 22 codex modules to stages would have made the walker's equalities
  exact today and would have DESTROYED the finding the member exists to carry: the codex slice has
  no stage structure, so a re-derived table would publish an SCC-free graph and quietly retire
  §1.2.
- **The sealed "FOUNDATIONS has no outbound edge" arm is NOT asserted as a live law here**
  (J-TET2J-4, §2.3). It is true of the sandbox and false of this tree at the file level, and the
  reason it would still have PASSED is a denominator defect.
- **No stamped version string moves.** `lawVersion: 'mf-d1-sandbox-stage-manifest-v1'`,
  `artifactKind` and `schemaVersion: 1` arrive with the sealed record's own values and are pinned as
  literals so a later member has to move them on purpose (§P1 R-MF-3, §P7.4).
  `COORDINATE_ABI_VERSION` is READ and not written; nothing is persisted, so §390.2's standing
  trigger passes forward untouched.
- **No dependency is bumped.** `acorn` is ALREADY an explicit devDependency (`^8.16.0`) at this
  base, so the sealed walker's own recorded landing hazard — *"present today only as a transitive
  dependency of vite; THE LANDING EXECUTOR OWES AN EXPLICIT devDependency, and a dependency bump is
  a MINT TRIGGER"* — **is discharged by inspection rather than by an edit** (§4 row 15).
  `package.json` and `package-lock.json` are byte-unmoved.
- `heightQ()` is untouched, no arrangement-quantum rung or tuning constant is chosen, the y-axis
  flip is not applied, no `spatialLedgers` row or engine-gated flag is minted, and no live seed byte
  moves — there is nothing downstream of this member to shift (§3).

### §1.4 ⛔⛔ THE ONE DEFERRED ROW, AND WHY IT IS DEFERRED RATHER THAN TAKEN

`tests/lint/sovereigntyLightingContract.walker.test.js` — the shared census walker — **is edited by
this member and is NOT named in its `changeManifest`.** That is the `CR-HB2B-SPLITP` staged
promotion (preamble §P7.11), not an omission, and the refusal was **executed** rather than assumed:

```
[implementation-packets] duplicate change path across packets:
  tests/lint/sovereigntyLightingContract.walker.test.js (MF-T2H, MF-T2J)
```

MF-T2H is **READY** at this base and holds that path; §P7.11 makes DRAFT reserve exactly as READY
does, so demotion is no escape, and a validator edit is forbidden in terms. MF-T2G states the
family's own rule: *"this packet is not promoted while any other D3a member is non-terminal on a
shared path."* The code edit is made and proved here (§6); **only its manifest ROW waits for the
path to free.** The row the landing act must insert, verbatim, once MF-T2H is terminal:

```json
{
  "_note": "THE CENSUS RE-RECORD, all five figures re-derived together with the cause stated: TWO NEW TEST FILES and nothing else. 2499/364/2135/20725/5787 -> 2501/364/2137/20731/5789. The walk was SEQUENCED and each figure was read from its own arm's failure message; attribution is BY ISOLATION, with both files hidden convicting the base tuple exactly. parked holds at 364 because both files spell every title as a literal. censusAuthorization: ODQ 276, ODQ 304.4.",
  "action": "TEST",
  "path": "tests/lint/sovereigntyLightingContract.walker.test.js"
}
```

### §1.5 The registration template, at full strength (§P4, ODQ §35.3)

This member mints rows in two registration files. All four names for each, explicitly and by path:

| the four | the mutation-coverage register | the census register |
|---|---|---|
| **THE ROW** | `invariants["tests/lint/townMapStageManifest.walker.test.js"] = {kind:"mutation", label:"town-map/stage-manifest foundation wired into a stage"}` plus the `MUTATED_FILES` entry `src/domain/townMap/fabric/fabricRng.js` and numbered sweep entry **28c** | the five-figure census tuple, re-recorded whole with its cause (§6) |
| **THE HEAD RE-EXPORT** | **NONE, AND THAT IS THE ANSWER** — a manifest row has no composing head; the sweep script IS the head and it names the label directly | **NONE, AND THAT IS THE ANSWER** (J-TET2J-2): `fabric/index.js` is not opened; `solidLegality.js` carries zero barrel rows and is the precedent |
| **THE EXACT-LIST / EXACT-COUNT PIN** | `mutationCoverageManifest.test.js`'s label join AND its `MUTATED_FILES` dirty-guard totality, both directions | the census arm's five equalities plus its `parked + credited === files` arithmetic pin, exact in BOTH directions |
| **THE REGISTRY TEST PATH** | `tests/lint/mutationCoverageManifest.test.js` | `tests/lint/sovereigntyLightingContract.walker.test.js` |

The other registers §P4 lists are addressed in §4: the anchor walker (row 12), the single-declaration
law (row 6), the entry-closure fence (§10), the coupling/layer census (row 11, NOT FIRED), the size
ratchet and hot-file law (row 10, both zero).

## §2 · THE THREE PORT DECISIONS, EACH EXECUTED

### §2.1 Sealed equivalence — PROVED, and it is total

The port is byte-equivalent to the sealed source in every value and every function result. Executed
by importing both modules side by side and comparing: **10 exported values** (`STAGE_IDS`,
`NON_STAGE_NODES`, `FOUNDATION_NODE`, `UNBUILT_STAGES`, `PUBLIC_ORDER_INVERSIONS`,
`GENERATION_NODES`, `NODE_EDGES`, `MANIFEST_ABSENT_FIELDS`, `GENERATION_MANIFEST`,
`STAGE_GRAPH_SCC`), **5 nullary functions**, `topologicalNodeIds` in **both** modes, all **25**
`stageOrderIndex` rows and all **56** `nodeOfModule` rows — **TOTAL DIFFERENCES: 0**.

⭐ `GENERATION_MANIFEST` comparing SAME is itself a cross-check: its `coordinateAbiVersion` is read
from this tree's live `coordinateAbi.js`, so the comparison only holds because `COORDINATE_ABI_VERSION`
is **1** here, which is what MF-T2H's §390.2 answer said it would be.

**TWO DIVERGENCES, BOTH DECLARED, NEITHER BEHAVIOURAL:**

1. **The header prose is rewritten** — necessarily, because the sealed header says *"THE ONE DECLARED
   DATUM IS THE ASSIGNMENT… everything else is DERIVED FROM SOURCE"*, and in this tree that sentence
   is false. Carrying it verbatim would ship a docstring that lies about its own file. The rewrite
   states what the artifact is here (§1.1), corrects the FOUNDATIONS claim (§2.3), and re-spells the
   purity line: the sealed one names two of the six nondeterminism-scan tokens, and the scan is over
   raw text, so the sealed spelling would convict itself. Behaviour is untouched; only prose moved.
   This is the same class MF-T2H recorded as its RAISED-2.
2. **`.map(Object.freeze)` becomes `.map((node) => Object.freeze(node))`** — the bare reference is
   handed `(value, index, array)` and erases the element type to `Readonly<unknown>` under
   `tsconfig.domain-strict.json`. The two extra arguments were always ignored, so behaviour is
   identical, and the equivalence proof above was re-run AFTER this edit rather than carried.

### §2.2 The 12-arm walker — RE-AIMED, arm by arm, with the disposition of each recorded

The sealed walker's twelve arms do not survive a verbatim port. Each was dispositioned:

| sealed arm | disposition here |
|---|---|
| 1 · every module assigned exactly once | **RE-AIMED.** `manifestModules() === readdir` is impossible at 5-of-54. Replaced by the ACCOUNTING arm: every landed `.js` is assigned OR on the frozen `CODEX_SLICE_MODULES` roster, exact both ways. The double-claim scan and the `nodeOfModule(unknown) === null` non-vacuity port intact |
| 2 · `allowedImports` equals the real import set | **RE-AIMED to a refusal plus an exact pin.** Equality over a 5-of-54 tranche is unmeetable; the arm refuses any derived import the record does not list, and pins `FOUNDATIONS` — whose every landed module is present — at the literal `['fabricRng.js']` |
| 3 · `randomNamespaces` equals what the modules mint | **SAME SHAPE**, and it lands EXACT: the landed FOUNDATIONS modules mint exactly `['f0:*','f1:*','f2:*','f3:*']`, which is the declared list. A real equivalence result, not a bound |
| 4 · `statefulForkSites` equals the real `fabricRng(` count | **RE-AIMED to `<=` plus an exact 0 for FOUNDATIONS.** The whole-fabric `toBe(17)` is unmeetable at 5-of-54 and is carried as published data instead |
| 5 · `NODE_EDGES` equals the derived edge set | **RE-AIMED to a refusal plus an exact pin**: no derived edge outside the record, and the derived set is exactly `['S0>FOUNDATIONS']` today |
| 6 · backward edges are exactly the inversions | **PORTS INTACT** (pure data) — and the importer text scan is REPLACED by a stronger join: each inversion's declared importer must really belong to the CONSUMER stage and its imported module to the PRODUCER stage. `relief.js` and `districtPartition.js` are not in this tree, so the sealed `read(inv.importer)` would have thrown |
| 7 · the SCC roster and the DAG after cutting | **PORTS INTACT AND IS STRENGTHENED** — §1.2's minimality result is new |
| 8 · `UNBUILT_STAGES` own no module; no silent stage | **PORTS INTACT** (pure data), including the live `coordinateAbiVersion` join |
| 9 · §293.3c stream audit, source half | **PORTS INTACT over the landed sources.** `fabricRng.js` is landed, so both mechanisms — every fork taking the settlement seed, and the home holding no module-level mutable state — are live here |
| 10 · foundations have no outbound edge | **SPLIT.** The record half ports intact; the live half is REPLACED by the frozen reader roster (§2.3) |
| 11 · the counterfactual plants | **PORTS INTACT**, re-aimed at landed hosts: an unclaimed arrival, a foundation wired into a stage, an unregistered key spelling, and a fork site inside a node the record says has none |
| 12 · the collision roster | **PORTS INTACT** (pure data): the eight spellings and `*\|w → S10,S15,S22` |

### §2.3 ⛔⛔ THE ARM THAT WOULD HAVE PASSED FOR THE WRONG REASON — the member's sharpest port finding

Sealed arm 10 asserts `derive(realSources()).edges` contains no `FOUNDATIONS>` edge, and in this tree
that assertion **passes**. It passes because the derivation skips unassigned files wholesale
(`if (!node) continue`), and four of the seven live readers of `coordinateAbi.js` are codex-slice
modules the record does not assign. Measured:

```
FOUNDATION module coordinateAbi.js live readers: 7
  ["dcelEmbedding.js","foundation.js","index.js","massPart.js",
   "solidLegality.js","spatialReceipt.js","stageManifest.js"]
FOUNDATION module solidLegality.js  live readers: 0
FOUNDATION module spatialReceipt.js live readers: 0
FOUNDATION module stageManifest.js  live readers: 0
```

**This is §P2.13 exactly: an absence measured against a denominator that does not contain the surface
proves nothing about it.** It is NOT a §P7.2 dormancy breach — the readers are inside
`src/domain/townMap/fabric/**` and every one of them is pre-existing and landed — and it is NOT a
defect in the record, which is true of the tree it measured. It is a defect in the ARM.

The cure is to name the denominator and freeze what it actually contains: the walker reads the
**whole** directory, not the assigned subset, and pins each landed foundation module's real reader
roster exact in both directions. A new reader is then a deliberate act. The sealed emptiness claim
survives only where it is honest — as a property of the published edge set, checked by
`foundationOutboundEdges()` in the artifact file.

## §3 · BLAST RADIUS AND DORMANCY EVIDENCE, EXECUTED

Preamble §P2.1 makes dormancy *provable*; it does not make it *proved*. Executed by a tree-wide
`grep -rn 'stageManifest'` excluding `node_modules`, `.git` and `dist`:

| site | kind | verdict |
|---|---|---|
| `src/domain/townMap/fabric/stageManifest.js` | the declaration | the deliverable |
| `tests/lint/townMapStageManifest.walker.test.js` | the source-derived walker | the deliverable |
| `tests/domain/townMapStageManifest.test.js` | the artifact acceptance file | the deliverable |
| `scripts/mutation-sweep.sh` | the 28c plant text | the E-A row, inert until the sweep runs |
| `scripts/mutation-coverage-manifest.json` | the invariants row | a register, not code |
| `docs/implementation/**` | packet prose and the index | records, not code |

**ZERO landed production consumers. ZERO barrel rows. ZERO persistence seams.** The single import
edge is OUTBOUND — `stageManifest.js` reads `COORDINATE_ABI_VERSION` from `coordinateAbi.js` — so the
leaf is a sink in the module graph and nothing can reach it. The fabric has no input producer, so a
settlement cannot reach this code; the structural fact and the executed grep agree. **There is no
declared shift in this member**, because there is nothing downstream of it to shift.

**IMPORT CLOSURE, MEASURED BEFORE THE LEAF WAS PRICED (§P2.3).** The closure is
`coordinateAbi.js` (95 eff, landed) and, transitively, `exactGeometry.js` — both already in the
directory, both already in the codex slice's own closure. No 681-effective-line module is dragged
in and §P2.3's barrel-hop hazard does not fire.

## §4 · PREFLIGHT, EXECUTED AT `05e7f9d5`

| # | row | result |
|---|---|---|
| 1 | `git rev-parse` at lane start | base `05e7f9d5…`, prior holding `7d6bde7c…`, branch tip `19b799ce…`, sealed ref `ee0db96d…` |
| 2 | sealed source SHA-256 × 2 | re-hashed before any edit; both recorded in the provenance table |
| 3 | MF-T2H's `fabricRng.js` present and unmodified at this base | **YES** — `4094ecb8…`, matching MF-T2H's own published deliverable hash |
| 4 | sealed equivalence | **TOTAL DIFFERENCES: 0** across 10 values, 5 nullary functions, both `topologicalNodeIds` modes, 25 `stageOrderIndex` rows and 56 `nodeOfModule` rows (§2.1) |
| 5 | the landed fabric population | **27** `.js` files after this member — **5** assigned by the record, **22** on the codex roster, **49** record modules not landed |
| 6 | export-name collisions across `src/domain/townMap/fabric/**` | **0** — 18 new exported names; single-declaration walker **5/5 green** with the leaf present |
| 7 | effective lines, eslint's own `Linter` (`skipBlankLines`, `skipComments`) | `stageManifest.js` **219** (sealed 214; +5 is the strict-typing narrowing of §2.1). **Production total 219** against the 400 cap, under the 250-per-leaf cap. The instrument was validated first by reproducing MF-T2H's published `spatialReceipt.js` **137** and `fabricRng.js` **77** exactly |
| 8 | `typecheck:domain:strict` (`tsconfig.domain-strict.json`) | **1134 errors, ceiling 1134 — exactly at floor**, TRUE_EXIT 0. The leaf is strict-clean; the ONE strict error it arrived with is cured in §2.1 |
| 9 | `any`/bare-`*` type tokens on the leaf | **0.** The two textual `any` occurrences are English prose in comments. `domainAnyCastBaseline.test.js` **13 passed**, TRUE_EXIT 0 — the estate's monotone-down allowance is untouched |
| 10 | `src/domain/**` 800-effective ceiling; hot-file list; `scripts/.size-baseline.json` | not approached; no `townMap` path on either (§P4's four zeros hold — the leaf lands INSIDE `src/domain/townMap/**`) |
| 11 | coupling/layer census | **NOT FIRED** — scope excludes `townMap` (§P4) |
| 12 | anchor walker, focused | **9/9 green**, TRUE_EXIT 0. The two new files carry ONE scanned negative between them and it is anchored on the line above |
| 13 | raw C0 control bytes on all four authored/edited files | **0, 0, 0, 0**; `controlBytes.test.js` green in the focused battery |
| 14 | `entropyRootCensus` regex over the new leaf | **0 hits** — no hash-helper DEFINITION arrives, so that census does not move; the walker is re-proved green in the battery |
| 15 | `package.json` / `package-lock.json` motion | **none.** `acorn ^8.16.0` is already an explicit devDependency, so no bump and no schema-mint trigger (§1.3) |
| 16 | `PACKET_MANIFEST.json` reservations on all four paths | three CREATE paths carry **zero** reservations at any status; the fourth is the deferred shared row (§1.4) |
| 17 | census tuple, before and after | `2499/364/2135/20725/5787` → `2501/364/2137/20731/5789` (§6) |
| 18 | `mutation-coverage-manifest.json` diff statistics | **5 insertions, 0 deletions** — a pure surgical insert beside its sibling row. `uncoveredBaseline` untouched at 198 rows. `mutationCoverageManifest.test.js` **8 passed**, TRUE_EXIT 0 |
| 19 | scoped `eslint` on the leaf and both new test files | **clean**, TRUE_EXIT 0 |
| 20 | `typecheck:ratchet` (`tsconfig.full.json`) | reported by name and window at the terminal, beside row 8 (§11) |

## §5 · ACCEPTANCE CASES

Six cases in two files — one literal `describe` each, straight-line `test` calls, string-literal
titles, every loop INSIDE a named test (the SP-D idiom, §P5).

| id | case |
|---|---|
| **L1** | GUARD-THE-GUARD, in the walker. The record is populated (23 nodes, 54 modules, 88 edges) and the directory is live (≥ 27 files) — and then the DERIVATION ITSELF is shown working on a two-file synthetic map before it is trusted: one assigned module importing another across a node boundary must yield the import, the edge, both key spellings and the fork site. A derivation that returned empty for everything would satisfy every refusal in L3 forever. |
| **L2** | THE ACCOUNTING, EXACT IN BOTH DIRECTIONS, PLUS THE NAMED DENOMINATOR. Every landed `.js` is assigned by the record or on the frozen codex roster; no module is claimed twice; an unknown name resolves to no node; the record's 49-module lead is published rather than felt. Then §2.3's roster: each landed foundation module's REAL readers, read from the whole directory, frozen exact — with `coordinateAbi.js`'s seven asserted, so the roster cannot rot into an empty scan. |
| **L3** | THE AGREEMENT, PLUS §293.3c, PLUS FOUR PLANTS. No node imports, mints or forks beyond what the record allows and no derived edge sits outside it; FOUNDATIONS — the one fully landed node — is pinned EXACT on all four of imports, spellings, forks and edges. Then the stream audit: every live `fabricRng(` fork takes the settlement seed, the home holds no module-level mutable state, and no artifact publishes a live handle. Then the plants: an unclaimed arrival, a foundation wired into a stage (the §10.15(4) defect, which is also this member's sweep plant), an unregistered key spelling, and a fork site in a node the record says has none. |
| **D1** | GUARD-THE-GUARD, in the artifact file. The manifest is frozen, its vocabularies are mutually closed, and the three stamped strings are pinned as literals so §P7.4 motion must be deliberate. `coordinateAbiVersion` is joined to this tree's live `COORDINATE_ABI_VERSION`. ABSENT-NOT-STUBBED is DRIVEN rather than asserted — the eleven named fields are absent from the artifact, and the same filter is shown convicting on a doctored key list. Purity closes it, with the planted positive control asserted BEFORE the absence. |
| **D2** | ⛔⛔ THE SCC. Tarjan is guarded first on a two-cycle and a DAG, then the component is pinned: exactly one, membership as a literal, the record agreeing, `closedBy` as a literal, the RAW graph having no topological order at all, and cutting exactly the two inversions leaving a DAG. Then §1.2's minimality: each single cut's residue is pinned by name, and each is shown to differ from the published roster — so a "cleanup" that drops one inversion reds against a measured component rather than against a count. |
| **D3** | THE PROJECTIONS. Each inversion joins the node table by stage rather than by a text scan (the sealed spelling would have thrown here); the derived order is checked to respect EVERY acyclic edge, not merely to have the right length and be unique; the foundation closure is empty and its projection is shown able to speak; the unbuilt roster owns no node and no stage is silently empty; the eight namespace collisions are enumerated. Two equivalence conditions found by mutant are pinned here rather than left as luck (§7). |

## §6 · THE CENSUS WALK, SEQUENCED

⚠ **THE INTERIOR RED WAS NAMED BEFORE IT EXISTED** (§P7.12): a member that adds a test file forces
one by construction, because the census arm is an exact equality.

| step | arm that red | reading |
|---|---|---|
| 1 | `the estate's file count moved` | expected **2501** to be 2499 |
| 2 | `the credited-file count moved` | expected **2137** to be 2135 — `parked` PASSED at 364 without ever redding |
| 3 | `the live TEST-title count moved` | expected **20731** to be 20725 |
| 4 | `the live SUITE-title count moved` | expected **5789** to be 5787 |
| 5 | — | **GREEN** at `2501 / 364 / 2137 / 20731 / 5789` (33/33), TRUE_EXIT 0 |

**Attributed by ISOLATION, not by arithmetic.** With the walker pinned at the after tuple, hiding
`townMapStageManifest.walker.test.js` alone convicted `files` at 2500; hiding
`townMapStageManifest.test.js` alone convicted 2500; hiding **both** convicted **2499** — the base
tuple exactly, which is also the proof that nothing else in the tree moved this census under the
lane. Per-file shape, cross-checked against the diff: 3 and 3 literal `test` titles, 1 and 1
`describe`.

⭐ **PARKED STAYING AT 364 WAS EARNED, NOT LUCK.** Both files spell every title as a literal, so
door 3's reader recognises all six statically and credits both files; a `.each` or a `runIf` would
have parked a whole file and kept the arithmetic closing while `credited` silently did not move.

⚠ **AND THE GREEN WAS RE-EARNED AFTER THE COMMENT BLOCK LANDED.** The re-record's own cause
paragraph is added to a file the census counts, so the walker was re-run after it — 33/33, TRUE_EXIT
0 — rather than the earlier green being carried across an edit.

## §7 · MUTANTS — SEVEN CONVICTED, AND TWO EQUIVALENT MUTANTS FOUND AND DISCLOSED

Every mutant deletes or weakens ONE BRANCH, never a literal (§P2.11). Planted with an exact
single-anchor substitution that refuses to fire on 0 or 2 matches, restored by byte copy under a trap
on EXIT INT TERM HUP, and each restore proved by digest rather than by eye.

⛔ **THE CLEAN-TREE CONTROL RAN FIRST AND READ EXIT 0 (6 passed).** An all-red sweep with no
clean-green control is a broken runner, not a battery of convictions — the lesson TE-T2B banked.

| # | branch deleted or weakened | convicted by |
|---|---|---|
| M1 | `acyclicEdges()` stops cutting the declared inversions | D2 + D3, exit 1 |
| M2 | the `FOUNDATION_NODE` branch of `stageOrderIndex` deleted | D2 + D3, exit 1 |
| M3 | `backwardEdges()`'s direction test flipped `>` → `<` | D2 + D3, exit 1 — `expected [ 'S13>S6', 'S6>S2' ] to deeply equal [ 'PRIMITIVES>ASSEMBLY', …(85) ]` |
| M4 | `topologicalNodeIds`' cycle branch deleted — it returns an order for a cyclic graph | D2 alone, exit 1 |
| M5 | `namespaceCollisions()` drops the first owner from the clash list | D3 alone, exit 1 — `expected [ 'S15', 'S22' ] to deeply equal [ 'S10', 'S15', 'S22' ]` |
| M6 | `nodeOfModule`'s assignment lookup deleted — every module resolves to no node | L1 + L2 + L3, exit 1 |
| M7 | the walker's cross-node test weakened `to && to !== node` → `to` | L3 alone, exit 1 |

⭐ **M4, M5 AND M7 ARE THE SINGLE-ARM CONVICTIONS** and they are what makes the battery attributable
rather than blanket: each reds exactly one named test while the other two stay green, so no
conviction is another guard covering for the deleted one (§P6's subsumption rule).

⛔⛔ **TWO MUTANTS SURVIVED ON THE FIRST PASS, AND BOTH TURNED OUT TO BE EQUIVALENT MUTANTS. THE
DISCOVERY IS THE VALUABLE PART AND IT IS BANKED AS PINS RATHER THAN AS PROSE.**

1. **`backwardEdges()`'s `>` weakened to `>=` changed nothing.** Diagnosed rather than patched:
   `stageOrderIndex` is injective over the 23 node ids and `NODE_EDGES` carries no self-edge, so the
   two spellings cannot disagree over this record. Both conditions are now PINNED in D3, so the
   equivalence is a stated property rather than an accident — if a self-edge ever arrives the
   spellings part company and that arm is where it shows. M3 was re-planted as the direction flip
   above, which convicts.
2. **`namespaceCollisions()`'s `held !== n.nodeId` half deleted changed nothing.** The same-node arm
   is UNREACHABLE over this record because no node repeats a spelling inside its own list — the
   §P2.10 unreachable-arm class, found by execution. That condition is now pinned in D3 too, and M5
   was re-planted as the dropped-first-owner mutant above, which convicts on exactly one arm.

**RESTORE PROVED BY DIGEST, NOT BY EYE.** `stageManifest.js` read
`ad639c8e525f0db469660767fb5904825bf8d33a7b259f33de1f5d2c1c2286b2` before and after every plant, and
`cmp` was identical on all three files at the end of the battery.

**THE SWEEP PLANT (entry 28c) WAS EXECUTED BY HAND**, because a build lane may not run
`scripts/mutation-sweep.sh` on this tree — its revert is the `git checkout --` family this
program's shared-tree protocol forbids outright, and that deferral is real and recorded (§P3b). Host
`src/domain/townMap/fabric/fabricRng.js`, pre-plant digest `4094ecb8…`, planted digest `5fcbd82d…`,
the plant PARSES (acorn, `ecmaVersion 2024`, `sourceType module`). Planted walker run:
**2 failed | 1 passed**, TRUE_EXIT **1**, and the two failing arms name the defect exactly —
`a landed FOUNDATIONS module gained or lost a reader in this tree` and
`S0 imports something the record does not list: expected [ 'stageManifest.js' ] to deeply equal []`.
The guard-the-guard arm stayed GREEN, so the conviction is attributable rather than blanket.
Restored by byte copy, `cmp` identical, digest back to `4094ecb8…`, `git diff` over the fabric
directory empty, and the walker green again at **3 passed**.

## §8 · JUDGMENTS

- **J-TET2J-1** — the shared census-walker row is DEFERRED from the `changeManifest` to the landing
  slot's staged promotion (§1.4). Chosen over two alternatives, both refused: flipping MF-T2H's
  packet row to LANDED in this worktree would be a lane asserting ANOTHER member's completion, which
  §299.5 struck in terms; and editing the validator is forbidden by `PACKET_STANDARD` in as many
  words. The code edit is made and proved here; only the row waits. The row's exact text is written
  into §1.4 so the landing act inserts it rather than re-deriving it.
- **J-TET2J-2** — no barrel re-export row. Chosen over adding one because the member wires no
  consumer and a row would put a dormant leaf in the barrel's closure for no reader; the landed
  `solidLegality.js` and MF-T2H's two leaves are the precedent.
- **J-TET2J-3** — the record is ported as PUBLISHED DATA and is NOT re-derived for this tree
  (§1.1). Chosen over re-assigning the 22 codex modules to stages, which would have made the
  walker's equalities exact today and would have destroyed the finding: the codex slice has no stage
  structure, so a re-derived table publishes an SCC-free graph and quietly retires §1.2 — the one
  thing the charter says must not be dropped.
- **J-TET2J-4** — the sealed "FOUNDATIONS has no outbound edge" arm is NOT carried as a live law;
  the frozen reader roster replaces it (§2.3). Chosen over carrying it because it PASSES here for the
  wrong reason, and a green that rests on a denominator missing the surface is worse than no arm at
  all. The record half is still checked, where it is honest.
- **J-TET2J-5** — the walker's per-node arms are REFUSALS (nothing beyond the record) rather than
  EQUALITIES, except on `FOUNDATIONS` where they are exact. Chosen over holding out for equality
  because equality is unmeetable until all 54 modules land, and an arm that cannot pass until the
  wave after next is an arm nobody runs.
- **J-TET2J-6** — the Tarjan implementation lives in the TEST, not in the module. Chosen so the
  component the manifest publishes is compared against a component the test computes; importing a
  shared implementation would have the record confirming its own field.
- **J-TET2J-7** — `CODEX_SLICE_MODULES` is frozen in the WALKER rather than exported from the leaf.
  Chosen so the ported module's exported surface stays byte-equivalent to the sealed source, which is
  what makes §2.1's equivalence proof re-checkable at every later port member; the codex roster is
  this tree's fact and belongs with the instrument that measures it.
- **J-TET2J-8** — the two surviving mutants are diagnosed as EQUIVALENT and banked as pins, rather
  than being reported as coverage gaps or silently re-planted (§7). Chosen because the honest finding
  is about the ported code — one comparison is unobservable and one guard arm is unreachable — and a
  pin on the condition that makes each equivalent is the only thing that will notice when it stops
  being true.

## §9 · RAISED

1. **RAISED-1 — the sealed walker's arm 10 is a denominator defect wherever it is ported, not only
   here.** Its `derive()` skips unassigned files, so the "no outbound edge" claim is only as wide as
   the assignment. Any later member that ports it into a tree with unassigned neighbours inherits the
   same wrong-reason green. This member cures it locally (§2.3); the SEALED TIP still carries the
   original, and R-MF-4 forbids editing it.
2. **RAISED-2 — the record's whole-fabric figures are unmeetable until the port completes, and two
   of them are now published data with no live check.** `statefulForkSites` totalling 17 and
   `manifestModules()` equalling `readdir` are true of the sandbox and cannot be asserted here. They
   become checkable the moment the last sandbox module lands, and the member that lands it should
   restore both as exact equalities. Recorded so it is found rather than rediscovered.
3. **RAISED-3 — `namespaceCollisions()`'s same-node arm is dead code over the published record**
   (§7). It is pinned as equivalent rather than deleted, because deleting a guard in a ported module
   is a divergence with no benefit; but a later member that re-derives the record for this tree
   should decide whether the arm has a purpose.

## §10 · THE ENTRY-CLOSURE FENCE, AND WHY THE STATIC WALK IS NOT THE DISCHARGE

§P2.2 as amended by ODQ §324.5 is explicit: `tests/build/townMapLazy.test.js` is
`describe.runIf(distExists)` with a second `it.skipIf(!process.env.VERIFY_DIST)` arm, so on a fresh
worktree it reports **exit 0 over ZERO executed tests** — the estate's "a green that never ran"
shape. **A PRE-BUILD SKIP IS NOT A DISCHARGE.** The fence is therefore run after building `dist/`,
under `VERIFY_DIST=1`, with the EXECUTED counts reported (§11).

⭐ **AND THE FORENSIC ZOOM HAS THE SAME UNUSUAL EXPECTED ANSWER MF-T2H STATED IN ADVANCE.** This
member wires **no importer at all**, so the honest expectation is stronger than the usual one: a
string literal unique to the new leaf should appear in **no chunk whatsoever**, having never entered
the module graph. A literal found in ANY chunk would mean something reached it, and that is §P7.2's
dormancy-boundary STOP. Every probe is verified UNIQUE to this member's leaf across the whole of
`src/` before it is used, and positive controls owned by LANDED fabric modules prove the denominator
contains the fabric surface (§P2.13).

## §11 · THE PRE-TERMINAL RECORD, AND WHAT THE TERMINAL STILL OWES

### §11.1 · The post-build fence and the forensic zoom — EXECUTED (§P2.2, ODQ §324.5)

`npm run build` green (17.37s; postbuild wrote 314 static route documents). Then the fence, under the
environment variable that un-skips its second arm:
`VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js` → **3 passed (3), TRUE_EXIT 0** —
EXECUTED counts, not a pre-build skip.

The forensic zoom over **710 dist chunks**, with every probe first verified UNIQUE to this member's
leaf across the whole of `src/` (the withdrawn-probe lesson MF-T2H banked):
`mf-d1-sandbox-stage-manifest-v1`, `GENERATION_MANIFEST`, `S13>S6`, `customParityFixtureRegistryRef`,
`executableVocabularyRef`, `invalidationRoots`, `PUBLIC_ORDER_INVERSIONS`, `STAGE_GRAPH_SCC` —
**0 chunks each**. Three positive controls owned by LANDED fabric modules — `plan-q1-0-1000-v1`,
`CANONICAL_SPATIAL_OPERATION`, `ORTHOGONAL_CROSS_PLAN` — **1 chunk each**, so the denominator
demonstrably contains the fabric surface and the absence is not vacuous (§P2.13). **The leaf never
entered the module graph at all**, which is the strongest form the dormancy result can take, and it
is the expected answer for a member that wires no importer.

### §11.2 · The pre-gate sweep (§408) — EXECUTED, and every red is BANKED

`npx vitest run tests/lint tests/build tests/ops`, TRUE_EXIT **1**:
`3 failed | 188 passed (191)` files, `5 failed | 2164 passed | 63 skipped (2232)` tests.

**All five reds were classified against `scripts/.test-ratchet-baseline.json` by an executed
title-prefix join, not by eye — STRAYS: 0** against the frozen roster of eleven measured at
`4deb4f026644cba500b0efc1e051fdea2ff96041`:

| red | disposition |
|---|---|
| `clampPrimitiveBaseline.test.js` · baseline exactly matches the files that still define a local clamp | BANKED |
| `warCostKindPools.walker.test.js` · `'war_trajectory_winning'` retains the five receipt-annex families | BANKED |
| `warCostKindPools.walker.test.js` · `'war_trajectory_losing'` … | BANKED |
| `warCostKindPools.walker.test.js` · `'trajectory_misread'` … | BANKED |
| `warRulingKindPools.walker.test.js` · `'succession_demand_inherited'` … | BANKED |

⚠ **AND A SIXTH BANKED RED SITS OUTSIDE THAT SWEEP'S SCOPE, LOOKED UP RATHER THAN ASSUMED.**
`tests/docs` reads `1 failed | 236 passed (237)`, and the failure is
`enforcement-claims.test.js :: every completeness claim carries an @enforced-by tag`, also one of the
frozen eleven. Its six naked claims sit in `docs/FABLE_VALIDATION_QUEUE.md`,
`docs/GOLDEN_SHIFT_LEDGER.md` and `docs/implementation/packets/foreign-policy/IN-0C.md` — **none of
which this member touches** — and the exact `CLAIM_RE` run over this packet returns **0 hits**, so
no new per-claim debt arrives with it.

### §11.3 · What the terminal still owes

*Filled at the GO, from the gate's own tail: one full bare `npm run check:tail` from a fresh shell,
never wrapped in `gate-mutex.sh --run` (which self-deadlocks and reports exit 3), with
`; echo TRUE_EXIT=$?` read in-shell and the gate's own `[gate-tail] exit:` line quoted beside it.
Both typecheck configurations are reported by name and window (§P5) — `typecheck:ratchet`
(`tsconfig.full.json`) and `typecheck:domain:strict` (`tsconfig.domain-strict.json`), the latter
already measured at 1134 of ceiling 1134 in §4 row 8 — and the steps that actually RAN are listed,
because `npm run check` is a 17-step `&&` chain that blacks out everything behind a red.*
