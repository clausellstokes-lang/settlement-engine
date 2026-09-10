# PROSE STYLE DOSSIER — the exemplars, the failure catalogue, our own corpus measured, and the reconstruction rules
Chair: Fable 5.1, 2026-09-05. Status: RESEARCH COMPLETE (first pass), MEASUREMENT COMPLETE (first pass), RULES PROPOSED, NOTHING IN THE CORPUS CHANGED.
Owner's ask (09-05, verbatim fragments): "deconstruct the writing style … of George RR Martin, of JRR Tolkien, and of D&D Official Content to help refine our prose further reconciling it with what we already have"; "where generated AI prose fails against these examples and in general"; "reconstruct each individual sentence that we have for prose not rewrite the entire catalogue"; "keep things simple enough that readers can quickly understand the intent".
Method: public criticism, style guides, studies and craft essays only; no copyrighted passage reproduced (fragments under twelve words, attributed). Every rule below cites its source or its measurement. Where the chair's prior stands in for a source it is marked PLAUSIBLE.

## 1. The exemplars, deconstructed

### 1a. Tolkien (Rosebury, Shippey, Walker, Turner, Kullmann & Siepmann — via the Wikipedia synthesis; Shippey on the Council of Elrond via "Tolkien: Medieval and Modern")
1. REGISTER IS EARNED, NOT WORN. Passages open in plain modern syntax and modulate upward only when the matter turns ancient or magical (Rosebury: "begins with essentially plain syntax"); corpus linguistics finds plain modern English predominant (Kullmann & Siepmann). Rosebury's defence against Stimpson: the disputed sentences are ones "Ernest Hemingway could have written".
2. ARCHAISM IS RARE AND LOAD-BEARING. "alas", "thou", "whither" sparingly; the stronger device is a familiar word carrying an old overtone ("deem", "moot", "wight") (Walker). Old English syntax is reserved for ONE people, the Rohirrim (Walker).
3. REGISTER BELONGS TO THE SPEAKER. At the Council: Elrond formal and archaic ("hither"), Glóin terse apposition, Bilbo modern and clipped, Frodo one notch formal ("should like") (Shippey). The hobbit voice mediates between the modern reader and the heroic register.
4. CADENCE BY CLAUSE, NOT BY ADJECTIVE. Assonance and alliteration; implied conjunctions and present participles for immediacy; inversion only for a mood shift (Rosebury); paratactic, biblical clause-chains for the exalted register (Turner).
5. THE ELEGIAC NOTE FOR DEEP TIME: ubi sunt (Walker; The Wanderer, Shippey). Panorama from a fixed vantage (Rosebury).
6. The recorded criticisms name the risk of the elevated register: "wrenches syntax" (Stimpson), "comforting and unchallenging" (Moorcock).

### 1b. Martin (Books & Boots "Some notes on GRRM's prose style"; The Erstwhile Philistine "Literary crimes"; Martin's own interviews)
1. DEFAULT MODE "LUCID AND FUNCTIONAL"; short declaratives where things move; sentence length varies by scene type.
2. ANGLO-SAXON WORD STOCK chosen consistently; Latinate avoided by default. Systematic compounds (sellsword, smallfolk, godswood) do the world's strangeness.
3. THE SENSORY CONCRETE NOUN carries atmosphere ("word paintings": orange trees, purple olives, cool linen). Martin: books "richly textured and full of sensory detail".
4. ONE TIGHT VIEWPOINT: "a limited but very tight third person" — what is noticed is what that person would notice.
5. TERSE CHARGED DIALOGUE; deliberate repetition for atmosphere.
6. THE FLAWS TO AVOID: stock phrases repeated to tic ("mummer's farce", "jape", "much and more", "oft", "whilst", dropped -ly); tonal breaks when modern idiom sits beside archaism; over-description; sentimental cliché.

### 1c. D&D official read-aloud and manual prose (Dyson's Dodecahedron citing Decker & Noonan; DM's Workshop; Sly Flourish; The Alexandrian; Half-Cover)
1. THERE IS NO PUBLISHED WOTC 5E STYLE GUIDE (Half-Cover); conventions are inferred from the books, and the house guide reaches DMs Guild creators privately.
2. LENGTH IS THE LAW. Listeners stop attending after about two sentences (Decker & Noonan via Dyson); a paragraph break in boxed text is "already too long by half" (DM's Workshop); "1-2 sentences is the sweet spot", three the maximum (Alexandrian); cut a quarter of what you wrote (Sly Flourish).
3. FACT ORDER IS THE READER'S EYE ORDER: what is seen first, exits, counts, the obvious object. Players missed floors, exits, monster counts, and "the lady in the room is a corpse?" (Dyson).
4. NEVER PRESUME THE READER'S ACTION ("upon approaching…"); second person present for read-aloud; conversational not novelistic.
5. ONE MAIN THING per passage, decided before writing (Sly Flourish); sensory detail is allowed but "the facts should drive the prose".
6. MANUAL PROSE: terminology fixed across chapters, rules text precise, flavor short (Half-Cover).

### 1d. The governing essay: Le Guin, "From Elfland to Poughkeepsie" (1973) and Steering the Craft
"A plain language is the noblest of all. It is also the most difficult." The Poughkeepsie style is "not really simple, but flat … not really clear, but inexact". Her test: rewrite the dialogue in modern idiom and see whether the fantasy survives. She praises plainness with rhythmic care and distance without costume; she condemns archaism as costume, purple ornament, borrowed diction. Steering the Craft: "the sound of the language is where it all begins"; vary sentence length; adjectives and adverbs "rich and good and fattening", do not overindulge (the "chastity" exercise).

## 2. Where generated prose fails (the finder agent's twenty sources, ranked by how many name each; the chair's four studies)
Ranked master list (n = sources naming it): punctuation tics, em dash (7, one disputes) · abstraction where a concrete fact belongs (7) · reflexive antithesis "not X but Y" (6) · uniform rhythm, low burstiness (6) · no subtext, over-explaining (6) · lexical tells: delve, tapestry, testament, quietly (5) · portentous vagueness and summarising closers (5) · homogenisation across outputs (5) · tidy resolution (4) · cliché and repeating pet words (4) · lists of three (4) · flat voice (4) · local coherence with global incoherence (4) · over-structuring (4) · risk aversion (3) · copulative avoidance, "serves as", "stands as" (3) · purple prose (2).
The three findings that outrank the list:
1. THE STRONGEST TELL IS STRUCTURAL, NOT LEXICAL. StoryScope (Russell et al. 2026) reaches 93.2% macro-F1 from discourse features alone; stripping "tapestry" and em dashes leaves the discriminating signal intact. Chakrabarty, Laban & Wu (CHI 2025): professional editors' fixes to 1,057 LLM paragraphs were awkward word choice 28%, poor sentence structure 20%, redundant exposition 18%, cliché 17%, then purple prose, LACK OF SPECIFICITY, tense drift.
2. THE TASTE INVERSION. Experts rated human stories higher (+1.25); non-experts and LLM judges rated AI stories higher (+1.19 to +1.85) (Ismayilzada et al.). A gate built on a model's self-assessment grades in the wrong direction; the owner's eye and a measured rubric are the only honest judges.
3. BETTER MODELS ARE MORE UNIFORM, NOT LESS (O'Sullivan; Doshi & Hauser: individually more novel, collectively 8.9–10.7% more similar). A corpus written by one hand in one session will converge on one cadence unless the rubric forces spread.
Lexical studies (Kobak et al. 2025; Juzek & Ward 2025; "Word Overuse and Alignment" 2025): 66% of excess style words are VERBS; the 21 focal words (delve, showcase, boast, underscore, comprehend, intricacies, intricate, surpass, garner, emphasize, realm, groundbreaking, advancements, aligns); the cause sits in learning-from-human-feedback, not the training corpus. Jakesch et al. (PNAS 2023): 4,600 people could not detect AI self-presentation; their heuristics were exploitable. Gorrie (Dead Language Society): "What the LLM lacks is not technical ability, but taste" — the devices are legitimate; the failure is not knowing WHEN.

## 3. Our own corpus, measured (read-only probe over the §900 composed tip, 6e8692b36; scratch `prose-research/probe.mjs`, results in `corpus-metrics.json`)
Populations: dossier-state 2,264 variants / 2,914 sentences · dossier-causal 468 / 531 · news pools 699 / 826 (string-literal extraction; approximate).

WHAT WE ALREADY DO RIGHT (measured):
- Lexical AI tells are essentially absent: delve, tapestry, testament, intricate, pivotal, underscore, showcase, beacon, nestled, vibrant, meticulous: ZERO in 2,734 dossier variants. "realm" 8 (all the product's own noun). Em dashes ZERO in the projected corpus. Questions ZERO. Digits ZERO.
- Sentence length is genuinely varied in the state corpus: mean 16.7 words, sd 7.2, p10 7, p90 26; 13% of sentences under eight words. That is burstiness the studies say models lack.
- Concrete civic nouns carry the meaning (the granary, the outward column, the departure rolls, the licence register); present tense; the angle palette gives seven standpoints.

WHERE WE HAVE OUR OWN TICS (measured; these are the "pet words that repeat" of Chakrabarty's expert panel, in the house's costume):
| tic | count | rate | what it is |
|---|---|---|---|
| "rather than" | 288 | 10.5% of variants | the reflexive antithesis, house edition |
| ", which is / which means" tail | 123–149 | ~5% | the appended gloss: the sentence explains what it just said |
| semicolon | 386 state, 169 causal | 13% / 32% of sentences | two ideas stapled; the causal register's "one flowing sentence" law drives it |
| second sentence opening "That is / It is / This is" | 80 | 3.5% | the summarising closer |
| "nobody / no one / nothing" | 333 | 12% | negation-as-wit |
| "still" 149 · "yet" 61 · "already" 26 | | | the time-hedge family |
| "its own" 70 · "whatever" 49 · "enough to" 97 · "kind of / sort of" 29 · "quiet(ly)" 37 | | | pet words |
| abstract-noun closers (-ness, -tion, -ity, -ment) | 128 | 4.4% of sentences | the sentence ends on an idea instead of a thing |
| pools where EVERY variant has the same sentence count | 407 of 708 | 57% | uniform shape inside a pool |
| pools with a repeated two-word opener | 79 of 708 | 11% | same cadence twice |
| causal corpus sentences over thirty words | 49% | | the long register with no short relief |

The verdict: our prose does NOT fail on the list the internet checks for. It fails, mildly and in its own voice, on the STRUCTURAL items the studies rank highest: the gloss (over-explaining: "which is its own kind of record"), the reflexive contrast, the uniform pool shape, and a small pet-word set. The reconstruction targets THOSE, sentence by sentence, and leaves the substance and the slots alone.

## 4. The reconstruction rules (the reconciliation: our voice + the exemplars − the failures)
Each rule keeps the estate's own laws unchanged: no digits · no em dash (V-26a) · STATE never FATE · finite semantics (a sentence asserts only what its slots and band carry) · setting-agnostic · the address law · audience marks · a pool's LENGTH is a seed input (variants rewritten IN PLACE, none added or removed) · T5 (a band-blind variant asserts no duration) · every rewrite is a DECLARED same-seed text shift (precedent §898).

R1 FACT FIRST. The first clause carries the fact a listener would otherwise miss (Dyson; the bible's pillar 5). The standpoint shows in WHAT is noticed, not in commentary about it.
R2 ONE IDEA PER SENTENCE (the bible, pillar 2). A semicolon only where the two halves are ONE fact seen twice; at most one per variant; the causal register keeps its "one flowing sentence" law but may be two sentences.
R3 THE GLOSS TEST. A tail (", which is…", ", which means…") or a second sentence that tells the reader what the first MEANT is cut, or replaced by a second FACT (Le Guin's exactness; Kole's "no subtext"; pillar 8). Test: cover the tail; if nothing the town could be checked on is lost, it goes.
R4 CONTRAST ONLY WHEN THE CONTRAST IS THE INFORMATION. "rather than" and "not X but Y" stay when the rejected alternative is a state the town could actually have been in (empty vs thin exports); they go when they are rhetoric.
R5 POOL SPREAD. Within a pool, variants differ in sentence COUNT and OPENER as well as angle; no two share their first two words; where the band allows, one variant is ten words or fewer. (Doshi & Hauser; O'Sullivan.)
R6 CLOSE ON A THING. Prefer a civic noun at the end of a sentence over an abstraction; the abstraction is allowed when the abstraction is the fact (legitimacy, exhaustion).
R7 REGISTER BY ANGLE (Shippey's per-speaker register, our seven angles): [ledger] plain, countable, Martin's functional mode · [street] short, contractions allowed, the town's own idiom · [visitor] the seen and heard thing first, Martin's sensory noun · [elder] the elegiac note, ONE older word allowed and never a costume (Tolkien's sparing archaism) · [unfolding] present progressive, the movement · [counterforce] the plain negative, no wit · [threshold] the edge stated, no prediction (STATE never FATE).
R8 THE READ-ALOUD LAW FOR NEWS. A news line is at most two sentences and at most twenty words a sentence; who, what and where in the first (Decker & Noonan; Alexandrian).
R9 NO COSTUME. No decorative archaism (oft, whilst, amongst, ere, -eth); an Anglo-Saxon word over a Latinate one where both exist; "quietly" and "quiet" rationed as the magic adverb (tropes.fyi; the corpus's 37).
R10 RHYTHM. Vary. A long sentence earns itself by carrying a chain of causes; a short one lands a fact; never three of a length in a row (Le Guin; Rosebury).
R11 PET WORDS RATIONED, per file, shrink-only: rather than · which is · nobody/nothing · its own · whatever · enough to · kind of · quietly · still/yet/already.
R12 RECONSTRUCTION DISCIPLINE. Same slots, same marks, same claims, same band, same pool length, same angle tag; digit-free; V-26a clean; the wave is declared as a text shift and the owner sees the taste sample first.

## 5. The rubric (what an ADVISORY walker counts; never a gate at first, a shrink-only ratchet later)
Per corpus file, per variant: lexical tells (the 21 focal words + tapestry/testament/beacon/nestled/vibrant) · "rather than" rate · gloss-tail rate · semicolons per sentence · summarising second sentences · abstract closers · pet-word rates · words-per-sentence sd per pool (burstiness) · uniform-shape pools · shared-opener pools · causal over-thirty share. Baselines are the table in §3. Direction: every column shrinks or holds; the walker prints the sentence, never a score alone (the taste inversion says a score is not a judge).

## 6. The program (sequenced; the owner walks the sample before any wave)
1. This dossier → `docs/content/PROSE_STYLE_DOSSIER.md` (a docs car, at the §901 landing or later; no `file:line` citations so no citation walker reds).
2. The rubric walker (advisory, `tests/lint/proseRubric.walker.test.js`, parked output, a census row later).
3. THE TASTE SAMPLE: forty sentences before/after (`TASTE_SAMPLE.md`, this kit) for the owner's eye.
4. The reconstruction wave: Opus lanes, one corpus doc each (RECEIPT_POOLS_DOSSIER_STATE.md by cluster; CAUSAL_DOSSIER; the news pools), each variant rewritten in place under R1–R12, projected, walked, declared as a text shift; the fingerprint law checked before (a display label can be a persisted hash input) — prose variants are display-side and not persisted, but the check is owed per file.
5. Sequence: after the owner's walk, before the diagnostic soak (assumption stated to the owner; veto open).
