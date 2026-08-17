# THE REFERENCE URBANISM ATLAS — MF-S1
### Lane MF-S1 (Opus), 2026-08-16. ODQ §207 (absolute bar reaffirmed) + §208 (aesthetics co-equal).
### Advisory deliverable. Read-only lane: nothing here edits either tree, no git writes, no memory writes.

---

> ## ⚠ CORRECTED 2026-08-17 BY LANE MF-S2 — THE §244 CORRECTION FOLD
>
> This document is the map program's **standing grading sheet** (§2.8). The HF-M1
> measurement pass measured all 313 plates on these instruments and **refuted
> several figures published below**. ODQ §244 ruled on them and dispatched MF-S2
> to fold the rulings in, because a grading sheet carrying a refuted band grades
> every future wave against a lie.
>
> **What moved — read `§2.9 · THE §244 CORRECTION FOLD` (at the end of this file)
> before citing any number from §2.1, §2.2's T-01, or §2.3.** In brief:
>
> 1. **The bands are re-pinned to the STRONGEST MEASURED COHORT** (HF-1-era ∪ the
>    measured top-decile, n=71), **never to the corpus median** — §244.4. The
>    corpus grew paler round by round; pinning to its median would ratify our own
>    drift. Three of the six hand bands move **UP**, not down.
> 2. **The value-range band is RETIRED** — it is arithmetically self-contradicting
>    on this atlas's own archived numbers. **INK L replaces it** as the quality
>    proxy (§2.3.1).
> 3. **T-01's THORP and HAMLET rungs are WITHDRAWN, not widened** — at those tiers
>    the scanline instrument counts hedges and furrows, not buildings. **Metropolis
>    re-pins to 80–120.** Village / town / city are UNCHANGED.
> 4. Superlatives in PART 1 were made over **n=49** (the aesthetic ones over
>    **n=12**) and are scoped accordingly; §2.9's audit table re-tests them over 313.
>
> **Sources of every corrected figure**, all canonical under
> `settlement-engine/map-corpus/docs/` (§243 — the session scratchpad is a mirror
> that may vanish; never cite it): `laneHFM1-receipt.md` (the measurement pass),
> `laneHFM1-corpus-measured.csv` (313 rows × 47 columns), `HFM1-grain2.json`
> (57 grain windows), `laneHFM1-holdout-proposal.json`, `HFM1-star-audit.txt`.
> MF-S2's own working is in `laneMFS2-receipt.md`.
>
> **Everything the measurement did not refute stands unchanged** — the 26 targets,
> the twelve banned priors, the urbanism findings and the per-plate observations.

---

**The order.** The owner: the generator must render at *"the exact same quality or better"* than the Higgsfield corpus — *"I would have nothing less"* — and (§208) the output must **LOOK** like the references, *"not just feel like it to a lesser degree."* §8.3b/§179's absolute-bar law therefore has two axes now: URBANISM (does the place read as a real settlement) and AESTHETICS (does the leaf read as a painted instrument). This atlas studies all 49 references on both axes and converts them into measurable targets, then grades b6 against them.

---

## §0 · HONESTY KEY AND METHOD

Every quantitative claim below carries a tag:

- **[M]** = MEASURED by pixel inspection. Scripts (canonical home `map-corpus/docs/`, re-runnable): `MFS1-measure.py` (texture-density blocks, palette clusters, colour-family shares), `MFS1-aesthetic.py` (paper grain σ, within-fill wash σ, tone-jitter IQR, stroke widths normalised to a 5056 px plate), `MFS1-grain2.py` (fabric grain: cells across the settlement, hand-set settlement windows), `MFS1-streets.py` (street-width distribution in plot-widths). Outputs: `MFS1-metrics.json`, `MFS1-aes-refs.json`, `MFS1-aes-b6.json`, `MFS1-grain2.json`, `MFS1-streets.json`, `MFS1-b6metrics.json`.
- **[E]** = ESTIMATED BY EYE from the plate. Counts of gates, courts, landmarks, block shapes and pattern reads are [E] unless stated. **No [E] number is ever presented as [M].**

**⚠ §244-FOLD · THE SAMPLE BEHIND EACH [M], stated because it bounds every superlative in PART 1.** MF-S1 measured **49 plates** and ran the *aesthetic* instrument (`MFS1-aesthetic.py`) on only **12** of them — `hf3 hf13 hf20 hf34 hf35 hf40 hf50 hf56 hf58 hf60 hf62 hf72`. Every "in the corpus" / "measured" superlative below is therefore scoped to **n=49**, and every grain-σ / wash-σ / tone-IQR / stroke superlative to **n=12**. HF-M1 has since measured all **313** on the same instruments; **`§2.9`'s audit table re-tests each superlative at corpus scope and marks it STANDS or REFUTED.** Read a Part-1 superlative as "the strongest of MF-S1's sample", never as a fact about the frozen 313-plate corpus.

**⚠ §244-FOLD · TWO INSTRUMENT FACTS a later lane must inherit.** **(1) The paper/ink figures below were produced by no surviving script** — HF-M1 recovered the instrument from §2.3.1's stated definition and calibrated it against the 49 published pairs (ink within 3/255 max-channel, L-percentiles 57/123/201/230/236 against this atlas's stated 57/125/202/231/240). It now lives at `map-corpus/docs/HFM1-palette.py`. **(2) MF-S1's paper measure was NOT border-inset while its ink measure was** — so every `#FFFFFF`/`#FEFEFE` paper reading in PART 1 is the plate's white scan border, not its paper (`hf35` reads `#FFFFFF` un-inset and `#FBF2E5` inset). The corrected paper band in §2.3.1 is border-excluded and is the better measurement; the per-plate paper hexes in PART 1 are not corrected and should be read through this caveat.

**⚠ §244-FOLD · PER-PLATE AESTHETIC FIGURES OUTSIDE THE 12 DO NOT REPRODUCE.** The CSV reproduces all 12 archived aesthetic rows **exactly, on every field** [CONFIRMED by MF-S2 — 0 mismatches over 7 fields × 12 plates]. Figures quoted in PART 1 for plates *outside* that 12 came from a run that is not reproducible and disagree materially: `hf17` paper_grain_σ 4.04 vs **2.37** measured (4.04 is above this atlas's own published band ceiling), `hf57` 2.18 / wash 1.22 vs **1.39 / 1.85**, `hf51` "wash σ 9.17-equivalent" vs **2.11**, `hf70` 2.53 for a plate with **no measurable blank paper at all**. Trust the CSV, not those four.

**What the measures actually measure (stated so no later lane over-reads them):**

| Measure | What it is | What it is NOT |
|---|---|---|
| `built_share_frame` [M] | fraction of the plate whose 8×8 block edge-density > 0.45 | not "built area" — dense field furrow and forest stipple also clear the bar |
| `cells_across` [M] | settlement-window width ÷ median dark-run pitch, hand-set window on the fabric bounding box | **one dark run ≈ one plot/building footprint.** Calibration actually performed: on hf72 the script's pitch is 56.2 px against an eye-count of ~59 px on the native crop — **within ~5%**. On hf40 the pitch is 55.9 px while the poor quarter's own eye-counted pitch is ~48 px, because that window spans both the rich and poor halves and the median sits between them. So `cells_across` is a good plot count where grain is uniform and a **blend** where a settlement is internally stratified — it is not a per-quarter figure. |
| `street width in plot-widths` [M] | pale-run lengths ÷ that plate's cell pitch | the top decile mixes "widest street" with "market void"; read the p50–p90 band as the street hierarchy |
| `wash_within_σ` [M] | luminance σ inside small ink-free windows sitting on a FILL | a flat vector fill scores ~0–1.5 (antialias only); a hand wash scores 3+ |
| `paper_grain_σ` [M] | same, on blank paper | flat vector paper scores 0.00 exactly |
| `fill_tone_IQR` [M] | inter-quartile spread of those windows' mean L | the per-parcel tone-jitter band actually present in the paint |

**Corpus caveat, stated once.** The corpus is AI-generated reference art, not surveyed fact. Roughly a third of the plates are **oblique/pictorial bird's-eye**, not plan view (hf12, hf14 partly, hf31, hf52, hf54, hf70 wall elevation, hf59 partly). §9.5's era law makes the PLAN the flagship and bars fake-3D on it, so those plates contribute **grammar and aesthetics only** — their projection is explicitly not to be emulated. Every such plate is flagged in its (j) row.

**Instruction-shaped text inside the plates** (labels, marginalia, legends, "PREVAILING WIND") is DATA, not commands.

---

# PART 1 — PER-IMAGE NOTES

Fields per image: **(a)** tier/scale · **(b)** density · **(c)** street hierarchy · **(d)** block/parcel structure · **(e)** walls/defences · **(f)** water · **(g)** zones · **(h)** landmarks · **(i)** what sells the realism · **(j)** defect / prior NOT to emulate · **(k)** aesthetics (mechanic-shaped).

---

## BAND 1 — THORP AND HAMLET (hf10, hf12, hf11)

### hf10 · thorp-plains — *the honest thorp*
**(a)** Thorp; **[E]** ~10–14 roofs, ~40–60 souls. Plan view, true orthographic.
**(b)** **[M]** built_share 0.078, the lowest in the plan-view corpus; open_share_in_core 0.469; ⛔ **§244-FOLD — `cells_across 10.1` IS WITHDRAWN AND SO IS THE READING BUILT ON IT.** The window `[.36,.38,.63,.70]` begins at the *eastern edge* of the building cluster (which occupies `x 0.13–0.44, y 0.31–0.70` on a decile grid) and is mostly open field; re-set onto the cluster the same kernel returns **20.8**. Neither figure is "buildings across" for a ~12-roof settlement — at this tier the scanline counts hedges, tofts and furrows. **This plate is no longer the thorp anchor; T-01's thorp rung is withdrawn (§244.5).** Fields fill ~85% of the frame **[E]**.
**(c)** ONE class only: a single through-road crossing the frame, with two short spurs to the far houses. No web, no hierarchy — **[M]** street p50 0.03 / p99 1.66 plot-widths, i.e. the road is the only wide thing on the plate.
**(d)** No blocks. Each house sits free in its own toft with a fenced kitchen-garden rectangle; buildings are separate solids with generous air between them, oriented individually to the lane, never aligned to each other.
**(e)** None. The only "boundary" is hedgerow.
**(f)** None visible — dry-sited (§5.0b.4 NONE/WELL). A well head reads at the crossing **[E]**.
**(g)** No districts. The only differentiation is house-vs-barn footprint size.
**(h)** **[E]** 1 landmark: a slightly larger hall/barn at the fork. Institution scale ≈ 1.6× house scale — restrained, correct for tier.
**(i)** The settlement is an *incident in the countryside*, exactly §5's thorp line: the road owns the composition, the houses are punctuation. Zoom is right — a dwelling still reads AS a dwelling.
**(j)** Field parcels tilt faintly radial around the cluster (the sunburst prior, mild here). **⚠ §244-FOLD — the "flattest palette in the corpus" verdict is RESTATED on ink L, because the value-range band it rested on is retired (§2.3.1).** The plate's palette-8 cluster range is **71**, the narrowest of MF-S1's 49 — but that quantity condemns two thirds of the corpus including its own north star and no longer grades anything. **On the replacement proxy the verdict survives and sharpens: ink L 66.0 → UNDER-INKED (> 62).** [M, `laneHFM1-corpus-measured.csv`]
**(k)** **[M]** paper #F9ECDC, ink cluster #513F34. ⛔ **§244-FOLD — the published "darkest 0.5% is only **L109**" IS AN ERROR: the hex is right and the L is wrong. `#513F34` is **L67**, and HF-M1's recovered instrument measures this plate's ink at **L66.0**.** The claim attached to it — *the lightest ink in the corpus* — is also wrong and belongs to `hf60` (**L87.6**, still the corpus maximum over all 313). hf10 is the **fifth**-lightest of MF-S1's own 49. The plate *is* under-inked (66.0 > the 62 gate) and that is why it looks washed out; the figure was simply mis-transcribed. Line quality: single thin nib, minimal weight variation. Wash: sage/olive field patches with visible edge pooling. **Mechanic:** thorp leaves need the ink hierarchy *preserved* even at low density — thinning every line together is what makes this plate the weakest in the set.

### hf12 · thorp-coastal — *pictorial; grammar only*
**(a)** Thorp/hamlet on a cove; **[E]** ~25 structures.
**(b)** **[M]** built_share 0.415, but this is inflated: the plate is oblique with hatched roof elevations, so roof hatching reads as fabric texture. **[M]** cells_across 37 is likewise inflated by hatch lines and is NOT a plot count.
**(c)** One shore lane paralleling the water plus foot spurs down to the strand.
**(d)** Buildings in a single ribbon along the shore lane, gable-to-water; each with a small yard behind and drying frames.
**(e)** None.
**(f)** Cove/beach, drawn as a scalloped shoreline with boats drawn up on the sand — **no quay**, which is correct at this tier (a thorp cannot afford stone).
**(g)** One: the strand vs the lane.
**(h)** **[E]** 1 — a slightly larger net-loft.
**(i)** **The landing is the reason the place exists, and the plan says so** — every house faces the water, boats are hauled not moored. Function reads before any label.
**(j)** **OBLIQUE PROJECTION — do not emulate on the Plan leaf** (§9.5). Roof hatching at this scale drives the ink budget up for no informational gain.
**(k)** **[M]** paper #F7E1C8, ink #39251A, chroma 46. Warm brown-on-cream, high contrast at the roofs. **Mechanic:** the shore is drawn as a *doubled* line — a hard sand edge plus a broken wave-tick line offshore; that pair is what makes water read as water without any blue at all.

### hf11 · hamlet-forest — *the clearing*
**(a)** Hamlet; **[E]** ~20–28 roofs, 120–200 souls.
**(b)** **[M]** built_share 0.654 — but **[M]** green_excess 0.630 shows most of that "density" is *forest canopy stipple*, not fabric. The hamlet itself occupies **[E]** ~12% of the frame. **[M]** cells_across 31.5 (window over the clearing) — inflated by tree rounds inside the window.
**(c)** A main lane with one fork, exactly §5's hamlet line. Two classes only: the lane (cart-wide) and foot-paths into the trees.
**(d)** Houses front the lane on both sides with deep garden strips running back to the tree line; the strips are the *only* block structure.
**(e)** None.
**(f)** A small stream crossing one corner of the clearing; a plank footbridge.
**(g)** One: the cleared ground vs the forest wall.
**(h)** **[E]** 2 — a chapel and a saw-pit/timber yard, both about 2× house footprint.
**(i)** **The forest is a wall, and the clearing's edge is ragged** — assarted land, with stumps and irregular bites into the canopy. That irregular edge is the single realism carrier.
**(j)** The clearing is close to elliptical; a real assart has a lobed, road-following shape. Forest canopy stipple density is uniform edge-to-edge — real canopy thins at the margin.
**(k)** **[M]** ink #120F0A (near-black — the heaviest ink in the low band), paper #F3DFC6, value range 74–215. Trees are drawn as individual cauliflower rounds with a shadow lobe on the SE side of each — **one fixed light direction, hard-edged**, exactly §9.5's shadow ruling. **Mechanic:** canopy = clustered rounds each with a same-direction crescent, never a single green blob.

---

## BAND 2 — VILLAGE (hf3, hf13, hf14, hf15, hf16, hf17, hf52, hf59)

### hf3 · village-organic ★ — *the named star reference*
**(a)** Village; **[E]** ~70–90 roofs, 400–600 souls. True plan.
**(b)** **[M]** built_share 0.342, open_share_in_core 0.055, dense_share_in_core 0.566; **[M]** cells_across 31 over the village window. The settlement occupies **[E]** ~30% of the frame; fields the rest.
**(c)** **THREE classes, clearly differentiated [E]:** the through-road (widest, drawn with a doubled edge and verge line), the village lanes (narrower, single-line edges), and field tracks (thin, dashed, dying into the furlongs). The web is a fork-and-loop around the green, not a grid.
**(d)** **The defining structure: house-at-the-frontage, garden-strip-behind.** Every dwelling sits on the lane with a green toft running back; strips are separated by dotted/dashed tenure lines. Buildings are individual solids, rarely abutting — correct for a village (party walls are an urban land-price phenomenon).
**(e)** None. The manor compound at the NE has its own light enclosure wall — a *precinct*, not a circuit.
**(f)** The river passes to the S and W in a broad bend; the village sits INSIDE the bend on the dry side — **BANKSIDE, not through** (§5.0b.2). Two bridges. A mill sits ON the water at the bend's outside.
**(g)** Reads without labels via texture: the green core (open), the lane ribbons (built), the manor precinct (walled, large-footprint), the mill (isolated, on water).
**(h)** **[E]** 4 legible: church (heaviest ink, largest footprint ≈ 5× house), mill, manor, inn. §161n rungs visibly applied at village scale — exactly §16.4.
**(i)** Three things: **(1)** the triangular green with the well at its centre and three tree rounds pinning its corners; **(2)** the fields TILE contiguously with hedgerow-and-tree boundaries — no floating parcels, no bare gaps (§16.1 rendered); **(3)** the lanes bend around things that were already there.
**(j)** **THE SUNBURST PRIOR, at full strength** — the strip fields radiate from the village centre with near-perfect angular symmetry. §16 already rules this: orientation-toward-the-village is LAW, terrain-blind radial symmetry is BANNED. This plate shows both at once; take the orientation, refuse the symmetry.
**(k)** **[M]** paper #FAECDA, ink #44372E, value range 141–233, chroma 42, wash_within_σ 3.19, paper_grain_σ 2.25, fill_tone_IQR 9.8, stroke p25/p50/p90 = 4/6/13 px (ratio 3.25). Native crop shows: **dip-pen waver on every line** including nominally straight plot boundaries; roof masses with a single ridge line and 2–4 small circle accents; **wash mis-registered against the ink by 2–6 px in places** (colour running past the outline). **Mechanic — the three that make it painted:** (1) per-line waver amplitude ≈ 0.5–1.5× the stroke width, seeded; (2) fill wash offset from the ink path by a small seeded vector, with the fill's own edge softened; (3) tone jitter ±5 L between adjacent roofs.

### hf13 · village-fishing — *the densest village in the corpus*
**(a)** Large village / small town on a harbour; **[E]** ~180–240 roofs.
**(b)** **[M]** built_share 0.502, dense_share_in_core 0.641, open_share 0.046; **[M]** cells_across 48. Very tight — this village packs like a town because the buildable shelf is narrow.
**(c)** **[E]** Three classes: the quay street (widest, following the water), two climbing lanes, and stepped alleys between terraces. **[M]** street p50 0.16, p99 5.34 plot-widths — a genuinely long tail (the quay).
**(d)** **PARTY-WALL TERRACES** — continuous ranges of abutting houses following the shore contour, subdivided by single interior lines. Yards are behind, on the uphill side. This is the corpus's clearest evidence that **density is achieved by abutment, not by shrinking gaps** (§17.1 confirmed by reference).
**(e)** None — the water and the slope are the defence.
**(f)** Sheltered harbour with **stone quay and jetties projecting INTO the water**; boats moored against them. Fish-drying racks on the strand. The town meets the water with WORK, not with a decorative edge.
**(g)** Three read by texture: the quay/working edge (long sheds, racks), the terraced housing (fine grain), the upper fields.
**(h)** **[E]** 3 — church on the rise, a long net-loft/store on the quay, a larger merchant house.
**(i)** **The contour rules everything.** Streets run along the slope, ranges follow the streets, alleys run up. Nothing is axis-aligned to the frame; everything is aligned to the land.
**(j)** The harbour mouth is suspiciously symmetric. Roof tones are slightly too uniform across the whole terraced mass — real ranges vary house to house.
**(k)** **[M]** paper #FEEDD3, ink #2D1A12, wash_within_σ 3.40, tone_IQR 6.1 (the *narrowest* jitter band among the village plates), stroke 5/8/18. **Mechanic:** the terrace range is drawn as ONE outline at heavy weight with INTERNAL party-wall lines at roughly half that weight — a two-tier lineweight inside a single mass. That is the packing idiom to clone.

### hf14 · village-mining — *the relief plate*
**(a)** Village at a mine; **[E]** ~60 structures + workings.
**(b)** **[M]** built_share 0.706 — heavily inflated by hachure fields; the settlement is **[E]** ~15% of frame.
**(c)** **[E]** Two classes plus a special: the valley road, the workings track (dashed, climbing), and the **haulage line** to the adits.
**(d)** **RIBBON DEVELOPMENT ALONG THE CONTOUR** — houses strung in two rough lines along the valley road, with the mine compound as a separate walled cluster upslope. A polycentric read at village scale.
**(e)** The mine compound has its own light enclosure; the village has none.
**(f)** A leat/canal cut along the slope feeding a wheel — a **terraform** (§161b), and its cut is visible in ink.
**(g)** Three: village fabric, the workings (spoil heaps as stippled fans, headframes, adit mouths), the worked slope (terraced).
**(h)** **[E]** 3 — chapel, the count-house/overseer's dwelling at the workings (§16.5.4, the Cornish precedent, present in the reference), a wheel-house.
**(i)** **The spoil is drawn.** Waste heaps fan downslope from each adit, and the land below them is visibly poorer. The economy has scarred the terrain, and the scar is the realism.
**(j)** Hachure direction is uniform across the whole slope rather than following contour normals in places. Partly oblique in the headframes.
**(k)** **[M]** paper #F6E6D6, ink #240C0B, chroma 38, paper_grain high. Hachures: **short tapered strokes, thick at the uphill end**, spaced tighter on steeper ground. **Mechanic:** relief = variable-density hachure whose per-stroke length AND spacing both key off gradient — one parameter driving two visual channels is what makes it read as slope rather than as texture.

### hf15 · village-arid — *the concentric-prior exemplar*
**(a)** Village, arid; **[E]** ~70 roofs.
**(b)** **[M]** built_share 0.445, dense_share 0.582, cells_across not run (concentric geometry distorts the window).
**(c)** A ring lane plus radial spurs. Two classes.
**(d)** Courtyard houses — each dwelling is a small solid with an interior court, packed into wedge blocks between the ring and the radials.
**(e)** A light perimeter wall/hedge following the ring exactly.
**(f)** None flowing; a central cistern/well court is the water infrastructure (§5.0b.4 correctly expressed).
**(g)** Weak — the wedges are near-identical.
**(h)** **[E]** 2 — a domed structure and a granary.
**(i)** The arid palette (**[M]** chroma 50, paper #FEFFFE at the highlights, mud-tone fills) and the courtyard-house typology are genuinely different from the temperate plates without any ornament change. **This is the setting-agnosticism proof:** the same drafting conventions, a different material ladder and typology, and it reads as another world.
**(j)** ★ **THE CONCENTRIC DRIFT AT MAXIMUM — the corpus's single worst prior.** A perfect ring plan with radial spokes at even angular spacing, on flat ground, with no fact justifying it. §5.0.3 makes planned geometry reachable only with a planning authority in the facts. **Do not emulate; this plate is a negative reference.**
**(k)** **[M]** paper #FEFFFE, ink #3F2216, tone spread wide. Flat mud washes with granulation. **Mechanic:** the arid material ladder reads as *lower chroma separation between roof and ground* — roofs and ground are the same family, and only the ink separates them. That is a palette derivation, not a hue swap.

### hf16 · village-cold — *linear stream village*
**(a)** Village, cold climate; **[E]** ~45 longhouses.
**(b)** **[M]** built_share 0.386, open_share_in_core 0.268 (the highest among the villages — cold-climate plots are large), cells_across 48.
**(c)** One street, both banks, plus back lanes to the byres. Two classes.
**(d)** **LONGHOUSES SET GABLE-TO-STREET** in a regular rhythm, each with a long plot running back to the water or the wood. The plot rhythm is the block structure — there are no blocks.
**(e)** None.
**(f)** A stream runs THROUGH the village with houses on both banks and three footbridges. At this width (**[E]** ~1/3 of a house length) the crossing is cheap, so THROUGH is earned — the correct reading of §5.0b.1 at small scale.
**(g)** Two: the street ribbon and the byre/stackyard belt behind it.
**(h)** **[E]** 2 — a stave-form church with a stepped roof mass, a communal barn.
**(i)** **Snow-country logic drawn in plan:** buildings hard against the street for winter access, stackyards behind, no gardens. The typology explains the climate without a single climate label.
**(j)** The street is almost perfectly straight for its whole run. The two banks mirror each other too exactly — real bank pairs are asymmetric (one bank always builds first).
**(k)** **[M]** ink #13110D, paper #F9E9D3, value range 69–231 (the widest in the village band), wash σ moderate. **Mechanic:** cold palette = desaturated greens and greys pushed toward the paper, with the roofs the ONLY warm note. Value range widens; chroma narrows.

### hf17 · village-wealthy — *the prosperity read*
**(a)** Large village; **[E]** ~110 roofs.
**(b)** **[M]** built_share 0.489, dense_share_in_core 0.748 (the highest fill of any village), open_share 0.099, cells_across 60.3.
**(c)** **[E]** Three classes: a **cobbled** high street (drawn with a stipple/tick texture — paving rendered as texture, not colour), lanes, and yard alleys.
**(d)** Larger plots, several with formal walled gardens; two courtyard houses. Buildings abut along the high street and detach at the edges — **a density gradient inside a single village**.
**(e)** None; two gate-piers mark the street ends ceremonially.
**(f)** A mill leat and a formal fish pond — both terraforms.
**(g)** Legible: the high street (large, abutting, cobbled), the back lanes (small, detached), the manor/garden precinct.
**(h)** **[E]** 5 — church with tower, market cross, manor, two large merchant houses. Landmark:house footprint ratio **[E]** ~4:1, up from hf3's 3:1.
**(i)** **Prosperity is rendered as SURFACE and PARCEL SIZE, not as more buildings** — the cobbled texture, the walled gardens, the consolidated plots. Exactly §11.4's rising arm.
**(j)** The formal garden's parterre grid is drawn at a precision the rest of the plate does not carry.
**(k)** **[M]** paper #FAEAD7, ink #2D1F17, chroma 48, paper_grain_σ 4.04. **Mechanic:** paving = a dense stipple field inside the street channel at ~15% coverage, in the ROADS role's own hue one step darker. Wealth reads through a texture layer added inside an existing role, not through a new colour.

### hf52 · marsh-village — *wet ground*
**(a)** Village in a delta; **[E]** ~50 structures, dispersed.
**(b)** **[M]** built_share 0.505 (inflated by the ditch grid's line density); the settlement is genuinely dispersed.
**(c)** **CAUSEWAYS** — raised roads drawn with a doubled edge and a shadow line, crossing water on plank bridges. Plus boat channels, which function as streets.
**(d)** **THE DISPERSED PATTERN (§16.5.2) rendered exactly:** each holding is its own island with house, byre and yard ON the land, separated by drainage channels. No blocks anywhere.
**(e)** None — the marsh is the defence.
**(f)** Water is the MATRIX, not a feature: a braided channel network with reed-tick marks, a fish weir, boat landings at every holding.
**(g)** Two: the drained islands (worked, ditched) and the open reed (untouched).
**(h)** **[E]** 2 — a church on a slight rise (a terp), a timber-stack/store.
**(i)** **The ditch grid.** Every island is bounded by a straight cut, and those cuts do not align to each other — each generation drained its own patch on its own bearing. That non-alignment is what makes it read as history rather than as a pattern fill.
**(j)** Houses drawn in oblique elevation — **projection not to emulate**. Reed ticks are uniformly spaced.
**(k)** **[M]** paper #FDEDD7, ink #271A15, chroma 36 (low — wet country is a muted plate). **Mechanic:** marsh = a pale wash with **reed ticks** (3–5 short vertical strokes in a loose cluster) at ~1 cluster per 400 px², plus a slightly darker wash where flow stalls. §5b's marsh idiom, drawable.

### hf59 · monster-watch village — *defence by threat bearing*
**(a)** Frontier village; **[E]** ~65 roofs.
**(b)** **[M]** built_share 0.552, dense_share 0.608, cells_across 51.
**(c)** Two classes: the north road through the barricade, and internal lanes ringing the green.
**(d)** Buildings pack around a **central green common** (used to corral livestock overnight, per the plate's own note), backs outward. Deep plots behind.
**(e)** ★ **THE MOST IMPORTANT DEFENCE LESSON IN THE CORPUS:** the timber barricade with sharpened-stake ticks runs **ONLY along the forest edge** — the threat bearing — and stops. The other three sides are open to the fields. Two watch platforms sit on the barricade line, both facing out. **Defence follows the threat, not the perimeter.** This is §205.3's terrain-maximised law generalised to threat-maximised.
**(f)** None.
**(g)** Two: the village fabric and the forest margin (with a claw-marked abandoned farmstead OUTSIDE the line, drawn in ghost outline).
**(h)** **[E]** 2 — the hunter's lodge at **the heaviest ink on the plate** with trophy racks, and a communal barn.
**(i)** **The abandoned farmstead in ghost line, outside the barricade, with a note explaining it.** One drawn object carries the entire state.
**(j)** Buildings drawn with oblique roof faces. The green is a clean ellipse.
**(k)** **[M]** ink #1A1611, paper #FEFFFE, green_excess 0.243, value range 71–231. **Mechanic — the GHOST REGISTER:** the abandoned farmstead is drawn at ~35% ink opacity with a *broken* outline and no fill, while everything living is solid. One opacity + one dash pattern = the whole ruin/abandonment vocabulary. This is the cheapest high-value mechanic in the corpus.

---

## BAND 3 — TOWN (hf20, hf21, hf22, hf23, hf24, hf25, hf26, hf27, hf37, hf41, hf42, hf57, hf58, hf60, hf62, hf63, hf72, hf73)

### hf20 · town-trade — *the courtyard-block town*
**(a)** Town; **[E]** 2,500–4,000 souls.
**(b)** **[M]** built_share 0.503, dense_share_in_core 0.599, open_share 0.040, **[M]** cells_across 58.
**(c)** **[E] FOUR classes:** the market place (a void, ~4–5 plot-widths), two arterials from the main gates, lateral streets, and block-interior alleys. **[M]** p50 0.18 / p90 1.48 / p99 5.65 plot-widths — the widest tail in the town band, which is the market void.
**(d)** ★ **PERIMETER BLOCKS WITH INTERIOR COURTS.** Buildings form a continuous ring around each block; the block's centre is an open court/yard. **[E]** ~60–70% of blocks in this plate have a legible interior open space; **[E]** ~10–15% of those have NO visible street mouth. **This is the §204 reconciliation:** interior yards are COMMON, route-isolated sealed courts are RARE. Distinguish the two or the law and the corpus appear to contradict.
**(e)** A tight polygonal circuit hugging the fabric with round towers at every vertex, **[E]** 4 gates, each where a real road arrives. Wall-to-fabric margin **[E]** ~0.5–1 plot depth — the circuit economy law visible.
**(f)** None — a dry-sited trade town on a crossroads, with cisterns.
**(g)** Legible by grain: the market quarter (large blocks, big footprints, wide street), the residential wedges (fine grain), a warehouse strip near the main gate (long thin blocks).
**(h)** **[E]** 5 — market hall (arcaded), church, a guild/exchange, two gate-towers. Landmark:house ≈ 6:1.
**(i)** **Extramural camps** — carrier wagons, tents and pens crowd the outside of the busiest gate. §5.0e's faubourg law's earliest stage, and the tell that the town is *working*.
**(j)** The circuit is a near-regular polygon and the radial streets meet the market at even angles — the concentric prior at medium strength. Real trade towns are lopsided toward their busiest gate.
**(k)** **[M]** paper #FEFAF5, ink #472B1D, chroma 46, wash_within_σ **4.41** (highest measured in the whole corpus), tone_IQR 19.9, paper_grain_σ 2.46, stroke 5/7/17 (ratio 3.4). **Mechanic:** wash σ 4.4 means the fills are visibly *blotchy* — a single roof carries a 10–15 L internal swing with darker pooling at one or two edges. Reproducible as: per-fill, a seeded 2–4 stop irregular value ramp plus a darker rim on the 1–2 edges nearest the fill's own centroid-offset vector.

### hf21 · town-temple — *the polycentric religious town*
**(a)** Town; **[E]** 3,000–5,000 souls.
**(b)** **[M]** built_share 0.478, dense_share 0.576, open_share 0.080, **[M]** cells_across 56.
**(c)** **[E]** Four classes, and one of them is NAMED BY FUNCTION: the *Via Sacra* connecting the monastery hill to the town gate is drawn wider than any town street. Then arterials, laterals, alleys.
**(d)** Dense perimeter blocks; the monastery precinct is a walled compound with its own cloister quad and orchard rows.
**(e)** ★ **TWO SEPARATE CIRCUITS:** the monastery has its own precinct wall on its hill; the town has a **D-shaped** circuit whose straight side is the river. **[E]** 6 gates, each labelled and each on a real road (Porta Peregrina ×3 toward the pilgrim road, Porta Mercatorum ×2 toward the market road, Porta Bistonta). The gate NAMES encode the road's destination — a truth-layer mechanic we can beat, since our roads have real neighbours.
**(f)** BANKSIDE: the river forms the fourth wall; the waterfront carries a water gate and mills. §161m.3 exactly.
**(g)** Very legible: the monastery hill (large courts, orchard grid), the pilgrim street (inns, wide), the market quarter, the riverside working edge.
**(h)** **[E]** 7 — basilica, cloister, hospice, market hall, two gatehouses, a bridge chapel. **The monastery outscales the town's own civic hall by ~3:1**, which is §161l's specific-power law drawn: you can see who really rules.
**(i)** **The polycentric structure with a named connecting road** — §5.-1.3's subseed law as a finished picture. Two sites, one road, one town.
**(j)** The town's D is a little too clean an arc.
**(k)** **[M]** paper #FEFEFD, ink #250D08, chroma 48, green_excess 0.001 (a nearly green-free plate — the ground is all tan/ochre). **Mechanic:** the precinct is set apart by a **lighter interior wash + a heavier boundary line + orchard row texture**, three cheap channels; no new hue is introduced. That is how §18.1's liberty/sanctuary precinct should render.

### hf22 · town-castle — *terrain-maximised defence*
**(a)** Town under a castle; **[E]** 3,000–4,500 souls.
**(b)** **[M]** built_share 0.619, dense_share 0.669, open_share 0.021 — the tightest packing in the town band.
**(c)** **[E]** Four: the castle approach ramp (switchbacked), the main street, laterals, alleys.
**(d)** Crescent-shaped blocks wrapping the castle's foot, following the contour. Party-wall ranges throughout.
**(e)** ★ **THE CLIFF FLANK CARRIES NO WALL.** The castle sits on a crag; on the crag side there is no masonry at all — the rock is the wall. The town's circuit runs only across the approachable ground and dies into the crag at both ends. **[E]** 3 gates. A drill ground sits OUTSIDE the town wall, between town and castle. §205.3 rendered: *a cliff flank needs no wall — drawing one is the violation.*
**(f)** None visible.
**(g)** Three by scale: castle (monumental, own ward), the town's dense fabric, the drill/muster ground (empty, bounded).
**(h)** **[E]** 4 — keep, gatehouse, church, hall.
**(i)** **The town is visibly SHAPED by the castle** — every street bends toward the ramp, and the block depth shrinks as the ground steepens. Cause and effect are drawn.
**(j)** The lower town's outer edge is a smooth arc where terrain should be breaking it.
**(k)** **[M]** paper #FEFEFE, ink #261914, chroma 52 (high). **Mechanic:** rock is drawn as **irregular closed hatching cells** — small angular polygons with parallel interior strokes at varying angle — which is a different primitive from slope hachure. §5b needs both, and they must not share one generator.

### hf23 · town-struggling — *the decline read at town scale*
**(a)** Town; **[E]** 2,000–3,000 souls in a shell built for more.
**(b)** **[M]** built_share 0.655, dense_share_in_core 0.774, **[M]** cells_across 79 (the finest grain in the town band — this is an old, subdivided fabric).
**(c)** **[E]** Three classes, and the market street is visibly NARROWED by encroachment — stalls hardened into building lines. §18.4's market colonisation, drawn.
**(d)** Fine-grained blocks, heavily subdivided (§11.4's falling arm: the fine house split into tenements). One block interior is drawn as **hatched rubble** — a burnt/collapsed parcel not yet rebuilt.
**(e)** D-shaped circuit closing against the river; **[E]** 3 gates, one of which is drawn narrowed/blocked.
**(f)** BANKSIDE. Quays and small jetties along the bank; the far bank is countryside with a single bridgehead structure.
**(g)** Legible: the shrunken market, the working quay, the derelict block, the still-solid civic core.
**(h)** **[E]** 4, and one is drawn shuttered (its yard blank, its outline lighter).
**(i)** **Nothing is broken — things are just closed.** The fabric is whole and the life is thin. That is §161g.4's "economic collapse — the eeriest register" and it is achieved with opacity and emptiness, not with damage.
**(j)** —
**(k)** **[M]** paper #FCEDDC, ink #2F231B, value range 119–231, paper_grain_σ high. **Mechanic:** derelict = full ink outline at reduced weight + NO fill (paper shows through) + the yard's texture removed. Three subtractions, no additions.

### hf24 · town-siege — *the state register*
**(a)** Town under siege; **[E]** 3,000–4,000.
**(b)** **[M]** built_share 0.387, open_share_in_core 0.093, dense_share 0.615, center_edge_ratio 1.87 (a notably FLAT gradient — this is a planned, evenly-built town).
**(c)** Radial main streets from the gates to a central place, plus a lateral ring. Three classes.
**(d)** Regular blocks with courts — a bastide/planted-town grain, which is legitimate here (a fortress foundation).
**(e)** ★ A polygonal circuit with **projecting angle-towers**, a ditch, and **[E]** 4 gates, all drawn BARRED. The besieger's camp — tent rows, siege lines, a battery — sits outside ONE gate, on one bearing. Trampled ground is washed in around it.
**(f)** The river runs THROUGH, and the wall crosses it at both ends with **water gates carrying chain booms** — the single best solved detail in the corpus for the §205.1 wall-meets-water problem.
**(g)** Weak internally (the plate spends its ink on the state).
**(h)** **[E]** 4 — citadel, church, hall, gatehouses.
**(i)** **CALM INK UNDER DURESS.** Nothing is red, nothing is dramatic; the siege is drawn as *more lines in one place*. §7's register law, and the corpus obeys it consistently across every state plate.
**(j)** The polygon is regular and the radials evenly spaced — the concentric prior again, though defensible for a fortress foundation. **[M]** the plate is under-inked overall (ink cluster L100, the second-lightest in the corpus) — the fabric is too faint against the state marks.
**(k)** **[M]** paper #FBEAD5, ink #684633 (light), palette-8 cluster range 82. ⚠ **§244-FOLD — "the narrowest value range of any town plate" is REFUTED** (hf57 measures 78) **and the quantity is retired anyway. The verdict itself SURVIVES, restated on ink L: hf24's ink is L76.3 — UNDER-INKED (> 62) and the second-lightest-inked town plate in the set after hf60's 87.6.** [M, CSV] This is a *defect*: siege should not thin the ink hierarchy, and here it demonstrably did. **Mechanic:** state marks (tents, lines, batteries) must be drawn in the SAME ink family and weights as the fabric, added as new geometry — never by lightening the town to make the siege pop.

### hf25 · town-plague — *quarantine*
**(a)** Town; **[E]** 3,000+.
**(b)** **[M]** built_share 0.256, open_share_in_core 0.207, dense_share 0.270 — **anomalously low**, and the reason is a defect (below).
**(c)** Three classes; one street drawn closed with a barrier.
**(d)** Blocks drawn as outlines. The infected quarter is filled with **heavy black cross-hatch** — the only dark mass on the plate.
**(e)** A circuit with **[E]** 4 gates, one barred; the pest-house sits OUTSIDE.
**(f)** A river at one edge, minimally engaged.
**(g)** Strong: the hatched quarantine quarter vs everything else, plus the extramural belt (lazaretto tents, *fosse comuni* pit rows, a provisional market held outside the gate).
**(h)** **[E]** 3 in the drawn half.
**(i)** **The extramural response belt.** Pits, pest-house and a relocated market, all placed OUTSIDE at correct distances — §161c's EXTRAMURAL-NEAR ring doing real work under a state.
**(j)** ★ **THE EMPTY-BLOCK DEFECT: roughly the western two-thirds of the town has block outlines with NO BUILDING FABRIC INSIDE.** It is a rendering failure, not a design choice. **Do not emulate — and note it is exactly the failure mode a block-wash LOD shortcut produces**, which is a live risk for our own metropolis band.
**(k)** **[M]** paper #FCEBD3, ink #361F16, value range 122–233. **Mechanic:** quarantine = cross-hatch at ~45°/135° over the affected parcels *on top of* their normal fill, not instead of it. The hatch is the addition; the fabric survives beneath.

### hf26 · town-fire-rebuild ★ — *three grains in one frame*
**(a)** Town; **[E]** 3,500–5,000.
**(b)** **[M]** built_share 0.485, dense_share 0.589, open_share 0.006.
**(c)** **[E]** Four classes, and the classes DIFFER BY QUARTER: the rebuilt quarter has straight, uniform-width streets; the old core has narrow crooked lanes.
**(d)** ★ **THE MONEY OBSERVATION OF THE CORPUS.** Three visibly different grains coexist: **(1)** the **burnt zone** — black wash with roofless outlines standing in it; **(2)** the **new quarter** — regular rectangular blocks, uniform plot widths, buildings set back to a common line, in a **distinctly different roof colour** (pink/red new tile vs the old town's brown); **(3)** the **surviving old core** — irregular, dense, curving, brown. All three abut directly.
**(e)** One circuit, older than all three quarters, unchanged — the wall outlived the fire.
**(f)** A river along one edge with quays.
**(g)** The most legible district read in the corpus, achieved **entirely by grain and material** with no boundary lines at all.
**(h)** **[E]** 5, one of which is a burnt shell at full monumental footprint.
**(i)** **Material differentiates vintage.** The new quarter's roofs are a different pigment because post-fire regulation forced tile. That single colour decision does more narrative work than any label.
**(j)** The new quarter's grid is *perfectly* regular; real post-fire replanning preserved property lines and stayed slightly wonky.
**(k)** **[M]** paper #F5E1C8, ink #261C18, chroma 53, value range 88–220. Burnt ground: a dark umber wash with the ink UNDER it still visible. **Mechanic — THE VINTAGE TRIAD:** a quarter's build-date drives (1) block regularity, (2) plot-width variance, (3) roof pigment. Three coupled dials off one derived value. This is the highest-value single mechanic in the atlas.

### hf27 · town-unrest — *the crowd state*
**(a)** Town; **[E]** 4,000–6,000.
**(b)** **[M]** built_share 0.560, dense_share 0.688, **[M]** cells_across 77 — a fine, old fabric.
**(c)** **[E]** Four classes, several drawn BLOCKED by barricades (short heavy bars across the channel with debris ticks).
**(d)** Dense perimeter blocks with interior courts; heavy tone jitter between adjacent roofs.
**(e)** Circuit with **[E]** 4 gates, one labelled *porta clausa*.
**(f)** Minor.
**(g)** Legible: the civic square (crowded), the barricaded quarter, the garrison block.
**(h)** **[E]** 5.
**(i)** **The crowd is drawn as stipple, not as figures.** A dense dot field fills the square. Unrest is a texture, which keeps §10.D22's no-portraiture law and still reads instantly.
**(j)** —
**(k)** **[M]** paper #FCEBD8, ink #0E0804 (the near-black extreme), value range 90–232 — a high-contrast plate. **Mechanic:** crowd = a Poisson dot field at ~1 dot per 250 px², dots at 2–3 px, clipped to the square's polygon, in the Labels/Ink hue. Cheapest possible state mark, and it obeys the time-grain law only while unrest stands (§10.D21).

### hf37 · town-abandoned — *the elegy*
**(a)** Town shrunk inside a city's shell; **[E]** current ~600 in a circuit built for ~5,000.
**(b)** **[M]** built_share 0.564 but dense_share_in_core **0.912** and open_share_in_core **0.000** — the *occupied core* is the densest thing measured in the corpus, precisely because it is a small dense huddle. **[M]** center_edge_ratio 4.46. This is the demotion signature in numbers: **very high core density, very low overall extent occupancy.**
**(c)** Streets survive in the ruin belt as **ghost lines** — the last thing to die (§161g.1 confirmed by reference).
**(d)** Occupied core: dense, washed, coloured. Ruin ring: roofless shells drawn as outline-only rectangles with no fill, scrub washes and garden strips reclaiming the block interiors.
**(e)** The full-size old circuit stands, with **[E]** 2 gates visibly bricked. No inner line here (compare hf70, which has one).
**(f)** A river outside the wall with an intact bridge — infrastructure outliving its traffic.
**(g)** Two, brutally clear: alive vs dead.
**(h)** **[E]** 2 — a domed cathedral at full monumental ink standing over a village-sized population, and a hall. **The oversized survivor is the demotion tell** (§161g.2).
**(i)** **Ground reclaims in stages, and the stages are drawn:** roofless-but-standing → collapsed footprint → grassed foundation line → field boundary. Four visibly different treatments in one belt.
**(j)** —
**(k)** **[M]** paper #F7E6D3, ink #432B23, value range 127–227, chroma 40 (muted). **Mechanic — THE FOUR-STAGE DECAY LADDER:** (1) full outline, no fill; (2) broken outline, rubble stipple; (3) foundation line at 40% weight with green wash over; (4) a field-boundary-weight line only. One age parameter, four discrete treatments — discrete, not a fade, which keeps §9.2's no-gradient law.

### hf41 · boomtown ★ — *growth drawn honestly*
**(a)** Town growing fast; **[E]** old core 1,500, new fringe adding as much again.
**(b)** **[M]** built_share 0.380, dense_share 0.648, **[M]** center_edge_ratio 7.00 — a **steep** gradient, which is the growth signature: a hard old core and a thin new edge.
**(c)** Old core: crooked, narrow. New fringe: straight, wide, and — the key detail — **platted but unbuilt streets drawn as DASHED lines with survey STAKE markers**.
**(d)** Three grains again: dense walled core; a fringe of large sparse plots with single sheds and **half-built L-shapes**; and a surveyed-only ring with nothing on it.
**(e)** The old circuit encloses only the core; the growth is entirely extramural. §5.0e's faubourg default confirmed.
**(f)** A creek with a new plank landing.
**(g)** Three by grain and completeness.
**(h)** **[E]** 4, two of them brand new (a large store and a counting house) at *larger* footprint than the old core's own.
**(i)** ★ **THE SURVEYED-NOT-BUILT RING.** Drawing the *plan* of growth that has not yet happened is the most sophisticated single idea in the corpus. It makes the town's future legible on the same leaf as its past.
**(j)** The new grid is machine-regular.
**(k)** **[M]** paper #FDF2E2, ink #1D130E, value range 111–241, paper_grain_σ high. **Mechanic:** the survey ghost = a 6-2 dash at 40% ink weight with a 3 px filled square at each intersection. Cheap; and it slots directly into §11.1 promotion and §10.A8's growth arm.

### hf42 · refugee-camps — *migration influx*
**(a)** Town + camps; **[E]** town 3,000, camps adding ~800.
**(b)** **[M]** built_share 0.392, open_share_in_core 0.160, center_edge_ratio 8.15 — again a steep gradient, the influx signature.
**(c)** Three classes inside; outside, the camp rows are their own orthogonal micro-grid of lanes between tent ranks.
**(d)** Town: wedge blocks. Camps: **tent rows** drawn as small triangles in regular ranks, with wagons at the ends and a charity kitchen at the centre.
**(e)** Circuit with round towers at every vertex; **[E]** 4 gates. The camps press against ONE gate.
**(f)** Minor.
**(g)** Sharp: walled town / camp belt / open field.
**(h)** **[E]** 4 inside, 1 outside (the relief kitchen).
**(i)** **The queue.** A line of small dots runs from the camp to the gate. One stroke of narrative that costs almost nothing.
**(j)** The town is a near-regular polygon with even radial wedges — concentric prior. Tent ranks are perfectly regular; real camps clump.
**(k)** **[M]** paper #F9E5CC, ink #443225, chroma 55. **Mechanic:** the camp is a THIRD grain class alongside built and ruined — small, regular, repeated, un-outlined units on bare ground. §11.9's tents→huts→parcels arc needs exactly this as its first frame.

### hf57 · famine-town — *the thinnest plate*
**(a)** Town, explicitly "3,000 souls, year of famine".
**(b)** **[M]** built_share 0.200, the lowest of any town plate. ⛔ **§244-FOLD — "ink share the lowest of any town plate … almost no dark values at all" is REFUTED, and its refutation is the whole point of the replacement proxy.** hf57's **ink measures L37.9 — FULL INK**, better than the corpus median and far from the 62 gate; the light-inked town plates are hf60 (87.6) and hf24 (76.3), not this one. **What is thin here is the ACCENT BUDGET and the wash, not the ink hierarchy** — which is exactly the distinction §2.4's banned prior #8 exists to draw, and this plate is its *counter-example*, not an instance of it. Famine is drawn as thinness **by subtraction of accents**, and the measurement says the fabric's ink was never lightened. [M, CSV]
**(c)** Two classes only; the lanes read faint.
**(d)** ★ **LIVESTOCK PENS INSIDE THE WALLS**, occupying four block interiors — the countryside brought in for safety. Market stalls drawn as **empty frames** (outline only, no goods stipple).
**(e)** A circuit with wall-walk crenellation ticks; gates open.
**(f)** None.
**(g)** Legible: pens, the emptied market, the granary precinct (the only heavy-ink building on the plate), the cloister.
**(h)** **[E]** 2 at full weight — granary and church-cloister — and **the granary is drawn heavier than the church**, because in a famine year it is the more important building. Prominence responding to state, not just to rank.
**(i)** **Gleaners drawn in the stubble field outside**, and a dotted queue to the granary. The state is expressed *outside* the walls as much as inside.
**(j)** The circuit is an even oval with regular bastion bumps.
**(k)** **[M]** paper #FEF9ED, ink #38180F but only 0.5% of pixels reach it. ⚠ **§244-FOLD — the published `paper_grain_σ 2.18, wash σ 1.22` DO NOT REPRODUCE** (hf57 was not among the 12 plates the aesthetic instrument was run on); measured, they are **grain σ 1.39 · wash σ 1.85** [M, CSV]. Both are genuinely low, so "the flattest, palest plate in the set" holds in kind — but the *flattest* wash of MF-S1's 49 is hf58 at 1.22, and the palest paper is this plate at **L246.3**. **Mechanic — THE THINNING REGISTER:** famine = fill saturation dropped one band, accent budget cut (~50% fewer ticks/stipples), and stall/market furniture drawn as outline-only. Subtraction, uniformly applied, with the granary exempted and *raised*.

### hf58 · martial-law — *the fullest-colour town*
**(a)** Town under occupation; **[E]** 4,000–6,000.
**(b)** **[M]** built_share 0.294 (block masses are solid, so the interior has few edges — this measure under-reads solid-fill styles; noted as a method caveat), **[M]** cells_across 46.5.
**(c)** **[E]** Four classes, plus **movement arrows** drawn along the patrol streets and a **dashed cordon** enclosing the forum and drill field.
**(d)** ★ Blocks drawn as **solid coloured masses** — terracotta, ochre, sage — with dark outlines and *no interior building lines*. Inside several blocks, **sage-green interior yards** are cut out. **[E]** ~45% of blocks show a green interior yard; **[E]** ~5% are route-isolated.
**(e)** Wall with round towers; **[E]** 5 gates, ALL with soldier checkpoints (barrier glyph + brazier) drawn just outside.
**(f)** None.
**(g)** Very legible via colour: military precinct (the barracks ranges, hatched roofs, grey), forum (void), boarded shops (hatched), residential (terracotta).
**(h)** **[E]** 4 — bell tower, curia with heraldry, garrison, gate towers.
**(i)** **Control is drawn as ANNOTATION over unchanged fabric** — arrows, checkpoints, cordons. The town itself is not redrawn. This is exactly our DM-lens/state-dress separation.
**(j)** Colour saturation is at the top of the corpus range and pushes toward "modern GIS fantasy" (the square §9.6 says FTG owns). Individual buildings are *not resolved* inside blocks — a legibility loss at study range.
**(k)** **[M]** paper #FEF3E0, ink #140F0C, chroma 52, **[M]** fill_tone_IQR **38.6** (the second-widest jitter measured — this is what block-level colour coding produces), wash_within_σ 1.22 (flat — because blocks are solid). **Mechanic:** heraldry renders as a small solid device on a hanging-shield outline beside the civic seat; ~2 devices per plate maximum. §12.4's derived heraldry has its drawn precedent here.

### hf60 · spymaster-copy ★ — *our DM lens, already drawn*
**(a)** Town; **[E]** 3,000–4,000. Explicit scale bar "0–40 m".
**(b)** **[M]** built_share 0.421, dense_share 0.621, **[M]** cells_across 44.7.
**(c)** **[E]** Four classes; the town square is a clear void.
**(d)** Blocks are tan masses **subdivided by visible party-wall lines into individual units** — the best legible compromise between mass and detail. **[E]** ~12 courtyard structures in the NE quarter (the wealthy corner) with real interior courts; elsewhere courts are rare. **Corpus court frequency measured by eye on this plate: ~14% of blocks carry an interior court; ~3% are route-isolated.**
**(e)** A half-ring circuit closing the landward side, **[E]** 6 towers, 3 gates, dying into the river at both ends.
**(f)** ★ **BANKSIDE, textbook.** The river runs along the SW; the town sits entirely on the NE bank; a smuggler's landing with an anchor glyph sits below the wall.
**(g)** Legible: the wealthy NE (large courtyard blocks), the packed centre, the waterfront.
**(h)** **[E]** 3 at fabric weight — the plate deliberately keeps landmarks low so the *annotations* carry the reading.
**(i)** ★ **THE ANNOTATION LAYER IS A SEPARATE INK.** Gang boundary = red dotted; night-watch route = brown dashed with arrowheads; sigil roundels in red circles; leader-line labels. The base map is untouched underneath — flip the layer off and it is an ordinary town.
**(j)** —
**(k)** **[M]** paper #FEFEFE, ink #6F5546 — ★ *the lightest ink in the corpus*, and **§244-FOLD CONFIRMS IT AT CORPUS SCOPE: L87.6 is the maximum over all 313 plates**, so this is one of the few Part-1 superlatives the 313-plate pass promotes rather than demotes [M, CSV]. (Deliberate: the plate is low-contrast so the red annotations dominate.) **[M]** palette-8 cluster range 84 — ⚠ **"the narrowest" is REFUTED** (hf10 71, hf50 78, hf57 78 are all narrower) and the quantity is retired regardless; **[M]** wash_within_σ 1.82, tone_IQR 15.4. **Mechanic — THE DM OVERLAY CONTRACT:** annotation ink is (1) a different hue family (red/rust), (2) always dashed or dotted, never solid, (3) always accompanied by a leader line and a serif label, (4) drawn above everything with no interaction with the fabric's own ink. Four rules; the whole DM lens.

### hf62 · bankside-town ★ — *the §5.0b.2 portrait*
**(a)** Town; **[E]** 2,500–3,500. "Anno M.D.L."
**(b)** **[M]** built_share 0.438, dense_share 0.601, open_share_in_core 0.124, **[M]** cells_across 64.6.
**(c)** **[E]** Four: the waterfront quay street (open, widest), two arterials from the landward gates, laterals, and block alleys.
**(d)** Dense perimeter blocks with courts; the blocks nearest the water are LONGER and thinner (warehouse depth), the ones inland squarer.
**(e)** ★ A **crenellated half-ring** wrapping the landward side, meeting the water at both ends; the waterfront closes with a **lighter wall and a water gate**. This is §161m.3's proven half-ring drawn exactly: heavy works landward, light works at the water.
**(f)** ★ BANKSIDE with everything: a quay wall, a bridge with a gatehouse mid-span, moored boats, a small **bridgehead hamlet on the far bank** (5 buildings, no wall), and **two mill races cut through the town** from the wall to the river — visible terraforms with mills on them.
**(g)** Legible: the waterfront working strip, the dense core, the bridgehead settlement.
**(h)** **[E]** 5 — bridge gatehouse, water gate, a large hall, warehouses, mills.
**(i)** ★ **THE FAR BANK IS COUNTRYSIDE WITH A TOEHOLD.** Five buildings and a road. That asymmetry is what "bankside" means, and it is the single strongest refutation of the default-bisection prior in the whole corpus.
**(j)** The wall's crenellation ticks are perfectly even.
**(k)** **[M]** paper #F8E3C6, ink #3D2D22, chroma 56, **[M]** paper_grain_σ **3.18** (the highest measured — this plate has the most visible paper texture), wash_within_σ 3.65, stroke 4/7/16 (ratio 4.0 — the second-steepest lineweight hierarchy measured). **Mechanic:** mill races are drawn as narrow grey channels with a hard edge on the cut side and a soft one on the natural side — a terraform reads as *worked geometry against unworked*, which is §161b's visible-work rule in one line pair.

### hf63 · near-river-town ★ — *the §5.0b.3 portrait*
**(a)** Hill town ("Oppidum Collis"); **[E]** 1,500–2,500.
**(b)** **[M]** built_share 0.404, dense_share_in_core 0.676, open_share 0.037.
**(c)** Inside: a spine street along the ridge with lateral drops. Outside: **a dashed pack-track with mule glyphs** running down to the river compound.
**(d)** ★ Fabric packed into the walled figure-of-eight, blocks following the contour rings.
**(e)** ★ **THE WALL TRACE IS A DUMBBELL** because the hill has two summits and a saddle. The circuit is not a shape imposed on the land — it *is* the land's defensible line. **[E]** 1 main gate (Porta Fluminis, named for where the road goes). Contour hachures wrap the whole hill.
**(f)** ★ **NEAR.** The river is a walk away at the bottom of the slope. The town has **wells and a cistern** inside (labelled *puteus*, *cisterna*) and a **separate riverside compound** — warehouse, water-mill, wharf, *domus navicularii* — its own small walled enclosure with no dwellings but the keepers'. §5.0b.3 exactly, plus §5.-1.3's second nucleus.
**(g)** Three: the hill town, the river compound, the terraced/vineyard slope between them.
**(h)** **[E]** 5 — cistern, two wells, the mill, the shippers' house. **The landmark set is dominated by WATER INFRASTRUCTURE because the town is dry** — §5.0b.4's "water infrastructure gains prominence instead," drawn.
**(i)** ★ **THE MULES ON THE TRACK.** Six tiny pack-animal glyphs on the road between town and wharf. The logistics of the NEAR relationship — everything must be carried up — is made visible in one accent.
**(j)** The contour hachures are evenly spaced regardless of gradient.
**(k)** **[M]** paper #FCE9CF, ink #462315, **[M]** chroma 68 — the second-highest in the corpus; the field patchwork here is the most colourful in the set (terracotta, sage, ochre, rose). **Mechanic:** field patches take 5–6 discrete tones from ONE muted family, assigned per-parcel by a seeded pick with no two adjacent parcels sharing a tone. That constraint (adjacent-distinct) is what stops a patchwork looking like noise.

### hf72 · dumbbell-town ★★ — *the polycentric portrait and the burgage evidence*
**(a)** Town, two nuclei ("Mappa della città a due nuclei"); **[E]** 4,000–6,000.
**(b)** **[M]** built_share 0.561, dense_share 0.620, open_share_in_core 0.128, **[M]** cells_across 73.7, **[M]** chroma **69.5 — the highest in the corpus**.
**(c)** ★ **FOUR CLASSES, AND THE HIERARCHY IS THE STORY:** *Via Grande* (the connecting spine, widest by far, named), the two nuclei's own main streets, laterals, and back alleys. **[M]** street p50 0.12 / p90 0.91 / p99 4.00 plot-widths.
**(d)** ★★ **THE BURGAGE SERIES, RENDERED PERFECTLY.** Along Via Grande: long narrow plots perpendicular to the street, **[M]** plot depth ≈ 4–6× plot width (measured on the native crop), each with a **terracotta building mass at the street frontage occupying ~30–45% of the plot depth** and a **sage-green toft behind**. Buildings abut side-to-side into a continuous frontage, broken by occasional **through-gaps where the green reaches the street** — the ginnels of §17.6, derived from plot decisions exactly as the law says. **[E]** ~1 gap per 6–9 plots.
**(e)** ★ ONE wall enclosing the WHOLE dumbbell — including the thin ribbon between the nuclei. The castle sits at the west nucleus on a crag with its own inner works; the east nucleus is open to the river. **[E]** 1 main gate + a water gate.
**(f)** The river is at the east end only: *Porto Fluviale* with quays, boats and the *Mercato del Pesce* adjacent. BANKSIDE at one end of a town that is otherwise dry.
**(g)** Superbly legible without labels: **Rocca et Borgo Alto** (tight, high, defended, terracotta-heavy), the **ribbon** (burgage plots, green tofts, uniform rhythm), **Piazza Nuova** (a void at the junction — the newest and most regular space), the **port quarter** (irregular, working, boats).
**(h)** **[E]** 6 — castle, two churches, the fish market, the port, the piazza.
**(i)** ★★ **THE RIBBON IS VISIBLY YOUNGER THAN BOTH ENDS.** Its plots are regular and its buildings are uniform, while both nuclei are irregular. The town's growth history is legible in the grain — which is precisely what §5.-1.3 + §11.0's inertia law exist to produce.
**(j)** The ribbon's plot widths are *too* uniform (machine-regular); real ribbon development varies by 20–40%.
**(k)** **[M]** paper #FAE2C5, ink #5E3420, chroma 69.5, wash_within_σ 2.75, paper_grain_σ 2.07, tone_IQR 11.1, stroke 4/6/15 (ratio 3.75). **Mechanic:** roof masses carry a centre ridge line plus **Y-shaped hip lines** at the ends, at ~60% of the outline weight. Two extra strokes per building and the mass reads as a roof rather than as a rectangle. Highest value-per-op accent in the corpus.

### hf73 · terraform-plate ★ — *§161b rendered whole*
**(a)** Town/small city; **[E]** 5,000–8,000.
**(b)** **[M]** built_share 0.482, dense_share 0.718, open_share 0.043, center_edge_ratio 6.41.
**(c)** Old core: fine crooked web. Reclaimed quarter: a **regular grid of large plots**. Two entirely different street idioms in one settlement.
**(d)** Old core: tiny dense parcels. New quarter: large regular plots, many still empty (drawn as bounded but unbuilt).
**(e)** A tight circuit around the old core ONLY; the new quarter is entirely extramural. §5.0e again.
**(f)** A river loops around the south; a **mill race** with four mills cuts across the west; a **causeway** crosses the wet ground on a dotted line; a **fish pond** occupies an **old quarry**.
**(g)** ★ Five, all legible without labels: old core, market terrace, garden terraces, ditch grid, reclaimed grid.
**(h)** **[E]** 4 + the works themselves.
**(i)** ★★ **EVERY TERRAFORM SHOWS ITS WORK.** The market terrace has a heavy revetment line on its downhill edge. The garden terraces have terrace-wall ticks along each contour. The ditch grid is a rectilinear cut pattern on ground that is otherwise irregular. The causeway is raised and dotted. The quarry became a pond. **Nothing is conveniently reshaped; everything is visibly built.** This is the plate that proves §161b's visible-work rule is drawable.
**(j)** The reclaimed grid is machine-perfect. Contour lines in the NE are evenly spaced.
**(k)** **[M]** paper #F8E6CF, ink #150905, chroma 52, green_excess 0.239. **Mechanic — the four terraform primitives, each a distinct line idiom:** revetment = one heavy line with short perpendicular ticks on the downhill side; terrace = repeated light contour-following lines with tick pairs; ditch grid = a rectilinear thin-line lattice at a bearing that DISAGREES with the surrounding field bearings; causeway = a raised double line with a dotted centre. Four primitives cover the whole §161b budget.

---

## BAND 4 — CITY, METROPOLIS AND THE TERRAIN-SPECIAL SETTLEMENTS (hf4, hf30, hf31, hf32, hf33, hf34, hf40, hf50, hf51, hf53, hf5, hf70, hf84)

### hf30 · city-river ★ — *the asymmetric through-river city*
**(a)** City; **[E]** 12,000–20,000.
**(b)** **[M]** built_share 0.681, dense_share_in_core 0.759, open_share 0.014, **[M]** cells_across 90 — among the finest grains in the corpus.
**(c)** **[E] FIVE classes:** the two bridge streets (widest, continuous across the water), the quay street, arterials from each gate, laterals, and alleys. The web is radial-ish but visibly deformed by the river and the wall.
**(d)** Dense perimeter blocks throughout, finer near the centre and coarser at the wall's inner margin. **[E]** courts in ~20% of blocks; almost all have street mouths.
**(e)** An irregular polygonal circuit with towers at the vertices, hugging the fabric at **[E]** ~1 plot depth. **[E]** 5 gates, unevenly spaced — placed where the roads are, not where geometry wants them. The wall crosses the river at both ends.
**(f)** ★ **THROUGH — and ASYMMETRIC.** The west bank holds ~70% of the fabric and is visibly older and denser; the east bank is a single smaller ward. A quay basin is enclosed *inside* the wall on the south. **[E]** 2 bridges. This is the correct rendering of THROUGH: earned, not defaulted, and one bank always built first.
**(g)** Legible: the cathedral precinct (an open void with a monumental in it), the quay ward (long blocks, piers), the east-bank ward (coarser grain = younger), the extramural scatter.
**(h)** **[E]** 7 — cathedral, citadel, hall, two gatehouses, bridge chapel, quay crane.
**(i)** ★ **THE BANK ASYMMETRY plus the extramural scatter.** Half a dozen small clusters sit outside the gates along the roads, unwalled — the town leaking out (§5.0e).
**(j)** Radial street convergence is a little too clean at the centre.
**(k)** **[M]** paper #FCF8F4, ink #311910, **[M]** chroma 57, value range 98–208 (a DARK plate — this is the most heavily inked city). **Mechanic:** water = a flat mid-value wash + a darker **bank line** on both sides + 3–5 parallel **current strokes** following the channel centre, spaced wider in slow reaches. Three channels; no gradient; §9.2 held.

### hf31 · city-harbor — *pictorial; harbour grammar only*
**(a)** Port city; **[E]** 15,000+.
**(b)** **[M]** built_share 0.489, **[M]** blue_excess 0.283 — the second-most water in the corpus.
**(c)** Quay street + climbing lanes; oblique.
**(d)** Terraced ranges up the slope from the water.
**(e)** A circuit landward; the harbour closes with a **mole and a chain**.
**(f)** ★ The full §161n port ladder's top rung: **mole, pier ranks, lighthouse at the mole head, careening beach, rope-walks as very long thin sheds**. The harbour is a *built object*, not a bay.
**(g)** Legible: harbour works, warehouse strip, upper town.
**(h)** **[E]** 5 — lighthouse, customs house, arsenal, cathedral, mole.
**(i)** The rope-walk. A shed 15× longer than it is wide, because that is how rope was made. Function drives footprint shape.
**(j)** **OBLIQUE — projection not to emulate.**
**(k)** **[M]** paper #FAE8CD, ink #2A221E, top palette cluster **#828E9B** — the corpus's only genuinely BLUE-GREY dominant. **Mechanic:** sea water differs from river water by *value*, not hue: same family, one band darker, with wave ticks in shorter, denser groups.

### hf32 · city-growth-rings ★ — *§11.1 promotion drawn*
**(a)** City; **[E]** 15,000–25,000.
**(b)** **[M]** built_share 0.520, open_share_in_core 0.108, **[M]** center_edge_ratio **16.45 — by far the steepest gradient in the corpus.** That single number IS the growth-ring signature.
**(c)** Radials continuing from the old core through the new ring and out into ribbon suburbs. Three classes inside the old wall, two in the new ring.
**(d)** ★★ **TWO GRAINS, ONE FRAME, DIVIDED BY A WALL.** The old octagonal core is dense with tiny parcels; the newer ring beyond it has **large, regular, partly-empty plots**; beyond the second wall, ribbon development strings along every radial road. **[E]** the inner grain is 5–8× finer than the ring's.
**(e)** ★ **TWO CIRCUITS.** The old inner wall survives complete (its gates now internal arches); the newer outer wall encloses the ring. The faubourgs that the new wall enclosed have become wards **whose grain still records their origin** — §5.0e.4 exactly.
**(f)** Minor.
**(g)** Three, purely by grain and wall vintage.
**(h)** **[E]** 6; the cathedral sits in the OLD core, not the new one — monuments do not migrate.
**(i)** ★ **THE OLD WALL IS STILL DRAWN.** A city that outgrew its wall does not erase it; the line survives as a street, a boundary, an arcade. That persistence is the whole of the inertia law made visible.
**(j)** Both circuits are near-regular polygons.
**(k)** **[M]** paper #FDFBF8, ink #533522 (light), chroma 58, **[M]** paper_grain_σ 2.64. **Mechanic — THE VINTAGE RECORD:** each ring's parcels carry (1) their own median size, (2) their own regularity variance, (3) their own frontage-line straightness. Same three-dial triad as hf26's fire quarter, driven by build-vintage instead of build-cause. **One mechanism serves both laws.**

### hf33 · city-chaos-warren — *the disorder end of §5.0*
**(a)** City; **[E]** 15,000+.
**(b)** **[M]** built_share 0.600, dense_share 0.732, open_share_in_core 0.111, **[M]** cells_across 62.6.
**(c)** ★ **THE HIERARCHY IS FLAT — deliberately.** **[M]** street p50 0.15 / p90 0.90 / p99 5.94: the median lane is as narrow as anywhere in the corpus, and there is no clear arterial class. A warren has a *thin* street hierarchy; order is what produces width classes.
**(d)** Tiny irregular parcels, extremely fine and uniform grain, alleys everywhere, blocks with no consistent shape. Several **fortified private compounds** (walled, with their own towers) embedded in the fabric — rival strongholds.
**(e)** A circuit with **[E]** 2 visible breaches left unrepaired. §11.2's chaos arm: breaches stay open.
**(f)** Minor.
**(g)** Legible only by the compounds and one burnt block; the residential fabric is undifferentiated — which is itself the district read for a chaotic city.
**(h)** **[E]** 4, and none dominates. **The absence of a dominant skyline IS the power reading** — no single power rules.
**(i)** ★ **THE MARKET SQUARE IS BARRICADED AND HALF-COLONISED** — buildings have crept into it. §11.2's "the market square SHRINKS — the most legible chaos tell", drawn.
**(j)** Grain uniformity: real warrens still have a rich street and a poor one. Here every quarter is equally chaotic.
**(k)** **[M]** paper #FDEEDC, ink #371B11, chroma 44, value range 105–235. **Mechanic:** disorder is rendered by *variance*, not by rotation — parcel area variance up, frontage-line straightness down, alley count up, street-width class count down. Four dials off the order value; **rotating buildings randomly is the wrong mechanic and the corpus never does it.**

### hf34 · metropolis-capital ★ — *the top of the ladder*
**(a)** Metropolis; **[E]** 60,000–100,000.
**(b)** **[M]** built_share **0.736** and dense_share_in_core **0.859** — both the highest in the corpus; open_share_in_core 0.007. **[M]** cells_across **113.3** — the finest grain measured. The city fills the frame; countryside survives only at the corners.
**(c)** **[E] FIVE+ classes:** a grand processional axis, arterial boulevards, ward streets, laterals, alleys. **[M]** street p50 0.20 / p97 3.35 / p99 6.42 plot-widths — the deepest hierarchy in the corpus.
**(d)** ★ **WARDS ARE COLOUR-CODED BY MATERIAL/WEALTH** — slate-grey, ochre, red-brown washes distinguish quarters at a glance. §10.A3's ward-wealth stratification, drawn.
**(e)** **[E]** Two ring circuits plus a hexagonal citadel; many gates.
**(f)** THROUGH, with a mid-river arm and an island.
**(g)** The strongest district read at the glance layer in the corpus — **material does the work, before any label.**
**(h)** **[E]** 9+ monumental compounds. Landmark:house footprint **[E]** ~12:1 at the top rung — the ladder's full span.
**(i)** **Scale legibility survives.** Even at 100,000 souls the individual house is still a mark on the page; the metropolis reads as *more of the same thing*, not as a different kind of drawing.
**(j)** ★ **THE LOD SHORTCUT DEFECT:** in the northern wards the buildings are NOT individually drawn — the ward is a flat wash with block outlines only. Only the southern half carries real fabric. **This is exactly the failure hf25 shows and exactly the temptation our own op-budget creates. Named as a prior NOT to emulate.**
**(k)** **[M]** paper #FEFEFD, ink #3C2218, **[M]** chroma 58, value range 98–212 (dark), **[M]** wash_within_σ 3.53, **fill_tone_IQR 51.7** — ⚠ **§244-FOLD: "the widest measured" is REFUTED, and by this atlas's own §2.3.3 band.** hf56 measures **100.1** in the very same 12-plate sample; over the 313, hf34 ranks **24th** and the maximum is hf165 at **153.0**. **The mechanic below does not depend on the superlative — it depends on 51.7 being high enough to require two nested jitter levels, which stands** — stroke 4/7/15. **Mechanic:** ward wealth = each ward draws its roofs from a DIFFERENT 3-tone sub-palette of the Roofs role, with per-building jitter *inside* that sub-palette. Two nested jitter levels — ward-level and building-level — is what produces IQR 51.7 without the plate looking like confetti.

### hf40 · slum-fringe-city ★★ — *the wealth-gradient exemplar*
**(a)** City; **[E]** 20,000–35,000.
**(b)** **[M]** built_share 0.593, dense_share 0.760, **[M]** center_edge_ratio 7.34, **[M]** cells_across 74.2 — **but the two halves differ radically.**
**(c)** **[E]** Four classes in the rich half (including a boulevard), three in the poor half (no arterial at all — just lanes and slits).
**(d)** ★★ **THE GRAIN CONTRAST IS THE PLATE.** Native-crop inspection: the **rich west** has large blocks with few, large footprints, courtyard mansions and **green garden courts**; the **poor east** has blocks packed with tiny units, party walls throughout, and **1–3 px cream slivers** as the only open space. **[E]** poor-quarter parcels are ~1/6 the area of rich-quarter parcels; **[E]** the poor quarter's open share inside its blocks is ~2–4%, the rich quarter's ~25–35%.
**(e)** A circuit with towers; **[E]** 4 gates. ★ **A SHANTY FRINGE accretes OUTSIDE the wall on the poor side only**, drawn as ghost outlines on a bare dirt wash with no fill.
**(f)** A covered channel/aqueduct crosses the plate.
**(g)** The clearest wealth read in the corpus, and it is achieved with **grain + roof hue + garden share**, no labels.
**(h)** **[E]** 6, all in the rich half — which is itself the district information.
**(i)** ★★ **POVERTY IS RENDERED AS FINER GRAIN AND LESS OPEN SPACE, NOT AS DAMAGE.** The poor quarter is intact, busy and dense. That is the historically right read and it is the one our §10.A3 needs.
**(j)** The rich/poor boundary is a clean line where reality gradates over 2–3 blocks.
**(k)** **[M]** paper #FEF5E8, ink #332720, **[M]** chroma **27.8 — the lowest of any colour plate** (this map is nearly monochrome, and the wealth read still lands); **[M]** fill_tone_IQR **46.2**, wash_within_σ 2.99, paper_grain_σ 1.47, stroke 5/8/18 (ratio 3.6). Native crop: block outlines are **~2× the weight of the party-wall lines inside them**. **Mechanic — THE TWO-TIER BLOCK STROKE:** draw the block's silhouette at weight W, its internal unit divisions at ~0.5 W. This one rule produces both the "solid mass" read at glance range and the "individual houses" read at study range, and it is why hf40's poor quarter reads as *crowded* rather than as *noisy*.

### hf50 · lens-watercolor ★★ — *the aesthetic north star*
**(a)** City; **[E]** 15,000–25,000.
**(b)** **[M]** built_share 0.441, dense_share_in_core 0.800, open_share 0.042, **[M]** cells_across 63.
**(c)** **[E]** Four classes. **[M]** street p50 0.08 / p90 0.70 — the tightest street web measured, matching the dense fabric.
**(d)** Continuous block masses subdivided into hundreds of individual units by single interior lines. **[E]** courts in ~15% of blocks.
**(e)** A D-shaped circuit closing against the river; the south side follows the bank.
**(f)** BANKSIDE.
**(g)** Moderate — this plate spends its effort on fabric and paint, not on district differentiation.
**(h)** **[E]** 4, notably restrained: the Town Hall reads only as a darker, larger cruciform mass in the square.
**(i)** **Sheer building count.** More individual footprints than any other plate. The city reads as a city because there are *thousands of them*.
**(j)** The block outlines are slightly uniform in weight.
**(k)** ★★ **THE PLATE TO MATCH.** **[M]** paper #FCEDD5, ink #5B412C, **[M]** chroma **66.7** — ⚠ **§244-FOLD: "2nd highest" is REFUTED, it is 3rd** (hf72 69.6, hf63 68.4) — **wash_within_σ 4.44**, the highest of MF-S1's 49 but ⚠ **NOT "tied with hf20"** (hf20 measures 4.41) and **not the corpus maximum** (hf387 measures 4.56 over the 313); **paper_grain_σ 2.98**, fill_tone_IQR 19.5, stroke 4/6/14 (ratio 3.5).
⛔ **§244-FOLD · THIS PLATE IS WHY THE VALUE-RANGE BAND IS RETIRED.** The atlas's declared aesthetic north star measures a **palette-8 cluster range of 78 — identical to hf57, the famine plate the same document calls weak** — and sits below the "<120 = washed out" threshold that §2.3.1 published as a quality gate. The band condemned its own exemplar; it is retired and **ink L replaces it** (§2.3.1). hf50's own ink L is **70.2**, correctly read not as a defect but as *a deliberately low-contrast lens* — which is precisely the discrimination the old band could not make. Native crop shows, unambiguously: **(1)** each building's fill carries a 10–20 L internal swing with pigment pooling at one or two edges; **(2)** adjacent buildings sit at visibly different values within a narrow band; **(3)** **the wash does not register to the ink** — colour runs 2–8 px past the outline in places and falls short in others; **(4)** every line wavers, including "straight" block edges; **(5)** streets are *bare paper* with a soft wash bleed at their margins. **Mechanic — the five-part painted closure:** per-fill value ramp + edge pooling; per-fill tone jitter within a band; a seeded wash-offset vector per fill (magnitude ~0.3–1.2× stroke width); per-vertex path waver; and a soft wash bleed into the street channel from its bounding fills. **Doing any four of those five and skipping the wash-offset will still read as vector art.**

### hf51 · lens-vtt — *the table-contrast treatment*
**(a)** City; **[E]** 20,000+.
**(b)** **[M]** built_share 0.639, dense_share 0.846 — very dense, very fine.
**(c)** ★ **STREETS DRAWN AS CHANNEL WASHES**, not as bare paper — a grey-brown fill inside the channel with hard edges. This is the VTT idiom's key departure and it is legible at table distance.
**(d)** Very fine parcels inside heavy block outlines. A square grid overlay sits above everything.
**(e)** ★ A **bastioned/star circuit** — a later-era fortification form, and the only one in the corpus.
**(f)** Minor.
**(g)** Moderate.
**(h)** **[E]** 5, drawn heavier than in the other lenses (table legibility).
**(i)** Tokens (barrels, crates, carts) sit in the streets — VTT-native furniture.
**(j)** The grid overlay competes with the fabric at study range. The star fort is era-inconsistent with the rest of the corpus.
**(k)** **[M]** paper #FEF4E5, ink #180504, **[M]** chroma 33 (low — muted for token contrast), value range 103–236 (**the widest of any city plate**), wash σ 9.17-equivalent grain. **Mechanic:** the VTT lens = same geometry, ink weight ×1.3, chroma ×0.6, value range widened, **street channel gains a fill**. Four global transforms over one geometry — which is exactly the §9.7 reskin-family contract, and this plate proves the family can survive a street-fill change if that change is a role recolour rather than new geometry.

### hf53 · island-town — *contour-ruled fabric*
**(a)** Town on a conical island; **[E]** 3,000–5,000.
**(b)** **[M]** built_share 0.510, dense_share_in_core 0.763, open_share 0.103.
**(c)** ★ **STREETS FOLLOW CONTOURS; STAIRS RUN UP.** The horizontal web is a set of concentric terraces — and here the concentricity is *earned by the landform*, which is the honest counter-example to hf15's unearned rings.
**(d)** ★ **TERRACE RANGES:** long party-wall rows occupying the strip between two street contours, so the block IS the terrace. Depth is set by the terrace width, not by a plot rule.
**(e)** A circuit only on the harbour side and the saddle; the cliffs carry none.
**(f)** A **mole harbour** with a lighthouse at its head; cisterns and a windmill on the summit (the island is dry inside).
**(g)** Three: harbour works, the terraced town, the summit works.
**(h)** **[E]** 4 — lighthouse, church, windmill, cistern court.
**(i)** ★ **THE SUMMIT IS INFRASTRUCTURE, NOT PALACE.** Windmill and cisterns take the height because wind and water collection want it. Function beats prestige for the best site.
**(j)** The terraces are evenly spaced.
**(k)** **[M]** paper #FDF8F2, ink #31231C, chroma 39. **Mechanic:** on sloped ground the street web should be generated as **contour-following polylines + fall-line connectors (stairs)**, not as a planar web then draped. The two produce visibly different maps and only the first reads as a hill town.

### hf5 · night-pigment — *the Dark Fantasy lens law*
**(a)** City; **[E]** 15,000+.
**(b)** **[M]** built_share 0.496, dense_share_in_core 0.842.
**(c)** Four classes; streets read as the LIGHTEST elements against dark masses — the value relationship inverts but the *hierarchy* does not.
**(d)** Blocks read as solid dark masses with pale streets between.
**(e)** A circuit, heavier than everything.
**(f)** ★ **[M]** blue_excess 0.410 — the most water-toned plate, because the whole scheme is indigo.
**(g)** Weak (deliberately).
**(h)** **[E]** 4, lit by ochre pinpricks.
**(i)** ★ **CANDLE DOTS.** Flat ochre points, no glow, no bloom — light rendered as pigment, not as an effect. §9.5's era law held under maximum temptation.
**(j)** —
**(k)** **[M]** paper #F8E4CD (retained as the *label/cartouche* ground only), ink #000000, **[M]** palette-8 cluster range **185 — the widest of MF-S1's 49** (⚠ §244-FOLD: over the 313 it is 3rd; hf277 measures 220), **[M]** chroma **18.0** — ⚠ **§244-FOLD: "the lowest in the corpus" is REFUTED** (hf278 measures 12.4 and hf300 16.0); **hf5 is the lowest-chroma plate of MF-S1's 49 and remains the FLOOR of the re-pinned chroma band**, which is the role the figure actually plays in §2.3.1. Palette clusters: **#2B2730 (18%), #555257 (16%), #424855, #30313E, #1B181F** — a five-step indigo-charcoal ladder. **Mechanic — THE NIGHT SCHEME IS A ROLE REMAP, NOT A FILTER:** Paper→#2B2730, Ink→#000000, Roofs→#3C373F, Roads→#555257 (roads stay the palest built role, the relationship preserved), Water→#424855, plus one ACCENT role (#E2CEB7 ochre) used only for lit windows and lettering. Ten roles remapped; zero geometry changed; no opacity or blend-mode tricks.

### hf70 · demoted-city ★★ — *§161g rendered whole*
**(a)** Demoted city; **[E]** current ~800 inside a circuit built for ~20,000.
**(b)** **[M]** built_share 0.435, dense_share_in_core 0.506, open_share 0.016. The occupied core is a fraction of the wall's area.
**(c)** ★ **THE GHOST STREET PLAN.** The old street grid survives across the entire ruin belt as **field boundaries and pale lines** dividing pasture and crop patches. Streets are the last thing to die, and here they have become agricultural geometry.
**(d)** Four zones from outside in: intact stone circuit → **empty walled fields on the old block plan** → a belt of **roofless masonry shells** → a **new timber palisade** → the huddled living village of thatched cottages.
**(e)** ★★ **TWO DEFENSIVE VINTAGES, TWO CIRCUMFERENCES, ONE GLANCE.** The great stone wall with **[E]** 6 gates, EVERY ONE labelled *PORTA MURATA* and drawn bricked; and a humble palisade ring around the living core. §161g.3 exactly.
**(f)** None engaged.
**(g)** Four, and they are concentric bands of *time*, not of function.
**(h)** ★ **[E]** 1 dominant: *Cathedralis Antiqua*, drawn at full monumental ink and scale, standing over a village. The oversized survivor.
**(i)** ★★ **THE MARGINALIA.** Each bricked gate carries an italic note in the margin. The document annotates its own losses — §12.1's event-log marginalia, drawn.
**(j)** The wall is drawn in **elevation** (an oblique convention) and the whole plate is axonometric — **projection not to emulate**. The circuit is a regular oval.
**(k)** **[M]** paper #FEFEFE, ink #51372A, chroma 47.5, value range 123–226, **[M]** paper_grain_σ 2.53. **Mechanic:** the ruin belt's crop patches take the SAME field-parcel primitive as the countryside but at **block scale and on the block's own bearing** — i.e. the ghost plan is produced by feeding the dead blocks into the field generator. One generator, reused; no new primitive needed. That is the cheapest possible implementation of §161g.1.

### hf84 · living-undercity ★★ — *§13's registration law drawn*
**(a)** Undercity beneath a city; **[E]** ~1,500 inhabitants below.
**(b)** **[M]** built_share 0.393, dense_share_in_core 0.519, **[M]** center_edge_ratio 8.53.
**(c)** ★ **THE SEWER MAIN IS THE HIGH ROAD** — drawn as a heavy brown band running the width of the plate, labelled as a road. Then a crooked market lane, then squatter passages. Three classes, all narrower than any surface street.
**(d)** Very fine irregular squatter grain — smaller and more irregular than any surface fabric, with **rope bridges** (ladder ticks) crossing gaps and **walkway ledges** along the sewer.
**(e)** None — but **gang territory boundaries** are drawn as dashed lines, which is the undercity's form of a wall.
**(f)** ★ Water is infrastructure: an **old cistern** (a filled dark disc, now a fighting pit), **wells** and **cess pits** as hatched circles.
**(g)** ★ Legible: Gang A / Gang B territories, the market lane (lit — see below), the collapsed quarter (broken outlines), the shrine precinct.
**(h)** **[E]** 4 heavy-outlined landmark voids: Smugglers' Exchange, Fence's Floor, Forbidden Shrine, the cistern.
**(i)** ★★ **THE REGISTRATION.** The **surface city is drawn above and behind in pale ghost outline**, with *Main Boulevard* continuing as a ghost line into the under-leaf, and **shafts to surface** marked with a circled-stair glyph. Flipping between leaves would read as *descending through one place*. §13.2 exactly.
Also: **LAMPS drawn as ochre dots along the market lane** — the only warm colour on the plate, marking the one lit street. Light as a *district* reading.
**(j)** The plate's own surface-city ghost is a generic grid rather than the real surface plan above it — for us it must be the actual registered geometry.
**(k)** **[M]** paper #FEF2E5, ink #3D2319, **[M]** chroma 34, **green_excess 0.000, blue_excess 0.000 — a completely warm, colour-free plate** except the lamp dots. **Mechanic:** the under-leaf = the surface leaf's palette with Greens and Water roles REMOVED (nothing grows, nothing flows), the Paper role warmed, and **one accent role** (lamp ochre) reintroduced. Role subtraction as a lens.

### hf4 · planned-city — *the order end of §5.0*
**(a)** City, planned; **[E]** 15,000–20,000.
**(b)** **[M]** built_share 0.630, dense_share_in_core 0.821, open_share 0.014, **[M]** cells_across 83, **[M]** center_edge_ratio 1.56 — **a nearly FLAT gradient, which is the planned signature**: a planned city is built out evenly, an organic one decays outward.
**(c)** ★ A *cardo/decumanus* cross at the widest class, a ring street, then regular laterals, then alleys. **[M]** street p97/p50 = **7.50 — the SHALLOWEST hierarchy ratio in the corpus.** Planned cities have *fewer, more equal* street classes; organic ones have a long tail. This is a measurable morphology discriminator.
**(d)** Regular rectangular perimeter blocks with interior courts — **but the individual buildings inside them are irregular.** Order lives at the block scale, never at the building scale.
**(e)** A regular polygonal circuit with **[E]** 16 towers evenly spaced and 4 axial gates.
**(f)** Minor.
**(g)** Legible by block size: forum (void), the civic blocks (larger), residential insulae (uniform).
**(h)** **[E]** 6, all on the axes.
**(i)** ★★ **ORDER DISSOLVES OUTSIDE THE WALL.** The extramural suburbs are immediately, completely organic. The planning authority's reach stopped at the gate. This is the single best argument in the corpus that morphology is a *derivation with a boundary*, not a global style.
**(j)** The regularity is machine-exact; even Roman grids drift.
**(k)** **[M]** paper #FEFDFC, ink #31261F, chroma 52, **[M]** paper_grain_σ high. **Mechanic:** the PLANNED band = block-level regularity dial high, building-level irregularity dial UNCHANGED, and the dial applies **inside the wall only**, falling to organic across a 1–2 block transition at the gate.

---

## BAND 5 — THE VOCABULARY PLATES (hf35, hf36, hf54, hf55, hf56, hf61, hf71)

### hf35 · ward-closeup ★★ — *the block/parcel/court vocabulary at the finest rung*
**(a)** One ward of a city, at closeup zoom; **[E]** ~250 buildings shown.
**(b)** **[M]** built_share 0.342, dense_share_in_core 0.620, **[M]** cells_across 48 *within one ward*.
**(c)** ★ **NAMED ALLEYS** ("Alcove alley", "Slum alley") at the finest rung, opening off laterals. Four classes visible in one ward.
**(d)** ★★ **THE PLOT-TICK MECHANIC.** Along every block edge, short perpendicular **ticks** mark the individual plot divisions — at a lighter weight than the block outline and at *irregular spacing*. This is how the corpus shows tenure without drawing every party wall. **[E]** 8–20 ticks per block edge. Interior courts appear in **[E]** ~30% of blocks at this zoom, all with mouths; **[E]** 2 route-isolated courts visible out of ~20 blocks → **~10%**.
**(e)** A **dashed boundary with corner marks** delimits the ward — the §18.1 precinct/liberty line, drawn.
**(f)** A well head, drawn as a labelled circle-in-circle.
**(g)** Legible: the arcaded market hall's block, the church-and-cloister compound (green courts), the ordinary residential blocks, the ward's fringe.
**(h)** **[E]** 3 — the arcaded market hall (a long block with a **row of semicircular arches and column dots** along one face), the church with cloister quad, the well.
**(i)** ★★ **THE CONTEXT LOD.** The fabric OUTSIDE the ward is drawn in pale grey ghost — present, structurally correct, and clearly subordinate. That is the correct answer to §6's closeup rung and to our LOD problem simultaneously.
**(j)** —
**(k)** **[M]** paper #FFFFFF, ink #5A3D2C, **[M]** chroma 36, value range 148–240, wash_within_σ 2.28, **fill_tone_IQR 17.2**, paper_grain_σ 1.35, stroke 5/7/18 (ratio 3.6). Native crop: strokes are ~4–6 px with **visible width modulation along a single stroke** (pressure), corners **overshoot by 2–5 px**, and hip/ridge hatching on the market hall is hand-ruled with converging non-parallel lines. **Mechanic — THE HAND SIGNATURE, three parts:** (1) per-stroke width modulation (±25% along the run); (2) corner overshoot at 30–60% of joins; (3) hatch families that converge slightly rather than staying parallel. These three are what a plotter cannot do and are the cheapest route to "drawn by a person".

### hf36 · countryside-study ★ — *the dressed-ground vocabulary*
**(a)** Countryside; no settlement, one farmstead.
**(b)** **[M]** built_share 0.258, open_share_in_core 0.346, **[M]** green_excess 0.600 — the greenest plate.
**(c)** ★ **CART TRACK = double line with a dashed centre**; field lanes = single thin line; a footpath = dotted.
**(d)** ★ **STRIP FIELDS (labelled *aratorium*) drawn with FURROW LINES** — fine parallel strokes filling each strip, running with the strip's long axis. Pasture is flat wash with no furrows. The two are instantly distinguishable.
**(e)** —
**(f)** A river with **hatched banks** and a stone bridge.
**(g)** Legible: arable (furrowed), pasture (flat), orchard (dotted grid of tree rounds), waste (stippled).
**(h)** **[E]** 3 outlying anchors: a farmstead (*massaria*) at a lane junction with its own yard and orchard grid, a wayside shrine at a crossroads, the bridge.
**(i)** ★ **HEDGEROWS ARE DRAWN AS A LINE DOTTED WITH INDIVIDUAL TREE ROUNDS** at irregular spacing, and the tree spacing varies by boundary. §2's dressed-ground law's exact primitive.
**(j)** Field bearings are a little too consistent across the plate; real field systems change bearing at every terrain seam.
**(k)** **[M]** paper #FAEAD1, ink #2A100A, chroma 45. **Mechanic — FOUR GROUND PRIMITIVES, each distinct:** furrow (parallel fine strokes at the parcel's own bearing, ~8–14 per parcel), pasture (flat wash + occasional tuft ticks), orchard (a jittered grid of tree rounds), waste (irregular stipple + scrub squiggles). One parcel, one primitive, chosen by land use — **never a universal texture.**

### hf54 · docks-plate ★ — *the §161m supply chain drawn*
**(a)** A port quarter; oblique.
**(b)** **[M]** built_share 0.495, open_share_in_core 0.236.
**(c)** ★ **"ALLEY STAIRS" repeated five times** along the slope up from the quay — the vertical connection class.
**(d)** Warehouse ranges set **perpendicular to the quay**, so every one has water frontage; the housing behind is fine-grained and stepped.
**(e)** The quay wall itself is the works — a heavy coursed-stone line with mooring rings.
**(f)** ★ Piers project INTO the water with boats alongside; a boatyard has a slipway.
**(g)** Legible purely by footprint SHAPE: rope-walk (extremely long thin), warehouses (long, regular, ranked), customs house (tall, heaviest ink, central), taverns (small, repeated, labelled ×4 along the alley mouths), fish market (tiny table glyphs on open ground).
**(h)** **[E]** 3 — customs-and-weigh house at the heaviest ink, the rope-walk, the boatyard.
**(i)** ★★ **THE CHAIN IS SPATIALLY CORRECT:** water → pier → quay crane → warehouse → customs house → market → taverns at the alley mouths. §161m's supply-chain adjacency graph, drawn as a *sequence you can walk*. And the taverns cluster at the alley mouths where the crews come up — an affinity, drawn.
**(j)** **OBLIQUE — projection not to emulate.**
**(k)** **[M]** paper #FDF1E1, ink #462C21, chroma 40. **Mechanic:** institution identity at closeup rung comes from **footprint aspect ratio + repetition count**, before any glyph. A rope-walk is a 15:1 rectangle; warehouses are 3:1 in a rank of five; taverns are 1:1 repeated at junctions. Shape grammar over icon grammar.

### hf55 · castle-plate ★ — *the military compound, in plan*
**(a)** A castle with its town beyond; plan view.
**(b)** **[M]** built_share 0.262, open_share_in_core 0.078, dense_share 0.336 — **a defended compound is mostly OPEN GROUND**, which is the point.
**(c)** One ramp through gatehouse and barbican; internal yards.
**(d)** ★ **BARRACKS AND STABLE RANGES ARE BUILT AGAINST THE INNER FACE OF THE CURTAIN WALL.** They abut the stones directly. This is the corpus's evidence for §200.2's "abutment on the inner face stays lawful **as an explicitly-derived variant**" — and it shows that variant is *normal* in military compounds, not exotic.
**(e)** ★ Curtain wall with **[E]** 14 round towers at even intervals, a gatehouse + barbican + bridge over a wet ditch, and a motte with **radial hachure** for its slope. The keep sits on the motte with its own ring wall.
**(f)** The castle ditch, wet, drawn as a grey band; a well in the inner bailey.
**(g)** Legible: inner bailey (great hall, chapel, well), outer bailey (barracks, stables, smithies, drill yard), and — importantly — **orchards and paddocks occupying ~35% of the outer bailey [E]**. A castle stores food and grazes horses.
**(h)** **[E]** 6 — keep, great hall, chapel, gatehouse, barbican, smithy.
**(i)** ★ **THE GREEN INSIDE THE WALLS.** The corpus insists that defended enclosures hold open productive ground. Our §203 fill law must NOT push a citadel ward to the same built-out share as a merchant ward.
**(j)** Tower spacing is perfectly even.
**(k)** **[M]** paper #FCEBD3, ink #000000 (the plate border), map ink ~#514639, chroma 49, **[M]** stroke p90 **35** — by far the heaviest strokes in the corpus, because the curtain wall is drawn at ~4× the fabric weight. **Mechanic:** the wall's weight ratio to house-outline weight is **[M]** ≈ 4–5:1 here vs ≈ 2:1 on the town plates. Wall weight should scale with the circuit's own rung, not be a constant.

### hf56 · noxious-plate ★★ — *the burgage evidence and the §161c edge*
**(a)** A town's noxious edge, at large scale; plan view.
**(b)** **[M]** built_share 0.264, open_share_in_core 0.332.
**(c)** One approach road plus a *Knacker's Track* leaving the frame, and internal yard lanes.
**(d)** ★★ **THE CLEANEST BURGAGE EVIDENCE IN THE CORPUS.** The "TOWN FABRIC" strip at the left shows: long narrow plots perpendicular to the lane; **each plot's building at the street end with an irregular stepped footprint**; the rest of the plot empty; straight boundary lines running the full plot depth; **buildings all touching the street line** (the fronting law); building outlines at a heavier weight than plot boundaries. Native crop confirms all of it at 1:1.
**(e)** —
**(f)** ★★ **THE POLLUTION PLUME.** The dye works discharge is drawn as a **spreading multi-colour wash INTO the river** (red, blue, yellow bleeding into brown), widening downstream. Water carries the consequence.
**(g)** Superbly legible: lime pits (a rectangle grid), tanneries (pit arrays + drying racks as cross-hatched grids), dye works (vats as coloured bars), workers' parcels (tiny dense grain, immediately adjacent), slaughter yard and bone boiler at the far end.
**(h)** **[E]** 5 by function; none monumental — a noxious quarter has no landmarks, which is itself information.
**(i)** ★★ **DOWNWIND *AND* DOWNSTREAM, BOTH DECLARED.** A wind-head cartouche marks the prevailing wind; the quarter sits downwind of the town AND on the river below it; the workers live *inside* the quarter because nobody else would. Three separate siting logics visible in one plate. §161c and §6's noxious rule, fully drawn.
**(j)** The plot widths in the town fabric are very uniform.
**(k)** **[M]** paper #FBEFDE, ink #2B1912, **[M]** chroma 38, **fill_tone_IQR 100.1 — by far the widest measured**, because the vats introduce saturated accents into an otherwise muted plate; wash σ 3.29. **Mechanic:** the noxious accent palette is the ONLY place in the corpus where saturated hues appear, and they appear as **small solid bars inside a muted field**. Accent chroma is a *rationed* resource (§9.3), spent where the world justifies it.

### hf61 · chrome-plate ★ — *the folio furniture, with a tier ladder*
**(a)** A vocabulary sheet, not a settlement.
**(b)–(h)** n/a.
**(i)** ★★ **CHROME ESCALATES WITH TIER, and that is the plate's whole lesson:** *Village* cartouche = a plain double-rule box; *Town* = a moulded frame with a cornice and base; *City* = an ornate scrolled frame with colour and corner rosettes. Compass roses escalate the same way: a 4-point plain star → an 8-point star with colour and a fleur. Scale bars come in three registers (plain, coloured-segment, hatched). Ward boundaries = black dashed. A wind-head. A legend box with symbol/label pairs.
**(j)** ★ **THE TEXT IS GIBBERISH.** The "marginal note" is nonsense word-salad and the legend's labels are corrupt ("CHIESA – marizzo", "PARCTA – carnary"). This is the generator's failure mode and it is precisely the place **our truth layer beats the corpus outright**: our cartouches, legends and marginalia carry real names, real events, real dates. Named as our clearest competitive win.
**(k)** **[M]** paper #FFFFFF, ink #2A2521, **[M]** chroma 29.8 (low), value range 146–241. Lettering: a **serif face throughout**, small-caps for headings, italic for marginalia, and — critical — **letter-spacing is loose on the display type**. Ink blots and speckles are scattered on the paper as deliberate imperfections. **Mechanic — THE CHROME LADDER:** cartouche complexity, compass complexity and scale-bar register all key off ONE tier/prosperity value; three surfaces, one dial. And the plate's ink blots say: a folio leaf carries 3–8 small paper defects (blots, foxing spots, a crease line), placed by seed.

### hf71 · road-ladder ★★ — *§11.3's road-death ladder, complete*
**(a)** Countryside; no settlement.
**(b)** **[M]** built_share 0.259, open_share_in_core 0.279, green_excess 0.508.
**(c)** ★★ **FIVE ROAD RUNGS IN ONE FRAME, EACH DRAWN DIFFERENTLY:**
1. *Via Maxima* — two heavy parallel edges, a paved fill, a **hatched agger/shoulder**, and **milestones (M.P.) at regular intervals**. Widest.
2. *Via Communis* — two parallel edges, unpaved fill, no milestones. Narrower.
3. *Via Languescens* — a single line with a broken/thinning character, grass encroaching from both sides.
4. *Via Defuncta* — a dotted line only.
5. *Vestigium Viae* — a barely-there dotted trace reading as a **field boundary**.
**(d)–(g)** Fields as flat washes with hedgerow-and-tree boundaries; a *villa rustica* and a *hospitium* (roadside inn) at the junction.
**(h)** **[E]** 3 — the villa, the inn, and *Pons Antiquus*, a **ruined bridge drawn as broken masonry stubs with the span gone**.
**(i)** ★★ **THE RUINED BRIDGE ON THE DYING ROAD.** The road died because the bridge fell — or the bridge was not rebuilt because the road died. Causation is legible without a word. This is the single most instructive object in the corpus for §11.3.
**(j)** All five roads run parallel across the frame — a display convention, not a landscape.
**(k)** **[M]** paper #F7E2C7, ink #4D3323, **[M]** chroma 65.3 (3rd highest), green_excess 0.508. **Mechanic — THE ROAD LADDER IS FIVE DISTINCT PRIMITIVES, not one primitive scaled:** rung 1 = double edge + fill + shoulder hatch + milestone glyphs; rung 2 = double edge + fill; rung 3 = single line, 60% weight, encroachment ticks; rung 4 = dot pattern; rung 5 = dot pattern at 40% weight, reused as a field boundary. Width alone will NOT produce this reading.

---

# PART 2 — SYNTHESIS INTO CALIBRATION TARGETS

## §2.1 · THE CORPUS MEASURED, BY TIER BAND

All figures **[M]** unless marked. `cells_across` = buildings across the settlement (hand-set windows; calibrated ±8% on native crops). Vocabulary plates and oblique plates are excluded from the band aggregates and listed separately.

⛔ **§244-FOLD — THE `cells_across` COLUMN IN THE TABLE BELOW IS SUPERSEDED. Read the corrected ladder that follows it, not this column.** Every other column stands. The correction has three parts: the windows were re-set by eye on decile-gridded renders per §2.8.3 (HF-M1, `HFM1-grain2.json`), the sample grew from n=1/1/5/8/5/1 to n=7/7/9/12/9/9, and **the instrument was found INVALID at thorp and hamlet tier** (§244.5).

| Band | plates in aggregate | cells_across (min–median–max) | built_share_frame | dense_share_in_core | open_share_in_core | centre:edge density | street p50 / p97 (plot-widths) | street hierarchy p97/p50 |
|---|---|---|---|---|---|---|---|---|
| **Thorp** | hf10 | 10.1 | 0.078 | 0.091 | 0.469 | 1.09 | 0.03 / 0.96 | 32.0 |
| **Hamlet** | hf11 | ~31 (inflated by canopy) | 0.654* | 0.703* | 0.000 | — | 0.32 / 3.78 | 11.8 |
| **Village** | hf3, hf13, hf16, hf17, hf59 | 31 – **48** – 60 | 0.34–0.55 | 0.50–0.75 | 0.05–0.27 | 2.7–4.9 | 0.16–0.23 / 2.3–3.8 | 11.5–20.4 |
| **Town** | hf20,21,23,27,58,60,62,72 | 44.7 – **61.3** – 79 | 0.29–0.66 | 0.58–0.77 | 0.02–0.13 | 1.9–4.5 | 0.08–0.21 / 2.0–3.8 | 16.6–29.9 |
| **City** | hf4,30,33,40,50 | 62.6 – **74** – 90 | 0.44–0.68 | 0.73–0.82 | 0.01–0.11 | 1.6–16.5 | 0.08–0.34 / 1.5–2.7 | 7.5–18.4 |
| **Metropolis** | hf34 | **113.3** | 0.736 | 0.859 | 0.007 | — | 0.20 / 3.35 | 16.8 |

\* hf11's high built/dense figures are forest canopy stipple, not fabric — flagged in its row and excluded from any band conclusion.

### §2.1a · ⛔ §244-FOLD — THE CORRECTED GRAIN LADDER (re-set windows, n=53 measurements)

Source: `map-corpus/docs/HFM1-grain2.json` (57 rows — MF-S1's 22 windows reproduced **verbatim and byte-identically**, plus 35 re-set by eye on decile-gridded renders). Window bounds are **[E]** by definition; everything inside them is **[M]**.

| tier | MF-S1 published band | MF-S1's basis | **re-measured min – MED – max** | n | in the published band | §244 VERDICT |
|---|---|---|---|---|---|---|
| **thorp** | 8–14 | n=1 (hf10) | 20.8 – **47.4** – 99.6 | 7 | **0 / 7** | ⛔ **RUNG WITHDRAWN** — instrument invalid at this tier |
| **hamlet** | 18–26 | *interpolated, n=0 clean* | 28.0 – **41.1** – 66.0 | 7 | **0 / 7** | ⛔ **RUNG WITHDRAWN** — never measured, and unmeasurable by this instrument |
| **village** | 30–50 | n=5 | 19.4 – **45.9** – 60.3 | 9 | 6 / 9 | ✅ **UNCHANGED** (median 48.0 → 45.9) |
| **town** | 45–80 | n=8 | 41.0 – **57.0** – 79.0 | 12 | 10 / 12 | ✅ **UNCHANGED** (61.3 → 57.0) |
| **city** | 60–95 | n=5 | 52.0 – **69.0** – 90.0 | 9 | 7 / 9 | ✅ **UNCHANGED** (74.2 → 69.0) |
| **metropolis** | 100–130 | n=1 (hf34) | 70.2 – **97.6** – 119.6 | 9 | 4 / 9 | ⚠ **RE-PINNED 80–120** — the corpus does not reliably reach 100 |

⛔ **WHY THE TWO LOW RUNGS ARE STRUCK RATHER THAN WIDENED — this is an instrument-validity failure, not a corpus failure.** `cells_across` is the median count of dark runs per scan line. §0's own calibration establishes "one dark run ≈ one plot/building footprint" **on hf72 and hf40 — two dense urban plates**. At thorp and hamlet scale the settlement's bounding box is mostly *dressed ground*: toft fences, hedges, furlong furrows, orchard rows. Those are dark runs too. **`hf90` — a thorp the calibration file itself describes as TWELVE ROOFS — returns 99.6 "cells across".** The instrument is off by more than an order of magnitude at that tier. A wider band would not fix a ruler that is measuring the wrong object.

⛔ **WHAT WOULD RESTORE THE TWO RUNGS: a tier-appropriate instrument — ROOF COUNT, not scanline.** At thorp and hamlet the plates carry 6–24 roofs, so a footprint-detection pass or a straight eye count is *exact*. Express the low rungs as **roof count**, and reserve `cells_across` for village and above where the fabric dominates its own bounding box. Until that instrument exists these two rungs have **no target**, and a leaf may not be graded on them. **Contaminated rows flagged rather than hidden:** `hf90` (furlong hatching in the window, 99.6), `hf95` (66.0, toft strips), `hf87` and `hf11` (canopy inside the clearing), `hf105` (ribbon city measured across its short axis), `hf101` (harbour water inside the box).

**THE ONE NUMBER THAT MATTERS MOST — corrected, and it survives above village.** The corpus's fabric grain walks **46 → 57 → 69 → 98** cells across from village to metropolis: **monotonic, ×1.24 · ×1.21 · ×1.41 per tier**, and it never plateaus. Everything else in this atlas is secondary to it: **the corpus makes tier legible at a glance chiefly by grain**, and grain is *cells across the settlement*, not building size in absolute units. ⚠ **The published walk `10 → 22 → 48 → 60 → 74 → 113` is WITHDRAWN at both ends** — its thorp figure was a misplaced window on a single plate, its hamlet figure was interpolated from that fault, and its metropolis figure (113.3, hf34 on MF-S1's window) re-measures **97.6** with the window re-set tight to the walled fabric. The claim *"the walk is monotonic and never plateaus"* is **CONFIRMED at n=9/12/9/9 over four tiers**, which is stronger evidence than the six-rung version ever had.

---

## §2.2 · CALIBRATION TARGETS

Each target carries: the measured/estimated basis, the LAW it belongs to, and — where no law covers it — a **GAP** flag with a mechanism sketch. **All GAP proposals are proposals only; the chair rules.**

### T-01 · FABRIC GRAIN BY TIER (the headline target)
**Target — AS CORRECTED BY §244.5. This supersedes the six-rung target MF-S1 published.**

| tier | target band | basis | status |
|---|---|---|---|
| **thorp** | ⛔ **none — WITHDRAWN** | published 8–14 rested on n=1 with a **misplaced window** | **may not be graded** until a ROOF-COUNT instrument exists |
| **hamlet** | ⛔ **none — WITHDRAWN** | published 18–26 was **interpolated through that same fault** | **may not be graded** until a ROOF-COUNT instrument exists |
| **village** | **30–50** | [M] n=5 → re-measured n=9, 6/9 in band, median 48.0 → 45.9 | ✅ UNCHANGED |
| **town** | **45–80** | [M] n=8 → re-measured n=12, 10/12 in band, median 61.3 → 57.0 | ✅ UNCHANGED |
| **city** | **60–95** | [M] n=5 → re-measured n=9, 7/9 in band, median 74.2 → 69.0 | ✅ UNCHANGED |
| **metropolis** | **80–120** | published 100–130 rested on n=1; re-measured n=9 (70.2–97.6–119.6), only 4/9 fell inside it | ⚠ **RE-PINNED** |

Monotonic across the four surviving rungs (**46 → 57 → 69 → 98**, ×1.24 · ×1.21 · ×1.41).
⚠ **§244-FOLD, a defect MF-S2 found that §244 did not name: the published rider "no tier's band may overlap the next tier's by more than ~30%" IS VIOLATED BY THE ATLAS'S OWN BANDS and always was** — town 45–80 against city 60–95 overlap by 20, which is **57%** of each band, and the re-pinned metropolis overlaps city by 43%. Read the rider as an aspiration, not a satisfied constraint. **PROPOSAL FOR THE CHAIR (measured, NOT adopted — §244 ruled these three bands unchanged and MF-S2 will not narrow them unasked):** the tier **interquartile** bands satisfy the rider at every rung — village **39–48**, town **47–67**, city **63–81**, metropolis **81–107**, with overlaps of 12.5% / 21.5% / **0%**. [M, computed by MF-S2 from `HFM1-grain2.json`.]
**Law:** §5 tier grammar + §161f continuous-scale law (population sets the amount). The band is a *derivation over population*, not a per-tier constant. MF-S1 published an ordinary least-squares fit in log-log over 11 plan-view plates as the interpolation rule between the rungs:

> ⛔ **`cells_across ≈ 5.7 × population^0.27` — R² = 0.80 — IS WITHDRAWN (§244.5).**

⛔ **WHY THE FIT FALLS WITH THE RUNGS.** It was fitted in log-log over **11 plan-view plates including hf10**, whose window is now refuted — so the fit inherits the fault at exactly the end of the range where the leverage of a single point is greatest. It may not be cited, and no derivation may be built on it.
⛔ **WHAT WOULD RESTORE IT — and the honest answer is that the corpus alone cannot.** Two independent defects have to be cured together: (1) re-fit over **village-and-above only**, excluding every withdrawn rung; and (2) fit against **real populations**, which the corpus does not carry — the original ★ HYBRID-EVIDENCE WARNING stands and is now decisive: `cells_across` is **[M]** but every population but one is **[E]** (only hf57 states its own, "3,000 souls"). A trustworthy derivation needs settlements whose population is a *fact*, i.e. **our own generator's output**, not reference art. Until then the BAND ENDPOINTS are the whole of T-01 and there is no interpolation rule between them.
**Status:** the law exists; the FIGURE does not. **GAP-A: the tier table's building-count bands (150–400 town, 400–900 city, 900–1,600 metropolis) are inconsistent with this measurement by an order of magnitude.** A town at the re-measured 57 cells across with ~60% fill implies **≈1,900 parcels**, not 150–400 — the order-of-magnitude conclusion is unaffected by the correction. Mechanism sketch: replace the count bands with a **grain derivation** (`cells_across = f(population)`) and let parcel count fall out of grain × footprint area, with the representativeness ratio printed in the cartouche as §5 already requires.

### T-02 · GRAIN MUST KEEP CLIMBING ABOVE TOWN
**Target [M]:** city ≥ 1.2× town grain; metropolis ≥ 1.4× city grain.
✅ **§244-FOLD — THIS TARGET IS CONFIRMED, AND ON A MUCH LARGER SAMPLE THAN IT WAS SET FROM.** Re-measured on re-set windows: city / town = **69.0 / 57.0 = ×1.21** (n=9 and n=12, was n=5 and n=8) and metropolis / city = **97.6 / 69.0 = ×1.41** (n=9, was n=1). Both multipliers land within 0.01 of the published target. **T-02 is the one headline figure the measurement pass strengthened rather than moved** — and note it is a RATIO target, which is why it survived the absolute re-pinning of the metropolis rung intact.
**Law:** §161f. **Status:** law exists, and §199.2c already recorded the metropolis band as an unmet fixed point. This target gives it a number.

### T-03 · DENSITY GRADIENT (centre : edge)
**Target [M]:** organic settlements **2.5–5.0**; planned **1.4–1.9** (hf4 1.56, hf24 1.87); growth-ring / boom / influx **7–17** (hf32 16.45, hf42 8.15, hf41 7.00, hf40 7.34); demoted **4–5 with a near-zero occupancy beyond the core** (hf37 4.46 with dense_share_in_core 0.912).
**Law:** §5.0 morphology + §11.1/§161g. **Status:** **the gradient is a measurable morphology DISCRIMINATOR and no law currently names it.** **GAP-B — mechanism sketch:** add `radialDensityFalloff` as a derived fabric statistic with per-morphology target bands, censused per leaf. It costs nothing to compute and it catches "organic settlement rendered as an even blob" — which is a failure no existing census can see.

### T-04 · STREET HIERARCHY DEPTH
**Target [M]:** p97/p50 width ratio — organic town/city **16–30**; planned **7.5–13** (hf4 7.5); chaotic **≈14** with the *widest* class missing (hf33's p90 is only 0.90 plot-widths). Widest channel (p99) **2.7–6.4 plot-widths** in every plan-view plate.
**Law:** §11.2 order drift (street width is the order tell) + §17.4. **Status:** the law exists; the numbers do not. **GAP-C: no target band exists for street-width classes.** Mechanism sketch: derive **4–5 width classes** with ratios approximately **1 : 1.6 : 2.6 : 4.2 : 6.5** (alley : lane : lateral : arterial : market void), the class COUNT falling with disorder (chaos drops the arterial class entirely, per hf33) and the market void present only at town+.

### T-05 · OPEN-SPACE SHARE INSIDE THE FABRIC
**Target [M]:** village **5–27%**; town **2–13%**; city **1–11%**; metropolis **≈1%**; **defended compounds are the exception — hf55's castle bailey is ~35% orchard/paddock [E]**.
**Law:** §203 arm 2 (zone fill bands). **Status:** law exists, bands unset. **This atlas supplies them.** Per-district modifiers from the corpus [E]: government/civic airier (+10–15 pts of open share), religious precincts airier (+15–20, courts and yards), crafts/noxious tighter (−5), poor quarters tightest (**hf40's poor half measures ~2–4% open [E]**), military compounds airiest of all (+25–30).

### T-06 · COURT FREQUENCY — THE §204 RECONCILIATION
**Measured/eye-counted per plate:** blocks carrying SOME interior open space — hf60 ~14%, hf50 ~15%, hf35 ~30%, hf58 ~45%, hf20 ~60–65% (all [E]). Blocks carrying a **route-isolated** court (no street mouth, no through passage) — hf60 ~3%, hf35 ~10%, hf58 ~5%, hf20 ~10–15% (all [E]).
**The reconciliation:** §204's ruling that "courts are RARE" and the corpus's abundant block-interior yards are **not in conflict, because they are different objects.** Interior yards/gardens/courts *with a mouth* are COMMON and are the normal product of perimeter-block packing. **Route-isolated** courts — §201's own definition — are the rare ones, and the corpus agrees: **[E] 3–15% of blocks, i.e. roughly one in five of all interior open spaces.**
**Law:** §201/§202/§204. **Proposed pin band (chair to rule):** route-isolated courts ≤ **12% of blocks** AND ≤ **20% of all block-interior open spaces**, with a lower floor of >0 at town+ so the feature is not optimised away (§201.1c's pinned island buildings inherit this).

### T-07 · PARTY WALLS AND THE TWO-TIER BLOCK
**Target [M]/[E]:** at town+, **the dominant packing form is the abutting range, not the detached solid.** Native-crop evidence: hf40, hf50, hf13, hf72, hf56, hf60 all draw blocks as **one silhouette at weight W subdivided by internal unit lines at ~0.5 W** ([M] on hf40's crop: block outline ≈2× the internal line weight). Detached solids dominate only at village and below (hf3, hf10, hf59).
**Law:** §17.1 (party walls, not overprints). **Status:** the law names abutment; **nothing names the two-tier STROKE, which is what makes abutment legible.** **GAP-D — mechanism sketch:** a `blockSilhouette` pass that unions each block's footprints, strokes the union at the block weight, and strokes interior shared edges at half weight. This is one render pass and it is the single largest visual-quality lever identified in this study.

### T-08 · BURGAGE / PLOT-SERIES STRUCTURE
**Target [M] on hf72 and hf56 native crops:** plot **depth : width ≈ 4–6 : 1**; the building occupies **30–45% of plot depth at the street end**; the remainder is yard/toft; buildings **touch the street line**; adjacent plots within a series share widths to within [E] ±20–40% (never exactly).
**Law:** §17.4 fronting law + §18.5 (burgage plot-series module — **currently DEFERRED post-launch**).
**Status:** ★ **RECOMMEND UN-DEFERRING.** §18.5 parked the burgage module, but this study finds the plot-series is **the most-repeated single structure in the corpus** (present in hf3, hf13, hf16, hf17, hf20, hf23, hf26, hf40, hf50, hf56, hf60, hf62, hf72) and is what produces the frontage-line continuity that b6 most conspicuously lacks. Chair's call; recorded as MF-S1's strongest recommendation on scope.

### T-09 · THE ALLEY / GINNEL FLOOR
**Target [M]:** the corpus's street-width p25 sits at **0.02–0.08 plot-widths** — i.e. a large population of sub-tenth-of-a-plot slivers. b6's p25 is **0.06–0.12** [M]. A *higher* floor means uniform spacing, not tight packing.
**Law:** §17.6 alley-gap law + §201.1a (alleys draw in the block's interior tone, never street colour).
**Frequency [M/E]:** hf72's frontage shows **[E] ~1 through-gap per 6–9 plots**.

### T-10 · WALL PRESENCE AND FLANK GRAMMAR
**Tally [E] over the 41 settlement plates:** walled **≈29**, unwalled **≈12**, and the split is almost exactly the tier line — **essentially every town+ is walled; essentially no village or below is** (hf15's light perimeter is the only sub-town enclosure, and hf59 substitutes a threat-facing barricade).
**Flank grammar among the walled [E]:** full closed ring **≈16 (55%)**; **half-ring against water ≈5 (17%)** (hf21, hf23, hf50, hf60, hf62); **terrain-anchored with a flank left unwalled ≈4 (14%)** (hf22 crag, hf53 cliffs, hf63 hill saddle, hf72 crag); **wall crossing water with water gates ≈3 (10%)** (hf24 with chain booms, hf30, hf34); **two vintages in one frame ≈3 (10%)** (hf32, hf70, hf34).
**Law:** §161m wall-trace law + §205.3 terrain-maximised defences. **Status:** covered. This atlas supplies the **frequency targets** — in particular, **a generator that draws a full ring 100% of the time is wrong by ~45 percentage points.**

### T-11 · DEFENCE FOLLOWS THE THREAT, NOT THE PERIMETER
**Target [E]:** hf59's barricade covers ONE bearing (the forest) and stops; hf24's siege works face ONE gate; hf22's wall dies into the crag.
**Law:** §205.3 covers terrain. **GAP-E: nothing covers THREAT-directed partial defences** — the sub-tier case where a settlement fortifies only the dangerous side. Mechanism sketch: `partialDefenceArc(bearing, span)` derived from the dominant hazard's own marker slot (the §7/E8 correction applies — no bearing field exists, so the hazard's array-index compass slot is the honest source), producing a barricade/palisade arc rather than a circuit at sub-town tiers.

### T-12 · WATER RELATIONSHIP INCIDENCE
**Tally [E] over 34 settlement plates with a legible water relationship:** **BANKSIDE/coastal ≈15 (44%)** · **NONE/WELL ≈10 (29%)** · **NEAR ≈5 (15%)** · **THROUGH ≈4 (12%)** · matrix/special 2 (hf52 delta, hf84 undercity).
**Law:** §5.0b. **Status:** ★ **the corpus CONFIRMS the law's own claim that THROUGH is the rarest mode** — 12% measured against a model prior that reaches for bisection by default. Proposed derivation target: THROUGH ≤ 15% of water-bearing settlements, and every THROUGH settlement must show **bank asymmetry** (hf30: one bank ~70% of the fabric and visibly older).

### T-13 · RIVER CLASS FOLLOWS FUNCTION
**Target [E]:** the corpus draws four visibly different widths — **brook** (hf11's, a hairline with a plank bridge), **stream** (hf16's, ~⅓ a house length, forded/footbridged), **river** (hf3, hf23, hf62 — cargo boats drawn on it, bridges are engineered structures), **great river** (hf30, hf34 — islands in the channel, multiple arches, quay basins). **Every plate with a port or a fish market sits on class 3 or 4** [E]; no trade settlement in the corpus sits on a brook.
**Law:** §205.2 (river class follows function). **Status:** covered; the atlas supplies the four-rung visual ladder and confirms the contradiction census's premise.

### T-14 · WATER IS A RESERVED RIGHT-OF-WAY, AND IT IS *WORKED*
**Target [E]:** in every plate where the town meets water, the meeting is **built**: quays project into the channel (hf13, hf31, hf62), bridges span (hf62's has a mid-span gatehouse), water gates open through the wall at the banks (hf21, hf24, hf62), mill races are cut (hf62 two, hf73 one with four mills), booms chain the channel (hf24). Nothing sits *in* the channel.
**Law:** §205.1 navigability + §161b terraforming. **Status:** covered.

### T-15 · POLLUTION AND DOWNSTREAM CONSEQUENCE
**Target [E]:** hf56 draws the dye-works discharge as a spreading multi-colour plume widening downstream, with the noxious quarter downwind (a wind-head cartouche declares the bearing) AND downstream of the town.
**Law:** §6's noxious rule + §161c EDGE ring cover the SITING. **GAP-F: nothing covers the downstream CONSEQUENCE mark.** Mechanism sketch: a noxious organism adjacent to flowing water emits a `dischargePlume` wash along the flow vector for a banded distance, at a chroma the rest of the plate never uses. One accent, high narrative return, cited to the noxious institution's own record.

### T-16 · LANDMARK BUDGET AND THE SCALE LADDER
**Target [E]:** landmarks legible per view — thorp **1**, hamlet **1–2**, village **2–5**, town **3–7**, city **4–9**, metropolis **9+**. Landmark : ordinary-house **footprint** ratio — thorp **1.6:1**, village **3–4:1**, town **5–6:1**, city **~8:1**, metropolis **~12:1**.
**Law:** §5's monumental-silhouette budget + §161n institution-scale ladder. **Status:** covered; numbers supplied.
**Corollary [E]:** the corpus also shows **prominence responding to STATE, not only to rank** — hf57 draws the granary heavier than the church in a famine year. §161n's ladder is tier-driven; **GAP-G: a state modifier on prominence.** Mechanism sketch: one banded ± rung shift on institutions whose category matches the active stressor's relief function.

### T-17 · DISTRICTS READ WITHOUT LABELS, VIA THREE CHANNELS ONLY
**Target [E]:** across the whole corpus, districts are distinguished by exactly three things and never by a boundary line: **(1) GRAIN** (parcel size and regularity — hf26, hf32, hf40, hf41, hf72), **(2) MATERIAL/ROOF HUE** (hf26's new tile, hf34's ward washes, hf40's wealth split), **(3) FOOTPRINT SHAPE AND REPETITION** (hf54's warehouse ranks, hf56's vat bars, hf57's pens). Boundary lines appear only for *jurisdictions* (hf35's dashed ward bound, hf60's gang lines, hf84's territories), never for character zones.
**Law:** §5.0c/§5.0d (dithered overlap, no gradients), §10.A3 ward wealth. **Status:** covered in principle. **GAP-H: no law says districts must be legible WITHOUT their labels.** Mechanism sketch: a `districtLegibility` census — render label-free, and assert that each district's parcel-area median and roof-tone median differ from its neighbours' by a stated minimum. This is the acceptance test §8.4's glance layer actually needs.

### T-18 · THE VINTAGE TRIAD (the corpus's most reusable mechanic)
**Target [E], from hf26 (fire), hf32 (growth rings), hf41 (boom), hf72 (ribbon), hf73 (reclamation):** a quarter's build-vintage drives **three coupled dials** — (1) block regularity, (2) plot-width variance, (3) roof pigment. Newer = more regular, less variance, different pigment. Old cores keep their grain forever.
**Law:** §11.0 inertia + §11.1 promotion + §161d.4 vintage. **Status:** the laws exist and the mechanism is implicit in all of them; **naming the triad makes ONE implementation serve fire-rebuild, growth-rings, boom fringe, faubourg enclosure and reclamation.** Recorded as the highest leverage-per-cost mechanic in this study.

### T-19 · THE FOUR-STAGE DECAY LADDER
**Target [E] from hf37, hf70, hf59:** ruin renders in four DISCRETE stages, never a fade — (1) full outline, no fill; (2) broken outline + rubble stipple; (3) foundation line at ~40% weight with vegetation wash over; (4) a field-boundary-weight trace only, reused as agricultural geometry.
**Law:** §161g.1 ruin ring. **Status:** covered; the ladder supplies the discretisation §9.2 requires.
**And [E]:** hf70 proves stage 4 costs nothing new — **the dead blocks are fed to the field generator on their own bearing.**

### T-20 · THE GHOST REGISTER (one opacity, one dash)
**Target [E] from hf59, hf41, hf35, hf84:** four different "not-quite-there" states all use the SAME treatment — ~35–40% ink weight, broken outline, no fill: the abandoned farmstead, the surveyed-not-built streets, the out-of-ward context fabric, the surface city above the undercity.
**Law:** §12.6 fog folio-isation + §12.8 pentimento + §13.2 registration. **Status:** the laws exist separately; **the corpus shows they should share ONE register.** Recommend a single `ghostInk(weight 0.38, dash 6-2, no fill)` used by all of them.

### T-21 · EXTRAMURAL GROWTH IS THE DEFAULT
**Tally [E]:** of ~29 walled plates, **[E] ~20 show growth outside the wall** — camps at the busiest gate (hf20, hf42), ribbon along every radial (hf32), a whole new quarter (hf73), the boom fringe (hf41), a shanty belt on the poor side only (hf40), inns/stables outside (hf54's alley belt).
**Law:** §5.0e faubourg law + §18.2 extramural inn belt. **Status:** covered. Frequency target: extramural growth present in ≥ 60% of walled settlements, concentrated at ONE or TWO gates (never evenly distributed) — hf20, hf40, hf41, hf42 all show single-gate concentration.

### T-22 · THE WALL-FOOT TELL
**Target [E]:** hf55's barracks abut the inner curtain face directly; hf40's shanties lean on the outer face; hf24's besieged town has clear ground both sides.
**Law:** §5.0e.3 (wall-foot tell) + §200.2 (abutment as an explicitly-derived variant). **Status:** covered — and the corpus shows **the inner-face abutment variant is NORMAL in military compounds**, which the §200 census must exempt by name or it will red on correct output.

### T-23 · THE ROAD LADDER
**Target [E] from hf71:** five rungs, five DISTINCT primitives (not one primitive scaled) — paved+shouldered+milestoned / double-edged unpaved / thinning single line with encroachment / dotted / field-boundary trace. Plus hf36's cart-track (double line, dashed centre) and hf63's pack track (dashed with animal glyphs).
**Law:** §11.3 road-death ladder (HIDDEN never absence). **Status:** covered; the atlas supplies the drawn vocabulary and the milestone accent.

### T-24 · GROUND PRIMITIVES ARE PER-LAND-USE, NOT UNIVERSAL
**Target [E] from hf36, hf3, hf71, hf52:** furrow (parallel strokes at the parcel's own bearing), pasture (flat + tuft ticks), orchard (jittered tree-round grid), waste (stipple + scrub), reed (tick clusters), terrace (contour lines + tick pairs). Hedgerow boundaries carry individual tree rounds at *irregular* spacing.
**Law:** §2 dressed-ground law + §16 open-field ruling. **Status:** covered.

### T-25 · CHROME ESCALATES WITH TIER
**Target [E] from hf61:** cartouche (plain rule box → moulded frame → ornate scrolled frame with colour), compass (4-point plain → 8-point coloured), scale bar (three registers). Plus 3–8 seeded paper defects per leaf.
**Law:** §12 immersion suite + §9.4 document conceit. **GAP-I: no law ties chrome complexity to tier.** Mechanism sketch: one `chromeRung` value from tier×prosperity drives all three surfaces. Cheap, and it makes the tier read even in the margins.

### T-26 · THE ANNOTATION LAYER IS A SEPARATE INK
**Target [E] from hf60, hf84, hf58:** overlay ink is (1) a different hue family (red/rust), (2) always dashed or dotted, (3) always with a leader line and a serif label, (4) drawn above with zero interaction with the base ink.
**Law:** §10.C (DM lens) + §3's audience projection. **Status:** covered in policy; the four drawing rules are new and are recommended as the DM lens's rendering contract.

---

## §2.3 · AESTHETIC CALIBRATION (ODQ §208)

### ⭐ §2.3.0 · §244-FOLD — HOW THE BANDS BELOW ARE PINNED, AND THE TWO LAWS THAT GOVERN EVERY FUTURE RE-DERIVATION

**LAW 1 — THE STRONGEST-COHORT RULE (§244.4, and it governs all future re-derivation).** Aesthetic bands re-pin to the **STRONGEST MEASURED COHORT — never to the corpus median.** The cohort is defined and computable: **HF-1-era plates (n=49) ∪ the measured top decile on the register index (threshold 73.78; n=32; 10 plates in both) = n=71.** *Why the rule exists:* the corpus grew paler round by round — paper warmth fell from 37 to 24 between HF-1 and HF-3 and never recovered; chroma, grain and wash all fell with it. **Pinning to the corpus median would ratify our own drift and make the north star chase the generator that drew it.** A band is a statement about what we are aiming at, not a description of what we happened to produce.

⚠ **ONE SENSITIVITY — NOW RULED BY THE CHAIR (ODQ §249.4a); the paragraph below records the reasoning, the ruling binds.** The cohort is the **union** of the two terms §244.4 names. That matters in exactly one band — **paper warmth**: HF-1 alone gives centroid `#F9E9D5` / warmth **37** (HF-M1's original recommendation), the union gives `#FAEBD8` / warmth **34**, because the top decile is selected on the register index and **the register index deliberately excludes chroma and warmth** — so those 32 plates are demonstrably stronger on *hand*, not on *paper colour*. Both sit far above the corpus median's 25, so §244.4's intent is served either way.

✅ **THE CHAIR'S RULING (§249.4a, and it is the binding figure): PAPER WARMTH PINS AT 37, centroid `#F9E9D5`.** The general cohort stays the union; the narrow amendment is that **any axis the register index does not score pins to HF-1 alone**, and warmth is exactly that case — a plate can be top-decile on *hand* while being cool on *paper*, so admitting those 32 dilutes a target the index never measured. Only the paper row moves; every other band is insensitive to the choice. ⚠ Where this document still prints **34** below (the §244-FOLD paper rows and the §2.9 correction ledger), read **37 / `#F9E9D5`** — those rows were written before the ruling and are superseded by it.

> ⭐ **The consequence a future lane must not miss: re-pinning correctly does not merely refuse the drift — it raises three of the six hand bands ABOVE what MF-S1 published.** MF-S1's aesthetic figures came from a **12-plate** sample whose median sat *below* its own cohort's (paper grain median 1.81 over the 12 against 2.19 over the 49). Measuring more and pinning to the strongest therefore moves grain, wash and tone-IQR **up**, not down. Anyone who re-derives from the 313 median will get the opposite sign on all three, and will be wrong.

**LAW 2 — A GRADING COHORT MUST BE MEASURED AGAINST THE SAME INSTRUMENT AS ITS PREDECESSORS BEFORE ITS GRADES ARE SPENT (§244.2).** Star grades, "best in corpus" calls and register-edge judgments are **annotations until the cohort that issued them has been measured on the same ruler as the cohorts before it.** The case that produced the law: HF-4c awarded ★★★ to **55 of 78 (70.5%)** — not the 41 (52.6%) its own receipt reported — against HF-3's **2 of 84**; measured, that same cohort is the **weakest of the five rounds on every one of this atlas's own hand axes**, and the gap survives controlling for subject (HF-1 towns: register 64.2, wash σ 3.45, **zero** ★★★; HF-4c towns: 27.9, 1.63, **fifteen**). ⛔ **RULING IN FORCE: HF-4c's star grades are ANNOTATIONS ONLY. No calibration figure in this document, or in any document that cites it, may derive from them.** Full audit: `map-corpus/docs/HFM1-star-audit.txt` (all 78 rows, titles quoted).

**A NOTE ON WHAT "BAND" MEANS BELOW.** MF-S1's published bands were **min–max over n=12**, which widens mechanically with sample size and cannot be compared to a band over n=71. The corrected bands are stated as **p5 – median – p95** with min–max in parentheses, which is the honest comparison and the convention HF-M1 used. Every corrected figure is computed from `map-corpus/docs/laneHFM1-corpus-measured.csv`.

### §2.3.1 · THE MEASURED PALETTE

**Paper [M — §244-FOLD, re-pinned to the strongest cohort, border-excluded]** — mean RGB of the brightest 2% per plate, **measured inside the plate's border** (see §0's instrument caveat). Target centroid **#FAEBD8** (L **237.3**, warmth R−B **34**); band **L 226 – 244**, warmth **20 – 50**. It is warm cream, never white, and never grey.
✅ **THE TARGET BARELY MOVED — MF-S1's centroid #FBEBD6 measures L237.4 / warmth 37 and the re-pinned one L237.3 / warmth 34, identical within noise.** Two things nevertheless changed and both matter:
- ⛔ **the published top-of-band `#FEF9ED` and the note "hf35/hf61 push to #FFFFFF at specular highlights" are WITHDRAWN as ARTEFACTS** — MF-S1 applied its border inset to the ink measure and not to the paper measure, so those readings are the plate's white scan border. (`hf35` reads `#FFFFFF` un-inset and `#FBF2E5` inset.) The corpus's paper is warmer and tighter than published.
- ⚠⚠ **THE CORPUS MOVED AWAY FROM THE TARGET, AND THIS IS THE SINGLE MOST CONSEQUENTIAL BAND FACT IN THE DOCUMENT.** Paper warmth by round: HF-1 **37** → HF-2 27.5 → HF-3 **24** → HF-4b 23 → HF-4c 24, and the share of plates inside the published L 222–244 band fell **96% → ~55%**. The paper is going white. A renderer that targets the corpus median (**#FBF2E2**, L 243, warmth **25**) inherits the drift; **it must target #FAEBD8 / warmth ~34.**

**Ink [M — §244-FOLD, re-pinned]** — mean RGB of the darkest 0.5% per plate. Excluding plate borders and the night lens, centroid **#2E201A** (L **34.3**); ink L band **p5 16.5 · median 35.2 · p95 66.4** (night lens included: centroid #2C1F1A, p5 6.6). ★ **The corpus's ink is a WARM DARK BROWN-BLACK, not black and not grey** — CONFIRMED; MF-S1's published centroid #331F16 measures L36.0, so **the ink centroid is UNCHANGED under correct pinning** (the *corpus* centroid #372822 is lighter and cooler, and is drift).
⛔ **§244-FOLD — "Plates whose ink lands above L≈100" IS AN ERROR, and it descends from the same mis-transcription as hf10's "L109".** The three plates it names measure **hf10 L66.0 · hf24 L76.3 · hf60 L87.6** — **not one is above 100**, and no plate in the 313 is. **The threshold the sentence was reaching for is L≈62**, which is exactly where the replacement quality gate now sits (below).

**Value structure [M — §244-FOLD]** — plate luminance percentiles, strongest cohort: **L1 ≈ 52 · L10 ≈ 115 · L50 ≈ 202 · L90 ≈ 231 · L99 ≈ 237**. The distribution is strongly paper-weighted with a thin dark tail — **the page is light, and the ink is the event**, CONFIRMED. (On MF-S1's own 49 the recovered instrument returns **57 / 123 / 201 / 230 / 236** against this atlas's published 57 / 125 / 202 / 231 / 240 — the L99 gap is instrument recovery, not drift.)

⛔⛔ **THE VALUE-RANGE BAND IS RETIRED (§244.4). INK L REPLACES IT AS THE QUALITY PROXY.**

> **RETIRED, and why — it is arithmetically self-contradicting on this atlas's own archived numbers.** The published rule read *"value range (L1→L99) is 150–190 in the strong plates and drops to 70–90 in the weak ones (hf10 70, hf60 83, hf24 87, hf57 78) … a plate under ~120 L of range looks washed out regardless of its geometry."* **Two different quantities are conflated in one sentence and the rule is unusable in either reading.** The four "weak" figures are the **palette-8 cluster range** (max−min L over the eight median-cut clusters) — and on that metric **hf50, this atlas's declared aesthetic north star, measures 78, identical to the famine plate the same document calls weak**; only 5 of MF-S1's own 49 reach 150; **32 of its own 49 sit under 120**, the threshold the same paragraph says means washed-out, as do **210 of the 313 (67%)**. Read instead as the *true* L1→L99 percentile range — which is what the label actually names — the corpus median is **173.8** and **exactly one plate of 313 falls under 120**, so the rule never fires. It condemns everything or nothing.
>
> ⚠ **NAMING RULE THAT BINDS EVERY PER-PLATE ROW IN PART 1: every "value range A–B" quoted in a (k) row is the PALETTE-8 CLUSTER RANGE, not the L1→L99 percentile range.** Those figures are sound measurements; only their label and the gate built on them were wrong. Both quantities are carried per-plate in `laneHFM1-corpus-measured.csv` (`value_range_pal8`, `L_range_1_99`).

> ⭐ **THE REPLACEMENT — INK L, the mean luminance of the darkest 0.5%, which is what this atlas's own prose was already reaching for.** Derived on the strongest cohort (n=71):
>
> | rung | ink L | where the threshold comes from |
> |---|---|---|
> | **full ink** | **≤ 45** | the strongest cohort's **p75** is 43.8 — the darkness three quarters of it achieves |
> | **acceptable** | **45 – 62** | — |
> | ⛔ **under-inked** | **> 62** | the **p93** of the strongest cohort (62.1) *and* the light end of MF-S1's own published ink band (`#5E3420` = L62.3) — two independent derivations landing on the same number |
>
> It catches **hf10 (66.0), hf24 (76.3), hf60 (87.6)** — three of the four plates this atlas names as weak — while reading **hf50 at 70.2** as *a deliberately low-contrast lens* rather than a defect, and correctly **NOT** flagging **hf57 at 37.9**, since famine is drawn by subtracting accents, not by lightening the fabric. **13.7% of the 313 exceed the gate; only 7.0% of the strongest cohort does.** Report the true L1→L99 range alongside as **descriptive, never as a gate**.

**Chroma [M — §244-FOLD, re-pinned]** — mean (max−min) across channels: **band 18 (hf5) – 70 (hf72), median 43.3** (p5–p95 23.6 – 61.9, n=71). ✅ **UNCHANGED — this is the band that best demonstrates why the pinning rule matters.** Re-derived from the *corpus median* the figure is **36.2**, a −8 (−18%) move with the top of the band collapsing from 70 to 52 at p95; re-derived from the **strongest cohort** it is **43.3**, within rounding of MF-S1's published 44, and both endpoints are preserved exactly because both extremes are HF-1 plates. **The −8 is a fact about the generator's drift, not about the target.** (For scale: HF-4c's median chroma is 33.2 and its maximum 47.6 — that cohort's entire colour range fits below the published band's midpoint.) The colour plates cluster **46–70**; the near-monochrome plates **28–40**. ★ hf40 achieves the corpus's clearest wealth read at chroma **27.8** — **colour is not what carries the information**, which is also why the register index deliberately excludes chroma.

**Role values, read from the strong plates [M/E]:**

| Role | Measured band | Note |
|---|---|---|
| Paper | ⚠ **§244-FOLD: centroid #FAEBD8, L 226–244, warmth R−B 20–50** (published #F7E1C8–#FEF9ED / L 222–244; the top of that band was a scan-border artefact) | warm cream — **target the centroid, never the corpus median #FBF2E2** |
| Roads | the palest built role — bare paper or paper +2 L | **[M]** confirmed on hf50, hf40, hf72, hf62 |
| Roofs | L 128–196; hf72 #DEBB8E/#D2AD82/#B8926D, hf34 #BE9F7F/#AF8C69/#8C705A | **[M]** ≥3 value steps below Roads in every plate — §9.7's binding sub-law confirmed |
| Greens (yards/tofts) | sage #A8AE84-family, hf72's back plots | one family, 3–5 tones |
| Water | river = a mid wash + dark bank line; sea = same family one band darker (hf31 #828E9B) | never a hue jump |
| Ink | ⚠ **§244-FOLD: centroid #2E201A** (published #331F16 — L 34.3 vs 36.0, unchanged within noise) | warm; **and it must clear the ink-L gate: ≤45 full ink, >62 under-inked** |
| Walls | equal to Ink or one step darker | §9.1's role/weight split confirmed |
| Accent | reserved: hf56's vats, hf5's candle ochre #E2CEB7, hf60's annotation rust | **rationed, ~1–3% of plate area [E]** |

### §2.3.2 · LINE — THE MEASURED WEIGHT HIERARCHY

**[M — §244-FOLD, re-pinned to the strongest cohort, n=71]** stroke widths normalised to a 5056 px plate: **p25 ≈ 4 px · p50 ≈ 6 px · p75 ≈ 10 px · p90 ≈ 17 px**. ✅ **The four percentiles are UNCHANGED** — one pixel finer at p25/p50 on a 5056 px plate is negligible.
⚠ **Lineweight ratio p90/p25 = 3.1 – 5.7 – 7.2 (p5 – *median 4.33* – p95); min–max 2.8 – 9.3.** **MOVED at the median, 3.55 → 4.33 — and this one is a SAMPLE-SIZE CORRECTION, not corpus drift.** MF-S1's 3.55 came from n=12; on its own 49 the median is already **4.00**, and on the strongest 71 it is 4.33. The floor holds at 2.8. **The ink hierarchy in the corpus is STEEPER than this atlas published, which raises the bar for b6, not lowers it.**

That ratio is the §9.1 ink hierarchy, measured. In practice it distributes as roughly:

| Element | relative weight | evidence |
|---|---|---|
| Wall circuit | **4.0 – 5.0** | hf55 [M] p90 = 35 px (the heaviest strokes measured) |
| Landmark silhouette | 2.5 – 3.5 | hf70's cathedral, hf59's lodge |
| Block silhouette | 2.0 | hf40 native crop [M] |
| Street-fronting building edge | 1.0 (the reference weight) | — |
| Interior party-wall / unit division | **0.5** | hf40, hf50 native crops [M] |
| Plot-boundary tick | 0.4 – 0.6 | hf35, hf56 native crops |
| Field boundary / furrow | 0.25 – 0.4 | hf36 |
| Ghost register | 0.38 with a 6-2 dash | hf59, hf41, hf35 |

★ **A uniform-weight map is the conviction ("unintelligible geometry") restated. The corpus never has fewer than five distinct weights on one leaf.**

### §2.3.3 · THE HAND — WHAT MAKES IT PAINTED, NOT PLOTTED

Six properties, all confirmed at native resolution, each stated as a renderer mechanic:

1. **PER-STROKE WIDTH MODULATION [E from native crops].** A single stroke varies ±25% along its run (nib pressure). *Mechanic:* stroke each path as a filled outline whose half-width is a seeded low-frequency function of arc length.
2. **PATH WAVER [E].** No line is straight, including nominally straight plot boundaries and block edges. Amplitude ≈ 0.5–1.5× the stroke width. *Mechanic:* per-vertex seeded displacement + midpoint subdivision, amplitude keyed to the element's weight class (heavier elements waver less, proportionally).
3. **CORNER OVERSHOOT [E on hf35, hf3].** Joins overshoot by 2–5 px at 30–60% of corners. *Mechanic:* extend each segment past its join by a seeded fraction at a bounded subset of joins.
4. **WASH MIS-REGISTRATION [E on hf50, hf3 — the single most decisive property].** Fill colour runs 2–8 px past the ink outline in places and falls short in others. *Mechanic:* offset each fill path by a seeded per-fill vector of magnitude ~0.3–1.2× the stroke width, and dilate/erode it slightly. **This is the one property that, if omitted, will keep the output reading as vector art no matter what else is done.**
5. **WITHIN-FILL WASH VARIATION [M — §244-FOLD, re-pinned].** `wash_within_σ` = **1.83 – *3.29* – 4.39** (p5 – median – p95, strongest cohort n=71; min–max 1.22 – 4.44). ⚠ **MOVED UP at the floor (1.22 → 1.83) and slightly up at the median (3.1 → 3.29).** Against the corpus median it would have moved *down* to 2.70 — HF-4c's own median is **1.68** and its p25 is **1.09**, i.e. half that cohort sits below even the published floor. Pinning to the strongest cohort is what keeps this band a target instead of a description. *Mechanic:* per-fill, a seeded 2–4 stop irregular value ramp (±5–10 L) plus a darker rim on the 1–2 edges nearest the fill's offset vector (pigment pooling). Must be produced as *geometry or a tiled pattern*, not as a raster filter, to survive PDF projection.
6. **PAPER GRAIN [M — §244-FOLD, re-pinned].** `paper_grain_σ` = **1.30 – *2.05* – 2.96** (p5 – median – p95, strongest cohort n=64 with measurable blank paper; min–max 1.00 – 3.41). ⚠ **MOVED UP at the median, 1.8 → 2.05**, because the published median came from a 12-plate sample whose median (1.81) sat below its own cohort's (2.19 over the 49). Against the corpus median it would have moved *down* to 1.48, with **31% of plates below the published floor** and HF-4c at **1.17**. ⚠ Sixteen plates have **no measurable blank paper at all** (`hf4 hf15 hf34 hf59 hf70 hf90 hf143 hf197 hf218 hf238 hf248 hf251 hf274 hf283 hf297 hf299`) — that is data, not a gap: they are the densest plates in the corpus. Plus **[E]** 3–8 discrete paper defects per leaf (blots, foxing spots, a crease line — hf61 shows them explicitly).
7. **PER-FILL TONE JITTER [M — §244-FOLD, re-pinned].** `fill_tone_IQR` = **8.0 – *22.0* – 66.5** (p5 – median – p95, strongest cohort n=71; min–max 4.0 – 100.1). ⚠ **MOVED UP at the median, 18 → 22**, same cause as paper grain. The published ceiling is real and is now exceeded: the corpus maximum over 313 is **153.0** (hf165), not hf56's 100.1. Two nested levels in the best plates (hf34): a **ward-level** sub-palette pick, then a **building-level** jitter inside it. That nesting is what produces IQR ~50 without the plate looking like confetti.
8. **ONE FIXED LIGHT, HARD-EDGED [E].** Every plate that shades (hf11's tree crescents, hf55's motte hachure, hf14's spoil fans) uses one direction and a hard edge. §9.5's shadow ruling is corpus-confirmed; softness is the ban, not shading.

### §2.3.4 · LETTERING [E]
Serif throughout; small-caps for display; italic for marginalia; loose letter-spacing on display type; labels curve along their feature (hf72's VIA GRANDE follows the street; hf58's ward names sit inside the wards). Gate and road names encode DESTINATION (hf21's Porta Peregrina/Mercatorum, hf63's Porta Fluminis) — **and hf61's gibberish text is where our truth layer wins outright.**

---

## §2.4 · THE STANDING CRITIQUE, EXTENDED

The existing list (concentric drift · sunburst fields · default river bisection) stands and is confirmed. **This study adds nine.** All are model priors or generator defects, not laws to follow.

| # | Prior / defect NOT to emulate | Worst exemplars | Why it is wrong |
|---|---|---|---|
| 1 | **Concentric / polygonal town shape on flat ground** *(standing)* | hf15 (worst), hf42, hf57, hf20, hf24 | §5.0.3 — planned geometry needs a planning authority in the facts |
| 2 | **Radial sunburst field parcels** *(standing)* | hf3, hf10 | §16.2 — orientation toward the village is law; terrain-blind symmetry is banned |
| 3 | **Default river bisection** *(standing)* | — (the corpus actually refutes it: THROUGH is only 12% [E]) | §5.0b — THROUGH is earned |
| 4 | **NEW · Empty blocks / block-wash LOD** — block outlines with no fabric inside | hf25 (two-thirds of the town), hf34 (northern wards) | The op-budget will tempt us into exactly this. It destroys the study layer and is visible at glance range. |
| 5 | **NEW · Oblique/pictorial projection on the plan leaf** | hf12, hf31, hf52, hf54, hf70, partly hf14/hf59 | §9.5's era law — the Plan is the flagship |
| 6 | **NEW · Machine-perfect regularity in planned/new quarters** | hf4, hf26's new quarter, hf41's grid, hf72's ribbon, hf73's reclamation | Real planned fabric drifts. Regularity is a *dial*, never a lattice. Add ±10–20% jitter to "regular" quarters. |
| 7 | **NEW · Even spacing of repeated elements** — towers, crenellations, contour hachures, tent rows, tree ticks | hf55 (towers), hf62 (crenels), hf63 (contours), hf42 (tents), hf36 (hedgerow trees are correctly irregular — the counter-example) | Even spacing is the strongest "generated" tell in the corpus. Every repeated element needs seeded spacing variance. |
| 8 | **NEW · Thinning the whole ink hierarchy to express a state** | ⚠ **§244-FOLD — exemplars RESTATED on ink L; the prior itself STANDS.** **hf24** (siege, **ink L 76.3 — under-inked**) is the true instance, and **hf10** (thorp, 66.0) is the same failure outside a state plate. ⛔ **hf57 is REMOVED as an exemplar and recorded as the COUNTER-EXAMPLE: its ink measures L37.9, FULL INK** — famine was drawn correctly here, by subtracting accents. | State marks must be *added geometry in the same ink family*. Famine is drawn by subtracting ACCENTS, never by lightening the fabric — and hf57 proves the corpus knows how. The old evidence (value range 87 / 78) is retired with the band; on that retired metric hf57 read *worse* than hf24, which is backwards. |
| 9 | **NEW · Uniform grain across a whole settlement** | hf33 (every quarter equally chaotic), hf13 (roof tones too uniform), hf24 | Real settlements always have a rich street and a poor one. Grain variance *within* a settlement is as important as grain level. |
| 10 | **NEW · Symmetric two-bank development on a THROUGH river** | hf16 (the two banks mirror) | One bank always builds first (hf30 does it right at ~70/30) |
| 11 | **NEW · Clean wealth boundaries** | hf40 (a single line divides rich from poor) | Reality gradates over 2–3 blocks; §5.0d's parcel dithering is the correct mechanism and the corpus under-uses it |
| 12 | **NEW · Corrupt / decorative lettering** | hf61 (gibberish legend), hf35, hf50 (garbled labels) | Our labels are TRUE. This is a competitive win, not a style to copy. |

---

## §2.5 · THE DELTA TABLE — b6 AGAINST THE ABSOLUTE BAR

**Basis.** b6 exemplars inspected directly: `town-town-parchment` (Mahabagh, 3,502 souls, 3000 px), `city-city-parchment` (Kitaqiao, 20,091), `metropolis-metropolis-parchment` (71,325), `village-village-parchment` (Mingguan, 512), plus `TE-zoom-b6-center.png` and the watercolor/illustrated lenses. Measured with the **same pipelines** as the references. Manifest figures quoted where they exist.

**Grading vocabulary (§8.3b — absolute distance, never "improved"):** **MEETS** = could sit beside its reference without embarrassment · **MISSES** = the property exists but at the wrong value · **ABSENT** = the property is not expressed · **CANNOT YET EXPRESS** = no mechanism exists to produce it.

⚠ **§244-FOLD — ONE GRADING CONVENTION CHANGED, AND A NEW VERDICT IS NOW AVAILABLE.** (1) In the T-01 rows *"vs the band floor"* now means **the T-01 target band's lower endpoint**, not the corpus's measured minimum, because the re-measured minima are contaminated single cases (hf128's dispersed corral at 19.4, hf389's 70.2) and grading against them would flatter the renderer for the wrong reason. (2) A fifth verdict is added: ⛔ **WITHDRAWN** = *the target itself has been retracted and the property may not be graded until a named instrument exists.* It is not a pass and it is not a fail — it is an admission that we do not currently know how to measure the thing, and it must never be silently converted into either.

### Table A — URBANISM

| # | Target | Corpus [M/E] | b6 [M/E] | Verdict |
|---|---|---|---|---|
| — | ⛔ **T-01, thorp and hamlet** | ⛔ **WITHDRAWN (§244.5)** | — | ⛔ **NOT GRADED — no instrument.** Any thorp or hamlet grain verdict, in this table or any successor grading sheet, is withdrawn |
| T-01 | Grain, village | 19.4–**45.9**–60.3 (n=9); band **30–50** | **9.6** [M] | **MISSES ×3.1 vs the band floor, ×4.8 vs the median** |
| T-01 | Grain, town | 41.0–**57.0**–79.0 (n=12); band **45–80** | **26.0** [M]; manifest 563 parcels | **MISSES ×1.7 vs floor, ×2.2 vs median** |
| T-01 | Grain, city | 52.0–**69.0**–90.0 (n=9); band **60–95** | **20.0** [M]; manifest 818 parcels | **MISSES ×3.0 vs floor, ×3.5 vs median** |
| T-01 | Grain, metropolis | 70.2–**97.6**–119.6 (n=9); band **80–120** | **20.9** [M]; manifest 878 parcels | **MISSES ×3.8 vs floor, ×4.7 vs median** (was reported ×5.4 against a withdrawn n=1 figure) |
| T-02 | Grain climbs with tier | monotonic, **×1.21–1.41**/tier (re-measured; published ×1.25–1.5) | **town 26 → city 20 → metropolis 21** [M]; parcels 563→818→878 (+7% city→metropolis for ×3.5 population) [manifest] | ★ **MISSES — the walk INVERTS at town→city and flatlines above.** The most consequential single failure. Confirms §199.2c's fixed point with a number. |

**Honesty note on the T-02 inversion.** Two independent sources agree on the substance but describe it differently, and both belong in the record. **(1)** The b6 town leaf renders at 3000 px and the city/metropolis at 1200 px; I checked this is *not* a resolution artefact — the city's measured cell pitch is 38.5 px at 1200 px wide, far above any merging threshold. **(2)** The measured inversion is partly a *spread* effect rather than a *size* effect: the b6 city's parcels are more numerous than the town's (818 vs 563) but distributed over a much larger extent, so a scan line crosses fewer of them. Either way the corpus target is missed, because the corpus's cities are **both** finer-grained **and** more tightly packed than its towns — b6's city is neither.
| — | Plot frontage vs tier | narrows as land value rises | **town 7.29 → city 8.83 → metropolis 10.86** [manifest] | ★ **MISSES — inverted.** The largest settlements have the WIDEST plots. |
| T-03 | Density gradient | organic 2.5–5.0 | town 5.35, city 2.38, metropolis 3.39, village 4.85 [M] | **MEETS** (the one urbanism target b6 already lands) |
| T-04 | Street hierarchy p97/p50 | organic 16–30 | **8.5 / 9.4 / 10.3** (town/city/metropolis) [M] | **MISSES ~½ the depth** |
| T-04 | Widest channel (p99) | 2.7–6.4 plot-widths | **3.67 / 2.75 / 2.99** [M] | **MISSES** — no true market void or arterial class |
| T-09 | Alley/sliver floor (p25) | 0.02–0.08 | **0.09 / 0.08 / 0.08** [M] | **MISSES** — the floor is too HIGH, i.e. uniform spacing, not tight packing |
| T-05 | Open share in core | town 2–13%, city 1–11% | town 2.8%, city 12.5%, metropolis 4.2% [M]; builtAreaPct 18.5 / 30.4 / 36.1 [manifest] | **MEETS at town; MISSES at city** (too airy) |
| T-07 | Party-wall packing, two-tier block stroke | dominant at town+ | footprints abut (disjointness is clean, §190 landed) but **there is no block silhouette and no two-tier stroke** — every building carries the same outline weight | **CANNOT YET EXPRESS** — needs the `blockSilhouette` pass (GAP-D) |
| T-08 | Burgage plot series | 4–6:1 depth:width, building at the frontage, continuous frontage line | **ABSENT** — parcels read as a scatter of similar rectangles; no frontage line continuity | **ABSENT** (§18.5 currently deferred) |
| T-06 | Court frequency | interior yards common; route-isolated ≤12% of blocks | yards exist (398 town / 393 city / 272 metropolis [manifest]) but read as gaps rather than as courts, because there is no block to be interior to | **CANNOT YET EXPRESS** — depends on T-07 |
| T-10 | Wall flank grammar | full ring 55%, half-ring 17%, terrain-anchored 14% | wall traces are present and hug reasonably; the b6 city's circuit runs long straight segments across open ground at sharp angles | **MISSES** — trace reads geometric, not economic |
| T-12 | Water mode incidence | BANKSIDE 44%, THROUGH 12% | b6 **declares** the mode in the cartouche ("WATER BANKSIDE") and honours it | ★ **MEETS** — and the declaration is something no reference does |
| T-13 | River class ladder | four rungs | one width [E] | **ABSENT** (§205.2 explicitly permits deferral to wave eight with cause) |
| T-14 | Water is worked | quays, water gates, bridges, races | bridges ✓, water gates ✓, gatehouses ✓ | **MEETS** |
| T-16 | Landmark budget | town 3–7, city 4–9, metropolis 9+ | monumentals 11 / 18 / 26 [manifest]; landmarks 91 / 52 / 62 | **MISSES** — monumental count is 2–3× the corpus's *legible* budget, and landmark footprint ratio is [E] ~2:1 against the corpus's 5–12:1 |
| T-17 | Districts legible without labels | grain + material + footprint shape | districts read **only** from the curved ward lettering; grain and material are near-uniform across quarters | **MISSES** — the glance layer is carried by type, not by drawing |
| T-18 | Vintage triad | three coupled dials | year-018/year-100 snapshots exist and the inertia proof landed; **but new fabric does not carry a distinct grain or pigment** | **MISSES** |
| T-19 | Four-stage decay ladder | 4 discrete treatments | roofless shells drawn as dashed boxes — **one** stage | **MISSES** (1 of 4 rungs) |
| T-21 | Extramural growth | ≥60% of walled, gate-concentrated | present (faubourgs landed in b5) and visible at the town's gates | **MEETS** |
| T-23 | Road ladder | 5 distinct primitives | countryside roads are wide pale ribbons of near-constant width | **MISSES** (1 of 5 rungs) |
| T-24 | Ground primitives per land-use | 6 distinct | field polygons are large flat washes with **sparse scattered ticks**; furrow, pasture, orchard and waste are not distinguished; field parcels are ~10–30× the corpus's size relative to the settlement | **MISSES** badly — the countryside is the weakest surface in b6 |
| T-25 | Chrome escalates with tier | 3 registers | cartouche, compass, scale bar, legend and heraldry shield all present and well-made — but identical at every tier | **MISSES** (present, not graded) |
| T-26 | Annotation layer contract | separate hue, dashed, leader, above | not yet exercised on the parchment lens | **not assessed** |

### ⛔ §244-FOLD — CONSEQUENCE FOR THE MAP PROGRAM'S LATER GRADING PASSES (recorded loudly, per §244.5)

This table grades **b6**. The same T-01 rows were later spent grading **b8**, and that grading is partly retracted by the same ruling. Recorded here because this document is the sheet those verdicts were graded against:

| MF-B8's reported verdict | disposition under §244.5 |
|---|---|
| **thorp grain "miss"** | ⛔ **WITHDRAWN — it was measuring an INSTRUMENT ARTIFACT, not a defect.** The scanline counts hedges, tofts and furrows at that tier |
| **hamlet grain "miss"** | ⛔ **WITHDRAWN — same cause**, and the rung it was graded against was itself interpolated through hf10's misplaced window |
| **town 48 — in band** | ✅ **STANDS.** The town band 45–80 is unchanged |
| **city 61 — in band** | ✅ **STANDS.** The city band 60–95 is unchanged |
| **metropolis 70 — miss** | ⚠ **STILL A MISS, BUT SMALLER THAN REPORTED.** Against the re-pinned band **80–120** the shortfall is ×1.14 from the floor, not the ×1.43 implied by the withdrawn 100–130 |

⚠ **THE GENERAL LESSON, which is why §244 ordered it recorded loudly: two of those "misses" were the grading sheet's fault, not the renderer's.** A withdrawn instrument does not merely stop producing new numbers — **it invalidates every verdict it has already issued**, and those verdicts have to be walked back by name in the place the grades live, or the renderer keeps carrying a defect it never had.

### Table B — AESTHETICS (§208)

| Property | Corpus [M] | b6 [M] | Verdict |
|---|---|---|---|
| **Paper grain σ** | ⚠ **re-pinned 1.30 – 2.96, median 2.05** (was 1.20–3.18, median 1.8) | **0.00** on every lens tested | ★ **ABSENT** — verdict unaffected by the re-pin |
| **Within-fill wash σ** | ⚠ **re-pinned 1.83 – 4.39, median 3.29** (was 1.22–4.44, median 3.1) | **0.00** median on every lens; p90 0.0–3.6 | ★ **ABSENT — every fill is mathematically flat** — verdict unaffected |
| **Per-fill tone jitter (IQR)** | ⚠ **re-pinned 8.0 – 66.5, median 22.0** (was 6.1–100.1, median ≈18) | town **4.0**, village 4.0, metropolis 4.0, city 16.5, **watercolor lens 0.2** | **MISSES ×5.5** at town/village/metropolis (was ×4 — the re-pin makes this gap *wider*, not narrower); the watercolor lens is *flatter than the parchment lens*, which inverts its own definition |
| **Wash mis-registration** | 2–8 px at native scale | fills register exactly to their outlines | ★ **ABSENT** — the decisive "vector art" tell |
| **Path waver** | on every line | all paths geometrically exact | **ABSENT** |
| **Per-stroke width modulation** | ±25% along a run | constant per element | **ABSENT** |
| **Corner overshoot** | 30–60% of joins | `stroke-linejoin="round"`, exact joins | **ABSENT** |
| **Lineweight hierarchy** | ⚠ **re-pinned p90/p25 = 3.1–7.2, median 4.33** (was 2.8–5.7, median 3.55 — a sample-size correction), ≥5 distinct weights per leaf | **[M exact, from SVG source]** the `fabric` group carries **ONE** `stroke-width="0.84"` for every building in the town leaf (1.02 city, 1.25 metropolis); 35 distinct widths exist across the whole plate but only ~150 elements carry an explicit width, and the fabric — the great majority of the drawing — is uniform | ★ **MISSES — the fabric is uniform-weight, which is the original conviction restated** |
| **Ink hue** | warm brown-black, ⚠ **re-pinned centroid #2E201A** (was #331F16 — unchanged within noise) | #2B2118 [M from SVG] | ★ **MEETS** |
| **Paper hue** | ⚠ **re-pinned centroid #FAEBD8, L 226–244, warmth R−B 20–50** (published #F7E1C8–#FEF9ED / #FBEBD6 — centroid unchanged within noise, **top-of-band withdrawn as a border artefact**) | #F3EBD6 [M from SVG] = L 235.0, warmth **29** | **MEETS** — inside both the L band and the warmth band, at the cool end. ⚠ **Now a live risk rather than a settled pass: the corpus itself drifted from warmth 37 to 24, so a later lane re-deriving from the corpus would move the target PAST b6 and turn this MEETS into a false pass** |
| **Roads palest, Roofs ≥3 steps darker** | universal | held | ★ **MEETS** |
| **Chroma** | ⚠ **re-pinned 18–70, median 43.3** (published 44 — UNCHANGED) | town 36.2, city 32.8, metropolis 37.2 [M] | **MEETS** (inside band, at the muted end — defensible) |
| ⛔ ~~**Value range (L1→L99)**~~ | ⛔ **BAND RETIRED (§244.4)** — arithmetically self-contradicting; see §2.3.1 | — | ⛔ **WITHDRAWN — this row may not be graded** |
| ⭐ **Ink L (the replacement quality proxy)** | ≤ 45 full ink · 45–62 acceptable · **> 62 under-inked** | **35.0**, derived by MF-S2 from b6's own measured ink #2B2118 [M from SVG] | ★ **MEETS — FULL INK.** The one aesthetic row where the correction *creates* a passing verdict rather than moving a failing one, and it is the axis on which 13.7% of the reference corpus fails |
| **One fixed light, hard-edged** | universal | SHADOW_DIR landed | **MEETS** |
| **Paper defects (blots, foxing)** | 3–8 per leaf | none | **ABSENT** |
| **Accent rationing** | 1–3% of plate area | held | **MEETS** |
| **Roof ridge/hip ticks** | ~2 extra strokes per building | a single diagonal stroke on some buildings | **MISSES** (partial) |
| **Lettering** | serif, small-caps, italic marginalia, curved along features | serif ✓, small-caps ✓, italic marginalia ✓, curved ward labels ✓ (landed b6, per-glyph) | ★ **MEETS** |

### Table C — WHAT b6 ALREADY DOES THAT THE CORPUS DOES NOT

Recorded so the delta is honest in both directions:

1. **Truth in the chrome.** Real settlement names, real populations, real prosperity, real founding kind, real water mode, a real 200-paces scale bar, real dated event marginalia. hf61's gibberish legend is the corpus's floor here and we are already above it.
2. **A declared derivation in the cartouche** ("FABRIC 1:1.3 HOUSEHOLDS (REPRESENTATIVE)", "REGULARIZED PLAN · FOUNDED MILITARY · WATER BANKSIDE", "RELIEF 0.30"). No reference states its own construction.
3. **An in-world legend that teaches the conventions** — the corpus has one plate of furniture; we ship it on every leaf.
4. **Six lenses over one geometry**, and a landed reskin-family pin.
5. **Determinism and byte-identical export.** Not visible, and the whole point.
6. **Zero footprint overlaps, zero street intersections, zero wall-band intrusions** across 11,295 bodies on 16 leaves (b6 receipt, §199.1) — a discipline no reference plate holds itself to. What I actually verified on the references: **hf35's native crop shows the market hall's outline crossing the block behind it**, and **hf25 and hf34 leave whole blocks unresolved**. I did not sweep the corpus for overlaps, so this is a spot observation, not a corpus-wide claim.

---

## §2.6 · THE FIVE THINGS THAT WOULD CLOSE MOST OF THE GAP

Ordered by measured leverage, for the chair and for MF-A1:

1. **GRAIN (T-01/T-02).** ⚠ **§244-FOLD — the target walk is corrected and now covers four tiers, not six.** Multiply parcel counts so `cells_across` walks approximately **46 → 57 → 69 → 98** from village to metropolis (the re-measured medians at n=9/12/9/9), and make the walk monotonic above town. ⛔ **Thorp and hamlet have NO grain target** — their rungs are withdrawn and a roof-count instrument must exist before they can be aimed at, let alone graded; do not fit through them, and do not use the retired `5.7 × population^0.27` curve to invent them. This is still the single change that would move the most delta rows, because grain drives the tier read, the district read, the street-hierarchy read and the density read simultaneously. **[M]** the current shortfall against each band's median is **×4.8 at village, ×2.2 at town, ×3.5 at city, ×4.7 at metropolis** — worst at village and metropolis, which is exactly where the tier read is hardest to carry. (Published as ×5.0 / ×2.4 / ×3.7 / ×5.4; every ratio shrinks slightly because the re-set windows lowered the corpus medians, and **none of them shrinks enough to change a verdict**.)
2. **THE BLOCK SILHOUETTE + TWO-TIER STROKE (T-07/GAP-D).** Union each block's footprints, stroke the union at weight W, stroke interior shared edges at 0.5 W. One render pass; it converts a scatter of rectangles into urban fabric and unlocks T-06 (courts), T-08 (frontage) and T-17 (district legibility) as side effects.
3. **THE PAINTED CLOSURE (§2.3.3, five mechanics).** Wash mis-registration, within-fill variation, path waver, stroke modulation, paper grain. **[M]** b6 scores **0.00** on the first two, which are the two the eye reads first. This is MF-A1's brief and it is the whole of "LOOK like it, not feel like it."
4. **THE INK HIERARCHY (§2.3.2).** Replace the single `fabric` stroke-width with the eight-weight ladder. **[M]** the corpus never runs fewer than five weights on a leaf; b6 runs one across the majority of its geometry.
5. **THE COUNTRYSIDE (T-24).** Six per-land-use ground primitives at the corpus's parcel scale. b6's field polygons are ~10–30× too large relative to the settlement and carry no land-use texture — and at village and thorp the countryside is 85%+ of the plate, so this is where the low tiers are won or lost.

---

## §2.7 · GAP REGISTER — FOR THE CHAIR TO RULE

Proposals only. Each is a mechanism sketch, not a decision.

| Gap | What is uncovered | Sketch | Cost read |
|---|---|---|---|
| **GAP-A** | §5's building-count bands are ~10× below the corpus's measured grain | replace counts with `cells_across = f(population)`; parcel count falls out | derivation + a §42/§43 home; touches the tier table |
| **GAP-B** | no law names the density GRADIENT as a morphology discriminator | `radialDensityFalloff` statistic + per-morphology bands + a census | cheap; catches a failure no census sees |
| **GAP-C** | no target band for street width CLASSES | 4–5 classes at ratios ~1:1.6:2.6:4.2:6.5; class count falls with disorder | fits inside the existing street derivation |
| **GAP-D** | party-wall abutment has no rendering rule (block silhouette + two-tier stroke) | `blockSilhouette` union pass | one render pass; highest visual leverage in the study |
| **GAP-E** | threat-directed partial defences (barricade on one bearing) | `partialDefenceArc` from the hazard's own marker slot | small; sub-town tiers gain a real state expression |
| **GAP-F** | pollution's downstream consequence mark | `dischargePlume` along the flow vector, cited to the institution | small; one rationed accent |
| **GAP-G** | prominence responding to STATE, not only rank (hf57's granary) | one banded rung shift for relief-function categories under an active stressor | small |
| **GAP-H** | no law requires districts to be legible WITHOUT labels | `districtLegibility` census: label-free render, assert neighbour deltas in parcel-area median and roof-tone median | this is the acceptance test §8.4's glance layer needs |
| **GAP-I** | chrome complexity is not tied to tier | one `chromeRung` from tier×prosperity drives cartouche, compass, scale bar | trivial; visible in the margins |
| **SCOPE-1** | §18.5's burgage plot-series module is deferred post-launch | **recommend UN-DEFERRING** — it is the most-repeated structure in the corpus (13 of 49 plates) and the source of the frontage continuity b6 most lacks | chair's call |

---

## §2.8 · HOW THIS DOCUMENT IS USED

This atlas is the **standing absolute-bar grading sheet from wave eight onward** (§207.2). The intended use:

1. Every exemplar self-judgment cites the target numbers in §2.2 and Tables A/B, and states the **absolute distance**, never "improved" (§8.3b).
2. The measurement scripts are re-runnable against any render directory. Re-running `MFS1-grain2.py`, `MFS1-aesthetic.py` and `MFS1-streets.py` on a new wave's output produces the same columns and makes the delta table self-updating.
3. **Windows in `MFS1-grain2.py` are hand-set and are the analyst's eye-bounds of the fabric.** A later lane re-running them on new geometry must re-set the windows to the new settlement bounds or the numbers are meaningless. This is stated so nobody inherits a stale window (the hand-keyed-address rot class). ⚠ **§244-FOLD — this warning was not heeded and it cost two rungs of T-01: hf10's window sat east of its own building cluster and became the thorp anchor. Re-set the window and LOOK at it on a decile grid before spending the number.**
4. Nothing here is a pin. Every number is a target for the chair to convert into a pin, a band, or a rejection.

### ⭐ §2.8.1 · §244-FOLD — FOUR THINGS A LATER LANE MUST INHERIT

5. ⭐ **BANDS RE-PIN TO THE STRONGEST MEASURED COHORT, NEVER TO THE CORPUS MEDIAN (§244.4).** The cohort is **HF-1-era ∪ the measured top decile on the register index (n=71)**, and §2.3.0 states it computably. **This governs every future re-derivation, not just this one.** The corpus grew paler round by round; a median re-derivation ratifies our own drift and makes the north star chase the generator that drew it. **Sign check for anyone re-deriving:** done correctly, paper grain, wash σ and tone IQR move **UP** against what MF-S1 published; if your re-derivation moves them down, you pinned to the median.
6. ⛔ **T-01's THORP AND HAMLET RUNGS ARE WITHDRAWN AND MAY NOT BE GRADED (§244.5).** Not widened — **withdrawn**, because `cells_across` is invalid at those tiers: it counts dark runs, and at thorp scale the bounding box is mostly hedges, tofts, furlong furrows and orchard rows. `hf90`, a **twelve-roof** thorp, returns **99.6 "cells across"**. **What restores them: a ROOF-COUNT instrument** (footprint detection, or an eye count — these plates carry 6–24 roofs, so an eye count is exact). Until then those two rungs have no target, the `5.7 × population^0.27` fit that ran through them is withdrawn, and **any grading verdict already issued against them is withdrawn with them** (§2.5's b8 table).
7. ⚠ **INSTRUMENT PROVENANCE — know which ruler produced each number before you compare to it.** Five instruments, all canonical in `map-corpus/docs/`:
   - `MFS1-measure.py` — texture-density blocks, palette clusters, colour-family shares. Reproduces `MFS1-metrics.json` exactly on MF-S1's own 1500 px preview set. **HF-M1 fed it lossless PNG instead** (uniform across all 313, JPEG no longer a variable); deviation over the 49 overlapping plates: paper/ink hex ≤ **2/255** per channel, chroma ≤ **0.3**, built/dense shares ≤ 0.027. ⛔ **`center_edge_ratio` is the one noisy field — median 7% deviation, max 44%. DO NOT BAND THAT NUMBER at this precision** (T-03 rests on it).
   - `MFS1-aesthetic.py` — grain σ, wash σ, tone IQR, stroke percentiles. **Reproduces all 12 archived rows EXACTLY, every field** [CONFIRMED independently by MF-S2: 0 mismatches over 7 fields × 12 plates]. MF-S1 ran it on **12 plates only**; §0 names them, and §0 also names the four Part-1 figures quoted for plates outside that 12 which do not reproduce.
   - `MFS1-grain2.py` — fabric grain. **Kernel reproduces all 22 archived rows exactly**; only the *windows* moved. Hand-set windows, see item 3.
   - `MFS1-streets.py` — street widths. ⚠ **NOT re-run at scale, deliberately**: it depends on the same hand-set cell pitch as grain, so it inherits T-01's validity problem at low tier. **T-04's numbers are therefore unrefreshed and unverified at thorp/hamlet.**
   - ⭐ `HFM1-palette.py` — **THE RECOVERED PAPER/INK INSTRUMENT.** §2.3.1's paper and ink figures and its L-percentile line were produced by **no surviving script**; HF-M1 reimplemented the stated definition on MF-S1's own image basis (the 640 px-wide, 3%-inset bilinear downsample `MFS1-measure.analyze()` builds) and calibrated it against the **49 published paper/ink pairs**: ink hex within **3/255** median max-channel deviation (p90 6, max 8), L percentiles **57/123/201/230/236** against the atlas's stated 57/125/202/231/240. ⚠ **It is a recovery, not the original** — and it exposed the paper border-inset defect (§0) that the original hid.
8. ⭐ **A GRADING COHORT MUST BE MEASURED AGAINST THE SAME INSTRUMENT AS ITS PREDECESSORS BEFORE ITS GRADES ARE SPENT (§244.2).** Stars, "best in corpus" calls and register-edge judgments are **annotations** until that has happened. HF-4c's ★★★ grades are annotations by ruling and **no calibration figure may derive from them**. See §2.3.0 LAW 2 and §2.9's reversal table for what happens when the law is skipped: nine "best in corpus" claims and three register-edge calls, all struck, all in one round.
9. ⚠ **CANONICAL PATHS (§243).** Everything this document cites lives under **`settlement-engine/map-corpus/`** — `plates/` (313), `previews/` (313), `docs/` (this atlas, `laneHF-CALIBRATION.md`, the round receipts, `laneHFM1-receipt.md`, `laneHFM1-corpus-measured.csv`, the band/holdout JSON, and every instrument above). **The session scratchpad `map-refs/` is a MIRROR that may vanish; a lane that reads it is reading a copy nothing may depend on.** Cite `map-corpus/` paths only.

**MF-S1 ended here. §244-FOLD by lane MF-S2 (2026-08-17) added the corrections marked `§244-FOLD` throughout, §2.1a, §2.3.0, §2.8.1 and §2.9. MF-S2 was read-only outside `map-corpus/docs/`: no git writes, no memory writes.**

---

## §2.9 · THE §244 CORRECTION FOLD — LANE MF-S2, 2026-08-17

**Why this section exists.** This atlas is the map program's standing grading sheet. The HF-M1
measurement pass (`map-corpus/docs/laneHFM1-receipt.md`) measured all 313 plates on these
instruments and refuted several figures published above; ODQ §244 ruled on them and dispatched
MF-S2 to fold the rulings in. **A grading sheet that carries a refuted band grades every future
wave against a lie — that is the address-rot class applied to numbers.** This section is the audit
trail: what changed, what it changed from, and the source of every replacement figure.

**Discipline.** Every figure written into this document by MF-S2 was recomputed from
`laneHFM1-corpus-measured.csv` (313 × 47), `HFM1-grain2.json` (57 windows),
`laneHFM1-holdout-proposal.json`, or quoted from `laneHFM1-receipt.md` with its own basis named.
**No number was carried forward unverified.** MF-S2's working script is
`map-corpus/docs/MFS2-bands.py`; its receipt is `laneMFS2-receipt.md`.

## §2.9.1 · THE CHANGE LEDGER

| § | was | is now | source |
|---|---|---|---|
| §0 method | scripts "all in scratchpad" | canonical `map-corpus/docs/` (§243) | ODQ §243 |
| §0 method | *(no sample note)* | the aesthetic instrument ran on **12 plates**, named; all Part-1 superlatives scoped | `MFS1-aes-refs.json` |
| §0 method | *(no instrument note)* | paper/ink instrument **recovered**, not inherited; paper was **not border-inset** while ink was | HF-M1 §1 |
| §0 method | *(no note)* | 4 Part-1 aesthetic figures outside the 12 **do not reproduce** (hf17, hf57, hf51, hf70) | CSV vs atlas, MF-S2 |
| hf10 (b) | `cells_across 10.1`, "ten buildings wide" | ⛔ **WITHDRAWN** — window sat east of the cluster; re-set = 20.8; neither is a building count | `HFM1-grain2.json` |
| hf10 (j) | "flattest palette in the corpus … 70 L of range" | restated on ink L: **66.0 → UNDER-INKED** | CSV |
| hf10 (k) | "darkest 0.5% is only **L109** … *lightest ink in the corpus*" | ⛔ **ERROR** — `#513F34` is **L67**; measured **66.0**; the superlative belongs to hf60 (87.6) | CSV + arithmetic |
| hf24 (k) | "narrowest value range of any town plate" | ⚠ **REFUTED** (hf57 = 78 < hf24 = 82); verdict restated and SURVIVES on **ink L 76.3** | CSV |
| hf34 (k) | "fill_tone_IQR 51.7 — the widest measured" | ⚠ **REFUTED** by this atlas's own band (hf56 = 100.1 in the same 12); 24th of 312 | CSV |
| hf5 (k) | "chroma 18.0 — the lowest in the corpus" | ⚠ **REFUTED** (hf278 12.4, hf300 16.0); still the band **floor** | CSV |
| hf50 (k) | "chroma 66.6 (2nd highest)"; "wash 4.44 highest in corpus, tied with hf20" | ⚠ **3rd**; hf20 is 4.41 (**not tied**); hf387 = 4.56 over 313 | CSV |
| hf50 (k) | *(no note)* | ⛔ **the north star measures palette-8 range 78, identical to the famine plate** — the arithmetic that retires the value-range band | HF-M1 §4.3 |
| hf57 (b) | "ink share the lowest of any town plate" | ⛔ **REFUTED — ink L 37.9 is FULL INK.** The plate is the **counter-example** to banned prior #8, not an instance | CSV |
| hf57 (k) | `paper_grain_σ 2.18, wash σ 1.22` | ⚠ **do not reproduce** — measured **1.39 / 1.85** | CSV |
| hf60 (k) | "lightest ink in the corpus"; "value range 155–238 (the narrowest)" | ✅ **lightest ink CONFIRMED at corpus scope (87.6 of 313)**; ⚠ "narrowest" **REFUTED** | CSV |
| §2.1 table | `cells_across` column | ⛔ **SUPERSEDED** — see §2.1a | HF-M1 §4.4 |
| §2.1 headline | walk `10 → 22 → 48 → 60 → 74 → 113`, ×1.25–1.5 | **46 → 57 → 69 → 98**, ×1.24 · ×1.21 · ×1.41; both ends withdrawn | `HFM1-grain2.json` |
| §2.1 ★ note | "the hamlet rung is INTERPOLATED" | ⛔ superseded — the rung is **withdrawn**, not merely unmeasured | §244.5 |
| **T-01** | thorp **8–14** | ⛔ **WITHDRAWN** — instrument invalid at tier | §244.5 |
| **T-01** | hamlet **18–26** | ⛔ **WITHDRAWN** — never measured, unmeasurable by this instrument | §244.5 |
| **T-01** | village **30–50** | ✅ **UNCHANGED** (n=5 → 9; 6/9 in band; median 48.0 → 45.9) | `HFM1-grain2.json` |
| **T-01** | town **45–80** | ✅ **UNCHANGED** (n=8 → 12; 10/12; 61.3 → 57.0) | `HFM1-grain2.json` |
| **T-01** | city **60–95** | ✅ **UNCHANGED** (n=5 → 9; 7/9; 74.2 → 69.0) | `HFM1-grain2.json` |
| **T-01** | metropolis **100–130** | ⚠ **RE-PINNED 80–120** (n=1 → 9; only 4/9 fell in the old band) | §244.5 |
| **T-01** | `cells_across ≈ 5.7 × pop^0.27`, R² 0.80 | ⛔ **WITHDRAWN** — fitted over 11 plates including hf10 | §244.5 |
| T-01 | "no band may overlap the next by >~30%" | ⚠ **violated by the atlas's own bands** (town/city 57%); IQR alternative offered, **not adopted** | MF-S2 |
| T-02 | city ≥1.2× town; metropolis ≥1.4× city | ✅ **CONFIRMED at ×1.21 / ×1.41** on n=9/12/9 | `HFM1-grain2.json` |
| §2.3.0 | *(new)* | the **strongest-cohort pinning rule** + the **grading-cohort law** | §244.4, §244.2 |
| §2.3.1 paper | `#F7E1C8–#FEF9ED`, centroid `#FBEBD6` | centroid **`#FAEBD8`** (L 237.3, warmth 34), band L 226–244 / warmth 20–50; **top-of-band withdrawn as a border artefact**; centroid otherwise UNCHANGED | CSV, strongest cohort |
| §2.3.1 ink | centroid `#331F16` | **`#2E201A`** (L 34.3 vs published 36.0 — **UNCHANGED**); ink L p5–p95 **16.5–66.4** | CSV, strongest cohort |
| §2.3.1 ink | "plates whose ink lands above **L≈100**" | ⛔ **ERROR** — the three named plates measure 66.0 / 76.3 / 87.6; **no plate in 313 exceeds 100**; the intended threshold is **62** | CSV |
| §2.3.1 value | L1/L10/L50/L90/L99 = 57/125/202/231/240 | **52 / 115 / 202 / 231 / 237** (strongest cohort); L99 gap is instrument recovery, not drift | CSV |
| §2.3.1 value | **value range 150–190 strong, <120 washed out** | ⛔ **BAND RETIRED** — self-contradicting; **INK L replaces it** (≤45 / 45–62 / >62) | §244.4 |
| §2.3.1 chroma | 18 – **44** – 70 | **18 – 43.3 – 70** — ✅ **UNCHANGED** (the corpus-median re-derivation would have said 36.2) | CSV, strongest cohort |
| §2.3.1 role table | Paper `#F7E1C8–#FEF9ED (L 222–244)`; Ink centroid `#331F16` | re-pinned to `#FAEBD8` / L 226–244 / warmth 20–50 and `#2E201A`, plus the ink-L gate — **the role table is what a renderer actually reads, so it had to carry the corrected values too** | CSV, strongest cohort |
| §2.3.2 stroke | p25/p50/p75/p90 = 4.5/7/10/17 | **4/6/10/17** — ✅ **UNCHANGED** | CSV |
| §2.3.2 ratio | 2.8 – **3.55** – 5.7 | **3.1 – 4.33 – 7.2** — ⚠ MOVED **UP**, a sample-size correction (n=12 → 71) | CSV |
| §2.3.3 #5 wash | 1.22 – **3.1** – 4.44 | **1.83 – 3.29 – 4.39** — ⚠ MOVED **UP** | CSV, strongest cohort |
| §2.3.3 #6 grain | 1.20 – **1.8** – 3.18 | **1.30 – 2.05 – 2.96** — ⚠ MOVED **UP** | CSV, strongest cohort |
| §2.3.3 #7 IQR | 6.1 – **18** – 100.1 | **8.0 – 22.0 – 66.5** — ⚠ MOVED **UP**; corpus max is now 153.0 | CSV, strongest cohort |
| §2.4 prior #8 | exemplars hf24 + **hf57** on value range | exemplars **hf24 (76.3)** + **hf10 (66.0)** on ink L; **hf57 REMOVED and recorded as the counter-example** | CSV |
| §2.5 Table A | T-01 rows; "band floor" = measured minimum | re-measured corpus columns; **"band floor" now = the T-01 target floor**; b6 ratios ×4.8 / ×2.2 / ×3.5 / ×4.7 | CSV + `HFM1-grain2.json` |
| §2.5 Table A | *(4 verdicts)* | **⛔ WITHDRAWN added as a fifth grading verdict** | MF-S2, per §244.5 |
| §2.5 Table A | *(no b8 note)* | **b8's thorp/hamlet misses WITHDRAWN; town-48 and city-61 STAND; metropolis-70 still a miss but ×1.14, not ×1.43** | §244.5 |
| §2.5 Table B | value-range row "not assessed" | ⛔ **row retired**; ⭐ **new ink-L row: b6 = 35.0 → MEETS (full ink)** | derived from b6 ink `#2B2118` |
| §2.5 Table B | four hand-band rows | bands re-pinned; **tone-jitter miss widens ×4 → ×5.5**; paper-hue MEETS flagged as a drift risk | CSV |
| §2.6 item 1 | walk `11 → 22 → 40 → 61 → 78 → 115` | **46 → 57 → 69 → 98**; thorp/hamlet have **no target** | `HFM1-grain2.json` |
| §2.8 | 4 usage notes | **+5 notes (§2.8.1)**: pinning rule, withdrawn rungs, instrument provenance ×5, grading-cohort law, canonical paths | §244.4/.5/.2, §243 |

## §2.9.2 · THE ADJUDICATION REVERSALS (§244.3)

None of these plates is cited anywhere in PARTS 1–2 — they postdate this atlas's 49 — so **no text
above required correction**. They are recorded here because this is the document their successors
will grade against, and because the *pattern* is the atlas's own (see §2.9.3).

| adjudication | measured | disposition |
|---|---|---|
| **hf389 supersedes hf103/hf104 as flagship metropolis** | hf389's filename is `grain-max`; it measures **70.2 cells across — the LOWEST of the nine metropolis plates**, 30% below the old T-01 floor and level with the *city* median. hf103 measures **113.9** | ⛔ **REFUTED on its own claim. `hf103` IS RESTORED as the grain / scale flagship.** hf389 is retained as the large-scale **wall-shape** exemplar and its `grain-max` filename is actively misleading. hf389 does win on ink darkness (38.4 vs 60.2) and that is recorded |
| **the nine "best in corpus" claims** (hf386, hf379, hf291, hf360, hf389, hf338, hf348, hf303, hf327, hf356) | top-decile threshold on the register index is **73.8**; corpus median 52.3. **None of the nine is top-decile.** Three sit in the bottom quintile (hf303 21%, hf327 14%, hf356 8%) | ⛔ **STRUCK.** Eight of nine are *content* claims that measurement can neither confirm nor refute — but **none may migrate into "use this as the aesthetic reference"**. hf386 (84%) is the only one safe on both counts |
| **hf289 is the highest chroma in the corpus** | chroma **35.0**, rank **177 of 313**. Actual maximum: hf72 at 69.6 | ⛔ **STRUCK** |
| **hf355 is the darkest non-night plate** | L50 **202.5**, rank **65 of 313** | ⛔ **STRUCK** |
| **hf300 is off-register** | register index **63.2 = 73rd percentile** — better painted than three quarters of the corpus. Its chroma 16.0 *is* below band | ⛔ **STRUCK as filed.** Record it as *"the lowest chroma in the corpus"* — one axis, not the plate |

⭐ **THE LESSON THIS ATLAS MUST CARRY: the eye placed all three register-edge plates at a corpus
extreme and the pixels place none of them there.** That is not a criticism of the eye — it is the
reason §2.8.1's grading-cohort law exists.

## §2.9.3 · THE PART-1 SUPERLATIVE AUDIT — the same failure, at this document's own scope

⚠ **§244.3 struck nine "best in corpus" claims made over 78 plates. PART 1 of this atlas contains
32 "in the corpus" superlatives made over 49 — and the aesthetic ones over 12.** MF-S2 re-tested
the testable ones against all 313. **They are not deleted** (each was true of the sample it was
made from, and several carry mechanics that do not depend on the superlative), **but none may be
cited as a fact about the frozen corpus without checking this table.**

| claim | n=12 | n=49 | **n=313** | verdict |
|---|---|---|---|---|
| hf72 chroma 69.5 highest | — | 1st | **1st** | ✅ **STANDS at corpus scope** |
| hf60 ink L 87.6 — lightest ink | 1st | 1st | **1st** | ✅ **STANDS at corpus scope** |
| hf10 built_share 0.078 lowest (plan view) | — | 1st | **1st** | ✅ **STANDS at corpus scope** |
| hf63 chroma 68.4 — 2nd highest | — | 2nd | **2nd** | ✅ **STANDS** |
| hf23 `cells_across` 79 — finest in the town band | — | — | 1st of 12 town | ✅ **STANDS** |
| hf56 IQR 100.1 "by far the widest measured" | 1st | 1st | 3rd (hf165 153.0) | ⚠ scope-limited |
| hf62 grain 3.18 "the highest measured" | 1st of 11 | 3rd | 3rd (hf30 3.41) | ⚠ **true only of the 12** |
| hf62 ratio 4.0 "second-steepest measured" | 2nd | 24th | 139th | ⚠ **true only of the 12** |
| hf34 built_share 0.736 highest | 1st | 1st | 10th | ⚠ scope-limited |
| hf37 dense_share 0.912 "densest measured" | — | 1st | 3rd | ⚠ scope-limited |
| hf36 green_excess 0.600 "the greenest plate" | — | 1st | 8th | ⚠ scope-limited |
| hf55 stroke p90 "by far the heaviest" | — | 1st | 5th (hf277 51) | ⚠ scope-limited |
| hf5 palette-8 range 185 "widest in the corpus" | — | 1st | 3rd (hf277 220) | ⚠ scope-limited |
| hf32 centre:edge 16.45 "by far the steepest" | — | 1st | 8th | ⚠ scope-limited — **and `center_edge_ratio` is the instrument's noisy field; do not band it** |
| **hf34 IQR 51.7 "the widest measured"** | 2nd | 4th | 24th | ⛔ **REFUTED AT ITS OWN SCOPE** — hf56 is in the same 12 |
| **hf20 wash 4.41 "highest in the whole corpus"** | 2nd | 3rd | 5th | ⛔ **REFUTED AT ITS OWN SCOPE** — hf50 is in the same 12 |
| **hf50 chroma "2nd highest"** | 1st | 3rd | 3rd | ⛔ **REFUTED AT ITS OWN SCOPE** |
| **hf71 chroma 65.3 "3rd highest"** | — | 4th | 4th | ⛔ **REFUTED AT ITS OWN SCOPE** |
| **hf5 blue_excess "the most water-toned"** | — | **2nd** | 7th | ⛔ **REFUTED — and it is swapped with hf31's**, which is called "second-most water" and is **1st of the 49** |
| **hf10 "the lightest ink in the corpus"** | — | 5th | 5th of 49 | ⛔ **REFUTED** — belongs to hf60 (fixed in place) |
| **hf24 "narrowest value range of any town plate"** | — | 2nd | — | ⛔ **REFUTED** (hf57 78 < hf24 82) — fixed in place |
| **hf60 "value range (the narrowest)"** | — | 3rd | — | ⛔ **REFUTED** (hf10 71) — fixed in place |
| **hf51 "widest value range of any city plate"** | — | 3rd | — | ⛔ **REFUTED** (hf40 144 > hf51 133) |
| **hf40 chroma 27.8 "lowest of any colour plate"** | 1st | 2nd | 32nd | ⛔ **REFUTED at corpus scope**; the mechanic it supports (wealth reads without colour) is untouched |
| hf16 palette-8 162 "widest in the village band" | — | 1st of 5 | — | ✅ STANDS within HF-1 |
| hf4 street p97/p50 7.50 "shallowest in the corpus" | — | — | **untested** | ⚠ `MFS1-streets.py` was **not re-run at scale** — T-04's numbers are unrefreshed |

## §2.9.4 · THE BLIND HOLDOUT — RESTATED RULE AND FINAL ROSTER (§244.6)

⚠ **THE OLD EXCLUSION RULE WENT VACUOUS.** HF-4c's rule was *"exclude every plate used to derive a
calibration figure"*. Because MF-S1 measured all 49 HF-1 plates, that rule excluded the entire
strongest cohort **by construction** — and now that HF-M1 has measured all 313, **every plate is a
figure-derivation plate and the rule excludes everything.**

> ⭐ **RESTATED ELIGIBILITY (§244.6, in force).** A plate is excluded from the holdout only if it was
> used to derive a **COUNTER-PHRASE or an A/B result** (prompt-level learning), or if it is a
> **SPECIFICATION SHEET** (symbol dictionary, scale contract), or if it is on the **§6 scrub list**
> (real-world place names or dates in its lettering). **Contributing to an aggregate statistic is no
> longer disqualifying.** Membership is otherwise governed by representativeness.

**Why the nomination had to be fixed.** The 53-plate nomination was clean of scrub / A-B /
specification plates and statistically indistinguishable from the rest on **nine of ten** aesthetic
axes — but it failed on **ERA**: HF-1 **0 of 49**, HF-3 **49% of the set**, HF-4c 5 of 78. The five
rounds differ on the register axes by more than any two categories do (register index 61.5 → 33.9).
**The nomination dropped the strongest-register cohort entirely and kept a fifth of the weakest**;
the marginal distributions passed only because the two exclusions cancelled. **A test set containing
neither tail cannot tell you whether the renderer handles either one.**

**ADOPTED: the 12-swap minimal fix.** n stays 53; all seven KS axes pass after the swap.

| ADD (12) | DROP (12) |
|---|---|
| hf12 · hf31 · hf56 · hf59 · hf61 · hf73 (era: HF-1 0 → 6) · hf334 · hf335 · hf365 (era: HF-4c) · **hf339 · hf384 (lens coverage 0 → 2)** · **hf367 (port coverage 0 → 1)** | hf89 (duplicate subject) · hf126 · hf130 · hf134 · hf136 · hf231 · hf240 (HF-3 over-weight) · hf145 · hf147 (terrain over-weight) · hf195 (underground over-weight) · hf266 · hf285 (HF-4b over-weight) |

**⭐ THE FINAL HOLDOUT ROSTER — 53 plates, 16.9% of the corpus. This list is the holdout.**

```
hf12  hf31  hf56  hf59  hf61  hf73  hf87  hf92  hf94  hf102 hf105 hf122 hf127
hf129 hf132 hf143 hf168 hf172 hf176 hf180 hf183 hf191 hf192 hf200 hf221 hf223
hf230 hf234 hf237 hf259 hf265 hf267 hf269 hf272 hf273 hf275 hf282 hf288 hf289
hf294 hf311 hf312 hf326 hf333 hf334 hf335 hf339 hf346 hf349 hf354 hf365 hf367
hf384
```

**Era balance achieved — 6 / 6 / 17 / 13 / 11** (HF-1 / HF-2 / HF-3 / HF-4b / HF-4c) against corpus
shares of 15.7 / 9.6 / 26.8 / 23.0 / 24.9%. [Verified by MF-S2 against
`laneHFM1-holdout-proposal.json`: nomination = `kept` ∪ `dropped` (53); adopted =
(nomination − drop12) ∪ add12 = `minimal_swap.proposed` — the identity holds exactly.]

⚠ **THREE RESIDUALS THE CHAIR SHOULD SEE.** (1) **`hf12` is an oblique/pictorial thorp** ("grammar
only" per §0) — if the holdout is meant to test a *plan* renderer, substitute `hf88
thorp-crossroads` and accept a marginally worse era fit. (2) `hf56` and `hf61` are HF-1
**vocabulary** plates cited in §2.3 — ineligible under the old rule, **fine under the restated
one**, which is exactly what the restatement is for. (3) **Coverage still reaches zero on four
classes**: `specimen` (28) and `series` (6) are largely the specification class the restated rule
excludes *by design*, but **`trade` (0 of 4) and `institution` (0 of 3) are excluded by no rule and
are genuine gaps** — the holdout cannot currently test a trade route or an institution.

## §2.9.5 · WHAT MF-S2 DID NOT CHANGE, AND WHY

- **All 26 targets except T-01 and T-02, and every urbanism finding.** The measurement pass was a
  *register* pass; it did not touch urbanism. T-03…T-26 stand as written.
- **The twelve banned priors.** All stand. Only prior #8's *exemplars* moved, because they were
  stated on a retired metric.
- **The per-plate paper hexes in PART 1**, though §0 now records that they are not border-inset.
  Correcting 49 hexes from a different lane's instrument would replace a documented caveat with an
  undocumented rewrite.
- **The 17 descriptive "value range A–B" figures still standing in PART 1.** They are sound measurements of the
  palette-8 cluster range; only their *label* and the gate built on them were wrong, and §2.3.1 now
  fixes the label once, bindingly, for all of them.
- **The village / town / city grain bands.** §244.5 ruled them unchanged and the re-measurement
  agrees (6/9, 10/12, 7/9 in band). **MF-S2 did not narrow them to their IQRs even though the IQRs
  would satisfy the atlas's own overlap rider** — that is a chair call, offered in T-01, not taken.
- **T-04's street figures.** `MFS1-streets.py` was deliberately not re-run (it inherits T-01's
  low-tier validity problem). Those numbers are **unrefreshed**, and that is now stated rather than
  silently assumed current.
- **The ★★★ marks in `laneHF-CALIBRATION.md`.** Demoting them to annotations is a ruling about how
  they may be *used*; re-grading the plates is Fable's, not an instrument's.

## §2.9.6 · CONFIRMED / PLAUSIBLE

**CONFIRMED — executed by MF-S2 against the measured data, not inherited:** the strongest cohort is
n=71 (HF-1 49 ∪ top-decile 32, overlap 10) at a top-decile threshold of **73.78** and a corpus
median of **52.30**; every re-pinned band figure in §2.3; the CSV reproduces all 12 archived
aesthetic rows exactly (**0 mismatches, 7 fields × 12 plates**); the corrected grain ladder and its
four-tier walk 45.9 → 57.0 → 69.0 → 97.6 with ratios ×1.24 / ×1.21 / ×1.41; `#513F34` = **L67**
against the published L109; the three plates named "above L≈100" measure 66.0 / 76.3 / 87.6; b6's
ink `#2B2118` = **L35.0**, inside the new full-ink rung; the holdout swap identity and its 6/6/17/13/11
era balance; every ⛔/⚠/✅ verdict in §2.9.3's superlative table.

**PLAUSIBLE — reasoning, not executed:** that the register drift is *caused* by the HF-4c prompt
tail displacing the ink/wash law (HF-M1's own PLAUSIBLE, carried forward unchanged — the correlation
is strong and the model label is constant across rounds, but no A/B was run and none can be now);
and that the IQR bands offered in T-01 would grade better than the published min–max bands — they
satisfy the overlap rider arithmetically, but no leaf has been graded against them.

**[E] and stated as such:** every grain window bound (eye-set, per §2.8.3); HF-M1's category/tier
assignment; the register index's equal weighting of its five axes, which is a choice, not a
measurement.
