# WF / WF-1E — the FaithSection cause-chain line (stage 5 of the `wf-1` split promotion)

- **Status:** LANDED
- **Compile note:** compiled by lane TC-WF1E under ODQ §332.4; chair-reviewed with five rulings
  at ODQ **§333**; BUILT AND VERIFIED by lane TE-WF1E under ODQ **§337**. ⚠ The status value
  above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line — trailing prose
  there leaves the status unparsed and makes the manifest disagree with the Markdown
  (J-TEWF1B-1, paid once already).
- **Verified base:** `claude/composite-r4` at `f5332cf70520a1cdef6cc326ae000acec118da85`
- **Preamble:** `docs/implementation/preambles/WF-PREAMBLE.md`, cited **BY SHA-256
  `f4cd39fee756c3a192710ab9aa3fc208e18ef1f08ea9e9073bcdc8bfb55d871c`** (780 lines). Recomputed
  at this verified base and byte-identical to the compile's citation. Every refutation,
  disposition, register, STOP and census law in that file binds here and is not restated.
- **Substrate annex:** `docs/implementation/preverification/WF-SUBSTRATE.md`. ⛔ **No absolute is
  inherited.** All twelve §10 premise rows and every figure in §2 were RE-DERIVED at this base
  before the first edit; the three corrections are recorded at §12.
- **Design authority:** `docs/DESIGN_FP_FAITH.md` §5-WF-1 (the crown pin — the FaithSection half
  only; the Chronicle half is dead, measured at WF-1D §4) · `docs/DESIGN_FP_ARCH_WF.md` at the
  **LEDGER blob `169c75e7`** (the copy of record; the build copy `f2e5c935` is pre-cure) ·
  `docs/DESIGN_FP_SPINE.md` reqs 13/14.
- **Train:** `wf-1`, family **WF**, member **e**. WF-1A..WF-1D are all LANDED on the branch.
  The sibling **WF-1F** carries the §326.4 micro-batch and shares **zero** paths with this
  member (ODQ §333.1 ratifies the split).
- **Member cap:** WF is **STAMPED** (ODQ §78.1) ⇒ engine trains cap at EIGHT. This member uses
  three of the headroom's logic-file budget and none of the member headroom.
- **Census authority:** ODQ **§333** (the compile collection and its five rulings, §333.5
  sequencing the census across the post-stop trains) and ODQ **§337** (this landing's
  dispatch), under §299.4's binding-forward rule.
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
- **The §326.4 micro-batch** — `deityNameForRef`, `subsystemRowsVirtual.js` and the coupling
  walker row. They are the sibling member **WF-1F** (ODQ §333.1). This member touches none of
  those three paths.
- **Any second consumer of the ring.** `fallCauseFor` keeps its ONE chartered caller
  (`warTermination.js`, WF-1D). This member reads the ring in the projector by property access
  and calls nothing in `patronFall.js` production-side.

---

## §1 · THE BEHAVIOUR THIS MEMBER ADDS

Today the ring remembers a settlement's patron falls (WF-1a) and the war receipt can say why a
holy war dissolved (WF-1D) — but the town's own faith panel still cannot say that the seat ever
changed hands, or why. Lit, a settlement whose ring records a fall renders ONE sentence in the
panel's existing cause-chain block, built from the typed cause of `patronFalls[0]` (the ring is
NEWEST FIRST — `recordPatronFall` prepends). Dark — and lit with no fall recorded — the panel
model, the panel markup and the serialized settlement config are unchanged at the byte level.

---

## §2 · THE CURE, AND ITS EXECUTED MEASUREMENTS

### 2.1 The five edits, with measured effect

| # | site | edit | eff before → after |
|---|---|---|---|
| E1 | `religionState.js`, the projector's signature | a SIXTH defaulted parameter `simulationRules = null`, JSDoc-typed `{Record<string, unknown>\|null}` — no `any` token | — |
| E2 | `religionState.js`, the `faithProfile` literal | ONE conditional spread on the landed idiom, appended last so no existing key's order moves | **368 → 369** |
| E3 | `pulseKernel.js` | the sixth argument packed onto the EXISTING single-line call | **1581 → 1581 NET ZERO** |
| E4 | `faithPanelModel.js` | the frozen four-key `FALL_SENTENCE` map + `patronFallSentence` derived and returned on the existing closing line | **117 → 124** |
| E5 | `FaithSection.jsx` | the destructure and the cause-block guard widen IN PLACE; ONE `<Cause>` renders the fall FIRST | **225 → 226** |

**New/changed effective production lines: 9 of 400.** Measured on eslint's own `Linter` under
`max-lines {skipBlankLines, skipComments}` — the instrument mirrored from
`tests/lint/sizeBaseline.test.js` — both before and after, never `wc -l` alone.

### 2.2 The zero-headroom discharge (§P1 R-WF-7, §P7 stop 8)

All four members of the class re-measured at this base on BOTH instruments. Only the kernel is
touched, and it lands NET ZERO:

| file | eff before | eff after | `wc -l` before | `wc -l` after |
|---|---:|---:|---:|---:|
| `pulseKernel.js` (frozen 1581) | 1581 | **1581** | 2865 | **2865** |
| `peaceTerms.js` (800 layer, three under) | 797 | 797 untouched | 1264 | 1264 |
| `warTermination.js` (frozen 818) | 818 | 818 untouched | 1045 | 1045 |
| `applyWorldPulse.js` (frozen 941) | 941 | 941 untouched | 1329 | 1329 |

The kernel diff is `1 insertion(+), 1 deletion(-)` — one line changed in place, none added,
none moved. ⭐ **AND THE STREAM IDENTITY IS STATED AFFIRMATIVELY**, because for this file the
number is not the only constraint: **no PRNG draw was added, moved or removed and the fork
order is untouched** — `rng.fork` sites measured 22 before and 22 after, matching the R-BLD-10
recorded figure, and the sixth argument is a value already computed at `:307` rather than a new
draw.

### 2.3 What the projected record is — and what the panel refuses to print

`patronFall` is the newest ring record VERBATIM — `{ ref, cause, atTick }`, typed buckets, no
minting, no free text. The model renders the CAUSE ONLY. ⛔ **The raw `ref` is a slug and is
deliberately NOT rendered**: un-slugifying refs is the display-resolver estate, whose remaining
lossy duplicate is WF-1F's business — this member neither re-mints that defect nor reaches
across the split to consume the cure. A6 asserts the slug never reaches the rendered DOM.

### 2.4 Why the fence reads the FLAG, not the ring

The ring is HISTORY and history is immutable under THE PROMISE — a world lit once and then
darkened keeps its ring forever. Gating the key on `state.patronFalls` alone would therefore
render the line in a dark world. The `=== true` flag conjunct is what makes the fence honest,
and it is why E3's kernel touch is OWED rather than optional. A lit-then-darkened world
re-projects `faithProfile` on the next tick WITHOUT the key — the projection is re-derived every
tick, so the fence SELF-HEALS on the first dark tick. **A5 executes exactly that, on the same
state object**, and mutant (a) reds it.

### 2.5 The DS-FTH-1 corpus amendment (Q4, RULED)

Volume **Q4 is RULED at ODQ §333.2**: the DS-FTH corpus binds as READER-SIDE SPELLING LAW via
the Lane P mechanism, with a section-sliced agreement pin. Under that ruling the corpus source
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` gains `patronFallSentence` in the DS-FTH-1 heading
signature plus one ENTAILMENT sentence naming the four new authored strings as copy the block
SURROUNDS (R-DST-C), and `npm run gen:dossier-prose` ran in the SAME commit. The generated
artefact moved by exactly one line — the DS-FTH-1 title — with all 411 block variants unchanged.
⭐ DS-FTH-3 already binds `patronFalls[]` and agrees (WF-1a discharged it); no second amendment
is owed.

### 2.6 The lifecycle clause (§78 F-4, re-derived against the EXISTING machinery)

1. **ZERO new persisted record families.** `faithProfile` is an existing config record,
   re-derived on every projection tick. The new sub-key is a byte in the save WHEN LIT — which
   is what A2 pins at the byte level in both directions.
2. **ZERO new top-level worldState keys** ⇒ `CONDITIONAL_LEDGER_KEYS` does not move, asserted in
   A5 rather than assumed. The array order IS the serialized key order and it is untouched. The
   ring itself was WF-1a's bill, already paid.
3. **IMPORT.** `scrubImportedConfig` drops `faithProfile` OUTRIGHT — asserted in A5 with a
   positive control proving the scrub returned a populated config.
4. **REGEN / UNDO.** Both restore or re-derive `config` wholesale; the projection re-runs and the
   key follows the flag and the ring. The static/embeds path carries no `faithProfile` and
   therefore no key — the day-one panel is untouched (`live: false` arm unchanged, pinned by the
   existing day-one case).
5. **THE VEIL.** The panel model is the player-safe read-model; it renders a typed cause word and
   no deity ref. `latentPantheon` is never read (the file's own header law, unchanged).

---

## §3 · SCOPE AND BOUNDARY

**It does not** (affirmatively): touch `warTermination.js`, `peaceTerms.js`, `applyWorldPulse.js`,
`realmEvents.js`, `pantheon.js`, `patronFall.js`, `religiousContest.js`, `subsystemRowsVirtual.js`,
`simulationRules.js`, `worldState.js`, `importScrub.js`, `chroniclersLetter.js`, `heraldRouting.js`
or any `tests/lint/couplingInclusion*` / `tests/domain/pantheon*` path (all of those are WF-1F's
or nobody's); mint a flag, a news kind, an `impactKind`, a desk row, a receipt pool, a coupling
row, a `LAYER_PATTERNS` row, a persisted top-level key, a normalizer, a migration arm, a tuning
constant, or a test FILE; call `fallCauseFor`; add or move a PRNG draw; touch `package.json` /
`package-lock.json`; light any flag anywhere; or move a same-seed golden.

---

## §4 · PRICED OBLIGATIONS

| obligation | verdict |
|---|---|
| **flag mint (§49/§50/§148)** | NOT INCURRED — rides the LANDED `faithUnseatingEnabled`. Re-measured at this base: the key is absent from `DEFAULT_SIMULATION_RULES`, absent from `normalizeSimulationRules({})`, present in `ENGINE_GATED_VIRTUAL_RULE_KEYS` — VIRTUAL, exactly as §P2.4 requires. The by-name `=== true` read census over `src` moves by ONE (E2), strict and never through a frozen-list `.every()` |
| **§104.4 edge-shared closures** | NOT INCURRED — re-derived at this base: five committed bundle metas, **zero** hits for any member path in their `inputs` |
| **test census (lighting contract)** | **INCURRED, TITLES ONLY: `2490/364/2126/20663/5778` → `2490/364/2126/20669/5778` (+6 titles).** No new file, no new describe. Re-derived at this base by PLACEHOLDER-OF-ZEROES, figure by figure from the walker's own convictions. Authorizing decisions ODQ §333 / §337 |
| **§102.2/§P3b mutation coverage** | NOT INCURRED — no file lands under `tests/lint/`; the walker edit is a re-record inside an existing enumerated file |
| **§85.4 seeded chooser** | NOT INCURRED — total functions of already-computed values; zero new PRNG streams, dark AND lit |
| **size baseline / zero-headroom** | ⛔ INCURRED at E3 and DISCHARGED BY MEASUREMENT — §2.2, both instruments, both sides |
| **prose-numerics baseline** | INCURRED AS A CONSTRAINT, PRICED TO ZERO. Re-derived: 413 rows total, twelve keyed to `FaithSection.jsx` at lines 49/53/174/176/179/188 and none to any other member file. Every edit lands at or below the existing line it changes, and the ONE added line lands at 197 — below all twelve — so no row moves. The instrument is green |
| **negativeAssertionAnchor** | INCURRED, CEILING unchanged — every new negative carries `// anchored:` on the single line directly above it. The §31 preflight ran bare at the pristine base BEFORE the member proof and again wired |
| **domain any-cast ledger** | ⛔ INCURRED AS A CONSTRAINT and HELD. `religionState.js` allowance re-measured as ZERO (absent from `tests/lint/.domain-any-baseline.json`). E1's parameter is `Record<string, unknown>` — no `any` token, no bare `*`; the strict read needs no cast. The ratchet was run focusedly and is green |
| **wizard-news authoring walker** | NOT INCURRED — no news entry, no `impactKind` |
| **declared shift** | NOT INCURRED — dark is byte-identical, executed in A2; no preset declares the flag (re-derived at this base). The same-seed deity golden is green and unmoved |
| **chair value signature (§42/§43, F-5)** | NOT INCURRED — this member authors no number, no threshold, no curve |
| **DS-FTH corpus (§P2.7)** | ⛔ INCURRED and DISCHARGED — §2.5, under the §333.2 ruling, generator run in the same commit |
| **naked-claim ledger (docs)** | INCURRED PER CLAIM — the live `CLAIM_RE` was run over this packet's bytes and the amended corpus doc before committing |
| **§77 premise map** | INCURRED — §10 |

---

## §5 · DEITY-DOCTRINE AND SPINE COMPLIANCE

- **The four sentences, shipped EXACTLY as compiled — OWNER-REVIEWABLE copy** (ODQ §333.4 marks
  them owner-reviewable and joins them to the §316.2C copy walk; this lane changed no word):
  - `discredited` → **“The patron fell — discredited: the creed lost its rightful claim, and the town let another take the seat.”**
  - `displaced` → **“The patron fell — displaced: the town’s devotion drifted to another creed until the seat changed hands.”**
  - `imposed` → **“The patron fell — imposed: the seat changed hands by decree of those who rule, not by the drift of belief.”**
  - `suppressed` → **“The patron fell — suppressed: the creed was driven from its seat by force, its rites pushed out of the light.”**
  Every clause names a believer-side or political act; none says a god fell, failed, died or
  departed; no deity axis is read; no deity name is printed. **A1 asserts this rather than
  trusting it**, scanning every rendered sentence for divine-act phrasing and for a deity ref.
- **Typed buckets (FINITE-SEMANTICS).** `patronFall` is the landed ring record verbatim;
  `FALL_SENTENCE` is a frozen four-key table whose key set A1 asserts EQUALS
  `PATRON_FALL_CAUSES`; an unknown cause renders NOTHING — total, never throws (the Herald-desk
  law).
- **AI is clerk, never writer.** No AI surface reads or writes any of this; no edge-shared bundle
  names any member path (§4).
- **Spine req 13 — alignment-EMPTY, WITH REASON:** the line is a lookup of a landed typed token;
  no arm reads a deity's authored axes.
- **Spine req 14 — RECORDED, engine-only:** the DM's existing `SET_PRIMARY_DEITY` / `IMPOSE_CULT`
  verbs create falls through WF-1a's classifier and therefore now change what the panel says;
  the verb story is the existing verb with a longer reach.

---

## §6 · EXACT CHANGE MANIFEST

Collision check re-run at this base: `PACKET_MANIFEST.json` holds **135** rows — **134 LANDED +
1 SUPERSEDED, ZERO non-terminal** — so no live packet reserved any path below at promotion.

| # | action | path | instruction |
|---|---|---|---|
| M1 | MODIFY | `src/domain/worldPulse/religionState.js` | E1 + E2 |
| M2 | MODIFY | `src/domain/worldPulse/pulseKernel.js` | E3 — **NET ZERO, proved on both instruments, both sides** |
| M3 | MODIFY | `src/components/settlement/faithPanelModel.js` | E4 |
| M4 | MODIFY | `src/components/settlement/FaithSection.jsx` | E5 |
| M5 | DOC | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` | §2.5, with the generator run in the same commit |
| M6 | TEST | `tests/components/faithPanelModel.test.js` | A1–A5, five straight-line `it()` calls in the EXISTING describe |
| M7 | TEST | `tests/components/faithSection.test.jsx` | A6, one `it()` in the EXISTING live-panel describe |
| M8 | TEST | `tests/lint/sovereigntyLightingContract.walker.test.js` | the five-figure tuple re-derived by conviction + this member's re-record block appended after every existing block |
| M9 | DOC | `docs/implementation/packets/fp/WF-1E.md` | this packet |

**Generated:** `src/data/dossierStateProse/warFaith.generated.js` via `npm run gen:dossier-prose`,
SAME commit as M5. Nothing else.

### Budget reconciliation

| limit | this packet |
|---|---|
| behavior families | 1 |
| new persisted record families | 0 |
| feature flags | 0 new, 0 new conjunctions (one new read of a landed key) |
| user-facing surfaces | **1** of 1 |
| direct production consumers | **2** of 2 |
| existing logic-bearing production files modified | **3** of 3 AT CAP |
| registration-only production files | 0 |
| handwritten files total | **9** of 12 |
| new/changed effective production lines | **9** of 400 |
| acceptance cases | **6** of 8 |

**Overrides needed: NONE.**

---

## §7 · ACCEPTANCE (closed denominator — 6 cases, all executed)

⛔⛔ **EVERY FIXTURE WAS RUN AND ITS OUTPUT PRINTED BEFORE ANY PIN WAS WRITTEN** — once against a
PRISTINE `git archive` tree at this base, once wired, same harness (lane receipt
`laneTEWF1E-receipt.md` §3; logs `laneTEWF1E-probe-pristine.log` / `-wired.log`). The positive
arm EMITS: a deity-BEARING world whose ring records a REAL fall, seeded through the ring's ONE
sanctioned writer and **asserted present before any arm consumes it**. WF-1C's first fixture was
quiet and proved nothing; that shape cannot recur here.

| id | case |
|---|---|
| A1 | **MAIN BEHAVIOUR + VOCABULARY TOTALITY.** Lit on the LITERAL `faithUnseatingEnabled: true` drive, a ring bearing a `discredited` fall: the model carries the exact compiled sentence, `Object.keys(FALL_SENTENCE)` EQUALS `PATRON_FALL_CAUSES` (both sorted), all four members render distinct non-empty copy, and every rendered sentence is scanned for divine-act phrasing and for a deity ref — the DEITY DOCTRINE asserted, not trusted |
| A2 | **ABSENT vs FALSE vs LIT AT THE BYTE LEVEL.** Non-vacuity control FIRST: every arm's profile carries the patron and both creeds. Then absent ≡ false byte-identically, the lit arm differs, and the lit `patronFall` equals the ring record exactly. **anchored** |
| A3 | **NO RING ⇒ NO KEY ⇒ NO SENTENCE.** Lit, deity-bearing, ring ABSENT: `faithProfile` carries no `patronFall` key at all (absent, never `null` — a key is a byte), its key list is pinned exactly, and the sentence is null. **Positive control in the same test**: the identical drive WITH a ring carries the key. **anchored** |
| A4 | **THE DS-FTH-1 ROUND TRIP, SECTION-SLICED.** The DS-FTH-1 block is sliced from BOTH the corpus source and the generated artefact — never a whole-document `includes`, the recorded vacuity class — and the ordered signature key lists must agree, must contain `patronFallSentence`, and must name nothing the live built model lacks. ⚠ The bound list is a deliberate SUBSET of the model's keys (§12 C-3), so the third arm is measured containment rather than set equality |
| A5 | **LIFECYCLE.** `scrubImportedConfig` DROPS `faithProfile` (with a surviving-sibling positive control); `CONDITIONAL_LEDGER_KEYS` unchanged; and the §2.4 self-heal executed on the SAME state object — lit carries the key, re-projected dark does not, and the ring is still intact. **anchored** |
| A6 | **THE RENDERED SURFACE ACTUALLY RENDERED.** ACTIVE panel, lit model whose ring record is built by its REAL writer rather than hand-mirrored: the fall sentence is in the DOM, it renders FIRST inside the cause-chain block (positions compared, not mere presence), the sibling `<Cause>` sentences are present in the SAME render, and no deity slug reaches the DOM. Dark model: the fall sentence absent while its siblings still render. **anchored** |

---

## §8 · MUTANTS — EXECUTED, WITH THEIR MEASURED CONVICTIONS

Planted by `cp`, `node --check`ed, convicted, restored and proved **digest-exact by `md5`** —
never the `git checkout` family. Post-restore verification: 20/20 green.

| mutant | plant | predicted | **MEASURED conviction** |
|---|---|---|---|
| (a) the unflagged projection | gate the key on the RING ALONE | A2 | **A2 + A5** — A2 on the byte differential, A5 on the self-heal |
| (b) the eager key | unconditional `patronFall: null` | A3 (A2 may also) | **A1 + A2 + A3 + A5** |
| (c) the unrendered surface | delete the fall `<Cause>` render | A6 alone | **A6 alone** ✓ |
| (d) the widened vocabulary | delete one `FALL_SENTENCE` key | A1 alone | **A1 + A6** |
| (e) the stale corpus | amend the corpus signature, skip the generator | A4 alone | **A4 alone** ✓ |

⭐ **THE §P2.10 ENTANGLEMENT STOP WAS CHECKED AND DOES NOT FIRE.** (a) and (b) do not convict the
same arms: (a) leaves **A1 and A3 GREEN** while (b) reds both. A3 is the discriminator — it
separates the FLAG fence from the KEY-CONDITIONALITY, so neither guard subsumes the other and
no re-shape is owed. The assertion messages are quoted in the lane receipt.

---

## §9 · §77 PREMISE-MAP ROWS — ALL TWELVE RE-DERIVED AT THIS BASE

| id | premise | verdict at `f5332cf7` |
|---|---|---|
| P-1 | kernel 1581 eff against a frozen 1581; `:1773` the ONE production call | REPRODUCES |
| P-2 | the projector's signature is five-parameter, `simulationRules`-free | REPRODUCES (address corrected, §12 C-1) |
| P-3 | `faithPanelModel` returns the DS-FTH-1 bound list plus four keys outside it | REPRODUCES, and the "plus four" is now measured exactly (§12 C-3) |
| P-4 | twelve FaithSection prose-numerics rows ending at 188; 413 rows total | REPRODUCES |
| P-5 | no member path in any edge-bundle meta's `inputs` | REPRODUCES over all five metas |
| P-6 | the lighting tuple reads `2490/364/2126/20663/5778` | REPRODUCES, from the walker's own live constant |
| P-7 | `PACKET_MANIFEST.json`: 135 rows, zero non-terminal | REPRODUCES |
| P-8 | religionState 368 / faithPanelModel 117 / FaithSection 225 eff; none baselined | REPRODUCES |
| P-9 | `religionState.js` any-cast allowance is ZERO | REPRODUCES |
| P-10 | Q4 unruled through §332 | ⚠ **CORRECTED — RULED at §333.2** (§12 C-2) |
| P-11 | `faithUnseatingEnabled` is virtual and declared by NO preset | REPRODUCES |
| P-12 | the two component test files are census-credited straight-line files | REPRODUCES |

---

## §10 · CHECKS — EXECUTED, EXITS CAPTURED IN-SHELL

```
npx vitest run tests/components/faithPanelModel.test.js tests/components/faithSection.test.jsx \
  tests/domain/religionState.test.js tests/domain/patronFall.test.js \
  tests/domain/religionDormancy.byteIdentity.test.js tests/lib/importScrub.test.js \
  tests/data/dossierStateProseProjection.contract.test.js tests/domain/divineMandate.test.js \
  tests/domain/pietyDynamics.test.js tests/domain/faithSpreadGate.test.js
npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js \
  tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/sizeBaseline.test.js \
  tests/lint/domainAnyCastBaseline.test.js tests/lint/proseNumerics.test.js \
  tests/lint/couplingInclusion.walker.test.js tests/property/worldpulseDeityGolden.test.js
npx eslint src/domain/worldPulse/religionState.js src/domain/worldPulse/pulseKernel.js \
  src/components/settlement/faithPanelModel.js src/components/settlement/FaithSection.jsx
npm run typecheck:ratchet ; npm run typecheck:domain:strict
npm run gen:dossier-prose
```

⚠ Gate law: `check:tail` BARE from a fresh shell, exit captured in-shell and outlasted in-turn;
never wrapped in `gate-mutex.sh --run` (its exit 3 is the mutex giving up, not a red).
Pre-existing reds are compared against the frozen ratchet baseline's banked rows before being
treated as this member's.

---

## §11 · JUDGMENT CALLS AND RAISED MATTERS

- **J-TEWF1E-1 — `FALL_SENTENCE` is EXPORTED rather than module-local.** The compile specified
  module-local, but A1's key-set equality against `PATRON_FALL_CAUSES` — the draft's own
  acceptance requirement and mutant (d)'s target — cannot be written over a module-local
  constant without re-declaring the map inside the fixture, which is the fixture-mirrors-deriver
  vacuity class §P2.9 forbids outright. Exporting is the only non-vacuous route. *Veto: drop the
  equality arm and pin totality only behaviourally, accepting that an over-wide map goes unseen.*
- **J-TEWF1E-2 — the model key is ALWAYS-PRESENT-`null`-when-silent; the PERSISTED key is
  CONDITIONAL-ABSENT.** Adopted from the compile. The model is a pure in-memory read-model whose
  siblings (`piety`, `sinkSentence`) already use null-when-silent, while `faithProfile.patronFall`
  is serialized state where a key is a byte. *Veto: make the model key conditional too; A3 then
  pins absence at both layers.*
- **J-TEWF1E-3 — the new key is appended LAST in the `faithProfile` literal.** Existing keys keep
  their order, so nothing an existing golden serializes can move. *Veto: place it beside
  `unaffiliated`.*
- **J-TEWF1E-4 — the fall sentence renders FIRST in the cause block.** A seat falling outranks
  devotion-drift lines; the sink sentence stays last. A6 pins the ordering by position.
  *Veto: render after the piety sentences.*
- **RAISED-1 (chair): the A4 wording correction.** The compile's A4 said the signature list
  "equals the live model's own key list". Measured, that is false in the strict reading — the
  bound list is nine keys and the model returns thirteen. A4 ships as the round trip plus
  measured containment (§12 C-3). Flagged because it narrows a stated acceptance claim.
- **RAISED-2 (chair, sequencing): two census-moving trains remain in flight.** This member and
  MF-T2D both re-record the lighting tuple. The tuple here was derived by conviction at this
  base; if the branch moves before the CAS, it is re-derived by conviction again and never
  carried (ODQ §333.5, §325.2).

---

## §12 · CORRECTIONS TO THE COMPILE, RECORDED RATHER THAN SILENTLY ABSORBED

The §11 step-8 STOP re-derived every compile figure at this base before the first edit. Three
rows needed correcting; the rest reproduced exactly.

- **C-1 — an address, harmless.** The compile's §2.1 places the projector "near `:607`". At this
  base — the identical commit — `projectReligionStateOntoSettlement` opens at **`:603`**. The
  compile's own symbol anchor resolves correctly, so the two-anchor law absorbs it. This is the
  §P0 line-rot law biting a parenthetical rather than a premise, and it is recorded because §P0's
  whole point is that a line-rot correction rots too.
- **C-2 — P-10, material and favourable.** The compile graded volume Q4 OPEN through §332 and
  carried a DO-NOT-PROMOTE-PAST-DRAFT gate on that basis. **ODQ §333.2 rules it**, which is why
  this packet promoted. Verified as recorded on the ledger branch rather than taken from the
  dispatch prose.
- **C-3 — A4's wording, narrowed to what is true.** The compile's A4 required the DS-FTH-1
  signature list to equal "the live model's own key list". **Measured, that is false**: the bound
  list is NINE keys and `faithPanelModel` returns THIRTEEN — `hasEmbed`, `effects`, `contested`
  and `patronSecurity` sit outside the bound list, exactly as the compile's own P-3 row says. A
  strict equality pin would therefore have been unwritable without widening the corpus far beyond
  the smallest amendment. A4 ships as the section-sliced round trip (corpus ≡ generated) plus
  measured CONTAINMENT against a real built model. The round trip is the arm that actually
  carries the Lane P law, and mutant (e) proves it convicts. **RAISED-1** puts the narrowing to
  the chair.
