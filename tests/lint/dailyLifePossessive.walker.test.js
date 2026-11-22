/**
 * tests/lint/dailyLifePossessive.walker.test.js — DAILY-4 · D4C-1 unit (3), NO "'s" ON A POWER'S OR THE GOVERNMENT'S
 * NAME (the chair's E133 (3); the brief `docs/chair/2026-11-20/content/daily/briefs/D4C-1-REPEAT-AND-POSSESSIVE.md`).
 *
 * The owner saw "Outsiders notice the Headman's Authority's mark is on every door that matters." (D4C's measure, table 3:
 * 99 sentences of 900 places put "'s" on a power's name, four of them on a name that already holds one). A power's or the
 * government's name is the record's own words, and it may itself end in a possessive ("Headman's Authority", "People's
 * Council"), so no Daily Life wording appends one: it says "the mark of {power}", never "{power's} mark" or "{gov}'s".
 *
 * THE WALKER reads every pool file under `src/data/dailyLife/` (the directory listed, each module imported, every exported
 * table walked for its `text` strings) and fails on any template that puts "'s" (or a bare "'") after a power or
 * government placeholder (`{power}`, `{Power}`, `{gov}`, their agreement forms `{power|…}`), or a filler that carries it
 * (`{power's}`). Self-planting: the predicate is run on planted wordings, the bad reddening and the good passing.
 */
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, it, expect, beforeAll } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DIR = 'src/data/dailyLife';

/** A power's or the government's placeholder, any form: `{power}`, `{Power}`, `{gov}`, `{power|has|have}`. */
const NAME = String.raw`(?:power|Power|gov|Gov|government|Government)`;
/** "'s" (or a bare "'") after the placeholder, or inside it as its filler. */
const POSSESSIVE = new RegExp(String.raw`\{${NAME}(?:\|[^{}]*)?\}['’]|\{${NAME}['’]s?\}`);

/** @param {string} text @returns {boolean} the template puts a possessive on a power's or the government's name */
const possessesPower =(text) => POSSESSIVE.test(text);

/** @param {unknown} v @param {string} at @param {Array<{ at: string, text: string }>} out */
function walk(v, at, out) {
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${at}[${i}]`, out));
  else if (v && typeof v === 'object') {
    for (const [k, x] of Object.entries(v)) {
      if (k === 'text' && typeof x === 'string') out.push({ at, text: x });
      else walk(x, `${at}.${k}`, out);
    }
  }
}

/** @type {Array<{ file: string, at: string, text: string }>} */
const templates = [];
/** @type {string[]} */
const files = [];
beforeAll(async () => {
  for (const f of readdirSync(join(ROOT, DIR)).filter((n) => n.endsWith('.js')).sort()) {
    files.push(f);
    const mod = await import(pathToFileURL(join(ROOT, DIR, f)).href);
    /** @type {Array<{ at: string, text: string }>} */
    const found = [];
    for (const [name, v] of Object.entries(mod)) walk(v, name, found);
    for (const t of found) templates.push({ file: `${DIR}/${f}`, ...t });
  }
});

describe('D4C-1 (3): no Daily Life wording puts "\'s" on a power\'s or the government\'s name', () => {
  it('the walker reads every pool file under src/data/dailyLife/, and every one of them holds wordings (no vacuous pass)', () => {
    expect(files.length).toBeGreaterThanOrEqual(9);
    const empty = files.filter((f) => !templates.some((t) => t.file === `${DIR}/${f}`));
    expect(empty, 'a pool file under src/data/dailyLife/ read with no wording').toEqual([]);
    expect(templates.some((t) => /\{power\}/.test(t.text)) && templates.some((t) => /\{gov\}/.test(t.text)), 'the power and government placeholders are read').toBe(true);
  });

  it('no template appends "\'s" to {power}, {Power} or {gov}, and no filler carries it ({power\'s})', () => {
    const bad = templates.filter((t) => possessesPower(t.text)).map((t) => `${t.file} :: ${t.at}: "${t.text}"`);
    expect(bad, 'a possessive on a power\'s or the government\'s name').toEqual([]);
  });

  it('self-planting: the bad forms red, the good forms pass', () => {
    for (const t of ['Outsiders notice {power\'s} mark is on every door that matters.', '{Power}\'s word is law.', 'Everyone knows {gov}\'s mind.',
      'Nobody crosses {gov|it|them}\'s officers.', 'The {power}’s men are everywhere.', 'Ask {Gov\'s} clerk.']) expect(possessesPower(t), t).toBe(true);
    for (const t of ['Outsiders notice the mark of {power} on every door that matters.', 'People do as {gov} {gov|says|say}.',
      'The price of food is the first complaint on everyone\'s lips.', 'The day\'s work starts after.', '{Power} {power|carries|carry} the most weight here.']) expect(possessesPower(t), t).toBe(false);
  });
});
