# FIX-PUBLIC-VEIL: the veil bit stamped at birth; the public export names a face's house only where the house is public (2026-11-07)

> Archival record of the seat FIX-PUBLIC-VEIL (Opus 5.5), a child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), under the owner's delegation of 2026-11-06. Brief: `docs/chair/2026-11-07/BRIEF-FIX-PUBLIC-VEIL-2026-11-07.md` on `lane/integration-2026-11-07`. Branch `lane/fix-public-veil-2026-11-07`, cut from `origin/lane/fix-export-keys-2026-11-07` at `0c4cbbc86`, pushed with `--no-verify` after every commit.
>
> The finding (FIX-EXPORT-KEYS §3): a face's `title` and `role` are already public, so a card minted for a hidden power prints its title on a public gallery page, and the SQL sanitizer cannot decide per row whether a house is hidden. The leak's own example: **"the bloc's speaker"**, the mint title of the hidden infiltrator, printed on the public card of each of the **480** hidden-power mints on the 525. The chair's ruling, shape (a): one predicate module; every writer of a card's `institution` stamps `institution.veiled` at birth; the sanitizer (migration 206) and the client twin read the bit. Where it is false, `institution`, `title` and `memberships` are public. Where it is true or absent, all three are stripped (fail-closed). Pre-car rows are untouched.
>
> **The chair's three further rulings, given during this lane** (messages of 2026-11-07, 23:42 and 23:50 UTC, after step 0):
> 1. On a veiled card, `role` is stripped with `title`, because the car sets `role = title`. The pre-car `category` stays public.
> 2. **The same law per membership.** Every writer of a card's memberships stamps `memberships[].veiled` from the same predicate applied to THAT power. The sanitizer and the twin publish only the entries stamped false, fail-closed. The pglite proof: an unveiled face with one public and one hidden membership keeps exactly the public one.
> 3. **The observed-shape register's gap.** It is cured by a governed rung 31 → 32 in this lane (option (1), §2).
>
> **STATE: DONE.** The commits, in order:
> - `caba91879` step 0
> - `0095f7327` / `e161ee427` the register rung, acts 1 and 2
> - `dded069c1` step 1, the cause, UNSIGNED
> - `f98b50cc4` the registers through their doors
> - `c5d72d80a` step 2, migration 206 and the twin
> - `5c200ba2f` step 3, the edge prompt and the scripts sweep
> - `bf729b4b8` this record, born with its proof pending
> - `e78d0cc67` the cure the proof run convicted (§5)
> - `24ac7fbcc` / `1d8e6e60d` the registers through their doors at the cured tip
> - the SECOND SEAT (§11–§16):
>   - `bedb6ebde` 206's root pass (the hidden power and a veiled end's ties)
>   - `48bcc1f3e` opaque ids and age epithets at birth, UNSIGNED
>   - `b7e599bf4` the fork census re-keyed
>   - `a69c472b7` / `6b85e6509` the rung 32 → 33
>   - `97a0bf8b6` the walker's year re-keyed
>   - `77b6edb9f` writer reach rebanked
>   - `abd81e41d` the wave's purpose
>   - `04e81e488` the EM-R2 and holder-census cures
> - this record's last edit
>
> No golden was re-recorded (that is the merge seat's job).

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


**FINDING: the register's gap (the chair's ruling: write it here).** The observed-shape register's corpus (`scripts/lib/observed-shape-corpus.mjs`) has never generated a world with the `infiltrated` stress. So every reader of what that branch writes was invisible to the instrument from the branch's birth. In particular, `hidden: true` on the stress infiltrator's power (`generators/power/stressFactions.js`) was "a key no writer produces" to the register, although the generator writes it on 480 of the 525's hidden-power rows. The veil predicate's read of it (`cardVeil.js :: isVeiledPower`) was refused as a NEW identity. The chair ruled option (1), the governed rung; it is cut in §2.

**FINDING: a face's public `id` spells its house (for the chair; not acted on).** A card's `id` is its house's slug, for example `npc_thieves_guild_chapter`, `npc_underground_network` or `npc_power_the_independent_bloc` (the minted face of a power). The `id` is on the veil's identity floor and is the gallery's member-override key (`galleryMemberKey`), so it stays public, and 206 does not touch it. On a veiled face it therefore still names the house's family, or the hidden power's name, to anyone reading the raw anon payload; no rendered surface prints it. The pglite proofs exclude `id` from their no-name assertions, and say so. A cure would re-key the card ids, which moves every id-keyed ledger and the goldens. It is outside this manifest, so it is a question for the chair. PLAUSIBLE as a leak of consequence: the slug is a family or power name, not the card's title, and the hidden power's name and its `hidden: true` row are already public under `powerStructure` (§7).

## 1. Step 1: the bit, one cause (`dded069c1`, UNSIGNED)

**The predicate's one home** is `src/domain/people/cardVeil.js`:
- `isCriminalInstitution`, `isClandestineInstitution` and `isHideableHouse`, moved byte for byte from `display/galleryVeil.js`, which now imports them back;
- `isVeiledPower`: a power that is `hidden: true` or `category: 'criminal'`;
- the record readers `veiledOfInstitution`, `veiledOfPower`, `stampVeil`, `stampMembershipsVeil` and `isHousePublic`.

Nothing else in `src/` derives the predicate.

**The writers stamped, at birth:**

| writer | stamps |
|---|---|
| `generators/people/representatives.js :: generateRepresentatives` (the house faces, the hall-as-seat, the minted seat) | `institution.veiled`: `isHideableHouse(house)`, or `isVeiledPower(governing)` for the seat mint |
| `generators/people/castPowers.js :: assignCastPowers` | the `other` mints' `institution.veiled` (`isVeiledPower(f)`); EVERY membership in `join` (`memberships[].veiled`, THAT power's bit). This covers the backing memberships and the mints' |
| `domain/settlementMigrations.js :: migrateV1toV2` | the house it links from a legacy string (`stampVeil` against the record) and each membership it builds (`isVeiledPower(p)`). A car-born record it keeps is kept as written: unstamped, so fail-closed |
| `domain/npc/npcOps.js :: reassignNpc` and `store/settlementPendingEditWriters.js :: applyNpcOp` (`reassign-npc`) | the target's `institution` and `memberships` are stamped against the record. In the writer this happens BEFORE the no-effect check, so a reassignment to the same house is still `no_effect`. A DM cannot forge the bit: the admission wall (`pendingEditIntents.js :: institutionOf / membershipOf`) drops `veiled`, and the writer re-stamps it |

Not writers of the bit, measured:
- **The rename ledgers.** They re-spell the SAME house or power, so the veil class does not move.
- **`factionRoles.js`'s synthesized leaders and `entities/npcs.js :: assignNpcToRole`.** They write memberships on cards with no `institution` record. The public rule never publishes those memberships (no house record means no house keys), so they need no bit. If a later writer gives such a card a house, it gets one.

**The readers.**
- `display/publicSafe.js` reads the bits (§3). It does not import `cardVeil.js`: its three-line bit reader is inline, so the public chunk keeps its two-import closure (`clone.js`, `civility.js`). The bit is READ there, never derived.
- `galleryVeil.js` keeps reading the house predicate for the INSTITUTION card (X-21e). That is a house-level decision, not the face's, and it now comes from the one module.
- **`cardDoor.js` is unchanged, and this is deliberate.** Its door and honorific are resolved from `cardInstitutionOf(card)`, so they go wherever `institution` goes. The public projection now leaves `institution` exactly where the bit is false. A bit check inside `cardDoor.js` would hide the door on the DM's own card, where the veiled house is the DM's to see.
- The card schema documents the field (`settlement.schema.js`).

**The counts, at the tip.** These come from the same scratch instrument as step 0, extended to the bits and run after the per-entry ruling:

| | the 525 | the 1,000 |
|---|---|---|
| faces with the bit / absent / disagreeing with the predicate on the FINAL record | 14,366 / 0 / 0 | 29,020 / 0 / 0 |
| veiled faces | 1,359 (879 criminal houses, 480 hidden-power mints) | 1,616 (1,583 + 33) |
| memberships with the bit / absent / disagreeing | 17,115 / 0 / 0 | 30,840 / 0 / 0 |
| veiled memberships | 1,791 | 2,323 |
| memberships on an OPEN face | 15,700 | 29,608 |
| of those withheld by their own bit | 524 (all criminal powers) | 1,391 (1,386 criminal, **5 hidden**: soak1k-389's five) |
| open faces that lose at least one membership publicly | 524 | 1,374 |

The 879 / 480 of FIX-EXPORT-KEYS are reproduced exactly. The bit stamped at birth equals the predicate read on the final record for every face and every membership: the powers and houses the assembly's replay changes after the population step do not change any face's veil class on either corpus.

### The generator moves, for the merge's record

These were measured by the stage instruments over the parent `0c4cbbc86` (a clean worktree), each a fresh run at the step-1 tree. Nothing was re-recorded.

| surface | moved | where |
|---|---|---|
| generator golden master (`golden-master-stage.mjs --against`) | **525 / 525** | every settlement: every one has a face. thorp 84 · hamlet 84 · village 84 · town 105 · city 84 · metropolis 84. sha256 `c7c11b0b…` → `5ead1eb2…` at the final tip `1d8e6e60d` (both bits) |
| espionage fence (`refence.mjs --against`) | **360 / 360** | every row, 60 a tier |
| herald desk (`herald-stage.mjs`) | **0 / 470** | byte-identical |
| prose manifest (`prose-manifest-cells.mjs`, base and tip, `prose-manifest-diff.mjs`) | **0 / 1,050** | 68,780 cells UNCHANGED, 0 replaced, 0 re-indexed, 0 wording-only: no text moves |

**The per-row delta.** For each of the 525, the record was generated at the base and at the final tip, every `veiled` key on a card's institution and on its memberships was deleted, and the JSON was compared: **525 / 525 byte-identical** (31,481 bits stripped = 14,366 institution bits + 17,115 membership bits). So the bits are the whole move: no draw, no order and no other field changes. The fence (360 / 360, corpus sha `407609f4…` → `57795e27…`), the herald (0 / 470) and the prose (0 / 1,050, 68,780 cells unchanged) were re-measured at the final tip with the same figures as above.

**The arms that hash the goldens are red by this unsigned cause, as the brief foresees:** `tests/property/generatorGoldenMaster`, `tests/domain/worldFactRederive` A7 (the committed golden's stride, 7 of 7), and the fence. They are re-recorded by the merge seat, as every car's are. The edge-shared bundles (`supabase/functions/_shared/*Bundle.js`) are stale by the changed `src/` files (`aiGrounding`, `aiCharter`, `aiOutputSchema`, `engine`). As FIX-FOOD-ISOLATION recorded, the merge seat re-emits them at the final tip (`build:edge-shared`). At the base itself, 9 of these edge tests are already red (§5).

**The pins re-keyed with the cause** (each quoted the old shape):
- `tests/generators/people/representatives.test.js`: the seat mint's institution. Positive arm: every card's bit is a boolean equal to `veiledOfInstitution` on the record.
- `tests/generators/people/castPowers.test.js`: the mints' and the fixture's memberships. Arms: every membership's bit is `veiledOfPower`'s; a hidden power's membership is stamped true.
- `tests/domain/people5bEditOps.test.js`: the reassignment's stamped memberships.
- `tests/domain/settlementMigrations.test.js` gains the v1 → v2 arm: a criminal house from a string carries `veiled: true`, a parish `false`, and memberships in a hidden power and in a criminal power are stamped true.

## 2. The register rung 31 → 32: the infiltrated topology (`0095f7327`, `e161ee427`)

This was cut as PEOPLE-1 cut 29 → 30 and PEOPLE-LAND cut 30 → 31, in a worktree of its own at the clean tip `caba91879`. The branch was then fast-forwarded onto it, so the rung precedes the cause.

**Act 1** (`0095f7327`):
- The corpus builder gains **producer 1b′**: `CONFIGS[0]` × the four seeds with `stressTypes: ['infiltrated']`, entering `roots` and not `generated`. It is topology only, like 1b, 1c and 1d. It is a pass of its own rather than a third type in 1b's list, so 1b's four worlds do not re-deal.
- `BASELINE_SCHEMA` becomes 32, and `RETIRED_PEOPLE_LANDING_BASELINE_SCHEMA` 31, with the retired-31 validator re-bound to its literal and `validateSchema32Baseline` live.
- `INFILTRATED_TOPOLOGY_TARGET_SCHEMA = 32`, with its rationale beside it.
- The policy `schema-31-to-32-infiltrated-topology-v1`, the pairing 32: 31, the predecessor validator, and the transition entry with four delta paths (the corpus builder plus the three bookkeeping paths).
- The CLI default and allow-list, and both headers' rung lists.
- The pins in `observedShape{Baseline,Migration,Sentinel}`: 120 / 120.
- Nothing is declared and nothing is exempted.

**Measured** (`--scan-only --scan-mode=legacy-leaf` at act 1, against the committed schema-31 register):
- reads 2,193 → 2,193; identities 1,545 → 1,545;
- **NEW 0 · GONE 0 · INCREASED 0 · DECREASED 0 · SAME 1,545**;
- `corpusCompatibility` unmoved (seeds 4, configs 4, generations 16, pulseIntervals 12, shapeCount 1,719, simulationFlagsLit 92, steadingsMinted 12);
- the `factions` shape now observes `hidden`.

**Act 2** (`e161ee427`):
- the scan, then the report (act 1's figures exactly), then the review ledger (committed as `docs/fix-public-veil/osr-rung32-review.json`, 1,546 accepted decisions: 1,545 SAME rows and the scanner transition), then the bundle, then `--write --migrate-schema=32 --migration-review=<bundle>`;
- it froze 2,193 findings / 1,545 identities across 425 files;
- the bank is 77 reads / 51 addresses, with the literal module agreeing;
- the plain check is exit 0, and the eight observed-shape suites pass 287 / 287.

**What the rung admitted.** No identity. The chair's conditions foresaw admitting the veil's own read with its cause. Measured, there was nothing to admit: no committed reader of a key the infiltrated branch writes existed at the predecessor's tree, and the veil predicate's read landed AFTER the rung (`dded069c1`). At that point it is no finding at all, because its writer is observed: the plain check is exit 0 at `dded069c1` (2,193 findings, exactly the frozen inventory). No other reader was newly lit, since the inventory did not move. The walker's pins needed no re-key: none of its figures moved.

**The coverage holes (MEASURED; REPORTED for the owner's post-deploy queue, not acted on).** The generator's stress types are `data/stressTypes.js :: STRESS_TYPE_MAP`, 15 in all. The corpus's topologies run four of them:
- `insurgency` and `famine` (1b);
- `famine` (1c, 1d);
- `infiltrated` (1b′, this rung);
- `monster_pressure`, rolled by chance on 3 of the plain configs' 16 generations.

The other **eleven** have never been observed. Each one is a coverage hole of the instrument: a read of what its branch writes is invisible to the register. The table below lists the files that branch on each type. It is a literal grep of `src/generators`, `src/domain/generation` and `src/data`, with the type registries and the generated data excluded, so it lists the writers gated on each type, not necessarily keys no other branch writes:

| stress type | files | the files that branch on it |
|---|---|---|
| `under_siege` | 17 | computeActiveChains.js, defenseGenerator.js, density/applyDensityLaw.js, economy/economicState.js, economy/foodBalance.js, economy/primaryTradeLists.js, economy/prosperity.js, economy/viability.js, factionDynamics.js, foodGenerator.js, narrativeGenerator.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |
| `occupied` | 16 | computeActiveChains.js, defenseGenerator.js, density/applyDensityLaw.js, economy/economicState.js, economy/foodBalance.js, economy/primaryTradeLists.js, economy/prosperity.js, foodGenerator.js, narrativeGenerator.js, power/conflicts.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |
| `politically_fractured` | 9 | defenseGenerator.js, density/applyDensityLaw.js, economy/prosperity.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |
| `indebted` | 10 | defenseGenerator.js, density/applyDensityLaw.js, economy/prosperity.js, factionDynamics.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |
| `recently_betrayed` | 9 | defenseGenerator.js, density/applyDensityLaw.js, economy/prosperity.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |
| `plague_onset` | 12 | defenseGenerator.js, economy/foodBalance.js, economy/primaryTradeLists.js, economy/prosperity.js, factionDynamics.js, foodGenerator.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |
| `succession_void` | 9 | defenseGenerator.js, density/applyDensityLaw.js, economy/prosperity.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |
| `religious_conversion` | 9 | economy/prosperity.js, factionDynamics.js, power/conflicts.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |
| `slave_revolt` | 11 | density/applyDensityLaw.js, economy/foodBalance.js, economy/prosperity.js, foodGenerator.js, power/conflicts.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |
| `wartime` | 13 | density/applyDensityLaw.js, economy/foodBalance.js, economy/prosperity.js, foodGenerator.js, isolationGenerator.js, power/conflicts.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressNarrative.js, stressPriority.js |
| `mass_migration` | 10 | economy/foodBalance.js, economy/prosperity.js, foodGenerator.js, power/conflicts.js, power/governanceNarrative.js, power/stressFactions.js, priorityHelpers.js, safetyProfile.js, stressGenerator.js, stressPriority.js |

## 3. Step 2: migration 206 and the client twin (`c5d72d80a`)

**206** (`supabase/migrations/206_public_card_veil_bit.sql`) re-states `_gallery_sanitize_public_json` from 205's body by mechanical diff. Five things are added:
1. the constant `npc_house_keys = ['institution','memberships']`;
2. the constant `npc_house_named = ['title','role']`;
3. two locals read once per NPC object: `house_is_object` (`jsonb_typeof(institution) = 'object'`) and `house_is_public` (`institution -> 'veiled' = 'false'::jsonb`), **each `coalesce`d to false**;
4. the per-row rule. On an NPC object (`npcs[]` or a roster member):
   - the house keys ride only on a public house;
   - a face with an institution record that is not public loses `title` and `role`;
   - every other key takes 205's `npc_allowed`;
5. the per-entry rule. A public house's `memberships` keeps only the entries whose own `veiled` is the JSON false, in order. A non-array `memberships` is dropped whole.

Everything else is 205's byte for byte: `npc_allowed`, `public_toplevel`, the deeper denylist, the covert drop, `is_npc_obj`, the recursion, `immutable`, the pinned `search_path`, and the grant posture. The header carries the cause, the measurement, what a reader sees, and the ties-eye note (§7). `@rollback`: recreate 205's body verbatim. It is idempotent (`create or replace`, no signature change, no re-grant).

**Caught in red-first, before commit: the SQL failed OPEN on an absent bit.** Without the `coalesce`, `(institution -> 'veiled') = false` is NULL when the key is absent, `not NULL` is NULL, and the `continue` never fired. The unstamped card's institution and title rode through. The proof "a row without the bit is stripped" convicted it; the `coalesce` cures it.

**Its doors**, the same commit, done as 205's were:
- the rehearsal train's tail wave `public-card-veil-bit` 206..206 (expectedObjects `_gallery_sanitize_public_json`), and `MIGRATION_TRAIN_REPO_HEAD` 206;
- `tests/ops/migrationRehearsal.test.js`: the head pins 205 → 206, with the wave asserted documented-manual-reversal from its annotation;
- `docs/DEPLOY.md` "Current migration head" set to 206;
- `ARCHITECTURE.md` migrations (206);
- `docs/CURRENT_STATE.md` brought current: contiguous to 206, and "head 206 is 3 migrations ahead of the live-verified production head 203", with 204, 205 and 206 named as waiting on the owner's push. This cures `architectureFreshness`, red at the base since 204.

`supabase/applied-head.json` is not touched.

**The rehearsal receipt.** `npm run ops:migrations:rehearse -- --json`, a read-only plan, at the step-2 tree:
- exit 0; applied 203 → repo 206; **3 pending** (204, 205, 206);
- wave 206 sha256 `9c646965…` at step 2; **at the final tip, after the cure of §5: `1fe90bebe314029eb85a71cc6fac328b2b89ee363381fcf7d3da28b2b1cc509e`**, rollback documented-manual-reversal;
- 205's sha is unchanged (`d6691303…`).

The `--execute` receipt was not made, for FIX-EXPORT-KEYS's reason: it needs the attended production-shaped clone of the runbook. The SQL is executed in pglite.

**The twins' diff** (`src/domain/display/publicSafe.js`):
- `NPC_HOUSE_KEYS` and `NPC_HOUSE_NAMED_KEYS`, character-identical to the SQL constants and pinned;
- the inline bit reader `houseVeilOf` ('public' / 'veiled' / 'none');
- `isNpcKeyPublic`, the one per-key rule shared by the `npcs[]` projection and the roster-member gate, as the SQL's one `is_npc_obj` arm is;
- `publicMembershipsOf`, the per-entry filter;
- `publicCard`: `publicNpc`'s untouched literal, then the rule. It is used for `npcs[]` in default mode and for a non-revealed member under overrides.

`publicNpc`'s literal is unchanged, so the `npc_allowed ⇄ publicNpc` pin stands. The file still imports only `clone.js` and `civility.js`.

**The proofs** (`tests/security/gallerySanitizer.pglite.test.js`, executed in pglite, **23 / 23**):
- the net-current definition is 206 or later, and its two constants equal the twin's (anchored to the literal lists);
- **a hidden-infiltrator face comes out bare**: no institution, title, role or memberships, and no "bloc's speaker" or power name outside the `id`;
- **a criminal guild's face comes out bare**;
- **a parish priest comes out with its institution, title, role and memberships**;
- **an unveiled face with one public and one hidden membership comes out with exactly the public one** (an unstamped entry is dropped too; a non-array memberships is dropped whole);
- **a row without the bit is stripped**;
- **a pre-car NPC row is unchanged**: exactly 205's projection, with its title and role;
- a DM's person (`institution: null`) keeps its title and role and publishes no memberships;
- a roster member under `powerStructure.factions[].members` obeys the same rule;
- **client == server, field for field**, on all seven cards and both paths.

**Red first:**
- at 205 with the old twin: **8 of 23** fail;
- 206 with the old twin: **2** fail (the constants and client == server).

**PEOPLE-6's suite**, re-keyed with the cause (16 / 16):
- an open house's face keeps its row, its door to the house's card and its honorific on the public card, and prints "Pastor Robert Thomas" as on the DM's;
- an open power's minted seat keeps its door to the power's card;
- a veiled face and an unstamped face are bare (no title, no row, no door).

This resolves PEOPLE-6 §6's PLAUSIBLE.

## 4. Step 3: the dead-field readers outside the walker's reach (`5c200ba2f`)

The sweep is a grep of `supabase/` and `scripts/` for `factionAffiliation`, `secondaryAffiliation`, `linkedFactionIds`, `factionGoal` and `densityRungRole`, with comments excluded:

| hit | what it was | cure |
|---|---|---|
| `supabase/functions/generate-narrative/prompts.ts`: 3 reads (`frictionPoints`, `connectionsMap`, `tabNotes` extracts) | `faction: n?.factionAffiliation`, always undefined on a v2 record | re-pointed to `npcFactionOf(n)`, the card's BEST-ranked membership's power (`firstPowerOf`'s reading), undefined for a card in no power. Exported for its test |
| `scripts/audit/crime-signal-writers.mjs` | read `factionAffiliation`, `secondaryAffiliation` and `factionGoal` off generated NPCs | re-pointed to `powersByRankOf(n)[0]` / `[1]` and the card's own goals |
| `scripts/audit/religion-soak.mjs`, `religion-plane-soak.mjs`, `religion-coup-soak.mjs` (8 fixture NPCs) | planted `linkedFactionIds`, which the clergy plane no longer reads (`entityLinksFaction` reads memberships), so these NPCs linked to nothing | re-pointed to `memberships: [{ power, rank: 1, share: 1 }]` |
| `supabase/migrations/033 … 205` | superseded sanitizer bodies and 205's comments | none (historical; 206's code names none) |
| `scripts/lib/writer-dark-register.mjs`, `scripts/migrate-observed-shape-readers.mjs` (comments); `scripts/.observed-shape-readers-baseline.json` (frozen identity data); `scripts/ops/migrationRehearsalCore.mjs` (wave 205's purpose prose) | named, not read | none |

**No prompt's instruction text moves.** The DATA the three prompts receive moves: each NPC row now carries a power's name where it carried none. The referee is not needed for the prose (no generator text moves), but the AI layer's three passes see a fuller payload. That is said here per the brief. The edge payload is the DM's own record, and those passes' outputs are DM-private (on the public denylist), so no veil applies.

**The proof.** `tests/edgeFunctions/promptsNpcFaction.test.js` (new, 3 / 3):
- the reading of `npcFactionOf`;
- the three extracts, found by their output, each carry the card's power and never the retired field (anchored);
- a scan of `supabase/functions/**/*.ts` for the five names, comments stripped, finds none.

With `contracts`, `aiGroundingContract` and `factionNamePrecedenceScan`: 318 / 318. The audit scripts smoke-run exit 0 (`crime-signal-writers` 0..3, `religion-coup-soak`).

## 5. Step 4: the proof (at the final tip `1d8e6e60d`)

**The first proof run convicted the lane, and the cure is `e78d0cc67`.** The three-directory gate at `5c200ba2f` had five reds beyond the base's:

1. **`observedShapeReaders.walker`** ×2: a NEW `institution on settlement`. The twin's inline bit reader (`npc.institution` in `publicSafe.js`) was grounded by the register's legacy-leaf detector to the settlement shape, although the key is written, and observed, on the NPC card. Moving the same read into an import-free leaf, then into `cardPowers.js` and into `cardVeil.js`, under four names and three spellings, reproduced it every time. The one read that grounds to the card is `cardPowers.js :: cardInstitutionOf`'s. So the bit is now read THROUGH it: its return gains `veiled`, and the reader `cardInstitutionVeilOf` lives beside it and is re-exported by `cardVeil.js`.
   - **One consequence was made exact on both sides.** An "institution record" is what `cardInstitutionOf` reads: an object of kind `house` / `power` with a key or a name. A malformed object is no record, so it gets 205's projection, like a legacy string. 206's `house_is_object` says the same. No writer produces such an object, and a new pglite proof pins the parity.
   - **For the register's owners (PLAUSIBLE):** the detector's grounding of a bare `.institution` read is a false positive in any file it does not ground as a card. This is recorded, not changed.
2. **`ruinFilterRoster.walker`** ×2: `cardVeil.js :: veiledOfInstitution` reads `.institutions` by name to apply the predicate. It is EXEMPT as a name-lookup with its reason, and the reader count goes 101 → 102.
3. **`tuningRegister.walker`**: the dependents moved (`cardVeil.js` now imports the two tuning tables the predicate reads). It was refrozen through the ritual (`24ac7fbcc`): no value moved.

| run | result |
|---|---|
| `sh scripts/gate-tail.sh npx vitest run tests/security tests/lint tests/scripts` at the tip | 8 failed / 357 passed / 1 skipped files (366); **13 failed** / 5,020 passed / 1 skipped tests; exit 1 |
| the same at the base `0c4cbbc86` (a clean worktree) | 9 failed / 356 passed / 1 skipped files; 14 failed / 5,008 passed / 1 skipped tests |
| tip reds NOT red at the base | **0** (`comm -23` of the two failing-test lists is empty) |
| base reds cured at the tip | 1: `writerReach.walker` "the surfaceReach grammar round-trips" (the writer-reach `--write`, §6) |
| the importers of `publicSafe` / `toPublicSafe` / `galleryVeil` / `cardVeil` outside the three directories (32 files: FIX-EXPORT-KEYS's 30, now including the two people suites) | **724 / 724, exit 0** |
| the migration tests (12 files: `migrationSequenceAll.pglite`, `migrationRollbackDiscipline`, `migrationSearchPathPin`, `migrationGrantPosturePin`, `migrationContiguity`, `migrationAppliedHead`, `migrationOrdering`, `migrationRefIntegrity.meta`, `migration062Authz`, `migrations100to102`, `migrations104to106`, `migrationRehearsal`) | **100 / 100, exit 0** |
| tests/ops + tests/docs (at step 2) | 266 / 266: `architectureFreshness`, red at the base since 204, is green |
| `npm run build` | exit 0 at the tip and at the base |

**The red list at the tip, attributed: every one is the base's** (FIX-EXPORT-KEYS's list, less the writer-reach red this lane cured):
- `domainAnyCastBaseline` 5
- `institutionTable` 2
- `negativeAssertionAnchor` 2
- `proseWiringCensus` 2
- `mutationCoverageManifest` 1
- `sovereigntyLightingContract` 1
- `ledgerCitationIntegrity` and `provenanceMap`: ENVIRONMENT (no local `refs/heads/review-fixes-2026-07-08`)

**Outside the three directories, the reds this lane owns by its unsigned cause** (§1): the golden-hashing arms (`generatorGoldenMaster`, `worldFactRederive` A7, the fence) and the edge-shared bundles' freshness (stale by the changed `src/`, 9 of those edge tests red at the base already). All are the merge seat's re-record. `tierNounKeptRulings` and the other base reds of `tests/domain` / `tests/generators` (`densityLaw` ×4, `x46NpcBand`, `characterConsumers` ×3) are the base's: the same tests, run at `0c4cbbc86`.

**The build's bytes**, compared by chunk name with hashes stripped. 18 chunks moved, and the dist total grew from 34,901,672 to 34,910,847 bytes (**+9,175**):

| chunk | bytes | why |
|---|---|---|
| `generation.worker`, `customContentPreview.worker` | +3,586 each | the engine's copy of `cardVeil.js` and the stamping writers |
| `engine-core` | +1,495 | the same, in the main engine |
| `data` / `data-lazy` | +1,525 / −1,535 | `informationBrokerageTuning.js` now reached eagerly through `cardVeil.js` (the predicate's import, moved out of the lazy `galleryVeil` path) |
| `publicSafe` | +442 | the twin's per-row rule and its import of `cardPowers.js` |
| `gallery` | −265 | the predicate left `galleryVeil.js` |
| `settlementPendingEdits` | +164 | the edit layer's stamp |
| `engine`, `state`, `settlement-normalize`, and the rest | ≤ +129 each | small closure moves |

No ceiling is raised and none is touched. The build gate exited 0, and none of its checks reported a ceiling.

## 6. Registers

- **The observed-shape register.** The rung 31 → 32 (§2), then the plain `--write` re-stamps at `dded069c1` (`f98b50cc4`) and at the cured tip (`1d8e6e60d`). Each moved provenance only; the inventory stays at 2,193 / 1,545 / 425 files, the bank at 77 / 51, the literal agrees. The plain check is exit 0 at the tip. Nothing is declared and nothing is exempted.
- **Writer reach.**
  - `--write` at `dded069c1` (`f98b50cc4`): cohort 1,397 → 1,397; judged 11,991 → 11,994. The lane's three identities are `veiled on institution`, `veiled on memberships` and `hidden on factions`, each LIT or LIT-NAME.
  - The car's drift since `1994a2ef5` (closureSizes, scanStats.files, four `processingTags` reach strings), measured byte for byte by FIX-EXPORT-KEYS at its base, is folded in under the brief's word. That cures the base's writer-reach red.
  - Re-stamped at `1d8e6e60d`.
- **The legacy-reader walker**: green (`noLegacyFactionReaders.walker`).
- **The ruin-filter roster**: `cardVeil.js` EXEMPT, 101 → 102.
- **The tuning inventory**: refrozen through its ritual, dependents only (`24ac7fbcc`), and verified 75 / 75.
- **The rehearsal manifest, DEPLOY.md, ARCHITECTURE.md, CURRENT_STATE.md**: §3.
- **The dated roster**: this record, born dated. `byRule.dated` 105 → 106 with `_rosterGrowth2026-11-07-fix-public-veil`.
- **Untouched**: the wiring census, the lighting census, the fork census, the freeze register, every golden fixture.

## 7. Noticed (for the intake, not acted on)

1. **The hidden power is already public by name.** `powerStructure.factions` is public whole, and its rows carry `hidden: true` and the infiltrator's description ("Its presence is not known to the settlement"). The SQL and the twin strip neither. This lane closes the FACE (the mint's title and its tie to the power) and the MEMBERSHIPS (who serves it), not the power's own row. Whether the hidden power's row should leave the public payload is a separate ruling. PLAUSIBLE that it should.
2. **A face's public `id` spells its house** (§0's second finding).
3. **The DM's ties eye stays client-side** (FIX-EXPORT-KEYS §3.4). For an open house, the anon `get_gallery_dossier` RPC now returns the face's `institution`. A DM who shut that card's ties eye removes it only in the client's `applyVeil`. This is the same posture every other tie (`relationships`) already has. It is recorded in 206's header, not changed.
4. **`category` stays public** (the chair's ruling 1). On a criminal house's face it is the pool category `criminal`, so a public card still says "criminal" with no house named.
5. **Two writers stamp no membership bit by design**: `factionRoles.js`'s synthesized leaders and `entities/npcs.js :: assignNpcToRole`. They write memberships on cards with no house record, so the public rule never publishes those memberships. If they ever give such a card a house, they must stamp.
6. **The register's eleven unobserved stress types** (§2's table) are the owner's post-deploy queue.

## 8. CONFIRMED vs PLAUSIBLE

**CONFIRMED** (each read from a command's own exit code or output):
- every count in §0 and §1 (the 525 and the 1,000, both bits, 0 absent, 0 disagreeing);
- the generator moves and the per-row delta (525 / 525 identical, 31,481 bits);
- the rung's figures and its plain check exit 0;
- 206's proofs (24 / 24 at the cure) and red-first (8, then 2);
- the SQL's fail-open caught and cured (`coalesce`);
- the rehearsal plan's figures and wave 206's final sha256 `1fe90beb…`;
- the tip's reds ⊆ the base's (0 tip-only);
- the importers 724 / 724; the migration tests 100 / 100;
- the build exit 0 and its byte table;
- the edge prompt's re-point (3 / 3, 318 / 318 with the contracts).

**PLAUSIBLE:**
- That 206 applies cleanly in production. It is the same `create or replace` shape as 205 and runs in pglite and in `migrationSequenceAll`, but the attended clone `--execute` was not run.
- That the observed-shape detector's grounding of a bare `.institution` read is a false positive of its name prior. This is concluded from the experiments in §5, not from a trace of the detector.
- That §7.1 (the hidden power's own row) should leave the public payload. That is a ruling's to make.
- That the face's public `id` (§0) matters as a leak, given §7.1.

## 9. Merge notes (for the merge seats)

- **The observed-shape register's rungs compose in order: the car's 31, then this lane's 32, then its 33** (the second seat's veiled-id re-deal, §14). Rung 32 is cut on the car's genesis line (`aaa15f224` → `b61029f4d` → …), and its predecessor is the schema-31 register at `caba91879`. A merge that brings another schema-31 re-freeze must re-run this rung's two acts on the merged tip rather than resolve the register textually (MERGE-5AB's STOP is the precedent).
- The goldens (`generator-golden-master.json`, the fence's constant, `worldFactRederive` A7's pinned sha) move by this UNSIGNED cause. Re-record them at the final tip under the merge's signed record.
- The edge-shared bundles: `npm run build:edge-shared` at the final tip.
- Writer reach's baseline already folds the car's drift (§6). Do not re-fold it.

## 10. THE DEPLOY STEP (for the owner, in plain words)

**What this changes in production.** The same one database function as 205: the one that cleans a settlement before anyone can see it in the public gallery. After it:
- the face of a criminal house or of a hidden power shows only its name: no house, no title, no role, no powers, and its ties carry no title for it;
- a hidden power (the stress infiltrator) is gone from the public page entirely: its row, the conflicts and crisis stakes naming it, and its name anywhere else ("an unseen interest"). The "infiltrated" stress itself still shows;
- the face of an ordinary house (the parish priest, the miller) shows its house, its title and the open powers it belongs to, so the institution card's face row and the NPC card's link work on public pages;
- a membership in a hidden or criminal power is never shown.

No table, no column and no row of anyone's data is touched.

**Towns saved before this client.** They carry no veil bit, so 206 shows their faces with the bare name only (fail-closed); their hidden powers are hidden all the same, because that rule reads the power's own `hidden` flag. They keep their old card ids (which spell the house) until they are regenerated by the new client, which also restores an open house's title on the public page.

**When.** **206 goes in the SAME push as 205 and after it**, in the same migration train as FIX-EXPORT-KEYS's §9 step. The dry run lists **204, 205, 206**.
- **Database first, then client (recommended).** This is safe at every moment. An old client's public pages show a car-born face's bare name (the server strips the title it used to send), which only hides.
- **Client first, then database.** Also safe, but until 206 lands the server still sends every face's title, which is today's leak, for that window.

**How**, from a clean checkout of the exact commit you are deploying, never the old main checkout:
1. Optional, for release evidence: `npm run ops:migrations:rehearse`. It should show applied 203 → repo 206, 3 pending. Then the clone rehearsal in `docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md`.
2. `npx supabase@2.122.0 db push`. Its dry run should list exactly **204, 205 and 206** as pending. If it lists anything else, stop.
3. In the same sitting, bump `supabase/applied-head.json` to **206** with what the push printed. Then `SUPABASE_MIGRATION_HEAD=206 node scripts/check-migration-head.mjs` should print `live head 206 == repo head 206`.
4. Deploy the client on Vercel as usual. Then run `docs/ops/POST_DEPLOY_VERIFICATION_RUNBOOK.md`. A spot check: open a public gallery dossier of a freshly generated town with a thieves' guild. Its face shows a bare name; the parish priest shows "Pastor <name>" with a link to the church.

Never run the CLI's suggested `migration repair --status reverted …`.

**If it goes wrong (the rollback).** The database is forward-only.
- **Database:** write a new migration that recreates 205's version of the function, which is exactly what 206's `@rollback` line says, and `db push` it. Nothing is lost: the function holds no data. The only effect of the rollback is that faces' titles are public again and no face's house is.
- **Client:** revert the commit on master, or promote the last good deployment in Vercel (`docs/ops/DEPLOY_ROLLBACK_RUNBOOK.md` §1).


## 11. THE SECOND SEAT: the chair's rulings of 2026-11-08

The chair accepted the first hand-back (`4ce0d42bd`) and gave this lane a second seat, closing two more doors of the same leak:
1. **A veiled face's public `id` spelled its house** (`npc_thieves_guild_chapter`). Ruled **option (B): re-key at BIRTH**, from the same predicate module; nothing in the projection rewrites ids.
2. **A hidden power's own row and name were public.** Strip the row in the sanitizer and the twin, and strip or mask every other place the name appears. The stress TYPE stays ("Military status: infiltrated", W2 §F7).
3. The ties eye staying client-side for an open house: ACCEPTED as the DM's own view toggle.

Then the seat's own findings, ruled:
- **(a)** a veiled end's `npc1Role` / `npc2Role` on a tie is the card's title by another door: strip it;
- **(b)** the display-name qualifier ("Christophoros Laskaris (the network's head)") carried a veiled card's title into its name and every sentence naming it: **option (1), an age epithet at birth, for a VEILED card only.**

**The STOP on item 1, and why (B).** Measured first, as the chair asked:
- Inside the dossier JSON, NPC ids sit in exactly six places: `npcs[].id`; `relationships[].from`, `.to` and `.id` (the tie id embeds its endpoint, e.g. `tie_npc_seat`); and the crisis cast's `roles[].id` and `levers[].holderId`, in both stress containers. That held on both corpora.
- But ids are also KEYS outside that JSON. `get_gallery_dossier` (147) returns `gallery_member_overrides` raw to anon. That column is keyed by the original NPC id, and its `$veil` deltas address cards as `card:npc:<id>` / `field:npc:<id>:<eye>`. The client joins both by id.
- A rewrite in the sanitizer alone would have left the ids public in that column, and it would have broken the joins: a DM's field-level hide on a veiled card would stop matching, so the hidden field would RENDER.
- Re-keying at birth needs no reference chased.

## 12. The second seat: item 2 and finding (a), in 206 (`bedb6ebde`)

**Measured first** (`toPublicSafe` over the 525 / the 1,000):

| where the hidden power's name rode | the 525 | the 1,000 |
|---|---|---|
| the row itself (`powerStructure.factions[]`, `hidden: true`) | 480 | 34 (one world with a second hidden row, which contests the first's niche) |
| the crisis cast's `stakes[].factionId` (both stress containers, object or array) | 480 + 480 | 42 + 42 |
| conflicts naming it (`conflicts[]` and `powerStructure.conflicts[]`: parties and desc) | 37 + 37 | 1 + 1 |
| another row's `contestsNiche` | 0 | 7 |
| another power's `desc` | 0 | 1 |

A veiled title rode `relationships[].npc1Role` (the `from` end: 1,359 / 1,616) and `npc2Role` (the `to` end: 893 / 1,427).

**The rule** is ONE root pass INSIDE `_gallery_sanitize_public_json`: no helper, no signature change, so every caller and every extraction of the net-current body gets it. It reads two sets from the ORIGINAL record: each power row's own stamped `hidden`, by its `faction`; and each card's own bit, by the house-record test (stamped true or absent). In order, it:
1. drops a veiled end's `npc1Role` / `npc2Role`;
2. drops every `hidden: true` row from `powerStructure.factions`;
3. drops every conflict whose parties name a hidden power, at both homes;
4. drops every stake naming one, at both stress homes;
5. masks every remaining occurrence of the name, in a value or a key, as **"an unseen interest"** (`HIDDEN_POWER_MASK`). The mask replaces the name's JSON-escaped body, so the output is valid JSON by construction.

Every comparison is coalesced. The pglite proof caught a NULL trap before commit: a row with no `name` key was being dropped. Two reads first written on keys the register's corpus never produces (`contestsNiche`, and the `name` alias) were removed rather than admitted: every hidden row carries `faction`, and the mask covers a `contestsNiche` value. The client twin, `publicSafe.js :: publicVeilPass`, applies the same rule at the same point (before the member overrides).

## 13. The second seat: opaque ids and age epithets, at birth (`48bcc1f3e`, UNSIGNED; `04e81e488`)

**The id.** `people/cardVeil.js :: veiledCardIdFor(seed, slug)` returns `npc_veiled_` + 16 hex of sha256(`<record _seed>|<slug>`), using `contentFingerprint.js`'s synchronous `sha256Hex`.
- `representatives.js :: cardIdFor` mints it for a hideable house's face. **The uniqueness guard** is `cardIdFor`'s existing `taken` loop, which suffixes `_2`, `_3` for either form.
- `castPowers.js` mints it for a hidden or criminal power's face, through `mintIdOf`, which the unfaced filter shares.
- The seat mint keeps `npc_seat`: it spells no house.
- `ties.js` tells an `other` mint by kind (power, not the seat), no longer by the `npc_power_` prefix.

**THE SALT** is the record's `_seed`, which every public projection denies (the SQL allowlist and `publicSafe.js`). The mints read it in three places:
- the population step: `generatePopulation` passes `_seed: ctx._seed` in `generateRepresentatives`'s FIRST argument, never in the config, whose seed-keyed pickers it would move;
- the section regen: `generateSettlementPipeline` passes `settlement._seed`;
- the cast seam: `assembleSettlement` hands `ctx._seed` to `generateCoherence`, which LENDS it to the settlement for the enrichment call only (try/finally, and only when absent). That keeps landed packet EM-R2's pinned signature `export const enrichNpcCoherence = (settlement) => {` byte for byte (`04e81e488`).

**Accepted edges (the chair's words, recorded):**
- **The edit layer does NOT re-mint.** An id is a stable identity, so a card a DM later moves into a hidden house keeps the id it was born with.
- **Towns saved before this fix** keep their old ids until regenerated. That is not the car's regression.

**The epithet: THE LANE'S ONE AUTHORED TOKEN, FOR THE OWNER'S VETO.** The words are **"the Elder"** and **"the Younger"**, with "the Eldest" for a third, and "the Younger II", "the Younger III" … beyond. They are `npcDisplayNames.js :: VEILED_NAME_EPITHETS`.
- A VEILED card whose name collides takes one, appended where the title was ("Christophoros Laskaris the Younger").
- The rank is BIRTH ORDER. The chair ruled "by the two cards' ages where the record holds them, else by birth order". A generated card holds no age (no `age` on any card of the 525 or the 1,000), and reading one would have been a register red.
- The seam mint of a hidden power's face is "the Younger": it is born after its namesake.
- An unveiled card keeps its title qualifier, because its house is public.

The ten cards on the 1,000:
- soak1k-46 Eire Skleraina the Younger (Front businesses)
- soak1k-101 Lamat Yam the Younger (Black market bazaar)
- soak1k-275 Dalila al-Qadir the Younger (Thieves' guild (powerful))
- soak1k-292 Ruadh MacSween the Elder (Black market)
- soak1k-394 Qutlugh Jadaran the Elder (Front businesses)
- soak1k-603 Aurelius Macer the Younger (Smuggling operation)
- soak1k-664 Kinich Dzul the Younger (Underground network)
- soak1k-791 Akna Dzul the Younger (Whisper market)
- soak1k-815 Owl Jalach the Younger (Front businesses)
- soak1k-970 Egilbert Wenzel the Younger (Black market)

None collides on the 525. The prose that carries the name follows by construction: the tie descriptions and the tensions.

**The pressure lines.** One door did NOT follow by construction: the pressure sentence writes the title as an apposition ("Qian Deng, the smuggler, knows more…", 1 on the 1,000). `narrativeGenerator.js` now hands a veiled top card's name and role to no template, so each template takes its own anonymous fallback ("the most senior official"). There is no server masking: 195's header stands.

**THE PROOF WALK**, over `toPublicSafe` of the born record:

| | the 525 | the 1,000 |
|---|---|---|
| veiled faces with an opaque id | 1,359 / 1,359 | 1,616 / 1,616 |
| public ties / unresolved / touching a veiled face | 14,606 / **0** / 2,079 | 28,916 / **0** / 2,846 |
| a veiled face's title anywhere in the public JSON | **0** | **0** |
| a hidden power's name anywhere in the public JSON | **0** | **0** |
| a veiled house's slug on a face path (`npcs`, `relationships`, the crisis casts) | **0** | **0** |
| the slug on the HOUSE'S OWN rows | 1,077 (`institutions[].catalogId` 849, the economic compounds 84 + 84, chain ids 60) | 1,676 |

**FINDING (for the chair; not acted on).** The criminal house ITSELF is public at the SQL level: its row in `institutions[]`, its catalogue id, its economic chains. Only the client veil hides its card by default (X-21e). The face no longer names it, but the house is not this ruling's.

**The pglite proofs** (`gallerySanitizer.pglite.test.js`, 27 / 27):
- the hidden power's name appears nowhere, the second hidden row's neither, and the open powers, conflict, stake and stress type stay (anchored);
- another row's mention is masked;
- a veiled face's ties carry no title at either end, an open end keeps its role, and every tie resolves;
- client == server on the fixture and on three generated cities with `stressTypes: ['infiltrated']`, where every born veiled id is opaque, no face path spells the house, and every tie resolves.

Also: `representatives.test` (a veiled face's id is opaque; the same seed mints the same ids, another seed others; no id spells its house) and `castPowers.test` (re-keyed with the cause).

## 14. The second seat: the generator moves, the registers, the proof (at `04e81e488`)

**The generator moves** (UNSIGNED, the lane's one cause; nothing re-recorded), over the lane's base `0c4cbbc86`:

| surface | moved | note |
|---|---|---|
| generator golden master | **525 / 525** | sha256 `c7c11b0b…` → `8455daa2…` |
| espionage fence | **360 / 360** | corpus sha `407609f4…` → `35aaf807…` |
| herald desk | **moved** (rows 470 → 475) | the re-dealt veiled cast |
| prose manifest | **5 + 75 towns** | REPLACED 10 cells (5 towns: `overview.conflicts`, the conflicts a hidden power no longer heads), WORDING-ONLY 152 (75 towns: the epithets and the re-dealt veiled faces' names), ADDED 288, REMOVED 0; 68,618 cells unchanged |

The per-row delta is no longer "only the bit". Since `48bcc1f3e`, a veiled face's opaque id keys its forks (`people-faces`, `people-ties`, `people-hooks`, each keyed by card id), so the veiled faces re-deal their bodies, ties and hooks. The cause is the same and is named.

**The registers:**
- **The observed-shape rung 32 → 33** (`a69c472b7` / `6b85e6509`, the three bookkeeping paths; the corpus definition is unchanged):
  - NEW 4, all ONE identity, `covert on impairments`, in `corruption.js`, `entities/status.js`, `beliefMap.js` and `institutionStatusLifecycle.js`. The re-dealt year no longer reaches the covert-corruption writer. ADMITTED WITH ATTRIBUTION.
  - GONE 12, the same re-deal's shrink: `nearbyResourcesState on config` (9 files) and `resourceHistory on settlement` (3) are now observed.
  - Froze 2,177 / 1,537 / 425 files; the bank is 77 / 51. The review is `docs/fix-public-veil/osr-rung33-review.json`.
  - **The register's rungs compose in order: the car's 31, then 32, then 33.**
- **The observed-shape walker's corpus year** (`97a0bf8b6`): final 399 → 394, accumulated 2,518 → 2,493, unique 400 → 395, regional 81 → 82. The base reproduces the frozen figures.
- **Writer reach**: `--rebank --charter='§934.105'` (`77b6edb9f`). The ordinary `--write` refused 38 DARK identities: the simulation's id-keyed ledger rows re-spelled by the opaque ids, and the re-dealt year's resource rows. This is PEOPLE-1's class and the cost option (B) named. Cohort 1,397 → 1,418, 17 stale.
- **The fork census** (`b7e599bf4`): `corruptionPass|npcs` keyMoves 20 → 19; the external `fnv1a32` count 15 → 13.

**The proof at `77b6edb9f`, plus the cure `04e81e488`:**

| run | result |
|---|---|
| tests/security + tests/lint + tests/scripts | 12 failed files / 20 failed tests. Two were convicted and cured at `04e81e488` (`implementationPackets`' EM-R2 pin; the holder census's citation). After the cure, every red is either the base's or one of the news family below |
| **red by this lane's cause, NOT re-recorded (the precedent: the chair's door)** | the news-family reference walkers: `newsHeadlineContract`, `newsVoiceContract`, `proseFamilyContract` ×5. They re-derive the corpus's AO-0 year, which the veiled re-deal moved (the walker figures above). PEOPLE-1 CAST left the same class "for the chair (M-3's door)". The goldens' arms outside `tests/lint` are the merge seat's: generatorGoldenMaster, pipelinePinnedMode ×3, pipelinePinnedChoosers, nameHeldThroughAssembly, rosterFinalUnderHeldRoster, powerEconomyFreshness, worldFactRederive A7 |
| the importer suites (32) | **725 / 725** |
| migration tests + tests/ops + tests/docs + the edge prompt | **336 / 336** |
| the wide run (generators, domain, store, components, lib, pdf) at `48bcc1f3e` vs the base | 10 tip-only reds: the 8 golden arms above and the fork census's two, re-keyed at `b7e599bf4` |
| `npm run build` | exit 0 |

**206's rehearsal plan** at the tip: exit 0; applied 203 → repo 206; 3 pending; wave 206 sha256 **`065b4d81b9a3be74d347a5ce2eb73ca0442f43bf84b815f97f444805015d31fc`**, documented-manual-reversal. This supersedes §3's and §5's shas, because 206 gained the root pass. 206 is still not applied anywhere: the train is only rehearsed.

## 15. The second seat: CONFIRMED vs PLAUSIBLE

**CONFIRMED:**
- the proof walk's every figure (§13);
- the pglite proofs 27 / 27, including client == server on generated infiltrated towns;
- the rung's figures and its exit-0 check;
- the walker's year measured at both trees;
- writer reach's rebank figures;
- the census re-keys from their own printed measurements;
- 206's sha;
- the EM-R2 and holder-census cures, each green from its own run;
- the ten epithet cards, listed by a run.

**PLAUSIBLE:**
- That the news-family walkers' movement is wholly the veiled re-deal. They read the same AO-0 year the walker's figures measure moving, but they were not re-derived here.
- That a veiled face's slug is reversible only by someone holding the record's `_seed`. The salt is denied on every public path this lane knows, but a past export that carried `_seed` would expose it.
- That §13's finding (the criminal house itself public at the SQL level) matters.

## 16. Open items (the chair's ruling of 2026-11-08, on the hand-back at `b367506f8`)

The criminal HOUSE's own row being public at the SQL level is PRE-EXISTING, not a leak the car introduced. The institutions list and the client veil both predate the car, and it is a spoiler exposure to someone reading network traffic. A server-side strip would collide with the DM's per-member reveals, which are applied client-side and keyed by the original ids. So it is a design, not a cure for tonight. It goes to the owner's post-deploy queue as:

> a server-side institutional veil — the sanitizer applies the DM's reveals first, then drops each unrevealed hidden house's row and masks its chains and catalog id; measure the public page's dependence on those rows first.

The news-family reference walkers (`newsHeadlineContract`, `newsVoiceContract`, `proseFamilyContract`) are left red by this lane's cause, for MERGE-WAVE's one act. The lane is complete.

## 17. The tip

`lane/fix-public-veil-2026-11-07`, the commit carrying this file's last edit.
