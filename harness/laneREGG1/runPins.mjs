const mod = await import('vitest');
await import('./tests/domain/townMapFabricCliffs.test.js');
const failed = await mod.__run();
process.exit(failed ? 1 : 0);
