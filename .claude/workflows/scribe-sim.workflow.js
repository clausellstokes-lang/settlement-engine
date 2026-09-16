export const meta = {
  name: 'scribe-sim',
  description: 'The Scribe pilot without an API key: fresh-context model seats write each cell from the exact brief/town/turn/schema, a second seat answers the tier-1 checklist, the product\'s own judge scores both, and the script aggregates the numbers that decide model-per-tab, the order arm and the invented-mechanism rate',
  phases: [
    { title: 'Write', detail: 'one writer seat per (cell, model) reads only the prompt files and writes response-<seat>.json' },
    { title: 'Read', detail: 'one Opus reader per (cell, seat): builds the tier-1 checklist, answers it, runs the one judge, returns the figures' },
  ],
}
// args: { harness: '<abs path to scribe-harness>', cells: [{seed, type, tab, name}], seats: ['opus','sonnet'] }
const H = String(args.harness)
const CELLS = Array.isArray(args.cells) ? args.cells : []
const SEATS = Array.isArray(args.seats) && args.seats.length ? args.seats : ['opus', 'sonnet']

const WRITE_SCHEMA = {
  type: 'object',
  properties: {
    unitsWritten: { type: 'integer' },
    notes: { type: 'array', items: { type: 'string' } },
  },
  required: ['unitsWritten', 'notes'],
}
const READ_SCHEMA = {
  type: 'object',
  properties: {
    poolsOnCard: { type: 'integer' },
    unitsReturned: { type: 'integer' },
    tier0Kept: { type: 'integer' },
    tier0Dropped: { type: 'integer' },
    tier1Dropped: { type: 'integer' },
    finalKept: { type: 'integer' },
    pass: { type: 'integer' },
    withheld: { type: 'integer' },
    fail: { type: 'integer' },
    arms: { type: 'array', items: { type: 'string' }, description: 'every FAIL/WITHHELD arm name that appeared, one entry per unit it appeared on (duplicates allowed)' },
    tier1Yes: { type: 'object', description: 'yes LINES per question key exactly as the checklist names them (the six contradiction tests: field, page, roster, model, record, forecast — or whatever keys tier1-schema.json carries)', properties: {
      field: { type: 'integer' }, page: { type: 'integer' }, roster: { type: 'integer' }, model: { type: 'integer' },
      record: { type: 'integer' }, forecast: { type: 'integer' },
    }, additionalProperties: { type: 'integer' } },
    refusedLines: { type: 'array', items: { type: 'object', properties: { question: { type: 'string' }, line: { type: 'string' }, because: { type: 'string' } }, required: ['question', 'line', 'because'] }, description: 'every line you answered yes on, with the question key and the card fact or page line it contradicts' },
    judgeLine: { type: 'string', description: 'the judge\'s printed "verdicts {...} · kept N · dropped N (tier 1 took N) …" line verbatim' },
    notes: { type: 'array', items: { type: 'string' } },
  },
  required: ['poolsOnCard', 'unitsReturned', 'tier0Kept', 'tier0Dropped', 'tier1Dropped', 'finalKept', 'pass', 'withheld', 'fail', 'arms', 'tier1Yes', 'refusedLines', 'judgeLine', 'notes'],
}

const items = []
for (const cell of CELLS) for (const seat of SEATS) items.push({ ...cell, seat })
log(`${items.length} (cell, seat) pairs over ${CELLS.length} cells and ${SEATS.length} seats`)

const results = await pipeline(
  items,
  (it) => agent(
    `You are standing in for the model behind an Anthropic Messages API call, so a harness can be tested without an API key. Behave exactly as the API model would. The SYSTEM prompt is TWO cached blocks, in this order: the whole content of brief.md, then the whole content of town.md. The USER turn is the whole content of turn.md. The required output is a JSON object matching the JSON Schema in schema.json. Read all four files completely (they are long; read them whole, not in excerpts).

Files (absolute paths), all in ${H}/out/sim/${it.seed}/${it.tab}/ :
- brief.md   (system block 1)
- town.md    (system block 2)
- turn.md    (user turn)
- schema.json (output schema)

Rules of the simulation:
1. Do what the system prompt and user turn ask, and nothing else. Do not consult any other file, the codebase, or any memory. Those four files are your entire world, as they would be for the API model.
2. Produce ONE unit per pool the turn lists, under the schema, with blockId, poolKey and vid copied exactly from the turn; faces in the same number and order the turn gives; notebook as the rules say.
3. Write the JSON object (only the JSON object, no fences, no commentary) with the Write tool to:
   ${H}/out/sim/${it.seed}/${it.tab}/response-${it.seat}.json
4. Return unitsWritten and up to five short notes on anything in the prompt that was unclear, contradictory or missing from the model's point of view. Do not paste the prose into the notes.`,
    { label: `write:${it.name}:${it.tab}:${it.seat}`, phase: 'Write', model: it.seat, schema: WRITE_SCHEMA },
  ),
  (written, it) => (written && written.unitsWritten > 0 ? agent(
    `You are the SECOND READER of a rendered settlement-dossier page, standing in for the tier-1 model call of the Scribe, and then the operator of its judge. Work in ${H} (a node project; run commands with the Bash tool from that directory).

Step 1 — build the checklist for the writer's units:
  node simulate.mjs tier1 --seed ${it.seed} --tab ${it.tab} --type ${it.type} --response out/sim/${it.seed}/${it.tab}/response-${it.seat}.json --tag ${it.seat}
It writes out/sim/${it.seed}/${it.tab}/tier1-${it.seat}.md (the prompt you must answer) and tier1-schema.json (your answer's schema). If it prints SCHEMA FAIL, stop and return zeros with the reason in notes.

Step 2 — answer it AS THE MODEL WOULD. The product sends the second reader the SAME two cached system blocks the writer had, then the checklist as the user turn: so read brief.md and town.md whole (system blocks 1 and 2, in ${H}/out/sim/${it.seed}/${it.tab}/), then tier1-${it.seat}.md whole (the user turn) and tier1-schema.json whole. The checklist gives the facts and numbered lines and asks yes/no questions per line; EVERY question is a CONTRADICTION test (the standard is: a line is refused for contradicting the settlement, never for adding to it — a practice, a motive, a custom or an absence on an unknown field is not a contradiction). Answer every line honestly and strictly from the facts printed in the files — and write the JSON answers object (only the object) with the Write tool to:
  ${H}/out/sim/${it.seed}/${it.tab}/answers-${it.seat}.json

Step 3 — run the one judge with both readers:
  node simulate.mjs judge --seed ${it.seed} --tab ${it.tab} --type ${it.type} --response out/sim/${it.seed}/${it.tab}/response-${it.seat}.json --tier1 out/sim/${it.seed}/${it.tab}/answers-${it.seat}.json --tag ${it.seat}
Read its full output. Return the figures exactly as printed: poolsOnCard, unitsReturned, tier0Kept/tier0Dropped (from the tier1 step's "tier 0 kept X of Y units and dropped Z" line), tier1Dropped and finalKept (from the judge line), pass/withheld/fail from the verdicts tally, every FAIL/WITHHELD arm name printed (one entry per unit), your own tier-1 yes counts per question key, every line you said yes to with its question and the fact it contradicts, the judge line verbatim, and notes.`,
    { label: `read:${it.name}:${it.tab}:${it.seat}`, phase: 'Read', model: 'opus', schema: READ_SCHEMA },
  ) : null),
)

const rows = []
results.forEach((r, i) => { if (r) rows.push({ ...items[i], ...r }) })
const by = (key) => {
  const acc = {}
  for (const r of rows) {
    const k = r[key]
    if (!acc[k]) acc[k] = { cells: 0, pools: 0, returned: 0, tier0Kept: 0, tier0Dropped: 0, tier1Dropped: 0, finalKept: 0, pass: 0, withheld: 0, fail: 0, t1: {}, arms: {} }
    const a = acc[k]
    a.cells += 1; a.pools += r.poolsOnCard; a.returned += r.unitsReturned
    a.tier0Kept += r.tier0Kept; a.tier0Dropped += r.tier0Dropped; a.tier1Dropped += r.tier1Dropped; a.finalKept += r.finalKept
    a.pass += r.pass; a.withheld += r.withheld; a.fail += r.fail
    for (const [k, v] of Object.entries(r.tier1Yes || {})) a.t1[k] = (a.t1[k] || 0) + (v || 0)
    for (const arm of r.arms) a.arms[arm] = (a.arms[arm] || 0) + 1
  }
  return acc
}
log(`${rows.length} of ${items.length} pairs returned`)
return { pairs: rows.length, of: items.length, bySeat: by('seat'), byTab: by('tab'), byTier: by('type'), rows }
