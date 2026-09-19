/**
 * guidanceOrigin.walker.test.js — THE PAGE OF ORIGIN, AS MACHINERY (owner order, ODQ
 * §934.29: "if you leave that page where it happens, then the pop up does not follow you
 * to the next page; if you return to that page, then it will come back until you dismiss
 * it").
 *
 * ── THE CLASS ──────────────────────────────────────────────────────────────────
 * A hint is born of a MOMENT, and a moment happens on a PAGE. Nothing in the guidance
 * layer used to record which page, so scoping was an ACCIDENT OF MOUNT POINT: a host
 * rendered inside a page component happened to be page-scoped, and a host rendered in the
 * App shell happened not to be. PostGenCoach was the second kind — mounted in src/App.jsx
 * beside the sync banners, self-gating on nothing but "a settlement exists" — so one
 * generation left a fixed card floating over the Library, the Gallery, the Compendium,
 * the account page and every legal page until it was dismissed.
 *
 * Curing that one mount would have left the class alive: the NEXT whisper host mounted in
 * the shell would do the same thing, and nothing would say so. So the page is DECLARED
 * (`origin` on every whisper), the eligibility check is FAIL-CLOSED on it, and this walker
 * holds both properties.
 *
 * ── THE ARMS ───────────────────────────────────────────────────────────────────
 *   (a) TOTALITY — every whisper declares a non-empty, frozen origin, and every route in
 *       it is one of GUIDANCE_ORIGINS.
 *   (b) ANCHORED TO THE ROUTE TABLE — every GUIDANCE_ORIGINS entry is a real `view` in
 *       src/lib/routes.js, so a renamed route reds here instead of silently orphaning a
 *       whisper onto a page that no longer exists.
 *   (c) FAIL-CLOSED — a whisper with no origin, an empty origin, or a context carrying no
 *       route is eligible NOWHERE. Run as executed controls over planted whisper shapes
 *       AND over the real registry, because "shows nothing" is the safe answer and
 *       "shows everywhere" is the defect.
 *   (d) THE SCOPING IS REAL — for every registered whisper, a maximally permissive context
 *       is eligible on its own origin and NOT on a foreign route. This is the arm that
 *       reds if the route check is deleted from isWhisperEligible.
 *   (e) NO UNSCOPED HOST IN THE SHELL — a host that does not ASK the registry which page
 *       it is on may not be mounted by the app shell, because then nothing scopes it. A
 *       host that DOES ask (it passes a `route` into a selection call) may be, and
 *       PostGenCoach now is: that is the cure, not an exemption.
 *   (f) THE PAGE BUDGET — one unbidden whisper per page, never a stack; summoned whispers
 *       (the reader clicked "?") are deliberately outside it.
 *
 * @enforced-by itself (the executed controls below prove the detector both ways)
 */

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  GUIDANCE_WHISPERS,
  GUIDANCE_ORIGINS,
  isWhisperEligible,
  isWhisperOnRoute,
  whispersForRoute,
  selectPageWhisper,
  registeredComponents,
} from '../../src/domain/display/guidanceRegistry.js';
import { ROUTES } from '../../src/lib/routes.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

/** The app shell: the two modules that render before any page component does. */
const SHELL_FILES = ['src/App.jsx', 'src/AppViews.jsx'];

/** Component names the shell mounts as JSX, e.g. `<PostGenCoach` / `<PostGenCoach/>`. */
function componentsMountedBy(source) {
  return [...source.matchAll(/<([A-Z][A-Za-z0-9_]*)[\s/>]/g)].map((m) => m[1]);
}

/** The whole shell's mount set, as one list. */
const SHELL_MOUNTS = SHELL_FILES.flatMap((rel) => componentsMountedBy(read(rel)));

/** Does this host ASK which page it is on? (a `route` reaching a selection call). */
const SELECTION = /selectPageWhisper|selectWhisper|isWhisperEligible/;
function hostAsksTheRoute(componentName) {
  const rel = HOST_PATHS[componentName];
  if (!rel) return false;
  const src = read(rel);
  return SELECTION.test(src) && /\broute\b/.test(src);
}

/** Registered host → its file. Named rather than discovered, so a moved host reds. */
const HOST_PATHS = {
  FirstDossierCallouts: 'src/components/dossier/FirstDossierCallouts.jsx',
  PostGenCoach: 'src/components/PostGenCoach.jsx',
  WelcomeBackCard: 'src/components/home/WelcomeBackCard.jsx',
  HelpPopover: 'src/components/compendium/HelpPopover.jsx',
  SampleDashboard: 'src/components/settlements/SampleDashboard.jsx',
  GalleryList: 'src/components/gallery/GalleryList.jsx',
  CampaignEmptyState: 'src/components/map/CampaignEmptyState.jsx',
  RealmVerbComposer: 'src/components/map/RealmVerbComposer.jsx',
  RealmDocket: 'src/components/map/RealmDocket.jsx',
};

/** A context that says yes to everything EXCEPT the route — so only the route is measured. */
const permissive = (route) => ({
  route,
  isDismissed: () => false,
  firstAvailable: () => true,
  isNewborn: true,
  data: {
    tier: 'free', savedCount: 0, hasSettlement: true, isReturn: true, hasLastSettlement: true,
  },
});

// ── (a) TOTALITY ────────────────────────────────────────────────────────────────

describe('the origin law — every whisper declares the page its moment happened on', () => {
  it('the registry is non-trivial (guard the guard)', () => {
    expect(GUIDANCE_WHISPERS.length).toBeGreaterThanOrEqual(15);
    expect(GUIDANCE_ORIGINS.length).toBeGreaterThanOrEqual(5);
  });

  it('every whisper carries a NON-EMPTY, frozen origin', () => {
    const offenders = GUIDANCE_WHISPERS
      .filter((w) => !Array.isArray(w.origin) || w.origin.length === 0 || !Object.isFrozen(w.origin))
      .map((w) => w.id);
    expect(
      offenders,
      '\nWhisper(s) with no declared page of origin (ODQ §934.29). A hint that belongs to no'
      + ' page belongs to every page, which is the defect this law exists against. Declare'
      + ' `origin: [<route view id>]` — the page whose moment opened the hint:\n'
      + `  ${offenders.join('\n  ')}\n`,
    ).toEqual([]);
  });

  it('every declared origin is a known guidance origin', () => {
    const unknown = [];
    for (const w of GUIDANCE_WHISPERS) {
      for (const route of w.origin) {
        if (!GUIDANCE_ORIGINS.includes(route)) unknown.push(`${w.id} → ${route}`);
      }
    }
    expect(unknown, 'origins outside GUIDANCE_ORIGINS — add the route there, deliberately').toEqual([]);
  });

  it('every GUIDANCE_ORIGINS entry is a real route view in src/lib/routes.js', () => {
    const views = new Set(ROUTES.map((r) => r.view));
    const orphans = GUIDANCE_ORIGINS.filter((o) => !views.has(o));
    expect(
      orphans,
      'guidance origin(s) naming no route. A renamed route must red HERE rather than'
      + ' silently stranding every whisper that declared the old name:',
    ).toEqual([]);
    // anchored: `views` is asserted non-trivial so an empty ROUTES table cannot make the
    // orphan list empty by drift.
    expect(views.size).toBeGreaterThan(20);
  });
});

// ── (c) FAIL-CLOSED ─────────────────────────────────────────────────────────────

describe('fail-closed — no route, no page, no whisper (executed controls)', () => {
  const planted = (origin) => ({
    id: 'planted', surface: 'dossier', lane: 'reader', register: 'plain',
    trigger: {}, priority: 1, newbornOnly: false, body: 'x', budgetClass: 'wayfinding',
    component: 'Planted', origin,
  });

  it('a whisper with NO origin key is eligible nowhere', () => {
    expect(isWhisperEligible(planted(undefined), permissive('generate'))).toBe(false);
    expect(isWhisperOnRoute(planted(undefined), 'generate')).toBe(false);
  });

  it('a whisper with an EMPTY origin is eligible nowhere', () => {
    expect(isWhisperEligible(planted([]), permissive('generate'))).toBe(false);
  });

  it('a planted whisper WITH an origin is eligible there — so the arms above are not vacuous', () => {
    expect(isWhisperEligible(planted(['generate']), permissive('generate'))).toBe(true);
    expect(isWhisperEligible(planted(['generate']), permissive('gallery'))).toBe(false);
  });

  it('a context carrying NO route makes every REAL whisper ineligible', () => {
    const routeless = { ...permissive('generate'), route: undefined };
    const leaked = GUIDANCE_WHISPERS.filter((w) => isWhisperEligible(w, routeless)).map((w) => w.id);
    expect(
      leaked,
      'a host that never says which page it is on must show NOTHING, never everything —'
      + ' that inversion is the whole of ODQ §934.29:',
    ).toEqual([]);
  });
});

// ── (d) THE SCOPING IS REAL ─────────────────────────────────────────────────────

describe('leave and it goes, return and it comes back', () => {
  it('every whisper is eligible on its own origin and NOT on a foreign route', () => {
    const problems = [];
    for (const w of GUIDANCE_WHISPERS) {
      const home = w.origin[0];
      if (!isWhisperEligible(w, permissive(home))) {
        problems.push(`${w.id}: not eligible on its OWN page (${home}) under a permissive context`);
      }
      const foreign = GUIDANCE_ORIGINS.find((o) => !w.origin.includes(o));
      // Every whisper claims fewer pages than exist, so a foreign route always resolves.
      expect(foreign, `${w.id} claims every origin — it is unscoped in all but name`).toBeTruthy();
      if (isWhisperEligible(w, permissive(foreign))) {
        problems.push(`${w.id}: FOLLOWED the reader to ${foreign}, which is not its page`);
      }
    }
    expect(problems).toEqual([]);
  });

  it('whispersForRoute never returns a whisper that does not claim the route', () => {
    for (const route of GUIDANCE_ORIGINS) {
      const listed = whispersForRoute(route);
      for (const w of listed) expect(w.origin, `${w.id} on ${route}`).toContain(route);
    }
    // anchored: /create really does carry whispers, so the loop above is not walking
    // empty lists and calling that agreement.
    expect(whispersForRoute('generate').length).toBeGreaterThan(0);
  });

  it('the wizard-postgen coach is on /create and nowhere else (the order\'s own case)', () => {
    const ids = (route) => whispersForRoute(route).map((w) => w.id);
    expect(ids('generate')).toContain('wizard_next_steps');
    for (const elsewhere of ['settlements', 'gallery', 'home', 'realm']) {
      expectAbsentWithAnchor(
        ids(elsewhere),
        'wizard_next_steps',
        whispersForRoute(elsewhere)[0]?.id,
        `the post-generate coach must not follow the reader to ${elsewhere}`,
      );
    }
  });
});

// ── (e) NO UNSCOPED HOST IN THE SHELL ───────────────────────────────────────────

describe('the shell mounts no host that cannot say which page it is on', () => {
  it('every registered host has a named file (guard the guard)', () => {
    const unnamed = registeredComponents().filter((c) => !HOST_PATHS[c]);
    expect(unnamed, 'a registered host moved or was added — name its file in HOST_PATHS').toEqual([]);
  });

  it('the shell-mount scan is live', () => {
    // If this scanner stopped finding anything, every exclusion below would go vacuous.
    expect(SHELL_MOUNTS.length).toBeGreaterThan(10);
    expect(SHELL_MOUNTS).toContain('PostGenCoach');
  });

  it('a host that does NOT ask the route is never mounted by the shell', () => {
    for (const component of registeredComponents()) {
      if (hostAsksTheRoute(component)) continue;
      expectAbsentWithAnchor(
        SHELL_MOUNTS,
        component,
        'PostGenCoach',
        `${component} evaluates no route, so only its page mount scopes it — the shell may not mount it`,
      );
    }
  });

  it('the hosts that DO ask are exactly the two that evaluate eligibility', () => {
    const asking = registeredComponents().filter(hostAsksTheRoute).sort();
    expect(
      asking,
      'a host began (or stopped) evaluating registry eligibility. One that evaluates MUST'
      + ' pass a route, or it is the PostGenCoach defect again under a new name.',
    ).toEqual(['FirstDossierCallouts', 'PostGenCoach']);
  });

  it('the detector discriminates (executed control)', () => {
    expect(componentsMountedBy('<Suspense><Foo /><Bar x={1} /></Suspense>')).toEqual(['Suspense', 'Foo', 'Bar']);
    expect(componentsMountedBy('const foo = <div />; // <NotMounted')).toEqual([]);
  });
});

// ── (f) THE PAGE BUDGET ─────────────────────────────────────────────────────────

describe('one hint at a time per page, by priority, never stacked', () => {
  it('/create has 2+ simultaneously-eligible unbidden whispers, and shows exactly ONE', () => {
    const ctx = permissive('generate');
    const eligible = whispersForRoute('generate')
      .filter((w) => !w.summoned && isWhisperEligible(w, ctx));
    expect(eligible.length, 'the budget would be untested if only one could ever qualify')
      .toBeGreaterThanOrEqual(2);
    const picked = selectPageWhisper('generate', ctx);
    expect(picked).not.toBeNull();
    expect(picked.priority).toBe(Math.max(...eligible.map((w) => w.priority)));
    expect(Array.isArray(picked)).toBe(false);
  });

  it('the loser waits for the winner to be CLOSED, rather than never appearing', () => {
    const ctx = permissive('generate');
    const first = selectPageWhisper('generate', ctx);
    const second = selectPageWhisper('generate', { ...ctx, isDismissed: (id) => id === first.id });
    expect(second).not.toBeNull();
    expect(second.id).not.toBe(first.id);
    expect(second.priority).toBeLessThan(first.priority);
  });

  it('a SUMMONED whisper is outside the budget (the reader asked for it out loud)', () => {
    const summoned = GUIDANCE_WHISPERS.filter((w) => w.summoned);
    expect(summoned.length, 'the config "?" hints are the summoned class').toBeGreaterThanOrEqual(6);
    const budgeted = [];
    for (const route of GUIDANCE_ORIGINS) {
      const picked = selectPageWhisper(route, permissive(route));
      if (picked?.summoned) budgeted.push(`${route} → ${picked.id}`);
    }
    expect(
      budgeted,
      'a summoned whisper won a page budget it is not in — a "?" the reader clicked would'
      + ' then be swallowed by whatever teaching band outranked it',
    ).toEqual([]);
  });

  it('selectPageWhisper is fail-closed on the route too', () => {
    expect(selectPageWhisper(undefined, permissive('generate'))).toBeNull();
    expect(selectPageWhisper('', permissive('generate'))).toBeNull();
    // anchored: the same call with a real route returns a whisper, so the nulls above
    // measure the route gate and not an empty registry.
    expect(selectPageWhisper('generate', permissive('generate'))).not.toBeNull();
  });
});
