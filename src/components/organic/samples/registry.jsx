import DossierSample from './DossierSample.jsx';
import LibrarySample from './LibrarySample.jsx';
import CompendiumSample from './CompendiumSample.jsx';
import PricingSample from './PricingSample.jsx';

/**
 * components/organic/samples/registry.jsx — the taste-veto sample SET (phase 2).
 *
 * The single enumeration of the five re-composed screens the owner vetoes: the
 * generator (tests/design/organicSamples.test.js) SSR-renders each to a byte-stable
 * fixture, and a phase-3 live harness can mount the same list. Posture is passed
 * explicitly (no matchMedia in SSR), so each fixture renders deterministically.
 *
 * The set demonstrates THE ARTIFACT/INSTRUMENT SPLIT side by side: the dossier and
 * the compendium are artifact/reference registers (in-fiction, manuscript grammar);
 * the library and pricing are instrument registers (machined, quiet). The fifth is
 * the same dossier in FIELD MODE (dim) — the mobile field-notebook art direction.
 */
export const SAMPLES = Object.freeze([
  { id: 'dossier-desk',     title: 'The settlement dossier — desk',     field: false, posture: 'desk',  register: 'artifact',   render: () => <DossierSample posture="desk" /> },
  { id: 'library-desk',     title: 'The library — desk',                field: false, posture: 'desk',  register: 'instrument', render: () => <LibrarySample posture="desk" /> },
  { id: 'compendium-desk',  title: 'Compendium · Deities — desk',       field: false, posture: 'desk',  register: 'reference',  render: () => <CompendiumSample posture="desk" /> },
  { id: 'pricing-desk',     title: 'Pricing — desk',                    field: false, posture: 'desk',  register: 'instrument', render: () => <PricingSample posture="desk" /> },
  { id: 'dossier-field',    title: 'The dossier in FIELD MODE — mobile, dim', field: true, posture: 'field', register: 'artifact', render: () => <DossierSample field posture="field" /> },
]);
