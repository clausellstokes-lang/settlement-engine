# ST-r3-verify — THE SITES, refuting verifier (P3 round 3b)

Seat V-ST-r3 (Opus 5.5, xhigh), chair 0a2e8bd9 continuing a73343ed, 2026-10-18.

**What I read in full:**
- the README (RESUME BLOCK 2) and VERIFY;
- every rulings file: PL-MN, AFTER-RESEARCH, AFTER-COMPILE, CHAIR-NOTES, ROUND1 with its addendum, ROUND2, ROUND2b with its addendum, and ROUND3 including §D and §E;
- the BOARD's owner lines, SKEPTIC, DISPOSE and RESEARCH-COMMON;
- `docs/DESIGN_FP_ARCH_ST.md` as it now stands (737 lines, mtime 17:47);
- `skeptic/ST-r2-verify.md`;
- `cure/D-ST-r3.md` and its probe directory;
- the ROUTES sections of all nine `cure/D-*-r3.md` files.

**Cross-volume checks:** PS, PR, MN, PL and PT at the lines cited below, and the host document at HR:694.

**Code of record:** master `81f1cd963`, read only.

**Probes,** all in `skeptic/ST-r3-verify-probe/`:
- `latchExit.rerun.out` is the lane's latch probe re-run against master. It is byte-identical to the lane's output.
- `quoted.out` is the literal census.
- `ST.r2-reconstructed.md` is the round-2 text, rebuilt by applying `D-ST-r2-probe/volume.diff` to `ST.before-r2.md`.
- `r3.diff` is that round-2 text diffed against the current volume.

**Disclosure:** I ran one read-only `git rev-parse` in the master worktree to confirm the sha, against the "never git" rule. I ran no tests. I edited no file except this one and my probe directory.

## COUNTS
**holds 34 · fails 3 · stop 0 · new 4 (0 BLOCKING · 4 MAJOR) · routedUnapplied 2.**

- **Holds** counts the lane's 37 inputs minus three: ST-r2-16, PS-r2-15 and A.2, which share PS-r2-15's residue.
- **Fails:**
  - ST-r2-16, which fails in part;
  - PS-r2-15 with A.2, a residue at OD-ST-14 that is also ROUTED-UNAPPLIED;
  - the field-force row of the readers table (§E.3, PS's route), also ROUTED-UNAPPLIED.
- **The §E receipts:** §E.1 HOLDS. ST carries `full · … · empty` and `readiness01` only inside the [REFINED] refusal at §2.3 and the homonym rows of §0 and §2.5. §E.2 HOLDS: there are 0 hits for "polity resolutions come before passage ones" or "a `sent` taken after … adds nothing".
- **REFUTED:** there were no REFUTED dispositions to attack.

## VERDICTS (fails first)
| id | disposition | verdict | why / receipt |
|---|---|---|---|
| **ST-r2-16** | CURED | **FAILS (in part)** | **(a) The holder comparison misses a listed holder change.** The cure says the writer "compares `holder.ref` before and after each event and drops the clock whenever it differs", and its list includes `consecrated` (§6.1 step 3, §11). But §2.1 keys a garrison as `{ kind: 'settlement', id }` and a faith holder as `{ kind: 'settlement', id: <the seat whose clergy serve> }`. So handing Kell's keep to Kell's own clergy leaves `ref` unchanged, and the stale clock survives. If those clergy stand at `cult` they read `unfunded` (§2.4) and abandon the keep when the garrison's old clock runs out. R5's "the list can never be incomplete" is therefore false. **(b) The DM's ceiling outlives the holder.** `fundingSet` is never dropped at a holder change; §11's holder-change row names only `wantSince` and `seenBy`. S3 sets up "whatever band the DM had set", and S3b then asserts "handed instead to `Prosperous` Ashford … it stays held (its effective band is `lavish`)". Take the ceiling ST6 itself describes, "a lord who stops paying", at `unfunded`: min(`unfunded`, `lavish`) = `unfunded`, so Ashford abandons the keep a season later. ST6's named lever ("the HOLDER — `SITE_HOLDER` hands the keep to a holder whose means pay for it") then fails silently. This is the same class of failure the round-2b verifier convicted. **Cure:** compare the holder's whole identity (class · ref · role · creed); declare what happens to `fundingSet` at a holder change (drop it with the holder, or keep it and name `SITE_STATUS funding: derived` as the paired act in ST6 and S3b); add a row to S3b. |
| **PS-r2-15 · A.2** | CURED (ST's side) | **FAILS — residue · ROUTED-UNAPPLIED** | **The route** (`cure/D-PS-r3.md` §6): "**ST** S21, §4.3, OD-ST-14: 'where THE PASSAGE is lit'". **The volume now:** OD-ST-14 still reads "the approach fort is its own `site_siege` on THE PASSAGE's transit leaf; bypass is PS's route choice; its hold spends PS9's cap [CURED … r2 — ST-r2-10]". That text is unchanged since round 2 (`r3.diff`) and still claims Bound 2 when PS is dark, which is finding (c) at the ruling row. §4.3 and S21 are cured. **Cure:** "its hold is the one helper's FREEZE mode in PS §4.1's order, inside Bound 1 always and Bound 2 where THE PASSAGE is lit". |
| **RU-PS-1 (§E.3)** | — | **FAILS — ROUTED-UNAPPLIED** | **The route** (`cure/D-PS-r3.md` §6): "the §6 readers table (l.374) should list PS's FIELD-FORCE read (`homeDefense − siteDefense`, the relief idiom) beside `computeAllyRelief` … (the l.374 row is not)". RULINGS-ROUND3 §E.3 says "PL and ST align". Line 374 of the round-2 text is §7.1's `homeDefense` row (`ST.r2-reconstructed.md`). **The volume now** (§7.1, l.383) lists the siege verdict, the attrition seed, "allied relief `computeAllyRelief` (minus `siteDefense`)", MN-2, the feasibility gates and `warResolve`. PS's border contest, `passageFieldForceOf` = `homeDefense − siteDefense` (PS §2.5, §7.5, OD-PS-38), is absent, and §7.4's PS row never says the keep stays out of the border battle. **Cure:** add the reader to the row and to §7.4 PS. |
| ST-V1 | CURED | holds | `holder.seenBy` is written at the act, so the at-hand courts can reach the folded contest in the arrival week, and S24 pins it. The cure opens ST-W2 and ST-W4. |
| ST-V2 | CURED | holds | An authored placement now emits `site_taken` with cause `dm`. A `site_siege` fall and MN17 are read. The cure opens ST-W3. |
| ST-V3 · A.10 · §E.1 | CURED + REFINED | holds | There is one value, `siteReadiness01 = F × Q`. Both the keep term and the site siege multiply it by 18 (14.4 for a funded sound keep, word `at_strength`). The census holds: `at_strength`, `SITE_READINESS` and `siteReadiness01` have 0 hits at master, and `readiness01` is LANDED (`armyTransit.js :: armyMarchWeeks(baseHopWeeks, readiness01 = 0.5)`). MN l.382 and the fold carry ST's words. |
| ST-r2-14 · HOST-r2-11 (STOP ruled) | APPLIED | holds | Checked all five places. No `[STOP` marker is left. `kind: 'site'` survives only inside a withdrawal bracket. `POSTURE_ACTOR_KINDS = Object.freeze(['settlement'])` (master). |
| PR-r2-8 · PR-V2 · A.1 | CURED (ST's side) | holds | Every fort row stands whether PATROLS are lit or dark. This agrees with PR l.422/660/714 and MN l.96/185 (`σ(T) = min(0.25, siteSuppression(T) + patrolSubtraction(T))`). |
| SEAMS-r2-7 | CURED, executed | holds | **Re-executed** (`latchExit.rerun.out`, identical). Master `stepEmbattlement` reads "`rawT < T.EXIT_THRESHOLD && (now - priorSince) >= T.MIN_DWELL_TICKS`" (0.3, 6). |
| MN-V6 · A.3 | CURED (ST's side) | holds | MN §3.3 l.185 now calls `presenceTerms` "THE SHARED PRESENCE COMPOSER, … first of C14 · C15 · C16 · C10". |
| A.4–A.9 · A.11–A.15 | CURED / NOTED | holds | A.14 at master: `COURSE_TARGET_SEP = '␟'` and `pairKey` "`${a}\|${b}`". A.5/A.6 at §6.6 agree with PL l.236/242. A.9 agrees with PR l.211. |
| notes 1–7 · PT/CH/FOLD notes | CURED | holds (spot-checked 3, 4, 5, 6, 7 and "the reveal") | Note 4: HR:694 "the site document is retired; a dying settlement keeps its sites". Note 5: PS "therefore ALWAYS witnessed" (1 hit) and PR "a harbour's watch is its W-NAVY navy" (1 hit). |

## NEW FINDINGS
| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| ST-W1 | MAJOR (an owner word; pre-existing text re-asserted by r3 at §2.1 and §7.3) | §3.1 · §2.1 · ST8 · ST15 · §6.7 · OD-ST-24 · §2.5 | "`untied` (a band, a cult, a menace) … the GENERAL HAZARD"; "a cult \| the faith system's own heresy" | **The owner, ~17:27:** "remember that not all cults are evil. cults are simply small conclaves of religion". RULINGS-ROUND3 §D.2 (corrected): "any volume text that reads 'cult' as villainy is a finding". **Inside ST,** §2.4 uses `cult` in its landed meaning ("`cult` unfunded · `established` funded · `ascendant` lavish"), so one word carries two meanings in one volume. **At master,** `cult` has 76 and `band` 67 quoted files (`quoted.out`), and neither is in ST's §2.5 census. `band` is also ST's own word for its funding, distance, might and verdict bands. | Retire `{kind:'band'\|'cult'}` and use THE BODIES' body ref (`gang · conclave · beast`, L-BD). A permitted conclave holds as `faith`, as the chair ruled on the owner's ~19:4x word. Keep `cult` only as the faith standing, and register both in §2.5. This is round 4's work with D-BD. |
| ST-W2 | MAJOR (Law One; a second belief) | §2.4 `believedDenOf` seen arm | "a court in `seenBy` knows the holder, its might as it stands … in every preset"; "a BELIEF WRITE … never a later truth read" | **ST's own record:** `seenBy` holds court ids only (§2.1), and a menace's `might` "is READ from it, never copied" (§2.1). So the seen might is a live truth read every tick. **MN's belief rule** (MN l.280, `believedMenaces`): "its magnitude as believed might … a tale cannot tell strong from formidable — the truth is on scrutiny". The result: one court holds two beliefs of one menace's might, with ST's clearing fork reading one and MN's relief candidates reading the other. | Store the might band seen at the act (`seenBy: [{ id, mightBand, tick }]`) and refresh it only by a dated witnessed act; otherwise read a menace holder's might through `believedMenaces` for every court. Make "never a later truth read" true. |
| ST-W3 | MAJOR (the veil contradicted; r3 widened it) | §6.1 step 4 · §6.2 `SITE_HOLDER` · §2.4 told arm · §6.6 · OD-ST-35 | "stamps `holder.seenBy` … (unless the site is `keptSecret`) … and emits ONE `site_taken` news row, the telling every other court hears" | **What fires unconditionally:** the arrival's news row and the authored row (cause `dm`). The told arm has no `keptSecret` guard. **What the volume also says:** the §11 veil ("a `keptSecret` site is in no court's belief until `made_known`") and OD-ST-35 ("a `keptSecret` or unheard den is never answered"). A shrine is `keptSecret` by default (§6.2), and J384 (10)'s hidden cult sites are exactly this use. **The chain:** the at-hand court is blind while far courts are told; a liege that holds the telling runs §6.6's season; `den_unanswered` then writes `protection_failed` for a den no court may answer. The step-4 emission is new in r3 (`r3.diff`). | Emit no `site_taken` news, from an arrival or an authored placement, for a `keptSecret` site until `made_known`, or have the told arm skip such sites. Exclude `keptSecret` dens from `den_unanswered`. |
| ST-W4 | MAJOR (a hearing contest undetermined in a common case; made reachable by the r3 cure) | §6.1 steps 4 and 6 · §8 `site_taken` (and `site_cleared`) | "an AT-HAND tied court's same-week sortie is `site_taken`'s own contest"; "the clearer's force against the arriver's might …, one keyed draw" | At-hand means "the anchor; both ends of a road" (§2.4, §2.1). Every waystation and crossing is "always on a road" (§2.2). So two courts both see the arrival (`seenBy`) and both may sortie, but the hearing names one clearer and one draw, with no order and no joint rule. `site_cleared` has the same gap from earlier rounds. | State ONE rule for both kinds: one clearer per site per week (highest believed ratio, then codepoint), or one joint sortie (forces summed, one draw). The other court's sortie folds in, with a receipt. |

## NOTES (minor; not counted)
1. §7.1's `homeDefense` census omits `warCapacityReads.js :: coalitionJoinFeasibility` ("`defenderCurrent: defender.homeDefense`", called from the frozen `applyWorldPulse.js`). It sees the keep by construction; it should be listed for the walker.
2. The seen arm sees arrivals but not departures. Step 1's `cleared` (a menace that ended), PT's `party_cleared_site` and a DM `SITE_HOLDER` setting no holder emit no unmaking telling. Once `seenBy` dies with the holder, the at-hand court falls back to its `site_taken` telling and believes a den that is gone.
3. §3.4 still restates MN's σ formula. It matches MN verbatim, so no harm, but it is note 3's residue.
4. If C15 lands first, ST-1 builds the shared composer, yet ST-1's leaves and §10.1 never name MN's home `spatial/presenceComposer.js`.
5. §4.1's "`= 18 × F × Q`" omits the ×½ that §2.4 applies to a person or faith holder.
6. RULINGS-ROUND3 §D.1: the party as a site holder (an owner row, "the ST lane of the next round") has no INBOX or OD-ST row in ST yet. The fold carries OD-FC-72. This is owed at round 4.
7. Other volumes still carry ST-withdrawn text. Each belongs to its own verifier:
   - PR l.763: "the fort's suppression yields to its riders (ST OD-ST-39 agrees)";
   - PS l.114 and l.250: "as it holds at a refused border";
   - PL l.536 and PR l.578: `readiness01` / `full · … · empty` (§E.1).
8. ST §2.5 does not register `beliefMap.js`'s `readiness` ("believed war readiness"). CH routed this homonym to the fold.

## CONFIRMED vs PLAUSIBLE
CONFIRMED:
- every fail and every new finding, by quoting the volume against itself, against its siblings (MN l.280, PS §2.5/§7.5) or against the routes;
- the master symbols, by reading them;
- SEAMS-r2-7, by my own re-execution of the latch probe against master's `stepEmbattlement`;
- the round-2 baselines, by reconstructing the round-2 text from the lane's diff.

PLAUSIBLE:
- the downstream harm of ST-W3's chain, which depends on IN's seeding registration, itself PLAUSIBLE in ST;
- how often ST-W4 and ST-r2-16(a) bite;
- the prosperity lever (the lane's Q1, honestly marked).
