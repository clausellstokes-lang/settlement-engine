# Replace the text from START (inclusive) through END (inclusive) with the contents of NEWFILE, in FILE.
# Asserts START occurs exactly once and END occurs exactly once after it. Usage: python3 replace_between.py FILE START END NEWFILE
import sys
f, start, end, newf = sys.argv[1:5]
t = open(f, encoding='utf-8').read()
assert t.count(start) == 1, f"START count {t.count(start)}"
i = t.index(start)
j = t.find(end, i)
assert j >= 0, "END not found"
assert t.count(end, i) >= 1
j += len(end)
new = open(newf, encoding='utf-8').read().rstrip('\n')
open(f, 'w', encoding='utf-8').write(t[:i] + new + t[j:])
print("replaced", j - i, "chars with", len(new))
