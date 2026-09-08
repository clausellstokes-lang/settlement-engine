/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';

import { sanitizeGalleryHtml } from '../../src/lib/sanitizeGalleryHtml.js';

describe('sanitizeGalleryHtml (§4c)', () => {
  it('keeps the allowed formatting tags', () => {
    const out = sanitizeGalleryHtml(
      '<p>Hi <strong>bold</strong> <em>it</em> <u>u</u></p><ul><li>one</li></ul><ol><li>two</li></ol><h3>Head</h3>',
    );
    expect(out).toContain('<strong>bold</strong>');
    expect(out).toContain('<em>it</em>');
    expect(out).toContain('<li>one</li>');
    expect(out).toContain('<h3>Head</h3>');
  });

  it('strips <script>, event handlers, and disallowed tags', () => {
    const out = sanitizeGalleryHtml('<p onclick="evil()">hi</p><script>alert(1)</script><iframe src="https://e.com"></iframe>');
    expect(out).not.toContain('<script');
    expect(out).not.toContain('onclick');
    expect(out).not.toContain('<iframe');
    expect(out).toContain('hi');
  });

  it('drops javascript: links but keeps https links, forced to open safely', () => {
    expect(sanitizeGalleryHtml('<a href="javascript:alert(1)">x</a>')).not.toContain('javascript:');
    const ok = sanitizeGalleryHtml('<a href="https://example.com">x</a>');
    expect(ok).toContain('href="https://example.com"');
    expect(ok).toContain('target="_blank"');
    expect(ok).toContain('rel="noopener noreferrer nofollow"');
  });

  it('strips style/class/id attributes', () => {
    const out = sanitizeGalleryHtml('<p style="color:red" class="x" id="y">t</p>');
    expect(out).not.toContain('style=');
    expect(out).not.toContain('class=');
    expect(out).not.toContain('id=');
    expect(out).toContain('t');
  });

  it('returns empty for empty / non-string input', () => {
    expect(sanitizeGalleryHtml('')).toBe('');
    expect(sanitizeGalleryHtml(null)).toBe('');
    expect(sanitizeGalleryHtml(undefined)).toBe('');
    expect(sanitizeGalleryHtml(42)).toBe('');
  });
});
