/**
 * statusPageSelfContained.test.js — the R-26 STATUS PAGE guard.
 *
 * The status page must survive an outage of everything else: no external service, no
 * scripts, no network calls. These pins hold that contract so a future edit cannot
 * quietly reintroduce a CDN font, an inline script, or a tracker that would make the
 * page fail exactly when it is needed.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const STATUS_HTML = join(dirname(fileURLToPath(import.meta.url)), '../../public/status.html');
const html = readFileSync(STATUS_HTML, 'utf8');

describe('public/status.html is self-contained', () => {
  it('is a titled HTML document set to noindex', () => {
    expect(html).toMatch(/<!doctype html>/i);
    expect(html).toMatch(/<title>SettlementForge Status<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="robots"[^>]+content="noindex"/);
  });

  it('loads no external resources (no CDN scripts, fonts, or stylesheets)', () => {
    // No <script> at all (CSP forbids inline script; the page needs none).
    expect(html).not.toMatch(/<script/i);
    // No external <link> stylesheet/font, no <img src>, no external url() in CSS.
    expect(html).not.toMatch(/<link[^>]+href=/i);
    expect(html).not.toMatch(/<img/i);
    expect(html).not.toMatch(/url\(\s*https?:/i);
  });

  it('makes no network call — the only external URL is the support mailto', () => {
    const externalUrls = html.match(/https?:\/\/[^\s"')]+/gi) || [];
    expect(externalUrls).toEqual([]);
    expect(html).toMatch(/mailto:support@settlementforge\.com/);
  });

  it('ships every status vocabulary class the runbook references', () => {
    for (const cls of ['pill-ok', 'pill-degraded', 'pill-down', 'pill-maintenance']) {
      expect(html).toContain(cls);
    }
    for (const cls of ['banner-ok', 'banner-degraded', 'banner-down', 'banner-maintenance']) {
      expect(html).toContain(cls);
    }
  });

  it('carries the incident template (an operator can copy it in place)', () => {
    expect(html).toMatch(/INCIDENT TEMPLATE/);
    expect(html).toMatch(/class="incident"/);
  });

  it('opens in the calm register (no exclamation points in the visible copy)', () => {
    // Strip HTML comments AND all tags (incl. <!doctype>), leaving only rendered text.
    const visibleText = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ');
    expect(visibleText).not.toContain('!');
  });
});
