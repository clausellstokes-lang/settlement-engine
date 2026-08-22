# COMPILE SEED — WF-1F, the §326.4 micro-batch (RAISED-B + two falsified landed sentences)

> **Not a packet.** Pre-executed substrate for the sibling member the `wf-1e` train split out
> (draft-WF-1E.md §7): the three chair-queued micro-items of ODQ §326.4, which breach two
> PACKET_STANDARD caps if folded into WF-1E (5 logic files > 3; 13 handwritten > 12, counted on
> WF-1D's landed accounting where a comment-only production edit counts). Every measurement below
> was executed by lane TC-WF1E at `claude/composite-r4 @ f5332cf70520a1cdef6cc326ae000acec118da85`.
> ⛔ **Re-execute every one at the member's own base; inherit nothing.**
> ⚠ WF-1F shares ZERO paths, instruments or proofs with WF-1E; it carries NO Q4 gate; the chair
> may ratify the split or veto it back into WF-1E with a signed two-cap override (WF-1E §13
> RAISED-A). ⛔ Nothing lands before the §290 review stop regardless.

## Item 1 — RAISED-B: the `deityNameForRef` truncation cure (ODQ §316 → §324.4 → §326.4)

**The defect, measured (WF-1C §6.2, re-verified at this pin):** `deityNameForRef`
(`src/domain/worldPulse/realmEvents.js:245`, sole caller `:297` inside `synthesizePantheonArcs`,
whose sole production caller is the kernel's pantheon-arcs site) falls back to
`String(deityId).split(/[:_]/).filter(Boolean).pop()` — the LAST token — so an UNCARRIED
`custom:<slug>` creed prints one word ("The Last Altar of Forge" for `sun_of_the_deep_forge`).
The branch is LIVE on unflagged surfaces: ascendancy/twilight/extinction arcs run on religion
ACTIVITY alone, and every extinction beat resolves through the fallback because an extinct creed
is carried by no settlement (production hands the PRE-TICK snapshot — WF-1C §6.1).

**⭐ THE CURE IS A REUSE, NOT A NEW UN-SLUGIFY — the estate already built and adopted the fix.**
`src/domain/display/deityNames.js` exports `deityDisplayNameFromRef(ref)` — drop the prefix
(last `:`-segment), split on `[_-]`, title-case each token, join with spaces — and its own
header records that `realmArcSummary.js` and `worldSnapshotPublic.js` BOTH converged on this
resolver after paying the SAME lossy tail-pop defect ("the old lossy tail-pop baked 'The
Ascendancy of Father'", `worldSnapshotPublic.js:219`). `realmEvents.js` is the THIRD producer,
still on the lossy private copy. The cure:

1. import `deityDisplayNameFromRef` from `../display/deityNames.js` (+1 line). ⭐ worldPulse →
   display imports have FOUR landed precedents at this pin — `chronicle.js:16`,
   `eventProse.js:36`, `pressureModel.js:2`, `settlementStrategy.js:53` — and `display/` is
   outside `CENSUS_SCOPE_RE`, so no coupling pair and no registry row is minted (re-verify with
   the walker at base).
2. replace the TWO fallback lines of `deityNameForRef` with
   `return deityDisplayNameFromRef(deityId);` (−2 +1). Net eff 0; `realmEvents.js` measures
   **309** effective at this pin, 800 layer ceiling, NO size-baseline row.
   ⛔ Do NOT delegate the whole function to `deityNameFromSnapshots` — its scan also reads
   `cultDeitySnapshots`, which would silently widen scan behaviour beyond the chartered cure.
3. rewrite the two now-stale comments in the same file: the RAISED-B block above the call site
   (~`:290-296`, "…it is a chair micro-item rather than this member's to take") and the JSDoc
   fallback example ("'custom:lu_vael' → 'Vael'" becomes 'Lu Vael'). Comment-only, eff 0.

**Blast radius, executed at the pin — exactly ONE committed pin re-records:**

- test drivers of `synthesizePantheonArcs`: **`tests/domain/pantheon.test.js` ONLY** (git grep
  over `tests`).
- committed pins of fallback-resolved names: **ONE** — `pantheon.test.js:416`
  `expect(slugArcs[0].headline).toBe('The Last Altar of Forge')`, the SEPARATELY LABELLED
  MEASURED-TRUTH ARM (`:404-421`) WF-1C authored for exactly this re-record; its own comment
  says "if the chair takes the cure, exactly this arm re-records with a declared cause."
  ⭐ WF-1C's A1 production-shape headline (`'The Last Altar of The Pale Warden'`) does NOT move —
  the tail carries no `_`/`-`. The `:421` stale-snapshot control does NOT move (authored name
  'Sun of the Deep Forge' via the scan) and stays a live control: predicted cure output is the
  title-cased **'The Last Altar of Sun Of The Deep Forge'** — ⛔ STOP: derive the committed
  value by EXECUTING the cured helper, never from this prediction. Re-label the arm's DEFECT
  comment as the cured, declared-cause pin.
- other name-bearing pins ('Ascendancy of War Father', 'Twilight of Morr', gallery/summary
  lines): produced by `realmArcSummary.js` / `worldSnapshotPublic.js` via the ALREADY-CURED
  shared resolver — out of radius (verified producer-by-producer).
- committed fixtures/goldens: git grep of `tests/fixtures/` for `Last Altar|Ascendancy of|
  Twilight of|pantheon_extinction|pantheon_twilight` returns **zero** at the pin; no preset
  declares `faithUnseatingEnabled`. Re-derive both at base; run
  `tests/property/worldpulseDeityGolden.test.js` on both sides — motion there is a STOP.

**DECLARED SHIFT — INCURRED (§P7.11), and it is the member's center of gravity.** Live
campaigns' arc headlines/summaries change for uncarried refs whose colon-tail carries `_`/`-`.
The proof: pre-feature transcript from a `git archive <base>` tree and the test file's OWN
fixture, key-by-key against the cured run — zero entries added, zero removed, only the
name-bearing strings of the affected refs move, each named in the packet. State the one-time
shift in the packet body; the chair carries it to the owner walk (game-facing copy changes).

**Recommended pins:** (i) the re-recorded arm; (ii) an AGREEMENT arm — for the fixture refs,
`deityNameForRef`'s fallback output equals `deityDisplayNameFromRef(ref)` (test-side import;
keeps the third producer from ever drifting again); the fixture supplies refs where the scan
misses so the fallback genuinely executes (positive control: a scan-resolved ref returns the
authored name). **Mutant:** revert the cure line by plant ⇒ the re-recorded arm reds alone.

## Item 2 — WF-1D RAISED-4a: `subsystemRowsVirtual.js:1268` names WF-1b for the obituary beat

The WF-1a certification row's `other:` value — ONE physical line at `:1268`, a live data string
(not a comment) — ends: *"THE OBSERVATION THAT WOULD CLOSE IT: WF-1d lands the war-dissolution
join that consumes `fallCauseFor`, and WF-1b the obituary beat, at which point a receipt can
grade the layer; until then the falsifiable claims are the two pinned below."* Two clauses are
stale: the join has LANDED (WF-1D), and §309 re-filed the obituary beat to **WF-8**. Reword the
closing sentence to record both truthfully; the row still grades UNOBSERVED and nothing about
certification moves.

Constraints, executed at the pin (each a STOP: re-derive):

- the edit stays ONE physical line; `subsystemRowsVirtual.js` measures **723** effective, no
  size-baseline row; `tests/lint/.prose-numerics-baseline.json` (413 rows) keys this file
  NOWHERE, so no line-address can rot.
- `tests/domain/subsystemRowsVirtual.test.js` pins `row.aliveness.other.length > 400` (`:471`)
  — the reworded string stays far above it (~2,600 chars today); NO test pins this row's prose
  verbatim (grep for the sentence and for `WF-1b` over `tests` — the WF-1b hits are
  `patronFall.test.js`'s own titles).
- §104.4: the file appears in NO edge-bundle meta's `inputs` (all five checked at the pin) —
  the comment-only-edit ratchet is priced NOT INCURRED; re-derive, since §321.2d ordered
  exactly this check before the edit.
- focused proof: `tests/domain/subsystemRowsVirtual.test.js` bare, plus the §31 anchor walker
  (no new negatives — expected untouched).

## Item 3 — WF-1D RAISED-4b: `couplingInclusion.walker.test.js:157` single-importer justification

The FAITH exact-path row's justification comment (block `:146-165`) reads at `:157`:
`// the one ring writer), its only importer is religiousContest.js in this same family,` —
falsified by WF-1D's licensed second importer. **The ratio is UNAFFECTED** (subject ownership,
not importer count — WF-1D RAISED-4's own finding), so this is prose repair only: reword to
name BOTH importers and the licensing row, mirroring the language `patronFall.js`'s own header
already landed (WF-1D M4): religiousContest.js in-family, plus `warTermination.js` (WAR's
dissolution join) licensed by `CPL-23.FAITH_TO_WAR.WF-1d.dissolution_names_the_fall` in
`couplingRegistryWar.js`. ⚠ Comment lines can convict scanners — quote no forbidden matcher
spelling and no bare negative-assertion matcher in the new prose. No title changes; census
still. Focused proof: `npx vitest run tests/lint/couplingInclusion.walker.test.js` bare,
in-shell exit (16 tests at the pin).

## Priced shape (all caps clear)

| limit | WF-1F |
|---|---|
| behavior families | 1 (the cure; items 2–3 are prose) |
| new persisted record families | 0 |
| user-facing surfaces | 0 components (the arc strings are engine-rendered copy — the declared shift carries the user-visible motion) |
| existing logic files modified | **2** of 3 (`realmEvents.js`, `subsystemRowsVirtual.js`) |
| handwritten files | **5** of 12 (those two + `pantheon.test.js` + `couplingInclusion.walker.test.js` + the packet) |
| generated artefacts | none |
| acceptance cases | ~3 of 8 (re-record, agreement, the two prose re-verifications folded into existing runs) |
| census delta | **+0/+0/+0/+0/+0** — no title text changes anywhere; ⛔ verify by running the lighting walker untouched at the tip, and name this prediction in the train plan so an unexpected red is not an unplanned interior red |
| declared shift | **INCURRED** (item 1) |
| overrides needed | NONE |

## Sequencing

Path-disjoint from WF-1E in full; no promotion gate; both members honor §P7.14 trivially. The
lighting walker file is named by WF-1E ONLY — WF-1F must NOT touch it (its census prediction is
stillness, proven by the walker running green untouched). Chair sequences the two landings
after the §290 stop; the slot-aware rebase law (WF-1D §16.5) covers any interleaving.
