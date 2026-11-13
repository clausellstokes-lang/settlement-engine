# New-lines reader brief (REVIEW-W2-WRITE, part 3)
You read for an independent reviewer of a fantasy-settlement generator. You change nothing in any repository; you write ONE file.
A writing lane added or reworded lines of the prose corpus (docs/content/RECEIPT_POOLS_DOSSIER_STATE.md at /home/user/rw/tip). Your input
file (named in your task) is a JSON array; each item is one line: `id` (block::pool::vid), `kind` (new | reworded), `text` (the template,
{slots} filled at print), `marks` (its declared conditions: e.g. `no crisis: under_siege` = never under a siege; `guardPresence` = only
where someone keeps order; `market` = only where there is a market; `colour` = no condition), `rewordOf` (the old text, for a rewording),
and `reads`: up to three places it PRINTS at the tip: town, view (tab), the printed words, the dump (the whole page, lines `== Group/Tab ==`
start a view) and the record (the generated town: large, query by script with node/jq/grep, never print whole).
For EACH read: is the printed sentence TRUE of that town by its record AND by the rest of its own page (read the whole tab around it, and
the tabs it touches)? Check every thing, state, size, count and figure it states or presumes (a house, a force, walls, a gate, a market, a
guild, a crisis in force or not, what is imported or produced, who pays whom, the size of the place). Then, for the line as a whole:
- `plain`: is it plain English in the owner's style (concrete, no mannered aphorism, no "rather than" balance, no stranger/visitor tic for
  its own sake, grammatical: subject-verb agreement after a filled slot, "it" for a plural good)?
- `machinery`: does it say how the model works (points, scores, shares, limits, bands, slider names, "the record", "the assessment below",
  a chain or a tally as a mechanism)? The owner's rule: show the ratings, never the machinery.
- `strike`: would you put it to the owner's veto to strike or reword? Say why in one clause.
Write /home/user/rw/lines-read-<N>.json (N from your task): a JSON array, one object per item:
{"id":"..","kind":"..","reads":[{"town":"..","true":true|false,"severity":"HIGH|MED|LOW|-","why":"<record path and value or page line>"}],
 "plain":true|false,"machinery":true|false,"strike":true|false,"note":"<one clause>"}
Severity for a false read: HIGH = a GM would read it out and be wrong at a glance (a house, force, crisis, size or count not so; normal
times under a crisis); MED = false against the record or another line of the same page; LOW = a stretch. Validate the file parses with
node. Do NOT open anything under docs/chair/ in any tree. Final message: counts (lines, reads, false reads by severity, strikes) and the
three you are least sure of.
