# DA / DA-A1 — the chokepoint, the public and PDF tick cure, and the guard that was blind

- **Status:** LANDED
- **Landed at:** `d77c8841`
- **Verified base:** `claude/composite-r4` at `bd0439d19ec2b3d080b38c083785b103b6e0d545`
- **Train:** `da-a`, family **DA** (un-stamped, cap 4), landed **second**, on DA-A2's
  recorded allowances. Change paths disjoint from DA-A2, DA-A3 and DA-A4.
- **Preamble:** none — DA is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§113.3** (the de-vacuification RATIFIED as
  da-1's prevention half; the 14 uncovered `week`-class hits WIDEN da-1; da-5 is ruled
  ADDITIVE-ONLY on the humanize chokepoint; §104.4 IS incurred) · **§69.2** (PDF and public
  gallery surfaces lead) · **§69.3** (the tier split and its float half) · **§104.4** (the
  bundle-closure regeneration).
- **Compile of record:** `laneTC21-DA-PLAN.md` §4.1, annex rows DA.M2, DA.M3, DA.M4,
  DA.M13, DA.M17.

---

## §1 · THE DEFECT — A GUARD WITH A BUDGET OF ZERO AND NO ABILITY TO SEE

`tests/copy/proseLeak.test.js` has enforced `tick: 0, week: 0` across all 552 components
since the E-E build. The number was true of what it measured and false of the world.

- `DETECTORS.tick` requires literal digits: `/\btick\s+\d+/`.
- `extractJsxProseStrings` deliberately drops every `${…}` and `{expr}` hole, because it
  answers "what literal text does this file contain" — the right surface for a character
  ban and the wrong one for an **adjacency** ban.

Composed, they could not match a single live site: reader-facing code writes `Tick {tick}`,
never `Tick 12`. **29 raw counters in 18 files rendered behind a receipt that said zero** —
on the public gallery share, in the PDF, on the map, the town map, the surveyor and the
marketing landing page. The faithfulness control held throughout: an arm that reproduces
`.prose-leak-jsx-baseline.json` **exactly** confirmed the extractor was faithful and the
detector was blind, so the fault is located precisely rather than guessed at.

⛔ **Minting a second walker over the same class was refused** — that is the
redundant-guard-vacuity shape, and the guard that exists is already load-bearing and already
lying. This member de-vacuifies the one that is there.

## §2 · WHAT REPLACES IT

**1. The second surface (`tests/helpers/jsxLiteralWalk.js`, ADDITIVE, +91/−0).**
`extractJsxProseSegments` / `scanJsxSegmentTree` keep interpolation holes as a NUL byte —
chosen because no JavaScript source can contain one, so a hole can never be confused with
authored content and no authored content can forge a hole. `extractJsxProseStrings`,
`scanJsxTree` and `walkJsxFiles` keep byte-identical behaviour: `voiceMechanics.test.js`
imports them and carries its own committed budget, so changing them would move a second
suite's ratchet from inside this one's cure.

**2. The adjacency arm (`tests/copy/proseLeak.test.js`).** A counter LABEL sitting against a
hole. The two arms are disjoint by construction — one needs digits, the other needs a hole —
so the totals sum with nothing double counted, and `week k of N` stays sanctioned on both
surfaces.

**3. The allowance is read from the FILE.** There is no allowlist in the suite. A file's own
`prose-leak-allowance: <class> <n>` line is parsed, and equality is exact in both
directions: growth reds, and a grant that outlives its site reds.

**4. The cures — §69.2's order, PDF and public first.**

| site | was | is |
|---|---|---|
| `pdf/sections/FaithWar.jsx:155` | `(since tick 60)` | `(since the spring of year 2)` |
| `pdf/sections/PowerStructure.jsx:309` | `(since tick 60)` | `(since the spring of year 2)` |
| `pdf/sections/PowerStructure.jsx:325` | `tick 60` | `the spring of year 2` |
| `pdf/sections/FaithWar.jsx:168` | `Roughly 6 ticks from marching.` | `Roughly 6 weeks from marching.` |
| `new/tabs/WarFaithTab.jsx:81` | the same duration, on the screen twin | the same cure |
| `gallery/CampaignStatePanel.jsx:87` | `Tick 60` | `Week 9 of 52` |
| `gallery/CampaignStatePanel.jsx:123` | `Tick 60` | `week 9 of spring, year 2` |
| `home/LandingArtifacts.jsx:84` | `· week 12` | `· 12 weeks in` |
| `contentStudio/ContentSampleReceipt.jsx:108` | `· week 8` | `· week 8 of the year` |
| `settlements/RealmStrip.jsx:149` | `· week 60` | `· week 9 of 52` |
| `settlements/RealmStrip.jsx:168` | `News 3 weeks ago` | **byte-identical**, respelled off the hole |

**5. §69.3's float half.** `FaithWar` rendered `aggression ×0.62` and a bare `0.42`. Neither
carries a cause; neither can be acted on. The war-weariness bands take the SCREEN's own
authored cause sentences, so the PDF and the tab now say the same thing about the same scar;
the posture strip takes **nothing**, because the view model records no cause for aggression
and inventing one would be worse than the number was.

**6. `tickDurationLabel` — a SECOND export, not a reuse.** ⛔ Routing a duration through
`tickCalendarLabel` yields *"Roughly the spring of year 1 ticks from marching."* The pin
asserts the two DISAGREE at every span in a year, so they can never collapse into one
another.

**7. §113's `week`-class widening.** The four DM instruments the widening exposed
(`map/RealmForecast.jsx`, `surveyor/AutonomyPanel.jsx`, and the two town-scene readouts)
take the recorded §69.3 allowance — 9 counters. They are surfaced and recorded, never
silently absent. Their blocks sit at the FOOT of each file on purpose:
`tests/lint/.prose-numerics-baseline.json` addresses its rows by path AND LINE, and a block
at the head would rot every row beneath it in a census this member has no business moving.

## §3 · THE ADDITIVE-ONLY CONTRACT, PROVEN STRUCTURALLY

DA.M13: `humanizeToken` and `humanizeContextSignature` are imported by `pressureModel`,
`settlementStrategy` and `eventProse`, whose prose reaches **persisted** news and receipt
records. Editing an existing export is same-seed output-moving and is a STOP.

The proof is not a behavioural sample, it is the diff: **`src/domain/display/humanizeEngineTokens.js` is +27/−0** against the base, and
`tests/helpers/jsxLiteralWalk.js` is **+91/−0**. Zero deleted lines in either file, so every
pre-existing export keeps a byte-identical body and no sampling gap can hide a change.

## §4 · §104.4, PAID ONCE, IN THIS COMMIT

`humanizeEngineTokens.js` is an input to `aiCharterBundle` (110 inputs) and
`aiOutputSchemaBundle` (111). Both freshness suites recompute the source hash live, and both
redded on the chokepoint edit before the regeneration — the obligation was executed, not
assumed. `npm run build:edge-shared` moves exactly those two bundles and their meta:

    aiCharterBundle       9dce2d58d4c2384c -> 9912af9bc6e5ba71
    aiOutputSchemaBundle  f9f912574b056281 -> 57bf94668ed9b96e

## §5 · PROOF SHAPE

**Rendered-surface pins (the second-vacuity law).** `CampaignStatePanel` had NO component
test at all — the one gallery surface a non-owner reads was unpinned. Three arms now mount
it and read its rendered text; each proves the panel produced prose BEFORE asserting what
the reader does not see, because this component self-hides on a null snapshot and a negative
against an unmounted surface passes for the wrong reason. `RealmStrip` gains the same shape.
The PDF sections are rendered end to end by `fullPdf.render.test.jsx`.

**The vacuity, reproduced as a live arm.** One test seeds `Tick {tick}` and asserts the
COMMITTED flat detector reports **0** on it, beside another asserting the adjacency arm
reports **1**. The de-vacuification is therefore demonstrated on every run, not claimed once
in a commit message.

## §6 · MANIFEST

| # | action | path |
|---|---|---|
| 1 | MODIFY | `src/domain/display/humanizeEngineTokens.js` |
| 2 | MODIFY | `src/components/gallery/CampaignStatePanel.jsx` |
| 3 | MODIFY | `src/pdf/sections/FaithWar.jsx` |
| 4 | MODIFY | `src/pdf/sections/PowerStructure.jsx` |
| 5 | MODIFY | `src/components/new/tabs/WarFaithTab.jsx` |
| 6 | MODIFY | `src/components/home/LandingArtifacts.jsx` |
| 7 | MODIFY | `src/components/contentStudio/ContentSampleReceipt.jsx` |
| 8 | MODIFY | `src/components/settlements/RealmStrip.jsx` |
| 9 | MODIFY | `src/components/map/RealmForecast.jsx` |
| 10 | MODIFY | `src/components/surveyor/AutonomyPanel.jsx` |
| 11 | MODIFY | `src/components/townMap/scene3d/TownSceneInspector.jsx` |
| 12 | MODIFY | `src/components/townMap/scene3d/TownSceneLivingSummary.jsx` |
| 13 | MODIFY | `tests/helpers/jsxLiteralWalk.js` |
| 14 | MODIFY | `tests/copy/proseLeak.test.js` |
| 15 | MODIFY | `tests/domain/humanizeEngineTokens.test.js` |
| 16 | MODIFY | `tests/components/gallery/galleryCampaignsTab.test.jsx` |
| 17 | MODIFY | `tests/components/realmStrip.test.jsx` |
| 18 | MODIFY | `supabase/functions/_shared/aiCharterBundle.js` |
| 19 | MODIFY | `supabase/functions/_shared/aiCharterBundle.meta.json` |
| 20 | MODIFY | `supabase/functions/_shared/aiOutputSchemaBundle.js` |
| 21 | MODIFY | `supabase/functions/_shared/aiOutputSchemaBundle.meta.json` |

⭐ **`tests/copy/.prose-leak-jsx-baseline.json` IS NOT IN THIS MANIFEST, AND THAT IS THE
RESULT.** All 29 sites are cured or recorded, so the committed baseline is byte-identical
and nothing was banked. This discharges the compile's `DA.U1` fork: the post-cure baseline
did not need writing, because there was no new debt to write.

**Deliberately deferred — documented, not a bug to re-find:** the authored display lexicon
da-5 will consume stays with its consumers in `da-b` rather than landing here unconsumed.
An authored table with no reader at this train's terminal is dead data of exactly the shape
this estate keeps convicting; the cost is one further `build:edge-shared` in `da-b`, priced
and accepted.

## §7 · STOP CONDITIONS

1. A single deleted line in `humanizeEngineTokens.js`. The additive-only contract is proven
   by `−0`, and any deletion refutes the neutrality premise rather than merely risking it.
2. `.prose-leak-jsx-baseline.json` gains a `tick` or `week` entry. §113.3 rules the 29 cured
   sites, not baseline debt.
3. `extractJsxProseStrings` or `scanJsxTree` changes behaviour — that moves
   `voiceMechanics.test.js`'s budget from inside this member.
4. A duration routed through `tickCalendarLabel`.
5. The bundles committed without their regeneration in the same commit.
