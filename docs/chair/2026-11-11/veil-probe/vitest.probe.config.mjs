// Runs only the veil probe (never part of the repository's sweep: the file name has no .test.).
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['docs/chair/2026-11-11/veil-probe/*.probe.mjs'], environment: 'node', testTimeout: 3_600_000, hookTimeout: 3_600_000 } });
