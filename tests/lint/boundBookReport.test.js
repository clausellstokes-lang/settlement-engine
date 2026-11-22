/**
 * AE-1 report-mode contract.
 *
 * Visual debt is observable but non-fatal until its named family is promoted;
 * malformed design-law configuration is fatal immediately because it makes the
 * census incapable of proving anything.
 */
import { describe, expect, it } from 'vitest';
import {
  FINDING_CATEGORIES,
  auditBoundBook,
  formatBoundBookReport,
  parseBoundBookArgs,
} from '../../scripts/audit/bound-book-report.mjs';

const motionRow = (overrides = {}) => ({
  owner: 'time',
  durationMs: 320,
  easing: 'cubic-bezier(.2,.7,.3,1)',
  iterations: 1,
  staticComposition: 'settled',
  ...overrides,
});

function validConfig() {
  return {
    PARCHMENT_STEPS: {
      page: '#FBF5E6',
      card: '#F4EAD0',
      nested: '#E8D9B0',
    },
    MOTION: {
      none: motionRow({
        owner: 'static',
        durationMs: 0,
        easing: 'linear',
        staticComposition: 'present',
      }),
      settle: motionRow(),
      reveal: motionRow({
        durationMs: 640,
        easing: 'cubic-bezier(0.22,1,0.36,1)',
        staticComposition: 'resolved',
      }),
      scrub: motionRow({
        owner: 'scroll',
        durationMs: null,
        easing: 'linear',
        staticComposition: 'poster',
      }),
    },
    SEAM_KINDS: ['letterbox', 'feather', 'plate', 'edge'],
    SURFACE_REGISTERS: {
      chrome: { rank: 0, voiceFloor: 'ui' },
      parchment: { rank: 1, voiceFloor: 'plain' },
      manuscript: { rank: 2, voiceFloor: 'chronicle' },
      ceremonial: { rank: 3, voiceFloor: 'covenant' },
    },
    ARTWORK_SURFACE_MANIFEST: [{
      id: 'registered-art',
      ownerPath: 'src/components/RegisteredArt.jsx',
      ownerSelector: 'RegisteredArt',
      seam: 'plate',
      status: 'active',
    }],
    READER_SURFACE_MANIFEST: [{
      id: 'registered-reader',
      ownerPath: 'src/components/RegisteredReader.jsx',
      ownerSelector: 'RegisteredReader',
      surfaceRegister: 'parchment',
      motion: 'none',
      staticComposition: 'present',
      status: 'active',
    }],
  };
}

const registeredSources = [
  {
    path: 'src/components/RegisteredArt.jsx',
    text: 'export function RegisteredArt() { return <img src="/registered.jpg" />; }',
  },
  {
    path: 'src/components/RegisteredReader.jsx',
    text: 'export function RegisteredReader() { return <article>Words.</article>; }',
  },
];

const debtSource = {
  path: 'src/components/LegacySurface.jsx',
  text: [
    'export function LegacySurface() {',
    '  return <article style={{',
    '    background: CARD,',
    "    transition: 'opacity 220ms ease-out',",
    '  }}><img src="/legacy.webp" /></article>;',
    '}',
  ].join('\n'),
};

describe('Bound Book report-mode audit', () => {
  it('reports every debt family in stable category order without failing report mode', () => {
    const report = auditBoundBook({
      root: '/virtual/repo',
      config: validConfig(),
      sourceFiles: [...registeredSources, debtSource],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.exitCode).toBe(0);
    expect(report.mode).toBe('report');
    expect(Object.keys(report.findings)).toEqual(FINDING_CATEGORIES);
    expect(report.findings.unregisteredArtwork).toHaveLength(1);
    expect(report.findings.unregisteredReaderSurface).toHaveLength(1);
    expect(report.findings.legacyParchmentBackground).toHaveLength(1);
    expect(report.findings.rawMotionValue).toHaveLength(1);
    expect(report.findings.undeclaredAnimation).toHaveLength(1);
    expect(report.findings.missingStaticComposition).toHaveLength(0);
  });

  it.each([
    ['seams', 'unregisteredArtwork'],
    ['steps', 'legacyParchmentBackground'],
    ['motion', 'rawMotionValue'],
  ])('fails only after the %s debt family is explicitly enforced', (scope, category) => {
    const report = auditBoundBook({
      root: '/virtual/repo',
      config: validConfig(),
      sourceFiles: [...registeredSources, debtSource],
      enforce: [scope],
    });

    expect(report.findings[category].length).toBeGreaterThan(0);
    expect(report.totals.enforcedDebt).toBeGreaterThan(0);
    expect(report.exitCode).toBe(1);
  });

  it('keeps missing reduced-motion composition as report debt until motion enforcement', () => {
    const config = validConfig();
    config.READER_SURFACE_MANIFEST[0] = {
      ...config.READER_SURFACE_MANIFEST[0],
      motion: 'settle',
    };
    delete config.READER_SURFACE_MANIFEST[0].staticComposition;

    const observed = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: registeredSources,
    });
    const enforced = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: registeredSources,
      enforce: ['motion'],
    });

    expect(observed.configErrors).toEqual([]);
    expect(observed.findings.missingStaticComposition).toHaveLength(1);
    expect(observed.exitCode).toBe(0);
    expect(enforced.exitCode).toBe(1);
  });

  it('requires registration for each owning function, not merely each file', () => {
    const config = validConfig();
    const ownerPath = 'src/components/HostileOwners.jsx';
    config.ARTWORK_SURFACE_MANIFEST = [{
      id: 'hostile.registered-art',
      ownerPath,
      ownerSelector: 'RegisteredArt',
      seam: 'plate',
      status: 'active',
    }];
    config.READER_SURFACE_MANIFEST = [{
      id: 'hostile.registered-reader',
      ownerPath,
      ownerSelector: 'RegisteredReader',
      surfaceRegister: 'parchment',
      motion: 'none',
      staticComposition: 'present',
      status: 'active',
    }];
    const source = {
      path: ownerPath,
      text: [
        'export function RegisteredArt() { return <img src="/registered.jpg" />; }',
        'export function RogueArt() { return <img src="/rogue.jpg" />; }',
        'export function RegisteredReader() { return <article>Filed.</article>; }',
        'export function RogueReader() { return <article>Unfiled.</article>; }',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [source],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.unregisteredArtwork).toHaveLength(1);
    expect(report.findings.unregisteredArtwork[0].detail).toContain('RogueArt');
    expect(report.findings.unregisteredReaderSurface).toHaveLength(1);
    expect(report.findings.unregisteredReaderSurface[0].detail).toContain('RogueReader');
  });

  it('keeps backgroundImage ownership total when two functions share one file', () => {
    const config = validConfig();
    const ownerPath = 'src/components/BackdropOwners.jsx';
    config.ARTWORK_SURFACE_MANIFEST = [{
      id: 'backdrop.registered',
      ownerPath,
      ownerSelector: 'RegisteredBackdrop',
      seam: 'feather',
      status: 'active',
    }];
    config.READER_SURFACE_MANIFEST = [];
    const source = {
      path: ownerPath,
      text: [
        'export function RegisteredBackdrop() {',
        '  return <div style={{ backgroundImage: registeredScene }} />;',
        '}',
        'export function RogueBackdrop() {',
        '  return <div style={{ backgroundImage: `url(${rogueScene})` }} />;',
        '}',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [source],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.unregisteredArtwork).toHaveLength(1);
    expect(report.findings.unregisteredArtwork[0].detail).toContain('RogueBackdrop');
  });

  it('treats image custom properties and named background registries as artwork evidence', () => {
    const config = validConfig();
    config.ARTWORK_SURFACE_MANIFEST = [
      {
        id: 'custom-scene',
        ownerPath: 'src/components/CustomScene.jsx',
        ownerSelector: 'CustomScene',
        seam: 'feather',
      },
      {
        id: 'page-registry',
        ownerPath: 'src/config/pageBackgrounds.js',
        ownerSelector: 'PAGE_BACKGROUNDS',
        seam: 'feather',
      },
    ];
    config.READER_SURFACE_MANIFEST = [];
    const sources = [
      {
        path: 'src/components/CustomScene.jsx',
        text: "export function CustomScene() { return <div style={{ '--sf-scene': scene }} />; }",
      },
      {
        path: 'src/config/pageBackgrounds.js',
        text: "export const PAGE_BACKGROUNDS = Object.freeze({ home: 'landing' });",
      },
    ];

    const report = auditBoundBook({ root: '/virtual/repo', config, sourceFiles: sources });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.unregisteredArtwork).toEqual([]);
  });

  it('checks each JS and card-like CSS background value against the positive step allowlist', () => {
    const stepSources = [
      {
        path: 'src/components/StepFixture.jsx',
        text: [
          'export function StepFixture() {',
          '  const style = {',
          '    background: PARCHMENT_STEPS.card,',
          '    color: PARCHMENT_STEPS.nested,',
          '    backgroundColor: CARD,',
          '  };',
          "  const spoof = { background: 'PARCHMENT_STEPS.card' };",
          '  return <article style={{ ...style, ...spoof }}>Reader card.</article>;',
          '}',
        ].join('\n'),
      },
      {
        path: 'src/styles/step-fixture.css',
        text: [
          '.sf-card-good { background: var(--parchment-step-card); }',
          '.sf-card-bad { background-color: var(--legacy-card); }',
          '.sf-card-spoof { background: var(--parchment-step-card-evil); }',
          '.sf-card-gradient { background: linear-gradient(var(--parchment-step-card), var(--legacy-card)); }',
          '.panel { background: #fff; }',
        ].join('\n'),
      },
    ];
    const report = auditBoundBook({
      root: '/virtual/repo',
      config: validConfig(),
      sourceFiles: [...registeredSources, ...stepSources],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.legacyParchmentBackground).toEqual([
      expect.objectContaining({
        path: 'src/components/StepFixture.jsx',
        line: 5,
        detail: expect.stringContaining('backgroundColor'),
      }),
      expect.objectContaining({
        path: 'src/components/StepFixture.jsx',
        line: 7,
        detail: expect.stringContaining('background'),
      }),
      expect.objectContaining({
        path: 'src/styles/step-fixture.css',
        line: 2,
        detail: expect.stringContaining('background-color'),
      }),
      expect.objectContaining({
        path: 'src/styles/step-fixture.css',
        line: 3,
        detail: expect.stringContaining('background'),
      }),
      expect.objectContaining({
        path: 'src/styles/step-fixture.css',
        line: 4,
        detail: expect.stringContaining('background'),
      }),
    ]);
  });

  it('checks only reader-root styles and rejects mixed or partially approved step expressions', () => {
    const config = validConfig();
    const ownerPath = 'src/components/OwnedSteps.jsx';
    config.READER_SURFACE_MANIFEST.push({
      id: 'owned-steps',
      ownerPath,
      ownerSelector: 'OwnedSteps',
      surfaceRegister: 'parchment',
      motion: 'none',
      staticComposition: 'present',
    });
    const source = {
      path: ownerPath,
      text: [
        'const sharedStyles = {',
        '  card: {',
        '    background: PARCHMENT_STEPS.card + legacyCard,',
        '    backgroundColor: raised ? PARCHMENT_STEPS.nested : CARD,',
        '  },',
        '};',
        'export function OwnedSteps() {',
        '  return <article style={sharedStyles.card}>',
        '    <button style={{ background: CARD }}>Nested control.</button>',
        '  </article>;',
        '}',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [...registeredSources, source],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.legacyParchmentBackground.filter(
      (finding) => finding.path === ownerPath,
    ).map((finding) => finding.line)).toEqual([3, 4]);
  });

  it('does not promote nested controls or descendant CSS selectors into reader roots', () => {
    const config = validConfig();
    const ownerPath = 'src/components/NestedControl.jsx';
    config.READER_SURFACE_MANIFEST.push({
      id: 'nested-control-reader',
      ownerPath,
      ownerSelector: 'NestedControl',
      surfaceRegister: 'parchment',
      motion: 'none',
      staticComposition: 'present',
    });
    const sources = [
      ...registeredSources,
      {
        path: ownerPath,
        text: [
          'export function NestedControl() {',
          '  return <article style={{ background: PARCHMENT_STEPS.card }}>',
          '    <button className="card-action" style={{ background: CARD }}>Act.</button>',
          '  </article>;',
          '}',
        ].join('\n'),
      },
      {
        path: 'src/styles/nested-control.css',
        text: '.card-root button.card-action { background: CARD; }',
      },
    ];

    const report = auditBoundBook({ root: '/virtual/repo', config, sourceFiles: sources });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.legacyParchmentBackground.filter(
      (finding) => finding.path.includes('nested-control'),
    )).toEqual([]);
    expect(report.findings.unregisteredReaderSurface.filter(
      (finding) => finding.path.includes('nested-control'),
    )).toEqual([]);
  });

  it('resolves styles through the lexical owner chain for nested renderers', () => {
    const config = validConfig();
    const ownerPath = 'src/components/LexicalOwner.jsx';
    config.READER_SURFACE_MANIFEST.push({
      id: 'lexical-owner',
      ownerPath,
      ownerSelector: 'Nested',
      surfaceRegister: 'parchment',
      motion: 'none',
      staticComposition: 'present',
    });
    const source = {
      path: ownerPath,
      text: [
        'export function Shell() {',
        '  const style = { background: CARD };',
        '  const Nested = () => <article style={style}>Nested.</article>;',
        '  return <Nested />;',
        '}',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [...registeredSources, source],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.legacyParchmentBackground).toContainEqual(
      expect.objectContaining({ path: ownerPath, line: 2 }),
    );
  });

  it('fails closed when a manifest symbol names multiple lexical owners', () => {
    const config = validConfig();
    const ownerPath = 'src/components/AmbiguousRows.jsx';
    config.READER_SURFACE_MANIFEST.push({
      id: 'ambiguous-row',
      ownerPath,
      ownerSelector: 'Row',
      surfaceRegister: 'parchment',
      motion: 'none',
      staticComposition: 'present',
    });
    const source = {
      path: ownerPath,
      text: [
        'export function FirstShell() {',
        '  const Row = () => <article>First.</article>;',
        '  return <Row />;',
        '}',
        'export function SecondShell() {',
        '  const Row = () => <article>Second.</article>;',
        '  return <Row />;',
        '}',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [...registeredSources, source],
    });

    expect(report.configErrors).toContainEqual(expect.objectContaining({
      code: 'ambiguous-owner-symbol',
      path: 'READER_SURFACE_MANIFEST.ambiguous-row',
    }));
    expect(report.exitCode).toBe(1);
  });

  it('rejects lowercase, opaque, and mixed raw motion while accepting canonical references', () => {
    const config = validConfig();
    const ownerPath = 'src/components/MotionFixture.jsx';
    config.READER_SURFACE_MANIFEST.push({
      id: 'motion-fixture',
      ownerPath,
      ownerSelector: 'MotionFixture',
      surfaceRegister: 'parchment',
      motion: 'settle',
      staticComposition: 'settled',
    });
    const motionSource = {
      path: ownerPath,
      text: [
        'export function MotionFixture() {',
        '  const style = {',
        '    transition: `opacity ${MOTION.settle.durationMs}ms ${MOTION.settle.easing}`,',
        "    animation: 'fade var(--motion-reveal-duration) var(--motion-reveal-easing)',",
        '    transitionDelay: motion.base.duration,',
        '    transitionProperty: transitionSpec,',
        '    transitionDuration: `${MOTION.settle.durationMs}ms 9s`,',
        '    animationDuration: MOTION.bounce.durationMs,',
        '    transitionDuration: MOTION.settle.easing,',
        '  };',
        '  return <article style={style}>Resolved.</article>;',
        '}',
      ].join('\n'),
    };
    const cssSource = {
      path: 'src/styles/motion-fixture.css',
      text: [
        '.motion-panel { transition: opacity var(--oc-motion-settle) var(--oc-ease-settle); }',
        '.motion-panel { animation: fade var(--motion-reveal-duration) var(--motion-reveal-easing); }',
        '.motion-panel { transition-delay: var(--oc-motion-press) 9s; }',
        '.motion-panel { animation-duration: var(--motion-bounce-duration); }',
        '.motion-panel { animation-duration: var(--motion-settle-duration-evil); }',
        '.motion-panel { animation: pulse calc(var(--motion-settle-duration) * 2) var(--motion-settle-easing) 2; }',
      ].join('\n'),
    };
    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [...registeredSources, motionSource, cssSource],
    });
    const jsxFindings = report.findings.rawMotionValue.filter(
      (finding) => finding.path === ownerPath,
    );
    const cssFindings = report.findings.rawMotionValue.filter(
      (finding) => finding.path === cssSource.path,
    );

    expect(report.configErrors).toEqual([]);
    expect(jsxFindings.map((finding) => finding.line)).toEqual([4, 5, 7, 8, 9]);
    expect(cssFindings.map((finding) => finding.line)).toEqual([1, 3, 4, 5, 6]);
    expect(report.findings.undeclaredAnimation.find(
      (finding) => finding.path === ownerPath,
    )).toBeUndefined();
  });

  it('rejects derived motion expressions and branch-kind laundering', () => {
    const config = validConfig();
    const ownerPath = 'src/components/DerivedMotion.jsx';
    config.READER_SURFACE_MANIFEST.push({
      id: 'derived-motion',
      ownerPath,
      ownerSelector: 'DerivedMotion',
      surfaceRegister: 'parchment',
      motion: 'settle',
      staticComposition: 'settled',
    });
    const source = {
      path: ownerPath,
      text: [
        'export function DerivedMotion() {',
        '  return <article style={{',
        '    transitionDuration: MOTION.settle.durationMs + rogueDuration,',
        '    transitionTimingFunction: `${rogueEase}`,',
        '    animationDuration: reveal ? MOTION.reveal.durationMs : MOTION.settle.durationMs,',
        '    transitionDelay: late ? MOTION.settle.durationMs : MOTION.settle.durationMs,',
        '  }}>Resolved.</article>;',
        '}',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [...registeredSources, source],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.rawMotionValue.filter(
      (finding) => finding.path === ownerPath,
    ).map((finding) => finding.line)).toEqual([3, 4, 5]);
  });

  it('rejects token fields that do not exist for the selected motion kind', () => {
    const config = validConfig();
    const ownerPath = 'src/components/ScrubDuration.jsx';
    config.READER_SURFACE_MANIFEST.push({
      id: 'scrub-duration',
      ownerPath,
      ownerSelector: 'ScrubDuration',
      surfaceRegister: 'parchment',
      motion: 'scrub',
      staticComposition: 'poster',
    });
    const source = {
      path: ownerPath,
      text: [
        'export function ScrubDuration() {',
        '  return <article style={{ animationDuration: MOTION.scrub.durationMs }} />;',
        '}',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [...registeredSources, source],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.rawMotionValue).toContainEqual(
      expect.objectContaining({ path: ownerPath, line: 2 }),
    );
  });

  it('ignores non-timing motion fields and global reduced-motion suppression', () => {
    const source = {
      path: 'src/styles/reduced-motion.css',
      text: [
        '.panel { transition-property: opacity; animation-name: reveal; }',
        '@media (prefers-reduced-motion: reduce) {',
        '  .card { transition-duration: 0.001ms !important; animation: none !important; }',
        '}',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config: validConfig(),
      sourceFiles: [...registeredSources, source],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.rawMotionValue.filter(
      (finding) => finding.path === source.path,
    )).toEqual([]);
    expect(report.findings.undeclaredAnimation.filter(
      (finding) => finding.path === source.path,
    )).toEqual([]);
  });

  it('audits CSS embedded in JSX style elements against the owning component', () => {
    const config = validConfig();
    const ownerPath = 'src/components/EmbeddedStyle.jsx';
    config.READER_SURFACE_MANIFEST.push({
      id: 'embedded-style',
      ownerPath,
      ownerSelector: 'EmbeddedStyle',
      surfaceRegister: 'parchment',
      motion: 'settle',
      staticComposition: 'settled',
    });
    const source = {
      path: ownerPath,
      text: [
        'export function EmbeddedStyle() {',
        '  return <article>',
        '    <style>{`.embedded { animation: spin 9s linear infinite; }`}</style>',
        '    Filed.',
        '  </article>;',
        '}',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [...registeredSources, source],
      enforce: ['motion'],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.rawMotionValue).toContainEqual(
      expect.objectContaining({ path: ownerPath, line: 3 }),
    );
    expect(report.findings.undeclaredAnimation.find(
      (finding) => finding.path === ownerPath,
    )).toBeUndefined();
    expect(report.exitCode).toBe(1);
  });

  it('audits shared module-level style objects before consumers spread them', () => {
    const config = validConfig();
    config.ARTWORK_SURFACE_MANIFEST = [];
    config.READER_SURFACE_MANIFEST = [];
    const source = {
      path: 'src/components/theme.js',
      text: [
        'export const GOLD_TINT = Object.freeze({',
        "  animation: 'sf-goldShimmer 3.8s ease-in-out infinite',",
        '});',
      ].join('\n'),
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: [source],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.rawMotionValue).toContainEqual(
      expect.objectContaining({ path: source.path, line: 2 }),
    );
    expect(report.findings.undeclaredAnimation[0].detail).toContain('GOLD_TINT');
  });

  it('requires a surface static composition to equal its selected MOTION token', () => {
    const config = validConfig();
    config.READER_SURFACE_MANIFEST[0] = {
      ...config.READER_SURFACE_MANIFEST[0],
      motion: 'settle',
      staticComposition: 'poster',
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: registeredSources,
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.missingStaticComposition).toHaveLength(1);
    expect(report.findings.missingStaticComposition[0].detail)
      .toContain('must equal "settled"');
    expect(report.exitCode).toBe(0);
  });

  it('rejects null and non-object MOTION token rows as configuration errors', () => {
    const config = validConfig();
    config.MOTION.settle = null;
    config.MOTION.reveal = '640ms';

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: registeredSources,
    });
    const invalidPaths = report.configErrors
      .filter((error) => error.code === 'invalid-motion-token')
      .map((error) => error.path);

    expect(invalidPaths).toEqual(['MOTION.reveal', 'MOTION.settle']);
    expect(report.exitCode).toBe(1);
  });

  it('ignores motion, background, artwork, and reader prose inside comments', () => {
    const commentSources = [
      {
        path: 'src/components/CommentOnly.jsx',
        text: [
          '/* background: CARD; transition: "opacity 9s ease";',
          '   <img src="/not-an-owner.jpg" />; <article>not a reader</article> */',
          'export function CommentOnly() { return <div>Still.</div>; }',
        ].join('\n'),
      },
      {
        path: 'src/styles/comment-only.css',
        text: [
          '/* .card { background: CARD; transition: opacity 9s ease; }',
          '   .hero { background: url("/not-art.jpg"); } */',
          '.panel { color: inherit; }',
        ].join('\n'),
      },
    ];
    const report = auditBoundBook({
      root: '/virtual/repo',
      config: validConfig(),
      sourceFiles: [...registeredSources, ...commentSources],
    });
    const commentPaths = new Set(commentSources.map((source) => source.path));

    for (const category of FINDING_CATEGORIES) {
      expect(report.findings[category].filter(
        (finding) => commentPaths.has(finding.path),
      )).toEqual([]);
    }
  });

  it('treats schema, vocabulary, stale ownership, and parked-edge defects as fatal', () => {
    const config = validConfig();
    config.ARTWORK_SURFACE_MANIFEST.push(
      {
        ...config.ARTWORK_SURFACE_MANIFEST[0],
        seam: 'edge',
      },
      {
        id: 'unknown-seam',
        ownerPath: 'src/components/RegisteredArt.jsx',
        ownerSelector: 'RegisteredArt',
        seam: 'bleed',
      },
      {
        id: 'stale-owner',
        ownerPath: 'src/components/Absent.jsx',
        ownerSelector: 'Absent',
        seam: 'plate',
      },
    );
    config.READER_SURFACE_MANIFEST[0] = {
      ...config.READER_SURFACE_MANIFEST[0],
      surfaceRegister: 'operator-console',
    };

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: registeredSources,
    });
    const codes = report.configErrors.map((error) => error.code);

    expect(codes).toEqual(expect.arrayContaining([
      'duplicate-id',
      'parked-edge-use',
      'stale-owner-path',
      'unknown-register',
      'unknown-seam',
    ]));
    expect(report.totals.enforcedDebt).toBe(0);
    expect(report.exitCode).toBe(1);
  });

  it('fails closed when executable source cannot be parsed while skipping declarations', () => {
    const sources = [
      ...registeredSources,
      { path: 'src/components/Broken.jsx', text: 'export function Broken( {' },
      { path: 'src/components/Typed.ts', text: 'export const value: number = 1;' },
      { path: 'src/vite-env.d.ts', text: 'declare const __BUILD__: string;' },
    ];

    const report = auditBoundBook({
      root: '/virtual/repo',
      config: validConfig(),
      sourceFiles: sources,
    });

    expect(report.configErrors.filter((error) => error.code === 'source-parse-failed')
      .map((error) => error.path)).toEqual([
      'src/components/Broken.jsx',
      'src/components/Typed.ts',
    ]);
    expect(report.exitCode).toBe(1);
  });

  it('fails closed when a manifest names a symbol but not a detected surface', () => {
    const config = validConfig();
    config.ARTWORK_SURFACE_MANIFEST = [{
      id: 'inert-art',
      ownerPath: 'src/components/InertArt.jsx',
      ownerSelector: 'InertArt',
      seam: 'plate',
    }];
    config.READER_SURFACE_MANIFEST = [{
      id: 'inert-reader',
      ownerPath: 'src/components/InertReader.jsx',
      ownerSelector: 'InertReader',
      surfaceRegister: 'parchment',
      motion: 'none',
      staticComposition: 'present',
    }];
    const sources = [
      {
        path: 'src/components/InertArt.jsx',
        text: 'export function InertArt() { return <div>There is no artwork.</div>; }',
      },
      {
        path: 'src/components/InertReader.jsx',
        text: 'export function InertReader() { return <div>There is no card.</div>; }',
      },
    ];

    const report = auditBoundBook({ root: '/virtual/repo', config, sourceFiles: sources });

    expect(report.configErrors.filter((error) => error.code === 'stale-manifest-surface')
      .map((error) => error.path)).toEqual([
      'ARTWORK_SURFACE_MANIFEST.inert-art',
      'READER_SURFACE_MANIFEST.inert-reader',
    ]);
    expect(report.exitCode).toBe(1);
  });

  it('does not classify token-routed declared motion as raw or undeclared', () => {
    const config = validConfig();
    config.READER_SURFACE_MANIFEST[0] = {
      ...config.READER_SURFACE_MANIFEST[0],
      motion: 'settle',
      staticComposition: 'settled',
    };
    const sources = registeredSources.map((source) => (
      source.path.endsWith('RegisteredReader.jsx')
        ? {
          ...source,
          text: [
            'export function RegisteredReader() {',
            '  return <article style={{',
            '    transition: `opacity ${MOTION.settle.durationMs}ms ${MOTION.settle.easing}`,',
            '  }}>Words.</article>;',
            '}',
          ].join('\n'),
        }
        : source
    ));

    const report = auditBoundBook({
      root: '/virtual/repo',
      config,
      sourceFiles: sources,
      enforce: ['motion'],
    });

    expect(report.configErrors).toEqual([]);
    expect(report.findings.rawMotionValue).toEqual([]);
    expect(report.findings.undeclaredAnimation).toEqual([]);
    expect(report.exitCode).toBe(0);
  });

  it('sorts files and output deterministically rather than trusting traversal order', () => {
    const forward = auditBoundBook({
      root: '/virtual/repo',
      config: validConfig(),
      sourceFiles: [...registeredSources, debtSource],
    });
    const reverse = auditBoundBook({
      root: '/virtual/repo',
      config: validConfig(),
      sourceFiles: [debtSource, ...registeredSources].reverse(),
    });

    expect(reverse).toEqual(forward);
    expect(formatBoundBookReport(reverse)).toBe(formatBoundBookReport(forward));
  });

  it('parses one or several named enforcement scopes and rejects unknown ones', () => {
    expect(parseBoundBookArgs(['--enforce=motion,seams', '--enforce', 'steps']).enforce)
      .toEqual(['motion', 'seams', 'steps']);

    const report = auditBoundBook({
      root: '/virtual/repo',
      config: validConfig(),
      sourceFiles: registeredSources,
      enforce: ['weather'],
    });
    expect(report.configErrors.map((error) => error.code))
      .toContain('unknown-enforcement-scope');
    expect(report.exitCode).toBe(1);
  });
});
