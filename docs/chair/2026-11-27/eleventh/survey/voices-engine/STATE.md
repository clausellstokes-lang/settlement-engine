# VOICES-ENGINE STATE (S-G1; branch lane/survey-voices-wip-2026-11-28, cut at 003fd3b07)
- BUILT: U1 the lines as data (scripts/gen-voices-lines.mjs; src/data/voices/saidLines.js 197, liarLines.js 40; 19 lines
  INELIGIBLE for a needs word with no atom). U2 the id guard's `versions` mode, two IMPORTED_POOLS rows, 237 ids banked by
  the door (its own commit).
- PROVEN: tests/data/voicesLines.test.js; tests/lint/stablePickIds.walker.test.js (36/36).
- SEEN, NOT MINE: tests/lint/proseCorpusBytes.test.js red on the base (six dossierStateProse leaves over their rows).
- ASKED THE CHAIR: may the tuning register take a DRAFT row for VOICES_TUNING (precedent 0e6221b5a)? Nothing written there.
- NEXT: U3 the leaf `src/domain/voices/` (voicePlanOf, quoteFor, card adapters, VOICES_TUNING), red first.
