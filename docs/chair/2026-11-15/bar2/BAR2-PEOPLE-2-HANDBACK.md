# BAR2-PEOPLE-2 · hand-back (groups POWERS and TIES; REVIEW-BAR-2; the successor of BAR2-PEOPLE)

Seat: BAR2-PEOPLE-2, a builder seat, the successor of BAR2-PEOPLE on its branch `lane/bar2-people-2026-11-15`. Start
tip: **923f2b159** (as the prompt named it). The predecessor's hand-back (`BAR2-PEOPLE-HANDBACK.md`, beside this file)
is the state: batches A and B are committed and not redone. All work in a scratch worktree (detached at the branch's
tip; pushed with an explicit refspec).

## The rulings I worked to (the chair's; each vetoable by the owner)

The predecessor's PP1 to PP10 (its hand-back) and, for PP3, the chair's answers to its two questions:
(PP3a) `other` IS NOT A SHARED CATEGORY: it is the catch-all; two cards whose only common category is `other` share no
trade; a shared house family, or a shared category that is not `other`, is a shared trade.
(PP3b) THE PAIRED TENSION LINE DOES NOT GO WITH ITS DESCRIPTION, AND NO INDEX IS REFUSED: the draw is left exactly as
it is; only the description's text takes a twin where the pair shares no trade (read where the description is
composed); the gloss "are rivals in the same line of work" by the same rule. Only a line whose text claims a PRESENT
shared trade; a shared PAST keeps its text.

## Batch C · PP3 rebuilt (C18001, C15449)

THE RULE'S ROWS, READ ONCE (the rivalry pool, `npcData.js :: STRESS_ECONOMIC_EFFECTS.peer_rivalry`, eight descriptions
and eight tensions, one index each):

- d3 "<A> and <B> bid for the same contracts and sit at the same tables." CLAIMS a present shared trade: twin.
- d6 "Every client <A> wins is one <B> lost, and the reverse." CLAIMS: twin.
- d4 "<A> and <B> trained together and have competed ever since." A shared PAST: not false of two people in different
  houses today: KEPT, struck from the rule.
- the other five descriptions claim the rivalry only (the same thing, ahead, every gain, the position, the patron): kept.
- the eight tensions, read for the same claim: none claims a present shared trade ("hired away <B>'s best assistant"
  presumes none; "<B> has been telling clients that <A>'s work is slipping" claims <A>'s clients, not one trade; "lost
  the last contract to <B> by a single vote" is one contest, past, under its `ruling body` declaration): all kept.
- the gloss (`settlementNarrative.js :: TIE_GLOSS`, the rumour's third phrasing) "are rivals in the same line of work":
  twin.

THE CURE: `pairSharesTrade(a, b)` (npcData.js: the same `institution.family` of two house cards, or the same category
that is not `other`); a row that claims a present shared trade declares `sharedTrade: true` and its `twin`; `pairProse`
writes the twin where both cards carry a category and share no trade (a card without one, the ledger's stand-ins or a
legacy edge, keeps the drawn line, as `endsOf` keeps the drawn order); the gloss reads the tie's two cards off the
town's own cards by the same rule. THE DRAW IS NOT MOVED: no index, no tension line, no other tie changes; a re-render
(`refreshRelationshipProjections`) composes through the same `pairProse`.

MEASURE BEFORE (the census at 923f2b159, python over `corpus.ndjson.gz`, `pairSharesTrade` read as above):

| line | ties printing it | of them, the pair shares no trade (towns) |
|---|---|---|
| "bid for the same contracts…" | 407 | **366** (272 towns) |
| "Every client <A> wins…" | 291 | **246** (202 towns) |
| the gloss "are rivals in the same line of work" (the prominent rumour) | 12 | **11** (11 towns) |
| "trained together…" (kept: a shared past) | 412 | 369 (279 towns) |

(The predecessor's 134 of 291 counted `other` as a shared category; ruling PP3a does not.)

MEASURE AFTER (the census at a snapshot of the batch, `afterC`, read against `before` through the inventory diff, and
the same python over its record): **no pair that shares no trade prints a claiming line** (0 of 366, 0 of 246, 0 of
11); the pairs that share one keep it (41, 45, 1). On the record: 612 descriptions take their twin (366 + 246, exactly),
0 indices, tensions or ends move. THE DECLARED MOVE, by family on the 720 (341 towns): `relationships[].description` 612,
`prominentRelationship.phrasing` 11, `prominentRelationship.full` 9, `pressureSentence` 6 (it copies the rumour); nothing
else. THE INVENTORY DIFF, whole: gone 0 · new 3 · fewer 6 · more 0 · moved 0:

| line | towns before → after |
|---|---|
| "<A> and <B> bid for the same contracts and sit at the same tables." | 291 → 40 |
| "Every client <A> wins is one <B> lost, and the reverse." | 224 → 44 |
| "<A> and <B> are rivals in the same line of work." | 18 → 2 |
| its twin "…sit at the same tables and want the same things from them." | 0 → 272 |
| its twin "Every friend <A> wins is one <B> lost, and the reverse." | 0 → 202 |
| its twin "…are rivals, and neither gives the other ground." | 0 → 16 |
| "Patron deity" and its two upsell lines | 720 → 713: NOT MINE: the seven are each render worker's first page (r2r-thorp-0..2 of the run, four of the re-run below), where the lazy panel is not loaded (the predecessor's note) |

EVERY OTHER LINE OF THE POOL PRINTS IN EXACTLY THE TOWNS IT PRINTED IN BEFORE (no other sentence moved: "trained
together…", every tension line, "Each counts the other's wins…", "The two keep a polite distance…" unchanged). THE
INHERITORS are exactly the three twins, in the towns their claims left. (The container restarted twice during the
census; the before run was re-read from its own 720 dumps; the after run's 9 unrendered and 4 last-written pages were
re-rendered from the same snapshot tree with `--seeds`.)

Guard: `tests/generators/bar2People2Trade.test.js`: 3 pairs RED at the base (923f2b159: 3 failed, 5 passed), 5 KEEP
green before and after (two pairs that share a trade keep the claim; the shared past keeps its text; the tension line
of a twinned index still prints, twice); green at the tip; a plant (`pairSharesTrade` always false, not committed)
reds the two shared-trade KEEPs. Gates: eslint on the touched files, the strict-domain gate (1113, ceiling 1113) and
the type ratchet (167, ceiling 167) green; the presumed-things walker: fresh 3 · stale 3, exactly the base's (the watch
line named under PT3); the twelve-birth grid: 0 falls.

## Batch D · the parked hook (the shop's note for a holder of no shop): LEFT PARKED

The pool map has no such form: `people/poolMap.js` keys a card's hook pool by title and shelf only and declares no row
condition, and the hook rows' declared form (`{ text, needs }`, `npcData.js :: NPC_FACTION_LOYALTY`) reads the town's
atoms only (the draw hands no holder); the by-holder form that exists is the crisis bias's own
(`npcGenerator.js :: MILITARY_HOOKS_TRUE_OF_ANY_HOLDER` / `RELIGIOUS_HOOKS_TRUE_OF_ANY_HOLDER`, with `ownPoolHook`),
in `npcGenerator.js`, outside my files. NAMED for the seat that holds `npcGenerator.js`: the leaf is an economy arm of
that branch (`biasedCat === 'economy'`, an `ECONOMY_HOOKS_TRUE_OF_ANY_HOLDER` set, the holder's trade read as
`pairSharesTrade` reads one card: its house family or a non-`other` category), measure 4 of 140 holders.

## EVERY NEW OR CHANGED LINE (the owner's veto list)

| line (new) | file | read in (smallest · largest · a crisis) |
|---|---|---|
| "<A> and <B> sit at the same tables and want the same things from them. Each counts the other's wins more carefully than their own." (d3's twin) | npcData.js | r2r-hamlet-18 · r2s-wartime-metropolis-2 · r2s-monster_pressure-hamlet-3 (272 towns) |
| "Every friend <A> wins is one <B> lost, and the reverse. The two keep a polite distance and an exact tally." (d6's twin) | npcData.js | r2s-wartime-thorp-0 · r2s-wartime-metropolis-3 · (wartime, both) (202 towns) |
| "<A> and <B> are rivals, and neither gives the other ground." (the gloss's twin) | settlementNarrative.js | r2r-hamlet-20 · r2s-succession_void-metropolis-3 · r2s-mass_migration-hamlet-1 (16 towns) |

## Rows named for other seats (and for the record's seat)

- the record's seat: the free rung beside a seat holder who shares in a criminal house: **170** of the 589 free-rung
  towns (the predecessor's count; `hallCapture.js :: writeHallCapture`); the salt works whose chain the record calls
  running while its input is short (C25259, 4 towns; the chain's state).
- the density law's seat: C32434, `applyDensityLaw.js :: pruneToRoster` (the predecessor's).
- the seat of `npcGenerator.js`: the shop's hook for a holder of no shop (batch D).

## THE BOOKS MY CURES MOVE (F2)

Held for the chair's "MERGE THE LINE AT <tip>".

## Guards

- `tests/generators/power/bar2PeoplePowers.test.js` (batch A), `tests/generators/bar2PeopleTies.test.js` (batch B),
  `tests/generators/bar2People2Trade.test.js` (batch C).

## How the instruments are re-made

As the predecessor's: `git archive` CENSUS-3 and READ-ALL to a scratch directory; `census3.sh <tree> <out> 4
--count-only` at a base tree and at a snapshot tree; `inventory.py`; `inventory_diff.py`. The PP3 measure is
`m_pp3.py` (python over `corpus.ndjson.gz`, `pairSharesTrade` as above).
