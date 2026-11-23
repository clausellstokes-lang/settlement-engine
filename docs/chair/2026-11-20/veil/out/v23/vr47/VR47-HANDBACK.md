# VR47 hand-back: the honorific's seed (builder for VEIL-23, branch `v23-vr47`)

**Commit:** the one commit that carries this file, on `v23-vr47`, parent `4d91d5c5f`. A file cannot hold its own commit's
hash. Read it with `git log -1 --format=%H -- docs/chair/2026-11-20/veil/out/v23/vr47/VR47-HANDBACK.md`. The hash is also in
the builder's report to VEIL-23.

## The cure
- `src/data/faceHonorifics.js :: honorificSeedOf(name, title)` returns `"<name>::<title>"`, both trimmed. It is the one builder
  of the seed. Gender is not in the seed: it picks only the gendered form, as before.
- Both callers now pass `honorificSeedOf(card.name, inst.title)` in place of `<card id || name>::<institution key>`.
- `honorificOfTitle`, the pools and `styledTitleOf` are unchanged (byte for byte; `styledTitleOf` takes no seed).

## The callers found (every call of `honorificOfTitle` in `src/`, `scripts/` and `supabase/`)
1. `src/domain/people/cardDoor.js :: cardHonorificOf`: old seed `${c.id || c.name}::${inst.name}`, where `inst.name` is
   `cardPowers.js :: cardInstitutionOf`'s `key || name`. It is read through `faceNameOf`, `seatKeeperDisplay.js ::
   shownHonorificOf` and `connectionOf`, by `npcComponents.jsx` (the NPC card's role row) and `InstitutionsTab.jsx` (the
   Connection row).
2. `src/domain/people/seatKeeper.js :: keeperHonorificOf`: old seed `${c.id || c.name}::${inst.key}`. It is read through
   `keeperFormOf`, `seatKeeperLineOf` and `keeperStyledNameOf`, by `npcComponents.jsx`, `tonightSheet.js`, `patronage.js ::
   dmPowerViewOf` (the DM panel), `seatKeeperDisplay.js` and `powerStrata.js :: rulingChainOf` (`absence.line`, which only
   `PowerTab.jsx` prints).
3. `supabase/functions/_shared/engineBundle.js` holds the GENERATED copy of 2. I did not touch it (it is under `supabase/`).
   See "Reds still standing".

There are no other callers. `scripts/` and `src/generators/` hold none. The remaining matches are tests and old probes under
`docs/`.

## Display only: the proof that no generator or stored path reads the pick
- `src/generators/` contains no `honorificOfTitle` or `honorificSeedOf`. This is pinned by
  `tests/domain/people/honorificSeed.test.js`.
- The generator's closure does reach `seatKeeper.js`: `rulingChainOf` is called by `crisisCast.js :: seatRows` and by
  `seatHolderFindings.js`, and on an EMPTY seat it computes `seatKeeperLineOf`, which calls `honorificOfTitle`. Neither caller
  reads `absence.line`: they read only `chain.npc` and `chain.absence.kind` (checked in the bundle; `PowerTab.jsx` is the line's
  only reader). So the pick is computed there and then thrown away. It reaches no stored byte.
- **Executed proof:** `voidbirths.mjs` ran at the old tree (`git archive HEAD`) and at the new tree over 36 `succession_void`
  births (six sizes x six; all 36 seats are empty, so the path above is live in every birth). `voidbirths.old.tsv` and
  `voidbirths.new.tsv` have equal sha256 for every record. The three born towns' births and stored records are also
  byte-equal between `red.json` and `green.json` (`birthSha256`, `storedSha256`). `styledTitleOf`'s table (1,174 rows: every
  card's title and role on the born towns, and every registry title x gender) has an equal sha256 in red and green.

## RED, at the tip (`red.json`, by `probe.mjs`)
The born towns are the render-twice harness's three, with the same seeds and dials: town-calm-0, city-infiltrated-1 and
metropolis-calm-2. Together they hold 163 cards with an institution. Each page is read twice, with every person's id re-keyed
by two different maps. This emulates VR10: every string equal to an id, and every key, is replaced.
- **(a)** Two id maps: 73 of the 163 cards print a different honorific on the owner's page (19 / 23 / 31), and 72 on the shared
  page (19 / 22 / 31).
- **(b)** The institution key alone moved: 135 of 163 cards move their honorific (29 / 43 / 63). The arm tries five other keys.
  A two-form pool picks by `fnv1a32 % 2`, which reads only the parity of the seed's odd bytes, so a single suffix can hide
  the dependence.

## GREEN, at the cure (`green.json`, by the same probe)
- **(a)** 0 of 163 cards differ between the two id maps, on the owner's page and on the shared page.
- **(b)** 0 of 163 cards move when the key moves.
- The keeper's line never differs. The keeper path is also pinned on 12 empty-seat births (id re-key, then key moved) in
  `tests/domain/people/honorificSeed.test.js`.
- **Owner's page vs shared page:** in each town, exactly one card prints differently, and only in the gendered form (Landlady
  and Landlord, Goodwife and Goodman, Abbess and Abbot). The default veil withholds that card's `gender` (and `goal`, `secret`,
  `plotHooks`, `power`, `importance`, `structuralRank`) on the shared page, so the pool's masculine default prints there. The
  seed is the same on both pages. That is the "gender chooses only the gendered form" clause meeting a withheld gender, in
  `galleryVeil*` territory, which is not mine. Every other card prints the same honorific on both pages.
- `tests/data/faceHonorifics.test.js` and every test that pins a drawn title: green, or re-recorded below. `npx vitest run` on
  8 files (the re-recorded ones, the guard, `seatKeeper*`) gives 62 of 62.
- Typechecks: `typecheck:ratchet` OK (167, ceiling 167) and `typecheck:domain:strict` OK (1113, ceiling 1113).
  `typecheck:domain` exits 2 at the tip and here, with errors only in `src/domain/worldPulse/*` and none in a touched file.
- eslint on every touched file: exit 0.
- Render-twice harness `tests/security/shareRenderTwice.pglite.test.jsx`: 4 of 4 green at this tree (`render-twice.txt`,
  `render-twice/render-twice.json`).
- The targeted set (125 files): `tests-at-tip.txt` and `tests-after-cure.txt`.

## THE COUNT, for the owner's list (`count.txt`, by `count.mjs`)
**58 of the 163 born-town cards** print a different honorific on the owner's page under the new seed than under the old one,
for the same person in the same office: town-calm-0 8 of 34, city-infiltrated-1 15 of 49, metropolis-calm-2 35 of 80.
`count.txt` lists each change, for example Selmeg Ba'arin, the garrison commander: "Captain -> Commander".

## Pins re-recorded (the cause of each: VR47, the pick re-seeded from `id::institution key` to `name::title`)
1. `tests/components/people6InstitutionFaceLinks.test.jsx`: Robert Thomas the priest now draws **"Father"**, no longer
   "Pastor". Five expectations change. The pin `{...PASTOR, id: 'npc_robert'} -> 'Reverend'` asserted that the id MOVES the
   pick. It now asserts that neither the id nor the house key moves it. One test title changes to name "Father Robert
   Thomas". **For the owner:** this is the owner's own example face ("Pastor Robert Thomas", 2026-11-07). "Pastor" is still
   the pool's seedless canonical form (pinned in `faceHonorifics.test.js`), but this name and title now draw "Father".
2. `tests/data/faceHonorifics.test.js` (item 14): the card door's fallback seed in the test is now `honorificSeedOf('A B',
   title)`, no longer `'npc_x::K'`.
3. `tests/data/faceHonorificsHolder.test.js`: MOVE [1] now reads "Ferry-Master Cveta Klimov" (was "Ferry Keeper"). MOVE [2]
   now reads "Skipper Borchigid Kiyad" (was "Boat-Master"). Both still do not open on the old sexed word. KEEP [3] now reads
   "Camp Master Cuauhtli Ahau" (was "Foreman"): the pool's other, unsexed form.
4. `tests/domain/bar4PeopleKinds.test.js` C18802: Latifa al-Amin now draws "Host" (was "Landlady"). She is still no
   Landlord. C2708 still reaches the feminine form.
5. `tests/components/dossierPhoneFloorAllViews.test.jsx`, Institutions only: DESKTOP measured/sub14 72 -> 77, MOBILE prose
   71 -> 76. Cause, measured on the walk's town: the Connection rows' honorifics are re-picked, and nine rows cross the
   walk's 45-character measure (seven in, two out), a net of +5. No token moved.

No equality was loosened. Each re-record keeps its exact `toBe` / `toEqual`.

## Added
`tests/domain/people/honorificSeed.test.js` holds five guards:
- The seed is the name and the title alone.
- Every multi-form title x 40 names x both genders: id or key moved, honorific held.
- The empty seat's keeper (line, card and keeper form), over two id re-keyings and a moved key.
- A source scan: every `honorificOfTitle(` call in `src/` passes `honorificSeedOf(`.
- No `src/generators/` file names either function.

## Reds still standing
1. **`tests/edgeFunctions/edgeSharedBundleReproducibility.test.js` > engineBundle.meta.json** is red once the inputs are
   staged: index hash `abf84ea288286052`, recorded `cab0dcca92d6ffd0`. `seatKeeper.js` and `faceHonorifics.js` are inputs to
   the engine bundle, and re-emitting it (`npm run build:edge-shared`) writes `supabase/`, which I may not touch. The seat
   re-emits it at merge. Until then the bundle's copy of `keeperHonorificOf` still seeds by `id::key`. That copy is only
   reached on the generator path above, which discards the line, so the service's output does not move (the void-birth
   proof).
2. The owner's page vs the shared page, one card per born town, differ in the gendered form only, because the shared page
   withholds that card's gender (see GREEN). This is not a seed effect, and it is outside my files.
3. Red at the tip before the cure, and unchanged after it (not VR47's): `tests/components/phoneChromeFloor.census.test.js`
   (/create, /settlements and /gallery floored +2), `tests/lint/presumedThings.walker.test.js`,
   `tests/lint/presumptionClasses.walker.test.js` (`gallerySecondHomes.js`, `criminalVeilSwitch.js` literals) and
   `tests/lint/writerReach.walker.test.js` (`veiled` on allegiance).

## How to re-run
- Probe: `TREE=<tree> OUT=<file> node --import ./jsx-loader.mjs probe.mjs` (run from the tree root with the paths to this
  directory). The loader compiles `.jsx` with the tree's esbuild.
- Count: `node count.mjs`.
- Void births: `TREE=<tree> node voidbirths.mjs`.
