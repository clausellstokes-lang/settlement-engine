# CH-r2-verify — the refuting verifier for THE CHAMPIONS, P3 rounds 2 and 2b (V-CH-r2, Opus 5.5, chair a73343ed, 2026-10-18 12:53 EDT by `date`)

**COUNTS: 24 holds · 1 fail · 0 stop · 2 new (0 BLOCKING · 2 MAJOR).**

I judged 25 rows: every BLOCKING or MAJOR id and the one REFUTED in `cure/D-CH-r2.md` (round 2a; never verified before), and every BLOCKING or MAJOR id in `cure/D-CH-r2b.md`, both seats, CURED or NOTED. The volume was read whole (1,053 lines). The code of record is master `81f1cd963`, read-only. Two probes, under `CH-r2-verify-probe/`: `effLines.mjs` → `effLines.out` (all eleven host counts the volume cites reproduce: envoyPulse 332, heraldWanderers 166, npcLedgerProjection 113, npcCirculation 388, npcReplacement 161, reputationRaceConsumer 183, npcCirculationTransit 75, …) and `findingsRelay.mjs` → `findingsRelay.out` (the landed relay over CH's declared findings content, and the leak re-seed merge). Nothing else edited; no git; no suite.

**Holds.**
- From D-CH-r2: CH-r1-4, -12, -20, -24, HOST-r1-5, CH-V1, CH-V2, and the REFUTED `transportedDecision` carry. `applyWorldPulse.js` runs `readWarPeaceDecision` live and dispatches only that decision.
- From D-CH-r2b: SEAMS-r2-6, HOST-r2-5, HOST-r2-1, ST-r2-1, SEAMS-r2-8, PR-r2-12, SEAMS-r2-1, -5, -2, HOST-r2-3, PS-r2-1, SEAMS-r2-10, ST-r2-14, SEAMS-r2-7, D-RN-r2b §5, and HOST-r2-11.
- Every cited symbol exists. The sibling volumes carry the rows that CH cites: RN `u:`, the `corps` doer and the refused-pair exemption; PT `met_in_person`; PR's stretch key, `believedWatch`, `fameIn` and §10.5; PS2 and the free-corps arm; ST `settlementFundingBand`; PL `requestFealtyRow` and `seatEpisodeKeyOf`; MN `exertion.outcome`.

## FAILS
| id | disposition | verdict | why / receipt |
|---|---|---|---|
| SEAMS-r2-11 (M) | NOTED: "CH reads RN's court regard only of persons and corps (`p:`, `u:`), never of a town" (l.1021) | **FAILS**: the receipt is false at two sites | **§11 step 3 (l.518).** `enemy_in_service` means "a court this court regards at `enmity` or worse": a court's RN regard of a court. **§9 (l.489).** A court that has heard a leak finds that "its regard of the accused employer moves (RN)". **RN refuses both.** RN l.171: "A holder `s:`/`c:` never holds an entry about a subject `s:`/`c:` … that feeling is the landed pair state", and `regardOf`/`courtRegardOf` "asked for a refused pair return `null` with the reason `pair_state`". RN l.126: a settlement doer's deed "moves no regard of that settlement held by a TOWN or a COURT". **Effect.** `enemy_in_service` never fires in the lit arm, for persons or for the party (PT reuses the one meaning). The accusation moves a quantity that does not exist. This is SEAMS-r2-11's class, in CH. **Cure.** Read the landed pair state (label, trust, resentment), as SEAMS-r2-11 prescribes. |

## NEW FINDINGS
| id | sev | site | claim / receipt | cure |
|---|---|---|---|---|
| CH-V3 | MAJOR | CH8, CH9, §4.2, §8, OD-CH-32, S6, S27 (the r2 posted operative) | **The DM's post does not hold the paragon.** **(1) Two movers on one record.** `npcDmVerbs.js :: assignRoamer` refuses to open beside another mover because "two lifecycle owners … whichever pulse ran last would appear to teleport the person". Where `routeLifecycleActive`, assign writes `transit` + `dmAssignment`. `advanceAssignedNpcTransits` runs after the person stage (pulseKernel l.2222 vs l.2194). CH's pass never yields to a live `dmAssignment`: the word appears only at §0, CH8 and CH9. **(2) Nothing keeps it at the post.** Under §4.2, a bound paragon's destinations are its lands. The post counts "for this aim only" (`keep_rendezvous`). `work_here` needs a call or "retained here", and `take_rest` needs a condition. So, between rendezvous, `return_home` walks it home, which S6 contradicts. CONFIRMED (code and text). (1) is latent while `routeLifecycleEnabled` stays false (simulationRules l.1119). | A paragon with a live `dmAssignment` takes no aim and exerts nothing until placed. `work_here` admits "posted here" (`postId`). Pins for both. |
| CH-V4 | MAJOR | §8 findings row; OD-CH-40; L9; S6 (r2b) | **The operative's secret report is broadcast.** The declared `whereId`/`partyIds` = the post. EXECUTED (`findingsRelay.out`): a hop-0 findings record reaches a THIRD neighbour court at hop 1, with `partyIds: ['post']`. `maxHopsFor` is 2 whatever `scope: 'settlement'` says. `reportsBySubject` keys it to the post for ANY observer, with no `visibility` check. `reconcileBelief` "re-anchor[s] toward truth" and materializes a belief inside `MATERIALIZE_WINDOW: 8`. So every court within two hops of the meeting town refreshes its belief of the post from another court's operative. That contradicts §8's "the home court's picture" and Law One. | Route the seed to the home court only: origin the employer's seat, with the continuation guard pre-stamped. Or declare the broadcast and pin it (vetoable). Declare the significance and score. |

## Minor notes (not counted)
- **Pre-existing, CONFIRMED by execution.** One leak `eventRef` per hire means `mergeArrival` folds re-seeds (arrivalTick stays 10). So "repeated arrivals raise the band" happens at most once per TTL (13/26 weeks) per court. The leak's significance and score are undeclared.
- `seasonsEnabled` is stale at CH-1 TIER and §15 #12; `roadSeason` is always computed (pulseKernel l.575).
- **Gate and lens residue.** "a member's gate" (l.517), "the court's own gate" (l.536), "CH's gate" (S40) and "the lens window" (l.395).
- §5 (d) says "bandits, dens and roosts", but PR5 (a) says "raiding menaces and untied dens".
- PL's closed grammar names only `polity_ban:<wnpcId>:<banTick>`, not the corps episode.
- PT's corps edge arm has now landed, so CH §11's "until it lands" is stale.
- The same-pass waypoint leg departs on the arrival tick, against the landed movers' "taking no further hop this tick". That is the chair's.
- The ST-r2-14 ADDENDUM's actor-kind list omits `corps`, while SEAMS-r2-6 adds it. That is the chair's, at P4.

**CONFIRMED vs PLAUSIBLE.**
- **CONFIRMED:** the fail, CH-V3 and CH-V4, all by code or by both volumes' text; CH-V4's relay and the leak merge by execution.
- **PLAUSIBLE, not upgraded:** RN's seed builder leaves `relayedTick` null, as RN §3.4 says; and the waypoint same-pass leg.
