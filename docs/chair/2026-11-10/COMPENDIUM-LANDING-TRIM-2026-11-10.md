# COMPENDIUM-LANDING-TRIM — the landing's intro block removed, 2026-11-10

Seat COMPENDIUM-HUB, branch `lane/compendium-landing-trim-2026-11-10` cut from the closed phase-1 tip 445390e90.
The cause commit is be677cfdc.

**The owner's words (verbatim):** "remove the everything here is rednedered by the deteremistic.... all the way to the sample world cnocby..."

**Old → gone:** "Everything here is rendered by the deterministic engine from its own registries, the same code
that builds your worlds. It cannot drift from what the simulator actually does." and "The sample world is
Cnocby (seed lf-033)." These were `CompendiumIntro` on the landing, the only place the block printed. Nothing
is written in their place. Not touched: `CD.meta.demoWorld` and its examples. Also not touched: the SEO
description in `src/lib/seoCompendium.js`, a sentence of the same family that is not on the page and that the
owner did not point at.

**Pins, re-keyed BY IDENTITY to anchored negatives:**
- `compendiumPanel.smoke`: the two `getByText` pins became `assertLandingTrimmed`, which checks the grid
  renders and that neither sentence nor the sample-world line is present, anchored on "Tiers & Routes".
- `compendiumHubs`: the demo-world pin became an anchored negative, anchored on the operations count.

**Seen (1440x900, iPhone 13):** the tiles sit directly under the search, with no empty band. The first row ends
at 442 px on desktop (was 528) and at 388 px on the phone (was 517). No horizontal scroll at either width.
