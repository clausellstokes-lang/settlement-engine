# HANDOFF — CURRENT PROGRAM STATE (model-agnostic successor bootstrap)

**Updated 2026-09-01 at the §879.5 CUTOFF-PREP REFRESH (ledger through §879.5; refreshed at
every collection per ODQ §233). If you are a successor — any model, any account —
read this whole file, then docs/START_HERE.md, then the tail of
docs/OWNER_DECISION_QUEUE.md (the ledger; ODQ §§150–§276 plus collecting/amending §§287–§289 contain the map
program's decisions; SPEC fold labels §§277–§286 are design sections, not missing ODQ entries).
The repo is authoritative; trust executed evidence over any summary including
this one.**

## ⭐⭐⭐⭐ PICKUP AT §879 (2026-09-01 — THE RETROVALIDATION IS PAID; the seat is FABLE 5.1 on the §447 split; the arc RESUMES) — START HERE; supersedes every card below.

⏱ **LIVE STATE (session 25b6c8bb, Fable 5.1 chair, 2026-09-01 ~16:20 ET — refreshed for the owner's likely usage cutoff).** Background lanes DIE with the session. ⭐ **`25b6c8bb…/scratchpad/RESUME-BRIEFS-2026-09-01b.md` (mirrored at `825f209c…/scratchpad/`) carries every running lane's brief and the chair's own sequence** — re-dispatch from it anything found unwritten. RUNNING (4/4): **INSTRLAND** (Opus; dock `laneINSTRLAND-tree`, resumed from `bf902c59f`; bill A REPLACE → bank the four magnitude ceilings at base=tip → ratchet `--update` → dormancy SET proof → plants → bills → HOLD) · **GLYPH** ⭐ COMPLETE + SEALED `refs/preserve/glyph-complete-2026-09-01` = `1e9898d01` (§879.10; measured tuple 2481/371/2110/21884/5966; HOLDS for a pre-GOLDEN landing, coupling target ruled on measurement §879.8-E1) · **COUPLEDREH** (Opus, E3 — the composition rehearsal on `coupledprep-tree` `e9ee11a46`; prepared cures as `REHEARSAL-CURE` commits; receipt `COUPLED-REHEARSAL-RECEIPT.md`) · **T13-BUILD** (Opus, EARLY BUILD under the signed REC §879.11 — dock `laneT13-tree` at `8b07ce45f`; §9 base checks → Cars 0→1→2→3 → Car 4 family commits DRAFTED provisional, no golden re-record → HOLD; receipt `laneT13-receipt.md`) — MINTPREP-E2 ⭐ DONE (`MINT-E2-MEASUREMENT.md`: the mint window needs NO gate, six → FIVE; rulings §879.11) · **PAIDFIX** ⭐ COMPLETE + SEALED `refs/preserve/paidfix-complete-2026-09-01` = `32ac4980a` (§879.12; nine repairs; repair 5 STOPPED → owner's desk; rider 13–14 + the repair-5 measurement in flight on its dock) · **PAIDPREP-E1** (Fable, read-only → `PAID-BOARDING-CHECKLIST.md` + `paidprep-tree`: which gate the PAID consist rides) — COUPLEDPREP ⭐ DONE (`COUPLED-BOARDING-CHECKLIST.md`, rehearsal tip `e9ee11a46`; R-Q3 option A + R-2a ruled §879.10). ⛔ OWNER DIRECTIVES THIS SESSION (§879.6): the code assessment is STOPPED — "finish building and landing everything then we do a review"; **the exhaustive review+fix is a chartered phase after the last landing and BEFORE the soak**. When INSTRLAND HOLDS: send "SUSPEND FOR GATE" to GLYPH and PAIDFIX (M2 drain) → bare gate → CAS/seal/§880. Dispatcher cron `13,43 * * * *` is SESSION-ONLY — RE-ARM on resume. ⭐ EFFICIENCY PROTOCOL III (§879.8, vetoable): E1 couple the PAID consist into an existing gate on measurement · E2 couple the mint acts into T13's gate on measurement · E3 composition-class rehearsal (`tests/lint` + walkers) on the COUPLEDPREP rehearsal tip during INSTR's endgame · E4 census bills MEASURED by the standing probe, never predicted · E5 fold the superseded cards + a FIRST FIVE COMMANDS block at §880.

**THE SEAT:** Fable 5.1 chairs/architects/validates; Opus 5 implements/verifies (§447's split). Trailers accepted by `chair-commit.sh`: `Seat: Fable 5 — validated` · `Seat: Fable 5.1 — validated` · `Seat: Opus 5 — Fable-unvalidated`. **THE RETROVALIDATION (§879) IS PAID for the inverted span** — 64 items, 45 RATIFIED · 17 AMENDED · 2 REVERSED · 0 EVIDENCE-THIN; every §877 row carries a `*RULED (§879)*` line and the twelve lanes are enrolled and ruled as §879.1–§879.12 in `docs/FABLE_RETROVALIDATION_QUEUE.md`. ⛔ The historical strata (§685's dark window, §687–§723) stay QUEUED at the owner's trigger — the queue is NOT empty.

**Branch `claude/composite-r4` = `8b07ce45f179b583c6a152412a23777cb1a15a38` (HYGIENE landed §877). Ledger through §879.4.**

**⛔ WHAT THE PASS CHANGED ABOUT THE ARC (binding):** **Rider R5** on the coupled FOLLOW-ONS+TAIL-O+TAIL-L consist — compose slot 4's STEP-1 filter over the BASE's `consumesKnownRead`, never L7's literal regex (verbatim = RED, no cure) · **TAIL-F checklist +1** — compose `faithFieldDormancyFence.test.js` by union in both conflict regions and re-pin `SOURCES.length` to FIVE · **picked-car trailer convention**: a pick keeps its AUTHOR's `Seat:` only · **INSTRLAND's three resume riders** in `825f209c…/scratchpad/INSTRLAND-RESUME-NOTE.md` (bill A REPLACES, HZ-SERVICECAT 1/3, the dormancy anchor over the SET) · the `✅ EP-g2 RESOLVED-EXECUTED` row is landed (§879.3).

**THE IN-FLIGHT TREES (529 law: SURVEY BEFORE RESUMING):** `laneINSTRLAND-tree` `eb150f31b` p0 (22 commits; resumes → ratchet `--update` · bill A · dormancy proof · plants · HOLD) · `lanePAIDFIX-tree` `0dac7b074` (repair 1 COMMITTED + RATIFIED; repair 2 PARKED to the owner — jsPDF mojibake, a design choice; repairs 3–5 + the new repair 6 `DestroySettlementControl.jsx:31` resume; ⚠ its new `src/domain/resolveCulture.js` owes FOUR censuses at its landing) · `laneGLYPH-tree` `f09ce3ff7` (Car B COMMITTED + RATIFIED, paid bytes −1,873/−1,751/−806, owner's veto stands, lands BEFORE the GOLDEN freeze; Car A staged — must land GREEN behind B or STOP; then Car C).

**⛔⛔ OWNER ROWS ON THE DESK (`825f209c…/scratchpad/TUNING-DESK.md`):** the PDF prints the WRONG LETTER (dossier) · the non-Latin-name repair is a DESIGN choice (campaign PDF: embed a font · transliterate · keep-and-mark; chair recommends embed) · `authSlice.js:489` under-grants a tier · four architecture volumes live on ANOTHER LINE (import or annotate — IP class) · `seat_agent` is an unsigned register candidate · the lighting-day cost (+1,047 B engine; margin 266 B).

**THE ARC FROM HERE (Efficiency Protocol II binding — couple on measurement · lanes DRAIN before a gate · pre-stage off the critical path):** finish INSTRUMENTS → gate → CAS/seal/§880 → the COUPLED consist (with R5) → TAIL-F alone (with the fence union) → T13 (REC SIGNED §879.11, veto window OPEN until Car 4's gate; Cars 0–3 building EARLY in `laneT13-tree`; the mint window's residue acts RIDE T13's gate per E2/§879.11 — R1 three.js product half · R4 HK-5 car · R5a/b comment cures · R8 the OSR act LAST; FIVE gates remain) → W-ARMS (own gate after T13, before L9 iff its PDF seam moves `goldenViewModel`; owner veto drops it) → GOLDEN freeze (every paid-surface byte change BEFORE it) → walk + ONE regen (owner) → **the owner's exhaustive review+fix phase (§879.6)** → ⛔ STOP before the terminal soak. Owner's standing order (2026-09-01, re-issued at the resume): finish building and landing everything, THEN the review; 30-minute dispatcher, up to four lanes.

## ⏩ FIRST FIVE COMMANDS — a successor on ANY account or model reaches its first act in ≤5 minutes (E5, §879.9)

1. **SURVEY (529 law) before trusting anything:** `SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/825f209c-0e84-4a1e-b6f0-79a46de834dc/scratchpad; for d in laneINSTRLAND-tree laneGLYPH-tree lanePAIDFIX-tree coupledprep-tree; do echo "$d $(git -C $SP/$d rev-parse --short HEAD 2>/dev/null) p$(git -C $SP/$d status --porcelain 2>/dev/null | wc -l | tr -d ' ')"; done; git rev-parse --short claude/composite-r4` — a killed lane leaves partial edits; never discard, never assume.
2. **READ** the ⏱ LIVE STATE block below, then the resume briefs it names, then each running lane's receipt tail (`$SP/lane*-receipt.md`, last `RESUME POINT`).
3. **RE-ARM the dispatcher** (session-only, dies with every session): CronCreate `13,43 * * * *` with the heartbeat prompt in the resume briefs.
4. **RESUME each lane FROM ITS RECEIPT** (re-run any measurement taken before the death, never reuse it): Opus for build/verify lanes, Fable for architecture/validation/recon; every lane brief carries its seat trailer + the SUSPEND-FOR-GATE protocol + the E4 measured-tuple line.
5. **COLLECT after every act** with the private-index committer (three trailers · subject-anchor gate · queue-blob gate): `SP=<your scratchpad> sh <your scratchpad>/chair-tools/chair-commit.sh <ledger-tip> <msgfile> docs/HANDOFF_CURRENT.md:docs/HANDOFF_CURRENT.md` — toolkit copies: `25b6c8bb…/scratchpad/chair-tools/` (current, Fable 5.1 trailer) and `refs/preserve/chair-tools-2026-08-26-r7`. ⚠ In this tree `git diff HEAD -- <path>` LIES (the shared index carries staged deletions) — verify a delta with `git show HEAD:<path> > tmp; git diff --no-index --numstat tmp <path>`.

**Superseded pickup cards (§878 → §724, the §685 seat block, the 08-24/08-23/08-22/08-20 overrides, the historical topology and pause state) are FOLDED VERBATIM into `docs/archive/HANDOFF_CARDS_2026-09-01.md` (E5, §879.9) — nothing deleted, every § reference preserved; read it when a card below cites a figure this file no longer carries.**

## STANDING SECTIONS THAT SURVIVE EVERY CARD

## What this is
SettlementForge: a deterministic D&D settlement/world simulator (~1.3M lines).
The owner (Clausell Stokes) has delegated ALL judgment to the AI chair under
ODQ §170/§217/§223, with carve-outs BY NATURE: legal, data deletion, the tuning
signature, every git push, paid-surface changes, and anything owner-parked.
CONSTITUTIONAL: THE PROMISE (a seed is a starting world forever; lived history
immutable; tuning owner-signed) · the DEITY DOCTRINE (faith is cultural, never
theological; no premade deity pool) · FINITE-SEMANTICS (typed buckets; AI is
clerk, never writer) · the core world/narrative model may be setting-agnostic,
but current settlement-map morphology is explicitly `EUROPEAN_FANTASY_BASE`
and culture tokens select no geometry · sub-century · never a named character's
fate.

## THE SEAT (pointer — full §685 text in the archive)

Owner order §685 (2026-08-25/26) minted the marking law: every ledger act carries exactly one seat trailer, and an Opus act Fable did not architect/validate/manage lands its row in `docs/FABLE_RETROVALIDATION_QUEUE.md` in the same commit (`chair-commit.sh` refuses otherwise). Lineage: §685 all-Opus → §724 re-split (Fable architects/manages, Opus implements/verifies) → §876.5 inversion for one span → §878 return to the split → §879 the Fable seat moves to Fable 5.1. Trailers accepted: `Seat: Fable 5 — validated` · `Seat: Fable 5.1 — validated` · `Seat: Opus 5 — Fable-unvalidated`. Unmarked is retrovalidation-OWED; the mark is provenance, never a quality gate. Memory: `opus-seat-assignment-and-the-retrovalidation-mark.md`.

## ⚠ FABLE/OPUS CONTINUITY (§236)
If you are an OPUS chair: work continues at full authority, but mark every
ledger row "(chair: Opus 5 — Fable-unvalidated)" and append what needs Fable
re-examination to docs/FABLE_RETROVALIDATION_QUEUE.md. If you are a FABLE
chair returning: walk that queue FIRST (RATIFIED/AMENDED/REVERSED per row),
then resume the §234 sequence.

## ⛔ PERMANENT IP LAWS (§248, §253, §254.5)
- **NO WATABOU (TownGeneratorOS) CODE EVER ENTERS THIS TREE** — GPL-3.0,
  incompatible with a commercial closed product. Study is read-only; the
  implementing lane must never see that source (clean-room by lane separation).
- **FMG (Azgaar) is MIT but its vendored libs are not** — tinymce is GPLv2+,
  and its Urquhart utility was copied in from elsewhere and is not Azgaar's to
  license. A permissive top-level licence does not launder copied-in code.
- Adopt APPROACHES freely; implement clean-room in our own idiom. A mechanism
  adopted without a derivation home in our dossier facts is decoration.

## Hazards a successor must not relearn (the sharpest five)
1. A census over a derived set proves NOTHING about a surface it doesn't
   contain — forensic zoom (render 3000px, crop, LOOK) is standard practice.
2. Trust no exit you did not capture in-shell; only SELF-NAMED logs; a shared
   log dir lies by recency; never wrap check* in gate-mutex (self-deadlock).
3. Comment/prose edits fire ratchets; quoting a forbidden matcher in prose
   convicts; line-bound exclusions drift toward silent UN-exclusion.
4. PACKET_MANIFEST is never-re-serialize (scoped text edits only);
   requiredSymbols pin symbols/anchors, never lines or figures — and they do
   NOT catch renames (substring match).
5. The test census sits AT its ceiling: extend existing test files, never mint
   new ones; a parked file swallows its titles.

Full hazard corpus: the Claude memory dir (~/.claude/projects/
-Users-cstokes-Desktop-settlement-engine/memory/ — MEMORY.md is the index) for
Claude successors; for non-Claude successors this file + the ledger + the lane
receipts are sufficient and the memory dir is a bonus if readable.

## ARCHIVE POINTER
The cards this file used to carry below this line live, verbatim, in `docs/archive/HANDOFF_CARDS_2026-09-01.md` (folded 2026-09-01, §879.9).
