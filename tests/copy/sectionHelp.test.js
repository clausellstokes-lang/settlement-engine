/**
 * sectionHelp.test.js — THE ? PILLS' WORDS, HELD TO THE OWNER'S RULE (X-42, 2026-11-02):
 * "at most 1 to 2 sentences per pill", "simple direct language", "nothing specific to the
 * settlement", "don't make it meta", "only the bare minimum of pills needed".
 *
 * Four arms: the shape of every entry (two sentences at most, no digit, no em dash, no word
 * for the page, the tab or the section itself); the count (the bare minimum is the nine the
 * owner saw listed, and a tenth is a decision, not a drift); every entry worn by exactly one
 * header in src; the Systems Health vintage shared with the document's chapter.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SECTION_HELP, SYSTEMS_HEALTH_VINTAGE } from '../../src/copy/sectionHelp.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const META_WORDS = /\b(this (section|page|tab|panel|card)|the (section|page|tab) (shows|explains|lists)|click|tap|hover|below|above)\b/i;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.jsx?$/.test(entry)) out.push(p);
  }
  return out;
}

describe('the ? pills say one plain thing each', () => {
  const entries = Object.entries(SECTION_HELP);

  it('holds the nine the owner saw listed, no more and no fewer', () => {
    expect(entries.map(([k]) => k).sort()).toEqual([
      'foundations', 'institutions', 'npcs', 'relationships', 'rulers', 'services', 'supplyChains', 'systemsHealth', 'tensions',
    ]);
  });

  for (const [key, text] of entries) {
    it(`${key}: at most two sentences, no digit, no em dash, nothing about the page itself`, () => {
      expect(typeof text).toBe('string');
      expect(text.trim().length).toBeGreaterThan(12);
      const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
      expect(sentences.length, text).toBeLessThanOrEqual(2);
      expect(/[0-9]/.test(text), `a digit in: ${text}`).toBe(false);
      expect(text.includes('—'), `an em dash in: ${text}`).toBe(false);
      expect(META_WORDS.test(text), `a word about the page in: ${text}`).toBe(false);
      expect(/[.!?]$/.test(text.trim()), `no terminal stop: ${text}`).toBe(true);
    });
  }

  it('every entry is worn by exactly one header in src, and no header wears an unknown key', () => {
    const uses = new Map(entries.map(([k]) => [k, 0]));
    const unknown = [];
    for (const file of walk(join(ROOT, 'src'))) {
      const src = readFileSync(file, 'utf8');
      for (const m of src.matchAll(/SECTION_HELP\.([A-Za-z]+)/g)) {
        if (uses.has(m[1])) uses.set(m[1], uses.get(m[1]) + 1);
        else unknown.push(`${file}: ${m[1]}`);
      }
    }
    expect(unknown).toEqual([]);
    expect([...uses.entries()].filter(([, n]) => n !== 1)).toEqual([]);
  });

  it('the Systems Health pill carries the vintage sentence the document prints (the G5 twin)', () => {
    expect(SECTION_HELP.systemsHealth.endsWith(SYSTEMS_HEALTH_VINTAGE)).toBe(true);
    expect(readFileSync(join(ROOT, 'src/pdf/sections/Overview.jsx'), 'utf8')).toContain('SYSTEMS_HEALTH_VINTAGE');
  });
});
