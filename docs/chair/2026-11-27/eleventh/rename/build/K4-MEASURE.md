# K4 MEASURE: A RENAME LIFTS THE DM's HIDE (the chair's ruling K4, the ruling reader's A5)

RENAME-BUILD, 2026-11-28. Measured on 71620fe4d + K2-3 (the veil is untouched by both). Every count is a script's (CONFIRMED) unless marked PLAUSIBLE.

**The harness** (`tools/k4m-harness.jsx`, `tools/analyze-k4m.mjs`; `results/K4-measure.json`). All 900 births of C and all 900 of V, every size, births only. For each card kind of the share veil (`galleryVeil.js :: CARD_KINDS`), it takes every card id on the share payload (`galleryPayloadFor`) before and after each rename path, each by its own writer:
- **F:** the governing power (`applyFactionRenameToSettlement`, the writer of `renameFactionImpl`, the DM's action);
- **P:** the first person (`applyNpcRenameToSettlement`, the writer of `renameNpcImpl`);
- **H:** the first house (`applyInstitutionRenameToSettlement`, with no product caller);
- **T:** the town (`renameTownInRecord`, the writer of `renameSettlementImpl`).

And the DM's hide of the renamed card's description: `writeShareVeil(null, [{ address: 'field:<kind>:<id>:description', hidden: true }])`, made BEFORE the rename, read AFTER it on the served record (`toPublicSafe` plus `projectShareVeil`).

## The address kinds, and which a rename re-keys

| kind | its id (`CARD_KINDS[kind].idOf`) | born records carrying an own id | F (a power) | P (a person) | H (a house) | T (the town) |
|---|---|---|---|---|---|---|
| npc | `galleryMemberKey`: the own id, else `npc.<slug of the name>` | 27,391 of 27,391 / 26,218 of 26,218 | 0 | **0** | 0 | 0 |
| institution | `entityIdFor`: the own id, else the slug of the name | **0** of 34,407 / 0 of 33,099 | 0 | 0 | **900 of 900 towns** | 0 |
| faction | `factionIdFromName(name)` FIRST: always the name | **0** of 3,468 / 0 of 3,202 | **900 of 900 towns** | 0 | 0 | 0 |
| conflict | the own id, else the slug of `parties` plus `issue` (the parties are power names) | | **415 of 900 / 399 of 900 towns** (587 / 586 ids) | 0 | 0 | 0 |
| event, tension, relationship | the own id, else the slug of the name, title or ends | | 0 | 0 | 0 | 0 |
| tab, block, class (groupings, switches) | fixed vocabulary | | 0 | 0 | 0 | 0 |

## The DM's hide, made before the rename, after it (C | V)

| path | tested | hidden before | **LIFTED after** | by size |
|---|---|---|---|---|
| F, a power's rename (the product's action) | 900 / 900 | 900 / 900 | **900 / 861** | C: 150 of each size; V: thorp, hamlet and village 150 each, town 132, city 136, metropolis 143 |
| H, a house's rename (no product action) | 900 / 900 | 900 / 900 | **900 / 900** | every size |
| P, a person's rename | the person's id is its own, so no address moves | | 0 | |
| T, the town's rename | no address keys on the town's name | | 0 | |

- The 39 V towns not lifted: the served copy shows no governing description after the rename for another reason (PLAUSIBLE: the default veil or a hidden power). Not chased.
- **A conflict's hide** (its addresses are keyed on the power names in `parties`) moves on 415 and 399 towns, by the same arithmetic. It was not separately rendered.

## Where the overrides live, and how they are written (CONFIRMED by reading; the paths are the app's own)

- **They are stored** in the save row's `settlements.gallery_member_overrides`: the reserved key `$veil` holds the deltas (`galleryVeil.js :: VEIL_OVERRIDE_KEY`, `writeShareVeil`), and a person's card hide is `revealDm: false` under its id. They are outside the record, so the record's walk could not see them.
- **They are written by the client** in two writes, which the curate screen makes together (`hooks/useGalleryShareControls.js :: persistShare`):
  - `lib/gallery.js :: updateGalleryMetadata(saveId, { memberOverrides })`, a plain `supabase.from('settlements').update(...)` of the owner's own row, through `galleryMetadataPatch`;
  - the store's `updateSavedSettlement(saveId, { gallery_member_overrides })`. Its patch keys admit it: `settlementSliceHelpers.js :: SAVED_SETTLEMENT_PATCH_KEYS`.
- **They are applied on the client**, on every public read (`lib/gallery.js :: sanitizeDossier`, `projectShareVeil(toPublicSafe(...), overrides)`). The server twin, `_gallery_apply_veil`, is a migration not landed ("CLIENT MIRROR", `gallery.js:858-864`). Migration 208 serves the overrides less their snapshot (`#- '{$veil,snapshot}'`). The person's `revealDm` is also spliced server-side (093), keyed by the person's id, which a rename never moves.
- **A snapshot share** freezes its public copy at `$veil.snapshot`, under the OLD names. A hide re-keyed to the new id alone would stop hiding there, so a cure must ADD the new address and KEEP the old one (fail-closed).

**The verdict for K4:** the cure needs only the app's own existing write path, the same two writes the curate screen makes. No SQL, server function or migration is needed. So, by the ruling: BUILD IT IN K4. The power's rename (F) carries every affected address (faction and conflict) to the new key, keeping the old.
- **Named, not built:** the house's rename (H, no product action); a partner save's overrides (a neighbour whose relationship names the power: not measured); the gallery's published copy, refreshed by the next save or export as today.
