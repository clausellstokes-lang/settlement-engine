# (A) THE CARDS AS THEY ARE

Tree `lane/stack-122-wip-2026-11-28` at 777733a2a. Corpora C and V (900 births each, `plan-C.json`, `plan-V.json`), born
as the page battery births them and rendered through the tree's own `OutputContainer`: the owner's dossier and the shared
page (`toPublicSafe` -> `projectShareVeil(.., null)` -> `readOnly playerView`). Every group and tab was clicked and every
disclosure opened. Each panel's React fiber tree was then walked and every MOUNTED component counted by name. The card
counts are what the app mounts. The PDF, Tonight and session counts come from their own view models (`buildViewModel`,
`composeTonightSheet`, SessionMode's two selectors), not from a render. Every count is a script's (CONFIRMED). The slot
column is my reading of the components (PLAUSIBLE where it says "would"). The tools are listed at the foot of this file.
The table of every card, surface by surface, is `A-cards.tsv`.

**How far the corpus run got.** C: 900 of 900 rendered, 0 errors. For each of the six kinds below, the mounted count
equals the count from the record's own reader on 900 of 900 towns. V: 900 of 900 rendered, 0 errors, census equal to the record on 900 of 900. Every cell gives C · V.

## The card kinds, and how many a town shows (owner's dossier; C · V, mean/max)

| card (surface): the thing | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| dossier Systems/Institutions: an institution | 8.36/11 · 8.07/12 | 11.17/18 · 10.93/19 | 14.61/26 · 14.85/27 | 32.79/50 · 31.68/47 | 69.23/91 · 65.92/92 | 93.23/100 · 89.21/110 |
| dossier Systems/Services: a service row of a house | 6.93/13 · 6.31/11 | 11.83/22 · 10.62/22 | 16.87/34 · 16.6/35 | 49.05/74 · 47.37/77 | 109.03/152 · 102.94/152 | 157.81/177 · 148.41/189 |
| dossier Systems/Power: a power | 1.09/2 · 1.07/3 | 1.23/2 · 1.24/2 | 2.37/3 · 2.22/3 | 3.97/5 · 3.83/5 | 6.44/8 · 5.97/8 | 8.03/10 · 7.06/10 |
| dossier Systems/Power: a power that holds or contests the seat | 1.09/2 · 1.07/3 | 1.18/2 · 1.19/2 | 2.17/3 · 2.01/3 | 3.15/4 · 2.93/4 | 3.98/4 · 3.81/4 | 4/4 · 3.93/4 |
| dossier World/NPCs: a person | 1.28/3 · 1.29/5 | 3.57/11 · 3.38/11 | 7.99/20 · 8.09/19 | 24.93/41 · 24.52/39 | 60.92/83 · 57.57/82 | 83.93/92 · 79.93/99 |
| dossier World/Relationships: a tie between two people | 0.4/3 · 0.35/5 | 3.27/10 · 3.01/11 | 7.95/20 · 8.06/19 | 24.93/41 · 24.52/39 | 60.92/83 · 57.57/82 | 83.93/92 · 79.93/99 |
| dossier World/Relationships: a conflict between two powers | 0.01/1 · 0.01/1 | 0.06/1 · 0.05/1 | 0.29/2 · 0.23/2 | 1.15/3 · 1.11/3 | 1.73/3 · 1.63/3 | 2.13/3 · 2.03/3 |
| dossier World/History: a current tension | 1.03/2 · 1.06/2 | 1.05/2 · 1.05/2 | 1.59/2 · 1.55/2 | 1.56/3 · 1.5/3 | 2.53/3 · 2.53/3 | 2.51/3 · 2.51/3 |
| dossier World/History: a historical event | 2.43/4 · 2.47/4 | 2.41/5 · 2.37/5 | 3.41/6 · 3.33/6 | 4.91/8 · 4.75/8 | 7.25/12 · 7.14/12 | 11.36/17 · 11.11/18 |
| dossier World/Traditions: a tradition | 1.47/2 · 1.47/2 | 1.51/2 · 1.51/2 | 2/2 · 2/2 | 3/3 · 3/3 | 4.5/5 · 4.5/5 | 5.97/7 · 5.97/7 |
| dossier Summary/Crisis: a crisis in force | 0.33/1 · 0.37/2 | 0.33/2 · 0.41/2 | 0.37/1 · 0.3/2 | 0.35/2 · 0.35/2 | 0.32/2 · 0.29/2 | 0.27/1 · 0.27/1 |
| dossier Summary/Plot Hooks: a plot hook | 2.35/5 · 2.36/8 | 5.07/13 · 5.01/12 | 9.95/22 · 9.71/22 | 27.97/45 · 27.57/44 | 65.57/90 · 61.68/89 | 89.59/101 · 84.57/105 |
| dossier Systems/Resources: a resource chain | 0.81/3 · 1.32/5 | 0.81/3 · 1.29/5 | 0.83/4 · 1.41/5 | 1.18/4 · 1.41/4 | 1.35/4 · 1.65/5 | 0.82/4 · 1.03/4 |
| PDF ch.06 Institutions: an institution | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF Power: a power | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF Notable NPCs: a major person | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF Notable NPCs: a notable person | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF Notable NPCs: every other person | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF History: a current tension | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF History: a historical event | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF Traditions: a tradition | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF Crisis: a crisis | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF Plot Hooks: a plot hook | - · - | - · - | - · - | - · - | - · - | - · - |
| PDF Relationships: a tie | - · - | - · - | - · - | - · - | - · - | - · - |
| Tonight sheet: a person to voice | - · - | - · - | - · - | - · - | - · - | - · - |
| Tonight sheet: a plot hook | - · - | - · - | - · - | - · - | - · - | - · - |
| session view: a person | - · - | - · - | - · - | - · - | - · - | - · - |
| session view: a plot hook | - · - | - · - | - · - | - · - | - · - | - · - |
| shared page (Institutions): an institution | 8.36/11 · 8.07/12 | 11.17/18 · 10.93/19 | 14.61/26 · 14.85/27 | 32.79/50 · 31.68/47 | 69.23/91 · 65.92/92 | 93.23/100 · 89.21/110 |
| shared page (Power): a power | 1.09/2 · 1.07/3 | 1.23/2 · 1.24/2 | 2.37/3 · 2.22/3 | 3.97/5 · 3.8/5 | 6.44/8 · 5.97/8 | 8.02/10 · 7.05/10 |
| shared page (NPCs): a person | 1.28/3 · 1.29/5 | 3.57/11 · 3.38/11 | 7.99/20 · 8.09/19 | 24.93/41 · 24.52/39 | 60.92/83 · 57.57/82 | 83.93/92 · 79.93/99 |
| shared page (History): a current tension | 1.03/2 · 1.06/2 | 1.05/2 · 1.05/2 | 1.59/2 · 1.55/2 | 1.56/3 · 1.5/3 | 2.53/3 · 2.53/3 | 2.51/3 · 2.51/3 |
| shared page (Traditions): a tradition | 1.47/2 · 1.47/2 | 1.51/2 · 1.51/2 | 2/2 · 2/2 | 3/3 · 3/3 | 4.5/5 · 4.5/5 | 5.97/7 · 5.97/7 |
| shared page (Crisis): - | 0/0 · 0/0 | 0/0 · 0/0 | 0/0 · 0/0 | 0/0 · 0/0 | 0/0 · 0/0 | 0/0 · 0/0 |

Reading the table:
- **The Crisis tab exists only in a crisis.** It mounted in 293 of C's 900 towns and 287 of V's (about one in three at every size), and
  never on the shared page.
- **The shared page shows the same cards in the same numbers**, with one exception: the Plot Hooks tab. It appears in
  about 40 of 150 shares at each size and shows 0 to 0.3 hooks, against 2 to 90 on the owner's page. The Crisis and Faith
  tabs are not on the shared page at all.
- **People and ties match one for one from the town size up**, because the record holds one tie per person.
- **Traditions on the PDF: none for any born town** (0 of 1,800). `src/pdf/sections/Traditions.jsx:56` reads only the lit mirror
  (`settlement.traditions`). The screen shows the view-time draw: 1.5 to 6 traditions a town.

## The six of the design's first cut, component by component

| kind | screen component | where one quoted line could sit, keeping the card's height class | collapsed by default? |
|---|---|---|---|
| institution | `InstitutionsTab.jsx :: InstitutionCard` (255) | under the description (`institution-desc`), above the `Connection:` row, which already names the house's face, the natural signer | no |
| power | `power/PowerStrata.jsx :: FactionRow` (304) | under the members line (`↳ N members · first X`), which is always shown. Under the description would not work: the description sits in the collapsed detail | the description is |
| tension | `HistoryTab.jsx :: TensionRow` (72) | under the description, above the faction chips | no |
| tradition | `TraditionsTab.jsx :: TraditionRow` (45) | under the description (`tradition-description`), above Owner / Last held | no |
| crisis | `CrisisTab.jsx :: CrisisSection` (106) | under the summary, above "Who it touches": the cast below it names the signer | no |
| person | `npcComponents.jsx :: NPCInlineCard` (237) | under the card line (house · power) and its italic house mark, on the card's visible face. Inside the opened body it would be hidden on every card until opened | YES: the body opens on click |

**Height class.** No card of the six has a fixed height on screen. Each is a flexible column (`display:flex` rows with
`flexWrap`, a `padding`, no `height` or `minHeight`). One more line grows the card and keeps its class. **Phone width.**
No card has a phone layout of its own. `useIsMobile` only lifts font sizes to the phone prose floor
(`design/proseScale.js :: proseFontSize`, line 80). One line of quoted speech with a signature would wrap to two or three
lines there and the card grows. The only phone branch near these cards is History's founding grid (`HistoryTab.jsx:292`),
which is not a card. **On the PDF**, most cards are `wrap={false}` blocks with a `minHeight`
(`Institutions.jsx :: InstitutionCard` minHeight 60; `NotableNPCs.jsx :: CompactCard` minHeight 60). A line grows the
block, and an unbreakable block that grows can move to the next page. So the page count can move, and the PDF's page
budget is the owner's.

**Things that make the person card the hardest of the six.** The NPCs tab lists 25 to 84 people in towns and up (max 92),
each a collapsed card. A slot on the visible face makes every one of those rows taller even when it is silent, if the slot
reserves space. So the slot must render nothing when silent. The card already carries an italic line of its own: the
house's mark (`npc-house-mark`, "Short of timber."). The quote's style must not be confused with it.

## What identifies one card stably (C, 900 towns; the same reader as the veil's `CARD_KINDS[kind].idOf`)

| kind | identity today | own id on the record | duplicates of that identity inside one town | a rename moves it? | a re-order moves it? |
|---|---|---|---|---|---|
| institution | `entityIdFor('institution', inst)` = `slug(inst.name)` (no `id`); `catalogId` on catalogue rows | **0 of 34,407** | 0 | YES | no |
| power | `factionIdFromName(name)` (`faction.<snake>`); the React key is the index | **0 of 3,470** | 0 | YES (a DM rename exists: `WorkbenchFactionRename.jsx`) | no |
| tension | `type` (the veil's `idOf` falls to `name`, then `title`, then `type`); the React key is the index | **0 of 1,542** | 0 (`type` is unique within a town on C) | no | the index moves; `type` does not |
| tradition | `rec.id` = `tradition.<seed slug>.<n>` | an id, but **an index into the drawn set** (2,767 cards) | 0 | no | **a re-draw of the set re-numbers it** |
| crisis | `section.id` = `crisis.<type>` | derived from the type (297) | 0 | no | no |
| person | `npc.id` (`npc_<house slug>`, a collision suffixed; `npc_veiled_<16 hex>` for a veiled face) | yes, 27,391 of 27,391 | 0 | no | no |

So only the person and the crisis carry an id that neither a rename nor a draw can move. A pick keyed on the
institution's or the power's name re-deals when the DM renames it. `catalogId` is the stable key for a catalogue house;
custom houses have none. A pick keyed on a tradition's index re-deals when the preview set changes size (a lit town keeps
its stored ids).

## Shared primitives

- **On screen, none of the six shares a card component with another.** `new/Primitives.jsx :: Card` (the "basic card")
  is used by no tab card. `Section` and `Collapsible` are section frames that hold many cards, not cards.
  `primitives/InstitutionCard.jsx` is a different thing despite the name: the popover `InstitutionLink` opens, mounted
  closed beside every house name on the Services and Power tabs.
- **The nearest thing to one home** is the dossier search's registry (`dossier/DossierSearchResults.jsx :: RENDERERS`,
  line 65). It mounts each tab's own card component for a search hit: npc, institution, service, faction (FactionRow),
  neighbour, tie, conflict, event, tension, tradition, hook, resource. A slot put in each kind's component therefore
  reaches the search too, with no extra site.
- **PDF:** each card kind is its own function in `src/pdf/sections/*`. `pdf/primitives/Visuals.jsx :: StatusCard` (249)
  is shared only by the chain cards. **Session view:** `SessionMode.jsx :: Card` (89) is shared by its war rows, people
  and hooks. **Tonight:** `TonightSheet.jsx` is shared by Table View and Session Mode. The PDF's
  `TonightAtTheTable.jsx` is its own twin.
- **So the prize is ONE SLOT COMPONENT, not one slot in a primitive.** One `CardVoice` would be mounted by six screen
  cards, four or five PDF cards (a react-pdf twin, since the renderer differs) and the session's person card. That makes
  about twelve sites with one data source.

## The same thing as two cards on one page (the "one slot a card" rule meets these)

| thing | first card | second card |
|---|---|---|
| a power that holds or contests the seat | Power tab, `ThePowers` (123): the seat card | Power tab, `FactionRow` (304): the roster row, on the same tab (C: 1.1 to 4 seat cards a town) |
| a current tension | Overview, "Tensions & Conflicts", an inline row (`OverviewTab.jsx:495`, not a component) | History, `TensionRow` |
| a conflict | Overview, inline row (`OverviewTab.jsx:506`) | Relationships, `ConflictCard` |
| a person | Tonight sheet, people (a line of their own already) | session view's person card, which excludes the Tonight sheet's people |

## Tools (scratch, outside the repository; not committed)

`cards.jsx` is the render harness: rmeasure's `boot.mjs` and `build.mjs` plus a fiber census of mounted components. It
takes the current fiber tree from the container's root, because the panel node's own fiber can be stale, and it strips
esbuild's rename suffixes. `extract.mjs` builds the cards of each kind from the record by the tree's own readers
(`institutionsWithServices`, `derivePowerStrata`, `shownTraditionsOf`, `describeTradition`, `composeCrisisPage`,
`facesByHouse`, `membersByRank`, `buildViewModel`, `composeTonightSheet`, `collectPlotHooks`). `analyze.mjs` holds the
weights, the simulation, the speakers and the states. `make-a.mjs` writes the tables.
