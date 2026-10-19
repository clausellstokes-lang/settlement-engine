# Apply exact, count-checked replacements to one file from a blocks file.
# Block grammar: "@@OLD" / "@@LINE <prefix>" ... "@@NEW" ... "@@END". OLD must occur exactly once;
# LINE replaces the one whole line that starts with <prefix> (exactly one such line).
import sys
target, blocks_path = sys.argv[1], sys.argv[2]
text = open(target, encoding='utf-8').read()
raw = open(blocks_path, encoding='utf-8').read()
i = 0; n = 0
parts = raw.split('@@END')
for part in parts:
    part = part.strip('\n')
    if not part.strip():
        continue
    head, _, new = part.partition('\n@@NEW\n')
    if head.startswith('@@OLD\n'):
        old = head[len('@@OLD\n'):]
        c = text.count(old)
        if c != 1:
            sys.exit(f'FAIL block {n}: OLD occurs {c} times: {old[:80]!r}')
        text = text.replace(old, new, 1)
    elif head.startswith('@@LINE '):
        prefix = head[len('@@LINE '):].split('\n')[0]
        lines = text.split('\n')
        idx = [k for k, l in enumerate(lines) if l.startswith(prefix)]
        if len(idx) != 1:
            sys.exit(f'FAIL block {n}: LINE prefix matched {len(idx)}: {prefix[:80]!r}')
        lines[idx[0]] = new
        text = '\n'.join(lines)
    else:
        sys.exit(f'FAIL block {n}: bad head {head[:40]!r}')
    n += 1
open(target, 'w', encoding='utf-8').write(text)
print(f'applied {n} blocks')
