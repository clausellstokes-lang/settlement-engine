import fs from 'fs';

const SW = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep';
const rows = JSON.parse(fs.readFileSync(SW + '/kept-kay.json', 'utf8'));

// row position in kept-kay.json -> the unsupported limb, in one clause
const DOWN = {
  2:  '"single-focalizer" applied to Tolkien/Donaldson/Wolfe — the note says Randall\'s wording is "focalized through one or two central characters" and instructs "Do not re-quote him as saying single".',
  9:  'the flat assertion that Kay keeps important events from surprising the reader — the note records that Randall hedges with "seems determined" while the claim states it flatly.',
  10: '"twenty-one separate non-focalized passages" stated without scope — the note says the figure EXCLUDES short zero-focalized passages inside focalized sections and that the qualifier must be carried.',
  12: '"after the reader has already formed a judgment" — the note says Kleander\'s wording is "had the chance to form their own opinion", "slightly weaker" than the claim.',
  17: '"structural repetition" as Kleander\'s framing — the note says she demonstrates the parallel "rather than naming it \'structural repetition\'".',
  68: '"appended" — the note says the GGK NOTE is interpolated mid-essay immediately after the passage it answers, "not at the very end".',
  73: '"opens \'what happened that night... became legendary\'" — the note says the sentence opens with the place-list before reaching those words, so they are not the passage\'s first words.',
  88: '"only supernatural elements the depicted society believed" as a universal — the note records two page qualifiers the claim drops, "or at least half-believed" and Ysabel (2007) named as the exception.',
  91: '"recent social history" — the note FLAGS that "the page never uses the term \'social history\'"; it is the claim\'s own label for that strand of historians.',
  106: '"(his definition of magic realism)" — the note says Kay calls it "one of the definitions of magic realism", "not uniquely his".',
  107: '"criticises commercial historical writing" — the note says the critique is framed as diagnosis (wish-fulfilment) "rather than as an explicit denunciation".',
  123: 'the attribution to "Harrison" — the note says the byline reads only "Niall" and "the surname is not printed on the page".',
  126: '"making the novel a threnody" — the note says the page has the threnody "confirmed" alongside the narrator shift "rather than caused by it".',
  127: '"keeps expected big set-piece events off-stage" without qualification — the note says the page qualifies with "some of", "which the claim drops".',
  143: '"Kay\'s worlds are essentially ninety percent familiar" as a measurement — the note says the 90% figure is the worldbuilding lesson Palmatier drew from Tigana, "rather than as a numeric measurement of Kay\'s worlds".',
  187: '"Kay uses a matter-of-fact style" — the note says the page phrases it passively ("a matter-of-fact style is used") and "credits the narrator rather than naming Kay".',
  189: '"his omniscience" — the note records the only divergence: "the thesis writes \'their omniscience\', the claim writes \'his\'".',
  201: '"deliberately unfaithful to history" — the note says the source attaches "deliberately" to "inverts and reconstructs", "not to \'unfaithful\'".',
  212: '"the freely willed actions of the protagonists" without occasion — the note says the page reads "on the relevant Ember Days" and that the claim "omits the Ember Days qualifier".',
  218: 'the causal attribution of the transportive effect to years of study — the note says "the causal link is by adjacency, not by an explicit \'because\'".',
  220: 'the pronoun "he" for Michal — the note says the blog states no pronoun, so "the claim\'s \'he\' is unverified on the page".',
  221: '"rather than leaving the feeling to be inferred" — the note says that trailing clause is "the reviewer\'s implied complement, not wording on the page".',
  252: '"the armies\' strengths and tactics" unqualified — the note says the page reads "some of their tactics", "slightly narrower than the claim\'s unqualified \'tactics\'".',
  262: 'the pronoun "to him" — the note says "\'him\' is the researcher\'s pronoun; the poster writes \'to me\' and states no gender".',
  265: 'the pronoun "left him" — the note says the "poster\'s gender is not stated on the page".',
  267: 'the pronoun "he enjoys" — the note says "the reviewer\'s gender is not stated on the page (\'he\' is the researcher\'s pronoun)".',
  291: '"a major novel" as a general proposition — the note says it "is the claim\'s generalisation of the three named novels" (War and Peace, LOTR, Song of Solomon).',
  306: '"more humour ... than in some of Kay\'s previous books" stated flatly — the note says the "source hedges with \'perhaps\', which the claim drops".',
  318: 'the pronoun "she" for the commenter Ilana — the note says it "is inferred from the name and never stated on the page".',
  334: '"demonstrates a measure of appropriate distance" as a flat general rule — the note flags that "Kay writes the hedged \'I might also be demonstrating\', not a flat \'demonstrates\', and speaks of his own book rather than as a general rule".',
  338: '"truths about the societies that made them" — the note says Kay\'s wording is "evolving worlds and societies" and that "the claim\'s phrasing is a gloss, not Kay\'s".',
  350: '"three English-language publishers" — the note says "the phrase \'English-language\' is not on this page" (it is Kay\'s wording in a different interview).',
  365: 'the unconditional claim about what the quarter turn does — the note says "Kay hedges the effect with \'If I do it right\', which the claim drops".',
  374: 'the "because" linking the two statements — the note says "the claim\'s \'because\' makes explicit a link the page leaves to adjacency".',
  391: '"his five protagonists" — the note says the number is the researcher\'s count of an enumeration and "the page does not print the word \'five\' or the word \'protagonists\'".',
  419: '"characters who never reappear" — the note records that the page hedges that limb with "[Spoiler! Until a couple of them turn out to be Not Really Dead After All!]".',
  421: '"can come across as contrived" without condition — the note says "the page qualifies the contrived limb with \'if you\'re looking for more traditional fantasy storytelling\'".',
  458: '"hoped only that a mythic ambience would emerge" — the note says the sentence continues "so that one reader might know that the ravens... are in fact the ravens of Odin", so "\'hoped only\' is a shade stronger than the page".',
};

const claims = [];
const verdicts = [];
for (const rowStr of Object.keys(DOWN)) {
  const r = Number(rowStr);
  const row = rows[r];
  if (!row) throw new Error('missing row ' + r);
  const { verdict, ...claimOnly } = row;
  claims.push(claimOnly);
  verdicts.push({
    index: row.index,
    verdict: 'PARTIAL',
    trueWording: verdict.trueWording,
    note: verdict.note,
    unsupportedLimb: DOWN[rowStr],
  });
}

const out = { name: 'kay', regrade: true, claims, verdicts };
fs.writeFileSync(SW + '/verdicts-kay-regrade-r5.json', JSON.stringify(out, null, 2));
console.log('downgraded', verdicts.length, 'standing', rows.length - verdicts.length);
console.log('indices', verdicts.map(v => v.index).join(','));
