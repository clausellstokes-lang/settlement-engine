export const meta = {
  name: 'prose-exemplar-sweep',
  description: 'Exhaustive multi-angle sweep of Tolkien, Martin and D&D read-aloud prose criticism plus AI-prose failure modes, adversarially verified, in batches of four agents',
  phases: [
    { title: 'Find', detail: 'four angles per exemplar, loop until two dry rounds' },
    { title: 'Verify', detail: 'every attributed claim refuted against its source' },
    { title: 'Synthesize', detail: 'one dossier section per exemplar + the failure catalogue + a completeness critic' },
  ],
}
// Owner's cap: FOUR running agents of any kind. batched() runs at most `cap` thunks at once.
const CAP = (args && args.cap) || 4
const OUT = (args && args.outDir) || '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/prose-research/sweep'
async function batched(items, fn) {
  const out = []
  for (let i = 0; i < items.length; i += CAP) {
    const group = items.slice(i, i + CAP)
    const r = await parallel(group.map((it, j) => () => fn(it, i + j)))
    out.push(...r)
  }
  return out
}
const FINDINGS = { type: 'object', required: ['claims', 'sourcesRead'], properties: {
  sourcesRead: { type: 'array', items: { type: 'object', required: ['title', 'url', 'kind', 'substantive'], properties: { title: { type: 'string' }, url: { type: 'string' }, kind: { type: 'string' }, substantive: { type: 'boolean' } } } },
  claims: { type: 'array', items: { type: 'object', required: ['feature', 'claim', 'source', 'url', 'quote'], properties: { feature: { type: 'string' }, claim: { type: 'string' }, source: { type: 'string' }, url: { type: 'string' }, quote: { type: 'string', description: 'under twelve words, verbatim from the page, or empty' }, page: { type: 'string' } } } } } }
const VERDICT = { type: 'object', required: ['verdict', 'trueWording', 'note'], properties: { verdict: { type: 'string', enum: ['VERIFIED_VERBATIM', 'VERIFIED_SUBSTANCE', 'NOT_FOUND', 'CONTRADICTED', 'BLOCKED'] }, trueWording: { type: 'string' }, note: { type: 'string' } } }
const EXEMPLARS = [
  { key: 'tolkien', name: 'J. R. R. Tolkien', notes: 'prose style of The Lord of the Rings and The Hobbit: register modulation, archaism, per-speaker register, cadence, deep time, the annalist voice; critics Shippey, Rosebury, Walker, Turner, Flieger, Le Guin, Lewis, Auden; corpus/stylometric studies' },
  { key: 'martin', name: 'George R. R. Martin', notes: 'A Song of Ice and Fire prose: tight third person, sensory concrete nouns, Anglo-Saxon diction, compounds, chapter openings, sentence rhythm, repetition, dialogue; both praise and criticism; interviews in his own words' },
  { key: 'dnd', name: 'D&D official content', notes: 'Wizards of the Coast adventure and sourcebook prose: read-aloud/boxed text form, DM-facing text, terminology consistency, the 2014 vs 2024 house style, Adventurers League and DMs Guild guidance, designers (Perkins, Crawford, Decker, Noonan) on writing, community analyses; no published style guide — say so where sources agree' },
]
const ANGLES = [
  { key: 'academic', prompt: 'academic and scholarly criticism (journals, monographs, Wikipedia syntheses with their cited critics, conference papers, stylometric or corpus studies)' },
  { key: 'craft', prompt: 'craft essays and writing-advice pieces by novelists, editors and game designers that analyse HOW the prose works (sentence shape, diction, rhythm, register)' },
  { key: 'voice', prompt: 'the author\'s or designers\' OWN words: interviews, forewords, letters, blog posts, talks, panels' },
  { key: 'close', prompt: 'close readings and line-level analyses on forums, blogs, video essays (transcripts), reading groups — the kind that quote a sentence and explain it' },
]
const ONLY = (args && args.only) || null   // e.g. ['tolkien'] — a subset run under a tight agent cap
const SKIP_AI = !!(args && args.skipAI)
const EX = ONLY ? EXEMPLARS.filter(e => ONLY.includes(e.key)) : EXEMPLARS
phase('Find')
const findJobs = []
for (const ex of EX) for (const an of ANGLES) findJobs.push({ ex, an })
const found = await batched(findJobs, ({ ex, an }, i) => agent(
  `You are a research finder. Subject: the prose STYLE of ${ex.name} (${ex.notes}). Angle: ${an.prompt}. Use WebSearch and WebFetch; READ every source you cite (fetch it), never rely on a search snippet. Find as many substantive sources as this angle yields (aim for 10–20; stop when two consecutive searches return nothing new). For each source list it (title, url, kind, substantive true/false). Extract CLAIMS about concrete prose features: each claim names the feature (e.g. 'register modulation', 'Anglo-Saxon diction', 'two-sentence boxed text'), states it in one sentence, names the source and url, and carries at most one verbatim quotation under twelve words (or an empty string). Never reproduce copyrighted passages beyond twelve words. Write your raw notes to ${OUT}/find-${ex.key}-${an.key}.md and return the structured result.`,
  { label: `find:${ex.key}:${an.key}`, phase: 'Find', schema: FINDINGS }))
const AI_ANGLES = [
  { key: 'studies', prompt: 'peer-reviewed and arXiv studies of AI-generated NARRATIVE text: stylometry, burstiness, discourse features, expert vs non-expert judgments, homogenisation, lexical overuse (Kobak, Juzek & Ward, StoryScope, Chakrabarty, Ismayilzada, Doshi & Hauser, O\'Sullivan, Jakesch and any you find beyond these)' },
  { key: 'craft', prompt: 'novelists, fiction editors and developmental editors on what AI prose gets wrong in FICTION: subtext, specificity, rhythm, tidy endings, reflexive antithesis, the gloss, pet words' },
  { key: 'industry', prompt: 'publishing and games industry: magazine editors on AI slush, DMs Guild / RPG publishers on AI submissions, style-guide bans, what readers report noticing' },
  { key: 'counter', prompt: 'the case AGAINST the common tells: sources arguing em dashes, triads and antithesis are legitimate devices, that detection heuristics fail, that human prose shares the features — the disconfirming evidence' },
]
const foundAI = SKIP_AI ? [] : await batched(AI_ANGLES, (an) => agent(
  `You are a research finder. Subject: where generated (LLM) prose FAILS against skilled human fiction and game writing. Angle: ${an.prompt}. Use WebSearch and WebFetch; READ every source you cite; aim for 10–20 substantive sources, stop after two consecutive dry searches. For each source list it; extract CLAIMS as concrete failure modes (feature, one-sentence claim, source, url, one verbatim quotation under twelve words or empty). Write raw notes to ${OUT}/find-ai-${an.key}.md and return the structured result.`,
  { label: `find:ai:${an.key}`, phase: 'Find', schema: FINDINGS }))
const allClaims = [...found, ...foundAI].flatMap((r, i) => (r && r.claims ? r.claims : []).map(c => ({ ...c, batch: i })))
const seen = new Set(); const claims = []
for (const c of allClaims) { const k = (c.source + '|' + c.feature + '|' + c.claim.slice(0, 60)).toLowerCase(); if (!seen.has(k)) { seen.add(k); claims.push(c) } }
log(`found ${allClaims.length} claims, ${claims.length} after dedupe, from ${[...found, ...foundAI].filter(Boolean).reduce((n, r) => n + r.sourcesRead.length, 0)} sources read`)
phase('Verify')
const VERDICTS = { type: 'object', required: ['verdicts'], properties: { verdicts: { type: 'array', items: { type: 'object', required: ['index', 'verdict', 'trueWording', 'note'], properties: { index: { type: 'integer' }, verdict: { type: 'string', enum: ['VERIFIED_VERBATIM', 'VERIFIED_SUBSTANCE', 'NOT_FOUND', 'CONTRADICTED', 'BLOCKED'] }, trueWording: { type: 'string' }, note: { type: 'string' } } } } } }
const CHUNK = (args && args.chunk) || 15
const chunks = []
for (let i = 0; i < claims.length; i += CHUNK) chunks.push(claims.slice(i, i + CHUNK).map((c, j) => ({ ...c, index: i + j })))
const verifiedChunks = await batched(chunks, (chunk, ci) => agent(
  `Adversarially verify EACH of the following ${chunk.length} attributed claims by fetching its source as RAW text (WebFetch the url; group the claims by url and fetch each url ONCE; if a host blocks, try the Wayback Machine once, else BLOCKED). For each claim report its index and: VERIFIED_VERBATIM only if the quotation appears on the page word for word; VERIFIED_SUBSTANCE if the page supports the claim in other words (give the true wording, under twelve words); NOT_FOUND if the page does not support it; CONTRADICTED if it says otherwise. Default to NOT_FOUND when uncertain. Return one verdict per index, all ${chunk.length}.\n\nCLAIMS:\n${JSON.stringify(chunk.map(c => ({ index: c.index, feature: c.feature, claim: c.claim, source: c.source, url: c.url, quote: c.quote })))}`,
  { label: `verify:chunk${ci}`, phase: 'Verify', schema: VERDICTS }).then(v => ({ chunk, v })))
const verified = []
for (const r of verifiedChunks.filter(Boolean)) { const byIndex = new Map((r.v.verdicts || []).map(x => [x.index, x])); for (const c of r.chunk) verified.push({ ...c, verdict: byIndex.get(c.index) || { verdict: 'NOT_FOUND', trueWording: '', note: 'no verdict returned for this index' } }) }
const kept = verified.filter(x => x.verdict && (x.verdict.verdict === 'VERIFIED_VERBATIM' || x.verdict.verdict === 'VERIFIED_SUBSTANCE'))
log(`verified: ${kept.length} of ${verified.length} claims survive (${verifiedChunks.filter(Boolean).length} of ${chunks.length} verifier chunks returned)`)
phase('Synthesize')
const groups = {}; for (const e of EX) groups[e.key] = []; if (!SKIP_AI) groups.ai = []
for (const x of kept) { const idx = x.batch; const key = idx < findJobs.length ? findJobs[idx].ex.key : 'ai'; (groups[key] ||= []).push(x) }
const sections = await batched(Object.entries(groups), ([key, xs]) => agent(
  `Write the dossier section for "${key}" from these VERIFIED claims only (JSON follows). Structure: numbered concrete features, each with the critics/sources that support it (count them), the true wording of any quotation (under twelve words), and the reconstruction rule it implies for a settlement dossier written as a calm archivist (present tense, concrete civic nouns, no digits, no em dash). Mark disagreements between sources explicitly. End with a coverage table: sources read per angle. Write it to ${OUT}/section-${key}.md and return the markdown.\n\nCLAIMS:\n${JSON.stringify(xs).slice(0, 180000)}`,
  { label: `synth:${key}`, phase: 'Synthesize' }))
const critic = await agent(`You are the completeness critic for the subset ${Object.keys(groups).join(', ')}. Read ${OUT}/section-*.md and the find-*.md notes. List what is MISSING: an angle not run, a well-known critic or study absent (name them), a claim that rests on one source, a copyright risk (a quotation over twelve words), and any feature the sections contradict each other on. Return a markdown list with a recommended next round of searches. Write it to ${OUT}/critic.md.`, { label: 'critic', phase: 'Synthesize' })
return { claimsFound: allClaims.length, claimsDeduped: claims.length, claimsVerified: kept.length, sections: Object.keys(groups), critic }
