# BRIEF — ALLEGIANCE CAR 1: corruption becomes a hidden allegiance, with fronts, one handler each, the readers re-pointed, the save migration and the veil test (2026-11-08)

**Seat:** ALLEGIANCE-CAR1. **Chair:** session `01FE9mEvGxnFx6WTBkEC6ie9` (Opus 5.5), under the owner's full delegation — never ask the owner anything; the chair rules; where the design and the code disagree, STOP on that item, record it with the evidence and your recommended default, and carry on with the rest. **Effort:** high. **Context:** 1M — plan to finish the whole car; do not stop short of it; if you reach your context line, push with the remainder listed by step in your record.

The owner's words for this car (verbatim, 2026-11-08): *"this new structure also replaces the compromised tag as it relates to criminals. Instead of saying compromised. An NPC simply has an allegiance to the thieves guild … We had it that at generation only certain personality types that are not already in a criminal institution can become compromised. Keep that but now randomly (scaling to criminal slider and activity and organized crime etc), randomly choose amongst the NPC and/or legitimate business to have this hidden allegiance rather than a compromised tag. The compromised tag from now on would only appear for the simulator purpose"* and *"a number of legitimate businesses with affiliation to the criminal powers to have ties with NPCs that are voluntary or part of criminal institutions as being leveraged against…"*. The governing principle: **plausibility with confidence, not predictability** — weighted rolls, invariants as checks, a receipt for every surprising outcome.

## 0. Read first

1. `docs/OPERATING_STANDARD.md`, `CLAUDE.md`, `CONTRIBUTING.md`.
2. `docs/allegiance/ALLEGIANCE_DESIGN_2026-11-08.md` — the whole document; car 1 is §1.2–§1.5, §2 (A1, A2, A4, A7), §3.1, §4 (I-2, I-3, I-4, I-10, I-12, I-13, I-14, I-15), §5 (car 1's rows), §7 whole, §8, §10 row 1.
3. `docs/allegiance/ALLEGIANCE_RULINGS_2026-11-08.md` — J-1 to J-14, J-17, J-18, J-20 bind car 1, with the conditions written there (J-1: ONE field, ONE reader `allegianceOf`, `power` set whenever a criminal power exists; J-11's floors are car 2's, but your split must leave the rank deal byte-identical).
4. The law of the chain and the golden door: `docs/chair/2026-11-07/BRIEF-MERGE-CAR-2026-11-07.md` §0, `scripts/audit/landing-stage.sh` (read, do not run it to sign), and the writing lanes' rule for generator moves on a lane branch (below, §3).

## 1. The branch and its base

1. Cut `lane/allegiance-car1-2026-11-08` from `origin/lane/integration-2026-11-07`.
2. Merge `origin/lane/fix-public-veil-2026-11-07` (eb18cb458) — the veil is car 1's dependency (design §10). MERGE-WAVE merges the same commits onto the integration line later, so the train composes; its news-family walkers stay red for MERGE-WAVE (FIX-PUBLIC-VEIL's record §16) — not yours.
3. Merge `origin/lane/allegiance-design-2026-11-08` (the design, the rulings, the briefs).
4. Record the base's reds (the full vitest run at your base, through `sh scripts/gate-tail.sh`) BEFORE your first change: your tip's reds must equal the base's minus the ones you cure plus nothing, apart from the golden rows your cause moves (§3).
5. If MERGE-WAVE has landed on the integration line before your proof (step 9), merge the integration tip in as your last code step and prove at the composed tip.

Push form, three plain separate Bash calls: `git add -A`; `git commit -q -F <msgfile>`; `git push --no-verify -u origin lane/allegiance-car1-2026-11-08`. **Push at most about once an hour and at the hand-back** (Vercel's 100-a-day cap counts every branch push; the master merge's deploy must find it unspent).

## 2. The manifest (design §10 row 1; anything outside it is a STOP)

CREATE: `src/domain/people/allegiance.js` (`allegianceOf`, `hiddenMembershipOf`, `ALLEGIANCE_TUNING`, `dealAllegiances`, `assignHandlers`, `organizedCrimeOf`, the receipt); `tests/generators/people/allegiance.test.js`; `tests/security/allegianceVeil.pglite.test.js` (on `gallerySanitizer.pglite.test.js`'s harness); `tests/lint/noLegacyCorruptReaders.walker.test.js` + `tests/lint/legacyCorruptReaders/dormant-list.json` (the §7.3 census, the exact set measured); your record `docs/allegiance/ALLEGIANCE_CAR1_2026-11-08.md`.
MODIFY: `src/generators/people/castPowers.js` (split `assignCastPowers` into `landMemberships` + `rankPowers`, a byte-identical refactor in its own commit FIRST, its golden-identity proved); `src/generators/narrativeGenerator.js :: enrichNpcCoherence` (A1 → A2 → A3 → A4 → A5 → A7); `src/generators/people/ties.js` (the forced handler target, `covert: true, handler: true`; I-12 holds); `src/generators/power/relationshipArchetypes.js` and `src/data/npcData.js` (the seven handler archetypes — compose them beside `STRESS_ECONOMIC_EFFECTS` with the file's own `pairProse` from WRITE-PEOPLE's `HANDLER_TIE_LINES`; the smallest edit, since W4 and W5 also changed `npcData.js` — MERGE-TRAIN composes it); `src/data/institutionalCatalog.js` (the front mark per J-7's table, read through `isFrontCapableInstitution`; the walker lists every unnamed family for the chair); `src/generators/steps/corruptionPass.js` (deleted, J-2) + `steps/index.js` + `steps/assembleSettlement.js` (deps); the 18 readers of §7.1 re-pointed through `allegianceOf`; `src/domain/settlementMigrations.js` + `src/domain/settlement.schema.js` (v2 → v3, §7.2, J-18) + `tests/domain/settlementMigrations.test.js`; `src/domain/edit/recordRegister.js`; `src/domain/factionRename.js` + `src/domain/institutionRename.js` (cascades); `src/domain/display/galleryVeil.js`; `src/lib/structuralFingerprint.js` (`corrupt_count` → `allegiance_count`, J-17, its pins re-keyed with the cause). REGISTERS, each through its own door only: the fork census (the new `people-allegiance::<card id>` forks), writer reach, the observed shape (a rung), the tuning register (+1 row: `ALLEGIANCE_TUNING`, born draft), the lighting census.

## 3. Generator moves on this branch: UNSIGNED cause commits, measured

Per the writing lanes' rule (the chair's ruling of 2026-11-07 18:22 UTC): you do NOT re-record the golden master, the fence, the herald or the prose manifest on this branch, and you never hand-edit a golden fixture or the freeze register. Each cause commit that moves generator output carries, in its message, the measured per-row deltas under the heading **"The generator moves, for the merge's record"** (gm N/525, fence N/360, herald N, prose N/1,050, with the moved rows named by town where the count is small). MERGE-TRAIN signs them at the car's merge point on the integration line, by the law of the chain. The refactor commit (the split) must move NOTHING: prove it with the golden suites green at that commit.

## 4. The order of the work

1. The base's reds recorded (§1.4).
2. The split (A1 / A3), byte-identical, its own commit, golden suites green.
3. The invariants as checks FIRST, red-first: I-2, I-3, I-4, I-13 in `allegiance.test.js`; I-14 in `settlementMigrations.test.js`; I-15 the walker; I-10 the veil scan (it must red on a planted allegiance before the drop is proved); I-12's added arm in `ties.test.js`.
4. `allegiance.js` (A2 `dealAllegiances` on per-card keyed forks under the coherence stream; the gate of §1.3 with J-3 and J-4; the chance with J-5's `organizedCrimeOf`; the vector unchanged; **the goal rewrite the corruption pass does today is KEPT, moved here verbatim** until car 4 replaces it; `via` per §1.4; the receipt) and A4 `assignHandlers` (draw-free, J-10).
5. The ties: the agent's one outgoing tie forced to its handler, the kind from the vector (fear → one of the four leverage sub-kind archetypes, drawn on the agent's tie fork), `covert: true, handler: true`; a DM-locked or DM-authored outgoing tie wins (the handler stays on `allegiance.handler`). The lines arrive from WRITE-PEOPLE: `origin/lane/write-people-2026-11-08:src/data/people/handlerTieLines.js` (its FIRST push). Merge that branch when you reach this step; if it is not pushed yet, do steps 6–8 first. Never write placeholder prose.
6. `corruptionPass` retired; the step graph's deps; regeneration deals allegiances too (§2's note).
7. The 18 readers re-pointed (§7.1); the dormant list written from the measured census (§7.3); J-19's row for `npcAgency.js` names the double-corruption risk.
8. The save migration v2 → v3 (§7.2), idempotent, reporting what it cannot map.
9. THE PROOF: the full vitest run through `sh scripts/gate-tail.sh` (the tip's reds = the base's reds, apart from the golden rows your cause moves, each counted); `npx eslint` on every file you touched; `npm run build` exit 0; the soak 1,000 (cert and coh at 0, plus the new `coh:allegiance-handler` at 0); §5's car-1 bands measured against §0's baselines (agents ÷ eligible by crime level; 0 agents in towns without a crim house; 0 crim-house faces with an allegiance; the `via` split; 100% one handler; agents per handler); the proof walk of §8 on the 525 and the 1,000 (every public count 0); J-20's measurement (does `criminalCaptureState` reach the public page? report the count; do not cure it — it joins the owner's queued server-side veil).
10. The record `docs/allegiance/ALLEGIANCE_CAR1_2026-11-08.md`: every step with its commit, the bands, the invariants, the golden moves by cause, the reds equal, every judgment call with your default; the dated roster +1 (the chair's commits show the form).

## 5. Hand-back

Report: the branch tip; the split's commit and its golden-identity proof; the golden moves (gm/fence/herald/prose counts); the bands against the baselines; the invariants' state; the soak's counts; the veil walk's counts; J-20's figure; the base's reds vs. the tip's; every STOP and judgment call. Commit trailers:
```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01FE9mEvGxnFx6WTBkEC6ie9
```
