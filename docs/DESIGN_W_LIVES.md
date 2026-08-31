# DESIGN_W_LIVES — The Lived-Experience & Paradigm-Character Volume

**Status:** ARCHITECTURE RULED (chair, Fable seat, 2026-08-30) — the axis catalog, level words,
experience table, and learn rates are OWNER-TASTE candidate registers before freeze. Charter:
ODQ §§800–800.5 (the owner's five-message design sitting, each recorded verbatim) on the
foundation of §797–§798 (W-FAITH) and §797.5 (drift = instantiations of the banded-stock /
disposition-ledger family, never a new lifecycle). Substrate surveyed at build tip `b85044099`.
**This volume SUPERSEDES DESIGN_W_FAITH.md §D2 and reshapes §D5/§D6** (banners in that file);
W-FAITH's field (D4), boon/bane (D3), authored stance dial (D1), and gates stand unchanged and
now CONSUME this substrate.

---

## 0. Constitutional constraints

1. **THE PROMISE** — absent state ⇒ byte-identical, everywhere below, structurally.
2. **Finite semantics** — every trait, level, lesson, and cause is a prewritten typed token;
   users assign, they never write; AI is a clerk. Free text never acquires mechanics.
3. **L5 / legibility** — floats cannot reach prose: positions band into words, receipts refuse
   non-integers (`bandCrossingReceipt`), and every visible change carries its true cause.
4. **Anti-ratchet** — the only non-outcome movement anywhere is decay toward the authored core
   (`decayTowardNeutral(value, core, age, band)` — the home point is a parameter; §797.5).
5. **The constitutional core is immutable** — nothing in the engine writes an authored position;
   only the author's pen (edit view) moves a core. Gods have no drift state at all (§800.3 J4).
6. **Setting-agnostic** — every word in every register below must survive any world.

## 1. The object: the paradigm chart (§800.2, §800.4)

**A paradigm axis** is a prewritten opposed pair — a virtue pole and its corresponding vice —
with per-axis metadata:

```
axis := { id, virtuePole: {word, expressionWords[]}, vicePole: {word, expressionWords[]},
          planeLean: {e, c}, aggressionLean, corruptionVector|null }
```

- **Signed leveled position.** An entity's stance on an axis is one signed position: sign picks
  the pole (positive = temperament, negative = flaw), magnitude is a **level band** — candidate
  words `a_touch / marked / defining` per side, neutral center ⇒ a 7-band nominal ladder per
  axis. One position per axis makes the owner's no-same-axis rule **arithmetic, not validation**.
- **Full paradigm, sparse bytes (§800.4).** Every NPC and god holds every axis *semantically*;
  a neutral position costs **zero bytes** — absent-reads-neutral is the encoding (the
  disposition-channel discipline). Legacy saves are byte-identical by construction.
- **The chart replaces three hand-tables.** `TRAIT_PLANE` (clergyTraitPlane.js), `TRAIT_ALIGNMENT`
  and `TRAIT_AGGRESSION` (npcTraitWeights.js) become **derived columns of the one axis catalog**
  (each axis carries its leans; a word's weight = its axis lean × its pole sign × level scale).
  Structural convergence: three parallel tables that could drift become one source. The derived
  tables must reproduce today's values for legacy words at default level — pinned by test.
- **Capabilities are not axes.** The pools mix moral axes with gifts (wise, clever, resourceful,
  scholarly, charismatic, intuitive, perceptive, astute, discerning in part): war does not make a
  person less clever — it makes them less merciful. Gifts stay **modifiers outside the chart**,
  as do the stance/manner neutrals (pragmatic, stoic, cynical, secretive, theatrical, …).

### 1.1 THE CANDIDATE AXIS REGISTER — DRAFT FOR THE OWNER'S PEN (nothing here is frozen)

Paired from the live pools (`NPC_PERSONALITY_TRAITS`, npcData.js:74; ⚠ the LOCKSTEP mirror
`npcBank NPC_TEMPERAMENTS` moves in the same edit — pinned by tests/domain/npc/npcBank.test.js):

| # | Axis | Virtue pole (expressions) | Vice pole (expressions) |
|---|---|---|---|
| 1 | CANDOR | honest (forthright, candid, plain-dealing) | deceitful (mendacious, manipulative) |
| 2 | MERCY | compassionate (merciful, warm-hearted) | cruel (callous, cold-blooded) |
| 3 | COURAGE | brave (stalwart) | cowardly |
| 4 | TEMPER | patient (level-headed, unflappable) | wrathful (volatile) |
| 5 | GENEROSITY | generous (magnanimous, hospitable) | greedy (self-serving) |
| 6 | HUMILITY | humble (gracious) | arrogant (vain, imperious) |
| 7 | FIDELITY | loyal (dependable, steadfast) | **treacherous — ORPHAN, needs mint** (fickle?) |
| 8 | INDUSTRY | diligent (conscientious, tenacious) | lazy |
| 9 | JUSTICE | principled (fair-minded, equitable, incorruptible) | corrupt (hypocritical, petty) |
| 10 | PRUDENCE | prudent (cautious†) | reckless |
| 11 | TRUST | **trusting — ORPHAN, needs mint** | paranoid (suspicious) |
| 12 | CHEER | optimistic (good-humoured) | bitter (melancholic†, brooding†) |
| 13 | FORBEARANCE | **forgiving — ORPHAN, needs mint** | vengeful (vindictive) |
| 14 | PROTECTION | protective (courteous) | domineering (overbearing, dismissive) |
| 15 | TEMPERANCE | temperate | **indulgent — ORPHAN, needs mint** (hedonistic†) |
| 16 | CONTENT | **contented — ORPHAN, needs mint** | envious |
| 17? | DEVOTION | pious (zealous†?) | **worldly — ORPHAN; OR piety stays the faith system's relationship, not a character axis — OWNER RULING WANTED** |

† = a reassignment candidate from the neutral pool. Unassigned negatives to place: stubborn,
ruthless (MERCY or its own RESOLVE axis?). Level words per side (candidate): `a_touch / marked /
defining`. Every row, word, lean, and the level ladder itself: **owner signs before freeze**.

## 2. State model (§800.2, §800.4, §800.5)

```
authored core   entity.character = { axes: { [axisId]: {pole:'virtue'|'vice', level:band} } }   // sparse
drift state     worldState.characterDrift[npcUid] = { [axisId]: {offset, updatedTick} }         // sparse
effective       effectivePosition(axis) = corePosition(axis) + offset, clamped to the spectrum
```

- **Home of drift:** `worldState` (pulse-owned, beside `npcStates` which already keys NPCs by the
  composite `npcId(settlementId, npc, index)`), NOT on the roster record — the roster is
  regen-exposed. ⚠ **RECON ROW (landing precondition, the owner's most-bitten class):** prove the
  npc uid is stable across settlement regeneration / undo / import, or design the uid remap; walk
  create/read/persist/regen/undo/migrate before any implementation car lands.
- **Legacy mapping:** each flat legacy word (dominant/flaw/modifier) reads as (axis, pole, default
  level `marked`) through a tolerant reader; undrifted it projects back to the **identical word**
  at every existing seam ⇒ byte-identity. The generator's current draw = the special case
  (salient positions from the drawn words, all else neutral) — distribution unchanged until lit.
- **Rounding at persistence** only (the bandedStock discipline); all folds codepoint-ordered;
  read-last-tick / write-next-tick.

## 3. The experience funnel (§800): three planes, one writer

Every lesson enters through ONE closed vocabulary (`LIVED_EXPERIENCE_KINDS`, the
DISPOSITION_SOURCE_KINDS pattern: silent fallback kind, both-ways partition test) into ONE writer.
**Source qualification law:** a source registers only if it already emits a receipted outcome —
drift never invents event streams.

| Plane | Teaches | Sources (all receipted TODAY unless flagged) |
|---|---|---|
| **PERSONAL** (hardest) | what happened TO you | mission grade at close (ES-5d) · caught lying (npcCredibility charge) · compromised / exposed / leash events (corruption arc) · custody: intercepted, held, ransomed, pardoned (envoy arc LIVE; ⚠ spy capture waits on ES-2b's writer by charter) · promotion won / rung lost / rivalry bids (ladder) · goal culmination |
| **AFFILIATION** (moderate) | what happened to what you belong to | faction capture-ladder transitions + power growth/decline (factionStates) · faction feuds (factionPairLedger) · own settlement's band crossings (disposition channels) · your god's fortunes (pantheon ledger) · coups, occupation of home |
| **WITNESS** (gentle) | what you lived among and heard | **milieu**: dwell in any settlement (whereabouts mirror × host's conduct plane, alignment, active conditions, disposition bands — ⭐ envoys and spies ride the SAME one-travel-substrate term, §800.3 J1) · **news × belief**: believed-path fidelity (distancePricedNews) × teller credibility (court + npc stocks) × own TRUST-axis position |

- **Closest-plane-wins:** one event teaches one NPC on its closest plane only — the structural
  cure for double-counting (one mission failure never teaches personally AND via the faction).
- **Lesson families** with per-family learn rates (the SP-C partition pattern; war teaches
  hardest, gossip least); per-axis pull vectors per kind — the **experience table** is the
  largest owner-taste register in the arc.
- **Ambient vs commitment (§800.4 rev. of J5):** milieu/faith pull touches ALL axes at small
  rates toward the field's poles; commitment events (taking orders, conversion, consecration)
  are large targeted pushes. The acquisition concept is dissolved — everything is latent.
- **Receipts:** minted ONLY on band crossings, **reversals** (crossing the midpoint — the
  paradigm shift: a virtue curdling into ITS OWN vice), and **top-3 displacements** (§4). Never
  raw movement (anti-wallpaper). Every receipt carries evidence-bound causes.

## 4. Consumers (§800.1): character steers, outcomes teach, the loop closes

- **One chokepoint:** `effectiveCharacter(npc)` (core + drift; absent drift ⇒ core exactly).
  Every consumer routes here: `readClergyPlane` / `targetedFootholds`, espionage
  `flawDistortion`, the persona/AI surface, prose composers.
- **Goals:** `branchedGoals(state, context)` and initial goal assignment take effective
  character as an input tilting the branch (seeded, deterministic) — goals AND their evolution.
- **Missions:** effective temperament/flaw enters the ONE vetting reader (⟨F8⟩ one-home law:
  "vetting is a real refusal, not a score") — the dutiful accept desperate errands, the
  self-serving refuse without pay, and a court everyone refuses casts nobody and says so.
- **Corruption:** eligibility reads **banded depth — a vice at `marked` or deeper** (LOAD-BEARING
  under full paradigm, §800.4: latent greed in everyone must not make everyone corruptible);
  temperament steadiness reads the effective leading virtue. A drifted paradigm shift into a
  corruptible vice OPENS eligibility — becoming reachable is the endpoint of a long arc.
- **Loop safety (structural):** anti-ratchet decay · clamped learn rates with saturation ·
  read-last-tick/write-next-tick (no same-tick echo) · every draw seeded. The enumerated
  feedback loops (drift→belief→drift via TRUST; drift→goals→outcomes→drift) each cross ticks
  and pass through clamps — pinned by property tests.

## 5. The read model: top-3 and the displacement receipt (§800.4)

Read surfaces (dossier lead, news, hover) show the **top 3 strongest positions**: order =
|effective position| desc, then band rank, then codepoint axis id (pinned total order). A
background axis overtaking a foreground one mints a **displacement receipt** ("bitterness has
overtaken his patience") — visible personality changing composition is a first-class, cause-bound
event. Full character remains readable behind the fold and in the edit view.

## 6. Gods on the chart (§800.3) — W-FAITH deltas

- A deity's character = leveled positions on the SAME axes (J2). **D2's separate mythic-flaw
  vocabulary is SUPERSEDED** — every candidate mapped into the pools (jealous→envious,
  capricious→volatile, covetous→greedy, proud→arrogant, wrathful→wrathful). Flaw-style
  mechanics (a jealous god's boon weakening as share is contested) attach to vice-pole positions.
- **Immutable structurally (J4):** deities have no drift state; the drift writer accepts NPCs
  only. Fortunes (pantheon ledger) move; character does not.
- **Same level words; rank carries potency (J3)** — no divine intensity tier (rank already
  scales via DEITY_RANK_AUTHORITY; double-encoding forbidden). Authoring defaults `defining`.
- **The faith pull** = the W-FAITH influence field (D4: share × rank × standing × patronAmp ×
  pietyField) applied as a WITNESS-plane ambient source along the deity's held axes toward its
  poles. D1's `authoredTemper` stance dial STANDS (stance toward conflict ⊥ virtue — an
  honorable war god is authorable). D3 boon/bane and the magic gate are untouched.

## 7. Surfaces (§800.5)

- **Edit view = the paradigm chart made visible:** every axis on its spectrum, most at neutral;
  the user sets any position at any band on any axes (all-neutral legal). For NPCs the pen moves
  the **CORE**; a read-only **ghost** shows the drifted effective position beside the anchor —
  drift made visible exactly where the user authors. Editing a core mid-campaign re-anchors
  decay; drift offsets persist (lived history immutable). Gods: same chart, no ghost.
  ⚠ RECON ROW: confirm the NPC edit surface (settlement editor vs compendium) at dispatch.
- **Custom content / DB:** deity axis positions join the admission manifest + CHECKs additively
  (049/056 pattern). NPC authoring rides the settlement-editor path.
- **Prose:** band words and pole words only; displacement/reversal/crossing templates follow the
  Herald contextual-narrative law (§754.3) and the news address law.

## 8. Gating, lifecycle, proofs

Two virtual doors (dark in legacy configs, lit in full simulation): `livedExperienceEnabled`
(funnel + drift) and `paradigmChartEnabled` (the catalog-backed read path; legacy words keep
projecting identically when dark). Byte-identity proofs: legacy fixture goldens dark AND lit-with-
no-lessons; the derived-tables-reproduce-hand-tables pin; the legacy word round-trip pin. Behavior
that legitimately moves under lit presets gets SHIFT RECORDs. Consumer censuses with full-suite
denominators owed at dispatch (§786.2): every reader of `personality.*`, TRAIT_* tables,
`deityTemper`. The uid-stability recon row (§2) is a landing precondition.

## 9. Risks and counters

1. **Wallpaper** → receipts on crossings/reversals/displacements only; small learn rates; the
   band ladder's width is the sensitivity dial (owner-signed).
2. **Runaway** → anti-ratchet + saturation + clamps; enumerated cross-tick loops; property tests
   assert no unbounded trajectory under constant pull (the 300-year-runaway lesson, structural).
3. **Double-count** → closest-plane-wins + evidence binding; asserted by the partition test.
4. **Save bloat** → sparse encoding; neutral costs zero; populace drifts stay aggregate
   (settlement channels); measure serialized size in the soak fixture.
5. **Identity erosion** (everyone converging to their city's character) → milieu rates are the
   SMALLEST in the table; decay home outpaces ambient pull at equilibrium for all but `defining`
   pressure — asserted as a property, not hoped.
6. **Catalog drift** → one catalog, derived columns, lockstep pin, no parallel tables survive.

## 10. Train decomposition (W-LIVES; seats per §787.2; W-FAITH consumes cars 1–4)

| Car | Scope | Seat |
|---|---|---|
| 0 | This volume (done) | Fable (chair) |
| 1 | The axis catalog leaf + derived columns + legacy word mapping + round-trip pins | Opus |
| 2 | State model: core/drift/effective + uid recon row + doors + goldens | Opus (recon first) |
| 3 | The funnel: planes, lesson families, closest-plane-wins, receipts incl. displacement | Opus (Fable review) |
| 4 | Source adapters (corruption, ladder, credibility, custody, faction, milieu, news×belief) | Opus |
| 5 | Consumers: chokepoint re-routes, goal branch input, vetting input, corruption depth gate | Opus |
| 6 | **The candidate registers pack for the owner's pen** (chart, levels, experience table, rates) | **Fable** |
| 7 | Read model + prose: top-3, displacement/reversal news, dossier | **Fable** (voice) |
| 8 | Edit view: full chart + ghost + admission/DB | Opus (Fable design review) |

Sequencing: W-LIVES cars 1–2 land before W-FAITH's field car (which registers the faith pull as
a source); both after T7 per the queue; skeptic panel before car 1 (§441 J7).

## 11. Open owner-taste items (everything else above is decided vetoably)

1. **The chart itself** (§1.1) — pairings, the five orphan mints, reassignments, DEVOTION's fate.
2. Level words (`a_touch/marked/defining`?) and the drift half-life band per axis class.
3. The experience table — kinds × axis pulls × family rates.
4. Whether `ruthless`/`stubborn` get homes or stay expression words.
5. Whether a refused seek-compromise (§12 R1) teaches bitterness — the humiliation lesson row.

## 12. Agency depth — the second sitting (ODQ §802, ruled under delegation)

**R1 — Willing compromise (demand-side corruption).** Eligibility: a corruptible vice at
`defining`, OR vice crowding (≥2 vices at `marked`+). Emits a `seek_compromise` candidate through
npcAgency's existing grammar toward a typed patron menu (criminal faction · corrupt seat-holder ·
corruption web/foreign patron · corrupting cult — all existing structures). Acceptance is a REAL
REFUSAL (the vetting pattern) reading the seeker's KNOWN character (R2); the patron's own
character/doctrine sets tolerance. A granted seek enters the SAME corruption state (leash/ties) —
a second door into one system, never a parallel one. Refusal is receipted.

**R2 — Known character (the reputation read model).** Perceived character is a PURE DERIVED read
over the receipted subset only: on-record acts (revealed corruption, lie-stigma, custody, band
crossings/displacements that made news) propagated through the existing rumor/news mill
(distance-priced; same-settlement fastest); per-observer belief = the subject's track record
(credibility stock × revealed states) × the observer's own TRUST-axis position. Unreceipted drift
stays PRIVATE — the town knows the reeve hardened; the quiet clerk's treachery surprises. No
second personality store. ⭐ **THE SIGHT RULING:** mortal consumers (patrons, courts, R1 refusals)
read KNOWN character; **deities read TRUE character** (`targetedFootholds` keeps true-sight,
byte-identical) — gods know souls, men know reputations.

**R3 — Praxis (you become what you repeatedly do).** Each goal/mission carries a typed METHOD
MENU from the existing action grammar; choice is seeded, weighted by effective character atop the
archetype. Each method carries a PRACTICE lesson — small, method-aligned, OUTCOME-INDEPENDENT
(the cruel act marks you whether it worked) — distinct from the §3 personal-plane OUTCOME lesson.
Contrary-to-nature methods are choosable at penalty weight and hold a STRAINED position only
while practiced: the equilibrium is practice rate against homeward decay — stop, and you drift
home. This makes drift endogenous, not only event-driven.

**R3b — Method-conditioned resolution (ODQ §802.1, owner-ratified).** The chosen method shapes
the success roll: success = base odds (typed goal/mission) × three bounded term families —
**actor fit** (alignment of method with effective character + capability modifiers; the deceitful
lie better — skill-through-vice is deliberate), **counterparty fit** (threaten the cowardly,
never the brave; bargain with the greedy), and **context** (EXISTING causal variables only —
security, legitimacy, prosperity, corruption climate, disposition bands; no context state is
ever minted for odds). ⭐ **Choose on KNOWN, resolve on TRUE:** the actor weighs methods against
the counterparty's R2 known character; the roll resolves against true character — decisions on
estimates, resolutions on truth (the fidelityNoise doctrine). **Failure modes differ by method:**
a failed bargain costs standing, a failed threat mints a feud, failed sabotage mints EVIDENCE
(→ known character) — method choice is a risk-profile choice. Seeded per (actor, goal, tick);
odds reach prose as band words, never percentages. The whole matrix is bounded by the closed
grammar (~14 verbs × three term families, each verb declaring its axes and variables) and joins
the owner-taste registers pack (car 6). New §9 loop: competence-through-practice, bounded by
saturation, homeward decay, counterparty/context terms, and per-method failure modes.

**R3c — The two-channel composition (ODQ §802.2, owner-refined).** Every executed method teaches
twice: the **practice mark** (small, method-aligned, outcome-independent — you did the cruel
thing; R3 stands) and the **outcome lesson** (larger, signed by result: success VALIDATES,
deepening the aligned axis hard; failure CHASTENS, pulling back toward core on that axis). Under
success both align ⇒ strong reinforcement; under failure they oppose and chastening dominates ⇒
net drift away — but a residue remains: a failed atrocity does not leave you clean. **No parallel
habit ledger:** selection weight reads effective character only — drift IS the habit memory (one
source per fact); consequence ruled a feature: reinforcement GENERALIZES across same-axis methods
(success at lying makes manipulation likelier — habits generalize by character, not by verb).
**Core-strain asymmetry** (emergent, zero new machinery): core-aligned habits are self-sustaining;
contrary-to-nature habits hold a strained position homeward decay constantly erodes — formidable
only while fed. **Stability:** failure's chastening is the negative-feedback brake on the §802.1
competence loop — the system self-regulates around a character-odds equilibrium, never a ratchet.

**R4 — The bond transmutes; the state persists (change of heart while bound).** The corruption
tie is ONE state with a DERIVED bond kind: vice at the door ⇒ `appetite` (eager compliance); the
same tie held after the character has crossed home past the threshold ⇒ **`duress`** — blackmail
made mechanical, the leverage now the patron's MONOPOLY ON THE RECEIPTS of what was already done
(R2's asymmetry is the blackmail's substance). Under duress: corrupt output falls to minimal
compliance, patron-punitive exposure risk rises (spending the evidence is the counter), and new
candidates open — **confess** (voluntary self-exposure: full stigma, hold broken; the past
follows the reformed — the tragedy is honest), **seek_protection** (a rival power, the law,
sanctuary — a faith door), **flip** (turn on the patron — the espionage/exposure arc).
Re-corruption is free: drift back across ⇒ `appetite` again. No new ledger, no authored flag —
the emergent situation is a derivation, so it can only arise in play.

Car mapping: R1/R4 join car 5 (consumers) + a corruption-adapter slice in car 4; R2 is its own
half-car beside car 4 (the derived read + mill wiring); R3 rides cars 3/5 (menu + practice kinds).

**Sibling volume:** the operational layer — the unified goal/mission/errand grammar, the mission
dispatcher, the infiltration ladder (L0–L4, extending ES §3.4b upward), and the envoy task
catalog — is **docs/DESIGN_W_OPS.md** (ODQ §803). It CONSUMES this substrate (planes, praxis,
known character, the R4 bond grammar) and lands after cars 1–3 here.

## 13. The third sitting (ODQ §803.1): seeking, the risk register, derived alignment

**R5 — Bidirectional seeking.** Ambition is a spectrum of doors through the ONE acceptance seam:
seek-MORE = high-risk/high-payout acceptance, promotion/rivalry bids, R1 willing compromise, the
rooted dwell; seek-LESS = refusal, withdrawal toward modest goal branches, R4's confession and
seek_protection. Every door reads the same soul; every refusal is in character.

**R6 — The personal risk register, derived never stored.** `riskRegister(npc, context) =
{center, breadth}` — center from effective character (courage/ambition families × the ES
charter's home-desperation context: §3.4b's composition FORMALIZED); no stored stock — drift IS
the memory. **The two-scale seam:** the court's SP-C appetite governs what it OFFERS; the
person's register governs what they ACCEPT; a mission happens when both say yes.

**R7 — Derived alignment.** Good↔evil × lawful↔chaotic = the summed plane projection of
EFFECTIVE positions (the §1 derived columns), banded into words. Never stored; moves with drift
— "he was a good man once" is mechanical. Legacy undrifted words project to today's
TRAIT_ALIGNMENT values (byte-identical, pinned). Axes authored, characterizations derived — the
same philosophy at both mortal and divine scale.

**R8 — Chaos is breadth.** The disorder projection sets the register's WINDOW WIDTH: lawful ⇒
narrow (only well-priced risks), chaotic ⇒ broad (the desperate gambit and the irrational fold
both live inside; seeded draw). This is the estate's fidelityNoise law (chaos = variance)
arriving at the personal scale — window width in v1; extending personal chaos into ESTIMATE
noise is an owner-taste row (avoid double-noise).

## 14. The coherence audit (ODQ §803.2): four gaps ruled, two exclusions recorded

**A — The interpersonal coupling.** Relationship events are EXPERIENCE KINDS carrying the
counterpart id (betrayal BY A FRIEND is PERSONAL-plane and hits harder than institutional loss —
the persons you love are closer than the factions you serve); character conditions relationship
formation through the same projection (the paranoid bond slowly). Existing machinery only
(relationshipMemory, grievances, relationshipEvolution) — the coupling, never a new system.

**B — Death and the fate of state.** Drift state is garbage-collected at death; KNOWN character
freezes into legacy at the chronicle (a dead man's reputation still shames or shields his
house); R4 bonds resolve BY HOLDER — org-shared evidence survives the patron and passes to the
org, personally-held evidence dies with him (deliverance, receipted).

**C — Group character = derived member projection.** The clergy plane generalizes: a
faction/court's effective character is the org-power-weighted projection of its seated members
(readClergyPlane's shape beyond clergy; variance preserved; zero new state), read BESIDE — never
instead of — SP-C's learned appetite. Three reads, one seam: a court's NERVE is learned, its
CHARACTER is who staffs it, its OFFERS read both. A faction's R2 known character is its public face.

**D — Biography is a query, not a store.** An NPC's life story is a derived read over the
receipts that name them; the dossier renders "hardened by the sack, the failed mission, a year
in a cruel city" from receipts alone. No per-NPC memory store exists or may be minted.

**Deliberate exclusions (recorded so nobody re-finds them as gaps):** no mood/emotion layer —
character + context + conditions cover it, by design; no age-scaled drift rates in v1 (a taste
row, not a hole). **Small rule:** the AFFILIATION plane's "your god": clergy → their faction's
deity; laity → the settlement patron scaled by devotion.

## 15. THE PANEL FOLD (ODQ §806 — the §441 J7 skeptic pass, all findings dispositioned)

The panel CONFIRMED every symbol claim and the loop-brake architecture; the following RE-RULINGS
amend the sections above and OUTRANK them where they conflict:

- **F1 → §1 re-ruled: CONSOLIDATION, not derivation.** The legacy weight tables are per-WORD
  with asymmetric pole pairs and cross-table ratio conflicts — no per-axis lean × level scheme
  can reproduce them. The catalog therefore carries the legacy per-word, per-column values
  VERBATIM (one home, killing the parallel-tables hazard exactly as well); the lean × sign ×
  level scheme governs ONLY drift dynamics and newly authored positions. Byte-identity is now
  trivially satisfiable.
- **F2 → corruptibility is a per-word column** for legacy words (FLAW_VECTOR is word-grained:
  `cruel` is not corruptible while `callous` is); the per-axis corruption vector applies only to
  DRIFTED vices. Dark-door behavior cannot move.
- **F3 → the NOVICE CORNER is ruled and OWNER-VISIBLE (pack row 13):** at ≈zero drift,
  chastening (bounded at core) cannot push below baseline, so failure's "opposite effect" at the
  novice corner is delivered through the WORLDLY terms — the failure mode's costs and the known-
  character stain lower the method's expected value — not through the soul; the characterological
  opposite-effect grows with habituation. The alternative (practice marks on success only) is
  the flip the owner may sign instead.
- **F6 → death mints ONE typed chronicle receipt** (the legacy record — an event, not a
  personality store); the derived known-character read terminates into it.
- **F9 → the MATERIALIZATION FLOOR, AMENDED at §853 (L2 measured the original blocking its
  own accumulation — nothing sub-floor is stored, so a per-tick sub-epsilon pull restarts from
  zero forever; 50 ticks of a 0.2 pull mark nobody):** the floor stands, and the cure lives at
  the SOURCE, not the store — **ambient/milieu sources emit at INTERVAL cadence with
  time-integrated magnitude** (a season of exposure arrives as one quantum scaled by dwell time,
  crossing the floor or honestly not — a truly faint exposure never marks, which is truth, not
  loss). **Source-design law for L3/L4: no source may emit per-tick sub-floor pulls.** Sparsity
  and accumulation both survive; no sub-floor accumulator state exists.
- **F10 → two dispositions:** the stored `npcStates.alignment` and its four live consumers get
  a census-with-denominator at car 5 (re-point to the derived read or declare it a projection
  cache — no third state); and the mortal/divine relation is an ASYMMETRY, stated: for gods the
  authored axes ARE the character (alignmentAxis stays authored); for mortals alignment is a
  derived reading of the soul.
- **F11 → the erosion property re-stated:** linear pull/decay equilibrate at x* ≈ pull/(1−decay)
  per tick — so the assertion is (a) a PER-AXIS OFFSET CLAMP (explicit, band-bounded) and (b)
  the SUMMED ambient equilibrium across source families sits below one band at every depth
  short of `immersed`. Asserted over the aggregate, not the single term.
- **F12 → two loops added to §9's enumeration** with property tests: the settlement↔citizen
  milieu echo (citizens drift toward the town's character while their acts feed its channels)
  and the group-character↔offers echo (GAP C's derived bench character feeding what courts
  offer, which selects who serves).
- **F13 → the corruption-depth call is RESTORED to the owner** (pack row 13 companion): `marked`
  (as §4 wrote) vs `defining`-only (the chair's recorded lean) for drifted-vice eligibility.
- **F15 corrections:** `diplomatic`/`methodical` are dispositioned in the PACK (capability /
  modifier with static legacy leans) — §1.1's table defers to the pack's disposition; R6's
  center reads the COURAGE and PRUDENCE axes + the `ambitious` static modifier + desperation
  (no phantom "ambition family"); the LOCKSTEP pin's true home is `npcFacetContract.js`;
  `branchedGoals` is a rule tree, so car 5 carries an explicit rule-tree → weighted-branch
  conversion sub-task (priced, not assumed).
