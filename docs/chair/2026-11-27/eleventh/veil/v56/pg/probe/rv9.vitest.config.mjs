// PG's (VEIL-56) stand-in for the uncommitted rv9 config the dump door names: runs ONE probe file (RV9_PROBE) by absolute path.
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { dirname, basename } from 'node:path';
const P = process.env.RV9_PROBE;
export default defineConfig({
  plugins: [react()],
  root: dirname(P),
  server: { fs: { strict: false } },
  test: {
    include: [basename(P)], environment: 'node', testTimeout: 0, hookTimeout: 0,
    server: { deps: { inline: [/@testing-library\//] } }, transformMode: { web: [/\.[jt]sx$/] },
  },
});
