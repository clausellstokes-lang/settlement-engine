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

## SEQUENCING + LANES (after Round-3 cycle-1 waves F3/F4 close)
LANE V-A engine-dark: V-6 biome · V-7 heirs (dormancy proofs).
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
