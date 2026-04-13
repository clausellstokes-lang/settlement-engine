/**
 * Settlement Engine ↔ Azgaar FMG Bridge
 *
 * Inject this script into your Azgaar Fantasy Map Generator fork to enable
 * two-way communication with the Settlement Engine via postMessage.
 *
 * Installation:
 *   1. Fork https://github.com/Azgaar/Fantasy-Map-Generator
 *   2. Add <script src="fmg-bridge.js"></script> before </body> in index.html
 *   3. Deploy the fork (Vercel, Netlify, or any static host)
 *   4. Set VITE_FMG_URL in your Settlement Engine .env to the fork's URL
 *
 * Protocol:
 *   FMG → Parent:
 *     { type: 'fmg:ready' }
 *     { type: 'fmg:seed', seed }
 *     { type: 'fmg:burgSelected', burg }
 *     { type: 'fmg:burgList', burgs }
 *
 *   Parent → FMG:
 *     { type: 'settlementEngine:highlightBurgs', burgIds }
 *     { type: 'settlementEngine:setOverlay', chain, nodes, edges, status }
 *     { type: 'settlementEngine:clearOverlays' }
 */

(function settlementEngineBridge() {
  'use strict';

  // Only run when embedded in an iframe
  if (window === window.top) return;

  const PARENT = window.parent;
  const post = (msg) => PARENT.postMessage(msg, '*');

  // ── Wait for FMG to finish loading ──────────────────────────────────────────
  // Azgaar's FMG sets `window.pack` once the map is generated.
  // We poll for it rather than relying on a specific event.

  let readySent = false;

  function checkReady() {
    if (readySent) return;
    // `pack` is Azgaar's main data object — its presence means the map is loaded
    if (typeof pack !== 'undefined' && pack.cells) {
      readySent = true;
      post({ type: 'fmg:ready' });
      sendSeed();
      sendBurgList();
      hookBurgClicks();
    } else {
      setTimeout(checkReady, 500);
    }
  }

  // ── Send map seed ───────────────────────────────────────────────────────────
  function sendSeed() {
    try {
      const seed = typeof mapSeed !== 'undefined' ? mapSeed : (seed || null);
      post({ type: 'fmg:seed', seed });
    } catch (e) {
      console.warn('[SE Bridge] Could not read map seed:', e);
    }
  }

  // ── Send all burgs ──────────────────────────────────────────────────────────
  function sendBurgList() {
    try {
      const burgs = pack.burgs
        .filter(b => b.i && !b.removed) // skip index 0 placeholder and removed burgs
        .map(b => ({
          id:           b.i,
          name:         b.name,
          x:            b.x,
          y:            b.y,
          population:   b.population * 1000, // Azgaar stores pop in thousands
          port:         !!b.port,
          capital:      !!b.capital,
          citadel:      !!b.citadel,
          walls:        !!b.walls,
          state:        b.state,
          stateName:    pack.states[b.state]?.name || '',
          culture:      b.culture,
          cultureName:  pack.cultures[b.culture]?.name || '',
          cell:         b.cell,
          feature:      b.feature,
        }));
      post({ type: 'fmg:burgList', burgs });
    } catch (e) {
      console.warn('[SE Bridge] Could not read burg list:', e);
    }
  }

  // ── Hook burg click events ──────────────────────────────────────────────────
  function hookBurgClicks() {
    // Azgaar's FMG uses SVG — listen for clicks on burg labels and icons
    const svg = document.getElementById('viewbox');
    if (!svg) return;

    svg.addEventListener('click', (e) => {
      const burgEl = e.target.closest('[data-id]');
      if (!burgEl) return;

      // Check if it's a burg element (labels group or icons group)
      const group = burgEl.closest('#burgLabels, #burgIcons, #burgIcons-anchors');
      if (!group) return;

      const burgId = parseInt(burgEl.dataset.id, 10);
      if (isNaN(burgId) || burgId === 0) return;

      const b = pack.burgs[burgId];
      if (!b || b.removed) return;

      post({
        type: 'fmg:burgSelected',
        burg: {
          id:           b.i,
          name:         b.name,
          x:            b.x,
          y:            b.y,
          population:   b.population * 1000,
          port:         !!b.port,
          capital:      !!b.capital,
          citadel:      !!b.citadel,
          walls:        !!b.walls,
          state:        b.state,
          stateName:    pack.states[b.state]?.name || '',
          culture:      b.culture,
          cultureName:  pack.cultures[b.culture]?.name || '',
          cell:         b.cell,
          feature:      b.feature,
        },
      });
    });
  }

  // ── Handle commands from Settlement Engine ──────────────────────────────────
  const overlayGroup = (() => {
    const svg = document.getElementById('viewbox');
    if (!svg) return null;
    let g = document.getElementById('settlementEngineOverlays');
    if (!g) {
      g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = 'settlementEngineOverlays';
      g.setAttribute('class', 'se-overlays');
      svg.appendChild(g);
    }
    return g;
  })();

  function clearOverlays() {
    if (overlayGroup) overlayGroup.innerHTML = '';
  }

  function highlightBurgs(burgIds) {
    if (!overlayGroup || !burgIds?.length) return;
    burgIds.forEach(id => {
      const b = pack.burgs[id];
      if (!b || b.removed) return;
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', b.x);
      circle.setAttribute('cy', b.y);
      circle.setAttribute('r', 8);
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', '#d4a017');
      circle.setAttribute('stroke-width', '2');
      circle.setAttribute('class', 'se-highlight');
      circle.style.animation = 'se-pulse 1.5s ease-in-out infinite';
      overlayGroup.appendChild(circle);
    });
  }

  function setOverlay(chain, nodes, edges) {
    if (!overlayGroup) return;

    const CHAIN_COLORS = {
      iron:    '#8b4513',
      grain:   '#daa520',
      timber:  '#228b22',
      textile: '#8a2be2',
      stone:   '#708090',
      luxury:  '#ff1493',
    };
    const color = CHAIN_COLORS[chain] || '#d4a017';

    // Draw edges as lines between burgs
    (edges || []).forEach(({ from, to }) => {
      const bFrom = pack.burgs[from];
      const bTo   = pack.burgs[to];
      if (!bFrom || !bTo) return;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', bFrom.x);
      line.setAttribute('y1', bFrom.y);
      line.setAttribute('x2', bTo.x);
      line.setAttribute('y2', bTo.y);
      line.setAttribute('stroke', color);
      line.setAttribute('stroke-width', '2');
      line.setAttribute('stroke-dasharray', '6,3');
      line.setAttribute('opacity', '0.7');
      line.setAttribute('class', `se-chain se-chain-${chain}`);
      overlayGroup.appendChild(line);
    });

    // Draw nodes as markers on burgs
    (nodes || []).forEach(({ burgId, role }) => {
      const b = pack.burgs[burgId];
      if (!b) return;

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', b.x);
      circle.setAttribute('cy', b.y);
      circle.setAttribute('r', role === 'producer' ? 6 : 5);
      circle.setAttribute('fill', role === 'producer' ? color : 'none');
      circle.setAttribute('stroke', color);
      circle.setAttribute('stroke-width', role === 'producer' ? '1' : '2');
      circle.setAttribute('class', `se-chain-node se-chain-${chain}`);
      overlayGroup.appendChild(circle);
    });
  }

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;

    switch (data.type) {
      case 'settlementEngine:highlightBurgs':
        highlightBurgs(data.burgIds);
        break;
      case 'settlementEngine:setOverlay':
        setOverlay(data.chain, data.nodes, data.edges);
        break;
      case 'settlementEngine:clearOverlays':
        clearOverlays();
        break;
    }
  });

  // ── CSS for overlay animations ──────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes se-pulse {
      0%, 100% { opacity: 1; r: 8; }
      50%      { opacity: 0.4; r: 12; }
    }
    .se-overlays { pointer-events: none; }
  `;
  document.head.appendChild(style);

  // ── Start ───────────────────────────────────────────────────────────────────
  if (document.readyState === 'complete') {
    checkReady();
  } else {
    window.addEventListener('load', checkReady);
  }

  console.log('[Settlement Engine Bridge] Loaded — waiting for map generation...');
})();
