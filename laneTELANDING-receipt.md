# lane TE-LANDING — receipt

## OUTCOME (read this first)

**No code was written, and none should be. The dispatch is STALE: the scrollable
landing page it asks me to build is ALREADY BUILT and has since been evolved past
the handoff spec by a documented chain of later owner orders.**

Executing the dispatch as written would have been a **destructive regression** —
it would revert THE FILM RULING, restore copy the owner explicitly deleted,
restore population figures the owner corrected as wrong, and re-add a purchasable
Founder tier that ODQ/DOM-3 removed.

**Final tip: `2cdb87fac566b3d6803a0dce9d59df13f07c1c9e` — UNCHANGED. Nothing to CAS.**
My worktree is byte-identical to the build tip (`git status --porcelain` empty).

Worktree left in place at:
`/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/6298872d-53af-4c8a-99e5-139bfc5bfc1f/scratchpad/laneTELANDING-tree`

Final verification: worktree HEAD `2cdb87fa` == `claude/composite-r4` `2cdb87fa`
(ref did not move during the lane). `git status --porcelain` reports exactly one
line: `?? node_modules` — **that is my own symlink to the main tree's
`node_modules`, created to run vitest; it is NOT foreign dirt and NOT a source
edit.** Zero tracked files touched. Note for siblings: `node_modules` is
untracked-but-not-ignored in this repo, one more reason `git add -A` stays
forbidden.

---

## The decisive evidence

The handoff spec file is dated **Jul 11 02:00**. The landing implementation
commit — `a943cd8d "The salt-road landing — six sections, one road, every claim
an artifact"` — and ~15 successor commits post-date it. The spec is the **origin
document of already-landed work**, not a request for new work.

`src/components/home/LandingBelowFold.jsx` cites this exact spec by section
number in its own header docstring:

> "Spec constraints held: tokens only (§3.1); gold the only brand accent, violet
> ONLY in §03 + the faith chip in the §04 chronicle (§3.2); Lucide icons, no
> emoji (§3.5); every control routes and decorative chips are plain spans (§3.8);
> `<section aria-labelledby>` + h2."

The implementers built from this document. It is closed.

## Files that already exist (all of §2's "Rewrite"/"Add"/"Assets")

| Spec §2 target | Live state |
|---|---|
| `src/components/HomeLanding.jsx` rewritten | Done. Hero-only + `React.lazy` below-fold chunk. Route/entry contract intact. |
| new strings, no inline literals | Done — but in `src/copy/landing.js`, a dedicated lazily-segmented namespace with its own `tl()`, **not** `strings.js`. See RAISED-1. |
| `LandingBelowFold.jsx` / `LandingArtifacts.jsx` / `landingFixture.js` | Exist (27KB / 23KB / 6.8KB). |
| `public/backgrounds/landing/*-1400.jpg` | **All five already present at the exact spec paths.** |

### Asset measurements (spec §2 ≤350KB each, §8 ≤1400px, total ≤1.6MB) — all PASS

| File | Dimensions | Bytes | ≤350KB |
|---|---|---|---|
| `city-1400.jpg` | 1400×788 | 228,429 | PASS |
| `create-1400.jpg` | 1400×788 | 158,032 | PASS |
| `thorpe-1400.jpg` | 1400×933 | 303,645 | PASS |
| `village-1400.jpg` | 1400×788 | 268,788 | PASS |
| `world-map-1400.jpg` | 1400×788 | 153,282 | PASS |
| **Total** | | **1.1 MB** | PASS (≤1.6MB) |

Nothing to generate. I ran no `sips` conversion because the work was done.

## Per-section conformance — spec vs. live

| § | Spec says | Live | Verdict |
|---|---|---|---|
| Hero | eyebrow `A SIMULATOR FOR DUNGEON MASTERS` | **removed, no replacement** | SUPERSEDED (owner: category framing excluded worldbuilders/would-be DMs) |
| Hero | sub contains "Not a dice roll." | removed | SUPERSEDED — commit `5edac6f0` |
| Hero | village scene, `background-attachment: fixed` | `still-0-desk.jpg`, journey film backdrop | SUPERSEDED — **C2 THE FILM RULING**, commit `46ef7167` |
| Hero | single `h1`, Crimson 58→34px, cream, balance | exact | HELD |
| §3.7 | ceiling string stated once | one occurrence, `landing.forge.ceiling` | HELD (text owner-reworded; see RAISED-2) |
| 01 Forge | Instant Draft artifact w/ 5 size pills | widget **deleted**; Cnocby `MiniDossierCard` fills the slot | SUPERSEDED — owner order 2026-07-22 |
| 01 Forge | Hamlet 20–80 / Village 80–400 / Town 400–3,000 / City 3,000–12k / Metro 12,000+ | 61–400 / 401–900 / 901–5,000 / 5,001–25,000 / 25,001+ | **SUPERSEDED — the spec's figures are WRONG.** Walk W1 owner order 2026-07-21 (ledger `70a19ce5`) corrected them to engine canon `POPULATION_RANGES`; the spec's contradict the Create page. |
| 02 | waypoint `02 · The brief`, Briarhollow/Maera dossier | `02 · The visual`, real v2 map plates; dossier content is **frozen real engine output** | SUPERSEDED — commit `6736eeff` + W-L2/1. Strictly *stronger* on the spec's own §1 thesis. |
| 03 Voice | `✦ 1 credit` | `5 credits` | SUPERSEDED (repricing) |
| 03 Voice | violet only here | held, + faith chip in §04 chronicle (spec §6 itself permits this) | HELD |
| 04 Realm | `ADVANCE TIME — MONTH 7`, `Month 7, Year 1` | week-based: `Advance time · week {week}` | SUPERSEDED (engine unit is weeks) |
| 05 Commons | 3 decorative cards | **6 slots fed live from the real gallery**, placeholders labeled `(placeholder)` | SUPERSEDED — Walk W1, ledger `4f71743a` |
| 06 Closer | 3 tiers Wanderer/Cartographer/Founder, Founder = LIFETIME one payment | **4 tiers** incl. Surveyor AI band; Founder = "By invitation", live seat counter | SUPERSEDED — DOM-3 `cea076f5` ("a chair is given, never sold"), ODQ §118 |
| 06 Closer | 2×2 not specified | 2×2 grid, maxWidth 680 | SUPERSEDED — owner order 2026-07-22 |
| §11 | `footer.tagline` = "derived, never rolled" | **key does not exist** | SUPERSEDED — commit `c2631ee9` removed the tagline |
| §4 | waypoint spine, mono pills, gold dot | exact, incl. dark variant | HELD |
| §3.8 | every control routes; decorative chips are spans | held **and pinned** | HELD |
| §9 | one h1 / labeled sections / aria-labelledby | held **and pinned** | HELD |

## The §9 QA checklist is already an enforced test estate

`tests/ui/homeLanding.test.jsx` (255 lines, 11 tests) pins the spec's acceptance
list item-for-item, and each deviation carries its owner order inline. Notably it
pins the *inverse* of one spec clause:

```js
// tests/ui/homeLanding.test.jsx:104-107
test('the anon ceiling string does not appear on the landing', async () => {
  ...
  expect(screen.queryAllByText(landing.forge.ceiling)).toHaveLength(0);
});
```

So the ceiling string's absence from the rendered page is **deliberate and
pinned**, not the defect it first looks like. Also present:
`tests/copy/landingClaimsParity.test.js` (binds checkable claims to enforcing
config) and `tests/components/welcomeJourney.test.jsx` (film backdrop).

I did **not** rewrite these tests. Their titles are census-accounted; rewriting
them to a superseded spec would have reverted live product law and disturbed the
census for nothing.

## Test evidence — four-leg flake triage

All reds were **machine-load timeout flake**, CONFIRMED by isolation. Load average
hit **71.10 → 90.27** with 33 node processes (siblings + the RS-5 soak), exactly
as the dispatch warned.

| Leg | Command | TRUE_EXIT | Result |
|---|---|---|---|
| 1 | 3 files together (load 71) | **1** | 5 failed / 16 passed — below-fold lazy chunk exceeded its 10s first-mount budget |
| 2 | `homeLanding.test.jsx` alone | **0** | **11/11 pass** |
| 3 | `welcomeJourney` + `claimsParity` | 1 | 1 failed / 9 passed |
| 4 | `welcomeJourney.test.jsx` alone | **0** | **4/4 pass** |

Mechanism CONFIRMED, not guessed: transform time fell 28.65s → 5.35s and
environment 23.39s → 3.37s between leg 1 and leg 2, and within leg 1 the *later*
tests in the same file — which depend on the same below-fold chunk but hit the
module cache — passed while only the first-mount ones timed out. The test file's
own comment names this cost: *"the FIRST mount pays the store/gallery/fixture
module compile for the whole file."*

**Zero reds attributable to code. Zero reds attributable to me — my tree is
pristine at the build tip.**

No full gate was run: I changed nothing, so there is nothing to gate, and a full
gate at load 90 would produce only more of the flake above.

---

## RAISED

**RAISED-1 — spec §2/§11 name `src/copy/strings.js`; no such file exists.**
The copy lives in `src/copy/landing.js`, a deliberately lazily-segmented namespace
with its own `tl()` resolver. Its docstring explains why: `en.js` rides the eager
first-paint entry chunk, and ~4kB of marketing copy would blow the razor
first-paint byte budget (`tests/build/vendorPdfLazy.test.js`, sub-kB margin). The
live architecture is **correct** and the spec clause is obsolete. No action.

**RAISED-2 — the anon ceiling string is now dead copy (owner call, not mine).**
Spec §3.7 makes `landing.ceiling` "the only place the free limit is stated." The
widget that rendered it was deleted (owner order 2026-07-22) and a test now pins
that it renders **zero** times. Consequence: **the landing page no longer
discloses the anonymous size ceiling anywhere.** The hero says "Free. No account
needed to forge your first town."; `forge.micro` says "No account needed" —
neither states the cap. That is a product-disclosure question and is owner-gated,
so I did not touch it. The string survives in `landing.js` as an inert key and is
still claim-bound by `tests/copy/landingClaimsParity.test.js:47`.

**RAISED-3 — one genuinely dead binding (cosmetic, deferred).**
`LandingBelowFold.jsx:232` builds `TIER_FACT_VARS = { anonSize: ANON_MAX_SIZE_LABEL, ... }`,
but no surviving tier body carries an `{anonSize}` token (the Wanderer body was
rewritten). The import and the var entry are inert. Harmless, and removing it is
not my call under a stale dispatch — **deliberately deferred, documented, not a
bug to re-find.** The comment above it still describes `{anonSize}` as live,
which is the part that could mislead a future reader.

**RAISED-4 — packet scope: not applicable, because there is no change.**
The question is moot at zero diff. For the record, `PACKET_STANDARD.md` scopes
packets to *"implement a not-yet-built subsystem slice"* — the landing is built,
so it is not a packet surface. Note also, should the chair ever dispatch landing
work: §"Default hard scope budget" states **"Broad fences such as `src/domain/**`,
`src/components/**`, or `tests/**` are not allowed"** — a landing packet would
need exact per-file targets.

**RAISED-5 — the memory index is AT its hard read limit; I declined to append.**
`memory/MEMORY.md` measures **17,135 bytes**, past the ~17KB hard read limit its
own header declares (*"the TAIL goes invisible first — FOLD to an archive, never
trim"*). I wrote the topic file
`memory/landing-handoff-spec-is-closed-and-superseded.md` but **did not add an
index line**, because appending would push the index further past the limit and
risk making the tail invisible — the exact failure the header warns about. The
new file is therefore a deliberate temporary orphan. **A chair-level index FOLD
is owed**, and this pointer should be placed as part of it.

## Judgment calls (vetoable)

**JUDGMENT: chose to implement nothing and deliver a conformance audit instead of
rewriting `HomeLanding.jsx` to the handoff spec — because the spec pre-dates its
own implementation and ~8 later owner rulings, so executing it would revert
signed product law. Say "veto" to flip it** (flipping means: knowingly regress
C2 THE FILM RULING, Walk W1's population correction, and DOM-3).

**JUDGMENT: chose not to run the full gate — because the diff is empty, so there
is nothing to gate, and load average 90 would yield only more of the documented
flake. Say "veto" to flip it.**

**JUDGMENT: chose not to append to `MEMORY.md` (RAISED-5) — index integrity over
pointer completeness. Say "veto" to flip it.**

## Recommendation to the chair

Retire this dispatch. If landing changes are wanted, they need a **fresh spec
written against the live page**, because this handoff would revert:
THE FILM RULING (C2), the W1 population-range correction, the DOM-3 Founder
ruling, the Surveyor AI band (ruling #3), the six-slot live gallery commons, the
"Brief → The visual" retitle, and the deleted "derived, never rolled" tagline.

The spec's own §1 zero-contradictions law is what forced this call: adopting its
population figures would have put the landing back into direct contradiction with
the Create page, which is the exact defect Walk W1 was ordered to fix.
