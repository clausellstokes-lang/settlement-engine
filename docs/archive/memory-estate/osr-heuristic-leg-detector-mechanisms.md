---
name: osr-heuristic-leg-detector-mechanisms
description: "⭐⭐ THE SIX MECHANISMS BY WHICH THE OBSERVED-SHAPE HEURISTIC LEG MANUFACTURES FALSE ROWS (Opus review lane, 2026-08-10, each confirmed from source + a worked instance): M1 ungrounded single-home prior · M2 parameter/return union collapsing to ONE shape · M3 spread-only object-literal resolution · M4 element-access asElem IDENTITY on a non-array shape · M5 a corpus shape with ZERO observed keys · M6 sibling-slice poverty (the walker binds the THINNEST member of a shape family); ⚠⚠ 115 of 171 growth rows triaged at HEAD were one of these, so NEVER read a legacy-leaf row as a defect without first asking which shape the receiver REALLY holds. ⛔⛔ M8 (the authored-input false positive) IS AMENDED AT THE TAIL — its four recorded tells carry ZERO authorship content and ITS OWN DISCOVERY CASE FAILS; only 6 of 31 re-audited rows retire and just 3 are M8. Read the AMENDED 2026-08-11 section before using M8, and note TWO NEW write-shape blindnesses that defeat the quoted-string scan."
metadata:
  type: project
  date: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T08:57:23.388Z
---

The heuristic (legacy-leaf) leg — `scripts/lib/legacy-reader-shape-scan.mjs` — emits a finding
when **exactly one** corpus shape resolves for a receiver and that shape's observed key list
lacks the key (`:549-560`, the `objects.length === 1` gate). Five mechanisms make that
attribution wrong. Each is instrument behaviour, not a code defect.

## M1 — ungrounded single-home prior (leaf-name collision)

`:337-338`. When the receiver `X` in `X.p` does NOT resolve and `p` has exactly one home in
the corpus, the read binds to that home **regardless of whether it is the same `p` the code
means**. The corpus had 1,053 single-home names at HEAD, so the surface is large.

Worked instance: `EventComposerDeityField.jsx:51` calls `deitySnapshotFrom(entry.raw)`;
`entry` is unresolved, so `.raw` binds to the corpus's only `raw` — `priorities.raw`
(`src/generators/priorityHelpers.js:442 raw: pri`), keys
`{criminal, economy, magic, military, religion}`. Every read of the AUTHORED DEITY record
inside `deitySnapshotFrom` is then judged against a priority-score map. Six spurious rows.

Other confirmed collisions at HEAD: `imports` (the critical-import REPORT built at
`resourceGenerator.js:249,251`, keys `{critical, reasons, recommended}` — NOT a trade-import
list), `civic`/`merchant` (cooldown records, keys `{last, since, v}`), `history`
(`settlement.history`), `prominentRelationship`, `config`, `economicState`.

## M2 — parameter / return union collapsing to one shape

`:474-502` (params) and `:433-469` (returns). A parameter's shape is the UNION of arguments at
up to 40 call sites; most fail to resolve. If exactly ONE resolves, that shape stands in for
EVERY call site, and every read in the body is judged against it.

Worked instance: `aiOverlayVerifier.js:402-414` `locateEntity` returns the settlement on one
arm and a computed array element (unresolvable) on the others, so the union collapses to
`settlement` — and `ent.faction`, a real key on conflict/faction records
(`generators/power/stressFactions.js:21`), reds.

⚠ The worst case is a **deliberately polymorphic predicate**: `generationOwnership.js:71`
`isAuthoredGenerationEntity(entity)` accepts institutions, services, resources, stress entries
and roles, but collapsed to `institutions`, so five sibling-family keys looked unwritten.

## M3 — spread-only object-literal resolution

`:368-373`. An object literal resolves to its SPREAD expressions only; the literal's own
properties are invisible. So a key the literal itself writes still reds.

Worked instance: `heraldFeed.js:191/199` literally write `headline` and `stressor` into the
very object being read, and both minted rows.

## M4 — element-access `asElem` IDENTITY on a non-array shape

`:88` `asElem = (t) => (t.endsWith('[]') ? t.slice(0,-2) : t)` combined with `:341-347`, where
a non-string-literal element access maps every resolved token through `asElem`. If the token is
not an ARRAY token, `asElem` is the **identity**, so the CONTAINER shape is handed back as its
own ELEMENT shape.

Worked instance: `generateEconomy.js:84` `economicState[listKey]` — `economicState` is not an
array shape (verified against the corpus dump), so an entry of `primaryExports` is judged
against the economicState record itself. Three rows from one expression.

## M5 — a corpus shape with ZERO observed keys

Every read on it is a finding by construction. At HEAD the `locks` shape had **208 rows and 0
keys**, because the corpus harness itself hard-codes it:
`scripts/lib/observed-shape-corpus.mjs:613` — `campaignState: { phase: 'canon', eventLog: [], locks: {} }`.
The corpus never toggles a lock, so all six `on locks` rows were structurally guaranteed.

## M6 — sibling-slice poverty (the walker binds the POOREST member of a shape family)

The corpus splits one logical record family across several path-qualified shapes of very
different richness, and the resolver may bind the thinnest one. Measured at HEAD for the
outcome family:

| shape | rows | keys | kind | tick | settlementId | recordMode | powerTransfer |
|---|---|---|---|---|---|---|---|
| `outcome` | 756 | 48 | – | – | – | – | – |
| `autoApplied` | 877 | 111 | Y | Y | Y | Y | – |
| `selected` | 503 | 121 | Y | Y | Y | – | – |
| `candidates` | 3675 | 101 | – | Y | – | Y | – |
| `consequenceOutcomes` | 4780 | 27 | – | – | – | Y | Y |
| `mechanicalOutcomes` | 1512 | 27 | – | – | – | Y | Y |
| `selectedOutcomes` | 3047 | 26 | – | – | – | – | Y |

So a read of an outcome-family record bound to the `outcome` slice reds on five keys the
family demonstrably carries. The real runtime family at `pulseKernel.js:2718` is
`applied.autoApplied`, not the `outcome` slice. This accounted for 6 rows in one file alone.

⚠ The tell: the flagged key IS observed — just on a SIBLING shape. Check `keyHomes` before
believing the shape; if the key's homes are all members of the same family as the bound
shape, it is M6, not a defect.

## How to apply

Before treating any legacy-leaf row as a defect, answer **"what shape does this receiver
really hold?"** — walk the call sites, not the shape name. Concretely:

1. Is the attributed shape in `singleHome`? Then suspect M1 and find the corpus producer of
   that name (it is often a completely unrelated record that happens to share a leaf name).
2. Is the receiver a function parameter or a call return? Then suspect M2 — enumerate the call
   sites and check how many actually resolve.
3. Does the read sit on an object literal, or on `X[expr]`? Suspect M3 / M4.
4. Does the shape have suspiciously few keys for its row count? Check for M5.
5. Only when the receiver genuinely IS that shape does the reader-with-no-writer question
   apply — and then hunt the writer across `src/`, `api/`, `schema/` AND `supabase/`, watching
   for the recorded sub-classes: singular/plural (`evidenceId` vs `evidenceIds`), spelling
   drift (`flavor`/`flavour`), snake/camel (`access_state`/`accessState`), and a sibling
   module writing a different name for the same thing (`authored` vs `_authored` vs
   `source:'authored'`).

Related: [[osr-171-growth-rows-triaged]] · [[osr-schema3-freeze-refused-measured]] ·
[[observed-shape-readers-walker-landed]] · [[typecheck-red-root-cause-and-reader-without-writer-class]].

## ⚠⚠ M8 — THE AUTHORED-INPUT FALSE POSITIVE (measured 2026-08-11)

**A corpus-driven scan CANNOT SEE A FIELD THE USER WRITES.** The class-(a) definition
("a guarded read of a key no writer produces") silently assumes the GENERATOR is the
only writer — so any field supplied by the AUTHOR or the IMPORTER reads as a
true-positive defect when it is nothing of the kind.

MEASURED on `dots` / `notability` (`disposition.js:91-93`), which the domain triage
banked as class (a): both are declared `SimNpc` fields; `npcVerdictApply`'s
`RELINQUISHED_FIELDS` strips them with PER-FIELD RATIONALE (proof the estate knows
they exist and are author-owned); `npcLadderState.js:202,204` SORTS rungs by `dots`;
and `disposition.js:82-83` states in terms that it MIRRORS `npcAgency.js:250-252`.
⛔ **BOTH repair directions are therefore wrong:** reader-side deletion DIVERGES A
DECLARED MIRROR, and writer-side is simultaneously a product question and a same-seed
shift (`computeAggressiveness` → `computeDispositionFactorMap` → `pulseKernel`).

**Why: the instrument's corpus is generated worlds, so "no writer in the corpus" and
"no writer" are different claims — and the gap between them is exactly the
user-authored surface, which is the part of the product the owner cares most about.**

**How to apply:** before banking any class-(a) row, ask **"could a HUMAN write this
field?"** Class (a) needs an **AUTHORED-INPUT EXEMPTION** so these stop consuming repair
lanes. Related: [[ui-cohort-triaged-31-true-positives]], [[osr-171-growth-rows-triaged]].

### ⚠⚠ AMENDED 2026-08-11 BY THE FULL RE-AUDIT — READ THIS BEFORE USING M8

The re-audit above was executed (Opus read-only lane, HEAD `868aca1a`, all 31 still-open
banked class-(a) rows, nothing edited). Ledger: scratchpad `m8audit-ledger.json` +
`m8audit-rows.json` + `m8audit-tell-measurements.md`. Three corrections:

1. **⛔ THE FOUR TELLS RECORDED ABOVE ARE ABOUT EXISTENCE AND USE, NOT AUTHORSHIP — DO NOT
   BANK ON THEM.** `RELINQUISHED_FIELDS` also contains `power` (35 `k:` writes in
   `src/generators/`), `importance` (9), `influence` (2), `structuralRank` (1),
   `factionAffiliation` (1). Membership proves a person can HOLD the field, never who wrote
   it. The `SimNpc` typedef likewise declares `dots`/`notability` beside generator-written
   `factionId`/`power`, and its own preamble calls itself a permissive bucket that never
   drops `& Record<string, any>`. A sibling sorting on a key, and a mirror comment, carry
   zero authorship content.
2. **⛔ THE DISCOVERY CASE ITSELF FAILS.** `dots`/`notability` have **NO human write path**:
   `git log --all -S"notability:" -- src/` returns **ZERO commits in all history**; the
   quoted scan returns exactly one hit each (the `RELINQUISHED` strip, `hasOwnProperty`-
   guarded so it can only ZERO an existing key, never create one); `EDITABLE_FIELDS.npc` is
   prose-only; `createNpc` is an explicit key list with no spread; there is no custom-content
   NPC category. Correct bucket is **NEEDS A PRODUCT DECISION** (an unbuilt authored-prominence
   capability), not an authored-input false positive.
3. **M8 IS RARE: 6 of 31 rows retire, and only 3 of those are M8** — `stresses` (CONFIRMED),
   `latentPantheon` (CONFIRMED), `identity` (PLAUSIBLE only). The other 3 retire because a
   **writer demonstrably exists** and the class-(a) probe could not see it. 18 rows are still
   genuine defects and 7 need a product decision.

**⚠⚠ TWO NEW WRITE-SHAPE BLINDNESSES — both defeat the quoted-string scan, the discipline's
current best manual check:**
- **shorthand property inside a conditional spread.** `historyGenerator.js:888` writes
  `...(ancientRuin ? { ancientRuin } : {})`. Neither `ancientRuin:` nor `'ancientRuin'` exists.
- **bare token inside a concatenated/space-joined string literal.** `configSlice.js:82` carries
  `latentPantheon` inside `('… latentPantheon …').split(' ')`. **Quoted scan returns ZERO.**
`fieldManifest.js:84-86` already has the concept (`writeProbe` for shorthand writes) — generalize it.

**⚠⚠ THE GENERIC-IMPORT-TOLERANCE TRAP.** `normalizeSettlement.js:178` is
`const out = { ...settlement }` ("unknown fields pass through untouched") and
`accountImport.js:295` is `{ ...normalized, … }`, so a hand-edited export can carry ANY
settlement-root key. That tolerance is **generic, not per-field** — treating it as M8 evidence
would retire every settlement-root row, which is vacuous. M8 evidence must come from a CLOSED
list that NAMES the key. By contrast the SAVE ENVELOPE is closed on both doors
(`saves.js:274-313`, `accountImport.js:314-327`), so save-shaped rows are structurally immune.

**⚠⚠ THE DEBT SET IS NOT A CENSUS.** `scripts/.observed-shape-readers-baseline.json` banks
`dots on npcs: 3` + `notability on npcs: 3` for `disposition.js` and **neither for
`npcAgency.js`**, which carries the BYTE-IDENTICAL ladder on the same `SimNpc` parameter — while
npcAgency IS scanned and DOES carry `label on npcs: 1`. Any reader-side repair driven off the
row list would touch one half and CREATE the divergence `disposition.js:82-83` exists to prevent.
Absence from the inventory proves nothing.

**THE MECHANICAL TELL (five gates, measured 12/31 rows decided, 12/12 correct, 83% recall and
100% precision on the retirements):** gate 0 the widened write-shape probe (adds shorthand-in-
conditional-spread + token-in-string-literal); gate 1 `git log --all -S"<key>:" -- src/` = 0 →
**M8 impossible, close it**; gate 2 closed-ingest shape → M8-via-import impossible; gate 3 key ∈
(`isAllowedConfigKey` ∪ `FIELD_ALIASES` values ∪ `EDITABLE_FIELDS` paths ∪ importer admission
lists) **shape-qualified, excluding `*_not_imported` EXCLUSION rows**; gate 4 open-spread shapes
are UNDECIDABLE and need a DECLARATION — the estate's own `authored-import spellings` idiom
(`historyBeats.js:72`, `simulationSpine.js:602`) exists in prose in exactly two places and
NOTHING ENFORCES IT.

## ⭐⭐ CHAIR RATIFICATION (2026-08-11): the M8 amendment above STANDS — I banked it wrong

The audit lane's correction of my own M8 entry is **RATIFIED, no veto.** I named a
mechanism from ONE case and generalized four "tells" that carry **zero authorship
content** — `RELINQUISHED_FIELDS` also contains `power` (35 generator writes),
`importance` (9), `influence` (2); the `SimNpc` typedef's own preamble calls itself a
permissive bucket. **Membership and declaration prove a field EXISTS; they say nothing
about WHO WROTE IT.** And M8's founding case does not survive: `dots`/`notability` have
NO human write path (`git log --all -S"notability:" -- src/` = **zero commits in all
history**; the sole quoted hit is a `hasOwnProperty`-guarded strip that can only ZERO an
existing key, never create one). Their true bucket is a PRODUCT DECISION on an unbuilt
authored-prominence capability.

**MEASURED OUTCOME: 6 of 31 rows retire, and only 3 as M8** (`stresses`,
`latentPantheon` CONFIRMED; `identity` PLAUSIBLE). Three more retire because a writer
DEMONSTRABLY EXISTS and the probe could not see it — which is the more useful half of
the finding.

⚠⚠ **Why: I generalized a mechanism from a single case without asking what its tells
would ADMIT. A tell that fires on generator-written fields is not a tell, it is a
coincidence with a story attached.** The discipline that caught it — take the founding
case and try to REFUTE it before trusting the class — is the one to keep.

⚠ Corrected on the same evidence: **importers do NOT carry `locks`** —
`accountImport.js:323` and `galleryImportSettlement.js:75` both RESET `campaignState`
(this supersedes a prior lane's claim). And every quoted `'capital'` in the estate is
the SIZE-TIER token meaning Metropolis — ⛔ it must never be reused as the capital flag.

## ⚠⚠ M9 — THE SAVE-TIME WRITER (measured 2026-08-11; M8's cousin, and it BLOCKS the gate)

`--write` REFUSED the display-repair shrink because it is not a shrink but a **SWAP**:
`neighbors on settlement` (2 reads) went out and `neighbourNetwork on settlement` (2 reads)
came in. The instrument is RIGHT to refuse — *"the inventory is addressed by finding
IDENTITY, not by count, so a swap cannot hide"* — and shrink-only maintenance cannot bank
growth.

⚠⚠ **But the "new" identity is a FALSE POSITIVE of M8's family.** `neighbourNetwork` has a
real writer at **`src/lib/saves.js:158`**, and **25 FILES ALREADY BANK THAT IDENTITY** in
the frozen inventory. **The corpus walks GENERATION ONLY, so a key minted at SAVE TIME is
invisible to it** — exactly as M8's authored-input keys are. Same root cause, different
writer: M8 = the USER writes it; **M9 = the SAVE PATH writes it.**

**CONSEQUENCE: the full gate stays RED until the consolidated schema-5 mint**, because
growth needs a MIGRATION and maintenance cannot express it. That mint now carries **FIVE**
items — M6's family-union filter, the two write-shape blindnesses, the M8 router, and
**this row plus a SAVE-TIME-WRITER EXEMPTION**. ⭐ Each was individually not worth a mint;
together they plainly are, which is what CR-OSR-FREEZE-6-R2's deferral was betting on.

**How to apply:** before treating any class-(a) row as a defect, ask **"who writes this,
and does the corpus RUN that writer?"** Generation-corpus absence proves only that the
GENERATOR does not write it. ⚠ A repair that swaps one read for a better one is GROWTH to
this instrument even when the file's total is unchanged — plan for the migration, not the
maintenance write.
