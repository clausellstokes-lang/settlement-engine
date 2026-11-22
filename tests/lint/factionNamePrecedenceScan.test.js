/**
 * tests/lint/factionNamePrecedenceScan.test.js — THE FACTION-KEY PRECEDENCE GUARD.
 *
 * THE RULE. A `powerStructure.factions[]` record's canonical display name lives in
 * `.faction`; `.name` is a legacy alias some records also carry (addFaction mints BOTH).
 * The canonical accessor is `nameOf` in src/domain/rulingPower.js, whose precedence is
 * `.faction || .name` — pinned by commit dc0b6e2b. Every consumer must read in that
 * order, or it keys/joins/dedups/slugs on a stale alias.
 *
 * WHY A SOURCE SCAN AND NOT JUST THE BEHAVIOURAL PINS. This class regrew by hand-rolling:
 * a census found EIGHTEEN independently written accessors, of which sixteen used the
 * reversed order, in files whose neighbours had it right (factionRoles.js had BOTH orders
 * two lines apart). Behavioural pins catch the sites they cover; only a scan stops the
 * NEXT hand-rolled accessor. The class's habitat is "any author writing the chain from
 * memory", so the guard has to meet them at CI.
 *
 * WHAT THIS SCANS FOR: the reversed `X.name || X.faction` ordering in `||`, `??` and
 * ternary forms, with dot / optional-chain / indexed / bracket-key receivers, across
 * BOTH the app (src/) and the Deno edge tree (supabase/functions/).
 * Cleared 2026-07-19 (was 25 sites across 12 files — 17 in src, 8 in the edge tree).
 *
 * NOT IN SCOPE — do not "fix" these, they are CORRECT:
 *   Top-level `settlement.factions[]` is a DIFFERENT record type (the NPC grouping list,
 *   carrying `.name`/`.dominantCategory`/`.powerFactionName`). Reading `.name` first is
 *   right there — e.g. SettlementDetailEditNames.jsx, SettlementsPanel.jsx,
 *   worldPulse/npcAgency.js, lib/instantWorld/factionDedup.js. Those sites do not carry a
 *   `.faction` fallback, so this scan's pattern cannot match them by construction.
 *
 * ACCEPTED BLIND SPOTS of a regex gate (verified by an adversarial pass, recorded here so
 * nobody mistakes the guard for total coverage):
 *   (a) NO-FALLBACK reads — `f.name` alone off a faction record — are only PARTIALLY
 *       caught. Scanning for a bare `.name` everywhere would false-positive on every
 *       unrelated record, but the NO-FALLBACK SCAN below (SS4, 2026-07-20) now catches
 *       the same-line spelling whose receiver chain literally names
 *       `powerStructure.factions` (direct index reads AND single-line map/find arrows).
 *       Receiver-alias forms (`const fs = s.powerStructure.factions; fs[0].name`) remain
 *       uncaught — hand-search those when auditing this class. ChroniclePanel.jsx (the
 *       last known site) was FIXED by the chronicle-snapshot work — it routes through
 *       nameOf now (see its snapshot-shape header + tests/ui/chronicleSnapshotShape
 *       .test.jsx); personaSlicer.js is fixed + pinned in the behavioural file.
 *   (b) Multi-statement forms (`if (e.name) return ...; if (e.faction) return ...`) are not
 *       matched. aiOverlayVerifier.js's entityKey was exactly this shape; it is fixed and
 *       carries an explanatory header, but a NEW one would slip past this scan.
 *   (c) Destructure-then-test (`const { name, faction } = f; name || faction`). Zero
 *       instances repo-wide at freeze time; re-check if that idiom appears.
 *   (d) A read split across statements or lines (`const n = f.name; ... n || f.faction`),
 *       and any read reached through a variable alias rather than a literal receiver.
 *   (e) NO-FALLBACK is still the biggest hole (see (a)). Two were found by hand this
 *       sweep — personaSlicer's roster and religionLegitimacy's rulerLens — and BOTH
 *       were unconditionally wrong on generator data rather than merely latent. If you
 *       are auditing this class again, hand-search `.name` reads on powerStructure
 *       faction records FIRST; the regex cannot help you there.
 * A guard that admits its gaps is trustworthy; one claiming completeness gets believed
 * past its coverage.
 *
 * Companion behavioural pins: tests/domain/factionNamePrecedence.test.js
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** A receiver expression: `f`, `e.entity`, `list[i]`, `a?.b`, `x["k"]` — the shapes a
 *  reversed read is actually written with. Kept deliberately permissive: the second
 *  half of each pattern still requires `.faction`, so over-matching the receiver
 *  cannot produce a false positive on unrelated `.name` reads. */
const RECV = String.raw`[A-Za-z_$][A-Za-z0-9_$]*(?:\s*\??\.\s*[A-Za-z_$][A-Za-z0-9_$]*|\s*\[[^\]]{1,40}\])*`;
/** `.faction` written as a dot access or a bracket key. */
const FACTION = String.raw`(?:\??\.\s*faction\b|\[\s*['"]faction['"]\s*\])`;

/** The reversed ordering: `||`, `??`, and ternary forms. */
const REVERSED = [
  new RegExp(String.raw`(?:\.name\b|\[\s*['"]name['"]\s*\])\s*\|\|\s*${RECV}\s*${FACTION}`, 'g'),
  new RegExp(String.raw`(?:\.name\b|\[\s*['"]name['"]\s*\])\s*\?\?\s*${RECV}\s*${FACTION}`, 'g'),
  // `f.name ? f.name : f.faction` — the ternary spelling of the same precedence.
  new RegExp(String.raw`\.name\b\s*\?[^:;\n]{0,60}:\s*${RECV}\s*${FACTION}`, 'g'),
];

/** Strip block + line comments so prose describing the rule is not itself an offender. */
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** SCOPE. `src` is the app; `supabase/functions` is the Deno edge tree, which reads the
 *  SAME powerStructure.factions records off the posted grounding payload and had EIGHT
 *  reversed sites of its own (generate-narrative/prompts.ts) that a src-only census
 *  missed entirely. `_shared` bundles are GENERATED (npm run build:edge-shared) — they
 *  are scanned too, because a stale bundle is exactly how a fixed src file ghosts on the
 *  server path, and their freshness test alone would not name this rule. */
const ROOTS = ['src/**/*.{js,jsx}', 'supabase/functions/**/*.{js,ts}'];

function scan() {
  const found = {};
  for (const abs of ROOTS.flatMap((g) => globSync(join(REPO, g)))) {
    const file = relative(REPO, abs).split(sep).join('/');
    const src = stripComments(readFileSync(abs, 'utf8'));
    const n = REVERSED.reduce((sum, re) => sum + (src.match(re)?.length ?? 0), 0);
    if (n > 0) found[file] = n;
  }
  return found;
}

/** Cleared 2026-07-19. Never re-add a row: a new site is a bug to fix in the same
 *  change, not an entry to append. Exact equality, so clearing stays a real milestone. */
const KNOWN_OFFENDERS = Object.freeze({});

describe('faction display-name precedence — .faction before .name (dc0b6e2b)', () => {
  it('the scan is non-vacuous — it catches every spelling it claims to', () => {
    // If a refactor made a pattern unmatchable, the guard would pass for the wrong
    // reason. Each spelling below MUST be caught; each control below must NOT be.
    const caught = [
      "const n = f.name || f.faction || '';",              // the plain form
      'const n = f?.name ?? f?.faction;',                  // optional chain + nullish
      'const n = e.entity.name || e.entity.faction;',      // nested receiver
      'const n = list[i].name || list[i].faction;',        // indexed receiver
      "const n = f.name || f['faction'];",                 // bracket key
      'const n = f.name ? f.name : f.faction;',            // ternary
    ];
    for (const sample of caught) {
      const hits = REVERSED.reduce((s, re) => s + (sample.match(re)?.length ?? 0), 0);
      expect(hits, `should be caught: ${sample}`).toBeGreaterThan(0);
    }

    const allowed = [
      "const n = f.faction || f.name || '';",              // the CANONICAL order
      'const n = f.name || f.label;',                      // unrelated .name read
      'const n = s.factions.map((x) => x.name);',          // top-level NPC grouping list
    ];
    for (const sample of allowed) {
      const hits = REVERSED.reduce((s, re) => s + (sample.match(re)?.length ?? 0), 0);
      expect(hits, `must NOT be flagged: ${sample}`).toBe(0);
    }
  });

  it('the canonical accessor itself still reads .faction first', () => {
    // The whole guard is measured against nameOf. If someone reorders ITS arms, the
    // rule this file enforces would be enforcing the wrong thing.
    const src = readFileSync(join(REPO, 'src/domain/rulingPower.js'), 'utf8');
    expect(src).toMatch(/faction\?\.faction\s*\|\|\s*faction\?\.name/);
  });

  it('no src file reads .name ahead of .faction', () => {
    const found = scan();
    const violations = [];
    for (const [file, count] of Object.entries(found)) {
      const ceiling = KNOWN_OFFENDERS[file] ?? 0;
      if (count > ceiling) {
        violations.push(
          `${file}: ${count} reversed faction-name read(s) found; ceiling is ${ceiling}.\n` +
          `  A powerStructure.factions record's canonical name is .faction — .name is a\n` +
          `  legacy alias, so ".name || .faction" silently picks the stale one (it only\n` +
          `  looks correct because generator records carry no .name today).\n` +
          `  FIX: use nameOf() from src/domain/rulingPower.js, or write ".faction || .name".\n` +
          `  Reading top-level settlement.factions (the NPC grouping list) instead? That's a\n` +
          `  different record type and .name-first is correct — but then drop the .faction\n` +
          `  fallback, which is what made this line match.\n` +
          `  There is no legal way to raise this ceiling.`,
        );
      }
    }
    expect(violations).toEqual([]);
  });

  it('inventory honesty: every frozen row still exists and still offends', () => {
    const found = scan();
    const stale = Object.entries(KNOWN_OFFENDERS)
      .filter(([file, ceiling]) => ceiling > 0 && !(found[file] > 0))
      .map(([file]) => `${file}: no longer offends — delete its row (never leave headroom).`);
    expect(stale).toEqual([]);
  });
});

// ── THE NO-FALLBACK SCAN (SS4) — blind spot (a)/(e) narrowed ─────────────────
// Both hand-found instances of this class (personaSlicer's roster,
// religionLegitimacy's rulerLens) were bare `.name` reads with NO `.faction`
// fallback — unconditionally wrong on generator data (those records carry
// `faction:`, no `name:`), and invisible to the reversed-order scan above.
// This scan catches the same-line spelling whose receiver chain literally names
// `powerStructure.factions`: direct reads (`s.powerStructure.factions[i].name`)
// and single-line callback arrows (`.factions.map(f => f.name)`). Lines that
// carry a `.faction` read (the legal fallback chain / canonical order) or route
// through nameOf( are excluded by construction.
// CANNOT-CATCH: receiver aliases (`const fs = ps.factions; fs[0].name`) and
// multi-line callbacks — hand-search those; see blind spots (a)/(d) above.
const NOFALLBACK_RE = new RegExp(
  String.raw`powerStructure\s*\??\.\s*factions\b[^;\n]*?(?:\.\s*name\b|\[\s*['"]name['"]\s*\])`,
);
const NOFALLBACK_LEGAL = /\.\s*faction\b|\[\s*['"]faction['"]\s*\]|nameOf\s*\(/;

function scanNoFallback() {
  const found = {};
  for (const abs of ROOTS.flatMap((g) => globSync(join(REPO, g)))) {
    const file = relative(REPO, abs).split(sep).join('/');
    const lines = stripComments(readFileSync(abs, 'utf8')).split('\n');
    const n = lines.filter((l) => NOFALLBACK_RE.test(l) && !NOFALLBACK_LEGAL.test(l)).length;
    if (n > 0) found[file] = n;
  }
  return found;
}

describe('faction NO-FALLBACK reads — bare .name off powerStructure.factions', () => {
  it('the scan is non-vacuous — catches the bare spellings, spares the legal ones', () => {
    const caught = [
      'const n = s.powerStructure.factions[0].name;',
      'const names = s.powerStructure?.factions.map(f => f.name);',
      "const n = s.powerStructure.factions.find(f => f.id === id)?.name || '';",
    ];
    for (const sample of caught) {
      expect(NOFALLBACK_RE.test(sample) && !NOFALLBACK_LEGAL.test(sample), `should be caught: ${sample}`).toBe(true);
    }
    const allowed = [
      'const n = nameOf(s.powerStructure.factions[0]);',                                  // canonical accessor
      'const n = s.powerStructure.factions[0].faction || s.powerStructure.factions[0].name;', // legal chain
      'const names = s.factions.map(x => x.name);',                                        // NPC grouping list
      'const c = s.powerStructure.conflicts[0];',                                          // unrelated read
    ];
    for (const sample of allowed) {
      expect(NOFALLBACK_RE.test(sample) && !NOFALLBACK_LEGAL.test(sample), `must NOT be flagged: ${sample}`).toBe(false);
    }
  });

  it('no bare powerStructure.factions .name read exists (cleared 2026-07-20; never re-add)', () => {
    const found = scanNoFallback();
    const violations = Object.entries(found).map(([file, count]) =>
      `${file}: ${count} bare .name read(s) off powerStructure.factions.\n` +
      `  Generator faction records carry .faction and NO .name key, so this read is\n` +
      `  undefined on real pipeline data (it only looks right on fixtures).\n` +
      `  FIX: use nameOf() from src/domain/rulingPower.js (canonical), or at minimum\n` +
      `  ".faction || .name". There is no legal way to add an offender here.`,
    );
    expect(violations).toEqual([]);
  });
});
