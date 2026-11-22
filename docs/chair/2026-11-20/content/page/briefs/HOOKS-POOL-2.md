# HOOKS-POOL-2: the second tranche's first aim: the hooks' second-place share under 30% at every size. PAGE-12's brief, written 2026-11-22 (the hour is in the commit that adds it). CUT ONLY AFTER THE CHAIR SAYS POINT 96 IS ON THE LINE.

THE AIM (ruling 16 (2), the chair's 05:58 and 06:00): the closing measure (`measures/page-12/close/`) left the hooks' second-place share
(`hook2`: over every unordered pair of distinct places of a size, the share that store at least one hook word for word in common) OVER
its 30% bar: M city 32.4%, M metropolis 36.5%, V city 30.3%. A pool model (PAGE-12's paper, 06:0x) puts the repeat in two pools'
need-free cores: `guild_conflict` (6 of 16 lines need-free; about 12.6 points) and `crime_wave` (10 of 16; 10-11.6 points). THE CURE,
RULED: +12 lines to each pool (16 -> 28), the lines below EXACTLY as the chair ruled them (06:00 and 06:07 UTC: 16 as first
written, 6 reworded by the chair: guild_conflict 7; crime_wave 1, 2, 5, 9, 12; 2 HELD to the walkers: guild_conflict 9, crime_wave 8).

Read first: `CLAUDE.md`, `briefs/BUILDER-RULES.md` (every rule binds), the chair's common rules (`git show
origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/prompts/COMMON-RULES.txt`: rules 1, 5, 6, 12, 14 (e)), WHOLE:
`src/data/troubleHooks.js`, `src/generators/history/troubleHooksOf.js`, `tests/generators/troubleHooksPools.test.js`,
`briefs/HOOKS-BUILD.md` (the mechanism and its arms), `briefs/CLOSE-MEASURE.md` and `measures/page-12/close/close.mjs` (the measure
you re-run). Read no wider, except the files a failing walker names.

THE LINES (append to `TROUBLE_HOOKS.guild_conflict` and `TROUBLE_HOOKS.crime_wave` in this order; `[]` = needs nothing):
guild_conflict:
 1 [] Two masters have each hired the same carter for the same morning, and he will not say which one paid more
 2 [] A load of raw goods meant for one side was bought out from under it, and the buyer is still in the place
 3 [] A traveller has come looking for work with whichever side pays better, and both sides are bidding
 4 [] A workshop that sided with neither has had its door marked in the night, and the owner wants to know by whom
 5 [] A meeting between the two sides is set for tomorrow, and both want someone neutral in the room
 6 [] An old agreement that settles who may sell what is said to be written down somewhere, and nobody has seen it in years
 7 [] A craftsman's best work has been copied and sold more cheaply, and the craftsman can name who did it
 8 [] A widow carries on her husband's trade, and both sides want her custom, her tools and her silence
 9 HELD [] Goods from outside are selling well this season, and someone is quietly buying up the stock
10 ["guild"] A guild officer is collecting dues from people who swear they never joined
11 ["guild"] The guild has called a vote on the quarrel, and a few members have had visitors at night beforehand
12 ["market"] The weights at one side's market stalls have been found short, and that side swears they were tampered with
crime_wave:
 1 [] A household's strongbox was opened without being forced, and only three people held a key
 2 [] Someone has been paying for copies of house keys, and the one who cut them is having second thoughts
 3 [] A child has been seen climbing in through windows at night, and a family wants him caught before anyone else does
 4 [] A householder has set a trap for the thief, and wants someone to sit up with him tonight
 5 [] A stolen heirloom has turned up for sale a day's travel away, and its owner wants it back quietly
 6 [] A woman swears she saw her own stolen cloak on a stranger leaving the place at dawn
 7 [] A family has taken in a lodger since the thefts began, and the neighbours have noticed
 8 HELD [] A shop's takings go missing a little at a time, and the owner suspects one of the three who work there
 9 [] A hound that barked every night has been poisoned, and the household expects the thieves tonight
10 [] Two neighbours accuse each other of the same theft, and one of them is lying
11 [] A cart thief left his own horse behind, and someone will come looking for it
12 [] A reward has been offered for the thief, and a stranger claims to know where the stolen goods are kept

THE TWO HELD LINES (guild_conflict 9: presumes trade from outside; crime_wave 8: presumes a shop): each EITHER passes the presumption
walkers as it stands, OR takes the ONE declared need the walker names (never a hideable house, never a crime fact), OR, if neither,
STOP and send PAGE-12 a rewording inside its meaning: PAGE-12 puts it to the chair; do not invent one.

THE SMALLEST SIZE (the chair, 06:00): a need-free line must be TRUE at the smallest size where its kind occurs in the measure's pools.
In V (`kinds.md`): guild_conflict from VILLAGE (2/150), crime_wave from THORP (17/150); confirm both on M from the measure's own births
and say the size for each kind in your reply. Read the nine need-free guild lines and the twelve crime lines against that size ONCE:
for each noun the line presumes (a workshop, two masters, a carter, a merchant's strongbox, a lodger, a cart, a hound...), say whether
the record of a place of that size holds it (by the generator's own roster or the vocabulary's reader), and STOP on any it does not
(report the line and the noun; PAGE-12 puts it to the chair). No "town" for a smaller place. NO LINE GAINS A NEED ON A HOUSE OF A
HIDEABLE KIND (`cardVeil.js :: isHideableHouse`) or a crime fact: the eleven listed hideable rows stay ELEVEN.

THE WORK, commits in order, by explicit paths, receipts in each:
1. THE LINES in `src/data/troubleHooks.js`, its header comment's counts amended (16 -> 28 for the two kinds); the pools test's counts
   (`tests/generators/troubleHooksPools.test.js`) by its own arms (arm 1's ruled counts; any snapshot by its own writer, named). RED
   FIRST: the counts arm red before the lines, green after.
2. THE PROOFS: (a) the two-tree tool (`measures/page-12/parity/confinement/`, 150 a size, before = the lane's tip at your cut, after =
   your commit): ZERO non-string differences, the string differences BY FIELD (expected `history.currentTensions[].plotHooks` only);
   (b) the closing measure re-run BY ITS OWN SCRIPT (`measures/page-12/close/close.mjs`, both pools, BEFORE = 43ab0f5eb as ruled,
   AFTER = your commit; outputs under `measures/page-12/close-2/`): hook2 UNDER 30% AT EVERY SIZE, both pools (if any size is not,
   STOP and report its figure: no more lines without the chair); the top shares under 20%; (c) the declaration pin
   (`tests/domain/tensionCauses.test.js :: DECLARED` is the causes'; the hooks' own pin if any) moved and NAMED.
3. THE REGISTERS by their own doors: pool-dominance (`scripts/census/pool-dominance.mjs --bank-new` is the lane's door; a raised or
   lowered ceiling of the two TROUBLE_HOOKS rows: read-only report, and `--tighten` ONLY on the chair's word); the lighting census and
   the wiring census are PAGE-12's (report their reds by name). The sameness walker (`tests/lint/samenessHideable.walker.test.js`)
   and its house readings: the 24 lines add RULE 2 readings under `TROUBLE_HOOKS` only (`guild`, `market`): re-take the readings by
   the walker's own reading as LINE91-SAMENESS-2 (c) did, rows only under that table, counts by house in the commit; the bank 155
   UNMOVED; the eleven listed rows unchanged.
GOLDENS: name every stored fingerprint or golden that moves (test file and title); RE-RECORD NONE, sign none.

GREEN: the presumption walkers (`tests/lint/presumption*`) and the sameness walker green, the bank unmoved; `tests/generators/
troubleHooksPools.test.js` whole green (arm 1d stays where it is); BUILDER-RULES rule 5 whole. Run every test as
`/home/user/page12-bin/nogit.sh sh scripts/gate-mutex.sh --run -- <command>`, to a log, read by its count lines, never through a pipe;
set the ledger ref first (`git branch -f review-fixes-2026-07-08 origin/review-fixes-2026-07-08`). Never push, merge or open a pull
request. If your own permission check refuses any action, the refusal stands: report it and try nothing in its place. Reply at most
300 words: the commits; the held lines' outcome; the smallest size per kind and every noun's answer; the two-tree figures by field;
hook2 and the top shares by size, both pools, before and after; the registers; the goldens moved by name; every stop; every judgment
this brief did not settle.
