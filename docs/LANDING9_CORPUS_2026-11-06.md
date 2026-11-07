# LANDING-9 corpus lane — the tier-change coverage rung and the writer-reach re-bank (2026-11-06)

Seat: Opus 5.5, child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), re-scoped by the chair at
23:40 UTC to items 1 and 2 of `BRIEF-LANDING-9`. Branch `lane/landing9-corpus-2026-11-06` from `3c62e8ef5`.
No full check and no `verify:dist` (the chair's re-scope); each walker green from its own run is the proof.

| red | cause (step, commit) | door | what moved | state |
|---|---|---|---|---|
| `observedShapeReaders.walker` (4) | lane B's step `103b1db81`, R-B1 `2168ffdba`: the promotion window reads the stamp cut (lit: the whole 2,250). Producer 2's populations never move in 12 intervals, so its pulse lost the town → city candidate (osr001/osr013, towns of 2,168, intervals 5–12 at `3d8a74e4b`). That was the corpus's only `pulseResult.candidates[]` row carrying `tierChange` and `fromTier`/`toTier`/`direction` | the corpus builder (a detector source), so a governed migration: schema 27 → 28, act 1 `0e7f12b01` (producer 2b and the rung), act 2 `95717c2db` (the re-mint) | producer 2b: a one-save pulse over `osr-tier-14` (a CONFIGS[0] town of 2,414, over the city cut), with the same lit rules and 12 intervals. It enters `roots` only, as a bounded view of its tier candidates, and nothing enters `generated`. Reconciliation EMPTY (1,450 same; 0 new, gone, grown or shrunk). Execution keys unmoved; `shapeCount` 1261 → 1259; bank 76/50 unmoved | GREEN: walker 47/47; instrument suites 128/128 (175 across the five files); ordinary gate exit 0 |
| `writerReach.walker` (9 → 10 at act 2) | lane E's step `471780f4a`: 41 new dark identities (30 on `pulseRecord`), as LANDING-8 measured. Producer 2b adds no growth row (judged 6,681 → 6,691) and brings back 3 stale bank members (`minimumStreak`/`support on metadata`, `populationConserved on candidates`). The tenth red was the lit arm's frozen digest | `--rebank --charter=§934.105`, `6bbbf878f` | cohort 1,232 → 1,266 (+41 admitted, −7 stale folded); register sha256 `5924d814` → `6b998e56` | GREEN: 51/51, the three corpusMeta arms included |

The seed search (`osr-tier-0..39` × the four CONFIGS; a settlement counts only if it is generated at or above the next
tier's cut, then pulsed alone under the lit rules). Towns on configs 0/3: `-14` (2,414), `-19` (2,477) and `-28` (2,282)
mint at interval 5. `-25` (2,394) mints on config 3 at interval 12 and never on config 0. Villages on config 2 (368–397)
never mint within twelve. Producer 2b throws if its seed ever stops minting.

Other consumers of the corpus builder, from their own run at the tip: `newsHeadlineContract`, `newsVoiceContract`,
`proseFamilyContract`, `flavorFields.census` and `statecraftGateReadCureP1`, 33/33 green.

Landing note: `validateBaselineHistory` binds the schema-28 receipt to subject `0e7f12b01`. Acts 1 and 2 must land with
their shas intact: a merge, never a squash or rebase.

Notes for the siblings, measured before the re-scope and NOT pushed:
- Edge-shared bundles. The hash moved at lane E's step `471780f4a` (`20c0139c5`, DENSITY_CEILINGS; aiCharter and
  aiOutputSchema) and at lane H's step `18fd6b442` (`8e92c0440`, the watch text; all three). It did not move at lane F.
  A rebuild through `npm run build:edge-shared` sits at local commit `197156fce`, not on any branch. All five metas must
  come from ONE run (CR-EB-2 (b)).
- `intentAtlasSoakDistiller`, `x46NpcBand`, `institutionBudgetPromise` and `powerEconomyFreshness` are all green at
  `3d8a74e4b`, `103b1db81` and `8e60cb2a5`. The bisect stopped there.
- This checkout was a shallow clone, and the observed-shape checker needs its genesis `1f6a66d06`, so the clone must be
  unshallowed.

Nothing in this lane stays red.
