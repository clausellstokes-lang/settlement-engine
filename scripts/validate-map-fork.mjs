import { readdir, readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';

const root = fileURLToPath(new URL('../public/map/', import.meta.url));
const failures = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['libs', 'node_modules'].includes(entry.name)) await walk(path);
    } else if (extname(entry.name) === '.js') {
      const source = await readFile(path, 'utf8');
      try {
        parse(source, { ecmaVersion: 'latest', sourceType: 'script', allowHashBang: true });
      } catch (scriptError) {
        try {
          parse(source, { ecmaVersion: 'latest', sourceType: 'module', allowHashBang: true });
        } catch (moduleError) {
          failures.push(`${path}: ${moduleError.message}; script parse: ${scriptError.message}`);
        }
      }
    }
  }
}

await walk(root);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('Map fork JavaScript parses successfully.');
