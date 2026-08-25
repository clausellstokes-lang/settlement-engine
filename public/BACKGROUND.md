# Page background paintings

Each top-level page shows its own painted background. The mapping and the
mechanic live in **`src/config/pageBackgrounds.js`**; the legibility overlays
live in **`src/index.css`** (kept in CSS so no raw colors leak into JS and trip
the visual-budget lint).

## Files

Web-optimized JPEGs under **`public/backgrounds/`** (served by Vite at
`/backgrounds/<name>.jpg`). Source paintings were ~3 MB PNGs; these are resized
to ≤1920px wide and ~200–500 KB each.

| view (`App.jsx`) | image                |
|------------------|----------------------|
| `generate` (Create) | `create.jpg`      |
| `settlements`    | `settlements.jpg`    |
| `map` (World Map)| `world-map.jpg`      |
| `compendium`     | `compendium.jpg`     |
| `howto` (About)  | `about.jpg`          |
| `gallery`        | `gallery.jpg`        |
| `pricing`        | `pricing.jpg`        |
| `account`/`admin`| `account.jpg`        |

## The Create-page generation mechanic

On the Create page the three mode cards show a scaled-down settlement scene
(`.mode-card-bg` in `index.css`, image via the `--card-bg` custom property):

| mode     | scene          |
|----------|----------------|
| Basic    | `thorpe.jpg`   |
| Advanced | `village.jpg`  |
| Custom   | `city.jpg`     |

Choosing a mode **blows that scene up** into the full-page background for the
wizard config **and** the resulting dossier output, until the user navigates to
a different top-level page. This is the `is-flow` branch of
`resolveViewBackground()` + the `.page-bg.is-flow` overlay.

## How it's applied

`App.jsx` resolves the current background from the view + generation state and
sets it on the `.page-bg` wrapper via the `--page-bg` CSS custom property. The
cream overlay (`.page-bg`, `.page-bg.is-flow`, `.mode-card-bg`) keeps text
legible over any painting — **tune those opacities in `src/index.css`** if a
page reads too dark or too washed out.

## Replacing an image

Drop a new web-optimized `<name>.jpg` into `public/backgrounds/` at the same
name. Keep them reasonably sized (≤~500 KB) — they load as full-screen
backgrounds. If a file is missing, the page degrades to flat parchment cream
(`#f7f0e4`, the `background-color` fallback on `.page-bg`).

> Legacy: `public/parchment-bg.jpg` was the old single global background. It is
> no longer referenced (the body is now flat cream and each view paints its own
> background) and can be removed.
