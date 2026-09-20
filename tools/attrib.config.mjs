// A one-off Vite config wrapper: the real config plus a plugin that records every module's
// rendered length inside every emitted chunk, so a bundle's growth can be attributed per file.
import { writeFileSync, readFileSync } from 'node:fs';
import base from './vite.config.js';
const out = process.env.ATTRIB_OUT || 'attrib-modules.json';
const record = {};
const plugin = {
  name: 'attrib-rendered-lengths',
  generateBundle(_, bundle) {
    // Workers are bundled by their own Rollup pass (Vite's `worker.plugins`), so the record
    // is MERGED on disk across passes rather than overwritten by the last one.
    let merged = {};
    try { merged = JSON.parse(readFileSync(out, 'utf8')); } catch {}
    for (const [file, chunk] of Object.entries(bundle)) {
      if (chunk.type !== 'chunk') continue;
      merged[file] = { size: Buffer.byteLength(chunk.code), modules: Object.fromEntries(Object.entries(chunk.modules).map(([id, m]) => [id.replace(process.cwd() + '/', ''), m.renderedLength])) };
    }
    writeFileSync(out, JSON.stringify(merged));
  },
};
const cfg = typeof base === 'function' ? await base({ command: 'build', mode: 'production' }) : base;
const workerPlugins = typeof cfg.worker?.plugins === 'function' ? cfg.worker.plugins : () => (cfg.worker?.plugins || []);
export default { ...cfg, plugins: [...(cfg.plugins || []), plugin], worker: { ...(cfg.worker || {}), plugins: () => [...workerPlugins(), plugin] }, build: { ...(cfg.build || {}), outDir: process.env.ATTRIB_DIR || 'dist-attrib', sourcemap: false } };
