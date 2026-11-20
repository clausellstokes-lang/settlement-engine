# PAGE-1's measure brief (three helpers: A, B, C)

Written by PAGE-1 (seat of the seventh chair) for its own helpers, 2026-11-20. Your assignment is ONE section below
(A, B or C), named in your prompt. Read this whole file first. You MEASURE ONLY: no edit under `src/`, `tests/` or any
file outside your own output directory; no commit, no push, no pull request, no network beyond git fetch.

## The common ground

- THE TREE: this checkout, `/home/user/settlement-engine`, at `0c9069489` (the working line). `node_modules` is installed.
- THE TOWNS (the chair's 300, untouched settings), the recipe of
  `git show origin/lane/chair-2026-11-08:docs/chair/2026-11-20/seventh/measures/holistic/batch2.mjs` (read its first 10
  lines): `await loadGenerationLawPayloads()`, then for each size in `SIZES` (from
  `tests/components/pageCensusWalk.shared.mjs`) and i in 0..49:
  `generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: \`hxd-${size}-${i}\`, customContent: {} })`.
  Import by absolute path from the tree (`${L}/src/...`), as batch2.mjs does.
- RENDERED TEXT (where a fault is in what the page prints): the page census's own walker,
  `tests/components/pageCensusWalk.shared.mjs` (`walkDossier`, `storeFor`) as used by
  `docs/chair/2026-11-20/content/tools/confinement/run.mjs` and `render.census.jsx` on
  `origin/lane/names-3-2026-11-20` (`git show` them; copy what you need into your own directory). It needs the
  vitest/jsdom harness those files use; follow them. Render a subset if 300 is too slow (say so and give n per size).
- YOUR OUTPUT DIRECTORY: `docs/chair/2026-11-20/content/page/measures/<A|B|C>/`: your script(s) (`.mjs`/`.jsx`) and
  each run's output (`*.out.txt`), re-runnable from the repository root by one command you write at the top of the
  script. Run long commands to a file and read the file; never judge an exit status through a pipe.
- HONESTY: every figure is EXECUTED (from your output file) or marked INFERRED (from reading code). Name the file and
  line of every pool and every label you cite. A floor is called a floor. Report "could not measure X, because Y".
- YOUR REPORT to PAGE-1 (your final message): at most 700 words, figures first, each with its file:line cause.

## The owner's rule (binds what you look for)

"A calm town should be as it currently is… Don't invent drama; capitalize on what's already there if it's there…
We are not creating the campaign." A cure will be MORE WAYS TO SAY what is already there, and names drawn from the
town's own record: never a new fact. So measure what exists and what the record holds; do not design.

## A: sameness (F1) and sides blind to the town (F2)

Faults seen by the chair: one fixed wording per kind of tension, e.g. `src/data/historyData.js` :1253 (crime_wave's
unanchored text), :1376/:1380 (disputed_land and its sides), :1396/:1400/:1412 (population_friction). A sentence of
the place's arrival paragraph repeated across two Germanic towns (`src/data/arrivalProse.js` :391, ARRIVAL_PEOPLE).
The tension pipeline: `src/generators/historyGenerator.js` (:583 the draw, :1027 `currentTensions`, :1108
`tensionByMemory`); find the rest (descriptionByDirection, speakRecord, legitimacyHeldTensions, any other writer).

1. For every KIND of tension (`type`): how many distinct description wordings exist in the code (base, byMemory,
   by direction, any variant), how many distinct side-name sets; then in the 300 towns: how many towns carry it, how
   many distinct texts were printed, and the share of towns reached by the five commonest tension texts overall.
2. For every pool the arrival paragraph (`src/generators/narrative/arrivalScene.js`) draws from: pool name, size,
   key (culture, tier, etc.), how many towns draw it, the share of towns whose paragraph shares a sentence verbatim
   with another town's.
3. THE VISITOR'S ODDS: the chance that, of three towns forged in a row, at least two share a tension text word for
   word (resample triples from the 300, all sizes mixed; also per size). Same for an arrival-paragraph sentence.
4. F2: every tension description or side-name (in the table, not only those drawn) that presumes a house, office or
   class the town might lack: a court or legal class, a market or merchants, a guild, a watch or guard, a temple, a
   noble house, an office-holder. For each, what in the town's record would show it exists (an institution category
   or key, a faction, a trade figure: name the field), and the share of the 300 towns that DREW that text/side while
   their own record lacks it. Also: which sides could be NAMED from the town's own powers (powerStructure.factions)
   and institutions when the record holds them (a match table: side-name -> the record's candidate), measured as the
   share of drawn sides where a candidate exists.

## B: labels that argue (F3) and thin pages (F6)

1. F3: for each PAIR of labels a DM reads as one thing, find both sources and measure on the 300 (record-level where
   the label is a pure function of the record; rendered for at least 60 towns, 10 a size, to confirm):
   (a) Overview "Safety" vs Foundations "Law & order", "Criminal opportunity", and the stability heading (e.g.
   "Unstable (pervasive organized crime)", `src/generators/power/governanceNarrative.js`);
   (b) Economics "Output n/100" vs the prosperity label ("Moderate") vs the economy prose ("nobody here calls the
   town poor", `src/data/dossierStateProse/economy.generated.js`);
   (c) "Reliance on magic" (`src/domain/magicReliance.js` :58, `src/domain/display/magicProvisionShown.js`) vs
   "Magical Capability" (`src/components/new/tabs/OverviewTab.jsx`, `DefenseTab.jsx`, `src/domain/display/`);
   (d) any further pair you meet on those pages that reads as the same thing.
   Put each pair on a common ordinal scale (say what you mapped and why), and give the share of towns where they sit
   two or more steps apart, by size. THEN THE CAUSE for each: two different measures under names that sound alike
   (name both inputs), or a real fault (one input read wrong, a stale field, a band misplaced). Quote the code.
2. F6: the pages Daily Life, Outlook and Magic (find their components under `src/components/new/tabs/` and their view
   models under `src/domain/display/`). For each, what it prints at each size (rendered, 10 a size: line count, the
   distinct labels, sample text of one thorp, one village, one city), and what the record holds for that subject that
   it does not print (`src/domain/dailyLife.js`, the town's daily-life / outlook / magic fields: list each field, its
   fill rate over the 300 and whether any page prints it elsewhere).

## C: the machine's words (F4) and secrets or wants that contradict their holder (F5)

1. F4: every label a people card prints from an inner scale (`src/components/new/npcComponents.jsx`, e.g. "Standing"
   :570 from `src/domain/display/npcInteriorityRead.js` :45 INFLUENCE_WORD on `n.influence`; the tie header "Called
   by" :539; find every other). For each: the scale, what it means in the engine (who writes `n.influence`, from
   what), and on the 300 towns how often the FIRST member of a power (the faction's leader: find how the card
   knows it, e.g. "first of Merchant Guilds") reads "marginal"; break down by size and by power category. Is the
   standing relative to the town, the power, or something else? Quote the writer.
2. F5: secret pools (`src/data/npcData.js`, NPC_CRIMINAL_SECRETS_BY_HOLDER :844 and every other secret pool; the
   draw `src/generators/npc/factionLeaderSecret.js` and any other) and want/goal pools
   (`src/data/people/goalFamilies.js`, `src/generators/people/goals.js`): for each pool, which holder roles/classes
   can draw it (`src/domain/roles/roleClass.js :: classOfRole`). On the 300 towns: the share of CLERGY, JUSTICE
   (magistrate, judge, lawspeaker...) and WATCH (captain, guard, constable...) cards whose secret is another trade's
   wrong (define "another trade's wrong" as a short explicit list of secret texts tied to a trade: e.g. protection
   of merchants, inspection records, contraband business, a guild's books: list your mapping), and the pairs of want
   and secret on one card that contradict (a want of principle or faith beside a secret of venal crime: list your
   classification of wants and secrets as explicit tables). Also the holder's temperament where the card has one
   (e.g. "principled") against a venal secret.

## Addendum (11:06 UTC): the chair's leads of 11:05 (to VERIFY, not findings), sent to each helper

- A: 29 kinds in `historyData.js :: HISTORICAL_EVENTS_DATA`; 24 with one unanchored form; `HISTORY_DESC_VARIANTS`
  two more wordings a kind (used only against a kind's own past event); 7 of 87 side slots named. ADD: the visitor's
  odds today and under each step: (1) variants always in rotation; (2) plus sides named from the town's record, a
  lacking side dropped; (3) plus 3 or 6 new wordings for the eight commonest kinds. Where the keyed fork would live.
- B: Safety is `src/generators/safetyProfile.js :: generateSafetyProfile` (a court floor of 1.20 = "Moderate"; never
  reads powerStructure); Output is `economicState.compound.economyOutput` (`priorityHelpers.js :: getInstFlags`).
  ADD: Safety vs Law & order two steps apart; the hall in criminal hands while Safety reads Moderate or better; how
  often the court floor alone sets Safety; Output's drags and how often each is the largest; which pages print
  Safety to a shared or public audience.
- C: `npcGenerator.js :: powerBandOfRole` keyword fault ('Guild Master' vs 'guild_master'). ADD: every reader of
  `influence` and what a corrected match would move in a born town (a patched copy in the helper's script, never
  `src`). "Dean" has no `poolMap.js :: TITLE_SECRETS` row: count catch-all falls per title; the catch-all lines
  that presume an office or trade; whether `settleTitleLines` serves a draw-free re-pick. Want vs secret: count only
  (the goals seat's).
