# RECEIPT POOLS — FP-GRAMMAR (the pact grammar's seeded variant corpus)

## Fable 5 content authoring, 2026-08-02; DEEPENED 2026-08-03 to the spine's
## FREQUENCY-SCALED floor. Annex to `docs/DESIGN_FP_GRAMMAR.md`, discharging the
## SP-6 CONTENT-DEPTH FLOOR (`DESIGN_FP_SPINE.md` §2 SP-6): **every phrased kind
## ships a seeded variant pool sized to how often a reader meets it — chronic and
## routine kinds at EIGHT to TWELVE angle-distinct templates, notable kinds at SIX
## or more, major and rare kinds at FOUR or more**, each a different STRUCTURE AND
## ANGLE — the volume's exemplar sentence is the
## pool's FIRST member, never its whole. The volumes spec kinds; this file is the
## content. Shape follows the war volume's `WAR_RECEIPTS`
## (`src/domain/worldPulse/eventProse.js:189`): per-kind pools, seeded per entity
## so same-seed worlds keep their sentences.

**Status: CONTENT. Nothing here schedules a wave. Where this annex and
DESIGN_FP_GRAMMAR.md disagree about a kind's existence, wave, or audience, the
volume wins and the disagreement is a bug to report. Where this annex and
DESIGN_FP_SPINE.md disagree about the floor, the spine wins.**

---

## THE SLOT CONVENTION

No template ever bakes a proper noun or a rendered count. Every name and every
cause is a slot, filled at render from the receipt's own address chain (NEWS
ADDRESS LAW: full address chain + typed action + settlements BY NAME + the
recorded reason).

**Canonical slots (corpus-wide):** `{settlement}` `{counterpart}` `{npc}`
`{faction}` `{house}` `{temple}` `{band}` `{reason}` `{good}` `{route}`

**Volume-local slots (DECLARED here, three, each filled from a CLOSED engine
vocabulary — never free text):**

| Slot | Fill | Source |
|---|---|---|
| `{term}` | a term family or type word ("the tribute", "the passage", "the grain term") | `TERM_CATALOG` (frozen; `peaceTerms.js:164-188`, moving to `termCatalog.js` at GR-3) |
| `{trigger}` | one of the closed five formation triggers | `pactProposals` trigger vocabulary (§4). **Never an inline fill:** the trigger SELECTS which `trigger_reason.*` pool the `{reason}` slot draws from. Declared here because the receipt field exists and a future kind may render it directly. |
| `{war}` | the war record's own name | the war ledger |

**Repeated slots bind in order.** `{npc} of {settlement} and {npc} of
{counterpart}` fills the first `{npc}` from the first party's oath stamp and the
second from the second's. In the GR-6 mediation blocks `{settlement}` is ALWAYS
the broker and the two `{counterpart}` fills are the quarrelling pair, in the
receipt's own party order.

## THE HARD CONSTRAINTS THIS FILE IS WRITTEN UNDER

1. **NO DIGITS.** Quantities speak only in band words (`QUANTITY_BANDS`,
   `demographicsHerald.js:58` — "a few souls", "dozens", "many hundreds"; plus
   the band vocabularies "a handful", "a score", "many", "most", "more than
   once"). Ages, lineage depth, and strike counts are `{band}` fills, never
   rendered integers, and never spelled-out exact numbers either.
   `two` / `both` appear ONLY as the structure of a bilateral instrument (law
   I: pairwise only), never as a count read off state.
2. **HEADLINE HONESTY (R-28).** Every verb here is entailable by the receipt's
   own facts. A detection line says what a monitor SAW; a lapse line says what
   the ledger RECORDS; nothing asserts more than the state carries.
3. **BELIEF ATTRIBUTION.** Belief-side content — every formation trigger, every
   market read, every neighbour's opinion — carries its attribution ("the word
   is", "it is said", "they say", "believes"). Nothing believed is stated as
   engine truth.
4. **LAW ONE.** No line confirms that a god acted (temples and believers act;
   "the temple called it wrath", never "the god struck"). No line resolves or
   states a named person's fate — a fallen oath-holder is OUT OF THE SEAT, never
   dead. See RESOLVED AMBIGUITIES (2) for the exemplar this changed.
5. **COVERT DISCIPLINE.** DM-only pools carry `AUDIENCE: dm-only` and are
   projected behind `includeGroundTruth`. Every other pool is the PUBLIC variant.
6. **THE FAMILY RULE.** Variants differing only in slot fills count as ONE for
   the floor. Each pool below walks the angle palette — the event plain · the
   street's view · the ledger's/institution's view · the consequence forward ·
   the understatement or the quiet irony. The 2026-08-03 deepening WIDENED the
   palette to carry the taller floors: · the traveller's report (what an
   outsider on the road saw) · the season's frame (the beat placed in the year)
   · the small human detail (one clerk, one roof, one room set aside). The
   authoring rule was that each appended variant take an angle its own pool did
   not already hold; the MEASURED proxy for that rule is the family-rule
   similarity ceiling in the coverage ledger, which the deepened corpus clears
   at 0.24. Angle distinctness itself is an authored judgment, not a machine
   result, and is stated here as such.
7. **LENGTH.** One to two clauses. A receipt is a chronicle line, not a
   paragraph.

**Significance classes** are SP-6a assignments (`routine` / `notable` / `major`),
not a scale this file mints. Dossier lines and DM chips are not Herald kinds and
carry `significance: n/a (dossier line)`.

## RESOLVED AMBIGUITIES (recorded, vetoable — see the tail of this file for the
## full register)

1. **"Exemplar verbatim" vs the slot and digit laws.** The volume's exemplars are
   prose about a world; a pool member is a template. Where the exemplar bakes a
   name ("the peace of the two rivers") or a count ("twenty years", "a hundred
   families", "twice now"), variant 1 is the exemplar VERBATIM MODULO SLOTTING —
   the minimal transformation that satisfies constraints (1) and (2), which are
   estate law and outrank the verbatim instruction. Every such case is marked
   `[exemplar, slotted]`.
2. **Law One over two exemplars.** GR-0's "no man now living signed it" and
   GR-1's "Signed by two men now dead" both RESOLVE NAMED FATES. Rewritten to
   speak of seats, which the receipt actually records: "no hand that signed it
   still holds a seat". Marked `[exemplar, Law One]`.
3. **Ordinals are band fills.** GR-5's "the third peace of this name" renders as
   a `{band}` fill from the lineage-depth band ("not the first", "another",
   "many times over"), never an integer.

---

# GR-0 — THE LIFECYCLE VOICE (flag `treatyLifecycleVoiceEnabled`)

### treaty_lapsed (GR-0) — Herald / chronicle (the eulogy) — significance: notable
SLOTS: {settlement} {counterpart} {band} {term}
AUDIENCE: public
1. The peace of {settlement} and {counterpart} has run its course — {band} years, and no hand that signed it still holds a seat. `[exemplar, slotted + Law One]`
2. The {term} {settlement} and {counterpart} kept between them came to its last day and was filed as closed; neither court sent word, and the clerks who closed it were the only ones who marked it.
3. In {settlement} the market kept its hours as always; the pact with {counterpart} ended that week, and the carters heard of it after the clerks.
4. {settlement} and {counterpart} are bound by nothing now — the {term} ran out, and neither court asked for another.
5. It was written for {band} years and it kept every one of them; both courts let it go without a word.
6. A carter out of {counterpart} asked the gate clerks for the {term} and learned there was nothing left to ask for.
7. It ended at the turn of the year, in a season when neither court had anyone watching the parchment.

### treaty_lapsed.road_open (GR-0) — chronicle (the lapse beat's warning clause) — significance: notable
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. The {route} between {settlement} and {counterpart} is open again, to anything. `[exemplar, slotted]`
2. Nothing written stands between the two courts now; what comes next is nobody's to forbid.
3. The captains in {settlement} marked the week the pact lapsed and said nothing further.
4. No oath forbids a march between {settlement} and {counterpart} — not since the spring.
5. Where a treaty stood there is now distance and habit.
6. The first caravan down the {route} this spring travelled without a writ, and nobody at either gate asked for one.
7. Merchants in {settlement} have begun hiring their own guards for the {counterpart} road.

### treaty_default_detected (GR-0) — Herald / chronicle — significance: notable
SLOTS: {settlement} {counterpart} {band} {term}
AUDIENCE: public
1. The tribute came light, and this time the court noticed. `[exemplar]`
2. {settlement}'s clerks weighed what arrived from {counterpart} against what was promised, and the ledger would not close.
3. The wagons from {counterpart} have been coming short; the carters on the quays were saying so before the court would.
4. What {counterpart} owes under the {term} has run thin for {band} seasons, and {settlement} has begun to keep the count.
5. Nothing was refused and nothing was delivered; the court of {settlement} has entered it as default.
6. A factor down from {counterpart} was asked at the {settlement} table why the wagons ran light, and had no answer ready.
7. Each season the shortfall was small enough to overlook; taken together, {band} of them would not be.

### treaty_disclosure_opened (GR-0) — Herald (trade desk) / chronicle — significance: notable
SLOTS: {settlement} {counterpart} {band} {term} {route}
AUDIENCE: public
1. The article is plain: what {counterpart} learns, {settlement} is told, for as long as the {term} stands. `[exemplar, slotted]`
2. {settlement}'s clerks sit in {counterpart}'s muster hall by treaty right, and the doors were not {counterpart}'s to shut.
3. They signed away the closed door along with the border, and the second cost more.
4. At {counterpart} they call it the open article, and they do not say it kindly.
5. For {band} years nothing {counterpart} learns will be its own for long.
6. Down the {route} the sealed copies travel to {settlement}, and {counterpart}'s clerks make no error the article can catch.
7. The gate keeps its hours; what passes through it in writing is no longer anyone's secret.

### treaty_age_line (GR-0) — dossier: WarFaithTab / TreatyPanel / PDF — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. {band} years this peace has held. `[exemplar, slotted]`
2. Signed before most of the traders in the market were born, and still in force.
3. It has outlasted many a lean harvest in {settlement} and in {counterpart}, and not a word of it has changed.
4. The parchment is soft at the folds; the terms are kept.
5. Young yet, as treaties go — the ink is barely set, and neither court has been tested.
6. The clerks recopy it when the ink fades, and nothing in the wording has ever changed in the recopying.
7. Old enough that the roads it opened are simply the roads now.
8. Sworn in a year the elders in {counterpart} still name for its winter, and kept every year since.

### treaty_priced_on_a_lie (GR-0 × FP-INFORMATION) — Herald / chronicle — significance: major
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The peace was priced on a lie, and now the lie is out. `[exemplar]`
2. The peace of {settlement} and {counterpart} was struck on a strength that was never there; the word is out, and the terms read differently by it.
3. What {settlement} paid, it paid against a muster {counterpart} had invented — the clerks have the old sheet out again.
4. It is said in both courts that the treaty was bought with a false count; nobody is calling it void, and nobody is calling it fair.
5. The lie is known and the terms it purchased still stand. That is the whole of the injury.

### treaty_true_state_chip (GR-0) — TreatyPanel, behind `includeGroundTruth` — significance: n/a (DM chip)
SLOTS: {settlement} {counterpart} {band} {term}
AUDIENCE: dm-only
1. On parchment the {term} is honored; in fact {settlement} has sent less than it swore for {band} seasons, and nobody across the border has weighed it.
2. Kept in name. {settlement} throttles it quietly, and {counterpart}'s watchers sit too far off to tell.
3. The court of {counterpart} holds this term sound. It is not.
4. The shortfall is real and unseen — a quiet default, running since the turn of the year.
5. Honored on every surface a free eye can reach. The truth of it is short wagons.
6. The breach began small and has widened every season; nothing in {counterpart}'s reach can measure it.
7. {settlement} knows exactly what it is withholding. The figure is kept by one clerk and shown to nobody.
8. If {counterpart} ever sends a weigher to the border, the {term} fails that week.

### ran_its_term (GR-0) — pact ending (endings vocabulary) — significance: routine
SLOTS: {settlement} {counterpart} {term}
AUDIENCE: public
1. It ran its term and ended on the day it said it would.
2. The {term} expired at its own date; nothing was broken to end it.
3. In {settlement} the pact's last season passed without remark, and then the term was simply over.
4. Ended by the calendar and not by anger; {settlement} and {counterpart} are quit of it, and of each other's ledgers.
5. It kept its word to the last week and then stopped being law.
6. The clerks in {settlement} closed the entry, dated it, and shelved the parchment with the others that ran out.
7. The last delivery under the {term} went out in autumn, and after that there was simply nothing owed.
8. Neither court marked the day; in {counterpart} the season's work went on exactly as before.

### hollowed_detected (GR-0) — pact ending — significance: notable
SLOTS: {settlement} {counterpart} {term}
AUDIENCE: public
1. Hollowed and found out: the {term} was kept on parchment and nowhere else.
2. {counterpart} let it fail by inches until {settlement} weighed the difference and named it default.
3. The court called it default; the carters had been calling it that a season earlier.
4. Nothing was repudiated. It was simply not done, and then it was seen.
5. It died of short wagons, and the ledger says so.
6. What arrived under the {term} had been shrinking for seasons, and {settlement} has finally weighed a year against a year.
7. No herald in {counterpart} announced a breach; the granaries in {settlement} announced it.

### hollowed_quiet (GR-0) — pact ending, ground-truth surfaces only — significance: routine
SLOTS: {settlement} {counterpart} {term}
AUDIENCE: dm-only
1. Hollowed and never noticed: the {term} lapsed with its obligations unmet and no court the wiser.
2. {settlement} stopped sending; {counterpart} never had the reach to know it.
3. It reads honored on every public surface, and it was not.
4. The default was real, the detection never came, and the pact ended in good standing.
5. {counterpart}'s clerks entered every season as met, because nobody there ever went to look.
6. The last wagons under the {term} went out long before the parchment expired; the gap is in nobody's book.
7. It will be remembered in both towns as a peace that was kept.
8. Whatever {settlement} saved by not sending, it kept, and no one has ever asked after it.

---

# GR-1 — THE OATH-HOLDER IDENTITY (flag `oathHolderEnabled`)

### oath_stamp.person (GR-1) — dossier signature line: WarFaithTab / TreatyPanel / PDF — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. {npc} of {settlement} and {npc} of {counterpart} set their names to it. `[exemplar, slotted]`
2. Sworn by {npc} for {settlement} — the seal is his own, and not the seat's.
3. It is {npc}'s peace, and the market calls it that when it speaks of it at all.
4. {npc} put a hand to it in {settlement}; whoever sits there after answers for the hand.
5. Two names, one parchment, and no other word in it.
6. The signature is {npc}'s, and it was witnessed in {settlement}'s hall by whoever the court could seat that day.
7. A personal oath binds a person: it is a question again the day {npc} leaves the seat.
8. Ask in {counterpart} who swore it and the answer is a name, not an office.

### oath_stamp.seat (GR-1) — dossier signature line, unstamped / legacy / no holder resolved — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The seat swore it, and the seat keeps it.
2. No name is set to this one; it binds the chair in {settlement}, whoever warms it.
3. It was sworn by the office and not the man — older than the present court's memory.
4. The parchment names {settlement} and {counterpart}, and nobody else.
5. Whoever holds the seat has inherited it, unasked.
6. The clerks can say which court signed it and not which hand; the register keeps towns, not people.
7. It will outlast every man who ever administers it, and it was written to.
8. In {settlement} nobody asks who swore it; the answer is the town, and always has been.

### credit_obligation_sworn (GR-1) — dossier / receipt (generosity `credit` obligations) — significance: routine
SLOTS: {settlement} {counterpart} {npc} {band} {good}
AUDIENCE: public
1. {npc} of {settlement} stood surety for the {good}, and the debt is entered in his name.
2. The obligation is {npc}'s and not the seat's; the books in {settlement} say so plainly.
3. {counterpart} took the {good} on one man's word, and the word was given in front of the market.
4. A debt outlasts the hand that gave it: whoever answers for {npc}'s house answers for this.
5. Sworn, sealed, and owed — {band} seasons to the maturity.
6. The {good} moved on a promise and not a payment, and the promise is what {settlement}'s books actually hold.
7. If {npc} leaves the seat before the term is out, the debt does not leave with him.
8. On the quays in {counterpart} they price the {good} and then they price the name behind it.

### treaty_lapsed.outlived_its_swearers (GR-1 × GR-0) — chronicle (the stamped eulogy) — significance: notable
SLOTS: {settlement} {counterpart} {npc} {band}
AUDIENCE: public
1. Sworn by {npc} and {npc}, and it outlasted both their seats. `[exemplar, Law One]`
2. Neither {settlement} nor {counterpart} is led by the hand that signed it, and the parchment held anyway.
3. The men who swore for {settlement} and {counterpart} are out of the chair; the terms stayed on the table.
4. It was a personal oath and it survived the persons — the clerks kept it going out of habit.
5. {band} seats have turned over since the ink dried, and nobody ever asked whether it still bound.
6. The last clerk in {settlement} who remembered the signing went home to his village long ago; the terms held after him.
7. It stopped being anybody's peace some while ago and went on being a peace regardless.

---

# GR-2 — PEACETIME FORMATION + THE STANDALONE NAP (flag `pactFormationEnabled`)

### pact_proposed (GR-2) — Herald / chronicle (the offer opened; transport mode recorded) — significance: notable
SLOTS: {settlement} {counterpart} {band} {reason} {route}
AUDIENCE: public
1. An offer has gone from {settlement} to {counterpart}: {reason}, and an answer is owed by spring.
2. {settlement} has asked, and the asking is public — the market in {counterpart} had it before the court did.
3. The court of {settlement} has put terms on paper and entered the date the answer falls due.
4. A rider left {settlement} down the {route} with a sheet of terms; {reason} is what he carries.
5. They have asked. Whether {counterpart} answers at all is another matter, and {band} weeks will tell.
6. The innkeepers on the {route} have seen more riders this month than all last season, and they know what that means.
7. {settlement} has asked in a season when asking is cheap and refusing is not.

### trigger_reason.trade_demand (GR-2) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. The word in {settlement} is that {counterpart} has {good} to spare, and the granaries here run thin.
2. {settlement}'s factors say the {good} is dear at home and cheap across the border, and the court has believed them.
3. It is said {counterpart} sits on more {good} than it can eat. Whether it does is another question.
4. The price of {good} has been the talk of the quays all season, and the court has finally answered the talk.
5. {settlement} wants {good} and believes {counterpart} holds it; the sheet is drawn on that belief and nothing else.
6. A run of lean harvests in {settlement} has made the {good} worth a treaty, and the court says so openly.
7. The {good} crosses in small loads at bad prices, and {settlement}'s court would rather it crossed in wagons.
8. The granary clerks put the shortfall in writing before the season turned, and the terms follow their sheet exactly.

### trigger_reason.faith_communion (GR-2) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart} {temple} {route}
AUDIENCE: public
1. The two towns keep the same feasts, and the temples have begun to say so aloud.
2. {temple} in {settlement} and {temple} in {counterpart} share a rite; the courts have noticed what the priests knew first.
3. The word on both sides of the border is that the faith is one faith, and the parchment would only agree with it.
4. Pilgrims from {counterpart} have worn a path down the {route} to {settlement}'s shrine, and nobody has stopped them yet.
5. The priests of both towns dine together, which the courts have read as creed enough alike to write down.
6. The same hymn is sung on both sides of the border, and the market in {settlement} takes that for kinship.
7. {temple} has been sending its novices to {counterpart} for their training, and nobody in either court arranged it.
8. It is said the two calendars have not disagreed on a feast day in living memory.

### trigger_reason.migration_pressure (GR-2) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart} {band} {route}
AUDIENCE: public
1. They have been crossing for {band} seasons, and both courts have run out of ways not to mention it.
2. The {route} from {counterpart} carries more feet each spring, and {settlement}'s gate clerks keep the tally.
3. It is said in {counterpart} that there is work and bread in {settlement}, and the saying has emptied a village or two.
4. {settlement}'s fields want hands, and the word is that {counterpart} has more mouths than fields; the arrangement writes itself.
5. The crossing happens whether it is lawful or not. The courts propose to make it lawful.
6. The gate house in {settlement} has run out of room in its ledger for the season's crossings.
7. Whole households are on the {route} with their tools on their backs, and they are not turning around.
8. The court would rather write the terms of a movement than pretend it is not happening.

### trigger_reason.shared_threat (GR-2) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart} {faction}
AUDIENCE: public
1. Both courts are watching the same banners, and neither likes the count.
2. {settlement} and {counterpart} name the same enemy in private; the sheet only says it in public.
3. The word from the frontier is that {faction} musters, and two courts have read one rumour the same way.
4. Neither court believes it can hold the pass alone, and that arithmetic is what put terms on the table.
5. They were rivals last spring. They have a nearer worry now.
6. The frontier villages have been moving their grain inside the walls, which no court ordered.
7. It is said {faction} has taken a town to the north the same way it would take one here.
8. The roads dry within the month, and nobody on either side of the border is talking about anything else.

### trigger_reason.renewal (GR-2 ledger, GR-5 occasion) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The terms with {counterpart} run out with the spring, and {settlement} has moved first.
2. The terms expire within the year; {settlement}'s clerks have drawn a new sheet against the old one.
3. Neither court wanted to be the one asking late, so {settlement} asked early.
4. The old bargain fits neither of them now — the balance has moved, and both courts believe it has.
5. The parchment carries a date. {settlement} has read the date.
6. The date is on the parchment and has been all along; this is only the season somebody finally acted on it.
7. {settlement}'s court would rather negotiate a renewal than explain a lapse.
8. The market has been pricing the expiry since midwinter, and the court has come round to the market's view.

### signed (GR-2) — formation ending; Herald (the signing beat) — significance: major
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {good} for {good}: the courts have set their names to it. `[exemplar, slotted]`
2. It is signed — {settlement} sends {good}, {counterpart} sends {good}, and the term runs to a named date.
3. The market in {settlement} had priced the pact before the seals were dry.
4. Neither court gave way and both took something away, which is what a treaty between equals looks like.
5. Signed in peace, and the first wagons move at the turn of the season.

### refused (GR-2) — formation ending; Herald (`pact_refused`) — significance: notable
SLOTS: {settlement} {counterpart} {reason}
AUDIENCE: public
1. They asked, and were refused; the refusal will be remembered. `[exemplar]`
2. {counterpart} weighed {settlement}'s terms and sent them back unsigned, with {reason} written under the seal.
3. The court of {counterpart} said no, and the quays in {settlement} had it before the rider was home.
4. Nothing was broken by the refusal, and nothing was mended.
5. {counterpart} has said no, and the saying is in the book. The next asking will be dearer for it.
6. The rider was fed, thanked, and sent home with the sheet he came with.
7. The recorded cause is {reason}, and in {counterpart} they say that is not the whole of it.

### no_overlap (GR-2) — formation ending (the two-sided conjunction fails) — significance: routine
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. No pact was reached; each court keeps its {good}, and its opinion of the other. `[exemplar, slotted]`
2. The two sheets never met: what {settlement} would give, {counterpart} would not take.
3. They talked past each other for a season and then stopped talking.
4. Both courts valued the same terms and valued them differently. That is the whole of the failure.
5. Nothing signed and nothing spoiled; the riders went home.
6. The clerks in {settlement} filed the correspondence under nothing concluded, which is a thick file.
7. Neither court will say the talks failed; neither will say what else to call them.
8. The envoys ate well in {counterpart} for a season and came home with the {good} still on their own side of the border.

### expired_unanswered (GR-2) — formation ending (silence is an answer) — significance: routine
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. The offer stood to its date and no answer came; silence is an answer.
2. {counterpart} let the sheet sit until the answer fell due, and {settlement}'s clerks closed the entry.
3. In {settlement} they say the rider was never received; in {counterpart} they say no rider came.
4. No refusal was ever spoken, which the court of {settlement} has chosen to remember as one.
5. The terms expired somewhere on the {route}.
6. The clerks in {settlement} entered it as lapsed for want of an answer, which is the driest thing the book can say.
7. Somewhere in {counterpart}'s hall the sheet is still on a table, under other sheets.
8. Innkeepers along the {route} remember the rider going out and nobody coming back the other way.

### nap_signed (GR-2) — Herald (the standalone non-aggression pact) — significance: major
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. Neither shall march on the other — signed in peace, not extracted at a war's end. `[exemplar]`
2. {settlement} and {counterpart} have sworn not to open a war between them, and no war was needed to arrange it.
3. The clerks have entered it plainly: no march, either way, until the term runs out.
4. The captains on both frontiers have been told to stand easy, and the parchment says why.
5. Two neighbours who could have fought have written down that they will not.

### broken_by_war (GR-2 closure) — pact ending — significance: major
SLOTS: {settlement} {counterpart} {war}
AUDIENCE: public
1. {war} ate the peace: every live term between {settlement} and {counterpart} closed with the first march.
2. The terms closed the week {war} opened; nothing was repudiated, and nothing needed to be.
3. In {settlement} the clerks struck out the pact the same day the levy went up.
4. What the courts signed in peace, the war unwrote without a word of breach.
5. They kept the bargain until the marching began.

### term_refused_stacking (GR-2) — receipt (`term_refused_stacking`) — significance: routine
SLOTS: {settlement} {counterpart} {term}
AUDIENCE: public
1. The court would not carry a second undertaking of the same kind; it was set aside with its reason recorded.
2. {settlement} already holds a {term} with {counterpart}; the new sheet's twin was refused and the standing one holds.
3. One promise of a kind is all the parchment will hold, say the clerks, and the rest goes back in the satchel.
4. The term was not dropped and not stacked. It was refused, and the refusal is in the book.
5. The clerks read the new sheet against the old and found the same promise in both.
6. {counterpart} asked for a thing it already had, and was told so politely.
7. The standing {term} was not weakened by the asking, and it was not strengthened either.
8. In {settlement} they say the parchment holds a promise of a kind, and no more of that kind.

### pact_out_of_posture (GR-2) — receipt (the priced out-of-posture act) — significance: notable
SLOTS: {settlement} {counterpart} {house}
AUDIENCE: public
1. {settlement} keeps to itself as a rule and broke the rule to ask {counterpart}; the court paid for the asking at home.
2. A court that keeps its own counsel has put terms to a stranger, and {house} has opinions it is not keeping quiet.
3. It is said in {settlement}'s halls that the seat has grown too fond of foreigners.
4. The proposal went out against the grain of the place, and the price of that is entered where prices are entered.
5. The sheet went out and the murmuring started the same week; {house} has not needed to raise its voice.
6. Whatever the terms buy abroad, some of it is already spent at home.

### refusal_reason.dependency_fear (GR-2) — receipt reason (the counterforce) — significance: routine
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {counterpart} read the same flows and saw a leash: what {settlement} offered would bind it too near.
2. The terms were good, which is exactly what the court of {counterpart} mistrusted.
3. The factors in {counterpart} say a town that eats another's {good} learns to ask permission.
4. Refused for fear of reliance — the same numbers that argued for the pact argued against it.
5. {counterpart}'s court asked what happens to the arrangement in a bad year, and did not like the answer it gave itself.
6. It is said in {counterpart}'s market that the {good} would arrive with a rope attached.
7. The refusal keeps the town poorer and keeps it its own.
8. They say in {counterpart} that they have seen what {settlement}'s other partners look like after a generous season.

### refusal_reason.oathbreaker_credibility (GR-2 × GR-4) — receipt reason — significance: notable
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. They will not treat with {settlement}; the word it broke before is answer enough. `[exemplar, slotted]`
2. {counterpart} looked at what {settlement}'s line has done to the oaths it swore before, and sent the sheet back.
3. The word on {settlement}'s word is bad, and no terms are good enough to mend it.
4. The court of {counterpart} priced the signature and found it worth less than the parchment under it.
5. A house that has disavowed {band} is refused on its history, not on its offer.
6. The terms were never read past the seal in {counterpart}; the seal was the objection.
7. A court that must be trusted before it can be dealt with has one thing to mend, and terms do not mend it.

### refusal_reason.reserve_unmet (GR-2) — receipt reason — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. What was offered fell short of what {counterpart} holds the arrangement to be worth.
2. The sheet did not clear the court's own reckoning — near, and not near enough.
3. In {counterpart}'s market they said the terms were thin, and the court agreed with the market.
4. {settlement} drew the sheet against what it believed {counterpart} would take, and believed wrong.
5. The clerks in {counterpart} weighed what was offered against what was asked and closed the matter.
6. A better sheet would have been signed; this one was not.
7. The refusal is not a quarrel, and {counterpart} has been careful to have it read that way.
8. In {settlement} they say the offer was generous. In {counterpart} they say it was a first offer.

### offer_standing.proposer (GR-2) — dossier: WarFaithTab, proposer's town — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band} {reason} {route}
AUDIENCE: public
1. An offer stands before the court of {counterpart}: {reason}; an answer is owed by spring. `[exemplar, slotted]`
2. {settlement} has asked and waits; the answer falls due before the season turns.
3. The clerks keep a copy of the sheet and the date it must be answered by.
4. Terms went down the {route} {band} weeks ago and nothing has come back.
5. The court has committed itself in writing and can do nothing further until {counterpart} answers.
6. It was sent in good time, and good time is nearly gone.
7. The market here has already priced both answers.
8. The seat asks after the rider most mornings.

### offer_standing.counterparty (GR-2) — dossier: WarFaithTab, counterparty's town — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {house} {reason}
AUDIENCE: public
1. {counterpart} asks: {reason}. The court has not yet answered.
2. A sheet from {counterpart} lies on the table, and {house} is not of one mind with the seat about it.
3. They ask, and the market has already decided what the answer ought to be.
4. An answer is owed before the season turns, and {settlement} has said nothing.
5. The terms have been read aloud in council more than once and voted on never.
6. A refusal costs one thing and a signature costs another, and the court is still weighing which is dearer.
7. {house} would like the matter decided this week; the seat would like it decided later.
8. The sheet is not refused. It is simply still there.

### courts_remember (GR-2 + GR-6) — dossier: WarFaithTab (the turnings archive read) — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. The courts remember: {counterpart} asked here, and was refused.
2. Nothing came of the asking, and the asking is still spoken of in {settlement}.
3. The book of turnings here carries {band} entries, and {counterpart}'s name is among them.
4. {counterpart} has been refused at this table {band}, and the book keeps every one.
5. What was said here is remembered here; the clerks keep the turnings.
6. The clerks can produce the sheet, the date, and the reason, and they enjoy being asked.
7. Envoys from {counterpart} are received courteously here and not quickly.
8. Nothing in the archive obliges the court to anything; it only makes the court hard to surprise.

---

# GR-3 — THE NEW TERM FAMILIES (rides `pactFormationEnabled`, second slice)

### term_granted.missionary_access (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {temple} {route}
AUDIENCE: public
1. The priests of {counterpart} may walk {settlement}'s roads and speak in its squares: it is written. `[exemplar, slotted]`
2. {temple} of {counterpart} has lawful leave to preach in {settlement}, and the leave carries a date.
3. The first legate came down the {route} within the month; the market watched and said little.
4. The doors are open by treaty, which is not the same thing as welcome.
5. {settlement} granted the access; what its own {temple} thinks of it is being said aloud in the squares.
6. Preaching in the square of {settlement} is now a matter of the calendar and not of the watch.
7. The inns along the {route} have taken to keeping a room for clergy out of {counterpart}.

### term_granted.shared_rite (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {temple}
AUDIENCE: public
1. {settlement} and {counterpart} keep one rite by compact, and the calendars in both towns say so.
2. {temple} and {temple} have written their communion down, and the feast days now fall together.
3. Pilgrims have stopped asking which side of the border they are praying on.
4. A shared rite by parchment is still a shared rite.
5. The bells in {settlement} and {counterpart} are rung on the same mornings now, and the sound carries.
6. Priests trained in one town may serve in the other, which the congregations have counted as a relief.

### term_granted.pilgrimage_right (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {temple} {route}
AUDIENCE: public
1. The {route} to {temple} is open to the faithful of {counterpart} by right, and the tolls are named in the same sheet.
2. The road carries pilgrims lawfully now, and the innkeepers along it have raised their rates accordingly.
3. {settlement} guarantees passage to the shrine for the term of the pact — passage, and no more than passage.
4. What was suffered is now permitted, and the traffic on the {route} has grown to match.
5. The season's first company came up the {route} with a writ and was never asked to show it.
6. {temple} keeps a book of who comes and from where, which was no part of the bargain.

### term_granted.tolerance_guarantee (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {temple} {band}
AUDIENCE: public
1. {settlement} has forsworn the suppression of {counterpart}'s creed, and put a date on the promise.
2. The doors opened: those who kept the faith quietly in {settlement} keep it aloud now.
3. No purge, no eviction, no quiet ruin — the term names each and forbids it for its span.
4. The creed is protected by parchment. Nothing in the parchment makes it loved.
5. {band} congregations came up out of the cellars in one season, and the {temple} has not said what it thinks.
6. The watch in {settlement} has new instructions and has been slow about reading them.
7. What the term protects, it protects until a named date, and the faithful know the date.

### term_granted.temple_restitution (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {temple}
AUDIENCE: public
1. {settlement} will pay to raise the {temple} again, by the seasons named in the sheet.
2. Stone and silver move under the term, and {counterpart}'s clerks count both.
3. The masons are back at the {temple} this spring, and {settlement} pays for the stone.
4. It is called a restitution, which is a word the court prefers to the other one.
5. The roof goes on before the winter, which is the part of the term the congregation cares about.
6. In {counterpart} the payments are counted as a debt discharged; in {settlement} they are counted as a cost.

### term_granted.migration_right (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {band} {route}
AUDIENCE: public
1. {band} families may cross, and the fields they clear are theirs to work. `[exemplar, slotted]`
2. The permits are written, and the gate clerks in {settlement} have their instructions.
3. The {route} out of {counterpart} was carrying them anyway. Now it carries them lawfully.
4. Crossing is a right for the term of the pact — and a right that expires.
5. The first households came over before the ink was dry, having waited at the border for the news.
6. {settlement}'s villages have been told to expect neighbours and have not all been glad of it.

### term_granted.labor_compact (GR-3) — Herald / dossier — significance: routine
SLOTS: {settlement} {counterpart} {house}
AUDIENCE: public
1. The hands of {counterpart} may work {settlement}'s season, and both courts have set the terms of it in writing.
2. The compact colours the harvest: more hands at the sheaves, and {house} watching every one of them.
3. On the quays they say the wages have run thin since the compact. Whether they have is another matter.
4. Labour by agreement, for a term, at a named price — nothing grander than that.
5. The gangs come over at the start of the reaping and go home when it is in.
6. {house} keeps a list of who was hired and where they slept, which the compact did not ask for.
7. The harvest came in faster than it has in years, and the arguing about it began the same week.
8. In {counterpart} the season away is called good work; in {settlement} it is called cheap.

### term_granted.settlement_provision (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {band} {good} {route}
AUDIENCE: public
1. {settlement} sends {good} so that {counterpart}'s new village may stand its first winter.
2. The provision runs by the season and stops at the date; after that the village feeds itself.
3. Wagons went out over the {route} all autumn, and the founders were {band} short of enough.
4. {good} for a settlement — the oldest bargain there is, and this time it is written down.
5. The wagons are counted out of {settlement} and counted in again at the new village, and the tallies are compared.
6. Whether the place stands after the term runs out is not a question the parchment answers.

### term_granted.mutual_defense (GR-3) — Herald / dossier — significance: major
SLOTS: {settlement} {counterpart} {faction}
AUDIENCE: public
1. If one is struck, both answer: so it is sworn. `[exemplar]`
2. {settlement} and {counterpart} have bound their musters together for the term of the pact, and the frontier captains have been told.
3. The word will reach {faction} before the season does, which is half the reason for signing it.
4. Two towns, one war — whichever war comes.

---

# GR-4 — THE SUCCESSION QUESTION (rides `oathHolderEnabled`, second slice)

⛔⛔ **CORRECTED 2026-08-12 (CR-GR4B-3, at GR-4b's promotion) — TWO AUTHORED SLOTS IN THIS
SECTION NAMED FACTS THE ENGINE CANNOT SUPPLY, AND THE CODE WINS BOTH.** Recorded here rather
than changed in silence, because a successor who meets the old wording in a diff needs to know
why it moved. Ruled at **A-20** in the register at the tail of this file, on the A-11 and A-15
precedents.

- **The disavowal exemplar's `{npc}` was the SUCCESSOR.** It read as the new seat tearing up
  what its predecessor had sworn — and the successor's name is on no surface the treaty stage
  can read: the seat-transition row carries a ruler id and no name, the ladder record's
  standings are keyed by id, and the roster that holds names sits behind an exact-set
  `grep '\.npcs'` census that convicts a new world-pulse leaf for the token even inside a
  comment. **`{npc}` in `disavowed_by_succession` now binds to the FALLEN HOLDER** — the hand
  that swore — whose name IS persisted, on the treaty's own `sworn` stamp. It is the voice the
  landed engine receipt had already chosen: *the oath was sworn by a hand now gone, and the
  seat that followed would not own it.*
- **`repudiated`'s third variant spoke `{reason}`.** The DM repudiation verb records no
  free-text reason — its receipt is one fixed authored sentence — so the slot could never be
  filled, and an unfillable slot makes the whole family unreachable against a `major` floor of
  four. The variant is re-authored to the same angle without the slot, and `{reason}` leaves
  that pool's `SLOTS:` line under A-15.

Compiled evidence and the full measurement live in
[`../implementation/packets/foreign-policy/GR-4B.md`](../implementation/packets/foreign-policy/GR-4B.md)
§3.4 and §12a.

⛔⛔ **CORRECTED 2026-08-13 (CR-GR4B-10, after GR-4d's terminal landing) — THE OPENING
POOL WAS AUTHORED ON A SUCCESSOR / MANY-INSTRUMENT AXIS THAT THE LANDED PRODUCER DOES NOT
CARRY.** GR-4d opens one retained proposal for one exact treaty. Its descriptor carries the
acting court, the other court, that treaty's key, and the fallen holder's id; it carries no
successor name and no grouped treaty count. The selected treaty's own `sworn` stamp does carry
the fallen holder's persisted name, and the producer has already proved the exact
`settlementId` + `npcId` match before a question can exist. Therefore `{npc}` below binds only
to the **FALLEN HOLDER**, never the successor; `{band}` leaves the block; variants 2, 4 and 7
are re-authored on the fallen-holder / new-seat axis; variant 6 is singularized; and the
slotless exemplar's editorial tag is corrected. The seven families, their order, audience and
`notable` significance do not move. Ruled at **A-21** under A-11, A-15, A-18 and A-20.

### succession_question_opened (GR-4) — Herald / chronicle — significance: notable
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. The old seat swore it; the new seat must choose. `[exemplar]`
2. {npc} left an oath standing at {settlement}; the new seat has taken the chair while the parchment remains unanswered.
3. The court of {counterpart} is waiting on one word from {settlement}, and the market is trading on which word it will be.
4. The oath {npc} swore is a question this week, and the clerks have set its parchment before the new seat.
5. Nothing has been broken. Nothing has been confirmed either.
6. The clerks in {settlement} have laid the unanswered oath on the council table, with room beneath it for one word.
7. Whatever the new seat decides, the oath {npc} swore will be remembered longer than its terms.

### honored_by_silence (GR-4) — the question expires to HONOR — significance: routine
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. The question was never answered and the peace holds; silence honors the oath.
2. No word came from {settlement}'s new seat, and the clerks entered the treaty as standing.
3. In {counterpart} they waited a season for a repudiation that never arrived.
4. {npc} let the date pass, which the law reads as yes.
5. Nobody in {settlement} ever announced that the oath was kept; the wagons simply kept going.
6. The captains on the frontier were never told to stand down because they were never told to stand up.
7. It is the quietest way an oath can change hands, and the clerks prefer it.
8. In {counterpart}'s market the question was closed the day nothing happened.

### reaffirmed (GR-4) — the honor beat, answered aloud — significance: notable
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. {npc} will keep the word the old seat gave. `[exemplar, slotted]`
2. The new court of {settlement} has said aloud what it might have left unsaid: the peace stands.
3. {counterpart} had readied its captains, and stood them down again.
4. It cost him one sentence in open court, and it bought a season's quiet.
5. The oath changed hands and did not change.
6. The clerks entered the reaffirmation with the date and the words used, because the words will be quoted.
7. There were {npc}'s own people in the hall who had hoped for a different sentence.

### disavowed_by_succession (GR-4) — pact ending; Herald — significance: major
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. The oath {npc} swore has been torn up by the seat that followed him, and the world understands — and does not forgive. `[exemplar, slotted + re-slotted]`
2. {settlement}'s new seat has cast off the oath; every term under it is broken from this week, and the parchment is kept only as evidence.
3. In {counterpart} they had expected it, and it landed hard regardless.
4. The seat that swore is gone, and the word went out of the door with it.
5. It was cheap to do, and it will be dear to have done.

### repudiated (WR-0c producer) — pact ending; Herald — significance: major
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. Openly repudiated: {settlement} has renounced the pact with {counterpart} before the whole court and defaulted every term in it.
2. The herald read it out in the square, and the clerks defaulted the terms the same hour.
3. No pretence of a lapse and no quiet shortfall — {settlement} broke it in the open, and left {counterpart} nothing to misread.
4. They chose the loud way. The cost of the loud way is entered where such costs are entered.

### credibility_charge (GR-4) — Herald / receipt (the oathbreaker's price) — significance: notable
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. This line has disavowed {band} — who will set a name beside theirs now? `[exemplar, slotted]`
2. The word of {settlement}'s seat is worth less this season than last, and the courts are pricing it accordingly.
3. On the quays they say a promise out of {settlement} keeps about as well as fish.
4. In {counterpart} they say nothing was seized and nothing burned — only the signature lost its value.
5. Envoys out of {settlement} are now asked for terms in advance and surety besides.
6. The clerks in {counterpart} keep the record of what {settlement} has broken beside the record of what it has signed.

### succession_question_open (GR-4) — dossier: WarFaithTab / TreatyPanel — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {npc} {band}
AUDIENCE: public
1. The new seat has not yet said whether the old peace holds. `[exemplar]`
2. {npc} sits, and {band} oaths sworn by another hand wait on his answer.
3. The court of {counterpart} sends no envoys until it hears.
4. Nothing has changed on the parchment. Everything in {settlement} waits on one word.
5. The clerks have prepared the letters for either answer and sent none.
6. Until a word comes, every term under the old oath is honored on trust and nothing else.
7. The market in {settlement} has taken its own view and is dealing on it.
8. It is a question that answers itself if left alone long enough.

---

# GR-5 — RENEWAL, RENEGOTIATION-FROM-STRENGTH, CONVERSION (flag `treatyRenewalEnabled`)

### renewal_window_opened (GR-5) — dossier + chronicle — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The peace runs out with the spring; the courts are speaking. `[exemplar]`
2. The longest term between {settlement} and {counterpart} has entered its last season, and both sets of clerks have drawn their reckonings.
3. The market in {settlement} is already dealing on what the new terms will be.
4. It ends by the calendar unless somebody asks it to continue, and nobody has asked.
5. The date has been in the book for years and has arrived anyway, to everyone's surprise.
6. Envoys are being chosen in {settlement} with more care than the season usually warrants.
7. Both courts know what the other's books look like now, which was not true at the signing.
8. On the quays they have begun asking travellers out of {counterpart} what the mood there is.

### renewal_demanded (GR-5) — Herald — significance: notable
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. {settlement}, rebuilt and unbowed, has asked for new terms. `[exemplar, slotted]`
2. {settlement}'s books show a different town than the one that signed, and the sheet it sent says so.
3. The tribute wagons went out to {counterpart} as usual this season, and a rider went with them carrying terms.
4. What the balance was at the signing and what it is now are not the same thing, and {settlement} believes it knows which way.
5. They asked early, before the window, which is its own kind of statement.
6. The demand is written courteously and there is nothing courteous about the arithmetic in it.
7. In {counterpart} the sheet was read through in silence before anyone spoke.

### renewed (GR-5) — pact ending (window lineage act); Herald — significance: notable
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The peace was renewed, and lighter than the one it replaces. `[exemplar, slotted]`
2. The old terms closed and the new took effect the same week; the record in {settlement} keeps both sets.
3. Nothing in the market moved, which is what a renewal is supposed to look like.
4. Another peace of this name between {settlement} and {counterpart}, and neither court called it a victory.
5. It will run its term again, and the clerks have entered the date.
6. The carters were told the roads stay open and went back to work.
7. Neither court had to explain to its people what would have happened otherwise.

### renegotiated (GR-5) — pact ending (accepted mid-term demand) — significance: notable
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The terms were reopened mid-term and cut to the present balance; the old set closed with the ink still good.
2. {counterpart} gave ground it did not have to give, because the alternative was worse and both courts could count.
3. The wagons run lighter out of {settlement} from this season, and the carters knew it before the court announced it.
4. Same parchment, same pair, a different weight.
5. The clerks did not draw a new instrument; they struck through the old terms and initialled the margin.
6. In {settlement} it is called a correction; in {counterpart} it is not called anything in public.

### converted (GR-5) — pact ending (compelled alliance → chosen) — significance: major
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. The compelled alliance is compelled no longer. `[exemplar]`
2. What was extracted at a war's end has been rewritten as a thing both courts choose, and the label followed the terms.
3. {settlement} kept every term of it for {band} years, and at the end {counterpart} offered to make it mutual.
4. Nobody in either market can now remember which side lost.
5. The instrument is the same. Only the reason for it changed.

### renewal_refused (GR-5) — Herald / receipt — significance: notable
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. They asked for new terms and were told the old ones stand. `[exemplar]`
2. {counterpart} read the demand, weighed its own books, and declined; the treaty runs on unchanged.
3. In {settlement} the refusal is called an insult; in {counterpart} it is called arithmetic.
4. Nothing was broken by the asking. Something was remembered by it.
5. The wagons went out at the old weight the very next season, which was the answer restated.
6. The clerks in {counterpart} filed the demand where demands go and did not reply at length.

### renegotiation_ask_capped (GR-5) — receipt (the no-ratchet cap) — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The demand was drawn back to what the present balance will bear; {settlement} wanted more of {counterpart} and the sheet went out at the measure.
2. The clerks cut the demand to the balance — no treaty takes past the strength of the day.
3. Cooler heads in {settlement} trimmed the sheet before the rider took it.
4. They asked for what they could hold, and not for what they wanted.
5. The first draft never left {settlement}, and the second is the one {counterpart} will see.
6. A demand that cannot be enforced is an insult and nothing else; the clerks said so before the rider was called.
7. {counterpart} will read a demand it can refuse without insult, which is what the trimming bought.
8. The market in {settlement} has heard the demand was moderate and does not know why.

### renegotiation_refused_strain (GR-5) — receipt (the strain fact, no casus) — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The demand was refused and the treaty stands; what that cost is being kept in {settlement}, quietly.
2. {settlement} asked, {counterpart} said no, and the no went in the book — not as a cause for war, as a mark.
3. On the streets of {settlement} they say the court was humiliated. The court says nothing.
4. Nothing changed on the parchment, and something changed in the mood.
5. The clerks entered the refusal without comment, which is the only form of comment available to them.
6. The next season's wagons went out of {settlement} on time, and everyone watched them go.
7. Nothing about this is a cause for war, and the court has been careful to say so out loud.
8. In {counterpart} nobody has mentioned it since, which {settlement} has also noticed.

### lineage_line (GR-5) — dossier: WarFaithTab / TreatyPanel / PDF — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. Not the first peace of this name between {settlement} and {counterpart}. `[exemplar, banded ordinal]`
2. The record carries {band} acts — formed, amended, renewed — each with its date beside it.
3. It has been rewritten since it was first sworn, and every superseded set is still in the book.
4. The pair has been at this parchment for {band} years, on and off.
5. Older than the seats that keep it, and amended more often than either court cares to say.
6. Each version borrowed the last one's language, so the oldest phrases are still in force.
7. The clerks file them together, and the bundle is thicker than the treaty it holds.
8. There has been a peace of this name in {settlement} for as long as anyone dealing in the market can remember.

---

# GR-6 — MEDIATION GENERALIZED (flag `mediationGeneralizedEnabled`)
*In every block below `{settlement}` is the BROKER; the two `{counterpart}` fills are the quarrelling pair, in the receipt's party order.*
*`{npc}` is the carrying legate or the seated priest. Per the volume's casting rule
(institution-only voice is the declared fallback where no person resolves), an
`{npc}`-bearing variant is drawn ONLY where a person resolves — with
`envoyDiplomacyEnabled` dark, or where no priest seats, the pool draws from its
institution-voice members. Every GR-6 pool below keeps at least three of those.*

### mediation_offered (GR-6, occasion 1: the intent stage) — Herald / chronicle — significance: notable
SLOTS: {settlement} {counterpart} {npc} {route}
AUDIENCE: public
1. {settlement} has offered to stand between {counterpart} and {counterpart}, and both have been asked to wait.
2. {npc} rode out of {settlement} down the {route} to both courts before the muster was finished.
3. The word in the markets is that {settlement} is trying to buy a peace it needs more than either of them does.
4. Someone with something to lose on both sides has stepped forward.
5. The offer was made publicly, which makes refusing it a thing that must be explained.
6. Nothing obliges either court to accept, and both have been slow about saying so.

### brokered_back (GR-6) — mediation ending (the intent dissolved); Herald — significance: major
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. {settlement} stood between them before the first march; there will be no war this spring. `[exemplar, slotted]`
2. The muster went cold, and {npc}'s name is written into the reason for it.
3. {counterpart} and {counterpart} stood their musters down in the same week, and the carters got their roads back.
4. The war that did not happen has a name attached to it, which is rare enough to record.

### brokered_terms (GR-6) — mediation ending (the pact saved or renewed) — significance: notable
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. {settlement} carried terms between {counterpart} and {counterpart}, and the pact that was fraying holds another season.
2. The brokerage cost {settlement} {npc}'s whole season and bought it standing at both tables.
3. The wagons went out full the month after the broker left, which is the only proof the market wanted.
4. Nobody conceded, and the thing was mended regardless.
5. Every court in the matter holds the same sheet now, which the clerks say has not happened here before.
6. What was mended will need mending again, and the road back is known now.

### declined_to_broker (GR-6) — mediation ending — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. They were asked to stand between, and would not. `[exemplar]`
2. {settlement} keeps its own counsel; the request was heard and not answered.
3. In {counterpart} and {counterpart} both they are saying {settlement} could have stopped it and chose otherwise.
4. The refusal cost nothing this season, and will be remembered when {settlement} next wants something.
5. The request was entered in the book and the answer column left blank.
6. There was nothing in it for {settlement} and the court did not pretend otherwise.
7. The quarrel went its own way, and the road through {settlement} carried the consequences.
8. In the market here they say the seat was wise; on the frontier they say something else.

### brokerage_failed (GR-6) — mediation ending — significance: notable
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. {settlement} stood between {counterpart} and {counterpart} and was walked around; the quarrel went on as though nobody had spoken.
2. The pass was made and the terms were carried, and neither court moved.
3. {npc} came home with the same sheet he left with.
4. Mediation is a pressure and not a wall. This time the pressure was not enough.
5. Both courts thanked {settlement} for the trouble and did exactly as they had intended.
6. The season went on the way the frontier villages had expected it to.

### temple_arm_brokerage (GR-6, occasion 3) — Herald / chronicle — significance: major
SLOTS: {settlement} {counterpart} {npc} {temple}
AUDIENCE: public
1. The temple stood between two angers, and both stood down. `[exemplar]`
2. {temple} of {settlement} keeps congregations in {counterpart} and {counterpart} both, and spent that standing to stop the quarrel.
3. {npc} went where the envoys could not, and the market noticed which door had opened.
4. The courts would not hear each other. They would both hear the {temple}.

### fraying_pact_pass (GR-6, occasion 2: the fraying pact) — chronicle / receipt — significance: routine
SLOTS: {settlement} {counterpart} {term}
AUDIENCE: public
1. The {term} between {counterpart} and {counterpart} was slipping toward default; {settlement} asked for a season's patience and got it.
2. A term that has slipped before is a harder thing to mend, and the broker worked the longer for it.
3. The wagons came fuller the next month; nobody in either market credited {settlement}, but the clerks did.
4. Nothing was renewed and nothing broke. That was the whole of the achievement.
5. The {term} was a short season from a default entry, and it did not get one.
6. A broker who arrives before the accusation has an easier road than one who arrives after.
7. Both parties agreed to count again at the turn of the year rather than count now.
8. The carters between {counterpart} and {counterpart} noticed the loads change before either court announced anything.

### broker_dossier_line (GR-6) — dossier: WarFaithTab, the mediator's town — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. This court stood between {counterpart} and {counterpart}. `[exemplar, slotted]`
2. {settlement} has brokered before, and both parties still bring their grievances here first.
3. The seat here is trusted at two tables, which is a position and a burden.
4. It has stood between neighbours {band} times, and been thanked for it rarely.
5. The archive here holds the terms of quarrels that were never this court's own.
6. A reputation for standing between is a reputation for being asked.
7. Envoys arrive here on their way to somewhere else and stay longer than they meant to.
8. The seat keeps a room set aside for parties who will not sit in the same hall.

---

## COVERAGE LEDGER (what this annex covers, and what it deliberately does not)

**Kinds authored: 66. Variants authored: 456** — deepened 2026-08-03 from the
original 299 to the spine's frequency-scaled floor, by APPEND ONLY (no existing
variant was reworded, renumbered, or dropped; no `SLOTS:` line changed). The
thirty CHRONIC pools — every `routine` beat plus every dossier line and DM chip,
which a reader meets on every visit to the surface — stand at EIGHT. The
twenty-six NOTABLE pools stand at SIX or SEVEN. The ten MAJOR pools stand at FOUR
or FIVE, which is both their floor and their frequency: a repudiation or a
mutual-defence pact is a once-a-reign sentence and does not wear out. Wave
coverage: GR-0 (9) · GR-1 (4) · GR-2 (20) · GR-3 (9) · GR-4 (7) · GR-5 (9) ·
GR-6 (8).

**Mechanical checks RE-EXECUTED over the deepened corpus, 2026-08-03 (CONFIRMED —
all 66 blocks / 456 variants parsed; one failure reported, recorded below):** every
pool clears its frequency-scaled floor by significance class; the deepening is a
pure append (each pool's pre-existing variants are a byte-exact prefix of its new
list, numbering contiguous from one, `SLOTS:` untouched — proved by diffing the
parsed pools against the pre-deepening snapshot, and by the file diff itself:
157 insertions, 0 deletions); zero digits and zero engine-minted number words
(`three`…`hundred`, `dozen`) in any of the 157 new variants; zero exclamation
marks; zero forbidden archaisms; every new slot token is one of the ten canonical
plus the three declared volume-local, and every one is declared by its own pool's
`SLOTS:` line; the two-way SLOTS contract still holds (no declared slot goes
unfilled); maximum pairwise token similarity inside any pool, slots blanked, is
0.24 against the 0.45 family-rule ceiling (worst pair:
`trigger_reason.faith_communion` v3/v6) — the deepening pass also hand-reviewed
the twelve closest pairs and rewrote three appended variants that cleared the
ceiling mechanically but restated a pool-mate's rhetorical move, which is what
the family rule is actually for; each GR-6 mediation pool still keeps at least
three person-free members, so none goes mute with `envoyDiplomacyEnabled` dark.
**The one reported failure is PRE-EXISTING and deliberately untouched:**
`treaty_lapsed` variant 1 runs twenty-eight words against the twenty-six-word
convention. It is the volume's exemplar, slotted under A-1 and rewritten under
A-2 (Law One), and the deepening's append-only mandate forbids editing it; it is
flagged here rather than silently fixed. The original 2026-08-02 checks (zero
digits, zero bangs, zero archaisms, SLOTS both ways, clause and word bounds,
family rule) were re-run over the whole file, not just the additions: zero digits
in any pool variant; zero exclamation marks; zero forbidden archaisms
(`mayhap|forsooth|thee|thou|thy|verily|betwixt|prithee`, word-boundary matched —
the one hit is `though`, a false positive of an unanchored `thou` pattern); every
block carries `SLOTS:` and `AUDIENCE:`; every slot token used is one of the ten
canonical plus the three declared volume-local; **every declared slot is actually
filled by at least one variant of its own pool and every filled slot is declared**
(the two-way SLOTS check — the verification pass found 34 blocks declaring slots
no variant used and closed all of them, by naming the party where the address law
wanted it and by trimming the declaration everywhere else); no variant exceeds
twenty-six words or three clauses; no two variants inside one pool exceed 0.45
token similarity with their slots blanked (the family rule, measured).

**Closed vocabularies fully covered:**
- PACT ENDINGS (§GR-7's closed nine): `ran_its_term` · `renewed` · `converted` ·
  `renegotiated` · `repudiated` · `disavowed_by_succession` · `hollowed_quiet`
  (dm-only) · `hollowed_detected` · `broken_by_war` — all nine authored.
- FORMATION ENDINGS (closed four): `signed` · `refused` · `no_overlap` ·
  `expired_unanswered` — all four authored.
- MEDIATION ENDINGS (closed four): `brokered_back` · `brokered_terms` ·
  `declined_to_broker` · `brokerage_failed` — all four authored.
- FORMATION TRIGGERS (closed five): `trade_demand` · `faith_communion` ·
  `migration_pressure` · `shared_threat` · `renewal` — all five have a reason
  pool (the recorded reason is address law, so each trigger is a phrased kind).
- TERM_CATALOG's nine new rows (GR-3): all nine have a granted-line pool.
- §8's HERALD CONTRACT: all twelve sentences appear as variant 1 of their kind
  (slotted where a name or count was baked — see RESOLVED AMBIGUITIES).
- LINEAGE ACTS: `formed`/`amended` need no pool of their own. Under the
  ONE-INSTRUMENT LAW (§1c R1) a peacetime acceptance amends the pair's standing
  instrument or mints one where none exists, and BOTH paths speak through
  `signed` — which is why no `signed` variant claims a first meeting or a new
  parchment. `renewed`, `renegotiated` and `converted` are the lineage acts that
  carry their own endings, and each has its pool. The lineage record itself
  speaks through `lineage_line` (dossier).

**Deliberately deferred — documented, not dropped:**
1. **`TREATY_COMPLIANCE_VOICE` (family × state) — the compliance-voice matrix.**
   GR-3 extends an EXISTING totality table (`display/treatyDocument.js:36-60`)
   with rows for the faith, population, and security families across
   `honored` / `strained` / `defaulted` / `expired`, plus the symmetric-voice row
   family §4 requires (the house never says "signed under X's terms" about a
   Kadesh pact). That is roughly sixteen further pools at the floor. It belongs
   with the table it extends, not with the beat pools, and is flagged here as
   the single largest remaining GRAMMAR authoring bill. **The verification pass
   reviewed this deferral and UPHELD it** — the matrix is a per-term state voice
   with an existing totality walker to answer to, not a receipt pool; it is a
   named bill, not a hole. It is the one GRAMMAR item that would still red an
   SP-6 audit of the volume, and it should be authored in the GR-3 commit that
   extends the table.
2. **`PROPOSE_PACT` typed veto codes** (`no_cap_headroom`,
   `open_proposal_exists`, `invalid_term_sheet`). These render through the realm
   composer's own veto vocabulary — a DM-facing offerability surface, not a
   chronicle receipt. Flagged for the composer content pass so the LEGIBILITY
   LAW's glance→sentence obligation is met there.
3. **The debtor's-heir question** for `credit` obligations is INTERIOR/TRADE
   material by GR-1's own deferral; only the obligation's oath stamp is authored
   here.
4. **WR-7 envoy-transport variants** (interception, the compromised carrier, the
   lost sheet). `expired_unanswered` variant 5 names the honest silence a lost
   carrier produces; the carrier's OWN beats are the war volume's, per the
   never-duplicate rule.

## RESOLVED AMBIGUITIES REGISTER (chair calls under delegation — vetoable)

| # | Question | Ruling |
|---|---|---|
| A-1 | "Exemplar verbatim" collides with the no-digits and slots-for-proper-nouns laws | The laws win; variant 1 is the exemplar **modulo minimal slotting**, marked `[exemplar, slotted]`. A template that bakes a name cannot ship. |
| A-2 | GR-0's "no man now living signed it" and GR-1's "Signed by two men now dead" resolve named fates | Law One wins. Both rewritten to speak of SEATS ("no hand that signed it still holds a seat"), which is what the receipt records. Marked `[exemplar, Law One]`. |
| A-3 | GR-5's "the third peace of this name" renders an ordinal count | Ordinals are `{band}` fills from a lineage-depth band ("not the first", "another", "many times over"). No integer reaches prose. |
| A-4 | Does the no-digits law forbid "two courts" / "both"? | No — `two`/`both` are the STRUCTURE of a bilateral instrument (law I, pairwise only), not a count read off state. Used only that way; every state-derived quantity is `{band}`. |
| A-5 | Slots needed for typed tokens the canonical ten do not cover (the term family that lapsed, the trigger, the war that ate the peace) | Three volume-local slots DECLARED in the header — `{term}`, `{trigger}`, `{war}` — each filled from a closed engine vocabulary, never free text. |
| A-6 | Is the lapse beat's "road is open again" clause part of `treaty_lapsed` or its own kind? | Its own pool (`treaty_lapsed.road_open`). The volume renders it as a separate house-voice sentence on the same beat; a separate sentence needs a separate pool or the floor is met on paper only. |
| A-7 | GR-4's scope hint names three answers {honored, disavowed_by_succession, reaffirmed} where the volume names three arms {HONOR, DISAVOW, RENEGOTIATE} | Mapped: `honored_by_silence` (the expire-to-HONOR terminal and the dark-mode scored default) and `reaffirmed` (the answered-aloud honor beat) are DISTINCT kinds — the volume mints a beat for each, and their angles differ entirely. The RENEGOTIATE arm is GR-5's `trigger_reason.renewal`, authored there rather than twice. |
| A-8 | Mediation blocks need three settlement names but the canonical set has two | Declared binding: `{settlement}` = the broker, `{counterpart}` twice = the pair, in the receipt's party order. Stated in the header and repeated at the GR-6 section head. |
| A-9 | Do belief-side trigger pools need attribution on EVERY variant? | Attribution is required wherever a variant asserts the COUNTERPARTY's state ("has {good} to spare", "has more mouths than fields", "can hold the pass"); it is not required where the variant reports an observable act (a road carrying feet, priests dining together, a rider leaving) or names the belief inside the sentence ("{settlement} … believes {counterpart} holds it"). Four of the five trigger pools carry two or more explicitly attributed variants; `trigger_reason.renewal` is ledger-side — its occasion is a date on parchment — and carries its one belief clause in the moved-balance variant. |
| A-10 | Baked band words that assert a count the receipt may not carry (`credibility_charge` v1 "and more than once"; `courts_remember` v1/v4 "asked once") | R-28 wins over the exemplar. A strike count and a turnings count are STATE, so they are `{band}` fills or they are dropped — the charge fires on the FIRST disavowal too (GR-4), and the turnings archive holds up to two dozen entries, so neither line may name a number. Rewritten to `{band}` or to the countless form. |
| A-11 | `term_granted.temple_restitution` said "{settlement} will repair what it broke" and "the court that emptied it" | The record carries an impaired institution, a restitution term, and an obligor — it does NOT record who stripped the temple. The causal claim is struck; the obligor's payment (which IS recorded) carries the same irony. |
| A-12 | Engine vocabulary reaching player-facing prose ("the ratio", "the ask", "casus", "the intent", "insular") | GAME-GRADE UX DOCTRINE (translate the formula, never show it) governs prose as it governs surfaces. Replaced with the period register the receipt would actually use — the balance, the demand, a cause for war, the muster, a court that keeps its own counsel. The engine tokens stay in the block headers, where they belong. |
| A-13 | `refusal_reason.oathbreaker_credibility` v1 was the volume's exemplar in the first person ("They will not treat with us.") | The exemplar is what the refused court FEELS; a chronicle line has no "us". Slotted to the address law's third person, with the entailed premise (a word broken before) supplying the second clause. |
| A-14 | `{npc}` in the GR-6 mediation pools, where the volume's casting rule allows institution-only voice when no person resolves | Each GR-6 pool keeps at least three person-free members, and the section head declares that `{npc}` members are drawn only where a legate or a seated priest resolves. A pool that could only speak through a person would go mute with `envoyDiplomacyEnabled` dark. |
| A-15 | A slot declared on a block that no variant of that block fills | Ruled a defect, not a courtesy: the `SLOTS:` line is the pool's fill contract and a renderer may pre-resolve it. Where the missing slot was a party the NEWS ADDRESS LAW wanted named, a variant was rewritten to name it (five pools spoke of a bilateral instrument without naming either town); everywhere else the declaration was trimmed to what the pool actually fills. |
| A-16 | The frequency floor names `chronic` and `routine`, but nine blocks here are dossier lines and one is a DM chip, whose `significance` field reads `n/a` | Ruled CHRONIC, and raised to eight. A dossier line is the MOST chronic text in the corpus: it renders every time the panel opens, not once when the beat fires. `n/a` is a Herald-significance answer, not a frequency answer, and reading it as "unclassified, therefore floor four" would have left the most-read sentences in the volume the thinnest. |
| A-17 | The deepening needed angles the original five-angle palette does not carry — a pool of eight cannot be built from five angles without restating one | Palette WIDENED by three, recorded in constraint (6): the traveller's report, the season's frame, the small human detail. Chosen because each is a genuinely different narrator (an outsider on the road, the year itself, one named-less person) rather than a different sentence shape for the same narrator, which is what the family rule actually polices. |
| A-18 | Several natural deepening lines wanted a count the pools do not declare (`twice`, `one page apart`, `three courts`, `the first caravan`) | The no-digits law (constraint 1 + A-4 + A-10) wins every time, and the fix is never a `{band}` bolted onto a pool that has no band to fill it. Ordinals of SEQUENCE survive (`the first caravan`, `a first offer`, `the second draft` — these order events, they do not count state); counts of STATE were rewritten to the bilateral form (`the same promise in both`), to a position (`on facing pages`), or to the countless form (`every court in the matter`). No pool's `SLOTS:` line was widened to buy a sentence. |
| A-19 | `treaty_lapsed` variant 1 exceeds the twenty-six-word convention, and the deepening pass was the first to measure it | Left as written and FLAGGED in the coverage ledger, not fixed. The append-only mandate is the stronger rule, and the line is doubly load-bearing — it is the volume's exemplar (A-1) and the Law One rewrite (A-2). A pass authorized to add variants is not authorized to reword the one sentence the volume quotes. Vetoable: if the chair wants it trimmed, it is a one-line edit with an A-1/A-2 re-check. |
| A-20 | GR-4's `disavowed_by_succession` exemplar slotted `{npc}` to the SUCCESSOR, and `repudiated`'s third variant slotted `{reason}` — neither fact is on a surface the treaty stage can read (2026-08-12, CR-GR4B-3) | **Reachability wins, on the A-11 and A-15 precedents** — a causal claim the record does not carry is struck, and a slot no variant can fill is a defect rather than a courtesy. `{npc}` re-slots to the **fallen holder**, whose name IS persisted on the treaty's own `sworn` stamp and whom the landed engine receipt already names; `{reason}` is struck from `repudiated`'s `SLOTS:` line and its third variant re-authored to the same angle without it, keeping that pool at its `major` floor of four. ⚠ **This pass is authorized to reword an exemplar and A-19's pass was not**, and the difference is the point: A-19 protects a sentence a variant-adding pass had no cause to touch, whereas an unfillable slot renders the whole family unreachable, so the alternative here was not a thinner corpus but a pool no wave could wire. The dated note at the head of the `# GR-4` section carries the measurement. |
| A-21 | GR-4's `succession_question_opened` pool named the SUCCESSOR through `{npc}`, grouped several treaties through `{band}` / “every,” and marked its slotless exemplar as slotted, while landed GR-4d retains one proposal per exact treaty and carries a fallen-holder id but no successor name or grouped treaty count (2026-08-13, CR-GR4B-10) | **The one-instrument producer and the parchment's history win, under A-11, A-15, A-18 and A-20.** `{npc}` binds only to the **fallen holder**, by matching the question's acting court and `npcId` against the selected treaty's total `sworn` reader, whose name is persisted; it never triggers a successor or roster lookup. `{band}` leaves the block, the multiple-instrument claims are singularized, and variants 2, 4 and 7 speak only the fallen holder's oath and the new seat's pending choice. The slotless exemplar is `[exemplar]`, not `[exemplar, slotted]`. All seven families remain, in order, and every named slot is supplied by the real one-question producer. |
