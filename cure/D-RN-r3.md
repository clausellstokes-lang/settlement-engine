# D-RN-r3 — THE RENOWN, P3 round 3a disposition (lane D-RN-r3, Opus 5.5, 2026-10-18 17:44–18:1x EDT by `date`)

**Outcome.** 33 inputs disposed of 33: CURED 17 · REFUTED 0 · STOP 0 · NOTED 16. No STOP for the chair. The FAIL (RN-V2) and both new MAJORs (RN-V6, RN-V7) are closed. RN-V2 and RN-V7 were re-checked against the receipts that convicted them, by execution against master `81f1cd963`. RN-V6 needed no RN change: the chair ruled it PS's side, and PS has struck the clause (verified by grep). Five refinements are marked `[REFINED 2026-10-18 (fp-final r3) — …]`. Three other-volume halves are routed (§5).

Files written: `docs/DESIGN_FP_ARCH_RN.md` (rewritten in place: +90 / −44 diff lines, 41 `[CURED … r3]` and 8 `[REFINED … r3]` brackets, a §19 round-r3 block) and this log. The probe dir `cure/D-RN-r3-probe/` holds: `RN-before-r3.md` (the pre-round volume, unchanged since 08:40 when this lane began), `r3Probe.mjs` → `r3Probe.out.json` (EXECUTED; read-only imports of master), `apply_r3.py` (every edit, each asserted to match once), `census.out` (tokens + code receipts), `volume.diff`. No git; no test suite; the code of record was read only.

## 1. What was measured first (the measurement that could refute the brief)
- **RN-V2.** I re-ran the verifier's merge on the REAL record shape (`content.magnitude`, PT-4's `content.doerRef`) through master's `rumorNetwork.js :: mergeArrival`. The stored telling was at completeness 0.765 and band 2; the better one at 0.82 and band 3. Both stay inside one parts mask (35 = 35 under PT's thresholds), and the merge takes band 3. The round-2 `ver`-only key re-reads nothing, and the triple key re-reads it (A1). A doer swap inside one mask is missed by `ver`; the triple moves the one term, and the next tick re-reads nothing (A2). Below VAGUE 0.3 no doer is visible (A3). CONFIRMED BY EXECUTION.
- **RN-V7.** The landed table never stamps `whispered`: `jailed: 'known'`, `banished: 'notorious'`, `turncoat: 'known'`, `criminal_founding: 'notorious'`, with one step up for a repeat offender (B1). So the verifier's "whispered jailing" is really a `known` jailing; the inflation it convicted is real at `known`. A magnitude-2 deed is `major` → 4 hops (B2). Unclamped, the projection read `notorious` at regional and `infamous` at realm (B4). The gate's `strict` arms at rank 2 (B2). The landed fade at the origin steps `known` → `whispered` at week 40 and `unknown` at 80. RN's `a_decade` held a regional deed for 216 weeks and a settlement deed until week 1041; `a_year` gives 22 and 105 (B3). CONFIRMED BY EXECUTION.
- **Omniscient delay.** Under omniscient the landed belief read returns `hopDelayTicks: 0` (`npcCirculationBelief.js :: believedReputation`). In the road presets, arrival is priced by the rumor road's own relay (`arrivalTick: now + travelTicks` over `hopWeeks`). CONFIRMED by reading.
- **The seed record.** The feed seed writes `relayedTick: null`, and the relay skips any record where `relayedTick != null` (`advanceRumorLedgers`). CONFIRMED by reading.
- **The court stock.** `informationStatecraft.js :: credibilityWeight` returns exactly 1.0 at a neutral score, with `WEIGHT_FLOOR: 0.35` and `WEIGHT_CEIL: 1.15`. The stock is lit in no preset. CONFIRMED by reading.
- **The landed mint.** `npcLedger.js :: mintDurableNpcId` is collision-checked (`MINT_PROBE_BUDGET = 64`, then a widened form, and it "never returns a taken id"). Its idempotency is a separate identity oracle. The volume's deed id instead read idempotency off the 32-bit hash. CONFIRMED by reading. The collision odds (≈4.5% for at least one collision across 20k deeds) are PLAUSIBLE arithmetic.

## 2. The record table (id · sev · disposition · where · receipt)
| id | sev | disposition | where (RN) | receipt |
|---|---|---|---|---|
| RN-V2 | MAJOR (FAIL) | CURED: the re-read key is the TRIPLE (`ver`, `mag`, heard doer). A changed heard doer MOVES the deed's one term (a voiced deed's term is re-read in place). `heardAt` returns `doerKey`. A doer-less version writes no doer term. Fame and the whereabouts read the same heard doer (REFINED). | §2.1 terms, §2.3, §4.3, §5.1, §5.3, §13 RN-1, §14, R41/R58, OD-RN-31 | `pickBetterTelling`: `if (a.completeness01 !== b.completeness01) return …`; r3Probe A1–A3 |
| RN-V6 | MAJOR (NEW) | NOTED: by A.4, RN is unchanged. PS's half is CURED by D-PS-r3. | §2.2 bracket | PS l.122, l.577 `[CURED … r3 — RN-V6 …]`; no volume claims court fame |
| RN-V7 | MAJOR (NEW) | CURED: scope capped at the stamp's breadth; `reach` truncated to the cap's rings; significance `notable` under a cap; §3.2's court-target clause exempted; the cap binds every arm; the projection never reads louder than the stamp. REFINED: fame decays on `a_year`. | RN4, §2.3, §3.1, §3.2, §3.4, §4.1, §4.3, §4.4, §13 RN-2, R56/R57, OD-RN-6/19/40 | r3Probe B1–B4; `HALF_LIFE_WEEKS.a_year` "a season's grudge, a reputation" |
| sites bracket "actor convention gains `site`" | minor | CURED (withdrawn) | §3.1 | ROUND2b ADDENDUM ST-r2-14; A.7 |
| §2.4 findings prefix | minor | CURED | §2.4 | CH l.463 `rendezvous:<wnpcId>:<aim.sinceTick>` |
| `believedWhereabouts` wording | minor | CURED (A.12); CH aligned | §2.3, R55 | CH l.448 "WHOSE DOER is the paragon (A.12)" |
| corps lens-two fallback | minor | CURED (A.12) | §6.2, R60 | A.12 text |
| PT §7.3 "a person" vs corps | minor | CURED: PT applied A.11; RN carries the court arm | §5.5 | PT l.283 |
| §4.3 "no delay" vs delay term (carried) | minor | CURED | §0, RN3, RN15, §2.3, §4.3, §8, R55 | `believedReputation` `hopDelayTicks: 0` |
| fold `party_voiced` "a court" (carried; open question 4) | minor | CURED (A.11): the court arm | §3.1, §5.5, §11, §12, §13 RN-4, R59, §17, §18, OD-RN-41 | A.11 |
| PT-r2-verify ST-r2-14 carry (RN l.243) | routed | CURED | §3.1 | as the sites minor |
| PT-r2-verify carry: no `siteId` = B | routed | CURED | §2.1 target, §14, R61, OD-RN-43 | ST §2.1 `worldSites[siteId]`; PT l.243 |
| CH-r2-verify PLAUSIBLE: seed `relayedTick` | routed | CURED: named from the landed seed, now CONFIRMED | §3.4 | `rumorNetwork.js` seed `relayedTick: null,`; guard l.678 |
| CH-r2-verify SEAMS-r2-11 FAIL (CH's half) | routed | NOTED: RN holds (R51); CH applied A.4 | §2.2 | CH l.521 "LANDED PAIR LABEL"; `paragon_leak` 11 hits |
| FOLD-r2-verify FOLD-V4 | routed | NOTED: RN holds (no lighting gate); the fold's bracket is D-FOLD-r3's | — | RN §6.2, §13 RN-3 |
| FOLD-r2-verify `u:` homonym | routed | NOTED: already registered | §2.4 | RN homonyms row |
| FOLD-r2-verify menace rationale | routed | CURED (A.7) | §2.2 | A.7 |
| PS-r2-verify HOLD rows | routed | NOTED | — | — |
| A.1 · A.2 · A.3 · A.5 · A.6 · A.9 · A.10 · A.13 · A.15 | — | NOTED: no RN text | — | grep 0 hits each (garrison, holdBeforeNode, σ, fealty_, fundingBand, readiness01, waypoint, paragonLean) |
| A.4 | — | NOTED: RN unchanged; CH and PS applied it | §2.2 bracket | as above |
| A.7 | — | CURED | §2.2, §3.1 | — |
| A.8 | — | CURED (RN's half) | §2.2 | PL l.242 `polity_ban:<subjectKey>:<banTick>` over RN's `p:`/`u:` |
| A.11 | — | CURED | §5.5 et al. | — |
| A.12 | — | CURED | §2.3, §6.2 | — |
| A.14 | — | NOTED (RN minted none of `a␟b`/`hashInt`/`cut01`) + REFINED (the deed-id mint) | §2.1, §2.3, §3.1, §13 RN-0, §14, R61, OD-RN-42 | census.out |

## 3. STOPs
None.

## 4. REFINED (each marked in place, each vetoable)
1. **The verdict deed fades on `a_year`** (§3.1, §4.1, RN3, OD-RN-6/40). This is the pace half of RN-V7's evidence, done with one decay law on a per-source band. It brings the verdict deed close to the landed 40-week band fade, where `a_decade` held it four to twenty times longer (B3). DRAFT, on the FP-46 roster.
2. **The deed id is minted the `npcLedger` way whole** (§2.1 `deedId` and a new `actRef` row, §2.3, §3.1, §14, R61, OD-RN-42). It uses `fnv1a32` over the composite joined by `KEY_DELIM`, with the landed collision probe, and idempotency is asked of the stored `actRef`. Without this, a hash collision silently refuses a distinct deed. `actRef` is a new persisted field, FREE (0 everywhere).
3. **The heard doer is carried into fame** (§4.3). A road-heard town counts a deed for the doer its version names. This is RN-V2's logic extended to fame (Law One).
4. **The crossing's test is written down** (§5.5). It compares the band at this tick with the band at the previous tick, both derived; decay never crosses into an outer band (anti-ratchet). The derived holders (courts, the omniscient arm) needed it.
5. **A version with no visible doer writes no doer term** (§5.1). It follows from the triple and VAGUE 0.3. A better telling never lowers completeness, so a doer once heard is never un-heard.

## 5. ROUTED (the other-volume halves this lane could not write)
- **CH §2.2 (l.209):** strike "after the news delay" from the omniscient arm of `believedWhereabouts` (RN §2.3/§4.3 r3: the omniscient arm applies `hopDelayTicks` 0). Also add "a version heard under another doer places nobody" (RN §2.3 r3).
- **THE FOLD (P4 / D-FOLD-r3):**
  - OD-FC-47 ↳ (fold l.901) still says the `npc_verdict` deed "is minted where the verdict is APPLIED" and calls `sourceEventRef` "the one idempotency key". Bracket it: minted by THE ONE PERSON STAGE (RULINGS-ROUND2 B), capped at the stamp (RN-V7); idempotency by the stored `actRef`, with `sourceEventRef` as the cross-door key only.
  - The §3.4 `party_voiced` row gets A.11's court arm.
  - §5 registers `actRef` (FREE), the target's `siteId`, and `doerKey` (FREE in src; one ledger-docs hit, RN's own).
  - FP-46 gains the verdict deed's `a_year` band and the stamp caps.
  - FOLD-V4's OD-FC-63 bracket.
- **THE BODIES (`briefs/L-BD.md`, compiling):** BD proposes RN keys (`g:` for a gang, the creed's key for a conclave, none for a beast). RN admits them only when that volume's round routes them; nothing is pre-registered here.

## 6. Open questions for the chair
1. **The `a_year` verdict pace (REFINED 1)** is a tuning choice under THE PROMISE, so it is DRAFT on FP-46. The alternative is to keep `a_decade` and accept that a verdict outlives the landed fade 4–20×.
2. **The `actRef` field (REFINED 2)** adds one persisted string per deed (~40 bytes). The alternative is to accept the hash-only idempotency and its rare silent loss.
3. **The court arm's scope** is "about the party only" (A.11's trigger). A court's voice about a paragon or a corps is not minted; officers act on those through their cards. Widen it only on a ruling.

## CONFIRMED vs PLAUSIBLE
- **CONFIRMED BY EXECUTION:** RN-V2's convicting merge and the triple's catch, move and idempotence; RN-V7's stamp floor, hop budgets, projection clamp and both paces.
- **CONFIRMED by reading:** the omniscient zero delay, the seed's `relayedTick`, the court credibility weight, the landed mint probe, and PS's, PT's and CH's applied halves.
- **PLAUSIBLE:**
  - how often a two-hop regional cap matches the landed distance fade (RN-5 measures);
  - the ≈4.5% collision figure;
  - the `party_slander` weighing parity, which is the chair's words (A.11). The per-source weight it names (`makeCredibilityWeightFn`) is CONFIRMED.
