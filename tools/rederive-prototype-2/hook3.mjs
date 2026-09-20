import { register } from 'node:module';

register('./enrich-loader2.mjs', import.meta.url);

const state = { mints: [], enabled: true };
globalThis.__PRNG_CENSUS__ = {
  mint(seed) { const rec = { seed, calls: 0, methods: {}, forkLabels: [] }; if (state.enabled) state.mints.push(rec); return rec; },
  reset() { state.mints = []; },
  all() { return state.mints; },
};

const ecalls = [];
globalThis.__ENRICH_CENSUS__ = {
  on: false,
  calls: ecalls,
  snap(v) { if (v === undefined) return undefined; try { return JSON.parse(JSON.stringify(v)); } catch { return String(v); } },
  push(rec) { ecalls.push(rec); },
  reset() { ecalls.length = 0; },
};
