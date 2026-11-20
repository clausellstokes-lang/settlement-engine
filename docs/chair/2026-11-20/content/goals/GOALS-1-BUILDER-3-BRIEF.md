# GOALS-1 · builder 3 · GR3 for ties: the head frozen, reserve pairs reached only past it (no content)

Written 2026-11-20 10:32 UTC by GOALS-1 (the integrator), on `lane/goals-1-2026-11-20`. You build; GOALS-1 reads your diff line by line and re-runs your red and green. The chair's rulings of 10:28 UTC: the reserve mechanism is accepted for ties ("the head size frozen; new pairs reached only past it"), and a template that must be held twice is never held by two people tied to each other.

## Read first, and no more
`CLAUDE.md`; `src/generators/power/relationshipArchetypes.js` WHOLE; `src/generators/people/ties.js` WHOLE; in `src/data/npcData.js` the block from `pairProse` to `STRESS_ECONOMIC_EFFECTS`'s first archetype, `HANDLER_TIE_ARCHETYPES`, and the five archetypes `mutual_leverage`, `old_debt`, `peer_rivalry`, `wary_alliance`, `mentor_legacy`; the tests that read a pool's size or lines: `tests/generators/tieDrawDeclared.test.js`, `tieDrawUnprinted.test.js`, `blocLineSharedPower.test.js`, `tests/domain/bar4PeopleKinds.test.js`, `tests/generators/people/ties.test.js`. READ ONLY: `src/domain/facts/drawDeclared.js`, `factVocabulary.js`.

## Today (measured on 300 towns)
`createTieProseDraw` already deals a town's ties of one archetype WITHOUT REPLACEMENT (GS-1): the head cycle `(base + used) % size`, then an overflow over the lines that name both cards. So GR1 holds for ties; the repeats are pool exhaustion (mutual_leverage: 8 pairs against 26 ties in one metropolis). Adding pairs to an archetype changes `tension.size`, the cycle's modulus, and would move EVERY tie of that archetype in every town. Hence:

## The design (build exactly this; stop and tell GOALS-1 on a mismatch)
1. **Reserve pairs in the data.** `pairProse` takes an optional reserve list (a fifth argument, default empty): its `lines` are the variants followed by the reserve, its `size` the total, and it carries `head` = the variants' count. A stored index `i` reads `lines[i % lines.length]`, so every stored index below `head` reads exactly what it reads today. An archetype's `desc` and `tension` take reserve lists of the SAME length (one index picks both). In this unit every reserve list is EMPTY: no content.
2. **The head is frozen.** In `createTieProseDraw`, the head cycle's modulus, `bothNamedTensions`, and the pool that a head index's refusal resolves over (`tiePairPool` as used by `resolveAt` in the head and in today's overflow) are the first `head` entries only (`archetype.tension.head ?? archetype.tension.size`). So with empty reserves, and with non-empty ones, every tie today's code deals is dealt the same index, byte for byte, EXCEPT where step 3 applies.
3. **A repeat past the head.** Only where today's resolution yields an index ALREADY PRINTED in the town for this archetype (`draw.printed` before this tie: a repeat), choose instead, draw-free, in this order:
   (i) the first reserve index (`head` … `size − 1`, in order from `(base + used − head) mod reserveCount`) that is not printed and that the house's rule admits (`drawDeclared` through `resolveAt`, the pair as context, with the printed and contrary indices held);
   (ii) else an index printed ONCE whose earlier tie shares no card with this one (keep, per archetype, the cards of each printed index), first in the order today's overflow cycle would visit;
   (iii) else today's result stands.
   A replacement must declare the SAME `trust` as today's result (both none, or equal), so the pair's trust and the tie's temper (`ties.js :: temperOfTie`, which reads a printed line's `trust`) and every later tie's draw are unchanged. `draw.printed` records the index actually printed.
4. **What may differ on the record:** only a repeat's `description`, `tension` and `proseVariant` (the stored index, which a re-render reads: `generateSettlementPipeline.js :: refreshRelationshipProjections`). Nothing else on any tie, and no other tie.

## Tests (red first, then green; compute, never quote a pool's sentence)
New file `tests/generators/tieReserveHead.test.js`:
- (a) **the frozen head:** an archetype given a reserve (built in the test with `pairProse`-shaped data through the module's own path if one is exported; otherwise stop and tell GOALS-1 what export it would take: do NOT add a test-only export without asking) deals its first `head` ties exactly as without the reserve.
- (b) **a planted repeat past the head** takes the reserve's first free index; with the reserve spent, an index printed once by a tie sharing no card; and never one whose earlier tie shares a card, where another is free. Red on the base where it can be (the base has no reserve: write (b)'s "printed once, no shared card" arm so it reds on the base).
- (c) **the trust guard:** a replacement whose trust differs from today's result is passed over.
- A hand-made input must not have a drawn sentence's shape (`tests/lint/proseDrawnAnchors.walker.test.js`).
Keep green: the five test files above, `tests/generators/people`, `tests/lint/proseDrawnAnchors.walker.test.js`, `tests/lint/namesInSentences.walker.test.js`.

## Gates (to files, read by their count lines, never through a pipe: `sh scripts/gate-tail.sh <cmd>`)
The new test red on the base, then green; the files above; `npm run typecheck:ratchet`; `npm run typecheck:domain:strict`; `npm run lint`. Never the whole suite.

## Your files
`src/generators/power/relationshipArchetypes.js`, `src/data/npcData.js` (`pairProse` and its JSDoc only; no line of any archetype changes), the new test file. No rename of any function or file. Do NOT commit and do NOT push; report back (files changed, the design as built where it differs in any detail, red and green with counts and log paths, anything undone).
