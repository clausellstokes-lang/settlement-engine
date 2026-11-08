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
> - this record
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
| generator golden master (`golden-master-stage.mjs --against`) | **525 / 525** | every settlement: every one has a face. thorp 84 · hamlet 84 · village 84 · town 105 · city 84 · metropolis 84. sha256 `c7c11b0b…` → `7c4f9bc4…` (this measurement predates the membership bit; the per-entry bit adds the key on memberships of the same 525 rows) |
| espionage fence (`refence.mjs --against`) | **360 / 360** | every row, 60 a tier |
| herald desk (`herald-stage.mjs`) | **0 / 470** | byte-identical |
| prose manifest (`prose-manifest-cells.mjs`, base and tip, `prose-manifest-diff.mjs`) | **0 / 1,050** | 68,780 cells UNCHANGED, 0 replaced, 0 re-indexed, 0 wording-only: no text moves |

**The per-row delta.** For each of the 525, the record was generated at the base and at the tip, the tip's every `veiled` key was deleted, and the JSON was compared: **525 / 525 byte-identical** (14,366 bits stripped, institution bits only). This was measured at the institution-bit tree; the membership bit is the same kind of key on the same cards. So the bit is the whole move: no draw, no order and no other field changes.

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
- wave 206 sha256 `9c646965ff0497b870f3beac87700c2e1bfc48d8bb8e246ec1cf67d10cef0342`, rollback documented-manual-reversal;
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

## 5. Step 4: the proof

FIGURES-PENDING: the three-directory gate (tip and base), the importer suites, the migration tests, and the build land in the next commit.
