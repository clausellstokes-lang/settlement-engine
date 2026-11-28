# (F) THE ENGINE'S SHAPE, PROPOSED (S-G1; nothing here is built; vetoable in every part)

## The leaf: `src/domain/voices/quoteFor.js` (pure, draw-free, no clock)

`quoteFor(card, settlement, { audience })` returns `{ lineId, text, speaker: { id, name, role } } | null`. `card` is
`{ kind, id, state, weight }`. The six kinds' **card adapters** sit beside it in `voices/cardsOf.js`, one per kind, built
on the readers (A) used (`institutionsWithServices`, `derivePowerStrata(..).roster`, `history.currentTensions`,
`shownTraditionsOf`, `composeCrisisPage`, `npcs`). "One quote a person a page" and "three a tab" are rules about a whole
page, not one card. So the work is done once per record and audience by `voicePlanOf(settlement, { audience })`,
memoised on the record's identity. It walks every card in tab order (Crisis, Institutions, Power, NPCs, Traditions,
History), and `quoteFor` reads its card out of the plan. Every surface then shows the same quote for the same card (B).

**The three decisions, in order** (the seed is the record's `_seed`; the card id is (A)'s identity, made stable below):
1. **Does this card speak?** `mix32(fnv1a32('<seed>::voices.speaks::<kind>:<id>')) / 2^32 < min(ODDS[weight] × SIZE[tier], BUDGET[weight] / n)`,
   where `n` is the cards of that weight on the tab (C's budget variant). Then the TAB CAP takes the weightiest first, by
   the same draw. Decided BEFORE any speaker or line, so a pool edit re-deals no "speaks".
2. **Who speaks?** The kind's candidates of (D), kept only if lawful for the audience (`people/cardPowers.js ::
   isHousePublic`; the owner's dossier and the PDF may also allow a non-public person for a DM-marked line). The first in
   `rankRendezvous(candidates, '<seed>::voices.who::<kind>:<id>', c => c.id)` who has not spoken on the page. If there is
   none, the card is silent, and a speaker is spent only where a card won a quote.
3. **Which line?** The pool `SAID_LINES[<kind>.<state>]`, admitted by the door as every line is
   (`facts/drawDeclared.js`: a SAID line declares its nouns), in `rankRendezvous(.., '<seed>::voices.line::<kind>:<id>',
   l => l.id)`, skipping a line already printed on the page. The version is `line.versions[speaker.presentation.disposition]`.

**Stable ids (the cards as they are make this the hard part, A).** Use `npc.id` for a person and `crisis.<type>` for the
crisis. Institution: `catalogId` where present, else `slug(name)` (a custom house: rename re-deals; said). Power: the
roster key `factionIdFromName(name)` (a DM rename re-deals; said). Tension: `type` (unique per town on C and V). Tradition:
`rec.id` while lit. In preview it is an index into the draw, so key on `coreMotif.element + act` instead (unique within
every town of C: 0 duplicates in 2,767 traditions, CONFIRMED).

## The one component, and where it is printed

`src/components/primitives/CardVoice.jsx`: one italic line, its signature "— <Name>, <role>", placed and styled by itself
alone. It **renders nothing when the card is silent** (no reserved height: the NPCs tab's 84 collapsed rows must not
grow). It has a react-pdf twin, `src/pdf/primitives/CardVoice.jsx`, fed the same plan. Print sites (A, B):
- **Screen (6):** `InstitutionsTab.jsx :: InstitutionCard` (under the description); `power/PowerStrata.jsx ::
  FactionRow` (under the members line; **not** `ThePowers`, the second card of a seat power); `HistoryTab.jsx ::
  TensionRow` (not the Overview's inline row); `TraditionsTab.jsx :: TraditionRow`; `CrisisTab.jsx :: CrisisSection`
  (under the summary); `npcComponents.jsx :: NPCInlineCard` (under the card line, on the visible face). The dossier
  search mounts the same six through `DossierSearchResults.jsx :: RENDERERS`.
- **PDF (5):** `Institutions.jsx :: InstitutionCard`, `PowerStructure.jsx :: FactionCard`, `HistoryFounding.jsx ::
  TensionRow`, `CrisisSections.jsx`, `NotableNPCs.jsx :: FullCard` and `CompactCard` (a person on a name row shows none);
  `Traditions.jsx` once a town is lit.
- **Session (1):** `SessionMode.jsx`'s person card. **Tonight: none** (its people block is already the person's own line).

## The tuning, the guard, and the share

- **Tuning:** `src/domain/voices/voicesTuning.js :: VOICES_TUNING = Object.freeze({ odds: { weighty: 0.75, lesser: 0.25 },
  sizeFactor: { thorp: 0.5, hamlet: 0.5, village: 0.75 }, tabBudget: { weighty: 2, lesser: 1 }, tabCap: 3, personCap: 1 })`.
  A `*_TUNING` const is population P1 of the measured inventory (`scripts/lib/tuning-inventory.mjs`). It reds by id until
  the DECLARED register (`tests/lint/.tuning-register.json`, the pen's) holds its row, and its values are signed by the
  owner at the sitting. The WEIGHTY table of (C) is data in the same leaf (a predicate per kind) and is listed for him with
  the numbers.
- **The id guard:** one row in `tests/lint/stablePickIds.shared.mjs :: IMPORTED_POOLS`: `{ module:
  'src/data/voices/saidLines.js', export: 'SAID_LINES', scope: 'voices.said', layout: 'record', words: 'say' }`. A line is
  `{ id, needs, say: (disposition) => … }` so that all four versions are fingerprinted (the `say` source text). The ids
  are banked by the door (`scripts/stable-pick-ids-door.mjs`).
- **Fail-closed on the share:** the shared page renders the same components with `playerView` / `publicDossier`, and
  there `voicePlanOf` returns the empty plan for `audience: 'reader'` until VOICES-ON-SHARE. It could not do otherwise:
  `toPublicSafe` strips `_seed` (`publicSafe.js:538`). VOICES-ON-SHARE must therefore STAMP the reader's plan at publish
  (beside `publicProse`), dropping any quote whose card or speaker the share's veil hides.

## The tests I would write first (red on the base)

1. `voicePlanOf` is pure and seeded: the same record gives the same plan. Adding or removing a SAID line moves no
   "speaks" and no speaker, only lines. Renaming an unrelated card moves nothing else.
2. The page rules over C and V: no person quoted twice on a page; no tab over the cap; every speaker of a reader's plan
   has `isHousePublic`; no quote on a card with no lawful candidate.
3. The share census (A's fiber walk): `CardVoice` mounts **0** times on 1,800 shared pages.
4. One quote, every surface: for each card the PDF prints, its quote's `lineId` and speaker equal the screen's.
5. Silence costs nothing: a silent `CardVoice` mounts no DOM node (the NPCs tab's height is unchanged).
6. The guard's row: an unbanked SAID id is red.

## What the cards as they are make hard, and what I would ask the owner

1. **Long tabs.** "1 in 4 of the lesser" is 6 to 20 quotes on Institutions and 5 to 16 on NPCs in towns and up, so the
   cap would choose. *May the odds be bounded by a tab budget (2 weighty, 1 lesser), a fourth number for him to sign?*
2. **Tensions have no speaker** in 73 to 93% of cases (C and V) (their parties are words, not powers). *Who voices a tension: the
   aggrieved by trade, or nobody (the surveyor's alone)?*
3. **Two cards of one thing on a page** (a seat power; a tension on Overview and History). *Is "the roster row and the
   History card, and no other" right?*
4. **A person is a name row on the PDF** for most people in towns and up, and **a tradition has no PDF card** until lit.
   *Is "the same quote where a card exists, none where it does not" his rule?*
5. **Small places:** one named person speaks once. A thorp carries 0 to 2 quotes. *Is that the quiet he meant?*
6. **Identity by name:** a DM's rename of a power or a custom house re-deals its quote. *Acceptable, or should a rename
   keep it (it would need a stored id: a birth change, which is his golden signing)?*
