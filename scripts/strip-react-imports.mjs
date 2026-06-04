#!/usr/bin/env node
/**
 * scripts/strip-react-imports.mjs - one-shot lint cleanup (Tier 9.4).
 *
 * Vite + React 19's automatic JSX runtime means a bare
 *   import React from 'react';
 * is dead weight. ESLint flags ~101 of them in this repo. This script
 * mechanically strips them:
 *   1. `import React, { useState } from 'react';` → `import { useState } from 'react';`
 *   2. `import React from 'react';`                → (delete the line entirely)
 *
 * After running, re-run `npx eslint .` to verify the count drops by ~101.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

// Collect target files from eslint output rather than a static list - that way
// the script never strips an import that's actually being used (eslint only
// flags genuinely-unused imports).
const eslintOut = execSync('npx eslint . --format=json', { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
const reports = JSON.parse(eslintOut);

const targets = new Set();
for (const report of reports) {
  for (const msg of report.messages) {
    if (
      msg.ruleId === 'no-unused-vars' &&
      typeof msg.message === 'string' &&
      msg.message.includes("'React' is defined but never used")
    ) {
      targets.add(report.filePath);
    }
  }
}

let bareDeleted = 0;
let namedTrimmed = 0;
const skipped = [];

for (const file of targets) {
  let src;
  try { src = readFileSync(file, 'utf8'); } catch (e) { skipped.push(`${file}: ${e.message}`); continue; }

  const before = src;

  // Pattern A: `import React, { ... } from 'react';`
  src = src.replace(
    /^import\s+React\s*,\s*\{([^}]*)\}\s*from\s*['"]react['"]\s*;?\s*$/m,
    (_m, names) => `import {${names}} from 'react';`,
  );

  // Pattern B: `import React from 'react';` - delete the whole line
  src = src.replace(/^import\s+React\s+from\s+['"]react['"]\s*;?\s*\r?\n/m, '');

  if (src === before) {
    skipped.push(file);
    continue;
  }

  if (/^import\s+React[\s,]/m.test(src)) {
    // Our regex missed something - bail to avoid silent corruption.
    skipped.push(`${file}: pattern unmatched (still has 'import React')`);
    continue;
  }

  writeFileSync(file, src);
  if (/import\s+React\s*,/.test(before)) namedTrimmed++;
  else bareDeleted++;
}

console.log(`Bare deleted:  ${bareDeleted}`);
console.log(`Named trimmed: ${namedTrimmed}`);
console.log(`Total updated: ${bareDeleted + namedTrimmed}`);
console.log(`Skipped:       ${skipped.length}`);
if (skipped.length) console.log(skipped.slice(0, 20).join('\n'));
