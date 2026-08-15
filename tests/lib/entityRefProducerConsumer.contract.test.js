/**
 * tests/lib/entityRefProducerConsumer.contract.test.js — the seam guard for
 * finding code-quality-1 (the entity-ref half-merge).
 *
 * The narrative edge function is the PRODUCER: it injects ⟦entity:id|name⟧ tokens
 * into refined prose via wrapEntityRefsInProse. If a PRODUCER ships with no
 * CONSUMER, those tokens leak into dossiers as literal ⟦entity:…⟧ garbage — which
 * is exactly the state this branch was in (the tokenizer + server producer landed
 * but the renderers did not).
 *
 * INVARIANT: producer present ⇒ consumer present. If the edge source references
 * wrapEntityRefsInProse, some src component must import the tokenizer
 * (entityRefTokenizer) so the tokens are rendered, not leaked. This test also pins
 * the four raw prose sites to their renderer so a future edit can't silently drop
 * the wiring back to raw {prose}.
 *
 * LINK PATH (wired at master-merge W5): the consumer architecture from master
 * commit 6d95adc7 (EntityLink / EntityRef / DossierEntityContext provider /
 * useDossierEntityNav / focusEntity) is now connected — a `ref` segment renders
 * a clickable in-dossier link that resolves against the live entity index and
 * degrades to plain text when the id is gone or no provider is mounted. The
 * degrade path is retained AS the fallback, so both guarantees hold: tokens are
 * never leaked (the original invariant) AND resolved refs become links (the
 * link-path invariant, asserted in the second describe block below).
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const read = (rel) => (existsSync(resolve(process.cwd(), rel)) ? readFileSync(resolve(process.cwd(), rel), 'utf-8') : '');

const EDGE = read('supabase/functions/generate-narrative/index.ts');
const producerLive = /wrapEntityRefsInProse/.test(EDGE);

describe('entity-ref producer ⇒ consumer', () => {
  it('the edge function still wraps entity refs (producer is live)', () => {
    // If this ever goes false the producer was removed; the consumer assertions
    // below then no longer apply, but flag it so the change is deliberate.
    expect(EDGE.length).toBeGreaterThan(0);
    expect(producerLive).toBe(true);
  });

  it('a src consumer imports the tokenizer (tokens are rendered, not leaked)', () => {
    if (!producerLive) return;
    const consumers = [
      'src/components/ProseParagraph.jsx',
      'src/pdf/primitives/ProseText.jsx',
    ].filter(rel => /entityRefTokenizer/.test(read(rel)));
    expect(
      consumers.length,
      'Producer wrapEntityRefsInProse is live but no src renderer imports entityRefTokenizer — '
        + 'the ⟦entity:…⟧ tokens would leak as literal text.',
    ).toBeGreaterThan(0);
  });

  it('the web renderer tokenizes prose', () => {
    expect(read('src/components/ProseParagraph.jsx')).toMatch(/tokenizeProse/);
  });

  it('the PDF renderer tokenizes prose', () => {
    expect(read('src/pdf/primitives/ProseText.jsx')).toMatch(/tokenizeProse/);
  });

  it('the four raw prose sites are wired to a renderer (no raw {prose} leak)', () => {
    // thesis + per-tab note
    expect(read('src/components/dossier/DossierNarrativeBanner.jsx')).toMatch(/ProseParagraph/);
    // NPC goal.short
    expect(read('src/components/new/npcComponents.jsx')).toMatch(/ProseParagraph/);
    // PDF Overview thesis
    expect(read('src/pdf/sections/Overview.jsx')).toMatch(/proseToPlainText|ProseText/);
  });
});

describe('entity-ref link path (wired W5) — ref segments render clickable links', () => {
  it('the web renderer upgrades ref segments to <EntityLink>', () => {
    const src = read('src/components/ProseParagraph.jsx');
    expect(src, 'ProseParagraph must import EntityLink').toMatch(/import\s+EntityLink\s+from\s+['"].*primitives\/EntityLink\.jsx['"]/);
    // A ref segment renders EntityLink; a text segment stays a <span>.
    expect(src).toMatch(/type === 'ref'/);
    expect(src).toMatch(/<EntityLink/);
  });

  it('the PDF renderer upgrades ref segments to <EntityRef>', () => {
    const src = read('src/pdf/primitives/ProseText.jsx');
    expect(src, 'ProseText must import EntityRef').toMatch(/import\s+\{\s*EntityRef\s*\}\s+from\s+['"]\.\/EntityRef\.jsx['"]/);
    expect(src).toMatch(/<EntityRef/);
    // The plain-string helper is retained for the byte-identical golden path.
    expect(src).toMatch(/export function proseToPlainText/);
  });

  it('OutputContainer hoists the DossierEntityContext provider once', () => {
    const src = read('src/components/OutputContainer.jsx');
    expect(src).toMatch(/import\s+\{\s*DossierEntityContext\s*\}/);
    expect(src).toMatch(/useDossierEntityNav\(/);
    expect(src).toMatch(/<DossierEntityContext\.Provider\b/);
  });

  it('the store defines the navigator focus action (focusEntity)', () => {
    const src = read('src/store/uiSlice.js');
    expect(src).toMatch(/focusEntity:/);
    expect(src).toMatch(/focusedEntity:/);
  });

  it('the PDF view-model builds the entity index the EntityRef sections resolve against', () => {
    const src = read('src/pdf/lib/viewModel.js');
    expect(src).toMatch(/entityIndex:\s*buildDossierEntityIndex\(/);
  });
});

describe('pronoun-link path (the contract extension) — verbatim render is wired', () => {
  it('the tokenizer recognises pronoun tokens and marks them verbatim', () => {
    const src = read('src/lib/entityRefTokenizer.js');
    expect(src).toMatch(/PRONOUN_REF_PATTERN/);
    expect(src).toMatch(/verbatim/);
  });

  it('the web renderer forwards seg.verbatim to EntityLink', () => {
    const src = read('src/components/ProseParagraph.jsx');
    expect(src).toMatch(/verbatim=\{seg\.verbatim\}/);
  });

  it('EntityLink shows the wrapped word (not the current name) for a verbatim link', () => {
    const src = read('src/components/primitives/EntityLink.jsx');
    expect(src).toMatch(/verbatim\s*\?\s*fallback/);
  });

  it('the PDF renderer forwards seg.verbatim to EntityRef', () => {
    const src = read('src/pdf/primitives/ProseText.jsx');
    expect(src).toMatch(/verbatim=\{seg\.verbatim\}/);
  });

  it('EntityRef shows the wrapped word (not the current name) for a verbatim link', () => {
    const src = read('src/pdf/primitives/EntityRef.jsx');
    expect(src).toMatch(/verbatim\s*\?\s*fallback/);
  });

  it('the server wrapper resolves + validates the clerk\'s pronoun anchors', () => {
    const src = read('supabase/functions/generate-narrative/entityRefWrapper.ts');
    expect(src).toMatch(/normalizePronounTokens/);
    // fail-open: an unknown anchor unwraps to the bare word (the display group).
    expect(src).toMatch(/collectPronounResolver/);
  });
});
