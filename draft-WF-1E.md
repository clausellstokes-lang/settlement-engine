# WF / WF-1E — the FaithSection cause-chain line (the WF-1d deferral, RAISED-3)

- **Status:** DRAFT
- **Compile note:** compiled by lane TC-WF1E under ODQ §332.4 (spawned drafts-only; ⛔ NOTHING
  lands before the program's §290 review stop), consuming the pre-executed substrate
  `laneTCWF1D-WF-1E-seed.md` and WF-1D's RAISED-3. ⚠ The status value above stands ALONE on its
  line (`parsePacketHeader` anchors the status row at end-of-line — J-TEWF1B-1).
- **Compile base:** `claude/composite-r4` @ `f5332cf70520a1cdef6cc326ae000acec118da85`
  (MF-T2C's landing, the branch tip at compile). ⛔ Every figure below is a measurement AT THAT
  PIN and a **STOP: RE-DERIVE AT THE EXECUTOR'S OWN BASE**. Inherit nothing, the seed's figures
  included — three landings moved the tree between the seed's `2cdb87fa` and this pin, and the
  census moved every time.
- **Preamble:** `docs/implementation/preambles/WF-PREAMBLE.md`, cited **BY SHA-256
  `f4cd39fee756c3a192710ab9aa3fc208e18ef1f08ea9e9073bcdc8bfb55d871c`** (780 lines — the WF-1D
  re-stamp carrying the FOUR-file zero-headroom table at §P1 R-WF-7). Computed live at the pin,
  recomputed by the executor at its base. Every law there binds here and is not restated.
- **Substrate annex:** `docs/implementation/preverification/WF-SUBSTRATE.md` + the compile seed
  `laneTCWF1D-WF-1E-seed.md` (TC-WF1D's executed measurements, re-verified at this pin).
- **Design authority:** `docs/DESIGN_FP_FAITH.md` §5-WF-1 (the crown pin — the FaithSection half
  ONLY; the Chronicle half is DEAD, measured at WF-1D §4) · `docs/DESIGN_FP_ARCH_WF.md` at the
  **LEDGER blob `169c75e7`** (the copy of record; the build copy `f2e5c935` is pre-cure) ·
  `docs/DESIGN_FP_SPINE.md` reqs 13/14.
- **Train:** `wf-1e`, family **WF** — TWO path-disjoint members: **WF-1E** (this packet) and
  **WF-1F** (the §326.4 micro-batch, seeded at `laneTCWF1E-WF-1F-seed.md`). ⛔ The split is
  PACKET_STANDARD's own rule firing, priced at §7 — the one-member shape breaches two hard caps.
- **Member cap:** WF is STAMPED (ODQ §78.1) ⇒ engine trains cap at EIGHT. This train uses two.
- **Census authority:** ODQ **§326.4** and **§332.4** (the compile spawn). ⚠ The dispatch §-ref
  is stamped by the chair at promotion, per §299.4's binding-forward rule.
- ⛔⛔ **PROMOTION GATE — VOLUME Q4 IS OPEN AT THE CHAIR AND THIS MEMBER CANNOT PROMOTE UNTIL IT
  IS RULED.** §4 is the determination and the recommendation. WF-1F carries no such gate.
- **Constitutional law binding every line below:** the DEITY DOCTRINE — faith is CULTURAL, never
  theological; no premade deity pool; typed buckets per FINITE-SEMANTICS; AI is clerk, never
  writer. The line this member renders says what the BELIEVERS and their rulers did — never what
  a god did. See §5.

---

## §0 · WHAT THIS MEMBER IS, AND WHAT IT REFUSES

WF-1D §7 deferred exactly one deliverable here: **the FaithSection cause-chain line** —
`DESIGN_FP_FAITH.md` §5-WF-1's crown pin, the FaithSection half: *open the town → FaithSection
ACTIVE state → the cause-chain line renders the typed fall from `patronFalls[0]`*, behind the
landed `faithUnseatingEnabled`.

It refuses, affirmatively:

- **The Chronicle obituary half** — dead, both producers re-filed (WF-1D §4, RAISED-1; the
  settlement obituary is WF-8's by ODQ §309).
- **The §326.4 micro-batch** — RAISED-B's `deityNameForRef` cure and the two falsified landed
  sentences. ⛔ Folding them in breaches TWO PACKET_STANDARD caps (§7); they are the sibling
  member **WF-1F**, seeded with every figure pre-executed, sharing **zero** paths with this one.
- **Any second consumer of the ring.** `fallCauseFor` keeps its ONE chartered caller
  (`warTermination.js`, WF-1D). This member reads the ring in the projector by property access
  and calls nothing in `patronFall.js`.

---

## §1 · THE BEHAVIOUR THIS MEMBER ADDS

Today the ring remembers a settlement's patron falls (WF-1a) and the war receipt can say why a
holy war dissolved (WF-1D) — but the town's own faith panel still cannot say that the seat ever
changed hands, or why. Lit, a settlement whose ring records a fall renders ONE sentence in the
panel's existing cause-chain block, built from the typed cause of `patronFalls[0]` (the ring is
NEWEST FIRST — `recordPatronFall` prepends, `patronFall.js:145`). Dark — and lit with no fall
recorded — the panel model, the panel markup and the serialized settlement config are unchanged
at the byte level.

---

## §2 · THE CURE

### 2.1 The data path (measured at the pin; the seed's path re-verified file by file)

| step | measured at `f5332cf7` |
|---|---|
| what the panel reads | `faithPanelModel.js:144` reads ONLY `settlement.config` (+ `powerStructure` via `divineMandateStatus`) — its header states the invariant; it cannot reach `worldState.religionStates` |
| how live faith data arrives | `config.faithProfile`, sole writer `projectReligionStateOntoSettlement` (`religionState.js`, symbol-anchored; opens near `:607` at this pin) |
| does the writer have the ring? | YES — its `state` local IS `religionStates[saveId]`, which carries `patronFalls` |
| does it have the flag? | NO — signature `(settlement, religionStates, saveId, pietyByCid = null, martialByCid = null)` |
| its only production caller | `pulseKernel.js:1773`, one line, inside `if (nextReligionStates) {` |
| the flag's source in kernel scope | `const simulationRules = normalizeSimulationRules(…)` at `pulseKernel.js:307`, inside `simulateCampaignWorldPulse` (opens `:241`); no top-level `}` intervenes before `:1773` (seed-executed; re-verify) |
| the conditional-key precedent | `unaffiliated` / `piety` / `martial` — all three `...(x ? { x } : {})` in the same `faithProfile` literal |
| where the sentence renders | `FaithSection.jsx` — the existing `<Cause>` block; guard at `:195`, sink render `:198`, model destructure `:75` |

### 2.2 The five edits

| # | site | edit | Δ eff |
|---|---|---|---:|
| E1 | `religionState.js`, the projector's signature line | append a SIXTH defaulted parameter `simulationRules = null`, JSDoc-typed `{Record<string, unknown>\|null}` (⛔ no `any` token — the file's any-cast allowance is ZERO, absent from the baseline) | 0 |
| E2 | `religionState.js`, inside the `faithProfile` object literal | ONE conditional spread on the landed idiom: `...(simulationRules?.faithUnseatingEnabled === true && Array.isArray(state.patronFalls) && state.patronFalls.length ? { patronFall: state.patronFalls[0] } : {}),` | +1 |
| E3 | `pulseKernel.js:1773` | pack `simulationRules` onto the EXISTING single-line call as the sixth argument. ⛔⛔ ZERO-HEADROOM FILE, 1581 frozen exact both directions — add no line, delete no line, move no line, add no PRNG draw | 0 |
| E4 | `faithPanelModel.js` | a frozen four-key `FALL_SENTENCE` map (keys exactly `PATRON_FALL_CAUSES`, §5 copy) + derive `patronFallSentence` from `profile.patronFall.cause` (null when absent/unknown) + the return object gains `patronFallSentence` on its EXISTING closing line | ~+9 |
| E5 | `FaithSection.jsx` | destructure gains the name on the EXISTING `:75` line; the `:195` guard widens IN PLACE to also open on `patronFallSentence`; ONE `<Cause>` line renders it FIRST inside the block (a fall outranks drift lines). ⛔ Add NO line above `:189` — twelve `.prose-numerics-baseline.json` rows pin lines 49/53/174/176/179/188 and the bill is ZERO only below them. RE-ADDRESS such rows if ever forced; never delete | +1 |

Predicted production delta: **≤14 effective lines** of 400. Measured file sizes at the pin, both
to be re-read at base on eslint's own `Linter`: `religionState.js` **368**, `faithPanelModel.js`
**117**, `FaithSection.jsx` **225**, `pulseKernel.js` **1581 frozen**. No member file carries a
`scripts/.size-baseline.json` row except the kernel; the 800 layer ceiling binds the rest.

### 2.3 What the projected record is — and what the panel refuses to print

`patronFall` is the newest ring record VERBATIM — `{ ref, cause, atTick }`, typed buckets, no
minting, no free text. The model renders the CAUSE ONLY. ⛔ **The raw `ref` is a slug and is
deliberately NOT rendered**: un-slugifying refs is the display-resolver estate
(`deityNames.js`), whose remaining lossy duplicate is exactly WF-1F's RAISED-B cure — this
member neither re-mints that defect nor reaches across the split to consume the cure. The line
names the act; the panel's own patron header names the current seat-holder.

### 2.4 Why the fence reads the FLAG, not the ring (the seed's item 5, adopted as law here)

The ring is HISTORY and history is immutable under THE PROMISE — a world lit once and then
darkened keeps its ring forever. Gating the key on `state.patronFalls` alone would therefore
render the line in a dark world. The `=== true` flag conjunct in E2 is what makes the fence
honest, and it is why E3's kernel touch is OWED rather than optional. A lit-then-darkened world
re-projects `faithProfile` on the next tick WITHOUT the key — the projection is re-derived
every tick, so the fence self-heals on the first dark tick.

### 2.5 The DS-FTH-1 corpus amendment (⛔ Q4-gated; §4)

DS-FTH-1's generated title binds the model's return signature VERBATIM — executed at
`src/data/dossierStateProse/warFaith.generated.js:2113`:
`faithPanelModel(settlement) → {patron, cults, ranks, piety, unaffiliated, mandate,
sinkSentence, live}`. `patronFallSentence` AMENDS that row. Per §P2.7 (Lane P's standing law):
edit the corpus source `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (the DS-FTH-1 heading at
`:4189`, plus one ENTAILMENT sentence naming the four new authored strings as copy the block
SURROUNDS, per R-DST-C) and run **`npm run gen:dossier-prose` in the SAME commit**. ⭐ DS-FTH-3
already binds `patronFalls[]` and agrees (WF-1a discharged it) — no second amendment is owed.

### 2.6 The lifecycle clause (§78 F-4)

1. **ZERO new persisted record families.** `faithProfile` is an existing config record,
   re-derived on every projection tick. The new sub-key is a byte in the save WHEN LIT — which
   is exactly what A2 pins at the byte level in both directions.
2. **ZERO new top-level worldState keys** ⇒ `CONDITIONAL_LEDGER_KEYS` does not move (asserted,
   A5). The ring itself was WF-1a's bill, already paid.
3. **IMPORT.** `scrubImportedConfig` (`src/lib/importScrub.js`, the destructuring drop near
   `:36`) drops `faithProfile` OUTRIGHT — asserted in A5, not assumed. No import-validation arm
   is owed; the volume's cause-token import clause binds WF-1a's ring, not this projection.
4. **REGEN / UNDO.** Both restore or re-derive `config` wholesale; the projection re-runs and
   the key follows the flag and the ring. The static/embeds path carries no `faithProfile` and
   therefore no key — the day-one panel is untouched (`live: false` arm unchanged).
5. **THE VEIL.** The panel model is the player-safe read-model; it renders a typed cause word
   and no deity ref. `latentPantheon` is never read (the file's own header law, unchanged).

---

## §3 · SCOPE AND BOUNDARY

**It does not** (affirmatively): touch `warTermination.js`, `peaceTerms.js`,
`applyWorldPulse.js`, `realmEvents.js`, `pantheon.js`, `patronFall.js`, `religiousContest.js`,
`subsystemRowsVirtual.js`, `simulationRules.js`, `worldState.js`, `importScrub.js`,
`chroniclersLetter.js`, `heraldRouting.js` or any `tests/lint/couplingInclusion*` /
`tests/domain/pantheon*` path (ALL of those are WF-1F's or nobody's); mint a flag, a news kind,
an `impactKind`, a desk row, a receipt pool, a coupling row (no new import crosses any layer —
E2 is property access inside the writer's own module), a `LAYER_PATTERNS` row, a persisted
top-level key, a normalizer, a migration arm, a tuning constant, or a test FILE; call
`fallCauseFor`; add or move a PRNG draw; touch `package.json` / `package-lock.json`; light any
flag anywhere; or move a same-seed golden (dark is byte-identical by construction — A2).

---

## §4 · THE Q4 DETERMINATION — AND THE PROMOTION GATE

**What Q4 is, traced to source:** the WF volume's open question 4, *"the DS-FTH binding"* — is
the pre-authored DS-FTH dossier corpus a READER-SIDE SPELLING LAW that binds every WF wave's
state signature (amendable only via Lane P's edit-source-and-regenerate-in-one-commit
mechanism), or is its authority still undecided? §P2.7 records the MECHANISM as the engineering
fact while saying in terms *"this disposition is the engineering fact, not the ruling"*; ODQ
§78.3 left Q1 and Q4 *"OPEN for the WF family sitting"*; and the family sitting (§308) plus
every later section through §332 rules on neither — verified by enumeration over the ledger ODQ
at `51fb347850c0` (the one read this compile takes off the pinned build tree, sanctioned by the
dispatch for exactly this determination). ⛔ **Q4 is OPEN at the chair. It is chair-scope under
the standing delegation — not owner-parked by nature (it is none of legal/cull/tuning/push) —
but §P9 binds: no WF wave may read a validated premise as a ruling.**

**Consequence, stated rather than hidden:** WF-1B and WF-1D lawfully sidestepped Q4 by rendering
nothing. This member CANNOT — §2.5's amendment is constitutive of the deliverable. So the
FaithSection scope is drafted here as ordered (§332.4), and the packet carries a hard gate:
⛔ **DO NOT PROMOTE past DRAFT until the chair rules Q4.**

**Recommendation (vetoable):** rule Q4 by RATIFYING the engineering disposition — the DS-FTH
corpus is reader-side spelling law; amendments go source-first with the generator run in the
same commit and a section-sliced agreement pin (A4) so drift reds an instrument rather than a
reader. Grounds: DS-FTH-3 already bound `patronFalls[]` verbatim and the tree conformed
(measured, WF-1a); the alternative — corpus as non-binding prose — makes the §P2.7 STOP
unenforceable and leaves the dossier free to drift from the model it describes. A4 is written
against the doc-agreement vacuity class: it slices the DS-FTH-1 SECTION on both sides and
compares the ordered signature key list, never a whole-document `includes`.

---

## §5 · DEITY-DOCTRINE AND SPINE COMPLIANCE

- **The four sentences, quoted VERBATIM as compiled — OWNER-REVIEWABLE copy** (the WF-1C
  RAISED-C protocol; the owner reviews bytes, and the walk may re-word any of them):
  - `discredited` → **“The patron fell — discredited: the creed lost its rightful claim, and the town let another take the seat.”**
  - `displaced` → **“The patron fell — displaced: the town’s devotion drifted to another creed until the seat changed hands.”**
  - `imposed` → **“The patron fell — imposed: the seat changed hands by decree of those who rule, not by the drift of belief.”**
  - `suppressed` → **“The patron fell — suppressed: the creed was driven from its seat by force, its rites pushed out of the light.”**
  Every clause names a believer-side or political act; none says a god fell, failed, died or
  departed; no deity axis is read; no deity name is printed (§2.3).
- **Typed buckets (FINITE-SEMANTICS).** `patronFall` is the landed ring record verbatim;
  `FALL_SENTENCE` is a frozen four-key table whose key set A1 asserts EQUALS
  `PATRON_FALL_CAUSES`; an unknown cause renders NOTHING (total, never throws — the panel is a
  render surface and the Herald-desk law applies).
- **AI is clerk, never writer.** No AI surface reads or writes any of this; no edge-shared
  bundle names any member path (§6).
- **Spine req 13 — alignment-EMPTY, WITH REASON:** the line is a lookup of a landed typed token;
  no arm reads a deity's authored axes.
- **Spine req 14 — RECORDED, engine-only:** the DM's existing `SET_PRIMARY_DEITY` /
  `IMPOSE_CULT` verbs create falls through WF-1a's classifier and therefore now change what the
  panel says; the verb story is the existing verb with a longer reach.

---

## §6 · PRICED OBLIGATIONS

| obligation | verdict |
|---|---|
| **flag mint (§49/§50/§148)** | NOT INCURRED — rides the LANDED `faithUnseatingEnabled`. The by-name `=== true` read census over `src` moves by ONE (E2), strict and never through a frozen-list `.every()` |
| **§104.4 edge-shared closures** | NOT INCURRED — measured at the pin: no member path appears in any of the five committed bundle metas' `inputs`. Re-derive at base |
| **test census (lighting contract)** | **INCURRED, TITLES ONLY: predicted `2490/364/2126/20663/5778` → `…/20669/5778` (+6), no new file, no new describe.** ⛔ The tuple at the pin was read from the walker's OWN live constant (its `:5001` figures line), not inherited from any packet — WF-1D's C-1 is the recorded failure shape. The executor re-derives by PLACEHOLDER-OF-ZEROES at its tip, figure by figure from the walker's own convictions. Authorizing decisions §326.4/§332.4 + the dispatch ref at promotion |
| **§102.2/§P3b mutation coverage** | NOT INCURRED — no file lands under `tests/lint/` |
| **§85.4 seeded chooser** | NOT INCURRED — total functions of already-computed values; zero new PRNG streams, dark AND lit |
| **size baseline / zero-headroom** | ⛔ INCURRED at E3: `pulseKernel.js` 1581 frozen exact, packed onto the existing line, measured on BOTH instruments on BOTH sides. `peaceTerms.js`/`warTermination.js`/`applyWorldPulse.js` untouched (re-measured for the record) |
| **prose-numerics baseline** | INCURRED AS A CONSTRAINT, PRICED TO ZERO: twelve hand-keyed FaithSection rows (413 total at the pin); every edit lands below line 188, so no row moves. The executor re-greps the baseline for member files at base |
| **negativeAssertionAnchor** | INCURRED, CEILING unchanged: every new negative carries the marker on the assertion's OWN line or the SINGLE line directly above (a wrapped marker does not count — WF-1D paid twice); the §31 preflight runs bare at base BEFORE the member proof |
| **domain any-cast ledger** | ⛔ INCURRED AS A CONSTRAINT: `religionState.js` allowance is ZERO (absent from the baseline). E1's param is `Record<string, unknown>` — no `any` token, no bare `*`; the strict read needs no cast. `faithPanelModel.js`/`FaithSection.jsx` are components, outside the ledger's `src/domain` scope. ⚠ This is the second ledger only the full gate reads — the executor runs it focusedly anyway |
| **wizard-news authoring walker** | NOT INCURRED — no news entry, no `impactKind` |
| **declared shift** | NOT INCURRED HERE — dark is byte-identical (A2, at the byte level); no preset declares the flag (re-derive at base). ⚠ The declared shift lives in WF-1F (RAISED-B), not here |
| **chair value signature (§42/§43, F-5)** | NOT INCURRED — this member authors no number, no threshold, no curve |
| **DS-FTH corpus (§P2.7)** | ⛔ INCURRED — §2.5, Q4-gated (§4). Generated artefact: `src/data/dossierStateProse/warFaith.generated.js` via `npm run gen:dossier-prose`, SAME commit |
| **naked-claim ledger (docs)** | INCURRED PER CLAIM — the executor runs the live claim regex over this packet's bytes and the amended corpus doc BEFORE committing; this compile avoided the matched spellings throughout |
| **§77 premise map** | INCURRED — §10 |

---

## §7 · THE SPLIT, PRICED — WHY THE §326.4 MICRO-BATCH IS WF-1F

PACKET_STANDARD binds: *"If the work cannot fit, the agent stops and proposes the smallest
split. The agent may not quietly renegotiate the budget."* Priced at this pin, the one-member
shape (this deliverable + the three §326.4 micro-items) measures:

| cap | one-member shape | limit |
|---|---:|---:|
| existing logic-bearing production files (religionState, pulseKernel, faithPanelModel, **realmEvents, subsystemRowsVirtual**) | **5** | 3 |
| handwritten files total (the six production + corpus doc + four test files + walker + packet) | **13** | 12 |

— two hard caps breached (WF-1D's precedent counted its comment-only `patronFall.js` edit
against the logic cap, so the accounting is the landed one, not a choice made here). The
smallest split is also the natural one: **zero shared paths, zero shared instruments, zero
shared proofs.** WF-1E = this packet (3 logic files AT CAP, 9 handwritten of 12, exactly the
seed's priced shape). WF-1F = the micro-batch (2 production files, 5 handwritten, census-still,
carrying the declared shift). Seeded at `laneTCWF1E-WF-1F-seed.md` with every figure executed
at this pin. ⚠ **RAISED-A (§13): §326.4's letter batched the micro-items ONTO WF-1E; honoring
it verbatim requires a two-cap override the chair must sign. The split honors its substance —
each item rides a manifested lane with a focused proof — within the standard. Say "veto" to
take the override instead; the packet then folds WF-1F's rows back in.**

---

## §8 · EXACT CHANGE MANIFEST

⚠ Collision check at the pin: `PACKET_MANIFEST.json` holds **135** rows — **134 LANDED + 1
SUPERSEDED, ZERO non-terminal** — so no live packet reserves any path below. ⛔ Re-run at the
executor's base (a sibling DRAFT — TC-T2D compiles in parallel — may open first; §P7.14).

### Handwritten (9 files)

| # | action | path | Δ eff | instruction |
|---|---|---|---:|---|
| M1 | MODIFY | `src/domain/worldPulse/religionState.js` | +1 | E1 + E2. The JSDoc for the sixth param is comment-only; ⚠ a docblock is POSITIONAL — no helper lands above an existing export |
| M2 | MODIFY | `src/domain/worldPulse/pulseKernel.js` | **0 — NET ZERO, MANDATORY** | E3, on the one existing line at `:1773`. Both instruments, both sides, quoted in the receipt; no PRNG motion, fork order untouched |
| M3 | MODIFY | `src/components/settlement/faithPanelModel.js` | ~+9 | E4. `FALL_SENTENCE` frozen, module-local, keys in the vocabulary's codepoint order. The MODEL key `patronFallSentence` is ALWAYS present and `null` when silent (the model is pure in-memory, never serialized — J-TCWF1E-2); only the PERSISTED `faithProfile.patronFall` key is conditional |
| M4 | MODIFY | `src/components/settlement/FaithSection.jsx` | +1 | E5. Nothing above `:189`; the fall `<Cause>` renders FIRST in the block |
| M5 | MODIFY | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` | — | §2.5, ⛔ Q4-gated. Heading signature + one ENTAILMENT sentence; smallest amendment that makes the signature true |
| M6 | TEST | `tests/components/faithPanelModel.test.js` | — | A1–A5 as five straight-line `it()` calls inside the EXISTING `describe('faithPanelModel')` — no new describe, no `.each`, string-literal titles |
| M7 | TEST | `tests/components/faithSection.test.jsx` | — | A6 as one `it()` inside the EXISTING live-panel describe |
| M8 | TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` | — | the WHOLE five-figure tuple re-derived by execution (placeholder-of-zeroes), + this member's re-record block appended in landing order — ⛔ the merge-destroys-cures shape lives on this file; keep every prior block |
| M9 | DOC | `docs/implementation/packets/fp/WF-1E.md` | — | this packet (⚠ the member NAME follows the chair's own §326.4/§332.4 usage; RAISED-3's formal naming is ratified at review — §13) + the `PACKET_MANIFEST.json` row + the `INDEX.md` row (surgical inserts; prose cell carries no status words) |

### Generated

`src/data/dossierStateProse/warFaith.generated.js` — generator `npm run gen:dossier-prose`,
SAME commit as M5. Nothing else.

### Budget reconciliation

| limit | this packet |
|---|---|
| behavior families | 1 |
| new persisted record families | 0 |
| feature flags | 0 new, 0 new conjunctions (one new read of a landed key) |
| user-facing surfaces | **1** of 1 (`FaithSection.jsx`) |
| direct production consumers | **2** of 2 (`faithPanelModel.js`, `FaithSection.jsx`) |
| existing logic-bearing production files modified | **3** of 3 AT CAP (M1, M2, M3) |
| registration-only production files | 0 |
| handwritten files total | **9** of 12 |
| new/changed effective production lines | **≤14** of 400 |
| acceptance cases | **6** of 8 |

**Overrides needed: NONE** — by the §7 split. The one-member alternative needs one (§13 RAISED-A).

---

## §9 · ACCEPTANCE (closed denominator — 6 cases)

⛔⛔ **THE FIXTURE IS RUN AND ITS OUTPUT PRINTED BEFORE ANY PIN IS WRITTEN** — once against a
PRISTINE `git archive` tree at the executor's base, once wired, same harness. ⚠⚠ The dark-fence
fixture MUST EMIT IN ITS POSITIVE ARM: a deity-BEARING world whose ring records a REAL fall
(seeded through the doctrine-path verbs / `recordPatronFall`, then asserted present BEFORE use).
WF-1C's first fixture was quiet and proved nothing; WF-1D reproduced the same hazard shape
(lit-with-empty-ring ≡ dark). Print the projected `faithProfile` of every arm.

| id | case |
|---|---|
| A1 | **MAIN BEHAVIOUR + VOCABULARY TOTALITY.** Lit, ring bearing a `discredited` fall: the model carries `patronFallSentence` = the exact `discredited` string of §5, AND `Object.keys(FALL_SENTENCE)` EQUALS `PATRON_FALL_CAUSES` (so a fifth cause or a renamed key reds here rather than rendering nothing). ⛔ The LITERAL `faithUnseatingEnabled: true` drive spelling is load-bearing for lit-coverage credit |
| A2 | **ABSENT vs FALSE vs LIT AT THE BYTE LEVEL, ON THE SERIALIZED CONFIG.** The projector run with `{}`, `{faithUnseatingEnabled:false}`, and the literal lit rules on the SAME fall-bearing state: absent ≡ false byte-identically; only lit materializes `config.faithProfile.patronFall`. Non-vacuity control FIRST: every arm's profile carries the patron and ranks (the world really projected) |
| A3 | **NO RING ⇒ NO KEY ⇒ NO SENTENCE.** Lit, deity-bearing, ring ABSENT: `faithProfile` carries no `patronFall` key at all (absent, never `null` — a key is a byte), and the model's `patronFallSentence` is null. **anchored** (positive control in the same test: the same drive WITH a ring carries the key) |
| A4 | **THE DS-FTH-1 ROUND TRIP, SECTION-SLICED.** Slice the DS-FTH-1 block from BOTH the corpus source and the generated artefact; the ordered signature key list inside each equals the live model's own key list (executed against a built model object). ⛔ Never a whole-document `includes` — the doc-agreement vacuity class fires on prose that names the key elsewhere |
| A5 | **LIFECYCLE.** `scrubImportedConfig` DROPS `faithProfile` (asserted on a config carrying the new key); `CONDITIONAL_LEDGER_KEYS` unchanged; zero new top-level worldState keys; a lit-then-darkened re-projection carries NO key (the §2.4 self-heal, executed). **anchored** |
| A6 | **THE RENDERED SURFACE ACTUALLY RENDERED.** ACTIVE panel, lit model: the fall sentence is in the DOM inside the cause-chain block AND the sibling `<Cause>` sentences are present in the same render (the rendered-surface-negative second vacuity — the positive controls prove the panel mounted); dark model: the fall sentence absent. **anchored** |

---

## §10 · §77 PREMISE-MAP ROWS (each EXECUTED at `f5332cf7`; each a STOP: RE-DERIVE AT BASE)

| id | premise | grade at the pin | how it dies |
|---|---|---|---|
| P-1 | `pulseKernel.js` is 1581 effective against a frozen 1581; `:1773` is the projector's ONE production call | EXECUTED | any motion ⇒ re-measure both instruments; never inherit |
| P-2 | the projector's signature is five-parameter, `simulationRules`-free | EXECUTED | a sixth param lands first ⇒ E1 becomes an amendment |
| P-3 | `faithPanelModel` returns exactly the DS-FTH-1 eight (+`hasEmbed`/`effects`/`contested`/`patronSecurity` outside the bound list) | EXECUTED at `warFaith.generated.js:2113` | the row or the model moves ⇒ re-slice A4 before writing |
| P-4 | the twelve FaithSection prose-numerics rows end at line 188; the baseline holds 413 rows; no other member file is keyed | EXECUTED | a landing adds/moves one ⇒ re-address, never delete |
| P-5 | no member path is in any edge-bundle meta's `inputs` | EXECUTED over the five committed metas | inputs grow ⇒ §104.4 INCURRED (`npm run build:edge-shared`) |
| P-6 | the lighting tuple reads `2490/364/2126/20663/5778` from the walker's live constant | EXECUTED | ⛔ re-read at the implementing tip; placeholder-of-zeroes; arithmetic is not evidence |
| P-7 | `PACKET_MANIFEST.json`: 135 rows, zero non-terminal | EXECUTED | a sibling DRAFT opens ⇒ re-run the collision check (§P7.14) |
| P-8 | `religionState.js` 368 / `faithPanelModel.js` 117 / `FaithSection.jsx` 225 effective; none carries a size-baseline row | EXECUTED (eslint `Linter`) | any landing moves one ⇒ re-measure |
| P-9 | `religionState.js` any-cast allowance is ZERO (absent from the baseline) | EXECUTED | a hole lands first ⇒ cure by typing, never by widening |
| P-10 | Q4 is unruled through ODQ §332 (ledger tip `51fb3478`) | EXECUTED by enumeration | a ruling lands ⇒ §4's gate lifts (or re-shapes) — re-read the ODQ tail at dispatch |
| P-11 | `faithUnseatingEnabled` is declared by NO preset; no committed golden reaches the lit projection | EXECUTED (WF-1C/WF-1D measurements re-checked at pin) | a preset lights it ⇒ declared-shift machinery, STOP |
| P-12 | the two component test files are census-credited straight-line files (no `.each`, no `runIf`) | EXECUTED (grep) | a parking idiom lands ⇒ the +6 prediction is void; attribute file-by-file |

---

## §11 · PREFLIGHT — THE EXECUTOR'S OWN, AT ITS OWN BASE

0. ⛔ **THE STEP-8 STOP.** Re-derive EVERY §10 row and §2's figures at `git rev-parse HEAD`
   before the first edit. Where the live tree disagrees with this compile, correct the compile
   and record the correction (WF-1D §13 is the form).
1. ⛔ **THE Q4 GATE (§4).** Confirm the chair's ruling is recorded in the ODQ before promoting
   past DRAFT. Absent a ruling: STOP, report, hold at DRAFT.
2. §31 anchor preflight, bare, in-shell, at the pristine base and again wired.
3. `BASE_STATE.json` admissibility re-read; every figure re-executed regardless.
4. Status DRAFT → READY → LANDED with `validate:packets` green at each transition; the §8
   collision check re-run at each.
5. ⛔ Goldens for A2 by `git archive <base>` fixtures — never a checkout, never the live tree.
6. ⛔⛔ Fixture-first (§9 headnote): run and PRINT before pinning; the positive arm EMITS.
7. The census re-record LAST among test edits, by placeholder-of-zeroes, in the walker file, with
   this member's block appended after every existing re-record block.

---

## §12 · CHECKS

```
npx vitest run tests/components/faithPanelModel.test.js tests/components/faithSection.test.jsx \
  tests/domain/religionState.test.js tests/domain/patronFall.test.js \
  tests/domain/religionDormancy.byteIdentity.test.js tests/lib/importScrub.test.js \
  tests/data/dossierStateProseProjection.contract.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/sizeBaseline.test.js \
  tests/lint/domainAnyCastBaseline.test.js tests/lint/proseNumerics.test.js \
  tests/property/worldpulseDeityGolden.test.js
npx eslint src/domain/worldPulse/religionState.js src/domain/worldPulse/pulseKernel.js \
  src/components/settlement/faithPanelModel.js src/components/settlement/FaithSection.jsx
npm run typecheck:ratchet ; npm run typecheck:domain:strict
npm run gen:dossier-prose   # then: git diff --stat on the generated artefact — the M5 commit pairing
```

⚠ `tests/lint/proseNumerics.test.js` is the baseline JSON's reader, verified at the pin. Gate
law: `check:tail`
BARE from a fresh shell, exit captured in-shell, outlasted in-turn; never wrapped in
`gate-mutex.sh --run` (its exit 3 is the mutex giving up); pre-existing reds proven at a
pristine-base worktree and compared against the frozen ratchet baseline's banked rows (the L3
corollary — a bare-vitest red on a banked title is not this member's), never repaired in
passing.

---

## §13 · JUDGMENT CALLS AND RAISED MATTERS

- **J-TCWF1E-1 — the split (§7) over the two-cap override.** Chose PACKET_STANDARD's own rule
  over the §326.4 letter because the standard forbids quiet renegotiation and the split is
  zero-cost: no shared path, no shared proof, both members small. **RAISED-A: the chair either
  ratifies the split or signs the override; either is one line at review.** *Say "veto" to fold
  WF-1F back in.*
- **J-TCWF1E-2 — the model key is ALWAYS-PRESENT-`null`-when-silent; the PERSISTED key is
  CONDITIONAL-ABSENT.** The model is a pure in-memory read-model (its other keys — `piety`,
  `sinkSentence` — already use null-when-silent), while `faithProfile.patronFall` is serialized
  state where a key is a byte. The two idioms match their layers' landed precedents. *Veto:
  make the model key conditional too; A3 then pins absence at both layers.*
- **J-TCWF1E-3 — cause-only rendering; no name resolution in the panel (§2.3).** Resolving a
  slug ref to a display name in the panel either re-mints the lossy fallback WF-1F cures or
  imports the display resolver into a component that deliberately reads only its own settlement
  — and the crown pin's own sentence names the cause, not the creed. *Veto: render
  `deityDisplayNameFromRef(ref)` after WF-1F lands; that is a one-line follow-up, not a
  re-shape.*
- **J-TCWF1E-4 — the sentence renders FIRST in the cause block.** A seat falling outranks
  devotion-drift lines; the sink sentence stays last. Pure ordering inside one block; no row
  moves. *Veto: render after the piety sentences.*
- **RAISED-B (chair, at review): the member NAME.** RAISED-3 called naming a chair act; the
  chair's own §326.4/§332.4 prose says "WF-1E" and this packet follows it. Ratify or rename
  before dispatch — the path `docs/implementation/packets/fp/WF-1E.md` carries no suffix.
- **RAISED-C (chair, sequencing): two census-moving trains are in flight.** This train and
  TC-T2D's member both re-record the lighting tuple; the slot-aware rebase law (WF-1D §16.5)
  covers it, but the chair sequences the landings — and NOTHING lands before the §290 stop.

---

## §14 · MUTANTS (executed by the executor; predictions here, results in the packet at landing)

| mutant | plant | must red |
|---|---|---|
| (a) the unflagged projection | drop E2's `=== true` conjunct | **A2 alone** (the byte fence) |
| (b) the eager key | replace E2's spread with unconditional `patronFall: null` | **A3** (key-absence) — A2 may also convict; different assertions, verified per §P2.10 |
| (c) the unrendered surface | move E5's render outside the `<Cause>` block guard | **A6 alone** |
| (d) the widened vocabulary | delete one `FALL_SENTENCE` key | **A1 alone** (totality) |
| (e) the stale corpus | amend the model signature, skip the generator | **A4 alone** (the section-sliced agreement) |

Hygiene per §P6: planted by `cp`, `node --check`ed, convicted, restored digest-exact — never
the `git checkout` family. ⛔ §P2.10's entanglement STOP: if (a) and (b) convict the same arms
on the same assertions, one guard is vacuous — re-shape, never pass. ⚠ A DOCBLOCK IS
POSITIONAL (WF-1B's nine strict errors): E4's map and derivation carry their OWN docblocks
below the existing helpers, above `faithPanelModel`'s existing one.

---

## §15 · REQUIRED SYMBOLS (present at THIS status; symbols and anchors, never a line, never a figure)

| symbol | home |
|---|---|
| `projectReligionStateOntoSettlement` | `src/domain/worldPulse/religionState.js` |
| `divineMandateStatus` | `src/domain/worldPulse/religionState.js` |
| `faithPanelModel` | `src/components/settlement/faithPanelModel.js` |
| `legitimacyBand` | `src/components/settlement/faithPanelModel.js` |
| `recordPatronFall` | `src/domain/worldPulse/patronFall.js` |
| `PATRON_FALL_CAUSES` | `src/domain/worldPulse/patronFall.js` |
| `FALL_RING_CAP` | `src/domain/worldPulse/patronFall.js` |
| `scrubImportedConfig` | `src/lib/importScrub.js` |
| `CONDITIONAL_LEDGER_KEYS` | `src/domain/worldPulse/worldState.js` |
| `normalizeSimulationRules` | `src/domain/worldPulse/simulationRules.js` |
| `faithUnseatingEnabled` | `src/domain/worldPulse/simulationRules.js` (virtual key; by-name reads only) |
| `FALL_SENTENCE` *(CREATED by this member)* | `src/components/settlement/faithPanelModel.js` |

`retiredSymbols`: **none.**

### Flag and dormancy statement

⛔ **THIS MEMBER MINTS NO FLAG AND LIGHTS NONE.** It adds one strict by-name read of the landed
virtual `faithUnseatingEnabled`. Dormancy is total and layered: the flag read is false ⇒ the
persisted key never materializes ⇒ the model derives nothing ⇒ the guard renders nothing — and
the outer religion data-gate already short-circuits deity-free worlds before any of it. A2/A3/A6
pin the three layers separately. ⛔ Lighting the flag is owner-gated, always.
