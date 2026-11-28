// node boot-final.mjs <tree> <bundle.mjs> <plan.json> <out.jsonl> [from] [to]
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const [TREE, BUNDLE, PLAN, OUT, FROM = '0', TO = '99999'] = process.argv.slice(2);
const require = createRequire(join(TREE, 'package.json'));
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'http://localhost:3000/', pretendToBeVisual: true });
const w = dom.window;
for (const k of Object.getOwnPropertyNames(w)) { if (k in globalThis) continue; try { globalThis[k] = w[k]; } catch { /* */ } }
for (const k of ['window', 'document', 'navigator', 'location', 'localStorage', 'sessionStorage', 'HTMLElement', 'Element', 'Node', 'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'MutationObserver', 'DocumentFragment', 'Text']) {
  try { Object.defineProperty(globalThis, k, { value: w[k], configurable: true, writable: true }); } catch { /* */ }
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
w.matchMedia = globalThis.matchMedia = Object.assign((q) => ({ media: q, matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }), { SF_CONTROLLED: true });
if (!w.ResizeObserver) w.ResizeObserver = globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
if (!w.IntersectionObserver) w.IntersectionObserver = globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } };
w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = () => {};
const lines = readFileSync(BUNDLE, 'utf8').split('\n');
const starts = [];
lines.forEach((l, i) => { const m = l.match(/^\/\/ ((?:src|node_modules|tests|\.\.)\/\S+)$/); if (m) starts.push([i + 1, m[1]]); });
const modmap = (ln) => { let lo = 0, hi = starts.length - 1, ans = '(?)'; while (lo <= hi) { const mid = (lo + hi) >> 1; if (starts[mid][0] <= ln) { ans = starts[mid][1]; lo = mid + 1; } else hi = mid - 1; } return ans; };
const plan = JSON.parse(readFileSync(PLAN, 'utf8')).slice(Number(FROM), Number(TO));
const { run } = await import(BUNDLE);
await run(plan, OUT, { modmap });
console.log('done', plan.length);
process.exit(0);
