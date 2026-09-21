# Creator Kit

The manifest of shareable assets for launch, press, and community: what each asset
is, where it comes from, and how to reproduce it. The organizing law is
**provenance**: every asset here traces to a committed source (a seed, a brand file,
a config value), so nothing in the kit is a fabrication and everything regenerates
the same way twice.

> **What this is not.** This is a manifest, not the assets themselves. It names the
> assets and their sources so they can be produced on demand and stay honest. Binary
> media (screenshots, clips) are produced from these sources and stored outside the
> repo, per the asset table below.

---

## 1. Curated seeds (the flagship asset)

The product's proof is that a seed rebuilds the same world forever. That makes a
**curated seed** the most honest marketing asset there is: anyone can paste it and get
the exact town in the screenshot.

- **What it is.** A short, vetted list of settlement configs (seed + size + culture +
  a note on what makes the result dramatic — a slave-revolt town on shut gates, a
  fortified river town with three claimant factions, a plague-struck temple city).
- **Where it comes from.** The deterministic generator. Same seed, same world (see the
  `same-seed` entry in `src/data/roadmapLedger.js` and the landing proof card).
- **Source of truth.** Curate them into `src/data/sampleSettlements.js` (the existing
  committed showcase set) or a sibling `src/data/*.js`, so the kit's seeds are the same
  ones the app can render. Do not invent seeds for a screenshot that the app cannot
  reproduce.
- **Status.** Seed list to be curated by the owner from real generations. Ships empty
  of hand-faked entries (claims-parity, same law as the honor roll).

## 2. Screenshots

- **What.** The dossier read, the realm map, the chronicle scroll, the treaty table,
  the map/dossier toggle. Each captured from a **curated seed** so the caption can name
  the seed and a reader can reproduce it.
- **Where from.** Captured by hand from the running app against the curated seeds.
- **Stored.** Outside the repo (a design/press folder), not committed as binaries.
- **Honesty rule.** A screenshot shows a real generation. No mocked-up UI, no numbers
  typed over the image. Prices and caps in any overlay come from config
  (`src/config/pricing.js`, `src/config/tierFacts.js`), never typed by hand.

## 3. Timelapse clips (SEAM — produced later)

- **What.** Short films of a world running over time: fronts advancing on the map,
  a boom district rising, a chronicle accumulating. The single most legible way to show
  "the world runs while you are away."
- **Where from.** The advance-time flow, captured frame by frame, then encoded.
- **The seam.** Encoding needs a machine with the video toolchain (`ffmpeg`), which the
  authoring machine does not have (see the ops note on encode legs). So this asset is
  **deliberately deferred**: the capture approach is defined here; the produced clips
  come from a machine that can encode. This is a documented deferral, not a gap.

## 4. Brand marks

- **What.** The wax seal, the plaque (seal + wordmark together), the favicons, the OG
  images.
- **Where from.** All of them are CUTS OF THE OWNER'S ARROW PAINTING as of 2026-09-19
  (ODQ §934.17), made by one script, `scripts/derive-brand-marks.mjs`, from
  `public/brand/arrow/arrow-strip.webp`. Committed brand assets: `public/brand/seal.png`
  (the seal alone, transparent ground), `public/brand/plaque.png` (the lockup),
  `public/favicon.ico` / `favicon-32.png` / `favicon-192.png` / `favicon-512.png`,
  `public/apple-touch-icon.png`, `public/og-default.png` / `public/og-craft.png`, and the
  `HouseDevice` component (`src/components/brand/HouseDevice.jsx`), which now draws
  `seal.png`. The SEAL never carries text (a fixed rule); the plaque is the lockup, where
  the wordmark sits BESIDE the seal in the painting's own brass.
- **Retired 2026-09-19** with the drawn device they rendered: `public/favicon.svg`,
  `public/favicon-dark.png`, `public/og-default.svg`. The geometric house device itself is
  not retired — it is the dossier's vector charter mark
  (`src/pdf/primitives/HouseDeviceSeal.jsx`) and keeps its goldens under
  `docs/samples/organic-craft/logo`.

## 5. Words

- **What.** The positioning one-liners, the identity paragraph, the covenants.
- **Where from.** `docs/VISION_IDEALIZED_FINAL_PRODUCT.md` (the identity and covenants)
  and `docs/VOICE_AND_TONE.md` (the register). Any price or cap in a blurb is quoted
  from config, never typed: single dossier and tier prices from `src/config/pricing.js`,
  the Founder cap from `src/lib/founderSeats.js` (`FOUNDER_SEAT_CAP`).

---

## The public roadmap (the paired R-30 surface)

The kit's forward-looking claims and the public roadmap read from the **same single
source**: `src/data/roadmapLedger.js`. The page at `/roadmap`
(`src/components/howto/RoadmapPage.jsx`) renders exactly that ledger and nothing else,
so the roadmap can never promise a direction the ledger does not carry. When the kit
describes what is coming, it cites the ledger rather than a separate list, so the two
never drift.

## Provenance checklist (before publishing any asset)

- [ ] The asset traces to a committed source named above (a seed, a brand file, a
      config value, a ledger entry).
- [ ] Every price / cap / count in it comes from config, not a typed number.
- [ ] A screenshot or clip is a real generation, reproducible from its seed.
- [ ] Forward-looking claims match a `roadmapLedger.js` entry and its honest status.
- [ ] No fabricated names or numbers anywhere (the claims-parity law).

## See also
- `src/data/roadmapLedger.js` — the single source for the public roadmap + kit's future claims.
- `docs/VISION_IDEALIZED_FINAL_PRODUCT.md` — the identity, covenants, and positioning.
- `docs/VOICE_AND_TONE.md` — the register every word in the kit must match.
