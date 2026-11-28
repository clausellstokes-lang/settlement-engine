# (B) THE SAME THING ON EACH SURFACE

Tree 777733a2a. The components are read (PLAUSIBLE where marked); the counts are those of (A) (CONFIRMED). The rule to
hold: **a quote shown on one surface is the same quote on every surface that shows that card.**

## Card kind by surface

| thing | owner's dossier (screen) | PDF | Tonight sheet | session view | shared page |
|---|---|---|---|---|---|
| **institution** | CARD: `InstitutionsTab.jsx :: InstitutionCard` (255), every house | CARD: `pdf/sections/Institutions.jsx :: InstitutionCard` (187), every house (counts equal the screen's on 900 of 900) | not shown | not shown | the same screen CARD; a hideable house (criminal, clandestine, illegal brokerage) is removed whole (X-21e) |
| **power** | CARD (roster row): `PowerStrata.jsx :: FactionRow` (304), every power, **and** a SEAT CARD for the seat powers, `ThePowers` (123), on the same tab | CARD: `pdf/sections/PowerStructure.jsx :: FactionCard` (214), every power (the PDF has no second seat card) | not shown | not shown | the same two screen cards |
| **current tension** | CARD: `HistoryTab.jsx :: TensionRow` (72) on History, **and** an inline ROW in Overview's "Tensions & Conflicts" (`OverviewTab.jsx:495`) | CARD: `pdf/sections/HistoryFounding.jsx :: TensionRow` (277); also an inline left-rule block in the PDF Overview (`pdf/sections/Overview.jsx`, ~219) | not shown | not shown | the same two |
| **tradition** | CARD: `TraditionsTab.jsx :: TraditionRow` (45), the view-time draw | **NONE for a born town**: `pdf/sections/Traditions.jsx:56` reads only `settlement.traditions`, the mirror the first lit tick writes. A lit town gets an inline titled block (88) | not shown | not shown | CARD: the same `TraditionRow` through `SharedTraditionRow` (118), fed by the STAMPED public prose (`publicProse.traditions`), not by the draw |
| **crisis** | CARD: `CrisisTab.jsx :: CrisisSection` (106); the tab exists only in a crisis | BLOCK: `pdf/sections/CrisisSections.jsx` (35), from the same `composeCrisisPage` | the OPENING line (one line, `TonightSheet.jsx:50`), not a card | the Tonight sheet (it mounts `TonightSheet`) | **not shown**: no Crisis tab on any of 900 shares |
| **person** | CARD: `npcComponents.jsx :: NPCInlineCard` (237), every person, collapsed | THREE FORMS by rank (`NotableNPCs.jsx:62`): a FULL CARD (138) for the top three and anyone of power 8 or more; a COMPACT CARD (364) for the next four; a NAME ROW (304) for the rest. Plus `NPCQuickRef.jsx :: NPCRow` (36), a table row for everyone | a BLOCK for each of up to three "people to voice" (`TonightSheet.jsx:66`; `tonightSheet.js :: peopleOf`, the crisis cast first). **It already prints the person's own line** (a want or a secret) | a CARD for up to eight by power, less the Tonight three (`SessionMode.jsx:211`, Card at 89, person at 401) | the same screen CARD; a veiled face keeps its name and loses house, title and role |

## Where the kinds differ (a card on one surface, a row on another)

1. **A person is a card on the screen and, for most people, a name row on the PDF.** In towns and up, 17 to 72 people a
   town are `OtherNameRow` lines with no room (C means). Only the full card (top three plus power 8 or more: C 1.3 to 7.9
   a town) and the compact card (the next four) have a place. A person's quote shown on the screen would, for most people,
   have **no PDF card to sit on**. The rule then reads "the same quote where a card exists, none where it does not". That
   needs saying to the owner.
2. **A tradition has no PDF card for any born town** (C and V: 0 of 1,800). The same quote cannot appear on the PDF until
   the town is lit.
3. **A tension and a conflict are a card on History or Relationships and an inline row on the Overview.** The rule "one
   slot a card" puts the quote on the card (History). The Overview row is not a card, so it carries none. So the same
   page shows the tension twice and quotes it once.
4. **A seat power is two cards on one tab** (the seat card and the roster row). Only one may carry the slot. The PDF has
   only the roster form (`FactionCard`), so **the roster row (`FactionRow`) is the card the surfaces share**, and the seat
   card should carry none.
5. **The crisis is a card on the dossier and the PDF, and one line on the Tonight sheet.** The Tonight line is not a card:
   no quote there. The design's "people to voice" block is already a person's own words.
6. **The Tonight sheet's people block is the one place a surface already "voices" a person** (`VOICE_SLOTS`,
   `tonightSheet.js:359`). It holds their goal or their secret, drawn there, not a quote. If a person's card carries a
   quote, the Tonight block for that person would either show it or not. Showing it would put two lines of the person's
   own on one block. My reading: leave the Tonight block as it is (no slot), and say so to the owner.

## What one quote needs to be the same on every surface (PLAUSIBLE: the design's consequence)

- **One source:** the quote must come from one function of the record (the same seeded choices), computed alike by the
  screen component, the PDF view model and the session card. That is easy for the owner's dossier, the PDF and the
  session view: they all hold the owner's full record, including `_seed`.
- **Not the shared page:** `toPublicSafe` strips `_seed` (and `_regenSeed`, `_config`) from every public payload
  (`display/publicSafe.js:538`). The shared page cannot recompute a seeded pick of the town. A quote on the share must
  therefore be STAMPED at publish, as `publicProse` stamps the traditions' rows. The design's fail-closed rule (no quote
  on the share until the veil lands) is forced as well as chosen.
- **The same card identity on every surface:** the PDF keys its cards by index (`r-<cat>-<i>`, `f-<i>`, `t-<i>`). The
  quote must be keyed on the thing's identity of (A), not on a surface's key. The PDF's anchors (`anchor(inst.id)`,
  `npc.id`) are the right join.
- **One person a page, counted per surface:** the screen dossier is one "page" of twenty tabs. A PDF is one document. The
  rule must say whether "a page" is a tab, the dossier, or the document. The simulation of (C) takes the whole dossier.
  The PDF would then show the same set, minus the cards it lacks.
