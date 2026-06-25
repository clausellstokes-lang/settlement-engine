import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../supabase/functions/', import.meta.url));
const failures = [];

/**
 * Recursively collect every non-test .ts file under supabase/functions/.
 * Previously this only transpiled each function's index.ts, leaving the
 * highest-trust shared/refund modules (_shared/requestMeta.ts,
 * generate-narrative/refundPolicy.ts, …) entirely unchecked — a syntax/type
 * error there would sail past the gate unless a Deno test happened to hit it.
 */
async function collect(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await collect(path, out);
    } else if (extname(entry.name) === '.ts' && !entry.name.endsWith('.test.ts')) {
      out.push(path);
    }
  }
  return out;
}

const files = await collect(root);

for (const file of files) {
  const rel = relative(root, file);
  const source = await readFile(file, 'utf8');

  // NOTE — this is a SYNTAX check, not a type check. ts.transpileModule()
  // compiles each file in isolation with no program/type-checker, so the
  // diagnostics it reports are syntactic only: a genuine TYPE error (wrong
  // argument type, missing property, bad return type) transpiles cleanly and
  // sails past this gate. Full type checking of the edge functions is owned by
  // `deno task check:edge` (deno check, run in CI's deno-tests job) — this gate
  // is the fast pre-flight that catches a broken parse in the shared/refund
  // modules `collect()` reaches that no Deno test happens to import. If you need
  // type errors caught HERE too, switch to a ts.createProgram() pass; until then
  // do not read a green run from this script as "the edge functions type-check".
  const result = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
    fileName: file,
  });
  for (const diagnostic of result.diagnostics || []) {
    failures.push(`${rel}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
  }

  // botGuard contract. Previously this only flagged ONE specific wrong shape
  // (`if (guard) return guard`), proving nobody wrote that exact mistake — not
  // that every guard is actually consumed. Strengthen it: wherever botGuard is
  // CALLED (and its result captured), the same file must reference `.reject`,
  // so a function that captures the guard and forgets to act on it (shipping an
  // unprotected endpoint) fails the gate. The _shared module that DEFINES
  // botGuard is exempt — its `.reject` reference lives at the call sites.
  const callsBotGuard = /=\s*botGuard\s*\(/.test(source);
  const definesBotGuard = /function\s+botGuard\b|export\s+\{[^}]*\bbotGuard\b/.test(source);
  if (callsBotGuard && !definesBotGuard && !/\.reject\b/.test(source)) {
    failures.push(
      `${rel}: botGuard() result is captured but never consumed — a guarded endpoint must \`if (guard.reject) return guard.reject\`.`,
    );
  }
  // The original wrong-shape check is kept too (it catches the case where
  // `.reject` exists elsewhere in the file but THIS guard is mis-checked).
  if (/const\s+guard\s*=\s*botGuard/.test(source) && /if\s*\(\s*guard\s*\)\s*return\s+guard\b/.test(source)) {
    failures.push(`${rel}: botGuard result must check guard.reject, not the wrapper object`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Edge function syntax and guard contracts are valid (${files.length} files).`);
