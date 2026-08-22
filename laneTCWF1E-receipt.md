# laneTCWF1E — compile receipt for WF-1E (+ the WF-1F split seed)

Lane: TC-WF1E (COMPILE — architect/compiler seat). Spawn: ODQ §332.4 (drafts only; ⛔ nothing
lands before the §290 review stop). Chair reviews before any dispatch.
**Wrote NOTHING in the repository; moved no ref.** Outputs, all in this scratchpad:
`draft-WF-1E.md` · `laneTCWF1E-WF-1F-seed.md` · this receipt · `tcwf1e-pin/` (a `git archive`
extraction of the pinned files, kept for verification).

## §1 · THE PIN, VERIFIED

- Every repository read pinned to `claude/composite-r4 @ f5332cf70520a1cdef6cc326ae000acec118da85`
  (`git cat-file -t` = commit; `git log -1` = "docs(MF-T2C): READY -> LANDED…"; branch listing
  shows it on `claude/composite-r4`). File bytes came from `git archive <pin>` into
  `tcwf1e-pin/` or `git show <pin>:path` — never the live working tree.
- **ONE deliberate off-pin read, sanctioned by the dispatch:** the Q4 determination required the
  ledger ODQ, which does not exist on the build branch. Read at
  `review-fixes-2026-07-08 @ 51fb347850c0aebeb2e72abf96e69be5d48c6560` (the only branch carrying
  `docs/OWNER_DECISION_QUEUE.md`, found by enumerating all heads). Recorded here so the executor
  re-reads the ODQ tail at ITS dispatch time — §-state can move.

## §2 · MANDATORY INPUTS, ALL CONSUMED

1. `laneTCWF1D-WF-1E-seed.md` including the CHAIR APPENDS (§326.4) — read whole.
2. `laneTEWF1D-receipt.md` (RAISED-3/-4a/-4b, the census triple-move, the hold protocol) and
   `laneTEWF1C-receipt.md` §6.1/§6.2/§7b/§8 (RAISED-B's executed blast radius + the chair's
   refuse-arm ruling at §316) — read whole / by section.
3. WF-PREAMBLE at the pin, read WHOLE (781 lines): **live SHA-256
   `f4cd39fee756c3a192710ab9aa3fc208e18ef1f08ea9e9073bcdc8bfb55d871c`** (computed over
   `git show <pin>:…/WF-PREAMBLE.md`; 780 lines by `wc -l` of the blob, 781 with EOF line —
   packet cites the hash; the executor recomputes at its base). This IS the WF-1D re-stamp:
   WF-1D's header quotes the same hash, and the §P1 R-WF-7 table now carries the FOUR
   zero-headroom files (peaceTerms 797 · warTermination 818 frozen · pulseKernel 1581 frozen ·
   applyWorldPulse 941 frozen).
4. Landed WF-1B / WF-1C / WF-1D packets at the pin via INDEX.md (WF-1D read whole — it is the
   form template; WF-1B/WF-1C by section for Q4, DS-FTH and the RAISED-B arm).

## §3 · MEASUREMENTS EXECUTED AT THE PIN (the draft's figure sources; every one marked STOP: RE-DERIVE)

| figure | result |
|---|---|
| effective lines (eslint `Linter`, `max-lines {skipBlankLines,skipComments}`) | `religionState.js` **368** · `faithPanelModel.js` **117** · `FaithSection.jsx` **225** · `realmEvents.js` **309** · `subsystemRowsVirtual.js` **723** · `pulseKernel.js` **1581** |
| lighting census tuple (walker's own live constant, figures line `:5001`) | **`2490/364/2126/20663/5778`** |
| `PACKET_MANIFEST.json` | **134 LANDED + 1 SUPERSEDED = 135 rows, ZERO non-terminal** |
| `.prose-numerics-baseline.json` | **413 rows**; FaithSection.jsx **12 rows** at lines 49/53/174/176/179/188 (last pinned line **188**); zero rows for any other member file |
| edge-bundle closures (§104.4) | all five metas' `inputs` grepped — **no member/micro-item path appears** |
| domain any-cast baseline | `religionState.js` **absent** (allowance zero); components outside scope |
| size-baseline rows | none for religionState/faithPanelModel/FaithSection/realmEvents/subsystemRowsVirtual (layer ceilings only); kernel frozen 1581 |
| DS-FTH-1 | generated title binds the 8-key signature at `warFaith.generated.js:2113`; corpus source heading at `RECEIPT_POOLS_DOSSIER_STATE.md:4189`; generator `scripts/generate-dossier-state-prose.mjs` |
| projector | signature five-param, flag-free; `faithProfile` literal carries the three `...(x ? {x} : {})` precedents; sole production caller `pulseKernel.js:1773` inside `if (nextReligionStates)`; `simulationRules` in scope from `:307` |
| ring | `recordPatronFall` PREPENDS (`patronFall.js:145`) ⇒ `patronFalls[0]` IS the newest; `FALL_RING_CAP` 3; vocabulary 4 tokens |
| import scrub | `scrubImportedConfig` drops `faithProfile` in its destructuring (importScrub.js, drop near `:36`) |
| FaithSection anchors | `Cause` `:63` · destructure `:75` · cause-block guard `:195` · sink render `:198` |
| RAISED-B blast radius | `deityNameForRef` def `:245` / caller `:297`, BOTH only in `realmEvents.js`; sole test driver of `synthesizePantheonArcs` = `pantheon.test.js`; sole committed fallback-name pin = `pantheon.test.js:416`; `tests/fixtures/` carries zero arc-name/impactKind strings; 'War Father'/'Morr'/gallery pins ride the ALREADY-CURED shared resolver |
| the cured resolver | `deityNames.js` exports `deityDisplayNameFromRef` (title-cased whole tail) + `deityNameFromSnapshots`; `realmArcSummary.js`/`worldSnapshotPublic.js` converged on it after the same defect ("old lossy tail-pop", `worldSnapshotPublic.js:219`); worldPulse→display import precedents ×4 (chronicle/eventProse/pressureModel/settlementStrategy) |
| micro-item (b) site | `subsystemRowsVirtual.js:1268` is the WF-1a row's ONE-LINE `other:` data string; its test pins `other.length > 400` (`:471`) and nothing pins the prose |
| micro-item (c) site | `couplingInclusion.walker.test.js:157` ("…its only importer is religiousContest.js in this same family,") inside the FAITH block `:146-165`; 16 tests in the file at the pin |
| CLAIM_RE (naked-claim) | read from `tests/docs/enforcement-claims.test.js:40`; the draft and this seed avoid every matched spelling — verified by running the regex over `draft-WF-1E.md`: zero matches |
| component test files | both are straight-line credited files: zero `.each`/`runIf` hits |

## §4 · THE Q4 DETERMINATION (the dispatch's mandatory stop before drafting FaithSection scope)

**Q4 = the WF volume's open question on the DS-FTH corpus binding** — whether the pre-authored
dossier-state corpus is reader-side spelling LAW (amendable only via Lane P's
source-edit-plus-generator-in-one-commit mechanism). Traced: preamble §P2.7 ("the engineering
fact, not the ruling") · §P9 / ODQ §78.3 ("Q1 … and Q4 (DS-FTH binding) stay open for the WF
family sitting") · the family sitting §308 and EVERY later section through §332 rule on neither
— established by grepping the whole 14,192-line ledger ODQ for `Q4|DS-FTH`: the last WF hit is
the §78.3 line. **Q4 is OPEN at the chair — chair-scope, not owner-parked by nature (none of
legal/cull/tuning/push).** Because §332.4 ordered this member compiled and the seed says the
member "may need Q4 ruled before it can promote," the FaithSection scope IS drafted — with a
⛔ hard PROMOTION GATE in the packet header and §4, plus the recommendation (ratify the
engineering disposition; A4 pins the round trip section-sliced). Nothing is silent: the gate,
the determination and the recommendation are the packet's §4.

## §5 · THE ONE STRUCTURAL JUDGMENT — THE SPLIT (J-TCWF1E-1, vetoable)

Priced at the pin, folding the three §326.4 micro-items into WF-1E breaches TWO
`PACKET_STANDARD` hard caps: existing logic-bearing production files **5 > 3** (religionState,
pulseKernel, faithPanelModel, realmEvents, subsystemRowsVirtual — WF-1D's landed accounting
counts comment-only production edits) and handwritten files **13 > 12**. `PACKET_STANDARD`
forbids quiet budget renegotiation and orders the smallest split — which here is also the
natural one: **zero shared paths, instruments or proofs**. So:

- **WF-1E** (`draft-WF-1E.md`, 383 effective / 463 physical lines — inside the ≤400 budget):
  the FaithSection cause-chain line exactly as seeded — 3 logic files AT CAP, 9 handwritten of
  12, ≤14 effective production lines, 6 acceptance cases, census **+6 titles only**
  (predicted `20663 → 20669`), Q4-gated at promotion.
- **WF-1F** (`laneTCWF1E-WF-1F-seed.md`): the micro-batch — RAISED-B's cure (BY REUSE of the
  estate's already-landed `deityDisplayNameFromRef`, not a third un-slugify), the
  `subsystemRowsVirtual.js:1268` reword (join landed; obituary beat → WF-8), and the
  `couplingInclusion.walker.test.js:157` justification repair. 2 logic files, 5 handwritten,
  census-still, DECLARED SHIFT incurred (live unflagged arc names for uncarried slug refs;
  no committed golden/preset reaches it — measured), exactly ONE committed pin re-records
  (`pantheon.test.js:416`, the arm WF-1C pre-labelled for this).

*The §326.4 letter said the items ride WF-1E; the split honors its substance (each item on a
manifested lane with focused proofs, never a free chair edit) within the standard. Say "veto"
to fold WF-1F back in — the packet then carries a chair-signed two-cap override (WF-1E §13
RAISED-A names it).*

## §6 · OTHER JUDGMENT CALLS (all in the draft, all vetoable)

- **J-TCWF1E-2** — model key always-present-null; persisted key conditional-absent (layer-true
  idioms; a serialized key is a byte, an in-memory model key is not).
- **J-TCWF1E-3** — the panel renders the CAUSE only, no name resolution (avoids re-minting the
  lossy fallback WF-1F cures; the crown pin's own sentence names the cause; one-line follow-up
  possible after WF-1F).
- **J-TCWF1E-4** — the fall sentence renders FIRST in the cause block.
- WF-1F seed: the cure REUSES `deityDisplayNameFromRef` (prior-art rule; three producers, one
  resolver) instead of an inline one-liner; refuses whole-function delegation to
  `deityNameFromSnapshots` (would widen scan behaviour to cult snapshots beyond the charter).

## §7 · SEED/PLAN STALENESS — what moved between the seed's `2cdb87fa` and this pin

| seed claim | at `f5332cf7` |
|---|---|
| eff figures (368/117/1581, FaithSection rows 49…188, 413 baseline rows, importScrub drop, DS-FTH-1 addresses, kernel call `:1773`, `simulationRules` `:307`) | ALL REPRODUCE — re-executed, none inherited |
| census (seed-era `…/20618/5768`) | **moved three times** (WF-1D +6, TE-OFL 0, MF-T2C +8 titles etc.) → `2490/364/2126/20663/5778` at the pin. The draft re-reads it from the walker's constant and orders placeholder-of-zeroes at the executor tip (WF-1D C-1 is the recorded double-count failure) |
| `projectReligionStateOntoSettlement` "at `religionState.js:603`" | function now opens near `:607` — line rot, symbol navigation holds (§P0 law; the draft cites symbols) |
| seed's priced shape "9 of 12 / 3 of 3 AT CAP" | TRUE for the FaithSection member alone — the §326.4 appends (added after the pricing) are what breach the caps; hence §5's split |
| "census delta +0/+0/+0/+6/+0 predicted" | kept (5 titles in faithPanelModel.test.js + 1 in faithSection.test.jsx, no new describe, no new file) |
| RAISED-B "one labelled arm re-records" | CONFIRMED at the pin by enumeration (one test driver; one committed pin; fixtures clean) — and the cure is better than the seed knew: the estate's shared resolver already exists and two producers already adopted it |

## §8 · RAISED FOR THE CHAIR (consolidated; details in the two documents)

1. **The split vs the §326.4 letter** — ratify or sign the two-cap override (§5 above; WF-1E
   §7/§13 RAISED-A).
2. **Q4 must be ruled before WF-1E promotes** — determination + recommendation at WF-1E §4;
   WF-1F is not gated.
3. **The member NAME** — RAISED-3 called naming a chair act; the draft follows the chair's own
   §326.4/§332.4 "WF-1E" usage; ratify at review (WF-1E §13 RAISED-B).
4. **Owner-reviewable copy** — the four fall sentences are quoted verbatim in WF-1E §5 for the
   walk; WF-1F's declared shift (arc-name copy changes on live campaigns) also reaches the
   owner surface.
5. **Sequencing** — two census-moving trains in flight (this train's WF-1E and TC-T2D's member);
   slot-aware rebase law covers it; chair sequences after the §290 stop (WF-1E §13 RAISED-C).

## §9 · WHAT THIS LANE DID NOT DO (affirmatively)

No repository write, no ref motion, no test execution against the live tree (all proofs are the
executor's, at its own base, per the packet's §11/§12), no WF-1F full packet (the dispatch's
split instruction says seed it — the seed carries every executed figure a mechanical compile
needs), and no reliance on any seed figure without re-execution at the pin.
