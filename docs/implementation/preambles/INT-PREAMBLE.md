# INT FAMILY PACKET PREAMBLE — the invariants signed once per volume

> **Authored by lane TC12 at the code of record `fc8451c4`; LANDED at this path by lane TE12
> at the `int-3b` train's P1, under the chair's `OWNER_DECISION_QUEUE.md` §54 execution
> order.** Per `docs/DESIGN_BUILD_EFFICIENCY.md` §4 one family preamble per volume lives at
> `docs/implementation/preambles/INT-PREAMBLE.md`; each member packet then carries only its
> own scope, contract, manifest, acceptance, mutants and hazards, plus a line citing this
> file **BY SHA-256**. A preamble edit re-stamps every citing packet, so drift is
> structurally impossible — and that mechanism is what `INT-3B` leans on, recomputed by the
> executing lane over THESE landed bytes rather than over the scratchpad draft.
>
> ⚠ **THE FORMAL FAMILY SIGNATURE IS STILL BATCHED.** §54 ruling 4 keeps `Q-TC12-2` — sign
> this preamble as the INT family's, or fold it into a one-member family — open with the
> other five questions for the next owner-visible sitting. Landing the file at its canonical
> path is what the §54 execution order directs and is what makes the sha-256 citation a
> measurement; it is **not** the chair's signature on the family, and no later reader should
> read it as one. Nothing in `INT-3B` depends on the answer.

- **Volume:** INT — the INTERIOR family (courts, legitimacy, factions, grievance, the ladder).
- **Design authority:** `docs/DESIGN_FP_INTERIOR.md` (mechanism, forces, bands, endings).
- **Implementation compilation:** `docs/DESIGN_FP_ARCH_INT.md` — compiled 2026-08-04 at
  `e564e135`, landed `99d63d92`. ⛔ **363 commits stale at the code of record.**
- **Substrate authority:** the SPV annex (lane INT-S), 284 graded claims —
  214 MEASURED-TRUE / 62 REFUTED / 8 UNVERIFIABLE-AT-BASE. Until it lands on the build branch
  as `docs/implementation/preverification/INT-SUBSTRATE.md`, the scratchpad annex is canonical.

---

## §P1 · Binding design-law citations

1. **THE PROMISE** (constitutional). A seed is a starting world forever; lived history is
   immutable; tuning is owner-SIGNED. Every INT wave that touches `factionPairStates`,
   `relationshipStates`, `npcLadder*` or `previousGovernments` is touching persisted lived
   history and inherits this whole.
2. **`docs/DESIGN_FP_INTERIOR.md`** — the DESIGN authority. Where it and the ARCH volume
   disagree on **mechanism**, the design volume wins and the disagreement is a bug to report.
3. **`docs/DESIGN_FP_ARCH_INT.md` §1** — the SUBSTRATE authority, *until re-measured*. It has
   been re-measured: **the SPV annex supersedes §1 wholesale**, and a packet citing a §1 figure
   the annex refuted inherits a STOP, not an excuse (annex CONSUMPTION LAW).
4. **`docs/DESIGN_FP_COUPLINGS.md` §0.3** — the same-commit coupling obligation.
5. **`docs/implementation/PACKET_STANDARD.md`** and the base-state capsule's own
   `consumptionLaw`.
6. **J-INT-1 … J-INT-15** (design volume §9). Two bind every wave of this family:
   **J-INT-12** — *the vocabulary never leads the events*: a word, kind, ending or purpose
   lands in the same commit as the producer that mints it, never before.
   **J-INT-15** — *the émigré is a projection, never a roster move*: the errand RECORD is the
   only state there is; both towns' surfaces are pure projections over it.

### The ARCH volume's addresses are not evidence

Every line number in `DESIGN_FP_ARCH_INT.md` was measured at `e564e135`. **34 of the annex's
62 refutations are pure address rot and nothing else.** Eight of the fourteen named files are
byte-stable and their cited addresses are census-exact; six moved (`warSeatBooks.js` +73,
`npcLadderKernel.js` +62, `factionCompetition.js` +36, `settlementPolitics.js` +29,
`rulingPower.js` +28 at all four cited sites, `npcLadderState.js` +12) and **every address
inside those six is wrong by roughly the file's delta.** Navigate by symbol. Always.

---

## §P2 · The registration cost — the measurement that decides an INT packet's shape

An INT wave's shape is decided before a line is written, by three registrations this family
owes that no other volume's preamble carries.

### (a) THE LAYER CLAIM — an INT leaf is UNLAYERED unless its NAME says otherwise

`tests/lint/couplingInclusion.walker.test.js` claims INTERIOR by **name prefix**:

```
/^src\/domain\/worldPulse\/(?:faction|legitimacy|relationship|institution|commons|
  disposition|generosity|grievance|rulingPower|npcLadder|seatBooks)/
/^src\/domain\/worldPulse\/strategicPosture\.js$/
```

A new INT leaf named anything else — `emigreErrand.js`, `decisionJoinReceipt.js`,
`decisionPolitics.js`, `woundFamily.js` — matches **NO** pattern and is therefore UNLAYERED,
which reds three arms at once: the new-unlayered-module census, the exact-set equality against
`.coupling-unlayered-baseline.json`, and `UNLAYERED_BASELINE_CEILING` (**179**, exact).

There are exactly two lawful doors, and the walker's own table says which:

- **A LAYER HOME** (the usual answer, and the one the table's doctrine demands for anything
  that owns INTERIOR's subject) — an **EXACT-PATH regex** appended to `LAYER_PATTERNS.INTERIOR`.
  ⛔ **Never a new `foo[A-Z]` prefix**: the table's own `secondOrderBelief.js` note rules that a
  prefix *"would claim files nobody has designed and silently widen a frozen family."*
- **An `ARGUED_UNLAYERED` entry** — reserved for modules that own **no subject** and are spoken
  by every port (the band vocabulary, the law word, the errand mint). It costs a written
  argument, a `reads` declaration, and a deliberate move of `ARGUED_ROSTER_CEILING` (**19**,
  **exact equality** in both directions since 2026-08-10).

Taking a layer home makes the leaf's imports visible to `scanCrossLayerPairs`, which is the
point — and which leads directly to (b).

### (b) THE COUPLING LEAF — `couplingRegistryInterior.js` DOES NOT EXIST, and the first INT wave that reads across a layer mints it

`couplingRegistry.js` is no longer a row list. CW-0w slice 1 split it into per-volume leaves
(`couplingRegistryWar/Trade/Grammar/Info/Espionage.js`) behind a 178-line composing head, and
`couplingRegistrySchema.js:43` sets `COUPLING_REGISTRY_SCHEMA_VERSION = 4`. **The ARCH volume's
§5 seam 12 instruction — "add your row to `couplingRegistry.js`, schema v2" — is refuted
(annex X5), and both INT-cited rows have already moved to `couplingRegistryWar.js` (`:208`,
`:151`).**

So the first INT wave landing a cross-layer read pays a five-part act, not a row:

1. a new `src/domain/certification/couplingRegistryInterior.js` exporting `INTERIOR_COUPLINGS`;
2. the head's import + spread + **named re-export**;
3. the exact-list pin and the per-volume registry test in the head's own test file;
4. a `.coupling-inclusion-baseline.json` entry for each new pair;
5. the packet's `changeManifest` naming **both** the leaf and the head — the packet validator's
   coupling-registration template check (OQ §35 ruling 3) reds a packet that names a
   `couplingRegistry<Volume>.js` leaf without naming the head, on the measured ground that
   *"a row the composing head does not re-export and the exact-list pin does not name CANNOT
   EXIST — it imports as undefined."*

⭐ **The cheapest INT wave is therefore the one that imports only ARGUED substrate.**
`scanCrossLayerPairs` iterates LAYERED importers and skips any dependency with **no** layer, so
an import of `errandMint.js`, `bandedStock.js`, `bandFamilies.js`, `lawWord.js` or
`magicWorksAt.js` produces **zero** pairs and costs **zero** registry rows. Measure the import
list against `ARGUED_UNLAYERED` before deciding the wave's shape, not after.

### (c) THE ERRAND CONSUMER FLIP — pre-reserved, walker-enforced, both ways

`ERRAND_CONSUMERS` (`envoyErrandVocabulary.js:295-364`) is frozen and pre-reserves INT's row by
name: `{consumer:'ambitious', purposeClass:'factional',
module:'src/domain/worldPulse/emigreErrand.js', wave:'INT-3b', built:false}` (`:357-363`).
`tests/lint/errandConsumerRegistry.walker.test.js` measures it in **both** directions —
`!row.built && isMinter` reds, and `row.built && !isMinter` reds — so the flip is **forced
machinery, never a choice**, and it must ride the same commit as the module.

⛔ **The flip is not the whole price.** The walker's third test carries an **exact-equality**
pin on the built set *and* on the discovered minter set, under a title that spells the count:

```js
test('the THREE built consumers today are the war errand head, the pact proposals and the covert missions', () => {
  expect(builtModules).toEqual([...three...]);
  expect(minters).toEqual([...three...]);
});
```

A fourth consumer reds both arrays **and makes the title false**. The title must be renamed in
the same commit. A rename is title-census-neutral (one title out, one title in) — but confirm
first that no arm of that file sits in `scripts/.test-ratchet-baseline.json`'s frozen entries,
because **the title IS the census key** and renaming a banked failure destroys its identity.

---

## §P3 · The census law under INT

1. **The estate-wide lighting census is re-derived WHOLE, in the train's LAST `tests/`-moving
   commit.** Re-deriving it anywhere else leaves
   `tests/lint/sovereigntyLightingContract.walker.test.js` red at an intermediate commit of a
   train that is supposed to be green at every commit.
2. **`parked` must be held by construction, and asserted rather than hoped.** Every acceptance
   title is a string LITERAL in a straight-line block inside ONE literal `describe`.
   ⛔ **No `test.each()`, no `describe.runIf()`, no loop-registered or conditional title
   anywhere in an INT train.** A `.each` case is invisible to the census by construction and a
   `runIf` parks the file whole — either closes the arithmetic while measuring nothing.
3. **`runtimeTests` is a FLOOR, not a pin.** It is transcribed into the regenerated capsule from
   the terminal's own executed `test:ratchet` receipt through `--runtime-tests`, never predicted.
4. ⚠ **THE MUTATION-MANIFEST BASENAME TRAP.** `tests/lint/mutationCoverage.shared.mjs` enumerates
   a file as a correctness-asserting invariant if it lives under one of seven ENFORCER DIRS
   (`tests/lint|design|docs|data|copy|security|edgeFunctions`) **or** if its BASENAME contains
   any of: `census scan baseline ratchet walker killlist parity coverage governance freshness
   integrity exhaustiveness roundtrip golden contract pin` (case-insensitive substring).
   An enumerated file **must** carry a `scripts/mutation-coverage-manifest.json` row.
   ⇒ **Name an INT acceptance file `<subject>.test.js` under `tests/domain/` and nothing else.**
   `emigreErrandContract.test.js` or `…Pins.test.js` silently buys a manifest row; the HB-0B
   precedent records that a row whose target battery is not enumerated reds the
   no-stale-entries case, so the cheap name is the only free one.

---

## §P4 · Coupling and the observed-shape reader law

**Coupling.** Every cross-layer read is registered in the SAME commit (`DESIGN_FP_COUPLINGS.md`
§0.3), under schema v4, in the volume leaf — see §P2(b). `reads` on an argued module is
**OUTBOUND-ONLY** and only ever shrinks.

**Observed-shape readers.** The frozen inventory
(`scripts/.observed-shape-readers-baseline.json`, **387 files / 1998 rows**, frozen
2026-08-13 at `3df85a3a`) carries a **per-identity ceiling of ZERO for a new file**, and any
movement off 1998 is a **STOP, not a re-freeze** — a detector change is a SCHEMA MINT with its
own docket and is never a wave's act.

⭐ **The mechanism, measured rather than trusted.** The detector grounds a finding by its
receiver (`RECEIVER_ROOT = /^([A-Za-z_$][\w$]*)\??\./`) and refuses to emit unless the receiver
resolves to exactly one shape. Executed read of the frozen inventory for the whole errand
cohort at the code of record:

```
src/domain/worldPulse/envoyErrandOffer.js  → 3 rows
errandMint.js · envoyErrandVocabulary.js · envoyErrand.js · pactProposals.js  → ZERO ROWS EACH
```

⇒ An INT leaf that takes **explicit destructured named parameters** and forwards them — never a
bare `settlement.x` / `npc.y` / `treaty.z` chain reached off an unresolvable receiver — inherits
zero rows. Build them that way and this whole hazard class never opens.

---

## §P5 · Standing hazard dispositions

> **HZ-SIZECEILING.** The domain hard ceiling is **800 EFFECTIVE lines** (eslint `max-lines`,
> `{skipBlankLines:true, skipComments:true}`), and effective is not raw: measured at the code of
> record, `envoyErrandVocabulary.js` is **674 raw / 367 effective**, `errandMint.js`
> **263 / 82**, `envoyErrand.js` **900 / 714**, `pactProposals.js` **380 / 161**. ⛔ Never judge
> headroom by `wc -l`, and never inherit a figure — `envoyErrand.js`'s own header still claims
> 695 effective and it is 714 today. `scripts/.size-baseline.json` carries **TEN** baselined path
> entries (the "fifteen" in the ARCH volume counted five `_comment`/ruling keys — annex C113, a
> miscount at compile time, not rot); none of the errand family is among them.

> **HZ-ADDRESSROT.** See §P1. Navigate by symbol; re-derive every address in the six moved files.

> **HZ-VOCABFREEZE — three closed vocabularies an INT wave may not widen.**
> **`ENVOY_PURPOSES`** is exactly `['sue','self_parlay']` (`envoyErrandVocabulary.js:119`) and
> the refusal to widen it SURVIVES the sweep: it is a foreign program's closed, walker-asserted
> vocabulary and widening it from the interior is the cross-program write the estate forbids.
> The generalization rides **`ENVOY_PURPOSE_CLASSES`** (`:130`) *alongside* it.
> **`ENGINE_GATED_VIRTUAL_RULE_KEYS`** holds **TWENTY** keys (`simulationRules.js:185-326`,
> corroborated by `BASE_STATE.json → flagManifestRows: 20`) — **not the five the ARCH volume
> §2 names** — and `tests/lint/engineGatedRuleKeys.walker.test.js` proves the list both ways.

> **HZ-PINVACUITY.** This volume's compile authored at least three pins that could never fire.
> `warSeatBooks.js`'s `securityBand` vocabulary is `secure | holding | precarious | unseated`
> (`:519`, `:477`) — **`'contested'` does not exist**, and INT-1's whole deliverable (b) bands
> off it. INT-1's cycle-absence import pin names `postureOf`, a symbol chair ruling CR-C4-1
> renamed to `courtPostureOf` / `courtRiskAppetiteOf`. INT-5 stamps `originHolderId` at
> `:264-266/:306/:386`, which are DECAY-CARRY sites; the only mint sites are
> `npcLadderState.js:555` and `:572`. **Every INT pin is written against an EXECUTED read of
> the producer, never against the volume.**

> **HZ-FLAGMINT — THREE OBLIGATIONS, standing law for every volume (OQ §49 ruling 3 as amended
> by §50 ruling 2).** Minting an engine-gated virtual flag costs: **(a)** the
> `tests/domain/subsystemRowsVirtual.test.js` ordered-equality pin (three module-scope literal
> edits, zero new titles); **(b)** the SEVEN generated edge-shared bundle artefacts that
> `simulationRules.js` feeds (one `npm run build:edge-shared`, zero handwritten files — the
> freshness gate is red without them); **(c)** the flag drive spelled as a **LITERAL**
> `<flag>: true` in the acceptance file, because `mechanismLitCoverage` grants AUTO credit only
> on a literal and a computed key attributes to NO key. Compilers preflight all three from the
> ruling. A wave that mints no flag states so affirmatively and pays none of it.

> **HZ-LITERALCLASS — the one-reader law's element-precise pattern reds a NAMED CONSTANT.**
> `errandConsumerRegistry.walker.test.js`'s `readsByPattern` flags any object-literal or binding
> element that IS `purposeClass|declaredPurpose|truePurpose`, optionally renamed **to an
> identifier**. Executed at the code of record:
> `purposeClass: EMIGRE_CLASS` → **offender**; `purposeClass: 'factional'` → clean;
> `purposeClass: 'diplomatic'` (GR-2's landed spelling) → clean. ⇒ **An INT mint call spells its
> purpose class as a QUOTED LITERAL, never as a named constant.** This is the exact inverse of
> HZ-FLAGMINT (c) arriving from a different machine, and both say: spell the literal.

> **HZ-BANKEDFAILURE.** A banked failure lies twice. Per-TEST identity absorbs every later
> instance, and the cure is a SEPARATE passing pin — **never** a rename, because the title is
> the census key. Sixteen frozen entries exist at the code of record; measured, **none** names
> `errandConsumerRegistry`, `couplingInclusion` or `sovereigntyLightingContract`.

---

## §P6 · Mutant hygiene

Every INT mutant is **disposable and isolated**: planted, executed, reverted, and never
committed. A mutant on a COUNT over a frozen literal list goes vacuous — mutate the
**mechanism**, not the arithmetic over a constant. A mutant that a *second* guard also catches
proves nothing about the guard under test: cut one door at a time and drive each half THROUGH
the composed predicate, the way `errandConsumerRegistry.walker.test.js` drives `readsAField`.
The immutable candidate is named in the packet and left un-mutated by design.

---

## §P7 · Gate-reading law

1. ⛔ **Never wrap `npm run check*` in `gate-mutex.sh --run`** — `test:ratchet` re-acquires and
   self-deadlocks, and **exit 3 is the mutex giving up, not a red**.
2. Run `check:tail` **bare, from a fresh shell**, with `; echo TRUE_EXIT=$?`.
3. ⛔ **Trust no exit status you did not capture.** The lying exit was re-confirmed live in the
   `gr-5a` train: the ratchet outlasted its window, backgrounded, and the harness reported the
   WRAPPER's exit 0 over a red gate. It was caught by reading the log, never by believing the code.
4. **Outlast the gate in your own turn.** A `&&`-chained red BLINDS every later step.

---

## §P8 · Standing STOP conditions

1. ⛔ **THE ERRAND ROW DTO IS WAR-WELDED.** `normalizeErrand` (`envoyErrandRecords.js:555-588`)
   refuses any row without a valid `offer`, `acceptance` and `snapshot`, whose `id` is not
   `envoyErrandIdForOffer(offer)`/`envoyAttemptIdForOffer(offer)`, or whose `purpose` is outside
   `PURPOSE_SET` — and `envoyErrand.js:184` refuses the mint on the same set. **No INT record can
   be persisted into `worldState.envoyErrands`.** An INT wave that finds itself needing to is at a
   STOP: the ARCH volume's *"NO NEW LEDGER — SP-1 errands"* is refuted, and the only landed
   precedent (GR-2) mints the ROUTE and CLASS through the head and persists in its **own** ledger.
   Which ledger an INT record persists in is a **persistence-shape decision and owner-gated.**
2. ⛔ **`ENVOY_PURPOSES` may not be widened** (HZ-VOCABFREEZE).
3. ⛔ **No `subsystemRowsInterior.js` may be minted without a chair ruling.** The ARCH volume's
   §2 JUDGMENT and §6 Q4 both assume the interior's flags will certify in a NEW lane — but
   `settlementPoliticsEnabled`, the interior's ONE live flag, joined the manifest on 2026-08-14
   (`simulationRules.js:278`) with its authored row at **`subsystemRowsVirtual.js:925`**. A new
   lane would split the interior's certification across two files on its very first wave.
4. ⛔ **`reframeEnabled` is an unaccounted strict gate.** `reframeKernel.js:80` reads
   `(rules).reframeEnabled === true` through a JSDoc-cast local, yet the key appears in NEITHER
   the manifest, `EXEMPT_RULE_KEYS`, nor `BACKLOG_RULE_KEYS`. INT-6 composes with it. If the
   walker is green only because the key is invisible, an edit near that gate could surface it and
   red a wave that did not cause it. **Resolve by executing
   `tests/lint/engineGatedRuleKeys.walker.test.js` BEFORE any INT-6 compile.**
5. ⛔ **`full_simulation`'s spread is unenumerated** (annex C205). INT-4's degraded-arm pin rests
   on `warDispositionEnabled` being lit there. Measure before writing that pin.
6. ⛔ Any movement of `osrFindings` off **1998**; of either typecheck ratchet off `173/173` /
   `1134/1134`; of `kindPoolFloorsRegistries` off **9**.
7. ⛔ **Any authored number** — band, threshold, window, cap, share, tuning key — without a
   chair signature under **OQ §42/§43**. §42.2: *"A value without an executed derivation is a
   promotion STOP."*

> **THE DELETE-CLAUSE LAW (OWNER_DECISION_QUEUE §38.4).** A charter's delete, retire or replace
> instruction is discharged only by an EXECUTED consumer census recorded in the packet. The INT
> volume issues exactly two, and both are **pre-executed in the SPV annex §2**: `WOUND_TYPE_RE`'s
> retirement is **1-site and self-contained** (definition `grievanceRead.js:48`, sole consumer
> `:82`, module-private) — ⚠ its eleven alternates include the STEMS `seiz` and `impos`, which a
> whole-word family test will not reproduce; and INT-8's two prose-ratchet row deletions target
> two byte-identical sites, with the **ratchet row contents UNVERIFIABLE at base** and
> re-measurable only at the publishing commit.

---

## §P9 · What every INT member packet still carries itself

Scope and boundary · the behaviour/identity contract · the exact change manifest with budgets ·
the acceptance matrix (≤ 8 cases) · wave-specific mutants and hazards · the executed preflight
receipts · the §45.2 validator status-sequence simulation · the predicted terminal figures with
declared interior reds BY FIGURE · the §31 anchor preflight · the §38.4 census when it issues a
delete clause · and one line citing this preamble **BY SHA-256**.
