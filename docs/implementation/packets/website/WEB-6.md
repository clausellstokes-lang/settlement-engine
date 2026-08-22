# Website / WEB-6 — the anon-ceiling disclosure

- **Status:** DRAFT
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `19b799ce718d52e36a3b14a85fa9cfd5051ccf26`
- **Drafted by:** lane TE-WEB6, 2026-08-22, under the website train's charter (ODQ §402),
  train W-B. Member ruling: ODQ §363.1, which closes §320.3.
- **Base note:** the base was resolved by `git rev-parse claude/composite-r4` at lane start,
  never typed (§381.1). Every figure in this packet was re-derived at that SHA in a fresh
  detached worktree with its own `npm ci` (468 entries; `npm ls` exit 0), and the one figure
  that moves carries a separate baseproof worktree at the same SHA.
- **Non-goals, affirmed:** HomeHero's at-cap block; HowToUse's own disclosure; any
  layout or design-system motion; the obsolete `strings.js` clause and the inert
  `{anonSize}` substitution binding at `TIER_FACT_VARS` (recorded observations, and the
  touched lines do not overlap them, so they stay a recorded non-goal); any NEW wording
  (that is the owner's copy walk, and this member depends on none of it).

---

## §1 · What was wrong, measured rather than argued

§363.1 rules that the anonymous size ceiling must appear, plainly, in one sentence at the
landing's anonymous entry point. The sentence already existed, owner-era and spec-verbatim,
at `src/copy/landing.js` under `forge.ceiling`, and its claims-parity arm was green.

It was rendered nowhere. The Instant Draft widget's removal (owner walk order 10,
2026-07-22) took the only carrier off the page and left the key behind as an inert string.
The parity arm went on passing, because it read the copy registry rather than the page.
That is the rendered-surface face of the vacuity class: a claim bound to enforcement, held
honest against `tierFacts`, and invisible to every visitor it was written for.

**The conviction is an executed render, not a reading of the source.** Rendering
`LandingBelowFold` to static HTML at the verified base produced 57,200 bytes that contain
`forge.h2`, `forge.body`, `forge.axiom` and `forge.micro` — and do not contain
`forge.ceiling`. The §01 section was demonstrably alive; the disclosure was demonstrably
not in it.

## §2 · What the member does

1. **Re-lights the existing string.** `LandingBelowFold` §01 renders `tl('forge.ceiling')`
   in a paragraph directly beneath the CTA row, always visible, no cap and no state. The
   CTA row is where the free-door promise is made (`forge.micro`, "No account needed"), so
   the qualifying sentence sits with the promise it qualifies. Styling reuses §03's
   `aiNote` disclosure idiom verbatim — existing tokens only, no new design-system motion.
   **Zero copy authored**; the words are the owner-approved ones, re-referenced, not
   retyped, so the `tierFacts` binding is untouched.
2. **Cures the pin's vacuity, in the stronger of the two sanctioned forms.**
   `landingClaimsParity` gains a RENDERED arm: it renders the real component through
   `react-dom/server` and asserts the sentence in the output HTML. The charter allowed a
   source-scan fallback; the harness supports the render, so the render is what shipped.
   `react-dom/server` needs no DOM, so this runs in that file's own default node
   environment with no environment split (the `tests/design/organicSamples` idiom).
3. **Anchors the arm against its own second vacuity.** A render arm that never rendered
   proves nothing, and `toContain` over an empty string is green forever. The arm therefore
   asserts two §01 siblings FIRST, as a positive control: if the section stops rendering,
   or the component throws, the anchor reds before the disclosure assertion is reached.
4. **Inverts a stale contradicting pin** (see §3).

## §3 · The third and fourth files — why the charter's two-file manifest was short

Both were found by executing the change, not by reading around it, and both are mandatory
consequences of the member rather than adjacent work.

**`tests/ui/homeLanding.test.jsx` held the INVERSE pin.** Written under walk order 10, it
asserted that the ceiling string does not appear on the landing at all. §363.1 supersedes
walk order 10 on exactly this point, so the assertion flips from zero to exactly one — which
is also what that file's own docblock has claimed all along, making the file self-consistent
again. The pin was convicted before it was changed: with only the render applied, it reported
`expected [ <p …(1)></p> ] to have a length of +0 but got 1`, an independent jsdom
confirmation of the same one-and-only-one render the SSR arm asserts. Exactly one, not at
least one: two copies of a disclosure is a defect, and §01 is its one home.

**`tests/lint/sovereigntyLightingContract.walker.test.js` holds a second census.** The
estate's title census is an exact equality there, not the ratchet's floor, so a single new
title reds it. Its `titles` figure moves by one and no other key moves: no test file is
minted and no `describe` is opened. The re-record carries its cause in the block's own
established form, and the attribution was done BY ISOLATION at this member's base, per that
block's own law — never by arithmetic. See §5.

## §4 · Change manifest

| Path | Kind |
|---|---|
| `src/components/home/LandingBelowFold.jsx` | MODIFY: render `forge.ceiling` in §01, and correct the header comment that recorded the key as unreferenced |
| `tests/copy/landingClaimsParity.test.js` | TEST: +1 rendered arm (the vacuity cure) |
| `tests/ui/homeLanding.test.jsx` | TEST: invert the stale pin, 0 → exactly 1 |
| `tests/lint/sovereigntyLightingContract.walker.test.js` | TEST: the authorized census re-record, cause attributed |

The comment correction is not cosmetic. The old text recorded `forge.ceiling` as
unreferenced landing copy; leaving it would make the file's own header state the opposite of
its behaviour, which is the §320 class one level down (the J9 / RR-2 `parityContract`
precedent). Comment-only edits can fire ratchets — priced and declared, and this member
edits the file regardless.

## §5 · Census

- **censusAuthorization:** ODQ §363.1, under the charter at ODQ §402. **+1 title.**
- **Re-derived at base, both ends.** `test:ratchet` baseline at base: 28,274 tests /
  2,387 files / skipped ceiling 1 / eleven banked entries, none of them in any file this
  member touches. `totalTests` there is a scope FLOOR, so +1 does not move it.
- **The exact-equality census:** `titles` 20,719 → 20,720. `files` (2,497), `parked` (364),
  `credited` (2,133) and `suiteTitles` (5,785) all stand.
- **Attributed by isolation, at this member's own base:**
  - BASEPROOF — separate detached worktree at the verified base with its own `npm ci`: the
    walker green, 33 of 33, exit 0. So 20,719 was an answer to the question at the base
    actually being built on, not a tuple carried in from elsewhere.
  - Reverting `landingClaimsParity` alone, with the `homeLanding` edit fully applied,
    convicted 20,719 green — the receipt that the other file's edit is census-neutral and
    that nothing else in the member reaches this arm.
  - Reverting `homeLanding` alone, with the parity arm applied, convicted 20,720.
  - Each figure was read from the arm's own failure message, never computed.
- A title RENAME is count-neutral by construction, which is exactly why it was measured
  rather than assumed.

## §6 · Acceptance

| id | case |
|---|---|
| A1 | `forge.ceiling`'s sentence is rendered in §01, asserted in the output HTML of a real render, behind a positive control that reds first if the section did not render. RED at base and GREEN at the cure, and the captured transition is the conviction of the defect rather than a claim about it. |
| A2 | The string still contains `up to a ${ANON_MAX_SIZE_LABEL}` — the existing copy-side arm re-run, so the displayed claim stays bound to `TIER_GATE` through `tierFacts`. |
| A3 | Un-referencing the key (the mutant) reds A1 — and reds the jsdom pin too, both instruments convicting independently, with the anchors staying green throughout so the conviction is the assertion's and not the render's. Restored digest-exact. |
| A4 | First-paint byte budget green: the landing namespace stays lazily segmented, so the eager entry chunk does not move. |

## §7 · Trust boundary and STOP

- **Trust boundary (paid-surface honesty).** The claim binds to `TIER_GATE` through
  `tierFacts`. A wording change that breaks the parity token is a red, not a drift, and the
  member deliberately leaves both the token and the substitution untouched.
- **STOP (not reached).** The §01 section proving structurally unable to carry the line
  without design-system motion would have been a STOP-RAISE with a screenshot pair. The
  panel is a prose column; it carries a paragraph with the file's existing disclosure idiom
  and no new style constant.
- **Owner-gated remainder:** any NEW wording, which is the copy walk and which this member
  does not touch. Nothing else.
- **A base-inherited stray is RECORDED, never cured here** (§384's discipline): under full
  directory load `tests/lint/postureNameCollision.walker.test.js` reds with a varying cast —
  one title at base, three in this tree — and passes 20 of 20 in isolation. It reds at the
  verified base in its own worktree with its own install, so it is not this member's, and
  curing it here is out of scope.
