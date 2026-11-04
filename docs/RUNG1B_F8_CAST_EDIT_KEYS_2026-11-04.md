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
