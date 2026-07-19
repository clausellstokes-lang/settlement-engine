/** @vitest-environment jsdom */
/**
 * seo.test.js — per-route document head, dynamic OG image, and JSON-LD.
 *
 * Pins the share-loop head contract:
 *   - every public route emits a coherent OG + Twitter large-image card;
 *   - a gallery item points og:image at the DYNAMIC per-slug endpoint;
 *   - the site-level WebSite/SoftwareApplication JSON-LD ships on every route;
 *   - setSharedDossierMeta names the share (title + CreativeWork) from the
 *     PUBLIC projection only — no seed/secret from the settlement blob ever
 *     reaches a meta tag or the JSON-LD.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { applyDocumentHead } from '../../src/lib/seo.js';
import { setSharedDossierMeta } from '../../src/lib/seoDossier.js';

const meta = (attr, key) =>
  document.head.querySelector(`meta[${attr}="${key}"]`)?.getAttribute('content') ?? null;
const jsonLd = (id) =>
  document.head.querySelector(`script[type="application/ld+json"]#${id}`)?.textContent ?? null;

beforeEach(() => {
  document.head.innerHTML = '';
  document.title = '';
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe('applyDocumentHead — per-route OG + Twitter', () => {
  it('a public route emits the default card + a large-image twitter card', () => {
    applyDocumentHead('pricing');
    expect(meta('property', 'og:type')).toBe('website');
    expect(meta('property', 'og:image')).toBe('https://settlementforge.com/og-craft.png');
    expect(meta('property', 'og:image:width')).toBe('1200');
    expect(meta('property', 'og:image:height')).toBe('630');
    expect(meta('property', 'og:image:type')).toBe('image/png');
    expect(meta('name', 'twitter:card')).toBe('summary_large_image');
    expect(meta('name', 'twitter:image')).toBe('https://settlementforge.com/og-craft.png');
    expect(meta('name', 'twitter:title')).toBeTruthy();
  });

  it('the site-level WebSite + SoftwareApplication JSON-LD ships on every route', () => {
    applyDocumentHead('home');
    const graph = JSON.parse(jsonLd('ld-site'));
    const types = graph['@graph'].map((n) => n['@type']);
    expect(types).toContain('WebSite');
    expect(types).toContain('SoftwareApplication');
  });

  it('a private route is marked noindex', () => {
    applyDocumentHead('account');
    expect(meta('name', 'robots')).toBe('noindex, nofollow');
  });

  it('a gallery item points og:image at the DYNAMIC per-slug endpoint', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://proj.supabase.co');
    applyDocumentHead('gallery', { slug: 'ashford-9f2' });
    expect(meta('property', 'og:type')).toBe('article');
    expect(meta('property', 'og:image')).toBe(
      'https://proj.supabase.co/functions/v1/og-image?slug=ashford-9f2',
    );
    expect(meta('name', 'twitter:image')).toContain('og-image?slug=ashford-9f2');
  });

  it('a gallery item falls back to the default card when the project URL is unset', () => {
    vi.stubEnv('VITE_SUPABASE_URL', '');
    applyDocumentHead('gallery', { slug: 'ashford-9f2' });
    expect(meta('property', 'og:image')).toBe('https://settlementforge.com/og-craft.png');
  });

  it('leaving a gallery item clears the per-item CreativeWork graph', () => {
    setSharedDossierMeta({ name: 'Ashford', slug: 'ashford-9f2' });
    expect(jsonLd('ld-gallery-item')).toBeTruthy();
    applyDocumentHead('pricing'); // navigate away
    expect(jsonLd('ld-gallery-item')).toBeNull();
  });
});

describe('setSharedDossierMeta — named share + CreativeWork', () => {
  it('names the share in the title, description, and CreativeWork', () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://proj.supabase.co');
    setSharedDossierMeta({
      name: 'Ashford-on-Vell',
      slug: 'ashford-9f2',
      tier: 'town',
      settlement: { config: { terrain: 'river_valley' }, population: 2400 },
      publishedAt: '2026-07-01T00:00:00Z',
    });
    expect(document.title).toBe('Ashford-on-Vell · SettlementForge');
    expect(meta('property', 'og:title')).toContain('Ashford-on-Vell');
    expect(meta('property', 'og:description')).toContain('Ashford-on-Vell');
    expect(meta('property', 'og:description')).toContain('River Valley'.toLowerCase());

    const cw = JSON.parse(jsonLd('ld-gallery-item'));
    expect(cw['@type']).toBe('CreativeWork');
    expect(cw.name).toBe('Ashford-on-Vell');
    expect(cw.url).toBe('https://settlementforge.com/gallery/ashford-9f2');
    expect(cw.image).toContain('og-image?slug=ashford-9f2');
    expect(cw.datePublished).toBe('2026-07-01T00:00:00Z');
  });

  it('never leaks a seed/secret from the settlement blob into the head', () => {
    setSharedDossierMeta({
      name: 'Ashford',
      slug: 'ashford-9f2',
      tier: 'town',
      // A hostile/drifted dossier carrying private fields the head must ignore.
      seed: 'DEADBEEF-SEED-1234',
      settlement: {
        population: 900,
        seed: 'blob-seed-secret',
        dmNotes: 'the vault code is 8471',
        config: { terrain: 'coast', seed: 'cfg-seed' },
      },
    });
    const head = document.head.innerHTML;
    expect(head).not.toContain('DEADBEEF-SEED-1234');
    expect(head).not.toContain('blob-seed-secret');
    expect(head).not.toContain('vault code');
    expect(head).not.toContain('cfg-seed');
    expect(/seed/i.test(head)).toBe(false);
  });

  it('is a safe no-op for a missing or nameless dossier', () => {
    expect(() => setSharedDossierMeta(null)).not.toThrow();
    expect(() => setSharedDossierMeta({ slug: 'x' })).not.toThrow();
    expect(jsonLd('ld-gallery-item')).toBeNull();
  });
});
