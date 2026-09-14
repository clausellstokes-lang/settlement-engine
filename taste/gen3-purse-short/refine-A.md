1. `[plain]` The purse at {settlement} falls short of the standing charge on its paid defences.
   - `[face]` Coin set aside at {settlement} does not cover the defences it keeps.
   - `[face]` Against what its defences take in keeping, the means at {settlement} run thin.
   - `[face]` What {settlement} lays out on its defences runs under their upkeep.
2. `[plain]` The charge on the defences at {settlement} is not met in full.
   - `[face]` The keeping of {settlement}'s defences outruns the coin.
   - `[face]` Above the purse at {settlement} stands the upkeep of its defences.
   - `[face]` What the defences at {settlement} take runs dearer than the purse.
3. `[plain]` The defences at {settlement} stand on a purse short of their upkeep.
   - `[face]` For the keeping of its defences, {settlement} does not find the coin.
   - `[face]` Short of its charge is how the paid defence at {settlement} is kept.
   - `[face]` Between the purse and what its defences take, {settlement} falls short.

--- NOTES

Seat: Opus 5 — Fable-unvalidated · arm A REFINEMENT (§23, a different author from the drafter) ·
block `DS-GEN-3` · pool `purse: short` · over `draft-round-4.md` · 3 variants · 12 faces, one for
one, none added, none dropped, none trimmed. The typed lines (**ROLE** `modifier` · **FORM**
`sentence` · **MOVE** `PRESENT` · **READS** `readings.economicGates.military` · **RELATION**
`addition` · **ATTACH** `scores.military: CRITICAL` `scores.military: WEAK`) are unchanged and are
not repeated here. The licence card was re-printed first in the read-only dock
(`node scripts/prose-licence-card.mjs DS-GEN-3 'purse: short'`); no claim was added to any face.

THE CEILING THIS ROUND AIMED AT (§21.1–§21.4). The draft was lawful — `owned` verdicts 0 FAIL ·
0 WITHHELD · 72 PASS, `failing: []`, all 24 findings inherited from two spine texts — so lawful was
the floor and every move below is a push past it on one of the five named properties: the sharper
licensed fact, the strongest rhythm inside the voice, the widest sibling distance, zero tics, the
clerk's ear. Density was never traded for plainness; two lines were made denser.

THE SHARPER FACT, NAMED ONCE BECAUSE FIVE FACES SPEND IT. `economicGates.military` is an UPKEEP
multiplier, written only where a paid stack exists, and the generator's own rule is that the
community baseline is unpaid and exempt — only the funded portion above it is gated
(`src/generators/defenseGenerator.js`, the `milUpkeepMult` block). So the licensed fact is not "the
town is poor" and not "the defences are weak": it is that what the town PAYS to keep its defences
is met below the whole. Round 4 stated that scope in one face; this round states it in the
canonical row of two variants (`paid`, `the paid defence`) and sharpens two faces that had drifted
toward the value of the defences rather than their consumption.

FACE BY FACE — what changed and why (one line each).

1a — `standing charge of its defences` → `standing charge on its paid defences`: the sharper
licensed fact, since the gate bites the funded portion alone, and `charge on` is the ledger's own
preposition for a charge borne by a purse.

1b — was `What {settlement} lays out on its defences runs under their upkeep` (moved to 1d);
now `Coin set aside at {settlement} does not cover the defences it keeps`, taking round 4's `set
aside` fence and replacing `does not reach` with `does not cover`, the block's own funding verb
(the `ADEQUATE` sibling reads `covers the gates and the walls`), and closing on a standing verb so
the variant no longer closes twice on `defences`.

1c — `Against what its defences come to` → `Against what its defences take in keeping`: a licensing
correction, not a polish — `come to` reads as what the defences are WORTH, which is a different
fact from what they CONSUME, and consumption is what the gate measures.

1d — round 4's 1b kept to the word and moved to the fourth seat: the cleft is variant 1's strongest
rhythm and it now sits last, where the reader meets it after three shorter shapes rather than
second, and the variant's four money nouns read purse · coin · means · what it lays out.

2a — `The charge of keeping {settlement}'s defences is not met in full` → `The charge on the
defences at {settlement} is not met in full`: the clerk's ear — two stacked genitives unknotted
into one prepositional charge, five syllables lighter, with `not met in full` (the exact form of a
multiplier below one, and the most precise phrase in the set) untouched.

2b — `What the defences at {settlement} take in their upkeep outruns the coin` → `The keeping of
{settlement}'s defences outruns the coin`: the set's short line, eight words, de-clefted so the
pool carries ONE cleft instead of two; `outruns` is kept to the byte as the drafter's density verb.

2c — `stands the upkeep of its defences` kept in place: the locative inversion is the strongest
rhythm in the pool and §21.4 says a strong line is not made plainer; only the noun allocation
around it moved, so `upkeep` heads this face alone in its variant.

2d — `The keeping of {settlement}'s defences runs dearer than its purse` → `What the defences at
{settlement} take runs dearer than the purse`: the cleft moves here, where the cost genuinely wants
the subject seat, `dearer` is kept, and the face closes on `purse` so variant 2's four closes read
full · coin · defences · purse.

3a — `are kept on a purse short of their standing upkeep` → `stand on a purse short of their
upkeep`: the register's own construction (`built work stands on its own patience`, DS-DEF-11), an
active standing verb for a variant whose subject is the thing that stands, two words shorter, and
it frees `kept` for 3c.

3b — `does not find the charge` → `does not find the coin`: the ear — finding the COIN is the
idiom, finding the charge is not, and the swap also gives the variant four distinct cost devices
(upkeep · keeping · charge · what they take).

3c — `Short of its upkeep is how the paid defence at {settlement} stands` → `Short of its charge is
how the paid defence at {settlement} is kept`: the fronted predicate is kept whole, `the paid
defence` is kept as the one face that states the scope for a reader who meets it alone, and the
noun and verb move off 3a's so no two faces of this variant share a head.

3d — `Between the purse and the keeping of its defences, {settlement} stands short` → `Between the
purse and what its defences take, {settlement} falls short`: the second term becomes a consumption
rather than a third `keeping`, and the close moves off `stands` now that 3a carries the standing
verb.

THE MEASURED POSITION OF THE REFINED SET (re-declared by hand and run from outside the dock; no
file written there, nothing executed there but the licence card).

     1a 14w [the purse    ] close: defences  clean
     1b 12w [coin set     ] close: keeps     clean
     1c 13w [against what ] close: thin      clean
     1d 11w [what {}      ] close: upkeep    clean
     2a 12w [the charge   ] close: full      clean
     2b  8w [the keeping  ] close: coin      clean
     2c 11w [above the    ] close: defences  clean
     2d 11w [what the     ] close: purse     clean
     3a 12w [the defences ] close: upkeep    clean
     3b 12w [for the      ] close: coin      clean
     3c 13w [short of     ] close: kept      clean
     3d 12w [between the  ] close: short     clean
     distinct openers 12 of 12 · faces carrying any flag 0 · mean 11.75 · sd 1.42 · min 8 · max 14

The flag set: every `CLAUSE_DETECTORS` member that outranks PRESENT (ABSENCE, CONTRADICTION,
PROVENANCE, OPEN, CONSEQUENCE, HISTORY, INSTITUTION, PERSON, TRADITION, GEOGRAPHY, OBJECT) ·
`CONTRAST_SHAPES` all eight limbs · `SPECIFICATIONAL_COPULA` both limbs · `QUANTIFIERS` ·
`AUTHORED_MAGNITUDES` · `COUNT_NOUNS` · check-pair's `DURATION`, `COUNT` and the nine `RATION`
patterns · the pronoun and abstraction closers of `CLOSE_KINDS` · `which` · the seven modals ·
digits, percent, em dash, semicolon, colon, question, exclamation · `-ly` adverbs · one slot per
face, byte-equal to the parent's set, never first (T-F8) · one sentence per face. **Zero hits on
all twelve**, so every face still falls through to PRESENT, which is the move the annex declares.
One candidate wording was caught and withdrawn by this check before it reached the page: `The
defences {settlement} pays for…` fires the CONSEQUENCE detector on `pays for` and would have
reclassified 3a's move — the scope is carried by `paid` instead, which the detector does not read.

Length spread is wider than the draft's by design and not by padding: sd 1.42 against 1.037, min 8
against 10, because the transitive in 2b says it in eight words and the scoped comparison in 1a
needs fourteen. `wordsPerSentence.neighbourVariation` is the deepest band exceedance on this pool
(1.597 UNDER the band), so a wider load-driven spread moves toward the exemplars; no face was
padded or cut to reach a figure.

Widest within-variant content overlap: variant 1 8 % (1a/1b) · variant 2 22 % (2c/2d) · variant 3
22 % (3a/3d), against `armA5`'s conservative floor of 10,000 bp and its three-part test (same
opener AND same segment count AND overlap at floor); no pair shares an opener, so no pair is
reportable as a synonym swap.

THE THREAD (§1.4.1). The unit is `spine + ' ' + face`, so every face is the passage's second
sentence, after any of the six attached spines and after any sibling modifier seated first. Each
face names `{settlement}` once and never first, and each names the defences — the class the watch,
the arms, the muster and the gate all belong to — so the second sentence lands on the civic object
the first was about, seen from the money side; no face changes subject mid-passage and none needs
to be the turn outward. Two faces open on a cataphoric `its` (1c, 3d); in both the antecedent is
the spine's own subject, which is `{settlement}` in all six spines, so the reach backwards resolves
before the name arrives. An earlier draft of 3d read `Between its means and…`, where the `its`
landed after the spine's `the arrangement` and could attach to it for a beat; `the purse` was
restored for that reason alone, and the vocabulary width was paid for elsewhere in the variant.

REFUSALS HELD FROM THE DRAFT, UNCHANGED AND NOT RE-ARGUED (a refusal is a result): the PROVENANCE
move stays refused at every wording for this pool — the card prints `source: muster · standing
LICENSED` but `composedWalker.js`'s third limb gives WITHHELD on a holder with no institution, and
that limb is keyed on the POOL, so no citation of any holder passes here; a count, a share or a
ratio; a cause, even the true one, since the economic driver is a second field this pool does not
read; a season, a term or a date; paid men, wages, the garrison or the watch, because the gate is
written wherever ANY defence exists; an edge or a future; a second fact of any kind, `addition`
holding no clause seat for S2's joint; and a contrast face, no sibling key or band naming a
rejected alternative these faces could take. Nothing in this round spends the provenance budget:
citations 0, A13 0.

WHAT THIS ROUND DOES NOT TOUCH. The 24 inherited WITHHELD units are the two SPINE segments (`the
gate is shut at night by whoever is nearest to it.` on `CRITICAL` `[ledger]`, arm Q; `rather than
in what the hall issues` on `WEAK` `[ledger]`, arm A3). Both survive the deletion of every byte
this packet writes, both are outside a modifier's reach by construction, and the draft's control
run and its five measured repairs stand as filed. This refinement neither adds nor removes a
finding: the pool's `owned` column is 0 FAIL · 0 WITHHELD · 72 PASS before and after.
