/**
 * howto/aboutSchematics.jsx — the About page's two house-drawn schematics.
 *
 * Art law (THE DOCUMENTATION WAVE §5): the engraving register — ink line at 2–3
 * weights, hatching as tone, flat scarce gold, the medieval schematic tradition
 * (rota / da-Vinci annotation) for system diagrams. NO age-damage (no stains, no
 * sepia, no burnt edges). These are the ONE static whole-loop schematic (hero) and
 * the tick diagram that precedes the mechanism text — both legible at rest, no
 * animation, no interaction. Pure SVG; colors from the theme so the ink is the app's
 * own ink. Decorative — aria-hidden, with a prose caption carrying the meaning.
 */

import { GOLD, INK, SECOND as SEC, BORDER as BOR, serif_, sans } from '../theme.js';

// The five stations of the loop. Engine derives the dossier; the dossier draws the
// maps; the AI narrates from (never writes) that state; play feeds new constraints
// back to the engine — the return arc is the whole point.
const LOOP = ['Engine', 'Dossier', 'Maps', 'AI', 'Play'];

/**
 * The whole-loop schematic — engine → dossier → maps → AI → play, and play back to
 * engine. One flowing engraved line, five plate-labelled stations, gold only on the
 * return arc (the loop closing is the idea worth the one precious accent).
 */
export function WholeLoopSchematic() {
  const W = 720;
  const H = 200;
  const cy = 96;
  const n = LOOP.length;
  const m = 70; // horizontal margin
  const step = (W - 2 * m) / (n - 1);
  const xs = LOOP.map((_, i) => m + i * step);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="The loop: the engine derives the dossier, the dossier draws the maps, the AI narrates from that state, play feeds new constraints back to the engine."
      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}>
      {/* the spine — medium ink weight */}
      <line x1={xs[0]} y1={cy} x2={xs[n - 1]} y2={cy} stroke={INK} strokeWidth="1.5" />
      {/* the return arc — the loop closing, the one gold accent */}
      <path d={`M ${xs[n - 1]} ${cy} C ${xs[n - 1] + 30} ${cy + 64}, ${xs[0] - 30} ${cy + 64}, ${xs[0]} ${cy}`}
        fill="none" stroke={GOLD} strokeWidth="1.5" strokeDasharray="1 5" strokeLinecap="round" />
      <text x={(xs[0] + xs[n - 1]) / 2} y={cy + 74} textAnchor="middle"
        fontFamily={sans} fontSize="11" fill={SEC} fontStyle="italic">
        play sets the next constraints
      </text>
      {LOOP.map((label, i) => (
        <g key={label}>
          {/* forward arrow-heads between stations (fine ink) */}
          {i < n - 1 && (
            <path d={`M ${xs[i] + 26} ${cy - 4} L ${xs[i] + 34} ${cy} L ${xs[i] + 26} ${cy + 4}`}
              fill="none" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
          )}
          {/* the station: an engraved disc + plate label */}
          <circle cx={xs[i]} cy={cy} r="21" fill="#FFFDF8" stroke={INK} strokeWidth="1.5" />
          <circle cx={xs[i]} cy={cy} r="16" fill="none" stroke={BOR} strokeWidth="0.75" />
          <text x={xs[i]} y={cy - 34} textAnchor="middle"
            fontFamily={serif_} fontSize="14" fontWeight="600" fill={INK}>{label}</text>
          <text x={xs[i]} y={cy + 5} textAnchor="middle"
            fontFamily={serif_} fontSize="13" fontWeight="700" fill={GOLD}>{i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

/**
 * The tick diagram — the medieval schematic idiom (inputs feeding a central works,
 * outputting to a ledger). Placed BEFORE the mechanism prose (Ciechanowski: the
 * figure precedes its text). Your constraints go in; one deterministic tick resolves
 * them; every change lands in the ledger with its receipt. No wall-clock, no re-roll.
 */
export function TickDiagram() {
  const W = 720;
  const H = 230;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img"
      aria-label="One deterministic tick: your constraints feed a single kernel; every change lands in the ledger with its receipt; the same seed always yields the same result."
      style={{ maxWidth: '100%', height: 'auto', display: 'block' }}>
      {/* inputs (left) */}
      <text x="86" y="40" textAnchor="middle" fontFamily={sans} fontSize="11" fill={SEC}
        letterSpacing="0.08em" style={{ textTransform: 'uppercase' }}>inputs</text>
      {['seed', 'constraints', 'prior state'].map((t, i) => (
        <g key={t}>
          <rect x="20" y={60 + i * 46} width="132" height="34" rx="4"
            fill="#FFFDF8" stroke={INK} strokeWidth="1.25" />
          <text x="86" y={82 + i * 46} textAnchor="middle" fontFamily={serif_} fontSize="13" fill={INK}>{t}</text>
          <line x1="152" y1={77 + i * 46} x2="270" y2="115" stroke={INK} strokeWidth="1" />
        </g>
      ))}
      {/* the works (centre) — a rota */}
      <circle cx="360" cy="115" r="58" fill="#FFFDF8" stroke={INK} strokeWidth="1.75" />
      <circle cx="360" cy="115" r="46" fill="none" stroke={BOR} strokeWidth="0.75" />
      <circle cx="360" cy="115" r="30" fill="none" stroke={GOLD} strokeWidth="1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const r1 = 30; const r2 = 46;
        const rad = (deg * Math.PI) / 180;
        return (
          <line key={deg} x1={360 + r1 * Math.cos(rad)} y1={115 + r1 * Math.sin(rad)}
            x2={360 + r2 * Math.cos(rad)} y2={115 + r2 * Math.sin(rad)} stroke={INK} strokeWidth="0.75" />
        );
      })}
      <text x="360" y="110" textAnchor="middle" fontFamily={serif_} fontSize="13" fontWeight="600" fill={INK}>one</text>
      <text x="360" y="126" textAnchor="middle" fontFamily={serif_} fontSize="13" fontWeight="600" fill={INK}>tick</text>
      {/* output → ledger (right) */}
      <line x1="418" y1="115" x2="540" y2="115" stroke={INK} strokeWidth="1.25" />
      <path d="M 532 111 L 540 115 L 532 119" fill="none" stroke={INK} strokeWidth="1.2"
        strokeLinejoin="round" strokeLinecap="round" />
      <text x="612" y="40" textAnchor="middle" fontFamily={sans} fontSize="11" fill={SEC}
        letterSpacing="0.08em" style={{ textTransform: 'uppercase' }}>the ledger</text>
      <rect x="548" y="66" width="150" height="98" rx="4" fill="#FFFDF8" stroke={INK} strokeWidth="1.5" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <line x1="562" y1={86 + i * 20} x2="574" y2={86 + i * 20} stroke={GOLD} strokeWidth="1.5" />
          <line x1="582" y1={86 + i * 20} x2="684" y2={86 + i * 20} stroke={BOR} strokeWidth="1" />
        </g>
      ))}
      <text x="623" y="182" textAnchor="middle" fontFamily={sans} fontSize="11" fill={SEC} fontStyle="italic">
        every change, its receipt
      </text>
    </svg>
  );
}
