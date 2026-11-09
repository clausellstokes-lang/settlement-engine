/**
 * THE PUBLIC PROSE LEAF'S RULES (STYLE-RULINGS-2 B10(a); lane SW-B7b PROJECTION, the chair's
 * shape ruling of 13:0x). `src/domain/display/publicProse.js` is the one reader of
 * `data.publicProse`; every desk's public branch turns its null into SILENT.
 *
 * RULE 1: an ABSENT projection (a save not yet re-published) reads null, never a re-draw.
 * RULE 2: a mismatched version reads null.
 * And the key names survive the public projection (`toPublicSafe` keeps the denylist on deeper
 * keys, so a site key that carried a PRIVATE_KEY_RE token would be stripped on the way out).
 */
import { describe, it, expect } from 'vitest';
import {
  PUBLIC_PROSE_VERSION, aliasRepeatedRungs, publicProseOf, shippedProseOf, withPublicProse,
} from '../../src/domain/display/publicProse.js';
import { composePublicProse, PUBLIC_PROSE_SITES } from '../../src/components/new/publicProseCompose.js';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';

const desk = { glance: 'Struggling', sentence: 'The thorp is poor.', detail: [{ label: 'Economy', value: 'Subsistence' }] };

describe('publicProseOf — the two fail-closed rules', () => {
  it('RULE 1: an absent projection reads null at every site', () => {
    expect(publicProseOf({ name: 'Lundey' }, 'economy:economics')).toBeNull();
    expect(publicProseOf(null, 'economy:economics')).toBeNull();
    expect(publicProseOf({ publicProse: null }, 'economy:economics')).toBeNull();
  });

  it('RULE 2: a mismatched version reads null', () => {
    const r = { publicProse: { v: 'pp-0', blocks: { 'economy:economics': desk } } };
    expect(publicProseOf(r, 'economy:economics')).toBeNull();
    expect(publicProseOf({ publicProse: { blocks: { 'economy:economics': desk } } }, 'economy:economics')).toBeNull();
  });

  it('the stamped version reads the shipped site, and an unshipped site reads null', () => {
    const r = { publicProse: { v: PUBLIC_PROSE_VERSION, blocks: { 'economy:economics': desk } } };
    expect(publicProseOf(r, 'economy:economics')).toEqual(desk);
    expect(publicProseOf(r, 'economy:services')).toBeNull();
  });
});

describe('shippedProseOf — the text, never the recorder\'s provenance', () => {
  it('drops provenance, functions and undefined at every depth', () => {
    const drawn = Object.freeze({
      a: Object.freeze({ ...desk, provenance: { blockId: 'DS-ECO-1', poolKey: 'k' } }),
      b: null,
      c: [Object.freeze({ sentence: 's', provenance: {} }), null, undefined],
      d: undefined,
      e: () => 1,
    });
    expect(shippedProseOf(drawn)).toEqual({ a: desk, b: null, c: [{ sentence: 's' }, null, null] });
  });
});

describe('withPublicProse — the save never fails on the projection', () => {
  it('a null projection leaves the record as it was', () => {
    const r = { name: 'x' };
    expect(withPublicProse(r, null)).toBe(r);
    expect(withPublicProse(null, { v: 1, blocks: {} })).toBeNull();
  });
  it('writes the projection without touching the rest', () => {
    const p = { v: PUBLIC_PROSE_VERSION, blocks: {} };
    expect(withPublicProse({ name: 'x' }, p)).toEqual({ name: 'x', publicProse: p });
  });
});

describe('the composer', () => {
  it('composes a versioned projection on an owner record, null without one', () => {
    expect(composePublicProse(null)).toBeNull();
    const p = composePublicProse({ name: 'x', _seed: 's' });
    expect(p?.v).toBe(PUBLIC_PROSE_VERSION);
    expect(Object.keys(p ?? {})).toEqual(['v', 'blocks']); // the seed has no key to ride
  });

  it('every registered site key survives the public projection', () => {
    const sites = PUBLIC_PROSE_SITES.map(([site]) => site);
    const blocks = Object.fromEntries(sites.map((site) => [site, desk]));
    const projected = toPublicSafe({ name: 'x', publicProse: { v: PUBLIC_PROSE_VERSION, blocks } });
    expect(projected.publicProse).toEqual({ v: PUBLIC_PROSE_VERSION, blocks });
  });
});

describe('the alias: a rung drawn identically at an earlier site is stored once', () => {
  it('aliasRepeatedRungs + publicProseOf round-trip every site exactly', () => {
    const other = { sentence: 'Other.' };
    const blocks = { 'economy:economics': { a: desk, b: other }, 'economy:services': { a: desk, b: null }, 'economy:resources': { a: { sentence: 'New.' }, b: other } };
    const stored = aliasRepeatedRungs(blocks);
    expect(stored['economy:services'].a).toEqual({ '@': 'economy:economics' });
    expect(stored['economy:resources'].b).toEqual({ '@': 'economy:economics' });
    const r = { publicProse: { v: PUBLIC_PROSE_VERSION, blocks: stored } };
    for (const site of Object.keys(blocks)) expect(publicProseOf(r, site)).toEqual(blocks[site]);
  });
  it('an alias to a site the record does not carry reads null, never another rung', () => {
    const r = { publicProse: { v: PUBLIC_PROSE_VERSION, blocks: { 'economy:services': { a: { '@': 'economy:economics' } } } } };
    expect(publicProseOf(r, 'economy:services')).toEqual({ a: null });
  });
});
