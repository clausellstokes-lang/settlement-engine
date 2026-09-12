# Town cartography / MF-T2H — the spatial-receipt seam, ported onto the cured ABI, with the dependency-join injectivity gap closed as a declared divergence

- **Status:** LANDED
- **Packet version:** 1
- **Landing note (ODQ §442.1, recorded here at HK-2 / ODQ §454.3):** this member LANDED on
  2026-08-22 and this packet's status row lagged the branch by 8 commits — three landings
  (WEB-1 the 27th, WEB-4 the 28th, WEB-5 the 29th), measured with
  `git rev-list --count 84e06412..dffa2b97` rather than counted from memory. Run 2 of the
  terminal, fired detached and never killed, ENDED 00:46:10Z with `TRUE_EXIT=0` +
  `[gate-tail] exit: 0` + `free_kb_at_end=7811004`; every step was read from the body rather
  than trusted from the exit — all eleven `validate:*`, both typecheckers, lint 0 errors
  (29 pre-existing warnings), `test:ratchet OK — no test regressions (11 known failure(s) of
  28748 tests, ceiling 11)`, build ✓ 3929 modules, and `STRICT DIST OK — 52 file(s), 433
  test(s)`. The suite total of 28,748 is +10 over the last recorded gate (28,738), consistent
  with this member's +6 titles. The chair executed the CAS `b10ed1a1 → 84e06412` with an
  old-value assertion; `claude/composite-r4` = **84e06412**. Do not redispatch.
  ⭐ **J-TET2H-7 IS DISCHARGED BY THIS FLIP.** That judgment kept this member's OWN new
  exports out of `requiredSymbols` because §P7.13 makes a row naming a symbol the deliverable
  CREATES a STOP at READY — such a row reds against every tree that does not already carry
  the member. At LANDED the tree carries them, so the rows JOIN here, in the manifest, in the
  MF-T2B shape (that LANDED packet names five exports of its own two created leaves plus one
  anchor per created test file). Only symbols this packet NAMES were added, each verified to
  resolve live: `spatialEffectReceipt`, `canonicalSpatial`, `noEffectDiagnostic` and
  `fingerprint` from `spatialReceipt.js`; `FABRIC_FORK_NAMESPACE`, `hash32` and `hashUnit`
  from `fabricRng.js`; and the one `describe` anchor of each new acceptance file.
  ⛔ `legacySubstrateForkKey` is NOT named — J-TET2H-1 declares it UNPORTED, and a row for an
  absent symbol would red the manifest at every status.
- **Verified base:** `claude/composite-r4` at `b10ed1a1f5a0f2acd00bbfc9b5d0a41931697c3d`
  ⭐⭐ **RE-STAMPED AT THE LANDING SLOT, AS THIS ROW PROMISED IT WOULD BE (J-TET2H-6).** The member
  was authored against MF-T2Bf's **HOLDING (unlanded)** commit `7d6bde7c`, which was never an
  ancestor of `claude/composite-r4`; MF-T2Bf then landed as `3519dcc1` and this member was rebased
  onto `b10ed1a1` (CT-3) across **13** landed commits. Every figure below is re-derived AT THIS
  SLOT, not carried — see the carry-proof in §4 row 3a and the re-derived tuple in §6.
  Both values were read with `git rev-parse` and neither was ever extended
  from a quoted prefix (§381's fabricated-SHA law).
  ⚠ The status and verified-base values above each stand ALONE on their line because
  `parsePacketHeader` (`scripts/implementation-packets.mjs`) anchors both rows at end-of-line —
  the status row per J-TEWF1B-1, and the base row against `` `<branch>` at `<40-hex>` `` exactly,
  so a trailing clause on that line parses the whole value as null.
- **Depends on:** `MF-T2Bf` — STACKED, and the dependency is hard rather than tidy. §372 records
  that a `spatialReceipt` port at the pre-cure encoding cannot reproduce sealed digests, because
  this module is where `canonicalBytes` is finally fed COMPOSITE field values. The cure was
  verified present at this base before anything was ported: `canonicalBytes` carries all four
  `\u001f` escape separators at `coordinateAbi.js:257-261`, two on each of its two lines.
- **Binds forward:** the member that ports `substrate.js` (which inherits the one declared
  omission, §1.2) and the first member that PERSISTS a `canonicalBytes` result (which inherits
  the standing `COORDINATE_ABI_VERSION` trigger, §2.3).
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed` — recomputed from the file
  at this base by this lane, identical to the value MF-T2B, MF-T2G and MF-T2Bf carry, so no
  re-stamp occurred in the window. Its §P1 refutations, §P2 hazard dispositions, §P3 anchor
  preflight, §P5 census law, §P6 mutant hygiene, §P7 STOP set and §P8 capsule law bind this
  packet and are not restated.
- **Collision group:** `d3a-port`. Re-executed against `PACKET_MANIFEST.json` **at the landing
  slot**: 149 packets, of which **148 are terminal** (147 LANDED + 1 SUPERSEDED) and this member
  is the **only** non-terminal one, so no packet reserves a change path anywhere. Both new
  production leaves and both new acceptance files carry **zero** reservations of any status. The
  two MODIFY hosts are reserved 72 times between them and **every one of those rows sits in a
  LANDED packet**, which is what makes them free to modify. No split promotion is owed.
- **Commit authority:** the executing lane commits on its own detached ref; the chair moves the
  branch. **This lane moved no ref.**

> **`censusAuthorization`:** this packet moves the test census by
> **`+2 files / +0 parked / +2 credited / +6 titles / +2 suiteTitles`**. **Base tuple, convicted
> at the landing slot `b10ed1a1`: `2497 / 364 / 2133 / 20723 / 5785`. After tuple, convicted at
> that slot with the member applied: `2499 / 364 / 2135 / 20729 / 5787`.** Its authorizing decisions are **ODQ §276**
> (the build sheet architecting the §275 adoptions), **ODQ §304.4** (the D3a port charter,
> twin-life bounded) and **ODQ §390** (the three chartered additions this member executes), under
> §299.4's binding-forward rule. The family's stamp is **GRANTED** at ODQ §312.2b.
> ⭐ **AND A SECOND CENSUS MOVES, ON A SEPARATE AUTHORITY: the entropy-root closure record,
> `32 → 34` (§1.3, §11.2).** Its authorizing decision is **ODQ §403**, which ruled the re-record
> **RATIFIED** — the walker's escalation clause reserves the disposition-row-plus-chair-ruling path
> for a new COMPOSITION or a new READ, this member creates neither (both exact-set rosters green),
> and the WF-8A `14 → 15` re-record (ODQ §350) is the governing shape.
> ⚠ **THE PREDICTED MOTION AND THE MEASURED MOTION ARE THE SAME FIVE NUMBERS**, and the walk that
> produced them is in §6 — sequenced, one figure at a time, each read from its own arm's failure
> message rather than computed.

> ⛔ **PORT SOURCE PROVENANCE (preamble §P1 R-MF-4).** The sandbox is not a git repository. This
> lane read both sealed sources from the preserve ref `refs/preserve/map-sandbox-w3f-sealed`
> (`ee0db96d381a5a30efad63a7e2d355e0cc3db669`) and **re-hashed them before any edit**. The
> `coordinateAbi.js` row is carried as the CROSS-CHECK: it reproduces the SHA-256 that MF-T2B and
> MF-T2Bf both cite, which is what makes the preserve ref the packet-cited port source rather
> than merely a convenient copy.
>
> | source module @ `refs/preserve/map-sandbox-w3f-sealed` | SHA-256 | role |
> |---|---|---|
> | `src/domain/townMap/fabric/spatialReceipt.js` | `d713bc982b0cbbb49ba6d10864ba69914bd9799871215a4dc67b6fd358425509` | ported here |
> | `src/domain/townMap/fabric/fabricRng.js` | `21b8b426049d8e55db2f4adffa4e7687b58f1c35246f65bb6b96c2e15d1bbb94` | ported here |
> | `src/domain/townMap/fabric/coordinateAbi.js` | `123f3c17ebd42da5223216f0029617706db49b3de7ab602acd6edcf72a2c8404` | **MATCH** against MF-T2B/MF-T2Bf — executed |
>
> **Deliverables, hashed after this member (all four are CREATE — none existed at the base):**
>
> | file | SHA-256 after this member |
> |---|---|
> | `src/domain/townMap/fabric/spatialReceipt.js` | `77cc79d631549db69cc0b059bf152ba7691b52f7abe11c1f0f7a4875c4fc94df` |
> | `src/domain/townMap/fabric/fabricRng.js` | `4094ecb8ba24b07af812ebc8d8acbdb78ec9afe6584206fce2b2f5da28d6e95a` |
> | `tests/domain/townMapSpatialReceipt.test.js` | `b00d4f77d4c10b03e2109e73beb1e71c4b619e7cbc7349bc90ff67566c3f5aa1` |
> | `tests/property/townMapFabricRngDeterminism.test.js` | `6f9c6fd4beaccbae2edaa5285abb0ada642662d2c478ff03d7fab36c15dd125d` |
>
> **The TWO MODIFY hosts, both census registers:**
>
> | file | SHA-256 at the slot `b10ed1a1` | SHA-256 after this member |
> |---|---|---|
> | `tests/lint/sovereigntyLightingContract.walker.test.js` | `7f5575c8bd265b16964d81642b3f8b634624d2f9f7c6e24d5495828d4e109831` | `6fa706ac01bf675b0e80d4c130e3326774c5cc022dca6041443322e77aaa444b` |
> | `tests/lint/entropyRootCensus.walker.test.js` | `7d00e06980b41a545e48c4cc554de2f69c301f3fedb013b72b49c3664c3bcbee` | `b289c7960c86d516f27efe39d3dbc7631c13a24b22cb0a01469c1a62ec5af8ed` |
>
> ⭐⭐ **RE-STAMPED AT THE LANDING SLOT, AND THE CARRY LAW EARNED ITS KEEP.** This member was
> authored stacked on MF-T2Bf's unlanded holding commit (`7d6bde7c`) and was rebased onto
> `b10ed1a1` (CT-3), across 13 landed commits. Per the carry law the DELTA
> (`+2/+0/+2/+6/+2`) is what crosses; every hash and every census figure above is re-derived from
> the hash AFTER the last edit at the slot, never carried.
> ⛔ **AND THE MODIFY HOST HAD MOVED UNDER THIS MEMBER.** TE-H8B's Cure 1b re-recorded the same
> tuple's `titles` from 20,719 to **20,723** in the commit directly below this one, so both the
> host's base hash and this member's own after-figure changed: the tuple lands at
> `2499/364/2135/**20729**/5787`, not the authored `…/20725/…`. Carrying the authored tuple would
> have silently REVERTED a landed +4. The four CREATE hashes are byte-unchanged across the rebase,
> which is the proof the leaves themselves did not move.
> The first rebase step was the carry-proof-by-absence blob-SHA compare, executed in §4 row 3a.

---

## §1 · WHAT THIS MEMBER IS, AND WHAT IT REFUSES

### §1.1 The two leaves

Two dormant production leaves are ported into `src/domain/townMap/fabric/`, and nothing is wired
to them:

1. **`spatialReceipt.js`** (137 effective) — §287.4's `state_t → canonicalSpatial_t → spatialReceipt_t` seam as a
   typed artifact. Its content is that three rules become UNREPRESENTABLE rather than forbidden:
   a receipt is dated for LATER (`effectiveAt` strictly greater than every source time); the
   dependency roster is closed by kind and temporal branch, in order; and a no-effect result is a
   separately typed diagnostic, never an empty causal receipt. Its digest is built from a **named
   field roster** and never from the object, which is what makes §10.1's refusal — *"No aggregate
   digest is accepted as proof of a narrower invariant"* — structural rather than conventional.
2. **`fabricRng.js`** (77 effective) — the seeding law, key-anchored. It is a LEAF in the strict sense: it
   imports nothing, so its measured closure is itself.

**The measured import closure of the pair is `coordinateAbi.js` and `fabricRng.js` and nothing
transitively beyond them** (§P2.3's barrel-hop hazard does not fire): `spatialReceipt.js` takes
`canonicalBytes`, `COORDINATE_ABI_VERSION`, `ringText` and `worldQ` from the ABI, which is already
landed, and `hash32` from its sibling. No 681-effective-line module is dragged in.

### §1.2 What it refuses, named affirmatively

- **No consumer is wired**, no barrel row is added and `src/domain/townMap/fabric/index.js` is not
  opened. §P4 requires the HEAD RE-EXPORT to be named or its absence reasoned: **there is none, on
  purpose** (J-TET2H-3). A re-export has no reader in this member, and it would place a dormant
  leaf in the barrel's closure for no gain — exactly the shape §P2.2 warns about. The landed
  `solidLegality.js` sets the precedent: it carries zero barrel rows.
- **One sealed export is deliberately NOT ported** (J-TET2H-1): `legacySubstrateForkKey`, a
  byte-compatibility shim that exists only so the sandbox's `substrate.js` keeps the salt string
  it already built itself from. `substrate.js` is not in this tranche, and the shim's own docblock
  cites a pin in a sandbox test file absent from this tree — so porting it would land a symbol
  with no consumer under a comment that is false about this tree. Deferred and documented, not a
  bug to re-find.
- **`COORDINATE_ABI_VERSION` does not move** (§2.3), no `artifactKind` or `schemaVersion` stamp
  moves, `heightQ()` is untouched, no arrangement-quantum rung or tuning constant is chosen, the
  y-axis flip is not applied, no `spatialLedgers` row or engine-gated flag is minted, no
  `tests/lint/**` file is added (so no `scripts/mutation-coverage-manifest.json` row is owed under
  §P3b), and no dependency is bumped — `package.json` and `package-lock.json` are byte-unmoved, so
  no schema-mint trigger fires.
- **No live seed byte moves.** There is no declared same-seed shift in this member, because there
  is nothing downstream to shift (§3).

### §1.3 The registration template, at full strength (§P4, ODQ §35.3)

This member mints one row in one registration file. All four names, explicitly and by path:

| the four | this member |
|---|---|
| **THE ROW** | the five-figure census tuple in `tests/lint/sovereigntyLightingContract.walker.test.js`, re-recorded whole with its cause (§6) |
| **THE HEAD RE-EXPORT** | **NONE, AND THAT IS THE ANSWER RATHER THAN AN OMISSION** (J-TET2H-3, §1.2). `src/domain/townMap/fabric/index.js` is not opened; the landed `solidLegality.js` carries zero barrel rows and is the precedent |
| **THE EXACT-LIST / EXACT-COUNT PIN** | the census arm's own five equalities plus its `parked + credited === files` arithmetic pin, in the same file — exact in BOTH directions, so a shrink cannot go unbanked either |
| **THE REGISTRY TEST PATH** | `tests/lint/sovereigntyLightingContract.walker.test.js` |

⛔⛔ **AND A SECOND REGISTER, WHICH THIS PACKET MISSED AT COMPILE AND THE TERMINAL GATE FOUND
(§11).** `tests/lint/entropyRootCensus.walker.test.js` carries a closure-record figure counting
hash-helper DEFINITIONS across `src`, and `fabricRng.js` adds two of them. The four names again:
**THE ROW** is that counter, re-recorded 32 → 34 with its cause; **THE HEAD RE-EXPORT** is again
none, for the reason in §1.2; **THE EXACT-COUNT PIN** is the arm's own `toBe(34)`; **THE REGISTRY
TEST PATH** is `tests/lint/entropyRootCensus.walker.test.js`.
⭐ **THE DISPOSITION IS THE INTERESTING PART, AND IT WAS MEASURED RATHER THAN ARGUED.** That census
anchors on the READ — a value taken off a world-shaped object — and on COMPOSITIONS built from a
world root. The seeding law does NEITHER: it takes `settlementSeed` as an ARGUMENT and never
reaches for `worldState.rngSeed`, which is precisely what lets a rebuilt fabric promise
byte-unchanged output for unchanged facts. With the member applied the file reds on exactly ONE of
its 31 arms — this counter — while BOTH exact-set rosters, COMPOSITIONS and READ_SITES, stay
green. **Two new definitions, zero new entropy roots.** And the two names could not be chosen
away: `hash32` and `hashUnit` are the sealed API that the port's own equivalence proof pins
across 64 of 64 stream rows, so renaming them to dodge a regex would break a guarantee this
instrument has no view of.

The other registers §P4 lists are addressed in §4: the anchor walker (rows 14), the single-declaration
law (row 5), the entry-closure fence (§10), the coupling/layer census (row 12, NOT FIRED), the size
ratchet and the hot-file law (row 11, both zero). No `tests/lint/**` file is added, so §P3b's
mutation-coverage row is not owed — that obligation is invisible to a focused run and is therefore
priced here rather than discovered at a terminal.

## §2 · THE THREE §390 ADDITIONS, EACH EXECUTED

### §2.1 The dependency-join injectivity cure — CHARTERED, EXECUTED, AND WIDENED WITHIN THE FILE

The sealed `spatialEffectReceipt` builds its dependency roster as `role=contentHash` strings
joined with `,`. A plain join over variable-length parts is not injective, so two different causal
chains can receive one `contentHash`. §390.1 charters the cure here because this member is the
encoding's first real consumer, and R-MF-4 forbids curing it in the sealed tip.

⭐ **IT IS CURED AS A RULE RATHER THAN AS A PATCH (J-TET2H-2).** A netstring-style length prefix
(`<length>:<text>`) is applied at **every** composite seam in the file, not only at the chartered
one. The reason is measured rather than stylistic: the same defect is constructible at three other
seams in the same two functions, and curing one while leaving three live would ship a
proven-defective encoding beside a proven-cured one. Each seam has an executed witness **both
ways**:

| seam | sealed spelling | this port |
|---|---|---|
| the dependency list (the chartered seam) | `['SPATIAL=x,LAW=y', 'LAW=z']` and `['SPATIAL=x', 'LAW=y,LAW=z']` **COLLIDE** | **DISTINCT** |
| the `sourceIds`/`affectedIds` body seam | `['a\|b'],['c']` and `['a'],['b\|c']` **COLLIDE** | **DISTINCT** |
| within one id list | `['a,b']` and `['a','b']` **COLLIDE** | **DISTINCT** |
| `canonicalSpatial`'s field-roster seam | two different fabrics share one spatial digest | **DISTINCT** |
| **negative control** — two plainly distinct inputs | **DISTINCT** | **DISTINCT** |

The negative control is the load-bearing row: without it, an after-run reporting no collisions
could be a witness that had stopped comparing. Both halves of a dependency pair are prefixed, not
only the pair as a whole, because the `role=` seam is separately non-injective and resting an
encoding property on a validator two branches away is precisely how the U+001F separators went
missing without a red (§372).

⚠ **THE CONSEQUENCE, STATED PLAINLY.** The digests this module produces are **not** the sealed
module's digests. Sealed reproduction is therefore scoped to the parts the divergence does not
touch, and that scope was proved rather than asserted (§4, rows 6-9): every non-digest field, every
exported vocabulary, `fingerprint` itself and all twelve refusal paths are byte-identical to the
sealed source. Nothing is migrated by the divergence because nothing was ever minted (§2.3).

### §2.2 The control-byte lesson — THE TRIGGER DID NOT FIRE FROM THE SEALED SOURCE, AND DID FIRE FROM THE LANE

Executed, not assumed: `grep -caP '[\x00-\x08\x0b\x0c\x0e-\x1f]'` over both sealed sources returns
**0**. All `canonicalBytes` separator logic lives in `coordinateAbi.js`, which MF-T2Bf already
cured, so **this member owes no control-byte re-spelling of ported code** and the ratchet is not
widened.

⚠ **IT FIRED ANYWAY, FROM THIS LANE'S OWN AUTHORING, AND THAT IS WORTH RECORDING.** A first draft
of the acceptance file re-derived a digest preimage by hand, and raw U+001F bytes entered that
line invisibly — the identical failure mode, arriving from the opposite direction. It was caught
by scanning before any gate ran, and the assertion was removed rather than re-spelled: re-deriving
`canonicalBytes`' preimage inside the test would have asserted the module against a copy of itself
and could never see a dead arm (§P2.10). `tests/lint/controlBytes.test.js` reads 4/4 green over
the delivered tree.

⚠ **A SECOND, RELATED DIVERGENCE IS DECLARED: TWO WORDS OF SEALED PROSE ARE RE-SPELLED.** The
acceptance companion's nondeterminism scan reads raw file text, and one of its six tokens is a
SUBSTRING of a word the sealed docstring uses twice. This was found by execution, not by reading —
the scan convicted the docstring — and the first cure re-introduced the fault by quoting the
forbidden word while explaining its removal. The words are now absent, including from the
explanation. Behaviour is untouched; only prose moved.

### §2.3 The ABI-version trigger — DETERMINED, AND IT DOES NOT FIRE

**Does this member PERSIST any `canonicalBytes` result? NO.** Determined by execution rather than
by design intent: every digest here is computed, returned inside a frozen value and dropped. There
is no store write, no serializer, no fixture, no golden file and no consumer to hand one to — a
tree-wide grep for either leaf's name finds only the two acceptance files (§3). `COORDINATE_ABI_VERSION`
therefore holds at **1**, and no migration is owed because no artifact was ever minted.

⛔ **THE STANDING TRIGGER IS RESTATED RATHER THAN DISCHARGED.** A `COORDINATE_ABI_VERSION` bump
becomes owed the moment any member persists a `canonicalBytes` result, and MF-T2Bf's
`requiredSymbols` row already carries that obligation forward so it is findable from the manifest.
This member adds nothing to it and takes nothing from it. Had the design needed to persist one,
the correct act was to STOP and report — a version bump is a declared subject, never a side effect
(§P1 R-MF-3, §P7.4).

## §3 · BLAST RADIUS AND DORMANCY EVIDENCE, EXECUTED

Preamble §P2.1 makes dormancy *provable*; it does not make it *proved*. Executed here by a
tree-wide `grep -rn 'spatialReceipt\|fabricRng'` excluding `node_modules`, `.git` and `dist`:

| site | kind | verdict |
|---|---|---|
| `src/domain/townMap/fabric/spatialReceipt.js` | the declaration | the deliverable |
| `src/domain/townMap/fabric/fabricRng.js` | the declaration | the deliverable |
| `src/domain/townMap/fabric/spatialReceipt.js:95` | `import { hash32 } from './fabricRng.js'` | intra-member edge; both leaves dormant |
| `tests/domain/townMapSpatialReceipt.test.js` | the acceptance matrix | the deliverable |
| `tests/property/townMapFabricRngDeterminism.test.js` | the replay companion | the deliverable |
| `docs/implementation/INDEX.md`, `MF-T2Bf.md` | packet prose | records, not code |

**ZERO landed production consumers. ZERO barrel rows. ZERO persistence seams.** The fabric has no
input producer, so a settlement cannot reach this code; the structural fact and the executed grep
agree. **There is no declared shift in this member**, because there is nothing downstream of it to
shift.

## §4 · PREFLIGHT, EXECUTED AT `7d6bde7c`

| # | row | result |
|---|---|---|
| 1 | `git rev-parse` at lane start | base `7d6bde7c…`, branch tip `9bfae712…`, main checkout `83c759ce` untouched |
| 2 | MF-T2Bf's cure present at the base | **YES** — four `\u001f` escapes in `canonicalBytes`, `coordinateAbi.js:257-261` |
| 3 | sealed source SHA-256 × 3 | re-hashed; `coordinateAbi.js` MATCHES MF-T2B/T2Bf's cited value |
| 3a | **carry-proof-by-absence at the landing slot**, blob level | all four CREATE paths **absent** at `b10ed1a1`; `coordinateAbi.js` blob `7edd0272` **identical** at base and slot (the MF-T2Bf cure carried, four `\u001f` escapes intact); `entropyRootCensus.walker.test.js` blob identical at slot. ⛔ `sovereigntyLightingContract.walker.test.js` **HAD moved** (TE-H8B) — the one collision, resolved by keeping both re-record blocks and re-deriving the delta |
| 4 | raw C0 bytes in either sealed source | **0 and 0** — §390.3 does not fire from the port (§2.2) |
| 5 | export-name collisions across `src/domain/townMap/**` | **0 of 20** planned exports collide; single-declaration walker 5/5 green |
| 6 | sealed equivalence — receipt non-digest fields | **byte-identical** over a well-formed input |
| 7 | sealed equivalence — vocabularies and `fingerprint` | **byte-identical**: all five exported rosters, and `fingerprint` itself |
| 8 | sealed equivalence — refusal paths | **10 of 10** throw the identical type AND message |
| 9 | sealed equivalence — `fabricRng` | **64 of 64** seed × key × variant × year rows reproduce the sealed stream byte-for-byte |
| 10 | effective lines, eslint's own `Linter` (`skipBlankLines`, `skipComments`) | `spatialReceipt.js` **137** (sealed 126; +11 is the injectivity cure plus the strict-typing guard of §11), `fabricRng.js` **77** (sealed 80; −3 is the omitted shim, every added line being comment). **Production total 214** against the 400 cap and both leaves under the 250-per-leaf cap |
| 11 | `src/domain/**` 800-effective ceiling; hot-file list; `scripts/.size-baseline.json` | not approached; no `townMap` path on either (§P4's four zeros hold — the leaves land INSIDE `src/domain/townMap/**`) |
| 12 | coupling/layer census | **NOT FIRED** — scope excludes `townMap` (§P4) |
| 13 | `PACKET_MANIFEST.json` reservations on all five paths | all 144 packets terminal; zero reservations on the four new paths |
| 14 | anchor walker, focused, per new test file | **9/9 green** — `npx vitest run tests/lint/negativeAssertionAnchor.walker.test.js` |
| 15 | `package.json` / `package-lock.json` motion | **none** — no dependency bump, so no schema-mint trigger |
| 16 | census tuple, before and after | at the SLOT: `2497/364/2133/20723/5785` → `2499/364/2135/20729/5787`, delta `+2/+0/+2/+6/+2` unchanged from the authoring base (§6, §6.1) |
| 17 | `typecheck:domain:strict` on both leaves (`tsconfig.domain-strict.json`) | **strict-clean, 0 errors** — reached only after the §11 cure; a sealed port is NEVER strict-clean as ported |
| 18 | `any`/`*` type-token count on both leaves (`scripts/count-domain-any.mjs` vocabulary) | **0 and 0** — the cure is typedefs, so the estate's monotone-down allowance is untouched |
| 19 | `tests/lint/entropyRootCensus.walker.test.js` | **31/31 green** after the declared 32 → 34 re-record; both exact-set rosters unmoved |
| 20 | `typecheck:ratchet` (`tsconfig.full.json`) | **OK — no type regressions (173 errors, ceiling 173)**, reported by name and window beside row 17 |

## §5 · ACCEPTANCE CASES

Six cases in two files — one literal `describe` each, straight-line `test` calls, string-literal
titles, every loop INSIDE a named test (the SP-D idiom, §P5).

| id | case |
|---|---|
| **A1** | GUARD-THE-GUARD. The receipt vocabularies are live and mutually closed — 7 kinds, 10 roster branches, and every branch key names a registered kind while every registered kind has a branch — and a well-formed receipt CONSTRUCTS with a fingerprint-shaped `contentHash`, frozen, with the three absent §10.2 artifact families null rather than stubbed. Without this arm the three refusal cases below could all pass on nothing. |
| **A2** | RULE 1 — a receipt dated inside its own pass cannot be constructed. The positive control comes first: the smallest lawful `effectiveAt` constructs. Then the EQUAL case is pinned by itself, because `>` versus `>=` is the branch a mutant flips and the one that would re-open same-pass feedback; then the plainly-earlier cases; then the source ref's own time, which counts as well as the observation; then an ABSENT source time, which is a refusal rather than a free pass. |
| **A3** | RULE 2 — the roster is closed by kind and temporal branch IN ORDER, and every composite preimage is injective. An unregistered kind, an unknown branch, a missing role, an extra role and a REORDERING are each construction failures; the four-role seasonal branch still constructs, so the roster is not merely refusing everything. Then the §390.1 witness: the engineered pair is asserted to collide under the sealed spelling against a NAMED literal (so the control cannot rot into comparing the deriver with itself) and to be DISTINCT through the live module; the three sibling seams follow; and the negative control proves a distinct reading is a measurement rather than a nonce. |
| **A4** | RULE 3 and the named field roster. An empty causal receipt is unrepresentable in both directions, and the diagnostic is a separately typed artifact carrying no `contentHash`. Then the structural proof, DRIVEN rather than asserted: adding EVERY excluded field at once leaves the spatial digest byte-identical while touching ONE roster field moves it — a whole-object hash would fail the first assertion, which is the defect §10.1 forbids. The digest is deliberately NOT re-derived in the test (§P2.10). |
| **B1** | Same seed, key, variant and year replay byte-identically. The frozen key grammar is pinned as literals; two INTEGER pins freeze the hash algorithm itself, because a drop-in replacement that is equally deterministic would satisfy every relational assertion and still re-roll the corpus. A 48-row replay matrix is driven twice and compared, and asserted to hold 48 DISTINCT readings so a stuck generator cannot satisfy the equality. Then the inertia law is driven: a neighbour's 25 draws cannot move this entity; a changed year, a reroll salt, a `sampleIndex` and a `mechanicId` each move only what they should; and all-zero weights degrade to a uniform pick rather than silently to index 0. |
| **B2** | No clock, ambient-randomness, locale or internationalization token is reachable from either new leaf. MF-T2B's six-token vocabulary, carried verbatim so both fabric leaves are judged by one standard, with the planted positive control asserted BEFORE the absence and the anchor comment naming why the empty result is purity rather than a broken scan. |

## §6 · THE CENSUS WALK, SEQUENCED

⚠ **THE INTERIOR RED WAS NAMED BEFORE IT EXISTED** (§P7.12): a member that adds a test file forces
one by construction, because the census arm is an exact equality.

The census is sequenced and stops at its first red figure, so the tuple was re-derived **one figure
at a time**, each read from its own arm's failure message and never computed. This walk was
executed at the **authoring base `7d6bde7c`**; the slot re-derivation follows it:

| step | arm that red | reading |
|---|---|---|
| 1 | `the estate's file count moved` | expected **2499** to be 2497 |
| 2 | `the credited-file count moved` | expected **2135** to be 2133 — `parked` PASSED at 364 without ever redding |
| 3 | `the live TEST-title count moved` | expected **20725** to be 20719 |
| 4 | `the live SUITE-title count moved` | expected **5787** to be 5785 |
| 5 | — | **GREEN** at `2499 / 364 / 2135 / 20725 / 5787` (33/33) |

### §6.1 · THE SLOT RE-DERIVATION — THE BASE MOVED, SO THE AFTER-FIGURE MOVED

⛔⛔ **AND THIS IS THE ENTIRE REASON THE CARRY LAW SAYS "DELTA, NEVER TUPLE".** Between the
authoring base and the landing slot, **TE-H8B's Cure 1b re-recorded this very tuple**, moving
`titles` from `20,719` to `20,723` (+4, four new `it` arms in `tests/lint/testRatchet.test.js`).
Rebasing this member with its authored tuple `…/20725/…` would have written a figure **four lower
than the landed truth** — silently REVERTING a landed re-record while every one of this member's
own proofs still read green, because the arm is a single equality that cannot tell whose +4 went
missing.

Re-derived at the slot, the DELTA is unchanged and the tuple is not:

| figure | slot base (`b10ed1a1`) | delta | after this member |
|---|---|---|---|
| `files` | 2497 | +2 | **2499** |
| `parked` | 364 | +0 | **364** |
| `credited` | 2133 | +2 | **2135** |
| `titles` | **20723** (H8B's landed re-record) | +6 | **20729** |
| `suiteTitles` | 5785 | +2 | **5787** |

Convicted at the slot by execution, not by arithmetic:
`npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` → **33/33 passed,
`TRUE_EXIT=0`**. The predicted tuple and the measured tuple agree, and a wrong figure in any of
the five would have red that arm — which is exactly how both the authoring walk above and H8B's
own re-record were convicted.

**Attributed by ISOLATION, not by arithmetic.** With the walker pinned at the after tuple, hiding
`townMapSpatialReceipt.test.js` alone convicted `files` at 2498; hiding
`townMapFabricRngDeterminism.test.js` alone convicted 2498; hiding **both** convicted **2497** —
the base tuple exactly, which is also the proof that nothing else in the tree moved this census
under the lane. Per-file shape, cross-checked against the diff: 4 and 2 literal `test` titles,
1 and 1 `describe`.

⭐ **PARKED STAYING AT 364 WAS EARNED, NOT LUCK.** Both files spell every title as a literal, so
door 3's reader recognises all six statically and credits both files; a `.each` or a `runIf` would
have parked a whole file and kept the arithmetic closing while `credited` silently did not move.

## §7 · MUTANTS — SEVEN, EACH CONVICTING A BRANCH

Every mutant deletes or weakens ONE BRANCH, never a literal (§P2.11). Planted, convicted, restored
digest-exact under a trap that fires on EXIT INT TERM HUP.

| # | branch deleted or weakened | convicted by |
|---|---|---|
| M1 | the same-pass refusal `effectiveAt > latest` weakened to `>=` | A2, exit 1 |
| M2 | the dependency ORDER arm deleted, the length check left standing | A3, exit 1 |
| M3 | the injectivity cure deleted — `lengthPrefixed` returns bare text | A3, exit 1 |
| M4 | the nonempty `affectedIds` arm deleted, the `sourceIds` arm left standing | A4, exit 1 |
| M5 | the named roster replaced by the OBJECT's own keys in `canonicalSpatial` | A4, exit 1 |
| M6 | the reroll-salt branch deleted from the fork root | B1, exit 1 |
| M7 | the entity key dropped from the fork root (the inertia law broken) | B1, exit 1 |

⭐ **M2 AND M4 ARE THE SUBSUMPTION PAIR** (§P6): each leaves a sibling guard standing and still
convicts, so neither conviction is another guard covering for the deleted one.

⛔ **THE GUARD-THE-GUARD ARM ON THE BATTERY ITSELF.** A clean tree was run as the control and read
**exit 0**. An all-red sweep with no clean-green control is a broken runner, not seven
convictions — the lesson TE-T2B banked. Restore was proved by digest rather than by eye:
`spatialReceipt.js` and `fabricRng.js` both read IDENTICAL to their pre-battery SHA-256.

## §8 · JUDGMENTS

- **J-TET2H-1** — `legacySubstrateForkKey` is NOT ported (§1.2). Chosen over porting it whole
  because it is a byte-compatibility shim for a module this tranche does not port, and its own
  docblock cites a sandbox pin absent from this tree. Deferred to the `substrate.js` member.
- **J-TET2H-2** — the §390.1 injectivity cure is applied as ONE RULE to all four composite seams
  in `spatialReceipt.js`, not only to the chartered dependency seam (§2.1). Chosen over the
  narrow cure because the other three seams are constructibly defective in the same two
  functions; every seam carries an executed witness both ways.
- **J-TET2H-3** — no barrel re-export row (§1.2). Chosen over adding one because the member wires
  no consumer, and a row would put a dormant leaf in the barrel's closure for no reader; the
  landed `solidLegality.js` is the precedent.
- **J-TET2H-4** — the digest is NOT re-derived inside the acceptance file (§2.2). Chosen over a
  preimage pin because re-spelling `canonicalBytes`' preimage in the test asserts the module
  against a copy of itself (§P2.10) — and the first draft that tried it also carried invisible raw
  control bytes.
- **J-TET2H-6** — the `Verified base:` row names `claude/composite-r4` as its branch token even
  though the SHA is MF-T2Bf's unlanded holding commit and is not yet an ancestor of it. Chosen
  over inventing a token (which would look like a branch that does not exist) because
  `parsePacketHeader` requires a non-blank branch at READY, `claude/composite-r4` IS the branch
  of record this member is verified for and will land on, and the three lines immediately below
  the row state the discrepancy plainly. The row is re-stamped at the landing slot.
- **J-TET2H-7** — `requiredSymbols` names only symbols that PRE-EXIST at the base: the cured
  `canonicalBytes`, `COORDINATE_ABI_VERSION`, `ringText`, `worldQ`, `findControlBytes` and
  `expectAbsentWithAnchor`. Chosen over naming this member's own new exports because §P7.13 makes
  a row naming a symbol the deliverable CREATES a STOP at READY — such a row reds against any tree
  that does not already carry the member, which is every tree a READY packet is checked on. The
  new exports are protected instead by the `changeManifest` notes and by the acceptance matrix.
  ⚠ `validate:packets` does NOT catch this: its existence check is status-blind and passed inside
  this lane's worktree, where the created files are already present. The rule is preamble law and
  was applied by reading it, not by being told.
- **J-TET2H-8** — the 29 strict errors are cured by named `@typedef`s and real narrowings, never
  by `@param {any}` (§11). Chosen because `scripts/count-domain-any.mjs` ratchets every `any`
  token in the domain against a monotone-down ceiling of 2287: typing a port with holes spends an
  estate-wide, shrink-only budget to buy nothing. The port finishes at **0** `any` tokens and
  also deletes the `sourceSpatialRef:any` the sealed docblock itself carried.
- **J-TET2H-9** — the entropy-census counter is RE-RECORDED 32 → 34 rather than escalated
  red-with-attribution. Chosen because this is a DECLARED arrival with a measured disposition —
  two definitions, zero roots, both exact-set rosters unmoved — and because the instrument's own
  neighbouring arm carries the same shape of re-record (WF-8A, 14 → 15, "authorized at ODQ §350").
  ⚠ The walker's header reserves "a disposition row plus a chair ruling — never a bump" for a new
  COMPOSITION or a new READ; this member creates neither, which is the executed distinction.
  ⭐ **RULED AT ODQ §403 — RATIFIED, and this entry records the ruling rather than proposing it.**
  The chair read the escalation clause as reserving that path for a new composition or read, found
  this member creates neither because both exact-set rosters stay green, and named the WF-8A
  `14 → 15` re-record (ODQ §350) the governing shape. §403 is therefore the authorizing ruling of
  record, and it is carried in three places that must agree: the `censusAuthorization` block
  above, the walker arm's own comment, and the `PACKET_MANIFEST.json` row.
- **J-TET2H-5** — two determinism pins are INTEGER literals (`hash32`, `hashInt`) while the float
  draws are pinned relationally. Chosen because a drop-in hash replacement would satisfy every
  relational assertion and still re-roll the corpus, and only a literal catches that; float
  literals were avoided because they read as line noise and re-record badly.

## §9 · RAISED

1. **RAISED-1 — the sealed injectivity gap is wider than §390.1's charter names it.** The same
   plain-join defect is constructible at three further seams in the sealed `spatialReceipt.js`.
   This member cures all four in its own port (§2.1), so nothing is owed here; the item is
   recorded because the **sealed tip still carries all four**, and any future port of a sibling
   sealed module that composes a preimage by plain join inherits the same class. The cure rule is
   one function and is now in the tree to copy.
2. **RAISED-2 — the nondeterminism scan is a substring match, and it convicts prose.** Two words
   of ordinary technical English contain one of the six tokens as a substring. This member
   re-spells rather than widens (§2.2), which is correct, but the class will recur on every future
   fabric leaf whose docstring wants to say that a hash is not a security primitive. A future
   member may wish to make the scan word-boundary aware; that is a ratchet change and therefore a
   declared subject, not a side effect, so it is raised rather than taken.
## §10 · THE ENTRY-CLOSURE FENCE, AND WHY THE STATIC WALK IS NOT THE DISCHARGE

§P2.2 as amended by ODQ §324.5 is explicit: `tests/build/townMapLazy.test.js` is
`describe.runIf(distExists)` with a second `it.skipIf(!process.env.VERIFY_DIST)` arm, so on a
fresh worktree it reports **exit 0 over ZERO executed tests** — the estate's "a green that never
ran" shape. **A PRE-BUILD SKIP IS NOT A DISCHARGE.** The fence is therefore run after building
`dist/`, under `VERIFY_DIST=1`, with the EXECUTED counts reported (§11).

**The static half, executed here and reported as what it is.** A static import walk from the app
entry `src/main.jsx`, following `import` and `export … from` edges and stopping at dynamic
`import()`, reaches **233 modules**. Neither new leaf is among them, and **no
`src/domain/townMap/fabric/**` module is among them at all**.

⚠ **THAT READING IS DELIBERATELY NOT CLAIMED AS THE PROOF (§P2.13).** The same walk finds
`src/domain/townMap/index.js` — the barrel §P2.2 names as the standing hazard — **also absent**
from the entry closure, because its fourteen live importers are themselves lazily reached. A
denominator that does not contain the barrel cannot prove anything about a leaf sitting behind
the barrel. It is reported because it is a real measurement and because a REACHABLE reading here
would have been a STOP on the spot; the discharge is the built one.

⭐ **AND THE FORENSIC ZOOM HAS AN UNUSUAL EXPECTED ANSWER FOR THIS MEMBER, STATED IN ADVANCE SO A
SURPRISE IS LEGIBLE.** The zoom asks that a string literal unique to a new leaf appear in none of
the entry chunk's transitive static closure and in a lazy chunk elsewhere in `dist/`. This member
wires **no importer at all**, so the honest expectation is stronger than the usual one: the leaves
should appear in **no chunk whatsoever**, having never entered the module graph. A literal found
in ANY chunk would mean something reached them, and that is §P7.2's dormancy-boundary STOP.
## §11 · THE TERMINAL RECORD — TWO REDS, BOTH THIS MEMBER'S, BOTH CURED

⛔ **NEITHER RED WAS A STRAY, AND NEITHER WAS CONTENTION.** The lane's own sweep and both terminal
runs are recorded here in full, because a packet that reports only its last green run hides the
two obligations that a next port of a sealed module will meet in exactly the same order.

### §11.1 · GATE 1 at `d8d6a76d` — RED at `typecheck:domain:strict` (step 8 of 17)

`npm run check:tail`, fired BARE from a fresh shell (never wrapped in `gate-mutex.sh --run`, which
self-deadlocks and reports exit 3), STARTED-HANDSHAKE stamped, `TRUE_EXIT=1`, and the gate's own
tail line agreeing: `[gate-tail] exit: 1 (the gate's own status, not a pipe's)`.

Steps that actually RAN — the `&&` chain blacks out everything after a red, so this is the half of
the receipt that matters: `validate:edge` · `validate:map` · `validate:tuning-bands` ·
`validate:foundry-module` · `validate:mcp-server` · `typecheck:ratchet` · `typecheck:domain:strict`
**(RED)**. Everything below it — the entire test layer, the ratchet and every census — never
executed.

**BOTH TYPECHECK CONFIGURATIONS, BY NAME AND WINDOW (§P5).**
`typecheck:ratchet` (`tsconfig.full.json`) passed immediately before: *"OK — no type regressions
(173 error(s), ceiling 173)"*. `typecheck:domain:strict` (`tsconfig.domain-strict.json`) red:

```
src/domain/townMap/fabric/fabricRng.js: 16 strict errors (baseline 0) — +16
src/domain/townMap/fabric/spatialReceipt.js: 13 strict errors (baseline 0) — +13
Domain strict-error ceiling is 1134. New/worsened files must be strict-clean.
```

⭐ **THE LESSON, AND IT GENERALISES TO EVERY REMAINING PORT MEMBER: THE SEALED SANDBOX WAS NEVER
TYPECHECKED, SO NO PORT OF IT IS STRICT-CLEAN AS PORTED.** The 1134 domain ceiling is irrelevant to
a new file — its baseline is 0 and the requirement is absolute. 28 were `TS7006` implicit-any
parameters and one was a `TS7053` index signature.

⛔ **AND THE OBVIOUS CURE WAS A TRAP.** `@param {any}` would have silenced all 29 — and
`scripts/count-domain-any.mjs` counts every `any` token and every bare `*` in the domain against a
**monotone-down** ceiling of **2287** (`tests/lint/domainAnyCastBaseline.test.js`, with its own
`DECLARED_OVERRUN_CEILING` of 34). A port that types itself with holes spends an estate-wide,
shrink-only budget to buy nothing. The cure is three named `@typedef`s (`DependencyRef`,
`DurableItem`, `DurableField`), one-tag-per-line `@param` blocks, and two real narrowings; the
member finishes at **0** `any` tokens on both leaves and additionally deletes the
`sourceSpatialRef:any` the sealed docblock carried (J-TET2H-8).

Three narrowing facts worth the next lane's time: `Array.isArray` does **not** narrow a
`ReadonlyArray<T>` out of a union; `.filter(Number.isFinite)` does **not** narrow
`number|undefined` to `number[]` (an explicit `typeof t === 'number'` collector does, and is
behaviour-identical because `Number.isFinite` is already false for every non-number); and multiple
`@param` tags on one JSDoc line DO parse — the real cause was functions carrying none at all.

⚠ **THE CURE TOUCHED THE SAME-PASS ARITHMETIC, SO EVERY PROOF WAS RE-EXECUTED AT THE CURED TREE**,
not carried: strict-clean · 0 `any` tokens · eslint 0 · acceptance 6/6 · **22/22 witnesses** with
the refusal set widened from 10 to **12** to cover the retyped arithmetic (12/12 identical to
sealed in type AND message) · **mutants 7/7 convicted** with a clean-tree control at exit 0 and a
digest-exact restore · `C0=0` on all delivered files. Effective lines moved `133 → 137` for
`spatialReceipt.js` (the guard loop) and held at 77 for `fabricRng.js`; production total **214**.

### §11.2 · GATE 2 at `2064a67e` — RED at `test:ratchet`, one regression, and it was ours

`TRUE_EXIT=1`, `[gate-tail] exit: 1`. This run cleared both typecheckers and the whole lint layer
(`✖ 29 problems (0 errors, 29 warnings)`, all pre-existing warnings in files this member does not
open) and reached `test:ratchet` — near the end of the chain.

```
[test-ratchet] TEST REGRESSIONS (fix them; do not widen the census):
  1 failing test(s) NOT in the frozen census:
    tests/lint/entropyRootCensus.walker.test.js :: EP-0 · the closure record,
      re-run rather than transcribed hash-helper DEFINITIONS in src = 32
      ASSERTION · ran 925ms against a 20000ms budget — a real verdict — read the message
      msg: AssertionError: expected 34 to be 32
  machine at this run: load 140.75/87.40/50.35 over 8 core(s)
Frozen census is 11 failing test(s), measured at 4deb4f026644cba500b0efc1e051fdea2ff96041.
```

⭐ **CLASSIFIED BY THE RATCHET'S OWN PRINTED CLASS LINE, WHICH IS WHY THE LOAD FIGURE DOES NOT
EXCUSE IT.** The class is **ASSERTION**, and the duration is `925ms against a 20000ms budget` — a
real verdict, not a budget timeout, even at load 140 over 8 cores. Exactly one test outside the
frozen eleven, and it names a value rather than a clock.

**THE FINDING IS REAL AND THE MEMBER OWNS IT:** `tests/lint/entropyRootCensus.walker.test.js`
counts hash-helper DEFINITIONS across `src` under
`/function (fnv1a32|hash01|hashUnit|hash32|fnv1a)/`, and `fabricRng.js` declares `hash32` and
`hashUnit` — the +2. This register was missed at compile and is now named in §1.3 with its
disposition; the re-record and the reasoning are J-TET2H-9.

⚠ **THE EARLIER BARE SWEEP IS LOGGED AS SMOKE, NOT AS ATTRIBUTION (§393).** `npx vitest run
tests/lint tests/build` fired bare under contention read `5 files / 9 tests failed, 2054 passed,
63 skipped` with imports at 107.6s and tests at 459.5s. It never named either of this member's
files, but a bare sweep's failing set depends on who else is running, so it is recorded as smoke
and the mutexed `test:ratchet` above is the attribution instrument of record.

### §11.3 · THE POST-BUILD FENCE AND THE FORENSIC ZOOM (§P2.2, ODQ §324.5)

`npm run build` green (16.86s, postbuild wrote 314 static route documents). Then the fence, under
the environment variable that un-skips its second arm:
`VERIFY_DIST=1 npx vitest run tests/build/townMapLazy.test.js` → **3 passed (3), `TRUE_EXIT=0`** —
EXECUTED counts, not a pre-build skip.

The forensic zoom over **710 dist chunks**, with every probe first verified UNIQUE to this member's
two leaves across the whole of `src/`: `SPATIAL_EFFECT_RECEIPT`, `SPATIAL_EFFECT_DIAGNOSTIC`,
`SOLAR_PROFILE`, `fp-v1-`, `map-fabric:v3`, `noEffectDiagnostic`, `lengthPrefixed`,
`FABRIC_FORK_NAMESPACE` — **0 chunks each**. Three positive controls owned by LANDED fabric
modules — `plan-q1-0-1000-v1`, `CANONICAL_SPATIAL_OPERATION`, `ORTHOGONAL_CROSS_PLAN` — **1 chunk
each**, so the denominator demonstrably contains the fabric surface and the absence is not vacuous
(§P2.13). The leaves never entered the module graph at all, which is the strongest form the
dormancy result can take.

⚠ **ONE PROBE HAD TO BE WITHDRAWN, AND THE WITHDRAWAL IS THE POINT.** A first pass probed the bare
substring `CANONICAL_SPATIAL` and hit one chunk. It resolves to `CANONICAL_SPATIAL_OPERATION` in
the PRE-EXISTING landed `operations.js` — a substring collision, not a dormancy breach. A forensic
zoom whose probe is not verified unique reports the neighbours' code as the member's own.
