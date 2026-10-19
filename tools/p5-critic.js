export const meta = {
  name: 'fp-final-p5-critic',
  description: 'P5 of the FP final architecture program: ONE completeness critic reads every owner word on the BOARD against the ten volumes after P4 and runs the wiring census (chair-notes 19)',
  phases: [{ title: 'Critic', detail: 'CRITIC-P5 (one seat)' }],
}
const KIT = '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17'
const SCHEMA = { type: 'object', properties: { path: { type: 'string' }, censusPath: { type: 'string' }, wordsChecked: { type: 'integer' }, missing: { type: 'integer' }, contradicted: { type: 'integer' }, deadEnds: { type: 'integer' }, shells: { type: 'integer' }, inappropriate: { type: 'integer' }, blocking: { type: 'integer' }, major: { type: 'integer' }, defend: { type: 'array', items: { type: 'string' } }, confirmedVsPlausible: { type: 'string' } }, required: ['path', 'censusPath', 'wordsChecked', 'missing', 'contradicted', 'deadEnds', 'shells', 'inappropriate', 'blocking', 'major', 'defend', 'confirmedVsPlausible'] }
phase('Critic')
const r = await agent(`Chair 0a2e8bd9 (Fable 5.1), the FP final architecture program, P5 THE COMPLETENESS CRITIC. Read ${KIT}/briefs/CRITIC-P5.md WHOLE and do exactly what it says (Part 1 the owner's words against the ten volumes; Part 2 the wiring census; the two output files it names; never edit anything else; never git; never tests). The volumes stand after round 5 and the P4 fold pass. Structured return as the brief lists.`, { label: 'critic:P5', phase: 'Critic', model: 'fable', effort: 'xhigh', schema: SCHEMA })
return r
