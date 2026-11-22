/**
 * archKernelLazy.test.js -- K-1 SPINE (archKernelLazy + the dormancy pin, E-C).
 *
 * The whole K-1 arch/ kernel is DARK: imported by NOTHING shipped, so it contributes ZERO eager bytes
 * (closure Delta 0) forever, structurally. This extends the vendorPdfLazy idiom:
 *   - THE ALWAYS-ON SOURCE CONTRACT (ungated): no shipped src file STATICALLY imports arch/ -- a
 *     future edge into the kernel must be a dynamic import() (the single-lazy-parent discipline). This
 *     is the real dormancy guarantee and needs no build.
 *   - THE CLOSURE ABSENCE (VERIFY_DIST-gated): the ARCH_KERNEL_LAZY_SENTINEL never appears in any
 *     chunk of the entry's transitive static closure -- if it did, an eager module pulled the kernel
 *     into first paint (the +42 B shared-chunk wall). Absence is ungated (a stale dist can only
 *     under-report); the anti-vacuity guard hard-fails VERIFY_DIST=1 with no dist.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { ARCH_KERNEL_LAZY_SENTINEL } from '../../src/domain/townMap/arch/grammarIR.js';

const distDir = resolve(process.cwd(), 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDist = process.env.VERIFY_DIST === '1';

// ── source dormancy scan (ungated, no build) ─────────────────────────────────
function walkSrc(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (!p.includes('townMap/arch')) walkSrc(p, out); }
    else if (/\.(js|jsx)$/.test(e)) out.push(p);
  }
  return out;
}

describe('K-1 arch kernel dormancy -- the always-on source contract', () => {
  const srcRoot = resolve(process.cwd(), 'src');
  const files = walkSrc(srcRoot);

  it('guard-the-guard: the scan found the shipped source tree', () => {
    expect(files.length).toBeGreaterThan(200);
  });

  it('no shipped src file STATICALLY imports townMap/arch (the kernel stays dark)', () => {
    const offenders = [];
    for (const f of files) {
      const src = readFileSync(f, 'utf8');
      // a static import/re-export from an arch path: `... from '.../townMap/arch/...'`
      if (/\bfrom\s+['"][^'"]*townMap\/arch\/[^'"]*['"]/.test(src)) {
        offenders.push(f.replace(srcRoot, 'src'));
      }
    }
    expect(
      offenders,
      `these shipped modules statically import the dark arch kernel -- route the edge through a dynamic import() instead:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });
});

// ── VERIFY_DIST anti-vacuity + closure absence ───────────────────────────────
describe('K-1 arch kernel -- VERIFY_DIST post-build anti-vacuity', () => {
  it('when VERIFY_DIST=1, dist/ + dist/assets exist (post-build must verify, not skip)', () => {
    expect(!requireDist || distExists, 'VERIFY_DIST=1 but dist/assets is absent -- run `npm run build` first').toBe(true);
  });
});

function findEntryChunk() {
  const html = readFileSync(join(distDir, 'index.html'), 'utf-8');
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/assets\/([^"]+)"/);
  if (!m) throw new Error('Could not locate entry <script type="module"> in dist/index.html');
  return m[1];
}
function staticSpecs(codeStr) {
  const specs = new Set();
  const fromRe = /\bfrom\s*["'](\.\/[^"']+\.js)["']/g;
  const bareRe = /(?:^|[;}])import\s*["'](\.\/[^"']+\.js)["']/g;
  let m;
  while ((m = fromRe.exec(codeStr)) !== null) specs.add(m[1].replace('./', ''));
  while ((m = bareRe.exec(codeStr)) !== null) specs.add(m[1].replace('./', ''));
  return [...specs];
}
function entryStaticClosure() {
  const entry = findEntryChunk();
  const seen = new Set([entry]);
  const queue = [entry];
  while (queue.length) {
    const file = queue.shift();
    const code = readFileSync(join(assetsDir, file), 'utf-8');
    for (const dep of staticSpecs(code)) if (!seen.has(dep)) { seen.add(dep); queue.push(dep); }
  }
  return [...seen];
}

describe.runIf(distExists)('K-1 arch kernel -- absent from the first-paint static closure (closure Delta 0)', () => {
  it('the arch-kernel sentinel appears in NO entry-closure chunk', () => {
    const files = entryStaticClosure();
    const carriers = files.filter((f) => readFileSync(join(assetsDir, f), 'utf-8').includes(ARCH_KERNEL_LAZY_SENTINEL));
    expect(
      carriers,
      `the K-1 arch kernel reached first paint via ${carriers.join(', ')} -- it must stay dark (closure Delta 0)`,
    ).toEqual([]);
  });

  it.skipIf(!requireDist)('no arch chunk is even emitted into dist (nothing imports it, statically or dynamically)', () => {
    const carriers = readdirSync(assetsDir).filter((f) => f.endsWith('.js') && readFileSync(join(assetsDir, f), 'utf-8').includes(ARCH_KERNEL_LAZY_SENTINEL));
    // The kernel is imported by nothing shipped, so its sentinel should not be in the app build at all.
    expect(carriers, `arch kernel bytes leaked into dist chunks: ${carriers.join(', ')}`).toEqual([]);
  });
});
