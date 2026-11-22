/**
 * Security regression — api/csp-report.js is an UNAUTHENTICATED public sink
 * (browsers must be able to POST violation reports with no session). Before
 * the cap, any caller could POST arbitrarily large bodies and every byte was
 * re-emitted as a log line: an unbounded log/cost flood primitive. These
 * tests pin the guard: oversized bodies are rejected (413) whether or not a
 * Content-Length was declared, non-JSON bodies are logged only as a bounded
 * prefix, and real browser-shaped reports still land as one structured line.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import handler from '../../api/csp-report.js';

/** Minimal Web-standard-ish request the handler consumes. */
function makeReq({ method = 'POST', body = '', contentType = 'application/csp-report', contentLength } = {}) {
  const headers = new Map([
    ['content-type', contentType],
    ['user-agent', 'test-agent'],
  ]);
  if (contentLength !== undefined) headers.set('content-length', String(contentLength));
  return {
    method,
    headers: { get: (k) => headers.get(k.toLowerCase()) ?? null },
    text: async () => body,
  };
}

describe('csp-report sink flood cap', () => {
  let logSpy;
  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => logSpy.mockRestore());

  test('rejects an oversized declared Content-Length before reading the body', async () => {
    const req = makeReq({ body: 'x', contentLength: 10 * 1024 * 1024 });
    req.text = vi.fn(); // must never be called
    const res = await handler(req);
    expect(res.status).toBe(413);
    expect(req.text).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });

  test('rejects an oversized actual body even without Content-Length', async () => {
    const res = await handler(makeReq({ body: 'z'.repeat(64 * 1024) }));
    expect(res.status).toBe(413);
    expect(logSpy).not.toHaveBeenCalled();
  });

  test('non-JSON garbage is logged only as a bounded prefix', async () => {
    const res = await handler(makeReq({ body: 'not-json '.repeat(2000), contentType: 'text/plain' }));
    expect(res.status).toBe(204);
    const line = JSON.parse(logSpy.mock.calls[0][0]);
    expect(typeof line.reports).toBe('string');
    expect(line.reports.length).toBeLessThanOrEqual(2048);
  });

  test('a real report-uri payload still lands as one structured log line', async () => {
    const body = JSON.stringify({ 'csp-report': { 'violated-directive': 'script-src' } });
    const res = await handler(makeReq({ body, contentLength: body.length }));
    expect(res.status).toBe(204);
    expect(logSpy).toHaveBeenCalledTimes(1);
    const line = JSON.parse(logSpy.mock.calls[0][0]);
    expect(line.tag).toBe('csp-report');
    expect(line.reports).toEqual([{ 'violated-directive': 'script-src' }]);
  });
});
