/** Execute the lane's pin file under plain node. See ./README.md for the shim's install step. */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const mod = await import('vitest');
await import(join(ROOT, 'tests/domain/townMapFabricCliffs.test.js'));
process.exit((await mod.__run()) ? 1 : 0);
