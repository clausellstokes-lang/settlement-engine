/**
 * tests/domain/guidanceRegistry.walker.test.js — THE GUIDANCE WALKER (W-GUIDE-1
 * §2). The structural-prevention machinery for the guidance layer: it makes a
 * whisper that resolves to nothing, a second whisper on a full surface, a
 * newborn hint shown to a veteran, or a new uncounted teaching component a RED
 * test — not a shipped regression.
 *
 * The battery (verbatim from the wave brief):
 *   • the walker BOTH directions — every id resolves to copy + a mounted surface;
 *     every instructional component is registered OR on the shrink-only legacy
 *     ledger, and the ledger carries no stale entry (covered ⊆ census).
 *   • the title= ratchet baseline — a census of native title= occurrences with a
 *     shrink-only baseline; a NEW instructional title fails.
 *   • the budget pin — a second whisper cannot render on a surface.
 *   • the firsts-backfill pin — a veteran sees no newborn hints.
 *   • the legacy-key migration pin — an old dismissal carries forward.
 *   • the register guard — every whisper is a known register; the plain register
 *     never wears the Surveyor's-notes costume (that is W-GUIDE-2's register).
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  GUIDANCE_WHISPERS,
  GUIDANCE_SURFACES,
  GUIDANCE_LANES,
  GUIDANCE_REGISTERS,
  GUIDANCE_BUDGET_CLASSES,
  GUIDANCE_REGISTRY,
  GUIDANCE_REGISTRY_LAZY_SENTINEL,
  LEGACY_GUIDANCE_COMPONENTS,
  LEGACY_GUIDANCE_CEILING,
  UNWIRED_WHISPERS,
  UNWIRED_WHISPERS_CEILING,
  whispersForSurface,
  isWhisperEligible,
  selectWhisper,
  registeredComponents,
} from '../../src/domain/display/guidanceRegistry.js';
import {
  isGuidanceDismissed,
  markGuidanceDismissed,
  guidanceDismissalKey,
} from '../../src/lib/guidance.js';
import { en } from '../../src/copy/en.js';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(REPO, 'src');

/** Resolve a dotted copy key against `en` directly (no t() DEV warnings). */
function resolveCopy(dottedKey) {
  let cur = /** @type {any} */ (en);
  for (const p of dottedKey.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[p];
  }
  return cur;
}

// ── (a) the walker, both directions ─────────────────────────────────────────

describe('guidance walker — every whisper resolves to copy + a mounted surface', () => {
  it('every whisper id is unique', () => {
    const ids = GUIDANCE_WHISPERS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every whisper body resolves to a non-empty copy string', () => {
    for (const w of GUIDANCE_WHISPERS) {
      const copy = resolveCopy(w.body);
      expect(typeof copy, `whisper ${w.id} body key ${w.body} must resolve to a string`).toBe('string');
      expect(String(copy).length, `whisper ${w.id} body copy is empty`).toBeGreaterThan(0);
    }
  });

  it('every whisper targets a declared (mounted) surface with a valid lane/register/budgetClass', () => {
    for (const w of GUIDANCE_WHISPERS) {
      expect(GUIDANCE_SURFACES, `whisper ${w.id} surface`).toContain(w.surface);
      expect(GUIDANCE_LANES, `whisper ${w.id} lane`).toContain(w.lane);
      expect(GUIDANCE_REGISTERS, `whisper ${w.id} register`).toContain(w.register);
      expect(GUIDANCE_BUDGET_CLASSES, `whisper ${w.id} budgetClass`).toContain(w.budgetClass);
    }
  });

  // ── the MOUNTED check (domain-region-dossier-guidance-2) ──────────────────
  // file-exists ≠ RENDERS. The old check only proved the host .jsx exists. This
  // content-scans each whisper's host for real guidance integration: the host must
  // IMPORT the guidance registry (or lib/guidance) AND reference a selection call
  // (selectWhisper / whisperById / whispersForSurface / GUIDANCE_REGISTRY / …) OR the
  // whisper's own id / body key / surface literal. A whisper whose host does neither
  // is UNWIRED — it must be on the UNWIRED_WHISPERS allowlist (which W-R2-SURFACE
  // empties as it wires each host), never silently green.
  const hostPathByName = (() => {
    const map = new Map();
    (function walk(dir) {
      for (const ent of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, ent.name);
        if (ent.isDirectory()) walk(p);
        else if (ent.name.endsWith('.jsx')) map.set(ent.name.replace(/\.jsx$/, ''), p);
      }
    })(join(SRC, 'components'));
    return map;
  })();
  const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const IMPORTS_GUIDANCE = /from ['"][^'"]*guidance(Registry)?(\.js)?['"]/;
  const SELECTION = /selectWhisper|whisperById|whispersForSurface|deriveGuidance|GUIDANCE_REGISTRY|isWhisperEligible/;
  function hostIsWired(w) {
    const host = hostPathByName.get(w.component);
    if (!host) return false;
    const src = stripComments(readFileSync(host, 'utf8'));
    if (!IMPORTS_GUIDANCE.test(src)) return false;
    return SELECTION.test(src) || src.includes(w.id) || src.includes(w.body) || src.includes(`'${w.surface}'`);
  }

  it('every whisper host component file exists on disk', () => {
    for (const comp of registeredComponents()) {
      expect(hostPathByName.has(comp), `host component ${comp} must exist as a .jsx file`).toBe(true);
    }
  });

  it('every whisper actually RENDERS via its host (guidance-integrated), or is on the UNWIRED allowlist', () => {
    const unwired = new Set(UNWIRED_WHISPERS);
    const silentlyDead = GUIDANCE_WHISPERS.filter((w) => !unwired.has(w.id) && !hostIsWired(w));
    expect(
      silentlyDead.map((w) => `${w.id} (host ${w.component})`),
      'whisper(s) whose host does not consume the guidance registry — wire the host (import + a selection call) ' +
        'or add the id to UNWIRED_WHISPERS (W-R2-SURFACE burns it down):',
    ).toEqual([]);
  });

  it('the UNWIRED allowlist carries no stale entry — every listed id is a real whisper AND genuinely unwired', () => {
    const byId = new Map(GUIDANCE_WHISPERS.map((w) => [w.id, w]));
    const stale = [];
    for (const id of UNWIRED_WHISPERS) {
      const w = byId.get(id);
      if (!w) { stale.push(`${id}: not a registered whisper (remove it)`); continue; }
      if (hostIsWired(w)) stale.push(`${id}: host ${w.component} IS now guidance-wired — remove it from UNWIRED_WHISPERS (SURFACE burn-down)`);
    }
    expect(stale).toEqual([]);
  });

  it('UNWIRED_WHISPERS never grows past its committed ceiling (shrink-only, SURFACE empties it)', () => {
    expect(UNWIRED_WHISPERS.length).toBeLessThanOrEqual(UNWIRED_WHISPERS_CEILING);
  });

  it('a whisper with a glossaryRef names a string anchor', () => {
    for (const w of GUIDANCE_WHISPERS) {
      if (w.glossaryRef != null) expect(typeof w.glossaryRef).toBe('string');
    }
  });
});

// ── (a′) the source census both directions ──────────────────────────────────

describe('guidance census — every instructional component is registered or on the shrink-only legacy ledger', () => {
  /**
   * Census of instructional-UI components (domain-region-dossier-guidance-2): WIDENED
   * from a filename-only regex (which missed most instructional components — an
   * instructional file need not be named *Coach/*Hint/*Popover) to a CONTENT scan.
   * A component is instructional if its NAME matches the teaching-suffix pattern OR
   * its SOURCE imports the guidance registry / lib guidance (i.e. it consumes the
   * guidance system). Both classes must be a registered host or on the legacy ledger.
   */
  function instructionalComponents() {
    const found = new Set();
    const nameRx = /(Coach|Tour|Callout|Hint|Popover)\.jsx$/;
    const importsGuidance = /from ['"][^'"]*(guidance(Registry)?|lib\/guidance)(\.js)?['"]/;
    (function walk(dir) {
      for (const ent of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, ent.name);
        if (ent.isDirectory()) { walk(p); continue; }
        if (!ent.name.endsWith('.jsx')) continue;
        const base = ent.name.replace(/\.jsx$/, '');
        if (nameRx.test(ent.name)) { found.add(base); continue; }
        if (importsGuidance.test(readFileSync(p, 'utf8'))) found.add(base);
      }
    })(join(SRC, 'components'));
    return [...found];
  }

  it('every instructional component found in source is registered OR on the legacy ledger', () => {
    const covered = new Set([...registeredComponents(), ...LEGACY_GUIDANCE_COMPONENTS]);
    const uncovered = instructionalComponents().filter((c) => !covered.has(c));
    expect(
      uncovered,
      `uncovered instructional components (register a whisper or add to LEGACY_GUIDANCE_COMPONENTS):\n  ${uncovered.join('\n  ')}`,
    ).toEqual([]);
  });

  it('the legacy ledger carries no stale entry — every legacy component still exists in source', () => {
    const stale = LEGACY_GUIDANCE_COMPONENTS.filter((c) => {
      let hit = false;
      (function walk(dir) {
        for (const ent of readdirSync(dir, { withFileTypes: true })) {
          const p = join(dir, ent.name);
          if (ent.isDirectory()) walk(p);
          else if (ent.name === `${c}.jsx`) hit = true;
        }
      })(join(SRC, 'components'));
      return !hit;
    });
    expect(stale, `stale legacy ledger entries (component deleted — drop from the ledger):\n  ${stale.join('\n  ')}`).toEqual([]);
  });

  it('the legacy ledger never grows past its committed ceiling (shrink-only)', () => {
    expect(LEGACY_GUIDANCE_COMPONENTS.length).toBeLessThanOrEqual(LEGACY_GUIDANCE_CEILING);
  });

  it('no component is both registered and legacy', () => {
    const reg = new Set(registeredComponents());
    const both = LEGACY_GUIDANCE_COMPONENTS.filter((c) => reg.has(c));
    expect(both).toEqual([]);
  });
});

// ── (b) the title= ratchet baseline ─────────────────────────────────────────

describe('title= ratchet — native OS tooltips are a shrink-only census', () => {
  // Seeded at 476 on 2026-07-15 (161 `title={` + 315 `title="`). The ~340 native
  // title= tooltips are the largest uncounted instructional layer (§1); they
  // migrate to the glossary affordance over waves. This baseline only ever moves
  // DOWN — a NEW instructional title fails here.
  //
  // W-GUIDE-2 tranche 1 RATCHETED it 476 → 471: the HealthPip stability-band
  // title migrated to the "what am I reading?" glossary affordance (SurveyorGlossary),
  // and two WorldMapToolbar <select> titles that merely DUPLICATED their aria-label
  // were dropped (redundant tooltip, no a11y loss). The remaining LivingWorldGates
  // + WorldMapToolbar teaching titles are DEFERRED (documented): they sit on
  // text-bearing controls where an aria-label swap would clobber the accessible
  // name, so each needs per-title glossary-affordance wiring or inline-help — a
  // larger careful pass, not a mechanical swap.
  // MASTER MERGE W6 RE-BASELINE 471 → 502 (the one sanctioned non-shrink move):
  // the merge imported master-lineage surface carrying its own native titles —
  // per-file delta verified against the RF tip (8c430c5b): UnderTheHoodTab +14,
  // CampaignStatePanel +7, GalleryMapsSidebar +6, EngineSections +4, plus seven
  // merge-resolved +1/+2 files, and −9 from the deleted CausalViewTabs. Every
  // added title is CARRIED master surface, none newly authored. Shrink-only
  // resumes from 502 — glossary-affordance migration continues over waves.
  // GUIDE-2b DEEP TITLE TRANCHE 502 → 500: LivingWorldGates' two native title=
  // OS tooltips (the SpatialCanonGate button teaching + the per-gate description
  // on the toggle label) migrated onto the study's own cloth — an in-theme "?"
  // help panel (LivingWorldGates.jsx, comprehension-first + mobile-reachable,
  // where a hover title was neither). The button keeps a clean aria-label (no
  // title=); the deferred WorldMapToolbar tranche stays on the map-coordinated
  // pass (SM-4's display lane). Shrink-only resumes from 500.
  // MAP-TITLE TRANCHE 500 → 485 (SM-4 has landed; the map lane is clear): the
  // WorldMapToolbar's teaching titles migrated to an in-theme "?" control-
  // reference panel (WorldMapToolbar.jsx MapControlsHelp, the GUIDE-2b house
  // pattern — role=note, comprehension-first, mobile-reachable). 15 of the file's
  // 16 native title= tooltips left the census: 13 teaching/restatement tooltips
  // migrated to the panel, the dormant ResumeChip's dropped (its aria-label
  // already carried the copy), and the Inspector's migrated to aria-label (it
  // carries the dynamic unreviewed-pulse count — the badge is aria-hidden, so the
  // announcement had to be preserved, not dropped). The ONE title left is Undo
  // Advance: it folds in the last advance's interval + is pinned by
  // advanceMultiTickToolbar.test.jsx (Stage-5), so it keeps its native title.
  // Shrink-only resumes from 485.
  const TITLE_BASELINE = 485;

  function countTitles() {
    let n = 0;
    const rx = /title=(\{|")/g;
    (function walk(dir) {
      for (const ent of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, ent.name);
        if (ent.isDirectory()) walk(p);
        else if (ent.name.endsWith('.jsx') || ent.name.endsWith('.js')) {
          const src = readFileSync(p, 'utf8');
          const m = src.match(rx);
          if (m) n += m.length;
        }
      }
    })(SRC);
    return n;
  }

  it(`the src title= count stays at or below the shrink-only baseline (${TITLE_BASELINE})`, () => {
    const count = countTitles();
    expect(
      count,
      `title= census = ${count} (baseline ${TITLE_BASELINE}). A new native title= tooltip was added — route it through the glossary affordance instead, or (if a migration removed some) lower the baseline.`,
    ).toBeLessThanOrEqual(TITLE_BASELINE);
  });
});

// ── (c) the budget pin ──────────────────────────────────────────────────────

describe('budget pin — one whisper per surface, ever', () => {
  // A newborn on a fresh first dossier: every dossier whisper is eligible.
  const newbornDossierCtx = {
    isDismissed: () => false,
    firstAvailable: () => true,
    isNewborn: true,
    data: { tier: 'free', savedCount: 0 },
  };

  it('the dossier surface has 2+ simultaneously-eligible whispers', () => {
    const eligible = whispersForSurface('dossier').filter((w) => isWhisperEligible(w, newbornDossierCtx));
    expect(eligible.length).toBeGreaterThanOrEqual(2);
  });

  it('selectWhisper returns exactly ONE — the highest priority — never the rest', () => {
    const picked = selectWhisper('dossier', newbornDossierCtx);
    expect(picked).not.toBeNull();
    const eligible = whispersForSurface('dossier').filter((w) => isWhisperEligible(w, newbornDossierCtx));
    const maxPriority = Math.max(...eligible.map((w) => w.priority));
    expect(picked.priority).toBe(maxPriority);
    // A second whisper cannot also be returned: selectWhisper's contract is a
    // single object (or null), never a list.
    expect(Array.isArray(picked)).toBe(false);
  });
});

// ── (d) the firsts-backfill pin ─────────────────────────────────────────────

describe('firsts-backfill pin — a veteran sees no newborn hints', () => {
  // A veteran: NOT newborn, every first behind them, nothing dismissed.
  const veteranCtx = {
    isDismissed: () => false,
    firstAvailable: () => true,
    isNewborn: false,
    data: { tier: 'free', savedCount: 5, hasSettlement: true, isReturn: true, hasLastSettlement: true },
  };

  it('no newbornOnly whisper is eligible for a veteran', () => {
    for (const w of GUIDANCE_WHISPERS.filter((x) => x.newbornOnly)) {
      expect(isWhisperEligible(w, veteranCtx), `newborn whisper ${w.id} leaked to a veteran`).toBe(false);
    }
  });

  it('the dossier teaching band does not render for a veteran', () => {
    expect(selectWhisper('dossier', veteranCtx)).toBeNull();
  });
});

// ── (e) the legacy-key migration pin ────────────────────────────────────────

describe('legacy-key migration pin — an old dismissal carries forward', () => {
  // A Map-backed localStorage stub so the pin runs env-independent (node OR jsdom).
  beforeEach(() => {
    const store = new Map();
    // @ts-expect-error test stub
    globalThis.localStorage = {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    };
  });

  it('a legacy anyOf key (PostGenCoach timestamp) migrates to the unified whisper key', () => {
    localStorage.setItem('sf.postGenCoachDismissedAt', String(Date.now()));
    expect(isGuidanceDismissed('postgen_read_dossier')).toBe(true);
    // read-once: the unified key is now stamped.
    expect(localStorage.getItem(guidanceDismissalKey('postgen_read_dossier'))).toBe('1');
  });

  it('a legacy allOf band (three callout keys) migrates only when ALL are dismissed', () => {
    localStorage.setItem('sf:dismissed_callouts:tension', '1');
    localStorage.setItem('sf:dismissed_callouts:supply', '1');
    // Not yet — hook is still open.
    expect(isGuidanceDismissed('dossier_first_callouts')).toBe(false);
    localStorage.setItem('sf:dismissed_callouts:hook', '1');
    expect(isGuidanceDismissed('dossier_first_callouts')).toBe(true);
  });

  it('markGuidanceDismissed then isGuidanceDismissed round-trips', () => {
    expect(isGuidanceDismissed('wizard_next_steps')).toBe(false);
    markGuidanceDismissed('wizard_next_steps');
    expect(isGuidanceDismissed('wizard_next_steps')).toBe(true);
  });
});

// ── (f) the register guard (the two-register voice law) ─────────────────────

describe('register guard — the two registers stay in their lanes', () => {
  // W-GUIDE-2 lit the note register (the Surveyor's persona). Both registers are
  // valid now (the surface/lane/register validity is pinned in the (a) test); the
  // guard enforces that each stays in its lane: note whispers bind to the notes
  // register; the plain register never borrows the persona.
  it('every note-register whisper binds to the guidance.notes.* register', () => {
    for (const w of GUIDANCE_WHISPERS.filter((x) => x.register === 'note')) {
      expect(
        w.body.startsWith('guidance.notes.'),
        `note whisper ${w.id} body ${w.body} must be a guidance.notes.* key (the register binding)`,
      ).toBe(true);
    }
  });

  it('no PLAIN-register body carries the Surveyor persona (the — S. signature or the notes eyebrow)', () => {
    for (const w of GUIDANCE_WHISPERS.filter((x) => x.register === 'plain')) {
      const copy = String(resolveCopy(w.body) || '');
      expect(copy, `plain whisper ${w.id} carries a persona sign-off`).not.toMatch(/—\s*S\.?$/);
      expect(copy.toUpperCase(), `plain whisper ${w.id} carries the notes eyebrow`).not.toContain('A NOTE FROM THE SURVEYOR');
    }
  });
});

// ── (g) the sentinel is a live property (non-vacuity at the source level) ────

describe('lazy-leaf sentinel is non-vacuous', () => {
  it('the sentinel rides the retained registry object (not a dead standalone export)', () => {
    // If this were only a standalone `export const`, Rollup would tree-shake it
    // out of the app bundle (the AFFORDANCE sentinel's fate) and the dist guard
    // would go vacuous. Embedding it in the retained object keeps it in the chunk.
    expect(GUIDANCE_REGISTRY.sentinel).toBe(GUIDANCE_REGISTRY_LAZY_SENTINEL);
    expect(GUIDANCE_REGISTRY.whispers).toBe(GUIDANCE_WHISPERS);
  });
});
