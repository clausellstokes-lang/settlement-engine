/**
 * tests/joins/fieldManifest.test.js — Wave 8 structural prevention: the
 * manifest walker.
 *
 * Walks the two field manifests in src/domain/fieldManifest.js and enforces
 * both directions with comment-stripped source scans (the
 * neighbourRelDynamics CONSUMER_FILES / regionalChannelCreatable UNCREATABLE
 * idiom):
 *
 *   FROZEN-VS-LIVE — every 'live' entry's named pulse writer still exists
 *   AND still writes the field (the disaster-freeze class becomes a failing
 *   unit test); every 'snapshot' entry's guards hold at the declared display
 *   sites (a snapshot can never again be silently preferred over its live
 *   sibling — the magicTradeChannel verdict-first pattern is banned at its
 *   one consumer).
 *
 *   PRODUCER/CONSUMER — every registered engine-written field is still
 *   written by its producer (no read-without-writer) and still read by
 *   EVERY listed consumer (a dead write, or a stale consumer list, fails
 *   here instead of surviving to the next audit). Tombstoned dead fields
 *   stay deleted.
 *
 * HONEST LIMIT (also recorded in the manifest header): unlisted fields
 * cannot be auto-detected. This test makes the LISTED contracts unbreakable;
 * new field families must add rows in the change that introduces them.
 */

import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  FROZEN_VS_LIVE,
  ENGINE_FIELD_REGISTRY,
  REMOVED_DEAD_FIELDS,
} from '../../src/domain/fieldManifest.js';
import { deriveLocalDelta } from '../../src/domain/region/deriveRegionalState.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

const sourceCache = new Map();
function readStripped(file) {
  if (!sourceCache.has(file)) {
    sourceCache.set(file, stripComments(fs.readFileSync(path.join(ROOT, file), 'utf8')));
  }
  return sourceCache.get(file);
}

// Default probes (entries override for shorthand writes etc.):
//   write — `field:` as an object-literal property (not preceded by a dot,
//           word char, or quote/backtick: rules out reads, longer names,
//           and string keys in template literals);
//   read  — `.field` property access (covers `obj.field` and `obj?.field`).
const writeProbeFor = (field) => `(?<![.\\w'"\`])${field}\\s*:`;
const readProbeFor = (field) => `\\.${field}\\b`;

// ── Manifest 1: frozen-vs-live ─────────────────────────────────────────────

describe('frozen-vs-live manifest (Wave 8 #2)', () => {
  test('manifest shape: modes are live|snapshot, pulseWriter coherent, paths unique', () => {
    const paths = FROZEN_VS_LIVE.map(e => e.path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const entry of FROZEN_VS_LIVE) {
      expect(['live', 'snapshot'], `${entry.path}: unknown mode '${entry.mode}'`).toContain(entry.mode);
      if (entry.mode === 'live') {
        expect(entry.pulseWriter, `${entry.path}: live entries must name a 'file#fn' writer`).toMatch(/^.+#.+$/);
        expect(typeof entry.field, `${entry.path}: live entries must name the written field`).toBe('string');
      } else {
        expect(entry.pulseWriter, `${entry.path}: snapshot entries carry no pulse writer`).toBeNull();
      }
    }
  });

  const liveEntries = FROZEN_VS_LIVE.filter(e => e.mode === 'live');

  test.each(liveEntries.map(e => [e.path, e]))(
    "live '%s': the named pulse writer exists and still writes the field",
    (_path, entry) => {
      const [file, fn] = entry.pulseWriter.split('#');
      expect(fs.existsSync(path.join(ROOT, file)), `${file} is gone`).toBe(true);
      const src = readStripped(file);
      // The declared writer FUNCTION still exists…
      expect(
        new RegExp(`function\\s+${fn}\\b`).test(src),
        `${file} no longer defines ${fn}() — re-point the manifest at the real writer`,
      ).toBe(true);
      // …and the file still writes the declared field. If this fails, the
      // pulse stopped keeping a declared-live field true: that is the
      // disaster-freeze bug class, caught at the unit-test gate.
      const probe = new RegExp(entry.writeProbe || writeProbeFor(entry.field), 'm');
      expect(
        probe.test(src),
        `${entry.path}: ${entry.pulseWriter} no longer writes '${entry.field}' — the field is freezing`,
      ).toBe(true);
    },
  );

  const guarded = FROZEN_VS_LIVE.filter(e => (e.guards || []).length > 0);

  test.each(guarded.map(e => [e.path, e]))(
    "guards for '%s' hold at the declared display sites",
    (_path, entry) => {
      for (const guard of entry.guards) {
        const src = readStripped(guard.file);
        if (guard.mustMatch) {
          expect(
            new RegExp(guard.mustMatch, 'm').test(src),
            `${guard.file}: required pattern gone (${guard.why})`,
          ).toBe(true);
        }
        if (guard.mustNotMatch) {
          expect(
            new RegExp(guard.mustNotMatch, 'm').test(src),
            `${guard.file}: banned preference pattern is back (${guard.why})`,
          ).toBe(false);
        }
      }
    },
  );

  test('every snapshot entry documents its display rule (the contract is the data)', () => {
    for (const entry of FROZEN_VS_LIVE.filter(e => e.mode === 'snapshot')) {
      expect(typeof entry.displayRule, `${entry.path}: snapshot without a display rule`).toBe('string');
      expect(entry.displayRule.length).toBeGreaterThan(20);
    }
  });
});

// ── Manifest 2: producer/consumer registry ─────────────────────────────────

describe('producer/consumer registry (Wave 8 #3 — dead-field CI)', () => {
  test('registry shape: fields unique, files exist', () => {
    const fields = ENGINE_FIELD_REGISTRY.map(e => e.field);
    expect(new Set(fields).size).toBe(fields.length);
    for (const entry of ENGINE_FIELD_REGISTRY) {
      expect(fs.existsSync(path.join(ROOT, entry.producer)), `${entry.field}: producer ${entry.producer} is gone`).toBe(true);
      expect(entry.consumers.length, `${entry.field}: registered with no consumers`).toBeGreaterThan(0);
      for (const consumer of entry.consumers) {
        expect(fs.existsSync(path.join(ROOT, consumer)), `${entry.field}: consumer ${consumer} is gone`).toBe(true);
      }
    }
  });

  test.each(ENGINE_FIELD_REGISTRY.map(e => [e.field, e]))(
    "'%s' is still written by its producer (no read-without-writer)",
    (_field, entry) => {
      const probe = new RegExp(
        entry.producerProbe || `${writeProbeFor(entry.field)}|\\.${entry.field}\\s*=[^=]`,
        'm',
      );
      expect(
        probe.test(readStripped(entry.producer)),
        `${entry.field}: ${entry.producer} no longer writes it — consumers read a ghost`,
      ).toBe(true);
    },
  );

  test.each(ENGINE_FIELD_REGISTRY.map(e => [e.field, e]))(
    "'%s' is still read by EVERY listed consumer (no dead write, no stale list)",
    (_field, entry) => {
      const probe = new RegExp(entry.readProbe || readProbeFor(entry.field), 'm');
      for (const consumer of entry.consumers) {
        expect(
          probe.test(readStripped(consumer)),
          `${entry.field}: ${consumer} no longer reads it — drop it from the list or restore the read; `
          + 'a field with zero readers is the dead-write class this registry exists to catch',
        ).toBe(true);
      }
    },
  );
});

// ── Tombstones: removed dead writes stay removed ───────────────────────────

describe('removed dead fields stay removed', () => {
  test.each(REMOVED_DEAD_FIELDS.map(e => [e.field, e]))(
    "'%s' does not return to its file without a reader",
    (_field, entry) => {
      expect(
        readStripped(entry.file).includes(entry.field),
        `${entry.file} writes ${entry.field} again (${entry.removed}) — if deliberate, `
        + 'register it in ENGINE_FIELD_REGISTRY with a real consumer instead',
      ).toBe(false);
    },
  );

  test('deriveLocalDelta no longer emits hasRegionalSignal (runtime confirmation)', () => {
    const save = { id: 'a', settlement: { id: 'a', name: 'Ashford', tier: 'town', population: 1000 } };
    const delta = deriveLocalDelta(save, save, { reason: 'manifest-probe' });
    expect(Array.isArray(delta.changes)).toBe(true);
    expect('hasRegionalSignal' in delta).toBe(false);
  });
});
