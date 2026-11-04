# RUNG1B-F7 — the rename cascade through the crisis cast (2026-11-04)

Seat: RUNG1B-F7 (Opus 5.5) under the cloud chair (Fable 5.1). Branch `lane/rung1b-f7-rename-cascade-2026-11-04`, cut from `lane/window-rung1-2026-11-04` at `f9ce225c5`. RUNG1-PINS (`origin/lane/rung1-pins-2026-11-04`) is already an ancestor of the base, and its tip does NOT declare `availableServices.criminal[].name` (`git show origin/lane/rung1-pins-2026-11-04:src/domain/institutionRename.js | grep 'criminal\[\]'` is empty), so there was no PINS row to reuse.

## Unit 1 — the measurement

### The reds at the base (mutex, shared tier, one worker)

`tests/domain/factionRename.test.js` + `tests/domain/institutionRename.test.js`: 4 failed, 24 passed.

| test | red at the base on |
|---|---|
| faction: every stored path that carries a faction name is declared | `stress.cast.stakes[].factionId`, `stressors.cast.stakes[].factionId` |
| faction: renaming any roster faction leaves nothing stale | 16 of 24 cases, the same two paths |
| institution A1 | `availableServices.criminal[].name` ("Black market bazaar") and eight cast paths: `{stress,stressors}.cast.{levers[].institution, roles[].id, roles[].name, stakes[].factionId}` |
| institution A6 | **not this lane's**: "guild rows 0" — no sample row carries both the `Thieves' guild chapter` house and a `Thieves' Guild` handle, so the pin is vacuous (cause not traced; reported) |

The other readers of the two modules at the base (13 files): `tests/domain/npcRename.test.js` red on the same class (`{stress,stressors}.cast.{roles[].name, levers[].holderName}`, plus `generationCoherenceReceipt.judgments[].findings[].evidence` from the eighth formal judgment, b7a5f778); `tests/property/editCorpusRatchet.test.js` red A3–A8 on its pinned corpus figures (268 → 275 and five more), a generator-shape census this lane does not own. Everything else green.

### The walker (120 soak records, `scripts/audit/soak-review/corpus.mjs :: birth`, reloaded)

102 of 120 records carry a crisis with a cast; the stress container is an entry OBJECT on 101 records and an ARRAY on 19, so the cast lives at FOUR homes: `stress.cast`, `stress[].cast`, `stressors.cast`, `stressors[].cast`. Every string was walked for each roster faction (exact or whole word), each roster house (exact) and each roster person (exact); a path was reported when no ledger declares it.

| ledger | undeclared path | records | ruling |
|---|---|---|---|
| faction | `<home>.stakes[].factionId` (4 homes) | 102 | cascade (key) |
| faction | `<home>.roles[].id`, `.name` where `kind: 'faction'` | 0 observed; the writer can emit them | cascade (key), kind-scoped |
| faction | `powerStructure.factions[].contestsNiche` | 34 | cascade (key): the doubled-niche rival's tie, the host's display name |
| faction | `defenseProfile.institutions.{walls,mercenary}[].factionSource` | 3 | cascade (key), all seven defence buckets |
| faction | `coherenceNotes[].note` | 2 | cascade (prose): printed on the Overview and the PDF |
| faction | `institutions[].name`, `availableServices.legal[].institution` | 9 | NON_CASCADED: the governing body's faction named after its HOUSE ('Merchant oligarchy'); the institution ledger owns them |
| NPC | `<home>.roles[].name` where `kind: 'npc'`, `<home>.levers[].holderName` | 102 | cascade (key), kind-scoped; the row's id is the durable character id and stays |
| institution | `<home>.levers[].institution`, `<home>.roles[].id`, `.name` where `kind: 'institution'` | 57 + 18 | cascade (exact), kind-scoped |
| institution | `<home>.stakes[].factionId` | 9 | NON_CASCADED (label): a FACTION key that equals a house name only for the governing-body forms |
| institution | `history.currentTensions[].factions[]` | 3 | NON_CASCADED (label): the faction ledger's tension roster, the same collision |
| institution | `npcs[].role`, `factions[].members[].role`, `relationships[].npc{1,2}Role` | 2 | NON_CASCADED (label): an office title ("Midwife") equal to a house name, not a handle |
| institution | `availableServices.criminal[].name` | 5 | **NON_CASCADED (label), against the brief's "cascade"**: see below |

The normalised and catalogue arms also hit `institutions[].catalogId`, `defenseProfile…catalogId`, `activeChains[].chainId`, `…dependsOn[]` and `economicViability…importChannel`; none crosses A1's 50 percent threshold and each is a catalogue identity or vocabulary, so they are not rows.

**`availableServices.criminal[].name` refutes "cascade".** Over 240 soak records, 10 criminal service entries carry a name that is a roster house, and on all 10 the entry's own `institution` is a DIFFERENT house: the "Black market bazaar" service is provided by the `Underground city`, beside a separate `Black market bazaar` house (one more, "Fence (word of mouth)", under the `(covert)` sentinel). It is the class `availableServices.equipment[].name` was ruled into (a service label, not a handle; the entry's `institution` is the handle), so cascading it would rename a service the Underground city provides whenever the bazaar is renamed. The row is declared NON_CASCADED with that reason and a falsifying arm; moving it to the cascade list is a one-row change if the chair rules otherwise.

The escalation line (`ifNothingIsDone.residualEffects`, the catalog's) and the crisis hook (a template, filled from the cast where it is shown) carry no names; the walker found none on either.

### Noticed, not built (intake)

- The DM's cast edit (`stress…_userEdits.castRoles.value`, `role=kind:id` parts) keys factions and houses by display NAME; after a rename `effectiveCastOf` drops the edited row silently. Not on a generated record, so no walker sees it; rewriting a user-edit value is the edit layer's call.

## Units 2–4 — outcome

- **Unit 2** (`3409e2f8`): the faction and person cascades walk `CRISIS_CAST_HOMES`; the walker's other faction paths cascaded; the collision rows and the receipt row declared NON_CASCADED.
- **Unit 3** (`b31ae88d`): the institution ledger's twelve cast rows, kind-scoped by a new `where` row filter that the rename and the removal both read (`sitesOf`); the NON_CASCADED rows above, `availableServices.criminal[].name` among them.
- **Unit 4**: `tests/domain/crisisRenameCascade.test.js` keeps the walker (48 soak records, the three ledgers); red at the base on 31 path shapes, green at the tip. The same walk over 120 records reports 0 undeclared paths for each ledger.

Readers of the two modules (18 files) at the tip: green except `institutionRename.test.js` A6 and `editCorpusRatchet.test.js` A3–A8, both red at the base with byte-identical failure figures (`editCorpusRatchet`'s assertion lines diff empty base vs tip).

Moved and re-recorded, each by this lane, with its cause (the crisis cast's rows): `institutionRename.test.js` A1 exact-row count 34 → 46; `editOperations.test.js` B2 `NPC_RENAME_SURFACES.length` 5 → 13; the totality fixtures of `factionRename.test.js`, `npcRename.test.js` and the store fixture of `editSlice.test.js` A1a hold the new surfaces. No golden, census, baseline or ceiling moved.
