# RECEIPT POOLS — THE CAUSAL GRAMMAR (the joins' voice: how the Herald tells a chain as a sentence)

## Authored 2026-08-03 for DESIGN_FP_SPINE.md §2, SP-6's THE CAUSAL GRAMMAR
## amendment (owner order 2026-08-03) and its two successors — THE TWO
## REGISTERS (owner constraint) and SCOPE + THE SURFACE CONTRACT (owner
## clarification). Source volumes: docs/DESIGN_FP_COUPLINGS.md (§3's 42
## directions, §4's 21 pairs walked, §5's six signature stories, CW-1/CW-2)
## and the seven layer volumes it points at. This annex is CONTENT, not
## architecture — it invents no mechanism, re-opens no ruling, adds no
## coupling, and mints no engine state. Where a volume names a sentence, that
## sentence is a mold's variant 1.

**What this file is.** The narration kit's causal voice: authored prose for
the JOINS between receipts, so the Herald can tell a chain as one sentence
rather than as a list of unrelated misfortunes. Three content unit classes,
three sections:

| Section | Class | Keyed by |
|---|---|---|
| **§1 JOIN MOLDS** | full sentences that span a join — a cause clause, a connective, an effect clause (and, in the telling register, more links) | the coupling taxonomy: the 42 CPL directions of DESIGN_FP_COUPLINGS §3 plus the named within-layer chains — one family per direction, `JF-<pair><direction>` |
| **§2 CLAUSE FORMS** | a compressed one-clause variant per major kind, so a kind can appear as a LINK inside somebody else's sentence without dragging its whole pool sentence in | the phrased kind id |
| **§3 CONNECTIVES** | the joining words and phrases themselves, pooled | the provenance EDGE TYPE (§0c below) |

**COMPOSITION IS DISPLAY-SIDE.** Nothing here is state. CW-1's braid and the
arc composers assemble these units at Herald composition time over receipts
that are ALREADY persisted (`sourceEventId` / `causes[]` / the §1b-B receipt
fields / CW-0's `receiptField` map). No new writer, no new save shape, no
engine read. The chain exists whether or not it is ever spoken; this annex is
only how it is spoken. Dark ⇒ the feed is byte-identical (CW-1's dormancy
golden covers the voice too).

**HERALD EXCLUSIVITY.** The causal voice is the Herald's alone. The
settlement rumor mill keeps its own local register and REFERENCES upward: a
rumor whose event reached the Herald carries a link to that headline by the
id join the address law already mandates; a rumor whose event stayed below
the pacing floor carries NO link, and is truthfully unlinked rather than
dead-linked. No pool in this file is ever drawn by the rumor mill.

---

## §0a THE THREE REGISTERS (SP-6's two-registers amendment + the surface contract)

The Herald entry is four tiers; this annex writes three of them (the fourth
is the table, which is not prose).

| Tier | Register | What a mold in it may do | Cap |
|---|---|---|---|
| 1. the headline | **HEADLINE** | the event plus AT MOST ONE causal gesture — one join, one connective clause | one sentence; chain shapes of two-plus links are FORBIDDEN here |
| 2. the subheader | **SUBHEADER** | one plain, unembellished statement of what happened — clarity only, no voice, no figure | one sentence; no connective flourish, no irony, no forward-looking clause |
| 3. the causality popup | **TELLING** | the full composed chain — multi-link, coherent, entailed per link, freed from headline compression | the chain's own length, banded by CW-2's depth cap |
| 4. the cause-walk table | (not prose) | the receipts themselves, the ground truth both registers project | — |

The subheader is the VISIBLE HONESTY ANCHOR: the headline may sing because
the subheader states. A headline whose gesture the subheader cannot restate
plainly is a headline that overran its receipt.

The pacing governor reads HEADLINES ONLY — the telling is pull, never push.
No TELLING mold ever contributes to a section cap, a significance floor, or
a repetition envelope's push side.

**Popup convention (product-wide UI law, restated here because the telling
lives in one):** a popup WITHOUT an explicit acknowledge control closes on
outside-click; a popup WITH one ("got it" / "continue" / "don't show again")
requires the deliberate dismissal. The causality popup carries no acknowledge
control.

## §0b THE THREE LAWS

1. **PER-LINK ENTAILMENT.** Every clause asserts only its OWN receipt's
   facts, and every connective is licensed by the ACTUAL provenance edge
   between those two receipts. A chain sentence is the cause walk wearing
   prose — never an invention, never a summary that adds a fact no member
   carries, never resemblance standing in for `causes[]` (CW-1's identity
   pin: two unrelated same-window misfortunes do not braid, and no mold may
   make them read as though they did). A mold selects on the chain's EDGE
   SEQUENCE and renders only on a matching shape (R-CAU-C).
2. **TIME BANDS.** Durations render through the closed time-band vocabulary
   ONLY, derived from `sinceTick` against `INTERVAL_WEEKS` (SP-7's
   assertion). **No digits. No numerals of any kind in a duration** — this
   annex is stricter than the sibling annexes' R-CPL-G, which permitted
   numeral WORDS; here the six bands are the whole vocabulary and there is
   nothing to spell.
3. **COMPOSITION LIVES DISPLAY-SIDE.** See above. Additionally: no mold
   implies engine state that does not exist — no price, no count, no ledger
   figure, no ceasefire object, no congress, no divine verdict.

Inherited whole from the estate and NOT restated per family: the address law
(settlements BY NAME, typed action, reason); LAW ONE (no god acts; no named
person's fate resolves); R-28 headline honesty; the belief-attribution law
(records of being wrong render AS records of being wrong — the walk never
retro-corrects, and dramatic irony is the product); FAIL-CLOSED audience
projection (J-CPL-5 — a player-side telling over a chain with a covert seam
truncates and is byte-identical to a telling over a chain that genuinely ends
there; no mold may hint at concealment, and no `[dm-only]` mold may reach a
player surface).

**Frequency + repetition.** The content-depth floor is frequency-scaled PER
JOIN FAMILY, not per mold class: a family whose direction fires often carries
the top of its range. The phrase-repetition envelope covers COMPOSED
sentences at the family grain — two composed tellings that differ only in
slot fills are one telling for the envelope's purposes.

## §0c THE PROVENANCE EDGE TYPES (the key §3's connective pools hang from)

SP-6 names four connectives as exemplars — "following", "born of", "in answer
to", "the bill for". Those are connectives, not a type vocabulary; the corpus
needed eight typed edges to keep law 1 checkable. Each is warranted by a
receipt class the coupling volume already carries.

| Edge | The relation | Licensed connective family (§3) | Warranting receipt class |
|---|---|---|---|
| `succession` | the effect follows the cause in the record with a causal ancestor join, no agency between them | "following", "in the wake of", "and then" | route decay after interdiction; expiry lifting a hold |
| `origination` | the cause PRODUCED the effect | "born of", "out of", "which made" | refugee columns out of a sack; a party born of tribute strain |
| `answer` | a deliberate ACT with a recorded reason, taken in response | "in answer to", "and answered it", "rather than" | an embargo ordered; an intent deposited; a claim pressed |
| `charge` | the effect is a PRICE paid for the cause | "the bill for", "paid for in", "and is paying" | legitimacy charges; credibility falls; tribute strain |
| `belief` | the join runs through a BELIEF, not a fact — always attributed, asserts no truth the record did not hold | "believing", "on the word that", "on a misjudgment" | `belief_misjudgment`; `perceivedScarcityOf`'s `mistaken` clause; dispatch refusal on believed danger |
| `gate` | the cause BLOCKED or PERMITTED the effect — the negative arm, where the counterforce lives | "and could not, because", "which forbade", "and it held" | the treaty war-block; `moverPermitted` refusals; `CONQUEST_MARGIN`; `EMBARGO_FLOOR` |
| `instrument` | the join runs through a drafted artifact — a term, a pact, a clause | "under the terms of", "by the term that", "because a term says" | treaty terms; peacetime pact terms; the credit obligation |
| `carriage` | the join is made by a CARRIER moving along an edge — caravan, column, army, legate | "carried by", "came with", "down the road with" | conversion carriers; rumor carriers; refugee carriers; caravan witness |

**If the chair prefers the spine's literal four**, the fold is stated and
mechanical: `succession`+`carriage` → "following"; `origination` → "born of";
`answer`+`belief` → "in answer to"; `charge`+`gate`+`instrument` → "the bill
for". Every mold below keeps its eight-way tag, so the fold is a §3 edit and
not a re-authoring.

## §0d THE SLOT CONVENTION

The corpus ten, unchanged (a fill is never baked; every proper noun and every
cause is a slot):

| Slot | Fills with |
|---|---|
| `{settlement}` | the subject settlement, BY NAME (the address law) |
| `{counterpart}` | the other settlement of the directed pair — enemy, partner, destination, host |
| `{npc}` | a cast person named on a member receipt; never minted, never a fate resolved |
| `{faction}` | the acting faction, seat, bloc or court |
| `{house}` | the merchant house (a faction with books) |
| `{temple}` | the temple, chapter house or observance |
| `{band}` | a band word from a closed quantity/severity vocabulary — never a figure |
| `{reason}` | the RECORDED reason, typed, from the receipt's own reason field |
| `{good}` | the named trade good |
| `{route}` | the named road, lane, crossing or pass |

**Borrowed, cross-referenced, NOT minted here.** Every token below is declared
volume-local by a sibling annex and used here unchanged. The list is the exact
union of what §1, §2 and §3 actually spend — a token that exists only inside a
cross-reference is precisely what a registration walker will fail to find, so
the reference is made explicit here rather than left implicit in a family block.

| Slot | Declared by | Fills with |
|---|---|---|
| `{creed}` · `{rival_creed}` | RECEIPT_POOLS_FAITH.md | the rite by its in-world name, and the rite it stands against |
| `{calamity}` | RECEIPT_POOLS_FAITH.md | the read calamity — the failed harvest, the sickness, the flood |
| `{when}` | RECEIPT_POOLS_FAITH.md | the named season a reading promised |
| `{war}` · `{term}` | RECEIPT_POOLS_WAR.md (declared shared) | the war, and the treaty-term family, each by its in-world name |
| `{third_party}` | RECEIPT_POOLS_WAR.md (volume-local there) | the third party to a pair's affair — the intercepting column, the ally called, the broker, the buyer |
| `{wound}` | RECEIPT_POOLS_INTERIOR.md | the named grudge family |
| `{burden}` | RECEIPT_POOLS_INTERIOR.md | the named standing burden |
| `{decision}` | RECEIPT_POOLS_INTERIOR.md | the named decision a grievance was opened over |
| `{standing}` | RECEIPT_POOLS_INTERIOR.md | the banded standing a seat has fallen to |
| `{season}` | RECEIPT_POOLS_INFORMATION.md | the named season a condition has stood since |

The within-layer faith and interior chains are unwritable without `{calamity}`,
`{when}`, `{wound}` and `{burden}`: a wrath reading with no `{calamity}` bakes
the disaster and a burial with no `{wound}` bakes the quarrel, and both are
address-law violations of exactly the kind this section exists to prevent.

**Minted here — the time-band family (four print positions, one band):**

| Slot | Position | Example |
|---|---|---|
| `{timeband}` | attributive, before a noun | "a generation's grudge" |
| `{timeband_span}` | noun phrase, after a preposition | "paid through a generation", "within a decade" |
| `{timeband_since}` | adverbial, standing alone | "years on, the road is still empty" |
| `{timeband_age}` | predicate | "the grudge is older than its bearers" |

The band is selected ONCE from `sinceTick`/`INTERVAL_WEEKS`; the slot decides
which column prints:

| Band (canonical) | `{timeband}` | `{timeband_span}` | `{timeband_since}` | `{timeband_age}` |
|---|---|---|---|---|
| this season | this season's | this season | this season | of this season |
| within the year | the year's | the year | within the year | not yet a year old |
| years on | years' | years | years on | years old |
| a decade's | a decade's | a decade | a decade on | a decade old |
| a generation's | a generation's | a generation | a generation on | a generation old |
| older than its bearers | — | — | — | older than its bearers |

**"Older than its bearers" is PREDICATE-ONLY.** It is a comparison, not a
quantity, and it cannot be made to sit before a noun, after a preposition, or
alone. A mold whose slot is attributive, span or adverbial draws from the
other five; a chain that lands in the sixth band and whose mold needs one of
those three positions falls back to §3's bare connective rather than printing
a broken phrase.

## §0e AUTHORING RESOLUTIONS (recorded, vetoable — the chair's, not the implementer's)

- **R-CAU-A — eight typed edges, not four.** Warranted per row in §0c; the
  fold-down to the spine's four exemplars is stated there and costs one §3
  edit. The reason for eight: law 1 is only checkable if `gate` (the
  negative arm — every pair's negative-hardest pin) and `belief` (the
  attribution law's own edge) are distinguishable from a plain `answer`. A
  four-type key would have made "X embargoed Y" and "X could not embargo Y,
  because" the same edge, and the counterforce prose would have been
  unverifiable against the receipt.
- **R-CAU-B — one band, four print positions.** The owner's closed six mix
  forms already ("this season" is adverbial, "a decade's" is possessive,
  "older than its bearers" is a predicate), so a single slot cannot be
  grammatical in every position. The 6×4 table derives the missing forms and
  nothing else; NO SEVENTH BAND IS MINTED and the six canonical strings are
  unaltered — only their inflections are supplied. Flagged for the chair as
  the one place this annex prints a string the owner did not write. *(The
  span column is an authoring correction made during this section's own
  verification pass, not a late addition: every one of §1.1's ten
  duration molds turned out to sit after a preposition — "paid through …",
  "took the run inside …" — a position the first three columns could not
  fill without printing "through a generation's". Recorded rather than
  quietly patched, per the estate's behaviour-shift discipline.)*
- **R-CAU-C — molds select on chain SHAPE; there is no cross-shape reuse.**
  A mold's tag is its contract: `[answer → charge]` renders only over a
  two-link chain whose first edge is `answer` and whose second is `charge`.
  Reusing a mold on a mismatched chain would assert a relation the
  provenance edge does not carry, which is law 1's exact prohibition. A
  chain with no matching mold falls back to §3's bare connective plus §2's
  clause forms — plainer, never wrong.
- **R-CAU-D — every family carries all three registers.** The spine requires
  HEADLINE and TELLING per family; the surface contract adds SUBHEADER. A
  family missing one has a tier that cannot render, and the honesty anchor
  is the tier that would go missing first, so it is written per family here
  rather than deferred to §2.
- **R-CAU-E — the owner's two exemplars are the register's calibration and
  seed their own families.** "X declares vengeance on its weakened
  neighbour — a generation's grudge will be met" is the HEADLINE register's
  ceiling (one gesture, one band, one em-dash turn) and seeds the
  WITHIN-LAYER WAR chain, not a CPL direction. **Its one home is named:
  `JF-W-grievance_to_war` HEADLINE 1, and nowhere else** — the corpus has
  three within-layer war families, the original wording said only "the
  within-layer WAR chain family", and two writers each read that as theirs
  and planted it. Naming the family is the fix that stops it recurring; a
  later editor who wants the exemplar in a second family is looking at a
  duplicate, not a gap. The entailment argument for that home, and the
  chair's one-edit reversal, are recorded at the family.
  "Thorp Y was wiped out by the flood that followed the famine year; trade
  withered, and the routes turned elsewhere" is the TELLING register's
  calibration and its tail seeds **JF-CPL-8b** below, slotted per the
  corpus's R-CPL-F precedent (proper nouns slotted, no baked name) and
  otherwise reproduced word for word — the slot law is the only licence to
  depart from an exemplar's wording, and where it does not bite, the owner's
  words stand.
- **R-CAU-F — a family's molds are angle-distinct across the corpus's own
  palette**: the event plain · the street's view · the ledger's or
  institution's view · the consequence forward · the understatement · the
  negative (the join that did NOT fire, which is where every pair's
  counterforce lives). Two molds differing only in slot fills are ONE.
- **R-CAU-G — `[dm-only]` is used sparingly and only where the JOIN itself
  is covert.** A public mold never gestures at a hidden link; the
  player-side telling truncates instead (J-CPL-5, R-CPL-A). Every mold below
  is `audience: public` unless tagged.
- **R-CAU-H — where law 2 bites, stated so it is checkable.** *(Verification
  pass, 2026-08-03. The four §1 blocks were authored in parallel and applied
  three different readings of law 2; this reconciles them in the strictest
  one's favour and records the line rather than leaving a scan to guess it.)*
  A duration is a BAND RENDER — and must therefore spend a `{timeband_*}`
  slot — when it measures the interval a mold's **own tagged join** spans.
  Three things are NOT band renders and stand as authored: a single receipt's
  internal texture (*the wardens counted the sacks out while the town
  watched*), a cadence (*season by season*, *week by week*), and a point
  reference (*the week the column came*, *after the season turned*). The test
  is §3.3's own and it is executable: **a band render answers _how long
  between these two receipts_; texture answers _what the day was like_.** A
  §1 mold that measures its own join in loose words — *inside the season · by
  the turn of the year · for a fortnight · lasted a season · by the third
  market day* — is below the law whatever it reads like, because it publishes
  an interval the walk never derived and invites the arithmetic the corpus
  refuses to print. §2's inherited clause forms are exempt by §3.3 rule 2 and
  R-W5-B: they are receipt interiors, not joins.
- **R-CAU-I — ONE edge key: §0c's eight are the tags, §3's sixteen are their
  named POOLS.** *(Verification pass, 2026-08-03, executing the fold §0c
  itself specified as "a §3 edit and not a re-authoring" — vetoable, and
  reversible by reading the table in §3.1 backward.)* Two vocabularies
  shipped side by side would make law 1 uncheckable, since a mold's tag could
  be validated against either key and neither would be authoritative. So:
  every mold in §1 tags against the EIGHT, as all four blocks already did;
  §3's sixteen survive intact as connective pools grouped under the eight
  parents they serve, each keeping its own name, its own warranting receipt
  classes and every line it was authored with. Nothing is lost and nothing is
  merged away — the sixteen become the eight's inflections rather than a
  rival taxonomy. The five pools §3 authored with no §0c row are assigned
  here, with the reasoning on the record: `remembered` and `exposed` →
  `succession` (elapsed record-time and a surfacing both follow without
  agency between); `judged` → `belief` (a verdict is a reading on an
  observer's axis and asserts no truth, which is `belief`'s exact charter);
  `inherited`, `buried` and `breached` → `instrument` (a successor's carry, a
  policy severing and a default all run through a drafted artifact);
  `planted` → `belief`'s DM arm and `refused`/`dissolved` → `gate`, as §3's
  own reconciliation already had them.

---

# §1 JOIN MOLDS

Seventy-eight join families. §1's key is the one SP-6's amendment names —
*"the 42 CPL directions plus the named within-layer chains"* — walked in four
blocks and one order:

| Block | Families | Key |
|---|---|---|
| **§1.1** | 20 | CPL-1 … CPL-10, both directions — the war-cause and trade-cause quarter |
| **§1.2** | 20 | CPL-11 … CPL-20, both directions — the faith, population and information quarter |
| **§1.3** | 19 | CPL-21 both directions, the STORY CANON's eleven named chains, the six SIGNATURE STORIES |
| **§1.4** | 19 | the WITHIN-LAYER chains — war ×3 · trade ×3 · faith ×3 · pop ×3 · info ×3 · grammar ×2 · interior ×2 |

Every family carries all three registers (R-CAU-D), tags every mold against
§0c's eight typed edges (R-CAU-I), spends exactly the slots its SLOTS line
declares, and states the fence most likely to be eroded by a later editor. The
counts, the flags and the open items for the chair are §1.5 — once, for all
four blocks.

---

## §1.1 — THE WAR-CAUSE AND TRADE-CAUSE QUARTER (CPL-1 … CPL-10, both directions)

Twenty families: every direction of the ten pairs DESIGN_FP_COUPLINGS §4
walks first — war × {trade, faith, pop, info, grammar, interior} and trade ×
{faith, pop, info, grammar}. Each family cites the pair section its
entailment comes from; nothing below asserts a read that section does not
carry.

---

### JF-CPL-1a — WAR → TRADE
> *the blockade that starves the siege — seizure, interdiction, and the treaty that moves real grain (the Hansa)*

**Pair:** CPL-1 (§4) · **cause:** war · **effect:** trade · **cited waves:** WR-4, WR-6, WR-10, TR-1, TR-4
**SLOTS:** `{settlement}` `{counterpart}` `{house}` `{term}` `{good}` `{route}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[answer]` {settlement} has closed the {route} against {counterpart} — {reason}, and the {good} goes no further than the gate.
2. `[origination]` The {good} {counterpart} was owed is in {settlement}'s stores tonight, taken on the road and entered as lawful seizure.
3. `[charge]` {counterpart} is paying for the siege in {good}: the granary is counted every week now, and the count goes one way.
4. `[succession]` {timeband_since}, nothing has come up the {route} to {counterpart} but rumour, and the houses have taken their custom elsewhere.
5. `[instrument]` What {settlement} could not carry off the field it takes in {term} — the war's bill, delivered in grain.

**TELLING**
6. `[answer → succession → charge]` {settlement} ordered the {route} shut against {counterpart} for {reason}; the caravans stopped, and did not start again; and {timeband_since} {counterpart}'s smiths have been working cold iron and short hours.
7. `[carriage → origination → succession]` A column out of {settlement} took the {good} on the {route} and carried it home entire; the loss stands in {house}'s book in {house}'s own hand; and the factors who used to work {counterpart}'s side of that road now work for whoever still has a road.
8. `[gate]` {settlement} shut the {route} against {counterpart} and {counterpart} did not notice — the tie was never worth the closing, and both towns' ledgers say the same thing about it.

**SUBHEADER**
9. `[plain]` {settlement} seized {counterpart}'s {good} on the {route}; {counterpart}'s supply of {good} has fallen.

---

### JF-CPL-1b — TRADE → WAR
> *merchants waging war without banners — the salient tie that dampens, the contested flip that escalates*

**Pair:** CPL-1 (§4) · **cause:** trade · **effect:** war · **cited waves:** TR-1, WR-0c
**SLOTS:** `{settlement}` `{counterpart}` `{house}` `{good}` `{route}` `{band}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[gate]` {settlement} has cause enough against {counterpart} and will not act on it: too much of what {settlement} eats comes down that road.
2. `[answer]` The {good} lane changed hands at the crossing and {settlement} answered with soldiers — {reason}; what was a matter of tolls is a matter of banners now.
3. `[charge]` The houses that stayed away from {settlement}'s gate this season are the bill for its embargo — {band} of the town's own custom, charged to the hall that voted it.
4. `[belief]` {settlement} holds that {counterpart} means to take the {good} trade whole, and is arming on the holding; {house}'s books say otherwise.

**TELLING**
5. `[succession → answer → gate]` {counterpart} took the {good} lane at the crossing {timeband_since}; {settlement} answered first with an embargo and then with an intent laid before its own court; and the court, weighing what it would take to finish, would not open the war.
6. `[origination → charge → succession]` The quarrel was born of one contested crossing on the {route}; the counting of what it has cost since fills a book at either end; and neither town can now name the season it stopped being about the road.

**SUBHEADER**
7. `[plain]` {settlement} and {counterpart} contested the {good} trade on the {route}; {settlement} has opened a war intent against {counterpart}.

---

### JF-CPL-2a — WAR → FAITH
> *the creed follows the garrison — occupation converts, the imposed flip stains, and the war dies with the god*

**Pair:** CPL-2 (§4) · **cause:** war · **effect:** faith · **cited waves:** WF-1, WF-6, WR-8; `warTermination`'s dissolution (BUILT, flag-dark)
**SLOTS:** `{settlement}` `{counterpart}` `{temple}` `{creed}` `{rival_creed}` `{war}` `{timeband_since}`

**HEADLINE**
1. `[carriage]` {creed} came to {counterpart} with {settlement}'s garrison, and the altar was raised before the walls were mended.
2. `[charge]` {counterpart}'s seat kept the town and lost its good name in the keeping: the change was imposed, and the market knows by whose order.
3. `[succession]` The {war} {settlement} opened in {creed}'s name has no name now — {counterpart} no longer keeps that rite from that throne, and the cause went with it.
4. `[origination]` {timeband_since}, the soldiers' rite is {counterpart}'s rite, and the young there have no memory of the older one.
5. `[gate]` No banner ever proved a god: {settlement} took the field, took the town, and took nothing at all from {creed}.

**TELLING**
6. `[carriage → origination → charge]` {settlement}'s column wintered at {counterpart} and kept its season openly; by spring {creed} had a house inside the walls; and {counterpart}'s seat has been paying for that welcome in standing ever since.
7. `[succession → gate]` The throne at {counterpart} changed its patron, and the {war} {settlement} was fighting over {creed} dissolved on its own record — no term was signed and nobody was beaten; the cause simply stopped existing.
8. `[carriage → origination → succession]` The war fronts carried the rite as far as the columns went; {temple} at {counterpart} took in what came; and {rival_creed} keeps its feasts on a narrower street {timeband_since}.

**SUBHEADER**
9. `[plain]` {settlement}'s occupation of {counterpart} raised {creed} there; {counterpart}'s seat lost legitimacy for the imposed change.

---

### JF-CPL-2b — FAITH → WAR
> *the casus a holy man hands a general — the schism axis outranks the stranger (Saladin)*

**Pair:** CPL-2 (§4) · **cause:** faith · **effect:** war · **cited reads:** `CLAIM_BY_QUADRANT` (schism axis over natural enemy), `patronSecurity` scaling, the `common_rite` mirror
**SLOTS:** `{settlement}` `{counterpart}` `{faction}` `{temple}` `{creed}` `{reason}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[origination]` {settlement} names {counterpart} heretic and not merely foreign — the nearer creed is the worse offence, and the muster is called on it.
2. `[gate]` {settlement}'s own altars are contested, so {settlement} presses no claim on anyone: a house divided sends out no crusade.
3. `[answer]` {temple} preached the claim and {faction} took it up — {reason}; the banners went out {timeband_since}.
4. `[gate]` The claim is good and the term is better: {settlement} may abhor {counterpart}'s rite and may not march on it while the pact stands.
5. `[gate]` Neither town keeps a patron at all, and neither has ever pressed the other on it — an absence of faith is not a faith shared, and it is not a quarrel either.

**TELLING**
6. `[origination → answer → gate]` The quarrel at {temple} split one creed into two; {settlement} read {counterpart}'s half as apostasy rather than as a stranger's faith and pressed the claim; and the opener still weighed what a war would take before a single banner moved.
7. `[origination → succession]` {settlement} and {counterpart} have kept the same rite through {timeband_span}; the claim that would have been pressed against a stranger was never pressed here; and both towns have grown so used to the quiet that neither counts it as a policy.

**SUBHEADER**
8. `[plain]` {settlement} recorded a sacred claim against {counterpart} over {creed}; {settlement} has opened a war on that claim.

---

### JF-CPL-3a — WAR → POP
> *armies make refugees — the sack conserved, the flight scored, the exodus remembered (the Völkerwanderung)*

**Pair:** CPL-3 (§4) · **cause:** war · **effect:** populations · **cited waves:** WR-8, POP-3, POP-5a, POP-6
**SLOTS:** `{settlement}` `{counterpart}` `{route}` `{band}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[origination]` {band} left {settlement} on the road to {counterpart} the week the column came, and the register names where every one of them went.
2. `[carriage]` The column that reached {counterpart} brought the news of {settlement} with it, ahead of anyone who could correct it.
3. `[charge]` {settlement} is {band} smaller and not one soul is unaccounted for: taken, fled, or entered in the dead.
4. `[succession]` {timeband_since}, {counterpart} still calls that quarter by the name of the town it came from.
5. `[gate]` The town was sacked and the roll of its named people is unchanged — scattered to {band} roads, every one of them still somewhere.

**TELLING**
6. `[answer → origination → succession → charge]` {settlement} was put to the sack for {reason}; what escaped went in columns toward {counterpart}, choosing it for its quiet rather than for its bread; {counterpart} opened its gates; and {counterpart} has been short of both quiet and bread since.
7. `[origination → carriage → succession]` The flight out of {settlement} scattered along the {route}; the towns it passed had the story {timeband_since} any clerk wrote it down; and most of them still tell the version the road gave them.

**SUBHEADER**
8. `[plain]` {settlement} was sacked by {counterpart}; {band} of {settlement}'s people fled and are recorded arriving at named towns.

---

### JF-CPL-3b — POP → WAR
> *hungry realms make armies — pressure reaches motive and never incidence, and the court may be wrong about it*

**Pair:** CPL-3 (§4) · **cause:** populations · **effect:** war · **cited reads:** `perceivedScarcityOf` with the `mistaken` clause, the motive cap, the never-zero capability floor, the source-scanned anti-governor separation
**SLOTS:** `{settlement}` `{counterpart}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[belief]` {settlement}'s court says the realm has run out of room and has named {counterpart}'s fields as the answer; the survey the court did not read says otherwise.
2. `[gate]` {settlement} wants the war and cannot pay for it — the same hunger that made the motive took the muster.
3. `[origination]` A lean realm looks outward: {settlement} has entered land and grain against {counterpart}, and the reason on the entry is {reason}.
4. `[belief]` The pressure {settlement} marched on was believed and not measured, and the receipt says so in plain words.

**TELLING**
5. `[origination → belief → gate]` The lean years at {settlement} turned the court's talk toward {counterpart}'s valley; what carried the argument was the court's own picture of its plenty, and the court was wrong about it; and the muster it could actually raise was smaller than the ambition it had voted.
6. `[origination → charge → succession]` Pressure at {settlement} raised the appetite for a war and lowered the means for it in the same season; {timeband_since} the seat holds the grievance and no army; and a grievance with nothing behind it has a way of being remembered longer than one that got spent.

**SUBHEADER**
7. `[plain]` {settlement}'s court recorded population pressure as its reason for war against {counterpart}; the recorded pressure exceeds the measured pressure.

---

### JF-CPL-4a — WAR → INFO
> *the two liars whose war cannot end — the Blainey discount, and the army as rumor carrier*

**Pair:** CPL-4 (§4) · **cause:** war · **effect:** information · **cited reads:** the Blainey discount (pinned), the deterrent garrison bluff and its exposure blowback, front re-pricing of in-flight rumor
**SLOTS:** `{settlement}` `{counterpart}` `{route}` `{timeband_since}` `{timeband_age}`

**HEADLINE**
1. `[charge]` {settlement} and {counterpart} have each been caught out once, and their war is running longer for it — neither can spend a word the other will bank.
2. `[carriage]` The army that came down the {route} left the season's news in every taproom it drank at, and half of it was wrong.
3. `[charge]` {settlement}'s garrison proved thinner than {settlement} had said; the walls held and the credit did not.
4. `[succession]` The front has closed the {route}, and what {counterpart} knows of {settlement} is {timeband_age}, carried by whoever still risks the crossing.
5. `[gate]` Neither {settlement} nor {counterpart} has ever been caught out, so neither discounts the other — the first honest offer was read as honest, and the war ended on it.

**TELLING**
6. `[answer → charge → succession]` {settlement} inflated its garrison to keep {counterpart} off the walls; the bluff was called {timeband_since}; and every offer {settlement} has made at the table since is read at a discount, the honest ones included.
7. `[carriage → belief → succession]` The column carried word of {settlement}'s defeat to {counterpart} before any courier could; {counterpart} acted on it while it was still the only account there was; and the unpicking of that answer took longer than the battle had.

**SUBHEADER**
8. `[plain]` {settlement}'s claimed garrison strength was exposed as false; {settlement}'s credibility has fallen and its talks with {counterpart} are running longer.

---

### JF-CPL-4b — INFO → WAR
> *a war started by an edited sentence — the belief-wrapped chooser marching on a misjudgment (the Ems Dispatch)*

**Pair:** CPL-4 (§4) · **cause:** information · **effect:** war · **cited reads:** the belief-wrapped chooser end to end, `belief_misjudgment` minting on selected offensive moves, IN-2's lure, the forged-instrument boundary (J-CPL-8: lies move beliefs, never mint an order)
**SLOTS:** `{settlement}` `{counterpart}` `{npc}`

**HEADLINE**
1. `[belief]` {settlement} marches on {counterpart} believing the walls are thin; the walls are not, and the column is already on the road.
2. `[origination]` A sentence was trimmed before it was carried, and {settlement} read what arrived as an insult it could not let stand.
3. `[gate]` The story was checked against what {settlement}'s own people had seen and it died there — no muster, and a bill owing at the house that placed it.
4. `[belief]` `[dm-only]` {npc} sold {settlement} a weakness that was never at {counterpart}, and {settlement} has bought it with soldiers.

**TELLING**
5. `[origination → belief → answer]` A sentence left {counterpart}'s court shorter than it had been written; {settlement} read the version that arrived and could see no reading of it but an insult; and the war entered against {counterpart} since stands in the record with a cause no clerk at either end can produce.
6. `[belief → succession → charge]` {settlement} chose its target off a believed weakness at {counterpart}; the column found the ground held; and what {settlement} has to show for the season is a fresh grievance on the other side and a story it can no longer disown.

**SUBHEADER**
7. `[plain]` {settlement} opened a war against {counterpart} on a belief its own records now contradict.

---

### JF-CPL-5a — WAR → GRAMMAR
> *the dictated peace — the victor drafts unilaterally from a believed margin at the one mint (Versailles)*

**Pair:** CPL-5 (§4) · **cause:** war · **effect:** grammar · **cited reads:** the war-exit sole mint path, unilateral drafting with no counter-offer machinery, `believedMarginAtSignature` persisting on the record, the clean-exit floor
**SLOTS:** `{settlement}` `{counterpart}` `{war}` `{term}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[origination]` {settlement} wrote the peace and {counterpart} signed it; there was no second draft, and the record does not pretend there was.
2. `[belief]` The terms {settlement} took were cut to the margin {settlement} believed it held — the belief is on the document beside the terms.
3. `[gate]` Neither side could show a clear win, so the {war} ended with nothing written: no tribute, no passage, no term at all.
4. `[instrument]` What {settlement} could not take on the field it has taken in {term}, and {counterpart} will be delivering it {timeband_since}.

**TELLING**
5. `[answer → origination → instrument]` {counterpart} sued for terms after the season turned against it; {settlement} drafted alone, out of the strength it thought it had; and the document that left that room is the only instrument standing between these two towns.
6. `[origination → charge → succession]` The peace was written at {settlement} in one hand; the tribute it set has been carried by {counterpart} through {timeband_span}; and the clerks who file the receipts stopped noting anything unusual about the arrangement long ago.

**SUBHEADER**
7. `[plain]` {settlement} imposed peace terms on {counterpart} at the end of the {war}; the terms were drafted by {settlement} alone.

---

### JF-CPL-5b — GRAMMAR → WAR
> *the peace that pre-paid the next war — enforcement bites, strain breeds revanchism, the default is a casus*

**Pair:** CPL-5 (§4) · **cause:** grammar · **effect:** war · **cited reads:** enforcement's war block reaching the one opener, typed tribute strain feeding revanchism, the detected-default casus, expiry lifting every effect in one tick
**SLOTS:** `{settlement}` `{counterpart}` `{term}` `{timeband_span}`

**HEADLINE**
1. `[gate]` {settlement} has the grievance and the muster and cannot move: the {term} {counterpart} holds forbids it while it stands.
2. `[charge]` {counterpart} has paid {settlement} on time and in full through {timeband_span} — and the paying on time is now the best argument at {counterpart} for stopping.
3. `[answer]` {counterpart} missed the delivery and {settlement} has entered it as cause — a defaulted peace angers exactly as a broken one does.
4. `[succession]` The pact reached its week and lapsed, and every hold it carried came off {settlement} in the same breath.

**TELLING**
5. `[instrument → charge → origination → answer]` The terms {settlement} set at the war's end were heavier than {counterpart} could carry; the strain was entered season by season against the seat that had signed; the party that grew out of that strain took the hall; and the delivery it has now refused is the one the {term} was built on.
6. `[instrument → gate → succession]` {settlement} and {counterpart} have been at each other's throats through {timeband_span} and have not once come to arms; the block held every time the opener asked; and each refusal is on the record with the term that made it.

**SUBHEADER**
7. `[plain]` {counterpart} defaulted on a term of its peace with {settlement}; {settlement} has recorded the default as cause for war.

---

### JF-CPL-6a — WAR → INTERIOR
> *the war that cost the seat — sentiment tilts the coup hold, the climb-down charges legitimacy (February 1917)*

**Pair:** CPL-6 (§4) · **cause:** war · **effect:** interior · **cited reads:** war sentiment weighting the coup hold, reinforcement cost biting public legitimacy, climb-downs landing legitimacy and credibility charges, `legitimacy_hunger`, and the built pin that a secure seat survives an unpopular war
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{faction}` `{timeband_since}`

**HEADLINE**
1. `[charge]` Another levy for a war {settlement} is not winning, and the hall is counting heads differently than it did {timeband_since}.
2. `[gate]` The war is hated and the seat is secure: {faction} has the grievance and not the votes, and everyone in the hall can count.
3. `[answer]` {settlement} climbed down at {counterpart}'s gate rather than spend another season, and the climb-down is what the assembly is arguing about.
4. `[origination]` {npc} came to the seat weak and has found a war to be strong in — {counterpart} is the answer to a question nobody at home had asked.

**TELLING**
5. `[charge → succession → answer]` The reinforcements {settlement} sent were paid for out of the seat's own standing; {timeband_since} the hall would not hear the war spoken of kindly; and when {faction} moved, the war was the thing it moved on.
6. `[answer → charge → gate]` {settlement}'s seat took the terms rather than the siege; the town read that as a loss and the record charges the seat for it; and the seat is sitting yet, because a legitimate hall can survive an unpopular peace.

**SUBHEADER**
7. `[plain]` {settlement}'s war with {counterpart} has lowered the seat's public legitimacy; {faction} has moved against the seat.

---

### JF-CPL-6b — INTERIOR → WAR
> *the interior replaces the seat and re-reads the war — the two books, the veto, the war party inside the walls*

**Pair:** CPL-6 (§4) · **cause:** interior · **effect:** war · **cited waves:** WR-5 (the two books, refusal priced, the bidirectional re-read), INT-1, INT-3, INT-4; the dark treaty-burdened war party and the commerce bloc's peace pull
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{faction}` `{house}` `{term}` `{reason}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[answer]` The new hall at {settlement} has read the war again and come to another answer — {reason}; what {settlement} refused last season it now offers.
2. `[origination]` {faction} was made by the tribute and means to unmake it: the war party at {settlement} sits inside {settlement}'s own walls.
3. `[gate]` The peace {npc} carried home died in {settlement}'s hall — the bloc that took the vote had never wanted it, and said so on the record.
4. `[charge]` {house} wants the road open and has spent its standing keeping {settlement} out of the war.

**TELLING**
5. `[origination → answer → succession]` The strain of {counterpart}'s {term} made a party at {settlement} that had not existed before the signing; that party took the hall {timeband_since}; and the first use it made of the hall was to read the war its predecessors had ended.
6. `[answer → gate → charge]` {settlement}'s new seat came in on the promise of peace and found the hall against it; the vote went the other way; and the seat has spent {timeband_span} prosecuting a war it argued against in public.

**SUBHEADER**
7. `[plain]` {settlement}'s seat changed; the new seat has reversed {settlement}'s standing decision on the war with {counterpart}.

---

### JF-CPL-7a — TRADE → FAITH
> *money and mitres in one ledger — the trade edge as conversion carrier and the credit that buys standing (the Fugger loan)*

**Pair:** CPL-7 (§4) · **cause:** trade · **effect:** faith · **cited reads:** trade edges as conversion carriers, temple-mediated relief warming piety, WF-7's tithe (FAITH-owned end to end), TR-6's moral drift on profiteering, and the pin that the stain rides receipts and not truth
**SLOTS:** `{settlement}` `{counterpart}` `{house}` `{temple}` `{creed}` `{good}` `{route}` `{reason}` `{timeband_span}`

**HEADLINE**
1. `[carriage]` {creed} came to {counterpart} the way everything comes — down the {route}, with the {good}, in the hands of people nobody had sent to preach.
2. `[origination]` {house} paid for the grain in the hungry season and is being thanked from {temple}'s altar for it, which was rather the point.
3. `[charge]` {house} has the fortune and the stain together: {temple} took the gift, and the market has not once stopped saying where it came from.
4. `[gate]` {temple} sent {house}'s endowment back down the road it came up — {reason}, and the chapter is said to have voted it twice.
5. `[gate]` Nobody at {counterpart} ever learned how the money was made, so nothing was ever held against it — there is no ledger of sins that keeps itself.

**TELLING**
6. `[carriage → origination → succession]` The {good} road between {settlement} and {counterpart} carried more than cargo; {creed} had a house at {counterpart} within {timeband_span}; and the older observance keeps its feasts on a narrower street now.
7. `[origination → charge → answer]` {house} bought cheap while {settlement} went hungry and gave a share of the profit to {temple}; the gift bought standing in the chapter; and the reckoning entered against {house} has not been struck off for it.

**SUBHEADER**
8. `[plain]` {house} of {settlement} funded relief through {temple}; {house}'s standing with {temple}'s faction has risen.

---

### JF-CPL-7b — FAITH → TRADE
> *the conscience embargo — abhorrence prices the trade, and contraband is relational*

**Pair:** CPL-7 (§4) · **cause:** faith · **effect:** trade · **cited reads:** tolerance falling toward the embargo floor with automatic exit when the offending institution closes, the relational contraband table, moral institution pressure, and the pin that a principled town still eats
**SLOTS:** `{settlement}` `{counterpart}` `{temple}` `{good}` `{reason}` `{timeband_span}`

**HEADLINE**
1. `[answer]` {settlement} will not trade with {counterpart} while that house stands — {reason}; the {good} still moves, thinly, by people who do not discuss it.
2. `[gate]` The {good} is contraband at {settlement}'s gate and lawful at {counterpart}'s, and the whole of the smuggler's living lies in the difference.
3. `[succession]` {counterpart} closed the house {settlement} objected to, and the embargo lifted itself — no envoy, no term, no ceremony.
4. `[charge]` {settlement} has held the principle through {timeband_span} and paid for it in {good} it could have had cheap.
5. `[gate]` The abhorrence is at its worst and the carts still come: a principled town still eats, and the ledger has a floor under it.

**TELLING**
6. `[origination → answer → gate]` {temple}'s conviction at {settlement} entered {counterpart}'s house as an abhorrence; the trade between them fell to what conscience would bear; and it did not fall to nothing, because nothing was never on the table.
7. `[answer → succession → charge]` {settlement}'s embargo pushed the {good} onto the smugglers' lanes; the seizures at the gates rose with it; and the trade that stayed lawful is a different trade in different hands.

**SUBHEADER**
8. `[plain]` {settlement} reduced trade with {counterpart} over an institution at {counterpart}; the {good} trade between them has fallen.

---

### JF-CPL-8a — TRADE → POP
> *bread decides where people can live — the import arm, the artery band, the siege by starvation (the Baltic grain fleets)*

**Pair:** CPL-8 (§4) · **cause:** trade · **effect:** populations · **cited reads:** the food import arm with its artery band, prosperity pull off causal economic capacity, the capped relief draw, the built pin that cutting the last artery leaves a trickle and never zero, and the hungry-gap burial line
**SLOTS:** `{settlement}` `{counterpart}` `{good}` `{route}` `{band}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[gate]` {settlement} eats what the {route} brings and the {route} has been cut; the granary word this season is the word that binds.
2. `[succession]` The last artery into {settlement} is gone and a few carts still come — nobody's orders, nobody's road, and not nothing.
3. `[origination]` {counterpart} has surplus and a road, and {band} have walked to it {timeband_since}.
4. `[charge]` {settlement} is burying more than it births, and the reason entered on the roll is bread and not sickness.

**TELLING**
5. `[answer → gate → charge]` {counterpart} took the {good} road above {settlement} and held it; the import at {settlement} fell a band, and then another; and the gap in {settlement}'s register is that same arithmetic told again in burials.
6. `[origination → succession → gate]` The surplus at {counterpart} drew columns off three roads inside {timeband_span}; the town took in what it had room for; and the rest were turned back at the landing with the reason written down and given to them.

**SUBHEADER**
7. `[plain]` {settlement}'s grain imports fell after the {route} was interdicted; deaths from hunger at {settlement} have risen.

---

### JF-CPL-8b — POP → TRADE
> *mouths are the demand side — columns become flows and the boomtown earns its centrality*

**Pair:** CPL-8 (§4) · **cause:** populations · **effect:** trade · **cited reads:** migration columns counted as flows in the population class, population as the demand side of every chain, boomtown upswing off sustained surplus and earned centrality, and the counterforce that the town which cannot feed its arrivals shrinks by the same read that drew them
**SLOTS:** `{settlement}` `{good}` `{route}` `{band}` `{reason}` `{timeband_span}`

**HEADLINE**
1. `[origination]` {settlement} has {band} more mouths than it had last year, and the {good} carts are coming twice as often to meet them.
2. `[succession]` The column that came up the {route} is a trade flow now — the same feet, entered in a different book.
3. `[charge]` {settlement} grew faster than its granary and is shrinking again: the same count that drew them is sending them on.
4. `[origination]` {settlement} sits where the roads meet and did not always; the traffic made the crossing, and not the other way about.

**TELLING**
5. `[origination → succession → succession]` {settlement} was wiped out by the {reason} that followed the famine year; trade withered, and the routes turned elsewhere. *(the owner's TELLING-register exemplar — VERBATIM but for the slot law: the settlement name and the typed cause are slotted per R-CAU-E and R-CPL-F, and nothing else is altered. Restored on the voice pass: the draft had softened "the famine year" to "the hungry year" and re-cadenced the tail, neither of which any law required, and an exemplar that is the register's calibration cannot be paraphrased for taste. Per R-CAU-C the mold renders only over a chain whose head receipt is the hunger year it names.)*
6. `[origination → succession → charge]` The arrivals at {settlement} put a demand on the {good} the old road could not carry; new carriers took the run inside {timeband_span}; and {settlement} is a market town now, which nobody there set out to build.
7. `[belief → origination → gate]` What the road said of {settlement}'s plenty brought the columns; the plenty was real and smaller than the saying; and those who came late are entered as unplaced, with the reason given to them honestly.

**SUBHEADER**
8. `[plain]` {settlement}'s population rose; the volume of {good} moving to {settlement} on the {route} has risen with it.

---

### JF-CPL-9a — TRADE → INFO
> *the caravan as witness — every arrival corrects the say, and the stamp ladder prices the hop*

**Pair:** CPL-9 (§4) · **cause:** trade · **effect:** information · **cited reads:** trade carriers moving rumor, the brokerage stamp ladder whose hop count predicts truth (measured), and arrivals as independent witnesses against a rumor
**SLOTS:** `{settlement}` `{counterpart}` `{house}` `{good}` `{route}` `{band}` `{timeband_age}`

**HEADLINE**
1. `[carriage]` What {settlement} knows of {counterpart} came in with the {good} and is exactly as old as the journey.
2. `[gate]` The caravan came through the gate and the story died there: {counterpart} is not starving, and {band} carts can say so.
3. `[charge]` The word reached {settlement} through too many hands to be worth much, and the brokers priced it for what it was.
4. `[succession]` {settlement} has heard nothing off the {route} since the season turned and is deciding on news that is {timeband_age}.

**TELLING**
5. `[carriage → succession → gate]` The factor's letter went up the {route} with the {good}; it was current when it left {counterpart} and old when it arrived; and {house}, which acted on it, has learned what a hop costs.
6. `[origination → carriage → gate]` The say at {settlement} was that {counterpart}'s harvest had failed; the carts that came in after it carried grain and contradiction together; and the say did not survive the third arrival.

**SUBHEADER**
7. `[plain]` A caravan arrived at {settlement} from {counterpart}; its report contradicts the rumour {settlement} had been acting on.

---

### JF-CPL-9b — INFO → TRADE
> *runs started by whispered association — believed scarcity, the frightened endpoint, the corner (the Panic of 1907)*

**Pair:** CPL-9 (§4) · **cause:** information · **effect:** trade · **cited reads:** dispatch refusal reading believed danger and never truth, charter danger scored off the known picture, SP-2's banded believed scarcity, SP-5's house credibility (signature story 3), and the pin that a planted scarcity contradicted by visible arrivals dies and charges the planter
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{faction}` `{house}` `{good}` `{timeband_since}`

**HEADLINE**
1. `[belief]` Nobody will take a cart to {counterpart}: the siege there lifted {timeband_since}, and the road has not been told.
2. `[belief]` They say the {good} is dear in the east, and the carts have all turned east on the saying.
3. `[charge]` {house} could not pay what it never owed — the whisper was enough, and the doors are shut.
4. `[gate]` The rumour ran at {settlement} and moved nothing: {house} is of confirmed record, and the tavern does not outrank the book.
5. `[origination]` `[dm-only]` {npc} bought the {good} up before the word arrived, and the word arrived on schedule.

**TELLING**
6. `[belief → answer → charge]` The word at {settlement} was that {house} was over-extended; the depositors came for their credit before anyone had checked it; and the house that was sound on the morning of the telling was not sound by the evening of it.
7. `[origination → belief → gate]` `[dm-only]` A scarcity was planted at {settlement} to move the {good}; the arrivals said otherwise all season and said it plainly; and {faction}, which placed it, is paying the stamp for a story the carts refuted.

**SUBHEADER**
8. `[plain]` {settlement}'s merchants declined to dispatch to {counterpart} on a rumour of danger; the recorded danger at {counterpart} has ended.

---

### JF-CPL-10a — TRADE → GRAMMAR
> *wool for wine — the trade-demand crossing that proposes a pact between courts at peace (Methuen)*

**Pair:** CPL-10 (§4) · **cause:** trade · **effect:** grammar · **cited waves:** SP-3, GR-2 (peacetime formation off the closed triggers), GR-3 (the canonical term catalog), TR-5 (the consuming pact lane); chair ruling R1 (one instrument per pair; reciprocity as directional terms) and the receipted no-deal
**SLOTS:** `{settlement}` `{counterpart}` `{good}` `{reason}`

**HEADLINE**
1. `[origination]` {settlement} needs what {counterpart} has too much of, and for once neither of them had to lose a war to say so.
2. `[instrument]` {settlement} sends {good} and {counterpart} sends its own, written into the one document with a direction on every line.
3. `[gate]` The pact was proposed and neither court's own reckoning cleared it; the refusal is on the record, with what each side thought it was worth.
4. `[answer]` {settlement} came to {counterpart} with a draft instead of a grievance — {reason}; the two courts are at peace and mean to stay so.

**TELLING**
5. `[belief → answer → instrument]` {settlement}'s want of {good} crossed the line the clerks watch; the seat sent to {counterpart} on the strength of it; and what came back is a term added to the one instrument these two towns keep between them.
6. `[origination → instrument → gate]` The demand at {settlement} argued for a second security term as well; the stacking would not carry it beside the one already standing; and the refusal was written down with its reason rather than quietly dropped.

**SUBHEADER**
7. `[plain]` {settlement} and {counterpart}, at peace, signed a term exchanging {good}; the term was added to their standing instrument.

---

### JF-CPL-10b — GRAMMAR → TRADE
> *the term that binds a market — and the defaulted grain pact that angers like a defaulted peace*

**Pair:** CPL-10 (§4) · **cause:** grammar · **effect:** trade · **cited reads:** compliance under fog transferring whole (the unwatched default ghosting as honored), TR-1's severance-and-partnership mirrors, the reserve-floor law (impoverish, never starve out), and GR-0's expiry receipt
**SLOTS:** `{settlement}` `{counterpart}` `{good}` `{timeband_span}`

**HEADLINE**
1. `[instrument]` The {good} leaves {settlement} because a term says it must, and the market has arranged itself around the saying.
2. `[answer]` {counterpart} stopped the deliveries and {settlement} has entered it as a severance — the grievance is commercial, and it is as real as any other.
3. `[gate]` {settlement} owes the {good} and is short of it; the term takes what stands above the floor and not one measure further.
4. `[charge]` Nobody was watching the crossing, so {counterpart}'s default is entered as compliance — and {settlement} is the poorer for a fiction that suits everybody.

**TELLING**
5. `[instrument → charge → answer]` The grain term bound {counterpart} to {settlement} through {timeband_span}; the deliveries thinned and then stopped; and the cause {settlement} has entered against {counterpart} has exactly the shape a broken peace would have made.
6. `[instrument → succession → gate]` The term ran its full course and expired on its week; the {good} kept moving out of habit and nothing else; and then the carters went where the terms were.

**SUBHEADER**
7. `[plain]` {counterpart} failed to deliver {good} owed to {settlement} under their standing term; {settlement} has recorded a commercial grievance.

---
## §1.2 — THE FAITH, POPULATION AND INFORMATION QUARTER (CPL-11 … CPL-20, both directions)

> *trade × interior · faith × {pop, info, grammar, interior} · pop × {info, grammar, interior} · info × {grammar, interior}*

Twenty families: every direction of the ten pairs DESIGN_FP_COUPLINGS §4 walks
after the war and trade blocks — trade × interior, faith × {pop, info, grammar,
interior}, pop × {info, grammar, interior}, and info × {grammar, interior}. Each
family cites the pair section its entailment comes from; nothing below asserts a
read that section does not carry. §0 governs this block whole — its three
registers, its three laws, its eight edge types, its slot table and its
resolutions are inherited and not restated.

---

### JF-CPL-11a — TRADE → INTERIOR
> *the house that got rich off the route and then bought the seat (the Medici)*

**Pair:** CPL-11 (§4) · **cause:** trade · **effect:** interior · **cited waves + reads:** TR-2 (THE HOUSE — books, appetite, named factor NPCs), the merchant seat's war-averse objective, the commerce bloc's dark damp on deploy and lift on sue-for-peace, faction competition contesting institution foundings, the ruin ending's mandatory interior consequences, and the declared-empty that capture rides the EXISTING criminal-capture and corruption webs (no engine-side bribery verb, no route ownership)
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{faction}` `{house}` `{good}` `{route}` `{reason}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[origination]` {house} made its money on the {good} road and has a hand on {settlement}'s council now — the two are one thing, and the market says so without lowering its voice.
2. `[gate]` The commerce bloc spoke against the muster and the muster went out anyway: {house} is rich at {settlement} and it is not the hall.
3. `[charge]` {house}'s venture failed on the {route} and {settlement}'s seat is paying for the failing — the bloc that backed it is short a voice, and the hall is being asked who chose.
4. `[answer]` {faction} moved to found at {settlement} and {house} paid for the other side of the argument — {reason}; the charter carries whoever outlasted whom.
5. `[origination]` `[dm-only]` {npc} keeps {house}'s books and {settlement}'s seal in the same room, and nothing on {settlement}'s own record says so.

**TELLING**
6. `[origination → answer → gate]` {house} carried the {good} on the {route} through {timeband_span} and grew heavy on the carrying; the seat at {settlement} began taking the house's view of every quarrel that touched that road; and when the muster against {counterpart} was called regardless, {settlement}'s hall found out what a bloc is actually worth.
7. `[origination → charge → succession]` The venture {house} priced on a market it believed went wrong on the {route}; the ruin stands in the house's own book and in the seat's standing beside it; and the bloc that was the countinghouse's voice at {settlement} has been re-sorting itself {timeband_since}.
8. `[answer → gate]` `[dm-only]` {house} bought what it needed at {settlement} through the channels such things go through; the hall's decision on the {good} came out as the books wanted it; and {settlement}'s own record shows a council that deliberated and agreed. *(Player-side this chain begins at the deliberation and reads as a council that decided — R-CPL-A's byte-identity discipline. No public mold in this family gestures at a purchase.)*

**SUBHEADER**
9. `[plain]` {house}, enriched by the {good} trade on the {route}, has gained influence over {settlement}'s seat; {settlement}'s commerce bloc opposed the muster against {counterpart}.

---

### JF-CPL-11b — INTERIOR → TRADE
> *the seat's books and the crowd's grievance price the house — the commerce bloc and the countinghouse's counterweight*

**Pair:** CPL-11 (§4) · **cause:** interior · **effect:** trade · **cited waves + reads:** INT-1's `booksOf` as the one seatBooks writer with TRADE's venture-appetite consumption RESERVED at TR-7 (behind `seatBooksEnabled` and `venturesEnabled`, colour-only, absent-not-zero until INT-1 lands), the commons' grievance weight on seated corruption (the crowd as the countinghouse's counterweight), INT-2's positions loading the chooser with a house-aligned bloc's foreign position, and SP-4's law that no courage ratchets — a burned appetite does not come back braver
**SLOTS:** `{settlement}` `{counterpart}` `{house}` `{good}` `{timeband_since}`

**HEADLINE**
1. `[answer]` {settlement}'s seat is short and {house} has taken the seat's own accounting into its reckoning — the venture that was on the table is off it.
2. `[charge]` The crowd at {settlement} names its seat bought and {house} is what it names — the grievance is entered against the hall, and the countinghouse is what the hall is made of now.
3. `[answer]` {settlement}'s bloc for {counterpart} carried the vote and the embargo died with it: {house}'s partner is {house}'s policy, and the hall said so out loud.
4. `[gate]` The seat's books are the seat's own business; {house} priced its venture on the market and on nothing else, because nothing else was open to it.
5. `[charge]` {house} lost on the {good} and has not gone back to it — the appetite that was burned did not come back braver.

**TELLING**
6. `[answer → charge → gate]` The hall at {settlement} put its weight behind {house}'s partner at {counterpart}; the commons entered the whole arrangement as seated corruption and the seat's standing fell for it; and the bloc that had been the house's voice found it could no longer carry a vote it used to carry easily.
7. `[origination → answer → succession]` The seat's shortfall at {settlement} was known inside the hall {timeband_since}; {house} trimmed its ventures to what a poor patron could underwrite; and the {good} lane that used to run on the house's credit runs on somebody else's now.

**SUBHEADER**
8. `[plain]` {settlement}'s seat recorded a shortfall and its commons recorded a grievance of seated corruption; {house} has reduced its ventures at {settlement}.

---

### JF-CPL-12a — FAITH → POP
> *a creed suppressed is a town emptied — and the pilgrim road that feeds two economies (the Huguenot flight)*

**Pair:** CPL-12 (§4) · **cause:** faith · **effect:** populations · **cited waves + reads:** WF-5b's covert congregation with its exposure-or-emigration arm, WF-2/WF-2a's pilgrims as SP-1 movers with the MANDATORY return leg and the shrine economy, POP-3's departure memory carrying the rite at both ends, POP-1's belief-side refuge attractiveness, and the negative pin that a suppression with NO covert congregation seeds no flight
**SLOTS:** `{settlement}` `{counterpart}` `{temple}` `{creed}` `{route}` `{band}` `{timeband_since}`

**HEADLINE**
1. `[answer]` {settlement} put {creed} down and {band} have gone out the gate for it — the reason is entered, and it is the same reason at both ends of the road.
2. `[carriage]` The pilgrim season has opened and the {route} to {temple} is full again: two towns eat off that walking, and neither of them prays for the other.
3. `[gate]` {creed} was suppressed at {settlement} and nobody left — there was no house of it left to go under the floor, and a rite with no keepers has nobody to flee.
4. `[belief]` {counterpart} lets {creed} keep its feasts, and the word of that has been worth more to {counterpart} than any charter: the persecuted go where the saying says they may.
5. `[succession]` The generation that left {settlement} keeps the rite {settlement} no longer keeps — the old country is a memory at one end and a hole in the roll at the other.

**TELLING**
6. `[answer → origination → carriage]` {settlement}'s seat forbade {creed} and the congregation went under the floor rather than out the gate; the exposure came {timeband_since} and the choice narrowed to the one choice; and the column that left carried the rite to {counterpart} entire, feast days and grievance together.
7. `[carriage → succession → gate]` The pilgrims went up the {route} to {temple} at the season and the shrine towns counted the takings; the walkers came home when the season closed, every one of them entered back against the roll they left; and {settlement} is no smaller for the walking — a pilgrimage empties a town for a season and a flight empties it for good, and the roll knows which this was.
8. `[belief → origination → gate]` What was said of {counterpart}'s tolerance ran well ahead of anybody's feet; the persecuted at {settlement} chose it over nearer roads on the strength of the saying; and those who arrived past {counterpart}'s room were turned at the landing with the reason handed to them, faith or no faith.

**SUBHEADER**
9. `[plain]` {settlement} suppressed {creed}; {band} departed {settlement} for {counterpart}, which permits {creed}.

---

### JF-CPL-12b — POP → FAITH
> *culture travels with population — the rite adopted from the influx, the crisis that converts in the cracks*

**Pair:** CPL-12 (§4) · **cause:** populations · **effect:** faith · **cited reads:** the traditions adoption threshold (sustained cumulative influx from ONE origin over a rolling window plants an `adoptedFrom` rite), crisis conversion's receptivity across the disorder contexts, the sink's revival arm (crisis calls the faithful home), cultural affinity in the destination choice, and the two counterforces — adoption is tier-capped and threshold-gated (a trickle plants nothing) and the safe town's comfort drift empties the pews the refugees filled
**SLOTS:** `{settlement}` `{counterpart}` `{temple}` `{creed}` `{calamity}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[origination]` {settlement} keeps a feast it did not keep {timeband_since}, and the rite list says plainly where it came from: it came with the people.
2. `[gate]` {counterpart}'s people have been arriving at {settlement} through {timeband_span} and {settlement}'s calendar is unchanged — a trickle plants nothing, and the threshold is the whole of the mercy.
3. `[origination]` The {calamity} filled {temple} at {settlement} — the cracks are where a creed gets in, and the priests are honest enough to name which year it was.
4. `[charge]` {settlement} took in the frightened and {settlement} is comfortable now: the same ease that made it a refuge is emptying the pews the refugees filled.
5. `[belief]` The persecuted of {creed} came to {settlement} because {settlement}'s people were near enough kin to be trusted, and the rite came in with the trust.

**TELLING**
6. `[carriage → origination → gate]` Column after column came up from {counterpart} to {settlement} across {timeband_span}; the influx crossed the line the clerks watch and {settlement}'s rite list gained a row naming {counterpart} as its origin; and no smaller flow before it had ever moved that list at all.
7. `[origination → succession → charge]` The {calamity} at {settlement} put people in {temple} who had never been there; the revival held as long as the disorder held; and when the town was easy again the same drift that comforts it took the congregation back down, which {temple}'s own ledger records without complaint.

**SUBHEADER**
8. `[plain]` Sustained arrivals at {settlement} from {counterpart} passed the adoption threshold; {settlement} has adopted a rite recorded as originating at {counterpart}.

---

### JF-CPL-13a — FAITH → INFO
> *the rite read across the border — believed devotion, and the neighbour's picture gone stale*

**Pair:** CPL-13 (§4) · **cause:** faith · **effect:** information · **cited reads:** `beliefAxes`' `faithLabel`/`observanceLabel` carrying a STALE belief about a neighbour's rite, the belief-divergence envelope measuring faith mismatch, SP-2's believed devotion crossing borders at news speed, IN-2's planted devotion as the lure pointed at the pulpit ahead of a sacred-claim press, and the ruled refile of `belief_misjudgment` to the KNOWLEDGE desk
**SLOTS:** `{settlement}` `{counterpart}` `{faction}` `{creed}` `{route}` `{timeband_since}`

**HEADLINE**
1. `[belief]` {settlement} still holds {counterpart} for a house of {creed}, and {counterpart} has not kept that rite {timeband_since}.
2. `[belief]` The word at {settlement} is that {counterpart}'s god has gone quiet on it — nobody at {settlement} has been to see, and the word is being acted on regardless.
3. `[carriage]` A legate came back from {counterpart} and {settlement}'s picture of that altar is current again, which it had not been.
4. `[gate]` {settlement} and {counterpart} keep each other's calendars correctly and always have: the road between them is short, and a short road is the cheapest truth there is.
5. `[origination]` `[dm-only]` {faction} put it about at {settlement} that {counterpart}'s devotion has failed, and the claim {faction} means to press wants exactly that ground prepared.

**TELLING**
6. `[belief → answer → charge]` {settlement}'s record of observance at {counterpart} went stale the season the patron changed; the seat pressed a claim written against a rite {counterpart} no longer kept; and the misjudgment is entered at {settlement}'s own knowledge desk, where the correction will be filed beside it.
7. `[origination → carriage → gate]` `[dm-only]` The failed devotion was planted at {settlement} to soften the ground; the pilgrims coming back down the {route} contradicted it plainly and went on contradicting it; and the claim was never pressed, because the ground it wanted was never soft. *(Player-side the chain begins at the say and ends at the unpressed claim; nothing in the public telling names a planter.)*

**SUBHEADER**
8. `[plain]` {settlement}'s recorded belief about observance at {counterpart} is out of date; {counterpart} has changed its rite.

---

### JF-CPL-13b — INFO → FAITH
> *a calamity read as wrath, and the prophecy that failed (the flagellants of the plague year)*

**Pair:** CPL-13 (§4) · **cause:** information · **effect:** faith · **cited waves + reads:** WF-4's OMEN READS as belief writes with the failed-prophecy ledger as the counterforce, the piety stock's loss-aversion (it erodes faster on conduct drift than it builds, so a wrath-reading spends a real stock), the local-lane clock, Law One absolute (the engine models the READING and never confirms the wrath), and the two negative pins — a deity-free town reads no omen, and a correct-by-luck prophecy still decays on the same ledger
**SLOTS:** `{settlement}` `{counterpart}` `{temple}` `{calamity}` `{route}` `{timeband_span}`

**HEADLINE**
1. `[belief]` The priests at {settlement} read the {calamity} as wrath, and the granaries emptied all the same.
2. `[gate]` {settlement} keeps no patron and read nothing into the {calamity} at all — an absence of faith is not a lens, and the town buried its dead without an explanation.
3. `[charge]` {temple} at {settlement} named the season and the season came and went: the reading is on the ledger, and so is what it cost the readers.
4. `[belief]` What {settlement} believes of the {calamity} it has from {temple} and from nowhere else, and {temple} has entered the reading as its own.
5. `[succession]` {temple}'s reading of the {calamity} happened to fit what followed, and the ledger does not grade it any differently for that.

**TELLING**
6. `[belief → answer → charge]` {temple} read the {calamity} at {settlement} as a judgment and said so from the step; the town fasted and processed on the strength of it through {timeband_span}; and when the dying went on unchanged, the reading went onto {temple}'s own failed ledger with the reader's name still on it.
7. `[carriage → belief → gate]` The word of the {calamity} at {counterpart} came up the {route} ahead of any traveller who had seen it; {settlement}'s priests read a judgment into a town none of them had ever visited; and {counterpart}, which keeps no patron at all, took the same news as weather.

**SUBHEADER**
8. `[plain]` {temple} at {settlement} interpreted the {calamity} as divine judgment; the interpretation is recorded as a belief held at {settlement}.

---

### JF-CPL-14a — FAITH → GRAMMAR
> *the church as the peace's grammar, not its subject — the faith-brother broker and the communion trigger (the Truce of God)*

**Pair:** CPL-14 (§4) · **cause:** faith · **effect:** grammar · **cited waves + reads:** mediation reading the mediator's faith quadrant toward BOTH parties (the faith-brother broker), `common_rite` as a scored peace REASON deliberately distinct from mediation, GR-2's `faith_communion` typed proposal trigger, GR-6's generalized mediation with the temple arm explicit, GR-0's expiry receipt covering faith compacts for free, the two-sided trust accrual (a failed mediation accrues nothing), and the declared-empty that a temple is a broker and a beneficiary, never a signatory
**SLOTS:** `{settlement}` `{counterpart}` `{third_party}` `{temple}` `{reason}`

**HEADLINE**
1. `[instrument]` {settlement} and {counterpart} came to terms through {third_party}, which keeps the rite both of them keep — the broker was chosen for its altar and not for its army.
2. `[origination]` {settlement} and {counterpart} keep the same feast, and the peace they signed cites it: the shared floor was reason enough without anybody standing between.
3. `[answer]` {settlement} has sent {counterpart} a draft off {temple}'s communion across the line — {reason}; the draft names a feast where such papers name a wrong.
4. `[gate]` {third_party} offered and neither court would have it: the broker kept the same rite as one side and the wrong one as the other, and cross-pressure that runs one way is no pressure at all.
5. `[charge]` {third_party} brokered nothing at {settlement} and is owed nothing for it — a failed mediation accrues no trust at either table, which is the part brokers like least about the arrangement.

**TELLING**
6. `[origination → answer → instrument]` It started at two altars that had quietly grown into one calendar; {settlement}'s seat wrote to {counterpart} citing the observance and nothing else; and the term that came back sits in the same instrument as the tolls and the passage rights, indistinguishable from them once its clock starts.
7. `[instrument → succession → gate]` The compact ran its term and lapsed on its own week with the lapse written down; the feasts went on being kept on both sides of the line regardless; and neither seat has proposed a renewal, because habit is cheaper than paper and both of them know it.

**SUBHEADER**
8. `[plain]` {settlement} and {counterpart} agreed peace terms brokered by {third_party}, which shares a rite with both; a faith term was added to their standing instrument.

---

### JF-CPL-14b — GRAMMAR → FAITH
> *the signed creed — access can be signed and conviction cannot; the term extracted at war-exit stains*

**Pair:** CPL-14 (§4) · **cause:** grammar · **effect:** faith · **cited waves + reads:** GR-3's canonical faith rows (`missionary_access`, `shared_rite`, `pilgrimage_right`, `tolerance_guarantee`, `temple_restitution` — GRAMMAR's spelling binds), WF-6 as the CONSUMER wave behind `faithTermsEnabled`, `LEGIT_STAIN_IMPOSED` reading the formation context so a term extracted at war-exit stains where a peacetime compact does not, the schism-axis block on communion, and J-CPL-6's ruling — belief is never a term's deliverable
**SLOTS:** `{settlement}` `{counterpart}` `{temple}`

**HEADLINE**
1. `[instrument]` {counterpart} has signed {settlement}'s preachers a road and has signed nothing whatever about what anyone believes at the end of it.
2. `[charge]` The access {counterpart} granted at the table was granted at the point of it, and {counterpart}'s seat has been paying in standing since — an imposed term stains where a bargained one does not.
3. `[instrument]` {temple}'s houses at {counterpart} are to be given back under the term, and the giving back is a delivery like any other delivery, watched or not.
4. `[gate]` {settlement} and {counterpart} read the same god from opposite sides of the schism and no compact was drawn: the nearest quarrel is the hardest one to write around.
5. `[gate]` The term grants the pilgrims their road and grants {settlement} nothing else — the walkers may come, and nobody at {counterpart} is obliged to feel anything about it.

**TELLING**
6. `[answer → instrument → charge]` {settlement} finished the war at the table rather than in the field; among what it took was a road for its own rite into {counterpart}; and {counterpart}'s seat carries the mark of having been made to sign it, which no amount of later keeping rubs out.
7. `[instrument → succession → gate]` The tolerance term was signed between two courts at peace and cost neither of them standing; the rite it protects has been kept without incident since; and the conviction the term was suspected of buying never arrived, because no term has ever been able to buy it.

**SUBHEADER**
8. `[plain]` {settlement} obtained a faith term from {counterpart} at war's end; {counterpart}'s seat lost legitimacy because the term was imposed.

---

### JF-CPL-15a — FAITH → INTERIOR
> *the divine mandate that seats and unseats — the ruler's stance is the largest single part of a creed's legitimacy*

**Pair:** CPL-15 (§4) · **cause:** faith · **effect:** interior · **cited waves + reads:** `applyDivineMandate` moving `publicLegitimacy` with the theocracy/royal weight split, the SOAK-PROVEN contested-patron → legitimacy-erosion → coup chain WITH its non-theocracy control cohort (the estate's only executed cross-layer soak, and the negative cohort IS the pin), the ruler-stance weight inside a creed's legitimacy, `CLERGY_REVEALED_SHARPEN` on exposure, WF-1's typed unseating, and INT-7's legitimacy crossing receipts
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{temple}`

**HEADLINE**
1. `[origination]` {temple} stands behind {settlement}'s seat and the seat stands taller for it — the mandate is borrowed, and everyone in the hall knows whose it is.
2. `[charge]` {settlement}'s patron is contested and the seat has been slipping ever since: the crossing is entered, and the reason on it is the altar and not the granary.
3. `[gate]` {settlement} keeps no patron, so the quarrel at {temple} across the line cost {settlement} nothing at all — a seat that never borrowed a mandate cannot have one called in.
4. `[succession]` The patron at {settlement} fell and the seat that leaned on it went after — the second is entered with the first named on it, which is new.
5. `[charge]` {npc}'s dealings came out, and the stain on {settlement}'s clergy is sharper for the coming out than it ever was for the doing.

**TELLING**
6. `[origination → charge → succession]` {temple} at {settlement} was contested between two readings and neither could claim the seat's backing whole; {settlement}'s legitimacy crossed downward and the crossing was receipted with its cause; and the hall has been turning over since, which the record traces to the altar and not to the harvest.
7. `[gate → succession]` {counterpart}, which keeps its throne clear of any altar, met the same bad harvest and the same hungry winter; no mandate moved there because none had ever been lent; and its seat is where it was — the comparison is the point, and the record keeps both towns side by side.

**SUBHEADER**
8. `[plain]` The patron creed at {settlement} became contested; {settlement}'s seat lost public legitimacy and its hall is unstable.

---

### JF-CPL-15b — INTERIOR → FAITH
> *the revenue dispute that became a reformation — the seat presses the temple and the creed splits (Henry VIII)*

**Pair:** CPL-15 (§4) · **cause:** interior · **effect:** faith · **cited waves + reads:** religious factions contesting `temple_authority` with tithe rights and moral codes as the prizes, the ruler's stance collapsing a creed's legitimacy when it turns against it, WF-5's schism giving the interior a faction-shaped religious split (congregations as sides), INT-6's deliberate forgiveness burying a religious grievance at a price and its dig-up re-opening it over a party that never forgave the burying, the decaying heresy stain (reconciliation is always reachable), and the declared-empty state church — the seat-temple relation is read-derived, never a stored flag
**SLOTS:** `{settlement}` `{temple}` `{reason}` `{timeband_span}`

**HEADLINE**
1. `[answer]` {settlement}'s seat wanted {temple}'s tithe and said so in open hall — {reason}; what began as a question of revenue is a question of who reads the god now.
2. `[charge]` The seat at {settlement} turned against its own patron and is paying twice: the creed is worth less at {settlement}, and so is the hall that fought it.
3. `[succession]` {temple} at {settlement} has become two temples, and the line between them runs exactly where the seat's quarrel ran.
4. `[gate]` {settlement}'s hall pressed {temple} hard and the creed did not split — a congregation of one mind is the cheapest thing a temple can own and the hardest to argue with.
5. `[instrument]` {settlement}'s hall and {temple} agreed to bury the quarrel and the burying is written down; the parties who never agreed to it were not asked, and they are still there.

**TELLING**
6. `[answer → charge → succession]` The seat at {settlement} pressed {temple} for the tithe and would not be refused; the creed's legitimacy fell as its own ruler's stance went against it; and what stands at {settlement} now is two congregations, each with a reading and a grievance, on a stain that will decay if anybody lets it.
7. `[instrument → succession → answer]` The burial of the old quarrel held at {settlement} through {timeband_span}; a later hall dug it up for a use of its own; and the party that had never forgiven the burying answered the digging before the seat had finished explaining it.

**SUBHEADER**
8. `[plain]` {settlement}'s seat pressed {temple} over tithe rights; the creed at {settlement} lost legitimacy and {temple} has split.

---

### JF-CPL-16a — POP → INFO
> *news travels behind the column — and the strike grows in the telling at every hop*

**Pair:** CPL-16 (§4) · **cause:** populations · **effect:** information · **cited reads:** in-flight columns as banded `migration_flight` rumour events landing the tick BEHIND the column, `degradeTelling`'s per-hop magnitude drift with name-swaps to REAL settlements only (the strike grows in the telling with no new machinery — J-CPL-11 rules the reuse), POP-5a's lost-column inference (silence past the window reads as disaster at home), and its false-mourning correction when a merely slow column arrives
**SLOTS:** `{settlement}` `{counterpart}` `{route}` `{band}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[carriage]` {band} left {settlement} on the {route} and the news of it reached {counterpart} a step behind their feet — the road tells on itself.
2. `[belief]` The column out of {settlement} was a notable thing when it started and is an exodus by the time the story reaches {counterpart}: every teller added a little, and not one of them lied.
3. `[gate]` The word of the departure never got past the first town — {settlement} is on nobody's road, and a column nobody meets is a column nobody reports.
4. `[belief]` {settlement} has heard nothing of its own people {timeband_since} and has entered them as lost; the entry is honest, and it may still be wrong.
5. `[succession]` The column {settlement} mourned walked in at {counterpart} late and whole, and the mourning has been struck off the roll with the reason written beside it.

**TELLING**
6. `[carriage → belief → succession]` {band} went out of {settlement} for {reason} and the road carried the fact from town to town; by the time it had passed through enough hands the count had swollen and the name on it had slid to a neighbouring town real enough to be believed; and {counterpart}, acting on what reached it, made ready for a crowd it never saw.
7. `[gate → belief → succession]` No word came off the {route} while the column was walking; {settlement} read the silence the way the record says a silence past its window is read, and entered a disaster; and the disaster un-minted itself at {counterpart}'s gate, which is the only correction of that kind the ledger allows.

**SUBHEADER**
8. `[plain]` {band} departed {settlement} along the {route}; the departure was reported at {counterpart} at a larger size than {settlement}'s own roll records.

---

### JF-CPL-16b — INFO → POP
> *the letters home that told the truth too late — the rush chases the belief, the bust corrects it (the Black Hills)*

**Pair:** CPL-16 (§4) · **cause:** information · **effect:** populations · **cited waves + reads:** POP-1's BELIEVED ROAD entering at the ONE pull seam (only the ATTRACTION AXES resolve belief-side; menu admission, the spare read and the capacity cap stay TRUTH), POP-1's ARRIVAL CLEARING turning the unplaced back through the `returned` accounting arm — receipted, never teleported and never silently landed — arrival disappointment writing the correction, LETTERS HOME as the corrective flow, IN-2's planted wealth as the lure that starts a rush, and IN-4's race deciding whether the rush or the correction arrives first
**SLOTS:** `{settlement}` `{counterpart}` `{faction}` `{route}` `{band}` `{timeband_span}`

**HEADLINE**
1. `[belief]` They say there is work and bread at {counterpart}, and {band} have taken the {route} on the saying.
2. `[gate]` The say about {counterpart} was as loud at {settlement} as it was anywhere and nobody went: {counterpart} had no room at the hour the choice was made, and a road is a road, not an argument.
3. `[charge]` The letters have started coming back from {counterpart}, and they say what the arrivals found rather than what the road promised.
4. `[succession]` {counterpart} filled and emptied again inside {timeband_span} — it drew more than it could hold, and the same count that drew them has moved them on.
5. `[origination]` `[dm-only]` {faction} put the word of {counterpart}'s plenty on the road deliberately, and the road did the rest without being asked twice.

**TELLING**
6. `[belief → carriage → gate]` The word of plenty at {counterpart} outran anything true about it; {band} walked the {route} on the strength of the word; and those who came after the room ran out were cleared at the landing and turned back through the returned roll, receipted, with the reason handed to them.
7. `[origination → belief → succession]` `[dm-only]` The plenty at {counterpart} was planted by {faction} and cost what a plant costs; the rush arrived well before any correction could; and the letters that finally came back are that correction, late, and the towns that emptied for it are not refilling on anybody's apology. *(Player-side the chain begins at the say; no planter is in the public telling, and it reads identically to a rumour nobody bought.)*
8. `[belief → gate → charge]` {settlement}'s people chose {counterpart} on a picture of it that was current when they set out; the room at {counterpart} closed while they were walking; and the walk back is entered against {settlement}'s roll with the season lost and nothing else gained.

**SUBHEADER**
9. `[plain]` A rumour of prosperity at {counterpart} drew {band} from {settlement}; {counterpart} lacked the capacity to place them and they were turned back.

---

### JF-CPL-17a — POP → GRAMMAR
> *the crowded realm proposes the compact before it exports the crisis*

**Pair:** CPL-17 (§4) · **cause:** populations · **effect:** grammar · **cited waves + reads:** GR-2's `migration_pressure` as the typed proposal trigger, GR-3's population term rows (`migration_right`, `labor_compact`, `settlement_provision`) as the canonical mint, GR-2's own DEPENDENCY FEAR as the counterforce — the SAME believed-flow evidence that raises the trigger scores both parties' fear of reliance, so the compact that would bind too tightly is refused by the very numbers that invited it — and GR-2's closed formation ending `no_overlap` carrying the flow-physics REASON
**SLOTS:** `{settlement}` `{counterpart}` `{band}`

**HEADLINE**
1. `[origination]` {settlement} has {band} more mouths than it has land for and has sent a draft to {counterpart} rather than a column — the pressure is the reason, and the reason is written on the proposal.
2. `[gate]` {settlement} needs the room and will not sign for it: the same figures that argued for the compact argued louder about what leaning on {counterpart} would cost.
3. `[answer]` {counterpart} has the land and {settlement} has the hands, and for once the two courts are talking about it before anybody starves.
4. `[gate]` The proposal went to {counterpart} and came back with no overlap found — neither court could reach a shape it would sign, and the refusal carries what each of them wanted written on it.
5. `[belief]` {settlement}'s clerks read the flows and read them high; the compact was drafted on that reading; and the reading is what the drafting will be judged against.

**TELLING**
6. `[origination → answer → gate]` The crowding at {settlement} crossed the line the clerks watch and raised the pressure the trigger reads; the seat drafted a settlement provision and sent it to {counterpart} ahead of any column; and {counterpart}'s court, reading the same flows, refused on the grounds that a realm which needs you that badly is a realm that owns you.
7. `[origination → instrument → succession]` {settlement}'s pressure argued for the compact and {counterpart}'s empty holdings argued back; the term was drawn as a labour compact with a clock of its own; and the flows it promised have run under the migration ledger's own accounting since, where they either balance or they do not.

**SUBHEADER**
8. `[plain]` Population pressure at {settlement} triggered a proposal to {counterpart}; the two courts have drafted a labour compact.

---

### JF-CPL-17b — GRAMMAR → POP
> *settlement by signed compact — the labour charter with a permit lane, and the flow physics that must deliver it (the Ostsiedlung locators)*

**Pair:** CPL-17 (§4) · **cause:** grammar · **effect:** populations · **cited waves + reads:** GR-3's population rows landing WITH POP-5b's permit columns lit so a signed compact has a lane to run in, the migration ledger's conservation identity (departures = arrivals + returned + lost + in-transit) auditing the promised flow, formation refusal under `no_overlap` with the flow-physics read supplying the REASON, WR-10's people-do-not-move law bounding the sovereignty market (the sold town's people stay; only the edge is rewritten), the voluntary margin as a bound on movement, the declared-empty that people are never the PAYMENT, and the 2026-08-02 OWNER-OVERRIDE admitting `tribute_population` as anonymous columns only
**SLOTS:** `{settlement}` `{counterpart}` `{route}` `{band}` `{timeband_span}`

**HEADLINE**
1. `[instrument]` {counterpart}'s empty holdings are to be filled from {settlement} under the term, and the first of them walked the {route} this season on paper as much as on foot.
2. `[gate]` The compact was refused at the drafting because no road connects what it promised to move — the flow physics gave the reason, and the refusal carries it.
3. `[charge]` The term promised {band} to {counterpart} and the ledger says fewer arrived than left, with the difference honestly named.
4. `[gate]` {settlement} changed hands at the table and no household moved: the edge was sold, the people were not, and the roll at {settlement} is the roll it was.
5. `[instrument]` {counterpart} may take its tribute in hands as well as in grain, and the term counts heads and names none of them.

**TELLING**
6. `[instrument → carriage → charge]` The labour compact bound {settlement} to send and {counterpart} to seat; the columns went up the {route} at the seasons the term named; and the audit at the year's turn ran the built identity against the promise and found the shortfall exactly where the road had been bad.
7. `[instrument → succession → gate]` The compact ran and delivered through {timeband_span}; the holdings at {counterpart} filled and the flow slackened as they filled; and when {settlement}'s people stopped choosing the walk nobody was made to take it — the margin is voluntary, and the term never had a hand on anyone's back.

**SUBHEADER**
8. `[plain]` {settlement} and {counterpart} signed a labour compact; {band} moved from {settlement} to {counterpart} under its terms.

---

### JF-CPL-18a — POP → INTERIOR
> *the petition marched — grievance climbs the rung ladder and the seat answers or pays (the Peasants' Revolt)*

**Pair:** CPL-18 (§4) · **cause:** populations · **effect:** interior · **cited reads:** the BUILT commons-voice kernel — a persistent per-settlement crowd ledger whose grievance reads the legitimacy deficit, exposed and seated corruption, and live unrest, escalating deterministically petition → gathering → riot, wired ahead of the assize so a fresh petition is answerable the same tick — the ladder's own dwell keeping the crowd off a hair trigger, the answered-petition counterforce (same grievance, two seat choices, two prices), the pin that a legitimate seat draws no petition from prosperity alone, and riot consequences flowing through EXISTING writers only
**SLOTS:** `{settlement}` `{reason}` `{timeband_span}`

**HEADLINE**
1. `[answer]` The commons of {settlement} have put a petition before the seat, and the seat has until the assize to have an answer for it.
2. `[origination]` What was a petition at {settlement} is a gathering now — nothing was added to the grievance, and nothing was taken off it either.
3. `[charge]` {settlement}'s hall let the ladder run its whole length and is paying for the running: the riot is entered with {reason} on it, and so is every rung the seat refused first.
4. `[gate]` {settlement} is prosperous and its seat is sound, and the crowd there has petitioned for nothing — a full granary is not a grievance, whatever the hall would like to believe.
5. `[succession]` The seat at {settlement} answered the petition and the ladder stopped where it stood; the answer cost less than the gathering would have, which the hall's own accounting now says out loud.

**TELLING**
6. `[origination → answer → charge]` The corruption at {settlement} came out and the crowd's ledger moved the day it did; the petition went up before the assize and the seat refused it; and the gathering that followed sat exactly as long as the ladder's dwell requires before it became the thing everybody had already been calling it.
7. `[charge → succession → gate]` {settlement}'s legitimacy deficit fed the crowd's ledger through {timeband_span}; the rungs came in the order the record says they come; and what the riot cost is entered in the same books that hold every other bad season at {settlement}.

**SUBHEADER**
8. `[plain]` Grievance at {settlement} rose after corruption was exposed; the commons petitioned the seat, the seat refused, and a riot followed.

---

### JF-CPL-18b — INTERIOR → POP
> *the levy refused — the seat's act reaches the people, and the crowd that is never heard stops petitioning and leaves*

**Pair:** CPL-18 (§4) · **cause:** interior · **effect:** populations · **cited waves + reads:** POP-2's REFUSAL rung extending the built ladder against the seat's plan, levy or encouraged emigration (priced, legitimacy-gated) with refusal receipts NAMING what was refused, the answered-petition counterforce's two prices, the slow verdict (the crowd that is never heard stops petitioning and starts leaving — the departure rate reading the same grievance the ladder does), the vacuous-absence discipline (the refusal rung cannot fire against a plan the settlement never proposed), and the declared-empty — the commons refuse and riot, they never negotiate
**SLOTS:** `{settlement}` `{timeband_span}`

**HEADLINE**
1. `[answer]` {settlement}'s seat called the levy and {settlement}'s commons have refused it — the refusal names the levy, and it is on the record with everything else.
2. `[gate]` The seat at {settlement} proposed nothing this season and the crowd refused nothing: there is no refusing a plan that was never put.
3. `[succession]` {settlement}'s people have stopped petitioning and started leaving — the same grievance is being spent, and it is being spent on the road now.
4. `[charge]` {settlement}'s hall pressed the encouragement and the town would not go; what the seat spent on the pressing it has not got back.
5. `[gate]` The commons of {settlement} refused the plan and were never at the table for it — they are not a party, they are the delivery, and the seat is learning the difference.

**TELLING**
6. `[answer → charge → succession]` The seat at {settlement} laid a levy on a town whose ledger was already against it; the refusal came up the built ladder and priced the levy where it stood; and the seat has since discovered that the plan it wanted is not being delivered by anybody, refusal or no refusal.
7. `[succession → gate → charge]` {settlement}'s petitions went up through {timeband_span} and came back unanswered every time; the ladder had nowhere higher to climb that the town was willing to climb; and the departure rate at {settlement} has been reading the same grievance the petitions did, which is the only voice left when the hall stops listening.

**SUBHEADER**
8. `[plain]` {settlement}'s seat called a levy; the commons of {settlement} refused it, and departures from {settlement} have risen.

---

### JF-CPL-19a — INFO → GRAMMAR
> *diplomacy powered by a believed document — the pact bought with a lie, its margin still on the record (the Donation)*

**Pair:** CPL-19 (§4) · **cause:** information · **effect:** grammar · **cited waves + reads:** `processLies` planting false strength, `resolveVictor` pricing terms off `believedAdvantage`, `believedMarginAtSignature` persisting ON the treaty record, GR-0's LIE-BOUGHT-PACT naming (the join from the exposure beat to the treaty it purchased — the survey's missing tie), GR-4's succession-repudiation reading believed provenance, IN-4's race (a lie exposed BEFORE signature re-prices the table), the Blainey discount on a proven liar's later signals, and J-CPL-8's hard line — a lie targets beliefs about STATES and never mints, alters or counterfeits a record
**SLOTS:** `{settlement}` `{counterpart}` `{timeband_since}`

**HEADLINE**
1. `[belief]` {counterpart} signed terms at {settlement} against a strength that was not there, and the margin it signed on is still on the document.
2. `[succession]` The lie came out {timeband_since}, and the treaty it bought is being read again at {counterpart} with new eyes and the old signature.
3. `[gate]` The word was exposed before the seals went on and the table priced itself again on the truth — the correction beat the ink, which it does not always.
4. `[charge]` {settlement} got its terms and got a name for getting them: the next table {settlement} sits at will discount whatever {settlement} says at it.
5. `[instrument]` Nothing on the instrument is forged — every line of it is real, properly sworn, and bought with something that was not.

**TELLING**
6. `[belief → instrument → succession]` {settlement} put a false account of its own strength where {counterpart}'s envoys would find it; the terms {counterpart} agreed were priced off that account and the price is recorded on the treaty itself; and when the exposure beat landed, the join between the two was finally said aloud instead of left for an auditor with a ledger.
7. `[origination → belief → gate]` The strength {settlement} showed was a plant and the plant was a good one; {counterpart} believed it right up to the day a second account arrived; and the treaty that would have been signed on the belief was never drawn, which the record keeps as carefully as it keeps the ones that were.

**SUBHEADER**
8. `[plain]` {settlement} planted a false account of its strength; {counterpart} agreed treaty terms priced against that account, and the deception has since been exposed.

---

### JF-CPL-19b — GRAMMAR → INFO
> *the table as an intelligence surface — the decaying snapshot, send-two, and the one honest channel that is the traitor's*

**Pair:** CPL-19 (§4) · **cause:** grammar · **effect:** information · **cited waves + reads:** WR-7's errand with its decaying snapshot, interception, per-party `negotiationPictures` and ratification on a party's OWN picture; K3 as this pair's constitution (nobody at any table is ever current — terms can be agreed for a town already fallen, pinned in WR-7b); the compromised envoy (the TRUE snapshot handed over — the one honest channel is the traitor's); SEND-TWO and the corroboration ladder as the counterforce; IN-1's mirror deriving what they likely believe of us from the outbound record; and the Blainey discount at the table
**SLOTS:** `{settlement}` `{counterpart}` `{npc}`

**HEADLINE**
1. `[carriage]` {settlement}'s envoy went out with a picture of {counterpart} and has been carrying an older one every day since.
2. `[gate]` {settlement} sent two, and their accounts of the same parlay do not agree — that disagreement is the whole of what the sending bought.
3. `[belief]` {settlement} ratified terms on the picture {settlement} had, which is the only picture anybody has ever ratified on.
4. `[succession]` The terms for {counterpart} were agreed at the table on a morning when {counterpart} had already fallen; the record shows both, and the record is not embarrassed.
5. `[origination]` `[dm-only]` The one account out of {settlement} that has been true in every particular is {npc}'s, and {npc} has been handing the same truth to {counterpart}.

**TELLING**
6. `[carriage → belief → charge]` {settlement}'s errand left with what {settlement} knew and arrived with what {settlement} had known; {counterpart} negotiated against a picture aged the length of the road; and both courts entered terms neither would have entered on a current account, which is the ordinary condition of every table anybody has ever kept.
7. `[carriage → gate → charge]` `[dm-only]` {settlement} sent the one envoy to save the cost; the account that came back was clean, complete and exactly what {counterpart} wished {settlement} to hold; and the hurried seat has the treaty it paid for. *(Player-side the chain ends at the account's arrival and reads as a successful errand; no public mold in this family gestures at a second envoy who was not sent.)*
8. `[belief → answer → gate]` {settlement} read from its own outbound record what {counterpart} was likely to believe of it and drafted to that; the draft met a discount {settlement} had earned at an earlier table; and the terms converged the slower for it, exactly as slowly as a proven liar's terms converge.

**SUBHEADER**
9. `[plain]` {settlement}'s envoy carried an out-of-date account of {counterpart} to the parlay; the terms agreed were priced against that account.

---

### JF-CPL-20a — INFO → INTERIOR
> *a court divided by what it believed — the council schism, and the plant that fell with the hand that placed it (Dreyfus)*

**Pair:** CPL-20 (§4) · **cause:** information · **effect:** interior · **cited waves + reads:** `council_schism` minting a legible condition where a faction confidently reads the world differently from its seat; the exposure blowback triple (exposed-corruption ledger → `corruption_exposed` casus, grievance, credibility charge, both-court legitimacy hits); IN-5(d)'s SCANDAL join citing the PERSISTED `corruption_exposed` condition on the coup or capture beat's cause-walk line (composer-side only); INT-2's counsel receipts naming whose read prevailed and against whose dissent; the vindicated-minority counterforce; and the pin that a schism between two wrong readings resolves for neither
**SLOTS:** `{settlement}` `{counterpart}` `{faction}`

**HEADLINE**
1. `[belief]` {faction} at {settlement} is certain the danger is elsewhere and the seat is certain it is here — the council is split over which threat is real, and both halves are sure.
2. `[succession]` {settlement}'s seat fell, and the exposure that ran ahead of it is named on the fall: the join is spoken now instead of left in two separate books.
3. `[charge]` {faction}'s asset at {counterpart} came out and everything it touched came out with it — the grievance, the standing, and both halls' good name, all of it on the same page.
4. `[gate]` The council at {settlement} was split between two readings and the events proved neither; nobody was vindicated, and the split is where it was.
5. `[origination]` {faction} read the world right against the seat's own certainty, and {faction}'s word carries further in the hall than it did.

**TELLING**
6. `[belief → answer → charge]` {faction} at {settlement} held a hostile reading the seat did not share and the schism was minted on the divergence; the seat acted on its own reading and the counsel receipt names whose read prevailed and against whose dissent; and when events came down on {faction}'s side, the standing moved off the same evidence that had charged the wrong reader.
7. `[origination → succession → charge]` `[dm-only]` The plant was placed at {settlement} to move a seat, and it moved one; the exposure came later and cited the condition still standing on the record; and the hand that placed it is entered on the same beat, which is why that beat reads the way it does. *(The public telling begins at the exposure and cites only the persisted condition; the placing is not in it, and the walk truncates without saying so.)*
8. `[belief → charge → succession]` The reading that prevailed at {settlement} was the seat's, and it was wrong; the cost came in on the season the events settled it; and the dissent that was recorded at the time is being read back now by people who were never in the room.

**SUBHEADER**
9. `[plain]` {faction} at {settlement} holds a different assessment of the threat from {settlement}'s seat; {settlement}'s council is recorded as split.

---

### JF-CPL-20b — INTERIOR → INFO
> *the sweep and the silence — deliberate counter-intelligence, and the court that knew and sat still*

**Pair:** CPL-20 (§4) · **cause:** interior · **effect:** information · **cited waves + reads:** IN-3's suspicion reads giving the interior DELIBERATE counter-intelligence (the sweep that finds the asset before the organic roll does), IN-5's INACTION receipt (a high-confidence hostile belief with no selection made — "the court knew, and sat still," receipted), the compromised seat covertly optimizing a foreign patron's books, and the declared-empty — suspicion reads target foreign assets and travelling strangers, NEVER the resident crowd's beliefs
**SLOTS:** `{settlement}` `{counterpart}` `{reason}`

**HEADLINE**
1. `[answer]` {settlement}'s seat ordered the sweep and the sweep found what the seasons would have found on their own — {reason}; the finding came ahead of the roll that would have made it anyway.
2. `[gate]` {settlement} knew, at a confidence its own record calls high, and {settlement} did nothing — the knowing is entered, and so is the nothing.
3. `[gate]` The sweep at {settlement} turned over every stranger on the road and never once turned over its own people: the reach stops at the town's own doors, which is a rule and not an oversight.
4. `[charge]` {settlement} swept and found nobody, and the sweeping is still on the ledger — a search that comes up empty costs what a search costs.
5. `[belief]` `[dm-only]` The seat at {settlement} has been keeping {counterpart}'s books quietly well, and the sweep {settlement} ordered was never going to look in that direction.

**TELLING**
6. `[answer → succession → charge]` {settlement}'s seat suspected the channel and ordered it swept; the asset came out ahead of the roll that would have found it in its own time; and {counterpart}, which had placed it, paid the standing and the grievance and the credibility together.
7. `[belief → gate → charge]` {settlement}'s court held a hostile reading of {counterpart} at high confidence and held it steadily; no selection was made against it and none is recorded; and when the thing the court expected finally happened, the record showed a court that had known and had sat still — a harder line to read than a court that was simply wrong.

**SUBHEADER**
8. `[plain]` {settlement}'s seat ordered a counter-intelligence sweep; a foreign asset at {settlement} was exposed.

---

## §1.3 — CPL-21, THE STORY CANON AND THE SIGNATURE STORIES

> *CPL-21 both ways · the STORY CANON's eleven named chains · the six SIGNATURE STORIES*

Nineteen families, one hundred and thirty-four molds. Two are CPL directions
(CPL-21, both ways). Eleven are the NAMED WITHIN-LAYER AND CROSS-LAYER CHAINS of
DESIGN_WAR_CONVENIENCE_AND_TRIBUTE.md §5's STORY CANON — "named-emergent: each
becomes a fixture + a Herald pool at build; no mechanism, all composition", which
is this file. Six are DESIGN_FP_COUPLINGS.md §5's signature stories, whose chains
are CW-2's acceptance fixtures. *(A twentieth family was authored in this block —
`JF-W-grievance_to_war`, the war layer's own within-layer ripening — and moved to
§1.4a at merge, where the within-layer chains live.)*

**Conventions followed from §0, not restated per family:** the eight typed edges
of §0c · the four time-band print positions of §0d, with `older than its bearers`
PREDICATE-ONLY · R-CAU-C (a mold's tag is its contract; no cross-shape reuse) ·
R-CAU-D (all three registers, every family) · R-CAU-F (the angle palette) ·
R-CAU-G (public unless tagged). Every mold below is `audience: public`; this
block has no `[dm-only]` join: its one covert seam — the corner-and-mitre leash
— is rendered only in its EXPOSED state, and the player-side telling truncates
at the seam by the standing fail-closed law rather than by a mold of its own.

**Where the entailment comes from.** CPL families cite their §4 pair section;
STORY-CANON families cite DESIGN_WAR_CONVENIENCE_AND_TRIBUTE.md §5 plus the wave
that owns each link; SIGNATURE-STORY families cite DESIGN_FP_COUPLINGS.md §5's
numbered steps. Nothing below asserts a read those sections do not carry, and
each family states the fence most likely to be eroded by a later editor.

**These molds are LINKS, never braids.** Six of the twenty already own a
`cascade.braid.*` pool in RECEIPT_POOLS_COUPLINGS.md. Those pools render the
whole cascade as ONE lead item; these render the individual joins the telling
composes from. No sentence is shared between the two, and a merge that lets a
join mold serve as a braid lead re-creates the C-LAW-1 double-writer defect in
content form.

---

### JF-CPL-21a — GRAMMAR → INTERIOR
> *the tribute that drains the payer's own hall — strain attributed inward at last, and the crowd that reads the drain*

**Pair:** CPL-21 (§4), the grammar→interior direction · **cause:** grammar · **effect:** interior · **cited waves:** TB-1, TB-3, INT-4, INT-7
**Archetype:** Æthelred and the Danegeld — the paying, not the enemy, unmade the seat.
**Fence:** INT-4's attributed pressure receipt is **CO-PRESENCE, NOT DECOMPOSITION** — it names `tribute_strain` among the burdens standing at the birth crossing and computes no causal share, because the legitimacy stock carries no per-hit provenance. **No mold may say the tribute caused the fall.** The volume's baseline is the opposite direction: tribute strain points OUTWARD at the victor until the attribution lands, and the inward turn is the whole news here.
**SLOTS:** `{settlement}` `{counterpart}` `{faction}` `{good}` `{timeband}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[charge]` {settlement} sends the season's tribute to {counterpart} — and names the drain in its own reckoning at last.
2. `[succession]` {timeband_since}, the crowd at {settlement} has found the word for what it pays {counterpart}.
3. `[charge]` {faction} calls the peace with {counterpart} {timeband} bleeding, and the hall's pressure entry does not contradict it.

**TELLING**
4. `[charge → succession]` The terms with {counterpart} take {good} out of {settlement} every season, conserved out of the stores where anyone may count the gap. The granary read shorter each year. And when the pressure crossed at the hall, the clerks entered tribute strain among the burdens standing over the seat — co-present, in the receipt's own word. No page claims the tribute did it alone. Every page names it there.
5. `[succession → answer]` For {timeband_span} the drain went out of {settlement} unnamed, and the anger it made pointed outward at {counterpart}, where the terms had been written. Then the books were read aloud in the hall, and the anger found a nearer address.
6. `[gate]` {settlement} pays {counterpart} the same stream and the hall has not moved: the crowd's read of the drain never opened, and the pressure entry names other burdens entirely. Same terms, same grain, no arc — and the ledger shows which reading failed to fire.

**SUBHEADER**
7. `[plain]` {settlement} paid tribute to {counterpart} under the standing terms; {settlement}'s stores fell, and the seat's pressure entry names tribute strain among the burdens present.

---

### JF-CPL-21b — INTERIOR → GRAMMAR
> *the successor who disavows the ancien régime's signature — and the heir who honours it instead*

**Pair:** CPL-21 (§4), the interior→grammar direction · **cause:** interior · **effect:** grammar · **cited waves:** GR-1, GR-4, INT-1, INT-3, INT-6
**Archetype:** Brest-Litovsk — the successor regime repudiating the fallen seat's war, at a price named in the treaty itself.
**Fence:** the negative pin is the hardest one — **succession does NOT auto-void anything.** The instrument persists unexamined unless the re-read fires and CHOOSES; silence is a choice with the oath standing, and no mold may render a lapse. The softer repudiation price applies ONLY to a genuinely coup- or succession-born seat, because provenance compares seat-holder identity and not proclamations; no mold may award the discount off a declaration. The oath-holder identity is GRAMMAR's substrate and this direction's sentence — before GR-1, "the father's oath" is inexpressible.
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{faction}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[answer]` The new seat at {settlement} burns the pact its predecessor swore with {counterpart} — the signature was a dead man's.
2. `[answer]` {settlement}'s heir keeps an oath sworn before the heir was seated, and {counterpart} enters the keeping in its own book.
3. `[succession]` The seat at {settlement} changed hands, and {timeband_since} the terms with {counterpart} still stand unopened.

**TELLING**
4. `[succession → answer → charge]` The instrument names who swore it: the seat that held {settlement} then, and {faction} standing behind that seat. Both are gone. The court sitting now read the document and chose — and the choosing is the record, because the succession voided nothing on its own. {counterpart} priced the choice at news speed, a report or two behind the choosing.
5. `[instrument → charge]` The oath was the father's. {npc} has honoured it through {timeband_span}, at a cost {settlement}'s own books show plainly, and the standing it has bought is entered on the same page as the cost — one record, two exits.
6. `[gate]` The seat at {settlement} fell and rose again inside the cooldown, and the treaty with {counterpart} could not be re-opened at all: a succession too soon after a succession is not a new government, and the instrument simply carried on.

**SUBHEADER**
7. `[plain]` The seat at {settlement} changed hands; the court that followed re-read the treaty with {counterpart} and recorded its choice, and the treaty's swearer is named on the document.

---

### JF-SC-danegeld_loop — GRAMMAR → WAR
> *THE DANEGELD LOOP — tribute paid to the extorter teaches extortion; the payee reads the payment as a win and returns*

**Chain:** the STORY CANON (§5) · **cause:** grammar · **effect:** war · **cited waves:** TB-1, TB-3, TB-7, WR-1
**Fence:** **no mold asserts an internal appetite value.** What the receipts carry is a PAYMENT entry and a LATER, LARGER DEMAND from the same counterpart; the teaching is the join. The volume marks the outcome-learning wire **VERIFY-AT-BUILD, then pin it** — so molds 1, 3 and 5 render on `origination` only where the second demand's `causes[]` actually names the first payment. **If the wire is absent at build, this family degrades to `succession` and says less**; §3 should carry the learning-flavoured connective inside the `origination` pool ("having been paid once", "which taught") rather than mint a ninth edge.
**SLOTS:** `{settlement}` `{counterpart}` `{timeband_since}`

**HEADLINE**
1. `[origination]` {counterpart} returns to {settlement} with a larger ask — the last one was paid without a fight.
2. `[succession]` {timeband_since}, {counterpart} has come back to the town that paid it to go away.
3. `[origination]` The price of quiet at {settlement} has risen every season it has been paid.

**TELLING**
4. `[succession → origination → charge]` The first demand was small and {settlement} met it, and the season was quiet. The second came in the same hand, larger, and was met too. What {counterpart}'s book records is not a grudge but a return on a venture, and the entries are getting bolder. {settlement}'s granary carries the whole education.
5. `[origination]` Nobody at {settlement} decided to become a tributary. Each single payment was the cheap answer in the season it was made, and each one taught {counterpart} what {settlement} would pay.
6. `[gate]` {settlement} refused the second demand and there was no third: the appetite reads outcomes, and the outcome it read was a war it did not want. The refusal cost a season of raiding and is the reason nobody asks any more.

**SUBHEADER**
7. `[plain]` {settlement} paid {counterpart}'s demand under terms; {counterpart} has since made a further and larger demand of {settlement}.

---

### JF-SC-league_drift — WAR → GRAMMAR
> *THE LEAGUE DRIFT — defensive contributions renegotiated from strength, ossifying into tribute*

**Chain:** the STORY CANON (§5) · **cause:** war · **effect:** grammar · **cited waves:** CV-4, TB-1, TB-6, XW-4
**Archetype:** the Delian League into the Athenian Empire.
**Fence:** the drift is COMPOSITION — every link is a contribution receipt and a renegotiation receipt, and nothing mints an empire the model does not carry. **The inequity read is per-party and both scores are on the record**; a mold may report the gap between them but may not adjudicate it. No mold may render a term the instrument does not hold.
**SLOTS:** `{settlement}` `{counterpart}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[succession]` The common fund at {counterpart} has been renegotiated again, and {settlement}'s share is voluntary in name only.
2. `[charge]` {timeband_since}, {settlement} still pays {counterpart} for a war that is over.
3. `[answer]` {settlement} asks to see the accounts of the league it helped found, and {counterpart} declines.

**TELLING**
4. `[succession → charge]` The compact was mutual when it was signed: every town put in against a threat all of them named. The threat has been gone {timeband_span}. The contributions have not, and the terms have been redrafted twice, each time by the strongest signatory, each time entered as agreement.
5. `[instrument → succession]` Read the instrument at {settlement} and read it at {counterpart} and you have read two documents. One is a defence pact. The other is a revenue stream with a defence pact's title page, and both readings are scored and filed.
6. `[gate]` {counterpart} renegotiated and {settlement} walked, and the walking cost only what walking costs — the fund had no term binding a member to stay, and the clerks found that out by looking.

**SUBHEADER**
7. `[plain]` {settlement}'s contribution to the compact with {counterpart} was renegotiated upward; the threat the compact was formed against has lapsed, and the contribution continues.

---

### JF-SC-recognition_gambit — GRAMMAR → WAR
> *THE RECOGNITION GAMBIT — a third party's pact with a contested satellite IS recognition, and the parent's grievance mints off the pairwise act itself*

**Chain:** the STORY CANON (§5) · **cause:** grammar · **effect:** war · **cited waves:** WR-3, TB-4, XW-8
**Archetype:** France 1778.
**Fence:** **the grievance mints off the SIGNATURE, not off any clause.** No mold may attribute a hostile term to the text, and none may claim the third party intended the injury — what the record carries is a pact, a party, and the parent's own entry against it. The `target` field is CLASSIFICATION and never a reach requirement; a mold may not imply the parent was notified by the instrument.
**SLOTS:** `{settlement}` `{counterpart}` `{good}` `{timeband}`

**HEADLINE**
1. `[answer]` {counterpart} signs with {settlement}'s breakaway — and the signing is the injury, whatever the terms say.
2. `[origination]` {settlement} enters a grievance against {counterpart} over a treaty {settlement} is not party to.
3. `[succession]` {counterpart}'s envoys were received at the disputed town as though it were a town, and the parent's court has read the courtesy.

**TELLING**
4. `[answer → origination]` There is no clause in it against {settlement}, and there did not need to be. A pact is between two parties, and {counterpart} chose to make the second party a place {settlement} still calls its own. The grievance mints off the signature; the trade terms underneath it are almost beside the point.
5. `[succession → charge]` {counterpart} wanted the {good} and reckoned the {good} cheap. The parent's ledger prices the pact as the recognition it is, and {timeband} quarrel is what the reckoning actually cost.
6. `[gate]` {counterpart} signed with the breakaway and {settlement} entered nothing at all — the lineage edge had already been severed, and a pact with a town you have stopped claiming is only a pact.

**SUBHEADER**
7. `[plain]` {counterpart} signed a pact with a settlement {settlement} claims as its own; {settlement} recorded a grievance against {counterpart}, citing the pact.

---

### JF-SC-neutrals_cargo — WAR → WAR
> *THE NEUTRAL'S CARGO — a blockader's seizure of a third party's caravan mints the neutral's grievance; the war spreads through trade*

**Chain:** the STORY CANON (§5) · **cause:** war · **effect:** war · **cited waves:** WR-4, WR-6, TR-1; the blockade-is-a-siege law
**Archetype:** 1812.
**Fence:** the seizure receipt names the taker, the taken good and the road. **It does not name an intent toward the neutral, and no mold may supply one.** The neutral's entry is its own, minted on the pairwise act. The blockade is a siege by law — no mold may render it as a separate instrument — and the interdiction is a curtailment with a floor, never an absolute wall.
**SLOTS:** `{settlement}` `{counterpart}` `{house}` `{good}` `{route}`

**HEADLINE**
1. `[origination]` {counterpart}'s cordon takes a {settlement} caravan that was going somewhere else entirely.
2. `[answer]` {settlement} enters a grievance against {counterpart} over {good} it never meant to sell to either side.
3. `[succession]` The war at {counterpart}'s gates has reached {settlement} by way of a road neither of them is fighting over.

**TELLING**
4. `[carriage → origination]` {house}'s wagons came down the {route} with the season's {good}, into a cordon that does not read manifests. They were taken with the rest. The entry at {settlement} names {counterpart}, names the {good}, and gives the reason as seizure — and it stands in a war ledger {settlement} was not party to when the season opened.
5. `[succession]` A blockade is a wall across a road, and roads belong to everyone who uses them. That is the entire mechanism by which {counterpart}'s war became {settlement}'s.
6. `[gate]` The cordon let {house}'s wagons through and took the next ones, and {settlement} has entered nothing: an interdiction is a curtailment and never a shut gate, and the trickle that got by is the reason the two towns are still speaking.

**SUBHEADER**
7. `[plain]` {counterpart}'s blockade seized a caravan belonging to {settlement}, which is not a party to the war; {settlement} recorded a grievance against {counterpart}.

---

### JF-SC-leaky_embargo — TRADE → TRADE
> *THE LEAKY EMBARGO — exclusion is pairwise, so the embargoed buys through a third market; the smugglers' road is its retail arm*

**Chain:** the STORY CANON (§5) · **cause:** trade · **effect:** trade · **cited waves:** TB-4, TR-3, TR-5, TR-6, M7
**Archetype:** the Continental System's death by re-export.
**Fence:** the compact's read returns **its OWN declared exclusion, never a target list**, and this family adds no input to the three built organic levers, which are hysteresis-guarded and floored — *a curtailment, never a total cutoff, a trickle of trade persists.* **No mold may render a total cutoff.** The smugglers' road is the existing deep-shortage spill and opens only when the shortage pays for it; no mold may open it earlier.
**SLOTS:** `{settlement}` `{counterpart}` `{good}` `{route}`

**HEADLINE**
1. `[succession]` {settlement} is shut out of {counterpart}'s market and is buying the same {good} one town further on.
2. `[gate]` The compact against {settlement} holds at every gate that signed it, which is not every gate.
3. `[charge]` {good} costs more at {settlement} than it did, and that is the whole measurable effect of the exclusion.

**TELLING**
4. `[instrument → gate → succession]` The pledge names {settlement} and binds the towns that swore it. It cannot bind the town that did not. So the {good} leaves {counterpart} lawfully, changes hands at a third gate, and arrives at {settlement} with a markup and a fresh provenance — and every step of it sits in somebody's honest book.
5. `[origination]` The smugglers' road is not an alternative to the embargo; it is the embargo's retail arm. It opened when the shortage got deep enough to pay for it, and it will close when the shortage does.
6. `[charge]` {counterpart} has made itself poorer and {settlement} inconvenienced, and the towns on the {route} between them have never done better. The compact is still in force, and both signatories still call it a success.

**SUBHEADER**
7. `[plain]` {settlement} is excluded from {counterpart}'s market by a standing compact; {settlement} is buying the same {good} through a third market at a higher price.

---

### JF-SC-pretenders_war — INTERIOR → WAR
> *THE PRETENDER'S WAR — the harboured émigré as legitimacy cover for the host's invasion, and the restored puppet who repudiates the restorer*

**Chain:** the STORY CANON (§5) · **cause:** interior · **effect:** war · **cited waves:** INT-3b, WR-1, WR-5, GR-4
**Fence:** **LAW ONE is absolute here** — the claimant is named and never resolved; no death, no fate, no throne granted in prose, and the whole émigré lifecycle is no-death by construction. The harbouring grievance mints at the HARBOURING and not at the march, and the molds keep those two receipts apart. One live émigré errand per settlement pair, and the world is not a pretender factory: this family fires inside a band. The pretender travels at the world's speed — law M's week floor — so no mold may render an instant return.
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{timeband_span}`

**HEADLINE**
1. `[answer]` {counterpart} marches on {settlement} in the name of the exile it has been feeding.
2. `[succession]` {settlement}'s old claimant has sat at {counterpart}'s table for {timeband_span}, and {counterpart} has stopped calling it charity.
3. `[answer]` The seat restored at {settlement} refuses the first thing {counterpart} asks of it.

**TELLING**
4. `[succession → answer → charge]` {npc} left {settlement} with a claim and very little else, and {counterpart} took the claim in. The harbouring was entered as a grievance the season it began, in {settlement}'s book, unanswered. What it bought {counterpart} was not a friend but a reason — and the reason marched.
5. `[answer → charge]` A restored claimant owes everything to the restorer, which is exactly why a restored seat cannot afford to look owned. {settlement}'s first act was a refusal, and {counterpart} has now paid for the same war twice.
6. `[gate]` {counterpart} fed the claimant for {timeband_span} and never marched: the claim was there, the grievance was entered, and the books would not carry a war on top of them. The exile faded at that table, which is the ordinary ending and the one nobody tells.

**SUBHEADER**
7. `[plain]` {counterpart} harboured a claimant to {settlement}'s seat, and {settlement} recorded a grievance; {counterpart} has since opened war on {settlement}, citing the claim.

---

### JF-SC-opium_cycle — TRADE → WAR
> *THE OPIUM CYCLE — contraband dispute to trade war to real war to extractive treaty to a long memory to revanchism, the whole coin in one arc*

**Chain:** the STORY CANON (§5) · **cause:** trade · **effect:** war · **cited waves:** TR-1, TR-5, TB-2, TB-6, TB-7, WR-1
**Fence:** five receipts, five links, and each mold stands only on the links it names. **No digits and no centuries** — the memory renders through the band vocabulary and `older than its bearers` is the top of it, PREDICATE-ONLY. The inequity read is scored by BOTH parties and both scores are on the record; a mold reports the gap and never adjudicates it. The revanchist party is the built term-burdened faction, not a new object.
**SLOTS:** `{settlement}` `{counterpart}` `{faction}` `{good}` `{route}` `{timeband_span}` `{timeband_age}`

**HEADLINE**
1. `[succession]` A quarrel over contraband {good} at {settlement} is now a war ledger with {counterpart}'s name at the head of it.
2. `[charge]` The peace {counterpart} drafted at {settlement} is the reason the next generation will give.
3. `[answer]` {faction} campaigns at {settlement} on a single clause of a treaty {timeband_age}.
4. `[origination]` {settlement} signs terms it is in no position to refuse, and enters them in the book its grandsons will read.

**TELLING**
5. `[succession → origination → charge]` It began as a dispute over what {counterpart}'s factors were allowed to land. It became a matter of gates and tariffs, and then of soldiers, and the soldiers settled it. The instrument that ended it took the {route}, an indemnity, and the right to sell the {good} the quarrel had been about. That is four steps, and the fifth is not written yet.
6. `[charge]` {settlement} has honoured every clause. The honouring is the grievance: {timeband_span} of compliance entered season by season in its own hand, and a party in the hall whose entire platform is the season it stops.
7. `[gate]` {counterpart} drafted below its capacity and invested instead, and there is no revanchist party at {settlement} to speak of — the same victory, the other doctrine, and the ledgers show what the restraint bought.

**SUBHEADER**
8. `[plain]` A dispute over contraband {good} between {settlement} and {counterpart} became a war; the treaty that ended it imposed terms on {settlement}, and {settlement} is still paying them.

---

### JF-SC-interdict — FAITH → INTERIOR
> *THE INTERDICT — the temple's mandate-withdrawal as domestic sanction, the divine mandate machinery pointed at the seat*

**Chain:** the STORY CANON (§5) · **cause:** faith · **effect:** interior · **cited waves:** WF-0, WF-8, INT-4, INT-7
**Archetypes:** the Mandate of Heaven, and Canossa.
**Fence:** **LAW ONE — no god acts, ever.** The temple declares or withholds; the town READS; the legitimacy entry is arithmetic with its working shown, because the ruler's stance carries the greater part of a creed's standing. Every mold keeps the reading attributed to the reader. **The lens has both signs** — the same machinery reads recovery as favour — so no mold may render a wrath ratchet, and the bright arm is FAITH's to write.
**SLOTS:** `{settlement}` `{temple}` `{timeband_span}`

**HEADLINE**
1. `[answer]` {temple} withdraws its blessing from the seat at {settlement}, and the rite goes on without the seat in it.
2. `[charge]` The seat at {settlement} has lost the temple's word, and the temple's word was the greater part of its standing.
3. `[succession]` {settlement}'s court has kept the doors of {temple} shut for {timeband_span}; the congregation has begun to read the shutting.

**TELLING**
4. `[answer → charge]` {temple} raised no hand and called down nothing. It stopped naming the seat in the observance, which anyone in the pews can hear for themselves. The legitimacy entry that follows is arithmetic and the clerks show their working: the ruler's stance carries most of a creed's standing, and it carries it away as readily as toward.
5. `[belief]` The lens belongs to the town and not to the god: the bad season is read as the withdrawal and the good one as its return, and the record says which reading was made, by whom, and in what week.
6. `[gate]` {temple} withheld the blessing and the hall did not move — the creed's standing at {settlement} was thin enough that the withholding cost nothing, and the seat has been ignoring the observance ever since without consequence.

**SUBHEADER**
7. `[plain]` {temple} withdrew its recognition of the seat at {settlement}; the seat's recorded legitimacy fell, with the temple named as the cause.

---

### JF-SC-stab_in_the_back — WAR → INTERIOR
> *THE STAB-IN-THE-BACK — post-defeat blame redirection riding the witch-hunt and legitimacy lanes*

**Chain:** the STORY CANON (§5) · **cause:** war · **effect:** interior · **cited waves:** WR-1, WR-5, INT-4, INT-7
**Fence:** the redirection is a **BELIEF record and renders as one** — marked believed and not confirmed, per the law that the walk never retro-corrects history to truth. **No mold may assert the betrayal as fact**, and LAW ONE forbids resolving anyone's fate in the hunt. The exhaustion, the reinforcement bills and the climb-down charge are all BUILT and all on the record; the molds stand on those and not on a new blame mechanism.
**SLOTS:** `{settlement}` `{faction}` `{timeband_since}`

**HEADLINE**
1. `[belief]` {timeband_since}, {settlement} has found someone nearer to blame for the war it lost.
2. `[answer]` {faction} at {settlement} calls the peace a betrayal, and the naming is doing better than the peace did.
3. `[succession]` The hall at {settlement} climbed down, and the crowd that wanted the climb-down will not forgive it.

**TELLING**
4. `[succession → belief → charge]` The war went badly for reasons the ledgers keep plainly: supply, distance, and a coalition that did not hold. None of that is what {settlement} tells itself. The account that took is the one with a traitor in it, and the entry is marked believed and not confirmed, because that is what it is.
5. `[belief]` {faction} did not invent the anger. The anger was in the accounts already — in the reinforcement bills, in the exhaustion scar, in a legitimacy line that had been falling since before the last levy went out. What {faction} supplied was an address for it.
6. `[gate]` {settlement} lost and blamed the war. The rally arm held to the end, the same sentiment read that turns crowds against a seat kept this one behind it, and no hunt opened at all — which is the ordinary outcome and is entered as plainly as the other.

**SUBHEADER**
7. `[plain]` {settlement} lost the war and signed peace; a faction at {settlement} has recorded a belief, marked unconfirmed, that the defeat was betrayal from within.

---

### JF-SC-crusade — FAITH → WAR
> *THE CRUSADE — sacred claims aligning across many pairs at once; a web that feels called*

**Chain:** the STORY CANON (§5) · **cause:** faith · **effect:** war · **cited waves:** WF-3, WF-8, WR-1, CW-1
**Fence:** **no coordination exists, and no mold may imply one.** Each court scored its own claim off its own axis and its own patron; the alignment is a coincidence of readings, which is exactly what makes it frightening. LAW ONE holds — no god calls anybody, and no mold may render a summons. A many-pair alignment is a CASCADE and registers with CW-1; these molds render its links and never its braid.
**SLOTS:** `{settlement}` `{counterpart}` `{route}` `{band}`

**HEADLINE**
1. `[origination]` Sacred claim has been entered against {counterpart} by {band} courts in one season, and nobody coordinated it.
2. `[succession]` {settlement} joins the march on {counterpart} on a claim it had filed before anyone asked it to.
3. `[belief]` The {route} to {counterpart} is full of columns that each believe they are answering separately.

**TELLING**
4. `[origination → succession]` One reading of one rite, made in {band} halls in the same season, is not a conspiracy and does not need to be. Each court scored its own claim against {counterpart} off its own axis and its own patron, and each entered it in its own book. The claims arrived together because the reading did.
5. `[gate]` What the alignment supplies is not an order but a permission. Every court that moves finds the others already moving, and the finding is worth more than any pledge it could have signed.
6. `[carriage]` The claim went down the {route} with the pilgrims and the carters, arriving at each hall in the mouth of whoever was travelling, and it was scored fresh at every table it reached.

**SUBHEADER**
7. `[plain]` Several courts recorded sacred claims against {counterpart} in the same season, independently; {settlement} joined the war that followed, citing its own claim.

---

### JF-SC-melian_refusal — WAR → WAR
> *THE MELIAN REFUSAL — the pragmatic override declined; strength demands, the weak choose pride, and the price is paid*

**Chain:** the STORY CANON (§5) · **cause:** war · **effect:** war · **cited waves:** TB-5, TB-2, CV-3, WR-8
**Fence:** **a peacetime refusal mints NO grievance** — it mints a turning point and a banded trust delta, per the refusal asymmetry; no mold may render the refusal as a quarrel. The spurned branch is itself a receipt. Posture prices the bend and alignment colours the threshold, **never the structure** — no mold may make a court's alignment decide the outcome rather than the bar.
**SLOTS:** `{settlement}` `{counterpart}`

**HEADLINE**
1. `[answer]` {settlement} refuses {counterpart}'s terms, and the refusal is entered as a turning point rather than a quarrel.
2. `[charge]` {settlement} was offered the cheap ending and would not take it.
3. `[succession]` {counterpart} put its demand plainly, which is the part {settlement} will not forgive.

**TELLING**
4. `[answer → charge]` The arithmetic was on the table and both courts could read it. {settlement} answered on the standing grievance, named in the answer, and the refusal cost it the deal and nothing else that season. What it cost after that season is a different set of entries in a different book.
5. `[answer]` A proud court pays more to bend and a desperate one bends cheap; the posture is priced into the answer before the answer is given. {settlement}'s bent for nothing, and the offer stands in the record beside the refusal where anyone may compare them.
6. `[gate]` {settlement} took the deal against every grudge it holds, and the hall carried it — the gain cleared the hostile bar, the crowd was not where the crowd cares, and both courts signed a thing neither of them likes.

**SUBHEADER**
7. `[plain]` {counterpart} offered terms to {settlement}; {settlement} refused them, citing a standing grievance, and the refusal is recorded as a turning point.

---

### JF-SS-reformation — INTERIOR → FAITH
> *SIGNATURE STORY 1 — the tax dispute that becomes a reformation*

**Chain:** DESIGN_FP_COUPLINGS §5 story 1 (CPL-15 × CPL-7 × CPL-2 × CPL-13) · **cause:** interior · **effect:** faith · **cited waves:** WF-7, INT-1, INT-7, WF-0, WF-5a, WF-6/GR-3
**Braid pool:** `cascade.braid.reformation` renders the cascade; these render its links.
**Archetype:** Henry VIII — a revenue-and-jurisdiction quarrel that ended with the altars changed.
**Fence:** **the rival creed's presence is a RECEIPTED ARRIVAL** — a missionary-access term under an earlier pact, or a foothold — and never an assumption, because the seat contest runs between EXISTING creeds and local genesis is forbidden. Mold 4 stands on that receipt and nothing else. The split held ABOVE the remnant floor: that is the whole difference between a reformation and a suppression, the two are mutually exclusive branches of one contest, and the record says which fired.
**SLOTS:** `{settlement}` `{temple}` `{timeband_since}`

**HEADLINE**
1. `[origination]` The quarrel at {settlement} over {temple}'s books has become a quarrel about the rite.
2. `[succession]` {settlement}'s seat won the tithe contest; {timeband_since}, the creed it won against has split.
3. `[charge]` {settlement} wanted the revenue and has been paid in neighbours who will not eat with it.

**TELLING**
4. `[origination → charge]` The seat read its own books and priced the temple's wealth as the affordable answer; the contest that followed named the tithe as the prize, in writing, where the prize is still legible. What the seat did not price was the share of a creed's standing that a ruler's stance carries — and it carries it away as easily as toward.
5. `[gate]` The rival rite was already in the town, arrived under a term signed seasons earlier and since forgotten by everyone but the clerks. It did not have to be sent for. It only had to be there when the contest made room.
6. `[instrument]` The quarrel went to the assize instead and was buried there — same grievance, same books, one honest hearing, and no split at all. The burial is a term like any other, and it can be dug up.

**SUBHEADER**
7. `[plain]` The seat at {settlement} contested {temple}'s tithe rights and won; the creed then split, with the losing side retaining a share above the floor.

---

### JF-SS-pilgrim_road — FAITH → WAR
> *SIGNATURE STORY 2 — the pilgrimage route that becomes a war target*

**Chain:** DESIGN_FP_COUPLINGS §5 story 2 (CPL-12 × CPL-1 × CPL-2 × CPL-5) · **cause:** faith · **effect:** war · **cited waves:** WF-2, WF-2a, SP-1, WR-7b, GR-3/WF-6
**Braid pool:** `cascade.braid.pilgrim_road` renders the cascade; these render its links.
**Archetype:** Reynald of Châtillon raiding the Hajj caravans — the raid that handed Saladin his casus.
**Fence:** **the road towns' pass-through take is DEFERRED work and is not receipted** — no mold may price it, and their stake in this story is the interception, not an economy. The interdictor acts on a BELIEVED web picture and every mold carries that attribution. The counterforce's receipted form until the deferred slice lands is the PACT that reopens the road, not tolls.
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{route}`

**HEADLINE**
1. `[origination]` The pilgrim season on the {route} has become a war reason at {counterpart}.
2. `[answer]` {settlement} cut the road to the shrine, and the shrine's neighbours have entered it on two ledgers at once.
3. `[belief]` {settlement} took the {route} for {counterpart}'s artery on a picture of the web it holds, and cut it.

**TELLING**
4. `[belief → answer]` {settlement} read the {route} as {counterpart}'s artery — through the picture of the web it holds, which is not the web there is — and cut it. The picture sits in the record beside the cutting, and the walk will not tidy it afterwards.
5. `[origination → charge]` An intercepted column is two entries: a grievance in the war ledger and a sacred tension on the faith axis, scored separately and both standing. The war that opens carries the road on its reasons, and the peace that closes it will have to say the road's name out loud.
6. `[carriage]` {npc} went down the {route} with the season's column and into the foreign-guest hold at {settlement}. The hold has one writer and a long memory, and {counterpart} has been told.
7. `[gate]` The road opened again by agreement and not by war. {counterpart} came to {settlement} with a term for the season's passage; {settlement} signed it; and the pilgrims went up the {route} under a clause instead of an escort, which is the only shape this counterforce has ever been receipted in.

**SUBHEADER**
8. `[plain]` {settlement} interdicted the {route} used by pilgrims travelling to {counterpart}; a war was opened whose recorded reasons name the road.

---

### JF-SS-house_run — INFORMATION → TRADE
> *SIGNATURE STORY 3 — the bank broken by a believed rumour*

**Chain:** DESIGN_FP_COUPLINGS §5 story 3 (CPL-9 × CPL-4 × CPL-11 × CPL-20) · **cause:** info · **effect:** trade · **cited waves:** TR-2, TR-3, IN-0, IN-2, SP-2, SP-5
**Braid pool:** `cascade.braid.house_run` renders the cascade; these render its links.
**Archetype:** the Panic of 1907 — solvency decided by the whisper, not the audit.
**Fence:** **there is no believed-solvency axis.** The plant is aimed at the GOOD the house is known to carry — per market and good-class — and **no mold may say the rumour called the house insolvent.** Credibility falls as an EFFECT of the failures, never as the plant's target, and the molds keep that order because the walk does. The exposure comes late because the contradicting deliveries had stopped; that is a fact about the mechanism and not a flourish.
**SLOTS:** `{settlement}` `{house}` `{good}` `{band}`

**HEADLINE**
1. `[belief]` {house} is refused at {band} counters in one season, over a shortage nobody has seen.
2. `[origination]` A story about {house}'s next {good} has done what an audit could not.
3. `[charge]` {house}'s books broke under the refusals, and the refusals were each one reasonable.

**TELLING**
4. `[belief → succession]` The plant was aimed at the trade {house} is known for — their {good} is short, their next deliveries will fail — and it was priced into the market before it was believed anywhere in particular. Every creditor who then refused a renewal did so on their own reading, and each refusal is its own reasonable page.
5. `[charge]` The books broke under the refusals, in that order: the credibility fell because the payments failed, and not the other way about. The walk shows which came first, which is the only reason anyone knows it.
6. `[gate]` The story reached {settlement} at the fourth hand and stopped there — it arrived alone and uncorroborated, the books were thick, and not one counter refused. The same plant, the same house, and nothing at all in the ledger.

**SUBHEADER**
7. `[plain]` A planted report said {house}'s next {good} would fail to arrive; {house}'s creditors refused renewal, and {house}'s books failed.

---

### JF-SS-diaspora_return — POPULATIONS → WAR
> *SIGNATURE STORY 4 — the diaspora that funds the return*

**Chain:** DESIGN_FP_COUPLINGS §5 story 4 (CPL-3 × CPL-16 × CPL-18 × CPL-8, with WR-3 and WR-8) · **cause:** pop · **effect:** war · **cited waves:** POP-1, POP-3, TR-7, WR-3, WR-8
**Braid pool:** `cascade.braid.diaspora_return` renders the cascade; these render its links.
**Fence:** **migration is a FLOW and never an errand — no mold names a migrant.** The departure line names destinations BY NAME because the address law already made it do so. Departure memory is written at BOTH ends and decays generationally; a mold may not render a tie that the decay law has already closed. The counterforce is adoption at the host, off the same influx evidence.
**SLOTS:** `{settlement}` `{counterpart}` `{timeband_age}`

**HEADLINE**
1. `[succession]` The silver rebuilding {settlement} comes from the grandsons of the people who left it.
2. `[origination]` {counterpart}'s old-country ledger has funded a claim against the town that made the exodus.
3. `[charge]` The refounding of {settlement} was paid for by the season that emptied it.

**TELLING**
4. `[succession → gate]` They left in a bad season, and the departure entry named every destination they left toward. The memory was written at both ends and decays on a clock of its own; at {counterpart} it has not finished decaying. That is what made the funding possible, and the ledger says so in the plainest way — under obligations, generation upon generation.
5. `[carriage → origination]` The grudge travelled with the money. A lineage claim filed by a refounded child town is the same instrument as any other claim, sworn on a memory {timeband_age} and priced no differently for it.
6. `[gate]` The households at {counterpart} took up the host's rites and stopped entering {settlement} as home, and the funding stopped with the entering. The decay law says exactly when, and the ruin was raised by somebody else or not at all.

**SUBHEADER**
7. `[plain]` {settlement}'s people left for {counterpart} in a bad season; households at {counterpart} have since funded {settlement}'s refounding, and a claim has been filed from the refounded town.

---

### JF-SS-corner_and_mitre — TRADE → FAITH
> *SIGNATURE STORY 5 — the famine speculator who buys a bishopric*

**Chain:** DESIGN_FP_COUPLINGS §5 story 5 (CPL-9 × CPL-7 × CPL-15 × CPL-20) · **cause:** trade · **effect:** faith · **cited waves:** SP-2, TR-6, TR-7, WF-7, IN-5(d)
**Braid pool:** `cascade.braid.corner_and_mitre` renders the cascade; these render its links.
**Archetype:** the Fugger loan behind Albrecht's pallium.
**Fence:** the house act set is **CLOSED and no verb endows a temple** — credit extended, relief granted, a local faction propped; influence rides the ledger and no mold may invent an endowment. **The house sits in the NEIGHBOURING town by construction**, because the covert leash admits foreign patrons only; a same-town telling is unreachable and a mold that renders one is wrong about the machinery. The covert mark is `dm-only` until exposure — molds 5 and 6 render the exposed state only, and no public mold gestures at the unexposed one.
**SLOTS:** `{settlement}` `{counterpart}` `{house}` `{temple}` `{good}` `{timeband_since}`

**HEADLINE**
1. `[origination]` The credit that raised {temple}'s new chapter came out of the hungry season at {settlement}.
2. `[charge]` {timeband_since}, {temple} is answering for whose money seated its minister.
3. `[succession]` {house} sold into the gap it had helped to make, and the fortune is entered with the stain.

**TELLING**
4. `[gate]` No verb in a house's book endows a temple. Credit extended, relief granted at the temple's own grain in the season {house} made hungry, and a local faction propped through both: influence rode the ledger, and the contest was fought by people who owed.
5. `[succession → charge]` The leash is foreign by construction — {house} sits a town over — and when the mark surfaced, the scandal sharpened against the creed rather than the merchant. That is not an injustice the model failed to notice. It is the reading the congregation made.
6. `[gate]` {temple} refused the credit at the door, reading the same provenance the stain would have ridden, and the contest was fought by people who owed nobody. The corner still happened. Only the mitre did not.

**SUBHEADER**
7. `[plain]` {house}, of {counterpart}, cornered {good} at {settlement} before a shortage and extended credit to {temple}; a minister at {temple} was later exposed as holding under {house}'s leash.

---

### JF-SS-rush_and_war — INFORMATION → WAR
> *SIGNATURE STORY 6 — the border town whose gold rush starts a war nobody wanted*

**Chain:** DESIGN_FP_COUPLINGS §5 story 6 (CPL-16 × CPL-4 × CPL-3 × CPL-5 × CPL-1) · **cause:** info · **effect:** war · **cited waves:** POP-1, IN-1, WR-1, GR-3
**Braid pool:** `cascade.braid.rush_and_war` renders the cascade; these render its links.
**Archetype:** the Black Hills — gold rumoured on treaty land, a rush no court ordered, a war no court priced.
**Fence:** **the turn-back arm routes the surplus through the existing `returned` accounting — there is no camp, and no mold may render one.** The crowding and sprawl lifts read the arrivals that actually LANDED. The treaty-ground turn of this story renders only when the deferred compliance slice lands, so **no mold may cite a treaty default over migration.** The dissolution is receipted with its deciding term named.
**SLOTS:** `{settlement}` `{band}`

**HEADLINE**
1. `[belief]` {settlement} marches on a creek no one at its court has seen — the telling was enough.
2. `[succession]` The strike at {settlement} grew with every telling, and the columns are converging on the last version of it.
3. `[charge]` The wall at {settlement} turned {band} back with receipts, and the disappointment went home in letters.

**TELLING**
4. `[belief → succession]` The find was real and small. Per relay the telling drifted, and the drift is the entire machinery — by the third hand the creek was a motherlode, and the pull that moved the columns was scored off the third hand and not the first.
5. `[origination]` The war's own receipt confesses its epistemics: it names a misjudgment as the deciding term, in the entry, at the opening, and no clerk has softened it since.
6. `[gate]` It dissolved the honest way. The letters home corrected the belief, the reckonings ground together, and the opener stopped being able to say the victim was rich — and the receipt names which of those ended it.

**SUBHEADER**
7. `[plain]` A resource strike at {settlement} was exaggerated in relay; two courts moved on the exaggerated report, and the war that opened dissolved when the belief was corrected.

---
## §1.4 — THE WITHIN-LAYER CHAINS

> *the chains that run inside one layer: war ×3 · trade ×3 · faith ×3 · pop ×3 · info ×3 · grammar ×2 · interior ×2*

Nineteen families, none of them a CPL direction. These are the other half of
§1's key — *"the 42 CPL directions **plus the named within-layer chains**"* —
the chains that run inside one layer, where the drama is a court answering
its own last act rather than one layer reaching another. Each family cites the
waves its entailment comes from; nothing below asserts a read those waves do
not carry, and nothing below mints a receipt kind, a band, a scale or a
mechanism.

**ADOPTED WHOLE, NOT RESTATED:** §0a's three registers and their caps, §0b's
three laws, §0c's eight typed edges and their connective families, §0d's slot
convention and the four-position time-band table, §0e's resolutions A through
G. Every mold below carries an §0c tag; every duration renders through §0d's
band positions; every family carries all three registers per R-CAU-D; every
family carries at least one `gate` mold, because R-CAU-F's negative is where a
within-layer counterforce lives and these nineteen chains are unusually rich in
them (the switch that was unreachable across a sound tie, the razing that was
priced and not made, the corner the roads broke, the petition that was
answered at the first rung).

**BORROWED SLOTS.** This block's chains reach `{calamity}`, `{when}`,
`{wound}`, `{burden}` and `{season}`, all declared volume-local by sibling
annexes and used here unchanged. They are now folded into §0d's borrowed table
with the rest, which is where a registration walker will look for them.

**R-CAU-E'S EXEMPLAR IS PLANTED HERE, ONCE.** The owner's HEADLINE calibration
— *"X declares vengeance on its weakened neighbour — a generation's grudge
will be met"* — seeds the within-layer WAR chain. It is
`JF-W-grievance_to_war` HEADLINE variant 1 and it is planted in exactly one
place in the corpus; that family block carries the recorded alteration, the
entailment argument for the home, and the chair's one-edit reversal.
`JF-W-razing_to_reckoning`, authored in parallel, planted the same sentence,
surrendered it at the merge pass, briefly held it, and surrendered it again on
the voice pass's entailment read — its mold 1 is now the license COLLECTED,
which is the angle its own subtitle promises and no other mold in it covers.

---

## §1.4a THE WAR CHAINS (war → war)

### JF-W-grievance_to_war — WAR → WAR
> *the incident that becomes a name in the war ledger — grievance ripens into casus, and the one opener answers it*

**Chain:** the within-layer WAR chain · **cause:** war · **effect:** war · **cited waves:** WR-1, WR-2, WR-8, E1
**R-CAU-E — DEDUPED AT MERGE, THEN RE-HOMED ON ENTAILMENT, 2026-08-03 (recorded, vetoable).** This family and `JF-W-razing_to_reckoning` were authored in parallel and BOTH planted the owner's HEADLINE exemplar as their mold 1, word for word. One sentence, one home. The merge pass sent it to the razing family on the word *vengeance*, which matches WR-8/R2's `vengeance_license` by name; the voice pass moved it back here, because a lexical match is not entailment and the razing family's own cast runs the other way. In that family `{settlement}` is the RAZER and `{counterpart}` the town it burned (mold 2, mold 5, the subheader), so the exemplar as planted there had the razer declaring vengeance on its own victim, and the license it names is minted AGAINST `{settlement}` and carried by `{third_party}` — the roles reverse under the sentence. Here every clause is entailed as written: the opener declares on a recorded grievance, WR-2's opportunism read weighs the target's weakness at the open (*"its weakened neighbour"*), and a fed grievance carries the band the sentence needs (*"a generation's grudge"*). **If the chair prefers the razing home, the reversal is one edit** — swap this mold with `JF-W-razing_to_reckoning` mold 1 and re-slot the exemplar so the avenger is `{third_party}` and the target `{settlement}`, which is the price that home charges.
**Fence:** **the reasons pinned at the open are the ones standing THAT WEEK**, never rewritten, and the molds say so. A grievance decays if nothing feeds it, and the feeding is on the record. **No mold may render a war ending by victory when the receipt names dissolution** — the deciding term is entered and the telling reads it.
**SLOTS:** `{settlement}` `{counterpart}` `{route}` `{timeband}` `{timeband_since}`

**HEADLINE**
1. `[answer]` {settlement} declares vengeance on {counterpart}, its weakened neighbour — {timeband} grudge will be met. *(THE OWNER'S HEADLINE CALIBRATION, R-CAU-E — the register's ceiling: one gesture, one band, one em-dash turn. `{counterpart}` is inserted because the address law requires settlements BY NAME and the exemplar names only one of the two; nothing else is altered. Recorded rather than made quietly — if the chair prefers the exemplar untouched, the fix is to drop the slot and accept a headline that names one settlement, which is the trade being made either way. This is the corpus's ONLY plant of the exemplar.)*
2. `[succession]` {timeband_since}, the incident on the {route} is a named reason in {settlement}'s war ledger.
3. `[origination]` A season of small entries against {counterpart} has crossed into one large one.

**TELLING**
4. `[succession → origination → answer]` The entries accumulated in the ordinary way: a seizure, a refusal, a border reading, none of them a war on its own. The fold that reads them together crossed its bar. And the reasons pinned at the opening are the ones that were standing that week — not the ones the heralds have shouted since, which is why the two accounts differ.
5. `[succession]` A grievance decays if nothing feeds it, and the feeding is on the record: which season each entry landed, what fed it after, and which of them was still live at the open.
6. `[gate]` The pinned reasons are compared against the live fold at every re-read, and when the last of them has gone out of the fold the war has nothing left to be about. That, rather than a victory, is how most of them end, and the receipt names the term that did it.

**SUBHEADER**
7. `[plain]` {settlement} recorded grievances against {counterpart} and then opened war on them; {counterpart}'s recorded strength had fallen, and the reasons pinned at the opening are on the record.
8. `[charge]` *(HEADLINE — appended at the completion pass, 2026-08-03, per the frequency-scaled floor; numbering append-only)* The ledger against {counterpart} was long before it was loud — the {settlement} market could recite it before the council read it out.

---

### JF-W-ally_to_turncoat — WAR → WAR
> *the ally of convenience who crosses the web — the side-switch recorded, and the join read that remembers it forever after*

**Chain:** within-layer (no CPL direction) · **cause:** war · **effect:** war · **cited waves:** WR-6, WR-7b, CV-1, CV-2, CV-4
**SLOTS:** `{settlement}` `{counterpart}` `{third_party}` `{npc}` `{band}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[answer]` {settlement} has taken the other side of {counterpart}'s war, and the obligation it walked away from is entered at the severity a betrayal carries.
2. `[charge]` {settlement} sits in the enemy's council now, and will pay for the chair through {timeband_span}.
3. `[carriage]` The word of the switch is still on the road: {third_party} is pricing {settlement} at what it was worth last season, and will not be for long.
4. `[gate]` The tie between {settlement} and {counterpart} had worn {band} thin before it broke — a sound one could not have been crossed, and everyone at that table knows it.

**TELLING**
5. `[succession → answer → charge]` The tie eroded before it broke, and every step of the eroding is on the record: {settlement} stopped discharging, defaulted the obligation at the top band, and rode into the opposing web through the ordinary join read — no teleported entry, and no door but the one everybody uses. The entry that default made is what every court reads {timeband_since}, whenever it weighs taking {settlement} in.
6. `[origination → charge]` The turncoat receipt names both movements in one line, the leaving and the arriving. Beneath it the ingratitude debt sits unsettled on {counterpart}'s own pair ledger, feeding the grievance mass the war reasons read — the betrayal casus is derivable from that entry and from nothing else, which is why nobody had to invent one.
7. `[belief → succession]` *[dm-only]* The covert road was quieter. {npc} carried {settlement}'s own parlay to the other side while every panel still showed the tie sound, and {counterpart}'s court bought no warning because it had no reason to think warning worth buying. The tie went on looking healthy until the week it did not.
8. `[charge → gate]` A burial between {settlement} and {counterpart} closes the entry in their own two books and in no others. {third_party} still holds the row and still reads it at the join, and was never party to the peace that set it down — so the bar {settlement} must clear never quite comes back down.

**SUBHEADER**
9. `[plain]` {settlement} left {counterpart}'s coalition without settling its obligation and joined the opposing side; {counterpart} and its remaining allies have recorded a grievance against {settlement}.

---

### JF-W-razing_to_reckoning — WAR → WAR
> *the terror that backfires — the razing judged on the observer's axis, the atrocity casus answered, the vengeance license collected*

**Chain:** within-layer (no CPL direction) · **cause:** war · **effect:** war · **cited waves:** WR-8 (amendments R + R2), WR-6, WR-2, WR-9
**SLOTS:** `{settlement}` `{counterpart}` `{third_party}` `{faction}` `{temple}` `{band}` `{timeband}` `{timeband_since}`

**HEADLINE**
1. `[answer]` {third_party} moved on {settlement} on the right of answer it has held since {counterpart} burned — {timeband_since}, and paid in the same coin.
2. `[origination]` They burned {counterpart} and rode home, and the one license their answer minted is already held somewhere else.
3. `[belief]` {faction} calls the burning of {counterpart} an atrocity and is arming on it — a charge built out of what the roads carried.
4. `[gate]` {settlement} weighed the web that would answer and did not strike: the license it would have minted was priced dearer than the town it would have taken.

**TELLING**
5. `[succession → origination → answer]` Before the torches, {settlement}'s captains priced the web that would answer, and marched regardless. {counterpart} burned; the world read it on its own axes, monumental in one hall and merely recognized in the next; and {timeband_since} the single license that answer minted was carried to the field by {third_party}, whose own quarrel with {settlement} had reached the same extreme. It was spent once, and it mints nothing back.
6. `[carriage → belief → answer]` *[dm-only]* The charge was built out of a telling. Word of the razing reached {faction}'s hall at the road's speed and the casus was entered on what that hall believed had happened — which is the road by which a razing nobody committed can arm a war, and why the receipt names what was believed and who carried it in.
7. `[charge → succession]` The neighbours {settlement} meant to quiet did not all quiet. One road kept {timeband} caution and the next hall over entered the ash as a reason to arm — terror working and terror backfiring, read off one record, one act and two ledgers, and the {temple} between them keeping a third account of it.
8. `[carriage → gate]` The named of {counterpart} are not in the arithmetic. {band} went out as refugees down the roads the column came in on, the named cast among them; the roll that counts the dead does not count them and was never meant to; the tier fell because the truth fell and not because a second hand wrote it down; and the institutions stand as shells the clerks still list by name.

**SUBHEADER**
9. `[plain]` {settlement} razed {counterpart} after a won siege; {counterpart}'s tier has fallen and its institutions are shells, and neighbouring settlements have recorded a claim against {settlement}.

---

## §1.4b THE TRADE CHAINS (trade → trade)

### JF-T-corner_to_riot — TRADE → TRADE
> *the corner that ends at the granary door — profiteering, conscience pressure, and the seizure the crowd makes*

**Chain:** within-layer (no CPL direction) · **cause:** trade · **effect:** trade · **cited waves:** TR-6, TR-1, TR-4, TR-2
**SLOTS:** `{settlement}` `{house}` `{good}` `{route}` `{band}` `{timeband_span}` `{timeband_since}`

**HEADLINE**
1. `[answer]` {house} holds the {good} of {settlement}, and the crowd took the warehouse door off its hinges.
2. `[charge]` {house} kept the corner and lost the hall it sits in — the guilds moved on its own institutions while the gouge ran.
3. `[gate]` The dear band {house} made was heard on every road, and the roads answered before the crowd could: wagons came into {settlement} from towns that had never sent one.
4. `[succession]` {house}'s price stood against the petitions for exactly as long as they were only petitions.

**TELLING**
5. `[origination → charge → answer]` It began quietly, with {house} buying {good} wherever it was cheap and buying all of it, and it ended at the granary door: the reachable share crossed the band and the clerks entered the day; the sale book entered every load dear, and every entry was evidence; the guilds turned on {house}'s own institutions; and the crowd carried the stock to the public granary in daylight, load for load out of one book and into the town's.
6. `[answer → charge]` The seat reached the warehouse before the crowd did and ordered the {good} sold into the public granary at {band}. The wardens counted the sacks out while the town watched. {settlement} ate; {house} entered its grievance beside the stock; and the seat will be answering for that order long after the winter it answered.
7. `[carriage → gate]` The corner advertised itself, which was always the flaw in it. The band was carried down every road out of {settlement}; wagons came off the {route} from towns with no custom there; the arrivals were entered against the held share; and {house} sold into the band it had broken and will be counting the difference through {timeband_span}.
8. `[succession → charge]` The corner ended and the name has outlasted it. The chronicle keeps the winter under {house}'s name and no clerk has moved it; the old carters date things from it, before and after; and {timeband_since} grandchildren of that queue refuse {house}'s custom without being able to say why.

**SUBHEADER**
9. `[plain]` {house} held the reachable stock of {good} in {settlement} above the band and sold at a raised price; the crowd seized the warehouse stock and moved it into the public granary.

---

### JF-T-credit_to_betrayal — TRADE → TRADE
> *the debt that becomes a grievance — credit extended, the default, the betrayal-class casus commercii*

**Chain:** within-layer (no CPL direction) · **cause:** trade · **effect:** trade · **cited waves:** TR-1, TR-2, TR-5, GR-1
**SLOTS:** `{settlement}` `{counterpart}` `{house}` `{good}` `{route}` `{band}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[instrument]` {house} lent to the seat of {settlement} and asked for the {route} in the terms; the debt is a grievance now, and the {route} with it.
2. `[answer]` {counterpart} took the wagons and sent nothing back — the next bargain out of {settlement} will be dearer for it.
3. `[charge]` {house} has settled the debt and not the entry; the {settlement} wharf still prices the name {band} below what it took before.
4. `[gate]` A merchant's broken word buys no march: {settlement} holds its grievance against {counterpart} and has nothing in the war book to set beside it.

**TELLING**
5. `[instrument → succession → answer]` The credit was extended in a good season and called in a bad one. {counterpart} took the {good} and sent nothing back; the wharf waited for a cargo that never came and stopped waiting in the autumn; the book carried {counterpart} in the column of debts unanswered; and when the season turned again the severance was entered as a betrayal with {reason} on the record — a casus commercii, in the commerce ledger, where it stays.
6. `[charge → gate]` The default prices {counterpart} up in every join read that weighs taking it in, and draws the counter-coalition onto it, and hands {settlement} nothing whatever to march on. A commercial betrayer becomes hard to ally with and easy to gang up on. It does not thereby acquire a war reason, and no clerk in either town can make it one.
7. `[charge → succession]` The guild book records the default and the record outlives the money: {timeband_since} the debt is discharged and the entry is not, factors who once took {house}'s word ask for it in writing, and nobody has accused {house} of anything and nobody deals with it on a handshake either.
8. `[origination → belief]` The relief came first and is read last. {house} opened its granaries to {settlement} in a lean month and took no profit on it; the town called it kindness and the clerks entered it as a loss; and when the seat came asking again, both sides were reading the same entry and reading it differently — which is how a generous book becomes a disputed one without a word of it changing.

**SUBHEADER**
9. `[plain]` {settlement} extended credit to {counterpart} under the compact; {counterpart} did not repay what it owed in {good}, and {settlement} has recorded the default as a betrayal-class severance.

---

### JF-T-venture_to_ruin — TRADE → TRADE
> *the house that overreached — the venture failed, the books broken, the name ruined, the bloc realigned*

**Chain:** within-layer (no CPL direction) · **cause:** trade · **effect:** trade · **cited waves:** TR-7, TR-2, TR-6, TR-9
**SLOTS:** `{settlement}` `{counterpart}` `{faction}` `{house}` `{good}` `{route}` `{band}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[origination]` The {house} venture is lost on the {route}, and the books that carried it stand at {band} by the end of the same season.
2. `[belief]` {house} staked its season on a band at {counterpart} it had heard and never seen; the {route} settled the question.
3. `[charge]` {house} is broken — not by one bad season, but by one bad season arriving after everything else.
4. `[gate]` {house} called the venture back before the second stage, sold the cargo where it stood, and kept its books; no ballad will be made of it.

**TELLING**
5. `[belief → succession → charge]` It was a modest proposal, as every ruin in the guild book was. The stake stood above {house}'s own standing practice with the reason entered as {reason}; the wagons went out heavy with {good} and half the quay came to watch them load; the news came back to the {settlement} quay before the season did, and came back alone. The stake was struck out with nothing set against it, and the books closed at the bottom band with the interests struck out one by one.
6. `[charge → succession]` The family survives the books. The name will trade again in somebody's grandchildren's time or it will not, and until then every bargain it asks for on this coast is priced against one voyage that did not come back.
7. `[succession → origination]` The partners did not go down with it. The marks that shared one tarpaulin are on other tarpaulins {timeband_since}, {faction} keeps books on the {settlement} quay where {house} kept them, and the carters have a choice of employers again and have discovered that they enjoy it.
8. `[origination → charge]` The joint stake had a second failure inside it: {faction} did not put in its share and {house} carried the venture alone, the unpaid share entered against {faction} in {house}'s book and in the guild's. When the road took the venture, {house} was ruined by the road and {faction} by the entry — and only one of those two can be argued about.

**SUBHEADER**
9. `[plain]` {house} staked a venture above its standing practice and the venture failed on the {route}; {house}'s holdings and credit have both fallen, and its interests at {settlement} have been struck out.

---

## §1.4c THE FAITH CHAINS (faith → faith)

### JF-F-tithe_to_schism — FAITH → FAITH
> *the levy on the altar that splits the altar — pressure, dispute, contest, and the remnant floor that decides split from suppression*

**Chain:** within-layer (no CPL direction) · **cause:** faith · **effect:** faith · **cited waves:** WF-7, WF-5a, WF-8, WF-4
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{faction}` `{temple}` `{creed}` `{rival_creed}` `{timeband_since}`

**HEADLINE**
1. `[origination]` The render at {settlement} outran the piety that paid it, and the temple it paid for keeps two congregations now.
2. `[charge]` {temple}'s render came in whole while the benches thinned under it, and the two facts sat a season apart in the same book.
3. `[succession]` The tithe dispute went to {counterpart} for arbitration and came back a schism {timeband_since}.
4. `[gate]` {settlement} had no room for a second rite: the weaker congregation was evicted, and the split closed as fast as it opened because the slots were never there for it.

**TELLING**
5. `[answer → succession → origination]` It began as a question of what the render was owed on: {npc} and the steward could not agree, the legate was sent for, and {faction} was calling it a tax dispute while the unaffiliated rolls grew the whole time the argument ran. When it broke, it broke along the altar — the old rite keeps the nave and the new keeps the crypt, both halves claim {creed}, and the roster carries a congregation for {rival_creed} that is impaired, tolerated, and very much alive.
6. `[gate → charge]` The capacity floor is the whole difference between a schism and a suppression. Where the slots existed, {settlement} lives with two congregations under one roof and no agreement about the roof; where they did not, {temple} absorbed what was left of the other, and nobody calls that a reconciliation.
7. `[origination → belief]` The render had been forgiven once at {settlement}, in a worse year than this one, and the parish had not forgotten it. The new demand was read against that entry — which is why the argument went to the altar instead of to the steward, and why {temple} could not settle it by explaining the arithmetic.
8. `[succession → instrument]` Neither half calls itself the new thing. Both claim {creed}, both keep the calendar, both send to the same chapter house, and the register at {settlement} will be carrying two entries under one name {timeband_since}, under a clerk's note nobody has ever settled.

**SUBHEADER**
9. `[plain]` {temple} raised the render at {settlement} and the parish disputed it; the congregation has split, and {settlement}'s institution roster now carries a second congregation.

---

### JF-F-suppression_to_underground — FAITH → FAITH
> *the creed driven under the floor — suppression, the covert rite kept, and then exposure or flight*

**Chain:** within-layer (no CPL direction) · **cause:** faith · **effect:** faith · **cited waves:** WF-5b, WF-8, WF-1
**SLOTS:** `{settlement}` `{npc}` `{faction}` `{temple}` `{creed}` `{route}` `{band}` `{reason}` `{timeband_since}`

**⚠ TRUNCATION NOTE (fail-closed, J-CPL-5).** The middle of this chain is
covert. A player-projected telling from the suppression ENDS at the
suppression and says the trail goes cold; it renders no stub, no count, and no
gap a player could read as concealment, and it is byte-identical to a telling
over a chain that genuinely ended there. The public molds below therefore join
suppression → exposure or suppression → surfacing with NO clause presuming the
cellar before the cellar is public. That is why molds 1 and 3 are shaped as
they are, and it is not a stylistic choice.

**HEADLINE**
1. `[succession]` {creed} was put down at {settlement}, and the undercroft gave it back {timeband_since}.
2. `[answer]` {settlement}'s seat made {creed}'s punishment public and gave {reason} for it, and the crowd that came to watch is what {creed} has grown by since.
3. `[belief]` The register held {creed} extinct at {settlement}; the doors of {temple} opened {timeband_since} and what walked out was not strangers.
4. `[gate]` *[dm-only]* Tolerance did at {settlement} what the constables could not: the rite was left alone until there was nobody left who thought it worth keeping.

**TELLING**
5. `[origination → succession]` *[dm-only]* The suppression did not scatter them. A share of {creed}'s faithful went to the cellars and took the vessels with them; {npc} keeps a list of who still comes and keeps it where it will not be found; the words are said over a table and a handful answer them; the keeper who could not stay took the {route} out, and the wanderers' register carries that name now. The public record shows {creed} extinguished at {settlement}. {band} know better, and have known since the doors were barred.
6. `[carriage → answer → charge]` It was found the ordinary way: a talkative neighbour, and then {faction} at the undercroft door. {npc} was taken up with the vessels, the seat has the names and is reading them off the market cross for {reason}, and a parish that had not thought about {creed} in years is thinking about very little else this week.
7. `[answer → origination]` The purge was thorough and it was public, and both of those turned out to be the mistake. The crowd that came to watch stayed to listen; the pews filled in defiance; {creed}'s share at {settlement} has risen since. {faction} meant it as a warning, and it was received as an invitation.
8. `[belief → succession]` The suppression lifted and the rite came up out of the cellars where it had been the whole time. The roster restores {creed} to standing, and the ministers who presented themselves were strangers to nobody. The entry calling it extinct is still in the book, uncorrected, directly above the entry that restores it.

**SUBHEADER**
9. `[plain]` {settlement} suppressed {creed} and struck its standing from the roster; {creed}'s rite was found still being kept at {settlement}, and those keeping it have been named.

---

### JF-F-omen_to_failed_prophecy — FAITH → FAITH
> *the wrath read into the famine, and the reading the harvest refuted — the institution charged off its own calamity*

**Chain:** within-layer (no CPL direction) · **cause:** faith · **effect:** faith · **cited waves:** WF-4, WF-8, WF-1
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{temple}` `{creed}` `{rival_creed}` `{calamity}` `{when}` `{timeband_since}`

**HEADLINE**
1. `[belief]` The priests of {settlement} read the failed harvest as {creed}'s wrath, and named the season it would lift.
2. `[charge]` {npc} named {when}; {when} came and went, and {temple}'s standing at {settlement} fell for it.
3. `[answer]` {temple} called a rite of penance against the {calamity} and named a season for its lifting; the ledger closed the reading failed.
4. `[gate]` The reading held at {counterpart}: what was promised arrived, the ledger closed it fulfilled, and the sceptics there have had nothing cheap to preach all year.

**TELLING**
5. `[belief → answer → charge]` Nobody at {settlement} asked whether the harvest failed for weather; they asked whose fault it was. The pulpit answered wrath, called a rite of penance, and named {when} for its lifting — and attendance was not being described as voluntary. {when} came. The ledger closes the reading failed, the sink widens, and {temple}'s standing fell on a promise the parish had already been asked to pay for.
6. `[carriage → belief]` The same {calamity} crossed both parishes on the same wind: {settlement} called it judgment and {counterpart} called it patience. The two pulpits agree on the facts and on nothing else, and the sacred quarrel between them is warmer for it.
7. `[charge → succession]` The institution is charged off its own calamity, which is the shape of the thing: {temple} named the cause, the parish paid the penance, and the failure was entered against the namer rather than against the weather. That entry stands in the roster {timeband_since}, long after the harvest itself recovered, and it is read every time the same pulpit opens its mouth about a season.
8. `[gate → charge]` {temple} has stopped mentioning the promise and the parish has not. The next reading out of that pulpit will be weighed against this one before it is finished — and {rival_creed}'s ministers have discovered that the cheapest sermon in {settlement} is the one somebody else preached and could not keep.

**SUBHEADER**
9. `[plain]` The priests of {settlement} read the {calamity} as {creed}'s wrath and named a season for its lifting; the season passed without it, and {temple}'s standing at {settlement} has fallen.

---

## §1.4d THE POPULATION CHAINS (pop → pop)

### JF-P-boom_to_bust — POP → POP
> *the believed boom and its bust — the rush, the wall, the turned-back column, and the letters home that correct the promise*

**Chain:** within-layer (no CPL direction) · **cause:** pop · **effect:** pop · **cited waves:** POP-1, POP-5a, POP-6
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{faction}` `{house}` `{good}` `{route}` `{band}` `{timeband_since}`

**HEADLINE**
1. `[belief]` The word out of {counterpart} promised wages for any hand that came, and {settlement} believed it enough to empty its own lanes.
2. `[carriage]` Every cart back from {counterpart} has carried somebody home {timeband_since}, and not one of them repeats the word that sent them out.
3. `[gate]` The column out of {settlement} reached {counterpart} and found no room: the stores were counted at the gate, the count refused it, and {band} took the {route} back the way they had come.
4. `[charge]` {settlement} sent {band} down the {route} in the spring and fed them through the winter regardless.

**TELLING**
5. `[belief → carriage → gate]` It began with one voice in a market: {npc} named {counterpart} once, and a road filled. Nobody in {settlement} had seen the {good} of {counterpart} and nobody doubted it either. The young went out at the sowing; the stores at {counterpart} were counted at the gate; and the gate was held against them by men who had to look at them while they held it.
6. `[carriage → charge]` The roll closed the year where it opened, by a different road. The letters came first and the people after; {settlement} lost {band} to {counterpart} and got most of them back, older, with the tools they had carried out and nothing else they had carried out. It will hear the name {counterpart} {timeband_since}, and hear it as a warning.
7. `[origination → belief]` *[dm-only]* The wealth of {counterpart} was put about deliberately: {faction} wanted the road full, {house} planted the word in {settlement} and did not plant it for nothing, and the column is walking exactly where {faction} would have it and cannot know that. The cost of the word is in {house}'s book, under a heading that means nothing to a clerk.
8. `[belief → succession]` *[dm-only]* The word was false when it was planted and has since come nearly true, which was nobody's design. {counterpart} keeps the houses raised for the ones who did not stay; {settlement} keeps the story about who first said it; and neither town's version has the buyer in it.

**SUBHEADER**
9. `[plain]` A report of work and {good} at {counterpart} drew a column out of {settlement}; {counterpart} refused the column at its gate, and {settlement}'s people returned.

---

### JF-P-petition_to_riot — POP → POP
> *the rung ladder — petition, gathering, refusal, riot; and the seat that answered instead, for less*

**Chain:** within-layer (no CPL direction) · **cause:** pop · **effect:** pop · **cited waves:** POP-2, POP-6
**SLOTS:** `{settlement}` `{faction}` `{band}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[succession]` {settlement} petitioned its seat over {reason} in the spring, and the square filled when the answer did not come.
2. `[origination]` The streets of {settlement} rose over {reason}, and nothing in the rising was new to the hall.
3. `[charge]` {settlement} is counting what that night cost {timeband_since}, and the paper that asked first cost nothing at all.
4. `[gate]` {settlement}'s seat answered at the first rung, and the grievance closed in the hall, which is where it should have closed.

**TELLING**
5. `[succession → answer → charge]` It was a ladder and every rung was climbed. A paper carried to the hall and held there until it was taken; the square full and the stalls not, with nothing broken that day and everyone marking the day; the seat's call refused with {reason} named; and then the gates off the granary, and very little of it carried away. {faction}'s writ did not run in {settlement} for a night. By the next market day the square was a market again, and the counting had started.
6. `[answer → charge]` The other hall answered at the first rung: the grievance closed where it opened, the ledger shows the drain the answering cost, and the seat learned that asking works — a thing a seat may live to regret, and cheaper by every reckoning than the granary gate.
7. `[gate → charge]` The refusal has a bill of its own. The call went out and the commons did not come; the muster stood {band} short; and {settlement}'s captains marched with what the hall could persuade rather than with what the roll promised, which is a different army and was treated as one.
8. `[succession → gate]` Nothing was settled in {settlement} and everyone was tired. The anger went out of the streets and into the memory of them, the seat will think twice before the next call, and {timeband_since} the commons still count that as the win — which it is, and it is also the only one they got.

**SUBHEADER**
9. `[plain]` The commons of {settlement} petitioned the seat over {reason} and were not answered; the square filled, and the crowd broke into the granary.

---

### JF-P-exodus_to_refounding — POP → POP
> *the generation that left and the grandsons who came back — departure memory, the kin pull, the ruin raised again on the old stones*

**Chain:** within-layer (no CPL direction) · **cause:** pop · **effect:** pop · **cited waves:** POP-3, POP-6, POP-1
**SLOTS:** `{settlement}` `{counterpart}` `{house}` `{temple}` `{route}` `{band}` `{timeband_span}` `{timeband_since}` `{timeband_age}`

**HEADLINE**
1. `[succession]` The names {settlement} lost to {counterpart} were never struck from its rolls, and {timeband_since} the grandsons of that departure are walking back down the {route}.
2. `[origination]` The tie {settlement} kept with {counterpart} is {timeband_age}, and it filled a road again this spring.
3. `[gate]` The names stopped being said at the turning of the season, the band crossed to none, and the road that would have carried the grandsons carried nobody.
4. `[charge]` {settlement} keeps the going to {counterpart} as an errand it ordered rather than a loss it took; there is a return expected on it, and the town has not forgotten to expect it.

**TELLING**
5. `[origination → succession → carriage]` The departure has a grammar and {settlement} chose one: they left because they had to, and the town has never quite forgiven them for it. The {temple} still reads the roll of the ones who took the {route} at the turning of the season; a house that lost its people to {counterpart} will not lend to {counterpart}; and the band that all of that keeps alive is the same band the road runs back along.
6. `[succession → origination]` The pull is kin and not wages. The band between {settlement} and {counterpart} crossed {timeband_span} still strong, and when the road filled again it filled along the entry that kept it — the clerks entered {band} of arrivals and did not have to ask where from, which is the whole difference between a homecoming and a rush.
7. `[gate → succession]` Where nobody kept it, the band crossed to none. The {counterpart} line went out of the {temple}'s roll without anyone deciding it should, and {house} stopped counting its people there among its holdings. The rows are all still in the book. Nothing reads them, and nothing will.
8. `[succession → origination]` The town died and the account did not. The stones stayed on the map and the memory stayed in a neighbour's roster, and when the resettlement came it came out of the towns that had entered the departure — the ruin raised again after {timeband_span} of nobody, by the descendants of the ones who left it, on the old foundations because those were the ones somebody still had the shape of.

**SUBHEADER**
9. `[plain]` {settlement}'s people departed for {counterpart} and the departure was entered in {settlement}'s memory; the tie between the two settlements held, and a settlement has been raised again on {settlement}'s old site by arrivals from {counterpart}.

---

## §1.4e THE INFORMATION CHAINS (info → info)

### JF-I-lure_to_war — INFO → INFO
> *the bait that was taken — the plant commissioned, the lure sprung, the march made on a story somebody paid for*

**Chain:** within-layer (no CPL direction) · **cause:** info · **effect:** info · **cited waves:** IN-0a, IN-2, IN-3, IN-5
**SLOTS:** `{settlement}` `{counterpart}` `{faction}` `{house}` `{season}` `{route}` `{band}` `{timeband_since}`

**⚠ TRUNCATION NOTE (fail-closed).** Everything before the march is covert. A
public telling walking back from the march reaches the muster count and stops
there; it never renders the commission, the buyer, or the price until an
exposure receipt exists on the chain. The public molds below (3, 4, 6, 7) are
all downstream of an exposure and entailed by it.

**HEADLINE**
1. `[belief]` *[dm-only]* The weakness {faction} marched on was true in one ledger only, and that ledger had been paid for.
2. `[origination]` *[dm-only]* {faction} bought its picture of {counterpart}'s strength from {house} {timeband_since}, and put a column on the {route} road without ever seeking a second reading.
3. `[gate]` The muster has stood down at {settlement}: what {house} sold about {counterpart} did not survive the second road it was checked against.
4. `[charge]` The war {faction} wanted is running, and so is the account of who paid to start it, kept at {counterpart} and kept carefully.

**TELLING**
5. `[origination → belief → succession]` *[dm-only]* Coin crossed a table at {settlement} and a telling about {counterpart} went out under {house}'s seal. It arrived slowly, the way true things do, and was taken for one; {timeband_since} it was quoted in {faction}'s council as common knowledge, with nobody able to recall who had brought it in. The commission is discharged in full — the mark bought the story, and then bought a war with it.
6. `[origination → charge]` The forgery came home named. {counterpart}'s clerks hold the telling and the forger's price in one file, the grievance ledger opens with it, and the buyer's name is written underneath. What was meant to move an army moved an accounting instead, and {faction} will be paying it in {counterpart}'s courts for a long while.
7. `[gate → succession]` It did not always work. {faction}'s captains had the tale out of {house} and better word off two roads besides; the live muster showed an equal host, and the march was refused on the count. The story stands, and stands unspent, and the coin that bought it is still gone.
8. `[belief → belief]` *[dm-only]* Two courts, two bluffs, one war neither wanted. {settlement} reckoned {counterpart}'s garrison at a strength {counterpart} had invented, and {counterpart} returned the favour; each was certain of the other's weakness and each was the author of it. The tellings expired {band} apart in {season}, and it was the gap between those two expiries, and nothing wiser, that decided whether this was a scare or a war.

**SUBHEADER**
9. `[plain]` A false report of {counterpart}'s strength was commissioned and put about; {faction} acted on that report and marched on {counterpart}.

---

### JF-I-plant_to_backfire — INFO → INFO
> *the lie that charged its own author — exposure, blowback, and every later signal converging slower*

**Chain:** within-layer (no CPL direction) · **cause:** info · **effect:** info · **cited waves:** IN-0a, IN-1, IN-3, IN-5
**SLOTS:** `{settlement}` `{counterpart}` `{faction}` `{house}` `{band}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[gate]` Two tellings out of {house} cannot both be true; {counterpart}'s factors have said so at every quay, and the stamp is worth {band} less this season.
2. `[charge]` {house} at {settlement} was paid for the telling and is paying for it yet — the coin was counted once, and the custom has not stopped leaving.
3. `[origination]` {faction} paid for a weapon against {counterpart} and made a claim against itself instead: the telling came back with a buyer's name attached, and {counterpart} is the party holding it.
4. `[succession]` The telling is still quoted and {house}'s stamp is not; {timeband_since} the two have travelled separately.

**TELLING**
5. `[origination → gate → charge]` The commission was cheap — less than a season's tolls to have {counterpart} told a thing that never happened. It took, and it was quoted, and then it was checked: the telling did not match what the roads were bringing, {reason} was written beside {house}'s stamp in every counting-house that keeps one, and {faction}'s buying is on the record now. The record travels better than the story did.
6. `[charge → succession]` The bill is not paid at once and never stops being paid. {house}'s word is taken in writing where it was taken on a handshake; its next true telling is weighed longer than a stranger's would be; and the courts that had their whole picture of {counterpart} from {house} now wait for a second road before they act on anything. Everything out of {settlement} arrives later than it used to, and nothing out of it arrives alone.
7. `[gate]` Not every commission lands. The bought story reached a court already better served off two roads, agreed with neither, and thinned and stopped. {house} was paid all the same, because a commission buys a telling and never a believing — and somewhere a ledger still shows the price of it.
8. `[succession → carriage]` The forgery outlived its usefulness and did not stop working. It is carried {timeband_since} by couriers who never knew its author, cited by courts that never bought it, in quarrels it has no part in — and the file that names the author is copied along with it every single time.

**SUBHEADER**
9. `[plain]` {house} sold a false telling about {counterpart}; the telling was contradicted by other accounts arriving at {settlement}, and {house}'s credibility has fallen.

---

### JF-I-courier_to_treason — INFO → INFO
> *the channel that was already theirs — the turned courier, the divergent accounts of one parlay, the treason named*

**Chain:** within-layer (no CPL direction) · **cause:** info · **effect:** info · **cited waves:** IN-4, IN-3, IN-5, IN-0b
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{faction}` `{house}` `{route}` `{reason}`

**⚠ TRUNCATION NOTE (fail-closed).** The turning and the send-two read are both
covert. A player telling from the accusation reaches the divergent accounts and
stops: that two accounts arrived and disagree is public; WHY they diverge is
not. No public mold below names the detour, and none gestures at one.

**HEADLINE**
1. `[origination]` *[dm-only]* {faction} has a courier it trusts and {house} has a courier it owns, and they are the same man.
2. `[belief]` Two accounts of one parlay reached {settlement} by two roads, and the seat has begun asking which road it paid for.
3. `[answer]` {npc} was taken up at the gate of {settlement} as treason, on a divergence nobody has yet explained.
4. `[gate]` The exoneration of {npc} is filed under {settlement}'s ruling rather than over it, because that is the order the roads delivered them in.

**TELLING**
5. `[carriage → belief → answer]` *[dm-only]* The channel was theirs before the errand was. {npc} carried {faction}'s cargo off the {route} road to {house} first and to {counterpart} after, and the second telling was not the first; the detour cost a leg and the leg shows, because the packet arrived late and altered. When the seat sent two and read them together, the divergence sat exactly where the detour had been — and the name that came out of that reading was {npc}'s.
6. `[answer → charge]` The sweep that followed caught what sweeps catch: some of it was the channel, and some of it was a neighbour with a grudge and a name to offer. The false accusation is entered as reputation and as nothing else — no fate is written against it anywhere in the book — and {settlement} goes on living beside both entries and both families.
7. `[gate → charge]` Both tellings are filed together at {settlement}, the false one first and the true one underneath it. {counterpart}'s letter came in on the evening tide; the gate had been answered at noon. The seat acted on {reason} and learned better, and the acting cannot be taken back. Nobody lied. The road did the rest.
8. `[succession]` *[dm-only]* The engagement closed, and the patron's side of it closed too: {house}'s book shows a courier withdrawn and {faction}'s shows one gone quiet, and only one of those two is a decision. Neither book says which.

**SUBHEADER**
9. `[plain]` Two accounts of the same parlay reached {settlement} and did not agree; {settlement} named {npc} in treason on the divergence between them.

---

## §1.4f THE GRAMMAR CHAINS (grammar → grammar)

### JF-G-signed_to_lapse — GRAMMAR → GRAMMAR
> *the compact that died of old age — signed, frayed, hollowed, lapsed, and until GR-0 nobody said so aloud*

**Chain:** within-layer (no CPL direction) · **cause:** grammar · **effect:** grammar · **cited waves:** GR-0, GR-1, GR-2, GR-5, GR-6
**SLOTS:** `{settlement}` `{counterpart}` `{term}` `{route}` `{timeband}` `{timeband_span}` `{timeband_age}`

**HEADLINE**
1. `[succession]` The {term} between {settlement} and {counterpart} ran to its last season and stopped there, and neither court marked the day.
2. `[instrument]` The {term} binding {settlement} and {counterpart} is {timeband_age}, and it is kept now by clerks who inherited it rather than by anyone who chose it.
3. `[charge]` Nothing was repudiated between {settlement} and {counterpart} — {timeband} short wagons, and then somebody weighed them.
4. `[gate]` A mediator sat the two courts down over a pact neither had broken, and the {term} was re-cut rather than let go.

**TELLING**
5. `[instrument → succession → charge]` It was signed by hands the market can no longer name, and it kept its word as long as anybody was watching. The parchment went soft at the folds. The wagons came a little short and then a little shorter, season upon season, and the clerks of {settlement} weighed what arrived against what the {term} promised until the ledger would not close. It ended by the calendar and not by anger, and nothing written stands between the two courts now.
6. `[gate → succession]` *[dm-only]* On every surface a free eye can reach it reads honored. {settlement} has sent less than it swore through {timeband_span}, and {counterpart}'s watchers sit too far off to weigh it. The default is real, the detection never came, and the pact will end in good standing — which is the ending the record will carry.
7. `[succession → gate]` The {route} between {settlement} and {counterpart} is open again, to anything. The captains marked the week the pact lapsed and said nothing further about it. Where a treaty stood there is now distance and habit, and habit forbids nothing.
8. `[instrument → answer]` The renewal window opened and nobody stood in it. A demand could have been made, a {term} re-cut, the whole arrangement carried another span — and {settlement}'s chancery let the season pass, which the clerks entered as a decision because there was nothing else to enter it as.

**SUBHEADER**
9. `[plain]` The {term} between {settlement} and {counterpart} was signed long ago and ran short in its later seasons; it has now reached its date and ended, and no agreement stands between the two settlements.

---

### JF-G-succession_to_repudiation — GRAMMAR → GRAMMAR
> *the heir at the oath — the succession question opened, and the father's signature disavowed or reaffirmed*

**Chain:** within-layer (no CPL direction) · **cause:** grammar · **effect:** grammar · **cited waves:** GR-4, GR-2, GR-5, WR-0c
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{term}` `{band}` `{reason}` `{timeband_since}`

**HEADLINE**
1. `[succession]` The old seat swore it; {npc} sits where the oath was given and has not said whether the oath is his.
2. `[answer]` {npc} will keep the word the old seat gave, and {counterpart} has stood its captains down.
3. `[origination]` {npc} has torn up the treaty his predecessor swore, and every term under it is broken from this week.
4. `[instrument]` The new seat let the date go by without answering it, and the {term} stands on that silence alone, which is all the law requires of it.

**TELLING**
5. `[succession → answer → charge]` The seat changed, and {band} oaths another hand had sworn became questions in the same week; {counterpart} sent no envoys until it heard. The answer came aloud and it was no. The parchment is kept only as evidence now, the terms defaulted from the day of the saying, and the courts have started pricing what a promise out of {settlement} is worth.
6. `[instrument → gate]` The question was never answered at all. No word came, the date passed, and silence honored the oath — a thing the law says plainly, and which the captains of {counterpart} spent a whole season declining to believe.
7. `[charge → gate]` The charge is not against the treaty; it is against the line. This house has disavowed {band} times before and the entry has sat {timeband_since} in every chancery that keeps such entries, so the refusal that comes back to {settlement}'s next proposal will name the credibility and never the terms — and there will be no arguing with it, because there are no terms to argue.
8. `[answer → charge]` There was a quiet road and {settlement} did not take it. The herald read the renunciation out in the square and the clerks defaulted every {term} the same hour, with {reason} entered beside it. Nothing was seized and nothing was burned. Only the signature lost its value, and it lost all of it at once.

**SUBHEADER**
9. `[plain]` The seat of {settlement} changed and the new holder was asked whether the old oath stood; {npc} disavowed it, and every term under the treaty with {counterpart} is defaulted.

---

## §1.4g THE INTERIOR CHAINS (interior → interior)

### JF-N-strain_to_coup — INTERIOR → INTERIOR
> *the king who paid — tribute strain attributed inward, the crowd reading the drain, the seat that fell for a bill it did not incur*

**Chain:** within-layer (no CPL direction) · **cause:** interior · **effect:** interior · **cited waves:** INT-4, INT-1, INT-3a, INT-7, INT-8
**SLOTS:** `{settlement}` `{counterpart}` `{npc}` `{burden}` `{good}` `{band}` `{reason}`

**⚠ THE ENTAILMENT THAT DEFINES THIS FAMILY.** The strain→fall link is
BELIEF-SIDE. `attributed_pressure` records the burden and records the standing
and **joins neither** — the hall does the joining. Every mold below therefore
takes `belief` or an observer's connective at that link and NEVER `origination`
or `charge`: a mint connective there would assert a causal edge the engine
deliberately does not carry, and would quietly turn the volume's sharpest
honesty receipt into a lie. Mold 6 is the single exception and is permitted
because `pressure_named_cause` is exactly the receipt that DOES name a cause;
mold 2's `charge` is warranted by the `paid_and_fell` ending token, which
states the cost itself.

**HEADLINE**
1. `[belief]` {settlement}'s hall has charged the tribute of {counterpart} to its own seat; the book records both and joins neither.
2. `[charge]` Not one payment to {counterpart} left {settlement} late, and the hall took the seat from {npc} for exactly that.
3. `[gate]` The terms were sealed in {settlement} and never read out, and what the town could not read, the town supplied.
4. `[succession]` The grievance in {settlement}'s hall emptied into the muster field, and the hall has been quiet since it did.

**TELLING**
5. `[belief → succession → charge]` The terms were sealed and the town believed the worst of them, which is customary. Season by season the installments left on time; season by season the standing of the seat that sent them fell; {burden} stood on {settlement} the whole while and the hall grew short. Nothing in the book joins those two columns. Everyone in the hall joined them, and at the verdict the book was what they read out.
6. `[origination → charge]` Once it was not the tribute at all. {settlement}'s seat lost standing for a named cause — {reason}, exposed and entered — and the clerks can point to the week and to the reason, which is rarer than it sounds. The tribute and the war stood exactly where they had stood. The rest was weather.
7. `[charge → answer]` The strain reached the books before it reached the square. The seat's counsel and the town's reading came apart, and then collapsed together under a season that frightened both, and the grievance opened in the hall once the wagons had gone out. {npc} fell for a bill another court had written and a treaty required {settlement} to pay.
8. `[succession → belief]` The other ending is the same arithmetic read later. {settlement} looked at the price, and at the quiet the price had bought, and stopped complaining; the {good} is entered now beside the peace it bought rather than against the seat that paid it. The entry did not move by {band}. The reading did, and the reading is what a verdict is.

**SUBHEADER**
9. `[plain]` {settlement} paid the tribute owed to {counterpart} and the payments are recorded as met; the standing of {settlement}'s seat fell over the same seasons, and the hall has moved against {npc}.

---

### JF-N-burial_to_digup — INTERIOR → INTERIOR
> *the grudge buried at a price, and the party that never forgave the burying digging it up again*

**Chain:** within-layer (no CPL direction) · **cause:** interior · **effect:** interior · **cited waves:** INT-6, INT-5, CV-4
**SLOTS:** `{settlement}` `{counterpart}` `{third_party}` `{npc}` `{faction}` `{temple}` `{wound}` `{good}` `{band}` `{timeband}`

**HEADLINE**
1. `[answer]` {settlement}'s seat ordered the {wound} with {counterpart} closed, and set the price of the closing in the same decree.
2. `[succession]` The decree outlasted {timeband} patience: {faction} has waited in the open since it was read, and has asked the seat to unbury it.
3. `[gate]` {settlement} buried its grudge with {counterpart}; {counterpart} has buried nothing, and a decree binds only the hall that made it.
4. `[charge]` {settlement} bought the closing of the quarrel at a price its own clerks entered, and a later hall has given the closing back and kept the bill.

**TELLING**
5. `[answer → gate → charge]` {npc} named the {wound}, named its price, and had both read out in the square of {settlement} before witnesses who will outlive the seat that swore it. The rows stayed in the book and stopped being counted when the hall counted {counterpart}: the war party could read them and could not cite them, and the standing grievance read {band} lighter for it. It held past the doubting season. Then a later hall cited them anyway, word for word, and {counterpart}'s book gained the old {wound} back and a new one for the revoking.
6. `[instrument → gate]` The price is the thing that binds it, and where the granary could not answer the decree there was no peace and only a declaration. {npc} promised {counterpart} more {good} than {settlement} had; the clerks entered the shortfall; the carts never left the yard; and the {wound} is exactly where it was, with a broken promise sitting on top of it.
7. `[belief → gate]` A court can only bury what it believes it is holding. The grain was given, and {counterpart} took the carts and thanked {settlement} for them and kept its quarrel, because the quarrel was never the one that was bought. The price was paid in full against the wrong account, and the {temple} that witnessed the swearing has been asked about it twice since.
8. `[gate → succession]` The burial closes {settlement}'s own reads of {counterpart}, and once {counterpart} answers in kind it closes {counterpart}'s of {settlement}, and it closes nothing at all in a third hall. {third_party} holds its entry untouched by a peace it was never party to, and reads it at every reckoning. That is why the digging up matters, and why the world's memory is not one court's to close.

**SUBHEADER**
9. `[plain]` The seat of {settlement} decreed the grudge with {counterpart} buried and paid the price set for it; {faction} petitioned against the burial, and the seat has revoked it.

---

## §1.5 — CENSUS OF §1, AND THE NOTES HANDED UP

**Four blocks were authored in parallel and merged here. This is the one census;
the four block-scoped ones it replaces disagreed with each other in three
places, and each disagreement is resolved below rather than left standing.**

### The count, measured on the merged file

| Block | Families | HEADLINE | TELLING | SUBHEADER | Molds | `[dm-only]` |
|---|---|---|---|---|---|---|
| §1.1 — CPL-1 … CPL-10 | 20 | 88 | 43 | 20 | 151 | 3 |
| §1.2 — CPL-11 … CPL-20 | 20 | 100 | 45 | 20 | 165 | 10 |
| §1.3 — CPL-21, story canon, signature stories | 19 | 58 | 58 | 19 | 135 | 0 |
| §1.4 — the within-layer chains | 19 | 75 | 75 | 19 | 169 | 14 |
| **§1 entire** | **78** | **321** | **221** | **78** | **620** | **27** |

Edge tags across the six hundred and twenty: `charge` 150 · `succession` 148 ·
`gate` 148 · `origination` 119 · `answer` 106 · `belief` 83 · `plain` 78 (the
subheaders) · `carriage` 43 · `instrument` 40. All eight of §0c are exercised
in every block. Two counts read backwards to an unaided eye and are worth
stating: **`gate` is the corpus's heaviest join tag, not a rarity** — R-CAU-F
puts the negative on the angle palette and the coupling volume puts a
negative-hardest pin in every pair, so the counterforce always had a sentence
waiting for it; and `instrument` is the LIGHTEST, even though CPL-14, CPL-17
and CPL-19 are paper-bearing pairs, because a paper pair's molds mostly narrate
what the paper did rather than the drafting of it.

### What the merge corrected

- **The owner's HEADLINE exemplar was planted TWICE.** `JF-W-grievance_to_war`
  and `JF-W-razing_to_reckoning` were authored in parallel and each opened with
  it, word for word, each citing R-CAU-E. It now lives in exactly one place —
  the vengeance-license chain, which is the chain the sentence is about — and
  `JF-W-grievance_to_war` carries a re-cut mold 1 and a note saying why.
  `JF-W-grievance_to_war` also moved from §1.3 to §1.4a, where the within-layer
  war chains live.
- **Twenty families in §1.3 declared slots no mold spent** — sixty-five tokens
  in all. The corpus's convention is that a SLOTS line is the exact union of
  what its own molds draw, not what they might have drawn; §1.1, §1.2 and §1.4
  had already recomputed theirs mechanically and §1.3 had not. Every SLOTS line
  in §1 is now that union, in one canonical token order.
- **Two families carried no `gate` mold**, while both their blocks' censuses
  asserted that every family did: `JF-CPL-4a` (war → info) and
  `JF-SS-pilgrim_road` (faith → war). Each now carries the counterforce its own
  cited reads name — for the first, the pair of courts neither of which has ever
  been caught out, so nothing is discounted and the first honest offer ends it;
  for the second, the pact that reopens the road, which its own fence had
  already identified as the only receipted form the counterforce takes. **All
  seventy-eight families now carry at least one.**
- **Twenty molds measured their own join in loose words.** The three blocks
  applied three different readings of law 2, and the strictest one now governs
  as R-CAU-H: *inside the season · by the turn of the year · through the month ·
  for a fortnight · inside the week · a season longer · since the second season ·
  over several seasons · for seasons · a month … an afternoon · lasted a season ·
  for years · by the third market day · crossed the decade · the hours between ·
  for {band} seasons · the week after · inside a season.* Each now renders
  through a `{timeband_*}` slot or drops the measurement; none was replaced by a
  different measurement. Texture, cadence and point references stand untouched,
  because R-CAU-H's test distinguishes them and the distinction is the honest
  one.
- **The edge vocabulary was doubled.** §0c ruled eight typed edges and §3 keyed
  sixteen, and both §1 blocks that noticed flagged it rather than resolve it.
  R-CAU-I executes the fold §0c itself specified: eight tags, sixteen pools
  grouped beneath them, no connective line lost. Law 1 is now checkable against
  one key.
- **`{calamity}`, `{when}`, `{wound}`, `{burden}`, `{season}`, `{decision}` and
  `{standing}` were spent in prose and declared nowhere.** All seven are now in
  §0d's borrowed table, which is where a registration walker will look.
- **Three census claims were false and are corrected here.** The attributive
  `{timeband}` is NOT unspent — §1.3 and §1.4 spend it six times, and the column
  is warranted by use as well as by the exemplar. §1.3's own opening said one
  hundred and forty molds where its table said one hundred and forty-one. And
  "every family carries a `gate` mold" was asserted twice while two families did
  not; it is true now because it was made true, not because it was restated.

### The measured properties, re-checked after the merge

- **Zero digits in any mold, in any register.** Scanned over rendered prose with
  the variant numbering, the edge tags and the trailing provenance italics
  stripped, exactly as the sibling annexes' scan runs. The only digits in §1 are
  structural: block numbers, variant numbering, wave ids and section references.
- **No numeral word is used as a DURATION anywhere in §1.** Every duration
  renders through `{timeband}`, `{timeband_span}`, `{timeband_since}` or
  `{timeband_age}`.
- **Every family carries all three registers** (R-CAU-D), **no HEADLINE mold
  carries a chain of two or more links** (§0a's hard cap, checked by tag), and
  **every SUBHEADER is tagged `[plain]` and no other mold is.**
- **No mold sentence is duplicated anywhere in the file**, checked by normalized
  token match across all six hundred and twenty.

### Open for the chair — recorded, vetoable, none blocking

1. **NUMERAL WORDS ABOUT THINGS: one ruling, corpus-wide, still wanted.** Law 2
   reaches durations; counts of things are R-CPL-G's business. Counted rather
   than estimated, §1 carries them in three classes. **(a) Idiomatic and
   ordinal, the large majority** — *the two are one thing · for once · a
   congregation of one mind · the one choice · the first town · an older one*.
   A rule that swept these would break idiomatic English and should not be
   written. **(b) Structural pair-words** — *the two courts*, five occurrences,
   entailed by the pairwise-courts law, so the numeral asserts the law rather
   than a measurement. **(c) Genuine cardinal counts, eight, in seven molds** —
   *two towns eat off that walking* (JF-CPL-12a #2), *two readings* (JF-CPL-15a
   #6, JF-CPL-20a #4), *two temples* and *two congregations* (JF-CPL-15b #3 and
   #6), *paying twice* (JF-CPL-15b #2), *asked twice* (JF-CPL-16b #5), and
   *{settlement} sent two* (JF-CPL-19b #2). Seven of the eight fall cleanly to
   `{band}` or a plain plural. The eighth does not: SEND-TWO is the named
   counterforce of CPL-19 and cannot be said in band words without losing the
   mechanism, so a strict ruling costs JF-CPL-19b a rewrite rather than a
   substitution. **Rule once and the sweep is mechanical.**
2. **`JF-W-grievance_to_war` is below its frequency floor and is scheduled, not
   forgotten.** It is §1's only ROUTINE family — it fires at every war open —
   and it carries seven molds against the routine floor of eight to twelve. Its
   §1.4 neighbours carry nine. Deepening it is maintenance under the
   frequency-scaled floor's own words and should happen before wiring. Every
   other family in §1 is major or rare (a reformation, a crusade, an opium cycle
   and a diaspora return are not weekly events) and clears its floor of four
   with margin.
3. **A generalization worth minting: R-CAU-J, if the chair wants it.**
   `JF-N-strain_to_coup`'s discipline — *a receipt that records two facts and
   declares it joins neither may never be joined by a mint connective* — is
   stated inside that family because it is a property of that chain. It
   generalizes cleanly to every honesty receipt in the estate and would be the
   corpus's sharpest entailment rule if lifted to §0e.
4. **The HEADLINE register's length has no stated cap.** Measured across §1.3's
   headlines the mean rendered length is ninety characters, the longest at
   ordinary fills is one hundred and twenty-four, and the worst case at the
   longest fills of every slot is one hundred and thirty-two. The owner's own
   exemplar renders at eighty-five, so the tail is a tail and not a target.
   Offered as the envelope §1 actually ships if the chair wants a number.
5. **`JF-CPL-17b` mold 5 is the one mold in §1 whose warrant is not inside its
   own pair section.** It rests on the 2026-08-02 OWNER-OVERRIDE carried in
   DESIGN_WAR_CONVENIENCE_AND_TRIBUTE.md TB-3, against CPL-17's own DECLARED
   EMPTY that people are never the payment. It is written to the override's
   exact bound — anonymous columns, heads counted and none named — and is
   flagged so the wave assignment is confirmed rather than the apparent
   contradiction discovered.
6. **`JF-CPL-15a`'s epigraph paraphrases a figure rather than printing it.** The
   archetype names the ruler-stance share as a number; the epigraph reads "the
   largest single part" instead, because a bare numeral in a family header would
   be the one digit in §1. One edit reverses it.

### The fences a later editor is most likely to erode

- **Three families sit on VERIFY-AT-BUILD substrate**, and each says so in its
  own block rather than here, so an implementer meets the fence where the prose
  is: `JF-SC-danegeld_loop` needs the outcome-learning wire and carries its
  degradation path to `succession`; `JF-SS-pilgrim_road` must not price the road
  towns' pass-through take until the deferred slice lands; `JF-SS-rush_and_war`
  must not cite a migration treaty default until the compliance read exists.
- **Six families own a `cascade.braid.*` pool in RECEIPT_POOLS_COUPLINGS.md.**
  Those pools render the whole cascade as one lead item; these render the
  individual joins a telling composes from. No sentence is shared, and a merge
  that lets a join mold serve as a braid lead re-creates the C-LAW-1
  double-writer defect in content form. A collision check over the corpus caught
  two real duplicates against braid variants during authoring and both were
  re-cut; **the six braid families are the re-check list on every future edit to
  §1**, because they are the only place in the corpus where two files are
  allowed to talk about the same chain.
- **Twenty-seven molds are `[dm-only]`, in five clusters**, each tagged because
  the JOIN itself is covert and not merely because an actor is hidden (R-CAU-G):
  the bought seat, the planted belief before its exposure, the compromised
  channel, the turncoat's covert lane, and the underground congregation before
  it surfaces. Ten carry inline truncation notes, because in those the public
  and covert halves interleave along ONE chain and the fail-closed projection is
  not deducible from the mold text alone. Every public mold in the same families
  is written to be true whether or not the covert link exists.
- **`{third_party}` is spent and the row stays.** §1.1 left it declared and
  unused and asked that it be dropped if no sibling spent it; §1.2's faith-brother broker and
  §1.4's turncoat and burial chains spend it in eight molds. It is a genuinely
  three-cornered receipt slot and the corpus needs it.
- **CPL-18 is §1's one intra-settlement pair** and its two families are
  correspondingly slot-poor. That is honest rather than thin: the commons and
  the seat are the same town, and inventing a `{counterpart}` for symmetry would
  bake a foreign cause into a domestic chain. Flagged because a mechanical
  slot-count check across §1 will make those two look underweight.
- **CPL-20's archetype says "forgery" and no mold does.** CPL-19's DECLARED
  EMPTY forbids forged INSTRUMENTS corpus-wide, so the archetype renders as a
  PLANT that fell with the hand that placed it, and JF-CPL-19a mold 5 states the
  line positively — *nothing on the instrument is forged* — so the corpus says
  out loud what it will not do. If the chair ever lifts that ruling, JF-CPL-20a
  is the family that changes.
- **`{timeband}`'s attributive column prints its own article** ("a
  generation's"), so a mold writes `{timeband} grudge` and never
  `a {timeband} grudge`. Every mold in §1 follows it, and it is the single
  easiest thing for a later editor to get wrong.

---

# §2 CLAUSE FORMS

## §2.0 THE COMPOSITION CONTRACT AND ITS RESOLUTIONS

## Fable 5 content authoring, 2026-08-03, for DESIGN_FP_SPINE.md §2 SP-6's CAUSAL
## GRAMMAR amendment ("the narration kit gains the CAUSAL VOICE — authored prose for
## the JOINS, so the Herald can tell a chain as one sentence"). This block supplies
## two of the amendment's three content unit classes: (2) CLAUSE FORMS — the
## compressed one-clause telling of a kind, the piece the braid holds in its hand —
## and (3) CONNECTIVE POOLS keyed by provenance edge TYPE, the piece that joins two
## clauses without asserting anything the edge does not carry. The JOIN MOLDS keyed
## by the coupling taxonomy are §1's; nothing here duplicates them.
## Source kinds: the seven sibling annexes in this folder, whose variant 1 is the
## authority on what each receipt asserts. Where this block conflicts with a sibling
## annex, the sibling wins and the conflict is a bug to report. **Where it conflicts
## with THIS FILE'S own §0 header, the header wins** — §0 was authored concurrently
## with this block; the three reconciliations are recorded below rather than left
## to be found.

### §0-RECONCILIATION (this block against the annex header, authored in parallel)

- **Numerals in durations: the header is stricter, and the header wins.** §0b law 2
  bans numerals of ANY kind in a duration, explicitly overriding the sibling
  annexes' R-CPL-G (which permitted numeral WORDS). Two consequences, both applied
  here rather than argued: (a) the phrasing *ten years on* was struck from this
  block's band guidance; (b) `TRADE/pact.breached`'s sibling exemplar — *"Nine years
  the grain compact held; the ninth year broke it"*, which that annex itself flagged
  for the counts ruling — is NOT reproduced verbatim under R-W5-B. Its `F1` here is
  the de-numeraled *the grain compact broke*. This is a deliberate, recorded
  departure from the exemplar-verbatim rule, forced by a law that outranks it.
- **The band table is the header's, not this block's.** §0d already mints the
  time-band family — one band, four print positions, a 6×4 inflection table. §3.3
  below does NOT restate it; a second band table in the same file is the double-
  writer defect in content form. §3.3 keeps only what §0d does not cover: which
  connectives carry a band, the one-band-per-sentence rule, and the sub-band ruling.
- **Sixteen pools under §0c's eight edges — RESOLVED AT MERGE by R-CAU-I.** This
  block originally keyed sixteen edges against §0c's eight and flagged six of
  them as the chair's call. Two vocabularies shipping side by side made law 1
  uncheckable, which §0c itself had anticipated when it called the fold "a §3
  edit and not a re-authoring". The fold is now executed: §0c's eight are the
  TAGS, §3.1's sixteen survive whole as their named connective POOLS, grouped
  under the parents they serve, and not one connective line was lost or merged
  away. The group table is the head of §3.1 and reading it backward is the
  whole of the reversal. The five formerly-flagged pools are assigned there
  with their reasoning — `remembered`/`exposed` → `succession`, `judged` →
  `belief`, `inherited`/`buried`/`breached` → `instrument` — and `planted`
  keeps its DM arm under `belief`, `refused` and `dissolved` their place under
  `gate`, exactly as this block's own reconciliation already had them.

**THE CAUSAL VOICE IS THE HERALD'S ALONE** (SP-6, scope amendment). The settlement
rumor mill keeps its own local register and references upward by link. Nothing in
§2 or §3 renders in a rumor, a dossier line, or a tooltip; a rumor whose event
reached the Herald carries a link to the headline, and a rumor whose event stayed
below the pacing floor carries no link and no borrowed clause.

### What a clause form is, and what it is not

A clause form is **one receipt, compressed to the smallest true thing that can be
joined to another**. It is not a sentence and not a headline. The Herald's headline
register renders the event plus at most one causal gesture; the telling register
behind the click renders the full chain. Both are built from the same parts: the
kind's own pool sentence (the sibling annexes) for the event, clause forms from §2
for every OTHER link in the chain, and one connective from §3 for every edge
between them. A chain sentence is the cause walk wearing prose. It is never an
invention, and it never carries a fact no member receipt carries.

### THE COMPOSITION CONTRACT (the shape every clause below obeys)

- **Two shapes per kind: FINITE and NOMINAL.** Marked `F` and `N`. An `F` variant
  is a finite clause — subject, tensed verb — usable as the head of a telling or
  after a clause-taking connective (*believing · when it came out that · once it no
  longer stood*). An `N` variant is a bare noun phrase, usable after a phrase-taking
  connective (*born of · the bill for · in the wake of*). Every pool carries at
  least one of each. **This is the load-bearing rule of the whole section**: a
  phrase-taking connective in front of a finite clause is ungrammatical, and a
  display-side composer with no engine state has no repair for it. Every connective
  in §3 carries an argument tag (`N` · `F` · `V` · `A`) and a direction tag, and the
  composer selects on both — see §3's tagging note.
- **No terminal punctuation, no leading capital.** Casing and the closing stop are
  display-side, applied by the composer to the assembled sentence. A clause that
  arrives pre-capitalised cannot be used in tail position.
- **No connective inside a clause.** A clause form never opens with *because,
  after, so, following,* or *since*. §2 supplies the facts; §3 supplies the joins.
  A clause carrying its own connective asserts the edge twice, and the second
  assertion is not checked against the walk.
- **Slots only.** No proper noun and no cause is baked. This block mints NO new
  slot: it spends the spine's closed set (`{settlement} {counterpart} {npc}
  {faction} {house} {temple} {band} {reason} {good} {route}`) and, where its source
  kind already spends them, the volume-local slots those annexes declared —
  `{third_party} {war} {term}` (WAR), `{creed} {rival_creed} {calamity} {season}`
  (FAITH/INFORMATION), `{decision} {wound} {standing}` (INTERIOR). It additionally
  spends `{timeband_span}` in three clauses — a slot §0d of this annex already
  mints, not a new one (R-W5-J). A clause below never introduces a slot its source
  kind does not already carry.
- **No digits, and no numerals in a duration.** Durations speak through §0d's band
  family; counts through `{band}` or through band words. Per §0b law 2 this block is
  stricter than the sibling annexes: a duration carries no numeral at all, spelled or
  otherwise. The only digits in this block are structural: the section numbers, the
  variant tags, and the wave references.
- **`[DM]` is a hard fence.** A clause marked `[DM]` renders only where
  `includeCovert`/`includeGroundTruth` is already true. On a player surface the
  composer drops the clause AND the edge that reached it, together — see R-W5-E.

### Authoring resolutions (recorded, vetoable)

- **R-W5-A — the F/N split is a content rule, not a code convenience.** It is
  recorded here because a pool authored without it looks complete and composes into
  garbage on roughly half its draws, and the failure is invisible until a soak
  renders it. Any kind added to §2 later ships both shapes or it is not done.
- **R-W5-B — where a sibling annex's variant 1 is already a compressed clause, it
  is reused as this block's `F1`, word for word, minus its terminal stop and its
  leading capital.** Two different wordings of one fact read to a player as two
  different facts, and the cause walk sits directly beneath the telling: the table
  and the sentence must say the same thing in the same words. The sibling exemplar
  wins over any better line this writer could invent.
- **R-W5-C — a clause asserts its own receipt and stops.** Where a sibling
  exemplar carries a second receipt's fact inside it (the couplings' braided lines
  do this deliberately), the clause form below carries only the first. The braid
  restores the rest through an edge, where the walk can check it.
- **R-W5-D — the ONE-GESTURE cap belongs to the composer, not the pool.** No
  clause below is written to be "the headline one". Headline and telling draw from
  the same pool; the register difference is how MANY clauses are joined, not which
  words are allowed. This keeps the two registers honest against each other — a
  reader who clicks through never finds the headline's claim restated differently.
- **R-W5-E — dropping a covert clause drops its edge with it.** A composer that
  removes a `[DM]` clause but keeps the connective renders *"…, on a story someone
  had paid for, …"* against nothing, or worse, silently re-parents the edge to the
  grandparent and asserts a causal link the walk does not hold. The public
  projection of a covert seam is the `chain_end` terminal of §3.2 — never a gap,
  never a shortened chain that reads as complete.
- **R-W5-F — `planted` degrades to `believed` by SWAP, not deletion.** On a player
  surface the planted edge renders with a `believed` connective and the clause it
  reached renders as the belief it was. The sentence stays grammatical, the reader
  gets true dramatic irony, and the planter is not leaked — not as a name, not as a
  stub, not as a suspicious absence.
- **R-W5-G — the six time bands are closed and this block mints none.** §3.3 is a
  rendering table over an existing derivation (sinceTick against INTERVAL_WEEKS),
  authored so that six bands do not become sixty phrasings authored per volume.
- **R-W5-I — one exemplar was de-numeraled rather than reproduced.**
  `TRADE/pact.breached`'s sibling variant 1 carries a year count the TRADE annex
  itself flagged for the counts ruling. §0b law 2 bans numerals in durations
  outright, and a law outranks the exemplar-verbatim rule, so the `F1` here is *the
  grain compact broke*. Recorded because a verifier diffing this block against the
  sibling annex will find exactly one exemplar that does not match, and this is it.
  *(One numeral word survives elsewhere and is deliberate:
  `INFO/bluff_collision` F1, "two courts, two bluffs, one war neither wanted" — the
  INFORMATION annex's own shipped variant 1. Those are COUNTS, not a duration; §0b
  law 2 reaches durations, and the count law is the sibling annexes', which shipped
  this line past the correction pass. Preserved under R-W5-B, noted so it is not
  re-found as a violation.)*
- **R-W5-J — three clauses carry a baked band, and it was slotted, not kept.** A
  baked time band is the same class of bake as a baked proper noun, and the corpus
  already rules that slotting wins over verbatim (R-CPL-F). Three inherited
  exemplars asserted a chain-link span in their own words — the vengeance answer
  arriving late, the monopoly's roads abandoned, the scandal named before the fall —
  and each now spends `{timeband_span}`, which §0d mints. The wording is otherwise
  untouched, and each renders identically to its exemplar when the walk's own band
  is the one the exemplar assumed.
- **R-W5-H — FLAGGED FOR THE CHAIR: clause forms are not subheaders.** SP-6's
  surface contract gives the Herald entry a SUBHEADER — one plain unembellished
  sentence, clarity only, no voice. A clause form is close to it and is not it: a
  clause is a fragment built to be joined, tuned for the seam rather than for
  standing alone. Whoever authors the subheader register should treat §2 as a
  source of FACTS to state plainly, never as a pool to import. Recorded here so
  the resemblance does not become a shortcut.

---


One compressed telling per kind, in the two composable shapes. The kind ids are the
sibling annexes' own; the parenthesised wave is theirs too. Where a kind is
`[DM]`, every variant in its pool is.

## §2.1 — WAR (forty-six kinds)

#### WAR/treaty_repudiated (WR-0c)
F1. {settlement} put its compact with {counterpart} aside in open court
F2. every live {term} was struck the same afternoon
N1. the open repudiation of the {counterpart} compact

#### WAR/trade_war_escalation (WR-0c)
F1. the quarrel over {good} passed from the toll house to the muster
F2. {settlement} marked {counterpart} for soldiers over {reason}
N1. a tariff quarrel written into the war ledger

#### WAR/war_cause_dissolved (WR-1)
F1. the war outlived {reason}
F2. what the war was declared over is gone from the ledger
N1. a war standing on a cause already gone

#### WAR/war_cause_dissolved_sacred (WR-1)
F1. the rite they marched against is not kept at {counterpart} any more
F2. the holy claim ended with the seat that held it
N1. a sacred casus with no altar left under it

#### WAR/casus_lineage_claim_parent (WR-3)
F1. {settlement} claims {counterpart} by right of founding
F2. the parent house says the daughter cannot hold what it was given
N1. the founder's claim on {counterpart}

#### WAR/casus_lineage_claim_child (WR-3)
F1. {settlement} was founded out of {counterpart} and has outgrown it
F2. the daughter house asks why it keeps the smaller title
N1. the daughter's claim on the elder seat

#### WAR/disposition_reversal (WR-2)
F1. what the victories taught {settlement}, the losses have untaught
F2. the same council that voted the levies votes the granaries now
N1. {settlement}'s turn of temper

#### WAR/winning_abroad_losing_at_home (WR-4)
F1. {settlement}'s banners stand on {counterpart}'s walls and its own granaries hold {band}
F2. the couriers bring victories and the reeve brings the accounts
N1. a war won abroad and lost at home

#### WAR/sued_for_peace_seat (WR-5)
F1. {npc} sued for peace over the seat's name and not the town's
F2. the offer went out before the hall had spoken
N1. the seat's own suit for peace

#### WAR/peace_refused (WR-5)
F1. {settlement} refused the terms and named {reason} for it
F2. the legate was heard, thanked, and sent back down {route} with nothing
N1. the refusal on the record with a name beside it

#### WAR/ruler_books_compromised (WR-5) `[DM]`
F1. {npc} keeps a third book, and the terms answer {faction} before {settlement}
F2. every concession refused is one the patron would have paid for
N1. the third book behind the terms

#### WAR/war_party_overturns_peacemaker (WR-5)
F1. the war party took the hall and named the treaty as its grievance
F2. the peace {npc} signed cost {npc} the seat
N1. a seat lost over a signed peace

#### WAR/peace_party_overturns_warmonger (WR-5)
F1. {settlement} put down the seat that kept the war
F2. {faction} formed at the almsgate and finished in the hall
N1. a seat lost over a war that would not end

#### WAR/successor_repudiates_war (WR-5)
F1. {npc} came to the seat, read the war again, and called the levies home
F2. the quarrel belonged to a man who no longer holds the chair
N1. the new seat's repudiation of the war

#### WAR/successor_escalates_war (WR-5)
F1. {npc} came to the seat and widened the war the predecessor could not end
F2. the same ledgers, a different character, and a new front
N1. a wider war chosen by the successor

#### WAR/war_dissolved_by_verdict (WR-5)
F1. the officeholder whose rot opened the war was removed
F2. the casus was a man, and the man is out of office
N1. a war left standing on a vacated seat

#### WAR/coalition_joined (WR-6)
F1. {settlement} answered the call and opened its own edge against {third_party}
F2. the banners went out down {route} on the compact's account
N1. the obligation answered in banners

#### WAR/coalition_refused (WR-6)
F1. they were called, and would not come
F2. {settlement} read its own books and sent regrets down {route}
N1. a compact call sent back with regrets

#### WAR/casus_alliance_obligation (WR-6)
F1. {settlement} is in this war because {counterpart} called and the compact answers for it
F2. the obligation stands as one recorded cause on this edge
N1. the compact's own casus

#### WAR/coalition_separate_peace (WR-6)
F1. they went home
F2. {settlement} settled its own edge with {third_party} and left the rest of the war standing
N1. a separate peace on one edge of the war

#### WAR/coalition_debt_unpaid (WR-6)
F1. they never paid
F2. {settlement}'s claim against {counterpart} stands unpaid along {route}
N1. a war debt still open in the book

#### WAR/envoy_intercepted (WR-7b)
F1. {npc} was taken on {route} by {third_party}
F2. the court he was riding to does not know it
N1. a legate taken short of the destination

#### WAR/envoy_held (WR-7b)
F1. {npc} is held at {counterpart} on {reason}
F2. the captor's record calls it a hold, and so does everyone else
N1. a guest who cannot leave

#### WAR/envoy_lost (WR-7a)
F1. the errand closed without word
F2. {npc} did not reach {counterpart} and has not come home
N1. an errand closed on silence

#### WAR/terms_never_reached (WR-7a)
F1. the terms were agreed and the envoy never reached them
F2. peace was made on {route} and died there
N1. terms that never came home

#### WAR/ratification_failed (WR-7c)
F1. the {term} failed the vote at {settlement}
F2. every power wanted an end and none of them would take this end
N1. an agreed peace that failed its vote

#### WAR/returned_planted (WR-7d) `[DM]`
F1. {npc} returns believing what his captors arranged for him to believe
F2. the hall counts him a trusted source
N1. a trusted source who was furnished

#### WAR/envoy_treason_exposed (WR-7d)
F1. {npc} was shown to have carried {faction}'s interest into the parley
F2. the hall has taken it up as treason
N1. a parley carried on another court's account

#### WAR/conquest_intent_formed (WR-8)
F1. by its own reckoning {settlement} can take {counterpart}, and now intends to
F2. capability was waiting on character
N1. an intent formed on a favourable reckoning

#### WAR/conquest_intent_deceived (WR-8)
F1. {settlement} presses the conquest believing {counterpart} is what it was told
F2. word reached the hall, and nobody has asked who carried it
N1. a conquest pressed on a furnished picture

#### WAR/occupation_begun (WR-8)
F1. {counterpart} is held and not annexed
F2. a garrison, a curfew, and the old register still in the old hall
N1. the holding of {counterpart} at a weekly price

#### WAR/occupation_revolt (WR-8)
F1. {counterpart} rose against its garrison
F2. the streets were the battlefield, and the streets are still there
N1. the rising against the garrison

#### WAR/conquest_inheritance (WR-8)
F1. {settlement} annexed {counterpart} and annexed its famine with it
F2. the victor's granaries feed the loser's people now
N1. an annexed town and its annexed hunger

#### WAR/razing_done (WR-8)
F1. they burned {settlement} and rode home
F2. {counterpart} took the town, emptied it, and did not stay the night
N1. the burning of {settlement}

#### WAR/razing_refugees (WR-8)
F1. {band} got out of {settlement} and are on {route} with what they carried
F2. the escape share is small and it is real
N1. what got out of {settlement}

#### WAR/razing_named_cast_dispersed (WR-8)
F1. the named of {settlement} went out on the roads
F2. {npc} was last seen on {route} and has not been seen since
N1. a named cast scattered to the roads

#### WAR/terror_backfires (WR-8)
F1. the burning bought {counterpart} a frontier of enemies who had been merely neighbours
F2. courts that were indifferent in the spring are treating with each other by the harvest
N1. the frontier of enemies the burning bought

#### WAR/vengeance_license_minted (WR-8)
F1. {settlement} holds the right of answer against {counterpart}
F2. the burning made a claim that does not decay the way grievances decay
N1. a right of answer, written where rights are written

#### WAR/vengeance_license_prosecuted (WR-8)
F1. {settlement} spent its right of answer on {counterpart}
F2. what was owed for the burning was collected
N1. a right of answer spent

#### WAR/casus_atrocity_answer (WR-8)
F1. {settlement} takes up arms over what is believed done at {third_party}
F2. someone must stop them: it is the whole argument
N1. arms taken up over a reported burning

#### WAR/ending_conquest (WR-9)
F1. {counterpart} took {settlement} whole and holds it under garrison
F2. {war} ended in annexation, at a price paid weekly
N1. the war's end in annexation

#### WAR/ending_annihilation (WR-9)
F1. {settlement} is not there any more
F2. {war} ended because one of its parties did
N1. the war's end in the end of a party to it

#### WAR/ending_punitive_sack_vengeance (WR-9)
F1. {settlement} spent the right it had held since the burning
F2. the answer arrived {timeband_span} late and in kind
N1. a sack that answered an older sack

#### WAR/sovereignty_sale_cleared (WR-10)
F1. the trade cleared, and {settlement} changed overlords
F2. none of it moved a soul
N1. a town sold over the heads of the people in it

#### WAR/cession_for_peace (WR-10)
F1. {counterpart} ceded {settlement} to end the war
F2. the town was the price of the peace, and the town was not consulted
N1. a town ceded for a peace

#### WAR/sold_settlement_grievance (WR-10)
F1. {settlement} was sold and has said so in every hall that will hear it
F2. the town keeps a grievance against the seat that sold it
N1. the grievance of a town that was sold

## §2.2 — TRADE (twenty-nine kinds)

#### TRADE/cc.cornering (TR-1)
F1. a house of {counterpart} holds the {good} that {settlement} eats
F2. the {good} in {settlement}'s market comes from one warehouse
N1. the one warehouse behind {settlement}'s bread

#### TRADE/cc.famine_profiteering (TR-1)
F1. {house} sold dear to {settlement} while the granaries of {counterpart} stood full
F2. they name {house} in the bread queues, and not kindly
N1. the dear selling of a hungry season

#### TRADE/cc.severance_crossing (TR-1)
F1. trade between {settlement} and {counterpart} is severed
F2. the bridge road stands empty of carts
N1. a severance entered under {reason}

#### TRADE/cc.contract_default (TR-1)
F1. {counterpart} took the wagons and sent nothing back
F2. the wharf waited for a cargo that never came
N1. a compact broken on the wharf

#### TRADE/cc.market_exclusion (TR-1)
F1. {settlement} shut its market to {counterpart}'s {good}
F2. the gate-clerks turn {counterpart}'s carts at the bridge
N1. a market shut against {counterpart}

#### TRADE/cc.route_predation (TR-1)
F1. {counterpart} lets the {route} go unpoliced
F2. the carters of {settlement} name the same stretch of road each season
N1. the unpoliced stretch that eats {settlement}'s wagons

#### TRADE/cc.dependency_fear (TR-1)
F1. {settlement} buys its {good} from {counterpart} and from nowhere else
F2. the guildhall asks what happens to the bread if the {route} closes
N1. the single road the bread comes down

#### TRADE/house.extend_credit (TR-2)
F1. {house} extended credit to the seat of {settlement}
F2. the {route} was asked for in the terms
N1. the seat's debt to {house}

#### TRADE/house.holdings_fall (TR-2)
F1. {house} is {band} now
F2. a warehouse on the quay changed hands, and it was {house}'s
N1. {house}'s fall to {band}

#### TRADE/house.credibility_fall (TR-2)
F1. {house}'s word is worth less at the wharf than it was
F2. factors who once took {house}'s word now ask for it in writing
N1. the fall of {house}'s word

#### TRADE/house.covert_interest (TR-2b) `[DM]`
F1. {house}'s declared interest is the {route}, and its true one is what moves on it after dark
F2. the front is a {good} warehouse, and the {good} is real
N1. the business behind the warehouse

#### TRADE/market.wrong_market_arrival (TR-3)
F1. the caravans came for the famine and found the harvest
F2. they unloaded into a market that had no need of them
N1. a cargo landed into the wrong season

#### TRADE/market.belief_corrected_by_arrival (TR-3)
F1. a caravan came in, and {settlement} learned what {good} really fetches
F2. the wharf revised itself in an afternoon
N1. a picture corrected by an arrival

#### TRADE/grain.blockade_bite (TR-4)
F1. the {route} into {settlement} is cut, and the granaries fall week by week
F2. the carters turn back at the ring of tents
N1. the cut road and the falling lofts

#### TRADE/grain.tribute_robbed (TR-4)
F1. the tribute was sent, and taken on the road
F2. the carters walked back to {settlement} with nothing but the story
N1. the tribute taken between the towns

#### TRADE/grain.export_withheld (TR-4)
F1. {settlement} has {good} to spare and is sending none
F2. the carters were paid off at the gate and told to come back in the spring
N1. the surplus that was kept at home

#### TRADE/pact.formed_under_hunger (TR-5)
F1. they bought the grain before they bled for it
F2. the muster rolls were drawn up and set aside in the same week the compact was sealed
N1. a compact sealed against a hungry season

#### TRADE/pact.breached (TR-5)
F1. the grain compact broke
F2. the carters waited at the bridge until the season turned, and then went home
N1. the broken grain compact

#### TRADE/corner.gate_crossed (TR-6)
F1. {house} holds the grain, and the bread knows it
F2. the stalls sell {good} from many hands and one warehouse
N1. the corner closing on {settlement}'s {good}

#### TRADE/corner.riot_seizure (TR-6)
F1. the crowd went from petition to the warehouse door, and the door gave way
F2. they carried the {good} to the public granary in their arms, in daylight
N1. a warehouse opened by the crowd

#### TRADE/corner.forced_sale_edict (TR-6)
F1. the seat ordered {house}'s {good} sold into the public granary at {band}
F2. the wardens counted the sacks out while the town watched
N1. the forced sale into the public granary

#### TRADE/corner.broken_by_arrivals (TR-6)
F1. the dear band {house} made was heard on every road, and the roads answered
F2. wagons came into {settlement} from towns that had never sent one
N1. a corner broken by roads that heard the price

#### TRADE/corner.remembered_generational (TR-6)
F1. they still call it the winter {house} held the grain
F2. the old carters date things from it
N1. the winter the grain was held

#### TRADE/venture.failed (TR-7)
F1. the {house} venture is lost
F2. the news came back to the {settlement} quay before the season did, and came back alone
N1. a venture lost under {reason}

#### TRADE/ending.ruin (TR-2/TR-7)
F1. {house} is broken, its factors scattered to the quays
F2. the guild chained the warehouse door, and the crowd that watched was small
N1. the ruin of {house}

#### TRADE/ending.fortune (TR-2/TR-7)
F1. {house} is made
F2. the quay counts {house} among the great names and cannot remember when that started
N1. the making of {house}

#### TRADE/ending.monopoly (TR-6)
F1. {house} is the only seller of {good} in {settlement}
F2. the carters stopped trying the other roads {timeband_span} ago
N1. the single seller left standing

#### TRADE/ending.severance (TR-1/TR-5)
F1. {settlement} and {counterpart} trade no longer
F2. the bridge is open and empty
N1. the trade between them, ended under {reason}

#### TRADE/factor.captured (TR-8)
F1. {faction} holds Factor {npc}, taken on the {route} with the house's papers
F2. the carters who walked home say the banners were plain enough to name
N1. the factor taken on the {route}

## §2.3 — FAITH (twenty-six kinds)

#### FAITH/faith.fall.displaced (WF-1)
F1. {creed} lost the patron seat at {settlement}
F2. {rival_creed} keeps the high altar now
N1. the seat lost to {rival_creed}

#### FAITH/faith.fall.discredited (WF-1)
F1. {creed} fell discredited at {settlement}
F2. {npc} was named in the matter of {reason}, and the seat did not survive the naming
N1. the stain that emptied the nave

#### FAITH/faith.fall.imposed (WF-1)
F1. {faction}'s garrison set {rival_creed} over {settlement}
F2. the calendar changed before the season did
N1. a creed set over {settlement} by a garrison

#### FAITH/faith.fall.suppressed (WF-1)
F1. the seat of {creed} at {settlement} was emptied by order
F2. the rite is proscribed and the doors are barred
N1. the proscription read at the market cross

#### FAITH/faith.extinction.last_altar (WF-1)
F1. the last altar of {creed} at {settlement} went dark
F2. none there now keep the rite
N1. the last altar gone out

#### FAITH/faith.dissolution.cause_named (WF-1 × WR-1)
F1. {settlement} no longer keeps the creed the war was declared over
F2. the heralds have not been told
N1. a war's holy cause, already fallen

#### FAITH/faith.season.flood (WF-2a)
F1. the roads to {settlement} are choked with the faithful
F2. the town has run out of beds, bread, and patience
N1. the flood season at {settlement}

#### FAITH/faith.season.roads_closed (WF-2a)
F1. the roads to {settlement} were watched, and the feast was thin
F2. {creed}'s pilgrims stayed home and said their prayers there
N1. the watched roads and the thin feast

#### FAITH/faith.pilgrim.intercepted (WF-2b)
F1. {npc} was taken on {route} and is held at {counterpart}
F2. the seal was intact, the escort was not
N1. a legate stopped at the crossing

#### FAITH/faith.pact.betrayed (WF-3)
F1. {creed} broke communion with {rival_creed} at {settlement}
F2. the joint feast was struck from the calendar before the ink dried
N1. the broken communion at {settlement}

#### FAITH/faith.reading.wrath (WF-4)
F1. the priests of {settlement} read the failed harvest as {creed}'s wrath
F2. {npc} named the {calamity} from the pulpit, and named it wrath
N1. a reading of wrath from the pulpit

#### FAITH/faith.reading.failed (WF-4)
F1. the rite was kept, and the rains did not return
F2. the reading lapsed unanswered, and the pulpit is quieter now
N1. a reading that went unanswered

#### FAITH/faith.reading.two_towns (WF-4)
F1. {settlement} read the {calamity} as judgment and {counterpart} read it as patience
F2. the same {calamity} crossed both parishes
N1. one calamity read two ways across one field

#### FAITH/faith.schism.temple_split (WF-5a)
F1. the temple of {settlement} split, the old rite keeping the nave and the new the crypt
F2. {settlement} keeps both congregations under one roof
N1. the split under one roof

#### FAITH/faith.covert.gone_underground (WF-5b) `[DM]`
F1. a share of {creed}'s faithful did not scatter but went to the cellars
F2. {npc} keeps a list of who still comes, and keeps it where it will not be found
N1. the congregation that went below

#### FAITH/faith.covert.exposed (WF-5b)
F1. the hidden congregation of {creed} at {settlement} was found
F2. {npc} was taken up with the vessels
N1. a cellar rite brought into the light

#### FAITH/faith.covert.backfire (WF-5b)
F1. the hidden congregation was dragged into the light, and the pews filled in defiance
F2. {settlement} took the example the other way
N1. an example that recruited

#### FAITH/faith.term.missionary_access.formed (WF-6)
F1. {creed}'s missionaries may preach within the walls of {settlement} by treaty
F2. {counterpart} bought its peace with a pulpit
N1. the pulpit written into the terms

#### FAITH/faith.term.tolerance_guarantee.breached (WF-6)
F1. {settlement} proscribed {creed} again with the instrument still in force
F2. the purge broke the guarantee, and the realm knows why
N1. a guarantee broken by a purge

#### FAITH/faith.temple.plundered (WF-7)
F1. {temple} at {settlement} was stripped in the sack
F2. the plate went out on {route} and the roof stayed
N1. the stripped temple at {settlement}

#### FAITH/faith.tithe.resentment (WF-7)
F1. the render at {settlement} has outrun the piety that pays it
F2. the petition has more names on it than the parish register
N1. a render nobody believes in any more

#### FAITH/faith.suppression (WF-8)
F1. {settlement} proscribed {creed}
F2. the vessels are in the strongroom and the rite is not to be said
N1. the proscription of {creed} at {settlement}

#### FAITH/faith.realm.reformation (WF-8)
F1. patrons have fallen at {settlement}, at {counterpart}, and beyond
F2. the realm has unseated its patrons by the same argument, parish after parish
N1. the reformation running through the realm

#### FAITH/faith.realm.persecution (WF-8)
F1. {creed}'s houses are closed from {settlement} to {counterpart}
F2. the seats have agreed among themselves, and the agreement is enforced street by street
N1. a coordinated proscription across the realm

#### FAITH/faith.ending.split (WF-9)
F1. {settlement} ends the age with both congregations standing
F2. neither the nave nor the crypt yielded
N1. the split that held

#### FAITH/faith.legitimacy.crossing_down (WF-8)
F1. {creed} is heard less respectfully at {settlement} than it was
F2. the stain took, and the crossing followed
N1. the fall of {creed}'s standing to {band}

## §2.4 — POPULATIONS (twenty-two kinds)

#### POP/pop_rush (POP-1)
F1. the {route} is full of feet
F2. they say in {counterpart} the streets want for hands and pay in {good}
N1. the rush down the {route}

#### POP/pop_bust (POP-1)
F1. letters came back from {counterpart}, and they did not speak of {good}
F2. the kin of {settlement} write that the wages are what wages are
N1. the word that came back from {counterpart}

#### POP/refused_at_the_wall (POP-1)
F1. the column came to the gates of {counterpart} and found no room
F2. {band} stood outside for a day, and then took the {route} back
N1. a column turned at the wall

#### POP/pop_return_column (POP-1)
F1. they came back into {settlement}
F2. the road home was longer than the road out
N1. the column that came home

#### POP/commons_riot (POP-2)
F1. the streets of {settlement} rose over {reason}
F2. they took the gates off the granary and carried little of it away
N1. the rising in the streets of {settlement}

#### POP/commons_refusal (POP-2)
F1. the commons of {settlement} would not answer the seat's call
F2. no one came to the muster field, and no one had to be told not to
N1. the commons' silence at the muster field

#### POP/commons_answered (POP-2)
F1. the commons of {settlement} petitioned their seat, and were heard
F2. the seat heard them, and the square emptied
N1. the petition that was answered

#### POP/refused_by_the_commons (POP-2)
F1. the work at {settlement} was set aside
F2. the plan closed unfinished, entered as refused by the commons
N1. the work the town would not have

#### POP/levy_shortfall (POP-2)
F1. the levy was called in {settlement}, and the commons would not send their sons
F2. {band} were asked of {settlement}, and fewer than that came to the field
N1. a levy that came in short

#### POP/calamity_arc_crest (POP-4)
F1. the sickness in {settlement} is at its worst, and the bells have not stopped
F2. there is no one left to send for, and the sending goes on
N1. the worst of it at {settlement}

#### POP/calamity_arc_terminal (POP-4)
F1. the sickness did not end in {settlement}; {settlement} ended
F2. the arc closed with the town, and both went into the chronicle together
N1. a calamity that outlasted the town

#### POP/burial_hunger (POP-4)
F1. grain ran short in {settlement}, and {band} did not see the spring
F2. the bread went to the children first, and then there was none to go anywhere
N1. the hungry gap and what it took

#### POP/burial_sickness (POP-4)
F1. a sickness walked through {settlement}, and the bells did not stop for {band}
F2. the gravediggers worked by lantern and still fell behind
N1. the season the bells did not stop

#### POP/lost_column (POP-5a)
F1. a column left {settlement} in the spring, and no word has ever come
F2. they are still setting places in {settlement} for people who should have written by now
N1. the column no word ever came of

#### POP/road_graves (POP-5a)
F1. of the {band} who left {settlement}, not all reached {counterpart}
F2. there are cairns on the {route} that were not there last spring
N1. the graves on the {route}

#### POP/remembered_as_mourned (POP-3)
F1. {settlement} mourns the ones who went to {counterpart} as though it had buried them
F2. they keep the names of that year and say them at the turning of the season
N1. the year {settlement} still mourns

#### POP/remembered_as_cast_out (POP-3)
F1. {settlement} put them on the {route} and shut the gate behind them
F2. nobody in {settlement} names the ones who went, and everybody knows the names
N1. the gate shut behind them

#### POP/permit_refusal (POP-5b)
F1. they asked {settlement} for what a standing town gives, and {settlement} had none of it to give
F2. the refusal was entered, and the asking will come again when the standing does
N1. a refusal entered against a failing town

#### POP/exodus (POP-6)
F1. {settlement} emptied down the {route} in a season
F2. {band} left {settlement}, and the roll has not recovered
N1. the emptying of {settlement}

#### POP/died (POP-6)
F1. {settlement} was let go
F2. the entry closed, and nothing was struck out, there being nothing left to strike
N1. the closing of {settlement}'s entry

#### POP/resettled (POP-6)
F1. there are people on the ground of {settlement} again
F2. the clerks copied the old entry for the shape of it
N1. the ground taken up again

#### POP/dwindled (POP-6)
F1. {settlement} did not fall; it thinned until there was not enough of it to fall
F2. every season was under the floor, and the years were not
N1. the long thinning of {settlement}

## §2.5 — INTERIOR (twenty-one kinds)

#### INTERIOR/counsel_overridden (INT-2)
F1. the hall of {settlement} was heard out, thanked, and disregarded
F2. {faction} called for it, and {npc} did not hear them
N1. the counsel that was overridden

#### INTERIOR/books_collapsed (INT-1)
F1. seat and town stopped keeping separate books
F2. {npc} read one ledger to the hall, there being no second one left worth reading
N1. the collapse of the two books into one

#### INTERIOR/decision_grievance_opened (INT-3a)
F1. {faction} has not forgiven {decision}, and says so in the hall weekly
F2. the grievance entered against {npc} is not a personal one; it is {decision}
N1. the grievance opened over {decision}

#### INTERIOR/decision_join_named (INT-3a)
F1. {faction} holds the hall, and {decision} is named in the verdict
F2. the seat changed hands, and the reason entered in the book is {decision}
N1. the verdict that named {decision}

#### INTERIOR/overturned_war_party (INT-3)
F1. {faction} took the hall, and the seat that would not fight does not sit in it
F2. the peace {npc} signed outlived {npc}'s chair by a season
N1. the hall taken by the war party

#### INTERIOR/overturned_peace_party (INT-3)
F1. {faction} took the hall, and {decision} ended with the seat instead
F2. the peace party holds the chair, and its first business is {counterpart}
N1. the chair passing to the peace party

#### INTERIOR/demand_betrayed (INT-3)
F1. {faction} seated {npc} and has been waiting since
F2. the demand stands unhonoured in the record of {settlement}
N1. a demand that seated a man and was not paid

#### INTERIOR/repudiated_by_heir (INT-3)
F1. the father swore it; the son burned it
F2. {npc} put the seal of {settlement} to a page and then to the fire
N1. the oath the heir would not keep

#### INTERIOR/reaffirmed_by_heir (INT-3)
F1. the son kept the father's word
F2. {npc} came to the seat and let the pact with {counterpart} stand untouched
N1. the oath the heir kept

#### INTERIOR/emigre_flight (INT-3b)
F1. {npc} lost the contest in {settlement} and was on the road before the verdict was copied out
F2. the hall of {counterpart} received the rider
N1. the flight to {counterpart}'s table

#### INTERIOR/harboring_grievance (INT-3b)
F1. they keep our traitor at their table
F2. {settlement} has entered a grievance for the guest {counterpart} will not give up
N1. a grievance over a sheltered guest

#### INTERIOR/exile_returned (INT-3b)
F1. a later verdict in {settlement} opened the road, and {npc} came back up it
F2. {faction} holds the hall again, and its captain has come home to sit in it
N1. the road opened for a return

#### INTERIOR/pressure_named_cause (INT-4)
F1. the seat of {settlement} lost standing for a named cause
F2. the tribute and the war stand where they stood; it is {reason} the hall answered for
N1. the named cause the hall answered for

#### INTERIOR/paid_and_fell (INT-4)
F1. {npc} paid the tribute of {counterpart}, and it cost {npc} the seat
F2. the installments left on time, every time, and the hall changed hands regardless
N1. a tribute paid and a seat lost

#### INTERIOR/burial_decreed (INT-6)
F1. by decree of the seat, the grudge with {counterpart} is buried
F2. {npc} named the {wound}, named its price, and had both read out in the square
N1. a grudge buried at a price

#### INTERIOR/dug_up (INT-6)
F1. they dug up what their fathers buried
F2. the seat revoked the burial, and {counterpart}'s book gained the old {wound} back
N1. the burial revoked

#### INTERIOR/legitimacy_crossing_fallen (INT-7)
F1. the seat has fallen to {standing}
F2. the standing of {npc} crossed downward, and the hall did not pretend otherwise
N1. the fall of the seat's standing

#### INTERIOR/coup_held (INT-8)
F1. {npc} rallied enough of the court to hold the seat
F2. the conspirators lost their nerve at the door
N1. a seat held against its own court

#### INTERIOR/coup_fell (INT-8)
F1. the court of {settlement} turned, and the seat went to {npc}
F2. {settlement} woke to different men on the hall steps
N1. a seat taken in a night

#### INTERIOR/faction_institution_capture (INT-8)
F1. {faction} took an institution of {settlement} into its hands
F2. the house stands where it stood; the hands on it are {faction}'s now
N1. an institution taken into {faction}'s hands

#### INTERIOR/founding_wound_named (INT-5)
F1. the grudge was older than either man
F2. {settlement} remembers what was done at {counterpart}'s hands, and remembers it in detail
N1. the {wound} at the founding

## §2.6 — GRAMMAR (seventeen kinds)

#### GRAMMAR/treaty_lapsed (GR-0)
F1. the peace of {settlement} and {counterpart} ran its course
F2. the clerks struck it from the book, and the book is the only place it was mourned
N1. a treaty at the end of its term

#### GRAMMAR/treaty_lapsed.outlived_its_swearers (GR-1 × GR-0)
F1. it outlasted the seats of both who swore it
F2. neither town is led by the hand that signed, and the parchment held anyway
N1. a pact that outlived its swearers

#### GRAMMAR/treaty_priced_on_a_lie (GR-0 × IN)
F1. the peace was priced on a lie, and now the lie is out
F2. the terms were struck on a strength that was never there
N1. a peace priced on a strength that was never there

#### GRAMMAR/treaty_default_detected (GR-0)
F1. the tribute came light, and this time the court noticed
F2. the clerks weighed what arrived against what was promised, and the ledger would not close
N1. the default the clerks finally weighed

#### GRAMMAR/hollowed_detected (GR-0)
F1. the {term} was kept on parchment and nowhere else
F2. {counterpart} let it fail by inches until {settlement} named it default
N1. a hollow term, found out

#### GRAMMAR/signed (GR-2)
F1. the courts have set their names to it
F2. {settlement} sends {good}, {counterpart} sends {good}, and the term runs to a named date
N1. the pact signed between them

#### GRAMMAR/refused (GR-2)
F1. they asked, and were refused
F2. {counterpart} sent the terms back unsigned, with {reason} written under the seal
N1. terms sent back unsigned

#### GRAMMAR/nap_signed (GR-2)
F1. neither shall march on the other, and it was sworn in peace
F2. no war was needed to arrange it
N1. a peace sworn before any war

#### GRAMMAR/broken_by_war (GR-2)
F1. every live term closed with the first march
F2. nothing was repudiated, and nothing needed to be
N1. the terms {war} ate

#### GRAMMAR/disavowed_by_succession (GR-4)
F1. {npc} tore up the treaty a predecessor swore
F2. every term under it is broken from this week, and the parchment is kept only as evidence
N1. an oath disavowed at a succession

#### GRAMMAR/repudiated (GR-4 / WR-0c producer)
F1. {settlement} renounced the pact with {counterpart} before the whole court
F2. the herald read it out in the square, and the clerks defaulted the terms the same hour
N1. the open renunciation

#### GRAMMAR/credibility_charge (GR-4)
F1. this line has disavowed {band}
F2. the word of {settlement}'s seat is priced lower this season than last
N1. the price now set on a seat's word

#### GRAMMAR/renegotiated (GR-5)
F1. the terms were reopened mid-term and cut to the present balance
F2. {counterpart} gave ground it did not have to give, the alternative being worse
N1. terms cut to the present balance

#### GRAMMAR/renewal_refused (GR-5)
F1. they asked for new terms and were told the old ones stand
F2. {counterpart} read the demand, weighed its own books, and declined
N1. the demand that was declined

#### GRAMMAR/brokered_back (GR-6)
F1. {settlement} stood between them before the first march
F2. the muster went cold, and {npc}'s name is written into the reason for it
N1. the march talked back down

#### GRAMMAR/brokerage_failed (GR-6)
F1. {settlement} stood between them and was walked around
F2. the terms were carried, and neither court moved
N1. the mediation neither court took

#### GRAMMAR/term_granted.mutual_defense (GR-3)
F1. if one is struck, both answer
F2. the musters are bound together for the term, and the frontier captains have been told
N1. the defence sworn between them

## §2.7 — INFORMATION (fourteen kinds)

#### INFO/plant_exposed (IN-0a)
F1. what {house} sold of {counterpart} does not match what the roads bring
F2. two tellings out of {house} cannot both be true
N1. the broken word out of {house}

#### INFO/plant_backfired (IN-0a)
F1. the story {faction} bought against {counterpart} came home named
F2. {counterpart}'s clerks hold the forgery and the forger's price in the same file
N1. a bought story with its buyer's name on it

#### INFO/lure_sprung (IN-2) `[DM]`
F1. they marched on a weakness that was bought for them
F2. the column is on the {route} road on a muster count {house} sold them
N1. a march made on a furnished weakness

#### INFO/lure_backfired (IN-2)
F1. {faction} marched on a bought weakness and learned the price after the fact
F2. the grievance names {house} and the buyer both
N1. a bought war that became an avenged one

#### INFO/bluff_collision (IN-2) `[DM]`
F1. two courts, two bluffs, one war neither wanted
F2. each reckoned the other's garrison at a strength the other had invented
N1. the war two bluffs made between them

#### INFO/grievance_named_lie (IN-2 / IN-5)
F1. the ledger of grievances opens with a forgery, and now it is named
F2. the case begins not at a border but with a bought story
N1. the forgery at the head of the ledger

#### INFO/courier_turned (IN-4) `[DM]`
F1. {npc} carried {faction}'s cargo to {house} first and to {counterpart} after
F2. the detour cost a leg, and the leg shows
N1. a packet that arrived late, and altered

#### INFO/courier_intercepted (IN-4) `[DM]`
F1. {npc} was taken on the {route} road with {faction}'s cargo
F2. what {counterpart} paid for will not arrive
N1. a packet taken on the road

#### INFO/sweep_witch_hunt (IN-3)
F1. they found no spy at {settlement}, and named one anyway
F2. {npc} was named on a season's association and nothing firmer
N1. the name the sweep found instead of a spy

#### INFO/house_ruined_name (IN-3)
F1. {house} keeps its counting-house and no longer keeps its custom
F2. the stamp is worth nothing at any quay
N1. a ruined name behind an open door

#### INFO/word_came_too_late (IN-4)
F1. the word clearing {npc} reached {settlement} after the seat had already ruled
F2. the letter came in on the evening tide; the gate had been answered at noon
N1. the truth that arrived after the ruling

#### INFO/court_sat_still (IN-5)
F1. the court knew, and sat still
F2. the council had corroborated word of the muster and passed to the next business
N1. the knowing that was not acted on

#### INFO/scandal_join (IN-5)
F1. the house that fell this season had been named {timeband_span} before
F2. the condition that named it has stood on the record since {season}
N1. the naming nobody pursued

#### INFO/race_market_moved (IN-4)
F1. word of the fall reached the market a day before the survivors did
F2. the grain was gone by the time they told it
N1. a market that moved on the road's word
---

# §3 CONNECTIVE POOLS

One pool per provenance edge TYPE. A connective is the ONLY thing in a composed
sentence that asserts a relationship, and it may assert exactly the relationship the
edge holds. Substituting across pools is the whole failure mode this section exists
to prevent: a `followed` edge dressed in a `caused` connective is a fabricated
causal claim in prose, invisible to every walker that checks receipts rather than
sentences.

### How a connective is tagged

Each line carries two tags.

- **Direction.** `back` — the connective sits after the CHILD and points to the
  PARENT (*"{settlement} emptied down the {route} in a season, **born of** the
  hungry gap"*). This is the default and the shape of both owner exemplars. `fwd` —
  the connective sits after the PARENT and points to the CHILD, for tellings that
  run forward through time (*"the hungry gap, **and out of it came** the emptying"*).
  A telling picks ONE direction and holds it for the whole chain; mixing them mid-
  sentence is how a reader loses which end is the cause.
- **Argument.** `N` takes a noun phrase (an `N` clause form from §2). `F` takes a
  finite clause (an `F` form). `V` takes a bare verb phrase — one connective family
  only, flagged where it appears. `A` is absolute: the connective carries its own
  parent inside it and takes no argument, closing the link on its own. An `A`
  connective may only be selected when the parent's identity is already on the page
  — otherwise it renders a link to nothing.

## §3.1 — THE EIGHT TYPED EDGES AND THEIR SIXTEEN CONNECTIVE POOLS

**One key, two grains (R-CAU-I).** §0c's EIGHT typed edges are the tags: every
mold in §1 carries one of them, and law 1 is checked against them and nothing
else. The SIXTEEN pools below are those eight edges' named inflections — each
keeps its own warranting receipt classes and every connective it was authored
with, and each sits under the parent whose relation it renders. A composer
selects the PARENT from the provenance edge and then the POOL from the receipt
class; a checker only ever has to ask whether the parent matches. Reading the
group headings backward is the whole of the reversal if the chair would rather
ship the sixteen as a key of their own.

| §0c parent | Pools under it |
|---|---|
| `succession` | `followed` · `remembered` · `exposed` |
| `origination` | `caused` |
| `answer` | `answered` |
| `charge` | `priced` |
| `belief` | `believed` · `planted` *(DM arm)* · `judged` |
| `gate` | `refused` · `dissolved` |
| `instrument` | `enforced` · `breached` · `inherited` · `buried` |
| `carriage` | `carried` |

The three assignments §3 originally left flagged, with the reasoning on the
record: `remembered` and `exposed` are `succession` because elapsed
record-time and a surfacing both follow their parent with no agency in
between; `judged` is `belief` because a verdict is a reading on the observer's
own axis and asserts no truth, which is `belief`'s exact charter; `inherited`,
`buried` and `breached` are `instrument` because a successor's carry, a policy
severing and a default all run through a drafted artifact. Substituting a
connective ACROSS PARENTS remains the failure mode this section exists to
prevent — a `succession` edge dressed in an `origination` connective is a
fabricated causal claim in prose, invisible to every walker that checks
receipts rather than sentences.

### `succession` — the effect follows the cause in the record with a causal ancestor join, no agency between them

#### `followed` — same-window succession under a shared ancestor
CW-1 detects the ancestor; the sibling link is TEMPORAL ONLY. **MUST NEVER render
as because.** This is the edge the no-false-causality pin exists to protect, and
every connective below is chosen so that a reader who assumes cause is assuming it
without help from the page.

1. `following` — back·N
2. `in the wake of` — back·N
3. `on the heels of` — back·N
4. `and it came after` — back·N
5. `the year after` — back·N *(carries a time band; see §3.3)*
6. `and after it` — fwd·N
7. `and then` — fwd·F

**FORBIDDEN in this pool:** *because · so · out of · born of · the work of · which
came of.* A composer that falls back to the `caused` pool when a `followed`
connective does not fit has manufactured the causality the corpus promises never to
manufacture. The correct fallback is to drop the link, not to re-label it.

#### `remembered` — the same party's own decayed memory crossing a threshold
Turning points, grievance fixation and revanchism, permanent disposition, diaspora
memory, `corner.remembered_generational`. Nothing changed hands; the same town is
still holding it. Almost always spends a time band.

1. `on a grudge as old as` — back·N
2. `not forgotten since` — back·N
3. `remembered from` — back·N
4. `out of a memory of` — back·N
5. `and {settlement} has not forgotten` — fwd·N
6. `and it is remembered still that` — fwd·F
7. `and the town has not let go of` — fwd·N

#### `exposed` — a covert prior surfaced
`plant_exposed`, `corruption_exposed`, `envoy_treason_exposed`, `house_unmasked`,
`faith.covert.exposed`. The edge asserts that the thing became SAID, not that it
became true; it was true before, and the receipt for the surfacing is what is new.

1. `when it came out that` — back·F
2. `once it was known that` — back·F
3. `after it was shown that` — back·F
4. `on the naming of` — back·N
5. `on the exposure of` — back·N
6. `and then it was said aloud that` — fwd·F
7. `and what came out was` — fwd·N

### `origination` — the cause PRODUCED the effect

#### `caused` — the strict causal parent
A `causes[]` entry naming the prior, or `sourceEventId` pointing at the producing
event. **The only edge that may render as causation without qualification** — and
the only pool licensed to spend *because*, *so*, and *the work of*.

1. `born of` — back·N
2. `out of` — back·N
3. `the work of` — back·N
4. `which came of` — back·N
5. `because` — back·F
6. `and the cause entered against it is` — back·N
7. `and out of it came` — fwd·N
8. `and so` — fwd·F *(licensed here and nowhere else in this section)*

### `answer` — a deliberate ACT with a recorded reason, taken in response

#### `answered` — a responsive act keyed to a named prior
The mirror casus pairs, petition → `commons_answered`, ransom demanded → paid or
refused, mediation offered → `brokered_back`, `casus_atrocity_answer`.

1. `in answer to` — back·N
2. `in reply to` — back·N
3. `which answered` — back·N
4. `and the answer to it was` — fwd·N
5. `and they answered it with` — fwd·N
6. `and the answer came back` — fwd·F
7. `which was answered when` — fwd·F

### `charge` — the effect is a PRICE paid for the cause

#### `priced` — a cost or charge computed off the prior
Refusal costs, `coalition_expenditure_read`, `credibility_charge`, tribute strain,
the disrepute surcharge, the lie's fall. The edge says a bill was calculated, never
that it was just.

1. `the bill for` — back·N
2. `the price of` — back·N
3. `paid for` — back·N
4. `the reckoning for` — back·N
5. `and the bill came to` — fwd·N
6. `and it was paid for when` — fwd·F

### `belief` — the join runs through a BELIEF, not a fact — always attributed, asserts no truth the record did not hold

#### `believed` — the link IS a belief record
Per-observer reads, believed scarcity and conditions and devotion, the margin
believed at signature, the mistaken clause, belief misjudgment. **Never retro-
corrected to truth.** The clause a `believed` edge reaches renders as the belief it
was, whatever the world turned out to hold. Dramatic irony is the product.

1. `believing` — back·F
2. `on a report that` — back·F
3. `on the word that` — back·F
4. `because the court took it for` — back·N
5. `on a report of` — back·N
6. `and the court held it for` — fwd·N
7. `and it was taken for` — fwd·N

#### `planted` — the belief edge whose parent is a deliberate lie `[DM]`
A liable planter exists and is named in the record. **DM audience only.** On a
player surface this edge degrades to `believed` by connective SWAP (R-W5-F): the
sentence keeps its shape, the reader keeps the irony, and the planter is not leaked
— not as a name, not as a stub, not as a hole where a name would sit.

1. `planted on them by` — back·N
2. `on a lie sold to them by` — back·N
3. `on a story bought out of` — back·N
4. `believing exactly what` — back·F
5. `on a picture furnished by` — back·N
6. `and the furnishing of it was` — fwd·N

#### `judged` — an observer's verdict read on a prior act
World judgment, the razing judgments, the sovereignty-sale judgment, the alignment
reads. **Never a truth claim — a reading, on the OBSERVER's own axis.** Every
variant either names the observer or says *the neighbours*, so that no judgment
floats free as the world's own opinion.

1. `for which the world holds them` — back·A
2. `as the neighbours reckon it` — back·A
3. `in the reckoning of` — back·N
4. `and it was called` — fwd·N
5. `and the courts have named it` — fwd·N
6. `and it is held against them as` — fwd·N

### `gate` — the cause BLOCKED or PERMITTED the effect — the negative arm, where the counterforce lives

#### `refused` — the non-act edge, where a named refusal is the cause
`peace_refused`, `permit_refusal`, the commons' refusal, the lure resisted, no
overlap, `declined_to_broker`, `coalition_refused`. **The counterforce's home
edge.** Every tragedy in this corpus can also not happen, and this is the joint the
not-happening hangs on; a corpus that renders only the disasters has quietly
decided the world is doomed.

1. `for the refusal of` — back·N
2. `when they would not` — back·V *(the one bare-verb-phrase connective in this
   section: "when they would not come", "when they would not have it")*
3. `against the refusal of` — back·N
4. `and the answer was no` — back·A
5. `and the refusal entered against it is` — fwd·N
6. `and nobody would` — fwd·V

#### `dissolved` — the parent condition ceased to hold and the effect ended with it
`war_cause_dissolved` and its sacred, lineage, and opportunism forms; the tolerance
exit when an institution closes; condition resolution; the pact lapsing with its
pair.

1. `once it no longer stood` — back·A
2. `the cause being gone` — back·A
3. `and nothing was left to hold it` — back·A
4. `with the end of` — back·N
5. `after the dissolution of` — back·N
6. `and there was nothing left to answer for` — fwd·A

### `instrument` — the join runs through a drafted artifact — a term, a pact, a clause, a decree

#### `enforced` — a term, permit, or gate biting the effect into being
The war block, the demilitarization cap, the occupation hold, permit refusals, the
embargo floor. The instrument DID something; the clause it reaches is the
instrument, not the intention behind it.

1. `under the terms of` — back·N
2. `by the letter of` — back·N
3. `as required by` — back·N
4. `the {term} forbidding it` — back·A
5. `because the terms said so` — back·A
6. `and the instrument would not allow` — fwd·N

#### `breached` — an obligation defaulted or a term broken
`treaty_default_detected`, `cc.contract_default`, `coalition_debt_unpaid`,
`pact.breached`, the breached faith terms, the credit obligation's default.

1. `after the breach of` — back·N
2. `on the default of` — back·N
3. `when the wagons stopped coming` — back·A
4. `the promise being broken` — back·A
5. `once the terms were not kept` — back·A
6. `and what was broken was` — fwd·N

#### `inherited` — a successor-side carry
The ladder's inherited stake at reduced weight, `conquest_inheritance`,
`succession_demand_inherited`, founding provenance, the oath's minting seat, the
departure memory at the receiving end. The thing CHANGED HANDS — that is what
separates this edge from `remembered`.

1. `left them by` — back·N
2. `come down from` — back·N
3. `inherited with the seat from` — back·N
4. `sworn by the father in` — back·N
5. `and it came down to` — fwd·N
6. `and the son holds what` — fwd·F

#### `buried` — the deliberate severing of a live edge, and its reversal
The burial decree, the blessed burial, the wound family set aside, the grievance
tempered, and `dug_up`. **The only edge a seat can create by policy rather than by
event** — which is why it is the only one whose connectives can run in both
directions on the same pair within one chain.

1. `set aside at a price` — back·A
2. `under a burial decree` — back·N
3. `after the seat set aside` — back·N
4. `buried, and then not` — back·A
5. `and it was dug up again after` — fwd·N
6. `and the seat set it aside at` — fwd·N

### `carriage` — the join is made by a CARRIER moving along an edge

#### `carried` — a mover physically bore the effect across
Migration columns, caravans and shipments, errands, the rumor carriers, faith's
conversion carriers. **At the carrier's own speed** — a `carried` edge may never
render as instantaneous, and a connective that implies the effect was already
waiting at the far end is wrong for this edge.

1. `carried down the road by` — back·N
2. `brought by` — back·N
3. `which came with` — back·N
4. `which arrived with` — back·N
5. `and it travelled at the speed of` — fwd·N
6. `and the roads carried it to` — fwd·N
7. `and it came in with` — fwd·N

## §3.2 — THE TWO TERMINALS

A terminal is not an edge. It closes the walk, takes no argument, and is the last
thing in a telling. Both pools are absolute (`A`).

### `chain_end` — the walk's origin marker
**ONE pool serves BOTH the genuine origin AND the covert truncation**, seeded on the
VISIBLE chain only. Every variant must be true in both cases. This is the sharpest
content constraint in the corpus: two pools would leak the covert seam through
wording, and a shared pool seeded on the hidden link would leak it through variant
selection.

1. `the walk stops here`
2. `the record goes back this far and no further`
3. `what stands before this, the record does not say`
4. `the account carries nothing behind this`
5. `the trail ends here`
6. `behind this the page is blank`

**THE STANDING BAN.** No variant may ever contain *began · beginning · origin ·
first · started · where it all comes from* (false at a covert seam), nor *hidden ·
kept back · withheld · not shown · sealed · someone has seen to it* (a tell). A new
variant that survives both bans and reads true whether or not anything is being
concealed is a valid addition; anything else is a leak with good intentions.

### `horizon` — retention cut the chain
Fires on RETENTION ONLY — the pulse history, the news window, the turning-point
cap. **May NEVER render at a covert seam**: using it there would be both a lie and
a tell, since it distinguishes the covert case from the genuine end, which
`chain_end` exists to prevent.

1. `the trail runs past living memory`
2. `there is no one still keeping the account that far back`
3. `the older books were not kept`
4. `that far back, the town keeps no account`
5. `the years before that are out of reach of the record`
6. `it goes back past anything anyone kept`

## §3.3 — TIME BANDS ON THE CONNECTIVE SIDE

**The band vocabulary is §0d's and is not restated here.** §0d mints the family —
the closed six, derived from `sinceTick` against `INTERVAL_WEEKS`, with four print
positions (`{timeband}` attributive · `{timeband_span}` after a preposition ·
`{timeband_since}` adverbial · `{timeband_age}` predicate) and its own 6×4
inflection table. A second table here would be two writers owning one vocabulary,
which is the defect this corpus forbids in code and should equally forbid in prose.
What follows is only what §0d does not cover: how a band behaves at a JOIN.

**Where a band may sit in a composed sentence.** Three positions, and no fourth.
(a) Inside a connective that carries one — *the year after* (`followed`), *on a
grudge as old as* (`remembered`) — where the band is the connective's own
adverbial. (b) Inside a clause form's band slot, where §2 declares one. (c) As a
standalone `{timeband_since}` adverbial opening the telling. A band never appears
as a bare figure and never appears twice.

Five rules ride the joins.

1. **No numeral in a duration, spelled or otherwise** (§0b law 2, which overrides
   the sibling annexes' R-CPL-G). *Ten years on* is not available to this block even
   though the sibling corpus spends it; *a decade on* is the same band without the
   count.
2. **The band law governs the JOIN, not the interior of a clause.** *(RECORDED,
   VETOABLE.)* Several inherited exemplars spend a short interval inside their own
   prose — *a day before the survivors did · the wharf revised itself in an
   afternoon · the clerks struck it the same afternoon · emptied down the {route} in
   a season*. These carry no numeral, are the receipt's own texture, were shipped in
   the sibling annexes, and are preserved under R-W5-B. They are not renders of a
   chain link's `sinceTick`, they do not consume the sentence's one band, and a scan
   that reds them is scanning the wrong grain. The distinction is checkable: a band
   render answers *how long between these two receipts*; texture answers *what the
   day was like*.
3. **A band is a rendering of a derivation, never an assertion of its own.** *A
   generation's grudge* is licensed only where the walk's own `sinceTick` puts THAT
   link in THAT band. A composer reaching for the most dramatic band available has
   invented a duration, and the invention is undetectable in the sentence — only the
   walk beneath it can catch it.
4. **One band per sentence.** Two bands in one telling read as a timeline, and a
   timeline invites the reader to do arithmetic the corpus refuses to publish.
5. **The sixth band is predicate-only** (§0d). A join whose chain lands in *older
   than its bearers* and whose connective needs an attributive or span position
   falls back to a bare connective rather than printing a broken phrase — the same
   fallback §0d already specifies for molds.

## §3.4 — THE SIX CHAIN SHAPES

Each shape is a skeleton over the edge pools, with one worked example built ONLY
from §2 clause forms and §3 connectives. Both registers are shown: the HEADLINE is
the event plus at most ONE causal gesture, hard-capped, chain shapes of two-plus
links FORBIDDEN; the TELLING is the same chain, behind the click, freed from
headline compression and entailed link by link. Below both sits the cause-walk
table, unchanged — the ledger truth the telling projects.

---

### SHAPE 1 — THE STRAIGHT LINE
**Skeleton:** `CHILD ← caused ← PARENT ← caused ← GRANDPARENT`
The plain cascade: three receipts, two strict causal edges, one direction. The
commonest shape and the one every other shape is measured against.

> **HEADLINE** — {settlement} emptied down the {route} in a season, born of the
> hungry gap and what it took.
>
> **TELLING** — {settlement} emptied down the {route} in a season, born of the
> hungry gap and what it took, which came of the cut road and the falling lofts.
> {band} left {settlement}, and the roll has not recovered.

*Parts:* `POP/exodus` F1 → `caused` (*born of*) → `POP/burial_hunger` N1 →
`caused` (*which came of*) → `TRADE/grain.blockade_bite` N1; closing clause is
`POP/exodus` F2, the child's own second fact, carried forward rather than joined.

---

### SHAPE 2 — THE MISTAKEN CHAIN
**Skeleton:** `CHILD ← believed ← PARENT(as belief) ← carried ← CARRIER`, closing on
`chain_end`
A belief edge in the middle. The world acts, correctly by its own lights, on a
picture nobody has checked. The `believed` connective is load-bearing: it is the
difference between reporting what a court did and asserting what was true.

> **HEADLINE** — {settlement} takes up arms over what is believed done at
> {third_party}, on a report carried down the road by the columns that came away
> from it.
>
> **TELLING** — {settlement} takes up arms over what is believed done at
> {third_party}, on a report that a town was burned and the burners rode home —
> carried down the road by the columns that came away from it. Someone must stop
> them: it is the whole argument. What stands before this, the record does not say.

*Parts:* `WAR/casus_atrocity_answer` F1 → `believed` (*on a report that*) →
`WAR/razing_done` F1, de-addressed to the reported grain the casus actually carries
→ `carried` (*carried down the road by*) → the carrier NP; closing clause is
`WAR/casus_atrocity_answer` F2, then the `chain_end` terminal. Note what the
telling does NOT say: not that the burning happened, not that it did not. The
receipt holds a belief and the sentence holds a belief.

---

### SHAPE 3 — THE LONG FUSE
**Skeleton:** `CHILD ← remembered[band] ← PARENT`, with an `inherited` link where the
holding changed hands
The old wound answered late. This is the shape the owner's first exemplar names —
*a generation's grudge will be met* — and the shape the time bands exist for.

> **HEADLINE** — {settlement} spent its right of answer on {counterpart} — a
> generation's grudge, and the burning it was minted for.
>
> **TELLING** — {settlement} spent its right of answer on {counterpart}, on a grudge
> as old as the burning of {settlement}, a right of answer that does not decay the
> way grievances decay, come down from the seat that minted it a generation gone.
> What was owed for the burning was collected.

*Parts:* `WAR/vengeance_license_prosecuted` F1 → `remembered` (*on a grudge as old
as*) → `WAR/razing_done` N1, with `WAR/vengeance_license_minted` F2 as the
qualifying clause and an `inherited` link (*come down from*) to the minting seat;
band = **a generation's**, one band, once. Closing clause is
`WAR/vengeance_license_prosecuted` F2.

---

### SHAPE 4 — THE CONFLUENCE
**Skeleton:** `CHILD ← caused ← PARENT_A` **and** `CHILD ← followed ← PARENT_B`
Two parents at one child, and only one of them is a cause. The shape exists to be
told honestly: the second parent joins on `followed` and stays there. **The
headline may carry only the `caused` parent** — a headline that gestures at both has
composed a two-link chain, which the headline register forbids, and a headline that
gestures at the `followed` parent alone has implied a cause the walk does not hold.

> **HEADLINE** — the streets of {settlement} rose over {reason}, out of the corner
> closing on {settlement}'s {good}.
>
> **TELLING** — The streets of {settlement} rose over {reason}, out of the corner
> closing on {settlement}'s {good}, and in the wake of the hungry gap and what it
> took. They took the gates off the granary and carried little of it away.

*Parts:* `POP/commons_riot` F1 → `caused` (*out of*) → `TRADE/corner.gate_crossed`
N1; and the same child → `followed` (*in the wake of*) → `POP/burial_hunger` N1.
The reader may draw a line from the hunger to the riot; the page does not draw it.
This one sentence is the no-false-causality pin in prose form, and it is the
sentence to put in front of anyone who wants to know why the two pools are
separate.

---

### SHAPE 5 — THE REFUSAL
**Skeleton:** `CHILD ← refused ← PARENT` (the counterforce shape; `dissolved`
composes identically)
The chain that stops. Nothing burns, and there is still a receipt, still a cause,
still a sentence worth reading. A corpus that can only tell disasters has a
tonal bug, not a content gap.

> **HEADLINE** — the work at {settlement} was set aside, for the refusal of the
> seat's own call.
>
> **TELLING** — The work at {settlement} was set aside, for the refusal of the
> seat's own call; no one came to the muster field, and no one had to be told not
> to. The plan closed unfinished, entered as refused by the commons.

*Parts:* `POP/refused_by_the_commons` F1 → `refused` (*for the refusal of*) →
`POP/commons_refusal` (the call, nominalised) with its F2 as the qualifying clause;
closing clause is `POP/refused_by_the_commons` F2.

The `dissolved` twin, same skeleton, one substitution: *{settlement} stood between
them before the first march; the intent formed on a favourable reckoning, and once
it no longer stood there was nothing left to hold it.* (`GRAMMAR/brokered_back` F1 →
`dissolved` → `WAR/conquest_intent_formed` N1.)

---

### SHAPE 6 — THE TRUNCATED WALK
**Skeleton:** `CHILD ← <any edge> ← PARENT ← [chain_end | horizon]`
The honest stop. Two terminals, and choosing between them is a correctness
question, not a taste one: `horizon` fires when RETENTION cut the chain and may
never fire at a covert seam; `chain_end` fires everywhere else, and its variants are
written to be true whether the walk genuinely ends or has been truncated for
audience.

> **HEADLINE** — the grudge was older than either man, out of a memory of the
> {wound} at the founding.
>
> **TELLING (chain_end)** — The grudge was older than either man, out of a memory of
> the {wound} at the founding, older than its bearers. {settlement}
> remembers what was done at {counterpart}'s hands, and remembers it in detail.
> What stands before this, the record does not say.
>
> **TELLING (horizon — retention only)** — …the same sentence, closing instead on:
> the trail runs past living memory.

*Parts:* `INTERIOR/founding_wound_named` F1 → `remembered` (*out of a memory of*) →
its own N1, band = **older than its bearers**; closing clause is its F2, then the
terminal. The two tellings differ by one line, and that line is a factual claim
about the RECORD — which is why the composer may not choose it for rhythm.

## §3.5 — WHAT THIS BLOCK DELIBERATELY DOES NOT DO

- **It composes nothing.** §2 and §3 are vocabulary. The braid and the arc
  composers assemble; the assembly lives display-side and reads state that is
  already persisted. No engine writer, no new field, no new token.
- **It does not author the JOIN MOLDS.** The coupling-keyed molds — the ~60-80
  families with their own angle palettes — are a separate block. Where a mold
  exists for a pair, it wins over a generic clause-plus-connective composition; the
  parts here are the floor under the molds, and the fallback where no mold has been
  authored yet.
- **It does not author the SUBHEADER.** See R-W5-H. The resemblance is real and it
  is a trap.
- **It sets no significance and no desk.** Both are the minting kind's, assigned in
  its own volume from the spine's one family. A composed telling inherits the class
  of its top member and mints no scale, exactly as the braid does.
- **It does not deepen the sibling pools.** Every kind here already has its own
  four-to-twelve variant pool in its own annex; these clause forms are a THIRD
  register beside those, for the seam. The frequency-scaled floor applies to this
  block per JOIN FAMILY, not per kind, and the phrase-repetition envelope covers
  composed sentences at the family grain — a clause that reads identically in forty
  tellings a season is below its floor however many variants sit beside it.

## §3.6 — CENSUS OF THIS BLOCK

| Unit | Count |
|---|---|
| §2 kinds with clause forms | 175 (WAR 46 · TRADE 29 · FAITH 26 · POP 22 · INTERIOR 21 · GRAMMAR 17 · INFO 14) |
| §2 clause variants (2 finite + 1 nominal per kind) | 525 |
| §2 kinds fenced `[DM]` | 8 |
| §3 connective pools | 16, grouped under §0c's 8 typed edges (R-CAU-I) |
| §3 terminal pools | 2 |
| §3 connectives authored | 104 across the edges, 12 across the terminals |
| §3.3 time bands | 0 minted — §0d's family, with five join-side rules added |
| §3.4 chain shapes, each worked | 6 |
| New slots minted | 0 (`{timeband_span}` is §0d's, spent in 3 clauses) |
| New tokens minted | 0 |
| Reconciliations against the §0 header | 3, recorded above |
| Edges flagged for the chair against §0c's eight | 0 — all assigned by R-CAU-I; reversible in one read of §3.1's group table |

---

## §4 THE INTEGRITY-DISCLOSURE LINES (appended at the completion pass,
## 2026-08-03, per SP-6's MANIPULATION DISCLOSURE + MUTATED PLANT laws —
## the causality popup's per-link integrity register, DM-facing; states
## are lineage-aware, never guessed; the organic case NEVER names an
## author, including the wear atop a plant)

**SLOTS:** `{house}` `{npc}` `{settlement}` `{purpose}` `{timeband_since}`
**AUDIENCE:** dm-only (the popup is the DM's; player projections strip the
disclosure whole)

**CLEAN**
1. The record carries this as it happened.
2. No hand touched this on the road; it arrived as it left.
3. What was said is what was so.

**WORN IN THE TELLING** *(authorless — the road did it)*
4. The tale grew in the carrying; nobody grew it on purpose.
5. Worn in the telling — each mouth added a little, and no mouth owned it.
6. What left as a report arrived as a story; the road charges no one.
7. The drift here is the ordinary kind: distance, seasons, and retelling.

**PLANTED** *(the commissioner and the purpose, always)*
8. Planted by {house}, to {purpose}. The record holds the sowing.
9. This did not spring up; it was set — {house}'s hand, {timeband_since},
   and the purpose is entered: {purpose}.
10. A bought tale: {npc} carried it, {house} paid for it, and what it was
    for is on the record — {purpose}.
11. The seed is signed. {house} planted this at {settlement} to {purpose},
    and the ledger has held the receipt since.

**PLANTED, THEN WORN** *(the seed-not-growth law: the sowing is charged;
the growth is the road's)*
12. Planted by {house} to {purpose} — and grown in the carrying into
    something its planter never wrote. The record charges the sowing; the
    rest is the road's.
13. The seed was {house}'s; the harvest is nobody's design. What was set
    as a whisper walks now as a tale twice its size.
14. Begun on purpose, finished by accident: {house} set it, {timeband_since},
    and every mouth since has made it stranger.
15. The intent is on the record — {house}, to {purpose}. What the tale
    became after is wear, and wear has no author.

**UNKNOWN** *(the honest terminal — never guessed)*
16. The record cannot say where this began; it is old, and its first
    carrier is not entered.
17. Provenance ends here. What stands before this link was never
    receipted, and the paper will not invent it.
18. Unknown — and marked so, because a guessed culprit would be a second
    manipulation.
