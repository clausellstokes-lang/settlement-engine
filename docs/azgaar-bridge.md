# Azgaar FMG Bridge — Setup Guide

## Overview

The SettlementForge integrates with [Azgaar's Fantasy Map Generator](https://github.com/Azgaar/Fantasy-Map-Generator) via an iframe + postMessage bridge. The map provides geography (terrain, rivers, borders, cultures); your settlements provide depth (institutions, factions, NPCs, supply chains).

## Setup Steps

### 1. Fork the FMG repository

```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Fantasy-Map-Generator.git
cd Fantasy-Map-Generator
```

### 2. Add the bridge script

Copy `docs/fmg-bridge.js` from this repository into the FMG root directory.

Then add it to `index.html` before the closing `</body>` tag:

```html
<script src="fmg-bridge.js"></script>
</body>
```

### 3. Allow iframe embedding

By default, FMG may set `X-Frame-Options` headers that prevent iframe embedding. If you're deploying to a static host (Vercel, Netlify), add response headers:

**Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "ALLOWALL" },
        { "key": "Content-Security-Policy", "value": "frame-ancestors *" }
      ]
    }
  ]
}
```

**Netlify** (`_headers`):
```
/*
  X-Frame-Options: ALLOWALL
  Content-Security-Policy: frame-ancestors *
```

### 4. Deploy

Deploy your fork to any static hosting:

```bash
# Vercel
npx vercel --prod

# Netlify
npx netlify deploy --prod --dir .

# Or any static host — it's just HTML/JS/CSS
```

### 5. Configure the SettlementForge

Set the `VITE_FMG_URL` environment variable to your deployed fork's URL:

```env
VITE_FMG_URL=https://your-fmg-fork.vercel.app
```

Restart the dev server (`npm run dev`) or rebuild (`npm run build`).

## How It Works

### Messages: FMG → SettlementForge

| Message Type | Payload | When |
|---|---|---|
| `fmg:ready` | — | Map finished loading |
| `fmg:seed` | `{ seed }` | After ready, sends map seed |
| `fmg:burgList` | `{ burgs: [...] }` | After ready, sends all burgs |
| `fmg:burgSelected` | `{ burg: {...} }` | User clicks a burg on the map |

**Burg object shape:**
```js
{
  id: 42,
  name: "Thornwall",
  x: 1234.5,
  y: 678.9,
  population: 3200,    // already multiplied by 1000
  port: false,
  capital: true,
  citadel: true,
  walls: true,
  state: 3,
  stateName: "Kingdom of Arden",
  culture: 2,
  cultureName: "Norse",
  cell: 8901,
  feature: 1
}
```

### Messages: SettlementForge → FMG

| Message Type | Payload | Effect |
|---|---|---|
| `settlementEngine:highlightBurgs` | `{ burgIds: [1,5,12] }` | Gold pulsing rings on specified burgs |
| `settlementEngine:setOverlay` | `{ chain, nodes, edges }` | Supply chain lines + markers |
| `settlementEngine:clearOverlays` | — | Remove all overlays |

### Supply Chain Overlay

Each chain has a colour:
- **iron** → brown `#8b4513`
- **grain** → gold `#daa520`
- **timber** → green `#228b22`
- **textile** → purple `#8a2be2`
- **stone** → slate `#708090`
- **luxury** → pink `#ff1493`

Nodes are circles (filled = producer, outline = consumer). Edges are dashed lines.

## Troubleshooting

**Map doesn't load:** Check browser console for CORS or CSP errors. Ensure iframe headers allow embedding.

**No burgs appear:** The bridge waits for `pack.cells` to exist. If FMG loads but no burg list is sent, the bridge may not detect the load. Check the console for `[SettlementForge Bridge]` messages.

**Clicks don't register:** The bridge listens for clicks on `#burgLabels` and `#burgIcons` SVG groups. If Azgaar changes these IDs in a future version, the selectors in `fmg-bridge.js` will need updating.
