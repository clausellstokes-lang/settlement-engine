# Landing Page — Owner Amendments to the Handoff Spec

The binding spec is `HANDOFF - Landing Page for Claude Code.md` (the design
project). This file records every owner amendment issued since; **handoff +
this file = current law**. Sections below are numbered by wave.

## W-L1 (initial build, committed a943cd8d)

**A. Hero eyebrow removed.** The spec's eyebrow (`A SIMULATOR FOR DUNGEON
MASTERS`) is gone — no replacement. *Rationale: the category framing excluded
simulation fans, worldbuilders, and would-be DMs; the H1 carries the hook.*

**B. Commons heading softened.** §05's h2 is `Towns others have forged.`
(was "Towns other DMs have forged."). *Rationale: same audience-gatekeeping
concern, same knowing/dry voice.*

## W-L2 (derived-artifact wave)

**1. Real derivation, deliberately incomplete.** The §02 Brief, §03 Voice, and
§04 why-trace artifacts are FROZEN REAL ENGINE OUTPUT — never authored fiction.
`scripts/generate-landing-fixture.mjs` drives the real pipeline at a curated
seed (`lf-033` → **Cnocby**, village, pop 412, mountain road, two coherent
faction conflicts and the pressure line "Rónnat Sullivan is about to call it
in."), advances 12 real one-week ticks for the why-trace band deltas (causes
verbatim from the engine's causal contributors), and emits
`src/components/home/landingFixture.js` (lazy chunk only). The spec §6 copy for
those artifacts is superseded; connective headings/bodies stay. Incompleteness
mechanics: 2 hooks + an honest "+N more in the dossier" count, Summary tab
active with the other tabs inert, a CSS fade on the brief's final line.
*Rationale: "incomplete because we want them to forge their own — for trust."*
- **Store-path parity (found the hard way):** the store's default forge path
  sets `randomSliderMode = true`, which injects `_randomizePriorities` and
  consumes seeded PRNG draws — a fixture generated without it forges a
  DIFFERENT town at the same seed. The fixture script now generates through the
  store's exact default shape, and the fixture records every store input
  (`mode`, `randomSliderMode`, `importedNeighbour: null`, full config) so the
  button replays them all. Verified live: the in-app button forges Cnocby 412.
- **Anon-ceiling adjustment:** the fixture town must be hamlet/village/town
  only (the anon tier ceiling). *Rationale: the artifact must be exactly what
  an anonymous visitor could forge the moment they click, so the seed tag
  doubles as a verifiable promise.*
- **Stock narration adjustment:** the NARRATED card's prose is hand-written
  STOCK content (sanctioned default — the owner declined to spend AI credits on
  a fixture), grounded EXCLUSIVELY in the fixture's derived receipts and shaped
  to the narrative layer's real output register/layout. It lives in the
  generator script (`STOCK_NARRATION`) and must be re-grounded on every
  fixture regen.
- **Provenance:** each artifact carries a mono seed tag (`seed · lf-010`, the
  why-trace adds `· week 12`). Determinism is the moat; said quietly.

**2. Realm stock image (the one sanctioned no-screenshot exception).** §04's
map should become a static capture of an ACTUAL generated realm whose states
match the chronicle. **Blocked this wave** — a faithful capture requires an
elevated session, a generated Azgaar map + burg placements + canon saves +
campaign wiring across four store slices with a live Supabase outbox attached,
and capture tooling the app doesn't ship; seeding synthetic rows through the
live store mid-flight (W-C1 active in worldPulse) crossed the "do not fake it"
line. Fallback per the amendment: the painted `world-map` scene stays, with
pins/labels drawn from the fixture's REAL neighbor names and REAL applied pulse
states (border incident, criminal pressure). Revisit when a dev-store fixture
path exists.

**3. Commons goes live.** §05 renders up to FOUR real published gallery
settlements, fetched on below-fold mount (anon public read), with decorative
cards as slot-fill and full fallback (zero layout shift; slots are
dimension-identical). **Ranking signal:** `src/lib/gallery.js` tracks
`net_votes`, views, and comments — there is NO fork counter — so the ranking is
`top_voted` (server-side tie-break: recency), the closest available signal to
the architect's fork-count ruling. Real cards link to `/gallery/{slug}`.

**4. Voice pass.** With the artifacts derived, the remaining connective copy
was swept for house voice (knowing, dry, concrete, cause-first). The spec's §6
connective strings already conformed; the net-new strings (forge-exact button,
"+N more", determinism line, votes/open labels) were written to that register.
W-L1's two amendments stand.

**5. "Forge this exact town" (the one interactive artifact control).** The §02
Brief artifact carries a working button that replays the fixture's recorded
`{ seed, mode, config }` through the SAME store forge action as every other
generation (`generateSettlement(seedOverride)` — it owns the anon cap guard and
the counting, so a cap slot is consumed only when generation actually runs).
At-cap anons route to the create surface where the existing at-cap/unlock
treatment renders. No §04 button: forging reproduces week 0, and the why-trace
shows advanced state anon cannot reach — the honest label wasn't worth the
clutter. Funnel tag `Funnel.landingFixtureForge?.()` is optional-chained (a
no-op until the analytics wave lands it, like `welcomeView`).
- **Cap semantics as found (NOT changed this wave):** the owner stated "three
  daily"; the store's actual guard is a split cap — `DEFAULT_DAILY_FULL_CAP = 1`
  full generation + `DEFAULT_DAILY_REROLL_CAP = 2` rerolls, combined alias
  `DEFAULT_DAILY_CAP = 3`, enforced via `anonAtCap()` inside
  `generateSettlement`. Reported as a discrepancy; semantics untouched.
- **Regen policy (determinism honesty):** same seed + same config + same engine
  = the same town. The fixture must be REGENERATED whenever engine generation
  output changes (the goldens-regen policy is the signal); the fixture records
  `generatorVersion`/`simulationVersion` and the contract test asserts they
  exist, so drift is visible.
- **Known regen trigger:** this fixture was generated while W-C1/W-C2 worldPulse
  work (pulseKernel, warDeployment, institutionLifecycle, …) was in flight in
  the shared checkout. The GENERATION path (the button's promise) is unaffected
  by pulse changes, but the ADVANCE-derived artifacts (why-trace, chronicle,
  pins) may shift when that work lands — re-run the fixture script then and
  re-ground the stock narration if receipts change.
