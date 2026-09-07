import fs from 'fs';
const DIR = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/sweep';
const kept = JSON.parse(fs.readFileSync(DIR + '/kept-ai.json', 'utf8'));
const byIdx = new Map(kept.map(x => [x.index, x]));

// critic findings supplied by the chair (used verbatim as the note)
const criticNote = {
  93: 'Completeness critic: the sensory-detail limb is supported only indirectly — PARTIAL.',
  100: "Completeness critic: the trueWordings come from Makin's PARODY passage written in the AI voice to demonstrate the tells, not from Makin's own analysis — PARTIAL on the attribution limb.",
  101: "Completeness critic: the trueWordings come from Makin's PARODY passage written in the AI voice to demonstrate the tells, not from Makin's own analysis — PARTIAL on the attribution limb.",
  140: 'Completeness critic: the quote sits in the deep-POV section and is not the source\'s support for the claim — PARTIAL (a quote splice, the rule applied to [102]).',
  141: 'Completeness critic: the POV limb is attributed by Vollmer to Charlie Guo, not observed by him — PARTIAL (the rule applied to [94] and [95]).',
  188: "Completeness critic: 'high school essay vibes' is Vollmer quoting a third party (AI for Lifelong Learners) — PARTIAL on attribution.",
  196: 'Completeness critic: fix the attribution per the critic — the quoted line is not the commenter\'s own observation.',
  231: "Completeness critic: GPTZero's page attributes the quoted concession to 'AI writing tools' — an LLM self-description reported by the vendor, not the vendor's finding — PARTIAL.",
};

// [index, verdict, unsupportedLimb]
const rows = [
  // ---- PARTIAL: a limb of the claim is not supported by the verifier's own note ----
  [6, 'PARTIAL', "the 'temporal complexity' framing — the verifier records that the three cited percentages are intertextuality/fourth-wall features, not temporal ones"],
  [93, 'PARTIAL', 'the concrete-sensory-detail limb, supported only indirectly (via a worked deep-POV rewrite) rather than by a stated rule'],
  [100, 'PARTIAL', "the attribution limb — the wording is from Makin's parody passage written in the AI voice, not his own analysis"],
  [101, 'PARTIAL', "the attribution limb — the wording is from Makin's parody passage written in the AI voice, not his own analysis"],
  [140, 'PARTIAL', "the quote's anchoring — it sits in the deep-POV section and is not the source's support for the em-dash claim"],
  [141, 'PARTIAL', 'the POV-lock limb, which Vollmer attributes to Charlie Guo rather than observing himself'],
  [174, 'PARTIAL', "the 'pivotal moment' phrase, which the verifier records is not contiguous on the page (only slash-variants appear)"],
  [188, 'PARTIAL', "the attribution limb — 'high school essay vibes' is Vollmer quoting AI for Lifelong Learners, not his own coinage"],
  [189, 'PARTIAL', "the attribution to Neil Clarke — the verifier records the three bullets as the guide's own, not Clarke's words"],
  [196, 'PARTIAL', 'the attribution limb — the quoted line comes from the AI-generated sample fic, not the commenter\'s own observation'],
  [218, 'PARTIAL', "the book's June 2025 publication date and its Kindle Unlimited membership, which the verifier records the page never states"],
  [222, 'PARTIAL', "the 'signature mark' limb — the page calls Dickinson 'the patron saint of the em dash' rather than saying it was her signature mark"],
  [231, 'PARTIAL', "the attribution limb — the page attributes the quoted concession to 'AI writing tools', so it is an LLM self-description relayed by the vendor, not the vendor's own finding"],
  [234, 'PARTIAL', "the quote's anchoring — the verifier records it sits on the convergence point rather than on either half of the claim it is attached to"],
  [263, 'PARTIAL', "the 'rather than saying less' limb, which the verifier records is not stated on the page and is only inferred from inventing"],
  [265, 'PARTIAL', 'the promotional-language-mixed-into-facts limb, which the page states only as a feared hypothetical rather than an observation'],
  [296, 'PARTIAL', "the 'rather than because the record has three' contrast, which the verifier records the page never phrases"],
  [297, 'PARTIAL', "the unqualified 'abnormally high rate' — the page's baseline is nonprofessional human writing, and its own maintenance box says the sign seems less common in current LLM output"],
  [345, 'PARTIAL', "the 'had nothing to draw on' limb, which overstates the paper's 'minimal external knowledge'"],
  [354, 'PARTIAL', "the attribution limb — the sentence is the paper's related-work framing attributed to Kreminski and Martens (2022), not a result of the cited paper"],
  [355, 'PARTIAL', "the attribution limb — the page attributes the finding to Anderson et al. (2024) and Begus (2023), not to the cited paper"],
  [361, 'PARTIAL', "the 'raised suspense ratings ~40%' limb — the verifier records the 40% as a human comparative win-rate, not a rating scale"],
  [384, 'PARTIAL', 'the overly-positive-endings and across-sessions limbs, which the paper reports as findings of cited studies (Taveekitworachai et al. 2023) rather than its own'],
  [389, 'PARTIAL', "the 'two core mechanics' limb — the article's two mechanics are the action roll and Helping, and both cited violations are action-roll rules (Helping is never shown violated)"],
  [404, 'PARTIAL', "the flat assertion — both source statements are hedged ('as far as I can tell', 'apparently') while the claim states them flatly"],
  [406, 'PARTIAL', "the 'every NPC in the same template' limb, which the verifier records holds within a key rather than across the whole transcript (and the block format was dictated by the prompter)"],
  [412, 'PARTIAL', "the 'far more' intensifier, which the verifier records as an overstatement of the page's 'more'"],
  [432, 'PARTIAL', "the 'FY2023 report' label, which the verifier records is inferred from the March 2024 dateline rather than printed on the page"],
  [479, 'PARTIAL', "the plural 'writers' for the dominant-powers framing, which the verifier records is participant FV's alone"],
  [489, 'PARTIAL', "the quote's anchoring — 'Indians lose cultural nuance' comes from the introduction's cultural-gaze sentence, not from the passage carrying the 63.5%/59.4% figures"],
  [498, 'PARTIAL', "the sonnet-bundling limb (stated for GPT-3.5 only) and the causal 'because the model does not stop', which the paper hedges as 'we think this tendency more likely suggests'"],
  [549, 'PARTIAL', "the generalisation to any differing 'perplexity profile' — the paper names a higher perplexity level specifically (and the quote is in the PDF body, not at the cited abs URL)"],
  [615, 'PARTIAL', "the 'leaves plot, character and structure unmeasured' limb, which overstates the page's hedge 'might not be accurately reflected' (and the brief was a 200-450 word excerpt, not only a 450-word ceiling)"],
  [637, 'PARTIAL', "the two dropped hedges — Chiang writes 'I doubt you could' rather than 'you could not', and 'help to determine' rather than 'determine'"],
  [690, 'PARTIAL', "the 'rather than any structural role' limb, which the verifier records is not phrased that way on the page and is only entailed"],

  // ---- VERIFIED_SUBSTANCE: the [13] standard — the quote was found in a PDF, ar5iv or full-text
  // render rather than at the cited URL, so VERBATIM cannot stand ----
  [77, 'VERIFIED_SUBSTANCE', "verbatim-at-the-cited-URL — the ACL landing page holds only the abstract; the quote is in the authoritative PDF (aclanthology.org/2023.findings-emnlp.151.pdf)"],
  [79, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the /abs/ page shows only the abstract; the quote is in the ar5iv full text of arXiv 2209.14958, §5.3.1'],
  [80, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the ar5iv full text of arXiv 2209.14958, §5.5.3, not on the cited /abs/ page'],
  [81, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the ar5iv full text of arXiv 2209.14958, §5.5.4; the abs page has the abstract only'],
  [117, 'VERIFIED_SUBSTANCE', "verbatim-at-the-cited-URL — the quote is the §4.1 heading of arxiv.org/html/2604.03136v6, not on the cited /abs/ page, whose abstract reads 'AI stories over-explain themes'"],
  [132, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the full text of arXiv 2604.03136 rather than the abstract at the cited /abs/ page'],
  [237, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the cited /abs/2304.02819 page carries only the abstract; the quote lives in the full text at arxiv.org/html/2304.02819v3'],
  [504, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is the Figure 6 caption of the arXiv PDF (p.5), not on the cited /abs/2212.12672 page'],
  [505, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §4 of the full text of arXiv 2212.12672, not on the cited /abs/ page'],
  [506, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §4 of the full text of arXiv 2212.12672, not on the cited /abs/ page'],
  [507, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §5 of the full text of arXiv 2212.12672, not on the cited /abs/ page'],
  [508, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §4 of the full text of arXiv 2212.12672, not on the cited /abs/ page'],
  [511, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §1 of the ACL PDF (2020.acl-main.164.pdf); the landing page carries only the abstract'],
  [512, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the body of the ACL PDF (2020.acl-main.164.pdf); the landing page carries only the abstract'],
  [513, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §8 of the ACL PDF (2020.acl-main.164.pdf); the landing page carries only the abstract'],
  [514, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the body of the ACL PDF (2020.acl-main.164.pdf); the landing page carries only the abstract'],
  [515, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the body of the ACL PDF (2020.acl-main.164.pdf); the landing page carries only the abstract'],
  [517, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §4 of the ACL PDF (2020.acl-main.463.pdf); the landing page carries only the abstract'],
  [518, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the body of the ACL PDF (2020.acl-main.463.pdf); the landing page carries only the abstract'],
  [519, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §6.1 of the ACL PDF (2020.acl-main.463.pdf); the landing page carries only the abstract'],
  [520, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §2 of the ACL PDF (2020.acl-main.463.pdf); the landing page carries only the abstract'],
  [521, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — dl.acm.org returns 403 and its landing page carries only the abstract; the quote is in the publisher PDF, §6.1'],
  [522, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §6.1 of the FAccT publisher PDF, not at the cited DOI landing page'],
  [523, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §6.1 of the FAccT publisher PDF, not at the cited DOI landing page'],
  [524, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §4.1 of the FAccT publisher PDF (reached via mirror), not at the cited DOI landing page'],
  [525, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §4.2 of the FAccT publisher PDF (reached via mirror), not at the cited DOI landing page'],
  [526, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §4.1 of the FAccT publisher PDF (reached via mirror), not at the cited DOI landing page'],
  [527, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §6 of the FAccT publisher PDF (reached via mirror), not at the cited DOI landing page'],
  [528, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — ScienceDirect returned 403; the quote was verified in the author-manuscript PDF at arXiv 2005.09980, a different document from the cited DOI'],
  [529, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §4.2.1 of the author-manuscript PDF (arXiv 2005.09980), not at the cited ScienceDirect DOI'],
  [530, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the Study 1 discussion of the author-manuscript PDF (arXiv 2005.09980), not at the cited ScienceDirect DOI'],
  [532, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in §5.4 of the author-manuscript PDF (arXiv 2005.09980), not at the cited ScienceDirect DOI'],
  [533, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — ScienceDirect returned 403; the quote was verified in the accepted-manuscript PDF at osf.io/download/8p9wu_v4/'],
  [534, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in Study 3 of the accepted-manuscript PDF (osf.io/download/8p9wu_v4/), not at the cited DOI'],
  [535, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the discussion of the accepted-manuscript PDF (osf.io/download/8p9wu_v4/), not at the cited DOI'],
  [536, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the discussion of the accepted-manuscript PDF (osf.io/download/8p9wu_v4/), not at the cited DOI'],
  [537, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the discussion of the accepted-manuscript PDF (osf.io/download/8p9wu_v4/), not at the cited DOI'],
  [543, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote was confirmed in the raw arXiv PDF and ar5iv full text; index 13\'s sibling verification records that the cited /abs/2304.02819 page carries the abstract only'],
  [545, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the raw arXiv PDF body (Fig. 2a discussion), not on the cited /abs/2304.02819 page'],
  [546, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — arXiv HTML 404s; the quote is in the raw arXiv PDF text, not on the cited /abs/2403.19148 page'],
  [547, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the Discussion and Conclusion of the arXiv PDF, not on the cited /abs/2403.19148 page'],
  [548, 'VERIFIED_SUBSTANCE', 'verbatim-at-the-cited-URL — the quote is in the Discussion of the arXiv PDF, not on the cited /abs/2403.19148 page'],
];

const claims = [];
const verdicts = [];
const missing = [];
for (const [index, verdict, limb] of rows) {
  const row = byIdx.get(index);
  if (!row) { missing.push(index); continue; }
  const { verdict: _v, ...claimOnly } = row;
  claims.push(row); // full row exactly as in kept-ai.json, including its index
  verdicts.push({
    index,
    verdict,
    trueWording: (row.verdict && row.verdict.trueWording) || '',
    note: criticNote[index] || (row.verdict && row.verdict.note) || '',
    unsupportedLimb: limb,
  });
}
if (missing.length) console.error('MISSING from kept-ai.json:', missing.join(','));

const out = { name: 'ai', regrade: true, claims, verdicts };
fs.writeFileSync(DIR + '/verdicts-ai-regrade-r5.json', JSON.stringify(out, null, 2));
console.log('downgraded', verdicts.length, 'of', kept.length, '| standing', kept.length - verdicts.length);
const c = {};
verdicts.forEach(v => { c[v.verdict] = (c[v.verdict] || 0) + 1; });
console.log(JSON.stringify(c));
