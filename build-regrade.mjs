import { readFileSync, writeFileSync } from 'node:fs';
const SW = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep';
const kept = JSON.parse(readFileSync(SW + '/kept-ai.json', 'utf8'));
const by = new Map(kept.map(k => [k.index, k]));

const D = {
  8:  ['PARTIAL', '"professional-style rewriting" — the edit was Gemini\'s own LAMP span-level artifact removal, not rewriting by professionals.'],
  10: ['PARTIAL', 'the 66%-verbs/16%-adjectives split holds only of the 319 excess STYLE words, and pivotal, realm and meticulously are not in Kobak\'s own excess list.'],
  11: ['PARTIAL', '"consistent with RLHF as the source" — the paper reports mixed evidence, only that testing is "consistent with RLHF playing a role", not a demonstrated source.'],
  12: ['PARTIAL', '"readers may judge a text on those words rather than its content" — the paper says this of rushed RLHF evaluators, not of readers generally.'],
  22: ['PARTIAL', 'the p<0.05-to-p<0.0001 range and the lexical-vs-semantic split of diversity appear nowhere on the cited abstract page.'],
  23: ['PARTIAL', 'the verbosity evidence (more unique words, longer dependency paths, more nouns and adjectives) is absent from the page — zero hits on every search term.'],
  25: ['CONTRADICTED', '"stories 10.7% more similar to one another" — the paper\'s 10.7% is a share of the similarity score\'s total range, not a similarity increase, and 5.2% is the one-idea condition alone.'],
  33: ['PARTIAL', 'the 2.6x "that"-clause and 1.9x phrasal-coordination rates are GPT-4o-specific, not all instruction-tuned models, and "academic" is not the paper\'s word.'],
  37: ['PARTIAL', '"templates" — the paper files "sense of / weight of / mix of" under recurrent awkward words and phrases, reserving "syntactic templates" for its POS n-gram analysis.'],
  40: ['PARTIAL', '"resolved immediately after it peaks" — the paper\'s drop measures an element dropped or hastily closed off, sometimes left unresolved, not strictly resolved.'],
  42: ['PARTIAL', '"about 10–15% earlier" — the strings 10% and 15% appear nowhere in the paper; the advancement of TP4/TP5 is reported only qualitatively and in a violin plot.'],
  47: ['PARTIAL', 'the LLM edge-weight floor is 0.235 (GPT-4o Mini), not 0.236, and "far less variability" is not borne out per-metric — human density SD (0.056) is lower than every model\'s.'],
  52: ['PARTIAL', 'the action-space deficit is not universal — GPT 4.1 stays close to or above the human baseline; only Gemma 3, Mistral 3.2 and LlaMA 3.3 fall below it.'],
  59: ['PARTIAL', 'the GPT-4 creativity figures 0.97 (English) and 0.88 (Spanish) do not appear anywhere in the page text; they sit inside a non-machine-readable figure.'],
  65: ['PARTIAL', '"humans led only on originality" is not strictly true — humans also edged GPT-4 on humor, 6.4 vs 6.0.'],
  68: ['PARTIAL', 'STTR 0.424 is Falcon-7B alone, the lowest model, not an LLM-wide value; the model range is 0.424–0.466.'],
  69: ['PARTIAL', 'the blanket "magnify male-pronoun bias" elides Falcon 7B, the one model that reduces the bias (by 7.5%).'],
  70: ['PARTIAL', 'the 54–72% / 114–133% / 111–152% ranges hold only in the factual-news columns; the fake-news columns are materially lower (posemo +70 to +79%, certain +21 to +39%).'],
  78: ['PARTIAL', '"32% of GPT-4 game lines" drops the paper\'s "rated by at least one player" qualifier — a mild overstatement.'],
  82: ['PARTIAL', 'the defect list is misattributed — thematic focus, out-of-character dialogue and thin character development come from the authors\' own preliminary experiments, not from the blind screenwriter evaluation.'],
  83: ['PARTIAL', 'misattributed — "unconvincing, repetitive, tonally misaligned" and "overly positive or uninspired endings" are the authors citing prior literature; only the genre item is an expert-panel finding.'],
  85: ['PARTIAL', '"soulless" is Josh Bernoff quoted inside the post and "no subtext, no psychological reasoning" is a reader\'s comment, not the cited editor\'s own observations.'],
  88: ['PARTIAL', '"everyone says what they mean" is the claimant\'s gloss and is not stated on the page.'],
  89: ['PARTIAL', '"expository" is the claim\'s gloss; the paper\'s feature is "philosophical debate" as a dialogue function.'],
  94: ['PARTIAL', 'attribution — the wording is Ted Chiang\'s, quoted by LitReactor from The New Yorker, not the cited author\'s own.'],
  95: ['PARTIAL', 'attribution — both the quoted line and the one-choice-per-word arithmetic are Ted Chiang\'s, quoted inside Michel\'s essay, not Michel\'s.'],
  99: ['PARTIAL', '"even rhythm" — Bernoff writes "a boring, even tone", not even rhythm.'],
  102: ['PARTIAL', 'the "becoming recognizable as an AI pattern" quote closes the COMMA + LIKE/AS IF section and does not attach to the fragment-paragraph or em-dash tells.'],
  104: ['PARTIAL', '"Gemini paragraphs are nearly identical in length" — the page reports a sentence COUNT (4–5 per paragraph), not paragraph length.'],
  105: ['PARTIAL', 'the causal framing (cadence "built from" objective correlatives and enjambment) is the summarizer\'s synthesis; the page lists them as co-occurring tells.'],
  110: ['PARTIAL', '"coordinates neither well" overstates — the abstract pins autoregression to the surprise/inevitability challenge only.'],
  111: ['PARTIAL', '"force closure" and "final lines" are the summarizer\'s gloss on what the source offers as a parenthetical self-referential joke.'],
  114: ['PARTIAL', '"feels obligatory rather than natural" is the summarizer\'s characterization; the page says only that the construction is "universal".'],
  116: ['PARTIAL', 'the "says absolutely nothing at all" line is the article\'s opener about machine prose generally, not about the "isn\'t just X; it\'s Y" + metaphor + tricolon template.'],
  118: ['PARTIAL', 'attribution — "AI explains. Humans imply." is quoted from a Mohammad Siam reply on X, not the Dramatica post\'s own formulation.'],
  123: ['PARTIAL', '"realm" occurs zero times on the page, and "delve" is listed only for the 2023–mid-2024 era as dropping off sharply in 2025.'],
  129: ['PARTIAL', 'the sensory-overload ("eyeball kicks") half rests on the author\'s citation of Nostalgebraist rather than his own evidence, and he notes newer models have improved.'],
  131: ['PARTIAL', '"an inversion of the usual AI-tells-emotions assumption" is the claim author\'s gloss, not the paper\'s framing.'],
  138: ['PARTIAL', '"triplets of descriptors" — the source describes stacked tricolons (rule of three), not descriptor triplets.'],
  143: ['PARTIAL', 'the trailing clause "the tells above characterize prompted default-register output" is the analyst\'s own inference and is not in the paper.'],
  144: ['PARTIAL', '"identified authorship at chance" — experiment 2 was 39.93%, below chance; only experiment 3 (51.97%) was at chance.'],
  148: ['PARTIAL', 'the intensifier "far fewer subplots" is not in the source, which says only "fewer subplots" with no magnitude.'],
  149: ['PARTIAL', '"AI stories stay chronological" — the source is strictly comparative (humans use MORE) and never asserts the absolute.'],
  150: ['PARTIAL', '"rather than character-driven exchange" is the analyst\'s gloss; the page does not use that phrase.'],
  153: ['PARTIAL', '"clichés and filler" at 17% conflates two categories — 17% is Clichés alone; filler sits under the 18% Unnecessary/Redundant Exposition row.'],
  160: ['PARTIAL', 'the ten-thousand-choices arithmetic is Ted Chiang\'s, block-quoted by Michel, and the page says a hundred choices, not "almost none".'],
  166: ['PARTIAL', 'scope — the poem was an AI generator\'s pastiche of a friend\'s style posted for a laugh, not a slush submission.'],
  167: ['PARTIAL', '"the worst ever received" overstates Clarke\'s "among the worst submissions we\'ve ever received".'],
  172: ['PARTIAL', '"they drove submissions to 2,800 in two weeks" — AI is called "a big reason", not the sole cause, and the open period ran 15 days.'],
  180: ['PARTIAL', '"without a governing restraint" is the researcher\'s gloss, not the page\'s words.'],
  190: ['PARTIAL', 'attribution is wrong — the quoted phrase is Negrek\'s (thread starter, post #1), not Goolix\'s as the row\'s source states.'],
  191: ['PARTIAL', '"declining to examine emotion with specificity" is the researcher\'s gloss; the source frames the tell as generic vagueness.'],
  193: ['PARTIAL', 'the three-fragment string is a composite that appears nowhere contiguously, and both passages are Negrek\'s, not Goolix\'s.'],
  197: ['PARTIAL', 'fluorescent, humming and particular appear zero times on the cited repo page, and the quote illustrates only what a trigram is — the repo supports the mechanism half alone.'],
  207: ['PARTIAL', 'the page never uses the brand name "ACE"; it is the Nvidia/Convai demo (Riva, NeMo, Audio2Face).'],
  210: ['PARTIAL', 'only the genre item comes from the n=10 Delphi expert panel; the endings and uneven-quality items are the paper citing prior studies, and "unconvincing, repetitive" is the authors\' intro framing.'],
  215: ['PARTIAL', '"on ethics and livelihood grounds" is explicit for only two entries — Paizo, Chaosium, WotC, Renegade and Stonemaier are listed with no stated grounds, and Free League\'s stated policy is against AI art.'],
  216: ['PARTIAL', '"human creators now fear tripping the same alarm" — the voiced fear is about ART styles, not prose.'],
  220: ['PARTIAL', '"because the story felt artificial" overstates a single causal chain — the ChatGPT accusation was one belligerent review; the felt-artificial vibe came from other reviews.'],
  223: ['CONTRADICTED', '"em dash frequency has stayed high for centuries" is contradicted — the page states usage "does drop away after the mid-\'90s"; only relative dominance survives (and the supplied quote supports detector unreliability, a different point).'],
  225: ['PARTIAL', '"envelops" overstates — the human range 0.33–17.12 does not reach the LLM floor of 0.0.'],
  227: ['PARTIAL', '"flat voice" is the claim\'s paraphrase; the reported tell is "the narrative voice was all over the place".'],
  235: ['PARTIAL', '"from school onward" is the claim\'s gloss; the article never says school.'],
  236: ['PARTIAL', '"likely post-training" overstates the paper\'s hedge, that testing is only "consistent with RLHF playing a role".'],
  238: ['CONTRADICTED', 'attributing both results to a single "employ literary language" prompt is wrong — the 68%→28% abstract figures come from a different prompt ("employing advanced technical language"), and the quote\'s "up to" phrasing is not on the page.'],
  244: ['PARTIAL', '"degrades toward random as LLM text distributions approach human ones" is not spelled out in the abstract now on the page, which states only an AUROC/Total-Variation theoretical framework.'],
  249: ['PARTIAL', '"not punctuation counts" is the researcher\'s own contrast; the paper never cites punctuation.'],
  253: ['PARTIAL', 'the dimensional gloss is only half supported — the paper does not single out Elaboration as a deficit and frames the gap as broad rather than concentrated.'],
};

const idxs = Object.keys(D).map(Number).sort((a, b) => a - b);
const claims = [], verdicts = [];
for (const i of idxs) {
  const row = by.get(i);
  if (!row) { console.error('MISSING ROW', i); process.exit(1); }
  const { verdict, ...claim } = row;
  claims.push(claim);
  verdicts.push({ index: i, verdict: D[i][0], trueWording: verdict.trueWording, note: verdict.note, unsupportedLimb: D[i][1] });
}
writeFileSync(SW + '/verdicts-ai-regrade-r1.json', JSON.stringify({ name: 'ai', regrade: true, claims, verdicts }, null, 1));
console.log(JSON.stringify({ downgraded: idxs.length, standing: kept.length - idxs.length, total: kept.length }));
