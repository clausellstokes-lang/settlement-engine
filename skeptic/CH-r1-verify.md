# CH-r1-verify — REFUTING VERIFIER, ROUND 1: THE CHAMPIONS (`docs/DESIGN_FP_ARCH_CH.md`)

Seat V-CH (Opus 5.5), 2026-10-18. Read whole: README, VERIFY, RULINGS-ROUND1 (with the 05:1x ADDENDUM), the volume (878 lines), `cure/D-CH-r1.md`, `skeptic/CH-r1.md`; the 22 routed SEAMS/HOST rows. Code: `master-81f1cd963`, `rg`/`sed` only. Nothing else edited.

## COUNTS

**holds 35 · fails 5 · stop 2 · new BLOCKING 1 · new MAJOR 1** (all 40 BLOCKING/MAJOR rows judged; no REFUTED rows).

- Hold: CH-r1-1–3, 5–11, 13–19, 21–23; SEAMS-r1-2–5, 9, 12–14, 16, 18; HOST-r1-2, 3, 6, 8, 16.
- STOP (ruled in the ADDENDUM): SEAMS-r1-1 (BLOCKING), SEAMS-r1-19 (minor).

## OUTCOME

Five cures fail; the cures introduced two new findings. The worst, CH-V1: no errand-borne arm can exist at master (recruiter, handler legs, court errand, and the custody arm on them). The errand row accepts only a peace embassy, and the cure's hand-off never reaches the errand mover (CH-r1-4). The chair's CH-r1-4 re-ruling assumes lighting OD-FC-39's unit suffices; it does not make the row persistable.

**The chair's to rule:**
1. **CH-V1** — an owner slot for the row, or business abroad confined to a peace embassy.
2. **The SEAMS-r1-1 ADDENDUM is unexecuted.** The withdrawn custody arm stands at §0, CH3, §9 road 4, §12.4, §18 (`envoy_held`, `ransom`), §19, §21 L7, §24, S27, OD-CH-11, CH-8; the DM's-hand arm ("held at X" by an Edit Mode act) is missing.

**Round 2 carries (not counted):** drop SEAMS-r1-19's STOP markers; HOST-r1-2's "owner's row" becomes the COMPATIBLE ruling; `polityEnabled` → `polityHoldEnabled` (PL's SEAMS-r1-12 row); PL §14.7 cites two faith carriers, CH has three; RN-S1 does not thread `settlementUpdates`; `transportedDecision || readWarPeaceDecision(` bypasses CH's peace term; MN writes `wilds`.

**CONFIRMED vs PLAUSIBLE:** every fail and new finding is CONFIRMED (code at `81f1cd963` or current volume text), as are the holds' load-bearing receipts. PLAUSIBLE, not upgraded: stressor tellings on the call board's arrival road, `projectScope` reaching an authored `realm`, the peace seam's lighting.

## FAILS

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| CH-r1-4 | MAJOR · CURED | **FAILS** | **The cure's rule.** CH8 says "CH clears `residency` as the errand opens and writes no leg until the errand closes." **Why the hand-off never happens.** With no transit at leg 0, `envoyDiplomacy.js :: activeOwnsLeg` returns `unclaimedPlacementAt(…) \|\| unclaimedOriginAt(…)`. The first needs `position.placed`. The second needs `originRef.settlementId === errand.from`. A paragon is a roamer (CH9) with an EMPTY `originRef` (§3 step 2), so both are false. **Effect.** `syncEnvoyNpcTransit` returns `worldState` unchanged every week: the row travels while the record holds neither residency nor transit. `terminalOwnsTransit` never matches, so the record never comes home. **Second blocker.** `envoyPulse.js :: envoyIsPhysicallyHome` returns false for every roamer (`if (Object.prototype.hasOwnProperty.call(ledger.roamers, npcId)) return false;`), so §8's home delivery never counts. |
| CH-r1-12 | MAJOR · CURED | **FAILS** | **The cure.** It opens the stay's deed at the first exerted week ("`calling.deedId` holds the open one") and writes "its magnitude … when the stay closes" (§2.2b, L3). **RN's law.** RN2 says "one append-only record … 'never rewritten, folded or pruned'". The scope is "computed ONCE at mint and frozen", and the only writers are `mintDeed / strikeDeed`. No RN door amends a magnitude. **Fix.** Mint at close, or strike the deed and mint again with `correctsRef`, and say which. |
| CH-r1-20 | MAJOR · CURED | **FAILS** | **PL is silent.** PL still has no sentence for a ban or for harbouring: `rg -i 'harbou?r\|polity_ban\|paragon'` over PL finds only §14.7. **The contradiction.** CH mints `fealty_defied` from the paragon module. But PL §4.6 says "the polity module MINTS a `fealtyRow`", and PL7 says "Two acts break fealty by definition". Harbouring would be a third act, undefined by PL, written into PL's record and read by the hold's `P`. **Result.** The finding ("No sentence on the PL side agrees") still holds, and CH's request for the episode prefix is unanswered. |
| CH-r1-24 | MAJOR · CURED | **FAILS** | **The missing reader.** The census returns 18 files. §2.4 declares 14 of the 15 real readers and omits `envoyPulse.js :: envoyIsPhysicallyHome`, which reads `placed` and refuses roamers. **Unbudgeted hosts.** The declared exclusions need lines in up to five hosts: `heraldWanderers.js` (332), `npcLedgerProjection.js` (269), `npcCirculation.js` (725), `reputationRaceConsumer.js` (340) and `npcReplacement.js` (434). CH-0's host row ("npcLedger 3 · npcDmVerbs 12 · npcFacetContract 2") budgets none of them, against CH17. |
| HOST-r1-5 | MAJOR · CURED | **FAILS** | **The register.** §2.3 says "gate" is "never bare in a new sentence", and for `lens`, "CH says 'reading'". **Round-1 text breaks it.** Bare "gate": §11 step 2's bracket ("carries no gate weight … no longer reaches that gate"), OD-CH-15 ("The gate"), §25 ("the gate's renown host flag"). "lens": §7 ("the court's lens is the ruler's three coordinates"), §11 BENCH ("read through the officer's lens"), §2.2b ("RN lens two"). **Older text** also keeps "the person gate" (§19) and "the omniscient gate" (CH-5). The fix is mechanical. |

## NEW FINDINGS

| id | sev | site | claim | refuting receipt | cure |
|---|---|---|---|---|---|
| CH-V1 | **BLOCKING** | §0 errand row; CH8; §4.2 `keep_rendezvous` and `court_errand`; §5; §7 recruiter; §8; §19 ERRAND ARMS; CH-4 and CH-7 hosts; S6, S14, S27; `RULINGS-ROUND1` CH-r1-4 | "court-sent business ABROAD … rides one row each"; "they LIGHT with OD-FC-39's one lighting unit" | **The row.** `envoyErrandRecords.js :: normalizeErrand` reads `if (!offer \|\| !acceptance \|\| !snapshot \|\| … \|\| !PURPOSE_SET.has(purpose)`, and `PURPOSE_SET` is `['sue', 'self_parlay']`. **ES's own record.** `espionageMissions.js` (R-ES1-1) says "the FREE-STANDING spy row, with no diplomatic pretext and no war flags, does not exist yet and is owed by a later SP or ES slice". **The émigré record.** `emigreErrand.js` says "MINTING THROUGH THE SPINE MEANS PRICING A JOURNEY AND VALIDATING A CLASS, NEVER WRITING A ROW … a persistence-shape decision, owner-gated by name". **Casting.** Envoys are also cast from rosters (`envoyCasting.js`), and a paragon has none. No row can name a paragon recruiter, handler or court errand; lighting the keys changes nothing. | Either record the row as an owner slot for the persisted shape, beside ES's free-standing row, with the degraded arm stated as every world's arm until it lands. Or confine a bound paragon abroad to a peace embassy minted by `mintEnvoyErrand({ npcId: wnpcId, … })`, with the recruiter and the rendezvous given slots. The chair re-rules CH-r1-4. |
| CH-V2 | MAJOR | §6.1 and CH-3 EDITOR (e), against P2 `exertion`, §4.5, §6.3 and §13 | §6.1 says rows are read from "the persisted `aim.exert`"; CH-3 (e) says "the lean reads `aim.exert`" | **The other sections.** P2 says "`exertion` … the seams read THIS, never the choice alone". §6.3 says "A FAILED exertion … contributes nothing that week (`exertion.outcome: 'faltered'`)". §13 voids the duel's loser. **Effect.** As written, a faltered exertion and a duel's loser still lean at all ten stressor gate rows. The `setback` rung and the duel verdict therefore change nothing on the birth side. **Cause.** CH-r1-8's cure declared `exertion` but left §6.1 and CH-3 reading `aim.exert`. | Every seam reads `exertion.outcome` (`exerted` applies; `indecisive` applies both rows), and §6.1 and CH-3 say so. |
