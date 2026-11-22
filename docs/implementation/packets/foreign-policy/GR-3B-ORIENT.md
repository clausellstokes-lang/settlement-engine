# Foreign Policy / GR-3B-ORIENT — the per-term obligation axis (CR-GR3B-3-R1)

- **Status:** `LANDED`
- **Landed:** `d56d944c` (2026-08-10; 8/8 acceptance, CR-ORIENT-C inversion applied, coupling row cleared, peaceTerms.js at 793/800)
- **Status note:** **Promoted READY by the chair 2026-08-10 (CR-FP-ORDER: ORIENT → IN-0C → GR-3B, strictly serial).** Every decision this
  packet needs is ruled (CR-GR3B-3-R1), every premise it rests on is measured at the
  verified base (§3), and it withholds no coding instruction. It is DRAFT only because
  the chair — not this lane — flips statuses. **CR-GR3B-3-R1 is recorded to the owner as
  EP-s, active-with-veto. An owner veto of EP-s flips this packet to `BLOCKED` (owner)
  and reopens §5's option set; nothing here may be implemented in that event.**
- **Packet version:** `2` (supersedes version 1's owner-blocked compile, whose premise
  CR-GR3B-3-R1 replaced; §3.7 records what version 1 got right and what it got wrong)
- **Verified base:** `claude/composite-r4` at `820ed989df1747cfbeb8b0a5a9a07b253736151f`
- **Last revalidated:** `2026-08-10` at `820ed989`
- **Amended (CR-ORIENT-C, chair, 2026-08-10):** §6.2's `pIndex` argument is REPLACED by an
  injected pure closure `pressureFor: (id) => PressureSummary`, supplied by `peaceTerms.js`
  inline at the construction expression — dependency inversion after CW-0w's pair-keyed
  coupling ratchet refused the leaf's `relationshipEvolution.js` import (the §6.2
  reachability argument was refuted: the ratchet keys on (importer, imported) PAIRS).
  Zero new cross-layer pairs, zero registry motion, zero baseline motion, zero line cost.
  The implementation receipt records the applied delta.
- **Depends on:** `NONE beyond the verified base`
- **Collision group:** `IN-0C` — **both packets modify
  `src/domain/worldPulse/peaceTerms.js`, which has exactly 10 effective lines of
  headroom, and they share it.** They must serialize; whichever lands second
  **re-measures** before it starts. No overlap with `GR-3B` (which owns
  `pactFormation.js` + `pactAmendment.js` and touches nothing here) and none with the
  town-cartography lane.
- **Commit authority:** `NONE until the chair promotes this row to READY`
- **Baseline posture:** no focused suite was run at this compile. The design rests on
  executed probes against live source (§3) plus a calibrated size census (§5); a
  baseline claim belongs to the implementer at step 1, not to the compiler.

> **⚠ BASE DRIFT DURING AUTHORSHIP, DECLARED — AND IT IS A SOURCE DELTA THIS TIME.**
> This packet's first compile was stamped `e1f4c654`. The shared tree then advanced
> twice: `5066c34b` ("TC-3a: the wards get their names…") landed **12 source and test
> files**, and `820ed989` ("TC-3a → LANDED…") followed. `e1f4c654` is an ancestor of
> `820ed989`. `git diff --name-only e1f4c654..820ed989 -- src tests` returns 12 paths,
> **all `townCartography` / `townScene` / `townSceneExport` / `townScene.worker`** —
> **not one foreign-policy file.** Every measurement below was **re-executed at
> `820ed989`**, not carried forward: the size census, the probe, and the target-clean
> preflight all re-ran and are quoted from the new base. **The working tree is now
> CLEAN — zero dirty paths — for the first time in this compile.**

## 1. Dispatch verdict and reconciled authority

**Dispatch on promotion.** This packet resolves who owes whom on a negotiated treaty,
**per term**, from a datum the record already carries. It adds **no persisted field**,
changes **no persisted shape**, and changes the answer seen by **zero** existing
consumers of `treatyOrientationOf`.

Authority, in order:

1. Live code at `820ed989` — re-verified row by row in §4.
2. `PACKET_STANDARD.md` — selection, ordering, lifecycle and ownership must be exact;
   never raise a baseline, budget, timeout or ceiling to finish a packet.
3. **CR-GR3B-3-R1** (chair, 2026-08-10), which **supersedes CR-GR3B-3**:

   > the obligation axis is PER-TERM and it IS the existing persisted `beneficiary`
   > (option C — ZERO persisted-shape change, so the park clause does not fire and the
   > chair may rule): obligee = the term's beneficiary; obligor = the counterparty;
   > payer = obligor, payee = beneficiary; capacity subject = obligor; monitor =
   > obligee; defaultedBy = obligor. Symmetric beneficiaries ('both' / reciprocal) =
   > MUTUAL obligation, no transfer direction — and the CR-GR3B-1 ladder never drafts a
   > transfer term symmetric. v1 §6's "never derive from beneficiary" prohibition
   > guarded an UNRULED choice; this ruling DEFINES the axis, which is a different act.
   > Recorded to the owner as EP-s (active-with-veto, not parked).

4. F-S1-E3 — the GR-3b transfer-term drafting ban is SUSTAINED **until this packet
   lands**. This packet is that ban's release condition.

Reconciled contradictions, all now closed:

- **Version 1's block is dissolved, not overruled.** Version 1 parked because
  CR-GR3B-3's mechanism needed a persisted proposer marker and none exists.
  CR-GR3B-3-R1 does not restore that mechanism; it names a **different, already
  persisted** datum as the axis. The park clause ("if from/to do NOT survive → the fix
  needs a persisted field → park") is not reached, because this fix needs no field.
- **The direction contradiction is resolved in favour of live code.** Version 1 §6
  recorded that CR-GR3B-3's `obligor = proposer` inverted the shipped
  `draftPactSheet` receipt. R1 rules **obligor = counterparty**, which is what the
  receipt has always said (§3.1, quoted from execution). Live code and the ruling now
  agree; `PACKET_STANDARD.md`'s "two higher authorities disagree ⇒ BLOCKED" no longer
  applies.
- **`GR-3B.md` §6's "never derive orientation from … beneficiary" is LIFTED for the
  per-term axis, and only for it.** R1's own words: that prohibition guarded an
  **unruled** choice; a ruling that *defines* the axis is a different act. The two
  companion prohibitions — **no derivation from party sort order, and none from
  proposer order** — **stand unchanged and are re-imposed in §8**. `GR-3B.md` §6 must
  be restated in the same documentation change that lands this packet.

## 2. Outcome

**Observable result:** a negotiated clause knows which court owes it. The party that
asked is owed; the party that granted pays, is watched, is the one whose granary a
stream term draws from, and is the one named when the clause defaults. A clause both
courts hold — a non-aggression pact, a reciprocal pair — binds them mutually and moves
nothing in either direction.

**Definition of done:** `advanceTreaties` PASS 2 resolves capacity, monitoring,
conserved movement and `defaultedBy` **per term** through one reader; every existing
war and sale treaty resolves byte-identically to today; and a swapped-proposer mint of
the same ask produces the mirrored obligation on a ledger record whose key, parties and
receipts are unchanged.

In scope:

1. one primary behavior — the per-term obligation resolution;
2. one required integration — PASS 2 consumes it at the four sites §4.2 names;
3. one prevention guard — a closed-vocabulary pin plus a war/sale invariance
   counterforce, so the new arm cannot silently change an old answer.

Explicit non-goals — each measured, not assumed:

- **widening `treatyOrientationOf`, `TREATY_ORIENTATION_KINDS` or `TREATY_ROLE_WORDS`.**
  `tests/domain/treatyOrientationWr10g.test.js:237-238` pins the kind list to exactly
  `['sale','unknown','wartime']` **and** pins `Object.keys(TREATY_ROLE_WORDS)` to equal
  it. Adding `negotiated` to either reds that test. The per-term reader gets its **own**
  closed vocabulary (§6.1);
- **instrument-level voice, disposition and strain for negotiated pacts.**
  `treatyLapsedBeats` and `treatyDefaultDetectedBeats` both return `[]` on
  `!orientation?.resolved` (`treatyLifecycleVoice.js:239, :311`), and the strain accrual
  is guarded by `orientation.resolved` (`peaceTerms.js:745`). A negotiated instrument is
  voiceless today and **stays voiceless** after this packet. That is a declared boundary
  with a forward note in §11, not an oversight;
- drafting `temple_restitution` or `settlement_provision` — that is `GR-3B`, which
  depends on this packet, not the reverse;
- any persisted field, key, migration, flag, golden, ratchet, tuning or UI;
- a second orientation module, a second spelling of "who owes whom", or a display word
  for the negotiated role.

Record adjacent discoveries in the receipt; do not investigate or repair them.

## 3. The verify-at-compile, executed at `820ed989`

Method: drive the real `draftPactSheet` / `signPactProposal` / `ensureWorldState`
against live source under Node, then read the persisted rows. Probe preserved as
`gb-orient-beneficiary-roundtrip.mjs`. Read-only; nothing was written into the repo.

### 3.1 The lens emits a SCALAR `beneficiary` per term, and the receipt names the obligor

```
one-sided   terms=1 resource_share[economic] beneficiary="alpha_court"
            receipt: bravo_court promises resource share to alpha_court for 4 years.
symmetric   terms=1 non_aggression[security] beneficiary="both"
            receipt: alpha_court and bravo_court promise non-aggression pact to each other for 8 years.
reciprocal  terms=2 resource_share[economic] beneficiary="alpha_court" | resource_share[economic] beneficiary="bravo_court"
            receipt: bravo_court promises resource share to alpha_court for 4 years.
                  || alpha_court promises resource share to bravo_court for 4 years.
```

Three facts fall out, and R1's whole rule is built from them:

- `beneficiary` is a **scalar string on each emitted term**, never an array —
  `draftPactSheet` maps one term per beneficiary (`pactFormation.js:251`);
- the **non-beneficiary promises**. The receipt template is
  `` `${beneficiary === fromId ? toId : fromId} promises … to ${beneficiary}` ``
  (`pactFormation.js:269`), i.e. **obligor = the party that is NOT the beneficiary** —
  exactly R1;
- **reciprocal is not symmetric.** A reciprocal ask yields **two one-sided terms**, each
  resolving independently in mirrored directions. Only `beneficiary === 'both'` — which
  the lens emits only for `family === 'security'` (`pactFormation.js:249`) — is the
  mutual case. Security terms are `war_block` / `grant` executors and are **never
  `stream: true`** (§4.3), so the mutual case never has a transfer direction to lose.

### 3.2 The persisted rows carry `beneficiary`, on a multi-round instrument

Alpha proposes security at T=100; bravo proposes economic at T=120. One record:

```
minted: true | amended: true
ledger key: alpha_court>bravo_court | parties: ["alpha_court","bravo_court"]
  non_aggression   family=security  beneficiary="both"        mintedTick=100 stream=false
  resource_share   family=economic  beneficiary="alpha_court" mintedTick=120 stream=true
```

### 3.3 The round trip preserves it

```
treaty survives hydration : true
record byte-identical    : true
per-term beneficiary after round trip:
  non_aggression   beneficiary="both"        mintedTick=100
  resource_share   beneficiary="alpha_court" mintedTick=120
treaty-level orientation after round trip: {"kind":"unknown","resolved":false,"obligorId":"","obligeeId":"", …}
```

`JSON.stringify` → `JSON.parse` → `ensureWorldState`. **The record is byte-identical
across the round trip and the treaty-level orientation stays `unknown` at both ends** —
which is precisely why the axis must be per-term and why nothing about
`treatyOrientationOf` needs to move.

### 3.4 R1's resolution, applied by hand to the persisted rows

```
non_aggression   mutual=true  obligee=""            obligor=""
resource_share   mutual=false obligee="alpha_court" obligor="bravo_court"
```

Bravo — the counterparty on the economic clause — is the obligor, and the receipt in
§3.1 says so in words. **CONFIRMED by execution.**

### 3.5 The swapped-proposer receipt — the datum is NOT invariant

Version 1's headline was that the persisted record is byte-invariant under swapping the
proposer. **Measured over the WHOLE record, that is false.** Same ask, proposer and
counterparty swapped:

```
ledger keys identical      : true
parties identical          : true
WHOLE RECORD identical     : false   <- the per-term axis DOES distinguish the proposer
alpha-proposed beneficiary : ["alpha_court"]
bravo-proposed beneficiary : ["bravo_court"]
alpha-proposed receipt     : bravo_court promises resource share to alpha_court for 4 years.
bravo-proposed receipt     : alpha_court promises resource share to bravo_court for 4 years.
```

Version 1's specific claims hold exactly as far as they were measured — the **ledger
key**, the **`parties` array** and the **`receipts` array** are byte-identical under the
swap. Its **generalization to the whole record was wrong**: it compared three
treaty-level fields and did not compare the terms. Proposer identity survives the mint
in full — **per term, as `beneficiary`.** This is the receipt CR-GR3B-3-R1 rests on, and
it is why the axis is implementable with zero persisted-shape change.

### 3.6 A1 becomes a real acceptance case

§3.5's inequality is not a compile-time curiosity: it is acceptance case **A4**, driven
through the real mint rather than restated from this section (the recorded
derive-don't-restate law).

### 3.7 What version 1 got right, kept

- `proposal.from` / `proposal.to` genuinely never reach persistence: `signPactProposal`
  reads them into locals and `const [first, second] = [a, b].sort(codepoint)` builds
  every treaty-level field from the **sorted** pair (`pactFormation.js:410-429`);
- the proposal row that does carry `from`/`to` is **pruned the same tick**
  (`pactProposals.js:375-379`, called at `pactFormation.js:679`); its own header says
  *"A QUEUE, NOT AN ARCHIVE"*;
- `sworn` carries no direction (`oathHolder.js:194`, codepoint-keyed, equal ticks);
- **a negotiated instrument has no single proposer** (§3.2) — so a treaty-level
  `proposedBy` would have been wrong even if it had been persisted.

All four remain true and all four are **reasons the axis is per-term**, not reasons to
park. Version 1's error was treating "the treaty-level marker is missing" as the whole
question.

## 4. Verified live tree contract

Re-verified at `820ed989`. Navigate by symbol; line numbers are hints only.

### 4.1 The reader and the datum

| Role | File | Symbol | Verified fact | Required use |
|---|---|---|---|---|
| Instrument reader | `src/domain/worldPulse/treatyOrientation.js` | `treatyOrientationOf` | Two resolvable shapes: sale (`sellerId`+`buyerId`), then wartime (`loserId`+`victorId`); else `unresolvedOrientation()` | **Unchanged.** Its return shape and every answer it gives stay byte-identical |
| Closed vocabulary | same file | `TREATY_ORIENTATION_KINDS` | `['unknown','wartime','sale']`, **pinned exactly** by `treatyOrientationWr10g.test.js:237` | **Do not widen** |
| Role words | same file | `TREATY_ROLE_WORDS` | Keys pinned to equal `TREATY_ORIENTATION_KINDS` (`:238`) | **Do not widen** |
| Module law | same file | header | *"PURE + ZERO IMPORTS"*, reached by `treatyEnforcement.js` so it may close no cycle | The new per-term reader lives here and **must stay pure and import-free** |
| The datum | `src/domain/worldPulse/pactFormation.js` | `draftPactSheet` | `beneficiaries = symmetric ? ['both'] : reciprocal ? [fromId, toId] : [fromId]` (:250), one term per beneficiary (:251), scalar `beneficiary` key (:266) | Read; **never edit under this packet** |
| The wording | same file | the term `receipt` | `` `${beneficiary === fromId ? toId : fromId} promises … to ${beneficiary}` `` (:269) | The obligor is already named in words; the resolver must agree with it |
| Re-basing | same file | `signPactProposal` | Terms are re-mapped with `mintedTick: tick` and the span preserved (:382-387); every other term key, **including `beneficiary`**, survives the spread | Read |
| War/sale terms | `src/domain/worldPulse/peaceTermsDrafting.js`, `peaceTerms.js`, `peaceTermsSale.js` | `draftTerms`, `materializeCarriedTermSheet`, the sale mint | **None writes a `beneficiary` key** (verified by reading each term literal) | This is why the delegation arm in §6.1 is total |

### 4.2 THE CONSUMPTION SITES — `advanceTreaties` PASS 2, traced exactly

`peaceTerms.js`, the `for (const key of Object.keys(nextLedger).sort())` loop.
**S1–S4 are the sites CR-GR3B-3-R1 binds. S5–S9 are instrument-level and stay as they
are** — each is listed so the implementer can see that leaving it alone is a decision,
not an omission.

| # | Line(s) | What it does today | Under R1 |
|---|---|---|---|
| S0 | `:630-632` | `const orientation = treatyOrientationOf(treaty)`; `victorId = orientation.obligeeId`; `loserId = orientation.obligorId` | **KEPT VERBATIM.** Still the instrument-level answer, still feeding S5–S9 |
| **S1** | `:654-656` | `buildPressureSummary(pIndex, loserId)` → `loserBurden01` → `loserCapacity01` — the **capacity** subject | **PER TERM:** the capacity subject is the term's obligor |
| **S2** | `:657` | `victorMonitorReach(victorId, loserId, workingState, truthFor)` — the **monitoring** reach | **PER TERM:** the obligee watches the obligor |
| **S3** | `:670, :673` | `evolveCompliance({ loserCapacity01, monitorReach01 })`; `term.burden01 = round4(loserBurden01)` | **PER TERM:** consumes S1+S2 for **this** term |
| **S4** | `:688-698` | **conserved movement** — `payer: freshestSettlement(…, loserId)`, `payee: …victorId`, `foodDeltas` on both ids, `term.extractedFromLoser` / `term.deliveredToVictor` | **PER TERM:** payer = obligor, payee = obligee; a **mutual** term resolves to empty ids and therefore moves nothing |
| **S5** | `:732-734` | `if (defaultSeverity01 > 0 && loserId) treaty.defaultedBy = loserId` — **`defaultedBy`** | **PER TERM SOURCE, SCALAR WRITE.** The named oathbreaker becomes the obligor of the defaulting term. **The key stays a scalar string** — `warReasons.js:550` reads `String(t?.defaultedBy || '')`, so an array would be a persisted-shape change and is forbidden |
| S6 | `:711` | `treatyDispositionDeltas({…, outcome:'held', victorId, loserId })` | **UNCHANGED** — instrument-level |
| S7 | `:738` | `treatyDispositionDeltas({…, outcome:'defaulted', loserId, severity01 })` | **UNCHANGED** — instrument-level, still `loserId` |
| S8 | `:716, :726` | `treatyLapsedBeats({…, orientation })`, `treatyDefaultDetectedBeats({…, orientation })` | **UNCHANGED** — both return `[]` on `!orientation.resolved`; negotiated stays voiceless (§2 non-goal) |
| S9 | `:745-746` | `if (anyStrainThisTick && orientation.resolved) accrueStrainResentment(…, loserId, victorId, loserBurden01, …)` | **UNCHANGED** semantics; the burden figure it reads becomes the reader's **instrument-level** burden (§6.2), which is the same number it is today on every treaty that reaches this branch |

### 4.3 Supporting facts

| Role | File | Symbol | Verified fact |
|---|---|---|---|
| Capacity source | `src/domain/worldPulse/relationshipEvolution.js` | `buildPressureSummary` | Already imported by `peaceTerms.js:118`; pure |
| Monitor source | `src/domain/worldPulse/peaceTermsAppraisal.js` | `victorMonitorReach` | Already imported by `peaceTerms.js:144`; pure |
| Symmetric ⇒ never a stream | `src/domain/worldPulse/peaceTermsCatalog.js` | `TERM_CATALOG` | `non_aggression` (`war_block`) and `mutual_defense` (`grant`) are the only `security` rows and **both are `stream: false`** |
| Grant reader | `src/domain/worldPulse/treatyEnforcement.js` | `grantTermFor` | `beneficiary === 'both' \|\| beneficiary === grantee` wins; orientation consulted **only** when `beneficiary` is absent (:233). **Already implements R1's axis for the seven grant terms.** This packet makes PASS 2 agree with it |
| Stacking cell | `src/domain/worldPulse/pactAmendment.js` | `stackingCellOf` | `` `${family}\|${beneficiary}` `` — the estate already treats `beneficiary` as the identity axis |
| Existing consumers | 9 sites | `treatyOrientationOf` | `peaceTermsDocument.js:216`, `settlementPolitics.js:660`, `treatyEnforcement.js:99/149/233`, `sovereigntyTransfer.js:375`, `hegemony.js:173`, `sovereigntyMarketStage.js:277`, `display/treatyDocument.js:176`, `peaceTerms.js:630` |

## 5. The cure shape — chosen by consumer count, not by taste

Two shapes were on the table. The choice is decided by a measurement, not a preference.

| Shape | Existing `treatyOrientationOf` consumers whose answer changes | Verdict |
|---|---:|---|
| **A — extend `treatyOrientationOf`'s return** so a negotiated instrument resolves at the treaty level | **9** | **REFUSED.** Every one of the nine sites in §4.3 would begin binding negotiated pacts it has never bound — enforcement caps, occupation holds, hegemony, the sovereignty market, two documents and a display. Worse, §3.2 proves the treaty-level answer is **ill-defined** for a multi-round instrument: one record, two clauses, opposite directions. It would also have to widen `TREATY_ORIENTATION_KINDS`, which reds a live pin (§4.1) |
| **B — a new PER-TERM read, consumed by PASS 2** | **0** | **CHOSEN.** Additive. `treatyOrientationOf`'s signature, return shape and every answer stay byte-identical. One new consumer (PASS 2). The one-reader law is kept **literally**: the resolution lives in `treatyOrientation.js` itself and **delegates** to `treatyOrientationOf` whenever a term carries no `beneficiary`, so there is still exactly one module that knows who owes whom |

**Every site this packet touches, named:**

| Site | File | What changes |
|---|---|---|
| 1 | `src/domain/worldPulse/treatyOrientation.js` | **+** `TERM_OBLIGATION_KINDS`, `TermObligation` typedef, `termObligationOf`. Nothing existing is edited |
| 2 | `src/domain/worldPulse/treatyTermRoles.js` | **NEW LEAF** — `makeTermRoleReader`, the direction-memoized capacity/monitor reader |
| 3 | `src/domain/worldPulse/peaceTerms.js` | PASS 2 sites **S1–S5** rewired; S0 and S6–S9 untouched |

**No other production file is edited. Zero existing call sites of `treatyOrientationOf`
are edited.**

## 6. Exact contracts

### 6.1 `termObligationOf` — in `treatyOrientation.js`, pure, zero imports

```js
/** The per-term obligation vocabulary. A SUPERSET of TREATY_ORIENTATION_KINDS by
 *  exactly one member: the three instrument kinds pass through from the delegation
 *  arm, and `negotiated` is the only kind this reader can add.
 *  ⚠ TREATY_ORIENTATION_KINDS and TREATY_ROLE_WORDS are NOT widened — both are pinned
 *  exactly by tests/domain/treatyOrientationWr10g.test.js:237-238. */
export const TERM_OBLIGATION_KINDS = Object.freeze(['unknown', 'wartime', 'sale', 'negotiated']);

/**
 * @typedef {Object} TermObligation
 * @property {string} kind       a TERM_OBLIGATION_KINDS member
 * @property {boolean} resolved  false ⇒ both ids below are the empty string
 * @property {boolean} mutual    true ⇒ both parties hold it; there is NO transfer direction
 * @property {string} obligorId  bears this clause's burden — pays, is watched, is named on default
 * @property {string} obligeeId  is owed it
 */
```

`termObligationOf(treaty, term)` resolves in this order, and the order is the contract:

1. **`beneficiary` present and non-empty** ⇒ negotiated provenance.
   - `beneficiary === 'both'` ⇒
     `{ kind: 'negotiated', resolved: true, mutual: true, obligorId: '', obligeeId: '' }`.
     **`resolved: true` with empty ids is a REAL VERDICT** — "both parties hold this, and
     nobody hands anything over" — and it is why `mutual` is a separate field rather than
     an inference from empty ids.
   - otherwise: read `treaty.parties` as strings. Resolve **only** when the array holds
     exactly two distinct ids, one of which **is** the beneficiary. Then
     `obligeeId = beneficiary`, `obligorId = ` the other, `mutual: false`,
     `kind: 'negotiated'`, `resolved: true`.
   - **any other shape fails closed** to the unresolved value — a beneficiary absent from
     `parties`, a one-party or three-party record, a beneficiary equal to both entries.
     No guess, no placeholder, no party standing in for the other.
2. **no `beneficiary`** ⇒ delegate: `const o = treatyOrientationOf(treaty)` and return
   `{ kind: o.kind, resolved: o.resolved, mutual: false, obligorId: o.obligorId,
   obligeeId: o.obligeeId }`. **This arm is total** over every war and sale term in the
   tree, because no war-door, carried-sheet or sale term literal writes a `beneficiary`
   key (§4.1, last row).
3. **unresolved value:**
   `{ kind: 'unknown', resolved: false, mutual: false, obligorId: '', obligeeId: '' }`.

Hard laws, carried over verbatim from the module's own header:

- the same `text()` coercion every id already passes through — **never
  `String(undefined)`**, never the four-character string `"undefined"`;
- `unknown` is a verdict, not a fallback. A caller treating an unresolved obligation as
  "this clause binds nobody" is correct;
- **pure, zero imports.** The module is reached by `treatyEnforcement.js` precisely so it
  can close no cycle, and that must remain true.

### 6.2 `makeTermRoleReader` — the new leaf `treatyTermRoles.js`

Why a leaf and not `peaceTerms.js`: `peaceTerms.js` has **10 effective lines of
headroom** (§7) and shares them with `IN-0C`. Why a leaf and not `peaceTermsAppraisal.js`:
that module would have to gain an import edge to `relationshipEvolution.js` (438 eff),
dragging it into everything that imports the appraiser — the recorded
barrel-hop-drags-the-whole-family hazard. **A new leaf adds no edge to any existing
module's graph**: its four imports (`treatyOrientation.js`, `peaceTermsAppraisal.js`,
`relationshipEvolution.js`, `kernel/math.js`) are all already in `peaceTerms.js`'s own
import set, so reachability from the head is unchanged.

```js
/**
 * @param {{ treaty:Record<string,unknown>, orientation:TreatyOrientation,
 *           pIndex:Record<string,unknown>|null, worldState:Record<string,unknown>,
 *           truthFor:(id:string)=>number }} args
 * @returns {{ forTerm(term:Record<string,unknown>):
 *             { obligorId:string, obligeeId:string, mutual:boolean, resolved:boolean,
 *               burden01:number, capacity01:number, reach01:number },
 *             instrument: { burden01:number, capacity01:number, reach01:number } }}
 */
```

- **Memoized by DIRECTION, and there are at most two.** A treaty has two parties, so
  `(obligor, obligee)` has at most two orderings plus the mutual case. Key the memo on
  `` `${obligorId}>${obligeeId}` ``.
- **THE EAGER ARM IS LOAD-BEARING FOR BYTE-IDENTITY.** When
  `orientation.resolved === true`, the reader computes that instrument direction's
  pressure and reach **at construction**, in exactly the order `peaceTerms.js` computes
  them today — `buildPressureSummary` then `victorMonitorReach`. Every war and sale
  treaty in the tree is resolved, so **their call sequence, call count and argument
  values are unchanged**. Only a *negotiated* instrument — unreachable without
  `pactFormationEnabled`, which is virtual and unlit in every preset — resolves
  additional directions, and those resolve **lazily on first use**.
- **Arithmetic transcribed, not reinvented.** Each direction computes
  `burden01 = clamp01(0.6 * clamp01(Number(p?.economy) || 0) + 0.4 * clamp01(Number(p?.food) || 0))`,
  `capacity01 = clamp01(1 - burden01)`, `reach01 = victorMonitorReach(obligeeId, obligorId, worldState, truthFor)`
  — byte-for-byte the expressions at `peaceTerms.js:655-657`. **Do not re-derive them, do
  not "simplify" them, do not author a second `clamp01`.**
- **The mutual and unresolved cases share one identity row:**
  `{ obligorId: '', obligeeId: '', burden01: 0, capacity01: 1, reach01: <the reach for the empty pair> }`,
  computed through the same expressions with empty ids — which is **exactly what PASS 2
  computes today for an unresolved treaty**, so a mutual clause behaves as a negotiated
  clause behaves now.
- `instrument` exposes the resolved instrument direction's figures (or the identity row
  when unresolved), for **S9 only**.
- **Pure. No rng, no clock, no writes.** `peaceTerms.js`'s no-rng law extends here.

### 6.3 PASS 2 rewiring — exactly, site by site

Construct the reader **inside** the per-treaty loop, after `S0`, because
`workingState` can change between treaty iterations (`accrueStrainResentment` at `:746`)
and the reader must see the same `workingState` today's code sees.

| Site | Today | After |
|---|---|---|
| S1+S2 (`:654-657`, 4 lines) | four hoisted `const`s | **one** line: `const roles = makeTermRoleReader({ treaty, orientation, pIndex, worldState: workingState, truthFor });` |
| inside the term loop | — | **one** line: `const role = roles.forTerm(term);` |
| S3 (`:670`) | `evolveCompliance({ loserCapacity01, monitorReach01 })` | `evolveCompliance({ loserCapacity01: role.capacity01, monitorReach01: role.reach01 })` |
| S3 (`:673`) | `term.burden01 = round4(loserBurden01)` | `term.burden01 = round4(role.burden01)` |
| S4 (`:688-698`) | `loserId` / `victorId` | `role.obligorId` / `role.obligeeId` — **in place, six substitutions, no new lines** |
| S5 (`:702`) | `defaultSeverity01 = Math.max(…)` | also record `defaultObligorId = role.obligorId` — **one** new `let` above the loop, **one** new statement here |
| S5 (`:732-734`) | `if (defaultSeverity01 > 0 && loserId) { treaty.defaultedBy = loserId; … }` | `if (defaultSeverity01 > 0 && defaultObligorId) { treaty.defaultedBy = defaultObligorId; … }` — in place |
| S9 (`:746`) | `…, loserBurden01, …` | `…, roles.instrument.burden01, …` — in place |
| S0, S6, S7, S8 | — | **untouched** |

**Why `defaultedBy` stays byte-identical on every legacy record:** on a war or sale
treaty every term delegates to the same instrument orientation, so
`defaultObligorId === loserId` for every defaulting term. The write is the same string
it is today.

**Which term wins when two default:** the **last defaulting term in the treaty's stored
term order** sets `defaultObligorId`, matching how `defaultSeverity01` already folds
across terms (`Math.max`, `:702`) — one scalar per instrument, deterministic because the
term order is deterministic. On a war or sale treaty every candidate is the same id, so
the rule is unobservable there; on a negotiated instrument it is the only rule this
packet may set without inventing a second persisted key. **Recorded as a JUDGMENT,
vetoable**, and pinned by A3.

### 6.4 Flag, dormancy, lifecycle, goldens

- **No new flag.** The negotiated arm is reachable only through instruments
  `signPactProposal` mints, and that door is gated by
  `pactProposals.js:pactFormationActive` (strict `rules.pactFormationEnabled === true`),
  which is **virtual and unlit in every preset**.
- **Dormancy:** with the flag dark no negotiated instrument can exist, so
  `termObligationOf` takes its delegation arm on every term in the world and PASS 2
  computes the same numbers from the same calls in the same order.
  `tests/property/pactFormationDormancyFence.test.js` and
  `tests/property/peaceCausalDormancyGolden.test.js` must be **green, unmodified**.
- **Golden posture: UNCHANGED. No golden may move.** Unexpected golden motion is a
  **STOP**, never a regeneration.
- **Persisted shape: no change.** No new key on a treaty or a term; `defaultedBy` stays
  a scalar string. No migration, no normalizer, no import path change.
- **Lit-path behavior change, declared:** with `pactFormationEnabled` lit, a defaulting
  negotiated clause now writes `defaultedBy`, which `warReasons.js:550`'s
  `scoreTreatyDefault` reads as a casus belli — and a negotiated stream clause now moves
  real grain. **That is the wave.** It is unreachable in every shipped preset, so no
  same-seed campaign shifts.
- **Alignment:** `DECLARED EMPTY` — resolving who owes whom is a reading of the ledger,
  not a moral act.
- **Receipts:** **zero new kinds and zero new sentences.** The per-term `receipt` is
  already written at draft time and this packet does not touch it.

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `MODIFY` | `src/domain/worldPulse/treatyOrientation.js` | `TERM_OBLIGATION_KINDS`, `TermObligation`, `termObligationOf` | `+40 eff` | Add §6.1 verbatim. **Edit nothing that exists** — `treatyOrientationOf`, `TREATY_ORIENTATION_KINDS`, `TREATY_ROLE_WORDS`, `treatyRoleWord`, `text`, `recordOf`, `unresolvedOrientation` are all untouched. Keep the module pure and import-free |
| `CREATE` | `src/domain/worldPulse/treatyTermRoles.js` | `makeTermRoleReader` | `<=90 eff` | §6.2. Four imports, all already in `peaceTerms.js`'s set. Transcribe the three arithmetic expressions from `peaceTerms.js:655-657` unchanged |
| `MODIFY` | `src/domain/worldPulse/peaceTerms.js` | PASS 2, sites S1–S5 + S9 | **`+4 eff`** | §6.3. Net measured need is **+1**; the cap is +4 for line wrapping. ⛔ **10 effective lines of headroom, shared with `IN-0C` — a formulation over +4 is a STOP, not a ceiling raise** |
| `TEST` | `tests/domain/treatyOrientationWr10g.test.js` | new describe beside the existing orientation cases | n/a | A2, A3, A6, A7 + the closed-vocabulary pin |
| `TEST` | `tests/domain/peaceTerms.test.js` | PASS 2 cases | n/a | A1, A4, A5, A8 — driven through the **real** `advanceTreaties`, never a hand-built orientation |

**Handwritten files: 5** (2 production modified + 1 created + 2 test).
**Total production delta: `<=134 eff`** (40 + 90 + 4), against version 1's ≤120 envelope
for a two-file cure — **the envelope moves because the shape did**: version 1 budgeted a
persisted-field writer plus a reader; this compile spends the difference on a leaf that
exists to protect `peaceTerms.js`'s 10-line headroom. Recorded as an explicit override
in §12, not absorbed silently.

Generated artifacts: `NONE`. No other file may be edited.

### 7a. ⚠ THE MANIFEST RESERVES `peaceTerms.js` EXCLUSIVELY — MACHINE-ENFORCED

`npm run validate:packets` (`scripts/implementation-packets.mjs:429-455`) is **step 3 of
the 17-step `npm run check` chain** and fails closed. Any packet whose status is **not**
`LANDED`/`SUPERSEDED` **reserves every path in its `changeManifest`**, and a second
non-terminal packet naming the same path errors with
`"duplicate change path across packets: <path> (<A>, <B>)"` — pinned by
`tests/scripts/implementationPackets.test.js:180` and `:213`.

**`GR-3B-ORIENT` and `IN-0C` both modify `src/domain/worldPulse/peaceTerms.js`.** If both
carry a populated `changeManifest` at DRAFT or READY **at the same time, the gate REDS**
— on the documentation commit, before any code is written. Only the packet promoted first
may carry `peaceTerms.js` in its manifest row; the other keeps `changeManifest: []` until
the first is `LANDED`, then repopulates **and re-measures**. The tooling is mechanically
enforcing the serialization the 10-line shared headroom already demanded.

`scripts/implementation-packets.mjs:425` additionally caps `acceptanceCases` at **8**
(pinned at `implementationPackets.test.js:275`). §11 closes at exactly 8; a ninth case is
a red gate, not a declarable override.

## 8. Forbidden implementation

- Do **not** widen `TREATY_ORIENTATION_KINDS`, `TREATY_ROLE_WORDS`, `treatyRoleWord`, or
  `treatyOrientationOf`'s return shape or answers. (`treatyOrientationWr10g.test.js:237-238`
  pins the first two exactly; a red there is the packet being wrong, not the pin.)
- Do **not** write any new key onto a treaty record or a term, and do **not** turn
  `defaultedBy` into an array or an object.
- Do **not** derive obligation from **party sort order**, **ledger-key order**,
  **proposer order**, `sworn` key order, `receipts` text, or `lineage` order.
  **`GR-3B.md` §6's beneficiary clause is lifted by CR-GR3B-3-R1; its sort-order and
  proposer-order clauses are NOT, and they are re-imposed here.**
- Do **not** read the `pactProposals` ledger from any treaty-layer module.
- Do **not** resolve a negotiated instrument to `wartime` or `sale`, and do not let a
  war or sale term reach the beneficiary arm.
- Do **not** add a second orientation module, a second per-term resolver, or a display
  word for the negotiated role — no consumer exists and unconsumed vocabulary is the
  recorded self-referential-pin habitat.
- Do **not** edit `pactFormation.js`, `pactAmendment.js`, `peaceTermsCatalog.js`,
  `treatyEnforcement.js`, `treatyLifecycleVoice.js`, any flag, golden, baseline,
  migration, design doc or registry.
- Do **not** draft `temple_restitution` or `settlement_provision` — that is `GR-3B`.
- Do **not** make PASS 2's beats, disposition or strain speak for negotiated
  instruments (§2 non-goal; §11 forward note).

## 9. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch (§10).
1. Capture the baseline: run §11's focused suite **at the verified base** and record its
   own file/test counts. Inherit no figure from any earlier compile.
2. Write the failing pure-resolution tests first (A2, A3, A6, A7) — they are the cases
   that can only be written against behavior that does not exist yet.
3. Add `TERM_OBLIGATION_KINDS`, the typedef and `termObligationOf` (§6.1).
4. Create `treatyTermRoles.js` (§6.2). Transcribe the arithmetic; do not re-derive it.
5. Rewire PASS 2 (§6.3) — S1–S5 and S9 only.
6. Add the integration and counterforce tests (A1, A4, A5, A8).
7. Re-measure `peaceTerms.js`'s effective lines and confirm `<= 794`. **A number above
   794 is a STOP.**
8. Run focused verification (§11), then the wave-end gate, then the receipt.

The agent must not start by changing a golden, baseline, budget, or persisted shape.

## 10. Read-only preflight

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor \
  820ed989df1747cfbeb8b0a5a9a07b253736151f HEAD

# Targets must be clean. At this compile the WHOLE TREE was clean — expect EMPTY,
# and reserve whatever foreign dirt exists at dispatch.
git status --porcelain -- \
  src/domain/worldPulse/treatyOrientation.js \
  src/domain/worldPulse/peaceTerms.js \
  tests/domain/treatyOrientationWr10g.test.js \
  tests/domain/peaceTerms.test.js

# The CREATE target must be ABSENT
test ! -e src/domain/worldPulse/treatyTermRoles.js && echo "absent — ok"

# The two pins that decide the vocabulary question — both must still read this way
rg -n "TREATY_ORIENTATION_KINDS\].sort\(\)|Object.keys\(TREATY_ROLE_WORDS\)" \
  tests/domain/treatyOrientationWr10g.test.js
rg -n 'export const TREATY_ORIENTATION_KINDS|export function treatyOrientationOf' \
  src/domain/worldPulse/treatyOrientation.js

# The datum and the wording it must agree with
rg -n "beneficiaries = symmetric|beneficiary,|promises \\$\{termLabel" \
  src/domain/worldPulse/pactFormation.js

# The six PASS 2 sites this packet rewires
rg -n 'treatyOrientationOf\(treaty\)|buildPressureSummary\(pIndex|victorMonitorReach\(|evolveCompliance\(\{|treaty.defaultedBy|accrueStrainResentment\(' \
  src/domain/worldPulse/peaceTerms.js

# ⚠ IN-0C shares this file's 10-line headroom. Re-measure before and after.
rg -n 'peaceTerms.js' scripts/.size-baseline.json    # expect NO entry (layer-800 applies)
```

**Reserved foreign dirt at this compile: NONE — `git status --porcelain` returned
EMPTY.** The 12-path town-cartography set that was dirty through the earlier compiles
**landed** at `5066c34b` / `820ed989`. This is a **snapshot, not permission to ignore
new dirt**: re-run `git status` at dispatch and reserve whatever is foreign then.

Focused-suite command for the baseline at step 1 and the verification at §11:

```sh
sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 140 \
  npx vitest run tests/domain/treatyOrientationWr10g.test.js \
  tests/domain/peaceTerms.test.js \
  tests/domain/pactFormation.test.js \
  tests/domain/peaceTermsGrantTerms.test.js
```

All four paths were verified to **exist** at `820ed989` (`ls tests/domain/`). The last is
the sole home of `grantTermFor` / `grantedRightFor` coverage (`grep -rln` over `tests/`
returns exactly that one file) and is included **run-only** — it is `GR-3B`'s edit
target, never this packet's. A `vitest run` against a path that does not exist reports a
**zero-test suite**, which is the recorded fake-red tell rather than an assertion diff;
if any path is missing at dispatch, that is a STOP.

## 11. Acceptance matrix — closed at 8

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main reachable behavior | a negotiated instrument carrying a one-sided `resource_share` (`stream: true`), driven through the **real** `advanceTreaties` PASS 2 | obligor = the counterparty, obligee = the beneficiary; the **obligor's** granary is drawn and the **obligee's** credited; `term.extractedFromLoser` / `deliveredToVictor` accrue on the obligor→obligee direction; `term.burden01` is the obligor's | `peaceTerms.test.js` |
| A2 | **Mutual / symmetric** | `beneficiary === 'both'` (a `non_aggression` clause) | `{ mutual: true, resolved: true, obligorId: '', obligeeId: '' }`; **no transfer direction**; no grain moves; the clause never sets `defaultedBy`; `resolved` is `true` and `mutual` is asserted **directly**, never inferred from the empty ids | `treatyOrientationWr10g.test.js` |
| A3 | Reciprocal pair on one instrument | a reciprocal ask ⇒ two one-sided terms, one per party | each resolves **independently**, in mirrored directions, on the same record; and when both default, `defaultedBy` is the obligor of the **last** defaulting term in stored order (§6.3's declared rule) | `treatyOrientationWr10g.test.js` |
| A4 | **Swapped-proposer invariance** | mint the same ask twice, proposer and counterparty swapped, through the **real** `signPactProposal` | ledger key, `parties` and `receipts` are **byte-identical**; the resolved `obligorId`/`obligeeId` **swap**; asserted by comparing the two live mints, **never by restating §3.5** | `peaceTerms.test.js` |
| A5 | **Counterforce — war and sale are untouched** | every existing war-treaty and sale-treaty fixture in the suite | `termObligationOf` returns exactly `treatyOrientationOf`'s ids and kind for every term; PASS 2's capacity, reach, grain movement and `defaultedBy` are **byte-identical** to the pre-change run; `buildPressureSummary` and `victorMonitorReach` are called the **same number of times, in the same order, with the same arguments** (spy) | `peaceTerms.test.js` |
| A6 | Malformed / boundary — **fails closed** | beneficiary absent from `parties`; a one-party and a three-party record; `beneficiary: ''`; `beneficiary` equal to both entries; `treaty` and `term` null/undefined | unresolved verdict every time; **never throws**; no id is ever the string `"undefined"`; no `defaultedBy` write | `treatyOrientationWr10g.test.js` |
| A7 | Save/load round trip | mint → `JSON.stringify` → `JSON.parse` → `ensureWorldState` → resolve | the resolution is identical before and after, per term; the record is byte-identical across the trip | `treatyOrientationWr10g.test.js` |
| A8 | Named historical regression — the multi-round instrument | alpha proposes security at T; bravo proposes economic at T+n; **one** record, two lineage acts | both clauses resolve independently and correctly on the same instrument — the exact shape a treaty-level `proposedBy` could not have expressed (§3.2). Plus: the four **dormancy** fences green **unmodified**, and `TREATY_ORIENTATION_KINDS` / `TREATY_ROLE_WORDS` still pin to their three members | `peaceTerms.test.js` |

This table is the entire edge-case budget. Do not add a cross-product.

## 12. Scope budget and the one declared override

| Limit | Packet budget | Basis |
|---|---:|---|
| Behavior families | `1` | the per-term obligation axis |
| New persisted record families | `0` | nothing is persisted |
| Named state writers | `0` | `defaultedBy`'s existing writer keeps its shape |
| Feature flags | `0` | rides `pactFormationEnabled` |
| New logic-bearing production leaves | `1` | `treatyTermRoles.js` |
| Existing logic-bearing production files modified | `2` | `treatyOrientation.js`, `peaceTerms.js` |
| Handwritten files total | `5` | 3 production + 2 test |
| New/changed effective production lines | `<=134` | §7 |
| Delta in a shared/hot file | `<=4 eff` in `peaceTerms.js` | 10 headroom, **shared with IN-0C** |
| Acceptance cases | `8` | §11 |

**Override approved before dispatch: ONE.** Version 1's post-ruling envelope said *"at
most 120 effective production lines"* for a two-file cure. This compile spends `<=134`
because the cure shape changed: the extra budget buys the `treatyTermRoles.js` leaf,
which exists **only** to keep the `peaceTerms.js` delta at +4 against 10 shared lines of
headroom. Declared here rather than absorbed. **No other override.**

**Forward note, deliberately deferred — documented, not a bug to re-find:** a negotiated
instrument remains **voiceless** (no lapse or default beat), earns **no disposition
learning**, and accrues **no strain resentment**, because all three read the
**instrument-level** `orientation.resolved`, which stays `false` for a negotiated pact by
design (§3.3). Giving a negotiated instrument a voice needs a ruling on what a
*treaty-level* orientation means when its clauses point opposite ways (§3.2) — a
different question from this one, and out of scope here.

## 13. Verification commands

```sh
npx eslint src/domain/worldPulse/treatyOrientation.js \
  src/domain/worldPulse/treatyTermRoles.js \
  src/domain/worldPulse/peaceTerms.js \
  tests/domain/treatyOrientationWr10g.test.js \
  tests/domain/peaceTerms.test.js
npm run typecheck:ratchet          # tsconfig.full.json
npm run typecheck:domain:strict    # tsconfig.domain-strict.json

# The size ratchet is FIRST-CLASS here: peaceTerms.js is 790/800 and shared with IN-0C
npx vitest run tests/lint/sizeBaseline.test.js

# Focused tests — hold the slot for the WHOLE process, never a preflight then a run
sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 160 \
  npx vitest run tests/domain/treatyOrientationWr10g.test.js \
  tests/domain/peaceTerms.test.js \
  tests/domain/pactFormation.test.js \
  tests/domain/pactAmendment.test.js \
  tests/domain/peaceTermsGrantTerms.test.js \
  tests/domain/treatyEnforcement.test.js

# Named dormancy oracles — must be green UNMODIFIED
sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 80 \
  npx vitest run tests/property/pactFormationDormancyFence.test.js \
  tests/property/peaceCausalDormancyGolden.test.js

# Sealed receipt and handoff; neither is landing authority
npm run check:packet -- GR-3B-ORIENT
npm run implementation:resume -- GR-3B-ORIENT

# Wave-end. NEVER pipe a gate.
npm run check:tail
```

Expected: every command exits `0`. Report **actual** counts. `npm run check` is a
17-step `&&` chain — the receipt must name which steps actually ran.

## 14. Mandatory STOP conditions

Beyond `PACKET_STANDARD.md`, stop if:

- the owner **vetoes EP-s** — the status token reverts to `BLOCKED` (owner-blocked, the
  reason recorded in a separate `- **Blocked on:**` bullet, never on the Status line) and
  §5's option set reopens;
- `peaceTerms.js` would exceed **794** effective lines, or any ceiling, baseline or
  ratchet would have to move;
- `TREATY_ORIENTATION_KINDS` or `TREATY_ROLE_WORDS` would have to gain a member, or
  `treatyOrientationWr10g.test.js:237-238` reds;
- `treatyOrientationOf` returns a different answer for **any** war or sale treaty, or
  its call sites' argument values change;
- `draftPactSheet` no longer emits a scalar `beneficiary` per term, or its receipt no
  longer names the non-beneficiary as the promiser;
- any war-door, carried-sheet or sale term is found to carry a `beneficiary` key — the
  delegation arm's totality claim would be false and the packet must be recompiled;
- `defaultedBy` would have to become non-scalar, or a second persisted key would be
  needed to say who defaulted;
- `treatyOrientation.js` would have to gain an import;
- a golden, dormancy fence, ratchet or baseline moves — **never regenerate one**;
- `IN-0C` has landed since this compile and `peaceTerms.js`'s headroom is now below 4.

The STOP report contains the smallest measured contradiction, its evidence, and a
proposed split. It contains no speculative repair.

Recompile this packet; do not adapt while coding.
