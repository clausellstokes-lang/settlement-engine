// node rboot.mjs <tree> <bundle.mjs> <plan.json> <out.jsonl> [from] [to]
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
const viewport = { matches: false, listeners: new Set() };
w.matchMedia = globalThis.matchMedia = Object.assign((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) }), { SF_CONTROLLED: true });
if (!w.ResizeObserver) w.ResizeObserver = globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
if (!w.IntersectionObserver) w.IntersectionObserver = globalThis.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } };
w.scrollTo = () => {}; w.HTMLElement.prototype.scrollIntoView = () => {};
const plan = JSON.parse(readFileSync(PLAN, 'utf8')).slice(Number(FROM), Number(TO));
const { run } = await import(BUNDLE);
await run(plan, OUT);
console.log('done', plan.length);
process.exit(0);
