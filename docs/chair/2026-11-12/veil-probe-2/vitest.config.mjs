// Runs only this lane's second-seat probes (never part of the repository's sweep: no .test. in a name).
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['docs/chair/2026-11-12/veil-probe-2/*.probe.mjs'], environment: 'node', testTimeout: 7_200_000, hookTimeout: 7_200_000 } });
