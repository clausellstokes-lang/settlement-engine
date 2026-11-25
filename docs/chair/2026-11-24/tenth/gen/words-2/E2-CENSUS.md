# E2: SECTIONS OF ONE PAGE THAT STATE ONE FACT TWO WAYS (WORDS-2; a measure, nothing built)
Base 0ec96f13d8 (lit). C and V, 900 pages each, rendered by CLOSE-7's page battery with `--views` (every tab the owner's
page prints). Script `tools/e2-pairs.mjs`: each sentence about the place (its name, "here", the size word, or a label),
classed by a lexicon of claims (topic, polarity); a PAIR is two sentences of one page on one topic: CONFLICT (+ beside -)
or ECHO (the same absence said twice). Whole output: `e2/pairs-C.tsv`, `e2/pairs-V.tsv` (entry level and template level,
three seeds each). The lexicon only finds what it names: pairs outside its 15 topics are not counted (open question).
PROSE-6's DISAGREE and PROSE-E cures (the desk pairs) are already in force; their both-truths lines show here as NOT.

## THE TOP FIFTEEN (pages C / V; verdict by my reading; the cure in one line; its size)
| # | section A line | section B line | C | V | verdict | cure (one line) | size |
|---|---|---|---|---|---|---|---|
| 1 | Power: "A headman settles disputes and speaks for the community." (faction card, `data/powerSiblings.js`) | Power: "Decisions at X are slow because the whole Headman's Authority must agree" (DS-POW-5 `council`, marks `seat members`) and "The ruling three of Headman's Authority" (`dmPowerLines.js`) | 86 | 46 | TRUE: one man, then a body | DS-POW-5 `council` lines and the "ruling three" head exclude a single-holder office (`no office: headman`, reeve, lord's steward) | S-M, pages move |
| 2 | Overview: "Governed by X · Stable" (`settlementQuickGuide.js :: governsLine`, `powerStructure.stability`) | Foundations: "Public legitimacy: Contested" (the strained band's label, `qualitativeBands.js`) | 7 | 75 | PLAUSIBLE: two facts (stable rule, doubted mandate) read as opposite | the Foundations label for the strained legitimacy band in a word that does not deny stability ("Questioned") | S |
| 3 | Foundations: "Law & order: Adequate" (`causalState.js` law band) | Overview: "Safety: Unsafe" (`generators/safetyProfile.js` label) | 36 | 14 | TRUE: two models of order | the Foundations law row bounded by the safety label (unsafe/dangerous never prints Adequate) | M |
| 4 | Foundations: "Law & order: Adequate" | Defense: DEF-3 Unsafe ("crimes grow faster than arrests"; "Crime at X is outrunning the watch") | 13 | 4 | TRUE (same cause as 3) | with 3 | - |
| 5 | Overview: GEN-17 GARRISONED "keeps people under arms" / "pays wages for its defense" | Overview health: "Defense: Vulnerable" (+ Foundations "Defense readiness: Critical") | 12 | 31 | PLAUSIBLE: paid hands, weak defence | GARRISONED lines say paid hands, not readiness: leave, or a twin under a weak defence label | S |
| 6 | Economics ECO-10 established: "Buyers from outside come to X for more than one thing." | Economics ECO-1 C4/C5: "Little that comes past X stops there." | 0 | 17 | TRUE (same tab) | ECO-1's "nothing stops" line excludes the established posture | S |
| 7 | Overview GEN-13 "Market day is when X fills: the roads bring buyers." | ECO-1 "Little that comes past X stops there." | 1 | 3 | TRUE, small | with 6 | - |
| 8 | Daily Life fare: "Nobody here goes hungry, though few eat richly." | Food Pressured; ECO-9 "falls a little short … tighter belts" | 2 | 5 | TRUE, small | the fare line reads the printed food band (R24d's law) | S |
| 9 | Defense: "X has no wall against the country…" | Defense: "X has no wall, and nothing threatens it…" | 5 | 30 | ECHO (same tab, same fact) | the second walls line yields where the first prints | S |
| 10 | Crisis: "People no longer trust those in charge…" (`stressTypes.js` viabilityNote) | Defense: the same sentence, word for word | 27 | 25 | ECHO (verbatim) | one home: the Defense mount drops a viabilityNote the Crisis tab prints | S |
| 11 | Overview: "· Fractured — no stable governing authority" | Power: "Fractured — no stable governing authority"; Defense: "No stable governing authority." | 28 | 25 | ECHO (three times) | Defense's line drops (the Overview states it) | S |
| 12 | Defense: "No healer is kept here; the sick are tended by their own families." | Daily Life: "There is no healer here, and the sick are nursed at home." | 22 | 9 | ECHO | Daily Life's no-healer line excludes where Defense prints its own (or takes another part) | S |
| 13 | Overview GEN-13 NO-MARKET + Economics yield clause | ECO-1 C4 v6 "There is no market at X…" | 13 | 41 | ECHO | RULED G3, BUILT (E4) | done |
| 14 | Overview "Food Security: Secure" | Defense DEF-2 CHAIN failing ("tables are full for now, but its food trades are failing") | 34 | 26 | NOT: DISAGREE's both-truths line | none | - |
| 15 | Foundations "Trade connectivity: Adequate" | ECO-1 "Little that comes past X stops there." | 4 | 53 | NOT: connected, nothing stops | none (6 is the true one) | - |

Also read, NOT: "Spell scrolls for sale" beside "Without any magic at all, X would still keep its living" (a counterfactual);
"Reliance on magic: None" on two tabs (a label, by design); "the village is poor" in Economics and in the Power tab's
crime line (a cause, as G3 (b)).

## OPEN QUESTIONS
- The lexicon's reach: Plot Hooks, NPCs and Relationships are skipped (persons and the past); a pair there is not counted.
- 1 is the lit seat law's (several seat members in a single-holder form): whether the cure is the words or the seat is the chair's.
