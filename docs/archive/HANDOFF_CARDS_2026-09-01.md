# HANDOFF CARDS — ARCHIVE (folded 2026-09-01 at §879.9, Efficiency Protocol III move E5)

Every line below is VERBATIM from `docs/HANDOFF_CURRENT.md` as committed at ledger tip `1a8657878` (914 lines). Two spans were folded: lines 27–787 (the superseded pickup cards §878 → §724, the §685 seat block, the 08-24/08-23/08-22/08-20 overrides) and lines 801–880 (the historical topology snapshot, the 08-17 immediate state, the weekly-limit pause state, the post-pause queues). Nothing was deleted or reworded; every § reference is preserved. The live card is `docs/HANDOFF_CURRENT.md`.

---

## (superseded) PICKUP AT §878 (2026-09-01, THE OWNER'S PAUSE CARD) — the §879 card above supersedes.

**⛔ FIRST ACT ON RESUME IS NOT A LANDING — IT IS THE RETROVALIDATION.** The owner ordered (§878, verbatim): *"Now go back to using Fabel, doing the retro validation and the previous split tasks! Bring everything to a pause so I can update Claude."* **THE SEAT IS BACK TO §447's SPLIT** — Fable manages/architects/validates/recons/chairs, Opus implements/verifies, §787 fit-crossover both ways. §876.5's Opus inversion is CLOSED; its marking law is PERMANENT. **A Fable seat re-derives the queue BEFORE any new lane opens**: six rows landed at §877, **NINE more lanes completed since** (TAILFCURE · CLAIMHAB · LOSTPIN · COUPLING · TOFU · ENFORCEDBY · PHANTOM · FOLLOWAMEND · INSTRPREP) and **THREE were stopped mid-flight** (INSTRLAND · PAIDFIX · GLYPH) — every one owes its row; each lane's receipt in `825f209c…/scratchpad/` carries a drafted `## RETROVALIDATION ROW`.

**Branch `claude/composite-r4` = `8b07ce45f179b583c6a152412a23777cb1a15a38` (HYGIENE landed §877 — FIVE landings this arc: §874 substrate · §875 T8 · §876 WAR · §877 HYGIENE, all first-or-second-run green). Ledger through §878.1.**

**⭐ THE PAUSE STATE — SURVEYED, SEALED, NOTHING LOST (529 law: SURVEY BEFORE RESUMING, never assume):**
- `laneINSTRLAND-tree` **`eb150f31b`, 22 commits, porcelain 0** — the INSTRUMENTS landing stopped AT its lighting register bill (5 predicted / 5 matched; the one park-state change is a DE-park). Seal `refs/preserve/pause-instrland-2026-09-01`. RESUME: its remaining terminal-window acts → HOLD → the chair gates.
- `lanePAIDFIX-tree` **`0dac7b074`, 2 commits** — ⭐ **the culture defect is FIXED AND COMMITTED** (the campaign PDF + World Book read culture from an address nothing writes). Seal `pause-paidfix-2026-09-01`. Dirty = TWO UNTRACKED probe artifacts only (`.dormancy.mjs`, `.paidfix/`). RESUME: repairs 2–5 of 5.
- `laneGLYPH-tree` **`f09ce3ff7`, 1 commit** — ⭐⭐ **CAR B LANDED: "delete noLig()'s body — 74/25/74 non-embedded runs per dossier become 0/0/0"**. Seal `pause-glyph-2026-09-01`. Dirty = Car A's NINE staged files mid-commit (the render-level assertion + one new test file). RESUME: finish Car A (it must land GREEN after B — if it does not, STOP: B did not remove the whole population), then Car C.
- Eight further sealed tips: the four landings + `tailo-cures` `e455c3fa4` · `tailf-cures` `b441e6e58` · `phantom-cures` `c1da0ada4` · `enforcedby-car1` `ab786aaa6`. Every other dock is porcelain 0 at a sealed or branch sha.

**⛔⛔ TWO OWNER ROWS WAITING, BOTH PAID-SURFACE (full text in `825f209c…/scratchpad/TUNING-DESK.md`):** (a) **the PDF prints the WRONG LETTER, not a tofu box** (`影`→`q`, `街`→`W`, `⚠`→invisible; reachability proven; Car B's cure changes paid bytes ⇒ owner's veto, and ⭐ CHAIR-RULED: **any paid-surface byte change lands BEFORE the GOLDEN freeze**) · (b) `authSlice.js:489` skips `resolveTier` — under-grants, fails closed, but entitlement is the owner's class.

**THE ARC AFTER THE RETROVALIDATION:** finish INSTRUMENTS → the **COUPLED** FOLLOW-ONS+TAIL-O+TAIL-L consist (one gate, ≈1.5 h saved, ruled on measurement) → TAIL-F alone → the mint window → T13 (charter assembled + fidelity-clean, REC awaits the chair's signature) → GOLDEN freeze (charter assembled, gate discharged) → the walk + ONE regen (owner present) → ⛔ STOP before the terminal soak. Protocols binding: EFFICIENCY PROTOCOL II (couple on measurement · lanes DRAIN before a gate · pre-stage off the critical path) and everything in `825f209c…/scratchpad/DISPATCH-QUEUE.md`.

## (superseded) PICKUP AT §876 (2026-09-01 ~15:00 — WAR LANDED; THE SEAT IS NOW OPUS) — the §878 card above supersedes.

**Build branch `claude/composite-r4` = `3f9201e39966e94c4f4b70bad25c263daca51039` (WAR-TRUTH LANDED §876 — 14 commits, gate green FIRST RUN: ratchet 10/30,156 ceiling 10, STRICT DIST 51/433; sealed `refs/preserve/landing-WAR-2026-09-01`). Ledger through §876.5.** THREE LANDINGS THIS SITTING (§874 substrate · §875 T8 · §876 WAR), all first-or-second-run green. ⭐ WAR's probe A came back **BIT-IDENTICAL on base, picks-only AND full-consist** — the whole consist moves not one byte of any generated world.

**⭐⭐ THE SEAT IS INVERTED (§876.5, owner): EVERY LANE DISPATCHES OPUS.** The §685 marking law binds hardest now — an Opus act Fable did not architect/validate/manage lands its row in `docs/FABLE_RETROVALIDATION_QUEUE.md` IN THE SAME ACT (chair-commit.sh refuses otherwise; presence is not a row). Work Fable validated BEFORE the switch (§§873–876.4, both build charters, the five pre-board halves, the walk manifest, the tuning desk) needs NO row — state the boundary per act, never assume it. Carve-outs UNCHANGED: legal · tuning signatures · the walk's presence · deploys/pushes · the TERMINAL SOAK.

**ONE LINE TO RESUME: read §876–§876.5, then `825f209c…/scratchpad/DISPATCH-QUEUE.md`, then board HYGIENE off HYG-PREBOARD-HALF1.md's 15 one-liners.** ⭐⭐ ORDER (§874.8): **HYGIENE (next) → INSTRUMENTS → FOLLOW-ONS → TAIL-O+TAIL-L (coupled) → TAIL-F** → the mint window (L7, opens and stays open) → T13 (L8, charter ASSEMBLED, REC awaits the chair's signature) → GOLDEN freeze (L9, charter ASSEMBLED, closes the window; ⚠ EP-g2 located-or-chartered is its gate) → the walk + ONE regen (owner present) → ⛔ STOP before the terminal soak.

**EVERYTHING AHEAD IS PREPARED — nothing left is unverified paper.** Both final builds: charters assembled and FIDELITY-CHECKED (CHARTER-FIDELITY-REPORT.md: both VERBATIM-CLEAN, 0 blocking, 5 minor drifts to fix at signature; the second-hand R-FENCE-SCOPE quote settles MATCH). Every landing: a banked pre-board half-1 + a one-page half-2. The fence's scope is now exactly **{AGN@HYG · T13}** (§876.1) and T13's charter drafts its terminal re-arm to ZERO windows — the posture GOLDEN then signs forever.

**THE OWNER'S DESK (three documents, all banked):** `TUNING-DESK.md` (12/12 inputs, dependency-ordered; the §745.1-vs-§844 flag RESOLVED no-contradiction) · `WALK-MANIFEST-RECOMPILED.md` (7+1 decisions; F3 closed as already-ruled; ⚠ warMemoryEnabled must be FORCED in the preview) · the LEGAL batch (MINT-PREBOARD-HALF1.md — notices + the `three` entry + founder-transfer, one sitting, owner's pen). Plus the standing desk rows from the §875 card below.

## (superseded) PICKUP AT §875 (2026-09-01 ~05:25, ROLLING CARD — T8 · SHIFT LANDED) — the §876 card above supersedes.

**Build branch `claude/composite-r4` = `6308a27b8ad0d4679754b76245b1d340ed8c6969` (T8 LANDED §875 — 12 commits, gate green FIRST RUN: ratchet 10/30,080 ceiling 10, STRICT DIST 51/433; sealed `refs/preserve/landing-T8-2026-09-01`). Ledger through §875.2. EVERY CAR IN THE PROGRAM IS BUILT (O7 closed the track).** T8 was the arc's ONE ruled same-seed window — executed with zero residue (probes attribute 91+322 exactly; the espionage fence's golden moved ONCE under the window and its STOP re-armed scoped to T13, the LAST ruled mover). R-T8-OSR: the churn rule narrowed to the stable core via governed schema migration 14→15, reconciliation EMPTY as claimed.

**ONE LINE TO RESUME: read §875–§875.2, then `825f209c…/scratchpad/DISPATCH-QUEUE.md` (re-arm the dispatcher cron 13,43 * * * * from its protocol text), then board WAR.** ⭐⭐ LANDING ORDER (§874.8): **WAR (next) → HYGIENE → INSTRUMENTS → FOLLOW-ONS → TAIL-O → TAIL-L → TAIL-F** → residue/OSR-mint window → T13 TRANS (owner REC first) → TE-GOLDEN-1 (owner REC) → the walk + ONE regen (owner present) → ⛔ STOP before the terminal soak. WAR BOARDING = half-2's 13 one-liners (WAR-PREBOARD-HALF1.md §8) + the chair's COUNTERSIGN of the T4 mini-window rider (Q3's ruling: 2–3 NEW Opus cars + two-arm probe battery INSIDE the consist; the two-vs-three movers delta resolves explicitly) + authoritative picks `b804da4e1`+`3fba3d050` (⚠ NOT `84ae0f104` — superseded). The §824 ritual + quiet windows + the efficiency protocol (split pre-boards · pre-staged docks · verified probe-artifact reuse; probe base may reuse T8's SEALED tip artifact hash-verified) bind every landing.

**THE OWNER'S DESK (§874 card's 25 lines stand, plus):** the R-T8-OSR bug-or-truth fork (car 1's corruption-climate depth vs §858's pricing — tuning-pass input, readings named §875.1) · O5's ambient-reversal fork (§873.1) · O7's 5 unsigned prose ownerRows · J-O6-1 (does W-OPS owe a tuning-signature surface?) · the Wealthy-label probe-coverage caveat (§875) · everything else per the §874 card below.

## (superseded) PICKUP AT §874 (2026-09-01 ~02:45, ROLLING CARD — THE CHARACTER SUBSTRATE LANDED) — the §875 card above supersedes.

**Build branch `claude/composite-r4` = `59864298150dbacf30b9771bb9355fbd70ab3b88` (THE CHARACTER SUBSTRATE LANDED §874 — 54 commits, gate 6 first: ratchet 10/30,072 ceiling 10, STRICT DIST 51/433, sealed `refs/preserve/landing-SUB-2026-09-01`). Ledger through §874.8.** The owner's cure+ratify executed (closure 1,047,000, measured 1,046,369); ⭐ J-W6-3: the transfer-ceiling raise measured then REFUSED — the signed proportional raise stays BANKED, applicable without a new ask if a future consist reds (§874.1, vetoable). Memory FOLD 25 executed (index 15,113 B, checks a–f green).

**ONE LINE TO RESUME: read the §874 set in the ledger tail, then `825f209c…/scratchpad/DISPATCH-QUEUE.md` (re-arm the dispatcher cron 13,43 * * * * from its protocol text — it dies with each session), then drive the landing track.** ⭐⭐ **LANDING ORDER RULED (§874.8): T8 → WAR → HYGIENE → INSTRUMENTS → FOLLOW-ONS → tail chains TAIL-O → TAIL-L → TAIL-F** (TAIL-F twice-gated; O5-D's known-red row rides TAIL-O; MAT gated on its dist re-measure, red ~5× today). Then: residue/OSR-mint window → T13 TRANS (owner REC first) → TE-GOLDEN-1 (owner REC) → the walk + ONE regen (owner present) → ⛔ STOP — the terminal soak is the OWNER'S. Every landing keeps the §824 ritual + THE QUIET WINDOW (suspend lane messages + 180s settle + disk sweep + guard lines; gate-mutex SHARED tier only for capped targeted runs).

**LIVE LANES at the card:** O6 (Fable seat per the packet row — catalog registers for the pen; laneO6-tree @ `ba5ef0f5e`) · T8 pre-board verification (read-only, Fable — re-proving the plan at the real tip; report to T8-PREBOARD-REPORT.md). **HOLDING:** O5 `ba5ef0f5e` (§873.1 — the ambient-reversal fork on the desk) · the tail cars O3 `6714f754a` · O4 `3fbfb5733` · F5c `e0b4c371b` · F6c `65d2e9ade` · F7c `eabae6920` (FAITH 7/7) · L8 `a16a8bb9b`. **UNBUILT:** O7 only (Fable, on O6's hold). All five landing packs + seven skeptic-amended plans + WALK-PROTOCOL + the T13/TE-GOLDEN draft volumes sit in `825f209c…/scratchpad/`.

**THE OWNER'S DESK (consolidated at §874 from the §873 compile — sources in 873-MATERIALS.md §5):** (1) registers-pack rows 13(a)(b) + Register VII values · (2) §856 non-overlap GRAIN — choosing the grain IS the ruling (GMIG made that explicit) · (3) the three §857 legal surfaces (LEGAL carve-out) · (4) migration `200_deity_authored_character.sql` — written, rehearsed [200,200], DEPLOYMENT the owner's manual act · (5) T4 STOP-discriminator veto check · (6) god_fortunes: MEASURED — verdict DEFAULT-ON (DATA-GATED) adopted §874.8, pack rows landed · (7) Q-M7 at the walk · (8) the §838/§827/§835/§839/§859/§865/§826/§817-Q6/§825 rows unchanged · (9–13) walk-hosted: Q-S3 lighting · F1 regen placement · F2 walk-found fixes · F3 map-leg re-rule · Q8 CARTOGRAPHER tier · (14–15) MAT lighting (dial→v2 + the three persistence paths) + the F2c adoption crossing · (16) TE-GROWTH-MIG ruled OWNER'S WORK on three grounds (persisted shape · lit-surface shift · dissolves §867's grain row); blocker half discharged by this CAS · (17) the tags[3] positional-tag adapter join · (18) DEVOTION taste row 4 re-priced (two LIVE sources) · (19) npc.character's WRITER (persistence-shape) · (20) riskRegister's third absence (RISK_TERMS widening) · (21) the observed-shape fifth door · (22) T13 TRANS REC (the LAST same-seed mover) · (23) REC-GOLDEN-1 · (24) FOLLOWLAND Q2 (engine budget re-ratification if red at re-measure) · (25) FOLLOWLAND Q4 (L7 seat-vs-packet record) · NEW: O5's ambient-reversal fork (§873.1 — costs nothing unsigned).

## (superseded) PICKUP AT §873 (2026-09-01 ~00:30, WINDOW-CLOSE CARD) — the §874 card above supersedes.

**ONE LINE TO RESUME: read §873 in the ledger tail, then `825f209c…/scratchpad/DISPATCH-QUEUE.md` (the owner-ordered auto-dispatcher's queue — re-arm its cron from the protocol text in that file), then act on §873's three per-lane marks in order.** Branch `claude/composite-r4` = `853e0e9ba` (SMALLS §872); **the SUBSTRATE landing sits at 49 commits, ONE act from its gate** (laneSUB-tree @ `806b514c8`, porcelain 4 = wave 6's REC-1 cure mid-flight, owner-ratified cure+ratify ruling in §873); the faith build line is COMPLETE 7/7; O6/O7 are the only unbuilt cars; every landing to the stop line has a skeptic-amended plan AND a boarding pack; the close's two trains (T13, TE-GOLDEN) hold their drafted volumes awaiting panels. THE STOP LINE: everything up to, NOT including, the terminal soak. The full §872-era protocol block below still binds (quiet windows, seats, the packet-row law, disk hygiene).

## (superseded) PICKUP AT §872 (2026-08-31 ~16:35, ROLLING CARD) — the §873 card above supersedes.

**Build branch `claude/composite-r4` = `853e0e9ba4aa1f6df5703082a8fcbc11208819d5` (THE SMALLS LANDED §872 — first-run green gate, ratchet 10/29,377 — after TE-DENSITY-1 LANDED §871 at `a107bcde3`, nine bills, nine gates). Ledger through §872.1.** TWO landings this sitting, both quiet-window gates; the owner ratified the two dist-budget raises in-session (closure 1,042,000 · engine 676,000).

**LIVE LANES:** D4 (both builds written, finishing convictions/probes/commit at base `a107bcde3` — does NOT rebase, the landing re-derives) · F4c (trim → bundles → act-3 commit → census bill). **HOLDING COMPLETE, landing order:** THE CHARACTER SUBSTRATE (L1-stack `14bbcbc5f` + L2-stack `2e4fc0ea0` + O1 `4e918ab5e` — NEXT, takes the gate slot; ⚠ owes the W-OPS acceptance-seam wiring reconcile per §872.1's diamond finding, and the two stacks' mirrored vocabularies reconcile HERE) → T8 `0999f8059` (+§860 routing act) → T4 `9cab53af8` → TE-VIRT-1 `038311ed2` → TE-AGNOSTIC-1 `7d4cb16ea` → TE-CEIL `64a4be807` → TE-INSTR-1 `15fefc765` → INSTR-2 `aa5d54008` (⚠ lands AFTER INSTR-1 — its deferred de-park depends on INSTR-1's R3) → W-MEM `3fba3d050` → SP-W2 `b46167c47` (its SP-W1 picks drop-as-empty) → O2 `a1981ab96` (or with the substrate coupling if the chair rules it) → D4/F4c as they finish.

**⭐⭐ STANDING OWNER DIRECTIVES OF THIS SITTING (§871.2):** run UP TO FOUR lanes filled wherever appropriate · a 30-min stall/occupancy heartbeat (⚠ SESSION-LOCAL cron 13,43 * * * * — dies with the session; SUCCESSOR RE-ARMS IT) · Fable manages/architects/validates, Opus implements/verifies, §787 fit-crossover both ways · ALL decisions delegated to the chair's judgment (by-nature carve-outs: legal, cull, tuning signatures, pushes) · **CONTINUE THROUGH EVERYTHING UP TO — NOT INCLUDING — THE TERMINAL SOAK** (walk + ONE regen precede it; tuning last). ⭐⭐ **A GATE WINDOW IS A QUIET WINDOW** (§871.1): before ANY landing gate, message every live lane to suspend heavy execution, sleep 180s, record load/disk guard lines in the gate log; release on the verdict. The mutex fences vitest-vs-vitest ONLY.

**HOLDING COMPLETE, landing order (§863 as amended §871.2):** THE SMALLS (RESIDUE-2 `4b937c662` + SP-W1 `b61a6585` + VOICE-1b, one landing — NEXT, takes the gate slot) → **THE CHARACTER SUBSTRATE** (L1-stack `14bbcbc5f` + L2-stack `2e4fc0ea0` + O1 `4e918ab5e` — ⚠ the two stacks are on DIVERGENT LINES whose mirrored vocabularies reconcile ONLY at this coupling; L6's pack refresh measured it; a declared mirror is NOT a cross-check) → T8 `0999f8059` (+its §860 routing act) → T4 `9cab53af8` (⭐ its STOP-discriminator call = the owner's veto check) → TE-VIRT-1 `038311ed2` (wall 800→282, doors homed; ⚠ W-LIVES door has TWO SPELLINGS — the door lane reconciles) → TE-AGNOSTIC-1 `7d4cb16ea` (305 golden rows under two shift records) → TE-CEIL `64a4be807` → TE-INSTR-1 `15fefc765` — each landing per the §824 ritual + the quiet window.

**LIVE LANES:** W-MEM-P1/P2 (P1 `b804da4e1` landed; P2 staged — loserDied was a DOUBLE reader-without-writer; FOUR discard sites, one funnel) · F4c (on the F-stack) · O2 (on the L-stack, sibling of nothing now — L6 was a document car, its pack landed §871.2) · SP-W2 · INSTR-2 (the --update tool hardening + the parked-suite gap). **D4 dispatches onto `a107bcde3` at the next free slot** (D3's pin is on the branch; + the §865 demote repair).

**THE OWNER'S DESK:** the pack rows 13(a)(b) + Register VII values (the pack is now the L6-refreshed 623-line edition at docs/briefs/W-REGISTERS-PACK.md — ⭐ its most expensive row is §856's non-overlap GRAIN, row 15, which silences corruption_exposed) · the THREE §857 legal surfaces (the class-name count was over-stated; one construction existed, cured) · F1c's migration `200_deity_authored_character.sql` · T4's STOP-discriminator veto check · the god_fortunes two-census lighting hole · Q-M7 · the §838/§827/§835/§839/§859/§865 rows unchanged.

**Chartered, ready when slots free:** the remaining W-cars (L7-L8 · O3-O7 · F5c-F7c) · TE-GROWTH-MIG · TE-RATCHET-MAG · the §866 materialization charter (four categories never reach settlements — generation-side) · then T13 TRANS → TE-GOLDEN-1 → residue/OSR-mint/parity → the walk + ONE regen → **STOP (the terminal soak is the owner's, tuning last: the 300y runaway + the map leg are its inputs)**. Account-switch protocol per §869 unchanged: survey every lane (HEAD+porcelain+receipt, 529 law) before trusting anything; resume landings first; ⚠ re-arm the heartbeat; the memory index is OVER its 17KB ceiling — FOLD before appending, never trim.

## (superseded) PICKUP AT §869 (2026-08-31 ~10:30, ROLLING CARD — the account-switch card this sitting resumed from)

**Build branch `claude/composite-r4` = `1d27accdc` (T12 · WAR-MEMORY LANDED §868 — the wars are remembered; the virtual-flag file sits at 800 EXACT with SEAT-A2's `subsystemRowsSeat.js` as TE-VIRT-1's worked pattern). Ledger through §868.** EIGHT trains landed this era: T10 · T2 · T7 · T6 · T9 · T11 · SEAT-A2 (§864) · T12 (§868).

**⚠⚠ §870 SUPERSEDES THE LIVE BLOCK BELOW — the switch happened mid-flight; read §870's per-lane marks FIRST (DENS rebased+billed, needs its gate · T4 terminal-frozen, needs HOLD verify · L5 four cars + a DIRTY register mid-bill · F3c complete, needs its receipt check).** **LIVE (4/4): the DENSITY CONSIST LANDING** (D1+D2+D2b+D2c+D3 board one gate — laneDENS-tree `c283df0c4` → rebase onto `1d27accdc`; the three probes re-earn; the v2 world-version gate; the leaderless mint stays OUT per §827/§837, its `interregnumSinceTick` seam standing; on its CAS **TE-VIRT-1 DISPATCHES** — the flag-file decomposition, three doors queued behind it, the seat-leaf pattern in hand) · **T4 · SEAT-B** building (laneT4-tree; SEAT-2b ATTEMPT/AFTERMATH + dark upheaval machinery; ceiling-blocked terms seam-named) · **W-LIVES L5** building (stacked laneL2-tree on `80cd4a2a5` = L2+L3+L4: chokepoint re-routes w/ deity true-sight pinned, rule-tree→weighted-branch, vetting input, DUAL-threshold corruption depth gate defaulting safer till pack row 13(a) signs, the R6 risk register, the F10 alignment census; npcAgency 830/830 zero-net-lines law) · **W-FAITH F3c** building (stacked laneL1-tree on `1a045a704` = L1+F1c+F2c: the §866 EMBED CARRY atomic across all four writers, the field kernel + caps + ONE magic gate as a witness-plane source under amended F9, the 'peaceful' cure, the §851 one-arm-per-deity assertion).

**THE CONSIST MANIFEST (§863) after density: THE SMALLS** (RESIDUE-2 `4b937c662` + SP-W1 `b61a6585` + VOICE-1b, cherry-picked into one landing) → **THE CHARACTER SUBSTRATE** (L1-stack + L2-stack + O1 `4e918ab5e` — the reconcile pins go live at the coupling) → **T8** (`0999f8059` + its §860 OSR ROUTING act: re-derive at the tip, per-row route — sibling-observed→family filter · conditionally-written→M8/M9 naming each writer · components→CR-OSR-FREEZE-7 with the chair answering; proseNumerics no-hand-merge law) → T4/L5/F3c as they finish. Each landing: §824 ritual verbatim (either-side census + regenerate w/ predicted tuple · the SEVEN tree-scanners · coupling rows file LAST and owe all three suites · receiptFields name PERSISTED state · prose humanized never banked · bundle five-in-one-window w/ input-count predictions · pid/cwd/porcelain gate identity block · chair verifies own-reads then CAS).

**Chartered, ready when slots free:** TE-VIRT-1 (on density's CAS — BLOCKING three doors: characterDrift, missionDispatcher, +next) · D4 (+the §865 DEMOTE REPAIR: `transferRulingPower` cannot demote — transfer and coup byte-identical today; the owner's §810.8 verbatim is the direction; D3's positive-roster pin is the go-signal) · W-LIVES L6-L8 · W-OPS O2-O7 (O2 needs L5's register) · F4c-F7c (F4c unblocked by §851 precedence; F7c inherits the retired-field display readers) · TE-GROWTH-MIG · TE-CEIL (settlementStrategy 812 · applyWorldPulse 941) · TE-AGNOSTIC-1 (the §857 D&D-tell wave, guard-safe, before TE-GOLDEN-1) · TE-RATCHET-MAG · SP-W2 · W-MEM-P1/P2 · instrument repairs (§866's vacuous inertness proof; §854's tokenizer/bang rows ride T5-regen) · then T13 TRANS → TE-GOLDEN-1 → residue/OSR-mint/parity → the owner's four doors (walkthrough · ultra · tuning signatures · SOAK).

**THE OWNER'S DESK (§§ verbatim in the ledger):** the §838 seal veto (stands unless vetoed) · §827 leaderless word (CATALOG plane only per §837) · §835 shrine golden row · §839 Surveyor/WEB-9a ruling · §857 trademark/marketing rows (LEGAL carve-out: the SEO "D&D" line, "Dungeon Masters", "PCs") · §859 allowlist row 15 (map-adjacency) · §865 demote repair (their §810.8 made literal) · Q-M7 · F1c's written-not-deployed migration `200_deity_authored_character.sql` + manifestVersion · **the REGISTERS PACK** (docs/briefs/W-REGISTERS-PACK.md): the chart (L1's measured corrections in place), row 13(a)(b) joined calls, the §867 SIX-PERCENT stability margin (faint's clamp is load-bearing; one rung softer saturates), the §864-era glyph-variety lever, Register VII values at tune.

**Account-switch protocol (§869, the owner's standing pattern):** at usage max the owner switches accounts; the successor reads THIS card → docs/START_HERE.md → the ledger tail; surveys every live lane per the 529 law (worktree HEAD + porcelain + receipt before trusting anything); resumes landings first, builds second; the chair-commit script + SP env are in the card's own §-era entries; seats: Fable architects/manages · Opus implements — model-agnostic if the account lacks a tier (§685 marking binds).

## PICKUP AT §832 (2026-08-31, ACCOUNT-RETURN — all four §831 items RESUMED on live lanes) — START HERE; supersedes every card below.

**Build branch `claude/composite-r4` = `fa7e95f2a` (T10 LANDED §835 — price heuristics live; the 25-row golden shift re-recorded under §830's ruling); ledger through §835.** T2 · COIN'S LANDING is now IN FLIGHT (dock d5ff03063 → rebase onto fa7e95f2a; 4th car stays unshipped). The §831 survey is DONE and every item is LIVE again: **T10-land** resuming the §830-ruled golden re-record (25 hash lines exactly, SHIFT RECORD, then GATE 3, then HOLD for chair CAS) · **SEAT-A2** continuing SEAT-2c→3→4 on §823's denominators · **D2b** dispositioning the four dirty files first (529-law), then rebase onto `19a8c9197` + the three re-earned dormancy probes · **the W-MEM fold LANDED (§833)** — docs/DESIGN_W_MEM.md IS now the panel-hardened volume (61/61 findings dispositioned; build T12 from it and no other; Q-M7 is an OWNER row — re-darkened worlds keep war records; heraldIndex readableBy docketed PLAUSIBLE as its own car; the size cadence is a soak input). The 30-min heartbeat is armed (13,43 * * * *: stalls · saturation · chair triggers). On T10's HOLD: chair-verify (TRUE_EXIT + porcelain yourself) → CAS `19a8c9197` → its tip → §-row → **T2 releases** → T7 (⭐ releases W-LIVES 1–2 per docs/briefs/W-TRAIN-PACKETS.md) → T6 → T9 (+held clause-4 patch AT the landing) → T11 → SEAT/DENSITY trains as they complete. Landing ritual per the §824 rhythm (explicit-sha rebase · register-path census · ONE gate · chair-verify · CAS · §-row · card rewrite). Owner rows open: unchanged from the §831 card below (Q-S3 · §807/§815 persistence · the v1 importance fork REC · Q-M1..Q-M7 reshaping under the fold · Register VII values + densityRungRole at tune · §817-Q6 · the §825 notices batch) + the W-REGISTERS-PACK for the pen.

## (superseded) PICKUP AT §831 (2026-08-31, ROLLING WINDOW-SAFE CHECKPOINT)

**Build branch `claude/composite-r4` = `19a8c9197`** (T5 §821 + TE-MINT-1 §825: the dead `three` dropped under schema-13). **Ledger through §830.** ⚠ FOUR WORK ITEMS WERE LIVE — 529-law on every one (SURVEY worktree HEAD + `git status` FIRST; superseded-sha law; receipts in `5a850cca…/scratchpad/`):
1. **T10 · LANDING, MID-FLIGHT** in `825f209c…/scratchpad/laneT10-tree` (rebased tip `65df4dbd6` + cure commit `b6090c98c`; receipt `laneT10LAND-receipt.md`). Gate 1 red → 8 cured at cause; the 9th RULED §830: the 25/525 golden drift is the train's own DECLARED shift (wrong coverage note corrected in the record) → the lane re-records via `UPDATE_GOLDEN=1` ritual + path-template census + SHIFT RECORD in the test header, then GATE 3, then HOLD. If killed mid-re-record: the golden manifest writes sorted keys — verify the diff is EXACTLY 25 hash lines before trusting any partial state; if killed mid-gate: stale mutex lock possible, check the lock dir. On green: chair-verify (TRUE_EXIT + post-gate porcelain YOURSELF) → CAS `19a8c9197` → its tip → §-row → **T2 · COIN releases next** (`d5ff03063` in laneQSTYLE-tree dock, receipt `laneT2-receipt.md` + `receipts-t2/`; its 4th car deliberately unshipped w/ saved diff).
2. **SEAT-A2** in `laneST2-tree` (stacked on SEAT-1 `4e124fcdb`; SEAT-2a/2b/2c→3→4 on §823's measured denominators; warTermination.js:380-390's silent renormalizer cured FIRST; receipt `laneSEATA2-receipt.md`; predecessor's `laneSEATA-receipt.md` holds the censuses).
3. **D2b · density live half** in `laneDENS-tree` (stacked on D2 `e6c3d786d`; first acts = rebase onto `19a8c9197` + `npm ci` + re-earn the THREE dormancy probes; §827 rulings: the leaderless stressor MINTED under the v2 gate · STATE-NEVER-FATE binds dissolution · R20 walker v2-scoped; receipts `laneD1/D2/D2b-receipt.md`).
4. **W-MEM FOLD** (design, no code): the panel REFUTED the volume 5/5 with 40 MAJORS (§829); the author folds AMENDMENT A1 + in-place rewrites into `5a850cca…/scratchpad/DESIGN_W_MEM.md` from `wmem-panel-report{1..5}.json` (chair-verified anchors in §829: dismissal-trap inversion · RESIDUE_STRIP_SITES registry · two unfillable fields · the deny-census walker · the 40× size error · the 5-of-7 recall census). The landed `docs/DESIGN_W_MEM.md` on the ledger is the PRE-PANEL version — do not build from it; the amended volume lands only after chair spot-verification.

**LANDING QUEUE: T10 (in flight) → T2 → T7 `8ce2071d1` (⭐ releases W-LIVES 1–2) → T6 `245b50505` → T9 `ec16cfbbc` (+ its held clause-4 patch, executed AT the landing) → T11 `b64dd5fdf` → SEAT/DENSITY trains as they complete.** Landing ritual per card §824 (explicit-sha rebase · register-path census, take-either-side-then-regenerate; edge bundles re-derived never merged · ONE gate · chair-verify · CAS · §-row · handoff rewrite). Successor first acts: re-arm the 30-min stall wakeup · survey all four items · resume in the order T10 → the closest-to-done. W-train triggers per `docs/briefs/W-TRAIN-PACKETS.md`; T4 SEAT-B after SEAT-A lands; D3/D4 after D2b; T8/T13 per §773.1 (T13 LAST). Owner rows open: Q-S3 lighting at the walk (§820 cost sentence) · the §807/§815 persistence items (§826) · the v1 importance fork REC (§827: leave the read path alone) · Q-M1..Q-M7 (reshaping under the fold) · Register VII values + `densityRungRole` at tune · §817-Q6 (denominator now 360, five-fold polymorphic) · the notices batch (§825). Seats: Fable architects/manages · Opus implements; model-agnostic. Memory index + scratchpads survive the account switch; the successor needs one line: "Read docs/HANDOFF_CURRENT.md — start at the top card."

## ⭐⭐⭐⭐ PICKUP AT §816 (2026-08-30/31, THE FOUR-LANE RESUMPTION) — START HERE; supersedes §812's card except its design-sitting reading order.

**Build branch `claude/composite-r4` = `b85044099` (unchanged).** The §812 window-death is SURVEYED and every lane re-dispatched (§816): **T5-CURE** curing the 14 enumerated landing reds at `f7abfea3e` in laneCAP-tree and re-running the ONE gate (it owns the slot; red log = `/var/folders/0l/_sz6gzvd11x6sthjy1jdj0_80000gp/T/gate-tail.14051.log`) · **T9-RESUME** finishing car 4 from the six surveyed dirty files in laneT9-tree (lighting census OWED at its tip) · **DENSITY-REPORT** writing R-DENSITY-CENSUS.md from the salvaged harvest (`825f209c…/scratchpad/dens-census-*.{jsonl,json,mjs}`) · **T11-UI** building fresh from §§805/807/815 in laneT11-tree. Receipts land in the `5a850cca…/scratchpad/` (T5CURE/T11/R-DENSITY) and `825f209c…/scratchpad/` (T9, appended). On T5's green: chair-verify (gate log TRUE_EXIT + post-gate porcelain YOURSELF) → CAS `b85044099` → its tip → **TE-MINT-1** (chair act; re-read ODQ §§784–794 for its spec: owed digest + strip-train package.json row + EFF-1's refreeze row + `three` dep verification) → T10 `f414d74bf` → T2 `d5ff03063` → T7 `8ce2071d1` → T6 `245b50505`, each per §784.1 explicit-sha order + register-path census + ONE gate. W-train triggers per `docs/briefs/W-TRAIN-PACKETS.md`. The §812 card's design-sitting reading order still binds for any character/faith/ops/density work.

## ⭐⭐⭐⭐ PICKUP AT §812 (2026-08-30 ~late, WINDOW-CLOSE CHECKPOINT) — START HERE; supersedes everything below.

**Build branch `claude/composite-r4` = `b8504409937f968a04a1baa7f10843969ebc8d33`** (unchanged since §799's EFF-1 CAS). **Ledger through §812.** ⚠ THE OWNER'S 5-HOUR WINDOW MAY HAVE CLOSED MID-FLIGHT — two agents were LIVE at checkpoint and may have died with partial state (§529 law: SURVEY BEFORE RESUME, never assume): **(1) the T5 · GENESIS LANDING lane** in `…/825f209c…/scratchpad/laneCAP-tree` (was HEAD `c4ee613bf`, ordered: rebase --onto `b85044099`, census via the REGISTER path with refreeze id `T5-landing`, the §808 DECLARED_OVERRUNS line, ONE bare gate w/ §785.5 priority, HOLD for chair CAS) — it may sit MID-REBASE with conflicts: `git -C laneCAP-tree status` FIRST; a rebase-in-progress can be continued (preferred — completed resolutions survive) or aborted back to the sealed lane HEAD (loses resolution work only); **(2) the T9 · GUARDS build lane** in `laneT9-tree` (self-docking at `b85044099`; checkpoint law = 30-min commits + `laneT9-receipt.md`; it holds the E0 relay). **BUILT AND HOLDING for landings, in queue order: T5 (above) → T10 `f414d74bf` (laneT10-tree) → T2 `d5ff03063` (laneT2/QSTYLE dock — receipt laneT2-receipt.md; its 4th car DELIBERATELY unshipped w/ saved diff + named experiment) → T7 `8ce2071d1` (laneT7-tree, 3 declared shifts recorded in-tree) → T6 `245b50505` (laneNET1-tree, in-lane gate green at its own base `ecc6def3e`; re-proves at rebase).** Each landing: §784.1 explicit-sha order, register-path census, ONE gate, chair-verify, CAS, collection. **TE-MINT-1 fires after T5's CAS** (chair act — RE-READ its spec from ODQ §§784–794 first: owed digest + strip-train package.json row + EFF-1's refreeze row + `three` dep verification). ⛔ **E0 HAZARD (§811): the gate mutex is NOT mutual across bases** — LOCK_DIR default moved in `d7ec3885d`; old-base lanes take a DIFFERENT lock on macOS; mitigation `export GATE_MUTEX_LOCK_DIR=${TMPDIR:-/tmp}/settlementforge-vitest-gate.lock`; structural cure = T9 candidate car.

**THE DESIGN SITTING §§797–811 IS THE ERA'S HEADLINE — READ BEFORE ANY CHARACTER/FAITH/OPS/DENSITY WORK:** three volumes (`docs/DESIGN_W_LIVES.md` — paradigm axes, drift, planes, praxis, known character, risk register, §14 coherence audit, §15 PANEL FOLD which OUTRANKS earlier sections · `docs/DESIGN_W_FAITH.md` amended · `docs/DESIGN_W_OPS.md` + its §8b panel fold) + `docs/briefs/W-REGISTERS-PACK.md` (SEVEN registers incl. the §810–§810.3 DENSITY LADDER: mass-then-dispersal rolls, rung vacancies, believability envelopes, the SEAT FLOOR hard gate w/ typed missing-seat stressor exception). Skeptic panel DISCHARGED (§806, 15 findings folded). **NEXT CHAIR ACTS in order: T5 verify+CAS → TE-MINT-1 → T10/T2/T7/T6 landings → W-train dispatch packets (unblocked by §806) → TE-DENSITY-1 charter.** Owner's pen owed: the pack (chart, row 13's joined novice-corner+depth calls, ladder values at tune). Owner directives §805 (war/faith world tabs) + §807 (gallery campaign view) are chartered UI-train cars.

## (superseded) PICKUP AT §799 (2026-08-30, TE-EFF-1 CAS + W-FAITH VOLUME)

**Build branch `claude/composite-r4` = `b8504409937f968a04a1baa7f10843969ebc8d33`** — **TE-EFF-1 LANDED** (nine commits, chair-verified with own reads: HEAD/porcelain/branch/ancestry + the census register read at HEAD; lane gate `[gate-tail] exit: 0` + `GATE_TRUE_EXIT=0`, test-ratchet **10/28,685 ceiling 10**, STRICT DIST OK, post-gate porcelain EMPTY). The efficiency instruments are ON the branch: **the gate mutex's SHARED tier** (consumed-never-inherited — an exported tier no longer descends into nested calls) · **the lighting census is a REGISTER** at `tests/lint/.lighting-census-baseline.json` (tuple **2430/367/2063/20666/5695** measured at the rebase, provenance + the one-command refreeze: `LIGHTING_CENSUS_REFREEZE=<id> LIGHTING_CENSUS_NOTE=<why> npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js` — refuses a dirty tree, exits non-zero BY DESIGN, re-run plain for the green) · **the lane dock ritual has a TRACKED home** (`docs/LANE_LAW_ADDENDUM_EFF1.md`) · the base-state capsule reads the census via the register path. ⚠ Lane-minted laws: a control that doesn't convict is a finding about the CONTROL (C2-weak passed because the two mutex barriers are genuinely independent) · `ls -t` on gate logs can hand you ANOTHER lane's log — resolve identity by pid cwd. ⚠ Emergent, recorded: `npm run check` acquires the mutex TWICE (test:ratchet, verify:dist) releasing between — a full gate can lose the slot mid-chain (efficiency-program row).

**NEXT ACTS (chair, in order): TE-MINT-1 is UNBLOCKED** (trigger = EFF-1's CAS, now satisfied): the owed digest + the strip-train package.json row + EFF-1's refreeze row + the `three` dependency verification — one governed mint act. Then **§794.2(d)** at THIS tip before T5 lands: verify/attribute the transcendental census 50/33-vs-frozen-48/31 with the chair's own run (`bandedStock.js:125` + `dispositionLedger.js:468`; detPow is the ready cure; §797.5 noted the sites are the SP-family's own hand-rolled pow — attribution hypothesis, not yet executed proof). **Landing queue: T5 (Genesis, HEAD `c4ee613bf`) → T10 (HEAD `f414d74bf`) → T6/T2/T7 in completion order** — each rebases onto `b85044099`+ (landing orders name the CODE-BRANCH sha explicitly, §784.1), census re-derived through the NEW register path.

**W-FAITH IS ARCHITECTED (§798, `docs/DESIGN_W_FAITH.md`) AND WIDENED BY THE §§800–800.5 DESIGN SITTING INTO W-LIVES (§801, `docs/DESIGN_W_LIVES.md` — READ IT BEFORE TOUCHING ANY CHARACTER/FAITH WORK):** the owner ruled the full lived-experience + paradigm-chart architecture in five verbatim addenda — prewritten virtue↔vice PARADIGM AXES with leveled signed positions (no-same-axis is arithmetic); FULL paradigm for every NPC and god, byte-sparse (absent = neutral = zero bytes), TOP-3 read display with the new DISPLACEMENT receipt; three experience planes (PERSONAL > AFFILIATION > WITNESS, closest-plane-wins) fed only by ALREADY-RECEIPTED sources (source qualification law); belief gates the witness plane; character steers goals + the ONE vetting reader; corruption eligibility reads BANDED DEPTH (load-bearing); gods sit on the same chart IMMUTABLY (no drift state exists for deities), same level words, rank carries potency; edit view renders the WHOLE chart with a read-only drift GHOST beside the authored core. W-FAITH's D2 superseded, D5/D6 reshaped (banners in the file); D1/D3/D4 stand, the faith field registers as a witness-plane source. **W-LIVES cars 1–2 land BEFORE W-FAITH's field car; both after T7; skeptic panel before car 1.** Owner's pen owed: the axis catalog (§1.1's candidate register, five orphan mints), level words, the experience table. Recon rows that are LANDING PRECONDITIONS: npc uid stability across regen/undo/import; the NPC edit surface. §797.5 stands: drift = bandedStock/dispositionLedger instantiations, the authored core immutable (nothing writes `personality.*` — grep-verified).

## (superseded) PICKUP AT §756 (2026-08-30 ~01:15 CDT)

⛔ **OWNER COURSE-CORRECTION (§756.1): LANE CONCURRENCY IS CAPPED at TWO live build lanes — one landing while at most one builds — until the owner widens it.** §755.3's three-lane dispatch was stood down pre-commit (worktrees clean at base, pruned; NOTHING lost); the mechanism: build lanes serialize on the one vitest mutex and gate arms are load-sensitive (§753.2a). ⛔ CONCURRENCY (§756.5 counting rule + §757 owner ruling): **UP TO FOUR live lanes/agents total — and EVERYTHING counts** (build lanes, recon readers, lanes' own sub-agents; fan-out beyond a lane's slot needs an explicit chair grant in its brief). One landing/gate at a time, unchanged. **Build branch `claude/composite-r4` = `c7bdad5eb`** — **CAP LANDED** (§760: six commits, census 2483/364/2119/20838/5775 at walker :6815, ratchet 11/28,815 ceiling 11, the one-leaf dormancy claim re-proven vs the CURRENT base, and the three prior waves proven to have moved ZERO spatial-digest bytes). The capture layer (flux · grid bridge · climate truth · lake typology) is ON the branch. **The generation assessment is COLLECTED (§759, `docs/recon/R-GEN-ASSESSMENT.md`)** — ⛔ its PACT-STRENGTH-ZERO production defect + TE-UNITS-1 + the 49 cross-engine transcendental sites + the soak's substrate blindness are DOCKETED, owner-visible. **TE-NAME LANDED (§761)** — build branch `claude/composite-r4` = **`518c40880`**: wars and roads have render-time NAMES (sorted-pair + typed-casus key, post-war graceful), armies have contingent MUSTER ROLLS, engagements have place-honest tellings; census **2486/364/2122/20899/5787** at walker :6838; prose-numerics 408/408 (the Herald law honored at birth); the gate convicted a VACUOUS TEST in the lane's own new code (§761.3 — the reader-with-no-writer ratchet right twice). ⭐ `intervention_clash` already carries its place ⇒ **the shrunken Q-W4 ask covers `field_battle` alone.** ⛔⛔ **§766 — REBUILD-OVER-PRESERVE (owner):** when something can be BUILT BETTER, always choose the better construction over preserving what's safely green — risk accepted, fallout absorbed by the machinery (byte-identity goldens for behavior-preserving rebuilds, SHIFT RECORDs for behavior-moving ones, the gate for the rest). Applies to architecture, code, and experience alike, pre-launch. Conversions §766.2: **TE-NPCGEN-1** (the frozen 1,690-line relic decomposed/renamed, byte-identical goldens; + the shared toggle reader + the reroll-linkage unification) · strict-mode-in-prod evaluation rides TE-GUARDS-1 · **TE-KERNEL-1** (generateSeed hardening + the six-fnv1a32 consolidation). Relayed to all four live lanes.

⛔⛔ **§764 — THE COMPLETENESS LAW (owner, ratified in their own words):** build completely and carefully, NEVER cut corners for launch gating; **nothing emergent defers past launch — the SOLE exception is the settlement-layer map module(s) (§724/§739)**. Consequence §764.2: the accepted holes CONVERTED to chartered waves — TE-TRANS-1 (the 49 cross-engine float sites → zero, arch-first, LAST same-seed-moving wave) · TE-GOLDEN-1 (corpus widened + bit-level dormancy comparator + lit-coverage closure; freezes AFTER TRANS) · TE-GUARDS-1 (ENFORCER_DIRS + seam-contract plants + instantWorld under scopes) · TE-CONTENT-1/2 (register sweep; nameplate widening) · the sea_battle pool · W-MEM (durable concluded-wars ledger, arch-first) · the versioned-key cure rides TE-UNITS-1. Arc order: §764.3 (TRANS before GOLDEN, both before the soak; deferral ledgers swept at residue — every launch-path row becomes a QUEUE row).

⛔⛔ **§763 — THE OMNIBUS GRANT: the owner ruled "Run it all… I give them freely… Go all the way to the soak."** Every open decision is now the CHAIR'S to rule at dispatch (each recorded vetoably in §763.2+); by-nature carve-outs stand (push/deploy · the ULTRA keystroke · legal · tuning signature). RULED already: **Q-STYLE = ARM 2** · **Q10** (treasuryEnabled lit in the three presets only after W-COIN-2's chip; virtual till then) · **Q11 ratified** (RULING_POWERS-derived) · **Herald counts boundary** (honest counts stay) · **Q-W4-shrunk GRANTED** · **§759 fixes authorized as declared shifts**. **Live (4/4): TE-NET-1** (build+gate, lands first) · **TE-QSTYLE** (ARM 2 wave, builds, lands second) · **W-COIN-1a/1b** (the treasury — dispatched THE HOUR Q10/Q11 arrived; builds, lands third) · the §739.2-residue scout. **The arc to the soak is §763.3** — next after these: TE-HERALD-1 → STRIP-4 → TE-UNITS-1 → POLIS-2+ST-3 → VAR → W-COIN-2..4 → smalls+MF → STRIP-6 → UI block → W-SEAT → gated-WEAVE remainder → residue → OSR mint → parity → [ULTRA, owner keystroke, flagged] → walk + ONE regen → **TERMINAL SOAK** (soak fixture must seed a substrate first, §759.4). Build branch `claude/composite-r4` = **`f49e83ac3`** (STRIP-2/ST-2/STRIP-5 all landed, §753–§755). **Three orphaned NAME-lane recons preserved** (§756.3/.4): `docs/recon/R-NAME3-ENGAGEMENT-RECON.md` (⭐ premise refuted — the Q-W4 ask shrinks to persisting `region` as a settlement id) · `R-NAME4-FORCE-RECON.md` (six-facet law; no unit vocab exists; marine has no record signal) · `R-NAME1-ANCHOR-RECON.md` (⭐ NO durable post-war record exists — Remembrance-grade war ledger flagged to the owner's desk; routes have the perfect `_userRoutes` anchor; six fnv1a32 copies = structural-prevention candidate). Open owner gates unchanged: **Q-STYLE** (gates STRIP-4) · **Q10/Q11** (treasury, technically ready) · the Herald counts boundary (§754.3, TE-HERALD-1 ready) · §754.4's two-liners.

## (superseded) PICKUP AT §755 (2026-08-30 ~00:35 CDT)

**Build branch `claude/composite-r4` = `f49e83ac3`** — **STRIP-5 LANDED** (three cars, chair-verified: both exits 0, test-ratchet 11/28,774 ceiling 11, census **2483/364/2119/20797/5768** at walker :6774, pending list = exactly `['map-chains']` off the live module). The paid ladder is settlement-map-FREE; **STRIP-4 is gated on Q-STYLE ALONE now**; STRIP-6 behind it. **FOUR build lanes live (§447 cap): TE-CAP** (capture cars, building since §751.5) · **TE-NET-1** (render-tier roads) · **TE-POLIS-2** (genesis links + composer-as-data) · **TE-NAME** (war/route namers → force-composition clerk → engagement narratives) — all on `f49e83ac3`, BUILD-ONLY, gates serialize in completion order, chair CASes each. Rebase law proven twice now: the lighting census conflicts by construction at every landing — keep the LANDED block verbatim, re-derive WHOLE as a fresh act (a resolution that empties a car gets `--skip`ped, never carried). Open owner gates: **Q-STYLE** (now the ONLY gate on STRIP-4) · **Q10/Q11** (treasury→seats train, all technical preconditions DONE) · the §754.3 Herald counts boundary (TE-HERALD-1 chartered, ready) · the §754.4 two-liners.

## (superseded) PICKUP AT §754 (2026-08-29 ~23:30 CDT)

**Build branch `claude/composite-r4` = `da4effc66`** — **ST-2 LANDED** (four cars, chair-verified: both exits 0, test-ratchet 11/28,782 ceiling 11, census **2487/364/2123/20805/5772** at walker :6732, closure 1,026,756 B unmoved; the goods vocabulary + eager/lazy doors are IN; **W-COIN-1a now waits on Q10/Q11 ALONE**, brief ready). ⭐ Law generalized §754.2: "invisible to targeted runs" extends past the edge-bundle bill — a components source pin and a mention-scan walker are full-gate-only. **TE-STRIP-5 BUILT** (three cars, HEAD `f369e3bf4` on `4bb9f80d9`; pending list = `["map-chains"]` exactly; walker trimmed with guard-the-guard arms added; ⭐ new law: a deleted test file with a mutation-`uncovered` row owes the `uncoveredBaseline` integer edit too) — **LANDING NOW on the free gate slot** (rebase onto `da4effc66`; the lighting file conflicts by construction — keep the landed block verbatim, re-derive whole). **TE-CAP still building.** ⛔ **OWNER DIRECTIVE §754.3 (Herald):** realm news = 100% contextual narrative, never numeric deltas; survey `docs/recon/R-HERALD-NUMERICS.md` — headline layer already complies, the WHOLE gap = 94 scalar-in-`reasons` rows; **TE-HERALD-1 humanization wave CHARTERED**, dispatches on the owner's honest-counts boundary word. Open owner gates: **Q-STYLE** (blocks STRIP-4) · **Q10/Q11** (blocks the treasury→seats train) · the §754.3 counts boundary · the §754.4 interiors.returnsAt two-liner.

## (superseded) PICKUP AT §753 (2026-08-29 ~22:50 CDT)

**Build branch `claude/composite-r4` = `4bb9f80d9`** — **TE-STRIP-2 LANDED** (six cars), chair-verified with the chair's own reads (`[gate-tail] exit: 0` + `TRUE_EXIT=0` from the log; packets 182/0; typecheck 173/173; strict 1134/1134; test-ratchet 11/28776 ceiling 11; census **2487/364/2123/20799/5771** read from the committed walker :6700; post-gate status EMPTY), CASed, WSEAM backup ref DELETED (§749.1 discharged). The legacy map's export/PDF/thumb/sub-tab src surface is GONE; its ONE remaining user-reachable door is `StyleOverhaulPanel.jsx` = owner question **Q-STYLE** (§751.3 — chair recommends DELETE+DE-LIST as its own wave; it gates STRIP-4's main act). ⚠ New gate law (§753.2a): **`prngSeedEntropy`'s 10,000-mint burst is a LOAD-SENSITIVE birthday flake — re-run, never bank** (memory topic `prng-seed-entropy-gate-flake.md`; index row deferred — MEMORY.md is at its 17KB fold ceiling, next fold owes the row).

**LANDING QUEUE: TE-ST-2 lands NEXT** (rebase `26ac0f710` onto `4bb9f80d9`; censuses re-derived WHOLE at the rebased tip — STRIP-2 and ST-2 moved the SAME lighting-census file in OPPOSITE directions, compose nothing; `vite.config.js` may collide; then its own bare gate → chair-verify → CAS) → **TE-CAP** when built → **TE-STRIP-5** (dispatched as a build lane on `4bb9f80d9`; R-STRIP5-CENSUS governs — the enforcement walker is TRIMMED never deleted, `VIEWING_PAYWALLS_PENDING_514` → `['map-chains']`, retiredBy WEB-8 ×2 + EST-B ×2).

**Parallel build lanes on `eba286607` (§751.5): TE-ST-2 is BUILT-COMPLETE (§752)** — two cars green at worktree HEAD `26ac0f710` (`…/825f209c…/scratchpad/laneST2-tree`, receipt `laneST2-receipt.md`); its landing satisfies W-COIN-1a's A1.20 precondition (then Q10/Q11 alone). **TE-CAP** (CAP-1..4) is still BUILDING (`…/laneCAP-tree`). Both LAND only after STRIP-2 (gates serialize; census re-derived WHOLE at each landing rebase — STRIP-2 and ST-2 move the SAME lighting-census file in opposite directions; vite.config.js may collide). **The recon quartet is LANDED** (`docs/recon/R-STRIP5-CENSUS.md` · `R-STRIP6-CENSUS.md` · `R-MF-FLIPS.md` · `R-WEAVE-READY.md`): strip arc re-ordered **STRIP-2 → STRIP-5 → STRIP-4 (Q-STYLE + STRIP-5 gated) → Q-STYLE wave → STRIP-6 LAST**; the design registries left STRIP-4's charter (§751.2); MF-CH3 + MF-CG2 flips are execution-ready (R-MF-FLIPS); ten WEAVE cars buildable in parallel per R-WEAVE-READY's matrix. `docs/briefs/STRIP4-BRIEF.md` amended. Owner batch grows by **Q-STYLE**.

## ⭐⭐⭐⭐ PICKUP AT §749 (2026-08-30 ~00:15 CDT, ACCOUNT-SWITCH CHECKPOINT) — superseded by §751 above; supersedes §732's pickup.

**Build branch `claude/composite-r4` = `eba286607`** — STRIP-1 + STRIP-3 + the WEAVE seam wave are ALL landed, chair-verified, CASed (§747/§749.1). The legacy map is off the website; SEAM-0's silent false canon is repaired at the tip (the persisted-worlds posture call stays in the owner batch, §747.2).

**ONE lane was checkpointed at the switch: TE-STRIP-2** (Opus; PDF/exports/thumbnail strip + the four §748 additions: the StyleOverhaulPanel F1 map half · the four pre-sever re-homes · the gate-mutex pin-the-path fix · the 12-edit figure-pin sweep). Its worktree: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/5a850cca-94f6-4828-bc6e-0936d5f66782/scratchpad/laneSTRIP2-tree` (base `1a2471990`; receipt `../laneSTRIP2-receipt.md` beside it). **Checkpoint CONFIRMED (§750.1): worktree HEAD `4ccbfe7d6`, tree CLEAN, no lock held, receipt refreshed (also in `receipts/`). Cars 1–2 landed (mutex fix + PDF strip). Resume = car 3: re-home `downloadBlob` (blocks car 4); rebase onto `eba286607` via `git rebase --onto eba286607 1a2471990` before the landing gate. Trailer flag RULED §750.2 — do NOT amend commits. One gate at a time; the mutex is free.**

First acts in order: (1) re-arm the 30-min lane-stall wakeup (cron `11,41 * * * *` — journal/worktree mtimes vs completion; >15 min silent = stalled). (2) Survey + resume TE-STRIP-2 → collect its gate → chair-verify (TRUE_EXIT + post-gate status + census lines yourself) → CAS `claude/composite-r4` `eba286607` → its tip → then delete backup ref `laneWSEAM-prerebase-backup` (= `c22cf17dc`, §749.1). (3) STRIP-4 dispatches next: §748.3 ruled ARM B (11 townCartography files STAY as scene substrate); the full 105-file census with deletion order is `docs/recon/R-STRIP4-CENSUS.md`; its pre-severs land in STRIP-2 first. (4) W-COIN-1a dispatches THE HOUR Q10/Q11 arrive — brief at `docs/briefs/WCOIN-1a-1b-BRIEF.md` (ST-2-first per WEAVE A1.20); SEAT-1..8 wait on W-COIN-1a. (5) The pin sweep's 12 verbatim edits: `docs/recon/R-PINS-SWEEP.md` (riding STRIP-2). Seats: Fable architects/manages · Opus implements/verifies — model-agnostic if this account lacks a tier; §685 marking binds every ledger act. Open owner batch: Q-W1..Q-W7 + Q-W9, Q10, Q11, Q-S2..Q-S8, widened Q4, and the vetoable flags (§747.2 false-canon posture · §747.3 ceiling raise · §746.2 · §748.4's O1 sentence delivered).

## ⭐⭐⭐ UPDATE AT §747 (2026-08-29 ~23:10) — THE STRIP PAIR LANDED: `claude/composite-r4` = `1a2471990` (the legacy map is OFF the website; the retirement path is law). WSEAM (`c22cf17dc`, green) is REBASING onto it per §747.2's overlap set and lands second — a successor collects that rebase gate first. The SEAM-0 false-canon record + chair ruling: §747.2. The EXEMPT_CEILING raise is owner-flagged (§747.3, vetoable). The mutex double-acquisition is chartered diagnose-first (§747.4). Next build acts after WSEAM lands: TE-STRIP-2 is ALREADY BUILDING on the strip tip (widened §748: +F1 panel, pre-severs, mutex fix, pin sweep) and gates after WSEAM's landing; the WSEAM rebase tip is `eba286607`; W-COIN-1a's dispatch brief is WRITTEN (briefs/WCOIN-1a-1b-BRIEF.md) and waits only on Q10/Q11; STRIP-4's census is DONE (§748.3, ARM B ruled vetoably).

## ⭐⭐ UPDATE AT §739 (2026-08-29) — DW/AD/C-19/CT-1b/COVER-REFRESH DEFER TO THE MODULE (owner ruling; the launch tail is §739.2). The §732 pickup below stands for lane mechanics.

## ⭐⭐⭐⭐ PICKUP AT §732 (2026-08-29 ~15:20 CDT, WINDOW-CLOSE CHECKPOINT) — START HERE.

**Three lanes were live at the owner's window close; every resume path is §732.2.** First acts, in order: (1) re-arm the 30-min lane-stall wakeup (cron `11,41 * * * *`; check running workflows/agents' journal mtimes vs completion rows; >15 min silent = stalled). (2) Survey `git worktree list` + the three receipts in the 5a850cca scratchpad `receipts/` (laneSTRIP1 · laneSTRIP3 · laneWSEAM) + `draft-W-COIN-ARCH.md` — the 529-law binds: partial edits exist, re-verify claimed proofs. (3) Resume MID-LANE from receipts: TE-STRIP-3 finishes the retirement set + retirement-path validator on `08fd4f921`, then STRIP-1+STRIP-3 land JOINTLY on one green combined gate → chair-verify → CAS `claude/composite-r4` `73f5dfc02` → the pair's final tip. TE-WEAVE-SEAM finishes SEAM-0/1/2 on `73f5dfc02`. (4) Panel `docs/DESIGN_W_COIN.md` (DELIVERED COMPLETE, landed §733) before any coin implementation (f3cf639e reversed by owner order §731 — architecture-first binds). Governing docs: `DESIGN_MAP_MODULE_SPLIT.md` (strip; §11.4/§11.5 corrections), `DESIGN_FMG_WEAVE.md` + A1–A3 (integration), `REVIEW_FMG_PUBLISHED_MATERIALS.md` (tie-back record). Seats: Fable architects/manages · Opus implements/verifies · §685 marking binds every ledger act. Open owner batch: Q-W1..Q-W7 + Q-W9.

## ⭐⭐ UPDATE AT §731 (2026-08-29) — Q-W8 + Q-S1 GRANTED; THE RETIREMENT-PATH LAW; STRIP-1+STRIP-3 JOINT LANDING PENDING.

**f3cf639e is REVERSED by owner order** — W-COIN (treasury/taxation) chartered architecture-first (WEAVE A3; W-COIN-0 designing). **Q-S1 granted** — TE-STRIP-3 stacks on STRIP-1's green tip `08fd4f921` (retirement set + the §731.3 retirement-path validator extension + six `retiredBy` packet annotations); the pair lands on ONE combined gate; chair CASes. Successor: collect TE-STRIP-3 and TE-WEAVE-SEAM from their receipts; the retirement-path law governs every later strip wave.

## ⭐⭐ UPDATE AT §730 (2026-08-29, same sitting) — A2 FOLDED: THE PUBLISHED-MATERIALS ADDENDUM IS CHARTERED.

**`docs/DESIGN_FMG_WEAVE.md` now carries AMENDMENT A2** (new cars NAME-3/NAME-4, the new W-DESK wave, POLIS-3 travel rings, POLIS-1 culture sub-roster option, five guard additions) — all tie-back-verified per the owner's law, zero kills; full record `docs/REVIEW_FMG_PUBLISHED_MATERIALS.md`. Owner batch grows to Q-W1..Q-W9 + Q-S1 (§729.4 + §730.4; Q-W8 would reverse ruling f3cf639e — flagged). In flight: TE-WEAVE-SEAM (Opus; SEAM-0 lockout verdict pending) · TE-STRIP-1 gate collection.

## ⭐⭐⭐ UPDATE AT §729 (2026-08-29, same sitting) — THE WEAVE ARCHITECTURE IS SEALED; IMPLEMENTATION MAY DISPATCH.

**The FMG integration program is architected, panel-ruled (5/5 NOT-REFUTED), and amended: `docs/DESIGN_FMG_WEAVE.md` (+ AMENDMENT A1, which OUTRANKS the body) with all receipts in `docs/DESIGN_FMG_WEAVE_VERIFICATION.md`.** A successor implementing: read the volume BODY then A1 then the car's verification receipts; Opus seats implement/verify; Fable chairs. Dispatch order and collision laws are volume §4 as amended (SEAM first; UI cars after STRIP-6; POLIS-2 before ST-3; NET-1 export half after STRIP-2). The owner batch Q-W1..Q-W6 + Q-S1 is open (§729.4) — none blocks the ungated cars. ⚠ STRIP-3's scope was corrected TWICE — read `docs/DESIGN_MAP_MODULE_SPLIT.md` §11.4 before touching it (mapSlice.js and the three tests/security map contracts are WORLD-map surfaces that STAY). In flight: the published-materials review under the TIE-BACK LAW (§729.5); TE-STRIP-1's gate collection + held arm (Q-S1).

## ⭐⭐⭐⭐ UPDATE AT §725 (2026-08-29, same sitting) — THE OWNER RULED: STRIP THE LEGACY MAP; GPL FORK 2, MODULE-ONLY.

**Q1 = STRIP the entire legacy settlement map — no tab or trace on the website** (prelaunch, no users; §705 moot). **Q7 = the module derives directly from GPL-3.0 code and is GPL-3.0 in its OWN repo; the core stays private** — read `docs/DESIGN_MAP_MODULE_SPLIT.md` §11.1's seven mechanics rows before touching either side (output-only boundary; a context that has read GPL source NEVER writes the core repo). **The STRIP charter is doc §11.2** (six waves; J-STRIP-1 retains the headless substrate feeding `spatialSubstrateDerive`'s 11 simulation consumers — vetoable). **TE-STRIP-1 is DISPATCHED** (Opus seat, build tip `73f5dfc02`, own worktree, full detached gate, receipt in the 5a850cca scratchpad). Open owner questions: **Q8** CARTOGRAPHER tier contents after map rows leave · **Q6′** 3D scene + interiors stay (rec) · **Q9** landing imagery replacement. A successor: collect TE-STRIP-1 from its receipt FIRST (§448 — resume mid-lane, never restart), then continue the wave order.

## ⭐⭐⭐⭐ STATE AT §724 (2026-08-29) — THE DESCOPE SITTING. READ THIS FIRST; IT RE-SCOPES EVERYTHING BELOW.

**The owner ruled (§724.1): ALL settlement-layer mapmaking leaves the launch path and becomes a SEPARATE MODULE** (later possibly published standalone under GPL-3.0 while the core stays private), and the launch tail is everything minus that module. **Seats re-split: Fable architects/surveys/manages · Opus 5 implements/verifies** — this supersedes §685's all-Opus assignment for this program; §685's seat-trailer/retrovalidation MARKING machinery is unchanged and binds every ledger act.

**The whole split is surveyed and ruled vetoably at ODQ §724, with the full program in `docs/DESIGN_MAP_MODULE_SPLIT.md`** (extraction manifest · gates/censuses split · docs split · docket classification · the de-staled launch arc · GPL ground facts · judgments J-SPLIT-1..5 · owner questions Q1–Q7). Sharpest facts a successor must not re-derive: the map program is an **orphan git line with zero launch imports** (carve needs no launch-code changes); the **launch product ships the LEGACY townMapDraw map** (161 src files, CARTOGRAPHER tier stands on it — its fate is owner question Q1, its §705 coastal-wall defect Q2); the **soul-deltas P0 sits inside unsealed CAR-WEAVE `dad7ab736`** and is the module's boundary act, not launch's; **§720.6 and the tuning signature stay on the launch path**; CH-4/5/6/7 + the DEPLOY.md 188 amendment are **already LANDED** (the §562 pickup card's queue head is stale).

**A SUCCESSOR'S FIRST ACTS, IN ORDER:** (1) re-arm the 30-minute lane-stall wakeup (session-scoped cron `11,41 * * * *`: enumerate running workflows; journal completion rows vs artifact mtimes; >15 min silent = stalled → resume by scriptPath+resumeFromRunId). (2) Read ODQ §724 + `docs/DESIGN_MAP_MODULE_SPLIT.md` §9 — if the owner has answered Q1–Q7, execute per the answers; if not, the launch tail's owner-independent members (doc §7: MF-CH3 flip, MF-CH2B mint, C-19 TSV survey, DW dispatch prep) may proceed under standing delegation. (3) The map/module side stays PARKED except its boundary hygiene (J-SPLIT-4: WEAVE seal + §721.8 amendment) — CAR-PROBE and the stopped research workflows re-dispatch inside the module program only. (4) Continuity: every deliverable lands in the repo at each checkpoint; account switches keep the memory dir and kill scratchpads/workflows; an Opus-only window EXECUTES the architected plan and marks per §685, it does not re-architect.


## ⛔⛔⛔⛔ THE SEAT — OWNER ORDER §685 (2026-08-26). READ THIS BEFORE THE PICKUP CARD.

**The owner assigned the remainder of the arc to OPUS 5.** From GROW-FOLD's collection forward, the chair and every lane run Opus 5 — by assignment, not by Fable exhaustion. **§684 is the last Fable-chaired ledger entry.**

⛔ **EVERY LEDGER ACT IS MARKED.** The commit message carries exactly one seat trailer — `Seat: Fable 5 — validated` or `Seat: Opus 5 — Fable-unvalidated` — and **every Opus-seat commit must also carry `docs/FABLE_RETROVALIDATION_QUEUE.md` among its paths**, enrolling its retrovalidation row in the SAME act. `chair-tools/chair-commit.sh` REFUSES both violations (five planted controls, each exiting non-zero, §685.4). *Unmarked is not a state the tool can produce* — do not work around it, and if you rebuild the toolkit, use **`refs/preserve/chair-tools-2026-08-26-r6` = `2a618875a`** — r6 carries THREE gates: the **seat gate** (§685.4), **mode preservation** (§687.8 — a hardcoded 100644 landed the hook inert, a gate that reports as installed and cannot fire), and the **subject-anchor gate** (§687.9 — a commit whose subject announces a § the ledger does not contain is REFUSED; the §678 class, third bite). Keep all three. The tracked hook `.husky/commit-msg` fires only on commits touching the ledger file, so lanes are never blocked — proven by a scope control.

⛔ **THE RULE THE MARK SERVES:** anything validated by Opus 5, **or not marked as validated by Fable**, is retrovalidation-owed. Silence does not read as validation. The owner triggers the pass **at a time of their choosing** and may scope it; a scoped pass empties only what it covers.

⭐⭐ **STATE AT §722 (2026-08-27, OWNER PAUSED FOR USAGE — READ THIS BLOCK FIRST).** Ledger through **§722**, tip **`62d1a8ff3`**. Instruments **r9** `4bde6217a` · toolkit **r7** `9915e0786` (extract with `git show '9915e0786:chair-tools/<f>'`; it is NOT in any working tree).

⛔⛔ **FOUR SEALS LANDED THIS SESSION, ALL BASED ON `map-sandbox-regf0` = `dea9239d0`:**
`map-sandbox-words2` = **`730a10f76`** (lettering: **0 → 775 `<text>` on 18/18**, cartouche + legend ink + scale bar; gate 20 files/**542**) · `map-sandbox-found` = **`b83c6992e`** (refusal record + saturation cure; gate **529**) · `map-sandbox-e1-needle` = **`1c3633c16`** (needle diagnosis, **zero `src/` files**) · and `map-sandbox-regf0` = **`dea9239d0`** itself (the legacy sweep, 39-row retirement manifest).

⛔⛔ **CAR-WEAVE IS UNSEALED AND UNFINISHED — RESUME IT FIRST.** Merged tip **`dad7ab736`** (octopus, 4 parents, in `$SP/laneWEAVE-tree`, **no ref moved**). Resume block: `$SP/WEAVE-RESUME.md` with a live TODO. **Done:** merge + honesty proof (all 20 changed files byte-identical to their originating lane tip) · placement census **18/18 GREEN at the merged tip**, worst armed **22.55 px vs the 24 px bound**, margin 1.45 px unchanged · corpus text **775→815** dormant · raise-year emission **0 of 17** · demand census reproduces exactly. **NOT done:** the 4 planted controls, `physicalViolations`, E1's `hollowCensus` re-run, determinism + folio containment, the stage walker, and **THE FULL GATE (expect 549 collected) — it was stopped one step before the authoritative run.**

⛔⛔ **THE FINDING THE MERGE EXISTED TO PRODUCE, AND IT IS A RED: THE WRAP DIGEST HAS MOVED, AND CAR-FOUND ALONE PRODUCED IT.** dormant `e65c7685…` → `78845bbb…`, armed `5523c235…` → `abe42a78…`. Attributed across five trees: base, WORDS-2 and E1 all match the published pin; **CAR-FOUND's tip alone moves it, and nobody ran that exit at FOUND's own tip.** Decomposed: `frozenRadius`/`bandWidth`/`year` moved on **0 of 17**; **RING COORDINATES moved on 4 of 17** — `city` E1 and `migration` E1 area **−33.6 %** (Hausdorff 185.9, gates 5→6), `metropolis` E2 **+3.99 %** (gates **4→2**), `metropolis` E1 **+16.5 %**. ⇒ **§721.8's declared shift was INCOMPLETE — it declared lost emissions and souls and did not declare moved wall rings.** Amend it. ⚠ Byte headroom also fell: armed metropolis **698,367 → 749,148**, headroom **15.9 % → 9.74 %**.

⛔ **OWNER DIRECTIVES FROM THIS SESSION — THEY OUTRANK PRIOR SEQUENCING.** (1) *"I want the absolute best product not compromises."* (2) *"I could've launched some version of all of this a year ago or a month ago. I will keep waiting on launch for the best product."* ⇒ **TIME IS NOT A CONSTRAINT; QUALITY IS.** Stop optimising for what can land soon. The chair conceded two compromises it had made unflagged: it let the **830,000-byte SVG pin bound the ambition**, and it treated the **output format and the map projection as fixed**. **Both are now open variables.** (3) The owner wants **actual drawn buildings — real roofs, streets, alleys, carts and stalls — not polygons and not symbols.** (4) They observed correctly that **Inkarnate is not procedural at all — it is a canvas a human fills** — and stated the goal precisely: ***"I want that canvas half to fill in the plan that is built by our procedural engine."***

⭐⭐ **THE ROOFS RESEARCH IS COMPLETE AND IS THE STRONGEST ARTEFACT THIS PROGRAMME HAS PRODUCED** (workflow `wf_1c4cc765-edf`, 25 agents, adversarially verified; full text in that transcript dir). Headlines a successor must not re-derive: **(a)** Inkarnate's beauty is **30,000+ hand-drawn assets** under terms forbidding extraction and ML training — an **asset problem, not an algorithm problem**; its *coherence* (SDF-derived coastal strokes, per-layer blend modes, a global colour grade, uniform per-style shadows) **is** algorithmic and does transfer. **(b) The owner's exact proposal is the documented failure case in the exact pipeline they named** — Watabou's own docs say his exports *"contain only some of the information required to build a 3d model"*, so City Viewer **invents** roof pitches; CityEngine's frontage selectors **fall back silently** to a world-anchored default. **The split is sound; the handoff is where everything dies.** **(c)** In true orthographic plan **pitch is invisible** — a 45° thatch and a 15° pantile roof over one footprint give **the identical line drawing**; pitch enters through exactly three channels: **facet tone, shadow length, eave overhang**. Every true-plan tradition in the canon (Imola 1502, Bufalini 1551, Ogilby & Morgan 1676, Nolli 1748, OS 1:500) shows **no roof geometry at all**. **(d)** Recommended: the **Gomboust (Paris, 1652) hybrid** — ground in true plan, **only buildings** get a constant screen offset; occlusion is `k × eaveHeight`, so k=0.3 hides 1.5 m (invisible) and k=1.0 hides 5 m (the map breaks). ⚠ **Cite Gomboust, NOT Hollar** — Hollar's flat plan areas mean **fire-destroyed emptiness**, so aggregated blocks must be visibly distinct from bare ground. ⚠ **A screen offset means a mark is no longer at its recorded coordinate — traceable but not metrically true. OWNER CALL.** **(e)** ⛔⛔ **THE TRAP:** the straight skeleton of a long narrow rectangle puts the ridge on the **long axis regardless of history**, so every deep burgage plot gets a ridge running **into** the street instead of a gable facing it — plausible enough to go unnoticed for a year. **Ridge direction is the frontage signal. Derive it from the frontage edge, never from polygon proportions.** **(f)** The handoff must carry **15 typed fields** (footprint ring with stable winding and indices · per-edge orientation enum · per-edge street ref · explicit primary frontage index · ridge axis · party-wall adjacency · closed-vocabulary building type · eave and ridge height · covering material enum with minimum pitch · full plot ring · ground slope · stable per-building seed from a durable id · importance rank · block id · provenance token), and **every absent value must be an explicit sentinel, never a defaultable zero.** **(g)** Measured: 10k roofs = **30,001 elements / 1.87 MB / ~478 KB gzipped / 115–513 ms** parse+layout; 40k = **120,001 elements / 7.5 MB / up to 2,656 ms — over the whole budget before painting**, and **paint is UNMEASURED**. `<pattern>`-over-blocks + 400 drawn landmarks = **38.7 KB vs 478 KB**. **(h)** **Defer the LOD implementation, never the LOD hook** — the illustrator must accept a detail level and importance rank from v1, because adding it later is a *planner* change and planner changes reach back into recorded history. **(i)** ⭐ **No tool found, procedural or otherwise, generates market stalls or carts as real positioned objects** — and under our constitution a stall is only drawable when the record holds a market day, so **our market is full on market day and empty otherwise.** Nobody else can do that.

⛔ **TWO RESEARCH WORKFLOWS WERE STOPPED MID-RUN BY THE OWNER'S PAUSE and should be re-run, not reconstructed:** the **AI-art asset-library viability** study (copyrightability, vendor redistribution terms and indemnity, litigation and marketplace-disclosure risk, and the byte arithmetic of raster inside SVG) and the **highest-ceiling illustration** study (structure-conditioned generative rendering vs high-fidelity procedural illustration, determinism and the archival problem, output format and register, and a traceability-preserving architecture). Their scripts are on disk under `.../workflows/scripts/` and can be re-invoked by `scriptPath`.

⛔ **CAR-PROBE IS WRITTEN AND WAS NOT DISPATCHED.** Brief at `$SP/briefs/PROBE-BRIEF.md`, based on `730a10f76`. It gets the two numbers that decide the illustrator (**SVG PAINT cost in a foreground visible tab at final output size**, and the substitution ladder re-measured on our own corpus) plus **six side-by-side PNGs** (today · plan+roofs · plan+roofs+material · the hybrid at k = 0.15 / 0.3 / 0.6). **It is the cheapest experiment that settles the biggest uncertainty. Dispatch it first after CAR-WEAVE.**

⛔ **THE OWNER'S DOCKET, as it stands:** the **framing trade** (four measured costs, still blocking REG-F) · the **enclosure operator** (owner-parked; REG-E1 measured a snug enclosure would be SAFE — it collapses `metropolis` E1 from 709 u to ~110 while leaving the honest `city` E0 elongated) · **capacity over-stated ~3.4×** (`frozenRadius` is a **sizing target, not an achieved extent**; the drawn ring encloses a median **0.2939** of the disc capacity prices — corroborated from two independent directions, §721.5) · **the soul deltas** (CAR-FOUND's fix moved lived-history populations, `metropolis` −1,961; flagged **P0** — does that class need the owner's signature?) · **which degenerate outcomes are shippable product** (§720.6) · the **projection call** (plan vs the Gomboust hybrid) · the **art route** (procedural vs generated vs commissioned) · the **cutover flag** · the **tuning signature**.

⚠ **CORRECTIONS THE CHAIR OWES THE RECORD:** three premises it handed lanes were refuted by measurement (the partition has **no WARD faces at all** — minted at `faceId -1`; hull vertices exceed `frozenRadius` on only **2 of 17**; the needle does **not** generalise across tiers) and **four inherited figures did not reproduce** (a byte pin, a 853 ms perf number, a souls probe, a saturation subject). ⇒ **Standing rule adopted: do not quote a figure into a brief that you have not re-taken at that lane's own base.**

<details><summary>⚠ SUPERSEDED — the §715 state block (kept verbatim)</summary>

⭐ **STATE AT §715 (2026-08-27):** ledger through **§715** · seals: WORDS `24e60c890` · **REG-D `4935c3c35`** · instruments **r9** `4bde6217a` · toolkit **r7** `9915e0786`. Gate **20 files / 523 tests**; dormancy 29/29 (control convicts 28/29); determinism 18/18; wrap digest unmoved; byte +43,714 B. ⛔⛔ **THE FRAMING TRADE HAS A FOURTH AND DECISIVE COST (§715.1/.2): THE ENTIRE DECLINE REGISTER IS CROPPED OFF THE PAGE ON 16 OF 18 LEAVES — EXACTLY ZERO PIXELS**, agreed by four independent methods. ⭐ **Neither law is wrong; their composition is: the rim is what empties and the rim is what the fit crops** (outermost live plot at radius 467.4 vs a frame at 185.9). **→ OWNER DOCKET — this is the cost that should decide the framing question.** ⚠ And `fjord` has **degraded from abstention to WRONG CLASS** — a fourth stranger, now committing. ✅ Where the page allows it the decline ink is **good**: `highwater` **0.8898 % perceptible, 7.2–20× the scenario register**, dense not scattered — the §714.6 guard working as written. ⭐ **PA.8 vindicated: all 89 RECLAIMED regions have NO face**, so a face-walk would have missed them by construction (471 of 560). ⭐ The declined read **killed a live alternative** rather than rescuing a failed one — but **n = 1 declined leaf**. ⛔ **REFUTED, not deferred:** subdivided grandeur has **no subject** (the wealth axis lives in the legacy district cells — §708.2's C2) · the high-water circuit is **the line the town HELD**, not a memory (97.0 % intramural). ⭐ Dress finding: **a dead quarter reads as an UNFINISHED drawing, not a ruined one** — emptiness needs a mark of its own. **NEXT: REG-F0 (legacy sweep) IN FLIGHT** → ⛔ **REG-F is HELD (§716.1): the film's specimen is the OWNER's gate, and with decline cropped off 16 of 18 pages its dying half would show NOTHING — the framing decision now BLOCKS THE ARC'S CLIMAX, not just registers** (vetoable; say the word and it runs) → **REG-P (the port; OWNER throws the cutover)**. ⭐ The port now inherits every deferred wire: **folio↔partition** (§712.5/§714.10) · the declared-shifts compilation · REG-F0's retirement manifest · and a reframing if the owner rules that way. ⚠ Also carried: **DECLINE-ADDRESS** (L-REG-36's red, uncured because the cure would void REG-D's own measurement).

</details>

✅ **THE 2026-08-26 HALT IS LIFTED** (owner: *"continue"*, §691.1). While it stood, DRESS-1b was stopped **before it committed anything** — nothing was lost and nothing resumes mid-lane; it re-dispatches fresh. ⚠ For the record: a scheduler wakeup is **never** a lift of an owner halt.

⛔⛔ **AND READ ODQ §690 BEFORE DRESS-1b IS EVER RE-DISPATCHED — ITS BRIEF IS NOW OUT OF ORDER.** The 30 `dress-*` group ids are **absent from `lib/classify.mjs`**, so the dress is invisible to the classifier *and* every dress `rect`/`circle` **plants a chrome exclusion zone** that convicts real ink — the REG-5 flood with a 30-id roster instead of 4. Because `mk-controls.mjs` dispatches on the classifier's role, **a role it cannot name cannot be planted**, so PA.5's per-role controls are **unsatisfiable for dress roles** and **exit 3's i1/i6/i7 re-records cannot honestly be met until the classifier question is ruled** (a declared shift across every pixel baseline — `INSTRUMENTS.md` prices it and assigns it to the chair; it is **deliberately unruled** because of the halt). Also: **i1 and i7 have no corpus driver at all** — exit 3 includes writing two, which the brief did not budget.

⛔ **THREE OPEN SUBSTRATE/INSTRUMENT FINDINGS FROM DRESS-1** (§688.3, all chartered into DRESS-1b): the `metropolis` wrap is **geometrically degenerate** (`area/bbox = 0.077`; nothing censuses it) · `--checkcircuit` on the partition is **arm-dependent**, so a partition i6 baseline **must pin its arm** · **CLIFF edges are never minted**, making crag-avoidance vacuous and `terrain-surrender` unfirable.

⭐ **WHAT THIS IS NOT:** not a quality gate, not grounds to defer a decision, and never grounds to escalate instead of deciding. **§585's delegation is unchanged** — the Opus chair holds the same judgment the Fable chair held. The retro question for every remaining wave is **pre-authored** in `docs/FABLE_RETROVALIDATION_QUEUE.md` §6.2; the executing chair appends what it actually decided. Full ruling: ODQ §685 + `docs/DESIGN_SPINE_COMPLETION.md`'s OWNER AMENDMENT (OA.1–OA.5, which outranks the body and the panel amendment).

## ⛔⛔⛔ PICKUP CARD — ACCOUNT HANDOFF (2026-08-24 08:44 CDT). A SUCCESSOR ON A DIFFERENT ACCOUNT STARTS HERE.

**build `claude/composite-r4` = `c3289244d` (60 cars) · ledger `review-fixes-2026-07-08` §562 · packets **179** · census `2525/366/2159/21026/5848` · ratchet **11 of 29,044***

### ⛔⛔ FIRST ACT — YOUR PREDECESSOR'S SCRATCHPAD IS GONE. IT IS IN GIT INSTEAD.
Every standing law, docket and lane receipt lived under `/private/tmp/claude-502/…/695a70c5-…/scratchpad`, which **you cannot read**. All of it is preserved:

    git show refs/preserve/session-scratchpad-2026-08-24   # = 05b822dbc, 39 files

- `law/LANE-LAW.md` — **read this before dispatching anything.** The gate incantation, the ~16 instruments that lie, census + packet rules. Re-stamped to this slot.
- `law/SLOT-FACTS.md` · `law/STACK-BRIEF-TEMPLATE.md` · `law/SIGNED-BANDS-2026-08-23.md` (the owner's own words on all eight bands)
- `dockets/` — the CH-4 decision sheet + brief, CH-5 brief, DW-0 skeptic docket, DW-1 prep brief, AD-1 provenance audit
- `receipts/` — **18 lane receipts. A lane is resumed MID-LANE from its receipt, never restarted (§448).**
- `dwfix/` — the itemised 53, both readings, the adjudication TSVs behind the ruled 135
⚠ **A preserve ref is an ORPHAN — not an ancestor of anything.** `git merge-base` against it exits 1. That is normal; read it by sha.

### ⛔ THE OWNER'S #1 ITEM — 28 DAYS
Prod at migration **121**, repo head **199**, 78 pending. ⭐ **MEASURED (§540.7–.8): the push itself deletes nothing.** 12 of 13 destructive migrations act only inside function bodies; **198, the one labelled DESTRUCTIVE, deletes nothing at apply time** (its prune is double-gated, both fail closed). ⛔ **188 is the one that acts at push time** — it deletes users' custom supply-chain content, mitigated by a quarantine receipt written **before** deletion. **`docs/DEPLOY.md` covers 198 and never mentions 188 — that amendment is owed.**

### LANES AT HANDOFF — all told to stop at a clean point
| lane | state | resume from |
|---|---|---|
| **TE-CH-7** | STOOD DOWN. Tip `373601437` pinned **`wip-ch7`** — its gate never wrote an exit line and was contaminated besides. One clean `npm run check:tail` at the tip promotes it to `holding-ch7`. | `receipts/laneCH7-receipt.md` |
| **TE-CH-4** | STOOD DOWN. Pinned **`wip-ch4` = `dc49c6c4a`** (regen included; re-pointed off the pre-regen tip). **A full gate was in flight at handoff** — collect its verdict; on green move the pin to `holding-ch4`. | `receipts/laneCH4-receipt.md` |
| **TE-DW-PREP** | DELIVERED. 11 sections; **§0 is a completeness map — 9 cold-actionable, 2 flagged PARTIAL and not to be quoted as measured.** | `dockets/laneDWPREP-BRIEF.md` |

### RULINGS IN FORCE — do not re-litigate (ODQ §555, §562)
**CH-4:** Shape D adopted · **route (iii)** for dominant-faction · keep `declared ?? inferred` · keep `Wealthy Residential → noble` · registry **after line 117** · ⛔ **prove against the DERIVED ARTEFACT, never a settlement-record hash — `districtProfile` is absent from the generation pipeline so that digest CANNOT move.** ⛔ **First job is the arithmetic nobody executed: up to 333 cards LOSE their faction row while 44 gain one.**
**DW:** fixture union **135** (base 82 + 53; floor 106, ceiling 549) · **branch (A)** — `FIXTURE_KINDS` becomes `{kind, attrs}` with totality + consolidation arms · **arm 4a live / 4b deferred to DW-2b** · **ENVELOPE minted as its own vocabulary** · ⭐ **DW-1 is NOT gated on CH-6 — measured, blob `3b1bf2c254ab` identical across the gap, with a live control.**
**CH-6 is deliberately undispatched** — §555.9 orders CH-4 first.

### THE QUEUE
⚠ THIS QUEUE PREDATES THE SPINE — §675/A13.1 governs the released arc; entries here re-derive at dispatch. CH-4 → **CH-6** (⛔ a **live shipped deity-doctrine violation**: a magic-free world can hold no divine healer or druid circle) → CH-7 land → **DW build waves (42 cars — §562.6 — more than everything landed to date)** → **C-19's sub-form recount** (cheapest high-value lane; `~55`/`~35` are not integers and block DW-1d/1e) → WEB-8b/12 → wiring wave → WEB-9a–11 → HK-4/5/6 → housekeeping → CT-4/CT-5/WF-8 → **AD program (17 cars; charter at `refs/preserve/ad-charter-2026-08-24`)** → OSR mint → parity → `/code-review ultra` (OWNER) → endgame.
⚠ **MF-CH3 owes a three-place flip to LANDED** — a landing act on TE-CH-3's car; its nine contested paths have since moved again.

### ⛔ FOUR THINGS ARE THE OWNER'S BY NATURE — and none is a permission
`supabase db push` and every deploy (their credentials) · `/code-review ultra` (a billed keystroke) · **legal sign-off and the tuning signature** (*a signature that can be delegated is not a signature*) · the Cohort A reverse-image search (needs a human).
⭐ **§510 grants everything else, and §557 records that the predecessor had been over-gating.** Decided and no longer the owner's: CH-4's declared shift · the dossier legend · the DM annotations · the estate ownership type · soak certification (**measure**, do not certify blind).
⚠ Still owed to the owner as *disclosure*: the **17 July "one free sample interior" teaser** — verify it was ever published before treating it as a public promise.

### LAWS THAT CHANGED TONIGHT — check `law/LANE-LAW.md`, these bit repeatedly
⛔ Lanes build their **own** `node_modules` with `npm ci`; **never symlink** the shared one (434 pkgs vs the slot's 468). `npm ci` installs `.husky/_`, so lane commits **RUN pre-commit** and `eslint --fix` **re-stages** — re-prove at the committed tip.
⛔ **A word-occurrence match is not a membership test** — it bit three times in one day, and the third failed *silently*. ⚠ But **"anchor everything" is also wrong**: `church`, `broker` and `bank` have TRUE mid-word populations.
⛔ **Absence decays silently, in three directions** — filled since; promised but never landed; **and landed by a different mechanism at a different magnitude.**
⛔ **A figure without its denominator named is not a measurement.**

⛔ **MUTEX:** read the holder pid **out of `/tmp/settlementforge-vitest-gate.lock/pid`** and test *that* one — never a remembered pid. **Never kill an in-flight gate to tidy up**; a killed holder leaves a stale lock that blocks every lane.
⭐ **DW-1g is minted and J-DW0-2 amended to 42 cars** (§562.6) — ENVELOPE gets its own car; `service{flue}` there is the producer arm 4b needs.

⛔ **EDGE-BUNDLE BILL — the count is PER-FILE.** `npcProfile.js` sits in three closures, `districtProfile.js` in one (`aiGroundingBundle`, 67 inputs). **Read `supabase/functions/_shared/<bundle>.meta.json` before budgeting.** The bill is **invisible to targeted suite runs** — only the full gate sees it. Cure: `npm run build:edge-shared`, commit all six files as a set.

### ⭐⭐⭐ STATE AS OF §633 (2026-08-25 ~06:15) — SLOT 73f5dfc02 (65 CARS), REG-4 SEALED, REG-SEAM + REG-I1 IN FLIGHT
Ledger through **§647** (newest: §645 the wall-over-districts correction + tangential census · §646 the exhaustive Kitaqiao re-read, L-REG-34/35/36 minted · §647 THE COMPILE — A12 gives the conformance block its charters + arc restated; **docs/SIGNED_CONSTANTS.md is the tuning walking sheet, updated at every signature by standing order**). **REG-SEAM SEALED** = `map-sandbox-regseam-bands` @ `6cd4b19ef` (classifier sweep 18,000→0; 26/29 artifacts move, declared §110.3; **city ceiling SIGNED 10,100**). **REG-I1 COLLECTED** (i8 7→0 with convicting control · branch liveness 13/13, triangular's true boundary 60.117° · **ratchet unit SIGNED: BYTES primary, no time gate** · ⚠ classify.mjs blind to REG-4's group ids — cure + i1/i5/i7 re-records + i5 re-verify = REG-5 opening act · ⚠ wall:all watch row: headroom 7.75→4.27, re-measure before any circuit-softening). **§635.4 QUAY RULING**: `moorWaterBound` vs `bodyRefusal` internal contradiction = MACHINERY repair (§632.3 framework) — REG-QUAY named in REG-5; 4 of 12 quays over 24 seeds undrawn today; legacy path DELIBERATELY uncured (dies at cutover). **L-REG-31 minted** (bridges perpendicular to the local river tangent ±15°, road kinks at the bridgehead — Amendment A8). Efficiency toolkit `chair-tools-2026-08-25` = `3d4ec5065` (preflight gate lint: run BEFORE every build car's first gate; quicklook for iteration, Chrome for exit legs); all receipts + instruments + re-round fixtures preserved at `session-work-2026-08-25` = `fbe934770` (234 files). Ledger through **§636**: the warehouse re-round scored — VALID and the class FAILS at 33 % (decoys 0/2 clean); **V-QUAY minted** (bollard row · hoist · pier-deck edge · stacked goods, band 2–5 per quay) and added to REG-5's REG-QUAY mid-flight; a THIRD round follows REG-5's seal. **L-REG-32 minted (§637, A9): bridges site at the NARROWS within the road corridor, roads bend to the bridge, fords mirror to wide reaches; REG-5 measures, REG-BRIDGE (chartered) cures after it.** **§638/§639: THE CONVENTION AUDIT — 49/49 verified real (16 NEW · 32 PARTIAL · 1 COVERED), full register with executed evidence at `docs/CONVENTION_AUDIT_2026-08-25.md`; six conformance cars MINTED (REG-ROUTE · REG-DEF · REG-WATER · REG-SITE · REG-H · REG-TERR) and the ARC RE-ORDERED (§639.3): REG-5 → REG-BRIDGE → REG-GROW (arch then build) → the conformance block → REG-6..9 (judging AFTER conformance) → D → 10 → 11 → F0 → F → P. Dossier contest RULED §640: 25 confirmed · 17 silent · **4 CONTRADICTS → REG-SITE/REG-WATER re-charter as WEIGHTS AND VARIETIES** (hospitals/fairs/noxious pulls not walls; mills adopt R-INST-2 §11's waterPower enum; townLayoutV2.js:209 tannery NAME-match residual named); REG-ROUTE's dead-end clause revised (zero-mouth fragments only); REG-GROW gains the planned-foundation origin. §640.3: internal-contradiction rows proceed ungated; true priors wait on **R-MORPH (DISPATCHED, Fable)** — REG-H + REG-TERR terracing gated on it. Sharpest audit find: ⛔ time snapshots show ZERO GROWTH (year 18 ≡ year 100 ≡ present) — now REG-GROW's leading spec input. **§641/§642: REG-5 SEALED** = `map-sandbox-reg5-drawnworld` @ **`a303815ae`** (NOT §641.1's 1840376bc — the borrowed fastCheckSeed committed for self-containment; chair-commit.sh now takes `--require-ref` so declarations cannot outrun seals). Quays cured+dressed (J-REG5-3 widened exemption RATIFIED; TE-WSEAM chartered on the sub.wet vs drawn-water seam); countryside 1-of-2 in band, mosaic = REG-H (gate NOW OPEN per §642.2); **byte ceilings SIGNED** (130k/150k/190k/560k/680k/830k + the coupling law: an op raise owes a byte re-measure); **L-REG-32 unmeasurable today — the river has A width, not a profile; no ford is ever drawn** → REG-BRIDGE opens with the RIVER-PROFILE mint, then fords drawn, narrows re-siting, the two floating decks, the four angle outliers (excess ≤1.086 vs ≥1.302), the carto:bridge family DISPOSITION. **R-MORPH DELIVERED** (draft-R-MORPH.md, owner taste gate pending; floodplain-meadow inversion · Elton tenure · Corfe siege band · Durham two-row default). REG-GROW architecture WRITTEN + **PANEL RULED §643 (0/5 refuted; 7 blockers → Amendment A1: the LEDGER/FRAME split — kernel as pre-stage, buildFabric single-shot, frames on demand; NO INVENTED HISTORY — T2 curves are constrained interpolants anchored to recorded loss events, T2 rides car A amending §624.3; A6.1 schema verbatim; LossRegion first-class; one owner per seam; A10 re-founds REG-D on the ledger)**; REG-GROW-A dispatches when REG-BRIDGE seals; **§648: REG-BRIDGE SEALED** = `map-sandbox-bridge-rivers` @ `9de729021` (18/18 on every census; profile spread 1.909–2.100 READ from the heightfield; taper 0.34/pinch 0.22 SIGNED; kink 75° J-BR-7; ford/bridge identity banked — town-2 draws the corpus's one ford; FORD GLYPH held for a REG-6 re-cut beside the road-over-water layering fix; carto:bridge premise corrected — never drawn, dies at cutover; coupling law generalized to arms). **REG-GROW-A IN FLIGHT** on this seal (DESIGN_REG_GROW.md + A1, A1 wins; receipt → laneGROWA-receipt.md). **§§649–653: the owner's catches re-architected paint** — the deck read as a road-crossing (§649 gestalt-first taste order) → the negative-space ruling recovered (§650) → the TOPOLOGY FORM (§651: no road edge spans water; banks hold convergence nodes; the crossing is its own typed edge) → the TOPOLOGY–PAINT CONTRACT (§652: three clauses, REG-P's completion check) → **§653: REG-6 UPGRADES TO THE PAINT REBUILD** (chair architecture + panel before build; vocabularies keep, substrate rebuilds; REG-BRIDGE-B folds in). **§§654–657 THE STOP + THE REVIEW**: owner halted the arc; six-lens review COLLECTED (9 BROKEN / 21 IMPEDING; review654/CONSOLIDATED.json; ⚠ I1 the exhibit was 8-arm — re-judge on 10-arm; ⚠⚠ I21 the MAIN CHECKOUT carries 3,374 unstaged deletions incl. all townCartography — REF-PIN then triage before ANY shared-tree act); GROW-A stood down clean at 51684eb9e with the zero-growth diagnosis DONE and the stamped-vintage finding (§655; C1 magnitude struck, direction stands at 0.369); §656 the REFERENCE BASE LAW (Watabou partition-first as the foundation; R-WATABOU lane died at a session limit — re-scoped to include the LIVE DISSECTION, FTG is one-shot-per-day so instrument first); §657.2 the fix plan splits: process/instrument cars START, all map-code cars HELD behind the study. **§§658–662 COLLECTED under the stop**: the dissection's first haul (MFCG's live class model — Topology+wards+Growers / named Views — §652's contract as shipped architecture); TRIAGE verdict (the scary tree is a STALE DISK frozen 2026-07-15, no damage; ⛔ 823 docs/archive files existed on NO branch — pinned at tree-triage-pin-2026-08-25=937889b26 and COMMITTED home acaf6510b; marketing/website 432 files + 33 staged FP_ARCH edits → OWNER DOCKET; fold law banked: archive file lands in the SAME commit as its pointer); MEASURES (10-arm exhibit honest — port failure is an ATLAS GAP, CAR-PORT-ATLAS chartered; quay arms REGRESSED river towns (water-gate glyph collision, taste order now PAGE SCALE FIRST); bridgehead fires 2+1 and REG-4's zero had decayed; TE-WSEAM ruled MACHINERY — drawn-river agreement 2.63%, exemption never fires, ratchet pinned); WAREHOUSE ROUND 3 = 50% VALID, dress-is-destiny (§661: class re-scoped to context-bearing; round 4 after the paint rebuild); INSTRUMENTS (i12 tangential census: ⛔ 237 crossings / 42.4% violations, relict rings obey while standing rings are ignored — the growth conviction's clearest face; i8 2→0; WSEAM ratchet; exit codes; workspace r3 = 6a5b3dd90). STILL HELD: all map-code cars. **§§663–667: THE DISSECTION COMPLETED ITS CORE AND THE PACKAGE WENT OUT** — six captures (dissect/*.json: a city is ~700 polygons + 3 constants; the size band never moves with scale; bridges are `planks` 2-point edges = §651 verbatim; the village exports `extendable` growth-frontier points; FTG is FULLY CLIENT-SIDE on 8 workers, stores a regenerating RECIPE, and its config tree models layout as growth stages with placeWallAfter). **§669: THE OWNER SAID GO — THE SPINE IS RELEASED.** §668: TownGeneratorOS is GPL-3.0 — clean-room discipline binds (observation-only; no GPL code read; legal comfort → owner docket). **DESIGN_SPINE.md is WRITTEN** (the partition: ward/block/plot faces · typed edges way/wall/bank/crossing/bound · construction per ledger epoch · views under the three-clause contract · the identity law: page masses carry member-plot ids) — **PANEL RULED §670 (0/5 refuted; 7 blockers → DESIGN_SPINE A1**: representative substrate · party-run page unit at 2.7–4.6 rw² with bijection identity · WALL as thin face with facet-resampled wrap · the ledger EPOCH-FOLD reconciliation · corridor cure absorbed · incremental construction with an owned perf exit · CLIFF/accessible/A6.1-emission/GROW-B content folded in). **§680: SPINE-1 SEALED** = `map-sandbox-spine1-partition` @ `e2aec4089` (never-noded split-only arrangement — planarity by construction; constructor 261 ms vs 2,500 budget; SPRAWL 0 every walled leaf; E1's honest red = 2 epoch-quantum crossings, cure = SPINE-2's spatial index; band constants PROVISIONAL-NOT-YET-IN-BAND, tightening SPINE-2's toward the 1.71 invariant; E11 arm re-homed to the dress re-base). **§681: SPINE-2 SEALED** = `map-sandbox-spine2-water` @ `3542e5a65` (18/18 incl. the metropolis; the E1 quantum cured by the mint-time snap bound over an append-only spatial index — SPINE-1's 'exactly on' corrected to 0.132-quanta-off by exact arithmetic; water ground; the WSEAM class REBUILT-and-caught in the lane's own bank smoothing; **the band lever re-named: refusals/plot ≤ 0.255**, reduction = GROW-A's; ⚠ standing FULL-ARM law: every armed run includes --river). **§684: GROW-A SEALED** = `map-sandbox-growa-ledger` @ `82fb8bbfb` — **THE WORLD GROWS** (town years 60→894→1,197 plots; year-18 prints as a HAMLET; planted control convicts the frozen legacy path); the band EMERGED at 1.68–2.03 vs the 1.71 invariant with zero constants moved (refusals/plot 0.653→0.012 — 97.3% of all geometric refusals were ONE twice-counted boundary-probe defect); the fjord 3,169→95 ms by bucket index (the predicted cause REFUTED by profile — profile before assigning). **GROW-FOLD chartered §684.3** (raise-before-growth in the fold; C1 re-based at its exit) and IN FLIGHT next; THEN DRESS-1. **§682: THE SUCCESSION ARCHITECTURE IS WRITTEN — docs/DESIGN_SPINE_COMPLETION.md** (every remaining wave to the port: DRESS-1/DRESS-2 · zoom · words · judging-with-rubric · decline · film · THE PORT's compiled gates · the seating car · **§9 = the twelve chair laws + the owner-gated list for an Opus chair**); **PANEL RULED §683 (0/5 refuted; every blocker into the PANEL AMENDMENT — the ford's true plate hf264 · the built-band-with-toft-ground look · the wall contract as DRESS-1's opening act · wear provisionals licensed · the gestalt gate's ≥80% blind-key mechanics · the chair closes rounds, the owner closes the specimen · the silence law · the port completed · instruments preserved LIVE at reg-instruments-2026-08-26-r4=79c02a0ea · docs/OWNER_DOCKET.md is the parking place).** An Opus successor: read §682.2's authority chain, §9, then the PANEL AMENDMENT — every known judgment is pre-made; escalate only what PA.7 and the docket name as the owner's. Available meanwhile without prejudice: FTG entity-schema + simulate-time passes (settlement lives ~24 h) · the dwelling capture · the R-WATABOU dossier formalization from dissect/**; two lane memory topic files await the next index fold. **SLOT MOVED: `claude/composite-r4` = `73f5dfc02` (65 cars — TE-SEAM-B
landed §633.2: realm-map tier chains → landed popToTier; declared shift window 241–400; census
tuple now `2,525/366/2,159/21,059/5,854`).** **REG-4 SEALED** = `map-sandbox-reg4-markets` @
`7fba086d5` (§632: seam 0/141 + convicting mutations · V-B13 23/23 · fossils consumed from §18.4 ·
faubourgs 129/129 typed · sliver census 0/23,436 · dormancy+determinism 29/29 · F-C floor SIGNED ·
taste gate PASS; ⚠ the seal is 7fba086d5 NOT §632.1's 5cce5782d — §633.1's correction).
**§632.3: REG-GROW MINTED (vetoable)** — the differential convicts the engine (509 untyped
extramural bodies past a standing circuit; intramural falls 1,414→883 while the suburb rises);
ruled CHARTERED REPAIR under the owner's wall law; architecture-first, after REG-SEAM, feeds
REG-T2. **IN FLIGHT: REG-SEAM** (base 7fba086d5 — §631.3 band reconcile + OP_CEILING §628 landing
+ seam-window liveness probe; receipt → laneREGSEAM-receipt.md) and **REG-I1** (instrument debts
§632.4: seven i8 rows · i5/i6 armed re-runs · triangular/bridgehead liveness · ratchet-unit
review · warehouse fixture cure; receipt → laneREGI1-receipt.md). Open dispositions: COVER-REFRESH
car (public-bucket covers never invalidated) · burgToConfig deletion → dead-code sweep. ⚠ ARC SUPERSEDED — A13.1/§675/§677 govern the released arc (F0 = legacy sweep only per A14.1;
the OSR mint anchors per §677.2(vii)). Historical spelling kept for the record: Arc:
REG-SEAM → REG-GROW arch → REG-T2 → REG-5→9 → D → 10 → 11 → F0 → F → P; then catalog residue →
DW 42 → AD 17 → OSR → parity → ultra (OWNER) → walk + ONE regen → soaks → STOP at tuning.

### (historical) STATE AS OF §631 (2026-08-25 ~04:35) — REG-3 SEALED AT 82 %, THE BAND-SEAM RULED, THREE LANES LIVE
Ledger through **§631**. **REG-3 SEALED**: `map-sandbox-reg3-shapes` =
`93fa8a2ca` (§628 — blind silhouettes **18/22 = 81.8 % PASS**, warehouse class carved out as
UNPROVEN-BY-DEFECTIVE-FIXTURE — quay fixtures rendered area:0, re-round owed after fixture
cure; §592 salience REVERSED 12/12; lettering-floor save BANKED as law; §217 raises SIGNED:
hamlet 1,400 · village 2,000 · town 9,300 · city 10,000 · metropolis 14,200; ratchet-unit
review chartered — DOM-nodes+render-time candidates at the instruments' next touch, which
also owes the two i8 trace rows; diagonal roof-tick cure FORWARD-ONLY; J-REG3-2 ratified —
dark monument now, hf323 white-roof at the zoom ladder). **§629 = the B13 MINT** (chair's,
vetoable): nine-glyph V-B13, per void, hamlet 0 · village 1–3 · town 3–7 · city 4–9 ·
metropolis 5–12; encroachment islands are building-class fossils, not fixtures. **§630 =
L-REG-30, the MINIMUM-FOOTPRINT LAW (owner, verbatim in the ODQ)**: no small one-room
blocks — sub-minimum fuses into a neighbor or goes undrawn; §630.4 sole-structure/landmark
clamp; monuments absorb, never absorbed; ink-side only; program doc Amendment **A7**; home
REG-4. **IN FLIGHT: lane REG-4** (Opus — markets/faubourgs/densification/L-REG-30, base
`93fa8a2ca`, receipt → laneREG4-receipt.md; mid-flight instruction sent: band-agnostic
fixtures, no hard-coded tier boundaries) and **lane TE-SEAM-B** (Opus — the shipped hamlet
240→400 window, build-branch car at slot `e4ed27f48`, receipt → laneSEAMB-receipt.md; the
chair CASes on green). **TE-SEAM DELIVERED AND RULED (§631)**: the seal's tier table
(8000/40000 vs landed 5000/25000) is DRIFT that INVERTS the elegy instrument (healthy
cities render demoted); skeptic panel 3/3 not-refuted — §155.1's banked conviction already
requires bands to match POPULATION_RANGES; **R1(ii) ADOPTED — the REG-SEAM car is
chartered and stacks immediately after REG-4 seals, before REG-5** (scope itemized §631.3;
REG-P gains the `tierForPopulation ≡ popToTier` execution gate); **REG-T2 UNBLOCKED**,
builds on REG-SEAM's seal. A successor: collect in-flight receipts FIRST (§448 — resume
MID-LANE from the receipt, never restart). Arc after REG-4: **REG-SEAM → REG-T2** →
REG-5 → 6 → 7 → 8 → 9 → D → 10 → 11 → F0 → F (owner judges specimen) → P; then the
catalog residue (CH-3 → MF-CH3 flip → CH-2B → CH-6b → divine-healer row) → DW 42 → AD 17 →
OSR → parity → ultra (OWNER) → walk + ONE regen → soaks → STOP at tuning.

### (historical) STATE AS OF §621 (2026-08-25 ~00:15) — WALLS ON FUSION ON CLIFFS, ALL SEALED
**Slot `714a398b7`… superseded — build branch `claude/composite-r4` = `e4ed27f48` (64 cars:
MF-CH7 §570 · MF-CH4 §582 · DEPLOYDOC-188 §588 · MF-CH6 §597).** Ledger through **§621**.
**THE REGISTER ARC** governs all map work: `docs/DESIGN_REGISTER_PROGRAM.md` + A1–**A6** (two
skeptic panels ruled, §586/§618). SANDBOX SEALED THROUGH: `map-sandbox-reg1-fusion`
(`d1b32e339`, §602) → `map-sandbox-reg2-walls` (`8890e3f3e`, §621 — regimes 22/22 by fixture,
derived wear, 13 retained judging artifacts). Owner laws §570–§616 all integrated; **§612 the
PURPOSE LAW is the final tie-breaker; §580 the north star; §591 totality/weakest-element.**
The Chronicle Film program: §606–§609 + §613 (film LAST) + A6 (schema module, REG-F0 backfill,
held beat arms). Preserves: mf-a1-recovered · map-corpus-docs · research-dossiers-r2 ·
reg-instruments (r2 baselines at fusion tip) · reg-detail-register (BINDING) · the sandbox
seals. ⚠ OPUS-RUN markers (§620): the CH plan (validation = CH-3 dispatch's first act) and the
AD charter (validation = AD window's first act). §217 raises SIGNED: town 5,400 · city 6,800
(byte-edit rides next harness touch). Chartered open: the coastal-trace declared-shift car
(§621.2ii) · CH-6b · the i8 §15r row · REG-F0 · the just-in-time compiles (§619). §585
delegation stands; carve-outs per §585.1 verbatim; mandate runs to the terminal soak.

### (historical) STATE AS OF §595 (2026-08-24 ~16:50) — THE REGISTER ARC IS LIVE AND MEASURED
**Slot `714a398b7` (63 cars — MF-CH7 §570, MF-CH4 §582, DEPLOYDOC-188 §588 landed this
sitting; MF-CH6 re-proof gate in flight at rebased `e4ed27f48`, lands 64th on green —
§594).** Ledger through §595. THE REGISTER PROGRAM governs all map work:
`docs/DESIGN_REGISTER_PROGRAM.md` + A1 + **A2 (the 43 panel findings ruled, §586)**; owner
laws §570–§584 + §590 rampart spec + **§591 TOTALITY (weakest-element grading)** + §593
overhead/plan-view roof standard + §580 north star. ⚠ The old "wave nine" bucket below is
SUPERSEDED by the REG waves. **Preserves this sitting:** `mf-a1-recovered` ·
`map-corpus-docs` · `research-dossiers-…-r2` · `map-sandbox-regg1-cliffs` (§589 sealed) ·
`reg-instruments` (§592, baselines + the zero censuses with liveness) ·
`reg-detail-register` (§595 — BINDING per-class anchors incl. the corpus's own spec/zoom
instruction plates). CH-6b chartered (receipt taxonomy-read cure → licence routing);
divine-healer content row → content train; fjord-crag + wall-regime + B13 constants → the
tuning docket. §585 delegation stands: all judgments the chair's, vetoably; by-nature
carve-outs survive (push/deploy/cutover/tuning signature/legal/cull/ultra); mandate runs
to the terminal soak.

### (historical) STATE AS OF §585 (2026-08-24 ~14:20) — FULL JUDGMENT DELEGATED; RUNNING TO THE SOAK
**Slot `233c35a69` (62 cars — MF-CH7 §570 and MF-CH4 §582 both LANDED this sitting) · census
`2525/366/2159/21049/5852` · packets 181 · ratchet 11 of 29,067.** THE REGISTER PROGRAM is the
active build priority: `docs/DESIGN_REGISTER_PROGRAM.md` (§581 + A1 §584; skeptic panel in
flight, findings fold as A2). Owner laws §570–§584 govern every visual call — §580 is the
north-star tie-breaker; §583 signs 10–20s first-paint. **§585: ALL judgments are the chair's
(incl. register taste gates, vetoably); by-nature carve-outs stand (push/deploy/cutover/tuning
signature/legal/cull/ultra). Mandate: run to the terminal soak, then hand the owner the pen.**
LANES (4): TE-REG0-R2 (everything-on specimen) · TE-CH-6 (deity-doctrine cure) · TE-REG-G1
(relief substrate) · TE-DEPLOYDOC-188. Receipts in `31585ce2-…/scratchpad/receipts/`; per
§582.2 lanes poll BOTH mutex dirs. Preserves this sitting: `mf-a1-recovered-2026-08-24` ·
`map-corpus-docs-2026-08-24` · `research-dossiers-2026-08-24-r2` · `holding-ch7/ch4`.
⛔ Standing exposure: the 8.4 GB plate corpus exists on ONE disk (owner backup decision).

### (historical) ✅ COLLECTED (§564, 2026-08-24 ~09:25) — THE CH-4 GATE WAS RED: 11 ARMS OUTSIDE THE FROZEN CENSUS
The verdict was collected and the log preserved at the `31585ce2-…` session scratchpad
(`collected/gate-tail.10770.log`). No freshness/reproducibility arms — the regen took; the
11 arms are the car's own bills, classified at **§564.2** (census stamp +16 · arcane census
path:line/recorded-set · three any-casts to FIX not widen · the speculative
`powerStructure.factions||power.factions||factions` read chain · prose-numerics humanize ·
calibration W2/W8 declared-shift adjudication with a HARD STOP on any nonzero
stacked-buildings count). **TWO CURE LANES DISPATCHED (§564.5): TE-CH7-CURE (bundle-set
regen + one clean gate) and TE-CH4-CURE (the six bills, regen at final tree, mint LAST,
gate).** Receipts: `31585ce2-…/scratchpad/receipts/laneCH7CURE-receipt.md` /
`laneCH4CURE-receipt.md`. On a chair-validated green: move `wip-*` → `holding-*` (chair
moves pins; lanes do not). **C-19 IS COLLECTED (§566.2): CIRCULATION 61 / STORAGE 54 ruled** — edit specs +
adjudication TSVs in `31585ce2-…/scratchpad/c19/`; the LADDER-orphan fork and the
40-collision walker are chair items (§566.3). **CURE LANES (post-§566 resume):
CH7-CURE at `479992b6e` (regen committed + ratchet-proved; owes one quiet gate re-run —
run #1 red was four verify:dist TIMEOUTs at load 154), CH4-CURE at `ebaa0e573`
(bills C+D+E committed; B mid-edit; then F, A, regen, mint, gate).** **PARKED, AUTHORED (§565.2): the owed
DEPLOY.md 188 amendment** — exact insertion text + build instructions at
`31585ce2-…/scratchpad/dockets/DEPLOYDOC-188-CHARTER.md`; builds on the POST-landing slot
(the operative runbook is the BUILD branch's DEPLOY.md; the ledger copy carries no
migration guidance).

## ⭐⭐⭐⭐ SUCCESSION ADDENDUM — 2026-08-24 (~01:40), LEDGER THROUGH §439 — READ THIS DELTA FIRST, THEN THE §427 BLOCK BELOW

The §427 block's structure stands; THIS delta supersedes its state figures:

> **§440 CORRECTION (successor, 2026-08-22 19:45 CDT):** item 2 below is WRONG
> — T2H's gate did NOT survive the switch (SIGTERM inside test:ratchet at
> 19:21). RUN 2 was fired 19:27 CDT at the same tip 84e06412, detached by
> setsid; collect it per the receipt's rule (TRUE_EXIT=0 + tail exit line +
> disk ≥300MB at end → CAS b10ed1a1 → 84e06412). Item 4's three lanes were
> re-dispatched from their receipts at §440.4; the wakeup is job 0383ec45.
> NEW LAW §440.2: every battery exports
> `GATE_MUTEX_LOCK_DIR=/tmp/settlementforge-vitest-gate.lock`.
> **§442:** T2H LANDED — build is at **84e06412** (26 landings). WEB-1 is in
> the landing seat (GO §442.2). DWR1A collected (§442.3). The undercity charter
> is RULED at §441 (TC-UNDERCITY-R2 applying it). Holding queue after WEB-1:
> web4/5/6/7 → T2J → T2K → T2L → T2M; producers T2R/T2Q resuming; T2N next seat.
> **§446:** WEB-1 LANDED — build at **4060f690** (27 landings; migration 197 on
> the branch). WEB-4 in the landing seat. T2R (f65b3ff3) and T2Q (cc9ef856)
> COMPLETE and pinned; T2N and UC-0 building; R-INST-1 researching. HK-1
> (the dead underways facet key, §445.3) and WEB-2/WEB-3 queued.

1. **BUILD is at b10ed1a1 — 25 LANDINGS** (since §427: CT-3 landed §432 after
   the §355 hunt CLOSED — the varying-cast contamination hypothesis is
   UNSUPPORTED, the specimen was the hunt's own TMPDIR; the flake doctrine,
   TMPDIR hygiene, and the two real phenomena are §432's record).
2. **T2H's landing gate is MID-RUN, DETACHED (survives):** rebased tip
   84e06412 on b10ed1a1, pinned at refs/preserve/holding-t2h-slot; collect
   per laneTET2H-receipt.md's succession header — on TRUE_EXIT=0 + tail
   agreement CAS b10ed1a1 → 84e06412; sibling load (T2R/T2Q batteries) is
   pre-stamped context for any stray.
3. **HOLDING FOR LANDING after T2H:** the five website cars (pins
   holding-web1/4/5/6/7) → T2J (f7ba3145) → T2K (4d2d17f8) → T2L (6c920593)
   → T2M (faf3def4; sibling-of-T2L: sum-of-deltas at its slot; the blessed
   four-red window §426). The slot pattern §418/§420; prune each landed
   member's trees AT the CAS (§434.1).
4. **BUILDING (killed by the switch; resume FROM RECEIPTS, survey-first):**
   TE-T2R (the §434-RULED member: peakTier precedence, destroyer roster,
   documented calamity gap — laneTET2R-receipt.md) · TE-T2Q (charter §4 +
   §433-C6's pre-authorized fallback — laneTET2Q-receipt.md) · TC-DWR1A
   (the P1a construction-history dossier, PARTIAL at
   draft-DWR1A-CONSTRUCTION-HISTORY.md). T2N never dispatched — next free
   seat, charter §3 of draft-PRODUCERS-PLAN.md.
5. **AWAITING THE CHAIR'S RULING:** the UNDERCITY charter
   (draft-UNDERCITY-PLAN.md, collected §433 — six golden-inert cars, two
   trains, queued behind the producers; rule its RAISED then dispatch).
6. **THE DW PROGRAM (§435-§438):** docs/DESIGN_DWELLINGS_PROGRAM.md is the
   architecture + the transposed build path + the integrated sequencing —
   research runs NOW as seats allow (six R-INST tranches chartered §438,
   owner cost ACCEPTED, per-institution incl. magical-from-lore under
   conventions-never-expression + deity doctrine + finite semantics);
   sandbox in endgame quiet windows; repo-byte work post-endgame. Carry
   notes planted (undercity graph addressability; D5 part-naming; tuning
   leg-extensibility).
7. **NEW SINCE §427 in the owner docket:** the §434 engine cures O2-i/O2-ii
   (peakTier stamp on demoting paths; the uncapped realmVerbExecution ring)
   · the §433-O1 generation-side given-past fork · prngSeedEntropy's
   tolerance micro-fix chartered §432 (rides housekeeping).
8. **FRESH LAWS the §427 block predates:** §432 (the flake doctrine; short
   TMPDIR every terminal; quiet = measured load + ps -r) · §433 (producer
   architecture; the tierGrammar import-swap obligation C5) · §434 (the
   destroyer-roster law; evidence-erasure lesson 11) · §418/§420 slot
   pattern + instrument lies · §408 tests/ops sweep · §410 retrospective
   mints · §416.1 identity arm · §417 deferred rows.

## ⭐⭐⭐ CURRENT OVERRIDE — 2026-08-23 (~13:30), LEDGER THROUGH §427 — THE SUCCESSION HANDOFF
## BUILD claude/composite-r4 @ ec8f3359 — 24 LANDINGS THIS ARC; THE 25TH (CT-3) MID-GATE AT HANDOFF

**This block supersedes everything below it.** Written for an account-switch
succession: the prior chair's session (and its lane agents) die with it; every
artifact below survives on disk. The repo is authoritative over this summary.

### 0 · WHERE EVERYTHING IS
- **Ledger:** THIS branch (review-fixes-2026-07-08), docs/OWNER_DECISION_QUEUE.md
  through **§427**; docs/RESUME_STATE.md is the running act-log (read its tail).
  Ledger commits: PRIVATE-INDEX METHOD ONLY (the main worktree matches no branch).
- **Build:** claude/composite-r4 @ **ec8f3359** (24 landings: schema-10 mint →
  RR-1 → RR-2 [the 933 descriptions] → T2Bf → CT-2 → H8B).
- **The prior session's scratchpad (ALL drafts + lane receipts live here, READ IT):**
  `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/6298872d-53af-4c8a-99e5-139bfc5bfc1f/scratchpad/`
  Key files: draft-MF-T2L.md · draft-MF-T2M.md · draft-PRODUCERS-PLAN.md ·
  draft-T2S-DOOR-BRIEF.md · draft-WEBSITE-PLAN.md · draft-MF-T2K.md ·
  lane receipts laneTE*/laneTC*-receipt.md (the survey-before-resume inputs).
- **Auto-memory** (same machine+path ⇒ same dir) is current; MEMORY.md indexes it.

### 1 · SUCCESSOR'S FIRST ACTS, IN ORDER
1. **Re-arm the §388 wakeup** (CronCreate, `13,33,53 * * * *`, session-scoped —
   the prior job died): prompt = the four checks, headlined **"IS EVERY BUILDABLE
   CAR BUILDING?"** + raced-GO/lost-lane/read-never-extend protocols (§388).
2. **Collect CT-3's landing** — its terminal was MID-GATE at handoff, DETACHED
   (survives the session): receipt `laneTECT3-receipt.md` names the log paths.
   On TRUE_EXIT=0 **plus** the gate tail's own exit line: CAS
   `ec8f3359 → b10ed1a1f5a0f2acd00bbfc9b5d0a41931697c3d` (verify ancestry
   first; CT-3's retraction-grep was ZERO — the §401 false claim stayed dead),
   then delete refs/preserve/holding-ct3. ⛔ NEVER READ THE CAS TARGET OFF
   THAT PIN: holding-ct3 points at ba806682, the PRE-REBASE tip still carrying
   the §401-retracted claim — landing it resurrects the retraction. The ONLY
   lawful target is b10ed1a1 (above, and in the receipt's bordered block).
   On a red: classify per §358.2/§355
   (load ~88 from three sibling batteries was PRE-STAMPED as evidence in its
   receipt — expect TIMEOUT-class strays, one quiet re-run, second stray STOPs).
3. **Survey the killed builders BY RECEIPT (the 529-law — partial edits exist):**
   TE-T2L (vegetation, draft-MF-T2L.md ruled §425) and TE-T2M (arch-history +
   the Shape-B strip, draft-MF-T2M.md ruled §426) were BUILDING at handoff; both
   were ordered to checkpoint (commit verified WIP + receipt). Read their
   receipts; re-dispatch fresh executors that RESUME from the receipt+worktree
   state (verify every claimed proof before trusting it).
4. **Continue the landing cascade** (ONE gate at a time, the §418/§420 slot
   pattern): after CT-3 → **T2H** (pin holding-t2h-r2 = 05e7f9d5; ALSO delete
   the stale holding-t2h = superseded 2064a67e at its landing) → the five
   website cars in GO order → T2J (f7ba3145) → T2K (4d2d17f8) → T2L → T2M.
   Every GO carries: rebase with carry-proof-by-absence FIRST, manifest
   keep-both + row-level deep-compare (string-aware surgery), re-stamp DELTA
   never tuple, S0 two-part READ LIVE (baselines quoted as context only), the
   detached-own-session terminal with heartbeat-every-sample and
   LIVENESS-PROBE-BEFORE-RECLAIM. Website pins: WEB-1 4065b326 · WEB-4
   378f9276 · WEB-5 6d6572ea · WEB-6 5b0a399f · WEB-7 e5975829. ⚠ WEB-1/WEB-6/
   WEB-7 each founded packets/website/ differently — second-and-later landings
   keep-one on the family header, keep-both on rows. ⚠ WEB-1's landing carries
   migration 197 → then WEB-2/WEB-3 UNBLOCK (dispatch from draft-WEBSITE-PLAN
   §2/§3; migration numbers sequential). ⚠ T2L's landing act carries the §419
   rename (CODEX_SLICE_MODULES→UNASSIGNED_LANDED_MODULES) + deferred rows;
   T2M's carries the BLESSED four-red validate:packets window (§426 — clears
   at the LANDED flip; never a failure).
5. **Rule + dispatch the producers train:** read draft-PRODUCERS-PLAN.md
   (collected §424, NOT yet ruled), rule its RAISED split, dispatch T2N/T2Q/T2R
   executors (T2N/T2R pure derivers golden-inert; T2Q rides existing verbs per
   §423). Docket the T2P compile (§424 RAISED-C1 confirmed).

### 2 · THE ARC'S BINDING LAWS BY § (full text in the ODQ rows)
§389.1 the bare gate script IS the envelope instrument, TWO-PART reading (exit
AND printed line; §397) · §393 attribution sweeps MUTEXED · §395 arm-and-wait
watcher = terminal standard · §408 the pre-gate sweep is tests/lint tests/build
**tests/ops**; a new migration owes a NEW reviewed wave · §410 retrospective
packet mints enter at TERMINAL status · §414+§416 the wrapper-timeout gate-kill
class; liveness-probe (ps the lock pid) before ANY reclaim; heartbeat every
sample · §416.1 movement guards need an IDENTITY arm · §417 stacked members
DEFER shared walker rows to the landing act (texts in each packet) · §418/§420
the slot pattern + four instrument lies (rev-parse echoes its arg; sed \b;
vitest positional filters; gate-tail body in $TMPDIR) · §403.1 a truncatable
instrument needs a COMPLETENESS check · §423 THE DOOR: store registry = verb
census, domain = payload grammar, Option-D structural law · §406 consent
provenance signals are non-equivalent (the conjunction predicate).

### 3 · AFTER THE CASCADE (the standing remaining-arc, ~35-55h)
Producers build+land → WEB-2/3 → content tail (WF-8 shrink-back CAR carries the
§400 FTH-3 doc shrink; CT-4 undercity chapter; CT-5; ONE trailing OSR mint per
§384.2 with the attribution table: general=CT-2, warFaith=CT-3, +T2M's lawful
flip) → undercity train (compile first) → housekeeping (HANDOFF re-refresh,
MEASDUAL phase-2 at a quiet window, §384.2b durable doc [chair-authored —
governance], INV-EVS worktree prune after the owner rules) → **THE DW
PROGRAM (§482: DW-0 charter → DW-R → DW-1..7 → DW-S wiring; DW-0 starts when
R-INST-6 delivers; builds on Opus) → the ONE trailing OSR mint after the last
DW car → parity train (DW facts included)** → the §290 review stop
(/code-review ultra — OWNER fires it; reviews DW too) → ENDGAME: walk + ONE
regen → terminal soak WITH the DW leg → TUNING WITH THE MAP LEG (§341; owner
signs) → V5 waves → cull → IP scrub (two docs leave the repo) → push.

### 4 · OWNER DOCKET (untouched by any lane)
Tuning signature · cull §67.6 · every push/merge/deploy · three db-push
migrations · copy walks (beat copy, FALL_SENTENCE, §320.3 wording, RR-2 glance)
· 'campaign' word (rec: keep-and-reword, §402) · O3 retroactive purge (rec:
purge) · the §399 viability-summary fork (rec: projectBeside keyed on
_userEdits; third arm honest) · TinyMCE/GPL + FMG counsel · support mailbox ·
CI log paste · founder-transfer legal · partial refunds NONE until the webhook
deploys.

## ⭐⭐ CURRENT OVERRIDE — 2026-08-22 (~01:40 ET), LEDGER THROUGH §345;
## BUILD claude/composite-r4 @ 27c250f9; EIGHT LANDINGS — D3a CORE + WF-1 LADDER COMPLETE

This block supersedes everything below it (the earlier 08-21 and 08-20
overrides become history where they conflict; the map-architecture content of
§287–§290 remains binding).

1. **THE SITTING (ODQ §291–§298) IS COMPLETE** — all 30 queued rows ruled; the
   queue file is EMPTY. Operative law: §291 grant (incl. EMERGENT permissions;
   the review-improve doctrine; 30-min wakeup; four lanes) · §291.5 seats
   (Fable architects/judges, Opus verifies/implements) · §292 five refinements ·
   laws **L1–L7** (grade-drift · routed-orders · receipted-instrument ·
   redefined-census · zoom-scope · whole-channel holdout · corpus-is-a-sample).
   REVERSED at the sitting: §240's ceiling table + free-dividends; §250's epoch
   figures (true window-independent range 1.33–1.44×); §242's holdout rows.
   The sitting's recurring defect class was RECEIPT→LEDGER TRANSIT — quote
   receipts, never summarize grades up.
2. **SEALED SINCE (§299–§310):** MF-D0 (offset kernel; 38 self-crossings → 0)
   · MF-D1 (all five §287.8 foundations at ZERO bytes) · CF-1 (corpus gate
   313/313) · CG-1 (codex tip landed; the §296 arc CLOSED as port-target per
   §303.5) · **fresh W3 SEALED** (SW-1 5/5, the 11th world; map code of record
   = the sealed lane tips, preserved at refs/preserve/map-sandbox-w3f-sealed) ·
   **G-39 REFUTED** by the pre-registered perimeter-range rule (register
   0.69–0.72) · **G-43 LIVE** (the counterfactual benchmark; three engine
   findings — high-water starvation 16/17, wall-year inertness, the cathedral
   floor; causal precision 0.039 is THE inertia number and THE tuning-pass
   input) · **RS-4/P4 CLOSED** (162/162, none below floor) · **WF-1B LANDED**
   (suppressDeity single writer; census +8) with RS-5 fired at its exposure.
3. **WF/MF FAMILY MACHINERY (§312–§321):** WF-PREAMBLE and MF-PREAMBLE landed
   chair-signed (MF stamp granted §312.2b) · ⭐ §314.2 CITATION RE-STAMP LAW —
   a preamble edit re-hashes the family law, and the editing act owns every
   citing packet's re-stamp in the same landing (executed at build commit
   2cdb87fa) · MF-T2A landed (map port member 1) · WF-1C compiled (its §9
   GOVERNS: no CAS until executed greens arrive; the receipt names tip
   253f2028) · the WF-1D compile collected at §321 (net-zero warTermination
   join 818/818; a dead Chronicle row REFUSED with an absence pin; the
   minter-totality walker arm ordered §321.2a; WF-1E seeded) · **§320 LAW: a
   delivered spec is presumed implemented until the live tree says otherwise**
   (the landing-page stale dispatch was correctly refused). Undercity doctrine
   complete at §311–§311.9 (component law = LICENSE + ANCHOR + EXTENT-DRIVER +
   TEMPERAMENT + CAUSED-PORTALS; four temperaments; connectivity classes).
   V5 counsel bank recovered byte-exact (refs/preserve/v5-counsel-bank);
   program receipts preserved out of /tmp
   (refs/preserve/program-receipts-2026-08-21).
4. **THE 08-21→22 DAY: EIGHT LANDINGS, SEVEN CASes, tip 27c250f9** — WF-1C ·
   MF-T2B(+fence) · notices · WF-1D(+the four-file zero-headroom law) · the
   OFL completion · MF-T2C · WF-1E · MF-T2D. **D3a's CORE IS COMPLETE** (the
   map engine's mathematical spine ported dormant); the WF-1 ladder complete
   but for WF-1F (in flight). RS-5: 162/162 CLEAN, preserved at
   refs/preserve/rs5-soak-complete-2026-08-21. ⚠⚠ RULE CHANGES THIS SITTING:
   §336 the owner's blanket grant → the §187 delegable items are CHAIR
   rulings (sitting in progress → §346); §337 the soak GATES NOTHING —
   implementation always parallel; §341 the tuning pass gains a MAP LEG;
   §343+.3 Fable-tier implementation AND verification at chair discretion
   under the named appropriateness test. LAWS BANKED: §325.2 (fired 4×,
   caught 4×) · §325.3 · §332.1 wrong-instrument (+§345.1b printed-value
   cousin) · the transcript-recovery route (§338.4). IN FLIGHT: TE-WF1F
   (slot-aware onto 27c250f9) · MEAS-MINKEYS · TC-T2E compile · the §187
   sitting. NEXT WAVES: T2E/D4 → parity slice → §290 review stop
   (/code-review ultra = owner keystroke anytime) → visual waves → undercity
   → endgame tail (tuning LAST, now numbers+maps).
5. **ULTRACODE (probed 08-21 ~15:00):** an Agent `remote`-isolation dispatch
   MATERIALIZES LOCALLY (a worktree on this Mac at .claude/worktrees/) — cloud
   lanes are NOT reachable from a session, so the local box is the compute
   envelope and §302.3 load orchestration stays. The working cloud lever is the
   owner-typed `/code-review ultra` (bundles the local branch; needs no push) —
   recommended AT the §290 mandatory review stop once the cascade lands. Do
   not re-probe.
6. ⛔⛔ **UNCHANGED DOCKETS (owner's, visible):** the vendored-FMG/TinyMCE
   exposure (§295, owner/counsel; the working tree's public/map drop is
   foreign WIP — NEVER commit it) · §317.1 website decision list · §316.2C
   beat copy · §320.3 anon-ceiling disclosure · tuning-signature items · every
   push remains owner-gated (the repo has never been pushed).
7. **RESUME:** docs/RESUME_STATE.md's hand note is current to the minute; the
   §-numbered rulings are the authority. Session scratchpad 6298872d-… holds
   the drafts (WF-1C/WF-1D/D3A-PLAN/MF-T2B + the WF-1E seed), lane receipts
   and executor worktrees; the a244e7a3 scratchpad holds the sealed map lane
   tips and the rs5 machinery.

## HISTORICAL OVERRIDE — 2026-08-20, ledger collected through §289

This section supersedes the older topology/immediate/queue snapshots retained
below as history.

1. **ROOT / LEDGER:** `/Users/cstokes/Desktop/settlement-engine` is currently
   `review-fixes-2026-07-08@3e3366b9` with a very large shared dirty/index state.
   Preserve it exactly: no reset, stash, clean or broad add. Review edits are
   working-tree-only; no index/ref was moved.
2. **BUILD:** `claude/composite-r4@4eafca31`. The former `minifold` worktree is
   absent. Old integration trees at `/private/tmp/MFINT1-tree` and
   `/private/tmp/MFINT1-fab` are detached at `ac243e1c`; they are evidence, not
   code of record and are **not** generically map-identical to the current
   build-out. The audited `habitation.js` matches, but the MFINT1 `fields.js`
   and `commons.js` are stale relative to the code-of-record sandbox hashes
   recorded in the rural Wave-1 report.
3. **MAP SANDBOX:**
   `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/mf-proto/build-out`.
   W0/W1/W1B/W2 have receipts/outputs. W3 was killed mid-lane; its tip changes
   four geometry/wall files, has no changed tests, receipt, manifest or W3 output.
   Preserve it as an abandoned experiment. Restart fresh from sealed W2 after
   the standalone offset foundation; do not accumulate on the partial tip.
4. **CANONICAL MAP ARCHITECTURE:** read
   `map-corpus/docs/GENERATION-SPEC.md` §§6–10. §§6–9 are design-only;
   ⟦FOLD §287⟧ §10 is the binding cohesion reconciliation; owner decisions §§288–§289
   amend its lighting and content-origin boundaries and win on those seams.
   The target is one strict-plan, one-leaf map with durable spatial truth,
   temporal observation, a settlement-level solid/light-query index, one-leaf
   view occlusion and one addressable semantic draw list. Shadows are projection
   results, not dimensional-scene truth.
5. **LIVE-CODE REALITY:** no dimensional scene or authorship document is built.
   Four map candidates exist (legacy TownMapModel, hidden townCartography,
   sandbox fabric, dormant arch). Port repaired `fabric/**` as the sole geometry
   authority inside existing privacy/digest/budget and operation/persistence
   seams; do not create a fifth map or extend townCartography in parallel.
6. **CORPUS:** 313 plates + 313 previews. Run
   `python3 map-corpus/docs/corpus_integrity.py`; it now includes the separate
   historical-evidence registry gate.
   The 53-id set is a closed legacy pixel-evaluation roster, **not** an untouched
   calibration holdout. Its images should still be withheld from fresh
   implementation/evaluation lanes. A true blindness claim needs a new sealed
   external set. `map-corpus/docs/HISTORICAL-URBANISM-EVIDENCE.md` and
   `map-corpus/historical-evidence/` keep source geometry, scholarly
   reconstruction and generated realization separate. The initial registry has
   no prevalence cohort and may not tune probabilities. Corpus teaches visual
   register; history teaches bounded structure; dossier/world receipts teach cause.
7. **NEXT SAFE ORDER:** owed Fable retrovalidation → standalone D0 offset kernel
   from W2 → executable manifest/coordinate ABI/solid legality/spatial receipts/
   DCEL face/adjacency dual-run → fresh W3 → frontage/parcel DCEL equivalence →
   instruments → D3a's dormant explicit-input dimensional foundation; D3b and
   every empirical massing/material resolver wait for `AMP-1`. Structural
   authorship remains parked until frontage/identity and the core operation
   adapter exist. No dimensional or authorship implementation was dispatched by
   §§287–§289.
8. **HISTORICAL LAW:** do not implement a country/style switch or a universal
   medieval grammar. Historical chronology is a dated mechanism graph over
   substrate, routes/crossings, nuclei/jurisdictions, projects, parcels and later
   occupation; it is distinct from compiler S-stage order. `PLAN_INTENT` and
   `PLAN_REALIZATION` are separate manifest artifacts. A cited town is a bounded
   possibility/counterexample, never a prevalence prior or geometry template.
9. **RESEARCH COMPLETION:** the current 32 records / 23 places / 20 mechanisms
   are Wave 1 and carry zero prevalence. Read
   `map-corpus/docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md` and SPEC §10.21.
   Calibration requires 80–120 balanced towns, 30–40 complete-package audits,
   mechanism-specific cohorts, a truly sealed 15–20% holdout, separate rural and
   building-massing programs, explicit `EUROPEAN_FANTASY_BASE` scope, mechanism
   saturation/range stability and held-out structural transfer. Stable typed
   foundations may proceed; numeric/cultural probabilities may not. Non-European
   morphology is not a completion gate: the live non-European culture tokens remain
   prose/naming inputs and activate no map grammar unless a future owner-authorized
   evidence program adds a new map tradition.
10. **RURAL + ARCHITECTURAL EVIDENCE BOUNDARY:** read
    `map-corpus/docs/ARCHITECTURAL-MASSING-EVIDENCE-WAVE1.md`,
    `map-corpus/docs/RURAL-SETTLEMENT-LANDSCAPE-EVIDENCE-WAVE1.md` and SPEC
    §§10.22–10.23. Both are European Wave-1 discovery surveys, not calibration
    registries. Stable composite/support/component/history types and a canonical
    `RuralLandscapePhase` may proceed. Their independent 18% clustered holdouts can
    validate scoped conditional engineering ranges and coherence mechanisms; they
    cannot identify height/storey/roof/material occurrence distributions, agrarian
    or tenure prevalence, count/frequency/activation weights or prosperity/material
    probabilities. Those remain `NOT_IDENTIFIED`/`NONE` without a separate
    probability-sampling protocol. An explicit canonical world cause may activate
    this settlement while those population-level fields remain unidentified. The current
    sandbox still builds fields and worksite habitation
    after the urban umbrella, guesses fallback tillage/routes and carries
    conflicting production readers; it is experimental presentation machinery,
    not canonical world truth. Missing rural canon yields `STRUCTURAL_ONLY` or a
    typed refusal, never open fields by default.
11. **GLOBAL SUN/MOON + PERCEPTUAL LIGHT OWNER LAW (§288):** the dimensional
    plate has exactly one global celestial directional source at effectively infinite
    distance, with parallel rays and one azimuth/elevation across every active leaf;
    local fixtures never rotate with it. Normal output uses a registered fixed-survey
    convention. An explicit Light Probe may preview the global direction without WORLD
    mutation; pinned-document and licensed world-time modes are distinct persisted/
    observed authorities. Export defaults to exact registered high-noon/high-moon
    conventions unless the request explicitly selects pinned, world-time or finalized
    current light; ephemeral probe state never leaks into export. Zero tilt remains.
    Heavy ray/path-traced GI, volumetric/screen-space authority and renderer blur remain
    refused, but deterministic analytic ambient, contact occlusion, bounded reflected
    colour, factual environmental modulation, finite registered softness, source-local
    restrained glow and closed material response are legal projection effects. This is
    a specification/governance amendment only: PLANAR exposes no probe, and implementation
    waits for D3a canonical solids/material slots plus D4 shared occlusion/draw/export truth.
12. **BUILT-IN/CUSTOM PARITY OWNER LAW (§289):** every canonical spatial fact resolves
    provenance origin `BUILT_IN|CUSTOM|IMPORTED|AUTHORED`; origin never changes geometry
    legality. Exact custom registry/version snapshots participate in hashes and saved canon.
    Missing/removed custom content remains visibly unresolved with its last canonical bytes;
    it is never silently deleted or reinterpreted. Built-in and custom forms of one semantic
    type run identical placement, support/solid, persistence, privacy, render and export tests.
    A custom fantasy work such as a necromantic floating citadel needs explicit canon plus a
    registered operation/recipe—not a fabricated atlas citation. Historical gates govern only
    claims of cultural/historical authenticity or culture/period-conditioned defaults; a separate probability protocol governs
    population prevalence. Automatic morphology remains `EUROPEAN_FANTASY_BASE`; names and
    explicit custom canon are valid outside it, but no other settlement tradition is falsely
    claimed authentic before its own researched pack exists.
13. **CORE-FIRST STOP LAW (§290):** do not hold the first implementation hostage to every
    conceivable edge case. The release-blocking slice is exact save/reload and deterministic
    identity, one built-in/custom semantic pair, missing-package read-only recovery, one registered
    fantasy operation, PUBLIC/DM privacy and screen/export parity on surface
    `EUROPEAN_FANTASY_BASE`. Only data loss/corruption, second geometry authority,
    nondeterminism, privacy leakage, silent fact invention or false historical authority on that
    supported path blocks now. Foundation/D1 → fresh W3/frontage → D3a → D4 → parity slice, then a
    mandatory measured review. Deeper portal, multi-package, operation-family, probe/world-time and
    future-tradition combinations stay recorded for later unless a real supported-path failure or
    owner decision promotes them.


---
<!-- fold boundary: the following span was lines 801–880 of the pre-fold file -->
---

## HISTORICAL topology snapshot (superseded by CURRENT OVERRIDE)
- LEDGER branch `review-fixes-2026-07-08`: docs/OWNER_DECISION_QUEUE.md (THE
  record, then §233) + this file. The MAIN worktree
  (/Users/cstokes/Desktop/settlement-engine) was managed as a dirty control tree — commit to the
  ledger ONLY by the private-index method (GIT_INDEX_FILE + read-tree +
  commit-tree + update-ref with old-value assertion). NEVER `git add -A`.
- BUILD branch `claude/composite-r4` — currently at **66fda66d** (WF-1a, the
  faith family's first slice). Executor lanes stack DETACHED in the worktree
  .claude/worktrees/minifold and report tips; the chair moves the ref by
  compare-and-swap. Foreign stash@{0} (analytics-intelligence-layer) is the
  owner's — untouchable.
- SCRATCHPAD /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/
  a244e7a3-27d9-4152-b847-cf42cf4b08a7/scratchpad/ — all lane receipts
  (laneXX-receipt.md), the map sandbox (mf-proto/), exemplars (mf-proto-out/),
  and the map sandbox. ⭐ **THE REFERENCE CORPUS NOW LIVES PERMANENTLY AT
  `map-corpus/` IN THE REPO ROOT** (§243; git-ignored, 313 plates + previews +
  docs/ with the calibration index, the urbanism atlas, the round receipts and
  the measured register). CITE map-corpus/ — the scratchpad `map-refs/` is a
  temporary mirror that may vanish.

## HISTORICAL IMMEDIATE state (2026-08-17 ~01:30 ET, ledger at §236; superseded)
The session-limit pause is OVER; all its debts are settled.
1. **Build branch `claude/composite-r4` is at `ac243e1c`** — TE34's harness
   micro-batch landed green (the chair's own detached gate: TRUE_EXIT=0,
   SMOKE 0, log TE34-CHAIR-BINDING.log) on top of WF-1a (`66fda66d`). The
   soak instrument is CURED (epoch args thread; dark-control NOT-EXECUTABLE;
   non_finite at source; env leaks swept with a habitat walker). The
   /private/tmp/TE34-tree worktree may be reaped.
2. **RS-3 (third rolling soak) is RUNNING at ac243e1c** — 162 cells,
   first-ever full epoch-pair coverage, findings-only; collect its report,
   triage per §141/§143, fire RS-4 at the then-newest tip.
3. **MF-B8b (wall hotfix = THE ARCHITECTURE PILOT, §230/§232/§234) is
   RUNNING** in the map sandbox: one shared circuit object (graph idiom:
   declared inputs, content hash, accessor-pulled consumers), the district
   partition, the sibling staleness audit, b8's wins re-quoted. ON ITS SEAL:
   the FEATURE-LAW FREEZE takes effect and MF-ARCH dispatches (the §234
   sequence: SCC diagnostic FIRST, keyedRandom+lineage IDs, fixed-precision
   geometry, spatial indexes, cross-engine determinism CI).
4. **HF-4b (final corpus spend) is RUNNING on the Fable seat** — verify-
   balance-first, rescue orphans, spend to <50 before the subscription dies
   after 2026-08-17, nominate the §234 holdout set. THE CORPUS IS FROZEN AT 313 PLATES (§242); no
   further growth rounds — the subscription is gone.
5. **§236 is now in force**: if Fable is exhausted, continue on Opus 5 with
   the marker protocol (see the FABLE/OPUS CONTINUITY section below and
   docs/FABLE_RETROVALIDATION_QUEUE.md).

## ⚠ STATE AT THE WEEKLY-LIMIT PAUSE (§275-§276)
The account weekly limit killed MF-W3 mid-lane (restart fresh from its brief:
ODQ §274.5 items + SPEC §5 W3) and RS-4's monitor at ~110/163 (receipts
durable in rs4-receipts/; tail world passing, zero floor trips — resume the
monitor, do not restart the grid). Resets Aug 22 7pm ET. Waves W0-W2 are
SEALED; the build branch is at 4eafca31 (P4 repair exposed). The §275/§276
fold added the counterfactual causal benchmark (G-43), the halo ablation
(G-44), the historical structural cohort (G-45), §3.7's doctrine, and W8
exits 6-8 to GENERATION-SPEC.md — design only, nothing implemented. ⛔ THE
FABLE RETROVALIDATION SITTING OVER §238-§274 IS OWED FIRST when work resumes.

## Queues after the pause
- **Map wave nine** (dispatch after B8b seals; sandbox mf-proto/build-out):
  countryside T-24 + road ladder T-23 (the low-tier lever) · §214 iconography
  (walls look like walls, terrain like terrain) · MF-A1 paint integration
  (modules in mf-proto/aesthetic; hazards: browser parity, PDF filter-vanish)
  · underground stratum (§13/§168, twice deferred) · metropolis grain (70 vs
  100-130) · b8 residuals (4 orphan streets, 103 river crossings, clipped-solid
  spikes) · §205 B/C · chrome/vintage/decay. Then the §216 comparison round
  (re-run the atlas instruments, re-set windows, grade as DISTANCE) — loop
  until objectively equal-or-better; §220 performance gate binds at
  integration; §217 allows measured, re-pinned map-budget raises.
- **Engine queue (§27)**: WF-1b (needs the chair-authored family preamble +
  stamped substrate annex FIRST; suppressedAtTick has THREE writers) → WF-1c/d
  → the P4 population-reconciliation repair (§219, shapes R-B+R-C, declared
  soak-corpus shift) → WC/INT/WY/POP/LG → cn+pg → mf landing (cutover LAST,
  owner eyes) → TR/GR/HB (chair sittings first). ci-1c blocked on the owner's
  CI log paste.
- **Chair debts**: the docs act (charter→volume re-sync §15-§18 + §190-§232
  laws; EP volume amendments; C-EPF-4) · OSR schema-8 re-governance (BASE_STATE
  stamps blocked) · memory folds.
- **Owner-side**: the 18-item batch + item 19 (scale-bar unit name, prints
  PACES) · the CI log · tuning signature (post-full-soak) · legal/launch.

