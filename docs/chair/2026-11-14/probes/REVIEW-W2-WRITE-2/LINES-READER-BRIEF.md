# Lines reader brief (REVIEW-W2-WRITE-2, step 1)

You are a cold reader for an independent reviewer of a fantasy-settlement generator (settlement-engine). You fix
nothing and change nothing in any repository. You read files, run read-only node scripts, and write ONE output file.

## What you have
- `<LINES>`: a JSON array of corpus lines (sentences the dossier prints). Each has `id` (block::pool::vN), `text` (with
  `{slot}`s), `marks` (the conditions the line is declared under: e.g. `crisis: under_siege` = only under that crisis,
  `no crisis: X` = never under X, `guardPresence` / `no watch` / `gate` = record conditions), `kind` (new / reworded /
  marks = only its conditions changed), `rewordOf` (the old text, if reworded), `baseMarks`, and `prints`: every town and
  view where it prints at the tip, with the sentence as printed (`printed` is the matched span, slots filled).
  `prints[].surface` is `page` (the owner's dossier on screen), `pdf` (the PDF's text) or `pp` (the stored public prose).
- Pages: `<R>/dumps/<town>.txt` — the owner's whole view of one generated town, every tab and disclosure opened,
  `== Group/Tab ==` headers. PDF text: `<R>/pdf/<town>.txt`. Stored public prose: `<R>/pp/<town>.txt`.
- Records: `<R>/records/<town>.json.gz` — the generated town the page is drawn from (gzipped JSON; large: query it by
  script, e.g. `node -e 'const t=JSON.parse(require("zlib").gunzipSync(require("fs").readFileSync(F)));...'`, never
  print it whole). Useful paths: `tier`, `population`, `name`, `stress` (the crisis in force, or null; also
  `stresses`), `config` (`nearbyResources`, `nearbyResourcesDepleted`, `tradeRouteAccess`, `terrainType`),
  `institutions[]` (name, category, `status`), `economicState` (`prosperity`, `primaryImports`, `primaryExports`,
  `activeChains[]` with `status`, `foodSecurity`), `resourceAnalysis`, `powerStructure` (`factions[]`, government),
  `npcs[]`, `defenseProfile`, `history`. Grep the record for any key word you need.
- The source tree (read-only): `<TREE>`. `grep -rn -F "<a fixed run of the sentence>" <TREE>/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`
  finds a line's pool and its siblings; `<TREE>/src/domain/display/stateProse/*Candidates.js` shows how the conditions
  are computed.
- Two more fields: `prints[]` here is built from the kernel's own ledger of what it DREW in each town (exact), and
  `prints[].page[]` gives each view where the sentence was found on the page with `printed` = the sentence AS PRINTED.
  The overview rungs CLIP a line at its first comma/semicolon: judge the clipped sentence the owner actually reads
  (a siege clause clipped away is part of what you judge). `head` is the run used to find it.
- `priorFalse` (on some lines): an earlier read found this line (in its old wording `priorText`, state now
  `prior59State`) FALSE in the towns named, with its reason. Those towns are in your render. For each such town:
  if the line still prints there, read it and say CURED-TRUE or STILL-FALSE; if it no longer prints there, find what
  the same view prints now in its place (same tab, the corresponding paragraph) and say CURED-BY-SILENCE and whether
  what prints in its place is true. Put these in `prior` in your output.
- `twinHint` (on some lines): a mark all the line's same-scope siblings carry and it lacks. Judge whether it matters.
- DO NOT open any file under `docs/chair/` in any tree, and do not run `git log`, `git show` of commits, or read any
  commit message: this read is cold. Do not read any other review list.

The towns were born the way the app births them (the configuration panel's shape). Seeds: `rv2-<size>-<crisis|calm>-<i>`
and `rww-…`/`rw3-…` (a crisis name = that crisis forced; `a+b` = both), `r2s-<crisis>-<size>-<i>` (one crisis forced),
`r2r-<size>-<i>` (every dial random, crisis random).

## What you do, for EVERY line in your list
1. If it has no prints: verdict `NEVER PRINTS`.
2. READ IT BY EYE in at least THREE towns where it prints (all, if fewer): the SMALLEST size and the LARGEST size it
   reaches, and a siege, a famine or an occupation among them wherever it prints under one. Read the sentence in its
   own tab on the page (the lines around it, and the rest of the page where it bears), and check it against the
   town's record (query it). For a reworded line, judge the NEW text; for a `marks` line, judge whether it is true in
   the towns where it now prints.
3. THEN BY SCRIPT IN EVERY TOWN IT PRINTS IN: write a small node check of the line's claim against each record (and,
   where the claim is contradicted on the page, a grep of the page), and run it over every town in `prints`. Say what
   the check tests. Report the count true / false.
4. Also look for: a twin that lacks a condition its siblings in the same pool carry (compare `marks` in the corpus doc);
   a slot that prints a catalogue label (a count range like "(10-30)", "palisade or earthworks", "gold/silver ore",
   "Military/Guard"), or breaks agreement ("candles comes", "walls was", "it" for a plural); a line that says how the
   model works (points, shares, "supplies from upstream" machinery).
5. Ask of each sentence: is it true of THIS town, by its record and by the rest of its own page?

## The scale (verbatim from the program's readers' brief)
(Its words about V1-V5 versions do not apply here: you read ONE version, the tip, line by line, not whole pages.)
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
ONE file, `<OUT>`, a JSON array, one object per line of your list, in its order:
```
{ "id": "...", "verdict": "TRUE" | "FALSE" | "NEVER PRINTS",
  "printsIn": <number of towns>, "eyeReads": [ { "town": "...", "size": "...", "crisis": "...", "printed": "<the sentence as printed>",
     "true": true|false, "severity": "HIGH"|"MED"|"LOW"|null, "kind": "a".."h"|null, "fact": "<the record fact or page line, quoted>" } ],
  "script": { "tests": "<what the check tests>", "true": n, "false": n, "falseTowns": ["..."] },
  "prior": [ { "town": "...", "state": "CURED-TRUE"|"STILL-FALSE"|"CURED-BY-SILENCE", "nowPrints": "<sentence in its place, if silence>", "nowTrue": true|false|null, "severity": "...", "fact": "..." } ] | null,
  "twinMissingCondition": "<or null>", "slotOrAgreement": "<or null>", "machinery": "<or null>", "note": "<one line>" }
```
`FALSE` if any town reads false at HIGH or MED (say the worst severity in the eye reads or script); LOW-only false
reads keep `TRUE` with the LOW listed. Verify each false candidate against the record before listing it. If the
record cannot settle it, say so and give it LOW. Be terse in `fact` and `note`. A false sentence you miss is the
costly error; a true sentence you list as false wastes a builder's hour.
