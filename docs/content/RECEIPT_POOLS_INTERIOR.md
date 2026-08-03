# RECEIPT POOLS — FP-INTERIOR (the seat, the court, and the crowd: the seeded variant corpus)

## Fable 5 content authoring, 2026-08-02. Annex to `docs/DESIGN_FP_INTERIOR.md`,
## discharging the SP-6 CONTENT-DEPTH FLOOR (`DESIGN_FP_SPINE.md` §2 SP-6):
## **every phrased kind ships a seeded variant pool of AT LEAST FOUR templates**,
## each a different STRUCTURE AND ANGLE — the volume's exemplar sentence is the
## pool's FIRST member, never its whole. The volumes spec kinds; this file is the
## content. Shape follows the war volume's `WAR_RECEIPTS`
## (`src/domain/worldPulse/eventProse.js:189`): per-kind pools, seeded per entity
## so same-seed worlds keep their sentences.

**Status: CONTENT. Nothing here schedules a wave, lights a flag, or rules a band.
Where this annex and DESIGN_FP_INTERIOR.md disagree about a kind's existence, wave,
audience or significance class, the volume wins and the disagreement is a bug to
report. Where this annex and DESIGN_FP_SPINE.md disagree about the floor, the spine
wins. INT-8's upgrades to LIT kinds (coup, faction, investiture) are OWNER-GATED
under J-INT-13: the pools below exist so the ruling has something to weigh — they
do not authorise their own lighting.**

---

## THE SLOT CONVENTION

No template ever bakes a proper noun or a rendered count. Every name and every cause
is a slot, filled at render from the receipt's own address chain (NEWS ADDRESS LAW:
full address chain + typed action + settlements BY NAME + the recorded reason).

**Canonical slots (corpus-wide, the same ten every annex uses):**

| Slot | Fills with |
|---|---|
| `{settlement}` | the subject settlement, by name — in this volume, the town whose hall, seat or ledger is being read |
| `{counterpart}` | the other settlement in the pair — the rival, the host court, the treaty partner, the buried grudge's other side |
| `{npc}` | a cast NPC read through existing planes (seat-holder, bloc champion, exile, origin holder of a grudge); never minted, never a fate resolved |
| `{faction}` | the faction or interior BLOC named on the receipt (the Salt Ring, the Old Swords) |
| `{house}` | the merchant/landed house named on the receipt |
| `{temple}` | the temple or observance named on the receipt |
| `{band}` | a band word from a CLOSED band vocabulary — quantity (`QUANTITY_BANDS`, `demographicsHerald.js:58`), duration, magnitude or hall-weight (`a handful`, `a score`, `many`, `most`, `a generation`, `rising`, `heavy`) — never a figure |
| `{reason}` | the recorded reason, in band words (the address law's fourth field) |
| `{good}` | the good at issue — grain, silver, the restitution package |
| `{route}` | the road or lane, by its in-world name |

**Volume-local slots (DECLARED here, four, each filled from a CLOSED engine
vocabulary — never free text):**

| Slot | Fill | Source |
|---|---|---|
| `{decision}` | the decision as an in-world act phrase without its counterpart name — "the war", "the peace", "the pact", "the severance", "the sale of the town", "the burying of the grudge" | INT-3a's CLOSED decision vocabulary `{war_opened, peace_signed, peace_refused, pact_signed, pact_refused, pact_repudiated, severance_declared, stance_changed, settlement_sold, grudge_buried}` (volume §5 INT-3a). The counterpart is a SEPARATE `{counterpart}` fill; the decision phrase never carries a name. |
| `{wound}` | the wound family word — "the sack", "the tribute", "the betrayal", "the occupation", "the imposition", "the raid", "the contest" | INT-6's seven-family closed enum via `woundFamilyOf(incidentType)` (volume §5 INT-6). Never the open `WOUND_TYPE_RE` substring. |
| `{burden}` | one co-present burden, in band words — the tribute of a named counterpart, a war grown long, a hungry season, an occupation, a compromised court | INT-4's CLOSED burden vocabulary `{tribute_strain, war_exhaustion, famine, occupation, corruption}` (volume §5 INT-4). CO-PRESENCE wording only: see HONESTY below. |
| `{standing}` | the legitimacy band word — Endorsed, Secure, Contested, Crisis | the EXISTING legitimacy bands (volume §2 row 1); INT-7 mints no new band. |

**Repeated slots bind in order.** `{faction} counsels peace; {faction} calls for the
march` fills the first from the first bloc on the receipt and the second from the
second, in the receipt's own order. In `investiture` the first `{npc}` is the heir
and the second the predecessor (the existing headline's order,
`npcLadderKernel.js`). In every INT-5 block `{settlement}` is the town whose ledger
is being read and `{counterpart}` is the other side of the pair.

**Slot-filled institution names take singular agreement.** "The Old Swords" is one
body in the hall: `{faction} calls for the march`, never `call`.

**Pronouns are de-gendered as part of slot substitution.** Where a volume exemplar
carried `he`/`her` bound to a baked name, the annex line carries the seat, the
office, or a repeated `{npc}` instead. This is slot substitution, not a rewrite.

---

## THE HARD CONSTRAINTS THIS FILE IS WRITTEN UNDER

1. **NO DIGITS.** No line below contains a numeral, a ratio, a percentage, a year
   label or a spelled-out exact count. Quantities, ages, durations and hall-weights
   speak only through `{band}` or through band words already in the prose (*a
   handful, a generation, more than once, a long quiet*). Wave ids in the headings
   (INT-1 … INT-8) are metadata, not prose, and are the only digits in the file.
   **THE PAIR CARVE-OUT:** `two` / `both` / `second` appear ONLY where they name a
   fixture of the design — the SEAT'S BOOK and the TOWN'S BOOK, the two ends of one
   edge, the two halls of one pair, the two clauses of the sentence they sit in —
   never a count read off state. A count of blocs, seasons, holders or wounds is a
   `{band}` fill.
2. **HEADLINE HONESTY (R-28).** Every verb below is entailable by the receipt's own
   facts. INT-4's `attributed_pressure` is the sharpest case and the annex holds the
   line the volume drew: the crossing receipt names CO-PRESENT burdens and joins
   none of them causally; only `pressure_named_cause` — the matched
   `LEGITIMACY_ARCHETYPES` condition — may use the word *cost*. INT-3's join
   receipts speak causally because the join is arithmetic in the verdict, and only
   past the margin the volume pins.
3. **BELIEF ATTRIBUTION.** Belief-side content — the believed threat that forms a
   survival bloc, the exile's account of home, the crowd's reading of sealed terms,
   the town's severity read on a buried feud — carries its attribution (*the word
   is, men said, it is said, believed, said to be*). Nothing believed is stated as
   engine truth, and no line reads truth across a border (THE DOMESTIC-TRUTH
   BOUNDARY, volume §1b).
4. **LAW ONE.** No line confirms a god acted; the `{temple}` fills in this volume
   witness an oath and seal a rite, and never more. No line resolves or states a
   named person's fate: a fallen seat's holder *keeps a name and no chair*, an
   exile *returns, fades, or is reconciled*, a sold-back guest goes home in a cart
   and the receipt stops there (J-INT-8, product scope law).
5. **SUPPRESSION, NEVER DELETION.** Every INT-6 line that speaks of a buried grudge
   says the rows survive. A line implying a record was erased is a defect against
   J-INT-4, not merely a bad sentence.
6. **THE FAMILY RULE.** Slot variety is not depth. Two templates differing only in
   slot fills are ONE family for the floor's count. Every variant takes a different
   STRUCTURE and a different ANGLE off the palette — *the event plain · the street's
   view · the ledger's or institution's view · the consequence forward · the
   understatement or irony*. **Dossier-line pools are the declared exception in
   shape, not in substance:** a dossier line is a LABELLED FIELD, so its label
   repeats by design and the family rule counts the READING after the colon, which
   differs in claim across every variant (a standing, an absence, a reversal).
7. **AUDIENCE.** Every kind is authored PUBLIC except two, which carry
   `AUDIENCE: dm-only` and ride `includeCovert` exactly as the premium-isolation law
   requires: `books_patron_served` (INT-1's compromised-seat arm) and
   `emigre_true_purpose` (INT-3b's declared/true split).
8. **SIGNIFICANCE.** Classes are the spine's SP-6a family (`routine / notable /
   major`). This annex ASSIGNS per J-INT-11 (books-standing LOWEST and change-gated;
   bloc counsel LOW; overrides and joins HIGH); it never authors a scale. Dossier
   lines are projections, not Herald entries, and carry `n/a`.

---

## THE KIND CENSUS (seventy-six phrased kinds across eight waves)

| Wave | Phrased kinds | Count |
|---|---|---|
| INT-1 | books_standing_agreed · books_standing_seat_above_town · books_standing_town_above_seat · books_collapsed · books_patron_served (dm-only) · books_standing_line (dossier) | 6 |
| INT-2 | counsel_given · counsel_heeded · counsel_overridden · bloc_formed_survival · bloc_dissolved · bloc_position_line (dossier) | 6 |
| INT-3a | decision_grievance_opened · decision_join_named · decision_reversed · successor_demand_made · pact_reread · endings `held` `overturned_war_party` `overturned_peace_party` `demand_honoured` `demand_betrayed` `repudiated_by_heir` `reaffirmed_by_heir` · verdict_history_line (dossier) | 13 |
| INT-3b | emigre_flight · emigre_sheltered · emigre_turned_away · emigre_sold_back · emigre_true_purpose (dm-only) · harboring_grievance · emigre_false_hope · endings `exile_returned` `exile_faded` `exile_reconciled` · emigre_guest_line (dossier) · emigre_away_line (dossier) | 12 |
| INT-4 | attributed_pressure · pressure_named_cause · tribute_terms_unknown · rally_receipt · endings `paid_and_fell` `paid_and_stood` `paid_and_forgiven` · strain_line (dossier) | 8 |
| INT-5 | founding_wound_named · grudge_lineage_named · memory_asymmetry · oldest_wound_line (dossier) | 4 |
| INT-6 | burial_decreed · burial_price_failed · wound_family_set_aside · grievance_tempered · burial_unanswered · burial_misread · dig_up_petitioned · endings `buried_and_blessed` `buried_and_borne` `buried_and_answered` `dug_up` `lapsed_with_the_pair` · burial_line (dossier) | 13 |
| INT-7 | legitimacy_crossing_risen · legitimacy_crossing_fallen · legitimacy_reseed_crossing · standing_line (dossier) | 4 |
| INT-8 | coup_held · coup_fell · investiture · faction_government_challenge · faction_institution_suppression · faction_institution_capture · faction_service_bolster · faction_law_preference_push · faction_exhaustion · faction_rival_power_contest | 10 |
| | **TOTAL** | **76** |

**All twenty declared endings tokens are pooled** — INT-2's `heeded` `overridden`;
INT-3's `held` `overturned_war_party` `overturned_peace_party` `demand_honoured`
`demand_betrayed` `repudiated_by_heir` `reaffirmed_by_heir` `exile_returned`
`exile_faded` `exile_reconciled`; INT-4's `paid_and_fell` `paid_and_stood`
`paid_and_forgiven`; INT-6's `buried_and_blessed` `buried_and_borne`
`buried_and_answered` `dug_up` `lapsed_with_the_pair` — matching §8's "TOTAL over
all 20 declared tokens".

**All twenty-one §9 Herald-contract sentences are present as variant 1 of their
kind**, slotted and de-dated per the conventions above.

**Declared empty, with reason (silence is a decision, not an omission):**
- **INT-4's commons tribute term** phrases nothing of its own: it feeds the EXISTING
  commons-voice grievance composite through the existing writer (volume §5 INT-4),
  and the rung ladder's beats are FP-POPULATIONS' kinds. A new commons kind here
  would be a second writer wearing prose.
- **INT-5's seam correction** fires nothing fast ("Fast: nothing new fires", volume
  §5 INT-5). Its three phrased kinds are READS the seam makes possible, not beats
  the seam emits.
- **INT-7's certification row, envelopes and v5 channels** phrase nothing a reader
  sees (the POP-7 discipline). They MEASURE the pools above; the PHRASE-REPETITION
  instrument (spine SP-6, THE ENVELOPE) reads this file, and its mutant negative
  control collapses one pool to a single variant and must red.

---

# INT-1 — THE BOOKS GENERALIZED

*Flag `seatBooksEnabled`. Change-gated emission (J-INT-11a): a books-standing
receipt fires only on a weight-band or winning-book CHANGE, the agreement deadband
being the gate. These are domestic reads of domestic state; no line reads across a
border.*

### books_standing_agreed (INT-1) — Herald, the seat's counsel — significance: routine
SLOTS: {settlement}, {npc}, {decision}
AUDIENCE: public
1. Seat and town of one mind: the counsel weighed the realm's good. *(§9)*
2. {npc} put the question to the hall of {settlement} and got back the answer already written on the granary door.
3. There was no argument in {settlement} worth the clerks' ink; the seat's interest and the town's ran the same way.
4. The court of {settlement} kept one book this season, the two having nothing to disagree about.
5. What was good for {npc} was good for {settlement}, which is not always so and was not remarked upon.
6. The talk in the market of {settlement} ran ahead of the hall and arrived where the hall arrived.
7. A hearing settled this easily costs the seat nothing and buys it nothing, and the reckoning for that comes later.
8. A pedlar who sat through the hearing in {settlement} said there was nothing in it worth carrying to the next town.
9. The hall of {settlement} rose before the lamps were lit, and the clerks went home with dry pens.

### books_standing_seat_above_town (INT-1) — Herald, the seat's counsel — significance: routine
SLOTS: {settlement}, {counterpart}, {npc}, {decision}
AUDIENCE: public
1. {npc}'s counsel weighed the seat above the town, and {decision} went on. *(§9)*
2. The hall of {settlement} was told what the realm required; the ledger it was read from was {npc}'s own.
3. {settlement} asked for {decision} to end. {npc} counted what the ending would cost the seat, and it did not end.
4. The town's book and the seat's book were both read in {settlement} that season; only one was read aloud.
5. Grain left {settlement} to keep {decision} standing, and the hand that signed for it slept the better of the two.
6. In the lanes of {settlement} they had the shape of the hearing before the clerks did, and were not surprised by it.
7. {decision} stands another season, and {settlement} will be asked for the same again at the turn of it.
8. Carters out of {settlement} carried the account with them: the town asked, the seat counted, and {decision} went on.
9. A miller of {settlement} put the question plainly in the hall and was thanked plainly for it, and that was the end of the matter.

### books_standing_town_above_seat (INT-1) — Herald, the seat's counsel — significance: routine
SLOTS: {settlement}, {counterpart}, {npc}, {decision}
AUDIENCE: public
1. The town's book carried the hearing in {settlement}: {decision} was set down for the granary's sake, not the seat's.
2. {npc} took the harder road for the seat and the easier one for {settlement}.
3. The counsel weighed {settlement} above the seat that governs it, and the clerks entered it without comment.
4. {npc} spent the seat's own standing to buy {settlement} its quiet.
5. It was not the safe choice, and the mills kept turning.
6. The granary of {settlement} was full when the hall rose, and the town read the hearing from that alone.
7. Travellers said the hall of {settlement} had done an unusual thing, and told it as a curiosity rather than a virtue.
8. The choice was made before the frost, and {settlement} lived on it the whole winter.
9. {npc} will be shorter of friends at the next hearing, and the mills of {settlement} will still be turning at it.

### books_collapsed (INT-1) — Herald, the seat's counsel — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {reason}
AUDIENCE: public
1. With {reason} at the gates of {settlement}, seat and town stopped keeping separate books.
2. {npc} read one ledger to the hall of {settlement}, there being no second one left worth reading.
3. The argument in {settlement} ended the week the danger became plain; nobody had the leisure for it.
4. Danger makes a court honest, as it usually does, and for exactly as long as it lasts.
5. {settlement} and its seat wanted the same thing at last, and neither was glad of the reason.
6. Men who had argued in the hall of {settlement} all spring carried the same buckets that week.

### books_patron_served (INT-1) — Herald, covert desk (includeCovert only) — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {house}, {decision}
AUDIENCE: dm-only
1. The counsel {npc} gave the hall of {settlement} served a book kept in {counterpart}.
2. {npc} weighed a ledger no clerk of {settlement} has ever been shown.
3. {decision} was settled in {settlement} to the profit of {house}, and {house} holds no seat in that hall.
4. The seat of {settlement} read for {counterpart} and called the reading its own.
5. Nothing in the record of {settlement} is false. The order the pages were read in is the whole of it.
6. The reading holds as long as {house} finds it worth the keeping, and the hall of {settlement} will not be told when that ends.

### books_standing_line (INT-1) — town page, ruling-power card — significance: n/a (dossier line)
SLOTS: {settlement}, {standing}, {decision}
AUDIENCE: public
1. Seat: {standing}. Counsel: the realm's good above its own. *(volume exemplar, de-gendered)*
2. Seat: {standing}. Counsel: its own footing first; the town's book is read second.
3. Seat: {standing}. Counsel: seat and town of one mind this season.
4. Seat: {standing}. The hall has not been asked since the season turned.
5. Seat: {standing}. Counsel: the town's good, bought with the seat's own standing.
6. Seat: {standing}. Counsel: {decision} carried on the seat's own account, over the hall's entered objection.
7. Seat: {standing}. Counsel: divided — the hall was heard, and the book keeps both entries.
8. Seat: {standing}. Counsel: unchanged since the seat was taken; nothing has moved the weighing.
9. Seat: {standing}. Counsel: withheld — no position entered on {decision} at all.

---

# INT-2 — THE POSITIONS WIRED

*Flag `settlementPoliticsEnabled`, composed at read time with the default-true
`factionCompetitionEnabled`. Under the `quiet_local` preset no blocs form and none
of these kinds emits — the declared degraded arm (volume §3).*

### counsel_given (INT-2) — Herald, the hall — significance: routine
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {faction} counsels peace; {faction} calls for the march. *(§9)*
2. {npc} of {faction} counsels {decision} in the hall of {settlement}, and is not alone in it.
3. The hall of {settlement} divided over {counterpart} along the lines it always divides on.
4. More than one counsel was entered in the book of {settlement} this season, and they do not agree about {counterpart}.
5. Everyone in the hall of {settlement} wants what is best for {settlement}. That is the difficulty.
6. The hall of {settlement} sat late over {decision}, and the clerks sent out for candles.
7. Whichever counsel {settlement} follows on {counterpart}, the other is in the book and will be read out afterwards.
8. A factor lodging in {settlement} wrote that the hall was of no single mind about {counterpart}, and that it was no quiet place to lodge.
9. The clerks of {settlement} entered the counsels in the order they were spoken and left the weighing to the seat.

### counsel_heeded (INT-2, ending token `heeded`) — Herald, the hall — significance: routine
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {faction} called for the march, and {npc} heard them. *(volume exemplar)*
2. The hall of {settlement} asked for {decision}, and got it.
3. {faction} carried the argument in {settlement}; the seat signed what the hall had settled already.
4. {npc} took the counsel of {faction} and let it be known whose counsel it was.
5. There was nothing to overturn in {settlement} that season, which is how {faction} likes a season.
6. The word went round {settlement} that the hall had won this one, and the word was right.
7. {faction} will ask for more at the next hearing, having learned this season what asking is worth.
8. It was settled before the ice went out of the river, and nothing since has unsettled it.
9. {npc} signed it in the same sitting the hall asked in, which the hall noticed.

### counsel_overridden (INT-2, ending token `overridden`) — Herald, the hall — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {faction} called for the march, and {npc} did not hear them. *(§9)*
2. The hall of {settlement} was heard out, thanked, and disregarded.
3. {faction} entered its counsel in the book of {settlement}; the seat entered the opposite, and the book keeps both.
4. {npc} chose against {faction}, and {faction} has begun counting the seasons.
5. The seat of {settlement} may do as it likes. {faction} has a long memory and a place in the hall.

### bloc_formed_survival (INT-2) — Herald, the hall — significance: notable
SLOTS: {settlement}, {counterpart}, {faction}, {npc}, {reason}
AUDIENCE: public
1. With {counterpart} said to be arming, the old quarrels of {settlement} went quiet and {faction} formed.
2. {faction} was made in a week in {settlement}; the word from the walls was {reason}, and nobody asked twice.
3. Men who had not spoken in {settlement} for years sat together, and the clerks entered {faction} in the roll.
4. {faction} exists because {settlement} believes {counterpart} means it harm, and will last exactly that long.
5. Fear makes short friendships in {settlement}. {faction} is one of them.
6. The roll of {settlement} gained {faction} in a single sitting, and the older rolls it was drawn from are thinner for it.

### bloc_dissolved (INT-2) — Herald, the hall — significance: notable
SLOTS: {settlement}, {counterpart}, {faction}, {reason}
AUDIENCE: public
1. {faction} is struck from the roll of {settlement}; the siege lifted, and the reason with it.
2. Nobody dissolved {faction}. It stopped meeting, and the clerks noticed a season later.
3. The hands that made {faction} in {settlement} are not the hands in the hall now.
4. {faction} kept its name a while after it kept its purpose, which is the usual order.
5. The newcomers to {settlement} hold none of the old wounds, and {faction} was built of nothing else.
6. The room {faction} used in {settlement} is let to a cooper now, and nobody entered an objection.

### bloc_position_line (INT-2) — town page, faction card — significance: n/a (dossier line)
SLOTS: {settlement}, {counterpart}, {faction}, {decision}, {band}
AUDIENCE: public
1. {faction}: counsels peace with {counterpart}; weight in the hall: rising. *(volume exemplar)*
2. {faction}: counselled {decision} against {counterpart}; the seat did as it asked.
3. {faction}: against {decision}; overruled {band} past, and still asking.
4. {faction}: no position entered on {counterpart} this season.
5. {faction}: for {decision}, and the seat has stopped answering.
6. {faction}: for {decision} against {counterpart}; weight in the hall: {band} and falling.
7. {faction}: against {decision}; heeded {band} past, and holding the seat to it.
8. {faction}: formed on {counterpart}; it is said to have no other business.
9. {faction}: counsels {decision}; not carried, and not withdrawn either.

---

# INT-3a — THE ORGANIZING GRIEVANCE + THE CAUSAL JOIN

*Flag `interiorVetoEnabled`. The join receipts speak causally ONLY past the join
margin; the join negative (a coup with no live decision-grievance) prints nothing
from these pools at all.*

### decision_grievance_opened (INT-3a) — Herald, the hall — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {faction} has not forgiven {decision} with {counterpart}, and says so in the hall of {settlement} weekly.
2. The grievance entered against {npc} in {settlement} is not a personal one; it is {decision}, and it is written down.
3. {faction} lost the argument over {decision} and began, that season, to count who else had lost it.
4. In {settlement} the quarrel stopped being about {counterpart} and became about who signs for {settlement}.
5. {faction} calls {decision} a mistake. What it means is that the seat made it.
6. They have a name for {decision} in the lanes of {settlement} now, and it is not the name in the book.

### decision_join_named (INT-3a) — Herald, the verdict — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {faction} holds the hall; {decision} that {npc} would not end is named in the verdict. *(§9)*
2. The seat of {settlement} changed hands, and the reason entered in the book is {decision} with {counterpart}.
3. They did not take the hall of {settlement} over {npc}. They took it over {decision}.
4. The verdict of {settlement} names {decision} first and the seat's own failings second.
5. It took a handful of seasons and a bad harvest, but {decision} cost the holder the seat in the end.

### decision_reversed (INT-3a) — Herald, the hall — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {npc} sued for peace, and the hall grew quiet. *(§9)*
2. {decision} was undone in {settlement}, and the grievance against it had nothing left to stand on.
3. {faction} won its argument late; the seat reversed itself and kept its chair.
4. The clerks of {settlement} entered the reversal beside the grievance, and the grievance stopped being cited.
5. Nobody in {settlement} thanked {npc} for it, and nobody moved against the seat again that year.
6. The rider carrying the end of {decision} left {settlement} before the ink was dry, and the hall sat on in silence.

### successor_demand_made (INT-3a) — Herald, the verdict — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. The hall that seated {npc} in {settlement} has told {npc} what it expects of {counterpart}.
2. {faction} did not install a seat in {settlement} for the pleasure of it; the demand is entered beside the transfer.
3. The seat of {settlement} was bought, and the price is written into the succession record.
4. {npc} takes the seat of {settlement} owing a debt no ledger of coin records.
5. They gave {npc} the hall. What they wanted was {decision}.
6. The town of {settlement} knows a bargain was made and does not know its terms, which is how bargains of this kind are kept.

### pact_reread (INT-3a) — Herald, the chancery — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {decision}
AUDIENCE: public
1. The new seat of {settlement} read every standing pact through its own eyes this season.
2. {npc} took the hall of {settlement} and called for the treaty box before the week was out.
3. Every instrument {settlement} holds with {counterpart} was weighed again; most survived the weighing.
4. The pacts of {settlement} did not change. The seat reading them did.
5. A treaty is only as old as the last hand that decided to keep it.
6. The clerks of {settlement} worked by candle through that season and entered a note against every instrument they touched.

### held (INT-3, ending token) — Herald, the verdict — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. The seat of {settlement} stood; {faction} had the grievance and not the count.
2. {npc} kept the hall of {settlement}, and the men who counted against the seat are still on the roll.
3. The hall of {settlement} was tested over {decision} and answered for the seat.
4. Nothing changed in {settlement} that season except who is watched.
5. The seat held. The grievance is still open. The book keeps both facts on one page.

### overturned_war_party (INT-3, ending token) — Herald, the verdict — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {faction} took the hall of {settlement}; the seat that would not fight does not sit in it.
2. The peace {npc} signed with {counterpart} outlived {npc}'s chair by a season.
3. {settlement} has a new seat and an old quarrel with {counterpart}, freshly in favour.
4. They overturned the seat of {settlement} for signing, and the signature stands until they get to it.
5. {settlement} did not change its mind about {counterpart}. It changed the hand that answers for it.

### overturned_peace_party (INT-3, ending token) — Herald, the verdict — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {faction} took the hall of {settlement}; {decision} that {npc} would not end ended with the seat instead.
2. The peace party of {settlement} holds the chair, and the first business of it is {counterpart}.
3. {settlement} pulled down the seat that kept the war, and kept the war a season longer anyway.
4. The commerce of {settlement} won the hall before it won the peace, in that order.
5. They took the seat to stop {decision}. Stopping it was the easier half.

### demand_honoured (INT-3, ending token) — Herald, the chancery — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {npc} did what the hall of {settlement} seated {npc} to do, and did it early.
2. The demand entered at the transfer is discharged; {faction} has what it paid for.
3. {settlement} learned this season what its coup bought, which is more than most halls learn.
4. {npc} kept faith with the men who made the seat, and the record of {settlement} says so plainly.
5. It was not gratitude. It was arithmetic, and it came out the same.

### demand_betrayed (INT-3, ending token) — Herald, the chancery — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {decision}
AUDIENCE: public
1. {faction} seated {npc} and has been waiting since; {decision} has not been done.
2. The demand stands unhonoured in the record of {settlement}, and the men who made the seat are counting again.
3. {npc} found the seat of {settlement} a different chair from the one {faction} described.
4. They installed a seat in {settlement} and got a ruler, which is not the same thing.
5. The coup of {settlement} bought nothing at all, and the whole hall now knows the price of that.

### repudiated_by_heir (INT-3, ending token) — Herald, the chancery — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {decision}
AUDIENCE: public
1. The father swore it; the son burned it. *(§9 — via GRAMMAR's oath-holder identity; the holder clause ships dormant until it lands, J-INT-10)*
2. {npc} put the seal of {settlement} to a page and then to the fire; the pact with {counterpart} is ended.
3. The instrument stood as long as the hand that signed it sat in {settlement}, and not a season longer.
4. {settlement} kept the paper and repudiated the promise, which the clerks of {counterpart} noted.
5. What is sworn at one seat is a debt at the next, and this seat declined to pay it.

### reaffirmed_by_heir (INT-3, ending token) — Herald, the chancery — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {decision}
AUDIENCE: public
1. The son kept the father's word, and both towns remembered. *(§9)*
2. {npc} came to the seat of {settlement} and let the pact with {counterpart} stand untouched.
3. The instrument was re-read at the transfer and re-sealed; {counterpart} was told before the season turned.
4. {settlement} changed its seat without changing its word, and the difference was noticed abroad.
5. Keeping it cost {npc} the hall's affection and bought {settlement} a long quiet.

### verdict_history_line (INT-3a) — town page, power-transfer history — significance: n/a (dossier line)
SLOTS: {settlement}, {counterpart}, {decision}, {band}, {reason}
AUDIENCE: public
1. {band} past: the seat fell; {decision} with {counterpart} is named in the verdict. *(volume exemplar, de-dated)*
2. {band} past: the seat fell; no foreign decision is named — the verdict reads {reason}.
3. {band} past: the seat held; the grievance over {decision} stayed open.
4. {band} past: the seat passed by succession; the standing pacts were re-read and kept.
5. {band} past: the seat passed by succession; the pact with {counterpart} was repudiated at the transfer.
6. {band} past: the seat was taken by force; a demand was entered beside the transfer.
7. {band} past: the seat fell; the demand made at the transfer stands unhonoured still.
8. {band} past: the seat held; {decision} with {counterpart} was reversed before the count was called.
9. {band} past: no contest entered; the seat has not been tested since it was taken.

---

# INT-3b — THE ÉMIGRÉ

*Flag `interiorVetoEnabled`. THE EXILE STAYS ON THE HOME ROSTER (J-INT-15): every
line below is a projection over the SP-1 errand record — an away-mark at home, a
guest-mark at the host, never an absence. Endings are {returned, faded, reconciled}
and nothing else, ever (J-INT-8).*

### emigre_flight (INT-3b) — Herald, the road — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}
AUDIENCE: public
1. The defeated captain of {faction} rode east; the hall of {counterpart} received the rider. *(§9)*
2. {npc} lost the contest in {settlement} and was on the road before the verdict was copied out.
3. There was nothing left for {npc} in {settlement} but the walk to the gate, and {npc} took a horse instead.
4. {settlement} did not exile {npc}. {settlement} stopped being a place {npc} could stay.
5. The roll of {settlement} still carries {npc}'s name. The chair is what {npc} lost.
6. The gate of {settlement} was opened out of hours for {npc}, and the porter has been asked about it since.

### emigre_sheltered (INT-3b) — Herald, the host court — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}
AUDIENCE: public
1. The hall of {counterpart} gave {npc} a room, a table, and no promises.
2. {counterpart} received the loser of {settlement}'s contest and made certain {settlement} heard of it.
3. {npc} sits at {counterpart}'s table now, and what {npc} says of {settlement} is listened to.
4. Sheltering {npc} cost {counterpart} nothing this season. The bill for it comes later, as it always does.
5. {counterpart} keeps a claimant the way a house keeps a key it has no lock for yet.
6. Travellers said the guest was seated high at {counterpart}'s table, and said it where it would carry.

### emigre_turned_away (INT-3b) — Herald, the host court — significance: routine
SLOTS: {settlement}, {counterpart}, {npc}, {reason}
AUDIENCE: public
1. {counterpart} heard {npc} out at the gate and sent {npc} on with bread.
2. The hall of {counterpart} would not seat the loser of {settlement}'s quarrel; it wanted no part of that quarrel.
3. {npc} was refused at {counterpart} kindly, which is a refusal still.
4. {counterpart} weighed a guest against a grievance with {settlement} and chose the grievance it did not yet have.
5. Prudence looks like mercy from the road, and {npc} took it either way.
6. The hall of {counterpart} entered {reason} against the request and closed the page on it.
7. {npc} took the road again, and every hall on it now has a reason not to be the first.
8. It was a hard season for guests at {counterpart}, and {npc} arrived in the middle of it.
9. They gave {npc} a meal, a blessing at the door, and the name of a hall further off.

### emigre_sold_back (INT-3b) — Herald, the host court — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {good}
AUDIENCE: public
1. {counterpart} sold {npc} back to {settlement}, and both halls entered the price.
2. The guest of {counterpart} went home in a cart {counterpart} was paid {good} for.
3. {settlement} got what it asked for, and {faction} will not forget who handed it over.
4. There was a price on {npc} in {settlement}, and {counterpart} judged it a fair one.
5. Hospitality in {counterpart} has a rate. This season the rate was published.

### emigre_true_purpose (INT-3b) — Herald, covert desk (includeCovert only) — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}
AUDIENCE: dm-only
1. {npc} left {settlement} on a private errand. The errand has a patron, and the patron is {faction}.
2. What {npc} carries to {counterpart} is not grief; it is an offer.
3. The road {npc} takes is the declared one. The purpose is not.
4. {faction} did not lose a captain. {faction} placed one.
5. {npc} will ask {counterpart} for shelter, and will have asked for something else by spring.
6. The shelter {npc} asks of {counterpart} is the door; what goes through it afterwards is {faction}'s business.

### harboring_grievance (INT-3b) — Herald, the hall — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}
AUDIENCE: public
1. They keep our traitor at their table. *(§9)*
2. {settlement} has entered a grievance against {counterpart} for the guest {counterpart} will not give up.
3. Every season {npc} sits in {counterpart}'s hall is a season {settlement} counts.
4. The quarrel between {settlement} and {counterpart} is no longer about the contest; it is about the chair {npc} sits in.
5. {counterpart} calls it hospitality. {settlement} has another word, and uses it at every meeting.
6. The clerks of {settlement} enter the guest in the account with {counterpart} now, beside the older items.

### emigre_false_hope (INT-3b) — Herald, the host court — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {reason}
AUDIENCE: public
1. {counterpart} moved on {settlement} believing the seat was falling; the seat had been steady a season by then.
2. The word {counterpart} acted on was {npc}'s, and it was old before it was spoken.
3. {counterpart} came to a hall that was not divided any more, and had to explain itself.
4. A pretender's picture of home ages badly, and {counterpart} paid for believing it.
5. Everything {npc} told {counterpart} had been true once.
6. The muster {counterpart} raised came home again, and what it had been raised on was a season out of date.

### exile_returned (INT-3b, ending token) — Herald, the road — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}
AUDIENCE: public
1. A later verdict in {settlement} opened the road, and {npc} came back up it.
2. {faction} holds the hall of {settlement} again, and its captain has come home to sit in it.
3. {npc} returned to {settlement} with {counterpart}'s manners and {settlement}'s grudges.
4. The chair {npc} lost was still there. The men who took it were not.
5. {settlement} welcomed {npc} home and watched {npc} closely, both at once.
6. The roll of {settlement} was never corrected, so there was nothing to write when {npc} came back through the gate.

### exile_faded (INT-3b, ending token) — Herald, the host court — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}
AUDIENCE: public
1. {counterpart} tired of its guest; the errand closed, and {npc} keeps an ordinary place in an ordinary hall now.
2. Nothing happened to {npc} at {counterpart}. That was the whole of it.
3. The claim {npc} carried out of {settlement} is not spoken of at {counterpart}'s table any more.
4. {settlement} stopped watching the east road, and nobody in {settlement} could say exactly when.
5. Pretenders are expensive, and {counterpart} found other things to spend on.
6. The errand closed the way a season closes, with nobody able to name the day it ended.

### exile_reconciled (INT-3b, ending token) — Herald, the road — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {wound}
AUDIENCE: public
1. The {wound} was buried, and {npc} came home under its terms.
2. {settlement} and {counterpart} sealed a peace with a clause about a guest, and the guest walked back through the gate.
3. {faction} and the seat of {settlement} settled; {npc}'s errand closed warmly, which is rare.
4. What could not be won in the hall of {settlement} was granted, in the end, at a table with wine on it.
5. Both towns wrote it down as generosity. Both towns were also tired.
6. The clause naming the guest is the shortest in the instrument and took the longest to write.

### emigre_guest_line (INT-3b) — host town page, NPC listing — significance: n/a (dossier line)
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {band}
AUDIENCE: public
1. {npc} of {settlement}, in exile at this court. *(volume exemplar)*
2. {npc} of {settlement}, sheltered here since the contest; the home seat has asked for {npc} back.
3. {npc} of {settlement}, at this court on a declared errand; the errand has not closed.
4. {npc} of {settlement}, a guest of the hall — {settlement} has entered a grievance over it.
5. {npc} of {settlement}, formerly of {faction}, seated below the salt these {band}.
6. {npc} of {settlement}, received at the gate and quartered in the town rather than the hall.
7. {npc} of {settlement}, a guest of this court; a price has been named for {npc} at home.
8. {npc} of {settlement}, at this court {band}; the errand that brought {npc} here has closed.
9. {npc} of {settlement}, sheltered without terms — nothing asked of {npc}, and nothing promised.

### emigre_away_line (INT-3b) — home town page, faction card — significance: n/a (dossier line)
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {band}
AUDIENCE: public
1. Its captain rides east, {band} gone. *(volume exemplar, de-dated)*
2. {npc} is away from {settlement} on an errand, and carried on the roll still.
3. {npc}: at the court of {counterpart}, {band} gone; the place here is filled by another.
4. {npc} is abroad; {faction} keeps the place open and says nothing about it.
5. {npc} left after the contest and has sent no word.
6. {npc}: away {band}; the hall has asked {counterpart} for {npc}'s return and had no answer.
7. {npc}: away {band}; {faction} has entered a grievance over where {npc} is kept.
8. {npc}: away since the season of the contest, and the seat has not asked after {npc} at all.
9. {npc}: abroad; word came back that {npc} sits at a table in {counterpart} and is listened to.

---

# INT-4 — THE NARRATED MIDDLE

*Flag `strainAttributionEnabled`. CO-PRESENCE, NOT DECOMPOSITION: the crossing
receipt names burdens that STAND, and joins none of them to the seat's weakening.
`pressure_named_cause` is the single kind licensed to say cost, and only for a
matched `LEGITIMACY_ARCHETYPES` condition. Sub-margin contributions keep the generic
receipt and print nothing from these pools.*

### attributed_pressure (INT-4) — Herald, the seat's standing — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {burden}, {band}
AUDIENCE: public
1. The seat weakens, and these burdens stand — the tribute of {counterpart}, a war grown long. *(volume exemplar)*
2. The seat of {settlement} is pressed. Standing against it this season: {burden}, and {burden}.
3. What {settlement} carries and what {settlement}'s seat is worth are two entries, and the same season carries both.
4. {burden} sits on {settlement}, and the hall has grown short with {npc}. The book records both and joins neither.
5. A season of {burden} in {settlement}, and a seat with less credit at the end of it than the beginning.
6. The book of {settlement} carries {burden} on one page and the seat's standing on another, and draws no line between them.

### pressure_named_cause (INT-4) — Herald, the seat's standing — significance: major
SLOTS: {settlement}, {npc}, {reason}
AUDIENCE: public
1. {settlement}'s seat lost standing for a named cause: {reason}, exposed and entered in the book.
2. The tribute and the war stand where they stood; it is {reason} the hall answered for.
3. The clerks of {settlement} can point to the week and to the reason, which is rarer than it sounds.
4. {reason} cost {npc} standing in {settlement} directly, and the record will bear the weight of the word.
5. A named cause, an entry to match it, and a fall in the standing of {settlement}. The rest was weather.

### tribute_terms_unknown (INT-4) — Herald, the street — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {good}, {band}
AUDIENCE: public
1. What {settlement} pays {counterpart} was never read out; the market has settled on an account of its own.
2. The terms were sealed in {settlement}, and the town believes the worst of them, which is customary.
3. Men said the tribute of {counterpart} was heavier than the granary showed. Men were not shown the granary.
4. {npc} kept the terms close, and the hall of {settlement} debated the rumour instead, and voted on it.
5. A court that hides a price pays it twice — once in {good}, once in talk.
6. What the market of {settlement} says the carts carried is {band} above anything a clerk will confirm.

### rally_receipt (INT-4) — Herald, the verdict — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {decision}
AUDIENCE: public
1. The seat steadied — the war did what the court could not. *(§9)*
2. {npc} kept the hall of {settlement} on the strength of a war going well, and knows it.
3. The men who would have moved against the seat of {settlement} are at the muster instead.
4. {settlement} forgave its seat everything for a season, on account of {counterpart}.
5. There is nothing like a war believed winnable for quieting a hall.
6. The grievances entered against the seat of {settlement} are all still in the book, and none was called this season.

### paid_and_fell (INT-4, ending token) — Herald, the verdict — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {good}
AUDIENCE: public
1. {npc} paid the tribute of {counterpart}, and it cost {npc} the seat. *(§9)*
2. The installments left {settlement} on time, every time, and the hall changed hands regardless.
3. {settlement} kept the peace and lost the seat that kept it.
4. The {good} that bought {settlement} its quiet is the same {good} the hall counted against {npc}.
5. Every payment was lawful and entered in the book. The book is what they read at the verdict.

### paid_and_stood (INT-4, ending token) — Herald, the verdict — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {good}
AUDIENCE: public
1. {npc} paid, and kept the hall; the tribute of {counterpart} goes out still.
2. {settlement} pays and mutters, and pays again at the turn of the season.
3. The tribute was put to {settlement}'s hall as a charge against {npc}, and the hall declined to make it one.
4. Nothing was forgiven in {settlement}, and nothing was overturned either.
5. The town got used to it, which is the cheapest outcome there is.
6. The carts go out of {settlement} at the same gate on the same day, and the town has stopped coming to watch.

### paid_and_forgiven (INT-4, ending token) — Herald, the street — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {good}, {band}
AUDIENCE: public
1. {npc} paid, and the town forgave {npc} — the war was over. *(§9)*
2. The tribute of {counterpart} is heavy in {settlement} and reckoned cheap against what it ended.
3. {settlement} looked at the price, and at the years the price bought, and stopped complaining inside a season.
4. They call it the price of the peace in {settlement} now, which is a kinder name than it had.
5. {npc} kept the hall, and the {good} is entered now beside the peace it bought, not against the seat.
6. A drover who had not passed through {settlement} since the war said the town speaks of the tribute the way it once spoke of a tithe.

### strain_line (INT-4) — town page, treaty and obligation summary — significance: n/a (dossier line)
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. The tribute of {counterpart}: heavy; the town remembers the war it ended. *(volume exemplar)*
2. The tribute of {counterpart}: {band}; the town does not believe it bought anything.
3. The tribute of {counterpart}: {band}, and the terms were never read out here.
4. The tribute of {counterpart}: discharged; the last cart went out {band} past.
5. No outbound obligation stands against {settlement} this season.
6. The tribute of {counterpart}: {band}, and the first item the hall of {settlement} reads each season.
7. The tribute of {counterpart}: {band}; the seat has asked for it to be lightened and been refused.
8. The tribute of {counterpart}: in arrears; the shortfall stands entered against {settlement}.
9. The tribute of {counterpart}: {band}, and carried without complaint since the season it was set.

---

# INT-5 — THE MEMORY SEAM + THE FOUNDING WOUND

*Flag `memoryHorizonSeamEnabled`. These are READS the seam makes possible — the
oldest wound is only still in the ledger because the lookback window scales with the
lifespan band. Attribution fires only past the same margin discipline as INT-4's
rally receipt.*

### founding_wound_named (INT-5) — Herald, the payoff — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {wound}, {band}
AUDIENCE: public
1. The grudge was older than either man: the {wound} of {settlement}, {band} gone, still burned. *(§9)*
2. {settlement} remembers what was done at {counterpart}'s hands {band} gone, and remembers it in detail.
3. The oldest entry still counted against {counterpart} is the {wound}, and it has outlasted every clerk who copied it.
4. The men who did it are gone from {counterpart}, the men who suffered it are gone from {settlement}, and the account is open.
5. {settlement} could tell you the season. That is the trouble with a long memory.
6. The entry is copied in a hand no clerk of {settlement} living has seen used, and it is copied still.

### grudge_lineage_named (INT-5) — Herald, the payoff — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {wound}, {band}
AUDIENCE: public
1. The grudge of old {npc}, carried by {band} successors. *(volume exemplar, de-counted)*
2. {npc} first entered this grudge in {settlement}, and no hand since has struck it out.
3. The seat of {settlement} inherited a quarrel with {counterpart} along with the chair and the keys.
4. It is not {npc}'s grudge any more. It is the office's, and the office does not forget.
5. Each new hand has held it a little lighter, and none has yet let it go.
6. Whoever takes the chair of {settlement} next is handed the account with the keys, and is not asked whether it is wanted.

### memory_asymmetry (INT-5) — Herald, the payoff — significance: notable
SLOTS: {settlement}, {counterpart}, {wound}, {band}
AUDIENCE: public
1. {settlement} had forgotten; {counterpart} had not. *(§9)*
2. What {settlement} settled a lifetime ago is said to be this season's business in {counterpart}.
3. The two towns keep the same event in different books, and only one of the books is still open.
4. {counterpart} came to the table with an old account. {settlement} had to be told what it was.
5. Long-lived neighbours are patient about everything except this.
6. A herald out of {counterpart} named the {wound} at the table, and the clerks of {settlement} had to send for the old book.

### oldest_wound_line (INT-5) — town page, neighbours card — significance: n/a (dossier line)
SLOTS: {settlement}, {counterpart}, {wound}, {band}
AUDIENCE: public
1. Oldest wound: the {wound} of {settlement}, {band} gone. *(volume exemplar)*
2. Oldest wound with {counterpart}: the {wound}, {band} gone; {counterpart} is said to have let it go.
3. Oldest wound with {counterpart}: the {wound} — buried by decree, and no longer read.
4. Oldest wound with {counterpart}: none still counted; the book is old and quiet.
5. Oldest wound with {counterpart}: the {wound}, carried by {band} holders of this seat.
6. Oldest wound with {counterpart}: the {wound}, {band} gone; {counterpart} is said to keep a heavier account of it than {settlement} does.
7. Oldest wound with {counterpart}: the {wound} — buried by decree and dug up since; both entries stand.
8. Oldest wound with {counterpart}: the {wound}, {band} gone and past the hall's own memory; the book carries it alone.
9. Oldest wound with {counterpart}: the {wound}; there is no one on that road to hold it against now.

---

# INT-6 — DELIBERATE FORGIVENESS

*Flag `deliberateForgivenessEnabled`. SUPPRESSION, NEVER DELETION (J-INT-4): every
line here leaves the rows where they are. TWO ARMS, TWO SCOPES (J-INT-14): the
revanchism read is set aside family-scoped and exact; the grievance read takes a
banded, receipted discount and never a zero — the two pools are separate for exactly
that reason, and swapping their wording is a design defect, not a style choice.*

### burial_decreed (INT-6) — Herald, the decree — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {temple}, {wound}, {good}
AUDIENCE: public
1. By decree of the seat, the grudge with {counterpart} is buried; the price was paid in grain and pride. *(§9)*
2. {npc} named the {wound}, named its price, and had both read out in the square of {settlement}.
3. The book of {settlement} keeps every entry against {counterpart}; the seat has ordered that none of them be read.
4. The decree was sworn at the {temple} of {settlement}, before witnesses who will outlive the seat that swore it.
5. {settlement} paid {counterpart} in {good} for a quarrel {settlement} reckons it was owed for, which is what a burial is.
6. Nothing was forgotten in {settlement} that day. Something was set down, which is harder.

### burial_price_failed (INT-6) — Herald, the decree — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {good}, {wound}
AUDIENCE: public
1. The decree was read in {settlement} and the granary could not answer it; the burial binds nothing.
2. {npc} promised {counterpart} more {good} than {settlement} had, and the clerks entered the shortfall.
3. A peace was declared in {settlement} and not paid for, so there is no peace — only a declaration.
4. The carts never left {settlement}. The {wound} is where it was.
5. {settlement} learned what its reconciliation cost by failing to afford it.
6. The carts stood loaded in the yard of {settlement} until the grain in them was wanted elsewhere.

### wound_family_set_aside (INT-6, suppression arm i) — Herald, the ledger — significance: routine
SLOTS: {settlement}, {counterpart}, {wound}
AUDIENCE: public
1. The {wound} entries against {counterpart} are set aside by the burial, and no longer counted when {settlement} weighs a war.
2. {settlement} holds the rows still; the decree says they are not to be counted when the hall counts {counterpart}.
3. The war party of {settlement} may read the {wound} in the book. It may not cite it.
4. Everything of the {wound} family stands exactly where it stood, uncounted.
5. The burial covers the {wound} and nothing else. The rest of the book is open as ever.
6. The clerks of {settlement} struck no line; they wrote the decree across the head of the page and left the page.
7. The {wound} is still told in the lanes of {settlement}; it is the hall that has stopped hearing it.
8. When {settlement} next weighs {counterpart}, the {wound} will be in the book and out of the counting.
9. The pages were not touched. Only the use of them was.

### grievance_tempered (INT-6, suppression arm ii) — Herald, the ledger — significance: routine
SLOTS: {settlement}, {counterpart}, {wound}, {band}
AUDIENCE: public
1. The standing grievance of {settlement} against {counterpart} reads {band} lighter since the {wound} was buried.
2. {settlement} is not reconciled to {counterpart}. It is {band} nearer to it, and the decree is why.
3. The hall still argues about {counterpart}, and argues about it more quietly than it did.
4. One quarrel was buried. The account between {settlement} and {counterpart} carries more than one.
5. The decree took the heat off the account without closing it, which is all a decree can do.
6. The account of {settlement} against {counterpart} is entered {band} lighter, with the decree cited beside the discount.
7. They still name {counterpart} in the taverns of {settlement}, and name it {band} more mildly than before the burial.
8. The hall of {settlement} needs {band} more provocation from {counterpart} than it did, and no more than that.
9. Nothing was forgiven. Something was discounted, and the discount is written down.

### burial_unanswered (INT-6) — Herald, the decree — significance: notable
SLOTS: {settlement}, {counterpart}, {wound}
AUDIENCE: public
1. {settlement} buried its grudge with {counterpart}; {counterpart} has buried nothing.
2. Half a peace was made this season, and {settlement} made the half that costs.
3. The decree of {settlement} binds the hall of {settlement}. It was never going to bind {counterpart}.
4. Word of the decree went to {counterpart} at the road's speed, and no word has come back.
5. It takes both books to close an account, and only one of them was opened.
6. {settlement} has given up what it could cite and kept what it can be cited for.

### burial_misread (INT-6) — Herald, the decree — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {wound}, {good}
AUDIENCE: public
1. The grain was given, and {counterpart}'s other grudge still burned. *(§9)*
2. {settlement} buried the {wound} and found the {wound} was not what {counterpart} minded.
3. The price was paid in full against the wrong account.
4. {counterpart} took the carts, thanked {settlement}, and kept its quarrel.
5. A court can only bury what it believes it is holding.
6. The decree of {settlement} names the {wound} exactly, and it is the naming that was wrong.

### dig_up_petitioned (INT-6) — Herald, the hall — significance: notable
SLOTS: {settlement}, {counterpart}, {faction}, {wound}, {band}
AUDIENCE: public
1. {faction} has asked the seat of {settlement} to unbury what the seat buried.
2. The petition was entered in {settlement} the week the word from {counterpart} arrived.
3. {faction} never accepted the burial of the {wound}, and has waited in the hall, in the open.
4. What was set down in {settlement} is being argued over again, which is how these things go.
5. The decree is {band} older than the patience of {faction}.
6. The petition was read aloud at the market cross of {settlement}, which was the point of entering it.

### buried_and_blessed (INT-6, ending token) — Herald, the decree — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {wound}, {band}
AUDIENCE: public
1. The peace held, and the town came to bless it. *(§9)*
2. {settlement} kept the burial past the doubting season, and the hall counts it a good bargain now.
3. What was called surrender in {settlement} is called statesmanship in {settlement}, the words being cheap.
4. The seat spent standing to bury the {wound} and has been repaid with interest it never asked for.
5. Nobody in {settlement} argues about {counterpart} any more. It took a generation and a great deal of grain.

### buried_and_borne (INT-6, ending token) — Herald, the hall — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {wound}
AUDIENCE: public
1. The burial holds abroad and has never been forgiven at home.
2. {settlement} keeps the peace with {counterpart} and keeps the grudge against the seat that made it.
3. The decree stands. The hall has not stopped charging {npc} for it.
4. {settlement} is at peace with {counterpart} and out of temper with itself.
5. It was the right thing, and it has cost the seat something every season since.
6. They keep the peace with {counterpart} and keep {npc}'s name out of the toasts.

### buried_and_answered (INT-6, ending token) — Herald, the decree — significance: notable
SLOTS: {settlement}, {counterpart}, {wound}
AUDIENCE: public
1. {counterpart} buried in kind, and the two books closed the same season.
2. What {settlement} declared alone became an instrument with a seal at each end.
3. The peace between {settlement} and {counterpart} is not a decree any more. It is a bargain.
4. Both halls set their quarrels down, and both halls kept their rows.
5. It is the rarest entry in the book: an account closed by agreement.
6. Carters between the towns said the road was quieter that season, and could not say what had changed on it.

### dug_up (INT-6, ending token) — Herald, the decree — significance: major
SLOTS: {settlement}, {counterpart}, {npc}, {wound}, {band}
AUDIENCE: public
1. They dug up what their fathers buried, and the old wound bled new. *(§9)*
2. The seat of {settlement} revoked the burial; {counterpart}'s book gained the old {wound} back, and a new one for the revoking.
3. What was set aside {band} past is being cited in the hall of {settlement} again, word for word.
4. {settlement} broke its own word about {counterpart}, and the word is what it cost.
5. The rows were all still there. That was the point of keeping them, and it cuts both ways.

### lapsed_with_the_pair (INT-6, ending token) — Herald, the ledger — significance: notable
SLOTS: {settlement}, {counterpart}, {wound}
AUDIENCE: public
1. The burial ended with the pair it was made for; there is no {counterpart} on that road to keep it with.
2. The decree of {settlement} lapsed with the pair it named; the {wound} rows it covered are in the book still, uncounted by anyone.
3. Nobody revoked it and nobody kept it; the quarrel has no second party now.
4. The clerks of {settlement} closed the entry for want of anyone to owe it to.
5. Peace with a town that is not there any more is bookkeeping.
6. The decree names a party no longer there to be named; the {wound} rows are read by nobody and struck by nobody.

### burial_line (INT-6) — town page, neighbours card — significance: n/a (dossier line)
SLOTS: {settlement}, {counterpart}, {wound}, {good}, {band}
AUDIENCE: public
1. The grudge with {counterpart}: buried by decree in the spring, {band} past; the price was paid in grain and pride. *(volume exemplar, de-dated)*
2. The grudge with {counterpart}: buried by decree, {band} past — unearthed since. *(volume exemplar, de-dated)*
3. The grudge with {counterpart}: buried, and answered in kind by {counterpart}.
4. The grudge with {counterpart}: buried by decree; the price was never paid, and the decree binds nothing.
5. The grudge with {counterpart}: open. No decree stands.
6. The grudge with {counterpart}: buried by decree, {band} past; the {wound} rows stand in the book, uncounted.
7. The grudge with {counterpart}: buried, and the hall has petitioned to have it unburied.
8. The grudge with {counterpart}: buried by decree; the decree lapsed with the pair it named.
9. The grudge with {counterpart}: the {wound} buried and paid for in {good}; {counterpart}'s other account is open still.

---

# INT-7 — LEGITIMACY'S CROSSINGS

*Flag `legitimacyCrossingsEnabled` for the crossing receipts; the certification row
and the envelopes phrase nothing. One receipt per crossing, hysteresis on the
existing band edges — a score oscillating inside one band prints nothing from these
pools. EVERY CROSSING HAS A HIT BEHIND IT: the `{reason}` fill comes from the typed
hit vocabulary or from the transfer, never from nowhere.*

### legitimacy_crossing_risen (INT-7) — Herald, the seat's standing — significance: major
SLOTS: {settlement}, {npc}, {standing}, {reason}
AUDIENCE: public
1. The seat stands {standing}. *(§9 — the exemplar's word is a `{standing}` fill)*
2. The standing of {npc} in {settlement} has crossed upward; the cause entered is {reason}.
3. {settlement} thinks better of its seat this season than last, and the clerks can say why.
4. The seat of {settlement} stands higher in the town's regard than it did in the spring.
5. The change was made at home, where these changes usually are.

### legitimacy_crossing_fallen (INT-7) — Herald, the seat's standing — significance: major
SLOTS: {settlement}, {npc}, {standing}, {reason}
AUDIENCE: public
1. The seat has fallen to {standing} — {reason}. *(§9)*
2. The standing of {npc} in {settlement} crossed downward this season, and the hall did not pretend otherwise.
3. {settlement} has stopped giving its seat the benefit of the doubt; the entry names {reason}.
4. The seat of {settlement} keeps its chair and has lost the good name that came with it.
5. A hearing held badly costs more than a hungry season, and is over faster.

### legitimacy_reseed_crossing (INT-7) — Herald, the seat's standing — significance: notable
SLOTS: {settlement}, {npc}, {standing}, {reason}
AUDIENCE: public
1. The seat of {settlement} changed hands, and the town's confidence was set anew at the change.
2. A new hand takes the chair in {settlement} and a different standing with it — the transfer is the cause, and the only one.
3. What {settlement} thought of the last seat did not pass to this one.
4. The crossing is entered against the succession, not against any hearing or hit.
5. Every seat in {settlement} begins somewhere; a seat taken by force begins where force leaves it.
6. The town of {settlement} began its reckoning of the new seat on the day of the transfer, and not before.

### standing_line (INT-7) — town page, ruling-power card — significance: n/a (dossier line)
SLOTS: {settlement}, {standing}, {reason}, {band}
AUDIENCE: public
1. Standing: {standing} (fell {band} past — {reason}). *(volume exemplar, de-dated)*
2. Standing: {standing} (risen {band} past — {reason}).
3. Standing: {standing}; no crossing recorded since the seat was taken.
4. Standing: {standing}, and held there {band}.
5. Standing: {standing} (set at the succession; no hearing since).
6. Standing: {standing} (fallen {band} past, and fallen again since — {reason}).
7. Standing: {standing}; the seat has been tested since and the standing did not move.
8. Standing: {standing} — {reason}; the entry stands unanswered by the seat.
9. Standing: {standing}; burdens stand against {settlement} that the book does not join to it.

---

# INT-8 — THE INTERIOR VOICE (the LIT-KIND pools — OWNER-GATED, J-INT-13)

*No flag of its own. The pools below UPGRADE kinds that are lit today, so they are a
same-seed prose shift on shipped worlds: they ship ONLY against a ruling recorded in
`FABLE_VALIDATION_QUEUE.md` before the wave starts (field-level diff and estimated
golden blast radius in the re-record header, the WR-0b discipline), or DARK behind a
prose-version flag with every existing golden byte-identical. The existing canonical
sentences are preserved as the pools' first members so the ruling can weigh an
addition rather than a replacement. INT-8's payoff-attribution sentences are pooled
above under INT-5, whose reads they consume.*

### coup_held (INT-8, upgrade of a lit kind) — Herald, the verdict — significance: major
SLOTS: {settlement}, {npc}, {faction}
AUDIENCE: public
1. {npc} rallied enough of the court to hold the seat. *(existing canonical, `rulingPowerCoup.js`)*
2. Against the odds, the conspirators lost their nerve at the door. *(existing canonical, `rulingPowerCoup.js`)*
3. The hall of {settlement} was counted, and the seat had the count.
4. It was tried in {settlement} and it did not take; the men who tried it are at the table still.
5. Nothing happened in {settlement} that night, and everyone remembers where they stood.

### coup_fell (INT-8, upgrade of a lit kind) — Herald, the verdict — significance: major
SLOTS: {settlement}, {npc}, {faction}, {reason}
AUDIENCE: public
1. The court of {settlement} turned, and the seat went to {npc}.
2. {settlement} woke to different men on the hall steps, and the clerks began copying names.
3. {faction} took the seat of {settlement}; the old holder keeps a name and no chair.
4. They came to the door of {settlement}'s hall with the count already made.
5. The seat fell in {settlement}. The reasons were entered, and there was more than one of them.

### investiture (INT-8, upgrade of a lit kind) — Herald, the court — significance: notable
SLOTS: {settlement}, {npc}, {faction}, {band}
AUDIENCE: public
1. {npc} takes the seat after {npc}. *(existing canonical headline, `npcLadderKernel.js`; first fill = heir, second = predecessor)*
2. The chair of {settlement} passes to {npc}, and the office's friends and grudges pass with it, faded.
3. The chair of {settlement} has a holder again, and the town came out to see it done.
4. The seat of {settlement} has a new holder and the same ledger.
5. {npc} sits where {npc} sat, and the court rearranged itself by a rank.
6. The keys of the hall of {settlement} changed hands at the door, and the clerks entered the hour and nothing else.

### faction_government_challenge (INT-8, upgrade of a lit kind) — Herald, the hall — significance: notable
SLOTS: {settlement}, {faction}, {npc}
AUDIENCE: public
ALSO POOLED: the R1 subject-phrase pool for this kind lives in `RECEIPT_POOLS_LEGACY.md` §3d (`whatPhrase()`) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. {faction} presses a challenge to the government of {settlement}. *(existing verb table, applied voice)*
2. {faction} has stopped petitioning the seat of {settlement} and started counting against it.
3. The challenge was entered in the hall of {settlement} in proper form, which is how {faction} does things.
4. {faction} wants the chair of {settlement}, and has said so where the clerks could hear.
5. {settlement} has a government, and a party that means to be one.
6. The seat of {settlement} answers to a party now as well as to the town, and the answering has only begun.

### faction_institution_suppression (INT-8, upgrade of a lit kind) — Herald, the hall — significance: notable
SLOTS: {settlement}, {faction}, {npc}
AUDIENCE: public
ALSO POOLED: the R1 subject-phrase pool for this kind lives in `RECEIPT_POOLS_LEGACY.md` §4e (`whatPhrase()`) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. {faction} moves to suppress an institution of {settlement}. *(existing verb table, applied voice)*
2. The doors of the house {faction} objects to are shut in {settlement}, and the keys are with the seat.
3. {faction} has decided {settlement} would be better with fewer voices in it.
4. What was licensed in {settlement} last season is not licensed now.
5. It was done with a lock and a clerk, which is how it is usually done.
6. The house {faction} objected to kept its sign up in {settlement} a season after it stopped opening.

### faction_institution_capture (INT-8, upgrade of a lit kind) — Herald, the hall — significance: notable
SLOTS: {settlement}, {faction}, {house}
AUDIENCE: public
ALSO POOLED: the R1 subject-phrase pool for this kind lives in `RECEIPT_POOLS_LEGACY.md` §4e (`whatPhrase()`) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. {faction} moves to capture an institution of {settlement}. *(existing verb table, applied voice)*
2. The house stands in {settlement} where it stood; the hands on it are {faction}'s now.
3. {faction} did not close the institution of {settlement}. {faction} kept it and changed the locks.
4. The charter of {settlement} was not rewritten — only the names beneath it.
5. Same hall, same seal, and a different interest served by both.
6. Whatever the house does next in {settlement}, it will be done at {faction}'s asking.

### faction_service_bolster (INT-8, upgrade of a lit kind) — Herald, the street — significance: routine
SLOTS: {settlement}, {faction}, {good}
AUDIENCE: public
ALSO POOLED: the R1 subject-phrase pool for this kind lives in `RECEIPT_POOLS_LEGACY.md` §4e (`whatPhrase()`) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. {faction} bolsters its services in {settlement}. *(existing verb table, applied voice)*
2. {faction} has been giving out {good} in {settlement}, and letting the town see who is giving it.
3. The wells of {settlement} were mended by {faction}, and the mending was mentioned.
4. Charity in {settlement} buys what a levy cannot, and this season it is well funded.
5. {settlement} is better served this season, and knows exactly whom to thank.
6. The queue at {faction}'s door in {settlement} is longer than the queue at the hall's, and the town has noticed which is which.
7. {faction} keeps a book of what it has given {settlement}, and the book is meant to be seen.
8. The {good} {faction} hands out in {settlement} this season is the argument it will make in the hall the next.
9. An old woman of {settlement} was carried to the almshouse door by men in {faction}'s colours, and the lane watched it done.

### faction_law_preference_push (INT-8, upgrade of a lit kind) — Herald, the hall — significance: routine
SLOTS: {settlement}, {faction}, {npc}
AUDIENCE: public
ALSO POOLED: the R1 subject-phrase pool for this kind lives in `RECEIPT_POOLS_LEGACY.md` §4e (`whatPhrase()`) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. {faction} pushes its preferred laws in {settlement}. *(existing verb table, applied voice)*
2. The statutes of {settlement} are being read again, and {faction} is holding the pen.
3. {faction} wants {settlement} governed the way {faction} would govern it, and has begun with the small clauses.
4. Nothing was seized in {settlement}. Something was drafted.
5. Law moves slower than a challenge and keeps better.
6. The statute book of {settlement} is thicker by a clause this season, and {faction} wrote the clause.
7. The market of {settlement} learned the new clause from the toll it pays, not from the hall.
8. {npc} signs what {faction} drafts in {settlement}, and every signature narrows what the next seat may do.
9. A factor reading the statutes of {settlement} for a private business said they had been tidied, and tidied in one direction.

### faction_exhaustion (INT-8, upgrade of a lit kind) — Herald, the hall — significance: routine
SLOTS: {settlement}, {faction}, {band}
AUDIENCE: public
ALSO POOLED: the R1 subject-phrase pool for this kind lives in `RECEIPT_POOLS_LEGACY.md` §3d (`whatPhrase()`) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. {faction} exhausts itself in {settlement}. *(existing verb table, applied voice)*
2. {faction} has spent more in {settlement} this season than it took in, and the hall can tell.
3. The men of {faction} are tired, and the roll of {settlement} is shorter for it.
4. {faction} meets in {settlement} still, and fewer come each time.
5. Nothing beat {faction}. It ran out.
6. The dues of {faction} in {settlement} came in {band} short this season, and the clerks entered the shortfall without comment.
7. The room {faction} hires in {settlement} is too large for the men who come to it now.
8. {faction} keeps its place on the roll of {settlement} on its name alone, and the name is {band} thinner than it was.
9. Between the muster and the harvest {faction} asked {settlement} for more than {settlement} had left to give.

### faction_rival_power_contest (INT-8, upgrade of a lit kind) — Herald, the hall — significance: notable
SLOTS: {settlement}, {faction}, {house}
AUDIENCE: public
ALSO POOLED: the R1 subject-phrase pool for this kind lives in `RECEIPT_POOLS_LEGACY.md` §3d (`whatPhrase()`) — a DIFFERENT AXIS of one kind, not a co-owned pool [J-LEG-8]
1. {faction} contests a rival's power in {settlement}. *(existing verb table, applied voice)*
2. The houses of {settlement} want the same ground, and none of them has taken it.
3. {faction} has moved against its rival in the hall of {settlement}, and not yet against the seat.
4. The quarrel in {settlement} is between parties, and the seat is watching it happily.
5. {settlement}'s hall is loud this season, and the loudness is not aimed at the chair.
6. The quarrel between {faction} and {house} is fought in the lanes of {settlement} as much as in the hall, and costs the lanes more.

---

## STANDING NOTES FOR THE IMPLEMENTER (Sol)

*(Bulleted deliberately: a numbered list here would parse as a variant pool.)*

- **⚠️ SEVEN INT-8 KINDS ARE ALSO POOLED IN `RECEIPT_POOLS_LEGACY.md`, AND THAT IS BY
  DESIGN (J-LEG-8, 2026-08-03).** A cross-annex uniqueness scan flagged
  `faction_exhaustion`, `faction_government_challenge`, `faction_rival_power_contest`,
  `faction_institution_capture`, `faction_institution_suppression`,
  `faction_law_preference_push` and `faction_service_bolster` as co-owned kind ids. They
  are not co-owned pools — they are one kind on TWO AXES, which is exactly what
  *upgrade of a lit kind* means. This file pools their **R2 Herald receipt sentence**;
  the legacy annex pools their **R1 subject phrase** (`whatPhrase()` — a lowercase noun
  phrase, no terminal stop, no slots), and for four of the seven that R1 variant 1 is a
  MUTILATED computed fallback the legacy annex has logged as its own defect. Both
  render, on one entry, in different fields. Merging them would put
  *"{faction} moves to capture an institution of {settlement}."* inside *"Travellers
  bring word of …"* — a register violation, not a de-duplication. Each of the seven
  carries an `ALSO POOLED:` line naming its sibling. **Do not merge these seven**, and
  do not re-flag them: the ruling is recorded, not a bug to re-find.
- **Registration.** Every kind the volume marks MINTED pays the full registration
  cost in its wave's commit — `WHAT_PHRASES`, `EXPECTED_VOICE`, `heraldRouting` —
  plus the SP-6 floor assertion over its pool, plus the pacing/significance class
  assignment named in the block heading. Kinds marked *upgrade of a lit kind*
  (INT-8) keep their existing registration and gain only the pool, and only against
  J-INT-13's recorded ruling.
- **Seeding.** Pools select per-entity by hash over stable keys (the `WAR_RECEIPTS`
  idiom — no new rng stream, and no per-tick churn: a books-standing pick keyed on
  the settlement, an émigré pick on `emigre:<npcId>`, a burial pick on
  `burial:<pairKey>`). Same seed, same sentence, forever.
- **THE FACTION TWIN RULE — the one shape question this annex could not close.**
  `FACTION_VERB_PHRASES` derives BOTH the hedged candidate headline (`may {may}`)
  and the applied twin (`{did}`) from ONE source, expressly so the de-hedger's
  straggler class cannot come back (`eventProse.js`). A pooled full sentence cannot
  be mechanically de-hedged. The annex therefore authors the seven faction pools as
  APPLIED-voice receipt sentences and leaves the one-source verb table in place for
  the CANDIDATE headline. If INT-8's implementer reads the volume's "replacing the
  fixed verb table" as replacing both voices, the pools need a second authored line
  per variant (the infinitive twin) — report the reading rather than resolving it in
  code.
- **Ids and the address chain.** Every entry minted from these pools carries `id`,
  the full address chain, the typed action and the recorded reason, or it is dropped
  at BOTH `normalizeEntry` and the audit sink (volume §1a-5).
- **The wizard-news id skew.** The investiture and ladder beats are
  `wizard_news.*`-shaped (`npcLadderKernel.js`); such an id classifies `knowledge`
  and is never declared on a certification row's eventTypes/moverFamilies channels.
- **The covert pair.** `books_patron_served` and `emigre_true_purpose` are the only
  dm-only pools here. They project through `includeCovert` and never reach a free
  surface; their public siblings (`books_standing_seat_above_town`, `emigre_flight`)
  are what the town reads.
- **The degraded arms print less, never wrong.** Under `quiet_local` no bloc kind
  emits at all; with `economicCoupReadEnabled` dark, `attributed_pressure` names
  fewer burdens; until GRAMMAR's oath-holder identity lands, `repudiated_by_heir`
  and `reaffirmed_by_heir` ship variant 1's holder clause dormant and print the
  settlement-grain variants. A shorter receipt is the correct behaviour; an
  unentailed one is a defect.
