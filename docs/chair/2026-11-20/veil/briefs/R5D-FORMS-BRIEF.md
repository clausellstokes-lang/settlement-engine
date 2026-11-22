# R5D-FORMS — R5-DESC's table of standing forms, drafted ONCE (the lightening of R5D-SQL, the chair's E129). READS WHOLE: this brief; `src/generators/power/factionStanding.js` at the tip (af708f2fd) AND at origin/master (`git show origin/master:src/generators/power/factionStanding.js`); R5D-0's hand table (`git show e1e5548cf:docs/chair/2026-11-20/veil/out/v34/r5d0/measure/standing-table.mjs`). NEVER READ: migration 212, `src/domain/veil/rosterChoiceRegistry.js`, `src/domain/display/galleryWithholdAlways.js`. YOUR WINDOW: this seat's tier's, 1,000,000 tokens (compaction forced at 784,000); YOUR BUDGET: about 150,000.

By VEIL-36 (chain A's writer of the share veil), on the chair's E115, E121, E126, E129 (each vetoable by the owner). You build a
DATA FILE and its GENERATOR; you touch no line of `src/`, `supabase/` or `tests/`.

## WHY
R5-DESC cuts the STANDING tail off every served power description (`powerStructure.factions[].desc`) on every shared read, in
migration 212 AND in the client's twin, by ONE frozen table of the engine's standing forms: TODAY's (the tip's
`factionStanding.js :: annotateFactionStanding`, 44 forms by R5D-0) AND MASTER's (production's stored places were born by
origin/master's engine, which wrote about 35 OTHER forms: three take the force's word, one is two sentences) AND any OLDER wording
master's history of that file holds (`git log --follow -p origin/master -- src/generators/power/factionStanding.js`: 75e60fc94,
e3f6029b2, 255970010, 1ffa9be19 and earlier, read by their string hunks only). The table ONLY GROWS: stored documents keep old forms.
A desc whose tail matches no row is served as it stands (it is a base: E121 (b)). The SQL builder (R5D-SQL) will paste YOUR
generated literal into 212 and the twin and read nothing else; the page builder's walker will hold the table to the engine.

## WHAT YOU BUILD (worktree `/home/user/wt/r5desc`, branch `lane/veil-36-2026-11-22-r5desc-wip`, at af708f2fd)
1. `scripts/veil/standingForms.data.json`: ONE table. Per form: `id` (R5D-0's ids where the form is one of its 44: R1-gap, TG-far,
   ...; new ids for master's and older forms, e.g. `M-…`, `H-…`), `origins` (`tip`, `master@75e60fc94`, `history@<sha>`, every one
   that wrote it), `slots` (none, name, force, count…), `template` (the human sentence with `{X}`-style slots) and `re` (its pattern).
   Deduplicated: a sentence written by both engines is ONE row with both origins. A header field says the cut's semantics (item 3).
2. `scripts/veil/standingForms.mjs`, the table's door (the precedent: `scripts/veil/rosterChoiceRegistry.mjs`, which writes
   `registry.json` and has `--check`):
   - `--print`: prints the ONE JSON literal both engines carry between `STANDING_FORMS begin` / `STANDING_FORMS end` markers (the
     HOUSE_FLAGS precedent: `src/domain/display/gallerySecondHomes.js :: HOUSE_FLAGS`, a JSON text that the twin `JSON.parse`s and 212
     holds as `jsonb`; read that symbol's block only, for the shape). Stable bytes (sorted, no timestamps); print its sha256 too.
   - `--derive <path>`: the forms a `factionStanding.js` source text can append, derived STATICALLY (its string and template
     literals; `${…}` becomes a slot). If static derivation cannot yield whole sentences for some branch, say which and derive that
     branch by EXECUTION instead (call `annotateFactionStanding` over constructed rosters); if neither works, STOP and say why.
   - `--check`: derives from the tip's file and reds unless every derived form is a row of the table, with the message: "a new or
     changed standing form ships only WITH a migration that adds it to 212's STANDING_FORMS; old rows stay: stored documents keep
     them". It also reds if a row's `re` does not match its own `template` expanded with the slot samples.
   - `--cut <desc>`: the JS reference cut (prints base and standing, or "no match").
3. THE CUT'S SEMANTICS, ONE FOR BOTH ENGINES (write it in the data file's header and your hand-back): a stored desc is `<base>` or
   `<base> <standing>`, the standing always the TAIL (R5D-0 Q3); the cut removes the longest tail that is one row (or a two-sentence
   legacy row) and trims the joining space; no match: the desc as it is. Every `re` in the subset Postgres ARE and JavaScript RegExp
   run ALIKE: every metacharacter escaped; `(?:…)`, `[^…]`, bounded `{m,n}`, the lookarounds `(?<![a-z0-9_])` / `(?![a-z0-9_])` as
   HOUSE_FLAGS spells `\b`; no `\b`, no named groups, no flags, case-sensitive; anchored at the tail. THE NAME SLOT IS BOUNDED by what
   `src/data/people/powerSentenceName.js :: powerSentenceName` (and the literals the engine puts there: 'the governing council', 'the
   second power', 'the leading power') can produce: read that symbol, never `.*` or `.+`. PROVE that a lazy base never lets the name
   slot swallow a base sentence (the base examples below).
4. THE PROOF (light: no pool, no gate-heavy run; the box's four cores are the pool's until about 21:35 UTC):
   (a) every row of R5D-0's `standing-table.mjs` is a row of yours, by id and by text;
   (b) every row, expanded with its slot samples (every force word: garrison, hired company, watch, militia, guard; every count word;
       names from `powerSentenceName` over a dozen real power names), cuts WHOLE by `--cut`, in JS;
   (c) THE SAME IN POSTGRES on the local cluster (`PGHOST=/var/tmp/rv7 PGUSER=postgres`; a scratch database `r5dforms`; no migration
       applied; `regexp_match` over the printed literal's patterns): the PG cut equals the JS cut on every sample AND on these bases,
       which must stay WHOLE (no match): "The governing body is systematically compromised; offices are sold and justice is
       purchasable."; "Elders guide the community by custom, not by formal authority, but fewer and fewer people accept their
       word."; "An external interest with its own people placed inside the settlement. Its presence is not known to the
       settlement."; "Emergency committee with authority over rationing, conscription, and defence spending; not accountable to
       normal governance."; and each base + one standing cuts back to that base exactly;
   (d) `--check` exit 0 at the tip; on a COPY of `factionStanding.js` in your scratch directory (never the tree) with one sentence
       changed, `--check --file <copy>` reds with the message.
   Run each from a script to a log; read the log's exit line, never through a pipe.
5. COUNTS for your hand-back: forms by origin (tip only / master only / both / history only), closed vs slotted, the literal's
   length and sha256; every master or older form that is TWO sentences or takes a slot the tip's forms do not.

## LAWS
Commit by explicit paths on your branch with the hooks (never `--no-verify`); NEVER push; nothing outside `scripts/veil/` and your
hand-back. Every database local. If you would need to read 212, the registry or the twin's always-pass file: STOP and say why.
STOP rather than invent. Hand-back: `docs/chair/2026-11-20/veil/out/v36/r5dforms/R5DFORMS-HANDBACK.md`, its first section the state
(commit, files, counts, the literal's sha256); your last message at most 15 lines.
