# DEPTH-1 hand-back (HANDED OVER to DEPTH-2; last written 2026-11-20T14:53Z by `date -u`)

Branch `lane/depth-1-2026-11-20`, cut from the working line `43ab0f5eb` (= origin/lane/join-2026-11-14 at the seating).
Brief: origin/lane/chair-2026-11-08 `docs/chair/2026-11-20/seventh/prompts/DEPTH-1.txt`. A successor needs this file and the briefs.

## 1. The proposal, as ruled (the chair, 14:40 UTC: "APPROVED AS PLACED")
`PROPOSAL.md` (at 936f843e9). Ties: +14 pairs each to wary_alliance, peer_rivalry, old_debt, mutual_leverage; +12 each to
mentor_legacy, genuine_respect (80 pairs). Hooks: `other` +30, economy +14, criminal +8, government +8 (60). IN THE DRAW from the
first card; APPENDED, so every saved town re-renders to today's lines (20,014 of 20,014 stored ties, census 720). Rulings:
(1) a tie line is a PAIR, description and tension, both mine (the "tensions" not mine are the TOWN's troubles);
(2) `src/domain/hookThemes.js :: AUTHORED_HOOK_THEMES` is the second hook file: every new hook tagged, with a test that no new
hook is untagged (the existing walker `tests/lint/hookThemeTotality.walker.test.js` reds on an untagged template: the red first);
(3) hooks first; ties ONLY on the commit the chair names when the goals work lands; two separate movements of the stored
figures, each named, signed by none.

## 2. The verdicts on the lines
- HOOKS (`lines/HOOKS-1.md`, `HOOKS-2.md`; the chair, 14:50 UTC): 59 approved as written (`other` 1-29, `government` 1-8,
  `economy` 1-14, `criminal` 1-8), the integrator's four edits accepted. `other` 30 REWORDED BY THE CHAIR and RE-TAGGED:
  "They were asked to put in a good word for someone, said yes, and have not yet put the word in." [hidden_debt] (recorded at
  HOOKS-1's foot; the theme table above it is stale on that line). Watched lines stand (other 21 the shut door; criminal 6).
- TIES (`lines/TIES-1.md`, `TIES-2.md`; the chair, 14:53 UTC): ALL 80 approved as written, with the integrator's edits and the
  three `[trust: full]` marks (genuine_respect 2, 7, 12: they carry `trust: 'full'`). Use R -> `${r.name}`, S -> `${s.name}`;
  each pair `{ line: (r, s) => \`…\`, colour: true }` appended to `desc` and the same index of `tension` (old_debt: debtor first).

## 3. The measure (one command; re-run it before and after each build, by size)
From `docs/chair/2026-11-20/content/depth/measure/` (needs the chair's `measures.mjs` and `bill.mjs` from origin/lane/chair-2026-11-08
`docs/chair/2026-11-20/seventh/measures/owner-q3/` copied beside `born.mjs`, which is RECONSTRUCTED here: the chair's was never
committed; with it both reproduce the chair's outputs byte for byte):
`node measures.mjs <tree>` -> `measures.line-43ab0f5eb.out.txt` (the line) and `measures.probe3.out.txt` (the placeholder tranche).
THE BAR the built towns are read against (placeholder births, an upper bound): ties city 62.8% -> 37.2%, metropolis 73.4% -> 48.9%;
hooks city 46.5% -> 31.5%, metropolis 63.5% -> 42.5% (town: ties 35.4 -> 16.5, hooks 25.3 -> 17.1).
The two-tree run: origin/lane/names-3-2026-11-20 `docs/chair/2026-11-20/content/tools/confinement/trees.mjs <before> <after>
<workdir> --words=none`; tally every non-string path with `measure/nonstring.mjs <born-before> <born-after>`; saved ties with
`measure/rerender.mjs <line-tree> <built-tree> <born-before>/census.jsonl`.

## 4. The counted classes (accepted by the chair; report each apart with its count on golden 525 and census 720)
Probe 3 (both pools at once): the only number moving is `relationships[].proseVariant` (golden 11,052 / census 15,544 ties);
`npcs[].secret.what/stakes` via `src/generators/people/rareSecrets.js :: dealRareSecrets` reading hook text (71 / 9 cards);
a second tie's archetypeKey/type/strength via `people/ties.js :: temperOfTie` (1 / 3); `npcs[].goal.long` (1 / 1);
receipt `record_coherence_battery` findings ±1, same finding (35 golden). Strings: plotHooks, tie description/tension,
prominentRelationship (quotes a tie), pressureSentence (quotes a tension). A HOOKS-ONLY build should move no proseVariant; any
difference outside these classes is a finding, to the chair at once.

## 5. Asked for after the deploy (count only; build nothing)
Over the 300 towns (`born.mjs`), how many cards of a principled temperament (`personality.dominant` in npcData.js
DEALING_TRAIT_FAMILY 'straight': honest, candid, forthright, plain-dealing, principled, incorruptible, fair-minded, equitable)
hold a hook whose `themeOfText` is `corruption`: before (the line) and after (the built hooks).

## 6. The order and the state
- HOOKS: to be built NOW by DEPTH-2's builder: brief `briefs/BUILD-HOOKS.md` (at 598858a9c; it carries the chair's reword).
  DEPTH-1 dispatched a builder at about 14:52 UTC, before the chair's 14:53 word; it was STOPPED at once having made no change
  and no commit; its worktree and the local branch `lane/depth-1-2026-11-20-hooks` were removed (nothing lost, nothing pushed).
  A local branch `worktree-agent-a71fa6124ea7fc05d` (at e877d30a2 "Add files via upload", made by the harness, not by DEPTH-1)
  was left untouched in DEPTH-1's container.
- TIES: built ONLY on the commit the chair names when the goals work lands (`src/generators/power/relationshipArchetypes.js` and
  the ties' pools are the goals seat's until then): merge that line, then cut the builder from a brief like BUILD-HOOKS.
- Hazards: placeholders with digits mask to one line (the masker turns digits to #); untagged hooks pass the theme preference
  every time and become the new head; a description appended without its tension is never reached (the cycle is tension.size).
- Push discipline kept: `git ls-remote` before each push; no commit while a push was in flight; no push log showed `npm run check`
  (the pre-push hook ran typecheck:ratchet, typecheck:domain:strict, lint).
