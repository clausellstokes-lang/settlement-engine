# T5 HAND-BACK (VEIL-40's builder, R3-TELL-5 units (iv), (v), (vi); worktree /home/user/wt/t5, branch lane/veil-40-2026-11-23-t5-wip, cut at 9a2f8ef9a)

Written 13:23 UTC (`date -u`). Handed back on the harness's order. The mutex never named T5 between 11:13 and 13:23 ("T5: WAIT"), so NOTHING HAS BEEN RUN: no measure, no arm, no tooth.

## 1. STOPS
1. NO RUN WAS ALLOWED. Every unit is MEASURE FIRST, RED FIRST, so no RED or CURE commit exists. 212 is unchanged:
   a4df6dac...a1b4. The rollback is unchanged: 8cbd7d1c...ded5b0.
2. (v)(3) WILL STOP UNDER N88 unless the measure finds a member. r3m-town-insurgency-0-14 stores "Smuggled jade and gems" and
   "Opium and exotic narcotics". These are demandProfile.js :: computeDemandImports' 'criminal' row, one good each for the two
   criminal powers: Thieves' Guild (27, withheld by power.entry) and Corrupt Council (22, the VR42 governing row). The seat
   (LOWER-7) says the house-free twin serves both. So ruling 72 (a) (3)'s fallback ("the second withheld") would withhold
   what the twin serves, and that is a STOP to the seat. The 300-insurgency-birth measure (q-chain.sh insurg) decides whether
   the page is a member, in which case nothing is withheld.
3. (v)(2) IS LIKELY A STOP (paper only, PLAUSIBLE). r3m-town-none-0-23's only tension is a crime_wave with
   ["Those who would take the law into their own hands", "Thieves' Guild"]. Every criminal house it holds is hideable, and
   its one criminal power is withheld, so the served crime signal is false. 212's history.tension.crimeWave rule would then
   take away any crime_wave form I sent. A sent crime_wave survives only if the rule is placed AFTER that one, which
   contradicts its premise unless nothing-hidden no-signal town pages show crime_waves (q-an.mjs section (v)(2) measures
   this). THE FUNCTIONS A (v)(2) CURE WOULD TOUCH, named for the seat and the chair before any cure (the brief, N86 (d)):
   212 `_gallery_veil_roster_choices`, a new block right after its `registry: history.tension.crimeWave` block; the twin
   `galleryRosterChoices.js :: applyRosterChoices`, right after its `history.tension.crimeWave` line. R5-TENSION (TEN-BRIEF)
   touches `_gallery_veil_withhold_always`'s maskedParty statement / `withholdAlways`, or the copy-pass tension filter in
   `_gallery_veil_roster_choices` / `withholdPowerCopies`. NO SHARED HUNK. But there is an ORDER INTERACTION: a list that
   R5-TENSION empties in withhold_always, which runs after roster_choices, would not get my sent form.
   hxd-city-138 (tensionCause.test.js CAUSES-PARITY-2 F, read at 9b0ffaa97): its red is the crimeWave rule taking the
   tension, so no cause prints. My form, placed after that rule and firing only on an emptied list, could make the town
   print a cause. Whether its list empties is unmeasured: PLAUSIBLE.
4. (iv) LIKELY HAS NOTHING TO CURE (paper, from the stored births in /var/tmp/v18/t2/stored-v40/today at 9b1fe3c34: the same
   generators). On 117 and 136, every stored relation row other than N88's four controls names the withheld Thieves' Guild,
   and power.relation.entry already takes those. N88's four subordinate rows name the VR42 governing power and served powers:
   verdict (b), LOWER BY RULE. PLAUSIBLE until the towns measure reads the served rows and B's.

## 2. PROGRESS
- (vi) the tooth: written (V33-Q's hunk applied cleanly, plus Tell4 keptServed > 0). NOT RUN. WIP 58cf00f6c.
- (v)(1) safetyDesc: the arm is written (Tell6: a plant plus 113 and 62, both engines, every setting, and the tooth on a
  "shown" setting). NOT RUN; no red. The cure is drafted but NOT APPLIED. It serves the clause as " Everyone comes in by the
  gates, where the guard sees them." (a replace in 212 and a split/join in the twin, with criminal-governance deletion first)
  and re-states the registry safety.safetyDesc scope. The clause count in nothing-hidden city and metropolis births (the
  72 (a) (1) precondition) is NOT MEASURED.
- (v)(3) imports: see STOP 2. (v)(2) currentTensions: see STOP 3. (iv) relations: see STOP 4.
- Families left as GATE-MAP reads them (unchanged: no code moved).

## 3. FOUND ON PAPER (PLAUSIBLE)
On 113 and 62 the beneath clause is ALSO stored in publicProse.blocks.defense:state.publicOrder.field and firstSurvey.field.
Whether those copies are served on this tree is unmeasured; the probe now records `bnAt`. If they are served, the page
contradicts itself after (v)(1). This is not built here.

## 4. THE INSTRUMENTS (ready, never run)
`out/v33/q/measure/{q.probe.jsx,q-an.mjs,q.sh,q-chain.sh}` come from 96a4c4994 and are re-pointed to this tree: template
v40t5q, databases v40t5m_<n>, the pool-v40 seeds, outputs under out/v40/t5/. They contain no gate or pool step. Run them
step by step with `sh q-chain.sh tpl|smoke|towns|pool|insurg|an`, each heavy step inside gate-mutex. `towns` covers the
seven GATE-MAP towns; `pool` covers town, city and metropolis.

## 5. FOR THE OWNER
No change to what any shared page sends has been made yet. The work waited two hours for the shared machine and never got
a turn. The checks and the first fix are written down and ready. Two of the remaining fixes will probably need your chair's
ruling, because the only fix allowed on paper would either hide something the clean version of the town shows, or would be
undone by an existing rule.

COMMITS: 58cf00f6c (WIP; out/v33/q/measure/{q.probe.jsx,q-an.mjs,q.sh,q-chain.sh}, tests/security/galleryVeilTell6.pglite.test.js,
scripts/mutation-coverage-manifest.json, tests/security/galleryRosterChoices.pglite.test.js,
tests/security/galleryVeilTell4.pglite.test.js); the closing WIP commit (this file and the probe's bnAt). 212 sha256
a4df6dac94980172a30b161034563b490fae126da2a3aae13f0cc574a4c1a4b4 (unchanged).
