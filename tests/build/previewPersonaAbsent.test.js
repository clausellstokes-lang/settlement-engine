/**
 * previewPersonaAbsent.test.js — THE DEV PREVIEW PERSONA NEVER SHIPS (ODQ §934.35).
 *
 * WHAT IS BEING GUARDED. The owner asked for "a dummy admin account for our
 * preview purposes only". What was built is a DEV-ONLY VIEW: `VITE_PREVIEW_ROLE`
 * seats the role the client's gates read (store/authSlice.js), and the account
 * menu wears a marker saying so (components/AccountMenu.jsx). It is safe only
 * because it cannot exist in a production build — the branch is
 * `import.meta.env.DEV && …`, Vite folds DEV to the literal `false`, and Rollup
 * drops the body. This proves that against the REAL dist rather than trusting it.
 *
 * ⛔⛔ THE STALE-DIST POLARITY IS sourcemapAbsence's, NOT vendorPdfLazy's, AND
 * COPYING THE WRONG NEIGHBOUR WOULD SHIP A GUARD THAT CANNOT FIRE. The house rule
 * is that absence assertions stay UNGATED because a stale dist can only
 * UNDER-report absence. That holds for absences about a newly-added eager EDGE,
 * which a stale build simply lacks. It does NOT hold here, because this absence
 * is about a BUILD-TIME SUBSTITUTION: change the guard so it no longer folds (or
 * build with the variable set in a production env), skip the rebuild, and a stale
 * dist still contains none of these strings — so an ungated guard reports GREEN
 * over precisely the change it exists to catch. A stale dist FALSE-GREENS here;
 * it never false-REDS. The reads are therefore VERIFY_DIST-gated, and the
 * unconditional arm below makes VERIFY_DIST=1 with a missing dist a HARD failure,
 * so the gated half can never count green having measured nothing.
 *
 * WHAT IS SCANNED. Every emitted text artifact: dist/assets/** plus the
 * prerendered documents the postbuild step writes at the dist root (304 of them
 * at the time of writing), because a leak into an inlined script would land in
 * the HTML rather than in a chunk.
 */
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';

const ROOT = resolve(process.cwd());
const distDir = resolve(ROOT, 'dist');
const assetsDir = join(distDir, 'assets');
const distExists = existsSync(distDir) && existsSync(assetsDir);
const requireDistRead = process.env.VERIFY_DIST === '1';

/**
 * The two spellings the persona could ship under. `VITE_PREVIEW_ROLE` is the env
 * key (Vite substitutes it at build time, so its presence means the guard did not
 * fold); `previewPersona` is the identifier family — a surviving property key or
 * an un-minified binding would mean the mechanism reached the bundle.
 */
const FORBIDDEN = Object.freeze(['VITE_PREVIEW_ROLE', 'previewPersona']);

/** Text artifacts a leak could land in. */
const TEXT = /\.(js|mjs|cjs|css|html|json|map)$/;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (TEXT.test(entry)) out.push(p);
  }
  return out;
}

describe('the preview persona is absent from the shipped bundle', () => {
  it('VERIFY_DIST=1 demands a real dist (a skipped post-build contract is green-on-nothing)', () => {
    if (!requireDistRead) {
      expect(true, 'unset VERIFY_DIST — the gated arms below are skipped by design').toBe(true);
      return;
    }
    expect(distExists, 'VERIFY_DIST=1 but dist/assets is absent — run `npm run build` first').toBe(true);
    expect(walk(assetsDir).length, 'dist/assets holds no text artifacts').toBeGreaterThan(0);
  });

  it.skipIf(!requireDistRead || !distExists)('no emitted artifact carries either spelling', () => {
    const files = walk(distDir);
    // Anti-vacuity: the scan must actually be reading the build.
    expect(files.length, 'nothing to scan — is this the right dist?').toBeGreaterThan(10);
    const hits = [];
    for (const abs of files) {
      const text = readFileSync(abs, 'utf8');
      for (const needle of FORBIDDEN) {
        if (text.includes(needle)) hits.push(`${relative(ROOT, abs)} → ${needle}`);
      }
    }
    expect(
      hits,
      '\nThe DEV-only preview persona reached the production bundle. It seats an ADMIN '
        + 'role on the client from an environment variable; shipping it would let a '
        + 'production visitor render the admin surface. Restore the fold — the guard must '
        + 'be spelled `import.meta.env.DEV && import.meta.env.VITE_PREVIEW_ROLE` so Vite '
        + 'can constant-fold it — and rebuild:\n'
        + `${hits.join('\n')}\n`,
    ).toEqual([]);
  });

  it.skipIf(!requireDistRead || !distExists)('the scan DISCRIMINATES (positive control on a seeded string)', () => {
    // ⛔ WITHOUT THIS, "no hits" could mean "the matcher is broken". Seed the
    // exact needles into a buffer the same way and prove the predicate fires.
    const seeded = 'const x = 1; // VITE_PREVIEW_ROLE\nconst y = { previewPersona: null };';
    expect(FORBIDDEN.filter((n) => seeded.includes(n))).toEqual([...FORBIDDEN]);
    // …and prove a clean artifact of the same kind does not fire.
    const clean = readFileSync(join(distDir, 'index.html'), 'utf8');
    expect(FORBIDDEN.filter((n) => clean.includes(n))).toEqual([]);
  });
});
