# S9-POST and THE GUARD: a secret that fits its holder, as a post-pass; then the census that keeps it so (PAGE-6's brief, written 2026-11-20 14:15 UTC by `date -u`)

Read `briefs/BUILDER-RULES.md` (its rules bind you; "PAGE-2" there means PAGE-6), `briefs/S-v2.md` § S9 and § S3 (the design
before the chair's re-cut), then THIS, which governs where they differ. Your tree: a worktree on a new branch `page6/s9` cut from
the LANE COMMIT in your dispatch message. THE CHAIR'S ORDER (14:17): S9 BEFORE L4. L4 (office rows settled after the draw,
`src/data/people/officeSecrets.js`) is NOT on your base and lands after you; it will add, for each title, a row a principled
holder can carry (a rule broken for mercy or conscience, never for gain). So write the pass POOL-GENERIC: it walks the pool the
card's secret was taken from, with an `admits(row, card)` that L4 can extend by registering its office rows as one more pool
(say in your hand-back exactly how L4 registers it). Two commits: S9, then the guard.

## Commit 1: S9 AS A POST-PASS (the chair's ruling of 13:50)
THE REFUSED FIRST CUT (f2957d5be, origin `lane/page-2-2026-11-20-s-wip`): a walk INSIDE `generateFactionLeaderSecret` moved 40
OTHER cards through the town's held-secret set. Not accepted. You may reuse its TAG TABLE (`npcData.js ::
CRIMINAL_SECRET_HOLDER_TAGS`, ten rows, listed in `S2-TAGS.md` on that commit) and its `admitsSecretRow` predicate, re-read whole.
THE RULE: the secrets are dealt EXACTLY as today (L4's office settle included). THEN, draw-free, a card whose secret it is not
admitted to — (a) a role-free line that presumes an office or a trade the card lacks (the tags), or (b) a VENAL line (the money
words of the `incorruptible` pattern of `npcData.js :: SECRETS_DENIED_BY_TEMPERAMENT`) on a card whose drawn dominant
temperament is `principled` — takes ITS NEXT ADMITTED LINE THAT NO CARD OF THE TOWN HOLDS: the next row after its drawn one in the
same pool, in row order, wrapping, skipping rows the card is refused and rows any card of the town holds; none left: it keeps its
draw (count these). A CARD THAT IS NOT A MISFIT KEEPS ITS SECRET BYTE FOR BYTE. The guard table `SECRETS_DENIED_BY_TEMPERAMENT` is
NOT edited. No `rng()` added, removed or moved.
WHERE: after every card of the town is dealt (find the town-level point; say it by symbol). FIRST, before any code: list every
field of the SAME card drawn or derived from its secret's text AFTER the secret (presentation modes, a temperament that yields to
the secret, a goal or tie that reads it, pressureSentence, the mint's CarriedSecrets, the narrative override pass) and say for each
whether the post-pass can leave it true. IF A LATER DRAW OF THE SAME CARD MAKES A BYTE-CLEAN POST-PASS IMPOSSIBLE, say exactly which
draw and STOP (hand back; no code).
MEASURE (the 300 of `measures/page-2/measure.mjs`, every stored field as JSON) before and after: misfit secrets BY CALLING (clergy,
justice, watch, and the rest: the share whose secret is another calling's wrong), principled cards with a venal secret, cards moved
(must be misfits only, and the fields that moved on them), OTHER cards moved (must be 0; any other: STOP), misfits left with no
admitted line. RED FIRST: a test that a misfit card (computed, not quoted) holds an admitted line, red on the lane commit.

## Commit 2: THE GUARD (NOT NOW: built after L4 merges, on PAGE-6's word, from the lane commit then named; until L4 lands the
dean, bishop, priest and abbots have no rows of their own and the guard would be red by design)
A census with a test (its basename may carry "census": it IS a guard; add its mutation manifest row, a sibling's form): every
title a card can carry (enumerate from `people/poolMap.js :: POOL_BY_TITLE` and whatever else assigns a title) has rows of its own
(`TITLE_SECRETS` or `OFFICE_SECRETS`) or a class pool that admits it; and the role-free pool holds NO line that names a duty
(a duty-word list in the test, each word justified in a comment). Red first: show it red by planting one untagged duty line and one
title with no rows; green restored.

GATES (BUILDER-RULES 5) after each commit: your tests; every test file importing `npcData`, `factionLeaderSecret`,
`npcGenerator` or the module you put the pass in; `tests/lint` WHOLE; the two typechecks; `npm run lint`. Expected reds you do
NOT cure: the stored fingerprints (name each with before and after; re-record none), the lighting census's file count. Others:
report by title. Do not reword or remove ANY existing secret row (another seat keeps 119 by text): if you believe one must change,
STOP and list it.
HAND BACK (at most 400 words): branch, both commits; the same-card field list; red/green; the measures; each gate's line.
