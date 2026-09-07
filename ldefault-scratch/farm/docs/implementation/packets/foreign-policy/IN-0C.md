# Foreign Policy / IN-0C — disclosure treaty executor

- **Status:** `LANDED`
- **Landed:** `29e2dc3c` (2026-08-10; 8/8 acceptance, three mid-wave rulings recorded above, coupling identity = base with the licensed pair, peaceTerms.js at 794/800)
- **Status note:** **Promoted READY by the chair 2026-08-10 after ORIENT landed (CR-FP-ORDER position 2).** All three of version 2's
  blockers are **CLOSED** — two by second-round rulings, one by a measurement this
  compile executed (§3). The packet withholds no coding instruction and names no unruled
  decision. It is DRAFT only because the chair flips statuses, not this lane.
- **Packet version:** `3` (recompile of version 2 against CR-IN0C-1-R1, CR-IN0C-1-R2,
  CR-IN0C-2-R1, CR-IN0C-ENVELOPE and the `'expired'` correction)
- **Verified base:** `claude/composite-r4` at `e6d963430046f07b2ebac4dd06ce4eddd386343c`
- **Base note:** restamped at promotion (ORIENT landed d56d944c; peaceTerms.js measured 793/800 — the +4 cap leaves it at most 797; the packet's own preflight re-measures)
- **Last revalidated:** `2026-08-10` at `820ed989`
- **Amended (chair, 2026-08-10, three rulings during implementation):** CR-IN0C-OPT2 —
  `disclosureFidelityFor` lives in `informationStatecraft.js` (INFO-domain semantics
  beside its future feed consumer; the orderTermsByAsk deliberately-unconsumed precedent
  applies). CR-IN0C-CPL — the intrinsic GRAMMAR→INFO pair is licensed by a minted
  `couplingRegistryInfo.js` row (field values proposed by precedent, ratified at this
  landing; the lowercase `IN-0c` couplingId suffix is machine-forced by
  COUPLING_ID_SHAPE). CR-IN0C-ANNEX — content follows registry: the 6-variant pool
  relocated from the INFORMATION annex to RECEIPT_POOLS_GRAMMAR.md, re-slotted AND
  re-voiced (the draft's {settlement} binding named the wrong court — the
  treaty_true_state_chip hazard class), desk heading corrected to 'trade'. Four
  consequential files beyond the sealed manifest ratified: the registry head re-export,
  its companion test pins, and kindPoolFloors' two exact censuses (+1 kind, +1 token).
  §6.2's "no module edge opens" reachability argument is REFUTED for the record — CW-0w
  keys on (importer, imported) pairs, third demonstration.
- **Depends on:** `NONE beyond the verified base` — landed IN-0a/0b/0d do not settle
  IN-0C ordering
- **Collision group:** `GR-3B-ORIENT` — **both packets modify
  `src/domain/worldPulse/peaceTerms.js`, which has exactly 10 effective lines of
  headroom, and they share it.** They must serialize; whichever lands second
  **re-measures** before it starts. ⚠ `pulseKernel.js` is **no longer a target**
  (CR-IN0C-1-R1), so the whole-tree hot-file serialization version 2 declared is
  retired.
- **Commit authority:** edits only; manager commits
- **Baseline posture:** the focused suite measured `4 files / 91 tests`, exit `0`, at
  `e1f4c654`. **It was NOT re-run at this compile** (the shared gate may be in use, and
  this lane holds no slot). `git diff --name-only e1f4c654..820ed989 -- src tests`
  touches **no file those four suites import**, so the figure is *expected* to hold —
  but it is **not inherited**: the implementer captures its own at step 1. Full gate,
  property goldens, typecheck ratchets and bundle were not run.

> **⚠ BASE DRIFT DURING AUTHORSHIP, DECLARED — AND IT IS A SOURCE DELTA THIS TIME.**
> Version 2 was stamped `e1f4c654`. The tree then advanced twice: `5066c34b` ("TC-3a:
> the wards get their names…") landed **12 source and test files**, and `820ed989`
> ("TC-3a → LANDED…") followed. `e1f4c654` is an ancestor of `820ed989`;
> `git diff --name-only e1f4c654..820ed989 -- src tests` returns 12 paths, **all
> `townCartography` / `townScene`** — **not one foreign-policy file.** Every measurement
> below was **re-executed at `820ed989`**, not carried forward. **The working tree is
> now CLEAN — zero dirty paths.**

## 1. Dispatch verdict and reconciled authority

**Dispatch on promotion.** Transport, audience, fidelity, the exactly-once predicate,
the registry row's field values and the file envelope are all settled and transcribed as
exact contracts in §6. Nothing here is left to an implementer's judgment.

Authority, in order:

1. Live source at `820ed989` — re-verified row by row in §5.
2. `PACKET_STANDARD.md` — exact same-tick visibility, ownership, merge and closed
   receipts before READY; and *"Never raise a baseline, budget, timeout, or ceiling to
   finish a packet."*
3. CR-IN0C-1 / -2 / -3 and their second-round revisions **CR-IN0C-1-R1**,
   **CR-IN0C-1-R2**, **CR-IN0C-2-R1**, **CR-IN0C-ENVELOPE** (F-SURVEY-1 row,
   `docs/FABLE_VALIDATION_QUEUE.md`). Where a revision and its original disagree, the
   revision wins.
4. `DESIGN_FP_ARCH_IN.md` / `DESIGN_FP_INFORMATION.md` — intent after reconciliation.
5. `RECEIPT_POOLS_INFORMATION.md` — content pools; **not** registration authority.

## 2. Outcome

**Observable result:** a court compelled to open its books by a disclosure clause feeds
its counterparty's belief map at a fidelity its own compliance sets, and the signing
itself credits the discloser's credibility one tick later.

**Definition of done:** a disclosure term minted at tick `T-1` produces exactly one
`provenTrue` credit at tick `T`, replayably and exactly once, **through every mint
door**; the feed's fidelity tracks observed compliance; `treaty_disclosure_opened` is
registered on the treaty desk and minted once at signing.

In scope: one primary behavior (the compelled feed + its next-tick credit); one
integration (the consumer's own `provenTrue` default); one prevention guard (the
predicate-totality half of §8 A5).

Explicit non-goals: IN-1+; any broader disclosure redesign; **moving, duplicating or
reordering any pulse stage**; **editing `pulseKernel.js` at all**; a second belief-merge
law; a pending-credit ledger; any flag; tuning; goldens; UI.

## 3. Version 2's three blockers — all CLOSED, each with its receipt

### IN-B1 — `pulseKernel.js`'s zero headroom · **CLOSED by CR-IN0C-1-R1**

Version 2 blocked because CR-IN0C-1 named `pulseKernel.js` as the derivation site and
that file sits at **1580 / 1580 — zero headroom**, frozen in both directions by
CHAIR RULING R-BLD-10.

**Re-measured at `820ed989` with the calibrated counter** (it returns exactly 1580 for
`pulseKernel.js`, matching the frozen banked number, so its arithmetic is trustworthy):

| File | Effective | Ceiling | Headroom |
|---|---:|---:|---:|
| `src/domain/worldPulse/pulseKernel.js` | **1580** | **1580** (baselined) | **0** ⛔ |
| `src/domain/worldPulse/informationStatecraft.js` | **773** | 800 (layer) | **27** ✅ |

CR-IN0C-1-R1 relocates the derivation to **the consumer's own default**, inside
`advanceInformationStatecraft`. The chair ordered this compile to *"measure the consumer
file's own ceiling; if it too lacks headroom, escalate back."*

**It does not lack headroom. 27 effective lines are free, and the measured need is 1.**
The whole edit is:

| Change | Site | Effective lines |
|---|---|---:|
| import the deriver from the new leaf | with the other imports (:65-95) | **+1** |
| `provenTrue = []` → `provenTrue = null` in the destructure | `:1245` | **+0** — same line |
| `: []` → `: disclosureSigningCredits(state, tick)` in the fold | `:1403` | **+0** — same line |
| JSDoc `@param` amendment | `:1230` | **+0** — comments are free under `skipComments` |

**+1 against 27. No escalation. `pulseKernel.js` is not touched, is not imported from,
and is not named as a target anywhere in this packet.**

⚠ The `null` default is **not cosmetic** — it is what makes "the caller passed none"
distinguishable from "the caller passed an empty array". `:1403` already reads
`...(Array.isArray(provenTrue) ? provenTrue : [])`, so with a `null` default an explicit
`[]` is still an array and still **wins** (crediting nothing), exactly as CR-IN0C-1-R1
requires: *"explicit provenTrue still wins."*

### IN-B2 — the registry row's three unstated fields · **CLOSED by CR-IN0C-2-R1**

CR-IN0C-2-R1: *"`treaty_disclosure_opened` registers by MIRRORING `treaty_lapsed`'s
registration row exactly (same section/desk/audience/significance values) — a treaty
lifecycle beat takes the treaty desk; the 6-file registration footprint is accepted."*

**The live values, copied from the registry at `820ed989` and pinned as literals in
§6.2** — `grammarNews.js:90`:

```js
grammarKindRow('treaty_lapsed', 'notable', 'public', 'trade', [ …requiredSlots… ], [ …contexts… ])
```

⚠ **Version 2 mis-stated the builder's signature.** It is
`grammarKindRow(kind, significance, audience, section, requiredSlots, contexts)`
(`grammarNews.js:69`) — the fifth parameter is **`requiredSlots`**, not `contexts`.
Version 2 wrote `(kind, significance, audience, section, contexts[, entailments])`,
which would have shifted every argument by one. Corrected here.

| Field | Value, from the live `treaty_lapsed` row | Independently corroborated by |
|---|---|---|
| `significance` | **`'notable'`** | `grammarLifecycleKindPools.walker.test.js:41` |
| `audience` | **`'public'`** | same |
| `section` | **`'trade'`** | same, plus `heraldRouting.js:232` and `:572` |

The 6-file footprint the ruling accepts, enumerated by
`grep -rln "treaty_lapsed" src/` at `820ed989`:

```
src/domain/worldPulse/treatyLifecycleVoice.js   the minter
src/domain/worldPulse/grammarNews.js            GRAMMAR_KIND_REGISTRY row
src/domain/worldPulse/grammarReceiptPools.js    GRAMMAR_RECEIPTS pool
src/domain/realm/heraldRouting.js               routing table + KIND_SECTION_DIVERGENCES
src/domain/display/chroniclersLetter.js         the letter's own section
src/domain/display/settlementRumors.js          WHAT_PHRASES world phrase
```

### IN-B3 — the predicate that failed open · **CLOSED by CR-IN0C-1-R2, and VERIFIED**

CR-IN0C-1-R2 restates the predicate over the **term's own `mintedTick`**, *"TOTAL across
every mint door"*. Version 2 could not confirm totality. **This compile did.**

Every term-mint door in the tree, read directly, and each writes `mintedTick` **onto the
term literal**:

| Door | File / symbol | Term-level `mintedTick` |
|---|---|---|
| War door (live appraisal) | `peaceTermsDrafting.js:59` `draftTerms` | ✅ `mintedTick: tick` |
| War door (carried sheet) | `peaceTerms.js:209` `materializeCarriedTermSheet` | ✅ `mintedTick` |
| Negotiated door (draft) | `pactFormation.js:257` `draftPactSheet` | ✅ `mintedTick: tick` |
| Negotiated door (signature re-base) | `pactFormation.js:385` `signPactProposal` | ✅ re-stamped to the **signature** tick |
| Sale door | `peaceTermsSale.js:153` | ✅ `mintedTick: tick` |

And the two remaining registered treaty-ledger writers **mint no terms at all**, so they
cannot be a hole: `pactAmendment.js:225` `closeTermsBrokenByWar` closes live terms,
`pactAmendment.js:278` `absorbWarEndIntoStandingPact` appends only a lineage act, and
`treatyBreach.js:133` maps the treaty's **existing** terms. `amendPactInstrument`
receives terms that `signPactProposal` has already stamped.

**CONFIRMED: the term-level `mintedTick` predicate is TOTAL. Five doors, five writes,
zero holes.** Contrast the field version 2 was handed: `grep -rn 'signedTick' src/`
returns exactly **one** persisted write in the whole tree (`peaceTerms.js:250`, and it
writes onto the **treaty**, not the term), with `peaceTermsDocument.js:256` being a
read-time display projection. A predicate over `signedTick` is the recorded
**"an enumeration on the credit side fails open"** class; `mintedTick` is that class's
prescribed cure — a **total positive predicate**.

### The envelope breach · **CLOSED by CR-IN0C-ENVELOPE**

> the third logic file (treatyLifecycleVoice.js) is an explicitly-approved named budget
> override — beats never get a second home.

With `pulseKernel.js` out, the three logic files are `informationStatecraft.js`,
`peaceTerms.js` and `treatyLifecycleVoice.js` — and the third is the named override.
Recorded in §7 as an approved override, not absorbed silently.

### The vocabulary correction

CR-IN0C-3 said *"defaulted/**lapsed**"*. The live observed vocabulary is
`'honored' | 'strained' | 'defaulted' | 'expired'` (`peaceTermsCatalog.js`, the
`complianceState` typedef). **The chair corrected the ruling to `'expired'`.** This
packet uses the live word and mints no new one.

## 4. Residual open items

**NONE.** No decision in this packet is withheld, deferred to an implementer, or marked
"choose one". Two things are recorded as **forward notes** — deliberately deferred,
documented, not bugs to re-find:

1. **The `provenTrue` seam has no test anywhere.** `grep -rn 'provenTrue' tests/`
   returns **0 hits across the entire corpus** — re-verified at `820ed989`. Acceptance
   case A1 is therefore **first coverage of the seam**, not an extension of precedent.
   Version 1's table claimed `informationStatecraftPins.test.js` proved *"existing
   `provenTrue` behavior"*; what that file covers is the internally-produced
   `kind: 'proven_true'` delta, a different path. Recorded, and A1/A2/A5 are written as
   substrate-proving cases rather than precedent-copying ones.
2. **`disclosure` is today the SOLE member of the `informational` family**
   (`peaceTermsCatalog.js:175`; a family census over the catalog returns
   `informational: 1`). The predicate is written **family-derived**, not
   `type === 'disclosure'`, per the derive-don't-restate law — which means a future
   informational term would join the credit automatically. That is the intended
   behavior, and **A5's positive half pins the singleton** so any widening is a
   visible, deliberate act rather than a silent one.

## 5. Verified tree contract

Re-verified at `820ed989`. Navigate by symbol; line numbers are hints.

| Role | File | Symbol | Verified fact | Status |
|---|---|---|---|---|
| Treaty gate | `src/domain/worldPulse/warReasons.js` | `peaceCausalActive` | `warLayerEnabled === true && peaceEngineEnabled === true` | HOLDS |
| Feed flag | `src/domain/worldPulse/simulationRules.js` | preset `full_simulation` | `allyIntelSharingEnabled: true`, not overridden by later spreads, survives `normalizeSimulationRules` | HOLDS |
| Catalog | `src/domain/worldPulse/peaceTermsCatalog.js` | `TERM_CATALOG.disclosure` (:175) | `{ family:'informational', weight:0.6, baseYears:3, maxYears:6, baseMag:1.0, stream:false, executor:'seam' }` | HOLDS |
| Family census | same file | `TERM_CATALOG` | `informational` has **exactly one** member: `disclosure` | HOLDS — see §4 note 2 |
| Asset map | same file | `CLASS_TERM.intel` (:359) | `'disclosure'` — the **war door's** producer; `PACT_DRAFT_LENS` (`pactFormation.js:156`) does not draft it | HOLDS |
| Obligor totality | `src/domain/worldPulse/pactFormation.js` | `draftPactSheet` (:266) | **The ONLY site in the whole `worldPulse` layer that writes a `beneficiary` key onto a term.** `pactAmendment.js`'s header states it in words: *"a war-end term carries no `beneficiary` key at all"* | HOLDS — this is why `treatyOrientationOf` resolves the obligor of every reachable disclosure term |
| Treaty writer | `src/domain/worldPulse/peaceTerms.js` | `advanceTreaties` | One function; PASS 1 mints (`:577` pushes `mint.signingBeat`), PASS 2 expires/complies in the same call | HOLDS |
| Lifecycle gate | same file | `lifecycleVoiceLit` (:323) | `treatyLifecycleVoiceActive(worldState)`, read once, gates both existing beat pushes (`:716`, `:726`) | HOLDS — the new beat rides it |
| Voice import | same file | `:116` | `import { treatyDefaultDetectedBeats, treatyLapsedBeats, treatyLifecycleVoiceActive } from './treatyLifecycleVoice.js'` — a **single named-import line** the new producer joins at **+0 lines** | HOLDS |
| Belief writer | `src/domain/worldPulse/beliefMap.js` | `advanceBeliefMaps` | Per-observer reconcile first; M9b sharing after | HOLDS |
| Relay precedent | same file | `ALLY_INTEL_TUNING` (:942) | **EXPORTED** on the declaration; `RELAY_KEEP: 0.95` (:951) | HOLDS — import is lawful |
| Relay merge | same file | `applyAllyIntelSharing` | Deterministic strongest-confidence merge | HOLDS |
| Seat key | same file | `GOVERNING_SEAT_KEY` | `'seat'`, exported | HOLDS |
| Credit consumer | `src/domain/worldPulse/informationStatecraft.js` | `advanceInformationStatecraft` | `provenTrue = []` default (:1245); folded at the deltas array (:1403) as `...(Array.isArray(provenTrue) ? provenTrue : [])` | HOLDS — **the exact two lines §6.1 edits** |
| Credit shape | same file | `CredibilityDelta` typedef (:1230) | `{ id: string, kind: 'proven_true'\|'deception'\|'fracture'\|'climb_down', magnitude01?: number }` | HOLDS |
| Consumer imports | same file | `:67-68` | already imports `getSpatialLedger` from `../spatial/distanceRead.js` and `beliefsActive, GOVERNING_SEAT_KEY, …` from `./beliefMap.js` | HOLDS — **the new leaf adds no reachability**, its imports are already in this file's set |
| Pipeline | `src/domain/worldPulse/pulseKernel.js` | three call sites | `advanceBeliefMaps` → `advanceInformationStatecraft` (guarded by `infoStatecraftActive`) → `advanceTreatiesWithDisposition` | HOLDS — **READ-ONLY. NOT A TARGET.** |
| Lifecycle voice | `src/domain/worldPulse/treatyLifecycleVoice.js` | `treatyLapsedBeats` (:238), `treatyDefaultDetectedBeats` (:310) | Emit `kind: 'treaty_lapsed'` / `'treaty_default_detected'`; **both return `[]` on `!orientation?.resolved`** (:239, :311) | HOLDS — the new producer copies this needs-guard |
| Kind registry | `src/domain/worldPulse/grammarNews.js` | `grammarKindRow` (:69), `GRAMMAR_KIND_REGISTRY` (:89), `GRAMMAR_HERALD_KINDS` | Signature is `(kind, significance, audience, section, requiredSlots, contexts)`; Herald set = `section !== null`; registry currently holds **7** rows | HOLDS — version 2's signature was wrong, see §3 IN-B2 |
| The mirrored row | same file | `:90` | `grammarKindRow('treaty_lapsed', 'notable', 'public', 'trade', …)`, pool depth **7** | HOLDS |
| Closed-set walker | `tests/lint/grammarLifecycleKindPools.walker.test.js` | `EXPECTED` (:40), `:88-89`, `:191`, `:194-206` | Pins the registry to 7 rows, the Herald set to exactly `['treaty_lapsed','treaty_default_detected']`, and for every Herald kind: a `WHAT_PHRASES` entry **with no underscore**, `isExplicitlyRouted`, `EXACT_SECTION === 'trade'`, `SECTION_OF === 'trade'`, `KIND_SECTION_DIVERGENCES === 'trade'`, pool/slots/contexts all of the declared depth, ≥1 slotless family, ≥1 context-free family, `notable` floor **6** | HOLDS — **§7 names every one of these as a required edit** |
| Herald routing | `src/domain/realm/heraldRouting.js` | the routing table (:232), `KIND_SECTION_DIVERGENCES` (:551, entries at :572-573) | `treaty_lapsed: 'trade'` in **both** | HOLDS — **two entries, one file** |
| Letter section | `src/domain/display/chroniclersLetter.js` | `:98` | `treaty_lapsed: 'courts'` — the letter files it beside the oathbreaking; the Herald's `trade` divergence is recorded | HOLDS |
| World phrase | `src/domain/display/settlementRumors.js` | `WHAT_PHRASES` (:264) | `treaty_lapsed: 'a pact reaching the end of its own term'` — no underscores, phrased world-side | HOLDS |
| Compliance vocabulary | `src/domain/worldPulse/peaceTermsCatalog.js` | `complianceState` typedef | `'honored'\|'strained'\|'defaulted'\|'expired'`. ⚠ the fourth word is **`expired`** | HOLDS |
| Treaty test | `tests/domain/peaceTerms.test.js` | the seam-term case | `disclosure` mints inertly with `seam === true` | HOLDS |
| Relay test | `tests/domain/allyIntelSharing.test.js` | 4 describes / 9 cases | Relay keep, strongest merge, opt-in identity | HOLDS |
| Credit test | `tests/domain/informationStatecraftPins.test.js` | — | ⚠ **DRIFT vs version 1** — `grep -rn 'provenTrue' tests/` = **0 hits**; §4 note 1 | **DRIFTED** |
| Token freshness | `src tests` | the four disclosure tokens | `grep -rn 'treaty_disclosure_opened\|disclosure_feed\|disclosure_strained\|disclosure_expired' src tests` = **0 hits** | HOLDS |
| Dormancy oracles | `tests/property/peaceCausalDormancyGolden.test.js`, `tests/property/informationStatecraftDormancyGolden.test.js` | — | Both exist; byte-identical-dark plus lit anti-vacuity | HOLDS |

**Measured size posture (effective lines; counter calibrated at `pulseKernel = 1580`):**

| File | Effective | Ceiling | Headroom | Note |
|---|---:|---:|---:|---|
| `src/domain/worldPulse/pulseKernel.js` | 1580 | **1580** (baselined) | **0** | ⛔ **NOT A TARGET** — the constraint that moved the design |
| `src/domain/worldPulse/peaceTerms.js` | 790 | 800 (layer) | **10** | ⚠ **SHARED with `GR-3B-ORIENT`** |
| `src/domain/worldPulse/informationStatecraft.js` | 773 | 800 (layer) | **27** | the derivation's new home; needs **+1** |
| `src/domain/worldPulse/beliefMap.js` | 778 | 800 (layer) | 22 | read-only |
| `src/domain/worldPulse/treatyLifecycleVoice.js` | 179 | 800 (layer) | **621** | the beat producer's home |
| `src/domain/worldPulse/peaceTermsCatalog.js` | 113 | 800 (layer) | 687 | read-only |

Forbidden alternatives:

- **no edit to `pulseKernel.js`, and no import from it** — it is at its frozen ceiling
  and CR-IN0C-1-R1 routed around it deliberately;
- no second belief-merge law; no second treaty ledger; no second compliance vocabulary;
- no `peaceTermsDisclosure.js` *contents* beyond the derivation + fidelity (no feed
  mechanics duplicating `applyAllyIntelSharing`, no copy of private `styleSharedBelief`);
- no stage move, duplication, reorder, pending-credit ledger, or direct credibility
  write from treaty code;
- no `disclosure_expired` kind — REFUSED by CR-IN0C-2; no `'lapsed'` compliance word;
- no predicate over `signedTick` — it fails open (§3 IN-B3);
- no new flag, no golden update, no baseline/ratchet raise, no migration, no UI;
- no files outside §7.

## 6. Exact contracts

### 6.1 Transport — CR-IN0C-1 as revised by CR-IN0C-1-R1

Pipeline order is **unchanged**: `advanceBeliefMaps` → `advanceInformationStatecraft` →
`advanceTreatiesWithDisposition`. **`pulseKernel.js` is not edited.**

At tick `T`, `advanceInformationStatecraft` computes its **own default** for
`provenTrue` from persisted treaty state when the caller passes none:

```js
// informationStatecraft.js — the destructure (:1245)
provenTrue = null,                       // was: provenTrue = []

// informationStatecraft.js — the credibility fold (:1403)
...(Array.isArray(provenTrue) ? provenTrue : disclosureSigningCredits(state, tick)),
```

- **Explicit wins.** Any array the caller passes — including `[]` — is used verbatim.
  Only an omitted (or non-array) argument reaches the derivation. This is
  CR-IN0C-1-R1's requirement expressed in the branch that already existed.
- **Pure predicate on persisted state** ⇒ replay-safe and exactly-once by construction.
  No deposit, no marker, no new persisted family, no second pass, no stage move.
- **Dark ⇒ byte-identical.** `advanceInformationStatecraft` returns at its first line
  when `!infoStatecraftActive(worldState)`, so the derivation is unreachable while the
  gate is dark. With no treaty ledger it returns `[]` regardless.
- The `state` handed to the deriver is the mid-function working state; **no stage in
  this function writes the treaty ledger**, so it is the same ledger the tick began
  with.

### 6.2 The deriver — `peaceTermsDisclosure.js`, new leaf

```js
/**
 * The disclosure signings that fall due for credit THIS tick.
 * @param {Record<string, unknown>|null|undefined} worldState
 * @param {number} tick
 * @returns {Array<{ id: string, kind: 'proven_true' }>}
 */
export function disclosureSigningCredits(worldState, tick) { … }
```

The predicate, exactly — **CR-IN0C-1-R2**:

1. Read the treaty ledger via the existing `getSpatialLedger(worldState, 'treaties')`.
   Absent ⇒ `[]`.
2. Iterate keys by `Object.keys(ledger).sort()` (the estate's existing determinism
   idiom, e.g. `treatyEnforcement.js:grantTermFor`), then each treaty's terms in their
   **stored order**.
3. A term qualifies when **both** hold:
   - `TERM_CATALOG[String(term.type)]?.family === 'informational'` — **family-derived,
     never the literal `'disclosure'`** (derive-don't-restate; §4 note 2);
   - `Number(term.mintedTick) === Number(tick) - 1` — the **term's own** `mintedTick`,
     which §3 IN-B3 proved total across all five mint doors.
4. The credited party is the **disclosing obligor**:
   `treatyOrientationOf(treaty).obligorId`. An empty id mints **no** delta — **fail
   closed**, never a placeholder and never `"undefined"`. This read is total for every
   reachable disclosure term because no door mints a disclosure clause carrying a
   `beneficiary` (§5, the obligor-totality row).
5. Each qualifying term yields exactly one
   `{ id: <obligorId>, kind: 'proven_true' }`. **`magnitude01` is omitted**, taking the
   consumer's existing default — this packet introduces no new magnitude.
6. **Duplicate ids are NOT collapsed here.** The consumer's existing fold owns
   aggregation; a second aggregation rule would be a second law.

⚠ **Exactly-once, argued:** at tick `T` the statecraft stage runs *before* the treaty
stage, so a term minted at `T` is invisible until `T+1`, when `mintedTick === T` and
`T = (T+1) - 1` matches once. At `T+2` it no longer matches. Re-advancing `T` from the
same persisted state yields the same set — the predicate reads nothing it writes.
**Declared boundary:** a treaty pruned before `T+1` earns no credit; that is correct
(the instrument did not survive to be believed) and is pinned by A5.

### 6.3 Compliance fidelity — CR-IN0C-3, with the `'expired'` correction

```js
/** @param {string} observed a complianceState member @returns {number} 0..1 */
// honored  -> 1.0
// strained -> ALLY_INTEL_TUNING.RELAY_KEEP        // BY IMPORT from beliefMap.js
// defaulted-> 0   (the feed stops)
// expired  -> 0   (the feed stops)
```

- `RELAY_KEEP` is consumed **by import** from `src/domain/worldPulse/beliefMap.js`
  (`:942` exported, `:951` = `0.95`). Writing `0.95` as a literal anywhere is a
  **STOP** — the semantic law is that a strained compelled feed degrades to ally-relay
  fidelity, and a second spelling would let the two drift.
- The fourth state is **`'expired'`**, the live word (§3, vocabulary correction). No new
  word is minted.
- Arithmetic: **multiply then clamp to `[0,1]`. No rounding.** Use the existing
  `clamp01`; do not author a second clamp.
- Merge: the **existing strongest-confidence precedent, unchanged**. No third merge
  law, and relay-keep is not permission for one.
- An unknown or absent compliance word ⇒ `0` (feed stops). **Absence never means "trust
  fully" — fail closed.**

### 6.4 Closed kinds and audience — CR-IN0C-2 as revised by CR-IN0C-2-R1

| Token | Classification | Home |
|---|---|---|
| `treaty_disclosure_opened` | **ENGINE EVENT**, registered, minted once at treaty PASS 1 | `GRAMMAR_KIND_REGISTRY` + `GRAMMAR_RECEIPTS` + the Herald desk — see the row below |
| `disclosure_feed` | **RESERVED CONTENT HANDLE** — pool only | `RECEIPT_POOLS_INFORMATION.md`; **no source registration** |
| `disclosure_strained` | **DM PROJECTION ONLY** — derived from observed compliance | no engine kind; no registry row |
| `disclosure_expired` | **EXCLUDED / REFUSED** | expiry uses the existing `treatyLapsedBeats` (`kind: 'treaty_lapsed'`) |

**The registration row, mirrored from `treaty_lapsed` and pinned as literals:**

```js
grammarKindRow('treaty_disclosure_opened', 'notable', 'public', 'trade',
  [ /* requiredSlots — one array per pool variant */ ],
  [ /* contexts — one entry per pool variant, null where unconstrained */ ]),
```

Non-negotiable consequences of that row, each a live walker assertion (§5):

- pool depth **≥ 6** (`FLOOR_BY_SIGNIFICANCE.notable`), with `requiredSlots.length` and
  `contexts.length` **equal to the pool length**;
- **at least one SLOTLESS family** (`requiredSlots.some(s => s.length === 0)`) and **at
  least one CONTEXT-FREE family** — so an absent name never fabricates one and no
  context can empty the pool;
- `section: 'trade'` makes it a **Herald kind**, so `heraldRouting.js` needs the token
  in **both** its routing table and `KIND_SECTION_DIVERGENCES`, `chroniclersLetter.js`
  needs its own section (`'courts'`, matching the treaty cohort), and
  `settlementRumors.js` needs a `WHAT_PHRASES` entry that is **world-side prose with no
  underscore**.

Honored stays **quiet** (no beat). Default uses the existing standard kind
(`treaty_default_detected` via `treatyDefaultDetectedBeats`) with **no replacement and
no new spelling**.

### 6.5 The beat producer — `treatyLifecycleVoice.js` (CR-IN0C-ENVELOPE)

`treatyDisclosureOpenedBeats({ treaty, terms, tick, orientation })`, written **beside**
`treatyLapsedBeats` and copying its shape exactly:

- **the same needs-guard first line**: `if (!orientation?.resolved) return [];` — a
  treaty that cannot say who owes it cannot announce whose books opened;
- names through the same `readerName(id, name)` helper; `sourceEventId` and the beat
  `id` built from the same `stablePart`-keyed pattern;
- emits **one** beat per minting, at PASS 1, never per tick and never on expiry.

**Beats never get a second home** — that is the whole reason the chair approved this as
the third logic file rather than folding the producer into the new leaf.

Its call site is `peaceTerms.js` PASS 1, immediately after `newsEntries.push(mint.signingBeat)`
(`:577`), gated by the **existing** `lifecycleVoiceLit` (`:323`) — no new gate, no new
flag, and `treatyDisclosureOpenedBeats` joins the **existing** named-import line at
`:116` for **+0** import lines.

### 6.6 Lifecycle

| Create | Read | Persist | Reload | Regenerate | Undo | Import/migrate | Public veil |
|---|---|---|---|---|---|---|---|
| No new state created | Pure read of the treaty ledger | **Nothing new persisted** | n/a — derived each tick | Re-derives from persisted treaties; no drift | n/a | No migration; no new key to normalize | The feed's fidelity and the DM `disclosure_strained` projection are **DM-only**; the registered kind is `audience: 'public'` on the **trade** desk |

Because nothing is persisted, there is no undo/regen/import hazard surface — which is
the whole point of CR-IN0C-1's next-tick-derived shape.

**Golden posture: UNCHANGED. No golden may move.** Unexpected golden motion is a
**STOP**, never a regeneration.

## 7. Exact change manifest

| Action | File | Symbol/region | Max delta | Coding instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/worldPulse/peaceTermsDisclosure.js` | `disclosureSigningCredits` + `disclosureFidelityFor` | `<=120 eff` | §6.2 + §6.3. ≤250 leaf limit. Imports limited to `beliefMap.js` (`ALLY_INTEL_TUNING`), `treatyOrientation.js`, `peaceTermsCatalog.js` (`TERM_CATALOG`), `getSpatialLedger` and `clamp01` — **all already in `informationStatecraft.js`'s reachable set**, so no module edge opens |
| `MODIFY` | `src/domain/worldPulse/informationStatecraft.js` | the import block, the destructure `:1245`, the fold `:1403`, the `@param` `:1230` | **`+8 eff`** | §6.1. Measured need is **+1** (the import); cap is +8 for wrapping and a guard comment. **27 headroom** |
| `MODIFY` | `src/domain/worldPulse/peaceTerms.js` | PASS 1, after `newsEntries.push(mint.signingBeat)` (`:577`); the `:116` import line | **`+4 eff`** | §6.5. Measured need is **+2**. ⛔ **10 effective lines of headroom, SHARED with `GR-3B-ORIENT` — a formulation over +4 is a STOP, not a ceiling raise** |
| `MODIFY` | `src/domain/worldPulse/treatyLifecycleVoice.js` | `treatyDisclosureOpenedBeats` (new) | `+40 eff` | §6.5. **621 headroom.** CR-IN0C-ENVELOPE's named override |
| `REGISTER` | `src/domain/worldPulse/grammarNews.js` | one `grammarKindRow` in `GRAMMAR_KIND_REGISTRY` | `+12 eff` | §6.4's row **verbatim**, with the correct 6-argument signature |
| `REGISTER` | `src/domain/worldPulse/grammarReceiptPools.js` | one `GRAMMAR_RECEIPTS` entry | `+20 eff` | ≥6 variants; ≥1 slotless and ≥1 context-free |
| `REGISTER` | `src/domain/realm/heraldRouting.js` | the routing table (`:232` region) **and** `KIND_SECTION_DIVERGENCES` (`:572` region) | `+4 eff` | `treaty_disclosure_opened: 'trade'` in **both**, beside `treaty_lapsed`, with the divergence's reason written |
| `REGISTER` | `src/domain/display/chroniclersLetter.js` | the section table (`:98` region) | `+2 eff` | `treaty_disclosure_opened: 'courts'` — the treaty cohort's letter section |
| `REGISTER` | `src/domain/display/settlementRumors.js` | `WHAT_PHRASES` (`:264` region) | `+2 eff` | A world-side phrase with **no underscore** |
| `TEST` | `tests/domain/informationStatecraftPins.test.js` | new `provenTrue` seam cases | n/a | A1, A2, A5, A8 — **first coverage of this seam** |
| `TEST` | `tests/domain/peaceTerms.test.js` | disclosure seam + PASS 1 beat + the per-door totality half of A5 | n/a | A4, A5, A7 |
| `TEST` | `tests/domain/allyIntelSharing.test.js` | fidelity + merge | n/a | A3 |
| `TEST` | `tests/lint/grammarLifecycleKindPools.walker.test.js` | `EXPECTED` (`:40`), the length pin (`:89`), the Herald-set pin (`:191`) | n/a | **REQUIRED, not conditional** — a Herald kind reds all three |
| `TEST` | `tests/property/informationStatecraftDormancyGolden.test.js` | run only | n/a | A6 — must stay green **unmodified** |

**Totals against the version-1 envelope** (≤1 new leaf, ≤2 existing logic + 3
registration, ≤250 production lines, ≤8 cases):

| Measure | This packet | Envelope | Verdict |
|---|---:|---:|---|
| New logic leaves | **1** | 1 | ✓ |
| Existing logic files | **3** | 2 | **OVERRIDE — CR-IN0C-ENVELOPE**, `treatyLifecycleVoice.js` named |
| Registration files | **5** | 3 | **OVERRIDE — CR-IN0C-2-R1**, *"the 6-file registration footprint is accepted"* (5 registration + the voice file) |
| Production effective lines | `<=212` | 250 | ✓ |
| Acceptance cases | **8** | 8 | ✓ — and the cap is **machine-enforced**, not advisory: `implementation-packets.mjs:425` reds at 9. See the note above §8's table |

**Overrides approved before dispatch: TWO, each named above with its ruling. No
others** — and note that neither is a *validator* override: `validate:packets` caps
acceptance cases and reserves change paths, and those two limits cannot be overridden by
declaration (§7a).

Generated artifacts: `NONE`. No other file may be edited.

## 7a. ⚠ TWO MANIFEST CONSTRAINTS THAT ARE MACHINE-ENFORCED, NOT DECLARABLE

`npm run validate:packets` (`scripts/implementation-packets.mjs`) is **step 3 of the
17-step `npm run check` chain** and fails closed. Two of its rules bind this packet, and
neither can be overridden by writing "override approved" in a packet:

1. **Acceptance cases are capped at 8.** `:425` errors with
   `"<id> has N acceptance cases; maximum is 8"`, pinned by
   `tests/scripts/implementationPackets.test.js:275`. §8 closes at 8 for this reason.

2. **⛔ A CHANGE PATH IS RESERVED EXCLUSIVELY ACROSS ALL NON-TERMINAL PACKETS.** `:429-455`:
   any packet whose status is **not** `LANDED`/`SUPERSEDED` reserves every path in its
   `changeManifest`, and a second non-terminal packet naming the same path errors with
   `"duplicate change path across packets: <path> (<A>, <B>)"` — pinned by
   `tests/scripts/implementationPackets.test.js:180` and `:213`.

   **`GR-3B-ORIENT` and `IN-0C` both modify `src/domain/worldPulse/peaceTerms.js`.** If
   both carry a populated `changeManifest` at DRAFT or READY **at the same time, the gate
   REDS.** This is not a style preference — it is the tooling mechanically enforcing the
   serialization the 10-line shared headroom already demanded.

   **Therefore:** only the packet being promoted first may carry `peaceTerms.js` in its
   manifest row. The other keeps `changeManifest: []` until the first is `LANDED`, and is
   then repopulated **and re-measured**. `gb-INDEX-delta.md` §6 carries this as an
   explicit sequencing instruction; a coordinator who populates both at once will red the
   gate on the documentation commit itself, before any code is written.

## 8. Acceptance matrix — closed at 8 (the cap is MACHINE-ENFORCED)

⚠ **A draft of this section closed at 9 and would have RED-GATED the tree.**
`scripts/implementation-packets.mjs:425` errors with
`"<id> has N acceptance cases; maximum is 8"`, and
`tests/scripts/implementationPackets.test.js:275` pins that message. **`npm run
validate:packets` is step 3 of the 17-step `npm run check` chain**, so a ninth case is
not a declarable override — it is a red gate. The predicate's two halves were therefore
**merged into one row (A5)** rather than padded apart: "the right tick credits, every
door credits, every other tick does not" is one predicate and one case.

| ID | Case | Fixture/input | Required observation | Test home |
|---|---|---|---|---|
| A1 | Main behavior | a disclosure term minted at `T-1`, pulse advanced to `T`, **no `provenTrue` passed** | exactly one `{ id: <obligor>, kind: 'proven_true' }` reaches the statecraft fold and the obligor's credibility rises. **First coverage of this seam** (§4 note 1) | `informationStatecraftPins.test.js` |
| A2 | Exactly-once under replay | advance `T`, then re-advance `T` from the same persisted state | identical credit both times; no accumulation — the predicate is pure over persisted state | `informationStatecraftPins.test.js` |
| A3 | Fidelity ladder | observed `honored` / `strained` / `defaulted` / `expired` | `1.0` / `RELAY_KEEP` (asserted `=== ALLY_INTEL_TUNING.RELAY_KEEP`, **never the literal `0.95`**) / `0` / `0`; product clamped to `[0,1]`, unrounded | `allyIntelSharing.test.js` |
| A4 | Boundary / malformed — **fails closed** | absent or unknown compliance word; a disclosure term whose treaty has no resolvable obligor; a null treaty; a term with a non-numeric `mintedTick` | feed stops (`0`); **no delta minted**; never throws; no id is ever `"undefined"` | `peaceTerms.test.js` |
| A5 | **The predicate, both halves — counterforce AND totality** (the §2 prevention guard) | *negative:* a disclosure term minted at `T-2`, one at `T`, a **non-**disclosure term at `T-1`, and a treaty pruned before `T+1`. *positive:* a disclosure mint driven through **each live door** the fixtures can reach, plus a catalog family census | **zero** deltas for all four negatives; **every** door's term carries a numeric `mintedTick` and credits exactly once; and `informational` is asserted to be the catalog's **singleton** family — derived from `TERM_CATALOG`, **never a restated list** — so widening it is a visible act | `informationStatecraftPins.test.js` + `peaceTerms.test.js` |
| A6 | Dormancy | `infoStatecraftActive` false; peace gate dark | byte-identical no-op; **both** dormancy goldens green **unmodified** | `informationStatecraftDormancyGolden.test.js` (run only) |
| A7 | Real writer-to-reader integration | drive the real `advanceTreaties` PASS 1 mint, then the real pulse | `treaty_disclosure_opened` minted **exactly once at signing**; honored stays quiet; expiry produces `treaty_lapsed` and **no** `disclosure_expired`; the beat returns `[]` when the orientation is unresolved | `peaceTerms.test.js` |
| A8 | **The explicit-wins seam** | call `advanceInformationStatecraft` with an explicit `provenTrue: []`, then with an explicit non-empty array, then with the argument omitted | `[]` ⇒ **no** derived credit (explicit wins); the array ⇒ exactly it; omitted ⇒ the derivation. **The three must differ** — a test that only omits the argument cannot tell the old `[]` default from the new derivation, and would pass against the unmodified file | `informationStatecraftPins.test.js` |

This table is the entire edge-case budget. Do not add a cross-product.

## 9. Ordered coding sequence

0. Dispatch and seal; stop on any preflight mismatch (§10).
1. Capture the baseline: run §10's focused suite **at the verified base** and record its
   own file/test counts. **Do not inherit `4 files / 91 tests`** — it was measured at
   `e1f4c654` and not re-run at this compile.
2. Write A1, A2, A5 and A8 first — they are the cases that can only be written against
   behavior that does not exist yet, and A8 is the one that proves the default seam.
3. Create `peaceTermsDisclosure.js` (§6.2 + §6.3).
4. Wire the consumer default in `informationStatecraft.js` (§6.1) — three touched lines
   and one import.
5. Add `treatyDisclosureOpenedBeats` (§6.5) and its PASS 1 call site.
6. Register the kind across the five registration files (§6.4), **then** update the
   walker's `EXPECTED`, length and Herald-set pins — **last**, so no guard is disabled
   before the thing it guards exists (the recorded remove-the-census-row-LAST law).
7. Re-measure `peaceTerms.js` and `informationStatecraft.js` effective lines; confirm
   `<= 794` and `<= 781`. **Either number above its bound is a STOP.**
8. Run focused verification (§11), then the wave-end gate, then the receipt.

The agent must not start by changing a golden, baseline, budget, or persisted shape.

## 10. Read-only preflight

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor \
  820ed989df1747cfbeb8b0a5a9a07b253736151f HEAD

# Targets must be clean. At this compile the WHOLE TREE was clean — expect EMPTY.
git status --porcelain -- \
  src/domain/worldPulse/peaceTerms.js \
  src/domain/worldPulse/informationStatecraft.js \
  src/domain/worldPulse/beliefMap.js \
  src/domain/worldPulse/treatyLifecycleVoice.js \
  src/domain/worldPulse/grammarNews.js \
  src/domain/worldPulse/grammarReceiptPools.js \
  src/domain/realm/heraldRouting.js \
  src/domain/display/chroniclersLetter.js \
  src/domain/display/settlementRumors.js \
  tests/domain/peaceTerms.test.js \
  tests/domain/allyIntelSharing.test.js \
  tests/domain/informationStatecraftPins.test.js \
  tests/lint/grammarLifecycleKindPools.walker.test.js

# CREATE target must be ABSENT
test ! -e src/domain/worldPulse/peaceTermsDisclosure.js && echo "absent — ok"

# The two lines the consumer default edits, and the shape they must still have
rg -n 'provenTrue' src/domain/worldPulse/informationStatecraft.js   # expect :1230 :1245 :1403

# The mirrored row's live values — copy these, do not re-decide them
rg -n "grammarKindRow\('treaty_lapsed'" src/domain/worldPulse/grammarNews.js
rg -n "function grammarKindRow" src/domain/worldPulse/grammarNews.js  # 6 params, 5th is requiredSlots
rg -n "treaty_lapsed" src/domain/realm/heraldRouting.js \
  src/domain/display/chroniclersLetter.js src/domain/display/settlementRumors.js

# The predicate's substrate — every mint door must still stamp a term-level mintedTick
rg -n 'mintedTick: tick|mintedTick,' \
  src/domain/worldPulse/peaceTermsDrafting.js src/domain/worldPulse/peaceTerms.js \
  src/domain/worldPulse/pactFormation.js src/domain/worldPulse/peaceTermsSale.js

# Freshness — all four tokens must still be ZERO hits
rg -n 'treaty_disclosure_opened|disclosure_feed|disclosure_strained|disclosure_expired' src tests

# ⛔ pulseKernel is READ-ONLY here. Confirm it is NOT in any diff you produce.
rg -n 'pulseKernel' scripts/.size-baseline.json
npx vitest run tests/lint/sizeBaseline.test.js
```

**Reserved foreign dirt at this compile: NONE — `git status --porcelain` returned
EMPTY.**

⚠ **The 12-path town-cartography set reserved by version 2 has LANDED** (`5066c34b`,
then `820ed989`). That does **not** retire the rule: the list was always a **snapshot,
not permission to ignore new dirt**. Re-run `git status` at dispatch and reserve
whatever is foreign then. No packet in this set may touch, stage, restore, or attribute
foreign files.

**The focused baseline command (run it at step 1; the figure below is NOT inherited):**

```sh
sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 140 \
  npx vitest run tests/domain/peaceTerms.test.js \
  tests/domain/allyIntelSharing.test.js \
  tests/domain/informationStatecraftPins.test.js \
  tests/domain/simulationRulesPreset.stability.test.js
```

Last measured — at `e1f4c654`, **not** at this base: exit `0`, `4 files / 91 tests`.

## 11. Verification commands

```sh
# Focused static checks
npx eslint src/domain/worldPulse/peaceTermsDisclosure.js \
  src/domain/worldPulse/informationStatecraft.js \
  src/domain/worldPulse/peaceTerms.js \
  src/domain/worldPulse/treatyLifecycleVoice.js \
  src/domain/worldPulse/grammarNews.js \
  src/domain/worldPulse/grammarReceiptPools.js \
  src/domain/realm/heraldRouting.js \
  src/domain/display/chroniclersLetter.js \
  src/domain/display/settlementRumors.js
npm run typecheck:ratchet          # tsconfig.full.json
npm run typecheck:domain:strict    # tsconfig.domain-strict.json

# The size ratchet is FIRST-CLASS for this packet: peaceTerms.js is 790/800 and shared
npx vitest run tests/lint/sizeBaseline.test.js

# Focused tests — hold the slot for the WHOLE process
sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 180 \
  npx vitest run tests/domain/peaceTerms.test.js \
  tests/domain/allyIntelSharing.test.js \
  tests/domain/informationStatecraftPins.test.js \
  tests/domain/simulationRulesPreset.stability.test.js \
  tests/lint/grammarLifecycleKindPools.walker.test.js \
  tests/lint/heraldRouting.walker.test.js

# Named dormancy oracles — must be green UNMODIFIED
sh scripts/gate-mutex.sh --run -- sh scripts/gate-tail.sh -n 80 \
  npx vitest run tests/property/informationStatecraftDormancyGolden.test.js \
  tests/property/peaceCausalDormancyGolden.test.js

# Sealed receipt and handoff; neither is landing authority
npm run check:packet -- IN-0C
npm run implementation:resume -- IN-0C

# Wave-end. NEVER pipe a gate.
npm run check:tail
```

Expected: every command exits `0`. Report **actual** counts. `npm run check` is a
17-step `&&` chain — the receipt must name which steps actually ran.

⚠ `tests/lint/heraldRouting.walker.test.js` is in the focused set because it
independently cross-checks `KIND_SECTION_DIVERGENCES` against the letter's sections
(`:206-219`) — registering a Herald kind in only one of the two tables reds **there**,
not in the lifecycle walker.

## 12. Mandatory STOP conditions

Beyond `PACKET_STANDARD.md`, stop if:

- `src/domain/worldPulse/pulseKernel.js` appears in the diff **at all**, or its
  `scripts/.size-baseline.json` entry would move;
- `peaceTerms.js` would exceed **794** effective lines, or `informationStatecraft.js`
  **781** — both bounds are measured, and `peaceTerms.js`'s headroom is **shared with
  `GR-3B-ORIENT`**, which may have landed since this compile;
- any ceiling, baseline, budget or ratchet would have to be raised;
- the fidelity `0.95` appears as a literal anywhere instead of an import of
  `ALLY_INTEL_TUNING.RELAY_KEEP`;
- `'lapsed'` appears as a compliance word, or a `disclosure_expired` kind, a second
  merge rule, a pending-credit ledger, a stage move, or a direct credibility write from
  treaty code becomes necessary;
- **any term-mint door is found that does not stamp a term-level `mintedTick`** — the
  predicate's totality claim (§3 IN-B3) would be false and the packet must be
  recompiled, not patched;
- `grammarKindRow`'s parameter order differs from
  `(kind, significance, audience, section, requiredSlots, contexts)`, or
  `treaty_lapsed`'s row no longer reads `('treaty_lapsed', 'notable', 'public', 'trade', …)`;
- the walker's `notable` pool floor of **6**, or its slotless/context-free requirements,
  cannot be met with authored sentences — **never** pad a pool to clear a floor;
- any dormancy golden or ratchet moves — **never regenerate one**;
- registration would touch a file outside §7's nine production paths.

The STOP report contains the smallest measured contradiction, its evidence, and a
proposed split. It contains no speculative repair.

Recompile this packet; do not adapt while coding.
