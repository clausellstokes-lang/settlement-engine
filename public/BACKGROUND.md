# Page background image

The site uses a parchment-painting background wired in `src/index.css`.

**Expected file**: `public/parchment-bg.jpg`

The CSS references `/parchment-bg.jpg` at the public root. Vite serves
everything under `public/` directly, so the image is fetched at that
exact URL.

**If the file is missing**, the page degrades gracefully to a flat
cream colour (`#f7f0e4`) — same parchment tone the rest of the UI
uses. No layout shifts, no broken images visible to users.

**Replacement**: drop a new image at the same path. JPG keeps the
bundle small; PNG is also fine if you need transparency. The
existing wiring layers a 78%-opacity cream gradient on top so body
text stays legible regardless of how dark the painting is.

**Performance**: the image is loaded once by the browser and
cached. `background-attachment: fixed` means the painting stays
stationary while content scrolls — feels like the canvas the UI
sits on.

**Local testing**: `npm run dev` then open the dev URL. The
background should be the painting tinted toward cream. If you see
flat cream, the image isn't where it should be.
