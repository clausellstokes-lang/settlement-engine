# RIBBON V5 — CONSOLIDATED SPECIFICATION UNDER D5 (Lane V5-C counsel, 2026-08-15)

STATUS: counsel deliverable, ZERO src changes. Advisory; every judgment vetoable.

PROVENANCE — what this consolidates and where each piece lives:
1. **The SOUND V5 spec** (2026-08-04, chair-verified SOUND after ten findings closed) —
   RECOVERED THIS PASS by transcript replay (the /tmp originals were purged; 8 Writes +
   59/59 Edits replayed with zero failures from the wf_c4893530-c78 + wf_4a947db5-54e
   agent transcripts). Full text: `laneV5C-recovered-v5-spec-draft.md`, decisions rows
   1–19: `laneV5C-recovered-decisions.md`, receipts: `laneV5C-recovered-REVISION-NOTES.md`
   (same directory). This document INCORPORATES it BY REFERENCE and restates only what
   D5 changes. Where this document is silent, the recovered spec governs.
2. **D5, the photoreal directive** (owner, 2026-08-04 evening; memory
   ribbon-v5-direction.md) — supersedes the recovered spec's drawn-TEXTURE program;
   its STRUCTURAL layer survives (owner's own consequence list).
3. **The 13-asset generation run** (executed 2026-08-05, prompts recovered verbatim to
   `laneV5C-recovered-prompts.json`; model `nano_banana_pro` @ `4k` in every executed
   call) and **the cull lane's verdict** (2026-08-06, wf_6bb04a8a-c89: KEEP 5 slots /
   CUT 5 / HOLD 2). Asset dispositions: `laneV5C-ASSET-MANIFEST.md`.
4. **V4 law** (`docs/DESIGN_RIBBON_V4_SPEC.md` @ bd0439d1, CLOSED) — cited by section
   where its systems survive.

---

## §1 THE SURVIVING STRUCTURAL LAYER (unchanged by D5 — cited by name, binding)

D5's own consequence clause names the survivors: *layout geometry, ANCHOR_OFFSET,
two-state mechanics, hit targets, focus law, a11y, breakpoint law*. Concretely:

- **The composition law** — recovered spec PART 0 verbatim: the header is the bottom
  half of a cylindrical war arrow, axis on the viewport's top edge, arrow flying left,
  no complete silhouette owed anywhere. Reading order = flight order = product order
  (cartouche → lead whipping → three vanes → trail whipping → burned shelf → Sign In).
- **Lane geometry** — recovered spec §1b: the five-parameter table (ax/Lb/W/Db/Sg per
  lane: Create 372/30/188/34/4 · Library 470/26/220/46/5.5 · Realm 585/32/178/38/4.5),
  `dropX = ax + Lb`, `tx = ax + W`, the lap arithmetic (Create kiss 560 laps Library
  peel 496 by 64px = 33% of its 194px span; Library kiss 690 laps Realm peel 617 by
  73px = 50% of its 146px span), per-lane flight depths 11/13/12 under the 13px cap.
  Under D5 these are the CUT-AND-PLACEMENT coordinates for the photo sprites, not
  drawn-path parameters — same numbers, new consumer.
- **ANCHOR_OFFSET law** — recovered spec PART 3 + V4 heritage: the hang is PAINT,
  never layout; the bar's layout height is `CHROME.headerDesktop` in both states;
  `ANCHOR_OFFSET = CHROME.headerDesktop + SP.xxl` stays the single-writer derivation,
  never pinned as a sum. ⚠ D5 SHARPENS the svg-viewbox hazard (memory:
  svg-viewbox-becomes-layout-height): a photo layer is an `<img>`/CSS image with a
  HUGE intrinsic size (4K masters). **Every photo layer is position:absolute,
  inset-anchored, zero intrinsic contribution — a decoration must never price its
  container.** The existing structural pin idiom (navDividers: absolute + inset-0 +
  parent relative + no height property in any spelling) extends to every photo layer.
- **Two-state mechanics** — recovered spec PART 3, with D5's owner answer (3) slotted
  in: REST (scrollY ≤ 8) and FLIGHT (scrollY ≥ 40) with hysteresis, one discrete
  threshold, never a scroll-linked morph; `prefers-reduced-motion` = instant swap.
  D5 replaces path interpolation with a **240ms crossfade between pre-generated
  rest/flight sprite variants** — simpler than the `d:path()` arm the drawn spec had
  to hedge on; the cross-fade IS now the primary mechanism, not the fallback. The
  crossfade is gated on the flight variants being loaded; unloaded = instant swap.
- **Hit targets + focus law** — recovered spec PART 3 / R2 verbatim: hang is
  pointer-events:none decoration; generous DOM rectangles over label + upper vane
  (rest ≈ 0–66px tall, flight ≈ 50px); focus rings rectangular, never clipped
  (clip-path clips rings — the measured law; photo sprites are aria-hidden layers, so
  nothing focusable is ever inside a clipped/matted element).
- **A11y** — the standing pattern, now load-bearing for EVERY glyph on the bar: all
  lettering is photograph, therefore **typed text lives behind every lettered asset**
  (visually-hidden run in each control + aria-label; COPY_ONLY carries the wordmark).
  The drawn-vs-typed equivalence pin becomes the **manifest equivalence pin**: the
  asset manifest records each lettering asset's EXACT text; a test asserts each
  control's typed text === its manifest row (the photo can't be grepped — the
  manifest is the bridge, and the generation-time spelling gate is its intake proof).
- **Breakpoint law** — recovered spec PART 3 MOBILE + F9 disposition verbatim: every
  geometry claim measured at 1440 AND 640 AND 390; **the 640 receipt is still OWED AT
  BUILD** (the 640 composition is a design decision the counsel does not own); mobile
  hang caps 24px rest / 8px flight; mobile keeps the two-row bar, burned tabs stay
  off the phone bar (bottom nav owns those routes).
- **HEADER_RIDERS machinery** — per-rider ink extents, polarity field, riderFloorTone
  survive as MACHINERY; every ROW re-measures on the composited photo ground (§4).
  The ground-move law binds (memory: ribbon-ground-move-foreground-break-class):
  this is the FOURTH ground move, and the class's cure is a full rider census plus
  EXTENDING the negative-control list in tests/design/contrast.test.js, never
  replacing it.
- **What D5 retires from the recovered spec**: the drawn-texture rendering program —
  cell texture (comb/sheen/splits/fray as drawn marks), the drawn barring rhythm and
  its alpha caps, the drawn char/singe/gilt construction, WARP_RATIO/FORESHORT as
  AUTHORED transforms (§3), and the drawn-mark texture-budget ratchet in its ink-%
  form (§5 re-rules it). The GEOMETRY those systems decorated survives as above.
  Decisions rows 1–19 keep their standing except as amended in §6.

## §2 THE D5 COMPOSITION LAW — what each layer IS as a photo asset

The header becomes a **composite of alpha-cut photographs** in the same z-order the
drawn spec pinned (z ascends into Realm; thread under blades; indicator over all).
Layer table (asset IDs = the manifest's; verdicts = the 2026-08-06 cull):

| z | layer | asset | source generation | state variants |
|---|-------|-------|-------------------|----------------|
| 0 | the half-barrel ground | A1 SHAFT strip | `df26dabf` (idx 1) KEEP | one (both states) |
| 1 | cartouche band (frame + lettering + wax O) | A2 | `7b6e3ea7` (idx 5) KEEP | one |
| 2 | seal rungs (16/30/40px) | A5 | `a396fc06` (idx 13) KEEP | one, downscale ladder |
| 3 | lead + trail whippings | in A1's band or kept drawn | — | one |
| 4–6 | vane sprites ×3 (Create → Library → Realm paint order) | A3/A4/R1 | `01f373de` KEEP / `a03f1f63` HOLD / re-gen replacing `d932cdd5` | REST + FLIGHT each |
| 7 | fletch labels (Create/Library/Realm) | A6/A7 | `1fc18808` + `70dd2304` KEEP | rest + active |
| 8 | burned tabs strip (Compendium/Gallery/About) | R3 | re-shoot per `54727e25` HOLD finding | rest; active per §2c |
| 9 | quill-line active indicator | DRAWN (gilt bar) | — | per-route |
| 10 | Sign In | DRAWN (existing gold button) | `e2cf5c2a` CUT | existing |

**§2a THE CROP LAW** (owner's own discipline, D5 verbatim): every barrel-mounted
asset is generated as the FULL horizontal object and CROPPED to the bottom half —
"cropping is still more reliable than prompting the cut." The crop line runs through
the shaft's AXIS (the lit crest sits above center in A1 precisely so the bottom-half
crop keeps the brightest band at the cut — the cull's stated reason A1 is the one
usable ground). Each asset's manifest row records its crop-line y in master pixels;
re-crops re-record the row (no silent nudges — the crop line is the composition's
horizon and moving it moves every seated object).

**§2b THE Z/SHADOW SYSTEM** (D3 half-arrow depth law, photo form): the one warm
upper-left light (the estate's 225°) is **baked into every generation by prompt** —
all 13 executed prompts pin "one warm directional sunlight from the UPPER LEFT, soft
true shadows falling down-and-right," so intra-asset shading, AO and material truth
arrive photographic. What photography CANNOT bake is the shadow one layer casts on
another (a vane on the shaft strip, the seal's contact on its band): **inter-layer
shadows are the compositor's**, authored as soft translucent shapes per the recovered
spec's PART 2 depth table (vane cast d 4.1–5.8 blur 5; seal contact blur 1.2, cast
d 1.6; collar cast d 1.2; burns cast NOTHING — a burn is in the surface), all falling
down-barrel at the one azimuth. The scroll-shot reference (`e359c5c5`) stays the
ratio canon: most of its realism is shadow, not detail. **The contact-shadow skirt
of each vane sprite ships IN the sprite** as a separate multiply sub-layer cut from
its own generation (the feather sheets were generated ON shaft with true contact
shadows — keep them; they are the pendant cure's strongest witness), so the sprite
seats itself and only the DOWN-BARREL cast is authored.

**§2c STATE GRAMMAR** (in-material, D4 + owner answer 2): fletch active = A7 label
variant + the drawn gilt quill-line along the active lane's bound run (top edge, both
states — the V4 "no active paint below the vane" pin survives verbatim). Tab active =
the SAME strip with a gold remap derived in post (see J-V5C-5 in the report: variants
whose glyph geometry must not jiggle are derived from ONE master in the pipeline,
not generated twice), plus the drawn slant-cut underline in the quill-line grammar.
Hover = the post-derived warm step (≤120ms). All state variants are STATIC FILES —
no runtime filters on photo layers (determinism, §5).

**§2d SIGN IN** stays the existing drawn gold button seated by the depth system
(recovered decisions row 15). The generated brass plate (`e2cf5c2a`) is CUT — the
cull's read is adopted: it is the retired maker's plate reborn and out-shouts the
wordmark. An action, not a place; not photo material. Vetoable (report OQ5).

## §3 FONT-CURVES-WITH-BARREL under D5 — the warp is now photographic truth

D3(3) demanded lettering that curves with the barrel, legibility outranking. The
drawn spec answered with authored constants (WARP_RATIO 0.0105, FORESHORT 0.94) and a
measured legibility ladder. Under D5 the curvature arrives IN the photograph — the
model wraps lettering onto the barrel it renders (the "and word"/"burns and words"
reference panels are the read being matched). The authored constants therefore
RETIRE as transforms and RE-ENTER as **acceptance bounds at intake**:

- a lettered asset's measured bow (sagitta/chord of its baseline) must be > 0 (flat
  lettering on a barrel fails D3) and **≤ 0.021** — twice the drawn pin, the point
  the mockup ladder measured counters crushing at 13px. Reject and re-generate
  outside the window; never "fix" perspective in post (that is the fake-physics
  cure decisions row 12 forbids).
- the legibility gate outranks: each lettered asset must read at a glance at its
  1x composite size (owner glance-cull judges this; the typed-text layer means a11y
  never depends on the photograph).
- the FLETCH LABELS still take NO warp — they ride feather surfaces, not the barrel
  (the F6 deviation, named for the owner, carries over unchanged; the label
  generations are correctly flat-painted on feather).
- one asset-specific check: the tabs re-shoot (R3) must render its three words on
  ONE line riding the same curve — `78318121` failed exactly this (perspective
  convergence), which is why it was cut.

## §4 THE PENDANT-PROBLEM RESOLUTION — a testable criterion

The law (curation doc + standing verdicts): vanes must read as FLETCHING AT REST —
leading edge bound along the shaft — never hanging charms. The cull ruled it SOLVED
in the single-vane evidence (`01f373de` is the receipt: bare quill visibly ALONG the
wood before any droop, tip sweeping back to touch) and correctly narrowed the residue:
**every solved image is one vane; the pendant failure only ever appeared at three**
(`974a8d8`, the cautionary master). So the criterion binds at COMPOSITE, per vane,
in the REST state, measured on the composited pixels at 1x:

1. **The bound run**: each vane's quill is in contact with the shaft's lower rim for
   a continuous run ≥ its lane's Lb (26–32px at 1440) BEFORE any point of the body
   drops below the rim — contact meaning no daylight column between quill ink and
   shaft ink along that run.
2. **The return kiss**: each vane's tip contacts the shaft again at its tx (±3px
   jitter window); a vane whose ONLY contact is its binding is a charm — two
   contacts minimum (run + kiss), by construction of the sprite placement.
3. **The daylight bound**: mid-blade, the gap between quill and shaft rim is ≤ its
   lane's Sg (4–5.5px) — the measured constant that separated "three feathers" from
   "one festooned valance" in the geometry pass, now applied to sprite placement.
4. **The cluster check** (the unproven case): with all three placed, each crossing
   still shows its separation line — the SEPARATION LAW pin carries over verbatim:
   ≥1px seam or edge-light at ≥1.15:1 local contrast at every crossing, every
   peel-off showing its cut, in BOTH states. Photography supplies the seams
   (true lap shadows in the sprites); the pin verifies the composite kept them.

Clauses 1–3 are placement geometry (assertable from sprite boxes + alpha extents in
the build's design tests); clause 4 is the existing separation pin re-hosted. The
owner's glance at the v5-4 composite is the final authority (report OQ4).

## §5 THE TEXTURE-BUDGET RE-RULING (photographs are not ink) — PROPOSED, VETOABLE

The V4 texture budget rationed DRAWN ink: retina cues < 2% effective ink, tone-
structure thresholds, per-mark alpha caps. A photograph is 100% "ink" everywhere —
the ratchet's unit is meaningless on this surface. Proposed replacement, three laws:

1. **THE BYTE BUDGET** (replaces the ink budget as the thing that only shrinks):
   every header photo asset lands with an EXACT byte ceiling in the size manifest
   (the sizeBaseline exact-ceiling idiom — a re-encode that grows reds; deliberate
   growth re-records with rationale). Proposed program ceilings at first land,
   vetoable numbers: **1x rest-critical set ≤ 220KB total** (shaft, cartouche, seal
   strike, three rest vanes, labels, tabs); **full set with 2x + flight + active
   variants ≤ 550KB**. Format WebP-with-alpha (PNG only where alpha edges band);
   rest-critical set preloaded, flight/active variants fetched idle after first
   paint (the crossfade's loaded-gate, §1).
2. **THE CONTRAST LAW SURVIVES UNTOUCHED — with a new evidence bridge.** Photo
   grounds are not tokens, so arithmetic pins need recorded facts: at intake, each
   asset's manifest row records measured tone statistics for every region a rider
   reads against (tab char-bed L, label ground band L range, shaft band L range at
   the label seat). tests/design/contrast.test.js then pins ink-vs-recorded-ground
   arithmetic exactly as it pins token arithmetic today, and the build's screenshot
   pass verifies the recorded stats against composited pixels (the two-typechecker
   spirit: name the window AND the instrument). A re-encode/re-crop re-derives the
   stats — never patch one figure (the census re-record law). Floors carried over:
   labels ≥ 6.6:1 class on their measured ground; gold-on-char-bed ≥ 7.5:1 per
   glyph (measured 8.5–11.5:1 in the canon evidence); the mid-russet dead band
   stays prohibited for any ground a glyph reads against; wax stays red-family
   (hue ~3°, luminance ≥ 5× its char bed).
3. **DETERMINISM**: same-seed drawn identity becomes ASSET BYTE IDENTITY — the
   served files are fixed bytes (sha256 in the manifest); no runtime filters,
   no canvas processing, no non-deterministic loading order visible in paint.
   The two-load determinism pin (header outerHTML sha + screenshot sha identical
   across loads) carries over verbatim from the V4D receipts.

## §6 DECISION-TABLE AMENDMENTS (rows otherwise stand as recovered)

- Row 7 (branded-then-gilded) — AMENDED by the cull's evidence: the grammar is
  signed off as a TWO-VALUE gold ladder — #D4AF45 inside the char-framed cartouche,
  pale #E9CD70 for the small burned tabs (#D4AF45 measurably muds at tab size;
  `54727e25` is the value receipt). OQ1 presents this amended form.
- Row 11 (seal middle rung) — AMENDED per the cull: the 22–40px strike must be a
  MEASURED DOWNSCALE of the one physical seal master (`a396fc06`), never its own
  generation — the ladder is craft-true only if all rungs are the same seal.
- Row 12 (warp) — constants retire to acceptance bounds (§3).
- Rows 2/17/18 — their geometry and pins survive; their drawn-stroke MECHANISMS are
  superseded by photographic material (the pins now measure composited pixels).
- Row 15 (Sign In) — reaffirmed; the photo attempt is the new evidence FOR it.
- Deferral list unchanged; the 640 receipt remains owed at build.

## §7 VERIFICATION MAP (which existing suite proves what — no new test files)

- tests/design/contrast.test.js — §5.2 arithmetic on recorded stats; the ground-move
  negative-control list EXTENDED with the V4/V5-drawn tones that no longer clear on
  photo grounds (the history is the guard).
- tests/components/navFletching.test.jsx — layout pins: absolute/inset-0/no-intrinsic-
  height for every photo layer; ANCHOR_OFFSET derivation; two-state layout-box
  identity; hit-target rectangles; §4 clauses 1–3 sprite-placement geometry.
- brandLockup suite — manifest equivalence (typed text === manifest text per
  control); COPY_ONLY; seal register selection on CSS px.
- organicLogo census — any new module joins the declared-inliner set per its rules.
- Build-time screenshot pass — separation pin both states; §5.2 stat verification;
  two-load determinism; the three-breakpoint law incl. the owed 640.
⚠ Census discipline: the test census sits at its ceiling and new test FILES red two
censuses; the lighting census pins titles EXACT — the build extends existing files
and checks census consequences before adding any title.
