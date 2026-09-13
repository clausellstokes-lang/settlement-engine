import sys
D = "/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneINSTR2/"

EDITS = [
 ("src/domain/institutions/institutionTable.js",
  "    const impairments = Array.isArray(inst?.impairments) ? inst.impairments : [];\n",
  "    // `Array.isArray` is declared `arg is any[]`, so the guard WIDENS the row's own typed\n"
  "    // `impairments` shape to `any[]` and the map below loses it. Naming the shape the roster\n"
  "    // row already declares is this file's idiom (the `InstitutionRow` typedef), not a cast.\n"
  "    /** @type {ReadonlyArray<{type?: string}>} */\n"
  "    const impairments = Array.isArray(inst?.impairments) ? inst.impairments : [];\n"),

 ("src/domain/prose/entryWalker.js",
  "  const claimed = [];\n",
  "  /** @type {string[]} */\n"
  "  const claimed = [];\n"),

 ("src/domain/prose/entryWalker.js",
  "  const byNoun = new Map();\n"
  "  for (const b of bands) {\n"
  "    const key = b.noun || '';\n"
  "    if (!byNoun.has(key)) byNoun.set(key, []);\n"
  "    byNoun.get(key).push(b);\n"
  "  }\n",
  "  /** @type {Map<string, Array<{phrase: string, noun: string, clause: string}>>} */\n"
  "  const byNoun = new Map();\n"
  "  for (const b of bands) {\n"
  "    const key = b.noun || '';\n"
  "    // GET-OR-CREATE, because a typed Map's `get` returns `T | undefined` and this loop must\n"
  "    // not read through that. Re-setting a key a Map already holds does NOT move it, so the\n"
  "    // noun order the loop below walks is still first-arrival order: the same tallies.\n"
  "    const list = byNoun.get(key) || [];\n"
  "    list.push(b);\n"
  "    byNoun.set(key, list);\n"
  "  }\n"),

 ("src/domain/prose/grammarWalker.js",
  "  const inScope = (wall) => wall.scope.includes('*') || wall.scope.includes(register);\n"
  "  const wall = (id) => WALLS.find((w) => w.id === id);\n",
  "  // `find` answers `wall | undefined`, and the file already reads that answer with `?.` at\n"
  "  // arm E's wall-10 gate: no such wall is not in scope. Same reading, said once more.\n"
  "  /** @param {{scope: ReadonlyArray<string>} | undefined} wall */\n"
  "  const inScope = (wall) => Boolean(wall\n"
  "    && (wall.scope.includes('*') || wall.scope.includes(register)));\n"
  "  /** @param {number} id */\n"
  "  const wall = (id) => WALLS.find((w) => w.id === id);\n"),

 ("src/domain/prose/grammarWalker.js",
  "  const isTagged = (r) => typeof r.entry.grammar === 'string' && r.entry.grammar !== '';\n",
  "  /** @param {{entry: GrammarEntry}} r */\n"
  "  const isTagged = (r) => typeof r.entry.grammar === 'string' && r.entry.grammar !== '';\n"),

 ("src/domain/prose/grammarWalker.js",
  "  const cells = input.cells || new Map();\n",
  "  /** @type {Map<string, GrammarEntry[]>} */\n"
  "  const cells = input.cells || new Map();\n"),

 ("src/domain/prose/grammarWalker.js",
  "        uniformSegments: f.uniformSegments,\n",
  "        // A NARROWING, NOT A COERCION: `armE` writes both flags into ONE object literal and\n"
  "        // its only other exit (a pool of one) writes no figures at all, so a boolean\n"
  "        // `uniformGrammar` proves the sibling beside it is a boolean too.\n"
  "        uniformSegments: f.uniformSegments === true,\n"),

 ("src/domain/prose/moveGrammar.js",
  "/** Which move does a slot NAME suggest? The slot is a field, so this is a licensing read. */\n"
  "const SLOT_MOVE = Object.freeze({\n",
  "/**\n"
  " * Which move does a slot NAME suggest? The slot is a field, so this is a licensing read.\n"
  " *\n"
  " * TYPED AS AN OPEN RECORD BECAUSE THE READ IS OPEN. `SLOT_RE` matches any identifier, so a\n"
  " * slot this table does not name is a real input: the read answers `undefined` and the\n"
  " * `filter(Boolean)` beside it drops the row. A `keyof typeof` cast would deny that input.\n"
  " * @type {Readonly<Record<string, string>>}\n"
  " */\n"
  "const SLOT_MOVE = Object.freeze({\n"),
]

for rel, old, new in EDITS:
    p = D + rel
    s = open(p, encoding="utf-8").read()
    n = s.count(old)
    if n != 1:
        print(f"REFUSED {rel}: {n} matches for {old[:60]!r}")
        sys.exit(1)
    open(p, "w", encoding="utf-8").write(s.replace(old, new))
    print(f"applied {rel}: +{new.count(chr(10)) - old.count(chr(10))} lines")
print("all 8 edits applied")
