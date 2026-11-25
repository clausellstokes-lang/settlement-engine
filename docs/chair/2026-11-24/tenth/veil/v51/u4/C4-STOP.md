# V14 CONDITION (4): B2's STOP, THE DECIDING COUNT, AND A STOP (VEIL-51, 2026-11-25 ~01:15 UTC)

## THE COUNT (CONFIRMED; `c4count.mjs` beside this file, offline; output `/var/tmp/v51/out/u4/c4count.txt`)
R5D's own page reader (`pageRederive.js :: rederiveStanding` at aa54a6791) over every stored power on a read that hides NOTHING (the
whole stored roster), compared byte for byte with the stored desc (tails by R5D's reference cut):
| set | powers | SAME | ADDED (stored no tail; S writes one) | CHANGED (both tails; differ) | DROPPED (stored tail; S none) |
|---|---|---|---|---|---|
| today-born 140 (the tip's engine) | 754 | 750 | 3 (density rivals: The Enlightened, The Underground, The Shield Compact) | 1 | 0 |
| master-born 140 (db832c892) | 765 | 193 | 18 | 381 | 173 |
- TODAY-BORN: the three ADDED rows were minted after the standing write (each carries `contestsNiche`). NO SERVED KEY decides them:
  `contestsNiche` is withheld on every read (served 0 of 3; V4's always-pass row); `name` is on 111 other rows, most with no tail and
  10 with one; `generatorVersion` is "0.9.0" on all 280 records of both pools.
- MASTER-BORN: master's writer wrote OTHER WORDS (e.g. "Noble families retain title, ..." where today's writes "Noble families keep
  their titles, ..."), so S cannot reproduce 572 of 765 standings; and the page cannot tell a master-born record from a today-born one
  by any served key read here.

## THE ANSWER TO (4): THE PAGE CAN KNOW IT ONLY FROM A NEW SERVED MARKER: STOP, AS THE CONDITION SAYS
The marker that would serve, its exact shape: written AT BIRTH by the engine's standing writer, on each row it gave a tail,
`powerStructure.factions[i].standingWriter: 1` (the writer's form version; absent on every row it did not touch and on every record born
before it, which is every live record). The page writes S's standing ONLY on a served row carrying it with the version the page's writer
is; everywhere else it prints NO standing (fail closed: every master-born and every live record today prints none).
WHAT A READER COULD LEARN FROM IT: (a) on any read, which powers were ranked into a standing at birth over the WHOLE roster; (b) on a
HIDING read, a marked row for which S over the served roster writes nothing (or the reverse) tells that the roster held another power:
a tell whose size I have not measured (it needs the hiding reads' served rosters; the twin gives them offline: about an hour's measure).
THE ALTERNATIVE THAT NEEDS NO MARKER: phase 1 as the cut alone: the standing tail withheld on every non-owner read and the page prints NO
standing (fail closed, nothing served, nothing told); reader S and any marker go to V5's put-back, with the tell measured first.
