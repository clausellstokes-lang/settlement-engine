/**
 * api/csp-report.js — Vercel serverless sink for CSP violation reports.
 *
 * The enforcing Content-Security-Policy in vercel.json declares
 *   report-uri /api/csp-report
 *   report-to  csp-endpoint  (Reporting-Endpoints: csp-endpoint="/api/csp-report")
 * but until this endpoint existed those reports 404'd into the void. This
 * function makes the sink REAL: it accepts the violation POST and emits ONE
 * structured `[csp-report]` JSON line to stdout, so violations are collected and
 * searchable in Vercel's Function Logs (filter on "csp-report"). It is a passive
 * collector — it never blocks, mutates, or returns data; it just records.
 *
 * Two wire formats must be handled (a browser sends one or the other):
 *   - report-uri:  Content-Type application/csp-report, body { "csp-report": {…} }
 *   - report-to:   Content-Type application/reports+json, body [ { type, body, … } ]
 * Anything else (incl. an empty/garbled body) is logged raw rather than dropped,
 * because a malformed report is itself signal worth seeing.
 *
 * Runtime: default Vercel Node.js serverless function (Web-standard Request in,
 * Response out). No deps, no secrets — safe to be publicly reachable.
 *
 * @param {Request} req
 * @returns {Promise<Response>}
 */
export default async function handler(req) {
  // Only POST carries reports; reject everything else cheaply (and don't leak a
  // body on a probe). 405 with Allow is the correct, boring answer.
  if (req.method !== 'POST') {
    return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  }

  const contentType = req.headers.get('content-type') || '';
  let payload;
  try {
    const raw = await req.text();
    payload = parseReport(raw, contentType);
  } catch (err) {
    payload = { parseError: String(err && err.message ? err.message : err) };
  }

  // ONE structured line per request so Vercel log search ("csp-report") and any
  // downstream log drain can pick it up without multi-line stitching.
  console.log(
    JSON.stringify({
      tag: 'csp-report',
      at: new Date().toISOString(),
      contentType,
      userAgent: req.headers.get('user-agent') || null,
      reports: payload,
    }),
  );

  // 204: accepted, nothing to return. Browsers ignore the response body for
  // report deliveries anyway.
  return new Response(null, { status: 204 });
}

/**
 * Normalize the two CSP report wire formats into a plain array of report objects.
 * Falls back to the raw string when the body isn't JSON we recognize.
 * @param {string} raw          - the request body text.
 * @param {string} contentType  - the request Content-Type header.
 * @returns {unknown} a list of report objects, or the raw body on a parse miss.
 */
function parseReport(raw, contentType) {
  if (!raw) return [];
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Not JSON — keep the raw text so the violation isn't silently lost.
    return raw;
  }
  // report-uri format: a single object wrapping the report under "csp-report".
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && 'csp-report' in parsed) {
    return [parsed['csp-report']];
  }
  // report-to (Reporting API) format: an array of { type, age, url, body }.
  if (Array.isArray(parsed)) return parsed;
  // application/reports+json single object, or anything else JSON-shaped.
  void contentType;
  return [parsed];
}
