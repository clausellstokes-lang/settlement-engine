import fs from 'node:fs';

const SW = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep';
const kept = JSON.parse(fs.readFileSync(`${SW}/kept-leguin.json`, 'utf8'));

// index -> { limb, trueWordingOverride? }
const down = {
  4: { limb: "\"the touchstones of failure\" applied to all four markers — the verifier's note says the essay calls only ichor a touchstone ('the infallible touchstone of the seventh-rate: Ichor'); the thee/thou verbs, the subjunctive and 'mayhap' are catalogued as novice traps and are not called touchstones." },
  16: { limb: "the flat assertion that the narration assumes the reader knows Earthsea's geography and history — the page says 'often appears to assume', a hedge the claim drops." },
  25: { limb: "the generalisation that the myths precede the chapters — the page hedges with 'Many of the tales used in the novel immediately precede chapters', not all of them." },
  27: {
    limb: "the free-indirect-discourse limb as a fact about The Tombs of Atuan — the verifier's note says the page attributes free indirect discourse to the Earthsea trilogy generally, not to Tombs specifically.",
    trueWording: "making the narrator seem sympathetic to the characters (Cadden 2005 p.92) — said of the Earthsea trilogy generally, not of The Tombs of Atuan specifically."
  },
  40: {
    limb: "the unhedged Narnia comparison — the verifier FLAGGED that the claim drops SFE's 'perhaps'; the source qualifies the comparison ('perhaps more maturely thoughtful').",
    trueWording: "A grave joyfulness pervades the trilogy, which is perhaps more maturely thoughtful (while remaining exciting) than the comparable Narnia series of C S Lewis."
  },
  42: { limb: "'the motifs are the story' stated flatly, and stated of the Earthsea/Le Guin work at large — the note records that SFE hedges with 'it might almost be said' and says this of the first three Hainish novels as the 'typical Le Guin strategy'." },
  46: { limb: "the yin/yang-structure-of-recurrence reading attributed to Kelso — the note says that reading is Kelso relaying Kathy Keating's I Ching reading, not Kelso's own." },
  47: { limb: "the flat 'Le Guin moves toward simplicity or austerity' — the note records that the source hedges with 'does seem to move'." },
  52: { limb: "the flat 'Tehanu shows' — the note records that the source says Tehanu 'can show' the skill of experience." },
  75: { limb: "'infers from read-aloud ease' — the note records that the page's verb is 'observes'; the inference relation is the verifier's reconstruction from surrounding argument, not the page's own move." },
  78: { limb: "'sound effects are subtle' stated absolutely — the note records that the claim drops 'usually' from the page's 'usually subtle and always irregular'." },
  84: { limb: "'peer-reviewed' — the note states this is not a Crossref field; it is inferred from the journal-article record, not attested by the evidence fetched." },
  93: { limb: "'everything in it [the vocabulary] is direct, concrete and simple' — the note records that the page's 'everything is direct, concrete, and simple' reads on Tolkien's writing in that sentence's sweep, not strictly on items in the vocabulary." },
  98: { limb: "'whether or not the writer intends it' — the note records that the page says 'whether the speaker or the author knows it or not'; the source's axis is knowledge, not intention (the claim's wording is entailed, not stated)." },
  108: { limb: "'unlike those of poetry' — the note records that the difference from poetry is conceded by the page's 'though' clause ('This is just as true of prose as it is of poetry, though...'), not asserted about poetry outright." },
  118: { limb: "'concludes from the read-aloud quality' — the note records that the page's verb is 'observes' and that the inference is supplied by surrounding context, not by any explicit inference marker on the page." },
  139: { limb: "PLACEHOLDER — not used" },
  154: { limb: "'shows stress-counting alone cannot indicate the quality of prose' — the note records that the page hedges as 'a good indication that merely counting stresses is not going to give us any SOLID indications'." },
  157: { limb: "'Austen the longest' as something Le Guin's counts show — the verifier flagged that her own per-passage counts give Darwin 1 sentence in 77 words against Austen's 1 in 72, so within the 100-syllable window Darwin's single sentence is the longer; the page asserts the factoid, the counts do not support it." },
  183: { limb: "'a workshop blogger' — the note records that the source's author (William May) is a reader working the Steering the Craft exercises, not a workshop leader." },
  214: { limb: "'names coherence as the touchstone of plausibility' stated flatly — the note records that Le Guin hedges with 'probably', which the claim drops." },
  226: { limb: "'carries over into writing prose' stated flatly — the note records that Le Guin hedges with 'may' ('And so may the poet's desire…')." },
  254: { limb: "the attached quote field — the note states that 'the proper beauty and power of prose' belongs to a different, later sentence and 'does not by itself evidence the claim'; the citation must be re-pointed to the trueWording sentence (and the passage is in chapter 2, not chapter 3 as the page field says)." },
  295: { limb: "'appendix' — the verifier flagged the wording: Horton calls it 'the final section' and never 'appendix'." },
  317: { limb: "'the conflict is administrative' attributed to Ramsay — the note states 'administrative' is the claim's gloss, not Ramsay's word (her framing is 'the realistic and mundane')." },
  320: { limb: "'Ramsay quotes Le Guin describing the villagers as sullen and silent in the large, soft rain of April' — the note records that only 'large, soft rain of April' is marked (in <em>) as wording lifted from Le Guin; 'sullen and silent' sits in roman type as Ramsay's own, so the quoted-from-Le Guin span is narrower than the claim implies." },
  362: { limb: "'identifies the most famous sentence' stated flatly, and 'four-word' — the note records that Vest hedges with 'Perhaps Left Hand's most famous sentence' and that 'four-word' is the verifier's own count, not the page's wording." }
};
delete down[139];

const idx = Object.keys(down).map(Number).sort((a, b) => a - b);
const claims = [];
const verdicts = [];
for (const i of idx) {
  const row = kept[String(i)];
  if (!row) throw new Error(`missing row ${i}`);
  const { verdict: v, ...claim } = row;
  claims.push(claim);
  verdicts.push({
    index: i,
    verdict: 'PARTIAL',
    trueWording: down[i].trueWording ?? (v.trueWording || ''),
    note: v.note || '',
    unsupportedLimb: down[i].limb
  });
}

const out = { name: 'leguin', regrade: true, claims, verdicts };
fs.writeFileSync(`${SW}/verdicts-leguin-regrade-r4.json`, JSON.stringify(out, null, 1));
console.log('downgraded', verdicts.length, 'of', Object.keys(kept).length, '| standing', Object.keys(kept).length - verdicts.length);
console.log('indices:', idx.join(','));
