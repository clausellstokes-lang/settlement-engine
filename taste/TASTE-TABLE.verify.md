# TASTE-TABLE.verify.md (Fable verifier, 2026-09-09)

Method: every figure the table labels CONFIRMED was re-derived from the named file with a command run at the seat (node -e over the four harness JSONs, the three gate JSONs and the token file; sed/grep over gate-verdicts-r1-r3.txt, receipt-taste.md, RESUME-NOTE.md, the two briefs, taste-measure.mjs; git log in laneTASTE and laneTASTEB; md5 on the script in both docks). The refuters' 42 variant verdicts and 14 read-aloud rows in the dispatch prompt were mapped against the parity list pool by pool and re-tallied.

## Count

CONFIRMED figures checked: 916 by my tally (frame 25 · instrument facts 38 · shared top-level 28 · per pool 686 over seven pools, of which 252 are per-face word counts and 63 the band/length statistics · totals 2.1 40 · draft phase 2.2 35 · section 3 34 · section 3b 30). Em dashes in the table: 0 (grep count, both em and en dash). measure-shapes.json: absent, as the table says. No CONFIRMED figure is without a file behind it; no invented number found.

## Mismatches

1. Section 0, row "arm B's own re-measure of the draft", claims measure-B-baseline-draft.json is "byte-equal in every pool figure" to measure-draft-base.json with "only at/seconds/rounds.files differ". A recursive JSON diff (node -e) shows the true difference set: top-level `arm` ("draft" to "B"), `round` (4 to 0), `at`, `seconds` (30 to 10), `walk.msPerUnit` (0.625 to 0.205), `walk.exhaustiveMs` (255 to 84), and on every one of the seven pools `rounds.refineA` and `rounds.refineB` (false to true) beside `rounds.files` (4 entries to 6). Every measured pool figure (lengths, band, walk, owned, inherited, provenance, siblings, inBand, failing) is identical, so the substance holds, but the stated residue is incomplete: two pool-level flags and four top-level fields also differ.

## Notes (not charged as mismatches; recorded because the brief says default to a finding)

- Section 2.2, gate agents row: "round 4: 20,234 and 2,098, the second being the killed round-4 gate of receipt M-9.0". In tokens-old-run.json the 2,098-token agent (a59714c6, 28 messages) ran 05:18 to 05:19 and the 20,234-token agent (a5d405ec, 76 messages) ran 05:55 to 06:01, so chronologically the killed gate is the FIRST round-4 gate; "second" is true only of the table's own listing order. M-9.0 confirms the killed gate left nothing behind.
- Section 2.3, "276,512 output tokens across 7 Fable refuters (dispatch prompt)": not labelled CONFIRMED. On disk it appears only as restatements in $SC/payload-918.json and $MY/sitting-T.final.md; the nine wf_73595d81-51d inflight journals under prose-research/sweep/inflight carry no usage field, so the figure cannot be re-derived from a primary file at this seat.
- Section 0, instrument fact 2, "used at line 854 as the ground for holder resolution": line 854 is `const captured = tasteTown(INTERESTED_TOWNS[0])`; the resolution call itself is line 859 (`sourceOfForTown(row, captured, {})`). The claim is correct in substance.
- Section 1.5 and 1.7, "A3 x12": the JSON's `klass` field is the empty string on those inherited rows; the `arm` field reads "A3" and the label "A3 · the band half is the refuter's", so the attribution stands.
- Section 4 percentages: arm B output 254,259 / 209,197 = 21.5 percent more (table "22"); arm A input 90,636,942 / 79,888,427 = 13.5 percent more, exactly 13.455 (table "13"). Both round as printed.
- Section 5 row 8 cites the chair's `band-probe.mjs`; it exists at $MY/band-probe.mjs beside chair-rederive.txt. RESUME-NOTE.md line 93 carries the re-derivation the table quotes.

## Blind mapping and the refuters' figures

Every X/Y label in sections 1.1 to 1.7, 2.1 and 4 was checked against the parity list (walled X=A Y=B; unwalled X=B Y=A; revealed X=A Y=B; covert X=B Y=A; stores-short X=A Y=B; importfed X=B Y=A; purse X=A Y=B). No label is attached to the wrong arm: each arm row's FAIL/WITHHELD/PASS count, each findings paragraph and each read-aloud sentence sits on the arm the parity list names (42 verdicts and 14 read-aloud rows checked one by one against a quoted face in each). Re-tallied totals: arm A 12 / 2 / 7, arm B 14 / 2 / 5; PASS by pool A walled 2, unwalled 0, revealed 0, covert 2, stores-short 2, importfed 0, purse 1; B walled 1, unwalled 0, revealed 0, covert 1, stores-short 1, importfed 1, purse 1; all as the table prints.

Figures in the prompt's verdicts the table omitted (all minor, none mis-mapped):

- 1.2 B(X) v1 read-aloud: "face a runs to seventeen words" (the table keeps "drops on 'in'").
- 1.3 B(Y) v1 read-aloud: "1.c at twenty-one words" (the table keeps "doubles the beat audibly").
- 1.4 A(Y) v1 read-aloud: "1a runs eighteen words with the doubled holds" (the table keeps the doubled holds, not the count).
- 1.6 A(Y) v1: the licence citation "bandLadders.js:163" for Import-Dependent.
- 1.7 B(Y) v2: the producer citation "defenseGenerator.js, the milUpkeepMult block".

## Verdict

1 mismatch (section 0, the baseline-draft residue understated: arm, round, walk.msPerUnit, walk.exhaustiveMs and every pool's rounds.refineA/refineB also differ); every other CONFIRMED figure re-derives from its named file, and no X/Y label is mis-mapped.
