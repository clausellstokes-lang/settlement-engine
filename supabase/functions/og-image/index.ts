/**
 * og-image — dynamic Open Graph card for a shared gallery dossier.
 *
 * When a /gallery/:slug link is posted to Reddit / Discord / Slack / X, the
 * unfurl bot fetches the page's og:image. seo.js points that at THIS endpoint
 * (?slug=…), so each shared settlement gets its OWN preview card — its name,
 * tier, terrain, and a few coarse public stats — rendered as a 1200×630 PNG.
 * The shared artifact becomes the advertisement.
 *
 * ── Seed-secret doctrine (absolute) ──────────────────────────────────────────
 * This endpoint renders ONLY the sanitized public projection. It calls the
 * public, security-definer RPC `get_gallery_dossier` (already the sanitizer the
 * gallery page reads) with the ANON key, and then reads ONLY the coarse
 * top-level columns (name / tier / terrain / population / government_type /
 * magic_level / stability). It NEVER reads `row.data` (the settlement blob), so
 * the PRNG seed, private notes, adventure hooks, and DM secrets can never reach
 * a rendered card. buildCardSvg additionally ignores every field it is not
 * explicitly told to draw and XML-escapes what it does draw. See index.test.ts.
 *
 * ── Trust posture ────────────────────────────────────────────────────────────
 * PUBLIC + anonymous by design: the callers ARE bots (facebookexternalhit,
 * Twitterbot, Discordbot, Slackbot). So — unlike the other anon sinks — it must
 * NOT bot-guard, and it reads no auth. It is a pure read of already-public data;
 * the only write path (view counts) is deliberately NOT touched, so scraping a
 * card never inflates a dossier's stats. Deploy verify_jwt = false (config.toml)
 * — a scraper carries no Supabase JWT and the platform gate would 401 every
 * unfurl.
 *
 * ── Fail-safe ────────────────────────────────────────────────────────────────
 * ANY failure (missing/garbage slug, unknown slug, RPC error, rasterize fault)
 * 302-redirects to the static og-default.png. A scraper always gets a valid
 * card, never a broken image — worst case is the site-default card.
 *
 * The rasterizer + data fetch are injectable `deps` seams so the trust boundary
 * is execution-testable without a live Supabase or the WASM rasterizer.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';

const SITE_ORIGIN = 'https://settlementforge.com';
const OG_DEFAULT_URL = `${SITE_ORIGIN}/og-default.png`;
// Where the rasterizer fetches the display fonts (same TTFs the PDF path ships,
// served from /public/fonts). Overridable for a staging origin.
const ASSET_ORIGIN = Deno.env.get('OG_ASSET_ORIGIN') || SITE_ORIGIN;

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// ── Public projection: the ONLY shape this endpoint ever renders ─────────────
export interface OgProjection {
  name: string;
  tier: string;
  terrain: string;
  population: number | null;
  governmentType: string;
  magicLevel: string;
  stability: string;
}

interface OgDeps {
  fetchProjection?: (slug: string) => Promise<OgProjection | null>;
  rasterize?: (svg: string) => Promise<Uint8Array>;
}

// Slugs are opaque URL-safe ids (migration 008 `_make_public_slug`). Accept only
// a bounded url-safe token — this both blocks junk/injection and caps the RPC arg.
const SLUG_RE = /^[A-Za-z0-9_-]{1,64}$/;
function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

/** Coerce to a trimmed, length-bounded string (never an object/blob). */
function coarseStr(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  return v.slice(0, max).trim();
}

function imageHeaders(): Record<string, string> {
  return {
    'Content-Type': 'image/png',
    // Public image: no credentials, no cookies. '*' is the correct posture for a
    // CDN-style asset that arbitrary unfurl bots fetch cross-origin.
    'Access-Control-Allow-Origin': '*',
    // Cache hard: the card only changes when the dossier's coarse facts change,
    // which is rare. Long browser cache + longer shared/CDN cache. Scrapers and
    // proxies cache the unfurl aggressively regardless.
    'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    'X-Content-Type-Options': 'nosniff',
  };
}

/** 302 to the site-default card. Short cache so a later-published slug recovers. */
function redirectToDefault(): Response {
  return new Response(null, {
    status: 302,
    headers: {
      Location: OG_DEFAULT_URL,
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// ── SVG card (pure; the seed-secret firewall) ────────────────────────────────
// Draws ONLY the coarse public fields, each XML-escaped. Unknown fields on the
// projection object are structurally impossible to render — every value drawn is
// pulled by an explicit key below. No template ever interpolates `row.data`.

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function titleCase(s: string): string {
  return s.replace(/(^|[\s_-])([a-z])/g, (_m, sep, ch) => sep.replace(/_/g, ' ') + ch.toUpperCase());
}

/** Fit a long name onto the card: hard-cap length, ellipsize the overflow. */
function fitName(name: string): string {
  const clean = name.replace(/\s+/g, ' ').trim();
  return clean.length > 34 ? `${clean.slice(0, 33)}…` : clean;
}

/** Build up to three coarse stat chips from the fields that are present. */
function statChips(p: OgProjection): Array<{ label: string; value: string }> {
  const chips: Array<{ label: string; value: string }> = [];
  if (typeof p.population === 'number' && p.population > 0) {
    chips.push({ label: 'Population', value: p.population.toLocaleString('en-US') });
  }
  if (p.governmentType) chips.push({ label: 'Rule', value: titleCase(p.governmentType) });
  if (p.magicLevel) chips.push({ label: 'Magic', value: titleCase(p.magicLevel) });
  if (chips.length < 3 && p.stability) chips.push({ label: 'Stability', value: titleCase(p.stability) });
  return chips.slice(0, 3);
}

export function buildCardSvg(p: OgProjection): string {
  const name = esc(fitName(p.name || 'A Settlement'));
  const tierTerrain = esc(
    [p.tier ? titleCase(p.tier) : '', p.terrain ? titleCase(p.terrain) : '']
      .filter(Boolean)
      .join('  ·  ') || 'Living settlement',
  );
  const chips = statChips(p);

  // Chip band: center a row of up to three fixed-width plates.
  const chipW = 330;
  const chipGap = 24;
  const rowW = chips.length * chipW + (chips.length - 1) * chipGap;
  const startX = (OG_WIDTH - rowW) / 2;
  const chipY = 452;
  const chipsSvg = chips
    .map((c, i) => {
      const x = startX + i * (chipW + chipGap);
      return `
    <g>
      <rect x="${x}" y="${chipY}" width="${chipW}" height="96" rx="10" fill="#FFFFFF" stroke="#E2CE9F" stroke-width="1.5"/>
      <text x="${x + chipW / 2}" y="${chipY + 34}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="700" font-size="19" letter-spacing="1.5" fill="#9A7B34">${esc(c.label.toUpperCase())}</text>
      <text x="${x + chipW / 2}" y="${chipY + 70}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="30" fill="#3A2E18">${esc(c.value)}</text>
    </g>`;
    })
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}" viewBox="0 0 ${OG_WIDTH} ${OG_HEIGHT}" role="img" aria-label="${name} — a settlement on SettlementForge">
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

  <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="#FBF5E6"/>
  <rect x="1" y="1" width="${OG_WIDTH - 2}" height="${OG_HEIGHT - 2}" fill="none" stroke="#E8D9B0" stroke-width="2"/>

  <!-- Ink header band echoing the app chrome -->
  <rect width="${OG_WIDTH}" height="132" fill="url(#ink)"/>
  <rect y="132" width="${OG_WIDTH}" height="4" fill="url(#gold)"/>
  <text x="60" y="60" font-family="Nunito, sans-serif" font-weight="800" font-size="26" letter-spacing="3" fill="#D9B566">SETTLEMENTFORGE</text>
  <text x="60" y="98" font-family="Nunito, sans-serif" font-weight="600" font-size="20" letter-spacing="2" fill="#C4B48A">A SHARED SETTLEMENT</text>

  <!-- Settlement name (serif display) -->
  <text x="${OG_WIDTH / 2}" y="292" text-anchor="middle" font-family="Lora, Georgia, serif" font-weight="700" font-size="76" fill="#8C6F32">${name}</text>
  <!-- Tier · terrain subtitle -->
  <text x="${OG_WIDTH / 2}" y="352" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="600" font-size="30" fill="#4A3B22">${tierTerrain}</text>

  <!-- Coarse public stat chips -->${chipsSvg}

  <!-- Attribution footer -->
  <text x="${OG_WIDTH / 2}" y="600" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="600" font-size="22" fill="#6A511F">Forged with SettlementForge  ·  settlementforge.com</text>
</svg>`;
}

// ── Default data fetch: the public sanitizer RPC, anon key, coarse columns ────
function defaultFetchProjection(slug: string): Promise<OgProjection | null> {
  return (async () => {
    const url = Deno.env.get('SUPABASE_URL');
    const anon = Deno.env.get('SUPABASE_ANON_KEY');
    if (!url || !anon) return null;
    const client = createClient(url, anon);
    const { data, error } = await client.rpc('get_gallery_dossier', { dossier_slug: slug });
    if (error) return null;
    const row = Array.isArray(data) ? data[0] : data;
    if (!row || typeof row !== 'object') return null;
    // Read ONLY the coarse public columns. `row.data` (the settlement blob) is
    // deliberately never touched — the seed-secret firewall lives here.
    const r = row as Record<string, unknown>;
    const name = coarseStr(r.name, 80);
    if (!name) return null;
    const pop = Number(r.population);
    return {
      name,
      tier: coarseStr(r.tier, 40),
      terrain: coarseStr(r.terrain, 40),
      population: Number.isFinite(pop) && pop > 0 ? Math.round(pop) : null,
      governmentType: coarseStr(r.government_type, 40),
      magicLevel: coarseStr(r.magic_level, 40),
      stability: coarseStr(r.stability, 40),
    };
  })();
}

// ── Default rasterizer: resvg-wasm, lazily initialized ───────────────────────
// Imported dynamically so the test import graph (which injects a stub rasterize)
// never fetches the WASM module. Fonts are fetched once from the site origin and
// cached in module scope. On ANY failure the caller redirects to the default.
let wasmReady: Promise<void> | null = null;
let fontBuffers: Uint8Array[] | null = null;
// deno-lint-ignore no-explicit-any
let ResvgCtor: any = null;

async function loadFonts(): Promise<Uint8Array[]> {
  if (fontBuffers) return fontBuffers;
  const faces = ['Lora-Bold.ttf', 'Nunito-Bold.ttf', 'Nunito-ExtraBold.ttf', 'Nunito-Regular.ttf'];
  const bufs = await Promise.all(
    faces.map(async (f) => {
      const res = await fetch(`${ASSET_ORIGIN}/fonts/${f}`);
      if (!res.ok) throw new Error(`font fetch ${f}: ${res.status}`);
      return new Uint8Array(await res.arrayBuffer());
    }),
  );
  fontBuffers = bufs;
  return bufs;
}

async function defaultRasterize(svg: string): Promise<Uint8Array> {
  // deno-lint-ignore no-explicit-any
  const mod: any = await import('https://esm.sh/@resvg/resvg-wasm@2.6.2');
  if (!wasmReady) {
    wasmReady = mod.initWasm(fetch('https://esm.sh/@resvg/resvg-wasm@2.6.2/index_bg.wasm'));
    ResvgCtor = mod.Resvg;
  }
  await wasmReady;
  const fonts = await loadFonts();
  const resvg = new ResvgCtor(svg, {
    fitTo: { mode: 'width', value: OG_WIDTH },
    font: { fontBuffers: fonts, defaultFontFamily: 'Nunito', loadSystemFonts: false },
  });
  return resvg.render().asPng();
}

/**
 * Exported handler with an injectable `deps` seam (production passes nothing).
 * @param req the incoming request (GET ?slug=…)
 * @param deps { fetchProjection, rasterize } for execution tests
 */
export async function handleOgImage(req: Request, deps: OgDeps = {}): Promise<Response> {
  const fetchProjection = deps.fetchProjection ?? defaultFetchProjection;
  const rasterize = deps.rasterize ?? defaultRasterize;

  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS' },
    });
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') || '';
  if (!isValidSlug(slug)) return redirectToDefault();

  let projection: OgProjection | null;
  try {
    projection = await fetchProjection(slug);
  } catch {
    return redirectToDefault();
  }
  if (!projection || !projection.name) return redirectToDefault();

  const svg = buildCardSvg(projection);

  let png: Uint8Array;
  try {
    png = await rasterize(svg);
  } catch (e) {
    console.error('[og-image] rasterize failed:', e instanceof Error ? e.message : String(e));
    return redirectToDefault();
  }

  if (req.method === 'HEAD') return new Response(null, { status: 200, headers: imageHeaders() });
  return new Response(png, { status: 200, headers: imageHeaders() });
}

if (import.meta.main) {
  serve((req) => handleOgImage(req));
}
