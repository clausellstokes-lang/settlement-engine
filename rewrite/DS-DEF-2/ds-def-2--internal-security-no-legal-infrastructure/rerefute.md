# RE-REFUTE — DS-DEF-2 · pool `Internal Security: no legal infrastructure`

Seat: RE-REFUTER (opus), for the Fable chair · 2026-09-13. Against `cure.md` (6 cured faces,
0 refused), `card.md`, `speakers.md`, `refute.md`, `draft.md`, CONTRADICTION-TABLE §V — and,
read-only in the dock, `faceSources.js`, `stateProseKernel.js`, `institutionalCatalog.js`,
`institutionServices.js`, `defenseInstitutionBuckets.js` and `scripts/lib/dossier-annex-grammar.mjs`.

CHECKPOINT: complete. 6 cured faces judged, the cure's notes tested as claims, the craft
verdict returned at the pool grain, 3 wiring rows recorded. Nothing pending.

## WHAT THE CURE ACTUALLY DID — measured, not taken on its word

A diff of the 27 row texts (3 spines + 24 faces) between `draft.md` and `cure.md` changes
EXACTLY SIX LINES, and they are the six targets. No spine moved. No pair id, number or kind
moved. No row was added, dropped, reordered or trimmed. `speakers.md` was regenerated and
agrees with the rows seat for seat. The cure's "everything else is byte-identical" is TRUE.

## THE SEATING, RE-MEASURED FROM THE CATALOGUE RATHER THAN FROM THE CARD

I re-extracted every row name at the three preimage tiers (`institutionalCatalog.js`
thorp 6-161 · hamlet 162-450 · village 451-922) and ran them against `faceSources.js`'s own
lists. The six new seats all resolve somewhere in the preimage, which is ruling 15's test:

  elders   `sourcesOf`: `if (ELDER_TIERS.includes(tier)) out.add('elders')` — seated by TIER
           alone, no row required. THORP · HAMLET · VILLAGE, all 384 towns.
  muster   the militia bucket. `Citizen militia` at HAMLET and VILLAGE.
  tavern   `TAVERN_NAMES ['tavern','alehouse']` + `INN_RE /\binns?\b/`. `Wayside inn` at
           HAMLET; `Travelers inn` and `Ale house` at VILLAGE.
  market   `MARKET_NAMES ['market','bazaar','fair','trade center','exchange']`. `Periodic
           market` at HAMLET; `Weekly market` and `Fish market` at VILLAGE.

Against the three seats the cure removed, which resolve on ZERO of the 384: no thorp, hamlet
or village row name carries `watch`, `garrison`, `barracks`, `professional guard` or `guild`.
The first refuter's measurement holds and the cure acted on it correctly.

## VERDICTS — the six cured faces

v1 · face 7 `[tavern · pair 2 · reinforce]` · **PASS**
  "The tavern's account is that a man taken up is let go again."
  Seat resolves (hamlet `Wayside inn`, village `Travelers inn` / `Ale house`). Floor 1: the
  taking-up is AGENTLESS — no body is named, so none is asserted and none of the four closed
  rosters is touched; "let go again" rests on `hasPrison`, which the key fixes false and which
  card §6 prints FROZEN (writers 0), so ruling 11a and 11b both cover it and the elapsed
  reading of "again" is licensed twice over even if one is taken. Floor 2: no magnitude, no
  date, no rate, no event narrated. Sibling rung: it affirms no gaol, which is THIS key, not
  `detention without process`. Pair 2 is now gate + tavern — two DIFFERENT sources, which is
  the only pair rule the grammar enforces on sources (`dossier-annex-grammar.mjs:978`), one
  sentence each under `PAIR_HALF_SENTENCE_CAP`, one kind on both halves. The pair previously
  resolved on NO town (one half seated nowhere); it now resolves wherever a palisade row and
  an inn or alehouse both stand. `closeClassOf` is not `reassurance`, so :1095 does not fire.

v1 · face 9 `[elders]` · **PASS**
  "The elders' word is that a debt here is the creditor's to collect, and the households keep
  their own reckoning of who owes whom."
  Seat resolves everywhere below town. I tested the sharpest available denier and it does not
  deny: the elder rows' own `Record of custom` service (`institutionServices.js:15-30`,
  on, p 0.8) reads "Keeps the memory of boundaries, DEBTS, and old agreements" — so the
  engine's model has debts remembered below town, and the face neither denies that nor claims
  exclusivity ("their OWN reckoning"). `Informal elder consensus`'s "No enforcement, but
  social pressure is real" (`institutionServices.js:1449`) AGREES that a debt is the
  creditor's to collect rather than anyone's to enforce. F1-24 is not reached: the reckoning
  is not cited as a source and is named as the households' own, not as "the books".
  Floor 3: "the creditor" is a relation, not an office the tier emits as an NPC (card §8
  names those: the GUARD CAPTAIN at village, the ELDER at thorp and hamlet) — and "the
  elders" is the plural class word, which is the brief's own safe form.

v1 · face 10 `[muster]` · **PASS**
  "The muster says that with no gaol to put a man in, what it does with him is done at once
  and not written down."
  Seat resolves on `Citizen militia` (hamlet, village), and under car 18c the face draws only
  where that row stands — so the body is on the page whenever the sentence is. Card §8 makes
  the class word "the muster" free by name (§R-8) and bars only a muster ROLL cited with no
  militia keeping it; no roll is cited. "no gaol" is `hasPrison` false, the key's own read.
  No headcount, so DS-DEF-5's cell is untouched. "Done at once" is a manner, not a duration
  the record bands. The engine agrees rather than denies: `safetyProfile.js:458` prints
  "Without courts or prison, enforcement relies entirely on fines, exile, or summary
  violence" on the same page. The withheld thing stays withheld, which is the face's point.

v2 · face 2 `[elders]` · **PASS**
  "The elders' view is that the households may settle what they like among themselves, and
  that what reaches the elders is settled the elders' way."
  THIS IS THE ONE I EXPECTED TO FAIL, and it holds. The candidate denier is
  `institutionServices.js:1449`, `Informal elder consensus` → `Community mediation` (on,
  p 0.8): "The elder hears disputes and suggests resolution. NO ENFORCEMENT, but social
  pressure is real." Two reasons the face stands. First, the face claims an OUTCOME'S SHAPE,
  not a power to compel — "settled the elders' way" is what social pressure produces, and the
  same service line says that pressure is real. Second, the rows that actually seat this
  source say it outright at the top of their menus: `Household elder` → `Dispute mediation`
  (on, p 1.0) "SETTLES quarrels between households by custom"; `Village headman` → "JUDGES
  disputes over land, livestock, and debt" (p 1.0); `Village elder` → "ARBITRATES quarrels"
  (p 1.0). The engine's own model at its highest probability is the face's sentence.
  F1-20 is respected: no room, chamber or council is named anywhere in it. The sibling rung
  is not read — an elders' consensus is not a `democratic assembly` row and `hasCourtSystem`
  stays false. Against spine 2 on the same page there is no self-contradiction: the spine is
  what the households settle among themselves, the face is what escalates past them.

v3 · face 6 `[muster]` · **PASS**
  "A stranger who complains to the muster is told, by the muster's own account, that there is
  no gaol for the man he complains of and none for him either."
  Seat as v1 face 10. No station, counter or room is named — a person complains to a body, and
  the militia row's existence is the seat's own condition. Both denials are `hasPrison`, the
  key's own read. The dryness is the muster's stake and a stake is never a finding. Card §8's
  inference trap is avoided: the face denies the GAOL, never "nobody would come".

v3 · face 7 `[market]` · **PASS**
  "The market's word is that a stranger cheated here has no board to go to, and would do
  better to come back to the stall."
  Seat resolves (hamlet `Periodic market`; village `Weekly market`, `Fish market`), which is
  F1-10 satisfied by a printed row. "No board" denies a body no roster seats and that
  `hasCourtSystem` false independently rules out — the same ground on which the first refuter
  passed v1 face 8. The greed survives the move, which was the face's whole reason to exist.
  Not a reassurance close, so :1095 does not fire.

## THE CURE'S NOTES, TESTED AS CLAIMS (my instruction: its notes are claims to test)

VERIFIED: (a) the six-line diff, exactly as stated; (b) "the grammar enforces no per-variant
source uniqueness" — `assertFaces` refuses a duplicate source ONLY inside a pair
(`dossier-annex-grammar.mjs:978`), and "ONE FACE PER POWER" in the kernel (:472) names the
CLOSED tag vocabulary, not a quota, exactly as the cure reads it; (c) the three removed seats
resolve on zero towns; (d) no adjacent pair of faces shares a source; (e) mechanically clean
across all 27 rows — no digit, em dash, exclamation mark, semicolon, contraction or
`{settlement}`.

FALSE, AND CORRECTED HERE — the cure's thorp arithmetic. The cure writes "the stranger, the
elders and (where a `Palisade` stands) the gate" at thorp, and repeats it in its per-variant
count ("V2 on a thorp: … now 3 + the gate"). THERE IS NO PALISADE ROW AT THORP. The thorp's
eighteen rows are: Informal elder consensus · Head-of-household consensus · Lord's reeve ·
Household elder · Wayside shrine · Access to parish church · Burial ground · Local fence ·
Outlaw shelter · Dwellings (4-16) · Water source · Household levy · Communal root cellar ·
Access to external mill · Subsistence farming · Fishing community · Shepherd collective ·
Woodcutters' camp. `Palisade or earthworks` is a HAMLET and VILLAGE row. The first refuter's
line ("thorp `Palisade`") is where the error came from and the cure inherited it.
The corrected thorp roster is STRANGER · PUBLIC · ELDERS and nothing else, on 128 of the 384
towns. The cure's direction of travel survives the correction and its gain is real, only
smaller than claimed: V1 2 → 3 drawable faces, V2 2 → 3, V3 2 → 2. Pair 1 (stranger + elders)
still draws at thorp, which is the one pair that does.

## CRAFT (pool grain) — PASS

RULING 35, the figure I read first: the gate's own measurement puts the preimage at 384 towns
on ONE key combination — thorp 128/128 · hamlet 128/128 · village 128/128, town and above
silent (card §1). That number is what decides this verdict, because it caps the speaker
roster before a writer touches a word. Measured against the catalogue, the seatable sources
are THREE at thorp (stranger · public · elders), SEVEN at hamlet and EIGHT at village. The
cured pool fields SEVEN distinct speakers across its 24 faces — stranger · elders · register ·
gate · muster · tavern · market — which is 7 of the 8 that can ever be seated on any town this
pool draws, the eighth being `public`, whose car has not landed. A pool that spends the whole
of its available roster is the opposite of the collapse this verdict hunts.

The stake survives the six moves and is various: the muster's grievance that it is expected to
stand behind a settling nobody asked it about (v2f5), the market's greed for the forum it has
just said does not exist (v3f7), the tavern's class note that the settlers are the households
with the most fields (v2f3), the elders' pride that they need no room (v1f4), the gate's two
jurisdictions (v2f6), the register's digger who is told when to dig and not what was decided
(v2f7). Nobody is a camera; every face has somebody who wants something.

Mechanically: the three spines take three different shapes (bare fact · attributed · subject-
first), ruling 29 satisfied; no attribution verb runs three times; no opener class runs three;
no face is a paraphrase of a sibling inside its variant; each stands alone after any spine.
Against the shipped rows this replaces (three spines, no faces at all) it is not duller by any
reading.

TWO RESERVATIONS, RECORDED AND NOT CHARGED.
1. The cure widened one cross-variant echo. v1 face 8 ends "there is no board to take it to"
   and v3 face 7 now reads "has no board to go to, and would do better to come back to the
   stall" — the cure imported `stall` from v1f8 when it replaced the guild's "come to them".
   Two nouns shared by two faces in DIFFERENT variants, which never render together and which
   the sibling rule does not reach. Noted for the selector, not charged.
2. THE THORP NARROWING IS A SEATING FACT, NOT A WRITING FACT. On 128 towns V3 offers two
   drawable faces and V1 and V2 three. No writer can cure it: the only source that would
   widen it is `public`, seated everywhere and held under NOTES until car 8b-W-18n lands.
   Charging DULL here would punish the pool for a car that has not landed.

## WIRING (the instrument, not the face — no face is charged on these)

1. THE CARD'S §7 SEATS A REGISTER THE PRODUCT DOES NOT — the first refuter's row 1, RE-MEASURED
   AND CONFIRMED. `faceSources.js` seats `register` on `REGISTER_NAMES` (church · cathedral ·
   temple · abbey · monastery · friary) minus `REGISTER_EXCLUDE_PREFIX` ('access to'). Thorp
   offers `Access to parish church` (excluded) and `Burial ground` (no match); hamlet offers
   `Access to parish church` (excluded), `Burial ground` and `Wayside shrine` (no match);
   VILLAGE offers `Parish church` (match). So the register resolves at VILLAGE ONLY — one
   third of the preimage — while card §7 lists it as seated at thorp and hamlet. The three
   `[register]` faces are LAWFUL and simply never draw below village. Correct the card before
   the next pool is marked.
2. THE CARD'S §7 AND THE FIRST REFUTER BOTH SEAT A GATE AT THORP THAT DOES NOT EXIST. §7's
   force line reads "gates: OPEN" and the first refuter glossed it "thorp `Palisade`". The
   thorp tier has no `Palisade or earthworks` row and no row carrying any `GATE_NAMES`
   keyword, so `gate` resolves at HAMLET and VILLAGE only. This is the same defect as the
   first refuter's own wiring row 2 — "OPEN" is a statement about the KEY and the CATALOGUE
   fixes it absolutely — reaching one tier further than anyone noticed. NEW ROW.
3. THE `watch · compromised` CANDIDATE ON THIS POOL IS UNDRAWABLE, AND THE CARD STARS IT —
   the cure's row, confirmed. Card §2c marks this pool "⭐ THIS POOL IS ONE OF THEM" for the
   `watch` covert field, but `sourcesOf` seats no watch on any of the 384 preimage towns, so
   ruling 26's candidate can never fire here however car 18m lands. The three pools the
   symptom marks are not equivalent: `full legal chain` and `detention without process` reach
   tiers where `Town watch` prints; `no legal infrastructure` does not.

## THE CURE'S ONE UNCURED THING, AND WHY IT IS RIGHT TO LEAVE IT

The cure refused nothing and cured all six on the finding named and on nothing else. The three
`[register]` faces it left alone are the correct call: they are lawful at village, the card is
what is wrong, and a packet may not edit a card.
