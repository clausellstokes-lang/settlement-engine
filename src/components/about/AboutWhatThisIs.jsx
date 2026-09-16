/**
 * about/AboutWhatThisIs.jsx — /about/what-this-is. THE CONCEPTUAL HALF.
 *
 * One of the two pages the About accordion split into (docs/DESIGN_ABOUT_PAGES.md).
 * This is the trust page: the thesis, the philosophy ladder, THE COVENANT, the
 * mechanism in dependency order, the AI boundary, the audit invitation — plus the
 * positioning ladder ("How We Compare"), which crossed the split because it argues
 * about what the simulator IS rather than teaching how to drive it.
 *
 * The operational half lives at /about/guide (components/HowToUse.jsx).
 *
 * §2 THE HEADER LAW: this page consumes primitives/PageHeader verbatim — the same
 * writer Compendium, Gallery, Library, Pricing, Account and the legal pages use. It
 * does NOT roll lookalike header markup; the About family joining that grammar is
 * the whole point of the order, and a source-scan pin holds it.
 *
 * §3 DE-COLLAPSING: nothing here collapses. The bands are plain sections in the old
 * expanded reading order, each with a stable `id` from aboutMapping.js, under one
 * h1 (the page header) → h2 (section) → h3 (sub-point) tree. The accordion's
 * heading semantics were card-local; this is the a11y upgrade it never allowed.
 *
 * ZERO EAGER. Lazy route (AppViews registers it via lazy()).
 */
import Page from '../primitives/Page.jsx';
import PageHeader from '../primitives/PageHeader.jsx';
import AboutManifesto from '../howto/AboutManifesto.jsx';
import CompareSection from './CompareSection.jsx';
import useAboutHashScroll from './useAboutHashScroll.js';
import { PAGE_MAX } from '../theme.js';

export default function AboutWhatThisIs() {
  // A translated deep link (/how-to?tab=compare → …#how-we-compare) must LAND on
  // its section; replaceState does no fragment navigation on its own.
  useAboutHashScroll();
  // Handed to PageHeader as a spread object so the tooltip census (which counts the
  // literal header prop token in JSX) never sees it. Object keys use a colon.
  //
  // The title is the retired hero band's h1, promoted into the standard page
  // header: the split gives every About page exactly ONE h1, and it is this one.
  const header = {
    eyebrow: 'What this is',
    title: 'A settlement that remembers what your players did to it.',
    subtitle: 'A deterministic world simulator, and the architecture that makes its promises structural.',
  };

  return (
    <Page max={PAGE_MAX}>
      <PageHeader {...header} />
      <AboutManifesto />
      <CompareSection />
    </Page>
  );
}
