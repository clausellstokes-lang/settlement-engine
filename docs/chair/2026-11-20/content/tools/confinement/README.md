# The confinement check (CV4), between two trees

Built by NAMES-3 (2026-11-20) from NAMES-2's check (its hand-back §3), on the chair's order: generic, two trees.

**Run** (from the repository root; both revisions fetched; about two minutes per revision on 4 cores, births cached in the workdir):

    node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <rev-before> <rev-after> <workdir> [--words=number|names|none] [--control]

**What it does.** Each revision is `git archive`d into `<workdir>/tree-<sha>` with this checkout's `node_modules` linked (it refuses
when `package.json` or `package-lock.json` differ between the revisions). Both corpora are born in each tree (`born.census.js`
through `run.mjs`): the generator golden's 525 (`goldenCorpus()`, `generateSettlementPipeline(cfg, null, { seed, customContent: {} })`)
and the census's 720 (`censusPlan('r2')`, `configOf(row, DEFAULT_CONFIG, birthConfig)` after `loadGenerationLawPayloads()`).
`confine.mjs` diffs every document key by key, matched by corpus key, and prints one line per corpus and the differing string
fields by count (strings, towns):

- **non-string differences**: a number, boolean or null moved, a type change, a key added or removed, a key order changed, an
  array's length. The claim of a prose-only change is that this is 0.
- **the word check** on each differing string (a word-level LCS):
  - `--words=number` (default): every changed word is the same word in its other number (`wants`/`want`, `is`/`are`,
    `it`/`them`, `its`/`their`, `it's`/`they've`), swapped one for one;
  - `--words=names`: every word gone or added is "the", a pronoun, or a word of the town's own power names or of any short
    label its cards carry (name, role, title, styled office);
  - `--words=none`: counts only.
- `--control`: each after-document against its neighbour's; the non-string count must flag every document.

**Other tools here.** `run.mjs <tree> <out> render` renders the census's 720 through the real `OutputContainer`, every group,
sub-tab and disclosure (the page census's `walkDossier`), into `<out>/views/<seed>.json`. `agree.mjs <reader-tree> <out>` counts
a power as the subject of its clause against its verb's number (NAMES-2's definition, §5 of its hand-back; this reader also
reads a clause opened by "and"), stored (`<out>/census.jsonl`) and rendered (`<out>/views`), grouped by template.

## First run: 7e0c77ae2 -> e356c94f2 (the names work, point 77; point 78 rides along, called by nobody)

EXECUTED 2026-11-20 by NAMES-3, `--words=names`:

| corpus | documents | identical | non-string differences | differing strings | pass the names check | other |
|---|---|---|---|---|---|---|
| golden 525 | 525 | 4 | **0** | 21,309 | 21,308 | 1 |
| census 720 | 720 | 76 | **0** | 25,429 | 25,407 | 22 |

This reproduces NAMES-2's figures exactly (4 and 76 identical, 0 non-string, 21,309 and 25,429 string leaves, the same fields
with the same counts). The 23 "other" strings are punctuation only, each read: 6 are the occupied pressure line NAMES-1 moved
out of its bracket ("in place (Elder Council still meets …)" -> "in place: the Elder Council still meets …,"), the rest a person
named with a bracketed role whose possessive token "(the workhouse master)'s" became "the workhouse master's". `--words=number`
on the same pair flags all 46,738 (a names change is not a number change: the check discriminates). `--control` flags every
document with a non-string difference (525 and 720).
