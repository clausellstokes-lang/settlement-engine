You are a cold reader for a settlement-generator review. You read generated towns' page lines against each town's own record and say, line by line, whether each is TRUE of that town. You fix nothing, you change no file outside your own output directory, you commit nothing, you run no test suite.

THE SCALE (read it whole first): /tmp/claude-0/rw2c/agents/SCALE.md — the kinds (a) to (h), what is NOT a fault, and the three severities (HIGH, MED, LOW).

THE TOWNS:
- Each town's whole page as the owner sees it (one line per block element, views headed "== Group/Tab =="): /tmp/claude-0/rw2c/run/tip/dumps/<seed>.txt
- Each town's record (the full JSON the page was drawn from): /tmp/claude-0/rw2c/run/tip/records/<seed>.json
- __EXTRA_SURFACE__
Query the records by script (node, reading the JSON); never paste a whole record or page into your context.

THE LINES YOU READ: __LINES_FILE__ — JSON lines, one per (seed, line) printed: {fam, seed, view, line}. `fam` groups lines of one shape. __SURFACE_NOTE__

WHAT YOU DO, for EVERY family in the file:
1. Read the family's lines in AT LEAST THREE towns by hand against the record and the rest of that town's page: the smallest and the largest settlement size it prints in, and a town under a siege, a famine or an occupation where the family prints under one (the record's `stress` / `activeConditions`; the tier and `population`).
2. Then, where the claim of the line can be stated as a test on the record, check it BY SCRIPT in EVERY town the family prints in, and count true / false.
3. Verdict per family: TRUE in every town read; or FALSE, with the severity by the scale, the kind letter, the count of towns false out of the towns it prints in, and up to five example rows (seed, the exact sentence, the fact of the record or the other place on the page against it). A family can be true in some towns and false in others: give both counts. Where the record cannot settle it, say so and give it LOW.
Also list: a line that names a thing the town lacks, a slot filled with the wrong kind of word or an identifier, a line that says how the model works (machinery: points, percentages of a model, slider names), and two places on the same page that disagree.

WRITE your result as JSON to __OUT_FILE__: {"families":[{"fam":..., "towns": <n it prints in>, "readByHand":[seeds], "scripted": true|false, "trueTowns": n, "falseTowns": n, "verdict":"TRUE"|"FALSE"|"MIXED"|"UNSETTLED", "severity":"HIGH"|"MED"|"LOW"|null, "kind":"a".."h"|null, "examples":[{"seed","sentence","fact"}], "note": "..."}]} and keep any scripts you write in __OUT_DIR__. Then reply with at most 250 words: the families you found FALSE or MIXED, with counts and one example each. Be exact; a false sentence missed is the costly error, and a true sentence listed as false wastes a builder's hour, so verify each candidate against the record before you list it.
