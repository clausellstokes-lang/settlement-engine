# V5 REVISION NOTES — critic findings F1–F10, closed (2026-08-04, second pass)

The critic ruled NEEDS-REVISION with ten findings. Every finding below maps to its
fix and its receipt. The deliverable set is REVISED IN PLACE: v5-spec-draft.md,
decisions.md, v5-mock.html, and the four PNGs (re-rendered from the revised mock:
headless Chrome, dsf 1, 1440×900 for rest/scrolled, 1440×1200 for the closeup,
500×844 cropped to 390 for mobile per the logged headless floor hazard). The SOUND
list is untouched: P1 hang-as-paint, ANCHOR_OFFSET single-writer, the P7 fate
table's reuse spine, the pendant-law bound-run geometry, the half-barrel gradient,
the hysteresis two-state, SHAFT_STOPS reuse. All contrast numbers are WCAG relative
luminance ratios measured on the shipped PNGs with a Python/PIL sampler.

## F1 (HIGH) — flight state read as one dark slug → THE SEPARATION LAW, pinned

Fix: per-blade separation is now spec law (§1b "THE SEPARATION LAW", Part 4
SEPARATION PIN), built in the mock for BOTH states: seam-shadow (lap crevice) under
every leading cut and along the first third of every rising upper edge; edge-light
on every leading cut (0.70-class opacity in flight) and tail turn; a 1px v-notch at
every peel-off; per-lane fills one ladder step apart; per-lane FLIGHT depths
11/13/12 under the 13px cap so the flattened silhouettes stagger; thread (collars +
spiral crossings) painted UNDER the blades so rest shows collars in the open bay
windows while the flight lap covers them, as it physically must. The active gilt
quill-line alone paints over the thread (indicator legibility).

Receipts (measured at 1x): crossing seam/edge local line contrast —
- v5-rest.png: Library-over-Create 2.41:1, Realm-over-Library 2.35:1
- v5-scrolled.png: 1.61:1 and 1.87:1
Pin: ≥1px seam/edge line at ≥1.15:1 local contrast at every crossing + visible cut
at every peel-off, both states. Demonstrated in the re-rendered v5-scrolled.png, not
deferred.

## F2 (HIGH) — burned tabs never built (plain gold on wood) → branded-then-gilded, built and measured

Fix: the mock's tabs now render the real construction — singe halo (BOLE stroke 6.5
@0.5, displaced + blurred), a per-glyph char BED (BOLE_DEEP stroke 3.6, displaced)
leaving a visible ~1.5–2px char ring around every glyph, then the gilt fill. Burns
cast nothing (in-surface, per the depth table).

Receipts (v5-rest.png): gold core #D4AF45 L 0.451 vs char bed #29100F-family
(41,15,7) L 0.0083 → **8.59:1 per glyph** (Compendium, Gallery); active About in
giltL → **11.27:1**. A 15px scanline into a stem crosses ~10px of char/singe tones
before the gold — the bed is visible at arm's length, and the right third no longer
reads as ordinary navigation (the old render's bed was a ~1px sliver; its bright-core
vs wood read was 5.36:1 with no visible char, which is why it read as plain gold —
the critic's 1.66:1 was presumably a mean-ink sampling of the same absence). The
contrast CLAIM now rides gold-vs-bed, not gold-vs-wood; wood (L 0.0898) is context
only (3.58:1).

## F3 (MED-HIGH) — cartouche departed the image-2 canon → rebuilt as frame-on-wood

Fix: the filled near-black char band is RETIRED. The cartouche is now the canon
(hf_…7d3d368b, panel 3): burned char FRAME OUTLINE (displaced stroke + singe halo +
gilt inner hairline) on the wood, PER-GLYPH char letter-beds + gilt fill (the same
grammar as the tabs — one material family, which is what resolves open question 1),
and the wax O as a SOLID red seal (no gilt ring, no counter hole; debossed triangle
strike corrected to a true impression: dark lip toward the 225° light). Spec §1e
rewritten; rider table rows re-grounded; depth table: frame + beds cast NOTHING,
only the seal (an object ON the surface) keeps contact + cast. The P4 left-end
mass is un-fed (no plate, no plate shadow).

Receipts (v5-rest.png): frame field interior measures WOOD (131,73,45) L 0.0978,
hue 20° — not a plate. Wax samples: device-floor center (94,29,25) HSL 3°/58%/23%;
clear wax (110,31,27) HSL 3°/61%/27%; lit zone (91,26,22) HSL 3°/61%/22% — all
red-family, hue-separated from wood (20°) and char, with linear luminance 5.9–7.8×
the char bed's L 0.0056: the wax center does NOT sample the char tone. Wordmark
gold-vs-bed 9.0–11.5:1 measured (gilt base → giltL top of the leaf gradient).

## F4 (MED) — mock closed the frame-cut top edge → open path, ends + foot only

Fix: the frame is authored as an OPEN path — left arm, foot (with center dip),
right arm; no top run exists. The arms die into the viewport cut.

Receipts (v5-rest.png): char pixels (#2A1008) present at y = 0, 1, 2 at both frame
ends (screen x≈40–44 and x≈315–319); longest dark run along the band's top interior
(y=2) is **3px** where a closed top rule would draw ~270px. Re-screenshotted in
v5-rest.png and both closeup band panes.

## F5 (MED) — lap rule contradicted the table (+18 vs +64/+73) → dropX defined, arithmetic closes

Fix: spec §1b now defines **dropX = ax + Lb** (the peel-off) and **tx = ax + W**
(W is the kiss offset from the ATTACHMENT; blade span from peel-off = W − Lb), and
states the lap rule from the real numbers: each kiss lands 30–50% into its
successor's span — Create kiss 560 laps Library peel 496 by **64px (33% of its
194px span)**; Library kiss 690 laps Realm peel 617 by **73px (50% of its 146px
span)**. The stray "+18" prose is gone from spec and mock comments (it was a
control-point constant that leaked into the rule). Decision row 19 records it as a
correction: the render never moved; the prose was wrong.

## F6 (MED) — fletch-label warp exemption reinterpreted D3 quietly → deviation named in the warp section

Fix: spec Part 2's warp block now carries a plain, owner-visible paragraph:
"DEVIATION FROM D3'S WORDS, NAMED FOR THE OWNER" — D3(3) as written warps all
lettering; the fletch labels deliberately take no warp (feather surfaces, not the
barrel; most-read words; legibility law outranks), and the stricter reading is one
transform away (decision row 5). No longer buried in a parenthetical or only in the
decision table.

## F7 (MED) — rest vanes read as awnings → barring pairs + rounded tips + crest, measured

Fix: the barring becomes band-PAIRS (lit SHEEN_LIFT run ≤0.38 leading a dark TIP
bar ≤0.55, blurred, tailward sweep with the comb lean) because the draft's 0.14
dark-bar cap computes 1.03:1 on this ladder — invisible by arithmetic, and even an
alpha-1.0 lone dark bar tops out ≈1.23:1 (the field is already near-black; the dark
direction has no room — the raise-the-cap math the critic asked for). The blade
silhouette gains the references' tapered ROUNDED tail-turn (knot spline), a sloped
leading cut, and a pale 0.5px crest on the rachis so the spine reads.

Receipts (v5-rest.png, in-blade masked column scan): band-pair **1.42:1 (Create),
1.28:1 (Library), 1.21:1 (Realm)** at 1x. Pin: band-pair ≥1.20:1 per lane. Label
floor guard: the lit run at 0.38 stays below full SHEEN_LIFT, so the 6.60:1
PARCH-on-ladder floor claim is untouched (worst measured label ground here is far
below full lift).

## F8 (LOW-MED) — fray hatching floated detached → anchored by construction

Fix: the lower edge is now ONE knot spline per blade (single writer). The
silhouette, the lower-cut whisper, AND the fray anchors all sample the same spline;
fray ticks start 1.1px INSIDE the fill and cross the cut by construction. A
consumer of the lower edge can no longer drift off it — the class is removed, not
the instance. Visible in v5-rest.png (ticks touch the cut along every belly).

## F9 (LOW) — the 640 receipt did not exist → restated as owed-at-build

Fix: no fake 640 render. The spec's breakpoint-law paragraph now states RECEIPT
STATUS honestly: 1440 and 390 are mocked; the 640 receipt DOES NOT EXIST and is
OWED AT BUILD, because the 640 composition (which objects survive; whether the
burned shelf collapses into a menu) is a design decision this pass does not own.
Recorded in the decisions deferred list; the law binds the builder to shoot the
real 640 (which clears the headless 500px floor) before landing.

## F10 (LOW) — the true 30px strike never rendered → seal-ladder pane, 1x and 2x

Fix: v5-cartouche-closeup.png gains a seal-ladder pane rendering, at TRUE CSS size
on wood chips: the 16px dimple, the **30px SIMPLIFIED STRIKE at 1x**, the 40px full
device, and the **same 30px strike at 2x** (scale-2 re-raster = retina density).
The strike's station triangle occupies ~14×12px at the 30px seal (authored r×0.94 ×
r×0.78) and is legible at 1x, crisp at 2x, with the deboss reading as an impression
(dark lip toward the light). Open question 2 is now answered from pixels.

## Measurement provenance

All numbers sampled from the shipped PNGs (Python 3 / PIL 11.3.0): WCAG relative
luminance, (L_hi+0.05)/(L_lo+0.05) ratios; hue/sat via HSL conversion; seam
contrasts are max local line-vs-3px-neighborhood steps; barring pairs are masked
in-blade 6-column window means (labels excluded). Renders: headless Chrome
--force-device-scale-factor=1, --virtual-time-budget. The headless 500px minimum
window hazard from the first pass still governs the mobile shot (500-wide render
cropped to the mock's self-constrained 390 column).
