# ABOUT-CURRENT — the About pages brought current, and the table's section measured (2026-11-10)

**Seat:** ABOUT-CURRENT, a copy-and-UI seat, child of the cloud chair (`session_01FbPLbejcfwX5nii12VM673`); this seat's session `session_01FbPLbfiFbVSqzXxrVUjipx`. **Base:** `a116c2c52`, verified equal to `origin/lane/integration-2026-11-07` at the cut. **Lane:** `lane/about-current-2026-11-10`. It lands after the release and after COMPENDIUM-HUB.

**The owner's words (2026-11-10 ~02:5x UTC, verbatim):** "What are your thoughts on the about page? Can you update it so that it's current? Also that idea we talked about elevating exploration and bringing more of a sandbox feel to urban areas making it easier to homebrew for DMs. Treat Settlementforge as both canvas and world to explore for everyone at the table."

## 1. The commits, by cause

| row | commit | what |
|---|---|---|
| A2a | `b2e70f57e`, `7ba91d3c7` (ruling S4) | the Guide's Navigation renders from `lib/routes.js` NAV; Realm's line in the chair's words |
| A2b | `d8c272030` | "Settlements tab" ×10 → the Library seat's label from NAV |
| A2c | `ad1d45ba9` | the dossier tab list follows `TAB_GROUPS` |
| A2d | `69f7a0983` | one sharing entry, in the share panel's own sentences |
| A3 | `1fcfc3963`, `4b076eecc` (ruling S7 F2), `7c08a6b71` (ruling STOP-F5) | two sentences corrected to their enforcing code; the cancel and gallery answers in the chair's words |
| A1 | `a6e49673a` | the chair's section, final ruled text (§2, §3b) |
| A4 | `a19f520f1` (ruling S8) | "thirty chairs" renders from FOUNDER_SEATS (§5) |
| hygiene | `a775abe7f` | aboutCurrent's negatives anchored (the anchor walker) |
| record | this file and its roster bump | |
| register | the commit after the record | the lighting census re-measured through its door (+1 test file) |

## 2. Every changed sentence, old → new (for the owner's veto)

**A2a, the Guide's Navigation list** (`HowToUse.jsx :: Reference`):
- The rows were Create, Settlements, World Map, Compendium, DM Screen, About.
- They are now the header's seats in the header's order: Create, Library, Realm, Compendium, Gallery, About. DM Screen follows them; it is not a seat.
- The descriptions are unchanged words, keyed by view id:
  - Library carries the old "Settlements" line.
  - Realm, ruled S4 in the chair's words: "Embedded fantasy map. With Cartographer, drag saved settlements onto it to place them and toggle the relationship and supply-chain overlays." → "The world map, with the region's Pulse, Chronicle and Pantheon beside it. With Cartographer, drag saved settlements onto the map to place them and toggle the relationship and supply-chain overlays."
  - Gallery is new to the list and takes the Gallery page's own subtitle: "Settlements other DMs have shared. Browse for inspiration; click a tile to read the full dossier."

**A2b.** "the Settlements tab" → "the Library tab", rendered from the NAV label. It changes in ten places:
- Quick Start step 6
- the neighbour-linking lead
- neighbour steps 1, 3 and 5
- the campaign-library lead ("The Library tab is your campaign library.")
- campaign step 2
- Reference rows Campaigns, Link Neighbour and Click for Detail

**A2c.** "Settlement Detail Tabs" was fourteen flat rows. It is now four sub-lists headed "Settlement Detail Tabs: Summary / Systems / World / Notes", in `TAB_GROUPS` order, with the dossier's own labels.
- The fourteen existing descriptions are kept word for word.
- Eleven tabs show their label alone: Crisis, Guidance, Magic, Traditions, Rumors & News, War, Faith, DM Notes, AI Notes, Chronicle, Versions. The app holds no description for them (`copy.tabs` is empty by the owner's order of 2026-07-22). This is STOP S5.

**A2d.** One new Settlement Workflow row, labelled "Share to Gallery" (the header button's own label):
> "Public dossiers appear in the gallery. Your name and email stay private. Start the World Clock before sharing the dossier publicly. An unlisted link is for your players. It stays the same for as long as this settlement exists, and it always shows your latest changes. A town can be listed in the gallery and have an unlisted link at the same time."

Every sentence is the share panel's (`ShareToGallery.jsx`), and a pin holds each one verbatim.

**A3** (`src/copy/en.js`):
- `valueLadder.rungs.saves`: "…any size, from hamlet to metropolis, …" → "…any size, from thorpe to metropolis, …". The fact: `TIER_GATE.free.minTier 'thorp'` and `SIZE_LABEL.thorp 'Thorpe'`.
- `accountFaq.aiOrSim`: "Optional Narrative Refinement spends a credit to turn…" → "…spends credits to turn…". The fact: a narrative costs 5 credits, or 2 on the fast model (`pricing.js` NEW_AI_COSTS / FAST_AI_COSTS).
- `accountFaq.galleryPrivacy` (ruling STOP-F5, the chair's words): "The toggle lives in the dossier header." → "Use Share to Gallery in a saved settlement’s header, or Export to gallery in a live dossier’s action band."
- `accountFaq.cancelAnytime` (ruling S7 F2, the chair's words): "Open the Manage Subscription link in your Stripe portal." → "Open Account and use Manage subscription in the Subscription panel; it opens your Stripe portal."

**A4** (ruling S8): `accountFaq.founderLifetime` "The Founders' Hall holds thirty chairs." → "…holds {seats} chairs.", with `{seats}` = FOUNDER_SEATS passed by `AccountFAQ.jsx`. It now prints "30 chairs": the value is unchanged, and it is a numeral as on the Terms page.

**A1:** the chair's FINAL ruled text, landed exactly, between the premise and the covenant. It is version 2, after the first census struck version 1 ("…A world to walk into.", which never landed), plus the two rulings of the second census.

- Kicker: For everyone at the table
- Title: A canvas to build on. A world to explore.

> Homebrew rarely dies for want of ideas. It dies of bookkeeping. A world of thirty places needs thirty economies, thirty casts of people with reasons and thirty histories, all of it remembered a year later when the party doubles back. Here that work is done and kept true. You set the frame: the land, the trade, the trouble, what the place cares about. A whole town stands inside it in seconds, and from then on it is yours. Name it. Reroll the draft if it does not fit. Keep your own notes beside it. With Cartographer, rename anyone in it, add your own institutions and gods, and link your towns as neighbours.
>
> It is also somewhere to go. A city here is quarter after quarter of working houses, the mill, the forge, the church, the watch, and each has a named person in it who wants something. Ask where the smith’s iron comes from and there is an answer. Ask who holds power and who stands against them and there is an answer to that too. Whichever way your players push, there is already something there, so you can say yes without checking your notes for a contradiction.
>
> Hand them the town itself. A private link opens the players’ own page: the town as a visitor would know it, its trade, its services, who governs, the faces worth knowing. Your secrets are left out, and so is anything you choose to hide. They read it between sessions and arrive with plans. The link stays the same for the life of the town.
>
> One town, two ways in. You build on it. They explore it. It stays true for both.

The second census's two rulings:
- "the shrine" → "the church" (STOP-V2-1).
- The neighbours clause leaves the "needs" list ("…thirty histories, and neighbours that make sense of each other, all of it…" → "…thirty casts of people with reasons and thirty histories, all of it…") and joins the Cartographer sentence ("With Cartographer, rename anyone in it and add your own institutions and gods." → "With Cartographer, rename anyone in it, add your own institutions and gods, and link your towns as neighbours."). Neighbour linking is Cartographer (`TIER_GATE.premium.neighbour`). It carries a new published anchor `#for-everyone-at-the-table` (`aboutMapping.js`, unit `table`, `source: 'added'`). The aboutSplit pins are re-keyed by identity, with `ADDED_UNITS = ['table']` and the owner's words as the cause; the legacy census is unchanged.

## 3. A1 — the census of VERSION 1, sentence by sentence (at `a116c2c52`; the chair struck version 1 on it)

| # | sentence (claim) | holds? | where | tier |
|---|---|---|---|---|
| 1–3 | "Homebrew rarely dies…", "It dies of bookkeeping.", "A world of thirty places needs…" | no product claim | — | — |
| 4 | "Here that work is done and kept true." | CONFIRMED | the seed covenant (AboutManifesto, drift-gated replay); saves | free (3 saves), Cartographer unlimited (`store/authSlice.js` TIER_GATE) |
| 5 | "You set the frame: the land, the trade, the trouble, what the place cares about." | CONFIRMED for members | `ConfigurationPanel.jsx` (route, terrain, stress); `generate/CharacterPresetCard.jsx` sliders. Anon gets a random town (`settlementGenerateAction.js:287-289`, `preGenOptions:false`) | free |
| 6 | "A whole town stands inside it in seconds" | CONFIRMED (the product's own copy) | `en.js generate.subline` "Roughly 10 to 20 seconds" | any |
| 7 | "and from then on it is yours." | CONFIRMED | saves; exports | free |
| 8 | "Change a name." | CONFIRMED for the town's own name | `DossierHeaderRow` → `renameSettlementImpl` (saved, no tier check). NPC and power renames are Cartographer ("Edit (Cartographer)", `SettlementDetailActions.jsx:53`). Institutions have no rename UI | free |
| 9 | "Reroll one part until it fits while the rest holds." | PARTLY | `regenSectionAction` handles `'npcs'` / `'history'` only (`settlementRegenAction.js:108`). Create-draft only; refused on canon | **Cartographer** — STOP S1 |
| 10 | "Add your own institutions and gods." | CONFIRMED | custom content, `deities` category (`customContentSchema.js:184`); `canUseCustomContent` | **Cartographer** — STOP S2 |
| 11 | "Keep your own notes beside it." | CONFIRMED | `NotesTab.jsx` "DM Notes", saved only | free |
| 12 | "It is also somewhere to go." | no product claim | — | — |
| 13 | "A city here is street after street of doors, and behind each is a house with people who want something." | **NOT HELD** | The city is quarters (`districtProfile.js`). Dwellings are anonymous filler and not mounted (`townCartography/cartographyBuildings.js:9`). People are one representative per institution (`generators/people/representatives.js:5-8`), and each has goals (`people/goals.js`) | STOP S3 |
| 14 | "Ask where the smith's iron comes from and there is an answer." | CONFIRMED | EconomicsTab supply-chain "From" / "Import" lines (`EconomicsTab.jsx:193-199`) | free |
| 15 | "Follow it and you find a guild, a debt, a quarrel with the harbour." | PLAUSIBLE | Debts are NPC ties (`goalFamilies.js:173`). Quarrels are power relationships (`factionDynamics.js:336`). No link runs from a supply chain to either | — |
| 16 | "Your players can walk in any direction…" | no specific claim | — | — |
| 17 | "Hand them the town itself." | no product claim | — | — |
| 18 | "A private link opens the players' own page" | CONFIRMED | `share_settlement_unlisted` (any active account, saved) → `PartyLinkView.jsx` → `PublicDossierView` (player view) | free |
| 18b | "the streets, the houses, the faces and rumours a visitor would know" | faces CONFIRMED; streets, houses and rumours **NOT HELD** | The map is stripped from the public dossier (STRIP-1). The Rumors tab reads the *viewer's own* campaigns (`RumorsTab.jsx:157`), so a player sees its teaser | STOP S3 |
| 19 | "Your secrets are left out, and so is anything you choose to hide." | CONFIRMED | Player view unless the DM reveals DM content (`PublicDossierView.jsx:113-119`); 208(d) server projection; the per-person veil applied in the reader's browser (`projectShareVeil`) | free |
| 20 | "They read it between sessions and arrive with plans." | no product claim | — | — |
| 21 | "The link stays the same for the life of the town." | CONFIRMED in code | 208(c), an idempotent share; the panel says the same. Rotate exists, by the DM's hand. 208 is written, not deployed | free |
| 22 | "One town, two ways in. … It stays true for both." | no new claim | — | — |

## 3b. A1 version 2 — the second census (the chair's points a–f)

- (a) PASSES: "the mill, the forge, the shrine, the watch". The catalog holds Mill / Mills (2-5); Blacksmiths, whose own desc reads "general forges in every quarter"; Wayside shrine; and Town / Village / Professional city watch (`src/data/institutionalCatalog.js`). No swap is needed.
- (b) FAILS on "the shrine": STOP-V2-1. "One face per face-bearing house" (`src/generators/people/representatives.js` header). The Wayside shrine, the catalog's only shrine, has `face: null`, so it has no person. Fifteen kinds have no face, among them the markets, the burial ground, the water source, the palisade and the household levy. The mill (the miller), the smiths (the master smith) and the watch (captain / commander) do have a person, and every card carries goals (`src/generators/people/goals.js`).
  - RULED: the swap stands, "the shrine" → "the church" (Parish church, face "the priest"). Mill, smiths, church and watch now all carry a person.
- (c) PASSES, all four. The player view hides only the DM and AI notes (OutputContainer `baseTabs`). `economicState`, `availableServices`, `powerStructure` and `npcs` are on the public allowlist (`PUBLIC_TOPLEVEL_KEYS`, `src/domain/display/publicSafe.js`).
- (d) PASSES: "Regenerate draft" (`src/components/generate/WizardOutputToolbar.jsx`) is open to every reader. Anonymous visitors get 2 rerolls a day (`src/lib/anonGenCounter.js`).
- (e) DEPENDENCY: "It stays true for both" rests on the owner-equals-shared law, which the VEIL-FIX lane is finishing.
- (f) DEPENDENCY: the link's permanence rests on migration 208, which is written and not yet applied. This page ships after the release, so it holds when it lands.
- Tier note: P1's "neighbours that make sense of each other" sat under "Here that work is done", but neighbour linking is Cartographer only (`TIER_GATE.premium.neighbour`). RULED: it moves into the Cartographer sentence.
- The rest of version 2, by row:
  - "Name it." The town's own name: free, saved.
  - "Reroll the draft if it does not fit." See (d).
  - "Keep your own notes beside it." Free, saved.
  - "With Cartographer, rename anyone in it and add your own institutions and gods." Edit Names (NPCs, powers) and custom content, both Cartographer.
  - "quarter after quarter": `spatialLayout.quarters` (`src/domain/districtProfile.js`).
  - "Ask who holds power and who stands against them": `powerStructure` and the power relationships (`src/generators/factionDynamics.js`), free.

## 4. A3 — the rungs and the FAQ, measured (old → fact → file)

| sentence | verdict | fact · file |
|---|---|---|
| tries "Generate a coherent town, no signup." | MATCH | anon generates a town (`TIER_GATE.anon`) |
| saves "…from hamlet to metropolis…" | **corrected** | free floor is thorpe · `authSlice.js:84`, `tierFacts.js` |
| saves "and saves your work" | MATCH | free cap 3 (`pricing.js` saveLimit). The cap is the owner's open question; untouched |
| saves "Keep any dossier's PDF for $2.99." | MATCH | `pricing.js:318-321`. Purchases are closed until launch (`launchGate.js`) |
| simulates "…Off by default, opt-in, reversible." | MATCH | campaign membership is the opt-in (`campaignSlice.js:586` premium); Undo last pulse (`operationRegistry.js:161`) |
| chip "$5.99 a month" | MATCH | `pricing.js:267` priceCents 599 |
| F1 free first Narrative | MATCH | mig 118 `claim_free_narrative`. Fast-model accounts are not eligible (generate-narrative:1205) — PLAUSIBLE nuance |
| F1 "Buy more from the Subscription panel." | MATCH | `AccountPage.jsx:392` |
| F2 "Open the Manage Subscription link in your Stripe portal." | **corrected, ruling S7** | It is a "Manage subscription" button in the Account Subscription panel that opens the portal, premium only (`AccountSubscriptionSection.jsx`) |
| F2 "end of your current billing period" | UNVERIFIABLE in repo | Stripe portal configuration |
| F4 thirty chairs, invitation, never sold | MATCH | `founderSeats.js:31`, `pricing.js:284-301` |
| F5 "The toggle lives in the dossier header." | **corrected, ruling STOP-F5** | "Share to Gallery" is in the saved header (`SettlementDetailActions.jsx`); the live action band carries the panel's "Export to gallery" (`ShareToGallery.jsx`) |
| F6 "spends a credit" | **corrected** | 5 credits (fast 2) · `pricing.js:64-71` |
| Surveyor (after 209) | no About sentence names who may use it | 209: staff, `current_user_has_premium_access` (premium or Founder), or an active grant. 209 is UNAPPLIED (applied head 203) |

## 5. A4 — counts that cannot drift

The four counts named in the order already render from the Compendium's generated data. None is a literal:
- "{N} registered operations" and "{N} of them canon-class" — `CD.operations.count` and `CD.operations.byKlass.canon` (AboutManifesto covenant).
- "16 live causal variables" — `CD.causal.variableCount`.
- "9 pressures" — `CD.pressures.count`.

The literals that remain, and why none was changed:
- "five priority sliders" (AboutManifesto) and "five sliders" (HowToUse): the Compendium writes the same literal in its own blurb, and there is no slider registry to render from.
- "$5.99 a month" (LivingWorldTab chip): a price, not a count.
- "thirty chairs" (`accountFaq`): ruled S8 and landed. It now renders from FOUNDER_SEATS through `t()`.
- "six tiers" (the progression image's alt text): it describes art with the tiers baked in.

## 6. STOPs sent to the chair (each with its default)

S1–S3 are A1's: reroll (partly held, Cartographer); custom institutions and gods (Cartographer, and the trust page has no tier-mark idiom); streets, houses and rumours (not held). Default: A1 held, no rewording.

S4 is the Realm description: RULED, the chair's words, landed.

S5 is the eleven undescribed tabs: RULED, the default stands (label-only rows).

S6 is the Compendium hub: RULED, the default stands. The eight `?tab=` links stay, and the hub redirects them. `lane/compendium-hub-2026-11-10` appeared on origin at `9538f7cb4` just before the hand-back. Its `src/lib/compendiumSections.js` holds exactly the twelve slugs the order named, and maps every one of the Guide's eight `?tab=` values (tiers, economy, power, arcane, living, stress, neighbour, institutions) to a section page through `sectionSlugForTab`.

S7 is RULED:
- F2 landed in the chair's words.
- F5 was held on STOP-F5, then ruled and landed in the chair's words with both real button names.
- The pricing copy's "from hamlet" is out of scope (What stays).

S8 is RULED: AccountFAQ.jsx was granted for this alone, and the change landed.

STOP-V2-1 is "the shrine" in A1 version 2: RULED, the swap to "the church" stands. The neighbours tier note was ruled with it.

STOP-F5 is the misnamed control in the ruled F5 sentence: RULED, landed with both real button names.

## 7. What I saw

The screenshots below were taken of version 1's text, in the same band; the band, anchor and layout are unchanged by the final text. Version 2 was re-read at both widths before the hand-back.

The app ran at `npx vite --mode e2e --port 5199`. I took screenshots at 1440×900 and as an iPhone 13, of `/about/what-this-is#for-everyone-at-the-table` and `/about/guide#reference`:
- The new section sits between the premise and the covenant in the page's own kicker/title/paragraph pattern, and its anchor lands clear of the sticky header.
- The Guide's Reference shows the four tab groups, the Navigation seats Create · Library · Realm · Compendium · Gallery · About, and the Share to Gallery row.
- `scrollWidth == clientWidth` on all four views (1440 and 390), so there is no horizontal scroll. Nothing is clipped.
- The phone bar omits Realm by `PHONE_NAV_EXCLUDED`. The Guide still lists it, because the list is the header's seats.

## 8. Gates

- **The pins.** These are green:
  - aboutSplit, re-keyed by identity
  - handbookVoice
  - the new `tests/components/aboutCurrent.test.jsx`, with its negatives anchored

  A negative control (the Outlook label corrupted to "Viability") went red as it should.
- **The style walker** is green with no rise. AboutManifesto and HowToUse are outside its roots, and the en.js edits added no struck phrase.
- **`npm run typecheck:ratchet`**: 167 errors, ceiling 167.
- **Nothing generated moved.** The strings changed here feed no golden master, fence, prose manifest, witness, herald or PDF.
- **The sweep** (`npx vitest run tests/lint tests/scripts tests/components tests/build --maxWorkers=2`, through gate-tail) at `a6e49673a` plus the record: 17 reds in 11 files. The same 11 files were re-run in a clean worktree at the base `a116c2c52`.
  - 15 of the reds are red at the base too, identically (base: 9 files, 15 tests), so they are the base's own. They sit in:
    - dossierPhoneFloorAllViews (2)
    - publicProseEquality (soak1k-10, soak1k-11)
    - readerValidationOnPage (soak1k-24)
    - domainAnyCastBaseline (the overrun attribution)
    - ledgerCitationIntegrity (needs the branch ref `review-fixes-2026-07-08`)
    - newsHeadlineContract (A1, A2, A3, A5)
    - observedShapeReaders (3)
    - proseFamilyContract (THE LIVE ESTATE INSTANCE)
    - provenanceMap
  - 2 were this lane's own, and both are cured:
    1. `negativeAssertionAnchor`: four bare negatives in aboutCurrent.test.jsx. They are anchored in `a775abe7f`.
    2. `sovereigntyLightingContract` "THE CENSUS IS AN ASSERTION": the estate's file count moved 3173 → 3174 because of this lane's one new test file. It was re-measured through the register's own door (`LIGHTING_CENSUS_REFREEZE`) on a clean tree, in its own commit after this record.

## 9. CONFIRMED against PLAUSIBLE

CONFIRMED, by executed tests or by code read at file:line:
- A2a–d, and the pins' red-on-drift.
- A3's two corrections.
- Census rows 4–8, 10, 11, 14, 18, 19 and 21.
- The NOT HELD findings of rows 13 and 18b, read at the cited lines (`regenSectionAction` and `TIER_GATE` re-read by this seat).

PLAUSIBLE:
- Row 15's thread from a supply chain to a debt or quarrel.
- F5's "header".
- F1's fast-model nuance, read by a search agent and not executed.

## 10. What stays

- **Pricing-copy row** (the owner's surface, out of this lane): "from hamlet to metropolis" at `en.js` pricing tiers (three strings) and `organic/samples/fixtures.js`. The free floor is thorpe.
- **A2:** the Compendium links stay `?tab=` (S6 ruled). The slugs were confirmed against the hub at `9538f7cb4`. Rewriting the links to `/compendium/<slug>` is the hub's to rule after both lanes land.
- **Outside the rows, noticed:**
  - The Guide's Workflow and World Map steps (Link Neighbour, Set as Neighbour, the arrow button, Drag to Place) were not re-measured against the product.
  - The en.js comment at `ai.inlineHint` says narrative "3 (fast 2)"; the code says 5 (fast 2).
