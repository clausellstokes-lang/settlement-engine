// reformat.cjs — De-minify JS data files by breaking long lines
const fs = require('fs');
const path = require('path');

const MAX_LINE = 120;

function parseArrayElements(arrayContent) {
  const elements = [];
  let current = '';
  let inString = false;
  let stringChar = '';
  let escaped = false;
  let depth = 0;

  for (let c = 0; c < arrayContent.length; c++) {
    const ch = arrayContent[c];
    if (escaped) {
      current += ch;
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      current += ch;
      escaped = true;
      continue;
    }
    if (!inString && (ch === '"' || ch === "'")) {
      inString = true;
      stringChar = ch;
      current += ch;
    } else if (inString && ch === stringChar) {
      inString = false;
      current += ch;
    } else if (!inString && (ch === '[' || ch === '{' || ch === '(')) {
      depth++;
      current += ch;
    } else if (!inString && (ch === ']' || ch === '}' || ch === ')')) {
      depth--;
      current += ch;
    } else if (!inString && depth === 0 && ch === ',') {
      elements.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) elements.push(current.trim());
  return elements;
}

function reformatFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimEnd();

    // Empty lines pass through
    if (trimmed.length === 0) {
      result.push('');
      continue;
    }

    // Short lines pass through
    if (trimmed.length <= MAX_LINE) {
      result.push(trimmed);
      continue;
    }

    // Comment divider lines — trim trailing dashes/box chars to fit MAX_LINE
    if (/^\s*\/\//.test(trimmed)) {
      if (trimmed.length > MAX_LINE && /[─\-═]{10,}/.test(trimmed)) {
        // Trim the trailing box-drawing or dash characters
        const match = trimmed.match(/^(.*?\S)\s*([─\-═]+)\s*$/);
        if (match) {
          const prefix = match[1];
          const dashChar = match[2][0];
          const needed = MAX_LINE - prefix.length - 1; // 1 for space
          if (needed > 0) {
            result.push(prefix + ' ' + dashChar.repeat(needed));
          } else {
            result.push(prefix);
          }
        } else {
          result.push(trimmed);
        }
      } else {
        result.push(trimmed);
      }
      continue;
    }

    // Template literal lines — leave alone
    if (trimmed.includes('`${') || /^\s*`/.test(trimmed)) {
      result.push(trimmed);
      continue;
    }

    // Arrow function returning string — leave alone
    if (/^\s*(tension|desc):\s*\(.*?\)\s*=>\s*["'`]/.test(trimmed)) {
      result.push(trimmed);
      continue;
    }
    if (/^\s*(tension|desc):\s*\(.*?\)\s*=>$/.test(trimmed)) {
      result.push(trimmed);
      continue;
    }

    // Long string-valued properties — unavoidable, leave alone
    if (/^\s*(desc|impression|entrepotNote|note|behaviour|stakes|secret|short|long|label):\s*["']/.test(trimmed)) {
      result.push(trimmed);
      continue;
    }
    // Multi-line string continuation
    if (/^\s*(desc|impression|entrepotNote|note|behaviour|stakes|secret):\s*$/.test(trimmed)) {
      result.push(trimmed);
      continue;
    }

    // Standalone string literal lines in arrays — unavoidable long narrative text
    if (/^\s*["'][^"']{80,}["'],?\s*$/.test(trimmed)) {
      result.push(trimmed);
      continue;
    }

    // Arrow function returning template literal on same line
    if (/^\s*\w+:\s*\(.*?\)\s*=>\s*["'`]/.test(trimmed)) {
      result.push(trimmed);
      continue;
    }

    // Pattern: property: ["item1", "item2", ...],
    // or     property: ['item1', 'item2', ...],
    const arrayPropMatch = trimmed.match(/^(\s*)([\w]+):\s*\[(.+)\](,?)$/);
    if (arrayPropMatch) {
      const propIndent = arrayPropMatch[1];
      const propName = arrayPropMatch[2];
      const arrayContent = arrayPropMatch[3];
      const trailingComma = arrayPropMatch[4];

      const elements = parseArrayElements(arrayContent);

      if (elements.length > 1) {
        result.push(propIndent + propName + ': [');
        for (let e = 0; e < elements.length; e++) {
          const comma = e < elements.length - 1 ? ',' : '';
          result.push(propIndent + '  ' + elements[e] + comma);
        }
        result.push(propIndent + ']' + trailingComma);
      } else {
        result.push(trimmed);
      }
      continue;
    }

    // Pattern: key_name:        ['val1', 'val2', ...],  (with alignment spaces)
    const lookupMatch = trimmed.match(/^(\s*)([\w_]+):\s+\[(.+)\](,?)$/);
    if (lookupMatch) {
      const propIndent = lookupMatch[1];
      const propName = lookupMatch[2];
      const arrayContent = lookupMatch[3];
      const trailingComma = lookupMatch[4];

      const elements = parseArrayElements(arrayContent);

      if (elements.length > 1) {
        result.push(propIndent + propName + ': [');
        for (let e = 0; e < elements.length; e++) {
          const comma = e < elements.length - 1 ? ',' : '';
          result.push(propIndent + '  ' + elements[e] + comma);
        }
        result.push(propIndent + ']' + trailingComma);
      } else {
        result.push(trimmed);
      }
      continue;
    }

    // Pattern: inline array continuation lines like:
    //       'Grain surplus', 'Agricultural surplus', 'Raw wool', ...
    const inlineArrayMatch = trimmed.match(/^(\s+)('[^']*'|"[^"]*")\s*,/);
    if (inlineArrayMatch && trimmed.length > MAX_LINE) {
      const lineIndent = inlineArrayMatch[1];
      const elements = parseArrayElements(trimmed.trim());

      // Re-wrap elements to fit within MAX_LINE
      let currentLine = lineIndent;
      for (let e = 0; e < elements.length; e++) {
        const elem = elements[e];
        const sep = e < elements.length - 1 ? ', ' : (trimmed.trimEnd().endsWith(',') ? ',' : '');

        if (currentLine === lineIndent) {
          currentLine += elem + sep;
        } else if (currentLine.length + elem.length + sep.length + 2 <= MAX_LINE) {
          currentLine += ' ' + elem + sep;
        } else {
          result.push(currentLine.replace(/,\s*$/, ','));
          currentLine = lineIndent + elem + sep;
        }
      }
      if (currentLine.trim().length > 0) {
        result.push(currentLine);
      }
      continue;
    }

    // Default: pass through unchanged
    result.push(trimmed);
  }

  return result.join('\n');
}

// Process files
const files = [
  'src/data/supplyChainData.js',
  'src/data/npcData.js',
  'src/data/institutionalCatalog.js'
];

const base = path.resolve(__dirname);

for (const f of files) {
  const filePath = path.join(base, f);
  const before = fs.readFileSync(filePath, 'utf8');
  const after = reformatFile(filePath);
  fs.writeFileSync(filePath, after, 'utf8');

  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const beforeMax = Math.max(...beforeLines.map(l => l.length));
  const afterMax = Math.max(...afterLines.map(l => l.length));

  console.log(`${f}: ${beforeLines.length} -> ${afterLines.length} lines, max ${beforeMax} -> ${afterMax} chars`);
}

console.log('Done.');
