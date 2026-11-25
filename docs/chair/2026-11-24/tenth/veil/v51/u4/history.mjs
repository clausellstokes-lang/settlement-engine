// VEIL-51 unit 4, RULING V25 (3): ONE PASS over the standing-tail writer's history on master (bounded one hour): every committed
// version of the writer file(s) on db832c892's history, its forms derived by R5D's own `deriveForms` (scripts/veil/standingForms.mjs
// at the given tree, read-only), each checked for a row of the table that holds it (template or subsumes). Prints per version the
// forms not held; and per form not held, the last commit that derived it.  node history.mjs <tree> <commits file: "<hash> <path>">
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const [, , TREE, LIST] = process.argv;
const SF = await import(`${TREE}/scripts/veil/standingForms.mjs`);
const table = SF.readTable(); const force = SF.forceWords(TREE);
const held = (f) => table.forms.some((r) => r.template === f.template) || table.forms.some((r) => SF.subsumes(r.tokens, f.tokens, force));
const missing = new Map(); let versions = 0, unread = 0, forms = 0;
for (const line of readFileSync(LIST, 'utf8').trim().split('\n')) {
  const [h, path] = line.split(' ');
  let src; try { src = execFileSync('git', ['show', `${h}:${path}`], { encoding: 'utf8', maxBuffer: 64 << 20 }); } catch { continue; }
  versions += 1;
  let fs; try { fs = SF.deriveForms(src); } catch (e) { unread += 1; console.log(`UNREAD ${h} ${path}: ${String(e).slice(0, 120)}`); continue; }
  forms += fs.length;
  for (const f of fs) if (!held(f) && !missing.has(f.template)) missing.set(f.template, `${h} ${path}`);
}
console.log(`versions ${versions} | unread ${unread} | forms derived ${forms} | forms NOT held by the table ${missing.size}`);
for (const [t, at] of missing) console.log(`  NOT HELD (first seen at ${at}): ${t.slice(0, 160)}`);
