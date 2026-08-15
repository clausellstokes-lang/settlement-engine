# RECEIPT POOLS — FP-INFORMATION (the medium's voice: the seeded variant corpus)

## Authored 2026-08-02 for the SP-6 CONTENT-DEPTH FLOOR (DESIGN_FP_SPINE.md §2,
## SP-6: "every phrased kind ships a seeded variant pool of AT LEAST FOUR
## templates … exemplar sentences in the volumes are the pool's FIRST member,
## never its whole"). Source volume: docs/DESIGN_FP_INFORMATION.md (waves IN-0a
## through IN-5). This annex is CONTENT, not architecture — it invents no
## mechanism, mints no token, and re-opens no ruling. Where the volume names a
## sentence, that sentence is variant 1 verbatim.

**This file is the authoring bill SP-6 prices. It is not a spec.** Kind ids
below are the volume's own where the volume names them; where the volume
describes a phrased beat without naming a kind, the id here is a POOL HANDLE
for the implementer to reconcile against the real registration at mint time
(each such block is marked `[POOL HANDLE]`). Nothing here grows a closed
vocabulary: `PLANT_REFUSALS`, `QUERY_REFUSALS`, `RACE_OUTCOMES`, the term
compliance states, and the engagement endings are the volume's, spelled as the
volume spells them.

### THE SLOT CONVENTION
Every proper noun and every recorded cause is a SLOT. Nothing is baked.

| Slot | Fills with |
|---|---|
| `{settlement}` | the subject settlement, BY NAME (the address law) |
| `{counterpart}` | the second named settlement — the mark, the rival, the other court |
| `{place}` | a THIRD named settlement (where an instrument was signed, where a thing happened) — **volume-local extension, declared here**; §8's "signed at [Z]" needs it and the ten-slot convention has no third settlement |
| `{npc}` | a named person from the roster (courier, factor, watcher, accused) |
| `{faction}` | the acting faction / seat / court |
| `{house}` | the acting house — **including the brokerage/market institution**, which this estate voices as a house ("the house's ledger, read by lamplight") |
| `{temple}` | the named temple or cult |
| `{band}` | a band word from the closed quantity/severity vocabularies — never a count |
| `{reason}` | the RECORDED reason, typed, from the receipt's own reason field |
| `{good}` | the named trade good |
| `{route}` | the named road / sea lane / pass |
| `{season}` | the named season or turn-of-year — **volume-local extension, declared here**; IN-1's own exemplar ("shown it nothing since [season]") requires it |

Two extensions (`{place}`, `{season}`) are flagged for the chair. Both are
forced by exemplars already written into the volume; neither is a count and
neither carries a fate.

### THE LAWS THESE POOLS ARE MEASURED AGAINST
- **NO DIGITS.** Counts speak only in band words (`{band}`, or "a handful", "many",
  "most"). Time words ("a season", "a year", "a day") are prose, not counts.
- **LAW ONE / THE ANONYMITY–NO-FATES BOUNDARY** (DESIGN_FP_INFORMATION §1b):
  no fate verb (hanged / killed / executed / exiled / shuttered) reaches a named
  soul. The spy is **burned**; the accused is **named**; the arrangement **goes
  quiet**. A house's name is **ruined**, never its doors. No god acts — the
  temple *calls* it, believers *read* it.
- **BELIEF ATTRIBUTION.** Unconfirmed content carries its attribution ("men said",
  "rumour calls them", "the word is"). The mirror pools carry the **record voice**
  and NO perception verb — never "believes", never "in their eyes" (IN-1's
  phrase-scan pin).
- **HEADLINE HONESTY (R-28).** Every verb here is entailed by the receipt's own
  facts. Where a variant says a court "had the word", the receipt's belief record
  is what entails it.
- **AUDIENCE.** `dm-only` blocks are DM-truth projections and must never reach a
  player surface (fail-closed, J-INF-12's pattern). The public projection of a
  covert episode is its *visible* half — the march, the sweep, the exposure.
- **THE FAMILY RULE.** Two variants differing only in slot fills are ONE. Every
  pool below spans the angle palette: the event plain · the street's view · the
  ledger's/institution's view · the consequence forward · the understatement ·
  the traveller's report · the season's frame · the small human detail. (The
  last three are the palette WIDENING the frequency-scaled floor forced — a
  pool of eight to twelve cannot be spanned by five angles without families.)

---

## IN-0a — THE FOLD (PLANT_WIRING)

### plant_commissioned (IN-0a) — Herald knowledge desk (DM projection) / town page, "Stories standing against this town" — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {faction}
AUDIENCE: dm-only
1. A story is bought in the lower market. It is not true. Nobody there knows that yet.
2. Coin crossed a table at {settlement}, and a telling about {counterpart} went out under {house}'s seal.
3. {house}'s book records a commission and no customer; {faction} paid in silver that carried no name.
4. What {counterpart} will hear of {settlement} was written this week, in a back room, for a price.
5. It cost less than a season's tolls to have {counterpart} told a thing that never happened.
6. In the lower market at {settlement} they say a clerk of {house} bought drink for a stranger and asked what he could carry.
7. The traveller who took the commission out of {settlement} was given the telling and the road, and not the reason.
8. It was a quiet week for {house}, and quiet weeks are when the tellings get written.
9. The man who wrote it asked nothing about {counterpart} and was paid before the ink dried.

### plant_took (IN-0a) — Herald knowledge desk (DM projection) — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {band}
AUDIENCE: dm-only
1. The bought telling has taken at {counterpart}: what {settlement} paid for is now what that court holds.
2. In {counterpart}'s council chamber the purchased word is quoted as common knowledge; nobody recalls who brought it in.
3. {house}'s commission is discharged — the ledger closes, and the falsehood stands at {band} in a real court's reckoning.
4. The story arrived slowly, the way true things do, and was taken for one.
5. It is held now. That was the whole of the purchase.
6. In {counterpart}'s market the tale needs no teller now; it is simply what is known of {settlement}.
7. Carters coming off the road repeat it to men who repeat it back, and no telling credits the first.
8. What {counterpart} does next season, it will do on a page that was bought.
9. A clerk at {counterpart} filed it under things everyone knows, which is where stories go to become facts.

### plant_died_quiet (IN-0a) — Herald knowledge desk (DM projection) — significance: routine
SLOTS: {settlement}, {counterpart}, {house}
AUDIENCE: dm-only
1. The bought story reached {counterpart} and found the court already better served; it went no further.
2. Factors at {counterpart} had the matter from two roads already, and the bought telling agreed with neither; the tale thinned and stopped.
3. {house} at {settlement} is paid all the same — the commission bought a telling, never a believing.
4. Nothing came of it. Somewhere a ledger still shows the price.
5. In {counterpart}'s taverns the tale was told once, badly, and not taken up.
6. Carters out of {settlement} carried it as far as the first toll and found better talk waiting there.
7. It had a season to take and did not; by spring nobody at {counterpart} could say where they had heard it.
8. {settlement} will try again with another hand — the failure is entered as a cost of the trade.
9. The man paid to tell it told it well. Some rooms are simply full.

### plant_exposed (IN-0a; extends `infowar_lie_exposed` to NAME THE MARKET) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {counterpart}, {house}, {faction}, {reason}, {band}
AUDIENCE: public
1. The word out of {house} at {settlement} is broken; what it sold of {counterpart} does not match what the roads bring.
2. {house}'s stamp now needs a second road behind it before {counterpart}'s quays will take it, and everyone working those quays can say why.
3. {house}'s stamp is worth {band} less this season than last; {reason} is written beside it in every counting-house.
4. The market that sold the story now wears it — {settlement} keeps the coin and loses the custom.
5. It was a good story. It was sold too often, and to the wrong court.
6. {faction} bought the telling; the buying is on the record now, and the record travels.

### plant_backfired (IN-0a) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {counterpart}, {house}, {faction}
AUDIENCE: public
1. The story {faction} bought against {counterpart} came home named, and the grievance is theirs to answer now.
2. {counterpart}'s clerks hold the forgery and the forger's price in the same file.
3. What was meant to move an army moved only an accounting; {house} at {settlement} pays, and {faction} pays twice.
4. They bought a war and were handed a grievance, with their own name at the head of it.
5. In {counterpart}'s market the forgery is the story now, and {faction} is the villain of it.
6. Every true thing {faction} says of {counterpart} from here will be weighed against the one it bought.

---

## IN-0b — THE INTERCEPT CONSUMER

### intercept_hum (IN-0b) `[POOL HANDLE]` — Herald knowledge desk (DM projection) — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {faction}
AUDIENCE: dm-only
1. Word passes quietly between courts — and quieter still, someone reads it.
2. A packet out of {settlement} was opened, copied, and sealed again before the harbour bell.
3. {house} keeps a room at {settlement} for reading what was never addressed to it.
4. {faction} pays {house} to know what {counterpart} writes; the fee is entered as freight.
5. The quay at {settlement} knows which shed the sealed sacks go into, and knows better than to ask.
6. The reading room is entered in {house}'s book as storage, and the wax is entered as candles.
7. All season the packets have gone through the same hands at {settlement}, and arrived on time, and arrived read.
8. Nothing has come of the reading yet. Everything that comes of it will come from here.
9. A boy carries the copies up the stairs and cannot read a word of them, which is why he was chosen.

### intercept_read (IN-0b) — the patron's DM intelligence block — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {faction}, {route}, {band}
AUDIENCE: dm-only
1. {house} can say this much of {counterpart}'s traffic: a carriage went out, and to whom — no further.
2. The claim reaches {faction} at the rung it was bought at; the broker will not swear past it.
3. What {counterpart} sent along {route} is known at {settlement} now, in outline and at {band} certainty.
4. They know a letter went. They do not know what it said, and the price did not cover knowing.
5. The register at {house} gives a date, a hand, and a destination; {faction} pays for the third and gets the first two with it.
6. Down on the quay they can tell you which ship carried it. Nobody can tell you what it carried.
7. {faction} will act on an outline, and an outline is what it will be judged on.
8. A season of reading, and what it yields is that {counterpart} still writes letters.
9. The rider was watched from the {route} gate to the harbour, and never once opened.

### intercept_refused (IN-0b; the honest `no_record` token) — the patron's DM intelligence block — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {faction}
AUDIENCE: dm-only
1. {house} took the question and returned the coin: the register holds nothing of {counterpart} this season.
2. Nothing of {counterpart} has passed {settlement}'s readers; the honest answer is the whole answer.
3. The broker at {settlement} would sooner refuse than invent — the register is empty, and says so.
4. A silence is a poor purchase. It is what {faction} bought.
5. The register is turned round on the table at {house} so {faction}'s man may read the blank himself.
6. The broker's clerks at {settlement} give the shrug they keep for the truth.
7. Nothing of {counterpart}'s has come through since the turn of the year, and the honest register says as much.
8. {faction} pays for the emptiness and files it; an absence, dated, is worth something later.
9. He counted the coin back across the table without looking at it. He has done this before.

### intercept_caught (IN-0b endings; MINTED BY IN-3's sweep — the cross-wave producer) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {counterpart}, {house}, {faction}, {npc}
AUDIENCE: public
1. {settlement}'s watch found the reader before the letter found its road; the seal was broken and the hand was known.
2. A packet came back to {counterpart} opened; the town names {house}, and the naming will travel.
3. {faction}'s custom at {house} is a matter of record now, entered where {counterpart}'s clerks can read it.
4. {npc} read one letter too many; this one was watched.
5. The quay at {settlement} saw him taken out of the reading room in daylight, and tells it that way still.
6. {counterpart} will send by other hands and other roads, and will pay more for both.

---

## IN-0c — THE DISCLOSURE EXECUTOR (compelled intel)

**`treaty_disclosure_opened` → pool lives in `RECEIPT_POOLS_GRAMMAR.md` under `# GR-0 — THE LIFECYCLE VOICE`.** Relocated by IN-0C under chair ruling CR-IN0C-ANNEX (CONTENT FOLLOWS REGISTRY): the kind registers in `GRAMMAR_KIND_REGISTRY`, whose walker reads the GRAMMAR volume, so the pool moved to the volume that owns its registry row. It was re-slotted to that walker's fixture slots and re-voiced to the GRAMMAR default party binding (`{settlement}` = the court OWED, `{counterpart}` = the court whose books open) — the IN-0c draft below bound them the other way round, which would have named the wrong court. Its desk is the ruled **trade** desk (CR-IN0C-2-R1), not a knowledge desk.

### disclosure_feed (IN-0c) `[POOL HANDLE]` — the victor's DM intelligence block — significance: routine
SLOTS: {settlement}, {counterpart}, {band}, {season}
AUDIENCE: dm-only
1. This season's accounting out of {settlement} reached {counterpart} at the term's fidelity — thin, and true enough.
2. {counterpart} learns of {settlement}'s musters the slow legal way, a season stale and sworn to.
3. The compelled word carries the loser's own doubts with it; {counterpart}'s file inherits both.
4. What arrives under the article is what {settlement} had, when it had it — no better and no fresher.
5. Since {season} the returns have come at {band}, on time, and told {counterpart} nothing it did not expect.
6. The returns are copied fair, sealed, and entered — {settlement}'s clerks make no error the article can catch.
7. At {settlement} they call the treaty clerks the visitors, and give them the dull rooms.
8. {counterpart} will plan on this and be a season behind for the whole of the term.
9. Everything asked for was sent. Nothing more was.

### disclosure_strained (IN-0c; renders the term's built `strained` compliance state — NO new vocabulary) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {counterpart}, {reason}, {season}
AUDIENCE: public
1. They signed the open door and barred it — {settlement}'s returns to {counterpart} come late and come short.
2. {counterpart}'s clerks were kept at the gate at {settlement} all {season}; the term does not say they may be.
3. The article stands; the compliance does not. {reason} is entered against {settlement} in the treaty file.
4. Nothing was refused outright. Nothing useful arrived either.
5. The returns arrive complete and arrive last; every date in {counterpart}'s file is later than the one before it.
6. {counterpart} reads the lateness as an answer, and will answer it.

### disclosure_expired (IN-0c; the same-tick LIFT beat — `[POOL HANDLE]`, INFERRED from the expiry pin, flagged for the chair) — Herald knowledge desk — significance: routine
SLOTS: {settlement}, {counterpart}, {place}
AUDIENCE: public
1. The term ran out at {settlement} and the door shut the same week; {counterpart}'s clerks rode home.
2. {counterpart} hears nothing further out of {settlement}'s muster hall — the article's years are done.
3. The open-door years written at {place} close on the calendar they were written to.
4. The clerks left on the day named in the instrument, and nobody asked them to stay.
5. The last return is filed and the file closed on the date the instrument named.
6. The taverns at {settlement} marked the strangers gone before the council said anything of it.
7. What {counterpart} holds of {settlement} is fixed at the day the term ended, and ages from there.
8. The article outlived the war and the winter both, and ended on a spring morning with nobody present.
9. A clerk packed his ledgers, thanked the porter, and rode out by the road he came in on.

> **THE OTHER TWO COMPLIANCE STATES HAVE NO POOL HERE, DELIBERATELY.** IN-0c's
> endings ride peaceTerms' own `TermRecord.complianceState` union {honored,
> strained, defaulted, expired}. `honored` is the quiet default (a term kept is
> not a beat), and `defaulted` mints **the term family's own** default receipt —
> peaceTerms owns that sentence, and a second speller here would be the R3
> violation IN-0c's Model forbids. Only the two states this volume voices in its
> own words are pooled above.

---

## IN-0d — HIDE'S TRADE TAX

### hide_toll_hum (IN-0d) `[POOL HANDLE]` — Herald knowledge desk — significance: routine
SLOTS: {settlement}, {counterpart}, {band}, {good}, {route}
AUDIENCE: public
1. The gates of {settlement} are shut to strangers; so are its markets, more than its council admits.
2. Factors bound for {settlement} take the longer {route} to {counterpart} instead, and the quay stands quiet.
3. {settlement}'s tolls are down {band} this season, and nobody on the council will say the gate is why.
4. {good} that once came through {settlement} now goes around it; the road learned faster than the seat did.
5. The town is safer. The town is also poorer, and the two facts share a cause.
6. The counting-house at {settlement} shows fewer entries each quarter and the same wages to the same gate men.
7. Ask any factor on the {route} road why he passes {settlement} by, and he will tell you about the questions.
8. A season of shut gates has done what no rival could — the market at {counterpart} holds {settlement}'s custom now.
9. The stallholders keep their pitches out of habit. The habit is what is left.

### hide_toll_line (IN-0d; the dossier GLANCE line — settlement brief, trade lines) — settlement brief / town page trade lines — significance: routine (dossier line, not a Herald beat)
SLOTS: {band}
AUDIENCE: public
1. Sealed, and paying for it.
2. Gates shut; trade at {band} of what the road would bear.
3. Closed to strangers — the counting-house shows the price.
4. A shut gate, and a thin book.
5. Safe, and thinly supplied.
6. Strangers turned back; the quay shows it.
7. The gate holds. The takings do not.
8. Trade at {band}; the council calls it caution.
9. Well watched, poorly served.

---

## IN-1 — THE MIRROR (second-order belief)

> **THE RECORD VOICE IS LAW HERE.** No variant in this section contains a
> perception verb. The mirror renders what the record shows was SHOWN — never
> what anyone believes. IN-1's phrase-scan pin bites on "believes", "thinks",
> "in their eyes".

### mirror_shift (IN-1) — Herald knowledge desk — significance: routine
SLOTS: {settlement}, {counterpart}, {season}, {band}, {route}
AUDIENCE: public
1. By its own ledger, {settlement} has shown {counterpart} less than it did a year ago — and shown it nothing since {season}.
2. What {settlement} sends {counterpart} now is weather and greetings; the figures stopped going out in {season}.
3. The record of what {counterpart} has been shown thins to {band}; the last entry is a courtesy, not an accounting.
4. Much was shown to {counterpart} once. The ledger has been closing ever since.
5. Nothing has gone out along {route} to {counterpart} for a season, and the picture they were handed keeps its old shape.
6. {settlement} has shown {counterpart} {band} of what it showed {counterpart} before the war — deliberately, and it is written down.
7. At {settlement}'s quay, {counterpart}'s factors ask now for what used to be handed to them unasked.
8. Against {counterpart}'s name the chancery's list of sendings runs long, and then stops, and the stopping is dated.
9. Whatever {counterpart} settles on next, it settles on paper {settlement} handed over before the war.

### mirror_confidence_degraded (IN-1; the counterforce receipt — names the inconsistent act AS WE HEARD IT) — Herald knowledge desk — significance: routine
SLOTS: {settlement}, {counterpart}, {reason}, {season}
AUDIENCE: public
1. {counterpart} moved on a matter {settlement} never showed them; the chancery's ledger is no longer a safe guide.
2. Word is that {counterpart} did {reason} — nothing {settlement} ever sent could have told them that.
3. A telling of {settlement}'s was broken in {counterpart}'s court; whatever else was shown must be counted doubtful now.
4. The clerks kept a careful ledger of what was shown. Since {season} it has stopped explaining what {counterpart} does.
5. The chancery has begun marking old entries doubtful; this quarter the marks outnumber the entries.
6. The talk at {settlement} is that {counterpart} moved on something it was never sent.
7. Every telling {settlement} sends from here will be weighed against the one that broke.
8. The season's account closes with more corrections in it than entries.
9. The clerks did their work exactly. The work stopped being worth doing.

### mirror_standing_line (IN-1; the dossier standing line under "WHAT THE NEIGHBOURS HAVE BEEN SHOWN") — town page — significance: routine (dossier line)
SLOTS: {counterpart}, {band}, {season}
AUDIENCE: public
1. Less than we fear, and the reckoning is a season stale.
2. {counterpart} has been shown {band}; nothing since {season}.
3. Given {band} to see, and given it late.
4. {counterpart} works from what we handed over, and we handed it long since.
5. Shown {band}, and shown it a season since.
6. What they hold of us is old paper.
7. The last thing {counterpart} was handed, it was handed in {season}.
8. They work from an accounting, not from us.
9. Thin, dated, and ours to have written.

---

## IN-2 — THE LURE (the program's signature)

> **BAIT FAMILIES.** The volume's weakness bait is buildable now; the WEALTH and
> DEVOTION baits are HARD BLOCKED on SP-2's BELIEVED SCARCITY / CONDITIONS /
> DEVOTION families (§3 LIT-PRECONDITIONS). The spring pools are therefore split
> by bait family — a garrison sentence cannot render a gold rush. The remaining
> lure kinds (`lure_resisted`, `lure_exposed_first`, `lure_backfired`) are
> authored bait-NEUTRAL below; when SP-2's families land, each gains a
> bait-appropriate sub-pool at the same floor. **Recorded deferral, not an
> omission.**

### lure_sprung (IN-2; WEAKNESS bait — buildable now) — Herald knowledge desk (DM projection) — significance: notable; major-eligible per J-INF-8 where the march opens a war
SLOTS: {settlement}, {counterpart}, {house}, {faction}, {route}, {season}
AUDIENCE: dm-only
1. They marched on a weakness that was bought for them.
2. {faction}'s column is on the {route} road to {counterpart}, moving on a muster count that {house} sold them.
3. The commission at {settlement} is discharged in full: the mark bought the story, then bought a war with it.
4. Nobody at {counterpart} lied to {faction}. Someone else did, a season earlier, for money.
5. The purchased word aged into common knowledge, and common knowledge put an army on the road.
6. A story went out of {settlement} in {season}; the spears crossed the border before the year turned.

### lure_sprung — WEALTH bait sub-pool (IN-2; **NOT a second kind id** — the endings token is `sprung`, ONE kind; selection is keyed on the plant's bait family, so this mints no vocabulary. **BLOCKED on SP-2's BELIEVED SCARCITY/CONDITIONS families**) — Herald knowledge desk (DM projection) — significance: notable; major-eligible per J-INF-8
SLOTS: {settlement}, {counterpart}, {house}, {faction}, {good}, {route}
AUDIENCE: dm-only
1. There was {good} in the hills at {counterpart}, men said. There were carts on the {route} road by spring.
2. {house} sold {settlement} a country of full granaries, and {settlement} sent its second sons to find it.
3. The assay was written before anyone dug; {faction} paid for the writing and believed the reading.
4. Nobody at {counterpart} ever claimed to be rich. It was claimed for them, at a price.
5. They went for {good} and came back with the road behind them and nothing in the cart.
6. The market at {settlement} priced the country before anyone had seen it, and the carts followed the price.

### lure_sprung — DEVOTION bait sub-pool (IN-2; **NOT a second kind id** — the endings token is `sprung`, ONE kind; selection is keyed on the plant's bait family, so this mints no vocabulary. **BLOCKED on SP-2's BELIEVED DEVOTION family**) — Herald knowledge desk (DM projection) — significance: notable; major-eligible per J-INF-8
SLOTS: {settlement}, {counterpart}, {temple}, {house}, {faction}
AUDIENCE: dm-only
1. A charter was shown at {temple} that no chancery had ever sealed, and the crowds at {settlement} read it as proof.
2. {house} sold {faction} a neighbour full of the wrong devotion; the pews at {settlement} filled with the news.
3. The document is old, the hand is older, and the ink is not — but {temple} has called it authentic and the calling is what travels.
4. {counterpart}'s faith was never in question until a forgery raised it, and the raising cannot be unraised.
5. The road to the shrine at {counterpart} carried pilgrims first and pikes after; the paper that sent them both is in {house}'s vault.
6. The charter passed from hand to hand at {settlement} until the copies outnumbered the questions.

### lure_resisted (IN-2) — Herald knowledge desk (DM projection) — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {faction}
AUDIENCE: dm-only
1. {faction}'s captains had the tale out of {house} and better word off two roads besides; the muster stood down.
2. The bait sat in {counterpart}'s court a whole season and moved nothing — good sourcing is armour.
3. {house} at {settlement} is paid, the story is planted, and the mark has gone on knowing better.
4. They were told a thing worth marching on. They asked someone else first.
5. The muster roll is entered and struck through in one week; the clerk's note says the word did not hold.
6. The captains' talk at {settlement} went round the tale, and then round the two roads that contradicted it.
7. The story keeps standing in {faction}'s file, unspent and cheap to try again.
8. It sat a whole season without moving anyone, and a tale that has waited that long moves nobody after.
9. One old serjeant had ridden that border himself and said so, and that was the end of it.

### lure_exposed_first (IN-2) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {counterpart}, {house}, {faction}, {band}
AUDIENCE: public
1. The story broke before the march did — {house}'s telling of {counterpart} is contradicted at every quay.
2. {faction} learns what it was sold before it spends a spear on it; the coin is gone, the war is not bought.
3. {house}'s stamp falls {band} and the commission goes cold on the shelf; {settlement} wears the shame of the sale.
4. It was found out in time. That is all the mercy in it.
5. The commission stands on {house}'s books and the contradiction on everyone else's; the two are read side by side.
6. {faction} keeps its spears and loses its appetite for anything {house} sells hereafter.

### lure_backfired (IN-2; exposure AFTER the spring — the bought war becomes the avenged war) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {counterpart}, {house}, {faction}
AUDIENCE: public
1. {faction} marched on a bought weakness and learned the price after the fact; the grievance names {house} at {settlement} and the buyer both.
2. The first page of {counterpart}'s case is not the march but the paper that arranged it, and {house} is named on that page.
3. The war stands; the cause does not — and both courts can read who paid for it.
4. They got their war. They also got a name fastened to it, in {counterpart}'s hand.
5. The bought march is a debt now, and {faction} will pay it in {counterpart}'s courts for a generation.
6. In {counterpart}'s market they name the house before they name the army.

### bluff_collision (IN-2; the settled signature tragedy, pinned on the expiry arm) — Herald knowledge desk (DM projection) — significance: notable; major-eligible per J-INF-8 where it opens a war
SLOTS: {settlement}, {counterpart}, {band}, {season}
AUDIENCE: dm-only
1. Two courts, two bluffs, one war neither wanted.
2. {settlement} reckoned {counterpart}'s garrison at a strength {counterpart} had invented, and {counterpart} returned the favour.
3. Both chanceries kept a telling standing and both read the other's; when the older one aged out in {season}, the muster was already on the road.
4. Each court was certain of the other's weakness, and each was the author of it.
5. Neither court told the truth; neither doubted the other's. The war came out of the arithmetic.
6. The lies expired {band} apart. That was the whole of the difference between a scare and a war.

### march_refused_on_muster (IN-2; the `enforceLiveStrength` veto's own receipt — the refusal is itself a story) `[POOL HANDLE]` — Herald knowledge desk — significance: routine
SLOTS: {settlement}, {counterpart}, {faction}, {house}
AUDIENCE: public
1. Rumour calls {counterpart} weak, but the live muster shows an equal or stronger host; {faction}'s captains will not march on it.
2. The word out of {settlement} says {counterpart} is spent; the scouts say otherwise, and the scouts were sent for.
3. {faction}'s council heard the tale and counted the spears. The counting won.
4. They were offered a weakness and declined it — the story stands, and stands unspent.
5. {house} sold a march and {faction} did not buy it; the coin was another court's, and it is still gone.
6. The order was drawn and not sealed; the muster return is filed beside it, and the return is the reason.
7. At {settlement} the taverns had the war for a fortnight and then gave it back.
8. The tale keeps its currency and loses its use — {counterpart} will hear it repeated by men who never marched.
9. The scouts came back muddy and certain, and the certainty carried the room.

### grievance_named_lie (IN-2 / IN-5; scoreGrievance's incident-naming variant) — Herald knowledge desk / the war brief's grievance line — significance: notable
SLOTS: {settlement}, {counterpart}, {house}, {faction}
AUDIENCE: public
1. The ledger of grievances opens with a forgery, and now it is named.
2. {counterpart}'s case against {faction} begins not at a border but with a bought story out of {house} at {settlement}.
3. The first entry is the forgery; every entry after it is what the forgery cost.
4. They can name the lie at last. It does not give back the season it took.
5. The case is drawn with the forgery as its first exhibit — dated, priced, and attributed.
6. The naming will be read into every negotiation from here, and {faction} pays a little for it each time.

---

## IN-3 — THE COUNTER-GAME

### sweep_launched (IN-3) `[POOL HANDLE]` — Herald knowledge desk — significance: routine
SLOTS: {settlement}, {reason}, {faction}
AUDIENCE: public
1. The gates grow teeth; every stranger at {settlement} is twice questioned.
2. {faction}'s enforcer at {settlement} has the gate rolls out; carters wait a day and answer for their loads.
3. The seat is paying men to ask questions, and the cost stands in the town's book under {reason}.
4. Nobody at {settlement} is accused. Everybody is asked.
5. The seat's book at {settlement} opens a line for extra watchmen, lamp oil, and a clerk to keep the gate rolls.
6. The carters at {settlement} have learned to bring their papers and their patience.
7. A stranger coming into {settlement} this season answers at the gate, at the inn, and again in the morning.
8. Nothing has been found yet. The looking is already changing who comes.
9. The questioning began at the turn of the season, and the season is being remembered by it.

### sweep_catch (IN-3 endings `catch`; the town's side of the burning) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {counterpart}, {faction}, {npc}
AUDIENCE: public
1. {settlement} has learned which of its own were being paid to listen.
2. {settlement}'s watch turned up a retainer of {counterpart}'s keeping the gate rolls in a private hand.
3. The purse came from {faction}, and the town has the purse; {npc} will not be trusted at that gate again.
4. They had been watched a year; the watcher is named now, and a named watcher is no use to anyone.
5. {counterpart}'s coin was found in {settlement}'s own guardroom, and the town will remember which door it came through.
6. {counterpart} loses a year of quiet work in a morning, and will not find that door open again.

### sweep_clean_miss (IN-3 endings `clean_miss`) — Herald knowledge desk — significance: routine
SLOTS: {settlement}
AUDIENCE: public
1. {settlement}'s watch questioned every stranger for a season and found no one; the cost stands in the book.
2. The gates were toothed and the gates were empty — no paid eye, no purse, no name.
3. {settlement} paid for a hunt and bought a quiet town; the council calls it money well spent.
4. They looked hard and there was nothing to find; some towns are simply quiet.
5. The cost of the sweep is entered in full; against it the seat's book records no name and no purse.
6. The town was asked everything for a season and has nothing to show but the asking.
7. The gate rolls stay, the watchmen go, and {settlement} keeps the habit of looking.
8. A season of questions and an empty file. It is the commonest ending there is.
9. The clerk who kept the rolls asked to keep them. The seat let him.

### sweep_witch_hunt (IN-3 endings `witch_hunt`; mints the `false_accusation` receipt — REPUTATION only, no fate) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {npc}
AUDIENCE: public
1. They found no spy at {settlement}, and named one anyway — the town remembers whose name it was.
2. The sweep turned up nothing; {npc} was named on a season's association and nothing firmer.
3. The seat wanted an answer more than it wanted the truth, and {npc}'s name was the nearest one to hand.
4. {npc}'s custom fell away within the week; the charge was never proved and never withdrawn.
5. The commons hold this against the seat at {settlement}; it will be remembered longer than the sweep was.
6. No spy. One name. The town can count.

### source_vetted_clean (IN-3, the VET verb) `[POOL HANDLE]` — the seat's DM intelligence block — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {npc}
AUDIENCE: dm-only
1. {settlement}'s clerks read {npc}'s associations and found nothing crossed; the channel keeps its rung.
2. The courier out of {house} is who the house says he is, and the seat will take his word at full weight.
3. Ties, debts, and kin all counted — the source at {counterpart} stands clean in the file.
4. Nothing wrong with the man. The checking was the point.
5. Debts, kin, and custom are set down on one page at {settlement}, and the page comes out even.
6. The channel keeps its rung, and what it sends next will be taken at full weight.
7. {npc} sat through a morning of questions about his cousins and answered every one.
8. The checking is done at each turn of the year, and each year it has come out the same.
9. Nothing found. The file says so in a line, and a line is what a clean man gets.

### source_vetted_flagged (IN-3, the VET verb) `[POOL HANDLE]` — the seat's DM intelligence block — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {npc}, {faction}, {band}
AUDIENCE: dm-only
1. {npc} carries {counterpart}'s word and {faction}'s debts; the seat at {settlement} discounts him {band}.
2. {house} vouches for the courier and profits by his telling — the file says so plainly.
3. The channel keeps its rung and loses a band; nothing is proved, and nothing is trusted either.
4. He may be honest. His creditors are not, and the seat has read the ledger.
5. The seat's file carries a note beside {npc}'s name and a band beside the note; both travel with all he sends.
6. The word at {settlement} is that {npc}'s debts are held where his news comes from.
7. He will go on being read, and go on being discounted, and will never be told which.
8. The flag was set at the last vetting and has not come off in a year of good reports.
9. He answered every question. It was the one about his wife's brother that cost him the band.

### send_two_divergence (IN-3, the SEND-TWO verb; the shared corroboration-divergence reader, J-INF-15) `[POOL HANDLE]` — the seat's DM intelligence block — significance: routine
SLOTS: {settlement}, {house}, {route}, {band}
AUDIENCE: dm-only
1. Two carriers went out of {settlement} with one cargo, and the accounts they brought back do not sit together.
2. The second rider's telling is {band} off the first's, and the road cannot account for the whole of it.
3. {house}'s clerks lay the two reports side by side; their note says one man has been somewhere he should not have been.
4. Both men rode the same {route}. Only one arrived with the story he left with.
5. Two accounts, one cargo, a page each — {house}'s clerk has ruled a line between them and written nothing beneath it.
6. On the quay at {settlement} the two carriers no longer drink together, and the quay has noticed.
7. Neither account will be trusted alone again; the seat sends in pairs from here on.
8. The {route} road is long enough to explain a day and not long enough to explain the rest.
9. The road took the same time for both. The difference is a man's, not the weather's.

### gates_closed_in_answer (IN-3, HIDE-AS-ANSWER — the deliberate entry path) `[POOL HANDLE]` — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {reason}, {season}, {npc}
AUDIENCE: public
1. {settlement} shuts its gates to strangers and the council names {reason} — a paid eye taken at the quay in {season}.
2. After {npc} was found out at {settlement}, the harbour-master keeps a list, and the list is short.
3. The seat did not grow fearful by degrees; it read the evidence and closed the door inside a week.
4. They were watched. Now nobody is let in to watch.
5. The order is entered with its cause beside it — the seat wants it known that the closing was earned.
6. The tolls will fall and the council knows it; it has decided a shut gate is worth the thinner book.

### gates_reopened (IN-3; the pinned reversal — suspicion decays, gates reopen) `[POOL HANDLE]` — Herald knowledge desk — significance: routine
SLOTS: {settlement}, {good}
AUDIENCE: public
1. The gates at {settlement} stand open again; nothing has surfaced in a year, and the tolls were missed.
2. Strangers pass at {settlement} unasked once more — the fear outlived the evidence by a season, and then it did not.
3. The watch rolls are closed and the quay is busy with {good} again; the council mentions neither.
4. Fear is expensive. {settlement} has done the arithmetic.
5. The watch line closes in the town's book and the toll line opens; the council reads both without comment.
6. The gate men are waving carts through again, and the queue outside is a market once more.
7. Factors who took the long way for a year are turning back toward {settlement}, warily and then not.
8. The gates opened with the roads, and by midsummer nobody spoke of the sweep at all.
9. The harbour-master burned his list. He kept a copy, being a harbour-master.

### engagement_opened (IN-3; the recruit receipt — the arc's first phase) `[POOL HANDLE]` — Herald knowledge desk (DM projection) / Watch panel — significance: routine
SLOTS: {settlement}, {counterpart}, {faction}, {house}, {npc}
AUDIENCE: dm-only
1. A retainer is entered in {faction}'s book against no service anyone will name, paid quarterly at {settlement}.
2. {house} finds {counterpart} a man already at the gate, already trusted, and already short of money.
3. {npc} takes {faction}'s coin and keeps his post at {settlement}; nothing changes but who he writes to.
4. The arrangement is small, cheap, and patient. Those are the ones that last.
5. The payment is entered under carriage at {settlement}, and carriage is the line nobody audits.
6. Nothing on the quay has changed. That is the whole intention of it.
7. It will be years before this line in the book means anything, and then it will mean a great deal.
8. The arrangement is made in the dull part of the year, when nobody is watching anybody.
9. He asked what would be wanted of him and was told: nothing yet.

### engagement_burned (IN-3 endings `burned`; the patron's side of the catch) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {faction}, {reason}
AUDIENCE: public
1. {faction}'s eyes at {settlement} are burned; the name is public and the door is shut.
2. Whatever {settlement} does next, {faction} will hear it late and hear it from strangers.
3. The purse is found, the post is empty, and the arrangement is entered in the town's book under {reason}.
4. Years of quiet, and one careless season to end them.
5. The whole of {settlement} has the name by market day, and the knowing is half the punishment.
6. The retainer, the post, and the purse are all entered in the seat's book, and the book is read aloud.

### engagement_withdrawn (IN-3 endings `withdrawn` — A DECISION, distinct from `gone_quiet` per J-INF-16) — Herald knowledge desk (DM projection) — significance: routine
SLOTS: {settlement}, {faction}, {house}
AUDIENCE: dm-only
1. {faction} calls its eyes home from {settlement} before the sweep reaches them; the retainer stops this quarter.
2. The decision is written and dated: the risk at {settlement} outran the worth of the watching.
3. {house} is told to close the arrangement cleanly — no letters, no last errand, no trace on the quay.
4. Nobody was caught. The watching simply stopped being worth its price.
5. The quarterly entry stops, and the line is ruled off with a date and no note.
6. The man at {settlement} keeps his post and stops receiving letters, and the quay marks no difference.
7. {faction} will be blind at {settlement} by choice, and will pay for the choice in a year it cannot foresee.
8. They closed it in the quiet season, which is when such things are meant to be closed.
9. A cold arrangement is cheaper than a burned one. {house} has closed many.

### engagement_gone_quiet (IN-3 endings `gone_quiet` — AN UNRESOLVED FADE, distinct from `withdrawn` per J-INF-16) — Herald knowledge desk (DM projection) — significance: routine
SLOTS: {settlement}, {counterpart}, {faction}, {npc}
AUDIENCE: dm-only
1. Nothing has come out of {settlement} for {counterpart} in a year; the arrangement is neither closed nor answering.
2. The retainer is still paid and the letters have stopped; {faction}'s clerks keep the line open out of habit.
3. {npc} keeps his post and keeps his silence — whether from fear, or care, or a change of mind, the file does not say.
4. No burning, no recall, no word. The thread frays where nobody is looking.
5. The retainer line runs on, quarter after quarter, against an empty column of returns.
6. At {settlement} he is where he always was, doing what he always did, and saying nothing to anyone.
7. {faction} will go on paying until someone reads the file, and nobody is reading the file.
8. The last letter came in the spring, and the seasons since have brought none after it.
9. A clerk at {counterpart} has begun writing no return in the same hand every quarter.

### house_unmasked (IN-3 house endings `unmasked`; `projectPatronBindings`' first consumer) — Herald knowledge desk / town page Houses block — significance: notable
SLOTS: {settlement}, {house}, {faction}, {band}
AUDIENCE: public
1. The house's ledger, read by lamplight, named its true patron.
2. {house} at {settlement} has been {faction}'s all along, and the stamp on its word is worth {band} less this morning.
3. Rivals who bought from {house} in good faith are reading every old report again, and liking none of them.
4. Neutral for a generation and bought for a season — the quays had the story before the council did.
5. It sold the truth honestly, and sold the buyer too.
6. Every report {house} sold in the last years will be read again for whose interest it served.

### house_weathered (IN-3 house endings `weathered`) — Herald knowledge desk / town page Houses block — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {band}
AUDIENCE: public
1. The charge against {house} at {settlement} was loud for a season and proved nothing; the custom came back.
2. {house}'s stamp holds — the ledgers were opened, and what was in them was dull.
3. {counterpart}'s factors returned to {house}'s counter inside the year, quietly, and did not raise the matter.
4. The name was shaken and not broken. It is a difference of {band}, and of everything.
5. The books were opened to the seat at {settlement} and closed again; the entry against {house} reads nothing proved.
6. The quay talked of {house} all winter and by spring was talking of something else.
7. The stamp carries a little less far than it did, and will carry that little less for years.
8. Factors off the road ask about the charge, are told it came to nothing, and buy as they always did.
9. The senior clerk kept the counter open through the whole of it and never once explained himself.

### house_ruined_name (IN-3 house endings `ruined_name`; REPUTATION only — the doors stay open) — Herald knowledge desk / town page Houses block — significance: notable
SLOTS: {settlement}, {house}
AUDIENCE: public
1. {house} keeps its counting-house at {settlement} and no longer keeps its custom; the stamp is worth nothing at any quay.
2. Two courts hold the same evidence against {house}, and neither will take its word at any price.
3. The factors of {house} scatter to other counters; the name stays on the door and does nothing.
4. It sold one story too many. The market remembers the last one.
5. The counter at {settlement} is open, lit, and empty; the quay walks past it out of habit now.
6. A name takes a generation to make and a season to spend, and the quays have the arithmetic by heart.

### house_served_both (IN-3; the both-sides fixture's public beat) `[POOL HANDLE]` — Herald knowledge desk / town page Houses block — significance: notable
SLOTS: {settlement}, {counterpart}, {house}, {season}
AUDIENCE: public
1. {house} fed {settlement} and {counterpart} in the same {season} and called it business; both courts hold the ledger now.
2. What was neutrality on the day it was done is betrayal in two courts at once.
3. {house}'s clerks kept both files in one room, and the exposure opened the room.
4. It served everyone honestly, which is its own kind of treason.
5. The fees are entered from both courts in the same quarter, and the quarter is what damns it.
6. Neither court will buy from {house} again, and both will go on using what they bought.

### plant_refused_too_hot (IN-3; the `too_hot` addition to PLANT_REFUSALS — QUERY_REFUSALS untouched) — the patron's DM intelligence block / town page Houses block — significance: routine
SLOTS: {settlement}, {counterpart}, {house}, {faction}
AUDIENCE: dm-only
1. {house} returned {faction}'s coin: {counterpart}'s gates are toothed this season, and the blowback prices above the fee.
2. The commission is refused and the refusal is entered — {house} will not sell into a swept court.
3. The broker at {settlement} names the risk and not the scruple; he would take the same work in a quieter year.
4. Too hot, said the ledger, and the ledger is the conscience.
5. The refusal is entered with its date and its reason; {house} keeps a record of the work it does not take.
6. The brokers at {settlement} all know which courts are toothed this season, and they price accordingly.
7. {faction} will find a cheaper house and a worse one, and will get what it pays for.
8. In a quieter year the same commission would have been taken before the coin was counted.
9. He heard the whole proposal out, courteously, and then pushed the purse back.

---

## IN-4 — THE ROAD (couriers, double agents, and the race)

### courier_delivered (IN-4 errand endings `delivered`) — Herald knowledge desk (DM projection) / town page comings-and-goings — significance: routine
SLOTS: {settlement}, {counterpart}, {npc}, {route}, {band}
AUDIENCE: dm-only
1. The packet out of {settlement} reached {counterpart} in {band} weeks, and what it holds was true when it left.
2. {npc} came in off the {route} road with the seal unbroken and the news a season old.
3. The sale closes at the gate: the cargo is handed over, aged exactly as the road aged it.
4. It arrived. It arrived late, as everything does.
5. The receipt is signed at {counterpart}'s gate: one packet, seals whole, entered against the fee.
6. The gatehouse at {counterpart} sees him in and does not look twice; he has ridden this in before.
7. {band} weeks of the {route} road, fords and tolls, and nothing to report but the going.
8. He rode ahead of the winter and got in before the roads closed.
9. The news is old. It is also exactly what was sold.

### courier_intercepted (IN-4 errand endings `intercepted`) — Herald knowledge desk (DM projection) — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {faction}, {route}
AUDIENCE: dm-only
1. {npc} was taken on the {route} road with {faction}'s cargo; what {counterpart} paid for will not arrive.
2. The packet is in {settlement}'s hands, and the buyer's court is still waiting at the gate.
3. {counterpart} reads the silence and draws its own conclusions — most of them wrong.
4. The word was worth taking. That is why it was taken.
5. The packet is entered in {settlement}'s book as taken on the road, and the fee is entered as forfeit.
6. They took him at the ford where everyone is taken, as the {route} road has known for years.

### courier_lost (IN-4 errand endings `lost`) — Herald knowledge desk (DM projection) — significance: routine
SLOTS: {settlement}, {counterpart}, {npc}, {house}, {route}
AUDIENCE: dm-only
1. Nothing came off the {route} road this season; {npc} and the cargo are both unaccounted for at {counterpart}.
2. The sale is void and the coin is spent — {house} will argue the point for a year.
3. Winter, water, or a bad turning: the file at {settlement} says only that it did not arrive.
4. He went out with a packet and did not come in. The road keeps some.
5. {house} enters the cargo unaccounted and leaves the line open, as the custom is for a year and a day.
6. They ask after him at every inn on the {route} road, and the innkeepers all give the same nothing.
7. {counterpart} will act on what it does not have, which is the expensive way to act.
8. The passes closed behind him and opened in front of nobody.
9. His horse was sold at a market that cannot say who brought it in.

### courier_turned (IN-4 errand endings `turned`; the double agent's detour costs REAL legs) — Herald knowledge desk (DM projection) — significance: notable
SLOTS: {counterpart}, {npc}, {house}, {faction}
AUDIENCE: dm-only
1. {npc} carried {faction}'s cargo to {house} first and to {counterpart} after, and the second telling was not the first.
2. The detour cost a leg, and the leg shows: the packet arrives late, and altered.
3. {house} pays {npc} for the same journey {faction} pays for, and neither patron is being short-changed on the legs.
4. He delivered everything he was asked to. He delivered it twice.
5. The legs are in the book and the book is honest; it is the cargo that changed between them.
6. Everything {faction} has had by that hand must be read again, and there is a great deal of it.

### race_person (IN-4; the built RACE_OUTCOMES token `person`) — Herald knowledge desk / rumor mill — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {route}
AUDIENCE: public
1. He reached the gate before his story did.
2. {npc} came into {settlement} ahead of any word out of {counterpart}, and the council heard it from a mouth and not a market.
3. The gate opened on the man himself; whatever {settlement} decides, it decides on his own account.
4. No rumour was waiting for him. He got to tell it his way, which is rarer than it sounds.
5. The {route} road was kind, and the winter was kinder to riders than to talk.
6. The market at {settlement} heard it from a man standing in it, which is not how markets usually hear anything.

### race_story (IN-4; the built RACE_OUTCOMES token `story`) — Herald knowledge desk / rumor mill — significance: notable; major-eligible per J-INF-8 where the race decides a succession or a peace
SLOTS: {settlement}, {counterpart}, {npc}, {band}, {season}
AUDIENCE: public
1. The tale wore the road faster than the man; the gate was answered before he knocked.
2. {settlement} had the story of {counterpart} a season before {npc} arrived to correct it, and the gate was already set against him.
3. What reached {settlement} first came by many mouths and no name; what came second came by one man with everything to lose.
4. The council had decided before he was in sight, and his account is filed as a correction.
5. Word travels light. Men travel with baggage.
6. By {season} the story stood at {band} in every tavern at {settlement}; the man himself is a late witness to it.

### race_together (IN-4; the built RACE_OUTCOMES token `together`) — Herald knowledge desk / rumor mill — significance: routine
SLOTS: {settlement}, {counterpart}, {npc}
AUDIENCE: public
1. {npc} and the word out of {counterpart} came into {settlement} the same week, and each proved the other.
2. The tale was at the gate and the man behind it; corroboration is cheap when it arrives on time.
3. {settlement}'s clerks had two accounts of one thing and no reason to choose, so they kept both.
4. He told them what they had just heard, which is the best a man can do.
5. The clerks enter both accounts on the same day and note that they agree, which is worth entering.
6. The market at {settlement} heard it twice in a morning and traded on it by noon.
7. {settlement} will decide quickly, and quickly is what corroboration buys.
8. He passed the carters carrying it on the last stretch of road and came in beside them.
9. The word and the man agreed. It happens, and it is never remembered.

> **`race_neither` — NO POOL, BY LAW.** J-INF-5: the trivial race is silent;
> `neither` mints no beat. An authored pool here would be a defect, not depth.

### race_market_moved (IN-4; the INFO×TRADE who-knew-first coupling) — Herald knowledge desk / rumor mill — significance: notable
SLOTS: {settlement}, {house}, {good}, {band}
AUDIENCE: public
1. Word of the fall reached the market a day before the survivors did; the grain was gone by the time they told it.
2. {good} at {settlement} moved {band} before any column came in sight of the walls; someone had the road's word early.
3. The factors of {house} bought on rumour and sold on confirmation, and the difference is written in their books.
4. The market had it first. The market usually does, and is usually right about the wrong thing.
5. The stalls at {settlement} closed early and nobody would say why; by evening everyone could.
6. The price never came back, and the men who moved first are the only ones the season made rich.

### word_came_too_late (IN-4; THE TRUTH THAT ARRIVED TOO LATE — the wave's jewel, pinned) `[POOL HANDLE]` — Herald knowledge desk / town chronicle — significance: notable
SLOTS: {settlement}, {counterpart}, {npc}, {reason}
AUDIENCE: public
1. The word clearing {npc} reached {settlement} after the seat had already ruled on the story, and the hours between are in the record.
2. {counterpart}'s letter came in on the evening tide; the gate had been answered at noon.
3. Both tellings are filed together at {settlement} — the false one first, and the true one under it.
4. The seat acted on {reason} and learned better in a fortnight; the acting cannot be taken back.
5. Nobody lied. The road did the rest.
6. The clearing letter is entered with its hour, and the hour is after the ruling's — the clerks were careful to write both.

---

## IN-5 — THE VOICE (the hums, the arc, the joins)

> **THE SEALED-GATES HUM** named in IN-5(c) is IN-0d's `hide_toll_hum` above —
> ONE pool, routed to the knowledge desk by this wave. Authoring a second
> sealed-gates pool would be the family-rule violation the floor exists to catch.

### hum_old_lie (IN-5; the bluff still believed) `[POOL HANDLE]` — Herald knowledge desk — significance: routine
SLOTS: {settlement}, {counterpart}, {band}
AUDIENCE: public
1. The lie is old enough now that men who repeat it believe they saw it.
2. The tale of {counterpart}'s garrison is told at {settlement} by men who were not born when it was made.
3. It is in the ballads at {settlement} now, which is a kind of proof to everyone but the clerks.
4. Nobody remembers who first said it. That is how it stopped being questioned.
5. {settlement} has reckoned {counterpart} at {band} for so long that the reckoning has outlived the reason for it.
6. The chancery at {settlement} carries the old reckoning of {counterpart} forward each year, copied by clerks who never saw the source.
7. Ask in the market at {settlement} how strong {counterpart} stands and you will be told, confidently, and told wrong.
8. Whatever {settlement} does about {counterpart}, it does on a page written to deceive somebody long since gone.
9. An old factor at {settlement} remembers who told him. He does not remember why he believed it.

### hum_divergence_drift (IN-5; a court's picture a band and a season wrong) `[POOL HANDLE]` — Herald knowledge desk (DM projection) — significance: routine
SLOTS: {settlement}, {counterpart}, {band}, {season}, {route}
AUDIENCE: dm-only
1. {settlement}'s picture of {counterpart} is {band} off and a season stale, and nothing has come along {route} to correct it.
2. The council speaks of {counterpart} as it stood at the last accounting, and the last accounting was a year ago.
3. What {settlement} holds of {counterpart}, and what {counterpart} is, have been drifting apart quietly since {season}.
4. Nobody is wrong on purpose. Everybody is working from old paper.
5. The file on {counterpart} at {settlement} is neat, current in its hand, and {band} out of date in its contents.
6. The talk at {settlement} describes a {counterpart} that stopped existing a year ago.
7. The next thing decided about {counterpart} will be decided from this file, and the file is wrong.
8. Nobody has come off the {route} road with a correction, because nobody has come off it at all.
9. The picture was true once. Nothing has happened to it since, which is the trouble.

### hum_standing_watch (IN-5; the quiet phase the arc is made of) `[POOL HANDLE]` — Herald knowledge desk (DM projection) / Watch panel — significance: routine
SLOTS: {settlement}, {counterpart}, {faction}, {npc}
AUDIENCE: dm-only
1. Someone at {settlement} counts the gate traffic every market day and is paid for it out of {counterpart}.
2. The watching goes on; nothing has come of it this season, and nothing has gone wrong with it either.
3. {faction}'s file on {settlement} grows a page a month — musters, tolls, and who dines with whom.
4. Nothing happened at {settlement} this season. It was carefully noted.
5. {npc} has sent the same dull report a year running, and the dullness is the value.
6. The quarterly return out of {settlement} is entered, read, and shelved; the shelf is where most watching ends.
7. He buys his bread where the gate men buy theirs, and has for years.
8. Through the harvest and through the hungry months the reports came, all of them dull, all of them on time.
9. One season this will matter. The other seasons are what it costs.

### court_sat_still (IN-5; the inaction receipt — significance-gated, minted sparingly) — Herald knowledge desk — significance: notable
SLOTS: {settlement}, {counterpart}, {season}, {reason}
AUDIENCE: public
1. The court knew, and sat still; the knowing is part of the account now.
2. {settlement}'s council had corroborated word of {counterpart}'s muster and passed to the next business.
3. The warning was read into the record at {settlement} and answered with nothing — no levy, no letter, no gate order.
4. They had the word in {season}, and the record shows what was done with it, which is nothing.
5. It was not ignorance. It was a choice, and it is written down under {reason}.
6. The commons at {settlement} learned later that the seat had the word first, and that is the part they repeat.

### arc_opened (IN-5; the composed arc's head line — a COMPOSER over receipts, no arc state) `[POOL HANDLE]` — town chronicle — significance: routine
SLOTS: {settlement}, {counterpart}, {faction}, {npc}
AUDIENCE: dm-only
1. It began with a retainer at {settlement} that nobody entered under a name.
2. The story of {faction}'s eyes at {settlement} starts, as these do, with a man well placed and short of money.
3. Before there was a sweep or a burning at {settlement}, there was a quiet arrangement and years of nothing.
4. This is the account of what {counterpart} knew of {settlement}, and how it came to know it.
5. {npc} kept his post at {settlement} for years, and for most of them he was simply good at it.
6. The first entry is a payment under a heading that means nothing, in a book {settlement} never reads.
7. Nothing began on the quay at {settlement}. That is the point of where it began.
8. It opens in a dull year, between wars, when nobody at {settlement} was looking for anyone.
9. A gate clerk was short of money in a bad winter, and a man he half knew was kind to him.

### arc_close_burned (IN-5; the arc's close on IN-3's `burned`) `[POOL HANDLE]` — town chronicle — significance: notable; major-eligible per J-INF-8 at war stakes
SLOTS: {settlement}, {faction}, {npc}
AUDIENCE: public
1. It ended at the gate it began at: the name is public, the post is empty, and {faction} is blind at {settlement} again.
2. {faction} must build it all again at {settlement}, and the town is watching this time.
3. From the first retainer to the last search, the whole arrangement is a line in {settlement}'s book now.
4. {npc} was useful for a long while. He was found out in a week.
5. {settlement} tells the ending and not the years before it, which is how these accounts survive at all.
6. The book at {settlement} closes the line with a name in it, and a named line is a finished one.

### arc_close_withdrawn (IN-5; the arc's close on IN-3's `withdrawn` — A DECISION, J-INF-16) `[POOL HANDLE]` — town chronicle — significance: routine
SLOTS: {settlement}, {faction}
AUDIENCE: dm-only
1. {faction} closed the arrangement at {settlement} before the sweep reached it; the account ends on a decision, not a discovery.
2. The eyes came home. Nothing was proved, nothing was lost, and nothing further will be learned.
3. The last entry is an order and a date — the cheapest ending these accounts allow.
4. They stopped watching. They chose to, which is rare.
5. The last line in the account is an order, a date, and a sum that stops.
6. Nobody at {settlement} marked the ending, which is what a clean ending looks like.
7. {faction} keeps the name, the road, and the knowing of how it was done — the arrangement can be made again.
8. They closed it before the sweep and before the winter, and both arrived to find nothing.
9. It ends on a decision. Almost none of them do.

### arc_close_gone_quiet (IN-5; the arc's close on IN-3's `gone_quiet` — AN UNRESOLVED FADE, J-INF-16) `[POOL HANDLE]` — town chronicle — significance: routine
SLOTS: {settlement}, {faction}, {npc}
AUDIENCE: dm-only
1. The reports out of {settlement} thinned and stopped; the file stays open because nobody can say it is closed.
2. No burning, no recall — {faction}'s clerks go on paying {npc}'s retainer into a silence.
3. The account has no ending, only a last page with a date on it.
4. Something happened at {settlement}, or nothing did. The record cannot tell them which.
5. The file is neither closed nor current; a clerk writes the date each quarter and nothing beside it.
6. At {settlement} he is still at his post, and the post tells {faction} nothing at all now.
7. {faction} will not know whether it was fear or conscience until it tries again, and perhaps not then.
8. The silence began in one season and became a habit in the next.
9. An account that stops is not an account that ends.

### arc_close_turned (IN-5; the arc's close on IN-4's `turned` — the fourth closed token) `[POOL HANDLE]` — town chronicle — significance: notable
SLOTS: {settlement}, {counterpart}, {faction}, {npc}
AUDIENCE: dm-only
1. The eyes at {settlement} were {counterpart}'s for a season before anyone at {faction} thought to ask.
2. Every report {faction} filed for a year was read at {counterpart} first, and shaped before it travelled on.
3. The arrangement did not end; it changed hands, which is worse and cheaper.
4. {npc} never stopped reporting. He only stopped reporting to them.
5. The file runs on unbroken, in the same hand, at the same intervals, serving another court entirely.
6. {faction} will act on a year of shaped reports before it thinks to test one.

### scandal_join (IN-5(d); the cause-walk from the standing `corruption_exposed` condition to the fall) `[POOL HANDLE]` — Herald knowledge desk / town chronicle — significance: notable
SLOTS: {settlement}, {faction}, {house}, {reason}, {season}
AUDIENCE: public
1. The house that fell at {settlement} this season had been named a year before, in a matter nobody pursued.
2. {faction}'s seat is emptied on {reason}, and the condition that named it has stood on the record since {season}.
3. The turn at {settlement} surprised the chronicle and not the file — the exposure was there to read.
4. Everyone acted shocked. The evidence had been public for a year.
5. {house} was compromised in the open, and it took a season for anyone to act on the reading.
6. The fall is entered this season and the naming a year before it; anyone reading both sees the seat chose the delay.

---

## IN-6 — THE MEASURE
No phrased kinds. IN-6 is instruments, envelopes, and certification rows — it
grades these pools (the endings envelopes) and the SP-6 PHRASE-REPETITION
instrument measures their variety on every soak. **Every endings token named in
any §5 Endings block has a pool above, except `race_neither`, which is silent by
J-INF-5.** The reconciliation is the check IN-6's envelope list already demands
in the other direction.

---

## AUTHORING NOTES FOR SOL (and for the chair)
1. **Variant 1 is the volume's own sentence wherever the volume has one** (§8 and
   the §5 Receipts lines). Twenty-one kinds carry a verbatim (or slot-fitted
   verbatim) exemplar as variant 1; the rest open on a plain-event variant.
2. **The pools are seeded per entity**, per SP-6's WAR_RECEIPTS shape — same seed,
   same sentence, forever (THE PROMISE). Selection is a keyed fork per the
   volume's stream-theft discipline (`plant:<plantId>`, `sweep:<settlementId>`,
   `race:<arrivalId>`), never an unkeyed draw.
3. **`[POOL HANDLE]`** marks a block whose kind id is this annex's, not the
   volume's — the volume describes the beat without naming a kind. Reconcile the
   id against the real WHAT_PHRASES + heraldRouting registration at mint time
   (§1c's MINT-TIME REGISTRATION RULE); do not treat these ids as registered
   tokens.
4. **Two slots are volume-local extensions**, declared in the header and flagged
   here: `{place}` (a third named settlement) and `{season}`. Both are forced by
   exemplars the volume already carries.
5. **The wealth and devotion lure pools are BLOCKED** on SP-2's BELIEVED
   SCARCITY / CONDITIONS / DEVOTION families. They are authored here so nothing
   re-opens when SP-2 lands; they must not ship ahead of the axes.
6. **`lure_resisted` / `lure_exposed_first` / `lure_backfired` are bait-neutral**
   by deliberate choice. When SP-2's families land, each needs a bait-appropriate
   sub-pool at the same four-variant floor — recorded deferral, not an omission.
   That deferral now inherits the AMENDED floor of note 7, not the original four.
7. **THE FREQUENCY-SCALED FLOOR (amendment, 2026-08-03).** SP-6's four-variant
   floor is a floor, not a target: a kind a player meets every few ticks wears
   out at four. Under the amendment a CHRONIC/routine kind carries eight to
   twelve angle-distinct variants, a NOTABLE kind at least six, and a
   MAJOR/rare kind at least four. Every chronic kind in this annex now stands at
   eight or more and every notable kind at six or more; the deepening was
   APPENDED IN PLACE, so existing variant numbers are unchanged and every
   volume exemplar keeps its position as variant 1. Slot-swaps still do not
   count — each added variant takes a different angle from the widened palette
   in the header. NO pool in this annex now sits below the amended floor: the
   blocked wealth and devotion sub-pools (note 5) were raised to the notable
   floor with the rest, so that when SP-2 lands they ship at depth rather than
   re-opening. The only outstanding work is note 6's — sub-pools that do not
   yet exist, which must be authored at the amended floor when the axes land.
