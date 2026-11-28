# VOICES-ENGINE: THE TIP, FOR THE INDEPENDENT READER (S-G1; 2026-11-28)

The tip is the head of `lane/survey-voices-wip-2026-11-28`. Its unit commits run 5d780bd33 → 96cb62121, after the last
tip b53f26f39, and every one is red first (each commit message says how). The files beside this one:
- `MEASURE.md`: C and V, the six sizes.
- `TEN-TOWNS.md`: the twelve towns as text, with my reading.
- `INELIGIBLE.md`: the word map (each word and where it is answered) and the ineligible list (none).
- `CLASS-HITS.md`: the presumption-classes hits, each answered, and the changed words.
The chair's rulings for this seat are all in `survey/RULINGS-VOICES-ENGINE.md` on the chair's record, with G1-4 in
CLASS-HITS.md.

## The tuning: `src/domain/voices/voicesTuning.js :: VOICES_TUNING` (a DRAFT row; every value is the owner's to sign)

| leaf | value | what it does, in plain words |
|---|---|---|
| `odds.weighty` | 0.75 | the chance that a weighty card has someone speak on it. Weighty means: the crisis; a catastrophic tension; the ruling power or one with a stake; a house the crisis casts or marks; a founding rite; a person of high influence or in the crisis's cast (`cardsOf.js :: WEIGHTY`) |
| `odds.lesser` | 0.25 | the same chance for a lesser card |
| `sizeFactor.thorp` | 0.5 | in a thorp those chances are halved: small places are quieter |
| `sizeFactor.hamlet` | 0.5 | the same in a hamlet |
| `sizeFactor.village` | 0.75 | in a village they are three quarters (a town and up: whole) |
| `tabBudget.weighty` | 2 | a tab's weighty cards together expect at most about two quotes (each card's chance is capped to share it) |
| `tabBudget.lesser` | 1 | a tab's lesser cards together expect at most about one |
| `tabCap` | 3 | never more than three quotes on one tab |
| `personCap` | 1 | one person speaks at most once on a page |

The row in `tests/lint/.tuning-register.json` is `status: draft` with `signedAt: null`, units filled and band null
(fbf76d6f6). The inventory was re-taken by its door (4bc73e1b6).

## Where `inTruth` lives

It lives in `src/data/voices/liarLines.js`, at `LIAR_LINES[group][i].inTruth`, one note a line, generated from the
TSV's column. It is read only through `domain/voices/voicePlan.js` (the guard tests/lint/voicesLinesImporters.test.js
holds that no other file names the lines). It is printed only by the screen's `CardVoice`, as the DM line
("DM In truth, …"), and only for the OWNER's audience: the plan is empty for any other audience (the player view and the
share print no quote; voicesShareSilent.test.jsx plants it). The PDF's twin drops a liar quote altogether, and so does
the session card (the measures: PDF and session quotes differ from the screen's in 0 towns). Since G1-4 (e) an
`inTruth` answers to every rule a surveyor's line does: no speaker exemption.

## The PDF worker's +103,698 B (the lines): what fetching them only when a page holds a quote would cost (NOT BUILT)

Compute the plan on the main thread, where the screen already holds it once the tab is open. Hand the PDF worker the
quotes it prints, serialised (kind, id, text, signature; never a liar's line), beside the town it already receives. The
twin then reads them from its props and never imports the lines. Its cost:
- one field on the worker's message, and the twin's `printedQuoteOf` reading that field;
- the main thread loading the lines before a PDF is asked for (one dynamic import, as the tab already does);
- a test that the PDF worker's bundle holds no line, and a parity test (the PDF's quotes equal the screen's; the
  measure already does this).
About two seat-hours. It removes about 103 KB from the PDF worker and adds nothing to the first paint.

## The liar's line (V-1 (b)), as built

The holder's own house's group comes FIRST: the tie's way through that house and its family (`office.hall`,
`office.faith`, `front.trade`, `front.other`, `retainer`). The criminal house's kind (`smuggling`, `theft`, …) is taken
only where that group gives no line the record admits. In your words, "the house-kind group" is the holder's house's
and "the tie's-way group" is the criminal kind's, and every line is asked through the door. So a smuggling line does not
land on an arts college: in Grudko and Ulfhammer the college masters now speak `retainer` lines.
