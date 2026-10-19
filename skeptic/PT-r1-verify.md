# PT-r1-verify — REFUTING VERIFIER, ROUND 1: THE PARTY (`docs/DESIGN_FP_ARCH_PT.md`, 637 lines)

Seat V-PT (Opus 5.5), 2026-10-18.

- **Read whole:** README, VERIFY, RULINGS-ROUND1 (with the 05:1x ADDENDUM), the volume, `cure/D-PT-r1.md`, `skeptic/PT-r1.md`, SEAMS-r1 and HOST-r1.
- **Read by section:** RN §2–§7 and §11–§13; CH §11, §14 and §16; PL PL4–PL5, §2 and §3.1; MN §2, OD-MN-28/36 and M46.
- **Code:** `master-81f1cd963`, read with `rg` and `sed` only.
- Nothing else was edited. No git, no test suite.

## COUNTS

**holds 35 · fails 5 · stop 0 · new BLOCKING 0 · new MAJOR 4.** All 40 BLOCKING and MAJOR rows were judged. There are no REFUTED rows.

These rows hold:
- **PT-r1:** 2–7, 9, 11–13, 15 and 17–22.
- **SEAMS-r1:** 3–8, 10–12, 14, 15 and 18.
- **HOST-r1:** 2, 3, 5, 6, 9 and 10.

## OUTCOME

Most of PT's own text is now sound, but the round has not converged:
- The BLOCKING whereabouts cure fails in the commonest case: a toggle and deeds set in the same week.
- Three cures contradict RN's live text, because D-PT §5.1(a)(b)(c) has not been applied. Under this verifier's rule, a live contradiction with a sibling volume fails the row; the stale fold rows are left to P4 and are not failed.
- One cure has no carrier in RN at all.
- The cures added four MAJOR defects.

**For the chair:**
1. PT-r1-1 needs an order within a week (tick, then a monotone sequence), not "the toggle on a tie".
2. RN's round 2 must take D-PT §5.1(a)(b)(c) and a void re-read.
3. PT-V3: do PT-1 and PT-2 wait on RN-3's owner-gated lighting?

## FAILS AND NEW FINDINGS

| id | disposition | verdict | why / receipt |
|---|---|---|---|
| PT-r1-1 | BLOCKING · CURED | **FAILS** | **The rule:** "the DM's toggle wins whenever it is the later (and on a tie)" (PT3, §2.3, §4). **Why ties are normal:** a party deed is stamped `partyImpact.js :: applyPartyImpact` `const tick = worldState.tick;`, and that tick moves only on an advance. The toggle and every deed of one session therefore share a tick. **Effect:** a toggle set this week beats every deed recorded after it that week. P21 ("the DM sets Kell; the party then records two deeds in Tolle ⇒ Tolle") fails whenever both happen in one session. Fault, witnesses and suggestions then read the stale toggle, which is the finding. **Cure:** order by (tick, a monotone sequence stamped on `presentAt` and on each party deed). |
| PT-r1-8 | MAJOR · CURED (PT's side) | **FAILS** | **PT:** §2.1 and §16 make credibility "DERIVED, NOT persisted". **RN still says:** "ONE holder `spatialLedgers.party.credibility = { score, lastUpdateTick }` … **The writer** is the PARTY DOOR" (RN §7; also RN §2.1 and RN-1). **Effect:** one persisted field has two definitions. It converges when RN applies D-PT §5.1(a). |
| PT-r1-10 | MAJOR · CURED (PT's side) | **FAILS** | **RN still says:** "PT's `moralWeight` mark, when present, REPLACES the derived band for every reader" (RN §6.1). **PT §11.3:** the mark reaches a hearer only through a visible reason, scaled by belief. **Effect:** on the owner's P4b (`admirable`, `unspoken`), RN reads admirable everywhere and PT reads villainous. PT §11.3 also re-specifies RN's lens one, although PT4 says RN's reads are "cited, never re-specified". It converges with D-PT §5.1(b). |
| PT-r1-14 | MAJOR · CURED | **FAILS** | **PT §10.3:** from the week a hearer's town hears the void, that hearer "re-reads the backed deed with the backing part masked (RN's re-read of a version)". **RN has no such trigger:** RN §5.1's one writer re-reads only on a changed `ver` of the deed's own telling, or for a correction ("replaces the holder's term for that deed (or for the deed it corrects)"). A void deed is neither. **Effect:** in the belief presets the persisted `s:` and `p:` terms keep the backed reading. **Unlisted:** D-PT §5.1(d) asks RN only to name the `voidsRef` field. |
| PT-r1-16 | MAJOR · CURED | **FAILS** | **RN still uses the old words:** RN §2.1 lists "for `party_pledge` `kept · broken` (PT's)". The RN §3.1 row, RN §6.1's pledge reading ("`kept` → `pledge_kept` … `broken` … → `pledge_broken`") and RN §7 all agree with it. **PT now mints** `made_good · fell_short`. **Effect:** RN's reading never matches PT's deed, and the homonym `broken` stays a deed-kind literal. SEAMS-r1-7 shares this root and is counted here once. |
| PT-V1 | NEW · MAJOR (from PT-r1-4's cure) | — | **The evidence rule:** `reachedTick` is "the first tick the party's whereabouts named the need's settlement while pledged" (§2.2), and the default is "`made_good` … `reachedTick ≤ T`" (§8.6). **Why the common case breaks:** a request goes `awaiting` only "once co-located" (PT9, §13), and the requester is "the court of the call's own `settlementId`" (§7.2). So the usual yes is given while the party stands in the need's town, and `reachedTick` is set that same week. **Effect:** the pledge is `made_good` (`pledge_kept`, `TRUE_RISE`) even if the party leaves the next day. The owner's "of the party fails to meet and they accepted it … that is on the reputation" cannot fire by default. Any placing deed there counts as evidence, and so does "a party deed [whose] target is the … siege town". **Cure:** count only presence after the pledge week, or presence or a need-touching deed in the clock's final window. |
| PT-V2 | NEW · MAJOR (§11.3) | — | **The formula:** "`kind01_read = kind01 + (marked01 − kind01) × belief`, the same for `law01` and `force01`, where `marked01` is the marked band's centre (… `villainous` 0.08)". **The mismatch:** the band is a `kind01` scale only (RN §6.1: "by `kind01` edges"). **Worked case:** take RN §6.2's lens one and a balanced holder (K = 0) who is chaotic and peaceful. A `villainous` mark believed at 0.6 moves `law01` and `force01` to 0.248. The reading becomes +0.126 + 0.101 = **+0.23, approval**, where the unmarked act read 0. A `heroic` mark gives −0.23. **Cure:** the mark moves `kind01` alone. |
| PT-V3 | NEW · MAJOR (§15 × RN's HOST-r1-7 cure) | — | **PT's chain:** §15 gives "(RN-0 + PT-0) → RN-1 → RN-2 → PT-1 → PT-2". PT-0 carries "the §3.3 value rows", and PT-1's FIRST-VISIBLE is "who has heard and what they think". **RN's gate:** the "registration door for PT/CH/verdict rows" and the lenses are RN-3's, and "RN-3 LIGHTS only after the owner answers alignment-25e and -25g" (RN §13). RN-1's heard pass "reads each through §6's lenses" (RN §5.1). **Effect:** none of the regard PT shows exists before RN-3, and PT-0's rows have no door yet. **Cure:** put RN-3 before PT-1, register the §3.3 rows at RN-3, and state that PT-1 and PT-2 wait on the two owner rows. |
| PT-V4 | NEW · MAJOR (from PT-r1-21's cure) | — | **PT §9.1:** "no separate governing-faction voice — each is inside the court's". **RN's court:** it carries only "the authored baseline for the body", meaning `c:`'s own (RN §5.3). Yet `DECLARE_STANCE` and `SET_REGARD` take "any holder kind, bodies … included" (RN §5.6), and PT4 names "a faction". **Effect:** a DM's stance on the governing faction `f:<sid>:<gov>` reaches no voice in `netEffectAt`, so it reaches neither the town's gate nor any producer. **Cure:** the court voice folds in that body's `dmSet ⊳ declared`, or §9.1 keeps the voice whenever it carries an authored baseline. |

**Round-2 carries (not counted):**
- **Not new:** `MARK_DEED` (§6) rewrites the deed fields, against RN2: "APPEND-ONLY … never rewritten", with the only writers `mintDeed / strikeDeed`. This was already in the compile, and the round-1 skeptic did not raise it.
- **§16:** when a pledge's town is destroyed, the pledge closes "with no cost". A reachable miss on the worst outcome is then free.
- **§13:** it credits `settlement` to MN's `MENACE_WHERE_KINDS`, but MN's list is `country · road`.
- **§2.4:** it says "`lens` — never a PT word", yet the volume uses "lens one" or "lens two" 6 times.
- **RN's deed table and `mintDeed`:** they still lack `actAt`, `voidsRef` and `backerRole`. RN-0 promises a normalizer that names "every field incl. PT's".
- **RN, stale text:** the RN §3.1 `party_event` row and the SEAMS-r1-6 STOP in RN §5.5/§11.
- **Owed by siblings:** PL still has to name `seatChangedSince`, and CH has to name the reader of `met_in_person`.
- **Fold:** the §3.4 party rows wait for P4.
- **Undo and the ripple outcomes:** undoing a rippling party event strikes its deed, but the outcomes `applyPartyImpact` auto-applied still stand.

**CONFIRMED vs PLAUSIBLE:** the five fails and PT-V2–V4 are CONFIRMED, by quoted code at `81f1cd963` (`const tick = worldState.tick;`) or by current volume text; PT-V2 is arithmetic on quoted formulas. How often PT-V1 bites, and how much PT-V4 matters, are PLAUSIBLE; both mechanisms are CONFIRMED by text.
