# RUNG1B-F8 — the DM's name-keyed edits follow a rename (2026-11-04)

Seat: RUNG1B-F8 (Opus 5.5) under the cloud chair (Fable 5.1). Branch `lane/rung1b-f8-cast-edit-keys-2026-11-04`, cut from `lane/rung1b-f7-rename-cascade-2026-11-04` at `05f3935ea` (F7's "Noticed, not built" item).

## Unit 1 — the measurement

### The loss, reproduced

Soak corpus (`node scripts/audit/soak-review.mjs --count 120 --workers 4 --out artifacts/f8-base`, 0 errors; the records are `scripts/audit/soak-review/corpus.mjs :: birth(i)`). On `soak1k-0` (thorp, mass migration, one crisis, the stress container an OBJECT) the DM's cast line `brunt=faction:Elder Council · defender=institution:Subsistence farming` resolves to two rows; after `applyFactionRenameToSettlement(…, 'Elder Council', …)` and `applyInstitutionRenameToSettlement(…, 'Subsistence farming', …)` `effectiveCastOf` returns **zero rows**, both homes of the edit still spell the old names, and nothing says so. Through the DM's own path (the store's `applyUserEditAction('crisis', 0, 'castRoles', …)` then `renameFaction(0, …)`) the same.

On `soak1k-2` a house the DM put behind `Religious Authorities` (`_userEdits.backs`) stands behind **nobody** after that power's rename: `houseBacksOf` drops the authored name the roster no longer answers to, and the DM's word ("a house the DM cleared stands behind nobody") is now read as the DM clearing it.

The red: `tests/domain/dmEditKeysFollowRename.test.js`, 7 failed, 3 passed (the three controls) at the base.

### The inventory: every DM-edit store keyed by a name

`_userEdits` read end to end (`src/domain/userEdits.js :: EDITABLE_FIELDS`, every writer of `applyUserEdit`, every reader through `walkUserEdits`), plus the DM layer (`settlement.dmLayer`).

| store | key it carries | name-keyed? | seed | ruling |
|---|---|---|---|---|
| crisis `castRoles` (`<stress entry>._userEdits.castRoles.value` and its mirror `<entry>.castRoles`, at `stress` and `stressors`) | `faction:` part = faction display name; `institution:` part = house name | **yes** | soak1k-0, soak1k-4 | unit 2 |
| crisis `castRoles`, `npc:` part | the durable character id (`str(x.id) || str(x.name)`) | no: 0 id-less NPCs on the 36 crisis records of the first 40 | soak1k-0 (control) | none |
| institution `backs` (`institutions[]._userEdits.backs.value` and `institutions[].backs`) | faction display names, read case-folded | **yes** | soak1k-2 | unit 3 |
| every other `EDITABLE_FIELDS` path (`npc`, `faction`, `institution.desc`, `hook`, `historicalEvent`, `currentTension`, `settlement`) | the FIELD path; the record rides the entity it edits | no: prose on the entity, moved with it | — | none |
| `dmLayer.roots` | `cardType:entityId:field`, `entityId` = the row's `.id` (`EditModeShell :: subjectOf`) | not by name: factions and houses carry no `id`, so no root is keyed on one (PLAUSIBLE, not exercised) | — | noticed, not built |
| `dmLayer.minted` / `phantoms` | `dm:` ids (`DM_ID_NS`) | no | — | none |
| the pending-edit queue (`rename-faction`) | `factionIndex` | no | — | none |

No faction or house carries an id on any record (36 of 36 crisis records: no `id` on `powerStructure.factions[]` or `institutions[]`), and design §22.4 rules a faction's identity IS its display name. So shape (a), "key by the entity's id", has no id to key by; the cure is shape (b).

## Unit 2 — the cure for the cast edit: shape (b), the rename cascades the edit's keys

**Why (b).** Shape (a) needs an id the record does not have: no faction and no house carries one (design §22.4; 17,361 of 17,361 generated houses carry `name` and no `id`), and the engine's own cast already keys a faction or house row by its display name, which F7 cascades. Keying the DM's line by a new id would mint an identity the design rules against and leave the DM's line and the engine's cast on two key conventions. The store is also registered (`EDITABLE_FIELDS.crisis`, the prose-queue spine's `crisis.castRoles` row), so (b) leaves its shape untouched: `role=kind:id`, byte for byte, with only the moved parts re-spelled.

**What landed.**

- `src/domain/userEditLines.js` (new leaf, no imports): the cast line's grammar (`CAST_EDIT_PATH`, `CAST_EDIT_SEPARATOR`, moved here from `crisisCast.js`, which re-exports both) and `rekeyCastLine(value, kind, old, new)`, kind-scoped and exact as the reader is; a line where nothing moves is returned as given.
- `src/domain/userEdits.js :: rekeyUserEdit(entity, path, rewrite)`: the edit layer's own re-key writer. Both homes of the edit move (`_userEdits[path].value` and the entity field `applyUserEdit` mirrors it to); `editedAt` and `originalValue` are kept, because a rename is not the DM editing.
- `src/domain/factionRename.js :: rekeyCastEditsOfKind`, called by the faction cascade (`'faction'` parts) and by `applyInstitutionRenameToSettlement` (`'institution'` parts), at every crisis entry of both containers; reported in `touched` as `<home>._userEdits.castRoles`. Not a ledger row: the two ledgers declare GENERATED paths and their walkers read generated records, which carry no DM edit.
- `npc:` parts are keyed by the durable character id and are not touched (the control).

**Readers** (55 test files: every file naming `castRoles`, `crisisCast`, `userEdits` or a rename module). Green except: `dmEditKeysFollowRename` (the three `backs` reds, unit 3's); and three files red at the base with byte-identical failure output base vs tip (normalised logs diff empty): `institutionRename` A6 ("guild rows 0", F7's), `negativeAssertionAnchor.walker` (two arms, files outside this lane), and `worldGenerationClockSeam.walker` ARM C; `editCorpusRatchet` A3–A8 (F7's) is red at the tip on the same six arms, its base-vs-tip figure diff recorded in unit 3 (the base run was still in flight at this commit). `check-observed-shape-readers.mjs` is red at the base before it scans (its execution-input precondition: three generated data files changed since the last re-freeze), the same message at the tip; so it does not certify the new reads either way.

## Unit 3 — the backing edit (`institutions[]._userEdits.backs`)

The same shape (b), for the same reason (a power has no id but its name). `parseBacksValue`, `formatBacksValue` and `BACKS_SEPARATOR` move to `src/domain/userEditLines.js` verbatim (`powerSupport.js` re-exports all three), beside the new `rekeyBacksLine(value, old, new)`, which is case-folded because the reader (`houseBacksOf`) resolves each name case-folded. The faction cascade's step 17 reads the edits through `walkUserEdits` (the banked `_userEdits` reader) and writes through `rekeyUserEdit`; reported in `touched` as `institutions[]._userEdits.backs`. No institution rename is needed for this store: it names powers, not houses.

**Readers at the tip** (67 files: the 55 above plus every file naming `powerSupport`, `houseBacksOf`, `parseBacksValue` or a `backs` path; `editCorpusRatchet` run alone). `dmEditKeysFollowRename` 10 of 10 green. Red, each red at the base (`6c7b611`, an exported copy) with **byte-identical normalised failure output** base vs tip: `institutionRename` A6, `negativeAssertionAnchor.walker` (two arms), `worldGenerationClockSeam.walker` ARM C, `editCorpusRatchet` A3–A8, and `generatorGoldenMaster` ("expected [ …(525) ] to deeply equal []" on both sides). The golden's printed list is truncated, so "the golden did not move" is PLAUSIBLE, not CONFIRMED by that diff; nothing in this lane touches a generator (two constants and two functions moved verbatim, one write path added to the rename modules).

## Noticed, not built

- A DM `desc` edit on a faction or house keeps the old name inside `_userEdits.desc.value` while the faction cascade rewrites the entity's `desc` prose (`rewriteProse` on `powerStructure.factions[].desc`), so the edit record and its mirror can disagree after a rename. Prose, not a key; the edit layer's call.
- A name containing ` · ` would split either line; `formatCastRoles` has the same limit. Not observed.
- `dmLayer.roots` keys by the row's `.id`; factions and houses have none, so an institution annotation through the edit shell would key on an empty id (not exercised).
