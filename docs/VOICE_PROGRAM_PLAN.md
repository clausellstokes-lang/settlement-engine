# The Voice Program — deeds in the Herald, places in the dossier (plan)

> **Progress** (append after every wave — this blockquote alone must reconstruct program state)
> - Program opened 2026-10-02 on `feat/herald-voice-2026-10-02` (cut from `fp/integration-2026-09-23` at `8a6f6b9d3`),
>   the owner's word "build it all" on the chair's prose-system research. Nothing pushed; push, merge and deploy are the owner's.

## Sources

- **The owner's words, 2026-10-02, in order (session 93391427):** "Updates like these need to reflect actions not to
  potential. Like a definitive actions. Such as X is targeting Y. A has captured B." · "I leave all judgment to you" ·
  "we can have pools that speak to what's in the dossier and simply not contradicted rather than treat it as the only
  source of truth" · "each variant should insight something regarding either senses, culture, about the people, … trade
  dynamics, recent history or events, the economic makeup … the hammering … the smell of bread … If there's corruption
  some visible sign" · "think about Larian entertainment or BioWare" · "the voice rules … rhythm and cadence and vernacular,
  I like all of that so please keep it" · "definetely research the system for how we both select, choose, and join prose
  and pools … i don't want ot break anything" · "build it all".
- **The law already in force (ledger):** `docs/VOICE_AND_TONE.md` (the archivist; no em dash, no bang, no digit in prose) and
  `docs/rewrite-retro-2026-09-12/THE-LAW-CONSOLIDATED-2026-09-13.md` (since 2026-09-12 a sentence is lawful if it does not
  contradict the settlement; the four floors; ruling 41 unfalsifiable/coupled; rulings 31–39, one physical particular per
  page). The corpus rewrite under that law was BANKED 2026-09-14 (`docs/REWRITE_RECUT_PROGRAM_PLAN.md`); this program
  resumes it under the owner's "build it all".

## The audit (measured 2026-10-02 at `8a6f6b9d3`; every row CONFIRMED in code)

Five prose systems, each with its own selection law:

| System | Chosen | How it picks | How it joins | Persisted | Guard |
|---|---|---|---|---|---|
| Settlement prose (arrival, pressure, culture, NPC, institution desc) | generation | the SEEDED generation stream (`kernel/rngContext`) | string concatenation | yes | generator golden master (signed door) |
| Dossier desks (6) | render | per-variant hash keyed on seed·block·pool·frozen `vid`, argmax; no draws | composer (economy, defense) or one sentence per pool | no | projection `--check`, shift register, prose manifest (signed door), voice ratchets |
| Herald event prose | pulse | `pickLine` FNV of a stable seed; text-only | headline + summary; curation de-hedges | yes | eventProse laws (SP-6 ≥4), the three news contracts |
| Herald display voice | render | hash | per entry | no | its tests |
| The Scribe (AI) | once | model + refuter | — | — | DARK, another branch |

Findings:

- **H-1 The Herald prints the simulation's candidates.** 15/147 headline templates "may …", 10/123 summaries modal, 4 name
  mechanics; the two lines the owner named are the worst.
- **A-1 The arrival scene is outside the governed corpus.** Four parts joined by a space: a stress or route opener, a
  TIER TEMPLATE identical for every town of a tier, a magic line keyed only to the magic slider (`priorityMagic ≥ 40`
  prints "A magelight lamp post marks the main gate", the default is 50), and a ≤2-variant landmark. No line is keyed to
  what the town makes, eats, worships, fears or has just lived through.
- **A-2 The arrival and pressure draws ride the assembly step's SHARED stream.** Coherence is already on its own
  substream; `resizePoliticalRoster` follows on the shared stream and takes no draw until the density-law dial flips, at
  which point an arrival draw-count change would move political rosters.
- **C-1 Most dossier pools predate the 09-12 law** ("every claim licensed"), which is why they restate their keys.

## Method

Gates: fast = the focused files of the wave; quick = `npx eslint <files>` + `node scripts/check-full-typecheck.mjs`;
full = `npm run check:tail`. Every wave: build → focused tests (red-first where a behaviour is pinned) → instrument
re-pins through their own doors, each with a dated attributed note → goldens only through the signed door with a shift
record citing the owner's words → full gate → one commit naming the wave → a plan note here. Push/deploy never.

## Owner decisions honored throughout (do not violate)

- THE PROMISE: a seed is a starting world forever; lived history immutable (saved news keeps its wording; the old
  de-hedge rules stay for proposals saved before this program).
- A FACT shift is forbidden; a TEXT shift is declared and recorded once per wave through the signed door.
- The voice bible's mechanical bars (no em dash, no exclamation mark, no digit in prose), the archivist, one idea per
  sentence, causality as rhetoric — kept as the owner asked.
- The four floors; the deity doctrine (the followers act, the god does not); finite semantics (authored typed buckets).
- The covert seam fails closed: a visible sign of a COVERT fact is a leak (ruling 26's reassuring source is the idiom).

## Wave 1 — the Herald speaks in deeds (risk: medium)

Findings H-1. Under-way and done forms for every proposal headline (`appliedHeadline`, already the feed's field), the
owner's two lines and their variants struck from the pool, the deed register `src/domain/worldPulse/heraldDeeds.js`,
its law test, the news contracts re-pinned. Exit: zero "may" headlines and zero potential or mechanic summaries in the
pool; the gate green.

## Wave 2 — the arrival draws on their own stream (risk: low)

Finding A-2. Pressure sentence and arrival scene each on a named assembly substream (the coherence precedent). Exit: no
fact moves (the golden master's FACT fields byte-identical), one declared text shift.

## Wave 3 — the arrival scene is a place (risk: medium)

Finding A-1. Rebuilt as four beats keyed on facts the town holds: SENSE (its dominant trades and institutions), PEOPLE
(its culture), TENSION (the visible sign of its strongest pressure, never of a covert fact), and the HOOK (the existing
stress and route openers). Authored pools under the 09-12 law with an anchoring test (every keyed line's trigger fact is
present) and a no-contradiction test (no line names an institution, good or condition the town lacks). The tier template
and the slider-keyed magic line retire. Exit: the five-town read shows no repeated sentence and every line traces to a fact.

## Waves 4+ — the corpus rewrite resumed (risk: high; one block per wave, exposure order)

Finding C-1. Each block re-authored in `docs/content/RECEIPT_POOLS_*.md` under the 09-12 law and ruling 41, projected,
its shift-register row and manifest re-recorded through the signed door. Order by measured reader exposure.

## Final wave — prevention

The voice law as ratchets over every prose family (no modal potential in a Herald line, no mechanic noun in a reader
line, no tier template), a completion memory.

## Owner-decision queue

- (none yet)
