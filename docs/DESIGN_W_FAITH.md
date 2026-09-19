# DESIGN_W_FAITH — The Living Faith Volume (deity Temperament · Flaw · Boon & Bane · the influence field · NPC temper drift)

**Status:** ARCHITECTURE RULED (chair, Fable seat, 2026-08-30) — vocabularies and tuning rows remain
OWNER-TASTE before freeze (§797.3). Charter: ODQ §797 · §797.2 · §797.4 (pure buffs legal; neutral
first-class on every aspect) · §797.5 (drift = instantiations of the banded-stock / disposition-ledger
family, never a new lifecycle). Substrate surveyed whole at build tip `14707a8a8`.

> ⚠ **AMENDED BY docs/DESIGN_W_LIVES.md (ODQ §§800–800.5, §801).** The owner widened the character
> substrate into its own volume: **D2 is SUPERSEDED** (deity flaws = vice-pole positions on the shared
> paradigm chart) and **D5/D6 are RESHAPED** (NPC drift = per-axis spectra under the full-paradigm
> model; the chokepoint is `effectiveCharacter`). D1 (authoredTemper stance dial), D3 (boon/bane +
> magic gate), D4 (the influence field), and D7–D9 STAND; the field now registers as a WITNESS-plane
> source in W-LIVES's funnel. W-LIVES cars 1–2 land before this volume's field car.

---

## 0. Constitutional constraints this volume is designed inside

1. **THE PROMISE** — a seed is a starting world forever; absent-state ⇒ byte-identical is the design
   invariant of every section below, exactly as piety.js's identity short-circuit models it.
2. **Deity doctrine** — faith = culture, never theological; every vocabulary below is setting-agnostic.
3. **Finite-semantics law** — every authorable aspect is a typed bucket from a closed vocabulary;
   free text never acquires mechanics (portfolio stays flavor-only; AI = clerk).
4. **Legitimacy & conversion UNCHANGED** (charter) — the new aspects reach them only through seams
   that already exist (the clergy plane, share, standing); no legitimacy/conversion formula moves.
5. **Magic gate** — boon/bane mechanics exist only where the world's magic dial admits them (§ D3).
6. **Anti-ratchet** — every new stock decays toward its home by `bandedStock.decayTowardNeutral`;
   no new lifecycle, no sixteenth hand-rolled pow (§797.5).

## 1. The substrate, as measured (receipts)

- **`bandedStock.js`** — the one decay shape. Decisive API fact: `decayTowardNeutral(value, neutral,
  ageWeeks, band)` takes the **home point as a parameter** — "decay toward THIS NPC's own core" is a
  one-argument instantiation. Crossing receipts refuse floats (L5 structural); shared half-life
  ladder (`a_season … a_generation`) derived from `INTERVAL_WEEKS`.
- **`dispositionLedger.js`** — the worked drift instance: settlement channels (martial/mercantile/
  diplomatic/insular) + the SP-C appetite facet; closed `DISPOSITION_SOURCE_KINDS` cause vocabulary
  with a silent fallback kind; two-door gating; decay-first-then-outcomes ordering; transition
  receipts with evidence binding; **already instantiated per-deity** (`worldState.pantheon` — faith
  fortunes).
- **`piety.js`** — the owner's amplifier contract `deityEffect = base × f(localPiety) × g(realmPiety)`
  is BUILT: local piety = W_AUTHORITY·authority + W_INSTITUTION·institutions + W_DEVOTION·devotion
  (devotion = patron share × standing + multifaith bonus); realm mean; clergy-integrity distortion;
  per-axis opposed-runner-up dampener; identity short-circuit (absent record ⇒ literal 1.0).
- **`deityAxes.js`** — temper is **derived-only** (W-F5 stage 1 retired the stored `temperamentAxis`;
  the field persists inert in embeds/DB, migrations 049/056 keep column + CHECK). `deriveTemper` =
  dead-banded blend of evil01/chaos01. Consumers: stance core, cult-imposition niche key, the temper
  readers (religiousContest / religionState / disposition).
- **`clergyTraitPlane.js`** — the per-trait `TRAIT_PLANE` table projects **authored NPC personality**
  (dominant / flaw / modifier — the slots) onto the deity plane (e, c); variance preserved;
  `targetedFootholds` already lets a rival god recruit a SPECIFIC NPC by trait fit.
- **`corruption.js`** — the NPC core is authored and optional: `personality.dominant` = steady
  temperament, `personality.flaw` optional and only it is corruptible; temperament halves corruption
  onset (`temperamentSteadiness: 0.5`). **Nothing in domain code writes these slots** (grep-verified
  at tip): the core is immutable today.
- **`customContentSchema.js`** — deity shape today: name · alignmentAxis · rankAxis (major/minor/cult
  → `DEITY_RANK_AUTHORITY` 18/10/5 religious-authority lift) · lawAxis (absence-tolerant) ·
  temperamentAxis (stored, inert) · portfolio (free text, **zero mechanics** — "domains" have no
  mechanical existence to demolish).

**The one-line synthesis:** the estate already has gods with derived temperaments and per-deity
fortunes, settlements with drifting learned temperaments, NPCs with immutable authored cores read by
three lenses, and a piety field that scales divine influence — W-FAITH closes the loop by making the
deity's character authored, giving it a typed effect channel, and letting the field pull mortal
temperaments the way mortal conduct already pulls piety.

## 2. Architecture decisions (each vetoable)

### D1 — Authored Temperament is a NEW field; the retired axis stays retired
Add optional `authoredTemper` ∈ `DEITY_TEMPER_KEYS` (`warlike`/`peacelike`/`neutral`) to the deity
shape. Read seam: `deityTemper(deity)` gains one arm — authored present ⇒ authored word; absent ⇒
`deriveTemper(evil01, chaos01)` exactly as today. An authored `neutral` is a REAL choice (it wins
over a derivation that would say warlike) — neutral first-class per §797.4.
**JUDGMENT: chose a new field over re-arming `temperamentAxis` because every existing custom deity
carries a stored temperamentAxis value minted as a compat mirror, not as intent — re-arming it would
silently shift existing user content (the §786.2 class). The old field stays inert forever, PINNED by
a test. Say "veto" to flip it.** Byte-identity: no existing deity carries `authoredTemper` ⇒ every
read derives ⇒ identical. Axes keep driving the planes (evil01/chaos01 unchanged); the authored word
overrides only the temper-word consumers — no double-count by construction, asserted by a test that
no site reads both for the same term.

### D2 — Deity Flaw ⚠ SUPERSEDED by DESIGN_W_LIVES §6 (ODQ §800.3 J2): a deity's flaws are its vice-pole positions on the shared paradigm chart; the modulation hooks below survive, attached to vice poles
Optional `flaw` ∈ `DEITY_FLAWS` (closed, setting-agnostic, owner-taste; candidate register: jealous,
wrathful, capricious, covetous, proud, fickle, brooding, meddling). Absent = unflawed (neutral
first-class). Mechanics are a single closed `FLAW_EFFECTS` table over quantities that already exist —
e.g. *jealous*: boon weakens as pantheon share is contested (reads share); *wrathful*: temper pull
sharpens while faith fortunes fall (reads the pantheon ledger); *capricious*: boon/bane magnitude
band widens (variance, not mean). No flaw invents a new engine quantity. Herald color rides the flaw
token as a typed cause. **JUDGMENT: flaws modulate the deity's OWN channels rather than adding new
world channels — keeps the blast radius inside the field and the vocabulary honest. Veto to widen.**

### D3 — Boon & Bane: typed settlement effect channels, magic-gated, in place of domains
Optional `boon` and `bane`, each a `{ channel, strength }` pick from a closed `DEITY_EFFECT_CHANNELS`
vocabulary mapping ONLY to existing settlement causal variables / engine quantities (candidate
register, owner-taste: harvest, trade, craft, healing/pestilence-resistance, sea/storm, order,
war-readiness, learning, hearth/fertility). Pure buff (boon only), pure bane, both, or neither — all
legal (§797.4). Strength is a banded word, never a float. **The magic gate is ONE chokepoint** in the
field application (§ D4): where the world's magic dial says magic does not exist, boon/bane
contribute a ZERO mechanical term and survive as cultural emphasis in prose only. `portfolio` stays
free-text flavor. ⚠ **CORRECTED BY F1c's MEASUREMENT (ODQ §851): "domains never had mechanics" was
FALSE** — the deity `domain` field is effect:mechanical and moves war disposition via
dispositionProfile; `harvest` and `war_readiness` collide with it. **THE PRECEDENCE RULING (§851,
per the owner's own §797 "in place of domains"):** a deity carrying authored boon/bane reads THOSE
and its legacy domain arm goes silent FOR THAT DEITY; a deity carrying only the legacy domain keeps
its unchanged arm (THE PROMISE) — one arm per deity, never both, asserted structurally. F4c builds
under this law.

### D4 — The influence field: every deity, weighted; the patron as amplifier
One new pure leaf (`faithField.js`) computes, per settlement and per unsuppressed pantheon member:

```
w(d, s) = share01(d, s) × rankWeight(d) × standingWeight(d) × [patron ? PATRON_AMP : 1]
term(d, s, channel) = aspectTerm(d, channel) × w(d, s) × pietyField(s)
```

where `pietyField(s)` is the EXISTING composite (localMult × realmMult — authority, institutions,
devotion, clergy integrity already folded), `aspectTerm` is the deity's temper pull / boon / bane /
flaw-modulated magnitude, and per-channel totals are **capped** (the DAMP_MAX / MULT_MIN..MAX
discipline) so a crowded pantheon saturates rather than stacks. Patron-only couplings that exist
today (corruption plane, opposition dampener, stance) are UNTOUCHED — the field is a new consumer
beside them, dark by default (§ D7), so legacy behavior is byte-identical with the door dark and
unchanged-at-1.0 where the field has no members. Read/write timing: tick-START reads, exactly as
piety and the ledger pin it.

### D5 — NPC temper drift ⚠ RESHAPED by DESIGN_W_LIVES §§2–4 (ODQ §§800–800.4): drift is now per-axis along the full paradigm chart's spectra; the faith pull is one WITNESS-plane source among many. The core principles below (immutable core, anti-ratchet home, closed vocabularies, receipt grammar) all survive into the wider model
The core (`personality.dominant` / `.flaw` / `.modifier`) **never mutates** — identity is authored,
and provenance stays clean. Drift is a per-NPC state `{ dE, dC, updatedTick }`: a bounded offset on
the SAME two plane axes `TRAIT_PLANE` already projects, decaying home by
`decayTowardNeutral(value, 0, age, band)` on a shared-ladder band (owner-taste: `a_year` or
`a_few_years`). Pulls come from:
1. **Set experiences** — a closed `NPC_EXPERIENCE_KINDS` vocabulary (the DISPOSITION_SOURCE_KINDS
   pattern, with the silent fallback kind): candidates — war_witnessed, bereavement, occupation,
   ruin, windfall, exposure_of_corruption, festival_kept, miracle_claimed. Each kind = a small signed
   (e, c) pull with a learn rate; emitted by engine events that already exist.
2. **The faith field** — a deity's temper/flaw exerts a slow pull on EXPOSED NPCs (clergy of that
   faith strongest, devout populace weaker), scaled by `w(d, s) × pietyField(s)`.
The effective character = authored plane + drift offset, read through ONE chokepoint (§ D6). Band
words per axis (owner-taste; candidates: gentled/steady/hardened on malice, loosened/steady/ordered
on method) with crossings minted through `bandCrossingReceipt` — float-proof, Herald-ready ("the high
priestess has hardened since the sack"). **The owner's "not all-consuming" boundary is STRUCTURAL:**
absent sustained pull, anti-ratchet walks everyone home to who they are. Deity FLAWS do not drift and
NPC flaws do not drift in v1 — flaw arcs are already event-owned (corruption); recorded as
deliberately deferred, owner may extend.

### D6 — One read chokepoint for effective character
`effectiveTraitPlane(npc)` (new leaf beside clergyTraitPlane) = `npcTraitPlane(npc)` + drift offset,
clamped to the plane. `readClergyPlane`, `targetedFootholds`, and any future consumer route through
it. Absent drift state ⇒ authored projection EXACTLY (byte-identity). Corruption's
`temperamentSteadiness` keeps reading the authored core in v1 (identity, not mood) — deliberate,
recorded, cheap to revisit.

### D7 — Gating and lifecycle
Two doors, pinned separately (the estate's two-door discipline): `faithFieldEnabled` (D3/D4 terms)
and `npcTemperDriftEnabled` (D5), both VIRTUAL keys absent from DEFAULT_SIMULATION_RULES, lit in the
full-simulation preset only. Dark ⇒ no key is ever written ⇒ saves serialize byte-identically.
**Lifecycle trace owed at dispatch (the owner's most-bitten class):** drift state lives on the NPC
record — the train's FIRST recon row must walk create / read / persist / **regenerate** / undo /
migrate and prove drift state survives settlement regen (or rules it tick-state that legitimately
rebuilds), before any implementation car lands.

### D8 — Authoring surface
CustomContentEditor + admission manifest + DB additively extended: `authoredTemper` (4-state:
absent/warlike/peacelike/neutral), `flaw` (absent or closed pick), `boon`/`bane` (absent or
channel+strength picks). CHECKs mirror the closed vocabularies exactly as 049/056 do for the axes.
Validation is clerk-work; no free text acquires mechanics. Existing deities need no edit and read
byte-identically (all new fields absent).

### D9 — What is explicitly untouched
Legitimacy formulae, conversion/contest mechanics, the opposition dampener, corruption-plane surface,
DEITY_RANK_AUTHORITY, the piety record shape. The pantheon-side disposition ledger (faith fortunes)
is READ by flaw hooks (D2) but its writer is unchanged.

## 3. Risks and their counters

1. **Double-count** — authored temper + derived axes feeding the same site: countered by D1's split
   (word-consumers vs plane-consumers) + a census-with-denominator of every `deityTemper` /
   `primaryDeitySnapshot` consumer at dispatch (§786.2: full-suite denominator, every site
   dispositioned).
2. **Runaway** — a stacked pantheon: per-channel caps + saturation (D4), anti-ratchet on drift (D5),
   the existing MULT clamps. No new ratchet is constructible: the only non-outcome movement anywhere
   is decay toward home.
3. **Existing-content shift** — the inert `temperamentAxis`: pinned inert by test (D1).
4. **Vocabulary taste** — every word list above is a CANDIDATE register; the owner signs the drift
   table, flaw list, channel list, band words, learn rates, and half-life bands at the tuning pass
   (carve-out class, §763).
5. **Regen ghosting** — D7's lifecycle recon row is a landing precondition, not a hope.

## 4. Train decomposition (W-FAITH; seats per §787.2)

| Car | Scope | Seat |
|---|---|---|
| 0 | This volume (done) | Fable (chair) |
| 1 | Schema + authoring + admission + DB checks (D1/D8 shapes) | Opus |
| 2 | `deityTemper` authored arm + inertness pin + consumer census w/ denominator | Opus |
| 3 | `faithField.js` kernel: equation, caps, the ONE magic-gate chokepoint, goldens — **and its registration as a W-LIVES witness-plane source (§806/F14)** | Opus (Fable review) |
| 4 | Boon/bane channel wiring to causal variables | Opus |
| 5 | Flaw vocabulary + `FLAW_EFFECTS` + fortunes coupling | **Fable** (judgment-dense vocabulary) |
| 6 | ⚠ SUPERSEDED (§806/F14): the drift leaf is W-LIVES's (its cars 1–3); this car becomes the faith-pull SOURCE ADAPTER into the W-LIVES funnel + the clergy consumers' re-route | Opus (recon row first) |
| 7 | Herald/dossier prose: crossings, faith panel, contextual narrative (§754.3) | **Fable** (voice) |
| 8 | Owner-taste pack: every candidate register + tuning rows for signature | **Fable** |

Sequencing: after T7 per the standing queue; coordinate with W-SEAT; panel review before car 1
dispatches (§441 J7 — this volume's "confirmed" homes are hypotheses until a skeptic pass).

## 5. Open owner questions (small; everything else is decided vetoably above)

1. Drift half-life taste: `a_year` (moods move within a campaign) vs `a_few_years` (character is
   sticky)? Architecture default: `a_few_years`.
2. Should populace NPCs drift in v1, or clergy + named NPCs first (default: clergy + named first,
   populace via the aggregate settlement channels that already exist)?
3. May a boon and bane share a channel (a storm god who blesses AND wrecks the sea)? Default: yes —
   variance is honest.
