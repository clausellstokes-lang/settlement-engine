# Site Coherence / SCW-0 — the enforcement layer (measuring instruments only)

- **Status:** READY
- **Status note:** ✅ **PROMOTED READY 2026-08-11 by the Fable chair (session `c42c8924`,
  Lane U), compiled from Lane R's read-only draft and the six rulings CR-SCW0-1..6 (§12).**
  Lane R held the packet at DRAFT for one mechanical reason — CD-2: the estate-wide lighting
  census walker was TC-5b-i's fifth reserved path, and a duplicate change path is a hard
  `validate:packets` failure at **step 3 of the 17-step chain**. ⭐ **That cause is DISCHARGED:
  TC-5b-i LANDED at `9183d52c`, and a LANDED packet reserves nothing**
  (`scripts/implementation-packets.mjs:43`). The census obligation is now sequenced by the
  chair's census-holder rule rather than blocked (see below and §7b).
- **Packet version:** `1`
- **Drafted by:** Lane R (read-only draft lane), 2026-08-11, Opus-era — see §12b.
  Compiled to packet standard and promoted by Lane U under the Fable chair, 2026-08-11.
- **Verified base:** `claude/composite-r4` at `33487c77b0d9290db157f08330840558e17902bf`
- **Base note:** CONFIRMED at `33487c77` — *"The observed-shape baseline shrinks by exactly the
  two rows the repair retired"*, the fully-green-gate commit. Lane R measured its recon at
  `63c62822`; five commits have landed since (`9183d52c`, `e7774ff2`, `da31d170`, `b0912f7f`,
  `33487c77`). ⛔ **The base is restamped here, and every figure Lane R quoted is re-derived at
  preflight rather than inherited** — in particular the lighting-census row, which `da31d170`
  re-recorded (§5b B2).
- **⚠ The tree is a LIVE SHARED WORKTREE.** At this promotion: **one porcelain entry,
  `MM scripts/.observed-shape-readers-baseline.json`**, stale-index residue of `33487c77`
  rather than foreign WIP. A sibling lane owns the OSR instrument files
  (`scripts/check-observed-shape-readers.mjs`, `scripts/lib/observed-shape-*`,
  `tests/lint/observedShapeReaders.walker.test.js`, and that baseline). ⛔ **All four are
  FORBIDDEN EDITS here anyway** (Wave 1 owns the baseline), so the collision is doubly closed.
- **Depends on:** ⭐ **NOTHING, as code.** Wave 0 touches **zero** `src/` files. TC-5b-i at
  `9183d52c` was a *reservation* dependency and it is discharged.
- **Blocks:** SCW-1 … SCW-9. Every later wave's exit criterion is a number this packet mints.
- **Collision group:** `site-coherence-instrumentation`. ⭐ Disjoint from
  `town-cartography-contract-and-compiler`, `map-tab-shell`, `treaty-ledger-and-breach` and the
  espionage lane — with exactly one shared artifact, the estate-wide lighting census (§7b).
- ⚠⚠ **CENSUS-HOLDER RULE (chair, 2026-08-11).** `GR-4a`, `ES-Da` and `TC-5b-ii` were promoted
  READY in the same documentation change, and all four fold the one estate-wide lighting
  census. **Only ONE of the four may have an implementer in flight at a time; the chair
  sequences.** ⛔ **GR-4a — not this packet — holds
  `tests/lint/sovereigntyLightingContract.walker.test.js` as a manifest reservation at
  promotion.** The chair MOVES that row into SCW-0's manifest, as a one-line edit, when it
  dispatches SCW-0. **Until it does, touching the walker is out of manifest and is a STOP**
  (§7b, §7c-4).
- **Commit authority:** to be stated by the chair in the dispatch message. Absent explicit
  authority, the coding agent leaves its changes unstaged and uncommitted.

> **THIS IS AN INSTRUMENT-ONLY PACKET.** It changes no production code, no generated output,
> no persisted shape and no user-visible behavior. Its whole deliverable is the ability to
> *measure* Waves 1–9. `PACKET_STANDARD.md`'s production-line budget is therefore not the
> binding constraint; the **enforcer-registration surface** is (§7c).

---

## -1. WHY AN INSTRUMENT PACKET COMES FIRST, AND WHAT IT MAY NOT DO

`SITE_COHERENCE_PLAN.md:208` states the sequencing ground and it survives verification: every
later wave's exit criterion is a *number*, and there is no instrument in the repo today. The
audit measured its baseline with throwaway probes under `/tmp/sca-probes/`; that evidence dies
with the session unless it is banked.

**The hard line this packet must not cross — INVENTORY FREEZING, NEVER CORRECTNESS
ASSERTION.** `SITE_COHERENCE_PLAN.md:72` and `:212` are binding: an assertion written before
the behavior is right is an assertion written to the wrong shape, and this estate's
pin-vacuity family is populated entirely by pins authored ahead of their subject. **Wave 0
freezes what IS. Wave 8 asserts what OUGHT TO BE.** A Wave-0 test that says *"a desert town
must not have a river"* is out of scope and is a **STOP**.

Three properties the instrument must satisfy, each verified against live code:

1. **Identity-keyed, never count-keyed.** Rows keyed `(terrain, siteKind, decisive-token)`
   (`SITE_COHERENCE_PLAN.md:58`). A count-keyed ratchet passes an identity swap — the exact
   soft spot `HZ-READERNOWRITER` records, cured for the observed-shape walker at `53029151`.
2. **Only-shrinks, both directions asserted.** A new key is a violation; a **fallen** count is
   also a violation until banked. Estate precedent:
   `tests/lint/negativeAssertionAnchor.walker.test.js:773`, whose inventory-honesty arm reds
   when a frozen row shrinks — precisely so a win is banked rather than absorbed.
3. **Liveness, not correctness, for the coverage half.** The coverage census asserts only that
   every alternative in every export-matching predicate is exercised by ≥1 string in the live
   generated vocabulary. It says nothing about whether the match is *right*.

---

## 0. What is already true at the verified base

Measured by Lane R at `63c62822`, read-only; re-verified at `33487c77` by Lane U.

| Fact | Evidence |
|---|---|
| None of the three deliverable files exists | `test ! -e` on `tests/lint/siteCoherenceRatchet.test.js`, `tests/lint/exportTokenCoverage.test.js`, `tests/lint/.site-coherence-baseline.json` — **all ABSENT at `33487c77`** (CONFIRMED) |
| `src/domain/townMap/siteGenesis.js` and `asymmetrySources.js` exist and are **clean** | `git status --porcelain` names neither (CONFIRMED) |
| `HZ-SITECOHERENCE` does not exist | 27 ids enumerated in `scripts/hazard-registry.json`; not among them (CONFIRMED) |
| `HZ-READERNOWRITER.instances` is `3` | `scripts/hazard-registry.json:317` (CONFIRMED) |
| No packet at any status reserves any Wave-0 path | replay of the validator's reservation rule over `docs/implementation/PACKET_MANIFEST.json`; `scripts/hazard-registry.json` is a `MODIFY` row of **IA-1 [LANDED]**, and terminal packets write nothing into `changePathOwners` (`implementation-packets.mjs:430`), so it is free (CONFIRMED) |
| `docs/SITE_COHERENCE_PLAN.md` is fully owner-signed with zero open gates for Waves 0–8 | plan `:11-27` (sign-off #1, ITEM B) and `:15-17` + `:222` (sign-off #2, Wave 9; `B4` CLEARED). **Wave 0 is instrumentation and was never gated** (CONFIRMED by read) |
| The program is 0-of-9 landed | plan `:4-5`; `git log -- docs/SITE_COHERENCE_PLAN.md` shows three commits, all documentation (CONFIRMED) |
| Wave 0 is explicitly **unaffected** by the 2026-08-11 Wave-1 literal correction | plan `:97`. ⚠ CR-SCW0-6 **partially refutes** the second half of that sentence; the *unaffected-by-Wave-1* half is CONFIRMED |

---

## 1. Reconciled authority

Applied in `PACKET_STANDARD.md`'s order.

1. **Live git state decides what exists.** Where `SITE_COHERENCE_PLAN.md` or
   `SITE_COHERENCE_AUDIT.md` disagrees with code, **the code wins and §5c names the
   disagreement.** Five such disagreements were measured; all five are recorded.
2. **The owner's ITEM-B sign-off** (plan `:11-14`) covers Waves 3–5. **Wave 0 mints instruments
   only and needs no product signature. NO OWNER GATE APPLIES TO THIS PACKET.**
3. **The chair's rulings CR-SCW0-1..6 (§12) are BINDING** and close every open item Lane R
   raised.
4. **`PACKET_STANDARD.md` governs.** One behavior family (mint the instruments), zero
   integration paths (there is no production consumer), one prevention guard (the ratchet
   itself is the guard).
5. **THE SERIALIZATION LAW** at the tail of `docs/FABLE_VALIDATION_QUEUE.md:7523-7537` is
   BINDING, all five rules.
6. **THE HAZARD-CONVERSION LAW** is BINDING: `HZ-SITECOHERENCE` arrives as `MACHINERY` or not
   at all. **`PARTIAL` is the status that hides**, and the DOCUMENT/OWED ratchets in
   `scripts/check-hazard-registry.mjs:346-364` refuse a new undefended class by construction.
7. **`SOL_QUEUE.md` and the plan document never prove work is open** — here they need not: the
   three deliverable files are provably absent from disk and from `git ls-files`.

The implementer does not reopen these by rereading design prose.

---

## 2. Outcome and non-goals

**Definition of done:** a later wave can state its effect as a *number* the repository itself
re-derives and refuses to let drift. Concretely — the `(terrain, siteKind, decisive-token)`
contradiction inventory is frozen and only-shrinking; every alternative in every
export-matching predicate is either exercised by the live vocabulary or explicitly quarantined
with a written reason in a non-growing list; and the hazard registry tells the truth about both
`HZ-READERNOWRITER` and the new class.

**In scope — exactly five reserved artifacts plus one sequenced census obligation:**

1. `tests/lint/siteCoherenceRatchet.test.js` — the identity-keyed contradiction inventory.
2. `tests/lint/.site-coherence-baseline.json` — its frozen row set (home RULED at CR-SCW0-3).
3. `tests/lint/exportTokenCoverage.test.js` — the predicate-liveness census + `KNOWN_INERT`.
4. `scripts/hazard-registry.json` — `C1`'s repair plus the new `HZ-SITECOHERENCE` class.
5. `scripts/mutation-coverage-manifest.json` — the two rows both new files **require**.
6. ⏸ `tests/lint/sovereigntyLightingContract.walker.test.js` — the in-change census re-record.
   **A real obligation, reserved by GR-4a at promotion and moved here by the chair at
   dispatch** (§7b).

**Explicit non-goals — each is another wave or another authority:**

- ⛔ **Any correctness assertion.** No test here may claim a site derivation is *wrong*. That
  is Wave 8 (`SITE_COHERENCE_PLAN.md:180-194`) and it is deliberately last.
- **Waves 1–9 in their entirety**, itemised so no implementer drifts:
  - **Wave 1** — the observed-shape baseline hand-edit. ⛔
    `scripts/.observed-shape-readers-baseline.json` is a **forbidden edit** here, and Wave 1's
    plan text carries a live DO-NOT-APPLY correction (plan `:95-96`).
  - **Wave 2** — `src/domain/townMap/exportSemantics.js` and the single-writer scan. This
    packet creates **no** production module and moves **no** token out of its current home.
  - **Wave 3** — the biome-contradiction guard in `siteGenesis.js`.
  - **Wave 4** — word boundaries, the negative list, dead-token retirement. ⛔ This packet
    **quarantines** inert tokens; it deletes none. Emptying `KNOWN_INERT` is Wave 4's job.
  - **Wave 5** — `asymmetrySources.js` rules and the structured `cause`.
  - **Wave 6** — `substrateSignatureOf` and the persisted substrate.
  - **Wave 7** — the two scene readers, `FIXTURE_SITES`, the annotation-orphan report.
  - **Wave 8** — the correctness pins and the new golden manifest.
  - **Wave 9** — `resourceData.js` terrain gating (owner-signed; still not this packet).
- ⛔ **Any production edit of any kind.** `src/**` is untouched. This is **asserted**, not
  assumed — C8's anchored source check and §14.
- ⛔ **Any golden, dormancy fixture, or manifest re-mint.** Expected churn is **zero**.
- ⛔ **Any baseline, budget, timeout or ceiling raise**, including the global `testTimeout`.
- **Owner-queue rows #2 (Option D), #3 (the `coast` arm), #4 (`bankable` is refused at the
  gate) and
  #5 (Wave 6's signature extension).** None is touched, opened, or pre-empted.

---

## 3. Hard scope budget

| Limit | Packet budget | Default | Note |
|---|---:|---:|---|
| Behavior families | `1` | `1` | mint the measuring instruments |
| New persisted record families / writers | `0 / 0` | `1 / —` | the baseline is a test fixture, not app state |
| Feature flags / user-facing surfaces | `0 / 0` | `1 / 1` | |
| Direct production consumers | `0` | `2` | there is no production consumer and there must not be |
| New logic-bearing production leaves | `0` | `2` | |
| Existing logic-bearing production files modified | `0` | `3` | ⭐ **zero `src/` files** |
| Registration-only production files touched | `2` | `3` | `scripts/hazard-registry.json`, `scripts/mutation-coverage-manifest.json` |
| Handwritten files total | `6` | `12` | §7 — five reserved plus the sequenced census row |
| Effective **production**-line delta | `0` | `400` | ⭐ nothing under `src/` moves |
| Acceptance cases | `8` | `8` | **at cap** |

**MEASURED layer ceilings.** CONFIRMED by read of `eslint.config.js`: the `max-lines` blocks at
`:500-596` scope to `src/**` globs only, plus the generator and domain blocks. **No layer
`max-lines` rule matches `tests/**`** — the two `tests/**` blocks at `:75` and `:730` carry
other rules. The only other `max-lines` source is the per-file override generated from
`scripts/.size-baseline.json` (`eslint.config.js:51`), which holds **15 keys, none under
`tests/`**. ⇒ Neither new test file has a line ceiling, and ⛔ **`scripts/.size-baseline.json`
must not gain an entry** — `tests/lint/sizeBaseline.test.js` asserts **exact set equality**
between the baseline's keys and the set of files strictly over their layer ceiling, so a
compliant file's entry REDS the gate.

⚠ **The binding budget here is not lines; it is the enforcer-registration surface.** Two new
files under `tests/lint/` incur **five** separate registration obligations (§7c). That is the
real cost of this packet and it is why it is sized the way it is.

---

## 4. Verified tree contract

| Role | File | Symbol | Required fact/use |
|---|---|---|---|
| **The site deriver (the subject)** | `src/domain/townMap/siteGenesis.js` | `generateSite(arg)` `:206` | CONFIRMED it takes ONE destructured bag `{ terrain, tradeAccess, isCoast, isRiver, exports, realmBiome, seed }` (`:201-205`) and **returns an OBJECT** `{ water, waterAnchor, kind, hasWater, prov, landform }` (`:262`). ⚠ **The site kind is the `.kind` FIELD**, typed `coast\|river\|marsh\|dunes\|mountain-flank\|plain` at `:75`. ⚠ `tradeAccess` is in the JSDoc but **not destructured** at `:207` — dead in this function. ⛔ **Forbidden edit.** |
| **The four export predicates** | same file | `WATER_ECONOMY_RE` `:48`; `/reed\|peat/i` `:239`; `/ore\|iron\|stone\|mine\|silver\|gold\|coal/i` `:247`; `/salt/i` `:250` | CONFIRMED **all four**. The coverage census DERIVES from this file's source text (§6.2). ⛔ **Forbidden edit.** |
| **The biome predicates** | same file | `DRY_BIOME_RE` `:50`, `WET_BIOME_RE` `:52` | CONFIRMED. `biome` is lowercased at `:208`, which is why the inline regexes at `:230/:238/:239/:247` correctly omit `/i` (audit S4). ⛔ **Forbidden edit.** |
| **The arm chain (the classifier's subject)** | same file | `:230-253`, first-match `if / else if` | CONFIRMED order: `coast` `:230` → `river`/`marsh` `:238` → `mountain-flank` `:247` → `dunes` `:250` → fallthrough `plain` `:228`. ⭐ **The decisive-token key depends on this order** — first match wins, so a token is decisive only when no earlier arm fired. ⛔ **Forbidden edit.** |
| **The second token home** | `src/domain/townMap/asymmetrySources.js` | `EXPORT_RULES` `:67-76` | CONFIRMED 8 frozen rules, first-match via `.find` at `:113`. ⚠ `.test(ex)` on the raw element with **no `String()` coercion**, unlike `siteGenesis`. ⛔ **Forbidden edit.** |
| **The export accessor** | `src/domain/canonicalAccessors.js` | `canonExports(settlement)` `:54` | CONFIRMED: `Array.isArray(ec.primaryExports)` wins outright, so an authored empty `primaryExports: []` **shadows** a populated legacy `exports`. Companion `canonExportsPresent` `:75`. ⛔ **Forbidden edit.** |
| **⭐ The corpus producer** | `src/generators/generateSettlementPipeline.js` | `generateSettlementPipeline(config, importedNeighbour, options)` `:74` | ⚠⚠ **TWO THROWING GUARDS:** `:78-96` throws if slot 2 carries a generation option; `:107-119` throws if `config` carries `seed`. **The seed goes in slot 3.** The live call shape to copy is `tests/property/generatorGoldenMaster.test.js:238` — `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`. ⛔ **Forbidden edit.** |
| **The corpus vocabulary** | `src/data/cultureProfiles.js` | `CULTURE_PROFILES` `:50`, `CULTURE_PROFILE_KEYS` `:525` | CONFIRMED **exactly 11 keys** — matches the plan. ⛔ **Forbidden edit.** |
| | `src/data/constants.js` | `TIER_ORDER` `:3` | CONFIRMED **6** settTypes. ⛔ **Forbidden edit.** |
| | `src/generators/steps/resolveConfig.js` | `TERRAIN_WEIGHTS` `:24-27` | CONFIRMED **7** real terrains (`auto` is a roll, not a terrain, `:107`). ⛔ **Forbidden edit.** |
| **The wiring proof** | `src/domain/townMap/townLayoutV2.js` | `:283`, `:320` | CONFIRMED `canonExports(s)` → `generateSite({… exports: exportsList …})`. This is TCD-4's change and the whole trigger for the program. ⛔ **Forbidden edit.** |
| **The class registry** | `scripts/hazard-registry.json` | `HZ-READERNOWRITER` `:289-326` | CONFIRMED the 10-key schema: `id`, `title`, `status`, `acceptedReason`, `memory`, `enforcer`, `instances`, `instanceEvidence`, `triggers`, `upgradePath`. ⚠ **There is no `enforcedBy` key** — the field is `enforcer: { paths, inChain, note }`. **MODIFY target.** |
| **Its validator** | `scripts/check-hazard-registry.mjs` | `pathInChain` `:227`; arm D `:306-313`; arm F `:330-343` | ⭐ CONFIRMED **`inChain` is DERIVED, never trusted** — and any `tests/**` path derives `true` because `check-test-ratchet.mjs` is a `FULL_SUITE_MARKERS` entry (`:209-211`). Enforcer paths must **exist** at every status. **Run, never edit.** |
| **The census walker** | `tests/lint/sovereigntyLightingContract.walker.test.js` | `CENSUS`; the five arms | CONFIRMED all five are `.toBe()` exact equality, plus an anti-vacuity arm and a `parked + credited === files` cross-check. CONFIRMED `TEST_FILES` filters `/\.test\.(js\|jsx)$/` — **a JSON fixture under `tests/` moves nothing.** ⏸ **SEQUENCED TEST target — §7b.** |
| **The mutation-coverage rule** | `tests/lint/mutationCoverage.shared.mjs` | `ENFORCER_DIRS` `:27-35`, `NAME_PATTERN` `:38-39`, the filter `:59-63` | CONFIRMED both new files match **both** arms. **Run, never edit.** |
| | `scripts/mutation-coverage-manifest.json` | 536 invariant rows, `uncoveredBaseline: 198` | **MODIFY target** (two rows). ⛔ **Never re-serialize the whole file — splice raw text.** |
| **The anti-vacuity walker** | `tests/lint/contractTestAntiVacuity.walker.test.js` | Rules 1a/1b/2, scope incl. `tests/lint/*.test.js` | ⚠⚠ **BOTH new files are in its scope.** Rule 2 is the live hazard for the coverage census (§7c-3). **Run, never edit.** |
| **The anchored-negative walker** | `tests/lint/negativeAssertionAnchor.walker.test.js` | `BARE_NEGATIVE_RE` `:72-73`, `ceilingFor` `:728`, the inventory-honesty arm `:773` | CONFIRMED the three counted matchers are `.not.toContain(`, `.not.toMatch(`, `.not.toHaveProperty(`; the `// anchored:` escape is accepted on the assertion line **or the single line immediately above** — no wider window. **Run, never edit** (but `:738-750` is the UPDATE idiom to copy — §6.1). |
| **The negative helpers** | `tests/helpers/anchoredNegatives.js` | `expectPresentThenAbsent` `:80`, `expectAbsentWithAnchor` `:111` | Exactly two exports. Every negative in both new suites goes through one of these or an `// anchored:` line. |
| **The throwing source extractor** | `tests/helpers/sourceContract.js` | — | ⭐ **Mandatory route for the coverage census's source reads** — it THROWS on absence, which is what defeats anti-vacuity Rule 1b (§6.2). |
| **The fixture-corpus precedent** | `tests/fixtures/distribution-envelopes.manifest.json` | read at `tests/lint/distributionEnvelopePower.test.js:98-102` | The live "committed corpus artifact read with plain `readFileSync`" shape, **if and only if** CR-SCW0-5's probe forces the fallback. ⚠ Note `distributionEnvelopePower.test.js:499-504`: the manifest **started empty** and the validator was proven on known values so it stays exercised however the manifest fills. Copy that discipline. |
| **Vitest configuration** | `vite.config.js` | the `test:` block `:783-855` | ⚠ **`vitest.config.js` does not exist.** CONFIRMED `testTimeout: 20000` `:801`, `environment: 'node'` `:787`, no per-directory overrides. ⛔ **Forbidden edit.** |

**Forbidden edits:** everything above marked forbidden, plus **all of `src/**` without
exception**, `scripts/.observed-shape-readers-baseline.json`, `scripts/.size-baseline.json`,
`scripts/.test-ratchet-baseline.json`, `scripts/mutation-sweep.sh`, every file under
`tests/fixtures/`, `eslint.config.js`, `vite.config.js`, `package.json`, and every file
outside §7.

---

## 5. Preflight

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor 33487c77 HEAD              # this packet's verified base

# ⛔ THE CENSUS-HOLDER GATE. The chair must have MOVED the walker row into SCW-0's
#    PACKET_MANIFEST.json entry before dispatch; GR-4a holds it at promotion.
grep -n 'sovereigntyLightingContract' -B40 docs/implementation/PACKET_MANIFEST.json | grep -n '"id"'
git status --porcelain tests/lint/sovereigntyLightingContract.walker.test.js   # expect EMPTY

# Substrate untouched since the verified base.
git log --oneline 33487c77..HEAD -- \
  src/domain/townMap/ src/domain/canonicalAccessors.js src/generators/ \
  src/data/resourceData.js src/data/cultureProfiles.js src/data/constants.js \
  scripts/hazard-registry.json scripts/mutation-coverage-manifest.json \
  tests/lint/sovereigntyLightingContract.walker.test.js
#   ⚠ NOT expected empty as a rule — re-read §5c item 1 if it names a generation commit.

# New files absent.
test ! -e tests/lint/siteCoherenceRatchet.test.js
test ! -e tests/lint/exportTokenCoverage.test.js
test ! -e tests/lint/.site-coherence-baseline.json

# MODIFY targets clean.
git status --porcelain scripts/hazard-registry.json scripts/mutation-coverage-manifest.json
#   expect EMPTY for both.

# Live symbols this packet consumes.
rg -n 'export function generateSite' src/domain/townMap/siteGenesis.js
rg -n 'WATER_ECONOMY_RE|DRY_BIOME_RE|WET_BIOME_RE' src/domain/townMap/siteGenesis.js
rg -n 'EXPORT_RULES' src/domain/townMap/asymmetrySources.js
rg -n 'export function canonExports' src/domain/canonicalAccessors.js
rg -n 'export function generateSettlementPipeline' src/generators/generateSettlementPipeline.js
rg -n 'CULTURE_PROFILE_KEYS|export const CULTURE_PROFILES' src/data/cultureProfiles.js
rg -n 'export const TIER_ORDER' src/data/constants.js
rg -n 'TERRAIN_WEIGHTS' src/generators/steps/resolveConfig.js
rg -n 'expectAbsentWithAnchor|expectPresentThenAbsent' tests/helpers/anchoredNegatives.js
rg -n '"HZ-READERNOWRITER"' scripts/hazard-registry.json
```

⚠ **The base named above is the base LANE U pinned.** HEAD is shared and moves. The implementer
re-runs every line of this preflight at dispatch and treats **its own output** as authority over
any figure written into this document. Any target collision or material symbol drift makes this
packet `STALE`.

### 5b. Baselines

⚠ Lane R executed **no** test, build, or gate command (read-only draft lane; the gate mutex was
not its to take). Rows are **AUTHOR-TIME-UNMEASURED** unless marked MEASURED.

| # | Premise | Exact command | Expected / recorded |
|---|---|---|---|
| B1 | Pre-existing gate reds at a committed base | `sh scripts/gate-mutex.sh --run -- npm run check:tail`, capturing `$?` yourself | **UNMEASURED.** ⛔ Do not inherit any lane's attribution. **Trust no exit status you did not capture** — the wrapper's code has greenwashed a red gate twice |
| B2 | ⭐ Lighting census row | read `tests/lint/sovereigntyLightingContract.walker.test.js` at a **committed** sha | ⭐ **RESTAMPED AT THIS PROMOTION. MEASURED BY READ at the verified base `33487c77`, line `:3731`: `files: 2397, parked: 365, credited: 2032, titles: 19763, suiteTitles: 5578`.** ⚠ Lane R's row (`2395/365/2030/19732/5568` at `63c62822`) is DEAD — `9183d52c` and `da31d170` both moved it. ⛔ A named-committed-sha snapshot per SERIALIZATION LAW rule 4; **re-derive from the FILE at preflight, never fold onto this row** |
| B3 | Test-ratchet headroom | read `scripts/.test-ratchet-baseline.json` + `tests/lint/testRatchet.test.js:177` | **MEASURED BY READ: `entries` = 17 against `const CEILING = 17` — ZERO headroom.** Wave 0 must land with **no** new baselined failure; there is no room to bank one |
| B4 | Anchored-negative ceiling | `tests/lint/negativeAssertionAnchor.walker.test.js:728` | **MEASURED BY READ:** `ceilingFor` falls through both maps to `0`. Both new files start at **ZERO** |
| B5 | Mutation-coverage totality | `scripts/mutation-coverage-manifest.json` | **MEASURED BY READ:** 536 invariant rows, `uncoveredBaseline: 198` pinned at **exact** equality. Both new files are enumerated by `tests/lint/mutationCoverage.shared.mjs:59-63` and **require** rows |
| B6 | Hazard-registry ratchets | `scripts/hazard-registry.json:57` + `check-hazard-registry.mjs:139`, `:346-364` | **MEASURED BY READ:** `classFloor: 27` and `machineryFloor` are **floors, not exact pins** — a 28th MACHINERY class does not red them. `documentBaseline` / `owedBaseline` are shrink-only and are not touched |
| B7 | ⭐⭐ **THE CORPUS-COST PROBE — MANDATORY PREFLIGHT, WITH A STOP** | see §6.5 | **UNMEASURED — the implementer produces this number before writing the ratchet.** Threshold **RULED at CR-SCW0-5: `120_000 ms`** |
| B8 | Typecheck posture | `npm run typecheck:ratchet` then `npm run typecheck:domain:strict` | **UNMEASURED** — exit 0 both, named separately with their windows (two-typechecker receipt law). Both ratchets sit at exact floors; an unbaselined new file's error allowance is **ZERO** |

### 5c. ⚠ CORRECTIONS — the plan and audit disagree with live code in five places

The code wins in every one. These are Lane R measurements at `63c62822`; **do not re-discover
them, and do not "fix" the plan document from inside this packet.**

1. ⛔⛔ **THE AUDIT'S EXIT FIGURES ARE STALE-AT-HEAD AND MUST NOT BE FROZEN AS A TARGET.**
   `SITE_COHERENCE_PLAN.md:81` makes it an exit criterion that the minted baseline's totals
   *"reproduce the audit's measured baseline **exactly**: `water-on-dry 80`, `marsh-on-dry 33`,
   `flank-on-flat 23`, `dunes-on-wet 0`, `any-contradiction 103`"*. Those were measured at HEAD
   **`2c1ec70f`** (audit header, CONFIRMED). **CONFIRMED five commits touching
   `src/generators/`, `src/domain/townMap/`, `src/domain/canonicalAccessors.js` or
   `src/data/resourceData.js` have landed since** — `aed0fc0e`, `0f85ced0`, `1c295eca`,
   `0f7424f7`, `93e7ed50` — and `0f85ced0` is titled *"Ports generate and faction officers
   link: the owner-approved same-seed correction"* and **declares a same-seed output change.**
   Whether the 462-corpus site figures moved is **UNMEASURED**. ⇒ **CR-SCW0-6 changes the
   criterion to RE-DERIVE-AND-REPORT-AGAINST.** A packet whose exit criterion is a five-day-old
   probe figure is a packet that stops on a false premise.
2. ⭐ **THERE IS A FOURTH EXPORT-TOKEN PREDICATE, AND THE PLAN'S LIST MISSES IT.**
   `SITE_COHERENCE_PLAN.md:115` names the sites as `siteGenesis.js:48,247,250`. **CONFIRMED
   there are FOUR:** `:48` `WATER_ECONOMY_RE`, `:239` `/reed|peat/i` tested against
   `exports.join(' ')`, `:247` `/ore|iron|stone|mine|silver|gold|coal/i`, `:250` `/salt/i`.
   `:239` decides `marsh` versus `river` inside arm 2 and is **materially decisive.**
   ⛔ **Consequence:** `exportTokenCoverage.test.js` must **DERIVE** the predicate set from
   source, never transcribe the plan's list of three — and §7c-3 makes that mandatory for a
   second, independent reason.
3. **"The mountain-flank and dunes arms have no biome check at all" (plan `:124`) is REFUTED as
   worded.** CONFIRMED both arms open with a biome regex as their **first disjunct** (`:247`
   `/mountain|hill|crag|peak|highland/.test(biome) || (…exports…)`; `:250`
   `dryBiome || (…exports…)`). The accurate statement: the biome check is an `||` **alternative**
   rather than an `&&` **guard**, so the export leg is ungated. Wave 3's *deliverable* text at
   `:127` already describes the right fix; only the Purpose sentence is wrong.
4. ⚠ **THE PLAN'S FIXTURE-DUMP FALLBACK CITES A RETIRED PATTERN.** `SITE_COHERENCE_PLAN.md:83`
   offers to *"dump the corpus once to a fixture and read it (the pattern `OSR_CORPUS` already
   uses)"*. **CONFIRMED `OSR_CORPUS` IS RETIRED** —
   `scripts/check-observed-shape-readers.mjs:985-986` throws *"OSR_CORPUS is retired for
   authoritative scans…"*, pinned at `tests/lint/observedShapeSentinel.test.js:1041`. The
   surviving `--corpus-artifact` flag is restricted to `--scan-only` and **forbidden** in
   authoritative mode (`:1476-1477`, `:1491-1492`). ⭐ **The live pattern to copy instead is
   `tests/fixtures/distribution-envelopes.manifest.json`** — committed, read by five suites
   with plain `readFileSync` + `JSON.parse`, no builder script.
5. **THE GATE CHAIN IS 17 STEPS, NOT 16, AND `check:quick` IS NOT `lint && test`.**
   `SITE_COHERENCE_PLAN.md:46-47` describes `check` as a 16-step chain omitting
   `validate:packets`, and `check:quick` as `lint && test`. **CONFIRMED from `package.json`:**
   `check` is 17 steps and its **third** is `validate:packets`; `check:quick` is
   `node scripts/implementation-gate.mjs quick`. ⛔ **The `validate:packets` position is
   load-bearing** — a duplicate-path error there blacks out all fourteen later steps, which is
   exactly why the census walker is sequenced rather than duplicated (§7b).

---

## 6. Exact contracts

### 6.1 The contradiction ratchet — `tests/lint/siteCoherenceRatchet.test.js`

**Corpus, fixed for the whole program** (`SITE_COHERENCE_PLAN.md:56`; arithmetic CONFIRMED):

- Arm A: `6 settTypes × 7 terrainOverride × 5 seeds` at `tradeRouteAccess: 'road'` = **210**
- Arm B: `6 settTypes × 7 terrainOverride × 6 route values × 1 seed` = **252**
- Total **462**, culture rotated over all 11 `CULTURE_PROFILE_KEYS`, `customContent: {}`.

⚠ The "6 route values" **excludes `random_trade`** (a roll, not a value) from the seven the
panel offers (`ConfigurationPanel.jsx:309-315`). ⛔ **The implementer pins the exact route list
and the exact seed-naming scheme as FROZEN LITERALS in the test file**, because they are part
of the inventory's identity: a corpus that drifts silently makes every later wave's number
incomparable. Generation must be deterministic and headless — `customContent: {}` is the
documented knob (`generateSettlementPipeline.js:60-62`).

**The row identity, exactly: `(terrain, siteKind, decisiveToken)`.**

- `terrain` — the `terrainOverride` the config was generated with (a frozen literal, **not** a
  re-read of the settlement).
- `siteKind` — `generateSite(...).kind`. ⛔ **Not the return value itself** — `generateSite`
  returns an object (§4).
- `decisiveToken` — the **first-match** token that produced this kind, or the sentinel
  `'(biome)'` when the arm fired on its biome disjunct and no export was decisive. Determined by
  re-running the arm chain's own order (§4); **a token is decisive only when no earlier arm
  fired AND removing it would change `kind`.**

**The frozen file's shape** — a single JSON object, key-sorted for a stable diff:

```json
{
  "_doc": "…what this is, how to shrink it, and what a NEW key means…",
  "frozenAt": "<40-hex committed sha>",
  "corpusMeta": { "settlements": 462, "settTypes": 6, "terrains": 7, "routes": 6, "cultures": 11 },
  "rows": { "<terrain>|<siteKind>|<decisiveToken>": <positive integer count> },
  "totals": { "waterOnDry": 0, "marshOnDry": 0, "flankOnFlat": 0, "dunesOnWet": 0, "anyContradiction": 0 }
}
```

**The assertions, exactly — and note the polarity of each:**

1. **NEW KEY ⇒ VIOLATION.** Any key present in the live scan and absent from `rows` reds,
   naming the key and its count.
2. **GROWN COUNT ⇒ VIOLATION.** `live[k] > rows[k]` reds.
3. **SHRUNK COUNT ⇒ VIOLATION, WITH A BANK INSTRUCTION.** `live[k] < rows[k]` reds and says
   *lower the row in the same change that earned the shrink*. ⭐ **This is the arm that makes
   the ratchet an instrument rather than a ceiling** — `negativeAssertionAnchor.walker.test.js:773`'s
   inventory-honesty shape, and it is why a later wave's win is provable.
4. **VANISHED KEY ⇒ VIOLATION** until removed from `rows`.
5. **ANTI-VACUITY.** `Object.keys(rows).length` is asserted `> 0` **and** the corpus size is
   asserted `=== 462` with `0` generation errors. A corpus that silently produced nothing must
   RED, not pass.
6. ⛔ **NO CORRECTNESS ARM.** The test may not assert that any particular `(terrain, siteKind)`
   pair is wrong. §-1.

**`UPDATE` semantics.** Regeneration is **print-only, never write**, gated behind an env flag,
and it **always exits non-zero on purpose** so it can never be mistaken for a pass — the exact
shape at `negativeAssertionAnchor.walker.test.js:738-750`. ⛔ **A silent `--write` that
re-baselines from whatever the tree produced at that instant is the `M13`/`M16` failure mode
this estate has already been bitten by. Do not build it.**

**Purity.** No clock, no randomness beyond the pinned seeds, no network, no module-scope mutable
state, no persistence.

### 6.2 The predicate-liveness census — `tests/lint/exportTokenCoverage.test.js`

**What it asserts:** every alternative in every export-matching predicate is exercised by ≥1
string in the live generated vocabulary, **or** is listed in `KNOWN_INERT` with a written
reason. **Liveness only — never correctness.**

⛔⛔ **THE ALTERNATIVE SET IS DERIVED FROM SOURCE, NEVER TRANSCRIBED.** Two independent live
guards force this and either alone is decisive:

- **`contractTestAntiVacuity.walker.test.js` Rule 2** scopes `tests/lint/*.test.js` and reds an
  exhaustive-claim test that iterates a **local pure literal** in a file that derives nothing
  from source. A hardcoded token list in a test titled *"every alternative …"* is exactly that
  shape.
- **§5c item 2** — the plan's own list of predicate sites is missing `siteGenesis.js:239`. A
  transcribed list would be **silently incomplete on the day it landed.**

So the census reads `src/domain/townMap/siteGenesis.js` and
`src/domain/townMap/asymmetrySources.js` **as text**, extracts the export-token regexes, splits
each on `|`, and takes that as the denominator. ⚠ **Route the extraction through
`tests/helpers/sourceContract.js`, which THROWS on absence** — anti-vacuity Rule 1b reds an
extractor result used in a negative matcher with no non-empty guard, and a silent extractor
returning `''` after a rename would make this whole census vacuously green. **Assert the
extract non-empty BEFORE any `.not.` matcher.**

**The numerator** is the live generated vocabulary: the distinct export strings the 462-corpus
produces. The audit measured **158** distinct strings at `2c1ec70f`
(`SITE_COHERENCE_AUDIT.md:33`); ⚠ that figure is PLAUSIBLE-at-`2c1ec70f`, **UNMEASURED at this
HEAD** (§5c item 1), and is **not pinned by this packet** — it is reported, and only the
derived-versus-live relation is asserted.

**`KNOWN_INERT`** — a frozen object mapping `"<predicate site>|<alternative>"` to a written
reason string of substance. Pinned **non-growing** (a new inert alternative reds) **and**
membership-checked against the derived set (an entry naming an alternative the source no longer
spells reds), so Wave 4's deletions cannot leave the quarantine lying. The plan
(`SITE_COHERENCE_PLAN.md:77`) expects it to open containing `/pearl/`, `/whal/`, `/ferry/`,
`/barge/`, `/silver/`, `/gold/` and the shadowed `/salt/` dunes leg — **CONFIRMED all seven
exist in source**; ⚠ their *inertness* was measured at `2c1ec70f` and is **re-derived here, not
inherited**. ⛔ **Emptying the quarantine is Wave 4's job, not this packet's.**

### 6.3 The hazard registry — `scripts/hazard-registry.json`

Two edits, and no other.

**(a) `HZ-READERNOWRITER` — finding `C1`'s repair.** Correct the stale claims and raise the
count `3 → 4` (TCD-4 at `2c1ec70f` is the fourth confirmed member of the class).
⚠ **CONFIRMED the audit's field names are wrong for this file:** it cites `:299` (note), `:301`
(`instances`) and `:308` (`upgradePath`) and speaks of a top-level `note`. **The live entry sits
at `:289-326`, `instances` is at `:317`, and the note is NESTED at `enforcer.note` `:315`.
Navigate by symbol, never by the audit's line numbers.**
⛔ `instances` is validated only as `Number.isInteger(x) && x >= 1`
(`check-hazard-registry.mjs:262`) — **nothing derives it**, so the *evidence sentence* in
`instanceEvidence` is the only thing that makes the number true. **Update it in the same edit.**

**(b) `HZ-SITECOHERENCE` — the new class.** All ten schema keys. `status: "MACHINERY"` — the
hazard-conversion law admits nothing weaker for a new class, and the DOCUMENT/OWED ratchets at
`:346-364` refuse `DOCUMENT`/`PARTIAL` by construction. `enforcer.paths` = the two new test
files **and** the baseline; CONFIRMED they must **exist** at every status
(`check-hazard-registry.mjs:306-313`, arm D), so they are created in the same change.
`enforcer.inChain: true` — CONFIRMED **DERIVED**, and any `tests/**` path derives `true` because
`check-test-ratchet.mjs` is a `FULL_SUITE_MARKERS` entry. ⛔ **Do not restate the claim; if the
derivation disagrees, wire the enforcer in.**

⭐ **No floor moves.** `classFloor: 27` and `machineryFloor` are *floors*
(`check-hazard-registry.mjs:139`, `:364`) — a 28th MACHINERY class passes both without an edit.
⛔ **Do not "helpfully" raise either; that is a ratchet edit and it is out of scope.**

### 6.4 The two mutation-coverage rows — CR-SCW0-4

CONFIRMED both new files are enumerated by `tests/lint/mutationCoverage.shared.mjs:59-63` under
**both** arms — the directory arm (`tests/lint`) and the basename arm (`ratchet` and `coverage`
respectively). Each therefore **requires** a row in `scripts/mutation-coverage-manifest.json`,
whose `kind` must be `mutation` or `rationale`. ⛔ `uncovered` is **not available**:
`uncoveredBaseline: 198` is pinned at exact equality and the failure text says *"Do NOT add it
as uncovered — the gap list only shrinks."*

**RULED (CR-SCW0-4): `kind: "rationale"` for BOTH rows, each with an inline reason of ≥40
characters.** The derivation is mechanical rather than preferential, and it is recorded so a
reviewer does not read it as a preference: **CR-SCW0-2 fixes the packet at SIX paths.**
`kind: "mutation"` requires a `label` joining to a `check_caught*` call planted in
`scripts/mutation-sweep.sh`, plus an entry in that script's `MUTATED_FILES` totality list —
a **seventh** reserved path and a second enforcement surface. The path count therefore settles
the kind. ⚠ **Lane R's draft recommended `kind: "mutation"` for the ratchet on the grounds that
its C2 mutant is already a `check_caught` in all but name; that recommendation is DECLINED here
and the reasoning is preserved as the natural first candidate for a follow-up micro-act once
the instrument has landed and proven itself.** ⛔ `scripts/mutation-sweep.sh` is a **forbidden
edit** in this packet. ⛔ **Never re-serialize the manifest — splice the two rows as raw text**
(recorded hazard).

### 6.5 ⭐⭐ THE CORPUS-COST PROBE — CR-SCW0-5, a MANDATORY PREFLIGHT WITH A STOP

The plan's own risk note (`:83`) says the corpus build costs wall-clock inside vitest. **Measure
it before writing the ratchet**, in a throwaway probe removed before landing:

```js
// TEMPORARY probe. Removed before landing. Its number is a RECEIPT figure, never an assertion.
const t0 = performance.now();
for (const cfg of CORPUS_CONFIGS) generateSettlementPipeline(cfg, null, { seed: seedFor(cfg), customContent: {} });
console.log('SCW-0 corpus ms (462 settlements):', Math.round(performance.now() - t0));
```

**RULED (CR-SCW0-5): the threshold is `120_000 ms` for the whole 462-settlement corpus build, as
a MANDATORY PREFLIGHT PROBE and NEVER a test assertion.** Grounds: `120_000` is the estate's
existing heavy-suite precedent (`tests/lint/determinismBanCoverage.test.js:169`, CONFIRMED) and
sits an order of magnitude below the `900_000` the observed-shape walker needed; a corpus that
cannot build inside it will make the full gate materially slower on every lane forever. The
shape follows CR-TC5BI-3's `600 ms` precedent — **a wall-clock pin is a flake factory and must
never become an assertion.**

⛔ **Above the threshold, this packet STOPS and reports.** The fallback is a committed corpus
artifact on the `distribution-envelopes.manifest.json` pattern (§5c item 4 — **not** the
retired `OSR_CORPUS` one), and that fallback is **its own slice**, not an in-flight
improvisation. ⛔ **The threshold is a STOP, not a knob:** an implementer may not raise it, may
not "optimize" the generator, and may **never** raise the global `testTimeout` at
`vite.config.js:801`.

### 6.6 ⭐ THE EXIT CRITERION — CR-SCW0-6, RE-DERIVE AND REPORT AGAINST

**RULED (CR-SCW0-6): `SITE_COHERENCE_PLAN.md:81`'s *"reproduce the audit's measured baseline
exactly"* is REPLACED, for this packet, by: the ratchet's totals are RE-DERIVED at landing on a
quiet tree, and REPORTED beside the audit's `2c1ec70f` figures (`80 / 33 / 23 / 0 / 103`) as a
named comparison. A DIVERGENCE IS A FINDING TO RECORD, NOT A STOP.**

Grounds: (a) Wave 0's stated purpose is to freeze *what is*, and freezing what a five-day-old
probe measured would bank a stale number into nine downstream waves; (b) the audit's figures
came from `/tmp` probes replicating production logic (S13) rather than from the pipeline itself,
so a small divergence may reflect the **instrument**, not a regression; (c) the only-shrinks
contract makes any figure a valid starting point — **it is the drift that matters, not the
absolute.** ⛔ The comparison is **mandatory and appears in the completion receipt**; silently
omitting it is a deviation.

---

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Instruction |
|---|---|---|---:|---|
| `CREATE` | `tests/lint/siteCoherenceRatchet.test.js` | C1, C2, C4, C5, C6, C8 | `n/a` | §6.1. **Straight-line registration only** (§7c-1). The 462-loop lives **inside** one `it`, never around it. |
| `CREATE` | `tests/lint/.site-coherence-baseline.json` | the frozen row set | `n/a` | §6.1. Minted by the print-only regenerator, then committed by hand. Home RULED at CR-SCW0-3. |
| `CREATE` | `tests/lint/exportTokenCoverage.test.js` | C3, C7 | `n/a` | §6.2. Alternatives **derived from source** through `tests/helpers/sourceContract.js`; `KNOWN_INERT` pinned non-growing **and** membership-checked. Straight-line registration only. |
| `MODIFY` | `scripts/hazard-registry.json` | `HZ-READERNOWRITER`, new `HZ-SITECOHERENCE` | `~45` | §6.3. Ten keys; `MACHINERY`; enforcer paths must exist; `inChain` DERIVED. ⛔ **No floor moves.** |
| `MODIFY` | `scripts/mutation-coverage-manifest.json` | two new rows | `~8` | §6.4 + CR-SCW0-4 — **both `kind: "rationale"`**. ⛔ Raw-text splice; **never re-serialize.** |
| ⏸ `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` row + a dated comment | `~20` | §7c-4. Re-derive all five WHOLE in one run, re-record whole, state the cause. ⛔⛔ **SEQUENCED, NOT RESERVED AT PROMOTION — GR-4a holds the row. The chair moves it into this packet's `PACKET_MANIFEST.json` entry at dispatch; until it does, touching this file is out of manifest and is a STOP.** |

Generated artifacts: `NONE`. ⛔ Do not edit `scripts/.size-baseline.json`,
`scripts/.test-ratchet-baseline.json`, `scripts/.observed-shape-readers-baseline.json`,
`scripts/mutation-sweep.sh`, `vite.config.js`, `eslint.config.js`, `package.json`, or **any
file under `src/` or `tests/fixtures/`**.

⭐ **These six paths are the packet's complete obligation set; the FIVE non-sequenced ones are
its reserved change paths and `PACKET_MANIFEST.json` carries exactly those five.** The
discrepancy is deliberate, mechanical, and explained at §7b — it is not an omission.
⚠ **The three `CREATE` spellings become existence-checked at the LANDED flip**
(`implementation-packets.mjs:460-468`), so a rename during implementation must move the manifest
row in the same change. CR-SCW0-3 exists partly for this reason.

### 7b. Reservations and pairwise disjointness — CHECKED, WITH ONE SEQUENCED ARTIFACT

| Reserver | Status | Paths | Overlap with SCW-0 |
|---|---|---|---|
| **TC-5B-I** | LANDED | — | ✅ **NONE — a terminal packet reserves nothing** (`implementation-packets.mjs:43`). This is what discharged Lane R's CD-2 blocker. |
| **TC-5B-II** | READY | 9, under `src/components/townMap/`, `src/lib/`, `src/design/`, `tests/ui/`, `tests/lib/`, `tests/build/` | ✅ **ZERO.** ⚠ Note the near-miss: TC's `src/components/townMap/` and site coherence's `src/domain/townMap/` are different directories with confusable names. **Wave 0 reads the latter and writes neither.** |
| **GR-4A** | READY | 10, under `src/domain/worldPulse/`, `tests/domain/`, `tests/property/`, plus the census walker | ✅ **ZERO on files.** ⏸ The census walker is the one shared artifact — sequenced below. |
| **ES-DA** | READY | 7, under `src/domain/worldPulse/`, `src/domain/certification/`, `tests/domain/`, `tests/property/` | ✅ **ZERO.** |
| **IA-2** | STALE | 12, incl. `package.json`, four `scripts/implementation-*` / `tests/scripts/*` paths, five `docs/implementation/*` paths | ✅ **ZERO.** ⚠ **CONFIRMED STALE still RESERVES** — `TERMINAL_PACKET_STATUSES` is `{LANDED, SUPERSEDED}` only. ⚠ The chair's own act of adding this packet's row to `PACKET_MANIFEST.json` and `INDEX.md` touches two of IA-2's reserved paths, but that is a **coordinator** act, not a packet change-manifest row, and the identical act was performed for TC-5B-I and TC-5B-II while IA-2 was already STALE. Precedent-covered; not a gate. |
| **IA-1** | LANDED | incl. `scripts/hazard-registry.json` as a `MODIFY` row | ✅ **FREE.** Terminal packets write nothing into `changePathOwners` (`:430`). `scripts/mutation-coverage-manifest.json` is reserved by **no packet at any status.** |

⛔⛔ **THE CENSUS WALKER — WHY IT IS SEQUENCED RATHER THAN RESERVED, stated once and in full.**

1. Wave 0 creates two `*.test.js` files, so the estate-wide lighting census moves (`files` +2,
   plus titles). CONFIRMED — the walker's `TEST_FILES` filter and its five `.toBe()` arms.
2. SERIALIZATION LAW rule 1 requires the lane that moves any figure to re-derive all five WHOLE
   **in the same change**; rule 5 forecloses the "no new file, no census move" escape.
3. **Four non-terminal packets now need that one file.** CONFIRMED `implementation-packets.mjs`
   `:448-456` raises `duplicate change path across packets` when two non-terminal packets name
   one path, and `validate:packets` is **step 3 of the 17-step chain** — a red there blacks out
   fourteen later steps.
4. ⇒ **RULED (chair, 2026-08-11): GR-4a holds the reservation at promotion — it is dispatched
   first — and the chair MOVES the row, as a one-line manifest edit, into whichever packet it
   dispatches next. Only ONE of the four may have an implementer in flight at a time.**
5. ⛔ **Do NOT attempt the alternative Lane R already rejected: omitting the walker from the
   manifest and re-recording anyway.** That is an unreserved edit to a shared enforcer and it
   defeats the reservation system it routes around. **If the row has not been moved into this
   packet at dispatch, the census fold is a STOP and a report.**

**Working-tree dirt at this promotion:** one stale-index porcelain entry on
`scripts/.observed-shape-readers-baseline.json`, which is a forbidden edit here regardless.
⚠ **This is a snapshot of a shared, live tree — re-derive at preflight and treat a fresh
`git status` as authority over this line.**

### 7c. Landing discipline this manifest incurs — FIVE obligations, all measured

1. ⚠⚠ **THE PARKED-SUITE TRAP, AND IT TAKES THE WHOLE FILE.** A file is PARKED iff its
   `reasons` list is non-empty (`sovereigntyLightingContract.walker.test.js:1266-1271`), and
   park is **all-or-nothing at file scope** — one bad call zeroes every title in the file. A
   `test(`/`it(` registered inside a `for` loop is `TEST_UNREGISTERED`; a `describe` whose body
   is not straight-line is `SUITE_NOT_STRAIGHT_LINE`; `.each()` parks via `TEST_TABLE_UNPROVEN`
   or `TEST_CONTEXT_PARAM`. **This has bitten this estate twice, both recorded in-file:** the
   TC-5a paint suite scored **0 live titles against 34 real tests**, and
   `tests/lib/roadNetworkIndex.test.js` flipped CREDITED → PARKED when `0f85ced0` rewrote it to
   `test.each()`.
   ⛔⛔ **This is the single most likely way Wave 0 fails silently**, because a 462-settlement
   corpus is the most natural thing in the world to write as `for (const cfg of CORPUS) it(...)`.
   **Put the loop INSIDE one `it`, never around it. Verify `credited` moved, not just `files`.**
2. ⚠⚠ **THE MUTATION-COVERAGE MANIFEST IS MANDATORY HERE — AND RENAMING CANNOT ESCAPE IT.**
   Unlike TC-5b-i, which chose two names that dodge the trap, **Wave 0 walks into it under both
   arms**: `tests/lint/` is an `ENFORCER_DIR`, and the basenames match `NAME_PATTERN` on
   `ratchet` and `coverage`. ⚠ **Re-siting the files out of `tests/lint/` would not help** — the
   basename arm alone would still catch them, and renaming away from `ratchet` / `coverage`
   would make both files *less* honestly named. **Accept the obligation and write the rows**
   (§6.4). ⚠ The manifest is at `scripts/mutation-coverage-manifest.json` — **not** under
   `tests/lint/`, where a reader might reasonably look.
3. ⚠⚠ **`contractTestAntiVacuity.walker.test.js` SCOPES `tests/lint/*.test.js` AND BOTH NEW
   FILES ARE IN IT.** Rule 2 (an exhaustive claim backed by a local pure literal in a file that
   derives nothing from source) is a live red for the coverage census unless it derives from
   source — §6.2. Rule 1b (an extractor result in a negative matcher with no non-empty guard) is
   a live red for the source-reading half of **both** files. **Route extraction through
   `tests/helpers/sourceContract.js`, which throws on absence, and assert the extract truthy
   before any `.not.` matcher.**
4. ⭐ **THE LIGHTING CENSUS MOVES BY EXACTLY `+2` FILES, PLUS TITLES.** All five arms are exact
   equality and `titles` counts **every** `it()` in the estate, so placement is no exemption
   (SERIALIZATION LAW rule 5). CONFIRMED a JSON fixture under `tests/` moves **nothing** — the
   walk filters `/\.test\.(js|jsx)$/` — **so the baseline file is free.** **Re-derive all five in
   ONE run and re-record them WHOLE** — never patch `files` alone. ⭐ Probe with a temporary
   `console.log` **inside the existing census test, before its first assertion**, so the probe
   mints no title and cannot move what it measures. ⚠ **The sequence hazard is live:** while any
   arm is red the census **stops measuring**, so later arms may read anything.
   ⛔⛔ **NO FIGURE INHERITANCE.** §5b B2 is a named-committed-sha snapshot, not a fold base.
   Re-derive from the file at your own preflight, on a quiet tree; **if a foreign `it(`/
   `describe(` title has appeared, STOP and report** — never census a live shared tree, and
   never quantify another lane's uncommitted delta (rules 2 and 4). ⛔ **And check the
   census-holder rule first** (§7b).
5. ⚠ **ANCHORED NEGATIVES, AND THE TEST RATCHET HAS NO HEADROOM.** `ceilingFor` gives a new file
   **ZERO** (`negativeAssertionAnchor.walker.test.js:728`); the three counted matchers are
   `.not.toContain(`, `.not.toMatch(`, `.not.toHaveProperty(`; the `// anchored:` escape is
   accepted only on the assertion line or the **single** line immediately above. Separately,
   `scripts/.test-ratchet-baseline.json` holds **17 entries against `const CEILING = 17`** — zero
   headroom. **Wave 0 must land with no new baselined failure**, and raising `CEILING` to land a
   packet is forbidden.

⚠ **GATE THROUGH THE MUTEX, AND NEVER THROUGH A PIPE.** Every vitest invocation goes through
`sh scripts/gate-mutex.sh --run -- …`; the landing gate is `npm run check:tail`. **An
observational preflight followed by a separate command is not ownership. Trust no exit status
you did not capture yourself.**

---

## 8. Ordered coding sequence

0. Run §5 preflight, **including the census-holder gate**, and record every baseline. Stop on
   mismatch.
1. **Measure B7 first** — the corpus-cost probe, **before either test file exists**. Above
   CR-SCW0-5's `120_000 ms`, **STOP and report**; do not write the ratchet.
2. Add the smallest failing focused test: the corpus builder plus the anti-vacuity arm (C5's
   `462` / `0 errors`), **before any baseline file exists**.
3. Implement the classifier and mint `.site-coherence-baseline.json` via the **print-only**
   regenerator. Make C1, C2, C4 green.
4. Add the only-shrinks arms in both directions (C6) and prove them with a **hand-edited copy**
   of the baseline, never by editing the real one.
5. Implement `exportTokenCoverage.test.js` — derived alternatives first, `KNOWN_INERT` second
   (C3, C7).
6. Run the C2 mutant (delete the `/coal/` alternative) and **restore the file byte-identically**,
   confirming with `git diff --exit-code src/domain/townMap/siteGenesis.js`.
7. Edit `scripts/hazard-registry.json`; run `npm run validate:hazard-registry` and confirm exit
   `0` (C8).
8. Splice the two `scripts/mutation-coverage-manifest.json` rows; run
   `tests/lint/mutationCoverageManifest.test.js`.
9. Run the anti-vacuity, anchored-negative and mutation-coverage walkers focused.
10. Re-derive the lighting census WHOLE (§7c-4) and re-record it in the same change, cause
    stated — **only if the chair has moved the reservation into this packet.** STOP per §7c-4's
    conditions otherwise.
11. Run the wave-end gate. Report exact deltas, the B7 number, the census row, **the re-derived
    totals reported AGAINST the audit's `2c1ec70f` figures (CR-SCW0-6)**, both typecheck windows
    named, which of the 17 gate steps ran, and `deviations: NONE` or a STOP.

⛔ **Do not start by changing a golden, baseline, budget, or persisted shape.**

---

## 9. Acceptance matrix — the complete edge-case denominator

| ID | Case | Required observation | Test home |
|---|---|---|---|
| C1 | Main reachable behavior | The 462-corpus builds with `0` generation errors and classifies every settlement into exactly one `(terrain, siteKind, decisiveToken)` row; the live row set **equals** `.site-coherence-baseline.json`'s `rows` in both directions (no new key, no vanished key, no moved count) | `siteCoherenceRatchet.test.js` |
| C2 | ⭐ **THE MUTANT — the instrument is shown to ASSERT, not merely to run** | Deleting the `coal` alternative from `siteGenesis.js:247` makes the `(plains, mountain-flank, coal)` row **move**, and the ratchet reds **naming that row** — **while `exportTokenCoverage.test.js` still PASSES**, because it checks liveness only. The exact row is quoted in the receipt. ⛔ The file is restored byte-identically (`git diff --exit-code`) | both files |
| C3 | Absent / disabled behavior | A settlement whose `canonExports()` is `[]` contributes only `'(biome)'`-token rows and **no** export-decisive row. **Anchored:** an export-bearing settlement in the same terrain DOES contribute one | `siteCoherenceRatchet.test.js` |
| C4 | Sparse / boundary / malformed-but-supported | `generateSite` driven with `exports` as `null`, `undefined`, a bare string, and `[{}, 'Peat fuel']` classifies without throwing — the audit's S3 shape, **re-driven rather than inherited**. `terrainOverride: 'auto'` is **excluded** from the corpus by construction and the test asserts the corpus contains none | `siteCoherenceRatchet.test.js` |
| C5 | Duplicate / idempotent | Building the corpus twice in one run yields byte-identical row sets and an identical distinct-export vocabulary — determinism, `customContent: {}`. The print-only regenerator run twice emits identical text and **exits non-zero both times** | `siteCoherenceRatchet.test.js` |
| C6 | Lifecycle round trip — **the only-shrinks contract, both directions** | Against a hand-built variant baseline: a **new** key reds; a **grown** count reds; a **shrunk** count reds **with the bank instruction**; a **vanished** key reds. All four quoted. **Anchored:** the real baseline passes all four arms | `siteCoherenceRatchet.test.js` |
| C7 | ⭐ **THE DERIVED DENOMINATOR** | The alternative set is extracted from `siteGenesis.js` + `asymmetrySources.js` **source** and contains **all four** `siteGenesis` predicate sites including `:239` (§5c-2). Every alternative is live in the corpus vocabulary or in `KNOWN_INERT`. `KNOWN_INERT` is non-growing **and** membership-checked. **Anchored:** the extract is asserted non-empty before any negative matcher, and a renamed-away control proves the extractor THROWS rather than returning `''` | `exportTokenCoverage.test.js` |
| C8 | Named historical regression — the registry tells the truth | `npm run validate:hazard-registry` exits `0` with `HZ-READERNOWRITER.instances === 4`, its `enforcer.note` and `upgradePath` no longer claiming the count-only soft spot cured at `53029151`, and `HZ-SITECOHERENCE` present as `MACHINERY` with **existing** enforcer paths and a DERIVED-true `inChain`. **Anchored:** `classFloor` and `machineryFloor` are unchanged | `siteCoherenceRatchet.test.js` + the gate step |

⛔ **Do not add a ninth case or a speculative cross-product.**

### 9b. OUTPUT POSTURE — this packet moves NOTHING, and that is the assertion

> **SCW-0 changes no production code and no output, lit or dark. It touches zero `src/` files.**
> There is no declared behavior shift; the obligation is the strict inverse of a shipping
> packet's.
>
> **THE IMPLEMENTER'S OBLIGATION:** run the full gate at BASE and record the green golden/pin
> set. After the change, **any** golden, pin, dormancy fixture, manifest byte, or bundle figure
> that moved is a **STOP**, not a re-record.
> ⚠ The **only** figures permitted to move are the five sovereignty-lighting-census numbers,
> because §7 mandates two new test files — recorded whole, in one run, with the cause stated.
> ⛔ `scripts/.test-ratchet-baseline.json`, `scripts/.size-baseline.json`,
> `scripts/.observed-shape-readers-baseline.json` and every golden are **forbidden edits**;
> motion in any of them is a STOP.

---

## 10. Verification commands

```sh
# B1 baseline — capture the exit status YOURSELF.
sh scripts/gate-mutex.sh --run -- npm run check:tail; echo "TRUE EXIT: $?"

# Focused behavior (C1-C8).
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/siteCoherenceRatchet.test.js \
  tests/lint/exportTokenCoverage.test.js

# The four shared enforcers this packet must satisfy.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/mutationCoverageManifest.test.js \
  tests/lint/contractTestAntiVacuity.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/sovereigntyLightingContract.walker.test.js

npm run validate:hazard-registry          # exit 0 — C8
npx eslint tests/lint/siteCoherenceRatchet.test.js tests/lint/exportTokenCoverage.test.js
npm run typecheck:ratchet                 # tsconfig.full.json
npm run typecheck:domain:strict           # tsconfig.domain-strict.json

# The landing gate.
npm run check:tail
```

⚠ **Never read a gate through a pipe** — `npm run check:tail`, or
`sh scripts/gate-tail.sh <command...>`; a piped read reports the PIPE's status and has
greenwashed red gates twice.
⚠ **Budget the wall-clock:** `observedShapeReaders.walker`'s `beforeAll` is sized to **900 s**
because it measures ~264 s contended. A timeout there skips all 27 tests and then trips the test
ratchet's skip sentinel — a cascade that looks like a defect and is not.

---

## 11. Recorded deviations from the plan document (each vetoable)

1. **D-1 — The exit criterion changes from "reproduce exactly" to "re-derive and report
   against."** Ground: §5c item 1 — five generation-touching commits since the audit's HEAD, one
   of them a **declared same-seed correction**. Freezing a five-day-old probe figure as a pass
   condition would stop the packet on a false premise, and Wave 0's job is to freeze what *is*.
   **RULED: CR-SCW0-6.**
2. **D-2 — The baseline moves from `tests/fixtures/` to `tests/lint/`.** Ground: CONFIRMED
   `tests/fixtures/` contains **no** dot-prefixed file, while every dotted enforcer baseline in
   the estate sits beside its enforcer (`tests/lint/.coupling-inclusion-baseline.json`,
   `tests/lint/.prose-numerics-baseline.json`, `tests/copy/.voice-mechanics-baseline.json`,
   `scripts/.size-baseline.json`). ⭐ A second, load-bearing reason: **Wave 2's exit criterion is
   `git status --porcelain tests/fixtures/` showing no golden modified** — keeping a
   legitimately-shrinking baseline out of that directory keeps that check clean for three later
   waves. **RULED: CR-SCW0-3.**
3. **D-3 — The coverage census DERIVES its denominator from source rather than listing it.** The
   plan's phrasing is compatible; the deviation is that a transcribed list is **forbidden**, not
   merely discouraged. Two live walkers force it (§7c-3) and the plan's own list is incomplete
   (§5c-2). **Settled within scope** — the code forced it; not a chair question.
4. **D-4 — `KNOWN_INERT` is membership-checked against the derived set, not only pinned
   non-growing.** The plan asks only for non-growth. Non-growth alone lets Wave 4 delete a token
   and leave a quarantine entry that then describes nothing — the same rot class
   `enforcedByExists` and `check-hazard-registry.mjs` arm D exist to prevent. **Settled within
   scope.**
5. **D-5 — The regenerator is print-only and always exits non-zero.** The plan does not specify.
   Ground: `M13`/`M16` are this estate's recorded scars from a `--write` path that re-baselines
   from whatever the tree produced at that instant. Copying
   `negativeAssertionAnchor.walker.test.js:738-750` costs nothing and forecloses the class.
   **Settled within scope.**
6. **D-6 — The packet reserves two shared enforcer files the plan never mentions**
   (`scripts/mutation-coverage-manifest.json`, and the sequenced lighting census). Neither is
   optional; both are forced by live gate machinery. Recorded because a reader of the plan alone
   would size this packet at four files.
7. **D-7 — `kind: "rationale"` for BOTH mutation-coverage rows, declining Lane R's `mutation`
   recommendation for the ratchet.** Ground: CR-SCW0-2 fixes the packet at six paths, and
   `kind: "mutation"` requires a seventh (`scripts/mutation-sweep.sh`). **RULED: CR-SCW0-4**,
   with the declined recommendation preserved at §6.4 as the natural follow-up micro-act.

---

## 12. Rulings

### 12a. The chair's rulings — CR-SCW0-1..6, BINDING

⭐ **None is owner-gated.** This packet adds no persisted key, no vocabulary member, no flag, no
schema field, no paid surface, and no generated output.

- **CR-SCW0-1 — THE PACKET ID AND DIRECTORY. RULED: `SCW-0`, at
  `docs/implementation/packets/site-coherence/SCW-0.md`**, with Waves 1–9 following as
  `SCW-1 … SCW-9`. ⚠ **`SC-` is taken** — CONFIRMED `SC-1` is the LANDED surveyor-chat packet.
  Ground: `SCW` keeps the plan document's own title in the id, and the manifest's `id` pattern
  `/^[A-Za-z0-9][A-Za-z0-9+._-]*$/` admits it.
- **CR-SCW0-2 — SIX PATHS. RULED.** Three `CREATE` deliverables, **two enforcer registrations**
  (`scripts/hazard-registry.json`, `scripts/mutation-coverage-manifest.json`), and the lighting
  census walker as a `TEST` obligation. ⭐ **Lane R's CD-2 blocker is DISCHARGED** — TC-5b-i
  LANDED and a terminal packet reserves nothing. ⛔ **But three sibling packets now want the
  same walker, and the validator forbids duplicates, so the sixth path is SEQUENCED rather than
  reserved: GR-4a holds it at promotion and the chair moves it at dispatch** (§7b). The path
  count is fixed at six and is load-bearing — see CR-SCW0-4.
- **CR-SCW0-3 — THE BASELINE'S HOME. RULED: `tests/lint/.site-coherence-baseline.json`**, not
  `tests/fixtures/`. Grounds at §11 D-2. ⚠ The path is a `CREATE` row and CREATE spellings are
  existence-checked at the LANDED flip, so the ruling is load-bearing at landing, not only at
  authoring.
- **CR-SCW0-4 — THE TWO MUTATION-COVERAGE ROWS. RULED: rows for BOTH new files** (each is caught
  under **both** arms of `mutationCoverage.shared.mjs` — the `tests/lint` directory arm and the
  `ratchet` / `coverage` basename arm), **each `kind: "rationale"` with an inline reason of ≥40
  characters.** ⭐ **The kind is DERIVED from CR-SCW0-2's six-path count, not chosen:**
  `kind: "mutation"` would require a `check_caught*` planted in `scripts/mutation-sweep.sh` plus
  a `MUTATED_FILES` entry — a seventh path. **Rejected:** `kind: "uncovered"` (unavailable —
  `uncoveredBaseline: 198` is exact and the gap list only shrinks); `kind: "mutation"` for the
  ratchet (Lane R's recommendation; declined on the path count, preserved at §6.4 as a follow-up
  micro-act).
- **CR-SCW0-5 — THE CORPUS-COST STOP. RULED: `120_000 ms` for the whole 462-settlement build, as
  a MANDATORY PREFLIGHT PROBE and NEVER a test assertion** (§6.5). Grounds: the estate's existing
  heavy-suite precedent at `tests/lint/determinismBanCoverage.test.js:169`; an order of magnitude
  below the observed-shape walker's `900_000`; and CR-TC5BI-3's ruling that **a wall-clock pin is
  a flake factory**. ⛔ Above it the packet STOPS; the committed-corpus-artifact fallback is its
  own slice.
- **CR-SCW0-6 — THE EXIT CRITERION. RULED: RE-DERIVE AND REPORT AGAINST**, replacing the plan's
  *"reproduce exactly"* (§6.6). A divergence from `80 / 33 / 23 / 0 / 103` is a **FINDING to
  record, not a STOP.** ⛔ The comparison is mandatory in the completion receipt.
  **Rejected:** the strict form — it would make a measurement of the 462-corpus at HEAD a
  *blocking precondition to promotion*, and that measurement is itself most of Wave 0's work.

### 12b. Lane R's draft judgments — ✅ FABLE-VALIDATED 2026-08-11

Lane R marked every §12 row `⏳ OPUS-ERA — FABLE VALIDATION OWED`. **The Fable chair validated
all six at this promotion (session `c42c8924`); no `⏳` marker lands, and none is carried
forward.** The three items Lane R settled within scope (D-3, D-4, D-5 at §11) are ratified as
settled: each was forced by live machinery or a recorded estate scar rather than by preference,
and each is reversible with a one-line change.

---

## 13. Appendix — the evidence posture this packet inherits

**CONFIRMED** below means Lane R read the file or ran the read-only command at `63c62822` and is
quoting its own observation; **PLAUSIBLE** means inherited from the plan, the audit, or another
document and not re-executed. Lane U re-verified the file-absence, symbol-existence and
reservation facts at `33487c77`.

- **CONFIRMED by direct read:** all of §4's table; §5b B2/B3/B4/B5/B6; §7b's pairwise
  disjointness checks; §5c items 1–5; the arithmetic `210 + 252 = 462`; `CULTURE_PROFILES` = 11
  keys; `TIER_ORDER` = 6; `TERRAIN_WEIGHTS` = 7.
- **PLAUSIBLE, explicitly not re-executed:** every corpus *measurement* in the audit (the
  158-string vocabulary, `80/33/23/0/103`, the 47 false positives, the 122/462 kind changes, the
  1008-settlement provenance figures). Lane R ran no vitest and generated no settlement.
  ⭐ **CR-SCW0-6 exists precisely because these were the plan's exit criteria and they are
  unverified at this HEAD.**
- **NOT MEASURED and deliberately not inferred:** the wall-clock cost of the 462-corpus (B7) and
  the current pass/fail state of any gate step (B1).

---

## 14. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` §"Mandatory STOP conditions", stop if:

- ⛔ **The chair has not moved the lighting-census walker's manifest row into this packet at
  dispatch**, or `tests/lint/sovereigntyLightingContract.walker.test.js` is not clean at
  preflight (§7b). **Report; do not route around the reservation.**
- ⛔ **The B7 corpus measurement exceeds `120_000 ms`** (CR-SCW0-5). Report; do not raise the
  number, do not raise `testTimeout`, and do not "optimize" the generator.
- ⛔ **A foreign lane holds uncommitted test titles at census re-record time.** Report; do not
  re-record, do not census a live shared tree, and do not quantify the foreign delta.
- ⛔ **Any edit would reach a file under `src/`.** This packet's whole posture is that production
  does not move; a needed `src/` edit means the work is Wave 2 or later.
- ⛔ **Any edit would reach `scripts/.observed-shape-readers-baseline.json`,
  `scripts/.test-ratchet-baseline.json`, `scripts/.size-baseline.json`,
  `scripts/mutation-sweep.sh`, `vite.config.js`, `eslint.config.js`, or any golden or dormancy
  fixture.**
- ⛔ **Any edit would reach one of TC-5b-ii's nine paths, GR-4a's ten, or ES-Da's seven** (§7b).
- ⛔ **The test-ratchet census would need a new entry** — it is at 17 of ceiling 17 with zero
  headroom, and raising `CEILING` to land a packet is forbidden.
- ⛔ **A `classFloor`, `machineryFloor`, `documentBaseline`, `owedBaseline`, `uncoveredBaseline`
  or any other ceiling would need to move.**
- ⛔ **The instrument would need a CORRECTNESS assertion to satisfy an exit criterion** (§-1) —
  that is Wave 8, and writing it here is the pin-vacuity class this estate is full of.
- ⛔ **A golden, pin, dormancy fixture, or bundle figure moves at all** (§9b).
- ⛔ **The 462-corpus produces any generation error, or its size is not exactly 462.**
- **Any packet premise here is refuted by live code. The code wins; the packet stops.**

The STOP report contains the smallest measured contradiction, the evidence, and a proposed
split. It contains **no speculative repair.**
