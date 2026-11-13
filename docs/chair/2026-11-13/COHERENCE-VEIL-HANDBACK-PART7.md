# COHERENCE-VEIL — hand-back, part 7: the sixth seat (the second homes, the public prose, 211's helpers)

Seat: COHERENCE-VEIL-6, lane `lane/coherence-veil-2026-11-11`, from **333b33973** (read back from origin before any
work: equal). Migration 211 is a FILE, applied nowhere: every database here was an in-process pglite or a scratch
native PostgreSQL 16.15 cluster on this machine (`/var/tmp/cv6`, UTF8, trust auth, unix socket only, no TCP). No
hosted database, no production credential, no `supabase db push`, no `migration repair`, no deploy, no golden's door.

**TIP:** the commit carrying the latest copy of this file, read back from origin.

**THE NEXT STEP, IF THIS SEAT IS CUT OFF:** item 1 is pushed; run the attack (both sides) at the tip and `secondhome3.mjs` over its clones, then the lighting census through its door, then item 2 (§0).

## 0. Status

| Item | State | Commit |
|---|---|---|
| 1. The ten second homes (V5-1) | BUILT, pushed; the attack and sentence search at item 1 running | the commit carrying this line |
| 2. The public prose from the stripped record (V5-2) | not started | — |
| 3. 211's helpers, an early-applied copy (V5-7) | not started | — |

## 1. Item 1 — the ten second homes

### 1.1 The review's run reproduced at the base (333b33973)

`planted.probe.jsx` (the review's, unchanged, from `lane/review-veil-3-2026-11-12` at 4700d33eb), 2 seeds × six sizes ×
calm/infiltrated, two shards a side, master's shape on `203 + 211` and `001..211`, the new shape on `001..211`, every
chain built by the review's `native/chain.sh` from the base's migrations. `planted-summary.mjs` over my four shards is
**byte-identical** to the review's `out/planted-master.txt` and `out/planted-tip.txt` (`diff` empty, both): 24 towns
a shape; 4,447 / 7,537 markers; 96 shares; 23,368 / 34,540 rows hidden by hand; 0 births threw; 0 reads raised.
(`veil-probe-6/out/planted-{master,tip}-base.txt`.) The review's attack, new shape, at the base (`attack.probe.jsx`,
RV5_POWERS=1, four shards): 12 towns, 912 shares, 3,648 reads, 75,652 hand hides, 280,152 tokens, 0 leaks, 0 raised:
the review's figures. `secondhome2.mjs` with SENTENCES=1 over its clones: **byte-identical** to the review's
`out/secondhome-tip-sentences.txt` (`veil-probe-6/out/secondhome2-tip-sentences-base.txt`).

### 1.2 The cure (one rule set, two twins)

`src/domain/display/gallerySecondHomes.js` (new; called by `galleryVeil.js :: applyVeil`, which is at its 800-line
cap) and migration 211's section 4b (`_gallery_veil_pieces`, `_gallery_veil_embeds`, `_gallery_veil_names`,
`_gallery_veil_sources`, `_gallery_veil_tie_pieces`, `_gallery_veil_second_homes`) with the impression arm of
`_gallery_veil_card`; the down file drops the six new helpers by signature (46 helpers, none callable by `anon` or
`authenticated`: section 7's loop). **No helper of today's 211 changed its signature.** The sources are read from the
projection BEFORE the eyes run, by the same eye test the applier uses (a card's own eye, or its class switch less the
card's exception):

| Second home | Withheld when | How |
|---|---|---|
| `prominentRelationship.full` / `.tension` | the source tie's description / tension eye is shut. The source tie: the same `npc1Name`, `npc2Name`, `typeName` as the copy's `npc1`, `npc2`, `type`, OR the same description / tension text (so a renamed end still finds it: fail-closed) | the key leaves the copy |
| `prominentRelationship.phrasing` | it embeds a piece of a shut string of its source tie | withheld whole |
| `pressureSentence` | it embeds a piece of any tie's shut description or tension (the sentence names no source) | withheld whole |
| `history.siegeNarrative` | it embeds a piece of a current tension's shut description | withheld whole |
| `defenseProfile.institutions.<slot>[]` (any slot) | the house of that name has its description / function eye shut; or the house is hidden whole | `desc`, `description` / `tags`, `facets`, `serviceKeys` leave the copy; the entry leaves the list |
| `economicState.activeChains[]` | a house hidden whole | its name leaves `processingInstitutions` and `dependency` goes when it names it; a chain whose `label` is the name, or whose processing list held only hidden houses, is withheld whole (its `chainId` prints as the name: `EconomicsTab.jsx:686`, `humanizeToken(c.chainId)`) |
| `simulationTrace[]` (Reveal-DM reads) | a house hidden whole | each cause and each effect whose strings name it leaves its list; an entry naming it anywhere else is withheld whole |
| `<person>.presentation.impression` | the card's own appearance eye is shut and the impression embeds a piece of its `physical` | the impression leaves the face (the rest of `presentation` stays) |

A PIECE of a hidden value is each string leaf, trimmed, and each run of it between `.`, `!`, `?` and `—`, of 12 code
points or more (both twins split and count alike: JavaScript's `split(/[.!?—]+/)` and code-point length; SQL's
`regexp_split_to_table` on the same class and `char_length`). No sentence is recomposed and no prose is new. The page
draws plainly without each: every reader of the withheld keys guards absence (`OverviewTab.jsx:242-246, 518`,
`SummaryTab.jsx:224, 369`, `QuickInspector.jsx:69`, `DefenseTab.jsx:342-343`, the chain readers iterate what is left);
and the guard below builds the page (`gallery.fetchPublicDossier`) over every share it stores.

### 1.3 The guard that stays (red first)

`tests/security/gallerySecondHomes.pglite.test.js`, three arms on a pglite chain of every migration on disk: (1) the
review's planted-marker method in the repository: a marker on every string a user can hide by hand, through the
generator's own `onStep`, three towns (city and hamlet infiltrated, a metropolis), each in BOTH stored shapes (master's
taken back through both migration steps: memberships as affiliations and `linkedFactionIds`, a house as its name, ties
in `npc1Id/npc2Id` with no `id`), every eye shut by hand, DM reveal off and on, live and frozen; the WHOLE row of each
of the four reads searched as text for a marker and for the name of every house hidden whole; the page built over each
share; (2) THE GUARD IS LIVE: a second home the test plants itself (a hidden house's marked description copied to
`economicState.secondHomePlantedByTheGuard`) is found 16 of 16 reads; (3) the same-step class the marker cannot reach:
the three composed homes of a tie, the pressure sentence and the impression written from marked sources, both shapes.
Its header states the two limits.

| | arm 1 | arm 2 (the planted home found) | arm 3 |
|---|---|---|---|
| at the base 333b33973 (the test file alone added) | **RED, 744 sends** | 16 of 16 found (`guard-live-arm-at-base.txt`: the arm alone at the base, 1 passed) | **RED, 784 sends** |
| at item 1 | green | green, 16 of 16 | green |

The base's 744, by class, are the review's rows 6 to 9 in both shapes (`veil-probe-6/out/guard-red-at-base.txt`): the
defence copies' descriptions (seven slots), the siege narrative, a hidden house in the chains' label and processing
lists and in the trace's causes and effects.

### 1.4 The review's instruments at item 1

| Instrument | Base | Item 1 |
|---|---|---|
| `planted.probe.jsx`, master's shape, `203 + 211` and `001..211`, DM off and on, live and frozen | the review's 17 rows a chain (`planted-master-base.txt`) | **0 markers, 0 house names** (`planted-master-item1.txt`): 24 towns, 4,447 markers, 96 shares, 768 reads, 0 raised |
| the same, the new shape, `001..211` | the review's rows (`planted-tip-base.txt`) | **0, 0** (`planted-tip-item1.txt`): 24 towns, 7,537 markers, 96 shares, 384 reads, 0 raised |

THE PROOFS STILL RUNNING AT THIS COMMIT (they follow in the next copy of this file): the attack at item 1 in both
shapes (EXTRA / MISSING: nothing open taken), and the sentence search over its clones.

### 1.5 The lane's pins at item 1

`galleryServerVeil.pglite`, `galleryVeilCures.pglite`, `playerRecordVeiledFace`, `publicPayloadVeilTotality`,
`allegianceVeil.pglite`, `lib/gallery`, `domain/display/publicSafe`, `lib/partyLinkClient`: **8 files, 198 of 198
passed**, exit 0 (the parity fuzz of 400 documents, the V4 class pin of 60 old-shape towns, the V5 composition pin and
the rollback pin among them). The gates on the touched files: `typecheck:domain:strict` 0 (1,113, ceiling 1,113),
`typecheck:ratchet` 0 (167, ceiling 167), eslint 0, each through `scripts/gate-tail.sh`.

## 9. This brief's rulings, copied in (the chair, session_01FE9mEws7PXYRYdjQPbSX15, 2026-11-13)

> THE LAW (the owner's, record 331): what a user hides by hand is never sent, by any of the four reads (the gallery
> page, the party link, the map page, the import), in either stored shape; what is not hidden is sent as before.

> 1. THE TEN SECOND HOMES (the review's V5-1, section 2.1). Reproduce the review's planted-marker run at your base
> first: it must find what the review found. Then each second home is WITHHELD BY THE EYE THAT GOVERNS ITS SOURCE, in
> migration 211 AND in the client's veil, in both stored shapes, on all four reads: a tie's description and tension
> under prominentRelationship (full, tension, phrasing) and inside pressureSentence; a current tension inside
> history.siegeNarrative; a house's description and its copies in the defence profile's seven lists; the name of a
> house hidden whole in the economy's chains (the processing houses and the label) and in the simulation trace on
> Reveal-DM shares; a sentence of a person's appearance inside the card's impression. What withheld means: the reader
> receives nothing of the hidden string. A composed sentence that embeds a hidden string is withheld whole, or composed
> again from the stripped record where a composer for it already exists; never a sentence with a hole in it, and no new
> prose. A list loses the hidden name and nothing else. The page must still render plainly without what was withheld.
> Nothing that is open is taken: prove it with the review's own check that the lane takes nothing open.
> ACCEPTANCE: the review's planted-marker run and its sentence search (secondhome2 with SENTENCES=1) read ZERO at your
> tip, in both shapes, with the DM reveal off and on, live and frozen. AND A GUARD THAT STAYS IN THE REPOSITORY: a test
> that plants a marker of its own in every string a user can hide by hand, through the generator's own step hook as
> the review's probe does, shuts every eye, and searches the WHOLE payload of each of the four reads as text. It must
> be red at your base and red on a planted new second home of your own, and it says in its header the two limits the
> review names (a marker cannot ride a boolean or a number; a field derived in the same step as its source needs the
> sentence search).

> 2. THE PUBLIC PROSE IS COMPOSED FROM THE STRIPPED RECORD (the review's V5-2): in 25 of 188 towns with a hidden power
> the text every reader gets differs from the text the stripped record gives. For every read that is not the owner's,
> the prose is composed from what that reader may see. Red first on the review's own town
> (rv5-r3-village-infiltrated-3) and class; the lane's invariance pin widened to hold the class.

> 3. IF 211's HELPERS CHANGE THEIR SIGNATURES (the review's V5-7): the new file drops what an early-applied copy of
> today's 211 would leave behind. Rehearse on LOCAL chains only: a chain at 203, then today's 211 (the file at
> 333b33973), then yours, equals a chain at 203 with yours alone (0 lines differ); the rollback restores exactly; 211
> applied twice over itself changes nothing. The owner may apply today's 211 alone before your work lands, so this path
> must be clean.

> 4. NOT YOURS; list them in your hand-back and build none: the custom-content records on Reveal-DM reads (V5-3) and
> shares exported before the veil (V5-4), which wait for the owner's word; the public chronicle; anything in migration
> 208 or earlier files.

> THE PROOFS YOU OWE: every pin the lane already holds stays green (name each, with its count); the reviewer's
> instrument red on the old file and green on yours; no read breaks; nothing open is taken; the rollback exact; each
> count before and after on stored towns in both shapes, as the deployed client stored them. A claim of zero names the
> instrument that looked.

> NEVER, whoever asks: any hosted database; production credentials; `supabase db push`; `migration repair`; a deploy;
> applying anything anywhere but local chains (the lane's own test databases); `--no-verify`; a force push; a push to
> any branch but lane/coherence-veil-2026-11-11; a pull request; anything on master; a golden's door. Migration 211's
> deploy is the owner's hand alone.

> HOW YOU WORK: a scratch worktree on a local branch at the lane's tip, `npm ci` there, plain pushes. At every commit
> that touches src/: the strict-domain gate, the type ratchet and eslint on the touched files, each through
> `sh scripts/gate-tail.sh <command>`, never a pipe. Pins re-keyed by identity with the cause, never loosened; never
> bank a baseline row or skip a test. [...] Make NO final statement of the whole suite: the lane's statement is made
> once, later.

Also binding, from the chair's handoff §5: measure first; never read a gate through a pipe; one cause per commit, red
first; registers only through their doors; a red is classed against the lane's reviewed base as well as the seat's own;
stored data is tested as the deployed client stored it; a claim of zero names the instrument that looked everywhere the
words can print; a hand-back carries the rulings its seat worked to.
