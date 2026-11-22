STATE (2026-11-22, parked by the chair on the owner's word): RED. The tip has the annex and the WORD_CORRECTIONS row for v6 (E60, by option (a)) and the census literals 612/249. The leaf has NOT been projected.
UNPROVEN, none of it run: the projection, `gen:dossier-prose -- --check` exit 0, the census red-first and green, confinement, `tests/lint` whole, the governing files, eslint (beyond the pre-commit hook), the fills.
NEXT STEP: `npm run gen:dossier-prose`, then `--check` (it must exit 0). Then correct the cc2f43aee census note and re-measure QUALIFY 392 -> 391. Then do the brief's PROOFS.

# ECO11-V6 builder report (PROSE-5's seat; base 482feb7f1)

## Commits
- `1c1137594`: the annex line v6 now holds the E60 words. The `WORD_CORRECTIONS` row `POINT89-CHAIR-2026-11-22-V6` is re-pointed: `from` 380eb031… (the leaf's committed point-94 text), `to` dbe3f72a…, ruling `E60-CHAIR-2026-11-22`. Its comment names both rulings. RED, because the leaf is not projected.
- `bf17d3c57`: `tests/lint/proseWiringCensus.walker.test.js`, the literals THIN 613 -> 612 and COVERED 248 -> 249 only. RED, because the wording is not projected and the note is not yet corrected.

## The brief's error (EXECUTED)
The brief said the row "keeps its `from`" (f745a2b6…, the text before point 94). The numbering guard refused that row. `node scripts/generate-dossier-state-prose.mjs --check` exited 1 with: "its row of WORD_CORRECTIONS does not answer them (the row's old-text hash is not the baseline's words); the row these words need: { …, vid: 6, from: '380eb031…', to: 'dbe3f72a…' }". PROSE-5 ruled option (a): the row exactly as the refusal printed it, the same route 9ae014014 took. The brief's "keeps its from" was wrong.

## Measured cause of the census move (EXECUTED; `moveGrammar.js :: orderIdOf(classifyMoves(text))`)
| text | grammar |
|---|---|
| old v4, before 9513ba024 ("… is worked out and coming back on its own, at the ground's own pace.") | OBJECT |
| v4 now | V4 |
| v6 before 9ae014014 | V4 |
| v6 at point 94 | V4 |
| v6 under E60 | OBJECT |

So the pool's second grammar was lost at 9513ba024, with v4, not with v6. The cc2f43aee note that names v6 as the cause is NOT YET corrected.

## Other findings (EXECUTED, by search)
- No file under `tests/` quotes the old v6 text (`for the present, but not for good`: no hits outside the census).
- None of the DS-ECO-11 worked-out rows in `tests/domain/corpusEcoTailGuards.test.js` names v6. They name v2, v3 and v5.
- `tests/helpers/pageLaws/law8.mjs` SPENT_SENTENCE matches the prefix "Nothing more can be taken from the ". That prefix is the same in the old and the new v6.
- `drawVariant` (stateProseKernel.js) keys each draw by `seed::block::pool::v<vid>`, never by the text. That no town's draw moves is INFERRED from this code; the town-by-town proof was not run.
- The 15 `natural` resources in `RESOURCE_SEMANTICS` are all of type `renewable`.
