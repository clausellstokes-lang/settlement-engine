// PAGE-4 MAGIC-AUDIENCE, point 4's receipt runner: the repository's own vitest config (jsdom pragma, JSX transform,
// setup files), with `include` narrowed to the one runner in this folder (its name matches no suite glob, so the whole
// suite never sweeps it). RUN (from the repository root), once per tree:
//   READER_HASH_OUT=<out>.txt npx vitest run --config docs/chair/2026-11-20/content/page/build/MAGIC-AUDIENCE/readerHash.vitest.config.mjs
import { mergeConfig } from 'vite';
import base from '../../../../../../../vite.config.js';

const resolved = typeof base === 'function' ? await base({ command: 'serve', mode: 'test' }) : base;
export default mergeConfig(resolved, {
  test: { include: ['docs/chair/2026-11-20/content/page/build/MAGIC-AUDIENCE/readerHash.run.jsx'] },
});
