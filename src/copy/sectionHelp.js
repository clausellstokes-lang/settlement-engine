/**
 * copy/sectionHelp.js — THE ? PILLS' WORDS (the owner, 2026-11-02 UTC, X-42).
 *
 * The owner: "the little circle with the ? inside that one a mouse covers over it It explained
 * what the section does and what the information to glean from them is. These are not going to
 * the tabs but into the sections headers within the pages … The descriptions are only for
 * generic descriptions nothing specific to the settlement … at most 1 to 2 sentences per pill
 * … only the bare minimum of pills needed." And: "The pills need to be in simple direct
 * language … don't make it meta."
 *
 * So: one generic line per section, plain words, nothing about the page itself, nothing about
 * any one settlement, no number. tests/copy/sectionHelp.test.js holds every entry to that
 * (two sentences at most, no digit, no em dash, no word for the page or the tab) and to being
 * worn by exactly one header. A pure leaf: no imports, so an eager surface may read it.
 */

/**
 * THE VINTAGE SENTENCE the Systems Health pill carries as its second sentence (the G5
 * vintage law, X-8: the first survey is named once per page). The document's Overview
 * chapter prints the same words as its caption, so the two stay the byte-for-byte twins
 * tests/components/g5FirstSurveyPdfTwins.test.js pins.
 */
export const SYSTEMS_HEALTH_VINTAGE = 'As judged at the first survey · Food Security is re-judged as the campaign advances.';

/** @type {Readonly<Record<string, string>>} */
export const SECTION_HELP = Object.freeze({
  systemsHealth: `Safety, viability and defense, read side by side. ${SYSTEMS_HEALTH_VINTAGE}`,
  tensions: 'Who is at odds with whom, and how badly.',
  foundations: 'What is holding up and what is under strain.',
  institutions: 'Each house: what it is, who it backs, what it offers. The badge says who put it here: you, the living world, or a dependency.',
  services: 'What can be bought or hired here, and what is short.',
  supplyChains: 'What is made here and what it depends on.',
  rulers: 'Who holds power and how firmly.', // not `power`: the prose-numerics scanner reads a `.power` member as a figure
  relationships: "The settlement's ties, inside and with its neighbours.",
  npcs: 'The people worth knowing and what each one holds.',
});
