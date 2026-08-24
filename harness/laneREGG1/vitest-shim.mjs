/**
 * A LANE-LOCAL vitest SHIM. The sealed W3f tree has no node_modules and `npm install` cannot run
 * in it, so the estate's own remedy applies (memory: "lift the census classifier out of vitest —
 * run it under plain node"): the PIN FILE is authored in the estate's real shape and EXECUTED
 * here, so what is proven is the file that will be committed rather than a paraphrase of it.
 * ⚠ NOT a test framework. It implements exactly the matchers this lane's pin file uses, and an
 * unimplemented matcher THROWS rather than silently passing — a shim that returned `undefined`
 * for an unknown matcher would make every arm using it vacuous.
 */
const suites = [];
let current = null;
export function describe(name, fn) { const s = { name, tests: [] }; suites.push(s); const p = current; current = s; fn(); current = p; }
export function it(name, fn) { (current ? current.tests : (suites[0] || (suites.push({ name: '(root)', tests: [] }), suites[0])).tests).push({ name, fn }); }
const fail = (msg) => { throw new Error(msg); };
const show = (v) => { try { const s = JSON.stringify(v); return s === undefined ? String(v) : (s.length > 220 ? `${s.slice(0, 220)}…` : s); } catch { return String(v); } };
function matchers(actual, neg) {
  const ok = (cond, msg) => { if (neg ? cond : !cond) fail(`${neg ? 'NOT ' : ''}${msg}`); };
  return {
    toBe: (e) => ok(Object.is(actual, e), `expected ${show(actual)} toBe ${show(e)}`),
    toEqual: (e) => ok(JSON.stringify(actual) === JSON.stringify(e), `expected ${show(actual)} toEqual ${show(e)}`),
    toBeGreaterThan: (e) => ok(actual > e, `expected ${show(actual)} > ${show(e)}`),
    toBeGreaterThanOrEqual: (e) => ok(actual >= e, `expected ${show(actual)} >= ${show(e)}`),
    toBeLessThan: (e) => ok(actual < e, `expected ${show(actual)} < ${show(e)}`),
    toBeLessThanOrEqual: (e) => ok(actual <= e, `expected ${show(actual)} <= ${show(e)}`),
    toHaveLength: (e) => ok(actual && actual.length === e, `expected length ${actual && actual.length} toBe ${e}`),
    toBeTruthy: () => ok(!!actual, `expected ${show(actual)} to be truthy`),
    toBeFalsy: () => ok(!actual, `expected ${show(actual)} to be falsy`),
    toBeNull: () => ok(actual === null, `expected ${show(actual)} toBeNull`),
    toBeUndefined: () => ok(actual === undefined, `expected ${show(actual)} toBeUndefined`),
    toBeDefined: () => ok(actual !== undefined, `expected ${show(actual)} toBeDefined`),
    toContain: (e) => ok(actual && actual.indexOf(e) >= 0, `expected ${show(actual)} toContain ${show(e)}`),
    toMatch: (re) => ok(re.test(String(actual)), `expected ${show(actual)} toMatch ${re}`),
  };
}
export function expect(actual) {
  const base = matchers(actual, false);
  return new Proxy(base, {
    get(t, k) {
      if (k === 'not') return matchers(actual, true);
      if (k in t) return t[k];
      throw new Error(`lane vitest shim: matcher '${String(k)}' is NOT IMPLEMENTED — implement it rather than let the arm pass vacuously`);
    },
  });
}
export async function __run() {
  let pass = 0, failn = 0;
  for (const s of suites) {
    console.log(`\n${s.name}`);
    for (const t of s.tests) {
      try { await t.fn(); console.log(`  ✓ ${t.name}`); pass++; }
      catch (e) { console.log(`  ✗ ${t.name}\n      ${e && e.message ? e.message : e}`); failn++; }
    }
  }
  console.log(`\n${pass} passed, ${failn} failed, ${pass + failn} total`);
  return failn;
}
