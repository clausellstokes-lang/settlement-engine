export const meta = {
  name: 'five-author-check',
  description: 'S10: check every characterization the owner\'s five-author proposal makes about Kay, Le Guin, Wolfe and Hobb against the VERIFIED sweep sections, before any of it becomes a rule',
  phases: [ { title: 'Check', detail: 'one Opus checker per author, reading only the verified section and kept claims' }, { title: 'Fold', detail: 'the seat folds the four checks into one receipt' } ],
}
// The essay's full text is NOT on disk (only the chair's 11-line summary, prose-research/OWNER-PROPOSAL-2026-09-05-five-authors.md);
// what CAN be checked now is each characterization the summary and the sweep briefs carry. If the owner pastes the essay again,
// pass its path as args.essay and every attribution in it is checked verbatim.
const CAP = (args && args.cap) || 2
const KIT = (args && args.kitDir) || '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research'
const ESSAY = (args && args.essay) || null
const AUTHORS = [
  { key: 'kay', claims: 'restrained lyrical historical atmosphere; history as residue on ordinary people; competing memories of one event; melancholy and consequence without ornament; proposed as the aesthetic foundation beside Tolkien (weight 35 of 100)' },
  { key: 'leguin', claims: 'economy; rhythm; ordinary vocabulary carrying worldbuilding weight; distance without costume; her stated rules on sentence sound and adjectives; proposed as "the discipline" (weight 20)' },
  { key: 'wolfe', claims: 'prose that lets the reader infer the gap between public belief, institutional record and physical evidence without the narrator announcing it; unreliable/limited narration; incidental detail as evidence; omission as information; proposed as "the epistemic seasoning" (weight 5)' },
  { key: 'hobb', claims: 'converting a state change into a lived consequence for a person or household (who lost something, what they kept, what it meant); proposed as "the human layer" (weight 10)' },
]
async function batched(items, fn) { const out = []; for (let i = 0; i < items.length; i += CAP) { const r = await parallel(items.slice(i, i + CAP).map((it, j) => () => fn(it, i + j))); out.push(...r) } return out }
const CHECK = { type: 'object', required: ['author', 'rows'], properties: { author: { type: 'string' }, rows: { type: 'array', items: { type: 'object', required: ['characterization', 'verdict', 'sources', 'note'], properties: { characterization: { type: 'string' }, verdict: { type: 'string', enum: ['SUPPORTED', 'PARTLY', 'UNSUPPORTED', 'CONTRADICTED'] }, sources: { type: 'integer' }, note: { type: 'string' } } } } } }
phase('Check')
const checks = await batched(AUTHORS, (a) => agent(
  `Read ${KIT}/sweep/section-${a.key}.md and ${KIT}/sweep/kept-${a.key}.json (VERIFIED claims only; nothing else counts). ${ESSAY ? `Also read the owner's essay at ${ESSAY} and extract every attribution it makes about this author.` : ''} For EACH characterization below${ESSAY ? ' and each attribution in the essay' : ''}, say whether the verified section SUPPORTS it (count the distinct sources), PARTLY supports it, leaves it UNSUPPORTED, or CONTRADICTS it — with the claim indices. Be adversarial: a characterization that sounds right but has no verified source is UNSUPPORTED. Characterizations: ${a.claims}. Write your notes to ${KIT}/sweep/check-${a.key}.md.`,
  { label: `check:${a.key}`, phase: 'Check', schema: CHECK, model: 'opus' }))
phase('Fold')
const fold = await agent(`Fold into ${KIT}/sweep/FIVE_AUTHOR_CHECK.md: one table per author (characterization · verdict · sources · note), then the list of characterizations that may become RULES-V2 Part B rules (SUPPORTED with ≥3 sources), the ones that need another round, and the ones refused. Results: ${JSON.stringify(checks.filter(Boolean))}`, { label: 'fold', phase: 'Fold' })
return { authors: checks.filter(Boolean).length, supported: checks.filter(Boolean).flatMap(c => c.rows).filter(r => r.verdict === 'SUPPORTED').length, unsupported: checks.filter(Boolean).flatMap(c => c.rows).filter(r => r.verdict === 'UNSUPPORTED' || r.verdict === 'CONTRADICTED').length, fold: (fold || '').slice(0, 300) }
