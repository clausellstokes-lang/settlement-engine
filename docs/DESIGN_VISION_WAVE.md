# DESIGN — THE VISION WAVE (owner-commissioned 2026-07-20: "do all of it according to
# your suggestion and our audience... comprehensively think them through and build it!
# then continue the loop.")

The owner's ruling LIFTS the scope freeze for THIS enumerated batch only; it slots
BETWEEN Round-3 cycle 1 and cycle 2, and cycle 2 resurveys these builds as loop
substrate. Audience law for every choice below: the DM preparing tonight's session,
the DM at the table, and the solo player with no DM at all. Every item ships a
SHIPPABLE CORE (mechanism + surface + pins); recorded follow-ons stay in this doc.
The constitution applies in full: dark flags, dormancy byte-identity, single-writer,
schema wall, eager budget, no golden re-mints, no death, secrets seam.

## V-1 THE INTERVIEW — ask the world, get cited truth
WHY (audience): the mid-session question ("why does the temple hate the guild?") is
the moment DMs reach for improvisation and worlds go incoherent. Answering from STATE
WITH RECEIPTS is the product's deepest moat made touchable — no raw LLM can cite.
MECHANISM: a new AI surface behind the EXISTING Surveyor door + credit metering (no
new entitlement surface). Grounding = the aiGrounding bundle + entity-resolved slices
(beliefs, obligations, ladder, provenance rows for referenced names via the existing
name maps). Response contract (schema wall): { answer, citations[{ref, kind}],
confidence } — every citation must RESOLVE to a real ledger/news/provenance record
(server-side validation rejects phantom refs); UI renders receipt chips → V-4
cause-walk. Uncited sentences render in a visually distinct "conjecture" register —
the product never dresses guesses as truth.
V1 CORE: settlement + realm-event scope; citation-resolution validator; conjecture
styling; metered + gated + kill-switch like every AI surface. FOLLOW-ON: multi-hop
questions, campaign-wide scope. PINS: schema validation · every-citation-resolves ·
entitlement gate · dark-without-keys inert.

## V-2 THE CHRONICLER'S LETTER — session prep in five minutes
WHY: prep time is the DM's realest cost; the letter converts simulation depth into
weekly value. This is the retention surface.
MECHANISM: DETERMINISTIC composition (no AI required): per-campaign lastReadTick →
diff of news/beats/transitions since → grouped (wars/courts/trade/traditions/mercy),
prioritized by the existing significance tiers, rendered in the house voice as a
chronicler's letter. Optional AI dressing rides the existing metered surfaces.
Printable/exportable.
V1 CORE: the letter panel + lastReadTick store field (persisted, lifecycle-traced:
regen/undo/import) + deterministic composer + empty-diff grace. PINS: same-seed
letter golden · lastReadTick survives persist/undo · empty state.

## V-3 THE TIMELAPSE — scrub the realm's history
WHY: the most demo-able artifact the product can produce; makes "the world LIVED"
visible in ten seconds. Marketing and delight in one lazy chunk.
MECHANISM: no per-tick world snapshots exist (correctly — too big); the track derives
from PERSISTED history: populationHistory rings + wizardNews events + war/peace/
prosperity transitions → a compact TimelineTrack (built lazily per campaign) → an
sf-bridge overlay layer (the travelers-overlay idiom) with a scrubber: event pulses +
settlement tint interpolation (population/prosperity bands) across ticks.
V1 CORE: scrubber + event pulses + tint bands, realm view only. FOLLOW-ON: per-
settlement drill, export-as-clip. PINS: track derivation deterministic golden ·
overlay lazy (closure Δ0 eager) · bridge origin-audited.

## V-4 THE CAUSE-WALK — click the coup, find the famine
WHY: receipts culture as EXPERIENCE; the trust story in one gesture. (Pulls forward
the §10 "cross-advance chronicle reader / provenance unlock" — the owner's order
supersedes its post-launch parking.)
MECHANISM: from any news/chronicle row with provenance, "trace the causes" opens the
chain view walking the provenance DAG backward, each hop with its receipt; graceful
"the ledger holds no deeper memory of this" at roots/absent-flag.
V1 CORE: backward chain list + receipts + deep-link from Interview citations. PINS:
resolution over a lit fixture DAG · absent-flag grace · secrets seam (no covert leak).

## V-5 THE CORPUS FACTORY — content density through the wall
WHY: the corpus (institution descs, NPC voice pools, tradition motifs, prose variety)
is the thin layer vs the engine; the fix is the door you already built, used
editorially. AI drafts; the OWNER'S TASTE remains the canon gate (unchanged law).
MECHANISM: a STAGING catalog (src/data staging area + candidate records with
provenance: model, prompt family, date) + an authoring run surface (existing AI panel
idiom, metered) + a review/approve panel; APPROVE folds candidates through
gen:compendium-data into canon (the registry lifecycle honored).
V1 CORE: staging store + authoring surface + review/approve → regen path; batch runs
are owner-triggered (keys). PINS: staged-never-canonical-without-approval ·
compendiumDataFreshness green · provenance on every candidate.

## V-6 BIOME TRUTH — the map's knowledge reaches the prose
WHY: the two crowns stitched; a road scene through tundra should KNOW it. Cheap depth.
MECHANISM: canonize-time biome extraction per settlement + route leg from the FMG
save's biome cells (via the existing sf-bridge/export data path) → stored on the
spatial digest (additive keys); road scenes, travel news, and the letter pull
biome/season texture lines from a small in-register corpus. Absent biome ⇒ exact
current behavior (byte-identical).
V1 CORE: extraction + digest fields + road-scene/news texture reads. PINS: absent ⇒
byte-identical · extraction deterministic · walker/EXEMPT for any new key.

## V-7 HEIRS-LITE — succession with a face
WHY: courts feel mortal without dynasty scope creep; the sub-century window gains
stakes ("who follows the old lion?") that DMs can play against.
MECHANISM (dark flag heirsEnabled, default-absent): each governing-faction seat
resolves a DESIGNATED HEIR deterministically (strongest bond among faction eligibles,
codepoint tie-break); on the EXISTING succession events (challenge/coup — no new
death paths, ever) the heir takes the seat and inherits a bounded fraction of the
predecessor's bonds/grudges marked inherited:true (the memory carries, dampened);
investiture news beat. Single-writer: all inside the ladder kernel's own pass.
V1 CORE: heir resolution + inheritance-on-succession + beat. PINS: dormancy
byte-identity · inheritance bounded + marked · no new succession triggers ·
conservation (rungs remain a permutation).

## V-8 THE PATIENT ENGINE — worker-threaded advances
WHY: a century advance should feel like a chronicle being written, not a frozen tab.
Audience: the "simulate 50 years" moment must be a pleasure.
MECHANISM: the domain engine is pure/deterministic → run multi-tick advances in a Web
Worker (message protocol: progress per tick, streaming news), store applies results
on completion; capability-detected with the sync path as fallback (flag).
V1 CORE: worker harness + progressive UI for multi-tick advance + fallback. THE PIN
THAT MATTERS: worker vs sync SAME-SEED BYTE-IDENTITY (the determinism claim must
survive the thread boundary). Plus: no engine import touches window/document (scan).

## V-9 THE LIGHT ENTRANCE — customRegistry de-eagering (owner order lifts the gate)
WHY: ~41KB off first paint; the budget headroom funds every future surface.
MECHANISM: the recorded lane — sync→async persisted-path conversion with the seam
pinned to the kernel; the de-eager lane's discipline (parity pins, no behavior shift).
V1 CORE: the conversion + reclaim. PINS: parity goldens · closure delta recorded ·
lifecycle paths (load/regen/undo/import) round-trip.

## V-10 THE CERTIFICATE — trust as a visible feature
WHY: nobody else CAN run a 300-year soak; saying so honestly is marketing that
compounds. Claims-parity law: the surface never claims what the soak hasn't proven.
MECHANISM: a certification manifest schema (seed/config band → soak results) + a
World Certification panel + seed-badge rendering; INERT-HONEST until the owner's soak
writes the first manifest ("the hundred-year proving is scheduled" state).
V1 CORE: manifest schema + panel + honest pending state. PINS: no-claim-without-
manifest (claims-parity) · manifest schema validation.

## V-11 THE FOUNDRY BRIDGE — meet the table where it plays
WHY: distribution; the play surface owns the session, we own the world beneath it.
MECHANISM: a world-export format (JSON, secrets-seam-aware: DM/player variants) + a
thin Foundry VTT module (new top-level foundry-module/, its own minimal gates like
public/map) importing the export as journal entries + scene links; v1 = manual
export/import (read-only), live sync = follow-on.
V1 CORE: exporter + module skeleton + import + docs. PINS: export secrets-variants
(player export leaks nothing covert) · exporter deterministic.

## V-12 THE TRUTH SERVER — MCP under everyone else's AI
WHY: the judo against LLM erosion — instead of fighting the ChatGPT habit, become
the receipts-bearing truth layer their AI reads. (The perimeter posture inverts by
OWNER CHOICE here; local-first keeps it safe.)
MECHANISM: an MCP server package (mcp-server/, stdio) over a LOCAL world export:
read-only tools get_settlement / get_npc / search_events / ask_ledger, every response
carrying receipts; no cloud, no keys, no write path — the wall holds (external AIs
read, never write).
V1 CORE: the package + 4 tools + docs. PINS: read-only guarantee (no mutating tool
exists) · secrets-seam on served data · schema-valid outputs.

## V-13 THE SEED POST — a world in a sentence
WHY: virality native to the product's physics: a seed IS a world. Share code →
anyone regenerates the identical world client-side. The gallery becomes a commons.
MECHANISM: share code = versioned encode(seed + config preset) → /world/<code> route
regenerates locally (no server state needed); gallery gains featured/curated flags
(admin-set) + browse-by-featured. Comments remain post-launch (unchanged).
V1 CORE: encode/decode + route + gallery featured. PINS: code round-trip · identical-
world golden (code → same digest) · route lazy.

## V-14 THE ORACLE — the solo player's GM
WHY: the underserved market (Mythic/Ironsworn solo players) with no incumbent; the
sim already computes what oracles fake. World-true answers, no AI required.
MECHANISM: an Oracle surface: seeded draws (own rng stream) ANSWERED FROM STATE —
yes/no weighted by the relevant ledgers (asking "is the road safe?" reads embattlement
truth), scene prompts composed from active stressors/beliefs/contests (road-scene
idiom), complications drawn from live ledgers; every answer shows its world-truth
basis (receipts culture). AI dressing optional via existing metered surfaces.
V1 CORE: yes/no + scene prompt + complication draws, deterministic, receipt-noted.
PINS: own rng stream (stream-isolation) · deterministic same-seed draws · reads-only.

## V-15 THE AGED MAP — the town wears its history (owner: "add it in", 2026-07-20)
WHY: crown 1's endgame — a map that BEARS its own past. A district that boomed
visibly thickens; a calamity's scar lingers in the fabric; the urban fabric layer
already knows more than the map shows. No competitor's map remembers anything.
MECHANISM: an AGE OVERLAY derived from PERSISTED history (populationHistory deltas,
calamityHistory, upswing/reconstruction events, urban fabric state) → per-district
age marks: growth thickening (building-density tint/infill), calamity scars (a
lingering mark with a half-life measured in decades), reconstruction patina; rendered
as a town-map layer (the map-styles idiom, lazy) with a "show the years" toggle; the
V-3 timelapse scrubber drives it backward. DERIVED-ONLY (never mutates stored
layouts; the upgrade-restores law holds); deterministic from history.
V1 CORE: growth thickening + calamity scars on the v1/v2 town map + the toggle.
FOLLOW-ON: street-level wear, district renaming echoes. PINS: derivation
deterministic golden · stored layouts untouched (byte-identity) · toggle-off ⇒
exact current render · lazy (closure Δ0).

## V-16..V-18 + R-1..R-10 — COMMISSIONED (owner rulings 2026-07-20: "for the rest,
## add it into scope!" + the R-1 finite-semantics exchange)

### THE FINITE-SEMANTICS LAW (owner doctrine, ratified this exchange — binding on
### V-16/V-17/V-18/R-1 and every future input surface)
Players have unlimited freedom; the world's memory of that freedom is FINITE. Every
effect that touches the engine is a TYPED record from the closed edit-kind vocabulary
with BOUNDED magnitude. Free text is FLAVOR ONLY: stored verbatim on the receipt
(the DM's own words) and fuel for AI polish — NEVER mechanics. The AI's role at input
surfaces is BUCKETING CLERK, never writer: it proposes {kind, targets, magnitude}
from the closed vocabulary via the schema wall; the HUMAN confirms; only the
confirmed typed record writes. Table-authored events carry provenance source:'table'
(receipts distinguish world-authored from table-authored; the soak excludes 'table').

### R-1 → THE SESSION LEDGER (commissioned in the owner's bucketed frame)
Typed table-event kinds (a SMALL closed set mapped to existing engine effects:
incident/obligation/bond/stressor-relief/legitimacy-nudge/exposure), bounded
magnitudes, free-text flavor field per the law above; the clerk flow (free text →
proposed buckets → DM confirms → typed commit through pendingEdits/
COMMITTABLE_EDIT_KINDS). Pins: no free-text reaches mechanics (source scan on the
new kinds' apply paths) · source:'table' provenance · registry lifecycle honored.

### V-16 THE AUSPICE — consequence preview (the purity dividend)
"Read the auspices" before committing a decree/table event: advance a THROWAWAY copy
N ticks (the pure engine makes this cheap; worker-hosted per V-8), summarize via the
V-2 Letter composer, DISCARD. Never persists; clearly labeled an omen, not a promise
(the soak's tuning can shift futures — honesty note in the UI). Pins: preview leaves
ZERO trace on the real world (byte-identity before/after) · deterministic preview.

### V-17 THE CAMPAIGN IMPORT — bring your table's history
Paste/upload existing campaign notes → the bucketing clerk proposes a typed event
backfill (per-event human confirmation, batched UX); confirmed events enter as
source:'table' history at DM-chosen ticks. The adoption unlock. Pins: the finite-
semantics law scan · no unconfirmed event writes · import is resumable/abortable.

### V-18 THE DM SCREEN — the table's desktop face
Letter + Oracle + dossier in one at-the-table layout with a PLAYER-SAFE second face
(the secrets seam as a display mode; pairs with R-3's phone companion). Pins:
player face leaks zero covert marks (the V-11 player-export pin reused).

### R-2..R-10 (commissioned; lane placement)
R-2 curated first seeds → editorial batch after V-B (the Letter/timelapse make seed
audition cheap) · R-3 table companion (read-only mobile: Letter/dossier/Oracle) →
rides V-B/V-C surfaces + a responsive pass · R-4 world book (bound-book PDF) → V-B
follow-on over the PDF pipeline · R-5 a11y-first arc → cycle-2 dimension mandate
(B+→A+ named per surface) · R-6 temperament presets → config presets over the tempo
governor (V-B adjacent) · R-7 portability covenant → covenant page + claims-parity
pin · R-8 engine's-own-chronicle changelog → process (docs), starts at PUSH#1 ·
R-9 contradiction bounty → covenant page + support-surface line · R-10 seed-diverse
goldens → ONE-REGEN protocol amendment (recorded for the owner's regen step).

### SEQUENCING AMENDMENT
The commissioned additions slot AFTER lanes V-A..V-E as LANE V-F (session ledger +
auspice + DM screen + presets + covenant/bounty pages) and LANE V-G (campaign import
+ world book + curated seeds + table companion responsive pass); R-5/R-10 ride
cycle 2 and the regen protocol respectively. Cycle 2 resurveys ALL of it.

## R-11..R-30 — THE EXHAUSTIVE SWEEP (recorded 2026-07-20; owner ruling same day:
## "do it all" — ALL COMMISSIONED. Lane assignments: R-11/12/13 → cycle-2 prevention
## intake as recorded · R-16/R-17 → V-B riders (World-Deepened + shareable letter) ·
## R-14/R-18/R-19 → V-D riders (crash forensics seed+tick+flags, worker paranoia mode,
## save museum corpus+pin) · R-15 → V-I (the tuning-band manifest, per-flag proposed
## bands) · R-20..R-24 → NEW LANE V-H (command palette · undo-history surface ·
## designed empty states · error-copy register · name-collision audit) · R-25..R-30 →
## NEW LANE V-I (load-test harness+runbook [RUNS against prod = owner] · status page ·
## restore-drill runbook · AI spend alarm [key-inert] · The First Hundred page ·
## creator kit assets + public roadmap page fed from the vNext ledger). Publication/
## execution against live infrastructure stays owner-gated as always; everything
## code-complete and inert-honest in-repo.)

### Tier 1 — cycle-2 structural-prevention intake (class-prevention of REVIEWED classes;
### joins the earlier four: load-normalizer walker · async-totality lint · courier seam
### registry · determinism lint widened; plus fixture-realism law + refuter-cite check)
R-11 ANACHRONISM LINT: the house voice as machinery — a deny-vocabulary scan (modern
  idioms, %, 'okay', design-jargon) over user-facing strings (the content-2 §-leak
  class generalized; en.js + beat composers + prose pools in scope).
R-12 PER-CHUNK SIZE CEILINGS: the eager closure is ratcheted; LAZY chunks are not — a
  per-chunk budget manifest (ceilings at measured+margin) so no lazy chunk quietly
  becomes the next 1.8MB vendor-pdf.
R-13 TICK-TIME BUDGET GOLDEN: runtime perf has no pin — a reference-world per-tick
  wall-time band (generous, CI-advisory) so an O(n²) coupling regression is caught
  before the soak.

### Tier 2 — small riders on already-commissioned Vision lanes (recommend folding in)
R-14 CRASH FORENSICS BY CONSTRUCTION (rider on Wave-E error boundary + V-8): the error
  report captures seed + tick + flags + build hash (NEVER world state) — determinism
  makes every user crash locally reproducible from four small values. No competitor
  can have this; it is the determinism dividend applied to support.
R-15 TUNING-BAND MANIFEST (rider on the soak protocol): pre-declare target
  distribution bands per coupling/flag (contest rates, bond saturation, festival
  cadence) BEFORE the soak — turning tuning from taste-reaction into
  contract-verification; the F3/V-A flags each ship a proposed band.
R-16 'THE WORLD DEEPENED' LETTER (rider on V-2 + the regen): the post-regen one-time
  in-product letter announcing the newly-lit layers in the chronicler's voice — the
  flag-lighting becomes a product MOMENT, not a silent diff.
R-17 SHAREABLE LETTER (rider on V-2/V-13): export the chronicler's letter as a
  styled image/PDF — every week's session prep doubles as a social artifact.
R-18 WORKER PARANOIA MODE (rider on V-8): a dev-only flag running sync+worker in
  parallel and diffing — continuous self-verification of the determinism claim.
R-19 SAVE MUSEUM (rider on lifecycle dimension): a committed corpus of REAL
  historical save files from each schema era; the load path must accept every
  exhibit forever (the tolerant-loader claim, pinned against reality).

### THE FREE-INTERVIEW TASTE — owner ruling 2026-07-20: CONDITIONALLY PARKED.
The manager's recommendation (a capped free taste of V-1, ~3 questions/world, as the
conversion moment) is ACCEPTED IN PRINCIPLE but activation is GATED ON capital +
proven unit economics ("I'll have to wait until I have enough capital and proof that
I can sustain that free service even if capped"). NOT a rejection — a sequencing
ruling. When revisited, two cost-bounding shapes are pre-designed: (a) a HARD GLOBAL
MONTHLY POOL for the free taste (fail-closed via the existing burst-gate + R-28
spend-alarm machinery — the tap becomes a fixed marketing budget the owner sets, and
an empty pool degrades honestly in the house register), and (b) the ZERO-COST
variant available ANYTIME: precomputed sample interviews on the curated first seeds
(R-2) — canned questions answered once at authoring time with REAL receipts, served
statically; the receipt experience demonstrated at zero marginal cost. (b) needs no
capital and could ride V-C/R-2 whenever the owner nods.

### Tier 3 — owner queue (product/UX judgment calls, each cheap)
R-20 COMMAND PALETTE (cmd-K): jump to any settlement/NPC/panel — power-DM speed.
R-21 UNDO HISTORY SURFACE: the byte-exact undo exists engine-side; give it a visible
  history affordance (trust made touchable).
R-22 DESIGNED EMPTY STATES: first-open / no-campaign / feature-dark states get the
  same craft as full states (the ten-second first impression).
R-23 ERROR-COPY REGISTER: user-facing error strings routed through the copy registry
  (voice-consistent failures; i18n door stays open).
R-24 NAME-COLLISION AUDIT: realm-scale settlement/NPC name dedup verification (the
  faction dedup precedent extended).

### Tier 4 — launch ops (before or at launch; owner-executed with recipes)
R-25 EDGE LOAD TEST: a k6-style pass on the AI + checkout functions at expected
  launch burst (the burst gates are built; prove the ceilings hold).
R-26 PUBLIC STATUS PAGE + incident template (the runbooks' public face).
R-27 RECURRING RESTORE DRILL: the backup/PITR verification on a calendar, not once.
R-28 AI SPEND ALARM: daily spend telemetry thresholds alongside the per-user gates.

### Tier 5 — go-to-market seeds (zero mechanics, high leverage)
R-29 THE FIRST HUNDRED: founding cohort acknowledgment page (community seeding).
R-30 CREATOR KIT + PUBLIC ROADMAP: press/creator asset bundle (curated seeds,
  timelapse clips, screenshots) + a public roadmap page fed from the vNext ledger.


## V-19 THE FINDABLE TRUTH — lane V-J (owner-commissioned 2026-07-20: raise
## dimension 14 to A/A+ IN the building phase)
WHY: the SPA's client-only rendering caps discoverability at B — deep links unfurl as
the homepage (unfurlers do not execute JS), client JSON-LD is crawler-invisible, and
the compendium funnel stops at per-tab URLs. All repo-controlled; V-13's seed-post
virality DEPENDS on per-world unfurls.
MECHANISM: (1) post-build PRERENDER of every public route to static HTML with
route-specific <head> (OG + description + JSON-LD) baked; SPA hydrates over it;
zero eager bytes, zero new servers. (2) META-SHELL unfurl endpoint for dynamic
links (gallery worlds, /world/<code>) + the existing og-image card — a shared seed
unfurls as ITS world. (3) PER-ENTRY compendium routes — the route-derived sitemap
fans the long tail automatically. (4) PINS: a dist-walking build test asserting
per-route og:title/desc/image + schema-valid JSON-LD; sitemap==router; the Wave-D
AI-crawler directives verified not to block legitimate search bots.
SEQUENCING: first free lane slot AFTER V-I (its pages join the prerender) reading
V-E's share-code format. Worktree vision-j (claude/vision-j) provisioned.
PINS carry the grade: unfurls enforced, never hoped.


## V-20 UNLISTED SHARING + V-13/V-19 AMENDMENTS (owner-commissioned 2026-07-20,
## the three gallery rulings)
1) V-19 SHARPENED (owner wording): EVERY individual gallery link unfurls with a
   rendered thumbnail (the og-image card of the map/settlement/campaign) + a
   caption/description derived from the item's own data; plus the polished generic
   site card for bare-domain shares. 2) V-20 UNLISTED SHARING (settlements, maps,
   campaigns): visibility {public | unlisted}; unlisted = reachable ONLY by exact
   link — CRYPTO-RANDOM unguessable slug (never sequential), absent from every
   public list/browse, noindex + sitemap-excluded (V-J pins), but unfurls normally
   when pasted (the party-share story); owner can REVOKE by slug rotation (old links
   die). RLS: public lists WHERE visibility='public'; unlisted readable by exact
   slug lookup only, never listable BY NON-OWNERS; AMENDMENT (owner 2026-07-20):
   the OWNER'S OWN GALLERY still shows their unlisted items — owner alone — with a
   dedicated PRIVATE/UNLISTED FILTER for easy location and an at-a-glance unlisted
   badge; pin the PAIR (owner-sees-own-unlisted AND non-owner-listing-never-
   contains-unlisted), both executed in pglite. Migration WRITTEN-NOT-DEPLOYED
   (standing law). 3) V-13 FEATURED AMENDED:
   per-section Featured (settlement / map / campaign), HIDDEN-UNTIL-OCCUPIED (an
   empty Featured never renders — the no-fake-names honesty), admin-only RLS write,
   explicit display-order field. Build host: lane V-E (already building the gallery
   featured flags + RLS census — one coherent gallery migration, not two).

## SUPERSEDED — original recorded-not-commissioned list (kept for the record)
R-1 THE SESSION LEDGER (my strongest recommendation): DM-authored table events as
  first-class committable edits — "the party saved the granary" enters the world
  through the EXISTING pendingEdits/COMMITTABLE_EDIT_KINDS machinery, with receipts,
  and the simulation reacts. Closes the product's one missing loop: the world feeds
  the table, but the table cannot yet feed the world. Retention + emotional lock-in.
R-2 CURATED FIRST SEEDS: an editorial set of opening seeds whose first decade tells a
  legible drama (a famine→mercy→friendship arc; a coup brewing) so a new user
  WITNESSES depth in their first ten minutes. Conversion lives or dies here.
R-3 THE TABLE COMPANION (mobile ruling): read-only phone mode = the Letter + dossier
  + Oracle at the table; authoring stays desktop. Answers the queued mobile-scope
  question with the audience's actual moment.
R-4 THE WORLD BOOK: a bound-book PDF export (chronicle + dossiers + maps + receipts
  appendix) — the keepsake artifact DMs gift and tables treasure; the PDF pipeline
  exists, this is composition.
R-5 A11Y-FIRST AS MARKET POSITION: the receipts/text-first architecture makes truly
  screen-reader-navigable worldbuilding POSSIBLE — a commitment no competitor can
  follow; finish the B+ → A+ arc and say it publicly.
R-6 TEMPERAMENT PRESETS: curated flag/tuning bundles ("a quiet march", "an age of
  storms") over the tempo governor instead of raw dials — preset-as-product.
R-7 THE PORTABILITY COVENANT: full world export/import, local-first, no lock-in —
  mostly true today; make it an explicit public promise (claims-parity enforced).
R-8 THE ENGINE'S OWN CHRONICLE: the public changelog written in the chronicler's
  voice — dev-log as product content, community-building at zero marginal cost.
R-9 THE CONTRADICTION BOUNTY: invite users to report any receipt that fails to trace
  — a world-coherence bug class turned into confidence marketing.
R-10 SEED-DIVERSE GOLDENS: at THE ONE REGEN, widen golden families to a seed corpus
  (not single configs) so distribution honesty is pinned across many worlds.

## SEQUENCING + LANES (after Round-3 cycle-1 waves F3/F4 close)
LANE V-A engine-dark: V-6 biome · V-7 heirs (dormancy proofs).
LANE V-B displays additionally carries V-15 THE AGED MAP (commissioned same day).
LANE V-B displays: V-2 letter · V-3 timelapse · V-4 cause-walk · V-10 certificate.
LANE V-C AI/authoring: V-1 interview · V-14 oracle · V-5 factory.
LANE V-D platform: V-8 worker · V-9 de-eager.
LANE V-E ecosystem: V-11 foundry · V-12 mcp · V-13 seed-post.
Serialized through the minifold worktree (V-E's new top-level dirs may parallelize
only if file-disjoint staging is verifiable). Full gate per lane; ledger row per lane;
THEN Round-3 cycle 2 resurveys the whole enlarged product to convergence.

## OWNER-GATED RESIDUE (unchanged by this ruling)
Keys/pricing for the new AI surfaces (Interview/Oracle dressing ride existing
metering; owner confirms placement) · the soak itself (V-10 stays inert-honest) ·
Foundry/MCP PUBLICATION (packages built in-repo; publishing is the owner's) · corpus
CANON adoption (taste gate) · heirsEnabled ONE-REGEN membership · pushes/deploys.
