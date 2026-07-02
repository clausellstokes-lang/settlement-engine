/** @vitest-environment jsdom */
/**
 * seo.test.js — per-route document head, focused on the /gallery/:slug
 * canonical fix (lib#16).
 *
 * A shared-dossier page (/gallery/:slug) must canonicalize to its OWN path, not
 * the /gallery index — otherwise crawlers treat every community share as a
 * duplicate of the index and de-index the individual dossiers.
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { applyDocumentHead } from '../../src/lib/seo.js';

const ORIGIN = 'https://settlementforge.com';

const canonicalHref = () =>
  document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');
const ogUrl = () =>
  document.head.querySelector('meta[property="og:url"]')?.getAttribute('content');

beforeEach(() => {
  document.head.innerHTML = '';
});

describe('applyDocumentHead canonical', () => {
  test('the gallery index canonicalizes to /gallery', () => {
    applyDocumentHead('gallery');
    expect(canonicalHref()).toBe(`${ORIGIN}/gallery`);
    expect(ogUrl()).toBe(`${ORIGIN}/gallery`);
  });

  test('a shared dossier canonicalizes to its own /gallery/:slug path', () => {
    applyDocumentHead('gallery', { slug: 'ashford-vale' });
    expect(canonicalHref()).toBe(`${ORIGIN}/gallery/ashford-vale`);
    expect(ogUrl()).toBe(`${ORIGIN}/gallery/ashford-vale`);
  });

  test('home keeps the root canonical', () => {
    applyDocumentHead('home');
    expect(canonicalHref()).toBe(`${ORIGIN}/`);
  });
});
