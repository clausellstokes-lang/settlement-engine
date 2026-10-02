# The Voice Program — deeds in the Herald, places in the dossier (plan)

> **Progress** (append after every wave — this blockquote alone must reconstruct program state)
> - The full gate: PENDING at the time of this note; the run's verbatim result is appended in the next plan note.
> - Wave 4 block 1 (shipped, `e76ea7f3c`) — the arrival hook names only what the settlement holds: STRUCTURE_CLAIMS (wall or
>   gate, guard, market, granary, house of worship) draws a stress vignette only where its structures stand, and eleven
>   structure-free vignettes join the pool (siege, infiltration and monster pressure had none). +3 pins, red-proven (74 of
>   120 stress cases named a structure they lacked without the filter). Census `07941940c`; signed re-record `6990709a0`
>   (golden, 516/525) + `310e57f06` (fence, 59/360, zero residue); instruments `eb8cd386f`. Fact shift: NONE.
> - Wave 3 (shipped, `d2dfd88b5`) — the arrival scene is a place: hook, sight, the SENSE of a trade the settlement practises
>   (sixteen keys; "dominant" lines where its exports name the trade, the owner's "hammering echo" for a weapons exporter),
>   its PEOPLE by culture, and one CLOSING truth (a printed danger made visible, else the trace of a Recent or Living-memory
>   event, else poverty or plenty); the tier template, the slider-keyed magelight line and the restating addon retired.
>   +21 pins (arrivalScene.test.js, red-proven by four executed mutations). Census `367572f39`; signed re-record
>   `dc8a022e1` (golden, 525/525) + `ff0d296bf` (fence, 360/360, zero residue); instruments `5c12d56ee`. Fact shift: NONE
>   (525 rows, every non-prose key byte-identical; pressureSentence unmoved). Text shift: every arrival paragraph.
> - Wave 2 (shipped, `ed3768dc1`) — the pressure sentence and the arrival scene draw on named child streams. Signed
>   re-record `a7202d720` (golden, 525/525) + `426c7f7b4` (fence, 360/360, zero residue); instruments `765af37e2` (the fork
>   census mint bound 36 -> 38, the two new streams). Fact shift: NONE (525 rows). Text shift: arrival 525, pressure 519.
> - Wave 1 (shipped, `aefc42c2e`) — the Herald speaks in deeds. Cures: `c39bd8c94` (thirteen goals had no aim; "is out to
>   survive tribute"), `5ae70a4de` (the walkers the deed register opted into), `192861540` (observed-shape re-freeze: the
>   feed's read of outcome.appliedHeadline gained writers), `a85aa6c10` (landed packet AO-2+3's required symbol re-pointed
>   from the struck phrase to the de-hedge that keeps it for saved proposals). Signed re-record `619b4f0f7` (Herald desk) +
>   `78ed2d08c` (preset witness, 7 of 8 rows). Fact shift: NONE (leaf diff: headline, summary, applied headline,
>   population-history reason only). ⚠ MISS, RECORDED: wave 1 was committed on focused receipts while the shared gate was
>   held, and the broad run later found six walkers it owed; the cures above are that debt, each attributed.
> - Program opened 2026-10-02 on `feat/herald-voice-2026-10-02` (cut from `fp/integration-2026-09-23` at `8a6f6b9d3`),
>   the owner's word "build it all" on the chair's prose-system research. ODQ §934.88 (ledger `757c928ff`) is the row every
>   shift record cites. Nothing pushed; push, merge and deploy are the owner's.

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

## Judgments taken under "I leave all judgment to you" (each vetoable)

> Waves 1–3 decisions (delegated 2026-10-02; each vetoable; all favour the owner's "build it all" without a fact shift):
> - VP-J1 one authored deed form per deed (the strategy-game log's fixedness); variety stays the eventProse pools'. Veto
>   reverts heraldDeeds.js to pools.
> - VP-J2 a pending proposal speaks UNDER WAY ("is moving against"), still true if the DM rejects it; its applied twin DONE.
> - VP-J3 all 26 de-hedge rules kept, inert, for proposals saved before the program (THE PROMISE).
> - VP-J4 wave 2 keeps the name mint consuming its two shared draws though nothing reads that position now.
> - VP-J5 the chair signs each wave's text-only re-record under the owner's words (ODQ §934.88). Veto reverts the wave.
> - VP-J6 heraldDeeds.js admitted as coupling SUBSTRATE (ARGUED_ROSTER_CEILING 31 -> 32, imports nothing). Veto: a layer
>   family home instead.
> - VP-J7 the fork census's mint bound 36 -> 38 for wave 2's two named streams (same one-mint slack).
> - VP-J8 the arrival memory window MIRRORS the History tab's own "Living memory" band (30 years, extracted by the test)
>   instead of a new tuning number.
> - VP-J9 under a stress vignette the closing beat and the sight yield: the vignette is the tension.
> - VP-J10 ARRIVAL_ADDONS retired rather than kept as a second approach sentence.
> - VP-J11 EM-R2.md's five historical line addresses written as prose (the record keeps its history) rather than giving
>   the landed packet the HISTORICAL banner.
> - VP-J12 AO-2+3's required symbol re-pointed to appliedSummaryFor, the de-hedge that still carries the packet's work.
> - VP-J13 the hook keeps every authored stress vignette and FILTERS by the structures each names, rather than rewriting
>   the vignettes tier-neutral; eleven structure-free vignettes are the floor. Veto: rewrite the pool instead.
> - VP-J14 a shared .git/config found at core.bare=true (05:23, written during other sessions' gate and push runs, not by
>   this session) was restored to false at 05:26 so every checkout worked again; the pre-repair file is kept in the chair's
>   scratchpad. Veto is moot: bare=true is never valid for a repository with a working tree.

## Slotted, never deferred (the owner's law of 2026-09-19)

- ~~The STRESS_DESCS vignettes name gates, walls and granaries at every tier.~~ LANDED as wave 4 block 1 (`e76ea7f3c`).
- The dossier desks' corpus (docs/content/RECEIPT_POOLS_*.md, 09-12 law) block by block in exposure order. SLOT: waves 4+,
  block 2 onward, on the banked rewrite's seated machinery (marker, two drafting lenses, selector, refuter); its first act is
  the exposure measurement that orders the blocks.
- The landmark lines (structuralValidator.js checkInstCompat) quote catalogue names whatever the culture (a "great
  cathedral" spire over an East-Asian metropolis). SLOT: the same block; the catalogue's own culture naming is the
  setting-vocabulary program's, and the block asks it rather than renaming here.

## Owner-decision queue

- Push and merge of `feat/herald-voice-2026-10-02` into the FP line (the owner's; nothing pushed).
- The landing-map branch on master (`fix/landing-realm-pins-2026-10-02`): merging to master deploys.
