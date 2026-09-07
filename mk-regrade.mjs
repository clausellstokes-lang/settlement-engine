import { readFileSync, writeFileSync } from 'node:fs';
const SW='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep/';
const kept=JSON.parse(readFileSync(SW+'kept-hobb.json','utf8'));
const byIdx=new Map(kept.map(c=>[c.index,c]));

const LIMBS={
6:"\"becomes baggage that alters later action\" — the verifier's note says the claim's 'alters' is firmer than the page's 'it may affect what they do'; the page states a possibility, the claim a consequence.",
10:"\"the pacing at the start of ANY of her books is deliberately much slower\" — the verifier's note says the claim drops the page's 'usually' hedge, so the page's typical case is stated as a universal rule.",
18:"\"to write any viewpoint\" — the verifier's note says the page frames the coat move as 'when I am writing from a tight third-person point of view', not as a practice for any viewpoint.",
20:"\"as Hobb she sprawls\" — the verifier's note says the sprawl sentence is unqualified by pen name on the page; the Hobb-specific attribution of the sprawl is the claim's, drawn from a separate answer.",
34:"the sourcing of the kitchen/hall observation — the verifier's note says the quoted line sits inside the interviewer's question (quoting Fitz), not in Hobb's own words, and that Hobb disclaims having planned the detail ('you are giving me too much credit for thinking ahead').",
35:"\"a character on the frontier\" — the verifier's note says the page's setting wording is 'a small subsistence farmer with a few chickens or pigs and some fish from the stream'; 'frontier' is not on the page.",
82:"\"Oliver names ... its continual insistence\" as the most striking element — the verifier's note says Oliver hedges with 'Perhaps the most striking', which the claim drops, turning a conjecture into an assertion.",
94:"\"Mendlesohn ... disputes the authority\" — the verifier's note says Mendlesohn calls the circular argument 'nonetheless valid' and that the disputing-authority gloss is Oliver's reading of her as much as hers.",
96:"\"records two late breaches\" — the verifier's note says 'two' is not an exhaustive count of the breaches Oliver records; he introduces them among 'several instances' and calls the chapter-15 epigraph the best example.",
134:"\"Hobb's novels reframe the traditional rape script\" — the verifier's note says the claim drops the abstract's hedge, which reads 'seem to reframe this pattern'.",
135:"\"animals and plants MATCHING North American flora and fauna\" — the verifier's note says Elliott hedges 'animals and plants that seem to line up with', which the claim hardens into a match.",
136:"\"drew ITS TEXTS from a set of authors including Robin Hobb\" — the verifier's note says these are the study's 20 validation 'experimental texts', not the main EmoBank-derived corpus the study is built on.",
229:"\"Oliver names Hobb's most striking stylistic element negative narration\" — the verifier's note says Oliver hedges twice ('Perhaps', 'a style we might think of as') where the claim asserts flatly.",
260:"\"she averages about 25 pages an hour, or 200 pages a day\" — the verifier's note says the page prefixes it 'Going full out' and adds that the work 'often stretches to a week and a half'; the claim states a peak rate as an average.",
297:"\"the same rooms are galley, head and deck ... kitchen, bathroom and floor\" — the verifier's note says deck/floor is not a room, so 'the same rooms' is the claim's compression, not the transcript's; it also notes the nautical terms are not explicitly assigned to the husband.",
333:"\"the trilogy's plot lines\" and \"a FAMILY'S debt\" — the verifier's note says the reviewer writes 'the book' in that sentence, and that the page says 'as debt repayment' without naming whose debt.",
335:"\"his fathering of an unacknowledged bastard as a comment on chivalric constructions\" — the verifier's note says Elliott offers this as one of two disjuncts ('either a failure on his part or a comment by Hobb'), which the claim flattens into his sole reading.",
350:"\"Oliver names the book's most striking stylistic element\" — the verifier's note says Oliver hedges with 'Perhaps the most striking' and the claim drops the hedge.",
357:"\"other CRITICS treat the fictional epigraph as a genre tic\" — the verifier's note says Oliver attributes the comment to 'readers', not critics, and adds that he knows of only two critical studies focusing on epigraphs in fantasy.",
375:"the reviewer's gender ('he') — the verifier's note states outright that this detail is unsupported and that the page does not state it, then waives it as 'too trivial to downgrade'."
};

const order=[6,10,18,20,34,35,82,94,96,134,135,136,229,260,297,333,335,350,357,375];
const claims=[]; const verdicts=[];
for(const i of order){
  const row=byIdx.get(i);
  if(!row) throw new Error('missing index '+i);
  const {verdict, ...claim}=row;
  claims.push(claim);
  verdicts.push({index:i, verdict:'PARTIAL', trueWording:verdict.trueWording||'', note:verdict.note||'', unsupportedLimb:LIMBS[i]});
}
const out={name:'hobb', regrade:true, claims, verdicts};
writeFileSync(SW+'verdicts-hobb-regrade-r4.json', JSON.stringify(out,null,1));
console.log('claims',claims.length,'verdicts',verdicts.length,'indices',order.join(','));
console.log('missingLimb', verdicts.filter(v=>!v.unsupportedLimb).length);
