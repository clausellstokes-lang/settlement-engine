# What changed (the stage under review), for the reader
Code at TIP (/tmp/claude-0/wt/tip, commit 9354d792a) vs DEF (/tmp/claude-0/wt/def, 6e61d042a). DEF is TIP without the stage.
The stage changed only defence scoring and defence classification (no new sentences were written):
 C0 a hired-only place's martial will is also held so its military never exceeds the same place with a watch instead;
 C1 a house counts in defence by its rung on its own ladder (factor 0.8 least .. 1.2 greatest; a house on no ladder 1.0),
    for parts garrison, militia, watch, court, prison, wardens, company, charter, clergy, druids, market, hospital, alchemists;
 C2 "Professional city watch" is now the watch only (no longer also a garrison) - in the defence buckets AND in the roster
    flags `hasGarrison` (src/generators/priorityHelpers.js) that safety/crime prose reads;
 C3 "Household levy" is now a militia in the roster flags (hasMilitia);
 C4a fabric rows ("Access to parish church") open no clergy part; C4b a wayside shrine opens no clergy part;
 C5 the druid circle and Elder Grove Council are one ladder (catalogue successor key; can change rosters at generation);
 C6 alchemist shop/quarter no longer arcane defence (no arcane part, not in the "Arcane defense" list); 'mage','scroll scribe' added to arcane names.
So scores, bands and readiness labels move, and EXISTING sentences keyed on them (or on hasGarrison/hasMilitia) now print in
towns where they did not. Your job: is each such sentence TRUE of the town where it now prints?
# Data
 /tmp/claude-0/out/tip/<seed>.json.gz = the town's full record at TIP (JSON: institutions[], defenseProfile{scores,readiness,institutions},
   economicState, powerStructure, stress, tier, population, config, ...). /tmp/claude-0/out/tip/<seed>.txt.gz = every rendered surface,
   sections "== <surface> ==". Same at /tmp/claude-0/out/def/ for the DEF tree (the line's predecessor).
 Each line to read is a row of /tmp/claude-0/agents/<group>.ndjson: {seed, surface, fam, line} = printed at TIP, absent from DEF's page.
 The scale (kinds a-h, severities HIGH/MED/LOW, what is not a fault): /tmp/claude-0/agents/SCALE.md.
# Rules
 Read-only on every repository and worktree; work in /tmp/claude-0/agents/work-<group>/ only. Do NOT open any file under docs/chair/
 in any tree, and do not read git commit messages. Query big files by script (python3 / node); never dump whole files.
 Group the rows by template (mask the town's name and digits); for each template read it against the record in EVERY town it prints in
 by script where the fact is checkable (roster names, forces, walls, stress types, tier, population, ruler), and by eye in at least
 three towns (smallest size, largest size, and a siege/famine/occupation town where it prints under one).
 For each template give: TRUE (in every town read), or FALSE with severity, the town (seed), the sentence and the fact against it,
 and how many of its towns are false. Note also whether the SAME template was already false at DEF in other towns (carried).
 Write your full table to /tmp/claude-0/agents/<group>.result.md (one row per template: template | towns | verdict | evidence).
 Return a summary of at most 300 words: counts of templates read, TRUE, FALSE by severity, and every FALSE row in one line each.
