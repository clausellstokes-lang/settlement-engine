# §893 — THE REMEMBRANCE RULINGS, on lane REMEMBRANCE's measurement
⟦OPUS-AUTHORED — Fable retrovalidation OWED⟧ · 2026-09-04.

## 1. ⭐⭐ THE ITEM IS RE-CLASSIFIED: THIS IS A BROKEN WALK INSTRUMENT, NOT A DARK DOOR
§893 ruling 3 funded the Remembrance reader because *"a door that lights into a void is not lit."*
The measurement makes the case far stronger, and changes what kind of problem this is.

**CONFIRMED by the chair at the train tip:** `scripts/review/readerRubric.mjs:36-38` freezes
`READER_SYSTEMS` as *the seven systems a reader is seated against*, and **`war_memory` is one of the
seven**. `Q-WAR-1` and `Q-WAR-2` are SCORED questions at `recordHome: 'war'`. The preview posture
turns `warMemoryEnabled` ON. And there is **neither a surface nor a record to cite**: the corpus's
`war-${save.id}` RECORD document dumps only LIVE war state from `warStatus.js`, never the concluded
ledger.

⭐ **So this is not a door the owner would note as dark. It is two scored questions on the owner's own
review rubric that CANNOT BE ANSWERED, on a corpus configured to ask them.** The walk is one of only
two things still owner-gated, and its instrument is broken. **Priority raised to the highest of the
unlanded build items.**

**The void itself: CONFIRMED.** No component, display read model, PDF, world book, Foundry module,
Herald, chronicle or dossier reads `concludedWars`. The only `src/domain/display/` site is
`worldSnapshotPublic.js:108`, which is a `WORLD_SNAPSHOT_HARD_DENY` membership — an explicit REFUSAL
to project, not a reader.

## 2. RULED — the design is FUNDED as recommended
A new pure leaf `src/domain/display/warRemembrance.js` feeding a `wars` array into
`collectRealmSummary`, surfaced as a "Wars Remembered" sub-head in the *State of the Realm* painter.
**Ground:** one seam lights `worldbook.dm`, `worldbook.player` and `campaign-pdf` at once; it is
dark-inert through the collector's existing `present` OR, so it costs nothing with the flag off and
is droppable at zero product cost; and it leaves the producer, the record shape and the deny posture
untouched. The rejected alternatives are recorded with their reasons (a Herald arc facet would
require minting news entries; a per-settlement dossier block fights a realm-level fact and the PDF
parity contract). **Tests EXTEND `tests/pdf/campaignPdfLivingWorld.test.js`** and
`tests/domain/concludedWarLedger.test.js`. No new test file — that reds three censuses.

## 3. ⛔ THREE CONSTRAINTS THE READER MUST HONOUR, and the third is the §711.6 hazard exactly
(a) **The shape is WIDER THAN THE WRITER.** `fact.peaceReason` and `fact.coalitionFragmented` have
ZERO producers, so **two of the eight endings are structurally unreachable**; `terms`, `lastStanding`,
`participants[].label`, `fallenSeatLabel` and `mutual` likewise. ⭐ This is KNOWN debt, not a
discovery: `tests/ops/warConvergenceCollector.test.js:375` already enumerates three of them as
`unfilled`. **RULED: the reader must not offer an ending it can never reach.** Whether the PRODUCER
should learn to fill them is a separate car and a separate question; docketed, not smuggled in here.
(b) **`classifyWarEnding` needs `fact.attackerId`, which the record deliberately does not store.** The
reader threads `originAttackerId` or **every razing reports `razing_road_unreconstructable`**. This is
a correctness trap with a silent wrong answer, not a missing feature.
(c) ⛔ **UNITS.** Every `*Tick` is a RAW ENGINE TICK and is §69.3-forbidden on PDF surfaces; the cost
bands are KEYS, not phrases; `casusReasons[].score` is a raw, unit-undeclared control value that **no
surface may print**. **RULED: the reader TRANSLATES — it never forwards an engine unit to a human.**
This is the game-grade UX doctrine and the §711.6 hazard in one place: a unit-less field gets a
different unit at every consumer.

## 4. THE LIFECYCLE — six paths carry, one drops, and the drop is CORRECT
Create, persist, re-derive, undo, clone and save-migrate all carry. **Public-snapshot / gallery /
world-export import DROPS irrecoverably**: a world imported from a public snapshot re-enters with an
empty ledger and its pre-import wars are unrecorded forever.
**RULED: the DENY STANDS.** A public snapshot is a public artifact and a full war ledger is private
world history; leaking it would be the worse defect. But the consequence is REAL and must not be
discovered by a user, so it is **documented on the walk sheet as a stated limitation** rather than
quietly accepted. Not an owner gate; a disclosure.

## 5. THE LANDING RISK, NAMED IN ADVANCE
**The OSR / observed-shape baseline.** A new reader over a default-dark ledger is the
reader-with-no-writer shape BY CONSTRUCTION. With the known-failure census FULL at 10/10 there is no
headroom to bank a red, so the growth rows must be **MEASURED and REFROZEN inside the landing act**,
predicted in writing beforehand. ⚠ A shape crossing `MIN_ROWS=40` detonates the OSR ratchet; the car
must measure whether it does before it composes.
