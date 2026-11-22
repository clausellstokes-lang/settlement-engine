# CT / CT-1a — MORPHOLOGY, ENGINE-KNOWN: the four blocks that say why the town has the shape it has

- **Status:** LANDED
- **Compile note:** compiled by lane TC-DOSSIER-2 as **CT-0** (the mapping, the register spec and
  the golden bill) with its companion corpus draft; chair-ratified at ODQ **§378** together with
  CT-0's own **§0 PIN-CORRECTION**, whose dual-pin readings govern every figure. BUILT AND VERIFIED
  by lane TE-CT1a. ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  anchors the status row at end-of-line; trailing prose there leaves the status unparsed and makes
  the manifest disagree with the Markdown.
- **Verified base:** `claude/composite-r4` at `47ea9c9bacd93f60eb9bf1a05ef4d26d86aabd17`
- **Design authority:** the content-train charter ODQ **§360 / §360.1 / §360.2 / §361**; the CT-0
  compile and its corpus draft; `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` §0a–§0h, which is the
  GOVERNED CORPUS this member extends and whose register it inherits whole.
- **Train:** `content`, family **CT**, car **1a**. CT-2 and CT-3 are separately compiled and are
  NOT authorised by this packet.
- **Constitutional law binding every line below:** THE PROMISE (a seed is a starting world; lived
  history is immutable) · FINITE-SEMANTICS (typed buckets; AI is clerk, never writer) · the
  product scope (world-only, never a named character's fate, setting-agnostic).

---

## §1 · WHAT THIS MEMBER IS

The dossier corpus is 58 blocks and ~2,150 variants of STANDING STATE — what the town's condition
IS — plus 78 causal join families. Measured at CT-0: **not one of them explains why the town has
its SHAPE.** Why there is a wall, or none. Why the market is the shape of the town's exchange at
all. Why the ground disposes the town the way it does. Why a founding record still governs what
stands. This car authors that ground, and only the part of it the ENGINE ACTUALLY KNOWS.

Four blocks, seventeen pools, forty-eight variants, appended to the governed annex and projected
into the desk leaves by the existing generator in the same commit:

1. **`DS-GEN-12` — the ground and the approaches.** `config.terrainType` read as a TOTAL partition
   of its live seven-value vocabulary into five terrain families.
2. **`DS-GEN-13` — the market and the roads.** Market-class institution presence × route access ×
   `isEntrepot`, spoken as orientation and custom, never as map geometry.
3. **`DS-GEN-14` — founded once, grown since.** The founding record × the age band: the accretion
   mechanism, record-gated by a typed row.
4. **`DS-DEF-11` — why the wall, and why not.** `defenseProfileHasWalls` × threat × tier × the
   generator's own economic-upkeep gate, whose asymmetry (stone keeps itself, wages do not) is an
   engine rule and not an authored flourish.

**Nothing else changes.** No generator edit (every prefix is already claimed by a desk). No new
test file and no new test suite. No flag, no persisted field, no rendered surface: the blocks land
**DARK**, which is CT-0 R-1 as confirmed at §378 — content first, composer wiring its own lane.

---

## §2 · THE FOUR LAWS (§360.1), AND WHERE EACH ONE BIT

1. **Clerk, never writer.** Every sentence is authored into the governed annex and read back
   through the one projection. No model writes at runtime.
2. **Only explain what the engine knows.** CT-0 judged twenty candidate claims; ten are BACKED
   today and this car lands four of them. The rest are recorded as SEAM, CT-1b, CT-4 or
   PERMANENTLY FORBIDDEN, and none of them is reached for here.
3. **Mechanisms travel; geography does not.** No compass word, no real-world place, no named
   analogy. "Stalls crowd the busiest gate", never "as in the bastides".
4. **The instruments bind.** ⭐ THIS IS THE LAW THAT BIT, AND IT BIT IN A PLACE CT-0 DID NOT
   PRICE. `tests/copy/voiceMechanics.test.js` Tier 2 scans `src/data/**` and `src/domain/**` for
   string literals and pins each file's em-dash and exclamation count EXACTLY — and the generated
   prose leaves are inside that scan. The four leaves' rows are RED-AND-BANKED at zero against a
   live 158 (general) and 74 (defense), so the pin's verdict could not move whatever this member
   did, and the deepening would have been invisible. **A block TITLE is projected verbatim into
   its leaf, and the house header style is `### DS-XXX-N — …`.** Four new blocks in house style
   would therefore have added four em dashes to the banked debt while every gate figure held
   still. The headers here use ` · ` instead, and the leaves' counts are measured unchanged in
   both directions: general 158 → 158, defense 74 → 74, bang 0 → 0, Tier-2 total 1438 → 1438.

---

## §3 · WHY, NEVER WHEN — the premise correction this member carries

§361.1 listed "wall years" among facts the engine holds today. **It holds no such fact.** CT-0
verified it by exhaustive grep at BOTH tips (`wallYear|wall_year|wallRing|circuitLadder`: zero hits
in src on the ledger branch AND on this build branch), re-judged it against the new
`src/domain/townMap/fabric/**` tree — massing and geometry substrate, no dated circuit facts — and
confirmed the dated ladder lives in the sealed map-sandbox ref, not in `composite-r4` src. Walls
are `defenseProfileHasWalls` plus wall-class institution rows, and nothing else.

So `DS-DEF-11` explains WHY the wall stands and why it does not, and says nothing whatever about
WHEN it was raised. Wall age is a CT-1b entry. The absence is deliberate and is recorded in the
block's own PROVENANCE line so no later writer re-finds it as a gap.

---

## §4 · THE ADDITIVE-NEW-BLOCK SHAPE, AND WHY IT IS LOAD-BEARING

`drawVariant` (`src/domain/display/stateProse/stateProseKernel.js`) selects
`eligible[avalanche32(fnv1a32(seed::blockId::poolKey)) % eligible.length]`. The modulus is the
POOL's length and the hash input names the pool. **Appending a variant to an existing pool moves
every seeded draw over that pool; adding a NEW block moves nothing at all.** Every pool below is
new. No existing pool is touched by a single byte, and the proof is measured rather than argued:

- **Key-by-key, before vs after:** `general` ADDED `[DS-GEN-12, DS-GEN-13, DS-GEN-14]`, REMOVED
  `[]`, CHANGED `[]`. `defense` ADDED `[DS-DEF-11]`, REMOVED `[]`, CHANGED `[]`.
- **Byte comparison:** `economy`, `power`, `stressors`, `warFaith` and `dossierCausalProse` came
  out of the regeneration **BYTE-IDENTICAL**.
- In the two leaves that did move, the **only removed line is the leaf's own header count
  comment**. Everything else is pure addition.
- The goldens were run BOTH WAYS over `tests/property` + `tests/dossier` + the four prose readers:
  104 files / 707 tests passed at the base and again after the change, and the two logs are
  identical once timing is stripped.

This is why the car carries **no §72.3 declared-shift capsule**: there is no same-seed movement to
declare.

---

## §5 · THE PINS THAT MOVE, AND WHY EACH ONE MOVES

`tests/data/dossierStateProseProjection.contract.test.js` only.

- **`allStateBlocks.length` 58 → 62.** The exact block-count pin, re-recorded with §378 cited at
  the assertion and the additive-block reasoning recorded beside it.
- **The state-variant floor 2153 → 2201** (CT-0 §5 R-5). The floor is re-pinned to the MEASURED
  total rather than left where it was. Leaving it was the lawful alternative on the bill and is
  refused for one reason: the slack between a stale floor and the real total is exactly where a
  later parser regression hides, and this pin is the only instrument in the tree that would notice
  a pool the grammar silently stopped consuming.
- **Nothing else.** The causal 78 / ≥468 / six-per-family pins, the thin-pool floor, the dm-only
  floor, the undeclared-slots ceiling and the no-markdown pin are all untouched and all still pass.
- **NO TITLE MOVES INTO OR OUT OF THE FAILURE CENSUS.** The block-count test's title carries its
  own figure and therefore changed with it; that test PASSES and is not among the eleven baselined
  entries, and the ratchet's "vanished" sentinel guards baselined rows only. The four
  `voiceMechanics` rows that ARE banked keep their identity, their file, their verdict and their
  numbers.

### Recorded corrections to CT-0's golden bill (measured at this base, not inherited)

- **Bill row 9 (`sizeBaseline`) is a NO-OP, not a re-derivation.** `scripts/.size-baseline.json` is
  a per-file **eslint `max-lines`** ceiling map, not a bundle-size ceiling, and no `max-lines` glob
  in `eslint.config.js` covers `src/data/**`. Independently: only `economy.generated.js` is
  imported from `src/`, so the leaves this member touches are in no bundle chunk at all.
- **CT-0 §4's "every draft pool ≥3" is false for this car** — five pools carry exactly two
  (`NO-MARKET`, `GROWN-UNRECORDED`, `WALLED-STRAINED`, `UNWALLED-SMALL`, `UNWALLED-LARGE`). The
  live pin is `pool.length < 2`, so all seventeen are lawful; the arithmetic claim was wrong, not
  the corpus.
- **CT-0 §4's receipt for the water-terrain pair pointed at the wrong file.** `WATER_TERRAIN` is
  minted in `src/domain/resourceTerrainCompatibility.js`, not `src/generators/terrainHelpers.js`.
  The annex cites the real home.

---

## §6 · WHAT THIS MEMBER DELIBERATELY DID NOT DO

- **No existing pool is amended** — including `DS-GEN-6` and `settlementOriginProse.js`, which
  render LIVE on the Overview tab. CT-0 prices that as a declared-shift, owner-signed class and
  recommends it out of car 1; this member honours that.
- **No Tier-B prose** (siteGenesis `siteKind`, `institutionAssignment` placements,
  `asymmetrySources` market placement). CT-0 R-2 is unruled; the drafts comply with option (i).
- **No category-affinity placement claim**, which would be untruthful until OB-5's declared-shift
  cure lands (42 craft/commerce entries are mis-keyed `government` at the tip).
- **No census row is claimed.** §0g's denominator is rendered SURFACES; these blocks add none, so
  coverage stays 77/77 and the new blocks are recorded as TARGETS, not owners, until a composer
  reads them. Listing an unread block as a surface's owner would assert a reach it does not have.
- **No new test file, no new suite, no `.each`, no `runIf`.**

---

## §7 · ACCEPTANCE

| # | Case |
|---|---|
| A1 | `gen:dossier-prose --check` verifies the projection is not stale: 62 state blocks / 2201 variants / 6 desks / 78 causal families / 468 variants. |
| A2 | The projection contract passes whole, including the re-recorded 62 and 2201. |
| A3 | The four new blocks are present in their desk leaves with the right pool counts: `general` 15 → 18 blocks and 540 → 576 variants, `defense` 10 → 11 and 371 → 383. |
| A4 | No existing block moved: five leaves byte-identical, and the two that moved show CHANGED `[]` under a key-by-key comparison. |
| A5 | The banked voice debt does not deepen: `general` em 158 → 158, `defense` em 74 → 74, both bang 0 → 0, Tier-2 total 1438 → 1438, JSX total 19 → 19. |
| A6 | Every variant carries zero digits, zero em dashes, zero exclamation points and no residual markdown; every slot used is declared; every angle is from §0b's palette. |
| A7 | The goldens are identical both ways over `tests/property` + `tests/dossier` + the four prose readers. |
| A8 | The annex edit introduces no new completeness claim: the live `CLAIM_RE` finds zero hits in the added text. |

---

## §8 · THE LANDING RECORD (lane TE-CT1a, measured at `47ea9c9b`)

Every figure below was produced by a command run in this lane's own worktree with the exit status
captured IN SHELL, and every log is self-named.

| Proof | Result |
|---|---|
| `npm run gen:dossier-prose` | `wrote 62 state blocks / 2201 variants across 6 desks, 78 causal families / 468 variants` · general 15→18 blocks, 540→576 variants · defense 10→11, 371→383 |
| `vitest run` the projection contract | PASSED whole, on the re-recorded 62 and 2201 |
| `vitest run` voiceMechanics, before vs after | the two logs differ by ONE millisecond timing line; general em 158→158, defense em 74→74, bang 0→0, Tier-2 total 1438→1438, JSX 19→19 |
| Key-by-key leaf comparison | general ADDED 3 / REMOVED 0 / CHANGED 0 · defense ADDED 1 / REMOVED 0 / CHANGED 0 |
| Byte comparison, the untouched leaves | economy · power · stressors · warFaith · dossierCausalProse all BYTE-IDENTICAL |
| Goldens both ways (`tests/property` + `tests/dossier` + four prose readers) | 104 files / 707 tests PASSED at the base and PASSED after; logs identical once timing is stripped; TRUE_EXIT=0 both |
| Register scan over all 48 variants | 0 digits · 0 em dashes · 0 en dashes · 0 exclamation points · 0 residual markdown · 0 undeclared slots · every angle lawful |
| Live `CLAIM_RE` over the annex, this packet and the index | 0 hits in each |
| `npm run validate:packets` | DRAFT `141 packets (0 READY)` → READY `141 packets (1 READY)` → LANDED, TRUE_EXIT=0 at each transition |

⚠ **THE ONE SWEEP DELTA, AND ITS ATTRIBUTION.** A 195-file sweep of `tests/lint` + `tests/docs` +
`tests/build` showed 12 failures at the pristine base and 14 after — but the two failure SETS
differ IN BOTH DIRECTIONS, which no causal change can produce. Five files were re-run in isolation
on both trees and returned an identical `5 files / 78 passed / 5 skipped / TRUE_EXIT=0` on each.
The delta is load flake from concurrent lanes on one machine, not this member. The banked
`warCostKindPools` (3), `warRulingKindPools` (1), `enforcement-claims` (1) and
`clampPrimitiveBaseline` (1) rows are unmoved in identity and verdict.

⚠ **HAZARD PAID ONCE, RECORDED SO THE NEXT CAR DOES NOT PAY IT.** The first goldens capture was
invoked with `--reporter=basic`, which this vitest does not carry. The run never started; the
background wrapper still reported "exit code 0"; only the in-shell `TRUE_EXIT=1` convicted it. The
lane law — trust no exit status you did not capture yourself — earned its keep on the first
command of the proof.
