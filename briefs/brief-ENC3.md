# LANE ENC3 — resume the built-but-uncommitted stage, cure its own defect, and land the words that were ruled a year of chair-time ago
Dock: `$SP/laneENC-tree` — ⚠ **IT IS DIRTY AND THAT DIRT IS YOUR OWN WORK. DO NOT STOP. DO NOT RESET.** 11 tracked-modified + 2 untracked paths (`couplingRegistry.js`, `couplingRegistryEncounters.js`, `subsystemRowsVirtual.js`, `livedExperienceCatalog.js`, `livedExperienceSources.js`, `envoyPulse.js`, `simulationRules.js`, four tests, plus untracked `subsystemRowsEncounters.js` and `envoyChanceMeetingStage.js`). Byte-identical salvage copies are at `$SP/salvage-enc3/` if you need to compare. Scratch + receipt: `$SC/enc3/`.

## ⭐ THE RULING THAT UNBLOCKS YOU (§893, the chair, vetoable — `$SC/RULINGS-893.md` §2)
The drift door is **CHARTERED**. In three parts: (a) you do NOT take TE-VIRT-1's door — §890.1 stands; (b) ENCOUNTERS mints **its own** family leaf (`subsystemRowsEncounters.js`, already in your dock) on the SEAT-1 worked pattern; (c) `positionValue` gets a **legal supplier**: add it to the drift family's public door as a NEW named export with the reason written beside it, and import it legally instead of reaching around the door. ⛔ Do NOT mint a `characterDriftEnabled` manifest home — that reservation stays TE-VIRT-1's and is untouched by this charter.

## THREE THINGS TO CURE BEFORE YOU COMMIT
1. ⛔ **THE SEASON CAP IGNORES ITS OWN SUBJECT.** In your uncommitted `envoyChanceMeetingStage.js`, `taughtRecently(driftMap, nid, now, cadence)` never reads `nid` — it scans every subject's cells, so **one lesson anywhere mutes every character for a season**, and the skipped subject is dropped silently instead of being receipted `already_taught_this_season`. Cure both halves and prove the cure with a two-subject fixture: subject A taught, subject B still eligible.
2. **ENC row 2 — `respect`.** §882.13 ruled it YES on 2026-09-02 and the landed code still coerces it to `friendship` at `npcLadderState.js` `mintBond`. Add `respect` to `BOND_KINDS` so the owner's own word ("a bond, a rivalry or a respect") is true in the code.
3. **ENC row 3 — `rivalry`.** Ruled YES the same day; the leaf still says it is unreachable "until the owner rules the rivalry word". It was ruled. Add `rivalry` to `GRUDGE_KINDS` with `foreignSid`, and delete the stale comment rather than leaving a false claim beside working code.

## ⛔ ATOMICITY, AND IT IS THE CHARTER'S OWN LAW
ENC-3 is ATOMIC: `livedExperienceSources.js` THROWS at module evaluation for a receipted row with no resolvable adapter, taking seven importers down. **Row + entry + symbol are ONE commit.** A split lands a tree that cannot boot.

## PROOFS
The dark-path proof is the model and your own receipt already carries its shape: drive BOTH gates on a real world carrying prior deposits — gate B dark → ledgers drain to `[]`; gate A dark → `[]`; both dark → `[]`; never-lit → JSON identical with no key minted. ⚠ `envoyDiplomacyActive` is a SIX-key conjunction and a previous run of this arm was a FALSE GREEN because the fixture left gate B dark too — check that your arms actually vary the gate you think they vary. Plus a negative control from the base showing the drain is new behaviour.

## ⛔ AMENDMENT §893 — TWO LEDGER RULINGS ARE NOT IN THE CODE. VERIFY, THEN EXECUTE THEM.
Re-measured at train tip `62afd84d3` (`$SC/LIVEFAULT-VERIFIED-893.md`), both **CONFIRMED unexecuted**:
- `src/domain/worldPulse/npcLadderState.js:407` — `BOND_KINDS` is `{'loyalty','gratitude','friendship'}`. **`respect` is missing.**
- `src/domain/worldPulse/npcLadderState.js:383` — `GRUDGE_KINDS` is `{'contest_loss','contest_forestalled'}`. **`rivalry` is missing.**

The landed leaf's comments still defer both "to the owner"; that deferral is stale — the rulings were
made. **Execute them in this car** and delete the stale deferral comments in the same act, so the
code and the ledger stop disagreeing. Re-measure before you edit: a claim decays, including this one.
