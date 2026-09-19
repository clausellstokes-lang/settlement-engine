---
name: ""
metadata: 
  node_type: memory
  title: A new naked completeness claim in ANY docs/**.md now reds a GREEN test the ratchet cannot absorb
  date: 2026-08-12
  tags: 
    - hazard
    - docs
    - gate
    - enforcement-claims
    - ratchet
  status: current
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-12T09:04:36.208Z
---

# ⚠⚠ Writing docs is now a gate risk — the naked-claim hole was closed at `32f4e520`

## What changed

`tests/docs/enforcement-claims.test.js` has always scanned a **recursive walk of `docs/`**
plus root-level `.md` files for completeness-claim vocabulary. Its old pin — *"every
completeness claim carries an `@enforced-by` tag with ≥1 target"* — is **RED and banked** in
`scripts/.test-ratchet-baseline.json` by exact file-and-title identity. Because the debt is
per-TEST, a seventh naked claim was absorbable into a failure somebody else had banked: same
file, same title, same verdict, not one bit of the gate moving.

**`32f4e520` closed that hole.** The debt is now ALSO frozen **PER CLAIM**, keyed on
`` `${file} :: ${matchedVocabulary}` `` with an **exact count**, in a NEW test that **PASSES
today** and is therefore **NOT in the census**:

```js
const FROZEN_NAKED = Object.freeze({
  'docs/FABLE_VALIDATION_QUEUE.md :: machine-enforced': 1,
  'docs/FABLE_VALIDATION_QUEUE.md :: 0 problems': 3,
  'docs/GOLDEN_SHIFT_LEDGER.md :: machine-enforced': 1,
  'docs/implementation/packets/foreign-policy/IN-0C.md :: machine-enforced': 1,
});
```

⇒ **A new naked claim in a new doc mints a brand-new key (frozen 0, now 1) and reds a GREEN
test.** `check-test-ratchet.mjs` classifies that as a REGRESSION, not banked debt, and it reds
`npm run check` at the `test:ratchet` step. There is a `shrank` arm too, so removing one of the
six banked claims also reds until the constant moves.

## The forbidden vocabulary — verbatim, and note the flags

```js
const CLAIM_RE = /promoted (?:from warn )?to (?:ERROR|error)|burned (?:down )?to zero|0 problems|machine-enforced|the gate now (?:covers|type-checks)|fails the gate|fails the build|zero violations/;
```

- **No `i` flag** — `MACHINE-ENFORCED` in caps does not match. ⛔ Do not rely on that as a
  loophole; write around the phrase.
- **`0 problems` is a SUBSTRING match** — "30 problems", "10 problems" all trip it. This is how
  three of the four banked `FABLE_VALIDATION_QUEUE.md` rows were minted, by lint receipts.
- `.md` files are **not** comment-filtered: fenced code blocks, tables and blockquotes are all
  scanned.
- The escape is `@enforced-by <target>` within **±3 lines**, where the target is a real
  `tests/**/*.test.js` path (simplest), a gate-executed `.js/.mjs/.cjs/.ts/.json` path, or an
  eslint rule id at severity 2. ⚠ `.jsx` is **not** an accepted extension.

## How to apply

Before committing any new or edited file under `docs/` (a packet, a design doc, a ledger row,
a review), run the exact regex over it and require **zero** hits:

```sh
node -e "const CLAIM_RE=/promoted (?:from warn )?to (?:ERROR|error)|burned (?:down )?to zero|0 problems|machine-enforced|the gate now (?:covers|type-checks)|fails the gate|fails the build|zero violations/;
require('fs').readFileSync(process.argv[1],'utf8').split('\n').forEach((l,i)=>{const m=CLAIM_RE.exec(l);if(m)console.log((i+1)+' :: '+m[0]);});" <FILE>
```

⚠ **The estate's own idiom is the trap**: "reds the gate" is safe, "**fails the gate**" is not.
Prefer "reds", "is a STOP", "the gate exits non-zero".

⚠ When the banked six-claim test reds in a focused run, that is **legitimate pre-existing
debt** — confirm by checking that every file the assertion prints is one your change did not
touch, and that the new per-claim test is among the PASSING tests in the same file.

Verified 2026-08-12 at the GR-4b promotion (`a2222fee`): three new/edited docs, zero CLAIM_RE
hits, the per-claim test green, the banked test red with all six claims in untouched files.
