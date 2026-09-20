# FIX-P9 — STOP: COMMITS 3 AND 4 BOTH MOVE A REGISTERED GOLDEN (2026-09-20 ~15:0x EDT)

Raised by the resumed FIX-P9 agent, UNGATED, before applying anything. Nothing is committed.
Worktree `$SP/lane-fix-p9`, branch `fix-tier-word-2-2026-09-20`, tip `de16bdf6a`, `git status --short` EMPTY.

## THE SMALLEST MEASURED CONTRADICTION

Commit 3 changes the glyph that `src/components/organic/samples/PricingSample.jsx` RENDERS.
That component is `pricing-desk` in `src/components/organic/samples/registry.jsx`, and
`tests/design/organicSamples.test.js` byte-pins its SSR render:

```
it('each committed fixture is byte-identical to a fresh SSR render (drift guard)')
   expect(readFileSync(file,'utf-8'), `${s.id}.html is stale …`).toBe(buildDoc(s));
```

The committed artifact already holds the pre-cure glyph, counted with node (not a grep engine):

```
docs/samples/organic-craft/pricing-desk.html : 13 dagger occurrences
docs/samples/organic-craft/library-desk.html : 1 rendered >Thorp< cell
```

Each of the 13 is the literal `<span class="oc-tier__mark" aria-hidden="true">†</span>` — emitted by
the ONE JSX line commit 3 rewrites. So the drift guard's two sides cannot agree after commit 3, and the
file's only refresh door is:

```
UPDATE_ORGANIC_SAMPLES=1 npx vitest run tests/design/organicSamples.test.js
```

**`UPDATE_ORGANIC_SAMPLES` is an `UPDATE_*` door, and the dispatch forbids every one of them**
(`UPDATE_GOLDEN`, `GOLDEN_SHIFT_SIGNED`, `LIGHTING_CENSUS_REFREEZE` and every `UPDATE_*` door are
FORBIDDEN), as does LANE-PARALLEL §6 — *a change that would move a golden is a STOP*.

**Commit 4 is blocked by the same door**: `library-desk.html` renders the Gull's Watch cell
`<span class="oc-ink-body">Thorp</span>` from `fixtures.js:86`, so curing that literal moves the same
byte-pinned artifact.

## WHY THIS IS THE CHAIR'S CALL AND NOT THE LANE'S

The estate's own register does NOT class this as a world fingerprint. In
`tests/fixtures/.golden-freeze-register.json` it sits on the **`excludedEnvSpellings`** roster — an
affirmative, written exclusion, not an inventory row:

```json
{ "envSpelling": "UPDATE_ORGANIC_SAMPLES",
  "files": ["tests/design/organicSamples.test.js"],
  "reason": "A build-artifact byte golden of the docs/samples HTML. It pins a RENDERED PAGE,
             not a generated world; it moves when the sample builder moves." }
```

So the register itself says this golden **lawfully moves when the sample builder moves**, which is
exactly what commits 3 and 4 do. The blanket lane prohibition is nonetheless unqualified, and narrowing
it is not a lane's act. Two readings, both converging on the chair:

- the `UPDATE_*` ban is categorical ⇒ neither commit lands in this lane in any form;
- the ban targets *same-seed world* goldens (LANE-PARALLEL §6 names only the two fixture goldens, both
  re-hashed unchanged this turn) ⇒ the door is lawful here and the lane may run it with the refreshed
  HTML committed **in the same commit** as its source change, which is what keeps the drift guard honest.

**The lane's recommendation: the second reading, with the refreshed artifact committed alongside.**
The render is a pure function of source + CSS on disk; leaving the source cured and the artifact stale
would ship a permanent red, and leaving both uncured keeps a dagger in front of every priced line on
the taste-veto page and "Thorp" in the library sample the owner opens. Either way the chair rules, and
the ruling is one word that unblocks both commits at once.

## THE THIRD READING THE CHAIR MAY PREFER (cheapest, and it needs no door)

Commit 3's `PricingTierCards.jsx` half — the re-cut "⚠ WHAT STILL DIVERGES" comment block — touches
**no rendered output at all**. It could land alone, today, with no golden movement, if the chair wants
the divergence paragraph closed before the sample question is settled. The lane has NOT done this:
the paragraph it would install says the divergence *is closed*, which is only true once the sample
actually follows. Splitting it would make the comment false on landing. Recorded, not done.

## WHAT IS PROVED AND WHAT IS NOT

- CONFIRMED (executed, ungated): the two scratch files' sha-256 match the pause note; both goldens
  unchanged; `npx eslint` BARE on the two cured commit-3 files exits **0** clean; the committed
  `pricing-desk.html` holds 13 daggers and `library-desk.html` 1 `>Thorp<` cell; `espree` parses both
  commit-4 drafts; the tree is clean at `de16bdf6a`.
- PLAUSIBLE (not executed — needs the gate): that `tests/design/organicSamples.test.js` actually reds.
  It is deductive rather than run: the golden holds, 13 times, the exact literal the commit deletes.
  The experiment that settles it is `tests/design` whole, one line, inside the lane's gate window.

## THE NOTE'S STEP 2 IS WRONG AND IS CORRECTED HERE

The pause note predicted `git grep -nP '†' -- src` returns **only** `paradigmAxisCatalog.js:178`
after the cut, and "6 comment lines + that one" before it. Measured, both engines agreeing:

| | total `†` lines in `src/` | RENDERED | COMMENT |
|---|---|---|---|
| before the cut | 4 | 1 (`PricingSample.jsx:26`) | 3 |
| after the cut  | 6 | **0** | 6 |

The count goes UP, because both cured files quote the old glyph in the comments that explain the cut.
The honest measurement is therefore **RENDERED sites, not line count**: one before, zero after. A
successor believing the note's prediction would read a correct cut as a failed one.
