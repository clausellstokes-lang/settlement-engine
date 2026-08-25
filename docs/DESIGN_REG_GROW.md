# DESIGN_REG_GROW — BUILD-BY-REPLAY: the growth model that makes the map its own history

**Chair-authored (Fable), 2026-08-25, under §632.3's mint and §585's mandate. Status:
ARCHITECTURE — skeptic panel next, then the Opus build. Vetoable throughout.**

## §0 · The convictions this architecture answers (all measured, none speculative)

| # | Conviction | Evidence |
|---|---|---|
| C1 | The engine grows OUTWARD past a standing circuit; intramural holdings FALL 1,414→883 between year 100 and the present while the suburb rises 64→536 (509 untyped) | REG-4 differential, §632.3 |
| C2 | The population arm cannot hold the circuit still — wall extent re-derives per population (365k→300k→349k→222k across one band) | REG-4 differential arm 1 |
| C3 | Time snapshots show near-zero growth: year-018 ≡ year-100 parcel-for-parcel | Convention audit (§639), growth-morphology row 1 |
| C4 | Growth rings are illegible and partly inverted — the oldest center is the sparsest ground | Audit row 2 (verifier: COVERED only by this mint) |
| C5 | "Organic plan" settlements render as jittered rank-and-file combs | Audit rows (street-network + growth) |
| C6 | No linear/row village form can occur; sub-town growth is always a round nucleated cluster | Audit row 5 |
| C7 | A 512-soul village carries named urban quarters | Audit row 4 |
| C8 | Decline shapes are real but THIN: 96 % of 200 seeds are monotone growth; FADE 5 · SACKED 3 · BOOM-BUST 0 · PLATEAU 0 | REG-T census |
| C9 | `populationHistory` is ABSENT on every generated record; the year series is a RECONSTRUCTED extent trajectory, not a recorded one | REG-T §2 |

**The diagnosis under all nine:** the fabric derives built form from the PRESENT plus a
few dated anchors, then *reconstructs* the past by interpolation. Reconstruction cannot
grow, cannot ring, cannot decline, cannot hold a wall still — it can only shade the
present backward. C1–C7 are one defect wearing seven costumes.

## §1 · The principle: BUILD-BY-REPLAY

The settled cure is to invert the derivation: **the present-day map becomes the FINAL
FRAME of a deterministic, year-indexed growth replay**, seeded entirely by recorded
truth. One process, three products:

1. **The map** — the replay's last frame (what ships on every surface).
2. **The snapshots** — intermediate frames, free and correct by construction (C3 dies).
3. **The film** — the replay rendered with beat pacing (L-REG-20..22). The Chronicle
   stops being an assembly problem: **L-REG-26's timeline annotations are the replay's
   own emissions.** "We are treating this like dwarf fortress builds a map" (owner)
   becomes literal: the builder and the historian are the same process.

**REG-F0 rescopes**: the backfill wave was chartered to reconstruct appearance years for
elements built without them. Elements built by the replay carry their years natively;
F0 shrinks to the pre-GROW legacy layers (chrome, relief, water) and the walker that
proves totality.

## §2 · The truth boundary (THE PROMISE analysis)

**Inputs (recorded truth, immutable):** the stored settlement record — present
population, tier stamp, founding year, dated events (sieges, sacks, disasters,
wall-raisings), site and water. **Where the record is silent on the year-to-year
population path, the trajectory comes from REG-T2's minted shape vocabulary** —
typed curves (MONOTONE · PLATEAU · BOOM-BUST · FADE · SACKED-NEVER-RECOVERED, per the
REG-T classifier) whose parameters are tuning-class constants (owner signs at the
tuning pass, LAST) and whose selection is seed-deterministic under L-REG-24's age–arc
coupling. The trajectory is DERIVATION, never stored; a regenerated map replays the
same curve from the same seed. **Canon honesty (A6):** replay-interpolated years are
stamped `interpolated`, recorded events `recorded` — the film's canon-honesty scan
already governs this. Lived history never moves; no stored field changes; the engine's
advance loop is untouched. This is fabric-side derivation, the same L0-derived class as
§631's band reconcile — a declared same-seed shift in a core nothing has shipped.

## §3 · The growth kernel

Epoch loop from founding to present. Per epoch, in order:

- **3a · Trajectory step.** Population for this epoch from the record or the T2 curve.
- **3b · The circuit law (cures C1/C2).** Walls are DATED OBJECTS: raised at their
  recorded (or derived-then-frozen) epoch, they persist as history thereafter — the
  extent NEVER re-derives from the built umbrella once raised (C2 dies). While a
  circuit stands and has capacity: growth is INTRAMURAL INFILL — plot subdivision,
  rear-range densification, court infill — under a saturation threshold (chair-minted,
  tuning-surface). Beyond saturation: **typed extramural emission only** (faubourg at
  gate / road ribbon / bridgehead, consuming the existing `faubourg.kind` machinery,
  REG-4's geometry). Sprawl — untyped extramural growth — is structurally impossible,
  not merely penalized. The REG-4 differential becomes the kernel's own exit.
- **3c · Origin-typed accretion (cures C5/C6, feeds §640.2).** Growth form is a TYPED
  ORIGIN, not a jitter parameter: **organic accretion** (plot-by-plot along ways,
  T-junction dominance, market-street widening) · **planned foundation** (a dated act
  laying a perch-module plot series at once — Tewkesbury-class regularity is LAWFUL
  when and only when the history holds a founding/extension act) · **linear/green/row
  village forms** as site-and-road-derived types at sub-town tiers. ⚠ The form
  vocabulary is PROVISIONAL pending R-MORPH (§640.3) — the kernel's SLOTS are
  architecture; the type census that fills them waits for the sourced dossier.
- **3d · Ring truth (cures C4).** Accretion order IS age. The center is oldest and
  densest (infill keeps working it); rings emerge, they are not drawn. A ring census
  (§6) proves monotone age-from-center within tolerance.
- **3e · Decline replay (serves C8, feeds REG-D).** A falling trajectory step runs the
  kernel backward IN EFFECT, never in mechanism: thinning (abandonment marks on the
  least-tenable plots), subdivided grandeur, the high-water circuit left oversized —
  emitting the dated states REG-D will dress (hf379 ladder) and L-REG-27's
  reclamation-by-growth triggers on re-advance. REG-T2's mint gives decline arcs at
  meaningful rates; the kernel gives them geometry.
- **3f · Quarter minting (cures C7).** Named quarters are emergent labels EARNED at
  tier thresholds (density + institution count), never pre-assigned — a 512-soul
  village has neighborhoods at most, and the label appears in the epoch the place
  earns it (a film beat for free).
- **3g · Timeline emission (L-REG-26).** Every body, way, wall, and label emits
  {appearanceEpoch, accretionOrder, originType, provenance: recorded|interpolated}
  into the changeManifest as it is created. The film assembles; it never reopens.

## §4 · What the kernel does NOT do

No engine changes (worldPulse, lifecycle, saves untouched). No stored-field writes. No
name generation (L-REG-29). No new institution SITING logic (REG-SITE's charter; the
kernel places growth mass — the siting weights ride on top). No hinterland mosaic
(REG-H, R-MORPH-gated). No dress (REG-D and the ink layers own appearance).

## §5 · Performance envelope

The replay must fit §583's first-paint budget (20–30 s cached city; 60 s absolute max,
rare). Envelope: epochs are BANDED (≤ ~40 replay steps for the oldest metropolis —
year-bands widen with age, narrow at dated events so beats land exactly); per-step
work is incremental (only the growth delta computes); the final frame must cost no
more than ~1.5× today's single-pass build (measured exit, not asserted). If the
measure busts the envelope, the fallback is chartered ahead of need: replay the
GEOMETRY at full fidelity but band the epochs coarser for sub-town tiers (thorp
milliseconds law, §608). The film replays from the emitted manifest, never re-runs
the kernel.

## §6 · Instruments and exits (each with a convicting control)

1. **The REG-4 differential, re-run, MUST PASS**: circuit stands still across the
   sub-threshold band (C2), infill rises, through-wall = 0, sprawl = 0, typed faubourgs
   counted separately; `--break` still fails it.
2. **Snapshot-divergence census (cures C3 provably)**: year-K frames pairwise differ
   where the trajectory moved (plateau frames may agree — the control plants a known
   growth epoch and the census must red if frames are identical across it).
3. **Ring census**: age monotone from center within tolerance on organic-origin
   settlements; planned foundations exempt BY TYPE (their regularity is dated, §640.2).
4. **Form census**: the origin-type distribution over the 200-seed roster, reported
   against R-MORPH's bands once sourced (until then: reported, not gated).
5. **Determinism**: same seed ⇒ byte-identical replay, manifest included, double-run.
6. **Dormancy**: the kernel is flag-gated (`REG_FABRIC_OPTS.growReplay`); flag OFF ⇒
   29/29 byte-identical exemplars at the base seal.
7. **Timeline totality**: zero drawn elements without appearance data at the armed tip
   (the L-REG-26 walker, brought forward from REG-F's exit).
8. **Performance**: replay wall-time per tier, three samples, against §5's envelope.
9. **The zero-growth DIAGNOSIS (opening act, before any build)**: establish exactly why
   year-018 ≡ year-100 today (which stage discards the year; REG-4's probe showed both
   at 1,046 parcels vs the present's 1,016) — the kernel must cure the mechanism, not
   the symptom.

## §7 · Build plan (two cars, sequenced per §639.3)

- **REG-GROW-A**: the diagnosis (§6.9) · the epoch loop + circuit law + intramural
  infill + typed emission (3a/3b) · timeline emission (3g) · exits 1/2/5/6/8. The
  differential passing IS the car's definition of done.
- **REG-GROW-B**: origin-typed accretion + ring truth + decline replay + quarter
  minting (3c–3f) · exits 3/4/7 · R-MORPH-gated form census wiring. REG-T2's curve
  mint rides with B (its shapes are B's trajectory input where records are silent).
- Then the conformance block (REG-ROUTE onward) builds on grown parcels, per §639.3.

## §8 · Open questions for the skeptic panel

P1: Does replay-vs-reconstruction break any §18.4-class machinery that READS the
present backward (marketColonization's age gate, deriveHighWater)? P2: Is the §5
envelope honest for a metropolis at corpus grain? P3: Does the T2-curve-where-silent
design respect §161-era rulings on reconstructed series (REG-T §3's CASE analysis)?
P4: Is 3e's "backward in effect" sufficient for REG-D, or does decline need first-class
kernel mechanics? P5: Anything in the audit's growth family this misses?


---

# AMENDMENT A1 — the five-skeptic panel folded in (§643; 0/5 refuted, 7 blockers ruled)

The panel's verdict: the inversion is SOUND — "§240's 'each circuit traced from ITS OWN
EPOCH'S fabric' is the replay's contract stated four waves early." Every blocker is
ruled here; the build brief reads the body PLUS this amendment, and where they
conflict, A1 wins.

## A1.1 · THE CENTRAL RE-SHAPE (rules S4-B1, S5-B, and M1 in one move):
**the kernel is a PRE-STAGE that produces a GROWTH LEDGER; buildFabric stays
single-shot.** The replay computes an append-only, year-indexed ledger — per epoch:
population, circuit events, plot-set deltas, typed emission acts, loss regions,
quarter mints — as pure data, BEFORE the pipeline runs. The existing single-shot
pipeline (lawClaims built ONCE, circuit ahead of the ground law — the banked
composition laws stand untouched) consumes the ledger's FINAL state as a declared
input. **An intermediate frame is the SAME single-shot pipeline run on the ledger
truncated at epoch K** — prefix-closure holds by construction because the ledger is
append-only; each frame is one lawful construction. Consequences: the snapshot/inertia
machinery (`settlementAtYear`, population-held-constant, `snapshotYears`) is
SUPERSEDED by ledger truncation at cutover — its pins retire with a declared shift;
frames are rendered ON DEMAND (the map = final frame; the film renders its beat frames
at film time), so the §5 envelope re-bases honestly: **ledger computation ≤ ~2 s at
metropolis (pure data, no drawing); the final frame ≤ 1.3× today's measured build
(city 1.29 s); film frames ~1.2–1.5 s each × ~20 beat frames sit INSIDE L-REG-20's
30 s floor.** An op/byte exit at the signed pins joins §6 (the panel found city already
at 10,008/10,000 pre-kernel — §635.2's 10,100 absorbs it; the kernel measures again).

## A1.2 · THE TRAJECTORY LAW (rules S1-B, S4-B2, S2-B1): **no invented history.**
The sealed code's own law binds ("the snapshot does not invent a trajectory… §11.10
forbids by name"; "every mark cites its source or is not drawn"). Therefore: **a T2
curve is a CONSTRAINED INTERPOLANT, never an author** — pinned through (present C,
deriveHighWater's P as the SOLE peak deriver, and every down-step anchored to a
RECORDED, dated, severity-graded loss event per REG-T §3's CASE discipline). Where the
record holds no loss events the curve is MONOTONE — no fabricated famines. Decline
FREQUENCY is therefore an ENGINE-generation question (how many dated events worlds
mint), owner-visible at the tuning pass — never fabric-side invention. **REG-T2's mint
rides CAR A** (formally amending §624.3's separate-car charter, reasons recorded in
§643): car A's trajectory input is thereby defined on every seed. Provenance carries
THREE honest values: `recorded` (a dated event) · `interpolated` (spacing between
anchors, L-REG-19's class) · `derived-frozen` (wall epochs and their kin) — the
two-value enum was schema starvation.

## A1.3 · THE ANNOTATION SCHEMA (rules S2-B2, S3-B): §3g is REPLACED — the kernel
emits **A6.1's minted schema module VERBATIM**: per-element {appearanceEpoch,
withinEpochOrder, disappearanceYear?, provenance, beatEvents[]} plus the
transient-element channel; the manifest carries the obligation's file, never the data.
Decline is expressible (disappearanceYear, DEBRIS/RECLAMATION beats) from car A's
first emission. **Car A carries the per-wave totality walker with its
planted-omission control** (A6.1's own law — not deferred to car B).

## A1.4 · RECLAMATION IS FIRST-CLASS KERNEL MECHANICS (rules S3's majors): a
**LossRegion object** with its own state machine — born at a RECORDED disaster
(monotone seeds included: 192/200 seeds carry dated disasters with no trajectory
fall — debris never keys to falling population), persisting as landscape fact
(L-REG-27), with per-epoch growth-front contact tests: front arrives ⇒ staged
breakdown (consuming ground back into capacity — §614.1's "needs the room" feedback);
front retreats ⇒ frozen mid-bite; **two clocks kept separate**: hf379's decay ladder
is TIME-driven on the abandoned; recovery is PRESSURE-driven, never time. Late hf379
stages (under-the-plough furrow wrap, the path dog-leg) are KERNEL GEOMETRY — later
epochs' field mesh and ways REACT to the footprint; REG-D dresses states, it does not
invent them. REG-D's dependency row updates to consume ledger emissions (program-doc
edit rides §643). Banding is EVENT-DENSE, not uniform: bands narrow at dated events
and at steep trajectory segments (the 30 %-in-6-years metropolis gets its frames), and
a monotone band-splitting rule caps per-band change (direction: split until no band
moves more than a chair-set fraction of extent).

## A1.5 · THE REMAINING SEAMS, EACH WITH ONE OWNER (rules S4's majors): `epochAxis`'s
deriveEpochs becomes a READER of ledger circuit events (one wall authority; its
OUTGROWN_SHARE economics become the kernel's raise heuristic where no wall event is
recorded; the ≤4 fabric-epoch ceiling is a RENDER vocabulary — kernel bands map onto
at most 4 drawn epochs, no throw); §18.4's marketColonization becomes a ledger
CONSUMER (one infill clock; the kernel's capacity accounting excludes the square);
faubourg origins are stamped AT EMISSION by the kernel and `deriveFaubourgOrigins`
becomes the VERIFIER (generator writes, reader checks — its disagreement is a census
red); compile.js reads the curve for population-peaks (§161g's consumers see the real
peak count); C3's cartouche/population wiring at snapshot leaves is an explicit car-A
exit (the frame's cartouche prints the frame's population, not the present's).
Unwalled fabric (pre-circuit and never-walled tiers) grows under the SAME accretion
law with the founding frame constituted at epoch 0 from site + roads (the form
typology applies from birth); the circuit law binds only where a circuit exists.

## A1.6 · GATES AND ARMS: car B's form-typology census consumes **R-MORPH's dossier
(now delivered)** at weights grade — Durham's two-row default licenses the linear
form; exact constants stay unminted until fetched-CONFIRMED or owner-signed (§642.2's
grades). The L-REG-28 accessible-lens arm joins BOTH cars' exits (the A5.2 all-waves
row — the body's §6 omitted it). The §110.3 declared-shift discipline covers BOTH
shifts: the kernel landing, and any later owner-signed T2/tuning constant change
(second shift, declared at signature time — never silent).

---

# AMENDMENT A2 — THE SPINE RECONCILIATION (§675)

**DESIGN_SPINE body+A1 is the authority; where this document's body or A1 conflicts,
the spine wins.** By name: A1.1's "buildFabric stays single-shot [byte-wise]" and "the
existing single-shot pipeline … stand untouched" clauses are SUPERSEDED by SPINE
A1.4's EPOCH FOLD (the ledger stays pure data; the partition constructor folds its
epochs in one single-shot stage; frames = the fold on the truncated ledger). The car
plan reads: **GROW-A RESUMES ON THE PARTITION** (its S0 ledger modules + the T2
constrained-interpolant mint + the seam conversions that survive: §18.4 as ledger
consumer, compile.js peaks, the frame cartouche); **GROW-B IS DISSOLVED** — origin-
typed accretion, ring truth, quarter minting and decline replay are SPINE construction
steps (spine §3b/3d/3f), and the ring/form censuses are spine §6 exits. Exits re-home
per A2b (superseded here by name: 1 and 5 to SPINE-1, 2 to SPINE-2); the dormancy flag family is
ONE (`REG_FABRIC_OPTS.partition` — `growReplay` folds into it); §5's performance
envelope is superseded by the spine's pinned protocol (A1.6). §1's REG-F0 rescope
aligns to A13.2's statement. The word "partition" in DW-program contexts means the
STOREY partition — in this program and the spine it means the PLANAR partition;
documents must disambiguate on contact.

## A2b — VERIFIER CORRECTIONS (§677): exit re-homes read **1 and 5 to SPINE-1; exit 2
(snapshot divergence) is SPINE-2's** (its charter carries it). KBA reading clause
(this document's equivalent of A13.4): every KEEP-BUT-ANNOTATE row reads "true as
written; figures inherited from the pre-partition base RE-MEASURE AT THE SLOT that
consumes them" — sharpest instances: §6.6's 29/29 exemplar base and §6.9's
zero-growth diagnosis, which is **DONE and never re-runs** (SPINE §5: "its diagnosis
is this design's premise"; laneGROWA-receipt.md is the record).
