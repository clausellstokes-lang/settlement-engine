# D4C-MEASURE — DAILY-4's "DAILY-C" (the owner's three, his word "Fix all:"), STEP 1: MEASURE ONLY

Seat DAILY-4. Builder branch `lane/daily-4-2026-11-22-c-measure-wip`, cut at the seat's DAILY-B tip 4e7fa5667. YOU
CHANGE NO FILE UNDER `src/` OR `tests/`. You write ONE script and its outputs under
`docs/chair/2026-11-20/content/daily/measures/D4C/` and commit them (explicit pathspecs, no push).

Births: M1's 900 (150 a size, seeds `hxd-<size>-0..149`; recipe in `measures/M1/measure.m1.mjs`, copied not imported;
`owner/owner-file.mjs` is a 29-line example). The page: `domain/dailyLife.js :: deriveDailyLife(record)` and
`DAILY_LIFE_PAGE_SLOTS` (the eight, in page order); the owner-only slot `commoner_resentments_dm` is derived with
`{ audience: 'owner' }` and is measured SEPARATELY (it never changes what the public eight print). Read
`src/domain/dailyLife.js` WHOLE and the six pool files under `src/data/dailyLife/` (headers and structure; the lines
are already ruled) to learn how each slot picks its sentences (branch / condition, `needs`, keyed pick).
Run the script ONCE through `sh scripts/gate-mutex.sh --run -- node <script> > <out>` (background with a long
timeout; wait in pieces under ten minutes; read outputs by grep/head, never whole into your context).

## TABLE 1 — ONE FACT TWICE ON A PAGE (the owner's (1))
Seen: hxd-city-0 opens (outsider_impressions) "The country around is overrun with beasts…" and closes (recent_changes)
"Beasts now roam the country around…". For every page, find pairs of slots whose printed sentences STAND ON THE SAME
FACT. Define the fact of a sentence by what the derivation drew it ON: the branch/condition key that selected it (e.g. a
stress, a threat level, a band) and its declared `needs` atoms — instrument the derivation in your script if it does not
return which pool row it used (re-derive per slot, or match the printed sentence back to its pool row after the
template is filled). Report: by (fact, slot A, slot B): pages count by size, and ONE example (seed, both sentences).
Then a BORDERLINE list: pairs where one sentence only NAMES the same thing (the ruler's name, the place's house) while
stating another fact (e.g. a resentment line that names the Elder Council beside an outsider line about the council):
by (shared thing, slot A, slot B), count, one example. Also, separately: the owner-only line against the eight.

## TABLE 2 — THE SAME SENTENCE IN TWO PLACES (the owner's (2))
Per slot, per size: each sentence FAMILY (the pool row id / template before names are filled, e.g. legitimacy L5 "People
do as {gov} says…") and each filled sentence: its share of ALL 150 places of the size and its share of the places that
PRINT the slot. Find the sameness door's own bar (`scripts/census/` and `tests/lint/samenessHideable*` /
the sameness census walker: say file and value; COMMON-RULES 3 says about 15% of all places of a size, to 20% as
sampling, and a pool carries at least reach/0.15 eligible lines). List every family and every filled sentence OVER that
bar, by slot and size, with its share and its pool's eligible-line count. The two seen in six places:
"People do as the Headman's Authority says, but few of them think well of it." and "How the place should answer the
danger it has been warned of is argued in private, not before strangers." — their rows always, over the bar or not.

## TABLE 3 — "the Headman's Authority's mark" (the owner's (3))
Count, on the 900 Daily Life pages (eight public + owner-only), sentences where a POWER's name that itself holds
"'s" (Headman's Authority, Lord's …) is followed by another "'s", and any "<power name>'s" at all (the possessive on a
power's name): count, slot, pool row, one example each. Then THE REST OF THE PAGE: render every dossier tab for 30
births (five a size, seeds `d4c-<size>-<i>`) by the harness `tests/components/publicProseEquality.test.jsx` or
`dossierPhoneFloorAllViews.test.jsx` uses (read how it mounts; you may run a COPY of its mounting code as a vitest file
under the measures directory ONLY IF it cannot run as a node script: then run it with `npx vitest run <that file>` and
delete nothing of the tree), and count the same double possessive in the rendered text, by tab, one example each.
If rendering every tab is not feasible inside about 40 minutes of work, say so and count instead the source templates
under `src/` that append "'s" to a power or faction name (grep), by file.

## Report (at most 300 words + the three tables' headline rows)
Commit sha; the bar's file and value; table 1's top rows and the borderline rows; table 2's rows over the bar; table 3's
counts. Files you may read: this brief, the files named above and what they import for the derivation.
