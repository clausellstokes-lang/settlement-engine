# Foreign Policy / IN-1a — THE MIRROR (`secondOrderBeliefEnabled`)

- **Status:** LANDED
- **Landed:** at `5bf06481`, 2026-08-12; flipped by the chair after verification (the eight-step CQ5 choreography receipted in order, four fence mutants killed incl. the K3 structural arm, composition proven — SP-B's substrate consumed not duplicated, census folded whole, gate TRUE_EXIT=0 at HEAD). Do not redispatch. Deviations D-A..D-D RATIFIED — ⚠ D-A is load-bearing: the literal `belief → strengthBand` reading ships a DEAD channel; IN-1b/IN-1c INHERIT the corrected adapter reading (`belief.strengthBand`). ⚠ ORPHAN WINDOW OPEN: the mirror has zero production callers until IN-1b — discharge by compiling IN-1b next.
- **Packet version:** `1` (promoted, versioned and dispatchable by the chair)
- **Verified base:** `claude/composite-r4` at `ba219802c4f8c32c9e5cf13140e4b3911bd9728b`
- **Compiled by:** Lane AG (read-only compile lane), 2026-08-12, Opus-era — §15.
  **Promoted by:** Lane AI under the Fable chair, 2026-08-12, on rulings **CR-IN1-1..7**.
- **Base note — RESTAMPED AT PROMOTION.** Lane AG compiled against
  `b5442c07` (*"GR-4b-alpha flips LANDED, and the chair discharges its own stale ledger
  row"*). HEAD moved to `ba219802` (*"SCW-1 is DISCHARGED"*) during the promotion, and the
  promotion lane **re-measured rather than inherited**: `git log b5442c07..ba219802` over
  every substrate path in §3 and §7 returns **EMPTY**, and `b5442c07` plus SP-B's
  `4c0f2f38` are both ancestors of HEAD. ⇒ `ba219802` is an **unchanged descendant, admitted
  and pinned here**, and it is this packet's verified base. **CONFIRMED by executed git.**
  ⚠ `docs/implementation/INDEX.md`'s header carried `32f4e520` at the draft's reading; it is
  restamped to `ba219802` in this same promotion change (§13 D6). **A packet's verified base
  is git, never the index header.**
- **⚠ THE TREE IS A LIVE SHARED WORKTREE — and the porcelain LIES here.**
  At promotion `git status --porcelain` showed five `MM` entries
  (`docs/implementation/INDEX.md`, `docs/implementation/PACKET_MANIFEST.json`,
  `docs/implementation/packets/foreign-policy/GR-4B.md`,
  `scripts/.test-ratchet-baseline.json`, `tests/lint/testRatchet.test.js`) while
  **`git diff HEAD` was EMPTY** and `git diff --cached` was not. **The working tree matches
  HEAD exactly and the index holds a pre-`5f687277` snapshot. That is stale-index residue,
  NOT foreign WIP. CONFIRMED.**
  ⛔ The residue is still RESERVED: the implementer neither stages, restores, resets nor
  attributes any of those five paths, and re-measures at preflight rather than trusting this
  paragraph. ⛔ **Commit by private-index plumbing** — the shared index is hostile, and a
  plain `git add` would attribute another lane's residue.
- **Depends on (each verified by MODULE evidence, never by commit subject):**

  | Predecessor | Landed evidence at HEAD | Verdict |
  |---|---|---|
  | **IN-0a** | `src/domain/worldPulse/brokeragePlantHandoff.js` exports `BROKERAGE_PLANT_CANDIDATE_TYPE`, `PLANT_TOOK_KIND`, `PULSE_RECORD_OUTCOME_WINDOW`, `appliedPlantEnvelopesAt`, `plantTookEntry`, `plantExposureReasons`; `heraldRouting.js:132` routes `plant_took: 'war'`; `settlementRumors.js:286` carries its WHAT_PHRASE; `couplingRegistryInfo.js` carries `IN0A_PLANT_HANDOFF_COUPLING` | **LANDED — CONFIRMED** |
  | **IN-0b** | `brokerageServicesRules.js` carries `'brokerage_intercept'` in its act vocabulary (`:60`), its risk row (`:97`), its availability arm (`:262`) and its act body (`:329`) | **LANDED — CONFIRMED** |
  | **IN-0c** | `src/domain/worldPulse/peaceTermsDisclosure.js` exports `disclosureSigningCredits`; `couplingRegistryInfo.js` carries `IN0C_DISCLOSURE_SIGNING_CREDIT_COUPLING` at `GRAMMAR→INFO` | **LANDED — CONFIRMED** |
  | **IN-0d** | `src/domain/worldPulse/secrecyTradeFactor.js` exports `SECRECY_TRADE_BANDS`, `SECRECY_TRADE_TUNING`, `secrecyTradeBandOf`, `secrecyTradeFactorOf`, `SECRECY_TRADE_CONTRACT_AT_IN0D`, `secrecyTradeContractChangedSinceIn0d`; `couplingInclusion.walker.test.js` carries the `secrecy[A-Z]` INFO layer row minted for it | **LANDED — CONFIRMED** |

  ⭐ **AND ONE PREDECESSOR NO DESIGN DOCUMENT NAMED, which changes the packet's shape:
  SP-B landed `src/domain/worldPulse/outboundImpression.js` at `4c0f2f38`** — a pure,
  zero-import second-order heuristic whose own header names *this* wave as its one intended
  consumer (§0, §3.1). **CR-IN1's load-bearing anti-hand-roll instruction:** IN-1a **COMPOSES
  that leaf and re-derives not one line of it.** The dated correction into the IN volume
  lands in this promotion change (§13 D5).
- **Collision group:** `information-second-order` — serialize against any lane touching
  `simulationRules.js`'s manifest block, `subsystemRowsVirtual.js`,
  `couplingInclusion.walker.test.js`, or `outboundImpression.js`.
- ⭐ **CENSUS-HOLDER RULE — IN-1a IS THE SOLE IN-FLIGHT HOLDER, MEASURED AT PROMOTION.**
  `tests/lint/sovereigntyLightingContract.walker.test.js` was named to **GR-4b** by the index,
  **but GR-4b LANDED at `dd457b9a` and a terminal packet reserves nothing**
  (`scripts/implementation-packets.mjs:43`). The promotion lane enumerated every non-terminal
  reservation in `PACKET_MANIFEST.json` and found **twelve, all IA-2's, and the census walker
  is not among them** — the walker is FREE. IN-1a therefore takes it as its own `TEST` row,
  exactly as GR-4a took it when TC-5b-i landed. ⛔ The moment a second non-terminal packet is
  promoted the chair MOVES the row.
- **Commit authority:** stated by the chair in the dispatch message. Absent explicit
  authority the agent leaves its changes unstaged and uncommitted.

---

## -1. THE REFUSAL — measured, not asserted, and RULED at CR-IN1-1

**IN-1 as chartered** (`DESIGN_FP_ARCH_IN.md` §"IN-1 — THE MIRROR"; volume
`DESIGN_FP_INFORMATION.md` §"IN-1 — THE MIRROR"; position #17 at
`DESIGN_FP_ARCHITECTURE.md` §5) **carries THREE behavior families against a budget of one,
its receipt half names a desk that does not exist, and TWO of its seven input families have
no durable record to derive from.**

⭐ **CR-IN1-1 (chair, 2026-08-12): IN-1a SHIPS ALONE, PRODUCER-FIRST.** IN-1b (the standing
line) and IN-1c (the hums) are later slices, compiled just-in-time. **The split is recorded
here on FIVE refutation grounds, R1 through R5, each measured.**

### R1 — THREE behavior families. CONFIRMED.

| # | Family | Why it is separate |
|---:|---|---|
| 1 | **The derived read** — a pure leaf, no state/writer/RNG | this packet |
| 2 | **The band-crossing hums** — `mirror_shift` + `mirror_confidence_degraded` | news minting + pacing/significance registration. `GR-4A.md` §2.2 rules this class a **second behavior family** by name and split GR-4b out of GR-4a on exactly it |
| 3 | **The dossier standing line** — `mirror_standing_line` under "WHAT THE NEIGHBOURS HAVE BEEN SHOWN" | a user-facing surface with its own authored pool and a DM expansion |

### R2 — A PURE MODULE CANNOT MINT FAMILY 2. CONFIRMED.

The charter fixes the leaf as **"no state, no writer, no RNG"**. A band-crossing hum must
APPEND a news entry at pulse time, so it needs a writer. The only home is
`informationStatecraft.js#advanceInformationStatecraft` (`pulseKernel.js:2073` — the one
statecraft fold). That is a **second writer** and a **fourth existing logic-bearing
production file**. The charter's "one PURE module" sentence and its own receipts clause
contradict each other.

### R3 — THE RECEIPT HALF NAMES A DESK THAT DOES NOT EXIST. CONFIRMED.

`docs/content/RECEIPT_POOLS_INFORMATION.md:272` heads all three IN-1 kinds *"Herald
knowledge desk"*. At HEAD, `src/domain/realm/heraldRouting.js:64` is still
`HERALD_SECTIONS = Object.freeze(['war','faith','trade','events','divination','adjudication'])`
— **the frozen SIX. There is no knowledge desk; IN-5 mints the seventh.** Each kind needs an
**authored interim re-route**, on the IN-0a precedent (`heraldRouting.js:127-131` files
`plant_took` under `'war'` and records the re-file as **J-IN0A-3, vetoable**). **That is a
chair declaration, not implementer discretion.**
⚠ Second cost on the same family, measured: **IN-0c priced a kind's source registration at
FIVE registration files and took a documented budget OVERRIDE (CR-IN0C-2-R1) to carry six.**
`tests/lint/phrasedKindPools.walker.test.js` additionally demands a `WHAT_PHRASES` entry, a
pool at or above its floor, a slot contract of equal length, a valid significance, a valid
audience, and `SECTION_OF(kind) === row.section`; `tests/helpers/kindPoolWalker.js` derives
`CHRONIC_FLOOR = 8` for a `routine` kind. **INFORMATION has no kind registry, no receipt-pool
module and no `INFORMATION_ANNEX_URL` in `tests/helpers/receiptAnnex.js`.** Minting those is
its own slice.

### R4 — TWO OF THE SEVEN INPUT FAMILIES HAVE NO DURABLE RECORD. CONFIRMED — §3.8.

The volume asserts *"Each input already ledgered, already decaying"*. **That sentence is
false for three of the seven families** and it is the sentence the staleness clock rests on
(§3.8, §13 D7/D8). **CR-IN1-7 rules the cure** (§12 Q7), and the dated correction lands in
both IN design documents in this promotion change.

### R5 — THE BUDGET, COUNTED.

IN-1 as chartered would modify, at minimum: `simulationRules.js`, `subsystemRowsVirtual.js`,
`heraldRouting.js`, `settlementRumors.js`, `rumorPhrasePools.js`, `chroniclersLetter.js`,
`informationStatecraft.js`, a dossier component, plus two new leaves and a kind-pool home.
**Existing logic-bearing production files: 4–6 against a cap of 3. Behavior families: 3
against 1.**

### THE SPLIT — three slices; **this document compiles (a)**

| Slice | What it is | Depends on |
|---|---|---|
| **IN-1a** | **THE MIRROR ITSELF.** The pure leaf composing SP-B's landed `outboundImpressionOf`; the CQ5 flag trio for `secondOrderBeliefEnabled`; the layer-map registration; the FROZEN closed return shape (coupling manifest row 14's PRE-PIN); the **structural** K3 fence; the four-fence dormancy set + lit-mutant; and the five named pins. **ZERO receipts. ZERO user-facing surface. ZERO writer. This packet.** | IN-0a/0b/0c/0d, SP-B |
| **IN-1b** | **THE STANDING LINE.** The dossier line under "WHAT THE NEIGHBOURS HAVE BEEN SHOWN" + its DM expansion to the deriving record — the mirror's first *user-facing* consumer, and the home of the RENDERED-surface phrase scan. | IN-1a |
| **IN-1c** | **THE HUMS.** `mirror_shift` + `mirror_confidence_degraded`: the statecraft-head producer, the chair's interim-desk ruling, the INFORMATION kind registry / receipt-pool module / annex URL, and the five-file registration footprint. | IN-1a, IN-1b |

⭐ **PRODUCER FIRST, and the estate has already paid for the other order.** ES-7 was refused
because five waves of consumers were built against a dispatcher nobody chartered; CR-GR4-1's
corollary states the rule in one word. IN-1b and IN-1c are both consumers of the read IN-1a
produces.

⚠ **THE ONE HONEST COST OF (a) ALONE, STATED RATHER THAN DISCOVERED:** for one packet's
duration the mirror is a producer with no production consumer — the mirror image of
`swornPartiesOf`'s dark year that `GR-4A.md` §0 calls out. It is **recorded, bounded, and
discharged by compiling IN-1b immediately after** (`PACKET_STANDARD.md`'s just-in-time rule).

---

## 0. Why this packet exists, and what it starts from

⭐ **The mirror's derivation core is ALREADY BUILT, and nothing consumes it.**

`src/domain/worldPulse/outboundImpression.js` (landed by **SP-B at `4c0f2f38`**, 175 lines,
pure, **zero-import by pinned contract**, already unit-tested at
`tests/domain/outboundImpression.test.js`) exports `outboundImpressionOf(...)` and
`OUTBOUND_CHANNELS`. Its header states the handoff verbatim:

> *"the one consumer this is built for (IN-1's `mirrorOf`, behind
> `secondOrderBeliefEnabled`) wants to compare it against a belief"* … *"A pure read with no
> writer and no land-time consumer costs a campaign zero bytes on every path, so it ships
> without a gate and INFO's consumers gate it when they arrive."*

**CONFIRMED: it has ZERO production consumers.** Every hit outside its own file is a test or
a walker (`tests/domain/outboundImpression.test.js`,
`tests/property/believedWorldAxesDormancyFence.test.js`,
`tests/lint/spTermLiteral.walker.test.js`, `tests/lint/couplingInclusion.walker.test.js`).

⛔ **No IN design document mentioned it.** A lane reading only `DESIGN_FP_ARCH_IN.md` would
have hand-rolled a second derivation — the second-spelling drift that leaf's own header says
the estate has counted fourteen instances of. **§13 D5 records the correction, and the chair
lands the dated note in the IN volume in this promotion change.**

IN-1a gives it its first production consumer, in the correct direction, and re-derives not
one line of it.

**Observable result:** with `secondOrderBeliefEnabled` lit, the mirror returns a frozen,
closed, banded record of *what our own durable ledgers say that court has been shown*, with a
confidence that DEGRADES on our own first-person evidence that they know things we never
showed them. Dark — and at every HEAD after this packet — **nothing calls it at all**, so the
dark path is byte-identical **by construction** rather than by a branch.

---

## 1. Reconciled authority

Reconciled per `PACKET_STANDARD.md` §"Authority order".

1. **Live git state at `ba219802` decides what exists.** Every §3 row was measured by
   executed read/grep/`node -e` in this worktree. Where design prose and code disagree,
   **the code wins**, and §13 records every instance.
2. **Newest chair rulings bind:** **CR-IN1-1..7 (2026-08-12, §12)**; the serialization law
   (`FABLE_VALIDATION_QUEUE.md` §"THE SERIALIZATION LAW"); the census-holder rule
   (`INDEX.md`); CR-GR4-1's producer-first corollary; **CR-C4-1** (the name-collision ruling,
   `tests/lint/postureNameCollision.walker.test.js` header) — decisive for §12 Q3; and the
   CQ5 flag law (`DESIGN_FP_ARCHITECTURE.md` §3, stated most sharply at
   `DESIGN_FP_ARCH_HB.md` §2.3).
3. **Operating law** — `CONTRIBUTING.md`, `ARCHITECTURE.md`, the worktree `CLAUDE.md`
   (never read a gate through a pipe), `PACKET_STANDARD.md`.
4. **Authoritative at `claude/composite-r4` @ `ba219802`**, or an unchanged descendant
   admitted and pinned by sealed dispatch.
5. **Design after reconciliation** — `DESIGN_FP_ARCH_IN.md` §2 / §4 (IN-1) / §5 item 4;
   `DESIGN_FP_INFORMATION.md` §"SEAM CONTRACT THREE" + §5 IN-1;
   `DESIGN_FP_ARCHITECTURE.md` §5 #17 and §9 coupling row 14;
   `DESIGN_FP_SPINE.md` requirements 13 + 14; `docs/content/RECEIPT_POOLS_INFORMATION.md` §IN-1.
6. **Never authority** — `SOL_QUEUE.md`, `START_HERE`, `docs/briefs/`, and
   `DESIGN_FP_ARCHITECTURE.md`'s PROGRESS block.

**Open authority conflicts: NINE, all recorded in §13, all resolved code-wins. None is left
for the coding agent to adjudicate.**

---

## 2. Outcome and non-goals

### 2.1 What IN-1a builds — one behavior family

A **pure, flag-gated, frozen-shape read** answering *"what does our own durable record say
that court has been shown of us?"*, with a confidence that degrades on first-person evidence
of independent arrival.

- **Composed, never forked:** the strength/label derivation is SP-B's `outboundImpressionOf`.
  IN-1a supplies the **row adaptation** (§3.7), the **banding**, the **staleness**, the
  **confidence**, the **degradation arm**, and the **frozen closed shape** that coupling
  manifest row 14 pre-pins for GRAMMAR.
- **K3 by construction, not by scan:** the derivation function **never receives
  `worldState`** (§6.2). A function that cannot reach the belief ledger cannot read the
  observer's slot.
- **Dark ⇒ byte-identical BY CONSTRUCTION.** No production caller exists after this packet.

### 2.2 Explicit non-goals — each excluded on purpose

| Excluded | Why | Where it goes |
|---|---|---|
| `mirror_shift`, `mirror_confidence_degraded` — any Herald/chronicle beat | second behavior family; the knowledge desk does not exist; five registration files (§-1 R3) | **IN-1c** |
| The dossier standing line, its DM expansion, and the RENDERED-surface phrase scan | a user-facing surface with its own pool; a rendered-surface negative is vacuous until something renders | **IN-1b** |
| An INFORMATION kind registry, receipt-pool module, or `INFORMATION_ANNEX_URL` | a registration family nobody has chartered | **IN-1c** |
| Any edit to `informationStatecraft.js` | it is the INFO head and the only statecraft fold; IN-1a needs no writer | never here |
| Any edit to `outboundImpression.js` | pinned **ZERO-IMPORT** contract (`tests/property/believedWorldAxesDormancyFence.test.js:472-484`) and it is SP's file | never |
| Any `pulseKernel.js` / `applyWorldPulse.js` edit or new stage | both pulse mouths sit at exact zero headroom; a pure read mounts nowhere | never |
| Any new persisted family, ledger key or `spatialLedgers` sub-key | the mirror is derived; IN volume §3 says "NEVER STORED" | never |
| A durable outbound-transfer record to cure §3.8 | a **new persisted family** — a different-sized packet, and owner-gated. **REFUSED at CR-IN1-7** | **refused; §12 Q7** |
| Any read of the counterpart's `beliefMap` slot | Law One / K3 | never |
| IN-2..IN-6 | later waves, later flags | their own packets |
| Tuning, lighting, soaks, deploys, pushes | `PACKET_STANDARD.md` §"Golden and behavior-shift law" | owner |

---

## 3. Verified tree contract

Measured at `b5442c07` by Lane AG and **re-measured at `ba219802` by the promotion lane for
every load-bearing figure**. **Every line number is a hint; every symbol is the instruction.**

### 3.1 The derivation core — LANDED, and it is the packet's raw material

| Role | File | Symbol | Required fact |
|---|---|---|---|
| Second-order heuristic | `src/domain/worldPulse/outboundImpression.js` | `outboundImpressionOf({selfId, observerId, plants, transfers, shares, sealed})` | Returns `{ strengthBand?: number, allianceLabel?: string, basis: string[], sealed: boolean } \| null`. **`null` when nothing was shown** — "absence is a result". **FORBIDDEN EDIT.** |
| Channel vocabulary | same | `OUTBOUND_CHANNELS = Object.freeze(['plant','transfer','share'])` | strongest-first; the same-tick tie comparator is deliberately inverted inside. **FORBIDDEN EDIT.** |
| Its contract pin | `tests/property/believedWorldAxesDormancyFence.test.js` | `:472` *"outboundImpression.js holds its ZERO-IMPORT contract"*, `:484` `expect(src).toContain('outboundImpressionOf')` | An import added to that leaf REDS. **FORBIDDEN EDIT.** |
| Its empty-record pin | `tests/domain/outboundImpression.test.js:24` | *"an empty outbound record yields NULL, not a midpoint"* | **IN-1a's EMPTY-RECORD NEGATIVE is already half-built** — C2 extends it upward, it does not re-author it |
| Its unit suite | `tests/domain/outboundImpression.test.js` | — | the shape to copy |

### 3.2 The SEVEN input families — measured, with a DURABILITY verdict each

| # | Family | Where | Tick field | **Durable?** |
|---:|---|---|---|---|
| 1 | Plants we commissioned | `spatialLedgers.disinfo`, key `` `lie:${liarId}:${audienceId}` ``; fields `{liarId, subjectId, audienceId, assertedBand, trueBand, seededTick, lineageId, spokespersonNpcId?, commission?}` (`informationStatecraft.js:420-437`) | `seededTick` | ✅ **YES** — persists while the lie stands |
| 2 | Intel we sold/gifted | `spatialLedgers.intelTransfers`; fields `{sellerId, receiverId, subjectId, mode, belief, fidelity01, depositTick, spokespersonNpcId?}` (`intelActs.js:383-390`) | `depositTick` | ⛔ **NO — PRUNED EVERY TICK.** §3.8 |
| 3 | Feeds we host | `brokerageServicesFeed.js#patronFeedEdges({worldState, item})` | — | ⚠ a derived read, not a record |
| 4 | Ally shares | `beliefMap.js#applyAllyIntelSharing` builds a transient `injections` Map | — | ⛔ **NO — NEVER LEDGERED AT ALL.** §3.8 |
| 5 | Treaty disclosure terms | `spatialLedgers.treaties` → `treaty.terms[]`, catalog family `'informational'`, field `term.mintedTick` | `mintedTick` | ✅ **YES** |
| 6 | Our HIDE spans | `spatialLedgers.secrecyPostures`, `{level01, enteredTick}` (`informationStatecraft.js:879-882`) | `enteredTick` | ✅ **YES** — but **per-settlement, NOT per-counterpart** (§13 D9) |
| 7 | ⭐ Negotiation pictures (J-INA-5) | the errand record: `envoyErrandRecords.js#normalizeErrand` carries `negotiationPicture` + `targetCourtPicture` (both-or-neither); accessor `envoyErrandsOf(worldState)`; frozen picture fields incl. `capturedTick`, `lastChangedTick`, `partyId`, `counterpartId` (`negotiationPictures.js#createNegotiationPicture`) | `capturedTick` | ✅ **YES** — ⛔ **DEFERRED at CR-IN1-2** (§12 Q2, §13 D4) |

**Degradation-arm evidence (three legs, all first-person):**

| Leg | Source | Durable? |
|---|---|---|
| (a) our exposure receipts | `informationStatecraft.js:589` mints `infowar_lie_exposed` as a **one-shot news entry**; the only sidecar is the module-private `bluffExposures` ledger, **drained one tick later** | ⛔ **NO** |
| (b) our caught-intercept receipts | the **envoy ENCOUNTER** record: `state: 'intercepted'`, evidence kind `'envoy_intercepted'` (`envoyErrandVocabulary.js:45,:60`), written by `envoyErrandEncounterWriter.js`; ticks `encounteredTick`/`resolvedTick`. ⚠ **DIRECTION IS SILENT IF WRONG:** the errand's `from` is US, the encounter's `interceptorId` is THEM | ✅ **YES** |
| (c) our own belief record of THEIR acts | `beliefMap.js:224` `beliefRecord(worldState, observerId, subjectId, factionId)` → the `BeliefRecord` typedef (`:334-349`), with `lastUpdateTick` and `confidence01` | ✅ **YES** |

⛔⛔ **THE K3 HAZARD IS AN ARGUMENT, NOT AN IMPORT — and this decides §6.2.** The legal call
`beliefRecord(ws, US, THEM)` and the forbidden call `beliefRecord(ws, THEM, US)` are **the
same function with the arguments swapped**. **An import allow-list cannot tell them apart.**

### 3.3 ⛔⛔ THE LAYER MAP CONVICTS THE FILE NAME

`tests/lint/couplingInclusion.walker.test.js` is TOTAL over
`CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//`.

**MEASURED by executing the walker's own `LAYER_PATTERNS` regexes against the proposed path:**
`src/domain/worldPulse/secondOrderBelief.js` matches **NO layer family** — the INFO row
(`:136`) is
`/^src\/domain\/worldPulse\/(?:beliefMap|belief[A-Z]|credibility|brokerage|information|disinfo|intel|sightPosture|outboundImpression)/`
and the filename begins `second`, not `belief`.

⇒ The leaf lands **UNLAYERED**, and both escape doors are shut:

- `UNLAYERED_BASELINE_CEILING = 179` is asserted **EXACT**, and
  `tests/lint/.coupling-unlayered-baseline.json` holds **exactly 179 entries at `ba219802`**
  (**RE-MEASURED AT PROMOTION**). The law it quotes is absolute: *"the unlayered baseline MAY
  NEVER GROW; such a file takes a NEW ARGUED_UNLAYERED entry with a written reason in the
  same commit, never a baseline row."*
- `ARGUED_ROSTER_CEILING = 13` is likewise **EXACT**, and the roster is a typed argument for
  modules that own **no subject**. The mirror owns second-order belief outright, so an
  argued entry is **the wrong classification** — the same reading that gave
  `secrecyTradeFactor.js` an INFO row rather than an argument.

⇒ **IN-1a MUST add one INFO `LAYER_PATTERNS` row in the same commit as the leaf** (§6.4).

⚠ **AND THE ROW HAS A CONSEQUENCE THE ROW DOES NOT STATE.** Once LAYERED,
`scanCrossLayerPairs()` sees both sides of the leaf, and every cross-layer import mints a
pair that **REDS unless a `COUPLING_REGISTRY` row licenses it** (a row licenses a pair when
it names the IMPORTER as its `read` or `counterforce` module **and** records the same
direction). **MEASURED, by running the same regexes:**

| Candidate import | Layer | Pair minted |
|---|---|---|
| `outboundImpression.js`, `beliefMap.js`, `informationStatecraft.js`, `brokerage*.js`, `disinformationPlant.js` | **INFO** | none — same layer ✅ |
| `bandedStock.js`, `bandFamilies.js` | **ARGUED_UNLAYERED substrate** | none — the scan skips unlayered deps ✅ **RE-VERIFIED AT PROMOTION** |
| `negotiationPictures.js`, `envoyErrandRecords.js`, `peaceTermsDisclosure.js`, `envoyErrandVocabulary.js` | **GRAMMAR** | `GRAMMAR→INFO` ⛔ owes a registry row |
| `generosityKernel.js` | **INTERIOR** | `INTERIOR→INFO` ⛔ owes a registry row |

⭐ **THE PROMOTION-TIME VERIFICATION CR-IN1-2 DEMANDED, DISCHARGED.** The chair required the
ARGUED_UNLAYERED claim proved rather than inherited. **CONFIRMED by executed read at
`ba219802`:** `bandedStock.js` is present in the walker's `ARGUED_UNLAYERED` roster
(`:271`) with `kind: 'substrate'`, and `scanCrossLayerPairs()` reads, verbatim,
`const depLayer = LAYER_OF.get(dep); if (!depLayer || depLayer === layer) continue;` — an
argued module has **no** `LAYER_OF` entry, so the dependency is skipped on the spot.
`beliefMap` and `outboundImpression` are both named in the INFO regex at `:136`, so both are
**same-layer** once IN-1a's own INFO row lands. ⇒ **The ruled three-import allow-list mints
ZERO cross-layer pairs and owes ZERO coupling registry rows.**

⇒ **The import list IS the coupling bill**, and §6.2's allow-list is written to keep it at
**zero**.

### 3.4 The flag machinery — the CQ5 trio, measured

| Role | File | Symbol | Required fact |
|---|---|---|---|
| The manifest | `src/domain/worldPulse/simulationRules.js` | `ENGINE_GATED_VIRTUAL_RULE_KEYS` | **RE-MEASURED AT `ba219802`: 15 members**, authored **alphabetically**. `secondOrderBeliefEnabled` sorts between `pactFormationEnabled` and `sovereigntyTradeEnabled`. ⛔ It must **NOT** join `DEFAULT_SIMULATION_RULES` or any preset spread — `engineGatedRuleKeys.walker.test.js:546` reds by name if it does |
| The certification row | `src/domain/certification/subsystemRowsVirtual.js` | `VIRTUAL_SUBSYSTEM_ROWS` (`:54`, 15 rows) | **AUTHORED, NEVER PENDING.** `VIRTUAL_PENDING_RULE_KEYS` is `Object.freeze([])` (`:836`); the walker's own instructions read *"there is no such state … Author the row in subsystemRowsVirtual.js in the same commit, or do not manifest yet."* Shape: `{rule, title, module, aliveness:{eventTypes,moverFamilies,stateKeys,other}, expectedTempo, invariants:[{name,description,check}], soakEvidence}` |
| The row's lane test | `tests/domain/subsystemRowsVirtual.test.js` | `VIRTUAL_RULES` (`:122`), `LANE_LEAVES` (`~:136`) | `:291` asserts **exact ORDERED** equality against the rows array; `:296` asserts set-equality against the manifest. **All three edits move together or two of them red** |
| The primary walker | `tests/lint/engineGatedRuleKeys.walker.test.js` | `GATE_RE` (`:243`) | Proves the manifest three ways; the key needs a **real `rules.<key> === true` by-name read in `src/`**. ⛔ A frozen-list `.every()` is invisible to it |
| The totality walker | `tests/lint/subsystemCertificationTotality.walker.test.js` | `:151` | `covered + pending === simulationRuleKeys().length`; `PENDING_CEILING = 4` |
| The lit-coverage ratchet | `tests/property/mechanismLitCoverage.test.js` | `enumerateFlags()` (`~:168`) | ⚠ **EASY TO MISS.** It enumerates `<x>Enabled` tokens **straight out of `simulationRules.js` source text**, so the key joins its denominator the moment the string lands and must earn lit credit — a literal `secondOrderBeliefEnabled: true` in a test file. **The four-fence file's lit-mutant supplies exactly that.** `tests/fixtures/mechanism-lit-coverage-baseline.json` reds on drift in **either** direction |
| ⛔ The generated edge bundles | `supabase/functions/_shared/*Bundle.js` | — | `simulationRules.js` is a recorded input. **FIVE bundles exist** (`aiCharter`, `aiGrounding`, `aiOutputSchema`, `analyticsEvents`, `intentAtlas`) and the estate's recorded law is that the builder rebuilds all five. Freshness tests red until `npm run build:edge-shared` runs **in the same commit** |

**The fence exemplar to copy:** `tests/property/pactFormationDormancyFence.test.js` (GR-2,
299 lines) — FENCE 1 own-footprint invariant carrying no stored hash; FENCE 2 differential
over absent / `false` / every truthy imposter (`[false,0,1,'true','yes',{},[],null]`); FENCE
3 call-path dormancy on a `vi.hoisted` strict pass-through spy over a **cross-module** edge;
FENCE 4 gate-polarity census asserting the **EXACT list of every file naming the key** plus
single-read-by-name; then THE LIT-MUTANT CONTROL proving all four can see.

### 3.5 The frozen return shape is a CROSS-PROGRAM contract

`DESIGN_FP_ARCHITECTURE.md` §9 coupling manifest **row 14** (`:2632`): *"`mirrorOf` shape |
IN-1 → GR negotiation posture | PRE-PIN: frozen return shape (closed keys, banded) — one
reader shape, two programs."* ⇒ **The shape pin is a deliverable of this packet**, and
widening it later is a GRAMMAR-visible act. ⭐ Note the row pins the **SHAPE**, not the symbol
spelling — which is what makes §12 Q3's rename cheap.

### 3.6 ⛔ THE NAME `mirrorOf` IS ALREADY TAKEN, AND THE CHAIR HAS RULED ON THIS EXACT CLASS

`src/domain/worldPulse/npcLadderState.js:899` exports `mirrorOf(rec, nameByNid, modByFkey)`
(INTERIOR layer, consumed at `npcLadderKernel.js:87,:909`, tested at
`tests/domain/npcLadderBonds.test.js:86`); `urbanFabricKernel.js:517` holds a module-private
third. **CONFIRMED.**

⛔ **`tests/lint/postureNameCollision.walker.test.js` (SP-C, chair ruling CR-C4-1, 2026-08-06)
is this exact class, already adjudicated**, verbatim from its header: *"Two exports of one
name in one domain tree is a defect with no runtime symptom … which is why SP §11 Q2's
'module scoping disambiguates' was **overruled**: a disambiguation that lives in the reader's
head is not enforcement."* ⇒ **CR-IN1-3 RULES THE RENAME**, against the design's spelling
(§12 Q3, §13 D3).

### 3.7 ⚠ `outboundImpressionOf`'s INPUT TYPEDEFS DO NOT MATCH THE REAL LEDGER ROWS

**MEASURED.** The leaf's caller-shaped typedefs versus the live rows:

| Channel | `outboundImpressionOf` expects | The real row carries |
|---|---|---|
| plant | `{audienceId, subjectId, assertedBand, seededTick}` | ✅ **exact match** — `spatialLedgers.disinfo` |
| transfer | `{toId, subjectId, strengthBand, fidelity01, tick}` | ⛔ `{sellerId, **receiverId**, subjectId, mode, **belief**, fidelity01, **depositTick**}` |
| share | `{toId, subjectId, allianceLabel, tick}` | ⛔ **no persisted row exists at all** (§3.8) |
| `sealed` | `boolean` | ⛔ the posture is `{level01, enteredTick}` **per settlement**, not per counterpart |

⇒ **IN-1a owns a small, explicit ADAPTER**, and the adapter is a named contract in §6.1 —
never an inline shrug. ⛔ **The adapter lives in IN-1a's leaf, never in
`outboundImpression.js`.**

### 3.8 ⛔⛔ THE STALENESS CLOCK HAS NO SUBSTRATE FOR THREE FAMILIES — the refuted premise

`DESIGN_FP_INFORMATION.md` asserts *"Each input already ledgered, already decaying."*
**MEASURED FALSE for three of seven:**

1. **`intelTransfers` is PRUNED EVERY TICK.** `generosityKernel.js:1276-1285`, verbatim:
   *"PRUNE any from a PRIOR tick … `if (num(asObject(v).depositTick, tick) < tick) continue;
   // consumed ⇒ prune`"*. **CONFIRMED by direct read.** It is a **hand-off ledger**, not a
   durable outbound record: at any tick it holds at most that tick's transfers. The transfer
   channel is therefore **live but memoryless** — it can contribute to *"what we showed them
   this week"* and **contributes nothing to `lastShownTick` beyond the current tick**.
2. **Ally shares are NEVER LEDGERED.** `beliefMap.js:1040` `applyAllyIntelSharing` builds a
   transient `injections` Map (`:1049` *"receiverId → subjectId → the highest-priority
   injected belief"*). ⇒ **`outboundImpressionOf`'s `share` channel has NO persisted source
   at this HEAD, so its `allianceLabel` arm cannot fire from `worldState`.** (PLAUSIBLE at
   high confidence — **VERIFY-AT-BUILD** whether a share leaves any durable trace; if it
   does, that is a finding to report, not to wire.)
3. **Exposure receipts are one-shot news**; the only sidecar, `bluffExposures`, is
   module-private and **drained the next tick**.

⇒ **CR-IN1-7 RULES IT (§12 Q7): DERIVE FROM THE DURABLE FAMILIES ONLY**, and the transient
ones are recorded deferrals carrying this measurement. The dated correction lands in
`DESIGN_FP_INFORMATION.md` and `DESIGN_FP_ARCH_IN.md` in this promotion change.

### 3.9 Bands, and the crossing grammar that IN-1a does NOT use

- `src/domain/worldPulse/bandedStock.js` (**ARGUED_UNLAYERED substrate** ⇒ importing it mints
  **no** cross-layer pair) exports `HALF_LIFE_BANDS = Object.freeze(['a_season','a_year','a_few_years','a_decade','a_generation'])`,
  `HALF_LIFE_WEEKS`, `CROSSING_DIRECTIONS = Object.freeze(['rose','fell'])`,
  `halfLifeWeeksOf(band)` (**THROWS on an unknown band**), `decayTowardNeutral(...)`
  (**THROWS on non-finite**), `crossingOf(ladder, priorBand, nextBand)`, and
  `bandCrossingReceipt(args)` — *"THE ONE CROSSING-RECEIPT GRAMMAR."*
  ⇒ **IN-1a uses `HALF_LIFE_BANDS`/`halfLifeWeeksOf` for the staleness clock and authors its
  OWN ascending mirror ladder** (the module supplies no mirror ladder). ⛔ **`crossingOf` and
  `bandCrossingReceipt` are IN-1c's** — a crossing receipt with nothing to mint is a receipt.
- **Band spellings to reuse rather than invent:** `negotiationPictures.js`'s module-private
  ladders — `['unknown','spent','strained','ready','strong','dominant']` (strength),
  `['unknown','quiet','present','pressing','decisive']` (pressure) — reachable through the
  exported `NEGOTIATION_SUBJECT_BANDS` map. ⚠ That module is **GRAMMAR**, so IN-1a **copies
  the spellings into its own frozen ladder rather than importing them** (§6.2).
- `bandFamilies.js` is a **different** family (`SIGNIFICANCE_CLASSES`, `SEVERITY_LADDER`) —
  significance, not quantity. IN-1a does not touch it.

### 3.10 Ceilings and baselines the packet lives inside

- **`src/domain/**` layer default `max-lines` = 800** effective (`eslint.config.js:533`,
  `skipBlankLines` + `skipComments`). **No `scripts/.size-baseline.json` entry exists for any
  IN file** (measured), so the new leaf's packet cap of 250 binds first.
- **Test ratchet:** `scripts/.test-ratchet-baseline.json` holds **16 entries at `ba219802`**
  against `const CEILING = 17` (`tests/lint/testRatchet.test.js:177`) — **RE-MEASURED AT
  PROMOTION**. `5f687277` shrank 17→16 by cure. Land with **no** new baselined failure; never
  raise `CEILING`.
  ⚠ **Entry 5 is `tests/docs/enforcement-claims.test.js`, a banked RED naming six claims in
  files this packet never touches.** ⛔ **Do not widen it:** the claim vocabulary
  (`CLAIM_RE`, `tests/docs/enforcement-claims.test.js:38`) must not appear in any file this
  packet authors, because a seventh claim would silently widen a banked failure rather than
  minting a visible new one.
- **Lighting census:** `tests/lint/sovereigntyLightingContract.walker.test.js:3951` reads
  `files: 2404, parked: 365, credited: 2039, titles: 19880, suiteTitles: 5609` — **MEASURED
  BY READ at `ba219802`**, a named-committed-sha snapshot per serialization-law rule 4.
  ⛔ **Re-derive from the FILE at preflight; never fold onto this row.**
- **Anchored negatives:** `tests/lint/negativeAssertionAnchor.walker.test.js` gives a new file
  **ZERO** unanchored `.not.toContain(` / `.not.toMatch(` / `.not.toHaveProperty(`. Route
  every negative through `tests/helpers/anchoredNegatives.js`
  (`expectAbsentWithAnchor` / `expectPresentThenAbsent`), or use `// anchored:` **on the
  assertion line or the SINGLE line immediately above**.
  ⚠⚠ **THE WALKER SCANS COMMENT TEXT.** `tests/domain/brokeragePlantHandoffPins.test.js:846-849`
  records it firing for real: *"the negative-assertion walker scans COMMENT text too, so
  quoting the matcher here would register a fresh violation — measured 2026-08-06, it did
  exactly that on the first pass of this repair."*

---

## 4. Hard scope budget

| Limit | Budget | IN-1a | |
|---|---:|---|---|
| Behavior families | 1 | 1 — the derived read | ✓ |
| New persisted record families | 1 | **0** | ✓ |
| Named writer per changed state | 1 | **0** — the leaf is pure | ✓ |
| Feature flags | 1 | **1 — `secondOrderBeliefEnabled`, MINTED HERE** | ⚠ at cap |
| User-facing surfaces | 1 | **0** — IN-1b owns the dossier | ✓ |
| Direct production consumers | 2 | **0** — producer-first (§-1) | ✓ |
| New logic-bearing production leaves | 2 | 1 — `secondOrderBelief.js` | ✓ |
| Existing logic-bearing production files modified | 3 | **0** | ✓ |
| Registration-only production files | 3 | **2** — `simulationRules.js`, `subsystemRowsVirtual.js` | ✓ |
| Handwritten files total | 12 | **8** (§7) | ✓ |
| New/changed effective production lines | 400 | ~260 projected | ✓ |
| Each new leaf | 250 | ~210 projected | ⚠ measure with eslint's own `Linter`, never `wc -l` |
| Shared/hot-file delta | 15 each | `simulationRules.js` ≤ 12 (comment + key); `subsystemRowsVirtual.js` is a **registration-only** row, not a hot-file drive-by | ✓ |
| Acceptance cases | 8 | **7** (§9) | ✓ |
| Generated artifacts | — | the FIVE edge-shared bundles via `npm run build:edge-shared` | declared |

⭐ **The refusal is what buys the headroom.** Every ⚠ row is at cap because of the flag alone;
adding a receipt, a pool or a dossier line breaks three rows at once, and breaking them is a
STOP rather than a renegotiation. **No budget row carries an override.**

---

## 5. Preflight

```sh
git status --short --branch
git rev-parse HEAD
git merge-base --is-ancestor ba219802 HEAD                     # this packet's verified base
git merge-base --is-ancestor 4c0f2f38 HEAD                     # SP-B (outboundImpression.js)
git merge-base --is-ancestor 29e2dc3c HEAD                     # IN-0c
git merge-base --is-ancestor db35bad6 HEAD                     # IN-0d

# ⛔ THE PORCELAIN LIES HERE — prove the tree, do not read the letters.
git diff HEAD --stat                                            # expect EMPTY (working tree == HEAD)
git diff --cached --stat                                        # non-empty ⇒ stale index, RESERVED

# Substrate untouched since the verified base.
git log --oneline ba219802..HEAD -- \
  src/domain/worldPulse/outboundImpression.js \
  src/domain/worldPulse/simulationRules.js \
  src/domain/worldPulse/bandedStock.js \
  src/domain/worldPulse/beliefMap.js \
  src/domain/worldPulse/generosityKernel.js \
  src/domain/certification/subsystemRowsVirtual.js \
  tests/lint/couplingInclusion.walker.test.js                   # expect EMPTY

# New files absent.
test ! -e src/domain/worldPulse/secondOrderBelief.js
test ! -e tests/domain/secondOrderBelief.test.js
test ! -e tests/property/secondOrderBeliefDormancyFence.test.js

# Targets clean (path-scoped — foreign dirt elsewhere is RESERVED, never touched).
git diff --quiet -- src/domain/worldPulse/simulationRules.js
git diff --quiet -- src/domain/certification/subsystemRowsVirtual.js
git diff --quiet -- tests/domain/subsystemRowsVirtual.test.js
git diff --quiet -- tests/lint/couplingInclusion.walker.test.js
git diff --quiet -- tests/lint/sovereigntyLightingContract.walker.test.js

# Live symbols — by symbol, never by line number.
rg -n 'export function outboundImpressionOf|export const OUTBOUND_CHANNELS' src/domain/worldPulse/outboundImpression.js
rg -n 'export const HALF_LIFE_BANDS|export function halfLifeWeeksOf' src/domain/worldPulse/bandedStock.js
rg -n 'export const ENGINE_GATED_VIRTUAL_RULE_KEYS' src/domain/worldPulse/simulationRules.js
rg -n 'export const VIRTUAL_SUBSYSTEM_ROWS|VIRTUAL_PENDING_RULE_KEYS' src/domain/certification/subsystemRowsVirtual.js
rg -n 'UNLAYERED_BASELINE_CEILING|ARGUED_ROSTER_CEILING|LAYER_PATTERNS' tests/lint/couplingInclusion.walker.test.js
rg -n 'consumed ⇒ prune' src/domain/worldPulse/generosityKernel.js       # §3.8 premise 1, RE-MEASURE
rg -n 'secondOrderBelief|secondOrderBeliefEnabled' src/ tests/            # expect ONLY outboundImpression.js's header prose

# ⛔ COUNT, NEVER INHERIT — three figures this packet's pins are written against.
node -e "const s=require('fs').readFileSync('src/domain/worldPulse/simulationRules.js','utf8');const m=s.match(/ENGINE_GATED_VIRTUAL_RULE_KEYS = Object\.freeze\(\[([\s\S]*?)^\]\);/m);console.log('manifest keys:',m[1].split('\n').filter(l=>/^\s*'[A-Za-z]+',/.test(l)).length)"
node -e "console.log('unlayered baseline:',require('./tests/lint/.coupling-unlayered-baseline.json').length)"
node -e "console.log('ratchet entries:',Object.keys(require('./scripts/.test-ratchet-baseline.json').entries).length)"
```

Any target collision or material symbol drift makes this packet `STALE`.

### 5b. Baselines

⚠ Lane AG executed **no** test, build or gate command (read-only draft lane); the promotion
lane executed **no** test or build command either, only reads, greps, `node -e` and
`validate:packets`. Rows are **UNMEASURED** unless marked MEASURED, and the marked ones are
**reads, not runs**.

| # | Premise | Exact command | Expected / recorded |
|---|---|---|---|
| B1 | Belief/info suites green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/outboundImpression.test.js tests/domain/subsystemRowsVirtual.test.js tests/property/believedWorldAxesDormancyFence.test.js` | **UNMEASURED** — exit 0 |
| B2 | The flag walkers green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/engineGatedRuleKeys.walker.test.js tests/lint/subsystemCertificationTotality.walker.test.js tests/property/mechanismLitCoverage.test.js` | **UNMEASURED** — exit 0 |
| B3 | The layering ratchet green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/couplingInclusion.walker.test.js tests/lint/couplingDesk.walker.test.js` | **UNMEASURED** — exit 0 |
| B4 | Manifest membership | count at preflight | **MEASURED BY READ at `ba219802`: 15 keys.** The one-key-delta pin asserts 16 after |
| B5 | Unlayered baseline size | count at preflight | **MEASURED BY READ at `ba219802`: 179 against `UNLAYERED_BASELINE_CEILING = 179` — ZERO headroom** |
| B6 | Test-ratchet headroom | read both files | **MEASURED BY READ at `ba219802`: 16 against `CEILING = 17`** |
| B7 | Lighting census row | read the walker | **MEASURED BY READ at `ba219802`, `:3951`: `2404 / 365 / 2039 / 19880 / 5609`.** ⛔ Re-derive from the FILE at preflight |
| B8 | Typecheck posture | `npm run typecheck:ratchet` then `npm run typecheck:domain:strict` | **UNMEASURED** — exit 0 both, named separately with their configs. ⚠ An unbaselined new file's error allowance is **ZERO** |
| B9 | Edge-bundle freshness at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/edgeFunctions/` | **UNMEASURED** — exit 0, so a post-edit red is attributable |
| B10 | The `.npcs` census green at base | `sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/roadsParticipation.test.js` | **UNMEASURED** — exit 0 (§8 item 5) |
| B11 | Lit-coverage baseline | read `tests/fixtures/mechanism-lit-coverage-baseline.json` | **UNMEASURED** — record `flags` and the mechanism count **before** the first edit |
| B12 | Pre-existing gate reds | committed-base run, capturing `$?` yourself | **PARTLY KNOWN: `tests/docs/enforcement-claims.test.js` is a banked RED at HEAD** (entry 5 of the ratchet baseline; `ba219802`'s own receipt records it reproducing on unmodified files). ⚠ The only other legitimate pre-existing red to attribute is the owner-approved `generatorGoldenMaster` golden |

---

## 6. Exact contracts

### 6.1 The new leaf

**Home: `src/domain/worldPulse/secondOrderBelief.js`. PURE — no state, no writer, no RNG, no
clock, no mutation of any argument.**

```js
MIRROR_BANDS                    // Object.freeze([...])  the closed ascending ladder, ONE spelling
MIRROR_STALENESS_BANDS          // Object.freeze([...])  derived against bandedStock's HALF_LIFE_WEEKS
MIRROR_UNKNOWN                  // the frozen zero-confidence answer

secondOrderBeliefActive(worldState) -> boolean          // THE ONE by-name gate read
mirrorInputsAt(worldState, selfId, observerId, tick) -> Readonly<MirrorInput>   // THE COLLECTOR
secondOrderMirrorOf(input) -> Readonly<MirrorRecord>    // THE DERIVATION — never sees worldState
```

⚠ **The exported derivation name is `secondOrderMirrorOf`, not `mirrorOf` — CR-IN1-3,
§12 Q3, §13 D3.**

**`MirrorRecord` — the FROZEN CLOSED SHAPE (coupling manifest row 14's PRE-PIN):**

| Key | Type | Contract |
|---|---|---|
| `strengthShown` | `MIRROR_BANDS` member | banded from `outboundImpressionOf(...).strengthBand` |
| `wealthShown` | `MIRROR_BANDS` member | ⛔ **`'unknown'` ALWAYS at this HEAD** — no substrate; §13 D2 |
| `devotionShown` | `MIRROR_BANDS` member | ⛔ **`'unknown'` ALWAYS at this HEAD** — §13 D2 |
| `lastShownTick` | integer \| `null` | the newest **durable** contributing act's tick; `null` when nothing durable was shown |
| `staleness` | `MIRROR_STALENESS_BANDS` member | from `tick - lastShownTick` against the half-life ladder |
| `confidence` | `MIRROR_BANDS` member | evidence breadth, then **degraded** per §6.3 |
| `basis` | frozen sorted `string[]` | machine tokens (`plant:strengthBand`, `transfer:partial`, …), carried through from `outboundImpressionOf` plus IN-1a's own |
| `sealed` | boolean | derived from the per-settlement HIDE posture; §13 D9 |

- ⛔ **The key set is CLOSED and asserted by exact `Object.keys()` equality** (C4); the record
  and every nested array are `Object.freeze`d.
- **Totality:** a `null`/`undefined`/non-object input, an empty input, `selfId === observerId`,
  and a non-string id all answer **`MIRROR_UNKNOWN` without throwing**. It never throws.
  ⚠ `halfLifeWeeksOf` and `decayTowardNeutral` **THROW** on bad input — the leaf clamps and
  guards **before** calling them, and C7 drives that arm.
- **`outboundImpressionOf` returning `null` ⇒ `MIRROR_UNKNOWN` at zero confidence**, never a
  fabricated band (C2, with its seeded non-empty sibling).
- **Stable enumeration order:** every array output is codepoint-sorted at the boundary.
  ⛔ No `Object.keys` iteration over an unsorted map may reach an output.

**`MirrorInput` — the ADAPTER contract (§3.7), and it is a named contract, not a shrug:**

| Field | Built from | Adaptation |
|---|---|---|
| `plants` | `spatialLedgers.disinfo` rows where `subjectId === selfId && audienceId === observerId` | ✅ **pass-through — the shapes already match** |
| `transfers` | `spatialLedgers.intelTransfers` rows where `sellerId === selfId && receiverId === observerId` | ⛔ **RENAME `receiverId→toId`, `belief→strengthBand`, `depositTick→tick`**; the rename is one place and it is pinned by C5 |
| `shares` | ⛔ **`[]` ALWAYS at this HEAD** — no persisted source (§3.8 premise 2) | recorded deferral with its measurement |
| `sealed` | `spatialLedgers.secrecyPostures[selfId]` → `level01` past the posture threshold | ⚠ per-settlement, not per-counterpart (§13 D9) |
| `evidence` | legs (b) and (c) of §3.2 | see §6.3 |
| `tick` | the caller's tick | never `Date` |

### 6.2 ⛔⛔ THE K3 FENCE IS STRUCTURAL — the allow-list ALONE CANNOT DO IT

The volume's pin is an allow-list on the import list. **MEASURED: an allow-list is not
sufficient here.** `beliefRecord(worldState, observerId, subjectId)` serves both the LEGAL
read (leg (c): `beliefRecord(ws, US, THEM)`) and the FORBIDDEN read
(`beliefRecord(ws, THEM, US)`). **The discriminator is an ARGUMENT, and no import list can see
an argument.**

⭐ **RULED AT CR-IN1-2 — a THREE-ARM fence:**

1. ⭐ **STRUCTURAL (the strongest arm, and it is free).**
   **`secondOrderMirrorOf(input)` never receives `worldState`.** It takes pre-read rows —
   the `outboundImpression.js` posture, already built and pinned in this estate. A function
   with no world cannot reach a belief ledger, by construction, forever.
2. **ALLOW-LIST EQUALITY on the leaf's imports**, on the
   `tests/domain/envoyK3BeliefSeam.test.js` idiom (comment-stripped source, `importsOf`,
   `toEqual` a closed reviewed set, with an anti-vacuity floor asserted first).
   **RULED SET: `['./bandedStock.js', './beliefMap.js', './outboundImpression.js']`.**
   ⭐ All three are **INFO or ARGUED_UNLAYERED**, so the leaf mints **ZERO cross-layer pairs
   and owes ZERO coupling rows** — **verified at promotion, §3.3.** A fourth import REDS.
3. **ARGUMENT-ORDER SOURCE SCAN on the collector** — the one arm the allow-list cannot
   supply. The leaf's **only** `beliefRecord(` call site is asserted to be
   `beliefRecord(worldState, selfId, observerId` — **`selfId` in the observer position** —
   and the count of `beliefRecord(` occurrences in the leaf is asserted to be exactly **1**.
   A second call site, or a swapped pair, REDS.

⭐ **GUARD-THE-GUARD (positive control), on the `envoyK3BeliefSeam.test.js` model:** the same
observer-slot token scan is pointed at `src/domain/worldPulse/beliefMap.js`, which
legitimately reads observer-side belief, and **must FLAG it**. A scan that cannot convict the
one module that should be convicted is decoration.

⚠ **Comment-strip before scanning.** `envoyK3BeliefSeam.test.js:44` strips block and line
comments precisely because *"these modules' own headers describe the truth they refuse to
import, and a raw scan would count that refusal as the offence."* IN-1a's header will name
`beliefMap.js` and the forbidden call in prose — **strip, or the leaf convicts itself.**

### 6.3 The degradation arm — the counterforce, and the REVERSAL PIN

Confidence **degrades** on our own **first-person** evidence. **Two legs build here; one is
deferred with its measurement:**

| Leg | Built? | Source |
|---|---|---|
| (b) caught intercepts | ✅ **BUILDS** | the envoy ENCOUNTER with `state: 'intercepted'` — durable. ⚠ **Direction is silent if wrong:** the errand's `from` is US; the encounter's `interceptorId` is THEM. **The packet PINS the direction with a fixture in both orientations** |
| (c) our belief record of their acts | ✅ **BUILDS** | `beliefRecord(worldState, selfId, observerId)` — leg (c) is what makes the argument-order scan (§6.2 arm 3) load-bearing rather than ceremonial |
| (a) our exposure receipts | ⛔ **DEFERRED, with its measurement** | one-shot news entries; `bluffExposures` is module-private and drained next tick (§3.8 premise 3). **Recorded in the leaf's header and in §13 D8 so the deferral cannot ghost** |

⛔ **Leg (c) reads what WE HEARD, which can itself be wrong. The mirror degrading on false
word is CORRECT BEHAVIOR, not a defect** — the volume says so and the packet repeats it so no
implementer "fixes" it.

⛔⛔ **THE REVERSAL PIN (C3) is the hardest and it is not optional.** On a real fixture,
adding evidence must drive `confidence` **measurably DOWN**. *If the degradation arm is
unreachable, the mirror is a ratchet* — the estate's recorded unreachable-arm vacuity class.
**Two independent legs build precisely so C3 has two ways to fire. If NEITHER fires from a
real fixture, that is a STOP, not a weaker pin.**

### 6.4 ⛔⛔ THE LAYER-MAP ROW — a walker pre-registration, in commit one

Add ONE row to `LAYER_PATTERNS.INFO` in `tests/lint/couplingInclusion.walker.test.js`, with a
written reason on the IN-0d model:

```js
    // IN-1: the second-order mirror. "What our own record says they have been shown" is
    // INFORMATION's own subject — the layer mints the outbound acts, owns their decay, and
    // owns the belief partition the mirror is forbidden to cross — so the leaf takes INFO
    // whatever noun it is named after, on exactly the reading that gave secrecyTradeFactor
    // INFO and beliefAxisSubjects INFO: the distinction is SUBJECT, not program. It is NOT
    // an ARGUED_UNLAYERED case: the argued roster is for modules that own no subject and are
    // spoken by every port, and this one owns second-order belief outright. Giving it a
    // family is precisely what will force GRAMMAR's coming negotiation-posture consumer to
    // register its coupling instead of reading across a port in silence.
    /^src\/domain\/worldPulse\/secondOrderBelief\.js$/,
```

- ⛔ **An exact-path regex, not a `second[A-Z]` prefix.** A prefix claims files nobody has
  designed and silently widens a frozen family.
- ⛔ **Do NOT add a line to `tests/lint/.coupling-unlayered-baseline.json`** (frozen at 179 by
  an exact assertion; the design law forbids the door outright), and **do NOT add an
  `ARGUED_UNLAYERED` entry** (`ARGUED_ROSTER_CEILING = 13` is exact and the classification
  would be wrong).
- ✅ `LAYER_FLOORS.INFO` is a **floor**; growing the family past it is lawful and needs no edit.

### 6.5 ⛔⛔ THE CQ5 FLAG-MINT CHOREOGRAPHY — ONE COMMIT, in this order

**The law** (`DESIGN_FP_ARCH_HB.md` §2.3): the manifest entry, **its AUTHORED certification
row**, and **its first real by-name gate read** land in **ONE COMMIT**, with
`engineGatedRuleKeys.walker.test.js` asserting the **exact one-key delta**.
⛔ **THE ROW IS AUTHORED, NEVER PENDING.** All four `*_PENDING_RULE_KEYS` arrays are
`Object.freeze([])`; *"manifesting is the act that makes a virtual key censusable, so
manifesting is the act that comes due."*

**Step by step. Do not reorder; each step's red is a different diagnosis.**

1. **Write the gate read FIRST, inside the leaf.** `secondOrderBeliefActive(worldState)` reads
   `worldState?.simulationRules?.secondOrderBeliefEnabled === true` — **BY NAME, STRICTLY
   `=== true`, EXACTLY ONCE, IN EXACTLY ONE FILE.** ⛔ Never a frozen-list `.every()`
   (invisible to the census); never `!flag`; never `flag !== true`; never `flag)`.
   `mirrorInputsAt` returns the empty input and `secondOrderMirrorOf` returns
   `MIRROR_UNKNOWN` when it is false.
2. **Add the manifest string**, alphabetically between `pactFormationEnabled` and
   `sovereigntyTradeEnabled`, with the house comment naming date, wave, ruling, the first gate
   read **BY SYMBOL**, and the conjunction:
   *"Joined 2026-08-… by FP wave IN-1a under CR-WR10-C item 4 (the compiled charter's §3 flag
   law), in the SAME commit as its first real gate read
   (`secondOrderBelief.secondOrderBeliefActive`, the ONE `=== true` by-name read of this key
   in the tree) and its AUTHORED certification row — never a pending entry."*
   ⛔ **It joins NOTHING else in that file** — not `DEFAULT_SIMULATION_RULES`, not `PROFILE_DEFAULTS`,
   `QUIET`, `OPEN`, `WAVES`, `ONE_REGEN` or any preset spread. A declared key is not virtual
   and the walker says so by name.
3. **Author the certification row** in `subsystemRowsVirtual.js#VIRTUAL_SUBSYSTEM_ROWS`, sited
   beside the belief rows. `aliveness.{eventTypes, moverFamilies, stateKeys}` are
   **DELIBERATELY EMPTY** — IN-1a mints no event, no mover family and no state key — with the
   whole story in `other`, on the `believedDoctrineEnabled` precedent
   (`DESIGN_FP_ARCH_HB.md` §2.3: *"a conditional field inside another subsystem's container is
   invisible to every receipt shape the estate writes"*). `soakEvidence: 'unobserved'`.
   **Never a PENDING entry.**
4. **Move the lane test in the same change** — `tests/domain/subsystemRowsVirtual.test.js`: the
   named const with its joined-by comment, the insert into `VIRTUAL_RULES` **in AUTHORING
   ORDER** (`:291` is exact ordered equality), and the `LANE_LEAVES` entry. ⛔ Editing one of
   the three leaves the other two red.
5. **Add the layer-map row** (§6.4) — the walker pre-registration, same commit.
6. **Author the four-fence file** `tests/property/secondOrderBeliefDormancyFence.test.js`,
   copying `pactFormationDormancyFence.test.js`. FENCE 4's exact-file-list arm must name
   **exactly** the files containing the token after this commit — predict it, then verify:
   `simulationRules.js`, `secondOrderBelief.js`, `subsystemRowsVirtual.js`. **The LIT-MUTANT
   control's literal `secondOrderBeliefEnabled: true` is also what earns
   `mechanismLitCoverage`'s lit credit — the same line pays both bills.**
7. **Regenerate the edge bundles** — `npm run build:edge-shared` — and commit the regenerated
   `supabase/functions/_shared/*Bundle.js` **in the same commit**. ⚠ The estate's recorded law
   is that this builder rebuilds **FIVE** bundles; report the artifact delta whatever it is,
   and **a delta of zero is a finding to report, not to explain away**.
8. **Re-derive and re-record the lighting census WHOLE** (§8 item 3).

⛔⛔ **AND THE STAGING LAW THAT HAS BITTEN THIS ESTATE BEFORE — CQ5.**
`.husky/pre-commit` runs **lint-staged**, and **lint-staged STASHES the unstaged remainder of
a partially-staged file.** A flag wave's edits span `src/`, `tests/`,
`src/domain/certification/` and generated `supabase/` artifacts, so a partial stage can
(a) lint a file the tree does not hold and (b) stash foreign WIP mid-hook in a shared tree.
⇒ **STAGE THE FULL SET, BY PATHSPEC, IN ONE `git add` OF NAMED PATHS — never `-A`, `-u` or
`.`, and never a partial stage of any file in the set.** Verify every staged hunk is yours
before committing; confirm untracked files survived the hook afterwards.
⛔ **The lint-staged ceiling read is real too:** `eslint.config.js` reads its per-file
`max-lines` from `scripts/.size-baseline.json` (chair ruling R-BLD-6), so an over-ceiling
staged file blocks the commit. Measure with eslint's own `Linter` before editing; **never**
add or raise a baseline entry to finish.

⛔ **CQ5's collision law binds ACROSS volumes:** a flag-minting lane may not build
concurrently with another flag-minting lane in the same worktree. The chair confirms IN-1a is
the only flag wave in flight in the dispatch message.

### 6.6 Module-local frozen tuning — RULED ZERO at CR-IN1-4

IN-1a needs authored numbers for the staleness band edges, the confidence ladder, and the
degradation step per evidence leg.

⭐ **RULED (CR-IN1-4): ZERO new tuning keys.** The staleness clock **derives from
`bandedStock.js`'s `HALF_LIFE_BANDS` / `HALF_LIFE_WEEKS`** — the estate's one half-life
vocabulary, and the volume's own clock clause already denominates staleness *"in weekly ticks
against each input ledger's own half-life"*. Band **spellings** are copied from
`negotiationPictures.js`'s ladders rather than invented (§3.9).

⛔ **If — and only if — the implementer measures that no existing family can express the
confidence ladder**, it takes **one module-local frozen `MIRROR_TUNING` object inside
`secondOrderBelief.js`**, on the `pactFormation.js` `F` idiom, marked
`⚠ UNSOAKED — rides the endgame tuning signature`, with **at most three values**.
⛔ **ZERO keys in any shared tuning table** (`BELIEF_TUNING`, `CREDIBILITY_TUNING`,
`LIE_TUNING`, `ALLY_INTEL_TUNING`, `SECRECY_TRADE_TUNING`) and **ZERO in `simulationRules`**.
Touching a shared tuning table is a tuning act and tuning is owner-signed.
⚠ **Any value that does land is CHAIR-OWED: the implementer reports the measurement and
STOPS; the chair authors the number and marks it `⚠ UNSOAKED`.** The implementer may neither
tune it nor add a fourth.

### 6.7 The phrase scan — Law One, and IN-1 MINTS THIS IDIOM

⚠ **MEASURED: no phrase-scan idiom exists in the estate.** There is no `FATE_VERBS`,
`BANNED_WORDS`, `FORBIDDEN_PHRASES` or `PHRASE_SCAN` constant anywhere. **IN-1 is minting it.**

**The precedent to copy is `heraldCausalVoice.test.js` + `heraldCausalGrammar.js`:** the
forbidden list is **EXPORTED FROM THE SOURCE MODULE** (`FOLLOWED_FORBIDDEN`,
`CHAIN_END_BANNED`) so the pin can assert it non-empty before every exclusion; single tokens
are checked by word-split, multi-word phrases by lowercase `includes`.

**IN-1a's share of it, and only this:**
- Export `MIRROR_PERCEPTION_BANNED = Object.freeze(['believe','believes','thinks','perceive','in their eyes'])`
  from `secondOrderBelief.js`, assert it non-empty, and scan the leaf's **own `basis` token
  vocabulary** and **`MIRROR_BANDS`** against it. `'in their eyes'` needs the lowercase-
  `includes` form; the single words need the word-split form.
- ⛔ **The RENDERED-SURFACE scan is IN-1b's**, and deliberately so: **a rendered-surface
  negative passes when the surface never rendered** (the estate's recorded second-vacuity
  class). IN-1a renders nothing, so a rendered scan here would be a green pin over an empty
  set.
- ⚠⚠ **The leaf's and the test's COMMENTS must not spell a banned word**, because
  `negativeAssertionAnchor.walker.test.js` scans comment text (§3.10). Paraphrase.

---

## 7. Exact change manifest

| Action | File | Symbol / region | Max Δ | Instruction |
|---|---|---|---:|---|
| `CREATE` | `src/domain/worldPulse/secondOrderBelief.js` | `MIRROR_BANDS`, `MIRROR_STALENESS_BANDS`, `MIRROR_UNKNOWN`, `MIRROR_PERCEPTION_BANNED`, `secondOrderBeliefActive`, `mirrorInputsAt`, `secondOrderMirrorOf` | `210` | §6.1–6.3, §6.6–6.7. **PURE.** Imports **exactly** `./bandedStock.js`, `./beliefMap.js`, `./outboundImpression.js`. ⛔ Must not contain the literal `.npcs` anywhere, including a comment (§8 item 5). |
| `REGISTER` | `src/domain/worldPulse/simulationRules.js` | `ENGINE_GATED_VIRTUAL_RULE_KEYS` | `12` | §6.5 step 2. Alphabetical insert + the house comment. ⛔ Nothing else in this file moves. |
| `REGISTER` | `src/domain/certification/subsystemRowsVirtual.js` | `VIRTUAL_SUBSYSTEM_ROWS` | `60` | §6.5 step 3. AUTHORED row, three aliveness arrays empty, `soakEvidence: 'unobserved'`. |
| `CREATE` | `tests/domain/secondOrderBelief.test.js` | C1–C7 | `n/a` | ⚠ **Name and site it exactly as given** — §8 item 2. Straight-line registration only — §8 item 1. |
| `CREATE` | `tests/property/secondOrderBeliefDormancyFence.test.js` | FENCE 1–4 + LIT-MUTANT | `n/a` | §6.5 step 6, on `pactFormationDormancyFence.test.js`. |
| `TEST` | `tests/domain/subsystemRowsVirtual.test.js` | the named const, `VIRTUAL_RULES`, `LANE_LEAVES` | `n/a` | §6.5 step 4. All three move together or two of them red. |
| `TEST` | `tests/lint/couplingInclusion.walker.test.js` | `LAYER_PATTERNS.INFO` | `n/a` | §6.4. **ONE exact-path regex + its written reason.** ⛔ No baseline edit, no argued entry. |
| `TEST` | `tests/lint/sovereigntyLightingContract.walker.test.js` | the `CENSUS` row + a dated comment | `n/a` | Re-derive all five WHOLE in ONE run and re-record whole, cause stated — §8 item 3. ⛔ Subject to the foreign-title STOP. |

**These eight handwritten paths are IN-1a's complete reserved change set**, plus the generated
bundle artifacts. `PACKET_MANIFEST.json` carries exactly them, spelled identically.
⚠ **The three `CREATE` spellings become existence-checked at the LANDED flip**
(`scripts/implementation-packets.mjs:466-468`), so a rename during implementation must move
the manifest row in the same change.

**Named do-not-touch:** `src/domain/worldPulse/outboundImpression.js` (pinned ZERO-IMPORT
contract), `src/domain/worldPulse/bandedStock.js`, `src/domain/worldPulse/beliefMap.js`,
`src/domain/worldPulse/informationStatecraft.js`, `src/domain/worldPulse/generosityKernel.js`,
`src/domain/worldPulse/pulseKernel.js`, `src/domain/worldPulse/applyWorldPulse.js`,
`src/domain/worldPulse/pulseStageManifest.js`,
`src/domain/worldPulse/ledgerOwnershipManifest.js`, `src/domain/realm/heraldRouting.js`,
`src/domain/display/settlementRumors.js`, `src/domain/display/rumorPhrasePools.js`,
`docs/content/RECEIPT_POOLS_INFORMATION.md`, `tests/helpers/receiptAnnex.js`,
`src/lib/spatialUsage.js`, `scripts/.size-baseline.json`,
`scripts/.test-ratchet-baseline.json`, `scripts/mutation-coverage-manifest.json`,
`scripts/.observed-shape-readers-baseline.json`,
`tests/lint/observedShapeReaders.walker.test.js`,
`tests/lint/.coupling-inclusion-baseline.json`,
`tests/lint/.coupling-unlayered-baseline.json`,
`tests/fixtures/mechanism-lit-coverage-baseline.json`, `eslint.config.js`, `vite.config.js`,
and every file outside the table above.

### 7b. Reservations and pairwise disjointness — RE-CHECKED AT PROMOTION, at `ba219802`

| Reserver | Status | Paths | Overlap with IN-1a |
|---|---|---|---|
| **Every packet in `PACKET_MANIFEST.json` except IA-2** | **LANDED** | — | ✅ **NONE — a terminal packet reserves nothing** (`scripts/implementation-packets.mjs:43`). **MEASURED at promotion by enumerating the manifest: the only non-terminal row is IA-2.** |
| **IA-2** | STALE | `package.json`, `scripts/implementation-packets.mjs`, `scripts/implementation-gate.mjs`, `scripts/implementation-session.mjs`, `tests/scripts/implementation{Packets,Gate,Session}.test.js`, `docs/implementation/{PACKET_MANIFEST.json,PACKET_STANDARD.md,PACKET_TEMPLATE.md,INDEX.md}`, `docs/implementation/packets/infrastructure/IA-2.md` | ✅ **ZERO — all twelve enumerated and intersected against IN-1a's eight.** ⚠ STALE still reserves. This packet's own INDEX/manifest rows are **coordinator acts**, not change-manifest rows — the TC-5B precedent. |

⭐ **THE CENSUS WALKER IS FREE AND IN-1a TAKES IT.** The index named `GR-4b`, but `GR-4b`
LANDED at `dd457b9a`. **MEASURED AT PROMOTION: the census walker appears in no non-terminal
packet's change manifest.** IN-1a adds test titles and therefore moves `titles`/`suiteTitles`
(serialization-law rule 5: file placement does not exempt), so it takes the walker as its own
`TEST` row and re-derives the census WHOLE in-change. ⛔ **IN-1a is the sole in-flight holder**,
and the moment a second non-terminal packet is promoted the chair moves the row.

---

## 8. Landing discipline this manifest incurs — SIX obligations, all measured

1. ⚠⚠ **THE PARKED-SUITE TRAP, AND IT TAKES THE WHOLE FILE.** A `test(`/`it(` registered
   inside a loop is `TEST_UNREGISTERED` and **the WHOLE FILE parks**, losing every other title
   in it (`sovereigntyLightingContract.walker.test.js:1266-1271`); a `describe` whose body is
   not straight-line parks the same way; `.each()` parks via `TEST_TABLE_UNPROVEN`. **This bit
   TC-5a — `townCartographyPaint.test.js` scored 0 live titles against 34 real tests.**
   ⇒ Register every case **straight-line**; loops go **inside** an `it`, never around one.
   **Verify `credited` moved, not just `files`.**
2. ⚠ **THE MUTATION-COVERAGE NAMING TRAP.** `tests/lint/mutationCoverage.shared.mjs:27-39`
   makes a file an invariant automatically by living in one of seven enforcer dirs **or** by a
   basename matching
   `census|scan|baseline|ratchet|walker|killlist|parity|coverage|governance|freshness|integrity|exhaustiveness|roundtrip|golden|contract|pin`.
   `secondOrderBelief.test.js` and `secondOrderBeliefDormancyFence.test.js` match **none** and
   sit outside the enforcer dirs, so **no manifest entry is owed.** ⛔ **That dodge is
   load-bearing and is lost to a rename** — do not call either one `...Pins.test.js`,
   `...Contract.test.js` or `...Scan.test.js`, and do not site them under `tests/lint/`.
   ⛔ **`scripts/mutation-coverage-manifest.json` is NEVER re-serialized** (recorded estate
   hazard) — rename the test instead.
3. ⭐ **THE LIGHTING CENSUS.** Re-derive **all five figures in ONE run and re-record them
   WHOLE** — never patch `files` alone. All five arms are `.toBe(...)` exact equality plus a
   `parked + credited === files` cross-check. ⚠ **The sequence hazard is live:** while any arm
   is red the census **stops measuring**, so later arms may read anything. ⭐ Probe with a
   temporary `console.log` **inside the existing census test, before its first assertion**, so
   it mints no title and cannot move what it measures. ⛔ **STOP conditions:** a foreign lane
   holding uncommitted test titles at re-record time; a census already red at pristine
   committed base from a foreign cause; or the chair not having confirmed this packet is the
   in-flight holder. **Never census a live shared tree, and never quantify a foreign lane's
   uncommitted delta.**
4. ⚠ **ANCHORED NEGATIVES — AND THE WALKER READS COMMENTS.**
   `negativeAssertionAnchor.walker.test.js` gives a **new file ZERO**; the three counted
   matchers are `.not.toContain(`, `.not.toMatch(`, `.not.toHaveProperty(`, and the
   `// anchored:` escape is accepted on the assertion line or the **single** line immediately
   above. Route every negative through `tests/helpers/anchoredNegatives.js`.
   ⚠⚠ **Quoting a matcher inside a comment registers a fresh violation** — measured
   2026-08-06 at `brokeragePlantHandoffPins.test.js:846-849`. Paraphrase; never quote.
   Separately, `scripts/.test-ratchet-baseline.json` is at **16 of ceiling 17** — land with
   **no** new baselined failure, and never raise `CEILING`.
5. ⛔⛔ **THE `.npcs` TOKEN CONVICTS A NEW `worldPulse` LEAF — IN A COMMENT.**
   `tests/domain/roadsParticipation.test.js` executes
   `grep -rl '\.npcs' src/domain/worldPulse src/domain/spatial` and asserts the result set
   `toEqual` `[...EXPECTED, ...UNDISPOSITIONED_NPCS_READERS]` — **RAW TEXT, EXACT SET
   EQUALITY**, with `UNDISPOSITIONED_CEILING = 7` and the quarantine at exactly 7.
   ⇒ **`secondOrderBelief.js` must not contain the string `.npcs` ANYWHERE, including a
   docblock.** ⛔ **Reword; never widen the scan and never add a quarantine row.**
6. ⚠ **WHAT IS NOT OWED, measured so nobody "helpfully" edits it:** `src/lib/spatialUsage.js`
   (no new `spatialLedgers` key — the leaf writes nothing); `ledgerOwnershipManifest.js` (no
   writer identity changes); `pulseStageManifest.js` (no stage or substage);
   `tradeConvergenceContract.js` and `warConvergenceContract.js` (the flag is neither a trade
   precondition nor a war-lighting conjunct); `tests/lint/.coupling-inclusion-baseline.json`
   (all three imports are INFO or unlayered, so the leaf mints no pair);
   `src/domain/certification/couplingRegistryInfo.js` (no cross-layer pair ⇒ no row owed).
   `scripts/.test-ratchet-baseline.json`'s scope figures move via `--update` only.

---

## 9. Acceptance matrix — the closed denominator (7 of 8)

| ID | Case | Required observation |
|---|---|---|
| **C1** | **Main reachable behavior** | Lit; a world where settlement `s` has a `disinfo` row `{liarId:'s', subjectId:'s', audienceId:'o', assertedBand, seededTick}`. `secondOrderMirrorOf(mirrorInputsAt(world,'s','o',now))` returns a frozen record whose `strengthShown` is the banded latest assertion, whose `lastShownTick` is `seededTick`, whose `staleness` is a `MIRROR_STALENESS_BANDS` member derived from `now - seededTick`, and whose `basis` names the deriving channel. |
| **C2** | ⭐ **THE EMPTY-RECORD NEGATIVE, with its seeded sibling** | Zero outbound rows toward observer `o` ⇒ `MIRROR_UNKNOWN`: every `*Shown` key `'unknown'`, `lastShownTick: null`, `confidence` at the zero band — **never a fabricated band**. ⛔ The SAME test seeds a **non-empty sibling** observer `p` in the same world and asserts a real band, so the negative cannot pass on an empty world. |
| **C3** | ⭐ **THE REVERSAL PIN (the hardest)** | On a REAL fixture, adding leg-(b) evidence (an envoy encounter of OUR errand with `state:'intercepted'`) drives `confidence` **measurably DOWN** against the identical world without it; and the same is shown independently for leg (c). ⛔ **The direction pin rides here:** the mirror-relevant intercept is one of OUR errands (`from === us`) taken by THEM (`interceptorId === observer`), and the inverted fixture must NOT degrade. ⛔ If neither leg fires from a real fixture, **STOP**. |
| **C4** | **Frozen shape + closed vocabulary (the cross-program pin)** | `Object.keys(...)` `toEqual` the exact eight-key list, sorted; the record and its `basis` array are frozen (`Object.isFrozen`); every band value is a member of its declared ladder. This is coupling manifest row 14's PRE-PIN. |
| **C5** | **Sparse / malformed-but-supported + the adapter contract** | `mirrorInputsAt` on a world with a **live-tick** `intelTransfers` row `{sellerId:'s', receiverId:'o', belief, fidelity01, depositTick: now}` produces a `transfers` entry spelled `{toId:'o', strengthBand:…, tick: now}` and `secondOrderMirrorOf` consumes it; and a world with a **prior-tick** transfer produces **none**, because the ledger prunes (§3.8 premise 1, asserted rather than assumed). Missing ledgers, non-array rows and non-string ids all answer `MIRROR_UNKNOWN` without throwing — including the arm where a clamped input would otherwise reach `halfLifeWeeksOf`, which throws. |
| **C6** | **Determinism + lifecycle round trip** | Two identical inputs yield **byte-identical** mirrors (`JSON.stringify` equality); and a world that has been through a **JSON save/load round trip** yields a mirror byte-identical to the pre-round-trip one — the volume's "no persisted state" clause proved rather than asserted. |
| **C7** | **The K3 privacy boundary + guard-the-guard** | `secondOrderMirrorOf`'s signature is asserted to take **no `worldState`**; the allow-list source scan `toEqual`s the three-module reviewed set; the leaf's `beliefRecord(` call count is exactly **1** and its argument order is `(worldState, selfId, observerId`; the observer-slot token scan finds nothing in the leaf **and DOES flag `beliefMap.js`** (the positive control); and the `MIRROR_PERCEPTION_BANNED` scan over `basis` and `MIRROR_BANDS` is clean while a fixture string containing a banned word IS flagged. |

**C8 (a duplicate/idempotent write case) is OMITTED, not replaced** — IN-1a writes nothing, so
there is no idempotency to assert. ⛔ **Do not add an eighth case or a speculative
cross-product.**

### 9b. LIT-OUTPUT POSTURE — declared, not discovered

> **In a world that never lights `secondOrderBeliefEnabled`: NOTHING MOVES, and that is an
> assertion.** The key is absent from `DEFAULT_SIMULATION_RULES` and every preset by
> construction, so the dark path holds by **three independent mechanisms**, and this packet
> requires all three: (1) **the gate** — `secondOrderBeliefActive`, the single strict
> `=== true` by-name read; (2) **the empty-record floor** — even lit, an observer with no
> outbound record yields `MIRROR_UNKNOWN`, held by the data shape rather than by a branch;
> and (3) ⭐ **THE STRUCTURAL ONE, stronger than either: after this packet the mirror has ZERO
> production callers**, so no engine path can reach it at all.
>
> **In a world with `secondOrderBeliefEnabled` lit: STILL NOTHING MOVES**, for the same
> structural reason. IN-1a is the rare flag wave that is byte-identical in **both** flag
> states — a property IN-1b will legitimately end, and one this packet asserts rather than
> assumes.
> ⚠ **Figures permitted to move, each re-recorded whole with the cause stated:** the five
> lighting-census numbers; `scripts/.test-ratchet-baseline.json`'s scope figures via
> `--update`; and the five generated edge bundles. ⛔ **Everything else moving is a STOP** —
> including `tests/fixtures/mechanism-lit-coverage-baseline.json`, which the lit-mutant's
> credit is intended to cover; if it does not, **report, do not edit it**.

---

## 10. Verification commands

```sh
# B1–B3, B10 baselines — the test slot is acquired in the same chain, never observed and released.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/outboundImpression.test.js tests/domain/subsystemRowsVirtual.test.js \
  tests/property/believedWorldAxesDormancyFence.test.js tests/domain/roadsParticipation.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/engineGatedRuleKeys.walker.test.js \
  tests/lint/subsystemCertificationTotality.walker.test.js \
  tests/property/mechanismLitCoverage.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/couplingInclusion.walker.test.js tests/lint/couplingDesk.walker.test.js

# Focused behavior — C1..C7.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/domain/secondOrderBelief.test.js \
  tests/property/secondOrderBeliefDormancyFence.test.js \
  tests/domain/outboundImpression.test.js

# The walkers this packet can break — all exact-equality pins.
sh scripts/gate-mutex.sh --run -- npx vitest run \
  tests/lint/couplingInclusion.walker.test.js \
  tests/lint/engineGatedRuleKeys.walker.test.js \
  tests/lint/subsystemCertificationTotality.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js \
  tests/lint/testRatchet.test.js \
  tests/domain/roadsParticipation.test.js \
  tests/property/mechanismLitCoverage.test.js

# The generated-artifact half.
npm run build:edge-shared
sh scripts/gate-mutex.sh --run -- npx vitest run tests/edgeFunctions/

npx eslint src/domain/worldPulse/secondOrderBelief.js \
  src/domain/worldPulse/simulationRules.js \
  src/domain/certification/subsystemRowsVirtual.js

npm run typecheck:ratchet          # tsconfig.full.json
npm run typecheck:domain:strict    # tsconfig.domain-strict.json

# Census re-derivation (§8 item 3), then the landing gate.
npm run check:tail
```

⚠ **Never read a gate through a pipe** — `npm run check:tail`, or
`sh scripts/gate-tail.sh <command...>`; a piped read reports the PIPE's status and has
greenwashed red gates twice. `npm run check` is a **17-step `&&` chain**: a red step blacks
out every later step, so the receipt must say **which steps actually ran**. **Trust no exit
status you did not capture yourself.**
⚠ **Budget the wall-clock:** `observedShapeReaders.walker`'s `beforeAll` is sized to 900 s
because it measures ~264 s contended. A timeout there skips all its tests and then trips the
test ratchet's skip sentinel — a cascade that looks like a defect and is not.

---

## 11. Ordered coding sequence

0. Run §5 preflight, including the three **COUNT, NEVER INHERIT** figures and the §3.8
   premise-1 re-measure. Stop on any mismatch, and on any porcelain entry that
   `git diff HEAD` does **not** show as empty.
1. Capture B1–B3, B9, B10 and B11 **before the first edit**.
2. Add the smallest failing focused test — **C2, the empty-record negative with its seeded
   sibling** — before `secondOrderBelief.js` exists.
3. Implement the leaf: the gate read first (§6.5 step 1), then `MIRROR_UNKNOWN` and the
   ladders, then `mirrorInputsAt`'s adapter, then the composition of `outboundImpressionOf`,
   then banding/staleness, then the two degradation legs. **Purity, the frozen shape and the
   no-worldState signature are properties of the first draft, not a later pass.**
4. Make C1, C4, C5, C6 green.
5. Make **C3** green — both legs, both directions. ⛔ Stop here if neither fires.
6. Land the CQ5 trio **in the order of §6.5 steps 2→4**, then the layer-map row (step 5).
7. Author the four-fence file with its lit-mutant (step 6); make C7 green.
8. `npm run build:edge-shared`; run `tests/edgeFunctions/`.
9. Run §10's focused checks and every named walker — **especially
   `tests/domain/roadsParticipation.test.js`** (§8 item 5).
10. Re-derive and re-record the lighting census WHOLE (§8 item 3), or STOP per its conditions.
11. Run the wave-end gate and produce the completion receipt: exact deltas, both typecheck
    windows named with their configs, which of the 17 gate steps ran, the census row
    before/after with this packet's delta attributed **in isolation against a named committed
    sha**, the generated-bundle artifact delta, the manifest key count before/after
    (15 → 16), and `deviations: NONE` or a STOP.

⛔ **Do not start by changing a golden, baseline, budget or persisted shape.**

---

## 12. Chair rulings — CR-IN1-1 through CR-IN1-7, ALL CLOSED

⭐ **All seven of Lane AG's open items are RULED (chair, 2026-08-12). No open item remains,
which is what makes this packet READY.** The chair for this promotion is Fable, so these
rulings carry **no Fable-validation debt**; the packet records that rather than assuming it.

**CR-IN1-1 — IN-1a SHIPS ALONE, PRODUCER-FIRST (Q1).**
Grounds: producer-first is the estate's own ruling (CR-GR4-1's corollary; the ES-7 refusal is
the price of the other order); it is the only shape that makes the dark path byte-identical
**by construction**; and the orphan window is bounded by compiling IN-1b immediately after
under the just-in-time rule. **The split is recorded on the five refutation grounds R1–R5
(§-1).** **Alternative REJECTED:** folding IN-1b in costs one user-facing surface, a display
leaf and the `mirror_standing_line` pool, and it puts a UI file and a content pool inside a
flag-mint commit — exactly the combination CQ5's staging law punishes.

**CR-IN1-2 — THE THREE-ARM FENCE, AND THE SEVENTH FAMILY IS DEFERRED (Q2).**
**MEASURED: the volume's allow-list, alone, cannot enforce K3** — the legal and forbidden
belief reads are the same function with swapped arguments (§3.2, §6.2). **RULED: the
THREE-ARM fence of §6.2 — structural (no `worldState` in the derivation), allow-list
`['./bandedStock.js','./beliefMap.js','./outboundImpression.js']`, plus the argument-order
scan — and the SEVENTH FAMILY (J-INA-5's negotiation pictures) IS DEFERRED to IN-1b/IN-1c
with its measurement written down.** All three picture modules are GRAMMAR-layer, so
admitting the seventh family would mint cross-layer pairs whose registry rows must name
receipt addresses this packet does not write — the exact defect
`IN0A_PLANT_HANDOFF_COUPLING`'s own repair note records.
⭐ **THE PROMOTION-TIME VERIFICATION THIS RULING REQUIRED IS DISCHARGED IN §3.3:** the
ARGUED_UNLAYERED classification of `bandedStock.js` and the unlayered-skip in
`scanCrossLayerPairs()` were both re-read at `ba219802`, so **zero coupling rows** is measured,
not asserted.
⚠ The volume's fence sentence is reconciled in this same promotion change, so a later reader
does not build to a fence that no longer describes the leaf.

**CR-IN1-3 — THE EXPORT SPELLING IS `secondOrderMirrorOf` (Q3).**
`npcLadderState.js:899` exports `mirrorOf` and `npcLadderKernel.js` consumes it; a third is
module-private in `urbanFabricKernel.js`. **CONFIRMED.** **RULED: RENAME.** Grounds:
**CR-C4-1 is squarely on point.** `postureNameCollision.walker.test.js`'s header records the
chair ruling that *"two exports of one name in one domain tree is a defect with no runtime
symptom"* and that SP §11 Q2's *"module scoping disambiguates"* was **overruled**, because
*"a disambiguation that lives in the reader's head is not enforcement."* Taking the same trade
twice, in the same directory, months after the chair refused it, is the expensive kind of
consistency. ⭐ The rename is cheap because coupling manifest row 14 pins the SHAPE, not the
spelling (§3.5). **Alternative REJECTED:** keeping `mirrorOf` and qualifying every address as
`secondOrderBelief.js#mirrorOf` is precisely SP §11 Q2's overruled position.
⚠ **Dated corrections land in `DESIGN_FP_ARCH_IN.md` and `DESIGN_FP_INFORMATION.md` in this
promotion change.** `DESIGN_FP_ARCHITECTURE.md` §9 row 14 and `:472` / `:1196` still spell
`mirrorOf`; that file is **outside this promotion's authorized scope**, so the correction is
**recorded as owed, not silently taken** — see §13 D3's note.

**CR-IN1-4 — ZERO NEW TUNING KEYS (Q4).**
Derive staleness from `bandedStock.js`'s `HALF_LIFE_BANDS`/`HALF_LIFE_WEEKS`; copy band
spellings from `NEGOTIATION_SUBJECT_BANDS`' ladders. ⚠ **If the implementer measures that the
confidence ladder cannot be expressed from an existing family, the value is CHAIR-OWED**: the
implementer reports and stops; the chair authors a module-local frozen `MIRROR_TUNING`, at
most three values, marked `⚠ UNSOAKED — rides the endgame tuning signature`. The implementer
may neither tune them nor add a fourth. ⛔ Zero keys in any shared tuning table and zero in
`simulationRules`.

**CR-IN1-5 — SPINE 13 IS DECLARED-EMPTY, WITH REASON (Q5).**
**"The mirror reads records, not souls."** The design's own wording, and it survives
measurement: the derivation is arithmetic over ledgered acts we ourselves performed, and
colouring it by `lawfulness01`/`malice01` would price the *observer's* character into *our*
record of *our own* sendings — a category error. **WRITE-side: none** — the leaf moves no
constituent, roster or institution and mints no settlement-alignment stock.
⚠ Carried correction, recorded not taken: `DESIGN_FP_SPINE.md` requirement 13 cites
`alignmentOf` at `beliefMap.js:915` / `informationStatecraft.js:584`; **both are injection
sites, not definitions** — the exports are `computeLawfulness` / `computeMalice` in
`disposition.js`. That file is outside this promotion's authorized scope.

**CR-IN1-6 — SPINE 14 IS ENGINE-ONLY, RECORDED (Q6).**
Requirement 14 permits *"a RECORDED decision ('engine-only, because X'), never silence."*
**Because X:** IN-1a ships **no player/DM-visible state at all** — no persisted record, no
receipt, no surface — so there is nothing for a pen to edit; and the mirror is a derivation
over acts the DM can already edit through their existing verbs (the plant commission, the
intel transfer, the treaty disclosure), so a verb here would let a DM write a conclusion that
contradicts its own premises. **The read-only DM expansion "which acts built this picture" is
IN-1b's**, and requirement 14's obligation re-attaches there.

**CR-IN1-7 — DURABLE FAMILIES ONLY; THE PERSISTED-FAMILY ALTERNATIVE IS REFUSED (Q7).**
**MEASURED: `intelTransfers` is pruned every tick; ally shares are never ledgered; exposure
receipts are one-shot news** (§3.8). The volume's *"Each input already ledgered, already
decaying"* is false for three of seven families, and the staleness clock rests on it.
**RULED: DERIVE FROM THE DURABLE FAMILIES ONLY, AND NAME THE TRANSIENT ONES AS RECORDED
DEFERRALS WITH THIS MEASUREMENT ATTACHED.** In IN-1a that means: plants (`seededTick`) and the
HIDE posture (`enteredTick`) carry `lastShownTick` and `staleness`; the transfer channel
contributes to *this tick's* picture only and is documented as **live but memoryless**; the
share channel is `[]` with its reason in the header; degradation leg (a) is deferred with its
measurement. **The alternative — opening a durable outbound-transfer record — is REFUSED
here:** it is a **new persisted family**, an owner-gated persistence-shape act, a change to
the D-3 single-writer contract, and a larger packet. A later wave may take it to the owner;
IN-1a may not. ⚠ **The correction is written into `DESIGN_FP_INFORMATION.md` and
`DESIGN_FP_ARCH_IN.md` in this promotion change**, because IN-1b, IN-1c, IN-3's mirror-gap
arm and GRAMMAR's negotiation-posture consumer are all being built against a sentence that is
false today.

---

## 13. Recorded deviations from design prose (each vetoable)

| # | Design says | Live code says | Resolution |
|---|---|---|---|
| **D1** | IN-1 is one wave: a pure module **plus** `mirror_shift` at mint **plus** the dossier standing line | three behavior families; a pure module cannot mint a hum; `HERALD_SECTIONS` is the frozen SIX with **no knowledge desk** while all three IN-1 pools are headed "Herald knowledge desk"; a kind costs five registration files (IN-0C's measured override) | **Refused and split three ways at CR-IN1-1** — §-1. The interim desk is a **chair declaration** on the `plant_took: 'war'` / J-IN0A-3 precedent, owed at IN-1c. |
| **D2** | the shape carries `wealthShown` and `devotionShown` as live bands | `outboundImpressionOf` derives **strength** and **allianceLabel** only; the wealth/devotion substrate is absent. ⚠ **`believedScarcityEnabled`/`believedDevotionEnabled`/`believedConditionsEnabled` DID land in the manifest at SP-B**, so the substrate question is live rather than settled | **Keys MINTED in the frozen shape, answering `'unknown'` at this HEAD.** Minting now is what keeps row 14's shape stable across IN-2; widening a frozen cross-program shape later is the expensive act. ⚠ **VERIFY-AT-BUILD**; if either is reachable, **STOP and report**. |
| **D3** | export `mirrorOf` | `npcLadderState.js:899` already exports `mirrorOf`, consumed by `npcLadderKernel.js` | **RENAMED to `secondOrderMirrorOf` at CR-IN1-3.** Dated corrections land in `DESIGN_FP_ARCH_IN.md` and `DESIGN_FP_INFORMATION.md` in this promotion change. ⚠ **`DESIGN_FP_ARCHITECTURE.md` (`:472`, `:1196`, `:2632` row 14) still spells `mirrorOf` and is OUTSIDE this promotion's authorized scope — the correction is OWED, recorded here so it cannot ghost.** Row 14 pins the SHAPE, so the packet is unaffected. |
| **D4** | the mirror derives from seven families, the seventh being WR-7b's negotiation pictures (J-INA-5) | all three picture modules are **GRAMMAR-layer**, so each import is a licensed-coupling act | **Deferred with its reason written down at CR-IN1-2** — §12. |
| **D5** | (the IN volume and architecture were SILENT on it) | **SP-B landed `outboundImpression.js`, whose header names IN-1's mirror as its one intended consumer, and it has ZERO production consumers** | **Composed, never forked.** ⭐ The dated correction lands in `DESIGN_FP_ARCH_IN.md`'s IN-1 block **in this promotion change**; a lane reading only the IN volume would have hand-rolled a second derivation. |
| **D6** | (`INDEX.md` header) measured at `32f4e520` | HEAD is `ba219802`; three commits landed since the header was stamped | **Index restamped to `ba219802` by the chair in this promotion change.** A packet's verified base is git, never the index header. |
| **D7** | *"Each input already ledgered, already decaying"* | **`intelTransfers` PRUNES every prior-tick row** (`generosityKernel.js:1276-1285`, verbatim *"consumed ⇒ prune"*) | **Code wins.** The transfer channel is **live but memoryless**; staleness derives from the durable families — CR-IN1-7. Dated correction in both IN documents in this change. |
| **D8** | ally shares and exposure receipts are ledgered inputs | `applyAllyIntelSharing` builds a **transient Map**, never a ledger; `infowar_lie_exposed` is a **one-shot news entry**; `bluffExposures` is module-private and drained next tick | **Code wins.** The share channel is `[]` and degradation leg (a) is **deferred with its measurement** — §6.3, CR-IN1-7. |
| **D9** | *"our own HIDE spans (a sealed season lowers confidence)"* reads as per-counterpart | `spatialLedgers.secrecyPostures` is `{level01, enteredTick}` **per settlement** — there is no per-counterpart seal | **Code wins.** `sealed` is derived from the settlement-wide posture, and the packet says so in those words rather than implying a granularity the ledger does not hold. |
| **D10** | `outboundImpressionOf` consumes the ledger rows directly | its input typedefs are **caller-shaped** and mismatch `intelTransfers` on three field names, and `sealed` is a boolean where the posture is an object | **IN-1a owns a named ADAPTER** (§6.1), pinned by C5. ⛔ Never an edit to SP's leaf. |

---

## 14. Mandatory STOP conditions

In addition to `PACKET_STANDARD.md` §"Mandatory STOP conditions", stop — without expanding or
repairing — when:

- ⛔ **`tests/lint/.coupling-unlayered-baseline.json` would need a line**, or
  `ARGUED_UNLAYERED` a fourteenth entry. Both doors are shut (§3.3, §6.4); the layer row is
  the only lawful cure.
- ⛔ **The leaf needs a FOURTH import**, or any import outside the ruled allow-list. That is a
  coupling act and it is the chair's (CR-IN1-2).
- ⛔ **`secondOrderMirrorOf` would need `worldState`.** That collapses the fence's structural
  arm to a scan, and the scan is the arm that cannot see an argument.
- ⛔ **`tests/domain/roadsParticipation.test.js` reds** — the leaf contains `.npcs` somewhere,
  including a comment. Reword; never widen the scan.
- ⛔ **NEITHER degradation leg fires from a real fixture** (C3). The mirror would be a
  ratchet, and a green pin over a dead arm is worse than no pin.
- ⛔ **The measured intercept direction is the opposite of §3.2 leg (b)**, or the inverted
  fixture also degrades. That is a premise refutation, not a fixture to flip.
- ⛔ **`outboundImpression.js` would need any edit at all** — its ZERO-IMPORT contract is
  pinned and it is SP's file.
- ⛔ **A second `=== true` read of `secondOrderBeliefEnabled` appears anywhere**, or the read
  is not by name. Two doors on one flag is how a deleted guard hides behind a surviving one.
- ⛔ **The certification row would be parked as PENDING.** There is no such state for a
  virtual key.
- ⛔ **`tests/fixtures/mechanism-lit-coverage-baseline.json` would need a hand edit.**
- ⛔ **`npm run build:edge-shared` emits an artifact set the packet did not predict**, or
  emits nothing. Report the delta; never hand-edit a generated bundle.
- ⛔ **`intelTransfers` is measured NOT to prune at preflight** (§5's `consumed ⇒ prune`
  grep). That refutes D7 and re-opens CR-IN1-7 — report, do not re-plan.
- ⛔ **A tuning value proves unavoidable** (§6.6). Report the measurement and stop; the number
  is the chair's.
- ⛔ **Any new persisted key, `spatialLedgers` sub-key, writer, stage, Herald kind, receipt
  pool, PRNG draw or clock read** becomes necessary.
- ⛔ **A foreign lane holds uncommitted test titles at census re-record time**, or the chair
  has not confirmed this packet is the in-flight census holder.
- ⛔ **A ratchet, baseline, budget, timeout or ceiling would need raising.** Never raise one
  to finish a packet.
- ⛔ **Any porcelain entry at preflight is NOT explained by `git diff HEAD` being empty** —
  that is real foreign WIP; reserve it, do not work around it.
- **Any packet premise here is refuted by live code. The code wins; the packet stops.**

The STOP report contains the smallest measured contradiction, the evidence, and a proposed
split. It contains **no speculative repair**.

---

## 15. Author and promoter posture (read this before trusting a figure)

**Lane AG, the compile lane, at `b5442c07`:**

- **CONFIRMED** — measured by executed read / grep / `node -e` in this worktree:
  the four predecessor module-evidence rows; the porcelain-vs-`git diff HEAD` split;
  `outboundImpression.js`'s existence, exports, return shape, zero production consumers and
  pinned zero-import contract; the layer-pattern non-match for `secondOrderBelief.js` and the
  GRAMMAR/INTERIOR classification of every candidate import; the unlayered baseline at 179
  against an exact ceiling of 179; the manifest at 15 keys; the ratchet at 16 of 17; the
  census five-tuple; `HERALD_SECTIONS`' frozen six; the `mirrorOf` name collision and
  CR-C4-1's overruling of module scoping; the `.npcs` raw-grep exact-set census; the
  `intelTransfers` prune (`generosityKernel.js:1276-1285`, read verbatim); `bandedStock.js`'s
  exports and its throwing accessors; the absence of any phrase-scan idiom in the estate.
- **PLAUSIBLE** (reasoned or single-source, not executed): the projected line counts; that
  ally shares leave **no** durable trace anywhere (§3.8 premise 2 — VERIFY-AT-BUILD); that
  `build:edge-shared` emits exactly five bundles (five bundle files exist and the estate's
  recorded law says five — the implementer measures the real delta); the exact row shape of
  the envoy-encounter intercept fields.
- **NOT RUN:** no test, build, gate, lint or typecheck command was executed.

**Lane AI, the promotion lane, at `ba219802` — what it re-measured rather than inherited:**

- **CONFIRMED, executed at promotion:** the HEAD move `b5442c07 → ba219802` and the EMPTY
  `git log b5442c07..HEAD` over every substrate path in §3/§7, which is what makes `ba219802`
  an admissible unchanged descendant; `b5442c07` and `4c0f2f38` are both ancestors of HEAD;
  the manifest at **15** keys with `secondOrderBeliefEnabled` absent and the alphabetical slot
  between `pactFormationEnabled` and `sovereigntyTradeEnabled`; the unlayered baseline at
  **179**; the ratchet at **16**; the census five-tuple `2404 / 365 / 2039 / 19880 / 5609` at
  `:3951`; `bandedStock.js`'s `ARGUED_UNLAYERED` `substrate` entry and
  `scanCrossLayerPairs()`'s unlayered skip (**CR-IN1-2's promotion-time verification**);
  `beliefMap` and `outboundImpression` both named in the INFO regex at `:136`; that
  `secondOrderBelief` occurs in the tree **only** inside `outboundImpression.js`'s header
  prose; every `requiredSymbols` row present in its named file; and that the census walker is
  reserved by **no** non-terminal packet while IA-2's twelve paths intersect IN-1a's eight at
  **zero**.
- **NOT RUN by the promotion lane:** no test, build, gate, lint or typecheck command. Only
  `npm run validate:packets` was executed, before and after, with its exit status captured
  in-shell.
