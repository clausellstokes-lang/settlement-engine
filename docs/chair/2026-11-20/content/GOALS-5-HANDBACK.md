# GOALS-5 · the hand-back (kept current at every push)

Seat: GOALS-5, a seat of the eighth chair (session_01ACmDYY29VRchM87v1yhL9Q). Orders: `docs/chair/2026-11-21/eighth/prompts/GOALS-5.txt` (from 9d7a3c1dd) and `COMMON-EIGHTH.txt` on `lane/chair-2026-11-08`; COMMON-RULES.txt binds where they are silent. The lane's ONE list of rulings is GOALS-4-HANDBACK.md's "Every ruling in force" (1 to 16), plus the rulings added below.

## WHERE THE LANE STANDS

- `lane/goals-5-2026-11-22`: cut at 825ed351f (GOALS-4's saved tip; `lane/goals-4-2026-11-20` on origin, verified equal). Nothing merged by this seat yet.
- Builders' branches (GOALS-4's, ancestors of the tip): `lane/goals-4-2026-11-20-b10-wip` d83633b9b, `lane/goals-4-2026-11-20-b11-wip` 3d1496328.
- In flight: unit 1 (the 27 failures named): one fresh build, then ONE `VERIFY_DIST=1` run of `tests/generators tests/data tests/lint tests/build` through the mutex. Queued behind it: the arm (u) probe (a scratch test, never committed) counting the movers the "held-text knock-on" class admits, by size.
- Next step: read unit 1's failing rows by name against `ci/RED-AT-LINE.tsv`, sort them, send the list to the chair before any cure.

## Rulings added for this seat

- E54 (in GOALS-5.txt): TIES-HOLD lands as built, the 266 named by size in "WANTS"; arm (u) holds the fixture the line holds (the first lane to land brings its change, the second re-states its movers); the re-pointed fixture d8b174237 lands only with the "held-text knock-on" class narrowed, as the chair rules after the measure.

## Readers of `goal.intent.target` outside the card (unit 3; first read at 825ed351f, by grep of `src/`)

- `src/domain/factionRename.js` :: the rename rows on `goal.intent.short.target` / `goal.intent.long.target` (kind `power`: the id is re-keyed when a faction is renamed).
- `src/domain/institutionRename.js` :: the rename rows on the same two parents (kind `house`: `removal: 'delete-key'`).
- `src/generators/people/goals.js` :: the post-pass (`intentAt`, `intentOf`): the card's own writer.
- Not readers of the target: `src/lib/structuralFingerprint.js` (reads `intent[v].family` only); `src/domain/npc/npcFacetContract.js` (the `key`).
- The edge bundles under `supabase/functions/_shared/` carry copies; they are the chair's at the close.
