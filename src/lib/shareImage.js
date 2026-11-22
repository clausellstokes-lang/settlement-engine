/**
 * shareImage.js — client-side "export this dossier as an image" lane.
 *
 * Rasterizes a compact settlement summary card to a PNG entirely in the browser
 * so a game master can drop the image straight into Discord / a forum post. It
 * is the growth loop's other half: the OG edge function renders the card for a
 * SHARED gallery link; this renders one for a settlement the user is holding,
 * whether or not it is public. NOT premium-gated — sharing is how the tool
 * spreads (only the Foundry is premium, per owner directive).
 *
 * Implementation is hand-rolled SVG → canvas, no html-to-image / dom-to-image
 * dependency (none are in package.json, and the F41 worker precedent says do not
 * add a heavy rasterizer for a once-per-click artifact). We build a small,
 * self-contained SVG (no external refs, so the canvas never taints), draw it
 * into a 2x canvas, and read a PNG blob back out.
 *
 * Fonts: an SVG loaded through an <img> renders in an isolated context that does
 * NOT see the page's @font-face web fonts, so the card uses robust system stacks
 * (Georgia serif for the name, system-ui sans for the rest) — the same posture
 * the static og-default card takes. Deterministic, with no font-loading race.
 *
 * Seed-secret doctrine: the card is built from a COARSE summary — name, tier,
 * terrain, population, and a couple of enum stats. It never reads the PRNG seed,
 * DM notes, or any raw settlement blob. buildShareCardSvg draws only the keys it
 * is handed and XML-escapes them.
 */

import { resolveSettlementTerrain } from '../domain/resolveTerrain.js';

const CARD_W = 1200;
const CARD_H = 630;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function titleCase(s) {
  return String(s || '').replace(/(^|[\s_-])([a-z])/g, (_m, sep, ch) => sep.replace(/_/g, ' ') + ch.toUpperCase());
}

function fitName(name) {
  const clean = String(name || '').replace(/\s+/g, ' ').trim();
  return clean.length > 34 ? `${clean.slice(0, 33)}…` : clean;
}

/**
 * Map a settlement (as SettlementDetail holds it) to the coarse share summary.
 * Mirrors gallery.js sanitizeTile's fallback chain so the card matches what the
 * public gallery would show — but reads only coarse, display-safe fields.
 * Terrain goes through THE ONE terrain read (domain/resolveTerrain.js), the same
 * call sanitizeTile makes, so the shared card and the gallery tile can never
 * disagree about the same settlement (R-4 lane P-6).
 * DECLARED DISPLAY SHIFT (measured, vetoable by restoring the old chain on the
 * terrain line): the old chain led with the never-written config.terrain, so this
 * card printed NO terrain for any wizard-generated settlement — the tier/terrain
 * subtitle silently degraded to the tier alone, while the SERVER-rendered OG card
 * for the same settlement (supabase/functions/og-image, which reads the
 * terrainType-first facet column) printed one. The card now matches the OG twin.
 * @param {object} s the settlement object
 * @returns {{name:string,tier:string,terrain:string,population:(number|null),
 *            governmentType:string,magicLevel:string,stability:string}}
 */
export function settlementToShareSummary(s) {
  const d = s || {};
  const ps = d.powerStructure || {};
  const governmentType =
    ps.governmentType ||
    (typeof ps.government === 'string' ? ps.government : ps.government?.type) ||
    ps.governingName ||
    d.government?.type ||
    d.governmentType ||
    '';
  const population = Number(d.population ?? d.demographics?.population);
  return {
    name: d.name || '',
    tier: d.tier || d.config?.tier || '',
    terrain: resolveSettlementTerrain(d) || '',
    population: Number.isFinite(population) && population > 0 ? Math.round(population) : null,
    governmentType,
    magicLevel: d.config?.magicLevel || d.magicLevel || '',
    stability: d.viability?.stability || d.systemState?.stability || d.stability || '',
  };
}

/** Up to three coarse stat chips from the fields that are present. */
function statChips(p) {
  const chips = [];
  if (typeof p.population === 'number' && p.population > 0) {
    chips.push({ label: 'Population', value: p.population.toLocaleString('en-US') });
  }
  if (p.governmentType) chips.push({ label: 'Rule', value: titleCase(p.governmentType) });
  if (p.magicLevel) chips.push({ label: 'Magic', value: titleCase(p.magicLevel) });
  if (chips.length < 3 && p.stability) chips.push({ label: 'Stability', value: titleCase(p.stability) });
  return chips.slice(0, 3);
}

/**
 * Build the 1200x630 share-card SVG from a coarse summary. Pure + XML-safe. Uses
 * system font stacks (see file header) so it rasterizes identically everywhere.
 */
export function buildShareCardSvg(summary) {
  const p = summary || {};
  const name = esc(fitName(p.name) || 'A Settlement');
  const tierTerrain = esc(
    [p.tier ? titleCase(p.tier) : '', p.terrain ? titleCase(p.terrain) : '']
      .filter(Boolean)
      .join('  ·  ') || 'Living settlement',
  );
  const chips = statChips(p);

  const chipW = 330;
  const chipGap = 24;
  const rowW = chips.length * chipW + Math.max(0, chips.length - 1) * chipGap;
  const startX = (CARD_W - rowW) / 2;
  const chipY = 452;
  const chipsSvg = chips
    .map((c, i) => {
      const x = startX + i * (chipW + chipGap);
      return `
    <g>
      <rect x="${x}" y="${chipY}" width="${chipW}" height="96" rx="10" fill="#FFFFFF" stroke="#E2CE9F" stroke-width="1.5"/>
      <text x="${x + chipW / 2}" y="${chipY + 34}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-weight="700" font-size="19" letter-spacing="1.5" fill="#9A7B34">${esc(c.label.toUpperCase())}</text>
      <text x="${x + chipW / 2}" y="${chipY + 70}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-weight="800" font-size="30" fill="#3A2E18">${esc(c.value)}</text>
    </g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}">
  <defs>
    <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2C2210"/>
      <stop offset="1" stop-color="#1B1408"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#D9B566"/>
      <stop offset="1" stop-color="#C9A24C"/>
    </linearGradient>
  </defs>
  <rect width="${CARD_W}" height="${CARD_H}" fill="#FBF5E6"/>
  <rect x="1" y="1" width="${CARD_W - 2}" height="${CARD_H - 2}" fill="none" stroke="#E8D9B0" stroke-width="2"/>
  <rect width="${CARD_W}" height="132" fill="url(#ink)"/>
  <rect y="132" width="${CARD_W}" height="4" fill="url(#gold)"/>
  <text x="60" y="60" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-weight="800" font-size="26" letter-spacing="3" fill="#D9B566">SETTLEMENTFORGE</text>
  <text x="60" y="98" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-weight="600" font-size="20" letter-spacing="2" fill="#C4B48A">A SETTLEMENT DOSSIER</text>
  <text x="${CARD_W / 2}" y="292" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="76" fill="#8C6F32">${name}</text>
  <text x="${CARD_W / 2}" y="352" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-weight="600" font-size="30" fill="#4A3B22">${tierTerrain}</text>${chipsSvg}
  <text x="${CARD_W / 2}" y="600" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', sans-serif" font-weight="600" font-size="22" fill="#6A511F">Forged with SettlementForge  ·  settlementforge.com</text>
</svg>`;
}

/** A filesystem-safe filename stem from the settlement name. */
export function shareCardFilename(name) {
  const stem = String(name || 'settlement')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'settlement';
  return `${stem}-settlementforge.png`;
}

/**
 * Rasterize the share card to a PNG Blob at `scale`x (2x = 2400×1260 for crisp
 * retina + social downscaling). Browser-only. Rejects if the environment has no
 * canvas or the SVG fails to decode.
 * @param {object} summary coarse settlement summary (see settlementToShareSummary)
 * @param {{ scale?: number }} [opts]
 * @returns {Promise<Blob>}
 */
export function renderShareCardPng(summary, opts = {}) {
  const scale = opts.scale || 2;
  const svg = buildShareCardSvg(summary);
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
      reject(new Error('share image requires a browser canvas'));
      return;
    }
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = CARD_W * scale;
        canvas.height = CARD_H * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('canvas 2d context unavailable');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((png) => {
          URL.revokeObjectURL(url);
          if (png) resolve(png);
          else reject(new Error('canvas.toBlob returned null'));
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('share card SVG failed to load'));
    };
    img.src = url;
  });
}

/**
 * Render + trigger a browser download of the share card. Returns the Blob (so a
 * caller could also copy/upload it). Browser-only.
 * @param {object} summary coarse settlement summary
 * @param {{ scale?: number, filename?: string }} [opts]
 * @returns {Promise<Blob>}
 */
export async function downloadShareCard(summary, opts = {}) {
  const png = await renderShareCardPng(summary, opts);
  const filename = opts.filename || shareCardFilename(summary?.name);
  const url = URL.createObjectURL(png);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    // Revoke on the next tick so the click's navigation has taken the URL.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
  return png;
}
