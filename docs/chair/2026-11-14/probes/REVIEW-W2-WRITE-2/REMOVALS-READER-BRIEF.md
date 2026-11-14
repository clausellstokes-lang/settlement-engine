# Removals reader brief (REVIEW-W2-WRITE-2, step 2)

You are a cold reader for an independent reviewer of a fantasy-settlement generator (settlement-engine). You fix nothing
and change nothing in any repository. You read files, run read-only node scripts, and write ONE output file.

A corpus lane re-gated or struck lines so that they no longer print in some towns. A count falling is not a cure: you
read what was removed, and what prints in its place.

## What you have
- `<LIST>`: a JSON array of REMOVALS. Each has `id` (block::pool::vN), `text` (the removed line with `{slot}`s),
  `kind` (re-gated / struck / reworded+re-gated), `removedFrom` (how many towns lost it), and `read`: up to 30 of those
  towns, each with `tier`, `stress` (the crises in force), `mount`, `removedSentence` (the sentence as it printed there
  BEFORE the change), `baseParagraph` (that mount's whole paragraph before) and `tipParagraph` (the same mount's
  paragraph NOW, after the change). `removedSentence: null` = not found; then judge from `baseParagraph`.
- Pages as the owner sees them NOW: `<R>/dumps/<town>.txt` (every tab, `== Group/Tab ==` headers); records
  `<R>/records/<town>.json.gz` (gzipped JSON; query by script, never print whole). Useful paths: `tier`, `population`,
  `stress` (one object or an array), `config`, `institutions[]` (name, category, status), `economicState`
  (`prosperity`, `primaryImports`, `primaryExports`, `activeChains[]`, `foodSecurity`), `powerStructure`,
  `defenseProfile`, `history`. The record is the same before and after (only the prose changed).
- DO NOT open any file under `docs/chair/` in any tree, and do not run `git log`/`git show` or read commit messages.

## What you do, for EVERY town of EVERY removal
1. Was the REMOVED sentence true of this town, by its record and by the rest of its page? (TRUE, or FALSE with a
   severity by the scale below and the fact against it.)
2. Is what prints IN ITS PLACE (the part of `tipParagraph` that replaced it: the sentence that differs from
   `baseParagraph`) true? If nothing replaced it (silence), say so.
Check candidates against the record by script before you call them false. Then per removal give the counts.

## The scale (verbatim from the program's readers' brief; its words about V1-V5 versions do not apply here)
Read EVERY line of each of your towns' V1 page, end to end, as the town's owner (a game master) reads it, and every
line of the V2–V5 sections. For each sentence ask: is it true of THIS town, by its record and by the rest of its own
page? List every sentence that is false or broken. Kinds:
- (a) names a house, a role, a force, a good or a place the town LACKS (a priest where there is no church; a market,
  guild, garrison, walls, gates, harbour, docks, smithy, river, coast, mine... the record does not have);
- (b) DENIES something the town HAS (e.g. "no tannery finishes it" beside Tanners; "No one here works the timber"
  beside a timber chain that runs);
- (c) presumes a STATE that is not so (normal trade, plenty or calm under a siege/famine/occupation in force; food
  brought in by trade under a siege that cuts every road; a crisis the town does not have; a chain "running" that the
  record says is impaired; a resource worked that is depleted or absent; a prosperity, ruler or power that is not the
  record's; a holder of the reserves who is not the one the record names);
- (d) a SIZE that is not so (districts, streets, quarters, crowds, a council of many in a thorp of 12);
- (e) a COUNT that is not so;
- (f) a FIGURE against the record's (days, weeks or months of food, a population, a percentage, a rating);
- (g) TWO PLACES ON THE PAGE THAT DISAGREE;
- (h) BROKEN or INTERNAL text: `undefined`, `NaN`, `[object`, a `{slot}`, a slot filled with the wrong kind of word
  (e.g. "its days of legal", "reeds reserves"), a catalogue name with a count range such as "(10-30)" or a gate such as
  "(high magic)", an identifier, a debug or chip row (e.g. "2-order chain", "covers X, Y"), a provenance tag printed as
  a line ("(smuggling)"), a badge that is not so ("YOU" on a house the user did not add), a sentence cut off or
  ungrammatical to the point of misreading, the machinery of a rating (points, sums, pay shares, limits, slider names:
  the owner's rule "show the ratings, not the machinery").
Verify each candidate against the record (query it) before listing it. If the record cannot settle it, say so in `fact`
and give it LOW. A sentence that is merely dull, repetitive or awkward but true is NOT listed.
NOT faults (the owner's recorded designs; do not list): burials and rites shown under Healing; a style-rule text in the
Daily Life capture (never visible). Income lines that name a working the roster lacks ARE listed, with `"section7": true`.

Severity: HIGH = a plain false statement a GM would read out and be wrong about the town at a glance (a house, force,
ruler, crisis, size or count that is not so; normal times stated under a crisis; broken text). MED = false when checked
against the record or another part of the same page. LOW = a stretch, a doubtful case, or a nuance only a careful
reader would catch.

## What you write
ONE file `<OUT>`, a JSON array, one object per removal in list order:
{ "id": "...", "read": n, "removedTrue": n, "removedFalse": n, "removedFalseWorst": "HIGH"|"MED"|"LOW"|null,
  "examples": [ {"town": "...", "removed": "...", "true": bool, "severity": ..., "fact": "..."} ] (every false one, and one true),
  "replacement": { "silence": n, "true": n, "false": n, "falseExamples": [ {"town":"...","sentence":"...","severity":"...","fact":"..."} ] },
  "note": "<one line>" }
Be terse. A false sentence you miss is the costly error; a true one you call false wastes a builder's hour.
