# Town cartography / MF-T2Bf — the four field separators restored to `canonicalBytes`, and the determinism pin that froze their absence re-recorded with its cause

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `0afddfe971ea682573ac7045ee27eb25a2045a55`
  — read with `git rev-parse` at the slot's opening and never extended from a quoted prefix
  (§381's fabricated-SHA law), and never taken from the dispatch text that also named it.
  ⚠ **THIS MEMBER WAS BUILT AND FULLY GATED AT `9bfae712` AND REBASED INTO THIS SLOT.** Eight
  commits landed above that base — the OSR schema-10 mint (`12b3aa53`, `eb6124a6`), RR-1
  (`2f41eb0f`, `dc68128a`, `19b799ce`) and RR-2 (`4f42be70`, `d6179840`, `0afddfe9`). The
  overlap was measured file by file rather than assumed: **neither code host moved** (§ carry-proof
  below), and exactly the two shared meta paths collide. Those two were **taken byte-for-byte from
  this new base and this lane's appends re-run on top**, never merged — and every incumbent row was
  then proved present (§4 rows 11-12). Every base-dependent figure below was **re-derived here**;
  nothing is carried, and nothing is inherited from §372's measurement, which read the identical
  blob at `5d18b4a0`.
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Depends on:** `MF-T2B` — LANDED and terminal. This member repairs one function MF-T2B
  ported, and touches nothing else it landed.
- **Binds forward:** `MF-T2H`. The sealed `spatialReceipt.js` calls `canonicalBytes` TWICE —
  `canonicalSpatial` at sealed `:123` and `sealSpatialEffect` at sealed `:180` — and both feed
  it COMPOSITE field values: a `\n`-joined body of field texts, and a dependency list built as
  ``dependencies.map((d) => `${d.role}=${d.contentHash}`)`` beside a `|`-delimited body carrying
  `sourceIds.join(',')`, `affectedIds.join(',')` and `JSON.stringify(payload)`. Ported onto the
  separator-less encoding those preimages would not reproduce sealed digests, with the cause four
  modules away from the symptom. That is why this member exists and why it precedes MF-T2H in the
  port train (ODQ §372, §387). ⚠ The receipt layer is ALSO the first real consumer of §2.4's
  uncured deps-join gap — see RAISED-2, which MF-T2H must price rather than inherit.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file
  at this base by this lane, identical to the value MF-T2B and MF-T2G carry, so no re-stamp
  occurred in the window. Its §P1 refutations, §P2 hazard dispositions, §P3 anchor preflight,
  §P5 census law, §P6 mutant hygiene, §P7 STOP set and §P8 capsule law bind this packet and are
  not restated.
- **Collision group:** `d3a-port`. At this base **every one of the 145 registered packets is
  terminal** (144 LANDED, 1 SUPERSEDED — RR-1 and RR-2 joined the roster in this window),
  re-counted by execution against `PACKET_MANIFEST.json` at the slot base — so no other
  member reserves either edit host and no split promotion is owed. `coordinateAbi.js` carries
  change-manifest rows from FOUR packets (MF-T2B, MF-T2C, MF-T2E, MF-T2F) and the determinism
  companion from TWO (MF-T2B, MF-T2C); every one of the six rows sits in a LANDED packet, and a
  terminal status reserves no change path.
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the
  branch. This lane moved no ref.

> **`censusAuthorization`:** this packet moves the test census by **NOTHING** —
> `+0 files / +0 parked / +0 credited / +0 titles / +0 suiteTitles`. **Base tuple, RE-DERIVED at
> the slot base: `2497 / 364 / 2133 / 20719 / 5785`. After tuple, convicted at the rebased tree
> with the member applied: `2497 / 364 / 2133 / 20719 / 5785` (walker green, 33/33).**
> ⚠ **THE FIGURE IS IDENTICAL TO THE ONE THIS MEMBER CARRIED AT `9bfae712`, AND THAT IS A
> COINCIDENCE THIS LANE CHECKED RATHER THAN ASSUMED.** An identical tuple across a rebase is not
> the same reading: the landed stack MODIFIED six test files and added or deleted none, and moved
> no literal title or `describe`, so the five figures land on the same values for a different
> reason. What this member owns is the DELTA, and the delta is zero. The re-record and the two new arms are
> folded INSIDE the existing `A5` test as straight-line statements, so no title, suite title,
> file or parked row moves — WF-1F's shape. Its authorizing decisions are **ODQ §372** (which
> charters this member by name) and **ODQ §387** (which fills this seat), under §299.4's
> binding-forward rule. The family's stamp is **GRANTED** at ODQ §312.2b.

> ⛔ **PORT SOURCE PROVENANCE (preamble §P1 R-MF-4).** The sandbox is not a git repository. This
> lane read the sealed source from the preserve ref `refs/preserve/map-sandbox-w3f-sealed` and
> **re-hashed it before any edit**; it reproduces the SHA-256 MF-T2B's own header cites, so the
> preserve ref IS the packet-cited port source and the comparison below is against the right file.
>
> | source module | SHA-256 | cited by |
> |---|---|---|
> | `src/domain/townMap/fabric/coordinateAbi.js` @ `refs/preserve/map-sandbox-w3f-sealed` | `123f3c17ebd42da5223216f0029617706db49b3de7ab602acd6edcf72a2c8404` | MF-T2B header — **MATCH, executed** |
>
> **Edit hosts, hashed before any edit. The base column is ONE value for both bases, because
> neither host moved in the window — re-hashed at `0afddfe9` rather than carried:**
>
> | file | SHA-256 at `9bfae712` AND `0afddfe9` | SHA-256 after this member |
> |---|---|---|
> | `src/domain/townMap/fabric/coordinateAbi.js` | `424500a82068e84af87ed6cae79549c9deb9fe3d705bb40218614e93c1fd6d07` | `b33c4fe6146d935698bc851e0c0d31b44c58f1cb1a5da95ff1111ad224324907` |
> | `tests/property/townMapCoordinateAbiDeterminism.test.js` | `d69ad9bac65a472b5b83258e95bd767b9a2a78974025035e362547886b93010c` | `0d8437915180cd7b550d16ef1a8f9f5a5534c12c682600b011ad5d17de2d693f` |
>
> ⭐⭐ **CARRY-PROOF BY ABSENCE, AT CONTENT LEVEL, ACROSS BOTH HOPS.** The git blob of
> `coordinateAbi.js` is `a5453f82a577b6025785e4ca7eb3d1b746866cb4` at `5d18b4a0` (§372's
> measurement), at `9bfae712` (this member's build base) and at `0afddfe9` (this slot base) —
> ONE object across all three. The determinism companion is likewise `7f21a69c` at both
> `9bfae712` and `0afddfe9`. **Nobody touched either code host in the window**, so the finding
> did not drift under the lane, no re-reading of the §372-era text was needed, and the build's
> proofs transfer to the rebased tree at content level rather than by assertion. The packet path
> `MF-T2Bf.md` is ABSENT at the slot base, so the member collides with nothing it creates.

---

## §0 · WHAT THIS MEMBER IS, AND WHAT IT REFUSES

One repair and one declared re-record, both chartered verbatim at ODQ §372:

1. **The four U+001F field separators are restored to `canonicalBytes`.** MF-T2B's port dropped
   all four, and the artifact-digest preimage stopped being injective.
2. **The determinism pin that froze the absence is RE-RECORDED**, citing §372/§387, with the
   cause stated: injectivity restoration. A pin that froze a defect is cured with the defect.

**IT REFUSES** to touch anything else. No consumer is wired, no `artifactKind`/`schemaVersion`
stamp moves, `COORDINATE_ABI_VERSION` does NOT move (see §2.3), the deps `join(',')` is left
exactly as the sealed source spells it (§2.4), `heightQ` is untouched, no barrel row moves, and
`spatialReceipt.js` is NOT ported — that is MF-T2H's whole member.

## §1 · THE DEFECT, MEASURED — THE COLLISION WITNESS, EXECUTED BOTH WAYS

`canonicalBytes` builds the digest preimage by concatenating four tagged fields. The sealed
source separates them with U+001F (UNIT SEPARATOR); the landed port emitted the tags with no
separator at all, so the tags are the ONLY delimiters — and a tag can be spelled inside a field
value. Distinct `(artifactKind, schemaVersion, orderedDependencyRefs, bodyText)` tuples then
encode to identical bytes.

The witness (`TET2BF-collision-witness.mjs`, this lane's scratchpad) drives the LIVE module on
three engineered pairs plus a negative control, and was run against the base file and against the
cured file. ⭐ The BEFORE reading survives the rebase without re-execution because it was taken
from blob `a5453f82`, which is byte-identical at the build base and at this slot base — the same
object, not merely the same figure:

| seam crossed | tuple A | tuple B | pre-cure blob `a5453f82` | with the member |
|---|---|---|---|---|
| `deps` → `body` | `('CANONICAL_SPATIAL', 1, ['a'], ']body:b')` | `('CANONICAL_SPATIAL', 1, ['a]body:'], 'b')` | **COLLISION** | DISTINCT |
| `kind` → `schema` → `deps` | `('K', 2, null, 'schema:2deps:[]body:x')` | `('Kschema:2deps:[]body:', 2, null, 'x')` | **COLLISION** | DISTINCT |
| nested encoding: an inner result re-read as outer field text | `('CANONICAL_SPATIAL', 1, ['abi:1'], <inner receipt>)` | `('CANONICAL_SPATIAL…RECEIPT', 1, ['e'], 'payload')` | **COLLISION** | DISTINCT |
| **negative control** — plainly distinct tuples | `('A', 1, ['x'], 'y')` | `('B', 1, ['x'], 'y')` | DISTINCT | DISTINCT |

Executed summary lines, quoted verbatim:

```
BEFORE  SEPARATOR_COUNT = 0 (sealed source emits 4)
        ENGINEERED_COLLISIONS = 3 of 3
        CONTROL_DISTINCT      = true
AFTER   SEPARATOR_COUNT = 4 (sealed source emits 4)
        ENGINEERED_COLLISIONS = 0 of 3
        CONTROL_DISTINCT      = true
```

The control is the point: it reads DISTINCT in BOTH readings, so an "after" that reports zero
collisions cannot be a witness that has stopped comparing.

⛔ **THE RECORD WAS ALREADY MAKING THE CLAIM THE FUNCTION HAD STOPPED HONOURING.**
`COORDINATE_ABI.hashEncoding` is the frozen string `DOMAIN_SEPARATED_CANONICAL_BYTES`, and the
function’s own docstring opens “DOMAIN-SEPARATED CANONICAL BYTES”. The published record and the
prose both said the encoding was domain-separated while the emitted bytes carried no separator at
all — so a consumer reading the ABI record to decide whether it could trust the preimage would
have been told yes. That is the sharpest reason this is a defect rather than a style difference,
and neither the record nor the docstring line needed to change: the FUNCTION was the thing that
had drifted away from them.

⭐ **THE THIRD PAIR IS THE GENERAL FORM**, and it is stated as such rather than sharpened. It shows
that a string produced BY this encoding can be re-read as outer field text once the separators
are gone, so a nested encoding and a differently-fielded flat one become the same bytes.

⚠ **THE CITATION IS KEPT HONEST.** The sealed `spatialReceipt.js` does NOT literally nest one
call inside another call’s `bodyText`. What it does is compose both the body and the dependency
list out of JOINED sub-values — `sourceIds.join(',')`, `affectedIds.join(',')`,
`JSON.stringify(payload)` behind `|` delimiters, and a dependency list of `role=contentHash`
pairs — and a `contentHash` minted by one artifact travels into another artifact’s DEPENDENCY
list. The exposure is the same shape as the third pair; the wording is not stretched to make it
the identical one.

## §2 · THE CURE, AND THE ONE DIVERGENCE IT MUST DECLARE

### §2.1 The two lines

The return statement now emits the sealed encoding: a separator after the ABI version, after the
kind, after the schema, and after the dependency list's closing bracket. Nothing else in the
function moves — the `deps` join line is byte-identical, the signature is byte-identical.

### §2.2 ⭐⭐ THE SPELLING IS A DECLARED DIVERGENCE, AND IT IS ALSO THE DEFECT'S CAUSE

This lane's first cure wrote the separators as RAW U+001F bytes, which made the function
**byte-identical to the sealed source** (SHA-256 of the extracted function
`f28cf695c12e8a6e1daa9ceda57d0e5ee3613094c9ac1b6ee27ce9dc6ffc4e6b` on both sides). The
pre-gate sweep then red `tests/lint/controlBytes.test.js`, a LANDED ratchet whose rule is
explicit:

> no file under `src/**` or `tests/**` may contain a raw C0 control byte other than tab, LF or
> CR, nor DEL … when source code needs a control character it writes an escape spelling

and whose own predicate arm names `US (0x1F)` in the banned set by name. Its allowlist carries
one owner-parked entry and says in terms that it is not for silencing a fresh residue.

So the cure is spelled `\u001f`, and **THAT IS ALSO WHY THE DEFECT EXISTED.** The port could not
copy the sealed bytes — this ratchet forbids them — so MF-T2B had to RE-SPELL the separators,
and in re-spelling them it dropped all four. The character does not print, so nothing on screen
showed the loss, and the pin written alongside the port froze the result.

The divergence is therefore **DECLARED, SPELLING-ONLY**, and proved to be output-neutral by
execution rather than by argument:

| proof | result |
|---|---|
| sealed function source vs landed function source, as written | differ (raw byte vs escape) |
| sealed function source with its raw byte normalised to the escape spelling, vs landed | **byte-identical** |
| both function bodies EVALUATED over six tuples (empty kind, negative schema, multi-dep, unicode body, both collision tuples) | **every output identical**; output digest `b278b339c81ca3a684d7ebadd6cf30e7480489a4a42a81838d17bd298880b78a` on both sides |

⚠ **RAISED-1 for §372.2's dual-run comparator:** the ABI module's declared-divergence roster
must now carry this spelling row, or the comparator will read a cured module as a drifted one.
The row is SOURCE-TEXT ONLY; the encoding is identical.

### §2.3 `COORDINATE_ABI_VERSION` DOES NOT MOVE, AND THAT IS A RULING, NOT AN OVERSIGHT

The constant's own docstring says it moves when any field of `COORDINATE_ABI` moves, "encoding"
among them, and this member changes what the encoding emits. It is held at `1` because **no
artifact minted under the separator-less encoding exists**: §3 measures zero landed consumers,
nothing persists a `canonicalBytes` result, and `contentHash` is declared `null` in the record.
A version bump exists to make an old artifact unreadable as a new one; with no old artifact, a
bump would migrate nothing and would falsely imply a readable v1 corpus. ⚠ **The moment any
member persists a `canonicalBytes` result, the bump becomes owed** — recorded here rather than
left for a successor to rediscover.

### §2.4 THE `deps` JOIN IS LEFT ALONE, DELIBERATELY

`['a,b']` and `['a', 'b']` both join to `a,b`, so the dependency list has its own injectivity
gap — and it is present in the SEALED source too. Curing it would change the encoding away from
the sealed one, which is the opposite of this member's job, and it is not what §372 chartered.
⚠ **RAISED-2:** the deps-join gap is a real, separate finding against the sealed ABI itself. It
is NOT cured here and NOT masked by the separators.

## §3 · BLAST RADIUS, RE-VERIFIED AT THIS BASE

§372 measured zero landed consumers. Re-executed here by `grep -rn 'canonicalBytes'` over the
whole tree excluding `node_modules` and `.git`:

| site | kind | verdict |
|---|---|---|
| `src/domain/townMap/fabric/coordinateAbi.js:243` | the declaration | the edit host |
| `src/domain/townMap/fabric/index.js:3` | barrel re-export row | not a consumer; no row moves |
| `tests/property/townMapCoordinateAbiDeterminism.test.js` (4 sites) | the pin host | the edit host |
| `docs/implementation/packets/town-cartography/MF-T2B.md`, `MF-T2G.md` | packet prose | records, not code |

**ZERO landed production consumers, re-confirmed.** No generation path, no persistence seam, no
receipt, no save file and no rendered surface reads this function today, so the encoding change
moves nothing an owner or a campaign can observe. There is **no declared shift** in this member.

## §4 · PREFLIGHT, RE-EXECUTED AT THE SLOT BASE `0afddfe9`

| # | row | result |
|---|---|---|
| 1 | `git rev-parse claude/composite-r4` at the slot opening | `0afddfe971ea682573ac7045ee27eb25a2045a55` — matched the dispatch text, which was NOT trusted for it |
| 2 | sealed source SHA-256 vs MF-T2B's cited value | MATCH (§ provenance table) |
| 3 | `coordinateAbi.js` blob at `5d18b4a0`, `9bfae712` and `0afddfe9` | ONE identical object `a5453f82` — carry-proof across both hops; the determinism companion likewise `7f21a69c` across the rebase |
| 4 | consumer census | zero production consumers (§3) |
| 5 | anchors in `coordinateAbi.js` | **none** — grep for `anchored`/plant markers returns nothing; the MF-T2A plant anchor lives in `dcelEmbedding.js`, which this member does not open |
| 6 | `CURRENT_MAP_TRADITION_ID` obligation | not applicable — the symbol is declared in `foundation.js` and read by **7** other `src` files, all in the fabric (`boundaryArrangement`, `dcel`, `fabricRoot`, `index`, `parcelRegistry`, `streetGeometry`, `streetGraph`), counted by `grep -rl` rather than estimated. This member opens none of them, and it declares no new fabric symbol, so `tests/lint/townMapFabricSingleDeclaration.walker.test.js` is untouched (green in the sweep) |
| 7 | packet reservations on both edit hosts | all reserving packets terminal (§ header) |
| 8 | `coordinateAbi.js` effective lines under `max-lines {skipBlankLines, skipComments}` | **95 → 95**, NET ZERO — every added line is a comment |
| 9 | census tuple, re-derived at the slot base and convicted at the rebased tree | `2497 / 364 / 2133 / 20719 / 5785` both readings; walker green 33/33. Identical to the build-base figure for a DIFFERENT reason — see the census note |
| 10 | `package.json` / `package-lock.json` motion in the window | none across `9bfae712..0afddfe9` — no dependency bump, so no §349.2 mint trigger fires and the lane's `npm ci` tree stays valid |
| 11 | `PACKET_MANIFEST.json` conflict resolution | slot base taken byte-for-byte, this lane's row re-appended. **145 incumbent rows in, 146 out; 0 missing, 0 drifted** by row-level deep compare against `0afddfe9`; exactly `MF-T2Bf` added |
| 12 | `INDEX.md` conflict resolution | same method. **148 table rows in, 149 out; 0 lost**; the RR-1 and RR-2 rows both verified present; exactly one `MF-T2Bf` row |
| 13 | edit-host and preamble hashes at the slot base | all three UNCHANGED from the build base — `424500a8…`, `d69ad9ba…`, preamble `0706aad6…`; no re-stamp occurred in the window |

## §5 · THE DECLARED RE-RECORD, KEY BY KEY

Exactly **ONE** committed pin re-records. It is the line ODQ §372 names.

| key | before | after |
|---|---|---|
| `canonicalBytes('K', 2, null, 'x')` | `abi:1kind:Kschema:2deps:[]body:x` | `abi:1` ␟ `kind:K` ␟ `schema:2` ␟ `deps:[]` ␟ `body:x` |

**Added: 0. Removed: 0. Moved: 1.** No other literal in the file moves; the replay roster stays
at 26 calls and its length pin is untouched; `ringText`'s pin, the geometry constants and the
nondeterminism source scan are byte-identical.

- **Declared cause:** INJECTIVITY RESTORATION. The predecessor line asserted the separator-less
  string, which is how the drop survived a landing — the pin was green over the wrong bytes.
  Nothing about the encoding was retuned; the sealed encoding was restored.
- **Authority:** ODQ §372 (charters the re-record in the same sentence as the fix) and §387.
- The cause is stated in the source, at the pin, in a comment naming both sections — a successor
  reading the line learns why it moved without leaving the file.

⛔ **THE RE-RECORD IS NOT THE GUARD.** A re-recorded literal can be re-recorded wrong again, so
the member also lands the collision pair as machinery inside the same test: the two tuples of
§1's first row, an assertion that stripping the separators back out reproduces the ONE pre-cure
string (named as a literal, so the control cannot degrade into comparing the deriver with
itself), and an assertion that the two encodings differ. Both arms are straight-line statements
inside the existing `A5` test, so the census does not move.

## §6 · MUTANTS

| # | mutant | expected | executed result |
|---|---|---|---|
| a | strip all four separators from the function (the exact pre-cure state) | the re-recorded pin reds | **RED**, exit 1 — `expected 'abi:1kind:Kschema:2deps:[]body:x' to be 'abi:1\u001fkind:K…'` |
| b | same mutant, injectivity arm evaluated in isolation | the collision pair collides | `collideA === collideB` is **true** — the `not.toBe` arm would red on its own |
| c | same mutant, positive control evaluated | the strip-control still holds | **true** — the control does not itself depend on the cure, so it cannot manufacture a pass |
| d | control: restore the cure, re-run | green | **PASS**, exit 0 |

⭐ Mutant (a)'s failure message is worth keeping: vitest prints `Expected` and `Received` lines
that LOOK identical, because the separators do not render. The diff a reader sees is empty. That
is the whole hazard class in one screenful, and it is why the guard is a property assertion and
not an eye-check.

## §7 · EXACT CHANGE MANIFEST

| Action | File | Region | Delta | Instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/townMap/fabric/coordinateAbi.js` | `canonicalBytes` return + its docstring | `+16 / -2` physical, **0 effective** | Emit `\u001f` after the ABI version, the kind, the schema and the dependency list's closing bracket. ⛔ The `deps` join line, the signature and every other export are byte-identical |
| `TEST` | `tests/property/townMapCoordinateAbiDeterminism.test.js` | inside the existing `A5` test + one module-scope constant | `+30 / -1` | The declared re-record, the named separator constant, and the collision pair as two anchored arms. ⛔ No `describe`, no `test`, no title, no roster entry moves |
| `DOC` | `docs/implementation/packets/town-cartography/MF-T2Bf.md` | new | — | this packet |
| `DOC` | `docs/implementation/PACKET_MANIFEST.json` | one packet row appended | — | registration |
| `DOC` | `docs/implementation/INDEX.md` | one table row | — | registration |

## §8 · JUDGMENT CALLS, VETOABLE

- **J-TET2BF-1 — REVERSED IN FLIGHT, and the reversal is the member's sharpest finding.** The
  separators were first written as raw bytes, byte-exact with the sealed source as §372's
  charter asks. `tests/lint/controlBytes.test.js` red, and the ratchet's rule is not a
  convention this lane may weigh against fidelity — it is landed law with a stated reason. The
  escape spelling stands, the divergence is declared (§2.2), and the output equivalence is
  proved by execution. **The chair may veto by moving the ratchet instead; this lane did not
  treat widening a landed guard as its call.**
- **J-TET2BF-2** — `COORDINATE_ABI_VERSION` held at `1`, with the future obligation written
  down (§2.3).
- **J-TET2BF-3** — the collision pair landed as a test arm rather than living only in the
  lane's scratchpad, because §372's defect is precisely a guard that could not see the thing it
  guarded. Cost: zero census motion, two statements inside an existing test.
- **J-TET2BF-4** — the deps-join gap left uncured and RAISED (§2.4) rather than folded in.

## §9 · RAISED

1. **RAISED-1 — §372.2's dual-run comparator owes a new declared-divergence row** for the
   `\u001f` spelling in `coordinateAbi.js`. Source text only; the encoding matches. Without the
   row the battery will report a cured module as drifted.
2. **RAISED-2 — the dependency-ref join is non-injective in the SEALED source.**
   `['a,b']` and `['a', 'b']` join to the same text. Not this member's charter, not masked by
   the separators, and it will reach any consumer that passes more than one dependency ref.
3. **RAISED-3 — a version bump becomes owed the moment any member persists a `canonicalBytes`
   result** (§2.3). MF-T2H is the first candidate.
