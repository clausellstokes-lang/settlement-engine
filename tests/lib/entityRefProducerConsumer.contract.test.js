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
 * NOTE (recorded divergence): the renderers here degrade entity tokens to their
 * plain display NAME rather than clickable links — the EntityLink/EntityRef
 * consumer architecture from master commit 6d95adc7 never landed on this lineage.
 * See src/components/ProseParagraph.jsx for the full rationale. This guard cares
 * only that the tokens are CONSUMED (not leaked); upgrading the degrade path to
 * real links is a separate, later port.
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
