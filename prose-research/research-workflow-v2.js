export const meta = {
  name: 'prose-exemplar-sweep-v2',
  description: 'Prose exemplar sweep, file-backed: resume verification of a sweep from its state chunks (Opus verifies), or run fresh finders for a new exemplar/probe; then synthesize and criticise (seat)',
  phases: [
    { title: 'Find', detail: 'fresh runs only: four angles per exemplar, or one finder per technique probe' },
    { title: 'Verify', detail: 'every unverified claim refuted against its source, 15 per Opus agent; each agent writes its verdict file' },
    { title: 'Synthesize', detail: 'the section from kept-<name>.json, then the completeness critic' },
  ],
}
// v2 (chair, 2026-09-05 evening, after the reboot). SAME research design as research-workflow.js (finder prompts, angles, exemplars,
// probes, verdict vocabulary, seat law: every VERIFY chunk is `model: 'opus'`, SYNTH and CRITIC inherit the seat). What changed is the
// DATA PATH: a successor session cannot resume a run id, and the v1 successor path asked one agent to return a 400 KB state file
// VERBATIM as structured output, which exceeds an agent's output ceiling. So: the chair pre-splits the unverified claims into chunk
// FILES (args.chunks = [{file, indices}]), each verifier READS its file and WRITES `verdicts-<name>-chunk-<k>.json` (claims + verdicts,
// the checkpoint), and synthesis reads `kept-<name>.json` produced by `sweep-state.mjs merge` — nothing large ever crosses an agent's
// structured return. Owner's cap: FOUR running agents of any kind; args.cap bounds this run's concurrency.
const CAP = (args && args.cap) || 1
const NAME = args && args.name
if (!NAME) throw new Error('args.name is required (tolkien | martin | dnd | ai | kay | leguin | wolfe | hobb)')
const OUT = (args && args.outDir) || '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep'
const KIT = (args && args.kitDir) || '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research'
const STATE_FILE = (args && args.stateFile) || null
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
const EXEMPLARS = [
  { key: 'tolkien', name: 'J. R. R. Tolkien', notes: 'prose style of The Lord of the Rings and The Hobbit: register modulation, archaism, per-speaker register, cadence, deep time, the annalist voice; critics Shippey, Rosebury, Walker, Turner, Flieger, Le Guin, Lewis, Auden; corpus/stylometric studies' },
  { key: 'martin', name: 'George R. R. Martin', notes: 'A Song of Ice and Fire prose: tight third person, sensory concrete nouns, Anglo-Saxon diction, compounds, chapter openings, sentence rhythm, repetition, dialogue; both praise and criticism; interviews in his own words' },
  { key: 'kay', name: 'Guy Gavriel Kay', notes: 'historical-fantasy prose (Tigana, The Lions of Al-Rassan, Under Heaven, the Sarantine Mosaic): restrained lyrical historical atmosphere; history as residue on ordinary people; competing memories of one event; melancholy and consequence without ornament; his own essays and interviews on writing history-shaped fantasy; critics on his register' },
  { key: 'leguin', name: 'Ursula K. Le Guin', notes: 'the prose of Earthsea and the essays on style (From Elfland to Poughkeepsie; Steering the Craft; The Language of the Night): economy, rhythm, ordinary vocabulary carrying worldbuilding weight; distance without costume; her own stated rules on sentence sound, adjectives, and the plain noble style; critics and stylometric studies' },
  // OWNER 09-05 evening: Wolfe and Hobb get the FULL four-angle sweep, the same as Martin and Tolkien — the one-device probes are superseded; the device stays in the brief so every angle looks for it as well as for the register at large.
  { key: 'wolfe', name: 'Gene Wolfe', notes: 'the prose of The Book of the New Sun, The Fifth Head of Cerberus, Peace and the Soldier books: plain-seeming sentences carrying withheld information; unreliable and limited narrators; incidental detail as evidence; omission as information; THE DEVICE this program wants above all — prose that lets the reader infer the gap between public belief, institutional record and physical evidence without the narrator announcing it; Wolfe\'s own essays, interviews and letters on craft; critics (Clute, Wright, Aramini, Le Guin, Gaiman, Borski) and close readers' },
  { key: 'hobb', name: 'Robin Hobb', notes: 'the prose of the Farseer, Liveship and Tawny Man books: first-person interiority in ordinary vocabulary; slow consequence; household economy; THE DEVICE this program wants above all — converting a state change into a lived consequence for a person or household (who lost something, what they kept, what it meant); Hobb\'s own essays, interviews and blog posts on writing consequence and character; critics and close readers on her register and pacing' },
  { key: 'dnd', name: 'D&D official content', notes: 'Wizards of the Coast adventure and sourcebook prose: read-aloud/boxed text form, DM-facing text, terminology consistency, the 2014 vs 2024 house style, Adventurers League and DMs Guild guidance, designers (Perkins, Crawford, Decker, Noonan) on writing, community analyses; no published style guide — say so where sources agree' },
]
const ANGLES = [
  { key: 'academic', prompt: 'academic and scholarly criticism (journals, monographs, Wikipedia syntheses with their cited critics, conference papers, stylometric or corpus studies)' },
  { key: 'craft', prompt: 'craft essays and writing-advice pieces by novelists, editors and game designers that analyse HOW the prose works (sentence shape, diction, rhythm, register)' },
  { key: 'voice', prompt: 'the author\'s or designers\' OWN words: interviews, forewords, letters, blog posts, talks, panels' },
  { key: 'close', prompt: 'close readings and line-level analyses on forums, blogs, video essays (transcripts), reading groups — the kind that quote a sentence and explain it' },
]
const AI_ANGLES = [
  { key: 'studies', prompt: 'peer-reviewed and arXiv studies of AI-generated NARRATIVE text: stylometry, burstiness, discourse features, expert vs non-expert judgments, homogenisation, lexical overuse (Kobak, Juzek & Ward, StoryScope, Chakrabarty, Ismayilzada, Doshi & Hauser, O\'Sullivan, Jakesch and any you find beyond these)' },
  { key: 'craft', prompt: 'novelists, fiction editors and developmental editors on what AI prose gets wrong in FICTION: subtext, specificity, rhythm, tidy endings, reflexive antithesis, the gloss, pet words' },
  { key: 'industry', prompt: 'publishing and games industry: magazine editors on AI slush, DMs Guild / RPG publishers on AI submissions, style-guide bans, what readers report noticing' },
  { key: 'counter', prompt: 'the case AGAINST the common tells: sources arguing em dashes, triads and antithesis are legitimate devices, that detection heuristics fail, that human prose shares the features — the disconfirming evidence' },
]
const CHUNK = (args && args.chunk) || 15
const RESUME = !!(args && args.chunks)            // state chunks (pre-split, file-backed) to verify
// TOP-UP MODE (owner 09-05 evening, "the full workflow for every author"): a sweep whose state carries claims from fewer than
// four angles (dnd: 1 of 4 before the cutoff) re-runs the named angles' FINDERS and appends only the NEW claims — deduped
// against args.existingKeys (lowercase source|feature|claim[:60] of every claim already in the state) — at indices from
// args.baseIndex (= the state's claim count), so the state file grows by index and nothing already verified is touched.
const FIND_ANGLES = (args && args.findAngles) || (RESUME ? [] : ANGLES.map(a => a.key))
const BASE_INDEX = (args && args.baseIndex) || 0
const EXISTING = new Set(((args && args.existingKeys) || []).map(k => String(k).toLowerCase()))
const keyOf = (c) => (c.source + '|' + c.feature + '|' + String(c.claim || '').slice(0, 60)).toLowerCase()
// ---------------------------------------------------------------- Find (fresh runs and top-ups)
phase('Find')
let freshClaims = []
if (FIND_ANGLES.length) {
  const ex = EXEMPLARS.find(e => e.key === NAME)
  let found = []
  if (ex) found = await batched(ANGLES.filter(a => FIND_ANGLES.includes(a.key)), (an) => agent(
    `You are a research finder. Subject: the prose STYLE of ${ex.name} (${ex.notes}). Angle: ${an.prompt}. Use WebSearch and WebFetch; READ every source you cite (fetch it), never rely on a search snippet. Find as many substantive sources as this angle yields (aim for 10–20; stop when two consecutive searches return nothing new). For each source list it (title, url, kind, substantive true/false). Extract CLAIMS about concrete prose features: each claim names the feature (e.g. 'register modulation', 'Anglo-Saxon diction', 'two-sentence boxed text'), states it in one sentence, names the source and url, and carries at most one verbatim quotation under twelve words (or an empty string). Never reproduce copyrighted passages beyond twelve words. Write your raw notes to ${OUT}/find-${ex.key}-${an.key}.md and return the structured result.`,
    { label: `find:${ex.key}:${an.key}`, phase: 'Find', schema: FINDINGS }))
  else if (NAME === 'ai') found = await batched(AI_ANGLES.filter(a => FIND_ANGLES.includes(a.key)), (an) => agent(
    `You are a research finder. Subject: where generated (LLM) prose FAILS against skilled human fiction and game writing. Angle: ${an.prompt}. Use WebSearch and WebFetch; READ every source you cite; aim for 10–20 substantive sources, stop after two consecutive dry searches. For each source list it; extract CLAIMS as concrete failure modes (feature, one-sentence claim, source, url, one verbatim quotation under twelve words or empty). Write raw notes to ${OUT}/find-ai-${an.key}.md and return the structured result.`,
    { label: `find:ai:${an.key}`, phase: 'Find', schema: FINDINGS }))
  else throw new Error(`unknown sweep name ${NAME}`)
  const all = found.filter(Boolean).flatMap(r => r.claims || [])
  const seen = new Set(EXISTING)
  for (const c of all) { const k = keyOf(c); if (!seen.has(k)) { seen.add(k); freshClaims.push(c) } }
  log(`found ${all.length} claims across ${FIND_ANGLES.length} angle(s), ${freshClaims.length} NEW after dedupe (${EXISTING.size} already in the state), from ${found.filter(Boolean).reduce((n, r) => n + (r.sourcesRead || []).length, 0)} sources read`)
}
// ---------------------------------------------------------------- Verify
phase('Verify')
const VERDICTS = { type: 'object', required: ['verdicts', 'wroteFile'], properties: { wroteFile: { type: 'boolean' }, verdicts: { type: 'array', items: { type: 'object', required: ['index', 'verdict', 'trueWording', 'note'], properties: { index: { type: 'integer' }, verdict: { type: 'string', enum: ['VERIFIED_VERBATIM', 'VERIFIED_SUBSTANCE', 'NOT_FOUND', 'CONTRADICTED', 'BLOCKED'] }, trueWording: { type: 'string' }, note: { type: 'string' } } } } } }
const chunks = RESUME ? args.chunks.map((c) => ({ file: c.file, indices: c.indices, inline: null })) : []
for (let i = 0; i < freshClaims.length; i += CHUNK) { const part = freshClaims.slice(i, i + CHUNK); chunks.push({ file: null, indices: part.map((_, j) => BASE_INDEX + i + j), inline: part.map((c, j) => ({ index: BASE_INDEX + i + j, ...c })) }) }
chunks.forEach((ch, k) => { ch.k = k; ch.tag = `i${ch.indices[0]}-${ch.indices[ch.indices.length - 1]}` })   // verdict files are named by INDEX RANGE, so a top-up never overwrites an earlier run's file
log(`verification: ${chunks.reduce((n, c) => n + c.indices.length, 0)} claims to verify in ${chunks.length} chunks of up to ${CHUNK} (${RESUME ? 'state chunks; ' + (args.verifiedCount || 0) + ' already verified; ' : ''}${freshClaims.length} fresh)`)
const RULE = 'For each claim report its index and: VERIFIED_VERBATIM only if the quotation appears on the page word for word; VERIFIED_SUBSTANCE if the page supports the claim in other words (give the true wording, under twelve words); NOT_FOUND if the page does not support it; CONTRADICTED if it says otherwise; BLOCKED only if the page cannot be fetched by any route. Default to NOT_FOUND when uncertain. Return one verdict per index, every index.'
const results = await batched(chunks, (ch) => agent(
  (ch.file
    ? `Read the JSON file ${ch.file} — it holds ${ch.indices.length} attributed claims (fields: index, feature, claim, source, url, quote). `
    : `Here are ${ch.indices.length} attributed claims as JSON: ${JSON.stringify(ch.inline)}\n\n`)
  + `Adversarially verify EACH claim by fetching its source as RAW text (WebFetch the url; group the claims by url and fetch each url ONCE; if a host blocks, try the Wayback Machine once, else BLOCKED). ${RULE}\n\nBEFORE you return, WRITE the checkpoint file ${OUT}/verdicts-${NAME}-${ch.tag}.json as JSON of the form {"name":"${NAME}","chunk":${ch.k},"claims":[the ${ch.indices.length} claims exactly as given, each with its index],"verdicts":[your ${ch.indices.length} verdicts: {index, verdict, trueWording, note}]} — the file is the record that survives a session death; then return the same verdicts as your structured output with wroteFile true (false only if the write failed).`,
  { label: `verify:${NAME}:${ch.tag}`, phase: 'Verify', schema: VERDICTS, model: 'opus' }).then(v => ({ ch, v })))
const verdictMap = {}
let unwritten = []
for (const r of results.filter(Boolean)) { for (const v of (r.v.verdicts || [])) verdictMap[v.index] = v; for (const i of r.ch.indices) if (!verdictMap[i]) verdictMap[i] = { index: i, verdict: 'NOT_FOUND', trueWording: '', note: 'no verdict returned for this index' }; if (!r.v.wroteFile) unwritten.push(r) }
const missing = chunks.filter(ch => !results.filter(Boolean).some(r => r.ch.k === ch.k))
if (missing.length) log(`⚠ ${missing.length} verifier chunk(s) returned nothing (skipped or died): ${missing.map(c => c.k).join(', ')} — their indices stay unverified in the state; re-run to cover them`)
if (unwritten.length) {
  log(`${unwritten.length} verifier(s) reported wroteFile=false — writing their checkpoint files from the returned verdicts`)
  await batched(unwritten, (r) => agent(`Write the file ${OUT}/verdicts-${NAME}-${r.ch.tag}.json with EXACTLY this JSON content (create the directory if needed) and return the byte count you wrote:\n${JSON.stringify({ name: NAME, chunk: r.ch.k, claims: r.ch.inline || null, claimsFile: r.ch.file, verdicts: r.v.verdicts })}`, { label: `checkpoint:${NAME}:${r.ch.tag}`, phase: 'Verify', effort: 'low' }))
}
const kept = Object.values(verdictMap).filter(v => v.verdict === 'VERIFIED_VERBATIM' || v.verdict === 'VERIFIED_SUBSTANCE').length
log(`verified this run: ${kept} of ${Object.keys(verdictMap).length} survive (${results.filter(Boolean).length} of ${chunks.length} verifier chunks returned)`)
// ---------------------------------------------------------------- Synthesize
phase('Synthesize')
const ABOUT = NAME === 'ai' ? 'the catalogue of where generated prose FAILS against skilled human fiction and game writing' : `the prose style of ${(EXEMPLARS.find(e => e.key === NAME) || {}).name || NAME}`
const section = await agent(
  `First run, in a shell: \`cd ${KIT} && node sweep-state.mjs merge ${NAME} --update-state\` — it merges the state file${STATE_FILE ? ` (${STATE_FILE})` : ''} with every verdicts-${NAME}-*.json the verifiers wrote (this run's and any earlier run's) and writes ${OUT}/kept-${NAME}.json (the VERIFIED_VERBATIM / VERIFIED_SUBSTANCE claims only, each with its index, source, url, quote and verdict.trueWording). Read that file (with Read, in pieces if it is long). Then write the dossier section for "${NAME}" — ${ABOUT} — from those VERIFIED claims only. Structure: numbered concrete features, each with the critics/sources that support it (count them; cite by index), the true wording of any quotation (under twelve words), and the reconstruction rule it implies for a settlement dossier written as a calm archivist (present tense, concrete civic nouns, no digits, no em dash). Mark disagreements between sources explicitly. A feature resting on ONE source is flagged as such. End with a coverage table: sources per angle, and the verdict counts (verified / not found / contradicted / blocked). Write it to ${OUT}/section-${NAME}.md and return the markdown.`,
  { label: `synth:${NAME}`, phase: 'Synthesize' })
const critic = await agent(`You are the completeness critic for the sweep "${NAME}". Read ${OUT}/section-${NAME}.md, ${OUT}/kept-${NAME}.json and the find-${NAME}-*.md notes in ${OUT} (if present). List what is MISSING: an angle not run, a well-known critic or study absent (name them), a claim that rests on one source, a copyright risk (a quotation over twelve words), a verdict that looks wrong on its face (a VERIFIED claim whose quote is not on its page, a NOT_FOUND that a second route would find), and any feature the section contradicts itself on. Return a markdown list with a recommended next round of searches. Write it to ${OUT}/critic-${NAME}.md.`, { label: `critic:${NAME}`, phase: 'Synthesize' })
return { name: NAME, resumed: RESUME, findAngles: FIND_ANGLES, freshClaims: freshClaims.length, chunks: chunks.length, chunksReturned: results.filter(Boolean).length, verifiedThisRun: Object.keys(verdictMap).length, keptThisRun: kept, missingChunks: missing.map(c => c.k), sectionChars: (section || '').length, critic }
