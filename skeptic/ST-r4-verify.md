# ST-r4-verify — THE SITES, refuting verifier (P3 round 4b)

Seat V-ST-r4 (Opus 5.5), chair 0a2e8bd9 continuing a73343ed, 2026-10-19.

**What I read in full:**
- the README (RESUME BLOCK 2) and VERIFY;
- every rulings file: PL-MN, AFTER-RESEARCH, AFTER-COMPILE, CHAIR-NOTES 1–18, ROUND1 with its addendum, ROUND2, ROUND2b with its addendum, ROUND3 §A–§G, and ROUND4 §A–§E;
- SKEPTIC and RESEARCH-COMMON;
- `docs/DESIGN_FP_ARCH_ST.md` as it stands (812 lines, sha256 `da54b24a…`, mtime 21:57, identical to the lane's after-hash; copy in `ST-r4-verify-probe/ST.at-verify.md`);
- `skeptic/ST-r3-verify.md` and `skeptic/SEAMS-r3.md`;
- `cure/D-ST-r4.md`;
- the ROUTES sections of all ten `cure/D-*-r4.md` files (extract in the session scratchpad) and BD §19.0's ST row.

**Cross-volume reads, by the cited lines:**
- BD §2.2, §7.1, §8.2, §8.3, §9.4, §19, §22;
- MN l.112–144, 195, 284, 580;
- PL l.242–263, 400;
- PR l.411;
- PS l.117, 257.

**Code of record:** master `81f1cd963`, read-only, by grep only. No git, no tests.

**Probes,** all in `skeptic/ST-r4-verify-probe/`:
- `master-reads.out` re-reads every master receipt the lane cited (m1, m3–m6, `COURSE_TARGET_SEP`). All of them match.
- `census-r4v.out`: the round-4 tokens are 0 in src and 0 in tests.
- `ST.live.txt` and `residue.out`: the volume with its CURED/REFINED brackets stripped, grepped for residue.
- `noted-spot.out` spot-checks the rulings the lane marked NOTED.
- `receipts-new.out` holds every quote below.

## COUNTS
**holds 53 · fails 2 · stop 0 · new 2 (0 BLOCKING · 2 MAJOR) · routedUnapplied 1.**

The 55 judged rows are the lane's 49 inputs plus the six round-4 routes to ST (§E.4): BD (g), MN, PL, PR, PS and PT. CH, FOLD and RN route nothing to ST.

**Fails:**
- L-BD 30 fails in part: the seizure arm can never fire.
- RU-MN-r4 is ROUTED-UNAPPLIED: what promotion does to the site.

**The §E receipts:**
- §E.1: there are 0 live hits for `readiness01` or `full · … · empty` as site words. The only hits are the homonym and refusal rows.
- §E.2: holds.
- The map contract: there is no "road ladder ends in hidden" text.
- ROUND4 §E's three STOPs touch no ST passage.

## VERDICTS — fails first
| id | disposition | verdict | why / receipt |
|---|---|---|---|
| **L-BD 30** (the conclave's site rights, the sale, the SEIZURE) | CURED + REFINED R6 | **FAILS (in part)** | **The seizure half cannot fire.**<br>**Where the volume routes it:** ST §6.1 step 6 (l.336) says "so a conclave's site is cleared only by a court that holds its creed `outlawed`". S31 (l.594) pins it: "only once Ashford holds a creed `outlawed` does its clearing fork open `site_cleared` (the seizure)". BD §7.1 (l.473) agrees: "its fork turns `outlawed` … and ST's clearing follows (ST §6.1 step 6)".<br>**What blocks it:** step 6 opens only for "an attached tied court whose town the den presses (`denPressOf` on that town ≥ 0.40". `denPressOf` (l.188) is "ST's own feeder term for that site at that town, or, where the handoff above gives a body's presence to THE BODIES" that body's term. ST's feeder covers only "the MAX over the untied sites attached to T" (l.263). The handoff covers only the case "where a site's untied holder IS a body" (l.187). A conclave holds as `faith`, which is a tied class (§3.1). So `denPressOf` is 0 for every conclave-held site, step 6 never opens, and S31's last clause fails.<br>**Why it matters:** reclaim opens only for a site that is "unheld or untied" (step 5), and the sale excludes `outlawed` (6b). Outside the war presets (ST-2b), an outlawing court therefore has no road at all to its own keep once a flock holds it.<br>**Cure:** for a conclave holder, step 6's press test reads the court's own-use test of 6b (a fortification or watchtower at hand, or a site it last held). Alternatively, `denPressOf` reads BD's per-body term `bodyPresenceTermOf` for any body holder the court holds hostile; this cure pairs with ST-X2's. |
| **RU-MN-r4** (route `cure/D-MN-r4.md` §5 l.94) | — (lane closed 21:57; the route was written 22:46) | **FAILS — ROUTED-UNAPPLIED** | **The route:** "**ST:** a promotion re-points a body-held site's holder ref to `{ kind: 'menace', id }` through ST's one writer. Either the apply arm joins the closed caller list, or ST reacts to BD's `raised` end. ST's choice."<br>**The volume now** (§6.7, l.393): "the body's end `raised` empties its site through ST's writer (BD §15's death row: "its site falls EMPTY"), and the new menace holds it only where the DM's course or `SITE_HOLDER` puts it there". It does not re-point, and the caller list (ST2, §6.3) has no MN apply arm.<br>**A live contradiction:** MN M59 (MN l.580) pins "the ruin's holder ref reads `{ kind: 'menace', id }` (ST's writer)". BD l.429 says "its site falls EMPTY (ST's `abandoned` …)". Emptying also fires step 5's reclaim offer and step 1's unmaking telling, so the DM's new menace loses its lair in the very tick it was raised.<br>**Cure:** add a `raised` arm in which the one writer re-points the ref to the new menace in the raise's tick. Say whether that is a holder change; it should keep `seenBy` so MN's l.195 source survives. BD l.429 then excepts `raised`. The alternative is that the chair strikes M59's clause. |
| SEAMS-r3-1 (B) · ST-W1 · A.3 | CURED | holds (ST's side) | The live text has 0 holder `kind: 'band'`/`'cult'` and 0 "heres". Every live `cult` hit is the standing (l.62, 71, 185, 217, 348, 442), and `standingFor` is quoted from master. The residual harm through BD's presence row is ST-X2. |
| ST-r2-16 (a)(b) · A.20 | CURED | holds | The tuple is `{ class, ref.kind, ref.bodyKind, ref.id, role, creed }` (§2.1, ST6, step 3, §11). Both paths are pinned in S3b. Minor note 1 applies. |
| PS-r2-15 · A.2 · A.11 (+ PS's r4 route) | CURED | holds | OD-ST-14 carries PS's route line verbatim, and §7.4 PS agrees. |
| RU-PS-1 · SEAMS-r3-8 · A.5 · §E.3 | CURED | holds | §7.1 lists `passageFieldForceOf`, `reliefSent`, PL's border share and ST's own sortie. `coalitionJoinFeasibility` is present at master. |
| ST-W2 · A.17 (+ BD (g)) | CURED + R1 | holds | MN l.195 and BD l.229 now register `seenBy` as a source. The stage order (2097 < 2527) re-read at master. |
| ST-W3 · A.16 | CURED | holds | Every telling path is guarded. BD l.785 defers to ST's veil. S28 is coherent. Minor note 6 applies. |
| ST-W4 · A.18 | CURED | holds (for courts) | The A.18 join is applied in step 4, step 6, §8 and S27. The widening to bodies is ST-X1. |
| SEAMS-r3-5 · A.6 (+ PL's r4 route) | CURED | holds | There are two closings under one episode, with no patch. PL l.400 lists them in the REQUESTED family. |
| BD (1)–(5), L-BD 31, notes 1–8, D-PL/PR/PS-r3→ST, the 9 CURED rulings, 11 NOTED, B | as filed | holds | BD §8.2, §8.3, §9.4 and §19 agree with ST. The notes were spot-checked (1, 4, 5, 7, 8). For the NOTED rulings ST has 0 live `liegeAnswer`, `menace_met`, `paragonLean`, `BAN_PARTY` and `relationFactor`. |
| routes PR · PT (r4) | — | holds | PR's look is a sighting producer (§2.4, ST2). The routes' optional "may" halves are unneeded. |

## NEW FINDINGS
| id | sev | site | claim | receipt | cure |
|---|---|---|---|---|---|
| ST-X1 | MAJOR (r4's A.18 cure over-widened) | §8 docket line (l.476) · §8 `site_cleared` (l.471) | "whatever courts, patrols or bodies move on one site in one week meet it in ONE hearing with one draw — the anchor court leading, the rest joining" | **The volume against itself:** step 4 (l.334) says "A court sorties only against an arriver it holds HOSTILE". `site_cleared`'s producers include "a BODY on another body's site … a menace whose DM-set course takes it to a site a body holds" (l.471).<br>**The result:** when a rival gang or a menace moves on a den the same week a court sorties, the hunted gang or the menace is summed into the court's force. Nothing then says who holds a site cleared by a mixed force. With no court involved, a body and a menace on one den have no leader rule ("the sortieing court nearest by band leads" names courts only). A.18 rules only for two at-hand courts. | Only COURTS and their patrols join. A body's or a menace's move on a den that a court also sorties on that week is a separate draw only if the court's draw leaves the den held. Or one rule orders them, the court first. Say who holds after `cleared`. |
| ST-X2 | MAJOR (a seam; the owner's "not all cults are evil" class re-entering through THE BODIES' row; the cure is in BD) | ST8 (l.93) · §3.1 conclave row (l.230) · S7 vs BD §8.2 (l.516) · BD §22 A2 (l.1060) | ST says "A CONCLAVE is never an untied holder and never a hazard" and "whatever harm a HOSTILE flock does is its own acts through THE BODIES' rows … BD §8.2" | **BD's row:** BD §8.2 takes "the MAX over the bodies whose `where` touches T … a body at a site attached `at_hand` to T touches T", with "`ACT_FACTOR` … based in the country 0.8". BD §22 A2 covers "any body PRESENT in a country (based · passing · raiding …)". A conclave body carries `might` and `baseSiteId` (BD l.196–197).<br>**The result:** once `bodyEffectsEnabled` lights, a `permitted` flock at its shrine feeds the danger gauge of the very town that welcomes it. ST's handoff zeroes ST's feeder for UNTIED bodies only, so nothing excludes the flock. ST's citation of BD §8.2 for "a HOSTILE flock" misreads BD's quantifier. | BD: the presence row counts a conclave at T only where T's court holds its creed `outlawed`, and its ACT_FACTOR for a peaceable flock is 0. ST cites that exclusion at §3.1. This pairs with the L-BD 30 cure (`denPressOf` reads `bodyPresenceTermOf` for a hostile body holder). |

## NOTES (minor; not counted)
1. The adoption carve-out lives in §11 and S34 only. §2.1's bracket, ST6 and step 3 say the writer "drops both whenever any part differs" over a tuple that includes `ref.id`. Put the carve-out in step 3.
2. Event-word drift is BD's to align, since ST owns the words:
   - BD §9.4 says "the flock leaves the site (ST's `conveyed`)"; ST §8 says `sold`.
   - BD l.429 says an ended body's site falls empty as "ST's `abandoned`"; ST §6.1 step 1 says `cleared`.
3. `site_sale` `sold` hands every demanded site "to the court's garrison". A shrine the court last held should pass to its clergy (`faith`), or else the shrine row reads no creed.
4. Step 2's "a conclave's at most `sparse`" omits the patron's lift. A lavish patron gives 1.0 × ½ = 0.5, which is `manned`.
5. `denPressOf` still reads "ROUTE BD: expose the per-body part by name". BD now names it `bodyPresenceTermOf` (BD §8.2), so cite it at consolidation.
6. The veil says "in the omniscient arm a kept-secret site is known to no court", while a patrol's look informs "THAT court alone". Say which wins in the omniscient arm.

## CONFIRMED vs PLAUSIBLE
CONFIRMED:
- both fails and both new findings, by quoting the volume against itself and against its siblings (BD l.196–197, 429, 473, 516, 1060; MN l.195, 580; the D-MN-r4 route); the quotes are in `receipts-new.out`;
- the lane's master receipts, by re-reading them at `81f1cd963` (`master-reads.out`);
- the token census (`census-r4v.out`).

PLAUSIBLE:
- how often ST-X1's same-week collision bites;
- whether BD gives a peaceable flock a non-zero ACT_FACTOR in practice (its text sets no exclusion, which is the finding);
- every DRAFT constant (UNMEASURED, unchanged).
