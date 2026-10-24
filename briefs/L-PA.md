# L-PA — COMPILE THE REALM'S PAST: `DESIGN_FP_ARCH_PA.md` (the cloud chair, 2026-10-23)

You compile ONE new FP program volume, THE REALM'S PAST (code PA), from the owner's words, the three research findings and the chair's rulings below.

## READ FIRST, in order
1. `briefs/PA-BRIEF.md`: the owner's five words verbatim, the three owner laws PA-L1..L3, the proposals and the hazards.
2. The findings, WHOLE: `findings/R-PA1.md` (the dossier's past), `findings/R-PA2.md` (the birth and the first advance), `findings/R-PA3.md` (the relationship writers). They are evidence: re-measure anything load-bearing you build on.
3. `briefs/COMPILE-COMMON.md`: THE HOUSE IDIOM's parts and the rules. TWO CHANGES since it was written:
   - (i) The volume is born CONSOLIDATED, in the form of `briefs/CONSOLIDATE.md` §2. That means a header of 3–5 lines and THE READER'S GUIDE (≤ 12 numbered lines: what it is · what it owns and whose it is · what it rules · what it reads, naming every reader whole, never "only" where untrue · what it registers · the words not to confuse). Then the owner's words verbatim and the answer in one paragraph, §0 onwards, THE RULINGS with a Ruled column, and THE REVIEW TRAIL in one line.
   - (ii) There are NO dated brackets anywhere, no `[REFINED …]`, no round labels and no finding ids in the running text. A refinement you make is a row in THE RULINGS.
4. The best-formed consolidated volume, as your model of form: `/home/user/fp-p8/docs/DESIGN_FP_ARCH_FS.md`. Read its guide and §0–§2 whole and skim the rest. Read the fold `/home/user/fp-p8/docs/DESIGN_FP_COHERENCE_FOLD.md` §1, §3.4, §5, §6 and §7, and the spine's §1.
5. The volumes PA touches: read their §1 laws and token registers. RN · PL · POP · PG · MN · EP · EDITOR (`DESIGN_FP_ARCH_EDITOR.md`) · MF (`DESIGN_FP_ARCH_MF.md`, the map) · `DESIGN_FP_INFORMATION.md`.

## Paths
- KIT = /tmp/claude-0/-home-user-settlement-engine/0c68ae34-da2a-592c-b4e0-4fd10d3e7416/scratchpad/kit
- The docs: /home/user/fp-p8/docs (read-only for you).
- The code of record: /home/user/master-code-of-record (READ-ONLY; node probes only under KIT/cure/L-PA-probe/).

## THE CHAIR'S RULINGS AFTER RESEARCH (by delegation under "I leave all decisions and judgement to you", vetoable; build within them, or write ⛔ STOP PA-C-n in your log with the receipt)
- **R1 THE HOME.**
  - The past has ONE home: a sidecar `spatialLedgers.realmPast` in world state, DM-only, at zero first-paint cost (R-PA2). It holds the seed, the re-roll nonces, the user's per-fact choices and the pencilled-state marker.
  - The facts themselves are DERIVED on demand from the dossiers plus the seed plus the choices, never stored as a second truth.
  - No negative tick ever enters a landed ledger: four of six landed readers break on one (R-PA3, executed).
- **R2 THE INKING.**
  - At the first advance the past becomes history at ONE place, `campaignAdvanceSession.js :: runAdvanceCampaignWorld` (≈ +6 lines on 700 effective; name the leaf-first car). Catch-up and Surveyor pass through it too, so say what they do.
  - Only the past's PRESENT-DAY CONSEQUENCES enter the landed ledgers, at tick 0, each with a back-pointer to its past fact: pacts still in force, grudges on existing edges, a dated oath.
- **R3 REFERENCES.**
  - A dossier event is referenced by (settlement id, the event's `name`, `yearsAgo`), the key Edit Mode and the readers already use (R-PA1). It is re-resolved on every read.
  - A reference that no longer resolves (the user removed or changed the event) drops its link, and only its link (PA-L1: the user's edit wins).
  - Settle in §2 how a reference survives a regeneration ("roll again").
- **R4 SEEDS.** One labelled seed stream per fact (per dossier event, and per growth step), so striking one fact moves no other (R-PA2, executed). Same seed and same choices give the same past, byte for byte.
- **R5 FROM THE PAST, NEVER FORWARD.** This is PA-L3, now also measured: four real weeks changed every dossier's bytes, and five centuries would take about 1.8 hours, while the event-driven replay costs 1–8 ms and leaves the dossiers byte-identical (R-PA2). No forward simulation of any kind.
- **R6 WHAT PA PRODUCES** (honest supply, R-PA1 and R-PA3):
  - (i) counterparts for LINKABLE dossier events, per R-PA1's classes. Every implied party in a dossier is anonymous, so filling one contradicts no word. If none fits, the event stays local;
  - (ii) founding ties, who founded whom (POP's `departureMemory` at its wave);
  - (iii) grudge or trust on EXISTING edges, consistent with each pair's dossier type (`relationshipStates`);
  - (iv) dates for existing oaths (PL's `oathSince`);
  - (v) past pacts, of which only those still in force are minted at tick 0, and only where pact formation is lit;
  - (vi) the realm's account at handover (truth). Each court's version is DERIVED on read (belief), never stored.
- **R7 WHAT PA NEVER PRODUCES:**
  - any dossier write (`buildNeighbourBackLink` and traditions' relations write dossiers, so they are not PA's writers);
  - town↔town regard (RN refuses it);
  - a menace (MN's);
  - a polity's NAME on its own authority. Polities are "christened only by the DM", so PA OFFERS a name as a pencilled fact, and the DM's keep is the christening;
  - a vassal chain without a dossier edge (PA dates an existing one, never invents one).
- **R8 THE GENESIS TIES.**
  - Plan law 2 writes 3, 9 or 12 founding ties into the dossiers at instant birth (`genesisDiplomacy.js :: materializeGenesisRelations`, tier-only). They are DOSSIER facts, canon under PA-L1.
  - PA reads them and explains them where they agree with the founding ages. Where they contradict them (a younger overlord of an older town), PA FLAGS the contradiction in the handover account for the user and never fixes it.
  - ROUTE to the genesis owner: whether PA's ordering may inform plan law 2 at birth in a later wave is the owner's call, recorded as an OPEN row.
- **R9 STATES AND WORDS.**
  - Per-fact states: `PAST_FACT_STATES = ['as_derived','user_held','user_changed','user_refused']` (R-PA1, free).
  - The past as a whole is PENCILLED until the first advance (R-PA2's word) and INKED at it. Census `pencilled` and `inked` yourself; if either is taken, choose by the fold §5 homonym check and record the ruling.
  - Re-roll by Edit Mode's `rollIndex` pattern; strike, keep and change by Edit Mode's `chooseOrPin` PATTERN, not its store.
  - TAKEN words, never PA's: canon · draft/DRAFT · briefing · proposed · struck · kept · settled · era · epoch · feud · refused · vetoed · amended · offered · HELD · seal · pin · lens. The handover read needs its own name, chosen by census.
- **R10 THE KNOCK-ON.** Striking or changing a fact re-derives the past, which is cheap. The review shows the diff before it applies. The landed forecast (`forecastRun.js :: simulatePendingFuture`, run on a clone in a worker) may preview the first weeks after inking, as an option.
- **R11 NEWCOMERS.** A settlement added after birth joins the past at its own founding. Its links to the realm stay pencilled until the first advance after it joins (PA-L2 read for a newcomer; the chair's reading, vetoable).
- **R12 THE MAP.** PA becomes the typed founding record MF lacks (R-PA1). Facts dated before week 0 have no map channel. ROUTE to MF: a past window reading `spatialLedgers.realmPast` (the map's to confirm). Named polities from day one = PL's vassal chains plus the DM's christening of PA's offered names.
- **R13 LIT.**
  - PA's growing uses only lit rules: pact formation on composer-born worlds. A plain birth waits on the birth door (OD-FC-62).
  - Every other program's past rule (RN, PL, POP, PG, FAITH, TRADE) is registered by that program's own wave, never by PA.
  - PA's first wave: the timeline, linking, founding ties, grudges on existing edges, the review surface and the inking.
- **R14 THE OWNER'S ROWS.**
  - PA-L1, PA-L2 and PA-L3 are THE OWNER'S rows (⭐; decided by the owner's words, never delegated): `OD-PA-1`, `OD-PA-2`, `OD-PA-3` in THE RULINGS.
  - Every other row is by delegation and vetoable.
  - PA mints NO engagement kind: grade proposal (g) and record it.
- **R15 PLACEMENT** (for the fold, recorded in the volume): PA is eligible after THE INSTRUMENTS BEFORE C0 (it needs their determinism and, for plain births, the birth door) and before the release's world-birth changes. As a coherence chain it is C22 THE REALM'S PAST in the fold's inventory, chosen at a read under FP-40 (the chair recommends the read after C0, since it lights the first hour of every born world).

## Write
- `KIT/pa/DESIGN_FP_ARCH_PA.md`, the volume. Write it SECTION BY SECTION, saving as you go.
- `KIT/cure/L-PA.md`, your log: what you measured first, what refuted what, every STOP, every refinement made and its rulings row, and open questions for the chair.

The header names "the cloud chair, session 01QuxWCMgVdyKhCNZL3c98y5" and NO model name anywhere in the volume. DARK behind its virtual flags; nothing scheduled.

## Rules
- COMPILE-COMMON's rules all apply: cite by `path :: symbol` with the quoted line; mark CONFIRMED or PLAUSIBLE; one truth per quantity; zero kernel lines; name a leaf-first car for every host at the ceiling; no numerals in a DM sentence.
- Never touch git beyond reading. Never run the test suite. Never edit a file outside your two outputs and your probe folder.
- Stop and report at about 300k tokens, saying which section is next.

FINAL MESSAGE (report diet): at most 350 words plus ONE table (the waves: PA-n · what it lands · host and car · first-visible · flag). Lead with the outcome, then what the chair must rule (every STOP), then one CONFIRMED-vs-PLAUSIBLE sentence.
