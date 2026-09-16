/**
 * noPremadeDeityPool.walker.test.js — THE DEITY DOCTRINE, made structural
 * (T4 ONE-REGEN batch).
 *
 * THE DOCTRINE (owner ruling 2026-07-21, re-ordered 2026-07-22): there is NO
 * premade deity pool. Gods are CUSTOM CONTENT — a DM authors them, or a
 * settlement has none. The T4 batch deleted the two files that violated it:
 * `src/generators/data/deityPool.js` (~two dozen authored gods) and
 * `src/generators/steps/seedStartingPantheon.js` (the pipeline step that drew
 * from that pool and baked a latent pantheon into EVERY seed).
 *
 * WHY A WALKER AND NOT JUST THE DELETION: a deletion removes an instance; it
 * does not remove the HABITAT. The pool was easy to re-add — a data table plus a
 * `registerStep` call plus one line in the step barrel — and nothing in the
 * estate would have objected. Worse, the re-entry would be INVISIBLE to the
 * golden suite in the one direction that matters: a re-added step that draws
 * from its own named PRNG fork moves only the deity keys, so a reviewer
 * re-recording goldens for an unrelated reason would silently re-bank a premade
 * pantheon into all 187 rows. This walker makes every re-entry route red.
 *
 * THE FOUR SCANS
 *   1. NO POOL MODULE — no file under src/ imports or references a `deityPool`
 *      module, `DEITY_POOL`, or `deityCoreRef` (the pool's ref minter).
 *   2. NO POOL-REF MINTING — no src file MINTS a `deity:core:` ref. The literal
 *      is permitted only where it is DISCUSSED (a doc comment explaining the
 *      retired namespace) or where a persisted legacy ref is read back, and each
 *      such site is listed with its reason. A ref minted into new output is the
 *      pool re-entering through content instead of through a data table.
 *   3. NO STEP REGISTRATION — `seedStartingPantheon` appears in no pipeline
 *      registration surface: the step barrel, the step metadata rail, or any
 *      step's `deps` array.
 *   4. THE SEAM SURVIVES — `latentPantheon.js` is still present and still
 *      exports `activateLatentPantheon`. This is the DELIBERATE non-deletion:
 *      saves written before the batch carry `config.latentPantheon`, and those
 *      gods must keep activating. A future cleanup that "finishes the job" by
 *      deleting the seam would silently strand every un-activated old save, so
 *      the doctrine's boundary is pinned in the same place as the doctrine.
 *
 * ANTI-VACUITY: scans 1-3 are ABSENCE assertions, and an absence assertion over
 * an empty file set passes for the wrong reason. Every scan therefore asserts
 * its denominator first — the walk found a plausible number of source files, and
 * the specific anchor files it must have read are among them. A broken walk reds
 * instead of greening.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');

/** Files that may CONTAIN the `deity:core:` literal, each with its reason. A site
 *  not listed here is a mint and reds. */
const CORE_REF_MENTION_ALLOWLIST = Object.freeze({
  'src/domain/worldPulse/applyWorldPulse.js':
    'Doc comment on reEmbedPrimaryDeity naming the retired pool namespace while '
    + 'explaining which ref fallbacks were removed. Prose about the namespace, not a mint.',
});

/** @returns {string[]} every .js/.jsx file under src, repo-relative. */
function walkSrc(dir = SRC, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSrc(p, out);
    else if (/\.(js|jsx)$/.test(entry)) out.push(relative(ROOT, p));
  }
  return out;
}

const SRC_FILES = walkSrc();
/** @type {Map<string, string>} repo-relative path → source text (read once). */
const SOURCES = new Map(SRC_FILES.map((f) => [f, readFileSync(join(ROOT, f), 'utf8')]));

/** Lines of `text` matching `re`, as "path:lineNo  trimmed". */
function sitesIn(path, text, re) {
  const hits = [];
  text.split('\n').forEach((line, i) => {
    re.lastIndex = 0;
    if (re.test(line)) hits.push(`${path}:${i + 1}  ${line.trim().slice(0, 120)}`);
  });
  return hits;
}

describe('the deity doctrine is structural — no premade pool can re-enter', () => {
  test('the walk has a real denominator (anti-vacuity for every absence below)', () => {
    // A plausible floor, not an exact count: this must not become a file-count
    // ratchet that reds on unrelated work.
    expect(SRC_FILES.length).toBeGreaterThan(400);
    // The specific files the scans below are ABOUT must actually have been read,
    // so a walk that silently missed the generation tree cannot pass.
    for (const anchor of [
      'src/generators/steps/index.js',
      'src/generators/steps/stepMetadata.js',
      'src/generators/steps/assembleSettlement.js',
      'src/domain/worldPulse/applyWorldPulse.js',
      'src/domain/worldPulse/latentPantheon.js',
    ]) {
      expect(SOURCES.has(anchor), `walk must have read ${anchor}`).toBe(true);
    }
  });

  test('scan 1 — no src file imports or references a premade deity pool', () => {
    const re = /\bdeityPool\b|\bDEITY_POOL\b|\bdeityCoreRef\b|\bDEITY_CORE_REF_PREFIX\b/;
    const hits = [];
    for (const [path, text] of SOURCES) hits.push(...sitesIn(path, text, new RegExp(re, 'g')));
    expect(hits, 'a premade deity pool re-entered src').toEqual([]);
  });

  test('scan 2 — no src file MINTS a `deity:core:` ref outside the reasoned allowlist', () => {
    const hits = [];
    for (const [path, text] of SOURCES) {
      if (Object.hasOwn(CORE_REF_MENTION_ALLOWLIST, path)) continue;
      hits.push(...sitesIn(path, text, /deity:core:/g));
    }
    expect(hits, 'a `deity:core:` ref is being minted outside the allowlist').toEqual([]);
    // The allowlist may not rot: every listed file must still exist AND still
    // carry the literal, so a stale exemption reds instead of quietly widening
    // the rule for whatever lands at that path next.
    for (const path of Object.keys(CORE_REF_MENTION_ALLOWLIST)) {
      expect(SOURCES.has(path), `stale allowlist entry: ${path} no longer exists`).toBe(true);
      expect(
        SOURCES.get(path).includes('deity:core:'),
        `stale allowlist entry: ${path} no longer contains the literal — drop the row`,
      ).toBe(true);
    }
  });

  test('scan 3 — the seedStartingPantheon step is registered nowhere', () => {
    // REGISTRATION SHAPES ONLY, deliberately: the three ways the pipeline can
    // learn about a step — a module import, a quoted name (registerStep's own
    // argument, and every `deps: [...]` entry), or a metadata object key. Prose
    // that merely NAMES the retired step (this batch's own headers explain why
    // it is gone) is not a registration and must not red, or the rule would
    // punish exactly the documentation that keeps the deletion legible.
    const re = /(?:from|import)\s*\(?\s*['"][^'"]*seedStartingPantheon|['"]seedStartingPantheon['"]|^\s*seedStartingPantheon\s*:/g;
    const hits = [];
    for (const [path, text] of SOURCES) hits.push(...sitesIn(path, text, re));
    expect(hits, 'the retired starting-pantheon step re-entered the pipeline').toEqual([]);
    // And the files it would have to be registered in are real files we read.
    expect(SOURCES.get('src/generators/steps/index.js')).toContain('registerStep');
  });

  test('scan 4 — the LEGACY activation seam is deliberately KEPT (old saves still open)', () => {
    const seam = join(SRC, 'domain/worldPulse/latentPantheon.js');
    expect(existsSync(seam), 'the legacy activation seam must not be deleted').toBe(true);
    const text = SOURCES.get('src/domain/worldPulse/latentPantheon.js');
    expect(text).toContain('export function activateLatentPantheon');
    expect(text).toContain('export function latentPantheonOf');
    // The seam is a READER of persisted data, never a producer: it must not draw
    // randomness or reach for a pool of its own.
    expect(text).not.toContain('registerStep');   // anchored: seam text asserted present above
  });
});
