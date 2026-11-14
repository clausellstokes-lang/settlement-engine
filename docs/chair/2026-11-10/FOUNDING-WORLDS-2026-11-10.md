# FOUNDING-WORLDS — 2026-11-10

**The owner, 2026-11-10, verbatim:** "Also after everything has merged, you need to regeenrate mossgate, cnocby, and black crag vwith the updated system"

Seat FOUNDING-WORLDS, a child of the cloud chair (session_01FbPLbejcfwX5nii12VM673). Rehearsal at `ecadf531a`; the act on `lane/founding-worlds-2026-11-10`, cut from `f0f98d883` (the chair's base: every generator-moving lane is in by then). The chair's rulings: F1–F5, N1–N7, N5b. Every teaser and narration word is an OWNER VETO POINT.

## 1. The commits (one cause each, red first)

| commit | cause | red before → green after |
|---|---|---|
| `be56efb67` | Black Crag `blackcrag-016` → `blackcrag-045`; every card's bones pinned | `tests/data/foundingWorldBones.test.js` × "is ruled by its guild-masters (tags: Guild power)", 1 failed / 10 passed → 11/11 |
| `a1f2b79f5` | N5b: a sample fork is forged at the card's own five priorities | `tests/store/sampleForkPriorities.test.js` × "sample-cnocby: expected { priorityEconomy: 34, … } to deeply equal { priorityEconomy: 49, … }" → 3/3 |
| `45a5e622c` | N1: the landing narration narrates exactly its three receipts | `tests/copy/landingNarrationGrounding.test.js` × names `["Elder Council", "Odhrán MacCarthy", "Gallagher", "Inghean MacCarthy"]`; × "four chances in a hundred, more than doubled" absent → 4/4 |
| `8b1d0d6ad` | N2: the landing brief's bakehouse clause cut | `tests/copy/landingProseGrounding.test.js` × `["bakehouse", "bake"]` → 12/12 |
| `08c36904f` | N8 · Black Crag: the teaser promises what 19 of 20 forks carry; the pin holds the forks | the fork arm with the old clauses: "Black Crag: ruled by its guild-masters — 1/20" → 3/3 |
| `1320a8540` | N8 · Mossgate: teaser and tags re-matched | "Mossgate: … Religious tension — 16/20", "… quietly profit … — 15/20", "… Contested council — 14/20" → 3/3 |
| `1c22f4227` | N8 · Cnocby: teaser and tags re-matched | "Cnocby: the carters who still stop … — 8/20", "… Quiet criminal pressure … — 1/20" → 3/3 |
| `41e129220` | the lane's own register reds: the mutation-coverage manifest (two rationale entries), one anchored negative assertion | TOTALITY missing 2 files; 1 un-anchored negative → green |
| this commit | this record, the four dossier crops, the dated roster 231 → 232 | — |
| next | the lighting census re-frozen through its door at a clean tip (test files 3185 → 3188, this lane's three new files) | — |

## 2. The parity table — each card at its canonical seed, measured at `f0f98d883`

Generated as a fork reaches the pipeline: `DEFAULT_CONFIG` + `forkConfigFor(sample)`, through `birthConfig`, `loadGenerationLawPayloads()` awaited. The predicates are the bones pin's (`tests/data/foundingWorldBones.test.js`); the hunter is quoted in §4.

| card · claim / tag | the generated fact (field) | holds |
|---|---|---|
| **Cnocby** `cnocby-033a` · "a mountain village on a through road" / Mountain road | tier `village` · terrainType `mountain` · tradeRouteAccess `road` | ✓ |
| "the good timber was cut out" / Exhausted timber | `mountain_timber` condition `depleted` ("The accessible mountain stands have been cleared faster than they can regrow.") | ✓ |
| "the carters who still stop" | arrivalScene "A merchant argues with a carter on the road into Cnocby…"; institutions Waystation, Stable master, Pack animal trader | ✓ |
| "whose cousin to ask about the rest" / Quiet criminal pressure | institution Bandit affiliate; no criminal faction; `criminalCaptureState` none | ✓ PLAUSIBLE (a reading of "quiet") |
| **Mossgate** `mossgate-004` · "a rain-grey harbour town" / Coastal trade | tier `town` · `coastal` · `port`; Docks/port facilities, Harbour master's office; maritime exports. "rain-grey" is colour, and no field carries weather | ✓ |
| "the council and the temple have stopped speaking" / Religious tension | `recentConflict` "The church is demanding veto power over council appointments. Church Council has not yet refused publicly." (governing: Church Council) | ✓ PLAUSIBLE |
| "the merchant guilds quietly profit from the silence" | Merchant Guilds 22, the second power and not the government; prosperity Prosperous | ✓ PLAUSIBLE |
| Contested council | conflict Merchant Guilds × Craft Guilds, "Succession to a council seat" | ✓ |
| **Black Crag** `blackcrag-016` · "a mountain city built on iron" / Industrial | city · mountain; Smelter, Blacksmiths (3-10), Specialized metalworkers | ✓ |
| "ruled by its guild-masters" / Guild power | `governingName` **"Noble Governorship"** | **✗** |
| "whose mines now give up too little ore" / Dwindling resource | `iron_deposits` depleted; Mine; "Iron ore (local mines exhausted)" | ✓ |

**The pins still do their work.** Across 20 suffixed forks, `iron_deposits` is depleted 20/20 and Cnocby's `mountain_timber` is depleted 20/20, in both slider modes.

## 3. The re-seed (F2, N4)

`blackcrag-016` → **`blackcrag-045`**, hunted under the SAME config from `blackcrag-017` upward: **29 tried**, re-proven at `f0f98d883` (the rehearsal found the same seed at `ecadf531a`). At `blackcrag-045` every bone holds: `governingName` "Merchant Guild Council" (31, governing; Merchant Guilds 23, Craft Guilds 12), `iron_deposits` depleted, Mine, Smelter, "Iron ore (local mines exhausted)", a city of 6,327 (was 11,042). The teaser and tags are **unchanged**.

**Saved forks stay whole, and nothing reads the old seed.** A fork persists its own `_seed` (`blackcrag-016-<who>`) and the stamp `_forkedFromSample: 'sample-blackcrag'`, and the sample id did not change. `forkSeedFor` is read only at fork time. `FORK_SEED_MAX` (`src/lib/anonForkSalt.js`) is unchanged, because both seeds are 13 characters. One side effect: a reader who re-forks Black Crag after this change gets a new town, because the card seed under their suffix changed.

## 4. The hunter (kept outside `scripts/`)

```js
// FOUNDING-WORLDS hunter. node hunt.mjs <root> <sampleId> check <seed> | forks <seed> [N] [--random] | hunt <prefix> <from> <budget>
const gen = (seed) => generateSettlementPipeline(
  birthConfig({ ...DEFAULT_CONFIG, ...forkConfigFor(sample), ...(RANDOM ? { _randomizePriorities: true } : {}) }),
  null, { seed, customContent: {} });
// hunt: for i in 0..budget: seed = `${prefix}-${String(from + i).padStart(3, '0')}`; first seed where every BONES predicate holds.
// BONES['sample-blackcrag']: city/mountain · iron_deposits on the card + Smelter · /guild/i on governingName ·
//   iron_deposits depleted + Mine · Blacksmith/metalwork/smelter institutions (the same predicates as the pin).
// forks: seed `${cardSeed}-f${i}x${(i * 2654435761 >>> 0).toString(16)}`, i = 0..19.
```

## 5. N5b — the fork keeps the card's priorities

**The defect.** The store ships `randomSliderMode: true` (`src/store/configSlice.js`), and `settlementGenerateAction` spread `_randomizePriorities: true` after the config's own keys. As a result, every fresh visitor's "Visit" re-rolled the five dials the card states.

**The cure.** One condition, `state.randomSliderMode === true && !isSampleFork`, on the action's existing fail-closed `isSampleFork`, the variable that already scopes the allowance exemption and the curated tier floor. Both doors pass `GENERATION_INTENT_SAMPLE_FORK` (`FoundingWorlds.jsx :: forkSample`, `SettlementsPanel.jsx :: forkSample`). The visitor's mode is not written, and an ordinary forge still rolls. Goldens at 0: `generatorGoldenMaster` + `dmLayerGoldenIsolation` + `generationForkCensus` 25/25, no re-record.

**For the owner, a fact with no change made.** The landing's "Forge this exact town" does not skip the roll. It replays it with `setRandomSliderMode(fixture.forge.randomSliderMode)` (`true`), so a visitor who presses it leaves with their slider mode set to Random.

**Fork rates.** Twenty suffixed forks per card, using the same suffix scheme in every column (`<card seed>-f<i>x<hash>`; Black Crag's base seed is `-016` in the first two columns and `-045` in the last two).

| bone (forks) | `-016` era · rolled (before) | `-016` era · card dials | at `f0f98d883` · rolled (before N5b) | at `f0f98d883` · card dials (= every fork after N5b) |
|---|---|---|---|---|
| Cnocby · timber depleted (pinned) | 20/20 | 20/20 | 20/20 | 20/20 |
| Cnocby · carters (a road-traffic institution) | 10/20 | 8/20 | 10/20 | 8/20 |
| Cnocby · a criminal institution, no criminal faction | 1/20 | 1/20 | 1/20 | 1/20 |
| Mossgate · council and temple at odds | 6/20 | 16/20 | 6/20 | 16/20 |
| Mossgate · merchant guilds a power, not governing | 14/20 | 15/20 | 14/20 | 15/20 |
| Mossgate · a council conflict | 15/20 | 14/20 | 15/20 | 14/20 |
| Black Crag · iron depleted (pinned) | 20/20 | 20/20 | 20/20 (`-045`) | 20/20 (`-045`) |
| Black Crag · ruled by a guild | 3/20 | 5/20 | 2/20 (`-045`) | 1/20 (`-045`) |
| Black Crag · a Mine | 7/20 | 15/20 | 7/20 (`-045`) | 12/20 (`-045`) |

**N7, the owner's.** The cards' unpinned bones hold in only some forks. Black Crag's guild government holds in 1–5 of 20 at either seed whatever the dials, so it is not driven by the priorities. Cnocby's carters hold in 8 of 20 and its criminal presence in 1 of 20. This is the file's stated design ("they share the card's name, not its people or history"), and it is the owner's to keep or change. A Visit is a NEW town in the card's mould by design: `forkSeedFor` suffixes the seed with who is forking, so a visitor's Cnocby, an account's Cnocby and the canonical record differ in population and people. After N5b they share the card's five dials and its pinned resource.

## 5a. N8 — every promise holds in 19 of 20 forks, or leaves the card

**The chair's ruling N8.** Every clause and tag holds in at least 19 of 20 forks at the card's own dials, is pinned by a real wizard dial, or leaves the card.

**No dial pins the clauses that fell.**
- A government comes from whichever governance institution is drawn (`src/generators/power/rulingStructure.js :: governanceLabelMap`).
- Institution toggles are store state, which the generate action spreads over the config.
- `powerDynamicsConfig` is read by nothing.
- `customInstitutions` is homebrew, not a generated fact.

**Fork counts at the card's dials** (20 seeded forks, then 100):

| card · promise (OLD) | 20 | 100 | verdict |
|---|---|---|---|
| Cnocby · mountain village on a through road / Mountain road | 20 | 100 | kept |
| · the good timber cut out / Exhausted timber (pinned) | 20 | 100 | kept (re-worded to the dossier's "faster than they can regrow") |
| · "a generation ago" | — | — | no field: LEAVES |
| · the carters who still stop (a road-traffic institution) | 8 | 39 | LEAVES |
| · whose cousin to ask / Quiet criminal pressure (a criminal institution or faction) | 1 | 2 | LEAVES |
| Mossgate · harbour town / Coastal trade | 20 | 100 | kept |
| · "rain-grey" | — | — | no field: LEAVES |
| · council and temple stopped speaking / Religious tension | 16 | 85–86 | LEAVES |
| · merchant guilds profit (a power, not governing) | 15 | 81 | LEAVES |
| · Contested council | 14 | 64 | LEAVES |
| Black Crag · mountain city | 20 | 100 | kept |
| · built on iron / Industrial | 20 | 100 | kept |
| · ruled by its guild-masters | 1 | 22 | LEAVES |
| · mines give up too little ore ("Iron ore (local mines exhausted)") | 20 | 99 | kept |
| · Guild power (a guild faction present) | 20 | 99 | kept (74/100 if it means among the two strongest) |
| · Dwindling resource (iron depleted, pinned) | 20 | 100 | kept |

**THE OLD CARDS, verbatim (kept for the owner, who may want them back):**
- Cnocby: "A mountain village on a through road, where the good timber was cut out a generation ago and the carters who still stop know exactly whose cousin to ask about the rest." Tags: Mountain road, Exhausted timber, Quiet criminal pressure.
- Mossgate: "A rain-grey harbour town where the council and the temple have stopped speaking, and the merchant guilds quietly profit from the silence." Tags: Coastal trade, Contested council, Religious tension.
- Black Crag: "A mountain city built on iron, ruled by its guild-masters, whose mines now give up too little ore." Tags: Industrial, Guild power, Dwindling resource.

**THE NEW CARDS** (the chair's acceptance; an OWNER VETO POINT):
- Cnocby (`1c22f4227`): "A mountain village on a through road, where the good timber has been cut faster than it can grow back, and the farms, the common grazing and the mill keep the place." Tags: Mountain road, Exhausted timber, Farms and grazing. Farmland + Common grazing land + Mill hold 20/20 and 100/100.
- Mossgate (`1320a8540`): "A harbour town with docks and a harbour master, where the merchant guilds and the religious authorities both hold power." Tags: Coastal trade, Merchant guilds, Religious authority. Docks + Harbour master's office hold 20/20. The Merchant Guilds faction holds 19/20 (97/100) and the Religious Authorities 20/20 (100/100).
- Black Crag (`08c36904f`): "A mountain city built on iron, where the merchant guilds hold power and the mines now give up too little ore." Tags unchanged. The Merchant Guilds faction holds 20/20 (96/100).

**The pin.** `tests/data/foundingWorldBones.test.js` is now a table: it quotes each teaser and tag verbatim and holds every promise at the canonical seed AND in at least 19 of 20 seeded forks (`forkSeedFor`'s own shape). It was red-first with the old clauses ("Black Crag: ruled by its guild-masters — 1/20" and five more). Cost: 3 canonical + 60 forks, about 8 s of test time and 12–13 s of file wall time, under the chair's 20 s.

**A generator fact, not cured here.** Cnocby's criminal dial is the highest of its five at 64, yet its forks carry a criminal institution or faction in 1 of 20 (2 of 100). At village size the dial does not deliver what its name says.

## 5b. N7 — a measure only: what if "Visit" opened the canonical seed with no suffix

**(iii) The old teasers at the canonical seeds.** Every clause holds at `cnocby-033a`, `mossgate-004` and `blackcrag-045`; the canonical bones pin was green at `be56efb67` on all three. Black Crag at `-045` is governed by the "Merchant Guild Council" and prints "Iron ore (local mines exhausted)". The exceptions are "rain-grey" and "a generation ago", which no field holds at any seed.

**(i) What is keyed on the id or the seed across accounts** (read from source, not executed; PLAUSIBLE):
- **Cloud saves.** The row id is a server-minted uuid (`supabase/migrations/001_initial_schema.sql`, `settlements.id uuid … default gen_random_uuid()`), so two accounts saving the same world get two rows. The seed-stable `settlement.id` (`s_<16hex>`, `src/domain/normalizeSettlement.js :: idFromSeed`) is upserted on conflict only by the world-pulse birth seam (`src/lib/saves.js :: supabaseUpsert`, "Ordinary user saves keep server-minted ids").
- **Gallery slugs.** These are minted at random (`public._make_public_slug()`, `supabase/migrations/105_restore_publish_canon_gate.sql`), so no collision.
- **The anonymous daily allowance.** It is a per-device counter (`src/lib/anonGenCounter.js`, `sf.anon.gens`), and sample forks are exempt from it (`isSampleFork`).
- **Analytics.** The fork doors send no seed. The landing's exact-forge sends the fixture seed by design.
- **The browser draft.** `src/store/persistProjection.js :: draftIdentity` keys a device's draft on `settlement.id` + `lastSeed`. Two tabs that both open canonical Cnocby would hold the same identity, but that is the same world, so this is a per-device question and not a cross-account one.

No cross-account collision was found. What changes is the PROMISE: the Create page's lead-in says "no two the same, all deterministic from their seed" (`src/components/generate/FoundingWorlds.jsx`), and REVIEW-P F1 (ODQ §934.63) cured exactly this sharing as a defect ("both forks of Cnocby returned id `s_01773858621d9a94`").

**(ii) What pins the suffix:**
- `tests/data/sampleSettlements.test.js`: the forkSeedFor suite, the fork-door walker ("every CALL of forkSeedFor passes an identity resolved by forkIdentity"), and its guard-the-guard arms.
- `tests/lib/anonForkSalt.test.js`: "TWO VISITORS forking one sample get different seeds", "ONE VISITOR re-forking the same sample gets the same seed, across a reload", `FORK_SEED_MAX`.
- `tests/components/foundingWorlds.test.jsx`: "forking a sample drives the library fork path with the user-suffixed seed".
- `tests/components/layeredConfigurationPanel.test.jsx`: `FORK_SEED_MAX`.
- The suffixed seed is also used, without being pinned as a law, in `tests/lib/editTravel.test.js`, `tests/store/generateStrayConfigSeed.test.js`, `tests/store/sampleForkPriorities.test.js` and `tests/data/foundingWorldBones.test.js`.

## 6. The landing narration (N1) — sentence by sentence

Receipts at `f0f98d883` (unchanged since `ecadf531a`): route "road · Picked from coherence-safe pool: road, road, road, isolated, isolated." · resource "mountain_timber · present but depleted (The accessible mountain stands have been cleared faster than they can regrow.)" · institution "blacksmith · selected (Base chance 4% lifted by ×2.50 from nearby resources + terrain.)".

| # | old | the fact at `f0f98d883` | new |
|---|---|---|---|
| S1 | "The road made Cnocby by a coin’s width, three chances of it against two of nothing, and the mountain stands are being cleared faster than they grow back." | route pool 3 × road / 2 × isolated; timber depleted | **unchanged** |
| S2 | "The Elder Council and the Religious Authorities are at odds over conscripting the guilds’ apprentices, and a neutral name is being pressed to choose a side before the council next sits." | `conflicts` is empty and there is no conflict receipt | **DELETED** |
| S3 | "The mayor, Odhrán MacCarthy, means to win the people back with what costs nothing: fair hearings and quick answers." | no Odhrán: the cast is Waitling Hayes (the eldest), Étaín Sullivan (the priest), Fearghus O'Brien, Uathach O'Neill, Caoilfhinn Gallagher, Lasair Hayes | **DELETED** |
| S4 | "Hector Gallagher and Inghean MacCarthy are about to stand on opposite sides of an important decision." | pressure: "Étaín Sullivan and Lasair Hayes will both present proposals at the next council session. Only one will be accepted." | **DELETED** |
| new S2 | — | the institution receipt | "The village keeps a smith on four chances in a hundred, more than doubled by the mountain and by what lies near it." (the chair's words) |

The narration had been stale since `7e3ba7547` (2026-11-07), across three green re-emits. The freshness walker compares bytes, and nothing read the narration. `landingNarrationGrounding` now does.

**N2.** `landing.brief.body`: OLD "This is Cnocby: eighty-two people, a mountain village the road reaches, and a bakehouse already on its second bake when you arrive. …" → NEW "This is Cnocby: eighty-two people, a mountain village the road reaches. …". town.prose has no bakehouse, and town.population is 82. The stale comment ("412") above the key is corrected.

## 7. What each town's dossier shows (the crops, `founding-worlds/`)

The four crops were taken in the dev build at the canonical seed, at the card's dials.
- `cnocby-033a-dossier-head.webp`: Cnocby, village, 313, Headman's Authority, the carter on the road into Cnocby.
- `mossgate-004-dossier-head.webp`: Mossgate, town, 2,046, the Church Council.
- `blackcrag-016-before-dossier-head.webp`: "Governed by Noble Governorship", a city of 11,042, 352 years old.
- `blackcrag-045-after-dossier-head.webp`: "Governed by Merchant Guild Council", a city of 6,327, 140 years old, "Black Crag lives by its forges: the clang of iron is in every lane."

## 8. Waiting for the chair's final tip

The landing fixture's `--check` (and a re-emit only if it moved) and N6's keep-or-retake of the realm photograph. The rehearsal photographed it at `ecadf531a`: the door completes in 23 s, the pixel guard passes, webp 119.1 kB and png 473.0 kB. The geography, the five markers and the edges are the same as the committed picture's; only the labels changed, Cinzel small-caps → a plain serif. **For the owner:** `src/components/map/TierIcon.jsx` asks for `fontFamily="Cinzel, serif"`, and the site never loads Cinzel, so most visitors see the serif fallback. The committed photograph got Cinzel from the capturing machine's installed fonts.

## 9. Gates at the lane tip

**The full `tests/lint` + `tests/scripts` run at both tips** (JSON reporter, 3238 tests each): 14 red at the lane before its register cures, against 11 at the base `f0f98d883`. The three extra were this lane's, and are cured in `41e129220` and the census commit. **The base's eleven, met and not cured** (identical messages at both tips):
- `domainAnyCastBaseline` > "EVERY DECLARED OVERRUN IS ATTRIBUTED" (`commercialReasons.js` introducedAt `d7ea69a4b…` resolves to no commit).
- `newsHeadlineContract.walker` > "A2 freezes all 80 address rows…" and "A3 freezes both raw lanes…".
- `observedShapeReaders.walker` > "the baseline is CONTENT-ADDRESSED…", "SHRINK-ONLY…" (violations 3), "THE LIVE ESTATE INSTANCE…" (a detector source drifted) and "A1/A7…" (reads 2192 vs 2188).
- `proseFamilyContract.walker` > A1, A3 and A5.
- `proseRegisterLoaders.walker` > "R6 reproduces the seat's 1,662 rows…" (1830).

`npm run typecheck:ratchet`: OK, 167 of a ceiling of 167. eslint 0 on every touched file. `tests/store` + `tests/data` + `foundingWorlds*` + `settlementsPanelLibraryLoad`: 214 files / 1821 tests green. `tests/copy` + `landingFixtureFreshness` + `homeLanding` + `landingNarrateRefusal`: 18 / 198 green. **Base red, not this lane's:** `tests/components/readerValidationOnPage.test.js > ruling 2 … soak1k-24: "2 critical issues" sits beside "Critical Issues (2)"` ("expected undefined to be '2'") is red identically at `f0f98d883` run alone.

## 10. CONFIRMED against PLAUSIBLE

CONFIRMED by execution: every fact quoted from a generation, every count, every red-first and every green, the base red at `f0f98d883`, and the in-app populations and governments in the crops, which match the node runs. PLAUSIBLE (a reading, not a predicate): the three ✓ readings marked as such in §2, and the cause of the photograph's lettering change (the capturing machine's fonts).

## 11. The final tip — `lane/integration-2026-11-07` at `7ab12183f` (2026-11-11)

**The merge** (`2d54eae88`). The registers resolved as follows:
- **The lighting census** takes the line's side. The merge seat re-freezes it at this lane's merge point; this lane adds three test files and 13 titles (the measured deltas in `0d9c7ad79`).
- **The source-citation roster** is the union: `dated` 236 → 237.

`git diff --stat 7ab12183f HEAD` lists this lane's files only.

**THE STOP CHECK, passed.** The out-of-tree emit's six `realm.advance` records equal, word for word, the six the chair measured at `eba966fc5`. The voice receipts are unchanged, so `voice.narrated` stays grounded (`landingNarrationGrounding` green).

**The fixture** (`063fdc88a`). Re-emitted through its door, `--check` exit 0. The fields that moved under point 36 (the simulation cure):
- **realm.whyTrace:** trade now ends "strained / warning" (was "critical / danger"), with the second reason "Criminal pressure disrupts trade flows."; legitimacy reads 13 (was 11).
- **realm.advance:**
  - Out: Vael at week 1, and the broken trade routes at week 12.
  - In: the Elder Council's capture of the water at week 9, and Caoilfhinn Gallagher's reforms at week 12.
  - Moved: crime, from week 10 to week 12.
- **realm.chronicle:** one entry moves from week 10 to week 12.

**`src/copy/landing.js :: realm.body2`** is the chair's sentence verbatim (an OWNER VETO POINT). The grounding suite was re-keyed with it: weeks [2, 10] → [9, 12], one pair per beat.
- **OLD:** "Then advance time. In Cnocby’s first twelve weeks the village turned to the faith of Vael and Étaín Sullivan set out to restore order; by week two the village was on a war footing; the religious conversion fracture passed, leaving its sectarian memory behind; by week ten crime had taken hold of its streets, and by week twelve its trade routes had broken down. Every one of those is a record the engine wrote, and every one carries its cause."
- **NEW:** "Then advance time. In Cnocby’s first twelve weeks Étaín Sullivan set out to restore order and the village went onto a war footing; the split between the faiths ended, leaving its sectarian memory behind; by week nine control of the village’s water was passing to the Elder Council; and by week twelve Caoilfhinn Gallagher was pushing through reforms as crime took hold of its streets. Every one of those is a record the engine wrote, and every one carries its cause."

**The photograph (N6): KEPT.** The overlay's inputs were proven on data, not by eye. The five members (Cnocby village · Keshigordu town · Skáloy city · Aryagrad town · Penshaw village) and the ten edges of the advanced regional graph are byte-identical between `ecadf531a` (where the rehearsal capture matched the committed picture's geography, markers and edges) and `7ab12183f`; the map seed (`landing-lf-033`) is a constant. So the committed `realm-cnocby.{png,webp}` stay, and with them the Cinzel lettering.
- **Desktop:** `founding-worlds/landing-realm-desktop-final-tip.webp`, the landing's realm card at the final tip, with the committed photograph under the fixture's week-12 chronicle.
- **Phone:** there is no phone view of the photograph. By the owner's ruling (ODQ §934.27, `HomeLanding.jsx`: "everything below the fold is NOT MOUNTED at phone width") the realm card is not rendered on a phone. CONFIRMED in iPhone 13 emulation: the page is 945 px tall and no element paints `realm-cnocby`.
- **Noticed, for the owner, not cured:** the realm card's own overlay pins ("Cnocby", "Penshaw · Border incident") sit at fixed percentages (`LandingArtifacts.jsx`, `pinPos`) and do not line up with the photograph's markers, so Cnocby appears twice at different places.

**Gates at `063fdc88a`, with exit codes:**
- fixture `--check` 0.
- tests/data + tests/copy + sampleForkPriorities + generateStrayConfigSeed + landingFixtureFreshness + aiMediaProvenance + foundingWorlds* + homeLanding + sourceCitationIntegrity + mutationCoverageManifest + negativeAssertionAnchor: 67 files / 704 tests, 0.
- goldens (generatorGoldenMaster + dmLayerGoldenIsolation + generationForkCensus): 25/25, 0.
- typecheck:ratchet 0.
- eslint 0.

**Not run at the final tip:** the whole tests/lint, tests/scripts and tests/components directories, a production build, and the lighting-census walker (its side is the line's, re-frozen by the merge seat).
