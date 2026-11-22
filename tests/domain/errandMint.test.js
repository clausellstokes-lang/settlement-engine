/**
 * errandMint.test.js — SP-D. The generalized mint head, the six purpose classes, and the
 * declared/true split's one invariant.
 *
 * WHAT THIS FILE IS RESPONSIBLE FOR: the head in isolation — the closed vocabulary, the
 * mapping row's totality, the gate's polarity, and the exact conditions under which each
 * of the three fields is written. What survives a PERSIST is a different claim with a
 * different failure mode, and it is proven in envoyErrandSpineLifecycle.test.js.
 */
import { describe, expect, it } from 'vitest';

import {
  ENVOY_PURPOSES,
  ENVOY_PURPOSE_CLASSES,
  PURPOSE_CLASS_BY_PURPOSE,
  declaredPurposeClassOf,
  purposeClassOf,
} from '../../src/domain/worldPulse/envoyErrandVocabulary.js';
import {
  errandSpineActive,
  errandSpineFields,
  mintErrandSpine,
} from '../../src/domain/worldPulse/errandMint.js';
import { routePlan, spineWorld } from '../helpers/errandSpineFixture.js';

const PLAN_ARGS = {
  routePlan: routePlan(),
  fromId: 'ashford',
  toId: 'irontown',
  journey: 'outbound',
  notBeforeTick: 10,
};

describe('SP-D vocabulary — the six classes are closed, ordered and total', () => {
  it('names exactly the six charter classes, codepoint-ordered and frozen', () => {
    expect(ENVOY_PURPOSE_CLASSES).toEqual([
      'commercial', 'covert', 'diplomatic', 'factional', 'personal', 'religious',
    ]);
    expect([...ENVOY_PURPOSE_CLASSES].sort()).toEqual([...ENVOY_PURPOSE_CLASSES]);
    expect(Object.isFrozen(ENVOY_PURPOSE_CLASSES)).toBe(true);
  });

  it('the mapping row is DATA and it is TOTAL over the war purposes', () => {
    // The charter's sentence, executed: 'sue'/'self_parlay' -> diplomatic AS DATA. A new
    // war purpose landing without a row here resolves to NO class rather than to a guess,
    // which is what the next assertion proves.
    for (const purpose of ENVOY_PURPOSES) {
      expect(PURPOSE_CLASS_BY_PURPOSE[purpose], `${purpose} has no mapping row`)
        .toBe('diplomatic');
    }
    expect(Object.keys(PURPOSE_CLASS_BY_PURPOSE).sort()).toEqual([...ENVOY_PURPOSES].sort());
  });

  it('derives diplomatic from a war purpose with NO written class, and guesses nothing else', () => {
    expect(purposeClassOf({ purpose: 'sue' })).toBe('diplomatic');
    expect(purposeClassOf({ purpose: 'self_parlay' })).toBe('diplomatic');
    // anchored: a purpose the mapping row has never heard of is not silently diplomatic.
    expect(purposeClassOf({ purpose: 'smuggle' })).toBe('');
    expect(purposeClassOf({})).toBe('');
    // A word outside the closed vocabulary is not a class, however it was written.
    expect(purposeClassOf({ purpose: 'sue', purposeClass: 'piracy' })).toBe('diplomatic');
  });

  it('the public reader shows the FACE and never the truth', () => {
    const covert = { purpose: 'sue', purposeClass: 'covert', declaredPurpose: 'diplomatic', truePurpose: 'covert' };
    expect(purposeClassOf(covert)).toBe('covert');
    expect(declaredPurposeClassOf(covert)).toBe('diplomatic');
    // With no cover story the two readers agree — the overwhelming case.
    const honest = { purpose: 'sue' };
    expect(declaredPurposeClassOf(honest)).toBe(purposeClassOf(honest));
  });
});

describe('SP-D gate — errandSpineActive is strict, by name, dark-never-permissive', () => {
  it('opens on `=== true` and on nothing else', () => {
    expect(errandSpineActive(spineWorld({ spine: true }))).toBe(true);
    expect(errandSpineActive(spineWorld())).toBe(false);
    expect(errandSpineActive(spineWorld({ spine: false }))).toBe(false);
    for (const truthy of [1, 'true', {}, [], 'yes']) {
      expect(errandSpineActive(spineWorld({ spine: truthy })), `${String(truthy)} opened the gate`)
        .toBe(false);
    }
    expect(errandSpineActive(null)).toBe(false);
    expect(errandSpineActive({})).toBe(false);
  });
});

describe('SP-D field block — each of the three fields is conditional, and each condition is pinned', () => {
  it('writes NOTHING when the class is what the mapping row already derives', () => {
    // The drop-when-derivable rule (L4/T4). A peace embassy is diplomatic BY DATA, so the
    // word is not paid for per row.
    expect(errandSpineFields({ purpose: 'sue' })).toEqual({});
    expect(errandSpineFields({ purpose: 'sue', purposeClass: 'diplomatic' })).toEqual({});
    expect(errandSpineFields({ purpose: 'self_parlay', purposeClass: 'diplomatic' })).toEqual({});
  });

  it('writes purposeClass when the business is NOT what the purpose implies', () => {
    // ES-1 BEHAVIOUR SHIFT, RECORDED: a `covert` row now also carries a DERIVED face.
    // Before ES-1 this returned `{ purposeClass: 'covert' }` — which was a veil leak
    // waiting for its first writer, because `declaredPurposeClassOf` falls back to the
    // TRUE class when no cover is written, so the public reader would have shown a player
    // the word "covert". The shift touches EXACTLY the class nobody mints yet: every other
    // class is byte-identical, as the `commercial` line below re-measures.
    expect(errandSpineFields({ purpose: 'sue', purposeClass: 'covert' }))
      .toEqual({ purposeClass: 'covert', declaredPurpose: 'diplomatic', truePurpose: 'covert' });
    expect(errandSpineFields({ purpose: 'sue', purposeClass: 'commercial' }))
      .toEqual({ purposeClass: 'commercial' });
  });

  it('writes the declared/true PAIR only when the two really differ', () => {
    expect(errandSpineFields({
      purpose: 'sue', purposeClass: 'covert', declaredPurpose: 'diplomatic',
    })).toEqual({
      purposeClass: 'covert', declaredPurpose: 'diplomatic', truePurpose: 'covert',
    });
    // Declaring what you are is not a cover story: zero keys, zero bytes — for every
    // class EXCEPT covert, where "I am a spy" is not a face at all and the mint refuses
    // the row rather than writing one that shows the truth to the wrong audience.
    expect(errandSpineFields({
      purpose: 'sue', purposeClass: 'commercial', declaredPurpose: 'commercial',
    })).toEqual({ purposeClass: 'commercial' });
    expect(errandSpineFields({
      purpose: 'sue', purposeClass: 'covert', declaredPurpose: 'covert',
    })).toBeNull();
    expect(errandSpineFields({
      purpose: 'sue', declaredPurpose: 'diplomatic',
    })).toEqual({});
  });

  it('ES-1: a covert row with NO derivable face is refused, not written faceless', () => {
    // R-ES1-1 made loud. A free-standing covert errand — no war purpose underneath, so no
    // class its own purpose implies — cannot be given a public face, and a faceless covert
    // row is the veil leak above. It is refused HERE rather than shipped and patched at
    // whichever surface happens to read it first.
    expect(errandSpineFields({ purpose: '', purposeClass: 'covert' })).toBeNull();
    expect(errandSpineFields({ purpose: 'smuggle', purposeClass: 'covert' })).toBeNull();
    // ...and the same argument with a face supplied is accepted, so the refusal above
    // discriminates rather than rejecting every covert row.
    expect(errandSpineFields({
      purpose: '', purposeClass: 'covert', declaredPurpose: 'commercial',
    })).toEqual({
      purposeClass: 'covert', declaredPurpose: 'commercial', truePurpose: 'covert',
    });
  });

  it('REFUSES a truePurpose that disagrees with the resolved class', () => {
    // The row may not hold two answers to "what is this envoy really doing".
    expect(errandSpineFields({
      purpose: 'sue', purposeClass: 'covert', declaredPurpose: 'diplomatic', truePurpose: 'commercial',
    })).toBeNull();
    // ...and accepts the agreeing spelling, so the refusal above is discrimination and
    // not a blanket rejection of the argument.
    expect(errandSpineFields({
      purpose: 'sue', purposeClass: 'covert', declaredPurpose: 'diplomatic', truePurpose: 'covert',
    })).toEqual({
      purposeClass: 'covert', declaredPurpose: 'diplomatic', truePurpose: 'covert',
    });
  });

  it('REFUSES any word outside the closed vocabulary, in every slot', () => {
    expect(errandSpineFields({ purpose: 'sue', purposeClass: 'piracy' })).toBeNull();
    expect(errandSpineFields({ purpose: 'sue', declaredPurpose: 'piracy' })).toBeNull();
    expect(errandSpineFields({ purpose: 'sue', purposeClass: 'covert', truePurpose: 'piracy' })).toBeNull();
    // A purpose with no mapping row and no supplied class resolves to nothing at all.
    expect(errandSpineFields({ purpose: 'smuggle' })).toBeNull();
  });
});

describe('SP-D mint head — the plan is priced first, and dark ignores the spine entirely', () => {
  it('refuses an unpriceable journey identically in BOTH flag states', () => {
    const broken = { ...PLAN_ARGS, routePlan: { legs: [], expectedReturnTick: 20 } };
    for (const spine of [undefined, false, true]) {
      const out = mintErrandSpine({ worldState: spineWorld({ spine }), purpose: 'sue', ...broken });
      expect(out.ok, `spine=${String(spine)}`).toBe(false);
      expect(out.reason).toBe('invalid_route_plan');
      expect(out.plan).toBeNull();
    }
  });

  it('DARK returns an empty field block and never refuses the spine cargo', () => {
    for (const spine of [undefined, false]) {
      const out = mintErrandSpine({
        worldState: spineWorld({ spine }),
        purpose: 'sue',
        // Cargo a LIT world would refuse outright — dark does not read it at all.
        purposeClass: 'piracy',
        declaredPurpose: 'nonsense',
        truePurpose: 'also_nonsense',
        ...PLAN_ARGS,
      });
      expect(out.ok, `spine=${String(spine)}`).toBe(true);
      expect(out.fields).toEqual({});
      expect(out.reason).toBe('dark');
      expect(out.plan).toBeTruthy();
    }
  });

  it('LIT refuses that same cargo — so the dark pass-through above is dormancy, not laxity', () => {
    const out = mintErrandSpine({
      worldState: spineWorld({ spine: true }),
      purpose: 'sue',
      purposeClass: 'piracy',
      ...PLAN_ARGS,
    });
    expect(out.ok).toBe(false);
    expect(out.reason).toBe('invalid_purpose_class');
  });

  it('LIT returns the validated block beside an identical plan', () => {
    const dark = mintErrandSpine({ worldState: spineWorld(), purpose: 'sue', ...PLAN_ARGS });
    const lit = mintErrandSpine({
      worldState: spineWorld({ spine: true }),
      purpose: 'sue',
      purposeClass: 'covert',
      declaredPurpose: 'diplomatic',
      ...PLAN_ARGS,
    });
    expect(lit.reason).toBe('spine');
    expect(lit.fields).toEqual({
      purposeClass: 'covert', declaredPurpose: 'diplomatic', truePurpose: 'covert',
    });
    // The flag changes what an errand IS; it never changes how far anyone can walk.
    expect(JSON.stringify(lit.plan)).toBe(JSON.stringify(dark.plan));
  });
});
