/**
 * npcFacetConsumer.walker.test.js — THE FACET-CONSUMER WALKER (DESIGN_NPC_LIFECYCLE
 * §4 + §5). The structural-prevention guard that makes the no-dead-facet law
 * enforceable: a bank facet without a declared generation source OR a registered,
 * REAL consumer FAILS THE BUILD.
 *
 * Modeled on tests/store/operationRegistry.walker.test.js (forward / reverse /
 * shrink-only ceiling) plus the guidance whisper-census technique of CONTENT-SCANNING
 * the host file to prove the read is real, not merely declared ("file-exists ≠ reads").
 *
 * DENOMINATOR = NPC_FACET_KINDS (the bank's editable attributes). COVERED = the
 * manifest's registered facets ∪ the exempt-with-reason set. Every facet must be
 * covered; every covered facet must be a real bank kind (no stale entries); and every
 * registered facet's source + consumer tokens must actually appear in their files.
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { NPC_FACET_KINDS } from '../../../src/domain/npc/npcBank.js';
import {
  NPC_FACET_REGISTRY, EXEMPT_FACETS, FACET_EXEMPT_CEILING,
  registeredFacetKinds, exemptFacetKinds,
} from '../../../src/domain/npc/npcFacets.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const fileText = (rel) => readFileSync(join(REPO_ROOT, rel), 'utf8');

describe('THE FACET-CONSUMER WALKER (no-dead-facet law)', () => {
  const registered = registeredFacetKinds();
  const exempt = exemptFacetKinds();
  const covered = new Set([...registered, ...exempt]);

  test('the denominator is the full bank facet vocabulary (scanner did not silently break)', () => {
    expect(NPC_FACET_KINDS.length).toBeGreaterThan(0);
  });

  test('every bank facet is covered — registered with a source+consumer OR exempt-with-reason', () => {
    // A NEW bank facet that ships without wiring lands here. Register it in
    // NPC_FACET_REGISTRY (with a source + ≥1 real consumer) or, if it is a
    // pre-existing dead facet, add it to EXEMPT_FACETS with a reason.
    const uncovered = [...NPC_FACET_KINDS].filter((k) => !covered.has(k));
    expect(uncovered).toEqual([]);
  });

  test('the manifest carries NO stale entries — every covered facet is a real bank kind', () => {
    const kinds = new Set(NPC_FACET_KINDS);
    const stale = [...covered].filter((k) => !kinds.has(k)).sort();
    expect(stale).toEqual([]);
  });

  test('no facet is BOTH registered and exempt', () => {
    const both = registered.filter((k) => exempt.includes(k)).sort();
    expect(both).toEqual([]);
  });

  test('(a) GENERATION READS THE WORLD — every facet has a source whose token is present', () => {
    for (const [kind, spec] of Object.entries(NPC_FACET_REGISTRY)) {
      const src = spec.source;
      expect(src && src.file && src.token, `${kind}: missing source`).toBeTruthy();
      expect(existsSync(join(REPO_ROOT, src.file)), `${kind}: source file ${src.file} absent`).toBe(true);
      expect(
        fileText(src.file).includes(src.token),
        `${kind}: source token "${src.token}" not found in ${src.file}`,
      ).toBe(true);
    }
  });

  test('(b) THE WORLD READS EVERY FACET — each has ≥1 registered consumer whose token is REALLY present', () => {
    for (const [kind, spec] of Object.entries(NPC_FACET_REGISTRY)) {
      expect(Array.isArray(spec.consumers) && spec.consumers.length >= 1, `${kind}: no consumers`).toBe(true);
      for (const c of spec.consumers) {
        expect(existsSync(join(REPO_ROOT, c.file)), `${kind}: consumer file ${c.file} absent`).toBe(true);
        expect(
          fileText(c.file).includes(c.token),
          `${kind}: consumer token "${c.token}" not found in ${c.file} — a dead facet (declared consumer that does not read it)`,
        ).toBe(true);
      }
    }
  });

  test('the exempt list never grows past its committed ceiling (shrink-only)', () => {
    expect(exempt.length).toBeLessThanOrEqual(FACET_EXEMPT_CEILING);
  });
});
