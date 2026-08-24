# THE CATALOG-HYGIENE TRAIN (CH) — charter, compiled by TC-CH-COMPILE `[OPUS-RUN · FABLE-VALIDATED 2026-08-25 (TE-CHVAL, ODQ §626) — REVERSED: H12 force-require, H16/G4 the divergence headline, H8's discharge claim; DECAYED: the 36/26/10 split (cured by its own ruled commit); MF-CH2B's own packet marker NOT discharged — its re-derivation is the dispatch's first act. See charters/CHVAL-VERDICT-2026-08-25.md]`

Chartered at ODQ §491, authorized §492, compiled against the brief at
`$SP/CH-charter-compile-brief.md` and its three amendments. Three repair cars — **CH-1
inference honesty · CH-2 the magic licence · CH-3 the data slips** — landing before DW-0
so the dwellings compile reads a corrected catalog.

**BASE:** `claude/composite-r4` = **`f1e4d5150748f13cc27fbbb2d34db614d49d7620`**
(subject: `test(MF-UC4 landing): pay the sixth flag-bill surface — the covering-array flag
domain (ODQ §489)`). Private read-only worktree `$SP/laneTCCH-tree`, detached at that sha;
`package-lock.json` `cmp` against `chair-baseproof-b10ed1a1` → **EXIT 0**; `node_modules`
cloned `cp -Rc`, 468 entries; node v24.12.0; vitest 4.1.8.

**⚠ THE BRANCH ADVANCED WHILE THIS LANE RAN, and the delta was checked, not assumed.**
`claude/composite-r4` is now **`00e7af612`** — MF-UC2 landed **at slot `f1e4d515`**, i.e. on
top of this charter's base, plus its landing-act commit. **Every home in §0 is still valid at
the new tip: `git diff f1e4d5150..00e7af612` over all ten CH-touched source files
(`cohesionWeave.js`, `institutionalCatalog.js`, `magicFilter.js`, `institutionProbability.js`,
`institutionDescVariants.js`, `interiorTemplates.js`, `lookups.js`, `generationContext.js`,
`arcaneInstitutionIdentity.js`, `assembleInstitutions.js`) is EMPTY.** Two figures did move
and are restated here so nothing downstream carries a stale number:
* the census tuple is now `files: 2515, parked: 366, credited: 2149, titles: 20854,
  suiteTitles: 5807` (`sovereigntyLightingContract.walker.test.js:6049`) — §4.4's base;
* the manifest is now **168 packets, 167 LANDED + 1 SUPERSEDED, ZERO non-terminal** —
  MF-UC2's five reserved paths are freed, so §4.2's only external reservation is gone and the
  serial-mint requirement is now purely internal to the CH train.

**THE MEASUREMENT INSTRUMENT, stated once.** Every same-seed figure below is measured over
one corpus: **420 settlements** = 6 tiers × 2 cultures × 7 terrains × 5 seeds, built by
`generateSettlementPipeline(cfg, null, { seed, customContent: {} })` with each terrain paired
to its terrain-honest route (the golden corpus's own `TERRAIN_ROUTE`, the UC-1 idiom). The
whole-record digest of that corpus at base is

    CORPUS_DIGEST 1a4a8d3f85e6424a427167ddc44a5e3d7a0e63a9316dab2894632883cf9c9c84

and the harness reproduces it from a no-op control run, so no figure below rests on a
vacuous instrument. Scripts: `$SP/laneTCCH-tree/CH-{sweep,digest,variant,facet-live,
facet-attrib,facet-keyword-evidence,facet-proposed,mintier-audit,prioritycat-audit,
downstream}.mjs`, all untracked, nothing committed, the tree left pristine.

---

## §0 · THE MEASURED HOME TABLE

Every claim the research hands CH, re-read at `f1e4d515` this lane and marked CONFIRMED /
CORRECTED / REFUTED. A home is a file:line I opened; a verdict is an execution I ran.

| # | claim (source) | measured home at f1e4d515 | verdict |
|---|---|---|---|
| H1 | `FACET_INFERENCE` lives in `cohesionWeave.js` ~L258 (brief) | `src/domain/spatial/cohesionWeave.js:258-296`, `Object.freeze({...})`, three facet kinds | **CONFIRMED** |
| H2 | `facetOf` ~L300 (brief) | `cohesionWeave.js:331`; `declaredFacet` :297, `inferFacet` :315. Resolution is `declared ?? inferred` (kind-default `null`) | **CORRECTED** — `facetOf` is at :331, not :300 |
| H3 | the inference haystack is `name + type + category` | `inferFacet` :318 `String(name??'') + ' ' + String(type??'') + ' ' + String(category??'')`; `assembleInstitutions` pushes `{ category, name, ...inst }` (:296-299, :355) and **no catalog row carries a `type` key** (grep over the 2,526-line file: zero hits) | **CONFIRMED** |
| H4 | G1: three unanchored mis-inferences (R-INST-5 §Σ.2) | **FOUR**, resolved LIVE through `facetOf` over all 311 rows: `Warden's Lodge`→vice · `Dragon resident`→vice · `Charlatan fortune tellers`→security · **`Priest (resident)` (village/Religious)→vice**, which no tranche found | **CORRECTED — the set is four** |
| H5 | G1's cure is word-boundary anchoring | **`/fort/` matches "fortune" at a LEADING WORD BOUNDARY** ("Charlatan **fort**une tellers"), so anchoring alone cannot cure it — the stem must change. And naive leading-`\b` **REGRESSES four rows** whose correct `craft` verdict rides a MID-WORD match (`Black**smith**` ×2, `Saw**mill**` ×2) | **CORRECTED — the prescribed cure is wrong for one of the four and breaks four others** |
| H6 | R-INST-5 §L item 53: the mis-inferences are PLAUSIBLE-by-simulation; the settling experiment is un-run | **RUN THIS LANE.** `facetOf(rec,'institutionNature')` over every catalog row as `assembleInstitutions` shapes it (`CH-facet-live.mjs`, `$SP/CH-facet-base.tsv`). Item 53 is **DISCHARGED** | **CONFIRMED, and promoted from PLAUSIBLE to CONFIRMED** |
| H7 | `arcaneInstitutionIdentity.js` is the anchoring precedent | `src/domain/arcaneInstitutionIdentity.js:99-112` — "⚠️ ONE DELIBERATE DIVERGENCE: each keyword is anchored at a WORD BOUNDARY here… The reason is 'mage' inside 'PILGRIMAGE'." Its ruling at :13-18: "**the tag is the authored semantics, the bucket is a shelf**" | **CONFIRMED** |
| H8 | the estate recorded the magicFilter residual, not fixed | `docs/DESIGN_REALM_MAGIC_TOGGLE.md:514-519` — "⚠️ **magicFilter's own list is still unanchored** — latent, not live… **Recorded, not fixed**: anchoring it moves `filterCatalogForMagic` and `filterServicesForMagic`, a live change outside R-BLD-5's four sites. **Chair to schedule.**" | **CONFIRMED — CH discharges an existing chair-to-schedule item** |
| H9 | that residual is latent for the catalog | **MEASURED:** `ARCANE_INST_KW.some(kw => name.includes(kw))` over all 311 catalog NAMES yields **MID-WORD matches = 0** | **CONFIRMED at this base** |
| H10 | G2: four "(high magic)" rows + `Dragon resident` carry `minTier:'metropolis'` in the city block (five rows) | **TEN** rows catalog-wide have `minTier` outranking their authoring block (`CH-mintier-audit.mjs`; 311 rows, 36 carry `minTier`, 26 REDUNDANT, **10 ABOVE-BLOCK**, 0 BELOW-BLOCK). The five R-INST-5 named, plus `Planar traders` (city/Exotic) and four Entertainment rows — `Colosseum/arena`, `Gambling district`, `Multiple theaters`, `Opera house` — that no tranche saw, plus D6-1's `Smuggling network` | **CORRECTED — the class is ten, not five** |
| H11 | D6-1: `Smuggling network` village L865 carries `minTier:'city'` (R-INST-6) | `src/data/institutionalCatalog.js:865-872`, village `Criminal` block, `minTier: 'city'`, `baseChance: 0.1` | **CONFIRMED** |
| H12 | the minTier gate | `src/generators/steps/assembleInstitutions.js:256` `if (inst.minTier && tierIndex < TIER_ORDER.indexOf(inst.minTier)) return;` — **before** the toggle read (:257-261), so a user force-requiring an above-block row at its own tier gets silence | **CONFIRMED, and sharpened** |
| H13 | *does any reader use `minTier` where the block would differ?* (amendment 1) | **YES, one, and it is the UI.** `src/generators/lookups.js:54-58` `getInstitutionalCatalog(tier)` returns `institutionalCatalog[tier]` **raw, with no minTier filter**; `getFullCatalogWithTierMeta` (:66) and `getInstitutionsForTier` (:82) likewise. `tests/generators/metropolisCatalogReachable.test.js` exists precisely to keep every block row UI-reachable. So for exactly the 10 above-block rows **the UI offers what generation refuses** | **CONFIRMED by measurement** |
| H14 | G3: `Alchemist shop`/`quarter` carry arcane+alchemy tags and die in a dead-magic world | tags confirmed (`arcane|alchemy`); death confirmed by sweep — **0 instances of either at `magicExists:false` and at `priorityMagic:0` over 840 settlements** | **CONFIRMED** |
| H15 | G4: the Adventurers' charter hall straddles Magic (hamlet/village) and Adventuring (town) | catalog: hamlet `Magic` L310, village `Magic` L819, town `Adventuring` L1394; `institutionCatalogArcaneTag('Adventurers\' charter hall')` = **MUNDANE** (`tags:['military','adventuring']`) | **CONFIRMED** |
| H16 | G4's live divergence | **MEASURED:** the hall appears **16 times at `magicExists:false`** in the corpus — it SURVIVES generation (the world law's keyword list does not name it) while `filterCatalogForMagic` strips it from the UI by SHELF (`magicFilter.js:37` `c === 'magic'`). **This is the estate's one measured generation-versus-UI divergence** | **CONFIRMED and re-attributed to G4** |
| H17 | G5: `Great library` is `tags:['education','education']`, shelf Magic, reads MUNDANE, and the probability multiplier fires on the shelf | tags confirmed (duplicated in source, catalog metropolis Magic); `institutionCatalogArcaneTag` = **MUNDANE**; the multiplier at `institutionProbability.js:88` fires on `cat.includes('magic')` | **CONFIRMED** |
| H18 | G5: "hidden from the institutional grid in a dead-magic one" implies it generates there | **REFUTED for the dead-magic half.** `Great library` appears **0 times** at `magicExists:false` and at `pm0` in 840 settlements — the WORLD LAW strikes it first (see H21). The multiplier finding stands for `priorityMagic > 0` | **PARTLY REFUTED** |
| H19 | G6: `Dragon resident` diverges — a dead-magic metropolis "can still GENERATE the row" while the UI hides it | **REFUTED BY EXECUTION.** `Dragon resident` appears **0 times** at `magicExists:false` and **0 times** at `pm0` across 840 generated settlements. There is no generation-versus-UI divergence for this row | **REFUTED** |
| H20 | G6's `NON_MAGIC_EXOTICS` exemption | `institutionProbability.js:186` `['dragon resident','underground city']`. **`'underground city'` is INERT**: that row sits on the metropolis **Criminal** shelf, so `isMagicOrExoticCategory` is already false and the exemption never fires. The code's own comment ("Dragon resident and Underground city are geographical, not magical") is half true in effect | **NEW — a measured dead half** |
| H21 | *(no research claim — found this lane)* **A FIFTH shelf/vocabulary-as-gate path** | `src/generators/generationContext.js:132-139` `nativeInstitutionRequiresMagic()` runs `ARCANE_INST_KW.some(kw => name.includes(kw))` and is the WORLD LAW consulted at `assembleInstitutions.js:268`, `:410`, `:484` and `cascadeGenerator.js:180` — **before** any probability. It strikes **26 catalog rows** in a dead-magic world, including `Dragon resident` and `Great library`, which `isArcaneInstitution` reads MUNDANE. §491 says "the THREE shelf-as-gate code paths"; there are **five** | **NEW — the gate census in §491 is incomplete** |
| H22 | G7: three of eleven `hiMagicInsts` keywords match no catalog row | **CONFIRMED by execution over all 311 names:** `magical banking` 0 · `magic item consignment` 0 · `enchanting quarter` 0. `'Magic item consignment'` is a member of `ARCANE_GOODS` (`magicFilter.js:17`) — a GOODS vocabulary inside an INSTITUTION gate | **CONFIRMED** |
| H23 | `ARCANE_GOODS`, the hard-zero keywords and the gate paths all live in `magicFilter.js` (brief) | `ARCANE_GOODS` is `magicFilter.js:15-20`. **`ARCANE_INST_KW` / `ARCANE_INST_TAGS` do NOT live there** — they live in `src/domain/arcaneInstitutionVocabulary.js:38,46` and are re-exported; the split exists because an eager→lazy chunk edge made `dist` un-bootable (lane BT, 2026-08-03). The hard-zero list `hiMagicInsts` is `institutionProbability.js:176-180` | **CORRECTED — three homes, not one** |
| H24 | `getMagicLevel` and its four tokens | `src/data/constants.js:37-41` — `priority === 0 ? 'none' : <=25 ? 'low' : <=65 ? 'medium' : 'high'`. **The tokens are LOWERCASE.** §491 writes `NONE\|LOW\|MEDIUM\|HIGH` | **CORRECTED — the field's values must be lowercase to be "the four tokens getMagicLevel already emits"** |
| H25 | "the 32 Magic/Exotic rows" (§491) | the Magic and Exotic shelves hold **28** rows (Magic 21 + Exotic 7). R-INST-5's 32-entry verdict table adds **four Adventuring-shelf hand-offs** (`Adventurers' charter hall` town, `Charlatan fortune tellers`, `Beast trainers`, `Multiple adventurers' guilds`) | **CORRECTED — 28 rows carry the field; 32 rows carry a verdict** |
| H26 | R-INST-3: `religiousCenter` exclusivity is wrong at city | `exclusiveGroup:'religiousCenter'` sits on 7 rows (`institutionalCatalog.js:45, 288, 296, 750, 1238, 1750, 1758`). Per tier the group holds: thorp 1, hamlet 2, village 1, town 1, **city 2** (`Cathedral (10,000+ only)` L1747, `Multiple monasteries` L1755), metropolis 2-by-merge. A group of one cannot exclude anything, so the LIVE exclusions are hamlet and city. **The estate's own counter-example is in the file:** the metropolis block's `Great cathedral` and `Major monasteries (5-10)` carry **no** exclusiveGroup | **CONFIRMED, with the internal precedent found** |
| H27 | R-INST-2: L1670 `priorityCategory: 'military'` on a civic row | `institutionalCatalog.js:1670` is the `'Auction house': {` line; its `priorityCategory: 'military'` is L1675. **It is one of a contiguous RUN OF FOUR** on the city Economy shelf: `Mint (official)` · `Auction house` · `Harbour master's office` · `Furrier's district`, all `military` — the copy-paste-run signature `tests/data/priorityCategoryPlausibility.test.js`'s own header describes | **CONFIRMED and widened to a run of four** |
| H28 | the live consequence of that run | `src/domain/townMap/institutionAssignment.js:71-83` `CATEGORY_AFFINITY` maps `priorityCategory` → ranked district categories. All four place **`["military","civic","noble","residential","other"]`** — an auction house and a furrier's district in the military quarter. The honest values rank `merchant` first | **CONFIRMED by execution** |
| H29 | *(mine)* `Contract killer` (city/Criminal) reads `priorityCategory:'military'` — the ONE Criminal-shelf row that departs (27 criminal / 1 military) — so it places in the military district | **CONFIRMED**; **but my hypothesis that it also breaks `hasCriminalInst` is REFUTED** — `corruption.js:514-521` `isCriminalInstitution` reads the `criminal` TAG or `/criminal/i` on the CATEGORY, never `priorityCategory`; measured `hasCriminalInst=true` both before and after | **one CONFIRMED, one self-REFUTED** |
| H30 | R-INST-2: L1112 "MUST be downstream and downwind" is unsupported | `institutionalCatalog.js:1112` is the `Tanners: {` line; the prose is L1116. R-INST-2 §9(c): three negation rounds, "**Null for tanners specifically**"; Coventry 1421 concerns butchers; Northampton, Norwich, Gloucester, York and Nottingham are all intramural. **No engine reader enforces it** — the string is dossier prose | **CONFIRMED** |
| H31 | HK-6: three "Eberron" strings | exactly three, sweep-complete: `institutionalCatalog.js:2183` (`desc`) and `institutionDescVariants.js:242,243` | **CONFIRMED** |
| H32 | the variants are golden/parity-pinned | `institutionDescVariants.js:1-15` — the canonical `desc` is index 0 and `assembleInstitutions` picks among `[canonicalDesc, ...variants]` with **a pure fnv hash of (settlement seed + institution name), ZERO rng draws**. So changing the STRINGS cannot change WHICH index is picked. Guard: `tests/generators/dossierContent.test.js` | **CONFIRMED, and the shift is narrower than "goldens move"** |
| H33 | R-INST-6-1: `Underground city` (L2383) and `Black market bazaar` (L2375) are subterranean in their own prose and declare no facet | both metropolis `Criminal`, `tags:['criminal','underground']`, **no `facets` key**. Only three rows in the whole catalog carry `facets` (L886, L1446, L1965 — the three `Underground network` rows, `{ clandestine, subterranean }`) | **CONFIRMED** |
| H34 | R-INST-6 L.14: `Kidnapping ring`'s description and `exclusionConditions` disagree | catalog city L1982: `exclusionConditions: ['Slave market','Slave market district']`; the desc says it "exploits the legal market's infrastructure where one exists". `assembleInstitutions.js:324` `if (inst.exclusionConditions?.some(ex => institutions.some(i => i.name === ex))) return;` — so the first half of the description is engine-unreachable | **CONFIRMED** |
| H35 | R-INST-6 §Σ.3's criminal-shelf facet simulation | **reproduced exactly** through the live chokepoint: 17 generic · 6 trade · 5 vice over the 28 Criminal rows | **CONFIRMED** |
| H36 | `institutionalCatalog.js` in the edge bundles? (brief asks: measure) | **YES — three**, the same three as `cohesionWeave.js`: `supabase/functions/_shared/{aiCharter,aiGrounding,aiOutputSchema}Bundle.meta.json`. `analyticsEvents` and `intentAtlas` list neither | **CONFIRMED — every CH car owes `build:edge-shared`** |
| H37 | size-baseline headroom (brief: check every modified file) | `scripts/.size-baseline.json` holds **ten** file rows; **none** is a CH file. `src/data/**` has **no `max-lines` rule at all** in `eslint.config.js`; `src/domain/**` and `src/generators/**` take the 800-effective ceiling, and `cohesionWeave.js` (347 raw) / `institutionProbability.js` (307 raw) sit far under it | **CONFIRMED — the exact-ceiling hazard does NOT bite any CH car** |
| H38 | packet families are whitelisted? | **No whitelist exists.** `scripts/implementation-packets.mjs` validates `packetPath` only for normalization and existence; a new family is a new directory + the packet file + an `INDEX.md` status row + a manifest entry. `TERMINAL_PACKET_STATUSES = ['LANDED','SUPERSEDED']` (:43); every other status **reserves** its change paths (:571, :589-595) | **CONFIRMED** |
| H39 | the census tuple at base | `tests/lint/sovereigntyLightingContract.walker.test.js:6000` — `files: 2514, parked: 366, credited: 2148, titles: 20846, suiteTitles: 5806`, matching §489.1's walked tuple | **CONFIRMED** |
| H40 | `tests/` holds 37 trees (§489.3) | `ls tests` = 38 entries, one of which is the file `generation.test.js` ⇒ **37 trees** | **CONFIRMED** |

**Tally: 40 rows — 24 CONFIRMED · 9 CORRECTED · 3 REFUTED (one of them mine) · 4 NEW.**
Two CORRECTED rows change a car's shape (H5, H10); two REFUTED rows remove work from CH-2
(H18, H19); two NEW rows add work to CH-2 (H20, H21).

---

## §1 · CH-1 — INFERENCE HONESTY

### §1(a) · The anchoring, with the before/after table run over the whole catalog

The naive reading of §491 — "word-bound every `FACET_INFERENCE` regex" — is **refuted by
measurement** (H5). `CH-facet-keyword-evidence.mjs` ran every one of the 51 keywords against
all 311 rows and separated word-boundary matches from mid-word ones:

| keyword | bare hits | mid-word-only hits | what a naive leading `\b` would do |
|---|---|---|---|
| `smith` (craft, and again under `arms`) | 3 | **2** — `Blacksmith`, `Blacksmiths (3-10)` | **REGRESSION** — both lose `craft` |
| `mill` (craft) | 6 | **2** — `Sawmill`, `Sawmill (commercial)` | **REGRESSION** — both lose `craft` |
| `den` (vice) | 5 | **4** — `Resident smith (part-time)`, `Priest (resident)`, `Warden's Lodge`, `Dragon resident` | 3 cures + 1 no-op (`craft` already wins on `smith`) |
| `fort` (security) | 2 | 0 | **NO CURE** — "fortune" matches at a word boundary |
| every other keyword | — | 0 | no change |

So the anchoring is **per-keyword, evidence-driven**, not uniform:

* leading `\b` on every alternative, **except**
* `smith` → `smiths?\b` and `mill` → `mills?\b` — a TRAILING boundary, because English
  compounds these stems and the compounds are the intended matches;
* `den` → `\bdens?\b` and `cult` → `\bcult\b` — BOTH boundaries, because a leading boundary
  alone still admits "denizen" / "cultural";
* `fort` → `\bfort\b|\bfortif|\bfortress` — an explicit stem set, because a leading boundary
  admits "fortune".

**THE BEFORE/AFTER TABLE, run as a script over all 311 rows × 3 facet kinds = 933 cells**
(`CH-facet-proposed.mjs`):

    ROWS 311  FACET_KINDS 3  CELLS 933
    CHANGED_CELLS 4

| facet kind | base | proposed | tier | shelf | name |
|---|---|---|---|---|---|
| institutionNature | vice | *(null → `generic`)* | village | Religious | **Priest (resident)** |
| institutionNature | vice | *(null → `generic`)* | town | Magic | **Warden's Lodge** |
| institutionNature | security | *(null → `generic`)* | town | Adventuring | **Charlatan fortune tellers** |
| institutionNature | vice | *(null → `generic`)* | city | Exotic | **Dragon resident** |

**Four cells of 933 move, and all four are the mis-inferences. Zero collateral.**
`Blacksmith`, `Blacksmiths (3-10)`, `Sawmill`, `Sawmill (commercial)`, `Gambling den`,
`Town watch`, `Professional city watch`, `Banking houses`, `Banking district` and
`Massive walls and fortifications` all keep their measured verdict. The `institutionSubstructure` table — the undercity's seed gate — moves
**zero** cells; anchoring it is a guard for future and custom rows, not a live change.

`Priest (resident)` is the row to lead the packet with. A village parish priest currently
draws the **tavern** interior — common room, kitchen, cellar, lodging — because "resi**den**t"
contains `den`. No tranche found it; the catalog-wide run did.

### §1(b) · The per-entry override: the field already exists

**§491 asks for "an explicit per-entry `interiorKind` override so a NAME is never the only
evidence". CH-1 mints no field, because the estate already built one and proved it in
production.** The landed precedent, quoted from `cohesionWeave.js:328-334`:

```js
export function facetOf(entity, facetKind) {
  const declared = declaredFacet(entity, facetKind);
  if (declared != null) return declared;
  return inferFacet(entity, facetKind);
}
```

`declaredFacet` (:297-311) reads either a `facets: { <kind>: <value> }` map or a
`facet:<kind>:<value>` tag. **Three catalog rows already use it** — the three
`Underground network` rows at L886 / L1446 / L1965 carry
`facets: { clandestine: 'clandestine', subterranean: 'subterranean' }` — so a catalog
`facets` key is an established, landed affordance, not a new one. A row declaring
`facets: { institutionNature: 'security' }` gets that nature at the one chokepoint, with
**zero new readers and zero new fields**.

**Which rows get one in THIS car.** Only rows the research proved mis-typed AND for which an
existing `INTERIOR_KINDS` member is defensibly correct:

| row | declare | reasoning |
|---|---|---|
| `Priest (resident)` (village/Religious) | `institutionNature: 'faith'` | the shelf says Religious and the row is a priest; the `faith` template (nave/sanctuary/vestry) is the parish parti R-INST-3 §4 describes. Not a new claim — a correction to a claim the name was making badly |
| `Warden's Lodge` (town/Magic) | **none** | R-INST-5's verdict is `LODGE_THREE_BAY → MOATED_PLATFORM_COMPOUND` with HOME "hall / chamber / store". No existing kind is that. It falls to `generic` (main + back) — less wrong than a tavern, and DW-1 assigns the real kind |
| `Charlatan fortune tellers` (town/Adventuring) | **none** | R-INST-5's verdict is **N — NO_BUILDING**, `BOOTH_TEMPORARY`, HOME "—". Declaring any kind would assert a building the research says does not exist |
| `Dragon resident` (city/Exotic) | **none** | R-INST-5's verdict is **O — occupation of an existing structure**, parti "none — a place-claim". Same reason |

**JUDGMENT J-CH-1:** one declared override, not four. *Chose* leaving three rows at
`generic` *over* assigning each its nearest existing kind, *because* CH-1's charter is
honesty — removing a false claim — and typing is DW-1's vocabulary work (§491.2); assigning
`security` to a ranger station or `civic` to a fairground booth would replace one unearned
claim with another, and the owner's own fix philosophy prefers the bold correct architecture
(a real `hospitality`/`lodge`/`site` vocabulary at DW-1) over a patch that looks complete.
*Reversal:* add three `facets` keys to the catalog rows; each is one line and the walker in
§1(c) already validates the values. *Blast radius:* three rows render `generic` (main + back)
instead of `vice`/`security` in **41 of 420 settlements** (measured; the four rows together
move 111, of which `Priest (resident)` alone accounts for 70); no roster changes anywhere.

### §1(c) · The walker

`tests/lint/facetInferenceHonesty.walker.test.js` (new file — a **CREATE** row, never TEST;
see §4's census arithmetic). Four arms:

1. **NO MULTI-RULE NAME, per facet kind.** No catalog row's inference text matches more than
   one row's `rx` within a kind. **MEASURED, so the arm is neither vacuous nor speculative:**
   at base there is exactly **ONE** such collision — `Resident smith (part-time)` matches both
   `craft`/`smith` and `vice`/`den` (`craft` wins on order, which is why the row is
   right by accident today) — and after the §1(a) anchoring there are **ZERO**, for both
   `institutionNature` and `institutionFunction`. The arm is therefore a clean
   zero-assertion, and reverting `\bdens?\b` restores the one collision as its mutant.
2. **EVERY DECLARED FACET NAMES A REAL VALUE.** Every `facets: {}` key in the catalog whose
   kind appears in `FACET_INFERENCE` declares a value in that kind's value set; every
   `institutionNature` declaration names an `INTERIOR_KINDS` member.
3. **ANCHOR DISCIPLINE.** Every alternative in `FACET_INFERENCE` carries at least one `\b`
   or `^` anchor — a source scan over the frozen table, so a future author cannot add a bare
   substring. This is the arm that removes the class's habitat (`structural-prevention`).
4. **THE FOUR CURED ROWS, BY NAME.** `facetOf` on the four rows returns exactly the post-CH-1
   verdict, with a convicting mutant: revert one anchor → the arm reds.

### §1(d) · THE DECLARED SHIFT — measured, not predicted

**The generation path does not move at all.** The whole-record corpus digest with CH-1's
anchoring applied is

    CORPUS_DIGEST 1a4a8d3f85e6424a427167ddc44a5e3d7a0e63a9316dab2894632883cf9c9c84

— **byte-identical to base over all 420 settlements.** No institution is added or removed
anywhere; **no generation golden can move.** That is the single most important figure in this
charter and it is executed, not reasoned.

The shift is entirely in DERIVED reads:

| surface | measured shift |
|---|---|
| interior kind | **111 of 420 settlements (26.4%)** change at least one institution's interior: `Priest (resident)` vice→generic in **70**, `Charlatan fortune tellers` security→generic in **26**, `Warden's Lodge` vice→generic in **17**, `Dragon resident` vice→generic in **6**. With J-CH-1's one override, `Priest (resident)` becomes `faith` rather than `generic` in those 70 |
| `hasCharityFacet` (`cohesionWeave.js:344`, the generosity mover) | **UNMOVED** — none of the four rows resolves to or from `faith` under the anchoring alone; with J-CH-1's override, `Priest (resident)` **gains** `faith`, so 70 villages become charity-capable that were not. That is a *correction* (a parish priest is the charity roster's paradigm case) and it is a declared shift |
| `sewerDerivation.js:386` CIVIC_CAPACITY (`nature === 'civic'`) | **UNMOVED** — no cell moves to or from `civic` |
| `institutionLifecycle.js:438` `hasVice` | **flips true→false in 70 of 420 settlements** (287 → 217), every one a village losing `Priest (resident)` as its only vice institution. **DARK TODAY:** the read sits inside `if (underwaysFoundingLit && …)` and `underwaysOrganicFoundingEnabled` is **absent from `DEFAULT_SIMULATION_RULES`** (executed: `'underwaysOrganicFoundingEnabled' in DEFAULT_SIMULATION_RULES` → `false`). It becomes live at the flag's lighting regen. **Read plainly: today, if that flag were lit, the engine would propose smugglers' tunnels under 70 villages because the parish priest reads as a tavern.** That is CH-1's best argument and it is measured |
| `navalLayer.js:174`, `convergence.js:898`, `clandestineFacet.js:66` | **UNMOVED** — they read `institutionFunction`/`clandestine`, kinds with zero moved cells |

**EXECUTED CORROBORATION (this lane, at the CH-1 patch, mutexed).** The seven files most
exposed to the change were run against the patched worktree:

    gate-mutex: acquired atomic lock as PID 36085 after 0 poll(s).
     Test Files  7 passed (7)
          Tests  110 passed (110)
       Duration  2.48s
    TRUE_EXIT=0

`tests/generation.test.js`, `tests/domain/cohesionWeave.test.js`,
`tests/interior/interiorModel.test.js`, `tests/domain/undercitySewerDerivation.test.js`,
`tests/domain/undercityStrataExistence.test.js`, `tests/data/underwaysInstitutionParity.test.js`,
`tests/domain/memoryHorizon.test.js` — **all green with the anchoring applied**.

**AND THE GENERATOR GOLDEN MASTER ITSELF, run separately** (a first draft of this charter
mis-named `tests/generation.test.js` as the golden master; the golden master is
`tests/property/generatorGoldenMaster.test.js`, which takes
`sha256(JSON.stringify(settlement))` over a keyed corpus — the same instrument as the digest
above. The mis-naming is corrected here rather than left standing):

    gate-mutex: acquired atomic lock as PID 38477 after 0 poll(s).
     Test Files  1 passed (1)
          Tests  3 passed (3)
       Duration  9.11s
    TRUE_EXIT=0

The patch was present in the tree for both runs (`git diff --stat` = 15 insertions /
15 deletions in `cohesionWeave.js`). **This is the strongest receipt in the charter: CH-1's
most-feared instrument does not move.**

**Goldens/pins to re-record:** none on the generation side (digest identical). Interior
fixtures and any interior-kind assertion naming one of the four rows must be re-recorded —
`tests/fixtures/interiorFixtures.js` and `tests/interior/interiorModel.test.js` are the
candidates; the build lane re-records **only what actually reds**, by name, in the packet.

### §1(e) · Acceptance — 8 arms, each with a convicting mutant

| # | arm | mutant that convicts it |
|---|---|---|
| A1 | `facetOf` on `Priest (resident)` is `faith` (declared), not `vice` | delete the `facets` key → `generic` |
| A2 | `facetOf` on `Warden's Lodge` is `null`; `interiorKindOf` is `generic` | revert `\bdens?\b` → `vice` |
| A3 | `facetOf` on `Dragon resident` is `null` | revert `\bdens?\b` → `vice` |
| A4 | `facetOf` on `Charlatan fortune tellers` is `null` | revert the `fort` stem set → `security` |
| A5 | **NON-REGRESSION, the anchoring's own trap:** `Blacksmith`, `Blacksmiths (3-10)`, `Sawmill`, `Sawmill (commercial)` all still resolve `craft`; `Gambling den` still `vice`; `Town watch` still `security`; `Massive walls and fortifications` still `security`; `Banking houses` still `trade` | change `smiths?\b` to `\bsmith` → two rows fall to `generic` |
| A6 | the whole-catalog delta is EXACTLY four cells of 933 (the table above, as data) | any extra anchor change → the count moves |
| A7 | every `FACET_INFERENCE` alternative carries an anchor (source scan) | add a bare alternative → reds |
| A8 | `institutionSubstructure` verdicts are UNMOVED for all 311 rows (the undercity's seed gate is untouched) | drop `\b` from `\bcrypt` and add a mid-word row → reds |

### §1(f) · Files, bundles, headroom

* **Production files: 2.** `src/domain/spatial/cohesionWeave.js` (the table) and
  `src/data/institutionalCatalog.js` (one `facets` key on `Priest (resident)`).
  *Ceiling ≤3 met.*
* **Edge bundles: BOTH files are inputs to three rosters** (`aiCharterBundle`,
  `aiGroundingBundle`, `aiOutputSchemaBundle`). `npm run build:edge-shared` is **owed in the
  member commit**, all five `.meta.json` files committed as a set, and
  `tests/edgeFunctions` joins the sweep (the §475 law).
* **Size baseline: no row for either file; `src/data/**` has no `max-lines` rule; `src/domain/**`
  is 800 effective and `cohesionWeave.js` is 347 raw.** No headroom problem.
* **Naked-claim debt:** the anchoring comment must avoid completeness vocabulary in a `.js`
  file (the UC-2 landing hit this). Run the exact `CLAIM_RE` before the commit.

---

## §2 · CH-2 — THE MAGIC LICENCE

### §2(a) · The field

`magicLicense: 'none' | 'low' | 'medium' | 'high'` — **lowercase**, because H24 measures
`getMagicLevel` emitting exactly those four tokens and §491's own justification is "the four
tokens `getMagicLevel` already emits". §491's uppercase spelling is corrected here.

The field goes on the **28** Magic/Exotic rows (H25), not 32; the four Adventuring hand-offs
in R-INST-5's verdict table sit outside the shelf gate and need no licence.

**VALUES — R-INST-5 §Σ.3's verdict table, quoted, marked AS THE DOSSIER'S PROPOSAL.**
R-INST-5 records the distribution as NONE 11 · LOW 5 · MEDIUM 4 · HIGH 12 = 32 over its
whole table; restricted to the 28 shelf rows the proposal is:

| tier | shelf | row | dossier's licence |
|---|---|---|---|
| hamlet | Magic | Traveling hedge wizard | low |
| hamlet | Magic | Adventurers' charter hall | **none** |
| village | Magic | Hedge wizard | low |
| village | Magic | Druid Circle | low |
| village | Magic | Adventurers' charter hall | **none** |
| village | Magic | Healer (divine, 1st level) | low |
| town | Magic | Wizard's tower | medium |
| town | Magic | Elder Grove Council | low |
| town | Magic | Alchemist shop | **none** |
| town | Magic | Warden's Lodge | **none** |
| town | Magic | Teleportation circle | high |
| city | Magic | Wizard's tower | medium |
| city | Magic | Mages' guild | medium |
| city | Magic | Alchemist quarter | **none** |
| city | Magic | Enchanter's shop | high |
| city | Magic | Scroll scribe | medium |
| city | Magic | Teleportation circle | high |
| city | Exotic | Planar traders | high |
| city | Exotic | Dragon resident | **none** |
| city | Exotic | Golem workforce | high |
| city | Exotic | Undead labor | high |
| city | Exotic | Dream parlors (high magic) | high |
| city | Exotic | Airship docking (high magic) | high |
| city | Exotic | Message network (high magic) | high |
| metropolis | Magic | Academy of magic | high |
| metropolis | Magic | Mages' district | high |
| metropolis | Magic | Great library | **none** |
| metropolis | Magic | Planar embassy | high |

**Amendment-2 cross-check, executed:** the R-INST-5 and R-INST-6 verdict tables share **zero
rows** (28 distinct names against 22; `comm -12` over both extracted name sets returns
empty). No CH-2 licence value is corroborated or contradicted by R-INST-6. The cross-check
has no live subject, and saying so is the result.

**No name disagrees across tiers** (checked; `Wizard's tower` and `Teleportation circle`
carry the same licence at both tiers), so the licence can be keyed by NAME exactly as
`ARCANE_BY_CATALOG_NAME` is.

### §2(b) · The gate paths, rewritten — and there are FIVE, not three

§491 names three. The measured census is five. Each is quoted before, with the after CH-2
proposes.

**P1 — the magic multiplier** (`institutionProbability.js:88-96`)

```js
if (cat.includes('magic') || inst.includes('wizard') || inst.includes('mage') ||
    inst.includes('alchemist') || inst.includes('enchant') || inst.includes('spell') ||
    inst.includes('arcane') || inst.includes('teleportation') || inst.includes('planar')) {
  const magicMult = config.priorityMagic / 50;
```
→ `if (licenceAtLeast(name, 'low')) {` — the shelf and the eight name substrings both go.
This is the path G4(2) and G5 name.

**P2 — the hard-zero list** (`institutionProbability.js:176-183`)

```js
const hiMagicInsts = ['airship','golem','undead labor','dream parlor','magical banking',
  'message network','planar','teleportation','magic item consignment','enchanting quarter','high magic'];
if (magPriority < 66 && hiMagicInsts.some(kw => inst.includes(kw))) { chance *= 0; }
```
→ `if (magPriority < 66 && licenceAtLeast(name, 'high')) { chance *= 0; }`.
This is **G7's cure**: the goods vocabulary (`'magic item consignment'`, a member of
`ARCANE_GOODS`) and the two dead keywords leave the institution gate, and what replaces them
is the declared licence. **See §2(e) for why this arm is the dominant term in the shift and
carries its own judgment.**

**P3 — the exotic scaler** (`institutionProbability.js:186-195`)

```js
const NON_MAGIC_EXOTICS = ['dragon resident', 'underground city'];
const isNonMagicExotic = NON_MAGIC_EXOTICS.some(kw => inst.includes(kw));
const isMagicOrExoticCategory = (cat.includes('magic') || cat === 'exotic') && !isNonMagicExotic;
```
→ `const isMagicOrExoticCategory = licenceAtLeast(name, 'low');`
The exemption list dies with the shelf test — and half of it was already dead (H20: the
`'underground city'` member never fires, because that row is on the Criminal shelf).

**P4 — the direct world-fact gate** (`institutionProbability.js:302`)

```js
if (config.magicExists === false && isArcaneInstitution(name, category)) { return 0; }
```
→ a catalog row's declared licence decides; `isArcaneInstitution` stays the fallback for a
non-catalog entity. This is the seam that closes **G5's tag-versus-keyword divergence with
ONE read**.

**P5 — THE WORLD LAW** (`generationContext.js:132-139`, consulted at
`assembleInstitutions.js:268/410/484` and `cascadeGenerator.js:180`) — **the path §491 does
not name and the one that actually decides a dead-magic world**:

```js
function nativeInstitutionRequiresMagic(institution) {
  if (carriesExplicitMagicMetadata(entity)) return true;
  const name = String(entity.name || '').toLowerCase();
  return ARCANE_INST_KW.some(keyword => name.includes(keyword));
}
```
It strikes **26 catalog rows** by unanchored name substring before any probability runs.
CH-2 routes it through the licence for catalog rows and keeps the keyword list as the
non-catalog fallback. **This is also the site that discharges the chair-to-schedule item at
`DESIGN_REALM_MAGIC_TOGGLE.md:514-519` (H8):** the unanchored `ARCANE_INST_KW` is *live* on
the generation path here, not merely latent, and the licence removes the substring test from
the catalog case entirely.

**The UI half** — `magicFilter.js:37` `if (c === 'magic' || c === 'exotic') return true;` —
is the shelf-as-gate in `filterCatalogForMagic` / `filterServicesForMagic`. Routing it
through the licence is what closes **G4's real, measured divergence** (H16: the Adventurers'
charter hall generates 16 times at `magicExists:false` and is invisible in the grid).

**REFUTED, and therefore NOT in CH-2:** G6's Dragon-resident divergence does not exist
(H19 — zero instances at dead-magic and at pm0 over 840 settlements, because P5 strikes it
first), and G5's dead-magic half is likewise wrong (H18). CH-2 should not "fix" either.

### §2(c) · G7 — what replaces the goods vocabulary

`ARCANE_GOODS` stays where it belongs, in `magicFilter.js:15-20`, gating **goods**
(`filterGoodsForMagic`). Its member `'Magic item consignment'` leaves the institution gate
when P2 becomes `licenceAtLeast(name,'high')`. The two dead keywords (`magical banking`,
`enchanting quarter`) are simply deleted — measured zero matches over 311 rows. The trap G7
names ("a future row named 'Enchanting quarter' would be hard-zeroed while 'Alchemist
quarter' is not") is closed by construction: a future row is hard-zeroed iff its author
declares `high`.

### §2(d) · The walker

`tests/lint/magicLicenceCensus.walker.test.js` (a **CREATE** row). Arms:

1. every Magic/Exotic catalog row declares a `magicLicense`, and the value is one of the four
   `getMagicLevel` tokens (imported from `constants.js`, never re-typed);
2. **no gate reads the shelf** — a source scan over `src/generators/institutionProbability.js`,
   `src/domain/magicFilter.js` and `src/generators/generationContext.js` for
   `category === 'magic'`, `cat === 'exotic'`, `cat.includes('magic')`, grep-proven zero;
3. the count of licensed rows is an inventory ratchet at 28 (only grows);
4. `licenceAtLeast` is total and pure over the four tokens plus `null`.

⚠ **`tests/lint/arcaneClassifierCensus.walker.test.js` is the guard CH-2 must feed by hand.**
Its allowlist is keyed to the **exact alternation signature** ("a pattern that CHANGES comes
back for a decision"), and it carries a separate arm at :319-331 asserting that
`src/generators/institutionProbability.js` still imports the canonical detector. Every
alternation CH-2 deletes or rewrites needs its allowlist entry updated **with a stated
reason**, or the census reds as a stale exemption.

### §2(e) · THE DECLARED SHIFT — measured over 2,100 cases

A working model of the whole design (the licence leaf + all four `institutionProbability`
gates) was applied in the worktree and swept over the corpus **× five magic cases**
(`magicExists:false`, `priorityMagic` 0 / 20 / 50 / 80) = **2,100 settlements**:

    ROSTER_CHANGED 361  FULLY_UNCHANGED 1739

| magic case | settlements | rosters changed | NONE-licensed instances before | after |
|---|---|---|---|---|
| `magicExists:false` | 420 | **0** | 16 | 16 |
| `priorityMagic:0` | 420 | **0** | 18 | 18 |
| `priorityMagic:20` | 420 | 124 | 69 | **191** |
| `priorityMagic:50` | 420 | 101 | 173 | **201** |
| `priorityMagic:80` | 420 | 136 | 265 | **177** |

**The dead-magic answer to the brief's question — "which settlements at magic=0 keep the 11
mundane entries" — is: exactly the ones that keep them today, because P5 (the world law)
decides that case and the model did not yet reroute it.** The NONE-licensed rows that survive
a dead-magic world at base are the two `Adventurers' charter hall` rows and `Underground
city`; `Alchemist shop`, `Alchemist quarter`, `Warden's Lodge`, `Dragon resident` and
`Great library` are all struck at 0 instances. **Restoring the mundane chemical trade to a
dead-magic world therefore requires P5, not P4** — which is exactly why the fifth path
matters and why CH-2 cannot be built from §491's three-path description.

At `priorityMagic > 0` the licence does what R-INST-5 intended:
`Alchemist quarter` **+84**, `Alchemist shop` **+33**, `Great library` **+24**,
`Golem workforce` **+25**, `Dream parlors` **+21**, `Message network` **+19**,
`Undead labor` **+18** settlements gain the row; `Enchanter's shop` **−56**,
`Academy of magic` **−46**, `Mages' district` **−39**, `Warden's Lodge` **−31** lose it.

**The P2 arm is the dominant term.** Re-running with P2 reverted to the name list (gates
1/3/4 only) gives **273 changed instead of 361** — so replacing `hiMagicInsts` with
`licenceAtLeast('high')` accounts for **88 of the 361** and is what removes the enchanter,
the academy and the mages' district from low-magic worlds. That is a defensible reading of
"HIGH means high-magic infrastructure", but it is a **content decision**, not a repair.

**JUDGMENT J-CH-2-1 (to the chair, not taken by this compile):** P2's widening should be
**split out of CH-2** and either dropped or ruled separately. *Recommend:* CH-2 ships
P1/P3/P4/P5 with the licence and leaves `hiMagicInsts` in place, deleting only its three dead
keywords and its one goods-vocabulary member (G7's literal cure, 0 measured rows affected).
*Rejected:* shipping P2's licence form inside CH-2 — it changes what a low-magic city
*contains*, which is the DW/content train's business, and it would let a repair car carry the
biggest same-seed shift in the program under a hygiene label. *Reversal:* one line in P2.
*Blast radius of the recommendation:* the CH-2 shift drops from 361/2100 to **273/2100**,
and G7 is still discharged.

### §2(f) · Acceptance, files, headroom, bundles

**Acceptance (≤8):** (1) every Magic/Exotic row declares a licence in the four tokens;
(2) no gate reads the shelf (grep-proven, with a mutant that re-adds one);
(3) `Alchemist shop` and `Alchemist quarter` are reachable at `priorityMagic:20` where they
were not (the G3 cure, by execution); (4) the Adventurers' charter hall is present in the
same world in BOTH generation and `filterCatalogForMagic` output (the G4 cure — one read,
two surfaces); (5) `Great library` is not multiplied by the magic dial (the G5 cure);
(6) the three dead `hiMagicInsts` keywords and the goods member are gone and no row's
hard-zero verdict changes (the G7 cure, measured 0 rows); (7) a non-catalog entity still
falls to `isArcaneInstitution` (the fallback is live); (8) `NON_MAGIC_EXOTICS` is gone and
`Dragon resident` behaves identically (the H20 dead-half cleanup).

**Files (≤3):** `src/data/institutionalCatalog.js` (28 field additions),
`src/generators/institutionProbability.js` (P1–P4), `src/generators/generationContext.js`
(P5). **`src/domain/magicFilter.js` is a fourth** — so CH-2 is **over the ≤3 ceiling** unless
the UI half is split. **JUDGMENT J-CH-2-2:** split CH-2 into **CH-2a** (the catalog field +
the licence reader on the existing `arcaneInstitutionIdentity.js` adapter + the generation
gates P1–P4) and **CH-2b** (P5 the world law + `magicFilter`'s UI half), two cars of ≤3 files
each. *Rejected:* one four-file car — the ≤3 rule is the chair's and this is exactly the
"one more file" that erodes it. *Reversal:* merge the two packets before minting.

**Where the licence reader lives.** ⚠ **Not a new leaf that anything eager imports.**
`arcaneInstitutionVocabulary.js`'s header records that a single eager→lazy edge closed a
chunk-level cycle and made `dist` un-bootable (lane BT, 2026-08-03; `@guarded-by
scripts/boot-smoke.mjs stage 1`). The zero-cost route is to **extend the adapter that already
builds an index over the catalog** — `arcaneInstitutionIdentity.js` already walks every tier
and builds `ARCANE_BY_CATALOG_NAME` (:58-76) — with a sibling
`MAGIC_LICENCE_BY_CATALOG_NAME` and an exported `institutionCatalogMagicLicence(name)`.
`institutionProbability.js` already imports that module (:12), so **no new chunk edge exists
at all**. `magicFilter.js` is lazy and may import it in the safe direction.

**Bundles:** `institutionalCatalog.js` is in three rosters ⇒ `build:edge-shared` owed, five
metas committed, `tests/edgeFunctions` in the sweep. **Size baseline:** no row for any CH-2
file; no ceiling risk.

---

## §3 · CH-3 — THE DATA SLIPS

### §3.1 · The `minTier`-versus-block audit (amendment 1)

**Executed catalog-wide** (`CH-mintier-audit.mjs`): 311 rows, 36 carry `minTier`,
**26 REDUNDANT** (`minTier` equals the block tier — a no-op declaration),
**10 ABOVE-BLOCK**, **0 BELOW-BLOCK**. **Report this count in §0: it is TEN.**

| # | block | shelf | row | minTier | seen by |
|---|---|---|---|---|---|
| 1 | village | Criminal | Smuggling network | city | R-INST-6 D6-1 |
| 2 | city | Exotic | Airship docking (high magic) | metropolis | R-INST-5 G2 |
| 3 | city | Exotic | Dream parlors (high magic) | metropolis | R-INST-5 G2 |
| 4 | city | Exotic | Message network (high magic) | metropolis | R-INST-5 G2 |
| 5 | city | Exotic | Dragon resident | metropolis | R-INST-5 G2 |
| 6 | city | Exotic | **Planar traders** | metropolis | **no tranche** |
| 7 | city | Entertainment | **Colosseum/arena** | metropolis | **no tranche** |
| 8 | city | Entertainment | **Gambling district** | metropolis | **no tranche** |
| 9 | city | Entertainment | **Multiple theaters** | metropolis | **no tranche** |
| 10 | city | Entertainment | **Opera house** | metropolis | **no tranche** |

**Classification, with the reader dependency measured.** The dependency is real and it is the
UI (H13): generation reads `minTier` (`assembleInstitutions.js:256`, before the toggle read),
the UI reads the BLOCK (`lookups.js:54-58`, unfiltered). For these ten rows the two disagree,
so a user can see and force-require an institution the generator will silently refuse.

Both structural resolutions were measured over the 420 corpus:

| resolution | measured effect | verdict |
|---|---|---|
| **DELETE `minTier`** (the block is the truth; the row fires at its own tier) | **97/420 rosters change.** `Colosseum/arena` +28, `Multiple theaters` +27, `Fighting pits` +23, `Opera house` +21 — cities acquire metropolis-grade entertainment | **REFUSED.** This changes what a city *is*. It is content, not hygiene |
| **MOVE the row into the block its `minTier` names** | **108/420 rosters change**, and the naive move **clobbers the city's own `Smuggling network` row** (L1998) with the village row's `baseChance: 0.1` — 69 settlements lose it. Moving also re-orders the `mergeCatalogs(city, metropolis)` iteration, which reshuffles the rng draw sequence at metropolis | **REFUSED as written** — a name collision across blocks plus a large incidental shift |
| **KEEP the declaration; close the reader gap** | **0/420 change** | **RECOMMENDED** |

**JUDGMENT J-CH-3-1.** *Decided:* CH-3 resolves the class by **teaching the UI reader the
gate rather than moving the data** — `getInstitutionalCatalog(tier)` / `getFullCatalogWithTierMeta`
/ `getInstitutionsForTier` filter out rows whose `minTier` outranks the requested tier, and a
walker pins that the UI-visible set and the generator-eligible set are equal at every tier.
The `minTier`-in-a-lower-block idiom then becomes a *legitimate authoring form* ("author here,
gate there") rather than a slip, and the 26 REDUNDANT declarations are deleted as no-ops.
*Why:* the two structural rewrites are measured content changes (97 and 108 settlements) and
§491 chartered a repair train; this option is the only one that costs **zero** same-seed shift
while actually closing the defect a user can hit. *Rejected:* the "tier block is the
structural truth" reading in §491 — I am contradicting the chair's own framing, on the
measurement, and flagging it as the charter's one substantive divergence. *Reversal:* revert
the lookups filter; the data is untouched, so nothing else moves. *Blast radius:* the UI
catalog at city loses 10 rows it could never produce; `tests/generators/metropolisCatalogReachable.test.js`'s
RATCHET arm asserts every block row is reachable from `getInstitutionalCatalog(tier)` and
**will red** — it must be amended to "reachable at every tier the row can actually fire at",
with the amendment recorded as the decision it is.

⚠ **The 26 REDUNDANT rows are not free either:** deleting a no-op key is a byte change on a
generation-path data file. Measured: deleting `minTier` where it equals the block tier cannot
change the gate's verdict (`tierIndex < TIER_ORDER.indexOf(minTier)` is false when they are
equal), but the key is spread onto the settlement record by `assembleInstitutions`, so
**removing it moves the record**. The build lane measures the corpus digest before and after
and declares it; if the chair prefers zero shift, the redundant rows stay and the walker
merely reports them.

### §3.2 · `religiousCenter` exclusivity at city

**What the reader does.** `assembleInstitutions.js:323`
`if (inst.exclusiveGroup && exclusiveGroups[inst.exclusiveGroup]) return;` — an early return
**before** the `rng.chance(...)` draw at :353. At city the group holds two members
(`Cathedral (10,000+ only)` L1747 and `Multiple monasteries` L1755), so a city gets one or
the other, never both.

**What R-INST-3 says it should do**, quoted from its §1 C4: "`exclusiveGroup: religiousCenter`
is correct at village (one church) and **wrong at city** (a cathedral city has friaries, a
nunnery and 20–108 parishes: Chester, Norwich, London)".

**The estate's own precedent, found this lane:** the metropolis block's `Great cathedral` and
`Major monasteries (5-10)` carry **no** `exclusiveGroup`. The same pair, one tier up, is
already allowed to coexist. The city rows are the outlier.

**The fix:** delete `exclusiveGroup: 'religiousCenter'` from the two city rows.

**THE DECLARED SHIFT — measured, and it is large. 81 of 420 settlements change roster**, and
roughly 130 distinct institution names move. **The mechanism is measured, not guessed:**
because :323 returns *before* the rng draw, un-suppressing a row makes it consume a draw and
**reshuffles the entire downstream draw sequence for that settlement**. So the shift is not
"cities gain monasteries"; it is a same-seed re-roll of the whole city/metropolis
institutional roster. Corpus digest moves to
`6127eae762dc8b4c4ef41b6ea1006d527c238cd679e45020fe9c3b776b600c18`.

**JUDGMENT J-CH-3-2 (to the chair):** this single item carries a larger same-seed shift than
CH-1 and CH-3's other five items combined. *Recommend:* it rides **CH-3 as its own final
commit** with the shift declared in the packet and the commit, and the chair rules it
explicitly against THE PROMISE (a seed is a starting world forever — existing saves keep their
stored institutions; only newly generated worlds differ). *Rejected:* folding it silently in
with the prose fixes. *Reversal:* re-add two lines.

### §3.3 · L1670 — the `priorityCategory` run

`Auction house` is not a lone slip. The city Economy shelf carries a **contiguous run of
four** reading `priorityCategory: 'military'` — `Mint (official)`, `Auction house`,
`Harbour master's office`, `Furrier's district` — and the city Criminal shelf carries one
more, `Contract killer`, the only row of 28 on that shelf that departs from `criminal`.

**⚠ The honest frame, measured:** a catalog-wide modal audit (`CH-prioritycat-audit.mjs`)
shows `priorityCategory` divergence is **systemic and owner-settled** — the Crafts shelf's
modal value is `government` (30) over `crafts` (25), and
`tests/data/priorityCategoryPlausibility.test.js`'s header says "the deliberate dual-axis
divergence elsewhere is untouched (owner-settled)". **A departure is therefore not by itself
a defect.** What identifies these five is (a) the contiguous-run signature the plausibility
test's own header names as the known defect shape, and (b) a measured live consequence.

**The live consequence, executed:** `institutionAssignment.js:71-83` maps `priorityCategory`
to ranked district categories. All five currently place
`["military","civic","noble","residential","other"]` — an auction house, a furrier's district
and a contract killer in the **military quarter**. The honest rankings are
`economy → ["merchant","civic","craft",…]` and `criminal → ["criminal","residential",…]`.

**REFUTED (mine):** I hypothesised the `Contract killer` slip also hides it from
`hasCriminalInst`. It does not — `corruption.js:514-521` reads the `criminal` tag or the
category, never `priorityCategory`; measured `hasCriminalInst = true` either way. Recorded so
the skeptic does not have to find it.

**Shift: 0 of 420 rosters change; the corpus digest moves** (the field is spread onto the
record). Downstream, the town-map district assignment moves for those five rows wherever they
appear.

### §3.4 · L1112 — the tanner prose

`institutionalCatalog.js:1116` reads "Leather production. MUST be downstream and downwind."
R-INST-2 §9(c) ran three negation rounds for a dated English ordinance expelling tanners and
found **"Null for tanners specifically"**; Coventry 1421 concerns butchers; Northampton,
Norwich, Gloucester, York (Tanner Row) and Nottingham are all intramural. Its parent-lane
note: "the catalog's L1112 'MUST be downstream and downwind' is therefore a siting WEIGHT, not
a hard rule."

**No engine reader enforces it — checked, not assumed.** The town map *does* have a
downwind/downstream placement rule (`townLayoutV2.js:209` `if (/\b(downwind|downstream|
tannery|noxious|refuse|midden)\b/.test(t)) { ringPush += 18; water += 30; }`), **but `t` is a
QUARTER's own `location` prose** (`locationBias(text)`, :201), produced by
`spatialGenerator.js:57-61` (`location: 'Downstream/downwind'`), not the catalog `desc`. The
sibling haystack at `townMapModel.js:516` is `name + priorityCategory + category + tags` —
also not the desc. **The catalog desc reaches no placement reader**, and the word `tannery`
in the layout regex already matches the name, so the rule survives the rewrite untouched.

The rewrite is to what the negation search supports, e.g. *"Leather production. Foul-smelling;
sited by water and toward the settlement's edge where it can be."* **Shift: the desc string
only.**

⚠ **The overstatement has FIVE spellings, not one** (`git grep 'downstream and downwind|
downwind and downstream|Placed downstream'`), and rewriting L1116 alone leaves four louder
ones standing:

| home | string |
|---|---|
| `institutionalCatalog.js:1116` | "Leather production. **MUST** be downstream and downwind." |
| `institutionDescVariants.js:778` (`town\|Crafts\|Tanners`) | "Leather-making. Kept downstream and downwind, **always**." |
| `institutionDescVariants.js:779` (same key) | "The making of leather. It **must** sit downwind and downstream of everything else." |
| `institutionVocabulary.js:87` (`Tannery`) | "…Foul-smelling and **always** placed downstream and downwind." |
| `institutionVocabulary.js:107` (`Tanners`) | "…Their reek **keeps** them downstream and downwind of everyone else." |

The village row `institutionalCatalog.js:628` already says the honest thing ("Placed
downstream") and is the register to bring the other five into. **CH-3 rewrites all five as one
act** — the same shape as HK-6's three-string sweep, and for the same reason: a prose fix that
leaves four louder copies is not a fix. `institutionVocabulary.js` becomes a fourth CH-3
production file, which is a ≤3-ceiling problem the chair should rule on (see §6).

### §3.5 · HK-6 — the three "Eberron" strings

Exactly three, sweep-complete (H31): `institutionalCatalog.js:2183`,
`institutionDescVariants.js:242,243`.

**The shift is narrower than "goldens move" (H32).** `assembleInstitutions` picks among
`[canonicalDesc, ...variants]` with a pure fnv hash of *(settlement seed + institution name)*
— **zero rng draws, and the hash does not read the text**. Changing the strings therefore
changes the *text at the chosen index*, never *which index is chosen* and never the roster.
The pins: `tests/generators/dossierContent.test.js` (the walker + register + canonical-at-zero
arms) and any dossier golden containing the row. The row is rare — `Airship docking (high
magic)` is `minTier: metropolis`, `baseChance: 0.1`, and hard-zeroed below `priorityMagic` 66
— so the re-record list will be short; the build lane names it from the reds, not from memory.

Setting-free rewrites, preserving every stated fact:
* catalog L2183: `'Mooring towers with magical weather protection.'`
* variant L242: `'Mooring towers, warded against the weather by magic.'`
* variant L243: `'Towers to moor airships, with magical protection from the elements.'`

### §3.6 · R-INST-6-1 — the two subterranean rows (amendment 1)

`Underground city` (L2383) and `Black market bazaar` (L2375) are explicitly subterranean in
their own prose, carry `tags:['criminal','underground']`, and declare no `facets` — so they
seed the undercity sheet **zero** times.

**Measured end to end** (`CH-downstream.mjs`, `deriveStrataExistence` over one institution):

    BEFORE Underground city      {"seeds":[],"subFacet":null}
    BEFORE Black market bazaar   {"seeds":[],"subFacet":null}
    BEFORE Underground network   {"seeds":[{"class":"subterranean","licence":"INSTITUTION_FACET",…}]}
    AFTER  Underground city      {"seeds":[{"class":"subterranean","licence":"INSTITUTION_FACET",
                                            "anchor":"underground_city",…}]}
    AFTER  Black market bazaar   {"seeds":[{"class":"subterranean","licence":"INSTITUTION_FACET",
                                            "anchor":"black_market_bazaar",…}]}

**Shift: 0 of 420 rosters and 0 interior kinds change; the corpus digest MOVES**
(`a542cc2e…`), because `assembleInstitutions` spreads the row onto the record and the
`facets` key is persisted — exactly what the catalog's own comment at L879 predicted
("Golden-shifting (G2)"). The undercity derivation gains a seed at every metropolis carrying
either row.

**Does it belong in CH-3?** **Yes.** *Reasoning:* the change is a **data declaration matching
the row's own prose**, using an affordance already landed on three sibling rows in the same
shelf family, read through the same chokepoint, with no new reader, no new vocabulary and no
new capability. It is the same act as CH-1's one `facets` override. The undercity train's
work would be *deriving something new* from the seed; declaring that the seed exists is
catalog hygiene. It also arms `buildCatalogForbiddance()`'s by-facet-kind union so both rows
inherit "tunnels flood", which R-INST-6 notes is correct and currently absent.
**Priced like every other item:** 0 roster shift, 1 digest shift, +2 seeds per qualifying
metropolis, and the undercity pins (`tests/domain/undercityStrataExistence.test.js`,
`tests/data/underwaysInstitutionParity.test.js`) join the sweep.

### §3.7 · `Kidnapping ring` (R-INST-6 L.14)

Description and `exclusionConditions` disagree (H34). Both readings are defensible and the
dossier records both. **Decided: rewrite the DESCRIPTION to match the condition, not the
reverse** — changing `exclusionConditions` is a behaviour change (the row would start firing
alongside the slave market, a roster shift); changing the desc is prose. Proposed:
*"Takes people for ransom or sale where no lawful market exists to do it openly. Runs its own
holding, its own escorts, its own silence."* **Shift: the desc string only.** *(Reversal:
restore the original sentence. If the chair prefers the coexistence the description imagines,
that is a content-train item, not CH-3.)*

### §3.8 · CH-3 shift summary

| item | rosters changed / 420 | digest moves | notes |
|---|---|---|---|
| §3.1 minTier — the recommended reader fix | **0** | no | the two data rewrites were measured at 97 and 108 and refused |
| §3.2 religiousCenter at city | **81** | yes | the draw-sequence reshuffle; its own commit |
| §3.3 priorityCategory run (5 rows) | **0** | yes | district placement moves |
| §3.4 L1112 prose | 0 | yes (desc) | no reader enforces it |
| §3.5 HK-6 three strings | 0 | yes (desc) | pick index provably stable |
| §3.6 R-INST-6-1 two facets | **0** | yes | +1 undercity seed per row |
| §3.7 Kidnapping ring desc | 0 | yes (desc) | prose only |

---

## §4 · THE TRAIN

### §4.1 · Order

**CH-1 → CH-2a → CH-2b → CH-3a → CH-3b → CH-3c** (six cars after the two ≤3-ceiling splits
J-CH-2-2 and J-CH-3-5; the chair may merge any pair back by waiving the ceiling).
The spine is **CH-1 → CH-2 → CH-3.** CH-1 first because it is the only car whose generation
digest is *provably unmoved*, so it lands with the smallest risk and gives the train its
first green; because DW-0 reads facets and wants them honest; and because it is the only car
that touches `cohesionWeave.js`, which every other train also touches. CH-2 before CH-3
because CH-3's `religiousCenter` item reshuffles rosters and would make CH-2's magic-axis
before/after harder to attribute. **The counter-argument, recorded:** CH-3's prose items are
the cheapest and could land first as a warm-up; rejected because CH-3's §3.2 is the train's
biggest shift and should not lead.

### §4.2 · Change-path de-duplication — checked against the LIVE manifest

At this charter's base `f1e4d515`, `docs/implementation/PACKET_MANIFEST.json` held **167
packets: 166 LANDED, 1 SUPERSEDED, ZERO non-terminal**; at the current tip `00e7af612` it
holds **168: 167 LANDED, 1 SUPERSEDED, ZERO non-terminal**. The one non-terminal packet that
was in flight during this compile, **MF-UC2 (READY)** on `refs/preserve/holding-uc2`, has
since LANDED and released its reservations. For the record, they were:

* `src/domain/undercity/monotoneComponents.js` (CREATE)
* `tests/domain/undercityMonotoneComponents.test.js` (CREATE)
* `tests/lint/ruinFilterRoster.walker.test.js` (TEST)
* `tests/domain/resourceSites.test.js` (TEST)
* `docs/implementation/packets/town-cartography/MF-UC2.md` (DOC)

**None collided with any CH car, and all five are now free.** The collision that matters is
therefore **between the CH cars themselves**: `src/data/institutionalCatalog.js` is a change path for CH-1 (one `facets` key),
CH-2a (28 licence fields) and CH-3 (every data slip). The validator refuses two non-terminal
packets naming the same path (`implementation-packets.mjs:589-595`; `TERMINAL = LANDED |
SUPERSEDED` only, :43), so **the cars MUST be serial-minted**: mint CH-2a's packet only after
CH-1 is LANDED, CH-2b's after CH-2a, CH-3's after CH-2b. This is §471's law and it applies in
full. The build lane re-reads the live manifest at its own base before minting — never this
roster, which is a snapshot.

*(An alternative that would let CH-1 and CH-3 mint together: drop CH-1's single `facets`
override so CH-1 touches only `cohesionWeave.js`. Rejected — J-CH-1's one override is the
row with the largest measured mis-inference, and serial-minting is cheap.)*

### §4.3 · Packet stubs (PACKET_STANDARD form; family `catalog-hygiene`)

A new family needs no validator change (H38): create
`docs/implementation/packets/catalog-hygiene/`, write the packet `.md`, add its row to
`docs/implementation/INDEX.md` with a status cell, and add the manifest entry.

```
id: CH-1     family: catalog-hygiene     status: DRAFT
packetPath: docs/implementation/packets/catalog-hygiene/CH-1.md
changeManifest:
  MODIFY  src/domain/spatial/cohesionWeave.js
  MODIFY  src/data/institutionalCatalog.js
  CREATE  tests/lint/facetInferenceHonesty.walker.test.js
  TEST    tests/domain/cohesionWeave.test.js
  TEST    tests/interior/interiorModel.test.js
  DOC     docs/implementation/packets/catalog-hygiene/CH-1.md
requiredSymbols: FACET_INFERENCE, facetOf, declaredFacet, inferFacet, interiorKindOf
                 (symbols, never counts; never the migration head)
```
```
id: CH-2a    family: catalog-hygiene     status: DRAFT (mint AFTER CH-1 is LANDED)
changeManifest:
  MODIFY  src/data/institutionalCatalog.js
  MODIFY  src/domain/arcaneInstitutionIdentity.js
  MODIFY  src/generators/institutionProbability.js
  CREATE  tests/lint/magicLicenceCensus.walker.test.js
  TEST    tests/domain/arcaneIdentity.test.js
  TEST    tests/lint/arcaneClassifierCensus.walker.test.js
  DOC     docs/implementation/packets/catalog-hygiene/CH-2a.md
requiredSymbols: institutionCatalogMagicLicence, getBaseChance, getMagicLevel
```
```
id: CH-2b    family: catalog-hygiene     status: DRAFT (mint AFTER CH-2a is LANDED)
changeManifest:
  MODIFY  src/generators/generationContext.js
  MODIFY  src/domain/magicFilter.js
  TEST    tests/generators/generationWorldLaw.test.js
  TEST    tests/lib/instantWorld/mundaneRealmAcceptance.test.js
  DOC     docs/implementation/packets/catalog-hygiene/CH-2b.md
requiredSymbols: nativeInstitutionRequiresMagic, filterCatalogForMagic, isArcaneInstitution
```
```
id: CH-3     family: catalog-hygiene     status: DRAFT (mint AFTER CH-2b is LANDED)
changeManifest:
  MODIFY  src/data/institutionalCatalog.js
  MODIFY  src/data/institutionDescVariants.js
  MODIFY  src/generators/lookups.js
  MODIFY  src/domain/display/institutionVocabulary.js   # the two other tanner spellings (see §3.4)
  TEST    tests/generators/metropolisCatalogReachable.test.js
  TEST    tests/generators/dossierContent.test.js
  TEST    tests/data/priorityCategoryPlausibility.test.js
  DOC     docs/implementation/packets/catalog-hygiene/CH-3.md
requiredSymbols: getInstitutionalCatalog, getFullCatalogWithTierMeta, INSTITUTION_DESC_VARIANTS
```

⚠ **A TEST path must exist at every status** — every `TEST` row above names a file present at
`f1e4d515` (verified). ⚠ **A new test file is a CREATE row, never TEST.**

### §4.4 · Census arithmetic

Base tuple at THIS charter's base `f1e4d515`,
`tests/lint/sovereigntyLightingContract.walker.test.js:6000`:
`files: 2514, parked: 366, credited: 2148, titles: 20846, suiteTitles: 5806`.
**At the current tip `00e7af612` it is `:6049` `files: 2515, parked: 366, credited: 2149,
titles: 20854, suiteTitles: 5807`** — the build lane walks it at its OWN base and never
carries either tuple across a rebase.

* **CH-1** creates one test file ⇒ `+1 files / +0 parked / +1 credited / +N titles /
  +M suiteTitles`, N = the walker's title count (8 arms ⇒ 8 unless nested), M = its describe
  count. **⚠⚠ THE CEILING:** memory records that the census sits AT its pinned ceiling and
  "just census it" is unavailable — the build lane must re-walk the tuple at its own base and
  confirm the raise is admissible before writing the file, exactly as UC-1 did.
* **CH-2a** creates one test file ⇒ the same shape.
* **CH-2b / CH-3** create none ⇒ tuple UNMOVED unless a titled arm is added to an existing
  file, which then moves `titles` only.
* ⚠ **A new test file reds TWO censuses** — the lighting tuple and the mutation-coverage
  manifest (`scripts/mutation-coverage-manifest.json`, which already names
  `institutionalCatalog` and `getBaseChance`). Both are re-derived in the member commit.
* ⚠ Loop-registered and `test.each()` titles are invisible to the census; check `credited`,
  never the arithmetic alone.

### §4.5 · The §489.3 grep-driven arm, per car

Every exported symbol, registry key and enum token each car adds or changes, `git grep -l`'d
across **all 37 test trees** and run mutexed before the terminal.

**CH-1** — tokens `FACET_INFERENCE · facetOf · inferFacet · declaredFacet · interiorKindOf ·
interiorFunctionOf · INTERIOR_KINDS · hasCharityFacet · institutionNature ·
institutionFunction · institutionSubstructure · Priest (resident) · Warden's Lodge ·
Charlatan fortune tellers · Dragon resident`:

```
tests/data/underwaysInstitutionParity.test.js   tests/domain/cohesionWeave.test.js
tests/domain/convergence.test.js                tests/domain/espionageGauntlet.test.js
tests/domain/memoryHorizon.test.js              tests/domain/navalLayer.test.js
tests/domain/undercitySewerDerivation.test.js   tests/domain/undercityStrataExistence.test.js
tests/domain/underwaysCouplings.test.js         tests/domain/worldPulseLitBurndown.test.js
tests/fixtures/interiorFixtures.js              tests/interior/interiorModel.test.js
tests/lint/sovereigntyLightingContract.walker.test.js
tests/domain/arcaneIdentity.test.js             tests/generators/roleCategory.test.js
tests/joins/subsumption.test.js
```

**CH-2a/2b** — tokens `ARCANE_GOODS · ARCANE_INST_KW · ARCANE_INST_TAGS · isArcaneInst ·
filterCatalogForMagic · filterServicesForMagic · filterGoodsForMagic · isArcaneInstitution ·
institutionCatalogArcaneTag · getBaseChance · nativeInstitutionRequiresMagic ·
allowsInstitution · magicLicense · NON_MAGIC_EXOTICS · hiMagicInsts`:

```
tests/domain/arcaneIdentity.test.js             tests/generators/generationAuthoredIntent.test.js
tests/generators/generationWorldLaw.test.js     tests/generators/neighbourRelDynamics.test.js
tests/lib/instantWorld/mundaneRealmAcceptance.test.js
tests/lint/arcaneClassifierCensus.walker.test.js
tests/build/bootSmoke.test.js                   tests/architecture/layerBoundaries.test.js
tests/build/vendorPdfLazy.test.js
```

**CH-3** — tokens `religiousCenter · Cathedral (10,000+ only) · Multiple monasteries ·
Auction house · Mint (official) · Harbour master · Furrier · Contract killer · Eberron ·
INSTITUTION_DESC_VARIANTS · Airship docking · Underground city · Black market bazaar ·
Smuggling network · Colosseum · Opera house · Multiple theaters · Gambling district ·
Planar traders · Dragon resident · MUST be downstream · getInstitutionalCatalog`:

```
tests/data/priorityCategoryPlausibility.test.js  tests/domain/arcaneIdentity.test.js
tests/domain/blockadeTransport.test.js           tests/domain/customContentPresentationClaims.test.js
tests/domain/foodStockpile.test.js               tests/domain/undercityStrataExistence.test.js
tests/generators/dossierContent.test.js          tests/generators/foodImportChannels.test.js
tests/generators/isolatedTrade.test.js           tests/generators/isolationSupport.test.js
tests/generators/metropolisCatalogReachable.test.js
tests/generators/notableAbsences.test.js         tests/generators/roleCategory.test.js
tests/generators/spatialGenerator.test.js        tests/generators/structuralValidatorDeterminism.test.js
tests/joins/cascade.test.js                      tests/joins/chains.test.js
tests/joins/goods.test.js                        tests/joins/ports.test.js
tests/joins/subsumption.test.js                  tests/lib/instantWorld/mundaneRealmAcceptance.test.js
tests/lint/serviceCategoryRegistration.walker.test.js
tests/data/underwaysInstitutionParity.test.js
```

### §4.6 · Sweep trees, bundles, mutex

* The standing widened sweep (ten trees + `tests/ui`) **plus** `tests/edgeFunctions` for
  every car (all four modify an edge-bundle input) **plus** the grep arm above.
* `npm run build:edge-shared` in every member commit; all five `.meta.json` files committed
  as a set; `institutionalCatalog.js` and `cohesionWeave.js` are each in three rosters.
* Every battery: `export GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock` **inline
  in the command** (§440.2/§457 — the export does not survive the harness's fresh shell).
  **Never wrap `npm run check*` in `gate-mutex.sh --run`** — self-deadlock; run `check:tail`
  bare, fresh shell, `; echo TRUE_EXIT=$?`.
* **CH mints no flag.** Confirmed: no car adds a `simulationRules` key, a virtual rule key or
  a covering-array domain member, so the five-plus-one-surface flag bill is **not owed**.
  (CH-1 *reads* a flag-gated path but changes no flag.)

---

## §5 · ANTI-SCOPE

CH does **not**:

1. **Add interior KINDs.** No `criminal`, `hospitality`, `entertainment`, `utility`, `lodge`
   or `site` kind. R-INST-6 §Σ.3 costs a `criminal` kind precisely (an anchored
   `/\bcriminal\b/i` row placed **before** `trade`, plus a `criminal` template) and calls it
   "a recommendation for DW-0 with its bill named, not as a fix". R-INST-4 §Σ item 20 asks
   for `hospitality`/`entertainment`/`utility` plus ~40 room/furnishing kinds. **All → DW-1.**
2. **Bulk re-type the catalog.** The 202 rows that infer nothing and draw `generic`, the six
   Criminal rows that draw the legitimate `trade` interior on `guild|market|bazaar`, the five
   that draw `vice` on `smuggl`, every INN drawing `generic`, `Gladiatorial school` drawing
   `learning`, `Hireling hall` drawing `civic` — all **measured live this lane** and all left
   alone. They are not anchoring failures; they are vocabulary gaps. **→ DW-1.**
3. **Add catalog rows.** R-INST-3's three learning rows (song/grammar school, parish/chapter
   library, university) are new content. **→ the CONTENT train (CT-4's neighbour), not CH.**
4. **Mint a flag.** Confirmed above.
5. **Take the two-tranche joint recommendation `compound.entrances: 1`** (R-INST-5 §Σ.1 law 6
   / R-INST-6 §Σ.1) — the precinct's single controlled entrance, with an internal court,
   causeway or transport edge as the frontage surface. **→ Track B, DW-2** (the frontage
   reader), per §491.2's own mapping. Named here so nobody re-finds it as a CH omission.
6. **Take R-INST-6 finding E2** — a building needs a SECOND, subordinate entrance with a
   different reach; `interiorModel.js` derives exactly one `entranceSide` and rotates to it.
   Four families ask for it, severity "highest". **→ Track B, DW-2** (with the DW-1 contract
   change that makes a second entrance expressible). Not CH: it is a new capability, not a
   repair.
7. **Change `exclusionConditions` anywhere** (§3.7) — that is a behaviour change; CH-3 moves
   the prose only.
8. **Touch the undercity derivation.** CH-3 §3.6 declares a facet; deriving anything new from
   the seed is UC/DW work.
9. **Re-anchor `magicLedger.js`'s `ARCANE_INSTITUTION_PATTERN`** — the arcane census walker
   records it as deliberately unfolded ("converting it moves magicProfile/capacityModel
   output"). Left as recorded.

---

## §6 · JUDGMENTS, DEFERRALS, OPEN QUESTIONS

### Judgments (each vetoable by a word)

**J-CH-1 — one declared override, not four.** *Why:* CH-1's charter is honesty, not typing;
three of the four rows have no defensible existing kind (R-INST-5's verdicts are NO_BUILDING,
OCCUPATION and a lodge parti that does not exist yet). *Rejected:* assigning each its nearest
kind. *Reversal:* three catalog lines. *Blast radius:* 41 of 420 settlements render `generic`
rather than `vice`/`security`; the walker already validates any later addition.

**J-CH-2-1 — P2's licence form leaves CH-2 (recommended to the chair).** *Why:* measured, it
is 88 of 361 changed rosters and it removes the enchanter, the academy and the mages' district
from low-magic worlds — a content decision wearing a hygiene label. *Rejected:* shipping it
inside CH-2. *Reversal:* one line. *Blast radius:* CH-2's shift drops to 273/2100 and G7 is
still discharged by deleting the three dead keywords and the goods member (0 rows affected).

**J-CH-2-2 — CH-2 splits into CH-2a and CH-2b.** *Why:* the honest file list is four
(`institutionalCatalog`, `arcaneInstitutionIdentity`, `institutionProbability`,
`generationContext`, `magicFilter` = five), over the chair's ≤3 ceiling. *Rejected:* one
oversized car. *Reversal:* merge the packets before minting. *Blast radius:* one more landing
slot in the sequence.

**J-CH-2-3 — the licence reader extends `arcaneInstitutionIdentity.js`, it does not get a new
leaf.** *Why:* that module already walks the catalog and already sits in eager engine-core,
and `institutionProbability.js` already imports it — so the reader costs **zero new chunk
edges**, where a new leaf risks re-creating the eager→lazy cycle that made `dist` un-bootable
(lane BT). *Rejected:* `src/domain/magicLicense.js`. *Reversal:* extract later once
`boot-smoke` stage 1 has proved the graph.

**J-CH-3-1 — the `minTier` class is closed at the READER, not in the data.** *Why:* both data
rewrites are measured content changes (97 and 108 of 420); the reader fix costs zero same-seed
shift and closes the defect a user can actually hit. **This contradicts §491's "the tier block
is the structural truth" framing, on the measurement, and is the charter's one substantive
divergence from the ruling.** *Rejected:* delete-minTier and move-to-block. *Reversal:* revert
the `lookups.js` filter. *Blast radius:*
`tests/generators/metropolisCatalogReachable.test.js`'s RATCHET arm reds and must be amended
to "reachable at every tier the row can fire at".

**J-CH-3-2 — `religiousCenter` rides as its own final commit with an explicit chair ruling.**
*Why:* 81 of 420 settlements and a whole-roster re-roll, larger than the rest of the train
combined; THE PROMISE deserves it named. *Rejected:* folding it in with the prose fixes.
*Reversal:* two lines.

**J-CH-3-3 — R-INST-6-1 belongs in CH-3.** *Why:* a data declaration matching the row's own
prose, using a landed affordance on three sibling rows, no new reader, zero roster shift.
*Rejected:* routing it to the undercity train. *Reversal:* move the two lines to a UC packet.

**J-CH-3-4 — `Kidnapping ring`: the description yields to the condition.** *Why:* the reverse
is a roster shift. *Rejected:* widening `exclusionConditions`. *Reversal:* restore the
sentence.

**J-CH-3-5 — CH-3 splits too, at the same ≤3 ceiling.** Its honest file list is FOUR:
`institutionalCatalog.js`, `institutionDescVariants.js`, `generators/lookups.js`,
`domain/display/institutionVocabulary.js`. *Decided:* **CH-3a** = the DATA items (the two
`religiousCenter` deletions, the five `priorityCategory` values, R-INST-6-1's two `facets`
keys) on `institutionalCatalog.js` alone; **CH-3b** = the PROSE sweep (HK-6's three strings,
the tanner's five spellings, the `Kidnapping ring` description) across
`institutionalCatalog.js` + `institutionDescVariants.js` + `institutionVocabulary.js`;
**CH-3c** = the `minTier` reader fix on `generators/lookups.js` alone with its
`metropolisCatalogReachable` amendment. *Why:* three files each, and each car's declared shift
is then a single kind (roster re-roll / prose bytes / zero) instead of a mixture.
*Rejected:* one four-file car. *Reversal:* merge the packets before minting. *Cost:* two more
landing slots, and CH-3a and CH-3b both name `institutionalCatalog.js`, so they serial-mint.

**J-CH-4 — the train order CH-1 → CH-2a → CH-2b → CH-3, serial-minted.** *Why:* CH-1's digest
is provably unmoved; the shared `institutionalCatalog.js` path forces serial minting anyway.
*Rejected:* CH-3 first. *Reversal:* re-order before the first mint.

### Deferrals (deliberately deferred — documented, not bugs to re-find)

* **`\bcourt` will match a future "courtesan" row.** Measured: no such row exists today.
  Left unnarrowed rather than over-fitting the regex to a hypothetical; the §1(c) anchor-
  discipline arm and the per-kind collision arm are the guard. **Recorded, not fixed.**
* **The 26 REDUNDANT `minTier` declarations.** Deleting them is a record byte change for zero
  behaviour. Left to the chair (§3.1): delete-and-declare, or keep and let the walker report.
* **`magicLedger.js`'s `ARCANE_INSTITUTION_PATTERN`** — the arcane census's recorded
  non-conversion. Untouched.
* **The 202 `generic`-inferring rows and the six criminal rows drawing the trade interior.**
  Measured, listed, and left to DW-1 (§5).
* **`inst.id` has no writer and `safetyProfile` is unobserved** (memory, UC-0 row) — not
  touched by CH; noted so the build lane does not trip over them.

### Open questions for the chair (each with a recommendation)

**NONE of them blocks CH-1.** CH-1's anchoring, its one override, its walker and its acceptance
are all inside the delegated scope and all measured; its focused battery is already green at
the patch. **CH-1 can be dispatched to build the moment the chair ratifies the charter.**
Questions 1-3 block CH-3; questions 4-7 re-shape CH-2.


1. **J-CH-3-1 contradicts §491's framing.** Recommend the reader fix. If the chair prefers the
   data rewrite, it must be ruled as a content change with the 97-settlement figure named.
2. **J-CH-2-1 — does P2's hard-zero become the licence?** Recommend no (88 rosters).
3. **J-CH-3-2 — does `religiousCenter` land at all in CH?** Recommend yes, own commit,
   declared. It is the item with the largest same-seed shift in the program outside tuning.
4. **§491 says "three shelf-as-gate paths"; the measurement says five (H21).** CH-2 must be
   re-chartered at five or explicitly scoped to three. Recommend five — the fifth is the one
   that decides a dead-magic world.
5. **§491 says "32 Magic/Exotic rows"; the shelves hold 28 (H25).** Recommend the field on 28.
6. **§491 writes `NONE|LOW|MEDIUM|HIGH`; `getMagicLevel` emits lowercase (H24).** Recommend
   lowercase.
7. **G5, G6 partly/wholly REFUTED (H18, H19).** Recommend striking them from CH-2's
   acceptance so the car does not pin a divergence that does not exist.
8. **CH-3 is four production files, over the ≤3 ceiling (J-CH-3-5).** Recommend the three-way
   split; the alternative is the chair waiving the ceiling for one car.
9. **The tanner overstatement has FIVE spellings, not one (§3.4).** Recommend rewriting all
   five in one act; R-INST-2 faulted only the loudest.

---

## §Σ · TEN LINES FOR THE CHAIR

1. Base `f1e4d5150`; 40 measured homes — **24 CONFIRMED, 9 CORRECTED, 3 REFUTED, 4 NEW**;
   every same-seed figure executed over one 420-settlement corpus whose base digest is
   `1a4a8d3f…` and whose no-op control reproduces it.
2. **CH-1's generation digest is BYTE-IDENTICAL to base** — the anchoring cannot move a
   generation golden. Its shift is 111/420 interior kinds and a dark `hasVice` flip in 70
   villages.
3. **The mis-inference set is FOUR, not three:** the tranches missed `Priest (resident)`, a
   village parish priest currently drawing the TAVERN interior in 70 of 420 settlements.
4. **R-INST-5's prescribed cure is wrong twice:** anchoring cannot fix `fortune` (a leading
   boundary matches), and naive anchoring breaks `Blacksmith`/`Sawmill`. The per-keyword table
   in §1(a) moves exactly **4 of 933 cells**, all four the defects, zero collateral.
5. **The `minTier` class is TEN rows, not five** — five no tranche saw. The reader dependency
   is measured: the UI shows them, generation refuses them. I recommend closing it at the
   READER (0 shift) over the data rewrites (97 and 108 of 420) — **§491's framing contradicted
   on the measurement; this is the charter's one substantive divergence, J-CH-3-1.**
6. **§491's "three shelf-as-gate paths" is five.** The fifth, `generationContext.js`'s world
   law, strikes 26 rows by unanchored substring before any probability and is what actually
   decides a dead-magic world — it also discharges the estate's own
   `DESIGN_REALM_MAGIC_TOGGLE.md:514-519` "Chair to schedule" item.
7. **G6 is REFUTED and G5 half-refuted by execution:** `Dragon resident` and `Great library`
   appear **0 times** in 840 dead-magic settlements. The one real generation-versus-UI
   divergence is **G4's** — the Adventurers' charter hall generates 16 times at
   `magicExists:false` and is invisible in the grid.
8. **CH-2 must split** (five honest files against a ≤3 ceiling) and its P2 arm should leave
   the car (88 of its 361 changed rosters are P2 alone — a content decision, not hygiene).
   Field on **28** rows, values **lowercase**.
9. **CH-3's `religiousCenter` item is the train's big one: 81/420 rosters, ~130 names**, and
   the mechanism is measured — `assembleInstitutions.js:323` returns before the rng draw, so
   un-suppressing a row reshuffles the whole downstream sequence. Its own commit, chair-ruled.
10. **Two ceiling problems and one correction to my own draft:** CH-2 is five production
    files and CH-3 is four against a ≤3 rule (splits proposed, J-CH-2-2 / J-CH-3-5); the
    tanner overstatement has **five** spellings, not the one R-INST-2 faulted; and this
    charter's first draft mis-named the golden master — the real one,
    `tests/property/generatorGoldenMaster.test.js`, was then run at the CH-1 patch and is
    **green (1 file / 3 tests / TRUE_EXIT=0)**.
11. **No CH car trips the size-baseline ceiling** (no file has a row; `src/data/**` has no
    `max-lines` rule) and **no CH car mints a flag**; but **every car owes
    `build:edge-shared`** — `institutionalCatalog.js` and `cohesionWeave.js` are each inputs
    to three edge bundles — and the four cars **must be serial-minted**, because they share
    `src/data/institutionalCatalog.js` and the validator reserves change paths at every
    non-terminal status.
