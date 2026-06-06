import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../supabase/functions/', import.meta.url));
const entries = await readdir(root, { withFileTypes: true });
const failures = [];

for (const entry of entries) {
  if (!entry.isDirectory() || entry.name === '_shared') continue;
  const file = join(root, entry.name, 'index.ts');
  let source;
  try {
    source = await readFile(file, 'utf8');
  } catch {
    continue;
  }
  const result = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
    fileName: file,
  });
  for (const diagnostic of result.diagnostics || []) {
    failures.push(`${entry.name}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
  }
  if (/const\s+guard\s*=\s*botGuard/.test(source) && /if\s*\(\s*guard\s*\)\s*return\s+guard/.test(source)) {
    failures.push(`${entry.name}: botGuard result must check guard.reject`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Edge function syntax and guard contracts are valid.');
