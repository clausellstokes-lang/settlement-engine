# spans.py <sql file> : prints each top-level statement span "start end kind name" (1-indexed, inclusive),
# a function statement running from its `create or replace function` line to the line that closes its
# dollar quote and ends in `;`; comment lines directly above are attached as the span's lead.
import re, sys
lines = open(sys.argv[1], encoding='utf8').read().split('\n')
i = 0; out = []
while i < len(lines):
    m = re.match(r'create or replace function public\.(\w+)\(', lines[i])
    if m:
        lead = i
        while lead > 0 and lines[lead-1].startswith('--'): lead -= 1
        # find opening dollar tag
        j = i; tag = None
        while tag is None:
            t = re.search(r'(\$[a-z_]*\$)', lines[j])
            if t: tag = t.group(1); open_line = j; rest = lines[j][t.end():]
            else: j += 1
        if tag in rest: k = j
        else:
            k = j + 1
            while tag not in lines[k]: k += 1
        assert lines[k].rstrip().endswith(';'), (m.group(1), lines[k])
        out.append((lead+1, i+1, k+1, m.group(1)))
        i = k + 1; continue
    i += 1
for s in out: print(*s)
