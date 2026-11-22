# R5D-FORMS — hand-back (VEIL-36, chain A's writer; the chair's E115, E121, E126, E129, and the 21:05 addition: kind + origins)

## 1. State

- **Commit** `4583ad3d4` on `lane/veil-36-2026-11-22-r5desc-wip` (worktree `/home/user/wt/r5desc`, from af708f2fd). Not pushed.
  This hand-back is the next commit. Nothing in `src/`, `supabase/`, `tests/` changed. Migration 212, `rosterChoiceRegistry.js`
  and `galleryWithholdAlways.js` were not read.
- **Files** (all `scripts/veil/standingForms.*`):
  - `standingForms.data.json` — THE TABLE: a `header` (the cut's semantics, slot meanings and patterns, samples, the rule that
    rows only grow) and 117 `forms`, one per line: `id`, `kind` (`closed` | `pattern`), `slots`, `origins`, `template`, `re`,
    `tokens` (the template's parse; `--check` expands it).
  - `standingForms.mjs` — the door: `--print`, `--derive <path>`, `--check [--file <path>]`, `--cut <desc>`, `--write`.
  - `standingForms.ids.json` — the id of every form (R5D-0's 44 ids kept; `M-…` master, `H-…-em|-hy` history), `--write`'s input.
  - `standingForms.proof.mjs` — the proofs below (`<scratch> [--pg] [--walk N]`; last line `PROOF exit 0|1`).
- **Counts**: 117 rows. By origin: **tip only 36, master only 32, both 9, history only 40**. **Closed 94, pattern 23**
  (slots: label 10, choice 17, force 6, name 6, count 1). The tip derives 45 forms (R5D-0's 44, plus NM-guilds, see 5);
  master 41; master's history adds 43, of which 3 are already master rows (below), so 40 history-only rows.
- **The literal** (`--print`, between `// STANDING_FORMS begin` / `// STANDING_FORMS end`): **23,737 characters (23,777
  bytes UTF-8, the em dashes), sha256 `794367e0e6ae71dc7b82b5ee95ca69e8c4dfb77a990e2b2e81aeed36de4e8cc8`**. Its shape is
  HOUSE_FLAGS': one JSON object keyed by id, sorted, one row per line, `{"kind": …, "re": …}`. No backslash, backtick or `${`
  in it (asserted by `--print`), so a JS template literal + `JSON.parse` (the twin), a `jsonb` SQL literal (212: double the
  `'`) and JSON all carry it byte for byte. `--write` is idempotent (same bytes on a rerun).

## 2. Sources read (by derivation, not by hand)

`--derive` parses a source text (acorn), finds the standing variable from the final append
(`X.desc = X.desc ? X.desc + ' ' + S : S`), and evaluates every value assigned to it: string and template literals; `+`;
a `${…}`/operand becomes a slot (`powerSentenceName(…)` → name; a raw `.faction` → label; `.body` → force;
`.replace(/^Three/, LEVEL_COUNT_WORDS[…])` → count); a conditional between single phrases is a choice inside one form
(`{have|has}`, `{council vote|decision}`, `{NAME|the governing council}`), a conditional between sentences a union of forms;
local helpers (`arcaneAheadSaid`, `merchantAheadSaid`, `occupierStanding`) are inlined; identifiers resolve by scope.
**Static derivation yielded whole sentences for every branch of every version read; no branch needed execution.**
Versions: the tip (af708f2fd); origin/master (db832c892, whose file is 75e60fc94's: asserted); master's history of the file
(`git log --follow`: 75e60fc94, e3f6029b2, 255970010, 1ffa9be19) and, before 1ffa9be19 split it out, the same function inside
`src/generators/powerGenerator.js` at all 11 of its master commits back to e608542bd (the first build). The wording changed at
three of them: **e608542bd** (born, em-dash forms), **b76848c90** ("the reformat": 20 forms with ` - ` for ` — `),
**62c5e8d67** (the em dashes restored), **e3f6029b2** (the em dashes leave: master's wording), **75e60fc94** (three forms
take `force.body` for "garrison"). 255970010 is rename-only (same 41 forms). An `origins` entry `history@<sha>:<path>` is
each commit where a version of the writer first holds the form (what `git log -S` finds); `master@75e60fc94:<path>` and
`tip` say who writes it today.

## 3. The cut's semantics (one for both engines; the data file's `header.cut`)

A stored desc is `<base>` or `<base> <standing>`, the standing always the tail (R5D-0 Q3). The engine writes the standing as
**one or more forms joined by one space** (a rank line, then rivalry notes: `standing + ' ' + note`), so the cut is: over every
row, match `(?:^| )(` + re + `)` (every `re` ends in `$`); remove the LONGEST tail (the earliest match start; a tie by the
smaller id) with its joining space; **repeat while a row matches**; no row matches: the desc as it is (a base, E121 (b)).
A match's span is fixed by its earliest start and the `$`, so the engines' differing alternation preferences cannot move it.
The lazy-base spelling `^(.*?)(?:^| )(` + re + `)$`, shortest `m[1]` wins, gives the same split (proved, 4 (c)).
Patterns: case-sensitive, no flags, no `\b`, no named groups, no lookarounds needed, no backslash (a metacharacter is a
one-character bracket: `[.]`, `[(]`, `[?]`); only `(?:…)`, `[…]`, bounded `{m,n}`. Slots:
- **name** (the tip's `powerSentenceName`): `[A-Z][A-Za-z'-]{0,24}(?: [A-Za-z][A-Za-z'-]{0,24}){0,5}` — words of letters,
  apostrophes and hyphens, at most six, never a `.`, `;`, `:` or `,`. It is never `.*`/`.+`. The engine's literals sit beside
  it in a choice: `the governing council`, `the second power`, `the leading power` (and master's `the second faction`,
  `the top faction`).
- **label** (master and older engines printed the raw `f.faction`): name words, one optional slashed pair
  (`Military/Guard`, `Monster Hunters / Adventurers`), one optional trailing bracket (`Third Bloc (Neutrals)`).
- **force**: `garrison | guard | hired company | militia | watch`, read from `defenseFacts.js :: *_WORDS` (`--check` reds if
  they move). **count**: `Three|Four|Five|Six|Many` (the source's `LEVEL_COUNT_WORDS`).
- The bound's evidence: the charset of every power label of 1,800 tip births (r5dforms-0..899, every size, twice) and
  `stressPowerFaces.js`: letters, space, `'`, `-`, `/`, `(`, `)`; at most 4 words, 33 characters.
**No swallowing**: the name slot cannot hold a sentence end, so a lazy base never loses a base sentence to it; proved on the
four bases (4 (c)). Within its own sentence a head-slot form takes the earliest words it can (R5D-0's bogus "The merchant
guilds now have more say now: …" cuts as NM-more with "The merchant guilds now" as the name): harmless, it is all standing.

## 4. The proof (logs in `/tmp/claude-0/r5dforms/`; each run from the script to a log, exit read from the log)

- **(a)** R5D-0's `standing-table.mjs` (git show e1e5548cf): all **44 ids are rows, 44 by text** (its `{X}`/`{S have}`/…
  notation mapped to this table's; R1-gap is the one row WIDENED: master writes the same sentence with a raw label, so the one
  row takes `{LABEL}`, which holds every `{NAME}`). R5D-0's own expansion over the 64 sample labels: **4,671 / 4,671 literals cut
  whole to their row** (`proof-pg4.log`).
- **(b)** every row expanded with the samples (every force word, every count word, both sides of every choice, 64 labels and
  their 64 prose names, each value at least once): **1,166 / 1,166 cut WHOLE to their own row, JS**; `--check` re-proves it
  and that each `re` matches its own template's samples.
- **(c)** Postgres 16.15 on the local cluster, scratch database `r5dforms`, no migration: the printed literal loaded as
  `jsonb` (sha256 read back equal), the cut by `regexp_match` with the lazy base, looped in plpgsql: **the PG cut equals the JS
  cut (base and ids) on 6,009 / 6,009**: the 1,166 samples and 4,843 base cases. The four bases **alone stay WHOLE (no match)**;
  each base + one standing (every name/label sample, every rank line, the rest rotating) and each base + two standings
  (130 pairs per base) **cut back to that base exactly, by as many rows as were joined** (JS 4,843 / 4,843; PG equal). The
  lazy-base JS cut equals the index cut on 6,009 / 6,009. `PROOF exit 0`, 28 s.
- **(d)** `--check` at the tip: `exit 0` (`check-tip.log`). On a scratch copy of factionStanding.js with one sentence changed
  ("arrests are often made"): `--check --file <copy>` **exit 1**, naming line 219 and printing the message
  (`check-copy.log`).
- **(e, beyond the brief, light)** 300 tip births: every standing the tip's engine (1,173) and master's engine (a scratch copy
  of 75e60fc94's file, over the same rosters: 1,173) writes **cuts WHOLE, 0 fails**; the 1,602 stored descs split 1,173
  base + standing (`proof-walk.log`).

## 5. For the SQL builder and the page builder (findings)

1. **Postgres caches only 32 compiled regexes.** A join the planner orders desc-outer recompiles all 117 patterns for every
   desc: the first PG run took >10 minutes and was cancelled; looping the ROWS outermost (plpgsql) took 28 s for 6,009 descs
   × ≤3 passes. 212's cut over one document's handful of descs is cheap either way, but a bulk read should loop the rows
   outermost or test one combined pattern first. A capture-free `~` test before `regexp_match` is the fast path.
2. **Ties**: a sentence that two rows hold (tip R2-buy and master M-R2-buy over a plain name; 4,159 of the samples) is cut the
   same either way; its id is the smaller (`M-R2-buy` before `R2-buy`). The base never depends on the tie.
3. **R5D-0's NM-more** expands to one literal no engine writes ("…have more say now: …"); the engine's own Merchant Guilds
   sentence ("The merchant guilds now have more say: the noble families …") was missing from R5D-0's table; it is row
   **NM-guilds** (tip). The walker's 19,489 / 19,489 never met it.
4. Master's forms the tip does not have in shape: **a raw-label slot** in M-R1-behind, M-R1-shadow, M-R2-buy (with the
   literals "the second faction" / "the top faction"), R1-gap (shared) and the six `H-R1-*` history rows; **two sentences**:
   M-CM-riders, M-GR-parallel, M-GT-leverage, M-GT-outmatch, M-MC-outweigh, M-MT-reach, M-RT-outweighs, M-ST-administers,
   M-ST-holds, M-TG-outweighs, H-NM-ahead-em, H-NM-ahead-hy (the tip has nine two-sentence forms of its own). Master's force
   forms: M-TG-even, M-TG-outweighs, M-GR-parallel; their older literal-"garrison" spellings are the same sentences and ride on
   those rows (origin history@e3f6029b2).

## 6. Needs a ruling

- **The repeat.** The brief says the cut "removes the longest tail that is one row"; the engine appends several forms to one
  desc (1,173 standings, many with a note after the rank line), and R5D-0's cut repeats ("again and again"). This table and
  its proofs define the cut as REPEATED (each pass the longest single row). If the chair meant one pass only, a multi-note
  standing would leave its rank line in the base.
- **Tie attribution** by the smaller id (5.2), if the legacy arm wants tip-first ids instead.
