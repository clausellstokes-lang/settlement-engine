# THE PROSE PROGRAM — FINDINGS SO FAR (chair, Fable 5.1, 2026-09-05 21:40; written for the owner and for any successor after a cutoff)
Labels: CONFIRMED = measured or verified against raw source text; PLAUSIBLE = a reading or a forecast. Sources: `PROBE_ALL.md` (34,508 rows, 20 registers × 47 metrics), `PROSE_INVENTORY.md`, `RULES-V2-DRAFT.md` (Part A corpus laws, A′ per register, B0 measured directions), `primary/*.fingerprint.json`, `sweep/section-{tolkien,martin,dnd}.md` + their critics, `failure-modes-sources.md`.

## 1. OUR PROSE (CONFIRMED, measured)
- It has ZERO of the lexical AI tells the internet checks for, real burstiness, and none of the punctuation tells (zero em dashes, questions, exclamations, digits — kept on purpose). It is NOT AI-flavoured. Its failures are STRUCTURAL and house-flavoured.
- The gaps against the exemplar fingerprints (Martin two gears, Tolkien's Letters, D&D rules/flavor), per 1,000 words or per sentence:
  | measure | ours | exemplars | what it is |
  |---|---|---|---|
  | "rather than" per 1,000 words | 5.33 | 0.00–0.32 | 259 of our 323 antitheses are this one phrase |
  | gloss tails (", which is …") | 0.051 (dossier 0.066) | Martin's chronicle 0 | a qualification hedged into a subordinate clause instead of its own sentence |
  | sentences ending on a pronoun | 0.134 | 0.021–0.108 | 253 sentences land on "it" instead of the civic noun |
  | neighbour rhythm variation | 0.399 | 0.50–0.73 | the widest gap: sentences of the same length in a row |
  | long sentences (30+ words) | 2% | 9–34% | we never let a sentence run |
  | same opener as the previous sentence | 0.132 | 0.03–0.10 | the crier 0.42 |
  | triads of three nouns | 0.009 | 0.045–0.213 | a device we barely use; Martin's chronicle argues by lists of three |
  | vocabulary (type–token at 4k) | 0.211 | 0.24–0.35 | the narrowest column in the table |
  | semicolon splices | 13% state / 32% causal | — | plus 407 of 708 pools uniform in shape |
- By register: the Herald's receipt pools are the HEALTHIEST (12.2 words, one in five under eight, tic-free) but less varied than the exemplars; the crier is a formula ("and the country" in 7% of lines); the NPC cause-conjunction ladder has the estate's strongest tic ("It is public / It is known" opens 184 lines, 18× the median) and no short sentence at all; the causal join is long by law (half its sentences over thirty words); the generators' arrival scenes are the estate's best rhythm. The bible's two axes DISAGREE: mechanical compliance is near-perfect; style distance is real.

## 2. THE EXEMPLARS (verified claims only; counts are kept rows)
Tolkien 356 of 373 claims kept, 25 features · Martin 325 of 330, 41 features · D&D 47 of 49, 19 features (⚠ D&D from ONE angle and a SUPERSEDED 2013 style guide — round 2 running). The laws the three CONVERGE on, each with the reconstruction rule the sections derive:
1. A plain modern base; the register rises by ONE word or ONE fronted phrase only in the sentence that touches the old thing, and returns to plain in the next (Tolkien 1–3; Martin 6).
2. Native-root diction; institutions named by compounding two plain roots (moot-hall, tithe-barn, ward-reeve); Latinate words only as the mark of an office (Martin 1–4; Tolkien 8, 13).
3. Archaism as salt with real dates (reeve, hundred, tithe), never manufactured (no mayhaps, must needs, oft); no word from the reader's century; one old word a paragraph, three is a costume (Martin 5–7; Tolkien 12).
4. Short declarative sentences, one fact each, chained by "and" — the reader supplies the logic; the first sentence could stand alone (Tolkien 4; Martin 8, 10).
5. Adverbs of manner almost none, and where one appears it carries the town's own judgment (Martin 9).
6. A STATED VANTAGE — the clerk, the annalist — that licenses rumour, dispute and contradiction left standing, each labelled; the knower's limits checked sentence by sentence (Tolkien 17–18; Martin 20–22; D&D 13). This is the "evidence beneath belief" device the owner asked for, and it is already the exemplars' consensus.
7. Feigned history: the found record, the antiquarian prologue, casual incomplete mention, untold stories (Tolkien 17–18); measure literal — miles are miles, weather is weather (Tolkien 22).
8. Description states what stands there in the present; no arrival, no reader's reaction; history rationed and told as the events that explain what stands now; entries slotted the same way every time; the prose amplifies the figures and never restates them (D&D 7, 9, 10, 12).
9. Ornament rationed to two places, the land and the disaster; the supernatural rare and implicit (Martin 14, 30).
Where the sections DISAGREE (open, for the reconciliation): whether the archivist may move (Tolkien's invitational outline vs Martin's moving sentence and the director's shot); which of four first-sentence rules governs; the boundary between the base lexicon and the rationed old word; the four-sentence cap (one source).

## 3. THE AI-FAILURE CATALOGUE (v1 CONFIRMED from 20 sources; the four-angle sweep 195 of 254 verified, section pending)
Ranked by sources naming it: em-dash tics · abstraction where a concrete fact belongs · reflexive antithesis ("not X but Y") · uniform rhythm · over-explaining, no subtext · lexical tells (delve, tapestry, testament…) · tidy endings. We fail only on the structural three (the gloss, the reflexive contrast, the uniform shape) — mildly, in our own voice.

## 4. WHAT IT IMPLIES (B0, measured directions; the SIZE of each move is Part B's, after the reconciliation)
"Rather than" goes first where no sibling key names the alternative · a qualification gets its own sentence · land on a noun · spread the rhythm (a short sentence beside a long one; vary openers) — NOT longer sentences by default, the two-sentence law stands · triads where three concrete things exist · vary the civic noun and verb across a pool's variants within the finite-semantics law · keep every punctuation law we already keep. The reconstruction is three moves per sentence, display-side registers first (the ladder, the crier, the dossier state pools), the Herald's engine-side pools not before the golden freeze.

## 5. WHAT IS NOT DONE / CAVEATS
- A quarter of the Tolkien rows are Wikipedia paraphrases; the primary critics (Drout 2004, Raffel 1968, Shippey direct; for Martin: Young 2019, Larrington, the chronicle register) are in ROUND 2, running/queued. 29 Tolkien rows and 7 D&D rows are being regraded to a visible PARTIAL. Kay, Le Guin, Wolfe, Hobb: not started (full four-angle sweeps queued). The reconciliation across all of this and our corpus: not started, by the owner's order.
- The v1 taste sample was WITHDRAWN (27 of 31 failed the refuter); no new sample until it passes `check-pair.mjs` and an Opus refuter. Nothing in the corpus has changed. The AIM sentence waits on the owner.
