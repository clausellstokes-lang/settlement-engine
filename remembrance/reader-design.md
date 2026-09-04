# READER DESIGN — the surface for what `warMemoryEnabled` already writes

Dock: `…/58f0a8e2-…/laneKERNELMARK-tree` @ `1223489c9`. Design only — nothing edited, nothing run.

---

## 0. FIRST: are the records sufficient to read from? **YES — with four named absences.**

The brief says stop and report if they are not. They are sufficient; but the SHAPE is wider than
the WRITER, and a reader built off the shape would promise fields nothing produces. Measured by
counting each field's mentions in `concludedWars.js` (the one writer) against
`concludedWarRecord.js` (the shape):

**Written on every record** — `schemaVersion`, `warId`, `originPair`, `originAttackerId`,
`openedTick`, `concludedTick`, `sealed`, `form`, `participants[]`, `casusReasons[]`,
`fact.{closed, closeRoad?, terminalOutcomes[], loserDied?, seatTransitionFamily?, treatyWritten?}`,
`victorId?`, `territorialOutcomes[]`, `cost.{attackerRemainingBand?, exhaustionBands{}}`,
`notableEngagements[≤5]`, `sacredAnchors?`.

**In the shape, produced by NOTHING** (writer mention count = 0 for each):
`fact.peaceReason`, `fact.coalitionFragmented`, `terms[]`, `lastStanding{}`,
`participants[].label`, `territorialOutcomes[].fallenSeatLabel`, `mutual`.
Two of those are load-bearing: `classifyWarEnding` earns `exhaustion` only from
`peaceReason === 'exhaustion'` (`warEndingClassifier.js:210`) and `fragmentation` only from
`coalitionFragmented === true` (line 206) — so **two of the eight endings are structurally
unreachable from this ledger today**. Also `form` is always `'full'` (never `'epitome'`) and
`warIdFor`'s `seq` leg is always `0`, so the reciprocal-siege disambiguation the id design
describes is never exercised. The reader must state these as absences, not fill them.

### The adapter the classifier needs, and why it is not optional

`classifyWarEnding(fact)` reads `fact.attackerId` to reconstruct a razing road
(`warEndingClassifier.js:185,197`). The record's fact block **does not store it** — deliberately;
`concludedWarRecord.js:254-256` says *"The read-side adapter derives them from the record's
orientation and pair — one home per datum."* So the reader must pass
`{ ...record.fact, attackerId: record.originAttackerId }`. Get this wrong and **every razing
reports `razing_road_unreconstructable`, taking its whole war to unclassified** — the failure the
record file warns about at line 551-556.

### ⚠ UNITS — the hazard this program has been bitten by, applied field by field

| field | unit / kind | what a consumer must do |
|---|---|---|
| `openedTick`, `concludedTick`, `participants[].joinedTick/leftTick`, `territorialOutcomes[].tick`, `notableEngagements[].tick`, `fact.terminalOutcomes[].tick` | **raw engine TICK** | §69.3 forbids a raw tick on player/public/PDF surfaces. Cure through `humanizeEngineTokens.tickCalendarLabel(tick)` / `tickDurationLabel(ticks)`. A DM-tool surface may show the counter with an in-file `prose-leak-allowance` record (the `LiveWarStatus.jsx` precedent). |
| `cost.attackerRemainingBand` | a **KEY** into the remaining-fraction ladder, never a phrase | resolve with `armyStrength.remainingStrengthPhraseFor(key)` |
| `cost.exhaustionBands[settlementId]` | a **KEY** into the war-weariness ladder | resolve with `warStatus.warExhaustionWordFor(key)` |
| `casusReasons[].score` | ⛔ **a raw, unit-undeclared control value** | **never print it.** It rode in verbatim from the deployment pin and is exactly the class the record's own doctrine (`concludedWarRecord.js:19-21`, "NO RAW CONTROL VALUES") refuses. It is present only because the pin was copied whole. |
| `casusReasons[].receipt` | ⛔ **free prose**, minted at tick time | never on a player/public surface; DM-only at most. It is the only prose in an otherwise prose-free record. |
| `fact.closeRoad`, `fact.seatTransitionFamily`, `notableEngagements[].kind`, `participants[].side`, `territorialOutcomes[].kind` | **closed-vocabulary TOKENS** | render through the estate's own registers; an unknown token is a FUTURE, not a fault (`concludedWarRecord.js:580-584`) — show it as unknown, never blank it |
| `notableEngagements[].sourceEventId` | a **SOFT pointer** into an 80-entry ring buffer | deep-link only while the referent lives; the epitome must stand alone (line 345-352) |

---

## 1. THE CANDIDATES

### ⭐ CANDIDATE A — **the Realm-summary seam** (RECOMMENDED)

A new pure display leaf `src/domain/display/warRemembrance.js` projects the ledger into typed,
band-resolved, tick-humanized rows; `collectRealmSummary` (`src/utils/generateCampaignPDF.js:761`)
gains a `wars` array beside its existing `sieges`/`weary`/`standings`; the painter
`buildLivingWorld` gains a **"Wars Remembered"** sub-head inside its existing *State of the Realm*
chapter, immediately after *War & Sieges*.

**Why this seam and no other.** `collectRealmSummary` is read by three of the walk's surface
documents at once — `worldbook.dm`, `worldbook.player` (via `collectWorldBook`'s `realm` chapter,
`generateWorldBook.js:243`) and `campaign-pdf` (`readerCorpus.mjs:681,686,693`). One collector
change lights the war-memory questions on three surfaces in one act, with no new document, no new
corpus row and no rubric change.

**Dark-inert, structurally.** `collectRealmSummary` already returns `{ present: false }` for a
non-canonized world and computes `present` as an OR over its arrays (line 793). Dark ⇒
`worldState.concludedWars` is absent ⇒ the leaf returns `[]` ⇒ `present` is unchanged ⇒ the
sub-head never renders ⇒ **byte-identical PDF and byte-identical world book**. The existing test
at `tests/pdf/campaignPdfLivingWorld.test.js:25-28` already pins exactly that quiet-world arm.

**Audience ruling (lane call, recorded vetoably).** The record is HARD-DENIED from the public
snapshot because it carries DM-truth (`worldSnapshotPublic.js:98-107`). The world book renders at
`mode: 'player'` too. Rather than widen `collectRealmSummary`'s signature with an audience
argument, the leaf **omits `casusReasons[].receipt` and `casusReasons[].score` from its output
entirely, at every audience**. What remains — typed tokens, band keys, ids, ticks — is the same
class the world book already prints for sieges and weariness. A richer DM-only projection is the
audience table at `DESIGN_W_MEM §3.1` and stays **owner-gated**, unbuilt.

### CANDIDATE B — the Herald arc facet

`heraldIndex.js:157-160` already declares an `arc` facet, *"Treaty, war or arc"*, `status: 'pending'`,
`refsOf: (entry) => refFromRecord(entry, ['treatyId', 'warId', 'arcId'])` — a socket built for
exactly this address, and `facetAvailability` dims a facet nothing populates. Lighting it would let
a reader filter the Herald by war.

**Rejected because** the Herald feed is built from NEWS ENTRIES, so carrying concluded wars there
means either minting entries — which widens what the flag writes, forbidden by the brief — or
synthesising a parallel entry stream at read time whose ids would sit beside the real feed's; and
even if lit, the facet's promise is *navigational* (filter by war name), so it would surface the
war's identity and none of its content.

### CANDIDATE C — a per-settlement "wars this seat fought" block on the dossier

Reaches `dossier-<id>.vm` and `dossier-<id>.text` at both entitlements — also surface documents.

**Rejected because** a concluded war is a REALM-level fact keyed by war, not by settlement: it
would print the same war on both belligerents' dossiers and force a per-seat orientation the
record deliberately does not store, and the dossier view model is under the PDF parity contract
(`tests/pdf/viewModelParity.test.js`), a far wider blast radius than the realm chapter.

---

## 2. THE CHOICE

**Candidate A.** It is the only one of the three that reaches a document the owner's walk actually
reads, without widening the producer, without minting a record, and without entering a parity
contract. It is also the most droppable: deleting one leaf and two hunks removes it whole.

---

## 3. EXACT FILES A LATER CAR TOUCHES

| file | change |
|---|---|
| `src/domain/display/warRemembrance.js` | **NEW** — the pure reader. Exports (proposed) `concludedWarRows({ worldState, nameFor })`, `hasWarRemembrance(worldState)`, `warEndingOf(record)`. Imports only `warEndingClassifier.classifyWarEnding`, `armyStrength.remainingStrengthPhraseFor`, `warStatus.warExhaustionWordFor`, `humanizeEngineTokens.tickCalendarLabel`. **No cycle:** verified — `warEndingClassifier` imports only `razing.js` (zero imports) and `warConvergenceContract.js` → `warConvergenceForces.js` (zero imports), so nothing reaches back into `src/domain/display/`. |
| `src/utils/generateCampaignPDF.js` | `collectRealmSummary` gains `const wars = concludedWarRows({ worldState, nameFor })`, adds `wars` to the return and to the `present` OR; `buildLivingWorld` gains the `if (wars.length) { subHead('Wars Remembered'); … }` block |
| `src/utils/generateWorldBook.js` | **no change** — it consumes `realm` wholesale |
| `src/domain/certification/subsystemRowsMemory.js` | the W-MEM row's `other` prose says *"no Remembrance door"*; that sentence becomes false at landing and must be amended in the SAME act |
| `scripts/review/readerCorpus.mjs` (optional, same car) | add the ledger to the `war-${save.id}` RECORD dump (line 713) so a `written-but-unseen` answer has a record to cite even where the surface is thin |

**Deliberately NOT touched:** `concludedWars.js`, `concludedWarRecord.js`, `pulseKernel.js`,
`worldState.js`, `worldSnapshotPublic.js`. The producer, the shape and the deny posture are all
unchanged — that is what makes this car droppable at zero product cost.

## 4. THE TEST FILE IT EXTENDS

⚠ A new test file reds three separate censuses and the known-failure census is FULL at 10/10 with
zero headroom, so **no new test file may be created**. Two existing files take the work:

1. **`tests/pdf/campaignPdfLivingWorld.test.js` — the PRIMARY.** It already imports
   `collectRealmSummary` and already pins the two dark arms (`present:false` on a legacy world and
   on a quiet canonized world). The new arms belong here: a dark world's realm summary is
   byte-identical; a world carrying one sealed record surfaces a `wars` row with a resolved ending,
   a humanized tick and a resolved band word; a record with `casusReasons[].receipt` present proves
   the receipt does **not** reach the output at either mode.
2. **`tests/domain/concludedWarLedger.test.js` — the SECONDARY**, for the leaf's unit arms. It
   already imports both `concludedWarRecord.js` and `classifyWarEnding`, so the adapter arm (a
   razing record classifies correctly **only** when `attackerId` is threaded from
   `originAttackerId`, and reports `razing_road_unreconstructable` when it is not — a two-direction
   proof) costs no new import.

## 5. REGISTER FIGURES PREDICTED TO MOVE — written down in advance, instruments NOT run

| register | prediction | basis |
|---|---|---|
| `scripts/.observed-shape-readers-baseline.json` (OSR) | **MOVES — the highest landing risk.** New reader identities of the schema-4 form `<key> on <shape>` for `warId`, `originPair`, `originAttackerId`, `openedTick`, `concludedTick`, `sealed`, `victorId`, `fact`, `cost`, `participants`, `territorialOutcomes`, `notableEngagements`. Whether they RESOLVE depends on whether the OSR corpus's generated worlds carry the ledger; the flag is default-dark, so I predict they do **not** resolve and land as growth rows. | PLAUSIBLE — mechanism read at `tests/lint/observedShapeReaders.walker.test.js`, corpus contents not measured. ⛔ Cross-check the `MIN_ROWS=40` detonation hazard before the freeze. |
| `tests/lint/writerReach.walker.test.js` (WRWALKER) | **MOVES UP if the keys are in the corpus at all.** `SURFACE_ROOTS` (`scripts/lib/writer-reach-scan.mjs:98-99`) roots `campaign-pdf` at `src/utils/generateCampaignPDF.js` and `world-book` at `src/utils/generateWorldBook.js` — so this car lights **two named surface classes** outright. `web-display` (`WEB_DISPLAY_DIRS = ['src/components/','src/domain/display/','src/pdf/']`, line 90) is the **counting** class and moves **only if the new leaf is inside the `web` closure from `src/main.jsx`** — it is not, unless a component imports it. ⚠ Predict `web-display` **does NOT move**; do not claim it does. | CONFIRMED mechanism, PLAUSIBLE outcome |
| `tests/lint/couplingInclusion.walker.test.js` | **LIKELY** — `concludedWars.js` / `concludedWarRecord.js` sit in its exempt patterns (lines 176-177); a new display leaf reading the ledger may owe a coupling registry row in `couplingRegistryWar.js` or an exemption | PLAUSIBLE |
| `scripts/.size-baseline.json` | **MOVES** — one new leaf plus two hunks. ⚠ `sizeBaseline` uses EXACT ceilings (recorded hazard), so this must be refrozen in the landing act. | CONFIRMED mechanism |
| `tests/lint/.tuning-inventory.json` | **DOES NOT MOVE** — the design introduces no tuned constant; every threshold it uses is an existing band ladder | CONFIRMED |
| `scripts/.pdf-field-manifest.json` | **DOES NOT MOVE** — that manifest walks react-pdf `TextInput` fields in `SettlementPDF.jsx`; the campaign PDF is jsPDF and out of scope | CONFIRMED |
| `tests/security/worldSnapshotDenyCensus.test.js` / `snapshotDenylistDrift.test.js` | **DOES NOT MOVE** — no conditional ledger is added or reclassified; `concludedWars` stays hard-denied | CONFIRMED |
| `tests/copy/proseLeak.test.js` | **MOVES if a raw tick reaches the painter.** Cure through `tickCalendarLabel` and it does not. If a DM-tier raw tick is wanted, the file owes an in-file `prose-leak-allowance` record, which reds both ways | CONFIRMED mechanism |
| known-failure census | **MUST NOT MOVE — 10/10, zero headroom.** Everything above must land green; "write the arm and bank the red" is unavailable | CONFIRMED from program state |
