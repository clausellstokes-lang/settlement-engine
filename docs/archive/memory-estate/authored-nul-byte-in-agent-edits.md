---
name: authored-nul-byte-in-agent-edits
description: ⚠️ HAS BITTEN 4x, latest 2026-08-03 — an agent Edit intending .join(' ') wrote a RAW NUL as the separator, twice; only tests/lint/controlBytes.test.js caught it; the WRITE tool does it too (2026-08-03). Cure = never emit a quoted single-character separator; use a template literal or a named char.
metadata:
  node_type: memory
  type: hazard
  date: 2026-07-27
  originSessionId: 88199162-811c-4be3-8912-b0f33c64d43d
  modified: 2026-07-27T18:34:40.218Z
---

## What happened

While implementing wave L-8a (the intent-atlas soak prior) in
`.claude/worktrees/minifold`, an `Edit` whose `new_string` contained
`[...].join(' ')` — a quoted single SPACE as an array separator — landed in
`src/domain/intentAtlas.js` as a **raw 0x00 NUL byte** instead of a space. It
was not visible in any subsequent `Read`, and `sed -n | cat -v` was what finally
showed it as `^@`.

It happened **twice in a row**: the first correction, also written as
`.join(' ')`, produced the NUL again. A third attempt to fix it via a `Bash`
one-liner was itself **refused by the harness** with
`command contains control characters that would be hidden in the approval
dialog` — because the NUL was in the command text too. The corruption is in the
emitted token stream, not in the file tooling, so re-typing the same construct
reproduces it.

## What caught it

**`tests/lint/controlBytes.test.js`** — the byte-level control-byte pin. It
reported precisely:

```
src/domain/intentAtlas.js:365:81  raw 0x00 (NUL) at byte offset 20691
```

Nothing else did. ESLint was clean. The unit suite (83 tests) was green — the
NUL worked perfectly as a separator, so every behavioural test passed. Without
that lint file the byte would have shipped, and git would then have treated the
file as binary (the failure mode recorded in
[[shared-tree-fpg3-and-grep-nul-gotcha]] and [[f24-corruption-class-closed]]).

## How to apply

1. **Never write a quoted single-character separator in agent-authored code.**
   Not `.join(' ')`, not `.join('|')`, not `split(' ')`. Use a template literal
   with the separator inline between `${}` interpolations:
   `` `${a}|${b}|${c}` `` — which is what the final fix used — or a named
   constant built with `String.fromCharCode(...)`.
2. **`Read` will not show you this.** Verify with `cat -v`, or with a byte scan:
   `node -e "const s=require('fs').readFileSync(P); ..."` filtering
   `c < 0x20 && c not in (9,10,13)`.
3. **Run `tests/lint/controlBytes.test.js` after any wave that authors new
   `src/**` or `tests/**` files.** It is cheap (part of `tests/lint/`, whole dir
   is ~20s) and it is the only detector.
4. If an `Edit` `old_string` fails to match a line you believe you just wrote,
   suspect an invisible byte in the file rather than a typo. Repair with
   `python3 -c` using an escaped regex (`rb"\x00"`), never by re-typing the
   construct.

## Why it matters

The whole class is silent by construction: the program is correct, the tests
pass, the diff looks right, and the damage (git binary-mode, grep/diff going
silently empty) only appears later, in a different session, as a mysterious
false negative.

## Fourth bite — the Write tool, 2026-08-03 (lane W8-B)

Same class, different tool. A **`Write`** creating
`src/domain/worldPulse/warTerminationCauseTables.js` contained
`.join('\u0000')` **as a JS escape sequence in the file content** — the correct
thing to author, and byte-faithful to the code being moved. The tool INTERPRETED
the escape and wrote **six raw NUL bytes**. Detection ran into the sibling trap
immediately: `grep -n "join("` on the file returned NOTHING (grep goes silently
empty on NUL files, see [[shared-tree-fpg3-and-grep-nul-gotcha]]), `tail` showed
`join(' ')` with the NUL rendered invisible, and an `Edit` with `old_string:
".join(' ')"` failed to match a line that was visibly on screen. A `python3 -c`
byte count (`data.count(b"\x00")`) is what proved it.

**Then it bit the commit message.** The first `git commit -F - <<'MSG'` heredoc
described the hazard and contained the escape in prose; the harness refused the
whole command with `command contains control characters that would be hidden in
the approval dialog`. Writing the message to a file with `python3` and
committing with `git commit -F <file>` is the cure.

**Added rules:**
5. **The escape `\u0000` is unsafe in `Write`/`Edit` content, not just in
   `.join(' ')` literals.** If moved code contains it, do NOT reproduce it —
   substitute a separator that cannot be lost. This lane replaced it with
   `const SEP = '|'` over a closed `[a-z_]` vocabulary and wrote the reason
   in-file.
6. **Byte-check every file a `Write` creates, in the same turn:**
   `python3 -c "d=open(P,'rb').read(); print(d.count(b'\x00'), sorted(set(b for b in d if b<9 or 13<b<32)))"`.
   Do not wait for controlBytes.
7. **Compose commit messages via a file, never a heredoc**, when the message
   discusses control characters at all.
