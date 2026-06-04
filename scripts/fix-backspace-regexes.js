#!/usr/bin/env node
/**
 * fix-backspace-regexes.js - One-shot script: replace literal 0x08
 * (backspace) bytes with `\b` (word-boundary regex escape) in
 * generator files where de-minification corrupted `\b` into the actual
 * control character.
 *
 * Background: services/powerGenerator regexes like
 *   /\bthe garrison commander\b/gi
 * got serialized as
 *   /[BS]the garrison commander[BS]/gi
 * during a prior de-minification step. The regex still parses but
 * matches nothing useful (backspace can't appear in normal text), so
 * the corresponding narrative substitutions silently never fire.
 *
 * Replaces every `\x08` byte with the two-character ASCII sequence
 * `\b` (backslash + lowercase b). Run once; idempotent on subsequent
 * runs (no backspace chars left to replace).
 */

import { readFileSync, writeFileSync } from 'node:fs';

const TARGETS = [
  'src/generators/servicesGenerator.js',
  'src/generators/powerGenerator.js',
];

let totalReplaced = 0;
for (const fname of TARGETS) {
  const data = readFileSync(fname);
  let replaced = 0;
  const chunks = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] === 0x08) {
      chunks.push(Buffer.from('\\b', 'utf8'));
      replaced++;
    } else {
      chunks.push(data.slice(i, i + 1));
    }
  }
  if (replaced === 0) {
    console.log(`${fname}: no backspace chars (already fixed)`);
    continue;
  }
  writeFileSync(fname, Buffer.concat(chunks));
  console.log(`${fname}: replaced ${replaced} backspace -> \\b`);
  totalReplaced += replaced;
}
console.log(`\nTotal: ${totalReplaced} regex word-boundaries restored`);
