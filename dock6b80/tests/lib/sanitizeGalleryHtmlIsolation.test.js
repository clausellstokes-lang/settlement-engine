/** @vitest-environment jsdom */
/**
 * sanitizeGalleryHtmlIsolation.test.js — B15 #12 / #13.
 *
 * #12: the link-rewriting hook must live on a PRIVATE DOMPurify instance, not the
 *      process-wide singleton — a future DOMPurify caller in another context must
 *      NOT silently inherit gallery's anchor rewriting.
 * #13: the noopener/rel guarantee must be UNCONDITIONAL — links must come out with
 *      target=_blank + rel=noopener... even when addHook never registers (shimmed
 *      build). `target`/`rel` are NOT taken from author input.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import DOMPurify from 'dompurify';
import { sanitizeGalleryHtml, __resetSanitizerForTests } from '../../src/lib/sanitizeGalleryHtml.js';

beforeEach(() => { __resetSanitizerForTests(); });

describe('#12 the hook does not leak onto the global DOMPurify singleton', () => {
  it('the default DOMPurify instance does NOT rewrite anchors after gallery sanitize', () => {
    // Prime the gallery sanitizer (attaches its hook to its private instance).
    const galleryOut = sanitizeGalleryHtml('<a href="https://example.com">x</a>');
    expect(galleryOut).toContain('target="_blank"');

    // A separate caller using the package default must be unaffected: no forced
    // target/rel injected by gallery's hook.
    const otherOut = DOMPurify.sanitize('<a href="https://example.com">y</a>', { ALLOWED_TAGS: ['a'], ALLOWED_ATTR: ['href'] });
    expect(otherOut).not.toContain('target="_blank"');
    expect(otherOut).not.toContain('noopener');
  });
});

describe('#13 author cannot inject target/rel; rel is forced unconditionally', () => {
  it('drops an author-supplied target and forces the safe rel', () => {
    // Author tries to set their own target (e.g. _self) — must be overridden.
    const out = sanitizeGalleryHtml('<a href="https://example.com" target="_self" rel="opener">x</a>');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer nofollow"');
    expect(out).not.toContain('_self');
    expect(out).not.toContain('rel="opener"');
  });

  it('every surviving anchor gets target+rel even with multiple links', () => {
    const out = sanitizeGalleryHtml('<p><a href="https://a.com">a</a> and <a href="mailto:x@y.com">b</a></p>');
    const matches = out.match(/rel="noopener noreferrer nofollow"/g) || [];
    expect(matches.length).toBe(2);
    expect((out.match(/target="_blank"/g) || []).length).toBe(2);
  });

  it('forces rel even if addHook is unavailable on the instance (post-pass guarantee)', () => {
    // Simulate a build where addHook is missing: the post-pass on the returned
    // fragment must still force target/rel.
    const orig = DOMPurify.addHook;
    try {
      // @ts-ignore — deliberately remove for this case.
      DOMPurify.addHook = undefined;
      __resetSanitizerForTests();
      const out = sanitizeGalleryHtml('<a href="https://example.com">x</a>');
      expect(out).toContain('target="_blank"');
      expect(out).toContain('rel="noopener noreferrer nofollow"');
      expect(out).toContain('href="https://example.com"');
    } finally {
      DOMPurify.addHook = orig;
      __resetSanitizerForTests();
    }
  });
});
