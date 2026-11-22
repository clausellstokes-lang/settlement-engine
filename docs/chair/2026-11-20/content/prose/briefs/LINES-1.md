# LINES-1 — new variants for the fifteen worst state-prose pools (PROSE-1's builder brief; AUTHORING ONLY)

Written by PROSE-1, 2026-11-20. Base: this branch (`lane/prose-1-2026-11-20`). You write ONE file: `docs/chair/2026-11-20/content/prose/lines/PROSE-LINES-1.md`. You change nothing else: not the source document, not `src/`, not a generated file. No git commands that change state.

## THE OWNER'S WORDS THAT BIND EVERY LINE
"So do what you can to comprehensively fix the sameness fault" — a DM who makes three places reads the same sentences again. And the standing rule: "A calm town should be as it currently is… Don't invent drama capitalize on what's already there if it's there… We are not creating the campaign."

## WHAT A NEW LINE IS
THE SAME STATE SAID IN OTHER WORDS. Never a new fact, never a new trouble, never a cause the state does not hold; a calm place stays calm; no season, no count or digit, no house, office, road, guild, temple, court or person the state does not hold. Read the corpus's law FIRST, in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`: §0b THE REGISTER (present tense, the woven test, the angle palette), §0c SLOTS (every slot's shape; `{band}` is RESERVED: never use it), §0d (no digits; bands in words), §0e AUDIENCE (`dm-only`), §0f (R-DST-B above all: a state with no provenance gets plain description, never history: no "since", "after the war", "used to", "once"), and for each pool its own block's header (STATE-KEY, SLOTS, PROVENANCE, any W-resolutions the block names). The pools' existing lines are your models of voice and length: match them.

## THE FORM (the source document's own)
Each new line is a numbered row in the pool's own form: `N. \`[angle · marks]\` text`, N continuing the pool's numbering (the next row number after the pool's last; never renumber). The angle: one of ledger, street, visitor, elder, unfolding, counterforce, threshold; inside one pool the new lines take angles the pool's lines do not already hold where possible, and two lines may share an angle only if they say it from plainly different standpoints. Slots: only those the block declares AND that the target places fill (`{settlement}` always; anything else only if the eligible lines already use it).

## ELIGIBILITY — THE POINT OF THE EXERCISE
A new line helps only if the places that print this pool CAN draw it. For each pool, read in `docs/chair/2026-11-20/content/prose/map/draws.hxd.jsonl` (one JSON a line: size, seed, blockId, poolKey, eligibleVids, chosenVid, excluded[{vid, slots, dmOnly, dimMarks, factMarks}], stored) which vids the places that store it are eligible for, and what the excluded lines carry. Read the line with a small script, never the file whole. Then give each new line ONLY the marks that the common eligible line carries (e.g. a crisis-guard such as `no crisis: under_siege` if the eligible line has it, or the pool's own fact such as `no market`), so that the new line is eligible exactly where the commonest line is. Never a mark the target places lack; never a slot they do not fill. A pool braced `{crisis-scoped}` needs `crisis: any` or a crisis guard on every line, like its siblings: copy the eligible sibling's crisis marks. Keep the `dm-only` discipline of the pool (a line in a covert pool stays covert).

## HOW MANY (PROSE-1's proposal to the chair; the chair may trim)
Bring each pool to SEVEN lines eligible for its common state (so a place's chance of any one line is about 1/7): new lines = 7 minus the median eligible count MAP-1 measured (given below). Write each pool's lines as a set: no two of them may say the same thing in the same way, and none may restate a sibling.

| # | block :: pool | median eligible now | new lines |
|---|---|---|---|
| 1 | DS-GEN-13 :: NO-MARKET | 1 | 6 |
| 2 | DS-FTH-2 :: PRIVATE DOSSIER (thorp, hamlet eligible for one; village up for three) | 1 / 3 | 6 (eligible at thorp and hamlet) |
| 3 | DS-ECO-12 :: TRADE PROFILE: exports and imports both present (thorp–village one; town up two) | 1 / 2 | 6 (eligible at the small sizes) |
| 4 | DS-GEN-11 :: criticalIssueCount: critical contradictions on the record | 1 | 6 |
| 5 | DS-ECO-2 :: FOOD: deficit | 1 | 6 |
| 6 | DS-ECO-11 :: TERRAIN: Plains | 1 | 6 |
| 7 | DS-ECO-6 :: TIER: minor shadow activity (≥3) | 1 | 6 |
| 8 | DS-POW-2 :: recentConflict present | 2 | 5 |
| 9 | DS-DEF-3 :: First-Survey qualification (the reading is a first look) | 3 | 4 |
| 10 | DS-POW-5 :: governing body name: a SLOT, never a baked noun | 3 | 4 |
| 11 | DS-ECO-11 :: ECONOMIC STRENGTHS: the roster is populated | 3 | 4 |
| 12 | DS-ECO-9 :: SECURE | 3 | 4 |
| 13 | DS-STR-1 :: Overview's own section framing | 3 | 4 |
| 14 | DS-DEF-5 :: arcane defense ABSENT | 3 | 4 |
| 15 | DS-DEF-9 :: magicDependency false | 3 | 4 |

If a pool's law makes seven honest lines impossible (the state is too narrow to say seven ways without inventing), write fewer and say why in one line. If you find a pool's eligibility is NOT what this table says, say so.

## THE FILE
For each pool, in order: a heading `## <n>. <block> :: <pool>`; one line: the state it serves and the marks/slots the target places admit (with the jsonl figure you read); the pool's EXISTING lines quoted in source form; then the NEW lines in source form. At the end: a count line (pools, new lines), and every place you were unsure, one line each. The file is read by the chair line by line and goes to the owner.

## RULES
No dumps: run scripts with output to a file and read counts. No test runs, no gate, no npm. Final message: at most 150 words: the path, the count, the pools where you wrote fewer, any eligibility surprise.
