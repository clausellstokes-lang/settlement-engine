# D-RN-r4 — THE RENOWN, P3 round 4a disposition (lane D-RN-r4, Opus 5.5 xhigh; chair 0a2e8bd9, Fable 5.1; 2026-10-18 21:58–22:3x EDT by `date`)

## OUTCOME
All 43 inputs are disposed: 21 CURED, 22 NOTED, 0 REFUTED, 0 STOP. Every cure is in place in `docs/DESIGN_FP_ARCH_RN.md` (880 → 941 lines; 47 `(fp-final r4)` brackets; §19 has a round-r4 block). The FAIL, its three ROUTED-UNAPPLIED halves and RN-W1 were each checked against the receipt that convicted them, by execution on master `81f1cd963`. The record: `D-RN-r4-probe/` — `r4Probe.mjs` → `r4Probe.out.json`, `census.out`, `efflines.out`, `apply_r4.py` (the edit record), `RN-before-r4.md` and `volume.diff`. I touched no git and ran no test suite. The code of record was only read.

## 1. MEASURED FIRST (what could refute the cures)
- **The findings seed (A.9), EXECUTED (`r4Probe.out.json` A).** I re-ran the verifier's five-town graph on the landed `advanceRumorLedgers` with RN's cured seed builder. The cured seed has its origin at `home`, `relayedTick` 10 pre-stamped, and `arrivalTick` = 10 + the relay's own price (1). Only `home` ever holds it. It becomes visible at tick 11 and is gone at tick 25 (`notable` TTL 13 after arrival). The round-3 text's seed (origin the meeting town, guard null) reached all five towns. A row that declares neither field (the leak) also reached all five, as a feed seed does.
- **Read at master:**
  - `rumorNetwork.js`: "A record with arrivalTick > current tick is IN TRANSIT … invisible to the read model until it arrives", "In-transit records (arrivalTick > now) never age", `if (record.relayedTick != null) continue;`, and `const travelTicks = Math.max(1, finiteNumber(weeks, 1));`.
  - `distanceRead.js :: hopWeeks`: "same settlement ⇒ 0; unreachable / absent pair ⇒ null".
  - `pulseKernel.js`: the rumour call passes `season: roadSeason,`.
- **The court voice (A.15), EXECUTED (`r4Probe.out.json` B).**
  - `envoyChanceMeetingStage.js :: postureBandOf` is MODULE-PRIVATE (`B_postureBandOf_exported: false`). It bands `allied · patron · client · vassal · trade_partner` → `friendly`, `hostile · cold_war · rival` → `hostile`, and everything else, including no label, → `neutral`. Its words are `envoyChanceMeeting.js :: POSTURE_BANDS`.
  - The cured term is `clamp(−1 × credibilityWeight × 0.5 × factor, ±0.4)`. With the stock dark it gives −0.4 for a friendly hearer, 0 for a neutral one and +0.4 for a hostile one. A proven liar (weight 0.35) gives ±0.175. The round-3 formula gave −0.5 to every hearer.
  - The host is 484 effective lines, so the car is the `export` keyword alone (`efflines.out`).
- **Census (`census.out`).** `body_act` · `believedBodyOf` · `relationFactor` · `ledBy` have 0 hits in master src/tests/docs. The ledger hits are BD's and ST's own. There is no quoted `g:` literal in master src and no `leak:body` anywhere. `POSTURE_BANDS` is landed (3 src).
- **Citing volumes, grepped.**
  - CH §8/§9 already carry the seat origin, the pre-stamped guard and `:<retainer.sinceTick>`, but not the seed's `arrivalTick` (routed).
  - PT and the fold restate no court-voice formula.
  - BD §2.1/§19 agree on `g:`, the creed key and no beast key. BD §7.2 limits deeds to "where a NAMED person is involved" (routed).
  - PR §9.3 (round 4) has "the body or the villain" as a clash's doer (routed).
  - ST §7.4/§8 name `site_verdict` as RN's slot (agrees).
  - RN carries 0 `readiness01`, `unopposed`, `banner`, `protection_kept` and `keptSecret`. Its only `cult` is the faith ladder's size word.

## 2. THE RECORD (id · sev · disposition · where · receipt)
| id | sev | disposition | where | receipt |
|---|---|---|---|---|
| CH-r2-verify note "seed `relayedTick`" (r3 cure) | MAJOR (FAIL) | CURED (A.9): the arm copies the declared `relayedTick` and `arrivalTick`; origin the seat | §3.4 · §2.4 · §13 RN-0 · §14 · R63 · OD-RN-44 | EXECUTED A |
| ROUTED-UNAPPLIED (a): copy `relayedTick` | FAIL | CURED | §3.4 | A |
| ROUTED-UNAPPLIED (b): origin the employer's seat | FAIL | CURED; the arrival is priced by the relay's `travelTicks` | §3.4 · R63 | A; `hopWeeks` |
| ROUTED-UNAPPLIED (c): leak `:<retainer.sinceTick>` | FAIL | CURED | §2.4 · §3.4 · R63 | CH l.485 |
| RN-W1 | MAJOR (NEW) | CURED (A.15): `× relationFactor` (the landed `postureBandOf`), cap 0.4, own commons and members excluded | §0 · §5.5 · §10 · §13 RN-4 · R59/R62 · §17 · OD-RN-41/45 | EXECUTED B |
| minor: no cap filter in §5.1 | m | CURED | §5.1 | §3.1 cap |
| minor: crossing rebuild after RN6 | m | CURED: band before/after the pass's writes; a DM set is no crossing | §5.5 · OD-RN-41 | RN6 |
| minor: §4.6 clock `a_decade` | m | CURED | §4.6 | §3.1 |
| minor: settlement doer at `s:` | m | CURED | §5.1 | §2.2 |
| minor: ring 1–2 louder than the landed fade (PLAUSIBLE) | m | NOTED: RN-5 measures it | §13 RN-5 | verifier |
| D-CH-r3 §5 RN (d) significance/score | routed | NOTED: holds | §3.4 | CH §8/§9 |
| D-PT-r3 §3 (5) (a)–(d) | routed ×4 | NOTED: hold | §5.5 · §2.1 · §5.1 · §3.1 | V-RN-r3 |
| SEAMS-r3 "RN: —" | — | NOTED | — | — |
| L-BD §4 RN (1) `g:` holder/subject | routed | CURED (named gangs; body↔body refused; a body never voices — BD15) | RN1 · RN16 · §2.2 · §5.1 · §5.5 · §6.2 · §14 · R64/R65 · OD-RN-46 | BD §2.1 |
| L-BD (1) conclave keys creed | routed | CURED | §2.1 · §2.2 | BD §2.1 |
| L-BD (1) beasts none | routed | CURED | §2.2 · §3.1 | BD10 |
| L-BD (2) `body_act` + inherent-value rows | routed | CURED (slot row with contract; block and walker) | §2.1 · §2.4 · §3.1 · §6.1 · §11 · §13 · R64/R67/R68 · OD-RN-47 | BD §7.2, §9.8 (c) |
| L-BD (3) `leak:body` telling row | routed | CURED | §2.4 · §3.4 · §14 · R66 | BD §7.1 |
| B: L-BD 45 `believedBodyOf` | routed | CURED (RN's half: inputs; BD owns the read) | §2.3 | L-BD 45 |
| B: L-BD 32b/33b naming threshold | routed | CURED | RN1 · RN16 · §2.2 · §3.1 · §4.1 · §14 · R64 | L-BD 32b/33b |
| A.1 · A.2 · A.5 · A.6 · A.10 · A.11 · A.13 · A.14 · A.19 · A.20 | ruling ×10 | NOTED: no RN text | — | grep |
| A.3 | ruling | NOTED: `cult` is only the size word | — | §5.3 |
| A.4 | ruling | NOTED: 0 hits | — | grep |
| A.7 | ruling | NOTED: 0 `banner` | — | grep |
| A.8 | ruling | NOTED: RN unchanged; the belief question goes to the chair | §18 (6) · OD-RN-48 | — |
| A.9 | ruling | CURED (with the FAIL) | §3.4 | A |
| A.12 | ruling | CURED: six kinds | §2.2 · §18 (5) | — |
| A.15 | ruling | CURED (with RN-W1) | §5.5 | B |
| A.16 | ruling | NOTED: the telling carries no `siteId`; REFINED; PT routed | §2.1 | §3.4 |
| A.17 | ruling | CURED (cite): might seen = ST's `seenBy` into BD's record | §2.3 | ST §2.4 |
| A.18 | ruling | CURED (RN's half): joint sortie = one deed, the anchor | §3.1 | A.18 |

## 3. STOPs
None.

## 4. REFINED (each bracketed in the volume, vetoable)
1. **The court voice excludes the court's own MEMBERS** (the ruler and the `ACT_OFFICE` holders), not only its commons. Otherwise `courtRegardOf` would feed back into itself. (§5.5)
2. **`ledBy`** is an optional `wnpc_` on a body's deed. It gives the leading paragon a half-weight term (the backer idiom) and counts toward his fame. It is FREE as a token. It is a persisted field, and the alternative is that a leader gains nothing from his body's deeds. (§2.1, R68, OD-RN-47)
3. **A body's name after BD's capped `ended` ring evicts it** is read from its kind and place. RN never stores a copy of the name. (§14)
4. **The deed's telling never carries `siteId`.** So a deed at a `keptSecret` site reveals the site to no court's belief (A.16). The line rule is PT's. (§2.1)
5. **CHAIR-NOTES 18 (d)'s corpus law** — whether each read takes BELIEF or TRUTH — is named once for every RN read. (§2.3)
6. **`courtRegardOf`'s parameter `bodyKey` is renamed `holderKey`.** It now shares a surface with THE BODIES' `bodyId`. (§2.3; the `body` homonym, §2.4)

## 5. ROUTES (other volumes' halves; this lane wrote none)
- **CH** (§8 l.466, §9 l.485, OD-CH-32/40). The findings row declares `arrivalTick` = tick + (meeting = seat ? 0 : `Math.max(1, finiteNumber(hopWeeks(digest, meetingId, seatId, season), 1))`). This is the last clause of A.9: "CH's §8 cites". Both rows cite the widened signature `(worldState, tick, { digest, season })`. CH's `leads` retainer (L-BD 32) is what BD's door reads to stamp `ledBy`.
- **BD** (§2.1, §7.2, §19).
  - (a) Body↔body feeling (`g:`×`g:`, `g:`×a conclave's creed) is BD's `pairs`. RN refuses it with `pair_state`.
  - (b) A `body_act` deed's doer is the NAMED body, not only "where a NAMED person is involved". The leader rides as `ledBy`.
  - (c) `believedBodyOf` (L-BD 45) is BD's read. It composes RN's inputs (RN §2.3); RN keeps no body belief store.
  - (d) BD registers its `body_act` kinds: which `body_stance` words are public, and `employed` never. It registers its inherent-value block under RN's walker, and names the verdict record that THE ONE PERSON STAGE mints from (BD-4's car).
- **PR** (§9.3 l.341). "the body … or the villain, where RN admits the source" should read: "doer the body (`g:`/its creed; a beast none), its leading paragon riding as `ledBy`". This keeps one doer per deed. A clash is `patrol_clash`, never also a `body_act`.
- **PT** (§11.1's line, §4). A deed whose `target.siteId` is a `keptSecret` site names no site in its line until `party_made_known_site` (A.16).
- **FOLD (P4).** §5 rows to add:
  - `g:` (FREE), `body_act` (slot, BD · C17), `ledBy` (FREE);
  - `TELLING_SOURCES`' third row `leak:body:`, and the per-hire leak key;
  - the second refused class;
  - `friendly` (`POSTURE_BANDS` reused, A.15).

  RN's actor-kind citations become six (A.12). The §3.4 `party_voiced` ↳ may cite A.15's hearer factor.

## 6. OPEN QUESTIONS FOR THE CHAIR
1. **Belief or truth for RN's pair reads.** RN's two pair reads are lens two's `pairNet` and A.15's relation factor. Both read the holder's OWN landed relation (RULINGS-ROUND1 RN-r1-1, truth). A.8 rules that CH's leaf reads the same kind of label THROUGH BELIEF (`readBeliefRelationship`), and CHAIR-NOTES 18 (d) would call a hearer's reaction a decision. RN is unchanged here. Re-pointing both reads to `readBeliefRelationship` is a one-line cure if the chair rules so.
2. **`ledBy`** (REFINED 2) adds one persisted field, and it is vetoable.
3. **A PERSON hearer's relation factor maps `mistrust` to −1** (the hostile side, by analogy with `rival` → `hostile` in the landed banding). The alternative maps only `enmity` and `hatred` to −1. This is DRAFT.

## 7. CONFIRMED vs PLAUSIBLE
- **CONFIRMED by execution:**
  - the findings seed on the landed relay (held at the seat alone, its in-transit arrival, its expiry);
  - the cured court term on the landed `credibilityWeight` and on a byte-copy of the landed `postureBandOf` over all ten labels and none.
- **CONFIRMED by reading at `81f1cd963`:** `hopWeeks`' 0/null contract, the relay's `travelTicks` line, the in-transit rule, the kernel's `season: roadSeason`, `postureBandOf` being private (484 effective lines), and the token census.
- **PLAUSIBLE, and not upgraded:**
  - the names BD will give its naming receipt and its verdict record;
  - the bodies' deed rate (RN-5 measures it);
  - how often the relation factor moves a band;
  - where BD's door stamps `ledBy`;
  - every DRAFT constant (unchanged; round 4 adds none).
