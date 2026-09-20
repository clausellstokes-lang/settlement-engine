import { register } from 'node:module';

register('./prng-loader.mjs', import.meta.url);

/** The mint census the loader-injected wrapper reports into. */
const state = { mints: [], enabled: true };
globalThis.__PRNG_CENSUS__ = {
  mint(seed) {
    const rec = { seed, calls: 0, methods: {}, forkLabels: [] };
    if (state.enabled) state.mints.push(rec);
    return rec;
  },
  reset() { state.mints = []; },
  all() { return state.mints; },
};
