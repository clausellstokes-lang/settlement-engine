export const meta = {
  name: 'fp-final-p5a-census',
  description: 'P5a of the FP final architecture program: twelve seats — the owner-words seat (Fable), the rulings trace (Opus) and ten wiring-census lanes, one per volume (Opus) — writing the inputs of the P5b synthesis critic',
  phases: [{ title: 'Census', detail: 'WORDS (Fable) · RULINGS · WC-{BD,FOLD,PL,MN,RN,CH,PT,PS,ST,PR} (pool 4)' }],
}
const KIT = '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17'
const DOCS = '/Users/cstokes/Desktop/settlement-engine/docs'
const SCHEMA = { type: 'object', properties: { lane: { type: 'string' }, path: { type: 'string' }, counts: { type: 'string' }, findings: { type: 'array', items: { type: 'string' } }, confirmedVsPlausible: { type: 'string' } }, required: ['lane', 'path', 'counts', 'findings', 'confirmedVsPlausible'] }
async function pool(items, n, fn) { const r = new Array(items.length); let i = 0; const w = Array.from({ length: Math.min(n, items.length) }, async () => { while (i < items.length) { const k = i++; try { r[k] = await fn(items[k], k) } catch (e) { r[k] = null; log(`item ${k} threw: ${String(e).slice(0, 200)}`) } } }); await Promise.all(w); return r }
const COMMON = `Chair 6eb7b5b6 (Fable 5.1; the program of chairs a73343ed and 0a2e8bd9), the FP final architecture program, P5a. Read ${KIT}/README.md (RESUME BLOCK 2 and the laws section at its end) first. The code of record is the detached master worktree named in ${KIT}/briefs/RESEARCH-COMMON.md (READ-ONLY; the ledger's src/ is a fossil). Never git; never the test suite; save as you go; stop and report at ~300k tokens of your own context saying what is left. REPORT DIET ≤350 words + one table trimmed to the non-OK or BLOCKING/MAJOR rows, outcome first. Structured return exactly as your brief lists (lane; path; counts; findings; confirmedVsPlausible).`
const SEATS = [
  { id: 'WORDS', model: 'fable', effort: 'xhigh', prompt: `${COMMON} YOUR SEAT: THE OWNER'S WORDS AGAINST THE TEN VOLUMES — read ${KIT}/briefs/WORDS-P5.md WHOLE and do exactly what it says; your output is ${KIT}/assessments/P5-WORDS-2026-10-20.md. Lane id WORDS.` },
  { id: 'RULINGS', model: 'opus', effort: 'high', prompt: `${COMMON} YOUR SEAT: THE RULINGS TRACE — read ${KIT}/briefs/RULINGS-P5.md WHOLE and do exactly what it says; your output is ${KIT}/assessments/P5-RULINGS-2026-10-20.md. Lane id RULINGS.` },
  ...[['BD', 'xhigh'], ['FOLD', 'xhigh'], ['PL', 'high'], ['MN', 'high'], ['RN', 'high'], ['CH', 'high'], ['PT', 'high'], ['PS', 'high'], ['ST', 'high'], ['PR', 'high']].map(([v, effort]) => ({
    id: `WC-${v}`, model: 'opus', effort,
    prompt: `${COMMON} YOUR SEAT: WIRING-CENSUS LANE WC-${v} — read ${KIT}/briefs/CENSUS-P5.md WHOLE and do exactly what it says over ${v === 'FOLD' ? `the coherence fold ${DOCS}/DESIGN_FP_COHERENCE_FOLD.md — for the fold the ROWS are different: one row per ENGAGEMENT-REGISTRY KIND in §3.4 (kind · owner volume · whether that volume's hearings table still defines it with a WHERE and a default verdict · class), one row per VOCABULARY TOKEN in §5 that the nine fp-final volumes PL·MN·RN·CH·PT·PS·ST·PR·BD mint or cite (registered · used by which volume · class — a token minted in a volume's ontology but absent from §5 is INAPPROPRIATE; a §5 row nothing uses is DEAD END), one row per CHAIN in §6 among C0 · C0.5 · C11–C17 (its prerequisites named · its owner volume's waves exist · class), and one row per §7 OWNER ROW OD-FC-45..85 (its subject exists in a volume · class); keep the same column header and the same counts line` : `the volume ${DOCS}/DESIGN_FP_ARCH_${v}.md`}; your output is ${KIT}/assessments/census/WC-${v}.md. Lane id WC-${v}.`,
  })),
]
phase('Census')
const out = await pool(SEATS, 4, (s) => agent(s.prompt, { label: `p5a:${s.id}`, phase: 'Census', model: s.model, effort: s.effort, schema: SCHEMA }))
log('p5a done: ' + SEATS.map((s, i) => `${s.id}:${out[i] ? (out[i].counts.slice(0, 60) + ' / ' + out[i].findings.length + ' findings') : 'null'}`).join(' · '))
const result = {}
SEATS.forEach((s, i) => { result[s.id] = out[i] })
return result
