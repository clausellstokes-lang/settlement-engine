# RECEIPT POOLS — FP-GRAMMAR (the pact grammar's seeded variant corpus)

## Fable 5 content authoring, 2026-08-02. Annex to `docs/DESIGN_FP_GRAMMAR.md`,
## discharging the SP-6 CONTENT-DEPTH FLOOR (`DESIGN_FP_SPINE.md` §2 SP-6):
## **every phrased kind ships a seeded variant pool of AT LEAST FOUR templates**,
## each a different STRUCTURE AND ANGLE — the volume's exemplar sentence is the
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
   the understatement or the quiet irony.
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
2. The {term} between {settlement} and {counterpart} reached its date; the clerks struck it from the book, and the book is the only place it was mourned.
3. In {settlement} the market kept its hours as always; the pact with {counterpart} ended that week, and the carters heard of it after the clerks.
4. {settlement} and {counterpart} are bound by nothing now — the {term} ran out, and neither court asked for another.
5. It was written for {band} years and it kept every one of them; both courts let it go without a word.

### treaty_lapsed.road_open (GR-0) — chronicle (the lapse beat's warning clause) — significance: notable
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. The {route} between {settlement} and {counterpart} is open again, to anything. `[exemplar, slotted]`
2. Nothing written stands between the two courts now; what comes next is nobody's to forbid.
3. The captains in {settlement} marked the week the pact lapsed and said nothing further.
4. No oath forbids a march between {settlement} and {counterpart} — not since the spring.
5. Where a treaty stood there is now distance and habit.

### treaty_default_detected (GR-0) — Herald / chronicle — significance: notable
SLOTS: {settlement} {counterpart} {band} {term}
AUDIENCE: public
1. The tribute came light, and this time the court noticed. `[exemplar]`
2. {settlement}'s clerks weighed what arrived from {counterpart} against what was promised, and the ledger would not close.
3. The wagons from {counterpart} have been coming short; the carters on the quays were saying so before the court would.
4. What {counterpart} owes under the {term} has run thin for {band} seasons, and {settlement} has begun to keep the count.
5. Nothing was refused and nothing was delivered; the court of {settlement} has entered it as default.

### treaty_age_line (GR-0) — dossier: WarFaithTab / TreatyPanel / PDF — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. {band} years this peace has held. `[exemplar, slotted]`
2. Signed before most of the traders in the market were born, and still in force.
3. It has outlasted many a lean harvest in {settlement} and in {counterpart}, and not a word of it has changed.
4. The parchment is soft at the folds; the terms are kept.
5. Young yet, as treaties go — the ink is barely set, and neither court has been tested.

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

### ran_its_term (GR-0) — pact ending (endings vocabulary) — significance: routine
SLOTS: {settlement} {counterpart} {term}
AUDIENCE: public
1. It ran its term and ended on the day it said it would.
2. The {term} expired at its own date; nothing was broken to end it.
3. In {settlement} the pact's last season passed without remark, and then the term was simply over.
4. Ended by the calendar and not by anger; {settlement} and {counterpart} are quit of it, and of each other's ledgers.
5. It kept its word to the last week and then stopped being law.

### hollowed_detected (GR-0) — pact ending — significance: notable
SLOTS: {settlement} {counterpart} {term}
AUDIENCE: public
1. Hollowed and found out: the {term} was kept on parchment and nowhere else.
2. {counterpart} let it fail by inches until {settlement} weighed the difference and named it default.
3. The court called it default; the carters had been calling it that a season earlier.
4. Nothing was repudiated. It was simply not done, and then it was seen.
5. It died of short wagons, and the ledger says so.

### hollowed_quiet (GR-0) — pact ending, ground-truth surfaces only — significance: routine
SLOTS: {settlement} {counterpart} {term}
AUDIENCE: dm-only
1. Hollowed and never noticed: the {term} lapsed with its obligations unmet and no court the wiser.
2. {settlement} stopped sending; {counterpart} never had the reach to know it.
3. It reads honored on every public surface, and it was not.
4. The default was real, the detection never came, and the pact ended in good standing.

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

### oath_stamp.seat (GR-1) — dossier signature line, unstamped / legacy / no holder resolved — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The seat swore it, and the seat keeps it.
2. No name is set to this one; it binds the chair in {settlement}, whoever warms it.
3. It was sworn by the office and not the man — older than the present court's memory.
4. The parchment names {settlement} and {counterpart}, and nobody else.
5. Whoever holds the seat has inherited it, unasked.

### credit_obligation_sworn (GR-1) — dossier / receipt (generosity `credit` obligations) — significance: routine
SLOTS: {settlement} {counterpart} {npc} {band} {good}
AUDIENCE: public
1. {npc} of {settlement} stood surety for the {good}, and the debt is entered in his name.
2. The obligation is {npc}'s and not the seat's; the books in {settlement} say so plainly.
3. {counterpart} took the {good} on one man's word, and the word was given in front of the market.
4. A debt outlasts the hand that gave it: whoever answers for {npc}'s house answers for this.
5. Sworn, sealed, and owed — {band} seasons to the maturity.

### treaty_lapsed.outlived_its_swearers (GR-1 × GR-0) — chronicle (the stamped eulogy) — significance: notable
SLOTS: {settlement} {counterpart} {npc} {band}
AUDIENCE: public
1. Sworn by {npc} and {npc}, and it outlasted both their seats. `[exemplar, Law One]`
2. Neither {settlement} nor {counterpart} is led by the hand that signed it, and the parchment held anyway.
3. The men who swore for {settlement} and {counterpart} are out of the chair; the terms stayed on the table.
4. It was a personal oath and it survived the persons — the clerks kept it going out of habit.
5. {band} seats have turned over since the ink dried, and nobody ever asked whether it still bound.

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

### trigger_reason.trade_demand (GR-2) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. The word in {settlement} is that {counterpart} has {good} to spare, and the granaries here run thin.
2. {settlement}'s factors say the {good} is dear at home and cheap across the border, and the court has believed them.
3. It is said {counterpart} sits on more {good} than it can eat. Whether it does is another question.
4. The price of {good} has been the talk of the quays all season, and the court has finally answered the talk.
5. {settlement} wants {good} and believes {counterpart} holds it; the sheet is drawn on that belief and nothing else.

### trigger_reason.faith_communion (GR-2) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart} {temple} {route}
AUDIENCE: public
1. The two towns keep the same feasts, and the temples have begun to say so aloud.
2. {temple} in {settlement} and {temple} in {counterpart} share a rite; the courts have noticed what the priests knew first.
3. The word on both sides of the border is that the faith is one faith, and the parchment would only agree with it.
4. Pilgrims from {counterpart} have worn a path down the {route} to {settlement}'s shrine, and nobody has stopped them yet.
5. The priests of both towns dine together, which the courts have read as creed enough alike to write down.

### trigger_reason.migration_pressure (GR-2) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart} {band} {route}
AUDIENCE: public
1. They have been crossing for {band} seasons, and both courts have run out of ways not to mention it.
2. The {route} from {counterpart} carries more feet each spring, and {settlement}'s gate clerks keep the tally.
3. It is said in {counterpart} that there is work and bread in {settlement}, and the saying has emptied a village or two.
4. {settlement}'s fields want hands, and the word is that {counterpart} has more mouths than fields; the arrangement writes itself.
5. The crossing happens whether it is lawful or not. The courts propose to make it lawful.

### trigger_reason.shared_threat (GR-2) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart} {faction}
AUDIENCE: public
1. Both courts are watching the same banners, and neither likes the count.
2. {settlement} and {counterpart} name the same enemy in private; the sheet only says it in public.
3. The word from the frontier is that {faction} musters, and two courts have read one rumour the same way.
4. Neither court believes it can hold the pass alone, and that arithmetic is what put terms on the table.
5. They were rivals last spring. They have a nearer worry now.

### trigger_reason.renewal (GR-2 ledger, GR-5 occasion) — receipt reason line — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The terms with {counterpart} run out with the spring, and {settlement} has moved first.
2. The terms expire within the year; {settlement}'s clerks have drawn a new sheet against the old one.
3. Neither court wanted to be the one asking late, so {settlement} asked early.
4. The old bargain fits neither of them now — the balance has moved, and both courts believe it has.
5. The parchment carries a date. {settlement} has read the date.

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

### no_overlap (GR-2) — formation ending (the two-sided conjunction fails) — significance: routine
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. No pact was reached; each court keeps its {good}, and its opinion of the other. `[exemplar, slotted]`
2. The two sheets never met: what {settlement} would give, {counterpart} would not take.
3. They talked past each other for a season and then stopped talking.
4. Both courts valued the same terms and valued them differently. That is the whole of the failure.
5. Nothing signed and nothing spoiled; the riders went home.

### expired_unanswered (GR-2) — formation ending (silence is an answer) — significance: routine
SLOTS: {settlement} {counterpart} {route}
AUDIENCE: public
1. The offer stood to its date and no answer came; silence is an answer.
2. {counterpart} let the sheet sit until the answer fell due, and {settlement}'s clerks closed the entry.
3. In {settlement} they say the rider was never received; in {counterpart} they say no rider came.
4. No refusal was ever spoken, which the court of {settlement} has chosen to remember as one.
5. The terms expired somewhere on the {route}.

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

### pact_out_of_posture (GR-2) — receipt (the priced out-of-posture act) — significance: notable
SLOTS: {settlement} {counterpart} {house}
AUDIENCE: public
1. {settlement} keeps to itself as a rule and broke the rule to ask {counterpart}; the court paid for the asking at home.
2. A court that keeps its own counsel has put terms to a stranger, and {house} has opinions it is not keeping quiet.
3. It is said in {settlement}'s halls that the seat has grown too fond of foreigners.
4. The proposal went out against the grain of the place, and the price of that is entered where prices are entered.

### refusal_reason.dependency_fear (GR-2) — receipt reason (the counterforce) — significance: routine
SLOTS: {settlement} {counterpart} {good}
AUDIENCE: public
1. {counterpart} read the same flows and saw a leash: what {settlement} offered would bind it too near.
2. The terms were good, which is exactly what the court of {counterpart} mistrusted.
3. The factors in {counterpart} say a town that eats another's {good} learns to ask permission.
4. Refused for fear of reliance — the same numbers that argued for the pact argued against it.

### refusal_reason.oathbreaker_credibility (GR-2 × GR-4) — receipt reason — significance: notable
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. They will not treat with {settlement}; the word it broke before is answer enough. `[exemplar, slotted]`
2. {counterpart} looked at what {settlement}'s line has done to the oaths it swore before, and sent the sheet back.
3. The word on {settlement}'s word is bad, and no terms are good enough to mend it.
4. The court of {counterpart} priced the signature and found it worth less than the parchment under it.
5. A house that has disavowed {band} is refused on its history, not on its offer.

### refusal_reason.reserve_unmet (GR-2) — receipt reason — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. What was offered fell short of what {counterpart} holds the arrangement to be worth.
2. The sheet did not clear the court's own reckoning — near, and not near enough.
3. In {counterpart}'s market they said the terms were thin, and the court agreed with the market.
4. {settlement} drew the sheet against what it believed {counterpart} would take, and believed wrong.

### offer_standing.proposer (GR-2) — dossier: WarFaithTab, proposer's town — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band} {reason} {route}
AUDIENCE: public
1. An offer stands before the court of {counterpart}: {reason}; an answer is owed by spring. `[exemplar, slotted]`
2. {settlement} has asked and waits; the answer falls due before the season turns.
3. The clerks keep a copy of the sheet and the date it must be answered by.
4. Terms went down the {route} {band} weeks ago and nothing has come back.

### offer_standing.counterparty (GR-2) — dossier: WarFaithTab, counterparty's town — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {house} {reason}
AUDIENCE: public
1. {counterpart} asks: {reason}. The court has not yet answered.
2. A sheet from {counterpart} lies on the table, and {house} is not of one mind with the seat about it.
3. They ask, and the market has already decided what the answer ought to be.
4. An answer is owed before the season turns, and {settlement} has said nothing.

### courts_remember (GR-2 + GR-6) — dossier: WarFaithTab (the turnings archive read) — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. The courts remember: {counterpart} asked here, and was refused.
2. Nothing came of the asking, and the asking is still spoken of in {settlement}.
3. The book of turnings here carries {band} entries, and {counterpart}'s name is among them.
4. {counterpart} has been refused at this table {band}, and the book keeps every one.
5. What was said here is remembered here; the clerks keep the turnings.

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

### term_granted.shared_rite (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {temple}
AUDIENCE: public
1. {settlement} and {counterpart} keep one rite by compact, and the calendars in both towns say so.
2. {temple} and {temple} have written their communion down, and the feast days now fall together.
3. Pilgrims have stopped asking which side of the border they are praying on.
4. A shared rite by parchment is still a shared rite.

### term_granted.pilgrimage_right (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {temple} {route}
AUDIENCE: public
1. The {route} to {temple} is open to the faithful of {counterpart} by right, and the tolls are named in the same sheet.
2. The road carries pilgrims lawfully now, and the innkeepers along it have raised their rates accordingly.
3. {settlement} guarantees passage to the shrine for the term of the pact — passage, and no more than passage.
4. What was suffered is now permitted, and the traffic on the {route} has grown to match.

### term_granted.tolerance_guarantee (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {temple} {band}
AUDIENCE: public
1. {settlement} has forsworn the suppression of {counterpart}'s creed, and put a date on the promise.
2. The doors opened: those who kept the faith quietly in {settlement} keep it aloud now.
3. No purge, no eviction, no quiet ruin — the term names each and forbids it for its span.
4. The creed is protected by parchment. Nothing in the parchment makes it loved.
5. {band} congregations came up out of the cellars in one season, and the {temple} has not said what it thinks.

### term_granted.temple_restitution (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {temple}
AUDIENCE: public
1. {settlement} will pay to raise the {temple} again, by the seasons named in the sheet.
2. Stone and silver move under the term, and {counterpart}'s clerks count both.
3. The masons are back at the {temple} this spring, and {settlement} pays for the stone.
4. It is called a restitution, which is a word the court prefers to the other one.

### term_granted.migration_right (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {band} {route}
AUDIENCE: public
1. {band} families may cross, and the fields they clear are theirs to work. `[exemplar, slotted]`
2. The permits are written, and the gate clerks in {settlement} have their instructions.
3. The {route} out of {counterpart} was carrying them anyway. Now it carries them lawfully.
4. Crossing is a right for the term of the pact — and a right that expires.

### term_granted.labor_compact (GR-3) — Herald / dossier — significance: routine
SLOTS: {settlement} {counterpart} {house}
AUDIENCE: public
1. The hands of {counterpart} may work {settlement}'s season, and both courts have set the terms of it in writing.
2. The compact colours the harvest: more hands at the sheaves, and {house} watching every one of them.
3. On the quays they say the wages have run thin since the compact. Whether they have is another matter.
4. Labour by agreement, for a term, at a named price — nothing grander than that.

### term_granted.settlement_provision (GR-3) — Herald / dossier — significance: notable
SLOTS: {settlement} {counterpart} {band} {good} {route}
AUDIENCE: public
1. {settlement} sends {good} so that {counterpart}'s new village may stand its first winter.
2. The provision runs by the season and stops at the date; after that the village feeds itself.
3. Wagons went out over the {route} all autumn, and the founders were {band} short of enough.
4. {good} for a settlement — the oldest bargain there is, and this time it is written down.

### term_granted.mutual_defense (GR-3) — Herald / dossier — significance: major
SLOTS: {settlement} {counterpart} {faction}
AUDIENCE: public
1. If one is struck, both answer: so it is sworn. `[exemplar]`
2. {settlement} and {counterpart} have bound their musters together for the term of the pact, and the frontier captains have been told.
3. The word will reach {faction} before the season does, which is half the reason for signing it.
4. Two towns, one war — whichever war comes.

---

# GR-4 — THE SUCCESSION QUESTION (rides `oathHolderEnabled`, second slice)

### succession_question_opened (GR-4) — Herald / chronicle — significance: notable
SLOTS: {settlement} {counterpart} {npc} {band}
AUDIENCE: public
1. The old seat swore it; the new seat must choose. `[exemplar, slotted]`
2. {npc} of {settlement} sits where the oath was given, and has not said whether the oath is his.
3. The court of {counterpart} is waiting on one word from {settlement}, and the market is trading on which word it will be.
4. Every treaty {npc} did not sign is a question this week, and there are {band} of them.
5. Nothing has been broken. Nothing has been confirmed either.

### honored_by_silence (GR-4) — the question expires to HONOR — significance: routine
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. The question was never answered and the peace holds; silence honors the oath.
2. No word came from {settlement}'s new seat, and the clerks entered the treaty as standing.
3. In {counterpart} they waited a season for a repudiation that never arrived.
4. {npc} let the date pass, which the law reads as yes.

### reaffirmed (GR-4) — the honor beat, answered aloud — significance: notable
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. {npc} will keep the word the old seat gave. `[exemplar, slotted]`
2. The new court of {settlement} has said aloud what it might have left unsaid: the peace stands.
3. {counterpart} had readied its captains, and stood them down again.
4. It cost him one sentence in open court, and it bought a season's quiet.
5. The oath changed hands and did not change.

### disavowed_by_succession (GR-4) — pact ending; Herald — significance: major
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. {npc} has torn up the treaty his predecessor swore, and the world understands — and does not forgive. `[exemplar, slotted]`
2. {settlement}'s new seat has cast off the oath; every term under it is broken from this week, and the parchment is kept only as evidence.
3. In {counterpart} they had expected it, and it landed hard regardless.
4. The seat that swore is gone, and the word went out of the door with it.
5. It was cheap to do, and it will be dear to have done.

### repudiated (WR-0c producer) — pact ending; Herald — significance: major
SLOTS: {settlement} {counterpart} {reason}
AUDIENCE: public
1. Openly repudiated: {settlement} has renounced the pact with {counterpart} before the whole court and defaulted every term in it.
2. The herald read it out in the square, and the clerks defaulted the terms the same hour.
3. No pretence of a lapse and no quiet shortfall — {settlement} broke it in the open, and said {reason}.
4. They chose the loud way. The cost of the loud way is entered where such costs are entered.

### credibility_charge (GR-4) — Herald / receipt (the oathbreaker's price) — significance: notable
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. This line has disavowed {band} — who will set a name beside theirs now? `[exemplar, slotted]`
2. The word of {settlement}'s seat is worth less this season than last, and the courts are pricing it accordingly.
3. On the quays they say a promise out of {settlement} keeps about as well as fish.
4. In {counterpart} they say nothing was seized and nothing burned — only the signature lost its value.

### succession_question_open (GR-4) — dossier: WarFaithTab / TreatyPanel — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {npc} {band}
AUDIENCE: public
1. The new seat has not yet said whether the old peace holds. `[exemplar]`
2. {npc} sits, and {band} oaths sworn by another hand wait on his answer.
3. The court of {counterpart} sends no envoys until it hears.
4. Nothing has changed on the parchment. Everything in {settlement} waits on one word.

---

# GR-5 — RENEWAL, RENEGOTIATION-FROM-STRENGTH, CONVERSION (flag `treatyRenewalEnabled`)

### renewal_window_opened (GR-5) — dossier + chronicle — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The peace runs out with the spring; the courts are speaking. `[exemplar]`
2. The longest term between {settlement} and {counterpart} has entered its last season, and both sets of clerks have drawn their reckonings.
3. The market in {settlement} is already dealing on what the new terms will be.
4. It ends by the calendar unless somebody asks it to continue, and nobody has asked.

### renewal_demanded (GR-5) — Herald — significance: notable
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. {settlement}, rebuilt and unbowed, has asked for new terms. `[exemplar, slotted]`
2. {settlement}'s books show a different town than the one that signed, and the sheet it sent says so.
3. The tribute wagons went out to {counterpart} as usual this season, and a rider went with them carrying terms.
4. What the balance was at the signing and what it is now are not the same thing, and {settlement} believes it knows which way.
5. They asked early, before the window, which is its own kind of statement.

### renewed (GR-5) — pact ending (window lineage act); Herald — significance: notable
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The peace was renewed, and lighter than the one it replaces. `[exemplar, slotted]`
2. The old terms closed and the new took effect the same week; the record in {settlement} keeps both sets.
3. Nothing in the market moved, which is what a renewal is supposed to look like.
4. Another peace of this name between {settlement} and {counterpart}, and neither court called it a victory.
5. It will run its term again, and the clerks have entered the date.

### renegotiated (GR-5) — pact ending (accepted mid-term demand) — significance: notable
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The terms were reopened mid-term and cut to the present balance; the old set closed with the ink still good.
2. {counterpart} gave ground it did not have to give, because the alternative was worse and both courts could count.
3. The wagons run lighter out of {settlement} from this season, and the carters knew it before the court announced it.
4. Same parchment, same pair, a different weight.

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

### renegotiation_ask_capped (GR-5) — receipt (the no-ratchet cap) — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The demand was drawn back to what the present balance will bear; {settlement} wanted more of {counterpart} and the sheet went out at the measure.
2. The clerks cut the demand to the balance — no treaty takes past the strength of the day.
3. Cooler heads in {settlement} trimmed the sheet before the rider took it.
4. They asked for what they could hold, and not for what they wanted.

### renegotiation_refused_strain (GR-5) — receipt (the strain fact, no casus) — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. The demand was refused and the treaty stands; what that cost is being kept in {settlement}, quietly.
2. {settlement} asked, {counterpart} said no, and the no went in the book — not as a cause for war, as a mark.
3. On the streets of {settlement} they say the court was humiliated. The court says nothing.
4. Nothing changed on the parchment, and something changed in the mood.

### lineage_line (GR-5) — dossier: WarFaithTab / TreatyPanel / PDF — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. Not the first peace of this name between {settlement} and {counterpart}. `[exemplar, banded ordinal]`
2. The record carries {band} acts — formed, amended, renewed — each with its date beside it.
3. It has been rewritten since it was first sworn, and every superseded set is still in the book.
4. The pair has been at this parchment for {band} years, on and off.
5. Older than the seats that keep it, and amended more often than either court cares to say.

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

### declined_to_broker (GR-6) — mediation ending — significance: routine
SLOTS: {settlement} {counterpart}
AUDIENCE: public
1. They were asked to stand between, and would not. `[exemplar]`
2. {settlement} keeps its own counsel; the request was heard and not answered.
3. In {counterpart} and {counterpart} both they are saying {settlement} could have stopped it and chose otherwise.
4. The refusal cost nothing this season, and will be remembered when {settlement} next wants something.

### brokerage_failed (GR-6) — mediation ending — significance: notable
SLOTS: {settlement} {counterpart} {npc}
AUDIENCE: public
1. {settlement} stood between {counterpart} and {counterpart} and was walked around; the quarrel went on as though nobody had spoken.
2. The pass was made and the terms were carried, and neither court moved.
3. {npc} came home with the same sheet he left with.
4. Mediation is a pressure and not a wall. This time the pressure was not enough.

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

### broker_dossier_line (GR-6) — dossier: WarFaithTab, the mediator's town — significance: n/a (dossier line)
SLOTS: {settlement} {counterpart} {band}
AUDIENCE: public
1. This court stood between {counterpart} and {counterpart}. `[exemplar, slotted]`
2. {settlement} has brokered before, and both parties still bring their grievances here first.
3. The seat here is trusted at two tables, which is a position and a burden.
4. It has stood between neighbours {band} times, and been thanked for it rarely.

---

## COVERAGE LEDGER (what this annex covers, and what it deliberately does not)

**Kinds authored: 66. Variants authored: 299** (thirty-one pools at four, thirty-five
at five — the floor is four, and no pool exceeds the contract's six). Wave
coverage: GR-0 (9) · GR-1 (4) · GR-2 (20) · GR-3 (9) · GR-4 (7) · GR-5 (9) ·
GR-6 (8).

**Mechanical checks executed on this file, 2026-08-02 (CONFIRMED — re-executed by
the verification pass below, all 66 blocks / 299 variants parsed):** zero digits
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
