# RECEIPT POOLS — FAITH (content annex to DESIGN_FP_FAITH.md)

## Authored 2026-08-02 under the SP-6 CONTENT-DEPTH FLOOR (DESIGN_FP_SPINE.md §2
## SP-6, chair amendment). The volume specs KINDS and one exemplar sentence each;
## this annex is the POOL. Every phrased kind below ships AT LEAST FOUR
## angle-distinct templates, seeded per-entity so same-seed worlds keep their
## sentences (THE PROMISE). Two templates differing only in slot fills are ONE
## family and do not count twice — the pools below are angle-distinct by
## construction, not by slot variety.

**This annex is CONTENT, not law.** Where it and DESIGN_FP_FAITH.md disagree, the
volume wins and the disagreement is a bug to report. Kind ids below are
DESCRIPTIVE placeholders for the census — the canonical spelling of every id is
minted by the wave that mints the kind, and registered in WHAT_PHRASES +
heraldRouting there (§10.3). Significance classes REFERENCE SP-6a's spine family
(`routine / notable / major`); this annex assigns, it never mints a scale.

---

## §A THE SLOT CONVENTION

Every proper noun and every recorded cause is a SLOT. No name is ever baked into a
template — the address law needs settlements BY NAME and the reason ON THE RECORD,
and a template with a name in it can say only one thing.

**Corpus slots (the shared ten):**

| Slot | Carries |
|---|---|
| `{settlement}` | the subject settlement, by name (address law) |
| `{counterpart}` | the second settlement or second party, by name |
| `{npc}` | a named person cast through the existing planes (ranking cleric, shepherd, steward, legate) |
| `{faction}` | a faction by name |
| `{house}` | a merchant house by name |
| `{temple}` | a temple-class institution by name |
| `{band}` | a closed band word (season, wealth, piety, covert size, legitimacy) — never a number |
| `{reason}` | THE RECORDED REASON: the typed token of this receipt rendered in prose (fall cause, reading kind, breach cause, ending) |
| `{good}` | a trade good by name |
| `{route}` | a road or leg by name |

**Volume-local additions (declared here, minted nowhere else — the faith volume's
proper nouns have no corpus slot):**

| Slot | Carries | Why |
|---|---|---|
| `{creed}` | the deity/faith by its authored name ("the Lady of Harvests") | faith's proper noun; `{faction}` is a political actor and cannot carry it |
| `{rival_creed}` | the opposing / rising / counterpart creed | the fall, the schism, and the reading all need BOTH creeds named |
| `{calamity}` | the triggering event, in its own closed vocabulary (famine, plague, siege, disaster) | WF-4 needs the trigger AND the reading token in one sentence; `{reason}` carries the reading |
| `{when}` | a calendar marker in the fifty-two-week year (a feast week, the spring rite, the harvest) | WF-4's expectation window and WF-2's feast cadence speak time, and time may not be a number |

**THE OFFICE-VOICE FALLBACK (§1b-4, binding on every `{npc}` slot):** a
deity-bearing settlement is not guaranteed a clergy NPC. Where casting finds no
ranking cleric, `{npc}` renders as the unnamed OFFICE — "the priests of
{settlement}", "the ministers of {creed}" — and the receipt still reads. Every
pool below survives that substitution; no variant's meaning depends on a personal
name.

---

## §B THE CONSTRAINTS EVERY VARIANT WAS WRITTEN AGAINST

1. **NO DIGITS, and no counting words standing in for digits.** Counts speak in
   band words only (`a few souls / a dozen or so / dozens / a hundred or so /
   several hundred / many hundreds / thousands` — the QUANTITY_BANDS ladder;
   plus the covert-size vocabulary `a handful / a score / a congregation in all
   but name`). Where the volume's own exemplar carried a numeral word ("Two
   towns read one famine"), the count was rewritten into the slot structure —
   see §H note 2.
2. **SLOTS for every proper noun and cause** (§A).
3. **HEADLINE HONESTY (R-28):** the load-bearing verb is entailable by the
   receipt's own facts. Flavour that outruns state is carried in a subordinate,
   attributed clause ("the plate is said to have gone to the mint"), never as the
   sentence's claim.
4. **BELIEF ATTRIBUTION:** unconfirmed and belief-side content carries its
   attribution — "the word is", "they say", "men said", "{npc} named it". Every
   WF-4 reading is believer speech and every variant marks it as such.
5. **LAW ONE (§1c-1 + §1c-4):** no variant confirms that a god acted — believers
   read, courts judge, congregations move. No variant resolves a named person's
   fate: the shepherd is taken up, recants, or walks into the wanderers'
   register; the nameless mass may suffer in banded arithmetic.
6. **COVERT DISCIPLINE:** every block carries an AUDIENCE line. `dm-only` blocks
   ride `includeCovert` and appear in no other projection (§3c's double gate).
7. **VARIANT DISTINCTNESS:** the angle palette — *the event plain · the street's
   view · the ledger's or institution's view · the consequence forward · the
   understatement or irony*. Each pool walks the palette; no two variants in a
   pool are the same sentence with different fills.
8. **LENGTH:** one to two clauses. A receipt is a chronicle line, not a
   paragraph.

**A note for the verifier:** the no-digit law binds the VARIANT LINES — the text
that reaches a surface. This annex's own apparatus (section references, kind
counts, the census table) carries digits by necessity and renders nowhere. A
digit scan should read only lines matching `^<digit>. ` inside a `###` block;
every such line in this file is digit-free, and §N is deliberately unnumbered so
it cannot be scooped into the last pool.

**Register:** the Bound-Book chronicle voice. Short declaratives; the second
clause lands the meaning or the quiet irony; concrete period nouns (inns, tolls,
quays, pews, granaries, ledgers, strongrooms, lintels); semicolons and em-dashes;
understatement over spectacle. No exclamation marks, no modern idiom, no
fantasy-kitsch archaism.

---

## §C THE KIND CENSUS — 103 phrased kinds across nine waves

| Wave | Kinds | Count |
|---|---|---|
| **WF-0** | *none phrased* — the `deityBearers` bearer count is a CERTIFICATION-SURFACE FIELD, not a chronicle line (see §H note 1) | 0 |
| **WF-1** | fall causes ×5 · settlement obituary · realm last-seat obituary · the WR-1 dissolution crossing beat · the FaithSection cause line | 9 |
| **WF-2** | season bands ×4 · arc transitions {feast_kept, roads_closed} · legate dispatched/arrived/withheld/returned · named pilgrim departs/intercepted/turned-back · the FaithSection season line | 14 |
| **WF-3** | communion kept · over-extension fraying · betrayal · foothold seed · out-of-posture pact · the FaithSection stance line | 6 |
| **WF-4** | reading kinds ×5 · open expectation · fulfilled · failed · the two-towns crossing beat · the damped lens · the FaithSection reading line | 11 |
| **WF-5** | temple split · split unsettled · gone underground · covert rite · exposure · backfire · assimilation · surfacing · shepherd's flight · the covert FaithSection line | 10 |
| **WF-6** | term formations ×5 · term breaches ×5 · refusal · communion trigger · the treaty-document line | 13 |
| **WF-7** | tithe pressure · remission · resentment · dispute · {endowed, plundered} · coffers inherited/dispersed · splendor · the FaithSection tithe line | 10 |
| **WF-8** | silent-machinery voices ×15 · realm arcs ×7 (Schism, Great Pilgrimage, Persecution, Awakening, Reformation, Ascendancy, Twilight) | 22 |
| **WF-9** | the endings mix ×8 {faith_converted, hollowed, gone_underground, resurgent, extinct, split, communion, imposed_held} | 8 |
| | **TOTAL** | **103** |

Desks: **Herald `faith`** (the great bulk), **Herald `divination`** (the open
expectation record alone — WF-4's routing correction), **Chronicle** (obituaries,
endings, realm arcs), **FaithSection** (the town dossier lines), **treaty
document** (WF-6's dossier line).

---

## §D WF-1 — THE UNSEATING

### faith.fall.displaced (WF-1) — Herald `faith` — significance: major
SLOTS: {creed} {rival_creed} {settlement} {npc}
AUDIENCE: public
1. {creed} lost the patron seat in {settlement}; {rival_creed} keeps the high altar now.
2. The pews chose, and they chose the newcomer — {settlement} keeps {rival_creed}'s calendar this year.
3. The parish register at {settlement} was rewritten to {rival_creed}; the old rite keeps a side chapel and its grievance.
4. {creed}'s ministers still walk {settlement}, and nobody asks them to bless the harvest.
5. It was a quiet unseating at {settlement} — no purge, no scandal, and {npc} was the last to say so aloud.

### faith.fall.discredited (WF-1) — Herald `faith` — significance: major
SLOTS: {creed} {rival_creed} {settlement} {npc} {reason}
AUDIENCE: public
1. {creed} fell discredited in {settlement} — a decade of stain, an empty nave, and {rival_creed}'s bell now rings the hour.
2. {npc} was named in the matter of {reason}, and {creed}'s seat at {settlement} did not survive the naming.
3. The legitimacy roll at {settlement} carries {creed} below the floor; the contest went to {rival_creed} on conduct alone.
4. They stopped bringing their disputes to {creed}'s ministers at {settlement} some years ago; the seat has only now caught up.
5. Nobody at {settlement} argued the theology. They argued the conduct, and the conduct decided it.

### faith.fall.abandoned (WF-1) — Herald `faith` — significance: notable
SLOTS: {creed} {settlement} {temple}
AUDIENCE: public
1. {creed}'s seat in {settlement} stands empty; no rival took it, and the pews thinned to habit.
2. The bell at {temple} still rings the hour, and fewer come each time it does.
3. The roster at {settlement} lists a patron and no congregation worth the name.
4. They did not turn against {creed} in {settlement}; they simply stopped turning up.
5. No rival won {settlement}. The empty nave did.

### faith.fall.imposed (WF-1) — Herald `faith` — significance: major
SLOTS: {creed} {rival_creed} {settlement} {faction}
AUDIENCE: public
1. {faction}'s garrison set {rival_creed} over {settlement}, and the calendar changed before the season did.
2. {settlement} keeps {rival_creed}'s feasts now; the occupier keeps the keys to the temple.
3. By the terms of the occupation the high altar at {settlement} passes to {rival_creed}; the old rite is not forbidden, only unhoused.
4. They knelt when told, in {settlement}, and the word is that many knelt no further than their knees.
5. {creed} was not argued out of {settlement}. It was garrisoned out.

### faith.fall.suppressed (WF-1) — Herald `faith` — significance: major
SLOTS: {creed} {settlement} {npc} {reason} {temple}
AUDIENCE: public
1. The seat of {creed} in {settlement} was emptied by order; the rite is proscribed and the doors are barred.
2. {npc} read the proscription at the market cross in {settlement}, and {creed}'s vessels went to the strongroom.
3. The roster at {settlement} strikes {creed} from the standing; {temple} keeps its bell and loses its name.
4. They swept {settlement} for the old rite and swept well; the word is that they did not sweep the cellars.
5. The charge was named — {reason} — and the sentence fell on the pews.

### faith.extinction.last_altar (WF-1) — Chronicle — significance: major
SLOTS: {creed} {settlement} {temple}
AUDIENCE: public
1. The last altar of {creed} in {settlement} went dark; none there now keep the rite.
2. The undercroft at {temple} was cleared for grain, and the word is that nobody objected.
3. {settlement}'s roster carries {creed} no longer — not suppressed, not sleeping; gone from the parish entirely.
4. Whatever {creed} was owed in {settlement}, it is owed by nobody now.
5. {creed} kept {settlement} for generations and lost it in a season nobody thought to write down.

### faith.realm.last_seat (WF-1) — Chronicle — significance: major
SLOTS: {creed} {settlement}
AUDIENCE: public
1. {creed} holds no seat anywhere in the realm; the pantheon keeps the name and nothing under it.
2. The last of {creed}'s altars stood at {settlement}, and {settlement} keeps another rite now.
3. The realm register carries {creed} among the remnants — a title, a quadrant, and no congregation.
4. Ministers of {creed} still travel the roads. They have nowhere left to arrive.
5. There was a time the realm counted {creed} among its powers; the register still does, and the towns do not.

### faith.dissolution.cause_named (WF-1 × WR-1 crossing beat) — Herald `faith` — significance: notable
SLOTS: {creed} {settlement} {faction} {reason}
AUDIENCE: public
1. The war's cause died before the war did: {creed} fell {reason} at {settlement}, and men still take the field for it.
2. {settlement} no longer keeps the creed the war was declared over, and the heralds have not been told.
3. The sacred claim is dissolved — its anchor at {settlement} fell {reason} — and the tables have nothing left to argue.
4. {faction} marches for a rite {settlement} stopped keeping a season ago.
5. The quarrel outlived the seat it was fought over, which is the ordinary way of quarrels.

### faith.dossier.fall_cause (WF-1) — FaithSection (town dossier) — significance: n/a (dossier line)
SLOTS: {creed} {rival_creed} {npc} {reason}
AUDIENCE: public
1. The patron fell {reason}; {creed} held this seat until then.
2. This seat changed hands {reason} — {creed} out, {rival_creed} in.
3. {creed}'s fall here is recorded {reason}; the register names {npc} among the causes.
4. Seat history: {creed}, fallen {reason}. {rival_creed} keeps the altar.

---

## §E WF-2 — PILGRIMS AND LEGATES

### faith.season.trickle (WF-2a) — Herald `faith` — significance: routine
SLOTS: {settlement} {creed} {route} {temple}
AUDIENCE: public
1. A thin season on the road to {settlement} — a few souls came, and the innkeepers kept their winter prices.
2. {route} carried a handful of the faithful this year; {creed}'s feast at {settlement} was a parish affair.
3. The shrine at {settlement} kept its rite and its quiet; the tolls barely noticed.
4. {temple} laid in stores for a crowd that did not come.
5. The word went out from {settlement} and did not go far.

### faith.season.steady (WF-2a) — Herald `faith` — significance: routine
SLOTS: {settlement} {temple} {route}
AUDIENCE: public
1. The road to {settlement} kept its usual traffic of the faithful; the inns filled and emptied on schedule.
2. A steady season at {settlement} — {temple}'s hospitality book shows the ordinary names in the ordinary weeks.
3. {temple} turned nobody away and sent for no extra bread; {route} brought the season it always brings.
4. Nothing remarkable on the {settlement} road, which the innkeepers count as a good year.

### faith.season.feast (WF-2a) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {temple} {route} {when}
AUDIENCE: public
1. Pilgrims on the road to {settlement} — the feast of {creed} fills every inn, and the tolls ring like bells.
2. {settlement} is full of strangers and glad of it; {temple}'s doors have not closed since {when}.
3. The toll-books at {route} show the feast weeks in a hand that got hurried.
4. Bread went dear at {settlement} and nobody left; the feast of {creed} is worth a hungry week.
5. They came for {creed} and stayed for the market, which is the way of feasts.

### faith.season.flood (WF-2a) — Herald `faith` — significance: major
SLOTS: {settlement} {creed} {temple} {route} {faction}
AUDIENCE: public
1. The roads to {settlement} are choked with the faithful; the feast of {creed} has drawn many hundreds and shows no sign of thinning.
2. {settlement} has run out of beds, bread, and patience, and the pilgrims keep arriving.
3. {temple} has opened the nave to sleepers and the crypt to the rest.
4. The reeve of {settlement} asked {faction} for men to keep the lanes clear — a flood of pilgrims is still a flood.
5. Thousands on {route}, and the word is that the shrine has not been so pressed in living memory.

### faith.season.feast_kept (WF-2a, arc transition) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {temple}
AUDIENCE: public
1. The feast at {settlement} was kept in full — the procession walked, the tolls were paid, and {creed}'s calendar stood.
2. {temple} kept the observance whole this year; nothing was cut for want of coin or nerve.
3. The feast-week entry at {settlement} closes clean: the roads held, the crowd came, the rite finished.
4. {settlement} kept the feast, and the year will be measured from it as usual.

### faith.season.roads_closed (WF-2a, arc transition — the counterforce) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {route} {faction} {temple} {reason}
AUDIENCE: public
1. The roads to {settlement} were watched, and the feast was thin.
2. {route} runs through {faction}'s lines this season; {creed}'s pilgrims stayed home and said their prayers there.
3. {temple} let the procession lapse for {reason}; the shrine kept its rite before an empty nave.
4. The inns at {settlement} laid in for a feast and drank it themselves.
5. Danger on {route} did what no bishop could: it emptied the pilgrim season.

### faith.legate.dispatched (WF-2b) — Herald `faith` — significance: routine
SLOTS: {temple} {npc} {creed} {counterpart} {route}
AUDIENCE: public
1. {temple} sent {npc} out on {route} with letters and instructions, and not all of them were read aloud.
2. A rider of {creed} is on {route} tonight, and {counterpart} will have a guest before the feast.
3. {npc} left under {creed}'s seal, bound for {counterpart}.
4. {temple}'s dispatch book names {npc}, {route}, and {counterpart} — and no purpose.

### faith.legate.arrived (WF-2b) — Herald `faith` — significance: notable
SLOTS: {creed} {npc} {settlement} {counterpart} {faction}
AUDIENCE: public
1. A legate of {creed} arrived at court, and did not say all of why.
2. {npc} came to {settlement} from {counterpart} under {creed}'s seal with a small retinue; the seat received them the same day.
3. The court at {settlement} recorded a legate's arrival and no business; the clerks left the column blank.
4. {npc} has taken rooms at {settlement} and asked, twice over, after {faction}.
5. The legate brought greetings from {creed}. The legate also brought a notary.

### faith.legate.withheld (WF-2b, posture receipt) — Herald `faith` — significance: routine
SLOTS: {creed} {temple} {settlement} {route}
AUDIENCE: public
1. No legate came; {creed} keeps its counsel while the roads burn.
2. {temple} was asked for a legate and sent regrets and a blessing.
3. The summons from {settlement} went unanswered; {creed}'s ministers stayed within their walls.
4. {temple} judged {route} too dangerous for a man in a mitre, and said so plainly.
5. Nobody came from {creed}, which is itself an answer.

### faith.legate.returned (WF-2b) — Herald `faith` — significance: routine
SLOTS: {npc} {temple} {counterpart} {route} {when}
AUDIENCE: public
1. {npc} is back at {temple} from {counterpart}, and the seal on the return letter was not broken in company.
2. The legate returned with terms, or with something the seat is calling terms.
3. {temple}'s dispatch book closes {npc}'s errand: out on {route}, home by {when}, business unrecorded.
4. {npc} came home from {counterpart} with less to say than when they set out.

### faith.pilgrim.named_departs (WF-2b) — Herald `faith` — significance: routine
SLOTS: {npc} {settlement} {counterpart} {creed} {house}
AUDIENCE: public
1. {npc} has taken the pilgrim's road to {settlement}, with {creed}'s shrine at the end of it.
2. {house} fitted out {npc} for the road — a litter, an escort, and a great deal of hope.
3. {npc}, ailing, rides for the shrine at {settlement}; the physicians of {counterpart} have run out of counsel.
4. {npc} left {counterpart} without ceremony, bound for {creed}'s shrine and telling nobody why.
5. The oracle of {settlement} was summoned to court at {counterpart}, and went.

### faith.pilgrim.intercepted (WF-2b) — Herald `faith` — significance: notable
SLOTS: {npc} {route} {settlement} {counterpart} {faction} {creed}
AUDIENCE: public
1. {npc} was taken on {route} and is held at {counterpart}; the seal was intact, the escort was not.
2. {faction} stopped {creed}'s legate at the {route} crossing and did not let them go on.
3. The pilgrim road took {npc}: held at {counterpart}, on a charge nobody at {settlement} recognises.
4. {settlement} has asked after {npc} twice over; {counterpart} has acknowledged the asking.
5. Safe passage was promised on {route}. {npc} is at {counterpart}, learning what the promise was worth.

### faith.pilgrim.turned_back (WF-2b, the WR-7b-dark degraded arm) — Herald `faith` — significance: routine
SLOTS: {npc} {route} {settlement} {faction} {creed}
AUDIENCE: public
1. {npc} was turned back at the {route} march; no hold, no charge, and no crossing.
2. {faction}'s men met {creed}'s legate on {route} and suggested another road; the suggestion carried spears.
3. The party from {settlement} came home by the way it went — {route} is shut to {creed} this season.
4. {npc} reached the {route} bridge and got no further than the toll house.

### faith.dossier.season_line (WF-2a) — FaithSection (town dossier) — significance: n/a (dossier line)
SLOTS: {band} {settlement} {creed} {counterpart} {route} {temple} {when}
AUDIENCE: public
1. Pilgrim season: {band} — {creed}'s high holy days.
2. The shrine here draws {band}; the roads fill from {counterpart} and beyond at {when}.
3. {settlement} keeps a pilgrim road. This year it is {band}.
4. Pilgrims: {band}. {temple} keeps the hospitality book, and {route} keeps the traffic.

---

## §F WF-3 — THE STANCE LANES' CONSEQUENCES

### faith.pact.communion_kept (WF-3) — Herald `faith` — significance: notable
SLOTS: {creed} {rival_creed} {settlement} {npc} {temple}
AUDIENCE: public
1. The faith of {creed} and {rival_creed} kept communion at the river shrine — the old quarrel cools.
2. {npc} stood at the altar beside {rival_creed}'s own, and both rites were said in one breath.
3. {temple} and {rival_creed}'s house share a feast-day now; the tolerance ledger at {settlement} shows it.
4. Both creeds keep a single calendar at {settlement} now — the merchants noticed before the theologians did.
5. They agreed on nothing except the date, and the date was enough.

### faith.pact.frayed (WF-3 — the over-extension counterforce) — Herald `faith` — significance: routine
SLOTS: {creed} {rival_creed} {settlement} {temple}
AUDIENCE: public
1. {creed} keeps communion with more houses than it can visit; the compact at {settlement} has gone quiet.
2. {temple}'s pact with {rival_creed} is fraying — too many feasts promised, too few kept.
3. The joint rite at {settlement} was let slip again; the compliance book calls it strained.
4. {creed} has communions in every quarter of the realm and a friend in none of them.
5. Nobody broke the compact at {settlement}. It simply stopped being kept.

### faith.pact.betrayed (WF-3, arc transition — existing site, pool supplied for the floor) — Herald `faith` — significance: major
SLOTS: {creed} {rival_creed} {settlement} {faction} {temple} {reason}
AUDIENCE: public
1. {creed} broke communion with {rival_creed} at {settlement} — {reason} — and the joint feast was struck from the calendar before the ink dried.
2. The joint altar at {settlement} was claimed whole by {temple}; {rival_creed}'s ministers walked out and kept walking.
3. The compact is defaulted: {faction} names {reason}, and the realm has heard both accounts.
4. They kept communion for years and ended it in a morning.

### faith.foothold.seeded (WF-3) — Herald `faith` — significance: routine
SLOTS: {npc} {settlement} {rival_creed} {temple}
AUDIENCE: public
1. {npc} of {settlement} has begun keeping {rival_creed}'s calendar quietly; the word is that others in the parish have too.
2. {rival_creed} has a minister inside {settlement}'s temple now — invited, credentialed, and counting.
3. The tolerance ledger at {settlement} shows a new hand in the margins.
4. {temple} took in a guest of {rival_creed} for a season. The guest has not asked after the road home.

### faith.stance.out_of_posture_pact (WF-3, posture receipt) — Herald `faith` — significance: routine
SLOTS: {creed} {rival_creed} {settlement} {temple}
AUDIENCE: public
1. {temple} took communion with {rival_creed} against every counsel it was given; {settlement}'s seat is not pleased.
2. A bold compact out of {settlement} — {creed} courts a house it has quarrelled with for a generation.
3. The seat at {settlement} judged the pact reckless and let it stand; the judgment is on the record.
4. {creed}'s cautious ministers were overruled, and the compact is signed.

### faith.dossier.stance_consequence (WF-3) — FaithSection (town dossier) — significance: n/a (dossier line)
SLOTS: {creed} {rival_creed} {band} {when}
AUDIENCE: public
1. Communion kept with {rival_creed}; the quarrel cools.
2. {creed} stands in compact with {rival_creed} — {band} warmth, and holding.
3. Faith relations: communion with {rival_creed}, kept since {when}.
4. The old quarrel with {rival_creed} is not settled here, only postponed by the compact.

---

## §G WF-4 — OMEN READS

*Every variant in §G is BELIEVER SPEECH and marks itself as such (constraint 4).
No variant states that a god acted (constraint 5); the reading attributes, and
the engine's own causality is untouched.*

### faith.reading.wrath (WF-4) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {npc} {calamity} {temple}
AUDIENCE: public
1. The priests of {settlement} read the failed harvest as {creed}'s wrath — the granary rite was let lapse, they say, and the pews fill with the frightened.
2. {npc} named the {calamity} from the pulpit at {settlement}, and named it wrath.
3. The word at {settlement} is that the {calamity} came for a cause, and that the cause is in the parish.
4. {temple} has called a rite of penance; attendance is not being described as voluntary.
5. Nobody at {settlement} asked whether the harvest failed for weather. They asked whose fault it was.

### faith.reading.test (WF-4) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {npc} {calamity} {temple}
AUDIENCE: public
1. The priests of {settlement} call the {calamity} a test of the faithful, and ask for patience rather than penance.
2. {npc} preached endurance at {settlement} — the season is a trial, they say, and trials end.
3. {temple} opened its stores rather than its accusations; the reading at {settlement} is a test, not a wrath.
4. The pulpit at {settlement} asks the parish to hold; the pews have heard worse readings.
5. It is a test, {creed}'s ministers say. The hungry are testing well enough.

### faith.reading.abandonment (WF-4) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {npc} {calamity} {temple} {route}
AUDIENCE: public
1. They say {creed} has turned its face from {settlement}, and the ministers do not contradict them.
2. {npc} could offer the parish no reading but absence, and said so.
3. The word out of {settlement} is that the old patron has gone quiet, and {route} is busier for it.
4. {temple} kept the rite through the {calamity} and got nothing back that anyone could point to.
5. No wrath, no test — only silence, and silence empties a nave faster than either.

### faith.reading.vindication (WF-4) — Herald `faith` — significance: notable
SLOTS: {settlement} {counterpart} {creed} {calamity} {temple}
AUDIENCE: public
1. {settlement} came through the {calamity} whole, and {creed}'s ministers are saying why.
2. The pulpit at {settlement} reads the sparing as proof; {counterpart} is not mentioned, and does not need to be.
3. {temple} has ordered a thanksgiving; the reading is vindication, and the record says so.
4. They kept the rite at {settlement} and the {calamity} passed them by, which is all the argument anyone there requires.
5. {counterpart} suffered and {settlement} did not. In {settlement} this is theology.

### faith.reading.portent (WF-4) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {npc} {calamity} {temple} {when}
AUDIENCE: public
1. {npc} read the {calamity} at {settlement} as a sign of what is coming, and named the season it would come by.
2. The pulpit at {settlement} has foretold a hard {when}; the granaries are being counted.
3. {temple} entered the sign in its book with a season beside it — an unusual courage.
4. The word at {settlement} is that the {calamity} was the first of something, and the market has raised prices on the strength of it.
5. It is a portent, {creed}'s ministers say, and portents can be checked.

### faith.reading.expectation_open (WF-4) — Herald `divination` — significance: routine
SLOTS: {settlement} {creed} {npc} {temple} {when} {reason}
AUDIENCE: public
1. Relief is promised at {settlement} by the spring rite; {creed}'s ministers have staked the reading on it.
2. {temple} has named {when} — keep the rite, they say, and the rains return.
3. The open expectation at {settlement}: {reason} answered by {when}, or the reading falls.
4. {npc} has told the parish what to watch for and when to stop watching.

### faith.reading.fulfilled (WF-4) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {npc} {temple} {when} {calamity}
AUDIENCE: public
1. The spring rite was kept at {settlement} and the rains came; the pulpit is louder now.
2. {creed}'s reading held at {settlement} — what was promised by {when} arrived, and the ledger closes it fulfilled.
3. {temple}'s standing at {settlement} rose on a promise kept; the pews have not been fuller since the {calamity}.
4. {npc} said it would turn by {when}. It turned.
5. The parish will remember this one, and the ministers will see that it does.

### faith.reading.failed (WF-4 — the counterforce) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {npc} {temple} {when}
AUDIENCE: public
1. The spring rite was kept, and the rains did not return; the pulpit is quieter now.
2. {creed}'s reading at {settlement} lapsed unanswered; the ledger closes it failed and the sink widens.
3. {npc} named {when}, and {when} came and went; {settlement} has noticed.
4. {temple} has stopped mentioning the promise. The parish has not.
5. The reading failed at {settlement}, which is the sceptic's best sermon and costs nothing to preach.

### faith.reading.two_towns (WF-4 crossing beat) — Herald `faith` — significance: major
SLOTS: {settlement} {counterpart} {creed} {rival_creed} {calamity}
AUDIENCE: public
1. {settlement} read the {calamity} as wrath; {counterpart}, across the same fields, read it a test of the faithful.
2. The same {calamity} crossed both parishes; {settlement} calls it judgment and {counterpart} calls it patience.
3. {creed} and {rival_creed} have read the {calamity} against each other, and the sacred quarrel is warmer for it.
4. The pulpits of {settlement} and {counterpart} agree on the facts and on nothing else.
5. The same field, the same blight, and a different fault found on each side of it.

### faith.reading.lens_damped (WF-4 — the slow echo) — Herald `faith` — significance: routine
SLOTS: {settlement} {npc} {temple} {calamity}
AUDIENCE: public
1. {settlement} has heard too many promises come to nothing; the pulpit's next reading was received in silence.
2. {temple}'s book carries more failed readings than kept ones, and the parish can count.
3. {npc} read the {calamity} at {settlement}, and the pews waited to see rather than to pray.
4. They still come to hear it at {settlement}. They no longer act on it.

### faith.dossier.reading_line (WF-4) — FaithSection (town dossier) — significance: n/a (dossier line)
SLOTS: {reason} {calamity} {temple} {npc} {when}
AUDIENCE: public
1. The pulpit's reading: {reason} — relief promised by {when}.
2. {temple} reads the {calamity} as {reason}; the expectation stands open until {when}.
3. Reading on the books: {reason}, entered by {npc}, unresolved.
4. Last reading here: {reason} — and it failed. The parish remembers.

---

## §H WF-5 — SCHISM AND THE UNDERGROUND

### faith.schism.temple_split (WF-5a) — Herald `faith` — significance: major
SLOTS: {settlement} {creed} {rival_creed} {temple} {npc}
AUDIENCE: public
1. The temple of {settlement} split: the old rite keeps the nave, the new keeps the crypt.
2. {settlement} keeps both congregations under one roof, and no agreement about the roof.
3. The institution roster at {settlement} carries a new congregation for {rival_creed} — impaired, tolerated, and very much alive.
4. {npc} would not yield the altar and would not leave {temple}; {settlement} is living with the result.
5. They could not agree who held the seat, so they divided the house — and both halves claim {creed}.

### faith.schism.split_unsettled (WF-5a — the capacity counterforce) — Herald `faith` — significance: notable
SLOTS: {settlement} {rival_creed} {temple}
AUDIENCE: public
1. {settlement} could not keep both congregations; the weaker was evicted before the year turned.
2. {settlement} kept only as many rites as it had room for, and {rival_creed}'s was the one too many.
3. The split at {settlement} lasted a season — the slots were never there for it.
4. {temple} absorbed what was left of the other congregation, and nobody calls it a reconciliation.

### faith.covert.gone_underground (WF-5b) — Herald `faith`, covert projection — significance: notable
SLOTS: {creed} {settlement} {npc} {band}
AUDIENCE: dm-only
1. A share of {creed}'s faithful at {settlement} did not scatter; they went to the cellars and took the vessels with them.
2. {npc} keeps a list of who still comes, and keeps it where it will not be found.
3. The rite of {creed} is proscribed at {settlement} and observed at {settlement} — the register knows only the proscription.
4. The public record at {settlement} shows {creed} extinguished. {band} know better.

### faith.covert.rite_kept (WF-5b) — Herald `faith`, covert projection — significance: routine
SLOTS: {creed} {settlement} {npc} {temple} {band}
AUDIENCE: dm-only
1. By candlelight in the undercroft, {creed}'s rite is kept by those who will not let it go.
2. {npc} says the words over a table at {settlement}, and a handful answer them.
3. {temple} stands empty of {creed} on every day the register troubles to check.
4. They keep the feast at {settlement} on the wrong night, in the wrong room, and they keep it.
5. The cellar congregation at {settlement} is {band}, and has been for years.

### faith.covert.exposed (WF-5b) — Herald `faith` — significance: major
SLOTS: {settlement} {npc} {faction} {creed} {reason}
AUDIENCE: public
1. The hidden congregation of {creed} at {settlement} was found; {npc} was taken up with the vessels.
2. An informant put {faction} at the undercroft door in {settlement}; the cellar rite is a cellar rite no longer.
3. {settlement}'s seat has the names now — {reason} — and the parish is reading them off the market cross.
4. The word went round {settlement} before the constables did.
5. They had kept it quiet for years and lost it to a talkative neighbour.

### faith.covert.backfire (WF-5b — the martyr counterforce) — Herald `faith` — significance: major
SLOTS: {settlement} {creed} {npc} {faction}
AUDIENCE: public
1. The hidden congregation was dragged into the light; the pews filled in defiance.
2. {settlement}'s seat made an example of {creed}, and {settlement} took the example the other way.
3. The purge at {settlement} was thorough and public, and {creed}'s share has risen since.
4. {npc} was paraded, and the crowd that came to watch stayed to listen.
5. {faction} meant it as a warning. It was received as an invitation.

### faith.covert.assimilated (WF-5b — the tolerance counterforce) — Herald `faith`, covert projection — significance: routine
SLOTS: {settlement} {creed} {npc} {band}
AUDIENCE: dm-only
1. The cellar at {settlement} has emptied without a purge; tolerance did what the constables could not.
2. {creed}'s hidden congregation at {settlement} is down to {band}, and none of them young.
3. Nobody stopped them keeping the rite at {settlement}, and so fewer and fewer did.
4. {npc} still lights the candle. The room is largely empty now.
5. The undercroft rite ended at {settlement} the ordinary way: everyone was free to leave, and they did.

### faith.covert.surfaced (WF-5b) — Herald `faith` — significance: major
SLOTS: {settlement} {creed} {temple}
AUDIENCE: public
1. {creed} is kept openly at {settlement} again — the suppression lifted, and the rite came up out of the cellars where it had been all along.
2. The doors of {temple} opened at {settlement}, and what walked out had been keeping the feast for a decade.
3. {settlement}'s roster restores {creed} to standing; the ministers who presented themselves were not strangers.
4. The word at {settlement} is that the old rite never went anywhere. The word is right.
5. It was called extinct at {settlement}. It was merely quiet.

### faith.covert.shepherd_fled (WF-5b — never-resolve) — Herald `faith`, covert projection — significance: routine
SLOTS: {npc} {settlement} {faction} {route}
AUDIENCE: dm-only
1. {npc} was not at the undercroft when {faction} arrived, and has not been at {settlement} since.
2. The shepherd of the cellar congregation left by {route}; the wanderers' register carries the name now.
3. {npc} recanted at the font in {settlement}, publicly and at length, and the cellar congregation has a new keeper.
4. The congregation at {settlement} is leaderless and still meeting.

### faith.dossier.covert_line (WF-5b) — FaithSection (town dossier), covert projection — significance: n/a (dossier line)
SLOTS: {creed} {band} {npc}
AUDIENCE: dm-only
1. And in the cellars, the old rite persists — {band}, and {npc} shepherds them.
2. Covert: {creed}, {band}, kept since the suppression; shepherd {npc}.
3. {creed} is proscribed here and practised here — {band}, under {npc}.
4. Hidden congregation: {band}. No shepherd named; they keep it between them.

---

## §I WF-6 — FAITH TERMS AT THE TABLE

*Membership and spelling of the term families belong to GRAMMAR's canonical
TERM_CATALOG (GR-3, chair ruling R3). The pools below are the faith side's VOICE
for terms this volume consumes; if the catalog declines `tolerance_guarantee` or
`temple_restitution`, their pools retire with their executors.*

### faith.term.missionary_access.formed (WF-6) — treaty document + Herald `faith` — significance: major
SLOTS: {settlement} {counterpart} {creed} {temple} {faction}
AUDIENCE: public
1. Peace signed at {settlement}: {creed}'s missionaries may preach within the walls.
2. {counterpart} has bought its peace with a pulpit — {creed}'s carriers enter {settlement} by treaty.
3. The instrument at {settlement} opens the parish to {creed}; {temple} signed and did not smile.
4. Missionary access granted to {creed} at {settlement}; the tolerance ledger takes the entry under protest.
5. {faction} could not take {settlement}'s faith by war, so it took the doors by ink.

### faith.term.missionary_access.breached (WF-6) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {faction} {reason}
AUDIENCE: public
1. {settlement} shut its doors to {creed}'s preachers again; the treaty says otherwise and the realm has noticed.
2. The access granted at {settlement} lasted until the first sermon; {faction} closed the channel and called it public order.
3. {creed}'s carriers were turned out of {settlement} — {reason} — and the compliance book records a default.
4. The pulpit was promised. The pulpit is barred.

### faith.term.pilgrimage_right.formed (WF-6) — treaty document + Herald `faith` — significance: notable
SLOTS: {settlement} {counterpart} {creed} {route}
AUDIENCE: public
1. {creed}'s pilgrims walk {route} unmolested, by the terms signed at {settlement}.
2. {settlement} has guaranteed the road: {route} is open to the faithful of {creed} in every season.
3. The instrument names {route} and names the penalty, and {counterpart}'s marshals have been told.
4. Safe passage bought with ink instead of blood — {creed}'s pilgrims have {route} again.

### faith.term.pilgrimage_right.breached (WF-6) — Herald `faith` — significance: notable
SLOTS: {npc} {settlement} {route} {faction} {creed}
AUDIENCE: public
1. Pilgrims of {creed} were stopped on {route}, and {route} is a protected leg; the treaty is in default.
2. {npc} was taken on a road the instrument says is open, and {settlement} has sent for the terms.
3. The guarantee on {route} held until {faction} wanted the crossing.
4. The escort promised at {settlement} did not appear, and neither did the pilgrims at the far end.

### faith.term.shared_rite.formed (WF-6) — treaty document + Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {rival_creed} {temple}
AUDIENCE: public
1. {creed} and {rival_creed} have made their communion a term: a standing joint observance at {settlement}, entered on the instrument.
2. The compact at {settlement} binds both houses to a shared feast each year, and to civility for the rest of it.
3. {temple} and {rival_creed}'s house will keep the rite together at {settlement}; the sacred quarrel is now a matter of contract.
4. They signed for a common altar at {settlement}, which is cheaper than a common war.

### faith.term.shared_rite.breached (WF-6) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {rival_creed} {temple}
AUDIENCE: public
1. The joint observance at {settlement} was not kept; {temple} held its own rite and left {rival_creed}'s ministers at the door.
2. {creed} kept the shared feast alone this year; the instrument calls that a default, and the realm agrees.
3. The common altar at {settlement} has been re-consecrated by a single house, which is the whole quarrel again in a sentence.
4. Neither house came. Both blame the other. The compliance book blames both.

### faith.term.tolerance_guarantee.formed (WF-6) — treaty document + Herald `faith` — significance: major
SLOTS: {settlement} {creed} {faction} {temple}
AUDIENCE: public
1. {settlement} forswears the suppression of {creed}; the guarantee is written and the doors are to stay open.
2. By the terms at {settlement}, {creed} may be kept openly — and what was in the cellars is invited up.
3. {faction} gave the guarantee to end the siege; {temple} regards it as a debt to be paid slowly.
4. No purge, no proscription, no eviction — the instrument at {settlement} says so plainly, and says it more than once.

### faith.term.tolerance_guarantee.breached (WF-6) — Herald `faith` — significance: major
SLOTS: {settlement} {creed} {faction} {reason}
AUDIENCE: public
1. The purge broke the guarantee; the treaty is defaulted and the realm knows why.
2. {settlement} proscribed {creed} again — {reason} — with the instrument still in force.
3. {faction} took the vessels and left the guarantee where it was written.
4. They swore not to suppress {creed} at {settlement}. They suppressed it in the same season.

### faith.term.temple_restitution.formed (WF-6) — treaty document + Herald `faith` — significance: notable
SLOTS: {settlement} {counterpart} {temple} {creed}
AUDIENCE: public
1. {counterpart} will restore what it broke: {temple} at {settlement} is to be rebuilt on the payer's account.
2. The instrument at {settlement} names the shell of {temple} and names who pays for the roof.
3. Restitution granted — {creed}'s house at {settlement} comes off the impaired roster at {counterpart}'s expense.
4. A war that burned an altar is ending with a bill for the altar.

### faith.term.temple_restitution.breached (WF-6) — Herald `faith` — significance: notable
SLOTS: {settlement} {counterpart} {temple}
AUDIENCE: public
1. The stone was promised to {temple} and never quarried; {settlement}'s shell stands as it stood.
2. {counterpart} has paid nothing toward {temple}, and the compliance book has stopped calling it strained.
3. The scaffolding came down at {settlement} with the roof still open.
4. They agreed to rebuild. They agreed to it again last season.

### faith.term.refused (WF-6 — the guard and the proud seat) — Herald `faith` — significance: notable
SLOTS: {settlement} {counterpart} {creed} {temple} {route}
AUDIENCE: public
1. {settlement}'s seat refused the guarantee under open threat, and let the refusal be published.
2. The proposal named {creed}, and neither party keeps {creed}; the drafting table refused it.
3. {temple} would not sit for terms about the rite, and the instrument closed without a faith clause.
4. {counterpart} offered a term on {route}, and {settlement} would not have it at any price.
5. They were proud about it, it will cost them, and they knew both.

### faith.term.communion_trigger (WF-6 → SP-3 proposal) — Herald `faith` — significance: routine
SLOTS: {settlement} {counterpart} {creed} {rival_creed} {temple} {npc}
AUDIENCE: public
1. {creed} and {rival_creed} share a quadrant and a border; {temple} has proposed they share an instrument.
2. Both houses keep the same patron — {temple} has asked what else they might keep.
3. A communion is on the table between {settlement} and {counterpart}; the legate carries the draft.
4. {npc} came to {counterpart} with a proposal for a shared feast, which is how these things usually start.

### faith.dossier.treaty_line (WF-6) — treaty document + FaithSection — significance: n/a (dossier line)
SLOTS: {creed} {settlement} {counterpart} {route}
AUDIENCE: public
1. Missionaries of {creed} preach here by treaty.
2. {settlement} is bound: no suppression of {creed}, guaranteed at {counterpart}.
3. By instrument with {counterpart}: {route} open to {creed}'s pilgrims, in force.
4. Faith terms touching {creed} are in force here, and kept — for now.

---

## §J WF-7 — THE TITHE

### faith.tithe.pressure_heavy (WF-7) — Herald `faith` — significance: notable
SLOTS: {settlement} {temple} {npc}
AUDIENCE: public
1. The tithe weighs heavier than the harvest in {settlement}; the coffers fill as the pews thin.
2. {temple} has raised the render again; the parish pays, and says less each quarter.
3. The tithe books at {settlement} show a good year for {temple} and a thin one for everybody else.
4. {npc} preached generosity at {settlement} to a congregation that had just been counted.
5. They give what is asked at {settlement}. They no longer give anything else.

### faith.tithe.remission (WF-7) — Herald `faith` — significance: notable
SLOTS: {settlement} {temple} {npc} {reason}
AUDIENCE: public
1. In the famine year {temple} forgave the tithe, and the town remembered.
2. {npc} struck the render from the books at {settlement} for a season; the coffers are lighter and the nave is full.
3. {temple} took nothing from {settlement} this quarter — {reason} — and said nothing about it afterward.
4. The tithe was forgiven at {settlement}, which cost {temple} a great deal and bought more.

### faith.tithe.resentment (WF-7 — the counterforce) — Herald `faith` — significance: notable
SLOTS: {settlement} {temple} {faction}
AUDIENCE: public
1. The render at {settlement} has outrun the piety that pays it; the unaffiliated rolls are growing.
2. {settlement} petitioned the seat over the tithe, and the petition has more names on it than the parish register.
3. {temple}'s take is up and its congregation is down, which the ledger notices before the pulpit does.
4. They pay {temple} at {settlement}, and they pray at home.
5. {faction} calls it a tax dispute. It has begun to sound like something else.

### faith.tithe.dispute (WF-7) — Herald `faith` — significance: routine
SLOTS: {settlement} {counterpart} {temple} {npc} {faction} {house} {good}
AUDIENCE: public
1. {npc} and the steward of {settlement} cannot agree what the render is owed on; the legate has been sent for.
2. {temple} claims the mill's share at {settlement}; {faction} claims the mill.
3. The tithe dispute at {settlement} has gone to {counterpart} for arbitration, which suits neither side.
4. {house} has stopped rendering on {good} and dares {temple} to say so publicly.

### faith.temple.endowed (WF-7, arc transition) — Herald `faith` — significance: notable
SLOTS: {settlement} {temple} {house} {npc}
AUDIENCE: public
1. {house} endowed {temple} at {settlement} — a roof, a bell, and a name cut into the lintel.
2. {temple}'s coffers are full for the first time in a generation, and the mason has been engaged.
3. The endowment at {settlement} is entered in {temple}'s book with the donor's conditions attached.
4. {npc} gave the harvest of a good year to {temple}, and expects the parish to know it.

### faith.temple.plundered (WF-7, arc transition — the sack lure) — Herald `faith` — significance: major
SLOTS: {settlement} {temple} {faction} {route}
AUDIENCE: public
1. {temple} at {settlement} was stripped in the sack; the plate went out on {route} and the roof stayed.
2. {faction} took the coffers of {settlement}, and took the moral price with them.
3. The shrine's wealth is gone from {settlement} — carried off, not burned; somebody will spend it.
4. They came for the granary at {settlement} and found the altar better stocked.
5. The realm judges a sacked temple harder than a sacked town, and {faction} has been judged.

### faith.temple.coffers_inherited (WF-7, J-WF-15 inherit arm) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {rival_creed} {temple}
AUDIENCE: public
1. {rival_creed}'s clergy count {creed}'s gold; the fabric of {temple} changed hands with the seat.
2. The endowment at {settlement} stayed where it was and changed whose name is on it.
3. {temple} kept its coffers through the fall — the building outlasts the creed, as buildings do.
4. Whatever {creed} laid up at {settlement}, {rival_creed} is spending.

### faith.temple.coffers_dispersed (WF-7, J-WF-15 dispersal arm) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {temple} {band}
AUDIENCE: public
1. A share of {temple}'s coffers left {settlement} with the faithful — carried to the poor, or carried away; the books show only that it went.
2. The strongroom at {settlement} was found lighter than the roster promised, and {temple}'s charity is doing well this month.
3. {creed}'s treasury was dispersed before the eviction was complete — {band} of it, by the seat's own reckoning.
4. They came for the gold at {settlement} and found the alms had beaten them to it.

### faith.temple.splendor (WF-7) — Herald `faith` — significance: routine
SLOTS: {settlement} {counterpart} {temple}
AUDIENCE: public
1. {temple} at {settlement} has gilded the nave, and the seat's standing is a shade brighter for sitting next to it.
2. The new bell at {settlement} can be heard at {counterpart}, which is the point of the new bell.
3. {temple}'s splendor is entered in the institution roster at {settlement} — backing lent, not bought.
4. Gold gilds a seat at {settlement}. It has never bought one.

### faith.dossier.tithe_line (WF-7) — FaithSection (town dossier) — significance: n/a (dossier line)
SLOTS: {band} {temple} {settlement}
AUDIENCE: public
1. The tithe: {band} — the coffers gleam, the pews grumble.
2. Render here: {band}. {temple}'s wealth: {band}.
3. Tithe pressure {band} against {band} piety — the sink is widening.
4. {temple} takes {band} from {settlement}, and forgave it once, in the famine year.

---

## §K WF-8 — VOICING THE SILENT MACHINERY

*These fifteen kinds narrate transitions the engine already makes in silence.
Dark, the world is byte-identical (J-WF-9); lit, this is the bulk of the 3×.*

### faith.entry (WF-8) — Herald `faith` — significance: routine
SLOTS: {settlement} {creed} {npc} {route} {counterpart}
AUDIENCE: public
1. A new rite is kept in {settlement}: {creed} has a house, a minister, and a handful of the curious.
2. {creed} was entered on {settlement}'s roster this week — cult standing, no seat, and a great deal of energy.
3. The carriers came up {route} from {counterpart} and left {creed} behind them at {settlement}.
4. {npc} said the first mass of {creed} at {settlement} to a room that was not full.
5. Nobody at {settlement} much noticed, which is how most of them start.

### faith.eviction (WF-8) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {temple} {route} {counterpart}
AUDIENCE: public
1. {creed} lost its niche at {settlement}; the roster carries it no longer and the room has been let.
2. {settlement} had slots for so many rites, and {creed} was the weakest of them.
3. The evicted congregation of {creed} has gone up {route} to {counterpart}, where there is room.
4. {temple} took the building and the calendar; {creed}'s ministers took the road.

### faith.suppression (WF-8) — Herald `faith` — significance: major
SLOTS: {settlement} {creed} {npc} {reason}
AUDIENCE: public
1. {settlement} proscribed {creed} — {reason} — and the standing falls to suppressed.
2. The seat at {settlement} closed {creed}'s house; the vessels are in the strongroom and the rite is not to be said.
3. {npc} read the order at {settlement}, and read it to a smaller crowd than expected.
4. {creed} is not extinguished at {settlement}, only forbidden, which the roster records as the same thing.

### faith.resurgence (WF-8) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {temple}
AUDIENCE: public
1. {creed} is back on {settlement}'s roster — fresh standing, old memory, and a congregation that knew where to gather.
2. The suppression lifted at {settlement}, and {creed} re-entered inside the season.
3. {temple} reopened at {settlement} to a crowd nobody had counted.
4. They said the rite was finished at {settlement}. It was resting.

### faith.standing.cult_to_established (WF-8) — Herald `faith` — significance: routine
SLOTS: {settlement} {creed} {temple}
AUDIENCE: public
1. {creed} is established at {settlement} now — a house, a calendar, and a claim on the seat's ear.
2. The roster at {settlement} moves {creed} up from cult, and the tolerance ledger stops flagging it.
3. {temple} has taken a permanent building at {settlement}; the landlord is content and the parish is used to them.
4. {creed} stopped being a curiosity at {settlement} some time last year, and the register has caught up.

### faith.standing.established_to_ascendant (WF-8) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {rival_creed} {npc}
AUDIENCE: public
1. {creed} is ascendant at {settlement}: the seat keeps its feasts and the market keeps its hours.
2. {settlement}'s calendar is {creed}'s calendar now, in everything but the name of the office.
3. The roster at {settlement} names {creed} ascendant; {rival_creed} keeps a chapel and its dignity.
4. They asked {npc} to bless the assize at {settlement}, which settles the question of who is ascendant.

### faith.standing.demoted (WF-8) — Herald `faith` — significance: routine
SLOTS: {settlement} {creed} {temple}
AUDIENCE: public
1. {creed} slipped a standing at {settlement}; the feasts are thinner, and the seat's attendance thinner still.
2. The roster at {settlement} moves {creed} down — no scandal, no purge, only arithmetic.
3. {temple} has given up its outer house at {settlement}.
4. {creed} was ascendant at {settlement} within living memory, which is the only place it is ascendant now.

### faith.legitimacy.crossing_up (WF-8) — Herald `faith` — significance: routine
SLOTS: {settlement} {creed} {npc} {band}
AUDIENCE: public
1. {creed}'s standing at {settlement} has crossed into {band}; the seat's blessing counts for more than it did.
2. {npc}'s conduct has done what a decade of preaching could not, and {creed} is {band} legitimate at {settlement} now.
3. The stain of the old scandal has decayed off {creed}'s record at {settlement}; the crossing is entered.
4. They have stopped apologising for {creed} at {settlement}.

### faith.legitimacy.crossing_down (WF-8) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {npc} {band} {reason}
AUDIENCE: public
1. {creed}'s legitimacy at {settlement} has fallen to {band}; {reason} is named on the record.
2. The stain took, and the crossing followed; {creed} is heard less respectfully at {settlement} this season.
3. {npc}'s conduct sits on the roster beside {creed}'s standing, and the standing has moved.
4. Nobody at {settlement} has renounced {creed}. They have merely stopped citing it.

### faith.piety.crossing_up (WF-8) — Herald `faith` — significance: routine
SLOTS: {settlement} {temple} {band} {calamity}
AUDIENCE: public
1. {settlement} has crossed into {band} devotion; the {calamity} filled the pews, and they have not emptied.
2. Piety at {settlement} stands {band} — the crossing is entered, and {temple} is not asking why.
3. Attendance at {settlement} has held past the crisis that caused it, which the register calls devout.
4. They came for fear and stayed for the rite.

### faith.piety.crossing_down (WF-8) — Herald `faith` — significance: routine
SLOTS: {settlement} {temple} {band}
AUDIENCE: public
1. {settlement} has crossed into {band} observance; the feasts are kept and little else is.
2. Piety at {settlement} falls to {band} — no crisis, no scandal, only a long good season.
3. {temple} counts fewer at the rail each quarter, and the crossing is entered.
4. A burned church holds its flock for years. {settlement}'s has finally let go.

### faith.niche.contest (WF-8) — Herald `faith` — significance: routine
SLOTS: {settlement} {creed} {rival_creed} {temple}
AUDIENCE: public
1. {creed} and {rival_creed} contested the lesser niche at {settlement}; {creed} keeps it, and the seat is untouched.
2. The quarrel at {settlement} was over a niche, not the altar — which did not make it quieter.
3. {temple} lost the funerary rite at {settlement} to {rival_creed} and kept everything else.
4. Neither creed came near the patron seat at {settlement}, and both spent a season trying.

### faith.tolerance.shift_open (WF-8) — Herald `faith` — significance: routine
SLOTS: {settlement} {faction} {npc}
AUDIENCE: public
1. {settlement} has widened its tolerance; the foreign rites may keep their feasts within the walls.
2. The ledger at {settlement} opens a slot — {faction} judged the quarrel more expensive than the creed.
3. {npc} argued for the strangers' rite at {settlement}, and was heard.
4. The doors at {settlement} are open a little wider this year, and nobody has said why.

### faith.tolerance.shift_close (WF-8) — Herald `faith` — significance: notable
SLOTS: {settlement} {faction} {creed} {reason}
AUDIENCE: public
1. {settlement} has narrowed its tolerance; the foreign rites keep their feasts outside the walls or not at all.
2. The ledger at {settlement} closes a slot — {reason} — and {creed}'s carriers are turning back at the gate.
3. {faction} has decided {settlement} keeps too many calendars.
4. Nothing is forbidden at {settlement}. It is only made difficult.

### faith.mandate.band_move (WF-8) — Herald `faith` — significance: notable
SLOTS: {settlement} {creed} {temple} {npc} {band}
AUDIENCE: public
1. The seat at {settlement} holds its mandate {band}; {temple}'s blessing is doing the work the treasury cannot.
2. {temple} has withdrawn its countenance from {settlement}'s seat, and {creed}'s mandate has moved with it.
3. The divine mandate at {settlement} stands {band} — the crossing is entered, and the court has felt it.
4. {npc} did not attend the seat's investiture at {settlement}, and everyone counted the empty chair.

---

## §L WF-8 — THE REALM ARCS

### faith.realm.schism (WF-8, existing arc) — Chronicle (realm register) — significance: major
SLOTS: {creed} {settlement} {counterpart}
AUDIENCE: public
1. The realm is split over {creed}: {settlement} keeps a seat and {counterpart} keeps another, and both send letters.
2. A schism runs the length of the realm; every court has been asked to choose, and most have.
3. {creed}'s houses no longer recognise one another's ministers, and the roads carry rival legates.
4. The realm keeps a single faith, and keeps it twice.

### faith.realm.great_pilgrimage (WF-8, new arc) — Chronicle (realm register) — significance: major
SLOTS: {creed} {settlement} {counterpart} {route} {temple}
AUDIENCE: public
1. The realm is on the road: every shrine of {creed} is drawing many hundreds, and the inns cannot hold them.
2. A great pilgrimage season — {route} and every road like it carries the faithful, and the tolls have never been better.
3. {temple} has opened its granaries to travellers, and so has every house of {creed} between {settlement} and {counterpart}.
4. The realm's roads have not been this busy since the last war, and this time nobody is armed.

### faith.realm.persecution (WF-8, new arc) — Chronicle (realm register) — significance: major
SLOTS: {creed} {settlement} {counterpart}
AUDIENCE: public
1. A coordinated proscription across the realm: {creed}'s houses are closed from {settlement} to {counterpart}.
2. The seats have agreed among themselves about {creed}, and the agreement is being enforced street by street.
3. {creed}'s ministers are on the roads, and the roads are watched.
4. The realm has decided {creed} is a danger. The realm has decided this before.

### faith.realm.awakening (WF-8, new arc) — Chronicle (realm register) — significance: major
SLOTS: {creed} {rival_creed} {calamity}
AUDIENCE: public
1. The realm's naves are filling — the unaffiliated are coming back, and nobody arranged it.
2. An awakening across the realm: {creed} and {rival_creed} both report crowds, which is how everyone knows it is not a schism.
3. Crisis calls the faithful home, and the {calamity} has called many hundreds.
4. The registers are running out of room for names, and the ministers are frankly baffled.

### faith.realm.reformation (WF-8, new arc) — Chronicle (realm register) — significance: major
SLOTS: {creed} {settlement} {counterpart} {reason}
AUDIENCE: public
1. A reformation in the realm: patrons have fallen {reason} at {settlement}, at {counterpart}, and beyond, all inside a handful of years.
2. The realm has unseated its patrons by the same argument in parish after parish.
3. A single cause, many falls — the chroniclers will give this a name, and the parishes will give it another.
4. {creed} is not the only patron to fall {reason} this decade, and the realm is beginning to notice the pattern.

### faith.realm.ascendancy (WF-8, existing arc — carries the honesty fork) — Chronicle (realm register) — significance: major
SLOTS: {creed} {settlement} {counterpart}
AUDIENCE: public
*Fork: variant 1 is the LIT form and may be drawn only where WF-2's season read
is available; where `pilgrimageEnabled` is dark the roads clause is untrue and
variant 1 is excluded from the draw (the §5-WF-8 honesty fix).*
1. {creed} is ascendant across the realm, and the faithful walk the roads in numbers.
2. {creed} is ascendant across the realm; its calendar is kept from {settlement} to {counterpart}.
3. The realm's seats keep {creed}'s feasts, and the seats that do not are noticed.
4. {creed} holds its tier by the plain arithmetic of seats, and holds it comfortably.
5. There is no court in the realm where {creed}'s minister waits long for an audience.

### faith.realm.twilight (WF-8, existing arc) — Chronicle (realm register) — significance: major
SLOTS: {creed} {settlement}
AUDIENCE: public
1. The twilight of {creed}: the seats have fallen away one after another, and the pantheon keeps a title with nothing under it.
2. {creed} has slipped a tier; the realm register records the fall, and the parishes record nothing at all.
3. The great feasts of {creed} are kept in fewer places each year, and kept smaller where they are kept.
4. {creed}'s house at {settlement} was the last that mattered, and it does not matter now.

---

## §M WF-9 — THE ENDINGS MIX (the closed eight)

*The endings walker covers EXACTLY these eight. The instrument-arc transition
tokens — WF-2's {feast_kept, roads_closed}, WF-3's {kept, betrayed}, WF-7's
{endowed, plundered} — are deliberately outside this mix and carry their own
pools above.*

### faith.ending.faith_converted (WF-9) — Chronicle — significance: major
SLOTS: {settlement} {creed} {rival_creed}
AUDIENCE: public
1. {settlement} keeps {rival_creed} now, and keeps it as though it always had.
2. The conversion is complete at {settlement} — the seat, the calendar, and the burying ground.
3. {creed} has no share worth the name at {settlement}; the chronicle closes the entry converted.
4. A generation ago {settlement} would have been scandalised. A generation is all it took.

### faith.ending.hollowed (WF-9) — Chronicle — significance: major
SLOTS: {settlement} {creed} {temple}
AUDIENCE: public
1. {creed} keeps the seat at {settlement} and almost nothing else; the rite is law and habit and not much more.
2. The pews at {settlement} are thin and the roster is unchanged — hollowed, the chronicle calls it.
3. {temple} still rings the hour at {settlement}, and fewer set their day by it each year.
4. Nobody left {creed} at {settlement}. They simply stopped arriving.

### faith.ending.gone_underground (WF-9) — Chronicle — significance: major
SLOTS: {settlement} {creed}
AUDIENCE: public
1. {creed} is finished at {settlement}, publicly; the chronicle closes it gone to the cellars.
2. The proscription held at {settlement} and the faith did not end — it moved.
3. {settlement}'s register carries {creed} extinguished, and the register is wrong.
4. They took the building, the vessels, and the calendar, and did not get the congregation.

### faith.ending.resurgent (WF-9) — Chronicle — significance: major
SLOTS: {settlement} {creed} {temple}
AUDIENCE: public
1. {creed} holds {settlement} again, after the suppression and the cellar years; the chronicle closes it resurgent.
2. What was proscribed at {settlement} is established at {settlement} — the same rite, the same families, a new roof.
3. {temple} has been reconsecrated at {settlement}, and the crowd knew the responses without prompting.
4. It took a decade and a change of seat. It did not take a miracle, and nobody has claimed one.

### faith.ending.extinct (WF-9) — Chronicle — significance: major
SLOTS: {settlement} {creed} {temple}
AUDIENCE: public
1. {creed} is gone from {settlement} entirely — no seat, no cellar, no memory in the roster.
2. The chronicle closes {creed} at {settlement}: extinct, and the last to keep it is not named.
3. The undercroft at {temple} holds grain now, and the plate is said to have gone to the mint.
4. There is nobody at {settlement} to be the last of them, which is what extinct means.

### faith.ending.split (WF-9) — Chronicle — significance: major
SLOTS: {settlement} {creed} {rival_creed} {temple}
AUDIENCE: public
1. {settlement} ends the age with both congregations standing — the nave and the crypt, and neither yielding.
2. The split at {settlement} held; the chronicle closes it split, which is the rarest of the endings and the least tidy.
3. {temple}'s roster carries {creed} and {rival_creed} both at {settlement}, impaired and tolerated, into the next generation.
4. They never reconciled at {settlement}. They merely grew accustomed.

### faith.ending.communion (WF-9) — Chronicle — significance: major
SLOTS: {settlement} {creed} {rival_creed}
AUDIENCE: public
1. {creed} and {rival_creed} end in communion — the compact at {settlement} outlasted the quarrel that made it necessary.
2. The shared rite at {settlement} is older than anyone who remembers the war; the chronicle closes it communion.
3. Both houses keep the feast at {settlement}, and neither can now say which of them started it.
4. The instrument has not been read aloud in years. Nobody has needed to.

### faith.ending.imposed_held (WF-9) — Chronicle — significance: major
SLOTS: {settlement} {rival_creed} {faction}
AUDIENCE: public
1. {rival_creed} came to {settlement} with {faction}'s garrison and is still there after the garrison left.
2. The imposed rite held at {settlement} — the chronicle closes it imposed and kept, which is not the same as chosen.
3. {settlement}'s children keep {rival_creed} and do not remember it arriving.
4. They knelt because they were told to. Their grandchildren kneel because it is what one does.

---

## §N AUTHORING NOTES — ambiguities resolved in the writing

*Deliberately UNNUMBERED: a pool extractor scans `^<digit>. ` inside a `###`
block, and a numbered list here would be scooped as variants of the last kind.*

**N-a. WF-0 mints no phrased kind.** The volume's §5-WF-0 dossier landing is a
   `deityBearers` count rendered on the CERTIFICATION surface — an instrument
   field, not a chronicle line. It is therefore outside the SP-6 floor (which
   binds phrased kinds registered in WHAT_PHRASES). Recorded here rather than
   silently skipped; if the chair rules the certification line phrased, it needs
   a pool and does not have one.
**N-b. Numeral words were removed from two volume exemplars.** §8's "Two towns
   read one famine: wrath in Greyfen, a test of the faithful in Marrow's Ford"
   and §5-WF-5's covert render both carried counts as number words. Constraint 1
   is estate law and the verifier reds it, so `faith.reading.two_towns` variant 1
   carries the exemplar's structure with the count rewritten into the slots, and
   the covert size speaks the closed vocabulary. The volume's own §5-WF-5
   correction already made the second of these (the "12 souls" leak).
**N-c. Exemplars are variant 1 in structure, with proper nouns slotted.** The
   brief asked for the exemplar "verbatim"; constraint 2 forbids a baked name.
   Slotting won — every exemplar below is word-for-word except that Greyfen,
   Marrow's Ford, the Lady of Harvests, and the Deep Forge became
   `{settlement}`, `{counterpart}`, `{creed}`, `{rival_creed}`.
**N-d. Four volume-local slots were minted** (`{creed}`, `{rival_creed}`,
   `{calamity}`, `{when}`) because the corpus ten have no carrier for a deity's
   name, an opposing creed, an omen's trigger distinct from its reading, or a
   calendar marker that may not be a number. `{reason}` is reserved throughout
   for THE RECORDED REASON — the typed token of the receipt itself.
**N-e. The season is four kinds, not one kind with a band slot.** A `{band}` swap
   across trickle/steady/feast/flood would be one family under the floor's
   family rule, and a trickle is not a flood with a different word in it. Same
   ruling for the five fall causes, the five reading kinds, and the ten term
   formations/breaches.
**N-f. The FaithSection dossier lines are included** (eight of the 103). They are
   phrased, they are exemplified verbatim in the volume, and they are the most
   repeated sentences in the product — a town page renders them every time it
   opens. If the chair rules the floor applies only to WHAT_PHRASES news kinds,
   these eight retire and the census is 95.
**N-g. `faith.pact.betrayed` and the two existing realm arcs** (Ascendancy,
   Twilight) already have emission sites in the tree. Pools are supplied anyway:
   §1b-11's whole complaint is that the existing sites are thin, and a
   two-string existing kind fails the floor exactly as an unregistered one does.
**N-h. `faith.realm.ascendancy` carries a draw fork, not a pool split.** Variant 1
   asserts pilgrims on the roads and is drawable only where WF-2's season read
   exists; the other four are lane-agnostic, so the pool never falls below the
   floor in the dark configuration.
**N-i. No variant resolves a fate and none confirms a god.** The exposed shepherd
   is taken up, recants, or passes into the wanderers' register; the reading is
   always attributed to a pulpit, a minister, or "the word"; the deity is the
   subject of belief and never of a verb of action.
