# Settlement editor / EM-B1a — the op vocabulary and the FOURTEEN HOME ops: one constructor, one validator, and the stage partition asserted set-equal

- **Status:** DRAFT
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Packet version:** 8
  ⭐ **VERSION 8 (the chair, judgment 99, 2026-09-21; the build lane's STOP at `583f8f644`, `lane-em-b1a-t10-scratch/EM-B1a.STOP.md`) — TWO SEALED CASES RE-AIMED AT THE FOURTEEN, NOT ONE COUNT MOVED.** Version 7's A5 and A8 still carried version 1's eighteen-op text (R8's sweep named §2, §3, §7, §8, A1, A3, A4 and the manifest `_note`; A5 and A8 were outside it): A5 required three `rename-*` rows that A1 asserts ABSENT, and A8 required `validateOp` to validate a type that is not a key of `OP_TYPES`. Version 8 strikes each case's stale first clause and keeps its satisfiable half — A5: the delegation source scan, with the absence restated as the reason; A8: the `ok`/`errors` invariant, with `set-world-fact` answered as `unknown op type` at the fourteen. Also: "ten fields" becomes "eleven" wherever the ROW was meant (§2, §3, §7, A1, the capsule's A1 and test-file note; EM-A1's `Op` still carries ten), the test-file note's "eighteen" becomes "fourteen", and §16.1's `npcPresent` reads active-or-absent (`entities/npcs.js:160` writes `status: input.status || 'active'`, so an absent key is the writer's own spelling of active). Cases stay 8 of 8; the test home, §7, the `changeManifest`, the `checks`, every count and the lighting delta are untouched, so the count prover is green unchanged. The prior version is 7.
  - ⭐⭐ **Version 7 is the EM-T10 PRE-PROOF revision, measured whole at `429141e2d` (the read tip
    `read-tip-em-t8-tip`, detached; `git status --short` EMPTY before and after).** The J-T1 window
    `d31af2cee → 429141e2d` over all twenty-three change-manifest and `requiredSymbols` paths moved
    **ONE file** — `src/domain/entities/npcs.js` (+29/−2), EM-B1d's landing — and all **32**
    `requiredSymbols` resolve verbatim. ⛔ **FOUR CONTRADICTIONS THAT WOULD HAVE STOPPED THE BUILD
    ARE CURED, AND NO PATH, COUNT, BUDGET, CHECK OR ACCEPTANCE CASE MOVED.** (1) **A7 asserted the
    `NpcStatus` SIX with `jailed` ABSENT BY NAME while §6 took the post-EM-B1d SEVEN** — EM-B1d has
    LANDED and the typedef at `npcs.js:30` now reads seven, `jailed` PRESENT, so the arm as written
    parsed seven and asserted six against itself. A7 now takes the SEVEN. (2) **`set-institution-state`'s
    pool was spelled THREE ways** — §6's table said the *"`EntityStatus` SIX, post-EM-B1d"*, §6's
    two-shapes block said `{active, impaired, ruined, destroyed, vacant}` (no `removed`), and A7 said
    the *"`EntityStatus` five"* (no `ruined`). MEASURED: `status.js` did NOT move in the window and
    `EntityStatus` is still the FIVE without `ruined` — exactly as ODQ §934.47 add. 6 rules. All three
    now read **the op's own SIX-MEMBER POOL = the union's five PLUS `ruined`, which is a POOL member
    and NOT a union member**. (3) **§6's `OpTypeDeclaration` typedef still spelled `requires: readonly
    string[]`** while §16.3, §3's arithmetic (+1 per row), A4 and the capsule all require the
    `{ world, registry }` split; the typedef now carries the split, and the row's key count is spelled
    **ELEVEN** rather than "ten" (which is `Op`'s count, not the declaration's). (4) ⛔ **CROSS-PACKET:
    EM-A1 is BUILT and its `Op.requires` is `readonly string[]`** (read in `lane-em-a1-t9`), so a
    `makeOp` that copied the declaration's split object onto the `Op` reds `typecheck:domain:strict`,
    a sealed `checks` row — `makeOp` now FLATTENS. Beside those: §5's two NPC-writer addresses are
    refreshed (`:133 → :160`, `:158 → :185`), `Depends on` records that EM-B1d and EM-B1e are LANDED
    and EM-A1 alone is not, EM-B1h's `ruined_by_decree` relationship is stated, §7 gains interim rule
    17's tuning row with its executed 0/0 measurement, §10 gains interim rule 8's excluded-directory
    run and the wiring-census walker ALONE with its two red arms named, and the interim-rules row
    goes from eleven rules to **seventeen**. ⛔ **No op type, payload KEY, budget, acceptance COUNT
    (eight), required symbol, change row, check or non-goal moved**, and no path joins §7, the
    manifest or `checks`.
  - ⭐ Version 6 is the DOCS repair only (ESTATE-REPAIR-5, 2026-09-21, read tip
    `bdbf7c89c2569679bcccdb188d5d831ccfaa0e6d`; judgment 54): §6's BLOCK-7 note no longer says
    EM-A2b's `worldFact.goods` and `worldFact.services` pools *"are untouched and stay"* — the
    chair's ESTATE-REPAIR-4 ruling 1 moved both pool rows OUT of EM-A2b to **EM-P3c**'s sitting,
    so the note now reads **NEITHER POOL EXISTS IN WAVE 1**; §12's **R2** is brought to §6's
    **FIVE** `fact` values in the same act (it still spelled *"seven"*), and the capsule's **A8**
    is TRANSCRIBED from the `.md`'s A8, which version 5 had already corrected to the FIVE and the
    capsule had not followed. ⛔ **No op type, payload shape, budget, acceptance COUNT (eight),
    required symbol, change row, check or non-goal moved**, and no path joins §7, the manifest or
    `checks`.
  - ⭐ Version 5 is the DOCS repair only (ESTATE-REPAIR-4, 2026-09-20, read tip
    `bdbf7c89c2569679bcccdb188d5d831ccfaa0e6d`; judgments 33 and 41): §8's step 3 gains **ONE line**
    recording what `validateOp` does NOT enforce, with EM-C4a version 2's own clause quoted beside
    it; §6's `set-world-fact` key list and its per-fact pool map are corrected to **BLOCK-7 AS
    RULED** — the card declares **FIVE** world-fact rows, and `goods` and `services` are not facts
    the record holds; A8's "seven" follows; and §6 states in one line that `Op` and `EntityRef` are
    **EM-A1's typedefs, imported here and minted nowhere in this packet**. ⛔ **No op type, payload
    shape, budget, acceptance COUNT, required symbol, change row or non-goal moved**, and no path
    joins §7, the manifest or `checks`.
  - Version 4 is the DOCS repair only (ESTATE-REPAIR-3, 2026-09-20, read tip `bdbf7c89c2569679bcccdb188d5d831ccfaa0e6d`),
    bringing this packet under `COMPILE-RULES.interim.md`: §7's registration table gains the
    **P2.13 DEFERRED WIRING-CENSUS ROW** it had OMITTED entirely — the packet CREATEs TWO `.js`
    leaves under `src/domain/**`, so `stamp.producerIndexFiles` moves by `+2` and no sentence
    said so (interim rule 1). ⭐ EM-R6 §3b's binding note, which named this packet, is RE-AIMED
    at the APPLY POINT in EM-R6 version 5 — **the membership probe in `checks` STAYS as the
    standing guard.** ⛔ **No contract, budget, acceptance case, required symbol, change row or
    non-goal moved, and no path joins §7, the manifest or `checks`.**
  ⛔ **What version 3 changed, and why.** The DOCS repair only (ESTATE-REPAIR + ESTATE-REPAIR-2,
  2026-09-20): EM-R6's first-paint door priced with an always-executing membership probe, §7 gained
  the `CREATE src/domain/edit/worldConditions.js` row the capsule always carried, §7's row for the
  lighting walker (a path this packet does not edit) was deleted, and the deferred census row was
  re-pointed to the baseline JSON the refreeze actually writes. ⛔ **No contract, budget, acceptance
  case, required symbol or non-goal moved**; version 2 is in `pre-estate-repair-2026-09-20/`.
  ⛔ **What version 2 changed, and why.** Design **§19 ruling 6** (the simulation-forks survey,
  ruled by the chair 2026-09-19) CORRECTS §16.1's world-condition roster, and nothing else: of the
  four predicates version 1 declared absent, **`plotInMotion` is LIVE** — `worldState.stressors`
  carrying the pulse's own exported `COUP_STRESSOR_TYPE` — and **`openRoute` is LIVE, answered by
  TWO readers** — the regional graph's `confirmed` `trade_route` channel (LIVE, always) and the
  route network's edges (**LIVE-GATED**, reachable only when `routeLifecycleEnabled` is on, which
  it is not by default), the row recording AS DATA which reader answered. Only `pendingPeaceOffer`
  and `envoyArrived` remain `source: 'EM-E4'`, so the roster reads **eight live (one of them gated
  for its second reader), two honestly absent** where version 1 read six and four. Version 1's two
  absence citations are retained and REFUTED by measurement at `023eda2ec` (§16.1a) rather than
  deleted. The op vocabulary, the change manifest's paths, the acceptance count, the golden posture
  and the STOP conditions are version 1's, untouched; §3's budget is re-measured because the two new
  live readers add lines to `worldConditions.js`. Every figure re-measured at `023eda2ec`;
  `EM-B1a.evidence.md` §10–§15 carries the commands.
- **Verified base:** `fixes-2026-09-18-consist` at `d31af2ceebf643818201b2e2ab4a556765d2fc7c`
  ⚠ Ten commits moved the branch under this lane (11:01→11:33 EDT), all docs plus `.gitignore` and
  one edit to an existing test file. `d31af2cee` **IS an ancestor** of `7aa769830`, and **every
  path this packet measures is blob-identical across the window** (evidence §0). Held at
  `d31af2cee` per the chair's ruling (6): the chair re-pins every packet at promotion.
  ⭐ **VERSION 2 RE-PROVES THE BASE BY EXECUTION at `023eda2ec`.** `d31af2cee` **IS an ancestor** of
  `023eda2ec` (`git merge-base --is-ancestor`), and `git diff --stat d31af2cee 023eda2ec` over
  **every one of the twelve `requiredSymbols` paths** — the nine version 1 named plus the three
  version 2 adds (`worldPulse/coup.js`, `region/graph.js`, `worldPulse/routeNetworkLedger.js`) —
  prints **NOTHING: not one of them moved** (evidence §15). The base is therefore **held at
  `d31af2cee`**; the chair re-pins at promotion, not this lane. ⚠ The lighting census baseline DID
  move in the window (evidence §15.2) — which is why **§7 now states this packet's own DELTA and no
  absolute tuple at all** (chair's ruling R11). Nothing here needs to move when the base does.
- **Last revalidated:** 2026-09-19 11:33 EDT at `d31af2cee`; **version 2 re-measured 2026-09-19 at
  `023eda2ec2f8dd2d9286584d2496c6ac4ea5309e`** (the §16 roster and §3's budget only)
- **Depends on:** ⭐⭐ **RE-MEASURED AT THE EM-T10 PRE-PROOF, `429141e2d`: only ONE of the three is still unlanded.**
  **`EM-B1e` — LANDED**: `export function ruinInstitution(inst, { reason, fate })` at
  `src/domain/worldPulse/calamityKernel.js:242`. ⛔ **This packet DECLARES that writer and CALLS it
  nowhere** — it lands DARK with `guards: []`, and `ruinInstitution` is deliberately NOT a
  `requiredSymbols` row, because the standard pins only what the deliverable must PRESERVE. The
  CALLER is EM-C4a's one adapter.
  **`EM-B1d` — LANDED**: `npcs.js:30` now reads `'active'|'dead'|'exiled'|'jailed'|'missing'|'removed'|'retired'`
  — the SEVEN, in codepoint order — and exports `NPC_UNAVAILABLE_STATUSES`. ⛔ **It did NOT widen
  `EntityStatus`**, which stands at the FIVE (`status.js:23`, blob-identical across the window), exactly
  as ODQ §934.47 add. 6 ruled; `ruined` is this op's POOL member and is not a union member.
  **`EM-A1` — NOT LANDED (train EM-T9, BUILT on `em-t9-a1`).** It is the ONLY hard gate left:
  `src/domain/edit/types.js` is absent at the tip (`git ls-files src/domain/edit` lists
  `recordRegister.js` alone), and `@typedef {import('./types.js').Op}` under the sealed
  `npm run typecheck:domain:strict` has no home without it.
  ⭐ **`EM-B1h` IS NOT A GATE ON THIS PACKET, and the record says so in both directions.** EM-B1h's
  own header reads *"EM-B1a depends on this packet (its `ruined` arm passes `'ruined_by_decree'`,
  which the guard would otherwise REFUSE)"* — true of the OP AT APPLY TIME and false of this
  deliverable, which writes no fate, calls no writer and reaches no runtime. `ruined_by_decree` is
  declared in EM-B1h's `WORLD_PULSE_FATE_KIND` as `'closure'`, marked *"DECLARED, UNPRODUCIBLE until
  EM-B1a"* (read in `lane-em-b1h-t9`). ⛔ **EM-B1i is not a gate either**: its own non-goals strike
  *"the op that produces `ruined_by_decree` (EM-B1a's)"*, and its four change paths intersect this
  packet's three at ZERO.
- **Collision group:** `EM-B1b`, which **appends the seven off-stage rows to this packet's
  `OP_TYPES`**. B1a lands FIRST; B1b's arms re-assert B1a's totality so a dropped row reds.
  Measured: all 182 registered packets are TERMINAL, so nothing in the manifest reserves any path.
- **Commit authority:** edits only; the chair commits.
- **Baseline posture:** measured. Executed at this base: `factionRename.js` exports twelve symbols;
  `renormalizeFactionPower` **mutates in place** and returns the same array reference;
  `checkInstCompat` returns a **prose sentence** via `pickRandom`; `checkStructuralValidity`
  returns `{ violations, suggestions }`; `GATE_FEATURES` is the live `requires` table;
  `FACTION_ARCHETYPES` 13. ⛔ **The lighting census is carried as a DELTA, never an absolute tuple**
  (§7, chair's ruling R11) — the baseline is the chair's to stamp at promotion. No test was run.
- **Preamble:** docs/implementation/preambles/EM-PREAMBLE.md (SHA-256: TO BE STAMPED BY THE CHAIR)
- **Interim compile rules:** `COMPILE-RULES.interim.md` (the chair, 2026-09-20) — the fifth amendment's rules **1–17 as of 2026-09-21**, obeyed before they land. Where this packet and `EM-PREAMBLE.md` (SHA-256 `c9f33c8d2940372bde8a6d931e3d389b79516a90ed45405cbbbf3e698cc46675`, **RE-MEASURED with `shasum -a 256` at the read tip `429141e2d` on 2026-09-21 and unmoved** — the FOURTH amendment, still the tree's live text) disagree, the interim rules govern and this row is the record of it.
  ⓘ Per the chair's ruling (6) this lane does not stamp it; the hash has moved with each ruling.

---

## 1. Reconciled authority

1. ⭐ **ODQ §934.50 / design §18 — PRECONDITIONS ON THE SEALS.** An op's `requires` splits into
   `{ world: [...], registry: [...] }`: the world half is named pure predicates that decide which
   seals a card OFFERS; the registry half stays the guards' suggestive ordering condition. §16
   carries the measured predicate roster and the two structural consequences.
1a. ⭐⭐ **ODQ §934.50 addendum / design §19 RULING 6 — THE CONDITIONS, CORRECTED. THIS IS VERSION
   2's WHOLE ORDER.** *"Of the four predicates EM-B1a declared ABSENT: 'a plot in motion' is LIVE
   (`worldState.stressors.some(s => s.type === 'coup_detat')`); 'an open route' is TWO predicates —
   LIVE via `REGIONAL_CHANNEL_TYPES` `trade_route` with status `confirmed` (`region/graph.js`), and
   LIVE-GATED via `readRouteNetwork(ws).edges` behind `routeLifecycleEnabled` (off by default; the
   seal names which). 'A pending peace offer' and 'an envoy arrived at us' confirm as gaps — with
   the nuance that an envoy's arrival is LIVE on the SENDER's errand (readable across the campaign
   for a real neighbour) and absent only for a phantom. EM-B1a's `worldConditions.js` is re-pinned
   to this before promotion."* §16.1 carries it, re-measured by symbol at `023eda2ec`; §16.1a
   retains version 1's two refuted citations rather than deleting them.
2. **THE CHAIR'S RULINGS, 2026-09-19** (ODQ §934.36 addendum, §934.46): **(1)** EM-B1 **SPLITS** —
   this packet is **B1a**: the machinery (`makeOp`, `validateOp`, the `stage`/`consequence`
   partitions asserted set-equal) plus the HOME ops; the seven off-stage ops and the coverage
   walker are **EM-B1b's**. **(2)** The home set gains `set-npc-status`, `set-institution-state`
   (design §15) and `set-world-fact` (design §14 final — **B1a only DECLARES the op and its
   payload shape; the engine is EM-B2's**), and **`set-state` is STRUCK**. **(6)** the base stays
   `d31af2cee`. **(7)** the `checkInstCompat` finding is accepted and the charter's EM-C3 row is
   corrected to `checkStructuralValidity` + `GATE_FEATURES`. **(8)** the census counts test files.
2. ⭐ **ODQ §934.47 ADDENDUM 6 (ledger `427aa5f00`) — THE EDITOR WRITES THE TREE'S EXISTING
   SHAPES.** On lane P2's measurement that `ruined` is the PULSE's own live vocabulary in 22 files
   and that `rosterProvenance.js:210` keeps it deliberately apart from the composer's
   `STATUS_REMOVED` set, **`EntityStatus` is NOT widened.** Instead `set-institution-state` offers
   the pool of five and writes **two different shapes by value** (§6). No union changes, so **no
   behaviour-shift measurement is owed**, and **this packet's budget is unchanged — a contract,
   not a file.**
3. **ODQ §934.43 / design §13 — the phantom consequence rule.** `Op` carries
   `stage?: 'home'|'off-stage'`; **every type in this packet is `home`**, and the partition's
   other half is B1b's. Consequence is decided at apply time by `consequenceFor(target)`, which
   **EM-F1 owns** and this packet neither authors nor imports.
3. **ODQ §934.46 / design §15** — NPC `status` and institution `state` are typed roots from a
   pool, **FINITE-SEMANTICS, never free text**; destruction is a state the record keeps, removal is
   erasure; *"the readers that consume them are named in the packet that adds each field."*
4. **ODQ §934.45 / design §14 FINAL** — a world fact, once the city exists, is edited **without
   re-rolling**: the change re-derives computed facts with every chosen fact pinned. The engine is
   `rederive(record, config′, layer)` and it is **EM-B2's, the load-bearing packet**.
5. **THE PROMISE** — lived history is immutable; an applied decree reopens read-only.
6. **design §12 GOVERNS** — §12.3 names are JOIN KEYS (a rename is a typed op running the existing
   cascade); §12.13 ONE generic decree adapter, never twenty.
7. **`EM-PREAMBLE.md`** §P2–§P5 (HZ-JOINKEY, HZ-PHANTOM, HZ-DERIVED), §P8 — cited by hash.
8. **ARCH §1, §2 (the amended `Op`), §5, §9 (the amended op list).**
9. Live code at `d31af2cee`.

**Resolved contradictions:**

- The op-type count. ARCH §9 now reads *"Op types (twenty-five, in two packets)"* and names the
  **eighteen HOME** types explicitly, including the three `rename-*` ops and striking `set-state`.
  ⭐ **SUPERSEDED FOR THIS PACKET at version 2 by the chair's ruling R8** (ODQ §934.47 add. 10/11):
  EM-B1c took four of those eighteen plus `schedule-event`, so **EM-B1a holds the FOURTEEN of §6**.
  The ARCH's twenty-five-across-two-packets count is unchanged; the SPLIT between them moved.
  The lane's earlier R1 (20 vs 23) is **CLOSED by the chair's ruling (2) and the amended ARCH**.
- `checkInstCompat` as the prerequisite rule's ground — **CLOSED by ruling (7)**; the correction is
  carried in this packet's `requiredSymbols` so EM-C3's compiler finds it.

---

## 2. Outcome

**Observable result:** `src/domain/edit/operations.js` is the estate's single typed vocabulary of
what a DM may do to a settlement at home: **fourteen** op types, each declaring its target kind,
payload schema, stage, consequence policy and four typed relations; `makeOp` builds one;
`validateOp` judges one; nothing anywhere constructs an op another way.

**Definition of done:** `OP_TYPES` holds exactly **THE FOURTEEN** home types of §6; every row carries
all eleven declared fields (§6's `OpTypeDeclaration`; EM-A1's `Op` carries ten), none absent, none undeclared; `makeOp` / `validateOp` have the exact
signatures of §6; every type is `stage: 'home'` and `consequence: 'home'`, with the two partitions
asserted set-equal; relational integrity is total and symmetric; the leaf lands DARK.

In scope: (1) the vocabulary with `makeOp` / `validateOp`; (2) no integration — headless, the
first consumer being EM-C4's single generic adapter; (3) the relational-integrity arm (A4), which
keeps a one-sided relation from making a guard fire for one ordering and not the other.

Explicit non-goals: **EM-B1b's** seven off-stage ops, the `stage: 'off-stage'` half and
`tests/lint/opGuardCoverage.walker.test.js` with its mutation-coverage row; the guard RULES
(EM-C3) and the folding engine (EM-C2); **`consequenceFor`** (EM-F1); **`rederive` and every
pin/re-derivation mechanic** (EM-B2) — this packet declares `set-world-fact`'s payload shape and
nothing more; the registry (EM-C1), the layer (EM-B2), the persisted keys (EM-B3), the tick
(EM-E1); any golden, tuning, migration or paid-surface behaviour.

---

## 3. Hard scope budget

| Limit | Packet budget | Standard |
|---|---:|---:|
| Behavior families | `1` | 1 |
| New persisted record families / writers / flags / surfaces | `0` | ≤1 each |
| Direct production consumers | `0` — lands DARK | ≤2 |
| New logic-bearing production leaves | `2` — `operations.js` + `worldConditions.js` (§16.2) | ≤2 |
| Existing logic-bearing production files modified | `0` | ≤3 |
| Additional registration-only files | `0` | ≤3 |
| Handwritten files total | `3` (+1 deferred census row) | ≤12 |
| New/changed effective production lines | **≈296–320 (estimate range)** | ≤400 |
| **Effective lines — leaf 1, `operations.js`** (FOURTEEN rows, R8) | ✅ **≈213–227 of 250 — inside, with ≥23 lines of margin** (at eighteen it was ≈231–249) | ≤250 |
| **Effective lines — leaf 2, `worldConditions.js`** (ten predicates, SCOPED per R9) | ✅ **≈83–93 of 250 — inside, with ≥157 lines of margin** (version 1 ≈60; version 2 pre-scoping ≈73–83) | ≤250 |
| Delta in a shared/hot file | `0` — names no hot file | ≤15 |
| Acceptance cases | `8` | ≤8 |

Overrides approved before dispatch: `NONE`. **HOT FILES: none named.**

**⭐ THE ARITHMETIC FOR LEAF 1, RE-COUNTED AT THE FOURTEEN (chair's ruling R8):**

| part | per unit | count | effective |
|---|---:|---:|---:|
| op rows (eleven declared fields each, tightly written) | 8–9 | **14** | **112–126** |
| the `requires: { world, registry }` split (§16.3) | +1 | 14 | **+14** |
| `makeOp` | — | — | ≈15 |
| `validateOp` (the seven-step algorithm of §8) | — | — | ≈40 |
| closed vocabularies (`OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, target kinds, payload-spec kinds) | — | — | ≈12 |
| helpers + freezing | — | — | ≈15 |
| imports | — | — | ≈5 |
| **total** | | | **≈213–227 of 250** |

⇒ ✅ **inside, with ≥23 lines of margin** — and this is exactly R6's closure figure, now derived in
the open rather than asserted. At eighteen rows the same arithmetic gave 144–162 + 18 + 87 =
**≈249–267, over the cap**, which is why EM-B1c exists. **Crossing 250 stays a STOP (§11).**

**⭐ THE ARITHMETIC FOR LEAF 2, RE-MEASURED AT VERSION 2 (design §19 ruling 6).** Two of the four
declared-absent stubs become live readers, which is the whole delta:

| part | version 1 | version 2 | why it moved |
|---|---:|---:|---|
| imports of the readers, by symbol | ≈4 | **≈9** | +5 import statements: `COUP_STRESSOR_TYPE` (`worldPulse/coup.js`), `activeChannelsFrom`+`REGIONAL_CHANNEL_TYPES` (`region/graph.js`), `readRouteNetwork`+`routeLifecycleActive`+`ROUTE_GRADES` (`worldPulse/routeNetworkLedger.js`), `edgeKeyBetween` (`worldPulse/relationshipEvolution.js`), `getSpatialLedger` (`spatial/spatialLedgerAccess.js`) — the last two arrive with **R9's scoping** |
| single-reader LIVE predicates | 6 × ≈6 = ≈36 | **7 × ≈6 = ≈42** | `plotInMotion` joins the six |
| `openRoute` — two readers, the gate, the reader-identity data | — | **≈12** | the regional-channel read, the `routeLifecycleActive` gate, the `readRouteNetwork(ws).edges` read, and the row's declared `readers` |
| declared-absent rows (`false` + its `source` note) | 4 × ≈2 = ≈8 | **2 × ≈2 = ≈4** | two rows left the absent set |
| the frozen map, the row shape, freezing, helpers | ≈12 | **≈14** | the row shape gains `readers` beside `source` |
| ⭐ **R9 SCOPING — subject + live stage, per row** | — | **+≈8** | siege `.some(targetId\|coalition)` +1 · trade edge-key resolve +1 · belief per-settlement index +1 · `plotInMotion` `affectedSettlementIds` + live-stage filter + its own frozen live-stage set +3 · `openRoute` r2 endpoint filter + `grade !== 'hidden'` +2. **The other five rows cost ZERO — their readers are already scoped (§16.1's scope column).** |
| **total** | **≈60** | **≈83–93 of 250** | ✅ **inside, ≥157 lines of margin — no split, no squeeze** |

⇒ **the packet's ≤400 total is `operations.js` + `worldConditions.js` = ≈213–227 + ≈83–93 =
≈296–320 of 400.** ✅ **Inside, with ≥80 lines of margin.**

✅ **R8 IS CLOSED BY THE CHAIR AND THE DRIFT IS GONE:** the roster is **FOURTEEN**, spelled once at
§6 and referenced everywhere else. §2, §3, §7, §8, A1, A3, A4 and the manifest's `_note` now name
that one list. **R9's scoping is inside 250 on leaf 2 ⇒ PROCEED, no split.**

⚠⚠ **IT FITS, AND THE MARGIN IS THIN — SO THE NEXT SPLIT IS PRE-DECLARED RATHER THAN DISCOVERED.**
The chair's instruction was explicit: *if over, propose the next split line; do not squeeze.* The
estimate is not over, so the packet stands whole — but at 249 there is one line of room, and the
estate's hot-file lesson is that an estimate wrong in the dangerous direction authorizes a bad
edit. **If implementation measures the leaf over 250, take EM-B1c:** the three `rename-*` ops plus
`set-world-fact` (four rows, ≈36 effective) move out, leaving B1a at ≈195–213. That line is
principled rather than arbitrary — those four are exactly the rows that delegate to machinery
another packet owns (the rename cascade; EM-B2's `rederive`), while the other fourteen are
self-contained roster and field ops. **§11 makes crossing 250 a STOP, never a squeeze.**

---

## 4. Sealed dispatch and preflight

```sh
npm run implementation:dispatch -- EM-B1a
```

Expected: capsule emitted; ancestry and substrate proven; **all THREE CREATE targets ABSENT**
(`src/domain/edit/operations.js`, `src/domain/edit/worldConditions.js`,
`tests/domain/editOperations.test.js` — **re-measured absent at `023eda2ec`**, evidence §15.3); no
non-CREATE production target; every `requiredSymbols` row resolving.
⚠ Version 1's §4 named only two of the three CREATE targets while its own manifest carried three;
version 2 corrects the omission — the manifest was right and this line was short.

⚠ **THE WORKTREE IS SHARED AND THE BASE HAS MOVED TEN TIMES DURING COMPILE.** Re-read
`git rev-parse HEAD` in the same command as the dispatch; a descendant is admissible only on the
measured docs-only clause with blob-identity proven, never assumed.

---

## 5. Verified tree contract

Every row found BY SYMBOL at `d31af2cee`; commands in `EM-B1a.evidence.md`.

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| **The rename cascade — whole-settlement writer** | `src/domain/factionRename.js` | `applyFactionRenameToSettlement` | `(settlement, oldName, newName) → { changed: boolean, touched: string[] }`; returns `{changed:false, touched:[]}` when the settlement is not a record, either name is falsy, **or `oldName === newName`** | `rename-faction`'s declared writer. ⛔ **No second cascade** (HZ-JOINKEY) |
| **The cascade — patch form** | `src/domain/factionRename.js` | `factionRenameChanges` | `(settlement, oldName, newName) → { changed, touched, changes: StoredRecord }`; deep-clones only the `CASCADE_BUCKETS` present | The form a store writer takes; named so the op declares WHICH entry point it means |
| **The cascade — NPC half** | `src/domain/factionRename.js` | `applyNpcRenameToSettlement`, `npcRenameChanges` | The same pair for `rename-npc` | `rename-npc`'s declared writer |
| **The join surfaces** | `src/domain/factionRename.js` | `FACTION_RENAME_SURFACES`, `NPC_RENAME_SURFACES` | Frozen declared lists, each row `{ path, kind, why }`; the NPC family is SPREAD across `NPC_HOMES` *"so the two homes cannot drift — the drift IS the bug this replaced"* | The evidence a name is a JOIN KEY; EM-A3's census reads the same lists |
| **Faction resolution** | `src/domain/factionRename.js` | `resolveFactionForRename` | `(settlement, factionIndex)` — the one way to turn an index into the faction a rename targets | `makeOp`'s target resolution for `rename-faction` |
| **Totality writer** | `src/generators/power/rulingStructure.js` | `renormalizeFactionPower` | `(factions) → factions`. ⚠ **MUTATES IN PLACE** (`factions[s.i].power = s.floor`) and returns the SAME reference; largest-remainder to an exact 100, ties by current order; returns the argument unchanged on an empty or all-zero roster | Declared as `rebalance-power`'s `fulfil` writer. ⛔ **Called nowhere here** — EM-C3 calls it. The mutation is recorded because a caller assuming purity would corrupt a roster |
| ⛔ **REFUTED — a prose picker** | `src/generators/structuralValidator.js` | `checkInstCompat` | `(institutions, tier, _magicPriority) → string` — a keyword ladder returning a NARRATIVE SENTENCE via `pickRandom`. No boolean, no violations, and it **consumes a draw** | Named because it exists and the finding is accepted (ruling 7). ⛔ Not the prerequisite rule's source; called nowhere |
| **The real validity checker** | `src/generators/structuralValidator.js` | `checkStructuralValidity` | `(institutions, config = {}) → { violations, suggestions }` | Half of ruling (7)'s correction; EM-C3's ground. Called nowhere here |
| **The real prerequisite table** | `src/data/spatialData.js` | `GATE_FEATURES` | A live `requires` map — `Citadel` requires `City walls and gates` / `Massive walls…`; `Gates (if walled)` carries `suggestionOnly: true` and its own `reason` | The other half of ruling (7)'s correction. Called nowhere here |
| **The category vocabulary** | `src/domain/factionArchetypes.js` | `FACTION_ARCHETYPES` | Frozen 13 values, executed. ⭐ Its sibling `factionArchetype(f)` (`:103`) **DERIVES** the archetype from `f.category` | `add-faction` / `set-field`'s closed **`category`** payload type — never `archetype`, which is a derivation |
| **The seat flag and the derived name** | `src/generators/power/rulingStructure.js` | the `powerStructure` construction at `:787` | `governingName: (factions.find((f) => f.isGoverning) \|\| {}).faction \|\| null`, with the file's own comment: *"it must always name the faction entry that carries `isGoverning`"* | ⛔ THE REASON `set-power-holder` MOVES THE FLAG, NOT THE NAME |
| **The transfer of power** | `src/domain/rulingPower.js` | the return at `:657` | `governingName: toGovernment, government: toGovernment`, beside `previousGovernments` and `publicLegitimacy` — the ONE path that moves a seat and keeps both fields in step | **`set-power-holder`'s declared writer** |
| **NPC status vocabulary** | `src/domain/entities/npcs.js` | `NpcStatus` (typedef, `:30`) | ⭐ **RE-MEASURED AT `429141e2d`: `'active'\|'dead'\|'exiled'\|'jailed'\|'missing'\|'removed'\|'retired'` — the SEVEN, in codepoint order, `jailed` PRESENT.** EM-B1d LANDED it; version 6 and earlier recorded the pre-B1d six | `set-npc-status`'s closed enum, at the SEVEN |
| **The NPC writers** | `src/domain/entities/npcs.js`, `src/domain/events/mutateEntities.js` | `createNpc`, `killNpc`, `assignNpcToRole`; the `mutateEntities` export block | The ops layer's existing status writers (`status: input.status \|\| 'active'` **`:160`**; `killNpc` **`:185`** writing `status: 'dead'` **`:186`**) — ⭐ **the three addresses moved with EM-B1d's +29 lines and are refreshed here, not inherited** | ⛔ **The op's writer. Never a second path** |
| **Institution state vocabulary** | `src/domain/entities/status.js` | `EntityStatus` (typedef, `:23`) | ⭐ **RE-MEASURED AT `429141e2d` AND UNMOVED IN THE WINDOW: `'active'\|'impaired'\|'removed'\|'destroyed'\|'vacant'` — FIVE, each with its authored gloss, and NO `ruined`.** EM-B1d did not widen it (ODQ §934.47 add. 6) | `set-institution-state`'s POOL is the five **PLUS `ruined`** = SIX; the UNION stays at five and A7 asserts it unwidened |
| **Stable order** | `src/domain/deterministicSort.js` | `compareCodepoint` | The estate's one sanctioned, locale-free string order | `OP_TYPES`' key order and `validateOp`'s `errors` order |
| **Test precedent** | `tests/domain/institutionFounding.test.js` | `describe('MF-T2Q — the institution founding year')` + seven straight-line `it` | One literal `describe`, no `.each`/`runIf`/nesting, positive control first | Copy this proof shape (§P3.4) |
| **Test precedent (registry)** | `tests/lint/chooserTotality.walker.test.js` | `const SCAN_ROOTS`; HB-1's A7/A8 | A register arm asserts its table SET-EQUAL to the live scan in BOTH directions with a full offender list | Copy for A1/A3/A4's totality arms |

**Forbidden alternatives:**

- ⛔ **no second force-return mechanism** (chair amendment, design §13) — this packet writes none
  and names none as a write target;
- ⛔ **no phantom-side state, ever** — no war state, treaty, trade route, envoy state,
  faction-power or legitimacy shift derived from a phantom (§P8);
- ⛔ **no `rederive`, no pin machinery, no re-derivation of any kind** — `set-world-fact` DECLARES
  a payload and nothing more; the engine is EM-B2's (HZ-DERIVED);
- no second rename cascade, archetype vocabulary, string order, PRNG stream or writer;
- **no adapter per op type** — EM-C4 adds exactly ONE (§12.13);
- no import of `src/kernel/prng.js`, `src/kernel/rngContext.js`, `src/components/**` or
  `src/store/**`;
- no edit to `factionRename.js`, `rulingStructure.js`, `structuralValidator.js` or
  `spatialData.js` — **this packet modifies ZERO existing production files**;
- no files outside the manifest.

---

## 6. Exact contracts

### Inputs and outputs

```js
/** @typedef {import('./types.js').Op} Op */
/** @typedef {import('./types.js').EntityRef} EntityRef */
// ⛔ BOTH TYPEDEFS ARE EM-A1's AND ARE ONLY IMPORTED HERE. This packet mints neither, re-declares
// neither, and widens neither. What IS this packet's is the closed SEVEN `EntityRef.kind` VALUES,
// which it fixes through every row's `target` field (§6's row schema) — the typedef's home and its
// value set are different facts, and EM-A1 version 5 pins them that way.

/** The closed stage vocabulary (ARCH §2 as amended by design §13). Frozen. */
export const OP_STAGES;                 // readonly ['home', 'off-stage']

/** The closed consequence policies. Frozen. */
export const OP_CONSEQUENCE_POLICIES;   // readonly ['home', 'by-target-reality']

/** The catalogue. Frozen; every value carries EVERY field of the row schema. */
export const OP_TYPES;                  // Readonly<Record<string, OpTypeDeclaration>>

/**
 * Build one op. PURE: reads no world, consumes no draw, mints no id. Copies the declared
 * `stage`, `consequence` and four relations onto the `Op`, FLATTENING `requires` from the
 * declaration's `{ world, registry }` pair into EM-A1's `readonly string[]`.
 * @returns {Op|null}  null when `type` is not a key of OP_TYPES or `target` is not a
 *                     well-formed EntityRef. NEVER throws, NEVER returns a partial op.
 */
export function makeOp(type, target, payload);

/**
 * Judge one op against a world. PURE and TOTAL.
 * @returns {{ ok: boolean, errors: readonly string[] }}
 *          `errors` is ALWAYS a frozen, codepoint-sorted array — [] when ok.
 *          ok === (errors.length === 0), asserted as an invariant.
 */
export function validateOp(op, world);
```

⭐ **`OP_STAGES` and `OP_CONSEQUENCE_POLICIES` carry BOTH values even though this packet uses only
one of each.** The vocabularies are the partition's definition and B1b appends rows against them;
minting them half-populated would force B1b to edit a frozen constant, which is the second-home
mistake. A3 asserts both vocabularies exact and asserts that **every row in THIS packet uses the
`home` member**, so the unused members are declared but provably unreached at this tip.

### State schema — the op-type row, exactly

```js
/**
 * @typedef {{
 *   target: 'settlement'|'institution'|'npc'|'faction'|'power'|'phantom'|'section',
 *   payload: Readonly<Record<string, PayloadFieldSpec>>,
 *   stage: 'home'|'off-stage',
 *   consequence: 'home'|'by-target-reality',
 *   requires: { world: readonly string[], registry: readonly string[] },
 *   enables: readonly string[],
 *   relatedTo: readonly string[],
 *   conflictsWith: readonly string[],
 *   duration: number|null,
 *   guards: readonly Function[],
 *   guardsStated: string,
 * }} OpTypeDeclaration
 *
 * @typedef {{ kind: 'pool'|'free'|'ref'|'int'|'enum', pool?: string,
 *   values?: readonly string[], required: boolean }} PayloadFieldSpec
 */
```

⭐⭐ **THE ROW CARRIES ELEVEN KEYS, AND `Op` CARRIES TEN — THEY ARE DIFFERENT COUNTS.**
`OpTypeDeclaration` is `target · payload · stage · consequence · requires · enables · relatedTo ·
conflictsWith · duration · guards · guardsStated` = **ELEVEN**; EM-A1's `Op` is
`type · target · payload · stage · consequence · requires · enables · relatedTo · conflictsWith ·
duration` = **TEN**. Version 6 and earlier said "ten" of the row, which is `Op`'s figure; A1 asserts
**ELEVEN** on every row.
⛔ ⭐ **AND `requires` IS THE SPLIT OBJECT ON THE DECLARATION AND A FLAT ARRAY ON THE `Op`.**
§16.3 makes every row's `requires` a `{ world, registry }` pair (+1 effective line per row, priced in
§3), while EM-A1's BUILT `types.js` declares `Op.requires: readonly string[]` — measured in
`lane-em-a1-t9`. **`makeOp` therefore FLATTENS: `requires: Object.freeze([...decl.requires.world,
...decl.requires.registry])`.** Copying the pair onto the `Op` would red
`npm run typecheck:domain:strict`, which is a SEALED `checks` row, and re-opening EM-A1 to widen a
typedef that is already built is the more expensive cure. The KINDS stay readable where they are
judged — A4 asserts them on the DECLARATION, which is what the guards read.

⛔ **EVERY FIELD IS REQUIRED ON EVERY ROW. None is optional; none may be omitted "when empty."**
An empty relation is `[]`; an absent duration is `null`; empty coverage is `guards: []` **plus a
non-empty `guardsStated`**. A row missing a field is an A1 red, not a default.

⚠ **THE OP SHAPE IS PERSISTED BY A LATER PACKET, WHICH IS WHY IT IS RIGID.** EM-B3 stores
`decrees: Decree[]` and every `Decree` carries an `Op`. A field added after EM-B3 lands is a
stored-shape change with a migration cost. The rigidity is priced, not fussiness.

### ⭐⭐ THE FOURTEEN HOME OP TYPES — THE ONE LIST (chair's ruling R8, ODQ §934.47 add. 10/11)

⛔ **THIS IS THE CANONICAL ROSTER. §2, §3, §7, §8, A1, A3, A4 and the manifest's `_note` all name
THIS list and no other** — the drift that made version 2's R8 necessary was four places spelling
the roster separately. Authored and asserted in `compareCodepoint` order, which is the order below:

`add-faction` · `add-institution` · `add-npc` · `found-phantom` · `promote-phantom` ·
`rebalance-power` · `remove-faction` · `remove-institution` · `remove-npc` · `set-field` ·
`set-institution-state` · `set-npc-status` · `set-power-holder` · `set-relationship`

**⇒ FOURTEEN.** ⚠ Version 1 said eighteen because it predated EM-B1c's ratification.

**THE FIVE THAT SIT WITH EM-B1c, named here so no reader has to reconstruct the split:**

| op type | why it is B1c's |
|---|---|
| `rename-faction` · `rename-npc` · `rename-settlement` | they delegate to machinery another packet owns — the existing rename cascade (`factionRename.js`), the §3 split line *rows that delegate* |
| `set-world-fact` | same line: its engine is EM-B2's `rederive` |
| `schedule-event` | ⭐ **the NINETEENTH home op — it was never in version 1's eighteen.** Design §18 makes it a HOME op (*"always … `when` at or after the next tick"*); it arrived after the cap was already exceeded, so it rides with B1c (R7, closed) |

⇒ 18 − 4 = **14 here**, and B1c carries **5** (the four that left plus the one that never landed here).

⛔ **`set-state` IS STRUCK** (ruling 2; design §14: system states are DERIVED and are never
editable on any card). Its absence is asserted by name in A1, so a later author cannot restore it
without a red.

**The three new rows' exact payloads:**

| type | target | payload | notes |
|---|---|---|---|
| `set-npc-status` | `npc` | `{ status: { kind: 'enum', values: <the `NpcStatus` SEVEN>, required: true }, cause: { kind: 'pool', pool: 'cause.remove', required: false } }` | ⭐ **MEASURED AT `429141e2d`, NOT PREDICTED: EM-B1d HAS LANDED and the typedef is the SEVEN** — `active, dead, exiled, jailed, missing, removed, retired` (`npcs.js:30`, codepoint order). The op **CREATES the field** on an NPC that lacks it (measured: it exists today on roughly one NPC in ten, the structural seats, value `active`) and calls the **existing ops-layer writers** — never a second path. ⛔ FINITE-SEMANTICS; `kind: 'free'` is a STOP |
| `set-institution-state` | `institution` | `{ state: { kind: 'enum', values: <the OP'S OWN SIX-MEMBER POOL>, required: true }, cause: { kind: 'pool', pool: 'cause.remove', required: false } }` | ⛔⛔ **THE POOL IS THE OP'S, NOT THE UNION'S, AND THAT IS THE WHOLE OF ODQ §934.47 add. 6.** `active, destroyed, impaired, removed, ruined, vacant` = the `EntityStatus` FIVE **plus `ruined`**, which is the PULSE's word and **is NOT a member of `EntityStatus`**. ⭐ **MEASURED AT `429141e2d`: `status.js` did not move in the J-T1 window and the union is still the five — EM-B1d widened `NpcStatus` ONLY.** Version 6 called this "the `EntityStatus` SIX, post-EM-B1d", which no measurement supports; A7 asserts the union UNWIDENED at five and the pool at six ("abandoned" is `vacant`). ⭐ `destroyed` and `remove-institution` are **different acts** — the record keeps what was destroyed and forgets what was removed (§15), and the tree already spells both |
| `set-world-fact` | `settlement` | `{ fact: { kind: 'enum', values: <the FIVE world-fact keys>, required: true }, value: { kind: 'pool', pool: '<per fact>', required: true } }` | ⛔ **DECLARATION ONLY, AND ⛔ THE ROW ITSELF IS EM-B1c's** (R8 moved it with the other four; it is spelled here only because its payload shape was ruled in the same act). ⭐ **CORRECTED BY THE CHAIR'S BLOCK-7 RULING (judgment 33):** the keys are the **FIVE** EM-A1 version 5 declares — `terrain, culture, monsterThreat, resources, stressors`. ⛔ **`goods` and `services` are NOT facts the record holds** (`resolveConfig` lifts `_goodsToggles` / `_servicesToggles` into context keys; `record.config` carries neither over 36 settlements; they live on the save's `toggles` column) and **`tradeAccess` is not among the declared five either** — it is EM-P3b's eighth key. **No re-derivation, no pin, no `rederive` call** — the engine is EM-B2's (§14 final) |

### ⛔ `set-power-holder` MOVES THE FLAG; THE NAME FOLLOWS (the chair's contract fact 1)

`powerStructure.governingName` has **two writers** in the tree, plus one propagation site, and the
op writes **none of them directly**:

| # | site | what it is |
|---|---|---|
| W1 | `src/generators/power/rulingStructure.js:787` | **GENERATION.** Derives the name from the roster: `(factions.find(f => f.isGoverning) || {}).faction`. Its own comment is the law — *"it must always name the faction entry that carries `isGoverning`"* |
| W2 | `src/domain/rulingPower.js:657` | **THE TRANSFER OF POWER.** Writes `governingName` and `government` together with `previousGovernments`, `publicLegitimacy` and `stability` |
| P1 | `src/generators/power/economyReconciliation.js:277` | a **propagation**, copying `projected.governingName` — not an independent decision |

⛔ **So `set-power-holder`'s payload names the new holder and the op moves `isGoverning` on the
roster, calling W2's transfer path; it NEVER writes `governingName` or `government` itself.** A
direct write would put the canonical name out of step with the flag that every sim consumer keys
on (the file at W1 lists them: factionProfile legitimacy inheritance, ruling_authority governing
power, hook escalation, the simulation spine, world-event legitimacy deltas). Asserted in A3.

### ⭐ `set-institution-state` WRITES TWO SHAPES BY VALUE (§934.47 add. 6)

The op offers the **SIX-MEMBER POOL {active, destroyed, impaired, removed, ruined, vacant}** — the
`EntityStatus` five plus `ruined` — and writes the shape the tree already uses for that value, never
a new one. ⚠ Version 6 spelled this pool five-strong and dropped `removed`; the pool and §6's payload
row are now one list:

| value | shape written | via |
|---|---|---|
| `active` · `destroyed` · `impaired` · `removed` · `vacant` | the composer's own constants — `STATUS_ACTIVE` / `STATUS_DESTROYED` / `STATUS_IMPAIRED` / `STATUS_REMOVED` / `STATUS_VACANT` from `src/domain/entities/status.js` | the existing entity-status writers |
| **`ruined`** | ⛔ **the PULSE's own shape**, not the composer's | the pulse's ruin path — **on a canonized town** through the tick; **on a draft** directly |

⛔ **`ruined` is NOT a member of `EntityStatus` and this op does not make it one.** It is the
pulse's word, and writing it through the composer's constants would merge two vocabularies the
tree keeps apart on purpose.

⭐⭐ **RULED (ODQ §934.47 add. 7, option a): the `ruined` arm CALLS `ruinInstitution(inst, { reason, fate })`**, the ONE exported writer **EM-B1e** mints on the calamity kernel — ⭐ **LANDED, measured at `calamityKernel.js:242`.** ⛔ **THIS PACKET DECLARES THAT CALL AND MAKES IT NOWHERE:** it lands DARK, the caller is EM-C4a's one adapter, and `'ruined_by_decree'` becomes PRODUCIBLE only once **EM-B1h** lands the closed `worldPulseFate` vocabulary that declares it (`'closure'`, *"DECLARED, UNPRODUCIBLE until EM-B1a"*). EM-B1h is therefore a gate on the APPLY packet and **not** on this one. The op passes
`fate: 'ruined_by_decree'` and `reason` = the decree's own cause from the removal pool; the pulse's
disaster path passes `'destroyed_by_disaster'` and its own reason. **One shape, one writer, two
callers** — so a DM's ruin and a disaster's leave the same record and the pulse's own history does
not move (EM-B1e's A1 proves it byte-equal). ⛔ This packet **authors no ruin shape of its own**;
a second writer here is a STOP.

⚠⚠ **The three measurements that forced option (a), retained as the record (evidence §6):**

1. **The shape has FIVE keys, not two.** The only live writer of that literal is
   `src/domain/worldPulse/calamityKernel.js:250-252`:
   `{ ...inst, status: 'ruined', _worldPulseInactive: true, _worldPulseEconomyClosed: true,
   worldPulseFate: 'destroyed_by_disaster', remnantReason: reason }`.
2. **Two of those keys are CALAMITY-SPECIFIC.** `worldPulseFate: 'destroyed_by_disaster'` would be
   a **lie** on a DM decree — the town was not struck by a disaster — and `remnantReason` takes a
   calamity's reason string.
3. ⛔ **THE RUIN PATH IS NOT EXPORTED.** `ruin` is a module-private arrow function declared inside
   another function body; `calamityKernel.js`'s exports around it are `promotesTo` (`:180`) and
   `strikeCapForTier` (`:196`). **There is no exported symbol for this op to call**, so the ruling's
   *"name the one the op calls, by symbol"* has no answer at this base. **RAISED R4.**

✅ **R4 is CLOSED by the ruling above**: the door is `ruinInstitution`, minted by EM-B1e, and this
packet's `Depends on` carries it.

⛔ **`set-world-fact`'s `value` pool id is resolved per `fact`, and the mapping is DATA in this
row, not logic**: `terrain → worldFact.terrain`, `culture → worldFact.culture`,
⭐ `monsterThreat → worldFact.monsterThreat` (EM-A2a version 4's row),
`resources → worldFact.resources`, `stressors → worldFact.stressors`. **FIVE, and no more.**

⛔⛔ **THREE KEYS LEFT THIS MAP AT VERSION 5, EACH BY A RULING, AND NONE BY OMISSION:**
1. **`goods` and `services` — the chair's BLOCK-7 ruling (judgment 33).** They are not facts the
   record holds, so they are not rows on the fifth card. ⛔ **NEITHER POOL EXISTS IN WAVE 1.**
   The chair's ESTATE-REPAIR-4 ruling 1 (2026-09-20, judgment 54) took `worldFact.goods` and
   `worldFact.services` OUT of EM-A2b: both pool rows, their two source rows, acceptance B4's
   two set-equalities and risk R4 ride **EM-P3c**'s sitting with the two dials, measure-first,
   after wave 1. ⛔ **No waiting packet mints either pool**, so a build lane must expect
   neither — and nothing here resolves one, because a pool is a vocabulary and BLOCK-7 rules
   what the CARD declares.
2. **`tradeAccess` — it is not among EM-A1 version 5's declared five.** It is EM-P3b's eighth key.
   ⚠ Its own block is separately live: `worldFact.tradeAccess` is BLOCKED in EM-A2b (no canonical
   option list; the wizard's six disagree with the generator's five). **Neither block propagates
   here**, and that is stated so the packets are not coupled by accident.

`validateOp` therefore validates `fact` membership against those FIVE and the PRESENCE of `value`,
and does **not** resolve the pool — pool resolution is the dialog's (EM-D2) and the guard engine's.

### Absence rules

**absent** `type` / unknown type → `makeOp` returns `null`; `validateOp(null)` returns
`{ ok: false, errors: ['op is absent'] }` (the exact frozen string). **empty** relation array —
legal and meaningful. **`null`** — the `duration` value for "no duration"; forbidden elsewhere in
a row. **invalid legacy input** (an older op shape, a non-object, a string) — rejected by
`validateOp` with a named error; never repaired, never thrown on.

### Transition table

| Prior state | Input/event | Guard | Next state | Receipt |
|---|---|---|---|---|
| — | `makeOp(type, target, payload)`, `type` in `OP_TYPES`, `target` well-formed | none (pure) | an `Op` carrying the type's declared `stage`, `consequence` and four relations | none |
| — | `makeOp` with unknown type or malformed target | none | **`null`** | none |
| an `Op` | `validateOp(op, world)` | payload schema + relational integrity | `{ ok: true, errors: [] }` | none |
| an `Op` | `validateOp` on a payload violation | — | `{ ok: false, errors: [<named, sorted>] }` | none |
| institution, any state | `set-institution-state` with `active\|impaired\|destroyed\|vacant` | pool membership | the record carries the composer's `STATUS_*` value | the op's own |
| institution, any state | `set-institution-state` with **`ruined`** | pool membership | **`ruinInstitution(inst, { reason: <the decree's cause>, fate: 'ruined_by_decree' })`** — EM-B1e's one exported writer; at the tick on canon, directly on a draft | the op's own |

⚠ **`validateOp` NEVER refuses an action** — it reports. `ok: false` means "malformed", not
"disallowed". Refusal is not this packet's to invent, and the guards never refuse either
(design §2.7; §P8).

### The declared relations

`requires[]` — types (or, for **home** ops, world predicates) that must precede this one.
`enables[]` — the types this one makes available. `relatedTo[]` — types the catalogue marks as
belonging together, which lets the connection guard OFFER a follows-from link (§2.7a) without
inventing anything. `conflictsWith[]` — types whose co-presence raises the `contradiction` guard.

⛔ **RELATIONAL INTEGRITY IS TOTAL AND SYMMETRIC WHERE IT MUST BE.** Every string in every relation
array is a key of `OP_TYPES` (A4). `conflictsWith` is **symmetric**; `requires`/`enables` are
**exact inverses**; `relatedTo` is **symmetric**. These are assertions, not conventions, because a
one-sided relation makes a guard fire for one ordering and not the other.

⚠ **B1b APPENDS TYPES, SO A4's INTEGRITY ARM MUST NOT ASSUME CLOSURE OVER B1a ALONE.** At this
packet's tip **the fourteen of §6** are closed over themselves — **no home row names an off-stage
type, and none names one of EM-B1c's five** — and A4 asserts exactly that. B1b re-runs the same arm
over all twenty-five.

### Ordering and precedence

Pipeline position **NONE** — a pure leaf, outside generation and outside the pulse. **Stable
enumeration:** `Object.keys(OP_TYPES)` is authored and asserted in `compareCodepoint` order, so a
new row cannot be appended "wherever"; `validateOp`'s `errors` are `compareCodepoint`-sorted.
**Merge/deduplicate:** not applicable — this packet holds no collection of ops.

### Determinism

- **Hash/fork key:** `NONE`. ⛔ This packet draws no random number. `makeOp` **mints no id** — the
  entry id is EM-C1's `stage()`, the DM entity id is EM-B2's `mintDmId`. A PRNG import is a STOP.
- **Stable enumeration:** as above. **Rounding/clamping:** none; no float produced or rendered.
- **No-draw behaviour:** the leaf imports nothing from `src/kernel/prng.js` or
  `src/kernel/rngContext.js`, so it cannot move any stream. A6 asserts the import list.

### Flag and dormancy

**Flag:** `NONE` — headless; `TIER_GATE.premium.editMode` is EM-D1's. **Dormancy:** zero importers
at this tip. **Golden posture:** `UNCHANGED` — `generatorGoldenMaster` and `dossierProseManifest`
must not move by one byte; structurally guaranteed. **Motion is a STOP.**

### Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| Frozen module constant | pure reads | **Never** — an `Op` is persisted only inside a `Decree`, EM-B3's key and EM-B3's door | n/a | n/a | n/a | **None owed here**; an op-shape change after EM-B3 is EM-B4's migration | **None** — no secret read |

### Receipts and privacy

`NONE` — `validateOp` returns a typed result, not a receipt. No DM-only field, no projection;
those are EM-B3's (§P2.6).

### Alignment and edit story

- **Alignment:** `DECLARED EMPTY: the op catalogue is a vocabulary of acts; it reads no alignment,
  law or temper axis and ranks nothing.`
- **Edit story:** `ENGINE-ONLY: the DM's verbs arrive here from EM-D2's dialog through EM-C4's
  single adapter. This packet is the vocabulary beneath them.`

---

## 7. Exact change manifest

| Action | File | Symbol/region | Maximum delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/edit/operations.js` | `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, `OP_TYPES`, `makeOp`, `validateOp` | **250 eff (cap); ≈213–227 estimated** | The vocabulary of §6 with exactly **THE FOURTEEN HOME ROWS of §6's one list** (R8), every row carrying all eleven fields (§6's `OpTypeDeclaration`). Both closed vocabularies carry BOTH members. Import no PRNG, no `src/store/**`, no `src/components/**`. Author `consequenceFor` nowhere; call `rederive` nowhere. Leave the structure open for B1b to append. |
| `CREATE` | `src/domain/edit/worldConditions.js` | `WORLD_CONDITIONS` — the frozen id → `{ predicate, readers, source }` map, TEN ids | **250 eff (cap); ≈83–93 estimated (§16.2)** | The ten predicates of §16.1, each `(record, campaignState) => boolean`, PURE, TOTAL and FALSE-ON-ABSENCE. ⭐ **Every predicate is SCOPED to the card's SUBJECT and to its process's LIVE stage** (the chair's ruling R9). Read every fact at its source module and through its exported gate, never a bare string or a raw flag. The two honestly-absent rows declare `source: 'EM-E4'` and `readers: []`. |
| `CREATE` | `tests/domain/editOperations.test.js` | A1–A8 | `n/a` | ONE literal `describe`, **eight straight-line `it`**, no `.each`/`runIf`/nesting (§P3.4). Table arms report a FULL offender list. Negatives carry `// anchored:` on the line immediately above. |

Generated artifacts: `NONE`. ⛔ **Edge-shared closure NOT owed** — zero existing files modified.

> ⭐ **TWO §7 CORRECTIONS (ESTATE-REPAIR-2, 2026-09-20), BOTH SET-EQUALITY, NEITHER A SCOPE CHANGE.**
> (1) **`src/domain/edit/worldConditions.js` IS ADDED to §7.** The JSON capsule has CREATEd it all
> along, §3 budgets it as *"New logic-bearing production leaves | `2` — `operations.js` +
> `worldConditions.js`"* and §16.2 sizes it at ≈83–93 of 250 — §7 was the one place that never
> declared it, so §7, §3 and the capsule disagreed. Measured at `bdbf7c89c`: the path is ABSENT, so
> `CREATE` is right and it is §7 that was short.
> (2) **The §7 row for `tests/lint/sovereigntyLightingContract.walker.test.js` IS DELETED.** This
> packet does not edit that path — the row said so itself — and the capsule correctly omits it. The
> deferred box further down says everything the row said, and it now names the file the refreeze
> actually writes. §7 and the capsule are set-equal at three rows.

### The registration ledger

| # | Obligation | Verdict | Measurement |
|---|---|---|---|
| P2.1 | lighting census | **OWED — a DELTA of `+1 / +0 / +1 / +8 / +1`, INTERIOR RED** | ⛔ **STATED AS A DELTA, NEVER AS AN ABSOLUTE TUPLE** (chair's ruling R11). Each figure derived from **this packet's own CREATE/TEST rows** and from `measureCensus()`'s four expressions (`sovereigntyLightingContract.walker.test.js:601-604`) — see the derivation below. Re-derived whole at the terminal (§P3.2). |
| P2.2 | mutation-coverage row (interim rule 15) | **NOT OWED — MEASURED, not recalled** | ⭐ **`ENFORCER_DIRS` READ AT `429141e2d` (`tests/lint/mutationCoverage.shared.mjs:36-45`) IS EIGHT, NOT ONE:** `tests/lint`, `tests/design`, `tests/docs`, `tests/data`, `tests/copy`, `tests/security`, `tests/edgeFunctions`, `tests/generators`. **`tests/domain` is in none of them**, and the sibling arm — `NAME_PATTERN` (`:48-49`, `census\|scan\|baseline\|ratchet\|walker\|killlist\|parity\|coverage\|governance\|freshness\|integrity\|exhaustiveness\|roundtrip\|golden\|contract\|pin`) — does not match the basename `editOperations.test.js`. ⇒ the packet's one `tests/` CREATE owes NO `scripts/mutation-coverage-manifest.json` row and names no `rowKey`, so it contends for that register with nobody. The walker's own row went to EM-B1b with the walker. |
| P2.3 | observed-shape exemption | **NOT OWED** | No save-time key read; nothing persisted. Scanner covers every `.js` under `src/` (`:250`); the check is in `checks`. |
| P2.4 | writer-reach | **CANNOT MOVE** | `SURFACE_CLOSURE_STOP` includes `'src/store/'` (`writer-reach-scan.mjs:115-117`). |
| P2.5 | decision-fork + mechanism-coverage | **NOT OWED** | This packet mints no seeded chooser and no pool; it draws nothing at all. |
| P2.7 | prose-numerics | **NOT OWED** | No figure rendered. |
| ⭐ P2.11 | **EM-R6's DEFERRED FIRST-PAINT LIABILITY** | ⛔ **OWED — PRICED HERE, AT THIS MEMBER'S PRE-PROOF, NEVER AT ITS BUILD** | See the door below; the membership probe is a `checks` row of §10 and it always executes. |
| ⭐ **P2.14** | **the TUNING INVENTORY (interim rule 17)** | ✅ **NOT OWED — MEASURED 0 / 0, WITH A POSITIVE CONTROL** | Both CREATEs are `.js` leaves under `src/domain/**`, which `scripts/lib/tuning-inventory.mjs` counts (`TREES_P2P3 = ['src/domain','src/generators']`, `:60`). The library's OWN `countUnregisteredNamed` and `countBareDecimals` were run over this contract's planned text at `429141e2d`: **P2 `{}` · P3 `{}` — zero unregistered named dials and zero bare decimals in either leaf**, which is the ZERO the walker holds a new file to. The instrument is proved live: a planted control (`export const CONTROL_LIMIT = 12;` + `0.75` + `1.5`) returned **P2 2 · P3 1**. ⛔ **The contract is what keeps it at zero and it is stated once here:** every op row's `duration` is `null`, both closed vocabularies and every relation are frozen STRING arrays, and `worldConditions.js`'s live-stage set is four strings — **no module-top-level `const UPPER_SNAKE = <number>;` and no fractional decimal is authored in either leaf**. A number that later proves necessary is an input bound spelled as an integer member of a frozen object, never a top-level numeric const; a genuine simulation dial would be a tuning-register row and the OWNER signs tuning. |
| ⭐ **P2.13** | **wiring census — the PRODUCER COUNT** | ⛔ **OWED — A DEFERRED ROW, delta only (interim rule 1)** | `docs/content/wiring-census.json` — **a named INTERIOR RED, delta only.** `stamp.producerIndexFiles` **+2**: this member's new `.js` leaves under the two counted roots, named one by one — `src/domain/edit/operations.js` · `src/domain/edit/worldConditions.js`. **Re-measured from this packet's own CREATE rows at `bdbf7c89c2569679bcccdb188d5d831ccfaa0e6d`.** ⛔ `producerIndexFiles` **NAMES NOTHING — IT IS A NUMBER** (**RE-READ FROM THE STAMP AT `429141e2d`: still `1172`, so the delta is `1172 → 1174`**), counting every `.js` under `src/generators/**` plus every `.js` under `src/domain/**`; so the answer is a DELTA, and "the register does not name mine" would be a category error. `stamp.files` (**7 entries, re-counted at `429141e2d`**) and `stamp.candidateLeaves` (**6, re-counted**) **UNMOVED** — both key on `src/domain/display/stateProse/` paths this member does not touch. `totals.*` **UNMOVED** — this member produces no pool, variant or relation. ⛔ **Regenerated WHOLE at the train's terminal, BY THE CHAIR** — a member never runs `node scripts/wiring-census.mjs`, because N lanes each regenerating a global COUNT produce N conflicting blobs. ⛔ **The path is in NEITHER §7, NOR the `changeManifest`, NOR `checks`** — naming it reserves the estate's most contended path against every sibling. |

### ⛔ EM-R6's DEFERRED FIRST-PAINT LIABILITY — THE DOOR THIS MEMBER OWES

EM-R6 §3b's binding note names this packet by name: *"These two leaves are **13,258 B minified
together** — more than half again as large as the module that broke that ratchet"* ⇒ **"EM-B1c,
EM-B1a and EM-R0c each price, at their own pre-proof, how they import these leaves without
entering first paint … It must not be discovered at their build."** The history it rests on is
`tests/build/factionRenameDoorLazy.test.js`'s own header: *"`src/domain/factionRename.js` did ride
the first-paint closure … the 'dependency-light pure leaf' was **8,574 B minified**, and the
first-paint ratchet went over budget."*

**THE MEASURED QUESTION, and it is a MEMBERSHIP question before it is a byte question:** does this
member's new import edge on `src/domain/institutionRename.js` or `src/domain/institutionRemoval.js`
pull either leaf into the EAGER FIRST-PAINT CLOSURE?

⚠ **THIS MEMBER DECLARES NO IMPORT OF EITHER LEAF TODAY** — measured over its own §5–§8 and its
JSON capsule: neither path appears anywhere outside this block. The probe is therefore the STANDING
GUARD that a later edit does not add one, not the proof of an edge that exists. ⛔ Whether EM-R6
§3b's naming of this member as a consumer is stale, or this member is missing an import edge it
will need, is the chair's (ESTATE-REPAIR-2 NOTE-2); the probe is lawful and cheap either way.

**THE COMMAND THE ESTATE ALREADY USES.** The closure is re-derived by IMPORTING `vite.config.js`'s
own exported set, never by reading a hand list — `EM-PREAMBLE.md` §P2 row 11: *"a pre-proof
re-measures membership by importing the set, never by reading a list"*; EM-B1d v5 §3.2 (*“⭐⭐ THE PLACEMENT, MEASURED AGAINST ALL FOUR BUDGETS”*): *"Measured
at `58fcfe614` by walking each entry's static closure with `importsOf`/`resolveRel` **copied
verbatim from `vite.config.js`'s `computeEagerModuleGraph`**, and by querying the config's own
exported `EAGER_FIRST_PAINT_MODULES`"*; EM-B1k2 §3.2: *"Re-derived through `vite.config.js`'s own
`EAGER_FIRST_PAINT_MODULES`"*. It is a `checks` row of this packet (§10) because it always
executes — it reads no `dist` and can never skip:

```sh
node -e "const{pathToFileURL}=require('node:url');import(pathToFileURL('vite.config.js').href).then(m=>{const S=Array.from(m.EAGER_FIRST_PAINT_MODULES);const bad=['src/domain/institutionRename.js','src/domain/institutionRemoval.js'].filter(p=>S.some(x=>String(x).includes(p)));console.log('EAGER_FIRST_PAINT_MODULES:',S.length,'| EM-R6 leaves in the eager closure:',bad.length?bad.join(', '):'NONE');if(bad.length)process.exit(1);})"
```

⭐ **EXECUTED by the ESTATE-REPAIR lane at the integration tip `bdbf7c89c`:**
`EAGER_FIRST_PAINT_MODULES: 269 | EM-R6 leaves in the eager closure: NONE`, exit `0`. ⛔ **269, not
the 268 that `EM-PREAMBLE.md` §P2 row 11 and four landed packets still quote — the absolute has
drifted and is reported to the chair.** Neither leaf is a member today because neither exists yet;
the figure this member states is therefore the **DELTA across its own edit** (`N → N`), never an
absolute, and the **PASS CONDITION is that both leaves stay OUT.**

**IF EITHER LEAF ENTERS — the cure is the PLACEMENT before it is the ceiling** (`EM-PREAMBLE.md`
§P2 row 11). The precedent is `renameFactionImpl`'s: fetch the cascade at its own call seam so no
static edge reaches it, and carry a door test in `tests/build/factionRenameDoorLazy.test.js`'s
SHAPE — a unique reader-facing string literal minted in exactly one source module as that module's
fingerprint, the entry's transitive STATIC closure walked from `dist/index.html`, and the assertion
that the leaf is absent from that closure **and** rides a DIFFERENT chunk from its parent surface.
⛔ **A STOP for the chair if the placement cannot keep it out** — a first-paint raise is
OWNER-SIGNED and this member re-mints nothing.

⛔ **THE BYTE BASE IS THE CHAIR'S MEASURED FIGURE, NOT EITHER NUMBER IN THE RECORD.** The estate's
first-paint figure disagrees with itself: EM-B1d v5's header reads **1,039,235** at its base while
EM-B1k2 prices against **1,047,205**, because that is what `tests/build/vendorPdfLazy.test.js`'s own
header still says — a spread of about 8 KB, and the difference between ~795 B and ~8.7 KB of
headroom. **This member cites THE CHAIR'S MEASURED BASE**, settled from RUN 25's `dist`, and quotes
neither number. ⚠ A `skipIf(!requireDistRead)` byte arm that SKIPPED is not a pass (§P2.11): the
byte half is the chair's real build at the landing, and this receipt either quotes an executed
figure with the `dist` it read or says the arm skipped.

> ⛔ **THE CENSUS ROW IS DEFERRED (§417 / MF-T2Q shape)** — DRAFT reserves as READY does, so no
> edit is made and `EM-B1a.manifest.json` **omits** the path. The chair inserts it once, at the
> terminal:
>
> ```json
>         { "action": "TEST", "path": "tests/lint/.lighting-census-baseline.json" }
> ```
>
> ⭐ **THE DEFERRED PATH IS THE BASELINE JSON, NOT THE WALKER (ESTATE-REPAIR-2, measured at
> `bdbf7c89c`).** The refreeze writes `CENSUS_BASELINE_REL =
> 'tests/lint/.lighting-census-baseline.json'` and nothing else; the walker file holds no live
> tuple. A chair inserting two spellings of one deferred row cannot satisfy both, so all six members
> that carry this block now name the baseline.

### ⭐⭐ THE CENSUS DELTA THIS PACKET CAUSES — derived, not copied (chair's ruling R11)

⛔ **THE ABSOLUTE TUPLE IS STAMPED BY THE CHAIR AT PROMOTION FROM
`tests/lint/.lighting-census-baseline.json`; A HAND-COMPOSED ABSOLUTE HERE IS THE STALE-NUMERAL
CLASS.** The baseline moved once already between this packet's held base and the read tip
(`2645/383/2262/25009/6670` → `2646/383/2263/25005/6671`, evidence §15.2) and it **will move again
before promotion** — EM-P2 is building now and train T3 has three more members. A packet that
quotes an absolute is wrong by the time anyone reads it; a packet that states its **own delta** is
right forever.

**The delta, each figure derived from this packet's own rows and from the walker's own four
expressions (`measureCensus()`, `sovereigntyLightingContract.walker.test.js:601-604`):**

| figure | walker's expression | this packet's delta | derivation |
|---|---|---:|---|
| `files` | `TEST_FILES.length` — every `tests/**/*.test.{js,jsx}` (`:515-518`) | **+1** | the packet's one `CREATE` TEST row, `tests/domain/editOperations.test.js`. ⛔ **The two `src/domain/edit/**` leaves move this figure by ZERO** — the census counts TEST files (ruling 8 accepts this), so the driver is the test file alone |
| `parked` | `TEST_FILES.filter(parkReasonsFor(src).length > 0).length` | **+0** | the new file carries **no park reason** — §P3.4's straight-line shape has nothing to park |
| `credited` | the complement, `parkReasonsFor(src).length === 0` (`:601-602`) | **+1** | it is unparked, so it lands in `credited` — `files` and `credited` move together, and `parked` does not move at all |
| `titles` | `credited.reduce(sum + liveTitlesIn(src).length)` (`:603`) | **+8** | the packet's **eight straight-line `it`** arms, A1–A8 (§9), all live, none skipped — **one per acceptance case, so this figure IS the acceptance count** |
| `suiteTitles` | `credited.reduce(sum + liveSuiteTitlesIn(src).length)` (`:604`) | **+1** | the packet's **ONE literal `describe`** (§7's coding instruction; §P3.4 forbids nesting), so exactly one suite title |

⚠ **INTERIOR RED, NAMED IN ADVANCE — THE SHAPE, WITH PLACEHOLDERS.** ⛔ **This is an EXAMPLE of
the message's form, NOT a figure to match.** `‹B›` is whatever `files` reads in
`.lighting-census-baseline.json` at promotion:

```text
the estate's file count moved — re-measure, do not re-word: expected ‹B›+1 to be ‹B›
```

⇒ at the packet's held base `d31af2cee` (`files: 2645`) that reads *"expected 2646 to be 2645"*;
at `023eda2ec` (`files: 2646`) it reads *"expected 2647 to be 2646"*. **Neither is written into
this packet as a fact.** The implementer reads `‹B›` from the baseline file in the same command as
the run, and the chair stamps the absolute tuple once, at promotion.

---

## 8. Ordered coding sequence

0. Dispatch and seal; re-read `git rev-parse HEAD` in the same command.
1. Capture the baseline: the census figures; `sha256` of
   `tests/fixtures/generator-golden-master.json` before any edit.
2. Add `tests/domain/editOperations.test.js` with A1–A8 **failing**.
3. Implement the pure data contract: `OP_STAGES`, `OP_CONSEQUENCE_POLICIES`, the payload-spec
   vocabulary, then **the fourteen `OP_TYPES` rows of §6's one list** (R8).
4. Implement `makeOp`, then `validateOp`.
5. Extend the sole writer / wire consumers: **NOT APPLICABLE** — no writer, no consumer, lands
   DARK. Record both steps as skipped.
6. Registrations: none owed (§7). The prevention guard is A4's relational-integrity arm.
7. Run focused verification (§10).
8. Run the wave-end gate per the train's plan; write the completion receipt.

```text
validateOp:
1. if op is not a plain object            -> { ok:false, errors:['op is absent'] }
2. decl = OP_TYPES[op.type]
   if !decl                               -> errors += `unknown op type: ${op.type}`
3. if op.target is not { kind, id } with kind in the closed EntityRef set
                                          -> errors += 'target is malformed'
   // ⛔ AND NOTHING MORE AT STEP 3: the kind is checked for MEMBERSHIP of the closed seven, never
   // for a MATCH against decl.target, and no name rule is applied. Both are closed AT THE DOOR.
4. for each [field, spec] of decl.payload:
     if spec.required && op.payload?.[field] === undefined
                                          -> errors += `payload.${field} is required`
     if present and spec.kind === 'enum' and the value is not in spec.values
                                          -> errors += `payload.${field} is not one of the declared values`
5. for each key of op.payload not in decl.payload
                                          -> errors += `payload.${key} is not declared for ${op.type}`
6. errors.sort(compareCodepoint); freeze
7. return { ok: errors.length === 0, errors }
```

⛔ Step 7's `ok` is DERIVED from `errors`, never set independently — A8 asserts the invariant, so
the two can never disagree.

⭐⭐ **STEP 3 ENFORCES NEITHER THE TARGET-KIND MATCH NOR ANY NAME RULE, AND THAT IS DELIBERATE —
BOTH ARE CLOSED AT THE DOOR BY EM-C4a VERSION 2** (the chair, judgment 41). A `kind` that is a
member of the closed seven but is the WRONG kind for `decl.target` — a faction id on an NPC op —
passes `validateOp` and is refused downstream. EM-C4a version 2's own clause, verbatim:

> *"⭐ This is also the refusal that closes EM-B1a's measured gap — `validateOp` admits any of the
> closed seven `EntityRef` kinds, so a faction id on a `rename-npc` op reaches here and is refused
> because it resolves to no NPC, not because a second validator was written (EM-B1c1 §13 R1)."*

⛔ **SO THIS PACKET WRITES NO SECOND VALIDATOR AND NO NAME RULE.** Adding either here would put two
authorities on one refusal — the exact shape §12.13's one-adapter law exists to prevent — and would
make `validateOp` refuse an ACTION, which §6 forbids it to do (*"`ok: false` means 'malformed', not
'disallowed'"*). The door's refusals are `unknown_target` for the resolution failure and
`invalid_op` for a malformed op; the split is the contract, not an oversight.

---

## 9. Acceptance matrix

`tests/domain/editOperations.test.js`, one literal `describe`, eight straight-line `it`.

| ID | Case | Required observation |
|---|---|---|
| **A1** | **Main + GUARD-THE-GUARD, first** | ⭐⭐ **THE SET-EQUAL ARM NAMES §6's ONE LIST (R8):** `OP_TYPES` holds exactly the **FOURTEEN** HOME types — `add-faction`, `add-institution`, `add-npc`, `found-phantom`, `promote-phantom`, `rebalance-power`, `remove-faction`, `remove-institution`, `remove-npc`, `set-field`, `set-institution-state`, `set-npc-status`, `set-power-holder`, `set-relationship` — set-equal both directions with a full offender list. **Every row carries all eleven fields** (§6's `OpTypeDeclaration`; EM-A1's `Op` carries ten), each of the declared type, `guardsStated` non-empty. `Object.keys(OP_TYPES)` is in `compareCodepoint` order, which is the order just spelled. ⛔ **`set-state` is asserted ABSENT by name** (ruling 2; design §14: system states are derived), so restoring it reds. ⛔ **AND EM-B1c's FIVE ARE ASSERTED ABSENT BY NAME** — `rename-faction`, `rename-npc`, `rename-settlement`, `set-world-fact`, `schedule-event` — so a later author cannot quietly re-absorb the split, and B1c's landing reds here until this arm is widened deliberately. `makeOp('set-field', {kind:'institution',id:'i1'}, {...})` returns an `Op` carrying the declared `stage`, `consequence` and relations. |
| **A2** | **Absence and malformed input — nothing throws** | Unknown type, `null` target, `{kind:'nonsense'}`, a string op, `undefined`, an undeclared payload key: `makeOp` returns **`null`** for each; `validateOp` returns `{ok:false, errors:[…]}` with the NAMED error and never throws. `validateOp(null)` returns exactly `errors: ['op is absent']`. An omitted required field names that field; an enum value outside `spec.values` names that field. |
| **A3** | **⛔ THE STAGE PARTITION SET-EQUAL, AND THE SEAT'S FLAG** | ⭐ `set-power-holder`'s payload names a HOLDER and its declared writer is `rulingPower.js`'s transfer path; a source scan proves this module writes neither `governingName` nor `government` (matcher proved live on a planted string) — the name follows the `isGoverning` flag, as `rulingStructure.js:787`'s own comment requires. Then: `OP_STAGES` is exactly `['home','off-stage']` and `OP_CONSEQUENCE_POLICIES` exactly `['home','by-target-reality']`, both frozen. **Every one of §6's FOURTEEN rows (R8) is `stage:'home'` AND `consequence:'home'`**, and the two sets are asserted **SET-EQUAL to each other** so the fields can never drift apart. ⭐ The off-stage members are declared but provably **unreached at this tip** — asserted as an empty selection — which is what lets B1b append without editing a frozen constant. Counterforce: a source scan proves `consequenceFor` is defined **nowhere** in this module (it is EM-F1's), and `rederive` is called nowhere (it is EM-B2's). |
| **A4** | **⛔ RELATIONAL INTEGRITY, TOTAL AND CLOSED (the prevention guard)** | Every string in every `requires`/`enables`/`relatedTo`/`conflictsWith` is a key of `OP_TYPES` (full offender list). `conflictsWith` is symmetric both directions; `requires`/`enables` are exact inverses; `relatedTo` is symmetric. ⭐ **No home row names an off-stage type, and none names one of EM-B1c's five** — §6's FOURTEEN (R8) are closed over themselves at this tip, asserted by name, which is the arm B1b re-runs over all twenty-five. |
| **A5** | **Boundary — the rename ops delegate and re-implement nothing** | ⭐ **VERSION 8 (judgment 99): the three `rename-*` rows are EM-B1c's (R8), so this arm asserts the DELEGATION half alone.** `rename-faction`, `rename-npc` and `rename-settlement` are absent from `OP_TYPES` by name — the same absence A1 pins, restated here as the reason this module owns no rename row — and a source scan proves this module defines **no rename logic of its own** and re-implements no path in `FACTION_RENAME_SURFACES` (the join-key law honoured by delegation, HZ-JOINKEY), with the matcher proved live on a planted string. |
| **A6** | **Purity, dormancy and the import fence** | `makeOp` / `validateOp` are proved pure: identical inputs give `toEqual` results, the input `payload` is proved unmutated against a pre-call clone, and 100 calls change nothing observable. The import list is asserted EXACTLY and contains **none of** `src/kernel/prng.js`, `src/kernel/rngContext.js`, any `src/store/**`, any `src/components/**`, and **no force/muster/casualty/upkeep module**. A scan over `src/**` finds **zero importers**, with guard-the-guard arms on the walk and the matcher. |
| **A7** | **⛔ THE TWO VOCABULARIES ARE THE TREE'S, AND THE FIELD IS `category`** | ⭐⭐ **RE-PINNED AT VERSION 7 TO THE MEASURED TIP.** `set-npc-status.payload.status` is `kind:'enum'` with exactly the `NpcStatus` **SEVEN** (`active, dead, exiled, jailed, missing, removed, retired`) — **parsed from `npcs.js`'s own typedef by the test**, so a typedef edit reds here — and `jailed` is asserted **PRESENT by name**, the record that EM-B1d landed it. `set-institution-state.payload.state` is `kind:'enum'` with the op's **SIX-MEMBER POOL** (`active, destroyed, impaired, removed, ruined, vacant`), and **`EntityStatus` is parsed from `status.js` and asserted UNWIDENED at its FIVE with `ruined` ABSENT from the union by name** — the two are different facts and the arm asserts both, so neither the pool nor the union can drift into the other. Neither field is `kind:'free'`. ⭐ **`set-field` and `add-faction` spell `category`, never `archetype` or `type`** — asserted by a source scan finding no `archetype`/`type` payload key, because `archetype` is a DERIVATION (`factionArchetype(f)` from `f.category`) and design §14 forbids editing one. And `set-institution-state('destroyed')` and `remove-institution` are asserted DISTINCT op types. |
| **A8** | **The `ok`/`errors` invariant, and `set-world-fact` as a DECLARATION** | For every case in a table of valid and invalid ops, `result.ok === (result.errors.length === 0)`. `errors` is FROZEN and `compareCodepoint`-sorted (a three-error case asserted in exact sorted order). ⭐ **VERSION 8 (judgment 99): the `set-world-fact` ROW is EM-B1c's (R8 moved it with the other four; §6 spells only its payload shape here), so at the fourteen `validateOp` answers a `set-world-fact` op with `ok: false` and an `errors` entry of exactly `unknown op type: set-world-fact` — the same protection, stated at the fourteen; the FIVE world-fact keys (`terrain, culture, monsterThreat, resources, stressors`), the PRESENCE of `value` and the ABSENCE by name of `goods`, `services` and `tradeAccess` (the chair's BLOCK-7 ruling, judgment 33) are EM-B1c's to assert when it lands the row.** This module is asserted **not to resolve any pool and not to re-derive anything** — proved by a source scan finding no `rederive` and no pool import, so the §14 engine stays EM-B2's. |

**8 of ≤8.**

---

## 10. Verification commands

```sh
npx eslint src/domain/edit/operations.js tests/domain/editOperations.test.js
npm run typecheck:ratchet
npm run typecheck:domain:strict          # src/domain/edit/** must be strict-clean (§P4)

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/editOperations.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js

GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js

node scripts/check-observed-shape-readers.mjs

# ⭐ EM-R6's DEFERRED FIRST-PAINT DOOR (§7). A MEMBERSHIP probe, not a byte arm: it imports
# vite.config.js's own exported set, reads no dist, and therefore can never skip. Exit 1 if
# either EM-R6 leaf has entered the eager closure. Measured at bdbf7c89c: 269 modules, NONE.
node -e "const{pathToFileURL}=require('node:url');import(pathToFileURL('vite.config.js').href).then(m=>{const S=Array.from(m.EAGER_FIRST_PAINT_MODULES);const bad=['src/domain/institutionRename.js','src/domain/institutionRemoval.js'].filter(p=>S.some(x=>String(x).includes(p)));console.log('EAGER_FIRST_PAINT_MODULES:',S.length,'| EM-R6 leaves in the eager closure:',bad.length?bad.join(', '):'NONE');if(bad.length)process.exit(1);})"

node scripts/implementation-packets.mjs validate
npm run check:packet -- EM-B1a
npm run implementation:resume -- EM-B1a
```

### ⛔ THE BUILD LANE'S INSTRUMENTS — NEVER SEALED `checks` (interim rules 8, 12 and 17)

```sh
# 1 · THE COUNT PROVER, PRE-SEAL, from the KIT path — never placed in the tree (rule 12, judgment 81).
node <kit>/packets-waiting/EM-B1a.count-prover.mjs \
  <kit>/packets-waiting/EM-B1a.md <kit>/packets-waiting/EM-B1a.manifest.json   # expect exit 0

# 2 · THE EXCLUDED DIRECTORY RUN (rule 8). `tests/lint` WHOLE, minus the lighting walker, which
#     reds by design under a train; it must EXIT 0.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-tail.sh npx vitest run --pool=threads --maxWorkers=2 tests/lint \
  --exclude=tests/lint/sovereigntyLightingContract.walker.test.js

# 3 · THE LIGHTING WALKER ALONE — the named INTERIOR RED (§7's delta), expected NONZERO.
npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js

# 4 · ⭐ THE WIRING-CENSUS WALKER ALONE — the SECOND named interior red (interim rule 17), because
#     this member CREATEs two `.js` leaves under `src/domain/**`. EXPECTED NONZERO, ON EXACTLY TWO
#     ARMS, and it is EXCLUDED from run 2 above:
#       (a) `⭐ THE DRY READ: both modes, and the one that writes is not among them`
#           (`proseWiringCensus.walker.test.js:2105`) —
#           `expect(current.ok, 'the committed register is current at this tip').toBe(true)`
#           goes red in the shape `expected false to be true`;
#       (b) `the committed census is byte-identical to a fresh build, and the stamp is live` (`:2188`) —
#           `verdict.reason` becomes `stale-bytes`.
#     ⛔ THE MECHANISM, read in `scripts/wiring-census.mjs:1173-1175`: `censusCheck` compares the
#     committed TEXT against `serialise(data)`, and `stamp.producerIndexFiles` (`:1015`) rises
#     1172 → 1174. ⛔ NEITHER arm is cured here — the census is regenerated WHOLE at the train's
#     terminal, BY THE CHAIR (interim rule 1), and this member never runs `scripts/wiring-census.mjs`.
npx vitest run --pool=threads --maxWorkers=2 tests/lint/proseWiringCensus.walker.test.js
```

⚠ The rename cascade's own suite should be re-run unchanged; **this lane did not measure its
path** and names none — the implementer resolves it at preflight (`ls tests/domain | grep -i
rename`) and records it. An unmeasured path is not a verified fact.

Expected: every command exits `0`, **except** the named census interior red until the terminal.
⛔ Never read a gate through a shell pipe (§P7). A member never runs `npm run check`.

---

## 11. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` and §P8, stop if: the seal is missing or foreign; **HEAD is
not `d31af2cee` or a descendant proved non-interfering by execution**; **`operations.js` measures
> 250 effective lines** under eslint's own `Linter` with `skipBlankLines` and `skipComments` →
take the pre-declared **EM-B1c** (the three `rename-*` ops + `set-world-fact`), **never squeeze**;
**`rederive`, a pin, or any re-derivation appears necessary** (that is EM-B2's — HZ-DERIVED);
`consequenceFor` would need authoring, importing or referencing (EM-F1's); **any phantom-side
world state appears necessary**; **a second force-return mechanism appears necessary**; an adapter
per op type appears necessary (§12.13); a PRNG or `rngContext` import appears necessary; a golden
or the prose manifest moves by one byte; a §15 vocabulary would have to be typed `free` rather
than `enum`; `set-state` would have to be restored; `renormalizeFactionPower` is found to be pure
(it is not — it mutates in place); `applyFactionRenameToSettlement`'s return shape has changed.

---

## 12. Completion receipt

Base SHA · seal identity · final tree state · exact changed files and effective-line deltas
(`operations.js` measured with eslint's `Linter`) · acceptance A1–A8 executed · the mutants planted,
convicted and restored digest-exact (§P6) · focused commands, exits and counts · sealed per-step
receipt and resume status · both typecheck configurations · gate stages actually executed ·
base-versus-wave failure identity diff · dormancy/golden result (fixture digest before and at the
tip) · census tuple before and at the tip with the interior red quoted verbatim · generated
artifacts `NONE` · deviations `NONE | STOP` · out-of-scope observations without investigation ·
**judgment calls: `NONE`**.

---

## 13. RAISED — for the chair

| # | Item |
|---|---|
| **R1** | **The ≈231–249 estimate leaves ≤19 lines of margin** against the 250 cap at eighteen rows. **EM-B1c** (the three `rename-*` ops + `set-world-fact`, ≈36 effective) is pre-declared at §3 as the next split, on the principled line *rows that delegate to another packet's machinery*. Ratify the contingency, or direct a different line now. |
| **R2** | ⭐ **`set-world-fact`'s `fact` values are EM-A1 version 5's FIVE, so `worldFact.tradeAccess` is NOT among them** (§6 item 2; `goods` and `services` left by BLOCK-7 and their two POOLS rode EM-P3c with the chair's ESTATE-REPAIR-4 ruling 1, judgment 54). **Its POOL is separately BLOCKED in EM-A2b** (no canonical option list; the wizard's six disagree with the generator's five). This packet is **not** blocked by it — `validateOp` checks `fact` membership and `value` presence and resolves no pool — but the chair should know the two packets touch the same gap from opposite sides. |
| **R3** | **The rename cascade's test path was not measured by this lane** and is named nowhere; §10 directs the implementer to resolve it at preflight. |
| **R12** | ⛔⛔ **CROSS-PACKET, AND THE ONLY ONE THAT COSTS A TRAIN IF IT IS WRONG: `makeOp` FLATTENS `requires`.** EM-A1 is BUILT and its `Op.requires` is `readonly string[]` (read in `lane-em-a1-t9/src/domain/edit/types.js`), while §16.3 makes the DECLARATION's `requires` a `{ world, registry }` pair. Version 7 rules the flatten inside this packet (§6), because `typecheck:domain:strict` is a sealed `checks` row and re-opening a built EM-A1 to widen its typedef is the dearer cure. **Ratify the flatten, or direct EM-A1 to widen `Op.requires` before EM-T9 lands.** |
| **R13** | ⭐ **EM-B1h's header claims this packet as a dependant and the claim is half true.** *"EM-B1a depends on this packet (its `ruined` arm passes `'ruined_by_decree'`, which the guard would otherwise REFUSE)."* MEASURED: this deliverable writes no fate, calls `ruinInstitution` nowhere and names it in no `requiredSymbols` row — the guard cannot refuse anything it builds. The dependency is the APPLY packet's (EM-C4a / EM-B2). **Recommendation: leave EM-B1h's sentence as the record of the CONTRACT and do not gate this packet on it; the chair re-spells EM-B1h's row at its own promotion.** |
| **R14** | ⚠ **THE CHARTER CARRIES THE PRE-SPLIT ROSTER AND WOULD MISLEAD A BUILD LANE READING IT FIRST.** `docs/implementation/charters/EDIT-MODE-TRAIN.md:45` still describes EM-B1a as *"the EIGHTEEN home ops incl. … the three `rename-*` … and `set-world-fact`"*, and `:15` describes EM-B1c MODIFYing `src/domain/edit/operations.js` *"(+2, the spread)"*. Those two rows are the ONLY places in the estate outside this packet that name either CREATE target (`git grep -n -F` over `tests scripts docs/implementation vite.config.js`). The charter is not validated, so neither row reds anything. **Recommendation: the chair re-spells both at the train's terminal; this packet does not edit a charter.** |
| **R15** | ⚠ **EM-P4 MODIFIES TWO PATHS THIS PACKET PINS AS SUBSTRATE** — `src/domain/entities/npcs.js` and `src/domain/entities/status.js` — although their CHANGE sets intersect at zero. This packet's rows pin the bare typedef names `NpcStatus` and `EntityStatus`, which a relocation that leaves both typedefs in place preserves. **Recommendation: if EM-P4 and EM-B1a ride one train, the terminal re-runs this packet's 32-row symbol check after EM-P4's commit; if EM-P4 moves either typedef's text, it owes a `retiredSymbols` row and this packet owes the successor row at its LANDED flip (pre-proof brief step 10).** |


---

## 14. REVISION 2 — the chair's three contract facts (§934.47 addendum 2), each measured

**(1) `set-power-holder` moves `isGoverning`; the name follows.** Confirmed, and the two writers
plus one propagation site are named in §6 and §5. The op's writer is `src/domain/rulingPower.js`'s
transfer path. A3 carries it.

**(2) The archetype-like field is `category`.** Confirmed: the faction pushes carry
`faction`/`power`/`desc`/`isGoverning`, `category` is read live at three sites, and
`factionArchetype(f)` DERIVES the archetype from it. `set-field` and `add-faction` spell
`category`; `archetype` and `stance` are dropped (the pool follows in EM-A2a). A7 carries it.

**(3) `set-npc-status` CREATES the field and calls the existing writers.** Confirmed. ⭐⭐ **AND THE
REFINEMENT REVISION 2 RECORDED IS NOW HISTORY, NOT A FACT.** Revision 2 measured `NpcStatus` at
**six** and said the chair's seventh word `jailed` *"the typedef does not carry"* — **EM-B1d has
since LANDED it**, and the typedef at `npcs.js:30` reads the SEVEN in codepoint order
(`active, dead, exiled, jailed, missing, removed, retired`), measured at `429141e2d`. The packet
spells the tree's SEVEN; the reasoning is unchanged — the existing writers are the op's writer and a
value outside their typedef would break them, which is exactly why the vocabulary had to land first
rather than be invented here. The old measurement is retained above so it can be re-checked.

No acceptance case was added: the three facts fold into A3 and A7. **Cases remain 8 of ≤8.**


---

## 15. ⛔⛔ THE VOCABULARY GROWTH — STOP AND SPLIT INTO EM-B1d (the chair's ruling 1, §934.47 add. 3)

**The order.** `NpcStatus` gains `jailed` → **{active, exiled, jailed, dead, missing, retired,
removed}**; `EntityStatus` gains `ruined` → **{active, impaired, ruined, destroyed, vacant,
removed}** ("present" is `active`, "departed" is `retired`, "abandoned" is `vacant` — design §15 as
respelled on the ledger at `5985cce7a`). Both typedef edits were to ride in this packet **unless
their consumer rows take it past three existing logic files.**

⛔ **THEY DO — by a factor of three, measured. The vocabulary growth SPLITS into `EM-B1d`.**

> ⭐⭐ **THIS WHOLE SECTION IS EXECUTED HISTORY AND KEEPS ITS FIGURES (interim rule 9's AS-OF MARK).
> `EM-B1d` HAS LANDED**, measured at `429141e2d`: `NpcStatus` gained `jailed` and the file gained
> `export const NPC_UNAVAILABLE_STATUSES = Object.freeze(['dead','exiled','jailed','removed'])` with
> its own header ruling that this is **NOT** the house-roster reading — `ROSTER_ABSENT_STATUSES`
> answers a different question and admits only irreversible causes, so *"a house whose last figure is
> jailed stays `crewed`"*. ⛔ **`EntityStatus` was NOT widened** and `ruined` is this op's POOL member
> only. The roster below is the compile-time measurement that forced the split; it is not re-measured
> here because nothing in this packet reads those nine consumers.

### The enumerating-consumer roster, measured by grepping each member

| # | file | what it enumerates | `jailed` / `ruined` verdict |
|---|---|---|---|
| 1 | `src/domain/entities/npcs.js` | the `NpcStatus` typedef itself (`:30`) | **+`jailed`** |
| 2 | `src/domain/entities/status.js` | the `EntityStatus` typedef (`:23`) **and its five `STATUS_*` constants** (`:88-92`) | **+`ruined`** + a sixth constant |
| 3 | `src/domain/density/factionLifecycle.js:75` | `ROSTER_ABSENT_STATUSES = ['dead','exiled','removed']` | a jailed NPC is off the roster — **decision** |
| 4 | `src/domain/entities/successors.js:63` | `n.status !== 'dead' && !== 'removed' && !== 'exiled'` | design §15: *"a jailed or exiled holder cannot keep a seat"* — **must add** |
| 5 | `src/domain/worldPulse/envoyCasting.js:98` | `['dead','killed','missing','exiled','imprisoned']` | ⛔ **see the synonym finding below** |
| 6 | `src/domain/worldPulse/magicFormsPractitioner.js:79` | `LOST_NPC_STATUS = new Set([...5])` | **decision** |
| 7 | `src/domain/events/affordanceManifest.js:197` | `status === 'impaired' \|\| 'removed' \|\| 'destroyed'` | **+`ruined`?** |
| 8 | `src/domain/events/targetRosters.js:103` | the same triple | **+`ruined`?** |
| 9 | `src/components/new/SummaryTab.jsx:56` | a status → colour/label map carrying `vacant` | **+`ruined`** for the badge |

**Two typedef files + seven enumerating consumers = NINE existing logic-bearing files against a
cap of THREE.** `PACKET_STANDARD.md` is explicit — *"If the work cannot fit, the agent stops and
proposes the smallest split"* — and this packet already carries eighteen op rows at ≈231–249 of
250, so the growth cannot ride here in any form.

### EM-B1d — the proposed member

**One behaviour family:** *two typed unions gain one member each, and every enumerating consumer
is re-judged.* CREATE nothing; MODIFY the two typedef files plus the seven consumers as the
chair's rulings direct; TEST a union-totality walker that asserts each union's members set-equal
to a live scan of its enumerators, so a tenth consumer landing later cannot silently under-enumerate.
⚠ **Nine modified files exceeds the default budget too**, so EM-B1d itself opens with either an
approved override or a two-member split along the union line (`B1d-N` for `NpcStatus`'s four
consumers, `B1d-E` for `EntityStatus`'s three plus the badge). **The chair rules; this lane does
not raise a budget.**

### Two findings the roster turned up, neither investigated

⛔ **F-V1 — `imprisoned` ALREADY EXISTS AS A FOREIGN SPELLING OF THE OWNER'S NEW WORD.**
`envoyCasting.js:98` tests `['dead','killed','missing','exiled','imprisoned']` — and **neither
`killed` nor `imprisoned` is a `NpcStatus` member**. Adding `jailed` to the typedef while that
arm reads `imprisoned` ships **two spellings of one idea**, which is the writer/reader
spelling-drift class this estate has been bitten by twice. EM-B1d must rule: `jailed` replaces
`imprisoned` there, or the arm tests both. **RAISED R5.**

⛔ **F-V2 — A HOT FILE SITS ONE STEP BEHIND THE BADGE ROW.**
`src/components/new/tabs/EconomicsTab.jsx` is on the standing hot list at **600 effective against
a 600 ceiling — ZERO headroom** (`PACKET_STANDARD.md`), and it enumerates `'impaired'` and
`'vulnerable'` status values beside `SummaryTab.jsx`'s map. It is **not** in the roster above
(its enumeration is over supply-chain status, a different union), but any lane extending the
status badges must measure it before touching it. Named so it is not discovered by a `max-lines`
red. **Recorded, not investigated.**

### What this packet does instead

**EM-B1a's change manifest is UNCHANGED: zero existing production files modified.** Its
`set-npc-status` and `set-institution-state` rows spell the **post-EM-B1d** vocabularies — the
seven and the six — and `EM-B1d` is named in `Depends on` so it lands first. A7 keeps parsing both
vocabularies from their typedef source files, so if B1d has not landed the arm reds honestly
rather than passing on a stale six. **RAISED R6** if the chair prefers B1a to ship the tree's
current 6/5 and B1d to update the op rows afterwards.

| **R4** | ✅ **CLOSED (§934.47 add. 7, option a): EM-B1e mints `ruinInstitution` and this packet's `ruined` arm calls it.** The measurement that forced it, retained: ⛔ **the pulse's ruin path had no exported symbol, AND ITS SHAPE IS CALAMITY-SPECIFIC.** Ruling (1) asks this packet to name, by symbol, the ruin path `set-institution-state` calls. Measured: the only live writer of `status: 'ruined'` is a **module-private arrow** (`const ruin = (inst, reason) => ({...})`) inside a function body in `calamityKernel.js:250`; the neighbouring exports are `promotesTo` (`:180`) and `strikeCapForTier` (`:196`). Its shape carries **five** keys, two of them calamity-only — `worldPulseFate: 'destroyed_by_disaster'` would be a lie on a DM decree. **Three ways forward:** **(a)** export a shared `ruinInstitution(inst, { reason, fate })` from the pulse and have both callers use it — a production MODIFY of a pulse file, its own small member; **(b)** the op writes the two non-calamity keys itself (`status: 'ruined'`, `_worldPulseInactive: true`) and names no path — cheapest, but it mints a second writer of the pulse's shape, which is the thing the ruling is avoiding; **(c)** `ruined` leaves the editor's pool until (a) exists. The op's `ruined` arm is specified by VALUE below; **the door is the chair's to name.** |
| **R5** | **EM-B1d's file count** — five existing logic files against a default cap of three, after the override lapsed. Reported there, not absorbed; one reading makes it four (the typedef edit is a comment and changes zero effective lines). |

---

## 16. ⛔ THE TWO-KIND `requires` (ODQ §934.50, design §18) — and its two structural consequences

**The order.** `requires` splits: `requires: { world: [...], registry: [...] }`. The **world** half
is named pure predicates over the record and the campaign that decide **whether a card offers the
seal at all** — *"not a guard refusing an act but the world's state determining which acts exist"*
(design §18). The **registry** half is the existing entry-ordering condition the guards judge,
suggestive as ruled.

### 16.1 · The predicate roster — each measured, by symbol

⭐ **RE-PINNED AT VERSION 2 to design §19 ruling 6. TEN IDS, unchanged in number** — `openRoute` is
one id answered by two readers, so the table carries eleven ROWS for ten IDS. **Every file:line
below was re-found BY SYMBOL at `023eda2ec`** (never by inherited line number), and the six rows
version 1 already had LIVE were re-confirmed unchanged at that tip: `atWarWith` `:74`,
`atWarWithIdx` `:413`, `liveSieges` `:88`, `hasBeliefMaps` `:188`, `PRIMARY_RELATIONSHIP_TYPES`
`:41`, `NpcStatus` `:30`, `worldState.deployments` read at `briefs/composers.js:118` (inside the
exported `activeWarPairs`, `:117`) and `applyWorldPulse.js:409`. Commands in
`EM-B1a.evidence.md` §10–§14.

| predicate | the field/reader that answers it | **scope (subject · stage)** — chair's ruling R9 | verdict |
|---|---|---|---|
| `warInProgress(counterparty)` | **`atWarWith(graph, worldState, a, b)`** — `src/domain/roads/embassyHazard.js:74` (`atOpenWar(...) \|\| relationshipTypeBetween(...) === 'hostile'`); the indexed twin is `atWarWithIdx` (`worldPulse/tickIndices.js:413`) | ✅ **BOTH ALREADY HELD — the leaf filters nothing.** SUBJECT: pair-scoped by construction, the reader takes `(a, b)` and `atOpenWar` (`:61`) tests war fronts in **both directions between exactly those two**. STAGE: the front arm reads only **live** war fronts off the graph; the relationship arm tests `=== 'hostile'`, a **current value**, never a history | ✅ **LIVE** |
| `forceInField` | **`worldState.deployments[settlementId]`** — read at `briefs/composers.js:118` and `applyWorldPulse.js:409` (`!(state.deployments && state.deployments[besieger])`). ⚠ A FIELD, with no exported predicate — the leaf writes the reader | ✅ **BOTH ALREADY HELD.** SUBJECT: **the ledger is KEYED BY the fielding settlement's own id** — `activeDeployments` maps `homeId` from `Object.keys(deployments)` (`warStatus.js:133-136`) and `liveSieges` reads `attackerId` the same way (`:107`) — so `deployments[record.id]` IS the scoped read. STAGE: **presence is the live stage**, by the reader's own words — *"The settlements CURRENTLY fielding an army abroad"* (`warStatus.js:129`); a recalled army's key is gone | ✅ **LIVE** |
| `siegeInProgress` | **`liveSieges({ worldState, regionalGraph })`** — `src/domain/display/warStatus.js:88`, *"codepoint-sorted by targetId; empty when no sieges are live"* | ⚠ **THE LEAF MUST FILTER FOR SUBJECT.** The reader returns **EVERY live siege in the realm** — `Array<{targetId, coalition, frontCount, visibility}>` (`:84-86`). **Filters on:** `.some(s => s.targetId === id \|\| s.coalition.includes(id))` — target **or** besieger, as the chair's law requires. STAGE: ✅ already held — built from `confirmedWarFronts(regionalGraph)` plus **live** deployments (`:89`, `:104-113`), so a lifted siege leaves neither | ✅ **LIVE** |
| `tradeWith(partner)` | **`worldState.relationshipStates[edge].relationshipType === 'trade_partner'`** — the vocabulary is `PRIMARY_RELATIONSHIP_TYPES` (`worldPulse/relationshipCompatibility.js:41`, member at `:43`) | ⚠ **THE LEAF MUST RESOLVE THE PAIR'S EDGE KEY.** `relationshipStates` is keyed by **the regional graph edge's own id** — *"a synthesized key would orphan"* (`peaceTermsGraph.js:44-46`). **Filters on:** `edgeKeyBetween(edges, record.id, partnerId)` (`worldPulse/relationshipEvolution.js:339`; twin at `peaceTermsGraph.js:47`), which is `null` when no edge connects them ⇒ `false`. STAGE: ✅ already held — `relationshipType` is the edge's **present** state, not a history | ✅ **LIVE** |
| `beliefExists` | ⛔⛔ **THE READER VERSION 1 NAMED IS REALM-WIDE AND IS DEMOTED.** `hasBeliefMaps(worldState)` answers *"does this world carry **ANY** belief map?"* — its own docstring, `src/domain/display/settlementBeliefs.js:185-190` — so it returns `true` on town A because town B has one. ⭐ **THE FACT IS STILL LIVE:** `spatialLedgers.beliefMaps` is **keyed by observer id** (`maps[String(observerId)]`, `settlementBeliefs.js:150`; the same indexing at `briefs/composers.js:89`) | ⛔ **READER CORRECTED, VERDICT UNCHANGED.** SUBJECT: the leaf reads **`getSpatialLedger(worldState, 'beliefMaps')[record.id]`** (`spatial/spatialLedgerAccess.js:78`) and `hasBeliefMaps` **demotes from the row's reader to its DORMANCY PRE-GATE** (no ledger at all ⇒ short-circuit `false`). STAGE: ✅ **presence of the entry IS its stage** — a belief map is current by construction | ✅ **LIVE** (the fact; the reader was wrong, not the verdict) |
| `npcPresent` | **`status === 'active'`, OR THE `status` KEY ABSENT** — `entities/npcs.js:30` (`NpcStatus`, EM-B1d's union); ⭐ **VERSION 8 (judgment 99):** `entities/npcs.js:160` writes `status: input.status \|\| 'active'`, so an absent key is the writer's own spelling of active and the leaf reads `(n.status ?? 'active') === 'active'` — a literal `=== 'active'` would read FALSE on every person stored without the key | ✅ **BOTH ALREADY HELD, and by the cleanest route.** SUBJECT: the people are **the record's own** — `record` IS the subject. STAGE: **active-or-absent IS the live stage**, the union's own word with the writer's default | ✅ **LIVE** |
| `plotInMotion` | ⭐ **`worldState.stressors`** (`worldPulse/worldState.js:318`, `stressors: []` in the constructed world) holding a stressor whose `type` is the pulse's **exported** `COUP_STRESSOR_TYPE` — `src/domain/worldPulse/coup.js:51`, `export const COUP_STRESSOR_TYPE = 'coup_detat';`. ⛔ **Spelled through the constant, never the bare string** (the constant IS exported — measured) | ⛔ **THE LEAF MUST FILTER BOTH, and it MIRRORS THE TREE'S OWN IDIOM** (chair's ruling R9, option c). **Shape precedent, by symbol:** `blockadeFor` (`worldPulse/foodStockpile.js:207`) and `famineFor` (`:234`), each of which does exactly these two things. SUBJECT: `(s.affectedSettlementIds \|\| []).map(String).includes(sid)`. STAGE: the live-stage set — `['active','emerging','peaking','easing']`. ⚠ **`ACTIVE_STAGES` (`foodStockpile.js:98`) IS MODULE-PRIVATE** (`grep -c 'export const ACTIVE_STAGES'` → **0**), so the leaf declares its **own frozen live set of the same four** and A2 asserts it set-equal to **`STRESSOR_LIFECYCLE_STAGES`** (`worldPulse/stressorsCore.js:34`, the SEVEN) **minus the three terminal stages** `resolved`, `residual`, `dormant` — so a pulse-vocabulary change reds rather than drifting | ✅ **LIVE** (design §19 ruling 6) |
| `openRoute` — reader 1 | ⭐ **`activeChannelsFrom(graph, settlementId, { types: ['trade_route'] })`** — `src/domain/region/graph.js:825`. Its own body is the `confirmed` rule: `if (channel.status === 'confirmed') return true;` at `:834`, with `includeSuggested = false` by default, so a `suggested` channel does NOT answer. `'trade_route'` is a declared member of `REGIONAL_CHANNEL_TYPES` (`:47`, member at `:51`) and `'confirmed'` of `REGIONAL_CHANNEL_STATUSES` (`:66`, member at `:68`) | ✅ **BOTH ALREADY HELD BY CONSTRUCTION — the cleanest row in the table.** SUBJECT: the reader's first filter line is `if (String(channel.from) !== String(settlementId)) return false;` (`:830`). STAGE: `status === 'confirmed'` with `includeSuggested = false` (`:826`, `:834`) | ✅ **LIVE** (design §19 ruling 6) |
| `openRoute` — reader 2 | ⚠ **`readRouteNetwork(worldState).edges`** — `src/domain/worldPulse/routeNetworkLedger.js:450` — **behind the gate `routeLifecycleActive(worldState)`** (`:210`, reading `simulationRules.routeLifecycleEnabled === true`). ⛔ **DARK BY DEFAULT, measured:** the flag has **no entry in `DEFAULT_SIMULATION_RULES`** (`simulationRules.js:61-180`) and its only declaration anywhere is `routeLifecycleEnabled: false` at `worldPulse/simulationRules.js:976`, inside the `full_simulation` preset (`:867`) — the module's own Law 7 calls it VIRTUAL, *"absent means dormant"* | ⚠ **THE LEAF MUST FILTER BOTH.** SUBJECT: the ledger is **the realm's whole edge set**, keyed by edge id; a `RouteEdge` carries endpoints **`a`** (codepoint-low) and **`b`** (codepoint-high) (`:117-118`), so the leaf filters `e.a === id \|\| e.b === id`. STAGE: ⛔ **the bottom rung is HIDDEN, NOT ABSENCE** — `ROUTE_GRADES` is `['highway','road','track','hidden']` (`:64`), so a decayed way is still an edge. The leaf filters **`e.grade !== 'hidden'`**; without it an overgrown remnant would offer "Direct trade" | ⚠ **LIVE-GATED** (design §19 ruling 6) |
| `pendingPeaceOffer(counterparty)` | ⚠ **`isBilateralPeaceOffer(outcome)`** (`worldPulse/warPeaceDecision.js:61`) reads an OUTCOME in flight — `proposalPayload.peaceOffer === true`. There is **no standing "an offer is pending" field** on the record; re-measured at `023eda2ec`, `worldPulse/peaceReasons.js` has **ZERO** case-insensitive hits for `offer` or `pending` | **n/a — the row returns `false`.** ⭐ **EM-E4 INHERITS THE LAW:** when E4 lands the offer, its predicate is scoped to **this pair** and to an offer that is **still open** | ⛔ **`source: 'EM-E4'`** — confirmed a gap by design §19 ruling 6 |
| `envoyArrived` | ⚠ **A GAP ON OUR SIDE ONLY, and the nuance is design §19 ruling 6's own.** No "an envoy has arrived at us" standing field exists on the record. ⭐ But the **SENDER's errand carries the arrival by symbol**: `ENVOY_POSITION_BANDS` (`worldPulse/envoyErrandVocabulary.js:116`) holds `'arrived'`, an errand's `positionRef.progressBand === 'arrived'` with `positionRef.journey === 'outbound'` is the arrival (`worldPulse/envoyErrandRecords.js:624-626`), and the errands are readable through `envoyErrandsOf(worldState)` (`worldPulse/envoyErrandRecords.js:866`). So the fact is **LIVE for a REAL neighbour** across the campaign and **absent only for a PHANTOM** (§13: a phantom has no errand ledger). **EM-E4 lands the inbound read over the sender's errand** (design §19 ruling 7) | **n/a — the row returns `false`.** ⭐ **EM-E4 INHERITS THE LAW:** the inbound read is scoped to errands **addressed to this settlement** and to the **non-terminal** states — `TERMINAL_STATES` is `new Set(['home','lost'])` (`envoyErrandVocabulary.js:443`), so an errand that already went home is not an arrival | ⛔ **`source: 'EM-E4'`** — the gap is the INBOUND read, not the fact |

#### ⭐⭐ THE GENERAL LAW THE CHAIR RULED (R9), AND THE AUDIT AGAINST IT

> **EVERY world-state predicate is scoped to the card's SUBJECT — the settlement in `record`, and
> the counterparty where the seal names one — AND to the LIVE stage of its process. A seal offered
> on town A because town B has a coup, or because a coup already resolved, is a DEFECT.**

**The audit, by measurement, over all eleven rows:**

| | already scoped by its reader | the leaf must filter |
|---|---|---|
| **SUBJECT** | `warInProgress` (pair args) · `forceInField` (keyed ledger) · `npcPresent` (the record) · `openRoute` r1 (`channel.from`) | `siegeInProgress` (`targetId`/`coalition`) · `tradeWith` (edge key) · **`beliefExists` (per-settlement index — the reader was REALM-WIDE)** · `plotInMotion` (`affectedSettlementIds`) · `openRoute` r2 (`e.a`/`e.b`) |
| **STAGE** | `warInProgress` · `forceInField` · `siegeInProgress` · `tradeWith` · `beliefExists` · `npcPresent` · `openRoute` r1 | `plotInMotion` (the live-stage set) · `openRoute` r2 (`grade !== 'hidden'`) |

⇒ **five rows need a subject filter, two need a stage filter; the cost is ≈8 effective lines**
(§3's re-measured table) and the leaf stays at **≈83–93 of 250**. ✅ **PROCEED — no split.**

✅ **NOTHING IN THE AUDIT CONTRADICTS A ROW'S LIVE VERDICT, so there is NO BLOCKED FINDING.** The
one serious thing it turned up — `beliefExists`' reader being a realm-wide panel gate — is a
**reader** defect, not a **fact** defect: the belief ledger is per-observer keyed, so a scoped
reader exists and the LIVE verdict stands. Version 1's row is retained and corrected in place
above rather than deleted.

⇒ ⭐ **EIGHT LIVE (one of them gated by `routeLifecycleEnabled` for its second reader), TWO
HONESTLY ABSENT.** The two are **declared with `source: 'EM-E4'` and not invented** — the pins
packet lands the state, exactly as the ruling directs. Version 1 read *six live, four absent*;
design §19 ruling 6 corrects it, and §16.1a below retains the two refuted citations rather than
deleting them, because a deleted wrong measurement is a measurement nobody can re-check.

### 16.1a · ⛔ THE TWO CITATIONS VERSION 1 GOT WRONG — RETAINED AND REFUTED, NEVER DELETED

| version 1's claim | what it cited | the refutation, measured at `023eda2ec` |
|---|---|---|
| `openRoute` is absent — *"the estate has no PROPER-shaped route name anywhere on a settlement (`economicState.tradeRoutes` does not exist; `tradeAccess` is the common noun `road` / `port` / `isolated`)"* | `display/stateProse/defenseStateProse.js:1498` | ⛔ **THE CITATION IS TRUE AND IRRELEVANT.** Read whole, it is a PROSE-SLOT measurement: a `{route}` slot whose annex shape is `proper` gets no fill because no settlement carries a route's PROPER NOUN. It says nothing about route STATE, which lives in the regional graph's channels and the route-network ledger — both measured live above. The lane read a naming gap as a state gap |
| `plotInMotion` is absent — *"`collectPlotHooks` yields narrative plot HOOKS for the dossier, not a coup-plot state. No plot-in-motion record exists"* | `dossier/plotHooks.js:209` (still present at `023eda2ec`) | ⛔ **THE SYMBOL WAS THE WRONG ONE.** `collectPlotHooks` is indeed dossier narration — but the coup-plot state is a STRESSOR, not a hook: `COUP_STRESSOR_TYPE` (`worldPulse/coup.js:51`) is live across the pulse, the assize kernel's unrest set and the herald's routing. The lane searched the dossier layer and never the pulse's stressor vocabulary |

### 16.2 · ⛔ CONSEQUENCE ONE — the predicates need their own leaf, measured

The chair allowed a sibling *"if the leaf cap demands — measure"*. **It demands:** `operations.js`
already estimates **≈213–227 of 250** (R8's fourteen), and ten predicates with their field reads
and **R9's scoping** are **≈83–93** effective lines at version 2 (§3's re-measured table). They go to
**`src/domain/edit/worldConditions.js`** — which makes this packet's *new logic-bearing leaves*
**2 of ≤2**, at the cap exactly.

⛔ The leaf exports `WORLD_CONDITIONS` (the frozen id → row map) and nothing else; each row's
`predicate` is `(record, campaignState) => boolean`, **pure, total, false-on-absence — and SCOPED**
— an absent field yields `false`, never a throw, so a card simply does not offer the seal.
⭐⭐ **SCOPED is the chair's ruling R9 and it is a CONTRACT, not a style note: every predicate
answers about the card's SUBJECT (the settlement in `record`, and the counterparty where the seal
names one) and only while its process is at a LIVE stage.** §16.1's `scope` column spells, per row,
whether the reader already holds those two properties or the leaf must filter — and on what.
A2's arm 4 asserts both with paired negative and positive controls. ⭐ **THE
ROSTER STAYS TEN IDS** (design §19 ruling 6): `openRoute` is ONE id answered by TWO readers, not
two ids. The **TWO** `source: 'EM-E4'` rows are present in the map, **return `false` until their
state exists**, and carry their source note as data so the walker can tell a declared-absent
predicate from a missing one.

#### ⭐ THE ROW SHAPE, EXACTLY — and where "which reader answered" lives

```js
/**
 * @typedef {{
 *   predicate: (record: any, campaignState: any) => boolean,
 *   readers: readonly WorldConditionReader[],   // ordered; [] for a source:'EM-E4' row
 *   source: 'live'|'EM-E4',
 * }} WorldConditionRow
 *
 * @typedef {{
 *   id: string,                                  // the reader's stable id, e.g. 'regional-channel'
 *   module: string,                              // the reader's module path
 *   symbol: string,                              // the exported symbol it calls
 *   gate: ((campaignState: any) => boolean)|null // null = ungated; the flag's gate otherwise
 * }} WorldConditionReader
 */
export const WORLD_CONDITIONS;  // Readonly<Record<string, WorldConditionRow>>, frozen
```

⛔ **`readers` IS THE DATA POSITION THE RULING NAMES** — *"the seal names which"* — and it sits
beside `source`, which is the position version 1 already used for a row's note. It is **STATIC
declared data**, so nothing in the predicate's signature changes and no second return shape is
invented: a card that must name the reader reads the row's `readers` and evaluates each `gate`,
which is pure and is the same gate the predicate itself consults. `openRoute` therefore declares
exactly two readers — `{ id: 'regional-channel', symbol: 'activeChannelsFrom', gate: null }` and
`{ id: 'route-network', symbol: 'readRouteNetwork', gate: routeLifecycleActive }` — and its
predicate is the OR over the readers whose gate passes. Every other live row declares one reader
with `gate: null`; every `source: 'EM-E4'` row declares `readers: []`.

#### ⛔ THE REACHABILITY QUESTION THE CHAIR ORDERED MEASURED — ANSWERED, NOT BLOCKED

The chair asked how a pure `(record, campaignState) => boolean` predicate reaches the
`routeLifecycleEnabled` flag, and whether it needs a third argument. **It does not. Measured, in
three steps (evidence §12):**

1. **The flag is never read directly.** `routeLifecycleActive(worldState)` —
   `worldPulse/routeNetworkLedger.js:210` — is an **exported, pure, total** gate that reads
   `worldState.simulationRules.routeLifecycleEnabled === true` defensively. The predicate calls
   the gate; it never spells the flag.
2. **The flag rides the same `worldState` the roster already needs.** `worldPulse/worldState.js`
   constructs `simulationRules: normalizeSimulationRules()` at `:317` and `stressors: []` at
   `:318` — **one object carries both**, so `plotInMotion` and the route gate read the same
   argument.
3. **`campaignState` already had to carry `worldState` for version 1's six.** `liveSieges` takes
   `{ worldState, regionalGraph }` (`display/warStatus.js:88`) and `atWarWith` takes
   `(graph, worldState, a, b)` (`roads/embassyHazard.js:74`); the store composes exactly that
   object — `campaign: { ...campaign, worldState, regionalGraph }`, `store/aiSlice.js:123`.

⇒ **no third argument, no new plumbing, no signature invented — and therefore NO BLOCKED
FINDING.** The ruling's premise holds in the tree.

### 16.3 · ⛔ CONSEQUENCE TWO — the row-shape change forces EM-B1c, which was pre-declared

`requires: []` becomes `requires: { world: [...], registry: [...] }` on **every one of the
eighteen rows**. At ~+1 effective line per row that is **+18**, taking `operations.js` from
≈231–249 to **≈249–267 against the 250 cap**.

⇒ **the EM-B1c split pre-declared at §3 is no longer a contingency — it is REQUIRED.** Its line
was already chosen and is unchanged: the three `rename-*` ops plus `set-world-fact` (four rows,
≈36 effective) leave, taking B1a to **≈213–231**. ⛔ The lane does not squeeze the rows to avoid
it. **RAISED R6.**

### 16.4 · The acceptance stays at 8

The world half folds into **A2** (validation) and **A4** (relations), as the ruling directs: a
predicate that is **false ⇒ the op is not offered**, and a **planted true ⇒ offered** — both
asserted inside the existing cases, with the **TWO** `source: 'EM-E4'` predicates
(`pendingPeaceOffer`, `envoyArrived`) asserted to return `false` **and** to carry their source
note, so a declared absence is never mistaken for a bug. **No case is added.**

⭐ **VERSION 2 ADDS THREE ARMS INSIDE A2 — still 8 of ≤8, no case minted:**

1. ⛔ **THE ROSTER IS TEN AND THE ABSENT SET IS TWO, BY NAME.** `Object.keys(WORLD_CONDITIONS)` is
   asserted set-equal to the ten ids of §16.1 in both directions with a full offender list, and
   the rows whose `source` is `'EM-E4'` are asserted to be **exactly**
   `['envoyArrived', 'pendingPeaceOffer']` — **`openRoute` and `plotInMotion` asserted ABSENT from
   that set by name**, so a later author restoring either to the absent set reds. This is the
   §19-ruling-6 correction made structural; without it the correction is a paragraph a re-compile
   can lose.
2. ⛔ **THE GATED READER IS ASSERTED DARK BY DEFAULT.** With `campaignState.worldState` carrying no
   `simulationRules.routeLifecycleEnabled`, `openRoute`'s `route-network` reader's `gate` returns
   **`false`** and the row still answers `true` from the `regional-channel` reader alone on a
   planted confirmed `trade_route` channel — and with the flag planted `true` AND a planted edge,
   **both** readers answer. ⭐ **The seal names which:** the arm asserts the reader ids the card
   would name in each of the three worlds, which is the ruling's *"the seal names which"* made
   executable.
3. **EVERY LIVE ROW DECLARES A READER; EVERY ABSENT ROW DECLARES NONE.** `readers.length >= 1`
   for every `source: 'live'` row and `readers.length === 0` for every `source: 'EM-E4'` row, with
   each live reader's `module` + `symbol` asserted to be a **real export of that module** by a
   source scan — so a reader that is renamed or deleted upstream reds here rather than returning a
   silent `false` that reads as "the world does not offer this seal".
4. ⛔⛔ **THE SCOPING LAW, MADE EXECUTABLE (the chair's ruling R9) — the arm that matters most.**
   For **every one of the eight live rows**, two negative controls in one table:
   **(a) THE NEIGHBOUR'S WORLD DOES NOT OFFER MY SEAL** — a campaign in which the fact holds for
   **a different settlement only** (a coup on town B, a siege whose target and coalition exclude
   me, a trade edge between two others, a belief map belonging to another observer, a confirmed
   `trade_route` from somewhere else, a route edge touching neither of my endpoints, a deployment
   keyed to another town, a war between two neighbours) ⇒ **the predicate is `false` for `record`**.
   **(b) A FINISHED PROCESS DOES NOT OFFER ITS SEAL** — the same fact on **this** settlement but
   past its live stage (a `coup_detat` stressor at `lifecycleStage: 'resolved'`, a route edge at
   `grade: 'hidden'`) ⇒ **still `false`**. ⭐ Each is paired with its **positive control** (the
   scoped, live case ⇒ `true`), because an arm that only ever asserts `false` passes on a predicate
   that is broken to always-`false`. ⛔ **This is the prevention guard for the whole class** — the
   law is *"a seal offered on town A because town B has a coup is a defect"*, and it is asserted
   per row rather than trusted to review.

| **R6** | ✅ **CLOSED — EM-B1c RATIFIED (§934.47 add. 10)** on the pre-declared line plus `schedule-event`. B1a keeps **fourteen** home ops and re-measures at **≈213–227 of 250** ✅. The original finding, retained: **the `requires` shape change forced it.** `{ world, registry }` costs ~+1 effective line on each of eighteen rows, taking `operations.js` to **≈249–267 against 250**. The split's line was already chosen at §3 — the three `rename-*` ops plus `set-world-fact` — and taking it leaves B1a at ≈213–231. **The lane does not squeeze rows to avoid a split the chair already pre-declared.** Ratify EM-B1c now, or direct a different line. |
| **R7** | ✅ **CLOSED — `schedule-event` rides with EM-B1c** as the nineteenth home op. The finding, retained: **it is a HOME op** (design §18: *"always … `when` at or after the next tick"*), so it lands in this packet's set rather than EM-B1b's. It arrives at the same moment the cap is already exceeded — so it rides with EM-B1c, or B1a sheds one more row. Chair's call. |

---

## 17. RAISED AT VERSION 2, AND ALL FOUR RULED (design §19 ruling 6; the chair's rulings R8–R11)

✅ **R8 · R9 · R10 · R11 are CLOSED.** Each entry keeps the finding that made it necessary, so a
later reader can re-check the measurement rather than trusting the ruling. **No item is open, and
the R9 audit produced NO BLOCKED FINDING** (§16.1's audit block).

| # | Item |
|---|---|
| **R8** | ✅ **CLOSED BY THE CHAIR — FOURTEEN** (ODQ §934.47 add. 10/11). EM-B1c took `rename-faction`, `rename-npc`, `rename-settlement`, `set-world-fact` and — as the nineteenth home op — `schedule-event`; **EM-B1a keeps the FOURTEEN**. ⭐ The roster is now spelled **ONCE**, at §6, and §2, §3, §7, §8, A1, A3, A4 and the manifest's `_note` all name that one list; A1's set-equal arm spells the fourteen and **asserts B1c's five ABSENT BY NAME**, so the split cannot be quietly re-absorbed. `operations.js` re-measured on fourteen rows: **≈213–227 of 250** (112–126 + 14 for the `requires` split + 87 fixed), ≥23 lines of margin, derived in the open at §3. The finding that made it necessary, retained: version 1's four spellings of the roster disagreed the moment B1c landed, and a set-equal arm reading a roster nobody ruled passes green while being wrong. |
| **R9** | ✅ **CLOSED BY THE CHAIR — OPTION (c), AND AS A GENERAL LAW.** *"EVERY world-state predicate is scoped to the card's SUBJECT (the settlement in `record`; the counterparty where the seal names one) AND to the LIVE stage of its process. A seal offered on town A because town B has a coup, or because a coup already resolved, is a defect."* §16.1 gains a **`scope (subject · stage)` column on all eleven rows**, §16.2 makes SCOPED part of the predicate's contract, and **A2 gains arm 4** — per-row paired negative controls (the neighbour's world; the finished process) each with its positive control. `plotInMotion` mirrors the tree's own idiom by symbol: `blockadeFor` (`worldPulse/foodStockpile.js:207`) and `famineFor` (`:234`), `affectedSettlementIds` membership **and** the live-stage set. ⚠ **`ACTIVE_STAGES` (`foodStockpile.js:98`) is MODULE-PRIVATE** (`grep -c 'export const ACTIVE_STAGES'` → **0**), so the leaf declares its own frozen four and A2 asserts them set-equal to `STRESSOR_LIFECYCLE_STAGES` (`worldPulse/stressorsCore.js:34`) minus `resolved`/`residual`/`dormant`. **THE AUDIT OF THE OTHER SEVEN LIVE ROWS IS IN §16.1** — five rows need a subject filter, two a stage filter, ≈8 effective lines, leaf at ≈83–93 of 250 ⇒ **PROCEED**. ⛔ **Its one serious find: `beliefExists`' version-1 reader `hasBeliefMaps` is a REALM-WIDE panel gate** (*"does this world carry ANY belief map?"*, `settlementBeliefs.js:185-190`) — corrected to a per-settlement index with `hasBeliefMaps` demoted to a dormancy pre-gate. **NOT a BLOCKED finding: the ledger is per-observer keyed, so the LIVE verdict stands.** |
| **R10** | ✅ **CLOSED BY THE CHAIR — ADDED.** *"A symbol the deliverable CALLS and must find unchanged is a required symbol, and the sealed dispatch hashes those paths as substrate — an unpinned reader could move under the packet silently."* **`requiredSymbols` goes 18 → 23 → 32 (+14 over version 1).** The nine added under R10, each `grep -c` → **1** at `023eda2ec`: `atWarWith` · `atWarWithIdx` · `liveSieges` · `PRIMARY_RELATIONSHIP_TYPES` · `edgeKeyBetween` · `hasBeliefMaps` · `getSpatialLedger` · `ROUTE_GRADES` · `STRESSOR_LIFECYCLE_STAGES` — the last four arrive **because R9's scoping made the leaf call them**. ⛔ **ONE ROW IS DELIBERATELY NOT ADDED, and the standard is the reason: `forceInField` HAS NO SYMBOL TO PIN.** Its reader is a **field** — `worldState.deployments[record.id]`, a keyed lookup — and the two exported functions over that field (`activeWarPairs`, `activeDeployments`) return *war pairs* and *deployment rows*, not a per-settlement boolean, so the leaf calls neither. A row naming one would pin a symbol the deliverable does not reach, which is the failure the standard's *"only what the deliverable must PRESERVE"* clause exists to prevent. **The field's own protection is A2 arm 4's keyed negative control** (a deployment keyed to another town ⇒ `false`). `git diff --stat d31af2cee 023eda2ec` over the **new full twenty-path list** prints **nothing** — not one moved. |
| **R11** | ✅ **CLOSED BY THE CHAIR — §7 STATES A DELTA, NEVER ABSOLUTE FIGURES.** §7 now carries this packet's own census delta — **`files +1 · parked +0 · credited +1 · titles +8 · suiteTitles +1`** — each figure derived from the packet's own `CREATE`/`TEST` rows and from the walker's own four expressions (`measureCensus()`, `sovereigntyLightingContract.walker.test.js:601-604`), plus the line *"the absolute tuple is stamped by the chair at promotion from `tests/lint/.lighting-census-baseline.json`; a hand-composed absolute here is the stale-numeral class"*. The verbatim-red SHAPE is kept as a placeholder example (`expected ‹B›+1 to be ‹B›`), clearly marked as a form rather than a figure. ⭐ **Every absolute tuple is gone from the packet** — the header's base note and §3's baseline posture both now point at §7's rule instead of quoting numbers. The finding that forced it, retained: the baseline moved once inside this packet's own base window (evidence §15.2) and moves again with EM-P2 and T3's three members. |
