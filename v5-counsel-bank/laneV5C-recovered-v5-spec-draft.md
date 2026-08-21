# RIBBON V5 — THE HALF-ARROW AT REST (counsel spec draft, 2026-08-04)

OWNER DIRECTIVES BOUND: D1 the organic hanging fletching (thin full-width shaft; three
large asymmetric aerodynamic vanes hanging below; each drooping then sweeping back UP to
kiss the shaft at its OWN attachment point; visible thread at every contact; organic
asymmetric overlap encoding Create→Library→Realm; a leading cut at the cluster's left;
**the full-parallelogram / dead-straight-edges ruling is RETIRED**). D2 the wordmark as a
cartographer's cartouche with the SEAL visible and prominent in the O of Forge, the
silhouette-plaque fitting inside the shaft in the WoW-badge manner. D3 THE HALF-ARROW
DEPTH LAW: the header is the BOTTOM HALF of a cylindrical arrow, axis on the viewport's
top edge; half-barrel shading; depth as a SYSTEM (contact/AO/cast from the one light);
THE LETTERING CURVES WITH THE BARREL, legibility outranking the warp. D4 THE BURNED
REFERENCE TABS: every non-fletch, non-auth tab reads as branded into the wood, curved
with the barrel, hover/active in-material.

CHAIR RULINGS BOUND: R1 two-state scroll header · R2 decorative hang, generous
rectangular hit targets, rectangular focus rings · R3 barred grey-goose palette with full
rider re-census · R4 oversized seal-o breaking the lettering line, ladder-registered ·
R5 size-laddered cartouche (simplified at header scale) · R6 cartographer's roman with
swash capitals, ornament in the frame, blackletter rejected at header scale.

NANO BANANA REFERENCE SET BOUND (chair curation + verdicts, V5-NANO-BANANA-REFERENCES.md):
depth/light canon = the scroll shot; burned-frame + gold-fill cartouche at header scale;
torn gold-leaf silhouette at large registers; oversized seal-in-O with device (triangle
impression nearest the estate device); burns-and-words pyrography as burned-tab canon;
spiral lengthwise binding added to the vocabulary; THE PENDANT PROBLEM as law;
blackletter at large registers only; grey-goose palette with the barring RHYTHM as
pattern target. All eight images were opened and studied; the uncurated eighth (single
angled fletch-cluster, warm parchment) is identified and folded (§1f).

Mockup receipts: v5-rest.png · v5-scrolled.png · v5-cartouche-closeup.png · v5-mobile.png
(throwaway HTML v5-mock.html, headless Chrome 1440×900 dsf1 and 390×844 dsf1; geometry
and palette real, texture approximated). REVISED 2026-08-04, second pass: the critic's
ten findings F1–F10 are closed in these same files; the finding → fix → receipt map
with the measured numbers is REVISION-NOTES.md. ⚠ Headless-Chrome measurement hazard logged:
`--window-size` clamps to a 500px minimum layout viewport, so the 390 mobile shot is a
crop unless the page self-constrains — the mock wraps the mobile state in a 390px column;
any future mobile render harness must pin `window.innerWidth === 390` or emulate, never
trust the flag (CONFIRMED: innerWidth reported 500 under `--window-size=390`).

---

## PART 0 — THE COMPOSITION LAW (what the bar IS, restated for V5)

The header is **the bottom half of a cylindrical war arrow whose axis lies exactly on
the viewport's top edge**. Everything visible is the underside of one turned cedar
shaft, cut lengthwise by the frame and cut again at both frame edges. The arrow flies
LEFT (vane lap ascends into Realm; air flows tail-ward to the right): the head is
off-frame left, the nock off-frame right, and the frame owes the composition **no
complete silhouette anywhere** — partial, frame-cut objects are the design language.
That is the whole-arrow answer (P4, below) and every element serves it:

    [head, off-frame] ── bare shaft ── THE CARTOUCHE BAND (wrapped, top edge cut)
    ── lead whipping ── THE THREE HANGING VANES (bound, drooping, kissed, tied)
    ── trail whipping ── bare shaft ── THE BURNED WORDS (Compendium · Gallery · About)
    ── Sign In (the one mounted fitting) ── [nock, off-frame]

Reading order equals flight order equals product order: the brand at the front of the
fletching (where a fletcher stamps the shaft — confirmed by the uncurated eighth
reference), the journey (Create feeds Library feeds Realm) at the center, the reference
shelf burned into the tail, the account fitting last.

---

## PART 1 — STRUCTURE + COLOR

### (a) The half-barrel (P8 first half)

**The V4 cylinder ladder IS the D3 half-barrel, re-labeled, with not one stop moved.**
SHAFT_SHEEN → SHAFT → SHAFT_BODY → SHAFT_EDGE → SHAFT_RIM at SHAFT_STOPS
{lit 0.09, mid 0.38, body 0.95, edge 0.98} — under D3 these fractions now read as
fractions of the VISIBLE RADIUS (axis at y=0, silhouette rim at y=bar). The physics
agrees: a lower half-cylinder under the estate's one upper-left light (PLATE_LIGHT_DEG
225) is brightest at the cut (surface normal toward the viewer/light) and falls with
cos-acceleration into the silhouette — exactly the curve SHAFT_CYLINDER already paints.
JUDGMENT: reuse the ladder verbatim rather than re-deriving a "true" Lambert ramp —
every AA receipt on this bar (the lit-stop confinement above all rider ink, the L ≤ 0.13
body commitment, the mid-russet dead-band prohibition) is quoted against these exact
stops, and a re-derivation would re-open every one of them to buy an invisible
difference — say "veto" to flip it.

The three wood tiles (grain seed 7, growth seed 11, pores seed 13), the woodTile
builder, WOOD_TILE 320×64, GRAIN_AMP's direction proof, sRGB declaration, and the
darkening-only law all survive verbatim. The texture-complete law survives: V5 adds NO
new texture layer to the wood.

### (b) The vanes (D1; P5) — geometry

Three organic feather blades hang below the shaft. Each blade is defined by five
authored parameters per lane plus unitHash jitter (integer hash, no transcendentals —
the brand byte-identity law extends to the band):

    lane      ax    Lb   W    Db   Sg     (px at the 1440 reference; stored as
    Create    372   30   188  34   4       shares of the cluster box in code, since
    Library   470   26   220  46   5.5     preserveAspectRatio="none" stretches x)
    Realm     585   32   178  38   4.5

- **ax** — the lead attachment: where the quill's BOUND RUN begins on the shaft.
- **Lb** — the bound run: the quill lying visibly ALONG the shaft's underside rim,
  rachis stroke on it, pinned by spiral crossings. THE PENDANT LAW made geometry:
  every vane's leading edge is bound along the shaft before anything droops; a vane
  whose attachment reads as a point is a charm, and the pin asserts Lb ≥ 24px-equivalent.
- **W** — the kiss offset from the ATTACHMENT: the tail kisses the shaft at
  tx = ax + W (±3 jitter), so the blade span from peel-off is W − Lb, and the
  peel-off itself is **dropX = ax + Lb** (defined here once; every lap number below
  uses these). **Db** — belly depth below the bar.
  **Sg** — the quill's sag below the shaft mid-blade. ⚠ Sg is deliberately SMALL
  (4–5.5px): the first two mock iterations measured the failure — at Sg 9–13 the
  daylight gap under the shaft chains the three blades into one festooned valance
  (screenshotted, rejected); at Sg ≤ 6 each quill hugs the shaft and the cluster reads
  as three feathers. The bound quill, gentle sag, and returning tip are what put
  daylight between this spec and BOTH the pendant image and the hanging-vanes image.
- The blade: leading CUT face at the peel-off (the fletcher's knife cut — the
  "leading cut at the cluster's left" is Create's, first in reading order). The cut
  face SLOPES back (foot at ~11% of the span, ~0.66·Db deep) with a 1px v-NOTCH at
  the peel corner, so every crossing opens a WINDOW above the successor's cut in
  which the predecessor's thin tail and its collar stay visible — the separation
  law's geometry (below). The lower edge runs near-parallel to the quill (blade,
  not swag; length:depth ≈ 4.5–5.5:1, the reference feathers' own ratio), belly
  deepest at ~62% of the run, then a long thin TAIL BLADE with a ROUNDED under-turn
  (the references' tapered round tip) rising to kiss the shaft at (tx, rim). The
  lower edge is authored as ONE knot spline per blade — a single writer feeding the
  silhouette, the lower-cut whisper, AND the fray anchors, so no lower-edge
  consumer can drift off the cut (the fray ticks start 1px inside the fill and
  cross it by construction).
- **The kiss + the tie (P5):** at each tx a COMPACT TWO-TURN COLLAR (≈6×10px, WRAP
  tones, one tie-off diagonal + nub) pins the tip against the shaft. ⚠ NOT a full
  barrel whipping: the mock measured three full-height bands as a picket fence across
  the cluster (rejected). The two 10px cluster whippings (lead + trail) remain the only
  full-height thread objects, reusing ShaftWrap's entire system — 2.6px WRAP_TURN
  period, running-sum stops, WRAP_BARREL neutral multiply with the @supports fallback,
  tie-off diagonals, all pinned as today.
- **The spiral lengthwise binding** (verdict addition; historically attested — silk
  whipping at ~6 turns/inch spiraling the fletching length is documented English war
  arrow practice, and Henry V's silk order for Agincourt is on the record): TWO visible
  crossings per bound run, 13px apart, crossing the quill at the rim (y from bar−9.5 to
  bar+0.8), thread-true tones (WRAP_EDGE under, WRAP_GLOSS crest). Deterministic:
  positions from unitHash(seed + run·97 + k·31), jitter ±1.5px.
- **The lap encoding (the arithmetic closes):** each kiss lands INSIDE its
  successor's sag bay, 30–50% into the successor's blade span. Concretely, from the
  table: Create's kiss (tx = 560) laps Library's peel-off (dropX = 496) by 64px =
  33% of Library's 194px span; Library's kiss (690) laps Realm's peel-off (617) by
  73px = 50% of Realm's 146px span. Each tail blade slides visibly UNDER the
  successor's leading face and its collar sits on bare shaft in the successor's sag
  bay, seen through the cut-face window. Paint order Create → Library → Realm
  (z ascends into Realm, unchanged from V4): Create feeds Library feeds Realm, read
  at the two crossings. Realm's tail kisses free before the trail whipping.
- **THE SEPARATION LAW (pinned, BOTH states):** the cluster may never fuse into one
  silhouette — the flight state is where it died in the first draft, so the law is
  a flight-state invariant, demonstrated on the scrolled receipt, not deferred to
  build. Machinery, all deterministic: (a) a seam-shadow (the lap crevice) under
  every leading cut and along the first third of every rising upper edge; (b)
  edge-light on every leading cut (0.50-class at rest, 0.70-class opacity in
  flight) and every tail turn (0.38-class); (c) the peel-off v-notch; (d) per-lane
  fills one ladder step apart and per-lane FLIGHT depths 11/13/12 (all under the
  13px cap) so the flattened silhouettes stagger; (e) thread — collars and spiral
  crossings — painted UNDER the blades: at rest each collar stays visible in its
  successor's open bay window, in flight the successor's pressed body covers its
  predecessor's collar, as the lap physically must. Measured at 1x on the receipts:
  crossing seam/edge line contrast 2.41:1 and 2.35:1 at rest, 1.61:1 and 1.87:1 in
  flight (Library-over-Create, Realm-over-Library). THE PIN: every crossing shows a
  ≥1px seam or edge-light line at ≥1.15:1 local contrast, and every peel-off shows
  its cut, in both states, at 1x.
- **Non-uniformity rules (deterministic):** the five parameters differ per lane as
  authored above; jitter windows (ax ±0, Lb ±0, W ±3, Db ±2.5, Sg ±1.5, belly-x ±5,
  kiss-x ±3) draw from unitHash streams keyed by lane seed {101, 211, 307}. No two
  blades share a depth, a run, or an angle; nothing is random.

### (c) The vane material (R3)

The FLETCH ladder survives verbatim (LEAD/VANE/TIP/BARB/SHEEN/SHEEN_LIFT/RACHIS/
SPLIT_LIT; the 6.60:1 parchment-label floor against SHEEN_LIFT unchanged). On it:

- the four-stop body gradient (lead → vane held → tip), the comb whisper at the V4C
  weights/opacities (0.32/0.42/0.52px at 0.13/0.20/0.27) with per-lane gap scaling,
  the blurred sheen bands (hash-placed, 2–3 per blade), the splits (two per blade,
  exposed edges only, calm-zone walked), the fray (short-and-many on the lower cut),
  and the lower-cut whisper rachis — all re-hosted on the organic silhouette with
  their budgets intact (texture-budget ratchet: every retina cue < 2% effective ink).
- **NEW, the barring RHYTHM** (chair verdict): 3 transverse band-PAIRS per blade — a
  lit run (SHEEN_LIFT at ≤ 0.38 alpha) leading a dark bar (TIP at ≤ 0.55), blurred,
  hash-placed in thirds, sweeping tailward with the comb lean — the war-arrow
  barring as a QUIET tonal rhythm inside the grey-goose ladder, never a printed
  stripe. THE ALPHA CAPS ARE MEASURED, NOT TASTED: the first draft's lone TIP bar
  at ≤ 0.14 computes 1.03:1 against the vane field — invisible by arithmetic,
  because on a near-black ladder a dark bar has no room below the field; the
  visible quantity on this ground is the PAIR. At the caps the band-pair measures
  1.42:1 / 1.28:1 / 1.21:1 across the three lanes at 1x (receipt v5-rest.png), and
  THE BARRING-VISIBILITY PIN is band-pair ≥ 1.20:1 per lane at 1x. The lit run at
  0.38 stays below full SHEEN_LIFT, so the labels' 6.60:1 parchment floor is
  untouched. A pale 0.5px crest rides the rachis so the spine reads with the
  rhythm. Barring is a tone-structure mark (areal — exempt from the retina-cue <2%
  ink budget exactly as the body gradient is, bounded by these caps instead), and
  it is the ONE texture addition D1's organic directive buys; the texture-complete
  law re-closes behind it.
- The comb/barb lean stays the composition's one lean (mirrored, down-left), and the
  ONE-CURVE bow (0.28/0.62) still governs every curved mark's control points.

### (d) The riders and the registers (R3's re-census; P8 contrast floors)

HEADER_RIDERS is RE-MEASURED for V5 (the table's rows change; the machinery — per-rider
ink extents, polarity field, riderFloorTone, riderGrainShare — survives untouched):

    rider          ground                     polarity   floor claim
    wordmark leaf  per-glyph char bed on wood bed        GILT ≥ 7.50:1 on its bed, PER GLYPH,
                                                         bed ⊇ ink+pad (mock-measured 9.0–11.5:1)
    seal (wax O)   solid wax on wood          object     hue mark, no text claim — the wax center
                                                         must stay red-family, never the char or
                                                         wood tone (mock-measured H 3°, S 58–61%)
    fletch labels  vane ladder                bed(vane)  PARCH_100 ≥ 6.60:1 on SHEEN_LIFT (existing)
    burned tabs    per-glyph char bed         bed        GILT ≥ 7.50:1 on BOLE_DEEP-family char
    quill line     shaft sheen zone           pale       GILT_LIGHT 3.34:1 (SC 1.4.11, existing)
    tab underline  cedar under the tab run    pale       GILT_LIGHT ≥ 3:1 re-measured on its extent
    Sign In        its own gold ground        bed        PLATE_KEYLINE-dark on GILT (own ground)
    account chip   bare cedar                 pale       SHAFT_SAGE/STEEL 4.63:1 (existing)

⚠ THE BURNED-TAB CONTRAST FORK IS THE SPEC'S BIGGEST CALL (D4). A bare char glyph on
cedar can never clear text AA: best case ≈ 2.4:1 (char L≈0.005 on body L 0.082), and
the dead-band law forbids lightening the wood. The reference set's burns read because
its wood is light honey — OURS IS NOT, and the ink laws govern (D1's placeholder
clause). So the burned tabs are **BRANDED, THEN GILDED**: each glyph is a char brand
(its own bole-family bed, singe halo feathering into the cedar) whose incised floor
carries a GILT fill — the exact construction the chair's verdict already blesses for
the header cartouche (image 2's burned frame + gold-fill lettering), extended to the
tabs so the brand and the shelf share ONE material grammar. Contrast is the wordmark's
own arithmetic: gold on char, 7.50:1, per glyph, with the char bed ⊇ ink + pad pinned
per run (the bole containment law, per-word). BUILT AND MEASURED in the revision
pass, not hypothetical: the mock renders the construction with a ~1.5–2px visible
char ring per glyph, and the per-glyph arithmetic holds on real pixels — gold core
vs its bed 8.59:1 (gilt) and 11.27:1 (giltL, the active tab) — while the same
grammar now also builds the cartouche lettering (§1e, the image-2 canon), so the
brand and the shelf share ONE material grammar in pixels, not just in prose
(receipts v5-rest.png; numbers in REVISION-NOTES.md). VETOABLE — the recorded alternative
(char lettering on a locally scraped pale-sapwood window) recreates the plaque failure
and fails the dead-band law's spirit; the second alternative (keep plain PARCH type,
burn nothing) defies D4. Decision table row 7.

States, in-material (D4): resting = GILT fill; hover = fill warms to GILT_LIGHT and
the singe halo warms one step (ember, ≤ 120ms); active = GILT_LIGHT fill + the gilt
underline, slant-cut at the composition's lean, hugging the run (quill-line grammar —
D4's own suggestion). Focus = the standard rectangular ring on the link's hit box.
The NavDivider grooves between reference tabs RETIRE (burned words spaced along a
barrel need no ruled boxes — reference image 4's spacing is the model); NavFlowArrow
is untouched (mobile bottom nav only).

Sign In/Account stays a distinct object — an action, not a place: the existing opaque
gold button, now seated by the depth system (contact + down-barrel cast), reading as
the arrow's one mounted metal fitting. It takes NO cylindrical warp (it is an object
ON the surface, not lettering IN it).

### (e) The cartouche band (D2, R4, R5, R6; P2, P3)

**Geometry (P2, rebuilt to the image-2 canon):** the brand is a burned FRAME on the
wood — a char OUTLINE wrapped around the barrel, NOT a filled plate. The owner's own
reference canon (image 2's cartouche panel) is a burned frame outline + gold-fill
lettering + the bright wax O, all sitting ON THE WOOD FIELD, and the spec now says
exactly that; the first draft's filled near-black band is RETIRED (it departed the
canon and fed the left end's dark mass — the P4 balance worry empties with it; the
field inside the frame measures wood, L 0.098, on the receipt). The frame is an
OPEN path — ENDS + FOOT ONLY: its two end arms die INTO the viewport cut (there is
no top run to close; measured — char pixels reach y=0 at both ends and the longest
dark run along the band's top interior is 3px where a closed frame would draw
~270), the foot line sits at y ≈ 31 with a center dip ornament above the barrel-rim
reveal, and the two ENDS are the shaped silhouette: cusped bracket finials reaching
~13px past the lettering field, answering the WoW-badge "frame and finials extend
beyond the lettering" note at the only edges the composition still owns. The shaft
does NOT thicken at the brand (the bar is one cylinder; a local bulge would break
the half-arrow premise) and the cartouche does NOT hang (it is burned INTO the
surface; hanging is the vanes' vocabulary alone). Construction = the bole system
re-geometried to STROKES AND BEDS: the char frame stroke (BOLE_DEEP family,
displaced scorch edge), a singe halo along it (anisotropic blur along the grain), a
gilt inner hairline tracing the frame (~1px, ornament register, no contrast claim),
and PER-GLYPH CHAR BEDS under the lettering (BOLE_DEEP, bed ⊇ ink + pad per glyph —
the containment law moves from the retired field to the beds, the same grammar as
the burned tabs, §1d), all at seed 17 with the isDegenerateSeed vetting and sRGB
declared. The V4C ink-hugging bole geometry stays retired; BOLE_BLEED's
frame-of-reference lesson carries over (the frame's vertical extent is the BAR's
business — cut at top, foot above the rim reveal — at every breakpoint).

**Size ladder (R5):** header register = the band above (simplified silhouette, strong
letters, NO interior ornament — a WoW-density badge at 34px is mud); hero/About
register (≥ 96px tall) = the TORN GOLD-LEAF organic silhouette (reference image 4)
with full ornament and the optional separate companion seal; PDF/print = the same
large register. One family, three registers, like the seal's.

**Lettering (R6):** a cartographer's ROMAN with swash capitals on S and F — the model
is the engraved titling of the Dutch Golden Age atlases (Ortelius's Theatrum /
Blaeu's Atlas Maior cartouches: roman capitals with swash italic display capitals,
strapwork ornament confined to the FRAME — named per R6 after review; the frame
ornament note "interlaced strapwork" is Ortelius's own cartouche grammar, and our
cusped finials are its quietest descendant). Blackletter is REJECTED at header scale
(legibility law) and UNLOCKED at the large registers (the torn-leaf variant may take
it — reference images 3/4/6 prove it gorgeous at macro scale). The header lettering is
gold LEAF in its per-glyph char bed on the wood, with the PLATE_KEYLINE stroke — the
existing three-layer law (fill carries 100% of contrast at every stop L ≥ 0.44;
keyline and bed carry character) unchanged, the contrast claim now per glyph against
its own bed (§1d; mock-measured 9.0–11.5:1).

**THE WORDMARK BECOMES A DRAWN MARK** (the brief's standing law already binds this:
drawn wordmark aria-hidden, typed text preserved). GildedWordmark's live-type argument
retires with its four costs re-answered: capitals ratio and seal seat are baked into
authored glyph paths (byte-stable, one-time); the name survives copy via the COPY_ONLY
visually-hidden run (the SettlementFoOrge lesson's own mechanism); assistive tech
reads the home control's aria-label as always; FS.h1 sync is deliberately severed —
the mark is a mark now. Authored once as SVG paths, no webfont dependency, no
transcendentals, fixed bytes.

**The seal (D2, R4; P3):** OVERSIZED, breaking the lettering line — a 30px box on the
38px bar (≈ 1.25× cap height; the letters' cap band is ~20px), its wax rim edging over
the F's sidebearing and the r's shoulder. Per the canon (images 2/6) it is a SOLID
WAX SEAL seated in the O's slot — no gilt ring, no counter hole: the O reads by seat
and size, the device is impressed IN the wax, and the wax is the lockup's one
saturated hue, measured on the receipt so it can never again sink into a dark
ground: center HSL 3°/58%/23%, clear wax 3°/61%/27% — red-family against the wood's
20° hue, with linear luminance 5.9–7.8× the char bed's (the critic's "wax must not
sample the char tone", closed with numbers). THE LADDER GAINS A MIDDLE RUNG (single
writer `sealRegister` re-derived):

    < 22px      DIMPLE (ring, wax, counter, glint — the old ribbon register)
    22–40px     SIMPLIFIED STRIKE — wax rim + the station TRIANGLE debossed (dark
                lip toward the 225° light, lit lip away — an impression, not a
                boss; the triangle is the verdict's "nearest the estate device";
                skyline and dot OMITTED — 28px measured muddy with the full
                device, and a simplified strike is how real matrices read at
                small impressions)
    ≥ 40px      the FULL IMPRESSED DEVICE (existing SealImpression, heavy redraw)

At header scale the seal renders the SIMPLIFIED STRIKE at 1x and 2x alike (the
register selects on CSS px; 2x sharpens the same strike — the closeup's seal-ladder
pane renders the TRUE 30px strike at both densities beside the 16px dimple and the
40px full device, so the rung is judged from pixels: the triangle occupies ~14×12px
at 30px and reads at both). SEAL_FIT re-measures for the
1.25em-class mark (advance still the o's; the overhang returns as negative
sidebearings, scaled). The wax stays the lockup's one saturated hue; the glint arc
stays lightArc-derived. ⚠ Grazes the owner-confirmed 2026-08-04 seal-ladder table
(dimple-at-ribbon): D2 explicitly supersedes the ribbon rung, but the SHAPE of the new
middle rung is the spec's own — open question 2.

**Mobile cartouche:** the band at 0.82 scale on the lockup row, seal ≥ 24px → still
the simplified strike (never the dimple — D2's prominence holds on the phone; the
mobile mock receipt shows it legible).

### (f) What the uncurated eighth reference taught

The single angled fletch-cluster (warm parchment, feathers above and below, brand
plate forward of the lead wrap on bare shaft) confirms two orderings this spec bakes
in: the brand sits on BARE SHAFT ahead of the fletching (our cartouche → lead whipping
order), and the tail bindings are compact collars while the lead carries the mass. It
adds no new vocabulary; it is the master composition's own order photographed from a
quarter view.

---

## PART 2 — THE DEPTH SYSTEM (D3; P8)

**One light, one table.** Every offset derives from PLATE_LIGHT_DEG (225°) via the
existing single writers (lightOffset / shadowOffset / dropShadow / contactShadow /
lightArc). NOTHING improvises per-object. The scroll shot is the canon for RATIOS
(its realism is carried by shadow, not detail); its own light direction (upper-right)
is NOT imported — the estate's azimuth governs, per the one-light law.

    object            contact (AO)          cast (down-barrel, 225° negated)
    vane              blur 1.1              d 4.1–5.8, blur 5, FLETCH_SHADOW (existing pair)
    cartouche frame   NONE — burned IN the surface (the same law as the tabs): the
      + letter beds   singe halo and the incision's own dark are the depth cues
    seal (on wood)    blur 1.2              d 1.6, blur 1.8, @ 0.5
    tail collar       —                     d 1.2, blur 1.5, @ 0.35
    Sign In button    blur 0.8              d 1.4, blur 1.6, @ 0.45
    burned tabs       NONE — a burn is IN the surface; it casts nothing and its
                      depth cue is the singe halo + the incision's own dark
    whippings         existing box/edge behavior; the barrel multiply is their depth

AO carries no azimuth (the estate's contact-shadow law); casts fall down-and-right
(down the barrel), consistent with the shingle's ascending z. Thickness at silhouette
edges: the vanes' edge-light (leading 0.50 / trailing 0.38) and the collars' gloss
crests are the thickness cues; no bevels anywhere (the retired-plate lesson — at this
scale contact/cast is the highest-value depth cue and the cheapest).

**THE CYLINDRICAL TEXT WARP (D3(3); P8 third half).** Method ladder, chosen over the
alternatives (per-glyph transforms everywhere: heavier and needless at 13px;
feDisplacementMap: destroys glyph edges and costs legibility for a texture-class
effect):

- HEADER SCALE (cartouche lettering + burned tabs): SVG textPath on a shallow arc
  (the bow) + one per-run scaleY (the foreshortening). Constants, PINNED:
  **WARP_RATIO = 0.0105** (arch sagitta = chord × ratio, crown up — the convention the
  owner's own curved-barrel reference panels read; a straight cylinder in rectilinear
  projection bows nothing, so the bow is a DRAWN convention and the spec says so
  honestly) and **FORESHORT = 0.94** (the run's mean cos φ for the label band's angular
  seat on the visible radius). **DEVIATION FROM D3'S WORDS, NAMED FOR THE OWNER:**
  D3(3) as written curves every piece of lettering with the barrel, tab labels
  included. This spec deliberately does NOT warp the fletch labels
  (Create / Library / Realm): those three words ride feather surfaces, not the
  barrel, and they are the bar's most-read words, so the legibility law outranks
  the warp there. If the stricter reading of D3 is wanted, the warp is one
  transform away (decision row 5) — but it is a deviation, not an oversight, and
  it is recorded here where the warp is specified, not only in the decision table.
- HERO/PDF SCALE: per-glyph transforms with the scaleY(φ) GRADIENT (foreshortening
  increasing toward the rim), where the larger x-height can carry it.
- MEASURED LEGIBILITY BOUND (mockup receipt, v5-cartouche-closeup.png): the warp
  ladder renders flat / pinned / 2× pinned at 1x and the pinned form again at 2x.
  At the PIN (0.0105 / 0.94) the 13.5px tab run reads at a glance, indistinguishable
  in speed from flat; at 2× the pin (0.021 / 0.88) "Compendium" visibly bows and the
  counters start to crush — REJECTED. The pin is therefore the measured maximum that
  costs nothing at a glance; the a11y text behind the drawn layer stays flat and
  plain, and the focus rectangle is unaffected (drawn layer aria-hidden throughout).

---

## PART 3 — THE TWO-STATE SCROLL HEADER (R1; P1, P6)

**The story:** at rest the arrow is still and the feathers HANG; when the page moves,
the world is in flight and the feathers STREAMLINE flat along the shaft. The scrolled
state is, deliberately, V4's proven shallow geometry wearing the organic silhouette.

- **REST** (scrollY ≤ 8): full hang. Blade bodies below the bar; deepest ink of the
  hang ≈ bar + Db + fray ≈ 89px at 1440. Labels ride the blade shoulders (ink band
  ≈ y 47–60), PARCH_100 on the vane ladder, 6.60:1.
- **FLIGHT** (scrollY ≥ 40): the quill presses onto the bar (crest ≈ y 9), the body
  covers the bar's lower band, hang capped at 13px. Labels sit at the V4 seat
  (ink ≈ y 13–25) ON the vane. The quill-line indicator, both states, is the gilt bar
  along the ACTIVE lane's bound run — the binding is the top edge in both geometries,
  so the mark never moves channels.
- **Transition:** one discrete threshold with hysteresis (enter flight at 40, return
  at 8 — never a per-frame scroll-linked morph: jank, and a per-frame repaint of a
  cached static composition), 240ms ease-out, animating path interpolation where the
  engine supports `d:path()` transitions and cross-fading two static groups where it
  does not; the label row translates (transform only). `prefers-reduced-motion`:
  instant swap. Scroll-header craft (NN/G and practice) confirms the shape: animate
  once at a clear threshold, transform/opacity only.
- **ANCHOR_OFFSET (P1):** UNCHANGED IN BOTH STATES, and that is the architecture: the
  hang is paint (overflow:visible on the zero-inset box — the V4 law), the bar's
  layout height is CHROME.headerDesktop in both states, so ANCHOR_OFFSET =
  CHROME.headerDesktop + SP.xxl remains the single-writer derivation, never pinned as
  a sum, and no anchor in the estate moves when the states swap. The two states
  differ ONLY in painted geometry and in the labels' transform.
- **Hit targets (R2):** the hang is pointer-events:none decoration. Each fletch tab's
  control is a generous rectangle: rest = from the bar's top to label-bottom + 6
  (≈ 0–66px tall, spanning the visible blade width); flight = the bar + 12 (≈ 50px).
  Focus rings rectangular on those boxes (clip-path clips rings — the measured law;
  nothing here is clipped). The rectangles are DOM buttons positioned in paint space,
  costing no layout height (absolute, in the sticky header's context).

**MOBILE (P6):** the mobile bar keeps its two-row content-sized box (~76–81px; the
44px tap floor is owner-parked and untouched). Row 1 = cartouche band (0.82 scale,
seal ≥ 24px, simplified strike) + Sign In. Row 2 = the three blades at phone scale
(Db 24/28/25, Sg ≤ 3.5), hang capped at 24px below the header box in REST and 8px in
FLIGHT (a phone reserves less; a 24px hang over 844px of viewport is the same visual
tax as 89 over 900 at desktop is NOT — the cap is the phone's own number, pinned).
Burned tabs do not render on the phone bar (the bottom nav owns those routes there;
unchanged surface). ⚠ THE BREAKPOINT LAW: every geometry claim above is measured at
1440 AND at the 640 desktop breakpoint AND at 390 — a geometry proven on one
breakpoint is a claim about one breakpoint (V4C's bite, and this mock's own headless
500px-minimum incident is the same lesson wearing a new tool). RECEIPT STATUS,
HONEST: 1440 and 390 are mocked in this pass; THE 640 RECEIPT DOES NOT EXIST YET —
it is OWED AT BUILD, deliberately: the 640 composition (which objects survive,
whether the burned shelf collapses into a menu) is a design decision this pass does
not own, so no 640 geometry is claimed anywhere in this spec, and the law binds the
builder to produce the real 640 render before landing. (640 clears the headless
500px floor, so the build harness can shoot it directly.)

---

## PART 4 — WHAT IS REBUILT vs REUSED (P7 — every named V4 system's fate)

    REUSED VERBATIM (no edit): SHAFT tones + SHAFT_STOPS + SHAFT_CYLINDER +
      cylinderToneAt · wood tiles (seeds 7/11/13) + woodTile + WOOD_TILE + GRAIN_AMP /
      GROWTH_* / PORE_* + darkening-only law · PLATE_LIGHT_DEG + lightOffset /
      shadowOffset / dropShadow / contactShadow / lightArc · WRAP tones + WRAP_TURN +
      TURNS + WRAP_BARREL + blend contract + @supports fallback + tie-off grammar ·
      unitHash · the FLETCH tone ladder + BARB weights/opacities + BOW · GILT ladder +
      PLATE_KEYLINE + BOLE tones + isDegenerateSeed + sRGB discipline · SEAL_WAX/RIM/
      GLINT · ANCHOR_OFFSET derivation · IDENTITY_EXTENSION (quill line as app-wide
      active mark; ≥24px fletch quotes; band never shrinks) · HouseDevice (favicon/PDF/
      footer untouched) · NavFlowArrow (mobile bottom nav).
    REUSED, RE-HOSTED (same budgets, new silhouette): comb whisper · sheen bands ·
      splits + calm-zone machinery (zones re-derived from the new label seats, both
      states) · fray · lower-cut whisper · edge-light pair · contact/cast split ·
      z-ascends-into-Realm · the hang law (paint never layout) · SEAT retires as a
      concept (no parallelogram seam to seat) — its lesson (labels never sit on a
      seam) survives as the label-zone derivation.
    RE-MEASURED: HEADER_RIDERS (all rows; polarity machinery unchanged) · SEAL_FIT ·
      BAND_PX_PER_UNIT (new cluster box) · the 640/390 breakpoint set.
    REBUILT: FletchBand geometry (organic blades replace parallelograms — D1 retires
      shapes-locked; single-writer lower-edge spline; the separation-law machinery) ·
      GildedWordmark geometry (the image-2 canon — burned frame outline + per-glyph
      char beds + solid wax O on the wood — replaces BOTH the ink-hugging bole and
      the interim filled char band; BOLE_BLEED's frame-of-reference law carried over) · the
      wordmark's leaf layer (drawn glyphs replace live type; COPY_ONLY + aria pattern
      carries the name) · sealRegister (three rungs) + a simplified-strike middle
      register drawn beside SealImpression (organicLogo census: the new module joins
      the declared-inliner set or imports lazily per its rules).
    NEW: the two-state controller (threshold + hysteresis + reduced-motion arm) ·
      per-vane tail collars · spiral crossings · barring rhythm · burned-tab
      material (char bed + gilt fill + singe halo + in-material states) · the warp
      (WARP_RATIO / FORESHORT + the ladder) · the depth table (Part 2).
    RETIRED: full-parallelogram vanes + dead-straight-edges ruling (owner, D1) ·
      NavDivider's reference-tab grooves · the V4C ink-hugging bole silhouette · the
      INTERIM V5 FILLED CHAR BAND (one draft old — replaced by the canon
      frame-on-wood; critic F3) · the 16px dimple register AT THE HEADER (survives
      below 22px elsewhere) · live-type wordmark · SHAFT_RULE's divider consumer
      (token kept for other seams).
    UNTOUCHED, OWNER'S GLANCE PENDING: ShaftNock (the build-and-show at the right
      end; V5's frame-cut composition neither needs nor forbids it — the owner's
      call stands as recorded in that file).
    VERIFICATION HARNESS, ALL REUSED AS DISCIPLINE: composited-AA with calm zones ·
      texture-budget totality ratchet · blend-contract pin · focus law · deterministic
      seeds + degenerate-seed exclusion · sRGB declarations · the breakpoint law —
      plus FOUR NEW PIN CLASSES: the warp constants (drawn-vs-typed run equivalence:
      the drawn glyph run's text content equals the typed run, so the mark can never
      silently misspell the name) · the two-state invariants (layout box identical
      across states; ANCHOR_OFFSET independent of state; no active-state paint below
      the vane in either state) · THE SEPARATION PIN (§1b's separation law: every
      crossing shows its seam/edge line at ≥1.15:1 local contrast and every peel-off
      its cut, in BOTH states, at 1x — the flight state is the reason the pin
      exists) · THE BARRING-VISIBILITY PIN (§1c: band-pair ≥1.20:1 per lane at 1x,
      lit runs never above the 0.38 cap so the label floor stands).

---

## OPEN QUESTIONS FOR THE OWNER (capped at two)

1. **The bar's lettering grammar is branded-then-gilded — BUILT and MEASURED; sign
   it.** Bare char on the dark cedar can never clear text AA (≈2.4:1 by arithmetic —
   the reference's burns read only because its wood is light honey, which the ink
   laws overruled as placeholder). This pass built the answer in both places it
   applies, per the image-2 canon: char bed + gilt fill ON THE WOOD — the cartouche
   lettering and the burned tabs now share the one grammar, and the receipts
   measure it: gold-on-bed 8.59:1 (tabs, gilt) / 11.27:1 (active tab, giltL) /
   9.0–11.5:1 (wordmark), a ~1.5–2px char ring visible per glyph, the wax O
   red-family (H 3°) and the frame field reading as wood (v5-rest.png,
   v5-cartouche-closeup.png; REVISION-NOTES.md). If you want TRUE bare char
   instead, the honest price is unchanged: a locally scraped pale window per word
   (re-creates the plaque), or moving those routes off the bar entirely. Sign off
   the built grammar?

2. **The seal's middle rung — ANSWERED FROM PIXELS; sign it.** D2's prominence puts
   a 30px seal in the header, between your confirmed "dimple at ~16px" and "full
   device at ≥28px" (measured muddy at 28, readable at 40). The spec inserts a
   SIMPLIFIED STRIKE register (wax rim + station triangle debossed, 22–40px), and
   the closeup's seal-ladder pane now renders the TRUE 30px strike at 1x AND 2x
   beside the 16px dimple and the 40px full device — the triangle occupies ~14×12px
   at 30px and reads at both densities (v5-cartouche-closeup.png). Sign off the
   three-rung ladder (dimple / strike / full device)?
