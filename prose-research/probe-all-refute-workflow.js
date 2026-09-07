export const meta = {
  name: 'probe-all-refute',
  description: 'PROBE-ALL-REFUTE (queue row 46): Opus refuters re-run PROBE_ALL.md\'s printed commands at the landed tip and try to refute each headline finding; a fold reports what survives',
  phases: [
    { title: 'Refute', detail: 'one Opus refuter per finding family, each re-executing the printed command and reading the raw source' },
    { title: 'Fold', detail: 'the seat folds the verdicts into a refutation receipt' },
  ],
}
// Owner's cap: FOUR agents; args.cap bounds this run. Every refuter is `model: 'opus'` (verification is Opus); the fold inherits the seat.
const CAP = (args && args.cap) || 2
const TREE = args && args.tree      // a dock at the tip to measure (read-only; the probe-all tools write nothing into the tree)
const KIT = (args && args.kitDir) || '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research'
if (!TREE) throw new Error('args.tree is required')
async function batched(items, fn) { const out = []; for (let i = 0; i < items.length; i += CAP) { const r = await parallel(items.slice(i, i + CAP).map((it, j) => () => fn(it, i + j))); out.push(...r) } return out }
const VERDICT = { type: 'object', required: ['family', 'verdicts', 'commandsRun'], properties: { family: { type: 'string' }, commandsRun: { type: 'array', items: { type: 'string' } }, verdicts: { type: 'array', items: { type: 'object', required: ['finding', 'verdict', 'measured', 'note'], properties: { finding: { type: 'string' }, verdict: { type: 'string', enum: ['CONFIRMED', 'REFUTED', 'PARTLY', 'UNMEASURABLE'] }, measured: { type: 'string' }, note: { type: 'string' } } } } } }
const FAMILIES = [
  { key: 'extractors', brief: 'the six extractors (§1) and the register roster (§2): re-run `probe-all/run.mjs` (read its usage first) on the tree and confirm the admitted-row counts per register (34,508 total; 30,232 across nineteen registers + a 4,276-row control) and the six traps table; try to find a reader-facing prose home the extractors MISS (grep src/ and docs/content for authored sentences not attributed to any register)' },
  { key: 'table', brief: 'the metrics table (§3) and the outliers (§6): re-derive at least ten figures from §3 and every row of §6 by the printed commands (§7); a figure that does not reproduce within rounding is REFUTED with both numbers' },
  { key: 'tics', brief: 'the house tics per register (§4) — especially R6\'s 184 "It is public" openers and zero short sentences, the "the PCs" violation at historyData.js:1326, and the six remaining reader em dashes: re-count each from the raw source; check the tic detector against three hand-read samples per register for false positives' },
  { key: 'bible', brief: 'the bible-distance axis (§5, labelled PLAUSIBLE by the lane) and the 46.4% wired-annex figure: re-run `probe-all/bible.mjs` and `x6-annex.mjs`; question the axis\'s construction (which bible laws are measured, which are not, whether the distance is comparable across registers of different unit); re-count wired vs unwired annex rows by an independent method' },
]
phase('Refute')
const results = await batched(FAMILIES, (f) => agent(
  `You are an ADVERSARIAL refuter (default to REFUTED when a figure does not reproduce). Read ${KIT}/PROBE_ALL.md — §0, then the section(s) for your family, then §7 (the exact commands) and §8. Your family: ${f.key} — ${f.brief}. Work in the read-only tree ${TREE} (never write into it; the probe-all tools live in ${KIT}/probe-all/ and read the tree by path — pass the tree as their root argument as §7 shows). Re-EXECUTE, do not re-read: every verdict must cite the command you ran and the number it printed. Return one verdict per finding you examined (at least six), with the measured figure beside the published one. Write your full notes to ${KIT}/sweep/refute-probe-all-${f.key}.md.`,
  { label: `refute:${f.key}`, phase: 'Refute', schema: VERDICT, model: 'opus' }))
phase('Fold')
const fold = await agent(`Fold these refutation results into ${KIT}/sweep/PROBE_ALL_REFUTATION.md: a table (finding · published · measured · verdict · refuter's note), then the list of REFUTED and PARTLY findings with what PROBE_ALL.md must change, then the findings that survive. Results: ${JSON.stringify(results.filter(Boolean))}`, { label: 'fold', phase: 'Fold' })
return { families: results.filter(Boolean).length, refuted: results.filter(Boolean).flatMap(r => r.verdicts).filter(v => v.verdict === 'REFUTED').length, partly: results.filter(Boolean).flatMap(r => r.verdicts).filter(v => v.verdict === 'PARTLY').length, confirmed: results.filter(Boolean).flatMap(r => r.verdicts).filter(v => v.verdict === 'CONFIRMED').length, fold: (fold || '').slice(0, 400) }
