# The landing of the close of the round BAR4 on the joined line: one file the chair resolved beforehand

The close of the round BAR4 is two branches: Part 1 (`lane/bar4-close-doors-2026-11-16`, final at 6483322cc: the
stored figures, the registers, two registrations under `src/`) and Part 2
(`lane/bar4-close-doors-2-2026-11-16`: the signed reference files and every pin that reads them; it holds Part 1). Both
were cut from the line as it stood at the end of the round's landings (600b7683a). Since then the line has taken the
nine branches of the round BAR5 and the five audit branches of the next wave (afa46d644).

The chair rehearsed the landing on a scratch tree at afa46d644 (2026-11-16, about 21:45 UTC): Part 1 at 6483322cc,
then Part 2 at 5cd04316a (its tip at that hour; its last commits, a receipt and a hand-back, are documents). It met
exactly ONE collision, at Part 1's merge. Part 2 then merges with none.

## The one collision

`tests/lint/presumedThings.widened.register.json` (the presumed-things walker's widened register, written by
`scripts/presumed-things-door.mjs`). Two hands each appended rows at the end of the same file's list
(`src/data/institutionDescVariants.js`): on the line, BAR5-THINGS banked ONE row (c74829e25: `quarters`, reason `word`,
"Several quarters, each with its house of worship."); on Part 1, the close banked the round's EIGHT fresh hits
(e71974972), FOUR of them at that same place (the crier's two lines, each for `market` and for `streets`). git joins
the other four by itself.

THE RESOLUTION IS THE UNION: the line's row first, then the close's four rows, each a row of its own. In the conflict
block that means: the line's four lines, then the two lines that close one row and open the next (`   ],` and `   [`,
three spaces before each), then the close's lines. By script, run at the tree's root while the merge is open:

```
python3 - <<'EOF'
import io, re
F = 'tests/lint/presumedThings.widened.register.json'
s = io.open(F, encoding='utf-8').read()
m = re.search(r'<<<<<<< [^\n]*\n(.*?)=======\n(.*?)>>>>>>> [^\n]*\n', s, re.S)
assert m and s.count('<<<<<<<') == 1
io.open(F, 'w', encoding='utf-8').write(s[:m.start()] + m.group(1) + '   ],\n   [\n' + m.group(2) + s[m.end():])
EOF
git hash-object tests/lint/presumedThings.widened.register.json
```

THE HASH DECIDES: the resolved file's blob reads `d30570fac9e2d42c196ceb254c984443634c2030`. Any other reading is a
STOP (a conflict block with a third section between `|||||||` and `=======` is a different conflict style: drop that
section by hand and hash again; if it still differs, stop and say so).

What the chair checked of that file: it parses; it is byte-equal to the door's own form (`JSON.stringify(reg, null, 1)`
and a newline), so a later door write re-formats nothing; its rows are exactly the three-way union (the base 4,681; the
line 4,682; Part 1 4,689; joined 4,690; nothing dropped, nothing twice); `reasons`, `strips` and `_doc` are the same on
both sides.

## What the merged tree reads

- After Part 1's merge, with the line at afa46d644 and nothing else committed between: `git rev-parse HEAD^{tree}` reads
  `61e161eb88264377b6b956725ba22ebd48b8fe22`.
- After Part 1 and again after Part 2: `git rev-parse HEAD:src` reads `3365a7311b571cc72f086122d4f38ba1af7c2965` (the
  line's `src` and Part 1's two registrations: `src/domain/generation/generationForkRegistry.js`,
  `src/domain/goods.schema.js`; Part 2 moves no byte under `src/`).
- `node scripts/presumed-things-door.mjs --check` at the tree after Part 1 prints, as its last line,
  `fresh 24 · stale 10 · first-register stale 0 · banked 4693 · strips fresh 0 stale 0 banked 107` and exits 1. THAT RED
  IS THE ROUND BAR5's OWN: the lines its cures re-worded (ten stale rows) and the lines it wrote (twenty-four fresh
  hits). None of it is the close's and none of it is the union's. It is re-taken at the next close, with the round's
  other stored figures; the merge seat re-derives nothing.

## Red on purpose after this landing

The reference files and every pin that reads them are, after this landing, at the values of the round BAR4's close,
while the tree holds the round BAR5: they stay red by BAR5's moves only (by the seats' own counts: things 226, food 107,
chains 63, world 38, powers 1 of the 525; they overlap) until the ONE close of the rounds BAR5 and BAR6, which needs a
new word of the owner in the chair's chat. Nobody re-takes them before that.
