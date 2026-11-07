# FIX-PUBLIC-VEIL: the veil bit stamped at birth; the public export names a face's house only where the house is public (2026-11-07)

> Archival record of the seat FIX-PUBLIC-VEIL (Opus 5.5), a child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's delegation of 2026-11-06. Brief: `docs/chair/2026-11-07/BRIEF-FIX-PUBLIC-VEIL-2026-11-07.md` on `lane/integration-2026-11-07`. Branch `lane/fix-public-veil-2026-11-07`, cut from `origin/lane/fix-export-keys-2026-11-07` at `0c4cbbc86`, pushed with `--no-verify` after every commit.
>
> The finding (FIX-EXPORT-KEYS §3): a face's `title` and `role` are already public, so a card minted for a hidden power prints its title on a public gallery page, and the SQL sanitizer cannot decide per row whether a house is hidden. The chair's ruling, shape (a): one predicate module; every writer of a card's `institution` stamps `institution.veiled` at birth; the sanitizer (migration 206) and the client twin read the bit. Where it is false, `institution`, `title` and `memberships` are public. Where it is true or absent, all three are stripped (fail-closed). Pre-car rows are untouched.

## 0. Step 0: the measured map (at the base `0c4cbbc86`)

**The writers of a card's `institution`** (`grep` of `institution:` / `.institution =` under `src/generators/people/`, `src/store/`, `src/domain/`):

| writer | where | what it writes |
|---|---|---|
| the representative generator | `src/generators/people/representatives.js :: generateRepresentatives` → its one `birth()` (`card.institution = institution`) | three call sites: a house face `{ kind: 'house', key, family, title }`; the hall-as-seat house face (same shape); the minted seat `{ kind: 'power', key: <governing power>, … }` (R-P2) |
| the seam's `other` mints | `src/generators/people/castPowers.js :: assignCastPowers`, the `unfaced.forEach` (`card.institution = { kind: 'power', key: name, family: null, title: row.title }`) | R-P4: one card per non-governing power with no backing-archetype house, and the hidden infiltrator among them |
| the v1 → v2 save migration | `src/domain/settlementMigrations.js :: migrateV1toV2` | builds `{ kind: 'house', key, family: null, title: null }` from a legacy string naming a roster house; keeps a car-born record as written; null otherwise |
| the edit layer | `src/domain/npc/npcOps.js :: reassignNpc` and `src/store/settlementPendingEditWriters.js :: applyNpcOp` (`reassign-npc`) | `institution` is a SEAT-HELD field: the DM's target overwrites it |

Not writers: the rename ledgers (`institutionRename.js` cascades `institution.key` for a house, `factionRename.js` for a power) re-spell the SAME house or power, so its veil class does not move. No edit declaration (`src/domain/edit/fieldDeclarations.js`) names an NPC's `institution`.

**The readers of the veil predicate.**
- `src/domain/display/galleryVeil.js` holds `isHideableHouse`, `isCriminalInstitution` and `isClandestineInstitution` (module-private). They are read by `isHideable` (X-21e's card address), `applyVeil` (a house hidden whole) and `DEFAULT_VEIL_RULES` (the criminal and clandestine default rows).
- **No client code reads a power's `hidden` flag** for a face. The "hidden-power mint" has no predicate today: the minted face's title is public through `npc_allowed`'s `title`/`role` and the veil's identity floor.
- `src/domain/people/cardDoor.js` derives NO veil. Its door and honorific come from `cardInstitutionOf(card)`, so they go wherever `institution` goes. The public projection removes `institution` for every card today, so the public card has no door, no face row and no role row (PEOPLE-6 §6, PLAUSIBLE there).
- PEOPLE-6's suite `tests/components/people6InstitutionFaceLinks.test.jsx` §4 pins the veil's ties eye and the public projection. Its fixtures carry no bit.

**The public paths.** The SQL `_gallery_sanitize_public_json` is net-current at 205; its `is_npc_obj` arm reduces `npcs[]` and a deeper roster to `npc_allowed` (9 keys). The client twin `publicSafe.js` has `publicNpc()` (the same 9 keys, a plain literal parsed by `gallerySanitizer.pglite`), applied in `toPublicSafe`'s default projection and to a non-revealed member under overrides, plus the roster-member gate in `sanitizePublicValue`.

**The pglite harness.** `tests/security/gallerySanitizer.pglite.test.js` (net-current extract, executed), `factionMemberPublicParity.pglite.test.js` (client == server field for field), `gallerySanitize.pglite.test.js`, the contract `gallerySanitizeAllowlist.contract.test.js`, and `migrationSequenceAll.pglite.test.js` (the whole train).

**Who would be veiled.** The predicate is applied to the FINAL record: a house face is veiled when its roster row is `isHideableHouse`; a minted face is veiled when its power is `hidden: true` or `category: 'criminal'`. The instrument is a scratch script, not committed: it runs `generateSettlementPipeline` over `goldenCorpus()` and `scripts/audit/soak-review/corpus.mjs :: birth(0..999)`.

| | the 525 | the 1,000 |
|---|---|---|
| faces (cards with an `institution` record) | 14,366 | 29,020 |
| settlements with a face | 525 | 1,000 |
| settlements with a veiled face | 487 | 413 |
| **veiled faces** | **1,359** | **1,616** |
| house faces veiled (a hideable house; all by the classifier `criminal`) | 879 of 13,790 | 1,583 of 28,622 |
| minted faces veiled (a hidden power; none criminal) | 480 of 576 | 33 of 398 |
| veiled, by the card's pool category | criminal 879, government 480 | criminal 1,583, government 33 |
| veiled mints, by title | the bloc's speaker 480 (every one the hidden infiltrator) | the bloc's speaker 27, the alliance's convenor 3, the commoners' tribune 3 |
| unveiled mints | the eldest 96 (the seat mint) | the seat mints 203, the `other` mints 162 |
| cards with no `institution` record (untouched by the rule) | 240 (`institution: null`) | 23 (no key) |

By tier, veiled of faces: the 525, thorp 72/175 · hamlet 72/206 · village 72/567 · town 188/2,124 · city 408/4,811 · metropolis 547/6,483; the 1,000, thorp 19/280 · hamlet 13/604 · village 15/1,577 · town 155/4,189 · city 535/9,436 · metropolis 879/12,934.

The veiled houses by family (the 525): Underground network 158 · Front businesses 145 · Black market 92 · Smuggling waypoint 87 · Multiple criminal factions 85 · Rookery 84 · Whisper market 72 · Thieves' guild chapter 47 · Underground city 36 · Assassins' guild 36 · Contract killer 24 · Fence (word of mouth) 13. These are FIX-EXPORT-KEYS's twelve families; its 879 is reproduced exactly.

**Memberships on an unveiled card.** Under the ruling these become public.
- A membership in a CRIMINAL power: 524 on the 525 and 1,386 on the 1,000. The criminal power's row is already public under `powerStructure`.
- A membership in a HIDDEN power: 0 on the 525 and **5** on the 1,000, all in one settlement. In soak1k-389 (a metropolis), five government-shelf houses back the hidden power: the chief magistrate, the prison warden, the arena master, the workhouse master and the bath-keeper. The ruling makes those five memberships public. That publishes the infiltrator's embedded assets by name, which is FIX-EXPORT-KEYS §3.3's per-entry question. It is put to the chair at step 0.

