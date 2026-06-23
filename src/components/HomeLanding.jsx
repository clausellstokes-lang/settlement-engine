/**
 * HomeLanding.jsx — the marketing front door (ported from the redesign template's
 * WelcomeScreen). A full-bleed engraved-town hero with a dark scrim, the thesis,
 * and two CTAs, then three serif pillars (Forge / Canonize / Simulate) and the
 * lifecycle spine. Shown on the Home tab, where first-time visitors land;
 * returning visitors go straight to Create.
 *
 * Icons-off (text-only). Copy is the template's, which is already house voice
 * ("Not a dice roll", "A world that holds together").
 */
import { INK, PARCH_100, CARD, BORDER, BODY, serif_, sans, FS, SP, R } from './theme.js';
import Button from './primitives/Button.jsx';
import LifecycleSpine from './primitives/LifecycleSpine.jsx';
import { backgroundImageUrl } from '../config/pageBackgrounds.js';

const PILLARS = [
  { t: 'Forge', d: 'Pick an archetype and a size. In seconds you have a town with a working economy, named figures, and tensions ready for your table.' },
  { t: 'Canonize', d: 'Make a town part of your campaign. From there, every change you make becomes an event on its timeline. A history of its own.' },
  { t: 'Simulate', d: 'Drop your canon towns into the Realm and advance time. Wars ignite and resolve, faiths rise, and the chronicle writes itself.' },
];

export default function HomeLanding({ isMobile, onNavigate, onSignIn }) {
  // Full-bleed hero: cancel the <main> padding so the band spans edge to edge.
  const padH = isMobile ? SP.md : SP.xxl;
  const padTop = isMobile ? SP.md : SP.lg;
  return (
    <div>
      {/* Hero band — engraved town under a dark scrim. */}
      <div style={{
        margin: `-${padTop}px -${padH}px 0`,
        backgroundColor: INK,
        backgroundImage: `linear-gradient(rgba(27,20,8,0.58), rgba(27,20,8,0.74)), ${backgroundImageUrl('city')}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? `${SP.xxl}px ${SP.lg}px` : `${SP.xxl + SP.xl}px ${SP.xl}px`, textAlign: 'center' }}>
          {/* Hero headline steps down on mobile (FS['28']) to reclaim above-the-fold
              height on a phone; desktop stays at FS['36'] byte-identical. */}
          <h1 style={{ margin: 0, fontFamily: serif_, fontSize: isMobile ? FS['28'] : FS['36'], fontWeight: 600, color: PARCH_100, lineHeight: 1.1, maxWidth: 760, marginInline: 'auto' }}>
            Your players have a thousand choices. Now you have every answer.
          </h1>
          <p style={{ margin: `${SP.lg}px auto ${SP.xl}px`, maxWidth: 620, fontFamily: serif_, fontSize: FS.xxl, fontStyle: 'italic', color: 'rgba(244,234,208,0.85)', lineHeight: 1.6 }}>
            SettlementForge generates living towns: economies, people, tensions, and history. Then it simulates how they change. Not a dice roll. A world that holds together.
          </p>
          <div style={{ display: 'flex', gap: SP.sm, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" onClick={() => onNavigate('generate')}>Forge your first settlement</Button>
            {/* Secondary CTA on the dark scrim: lift the border opacity on mobile
                so the outline reads against the photographic hero; desktop keeps
                its lighter 0.4 border byte-identical. */}
            <Button variant="secondary" size="lg" onClick={onSignIn} style={{ background: 'rgba(251,245,230,0.1)', color: PARCH_100, borderColor: isMobile ? 'rgba(232,217,176,0.7)' : 'rgba(232,217,176,0.4)' }}>Sign in</Button>
          </div>
          <div style={{ fontFamily: sans, fontSize: FS.xs, color: 'rgba(244,234,208,0.55)', marginTop: SP.md }}>
            Free. No account needed to forge your first town.
          </div>
        </div>
      </div>

      {/* Three pillars — serif title + description, no icon boxes. */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: `${SP.xxl}px 0 ${SP.xl}px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: SP.lg }}>
          {PILLARS.map(p => (
            // Trim pillar internal padding on mobile (SP.lg) so prose keeps its
            // measure on a narrow card; desktop holds SP.xl byte-identical.
            <div key={p.t} style={{ padding: isMobile ? SP.lg : SP.xl, background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg }}>
              <h2 style={{ margin: 0, fontFamily: serif_, fontSize: FS.h1, fontWeight: 600, color: INK }}>{p.t}</h2>
              <p style={{ margin: `${SP.sm}px 0 0`, fontFamily: serif_, fontSize: FS.lg, lineHeight: 1.6, color: BODY }}>{p.d}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: SP.xl, display: 'flex', justifyContent: 'center' }}>
          <LifecycleSpine stage="canon" />
        </div>
      </div>
    </div>
  );
}
