// READ-ONLY. A CORRECTED composed-fill resolver: a bag NAME resolves to the NEAREST PRECEDING
// `const <name> =` declaration, not the file's first. Reuses the instruments' own primitives.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { balanced, topLevelSplit, objectKeys, COMPOSERS } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/tests/helpers/dossierComposedFill.js';
const B6 = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';

function nearestDecl(src, name, before) {
  const re = new RegExp(`\\bconst\\s+${name}\\s*=`, 'g');
  let best = -1;
  for (const m of src.matchAll(re)) { if (m.index < before) best = m.index + m[0].length; else break; }
  return best;
}
function keysOfBag(src, name, before, seen = new Set()) {
  if (seen.has(name)) return { keys: [], unresolved: [] };
  seen.add(name);
  const from = nearestDecl(src, name, before);
  if (from < 0) return { keys: [], unresolved: [`no preceding declaration of \`${name}\``] };
  const brace = src.indexOf('{', from);
  const semi = src.indexOf(';', from);
  if (brace < 0 || (semi >= 0 && brace > semi && !src.slice(from, semi).includes('?'))) {
    return { keys: [], unresolved: [`\`${name}\` is not an object literal`] };
  }
  const conditionalBag = src.slice(from, brace).includes('?');
  const keys = []; const unresolved = [];
  let cursor = brace; const limit = semi >= 0 ? semi : src.length;
  while (cursor >= 0 && cursor < src.length) {
    let block; try { block = balanced(src, cursor); } catch { break; }
    const parsed = objectKeys(block.inner);
    for (const k of parsed.keys) keys.push({ name: k.name, conditional: k.conditional || conditionalBag });
    unresolved.push(...parsed.unresolved);
    for (const s of parsed.spreads) { const n = keysOfBag(src, s, from, seen); keys.push(...n.keys); unresolved.push(...n.unresolved); }
    const next = src.indexOf('{', block.end + 1);
    if (next < 0 || next > Math.max(limit, block.end) || !conditionalBag) break;
    cursor = next;
  }
  return { keys, unresolved };
}

// Every readStateProse call, with the block resolved (literal, or through the enclosing
// helper's callers) and the bag resolved by nearest-preceding declaration.
const perBlock = new Map();
const report = [];
for (const rel of COMPOSERS) {
  const src = readFileSync(join(B6, rel), 'utf8');
  for (const m of src.matchAll(/\breadStateProse\s*\(/g)) {
    const open = m.index + m[0].length - 1;
    const args = topLevelSplit(balanced(src, open).inner);
    if (args.length < 3) continue;
    const line = src.slice(0, m.index).split('\n').length;
    const opts = args[args.length - 1];
    const braceAt = opts.indexOf('{');
    let keys = []; let unresolved = [];
    if (braceAt < 0) unresolved.push('options not a literal');
    else {
      const inner = balanced(opts, braceAt).inner;
      const slotPart = topLevelSplit(inner).find((p) => /^slots\b/.test(p.trim())) || '';
      const inlineAt = slotPart.indexOf('{');
      if (inlineAt >= 0) {
        const io = objectKeys(balanced(slotPart, inlineAt).inner);
        keys = io.keys; unresolved.push(...io.unresolved);
        for (const s of io.spreads) { const n = keysOfBag(src, s, m.index); keys.push(...n.keys); unresolved.push(...n.unresolved); }
      } else {
        const named = slotPart.match(/^slots\s*:\s*([A-Za-z_$][\w$]*)/);
        const bag = keysOfBag(src, named ? named[1] : 'slots', m.index);
        keys = bag.keys; unresolved = unresolved.concat(bag.unresolved);
      }
    }
    const lit = args[1].trim().match(/^'([^']+)'$/);
    const slots = [...new Set(keys.map((k) => k.name))].sort();
    report.push({ rel: rel.split('/').pop(), line, block: lit ? lit[1] : args[1].trim(), slots, unresolved });
  }
}
console.log('composer:line · block(arg) · bag(nearest-preceding)');
for (const r of report) console.log(`${r.rel}:${r.line} · ${r.block} · [${r.slots.join(',')}]${r.unresolved.length ? ' UNRESOLVED ' + JSON.stringify(r.unresolved) : ''}`);
