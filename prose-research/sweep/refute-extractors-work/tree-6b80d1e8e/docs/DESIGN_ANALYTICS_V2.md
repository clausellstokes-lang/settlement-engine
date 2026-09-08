# DESIGN — ANALYTICS V2: THE DATA LAYER (capture → rollup → three consumers)
## Fable 5 architecture, 2026-07-14 — owner-directed: robust, extractable, interpretable; for TUNING, for NEW CONSTRUCTION, and for SALE to worldbuilder-market buyers
### Foundation: the existing privacy-first seam (track→EVENTS→consent→ingest→analytics_events JSONB + analytics_daily_rollups), the usage-telemetry branch (6a8bfade — this directive is read as its merge authorization, JUDGMENT vetoable), consent v2, the fingerprint inverse-sanitizers, DESIGN_AI_CONTROL_SURFACE §28-34

## 0. The three consumers define the layer (design from the read-side backward)
1. **TUNING** — live campaigns as a distributed soak: real distributions vs the design envelopes.
2. **CONSTRUCTION INSIGHT** — what players build, change, re-roll, and abandon = the content
   roadmap's demand signal.
3. **MARKET DATA (sellable)** — aggregate worldbuilder-market insights packaged for buyers
   (publishers, tool-makers, studios): what the market builds, tolerates, pays for, and returns to.
One capture pipeline, three read shapes — and three SEPARATE consent planes (§5), because the
three uses have different ethical weights.

## 1. THE CAPTURE TAXONOMY (v2 groupings; enrich-existing-events wherever possible — the 20B
## eager wall stands; new event names counted and budgeted)

### 1.1 AI-use events (lands with each Surveyor stage; the §34 metrics made concrete)
Per interaction: stage (analyst/brief/session-interpret/custom-content/construct), task class +
model route + latency + token/cost bands (COARSE bands, never raw counts), and the OUTCOME LOOP:
proposal size (ops count), per-op verdict (approved/edited/rejected), edit distance band,
protected-constraint touches, invalid-op count, later undo/retention (7d/30d), BYOK vs managed.
KEY METRICS DERIVED: acceptance rate, correction burden, unsupported-ask rate, retained-change
rate — per stage, per model class, per campaign age. These are simultaneously product metrics
AND the eval harness for the world-intent model.

### 1.2 Settlement-construction groupings (updated)
Config archetype (tier × terrain × priority-PROFILE cluster — a small named taxonomy of slider
shapes: 'martial', 'mercantile', 'pious', 'balanced', 'criminal-leaning'…), generation mode
(quick/advanced/manual/AI-constructed), custom-content participation (counts by category, never
content), outcome fingerprint (institution count band, stress types present, food band, faction
count), and the POST-GENERATION VERBS — the demand goldmine: what users regen (full vs section,
which section), what they edit first (the first-edited field per archetype is a direct
dissatisfaction/priority signal), what they lock, what they abandon un-saved.

### 1.3 Realm/campaign-construction groupings (new tier of aggregation)
Realm shape (settlement count band, tier mix, topology class: linear-valley/hub-and-spoke/
coastal-ring/scattered), spatial adoption (canonized? map source?), PRESET + FLAG ADOPTION (the
drama dials: which systems the market actually turns on — the single most tuning-and-market-
relevant signal we have), autonomy mode distribution, campaign age + advance cadence (weekly
ticks per real week), catch-up usage (weeks caught up per open).

### 1.4 Event approval rates (the owner's named ask — per-type, everywhere a human gates a thing)
The M10a/proposal queue: approve/dismiss/edit-then-approve rates BY OUTCOME TYPE (war
declaration, coup, faith event, calamity response…), time-to-decision, dismiss-then-undo rates.
Catch-up pauses: resolved-vs-abandoned, per pause cause. Canon events: apply vs preview-only
abandonment per event type. (Future, wired per engine as it ships: treaty acceptance rates per
term family; generosity-proposal responses under DM-gated modes.) Read: per-preset and per-
autonomy-mode — approval friction IS the autonomy-tuning signal.

### 1.5 Tuning telemetry (the distributed soak)
Per-advance coarse distribution snapshots (already the usage-telemetry branch's shape — extended):
arcs born by drama class per year-band, war frequency/duration bands, famine incidence,
mover-activity flags, governor deferral counts by class (once E0 ships), envelope-violation
sentinels (a campaign living OUTSIDE a design envelope is the single most valuable tuning row we
can capture — flagged coarsely, never with content).

## 2. EXTRACTABILITY + INTERPRETABILITY (the "robust enough to use" bar)
- **Typed, versioned, self-describing**: every event name + prop enumerated in the EVENTS map
  with a vocabulary pin (the existing contract-test pattern) AND a generated DATA DICTIONARY
  (docs/analytics-event-taxonomy.md regenerated from the EVENTS map by a script — the dictionary
  can never drift from the code; enforced by a freshness test, the architectureFreshness idiom).
- **The rollup tier**: analytics_daily_rollups extended with the v2 groupings — rollups are the
  ONLY surface any consumer reads (raw events are an implementation detail). Rollup shapes are
  versioned; a migration adds columns, never mutates semantics.
- **Export shapes per consumer**: tuning → the envelope-comparison report (JSON, machine-diffable
  against the design-envelope constants); construction → the demand report (ranked under-served
  terrains/cultures/stress types, first-edit tables, re-roll leaders); market → the quarterly
  aggregate pack (§4). One export script per shape, each with a schema doc + sample fixture.

## 3. THE THREE READS, CONCRETELY
- **TUNING**: live-vs-envelope dashboards per preset and flag-combo; the pacing governor tuned
  from real deferral rates; retune proposals cite rollup rows (constants get empirical receipts).
- **CONSTRUCTION**: the roadmap reads demand — if 'criminal-leaning' archetypes re-roll NPCs 3×
  the base rate, the NPC-coherence content is under-serving them; if desert configs are authored
  with custom content 2× the norm, the desert tables are thin. First-edit tables rank which
  generated facts users trust least. This turns content authoring from taste into evidence.
- **MARKET (sellable)**: see §4.

## 4. THE SELLABLE PACK (market data for worldbuilder buyers — with hard lines)
WHAT SELLS: aggregate market insights — archetype popularity curves, drama tolerance (preset/
flag adoption × retention), construction cadence, session rhythm, feature retention cohorts,
price-point behavior (tier mix, credit task mix), the "what DMs build" atlas (terrain/culture/
tier distributions), AI-assist adoption vs manual. Packaged as versioned quarterly reports +
(later) an API per DESIGN_AI_CONTROL_SURFACE §35.
THE HARD LINES (non-negotiable, walker-enforced): AGGREGATE-ONLY with k-anonymity floors (no
cell published under k=50 users / 200 campaigns — constants owner-tunable upward only); NO
campaign content, prose, names, seeds, or world data — market behavior, never worlds; id-free by
construction (the fingerprint inverse-sanitizer discipline extended: sellable rows are BUILT
from enums/bands/counts, so leakage is structurally impossible, not filtered); and a SEPARATE
CONSENT PLANE (§5) — being a user does not put you in the sellable aggregate.

## 5. CONSENT ARCHITECTURE (three planes, one machinery — consent v2 extended)
1. PRODUCT ANALYTICS (existing plane, existing defaults): operate + tune the product.
2. MODEL-DEVELOPMENT CORPUS (the AI plane per DESIGN_AI_CONTROL_SURFACE §31): campaign-level,
   OFF by default, revocable-with-deletion, sanitized slices.
3. MARKET-INSIGHTS AGGREGATE (NEW plane): its own line in privacy settings ("include my usage
   in anonymous, aggregate market research that may be licensed"), default set by owner decision
   (RECOMMEND: on-by-default IS defensible because the plane is k-anonymous aggregate-only, but
   the trust-first posture says OFF-by-default with an honest pitch — ⚠️ OWNER DECISION),
   revocable (future aggregates exclude; published aggregates are immutable by nature — disclosed
   plainly). Purge machinery: the consentTier stamping fix (the open lib-infra finding) is a
   PREREQUISITE and ships in this wave.

## 6. THE WAVE FOLDS IN THE OPEN FINDINGS (the analytics debt closes here)
lib-infra-2 (consentTier stamping → revocation purge works), lib-infra-3 (snapshot cap contract:
client sends ≤ server keeps, both sides pinned), lib-infra-5 (sessionId on envelopes + the
dogfood/elevated stamp — owner usage stops contaminating the corpus), lib-infra-6 (listMeta
egress projection finally wired or explicitly retired into DEAD_CODE disposition). The
usage-telemetry branch (6a8bfade) merges FIRST as the foundation commit.

## 7. CONSTITUTIONAL POSTURE
Zero/near-zero eager (enrich existing event props wherever possible; each genuinely-new event
name counted against the ~20B/name eager reality and budgeted in the wave report); no PII, no
deity names, no seeds, no prose — server-side clamps + the inverse-sanitizer discipline on every
new prop; consent-gated at capture AND at rollup; goldens untouched (analytics reads, never
feeds, the sim — an endogeneity law for data: TELEMETRY NEVER TUNES A RUNNING WORLD, only the
next release's constants).

## 8. SEQUENCING
A-WAVE (analytics v2 core): after the golden merge lands — telemetry-branch merge + the §6 debt
+ the §1.2-1.4 groupings + the dictionary generator + rollup extensions + consent plane 3
(pending the §5 owner default decision). AI-use events (§1.1) ship WITH each Surveyor stage.
Engine-coupled events (treaty rates, governor deferrals) ship WITH their engines (E0/W-PEACE add
their rows at birth — the registration-walker idiom extends: a new drama engine must declare its
telemetry rows or document exemption). The sellable pack's first quarterly cut: after 90 days of
v2 data post-launch.

## 9. THE INTENT-ALIGNMENT CORPUS (owner directive: match conversational meaning to what users
## want, and train the compiler on how to use OUR engineering)
The corpus's unit is not the prompt — it is the ALIGNMENT TRIPLE: what the human MEANT, what the
compiler DID, and what the engine COULD HAVE DONE. Captured per Surveyor interaction (plane-2
consent, off-by-default, sanitized slices):
- UTTERANCE (sanitized) → the compiler's LABELED INTERPRETATION (required/inferred/optional/
  uncertain/protected) → the OP PLAN → the human's CORRECTIONS → the accepted plan → 7/30/90-day
  retention of the result.
- **CORRECTION TYPOLOGY** (the interpretability key — every correction is classified): misread
  requirement (heard the words wrong) / wrong mechanism (right goal, wrong engine primitive) /
  right mechanism, wrong magnitude (dial error) / over-inference (did more than asked) /
  under-inference (missed a necessary implication) / protected-constraint graze. The typology
  distribution IS the compiler's report card per stage, and each class trains a different fix.
- **THE ENGINEERING MAP** (the "how to use our engineering" half): every accepted plan records
  intent-class → engine-primitive(s) used (which ops, flags, constants realized it). Aggregated,
  this becomes the INTENT→PRIMITIVE ATLAS — the empirical dictionary of how human worldbuilding
  language maps onto THIS engine's capabilities. It serves three masters: compiler training
  (few-shot/fine-tune substrate), documentation (the atlas IS the Surveyor cookbook), and
  ENGINE ROADMAPPING — intents that repeatedly map to NO primitive (the compiler's honest
  "unsupported" confessions, §AI-4) are a ranked backlog of missing mechanics, straight from
  the market's mouth. Manual users feed the same atlas: when many users respond to the same
  situation with the same hand-built op cluster, that cluster is a candidate macro/primitive.
- Eval discipline per DESIGN_AI_CONTROL_SURFACE §34: splits by campaign/user, never by prompt.

## 10. THE AUTONOMOUS TUNING LOOP (owner directive: AI auto-tunes weekly, without the owner)
YES — inside the trust model, with a hard two-lane split. The loop (a scheduled weekly agent):
1. INGEST: the week's rollups — live distributions vs design envelopes, governor deferral rates,
   approval-friction rates, envelope-violation sentinels.
2. DIAGNOSE: rank divergences (a constant whose live distribution sits outside its design
   envelope across many campaigns is a tuning candidate; receipts cite the rollup rows).
3. EXPERIMENT: candidate constant nudges run against the DETERMINISTIC SOAK BATTERY in sandbox
   (never a live world — the data-endogeneity law §7 is absolute): full gate + envelope suites +
   the cacophony soak on the candidate values.
4. SHIP, two lanes:
   - **LANE A — AUTO-APPLY (pre-ratified)**: constants the owner has marked `autoTunable` with
     a RANGE, a MAX-STEP-PER-WEEK, and REQUIRED-GREEN envelopes. Within those rails the agent
     commits the nudge itself (branch + full gate + auto-merge on green), with a receipt
     ("famine incidence ran 8% over envelope across 214 campaigns; FAMINE_PRESSURE_K 0.42→0.40,
     max step 0.02, soak green"). Bounded, monotone-stepped, reversible, receipted — the ratchet
     philosophy applied to tuning.
   - **LANE B — PROPOSAL-ONLY (everything else)**: any golden-shifting constant, any structural
     change, anything outside rails, or any change to the rails themselves → a tuning-proposal
     branch + a one-page report queued for one-click owner review. GOLDEN LAW UNCHANGED: no
     golden regenerates without the owner's signature, ever — the agent may PREPARE the regen
     evidence, never apply it.
5. REPORT: the weekly WORLD HEALTH REPORT regardless of action — distributions vs envelopes,
   what auto-applied, what awaits, what's drifting slowly. Silence is never ambiguous.
MECHANISM: a scheduled cloud routine (the existing scheduled-agent machinery — one command to
create when the layer ships) running the Fable/Opus split: the routine diagnoses + proposes;
implementer agents execute lane-A commits under the full gate. GUARDS: the autoTunable registry
is itself walker-tested (a constant cannot become auto-tunable without range+step+envelope
declared); lane-A total weekly drift is capped realm-wide; three consecutive weeks of same-
direction lane-A steps on one constant force-escalates it to lane B (a trend that persistent is
a design question, not a nudge). SEQUENCING: needs Analytics v2 + E0's envelopes live; the
routine is created at launch+2 weeks (first meaningful data), owner rails ratified once at setup.
